// src/features/attestation/model/use-add-employee-form.ts
import { attestationAPI } from '@/entities/attestation/api/attestation.api'
import { addEmployeeFormSchema } from '@/entities/attestation/model/add-employee.schema'
import { AddEmployeeDto, EmployeeLevel } from '@/entities/attestation/model/attestation.types'
import { API_ENDPOINTS } from '@/shared/api'
import { CommonService } from '@/shared/api/dictionaries/queries/comon.api'
import { useTranslatedObject } from '@/shared/hooks'
import { OptionItem } from '@/shared/types'
import { zodResolver } from '@hookform/resolvers/zod'
import { useMutation, useQuery } from '@tanstack/react-query'
import { useFieldArray, useForm } from 'react-hook-form'
import { useNavigate } from 'react-router-dom'
import { toast } from 'sonner'

export const useAddEmployeeForm = () => {
  const navigate = useNavigate()
  const form = useForm<AddEmployeeDto>({
    resolver: zodResolver(addEmployeeFormSchema),
    defaultValues: {
      hfId: '',
      employeeList: [
        {
          pin: '',
          fullName: '',
          level: EmployeeLevel.EMPLOYEE,
          profession: '',
          certNumber: '',
          certDate: '',
          certExpiryDate: '',
          ctcTrainingFromDate: '',
          ctcTrainingToDate: '',
          dateOfEmployment: '',
        },
      ],
    },
  })

  const { fields, append, remove } = useFieldArray({
    control: form.control,
    name: 'employeeList',
  })

  const { data: hfOptions, isLoading: isLoadingHf } = useQuery<OptionItem<string>[]>({
    queryKey: ['hf-select'],
    queryFn: () => CommonService.getData(API_ENDPOINTS.HF_SELECT),
  })

  const { mutate: createEmployees, isPending } = useMutation({
    mutationFn: attestationAPI.create,
    onSuccess: () => {
      toast.success("Xodimlar muvaffaqiyatli qo'shildi")
      navigate('/attestations')
    },
  })

  const employeeLevelOptions = useTranslatedObject(EmployeeLevel, 'attestation')

  const addEmployee = () => {
    append({
      pin: '',
      fullName: '',
      level: EmployeeLevel.EMPLOYEE,
      profession: '',
      certNumber: '',
      certDate: '',
      certExpiryDate: '',
      ctcTrainingFromDate: '',
      ctcTrainingToDate: '',
      dateOfEmployment: '',
    })
  }
  const onSubmit = (data: AddEmployeeDto) => {
    createEmployees(data)
  }

  return {
    form,
    fields,
    addEmployee,
    remove,
    hfOptions,
    isLoadingHf,
    employeeLevelOptions,
    onSubmit: form.handleSubmit(onSubmit),
    isPending,
  }
}
