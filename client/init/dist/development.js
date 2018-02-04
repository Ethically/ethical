(function (global, factory) {
	typeof exports === 'object' && typeof module !== 'undefined' ? factory() :
	typeof define === 'function' && define.amd ? define(factory) :
	(factory());
}(this, (function () { 'use strict';

var webSocket = new WebSocket('ws://localhost:9393');

webSocket.onopen = function (evt) {
    console.log('Ethical Dev Socket Open!');
};
webSocket.onmessage = function (evt) {
    if (evt.data === 'SERVER_STOP') {
        location.reload();
    } else {
        console.log('Ethical Dev Socket Received Message: ' + evt.data);
    }
};
webSocket.onclose = function (evt) {
    console.log('Ethical Dev Socket Closed.');
};

/*!
 * object-extend
 * A well-tested function to deep extend (or merge) JavaScript objects without further dependencies.
 *
 * http://github.com/bernhardw
 *
 * Copyright 2013, Bernhard Wanger <mail@bernhardwanger.com>
 * Released under the MIT license.
 *
 * Date: 2013-04-10
 */


/**
 * Extend object a with object b.
 *
 * @param {Object} a Source object.
 * @param {Object} b Object to extend with.
 * @returns {Object} a Extended object.
 */
var extend = function extend(a, b) {

    // Don't touch 'null' or 'undefined' objects.
    if (a == null || b == null) {
        return a;
    }

    // TODO: Refactor to use for-loop for performance reasons.
    Object.keys(b).forEach(function (key) {

        // Detect object without array, date or null.
        // TODO: Performance test:
        // a) b.constructor === Object.prototype.constructor
        // b) Object.prototype.toString.call(b) == '[object Object]'
        if (Object.prototype.toString.call(b[key]) == '[object Object]') {
            if (Object.prototype.toString.call(a[key]) != '[object Object]') {
                a[key] = b[key];
            } else {
                a[key] = extend(a[key], b[key]);
            }
        } else {
            a[key] = b[key];
        }

    });

    return a;

};

// Copyright Joyent, Inc. and other Node contributors.
//
// Permission is hereby granted, free of charge, to any person obtaining a
// copy of this software and associated documentation files (the
// "Software"), to deal in the Software without restriction, including
// without limitation the rights to use, copy, modify, merge, publish,
// distribute, sublicense, and/or sell copies of the Software, and to permit
// persons to whom the Software is furnished to do so, subject to the
// following conditions:
//
// The above copyright notice and this permission notice shall be included
// in all copies or substantial portions of the Software.
//
// THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS
// OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF
// MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN
// NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM,
// DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR
// OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE
// USE OR OTHER DEALINGS IN THE SOFTWARE.

// resolves . and .. elements in a path array with directory names there
// must be no slashes, empty elements, or device names (c:\) in the array
// (so also no leading and trailing slashes - it does not distinguish
// relative and absolute paths)
function normalizeArray(parts, allowAboveRoot) {
  // if the path tries to go above the root, `up` ends up > 0
  var up = 0;
  for (var i = parts.length - 1; i >= 0; i--) {
    var last = parts[i];
    if (last === '.') {
      parts.splice(i, 1);
    } else if (last === '..') {
      parts.splice(i, 1);
      up++;
    } else if (up) {
      parts.splice(i, 1);
      up--;
    }
  }

  // if the path is allowed to go above the root, restore leading ..s
  if (allowAboveRoot) {
    for (; up--; up) {
      parts.unshift('..');
    }
  }

  return parts;
}

// Split a filename into [root, dir, basename, ext], unix version
// 'root' is just a slash, or nothing.
var splitPathRe =
    /^(\/?|)([\s\S]*?)((?:\.{1,2}|[^\/]+?|)(\.[^.\/]*|))(?:[\/]*)$/;
var splitPath = function(filename) {
  return splitPathRe.exec(filename).slice(1);
};

// path.resolve([from ...], to)
// posix version


// path.normalize(path)
// posix version
function normalize(path) {
  var isPathAbsolute = isAbsolute(path),
      trailingSlash = substr(path, -1) === '/';

  // Normalize the path
  path = normalizeArray(filter(path.split('/'), function(p) {
    return !!p;
  }), !isPathAbsolute).join('/');

  if (!path && !isPathAbsolute) {
    path = '.';
  }
  if (path && trailingSlash) {
    path += '/';
  }

  return (isPathAbsolute ? '/' : '') + path;
}

// posix version
function isAbsolute(path) {
  return path.charAt(0) === '/';
}

// posix version
function join() {
  var paths = Array.prototype.slice.call(arguments, 0);
  return normalize(filter(paths, function(p, index) {
    if (typeof p !== 'string') {
      throw new TypeError('Arguments to path.join must be strings');
    }
    return p;
  }).join('/'));
}


// path.relative(from, to)
// posix version





function dirname(path) {
  var result = splitPath(path),
      root = result[0],
      dir = result[1];

  if (!root && !dir) {
    // No dirname whatsoever
    return '.';
  }

  if (dir) {
    // It has a dirname, strip trailing slash
    dir = dir.substr(0, dir.length - 1);
  }

  return root + dir;
}





function filter (xs, f) {
    if (xs.filter) return xs.filter(f);
    var res = [];
    for (var i = 0; i < xs.length; i++) {
        if (f(xs[i], i, xs)) res.push(xs[i]);
    }
    return res;
}

// String.prototype.substr - negative index don't work in IE8
var substr = 'ab'.substr(-1) === 'b' ?
    function (str, start, len) { return str.substr(start, len) } :
    function (str, start, len) {
        if (start < 0) start = str.length + start;
        return str.substr(start, len);
    };

var commonjsGlobal = typeof window !== 'undefined' ? window : typeof global !== 'undefined' ? global : typeof self !== 'undefined' ? self : {};





function createCommonjsModule(fn, module) {
	return module = { exports: {} }, fn(module, module.exports), module.exports;
}

var pathBrowserify = createCommonjsModule(function (module, exports) {
// Copyright Joyent, Inc. and other Node contributors.
//
// Permission is hereby granted, free of charge, to any person obtaining a
// copy of this software and associated documentation files (the
// "Software"), to deal in the Software without restriction, including
// without limitation the rights to use, copy, modify, merge, publish,
// distribute, sublicense, and/or sell copies of the Software, and to permit
// persons to whom the Software is furnished to do so, subject to the
// following conditions:
//
// The above copyright notice and this permission notice shall be included
// in all copies or substantial portions of the Software.
//
// THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS
// OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF
// MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN
// NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM,
// DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR
// OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE
// USE OR OTHER DEALINGS IN THE SOFTWARE.

// resolves . and .. elements in a path array with directory names there
// must be no slashes, empty elements, or device names (c:\) in the array
// (so also no leading and trailing slashes - it does not distinguish
// relative and absolute paths)
function normalizeArray(parts, allowAboveRoot) {
  // if the path tries to go above the root, `up` ends up > 0
  var up = 0;
  for (var i = parts.length - 1; i >= 0; i--) {
    var last = parts[i];
    if (last === '.') {
      parts.splice(i, 1);
    } else if (last === '..') {
      parts.splice(i, 1);
      up++;
    } else if (up) {
      parts.splice(i, 1);
      up--;
    }
  }

  // if the path is allowed to go above the root, restore leading ..s
  if (allowAboveRoot) {
    for (; up--; up) {
      parts.unshift('..');
    }
  }

  return parts;
}

// Split a filename into [root, dir, basename, ext], unix version
// 'root' is just a slash, or nothing.
var splitPathRe =
    /^(\/?|)([\s\S]*?)((?:\.{1,2}|[^\/]+?|)(\.[^.\/]*|))(?:[\/]*)$/;
var splitPath = function(filename) {
  return splitPathRe.exec(filename).slice(1);
};

// path.resolve([from ...], to)
// posix version
exports.resolve = function() {
  var resolvedPath = '',
      resolvedAbsolute = false;

  for (var i = arguments.length - 1; i >= -1 && !resolvedAbsolute; i--) {
    var path = (i >= 0) ? arguments[i] : process.cwd();

    // Skip empty and invalid entries
    if (typeof path !== 'string') {
      throw new TypeError('Arguments to path.resolve must be strings');
    } else if (!path) {
      continue;
    }

    resolvedPath = path + '/' + resolvedPath;
    resolvedAbsolute = path.charAt(0) === '/';
  }

  // At this point the path should be resolved to a full absolute path, but
  // handle relative paths to be safe (might happen when process.cwd() fails)

  // Normalize the path
  resolvedPath = normalizeArray(filter(resolvedPath.split('/'), function(p) {
    return !!p;
  }), !resolvedAbsolute).join('/');

  return ((resolvedAbsolute ? '/' : '') + resolvedPath) || '.';
};

// path.normalize(path)
// posix version
exports.normalize = function(path) {
  var isAbsolute = exports.isAbsolute(path),
      trailingSlash = substr(path, -1) === '/';

  // Normalize the path
  path = normalizeArray(filter(path.split('/'), function(p) {
    return !!p;
  }), !isAbsolute).join('/');

  if (!path && !isAbsolute) {
    path = '.';
  }
  if (path && trailingSlash) {
    path += '/';
  }

  return (isAbsolute ? '/' : '') + path;
};

// posix version
exports.isAbsolute = function(path) {
  return path.charAt(0) === '/';
};

// posix version
exports.join = function() {
  var paths = Array.prototype.slice.call(arguments, 0);
  return exports.normalize(filter(paths, function(p, index) {
    if (typeof p !== 'string') {
      throw new TypeError('Arguments to path.join must be strings');
    }
    return p;
  }).join('/'));
};


// path.relative(from, to)
// posix version
exports.relative = function(from, to) {
  from = exports.resolve(from).substr(1);
  to = exports.resolve(to).substr(1);

  function trim(arr) {
    var start = 0;
    for (; start < arr.length; start++) {
      if (arr[start] !== '') break;
    }

    var end = arr.length - 1;
    for (; end >= 0; end--) {
      if (arr[end] !== '') break;
    }

    if (start > end) return [];
    return arr.slice(start, end - start + 1);
  }

  var fromParts = trim(from.split('/'));
  var toParts = trim(to.split('/'));

  var length = Math.min(fromParts.length, toParts.length);
  var samePartsLength = length;
  for (var i = 0; i < length; i++) {
    if (fromParts[i] !== toParts[i]) {
      samePartsLength = i;
      break;
    }
  }

  var outputParts = [];
  for (var i = samePartsLength; i < fromParts.length; i++) {
    outputParts.push('..');
  }

  outputParts = outputParts.concat(toParts.slice(samePartsLength));

  return outputParts.join('/');
};

exports.sep = '/';
exports.delimiter = ':';

exports.dirname = function(path) {
  var result = splitPath(path),
      root = result[0],
      dir = result[1];

  if (!root && !dir) {
    // No dirname whatsoever
    return '.';
  }

  if (dir) {
    // It has a dirname, strip trailing slash
    dir = dir.substr(0, dir.length - 1);
  }

  return root + dir;
};


exports.basename = function(path, ext) {
  var f = splitPath(path)[2];
  // TODO: make this comparison case-insensitive on windows?
  if (ext && f.substr(-1 * ext.length) === ext) {
    f = f.substr(0, f.length - ext.length);
  }
  return f;
};


exports.extname = function(path) {
  return splitPath(path)[3];
};

function filter (xs, f) {
    if (xs.filter) return xs.filter(f);
    var res = [];
    for (var i = 0; i < xs.length; i++) {
        if (f(xs[i], i, xs)) res.push(xs[i]);
    }
    return res;
}

// String.prototype.substr - negative index don't work in IE8
var substr = 'ab'.substr(-1) === 'b'
    ? function (str, start, len) { return str.substr(start, len) }
    : function (str, start, len) {
        if (start < 0) start = str.length + start;
        return str.substr(start, len);
    };
});

var pathBrowserify_1 = pathBrowserify.resolve;
var pathBrowserify_2 = pathBrowserify.normalize;
var pathBrowserify_3 = pathBrowserify.isAbsolute;
var pathBrowserify_4 = pathBrowserify.join;
var pathBrowserify_5 = pathBrowserify.relative;
var pathBrowserify_6 = pathBrowserify.sep;
var pathBrowserify_7 = pathBrowserify.delimiter;
var pathBrowserify_8 = pathBrowserify.dirname;
var pathBrowserify_9 = pathBrowserify.basename;
var pathBrowserify_10 = pathBrowserify.extname;

var join$2 = pathBrowserify.join;
var basename$1 = pathBrowserify.basename;

var isFile = function isFile(path) {
    return basename$1(path).includes('.');
};

var resolveDestPath = function resolveDestPath(path, dest, base) {
    if (typeof dest !== 'string') return absolute(path);
    if (isFile(dest)) return absolute(dest);
    return join$2(absolute(dest), absolute(path).replace(absolute(base), ''));
};

var isRelative$1 = function isRelative(path) {
    if (path.charAt(0) === '.' && (path.charAt(1) === '.' || path.charAt(1) === '/')) return true;
    return false;
};

var isAbsolute$2 = function isAbsolute(path) {
    if (path.charAt(0) === '/') return true;
    return false;
};

var absolute = function absolute(path) {
    if (isAbsolute$2(path)) return path;
    return join$2(getRootPath$1(), path);
};

var relative$1 = function relative(path) {
    if (!isAbsolute$2(path)) return path;
    return path.replace(getRootPath$1() + '/', '');
};

var getRootPath$1 = function getRootPath() {
    return commonjsGlobal.ethical && commonjsGlobal.ethical.cwd || process.cwd();
};

var isFile_1 = isFile;
var resolveDestPath_1 = resolveDestPath;
var isRelative_1 = isRelative$1;
var isAbsolute_1 = isAbsolute$2;
var absolute_1 = absolute;
var relative_1 = relative$1;
var getRootPath_1 = getRootPath$1;

var path$1 = {
	isFile: isFile_1,
	resolveDestPath: resolveDestPath_1,
	isRelative: isRelative_1,
	isAbsolute: isAbsolute_1,
	absolute: absolute_1,
	relative: relative_1,
	getRootPath: getRootPath_1
};

var isRelative = path$1.isRelative;
var isAbsolute$1 = path$1.isAbsolute;

var join$1 = pathBrowserify.join;

var extensions = ['js', 'json', 'node'];

var getAppPrefix = function getAppPrefix(moduleName) {
    return '&';
};

var isPackage = function isPackage(name) {
    if (isRelative(name) || isAbsolute$1(name)) return false;
    return true;
};

var isAbsolutePackage = function isAbsolutePackage(name) {
    if (isPackage(name) && name.indexOf('/') === -1) return true;
    return false;
};

var appendExtension = function appendExtension(name) {
    var extension = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 'js';

    if (isAbsolutePackage(name)) return name;
    var ext = '.' + extension;
    if (name.slice(-ext.length) === ext) return name;
    return name + ext;
};

var extensions_1 = extensions;
var getAppPrefix_1 = getAppPrefix;
var isPackage_1 = isPackage;
var isAbsolutePackage_1 = isAbsolutePackage;
var appendExtension_1 = appendExtension;

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var cache = {};

var createLocalRequire = function createLocalRequire(parent) {
    return function (key) {
        return window.require(key, parent);
    };
};

var resolveExports = function resolveExports(file) {

    if (cache[file]) {
        return cache[file];
    }

    var definedModule = require.defined[file];

    if (definedModule) {
        var localRequire = createLocalRequire(file);
        var module = { exports: {} };

        definedModule.call(module.exports, module.exports, localRequire, module);

        return cache[file] = module;
    }

    return null;
};

var requestMap = function requestMap(map, request, id) {
    var mapped = map[id] && map[id][request];
    return mapped || request;
};

var getModuleRoot = function getModuleRoot(path$$1) {
    var nodeModules = 'node_modules';
    var parts = path$$1.split('/');
    var index = parts.lastIndexOf(nodeModules);
    if (index === -1) {
        return parts[0];
    }
    return parts.slice(0, index + 2).join('/');
};

var resolveFilename = function resolveFilename(key, parent) {
    if (isAbsolutePackage_1(key)) {
        return key;
    }

    if (isPackage_1(key)) {
        return key;
    }

    var alias = window.require.alias;

    var parentAlias = alias[parent] ? alias[parent] : parent;
    var parentFile = appendExtension_1(parentAlias);
    var directory = dirname(parentFile);

    return join(directory, key);
};

var ModuleError = function (_Error) {
    _inherits(ModuleError, _Error);

    function ModuleError(message, module) {
        _classCallCheck(this, ModuleError);

        var _this = _possibleConstructorReturn(this, (ModuleError.__proto__ || Object.getPrototypeOf(ModuleError)).call(this, message));

        _this.code = 'MODULE_NOT_FOUND';
        _this.module = module;
        return _this;
    }

    return ModuleError;
}(Error);

var load = function load(request) {
    var parent = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : getAppPrefix_1();


    var require = window.require;
    var mapID = getModuleRoot(parent);
    var remapped = requestMap(require.browserMap, request, mapID);
    var conflicted = requestMap(require.conflictMap, remapped, mapID);
    var key = resolveFilename(conflicted, parent);

    for (var i = 0; i < extensions_1.length; i++) {
        var file = appendExtension_1(key, extensions_1[i]);
        var module = resolveExports(file);
        if (module) {
            return module.exports;
        }
    }

    for (var _i = 0; _i < extensions_1.length; _i++) {
        var _file = appendExtension_1(join(key, 'index'), extensions_1[_i]);
        var _module = resolveExports(_file);
        if (_module) {
            return _module.exports;
        }
    }

    throw new ModuleError('Cannot find module "' + key + '" from "' + parent + '"', key);
};

var evalModules = function evalModules(modules) {
    modules.forEach(function (module) {
        var require = window.require;
        var id = module.id,
            key = module.key,
            alias = module.alias,
            source = module.source;

        require.defineSource(key, source);
        require.ids.push(id);

        if (alias) require.alias[key] = alias;
    });
};

var enableBrowserRequire = function enableBrowserRequire(modules) {

    var require = function require(request, loaderPath) {
        return load(request, loaderPath);
    };

    require.defined = {};
    require.ids = [];
    require.processing = {};
    require.alias = {};
    require.browserMap = {};
    require.conflictMap = {};
    require.define = function (module, fn) {
        return require.defined[module] = fn;
    };
    require.defineSource = function (key, source) {
        var wrappedModule = eval('(function(exports,require,module){' + (source + '\n') + '}).bind(window)');
        require.define(key, wrappedModule);
    };
    require.load = function (entry) {
        var options = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};
        var _options$url = options.url,
            url = _options$url === undefined ? 'module' : _options$url;


        if (require.processing[entry]) {
            return require.processing[entry];
        }

        var exclude = require.ids;

        var headers = { 'Content-Type': 'application/json' };
        var body = JSON.stringify({ entry: entry, exclude: exclude });
        var config = Object.assign({ method: 'POST', headers: headers, body: body }, options);

        var promise = window.fetch(url, config).then(function (response) {
            delete require.processing[entry];
            return response.json();
        }).then(function (_ref) {
            var browserMap = _ref.browserMap,
                conflictMap = _ref.conflictMap,
                modules = _ref.modules;

            require.browserMap = extend(require.browserMap, browserMap);
            require.conflictMap = extend(require.conflictMap, conflictMap);
            evalModules(modules);
        }).then(function () {
            return require.warmup();
        }).catch(function (e) {
            return console.error(e);
        });

        return require.processing[entry] = promise;
    };
    require.warmupQ = [];
    require.warmup = function () {
        for (var _len = arguments.length, args = Array(_len), _key = 0; _key < _len; _key++) {
            args[_key] = arguments[_key];
        }

        if (args.length > 0) {
            var _console, _require$warmupQ;

            (_console = console).log.apply(_console, ['Pending warm up...'].concat(args));
            (_require$warmupQ = require.warmupQ).push.apply(_require$warmupQ, args);
            return setTimeout(function () {
                return require.warmup();
            }, 0);
        }

        if (require.warmupQ.length === 0) {
            return;
        }

        if (Object.keys(require.processing).length > 0) {
            return;
        }

        var module = require.warmupQ.pop();

        if (require.defined[module]) {
            return require.warmup();
        }

        console.log('Warming up...', module);
        require.load(module);
    };

    window.require = require;

    if (modules) evalModules(modules);
};



// Inspired by:
// https://github.com/efacilitation/commonjs-require

enableBrowserRequire();

})));
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZGV2ZWxvcG1lbnQuanMiLCJzb3VyY2VzIjpbIi4uLy4uL2Rldi9pbmRleC5qcyIsIi4uLy4uLy4uL25vZGVfbW9kdWxlcy9vYmplY3QtZXh0ZW5kL2xpYi9leHRlbmQuanMiLCIuLi8uLi8uLi9ub2RlX21vZHVsZXMvcm9sbHVwLXBsdWdpbi1ub2RlLWJ1aWx0aW5zL3NyYy9lczYvcGF0aC5qcyIsIi4uLy4uLy4uL25vZGVfbW9kdWxlcy9wYXRoLWJyb3dzZXJpZnkvaW5kZXguanMiLCIuLi8uLi8uLi9oZWxwZXIvcGF0aC9pbmRleC5qcyIsIi4uLy4uLy4uL2hlbHBlci9yZXNvbHZlL2luZGV4LmpzIiwiLi4vLi4vcmVxdWlyZS9saWIvbW9kdWxlLmpzIiwiLi4vLi4vcmVxdWlyZS9saWIvaW5kZXguanMiLCIuLi9zcmMvZGV2ZWxvcG1lbnQuanMiXSwic291cmNlc0NvbnRlbnQiOlsiY29uc3Qgd2ViU29ja2V0ID0gbmV3IFdlYlNvY2tldCgnd3M6Ly9sb2NhbGhvc3Q6OTM5MycpXG5cbndlYlNvY2tldC5vbm9wZW4gPSAoZXZ0KSA9PiB7XG4gICAgY29uc29sZS5sb2coJ0V0aGljYWwgRGV2IFNvY2tldCBPcGVuIScpXG59XG53ZWJTb2NrZXQub25tZXNzYWdlID0gKGV2dCkgPT4ge1xuICAgIGlmIChldnQuZGF0YSA9PT0gJ1NFUlZFUl9TVE9QJykge1xuICAgICAgICBsb2NhdGlvbi5yZWxvYWQoKVxuICAgIH0gZWxzZSB7XG4gICAgICAgIGNvbnNvbGUubG9nKCAnRXRoaWNhbCBEZXYgU29ja2V0IFJlY2VpdmVkIE1lc3NhZ2U6ICcgKyBldnQuZGF0YSlcbiAgICB9XG59XG53ZWJTb2NrZXQub25jbG9zZSA9IChldnQpID0+IHtcbiAgICBjb25zb2xlLmxvZygnRXRoaWNhbCBEZXYgU29ja2V0IENsb3NlZC4nKVxufVxuIiwiLyohXG4gKiBvYmplY3QtZXh0ZW5kXG4gKiBBIHdlbGwtdGVzdGVkIGZ1bmN0aW9uIHRvIGRlZXAgZXh0ZW5kIChvciBtZXJnZSkgSmF2YVNjcmlwdCBvYmplY3RzIHdpdGhvdXQgZnVydGhlciBkZXBlbmRlbmNpZXMuXG4gKlxuICogaHR0cDovL2dpdGh1Yi5jb20vYmVybmhhcmR3XG4gKlxuICogQ29weXJpZ2h0IDIwMTMsIEJlcm5oYXJkIFdhbmdlciA8bWFpbEBiZXJuaGFyZHdhbmdlci5jb20+XG4gKiBSZWxlYXNlZCB1bmRlciB0aGUgTUlUIGxpY2Vuc2UuXG4gKlxuICogRGF0ZTogMjAxMy0wNC0xMFxuICovXG5cblxuLyoqXG4gKiBFeHRlbmQgb2JqZWN0IGEgd2l0aCBvYmplY3QgYi5cbiAqXG4gKiBAcGFyYW0ge09iamVjdH0gYSBTb3VyY2Ugb2JqZWN0LlxuICogQHBhcmFtIHtPYmplY3R9IGIgT2JqZWN0IHRvIGV4dGVuZCB3aXRoLlxuICogQHJldHVybnMge09iamVjdH0gYSBFeHRlbmRlZCBvYmplY3QuXG4gKi9cbm1vZHVsZS5leHBvcnRzID0gZnVuY3Rpb24gZXh0ZW5kKGEsIGIpIHtcblxuICAgIC8vIERvbid0IHRvdWNoICdudWxsJyBvciAndW5kZWZpbmVkJyBvYmplY3RzLlxuICAgIGlmIChhID09IG51bGwgfHwgYiA9PSBudWxsKSB7XG4gICAgICAgIHJldHVybiBhO1xuICAgIH1cblxuICAgIC8vIFRPRE86IFJlZmFjdG9yIHRvIHVzZSBmb3ItbG9vcCBmb3IgcGVyZm9ybWFuY2UgcmVhc29ucy5cbiAgICBPYmplY3Qua2V5cyhiKS5mb3JFYWNoKGZ1bmN0aW9uIChrZXkpIHtcblxuICAgICAgICAvLyBEZXRlY3Qgb2JqZWN0IHdpdGhvdXQgYXJyYXksIGRhdGUgb3IgbnVsbC5cbiAgICAgICAgLy8gVE9ETzogUGVyZm9ybWFuY2UgdGVzdDpcbiAgICAgICAgLy8gYSkgYi5jb25zdHJ1Y3RvciA9PT0gT2JqZWN0LnByb3RvdHlwZS5jb25zdHJ1Y3RvclxuICAgICAgICAvLyBiKSBPYmplY3QucHJvdG90eXBlLnRvU3RyaW5nLmNhbGwoYikgPT0gJ1tvYmplY3QgT2JqZWN0XSdcbiAgICAgICAgaWYgKE9iamVjdC5wcm90b3R5cGUudG9TdHJpbmcuY2FsbChiW2tleV0pID09ICdbb2JqZWN0IE9iamVjdF0nKSB7XG4gICAgICAgICAgICBpZiAoT2JqZWN0LnByb3RvdHlwZS50b1N0cmluZy5jYWxsKGFba2V5XSkgIT0gJ1tvYmplY3QgT2JqZWN0XScpIHtcbiAgICAgICAgICAgICAgICBhW2tleV0gPSBiW2tleV07XG4gICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgIGFba2V5XSA9IGV4dGVuZChhW2tleV0sIGJba2V5XSk7XG4gICAgICAgICAgICB9XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICBhW2tleV0gPSBiW2tleV07XG4gICAgICAgIH1cblxuICAgIH0pO1xuXG4gICAgcmV0dXJuIGE7XG5cbn07IiwiLy8gQ29weXJpZ2h0IEpveWVudCwgSW5jLiBhbmQgb3RoZXIgTm9kZSBjb250cmlidXRvcnMuXG4vL1xuLy8gUGVybWlzc2lvbiBpcyBoZXJlYnkgZ3JhbnRlZCwgZnJlZSBvZiBjaGFyZ2UsIHRvIGFueSBwZXJzb24gb2J0YWluaW5nIGFcbi8vIGNvcHkgb2YgdGhpcyBzb2Z0d2FyZSBhbmQgYXNzb2NpYXRlZCBkb2N1bWVudGF0aW9uIGZpbGVzICh0aGVcbi8vIFwiU29mdHdhcmVcIiksIHRvIGRlYWwgaW4gdGhlIFNvZnR3YXJlIHdpdGhvdXQgcmVzdHJpY3Rpb24sIGluY2x1ZGluZ1xuLy8gd2l0aG91dCBsaW1pdGF0aW9uIHRoZSByaWdodHMgdG8gdXNlLCBjb3B5LCBtb2RpZnksIG1lcmdlLCBwdWJsaXNoLFxuLy8gZGlzdHJpYnV0ZSwgc3VibGljZW5zZSwgYW5kL29yIHNlbGwgY29waWVzIG9mIHRoZSBTb2Z0d2FyZSwgYW5kIHRvIHBlcm1pdFxuLy8gcGVyc29ucyB0byB3aG9tIHRoZSBTb2Z0d2FyZSBpcyBmdXJuaXNoZWQgdG8gZG8gc28sIHN1YmplY3QgdG8gdGhlXG4vLyBmb2xsb3dpbmcgY29uZGl0aW9uczpcbi8vXG4vLyBUaGUgYWJvdmUgY29weXJpZ2h0IG5vdGljZSBhbmQgdGhpcyBwZXJtaXNzaW9uIG5vdGljZSBzaGFsbCBiZSBpbmNsdWRlZFxuLy8gaW4gYWxsIGNvcGllcyBvciBzdWJzdGFudGlhbCBwb3J0aW9ucyBvZiB0aGUgU29mdHdhcmUuXG4vL1xuLy8gVEhFIFNPRlRXQVJFIElTIFBST1ZJREVEIFwiQVMgSVNcIiwgV0lUSE9VVCBXQVJSQU5UWSBPRiBBTlkgS0lORCwgRVhQUkVTU1xuLy8gT1IgSU1QTElFRCwgSU5DTFVESU5HIEJVVCBOT1QgTElNSVRFRCBUTyBUSEUgV0FSUkFOVElFUyBPRlxuLy8gTUVSQ0hBTlRBQklMSVRZLCBGSVRORVNTIEZPUiBBIFBBUlRJQ1VMQVIgUFVSUE9TRSBBTkQgTk9OSU5GUklOR0VNRU5ULiBJTlxuLy8gTk8gRVZFTlQgU0hBTEwgVEhFIEFVVEhPUlMgT1IgQ09QWVJJR0hUIEhPTERFUlMgQkUgTElBQkxFIEZPUiBBTlkgQ0xBSU0sXG4vLyBEQU1BR0VTIE9SIE9USEVSIExJQUJJTElUWSwgV0hFVEhFUiBJTiBBTiBBQ1RJT04gT0YgQ09OVFJBQ1QsIFRPUlQgT1Jcbi8vIE9USEVSV0lTRSwgQVJJU0lORyBGUk9NLCBPVVQgT0YgT1IgSU4gQ09OTkVDVElPTiBXSVRIIFRIRSBTT0ZUV0FSRSBPUiBUSEVcbi8vIFVTRSBPUiBPVEhFUiBERUFMSU5HUyBJTiBUSEUgU09GVFdBUkUuXG5cbi8vIHJlc29sdmVzIC4gYW5kIC4uIGVsZW1lbnRzIGluIGEgcGF0aCBhcnJheSB3aXRoIGRpcmVjdG9yeSBuYW1lcyB0aGVyZVxuLy8gbXVzdCBiZSBubyBzbGFzaGVzLCBlbXB0eSBlbGVtZW50cywgb3IgZGV2aWNlIG5hbWVzIChjOlxcKSBpbiB0aGUgYXJyYXlcbi8vIChzbyBhbHNvIG5vIGxlYWRpbmcgYW5kIHRyYWlsaW5nIHNsYXNoZXMgLSBpdCBkb2VzIG5vdCBkaXN0aW5ndWlzaFxuLy8gcmVsYXRpdmUgYW5kIGFic29sdXRlIHBhdGhzKVxuZnVuY3Rpb24gbm9ybWFsaXplQXJyYXkocGFydHMsIGFsbG93QWJvdmVSb290KSB7XG4gIC8vIGlmIHRoZSBwYXRoIHRyaWVzIHRvIGdvIGFib3ZlIHRoZSByb290LCBgdXBgIGVuZHMgdXAgPiAwXG4gIHZhciB1cCA9IDA7XG4gIGZvciAodmFyIGkgPSBwYXJ0cy5sZW5ndGggLSAxOyBpID49IDA7IGktLSkge1xuICAgIHZhciBsYXN0ID0gcGFydHNbaV07XG4gICAgaWYgKGxhc3QgPT09ICcuJykge1xuICAgICAgcGFydHMuc3BsaWNlKGksIDEpO1xuICAgIH0gZWxzZSBpZiAobGFzdCA9PT0gJy4uJykge1xuICAgICAgcGFydHMuc3BsaWNlKGksIDEpO1xuICAgICAgdXArKztcbiAgICB9IGVsc2UgaWYgKHVwKSB7XG4gICAgICBwYXJ0cy5zcGxpY2UoaSwgMSk7XG4gICAgICB1cC0tO1xuICAgIH1cbiAgfVxuXG4gIC8vIGlmIHRoZSBwYXRoIGlzIGFsbG93ZWQgdG8gZ28gYWJvdmUgdGhlIHJvb3QsIHJlc3RvcmUgbGVhZGluZyAuLnNcbiAgaWYgKGFsbG93QWJvdmVSb290KSB7XG4gICAgZm9yICg7IHVwLS07IHVwKSB7XG4gICAgICBwYXJ0cy51bnNoaWZ0KCcuLicpO1xuICAgIH1cbiAgfVxuXG4gIHJldHVybiBwYXJ0cztcbn1cblxuLy8gU3BsaXQgYSBmaWxlbmFtZSBpbnRvIFtyb290LCBkaXIsIGJhc2VuYW1lLCBleHRdLCB1bml4IHZlcnNpb25cbi8vICdyb290JyBpcyBqdXN0IGEgc2xhc2gsIG9yIG5vdGhpbmcuXG52YXIgc3BsaXRQYXRoUmUgPVxuICAgIC9eKFxcLz98KShbXFxzXFxTXSo/KSgoPzpcXC57MSwyfXxbXlxcL10rP3wpKFxcLlteLlxcL10qfCkpKD86W1xcL10qKSQvO1xudmFyIHNwbGl0UGF0aCA9IGZ1bmN0aW9uKGZpbGVuYW1lKSB7XG4gIHJldHVybiBzcGxpdFBhdGhSZS5leGVjKGZpbGVuYW1lKS5zbGljZSgxKTtcbn07XG5cbi8vIHBhdGgucmVzb2x2ZShbZnJvbSAuLi5dLCB0bylcbi8vIHBvc2l4IHZlcnNpb25cbmV4cG9ydCBmdW5jdGlvbiByZXNvbHZlKCkge1xuICB2YXIgcmVzb2x2ZWRQYXRoID0gJycsXG4gICAgICByZXNvbHZlZEFic29sdXRlID0gZmFsc2U7XG5cbiAgZm9yICh2YXIgaSA9IGFyZ3VtZW50cy5sZW5ndGggLSAxOyBpID49IC0xICYmICFyZXNvbHZlZEFic29sdXRlOyBpLS0pIHtcbiAgICB2YXIgcGF0aCA9IChpID49IDApID8gYXJndW1lbnRzW2ldIDogJy8nO1xuXG4gICAgLy8gU2tpcCBlbXB0eSBhbmQgaW52YWxpZCBlbnRyaWVzXG4gICAgaWYgKHR5cGVvZiBwYXRoICE9PSAnc3RyaW5nJykge1xuICAgICAgdGhyb3cgbmV3IFR5cGVFcnJvcignQXJndW1lbnRzIHRvIHBhdGgucmVzb2x2ZSBtdXN0IGJlIHN0cmluZ3MnKTtcbiAgICB9IGVsc2UgaWYgKCFwYXRoKSB7XG4gICAgICBjb250aW51ZTtcbiAgICB9XG5cbiAgICByZXNvbHZlZFBhdGggPSBwYXRoICsgJy8nICsgcmVzb2x2ZWRQYXRoO1xuICAgIHJlc29sdmVkQWJzb2x1dGUgPSBwYXRoLmNoYXJBdCgwKSA9PT0gJy8nO1xuICB9XG5cbiAgLy8gQXQgdGhpcyBwb2ludCB0aGUgcGF0aCBzaG91bGQgYmUgcmVzb2x2ZWQgdG8gYSBmdWxsIGFic29sdXRlIHBhdGgsIGJ1dFxuICAvLyBoYW5kbGUgcmVsYXRpdmUgcGF0aHMgdG8gYmUgc2FmZSAobWlnaHQgaGFwcGVuIHdoZW4gcHJvY2Vzcy5jd2QoKSBmYWlscylcblxuICAvLyBOb3JtYWxpemUgdGhlIHBhdGhcbiAgcmVzb2x2ZWRQYXRoID0gbm9ybWFsaXplQXJyYXkoZmlsdGVyKHJlc29sdmVkUGF0aC5zcGxpdCgnLycpLCBmdW5jdGlvbihwKSB7XG4gICAgcmV0dXJuICEhcDtcbiAgfSksICFyZXNvbHZlZEFic29sdXRlKS5qb2luKCcvJyk7XG5cbiAgcmV0dXJuICgocmVzb2x2ZWRBYnNvbHV0ZSA/ICcvJyA6ICcnKSArIHJlc29sdmVkUGF0aCkgfHwgJy4nO1xufTtcblxuLy8gcGF0aC5ub3JtYWxpemUocGF0aClcbi8vIHBvc2l4IHZlcnNpb25cbmV4cG9ydCBmdW5jdGlvbiBub3JtYWxpemUocGF0aCkge1xuICB2YXIgaXNQYXRoQWJzb2x1dGUgPSBpc0Fic29sdXRlKHBhdGgpLFxuICAgICAgdHJhaWxpbmdTbGFzaCA9IHN1YnN0cihwYXRoLCAtMSkgPT09ICcvJztcblxuICAvLyBOb3JtYWxpemUgdGhlIHBhdGhcbiAgcGF0aCA9IG5vcm1hbGl6ZUFycmF5KGZpbHRlcihwYXRoLnNwbGl0KCcvJyksIGZ1bmN0aW9uKHApIHtcbiAgICByZXR1cm4gISFwO1xuICB9KSwgIWlzUGF0aEFic29sdXRlKS5qb2luKCcvJyk7XG5cbiAgaWYgKCFwYXRoICYmICFpc1BhdGhBYnNvbHV0ZSkge1xuICAgIHBhdGggPSAnLic7XG4gIH1cbiAgaWYgKHBhdGggJiYgdHJhaWxpbmdTbGFzaCkge1xuICAgIHBhdGggKz0gJy8nO1xuICB9XG5cbiAgcmV0dXJuIChpc1BhdGhBYnNvbHV0ZSA/ICcvJyA6ICcnKSArIHBhdGg7XG59O1xuXG4vLyBwb3NpeCB2ZXJzaW9uXG5leHBvcnQgZnVuY3Rpb24gaXNBYnNvbHV0ZShwYXRoKSB7XG4gIHJldHVybiBwYXRoLmNoYXJBdCgwKSA9PT0gJy8nO1xufVxuXG4vLyBwb3NpeCB2ZXJzaW9uXG5leHBvcnQgZnVuY3Rpb24gam9pbigpIHtcbiAgdmFyIHBhdGhzID0gQXJyYXkucHJvdG90eXBlLnNsaWNlLmNhbGwoYXJndW1lbnRzLCAwKTtcbiAgcmV0dXJuIG5vcm1hbGl6ZShmaWx0ZXIocGF0aHMsIGZ1bmN0aW9uKHAsIGluZGV4KSB7XG4gICAgaWYgKHR5cGVvZiBwICE9PSAnc3RyaW5nJykge1xuICAgICAgdGhyb3cgbmV3IFR5cGVFcnJvcignQXJndW1lbnRzIHRvIHBhdGguam9pbiBtdXN0IGJlIHN0cmluZ3MnKTtcbiAgICB9XG4gICAgcmV0dXJuIHA7XG4gIH0pLmpvaW4oJy8nKSk7XG59XG5cblxuLy8gcGF0aC5yZWxhdGl2ZShmcm9tLCB0bylcbi8vIHBvc2l4IHZlcnNpb25cbmV4cG9ydCBmdW5jdGlvbiByZWxhdGl2ZShmcm9tLCB0bykge1xuICBmcm9tID0gcmVzb2x2ZShmcm9tKS5zdWJzdHIoMSk7XG4gIHRvID0gcmVzb2x2ZSh0bykuc3Vic3RyKDEpO1xuXG4gIGZ1bmN0aW9uIHRyaW0oYXJyKSB7XG4gICAgdmFyIHN0YXJ0ID0gMDtcbiAgICBmb3IgKDsgc3RhcnQgPCBhcnIubGVuZ3RoOyBzdGFydCsrKSB7XG4gICAgICBpZiAoYXJyW3N0YXJ0XSAhPT0gJycpIGJyZWFrO1xuICAgIH1cblxuICAgIHZhciBlbmQgPSBhcnIubGVuZ3RoIC0gMTtcbiAgICBmb3IgKDsgZW5kID49IDA7IGVuZC0tKSB7XG4gICAgICBpZiAoYXJyW2VuZF0gIT09ICcnKSBicmVhaztcbiAgICB9XG5cbiAgICBpZiAoc3RhcnQgPiBlbmQpIHJldHVybiBbXTtcbiAgICByZXR1cm4gYXJyLnNsaWNlKHN0YXJ0LCBlbmQgLSBzdGFydCArIDEpO1xuICB9XG5cbiAgdmFyIGZyb21QYXJ0cyA9IHRyaW0oZnJvbS5zcGxpdCgnLycpKTtcbiAgdmFyIHRvUGFydHMgPSB0cmltKHRvLnNwbGl0KCcvJykpO1xuXG4gIHZhciBsZW5ndGggPSBNYXRoLm1pbihmcm9tUGFydHMubGVuZ3RoLCB0b1BhcnRzLmxlbmd0aCk7XG4gIHZhciBzYW1lUGFydHNMZW5ndGggPSBsZW5ndGg7XG4gIGZvciAodmFyIGkgPSAwOyBpIDwgbGVuZ3RoOyBpKyspIHtcbiAgICBpZiAoZnJvbVBhcnRzW2ldICE9PSB0b1BhcnRzW2ldKSB7XG4gICAgICBzYW1lUGFydHNMZW5ndGggPSBpO1xuICAgICAgYnJlYWs7XG4gICAgfVxuICB9XG5cbiAgdmFyIG91dHB1dFBhcnRzID0gW107XG4gIGZvciAodmFyIGkgPSBzYW1lUGFydHNMZW5ndGg7IGkgPCBmcm9tUGFydHMubGVuZ3RoOyBpKyspIHtcbiAgICBvdXRwdXRQYXJ0cy5wdXNoKCcuLicpO1xuICB9XG5cbiAgb3V0cHV0UGFydHMgPSBvdXRwdXRQYXJ0cy5jb25jYXQodG9QYXJ0cy5zbGljZShzYW1lUGFydHNMZW5ndGgpKTtcblxuICByZXR1cm4gb3V0cHV0UGFydHMuam9pbignLycpO1xufVxuXG5leHBvcnQgdmFyIHNlcCA9ICcvJztcbmV4cG9ydCB2YXIgZGVsaW1pdGVyID0gJzonO1xuXG5leHBvcnQgZnVuY3Rpb24gZGlybmFtZShwYXRoKSB7XG4gIHZhciByZXN1bHQgPSBzcGxpdFBhdGgocGF0aCksXG4gICAgICByb290ID0gcmVzdWx0WzBdLFxuICAgICAgZGlyID0gcmVzdWx0WzFdO1xuXG4gIGlmICghcm9vdCAmJiAhZGlyKSB7XG4gICAgLy8gTm8gZGlybmFtZSB3aGF0c29ldmVyXG4gICAgcmV0dXJuICcuJztcbiAgfVxuXG4gIGlmIChkaXIpIHtcbiAgICAvLyBJdCBoYXMgYSBkaXJuYW1lLCBzdHJpcCB0cmFpbGluZyBzbGFzaFxuICAgIGRpciA9IGRpci5zdWJzdHIoMCwgZGlyLmxlbmd0aCAtIDEpO1xuICB9XG5cbiAgcmV0dXJuIHJvb3QgKyBkaXI7XG59XG5cbmV4cG9ydCBmdW5jdGlvbiBiYXNlbmFtZShwYXRoLCBleHQpIHtcbiAgdmFyIGYgPSBzcGxpdFBhdGgocGF0aClbMl07XG4gIC8vIFRPRE86IG1ha2UgdGhpcyBjb21wYXJpc29uIGNhc2UtaW5zZW5zaXRpdmUgb24gd2luZG93cz9cbiAgaWYgKGV4dCAmJiBmLnN1YnN0cigtMSAqIGV4dC5sZW5ndGgpID09PSBleHQpIHtcbiAgICBmID0gZi5zdWJzdHIoMCwgZi5sZW5ndGggLSBleHQubGVuZ3RoKTtcbiAgfVxuICByZXR1cm4gZjtcbn1cblxuXG5leHBvcnQgZnVuY3Rpb24gZXh0bmFtZShwYXRoKSB7XG4gIHJldHVybiBzcGxpdFBhdGgocGF0aClbM107XG59XG5leHBvcnQgZGVmYXVsdCB7XG4gIGV4dG5hbWU6IGV4dG5hbWUsXG4gIGJhc2VuYW1lOiBiYXNlbmFtZSxcbiAgZGlybmFtZTogZGlybmFtZSxcbiAgc2VwOiBzZXAsXG4gIGRlbGltaXRlcjogZGVsaW1pdGVyLFxuICByZWxhdGl2ZTogcmVsYXRpdmUsXG4gIGpvaW46IGpvaW4sXG4gIGlzQWJzb2x1dGU6IGlzQWJzb2x1dGUsXG4gIG5vcm1hbGl6ZTogbm9ybWFsaXplLFxuICByZXNvbHZlOiByZXNvbHZlXG59O1xuZnVuY3Rpb24gZmlsdGVyICh4cywgZikge1xuICAgIGlmICh4cy5maWx0ZXIpIHJldHVybiB4cy5maWx0ZXIoZik7XG4gICAgdmFyIHJlcyA9IFtdO1xuICAgIGZvciAodmFyIGkgPSAwOyBpIDwgeHMubGVuZ3RoOyBpKyspIHtcbiAgICAgICAgaWYgKGYoeHNbaV0sIGksIHhzKSkgcmVzLnB1c2goeHNbaV0pO1xuICAgIH1cbiAgICByZXR1cm4gcmVzO1xufVxuXG4vLyBTdHJpbmcucHJvdG90eXBlLnN1YnN0ciAtIG5lZ2F0aXZlIGluZGV4IGRvbid0IHdvcmsgaW4gSUU4XG52YXIgc3Vic3RyID0gJ2FiJy5zdWJzdHIoLTEpID09PSAnYicgP1xuICAgIGZ1bmN0aW9uIChzdHIsIHN0YXJ0LCBsZW4pIHsgcmV0dXJuIHN0ci5zdWJzdHIoc3RhcnQsIGxlbikgfSA6XG4gICAgZnVuY3Rpb24gKHN0ciwgc3RhcnQsIGxlbikge1xuICAgICAgICBpZiAoc3RhcnQgPCAwKSBzdGFydCA9IHN0ci5sZW5ndGggKyBzdGFydDtcbiAgICAgICAgcmV0dXJuIHN0ci5zdWJzdHIoc3RhcnQsIGxlbik7XG4gICAgfVxuO1xuIiwiLy8gQ29weXJpZ2h0IEpveWVudCwgSW5jLiBhbmQgb3RoZXIgTm9kZSBjb250cmlidXRvcnMuXG4vL1xuLy8gUGVybWlzc2lvbiBpcyBoZXJlYnkgZ3JhbnRlZCwgZnJlZSBvZiBjaGFyZ2UsIHRvIGFueSBwZXJzb24gb2J0YWluaW5nIGFcbi8vIGNvcHkgb2YgdGhpcyBzb2Z0d2FyZSBhbmQgYXNzb2NpYXRlZCBkb2N1bWVudGF0aW9uIGZpbGVzICh0aGVcbi8vIFwiU29mdHdhcmVcIiksIHRvIGRlYWwgaW4gdGhlIFNvZnR3YXJlIHdpdGhvdXQgcmVzdHJpY3Rpb24sIGluY2x1ZGluZ1xuLy8gd2l0aG91dCBsaW1pdGF0aW9uIHRoZSByaWdodHMgdG8gdXNlLCBjb3B5LCBtb2RpZnksIG1lcmdlLCBwdWJsaXNoLFxuLy8gZGlzdHJpYnV0ZSwgc3VibGljZW5zZSwgYW5kL29yIHNlbGwgY29waWVzIG9mIHRoZSBTb2Z0d2FyZSwgYW5kIHRvIHBlcm1pdFxuLy8gcGVyc29ucyB0byB3aG9tIHRoZSBTb2Z0d2FyZSBpcyBmdXJuaXNoZWQgdG8gZG8gc28sIHN1YmplY3QgdG8gdGhlXG4vLyBmb2xsb3dpbmcgY29uZGl0aW9uczpcbi8vXG4vLyBUaGUgYWJvdmUgY29weXJpZ2h0IG5vdGljZSBhbmQgdGhpcyBwZXJtaXNzaW9uIG5vdGljZSBzaGFsbCBiZSBpbmNsdWRlZFxuLy8gaW4gYWxsIGNvcGllcyBvciBzdWJzdGFudGlhbCBwb3J0aW9ucyBvZiB0aGUgU29mdHdhcmUuXG4vL1xuLy8gVEhFIFNPRlRXQVJFIElTIFBST1ZJREVEIFwiQVMgSVNcIiwgV0lUSE9VVCBXQVJSQU5UWSBPRiBBTlkgS0lORCwgRVhQUkVTU1xuLy8gT1IgSU1QTElFRCwgSU5DTFVESU5HIEJVVCBOT1QgTElNSVRFRCBUTyBUSEUgV0FSUkFOVElFUyBPRlxuLy8gTUVSQ0hBTlRBQklMSVRZLCBGSVRORVNTIEZPUiBBIFBBUlRJQ1VMQVIgUFVSUE9TRSBBTkQgTk9OSU5GUklOR0VNRU5ULiBJTlxuLy8gTk8gRVZFTlQgU0hBTEwgVEhFIEFVVEhPUlMgT1IgQ09QWVJJR0hUIEhPTERFUlMgQkUgTElBQkxFIEZPUiBBTlkgQ0xBSU0sXG4vLyBEQU1BR0VTIE9SIE9USEVSIExJQUJJTElUWSwgV0hFVEhFUiBJTiBBTiBBQ1RJT04gT0YgQ09OVFJBQ1QsIFRPUlQgT1Jcbi8vIE9USEVSV0lTRSwgQVJJU0lORyBGUk9NLCBPVVQgT0YgT1IgSU4gQ09OTkVDVElPTiBXSVRIIFRIRSBTT0ZUV0FSRSBPUiBUSEVcbi8vIFVTRSBPUiBPVEhFUiBERUFMSU5HUyBJTiBUSEUgU09GVFdBUkUuXG5cbi8vIHJlc29sdmVzIC4gYW5kIC4uIGVsZW1lbnRzIGluIGEgcGF0aCBhcnJheSB3aXRoIGRpcmVjdG9yeSBuYW1lcyB0aGVyZVxuLy8gbXVzdCBiZSBubyBzbGFzaGVzLCBlbXB0eSBlbGVtZW50cywgb3IgZGV2aWNlIG5hbWVzIChjOlxcKSBpbiB0aGUgYXJyYXlcbi8vIChzbyBhbHNvIG5vIGxlYWRpbmcgYW5kIHRyYWlsaW5nIHNsYXNoZXMgLSBpdCBkb2VzIG5vdCBkaXN0aW5ndWlzaFxuLy8gcmVsYXRpdmUgYW5kIGFic29sdXRlIHBhdGhzKVxuZnVuY3Rpb24gbm9ybWFsaXplQXJyYXkocGFydHMsIGFsbG93QWJvdmVSb290KSB7XG4gIC8vIGlmIHRoZSBwYXRoIHRyaWVzIHRvIGdvIGFib3ZlIHRoZSByb290LCBgdXBgIGVuZHMgdXAgPiAwXG4gIHZhciB1cCA9IDA7XG4gIGZvciAodmFyIGkgPSBwYXJ0cy5sZW5ndGggLSAxOyBpID49IDA7IGktLSkge1xuICAgIHZhciBsYXN0ID0gcGFydHNbaV07XG4gICAgaWYgKGxhc3QgPT09ICcuJykge1xuICAgICAgcGFydHMuc3BsaWNlKGksIDEpO1xuICAgIH0gZWxzZSBpZiAobGFzdCA9PT0gJy4uJykge1xuICAgICAgcGFydHMuc3BsaWNlKGksIDEpO1xuICAgICAgdXArKztcbiAgICB9IGVsc2UgaWYgKHVwKSB7XG4gICAgICBwYXJ0cy5zcGxpY2UoaSwgMSk7XG4gICAgICB1cC0tO1xuICAgIH1cbiAgfVxuXG4gIC8vIGlmIHRoZSBwYXRoIGlzIGFsbG93ZWQgdG8gZ28gYWJvdmUgdGhlIHJvb3QsIHJlc3RvcmUgbGVhZGluZyAuLnNcbiAgaWYgKGFsbG93QWJvdmVSb290KSB7XG4gICAgZm9yICg7IHVwLS07IHVwKSB7XG4gICAgICBwYXJ0cy51bnNoaWZ0KCcuLicpO1xuICAgIH1cbiAgfVxuXG4gIHJldHVybiBwYXJ0cztcbn1cblxuLy8gU3BsaXQgYSBmaWxlbmFtZSBpbnRvIFtyb290LCBkaXIsIGJhc2VuYW1lLCBleHRdLCB1bml4IHZlcnNpb25cbi8vICdyb290JyBpcyBqdXN0IGEgc2xhc2gsIG9yIG5vdGhpbmcuXG52YXIgc3BsaXRQYXRoUmUgPVxuICAgIC9eKFxcLz98KShbXFxzXFxTXSo/KSgoPzpcXC57MSwyfXxbXlxcL10rP3wpKFxcLlteLlxcL10qfCkpKD86W1xcL10qKSQvO1xudmFyIHNwbGl0UGF0aCA9IGZ1bmN0aW9uKGZpbGVuYW1lKSB7XG4gIHJldHVybiBzcGxpdFBhdGhSZS5leGVjKGZpbGVuYW1lKS5zbGljZSgxKTtcbn07XG5cbi8vIHBhdGgucmVzb2x2ZShbZnJvbSAuLi5dLCB0bylcbi8vIHBvc2l4IHZlcnNpb25cbmV4cG9ydHMucmVzb2x2ZSA9IGZ1bmN0aW9uKCkge1xuICB2YXIgcmVzb2x2ZWRQYXRoID0gJycsXG4gICAgICByZXNvbHZlZEFic29sdXRlID0gZmFsc2U7XG5cbiAgZm9yICh2YXIgaSA9IGFyZ3VtZW50cy5sZW5ndGggLSAxOyBpID49IC0xICYmICFyZXNvbHZlZEFic29sdXRlOyBpLS0pIHtcbiAgICB2YXIgcGF0aCA9IChpID49IDApID8gYXJndW1lbnRzW2ldIDogcHJvY2Vzcy5jd2QoKTtcblxuICAgIC8vIFNraXAgZW1wdHkgYW5kIGludmFsaWQgZW50cmllc1xuICAgIGlmICh0eXBlb2YgcGF0aCAhPT0gJ3N0cmluZycpIHtcbiAgICAgIHRocm93IG5ldyBUeXBlRXJyb3IoJ0FyZ3VtZW50cyB0byBwYXRoLnJlc29sdmUgbXVzdCBiZSBzdHJpbmdzJyk7XG4gICAgfSBlbHNlIGlmICghcGF0aCkge1xuICAgICAgY29udGludWU7XG4gICAgfVxuXG4gICAgcmVzb2x2ZWRQYXRoID0gcGF0aCArICcvJyArIHJlc29sdmVkUGF0aDtcbiAgICByZXNvbHZlZEFic29sdXRlID0gcGF0aC5jaGFyQXQoMCkgPT09ICcvJztcbiAgfVxuXG4gIC8vIEF0IHRoaXMgcG9pbnQgdGhlIHBhdGggc2hvdWxkIGJlIHJlc29sdmVkIHRvIGEgZnVsbCBhYnNvbHV0ZSBwYXRoLCBidXRcbiAgLy8gaGFuZGxlIHJlbGF0aXZlIHBhdGhzIHRvIGJlIHNhZmUgKG1pZ2h0IGhhcHBlbiB3aGVuIHByb2Nlc3MuY3dkKCkgZmFpbHMpXG5cbiAgLy8gTm9ybWFsaXplIHRoZSBwYXRoXG4gIHJlc29sdmVkUGF0aCA9IG5vcm1hbGl6ZUFycmF5KGZpbHRlcihyZXNvbHZlZFBhdGguc3BsaXQoJy8nKSwgZnVuY3Rpb24ocCkge1xuICAgIHJldHVybiAhIXA7XG4gIH0pLCAhcmVzb2x2ZWRBYnNvbHV0ZSkuam9pbignLycpO1xuXG4gIHJldHVybiAoKHJlc29sdmVkQWJzb2x1dGUgPyAnLycgOiAnJykgKyByZXNvbHZlZFBhdGgpIHx8ICcuJztcbn07XG5cbi8vIHBhdGgubm9ybWFsaXplKHBhdGgpXG4vLyBwb3NpeCB2ZXJzaW9uXG5leHBvcnRzLm5vcm1hbGl6ZSA9IGZ1bmN0aW9uKHBhdGgpIHtcbiAgdmFyIGlzQWJzb2x1dGUgPSBleHBvcnRzLmlzQWJzb2x1dGUocGF0aCksXG4gICAgICB0cmFpbGluZ1NsYXNoID0gc3Vic3RyKHBhdGgsIC0xKSA9PT0gJy8nO1xuXG4gIC8vIE5vcm1hbGl6ZSB0aGUgcGF0aFxuICBwYXRoID0gbm9ybWFsaXplQXJyYXkoZmlsdGVyKHBhdGguc3BsaXQoJy8nKSwgZnVuY3Rpb24ocCkge1xuICAgIHJldHVybiAhIXA7XG4gIH0pLCAhaXNBYnNvbHV0ZSkuam9pbignLycpO1xuXG4gIGlmICghcGF0aCAmJiAhaXNBYnNvbHV0ZSkge1xuICAgIHBhdGggPSAnLic7XG4gIH1cbiAgaWYgKHBhdGggJiYgdHJhaWxpbmdTbGFzaCkge1xuICAgIHBhdGggKz0gJy8nO1xuICB9XG5cbiAgcmV0dXJuIChpc0Fic29sdXRlID8gJy8nIDogJycpICsgcGF0aDtcbn07XG5cbi8vIHBvc2l4IHZlcnNpb25cbmV4cG9ydHMuaXNBYnNvbHV0ZSA9IGZ1bmN0aW9uKHBhdGgpIHtcbiAgcmV0dXJuIHBhdGguY2hhckF0KDApID09PSAnLyc7XG59O1xuXG4vLyBwb3NpeCB2ZXJzaW9uXG5leHBvcnRzLmpvaW4gPSBmdW5jdGlvbigpIHtcbiAgdmFyIHBhdGhzID0gQXJyYXkucHJvdG90eXBlLnNsaWNlLmNhbGwoYXJndW1lbnRzLCAwKTtcbiAgcmV0dXJuIGV4cG9ydHMubm9ybWFsaXplKGZpbHRlcihwYXRocywgZnVuY3Rpb24ocCwgaW5kZXgpIHtcbiAgICBpZiAodHlwZW9mIHAgIT09ICdzdHJpbmcnKSB7XG4gICAgICB0aHJvdyBuZXcgVHlwZUVycm9yKCdBcmd1bWVudHMgdG8gcGF0aC5qb2luIG11c3QgYmUgc3RyaW5ncycpO1xuICAgIH1cbiAgICByZXR1cm4gcDtcbiAgfSkuam9pbignLycpKTtcbn07XG5cblxuLy8gcGF0aC5yZWxhdGl2ZShmcm9tLCB0bylcbi8vIHBvc2l4IHZlcnNpb25cbmV4cG9ydHMucmVsYXRpdmUgPSBmdW5jdGlvbihmcm9tLCB0bykge1xuICBmcm9tID0gZXhwb3J0cy5yZXNvbHZlKGZyb20pLnN1YnN0cigxKTtcbiAgdG8gPSBleHBvcnRzLnJlc29sdmUodG8pLnN1YnN0cigxKTtcblxuICBmdW5jdGlvbiB0cmltKGFycikge1xuICAgIHZhciBzdGFydCA9IDA7XG4gICAgZm9yICg7IHN0YXJ0IDwgYXJyLmxlbmd0aDsgc3RhcnQrKykge1xuICAgICAgaWYgKGFycltzdGFydF0gIT09ICcnKSBicmVhaztcbiAgICB9XG5cbiAgICB2YXIgZW5kID0gYXJyLmxlbmd0aCAtIDE7XG4gICAgZm9yICg7IGVuZCA+PSAwOyBlbmQtLSkge1xuICAgICAgaWYgKGFycltlbmRdICE9PSAnJykgYnJlYWs7XG4gICAgfVxuXG4gICAgaWYgKHN0YXJ0ID4gZW5kKSByZXR1cm4gW107XG4gICAgcmV0dXJuIGFyci5zbGljZShzdGFydCwgZW5kIC0gc3RhcnQgKyAxKTtcbiAgfVxuXG4gIHZhciBmcm9tUGFydHMgPSB0cmltKGZyb20uc3BsaXQoJy8nKSk7XG4gIHZhciB0b1BhcnRzID0gdHJpbSh0by5zcGxpdCgnLycpKTtcblxuICB2YXIgbGVuZ3RoID0gTWF0aC5taW4oZnJvbVBhcnRzLmxlbmd0aCwgdG9QYXJ0cy5sZW5ndGgpO1xuICB2YXIgc2FtZVBhcnRzTGVuZ3RoID0gbGVuZ3RoO1xuICBmb3IgKHZhciBpID0gMDsgaSA8IGxlbmd0aDsgaSsrKSB7XG4gICAgaWYgKGZyb21QYXJ0c1tpXSAhPT0gdG9QYXJ0c1tpXSkge1xuICAgICAgc2FtZVBhcnRzTGVuZ3RoID0gaTtcbiAgICAgIGJyZWFrO1xuICAgIH1cbiAgfVxuXG4gIHZhciBvdXRwdXRQYXJ0cyA9IFtdO1xuICBmb3IgKHZhciBpID0gc2FtZVBhcnRzTGVuZ3RoOyBpIDwgZnJvbVBhcnRzLmxlbmd0aDsgaSsrKSB7XG4gICAgb3V0cHV0UGFydHMucHVzaCgnLi4nKTtcbiAgfVxuXG4gIG91dHB1dFBhcnRzID0gb3V0cHV0UGFydHMuY29uY2F0KHRvUGFydHMuc2xpY2Uoc2FtZVBhcnRzTGVuZ3RoKSk7XG5cbiAgcmV0dXJuIG91dHB1dFBhcnRzLmpvaW4oJy8nKTtcbn07XG5cbmV4cG9ydHMuc2VwID0gJy8nO1xuZXhwb3J0cy5kZWxpbWl0ZXIgPSAnOic7XG5cbmV4cG9ydHMuZGlybmFtZSA9IGZ1bmN0aW9uKHBhdGgpIHtcbiAgdmFyIHJlc3VsdCA9IHNwbGl0UGF0aChwYXRoKSxcbiAgICAgIHJvb3QgPSByZXN1bHRbMF0sXG4gICAgICBkaXIgPSByZXN1bHRbMV07XG5cbiAgaWYgKCFyb290ICYmICFkaXIpIHtcbiAgICAvLyBObyBkaXJuYW1lIHdoYXRzb2V2ZXJcbiAgICByZXR1cm4gJy4nO1xuICB9XG5cbiAgaWYgKGRpcikge1xuICAgIC8vIEl0IGhhcyBhIGRpcm5hbWUsIHN0cmlwIHRyYWlsaW5nIHNsYXNoXG4gICAgZGlyID0gZGlyLnN1YnN0cigwLCBkaXIubGVuZ3RoIC0gMSk7XG4gIH1cblxuICByZXR1cm4gcm9vdCArIGRpcjtcbn07XG5cblxuZXhwb3J0cy5iYXNlbmFtZSA9IGZ1bmN0aW9uKHBhdGgsIGV4dCkge1xuICB2YXIgZiA9IHNwbGl0UGF0aChwYXRoKVsyXTtcbiAgLy8gVE9ETzogbWFrZSB0aGlzIGNvbXBhcmlzb24gY2FzZS1pbnNlbnNpdGl2ZSBvbiB3aW5kb3dzP1xuICBpZiAoZXh0ICYmIGYuc3Vic3RyKC0xICogZXh0Lmxlbmd0aCkgPT09IGV4dCkge1xuICAgIGYgPSBmLnN1YnN0cigwLCBmLmxlbmd0aCAtIGV4dC5sZW5ndGgpO1xuICB9XG4gIHJldHVybiBmO1xufTtcblxuXG5leHBvcnRzLmV4dG5hbWUgPSBmdW5jdGlvbihwYXRoKSB7XG4gIHJldHVybiBzcGxpdFBhdGgocGF0aClbM107XG59O1xuXG5mdW5jdGlvbiBmaWx0ZXIgKHhzLCBmKSB7XG4gICAgaWYgKHhzLmZpbHRlcikgcmV0dXJuIHhzLmZpbHRlcihmKTtcbiAgICB2YXIgcmVzID0gW107XG4gICAgZm9yICh2YXIgaSA9IDA7IGkgPCB4cy5sZW5ndGg7IGkrKykge1xuICAgICAgICBpZiAoZih4c1tpXSwgaSwgeHMpKSByZXMucHVzaCh4c1tpXSk7XG4gICAgfVxuICAgIHJldHVybiByZXM7XG59XG5cbi8vIFN0cmluZy5wcm90b3R5cGUuc3Vic3RyIC0gbmVnYXRpdmUgaW5kZXggZG9uJ3Qgd29yayBpbiBJRThcbnZhciBzdWJzdHIgPSAnYWInLnN1YnN0cigtMSkgPT09ICdiJ1xuICAgID8gZnVuY3Rpb24gKHN0ciwgc3RhcnQsIGxlbikgeyByZXR1cm4gc3RyLnN1YnN0cihzdGFydCwgbGVuKSB9XG4gICAgOiBmdW5jdGlvbiAoc3RyLCBzdGFydCwgbGVuKSB7XG4gICAgICAgIGlmIChzdGFydCA8IDApIHN0YXJ0ID0gc3RyLmxlbmd0aCArIHN0YXJ0O1xuICAgICAgICByZXR1cm4gc3RyLnN1YnN0cihzdGFydCwgbGVuKTtcbiAgICB9XG47XG4iLCJjb25zdCB7IGpvaW4sIGJhc2VuYW1lIH0gPSByZXF1aXJlKCdwYXRoLWJyb3dzZXJpZnknKVxuXG5jb25zdCBpc0ZpbGUgPSAocGF0aCkgPT4gKCBiYXNlbmFtZShwYXRoKS5pbmNsdWRlcygnLicpIClcblxuY29uc3QgcmVzb2x2ZURlc3RQYXRoID0gKHBhdGgsIGRlc3QsIGJhc2UpID0+IHtcbiAgICBpZiAodHlwZW9mIGRlc3QgIT09ICdzdHJpbmcnKSByZXR1cm4gYWJzb2x1dGUocGF0aClcbiAgICBpZiAoaXNGaWxlKGRlc3QpKSByZXR1cm4gYWJzb2x1dGUoZGVzdClcbiAgICByZXR1cm4gam9pbihhYnNvbHV0ZShkZXN0KSwgYWJzb2x1dGUocGF0aCkucmVwbGFjZShhYnNvbHV0ZShiYXNlKSwgJycpKVxufVxuXG5jb25zdCBpc1JlbGF0aXZlID0gKHBhdGgpID0+IHtcbiAgICBpZiAocGF0aC5jaGFyQXQoMCkgPT09ICcuJyAmJiAoXG4gICAgICAgIHBhdGguY2hhckF0KDEpID09PSAnLicgfHwgcGF0aC5jaGFyQXQoMSkgPT09ICcvJykpXG4gICAgICAgIHJldHVybiB0cnVlXG4gICAgcmV0dXJuIGZhbHNlXG59XG5cbmNvbnN0IGlzQWJzb2x1dGUgPSAocGF0aCkgPT4ge1xuICAgIGlmIChwYXRoLmNoYXJBdCgwKSA9PT0gJy8nKSByZXR1cm4gdHJ1ZVxuICAgIHJldHVybiBmYWxzZVxufVxuXG5jb25zdCBhYnNvbHV0ZSA9IChwYXRoKSA9PiB7XG4gICAgaWYgKGlzQWJzb2x1dGUocGF0aCkpIHJldHVybiBwYXRoXG4gICAgcmV0dXJuIGpvaW4oZ2V0Um9vdFBhdGgoKSwgcGF0aClcbn1cblxuY29uc3QgcmVsYXRpdmUgPSAocGF0aCkgPT4ge1xuICAgIGlmICghaXNBYnNvbHV0ZShwYXRoKSkgcmV0dXJuIHBhdGhcbiAgICByZXR1cm4gcGF0aC5yZXBsYWNlKGdldFJvb3RQYXRoKCkgKyAnLycgLCAnJylcbn1cblxuY29uc3QgZ2V0Um9vdFBhdGggPSAoKSA9PiAoXG4gICAgKGdsb2JhbC5ldGhpY2FsICYmIGdsb2JhbC5ldGhpY2FsLmN3ZCkgfHwgcHJvY2Vzcy5jd2QoKVxuKVxuXG5leHBvcnRzLmlzRmlsZSA9IGlzRmlsZVxuZXhwb3J0cy5yZXNvbHZlRGVzdFBhdGggPSByZXNvbHZlRGVzdFBhdGhcbmV4cG9ydHMuaXNSZWxhdGl2ZSA9IGlzUmVsYXRpdmVcbmV4cG9ydHMuaXNBYnNvbHV0ZSA9IGlzQWJzb2x1dGVcbmV4cG9ydHMuYWJzb2x1dGUgPSBhYnNvbHV0ZVxuZXhwb3J0cy5yZWxhdGl2ZSA9IHJlbGF0aXZlXG5leHBvcnRzLmdldFJvb3RQYXRoID0gZ2V0Um9vdFBhdGhcbiIsImNvbnN0IGlzTm9kZSA9IHJlcXVpcmUoJy4uLy4uL2hlbHBlci9pcy1ub2RlJylcbmNvbnN0IHsgaXNSZWxhdGl2ZSwgaXNBYnNvbHV0ZSwgZ2V0Um9vdFBhdGggfSA9IHJlcXVpcmUoJy4uLy4uL2hlbHBlci9wYXRoJylcbmNvbnN0IHsgam9pbiB9ID0gcmVxdWlyZSgncGF0aC1icm93c2VyaWZ5JylcblxuY29uc3QgZXh0ZW5zaW9ucyA9IFsnanMnLCAnanNvbicsICdub2RlJ11cblxuY29uc3QgZ2V0QXBwUHJlZml4ID0gKG1vZHVsZU5hbWUpID0+ICcmJ1xuXG5jb25zdCBpc0FwcE1vZHVsZSA9IChtb2R1bGVOYW1lKSA9PiAoXG4gICAgbW9kdWxlTmFtZS5jaGFyQXQoMCkgPT09IGdldEFwcFByZWZpeCgpXG4pXG5cbmNvbnN0IGlzUGFja2FnZSA9IChuYW1lKSA9PiB7XG4gICAgaWYgKGlzUmVsYXRpdmUobmFtZSkgfHwgaXNBYnNvbHV0ZShuYW1lKSkgcmV0dXJuIGZhbHNlXG4gICAgcmV0dXJuIHRydWVcbn1cblxuY29uc3QgaXNBYnNvbHV0ZVBhY2thZ2UgPSAobmFtZSkgPT4ge1xuICAgIGlmIChpc1BhY2thZ2UobmFtZSkgJiYgbmFtZS5pbmRleE9mKCcvJykgPT09IC0xKVxuICAgICAgICByZXR1cm4gdHJ1ZVxuICAgIHJldHVybiBmYWxzZVxufVxuXG5jb25zdCBpc1JlbGF0aXZlUGFja2FnZSA9IChuYW1lKSA9PiB7XG4gICAgaWYgKG5hbWUuaW5kZXhPZignLycpID4gLTEgJiYgaXNQYWNrYWdlKG5hbWUpKSByZXR1cm4gdHJ1ZVxuICAgIHJldHVybiBmYWxzZVxufVxuXG5jb25zdCBhcHBlbmRFeHRlbnNpb24gPSAobmFtZSwgZXh0ZW5zaW9uID0gJ2pzJykgPT4ge1xuICAgIGlmIChpc0Fic29sdXRlUGFja2FnZShuYW1lKSkgcmV0dXJuIG5hbWVcbiAgICBjb25zdCBleHQgPSAnLicgKyBleHRlbnNpb25cbiAgICBpZiAobmFtZS5zbGljZSgtKGV4dC5sZW5ndGgpKSA9PT0gZXh0KSByZXR1cm4gbmFtZVxuICAgIHJldHVybiBuYW1lICsgZXh0XG59XG5cbmNvbnN0IGdldFJlcXVpcmUgPSAoKSA9PiB7XG4gICAgaWYgKGlzTm9kZSgpKSByZXR1cm4gcmVxdWlyZVxuICAgIHJldHVybiB3aW5kb3cucmVxdWlyZVxufVxuXG5jb25zdCByZXNvbHZlQXBwTW9kdWxlID0gKG1vZHVsZSkgPT4ge1xuICAgIGlmIChpc0FwcE1vZHVsZShtb2R1bGUpKSB7XG4gICAgICAgIHJldHVybiBqb2luKGdldFJvb3RQYXRoKCksIG1vZHVsZS5yZXBsYWNlKGdldEFwcFByZWZpeCgpLCAnJykpXG4gICAgfVxuICAgIGlmIChpc1JlbGF0aXZlKG1vZHVsZSkpIHJldHVybiBqb2luKGdldFJvb3RQYXRoKCksIG1vZHVsZSlcbiAgICByZXR1cm4gbW9kdWxlXG59XG5cbmNvbnN0IHJlcXVpcmVNb2R1bGUgPSAobmFtZSkgPT4ge1xuICAgIGNvbnN0IHBhdGggPSAoIGlzTm9kZSgpID8gcmVzb2x2ZUFwcE1vZHVsZShuYW1lKSA6IG5hbWUgKVxuICAgIHJldHVybiBnZXRSZXF1aXJlKCkocGF0aClcbn1cblxuZXhwb3J0cy5leHRlbnNpb25zID0gZXh0ZW5zaW9uc1xuZXhwb3J0cy5nZXRBcHBQcmVmaXggPSBnZXRBcHBQcmVmaXhcbmV4cG9ydHMuaXNBcHBNb2R1bGUgPSBpc0FwcE1vZHVsZVxuZXhwb3J0cy5pc1BhY2thZ2UgPSBpc1BhY2thZ2VcbmV4cG9ydHMuaXNBYnNvbHV0ZVBhY2thZ2UgPSBpc0Fic29sdXRlUGFja2FnZVxuZXhwb3J0cy5pc1JlbGF0aXZlUGFja2FnZSA9IGlzUmVsYXRpdmVQYWNrYWdlXG5leHBvcnRzLmFwcGVuZEV4dGVuc2lvbiA9IGFwcGVuZEV4dGVuc2lvblxuZXhwb3J0cy5nZXRSZXF1aXJlID0gZ2V0UmVxdWlyZVxuZXhwb3J0cy5yZXNvbHZlQXBwTW9kdWxlID0gcmVzb2x2ZUFwcE1vZHVsZVxuZXhwb3J0cy5yZXF1aXJlTW9kdWxlID0gcmVxdWlyZU1vZHVsZVxuIiwiaW1wb3J0IHsgam9pbiwgcmVzb2x2ZSwgZGlybmFtZSB9IGZyb20gJ3BhdGgnXG5pbXBvcnQge1xuICAgIGlzUGFja2FnZSxcbiAgICBpc0Fic29sdXRlUGFja2FnZSxcbiAgICBhcHBlbmRFeHRlbnNpb24sXG4gICAgZ2V0QXBwUHJlZml4LFxuICAgIGV4dGVuc2lvbnNcbn0gZnJvbSAnLi4vLi4vLi4vaGVscGVyL3Jlc29sdmUnXG5cbmNvbnN0IGNhY2hlID0ge31cblxuY29uc3QgY3JlYXRlTG9jYWxSZXF1aXJlID0gcGFyZW50ID0+IGtleSA9PiB3aW5kb3cucmVxdWlyZShrZXksIHBhcmVudClcblxuY29uc3QgcmVzb2x2ZUV4cG9ydHMgPSAoZmlsZSkgPT4ge1xuXG4gICAgaWYgKGNhY2hlW2ZpbGVdKSB7XG4gICAgICAgIHJldHVybiBjYWNoZVtmaWxlXVxuICAgIH1cblxuICAgIGNvbnN0IGRlZmluZWRNb2R1bGUgPSByZXF1aXJlLmRlZmluZWRbZmlsZV1cblxuICAgIGlmIChkZWZpbmVkTW9kdWxlKSB7XG4gICAgICAgIGNvbnN0IGxvY2FsUmVxdWlyZSA9IGNyZWF0ZUxvY2FsUmVxdWlyZShmaWxlKVxuICAgICAgICBjb25zdCBtb2R1bGUgPSB7IGV4cG9ydHM6IHt9IH1cblxuICAgICAgICBkZWZpbmVkTW9kdWxlLmNhbGwobW9kdWxlLmV4cG9ydHMsIG1vZHVsZS5leHBvcnRzLCBsb2NhbFJlcXVpcmUsIG1vZHVsZSlcblxuICAgICAgICByZXR1cm4gY2FjaGVbZmlsZV0gPSBtb2R1bGVcbiAgICB9XG5cbiAgICByZXR1cm4gbnVsbFxufVxuXG5jb25zdCByZXF1ZXN0TWFwID0gKG1hcCwgcmVxdWVzdCwgaWQpID0+IHtcbiAgICBjb25zdCBtYXBwZWQgPSBtYXBbaWRdICYmIG1hcFtpZF1bcmVxdWVzdF1cbiAgICByZXR1cm4gbWFwcGVkIHx8IHJlcXVlc3Rcbn1cblxuY29uc3QgZ2V0TW9kdWxlUm9vdCA9IChwYXRoKSA9PiB7XG4gICAgY29uc3Qgbm9kZU1vZHVsZXMgPSAnbm9kZV9tb2R1bGVzJ1xuICAgIGNvbnN0IHBhcnRzID0gcGF0aC5zcGxpdCgnLycpXG4gICAgY29uc3QgaW5kZXggPSBwYXJ0cy5sYXN0SW5kZXhPZihub2RlTW9kdWxlcylcbiAgICBpZiAoaW5kZXggPT09IC0xKSB7XG4gICAgICAgIHJldHVybiBwYXJ0c1swXVxuICAgIH1cbiAgICByZXR1cm4gcGFydHMuc2xpY2UoMCwgaW5kZXggKyAyKS5qb2luKCcvJylcbn1cblxuY29uc3QgcmVzb2x2ZUZpbGVuYW1lID0gKGtleSwgcGFyZW50KSA9PiB7XG4gICAgaWYgKGlzQWJzb2x1dGVQYWNrYWdlKGtleSkpIHtcbiAgICAgICAgcmV0dXJuIGtleVxuICAgIH1cblxuICAgIGlmIChpc1BhY2thZ2Uoa2V5KSkge1xuICAgICAgICByZXR1cm4ga2V5XG4gICAgfVxuXG4gICAgY29uc3QgeyBhbGlhcyB9ID0gd2luZG93LnJlcXVpcmVcbiAgICBjb25zdCBwYXJlbnRBbGlhcyA9IChhbGlhc1twYXJlbnRdID8gYWxpYXNbcGFyZW50XSA6IHBhcmVudClcbiAgICBjb25zdCBwYXJlbnRGaWxlID0gYXBwZW5kRXh0ZW5zaW9uKHBhcmVudEFsaWFzKVxuICAgIGNvbnN0IGRpcmVjdG9yeSA9IGRpcm5hbWUocGFyZW50RmlsZSlcblxuICAgIHJldHVybiBqb2luKGRpcmVjdG9yeSwga2V5KVxufVxuXG5jbGFzcyBNb2R1bGVFcnJvciBleHRlbmRzIEVycm9yIHtcbiAgICBjb25zdHJ1Y3RvcihtZXNzYWdlLCBtb2R1bGUpIHtcbiAgICAgICAgc3VwZXIobWVzc2FnZSlcbiAgICAgICAgdGhpcy5jb2RlID0gJ01PRFVMRV9OT1RfRk9VTkQnXG4gICAgICAgIHRoaXMubW9kdWxlID0gbW9kdWxlXG4gICAgfVxufVxuXG5jb25zdCBsb2FkID0gKHJlcXVlc3QsIHBhcmVudCA9IGdldEFwcFByZWZpeCgpKSA9PiB7XG5cbiAgICBjb25zdCByZXF1aXJlID0gd2luZG93LnJlcXVpcmVcbiAgICBjb25zdCBtYXBJRCA9IGdldE1vZHVsZVJvb3QocGFyZW50KVxuICAgIGNvbnN0IHJlbWFwcGVkID0gcmVxdWVzdE1hcChyZXF1aXJlLmJyb3dzZXJNYXAsIHJlcXVlc3QsIG1hcElEKVxuICAgIGNvbnN0IGNvbmZsaWN0ZWQgPSByZXF1ZXN0TWFwKHJlcXVpcmUuY29uZmxpY3RNYXAsIHJlbWFwcGVkLCBtYXBJRClcbiAgICBjb25zdCBrZXkgPSByZXNvbHZlRmlsZW5hbWUoY29uZmxpY3RlZCwgcGFyZW50KVxuXG4gICAgZm9yIChsZXQgaSA9IDA7IGkgPCBleHRlbnNpb25zLmxlbmd0aDsgaSsrKSB7XG4gICAgICAgIGNvbnN0IGZpbGUgPSBhcHBlbmRFeHRlbnNpb24oa2V5LCBleHRlbnNpb25zW2ldKVxuICAgICAgICBjb25zdCBtb2R1bGUgPSByZXNvbHZlRXhwb3J0cyhmaWxlKVxuICAgICAgICBpZiAobW9kdWxlKSB7XG4gICAgICAgICAgICByZXR1cm4gbW9kdWxlLmV4cG9ydHNcbiAgICAgICAgfVxuICAgIH1cblxuICAgIGZvciAobGV0IGkgPSAwOyBpIDwgZXh0ZW5zaW9ucy5sZW5ndGg7IGkrKykge1xuICAgICAgICBjb25zdCBmaWxlID0gYXBwZW5kRXh0ZW5zaW9uKGpvaW4oa2V5LCAnaW5kZXgnKSwgZXh0ZW5zaW9uc1tpXSlcbiAgICAgICAgY29uc3QgbW9kdWxlID0gcmVzb2x2ZUV4cG9ydHMoZmlsZSlcbiAgICAgICAgaWYgKG1vZHVsZSkge1xuICAgICAgICAgICAgcmV0dXJuIG1vZHVsZS5leHBvcnRzXG4gICAgICAgIH1cbiAgICB9XG5cbiAgICB0aHJvdyBuZXcgTW9kdWxlRXJyb3IoYENhbm5vdCBmaW5kIG1vZHVsZSBcIiR7a2V5fVwiIGZyb20gXCIke3BhcmVudH1cImAsIGtleSlcbn1cblxuZXhwb3J0IHsgbG9hZCB9XG4iLCJpbXBvcnQgZXh0ZW5kIGZyb20gJ29iamVjdC1leHRlbmQnXG5pbXBvcnQgKiBhcyBNb2R1bGUgZnJvbSAnLi9tb2R1bGUuanMnXG5cbmNvbnN0IGV2YWxNb2R1bGVzID0gKG1vZHVsZXMpID0+IHtcbiAgICBtb2R1bGVzLmZvckVhY2gobW9kdWxlID0+IHtcbiAgICAgICAgY29uc3QgcmVxdWlyZSA9IHdpbmRvdy5yZXF1aXJlXG4gICAgICAgIGNvbnN0IHsgaWQsIGtleSwgYWxpYXMsIHNvdXJjZSB9ID0gbW9kdWxlXG4gICAgICAgIHJlcXVpcmUuZGVmaW5lU291cmNlKGtleSwgc291cmNlKVxuICAgICAgICByZXF1aXJlLmlkcy5wdXNoKGlkKVxuXG4gICAgICAgIGlmIChhbGlhcykgcmVxdWlyZS5hbGlhc1trZXldID0gYWxpYXNcbiAgICB9KVxufVxuXG5jb25zdCBlbmFibGVCcm93c2VyUmVxdWlyZSA9IChtb2R1bGVzKSA9PiB7XG5cbiAgICBjb25zdCByZXF1aXJlID0gKHJlcXVlc3QsIGxvYWRlclBhdGgpID0+IE1vZHVsZS5sb2FkKHJlcXVlc3QsIGxvYWRlclBhdGgpXG5cbiAgICByZXF1aXJlLmRlZmluZWQgPSB7fVxuICAgIHJlcXVpcmUuaWRzID0gW11cbiAgICByZXF1aXJlLnByb2Nlc3NpbmcgPSB7fVxuICAgIHJlcXVpcmUuYWxpYXMgPSB7fVxuICAgIHJlcXVpcmUuYnJvd3Nlck1hcCA9IHt9XG4gICAgcmVxdWlyZS5jb25mbGljdE1hcCA9IHt9XG4gICAgcmVxdWlyZS5kZWZpbmUgPSAobW9kdWxlLCBmbikgPT4gcmVxdWlyZS5kZWZpbmVkW21vZHVsZV0gPSBmblxuICAgIHJlcXVpcmUuZGVmaW5lU291cmNlID0gKGtleSwgc291cmNlKSA9PiB7XG4gICAgICAgIGNvbnN0IHdyYXBwZWRNb2R1bGUgPSBldmFsKFxuICAgICAgICAgICAgJyhmdW5jdGlvbihleHBvcnRzLHJlcXVpcmUsbW9kdWxlKXsnICtcbiAgICAgICAgICAgICAgICAoc291cmNlICsgJ1xcbicpICtcbiAgICAgICAgICAgICd9KS5iaW5kKHdpbmRvdyknXG4gICAgICAgIClcbiAgICAgICAgcmVxdWlyZS5kZWZpbmUoa2V5LCB3cmFwcGVkTW9kdWxlKVxuICAgIH1cbiAgICByZXF1aXJlLmxvYWQgPSAoZW50cnksIG9wdGlvbnMgPSB7fSkgPT4ge1xuXG4gICAgICAgIGNvbnN0IHsgdXJsID0gJ21vZHVsZScgfSA9IG9wdGlvbnNcblxuICAgICAgICBpZiAocmVxdWlyZS5wcm9jZXNzaW5nW2VudHJ5XSkge1xuICAgICAgICAgICAgcmV0dXJuIHJlcXVpcmUucHJvY2Vzc2luZ1tlbnRyeV1cbiAgICAgICAgfVxuXG4gICAgICAgIGNvbnN0IHsgaWRzOiBleGNsdWRlIH0gPSByZXF1aXJlXG4gICAgICAgIGNvbnN0IGhlYWRlcnMgPSB7ICdDb250ZW50LVR5cGUnOiAnYXBwbGljYXRpb24vanNvbicgfVxuICAgICAgICBjb25zdCBib2R5ID0gSlNPTi5zdHJpbmdpZnkoeyBlbnRyeSwgZXhjbHVkZSB9KVxuICAgICAgICBjb25zdCBjb25maWcgPSB7IG1ldGhvZDogJ1BPU1QnLCBoZWFkZXJzLCBib2R5LCAuLi5vcHRpb25zIH1cblxuICAgICAgICBjb25zdCBwcm9taXNlID0gKFxuICAgICAgICAgICAgd2luZG93LmZldGNoKHVybCwgY29uZmlnKVxuICAgICAgICAgICAgLnRoZW4ocmVzcG9uc2UgPT4ge1xuICAgICAgICAgICAgICAgIGRlbGV0ZSByZXF1aXJlLnByb2Nlc3NpbmdbZW50cnldXG4gICAgICAgICAgICAgICAgcmV0dXJuIHJlc3BvbnNlLmpzb24oKVxuICAgICAgICAgICAgfSlcbiAgICAgICAgICAgIC50aGVuKCh7IGJyb3dzZXJNYXAsIGNvbmZsaWN0TWFwLCBtb2R1bGVzIH0pID0+IHtcbiAgICAgICAgICAgICAgICByZXF1aXJlLmJyb3dzZXJNYXAgPSBleHRlbmQocmVxdWlyZS5icm93c2VyTWFwLCBicm93c2VyTWFwKVxuICAgICAgICAgICAgICAgIHJlcXVpcmUuY29uZmxpY3RNYXAgPSBleHRlbmQocmVxdWlyZS5jb25mbGljdE1hcCwgY29uZmxpY3RNYXApXG4gICAgICAgICAgICAgICAgZXZhbE1vZHVsZXMobW9kdWxlcylcbiAgICAgICAgICAgIH0pXG4gICAgICAgICAgICAudGhlbigoKSA9PiByZXF1aXJlLndhcm11cCgpKVxuICAgICAgICAgICAgLmNhdGNoKGUgPT4gY29uc29sZS5lcnJvcihlKSlcbiAgICAgICAgKVxuXG4gICAgICAgIHJldHVybiByZXF1aXJlLnByb2Nlc3NpbmdbZW50cnldID0gcHJvbWlzZVxuICAgIH1cbiAgICByZXF1aXJlLndhcm11cFEgPSBbXVxuICAgIHJlcXVpcmUud2FybXVwID0gKC4uLmFyZ3MpID0+IHtcblxuICAgICAgICBpZiAoYXJncy5sZW5ndGggPiAwKSB7XG4gICAgICAgICAgICBjb25zb2xlLmxvZygnUGVuZGluZyB3YXJtIHVwLi4uJywgLi4uYXJncylcbiAgICAgICAgICAgIHJlcXVpcmUud2FybXVwUS5wdXNoKC4uLmFyZ3MpXG4gICAgICAgICAgICByZXR1cm4gc2V0VGltZW91dCgoKSA9PiByZXF1aXJlLndhcm11cCgpLCAwKVxuICAgICAgICB9XG5cbiAgICAgICAgaWYgKHJlcXVpcmUud2FybXVwUS5sZW5ndGggPT09IDApIHtcbiAgICAgICAgICAgIHJldHVyblxuICAgICAgICB9XG5cbiAgICAgICAgaWYgKE9iamVjdC5rZXlzKHJlcXVpcmUucHJvY2Vzc2luZykubGVuZ3RoID4gMCkge1xuICAgICAgICAgICAgcmV0dXJuXG4gICAgICAgIH1cblxuICAgICAgICBjb25zdCBtb2R1bGUgPSByZXF1aXJlLndhcm11cFEucG9wKClcblxuICAgICAgICBpZiAocmVxdWlyZS5kZWZpbmVkW21vZHVsZV0pIHtcbiAgICAgICAgICAgIHJldHVybiByZXF1aXJlLndhcm11cCgpXG4gICAgICAgIH1cblxuICAgICAgICBjb25zb2xlLmxvZygnV2FybWluZyB1cC4uLicsIG1vZHVsZSlcbiAgICAgICAgcmVxdWlyZS5sb2FkKG1vZHVsZSlcbiAgICB9XG5cbiAgICB3aW5kb3cucmVxdWlyZSA9IHJlcXVpcmVcblxuICAgIGlmIChtb2R1bGVzKSBldmFsTW9kdWxlcyhtb2R1bGVzKVxufVxuXG5leHBvcnQgZGVmYXVsdCBlbmFibGVCcm93c2VyUmVxdWlyZVxuXG4vLyBJbnNwaXJlZCBieTpcbi8vIGh0dHBzOi8vZ2l0aHViLmNvbS9lZmFjaWxpdGF0aW9uL2NvbW1vbmpzLXJlcXVpcmVcbiIsImltcG9ydCAnLi4vLi4vZGV2J1xuaW1wb3J0IGVuYWJsZUJyb3dzZXJSZXF1aXJlIGZyb20gJy4uLy4uL3JlcXVpcmUnXG5lbmFibGVCcm93c2VyUmVxdWlyZSgpXG4iXSwibmFtZXMiOlsid2ViU29ja2V0IiwiV2ViU29ja2V0Iiwib25vcGVuIiwiZXZ0IiwibG9nIiwib25tZXNzYWdlIiwiZGF0YSIsInJlbG9hZCIsIm9uY2xvc2UiLCJqb2luIiwiYmFzZW5hbWUiLCJpc0ZpbGUiLCJwYXRoIiwiaW5jbHVkZXMiLCJyZXNvbHZlRGVzdFBhdGgiLCJkZXN0IiwiYmFzZSIsImFic29sdXRlIiwicmVwbGFjZSIsImlzUmVsYXRpdmUiLCJjaGFyQXQiLCJpc0Fic29sdXRlIiwiZ2V0Um9vdFBhdGgiLCJyZWxhdGl2ZSIsImdsb2JhbCIsImV0aGljYWwiLCJjd2QiLCJwcm9jZXNzIiwiZXhwb3J0cyIsImV4dGVuc2lvbnMiLCJnZXRBcHBQcmVmaXgiLCJtb2R1bGVOYW1lIiwiaXNQYWNrYWdlIiwibmFtZSIsImlzQWJzb2x1dGVQYWNrYWdlIiwiaW5kZXhPZiIsImFwcGVuZEV4dGVuc2lvbiIsImV4dGVuc2lvbiIsImV4dCIsInNsaWNlIiwibGVuZ3RoIiwiY2FjaGUiLCJjcmVhdGVMb2NhbFJlcXVpcmUiLCJ3aW5kb3ciLCJyZXF1aXJlIiwia2V5IiwicGFyZW50IiwicmVzb2x2ZUV4cG9ydHMiLCJmaWxlIiwiZGVmaW5lZE1vZHVsZSIsImRlZmluZWQiLCJsb2NhbFJlcXVpcmUiLCJtb2R1bGUiLCJjYWxsIiwicmVxdWVzdE1hcCIsIm1hcCIsInJlcXVlc3QiLCJpZCIsIm1hcHBlZCIsImdldE1vZHVsZVJvb3QiLCJub2RlTW9kdWxlcyIsInBhcnRzIiwic3BsaXQiLCJpbmRleCIsImxhc3RJbmRleE9mIiwicmVzb2x2ZUZpbGVuYW1lIiwiYWxpYXMiLCJwYXJlbnRBbGlhcyIsInBhcmVudEZpbGUiLCJkaXJlY3RvcnkiLCJkaXJuYW1lIiwiTW9kdWxlRXJyb3IiLCJtZXNzYWdlIiwiY29kZSIsIkVycm9yIiwibG9hZCIsIm1hcElEIiwicmVtYXBwZWQiLCJicm93c2VyTWFwIiwiY29uZmxpY3RlZCIsImNvbmZsaWN0TWFwIiwiaSIsImV2YWxNb2R1bGVzIiwibW9kdWxlcyIsImZvckVhY2giLCJzb3VyY2UiLCJkZWZpbmVTb3VyY2UiLCJpZHMiLCJwdXNoIiwiZW5hYmxlQnJvd3NlclJlcXVpcmUiLCJsb2FkZXJQYXRoIiwiTW9kdWxlIiwicHJvY2Vzc2luZyIsImRlZmluZSIsImZuIiwid3JhcHBlZE1vZHVsZSIsImV2YWwiLCJlbnRyeSIsIm9wdGlvbnMiLCJ1cmwiLCJleGNsdWRlIiwiaGVhZGVycyIsImJvZHkiLCJKU09OIiwic3RyaW5naWZ5IiwiY29uZmlnIiwibWV0aG9kIiwicHJvbWlzZSIsImZldGNoIiwidGhlbiIsInJlc3BvbnNlIiwianNvbiIsImV4dGVuZCIsIndhcm11cCIsImNhdGNoIiwiY29uc29sZSIsImVycm9yIiwiZSIsIndhcm11cFEiLCJhcmdzIiwic2V0VGltZW91dCIsIk9iamVjdCIsImtleXMiLCJwb3AiXSwibWFwcGluZ3MiOiI7Ozs7OztBQUFBLElBQU1BLFlBQVksSUFBSUMsU0FBSixDQUFjLHFCQUFkLENBQWxCOztBQUVBRCxVQUFVRSxNQUFWLEdBQW1CLFVBQUNDLEdBQUQsRUFBUztZQUNoQkMsR0FBUixDQUFZLDBCQUFaO0NBREo7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
