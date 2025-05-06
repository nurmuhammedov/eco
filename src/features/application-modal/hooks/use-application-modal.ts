import { MODAL_EVENTS } from '../lib/constants';
import { eventBus } from '@/shared/lib/event-bus';
import { useCallback, useEffect, useState } from 'react';
import { closeModal, openModal, resetModal } from '../lib/modal-actions';

export const useApplicationModal = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [documentUrl, setDocumentUrl] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  // Event listeners
  useEffect(() => {
    const unsubscribeOpen = eventBus.subscribe(MODAL_EVENTS.OPEN, () => {
      setIsOpen(true);
      setError(null);
    });

    const unsubscribeClose = eventBus.subscribe(MODAL_EVENTS.CLOSE, () => {
      setIsOpen(false);
    });

    const unsubscribeLoading = eventBus.subscribe(MODAL_EVENTS.LOADING, (loading: boolean) => {
      setIsLoading(loading);
    });

    const unsubscribeSuccess = eventBus.subscribe(MODAL_EVENTS.SUCCESS, (url: string) => {
      setDocumentUrl(url);
    });

    const unsubscribeError = eventBus.subscribe(MODAL_EVENTS.ERROR, (msg: string) => {
      setError(msg);
    });

    const unsubscribeReset = eventBus.subscribe(MODAL_EVENTS.RESET, () => {
      setDocumentUrl(null);
      setError(null);
      setIsOpen(false);
    });

    return () => {
      unsubscribeOpen();
      unsubscribeClose();
      unsubscribeLoading();
      unsubscribeSuccess();
      unsubscribeError();
      unsubscribeReset();
    };
  }, []);

  const handleOpenModal = useCallback(() => {
    openModal();
  }, []);

  const handleCloseModal = useCallback(() => {
    closeModal();
  }, []);

  const handleResetModal = useCallback(() => {
    resetModal();
  }, []);

  const handleDownloadDocument = useCallback(() => {
    if (documentUrl) {
      window.open(documentUrl, '_blank');
    }
  }, [documentUrl]);

  return {
    // States
    isOpen,
    isLoading,
    documentUrl,
    error,
    // Methods
    openModal: handleOpenModal,
    closeModal: handleCloseModal,
    resetModal: handleResetModal,
    downloadDocument: handleDownloadDocument,
  };
};
