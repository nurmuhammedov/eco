import { Link } from 'react-router-dom';
import { UserRoles } from '@/shared/types';
import { setUser } from '@/app/store/auth-slice.ts';
import Icon from '@/shared/components/common/icon';
import { useAppDispatch } from '@/shared/hooks/use-store.ts';
import { AuthUser } from '@/entities/auth/models/auth.model.ts';

const mockUser = {
  id: 1,
  email: 'admin@gmail.com',
  first_name: 'Admin',
  last_name: 'Adminov',
  permissions: ['all'],
  role: UserRoles.LEGAL,
} as AuthUser;

export default function LoginForm() {
  const dispatch = useAppDispatch();

  const handleLogin = () => dispatch(setUser(mockUser));

  return (
    <div className="w-1/2 flex flex-col items-center justify-center">
      <h3 className="mb-4 font-medium text-2xl leading-6 w-1/4 text-center">
        Axborot tizimiga kirish
      </h3>
      <Link
        to="/app/applications"
        onClick={() => handleLogin()}
        className="bg-neutral-200 px-9 3xl:px-12 rounded-2xl inline-block"
      >
        <Icon name="id-gov" className="w-32 h-20 3xl:w-36 3xl:h-24" />
      </Link>
    </div>
  );
}
