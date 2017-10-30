'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _reactRedux = require('react-redux');

var _ethicalReactComponentHigherOrderPromise = require('ethical-react-component-higher-order-promise');

var _ethicalReactComponentHigherOrderPromise2 = _interopRequireDefault(_ethicalReactComponentHigherOrderPromise);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

const Async = ({ promise, dispatch, welcome }) => {

    if (welcome) return _react2.default.createElement(
        'greeting',
        null,
        welcome
    );

    promise(Promise.resolve('Hello World!')).then(response => {
        dispatch({
            type: 'SET_GREETING',
            payload: 'Welcome to the Ethical framework!'
        });
    }).catch(e => console.error(e));

    return _react2.default.createElement(
        'greeting',
        null,
        'Loading greeting...'
    );
};

const mapStateToProps = ({ welcome }) => ({ welcome });

exports.default = (0, _reactRedux.connect)(mapStateToProps)((0, _ethicalReactComponentHigherOrderPromise2.default)(Async));
//# sourceMappingURL=Async.js.map