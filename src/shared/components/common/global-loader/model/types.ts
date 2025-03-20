import { ReactNode } from 'react';

export type LoaderState = {
  isLoading: boolean;
  message: string;
};

export type LoaderContextType = LoaderState & {
  showLoader: (message?: string) => void;
  hideLoader: () => void;
  updateMessage: (message: string) => void;
};

export type LoaderProviderProps = {
  children: ReactNode;
  defaultMessage?: string;
};

export type GlobalLoaderProps = {
  message?: string;
};

export type StandaloneLoaderProps = {
  isVisible?: boolean;
  message?: string;
  fullScreen?: boolean;
  className?: string;
  size?: number;
  color?: string;
};
