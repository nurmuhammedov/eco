import { useState, useEffect } from 'react'

export type CadastreStatus = 'NEW' | 'IN_APPROVAL' | 'COMMITTEE' | 'COMPLETED' | 'REJECTED'

export interface CadastrePassport {
  id: string
  registryNumber?: string
  creatorOrgName: string
  creatorOrgStir: string
  targetOrgName: string
  targetOrgStir: string
  status: CadastreStatus
  titleFile: string
  attributeFile: string
  passportFile: string
  createdAt: string

  // FVV
  fvvApproved?: boolean
  fvvName?: string
  fvvStir?: string
  fvvBoss?: string
  fvvAddress?: string
  fvvConclusion?: string
  fvvFile?: string

  // SES
  sesApproved?: boolean
  sesName?: string
  sesStir?: string
  sesBoss?: string
  sesAddress?: string
  sesConclusion?: string
  sesFile?: string

  // Committee
  committeeApproved?: boolean
  committeeBoss?: string
  committeeConclusion?: string
}

const STORAGE_KEY = 'cadastre_passports'

export const useCadastreMock = () => {
  const [data, setData] = useState<CadastrePassport[]>([])

  useEffect(() => {
    const raw = localStorage.getItem(STORAGE_KEY)
    if (raw) {
      try {
        setData(JSON.parse(raw))
      } catch (e) {
        console.error(e)
      }
    }
  }, [])

  const save = (newData: CadastrePassport[]) => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(newData))
    setData(newData)
    // Dispatch event so other tabs/components update
    window.dispatchEvent(new Event('cadastre_passports_updated'))
  }

  useEffect(() => {
    const handleUpdate = () => {
      const raw = localStorage.getItem(STORAGE_KEY)
      if (raw) {
        setData(JSON.parse(raw))
      }
    }
    window.addEventListener('cadastre_passports_updated', handleUpdate)
    return () => window.removeEventListener('cadastre_passports_updated', handleUpdate)
  }, [])

  const getList = () => data

  const getById = (id: string) => data.find((item) => item.id === id)

  const create = (payload: Omit<CadastrePassport, 'id' | 'status' | 'createdAt'>) => {
    const nextNum = (data.length + 1).toString().padStart(5, '0')
    const newItem: CadastrePassport = {
      ...payload,
      id: Date.now().toString(),
      registryNumber: `CAD-${nextNum}`,
      status: 'NEW',
      createdAt: new Date().toISOString(),
    }
    save([...data, newItem])
    return newItem
  }

  const deleteItem = (id: string) => {
    save(data.filter((item) => item.id !== id))
  }

  const updateStatus = (id: string, status: CadastreStatus) => {
    const updated = data.map((item) => (item.id === id ? { ...item, status } : item))
    save(updated)
  }

  const updateItem = (id: string, updates: Partial<CadastrePassport>) => {
    const updated = data.map((item) => (item.id === id ? { ...item, ...updates } : item))
    save(updated)
  }

  const checkAutoStatus = (passports: CadastrePassport[]) => {
    // If both FVV and SES approved, automatically move to COMMITTEE
    return passports.map((p) => {
      if (p.status === 'IN_APPROVAL' && p.fvvApproved && p.sesApproved) {
        return { ...p, status: 'COMMITTEE' as CadastreStatus }
      }
      return p
    })
  }

  const addFvvApproval = (id: string, approvalData: Partial<CadastrePassport>) => {
    const updated = data.map((item) => (item.id === id ? { ...item, ...approvalData, fvvApproved: true } : item))
    save(checkAutoStatus(updated))
  }

  const addSesApproval = (id: string, approvalData: Partial<CadastrePassport>) => {
    const updated = data.map((item) => (item.id === id ? { ...item, ...approvalData, sesApproved: true } : item))
    save(checkAutoStatus(updated))
  }

  const addCommitteeApproval = (id: string, approvalData: Partial<CadastrePassport>) => {
    const updated = data.map((item) => {
      if (item.id === id) {
        return {
          ...item,
          ...approvalData,
          committeeApproved: true,
          status: 'COMPLETED' as CadastreStatus,
        }
      }
      return item
    })
    save(updated)
  }

  return {
    data,
    getList,
    getById,
    create,
    deleteItem,
    updateStatus,
    updateItem,
    addFvvApproval,
    addSesApproval,
    addCommitteeApproval,
  }
}
