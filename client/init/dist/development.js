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

var join$1 = pathBrowserify.join;
var basename = pathBrowserify.basename;

var isFile = function isFile(path) {
    return basename(path).includes('.');
};

var resolveDestPath = function resolveDestPath(path, dest, base) {
    if (typeof dest !== 'string') return absolute(path);
    if (isFile(dest)) return absolute(dest);
    return join$1(absolute(dest), absolute(path).replace(absolute(base), ''));
};

var isRelative$1 = function isRelative(path) {
    if (path.charAt(0) === '.' && (path.charAt(1) === '.' || path.charAt(1) === '/')) return true;
    return false;
};

var isAbsolute$1 = function isAbsolute(path) {
    if (path.charAt(0) === '/') return true;
    return false;
};

var absolute = function absolute(path) {
    if (isAbsolute$1(path)) return path;
    return join$1(getRootPath$1(), path);
};

var relative = function relative(path) {
    if (!isAbsolute$1(path)) return path;
    return path.replace(getRootPath$1() + '/', '');
};

var getRootPath$1 = function getRootPath() {
    return commonjsGlobal.ethical && commonjsGlobal.ethical.cwd || process.cwd();
};

var isFile_1 = isFile;
var resolveDestPath_1 = resolveDestPath;
var isRelative_1 = isRelative$1;
var isAbsolute_1 = isAbsolute$1;
var absolute_1 = absolute;
var relative_1 = relative;
var getRootPath_1 = getRootPath$1;

var path = {
	isFile: isFile_1,
	resolveDestPath: resolveDestPath_1,
	isRelative: isRelative_1,
	isAbsolute: isAbsolute_1,
	absolute: absolute_1,
	relative: relative_1,
	getRootPath: getRootPath_1
};

var isRelative = path.isRelative;
var isAbsolute = path.isAbsolute;

var join = pathBrowserify.join;

var extensions = ['js', 'json', 'node'];

var getAppPrefix = function getAppPrefix(moduleName) {
    return '&';
};

