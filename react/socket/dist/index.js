'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _propTypes = require('prop-types');

var _propTypes2 = _interopRequireDefault(_propTypes);

var _isNode = require('../../../helper/is-node');

var _isNode2 = _interopRequireDefault(_isNode);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

// import socketIO from 'socket.io-client'

var socket = function socket(Component) {
    var config = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};
    var _config$port = config.port,
        port = _config$port === undefined ? 9292 : _config$port,
        _config$loading = config.loading,
        loading = _config$loading === undefined ? _react2.default.createElement(
        'socket-loading',
        null,
        'Loading socket...'
    ) : _config$loading;

    var Socket = function (_React$Component) {
        _inherits(Socket, _React$Component);

        function Socket() {
            var _ref;

            var _temp, _this, _ret;

            _classCallCheck(this, Socket);

            for (var _len = arguments.length, args = Array(_len), _key = 0; _key < _len; _key++) {
                args[_key] = arguments[_key];
            }

            return _ret = (_temp = (_this = _possibleConstructorReturn(this, (_ref = Socket.__proto__ || Object.getPrototypeOf(Socket)).call.apply(_ref, [this].concat(args))), _this), _this.state = {
                io: null
            }, _temp), _possibleConstructorReturn(_this, _ret);
        }

        _createClass(Socket, [{
            key: 'startSocket',
            value: function startSocket() {
                if ((0, _isNode2.default)()) {
                    return;
                }
                // const io = socketIO()
                // io.on('connect', () => {
                //     this.setState({ io })
                // })
            }
        }, {
            key: 'componentWillMount',
            value: function componentWillMount() {
                this.startSocket();
            }
        }, {
            key: 'render',
            value: function render() {
                var io = this.state.io;

                if (!io) {
                    return loading;
                }
                return _react2.default.createElement(Component, Object.assign({}, this.props, { io: io }));
            }
        }]);

        return Socket;
    }(_react2.default.Component);

    return Socket;
};

