import { FC, useContext } from 'react'
import { UserContext } from '../Context'
import { UserRoles } from '../types/user.interface'
import { Link } from 'react-router-dom'

const Admin: FC = () => {
	const userContext = useContext(UserContext)

	return (
		<div>
			<h2>Admin panel</h2>

			{userContext?.user?.role === UserRoles.ADMIN && (
				<Link to='/' className='bttn main-bttn'>
					Основная
				</Link>
			)}
		</div>
	)
}

export default Admin