const github_base_url = 'https://api.github.com'
const { requestGithub } = require('./../libs/api')

module.exports = (server) => {
    server.use(async (ctx, next) => {
        if (ctx.path.startsWith('/github/')) {
            console.log(ctx.request.body)
            const session = ctx.session;
            const githubAuth = session && session.githubAuth;
            const githubPath = `${github_base_url}${ctx.url.replace('/github/', '/')}`
            const token = githubAuth && githubAuth.access_token
            let headers = {}
            if (token) {
                headers['Authorization'] = `${githubAuth.token_type} ${githubAuth.access_token}`
            }
            const result = await requestGithub(ctx.method, githubPath, ctx.request.body || {}, headers);
            ctx.status = result.status
            ctx.body = result.data
        } else {
            await next()
        }
    })
}