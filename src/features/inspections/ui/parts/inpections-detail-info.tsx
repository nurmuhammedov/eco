import { Tabs, TabsContent /* TabsList, TabsTrigger */ } from '@/shared/components/ui/tabs'
import { useState } from 'react'
import InspectionMainInfo from '@/features/inspections/ui/parts/inspection-main-info'

const InspectionsDetailInfo = ({ inspectionData }: any) => {
  const [activeTab, setActiveTab] = useState('main_info')

  return (
    <Tabs value={activeTab} onValueChange={setActiveTab}>
      <TabsContent value="main_info">
        <InspectionMainInfo inspectionData={inspectionData} />
      </TabsContent>
    </Tabs>
  )
}
export default InspectionsDetailInfo
