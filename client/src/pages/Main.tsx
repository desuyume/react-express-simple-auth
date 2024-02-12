import { FC, useContext } from 'react'
import userService from '../services/user.service'
import { UserContext } from '../Context'
import { toast } from 'react-toastify'

const Main: FC = () => {
	const userContext = useContext(UserContext)

	const handleLogout = async () => {
		try {
			await userService.logout()
		} catch (e) {
			console.log(e)
		} finally {
			localStorage.removeItem('token')
			userContext?.setUser(null)
			toast('Вы вышли из аккаунта')
		}
	}

	return (
		<div className='main'>
			<p>Имя: {userContext?.user?.name}</p>
			<hr />
			<p>Логин: {userContext?.user?.login}</p>
			<hr />
			<p>Роль: {userContext?.user?.role}</p>
			<hr />
			<button onClick={handleLogout}>Выйти</button>
		</div>
	)
}

export default Main
