const GITHUB_OAUTH_URL = 'https://github.com/login/oauth/authorize'
const SCOPE = ''
const client_id = ''

module.exports = {
    github: {
        client_id,
        client_secret: '',
        request_token_url: 'https://github.com/login/oauth/access_token',
    },
    GITHUB_OAUTH_URL,
    OAUTH_URL: `${GITHUB_OAUTH_URL}?client_id=${client_id}&scope=${SCOPE}`
}