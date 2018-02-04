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

var _resolve = require('../../../helper/resolve');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var lazy = function lazy(file) {

    if (!(0, _isNode2.default)()) {
        window.require.warmup(file);
    }

    var Lazy = function (_React$Component) {
        _inherits(Lazy, _React$Component);

        function Lazy() {
            var _ref;

            var _temp, _this, _ret;

            _classCallCheck(this, Lazy);

            for (var _len = arguments.length, args = Array(_len), _key = 0; _key < _len; _key++) {
                args[_key] = arguments[_key];
            }

            return _ret = (_temp = (_this = _possibleConstructorReturn(this, (_ref = Lazy.__proto__ || Object.getPrototypeOf(Lazy)).call.apply(_ref, [this].concat(args))), _this), _this.state = {
                Component: null,
                requested: false
            }, _temp), _possibleConstructorReturn(_this, _ret);
        }

        _createClass(Lazy, [{
            key: 'loadComponent',
            value: function loadComponent() {
                var _this2 = this;

                return (0, _resolve.getRequire)().load(file).then(function () {
                    return _this2.resolveComponent();
                }).catch(function (e) {
                    console.error(e);
                    return e;
                });
            }
        }, {
            key: 'resolveComponent',
            value: function resolveComponent() {
                try {
                    var module = (0, _resolve.requireModule)(file);
                    var Component = module.default;
                    Lazy.Component = Component;
                    this.setState({ Component: Component });
                } catch (e) {
                    var code = 'MODULE_NOT_FOUND';
                    if (!(0, _isNode2.default)() && e.code === code) {
                        var requested = this.state.requested;

                        if (requested) {
                            throw e;
                        }
                        this.setState({ requested: true });
                        return this.loadComponent();
                    }
                    throw e;
                }
            }
        }, {
            key: 'componentWillMount',
            value: function componentWillMount() {
                this.resolveComponent();
            }
        }, {
            key: 'render',
            value: function render() {
                var Component = this.state.Component;

                if (!Component) return null;
                return _react2.default.createElement(Component, this.props);
            }
        }]);

        return Lazy;
    }(_react2.default.Component);

    Lazy.contextTypes = {
        promises: _propTypes2.default.func
    };

    return Lazy;
};

