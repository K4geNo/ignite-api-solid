import { hash } from 'bcryptjs'
import { prisma } from '@/lib/prisma'

interface RegisterBody {
    email: string
    name: string
    password: string
}

export class RegisterUseCase {
    constructor(private usersRepository: any) {}

    async execute({ email, name, password }: RegisterBody) {
        const userExists = await prisma.user.findFirst({
            where: {
                email,
            },
        })

        if (userExists) {
            throw new Error('User already exists')
        }

        const password_hash = await hash(password, 6)

        await this.usersRepository.create({
            email,
            name,
            password_hash,
        })
    }
}
