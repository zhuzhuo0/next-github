const axios = require('axios')
const github_base_url = 'https://api.github.com'

const requestGithub = async (method, url, data, headers) => {
    return axios({
        method, url, data, headers
    })
}

const request = async ({ method = 'GET', url, data = {} }, req) => {
    if (!url) {
        throw new Error('url must be provide')
    }
    const isServer = typeof window === 'undefined'
    if (isServer) {
        const session = req.session;
        const githubAuth = session.githubAuth || {}
        let headers = {}
        if (githubAuth && githubAuth.access_token) {
            headers['Authorization'] = `${githubAuth.token_type} ${githubAuth.access_token}`
        }
        return await requestGithub(method, `${github_base_url}${url}`, data, headers)
    } else {
        return await axios({ method, url: `/github${url}`, data })
    }
}

module.exports = {
    request, requestGithub
}