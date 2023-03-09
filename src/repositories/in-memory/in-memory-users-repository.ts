import { Prisma, User } from '@prisma/client'

import { UsersRepository } from '../users-repository'

export class InMemoryUsersRepository implements UsersRepository {
    public items: User[] = []

    async findByEmail(email: string) {
        const user = this.items.find((user) => user.email === email)

        if (!user) {
            return null
        }

        return user
    }

    async create(data: Prisma.UserCreateInput) {
        const user = {
            ...data,
            id: Math.random().toString(36),
            created_at: new Date(),
        }

        this.items.push(user)

        return user
    }
}
