import React from 'react'
import PropTypes from 'prop-types'

const promiser = (Component) => {
    class Promiser extends React.Component {
        render() {
            const { promise } = this.context
            return <Component { ...{ ...this.props, promise } } />
        }
    }

    Promiser.contextTypes = {
        promise: PropTypes.func
    }

    return Promiser
}

export default promiser
