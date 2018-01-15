import React from 'react'
import PropTypes from 'prop-types'
import isNode from '../../../helper/is-node'
import { requireModule, getRequire } from '../../../helper/resolve'

const lazy = (file) => {

    class Lazy extends React.Component {
        state = {
            Component: null,
            loading: null
        }
        loadComponent() {
            return (
                getRequire()
                .load(file)
                .then(() => this.resolveComponent())
                .catch(e => {
                    console.error(e)
                    return e
                })
            )
        }
        resolveComponent() {
            try {
                const module = requireModule(file)
                const Component = module.default
                Lazy.Component = Component
                this.setState({ Component })
            } catch (e) {
                if (!isNode() && e.code === 'MODULE_NOT_FOUND') {
                    const { loading } = this.state
                    if (loading === file) {
                        throw e
                    }
                    this.setState({ loading: file })
                    return this.loadComponent()
                }
                throw e
            }
        }
        componentWillMount() {
            this.resolveComponent()
        }
        render() {
            const { Component } = this.state
            if (!Component) return null
            return <Component {...this.props} />
        }
    }

    Lazy.contextTypes = {
        promises: PropTypes.func
    }

    return Lazy
}

export default lazy
