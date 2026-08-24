import { FC, PropsWithChildren } from 'react'
import { Provider } from 'react-redux'
import { store } from '../store'

export const withStore = (Component: FC<PropsWithChildren>): FC<PropsWithChildren> => {
  const WithStore: FC<PropsWithChildren> = (props) => {
    return (
      <Provider store={store}>
        <Component {...props} />
      </Provider>
    )
  }

  return WithStore
}
