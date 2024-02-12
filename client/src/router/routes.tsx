import Login from '../pages/Login'
import Main from '../pages/Main'
import Registration from '../pages/Registration'
import { IRoute } from '../types/router.inteface'

export const publicRoutes: IRoute[] = [
	{ path: '/login', element: <Login /> },
	{ path: '/registration', element: <Registration /> },
]

export const privateRoutes: IRoute[] = [{ path: '/', element: <Main /> }]
