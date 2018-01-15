"use strict";

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.Helmet = undefined;

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _react = require("react");

var _react2 = _interopRequireDefault(_react);

var _propTypes = require("prop-types");

var _propTypes2 = _interopRequireDefault(_propTypes);

var _reactSideEffect = require("./react-side-effect");

var _reactSideEffect2 = _interopRequireDefault(_reactSideEffect);

var _deepEqual = require("deep-equal");

var _deepEqual2 = _interopRequireDefault(_deepEqual);

var _HelmetUtils = require("./HelmetUtils.js");

var _HelmetConstants = require("./HelmetConstants.js");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _objectWithoutProperties(obj, keys) { var target = {}; for (var i in obj) { if (keys.indexOf(i) >= 0) continue; if (!Object.prototype.hasOwnProperty.call(obj, i)) continue; target[i] = obj[i]; } return target; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

function _toConsumableArray(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = Array(arr.length); i < arr.length; i++) { arr2[i] = arr[i]; } return arr2; } else { return Array.from(arr); } }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var Helmet = function Helmet(Component) {
    var _class, _temp;

    return _temp = _class = function (_React$Component) {
        _inherits(HelmetWrapper, _React$Component);

        function HelmetWrapper() {
            _classCallCheck(this, HelmetWrapper);

            return _possibleConstructorReturn(this, (HelmetWrapper.__proto__ || Object.getPrototypeOf(HelmetWrapper)).apply(this, arguments));
        }

        _createClass(HelmetWrapper, [{
            key: "shouldComponentUpdate",
            value: function shouldComponentUpdate(nextProps) {
                return !(0, _deepEqual2.default)(this.props, nextProps);
            }
        }, {
            key: "mapNestedChildrenToProps",
            value: function mapNestedChildrenToProps(child, nestedChildren) {
                if (!nestedChildren) {
                    return null;
                }

                switch (child.type) {
                    case _HelmetConstants.TAG_NAMES.SCRIPT:
                    case _HelmetConstants.TAG_NAMES.NOSCRIPT:
                        return {
                            innerHTML: nestedChildren
                        };

                    case _HelmetConstants.TAG_NAMES.STYLE:
                        return {
                            cssText: nestedChildren
                        };
                }

                throw new Error("<" + child.type + " /> elements are self-closing and can not contain children. Refer to our API for more information.");
            }
        }, {
            key: "flattenArrayTypeChildren",
            value: function flattenArrayTypeChildren(_ref) {
                var child = _ref.child,
                    arrayTypeChildren = _ref.arrayTypeChildren,
                    newChildProps = _ref.newChildProps,
                    nestedChildren = _ref.nestedChildren;

                return Object.assign({}, arrayTypeChildren, _defineProperty({}, child.type, [].concat(_toConsumableArray(arrayTypeChildren[child.type] || []), [Object.assign({}, newChildProps, this.mapNestedChildrenToProps(child, nestedChildren))])));
            }
        }, {
            key: "mapObjectTypeChildren",
            value: function mapObjectTypeChildren(_ref2) {
                var _Object$assign2;

                var child = _ref2.child,
                    newProps = _ref2.newProps,
                    newChildProps = _ref2.newChildProps,
                    nestedChildren = _ref2.nestedChildren;

                switch (child.type) {
                    case _HelmetConstants.TAG_NAMES.TITLE:
                        return Object.assign({}, newProps, (_Object$assign2 = {}, _defineProperty(_Object$assign2, child.type, nestedChildren), _defineProperty(_Object$assign2, "titleAttributes", Object.assign({}, newChildProps)), _Object$assign2));

                    case _HelmetConstants.TAG_NAMES.BODY:
                        return Object.assign({}, newProps, {
                            bodyAttributes: Object.assign({}, newChildProps)
                        });

                    case _HelmetConstants.TAG_NAMES.HTML:
                        return Object.assign({}, newProps, {
                            htmlAttributes: Object.assign({}, newChildProps)
                        });
                }

                return Object.assign({}, newProps, _defineProperty({}, child.type, Object.assign({}, newChildProps)));
            }
        }, {
            key: "mapArrayTypeChildrenToProps",
            value: function mapArrayTypeChildrenToProps(arrayTypeChildren, newProps) {
                var newFlattenedProps = Object.assign({}, newProps);

                Object.keys(arrayTypeChildren).forEach(function (arrayChildName) {
                    newFlattenedProps = Object.assign({}, newFlattenedProps, _defineProperty({}, arrayChildName, arrayTypeChildren[arrayChildName]));
                });

                return newFlattenedProps;
            }
        }, {
            key: "warnOnInvalidChildren",
            value: function warnOnInvalidChildren(child, nestedChildren) {
                if (process.env.NODE_ENV !== "production") {
                    if (!_HelmetConstants.VALID_TAG_NAMES.some(function (name) {
                        return child.type === name;
                    })) {
                        if (typeof child.type === "function") {
                            return (0, _HelmetUtils.warn)("You may be attempting to nest <Helmet> components within each other, which is not allowed. Refer to our API for more information.");
                        }

                        return (0, _HelmetUtils.warn)("Only elements types " + _HelmetConstants.VALID_TAG_NAMES.join(", ") + " are allowed. Helmet does not support rendering <" + child.type + "> elements. Refer to our API for more information.");
                    }

                    if (nestedChildren && typeof nestedChildren !== "string" && (!Array.isArray(nestedChildren) || nestedChildren.some(function (nestedChild) {
                        return typeof nestedChild !== "string";
                    }))) {
                        throw new Error("Helmet expects a string as a child of <" + child.type + ">. Did you forget to wrap your children in braces? ( <" + child.type + ">{``}</" + child.type + "> ) Refer to our API for more information.");
                    }
                }

                return true;
            }
        }, {
            key: "mapChildrenToProps",
            value: function mapChildrenToProps(children, newProps) {
                var _this2 = this;

                var arrayTypeChildren = {};

                _react2.default.Children.forEach(children, function (child) {
                    if (!child || !child.props) {
                        return;
                    }

                    var _child$props = child.props,
                        nestedChildren = _child$props.children,
                        childProps = _objectWithoutProperties(_child$props, ["children"]);

                    var newChildProps = (0, _HelmetUtils.convertReactPropstoHtmlAttributes)(childProps);

                    _this2.warnOnInvalidChildren(child, nestedChildren);

                    switch (child.type) {
                        case _HelmetConstants.TAG_NAMES.LINK:
                        case _HelmetConstants.TAG_NAMES.META:
                        case _HelmetConstants.TAG_NAMES.NOSCRIPT:
                        case _HelmetConstants.TAG_NAMES.SCRIPT:
                        case _HelmetConstants.TAG_NAMES.STYLE:
                            arrayTypeChildren = _this2.flattenArrayTypeChildren({
                                child: child,
                                arrayTypeChildren: arrayTypeChildren,
                                newChildProps: newChildProps,
                                nestedChildren: nestedChildren
                            });
                            break;

                        default:
                            newProps = _this2.mapObjectTypeChildren({
                                child: child,
                                newProps: newProps,
                                newChildProps: newChildProps,
                                nestedChildren: nestedChildren
                            });
                            break;
                    }
                });

                newProps = this.mapArrayTypeChildrenToProps(arrayTypeChildren, newProps);
                return newProps;
            }
        }, {
            key: "render",
            value: function render() {
                var _props = this.props,
                    children = _props.children,
                    props = _objectWithoutProperties(_props, ["children"]);

                var newProps = Object.assign({}, props);

                if (children) {
                    newProps = this.mapChildrenToProps(children, newProps);
                }

                return _react2.default.createElement(Component, newProps);
            }
        }], [{
            key: "canUseDOM",


            // Component.peek comes from react-side-effect:
            // For testing, you may use a static peek() method available on the returned component.
            // It lets you get the current state without resetting the mounted instance stack.
            // Don’t use it for anything other than testing.

            /**
            * @param {Object} base: {"target": "_blank", "href": "http://mysite.com/"}
            * @param {Object} bodyAttributes: {"className": "root"}
            * @param {String} defaultTitle: "Default Title"
            * @param {Boolean} defer: true
            * @param {Boolean} encodeSpecialCharacters: true
            * @param {Object} htmlAttributes: {"lang": "en", "amp": undefined}
            * @param {Array} link: [{"rel": "canonical", "href": "http://mysite.com/example"}]
            * @param {Array} meta: [{"name": "description", "content": "Test description"}]
            * @param {Array} noscript: [{"innerHTML": "<img src='http://mysite.com/js/test.js'"}]
            * @param {Function} onChangeClientState: "(newState) => console.log(newState)"
            * @param {Array} script: [{"type": "text/javascript", "src": "http://mysite.com/js/test.js"}]
            * @param {Array} style: [{"type": "text/css", "cssText": "div { display: block; color: blue; }"}]
            * @param {String} title: "Title"
            * @param {Object} titleAttributes: {"itemprop": "name"}
            * @param {String} titleTemplate: "MySite.com - %s"
            */
            set: function set(canUseDOM) {
                Component.canUseDOM = canUseDOM;
            }
        }]);

        return HelmetWrapper;
    }(_react2.default.Component), _class.propTypes = {
        base: _propTypes2.default.object,
        bodyAttributes: _propTypes2.default.object,
        children: _propTypes2.default.oneOfType([_propTypes2.default.arrayOf(_propTypes2.default.node), _propTypes2.default.node]),
        defaultTitle: _propTypes2.default.string,
        defer: _propTypes2.default.bool,
        encodeSpecialCharacters: _propTypes2.default.bool,
        htmlAttributes: _propTypes2.default.object,
        link: _propTypes2.default.arrayOf(_propTypes2.default.object),
        meta: _propTypes2.default.arrayOf(_propTypes2.default.object),
        noscript: _propTypes2.default.arrayOf(_propTypes2.default.object),
        onChangeClientState: _propTypes2.default.func,
        script: _propTypes2.default.arrayOf(_propTypes2.default.object),
        style: _propTypes2.default.arrayOf(_propTypes2.default.object),
        title: _propTypes2.default.string,
        titleAttributes: _propTypes2.default.object,
        titleTemplate: _propTypes2.default.string
    }, _class.defaultProps = {
        defer: true,
        encodeSpecialCharacters: true
    }, _class.peek = Component.peek, _class.rewind = function () {
        var mappedState = Component.rewind();
        if (!mappedState) {
            // provide fallback if mappedState is undefined
            mappedState = (0, _HelmetUtils.mapStateOnServer)({
                baseTag: [],
                bodyAttributes: {},
                encodeSpecialCharacters: true,
                htmlAttributes: {},
                linkTags: [],
                metaTags: [],
                noscriptTags: [],
                scriptTags: [],
                styleTags: [],
                title: "",
                titleAttributes: {}
            });
        }

        return mappedState;
    }, _temp;
};

