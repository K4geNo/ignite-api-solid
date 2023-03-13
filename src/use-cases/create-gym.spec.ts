import { beforeEach, describe, expect, it } from 'vitest'

import { CreateGymUseCase } from './create-gym'
import { InMemoryGymsRepository } from '@/repositories/in-memory/in-memory-gyms-repository'

let gymsRepository: InMemoryGymsRepository
let sut: CreateGymUseCase

describe('Create Gym Use Case', () => {
    beforeEach(() => {
        gymsRepository = new InMemoryGymsRepository()
        sut = new CreateGymUseCase(gymsRepository)
    })

    it('should be able to create gym', async () => {
        const { gym } = await sut.execute({
            title: 'Gym 1',
            description: null,
            phone: null,
            latitude: -28.2194128,
            longitude: -52.4353536,
        })

        expect(gym.id).toEqual(expect.any(String))
    })
})
