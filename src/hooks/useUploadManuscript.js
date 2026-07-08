import { useState } from 'react';

export function useUploadManuscript() {
  const [step, setStep] = useState(1);
  const [selectedCategory, setSelectedCategory] = useState(null);
  
  const [publicationDetails, setPublicationDetails] = useState({
    title: '',
    department: '',
    file: null,
    rawFile: null
  });

  const nextStep = () => setStep(s => Math.min(s + 1, 4));
  const prevStep = () => setStep(s => Math.max(s - 1, 1));
  const goToStep = (s) => setStep(s);

  const selectCategory = (category) => {
    setSelectedCategory(category);
    setPublicationDetails({
      title: '',
      department: '',
      file: null,
      rawFile: null
    });
    nextStep();
  };

  const updatePublicationDetails = (details) => {
    setPublicationDetails(prev => ({ ...prev, ...details }));
  };

  const resetFlow = () => {
    setStep(1);
    setSelectedCategory(null);
    setPublicationDetails({
      title: '',
      department: '',
      file: null,
      rawFile: null
    });
  };

  return {
    step,
    selectedCategory,
    publicationDetails,
    nextStep,
    prevStep,
    goToStep,
    selectCategory,
    updatePublicationDetails,
    resetFlow
  };
}
