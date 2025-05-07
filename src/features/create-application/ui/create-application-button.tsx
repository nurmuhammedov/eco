import { Button } from '@/shared/components/ui/button';

interface CreateApplicationButtonProps {
  formData: any;
  isLoading: boolean;
  isFormValid: boolean;
  onSubmit: (formData: any) => void;
}

export const CreateApplicationButton = ({
  formData,
  isFormValid,
  onSubmit,
  isLoading,
}: CreateApplicationButtonProps) => {
  const handleClick = () => {
    if (isFormValid) {
      onSubmit(formData);
    }
  };

  return (
    <Button onClick={handleClick} loading={isLoading} disabled={!isFormValid || isLoading}>
      {isLoading ? 'Yuborilmoqda...' : 'Ariza yaratish'}
    </Button>
  );
};
