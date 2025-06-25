import { UserRoles } from '@/entities/user';
import { AccreditationList } from '@/features/accreditation/ui/accreditation-list';
import { Button } from '@/shared/components/ui/button';
import { useAuth } from '@/shared/hooks/use-auth';
import { PlusCircle } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';

export const AccreditationWidget = () => {
  const { t } = useTranslation('common');
  const { user } = useAuth();
  const navigate = useNavigate();

  const canCreate = user?.role === UserRoles.LEGAL || user?.role === UserRoles.INDIVIDUAL;

  return (
    <div>
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-2xl font-semibold">{t('menu.accreditation')}</h1>
        {canCreate && (
          <Button onClick={() => navigate('/accreditations/create')}>
            <PlusCircle /> Ariza yaratis
          </Button>
        )}
      </div>
      <AccreditationList />
    </div>
  );
};
