import { cn } from '@/shared/lib/utils.ts';
import { IS_DEV } from '@/shared/constants/general.ts';
import React, { Component, ErrorInfo, memo } from 'react';
import { DefaultErrorFallback } from '../../pages/error/ui/default-error-fallback.tsx';
import { NavigateFunction, useLocation, useNavigate } from 'react-router-dom';
import type {
  ErrorBoundaryProps,
  ErrorBoundaryState,
  ErrorFallbackProps,
} from '../../pages/error/types';

/**
 * High-performance ErrorBoundary core component
 */
class ErrorBoundaryCore extends Component<
  ErrorBoundaryProps & { navigate: NavigateFunction; pathname: string },
  ErrorBoundaryState
> {
  // Default properties
  static defaultProps = {
    resetOnRouteChange: true,
  };

  private previousPath: string;

  constructor(
    props: ErrorBoundaryProps & {
      pathname: string;
      navigate: NavigateFunction;
    },
  ) {
    super(props);
    this.state = {
      hasError: false,
      error: null,
      errorInfo: undefined,
    };
    this.previousPath = props.pathname;
  }

  static getDerivedStateFromError(error: Error): Partial<ErrorBoundaryState> {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo): void {
    this.setState({ errorInfo });
    if (this.props.onError) {
      this.props.onError(error, errorInfo);
    }

    if (IS_DEV) {
      console.group(
        '%c ErrorBoundary caught an error',
        'color: #ff0000; font-weight: bold;',
      );
      console.error(error);
      console.error('Component Stack:', errorInfo.componentStack);
      console.groupEnd();
    }
  }

  componentDidUpdate(): void {
    const { resetOnRouteChange, pathname } = this.props;

    if (
      resetOnRouteChange &&
      this.state.hasError &&
      pathname !== this.previousPath
    ) {
      this.resetError();
    }

    this.previousPath = pathname;
  }

  resetError = (): void => {
    this.setState({
      hasError: false,
      error: null,
      errorInfo: undefined,
    });
  };

  reloadPage = (): void => {
    window.location.reload();
  };

  goBack = (): void => {
    this.resetError();
    this.props.navigate(-1);
  };

  goHome = (): void => {
    this.resetError();
    this.props.navigate('/');
  };

  render(): React.ReactNode {
    const { hasError, error, errorInfo } = this.state;
    const { children, fallback: CustomFallback, className } = this.props;

    if (!hasError) {
      return <div className={cn(className)}>{children}</div>;
    }

    const fallbackProps: ErrorFallbackProps = {
      error,
      errorInfo,
      isDev: IS_DEV,
      goBack: this.goBack,
      goHome: this.goHome,
      resetError: this.resetError,
      reloadPage: this.reloadPage,
    };

    if (CustomFallback) {
      return <CustomFallback {...fallbackProps} />;
    }

    return <DefaultErrorFallback {...fallbackProps} />;
  }
}

const ErrorBoundary = memo((props: ErrorBoundaryProps) => {
  const location = useLocation();
  const navigate = useNavigate();

  return (
    <ErrorBoundaryCore
      {...props}
      className="h-full"
      navigate={navigate}
      pathname={location.pathname}
    />
  );
});

ErrorBoundary.displayName = 'ErrorBoundary';

export default ErrorBoundary;
