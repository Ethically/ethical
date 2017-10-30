'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

exports.default = ({ title, meta, link, html, body, root, scripts }) => _react2.default.createElement(
    'html',
    html,
    _react2.default.createElement(
        'head',
        null,
        title,
        meta,
        link
    ),
    _react2.default.createElement(
        'body',
        body,
        root,
        scripts
    )
);
//# sourceMappingURL=Layout.js.map