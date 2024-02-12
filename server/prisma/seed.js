const { PrismaClient } = require('@prisma/client')

const prisma = new PrismaClient()

async function main() {
	seedRoles()
}

async function seedRoles() {
	await prisma.role.deleteMany({})
	await prisma.role.createMany({
		data: [
			{
				id: 1,
				role_name: 'user',
			},
			{
				id: 2,
				role_name: 'admin',
			},
		],
	})
}

main()
	.then(async () => {
		console.log('seeding complete successfully')
		await prisma.$disconnect()
	})

	.catch(async e => {
		console.error(e)

		await prisma.$disconnect()

		process.exit(1)
	})
