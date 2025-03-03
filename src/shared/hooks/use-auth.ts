// ** Utils **
import { pick } from '@/shared/utils';

// ** Store **
import { shallowEqual } from 'react-redux';

// ** Hooks **
import { useAppSelector } from './use-store.ts';

export function useAuth() {
  const { user } = useAppSelector(
    (state) => pick(state.auth, ['user']),
    shallowEqual,
  );
  return { user };
}
