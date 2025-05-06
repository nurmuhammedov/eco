import { useCallback } from 'react';
import { Loader2 } from 'lucide-react';
import { Button } from '@/shared/components/ui/button';
import {
  openModal,
  setModalError,
  setModalLoading,
  setModalSuccess,
  useApplicationModal,
} from '@/features/application-modal';

interface CreateApplicationButtonProps {
  formData: any;
  isFormValid: boolean;
  apiHandler: (data: any) => Promise<any>;
  onSuccess?: () => void;
  onError?: (error: string) => void;
}

export const CreateApplicationButton = ({
  formData,
  isFormValid,
  apiHandler,
  onSuccess,
  onError,
}: CreateApplicationButtonProps) => {
  const { isLoading } = useApplicationModal();

  // Application yaratish uchun pure function
  const createApplication = useCallback(
    async (data: any) => {
      try {
        // Modal ochish va loading ko'rsatish
        openModal();
        setModalLoading(true);

        // API so'rovi
        const response = await apiHandler(data);

        console.log('apiHandler response', response);

        // Natijani tekshirish
        if (response.success && response.documentUrl) {
          setModalSuccess(response.documentUrl);
          if (onSuccess) onSuccess();
        } else {
          const errorMessage = response.error || "Noma'lum xatolik";
          setModalError(errorMessage);
          if (onError) onError(errorMessage);
        }
      } catch (error: any) {
        const errorMessage = error.message || 'Xatolik yuz berdi';
        setModalError(errorMessage);
        if (onError) onError(errorMessage);
      } finally {
        setModalLoading(false);
      }
    },
    [apiHandler, onSuccess, onError],
  );

  // Tugma bosish hodisasi
  const handleClick = useCallback(() => {
    if (isFormValid) {
      createApplication(formData);
    }
  }, [isFormValid, formData, createApplication]);

  return (
    <Button onClick={handleClick} disabled={!isFormValid || isLoading} className="bg-blue-600 hover:bg-blue-700">
      {isLoading ? (
        <span className="flex items-center gap-2">
          <Loader2 className="h-4 w-4 animate-spin" />
          Юборилмоқда...
        </span>
      ) : (
        'Ariza yaratish'
      )}
    </Button>
  );
};
