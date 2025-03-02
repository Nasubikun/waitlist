import { z } from '@hono/zod-openapi'
import { createRoute } from '@hono/zod-openapi'

// リクエストボディのスキーマ
const BodySchema = z.object({
    apiKey: z.string(),
})

// 成功レスポンスのスキーマ
const ResponseSchema = z.object({
    users: z.array(
        z.object({
            email: z.string(),
            note: z.string().nullable(),
            created_at: z.string()
        })
    )
})

// エラーレスポンスのスキーマ
const ErrorResponseSchema = z.object({
    message: z.string(),
    error: z.string().optional()
})

// OpenAPIルート定義
export const listRoute = createRoute({
    method: 'post',
    path: '/waitlist/list',
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
            description: 'Successfully retrieved waitlist users',
        },
        400: {
            content: {
                'application/json': {
                    schema: ErrorResponseSchema,
                },
            },
            description: 'Invalid API key',
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

// エクスポートしてindex.tsで使用できるようにする
export { ResponseSchema, ErrorResponseSchema }