var isPackage = function isPackage(name) {
    if (isRelative(name) || isAbsolute(name)) return false;
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

var getModuleRoot = function getModuleRoot(path) {
    var nodeModules = 'node_modules';
    var parts = path.split('/');
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
    var directory = pathBrowserify_8(parentFile);

    return pathBrowserify_4(directory, key);
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
        var _file = appendExtension_1(pathBrowserify_4(key, 'index'), extensions_1[_i]);
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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZGV2ZWxvcG1lbnQuanMiLCJzb3VyY2VzIjpbIi4uLy4uL2Rldi9pbmRleC5qcyIsIi4uLy4uLy4uL25vZGVfbW9kdWxlcy9vYmplY3QtZXh0ZW5kL2xpYi9leHRlbmQuanMiLCIuLi8uLi8uLi9ub2RlX21vZHVsZXMvcGF0aC1icm93c2VyaWZ5L2luZGV4LmpzIiwiLi4vLi4vLi4vaGVscGVyL3BhdGgvaW5kZXguanMiLCIuLi8uLi8uLi9oZWxwZXIvcmVzb2x2ZS9pbmRleC5qcyIsIi4uLy4uL3JlcXVpcmUvbGliL21vZHVsZS5qcyIsIi4uLy4uL3JlcXVpcmUvbGliL2luZGV4LmpzIiwiLi4vc3JjL2RldmVsb3BtZW50LmpzIl0sInNvdXJjZXNDb250ZW50IjpbImNvbnN0IHdlYlNvY2tldCA9IG5ldyBXZWJTb2NrZXQoJ3dzOi8vbG9jYWxob3N0OjkzOTMnKVxuXG53ZWJTb2NrZXQub25vcGVuID0gKGV2dCkgPT4ge1xuICAgIGNvbnNvbGUubG9nKCdFdGhpY2FsIERldiBTb2NrZXQgT3BlbiEnKVxufVxud2ViU29ja2V0Lm9ubWVzc2FnZSA9IChldnQpID0+IHtcbiAgICBpZiAoZXZ0LmRhdGEgPT09ICdTRVJWRVJfU1RPUCcpIHtcbiAgICAgICAgbG9jYXRpb24ucmVsb2FkKClcbiAgICB9IGVsc2Uge1xuICAgICAgICBjb25zb2xlLmxvZyggJ0V0aGljYWwgRGV2IFNvY2tldCBSZWNlaXZlZCBNZXNzYWdlOiAnICsgZXZ0LmRhdGEpXG4gICAgfVxufVxud2ViU29ja2V0Lm9uY2xvc2UgPSAoZXZ0KSA9PiB7XG4gICAgY29uc29sZS5sb2coJ0V0aGljYWwgRGV2IFNvY2tldCBDbG9zZWQuJylcbn1cbiIsIi8qIVxuICogb2JqZWN0LWV4dGVuZFxuICogQSB3ZWxsLXRlc3RlZCBmdW5jdGlvbiB0byBkZWVwIGV4dGVuZCAob3IgbWVyZ2UpIEphdmFTY3JpcHQgb2JqZWN0cyB3aXRob3V0IGZ1cnRoZXIgZGVwZW5kZW5jaWVzLlxuICpcbiAqIGh0dHA6Ly9naXRodWIuY29tL2Jlcm5oYXJkd1xuICpcbiAqIENvcHlyaWdodCAyMDEzLCBCZXJuaGFyZCBXYW5nZXIgPG1haWxAYmVybmhhcmR3YW5nZXIuY29tPlxuICogUmVsZWFzZWQgdW5kZXIgdGhlIE1JVCBsaWNlbnNlLlxuICpcbiAqIERhdGU6IDIwMTMtMDQtMTBcbiAqL1xuXG5cbi8qKlxuICogRXh0ZW5kIG9iamVjdCBhIHdpdGggb2JqZWN0IGIuXG4gKlxuICogQHBhcmFtIHtPYmplY3R9IGEgU291cmNlIG9iamVjdC5cbiAqIEBwYXJhbSB7T2JqZWN0fSBiIE9iamVjdCB0byBleHRlbmQgd2l0aC5cbiAqIEByZXR1cm5zIHtPYmplY3R9IGEgRXh0ZW5kZWQgb2JqZWN0LlxuICovXG5tb2R1bGUuZXhwb3J0cyA9IGZ1bmN0aW9uIGV4dGVuZChhLCBiKSB7XG5cbiAgICAvLyBEb24ndCB0b3VjaCAnbnVsbCcgb3IgJ3VuZGVmaW5lZCcgb2JqZWN0cy5cbiAgICBpZiAoYSA9PSBudWxsIHx8IGIgPT0gbnVsbCkge1xuICAgICAgICByZXR1cm4gYTtcbiAgICB9XG5cbiAgICAvLyBUT0RPOiBSZWZhY3RvciB0byB1c2UgZm9yLWxvb3AgZm9yIHBlcmZvcm1hbmNlIHJlYXNvbnMuXG4gICAgT2JqZWN0LmtleXMoYikuZm9yRWFjaChmdW5jdGlvbiAoa2V5KSB7XG5cbiAgICAgICAgLy8gRGV0ZWN0IG9iamVjdCB3aXRob3V0IGFycmF5LCBkYXRlIG9yIG51bGwuXG4gICAgICAgIC8vIFRPRE86IFBlcmZvcm1hbmNlIHRlc3Q6XG4gICAgICAgIC8vIGEpIGIuY29uc3RydWN0b3IgPT09IE9iamVjdC5wcm90b3R5cGUuY29uc3RydWN0b3JcbiAgICAgICAgLy8gYikgT2JqZWN0LnByb3RvdHlwZS50b1N0cmluZy5jYWxsKGIpID09ICdbb2JqZWN0IE9iamVjdF0nXG4gICAgICAgIGlmIChPYmplY3QucHJvdG90eXBlLnRvU3RyaW5nLmNhbGwoYltrZXldKSA9PSAnW29iamVjdCBPYmplY3RdJykge1xuICAgICAgICAgICAgaWYgKE9iamVjdC5wcm90b3R5cGUudG9TdHJpbmcuY2FsbChhW2tleV0pICE9ICdbb2JqZWN0IE9iamVjdF0nKSB7XG4gICAgICAgICAgICAgICAgYVtrZXldID0gYltrZXldO1xuICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICBhW2tleV0gPSBleHRlbmQoYVtrZXldLCBiW2tleV0pO1xuICAgICAgICAgICAgfVxuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgYVtrZXldID0gYltrZXldO1xuICAgICAgICB9XG5cbiAgICB9KTtcblxuICAgIHJldHVybiBhO1xuXG59OyIsIi8vIENvcHlyaWdodCBKb3llbnQsIEluYy4gYW5kIG90aGVyIE5vZGUgY29udHJpYnV0b3JzLlxuLy9cbi8vIFBlcm1pc3Npb24gaXMgaGVyZWJ5IGdyYW50ZWQsIGZyZWUgb2YgY2hhcmdlLCB0byBhbnkgcGVyc29uIG9idGFpbmluZyBhXG4vLyBjb3B5IG9mIHRoaXMgc29mdHdhcmUgYW5kIGFzc29jaWF0ZWQgZG9jdW1lbnRhdGlvbiBmaWxlcyAodGhlXG4vLyBcIlNvZnR3YXJlXCIpLCB0byBkZWFsIGluIHRoZSBTb2Z0d2FyZSB3aXRob3V0IHJlc3RyaWN0aW9uLCBpbmNsdWRpbmdcbi8vIHdpdGhvdXQgbGltaXRhdGlvbiB0aGUgcmlnaHRzIHRvIHVzZSwgY29weSwgbW9kaWZ5LCBtZXJnZSwgcHVibGlzaCxcbi8vIGRpc3RyaWJ1dGUsIHN1YmxpY2Vuc2UsIGFuZC9vciBzZWxsIGNvcGllcyBvZiB0aGUgU29mdHdhcmUsIGFuZCB0byBwZXJtaXRcbi8vIHBlcnNvbnMgdG8gd2hvbSB0aGUgU29mdHdhcmUgaXMgZnVybmlzaGVkIHRvIGRvIHNvLCBzdWJqZWN0IHRvIHRoZVxuLy8gZm9sbG93aW5nIGNvbmRpdGlvbnM6XG4vL1xuLy8gVGhlIGFib3ZlIGNvcHlyaWdodCBub3RpY2UgYW5kIHRoaXMgcGVybWlzc2lvbiBub3RpY2Ugc2hhbGwgYmUgaW5jbHVkZWRcbi8vIGluIGFsbCBjb3BpZXMgb3Igc3Vic3RhbnRpYWwgcG9ydGlvbnMgb2YgdGhlIFNvZnR3YXJlLlxuLy9cbi8vIFRIRSBTT0ZUV0FSRSBJUyBQUk9WSURFRCBcIkFTIElTXCIsIFdJVEhPVVQgV0FSUkFOVFkgT0YgQU5ZIEtJTkQsIEVYUFJFU1Ncbi8vIE9SIElNUExJRUQsIElOQ0xVRElORyBCVVQgTk9UIExJTUlURUQgVE8gVEhFIFdBUlJBTlRJRVMgT0Zcbi8vIE1FUkNIQU5UQUJJTElUWSwgRklUTkVTUyBGT1IgQSBQQVJUSUNVTEFSIFBVUlBPU0UgQU5EIE5PTklORlJJTkdFTUVOVC4gSU5cbi8vIE5PIEVWRU5UIFNIQUxMIFRIRSBBVVRIT1JTIE9SIENPUFlSSUdIVCBIT0xERVJTIEJFIExJQUJMRSBGT1IgQU5ZIENMQUlNLFxuLy8gREFNQUdFUyBPUiBPVEhFUiBMSUFCSUxJVFksIFdIRVRIRVIgSU4gQU4gQUNUSU9OIE9GIENPTlRSQUNULCBUT1JUIE9SXG4vLyBPVEhFUldJU0UsIEFSSVNJTkcgRlJPTSwgT1VUIE9GIE9SIElOIENPTk5FQ1RJT04gV0lUSCBUSEUgU09GVFdBUkUgT1IgVEhFXG4vLyBVU0UgT1IgT1RIRVIgREVBTElOR1MgSU4gVEhFIFNPRlRXQVJFLlxuXG4vLyByZXNvbHZlcyAuIGFuZCAuLiBlbGVtZW50cyBpbiBhIHBhdGggYXJyYXkgd2l0aCBkaXJlY3RvcnkgbmFtZXMgdGhlcmVcbi8vIG11c3QgYmUgbm8gc2xhc2hlcywgZW1wdHkgZWxlbWVudHMsIG9yIGRldmljZSBuYW1lcyAoYzpcXCkgaW4gdGhlIGFycmF5XG4vLyAoc28gYWxzbyBubyBsZWFkaW5nIGFuZCB0cmFpbGluZyBzbGFzaGVzIC0gaXQgZG9lcyBub3QgZGlzdGluZ3Vpc2hcbi8vIHJlbGF0aXZlIGFuZCBhYnNvbHV0ZSBwYXRocylcbmZ1bmN0aW9uIG5vcm1hbGl6ZUFycmF5KHBhcnRzLCBhbGxvd0Fib3ZlUm9vdCkge1xuICAvLyBpZiB0aGUgcGF0aCB0cmllcyB0byBnbyBhYm92ZSB0aGUgcm9vdCwgYHVwYCBlbmRzIHVwID4gMFxuICB2YXIgdXAgPSAwO1xuICBmb3IgKHZhciBpID0gcGFydHMubGVuZ3RoIC0gMTsgaSA+PSAwOyBpLS0pIHtcbiAgICB2YXIgbGFzdCA9IHBhcnRzW2ldO1xuICAgIGlmIChsYXN0ID09PSAnLicpIHtcbiAgICAgIHBhcnRzLnNwbGljZShpLCAxKTtcbiAgICB9IGVsc2UgaWYgKGxhc3QgPT09ICcuLicpIHtcbiAgICAgIHBhcnRzLnNwbGljZShpLCAxKTtcbiAgICAgIHVwKys7XG4gICAgfSBlbHNlIGlmICh1cCkge1xuICAgICAgcGFydHMuc3BsaWNlKGksIDEpO1xuICAgICAgdXAtLTtcbiAgICB9XG4gIH1cblxuICAvLyBpZiB0aGUgcGF0aCBpcyBhbGxvd2VkIHRvIGdvIGFib3ZlIHRoZSByb290LCByZXN0b3JlIGxlYWRpbmcgLi5zXG4gIGlmIChhbGxvd0Fib3ZlUm9vdCkge1xuICAgIGZvciAoOyB1cC0tOyB1cCkge1xuICAgICAgcGFydHMudW5zaGlmdCgnLi4nKTtcbiAgICB9XG4gIH1cblxuICByZXR1cm4gcGFydHM7XG59XG5cbi8vIFNwbGl0IGEgZmlsZW5hbWUgaW50byBbcm9vdCwgZGlyLCBiYXNlbmFtZSwgZXh0XSwgdW5peCB2ZXJzaW9uXG4vLyAncm9vdCcgaXMganVzdCBhIHNsYXNoLCBvciBub3RoaW5nLlxudmFyIHNwbGl0UGF0aFJlID1cbiAgICAvXihcXC8/fCkoW1xcc1xcU10qPykoKD86XFwuezEsMn18W15cXC9dKz98KShcXC5bXi5cXC9dKnwpKSg/OltcXC9dKikkLztcbnZhciBzcGxpdFBhdGggPSBmdW5jdGlvbihmaWxlbmFtZSkge1xuICByZXR1cm4gc3BsaXRQYXRoUmUuZXhlYyhmaWxlbmFtZSkuc2xpY2UoMSk7XG59O1xuXG4vLyBwYXRoLnJlc29sdmUoW2Zyb20gLi4uXSwgdG8pXG4vLyBwb3NpeCB2ZXJzaW9uXG5leHBvcnRzLnJlc29sdmUgPSBmdW5jdGlvbigpIHtcbiAgdmFyIHJlc29sdmVkUGF0aCA9ICcnLFxuICAgICAgcmVzb2x2ZWRBYnNvbHV0ZSA9IGZhbHNlO1xuXG4gIGZvciAodmFyIGkgPSBhcmd1bWVudHMubGVuZ3RoIC0gMTsgaSA+PSAtMSAmJiAhcmVzb2x2ZWRBYnNvbHV0ZTsgaS0tKSB7XG4gICAgdmFyIHBhdGggPSAoaSA+PSAwKSA/IGFyZ3VtZW50c1tpXSA6IHByb2Nlc3MuY3dkKCk7XG5cbiAgICAvLyBTa2lwIGVtcHR5IGFuZCBpbnZhbGlkIGVudHJpZXNcbiAgICBpZiAodHlwZW9mIHBhdGggIT09ICdzdHJpbmcnKSB7XG4gICAgICB0aHJvdyBuZXcgVHlwZUVycm9yKCdBcmd1bWVudHMgdG8gcGF0aC5yZXNvbHZlIG11c3QgYmUgc3RyaW5ncycpO1xuICAgIH0gZWxzZSBpZiAoIXBhdGgpIHtcbiAgICAgIGNvbnRpbnVlO1xuICAgIH1cblxuICAgIHJlc29sdmVkUGF0aCA9IHBhdGggKyAnLycgKyByZXNvbHZlZFBhdGg7XG4gICAgcmVzb2x2ZWRBYnNvbHV0ZSA9IHBhdGguY2hhckF0KDApID09PSAnLyc7XG4gIH1cblxuICAvLyBBdCB0aGlzIHBvaW50IHRoZSBwYXRoIHNob3VsZCBiZSByZXNvbHZlZCB0byBhIGZ1bGwgYWJzb2x1dGUgcGF0aCwgYnV0XG4gIC8vIGhhbmRsZSByZWxhdGl2ZSBwYXRocyB0byBiZSBzYWZlIChtaWdodCBoYXBwZW4gd2hlbiBwcm9jZXNzLmN3ZCgpIGZhaWxzKVxuXG4gIC8vIE5vcm1hbGl6ZSB0aGUgcGF0aFxuICByZXNvbHZlZFBhdGggPSBub3JtYWxpemVBcnJheShmaWx0ZXIocmVzb2x2ZWRQYXRoLnNwbGl0KCcvJyksIGZ1bmN0aW9uKHApIHtcbiAgICByZXR1cm4gISFwO1xuICB9KSwgIXJlc29sdmVkQWJzb2x1dGUpLmpvaW4oJy8nKTtcblxuICByZXR1cm4gKChyZXNvbHZlZEFic29sdXRlID8gJy8nIDogJycpICsgcmVzb2x2ZWRQYXRoKSB8fCAnLic7XG59O1xuXG4vLyBwYXRoLm5vcm1hbGl6ZShwYXRoKVxuLy8gcG9zaXggdmVyc2lvblxuZXhwb3J0cy5ub3JtYWxpemUgPSBmdW5jdGlvbihwYXRoKSB7XG4gIHZhciBpc0Fic29sdXRlID0gZXhwb3J0cy5pc0Fic29sdXRlKHBhdGgpLFxuICAgICAgdHJhaWxpbmdTbGFzaCA9IHN1YnN0cihwYXRoLCAtMSkgPT09ICcvJztcblxuICAvLyBOb3JtYWxpemUgdGhlIHBhdGhcbiAgcGF0aCA9IG5vcm1hbGl6ZUFycmF5KGZpbHRlcihwYXRoLnNwbGl0KCcvJyksIGZ1bmN0aW9uKHApIHtcbiAgICByZXR1cm4gISFwO1xuICB9KSwgIWlzQWJzb2x1dGUpLmpvaW4oJy8nKTtcblxuICBpZiAoIXBhdGggJiYgIWlzQWJzb2x1dGUpIHtcbiAgICBwYXRoID0gJy4nO1xuICB9XG4gIGlmIChwYXRoICYmIHRyYWlsaW5nU2xhc2gpIHtcbiAgICBwYXRoICs9ICcvJztcbiAgfVxuXG4gIHJldHVybiAoaXNBYnNvbHV0ZSA/ICcvJyA6ICcnKSArIHBhdGg7XG59O1xuXG4vLyBwb3NpeCB2ZXJzaW9uXG5leHBvcnRzLmlzQWJzb2x1dGUgPSBmdW5jdGlvbihwYXRoKSB7XG4gIHJldHVybiBwYXRoLmNoYXJBdCgwKSA9PT0gJy8nO1xufTtcblxuLy8gcG9zaXggdmVyc2lvblxuZXhwb3J0cy5qb2luID0gZnVuY3Rpb24oKSB7XG4gIHZhciBwYXRocyA9IEFycmF5LnByb3RvdHlwZS5zbGljZS5jYWxsKGFyZ3VtZW50cywgMCk7XG4gIHJldHVybiBleHBvcnRzLm5vcm1hbGl6ZShmaWx0ZXIocGF0aHMsIGZ1bmN0aW9uKHAsIGluZGV4KSB7XG4gICAgaWYgKHR5cGVvZiBwICE9PSAnc3RyaW5nJykge1xuICAgICAgdGhyb3cgbmV3IFR5cGVFcnJvcignQXJndW1lbnRzIHRvIHBhdGguam9pbiBtdXN0IGJlIHN0cmluZ3MnKTtcbiAgICB9XG4gICAgcmV0dXJuIHA7XG4gIH0pLmpvaW4oJy8nKSk7XG59O1xuXG5cbi8vIHBhdGgucmVsYXRpdmUoZnJvbSwgdG8pXG4vLyBwb3NpeCB2ZXJzaW9uXG5leHBvcnRzLnJlbGF0aXZlID0gZnVuY3Rpb24oZnJvbSwgdG8pIHtcbiAgZnJvbSA9IGV4cG9ydHMucmVzb2x2ZShmcm9tKS5zdWJzdHIoMSk7XG4gIHRvID0gZXhwb3J0cy5yZXNvbHZlKHRvKS5zdWJzdHIoMSk7XG5cbiAgZnVuY3Rpb24gdHJpbShhcnIpIHtcbiAgICB2YXIgc3RhcnQgPSAwO1xuICAgIGZvciAoOyBzdGFydCA8IGFyci5sZW5ndGg7IHN0YXJ0KyspIHtcbiAgICAgIGlmIChhcnJbc3RhcnRdICE9PSAnJykgYnJlYWs7XG4gICAgfVxuXG4gICAgdmFyIGVuZCA9IGFyci5sZW5ndGggLSAxO1xuICAgIGZvciAoOyBlbmQgPj0gMDsgZW5kLS0pIHtcbiAgICAgIGlmIChhcnJbZW5kXSAhPT0gJycpIGJyZWFrO1xuICAgIH1cblxuICAgIGlmIChzdGFydCA+IGVuZCkgcmV0dXJuIFtdO1xuICAgIHJldHVybiBhcnIuc2xpY2Uoc3RhcnQsIGVuZCAtIHN0YXJ0ICsgMSk7XG4gIH1cblxuICB2YXIgZnJvbVBhcnRzID0gdHJpbShmcm9tLnNwbGl0KCcvJykpO1xuICB2YXIgdG9QYXJ0cyA9IHRyaW0odG8uc3BsaXQoJy8nKSk7XG5cbiAgdmFyIGxlbmd0aCA9IE1hdGgubWluKGZyb21QYXJ0cy5sZW5ndGgsIHRvUGFydHMubGVuZ3RoKTtcbiAgdmFyIHNhbWVQYXJ0c0xlbmd0aCA9IGxlbmd0aDtcbiAgZm9yICh2YXIgaSA9IDA7IGkgPCBsZW5ndGg7IGkrKykge1xuICAgIGlmIChmcm9tUGFydHNbaV0gIT09IHRvUGFydHNbaV0pIHtcbiAgICAgIHNhbWVQYXJ0c0xlbmd0aCA9IGk7XG4gICAgICBicmVhaztcbiAgICB9XG4gIH1cblxuICB2YXIgb3V0cHV0UGFydHMgPSBbXTtcbiAgZm9yICh2YXIgaSA9IHNhbWVQYXJ0c0xlbmd0aDsgaSA8IGZyb21QYXJ0cy5sZW5ndGg7IGkrKykge1xuICAgIG91dHB1dFBhcnRzLnB1c2goJy4uJyk7XG4gIH1cblxuICBvdXRwdXRQYXJ0cyA9IG91dHB1dFBhcnRzLmNvbmNhdCh0b1BhcnRzLnNsaWNlKHNhbWVQYXJ0c0xlbmd0aCkpO1xuXG4gIHJldHVybiBvdXRwdXRQYXJ0cy5qb2luKCcvJyk7XG59O1xuXG5leHBvcnRzLnNlcCA9ICcvJztcbmV4cG9ydHMuZGVsaW1pdGVyID0gJzonO1xuXG5leHBvcnRzLmRpcm5hbWUgPSBmdW5jdGlvbihwYXRoKSB7XG4gIHZhciByZXN1bHQgPSBzcGxpdFBhdGgocGF0aCksXG4gICAgICByb290ID0gcmVzdWx0WzBdLFxuICAgICAgZGlyID0gcmVzdWx0WzFdO1xuXG4gIGlmICghcm9vdCAmJiAhZGlyKSB7XG4gICAgLy8gTm8gZGlybmFtZSB3aGF0c29ldmVyXG4gICAgcmV0dXJuICcuJztcbiAgfVxuXG4gIGlmIChkaXIpIHtcbiAgICAvLyBJdCBoYXMgYSBkaXJuYW1lLCBzdHJpcCB0cmFpbGluZyBzbGFzaFxuICAgIGRpciA9IGRpci5zdWJzdHIoMCwgZGlyLmxlbmd0aCAtIDEpO1xuICB9XG5cbiAgcmV0dXJuIHJvb3QgKyBkaXI7XG59O1xuXG5cbmV4cG9ydHMuYmFzZW5hbWUgPSBmdW5jdGlvbihwYXRoLCBleHQpIHtcbiAgdmFyIGYgPSBzcGxpdFBhdGgocGF0aClbMl07XG4gIC8vIFRPRE86IG1ha2UgdGhpcyBjb21wYXJpc29uIGNhc2UtaW5zZW5zaXRpdmUgb24gd2luZG93cz9cbiAgaWYgKGV4dCAmJiBmLnN1YnN0cigtMSAqIGV4dC5sZW5ndGgpID09PSBleHQpIHtcbiAgICBmID0gZi5zdWJzdHIoMCwgZi5sZW5ndGggLSBleHQubGVuZ3RoKTtcbiAgfVxuICByZXR1cm4gZjtcbn07XG5cblxuZXhwb3J0cy5leHRuYW1lID0gZnVuY3Rpb24ocGF0aCkge1xuICByZXR1cm4gc3BsaXRQYXRoKHBhdGgpWzNdO1xufTtcblxuZnVuY3Rpb24gZmlsdGVyICh4cywgZikge1xuICAgIGlmICh4cy5maWx0ZXIpIHJldHVybiB4cy5maWx0ZXIoZik7XG4gICAgdmFyIHJlcyA9IFtdO1xuICAgIGZvciAodmFyIGkgPSAwOyBpIDwgeHMubGVuZ3RoOyBpKyspIHtcbiAgICAgICAgaWYgKGYoeHNbaV0sIGksIHhzKSkgcmVzLnB1c2goeHNbaV0pO1xuICAgIH1cbiAgICByZXR1cm4gcmVzO1xufVxuXG4vLyBTdHJpbmcucHJvdG90eXBlLnN1YnN0ciAtIG5lZ2F0aXZlIGluZGV4IGRvbid0IHdvcmsgaW4gSUU4XG52YXIgc3Vic3RyID0gJ2FiJy5zdWJzdHIoLTEpID09PSAnYidcbiAgICA/IGZ1bmN0aW9uIChzdHIsIHN0YXJ0LCBsZW4pIHsgcmV0dXJuIHN0ci5zdWJzdHIoc3RhcnQsIGxlbikgfVxuICAgIDogZnVuY3Rpb24gKHN0ciwgc3RhcnQsIGxlbikge1xuICAgICAgICBpZiAoc3RhcnQgPCAwKSBzdGFydCA9IHN0ci5sZW5ndGggKyBzdGFydDtcbiAgICAgICAgcmV0dXJuIHN0ci5zdWJzdHIoc3RhcnQsIGxlbik7XG4gICAgfVxuO1xuIiwiY29uc3QgeyBqb2luLCBiYXNlbmFtZSB9ID0gcmVxdWlyZSgncGF0aC1icm93c2VyaWZ5JylcblxuY29uc3QgaXNGaWxlID0gKHBhdGgpID0+ICggYmFzZW5hbWUocGF0aCkuaW5jbHVkZXMoJy4nKSApXG5cbmNvbnN0IHJlc29sdmVEZXN0UGF0aCA9IChwYXRoLCBkZXN0LCBiYXNlKSA9PiB7XG4gICAgaWYgKHR5cGVvZiBkZXN0ICE9PSAnc3RyaW5nJykgcmV0dXJuIGFic29sdXRlKHBhdGgpXG4gICAgaWYgKGlzRmlsZShkZXN0KSkgcmV0dXJuIGFic29sdXRlKGRlc3QpXG4gICAgcmV0dXJuIGpvaW4oYWJzb2x1dGUoZGVzdCksIGFic29sdXRlKHBhdGgpLnJlcGxhY2UoYWJzb2x1dGUoYmFzZSksICcnKSlcbn1cblxuY29uc3QgaXNSZWxhdGl2ZSA9IChwYXRoKSA9PiB7XG4gICAgaWYgKHBhdGguY2hhckF0KDApID09PSAnLicgJiYgKFxuICAgICAgICBwYXRoLmNoYXJBdCgxKSA9PT0gJy4nIHx8IHBhdGguY2hhckF0KDEpID09PSAnLycpKVxuICAgICAgICByZXR1cm4gdHJ1ZVxuICAgIHJldHVybiBmYWxzZVxufVxuXG5jb25zdCBpc0Fic29sdXRlID0gKHBhdGgpID0+IHtcbiAgICBpZiAocGF0aC5jaGFyQXQoMCkgPT09ICcvJykgcmV0dXJuIHRydWVcbiAgICByZXR1cm4gZmFsc2Vcbn1cblxuY29uc3QgYWJzb2x1dGUgPSAocGF0aCkgPT4ge1xuICAgIGlmIChpc0Fic29sdXRlKHBhdGgpKSByZXR1cm4gcGF0aFxuICAgIHJldHVybiBqb2luKGdldFJvb3RQYXRoKCksIHBhdGgpXG59XG5cbmNvbnN0IHJlbGF0aXZlID0gKHBhdGgpID0+IHtcbiAgICBpZiAoIWlzQWJzb2x1dGUocGF0aCkpIHJldHVybiBwYXRoXG4gICAgcmV0dXJuIHBhdGgucmVwbGFjZShnZXRSb290UGF0aCgpICsgJy8nICwgJycpXG59XG5cbmNvbnN0IGdldFJvb3RQYXRoID0gKCkgPT4gKFxuICAgIChnbG9iYWwuZXRoaWNhbCAmJiBnbG9iYWwuZXRoaWNhbC5jd2QpIHx8IHByb2Nlc3MuY3dkKClcbilcblxuZXhwb3J0cy5pc0ZpbGUgPSBpc0ZpbGVcbmV4cG9ydHMucmVzb2x2ZURlc3RQYXRoID0gcmVzb2x2ZURlc3RQYXRoXG5leHBvcnRzLmlzUmVsYXRpdmUgPSBpc1JlbGF0aXZlXG5leHBvcnRzLmlzQWJzb2x1dGUgPSBpc0Fic29sdXRlXG5leHBvcnRzLmFic29sdXRlID0gYWJzb2x1dGVcbmV4cG9ydHMucmVsYXRpdmUgPSByZWxhdGl2ZVxuZXhwb3J0cy5nZXRSb290UGF0aCA9IGdldFJvb3RQYXRoXG4iLCJjb25zdCBpc05vZGUgPSByZXF1aXJlKCcuLi8uLi9oZWxwZXIvaXMtbm9kZScpXG5jb25zdCB7IGlzUmVsYXRpdmUsIGlzQWJzb2x1dGUsIGdldFJvb3RQYXRoIH0gPSByZXF1aXJlKCcuLi8uLi9oZWxwZXIvcGF0aCcpXG5jb25zdCB7IGpvaW4gfSA9IHJlcXVpcmUoJ3BhdGgtYnJvd3NlcmlmeScpXG5cbmNvbnN0IGV4dGVuc2lvbnMgPSBbJ2pzJywgJ2pzb24nLCAnbm9kZSddXG5cbmNvbnN0IGdldEFwcFByZWZpeCA9IChtb2R1bGVOYW1lKSA9PiAnJidcblxuY29uc3QgaXNBcHBNb2R1bGUgPSAobW9kdWxlTmFtZSkgPT4gKFxuICAgIG1vZHVsZU5hbWUuY2hhckF0KDApID09PSBnZXRBcHBQcmVmaXgoKVxuKVxuXG5jb25zdCBpc1BhY2thZ2UgPSAobmFtZSkgPT4ge1xuICAgIGlmIChpc1JlbGF0aXZlKG5hbWUpIHx8IGlzQWJzb2x1dGUobmFtZSkpIHJldHVybiBmYWxzZVxuICAgIHJldHVybiB0cnVlXG59XG5cbmNvbnN0IGlzQWJzb2x1dGVQYWNrYWdlID0gKG5hbWUpID0+IHtcbiAgICBpZiAoaXNQYWNrYWdlKG5hbWUpICYmIG5hbWUuaW5kZXhPZignLycpID09PSAtMSlcbiAgICAgICAgcmV0dXJuIHRydWVcbiAgICByZXR1cm4gZmFsc2Vcbn1cblxuY29uc3QgaXNSZWxhdGl2ZVBhY2thZ2UgPSAobmFtZSkgPT4ge1xuICAgIGlmIChuYW1lLmluZGV4T2YoJy8nKSA+IC0xICYmIGlzUGFja2FnZShuYW1lKSkgcmV0dXJuIHRydWVcbiAgICByZXR1cm4gZmFsc2Vcbn1cblxuY29uc3QgYXBwZW5kRXh0ZW5zaW9uID0gKG5hbWUsIGV4dGVuc2lvbiA9ICdqcycpID0+IHtcbiAgICBpZiAoaXNBYnNvbHV0ZVBhY2thZ2UobmFtZSkpIHJldHVybiBuYW1lXG4gICAgY29uc3QgZXh0ID0gJy4nICsgZXh0ZW5zaW9uXG4gICAgaWYgKG5hbWUuc2xpY2UoLShleHQubGVuZ3RoKSkgPT09IGV4dCkgcmV0dXJuIG5hbWVcbiAgICByZXR1cm4gbmFtZSArIGV4dFxufVxuXG5jb25zdCBnZXRSZXF1aXJlID0gKCkgPT4ge1xuICAgIGlmIChpc05vZGUoKSkgcmV0dXJuIHJlcXVpcmVcbiAgICByZXR1cm4gd2luZG93LnJlcXVpcmVcbn1cblxuY29uc3QgcmVzb2x2ZUFwcE1vZHVsZSA9IChtb2R1bGUpID0+IHtcbiAgICBpZiAoaXNBcHBNb2R1bGUobW9kdWxlKSkge1xuICAgICAgICByZXR1cm4gam9pbihnZXRSb290UGF0aCgpLCBtb2R1bGUucmVwbGFjZShnZXRBcHBQcmVmaXgoKSwgJycpKVxuICAgIH1cbiAgICBpZiAoaXNSZWxhdGl2ZShtb2R1bGUpKSByZXR1cm4gam9pbihnZXRSb290UGF0aCgpLCBtb2R1bGUpXG4gICAgcmV0dXJuIG1vZHVsZVxufVxuXG5jb25zdCByZXF1aXJlTW9kdWxlID0gKG5hbWUpID0+IHtcbiAgICBjb25zdCBwYXRoID0gKCBpc05vZGUoKSA/IHJlc29sdmVBcHBNb2R1bGUobmFtZSkgOiBuYW1lIClcbiAgICByZXR1cm4gZ2V0UmVxdWlyZSgpKHBhdGgpXG59XG5cbmV4cG9ydHMuZXh0ZW5zaW9ucyA9IGV4dGVuc2lvbnNcbmV4cG9ydHMuZ2V0QXBwUHJlZml4ID0gZ2V0QXBwUHJlZml4XG5leHBvcnRzLmlzQXBwTW9kdWxlID0gaXNBcHBNb2R1bGVcbmV4cG9ydHMuaXNQYWNrYWdlID0gaXNQYWNrYWdlXG5leHBvcnRzLmlzQWJzb2x1dGVQYWNrYWdlID0gaXNBYnNvbHV0ZVBhY2thZ2VcbmV4cG9ydHMuaXNSZWxhdGl2ZVBhY2thZ2UgPSBpc1JlbGF0aXZlUGFja2FnZVxuZXhwb3J0cy5hcHBlbmRFeHRlbnNpb24gPSBhcHBlbmRFeHRlbnNpb25cbmV4cG9ydHMuZ2V0UmVxdWlyZSA9IGdldFJlcXVpcmVcbmV4cG9ydHMucmVzb2x2ZUFwcE1vZHVsZSA9IHJlc29sdmVBcHBNb2R1bGVcbmV4cG9ydHMucmVxdWlyZU1vZHVsZSA9IHJlcXVpcmVNb2R1bGVcbiIsImltcG9ydCB7IGpvaW4sIHJlc29sdmUsIGRpcm5hbWUgfSBmcm9tICdwYXRoLWJyb3dzZXJpZnknXG5pbXBvcnQge1xuICAgIGlzUGFja2FnZSxcbiAgICBpc0Fic29sdXRlUGFja2FnZSxcbiAgICBhcHBlbmRFeHRlbnNpb24sXG4gICAgZ2V0QXBwUHJlZml4LFxuICAgIGV4dGVuc2lvbnNcbn0gZnJvbSAnLi4vLi4vLi4vaGVscGVyL3Jlc29sdmUnXG5cbmNvbnN0IGNhY2hlID0ge31cblxuY29uc3QgY3JlYXRlTG9jYWxSZXF1aXJlID0gcGFyZW50ID0+IGtleSA9PiB3aW5kb3cucmVxdWlyZShrZXksIHBhcmVudClcblxuY29uc3QgcmVzb2x2ZUV4cG9ydHMgPSAoZmlsZSkgPT4ge1xuXG4gICAgaWYgKGNhY2hlW2ZpbGVdKSB7XG4gICAgICAgIHJldHVybiBjYWNoZVtmaWxlXVxuICAgIH1cblxuICAgIGNvbnN0IGRlZmluZWRNb2R1bGUgPSByZXF1aXJlLmRlZmluZWRbZmlsZV1cblxuICAgIGlmIChkZWZpbmVkTW9kdWxlKSB7XG4gICAgICAgIGNvbnN0IGxvY2FsUmVxdWlyZSA9IGNyZWF0ZUxvY2FsUmVxdWlyZShmaWxlKVxuICAgICAgICBjb25zdCBtb2R1bGUgPSB7IGV4cG9ydHM6IHt9IH1cblxuICAgICAgICBkZWZpbmVkTW9kdWxlLmNhbGwobW9kdWxlLmV4cG9ydHMsIG1vZHVsZS5leHBvcnRzLCBsb2NhbFJlcXVpcmUsIG1vZHVsZSlcblxuICAgICAgICByZXR1cm4gY2FjaGVbZmlsZV0gPSBtb2R1bGVcbiAgICB9XG5cbiAgICByZXR1cm4gbnVsbFxufVxuXG5jb25zdCByZXF1ZXN0TWFwID0gKG1hcCwgcmVxdWVzdCwgaWQpID0+IHtcbiAgICBjb25zdCBtYXBwZWQgPSBtYXBbaWRdICYmIG1hcFtpZF1bcmVxdWVzdF1cbiAgICByZXR1cm4gbWFwcGVkIHx8IHJlcXVlc3Rcbn1cblxuY29uc3QgZ2V0TW9kdWxlUm9vdCA9IChwYXRoKSA9PiB7XG4gICAgY29uc3Qgbm9kZU1vZHVsZXMgPSAnbm9kZV9tb2R1bGVzJ1xuICAgIGNvbnN0IHBhcnRzID0gcGF0aC5zcGxpdCgnLycpXG4gICAgY29uc3QgaW5kZXggPSBwYXJ0cy5sYXN0SW5kZXhPZihub2RlTW9kdWxlcylcbiAgICBpZiAoaW5kZXggPT09IC0xKSB7XG4gICAgICAgIHJldHVybiBwYXJ0c1swXVxuICAgIH1cbiAgICByZXR1cm4gcGFydHMuc2xpY2UoMCwgaW5kZXggKyAyKS5qb2luKCcvJylcbn1cblxuY29uc3QgcmVzb2x2ZUZpbGVuYW1lID0gKGtleSwgcGFyZW50KSA9PiB7XG4gICAgaWYgKGlzQWJzb2x1dGVQYWNrYWdlKGtleSkpIHtcbiAgICAgICAgcmV0dXJuIGtleVxuICAgIH1cblxuICAgIGlmIChpc1BhY2thZ2Uoa2V5KSkge1xuICAgICAgICByZXR1cm4ga2V5XG4gICAgfVxuXG4gICAgY29uc3QgeyBhbGlhcyB9ID0gd2luZG93LnJlcXVpcmVcbiAgICBjb25zdCBwYXJlbnRBbGlhcyA9IChhbGlhc1twYXJlbnRdID8gYWxpYXNbcGFyZW50XSA6IHBhcmVudClcbiAgICBjb25zdCBwYXJlbnRGaWxlID0gYXBwZW5kRXh0ZW5zaW9uKHBhcmVudEFsaWFzKVxuICAgIGNvbnN0IGRpcmVjdG9yeSA9IGRpcm5hbWUocGFyZW50RmlsZSlcblxuICAgIHJldHVybiBqb2luKGRpcmVjdG9yeSwga2V5KVxufVxuXG5jbGFzcyBNb2R1bGVFcnJvciBleHRlbmRzIEVycm9yIHtcbiAgICBjb25zdHJ1Y3RvcihtZXNzYWdlLCBtb2R1bGUpIHtcbiAgICAgICAgc3VwZXIobWVzc2FnZSlcbiAgICAgICAgdGhpcy5jb2RlID0gJ01PRFVMRV9OT1RfRk9VTkQnXG4gICAgICAgIHRoaXMubW9kdWxlID0gbW9kdWxlXG4gICAgfVxufVxuXG5jb25zdCBsb2FkID0gKHJlcXVlc3QsIHBhcmVudCA9IGdldEFwcFByZWZpeCgpKSA9PiB7XG5cbiAgICBjb25zdCByZXF1aXJlID0gd2luZG93LnJlcXVpcmVcbiAgICBjb25zdCBtYXBJRCA9IGdldE1vZHVsZVJvb3QocGFyZW50KVxuICAgIGNvbnN0IHJlbWFwcGVkID0gcmVxdWVzdE1hcChyZXF1aXJlLmJyb3dzZXJNYXAsIHJlcXVlc3QsIG1hcElEKVxuICAgIGNvbnN0IGNvbmZsaWN0ZWQgPSByZXF1ZXN0TWFwKHJlcXVpcmUuY29uZmxpY3RNYXAsIHJlbWFwcGVkLCBtYXBJRClcbiAgICBjb25zdCBrZXkgPSByZXNvbHZlRmlsZW5hbWUoY29uZmxpY3RlZCwgcGFyZW50KVxuXG4gICAgZm9yIChsZXQgaSA9IDA7IGkgPCBleHRlbnNpb25zLmxlbmd0aDsgaSsrKSB7XG4gICAgICAgIGNvbnN0IGZpbGUgPSBhcHBlbmRFeHRlbnNpb24oa2V5LCBleHRlbnNpb25zW2ldKVxuICAgICAgICBjb25zdCBtb2R1bGUgPSByZXNvbHZlRXhwb3J0cyhmaWxlKVxuICAgICAgICBpZiAobW9kdWxlKSB7XG4gICAgICAgICAgICByZXR1cm4gbW9kdWxlLmV4cG9ydHNcbiAgICAgICAgfVxuICAgIH1cblxuICAgIGZvciAobGV0IGkgPSAwOyBpIDwgZXh0ZW5zaW9ucy5sZW5ndGg7IGkrKykge1xuICAgICAgICBjb25zdCBmaWxlID0gYXBwZW5kRXh0ZW5zaW9uKGpvaW4oa2V5LCAnaW5kZXgnKSwgZXh0ZW5zaW9uc1tpXSlcbiAgICAgICAgY29uc3QgbW9kdWxlID0gcmVzb2x2ZUV4cG9ydHMoZmlsZSlcbiAgICAgICAgaWYgKG1vZHVsZSkge1xuICAgICAgICAgICAgcmV0dXJuIG1vZHVsZS5leHBvcnRzXG4gICAgICAgIH1cbiAgICB9XG5cbiAgICB0aHJvdyBuZXcgTW9kdWxlRXJyb3IoYENhbm5vdCBmaW5kIG1vZHVsZSBcIiR7a2V5fVwiIGZyb20gXCIke3BhcmVudH1cImAsIGtleSlcbn1cblxuZXhwb3J0IHsgbG9hZCB9XG4iLCJpbXBvcnQgZXh0ZW5kIGZyb20gJ29iamVjdC1leHRlbmQnXG5pbXBvcnQgKiBhcyBNb2R1bGUgZnJvbSAnLi9tb2R1bGUuanMnXG5cbmNvbnN0IGV2YWxNb2R1bGVzID0gKG1vZHVsZXMpID0+IHtcbiAgICBtb2R1bGVzLmZvckVhY2gobW9kdWxlID0+IHtcbiAgICAgICAgY29uc3QgcmVxdWlyZSA9IHdpbmRvdy5yZXF1aXJlXG4gICAgICAgIGNvbnN0IHsgaWQsIGtleSwgYWxpYXMsIHNvdXJjZSB9ID0gbW9kdWxlXG4gICAgICAgIHJlcXVpcmUuZGVmaW5lU291cmNlKGtleSwgc291cmNlKVxuICAgICAgICByZXF1aXJlLmlkcy5wdXNoKGlkKVxuXG4gICAgICAgIGlmIChhbGlhcykgcmVxdWlyZS5hbGlhc1trZXldID0gYWxpYXNcbiAgICB9KVxufVxuXG5jb25zdCBlbmFibGVCcm93c2VyUmVxdWlyZSA9IChtb2R1bGVzKSA9PiB7XG5cbiAgICBjb25zdCByZXF1aXJlID0gKHJlcXVlc3QsIGxvYWRlclBhdGgpID0+IE1vZHVsZS5sb2FkKHJlcXVlc3QsIGxvYWRlclBhdGgpXG5cbiAgICByZXF1aXJlLmRlZmluZWQgPSB7fVxuICAgIHJlcXVpcmUuaWRzID0gW11cbiAgICByZXF1aXJlLnByb2Nlc3NpbmcgPSB7fVxuICAgIHJlcXVpcmUuYWxpYXMgPSB7fVxuICAgIHJlcXVpcmUuYnJvd3Nlck1hcCA9IHt9XG4gICAgcmVxdWlyZS5jb25mbGljdE1hcCA9IHt9XG4gICAgcmVxdWlyZS5kZWZpbmUgPSAobW9kdWxlLCBmbikgPT4gcmVxdWlyZS5kZWZpbmVkW21vZHVsZV0gPSBmblxuICAgIHJlcXVpcmUuZGVmaW5lU291cmNlID0gKGtleSwgc291cmNlKSA9PiB7XG4gICAgICAgIGNvbnN0IHdyYXBwZWRNb2R1bGUgPSBldmFsKFxuICAgICAgICAgICAgJyhmdW5jdGlvbihleHBvcnRzLHJlcXVpcmUsbW9kdWxlKXsnICtcbiAgICAgICAgICAgICAgICAoc291cmNlICsgJ1xcbicpICtcbiAgICAgICAgICAgICd9KS5iaW5kKHdpbmRvdyknXG4gICAgICAgIClcbiAgICAgICAgcmVxdWlyZS5kZWZpbmUoa2V5LCB3cmFwcGVkTW9kdWxlKVxuICAgIH1cbiAgICByZXF1aXJlLmxvYWQgPSAoZW50cnksIG9wdGlvbnMgPSB7fSkgPT4ge1xuXG4gICAgICAgIGNvbnN0IHsgdXJsID0gJ21vZHVsZScgfSA9IG9wdGlvbnNcblxuICAgICAgICBpZiAocmVxdWlyZS5wcm9jZXNzaW5nW2VudHJ5XSkge1xuICAgICAgICAgICAgcmV0dXJuIHJlcXVpcmUucHJvY2Vzc2luZ1tlbnRyeV1cbiAgICAgICAgfVxuXG4gICAgICAgIGNvbnN0IHsgaWRzOiBleGNsdWRlIH0gPSByZXF1aXJlXG4gICAgICAgIGNvbnN0IGhlYWRlcnMgPSB7ICdDb250ZW50LVR5cGUnOiAnYXBwbGljYXRpb24vanNvbicgfVxuICAgICAgICBjb25zdCBib2R5ID0gSlNPTi5zdHJpbmdpZnkoeyBlbnRyeSwgZXhjbHVkZSB9KVxuICAgICAgICBjb25zdCBjb25maWcgPSB7IG1ldGhvZDogJ1BPU1QnLCBoZWFkZXJzLCBib2R5LCAuLi5vcHRpb25zIH1cblxuICAgICAgICBjb25zdCBwcm9taXNlID0gKFxuICAgICAgICAgICAgd2luZG93LmZldGNoKHVybCwgY29uZmlnKVxuICAgICAgICAgICAgLnRoZW4ocmVzcG9uc2UgPT4ge1xuICAgICAgICAgICAgICAgIGRlbGV0ZSByZXF1aXJlLnByb2Nlc3NpbmdbZW50cnldXG4gICAgICAgICAgICAgICAgcmV0dXJuIHJlc3BvbnNlLmpzb24oKVxuICAgICAgICAgICAgfSlcbiAgICAgICAgICAgIC50aGVuKCh7IGJyb3dzZXJNYXAsIGNvbmZsaWN0TWFwLCBtb2R1bGVzIH0pID0+IHtcbiAgICAgICAgICAgICAgICByZXF1aXJlLmJyb3dzZXJNYXAgPSBleHRlbmQocmVxdWlyZS5icm93c2VyTWFwLCBicm93c2VyTWFwKVxuICAgICAgICAgICAgICAgIHJlcXVpcmUuY29uZmxpY3RNYXAgPSBleHRlbmQocmVxdWlyZS5jb25mbGljdE1hcCwgY29uZmxpY3RNYXApXG4gICAgICAgICAgICAgICAgZXZhbE1vZHVsZXMobW9kdWxlcylcbiAgICAgICAgICAgIH0pXG4gICAgICAgICAgICAudGhlbigoKSA9PiByZXF1aXJlLndhcm11cCgpKVxuICAgICAgICAgICAgLmNhdGNoKGUgPT4gY29uc29sZS5lcnJvcihlKSlcbiAgICAgICAgKVxuXG4gICAgICAgIHJldHVybiByZXF1aXJlLnByb2Nlc3NpbmdbZW50cnldID0gcHJvbWlzZVxuICAgIH1cbiAgICByZXF1aXJlLndhcm11cFEgPSBbXVxuICAgIHJlcXVpcmUud2FybXVwID0gKC4uLmFyZ3MpID0+IHtcblxuICAgICAgICBpZiAoYXJncy5sZW5ndGggPiAwKSB7XG4gICAgICAgICAgICBjb25zb2xlLmxvZygnUGVuZGluZyB3YXJtIHVwLi4uJywgLi4uYXJncylcbiAgICAgICAgICAgIHJlcXVpcmUud2FybXVwUS5wdXNoKC4uLmFyZ3MpXG4gICAgICAgICAgICByZXR1cm4gc2V0VGltZW91dCgoKSA9PiByZXF1aXJlLndhcm11cCgpLCAwKVxuICAgICAgICB9XG5cbiAgICAgICAgaWYgKHJlcXVpcmUud2FybXVwUS5sZW5ndGggPT09IDApIHtcbiAgICAgICAgICAgIHJldHVyblxuICAgICAgICB9XG5cbiAgICAgICAgaWYgKE9iamVjdC5rZXlzKHJlcXVpcmUucHJvY2Vzc2luZykubGVuZ3RoID4gMCkge1xuICAgICAgICAgICAgcmV0dXJuXG4gICAgICAgIH1cblxuICAgICAgICBjb25zdCBtb2R1bGUgPSByZXF1aXJlLndhcm11cFEucG9wKClcblxuICAgICAgICBpZiAocmVxdWlyZS5kZWZpbmVkW21vZHVsZV0pIHtcbiAgICAgICAgICAgIHJldHVybiByZXF1aXJlLndhcm11cCgpXG4gICAgICAgIH1cblxuICAgICAgICBjb25zb2xlLmxvZygnV2FybWluZyB1cC4uLicsIG1vZHVsZSlcbiAgICAgICAgcmVxdWlyZS5sb2FkKG1vZHVsZSlcbiAgICB9XG5cbiAgICB3aW5kb3cucmVxdWlyZSA9IHJlcXVpcmVcblxuICAgIGlmIChtb2R1bGVzKSBldmFsTW9kdWxlcyhtb2R1bGVzKVxufVxuXG5leHBvcnQgZGVmYXVsdCBlbmFibGVCcm93c2VyUmVxdWlyZVxuXG4vLyBJbnNwaXJlZCBieTpcbi8vIGh0dHBzOi8vZ2l0aHViLmNvbS9lZmFjaWxpdGF0aW9uL2NvbW1vbmpzLXJlcXVpcmVcbiIsImltcG9ydCAnLi4vLi4vZGV2J1xuaW1wb3J0IGVuYWJsZUJyb3dzZXJSZXF1aXJlIGZyb20gJy4uLy4uL3JlcXVpcmUnXG5lbmFibGVCcm93c2VyUmVxdWlyZSgpXG4iXSwibmFtZXMiOlsid2ViU29ja2V0IiwiV2ViU29ja2V0Iiwib25vcGVuIiwiZXZ0IiwibG9nIiwib25tZXNzYWdlIiwiZGF0YSIsInJlbG9hZCIsIm9uY2xvc2UiLCJqb2luIiwiYmFzZW5hbWUiLCJpc0ZpbGUiLCJwYXRoIiwiaW5jbHVkZXMiLCJyZXNvbHZlRGVzdFBhdGgiLCJkZXN0IiwiYmFzZSIsImFic29sdXRlIiwicmVwbGFjZSIsImlzUmVsYXRpdmUiLCJjaGFyQXQiLCJpc0Fic29sdXRlIiwiZ2V0Um9vdFBhdGgiLCJyZWxhdGl2ZSIsImdsb2JhbCIsImV0aGljYWwiLCJjd2QiLCJwcm9jZXNzIiwiZXhwb3J0cyIsImV4dGVuc2lvbnMiLCJnZXRBcHBQcmVmaXgiLCJtb2R1bGVOYW1lIiwiaXNQYWNrYWdlIiwibmFtZSIsImlzQWJzb2x1dGVQYWNrYWdlIiwiaW5kZXhPZiIsImFwcGVuZEV4dGVuc2lvbiIsImV4dGVuc2lvbiIsImV4dCIsInNsaWNlIiwibGVuZ3RoIiwiY2FjaGUiLCJjcmVhdGVMb2NhbFJlcXVpcmUiLCJ3aW5kb3ciLCJyZXF1aXJlIiwia2V5IiwicGFyZW50IiwicmVzb2x2ZUV4cG9ydHMiLCJmaWxlIiwiZGVmaW5lZE1vZHVsZSIsImRlZmluZWQiLCJsb2NhbFJlcXVpcmUiLCJtb2R1bGUiLCJjYWxsIiwicmVxdWVzdE1hcCIsIm1hcCIsInJlcXVlc3QiLCJpZCIsIm1hcHBlZCIsImdldE1vZHVsZVJvb3QiLCJub2RlTW9kdWxlcyIsInBhcnRzIiwic3BsaXQiLCJpbmRleCIsImxhc3RJbmRleE9mIiwicmVzb2x2ZUZpbGVuYW1lIiwiYWxpYXMiLCJwYXJlbnRBbGlhcyIsInBhcmVudEZpbGUiLCJkaXJlY3RvcnkiLCJkaXJuYW1lIiwiTW9kdWxlRXJyb3IiLCJtZXNzYWdlIiwiY29kZSIsIkVycm9yIiwibG9hZCIsIm1hcElEIiwicmVtYXBwZWQiLCJicm93c2VyTWFwIiwiY29uZmxpY3RlZCIsImNvbmZsaWN0TWFwIiwiaSIsImV2YWxNb2R1bGVzIiwibW9kdWxlcyIsImZvckVhY2giLCJzb3VyY2UiLCJkZWZpbmVTb3VyY2UiLCJpZHMiLCJwdXNoIiwiZW5hYmxlQnJvd3NlclJlcXVpcmUiLCJsb2FkZXJQYXRoIiwiTW9kdWxlIiwicHJvY2Vzc2luZyIsImRlZmluZSIsImZuIiwid3JhcHBlZE1vZHVsZSIsImV2YWwiLCJlbnRyeSIsIm9wdGlvbnMiLCJ1cmwiLCJleGNsdWRlIiwiaGVhZGVycyIsImJvZHkiLCJKU09OIiwic3RyaW5naWZ5IiwiY29uZmlnIiwibWV0aG9kIiwicHJvbWlzZSIsImZldGNoIiwidGhlbiIsInJlc3BvbnNlIiwianNvbiIsImV4dGVuZCIsIndhcm11cCIsImNhdGNoIiwiY29uc29sZSIsImVycm9yIiwiZSIsIndhcm11cFEiLCJhcmdzIiwic2V0VGltZW91dCIsIk9iamVjdCIsImtleXMiLCJwb3AiXSwibWFwcGluZ3MiOiI7Ozs7OztBQUFBLElBQU1BLFlBQVksSUFBSUMsU0FBSixDQUFjLHFCQUFkLENBQWxCOztBQUVBRCxVQUFVRSxNQUFWLEdBQW1CLFVBQUNDLEdBQUQsRUFBUztZQUNoQkMsR0FBUixDQUFZLDBCQUFaO0NBREo7QUFHQUosVUFBVUssU0FBVixHQUFzQixVQUFDRixHQUFELEVBQVM7UUFDdkJBLElBQUlHLElBQUosS0FBYSxhQUFqQixFQUFnQztpQkFDbkJDLE1BQVQ7S0FESixNQUVPO2dCQUNLSCxHQUFSLENBQWEsMENBQTBDRCxJQUFJRyxJQUEzRDs7Q0FKUjtBQU9BTixVQUFVUSxPQUFWLEdBQW9CLFVBQUNMLEdBQUQsRUFBUztZQUNqQkMsR0FBUixDQUFZLDRCQUFaO0NBREo7O0FDWkE7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7O0FBb0JBLFVBQWMsR0FBRyxTQUFTLE1BQU0sQ0FBQyxDQUFDLEVBQUUsQ0FBQyxFQUFFOzs7SUFHbkMsSUFBSSxDQUFDLElBQUksSUFBSSxJQUFJLENBQUMsSUFBSSxJQUFJLEVBQUU7UUFDeEIsT0FBTyxDQUFDLENBQUM7S0FDWjs7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
