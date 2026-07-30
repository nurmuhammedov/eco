import { DirectionsList } from '@/features/attestation/ui/directions/directions-list'
import { Card, CardContent } from '@/shared/components/ui/card'

const AttestationDirectionsPage = () => {
  return (
    <div className="h-full p-4">
      <Card className="h-full">
        <CardContent className="h-full p-4">
          <DirectionsList />
        </CardContent>
      </Card>
    </div>
  )
}

export default AttestationDirectionsPage
