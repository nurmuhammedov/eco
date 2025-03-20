import { Loader2 } from 'lucide-react';
import {
  createContext,
  FC,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from 'react';
import {
  GlobalLoaderProps,
  LoaderContextType,
  LoaderProviderProps,
  LoaderState,
  StandaloneLoaderProps,
} from '../model/types';

// Create context with a default value and proper typing
const LoaderContext = createContext<LoaderContextType | null>(null);

/**
 * Global Loader provider that manages loading state throughout the application
 */
export const LoaderProvider: FC<LoaderProviderProps> = ({
  children,
  defaultMessage = 'Yuklanmoqda...',
}) => {
  const [state, setState] = useState<LoaderState>({
    isLoading: false,
    message: defaultMessage,
  });

  const showLoader = useCallback(
    (message: string = defaultMessage): void => {
      setState({ isLoading: true, message });
    },
    [defaultMessage],
  );

  const hideLoader = useCallback((): void => {
    setState((prev) => ({ ...prev, isLoading: false }));
  }, []);

  const updateMessage = useCallback((message: string): void => {
    setState((prev) => ({ ...prev, message }));
  }, []);

  // Memoize the context value to prevent unnecessary renders
  const contextValue = useMemo<LoaderContextType>(
    () => ({
      ...state,
      showLoader,
      hideLoader,
      updateMessage,
    }),
    [state, showLoader, hideLoader, updateMessage],
  );

  return (
    <LoaderContext.Provider value={contextValue}>
      {children}
      {state.isLoading && <GlobalLoader message={state.message} />}
    </LoaderContext.Provider>
  );
};

/**
 * Hook to access and control the global loader
 * @returns {LoaderContextType} Loader control methods and current state
 * @throws {Error} If used outside of LoaderProvider
 */
export const useLoader = (): LoaderContextType => {
  const context = useContext(LoaderContext);

  if (context === null) {
    throw new Error('useLoader must be used within a LoaderProvider');
  }

  return context;
};

/**
 * Internal loader component with loading animation
 */
const GlobalLoader: FC<GlobalLoaderProps> = ({ message }) => {
  // Lock scroll when loader is visible
  useEffect(() => {
    const originalStyle = window.getComputedStyle(document.body).overflow;
    document.body.style.overflow = 'hidden';

    // Cleanup function to restore original style
    return () => {
      document.body.style.overflow = originalStyle;
    };
  }, []);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm transition-opacity">
      <div className="bg-white rounded-lg shadow-xl p-6 max-w-sm w-full mx-4 flex flex-col items-center">
        <Loader2 className="animate-spin text-blue-600 mb-4" size={40} />

        {message && (
          <p className="text-lg font-medium text-center text-gray-800">
            {message}
          </p>
        )}

        <div className="w-full bg-gray-200 rounded-full h-1 mt-4 overflow-hidden">
          <div className="bg-blue-600 h-1 rounded-full animate-[loader_1.5s_ease-in-out_infinite]" />
        </div>
      </div>
    </div>
  );
};

/**
 * Standalone loader component that can be used independently
 * without requiring the Provider context
 */
export const Loader: FC<StandaloneLoaderProps> = ({
  isVisible = false,
  message,
  fullScreen = true,
  className = '',
  size = 24,
  color = 'text-blue-600',
}) => {
  if (!isVisible) return null;

  if (fullScreen) {
    return (
      <div
        className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm"
        data-testid="loader-fullscreen"
      >
        <div className="bg-white rounded-lg shadow-xl p-4 max-w-sm flex flex-col items-center">
          <Loader2 className={`animate-spin ${color} mb-2`} size={size + 8} />
          {message && <p className="text-center font-medium">{message}</p>}
        </div>
      </div>
    );
  }

  return (
    <div
      className={`flex flex-col items-center justify-center p-4 ${className}`}
      data-testid="loader-inline"
    >
      <Loader2 className={`animate-spin ${color} mb-2`} size={size} />
      {message && <p className="text-sm text-center">{message}</p>}
    </div>
  );
};

// For usage with lazy loading or code splitting
Loader.displayName = 'Loader';
LoaderProvider.displayName = 'LoaderProvider';

// Default export standalone component for simple use cases
export default Loader;
