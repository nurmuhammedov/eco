import { Outlet } from 'react-router-dom'

const BlankLayout = () => {
  // Bu yerda hech qanday sidebar, header yoki boshqa elementlar yo'q
  return (
    <main>
      <Outlet />
    </main>
  )
}

export default BlankLayout
