"use strict";

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.warn = exports.requestAnimationFrame = exports.reducePropsToState = exports.mapStateOnServer = exports.handleClientStateChange = exports.convertReactPropstoHtmlAttributes = undefined;

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };

var _react = require("react");

var _react2 = _interopRequireDefault(_react);

var _objectAssign = require("object-assign");

var _objectAssign2 = _interopRequireDefault(_objectAssign);

var _HelmetConstants = require("./HelmetConstants.js");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

var encodeSpecialCharacters = function encodeSpecialCharacters(str) {
    var encode = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : true;

    if (encode === false) {
        return String(str);
    }

    return String(str).replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;").replace(/'/g, "&#x27;");
};

var getTitleFromPropsList = function getTitleFromPropsList(propsList) {
    var innermostTitle = getInnermostProperty(propsList, _HelmetConstants.TAG_NAMES.TITLE);
    var innermostTemplate = getInnermostProperty(propsList, _HelmetConstants.HELMET_PROPS.TITLE_TEMPLATE);

    if (innermostTemplate && innermostTitle) {
        // use function arg to avoid need to escape $ characters
        return innermostTemplate.replace(/%s/g, function () {
            return innermostTitle;
        });
    }

    var innermostDefaultTitle = getInnermostProperty(propsList, _HelmetConstants.HELMET_PROPS.DEFAULT_TITLE);

    return innermostTitle || innermostDefaultTitle || undefined;
};

var getOnChangeClientState = function getOnChangeClientState(propsList) {
    return getInnermostProperty(propsList, _HelmetConstants.HELMET_PROPS.ON_CHANGE_CLIENT_STATE) || function () {};
};

var getAttributesFromPropsList = function getAttributesFromPropsList(tagType, propsList) {
    return propsList.filter(function (props) {
        return typeof props[tagType] !== "undefined";
    }).map(function (props) {
        return props[tagType];
    }).reduce(function (tagAttrs, current) {
        return Object.assign({}, tagAttrs, current);
    }, {});
};

var getBaseTagFromPropsList = function getBaseTagFromPropsList(primaryAttributes, propsList) {
    return propsList.filter(function (props) {
        return typeof props[_HelmetConstants.TAG_NAMES.BASE] !== "undefined";
    }).map(function (props) {
        return props[_HelmetConstants.TAG_NAMES.BASE];
    }).reverse().reduce(function (innermostBaseTag, tag) {
        if (!innermostBaseTag.length) {
            var keys = Object.keys(tag);

            for (var i = 0; i < keys.length; i++) {
                var attributeKey = keys[i];
                var lowerCaseAttributeKey = attributeKey.toLowerCase();

                if (primaryAttributes.indexOf(lowerCaseAttributeKey) !== -1 && tag[lowerCaseAttributeKey]) {
                    return innermostBaseTag.concat(tag);
                }
            }
        }

        return innermostBaseTag;
    }, []);
};

var getTagsFromPropsList = function getTagsFromPropsList(tagName, primaryAttributes, propsList) {
    // Calculate list of tags, giving priority innermost component (end of the propslist)
    var approvedSeenTags = {};

    return propsList.filter(function (props) {
        if (Array.isArray(props[tagName])) {
            return true;
        }
        if (typeof props[tagName] !== "undefined") {
            warn("Helmet: " + tagName + " should be of type \"Array\". Instead found type \"" + _typeof(props[tagName]) + "\"");
        }
        return false;
    }).map(function (props) {
        return props[tagName];
    }).reverse().reduce(function (approvedTags, instanceTags) {
        var instanceSeenTags = {};

        instanceTags.filter(function (tag) {
            var primaryAttributeKey = void 0;
            var keys = Object.keys(tag);
            for (var i = 0; i < keys.length; i++) {
                var attributeKey = keys[i];
                var lowerCaseAttributeKey = attributeKey.toLowerCase();

                // Special rule with link tags, since rel and href are both primary tags, rel takes priority
                if (primaryAttributes.indexOf(lowerCaseAttributeKey) !== -1 && !(primaryAttributeKey === _HelmetConstants.TAG_PROPERTIES.REL && tag[primaryAttributeKey].toLowerCase() === "canonical") && !(lowerCaseAttributeKey === _HelmetConstants.TAG_PROPERTIES.REL && tag[lowerCaseAttributeKey].toLowerCase() === "stylesheet")) {
                    primaryAttributeKey = lowerCaseAttributeKey;
                }
                // Special case for innerHTML which doesn't work lowercased
                if (primaryAttributes.indexOf(attributeKey) !== -1 && (attributeKey === _HelmetConstants.TAG_PROPERTIES.INNER_HTML || attributeKey === _HelmetConstants.TAG_PROPERTIES.CSS_TEXT || attributeKey === _HelmetConstants.TAG_PROPERTIES.ITEM_PROP)) {
                    primaryAttributeKey = attributeKey;
                }
            }

            if (!primaryAttributeKey || !tag[primaryAttributeKey]) {
                return false;
            }

            var value = tag[primaryAttributeKey].toLowerCase();

            if (!approvedSeenTags[primaryAttributeKey]) {
                approvedSeenTags[primaryAttributeKey] = {};
            }

            if (!instanceSeenTags[primaryAttributeKey]) {
                instanceSeenTags[primaryAttributeKey] = {};
            }

            if (!approvedSeenTags[primaryAttributeKey][value]) {
                instanceSeenTags[primaryAttributeKey][value] = true;
                return true;
            }

            return false;
        }).reverse().forEach(function (tag) {
            return approvedTags.push(tag);
        });

        // Update seen tags with tags from this instance
        var keys = Object.keys(instanceSeenTags);
        for (var i = 0; i < keys.length; i++) {
            var attributeKey = keys[i];
            var tagUnion = (0, _objectAssign2.default)({}, approvedSeenTags[attributeKey], instanceSeenTags[attributeKey]);

            approvedSeenTags[attributeKey] = tagUnion;
        }

        return approvedTags;
    }, []).reverse();
};

var getInnermostProperty = function getInnermostProperty(propsList, property) {
    for (var i = propsList.length - 1; i >= 0; i--) {
        var props = propsList[i];

        if (props.hasOwnProperty(property)) {
            return props[property];
        }
    }

    return null;
};

var reducePropsToState = function reducePropsToState(propsList) {
    return {
        baseTag: getBaseTagFromPropsList([_HelmetConstants.TAG_PROPERTIES.HREF], propsList),
        bodyAttributes: getAttributesFromPropsList(_HelmetConstants.ATTRIBUTE_NAMES.BODY, propsList),
        defer: getInnermostProperty(propsList, _HelmetConstants.HELMET_PROPS.DEFER),
        encode: getInnermostProperty(propsList, _HelmetConstants.HELMET_PROPS.ENCODE_SPECIAL_CHARACTERS),
        htmlAttributes: getAttributesFromPropsList(_HelmetConstants.ATTRIBUTE_NAMES.HTML, propsList),
        linkTags: getTagsFromPropsList(_HelmetConstants.TAG_NAMES.LINK, [_HelmetConstants.TAG_PROPERTIES.REL, _HelmetConstants.TAG_PROPERTIES.HREF], propsList),
        metaTags: getTagsFromPropsList(_HelmetConstants.TAG_NAMES.META, [_HelmetConstants.TAG_PROPERTIES.NAME, _HelmetConstants.TAG_PROPERTIES.CHARSET, _HelmetConstants.TAG_PROPERTIES.HTTPEQUIV, _HelmetConstants.TAG_PROPERTIES.PROPERTY, _HelmetConstants.TAG_PROPERTIES.ITEM_PROP], propsList),
        noscriptTags: getTagsFromPropsList(_HelmetConstants.TAG_NAMES.NOSCRIPT, [_HelmetConstants.TAG_PROPERTIES.INNER_HTML], propsList),
        onChangeClientState: getOnChangeClientState(propsList),
        scriptTags: getTagsFromPropsList(_HelmetConstants.TAG_NAMES.SCRIPT, [_HelmetConstants.TAG_PROPERTIES.SRC, _HelmetConstants.TAG_PROPERTIES.INNER_HTML], propsList),
        styleTags: getTagsFromPropsList(_HelmetConstants.TAG_NAMES.STYLE, [_HelmetConstants.TAG_PROPERTIES.CSS_TEXT], propsList),
        title: getTitleFromPropsList(propsList),
        titleAttributes: getAttributesFromPropsList(_HelmetConstants.ATTRIBUTE_NAMES.TITLE, propsList)
    };
};

var rafPolyfill = function () {
    var clock = Date.now();

    return function (callback) {
        var currentTime = Date.now();

        if (currentTime - clock > 16) {
            clock = currentTime;
            callback(currentTime);
        } else {
            setTimeout(function () {
                rafPolyfill(callback);
            }, 0);
        }
    };
}();

var cafPolyfill = function cafPolyfill(id) {
    return clearTimeout(id);
};

var requestAnimationFrame = typeof window !== "undefined" ? window.requestAnimationFrame || window.webkitRequestAnimationFrame || window.mozRequestAnimationFrame || rafPolyfill : global.requestAnimationFrame || rafPolyfill;

var cancelAnimationFrame = typeof window !== "undefined" ? window.cancelAnimationFrame || window.webkitCancelAnimationFrame || window.mozCancelAnimationFrame || cafPolyfill : global.cancelAnimationFrame || cafPolyfill;

var warn = function warn(msg) {
    return console && typeof console.warn === "function" && console.warn(msg);
};

var _helmetCallback = null;

var handleClientStateChange = function handleClientStateChange(newState) {
    if (_helmetCallback) {
        cancelAnimationFrame(_helmetCallback);
    }

    if (newState.defer) {
        _helmetCallback = requestAnimationFrame(function () {
            commitTagChanges(newState, function () {
                _helmetCallback = null;
            });
        });
    } else {
        commitTagChanges(newState);
        _helmetCallback = null;
    }
};

var commitTagChanges = function commitTagChanges(newState, cb) {
    var baseTag = newState.baseTag,
        bodyAttributes = newState.bodyAttributes,
        htmlAttributes = newState.htmlAttributes,
        linkTags = newState.linkTags,
        metaTags = newState.metaTags,
        noscriptTags = newState.noscriptTags,
        onChangeClientState = newState.onChangeClientState,
        scriptTags = newState.scriptTags,
        styleTags = newState.styleTags,
        title = newState.title,
        titleAttributes = newState.titleAttributes;

    updateAttributes(_HelmetConstants.TAG_NAMES.BODY, bodyAttributes);
    updateAttributes(_HelmetConstants.TAG_NAMES.HTML, htmlAttributes);

    updateTitle(title, titleAttributes);

    var tagUpdates = {
        baseTag: updateTags(_HelmetConstants.TAG_NAMES.BASE, baseTag),
        linkTags: updateTags(_HelmetConstants.TAG_NAMES.LINK, linkTags),
        metaTags: updateTags(_HelmetConstants.TAG_NAMES.META, metaTags),
        noscriptTags: updateTags(_HelmetConstants.TAG_NAMES.NOSCRIPT, noscriptTags),
        scriptTags: updateTags(_HelmetConstants.TAG_NAMES.SCRIPT, scriptTags),
        styleTags: updateTags(_HelmetConstants.TAG_NAMES.STYLE, styleTags)
    };

    var addedTags = {};
    var removedTags = {};

    Object.keys(tagUpdates).forEach(function (tagType) {
        var _tagUpdates$tagType = tagUpdates[tagType],
            newTags = _tagUpdates$tagType.newTags,
            oldTags = _tagUpdates$tagType.oldTags;


        if (newTags.length) {
            addedTags[tagType] = newTags;
        }
        if (oldTags.length) {
            removedTags[tagType] = tagUpdates[tagType].oldTags;
        }
    });

    cb && cb();

    onChangeClientState(newState, addedTags, removedTags);
};

var flattenArray = function flattenArray(possibleArray) {
    return Array.isArray(possibleArray) ? possibleArray.join("") : possibleArray;
};

