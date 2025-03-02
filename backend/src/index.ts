
import { OpenAPIHono } from '@hono/zod-openapi'
import { dataRoute } from './routes/data'
import { controlRoute } from './routes/control'

const app = new OpenAPIHono()

app.openapi(dataRoute, (c) => {
  const { apiKey, email } = c.req.valid('json')
  // write to Cloudflare d1
  return c.json({
    message: "success"
  })
})


app.openapi(controlRoute, (c) => {
  const { userId } = c.req.valid('json')
  const apiKey = crypto.randomUUID()
  // write apikey to Cloudflare d1
  return c.json({
    apiKey: apiKey
  })
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
