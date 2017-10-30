'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _reactRouterDom = require('react-router-dom');

var _ethicalReactComponentRoot = require('ethical-react-component-root');

var _ethicalReactComponentRoot2 = _interopRequireDefault(_ethicalReactComponentRoot);

var _Home = require('./components/Home.js');

var _Home2 = _interopRequireDefault(_Home);

var _Async = require('./components/Async.js');

var _Async2 = _interopRequireDefault(_Async);

var _Redirect = require('./components/Redirect.js');

var _Redirect2 = _interopRequireDefault(_Redirect);

var _Redirected = require('./components/Redirected.js');

var _Redirected2 = _interopRequireDefault(_Redirected);

var _reactHelmet = require('react-helmet');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

exports.default = _react2.default.createElement(
    _ethicalReactComponentRoot2.default,
    null,
    _react2.default.createElement(
        _reactHelmet.Helmet,
        null,
        _react2.default.createElement(
            'title',
            null,
            'Default Title'
        ),
        _react2.default.createElement('meta', { name: 'description', content: 'Default Description' })
    ),
    _react2.default.createElement(_reactRouterDom.Route, { exact: true, path: '/', component: _Home2.default }),
    _react2.default.createElement(_reactRouterDom.Route, { path: '/async', component: _Async2.default }),
    _react2.default.createElement(_reactRouterDom.Route, { path: '/redirect', component: _Redirect2.default }),
    _react2.default.createElement(_reactRouterDom.Route, { path: '/redirected', component: _Redirected2.default })
);
//# sourceMappingURL=Routes.js.map