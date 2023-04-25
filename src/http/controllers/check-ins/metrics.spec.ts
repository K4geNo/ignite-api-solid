import { afterAll, beforeAll, describe, expect, it } from 'vitest'

import { app } from '@/app'
import { createAndAuthenticateUser } from '@/utils/test/create-and-authenticate-user'
import { prisma } from '@/lib/prisma'
import request from 'supertest'

describe('Check-in Metrics (e2e)', () => {
    beforeAll(async () => {
        await app.ready()
    })

    afterAll(async () => {
        await app.close()
    })

    it('should be able to get the total count of check-ins', async () => {
        const { token } = await createAndAuthenticateUser(app)

        const user = await prisma.user.findFirstOrThrow()

        const gym = await prisma.gym.create({
            data: {
                title: 'Academia do Zé',
                latitude: -28.2194128,
                longitude: -52.4353536,
            },
        })

        await prisma.checkIn.createMany({
            data: [
                {
                    user_id: user.id,
                    gym_id: gym.id,
                },
                {
                    user_id: user.id,
                    gym_id: gym.id,
                },
            ],
        })

        const response = await request(app.server)
            .get('/check-ins/metrics')
            .set('Authorization', `Bearer ${token}`)
            .send()

        expect(response.statusCode).toEqual(200)
        expect(response.body.checkInsCount).toEqual(2)
    })
})
