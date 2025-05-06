import { MODAL_EVENTS } from './constants';
import { eventBus } from '@/shared/lib/event-bus';

export const openModal = () => {
  eventBus.emit(MODAL_EVENTS.OPEN);
};

export const closeModal = () => {
  eventBus.emit(MODAL_EVENTS.CLOSE);
};

export const setModalLoading = (loading: boolean) => {
  eventBus.emit(MODAL_EVENTS.LOADING, loading);
};

export const setModalSuccess = (documentUrl: string) => {
  eventBus.emit(MODAL_EVENTS.SUCCESS, documentUrl);
};

export const setModalError = (error: string) => {
  eventBus.emit(MODAL_EVENTS.ERROR, error);
};

export const resetModal = () => {
  eventBus.emit(MODAL_EVENTS.RESET);
};
