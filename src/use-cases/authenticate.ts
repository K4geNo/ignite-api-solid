import { InvalidCredentialsError } from './errors/invalid-credentials-error'
import { User } from '@prisma/client'
import { UsersRepository } from '@/repositories/users-repository'
import { compare } from 'bcryptjs'

interface AuthenticateUseCaseRequest {
    email: string
    password: string
}

interface AuthenticateUseCaseResponse {
    user: User
}

export class AuthenticateUseCase {
    constructor(private userRepository: UsersRepository) {}

    async execute({
        email,
        password,
    }: AuthenticateUseCaseRequest): Promise<AuthenticateUseCaseResponse> {
        const user = await this.userRepository.findByEmail(email)

        if (!user) {
            throw new InvalidCredentialsError()
        }

        const doesPasswordMatches = await compare(password, user.password_hash)

        // Boolean => 'is', 'has', 'does'
        if (!doesPasswordMatches) {
            throw new InvalidCredentialsError()
        }

        return {
            user,
        }
    }
}
