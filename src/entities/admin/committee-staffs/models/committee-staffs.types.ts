import { z } from 'zod';
import { committeeStaffSchema, schemas } from './committee-staffs.schema.ts';

export type CommitteeStaff = z.infer<typeof committeeStaffSchema>;
export type CommitteeStaffResponse = z.infer<typeof schemas.single>;
export type FilterCommitteeStaffDTO = z.infer<typeof schemas.filter>;
export type CreateCommitteeStaffDTO = z.infer<typeof schemas.create>;
export type UpdateCommitteeStaffDTO = z.infer<typeof schemas.update>;
