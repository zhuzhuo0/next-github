import App, { Container } from 'next/app'
import Layout from './../components/Layout'
import PageLoad from './../components/PageLoad'
import { Provider } from 'react-redux'
import WithRedux from './../libs/with-redux'
import Router from 'next/router'
import Link from 'next/link'
import axios from 'axios'

class MyApp extends App {

    state = {
        loading: false
    }

    static async getInitialProps(ctx) {
        const { Component } = ctx
        let pageProps = {}
        if (Component.getInitialProps) {
            pageProps = await Component.getInitialProps(ctx)
        }
        return {
            pageProps
        }
    }

    startLoading = () => {
        this.setState({
            loading: true
        })
    }

    stopLoading = () => {
        this.setState({
            loading: false
        })
    }

    componentDidMount() {
        Router.events.on('routeChangeStart', this.startLoading)
        Router.events.on('routeChangeComplete', this.stopLoading)
        Router.events.on('routeChangeError', this.stopLoading)

        // // 获取数据
        // axios.get('/github/search/repositories?q=react').then(res => {
        //     console.log(res.data)
        // })
    }

    componentWillUnmount() {
        Router.events.off('routeChangeStart', this.startLoading)
        Router.events.off('routeChangeComplete', this.stopLoading)
        Router.events.off('routeChangeError', this.stopLoading)
    }

    render() {
        const { Component, pageProps, reduxStore } = this.props
        return (
            <Container>
                <Provider store={reduxStore}>
                    {this.state.loading ? <PageLoad /> : null}
                    <Layout>
                        <Link href="/" >
                            <a>Index</a>
                        </Link>
                        <Link href="/detail" >
                            <a>Detail</a>
                        </Link>
                        <Component {...pageProps} />
                    </Layout>
                </Provider>
            </Container>
        )
    }
}

export default WithRedux(MyApp)