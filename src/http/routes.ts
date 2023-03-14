import { FastifyInstance } from 'fastify'
import { authenticateController } from './controllers/authenticate'
import { profileController } from './controllers/profile'
import { registerController } from './controllers/register'

export async function appRoutes(app: FastifyInstance) {
    app.post('/users', registerController)

    app.post('/sessions', authenticateController)

    /** Authenticated */
    app.get('/me', profileController)
}
