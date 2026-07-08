import { useState, useEffect } from 'react';
import { fetchPaymentSettings, updatePaymentSettings } from '../api/paymentApi';

export function usePaymentSettings() {
  const [isPaymentEnabled, setIsPaymentEnabled] = useState(true);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchPaymentSettings()
      .then(val => {
        setIsPaymentEnabled(val);
      })
      .catch(err => {
        console.error('Failed to load payment settings:', err);
      })
      .finally(() => {
        setLoading(false);
      });
  }, []);

  const togglePayment = async () => {
    const next = !isPaymentEnabled;
    setIsPaymentEnabled(next);
    try {
      await updatePaymentSettings(next);
    } catch (err) {
      console.error('Failed to save payment settings:', err);
      setIsPaymentEnabled(!next); // revert
    }
  };

  return { isPaymentEnabled, togglePayment, loading };
}
