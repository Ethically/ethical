import React from 'react'
import PropTypes from 'prop-types'
import isNode from '../../../helper/is-node'
// import socketIO from 'socket.io-client'

const socket = (Component, config = {}) => {

    const {
        port = 9292,
        loading = ( <socket-loading>Loading socket...</socket-loading> )
    } = config

    class Socket extends React.Component {
        state = {
            io: null
        }
        startSocket() {
            if (isNode()) {
                return
            }
            // const io = socketIO()
            // io.on('connect', () => {
            //     this.setState({ io })
            // })
        }
        componentWillMount() {
            this.startSocket()
        }
        render() {
            const { io } = this.state
            if (!io) {
                return loading
            }
            return <Component { ...{ ...this.props, io } } />
        }
    }

    return Socket
}

export default socket
