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

var cache = {};

var resolveExports = function resolveExports(file) {

    if (cache[file]) {
        return cache[file];
    }

    var definedModule = require.defined[file];

    if (definedModule) {
        var localRequire = createLocalRequire(file);
        var module = cache[file] = { exports: {} };

        definedModule.call(module.exports, module.exports, localRequire, module);

        return module;
    }

    return null;
};

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

    var error = new Error('Cannot find module "' + key + '" from "' + parent + '"');
    error.code = 'MODULE_NOT_FOUND';
    throw error;
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

var createLocalRequire = function createLocalRequire(parent) {
    return function (key) {
        return window.require(key, parent);
    };
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
        var exclude = require.ids;

        var headers = { 'Content-Type': 'application/json' };
        var body = JSON.stringify({ entry: entry, exclude: exclude });
        var config = Object.assign({ method: 'POST', headers: headers, body: body }, options);
        return window.fetch(url, config).then(function (response) {
            return response.json();
        }).then(function (_ref) {
            var browserMap = _ref.browserMap,
                conflictMap = _ref.conflictMap,
                modules = _ref.modules;

            require.browserMap = extend(require.browserMap, browserMap);
            require.conflictMap = extend(require.conflictMap, conflictMap);
            evalModules(modules);
        }).catch(function (e) {
            return console.error(e);
        });
    };

    window.require = require;

    if (modules) evalModules(modules);
};



// Inspired by:
// https://github.com/efacilitation/commonjs-require

