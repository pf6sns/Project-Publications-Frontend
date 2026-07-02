/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { usePublicationCategory } from '../../hooks/usePublicationCategory';
import { useUploadManuscript } from '../../hooks/useUploadManuscript';
import { usePayment } from '../../hooks/usePayment';
import { useInvoice } from '../../hooks/useInvoice';

import { PublicationCategoryGrid } from '../../components/publication/PublicationCategoryGrid';
import { PublicationCategoryModal } from '../../components/publication/PublicationCategoryModal';
import { PublicationUploadForm } from '../../components/publication/PublicationUploadForm';
import { PaymentSummary } from '../../components/publication/PaymentSummary';
import { InvoiceReceipt } from '../../components/publication/InvoiceReceipt';

export const UploadPage = ({ currentUser, onSuccess }) => {
  const isAdmin = currentUser.role === 'Admin';

  const {
    categories,
    loading: categoriesLoading,
    error: categoriesError,
    addCategory,
    updateCategory,
    deleteCategory
  } = usePublicationCategory();

  const {
    step,
    selectedCategory,
    publicationDetails,
    nextStep,
    prevStep,
    goToStep,
    selectCategory,
    updatePublicationDetails,
    resetFlow
  } = useUploadManuscript();

  const {
    loading: paymentLoading,
    error: paymentError,
    processPayment
  } = usePayment();

  const {
    invoice,
    loading: invoiceLoading,
    error: invoiceError,
    generateInvoice,
    downloadInvoice,
    resetInvoice
  } = useInvoice();

  // Modal state for Admin
  const [modalState, setModalState] = useState({ isOpen: false, editingCategory: null });

  const handleOpenModal = (category = null) => {
    setModalState({ isOpen: true, editingCategory: category });
  };

  const handleCloseModal = () => {
    setModalState({ isOpen: false, editingCategory: null });
  };

  const handleSaveCategory = async (categoryData) => {
    if (modalState.editingCategory) {
      await updateCategory(modalState.editingCategory.id, categoryData);
    } else {
      await addCategory(categoryData);
    }
    handleCloseModal();
  };

  const handleDeleteCategory = async (category) => {
    if (window.confirm(`Are you sure you want to delete ${category.name}?`)) {
      await deleteCategory(category.id);
    }
  };

  const handlePayment = async (upiId) => {
    const paymentResult = await processPayment(selectedCategory.amount, selectedCategory.name, upiId);
    if (paymentResult.success) {
      await generateInvoice(paymentResult, publicationDetails, currentUser);
      
      // Notify parent component about successful submission
      if (onSuccess) {
        onSuccess({
          title: publicationDetails.title,
          category: selectedCategory.name,
          department: publicationDetails.department,
          abstract: '',
          fileName: publicationDetails.file?.name || 'manuscript.pdf',
          fileSize: publicationDetails.file?.size || 'Unknown',
          transactionId: paymentResult.transactionId,
          fileObject: publicationDetails.rawFile
        });
      }
      nextStep();
    }
  };

  const handleFullReset = () => {
    resetFlow();
    resetInvoice();
  };

  return (
    <div className="w-full max-w-7xl mx-auto font-sans">
      
      {step === 1 && (
        <div className="space-y-6">
          {categoriesLoading ? (
            <div className="flex justify-center p-10"><div className="animate-spin h-8 w-8 border-4 border-charcoal border-t-transparent rounded-full"></div></div>
          ) : (
            <PublicationCategoryGrid 
              categories={categories}
              isAdmin={isAdmin}
              onSelectCategory={selectCategory}
              onEditCategory={handleOpenModal}
              onDeleteCategory={handleDeleteCategory}
              onCreateCategory={() => handleOpenModal()}
            />
          )}

          <PublicationCategoryModal 
            isOpen={modalState.isOpen}
            category={modalState.editingCategory}
            onClose={handleCloseModal}
            onSave={handleSaveCategory}
          />
        </div>
      )}

      {step === 2 && (
        <div className="animate-slide-up w-full mx-auto font-sans">
           <div className="w-full max-w-4xl mx-auto flex justify-center mb-6">
             <div className="w-full flex justify-between items-center bg-pure-white p-4 rounded-2xl border border-platinum-silver shadow-xs transition-all duration-300 hover:scale-[1.005] hover:shadow-md">
               <button
                 onClick={prevStep}
                 className="px-4 py-2 text-xs font-bold text-charcoal bg-frost-gray hover:bg-mist-silver border border-platinum-silver rounded-lg flex items-center space-x-1.5 cursor-pointer transition-colors"
               >
                 <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-arrow-left h-4 w-4 mr-1.5"><path d="m12 19-7-7 7-7"/><path d="M19 12H5"/></svg>
                 <span>Back to Categories</span>
               </button>
             </div>
           </div>
           <PublicationUploadForm 
             currentUser={currentUser}
             selectedCategory={selectedCategory}
             publicationDetails={publicationDetails}
             onUpdateDetails={updatePublicationDetails}
             onNext={nextStep}
           />
        </div>
      )}

      {step === 3 && (
        <div className="animate-slide-up">
           <PaymentSummary 
             category={selectedCategory}
             amount={selectedCategory.amount}
             onBack={prevStep}
             onPay={handlePayment}
             loading={paymentLoading || invoiceLoading}
             error={paymentError || invoiceError}
           />
        </div>
      )}

      {step === 4 && (
        <div className="animate-slide-up">
           <InvoiceReceipt 
             invoice={invoice}
             onDownload={downloadInvoice}
             onReset={handleFullReset}
           />
        </div>
      )}

    </div>
  );
};