exports.default = socket;
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbInJlYWN0L3NvY2tldC9zcmMvaW5kZXguanMiXSwibmFtZXMiOlsic29ja2V0IiwiQ29tcG9uZW50IiwiY29uZmlnIiwicG9ydCIsImxvYWRpbmciLCJTb2NrZXQiLCJzdGF0ZSIsImlvIiwic3RhcnRTb2NrZXQiLCJwcm9wcyJdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7QUFBQTs7OztBQUNBOzs7O0FBQ0E7Ozs7Ozs7Ozs7OztBQUNBOztBQUVBLElBQU1BLFNBQVMsU0FBVEEsTUFBUyxDQUFDQyxTQUFELEVBQTRCO0FBQUEsUUFBaEJDLE1BQWdCLHVFQUFQLEVBQU87QUFBQSx1QkFLbkNBLE1BTG1DLENBR25DQyxJQUhtQztBQUFBLFFBR25DQSxJQUhtQyxnQ0FHNUIsSUFINEI7QUFBQSwwQkFLbkNELE1BTG1DLENBSW5DRSxPQUptQztBQUFBLFFBSW5DQSxPQUptQyxtQ0FJdkI7QUFBQTtBQUFBO0FBQUE7QUFBQSxLQUp1Qjs7QUFBQSxRQU9qQ0MsTUFQaUM7QUFBQTs7QUFBQTtBQUFBOztBQUFBOztBQUFBOztBQUFBO0FBQUE7QUFBQTs7QUFBQSw4TEFRbkNDLEtBUm1DLEdBUTNCO0FBQ0pDLG9CQUFJO0FBREEsYUFSMkI7QUFBQTs7QUFBQTtBQUFBO0FBQUEsMENBV3JCO0FBQ1Ysb0JBQUksdUJBQUosRUFBYztBQUNWO0FBQ0g7QUFDRDtBQUNBO0FBQ0E7QUFDQTtBQUNIO0FBbkJrQztBQUFBO0FBQUEsaURBb0JkO0FBQ2pCLHFCQUFLQyxXQUFMO0FBQ0g7QUF0QmtDO0FBQUE7QUFBQSxxQ0F1QjFCO0FBQUEsb0JBQ0dELEVBREgsR0FDVSxLQUFLRCxLQURmLENBQ0dDLEVBREg7O0FBRUwsb0JBQUksQ0FBQ0EsRUFBTCxFQUFTO0FBQ0wsMkJBQU9ILE9BQVA7QUFDSDtBQUNELHVCQUFPLDhCQUFDLFNBQUQsb0JBQXFCLEtBQUtLLEtBQTFCLElBQWlDRixNQUFqQyxJQUFQO0FBQ0g7QUE3QmtDOztBQUFBO0FBQUEsTUFPbEIsZ0JBQU1OLFNBUFk7O0FBZ0N2QyxXQUFPSSxNQUFQO0FBQ0gsQ0FqQ0Q7O2tCQW1DZUwsTSIsImZpbGUiOiJ1bmtub3duIiwic291cmNlUm9vdCI6Im5vZGVfbW9kdWxlcy9ldGhpY2FsIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IFJlYWN0IGZyb20gJ3JlYWN0J1xuaW1wb3J0IFByb3BUeXBlcyBmcm9tICdwcm9wLXR5cGVzJ1xuaW1wb3J0IGlzTm9kZSBmcm9tICcuLi8uLi8uLi9oZWxwZXIvaXMtbm9kZSdcbi8vIGltcG9ydCBzb2NrZXRJTyBmcm9tICdzb2NrZXQuaW8tY2xpZW50J1xuXG5jb25zdCBzb2NrZXQgPSAoQ29tcG9uZW50LCBjb25maWcgPSB7fSkgPT4ge1xuXG4gICAgY29uc3Qge1xuICAgICAgICBwb3J0ID0gOTI5MixcbiAgICAgICAgbG9hZGluZyA9ICggPHNvY2tldC1sb2FkaW5nPkxvYWRpbmcgc29ja2V0Li4uPC9zb2NrZXQtbG9hZGluZz4gKVxuICAgIH0gPSBjb25maWdcblxuICAgIGNsYXNzIFNvY2tldCBleHRlbmRzIFJlYWN0LkNvbXBvbmVudCB7XG4gICAgICAgIHN0YXRlID0ge1xuICAgICAgICAgICAgaW86IG51bGxcbiAgICAgICAgfVxuICAgICAgICBzdGFydFNvY2tldCgpIHtcbiAgICAgICAgICAgIGlmIChpc05vZGUoKSkge1xuICAgICAgICAgICAgICAgIHJldHVyblxuICAgICAgICAgICAgfVxuICAgICAgICAgICAgLy8gY29uc3QgaW8gPSBzb2NrZXRJTygpXG4gICAgICAgICAgICAvLyBpby5vbignY29ubmVjdCcsICgpID0+IHtcbiAgICAgICAgICAgIC8vICAgICB0aGlzLnNldFN0YXRlKHsgaW8gfSlcbiAgICAgICAgICAgIC8vIH0pXG4gICAgICAgIH1cbiAgICAgICAgY29tcG9uZW50V2lsbE1vdW50KCkge1xuICAgICAgICAgICAgdGhpcy5zdGFydFNvY2tldCgpXG4gICAgICAgIH1cbiAgICAgICAgcmVuZGVyKCkge1xuICAgICAgICAgICAgY29uc3QgeyBpbyB9ID0gdGhpcy5zdGF0ZVxuICAgICAgICAgICAgaWYgKCFpbykge1xuICAgICAgICAgICAgICAgIHJldHVybiBsb2FkaW5nXG4gICAgICAgICAgICB9XG4gICAgICAgICAgICByZXR1cm4gPENvbXBvbmVudCB7IC4uLnsgLi4udGhpcy5wcm9wcywgaW8gfSB9IC8+XG4gICAgICAgIH1cbiAgICB9XG5cbiAgICByZXR1cm4gU29ja2V0XG59XG5cbmV4cG9ydCBkZWZhdWx0IHNvY2tldFxuIl19