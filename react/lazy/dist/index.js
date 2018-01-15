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
                loading: null
            }, _temp), _possibleConstructorReturn(_this, _ret);
        }

        _createClass(Lazy, [{
            key: 'loadComponent',
            value: function loadComponent() {
                var _this2 = this;

                console.log('Loading', file);
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
                    if (!(0, _isNode2.default)() && e.code === 'MODULE_NOT_FOUND') {
                        var loading = this.state.loading;

                        if (loading === file) {
                            throw e;
                        }
                        this.setState({ loading: file });
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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbInJlYWN0L2xhenkvc3JjL2luZGV4LmpzIl0sIm5hbWVzIjpbImxhenkiLCJmaWxlIiwiTGF6eSIsInN0YXRlIiwiQ29tcG9uZW50IiwibG9hZGluZyIsImNvbnNvbGUiLCJsb2ciLCJsb2FkIiwidGhlbiIsInJlc29sdmVDb21wb25lbnQiLCJjYXRjaCIsImVycm9yIiwiZSIsIm1vZHVsZSIsImRlZmF1bHQiLCJzZXRTdGF0ZSIsImNvZGUiLCJsb2FkQ29tcG9uZW50IiwicHJvcHMiLCJjb250ZXh0VHlwZXMiLCJwcm9taXNlcyIsImZ1bmMiXSwibWFwcGluZ3MiOiI7Ozs7Ozs7O0FBQUE7Ozs7QUFDQTs7OztBQUNBOzs7O0FBQ0E7Ozs7Ozs7Ozs7QUFFQSxJQUFNQSxPQUFPLFNBQVBBLElBQU8sQ0FBQ0MsSUFBRCxFQUFVO0FBQUEsUUFFYkMsSUFGYTtBQUFBOztBQUFBO0FBQUE7O0FBQUE7O0FBQUE7O0FBQUE7QUFBQTtBQUFBOztBQUFBLDBMQUdmQyxLQUhlLEdBR1A7QUFDSkMsMkJBQVcsSUFEUDtBQUVKQyx5QkFBUztBQUZMLGFBSE87QUFBQTs7QUFBQTtBQUFBO0FBQUEsNENBT0M7QUFBQTs7QUFDWkMsd0JBQVFDLEdBQVIsQ0FBWSxTQUFaLEVBQXVCTixJQUF2QjtBQUNBLHVCQUNJLDJCQUNDTyxJQURELENBQ01QLElBRE4sRUFFQ1EsSUFGRCxDQUVNO0FBQUEsMkJBQU0sT0FBS0MsZ0JBQUwsRUFBTjtBQUFBLGlCQUZOLEVBR0NDLEtBSEQsQ0FHTyxhQUFLO0FBQ1JMLDRCQUFRTSxLQUFSLENBQWNDLENBQWQ7QUFDQSwyQkFBT0EsQ0FBUDtBQUNILGlCQU5ELENBREo7QUFTSDtBQWxCYztBQUFBO0FBQUEsK0NBbUJJO0FBQ2Ysb0JBQUk7QUFDQSx3QkFBTUMsU0FBUyw0QkFBY2IsSUFBZCxDQUFmO0FBQ0Esd0JBQU1HLFlBQVlVLE9BQU9DLE9BQXpCO0FBQ0FiLHlCQUFLRSxTQUFMLEdBQWlCQSxTQUFqQjtBQUNBLHlCQUFLWSxRQUFMLENBQWMsRUFBRVosb0JBQUYsRUFBZDtBQUNILGlCQUxELENBS0UsT0FBT1MsQ0FBUCxFQUFVO0FBQ1Isd0JBQUksQ0FBQyx1QkFBRCxJQUFhQSxFQUFFSSxJQUFGLEtBQVcsa0JBQTVCLEVBQWdEO0FBQUEsNEJBQ3BDWixPQURvQyxHQUN4QixLQUFLRixLQURtQixDQUNwQ0UsT0FEb0M7O0FBRTVDLDRCQUFJQSxZQUFZSixJQUFoQixFQUFzQjtBQUNsQixrQ0FBTVksQ0FBTjtBQUNIO0FBQ0QsNkJBQUtHLFFBQUwsQ0FBYyxFQUFFWCxTQUFTSixJQUFYLEVBQWQ7QUFDQSwrQkFBTyxLQUFLaUIsYUFBTCxFQUFQO0FBQ0g7QUFDRCwwQkFBTUwsQ0FBTjtBQUNIO0FBQ0o7QUFwQ2M7QUFBQTtBQUFBLGlEQXFDTTtBQUNqQixxQkFBS0gsZ0JBQUw7QUFDSDtBQXZDYztBQUFBO0FBQUEscUNBd0NOO0FBQUEsb0JBQ0dOLFNBREgsR0FDaUIsS0FBS0QsS0FEdEIsQ0FDR0MsU0FESDs7QUFFTCxvQkFBSSxDQUFDQSxTQUFMLEVBQWdCLE9BQU8sSUFBUDtBQUNoQix1QkFBTyw4QkFBQyxTQUFELEVBQWUsS0FBS2UsS0FBcEIsQ0FBUDtBQUNIO0FBNUNjOztBQUFBO0FBQUEsTUFFQSxnQkFBTWYsU0FGTjs7QUErQ25CRixTQUFLa0IsWUFBTCxHQUFvQjtBQUNoQkMsa0JBQVUsb0JBQVVDO0FBREosS0FBcEI7O0FBSUEsV0FBT3BCLElBQVA7QUFDSCxDQXBERDs7a0JBc0RlRixJIiwiZmlsZSI6InVua25vd24iLCJzb3VyY2VSb290Ijoibm9kZV9tb2R1bGVzL2V0aGljYWwiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgUmVhY3QgZnJvbSAncmVhY3QnXG5pbXBvcnQgUHJvcFR5cGVzIGZyb20gJ3Byb3AtdHlwZXMnXG5pbXBvcnQgaXNOb2RlIGZyb20gJy4uLy4uLy4uL2hlbHBlci9pcy1ub2RlJ1xuaW1wb3J0IHsgcmVxdWlyZU1vZHVsZSwgZ2V0UmVxdWlyZSB9IGZyb20gJy4uLy4uLy4uL2hlbHBlci9yZXNvbHZlJ1xuXG5jb25zdCBsYXp5ID0gKGZpbGUpID0+IHtcblxuICAgIGNsYXNzIExhenkgZXh0ZW5kcyBSZWFjdC5Db21wb25lbnQge1xuICAgICAgICBzdGF0ZSA9IHtcbiAgICAgICAgICAgIENvbXBvbmVudDogbnVsbCxcbiAgICAgICAgICAgIGxvYWRpbmc6IG51bGxcbiAgICAgICAgfVxuICAgICAgICBsb2FkQ29tcG9uZW50KCkge1xuICAgICAgICAgICAgY29uc29sZS5sb2coJ0xvYWRpbmcnLCBmaWxlKVxuICAgICAgICAgICAgcmV0dXJuIChcbiAgICAgICAgICAgICAgICBnZXRSZXF1aXJlKClcbiAgICAgICAgICAgICAgICAubG9hZChmaWxlKVxuICAgICAgICAgICAgICAgIC50aGVuKCgpID0+IHRoaXMucmVzb2x2ZUNvbXBvbmVudCgpKVxuICAgICAgICAgICAgICAgIC5jYXRjaChlID0+IHtcbiAgICAgICAgICAgICAgICAgICAgY29uc29sZS5lcnJvcihlKVxuICAgICAgICAgICAgICAgICAgICByZXR1cm4gZVxuICAgICAgICAgICAgICAgIH0pXG4gICAgICAgICAgICApXG4gICAgICAgIH1cbiAgICAgICAgcmVzb2x2ZUNvbXBvbmVudCgpIHtcbiAgICAgICAgICAgIHRyeSB7XG4gICAgICAgICAgICAgICAgY29uc3QgbW9kdWxlID0gcmVxdWlyZU1vZHVsZShmaWxlKVxuICAgICAgICAgICAgICAgIGNvbnN0IENvbXBvbmVudCA9IG1vZHVsZS5kZWZhdWx0XG4gICAgICAgICAgICAgICAgTGF6eS5Db21wb25lbnQgPSBDb21wb25lbnRcbiAgICAgICAgICAgICAgICB0aGlzLnNldFN0YXRlKHsgQ29tcG9uZW50IH0pXG4gICAgICAgICAgICB9IGNhdGNoIChlKSB7XG4gICAgICAgICAgICAgICAgaWYgKCFpc05vZGUoKSAmJiBlLmNvZGUgPT09ICdNT0RVTEVfTk9UX0ZPVU5EJykge1xuICAgICAgICAgICAgICAgICAgICBjb25zdCB7IGxvYWRpbmcgfSA9IHRoaXMuc3RhdGVcbiAgICAgICAgICAgICAgICAgICAgaWYgKGxvYWRpbmcgPT09IGZpbGUpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIHRocm93IGVcbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICB0aGlzLnNldFN0YXRlKHsgbG9hZGluZzogZmlsZSB9KVxuICAgICAgICAgICAgICAgICAgICByZXR1cm4gdGhpcy5sb2FkQ29tcG9uZW50KClcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgdGhyb3cgZVxuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICAgIGNvbXBvbmVudFdpbGxNb3VudCgpIHtcbiAgICAgICAgICAgIHRoaXMucmVzb2x2ZUNvbXBvbmVudCgpXG4gICAgICAgIH1cbiAgICAgICAgcmVuZGVyKCkge1xuICAgICAgICAgICAgY29uc3QgeyBDb21wb25lbnQgfSA9IHRoaXMuc3RhdGVcbiAgICAgICAgICAgIGlmICghQ29tcG9uZW50KSByZXR1cm4gbnVsbFxuICAgICAgICAgICAgcmV0dXJuIDxDb21wb25lbnQgey4uLnRoaXMucHJvcHN9IC8+XG4gICAgICAgIH1cbiAgICB9XG5cbiAgICBMYXp5LmNvbnRleHRUeXBlcyA9IHtcbiAgICAgICAgcHJvbWlzZXM6IFByb3BUeXBlcy5mdW5jXG4gICAgfVxuXG4gICAgcmV0dXJuIExhenlcbn1cblxuZXhwb3J0IGRlZmF1bHQgbGF6eVxuIl19