var updateTitle = function updateTitle(title, attributes) {
    if (typeof title !== "undefined" && document.title !== title) {
        document.title = flattenArray(title);
    }

    updateAttributes(_HelmetConstants.TAG_NAMES.TITLE, attributes);
};

var updateAttributes = function updateAttributes(tagName, attributes) {
    var elementTag = document.getElementsByTagName(tagName)[0];

    if (!elementTag) {
        return;
    }

    var helmetAttributeString = elementTag.getAttribute(_HelmetConstants.HELMET_ATTRIBUTE);
    var helmetAttributes = helmetAttributeString ? helmetAttributeString.split(",") : [];
    var attributesToRemove = [].concat(helmetAttributes);
    var attributeKeys = Object.keys(attributes);

    for (var i = 0; i < attributeKeys.length; i++) {
        var attribute = attributeKeys[i];
        var value = attributes[attribute] || "";

        if (elementTag.getAttribute(attribute) !== value) {
            elementTag.setAttribute(attribute, value);
        }

        if (helmetAttributes.indexOf(attribute) === -1) {
            helmetAttributes.push(attribute);
        }

        var indexToSave = attributesToRemove.indexOf(attribute);
        if (indexToSave !== -1) {
            attributesToRemove.splice(indexToSave, 1);
        }
    }

    for (var _i = attributesToRemove.length - 1; _i >= 0; _i--) {
        elementTag.removeAttribute(attributesToRemove[_i]);
    }

    if (helmetAttributes.length === attributesToRemove.length) {
        elementTag.removeAttribute(_HelmetConstants.HELMET_ATTRIBUTE);
    } else if (elementTag.getAttribute(_HelmetConstants.HELMET_ATTRIBUTE) !== attributeKeys.join(",")) {
        elementTag.setAttribute(_HelmetConstants.HELMET_ATTRIBUTE, attributeKeys.join(","));
    }
};

var updateTags = function updateTags(type, tags) {
    var headElement = document.head || document.querySelector(_HelmetConstants.TAG_NAMES.HEAD);
    var tagNodes = headElement.querySelectorAll(type + "[" + _HelmetConstants.HELMET_ATTRIBUTE + "]");
    var oldTags = Array.prototype.slice.call(tagNodes);
    var newTags = [];
    var indexToDelete = void 0;

    if (tags && tags.length) {
        tags.forEach(function (tag) {
            var newElement = document.createElement(type);

            for (var attribute in tag) {
                if (tag.hasOwnProperty(attribute)) {
                    if (attribute === _HelmetConstants.TAG_PROPERTIES.INNER_HTML) {
                        newElement.innerHTML = tag.innerHTML;
                    } else if (attribute === _HelmetConstants.TAG_PROPERTIES.CSS_TEXT) {
                        if (newElement.styleSheet) {
                            newElement.styleSheet.cssText = tag.cssText;
                        } else {
                            newElement.appendChild(document.createTextNode(tag.cssText));
                        }
                    } else {
                        var value = typeof tag[attribute] === "undefined" ? "" : tag[attribute];
                        newElement.setAttribute(attribute, value);
                    }
                }
            }

            newElement.setAttribute(_HelmetConstants.HELMET_ATTRIBUTE, "true");

            // Remove a duplicate tag from domTagstoRemove, so it isn't cleared.
            if (oldTags.some(function (existingTag, index) {
                indexToDelete = index;
                return newElement.isEqualNode(existingTag);
            })) {
                oldTags.splice(indexToDelete, 1);
            } else {
                newTags.push(newElement);
            }
        });
    }

    oldTags.forEach(function (tag) {
        return tag.parentNode.removeChild(tag);
    });
    newTags.forEach(function (tag) {
        return headElement.appendChild(tag);
    });

    return {
        oldTags: oldTags,
        newTags: newTags
    };
};

var generateElementAttributesAsString = function generateElementAttributesAsString(attributes) {
    return Object.keys(attributes).reduce(function (str, key) {
        var attr = typeof attributes[key] !== "undefined" ? key + "=\"" + attributes[key] + "\"" : "" + key;
        return str ? str + " " + attr : attr;
    }, "");
};

var generateTitleAsString = function generateTitleAsString(type, title, attributes, encode) {
    var attributeString = generateElementAttributesAsString(attributes);
    var flattenedTitle = flattenArray(title);
    return attributeString ? "<" + type + " " + _HelmetConstants.HELMET_ATTRIBUTE + "=\"true\" " + attributeString + ">" + encodeSpecialCharacters(flattenedTitle, encode) + "</" + type + ">" : "<" + type + " " + _HelmetConstants.HELMET_ATTRIBUTE + "=\"true\">" + encodeSpecialCharacters(flattenedTitle, encode) + "</" + type + ">";
};

var generateTagsAsString = function generateTagsAsString(type, tags, encode) {
    return tags.reduce(function (str, tag) {
        var attributeHtml = Object.keys(tag).filter(function (attribute) {
            return !(attribute === _HelmetConstants.TAG_PROPERTIES.INNER_HTML || attribute === _HelmetConstants.TAG_PROPERTIES.CSS_TEXT);
        }).reduce(function (string, attribute) {
            var attr = typeof tag[attribute] === "undefined" ? attribute : attribute + "=\"" + encodeSpecialCharacters(tag[attribute], encode) + "\"";
            return string ? string + " " + attr : attr;
        }, "");

        var tagContent = tag.innerHTML || tag.cssText || "";

        var isSelfClosing = _HelmetConstants.SELF_CLOSING_TAGS.indexOf(type) === -1;

        return str + "<" + type + " " + _HelmetConstants.HELMET_ATTRIBUTE + "=\"true\" " + attributeHtml + (isSelfClosing ? "/>" : ">" + tagContent + "</" + type + ">");
    }, "");
};

var convertElementAttributestoReactProps = function convertElementAttributestoReactProps(attributes) {
    var initProps = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};

    return Object.keys(attributes).reduce(function (obj, key) {
        obj[_HelmetConstants.REACT_TAG_MAP[key] || key] = attributes[key];
        return obj;
    }, initProps);
};

var convertReactPropstoHtmlAttributes = function convertReactPropstoHtmlAttributes(props) {
    var initAttributes = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};

    return Object.keys(props).reduce(function (obj, key) {
        obj[_HelmetConstants.HTML_TAG_MAP[key] || key] = props[key];
        return obj;
    }, initAttributes);
};

var generateTitleAsReactComponent = function generateTitleAsReactComponent(type, title, attributes) {
    // assigning into an array to define toString function on it
    var initProps = _defineProperty({
        key: title
    }, _HelmetConstants.HELMET_ATTRIBUTE, true);
    var props = convertElementAttributestoReactProps(attributes, initProps);

    return [_react2.default.createElement(_HelmetConstants.TAG_NAMES.TITLE, props, title)];
};

var generateTagsAsReactComponent = function generateTagsAsReactComponent(type, tags) {
    return tags.map(function (tag, i) {
        var mappedTag = _defineProperty({
            key: i
        }, _HelmetConstants.HELMET_ATTRIBUTE, true);

        Object.keys(tag).forEach(function (attribute) {
            var mappedAttribute = _HelmetConstants.REACT_TAG_MAP[attribute] || attribute;

            if (mappedAttribute === _HelmetConstants.TAG_PROPERTIES.INNER_HTML || mappedAttribute === _HelmetConstants.TAG_PROPERTIES.CSS_TEXT) {
                var content = tag.innerHTML || tag.cssText;
                mappedTag.dangerouslySetInnerHTML = { __html: content };
            } else {
                mappedTag[mappedAttribute] = tag[attribute];
            }
        });

        return _react2.default.createElement(type, mappedTag);
    });
};

var getMethodsForTag = function getMethodsForTag(type, tags, encode) {
    switch (type) {
        case _HelmetConstants.TAG_NAMES.TITLE:
            return {
                toComponent: function toComponent() {
                    return generateTitleAsReactComponent(type, tags.title, tags.titleAttributes, encode);
                },
                toString: function toString() {
                    return generateTitleAsString(type, tags.title, tags.titleAttributes, encode);
                }
            };
        case _HelmetConstants.ATTRIBUTE_NAMES.BODY:
        case _HelmetConstants.ATTRIBUTE_NAMES.HTML:
            return {
                toComponent: function toComponent() {
                    return convertElementAttributestoReactProps(tags);
                },
                toString: function toString() {
                    return generateElementAttributesAsString(tags);
                }
            };
        default:
            return {
                toComponent: function toComponent() {
                    return generateTagsAsReactComponent(type, tags);
                },
                toString: function toString() {
                    return generateTagsAsString(type, tags, encode);
                }
            };
    }
};

var mapStateOnServer = function mapStateOnServer(_ref) {
    var baseTag = _ref.baseTag,
        bodyAttributes = _ref.bodyAttributes,
        encode = _ref.encode,
        htmlAttributes = _ref.htmlAttributes,
        linkTags = _ref.linkTags,
        metaTags = _ref.metaTags,
        noscriptTags = _ref.noscriptTags,
        scriptTags = _ref.scriptTags,
        styleTags = _ref.styleTags,
        _ref$title = _ref.title,
        title = _ref$title === undefined ? "" : _ref$title,
        titleAttributes = _ref.titleAttributes;
    return {
        base: getMethodsForTag(_HelmetConstants.TAG_NAMES.BASE, baseTag, encode),
        bodyAttributes: getMethodsForTag(_HelmetConstants.ATTRIBUTE_NAMES.BODY, bodyAttributes, encode),
        htmlAttributes: getMethodsForTag(_HelmetConstants.ATTRIBUTE_NAMES.HTML, htmlAttributes, encode),
        link: getMethodsForTag(_HelmetConstants.TAG_NAMES.LINK, linkTags, encode),
        meta: getMethodsForTag(_HelmetConstants.TAG_NAMES.META, metaTags, encode),
        noscript: getMethodsForTag(_HelmetConstants.TAG_NAMES.NOSCRIPT, noscriptTags, encode),
        script: getMethodsForTag(_HelmetConstants.TAG_NAMES.SCRIPT, scriptTags, encode),
        style: getMethodsForTag(_HelmetConstants.TAG_NAMES.STYLE, styleTags, encode),
        title: getMethodsForTag(_HelmetConstants.TAG_NAMES.TITLE, { title: title, titleAttributes: titleAttributes }, encode)
    };
};

