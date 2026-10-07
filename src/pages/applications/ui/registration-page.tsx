import { RegistrationMode } from '@/features/application/application-table/model/registration-mode'
import { ApplicationListPage } from './application-page'

/** What the committee's staff registered themselves, kept apart from the applicants' appeals */
const RegistrationPage = () => <ApplicationListPage mode={RegistrationMode.UNOFFICIAL} />

export default RegistrationPage
