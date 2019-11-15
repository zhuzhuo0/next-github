const GITHUB_OAUTH_URL = 'https://github.com/login/oauth/authorize'
const SCOPE = 'user'
const client_id = '171a5174b9fe107ccaeb'

module.exports = {
    github: {
        client_id,
        client_secret: 'e43ee449385f39df40a2c72d099da3040e24aa17',
        request_token_url: 'https://github.com/login/oauth/access_token',
    },
    GITHUB_OAUTH_URL,
    OAUTH_URL: `${GITHUB_OAUTH_URL}?client_id=${client_id}&scope=${SCOPE}`
}