exports.convertReactPropstoHtmlAttributes = convertReactPropstoHtmlAttributes;
exports.handleClientStateChange = handleClientStateChange;
exports.mapStateOnServer = mapStateOnServer;
exports.reducePropsToState = reducePropsToState;
exports.requestAnimationFrame = requestAnimationFrame;
exports.warn = warn;
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbInJlYWN0L2hlbG1ldC9zcmMvSGVsbWV0VXRpbHMuanMiXSwibmFtZXMiOlsiZW5jb2RlU3BlY2lhbENoYXJhY3RlcnMiLCJzdHIiLCJlbmNvZGUiLCJTdHJpbmciLCJyZXBsYWNlIiwiZ2V0VGl0bGVGcm9tUHJvcHNMaXN0IiwiaW5uZXJtb3N0VGl0bGUiLCJnZXRJbm5lcm1vc3RQcm9wZXJ0eSIsInByb3BzTGlzdCIsIlRJVExFIiwiaW5uZXJtb3N0VGVtcGxhdGUiLCJUSVRMRV9URU1QTEFURSIsImlubmVybW9zdERlZmF1bHRUaXRsZSIsIkRFRkFVTFRfVElUTEUiLCJ1bmRlZmluZWQiLCJnZXRPbkNoYW5nZUNsaWVudFN0YXRlIiwiT05fQ0hBTkdFX0NMSUVOVF9TVEFURSIsImdldEF0dHJpYnV0ZXNGcm9tUHJvcHNMaXN0IiwidGFnVHlwZSIsImZpbHRlciIsInByb3BzIiwibWFwIiwicmVkdWNlIiwidGFnQXR0cnMiLCJjdXJyZW50IiwiZ2V0QmFzZVRhZ0Zyb21Qcm9wc0xpc3QiLCJwcmltYXJ5QXR0cmlidXRlcyIsIkJBU0UiLCJyZXZlcnNlIiwiaW5uZXJtb3N0QmFzZVRhZyIsInRhZyIsImxlbmd0aCIsImtleXMiLCJPYmplY3QiLCJpIiwiYXR0cmlidXRlS2V5IiwibG93ZXJDYXNlQXR0cmlidXRlS2V5IiwidG9Mb3dlckNhc2UiLCJpbmRleE9mIiwiY29uY2F0IiwiZ2V0VGFnc0Zyb21Qcm9wc0xpc3QiLCJ0YWdOYW1lIiwiYXBwcm92ZWRTZWVuVGFncyIsIkFycmF5IiwiaXNBcnJheSIsIndhcm4iLCJhcHByb3ZlZFRhZ3MiLCJpbnN0YW5jZVRhZ3MiLCJpbnN0YW5jZVNlZW5UYWdzIiwicHJpbWFyeUF0dHJpYnV0ZUtleSIsIlJFTCIsIklOTkVSX0hUTUwiLCJDU1NfVEVYVCIsIklURU1fUFJPUCIsInZhbHVlIiwiZm9yRWFjaCIsInB1c2giLCJ0YWdVbmlvbiIsInByb3BlcnR5IiwiaGFzT3duUHJvcGVydHkiLCJyZWR1Y2VQcm9wc1RvU3RhdGUiLCJiYXNlVGFnIiwiSFJFRiIsImJvZHlBdHRyaWJ1dGVzIiwiQk9EWSIsImRlZmVyIiwiREVGRVIiLCJFTkNPREVfU1BFQ0lBTF9DSEFSQUNURVJTIiwiaHRtbEF0dHJpYnV0ZXMiLCJIVE1MIiwibGlua1RhZ3MiLCJMSU5LIiwibWV0YVRhZ3MiLCJNRVRBIiwiTkFNRSIsIkNIQVJTRVQiLCJIVFRQRVFVSVYiLCJQUk9QRVJUWSIsIm5vc2NyaXB0VGFncyIsIk5PU0NSSVBUIiwib25DaGFuZ2VDbGllbnRTdGF0ZSIsInNjcmlwdFRhZ3MiLCJTQ1JJUFQiLCJTUkMiLCJzdHlsZVRhZ3MiLCJTVFlMRSIsInRpdGxlIiwidGl0bGVBdHRyaWJ1dGVzIiwicmFmUG9seWZpbGwiLCJjbG9jayIsIkRhdGUiLCJub3ciLCJjYWxsYmFjayIsImN1cnJlbnRUaW1lIiwic2V0VGltZW91dCIsImNhZlBvbHlmaWxsIiwiaWQiLCJjbGVhclRpbWVvdXQiLCJyZXF1ZXN0QW5pbWF0aW9uRnJhbWUiLCJ3aW5kb3ciLCJ3ZWJraXRSZXF1ZXN0QW5pbWF0aW9uRnJhbWUiLCJtb3pSZXF1ZXN0QW5pbWF0aW9uRnJhbWUiLCJnbG9iYWwiLCJjYW5jZWxBbmltYXRpb25GcmFtZSIsIndlYmtpdENhbmNlbEFuaW1hdGlvbkZyYW1lIiwibW96Q2FuY2VsQW5pbWF0aW9uRnJhbWUiLCJjb25zb2xlIiwibXNnIiwiX2hlbG1ldENhbGxiYWNrIiwiaGFuZGxlQ2xpZW50U3RhdGVDaGFuZ2UiLCJuZXdTdGF0ZSIsImNvbW1pdFRhZ0NoYW5nZXMiLCJjYiIsInVwZGF0ZUF0dHJpYnV0ZXMiLCJ1cGRhdGVUaXRsZSIsInRhZ1VwZGF0ZXMiLCJ1cGRhdGVUYWdzIiwiYWRkZWRUYWdzIiwicmVtb3ZlZFRhZ3MiLCJuZXdUYWdzIiwib2xkVGFncyIsImZsYXR0ZW5BcnJheSIsInBvc3NpYmxlQXJyYXkiLCJqb2luIiwiYXR0cmlidXRlcyIsImRvY3VtZW50IiwiZWxlbWVudFRhZyIsImdldEVsZW1lbnRzQnlUYWdOYW1lIiwiaGVsbWV0QXR0cmlidXRlU3RyaW5nIiwiZ2V0QXR0cmlidXRlIiwiaGVsbWV0QXR0cmlidXRlcyIsInNwbGl0IiwiYXR0cmlidXRlc1RvUmVtb3ZlIiwiYXR0cmlidXRlS2V5cyIsImF0dHJpYnV0ZSIsInNldEF0dHJpYnV0ZSIsImluZGV4VG9TYXZlIiwic3BsaWNlIiwicmVtb3ZlQXR0cmlidXRlIiwidHlwZSIsInRhZ3MiLCJoZWFkRWxlbWVudCIsImhlYWQiLCJxdWVyeVNlbGVjdG9yIiwiSEVBRCIsInRhZ05vZGVzIiwicXVlcnlTZWxlY3RvckFsbCIsInByb3RvdHlwZSIsInNsaWNlIiwiY2FsbCIsImluZGV4VG9EZWxldGUiLCJuZXdFbGVtZW50IiwiY3JlYXRlRWxlbWVudCIsImlubmVySFRNTCIsInN0eWxlU2hlZXQiLCJjc3NUZXh0IiwiYXBwZW5kQ2hpbGQiLCJjcmVhdGVUZXh0Tm9kZSIsInNvbWUiLCJleGlzdGluZ1RhZyIsImluZGV4IiwiaXNFcXVhbE5vZGUiLCJwYXJlbnROb2RlIiwicmVtb3ZlQ2hpbGQiLCJnZW5lcmF0ZUVsZW1lbnRBdHRyaWJ1dGVzQXNTdHJpbmciLCJrZXkiLCJhdHRyIiwiZ2VuZXJhdGVUaXRsZUFzU3RyaW5nIiwiYXR0cmlidXRlU3RyaW5nIiwiZmxhdHRlbmVkVGl0bGUiLCJnZW5lcmF0ZVRhZ3NBc1N0cmluZyIsImF0dHJpYnV0ZUh0bWwiLCJzdHJpbmciLCJ0YWdDb250ZW50IiwiaXNTZWxmQ2xvc2luZyIsImNvbnZlcnRFbGVtZW50QXR0cmlidXRlc3RvUmVhY3RQcm9wcyIsImluaXRQcm9wcyIsIm9iaiIsImNvbnZlcnRSZWFjdFByb3BzdG9IdG1sQXR0cmlidXRlcyIsImluaXRBdHRyaWJ1dGVzIiwiZ2VuZXJhdGVUaXRsZUFzUmVhY3RDb21wb25lbnQiLCJnZW5lcmF0ZVRhZ3NBc1JlYWN0Q29tcG9uZW50IiwibWFwcGVkVGFnIiwibWFwcGVkQXR0cmlidXRlIiwiY29udGVudCIsImRhbmdlcm91c2x5U2V0SW5uZXJIVE1MIiwiX19odG1sIiwiZ2V0TWV0aG9kc0ZvclRhZyIsInRvQ29tcG9uZW50IiwidG9TdHJpbmciLCJtYXBTdGF0ZU9uU2VydmVyIiwiYmFzZSIsImxpbmsiLCJtZXRhIiwibm9zY3JpcHQiLCJzY3JpcHQiLCJzdHlsZSJdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7O0FBQUE7Ozs7QUFDQTs7OztBQUNBOzs7Ozs7QUFXQSxJQUFNQSwwQkFBMEIsU0FBMUJBLHVCQUEwQixDQUFDQyxHQUFELEVBQXdCO0FBQUEsUUFBbEJDLE1BQWtCLHVFQUFULElBQVM7O0FBQ3BELFFBQUlBLFdBQVcsS0FBZixFQUFzQjtBQUNsQixlQUFPQyxPQUFPRixHQUFQLENBQVA7QUFDSDs7QUFFRCxXQUFPRSxPQUFPRixHQUFQLEVBQ0ZHLE9BREUsQ0FDTSxJQUROLEVBQ1ksT0FEWixFQUVGQSxPQUZFLENBRU0sSUFGTixFQUVZLE1BRlosRUFHRkEsT0FIRSxDQUdNLElBSE4sRUFHWSxNQUhaLEVBSUZBLE9BSkUsQ0FJTSxJQUpOLEVBSVksUUFKWixFQUtGQSxPQUxFLENBS00sSUFMTixFQUtZLFFBTFosQ0FBUDtBQU1ILENBWEQ7O0FBYUEsSUFBTUMsd0JBQXdCLFNBQXhCQSxxQkFBd0IsWUFBYTtBQUN2QyxRQUFNQyxpQkFBaUJDLHFCQUFxQkMsU0FBckIsRUFBZ0MsMkJBQVVDLEtBQTFDLENBQXZCO0FBQ0EsUUFBTUMsb0JBQW9CSCxxQkFDdEJDLFNBRHNCLEVBRXRCLDhCQUFhRyxjQUZTLENBQTFCOztBQUtBLFFBQUlELHFCQUFxQkosY0FBekIsRUFBeUM7QUFDckM7QUFDQSxlQUFPSSxrQkFBa0JOLE9BQWxCLENBQTBCLEtBQTFCLEVBQWlDO0FBQUEsbUJBQU1FLGNBQU47QUFBQSxTQUFqQyxDQUFQO0FBQ0g7O0FBRUQsUUFBTU0sd0JBQXdCTCxxQkFDMUJDLFNBRDBCLEVBRTFCLDhCQUFhSyxhQUZhLENBQTlCOztBQUtBLFdBQU9QLGtCQUFrQk0scUJBQWxCLElBQTJDRSxTQUFsRDtBQUNILENBbEJEOztBQW9CQSxJQUFNQyx5QkFBeUIsU0FBekJBLHNC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QkFBVWxILElBQTNCLEVBQWlDRCxRQUFqQyxFQUEyQ3RFLE1BQTNDLENBYkg7QUFjSGdNLGtCQUFVUCxpQkFBaUIsMkJBQVU1RyxRQUEzQixFQUFxQ0QsWUFBckMsRUFBbUQ1RSxNQUFuRCxDQWRQO0FBZUhpTSxnQkFBUVIsaUJBQWlCLDJCQUFVekcsTUFBM0IsRUFBbUNELFVBQW5DLEVBQStDL0UsTUFBL0MsQ0FmTDtBQWdCSGtNLGVBQU9ULGlCQUFpQiwyQkFBVXRHLEtBQTNCLEVBQWtDRCxTQUFsQyxFQUE2Q2xGLE1BQTdDLENBaEJKO0FBaUJIb0YsZUFBT3FHLGlCQUFpQiwyQkFBVWxMLEtBQTNCLEVBQWtDLEVBQUM2RSxZQUFELEVBQVFDLGdDQUFSLEVBQWxDLEVBQTREckYsTUFBNUQ7QUFqQkosS0Faa0I7QUFBQSxDQUF6Qjs7UUFnQ1FnTCxpQyxHQUFBQSxpQztRQUNBckUsdUIsR0FBQUEsdUI7UUFDQWlGLGdCLEdBQUFBLGdCO1FBQ0FsSSxrQixHQUFBQSxrQjtRQUNBc0MscUIsR0FBQUEscUI7UUFDQXJELEksR0FBQUEsSSIsImZpbGUiOiJ1bmtub3duIiwic291cmNlUm9vdCI6Im5vZGVfbW9kdWxlcy9ldGhpY2FsIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IFJlYWN0IGZyb20gXCJyZWFjdFwiO1xuaW1wb3J0IG9iamVjdEFzc2lnbiBmcm9tIFwib2JqZWN0LWFzc2lnblwiO1xuaW1wb3J0IHtcbiAgICBBVFRSSUJVVEVfTkFNRVMsXG4gICAgSEVMTUVUX0FUVFJJQlVURSxcbiAgICBIRUxNRVRfUFJPUFMsXG4gICAgSFRNTF9UQUdfTUFQLFxuICAgIFJFQUNUX1RBR19NQVAsXG4gICAgU0VMRl9DTE9TSU5HX1RBR1MsXG4gICAgVEFHX05BTUVTLFxuICAgIFRBR19QUk9QRVJUSUVTXG59IGZyb20gXCIuL0hlbG1ldENvbnN0YW50cy5qc1wiO1xuXG5jb25zdCBlbmNvZGVTcGVjaWFsQ2hhcmFjdGVycyA9IChzdHIsIGVuY29kZSA9IHRydWUpID0+IHtcbiAgICBpZiAoZW5jb2RlID09PSBmYWxzZSkge1xuICAgICAgICByZXR1cm4gU3RyaW5nKHN0cik7XG4gICAgfVxuXG4gICAgcmV0dXJuIFN0cmluZyhzdHIpXG4gICAgICAgIC5yZXBsYWNlKC8mL2csIFwiJmFtcDtcIilcbiAgICAgICAgLnJlcGxhY2UoLzwvZywgXCImbHQ7XCIpXG4gICAgICAgIC5yZXBsYWNlKC8+L2csIFwiJmd0O1wiKVxuICAgICAgICAucmVwbGFjZSgvXCIvZywgXCImcXVvdDtcIilcbiAgICAgICAgLnJlcGxhY2UoLycvZywgXCImI3gyNztcIik7XG59O1xuXG5jb25zdCBnZXRUaXRsZUZyb21Qcm9wc0xpc3QgPSBwcm9wc0xpc3QgPT4ge1xuICAgIGNvbnN0IGlubmVybW9zdFRpdGxlID0gZ2V0SW5uZXJtb3N0UHJvcGVydHkocHJvcHNMaXN0LCBUQUdfTkFNRVMuVElUTEUpO1xuICAgIGNvbnN0IGlubmVybW9zdFRlbXBsYXRlID0gZ2V0SW5uZXJtb3N0UHJvcGVydHkoXG4gICAgICAgIHByb3BzTGlzdCxcbiAgICAgICAgSEVMTUVUX1BST1BTLlRJVExFX1RFTVBMQVRFXG4gICAgKTtcblxuICAgIGlmIChpbm5lcm1vc3RUZW1wbGF0ZSAmJiBpbm5lcm1vc3RUaXRsZSkge1xuICAgICAgICAvLyB1c2UgZnVuY3Rpb24gYXJnIHRvIGF2b2lkIG5lZWQgdG8gZXNjYXBlICQgY2hhcmFjdGVyc1xuICAgICAgICByZXR1cm4gaW5uZXJtb3N0VGVtcGxhdGUucmVwbGFjZSgvJXMvZywgKCkgPT4gaW5uZXJtb3N0VGl0bGUpO1xuICAgIH1cblxuICAgIGNvbnN0IGlubmVybW9zdERlZmF1bHRUaXRsZSA9IGdldElubmVybW9zdFByb3BlcnR5KFxuICAgICAgICBwcm9wc0xpc3QsXG4gICAgICAgIEhFTE1FVF9QUk9QUy5ERUZBVUxUX1RJVExFXG4gICAgKTtcblxuICAgIHJldHVybiBpbm5lcm1vc3RUaXRsZSB8fCBpbm5lcm1vc3REZWZhdWx0VGl0bGUgfHwgdW5kZWZpbmVkO1xufTtcblxuY29uc3QgZ2V0T25DaGFuZ2VDbGllbnRTdGF0ZSA9IHByb3BzTGlzdCA9PiB7XG4gICAgcmV0dXJuIChcbiAgICAgICAgZ2V0SW5uZXJtb3N0UHJvcGVydHkocHJvcHNMaXN0LCBIRUxNRVRfUFJPUFMuT05fQ0hBTkdFX0NMSUVOVF9TVEFURSkgfHxcbiAgICAgICAgKCgpID0+IHt9KVxuICAgICk7XG59O1xuXG5jb25zdCBnZXRBdHRyaWJ1dGVzRnJvbVByb3BzTGlzdCA9ICh0YWdUeXBlLCBwcm9wc0xpc3QpID0+IHtcbiAgICByZXR1cm4gcHJvcHNMaXN0XG4gICAgICAgIC5maWx0ZXIocHJvcHMgPT4gdHlwZW9mIHByb3BzW3RhZ1R5cGVdICE9PSBcInVuZGVmaW5lZFwiKVxuICAgICAgICAubWFwKHByb3BzID0+IHByb3BzW3RhZ1R5cGVdKVxuICAgICAgICAucmVkdWNlKCh0YWdBdHRycywgY3VycmVudCkgPT4ge1xuICAgICAgICAgICAgcmV0dXJuIHsuLi50YWdBdHRycywgLi4uY3VycmVudH07XG4gICAgICAgIH0sIHt9KTtcbn07XG5cbmNvbnN0IGdldEJhc2VUYWdGcm9tUHJvcHNMaXN0ID0gKHByaW1hcnlBdHRyaWJ1dGVzLCBwcm9wc0xpc3QpID0+IHtcbiAgICByZXR1cm4gcHJvcHNMaXN0XG4gICAgICAgIC5maWx0ZXIocHJvcHMgPT4gdHlwZW9mIHByb3BzW1RBR19OQU1FUy5CQVNFXSAhPT0gXCJ1bmRlZmluZWRcIilcbiAgICAgICAgLm1hcChwcm9wcyA9PiBwcm9wc1tUQUdfTkFNRVMuQkFTRV0pXG4gICAgICAgIC5yZXZlcnNlKClcbiAgICAgICAgLnJlZHVjZSgoaW5uZXJtb3N0QmFzZVRhZywgdGFnKSA9PiB7XG4gICAgICAgICAgICBpZiAoIWlubmVybW9zdEJhc2VUYWcubGVuZ3RoKSB7XG4gICAgICAgICAgICAgICAgY29uc3Qga2V5cyA9IE9iamVjdC5rZXlzKHRhZyk7XG5cbiAgICAgICAgICAgICAgICBmb3IgKGxldCBpID0gMDsgaSA8IGtleXMubGVuZ3RoOyBpKyspIHtcbiAgICAgICAgICAgICAgICAgICAgY29uc3QgYXR0cmlidXRlS2V5ID0ga2V5c1tpXTtcbiAgICAgICAgICAgICAgICAgICAgY29uc3QgbG93ZXJDYXNlQXR0cmlidXRlS2V5ID0gYXR0cmlidXRlS2V5LnRvTG93ZXJDYXNlKCk7XG5cbiAgICAgICAgICAgICAgICAgICAgaWYgKFxuICAgICAgICAgICAgICAgICAgICAgICAgcHJpbWFyeUF0dHJpYnV0ZXMuaW5kZXhPZihsb3dlckNhc2VBdHRyaWJ1dGVLZXkpICE9PVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIC0xICYmXG4gICAgICAgICAgICAgICAgICAgICAgICB0YWdbbG93ZXJDYXNlQXR0cmlidXRlS2V5XVxuICAgICAgICAgICAgICAgICAgICApIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIHJldHVybiBpbm5lcm1vc3RCYXNlVGFnLmNvbmNhdCh0YWcpO1xuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICByZXR1cm4gaW5uZXJtb3N0QmFzZVRhZztcbiAgICAgICAgfSwgW10pO1xufTtcblxuY29uc3QgZ2V0VGFnc0Zyb21Qcm9wc0xpc3QgPSAodGFnTmFtZSwgcHJpbWFyeUF0dHJpYnV0ZXMsIHByb3BzTGlzdCkgPT4ge1xuICAgIC8vIENhbGN1bGF0ZSBsaXN0IG9mIHRhZ3MsIGdpdmluZyBwcmlvcml0eSBpbm5lcm1vc3QgY29tcG9uZW50IChlbmQgb2YgdGhlIHByb3BzbGlzdClcbiAgICBjb25zdCBhcHByb3ZlZFNlZW5UYWdzID0ge307XG5cbiAgICByZXR1cm4gcHJvcHNMaXN0XG4gICAgICAgIC5maWx0ZXIocHJvcHMgPT4ge1xuICAgICAgICAgICAgaWYgKEFycmF5LmlzQXJyYXkocHJvcHNbdGFnTmFtZV0pKSB7XG4gICAgICAgICAgICAgICAgcmV0dXJuIHRydWU7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBpZiAodHlwZW9mIHByb3BzW3RhZ05hbWVdICE9PSBcInVuZGVmaW5lZFwiKSB7XG4gICAgICAgICAgICAgICAgd2FybihcbiAgICAgICAgICAgICAgICAgICAgYEhlbG1ldDogJHt0YWdOYW1lfSBzaG91bGQgYmUgb2YgdHlwZSBcIkFycmF5XCIuIEluc3RlYWQgZm91bmQgdHlwZSBcIiR7dHlwZW9mIHByb3BzW1xuICAgICAgICAgICAgICAgICAgICAgICAgdGFnTmFtZVxuICAgICAgICAgICAgICAgICAgICBdfVwiYFxuICAgICAgICAgICAgICAgICk7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICByZXR1cm4gZmFsc2U7XG4gICAgICAgIH0pXG4gICAgICAgIC5tYXAocHJvcHMgPT4gcHJvcHNbdGFnTmFtZV0pXG4gICAgICAgIC5yZXZlcnNlKClcbiAgICAgICAgLnJlZHVjZSgoYXBwcm92ZWRUYWdzLCBpbnN0YW5jZVRhZ3MpID0+IHtcbiAgICAgICAgICAgIGNvbnN0IGluc3RhbmNlU2VlblRhZ3MgPSB7fTtcblxuICAgICAgICAgICAgaW5zdGFuY2VUYWdzXG4gICAgICAgICAgICAgICAgLmZpbHRlcih0YWcgPT4ge1xuICAgICAgICAgICAgICAgICAgICBsZXQgcHJpbWFyeUF0dHJpYnV0ZUtleTtcbiAgICAgICAgICAgICAgICAgICAgY29uc3Qga2V5cyA9IE9iamVjdC5rZXlzKHRhZyk7XG4gICAgICAgICAgICAgICAgICAgIGZvciAobGV0IGkgPSAwOyBpIDwga2V5cy5sZW5ndGg7IGkrKykge1xuICAgICAgICAgICAgICAgICAgICAgICAgY29uc3QgYXR0cmlidXRlS2V5ID0ga2V5c1tpXTtcbiAgICAgICAgICAgICAgICAgICAgICAgIGNvbnN0IGxvd2VyQ2FzZUF0dHJpYnV0ZUtleSA9IGF0dHJpYnV0ZUtleS50b0xvd2VyQ2FzZSgpO1xuXG4gICAgICAgICAgICAgICAgICAgICAgICAvLyBTcGVjaWFsIHJ1bGUgd2l0aCBsaW5rIHRhZ3MsIHNpbmNlIHJlbCBhbmQgaHJlZiBhcmUgYm90aCBwcmltYXJ5IHRhZ3MsIHJlbCB0YWtlcyBwcmlvcml0eVxuICAgICAgICAgICAgICAgICAgICAgICAgaWYgKFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHByaW1hcnlBdHRyaWJ1dGVzLmluZGV4T2YobG93ZXJDYXNlQXR0cmlidXRlS2V5KSAhPT1cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgLTEgJiZcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAhKFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBwcmltYXJ5QXR0cmlidXRlS2V5ID09PSBUQUdfUFJPUEVSVElFUy5SRUwgJiZcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgdGFnW3ByaW1hcnlBdHRyaWJ1dGVLZXldLnRvTG93ZXJDYXNlKCkgPT09XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBcImNhbm9uaWNhbFwiXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgKSAmJlxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICEoXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGxvd2VyQ2FzZUF0dHJpYnV0ZUtleSA9PT0gVEFHX1BST1BFUlRJRVMuUkVMICYmXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHRhZ1tsb3dlckNhc2VBdHRyaWJ1dGVLZXldLnRvTG93ZXJDYXNlKCkgPT09XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBcInN0eWxlc2hlZXRcIlxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIClcbiAgICAgICAgICAgICAgICAgICAgICAgICkge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHByaW1hcnlBdHRyaWJ1dGVLZXkgPSBsb3dlckNhc2VBdHRyaWJ1dGVLZXk7XG4gICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgICAgICAvLyBTcGVjaWFsIGNhc2UgZm9yIGlubmVySFRNTCB3aGljaCBkb2Vzbid0IHdvcmsgbG93ZXJjYXNlZFxuICAgICAgICAgICAgICAgICAgICAgICAgaWYgKFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHByaW1hcnlBdHRyaWJ1dGVzLmluZGV4T2YoYXR0cmlidXRlS2V5KSAhPT0gLTEgJiZcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAoYXR0cmlidXRlS2V5ID09PSBUQUdfUFJPUEVSVElFUy5JTk5FUl9IVE1MIHx8XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGF0dHJpYnV0ZUtleSA9PT0gVEFHX1BST1BFUlRJRVMuQ1NTX1RFWFQgfHxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgYXR0cmlidXRlS2V5ID09PSBUQUdfUFJPUEVSVElFUy5JVEVNX1BST1ApXG4gICAgICAgICAgICAgICAgICAgICAgICApIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBwcmltYXJ5QXR0cmlidXRlS2V5ID0gYXR0cmlidXRlS2V5O1xuICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICB9XG5cbiAgICAgICAgICAgICAgICAgICAgaWYgKCFwcmltYXJ5QXR0cmlidXRlS2V5IHx8ICF0YWdbcHJpbWFyeUF0dHJpYnV0ZUtleV0pIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIHJldHVybiBmYWxzZTtcbiAgICAgICAgICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICAgICAgICAgIGNvbnN0IHZhbHVlID0gdGFnW3ByaW1hcnlBdHRyaWJ1dGVLZXldLnRvTG93ZXJDYXNlKCk7XG5cbiAgICAgICAgICAgICAgICAgICAgaWYgKCFhcHByb3ZlZFNlZW5UYWdzW3ByaW1hcnlBdHRyaWJ1dGVLZXldKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICBhcHByb3ZlZFNlZW5UYWdzW3ByaW1hcnlBdHRyaWJ1dGVLZXldID0ge307XG4gICAgICAgICAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgICAgICAgICBpZiAoIWluc3RhbmNlU2VlblRhZ3NbcHJpbWFyeUF0dHJpYnV0ZUtleV0pIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIGluc3RhbmNlU2VlblRhZ3NbcHJpbWFyeUF0dHJpYnV0ZUtleV0gPSB7fTtcbiAgICAgICAgICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICAgICAgICAgIGlmICghYXBwcm92ZWRTZWVuVGFnc1twcmltYXJ5QXR0cmlidXRlS2V5XVt2YWx1ZV0pIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIGluc3RhbmNlU2VlblRhZ3NbcHJpbWFyeUF0dHJpYnV0ZUtleV1bdmFsdWVdID0gdHJ1ZTtcbiAgICAgICAgICAgICAgICAgICAgICAgIHJldHVybiB0cnVlO1xuICAgICAgICAgICAgICAgICAgICB9XG5cbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuIGZhbHNlO1xuICAgICAgICAgICAgICAgIH0pXG4gICAgICAgICAgICAgICAgLnJldmVyc2UoKVxuICAgICAgICAgICAgICAgIC5mb3JFYWNoKHRhZyA9PiBhcHByb3ZlZFRhZ3MucHVzaCh0YWcpKTtcblxuICAgICAgICAgICAgLy8gVXBkYXRlIHNlZW4gdGFncyB3aXRoIHRhZ3MgZnJvbSB0aGlzIGluc3RhbmNlXG4gICAgICAgICAgICBjb25zdCBrZXlzID0gT2JqZWN0LmtleXMoaW5zdGFuY2VTZWVuVGFncyk7XG4gICAgICAgICAgICBmb3IgKGxldCBpID0gMDsgaSA8IGtleXMubGVuZ3RoOyBpKyspIHtcbiAgICAgICAgICAgICAgICBjb25zdCBhdHRyaWJ1dGVLZXkgPSBrZXlzW2ldO1xuICAgICAgICAgICAgICAgIGNvbnN0IHRhZ1VuaW9uID0gb2JqZWN0QXNzaWduKFxuICAgICAgICAgICAgICAgICAgICB7fSxcbiAgICAgICAgICAgICAgICAgICAgYXBwcm92ZWRTZWVuVGFnc1thdHRyaWJ1dGVLZXldLFxuICAgICAgICAgICAgICAgICAgICBpbnN0YW5jZVNlZW5UYWdzW2F0dHJpYnV0ZUtleV1cbiAgICAgICAgICAgICAgICApO1xuXG4gICAgICAgICAgICAgICAgYXBwcm92ZWRTZWVuVGFnc1thdHRyaWJ1dGVLZXldID0gdGFnVW5pb247XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIHJldHVybiBhcHByb3ZlZFRhZ3M7XG4gICAgICAgIH0sIFtdKVxuICAgICAgICAucmV2ZXJzZSgpO1xufTtcblxuY29uc3QgZ2V0SW5uZXJtb3N0UHJvcGVydHkgPSAocHJvcHNMaXN0LCBwcm9wZXJ0eSkgPT4ge1xuICAgIGZvciAobGV0IGkgPSBwcm9wc0xpc3QubGVuZ3RoIC0gMTsgaSA+PSAwOyBpLS0pIHtcbiAgICAgICAgY29uc3QgcHJvcHMgPSBwcm9wc0xpc3RbaV07XG5cbiAgICAgICAgaWYgKHByb3BzLmhhc093blByb3BlcnR5KHByb3BlcnR5KSkge1xuICAgICAgICAgICAgcmV0dXJuIHByb3BzW3Byb3BlcnR5XTtcbiAgICAgICAgfVxuICAgIH1cblxuICAgIHJldHVybiBudWxsO1xufTtcblxuY29uc3QgcmVkdWNlUHJvcHNUb1N0YXRlID0gcHJvcHNMaXN0ID0+ICh7XG4gICAgYmFzZVRhZzogZ2V0QmFzZVRhZ0Zyb21Qcm9wc0xpc3QoW1RBR19QUk9QRVJUSUVTLkhSRUZdLCBwcm9wc0xpc3QpLFxuICAgIGJvZHlBdHRyaWJ1dGVzOiBnZXRBdHRyaWJ1dGVzRnJvbVByb3BzTGlzdChBVFRSSUJVVEVfTkFNRVMuQk9EWSwgcHJvcHNMaXN0KSxcbiAgICBkZWZlcjogZ2V0SW5uZXJtb3N0UHJvcGVydHkocHJvcHNMaXN0LCBIRUxNRVRfUFJPUFMuREVGRVIpLFxuICAgIGVuY29kZTogZ2V0SW5uZXJtb3N0UHJvcGVydHkoXG4gICAgICAgIHByb3BzTGlzdCxcbiAgICAgICAgSEVMTUVUX1BST1BTLkVOQ09ERV9TUEVDSUFMX0NIQVJBQ1RFUlNcbiAgICApLFxuICAgIGh0bWxBdHRyaWJ1dGVzOiBnZXRBdHRyaWJ1dGVzRnJvbVByb3BzTGlzdChBVFRSSUJVVEVfTkFNRVMuSFRNTCwgcHJvcHNMaXN0KSxcbiAgICBsaW5rVGFnczogZ2V0VGFnc0Zyb21Qcm9wc0xpc3QoXG4gICAgICAgIFRBR19OQU1FUy5MSU5LLFxuICAgICAgICBbVEFHX1BST1BFUlRJRVMuUkVMLCBUQUdfUFJPUEVSVElFUy5IUkVGXSxcbiAgICAgICAgcHJvcHNMaXN0XG4gICAgKSxcbiAgICBtZXRhVGFnczogZ2V0VGFnc0Zyb21Qcm9wc0xpc3QoXG4gICAgICAgIFRBR19OQU1FUy5NRVRBLFxuICAgICAgICBbXG4gICAgICAgICAgICBUQUdfUFJPUEVSVElFUy5OQU1FLFxuICAgICAgICAgICAgVEFHX1BST1BFUlRJRVMuQ0hBUlNFVCxcbiAgICAgICAgICAgIFRBR19QUk9QRVJUSUVTLkhUVFBFUVVJVixcbiAgICAgICAgICAgIFRBR19QUk9QRVJUSUVTLlBST1BFUlRZLFxuICAgICAgICAgICAgVEFHX1BST1BFUlRJRVMuSVRFTV9QUk9QXG4gICAgICAgIF0sXG4gICAgICAgIHByb3BzTGlzdFxuICAgICksXG4gICAgbm9zY3JpcHRUYWdzOiBnZXRUYWdzRnJvbVByb3BzTGlzdChcbiAgICAgICAgVEFHX05BTUVTLk5PU0NSSVBULFxuICAgICAgICBbVEFHX1BST1BFUlRJRVMuSU5ORVJfSFRNTF0sXG4gICAgICAgIHByb3BzTGlzdFxuICAgICksXG4gICAgb25DaGFuZ2VDbGllbnRTdGF0ZTogZ2V0T25DaGFuZ2VDbGllbnRTdGF0ZShwcm9wc0xpc3QpLFxuICAgIHNjcmlwdFRhZ3M6IGdldFRhZ3NGcm9tUHJvcHNMaXN0KFxuICAgICAgICBUQUdfTkFNRVMuU0NSSVBULFxuICAgICAgICBbVEFHX1BST1BFUlRJRVMuU1JDLCBUQUdfUFJPUEVSVElFUy5JTk5FUl9IVE1MXSxcbiAgICAgICAgcHJvcHNMaXN0XG4gICAgKSxcbiAgICBzdHlsZVRhZ3M6IGdldFRhZ3NGcm9tUHJvcHNMaXN0KFxuICAgICAgICBUQUdfTkFNRVMuU1RZTEUsXG4gICAgICAgIFtUQUdfUFJPUEVSVElFUy5DU1NfVEVYVF0sXG4gICAgICAgIHByb3BzTGlzdFxuICAgICksXG4gICAgdGl0bGU6IGdldFRpdGxlRnJvbVByb3BzTGlzdChwcm9wc0xpc3QpLFxuICAgIHRpdGxlQXR0cmlidXRlczogZ2V0QXR0cmlidXRlc0Zyb21Qcm9wc0xpc3QoXG4gICAgICAgIEFUVFJJQlVURV9OQU1FUy5USVRMRSxcbiAgICAgICAgcHJvcHNMaXN0XG4gICAgKVxufSk7XG5cbmNvbnN0IHJhZlBvbHlmaWxsID0gKCgpID0+IHtcbiAgICBsZXQgY2xvY2sgPSBEYXRlLm5vdygpO1xuXG4gICAgcmV0dXJuIChjYWxsYmFjazogRnVuY3Rpb24pID0+IHtcbiAgICAgICAgY29uc3QgY3VycmVudFRpbWUgPSBEYXRlLm5vdygpO1xuXG4gICAgICAgIGlmIChjdXJyZW50VGltZSAtIGNsb2NrID4gMTYpIHtcbiAgICAgICAgICAgIGNsb2NrID0gY3VycmVudFRpbWU7XG4gICAgICAgICAgICBjYWxsYmFjayhjdXJyZW50VGltZSk7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICBzZXRUaW1lb3V0KCgpID0+IHtcbiAgICAgICAgICAgICAgICByYWZQb2x5ZmlsbChjYWxsYmFjayk7XG4gICAgICAgICAgICB9LCAwKTtcbiAgICAgICAgfVxuICAgIH07XG59KSgpO1xuXG5jb25zdCBjYWZQb2x5ZmlsbCA9IChpZDogc3RyaW5nIHwgbnVtYmVyKSA9PiBjbGVhclRpbWVvdXQoaWQpO1xuXG5jb25zdCByZXF1ZXN0QW5pbWF0aW9uRnJhbWUgPSB0eXBlb2Ygd2luZG93ICE9PSBcInVuZGVmaW5lZFwiXG4gICAgPyB3aW5kb3cucmVxdWVzdEFuaW1hdGlvbkZyYW1lIHx8XG4gICAgICAgICAgd2luZG93LndlYmtpdFJlcXVlc3RBbmltYXRpb25GcmFtZSB8fFxuICAgICAgICAgIHdpbmRvdy5tb3pSZXF1ZXN0QW5pbWF0aW9uRnJhbWUgfHxcbiAgICAgICAgICByYWZQb2x5ZmlsbFxuICAgIDogZ2xvYmFsLnJlcXVlc3RBbmltYXRpb25GcmFtZSB8fCByYWZQb2x5ZmlsbDtcblxuY29uc3QgY2FuY2VsQW5pbWF0aW9uRnJhbWUgPSB0eXBlb2Ygd2luZG93ICE9PSBcInVuZGVmaW5lZFwiXG4gICAgPyB3aW5kb3cuY2FuY2VsQW5pbWF0aW9uRnJhbWUgfHxcbiAgICAgICAgICB3aW5kb3cud2Via2l0Q2FuY2VsQW5pbWF0aW9uRnJhbWUgfHxcbiAgICAgICAgICB3aW5kb3cubW96Q2FuY2VsQW5pbWF0aW9uRnJhbWUgfHxcbiAgICAgICAgICBjYWZQb2x5ZmlsbFxuICAgIDogZ2xvYmFsLmNhbmNlbEFuaW1hdGlvbkZyYW1lIHx8IGNhZlBvbHlmaWxsO1xuXG5jb25zdCB3YXJuID0gbXNnID0+IHtcbiAgICByZXR1cm4gY29uc29sZSAmJiB0eXBlb2YgY29uc29sZS53YXJuID09PSBcImZ1bmN0aW9uXCIgJiYgY29uc29sZS53YXJuKG1zZyk7XG59O1xuXG5sZXQgX2hlbG1ldENhbGxiYWNrID0gbnVsbDtcblxuY29uc3QgaGFuZGxlQ2xpZW50U3RhdGVDaGFuZ2UgPSBuZXdTdGF0ZSA9PiB7XG4gICAgaWYgKF9oZWxtZXRDYWxsYmFjaykge1xuICAgICAgICBjYW5jZWxBbmltYXRpb25GcmFtZShfaGVsbWV0Q2FsbGJhY2spO1xuICAgIH1cblxuICAgIGlmIChuZXdTdGF0ZS5kZWZlcikge1xuICAgICAgICBfaGVsbWV0Q2FsbGJhY2sgPSByZXF1ZXN0QW5pbWF0aW9uRnJhbWUoKCkgPT4ge1xuICAgICAgICAgICAgY29tbWl0VGFnQ2hhbmdlcyhuZXdTdGF0ZSwgKCkgPT4ge1xuICAgICAgICAgICAgICAgIF9oZWxtZXRDYWxsYmFjayA9IG51bGw7XG4gICAgICAgICAgICB9KTtcbiAgICAgICAgfSk7XG4gICAgfSBlbHNlIHtcbiAgICAgICAgY29tbWl0VGFnQ2hhbmdlcyhuZXdTdGF0ZSk7XG4gICAgICAgIF9oZWxtZXRDYWxsYmFjayA9IG51bGw7XG4gICAgfVxufTtcblxuY29uc3QgY29tbWl0VGFnQ2hhbmdlcyA9IChuZXdTdGF0ZSwgY2IpID0+IHtcbiAgICBjb25zdCB7XG4gICAgICAgIGJhc2VUYWcsXG4gICAgICAgIGJvZHlBdHRyaWJ1dGVzLFxuICAgICAgICBodG1sQXR0cmlidXRlcyxcbiAgICAgICAgbGlua1RhZ3MsXG4gICAgICAgIG1ldGFUYWdzLFxuICAgICAgICBub3NjcmlwdFRhZ3MsXG4gICAgICAgIG9uQ2hhbmdlQ2xpZW50U3RhdGUsXG4gICAgICAgIHNjcmlwdFRhZ3MsXG4gICAgICAgIHN0eWxlVGFncyxcbiAgICAgICAgdGl0bGUsXG4gICAgICAgIHRpdGxlQXR0cmlidXRlc1xuICAgIH0gPSBuZXdTdGF0ZTtcbiAgICB1cGRhdGVBdHRyaWJ1dGVzKFRBR19OQU1FUy5CT0RZLCBib2R5QXR0cmlidXRlcyk7XG4gICAgdXBkYXRlQXR0cmlidXRlcyhUQUdfTkFNRVMuSFRNTCwgaHRtbEF0dHJpYnV0ZXMpO1xuXG4gICAgdXBkYXRlVGl0bGUodGl0bGUsIHRpdGxlQXR0cmlidXRlcyk7XG5cbiAgICBjb25zdCB0YWdVcGRhdGVzID0ge1xuICAgICAgICBiYXNlVGFnOiB1cGRhdGVUYWdzKFRBR19OQU1FUy5CQVNFLCBiYXNlVGFnKSxcbiAgICAgICAgbGlua1RhZ3M6IHVwZGF0ZVRhZ3MoVEFHX05BTUVTLkxJTkssIGxpbmtUYWdzKSxcbiAgICAgICAgbWV0YVRhZ3M6IHVwZGF0ZVRhZ3MoVEFHX05BTUVTLk1FVEEsIG1ldGFUYWdzKSxcbiAgICAgICAgbm9zY3JpcHRUYWdzOiB1cGRhdGVUYWdzKFRBR19OQU1FUy5OT1NDUklQVCwgbm9zY3JpcHRUYWdzKSxcbiAgICAgICAgc2NyaXB0VGFnczogdXBkYXRlVGFncyhUQUdfTkFNRVMuU0NSSVBULCBzY3JpcHRUYWdzKSxcbiAgICAgICAgc3R5bGVUYWdzOiB1cGRhdGVUYWdzKFRBR19OQU1FUy5TVFlMRSwgc3R5bGVUYWdzKVxuICAgIH07XG5cbiAgICBjb25zdCBhZGRlZFRhZ3MgPSB7fTtcbiAgICBjb25zdCByZW1vdmVkVGFncyA9IHt9O1xuXG4gICAgT2JqZWN0LmtleXModGFnVXBkYXRlcykuZm9yRWFjaCh0YWdUeXBlID0+IHtcbiAgICAgICAgY29uc3Qge25ld1RhZ3MsIG9sZFRhZ3N9ID0gdGFnVXBkYXRlc1t0YWdUeXBlXTtcblxuICAgICAgICBpZiAobmV3VGFncy5sZW5ndGgpIHtcbiAgICAgICAgICAgIGFkZGVkVGFnc1t0YWdUeXBlXSA9IG5ld1RhZ3M7XG4gICAgICAgIH1cbiAgICAgICAgaWYgKG9sZFRhZ3MubGVuZ3RoKSB7XG4gICAgICAgICAgICByZW1vdmVkVGFnc1t0YWdUeXBlXSA9IHRhZ1VwZGF0ZXNbdGFnVHlwZV0ub2xkVGFncztcbiAgICAgICAgfVxuICAgIH0pO1xuXG4gICAgY2IgJiYgY2IoKTtcblxuICAgIG9uQ2hhbmdlQ2xpZW50U3RhdGUobmV3U3RhdGUsIGFkZGVkVGFncywgcmVtb3ZlZFRhZ3MpO1xufTtcblxuY29uc3QgZmxhdHRlbkFycmF5ID0gcG9zc2libGVBcnJheSA9PiB7XG4gICAgcmV0dXJuIEFycmF5LmlzQXJyYXkocG9zc2libGVBcnJheSlcbiAgICAgICAgPyBwb3NzaWJsZUFycmF5LmpvaW4oXCJcIilcbiAgICAgICAgOiBwb3NzaWJsZUFycmF5O1xufTtcblxuY29uc3QgdXBkYXRlVGl0bGUgPSAodGl0bGUsIGF0dHJpYnV0ZXMpID0+IHtcbiAgICBpZiAodHlwZW9mIHRpdGxlICE9PSBcInVuZGVmaW5lZFwiICYmIGRvY3VtZW50LnRpdGxlICE9PSB0aXRsZSkge1xuICAgICAgICBkb2N1bWVudC50aXRsZSA9IGZsYXR0ZW5BcnJheSh0aXRsZSk7XG4gICAgfVxuXG4gICAgdXBkYXRlQXR0cmlidXRlcyhUQUdfTkFNRVMuVElUTEUsIGF0dHJpYnV0ZXMpO1xufTtcblxuY29uc3QgdXBkYXRlQXR0cmlidXRlcyA9ICh0YWdOYW1lLCBhdHRyaWJ1dGVzKSA9PiB7XG4gICAgY29uc3QgZWxlbWVudFRhZyA9IGRvY3VtZW50LmdldEVsZW1lbnRzQnlUYWdOYW1lKHRhZ05hbWUpWzBdO1xuXG4gICAgaWYgKCFlbGVtZW50VGFnKSB7XG4gICAgICAgIHJldHVybjtcbiAgICB9XG5cbiAgICBjb25zdCBoZWxtZXRBdHRyaWJ1dGVTdHJpbmcgPSBlbGVtZW50VGFnLmdldEF0dHJpYnV0ZShIRUxNRVRfQVRUUklCVVRFKTtcbiAgICBjb25zdCBoZWxtZXRBdHRyaWJ1dGVzID0gaGVsbWV0QXR0cmlidXRlU3RyaW5nXG4gICAgICAgID8gaGVsbWV0QXR0cmlidXRlU3RyaW5nLnNwbGl0KFwiLFwiKVxuICAgICAgICA6IFtdO1xuICAgIGNvbnN0IGF0dHJpYnV0ZXNUb1JlbW92ZSA9IFtdLmNvbmNhdChoZWxtZXRBdHRyaWJ1dGVzKTtcbiAgICBjb25zdCBhdHRyaWJ1dGVLZXlzID0gT2JqZWN0LmtleXMoYXR0cmlidXRlcyk7XG5cbiAgICBmb3IgKGxldCBpID0gMDsgaSA8IGF0dHJpYnV0ZUtleXMubGVuZ3RoOyBpKyspIHtcbiAgICAgICAgY29uc3QgYXR0cmlidXRlID0gYXR0cmlidXRlS2V5c1tpXTtcbiAgICAgICAgY29uc3QgdmFsdWUgPSBhdHRyaWJ1dGVzW2F0dHJpYnV0ZV0gfHwgXCJcIjtcblxuICAgICAgICBpZiAoZWxlbWVudFRhZy5nZXRBdHRyaWJ1dGUoYXR0cmlidXRlKSAhPT0gdmFsdWUpIHtcbiAgICAgICAgICAgIGVsZW1lbnRUYWcuc2V0QXR0cmlidXRlKGF0dHJpYnV0ZSwgdmFsdWUpO1xuICAgICAgICB9XG5cbiAgICAgICAgaWYgKGhlbG1ldEF0dHJpYnV0ZXMuaW5kZXhPZihhdHRyaWJ1dGUpID09PSAtMSkge1xuICAgICAgICAgICAgaGVsbWV0QXR0cmlidXRlcy5wdXNoKGF0dHJpYnV0ZSk7XG4gICAgICAgIH1cblxuICAgICAgICBjb25zdCBpbmRleFRvU2F2ZSA9IGF0dHJpYnV0ZXNUb1JlbW92ZS5pbmRleE9mKGF0dHJpYnV0ZSk7XG4gICAgICAgIGlmIChpbmRleFRvU2F2ZSAhPT0gLTEpIHtcbiAgICAgICAgICAgIGF0dHJpYnV0ZXNUb1JlbW92ZS5zcGxpY2UoaW5kZXhUb1NhdmUsIDEpO1xuICAgICAgICB9XG4gICAgfVxuXG4gICAgZm9yIChsZXQgaSA9IGF0dHJpYnV0ZXNUb1JlbW92ZS5sZW5ndGggLSAxOyBpID49IDA7IGktLSkge1xuICAgICAgICBlbGVtZW50VGFnLnJlbW92ZUF0dHJpYnV0ZShhdHRyaWJ1dGVzVG9SZW1vdmVbaV0pO1xuICAgIH1cblxuICAgIGlmIChoZWxtZXRBdHRyaWJ1dGVzLmxlbmd0aCA9PT0gYXR0cmlidXRlc1RvUmVtb3ZlLmxlbmd0aCkge1xuICAgICAgICBlbGVtZW50VGFnLnJlbW92ZUF0dHJpYnV0ZShIRUxNRVRfQVRUUklCVVRFKTtcbiAgICB9IGVsc2UgaWYgKFxuICAgICAgICBlbGVtZW50VGFnLmdldEF0dHJpYnV0ZShIRUxNRVRfQVRUUklCVVRFKSAhPT0gYXR0cmlidXRlS2V5cy5qb2luKFwiLFwiKVxuICAgICkge1xuICAgICAgICBlbGVtZW50VGFnLnNldEF0dHJpYnV0ZShIRUxNRVRfQVRUUklCVVRFLCBhdHRyaWJ1dGVLZXlzLmpvaW4oXCIsXCIpKTtcbiAgICB9XG59O1xuXG5jb25zdCB1cGRhdGVUYWdzID0gKHR5cGUsIHRhZ3MpID0+IHtcbiAgICBjb25zdCBoZWFkRWxlbWVudCA9IGRvY3VtZW50LmhlYWQgfHwgZG9jdW1lbnQucXVlcnlTZWxlY3RvcihUQUdfTkFNRVMuSEVBRCk7XG4gICAgY29uc3QgdGFnTm9kZXMgPSBoZWFkRWxlbWVudC5xdWVyeVNlbGVjdG9yQWxsKFxuICAgICAgICBgJHt0eXBlfVske0hFTE1FVF9BVFRSSUJVVEV9XWBcbiAgICApO1xuICAgIGNvbnN0IG9sZFRhZ3MgPSBBcnJheS5wcm90b3R5cGUuc2xpY2UuY2FsbCh0YWdOb2Rlcyk7XG4gICAgY29uc3QgbmV3VGFncyA9IFtdO1xuICAgIGxldCBpbmRleFRvRGVsZXRlO1xuXG4gICAgaWYgKHRhZ3MgJiYgdGFncy5sZW5ndGgpIHtcbiAgICAgICAgdGFncy5mb3JFYWNoKHRhZyA9PiB7XG4gICAgICAgICAgICBjb25zdCBuZXdFbGVtZW50ID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCh0eXBlKTtcblxuICAgICAgICAgICAgZm9yIChjb25zdCBhdHRyaWJ1dGUgaW4gdGFnKSB7XG4gICAgICAgICAgICAgICAgaWYgKHRhZy5oYXNPd25Qcm9wZXJ0eShhdHRyaWJ1dGUpKSB7XG4gICAgICAgICAgICAgICAgICAgIGlmIChhdHRyaWJ1dGUgPT09IFRBR19QUk9QRVJUSUVTLklOTkVSX0hUTUwpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIG5ld0VsZW1lbnQuaW5uZXJIVE1MID0gdGFnLmlubmVySFRNTDtcbiAgICAgICAgICAgICAgICAgICAgfSBlbHNlIGlmIChhdHRyaWJ1dGUgPT09IFRBR19QUk9QRVJUSUVTLkNTU19URVhUKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICBpZiAobmV3RWxlbWVudC5zdHlsZVNoZWV0KSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgbmV3RWxlbWVudC5zdHlsZVNoZWV0LmNzc1RleHQgPSB0YWcuY3NzVGV4dDtcbiAgICAgICAgICAgICAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgbmV3RWxlbWVudC5hcHBlbmRDaGlsZChcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgZG9jdW1lbnQuY3JlYXRlVGV4dE5vZGUodGFnLmNzc1RleHQpXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgKTtcbiAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIGNvbnN0IHZhbHVlID0gdHlwZW9mIHRhZ1thdHRyaWJ1dGVdID09PSBcInVuZGVmaW5lZFwiXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgPyBcIlwiXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgOiB0YWdbYXR0cmlidXRlXTtcbiAgICAgICAgICAgICAgICAgICAgICAgIG5ld0VsZW1lbnQuc2V0QXR0cmlidXRlKGF0dHJpYnV0ZSwgdmFsdWUpO1xuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICBuZXdFbGVtZW50LnNldEF0dHJpYnV0ZShIRUxNRVRfQVRUUklCVVRFLCBcInRydWVcIik7XG5cbiAgICAgICAgICAgIC8vIFJlbW92ZSBhIGR1cGxpY2F0ZSB0YWcgZnJvbSBkb21UYWdzdG9SZW1vdmUsIHNvIGl0IGlzbid0IGNsZWFyZWQuXG4gICAgICAgICAgICBpZiAoXG4gICAgICAgICAgICAgICAgb2xkVGFncy5zb21lKChleGlzdGluZ1RhZywgaW5kZXgpID0+IHtcbiAgICAgICAgICAgICAgICAgICAgaW5kZXhUb0RlbGV0ZSA9IGluZGV4O1xuICAgICAgICAgICAgICAgICAgICByZXR1cm4gbmV3RWxlbWVudC5pc0VxdWFsTm9kZShleGlzdGluZ1RhZyk7XG4gICAgICAgICAgICAgICAgfSlcbiAgICAgICAgICAgICkge1xuICAgICAgICAgICAgICAgIG9sZFRhZ3Muc3BsaWNlKGluZGV4VG9EZWxldGUsIDEpO1xuICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICBuZXdUYWdzLnB1c2gobmV3RWxlbWVudCk7XG4gICAgICAgICAgICB9XG4gICAgICAgIH0pO1xuICAgIH1cblxuICAgIG9sZFRhZ3MuZm9yRWFjaCh0YWcgPT4gdGFnLnBhcmVudE5vZGUucmVtb3ZlQ2hpbGQodGFnKSk7XG4gICAgbmV3VGFncy5mb3JFYWNoKHRhZyA9PiBoZWFkRWxlbWVudC5hcHBlbmRDaGlsZCh0YWcpKTtcblxuICAgIHJldHVybiB7XG4gICAgICAgIG9sZFRhZ3MsXG4gICAgICAgIG5ld1RhZ3NcbiAgICB9O1xufTtcblxuY29uc3QgZ2VuZXJhdGVFbGVtZW50QXR0cmlidXRlc0FzU3RyaW5nID0gYXR0cmlidXRlcyA9PlxuICAgIE9iamVjdC5rZXlzKGF0dHJpYnV0ZXMpLnJlZHVjZSgoc3RyLCBrZXkpID0+IHtcbiAgICAgICAgY29uc3QgYXR0ciA9IHR5cGVvZiBhdHRyaWJ1dGVzW2tleV0gIT09IFwidW5kZWZpbmVkXCJcbiAgICAgICAgICAgID8gYCR7a2V5fT1cIiR7YXR0cmlidXRlc1trZXldfVwiYFxuICAgICAgICAgICAgOiBgJHtrZXl9YDtcbiAgICAgICAgcmV0dXJuIHN0ciA/IGAke3N0cn0gJHthdHRyfWAgOiBhdHRyO1xuICAgIH0sIFwiXCIpO1xuXG5jb25zdCBnZW5lcmF0ZVRpdGxlQXNTdHJpbmcgPSAodHlwZSwgdGl0bGUsIGF0dHJpYnV0ZXMsIGVuY29kZSkgPT4ge1xuICAgIGNvbnN0IGF0dHJpYnV0ZVN0cmluZyA9IGdlbmVyYXRlRWxlbWVudEF0dHJpYnV0ZXNBc1N0cmluZyhhdHRyaWJ1dGVzKTtcbiAgICBjb25zdCBmbGF0dGVuZWRUaXRsZSA9IGZsYXR0ZW5BcnJheSh0aXRsZSk7XG4gICAgcmV0dXJuIGF0dHJpYnV0ZVN0cmluZ1xuICAgICAgICA/IGA8JHt0eXBlfSAke0hFTE1FVF9BVFRSSUJVVEV9PVwidHJ1ZVwiICR7YXR0cmlidXRlU3RyaW5nfT4ke2VuY29kZVNwZWNpYWxDaGFyYWN0ZXJzKFxuICAgICAgICAgICAgICBmbGF0dGVuZWRUaXRsZSxcbiAgICAgICAgICAgICAgZW5jb2RlXG4gICAgICAgICAgKX08LyR7dHlwZX0+YFxuICAgICAgICA6IGA8JHt0eXBlfSAke0hFTE1FVF9BVFRSSUJVVEV9PVwidHJ1ZVwiPiR7ZW5jb2RlU3BlY2lhbENoYXJhY3RlcnMoXG4gICAgICAgICAgICAgIGZsYXR0ZW5lZFRpdGxlLFxuICAgICAgICAgICAgICBlbmNvZGVcbiAgICAgICAgICApfTwvJHt0eXBlfT5gO1xufTtcblxuY29uc3QgZ2VuZXJhdGVUYWdzQXNTdHJpbmcgPSAodHlwZSwgdGFncywgZW5jb2RlKSA9PlxuICAgIHRhZ3MucmVkdWNlKChzdHIsIHRhZykgPT4ge1xuICAgICAgICBjb25zdCBhdHRyaWJ1dGVIdG1sID0gT2JqZWN0LmtleXModGFnKVxuICAgICAgICAgICAgLmZpbHRlcihcbiAgICAgICAgICAgICAgICBhdHRyaWJ1dGUgPT5cbiAgICAgICAgICAgICAgICAgICAgIShcbiAgICAgICAgICAgICAgICAgICAgICAgIGF0dHJpYnV0ZSA9PT0gVEFHX1BST1BFUlRJRVMuSU5ORVJfSFRNTCB8fFxuICAgICAgICAgICAgICAgICAgICAgICAgYXR0cmlidXRlID09PSBUQUdfUFJPUEVSVElFUy5DU1NfVEVYVFxuICAgICAgICAgICAgICAgICAgICApXG4gICAgICAgICAgICApXG4gICAgICAgICAgICAucmVkdWNlKChzdHJpbmcsIGF0dHJpYnV0ZSkgPT4ge1xuICAgICAgICAgICAgICAgIGNvbnN0IGF0dHIgPSB0eXBlb2YgdGFnW2F0dHJpYnV0ZV0gPT09IFwidW5kZWZpbmVkXCJcbiAgICAgICAgICAgICAgICAgICAgPyBhdHRyaWJ1dGVcbiAgICAgICAgICAgICAgICAgICAgOiBgJHthdHRyaWJ1dGV9PVwiJHtlbmNvZGVTcGVjaWFsQ2hhcmFjdGVycyhcbiAgICAgICAgICAgICAgICAgICAgICAgICAgdGFnW2F0dHJpYnV0ZV0sXG4gICAgICAgICAgICAgICAgICAgICAgICAgIGVuY29kZVxuICAgICAgICAgICAgICAgICAgICAgICl9XCJgO1xuICAgICAgICAgICAgICAgIHJldHVybiBzdHJpbmcgPyBgJHtzdHJpbmd9ICR7YXR0cn1gIDogYXR0cjtcbiAgICAgICAgICAgIH0sIFwiXCIpO1xuXG4gICAgICAgIGNvbnN0IHRhZ0NvbnRlbnQgPSB0YWcuaW5uZXJIVE1MIHx8IHRhZy5jc3NUZXh0IHx8IFwiXCI7XG5cbiAgICAgICAgY29uc3QgaXNTZWxmQ2xvc2luZyA9IFNFTEZfQ0xPU0lOR19UQUdTLmluZGV4T2YodHlwZSkgPT09IC0xO1xuXG4gICAgICAgIHJldHVybiBgJHtzdHJ9PCR7dHlwZX0gJHtIRUxNRVRfQVRUUklCVVRFfT1cInRydWVcIiAke2F0dHJpYnV0ZUh0bWx9JHtpc1NlbGZDbG9zaW5nXG4gICAgICAgICAgICA/IGAvPmBcbiAgICAgICAgICAgIDogYD4ke3RhZ0NvbnRlbnR9PC8ke3R5cGV9PmB9YDtcbiAgICB9LCBcIlwiKTtcblxuY29uc3QgY29udmVydEVsZW1lbnRBdHRyaWJ1dGVzdG9SZWFjdFByb3BzID0gKGF0dHJpYnV0ZXMsIGluaXRQcm9wcyA9IHt9KSA9PiB7XG4gICAgcmV0dXJuIE9iamVjdC5rZXlzKGF0dHJpYnV0ZXMpLnJlZHVjZSgob2JqLCBrZXkpID0+IHtcbiAgICAgICAgb2JqW1JFQUNUX1RBR19NQVBba2V5XSB8fCBrZXldID0gYXR0cmlidXRlc1trZXldO1xuICAgICAgICByZXR1cm4gb2JqO1xuICAgIH0sIGluaXRQcm9wcyk7XG59O1xuXG5jb25zdCBjb252ZXJ0UmVhY3RQcm9wc3RvSHRtbEF0dHJpYnV0ZXMgPSAocHJvcHMsIGluaXRBdHRyaWJ1dGVzID0ge30pID0+IHtcbiAgICByZXR1cm4gT2JqZWN0LmtleXMocHJvcHMpLnJlZHVjZSgob2JqLCBrZXkpID0+IHtcbiAgICAgICAgb2JqW0hUTUxfVEFHX01BUFtrZXldIHx8IGtleV0gPSBwcm9wc1trZXldO1xuICAgICAgICByZXR1cm4gb2JqO1xuICAgIH0sIGluaXRBdHRyaWJ1dGVzKTtcbn07XG5cbmNvbnN0IGdlbmVyYXRlVGl0bGVBc1JlYWN0Q29tcG9uZW50ID0gKHR5cGUsIHRpdGxlLCBhdHRyaWJ1dGVzKSA9PiB7XG4gICAgLy8gYXNzaWduaW5nIGludG8gYW4gYXJyYXkgdG8gZGVmaW5lIHRvU3RyaW5nIGZ1bmN0aW9uIG9uIGl0XG4gICAgY29uc3QgaW5pdFByb3BzID0ge1xuICAgICAgICBrZXk6IHRpdGxlLFxuICAgICAgICBbSEVMTUVUX0FUVFJJQlVURV06IHRydWVcbiAgICB9O1xuICAgIGNvbnN0IHByb3BzID0gY29udmVydEVsZW1lbnRBdHRyaWJ1dGVzdG9SZWFjdFByb3BzKGF0dHJpYnV0ZXMsIGluaXRQcm9wcyk7XG5cbiAgICByZXR1cm4gW1JlYWN0LmNyZWF0ZUVsZW1lbnQoVEFHX05BTUVTLlRJVExFLCBwcm9wcywgdGl0bGUpXTtcbn07XG5cbmNvbnN0IGdlbmVyYXRlVGFnc0FzUmVhY3RDb21wb25lbnQgPSAodHlwZSwgdGFncykgPT5cbiAgICB0YWdzLm1hcCgodGFnLCBpKSA9PiB7XG4gICAgICAgIGNvbnN0IG1hcHBlZFRhZyA9IHtcbiAgICAgICAgICAgIGtleTogaSxcbiAgICAgICAgICAgIFtIRUxNRVRfQVRUUklCVVRFXTogdHJ1ZVxuICAgICAgICB9O1xuXG4gICAgICAgIE9iamVjdC5rZXlzKHRhZykuZm9yRWFjaChhdHRyaWJ1dGUgPT4ge1xuICAgICAgICAgICAgY29uc3QgbWFwcGVkQXR0cmlidXRlID0gUkVBQ1RfVEFHX01BUFthdHRyaWJ1dGVdIHx8IGF0dHJpYnV0ZTtcblxuICAgICAgICAgICAgaWYgKFxuICAgICAgICAgICAgICAgIG1hcHBlZEF0dHJpYnV0ZSA9PT0gVEFHX1BST1BFUlRJRVMuSU5ORVJfSFRNTCB8fFxuICAgICAgICAgICAgICAgIG1hcHBlZEF0dHJpYnV0ZSA9PT0gVEFHX1BST1BFUlRJRVMuQ1NTX1RFWFRcbiAgICAgICAgICAgICkge1xuICAgICAgICAgICAgICAgIGNvbnN0IGNvbnRlbnQgPSB0YWcuaW5uZXJIVE1MIHx8IHRhZy5jc3NUZXh0O1xuICAgICAgICAgICAgICAgIG1hcHBlZFRhZy5kYW5nZXJvdXNseVNldElubmVySFRNTCA9IHtfX2h0bWw6IGNvbnRlbnR9O1xuICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICBtYXBwZWRUYWdbbWFwcGVkQXR0cmlidXRlXSA9IHRhZ1thdHRyaWJ1dGVdO1xuICAgICAgICAgICAgfVxuICAgICAgICB9KTtcblxuICAgICAgICByZXR1cm4gUmVhY3QuY3JlYXRlRWxlbWVudCh0eXBlLCBtYXBwZWRUYWcpO1xuICAgIH0pO1xuXG5jb25zdCBnZXRNZXRob2RzRm9yVGFnID0gKHR5cGUsIHRhZ3MsIGVuY29kZSkgPT4ge1xuICAgIHN3aXRjaCAodHlwZSkge1xuICAgICAgICBjYXNlIFRBR19OQU1FUy5USVRMRTpcbiAgICAgICAgICAgIHJldHVybiB7XG4gICAgICAgICAgICAgICAgdG9Db21wb25lbnQ6ICgpID0+XG4gICAgICAgICAgICAgICAgICAgIGdlbmVyYXRlVGl0bGVBc1JlYWN0Q29tcG9uZW50KFxuICAgICAgICAgICAgICAgICAgICAgICAgdHlwZSxcbiAgICAgICAgICAgICAgICAgICAgICAgIHRhZ3MudGl0bGUsXG4gICAgICAgICAgICAgICAgICAgICAgICB0YWdzLnRpdGxlQXR0cmlidXRlcyxcbiAgICAgICAgICAgICAgICAgICAgICAgIGVuY29kZVxuICAgICAgICAgICAgICAgICAgICApLFxuICAgICAgICAgICAgICAgIHRvU3RyaW5nOiAoKSA9PlxuICAgICAgICAgICAgICAgICAgICBnZW5lcmF0ZVRpdGxlQXNTdHJpbmcoXG4gICAgICAgICAgICAgICAgICAgICAgICB0eXBlLFxuICAgICAgICAgICAgICAgICAgICAgICAgdGFncy50aXRsZSxcbiAgICAgICAgICAgICAgICAgICAgICAgIHRhZ3MudGl0bGVBdHRyaWJ1dGVzLFxuICAgICAgICAgICAgICAgICAgICAgICAgZW5jb2RlXG4gICAgICAgICAgICAgICAgICAgIClcbiAgICAgICAgICAgIH07XG4gICAgICAgIGNhc2UgQVRUUklCVVRFX05BTUVTLkJPRFk6XG4gICAgICAgIGNhc2UgQVRUUklCVVRFX05BTUVTLkhUTUw6XG4gICAgICAgICAgICByZXR1cm4ge1xuICAgICAgICAgICAgICAgIHRvQ29tcG9uZW50OiAoKSA9PiBjb252ZXJ0RWxlbWVudEF0dHJpYnV0ZXN0b1JlYWN0UHJvcHModGFncyksXG4gICAgICAgICAgICAgICAgdG9TdHJpbmc6ICgpID0+IGdlbmVyYXRlRWxlbWVudEF0dHJpYnV0ZXNBc1N0cmluZyh0YWdzKVxuICAgICAgICAgICAgfTtcbiAgICAgICAgZGVmYXVsdDpcbiAgICAgICAgICAgIHJldHVybiB7XG4gICAgICAgICAgICAgICAgdG9Db21wb25lbnQ6ICgpID0+IGdlbmVyYXRlVGFnc0FzUmVhY3RDb21wb25lbnQodHlwZSwgdGFncyksXG4gICAgICAgICAgICAgICAgdG9TdHJpbmc6ICgpID0+IGdlbmVyYXRlVGFnc0FzU3RyaW5nKHR5cGUsIHRhZ3MsIGVuY29kZSlcbiAgICAgICAgICAgIH07XG4gICAgfVxufTtcblxuY29uc3QgbWFwU3RhdGVPblNlcnZlciA9ICh7XG4gICAgYmFzZVRhZyxcbiAgICBib2R5QXR0cmlidXRlcyxcbiAgICBlbmNvZGUsXG4gICAgaHRtbEF0dHJpYnV0ZXMsXG4gICAgbGlua1RhZ3MsXG4gICAgbWV0YVRhZ3MsXG4gICAgbm9zY3JpcHRUYWdzLFxuICAgIHNjcmlwdFRhZ3MsXG4gICAgc3R5bGVUYWdzLFxuICAgIHRpdGxlID0gXCJcIixcbiAgICB0aXRsZUF0dHJpYnV0ZXNcbn0pID0+ICh7XG4gICAgYmFzZTogZ2V0TWV0aG9kc0ZvclRhZyhUQUdfTkFNRVMuQkFTRSwgYmFzZVRhZywgZW5jb2RlKSxcbiAgICBib2R5QXR0cmlidXRlczogZ2V0TWV0aG9kc0ZvclRhZyhcbiAgICAgICAgQVRUUklCVVRFX05BTUVTLkJPRFksXG4gICAgICAgIGJvZHlBdHRyaWJ1dGVzLFxuICAgICAgICBlbmNvZGVcbiAgICApLFxuICAgIGh0bWxBdHRyaWJ1dGVzOiBnZXRNZXRob2RzRm9yVGFnKFxuICAgICAgICBBVFRSSUJVVEVfTkFNRVMuSFRNTCxcbiAgICAgICAgaHRtbEF0dHJpYnV0ZXMsXG4gICAgICAgIGVuY29kZVxuICAgICksXG4gICAgbGluazogZ2V0TWV0aG9kc0ZvclRhZyhUQUdfTkFNRVMuTElOSywgbGlua1RhZ3MsIGVuY29kZSksXG4gICAgbWV0YTogZ2V0TWV0aG9kc0ZvclRhZyhUQUdfTkFNRVMuTUVUQSwgbWV0YVRhZ3MsIGVuY29kZSksXG4gICAgbm9zY3JpcHQ6IGdldE1ldGhvZHNGb3JUYWcoVEFHX05BTUVTLk5PU0NSSVBULCBub3NjcmlwdFRhZ3MsIGVuY29kZSksXG4gICAgc2NyaXB0OiBnZXRNZXRob2RzRm9yVGFnKFRBR19OQU1FUy5TQ1JJUFQsIHNjcmlwdFRhZ3MsIGVuY29kZSksXG4gICAgc3R5bGU6IGdldE1ldGhvZHNGb3JUYWcoVEFHX05BTUVTLlNUWUxFLCBzdHlsZVRhZ3MsIGVuY29kZSksXG4gICAgdGl0bGU6IGdldE1ldGhvZHNGb3JUYWcoVEFHX05BTUVTLlRJVExFLCB7dGl0bGUsIHRpdGxlQXR0cmlidXRlc30sIGVuY29kZSlcbn0pO1xuXG5leHBvcnQge2NvbnZlcnRSZWFjdFByb3BzdG9IdG1sQXR0cmlidXRlc307XG5leHBvcnQge2hhbmRsZUNsaWVudFN0YXRlQ2hhbmdlfTtcbmV4cG9ydCB7bWFwU3RhdGVPblNlcnZlcn07XG5leHBvcnQge3JlZHVjZVByb3BzVG9TdGF0ZX07XG5leHBvcnQge3JlcXVlc3RBbmltYXRpb25GcmFtZX07XG5leHBvcnQge3dhcm59O1xuIl19