import { UserRoles } from '@/entities/user';
import { AttestationList } from '@/features/attestation/ui/attestation-list';
import { Button } from '@/shared/components/ui/button';
import { useAuth } from '@/shared/hooks/use-auth';
import { PlusCircle } from 'lucide-react';
import React from 'react';
import { useNavigate } from 'react-router-dom';

export const AttestationWidget: React.FC = () => {
  const { user } = useAuth();
  const navigate = useNavigate();

  const canAddEmployee = user?.role === UserRoles.LEGAL || user?.role === UserRoles.INDIVIDUAL;
  const handleAddEmployeeClick = () => {
    navigate('/attestations/add');
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-2xl font-semibold">Attestatsiya</h1>
        {canAddEmployee && (
          <Button onClick={handleAddEmployeeClick}>
            <PlusCircle className="mr-2 h-4 w-4" /> Xodim qo‘shish
          </Button>
        )}
      </div>
      <AttestationList />
    </div>
  );
};
