import { z } from '@hono/zod-openapi'
import { createRoute } from '@hono/zod-openapi'
const BodySchema = z.object({
    apiKey: z.string(),
    email: z.string().email()
})

const ResponseSchema = z.object({
    message: z.string()
})

const ErrorResponseSchema = z.object({
    message: z.string(),
    error: z.string().optional()
})

export const dataRoute = createRoute({
    method: 'post',
    path: '/register',
    request: {
        body: {
            content: {
                "application/json": {
                    schema: BodySchema
                }
            }
        }
    },
    responses: {
        200: {
            content: {
                'application/json': {
                    schema: ResponseSchema,
                },
            },
            description: 'Successfully registered email to waitlist',
        },
        400: {
            content: {
                'application/json': {
                    schema: ErrorResponseSchema,
                },
            },
            description: 'Invalid request or API key',
        },
        500: {
            content: {
                'application/json': {
                    schema: ErrorResponseSchema,
                },
            },
            description: 'Server error',
        },
    },
})