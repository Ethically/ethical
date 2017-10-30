import React from 'react'
import { connect } from 'react-redux'
import promise from 'ethical-react-component-higher-order-promise'

const Async = ({ promise, dispatch, welcome }) => {

    if (welcome) return <greeting>{welcome}</greeting>

    promise(Promise.resolve('Hello World!'))
    .then(response => {
        dispatch({
            type: 'SET_GREETING',
            payload: 'Welcome to the Ethical framework!'
        })
    })
    .catch(e => console.error(e))

    return <greeting>Loading greeting...</greeting>
}

const mapStateToProps = ({ welcome }) => ({ welcome })

export default connect(mapStateToProps)(promise(Async))
