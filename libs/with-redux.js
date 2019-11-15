import React, { Component } from 'react'
import createStore from './../store/store'

const isServer = typeof window === 'undefined'
const __NEXT_REDUX_STORE__ = '__NEXT_REDUX_STORE__'

const getOrCreateStore = (initialState) => {
    if (isServer) {
        return createStore(initialState)
    }
    if (!window[__NEXT_REDUX_STORE__]) {
        window[__NEXT_REDUX_STORE__] = createStore(initialState)
    }
    return window[__NEXT_REDUX_STORE__]
}

export default (Comp) => {

    class WithRedux extends Component {

        constructor(props) {
            super(props)
            // 在创建WithRedux组件的时候创建store
            this.reduxStore = getOrCreateStore(props.initialReduxState)
        }

        render() {
            const { Component, pageProps, ...rest } = this.props
            return <Comp Component={Component} pageProps={pageProps} {...rest} reduxStore={this.reduxStore} />
        }
    }

    WithRedux.getInitialProps = async (ctx) => {

        let reduxStore = null

        if (isServer) {
            const { req } = ctx.ctx
            const session = req.session
            if (session && session.userInfo) {
                reduxStore = getOrCreateStore({
                    user: session.userInfo
                })
            } else {
                reduxStore = getOrCreateStore()
            }
        } else {
            reduxStore = getOrCreateStore()
        }

        ctx.reduxStore = reduxStore
        let appProps = {}
        if (typeof Comp.getInitialProps === 'function') {
            appProps = await Comp.getInitialProps(ctx)
        }
        return {
            ...appProps,
            initialReduxState: reduxStore.getState()
        }
    }

    return WithRedux

}