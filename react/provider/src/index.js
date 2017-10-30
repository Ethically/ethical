import 'babel-polyfill'
import { Component } from 'react'
import PropTypes from 'prop-types'

class PromiseProvider extends Component {
    getChildContext() {
        const { promise = (promise) => promise } = this.props
        return { promise }
    }
    render() {
        const { children = null } = this.props
        return children
    }
}

PromiseProvider.childContextTypes = {
    promise: PropTypes.func
}

export default PromiseProvider
