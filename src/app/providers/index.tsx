import { FC } from 'react';
import { withStore } from './with-store';
import { withQuery } from './with-query';
import { withRouter } from './with-router';
import { withLanguage } from './with-language';
import { withErrorBoundary } from './with-error-boundary';

export const withProviders = (component: FC): FC => {
  return withErrorBoundary(
    withStore(withLanguage(withQuery(withRouter(component)))),
  );
};
