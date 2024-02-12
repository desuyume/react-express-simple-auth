import { FC, useContext } from 'react'
import { UserContext } from './Context'
import { Navigate, Route, Routes } from 'react-router-dom'
import { privateRoutes, publicRoutes } from './router/routes'
import Loader from './Loader'

const AppRouter: FC = () => {
	const userContext = useContext(UserContext)

	return !userContext?.isFetched ? (
		<div>
			<Loader />
		</div>
	) : (
		<Routes>
			{!userContext?.user && (
				<>
					{publicRoutes.map(route => (
						<Route key={route.path} path={route.path} element={route.element} />
					))}
					<Route path='*' element={<Navigate to='/login' />} />
				</>
			)}

			{userContext?.user && (
				<>
					{privateRoutes.map(route => (
						<Route key={route.path} path={route.path} element={route.element} />
					))}
					<Route path='*' element={<Navigate to='/' />} />
				</>
			)}
		</Routes>
	)
}

export default AppRouter
