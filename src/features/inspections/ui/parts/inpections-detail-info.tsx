import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/shared/components/ui/tabs.tsx'
import { useState } from 'react'
import { useAuth } from '@/shared/hooks/use-auth.ts'
import { UserRoles } from '@/entities/user'
import InspectionMainInfo from '@/features/inspections/ui/parts/inspection-main-info.tsx'

const InspectionsDetailInfo = ({ inspectionData }: any) => {
  const [activeTab, setActiveTab] = useState('main_info')
  const { user } = useAuth()

  return (
    <Tabs value={activeTab} onValueChange={setActiveTab}>
      {user?.role === UserRoles.INSPECTOR && (
        <TabsList className="bg-[#EDEEEE]">
          <TabsTrigger value="main_info">Umumiy ma’lumotlar</TabsTrigger>
        </TabsList>
      )}
      <TabsContent value="main_info">
        <InspectionMainInfo inspectionData={inspectionData} />
      </TabsContent>
    </Tabs>
  )
}
export default InspectionsDetailInfo
