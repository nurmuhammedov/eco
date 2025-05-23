import { apiClient } from '@/shared/api';
import { SignatureChallenge } from '@/shared/types/signature';

export async function getTimeStamp(data: { sign: string }) {
  const res = await apiClient.post<SignatureChallenge>(`/e-imzo/attach-timestamp`, data);
  return res.data;
}
