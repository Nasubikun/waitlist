import { z } from '@hono/zod-openapi'
import { createRoute } from '@hono/zod-openapi'
const BodySchema = z.object({
    userId: z.string(),
})

const ResponseSchema = z.object({
    apiKey: z.string()
})

export const controlRoute = createRoute({
    method: 'post',
    path: '/apiKey/new',
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