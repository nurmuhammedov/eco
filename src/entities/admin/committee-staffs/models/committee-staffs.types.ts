import { z } from 'zod';
import { committeeStaffSchema, schemas } from './committee-staffs.schema';

export type CommitteeStaff = z.infer<typeof committeeStaffSchema>;
export type CommitteeStaffTableItem = z.infer<typeof schemas.table>;
export type CommitteeStaffResponse = z.infer<typeof schemas.single>;
export type FilterCommitteeStaffDTO = z.infer<typeof schemas.filter>;
