/**
 * fileStore.js
 * Session-scoped blob URL store for uploaded manuscript files.
 * Keys: `${publicationId}_v${version}` → blob URL
 */

const store = new Map();

export function storeFile(pubId, version, file) {
  const key = `${pubId}_v${version}`;
  // Revoke any previous URL for this slot to free memory
  const prev = store.get(key);
  if (prev) URL.revokeObjectURL(prev);
  const url = URL.createObjectURL(file);
  store.set(key, url);
  return url;
}

export function getFileUrl(pubId, version) {
  return store.get(`${pubId}_v${version}`);
}

/**
 * Download a manuscript file.
 * If the real blob is available (uploaded this session) → download it.
 * Otherwise → generate a small placeholder PDF so the button is never dead.
 */
export function downloadFile(pubId, version, fileName) {
  const blobUrl = store.get(`${pubId}_v${version}`);

  if (blobUrl) {
    triggerAnchorDownload(blobUrl, fileName);
    return;
  }

  // Fallback: generate a minimal PDF placeholder
  const pdfContent = buildPlaceholderPdf(pubId, fileName);
  const blob = new Blob([pdfContent], { type: 'application/pdf' });
  const url = URL.createObjectURL(blob);
  triggerAnchorDownload(url, fileName.endsWith('.pdf') ? fileName : fileName + '.pdf');
  setTimeout(() => URL.revokeObjectURL(url), 10000);
}

function triggerAnchorDownload(url, fileName) {
  const a = document.createElement('a');
  a.href = url;
  a.download = fileName;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
}

/** Minimal valid PDF so the browser actually downloads a file */
function buildPlaceholderPdf(pubId, fileName) {
  const date = new Date().toLocaleDateString('en-IN');
  const safe = (s) => s.replace(/[()\\]/g, ' ');
  const body = `SNS Research Publication Management System\r\nDocument: ${safe(fileName)}\r\nPublication ID: ${safe(pubId)}\r\nDate: ${date}\r\n\r\nThis is a placeholder document. The original manuscript was submitted through the RPMS portal.`;

  const stream = encodeStream(body);
  return `%PDF-1.4
1 0 obj<</Type/Catalog/Pages 2 0 R>>endobj
2 0 obj<</Type/Pages/Kids[3 0 R]/Count 1>>endobj
3 0 obj<</Type/Page/MediaBox[0 0 612 792]/Parent 2 0 R/Contents 4 0 R/Resources<</Font<</F1 5 0 R>>>>>>endobj
4 0 obj<</Length ${stream.length}>>
stream
${stream}
endstream
endobj
5 0 obj<</Type/Font/Subtype/Type1/BaseFont/Helvetica>>endobj
xref
0 6
0000000000 65535 f 
0000000009 00000 n 
0000000058 00000 n 
0000000115 00000 n 
0000000266 00000 n 
0000000${(366 + stream.length).toString().padStart(9, '0')} 00000 n 
trailer<</Size 6/Root 1 0 R>>
startxref
${420 + stream.length}
%%EOF`;
}

function encodeStream(text) {
  const lines = text.split('\r\n');
  let y = 750;
  let out = 'BT /F1 11 Tf ';
  for (const line of lines) {
    out += `1 0 0 1 50 ${y} Tm (${line.replace(/[()\\]/g, ' ')}) Tj `;
    y -= 18;
  }
  out += 'ET';
  return out;
}
