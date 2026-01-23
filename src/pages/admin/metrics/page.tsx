import { useEffect } from 'react'

const Page = () => {
  useEffect(() => {
    window.location.reload()
  }, [])
  return <div></div>
}

export default Page
