import { useState, useCallback } from 'react';

/**
 * Custom hook for showing custom alerts
 * Returns alert component and show methods
 */
export const useCustomAlert = () => {
  const [alertConfig, setAlertConfig] = useState({
    visible: false,
    title: '',
    message: '',
    buttons: [],
    type: 'info',
  });

  const hideAlert = useCallback(() => {
    setAlertConfig((prev) => ({ ...prev, visible: false }));
  }, []);

  const showAlert = useCallback(
    ({ title, message, buttons, type = 'info' }) => {
      setAlertConfig({
        visible: true,
        title,
        message,
        buttons: buttons || [{ text: 'OK', onPress: hideAlert }],
        type,
      });
    },
    [hideAlert]
  );

  // Convenience methods for different alert types
  const showSuccess = useCallback(
    (message, title = 'Success', onClose) => {
      showAlert({
        title,
        message,
        type: 'success',
        buttons: [{ text: 'OK', onPress: onClose || hideAlert }],
      });
    },
    [showAlert, hideAlert]
  );

  const showError = useCallback(
    (message, title = 'Error', onClose) => {
      showAlert({
        title,
        message,
        type: 'error',
        buttons: [{ text: 'OK', onPress: onClose || hideAlert }],
      });
    },
    [showAlert, hideAlert]
  );

  const showWarning = useCallback(
    (message, title = 'Warning', onClose) => {
      showAlert({
        title,
        message,
        type: 'warning',
        buttons: [{ text: 'OK', onPress: onClose || hideAlert }],
      });
    },
    [showAlert, hideAlert]
  );

  const showConfirm = useCallback(
    (message, onConfirm, title = 'Confirm', confirmText = 'Confirm', cancelText = 'Cancel') => {
      showAlert({
        title,
        message,
        type: 'confirm',
        buttons: [
          {
            text: cancelText,
            style: 'cancel',
            onPress: hideAlert,
          },
          {
            text: confirmText,
            onPress: () => {
              onConfirm?.();
              hideAlert();
            },
          },
        ],
      });
    },
    [showAlert, hideAlert]
  );

  return {
    alertConfig,
    hideAlert,
    showAlert,
    showSuccess,
    showError,
    showWarning,
    showConfirm,
  };
};
