const Koa = require('koa')
const next = require('next')
const session = require('koa-session')
const Router = require('koa-router')
const koaBody = require('koa-body')
const Redis = require('ioredis')
const RedisSessionStore = require('./server/session-store')

const auth = require('./server/auth')
const api = require('./server/api')

const redis = new Redis()

const dev = process.env.NODE_ENV !== 'production'

const app = next({ dev })

const handle = app.getRequestHandler()

app.prepare().then(() => {
    const server = new Koa()
    const router = new Router()

    server.keys = ['next github']
    const SESSION_CONFIG = {
        key: "demo",
        store: new RedisSessionStore(redis)
    }

    server.use(session(SESSION_CONFIG, server))

    server.use(koaBody())

    auth(server)
    api(server)

    router.get('/api/user/info', async (ctx) => {
        const user = ctx.session.userInfo
        if (!user) {
            ctx.status = 401
            ctx.body = 'Need Login'
        } else {
            ctx.body = user
            ctx.set('Content-Type', 'application/json')
        }
    })

    server.use(router.routes())

    server.use(async (ctx, next) => {
        ctx.req.session = ctx.session
        await handle(ctx.req, ctx.res)
        ctx.respond = false
    })

    server.listen(3000, () => {
        console.log('server is running at port 3000')
    })
})