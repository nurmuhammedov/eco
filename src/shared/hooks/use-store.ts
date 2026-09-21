import { shallowEqual, TypedUseSelectorHook, useDispatch, useSelector } from 'react-redux'
import type { AppDispatch, RootState } from '@/shared/store'

export const useAppSelector: TypedUseSelectorHook<RootState> = (selector) => useSelector(selector, shallowEqual)
export const useAppDispatch = useDispatch.withTypes<AppDispatch>()
