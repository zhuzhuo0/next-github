const { request } = require('./../libs/api')

const Index = () => {
    return <span>Index</span>
}

Index.getInitialProps = async ({ ctx }) => {
    const result = await request({
        method: "GET",
        url: "/search/repositories?q=react",
        data: {}
    }, ctx.req)
    return {
        data: result.data
    }
}

export default Index