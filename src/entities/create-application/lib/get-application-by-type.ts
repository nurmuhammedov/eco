import { APPLICATIONS_DATA } from '../constants/constants'
import { ApplicationTypeEnum } from '../types/enums'

export function getApplicationByType(type: ApplicationTypeEnum) {
  return APPLICATIONS_DATA.find((app) => app.type === type) || null
}
