import { ZodError } from 'zod'
import { appRoutes } from './http/routes'
import { env } from './env'
import fastify from 'fastify'
import fastifyJwt from '@fastify/jwt'

export const app = fastify()

app.register(fastifyJwt, {
    secret: env.JWT_SECRET,
})

app.register(appRoutes)

app.setErrorHandler((error, _, reply) => {
    if (error instanceof ZodError) {
        return reply.status(400).send({
            message: 'Validation failed',
            issues: error.format(),
        })
    }

    if (env.NODE_ENV !== 'production') {
        console.error(error)
    } else {
        // TODO: Here we should log to an external tool like DataDog/NewRelic/Sentry
    }

    if (error.statusCode) {
        return reply.status(error.statusCode).send({
            message: error.message,
        })
    }

    console.error(error)

    return reply.status(500).send({
        message: 'Internal server error',
    })
})
