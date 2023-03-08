import { UsersRepository } from '@/repositories/users-repository'
import { hash } from 'bcryptjs'

interface RegisterBody {
    email: string
    name: string
    password: string
}

export class RegisterUseCase {
    constructor(private usersRepository: UsersRepository) {}

    async execute({ email, name, password }: RegisterBody) {
        const password_hash = await hash(password, 6)

        const usersAlreadyExists = await this.usersRepository.findByEmail(email)

        if (usersAlreadyExists) {
            throw new Error('User already exists')
        }

        await this.usersRepository.create({
            email,
            name,
            password_hash,
        })
    }
}
