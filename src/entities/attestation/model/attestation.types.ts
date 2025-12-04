export interface AttestationView {
  employeePin: string
  employeeName: string
  employeeLevel: EmployeeLevel
  expiryDate: string // LocalDate as string
  appealId: string // UUID as string
  legalTin: number
  legalName: string
  legalAddress: string
  hfName: string
  hfAddress: string
  status: AttestationStatus
}

export interface AttestationReportDto {
  legalName: string
  legalTin: number
  legalAddress: string
  hfName: string
  hfAddress: string
  totalEmployees: number
  leadersPassed: number
  techniciansPassed: number
  employeesPassed: number
  failedEmployees: number
}

export enum AttestationStatus {
  PENDING = 'PENDING',
  PASSED = 'PASSED',
  FAILED = 'FAILED',
  EXPIRED = 'EXPIRED',
}

export enum EmployeeLevel {
  LEADER = 'LEADER',
  TECHNICIAN = 'TECHNICIAN',
  EMPLOYEE = 'EMPLOYEE',
}

export interface EmployeePayload {
  pin: string
  fullName: string
  level: EmployeeLevel
  profession: string
  certNumber?: string
  certDate?: string
  certExpiryDate?: string
  ctcTrainingFromDate?: string
  ctcTrainingToDate?: string
  dateOfEmployment?: string
}

export interface AddEmployeeDto {
  hfId: string
  employeeList: EmployeePayload[]
}

export interface IEmployeeAttestationResult {
  [pin: string]: any
}

export interface IConductAttestationPayload {
  appealId: string
  filePath: string
  dateOfAttestation: string // "YYYY-MM-DD" formatida
  result: IEmployeeAttestationResult
}
