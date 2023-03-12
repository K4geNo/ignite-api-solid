import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'

import { CheckInUseCase } from './check-in'
import { Decimal } from '@prisma/client/runtime/library'
import { InMemoryCheckInsRepository } from '@/repositories/in-memory/in-memory-check-ins-repository'
import { InMemoryGymsRepository } from '@/repositories/in-memory/in-memory-gyms-repository'

let checkInsRepository: InMemoryCheckInsRepository
let gymsRepository: InMemoryGymsRepository
let sut: CheckInUseCase

describe('CheckIn Use Case', () => {
    beforeEach(() => {
        checkInsRepository = new InMemoryCheckInsRepository()
        gymsRepository = new InMemoryGymsRepository()
        sut = new CheckInUseCase(checkInsRepository, gymsRepository)

        gymsRepository.items.push({
            id: 'gym-id',
            title: 'Gym Name',
            description: 'Gym Description',
            latitude: new Decimal(-28.2194128),
            longitude: new Decimal(-52.4353536),
            phone: '123456789',
        })

        vi.useFakeTimers()
    })

    afterEach(() => {
        vi.useRealTimers()
    })

    it('should be able to check in', async () => {
        const { checkIn } = await sut.execute({
            gymId: 'gym-id',
            userId: 'user-id',
            userLatitude: -28.2194128,
            userLongitude: -52.4353536,
        })

        expect(checkIn.id).toEqual(expect.any(String))
    })

    it('should not be able to check in twice in the same day', async () => {
        vi.setSystemTime(new Date(2022, 0, 20, 8, 0, 0))

        await sut.execute({
            gymId: 'gym-id',
            userId: 'user-id',
            userLatitude: -28.2194128,
            userLongitude: -52.4353536,
        })

        await expect(() =>
            sut.execute({
                gymId: 'gym-id',
                userId: 'user-id',
                userLatitude: -28.2194128,
                userLongitude: -52.4353536,
            }),
        ).rejects.toBeInstanceOf(Error)
    })

    it('should be able to check in twice but in different days', async () => {
        vi.setSystemTime(new Date(2022, 0, 20, 8, 0, 0))

        await sut.execute({
            gymId: 'gym-id',
            userId: 'user-id',
            userLatitude: -28.2194128,
            userLongitude: -52.4353536,
        })

        vi.setSystemTime(new Date(2022, 0, 21, 8, 0, 0))

        const { checkIn } = await sut.execute({
            gymId: 'gym-id',
            userId: 'user-id',
            userLatitude: -28.2194128,
            userLongitude: -52.4353536,
        })

        expect(checkIn.id).toEqual(expect.any(String))
    })

    // -28.2194128,-52.4353536
    // -28.2579231,-52.3998015 (Gym)

    it('should not be able to check in on distant gym', async () => {
        gymsRepository.items.push({
            id: 'gym-id-2',
            title: 'Gym Name',
            description: 'Gym Description',
            latitude: new Decimal(-28.2579231),
            longitude: new Decimal(-52.3998015),
            phone: '123456789',
        })

        await expect(() =>
            sut.execute({
                gymId: 'gym-id-2',
                userId: 'user-id',
                userLatitude: -28.2194128,
                userLongitude: -52.4353536,
            }),
        ).rejects.toBeInstanceOf(Error)
    })
})
