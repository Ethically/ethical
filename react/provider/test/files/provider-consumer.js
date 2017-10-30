const React = require('react')
const PropTypes = require('prop-types')

class ProviderConsumer extends React.Component {
    constructor () {
        super()
        this.state = { Component: <loading>Promise</loading> }
    }
    somePromise(schema, variables) {
        const { promise } = this.context
        return (
            promise(Promise.resolve('Success!'))
            .then(() => {
                this.setState({
                    Component: <complete>Promise</complete>
                })
            })
        )
    }
    componentWillMount () {
        this.somePromise()
    }
    render() {
        const { Component } = this.state
        return Component
    }
}

ProviderConsumer.contextTypes = {
    promise: PropTypes.func
}

module.exports = ProviderConsumer
