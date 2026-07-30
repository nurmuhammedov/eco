import { QuestionsList } from '@/features/attestation/ui/questions/questions-list'
import { Card, CardContent } from '@/shared/components/ui/card'

const AttestationQuestionsPage = () => {
  return (
    <div className="h-full p-4">
      <Card className="h-full">
        <CardContent className="h-full p-4">
          <QuestionsList />
        </CardContent>
      </Card>
    </div>
  )
}

export default AttestationQuestionsPage
