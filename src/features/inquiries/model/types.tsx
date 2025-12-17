import { Cpu, Factory, Scan, Zap } from 'lucide-react'

export enum InquiryBelongType {
  HF = 'HF',
  EQUIPMENT = 'EQUIPMENT',
  IRS = 'IRS',
  XRAY = 'XRAY',
}

export const inquiryTabsConfig = [
  {
    key: InquiryBelongType.HF,
    label: 'XICHO',
    icon: <Factory className="h-5 w-5" />,
  },
  {
    key: InquiryBelongType.EQUIPMENT,
    label: 'Qurilmalar',
    icon: <Cpu className="h-5 w-5" />,
  },
  {
    key: InquiryBelongType.IRS,
    label: 'INM',
    icon: <Zap className="h-5 w-5" />,
  },
  {
    key: InquiryBelongType.XRAY,
    label: 'Rentgen',
    icon: <Scan className="h-5 w-5" />,
  },
]

export const appealTypeTranslations: Record<string, string> = {
  APPEAL: 'Ariza',
  COMPLAINT: 'Shikoyat',
  SUGGESTION: 'Taklif',
}
