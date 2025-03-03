import { useForm } from 'react-hook-form';
import { useCallback, useMemo } from 'react';
import { zodResolver } from '@hookform/resolvers/zod';
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerDescription,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from '@/shared/components/ui/drawer';
import {
  useDistrictById,
  useSaveDistrict,
} from '@/entities/admin/district/api';
import {
  DistrictFormValues,
  districtSchema,
} from '@/entities/admin/district/schema';
import { DrawerMode } from '@/shared/types/enums';
import { Button } from '@/shared/components/ui/button';

interface Props {
  isOpen: boolean;
  mode?: DrawerMode;
  onClose: () => void;
  districtId?: number;
}

export default function DistrictDrawer({ districtId, isOpen, onClose }: Props) {
  const { mutate, isPending } = useSaveDistrict();

  const { data: district } = useDistrictById(districtId!);

  const defaultValues = useMemo<DistrictFormValues>(
    () => ({
      name: '',
      region_id: district?.id || 0,
    }),
    [district],
  );

  const {
    reset,
    handleSubmit,
    formState: { errors },
  } = useForm<DistrictFormValues>({
    resolver: zodResolver(districtSchema),
    defaultValues,
  });

  const onSubmit = useCallback(
    (data: DistrictFormValues) => {
      mutate(
        {
          ...data,
          id: districtId,
        },
        {
          onSuccess: () => {
            // toast
            reset();
            onClose();
          },
        },
      );
    },
    [districtId, onClose, reset],
  );

  return (
    <Drawer
      direction="right"
      open={true}
      onClose={onClose}
      // title={districtId ? 'Edit District' : 'Create District'}
      // shouldScaleBackground={false}
    >
      <DrawerTrigger asChild>
        <Button variant="outline">Edit Profile</Button>
      </DrawerTrigger>
      <DrawerContent className="sm:!max-w-[500px]">
        <DrawerHeader className="text-left">
          <DrawerTitle>Edit profile</DrawerTitle>
          <DrawerDescription>
            Make changes to your profile here. Click save when you're done.
          </DrawerDescription>
        </DrawerHeader>
        <DrawerFooter className="pt-2">
          <DrawerClose asChild>
            <Button variant="outline">Cancel</Button>
          </DrawerClose>
        </DrawerFooter>
      </DrawerContent>
    </Drawer>
  );
}
