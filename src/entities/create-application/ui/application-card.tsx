import { ApplicationCardItem, ApplicationIcons, ApplicationTypeEnum } from '@/entities/create-application'
import React from 'react'
import { useNavigate } from 'react-router-dom'

interface ApplicationCardProps {
  application: ApplicationCardItem
  url?: string
  btnTitle?: string
}

const SendSVGIcon = () => (
  <span className="mr-2">
    <svg className="size-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M15 15l-2 5L9 9l11 4-5 2zm0 0l5 5M7.188 2.239l.777 2.897M5.136 7.965l-2.898-.777M13.95 4.05l-2.122 2.122m-5.657 5.656l-2.12 2.122"
      />
    </svg>
  </span>
)

const AnimatedButton = ({
  type,
  url = 'applications',
  btnTitle = 'Ariza yuborish',
}: {
  type: ApplicationTypeEnum
  url?: string
  btnTitle?: string
}) => {
  const navigate = useNavigate()

  const handleNavigate = () => {
    navigate(`/${url}/create/${type}`)
  }

  return (
    <button
      type="button"
      onClick={handleNavigate}
      className="group border-teal text-teal hover:bg-teal relative flex h-10 w-full items-center justify-center overflow-hidden rounded-md border bg-transparent px-4 py-2 text-sm font-medium transition-colors duration-300 hover:text-white"
    >
      <span className="relative z-10 flex items-center">
        <SendSVGIcon />
        {btnTitle}
      </span>
      <span className="absolute inset-0 -translate-x-full -skew-x-12 transform bg-white/10 opacity-0 transition-transform duration-700 ease-out group-hover:translate-x-full group-hover:opacity-100" />
    </button>
  )
}

function ApplicationCard({ application, url, btnTitle }: ApplicationCardProps) {
  return (
    <div className="group relative flex flex-col justify-between overflow-hidden rounded-md border border-slate-100 bg-white p-6 shadow-sm transition-all duration-300 hover:shadow-md">
      <div className="mb-5 flex items-center">
        <div className="group-hover:bg-teal flex size-12 items-center justify-center rounded-full bg-[#E2E8F0] transition-all duration-300 group-hover:scale-110">
          <div className="text-teal size-6 group-hover:text-white">
            {ApplicationIcons[application.icon]('currentColor')}
          </div>
        </div>

        <div className="group-hover:bg-teal ml-4 h-px w-[40%] flex-grow bg-[#E2E8F0] opacity-50 transition-all duration-300 group-hover:w-[60%] group-hover:opacity-100" />
      </div>
      <h3 className="line-clamp-2 text-base leading-5 font-medium text-slate-800">{application.title}</h3>

      <p className="mt-2 mb-6 line-clamp-2 text-sm font-normal text-gray-500">{application.description}</p>
      <AnimatedButton url={url} type={application.type} btnTitle={btnTitle} />
    </div>
  )
}

export default React.memo(ApplicationCard)
