import { useParams, useNavigate } from 'react-router-dom'
import { ArrowLeft } from 'lucide-react'
import { Button } from '@/shared/components/ui/button'

const InquiryDetailPage = () => {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()

  return (
    <div className="mx-auto w-full max-w-5xl px-4 py-6 sm:px-6">
      <Button variant="ghost" onClick={() => navigate(-1)} className="mb-4 -ml-4 text-slate-500 hover:text-slate-800">
        <ArrowLeft className="mr-2 h-4 w-4" /> Orqaga
      </Button>

      <div className="overflow-hidden rounded-xl border bg-white p-6 shadow-sm">
        <h2 className="mb-4 text-xl font-semibold">Murojaat tafsilotlari</h2>
        <p className="text-slate-500">Murojaat raqami: {id}</p>
        <div className="mt-4 rounded border bg-slate-50 p-4 text-center text-slate-600">
          Bu sahifa tez orada tayyor bo'ladi...
        </div>
      </div>
    </div>
  )
}

export default InquiryDetailPage
