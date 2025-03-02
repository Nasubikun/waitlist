import { z } from '@hono/zod-openapi'
import { createRoute } from '@hono/zod-openapi'

// リクエストボディのスキーマ
const BodySchema = z.object({
    userId: z.string().min(1),
})

// 成功レスポンスのスキーマ
const ResponseSchema = z.object({
    apiKey: z.string()
})

// エラーレスポンスのスキーマ
const ErrorResponseSchema = z.object({
    message: z.string(),
    error: z.string().optional()
})

// OpenAPIルート定義
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
            description: 'Successfully generated API key',
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