exports.default = lazy;
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbInJlYWN0L2xhenkvc3JjL2luZGV4LmpzIl0sIm5hbWVzIjpbImxhenkiLCJmaWxlIiwid2luZG93IiwicmVxdWlyZSIsIndhcm11cCIsIkxhenkiLCJzdGF0ZSIsIkNvbXBvbmVudCIsInJlcXVlc3RlZCIsImxvYWQiLCJ0aGVuIiwicmVzb2x2ZUNvbXBvbmVudCIsImNhdGNoIiwiY29uc29sZSIsImVycm9yIiwiZSIsIm1vZHVsZSIsImRlZmF1bHQiLCJzZXRTdGF0ZSIsImNvZGUiLCJsb2FkQ29tcG9uZW50IiwicHJvcHMiLCJjb250ZXh0VHlwZXMiLCJwcm9taXNlcyIsImZ1bmMiXSwibWFwcGluZ3MiOiI7Ozs7Ozs7O0FBQUE7Ozs7QUFDQTs7OztBQUNBOzs7O0FBQ0E7Ozs7Ozs7Ozs7QUFFQSxJQUFNQSxPQUFPLFNBQVBBLElBQU8sQ0FBQ0MsSUFBRCxFQUFVOztBQUVuQixRQUFJLENBQUMsdUJBQUwsRUFBZTtBQUNYQyxlQUFPQyxPQUFQLENBQWVDLE1BQWYsQ0FBc0JILElBQXRCO0FBQ0g7O0FBSmtCLFFBTWJJLElBTmE7QUFBQTs7QUFBQTtBQUFBOztBQUFBOztBQUFBOztBQUFBO0FBQUE7QUFBQTs7QUFBQSwwTEFPZkMsS0FQZSxHQU9QO0FBQ0pDLDJCQUFXLElBRFA7QUFFSkMsMkJBQVc7QUFGUCxhQVBPO0FBQUE7O0FBQUE7QUFBQTtBQUFBLDRDQVdDO0FBQUE7O0FBQ1osdUJBQ0ksMkJBQ0NDLElBREQsQ0FDTVIsSUFETixFQUVDUyxJQUZELENBRU07QUFBQSwyQkFBTSxPQUFLQyxnQkFBTCxFQUFOO0FBQUEsaUJBRk4sRUFHQ0MsS0FIRCxDQUdPLGFBQUs7QUFDUkMsNEJBQVFDLEtBQVIsQ0FBY0MsQ0FBZDtBQUNBLDJCQUFPQSxDQUFQO0FBQ0gsaUJBTkQsQ0FESjtBQVNIO0FBckJjO0FBQUE7QUFBQSwrQ0FzQkk7QUFDZixvQkFBSTtBQUNBLHdCQUFNQyxTQUFTLDRCQUFjZixJQUFkLENBQWY7QUFDQSx3QkFBTU0sWUFBWVMsT0FBT0MsT0FBekI7QUFDQVoseUJBQUtFLFNBQUwsR0FBaUJBLFNBQWpCO0FBQ0EseUJBQUtXLFFBQUwsQ0FBYyxFQUFFWCxvQkFBRixFQUFkO0FBQ0gsaUJBTEQsQ0FLRSxPQUFPUSxDQUFQLEVBQVU7QUFDUix3QkFBTUksT0FBTyxrQkFBYjtBQUNBLHdCQUFJLENBQUMsdUJBQUQsSUFBYUosRUFBRUksSUFBRixLQUFXQSxJQUE1QixFQUFrQztBQUFBLDRCQUN0QlgsU0FEc0IsR0FDUixLQUFLRixLQURHLENBQ3RCRSxTQURzQjs7QUFFOUIsNEJBQUlBLFNBQUosRUFBZTtBQUNYLGtDQUFNTyxDQUFOO0FBQ0g7QUFDRCw2QkFBS0csUUFBTCxDQUFjLEVBQUVWLFdBQVcsSUFBYixFQUFkO0FBQ0EsK0JBQU8sS0FBS1ksYUFBTCxFQUFQO0FBQ0g7QUFDRCwwQkFBTUwsQ0FBTjtBQUNIO0FBQ0o7QUF4Q2M7QUFBQTtBQUFBLGlEQXlDTTtBQUNqQixxQkFBS0osZ0JBQUw7QUFDSDtBQTNDYztBQUFBO0FBQUEscUNBNENOO0FBQUEsb0JBQ0dKLFNBREgsR0FDaUIsS0FBS0QsS0FEdEIsQ0FDR0MsU0FESDs7QUFFTCxvQkFBSSxDQUFDQSxTQUFMLEVBQWdCLE9BQU8sSUFBUDtBQUNoQix1QkFBTyw4QkFBQyxTQUFELEVBQWUsS0FBS2MsS0FBcEIsQ0FBUDtBQUNIO0FBaERjOztBQUFBO0FBQUEsTUFNQSxnQkFBTWQsU0FOTjs7QUFtRG5CRixTQUFLaUIsWUFBTCxHQUFvQjtBQUNoQkMsa0JBQVUsb0JBQVVDO0FBREosS0FBcEI7O0FBSUEsV0FBT25CLElBQVA7QUFDSCxDQXhERDs7a0JBMERlTCxJIiwiZmlsZSI6InVua25vd24iLCJzb3VyY2VSb290Ijoibm9kZV9tb2R1bGVzL2V0aGljYWwiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgUmVhY3QgZnJvbSAncmVhY3QnXG5pbXBvcnQgUHJvcFR5cGVzIGZyb20gJ3Byb3AtdHlwZXMnXG5pbXBvcnQgaXNOb2RlIGZyb20gJy4uLy4uLy4uL2hlbHBlci9pcy1ub2RlJ1xuaW1wb3J0IHsgcmVxdWlyZU1vZHVsZSwgZ2V0UmVxdWlyZSB9IGZyb20gJy4uLy4uLy4uL2hlbHBlci9yZXNvbHZlJ1xuXG5jb25zdCBsYXp5ID0gKGZpbGUpID0+IHtcblxuICAgIGlmICghaXNOb2RlKCkpIHtcbiAgICAgICAgd2luZG93LnJlcXVpcmUud2FybXVwKGZpbGUpXG4gICAgfVxuXG4gICAgY2xhc3MgTGF6eSBleHRlbmRzIFJlYWN0LkNvbXBvbmVudCB7XG4gICAgICAgIHN0YXRlID0ge1xuICAgICAgICAgICAgQ29tcG9uZW50OiBudWxsLFxuICAgICAgICAgICAgcmVxdWVzdGVkOiBmYWxzZVxuICAgICAgICB9XG4gICAgICAgIGxvYWRDb21wb25lbnQoKSB7XG4gICAgICAgICAgICByZXR1cm4gKFxuICAgICAgICAgICAgICAgIGdldFJlcXVpcmUoKVxuICAgICAgICAgICAgICAgIC5sb2FkKGZpbGUpXG4gICAgICAgICAgICAgICAgLnRoZW4oKCkgPT4gdGhpcy5yZXNvbHZlQ29tcG9uZW50KCkpXG4gICAgICAgICAgICAgICAgLmNhdGNoKGUgPT4ge1xuICAgICAgICAgICAgICAgICAgICBjb25zb2xlLmVycm9yKGUpXG4gICAgICAgICAgICAgICAgICAgIHJldHVybiBlXG4gICAgICAgICAgICAgICAgfSlcbiAgICAgICAgICAgIClcbiAgICAgICAgfVxuICAgICAgICByZXNvbHZlQ29tcG9uZW50KCkge1xuICAgICAgICAgICAgdHJ5IHtcbiAgICAgICAgICAgICAgICBjb25zdCBtb2R1bGUgPSByZXF1aXJlTW9kdWxlKGZpbGUpXG4gICAgICAgICAgICAgICAgY29uc3QgQ29tcG9uZW50ID0gbW9kdWxlLmRlZmF1bHRcbiAgICAgICAgICAgICAgICBMYXp5LkNvbXBvbmVudCA9IENvbXBvbmVudFxuICAgICAgICAgICAgICAgIHRoaXMuc2V0U3RhdGUoeyBDb21wb25lbnQgfSlcbiAgICAgICAgICAgIH0gY2F0Y2ggKGUpIHtcbiAgICAgICAgICAgICAgICBjb25zdCBjb2RlID0gJ01PRFVMRV9OT1RfRk9VTkQnXG4gICAgICAgICAgICAgICAgaWYgKCFpc05vZGUoKSAmJiBlLmNvZGUgPT09IGNvZGUpIHtcbiAgICAgICAgICAgICAgICAgICAgY29uc3QgeyByZXF1ZXN0ZWQgfSA9IHRoaXMuc3RhdGVcbiAgICAgICAgICAgICAgICAgICAgaWYgKHJlcXVlc3RlZCkge1xuICAgICAgICAgICAgICAgICAgICAgICAgdGhyb3cgZVxuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgIHRoaXMuc2V0U3RhdGUoeyByZXF1ZXN0ZWQ6IHRydWUgfSlcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuIHRoaXMubG9hZENvbXBvbmVudCgpXG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIHRocm93IGVcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgICBjb21wb25lbnRXaWxsTW91bnQoKSB7XG4gICAgICAgICAgICB0aGlzLnJlc29sdmVDb21wb25lbnQoKVxuICAgICAgICB9XG4gICAgICAgIHJlbmRlcigpIHtcbiAgICAgICAgICAgIGNvbnN0IHsgQ29tcG9uZW50IH0gPSB0aGlzLnN0YXRlXG4gICAgICAgICAgICBpZiAoIUNvbXBvbmVudCkgcmV0dXJuIG51bGxcbiAgICAgICAgICAgIHJldHVybiA8Q29tcG9uZW50IHsuLi50aGlzLnByb3BzfSAvPlxuICAgICAgICB9XG4gICAgfVxuXG4gICAgTGF6eS5jb250ZXh0VHlwZXMgPSB7XG4gICAgICAgIHByb21pc2VzOiBQcm9wVHlwZXMuZnVuY1xuICAgIH1cblxuICAgIHJldHVybiBMYXp5XG59XG5cbmV4cG9ydCBkZWZhdWx0IGxhenlcbiJdfQ==