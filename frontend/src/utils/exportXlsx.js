/**
 * Minimal zero-dependency XLSX exporter.
 * Produces a valid .xlsx (Office Open XML) file from an array of plain objects.
 *
 * Usage:
 *   exportToXlsx(rows, 'MyFile.xlsx', 'Sheet1');
 *
 * @param {Record<string, string|number>[]} rows  - Array of flat objects (all keys become headers)
 * @param {string} filename                       - Output filename (should end in .xlsx)
 * @param {string} [sheetName='Sheet1']           - Name of the worksheet tab
 */
export function exportToXlsx(rows, filename = 'export.xlsx', sheetName = 'Sheet1') {
  if (!rows || rows.length === 0) return;

  const headers = Object.keys(rows[0]);

  // ── 1. Build the worksheet XML ────────────────────────────────────────────
  const escXml = (v) =>
    String(v ?? '')
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&apos;');

  const colLetter = (idx) => {
    // Converts 0-based index to Excel column letters: 0→A, 25→Z, 26→AA …
    let s = '';
    let n = idx + 1;
    while (n > 0) {
      const rem = (n - 1) % 26;
      s = String.fromCharCode(65 + rem) + s;
      n = Math.floor((n - 1) / 26);
    }
    return s;
  };

  const cellRef = (col, row) => `${colLetter(col)}${row}`;

  let sheetData = '';
  // Headers
  sheetData += `<row r="1">`;
  headers.forEach((h, c) => {
    sheetData += `<c r="${cellRef(c, 1)}" t="inlineStr"><is><t>${escXml(h)}</t></is></c>`;
  });
  sheetData += `</row>`;

  // Rows
  rows.forEach((row, r) => {
    sheetData += `<row r="${r + 2}">`;
    headers.forEach((h, c) => {
      const val = row[h];
      const isNum = typeof val === 'number' && !isNaN(val);
      if (isNum) {
        sheetData += `<c r="${cellRef(c, r + 2)}"><v>${val}</v></c>`;
      } else {
        sheetData += `<c r="${cellRef(c, r + 2)}" t="inlineStr"><is><t>${escXml(val)}</t></is></c>`;
      }
    });
    sheetData += `</row>`;
  });

  const sheetXml = `<?xml version="1.0" encoding="UTF-8" standalone="yes"?>
<worksheet xmlns="http://schemas.openxmlformats.org/spreadsheetml/2006/main">
<sheetData>${sheetData}</sheetData>
</worksheet>`;

  // ── 2. Build other required XML parts ─────────────────────────────────────
  const relsXml = `<?xml version="1.0" encoding="UTF-8" standalone="yes"?>
<Relationships xmlns="http://schemas.openxmlformats.org/package/2006/relationships">
<Relationship Id="rId1" Type="http://schemas.openxmlformats.org/officeDocument/2006/relationships/officeDocument" Target="xl/workbook.xml"/>
</Relationships>`;

  const workbookXml = `<?xml version="1.0" encoding="UTF-8" standalone="yes"?>
<workbook xmlns="http://schemas.openxmlformats.org/spreadsheetml/2006/main" xmlns:r="http://schemas.openxmlformats.org/officeDocument/2006/relationships">
<sheets><sheet name="${escXml(sheetName)}" sheetId="1" r:id="rId1"/></sheets>
</workbook>`;

  const workbookRelsXml = `<?xml version="1.0" encoding="UTF-8" standalone="yes"?>
<Relationships xmlns="http://schemas.openxmlformats.org/package/2006/relationships">
<Relationship Id="rId1" Type="http://schemas.openxmlformats.org/officeDocument/2006/relationships/worksheet" Target="worksheets/sheet1.xml"/>
</Relationships>`;

  const contentTypesXml = `<?xml version="1.0" encoding="UTF-8" standalone="yes"?>
<Types xmlns="http://schemas.openxmlformats.org/package/2006/content-types">
<Default Extension="rels" ContentType="application/vnd.openxmlformats-package.relationships+xml"/>
<Default Extension="xml" ContentType="application/xml"/>
<Override PartName="/xl/workbook.xml" ContentType="application/vnd.openxmlformats-officedocument.spreadsheetml.sheet.main+xml"/>
<Override PartName="/xl/worksheets/sheet1.xml" ContentType="application/vnd.openxmlformats-officedocument.spreadsheetml.worksheet+xml"/>
</Types>`;

  // ── 3. Assemble the uncompressed ZIP archive ──────────────────────────────
  const files = {
    '[Content_Types].xml': contentTypesXml,
    '_rels/.rels': relsXml,
    'xl/workbook.xml': workbookXml,
    'xl/_rels/workbook.xml.rels': workbookRelsXml,
    'xl/worksheets/sheet1.xml': sheetXml
  };

  const encoder = new TextEncoder();
  let zipData = new Uint8Array(0);
  const cdRecords = [];
  let offset = 0;

  // CRC32 table & function
  const crc32Table = new Uint32Array(256);
  for (let i = 0; i < 256; i++) {
    let c = i;
    for (let j = 0; j < 8; j++) {
      c = ((c & 1) ? (0xEDB88320 ^ (c >>> 1)) : (c >>> 1));
    }
    crc32Table[i] = c;
  }
  const crc32 = (arr) => {
    let crc = 0xFFFFFFFF;
    for (let i = 0; i < arr.length; i++) {
      crc = crc32Table[(crc ^ arr[i]) & 0xFF] ^ (crc >>> 8);
    }
    return (crc ^ 0xFFFFFFFF) >>> 0;
  };

  for (const [name, content] of Object.entries(files)) {
    const nameBuf = encoder.encode(name);
    const contentBuf = encoder.encode(content);
    const crc = crc32(contentBuf);
    const size = contentBuf.length;

    // Local file header
    const lfh = new Uint8Array(30 + nameBuf.length);
    const dv = new DataView(lfh.buffer);
    dv.setUint32(0, 0x04034b50, true);
    dv.setUint16(4, 20, true);
    dv.setUint16(6, 0, true);
    dv.setUint16(8, 0, true); // no compression
    dv.setUint32(14, crc, true);
    dv.setUint32(18, size, true);
    dv.setUint32(22, size, true);
    dv.setUint16(26, nameBuf.length, true);
    lfh.set(nameBuf, 30);

    const fileRecord = new Uint8Array(lfh.length + size);
    fileRecord.set(lfh);
    fileRecord.set(contentBuf, lfh.length);

    const oldZip = zipData;
    zipData = new Uint8Array(oldZip.length + fileRecord.length);
    zipData.set(oldZip);
    zipData.set(fileRecord, oldZip.length);

    // Central directory file header
    const cdfh = new Uint8Array(46 + nameBuf.length);
    const cdv = new DataView(cdfh.buffer);
    cdv.setUint32(0, 0x02014b50, true);
    cdv.setUint16(4, 20, true);
    cdv.setUint16(6, 20, true);
    cdv.setUint16(8, 0, true);
    cdv.setUint16(10, 0, true); // no compression
    cdv.setUint32(16, crc, true);
    cdv.setUint32(20, size, true);
    cdv.setUint32(24, size, true);
    cdv.setUint16(28, nameBuf.length, true);
    cdv.setUint32(42, offset, true);
    cdfh.set(nameBuf, 46);

    cdRecords.push(cdfh);
    offset += fileRecord.length;
  }

  let cdSize = 0;
  for (const rec of cdRecords) cdSize += rec.length;
  const cdData = new Uint8Array(cdSize);
  let pos = 0;
  for (const rec of cdRecords) {
    cdData.set(rec, pos);
    pos += rec.length;
  }

  const eocd = new Uint8Array(22);
  const edv = new DataView(eocd.buffer);
  edv.setUint32(0, 0x06054b50, true);
  edv.setUint16(8, cdRecords.length, true);
  edv.setUint16(10, cdRecords.length, true);
  edv.setUint32(12, cdSize, true);
  edv.setUint32(16, offset, true);

  const finalZip = new Uint8Array(zipData.length + cdData.length + eocd.length);
  finalZip.set(zipData);
  finalZip.set(cdData, zipData.length);
  finalZip.set(eocd, zipData.length + cdData.length);

  // ── 4. Trigger Download ───────────────────────────────────────────────────
  const blob = new Blob([finalZip], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}
