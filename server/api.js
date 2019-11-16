const github_base_url = 'https://api.github.com'
const axios = require('axios')

module.exports = (server) => {
    server.use(async (ctx, next) => {
        if (ctx.path.startsWith('/github/')) {
            const githubAuth = ctx.session.githubAuth
            const githubPath = `${github_base_url}${ctx.url.replace('/github/', '/')}`
            const token = githubAuth && githubAuth.access_token
            let headers = {}
            if (token) {
                headers['Authorization'] = `${githubAuth.token_type} ${githubAuth.access_token}`
            }
            try {
                const result = await axios({
                    method: "GET",
                    url: githubPath,
                    headers
                })
                if (result.status === 200) {
                    ctx.body = result.data
                    ctx.set('Content-Type', 'application/json')
                } else {
                    ctx.body = {
                        success: false
                    }
                    ctx.set('Content-Type', 'application/json')
                }
            } catch (error) {
                console.error(error)
                ctx.body = {
                    success: false
                }
                ctx.set('Content-Type', 'application/json')
            }
        } else {
            await next()
        }
    })
}