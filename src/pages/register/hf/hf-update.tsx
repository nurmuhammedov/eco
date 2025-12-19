import { useUpdate } from '@/shared/hooks'
import { useNavigate, useParams } from 'react-router-dom'
import HfUpdate from '@/features/register/hf/ui/hf-update'
import { toast } from 'sonner'
import { useQueryClient } from '@tanstack/react-query'
import { QK_REGISTRY } from '@/shared/constants/query-keys'

const Update = () => {
  const { id } = useParams()
  const { mutateAsync, isPending } = useUpdate('/hf/', id, 'put')
  const navigate = useNavigate()
  const queryClient = useQueryClient()

  const onSubmit = (values: any) => {
    mutateAsync(values).then(() => {
      toast.success('Muvaffaqiyatli saqlandi!', { richColors: true })
      navigate(-1)
      queryClient.invalidateQueries({ queryKey: ['/hf'] }).catch((err) => console.error(err))
      queryClient.invalidateQueries({ queryKey: [QK_REGISTRY] }).catch((err) => console.error(err))
    })
  }

  return <HfUpdate onSubmit={onSubmit} isPending={isPending} />
}

export default Update
