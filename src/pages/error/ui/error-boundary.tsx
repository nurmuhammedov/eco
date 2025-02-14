import React, { ErrorInfo } from 'react';
import { WithTranslation, withTranslation } from 'react-i18next';

type ErrorBoundaryProps = {
  children: React.ReactNode;
} & WithTranslation;

type ErrorState = {
  hasError: boolean;
};

class ErrorBoundary extends React.Component<ErrorBoundaryProps, ErrorState> {
  state = { hasError: false };

  static getDerivedStateFromError() {
    return { hasError: true };
  }
  componentDidCatch(error: Error, errorInfo: ErrorInfo): void {
    // eslint-disable-next-line @typescript-eslint/no-base-to-string,@typescript-eslint/restrict-template-expressions
    console.error(`Pay attention to the error. ${error}: ${errorInfo}`);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="flex items-center justify-center flex-col h-screen">
          {this.props.t('something_went_wrong')}
        </div>
      );
    }
    return this.props.children;
  }
}

export default withTranslation()(ErrorBoundary);
