import { CheckIn } from '@prisma/client'
import { CheckInsRepository } from '@/repositories/check-ins-repository'
import { GymsRepository } from '@/repositories/gyms-repository'
import { ResourceNotFoundError } from './errors/resource-not-found-error'

interface CheckInUseCaseRequest {
    userId: string
    gymId: string
    userLatitude: number
    userLongitude: number
}

interface CheckInUseCaseResponse {
    checkIn: CheckIn
}

export class CheckInUseCase {
    constructor(
        private checkInRepository: CheckInsRepository,
        private gymsRepository: GymsRepository,
    ) {}

    async execute({ gymId, userId }: CheckInUseCaseRequest): Promise<CheckInUseCaseResponse> {
        const gym = await this.gymsRepository.findById(gymId)

        if (!gym) {
            throw new ResourceNotFoundError()
        }

        // calcular a distancia entre o usuário e o gym
        // se a distancia for maior que 100 metros, retornar erro

        const checkInOnSameDate = await this.checkInRepository.findByUserIdOnDate(
            userId,
            new Date(),
        )

        if (checkInOnSameDate) {
            throw new Error('User already checked in')
        }

        const checkIn = await this.checkInRepository.create({
            gym_id: gymId,
            user_id: userId,
        })

        return {
            checkIn,
        }
    }
}
