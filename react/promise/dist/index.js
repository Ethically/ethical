'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _propTypes = require('prop-types');

var _propTypes2 = _interopRequireDefault(_propTypes);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var promiser = function promiser(Component) {
    var Promiser = function (_React$Component) {
        _inherits(Promiser, _React$Component);

        function Promiser() {
            _classCallCheck(this, Promiser);

            return _possibleConstructorReturn(this, (Promiser.__proto__ || Object.getPrototypeOf(Promiser)).apply(this, arguments));
        }

        _createClass(Promiser, [{
            key: 'render',
            value: function render() {
                var promise = this.context.promise;

                return _react2.default.createElement(Component, Object.assign({}, this.props, { promise: promise }));
            }
        }]);

        return Promiser;
    }(_react2.default.Component);

    Promiser.contextTypes = {
        promise: _propTypes2.default.func
    };

    return Promiser;
};

exports.default = promiser;
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbInJlYWN0L3Byb21pc2Uvc3JjL2luZGV4LmpzIl0sIm5hbWVzIjpbInByb21pc2VyIiwiQ29tcG9uZW50IiwiUHJvbWlzZXIiLCJwcm9taXNlIiwiY29udGV4dCIsInByb3BzIiwiY29udGV4dFR5cGVzIiwiZnVuYyJdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7QUFBQTs7OztBQUNBOzs7Ozs7Ozs7Ozs7QUFFQSxJQUFNQSxXQUFXLFNBQVhBLFFBQVcsQ0FBQ0MsU0FBRCxFQUFlO0FBQUEsUUFDdEJDLFFBRHNCO0FBQUE7O0FBQUE7QUFBQTs7QUFBQTtBQUFBOztBQUFBO0FBQUE7QUFBQSxxQ0FFZjtBQUFBLG9CQUNHQyxPQURILEdBQ2UsS0FBS0MsT0FEcEIsQ0FDR0QsT0FESDs7QUFFTCx1QkFBTyw4QkFBQyxTQUFELG9CQUFxQixLQUFLRSxLQUExQixJQUFpQ0YsZ0JBQWpDLElBQVA7QUFDSDtBQUx1Qjs7QUFBQTtBQUFBLE1BQ0wsZ0JBQU1GLFNBREQ7O0FBUTVCQyxhQUFTSSxZQUFULEdBQXdCO0FBQ3BCSCxpQkFBUyxvQkFBVUk7QUFEQyxLQUF4Qjs7QUFJQSxXQUFPTCxRQUFQO0FBQ0gsQ0FiRDs7a0JBZWVGLFEiLCJmaWxlIjoidW5rbm93biIsInNvdXJjZVJvb3QiOiJub2RlX21vZHVsZXMvZXRoaWNhbCIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCBSZWFjdCBmcm9tICdyZWFjdCdcbmltcG9ydCBQcm9wVHlwZXMgZnJvbSAncHJvcC10eXBlcydcblxuY29uc3QgcHJvbWlzZXIgPSAoQ29tcG9uZW50KSA9PiB7XG4gICAgY2xhc3MgUHJvbWlzZXIgZXh0ZW5kcyBSZWFjdC5Db21wb25lbnQge1xuICAgICAgICByZW5kZXIoKSB7XG4gICAgICAgICAgICBjb25zdCB7IHByb21pc2UgfSA9IHRoaXMuY29udGV4dFxuICAgICAgICAgICAgcmV0dXJuIDxDb21wb25lbnQgeyAuLi57IC4uLnRoaXMucHJvcHMsIHByb21pc2UgfSB9IC8+XG4gICAgICAgIH1cbiAgICB9XG5cbiAgICBQcm9taXNlci5jb250ZXh0VHlwZXMgPSB7XG4gICAgICAgIHByb21pc2U6IFByb3BUeXBlcy5mdW5jXG4gICAgfVxuXG4gICAgcmV0dXJuIFByb21pc2VyXG59XG5cbmV4cG9ydCBkZWZhdWx0IHByb21pc2VyXG4iXX0=