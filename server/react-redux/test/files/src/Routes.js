import React from 'react'
import { Route } from 'react-router-dom'
import Root from 'ethical-react-component-root'
import Home from './components/Home.js'
import Async from './components/Async.js'
import Redirect from './components/Redirect.js'
import Redirected from './components/Redirected.js'
import { Helmet } from 'react-helmet'

export default (
    <Root>
        <Helmet>
            <title>Default Title</title>
            <meta name="description" content="Default Description" />
        </Helmet>
        <Route exact path="/" component={Home}/>
        <Route path="/async" component={Async}/>
        <Route path="/redirect" component={Redirect}/>
        <Route path="/redirected" component={Redirected}/>
    </Root>
)
