import { OpenAPIHono } from '@hono/zod-openapi'
import { dataRoute } from './routes/data'
import { controlRoute } from './routes/control'
import { listRoute } from './routes/list'

// Cloudflare D1の型定義
type Bindings = {
  DB: D1Database;
}

const app = new OpenAPIHono<{ Bindings: Bindings }>()

// データ登録ルート（ウェイトリストへのメールアドレス登録）
app.openapi(dataRoute, async (c) => {
  try {
    const { apiKey, email } = c.req.valid('json')

    // APIキーの存在確認
    const { results: apiKeyResults } = await c.env.DB.prepare(
      "SELECT api_key FROM api_keys WHERE api_key = ?"
    )
      .bind(apiKey)
      .all()

    if (apiKeyResults.length === 0) {
      return c.json({
        message: "Invalid API key"
      }, 400)
    }

    try {
      // waitlistテーブルにデータを挿入
      await c.env.DB.prepare(
        "INSERT INTO waitlist (api_key, email) VALUES (?, ?)"
      )
        .bind(apiKey, email)
        .run()
    } catch (dbError) {
      // 一意性制約違反などのDBエラーを処理
      if (dbError instanceof Error && dbError.message.includes('UNIQUE constraint failed')) {
        return c.json({
          message: "This email is already registered for this API key"
        }, 400)
      }
      throw dbError // その他のDBエラーは再スロー
    }

    // send an email (この部分は実装しない)

    return c.json({
      message: "success"
    })
  } catch (error) {
    console.error("Error in dataRoute:", error)
    const errorMessage = error instanceof Error ? error.message : 'Unknown error'
    return c.json({
      message: "An error occurred",
      error: errorMessage
    }, 500)
  }
})

// コントロールルート（新しいAPIキーの生成）
app.openapi(controlRoute, async (c) => {
  try {
    const { userId } = c.req.valid('json')
    const apiKey = crypto.randomUUID()

    // api_keysテーブルにデータを挿入
    await c.env.DB.prepare(
      "INSERT INTO api_keys (user_id, api_key) VALUES (?, ?)"
    )
      .bind(userId, apiKey)
      .run()

    return c.json({
      apiKey: apiKey
    }, 200)
  } catch (error) {
    console.error("Error in controlRoute:", error)
    const errorMessage = error instanceof Error ? error.message : 'Unknown error'
    return c.json({
      message: "An error occurred",
      error: errorMessage
    }, 500)
  }
})

// ウェイトリストユーザー一覧ルート
app.openapi(listRoute, async (c) => {
  try {
    const { apiKey } = c.req.valid('json')

    // APIキーの存在確認
    const { results: apiKeyResults } = await c.env.DB.prepare(
      "SELECT api_key FROM api_keys WHERE api_key = ?"
    )
      .bind(apiKey)
      .all()

    if (apiKeyResults.length === 0) {
      return c.json({
        message: "Invalid API key"
      }, 400)
    }

    // ウェイトリストのユーザーを取得
    const { results: waitlistUsers } = await c.env.DB.prepare(
      "SELECT email, created_at FROM waitlist WHERE api_key = ? ORDER BY created_at DESC"
    )
      .bind(apiKey)
      .all()

    return c.json({
      users: waitlistUsers as { email: string; created_at: string }[]
    }, 200)
  } catch (error) {
    console.error("Error in listRoute:", error)
    const errorMessage = error instanceof Error ? error.message : 'Unknown error'
    return c.json({
      message: "An error occurred",
      error: errorMessage
    }, 500)
  }
})

// The OpenAPI documentation will be available at /doc
app.doc('/doc', {
  openapi: '3.0.0',
  info: {
    version: '1.0.0',
    title: 'My API',
  },
})

export default app
