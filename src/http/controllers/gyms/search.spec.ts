import { afterAll, beforeAll, describe, expect, it } from 'vitest'

import { app } from '@/app'
import { createAndAuthenticateUser } from '@/utils/test/create-and-authenticate-user'
import request from 'supertest'

describe('Search Gyms (e2e)', () => {
    beforeAll(async () => {
        await app.ready()
    })

    afterAll(async () => {
        await app.close()
    })

    it('should be able to search gyms by title', async () => {
        const { token } = await createAndAuthenticateUser(app, true)

        await request(app.server)
            .post('/gyms')
            .set('Authorization', `Bearer ${token}`)
            .send({
                title: 'javascript gym',
                description: 'Academia do Zé',
                phone: '123456789',
                latitude: -28.2194128,
                longitude: -52.4353536,
            })

        await request(app.server)
            .post('/gyms')
            .set('Authorization', `Bearer ${token}`)
            .send({
                title: 'typescript gym',
                description: 'Academia do Zeke',
                phone: '123456789',
                latitude: -28.2194128,
                longitude: -52.4353536,
            })

        const response = await request(app.server)
            .get('/gyms/search')
            .set('Authorization', `Bearer ${token}`)
            .query({
                query: 'javascript',
            })
            .send()

        expect(response.statusCode).toEqual(200)
        expect(response.body.gyms).toHaveLength(1)
        expect(response.body.gyms).toEqual([
            expect.objectContaining({
                title: 'javascript gym',
            }),
        ])
    })
})
