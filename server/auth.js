const axios = require('axios')
const config = require('../config')

const { client_id, client_secret, request_token_url } = config.github

module.exports = (server) => {
    server.use(async (ctx, next) => {
        if (ctx.path === '/auth') {
            const code = ctx.query.code
            if (!code) {
                ctx.body = 'code is not exist'
                return
            }
            const result = await axios({
                method: 'POST',
                url: request_token_url,
                data: {
                    client_id, client_secret, code
                },
                headers: {
                    Accept: 'application/json'
                }
            })
            if (result.status === 200 && (result.data && !result.data.error)) {
                ctx.session.githubAuth = result.data
                const { access_token, token_type } = result.data
                const userInfoResp = await axios({
                    method: "GET",
                    url: 'https://api.github.com/user',
                    headers: {
                        "Authorization": `${token_type} ${access_token}`
                    }
                })
                ctx.session.userInfo = userInfoResp.data;
                ctx.redirect((ctx.session && ctx.session.urlBeforeOAuth) || '/')
                ctx.session.urlBeforeOAuth = null
            } else {
                const errorMsg = result.data && result.data.error
                ctx.body = `request token failed ${errorMsg}`
            }
        } else {
            await next()
        }
    })
    server.use(async (ctx, next) => {
        if (ctx.path === '/logout' && ctx.method === 'POST') {
            ctx.session = null;
            ctx.body = `login out success`
        } else {
            await next()
        }
    })
    server.use(async (ctx, next) => {
        if (ctx.path === '/prepare-auth' && ctx.method === 'GET') {
            const url = ctx.query.url
            ctx.session.urlBeforeOAuth = url
            ctx.redirect(config.OAUTH_URL)
        } else {
            await next()
        }
    })
}