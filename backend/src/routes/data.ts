import { z } from '@hono/zod-openapi'
import { createRoute } from '@hono/zod-openapi'
const BodySchema = z.object({
    apiKey: z.string(),
    email: z.string()
})

const ResponseSchema = z.object({
    message: z.string()
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
            description: 'Retrieve the user',
        },
    },
})