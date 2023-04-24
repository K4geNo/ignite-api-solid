import { FastifyInstance } from 'fastify'
import { authenticateController } from './authenticate'
import { profileController } from './profile'
import { registerController } from './register'
import { verifyJWT } from '@/http/middlewares/verify-jwt'

export async function usersRoutes(app: FastifyInstance) {
    app.post('/users', registerController)
    app.post('/sessions', authenticateController)

    /** Authenticated */
    app.get('/me', { onRequest: [verifyJWT] }, profileController)
}
