import React from 'react'
import PropTypes from 'prop-types'
import isNode from '../../../helper/is-node'
import { requireModule, getRequire } from '../../../helper/resolve'

const lazy = (file) => {

    if (!isNode()) {
        window.require.warmup(file)
    }

    class Lazy extends React.Component {
        state = {
            Component: null,
            requested: false
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
                const code = 'MODULE_NOT_FOUND'
                if (!isNode() && e.code === code) {
                    const { requested } = this.state
                    if (requested) {
                        throw e
                    }
                    this.setState({ requested: true })
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
