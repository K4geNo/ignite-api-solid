import { FastifyReply, FastifyRequest } from 'fastify'

import { PrismaUsersRepository } from '@/repositories/prisma/prisma-users-repository'
import { RegisterUseCase } from '@/use-cases/register'
import { UserAlreadyExistsError } from '@/use-cases/errors/user-already-exists-error'
import { z } from 'zod'

export async function register(request: FastifyRequest, reply: FastifyReply) {
    const registerBodySchema = z.object({
        email: z.string().email(),
        name: z.string(),
        password: z.string().min(6),
    })

    const { email, name, password } = registerBodySchema.parse(request.body)

    try {
        const prismaUserRepository = new PrismaUsersRepository()
        const registerUseCase = new RegisterUseCase(prismaUserRepository)

        await registerUseCase.execute({ email, name, password })
    } catch (error) {
        if (error instanceof UserAlreadyExistsError) {
            return reply.status(409).send({
                message: error.message,
            })
        }

        return reply.status(500).send()
    }

    return reply.status(201).send()
}
