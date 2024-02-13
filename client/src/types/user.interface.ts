export interface IUser {
	id: number
	login: string
	name: string
	role: RoleType
}

type RoleType = 'user' | 'admin' 

export enum UserRoles {
	USER = 'user',
	ADMIN = 'admin',
}

export interface IUserWithTokens {
	accessToken: string
	refreshToken: string
	user: IUser
}

export interface IUserTokenResponse {
	data: IUserWithTokens
}