enableBrowserRequire();

})));
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZGV2ZWxvcG1lbnQuanMiLCJzb3VyY2VzIjpbIi4uLy4uL2Rldi9pbmRleC5qcyIsIi4uLy4uLy4uL25vZGVfbW9kdWxlcy9vYmplY3QtZXh0ZW5kL2xpYi9leHRlbmQuanMiLCIuLi8uLi8uLi9ub2RlX21vZHVsZXMvcm9sbHVwLXBsdWdpbi1ub2RlLWJ1aWx0aW5zL3NyYy9lczYvcGF0aC5qcyIsIi4uLy4uLy4uL25vZGVfbW9kdWxlcy9wYXRoLWJyb3dzZXJpZnkvaW5kZXguanMiLCIuLi8uLi8uLi9oZWxwZXIvcGF0aC9pbmRleC5qcyIsIi4uLy4uLy4uL2hlbHBlci9yZXNvbHZlL2luZGV4LmpzIiwiLi4vLi4vcmVxdWlyZS9saWIvbW9kdWxlLmpzIiwiLi4vLi4vcmVxdWlyZS9saWIvaW5kZXguanMiLCIuLi9zcmMvZGV2ZWxvcG1lbnQuanMiXSwic291cmNlc0NvbnRlbnQiOlsiY29uc3Qgd2ViU29ja2V0ID0gbmV3IFdlYlNvY2tldCgnd3M6Ly9sb2NhbGhvc3Q6OTM5MycpXG5cbndlYlNvY2tldC5vbm9wZW4gPSAoZXZ0KSA9PiB7XG4gICAgY29uc29sZS5sb2coJ0V0aGljYWwgRGV2IFNvY2tldCBPcGVuIScpXG59XG53ZWJTb2NrZXQub25tZXNzYWdlID0gKGV2dCkgPT4ge1xuICAgIGlmIChldnQuZGF0YSA9PT0gJ1NFUlZFUl9TVE9QJykge1xuICAgICAgICBsb2NhdGlvbi5yZWxvYWQoKVxuICAgIH0gZWxzZSB7XG4gICAgICAgIGNvbnNvbGUubG9nKCAnRXRoaWNhbCBEZXYgU29ja2V0IFJlY2VpdmVkIE1lc3NhZ2U6ICcgKyBldnQuZGF0YSlcbiAgICB9XG59XG53ZWJTb2NrZXQub25jbG9zZSA9IChldnQpID0+IHtcbiAgICBjb25zb2xlLmxvZygnRXRoaWNhbCBEZXYgU29ja2V0IENsb3NlZC4nKVxufVxuIiwiLyohXG4gKiBvYmplY3QtZXh0ZW5kXG4gKiBBIHdlbGwtdGVzdGVkIGZ1bmN0aW9uIHRvIGRlZXAgZXh0ZW5kIChvciBtZXJnZSkgSmF2YVNjcmlwdCBvYmplY3RzIHdpdGhvdXQgZnVydGhlciBkZXBlbmRlbmNpZXMuXG4gKlxuICogaHR0cDovL2dpdGh1Yi5jb20vYmVybmhhcmR3XG4gKlxuICogQ29weXJpZ2h0IDIwMTMsIEJlcm5oYXJkIFdhbmdlciA8bWFpbEBiZXJuaGFyZHdhbmdlci5jb20+XG4gKiBSZWxlYXNlZCB1bmRlciB0aGUgTUlUIGxpY2Vuc2UuXG4gKlxuICogRGF0ZTogMjAxMy0wNC0xMFxuICovXG5cblxuLyoqXG4gKiBFeHRlbmQgb2JqZWN0IGEgd2l0aCBvYmplY3QgYi5cbiAqXG4gKiBAcGFyYW0ge09iamVjdH0gYSBTb3VyY2Ugb2JqZWN0LlxuICogQHBhcmFtIHtPYmplY3R9IGIgT2JqZWN0IHRvIGV4dGVuZCB3aXRoLlxuICogQHJldHVybnMge09iamVjdH0gYSBFeHRlbmRlZCBvYmplY3QuXG4gKi9cbm1vZHVsZS5leHBvcnRzID0gZnVuY3Rpb24gZXh0ZW5kKGEsIGIpIHtcblxuICAgIC8vIERvbid0IHRvdWNoICdudWxsJyBvciAndW5kZWZpbmVkJyBvYmplY3RzLlxuICAgIGlmIChhID09IG51bGwgfHwgYiA9PSBudWxsKSB7XG4gICAgICAgIHJldHVybiBhO1xuICAgIH1cblxuICAgIC8vIFRPRE86IFJlZmFjdG9yIHRvIHVzZSBmb3ItbG9vcCBmb3IgcGVyZm9ybWFuY2UgcmVhc29ucy5cbiAgICBPYmplY3Qua2V5cyhiKS5mb3JFYWNoKGZ1bmN0aW9uIChrZXkpIHtcblxuICAgICAgICAvLyBEZXRlY3Qgb2JqZWN0IHdpdGhvdXQgYXJyYXksIGRhdGUgb3IgbnVsbC5cbiAgICAgICAgLy8gVE9ETzogUGVyZm9ybWFuY2UgdGVzdDpcbiAgICAgICAgLy8gYSkgYi5jb25zdHJ1Y3RvciA9PT0gT2JqZWN0LnByb3RvdHlwZS5jb25zdHJ1Y3RvclxuICAgICAgICAvLyBiKSBPYmplY3QucHJvdG90eXBlLnRvU3RyaW5nLmNhbGwoYikgPT0gJ1tvYmplY3QgT2JqZWN0XSdcbiAgICAgICAgaWYgKE9iamVjdC5wcm90b3R5cGUudG9TdHJpbmcuY2FsbChiW2tleV0pID09ICdbb2JqZWN0IE9iamVjdF0nKSB7XG4gICAgICAgICAgICBpZiAoT2JqZWN0LnByb3RvdHlwZS50b1N0cmluZy5jYWxsKGFba2V5XSkgIT0gJ1tvYmplY3QgT2JqZWN0XScpIHtcbiAgICAgICAgICAgICAgICBhW2tleV0gPSBiW2tleV07XG4gICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgIGFba2V5XSA9IGV4dGVuZChhW2tleV0sIGJba2V5XSk7XG4gICAgICAgICAgICB9XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICBhW2tleV0gPSBiW2tleV07XG4gICAgICAgIH1cblxuICAgIH0pO1xuXG4gICAgcmV0dXJuIGE7XG5cbn07IiwiLy8gQ29weXJpZ2h0IEpveWVudCwgSW5jLiBhbmQgb3RoZXIgTm9kZSBjb250cmlidXRvcnMuXG4vL1xuLy8gUGVybWlzc2lvbiBpcyBoZXJlYnkgZ3JhbnRlZCwgZnJlZSBvZiBjaGFyZ2UsIHRvIGFueSBwZXJzb24gb2J0YWluaW5nIGFcbi8vIGNvcHkgb2YgdGhpcyBzb2Z0d2FyZSBhbmQgYXNzb2NpYXRlZCBkb2N1bWVudGF0aW9uIGZpbGVzICh0aGVcbi8vIFwiU29mdHdhcmVcIiksIHRvIGRlYWwgaW4gdGhlIFNvZnR3YXJlIHdpdGhvdXQgcmVzdHJpY3Rpb24sIGluY2x1ZGluZ1xuLy8gd2l0aG91dCBsaW1pdGF0aW9uIHRoZSByaWdodHMgdG8gdXNlLCBjb3B5LCBtb2RpZnksIG1lcmdlLCBwdWJsaXNoLFxuLy8gZGlzdHJpYnV0ZSwgc3VibGljZW5zZSwgYW5kL29yIHNlbGwgY29waWVzIG9mIHRoZSBTb2Z0d2FyZSwgYW5kIHRvIHBlcm1pdFxuLy8gcGVyc29ucyB0byB3aG9tIHRoZSBTb2Z0d2FyZSBpcyBmdXJuaXNoZWQgdG8gZG8gc28sIHN1YmplY3QgdG8gdGhlXG4vLyBmb2xsb3dpbmcgY29uZGl0aW9uczpcbi8vXG4vLyBUaGUgYWJvdmUgY29weXJpZ2h0IG5vdGljZSBhbmQgdGhpcyBwZXJtaXNzaW9uIG5vdGljZSBzaGFsbCBiZSBpbmNsdWRlZFxuLy8gaW4gYWxsIGNvcGllcyBvciBzdWJzdGFudGlhbCBwb3J0aW9ucyBvZiB0aGUgU29mdHdhcmUuXG4vL1xuLy8gVEhFIFNPRlRXQVJFIElTIFBST1ZJREVEIFwiQVMgSVNcIiwgV0lUSE9VVCBXQVJSQU5UWSBPRiBBTlkgS0lORCwgRVhQUkVTU1xuLy8gT1IgSU1QTElFRCwgSU5DTFVESU5HIEJVVCBOT1QgTElNSVRFRCBUTyBUSEUgV0FSUkFOVElFUyBPRlxuLy8gTUVSQ0hBTlRBQklMSVRZLCBGSVRORVNTIEZPUiBBIFBBUlRJQ1VMQVIgUFVSUE9TRSBBTkQgTk9OSU5GUklOR0VNRU5ULiBJTlxuLy8gTk8gRVZFTlQgU0hBTEwgVEhFIEFVVEhPUlMgT1IgQ09QWVJJR0hUIEhPTERFUlMgQkUgTElBQkxFIEZPUiBBTlkgQ0xBSU0sXG4vLyBEQU1BR0VTIE9SIE9USEVSIExJQUJJTElUWSwgV0hFVEhFUiBJTiBBTiBBQ1RJT04gT0YgQ09OVFJBQ1QsIFRPUlQgT1Jcbi8vIE9USEVSV0lTRSwgQVJJU0lORyBGUk9NLCBPVVQgT0YgT1IgSU4gQ09OTkVDVElPTiBXSVRIIFRIRSBTT0ZUV0FSRSBPUiBUSEVcbi8vIFVTRSBPUiBPVEhFUiBERUFMSU5HUyBJTiBUSEUgU09GVFdBUkUuXG5cbi8vIHJlc29sdmVzIC4gYW5kIC4uIGVsZW1lbnRzIGluIGEgcGF0aCBhcnJheSB3aXRoIGRpcmVjdG9yeSBuYW1lcyB0aGVyZVxuLy8gbXVzdCBiZSBubyBzbGFzaGVzLCBlbXB0eSBlbGVtZW50cywgb3IgZGV2aWNlIG5hbWVzIChjOlxcKSBpbiB0aGUgYXJyYXlcbi8vIChzbyBhbHNvIG5vIGxlYWRpbmcgYW5kIHRyYWlsaW5nIHNsYXNoZXMgLSBpdCBkb2VzIG5vdCBkaXN0aW5ndWlzaFxuLy8gcmVsYXRpdmUgYW5kIGFic29sdXRlIHBhdGhzKVxuZnVuY3Rpb24gbm9ybWFsaXplQXJyYXkocGFydHMsIGFsbG93QWJvdmVSb290KSB7XG4gIC8vIGlmIHRoZSBwYXRoIHRyaWVzIHRvIGdvIGFib3ZlIHRoZSByb290LCBgdXBgIGVuZHMgdXAgPiAwXG4gIHZhciB1cCA9IDA7XG4gIGZvciAodmFyIGkgPSBwYXJ0cy5sZW5ndGggLSAxOyBpID49IDA7IGktLSkge1xuICAgIHZhciBsYXN0ID0gcGFydHNbaV07XG4gICAgaWYgKGxhc3QgPT09ICcuJykge1xuICAgICAgcGFydHMuc3BsaWNlKGksIDEpO1xuICAgIH0gZWxzZSBpZiAobGFzdCA9PT0gJy4uJykge1xuICAgICAgcGFydHMuc3BsaWNlKGksIDEpO1xuICAgICAgdXArKztcbiAgICB9IGVsc2UgaWYgKHVwKSB7XG4gICAgICBwYXJ0cy5zcGxpY2UoaSwgMSk7XG4gICAgICB1cC0tO1xuICAgIH1cbiAgfVxuXG4gIC8vIGlmIHRoZSBwYXRoIGlzIGFsbG93ZWQgdG8gZ28gYWJvdmUgdGhlIHJvb3QsIHJlc3RvcmUgbGVhZGluZyAuLnNcbiAgaWYgKGFsbG93QWJvdmVSb290KSB7XG4gICAgZm9yICg7IHVwLS07IHVwKSB7XG4gICAgICBwYXJ0cy51bnNoaWZ0KCcuLicpO1xuICAgIH1cbiAgfVxuXG4gIHJldHVybiBwYXJ0cztcbn1cblxuLy8gU3BsaXQgYSBmaWxlbmFtZSBpbnRvIFtyb290LCBkaXIsIGJhc2VuYW1lLCBleHRdLCB1bml4IHZlcnNpb25cbi8vICdyb290JyBpcyBqdXN0IGEgc2xhc2gsIG9yIG5vdGhpbmcuXG52YXIgc3BsaXRQYXRoUmUgPVxuICAgIC9eKFxcLz98KShbXFxzXFxTXSo/KSgoPzpcXC57MSwyfXxbXlxcL10rP3wpKFxcLlteLlxcL10qfCkpKD86W1xcL10qKSQvO1xudmFyIHNwbGl0UGF0aCA9IGZ1bmN0aW9uKGZpbGVuYW1lKSB7XG4gIHJldHVybiBzcGxpdFBhdGhSZS5leGVjKGZpbGVuYW1lKS5zbGljZSgxKTtcbn07XG5cbi8vIHBhdGgucmVzb2x2ZShbZnJvbSAuLi5dLCB0bylcbi8vIHBvc2l4IHZlcnNpb25cbmV4cG9ydCBmdW5jdGlvbiByZXNvbHZlKCkge1xuICB2YXIgcmVzb2x2ZWRQYXRoID0gJycsXG4gICAgICByZXNvbHZlZEFic29sdXRlID0gZmFsc2U7XG5cbiAgZm9yICh2YXIgaSA9IGFyZ3VtZW50cy5sZW5ndGggLSAxOyBpID49IC0xICYmICFyZXNvbHZlZEFic29sdXRlOyBpLS0pIHtcbiAgICB2YXIgcGF0aCA9IChpID49IDApID8gYXJndW1lbnRzW2ldIDogJy8nO1xuXG4gICAgLy8gU2tpcCBlbXB0eSBhbmQgaW52YWxpZCBlbnRyaWVzXG4gICAgaWYgKHR5cGVvZiBwYXRoICE9PSAnc3RyaW5nJykge1xuICAgICAgdGhyb3cgbmV3IFR5cGVFcnJvcignQXJndW1lbnRzIHRvIHBhdGgucmVzb2x2ZSBtdXN0IGJlIHN0cmluZ3MnKTtcbiAgICB9IGVsc2UgaWYgKCFwYXRoKSB7XG4gICAgICBjb250aW51ZTtcbiAgICB9XG5cbiAgICByZXNvbHZlZFBhdGggPSBwYXRoICsgJy8nICsgcmVzb2x2ZWRQYXRoO1xuICAgIHJlc29sdmVkQWJzb2x1dGUgPSBwYXRoLmNoYXJBdCgwKSA9PT0gJy8nO1xuICB9XG5cbiAgLy8gQXQgdGhpcyBwb2ludCB0aGUgcGF0aCBzaG91bGQgYmUgcmVzb2x2ZWQgdG8gYSBmdWxsIGFic29sdXRlIHBhdGgsIGJ1dFxuICAvLyBoYW5kbGUgcmVsYXRpdmUgcGF0aHMgdG8gYmUgc2FmZSAobWlnaHQgaGFwcGVuIHdoZW4gcHJvY2Vzcy5jd2QoKSBmYWlscylcblxuICAvLyBOb3JtYWxpemUgdGhlIHBhdGhcbiAgcmVzb2x2ZWRQYXRoID0gbm9ybWFsaXplQXJyYXkoZmlsdGVyKHJlc29sdmVkUGF0aC5zcGxpdCgnLycpLCBmdW5jdGlvbihwKSB7XG4gICAgcmV0dXJuICEhcDtcbiAgfSksICFyZXNvbHZlZEFic29sdXRlKS5qb2luKCcvJyk7XG5cbiAgcmV0dXJuICgocmVzb2x2ZWRBYnNvbHV0ZSA/ICcvJyA6ICcnKSArIHJlc29sdmVkUGF0aCkgfHwgJy4nO1xufTtcblxuLy8gcGF0aC5ub3JtYWxpemUocGF0aClcbi8vIHBvc2l4IHZlcnNpb25cbmV4cG9ydCBmdW5jdGlvbiBub3JtYWxpemUocGF0aCkge1xuICB2YXIgaXNQYXRoQWJzb2x1dGUgPSBpc0Fic29sdXRlKHBhdGgpLFxuICAgICAgdHJhaWxpbmdTbGFzaCA9IHN1YnN0cihwYXRoLCAtMSkgPT09ICcvJztcblxuICAvLyBOb3JtYWxpemUgdGhlIHBhdGhcbiAgcGF0aCA9IG5vcm1hbGl6ZUFycmF5KGZpbHRlcihwYXRoLnNwbGl0KCcvJyksIGZ1bmN0aW9uKHApIHtcbiAgICByZXR1cm4gISFwO1xuICB9KSwgIWlzUGF0aEFic29sdXRlKS5qb2luKCcvJyk7XG5cbiAgaWYgKCFwYXRoICYmICFpc1BhdGhBYnNvbHV0ZSkge1xuICAgIHBhdGggPSAnLic7XG4gIH1cbiAgaWYgKHBhdGggJiYgdHJhaWxpbmdTbGFzaCkge1xuICAgIHBhdGggKz0gJy8nO1xuICB9XG5cbiAgcmV0dXJuIChpc1BhdGhBYnNvbHV0ZSA/ICcvJyA6ICcnKSArIHBhdGg7XG59O1xuXG4vLyBwb3NpeCB2ZXJzaW9uXG5leHBvcnQgZnVuY3Rpb24gaXNBYnNvbHV0ZShwYXRoKSB7XG4gIHJldHVybiBwYXRoLmNoYXJBdCgwKSA9PT0gJy8nO1xufVxuXG4vLyBwb3NpeCB2ZXJzaW9uXG5leHBvcnQgZnVuY3Rpb24gam9pbigpIHtcbiAgdmFyIHBhdGhzID0gQXJyYXkucHJvdG90eXBlLnNsaWNlLmNhbGwoYXJndW1lbnRzLCAwKTtcbiAgcmV0dXJuIG5vcm1hbGl6ZShmaWx0ZXIocGF0aHMsIGZ1bmN0aW9uKHAsIGluZGV4KSB7XG4gICAgaWYgKHR5cGVvZiBwICE9PSAnc3RyaW5nJykge1xuICAgICAgdGhyb3cgbmV3IFR5cGVFcnJvcignQXJndW1lbnRzIHRvIHBhdGguam9pbiBtdXN0IGJlIHN0cmluZ3MnKTtcbiAgICB9XG4gICAgcmV0dXJuIHA7XG4gIH0pLmpvaW4oJy8nKSk7XG59XG5cblxuLy8gcGF0aC5yZWxhdGl2ZShmcm9tLCB0bylcbi8vIHBvc2l4IHZlcnNpb25cbmV4cG9ydCBmdW5jdGlvbiByZWxhdGl2ZShmcm9tLCB0bykge1xuICBmcm9tID0gcmVzb2x2ZShmcm9tKS5zdWJzdHIoMSk7XG4gIHRvID0gcmVzb2x2ZSh0bykuc3Vic3RyKDEpO1xuXG4gIGZ1bmN0aW9uIHRyaW0oYXJyKSB7XG4gICAgdmFyIHN0YXJ0ID0gMDtcbiAgICBmb3IgKDsgc3RhcnQgPCBhcnIubGVuZ3RoOyBzdGFydCsrKSB7XG4gICAgICBpZiAoYXJyW3N0YXJ0XSAhPT0gJycpIGJyZWFrO1xuICAgIH1cblxuICAgIHZhciBlbmQgPSBhcnIubGVuZ3RoIC0gMTtcbiAgICBmb3IgKDsgZW5kID49IDA7IGVuZC0tKSB7XG4gICAgICBpZiAoYXJyW2VuZF0gIT09ICcnKSBicmVhaztcbiAgICB9XG5cbiAgICBpZiAoc3RhcnQgPiBlbmQpIHJldHVybiBbXTtcbiAgICByZXR1cm4gYXJyLnNsaWNlKHN0YXJ0LCBlbmQgLSBzdGFydCArIDEpO1xuICB9XG5cbiAgdmFyIGZyb21QYXJ0cyA9IHRyaW0oZnJvbS5zcGxpdCgnLycpKTtcbiAgdmFyIHRvUGFydHMgPSB0cmltKHRvLnNwbGl0KCcvJykpO1xuXG4gIHZhciBsZW5ndGggPSBNYXRoLm1pbihmcm9tUGFydHMubGVuZ3RoLCB0b1BhcnRzLmxlbmd0aCk7XG4gIHZhciBzYW1lUGFydHNMZW5ndGggPSBsZW5ndGg7XG4gIGZvciAodmFyIGkgPSAwOyBpIDwgbGVuZ3RoOyBpKyspIHtcbiAgICBpZiAoZnJvbVBhcnRzW2ldICE9PSB0b1BhcnRzW2ldKSB7XG4gICAgICBzYW1lUGFydHNMZW5ndGggPSBpO1xuICAgICAgYnJlYWs7XG4gICAgfVxuICB9XG5cbiAgdmFyIG91dHB1dFBhcnRzID0gW107XG4gIGZvciAodmFyIGkgPSBzYW1lUGFydHNMZW5ndGg7IGkgPCBmcm9tUGFydHMubGVuZ3RoOyBpKyspIHtcbiAgICBvdXRwdXRQYXJ0cy5wdXNoKCcuLicpO1xuICB9XG5cbiAgb3V0cHV0UGFydHMgPSBvdXRwdXRQYXJ0cy5jb25jYXQodG9QYXJ0cy5zbGljZShzYW1lUGFydHNMZW5ndGgpKTtcblxuICByZXR1cm4gb3V0cHV0UGFydHMuam9pbignLycpO1xufVxuXG5leHBvcnQgdmFyIHNlcCA9ICcvJztcbmV4cG9ydCB2YXIgZGVsaW1pdGVyID0gJzonO1xuXG5leHBvcnQgZnVuY3Rpb24gZGlybmFtZShwYXRoKSB7XG4gIHZhciByZXN1bHQgPSBzcGxpdFBhdGgocGF0aCksXG4gICAgICByb290ID0gcmVzdWx0WzBdLFxuICAgICAgZGlyID0gcmVzdWx0WzFdO1xuXG4gIGlmICghcm9vdCAmJiAhZGlyKSB7XG4gICAgLy8gTm8gZGlybmFtZSB3aGF0c29ldmVyXG4gICAgcmV0dXJuICcuJztcbiAgfVxuXG4gIGlmIChkaXIpIHtcbiAgICAvLyBJdCBoYXMgYSBkaXJuYW1lLCBzdHJpcCB0cmFpbGluZyBzbGFzaFxuICAgIGRpciA9IGRpci5zdWJzdHIoMCwgZGlyLmxlbmd0aCAtIDEpO1xuICB9XG5cbiAgcmV0dXJuIHJvb3QgKyBkaXI7XG59XG5cbmV4cG9ydCBmdW5jdGlvbiBiYXNlbmFtZShwYXRoLCBleHQpIHtcbiAgdmFyIGYgPSBzcGxpdFBhdGgocGF0aClbMl07XG4gIC8vIFRPRE86IG1ha2UgdGhpcyBjb21wYXJpc29uIGNhc2UtaW5zZW5zaXRpdmUgb24gd2luZG93cz9cbiAgaWYgKGV4dCAmJiBmLnN1YnN0cigtMSAqIGV4dC5sZW5ndGgpID09PSBleHQpIHtcbiAgICBmID0gZi5zdWJzdHIoMCwgZi5sZW5ndGggLSBleHQubGVuZ3RoKTtcbiAgfVxuICByZXR1cm4gZjtcbn1cblxuXG5leHBvcnQgZnVuY3Rpb24gZXh0bmFtZShwYXRoKSB7XG4gIHJldHVybiBzcGxpdFBhdGgocGF0aClbM107XG59XG5leHBvcnQgZGVmYXVsdCB7XG4gIGV4dG5hbWU6IGV4dG5hbWUsXG4gIGJhc2VuYW1lOiBiYXNlbmFtZSxcbiAgZGlybmFtZTogZGlybmFtZSxcbiAgc2VwOiBzZXAsXG4gIGRlbGltaXRlcjogZGVsaW1pdGVyLFxuICByZWxhdGl2ZTogcmVsYXRpdmUsXG4gIGpvaW46IGpvaW4sXG4gIGlzQWJzb2x1dGU6IGlzQWJzb2x1dGUsXG4gIG5vcm1hbGl6ZTogbm9ybWFsaXplLFxuICByZXNvbHZlOiByZXNvbHZlXG59O1xuZnVuY3Rpb24gZmlsdGVyICh4cywgZikge1xuICAgIGlmICh4cy5maWx0ZXIpIHJldHVybiB4cy5maWx0ZXIoZik7XG4gICAgdmFyIHJlcyA9IFtdO1xuICAgIGZvciAodmFyIGkgPSAwOyBpIDwgeHMubGVuZ3RoOyBpKyspIHtcbiAgICAgICAgaWYgKGYoeHNbaV0sIGksIHhzKSkgcmVzLnB1c2goeHNbaV0pO1xuICAgIH1cbiAgICByZXR1cm4gcmVzO1xufVxuXG4vLyBTdHJpbmcucHJvdG90eXBlLnN1YnN0ciAtIG5lZ2F0aXZlIGluZGV4IGRvbid0IHdvcmsgaW4gSUU4XG52YXIgc3Vic3RyID0gJ2FiJy5zdWJzdHIoLTEpID09PSAnYicgP1xuICAgIGZ1bmN0aW9uIChzdHIsIHN0YXJ0LCBsZW4pIHsgcmV0dXJuIHN0ci5zdWJzdHIoc3RhcnQsIGxlbikgfSA6XG4gICAgZnVuY3Rpb24gKHN0ciwgc3RhcnQsIGxlbikge1xuICAgICAgICBpZiAoc3RhcnQgPCAwKSBzdGFydCA9IHN0ci5sZW5ndGggKyBzdGFydDtcbiAgICAgICAgcmV0dXJuIHN0ci5zdWJzdHIoc3RhcnQsIGxlbik7XG4gICAgfVxuO1xuIiwiLy8gQ29weXJpZ2h0IEpveWVudCwgSW5jLiBhbmQgb3RoZXIgTm9kZSBjb250cmlidXRvcnMuXG4vL1xuLy8gUGVybWlzc2lvbiBpcyBoZXJlYnkgZ3JhbnRlZCwgZnJlZSBvZiBjaGFyZ2UsIHRvIGFueSBwZXJzb24gb2J0YWluaW5nIGFcbi8vIGNvcHkgb2YgdGhpcyBzb2Z0d2FyZSBhbmQgYXNzb2NpYXRlZCBkb2N1bWVudGF0aW9uIGZpbGVzICh0aGVcbi8vIFwiU29mdHdhcmVcIiksIHRvIGRlYWwgaW4gdGhlIFNvZnR3YXJlIHdpdGhvdXQgcmVzdHJpY3Rpb24sIGluY2x1ZGluZ1xuLy8gd2l0aG91dCBsaW1pdGF0aW9uIHRoZSByaWdodHMgdG8gdXNlLCBjb3B5LCBtb2RpZnksIG1lcmdlLCBwdWJsaXNoLFxuLy8gZGlzdHJpYnV0ZSwgc3VibGljZW5zZSwgYW5kL29yIHNlbGwgY29waWVzIG9mIHRoZSBTb2Z0d2FyZSwgYW5kIHRvIHBlcm1pdFxuLy8gcGVyc29ucyB0byB3aG9tIHRoZSBTb2Z0d2FyZSBpcyBmdXJuaXNoZWQgdG8gZG8gc28sIHN1YmplY3QgdG8gdGhlXG4vLyBmb2xsb3dpbmcgY29uZGl0aW9uczpcbi8vXG4vLyBUaGUgYWJvdmUgY29weXJpZ2h0IG5vdGljZSBhbmQgdGhpcyBwZXJtaXNzaW9uIG5vdGljZSBzaGFsbCBiZSBpbmNsdWRlZFxuLy8gaW4gYWxsIGNvcGllcyBvciBzdWJzdGFudGlhbCBwb3J0aW9ucyBvZiB0aGUgU29mdHdhcmUuXG4vL1xuLy8gVEhFIFNPRlRXQVJFIElTIFBST1ZJREVEIFwiQVMgSVNcIiwgV0lUSE9VVCBXQVJSQU5UWSBPRiBBTlkgS0lORCwgRVhQUkVTU1xuLy8gT1IgSU1QTElFRCwgSU5DTFVESU5HIEJVVCBOT1QgTElNSVRFRCBUTyBUSEUgV0FSUkFOVElFUyBPRlxuLy8gTUVSQ0hBTlRBQklMSVRZLCBGSVRORVNTIEZPUiBBIFBBUlRJQ1VMQVIgUFVSUE9TRSBBTkQgTk9OSU5GUklOR0VNRU5ULiBJTlxuLy8gTk8gRVZFTlQgU0hBTEwgVEhFIEFVVEhPUlMgT1IgQ09QWVJJR0hUIEhPTERFUlMgQkUgTElBQkxFIEZPUiBBTlkgQ0xBSU0sXG4vLyBEQU1BR0VTIE9SIE9USEVSIExJQUJJTElUWSwgV0hFVEhFUiBJTiBBTiBBQ1RJT04gT0YgQ09OVFJBQ1QsIFRPUlQgT1Jcbi8vIE9USEVSV0lTRSwgQVJJU0lORyBGUk9NLCBPVVQgT0YgT1IgSU4gQ09OTkVDVElPTiBXSVRIIFRIRSBTT0ZUV0FSRSBPUiBUSEVcbi8vIFVTRSBPUiBPVEhFUiBERUFMSU5HUyBJTiBUSEUgU09GVFdBUkUuXG5cbi8vIHJlc29sdmVzIC4gYW5kIC4uIGVsZW1lbnRzIGluIGEgcGF0aCBhcnJheSB3aXRoIGRpcmVjdG9yeSBuYW1lcyB0aGVyZVxuLy8gbXVzdCBiZSBubyBzbGFzaGVzLCBlbXB0eSBlbGVtZW50cywgb3IgZGV2aWNlIG5hbWVzIChjOlxcKSBpbiB0aGUgYXJyYXlcbi8vIChzbyBhbHNvIG5vIGxlYWRpbmcgYW5kIHRyYWlsaW5nIHNsYXNoZXMgLSBpdCBkb2VzIG5vdCBkaXN0aW5ndWlzaFxuLy8gcmVsYXRpdmUgYW5kIGFic29sdXRlIHBhdGhzKVxuZnVuY3Rpb24gbm9ybWFsaXplQXJyYXkocGFydHMsIGFsbG93QWJvdmVSb290KSB7XG4gIC8vIGlmIHRoZSBwYXRoIHRyaWVzIHRvIGdvIGFib3ZlIHRoZSByb290LCBgdXBgIGVuZHMgdXAgPiAwXG4gIHZhciB1cCA9IDA7XG4gIGZvciAodmFyIGkgPSBwYXJ0cy5sZW5ndGggLSAxOyBpID49IDA7IGktLSkge1xuICAgIHZhciBsYXN0ID0gcGFydHNbaV07XG4gICAgaWYgKGxhc3QgPT09ICcuJykge1xuICAgICAgcGFydHMuc3BsaWNlKGksIDEpO1xuICAgIH0gZWxzZSBpZiAobGFzdCA9PT0gJy4uJykge1xuICAgICAgcGFydHMuc3BsaWNlKGksIDEpO1xuICAgICAgdXArKztcbiAgICB9IGVsc2UgaWYgKHVwKSB7XG4gICAgICBwYXJ0cy5zcGxpY2UoaSwgMSk7XG4gICAgICB1cC0tO1xuICAgIH1cbiAgfVxuXG4gIC8vIGlmIHRoZSBwYXRoIGlzIGFsbG93ZWQgdG8gZ28gYWJvdmUgdGhlIHJvb3QsIHJlc3RvcmUgbGVhZGluZyAuLnNcbiAgaWYgKGFsbG93QWJvdmVSb290KSB7XG4gICAgZm9yICg7IHVwLS07IHVwKSB7XG4gICAgICBwYXJ0cy51bnNoaWZ0KCcuLicpO1xuICAgIH1cbiAgfVxuXG4gIHJldHVybiBwYXJ0cztcbn1cblxuLy8gU3BsaXQgYSBmaWxlbmFtZSBpbnRvIFtyb290LCBkaXIsIGJhc2VuYW1lLCBleHRdLCB1bml4IHZlcnNpb25cbi8vICdyb290JyBpcyBqdXN0IGEgc2xhc2gsIG9yIG5vdGhpbmcuXG52YXIgc3BsaXRQYXRoUmUgPVxuICAgIC9eKFxcLz98KShbXFxzXFxTXSo/KSgoPzpcXC57MSwyfXxbXlxcL10rP3wpKFxcLlteLlxcL10qfCkpKD86W1xcL10qKSQvO1xudmFyIHNwbGl0UGF0aCA9IGZ1bmN0aW9uKGZpbGVuYW1lKSB7XG4gIHJldHVybiBzcGxpdFBhdGhSZS5leGVjKGZpbGVuYW1lKS5zbGljZSgxKTtcbn07XG5cbi8vIHBhdGgucmVzb2x2ZShbZnJvbSAuLi5dLCB0bylcbi8vIHBvc2l4IHZlcnNpb25cbmV4cG9ydHMucmVzb2x2ZSA9IGZ1bmN0aW9uKCkge1xuICB2YXIgcmVzb2x2ZWRQYXRoID0gJycsXG4gICAgICByZXNvbHZlZEFic29sdXRlID0gZmFsc2U7XG5cbiAgZm9yICh2YXIgaSA9IGFyZ3VtZW50cy5sZW5ndGggLSAxOyBpID49IC0xICYmICFyZXNvbHZlZEFic29sdXRlOyBpLS0pIHtcbiAgICB2YXIgcGF0aCA9IChpID49IDApID8gYXJndW1lbnRzW2ldIDogcHJvY2Vzcy5jd2QoKTtcblxuICAgIC8vIFNraXAgZW1wdHkgYW5kIGludmFsaWQgZW50cmllc1xuICAgIGlmICh0eXBlb2YgcGF0aCAhPT0gJ3N0cmluZycpIHtcbiAgICAgIHRocm93IG5ldyBUeXBlRXJyb3IoJ0FyZ3VtZW50cyB0byBwYXRoLnJlc29sdmUgbXVzdCBiZSBzdHJpbmdzJyk7XG4gICAgfSBlbHNlIGlmICghcGF0aCkge1xuICAgICAgY29udGludWU7XG4gICAgfVxuXG4gICAgcmVzb2x2ZWRQYXRoID0gcGF0aCArICcvJyArIHJlc29sdmVkUGF0aDtcbiAgICByZXNvbHZlZEFic29sdXRlID0gcGF0aC5jaGFyQXQoMCkgPT09ICcvJztcbiAgfVxuXG4gIC8vIEF0IHRoaXMgcG9pbnQgdGhlIHBhdGggc2hvdWxkIGJlIHJlc29sdmVkIHRvIGEgZnVsbCBhYnNvbHV0ZSBwYXRoLCBidXRcbiAgLy8gaGFuZGxlIHJlbGF0aXZlIHBhdGhzIHRvIGJlIHNhZmUgKG1pZ2h0IGhhcHBlbiB3aGVuIHByb2Nlc3MuY3dkKCkgZmFpbHMpXG5cbiAgLy8gTm9ybWFsaXplIHRoZSBwYXRoXG4gIHJlc29sdmVkUGF0aCA9IG5vcm1hbGl6ZUFycmF5KGZpbHRlcihyZXNvbHZlZFBhdGguc3BsaXQoJy8nKSwgZnVuY3Rpb24ocCkge1xuICAgIHJldHVybiAhIXA7XG4gIH0pLCAhcmVzb2x2ZWRBYnNvbHV0ZSkuam9pbignLycpO1xuXG4gIHJldHVybiAoKHJlc29sdmVkQWJzb2x1dGUgPyAnLycgOiAnJykgKyByZXNvbHZlZFBhdGgpIHx8ICcuJztcbn07XG5cbi8vIHBhdGgubm9ybWFsaXplKHBhdGgpXG4vLyBwb3NpeCB2ZXJzaW9uXG5leHBvcnRzLm5vcm1hbGl6ZSA9IGZ1bmN0aW9uKHBhdGgpIHtcbiAgdmFyIGlzQWJzb2x1dGUgPSBleHBvcnRzLmlzQWJzb2x1dGUocGF0aCksXG4gICAgICB0cmFpbGluZ1NsYXNoID0gc3Vic3RyKHBhdGgsIC0xKSA9PT0gJy8nO1xuXG4gIC8vIE5vcm1hbGl6ZSB0aGUgcGF0aFxuICBwYXRoID0gbm9ybWFsaXplQXJyYXkoZmlsdGVyKHBhdGguc3BsaXQoJy8nKSwgZnVuY3Rpb24ocCkge1xuICAgIHJldHVybiAhIXA7XG4gIH0pLCAhaXNBYnNvbHV0ZSkuam9pbignLycpO1xuXG4gIGlmICghcGF0aCAmJiAhaXNBYnNvbHV0ZSkge1xuICAgIHBhdGggPSAnLic7XG4gIH1cbiAgaWYgKHBhdGggJiYgdHJhaWxpbmdTbGFzaCkge1xuICAgIHBhdGggKz0gJy8nO1xuICB9XG5cbiAgcmV0dXJuIChpc0Fic29sdXRlID8gJy8nIDogJycpICsgcGF0aDtcbn07XG5cbi8vIHBvc2l4IHZlcnNpb25cbmV4cG9ydHMuaXNBYnNvbHV0ZSA9IGZ1bmN0aW9uKHBhdGgpIHtcbiAgcmV0dXJuIHBhdGguY2hhckF0KDApID09PSAnLyc7XG59O1xuXG4vLyBwb3NpeCB2ZXJzaW9uXG5leHBvcnRzLmpvaW4gPSBmdW5jdGlvbigpIHtcbiAgdmFyIHBhdGhzID0gQXJyYXkucHJvdG90eXBlLnNsaWNlLmNhbGwoYXJndW1lbnRzLCAwKTtcbiAgcmV0dXJuIGV4cG9ydHMubm9ybWFsaXplKGZpbHRlcihwYXRocywgZnVuY3Rpb24ocCwgaW5kZXgpIHtcbiAgICBpZiAodHlwZW9mIHAgIT09ICdzdHJpbmcnKSB7XG4gICAgICB0aHJvdyBuZXcgVHlwZUVycm9yKCdBcmd1bWVudHMgdG8gcGF0aC5qb2luIG11c3QgYmUgc3RyaW5ncycpO1xuICAgIH1cbiAgICByZXR1cm4gcDtcbiAgfSkuam9pbignLycpKTtcbn07XG5cblxuLy8gcGF0aC5yZWxhdGl2ZShmcm9tLCB0bylcbi8vIHBvc2l4IHZlcnNpb25cbmV4cG9ydHMucmVsYXRpdmUgPSBmdW5jdGlvbihmcm9tLCB0bykge1xuICBmcm9tID0gZXhwb3J0cy5yZXNvbHZlKGZyb20pLnN1YnN0cigxKTtcbiAgdG8gPSBleHBvcnRzLnJlc29sdmUodG8pLnN1YnN0cigxKTtcblxuICBmdW5jdGlvbiB0cmltKGFycikge1xuICAgIHZhciBzdGFydCA9IDA7XG4gICAgZm9yICg7IHN0YXJ0IDwgYXJyLmxlbmd0aDsgc3RhcnQrKykge1xuICAgICAgaWYgKGFycltzdGFydF0gIT09ICcnKSBicmVhaztcbiAgICB9XG5cbiAgICB2YXIgZW5kID0gYXJyLmxlbmd0aCAtIDE7XG4gICAgZm9yICg7IGVuZCA+PSAwOyBlbmQtLSkge1xuICAgICAgaWYgKGFycltlbmRdICE9PSAnJykgYnJlYWs7XG4gICAgfVxuXG4gICAgaWYgKHN0YXJ0ID4gZW5kKSByZXR1cm4gW107XG4gICAgcmV0dXJuIGFyci5zbGljZShzdGFydCwgZW5kIC0gc3RhcnQgKyAxKTtcbiAgfVxuXG4gIHZhciBmcm9tUGFydHMgPSB0cmltKGZyb20uc3BsaXQoJy8nKSk7XG4gIHZhciB0b1BhcnRzID0gdHJpbSh0by5zcGxpdCgnLycpKTtcblxuICB2YXIgbGVuZ3RoID0gTWF0aC5taW4oZnJvbVBhcnRzLmxlbmd0aCwgdG9QYXJ0cy5sZW5ndGgpO1xuICB2YXIgc2FtZVBhcnRzTGVuZ3RoID0gbGVuZ3RoO1xuICBmb3IgKHZhciBpID0gMDsgaSA8IGxlbmd0aDsgaSsrKSB7XG4gICAgaWYgKGZyb21QYXJ0c1tpXSAhPT0gdG9QYXJ0c1tpXSkge1xuICAgICAgc2FtZVBhcnRzTGVuZ3RoID0gaTtcbiAgICAgIGJyZWFrO1xuICAgIH1cbiAgfVxuXG4gIHZhciBvdXRwdXRQYXJ0cyA9IFtdO1xuICBmb3IgKHZhciBpID0gc2FtZVBhcnRzTGVuZ3RoOyBpIDwgZnJvbVBhcnRzLmxlbmd0aDsgaSsrKSB7XG4gICAgb3V0cHV0UGFydHMucHVzaCgnLi4nKTtcbiAgfVxuXG4gIG91dHB1dFBhcnRzID0gb3V0cHV0UGFydHMuY29uY2F0KHRvUGFydHMuc2xpY2Uoc2FtZVBhcnRzTGVuZ3RoKSk7XG5cbiAgcmV0dXJuIG91dHB1dFBhcnRzLmpvaW4oJy8nKTtcbn07XG5cbmV4cG9ydHMuc2VwID0gJy8nO1xuZXhwb3J0cy5kZWxpbWl0ZXIgPSAnOic7XG5cbmV4cG9ydHMuZGlybmFtZSA9IGZ1bmN0aW9uKHBhdGgpIHtcbiAgdmFyIHJlc3VsdCA9IHNwbGl0UGF0aChwYXRoKSxcbiAgICAgIHJvb3QgPSByZXN1bHRbMF0sXG4gICAgICBkaXIgPSByZXN1bHRbMV07XG5cbiAgaWYgKCFyb290ICYmICFkaXIpIHtcbiAgICAvLyBObyBkaXJuYW1lIHdoYXRzb2V2ZXJcbiAgICByZXR1cm4gJy4nO1xuICB9XG5cbiAgaWYgKGRpcikge1xuICAgIC8vIEl0IGhhcyBhIGRpcm5hbWUsIHN0cmlwIHRyYWlsaW5nIHNsYXNoXG4gICAgZGlyID0gZGlyLnN1YnN0cigwLCBkaXIubGVuZ3RoIC0gMSk7XG4gIH1cblxuICByZXR1cm4gcm9vdCArIGRpcjtcbn07XG5cblxuZXhwb3J0cy5iYXNlbmFtZSA9IGZ1bmN0aW9uKHBhdGgsIGV4dCkge1xuICB2YXIgZiA9IHNwbGl0UGF0aChwYXRoKVsyXTtcbiAgLy8gVE9ETzogbWFrZSB0aGlzIGNvbXBhcmlzb24gY2FzZS1pbnNlbnNpdGl2ZSBvbiB3aW5kb3dzP1xuICBpZiAoZXh0ICYmIGYuc3Vic3RyKC0xICogZXh0Lmxlbmd0aCkgPT09IGV4dCkge1xuICAgIGYgPSBmLnN1YnN0cigwLCBmLmxlbmd0aCAtIGV4dC5sZW5ndGgpO1xuICB9XG4gIHJldHVybiBmO1xufTtcblxuXG5leHBvcnRzLmV4dG5hbWUgPSBmdW5jdGlvbihwYXRoKSB7XG4gIHJldHVybiBzcGxpdFBhdGgocGF0aClbM107XG59O1xuXG5mdW5jdGlvbiBmaWx0ZXIgKHhzLCBmKSB7XG4gICAgaWYgKHhzLmZpbHRlcikgcmV0dXJuIHhzLmZpbHRlcihmKTtcbiAgICB2YXIgcmVzID0gW107XG4gICAgZm9yICh2YXIgaSA9IDA7IGkgPCB4cy5sZW5ndGg7IGkrKykge1xuICAgICAgICBpZiAoZih4c1tpXSwgaSwgeHMpKSByZXMucHVzaCh4c1tpXSk7XG4gICAgfVxuICAgIHJldHVybiByZXM7XG59XG5cbi8vIFN0cmluZy5wcm90b3R5cGUuc3Vic3RyIC0gbmVnYXRpdmUgaW5kZXggZG9uJ3Qgd29yayBpbiBJRThcbnZhciBzdWJzdHIgPSAnYWInLnN1YnN0cigtMSkgPT09ICdiJ1xuICAgID8gZnVuY3Rpb24gKHN0ciwgc3RhcnQsIGxlbikgeyByZXR1cm4gc3RyLnN1YnN0cihzdGFydCwgbGVuKSB9XG4gICAgOiBmdW5jdGlvbiAoc3RyLCBzdGFydCwgbGVuKSB7XG4gICAgICAgIGlmIChzdGFydCA8IDApIHN0YXJ0ID0gc3RyLmxlbmd0aCArIHN0YXJ0O1xuICAgICAgICByZXR1cm4gc3RyLnN1YnN0cihzdGFydCwgbGVuKTtcbiAgICB9XG47XG4iLCJjb25zdCB7IGpvaW4sIGJhc2VuYW1lIH0gPSByZXF1aXJlKCdwYXRoLWJyb3dzZXJpZnknKVxuXG5jb25zdCBpc0ZpbGUgPSAocGF0aCkgPT4gKCBiYXNlbmFtZShwYXRoKS5pbmNsdWRlcygnLicpIClcblxuY29uc3QgcmVzb2x2ZURlc3RQYXRoID0gKHBhdGgsIGRlc3QsIGJhc2UpID0+IHtcbiAgICBpZiAodHlwZW9mIGRlc3QgIT09ICdzdHJpbmcnKSByZXR1cm4gYWJzb2x1dGUocGF0aClcbiAgICBpZiAoaXNGaWxlKGRlc3QpKSByZXR1cm4gYWJzb2x1dGUoZGVzdClcbiAgICByZXR1cm4gam9pbihhYnNvbHV0ZShkZXN0KSwgYWJzb2x1dGUocGF0aCkucmVwbGFjZShhYnNvbHV0ZShiYXNlKSwgJycpKVxufVxuXG5jb25zdCBpc1JlbGF0aXZlID0gKHBhdGgpID0+IHtcbiAgICBpZiAocGF0aC5jaGFyQXQoMCkgPT09ICcuJyAmJiAoXG4gICAgICAgIHBhdGguY2hhckF0KDEpID09PSAnLicgfHwgcGF0aC5jaGFyQXQoMSkgPT09ICcvJykpXG4gICAgICAgIHJldHVybiB0cnVlXG4gICAgcmV0dXJuIGZhbHNlXG59XG5cbmNvbnN0IGlzQWJzb2x1dGUgPSAocGF0aCkgPT4ge1xuICAgIGlmIChwYXRoLmNoYXJBdCgwKSA9PT0gJy8nKSByZXR1cm4gdHJ1ZVxuICAgIHJldHVybiBmYWxzZVxufVxuXG5jb25zdCBhYnNvbHV0ZSA9IChwYXRoKSA9PiB7XG4gICAgaWYgKGlzQWJzb2x1dGUocGF0aCkpIHJldHVybiBwYXRoXG4gICAgcmV0dXJuIGpvaW4oZ2V0Um9vdFBhdGgoKSwgcGF0aClcbn1cblxuY29uc3QgcmVsYXRpdmUgPSAocGF0aCkgPT4ge1xuICAgIGlmICghaXNBYnNvbHV0ZShwYXRoKSkgcmV0dXJuIHBhdGhcbiAgICByZXR1cm4gcGF0aC5yZXBsYWNlKGdldFJvb3RQYXRoKCkgKyAnLycgLCAnJylcbn1cblxuY29uc3QgZ2V0Um9vdFBhdGggPSAoKSA9PiAoXG4gICAgKGdsb2JhbC5ldGhpY2FsICYmIGdsb2JhbC5ldGhpY2FsLmN3ZCkgfHwgcHJvY2Vzcy5jd2QoKVxuKVxuXG5leHBvcnRzLmlzRmlsZSA9IGlzRmlsZVxuZXhwb3J0cy5yZXNvbHZlRGVzdFBhdGggPSByZXNvbHZlRGVzdFBhdGhcbmV4cG9ydHMuaXNSZWxhdGl2ZSA9IGlzUmVsYXRpdmVcbmV4cG9ydHMuaXNBYnNvbHV0ZSA9IGlzQWJzb2x1dGVcbmV4cG9ydHMuYWJzb2x1dGUgPSBhYnNvbHV0ZVxuZXhwb3J0cy5yZWxhdGl2ZSA9IHJlbGF0aXZlXG5leHBvcnRzLmdldFJvb3RQYXRoID0gZ2V0Um9vdFBhdGhcbiIsImNvbnN0IGlzTm9kZSA9IHJlcXVpcmUoJy4uLy4uL2hlbHBlci9pcy1ub2RlJylcbmNvbnN0IHsgaXNSZWxhdGl2ZSwgaXNBYnNvbHV0ZSwgZ2V0Um9vdFBhdGggfSA9IHJlcXVpcmUoJy4uLy4uL2hlbHBlci9wYXRoJylcbmNvbnN0IHsgam9pbiB9ID0gcmVxdWlyZSgncGF0aC1icm93c2VyaWZ5JylcblxuY29uc3QgZXh0ZW5zaW9ucyA9IFsnanMnLCAnanNvbicsICdub2RlJ11cblxuY29uc3QgZ2V0QXBwUHJlZml4ID0gKG1vZHVsZU5hbWUpID0+ICcmJ1xuXG5jb25zdCBpc0FwcE1vZHVsZSA9IChtb2R1bGVOYW1lKSA9PiAoXG4gICAgbW9kdWxlTmFtZS5jaGFyQXQoMCkgPT09IGdldEFwcFByZWZpeCgpXG4pXG5cbmNvbnN0IGlzUGFja2FnZSA9IChuYW1lKSA9PiB7XG4gICAgaWYgKGlzUmVsYXRpdmUobmFtZSkgfHwgaXNBYnNvbHV0ZShuYW1lKSkgcmV0dXJuIGZhbHNlXG4gICAgcmV0dXJuIHRydWVcbn1cblxuY29uc3QgaXNBYnNvbHV0ZVBhY2thZ2UgPSAobmFtZSkgPT4ge1xuICAgIGlmIChpc1BhY2thZ2UobmFtZSkgJiYgbmFtZS5pbmRleE9mKCcvJykgPT09IC0xKVxuICAgICAgICByZXR1cm4gdHJ1ZVxuICAgIHJldHVybiBmYWxzZVxufVxuXG5jb25zdCBpc1JlbGF0aXZlUGFja2FnZSA9IChuYW1lKSA9PiB7XG4gICAgaWYgKG5hbWUuaW5kZXhPZignLycpID4gLTEgJiYgaXNQYWNrYWdlKG5hbWUpKSByZXR1cm4gdHJ1ZVxuICAgIHJldHVybiBmYWxzZVxufVxuXG5jb25zdCBhcHBlbmRFeHRlbnNpb24gPSAobmFtZSwgZXh0ZW5zaW9uID0gJ2pzJykgPT4ge1xuICAgIGlmIChpc0Fic29sdXRlUGFja2FnZShuYW1lKSkgcmV0dXJuIG5hbWVcbiAgICBjb25zdCBleHQgPSAnLicgKyBleHRlbnNpb25cbiAgICBpZiAobmFtZS5zbGljZSgtKGV4dC5sZW5ndGgpKSA9PT0gZXh0KSByZXR1cm4gbmFtZVxuICAgIHJldHVybiBuYW1lICsgZXh0XG59XG5cbmNvbnN0IGdldFJlcXVpcmUgPSAoKSA9PiB7XG4gICAgaWYgKGlzTm9kZSgpKSByZXR1cm4gcmVxdWlyZVxuICAgIHJldHVybiB3aW5kb3cucmVxdWlyZVxufVxuXG5jb25zdCByZXNvbHZlQXBwTW9kdWxlID0gKG1vZHVsZSkgPT4ge1xuICAgIGlmIChpc0FwcE1vZHVsZShtb2R1bGUpKSB7XG4gICAgICAgIHJldHVybiBqb2luKGdldFJvb3RQYXRoKCksIG1vZHVsZS5yZXBsYWNlKGdldEFwcFByZWZpeCgpLCAnJykpXG4gICAgfVxuICAgIGlmIChpc1JlbGF0aXZlKG1vZHVsZSkpIHJldHVybiBqb2luKGdldFJvb3RQYXRoKCksIG1vZHVsZSlcbiAgICByZXR1cm4gbW9kdWxlXG59XG5cbmNvbnN0IHJlcXVpcmVNb2R1bGUgPSAobmFtZSkgPT4ge1xuICAgIGNvbnN0IHBhdGggPSAoIGlzTm9kZSgpID8gcmVzb2x2ZUFwcE1vZHVsZShuYW1lKSA6IG5hbWUgKVxuICAgIHJldHVybiBnZXRSZXF1aXJlKCkocGF0aClcbn1cblxuZXhwb3J0cy5leHRlbnNpb25zID0gZXh0ZW5zaW9uc1xuZXhwb3J0cy5nZXRBcHBQcmVmaXggPSBnZXRBcHBQcmVmaXhcbmV4cG9ydHMuaXNBcHBNb2R1bGUgPSBpc0FwcE1vZHVsZVxuZXhwb3J0cy5pc1BhY2thZ2UgPSBpc1BhY2thZ2VcbmV4cG9ydHMuaXNBYnNvbHV0ZVBhY2thZ2UgPSBpc0Fic29sdXRlUGFja2FnZVxuZXhwb3J0cy5pc1JlbGF0aXZlUGFja2FnZSA9IGlzUmVsYXRpdmVQYWNrYWdlXG5leHBvcnRzLmFwcGVuZEV4dGVuc2lvbiA9IGFwcGVuZEV4dGVuc2lvblxuZXhwb3J0cy5nZXRSZXF1aXJlID0gZ2V0UmVxdWlyZVxuZXhwb3J0cy5yZXNvbHZlQXBwTW9kdWxlID0gcmVzb2x2ZUFwcE1vZHVsZVxuZXhwb3J0cy5yZXF1aXJlTW9kdWxlID0gcmVxdWlyZU1vZHVsZVxuIiwiaW1wb3J0IHsgam9pbiwgcmVzb2x2ZSwgZGlybmFtZSB9IGZyb20gJ3BhdGgnXG5pbXBvcnQge1xuICAgIGlzUGFja2FnZSxcbiAgICBpc0Fic29sdXRlUGFja2FnZSxcbiAgICBhcHBlbmRFeHRlbnNpb24sXG4gICAgZ2V0QXBwUHJlZml4LFxuICAgIGV4dGVuc2lvbnNcbn0gZnJvbSAnLi4vLi4vLi4vaGVscGVyL3Jlc29sdmUnXG5cbmNvbnN0IGNhY2hlID0ge31cblxuY29uc3QgcmVzb2x2ZUV4cG9ydHMgPSAoZmlsZSkgPT4ge1xuXG4gICAgaWYgKGNhY2hlW2ZpbGVdKSB7XG4gICAgICAgIHJldHVybiBjYWNoZVtmaWxlXVxuICAgIH1cblxuICAgIGNvbnN0IGRlZmluZWRNb2R1bGUgPSByZXF1aXJlLmRlZmluZWRbZmlsZV1cblxuICAgIGlmIChkZWZpbmVkTW9kdWxlKSB7XG4gICAgICAgIGNvbnN0IGxvY2FsUmVxdWlyZSA9IGNyZWF0ZUxvY2FsUmVxdWlyZShmaWxlKVxuICAgICAgICBjb25zdCBtb2R1bGUgPSBjYWNoZVtmaWxlXSA9IHsgZXhwb3J0czoge30gfVxuXG4gICAgICAgIGRlZmluZWRNb2R1bGUuY2FsbChtb2R1bGUuZXhwb3J0cywgbW9kdWxlLmV4cG9ydHMsIGxvY2FsUmVxdWlyZSwgbW9kdWxlKVxuXG4gICAgICAgIHJldHVybiBtb2R1bGVcbiAgICB9XG5cbiAgICByZXR1cm4gbnVsbFxufVxuXG5jb25zdCBsb2FkID0gKHJlcXVlc3QsIHBhcmVudCA9IGdldEFwcFByZWZpeCgpKSA9PiB7XG4gICAgY29uc3QgcmVxdWlyZSA9IHdpbmRvdy5yZXF1aXJlXG4gICAgY29uc3QgbWFwSUQgPSBnZXRNb2R1bGVSb290KHBhcmVudClcbiAgICBjb25zdCByZW1hcHBlZCA9IHJlcXVlc3RNYXAocmVxdWlyZS5icm93c2VyTWFwLCByZXF1ZXN0LCBtYXBJRClcbiAgICBjb25zdCBjb25mbGljdGVkID0gcmVxdWVzdE1hcChyZXF1aXJlLmNvbmZsaWN0TWFwLCByZW1hcHBlZCwgbWFwSUQpXG4gICAgY29uc3Qga2V5ID0gcmVzb2x2ZUZpbGVuYW1lKGNvbmZsaWN0ZWQsIHBhcmVudClcblxuICAgIGZvciAobGV0IGkgPSAwOyBpIDwgZXh0ZW5zaW9ucy5sZW5ndGg7IGkrKykge1xuICAgICAgICBjb25zdCBmaWxlID0gYXBwZW5kRXh0ZW5zaW9uKGtleSwgZXh0ZW5zaW9uc1tpXSlcbiAgICAgICAgY29uc3QgbW9kdWxlID0gcmVzb2x2ZUV4cG9ydHMoZmlsZSlcbiAgICAgICAgaWYgKG1vZHVsZSkge1xuICAgICAgICAgICAgcmV0dXJuIG1vZHVsZS5leHBvcnRzXG4gICAgICAgIH1cbiAgICB9XG5cbiAgICBmb3IgKGxldCBpID0gMDsgaSA8IGV4dGVuc2lvbnMubGVuZ3RoOyBpKyspIHtcbiAgICAgICAgY29uc3QgZmlsZSA9IGFwcGVuZEV4dGVuc2lvbihqb2luKGtleSwgJ2luZGV4JyksIGV4dGVuc2lvbnNbaV0pXG4gICAgICAgIGNvbnN0IG1vZHVsZSA9IHJlc29sdmVFeHBvcnRzKGZpbGUpXG4gICAgICAgIGlmIChtb2R1bGUpIHtcbiAgICAgICAgICAgIHJldHVybiBtb2R1bGUuZXhwb3J0c1xuICAgICAgICB9XG4gICAgfVxuXG4gICAgY29uc3QgZXJyb3IgPSBuZXcgRXJyb3IoYENhbm5vdCBmaW5kIG1vZHVsZSBcIiR7a2V5fVwiIGZyb20gXCIke3BhcmVudH1cImApXG4gICAgZXJyb3IuY29kZSA9ICdNT0RVTEVfTk9UX0ZPVU5EJ1xuICAgIHRocm93IGVycm9yXG59XG5cbmNvbnN0IHJlcXVlc3RNYXAgPSAobWFwLCByZXF1ZXN0LCBpZCkgPT4ge1xuICAgIGNvbnN0IG1hcHBlZCA9IG1hcFtpZF0gJiYgbWFwW2lkXVtyZXF1ZXN0XVxuICAgIHJldHVybiBtYXBwZWQgfHwgcmVxdWVzdFxufVxuXG5jb25zdCBnZXRNb2R1bGVSb290ID0gKHBhdGgpID0+IHtcbiAgICBjb25zdCBub2RlTW9kdWxlcyA9ICdub2RlX21vZHVsZXMnXG4gICAgY29uc3QgcGFydHMgPSBwYXRoLnNwbGl0KCcvJylcbiAgICBjb25zdCBpbmRleCA9IHBhcnRzLmxhc3RJbmRleE9mKG5vZGVNb2R1bGVzKVxuICAgIGlmIChpbmRleCA9PT0gLTEpIHtcbiAgICAgICAgcmV0dXJuIHBhcnRzWzBdXG4gICAgfVxuICAgIHJldHVybiBwYXJ0cy5zbGljZSgwLCBpbmRleCArIDIpLmpvaW4oJy8nKVxufVxuXG5jb25zdCByZXNvbHZlRmlsZW5hbWUgPSAoa2V5LCBwYXJlbnQpID0+IHtcbiAgICBpZiAoaXNBYnNvbHV0ZVBhY2thZ2Uoa2V5KSkge1xuICAgICAgICByZXR1cm4ga2V5XG4gICAgfVxuXG4gICAgaWYgKGlzUGFja2FnZShrZXkpKSB7XG4gICAgICAgIHJldHVybiBrZXlcbiAgICB9XG5cbiAgICBjb25zdCB7IGFsaWFzIH0gPSB3aW5kb3cucmVxdWlyZVxuICAgIGNvbnN0IHBhcmVudEFsaWFzID0gKGFsaWFzW3BhcmVudF0gPyBhbGlhc1twYXJlbnRdIDogcGFyZW50KVxuICAgIGNvbnN0IHBhcmVudEZpbGUgPSBhcHBlbmRFeHRlbnNpb24ocGFyZW50QWxpYXMpXG4gICAgY29uc3QgZGlyZWN0b3J5ID0gZGlybmFtZShwYXJlbnRGaWxlKVxuXG4gICAgcmV0dXJuIGpvaW4oZGlyZWN0b3J5LCBrZXkpXG59XG5cbmV4cG9ydCB7IGxvYWQgfVxuXG5jb25zdCBjcmVhdGVMb2NhbFJlcXVpcmUgPSBwYXJlbnQgPT4ga2V5ID0+IHdpbmRvdy5yZXF1aXJlKGtleSwgcGFyZW50KVxuIiwiaW1wb3J0IGV4dGVuZCBmcm9tICdvYmplY3QtZXh0ZW5kJ1xuaW1wb3J0ICogYXMgTW9kdWxlIGZyb20gJy4vbW9kdWxlLmpzJ1xuXG5jb25zdCBldmFsTW9kdWxlcyA9IChtb2R1bGVzKSA9PiB7XG4gICAgbW9kdWxlcy5mb3JFYWNoKG1vZHVsZSA9PiB7XG4gICAgICAgIGNvbnN0IHJlcXVpcmUgPSB3aW5kb3cucmVxdWlyZVxuICAgICAgICBjb25zdCB7IGlkLCBrZXksIGFsaWFzLCBzb3VyY2UgfSA9IG1vZHVsZVxuXG4gICAgICAgIHJlcXVpcmUuZGVmaW5lU291cmNlKGtleSwgc291cmNlKVxuICAgICAgICByZXF1aXJlLmlkcy5wdXNoKGlkKVxuXG4gICAgICAgIGlmIChhbGlhcykgcmVxdWlyZS5hbGlhc1trZXldID0gYWxpYXNcbiAgICB9KVxufVxuXG5jb25zdCBlbmFibGVCcm93c2VyUmVxdWlyZSA9IChtb2R1bGVzKSA9PiB7XG5cbiAgICBjb25zdCByZXF1aXJlID0gKHJlcXVlc3QsIGxvYWRlclBhdGgpID0+ICggTW9kdWxlLmxvYWQocmVxdWVzdCwgbG9hZGVyUGF0aCkgKVxuXG4gICAgcmVxdWlyZS5kZWZpbmVkID0ge31cbiAgICByZXF1aXJlLmlkcyA9IFtdXG4gICAgcmVxdWlyZS5hbGlhcyA9IHt9XG4gICAgcmVxdWlyZS5icm93c2VyTWFwID0ge31cbiAgICByZXF1aXJlLmNvbmZsaWN0TWFwID0ge31cbiAgICByZXF1aXJlLmRlZmluZSA9IChtb2R1bGUsIGZuKSA9PiByZXF1aXJlLmRlZmluZWRbbW9kdWxlXSA9IGZuXG4gICAgcmVxdWlyZS5kZWZpbmVTb3VyY2UgPSAoa2V5LCBzb3VyY2UpID0+IHtcbiAgICAgICAgY29uc3Qgd3JhcHBlZE1vZHVsZSA9IGV2YWwoXG4gICAgICAgICAgICAnKGZ1bmN0aW9uKGV4cG9ydHMscmVxdWlyZSxtb2R1bGUpeycgK1xuICAgICAgICAgICAgICAgIChzb3VyY2UgKyAnXFxuJykgK1xuICAgICAgICAgICAgJ30pLmJpbmQod2luZG93KSdcbiAgICAgICAgKVxuICAgICAgICByZXF1aXJlLmRlZmluZShrZXksIHdyYXBwZWRNb2R1bGUpXG4gICAgfVxuICAgIHJlcXVpcmUubG9hZCA9IChlbnRyeSwgb3B0aW9ucyA9IHt9KSA9PiB7XG5cbiAgICAgICAgY29uc3QgeyB1cmwgPSAnbW9kdWxlJyB9ID0gb3B0aW9uc1xuICAgICAgICBjb25zdCB7IGlkczogZXhjbHVkZSB9ID0gcmVxdWlyZVxuICAgICAgICBjb25zdCBoZWFkZXJzID0geyAnQ29udGVudC1UeXBlJzogJ2FwcGxpY2F0aW9uL2pzb24nIH1cbiAgICAgICAgY29uc3QgYm9keSA9IEpTT04uc3RyaW5naWZ5KHsgZW50cnksIGV4Y2x1ZGUgfSlcbiAgICAgICAgY29uc3QgY29uZmlnID0geyBtZXRob2Q6ICdQT1NUJywgaGVhZGVycywgYm9keSwgLi4ub3B0aW9ucyB9XG4gICAgICAgIHJldHVybiAoXG4gICAgICAgICAgICB3aW5kb3cuZmV0Y2godXJsLCBjb25maWcpXG4gICAgICAgICAgICAudGhlbihyZXNwb25zZSA9PiByZXNwb25zZS5qc29uKCkpXG4gICAgICAgICAgICAudGhlbigoeyBicm93c2VyTWFwLCBjb25mbGljdE1hcCwgbW9kdWxlcyB9KSA9PiB7XG4gICAgICAgICAgICAgICAgcmVxdWlyZS5icm93c2VyTWFwID0gZXh0ZW5kKHJlcXVpcmUuYnJvd3Nlck1hcCwgYnJvd3Nlck1hcClcbiAgICAgICAgICAgICAgICByZXF1aXJlLmNvbmZsaWN0TWFwID0gZXh0ZW5kKHJlcXVpcmUuY29uZmxpY3RNYXAsIGNvbmZsaWN0TWFwKVxuICAgICAgICAgICAgICAgIGV2YWxNb2R1bGVzKG1vZHVsZXMpXG4gICAgICAgICAgICB9KVxuICAgICAgICAgICAgLmNhdGNoKGUgPT4gY29uc29sZS5lcnJvcihlKSlcbiAgICAgICAgKVxuICAgIH1cblxuICAgIHdpbmRvdy5yZXF1aXJlID0gcmVxdWlyZVxuXG4gICAgaWYgKG1vZHVsZXMpIGV2YWxNb2R1bGVzKG1vZHVsZXMpXG59XG5cbmV4cG9ydCBkZWZhdWx0IGVuYWJsZUJyb3dzZXJSZXF1aXJlXG5cbi8vIEluc3BpcmVkIGJ5OlxuLy8gaHR0cHM6Ly9naXRodWIuY29tL2VmYWNpbGl0YXRpb24vY29tbW9uanMtcmVxdWlyZVxuIiwiaW1wb3J0ICcuLi8uLi9kZXYnXG5pbXBvcnQgZW5hYmxlQnJvd3NlclJlcXVpcmUgZnJvbSAnLi4vLi4vcmVxdWlyZSdcbmVuYWJsZUJyb3dzZXJSZXF1aXJlKClcbiJdLCJuYW1lcyI6WyJ3ZWJTb2NrZXQiLCJXZWJTb2NrZXQiLCJvbm9wZW4iLCJldnQiLCJsb2ciLCJvbm1lc3NhZ2UiLCJkYXRhIiwicmVsb2FkIiwib25jbG9zZSIsImpvaW4iLCJiYXNlbmFtZSIsImlzRmlsZSIsInBhdGgiLCJpbmNsdWRlcyIsInJlc29sdmVEZXN0UGF0aCIsImRlc3QiLCJiYXNlIiwiYWJzb2x1dGUiLCJyZXBsYWNlIiwiaXNSZWxhdGl2ZSIsImNoYXJBdCIsImlzQWJzb2x1dGUiLCJnZXRSb290UGF0aCIsInJlbGF0aXZlIiwiZ2xvYmFsIiwiZXRoaWNhbCIsImN3ZCIsInByb2Nlc3MiLCJleHBvcnRzIiwiZXh0ZW5zaW9ucyIsImdldEFwcFByZWZpeCIsIm1vZHVsZU5hbWUiLCJpc1BhY2thZ2UiLCJuYW1lIiwiaXNBYnNvbHV0ZVBhY2thZ2UiLCJpbmRleE9mIiwiYXBwZW5kRXh0ZW5zaW9uIiwiZXh0ZW5zaW9uIiwiZXh0Iiwic2xpY2UiLCJsZW5ndGgiLCJjYWNoZSIsInJlc29sdmVFeHBvcnRzIiwiZmlsZSIsImRlZmluZWRNb2R1bGUiLCJyZXF1aXJlIiwiZGVmaW5lZCIsImxvY2FsUmVxdWlyZSIsImNyZWF0ZUxvY2FsUmVxdWlyZSIsIm1vZHVsZSIsImNhbGwiLCJsb2FkIiwicmVxdWVzdCIsInBhcmVudCIsIndpbmRvdyIsIm1hcElEIiwiZ2V0TW9kdWxlUm9vdCIsInJlbWFwcGVkIiwicmVxdWVzdE1hcCIsImJyb3dzZXJNYXAiLCJjb25mbGljdGVkIiwiY29uZmxpY3RNYXAiLCJrZXkiLCJyZXNvbHZlRmlsZW5hbWUiLCJpIiwiZXJyb3IiLCJFcnJvciIsImNvZGUiLCJtYXAiLCJpZCIsIm1hcHBlZCIsIm5vZGVNb2R1bGVzIiwicGFydHMiLCJzcGxpdCIsImluZGV4IiwibGFzdEluZGV4T2YiLCJhbGlhcyIsInBhcmVudEFsaWFzIiwicGFyZW50RmlsZSIsImRpcmVjdG9yeSIsImRpcm5hbWUiLCJldmFsTW9kdWxlcyIsIm1vZHVsZXMiLCJmb3JFYWNoIiwic291cmNlIiwiZGVmaW5lU291cmNlIiwiaWRzIiwicHVzaCIsImVuYWJsZUJyb3dzZXJSZXF1aXJlIiwibG9hZGVyUGF0aCIsIk1vZHVsZSIsImRlZmluZSIsImZuIiwid3JhcHBlZE1vZHVsZSIsImV2YWwiLCJlbnRyeSIsIm9wdGlvbnMiLCJ1cmwiLCJleGNsdWRlIiwiaGVhZGVycyIsImJvZHkiLCJKU09OIiwic3RyaW5naWZ5IiwiY29uZmlnIiwibWV0aG9kIiwiZmV0Y2giLCJ0aGVuIiwicmVzcG9uc2UiLCJqc29uIiwiZXh0ZW5kIiwiY2F0Y2giLCJjb25zb2xlIiwiZSJdLCJtYXBwaW5ncyI6Ijs7Ozs7O0FBQUEsSUFBTUEsWUFBWSxJQUFJQyxTQUFKLENBQWMscUJBQWQsQ0FBbEI7O0FBRUFELFVBQVVFLE1BQVYsR0FBbUIsVUFBQ0MsR0FBRCxFQUFTO1lBQ2hCQyxHQUFSLENBQVksMEJBQVo7Q0FESjtBQUdBSixVQUFVSyxTQUFWLEdBQXNCLFVBQUNGLEdBQUQsRUFBUztRQUN2QkEsSUFBSUcsSUFBSixLQUFhLGFBQWpCLEVBQWdDO2lCQUNuQkMsTUFBVDtLQURKLE1BRU87Z0JBQ0tILEdBQVIsQ0FBYSwwQ0FBMENELElBQUlHLElBQTNEOztDQUpSO0FBT0FOLFVBQVVRLE9BQVYsR0FBb0IsVUFBQ0wsR0FBRCxFQUFTO1lBQ2pCQyxHQUFSLENBQVksNEJBQVo7Q0FESjs7QUNaQTs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7QUFvQkEsVUFBYyxHQUFHLFNBQVMsTUFBTSxDQUFDLENBQUMsRUFBRSxDQUFDLEVBQUU7OztJQUduQyxJQUFJLENBQUMsSUFBSSxJQUFJLElBQUksQ0FBQyxJQUFJLElBQUksRUFBRTtRQUN4QixPQUFPLENBQUMsQ0FBQztLQUNaOzs7SUFHRCxNQUFNLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQyxDQUFDLE9BQU8sQ0FBQyxVQUFVLEdBQUcsRUFBRTs7Ozs7O1FBTWxDLElBQUksTUFBTSxDQUFDLFNBQVMsQ0FBQyxRQUFRLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQyxHQUFHLENBQUMsQ0FBQyxJQUFJLGlCQUFpQixFQUFFO1lBQzdELElBQUksTUFBTSxDQUFDLFNBQVMsQ0FBQyxRQUFRLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQyxHQUFHLENBQUMsQ0FBQyxJQUFJLGlCQUFpQixFQUFFO2dCQUM3RCxDQUFDLENBQUMsR0FBRyxDQUFDLEdBQUcsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxDQUFDO2FBQ25CLE1BQU07Z0JBQ0gsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxHQUFHLE1BQU0sQ0FBQyxDQUFDLENBQUMsR0FBRyxDQUFDLEVBQUUsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUM7YUFDbkM7U0FDSixNQUFNO1lBQ0gsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxHQUFHLENBQUMsQ0FBQyxHQUFHLENBQUMsQ0FBQztTQUNuQjs7S0FFSixDQUFDLENBQUM7O0lBRUgsT0FBTyxDQUFDLENBQUM7O0NBRVo7O0FDaEREOzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7O0FBeUJBLFNBQVMsY0FBYyxDQUFDLEtBQUssRUFBRSxjQUFjLEVBQUU7O0VBRTdDLElBQUksRUFBRSxHQUFHLENBQUMsQ0FBQztFQUNYLEtBQUssSUFBSSxDQUFDLEdBQUcsS0FBSyxDQUFDLE1BQU0sR0FBRyxDQUFDLEVBQUUsQ0FBQyxJQUFJLENBQUMsRUFBRSxDQUFDLEVBQUUsRUFBRTtJQUMxQyxJQUFJLElBQUksR0FBRyxLQUFLLENBQUMsQ0FBQyxDQUFDLENBQUM7SUFDcEIsSUFBSSxJQUFJLEtBQUssR0FBRyxFQUFFO01BQ2hCLEtBQUssQ0FBQyxNQUFNLENBQUMsQ0FBQyxFQUFFLENBQUMsQ0FBQyxDQUFDO0tBQ3BCLE1BQU0sSUFBSSxJQUFJLEtBQUssSUFBSSxFQUFFO01BQ3hCLEtBQUssQ0FBQyxNQUFNLENBQUMsQ0FBQyxFQUFFLENBQUMsQ0FBQyxDQUFDO01BQ25CLEVBQUUsRUFBRSxDQUFDO0tBQ04sTUFBTSxJQUFJLEVBQUUsRUFBRTtNQUNiLEtBQUssQ0FBQyxNQUFNLENBQUMsQ0FBQyxFQUFFLENBQUMsQ0FBQyxDQUFDO01BQ25CLEVBQUUsRUFBRSxDQUFDO0tBQ047R0FDRjs7O0VBR0QsSUFBSSxjQUFjLEVBQUU7SUFDbEIsT0FBTyxFQUFFLEVBQUUsRUFBRSxFQUFFLEVBQUU7TUFDZixLQUFLLENBQUMsT0FBTyxDQUFDLElBQUksQ0FBQyxDQUFDO0tBQ3JCO0dBQ0Y7O0VBRUQsT0FBTyxLQUFLLENBQUM7Q0FDZDs7OztBQUlELElBQUksV0FBVztJQUNYLCtEQUErRCxDQUFDO0FBQ3BFLElBQUksU0FBUyxHQUFHLFNBQVMsUUFBUSxFQUFFO0VBQ2pDLE9BQU8sV0FBVyxDQUFDLElBQUksQ0FBQyxRQUFRLENBQUMsQ0FBQyxLQUFLLENBQUMsQ0FBQyxDQUFDLENBQUM7Q0FDNUMsQ0FBQzs7OztBQUlGLEFBMkJFOzs7O0FBSUYsQUFBTyxTQUFTLFNBQVMsQ0FBQyxJQUFJLEVBQUU7RUFDOUIsSUFBSSxjQUFjLEdBQUcsVUFBVSxDQUFDLElBQUksQ0FBQztNQUNqQyxhQUFhLEdBQUcsTUFBTSxDQUFDLElBQUksRUFBRSxDQUFDLENBQUMsQ0FBQyxLQUFLLEdBQUcsQ0FBQzs7O0VBRzdDLElBQUksR0FBRyxjQUFjLENBQUMsTUFBTSxDQUFDLElBQUksQ0FBQyxLQUFLLENBQUMsR0FBRyxDQUFDLEVBQUUsU0FBUyxDQUFDLEVBQUU7SUFDeEQsT0FBTyxDQUFDLENBQUMsQ0FBQyxDQUFDO0dBQ1osQ0FBQyxFQUFFLENBQUMsY0FBYyxDQUFDLENBQUMsSUFBSSxDQUFDLEdBQUcsQ0FBQyxDQUFDOztFQUUvQixJQUFJLENBQUMsSUFBSSxJQUFJLENBQUMsY0FBYyxFQUFFO0lBQzVCLElBQUksR0FBRyxHQUFHLENBQUM7R0FDWjtFQUNELElBQUksSUFBSSxJQUFJLGFBQWEsRUFBRTtJQUN6QixJQUFJLElBQUksR0FBRyxDQUFDO0dBQ2I7O0VBRUQsT0FBTyxDQUFDLGNBQWMsR0FBRyxHQUFHLEdBQUcsRUFBRSxJQUFJLElBQUksQ0FBQztDQUMzQyxBQUFDOzs7QUFHRixBQUFPLFNBQVMsVUFBVSxDQUFDLElBQUksRUFBRTtFQUMvQixPQUFPLElBQUksQ0FBQyxNQUFNLENBQUMsQ0FBQyxDQUFDLEtBQUssR0FBRyxDQUFDO0NBQy9COzs7QUFHRCxBQUFPLFNBQVMsSUFBSSxHQUFHO0VBQ3JCLElBQUksS0FBSyxHQUFHLEtBQUssQ0FBQyxTQUFTLENBQUMsS0FBSyxDQUFDLElBQUksQ0FBQyxTQUFTLEVBQUUsQ0FBQyxDQUFDLENBQUM7RUFDckQsT0FBTyxTQUFTLENBQUMsTUFBTSxDQUFDLEtBQUssRUFBRSxTQUFTLENBQUMsRUFBRSxLQUFLLEVBQUU7SUFDaEQsSUFBSSxPQUFPLENBQUMsS0FBSyxRQUFRLEVBQUU7TUFDekIsTUFBTSxJQUFJLFNBQVMsQ0FBQyx3Q0FBd0MsQ0FBQyxDQUFDO0tBQy9EO0lBQ0QsT0FBTyxDQUFDLENBQUM7R0FDVixDQUFDLENBQUMsSUFBSSxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUM7Q0FDZjs7Ozs7QUFLRCxBQXVDQzs7QUFFRCxBQUFxQjtBQUNyQixBQUEyQjs7QUFFM0IsQUFBTyxTQUFTLE9BQU8sQ0FBQyxJQUFJLEVBQUU7RUFDNUIsSUFBSSxNQUFNLEdBQUcsU0FBUyxDQUFDLElBQUksQ0FBQztNQUN4QixJQUFJLEdBQUcsTUFBTSxDQUFDLENBQUMsQ0FBQztNQUNoQixHQUFHLEdBQUcsTUFBTSxDQUFDLENBQUMsQ0FBQyxDQUFDOztFQUVwQixJQUFJLENBQUMsSUFBSSxJQUFJLENBQUMsR0FBRyxFQUFFOztJQUVqQixPQUFPLEdBQUcsQ0FBQztHQUNaOztFQUVELElBQUksR0FBRyxFQUFFOztJQUVQLEdBQUcsR0FBRyxHQUFHLENBQUMsTUFBTSxDQUFDLENBQUMsRUFBRSxHQUFHLENBQUMsTUFBTSxHQUFHLENBQUMsQ0FBQyxDQUFDO0dBQ3JDOztFQUVELE9BQU8sSUFBSSxHQUFHLEdBQUcsQ0FBQztDQUNuQjs7QUFFRCxBQU9DOzs7QUFHRCxBQUVDO0FBQ0QsQUFZQSxTQUFTLE1BQU0sRUFBRSxFQUFFLEVBQUUsQ0FBQyxFQUFFO0lBQ3BCLElBQUksRUFBRSxDQUFDLE1BQU0sRUFBRSxPQUFPLEVBQUUsQ0FBQyxNQUFNLENBQUMsQ0FBQyxDQUFDLENBQUM7SUFDbkMsSUFBSSxHQUFHLEdBQUcsRUFBRSxDQUFDO0lBQ2IsS0FBSyxJQUFJLENBQUMsR0FBRyxDQUFDLEVBQUUsQ0FBQyxHQUFHLEVBQUUsQ0FBQyxNQUFNLEVBQUUsQ0FBQyxFQUFFLEVBQUU7UUFDaEMsSUFBSSxDQUFDLENBQUMsRUFBRSxDQUFDLENBQUMsQ0FBQyxFQUFFLENBQUMsRUFBRSxFQUFFLENBQUMsRUFBRSxHQUFHLENBQUMsSUFBSSxDQUFDLEVBQUUsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDO0tBQ3hDO0lBQ0QsT0FBTyxHQUFHLENBQUM7Q0FDZDs7O0FBR0QsSUFBSSxNQUFNLEdBQUcsSUFBSSxDQUFDLE1BQU0sQ0FBQyxDQUFDLENBQUMsQ0FBQyxLQUFLLEdBQUc7SUFDaEMsVUFBVSxHQUFHLEVBQUUsS0FBSyxFQUFFLEdBQUcsRUFBRSxFQUFFLE9BQU8sR0FBRyxDQUFDLE1BQU0sQ0FBQyxLQUFLLEVBQUUsR0FBRyxDQUFDLEVBQUU7SUFDNUQsVUFBVSxHQUFHLEVBQUUsS0FBSyxFQUFFLEdBQUcsRUFBRTtRQUN2QixJQUFJLEtBQUssR0FBRyxDQUFDLEVBQUUsS0FBSyxHQUFHLEdBQUcsQ0FBQyxNQUFNLEdBQUcsS0FBSyxDQUFDO1FBQzFDLE9BQU8sR0FBRyxDQUFDLE1BQU0sQ0FBQyxLQUFLLEVBQUUsR0FBRyxDQUFDLENBQUM7S0FDakM7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7O0FDL01MLFNBQVMsY0FBYyxDQUFDLEtBQUssRUFBRSxjQUFjLEVBQUU7O0VBRTdDLElBQUksRUFBRSxHQUFHLENBQUMsQ0FBQztFQUNYLEtBQUssSUFBSSxDQUFDLEdBQUcsS0FBSyxDQUFDLE1BQU0sR0FBRyxDQUFDLEVBQUUsQ0FBQyxJQUFJLENBQUMsRUFBRSxDQUFDLEVBQUUsRUFBRTtJQUMxQyxJQUFJLElBQUksR0FBRyxLQUFLLENBQUMsQ0FBQyxDQUFDLENBQUM7SUFDcEIsSUFBSSxJQUFJLEtBQUssR0FBRyxFQUFFO01BQ2hCLEtBQUssQ0FBQyxNQUFNLENBQUMsQ0FBQyxFQUFFLENBQUMsQ0FBQyxDQUFDO0tBQ3BCLE1BQU0sSUFBSSxJQUFJLEtBQUssSUFBSSxFQUFFO01BQ3hCLEtBQUssQ0FBQyxNQUFNLENBQUMsQ0FBQyxFQUFFLENBQUMsQ0FBQyxDQUFDO01BQ25CLEVBQUUsRUFBRSxDQUFDO0tBQ04sTUFBTSxJQUFJLEVBQUUsRUFBRTtNQUNiLEtBQUssQ0FBQyxNQUFNLENBQUMsQ0FBQyxFQUFFLENBQUMsQ0FBQyxDQUFDO01BQ25CLEVBQUUsRUFBRSxDQUFDO0tBQ047R0FDRjs7O0VBR0QsSUFBSSxjQUFjLEVBQUU7SUFDbEIsT0FBTyxFQUFFLEVBQUUsRUFBRSxFQUFFLEVBQUU7TUFDZixLQUFLLENBQUMsT0FBTyxDQUFDLElBQUksQ0FBQyxDQUFDO0tBQ3JCO0dBQ0Y7O0VBRUQsT0FBTyxLQUFLLENBQUM7Q0FDZDs7OztBQUlELElBQUksV0FBVztJQUNYLCtEQUErRCxDQUFDO0FBQ3BFLElBQUksU0FBUyxHQUFHLFNBQVMsUUFBUSxFQUFFO0VBQ2pDLE9BQU8sV0FBVyxDQUFDLElBQUksQ0FBQyxRQUFRLENBQUMsQ0FBQyxLQUFLLENBQUMsQ0FBQyxDQUFDLENBQUM7Q0FDNUMsQ0FBQzs7OztBQUlGLGVBQWUsR0FBRyxXQUFXO0VBQzNCLElBQUksWUFBWSxHQUFHLEVBQUU7TUFDakIsZ0JBQWdCLEdBQUcsS0FBSyxDQUFDOztFQUU3QixLQUFLLElBQUksQ0FBQyxHQUFHLFNBQVMsQ0FBQyxNQUFNLEdBQUcsQ0FBQyxFQUFFLENBQUMsSUFBSSxDQUFDLENBQUMsSUFBSSxDQUFDLGdCQUFnQixFQUFFLENBQUMsRUFBRSxFQUFFO0lBQ3BFLElBQUksSUFBSSxHQUFHLENBQUMsQ0FBQyxJQUFJLENBQUMsSUFBSSxTQUFTLENBQUMsQ0FBQyxDQUFDLEdBQUcsT0FBTyxDQUFDLEdBQUcsRUFBRSxDQUFDOzs7SUFHbkQsSUFBSSxPQUFPLElBQUksS0FBSyxRQUFRLEVBQUU7TUFDNUIsTUFBTSxJQUFJLFNBQVMsQ0FBQywyQ0FBMkMsQ0FBQyxDQUFDO0tBQ2xFLE1BQU0sSUFBSSxDQUFDLElBQUksRUFBRTtNQUNoQixTQUFTO0tBQ1Y7O0lBRUQsWUFBWSxHQUFHLElBQUksR0FBRyxHQUFHLEdBQUcsWUFBWSxDQUFDO0lBQ3pDLGdCQUFnQixHQUFHLElBQUksQ0FBQyxNQUFNLENBQUMsQ0FBQyxDQUFDLEtBQUssR0FBRyxDQUFDO0dBQzNDOzs7Ozs7RUFNRCxZQUFZLEdBQUcsY0FBYyxDQUFDLE1BQU0sQ0FBQyxZQUFZLENBQUMsS0FBSyxDQUFDLEdBQUcsQ0FBQyxFQUFFLFNBQVMsQ0FBQyxFQUFFO0lBQ3hFLE9BQU8sQ0FBQyxDQUFDLENBQUMsQ0FBQztHQUNaLENBQUMsRUFBRSxDQUFDLGdCQUFnQixDQUFDLENBQUMsSUFBSSxDQUFDLEdBQUcsQ0FBQyxDQUFDOztFQUVqQyxPQUFPLENBQUMsQ0FBQyxnQkFBZ0IsR0FBRyxHQUFHLEdBQUcsRUFBRSxJQUFJLFlBQVksS0FBSyxHQUFHLENBQUM7Q0FDOUQsQ0FBQzs7OztBQUlGLGlCQUFpQixHQUFHLFNBQVMsSUFBSSxFQUFFO0VBQ2pDLElBQUksVUFBVSxHQUFHLE9BQU8sQ0FBQyxVQUFVLENBQUMsSUFBSSxDQUFDO01BQ3JDLGFBQWEsR0FBRyxNQUFNLENBQUMsSUFBSSxFQUFFLENBQUMsQ0FBQyxDQUFDLEtBQUssR0FBRyxDQUFDOzs7RUFHN0MsSUFBSSxHQUFHLGNBQWMsQ0FBQyxNQUFNLENBQUMsSUFBSSxDQUFDLEtBQUssQ0FBQyxHQUFHLENBQUMsRUFBRSxTQUFTLENBQUMsRUFBRTtJQUN4RCxPQUFPLENBQUMsQ0FBQyxDQUFDLENBQUM7R0FDWixDQUFDLEVBQUUsQ0FBQyxVQUFVLENBQUMsQ0FBQyxJQUFJLENBQUMsR0FBRyxDQUFDLENBQUM7O0VBRTNCLElBQUksQ0FBQyxJQUFJLElBQUksQ0FBQyxVQUFVLEVBQUU7SUFDeEIsSUFBSSxHQUFHLEdBQUcsQ0FBQztHQUNaO0VBQ0QsSUFBSSxJQUFJLElBQUksYUFBYSxFQUFFO0lBQ3pCLElBQUksSUFBSSxHQUFHLENBQUM7R0FDYjs7RUFFRCxPQUFPLENBQUMsVUFBVSxHQUFHLEdBQUcsR0FBRyxFQUFFLElBQUksSUFBSSxDQUFDO0NBQ3ZDLENBQUM7OztBQUdGLGtCQUFrQixHQUFHLFNBQVMsSUFBSSxFQUFFO0VBQ2xDLE9BQU8sSUFBSSxDQUFDLE1BQU0sQ0FBQyxDQUFDLENBQUMsS0FBSyxHQUFHLENBQUM7Q0FDL0IsQ0FBQzs7O0FBR0YsWUFBWSxHQUFHLFdBQVc7RUFDeEIsSUFBSSxLQUFLLEdBQUcsS0FBSyxDQUFDLFNBQVMsQ0FBQyxLQUFLLENBQUMsSUFBSSxDQUFDLFNBQVMsRUFBRSxDQUFDLENBQUMsQ0FBQztFQUNyRCxPQUFPLE9BQU8sQ0FBQyxTQUFTLENBQUMsTUFBTSxDQUFDLEtBQUssRUFBRSxTQUFTLENBQUMsRUFBRSxLQUFLLEVBQUU7SUFDeEQsSUFBSSxPQUFPLENBQUMsS0FBSyxRQUFRLEVBQUU7TUFDekIsTUFBTSxJQUFJLFNBQVMsQ0FBQyx3Q0FBd0MsQ0FBQyxDQUFDO0tBQy9EO0lBQ0QsT0FBTyxDQUFDLENBQUM7R0FDVixDQUFDLENBQUMsSUFBSSxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUM7Q0FDZixDQUFDOzs7OztBQUtGLGdCQUFnQixHQUFHLFNBQVMsSUFBSSxFQUFFLEVBQUUsRUFBRTtFQUNwQyxJQUFJLEdBQUcsT0FBTyxDQUFDLE9BQU8sQ0FBQyxJQUFJLENBQUMsQ0FBQyxNQUFNLENBQUMsQ0FBQyxDQUFDLENBQUM7RUFDdkMsRUFBRSxHQUFHLE9BQU8sQ0FBQyxPQUFPLENBQUMsRUFBRSxDQUFDLENBQUMsTUFBTSxDQUFDLENBQUMsQ0FBQyxDQUFDOztFQUVuQyxTQUFTLElBQUksQ0FBQyxHQUFHLEVBQUU7SUFDakIsSUFBSSxLQUFLLEdBQUcsQ0FBQyxDQUFDO0lBQ2QsT0FBTyxLQUFLLEdBQUcsR0FBRyxDQUFDLE1BQU0sRUFBRSxLQUFLLEVBQUUsRUFBRTtNQUNsQyxJQUFJLEdBQUcsQ0FBQyxLQUFLLENBQUMsS0FBSyxFQUFFLEVBQUUsTUFBTTtLQUM5Qjs7SUFFRCxJQUFJLEdBQUcsR0FBRyxHQUFHLENBQUMsTUFBTSxHQUFHLENBQUMsQ0FBQztJQUN6QixPQUFPLEdBQUcsSUFBSSxDQUFDLEVBQUUsR0FBRyxFQUFFLEVBQUU7TUFDdEIsSUFBSSxHQUFHLENBQUMsR0FBRyxDQUFDLEtBQUssRUFBRSxFQUFFLE1BQU07S0FDNUI7O0lBRUQsSUFBSSxLQUFLLEdBQUcsR0FBRyxFQUFFLE9BQU8sRUFBRSxDQUFDO0lBQzNCLE9BQU8sR0FBRyxDQUFDLEtBQUssQ0FBQyxLQUFLLEVBQUUsR0FBRyxHQUFHLEtBQUssR0FBRyxDQUFDLENBQUMsQ0FBQztHQUMxQzs7RUFFRCxJQUFJLFNBQVMsR0FBRyxJQUFJLENBQUMsSUFBSSxDQUFDLEtBQUssQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDO0VBQ3RDLElBQUksT0FBTyxHQUFHLElBQUksQ0FBQyxFQUFFLENBQUMsS0FBSyxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUM7O0VBRWxDLElBQUksTUFBTSxHQUFHLElBQUksQ0FBQyxHQUFHLENBQUMsU0FBUyxDQUFDLE1BQU0sRUFBRSxPQUFPLENBQUMsTUFBTSxDQUFDLENBQUM7RUFDeEQsSUFBSSxlQUFlLEdBQUcsTUFBTSxDQUFDO0VBQzdCLEtBQUssSUFBSSxDQUFDLEdBQUcsQ0FBQyxFQUFFLENBQUMsR0FBRyxNQUFNLEVBQUUsQ0FBQyxFQUFFLEVBQUU7SUFDL0IsSUFBSSxTQUFTLENBQUMsQ0FBQyxDQUFDLEtBQUssT0FBTyxDQUFDLENBQUMsQ0FBQyxFQUFFO01BQy9CLGVBQWUsR0FBRyxDQUFDLENBQUM7TUFDcEIsTUFBTTtLQUNQO0dBQ0Y7O0VBRUQsSUFBSSxXQUFXLEdBQUcsRUFBRSxDQUFDO0VBQ3JCLEtBQUssSUFBSSxDQUFDLEdBQUcsZUFBZSxFQUFFLENBQUMsR0FBRyxTQUFTLENBQUMsTUFBTSxFQUFFLENBQUMsRUFBRSxFQUFFO0lBQ3ZELFdBQVcsQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDLENBQUM7R0FDeEI7O0VBRUQsV0FBVyxHQUFHLFdBQVcsQ0FBQyxNQUFNLENBQUMsT0FBTyxDQUFDLEtBQUssQ0FBQyxlQUFlLENBQUMsQ0FBQyxDQUFDOztFQUVqRSxPQUFPLFdBQVcsQ0FBQyxJQUFJLENBQUMsR0FBRyxDQUFDLENBQUM7Q0FDOUIsQ0FBQzs7QUFFRixXQUFXLEdBQUcsR0FBRyxDQUFDO0FBQ2xCLGlCQUFpQixHQUFHLEdBQUcsQ0FBQzs7QUFFeEIsZUFBZSxHQUFHLFNBQVMsSUFBSSxFQUFFO0VBQy9CLElBQUksTUFBTSxHQUFHLFNBQVMsQ0FBQyxJQUFJLENBQUM7TUFDeEIsSUFBSSxHQUFHLE1BQU0sQ0FBQyxDQUFDLENBQUM7TUFDaEIsR0FBRyxHQUFHLE1BQU0sQ0FBQyxDQUFDLENBQUMsQ0FBQzs7RUFFcEIsSUFBSSxDQUFDLElBQUksSUFBSSxDQUFDLEdBQUcsRUFBRTs7SUFFakIsT0FBTyxHQUFHLENBQUM7R0FDWjs7RUFFRCxJQUFJLEdBQUcsRUFBRTs7SUFFUCxHQUFHLEdBQUcsR0FBRyxDQUFDLE1BQU0sQ0FBQyxDQUFDLEVBQUUsR0FBRyxDQUFDLE1BQU0sR0FBRyxDQUFDLENBQUMsQ0FBQztHQUNyQzs7RUFFRCxPQUFPLElBQUksR0FBRyxHQUFHLENBQUM7Q0FDbkIsQ0FBQzs7O0FBR0YsZ0JBQWdCLEdBQUcsU0FBUyxJQUFJLEVBQUUsR0FBRyxFQUFFO0VBQ3JDLElBQUksQ0FBQyxHQUFHLFNBQVMsQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQzs7RUFFM0IsSUFBSSxHQUFHLElBQUksQ0FBQyxDQUFDLE1BQU0sQ0FBQyxDQUFDLENBQUMsR0FBRyxHQUFHLENBQUMsTUFBTSxDQUFDLEtBQUssR0FBRyxFQUFFO0lBQzVDLENBQUMsR0FBRyxDQUFDLENBQUMsTUFBTSxDQUFDLENBQUMsRUFBRSxDQUFDLENBQUMsTUFBTSxHQUFHLEdBQUcsQ0FBQyxNQUFNLENBQUMsQ0FBQztHQUN4QztFQUNELE9BQU8sQ0FBQyxDQUFDO0NBQ1YsQ0FBQzs7O0FBR0YsZUFBZSxHQUFHLFNBQVMsSUFBSSxFQUFFO0VBQy9CLE9BQU8sU0FBUyxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDO0NBQzNCLENBQUM7O0FBRUYsU0FBUyxNQUFNLEVBQUUsRUFBRSxFQUFFLENBQUMsRUFBRTtJQUNwQixJQUFJLEVBQUUsQ0FBQyxNQUFNLEVBQUUsT0FBTyxFQUFFLENBQUMsTUFBTSxDQUFDLENBQUMsQ0FBQyxDQUFDO0lBQ25DLElBQUksR0FBRyxHQUFHLEVBQUUsQ0FBQztJQUNiLEtBQUssSUFBSSxDQUFDLEdBQUcsQ0FBQyxFQUFFLENBQUMsR0FBRyxFQUFFLENBQUMsTUFBTSxFQUFFLENBQUMsRUFBRSxFQUFFO1FBQ2hDLElBQUksQ0FBQyxDQUFDLEVBQUUsQ0FBQyxDQUFDLENBQUMsRUFBRSxDQUFDLEVBQUUsRUFBRSxDQUFDLEVBQUUsR0FBRyxDQUFDLElBQUksQ0FBQyxFQUFFLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQztLQUN4QztJQUNELE9BQU8sR0FBRyxDQUFDO0NBQ2Q7OztBQUdELElBQUksTUFBTSxHQUFHLElBQUksQ0FBQyxNQUFNLENBQUMsQ0FBQyxDQUFDLENBQUMsS0FBSyxHQUFHO01BQzlCLFVBQVUsR0FBRyxFQUFFLEtBQUssRUFBRSxHQUFHLEVBQUUsRUFBRSxPQUFPLEdBQUcsQ0FBQyxNQUFNLENBQUMsS0FBSyxFQUFFLEdBQUcsQ0FBQyxFQUFFO01BQzVELFVBQVUsR0FBRyxFQUFFLEtBQUssRUFBRSxHQUFHLEVBQUU7UUFDekIsSUFBSSxLQUFLLEdBQUcsQ0FBQyxFQUFFLEtBQUssR0FBRyxHQUFHLENBQUMsTUFBTSxHQUFHLEtBQUssQ0FBQztRQUMxQyxPQUFPLEdBQUcsQ0FBQyxNQUFNLENBQUMsS0FBSyxFQUFFLEdBQUcsQ0FBQyxDQUFDO0tBQ2pDLENBQ0o7Ozs7Ozs7Ozs7Ozs7OzRCQy9OT0s7SUFBTUMsNEJBQUFBOztBQUVkLElBQU1DLFNBQVMsU0FBVEEsTUFBUyxDQUFDQyxJQUFEO1dBQVlGLFdBQVNFLElBQVQsRUFBZUMsUUFBZixDQUF3QixHQUF4QixDQUFaO0NBQWY7O0FBRUEsSUFBTUMsa0JBQWtCLFNBQWxCQSxlQUFrQixDQUFDRixJQUFELEVBQU9HLElBQVAsRUFBYUMsSUFBYixFQUFzQjtRQUN0QyxPQUFPRCxJQUFQLEtBQWdCLFFBQXBCLEVBQThCLE9BQU9FLFNBQVNMLElBQVQsQ0FBUDtRQUMxQkQsT0FBT0ksSUFBUCxDQUFKLEVBQWtCLE9BQU9FLFNBQVNGLElBQVQsQ0FBUDtXQUNYTixPQUFLUSxTQUFTRixJQUFULENBQUwsRUFBcUJFLFNBQVNMLElBQVQsRUFBZU0sT0FBZixDQUF1QkQsU0FBU0QsSUFBVCxDQUF2QixFQUF1QyxFQUF2QyxDQUFyQixDQUFQO0NBSEo7O0FBTUEsSUFBTUcsZUFBYSxTQUFiQSxVQUFhLENBQUNQLElBQUQsRUFBVTtRQUNyQkEsS0FBS1EsTUFBTCxDQUFZLENBQVosTUFBbUIsR0FBbkIsS0FDQVIsS0FBS1EsTUFBTCxDQUFZLENBQVosTUFBbUIsR0FBbkIsSUFBMEJSLEtBQUtRLE1BQUwsQ0FBWSxDQUFaLE1BQW1CLEdBRDdDLENBQUosRUFFSSxPQUFPLElBQVA7V0FDRyxLQUFQO0NBSko7O0FBT0EsSUFBTUMsZUFBYSxTQUFiQSxVQUFhLENBQUNULElBQUQsRUFBVTtRQUNyQkEsS0FBS1EsTUFBTCxDQUFZLENBQVosTUFBbUIsR0FBdkIsRUFBNEIsT0FBTyxJQUFQO1dBQ3JCLEtBQVA7Q0FGSjs7QUFLQSxJQUFNSCxXQUFXLFNBQVhBLFFBQVcsQ0FBQ0wsSUFBRCxFQUFVO1FBQ25CUyxhQUFXVCxJQUFYLENBQUosRUFBc0IsT0FBT0EsSUFBUDtXQUNmSCxPQUFLYSxlQUFMLEVBQW9CVixJQUFwQixDQUFQO0NBRko7O0FBS0EsSUFBTVcsYUFBVyxTQUFYQSxRQUFXLENBQUNYLElBQUQsRUFBVTtRQUNuQixDQUFDUyxhQUFXVCxJQUFYLENBQUwsRUFBdUIsT0FBT0EsSUFBUDtXQUNoQkEsS0FBS00sT0FBTCxDQUFhSSxrQkFBZ0IsR0FBN0IsRUFBbUMsRUFBbkMsQ0FBUDtDQUZKOztBQUtBLElBQU1BLGdCQUFjLFNBQWRBLFdBQWM7V0FDZkUsZUFBT0MsT0FBUCxJQUFrQkQsZUFBT0MsT0FBUCxDQUFlQyxHQUFsQyxJQUEwQ0MsUUFBUUQsR0FBUixFQUQxQjtDQUFwQjs7QUFJQUUsWUFBQSxHQUFpQmpCLE1BQWpCO0FBQ0FpQixxQkFBQSxHQUEwQmQsZUFBMUI7QUFDQWMsZ0JBQUEsR0FBcUJULFlBQXJCO0FBQ0FTLGdCQUFBLEdBQXFCUCxZQUFyQjtBQUNBTyxjQUFBLEdBQW1CWCxRQUFuQjtBQUNBVyxjQUFBLEdBQW1CTCxVQUFuQjtBQUNBSyxpQkFBQSxHQUFzQk4sYUFBdEI7Ozs7Ozs7Ozs7Ozt3QkN6Q1FIO0lBQVlFLHNCQUFBQTs7NEJBQ1paOztBQUVSLElBQU1vQixhQUFhLENBQUMsSUFBRCxFQUFPLE1BQVAsRUFBZSxNQUFmLENBQW5COztBQUVBLElBQU1DLGVBQWUsU0FBZkEsWUFBZSxDQUFDQyxVQUFEO1dBQWdCLEdBQWhCO0NBQXJCOztBQUVBLEFBSUEsSUFBTUMsWUFBWSxTQUFaQSxTQUFZLENBQUNDLElBQUQsRUFBVTtRQUNwQmQsV0FBV2MsSUFBWCxLQUFvQlosYUFBV1ksSUFBWCxDQUF4QixFQUEwQyxPQUFPLEtBQVA7V0FDbkMsSUFBUDtDQUZKOztBQUtBLElBQU1DLG9CQUFvQixTQUFwQkEsaUJBQW9CLENBQUNELElBQUQsRUFBVTtRQUM1QkQsVUFBVUMsSUFBVixLQUFtQkEsS0FBS0UsT0FBTCxDQUFhLEdBQWIsTUFBc0IsQ0FBQyxDQUE5QyxFQUNJLE9BQU8sSUFBUDtXQUNHLEtBQVA7Q0FISjs7QUFNQSxBQUtBLElBQU1DLGtCQUFrQixTQUFsQkEsZUFBa0IsQ0FBQ0gsSUFBRCxFQUE0QjtRQUFyQkksU0FBcUIsdUVBQVQsSUFBUzs7UUFDNUNILGtCQUFrQkQsSUFBbEIsQ0FBSixFQUE2QixPQUFPQSxJQUFQO1FBQ3ZCSyxNQUFNLE1BQU1ELFNBQWxCO1FBQ0lKLEtBQUtNLEtBQUwsQ0FBVyxDQUFFRCxJQUFJRSxNQUFqQixNQUE4QkYsR0FBbEMsRUFBdUMsT0FBT0wsSUFBUDtXQUNoQ0EsT0FBT0ssR0FBZDtDQUpKOztBQU9BLEFBa0JBVixnQkFBQSxHQUFxQkMsVUFBckI7QUFDQUQsa0JBQUEsR0FBdUJFLFlBQXZCO0FBQ0FGLEFBQ0FBLGVBQUEsR0FBb0JJLFNBQXBCO0FBQ0FKLHVCQUFBLEdBQTRCTSxpQkFBNUI7QUFDQU4sQUFDQUEscUJBQUEsR0FBMEJRLGVBQTFCOztBQ2xEQSxJQUFNSyxRQUFRLEVBQWQ7O0FBRUEsSUFBTUMsaUJBQWlCLFNBQWpCQSxjQUFpQixDQUFDQyxJQUFELEVBQVU7O1FBRXpCRixNQUFNRSxJQUFOLENBQUosRUFBaUI7ZUFDTkYsTUFBTUUsSUFBTixDQUFQOzs7UUFHRUMsZ0JBQWdCQyxRQUFRQyxPQUFSLENBQWdCSCxJQUFoQixDQUF0Qjs7UUFFSUMsYUFBSixFQUFtQjtZQUNURyxlQUFlQyxtQkFBbUJMLElBQW5CLENBQXJCO1lBQ01NLFNBQVNSLE1BQU1FLElBQU4sSUFBYyxFQUFFZixTQUFTLEVBQVgsRUFBN0I7O3NCQUVjc0IsSUFBZCxDQUFtQkQsT0FBT3JCLE9BQTFCLEVBQW1DcUIsT0FBT3JCLE9BQTFDLEVBQW1EbUIsWUFBbkQsRUFBaUVFLE1BQWpFOztlQUVPQSxNQUFQOzs7V0FHRyxJQUFQO0NBakJKOztBQW9CQSxJQUFNRSxPQUFPLFNBQVBBLElBQU8sQ0FBQ0MsT0FBRCxFQUFzQztRQUE1QkMsTUFBNEIsdUVBQW5CdkIsZ0JBQW1COztRQUN6Q2UsVUFBVVMsT0FBT1QsT0FBdkI7UUFDTVUsUUFBUUMsY0FBY0gsTUFBZCxDQUFkO1FBQ01JLFdBQVdDLFdBQVdiLFFBQVFjLFVBQW5CLEVBQStCUCxPQUEvQixFQUF3Q0csS0FBeEMsQ0FBakI7UUFDTUssYUFBYUYsV0FBV2IsUUFBUWdCLFdBQW5CLEVBQWdDSixRQUFoQyxFQUEwQ0YsS0FBMUMsQ0FBbkI7UUFDTU8sTUFBTUMsZ0JBQWdCSCxVQUFoQixFQUE0QlAsTUFBNUIsQ0FBWjs7U0FFSyxJQUFJVyxJQUFJLENBQWIsRUFBZ0JBLElBQUluQyxhQUFXVyxNQUEvQixFQUF1Q3dCLEdBQXZDLEVBQTRDO1lBQ2xDckIsT0FBT1Asa0JBQWdCMEIsR0FBaEIsRUFBcUJqQyxhQUFXbUMsQ0FBWCxDQUFyQixDQUFiO1lBQ01mLFNBQVNQLGVBQWVDLElBQWYsQ0FBZjtZQUNJTSxNQUFKLEVBQVk7bUJBQ0RBLE9BQU9yQixPQUFkOzs7O1NBSUgsSUFBSW9DLEtBQUksQ0FBYixFQUFnQkEsS0FBSW5DLGFBQVdXLE1BQS9CLEVBQXVDd0IsSUFBdkMsRUFBNEM7WUFDbENyQixRQUFPUCxrQkFBZ0IzQixLQUFLcUQsR0FBTCxFQUFVLE9BQVYsQ0FBaEIsRUFBb0NqQyxhQUFXbUMsRUFBWCxDQUFwQyxDQUFiO1lBQ01mLFVBQVNQLGVBQWVDLEtBQWYsQ0FBZjtZQUNJTSxPQUFKLEVBQVk7bUJBQ0RBLFFBQU9yQixPQUFkOzs7O1FBSUZxQyxRQUFRLElBQUlDLEtBQUosMEJBQWlDSixHQUFqQyxnQkFBK0NULE1BQS9DLE9BQWQ7VUFDTWMsSUFBTixHQUFhLGtCQUFiO1VBQ01GLEtBQU47Q0F6Qko7O0FBNEJBLElBQU1QLGFBQWEsU0FBYkEsVUFBYSxDQUFDVSxHQUFELEVBQU1oQixPQUFOLEVBQWVpQixFQUFmLEVBQXNCO1FBQy9CQyxTQUFTRixJQUFJQyxFQUFKLEtBQVdELElBQUlDLEVBQUosRUFBUWpCLE9BQVIsQ0FBMUI7V0FDT2tCLFVBQVVsQixPQUFqQjtDQUZKOztBQUtBLElBQU1JLGdCQUFnQixTQUFoQkEsYUFBZ0IsQ0FBQzVDLE9BQUQsRUFBVTtRQUN0QjJELGNBQWMsY0FBcEI7UUFDTUMsUUFBUTVELFFBQUs2RCxLQUFMLENBQVcsR0FBWCxDQUFkO1FBQ01DLFFBQVFGLE1BQU1HLFdBQU4sQ0FBa0JKLFdBQWxCLENBQWQ7UUFDSUcsVUFBVSxDQUFDLENBQWYsRUFBa0I7ZUFDUEYsTUFBTSxDQUFOLENBQVA7O1dBRUdBLE1BQU1qQyxLQUFOLENBQVksQ0FBWixFQUFlbUMsUUFBUSxDQUF2QixFQUEwQmpFLElBQTFCLENBQStCLEdBQS9CLENBQVA7Q0FQSjs7QUFVQSxJQUFNc0Qsa0JBQWtCLFNBQWxCQSxlQUFrQixDQUFDRCxHQUFELEVBQU1ULE1BQU4sRUFBaUI7UUFDakNuQixvQkFBa0I0QixHQUFsQixDQUFKLEVBQTRCO2VBQ2pCQSxHQUFQOzs7UUFHQTlCLFlBQVU4QixHQUFWLENBQUosRUFBb0I7ZUFDVEEsR0FBUDs7O1FBR0ljLEtBVDZCLEdBU25CdEIsT0FBT1QsT0FUWSxDQVM3QitCLEtBVDZCOztRQVUvQkMsY0FBZUQsTUFBTXZCLE1BQU4sSUFBZ0J1QixNQUFNdkIsTUFBTixDQUFoQixHQUFnQ0EsTUFBckQ7UUFDTXlCLGFBQWExQyxrQkFBZ0J5QyxXQUFoQixDQUFuQjtRQUNNRSxZQUFZQyxRQUFRRixVQUFSLENBQWxCOztXQUVPckUsS0FBS3NFLFNBQUwsRUFBZ0JqQixHQUFoQixDQUFQO0NBZEo7O0FBaUJBLEFBRUEsSUFBTWQscUJBQXFCLFNBQXJCQSxrQkFBcUI7V0FBVTtlQUFPTSxPQUFPVCxPQUFQLENBQWVpQixHQUFmLEVBQW9CVCxNQUFwQixDQUFQO0tBQVY7Q0FBM0I7O0FDMUZBLElBQU00QixjQUFjLFNBQWRBLFdBQWMsQ0FBQ0MsT0FBRCxFQUFhO1lBQ3JCQyxPQUFSLENBQWdCLGtCQUFVO1lBQ2hCdEMsVUFBVVMsT0FBT1QsT0FBdkI7WUFDUXdCLEVBRmMsR0FFYXBCLE1BRmIsQ0FFZG9CLEVBRmM7WUFFVlAsR0FGVSxHQUVhYixNQUZiLENBRVZhLEdBRlU7WUFFTGMsS0FGSyxHQUVhM0IsTUFGYixDQUVMMkIsS0FGSztZQUVFUSxNQUZGLEdBRWFuQyxNQUZiLENBRUVtQyxNQUZGOzs7Z0JBSWRDLFlBQVIsQ0FBcUJ2QixHQUFyQixFQUEwQnNCLE1BQTFCO2dCQUNRRSxHQUFSLENBQVlDLElBQVosQ0FBaUJsQixFQUFqQjs7WUFFSU8sS0FBSixFQUFXL0IsUUFBUStCLEtBQVIsQ0FBY2QsR0FBZCxJQUFxQmMsS0FBckI7S0FQZjtDQURKOztBQVlBLElBQU1ZLHVCQUF1QixTQUF2QkEsb0JBQXVCLENBQUNOLE9BQUQsRUFBYTs7UUFFaENyQyxVQUFVLFNBQVZBLE9BQVUsQ0FBQ08sT0FBRCxFQUFVcUMsVUFBVjtlQUEyQkMsSUFBQSxDQUFZdEMsT0FBWixFQUFxQnFDLFVBQXJCLENBQTNCO0tBQWhCOztZQUVRM0MsT0FBUixHQUFrQixFQUFsQjtZQUNRd0MsR0FBUixHQUFjLEVBQWQ7WUFDUVYsS0FBUixHQUFnQixFQUFoQjtZQUNRakIsVUFBUixHQUFxQixFQUFyQjtZQUNRRSxXQUFSLEdBQXNCLEVBQXRCO1lBQ1E4QixNQUFSLEdBQWlCLFVBQUMxQyxNQUFELEVBQVMyQyxFQUFUO2VBQWdCL0MsUUFBUUMsT0FBUixDQUFnQkcsTUFBaEIsSUFBMEIyQyxFQUExQztLQUFqQjtZQUNRUCxZQUFSLEdBQXVCLFVBQUN2QixHQUFELEVBQU1zQixNQUFOLEVBQWlCO1lBQzlCUyxnQkFBZ0JDLEtBQ2xCLHdDQUNLVixTQUFTLElBRGQsSUFFQSxpQkFIa0IsQ0FBdEI7Z0JBS1FPLE1BQVIsQ0FBZTdCLEdBQWYsRUFBb0IrQixhQUFwQjtLQU5KO1lBUVExQyxJQUFSLEdBQWUsVUFBQzRDLEtBQUQsRUFBeUI7WUFBakJDLE9BQWlCLHVFQUFQLEVBQU87MkJBRVRBLE9BRlMsQ0FFNUJDLEdBRjRCO1lBRTVCQSxHQUY0QixnQ0FFdEIsUUFGc0I7WUFHdkJDLE9BSHVCLEdBR1hyRCxPQUhXLENBRzVCeUMsR0FINEI7O1lBSTlCYSxVQUFVLEVBQUUsZ0JBQWdCLGtCQUFsQixFQUFoQjtZQUNNQyxPQUFPQyxLQUFLQyxTQUFMLENBQWUsRUFBRVAsWUFBRixFQUFTRyxnQkFBVCxFQUFmLENBQWI7WUFDTUsseUJBQVdDLFFBQVEsTUFBbkIsRUFBMkJMLGdCQUEzQixFQUFvQ0MsVUFBcEMsSUFBNkNKLE9BQTdDLENBQU47ZUFFSTFDLE9BQU9tRCxLQUFQLENBQWFSLEdBQWIsRUFBa0JNLE1BQWxCLEVBQ0NHLElBREQsQ0FDTTttQkFBWUMsU0FBU0MsSUFBVCxFQUFaO1NBRE4sRUFFQ0YsSUFGRCxDQUVNLGdCQUEwQztnQkFBdkMvQyxVQUF1QyxRQUF2Q0EsVUFBdUM7Z0JBQTNCRSxXQUEyQixRQUEzQkEsV0FBMkI7Z0JBQWRxQixPQUFjLFFBQWRBLE9BQWM7O29CQUNwQ3ZCLFVBQVIsR0FBcUJrRCxPQUFPaEUsUUFBUWMsVUFBZixFQUEyQkEsVUFBM0IsQ0FBckI7b0JBQ1FFLFdBQVIsR0FBc0JnRCxPQUFPaEUsUUFBUWdCLFdBQWYsRUFBNEJBLFdBQTVCLENBQXRCO3dCQUNZcUIsT0FBWjtTQUxKLEVBT0M0QixLQVBELENBT087bUJBQUtDLFFBQVE5QyxLQUFSLENBQWMrQyxDQUFkLENBQUw7U0FQUCxDQURKO0tBUEo7O1dBbUJPbkUsT0FBUCxHQUFpQkEsT0FBakI7O1FBRUlxQyxPQUFKLEVBQWFELFlBQVlDLE9BQVo7Q0F2Q2pCOztBQTBDQTs7Ozs7QUN2REFNOzs7OyJ9