var NullComponent = function NullComponent() {
    return null;
};

var HelmetSideEffects = (0, _reactSideEffect2.default)(_HelmetUtils.reducePropsToState, _HelmetUtils.handleClientStateChange, _HelmetUtils.mapStateOnServer)(NullComponent);

var HelmetExport = Helmet(HelmetSideEffects);
HelmetExport.renderStatic = HelmetExport.rewind;

exports.Helmet = HelmetExport;
exports.default = HelmetExport;
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbInJlYWN0L2hlbG1ldC9zcmMvSGVsbWV0LmpzIl0sIm5hbWVzIjpbIkhlbG1ldCIsIm5leHRQcm9wcyIsInByb3BzIiwiY2hpbGQiLCJuZXN0ZWRDaGlsZHJlbiIsInR5cGUiLCJTQ1JJUFQiLCJOT1NDUklQVCIsImlubmVySFRNTCIsIlNUWUxFIiwiY3NzVGV4dCIsIkVycm9yIiwiYXJyYXlUeXBlQ2hpbGRyZW4iLCJuZXdDaGlsZFByb3BzIiwibWFwTmVzdGVkQ2hpbGRyZW5Ub1Byb3BzIiwibmV3UHJvcHMiLCJUSVRMRSIsIkJPRFkiLCJib2R5QXR0cmlidXRlcyIsIkhUTUwiLCJodG1sQXR0cmlidXRlcyIsIm5ld0ZsYXR0ZW5lZFByb3BzIiwiT2JqZWN0Iiwia2V5cyIsImZvckVhY2giLCJhcnJheUNoaWxkTmFtZSIsInByb2Nlc3MiLCJlbnYiLCJOT0RFX0VOViIsInNvbWUiLCJuYW1lIiwiam9pbiIsIkFycmF5IiwiaXNBcnJheSIsIm5lc3RlZENoaWxkIiwiY2hpbGRyZW4iLCJDaGlsZHJlbiIsImNoaWxkUHJvcHMiLCJ3YXJuT25JbnZhbGlkQ2hpbGRyZW4iLCJMSU5LIiwiTUVUQSIsImZsYXR0ZW5BcnJheVR5cGVDaGlsZHJlbiIsIm1hcE9iamVjdFR5cGVDaGlsZHJlbiIsIm1hcEFycmF5VHlwZUNoaWxkcmVuVG9Qcm9wcyIsIm1hcENoaWxkcmVuVG9Qcm9wcyIsImNhblVzZURPTSIsIkNvbXBvbmVudCIsInByb3BUeXBlcyIsImJhc2UiLCJvYmplY3QiLCJvbmVPZlR5cGUiLCJhcnJheU9mIiwibm9kZSIsImRlZmF1bHRUaXRsZSIsInN0cmluZyIsImRlZmVyIiwiYm9vbCIsImVuY29kZVNwZWNpYWxDaGFyYWN0ZXJzIiwibGluayIsIm1ldGEiLCJub3NjcmlwdCIsIm9uQ2hhbmdlQ2xpZW50U3RhdGUiLCJmdW5jIiwic2NyaXB0Iiwic3R5bGUiLCJ0aXRsZSIsInRpdGxlQXR0cmlidXRlcyIsInRpdGxlVGVtcGxhdGUiLCJkZWZhdWx0UHJvcHMiLCJwZWVrIiwicmV3aW5kIiwibWFwcGVkU3RhdGUiLCJiYXNlVGFnIiwibGlua1RhZ3MiLCJtZXRhVGFncyIsIm5vc2NyaXB0VGFncyIsInNjcmlwdFRhZ3MiLCJzdHlsZVRhZ3MiLCJOdWxsQ29tcG9uZW50IiwiSGVsbWV0U2lkZUVmZmVjdHMiLCJIZWxtZXRFeHBvcnQiLCJyZW5kZXJTdGF0aWMiXSwibWFwcGluZ3MiOiI7Ozs7Ozs7OztBQUFBOzs7O0FBQ0E7Ozs7QUFDQTs7OztBQUNBOzs7O0FBQ0E7O0FBT0E7Ozs7Ozs7Ozs7Ozs7Ozs7QUFFQSxJQUFNQSxTQUFTLFNBQVRBLE1BQVM7QUFBQTs7QUFBQTtBQUFBOztBQUFBO0FBQUE7O0FBQUE7QUFBQTs7QUFBQTtBQUFBO0FBQUEsa0RBOEVlQyxTQTlFZixFQThFMEI7QUFDN0IsdUJBQU8sQ0FBQyx5QkFBVSxLQUFLQyxLQUFmLEVBQXNCRCxTQUF0QixDQUFSO0FBQ0g7QUFoRk07QUFBQTtBQUFBLHFEQWtGa0JFLEtBbEZsQixFQWtGeUJDLGNBbEZ6QixFQWtGeUM7QUFDNUMsb0JBQUksQ0FBQ0EsY0FBTCxFQUFxQjtBQUNqQiwyQkFBTyxJQUFQO0FBQ0g7O0FBRUQsd0JBQVFELE1BQU1FLElBQWQ7QUFDSSx5QkFBSywyQkFBVUMsTUFBZjtBQUNBLHlCQUFLLDJCQUFVQyxRQUFmO0FBQ0ksK0JBQU87QUFDSEMsdUNBQVdKO0FBRFIseUJBQVA7O0FBSUoseUJBQUssMkJBQVVLLEtBQWY7QUFDSSwrQkFBTztBQUNIQyxxQ0FBU047QUFETix5QkFBUDtBQVJSOztBQWFBLHNCQUFNLElBQUlPLEtBQUosT0FDRVIsTUFBTUUsSUFEUix3R0FBTjtBQUdIO0FBdkdNO0FBQUE7QUFBQSwyREE4R0o7QUFBQSxvQkFKQ0YsS0FJRCxRQUpDQSxLQUlEO0FBQUEsb0JBSENTLGlCQUdELFFBSENBLGlCQUdEO0FBQUEsb0JBRkNDLGFBRUQsUUFGQ0EsYUFFRDtBQUFBLG9CQURDVCxjQUNELFFBRENBLGNBQ0Q7O0FBQ0MseUNBQ09RLGlCQURQLHNCQUVLVCxN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LEVBTGlCO0FBTTNCQywwQkFBVSxFQU5pQjtBQU8zQkMsOEJBQWMsRUFQYTtBQVEzQkMsNEJBQVksRUFSZTtBQVMzQkMsMkJBQVcsRUFUZ0I7QUFVM0JaLHVCQUFPLEVBVm9CO0FBVzNCQyxpQ0FBaUI7QUFYVSxhQUFqQixDQUFkO0FBYUg7O0FBRUQsZUFBT0ssV0FBUDtBQUNILEtBeEVNO0FBQUEsQ0FBZjs7QUFxUUEsSUFBTU8sZ0JBQWdCLFNBQWhCQSxhQUFnQjtBQUFBLFdBQU0sSUFBTjtBQUFBLENBQXRCOztBQUVBLElBQU1DLG9CQUFvQixxSUFJeEJELGFBSndCLENBQTFCOztBQU1BLElBQU1FLGVBQWVoRixPQUFPK0UsaUJBQVAsQ0FBckI7QUFDQUMsYUFBYUMsWUFBYixHQUE0QkQsYUFBYVYsTUFBekM7O1FBRXdCdEUsTSxHQUFoQmdGLFk7a0JBQ09BLFkiLCJmaWxlIjoidW5rbm93biIsInNvdXJjZVJvb3QiOiJub2RlX21vZHVsZXMvZXRoaWNhbCIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCBSZWFjdCBmcm9tIFwicmVhY3RcIjtcbmltcG9ydCBQcm9wVHlwZXMgZnJvbSBcInByb3AtdHlwZXNcIjtcbmltcG9ydCB3aXRoU2lkZUVmZmVjdCBmcm9tIFwiLi9yZWFjdC1zaWRlLWVmZmVjdFwiO1xuaW1wb3J0IGRlZXBFcXVhbCBmcm9tIFwiZGVlcC1lcXVhbFwiO1xuaW1wb3J0IHtcbiAgICBjb252ZXJ0UmVhY3RQcm9wc3RvSHRtbEF0dHJpYnV0ZXMsXG4gICAgaGFuZGxlQ2xpZW50U3RhdGVDaGFuZ2UsXG4gICAgbWFwU3RhdGVPblNlcnZlcixcbiAgICByZWR1Y2VQcm9wc1RvU3RhdGUsXG4gICAgd2FyblxufSBmcm9tIFwiLi9IZWxtZXRVdGlscy5qc1wiO1xuaW1wb3J0IHtUQUdfTkFNRVMsIFZBTElEX1RBR19OQU1FU30gZnJvbSBcIi4vSGVsbWV0Q29uc3RhbnRzLmpzXCI7XG5cbmNvbnN0IEhlbG1ldCA9IENvbXBvbmVudCA9PlxuICAgIGNsYXNzIEhlbG1ldFdyYXBwZXIgZXh0ZW5kcyBSZWFjdC5Db21wb25lbnQge1xuICAgICAgICAvKipcbiAgICAgKiBAcGFyYW0ge09iamVjdH0gYmFzZToge1widGFyZ2V0XCI6IFwiX2JsYW5rXCIsIFwiaHJlZlwiOiBcImh0dHA6Ly9teXNpdGUuY29tL1wifVxuICAgICAqIEBwYXJhbSB7T2JqZWN0fSBib2R5QXR0cmlidXRlczoge1wiY2xhc3NOYW1lXCI6IFwicm9vdFwifVxuICAgICAqIEBwYXJhbSB7U3RyaW5nfSBkZWZhdWx0VGl0bGU6IFwiRGVmYXVsdCBUaXRsZVwiXG4gICAgICogQHBhcmFtIHtCb29sZWFufSBkZWZlcjogdHJ1ZVxuICAgICAqIEBwYXJhbSB7Qm9vbGVhbn0gZW5jb2RlU3BlY2lhbENoYXJhY3RlcnM6IHRydWVcbiAgICAgKiBAcGFyYW0ge09iamVjdH0gaHRtbEF0dHJpYnV0ZXM6IHtcImxhbmdcIjogXCJlblwiLCBcImFtcFwiOiB1bmRlZmluZWR9XG4gICAgICogQHBhcmFtIHtBcnJheX0gbGluazogW3tcInJlbFwiOiBcImNhbm9uaWNhbFwiLCBcImhyZWZcIjogXCJodHRwOi8vbXlzaXRlLmNvbS9leGFtcGxlXCJ9XVxuICAgICAqIEBwYXJhbSB7QXJyYXl9IG1ldGE6IFt7XCJuYW1lXCI6IFwiZGVzY3JpcHRpb25cIiwgXCJjb250ZW50XCI6IFwiVGVzdCBkZXNjcmlwdGlvblwifV1cbiAgICAgKiBAcGFyYW0ge0FycmF5fSBub3NjcmlwdDogW3tcImlubmVySFRNTFwiOiBcIjxpbWcgc3JjPSdodHRwOi8vbXlzaXRlLmNvbS9qcy90ZXN0LmpzJ1wifV1cbiAgICAgKiBAcGFyYW0ge0Z1bmN0aW9ufSBvbkNoYW5nZUNsaWVudFN0YXRlOiBcIihuZXdTdGF0ZSkgPT4gY29uc29sZS5sb2cobmV3U3RhdGUpXCJcbiAgICAgKiBAcGFyYW0ge0FycmF5fSBzY3JpcHQ6IFt7XCJ0eXBlXCI6IFwidGV4dC9qYXZhc2NyaXB0XCIsIFwic3JjXCI6IFwiaHR0cDovL215c2l0ZS5jb20vanMvdGVzdC5qc1wifV1cbiAgICAgKiBAcGFyYW0ge0FycmF5fSBzdHlsZTogW3tcInR5cGVcIjogXCJ0ZXh0L2Nzc1wiLCBcImNzc1RleHRcIjogXCJkaXYgeyBkaXNwbGF5OiBibG9jazsgY29sb3I6IGJsdWU7IH1cIn1dXG4gICAgICogQHBhcmFtIHtTdHJpbmd9IHRpdGxlOiBcIlRpdGxlXCJcbiAgICAgKiBAcGFyYW0ge09iamVjdH0gdGl0bGVBdHRyaWJ1dGVzOiB7XCJpdGVtcHJvcFwiOiBcIm5hbWVcIn1cbiAgICAgKiBAcGFyYW0ge1N0cmluZ30gdGl0bGVUZW1wbGF0ZTogXCJNeVNpdGUuY29tIC0gJXNcIlxuICAgICAqL1xuICAgICAgICBzdGF0aWMgcHJvcFR5cGVzID0ge1xuICAgICAgICAgICAgYmFzZTogUHJvcFR5cGVzLm9iamVjdCxcbiAgICAgICAgICAgIGJvZHlBdHRyaWJ1dGVzOiBQcm9wVHlwZXMub2JqZWN0LFxuICAgICAgICAgICAgY2hpbGRyZW46IFByb3BUeXBlcy5vbmVPZlR5cGUoW1xuICAgICAgICAgICAgICAgIFByb3BUeXBlcy5hcnJheU9mKFByb3BUeXBlcy5ub2RlKSxcbiAgICAgICAgICAgICAgICBQcm9wVHlwZXMubm9kZVxuICAgICAgICAgICAgXSksXG4gICAgICAgICAgICBkZWZhdWx0VGl0bGU6IFByb3BUeXBlcy5zdHJpbmcsXG4gICAgICAgICAgICBkZWZlcjogUHJvcFR5cGVzLmJvb2wsXG4gICAgICAgICAgICBlbmNvZGVTcGVjaWFsQ2hhcmFjdGVyczogUHJvcFR5cGVzLmJvb2wsXG4gICAgICAgICAgICBodG1sQXR0cmlidXRlczogUHJvcFR5cGVzLm9iamVjdCxcbiAgICAgICAgICAgIGxpbms6IFByb3BUeXBlcy5hcnJheU9mKFByb3BUeXBlcy5vYmplY3QpLFxuICAgICAgICAgICAgbWV0YTogUHJvcFR5cGVzLmFycmF5T2YoUHJvcFR5cGVzLm9iamVjdCksXG4gICAgICAgICAgICBub3NjcmlwdDogUHJvcFR5cGVzLmFycmF5T2YoUHJvcFR5cGVzLm9iamVjdCksXG4gICAgICAgICAgICBvbkNoYW5nZUNsaWVudFN0YXRlOiBQcm9wVHlwZXMuZnVuYyxcbiAgICAgICAgICAgIHNjcmlwdDogUHJvcFR5cGVzLmFycmF5T2YoUHJvcFR5cGVzLm9iamVjdCksXG4gICAgICAgICAgICBzdHlsZTogUHJvcFR5cGVzLmFycmF5T2YoUHJvcFR5cGVzLm9iamVjdCksXG4gICAgICAgICAgICB0aXRsZTogUHJvcFR5cGVzLnN0cmluZyxcbiAgICAgICAgICAgIHRpdGxlQXR0cmlidXRlczogUHJvcFR5cGVzLm9iamVjdCxcbiAgICAgICAgICAgIHRpdGxlVGVtcGxhdGU6IFByb3BUeXBlcy5zdHJpbmdcbiAgICAgICAgfTtcblxuICAgICAgICBzdGF0aWMgZGVmYXVsdFByb3BzID0ge1xuICAgICAgICAgICAgZGVmZXI6IHRydWUsXG4gICAgICAgICAgICBlbmNvZGVTcGVjaWFsQ2hhcmFjdGVyczogdHJ1ZVxuICAgICAgICB9O1xuXG4gICAgICAgIC8vIENvbXBvbmVudC5wZWVrIGNvbWVzIGZyb20gcmVhY3Qtc2lkZS1lZmZlY3Q6XG4gICAgICAgIC8vIEZvciB0ZXN0aW5nLCB5b3UgbWF5IHVzZSBhIHN0YXRpYyBwZWVrKCkgbWV0aG9kIGF2YWlsYWJsZSBvbiB0aGUgcmV0dXJuZWQgY29tcG9uZW50LlxuICAgICAgICAvLyBJdCBsZXRzIHlvdSBnZXQgdGhlIGN1cnJlbnQgc3RhdGUgd2l0aG91dCByZXNldHRpbmcgdGhlIG1vdW50ZWQgaW5zdGFuY2Ugc3RhY2suXG4gICAgICAgIC8vIERvbuKAmXQgdXNlIGl0IGZvciBhbnl0aGluZyBvdGhlciB0aGFuIHRlc3RpbmcuXG4gICAgICAgIHN0YXRpYyBwZWVrID0gQ29tcG9uZW50LnBlZWs7XG5cbiAgICAgICAgc3RhdGljIHJld2luZCA9ICgpID0+IHtcbiAgICAgICAgICAgIGxldCBtYXBwZWRTdGF0ZSA9IENvbXBvbmVudC5yZXdpbmQoKTtcbiAgICAgICAgICAgIGlmICghbWFwcGVkU3RhdGUpIHtcbiAgICAgICAgICAgICAgICAvLyBwcm92aWRlIGZhbGxiYWNrIGlmIG1hcHBlZFN0YXRlIGlzIHVuZGVmaW5lZFxuICAgICAgICAgICAgICAgIG1hcHBlZFN0YXRlID0gbWFwU3RhdGVPblNlcnZlcih7XG4gICAgICAgICAgICAgICAgICAgIGJhc2VUYWc6IFtdLFxuICAgICAgICAgICAgICAgICAgICBib2R5QXR0cmlidXRlczoge30sXG4gICAgICAgICAgICAgICAgICAgIGVuY29kZVNwZWNpYWxDaGFyYWN0ZXJzOiB0cnVlLFxuICAgICAgICAgICAgICAgICAgICBodG1sQXR0cmlidXRlczoge30sXG4gICAgICAgICAgICAgICAgICAgIGxpbmtUYWdzOiBbXSxcbiAgICAgICAgICAgICAgICAgICAgbWV0YVRhZ3M6IFtdLFxuICAgICAgICAgICAgICAgICAgICBub3NjcmlwdFRhZ3M6IFtdLFxuICAgICAgICAgICAgICAgICAgICBzY3JpcHRUYWdzOiBbXSxcbiAgICAgICAgICAgICAgICAgICAgc3R5bGVUYWdzOiBbXSxcbiAgICAgICAgICAgICAgICAgICAgdGl0bGU6IFwiXCIsXG4gICAgICAgICAgICAgICAgICAgIHRpdGxlQXR0cmlidXRlczoge31cbiAgICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgcmV0dXJuIG1hcHBlZFN0YXRlO1xuICAgICAgICB9O1xuXG4gICAgICAgIHN0YXRpYyBzZXQgY2FuVXNlRE9NKGNhblVzZURPTSkge1xuICAgICAgICAgICAgQ29tcG9uZW50LmNhblVzZURPTSA9IGNhblVzZURPTTtcbiAgICAgICAgfVxuXG4gICAgICAgIHNob3VsZENvbXBvbmVudFVwZGF0ZShuZXh0UHJvcHMpIHtcbiAgICAgICAgICAgIHJldHVybiAhZGVlcEVxdWFsKHRoaXMucHJvcHMsIG5leHRQcm9wcyk7XG4gICAgICAgIH1cblxuICAgICAgICBtYXBOZXN0ZWRDaGlsZHJlblRvUHJvcHMoY2hpbGQsIG5lc3RlZENoaWxkcmVuKSB7XG4gICAgICAgICAgICBpZiAoIW5lc3RlZENoaWxkcmVuKSB7XG4gICAgICAgICAgICAgICAgcmV0dXJuIG51bGw7XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIHN3aXRjaCAoY2hpbGQudHlwZSkge1xuICAgICAgICAgICAgICAgIGNhc2UgVEFHX05BTUVTLlNDUklQVDpcbiAgICAgICAgICAgICAgICBjYXNlIFRBR19OQU1FUy5OT1NDUklQVDpcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIGlubmVySFRNTDogbmVzdGVkQ2hpbGRyZW5cbiAgICAgICAgICAgICAgICAgICAgfTtcblxuICAgICAgICAgICAgICAgIGNhc2UgVEFHX05BTUVTLlNUWUxFOlxuICAgICAgICAgICAgICAgICAgICByZXR1cm4ge1xuICAgICAgICAgICAgICAgICAgICAgICAgY3NzVGV4dDogbmVzdGVkQ2hpbGRyZW5cbiAgICAgICAgICAgICAgICAgICAgfTtcbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgdGhyb3cgbmV3IEVycm9yKFxuICAgICAgICAgICAgICAgIGA8JHtjaGlsZC50eXBlfSAvPiBlbGVtZW50cyBhcmUgc2VsZi1jbG9zaW5nIGFuZCBjYW4gbm90IGNvbnRhaW4gY2hpbGRyZW4uIFJlZmVyIHRvIG91ciBBUEkgZm9yIG1vcmUgaW5mb3JtYXRpb24uYFxuICAgICAgICAgICAgKTtcbiAgICAgICAgfVxuXG4gICAgICAgIGZsYXR0ZW5BcnJheVR5cGVDaGlsZHJlbih7XG4gICAgICAgICAgICBjaGlsZCxcbiAgICAgICAgICAgIGFycmF5VHlwZUNoaWxkcmVuLFxuICAgICAgICAgICAgbmV3Q2hpbGRQcm9wcyxcbiAgICAgICAgICAgIG5lc3RlZENoaWxkcmVuXG4gICAgICAgIH0pIHtcbiAgICAgICAgICAgIHJldHVybiB7XG4gICAgICAgICAgICAgICAgLi4uYXJyYXlUeXBlQ2hpbGRyZW4sXG4gICAgICAgICAgICAgICAgW2NoaWxkLnR5cGVdOiBbXG4gICAgICAgICAgICAgICAgICAgIC4uLihhcnJheVR5cGVDaGlsZHJlbltjaGlsZC50eXBlXSB8fCBbXSksXG4gICAgICAgICAgICAgICAgICAgIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIC4uLm5ld0NoaWxkUHJvcHMsXG4gICAgICAgICAgICAgICAgICAgICAgICAuLi50aGlzLm1hcE5lc3RlZENoaWxkcmVuVG9Qcm9wcyhjaGlsZCwgbmVzdGVkQ2hpbGRyZW4pXG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICBdXG4gICAgICAgICAgICB9O1xuICAgICAgICB9XG5cbiAgICAgICAgbWFwT2JqZWN0VHlwZUNoaWxkcmVuKHtcbiAgICAgICAgICAgIGNoaWxkLFxuICAgICAgICAgICAgbmV3UHJvcHMsXG4gICAgICAgICAgICBuZXdDaGlsZFByb3BzLFxuICAgICAgICAgICAgbmVzdGVkQ2hpbGRyZW5cbiAgICAgICAgfSkge1xuICAgICAgICAgICAgc3dpdGNoIChjaGlsZC50eXBlKSB7XG4gICAgICAgICAgICAgICAgY2FzZSBUQUdfTkFNRVMuVElUTEU6XG4gICAgICAgICAgICAgICAgICAgIHJldHVybiB7XG4gICAgICAgICAgICAgICAgICAgICAgICAuLi5uZXdQcm9wcyxcbiAgICAgICAgICAgICAgICAgICAgICAgIFtjaGlsZC50eXBlXTogbmVzdGVkQ2hpbGRyZW4sXG4gICAgICAgICAgICAgICAgICAgICAgICB0aXRsZUF0dHJpYnV0ZXM6IHsuLi5uZXdDaGlsZFByb3BzfVxuICAgICAgICAgICAgICAgICAgICB9O1xuXG4gICAgICAgICAgICAgICAgY2FzZSBUQUdfTkFNRVMuQk9EWTpcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIC4uLm5ld1Byb3BzLFxuICAgICAgICAgICAgICAgICAgICAgICAgYm9keUF0dHJpYnV0ZXM6IHsuLi5uZXdDaGlsZFByb3BzfVxuICAgICAgICAgICAgICAgICAgICB9O1xuXG4gICAgICAgICAgICAgICAgY2FzZSBUQUdfTkFNRVMuSFRNTDpcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIC4uLm5ld1Byb3BzLFxuICAgICAgICAgICAgICAgICAgICAgICAgaHRtbEF0dHJpYnV0ZXM6IHsuLi5uZXdDaGlsZFByb3BzfVxuICAgICAgICAgICAgICAgICAgICB9O1xuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICByZXR1cm4ge1xuICAgICAgICAgICAgICAgIC4uLm5ld1Byb3BzLFxuICAgICAgICAgICAgICAgIFtjaGlsZC50eXBlXTogey4uLm5ld0NoaWxkUHJvcHN9XG4gICAgICAgICAgICB9O1xuICAgICAgICB9XG5cbiAgICAgICAgbWFwQXJyYXlUeXBlQ2hpbGRyZW5Ub1Byb3BzKGFycmF5VHlwZUNoaWxkcmVuLCBuZXdQcm9wcykge1xuICAgICAgICAgICAgbGV0IG5ld0ZsYXR0ZW5lZFByb3BzID0gey4uLm5ld1Byb3BzfTtcblxuICAgICAgICAgICAgT2JqZWN0LmtleXMoYXJyYXlUeXBlQ2hpbGRyZW4pLmZvckVhY2goYXJyYXlDaGlsZE5hbWUgPT4ge1xuICAgICAgICAgICAgICAgIG5ld0ZsYXR0ZW5lZFByb3BzID0ge1xuICAgICAgICAgICAgICAgICAgICAuLi5uZXdGbGF0dGVuZWRQcm9wcyxcbiAgICAgICAgICAgICAgICAgICAgW2FycmF5Q2hpbGROYW1lXTogYXJyYXlUeXBlQ2hpbGRyZW5bYXJyYXlDaGlsZE5hbWVdXG4gICAgICAgICAgICAgICAgfTtcbiAgICAgICAgICAgIH0pO1xuXG4gICAgICAgICAgICByZXR1cm4gbmV3RmxhdHRlbmVkUHJvcHM7XG4gICAgICAgIH1cblxuICAgICAgICB3YXJuT25JbnZhbGlkQ2hpbGRyZW4oY2hpbGQsIG5lc3RlZENoaWxkcmVuKSB7XG4gICAgICAgICAgICBpZiAocHJvY2Vzcy5lbnYuTk9ERV9FTlYgIT09IFwicHJvZHVjdGlvblwiKSB7XG4gICAgICAgICAgICAgICAgaWYgKCFWQUxJRF9UQUdfTkFNRVMuc29tZShuYW1lID0+IGNoaWxkLnR5cGUgPT09IG5hbWUpKSB7XG4gICAgICAgICAgICAgICAgICAgIGlmICh0eXBlb2YgY2hpbGQudHlwZSA9PT0gXCJmdW5jdGlvblwiKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICByZXR1cm4gd2FybihcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBgWW91IG1heSBiZSBhdHRlbXB0aW5nIHRvIG5lc3QgPEhlbG1ldD4gY29tcG9uZW50cyB3aXRoaW4gZWFjaCBvdGhlciwgd2hpY2ggaXMgbm90IGFsbG93ZWQuIFJlZmVyIHRvIG91ciBBUEkgZm9yIG1vcmUgaW5mb3JtYXRpb24uYFxuICAgICAgICAgICAgICAgICAgICAgICAgKTtcbiAgICAgICAgICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICAgICAgICAgIHJldHVybiB3YXJuKFxuICAgICAgICAgICAgICAgICAgICAgICAgYE9ubHkgZWxlbWVudHMgdHlwZXMgJHtWQUxJRF9UQUdfTkFNRVMuam9pbihcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBcIiwgXCJcbiAgICAgICAgICAgICAgICAgICAgICAgICl9IGFyZSBhbGxvd2VkLiBIZWxtZXQgZG9lcyBub3Qgc3VwcG9ydCByZW5kZXJpbmcgPCR7Y2hpbGQudHlwZX0+IGVsZW1lbnRzLiBSZWZlciB0byBvdXIgQVBJIGZvciBtb3JlIGluZm9ybWF0aW9uLmBcbiAgICAgICAgICAgICAgICAgICAgKTtcbiAgICAgICAgICAgICAgICB9XG5cbiAgICAgICAgICAgICAgICBpZiAoXG4gICAgICAgICAgICAgICAgICAgIG5lc3RlZENoaWxkcmVuICYmXG4gICAgICAgICAgICAgICAgICAgIHR5cGVvZiBuZXN0ZWRDaGlsZHJlbiAhPT0gXCJzdHJpbmdcIiAmJlxuICAgICAgICAgICAgICAgICAgICAoIUFycmF5LmlzQXJyYXkobmVzdGVkQ2hpbGRyZW4pIHx8XG4gICAgICAgICAgICAgICAgICAgICAgICBuZXN0ZWRDaGlsZHJlbi5zb21lKFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIG5lc3RlZENoaWxkID0+IHR5cGVvZiBuZXN0ZWRDaGlsZCAhPT0gXCJzdHJpbmdcIlxuICAgICAgICAgICAgICAgICAgICAgICAgKSlcbiAgICAgICAgICAgICAgICApIHtcbiAgICAgICAgICAgICAgICAgICAgdGhyb3cgbmV3IEVycm9yKFxuICAgICAgICAgICAgICAgICAgICAgICAgYEhlbG1ldCBleHBlY3RzIGEgc3RyaW5nIGFzIGEgY2hpbGQgb2YgPCR7Y2hpbGQudHlwZX0+LiBEaWQgeW91IGZvcmdldCB0byB3cmFwIHlvdXIgY2hpbGRyZW4gaW4gYnJhY2VzPyAoIDwke2NoaWxkLnR5cGV9PntcXGBcXGB9PC8ke2NoaWxkLnR5cGV9PiApIFJlZmVyIHRvIG91ciBBUEkgZm9yIG1vcmUgaW5mb3JtYXRpb24uYFxuICAgICAgICAgICAgICAgICAgICApO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgcmV0dXJuIHRydWU7XG4gICAgICAgIH1cblxuICAgICAgICBtYXBDaGlsZHJlblRvUHJvcHMoY2hpbGRyZW4sIG5ld1Byb3BzKSB7XG4gICAgICAgICAgICBsZXQgYXJyYXlUeXBlQ2hpbGRyZW4gPSB7fTtcblxuICAgICAgICAgICAgUmVhY3QuQ2hpbGRyZW4uZm9yRWFjaChjaGlsZHJlbiwgY2hpbGQgPT4ge1xuICAgICAgICAgICAgICAgIGlmICghY2hpbGQgfHwgIWNoaWxkLnByb3BzKSB7XG4gICAgICAgICAgICAgICAgICAgIHJldHVybjtcbiAgICAgICAgICAgICAgICB9XG5cbiAgICAgICAgICAgICAgICBjb25zdCB7Y2hpbGRyZW46IG5lc3RlZENoaWxkcmVuLCAuLi5jaGlsZFByb3BzfSA9IGNoaWxkLnByb3BzO1xuICAgICAgICAgICAgICAgIGNvbnN0IG5ld0NoaWxkUHJvcHMgPSBjb252ZXJ0UmVhY3RQcm9wc3RvSHRtbEF0dHJpYnV0ZXMoXG4gICAgICAgICAgICAgICAgICAgIGNoaWxkUHJvcHNcbiAgICAgICAgICAgICAgICApO1xuXG4gICAgICAgICAgICAgICAgdGhpcy53YXJuT25JbnZhbGlkQ2hpbGRyZW4oY2hpbGQsIG5lc3RlZENoaWxkcmVuKTtcblxuICAgICAgICAgICAgICAgIHN3aXRjaCAoY2hpbGQudHlwZSkge1xuICAgICAgICAgICAgICAgICAgICBjYXNlIFRBR19OQU1FUy5MSU5LOlxuICAgICAgICAgICAgICAgICAgICBjYXNlIFRBR19OQU1FUy5NRVRBOlxuICAgICAgICAgICAgICAgICAgICBjYXNlIFRBR19OQU1FUy5OT1NDUklQVDpcbiAgICAgICAgICAgICAgICAgICAgY2FzZSBUQUdfTkFNRVMuU0NSSVBUOlxuICAgICAgICAgICAgICAgICAgICBjYXNlIFRBR19OQU1FUy5TVFlMRTpcbiAgICAgICAgICAgICAgICAgICAgICAgIGFycmF5VHlwZUNoaWxkcmVuID0gdGhpcy5mbGF0dGVuQXJyYXlUeXBlQ2hpbGRyZW4oe1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGNoaWxkLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGFycmF5VHlwZUNoaWxkcmVuLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIG5ld0NoaWxkUHJvcHMsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgbmVzdGVkQ2hpbGRyZW5cbiAgICAgICAgICAgICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgICAgICAgICAgICAgYnJlYWs7XG5cbiAgICAgICAgICAgICAgICAgICAgZGVmYXVsdDpcbiAgICAgICAgICAgICAgICAgICAgICAgIG5ld1Byb3BzID0gdGhpcy5tYXBPYmplY3RUeXBlQ2hpbGRyZW4oe1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGNoaWxkLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIG5ld1Byb3BzLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIG5ld0NoaWxkUHJvcHMsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgbmVzdGVkQ2hpbGRyZW5cbiAgICAgICAgICAgICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfSk7XG5cbiAgICAgICAgICAgIG5ld1Byb3BzID0gdGhpcy5tYXBBcnJheVR5cGVDaGlsZHJlblRvUHJvcHMoXG4gICAgICAgICAgICAgICAgYXJyYXlUeXBlQ2hpbGRyZW4sXG4gICAgICAgICAgICAgICAgbmV3UHJvcHNcbiAgICAgICAgICAgICk7XG4gICAgICAgICAgICByZXR1cm4gbmV3UHJvcHM7XG4gICAgICAgIH1cblxuICAgICAgICByZW5kZXIoKSB7XG4gICAgICAgICAgICBjb25zdCB7Y2hpbGRyZW4sIC4uLnByb3BzfSA9IHRoaXMucHJvcHM7XG4gICAgICAgICAgICBsZXQgbmV3UHJvcHMgPSB7Li4ucHJvcHN9O1xuXG4gICAgICAgICAgICBpZiAoY2hpbGRyZW4pIHtcbiAgICAgICAgICAgICAgICBuZXdQcm9wcyA9IHRoaXMubWFwQ2hpbGRyZW5Ub1Byb3BzKGNoaWxkcmVuLCBuZXdQcm9wcyk7XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIHJldHVybiA8Q29tcG9uZW50IHsuLi5uZXdQcm9wc30gLz47XG4gICAgICAgIH1cbiAgICB9O1xuXG5jb25zdCBOdWxsQ29tcG9uZW50ID0gKCkgPT4gbnVsbDtcblxuY29uc3QgSGVsbWV0U2lkZUVmZmVjdHMgPSB3aXRoU2lkZUVmZmVjdChcbiAgICByZWR1Y2VQcm9wc1RvU3RhdGUsXG4gICAgaGFuZGxlQ2xpZW50U3RhdGVDaGFuZ2UsXG4gICAgbWFwU3RhdGVPblNlcnZlclxuKShOdWxsQ29tcG9uZW50KTtcblxuY29uc3QgSGVsbWV0RXhwb3J0ID0gSGVsbWV0KEhlbG1ldFNpZGVFZmZlY3RzKTtcbkhlbG1ldEV4cG9ydC5yZW5kZXJTdGF0aWMgPSBIZWxtZXRFeHBvcnQucmV3aW5kO1xuXG5leHBvcnQge0hlbG1ldEV4cG9ydCBhcyBIZWxtZXR9O1xuZXhwb3J0IGRlZmF1bHQgSGVsbWV0RXhwb3J0O1xuIl19