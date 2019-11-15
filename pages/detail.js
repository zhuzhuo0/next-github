const Detail = () => (<span>Detail</span>)

Detail.getInitialProps = () => {
    return new Promise((resolve, reject) => {
        setTimeout(() => {
            resolve({})
        }, 1000)
    })
}

export default Detail