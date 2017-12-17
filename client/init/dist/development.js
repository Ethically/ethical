(function (global, factory) {
	typeof exports === 'object' && typeof module !== 'undefined' ? factory() :
	typeof define === 'function' && define.amd ? define(factory) :
	(factory());
}(this, (function () { 'use strict';

console.log('Hello from WebSockets!');
var webSocket = new WebSocket('ws://localhost:9393');

webSocket.onopen = function (evt) {
    console.log('Connection open ...');
};
webSocket.onmessage = function (evt) {
    if (evt.data === 'SERVER_STOP') {
        location.reload();
    } else {
        console.log('Received Message: ' + evt.data);
    }
};
webSocket.onclose = function (evt) {
    console.log('Connection closed.');
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
function resolve() {
  var resolvedPath = '',
      resolvedAbsolute = false;

  for (var i = arguments.length - 1; i >= -1 && !resolvedAbsolute; i--) {
    var path = (i >= 0) ? arguments[i] : '/';

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
}

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
function relative(from, to) {
  from = resolve(from).substr(1);
  to = resolve(to).substr(1);

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
}

var sep = '/';
var delimiter = ':';

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

function basename(path, ext) {
  var f = splitPath(path)[2];
  // TODO: make this comparison case-insensitive on windows?
  if (ext && f.substr(-1 * ext.length) === ext) {
    f = f.substr(0, f.length - ext.length);
  }
  return f;
}


function extname$1(path) {
  return splitPath(path)[3];
}
var path = {
  extname: extname$1,
  basename: basename,
  dirname: dirname,
  sep: sep,
  delimiter: delimiter,
  relative: relative,
  join: join,
  isAbsolute: isAbsolute,
  normalize: normalize,
  resolve: resolve
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
var substr = 'ab'.substr(-1) === 'b' ?
    function (str, start, len) { return str.substr(start, len) } :
    function (str, start, len) {
        if (start < 0) start = str.length + start;
        return str.substr(start, len);
    };


var path$1 = Object.freeze({
	resolve: resolve,
	normalize: normalize,
	isAbsolute: isAbsolute,
	join: join,
	relative: relative,
	sep: sep,
	delimiter: delimiter,
	dirname: dirname,
	basename: basename,
	extname: extname$1,
	default: path
});

var commonjsGlobal = typeof window !== 'undefined' ? window : typeof global !== 'undefined' ? global : typeof self !== 'undefined' ? self : {};

var _require = ( path$1 && path ) || path$1;

var join$2 = _require.join;
var basename$1 = _require.basename;

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

var path$2 = {
	isFile: isFile_1,
	resolveDestPath: resolveDestPath_1,
	isRelative: isRelative_1,
	isAbsolute: isAbsolute_1,
	absolute: absolute_1,
	relative: relative_1,
	getRootPath: getRootPath_1
};

var isRelative = path$2.isRelative;
var isAbsolute$1 = path$2.isAbsolute;

var join$1 = _require.join;
var resolve$1 = _require.resolve;
var dirname$1 = _require.dirname;

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
    require.load = function (url) {
        return window.fetch(url).then(function (response) {
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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZGV2ZWxvcG1lbnQuanMiLCJzb3VyY2VzIjpbIi4uLy4uL2Rldi9pbmRleC5qcyIsIi4uLy4uLy4uL25vZGVfbW9kdWxlcy9vYmplY3QtZXh0ZW5kL2xpYi9leHRlbmQuanMiLCIuLi8uLi8uLi9ub2RlX21vZHVsZXMvcm9sbHVwLXBsdWdpbi1ub2RlLWJ1aWx0aW5zL3NyYy9lczYvcGF0aC5qcyIsIi4uLy4uLy4uL2hlbHBlci9wYXRoL2luZGV4LmpzIiwiLi4vLi4vLi4vaGVscGVyL3Jlc29sdmUvaW5kZXguanMiLCIuLi8uLi9yZXF1aXJlL2xpYi9tb2R1bGUuanMiLCIuLi8uLi9yZXF1aXJlL2xpYi9pbmRleC5qcyIsIi4uL3NyYy9kZXZlbG9wbWVudC5qcyJdLCJzb3VyY2VzQ29udGVudCI6WyJjb25zb2xlLmxvZygnSGVsbG8gZnJvbSBXZWJTb2NrZXRzIScpXG5jb25zdCB3ZWJTb2NrZXQgPSBuZXcgV2ViU29ja2V0KCd3czovL2xvY2FsaG9zdDo5MzkzJylcblxud2ViU29ja2V0Lm9ub3BlbiA9IGZ1bmN0aW9uKGV2dCkgeyBjb25zb2xlLmxvZygnQ29ubmVjdGlvbiBvcGVuIC4uLicpIH1cbndlYlNvY2tldC5vbm1lc3NhZ2UgPSBmdW5jdGlvbihldnQpIHtcbiAgICBpZiAoZXZ0LmRhdGEgPT09ICdTRVJWRVJfU1RPUCcpIHtcbiAgICAgICAgbG9jYXRpb24ucmVsb2FkKClcbiAgICB9IGVsc2Uge1xuICAgICAgICBjb25zb2xlLmxvZyggJ1JlY2VpdmVkIE1lc3NhZ2U6ICcgKyBldnQuZGF0YSlcbiAgICB9XG59XG53ZWJTb2NrZXQub25jbG9zZSA9IGZ1bmN0aW9uKGV2dCkgeyBjb25zb2xlLmxvZygnQ29ubmVjdGlvbiBjbG9zZWQuJykgfVxuIiwiLyohXG4gKiBvYmplY3QtZXh0ZW5kXG4gKiBBIHdlbGwtdGVzdGVkIGZ1bmN0aW9uIHRvIGRlZXAgZXh0ZW5kIChvciBtZXJnZSkgSmF2YVNjcmlwdCBvYmplY3RzIHdpdGhvdXQgZnVydGhlciBkZXBlbmRlbmNpZXMuXG4gKlxuICogaHR0cDovL2dpdGh1Yi5jb20vYmVybmhhcmR3XG4gKlxuICogQ29weXJpZ2h0IDIwMTMsIEJlcm5oYXJkIFdhbmdlciA8bWFpbEBiZXJuaGFyZHdhbmdlci5jb20+XG4gKiBSZWxlYXNlZCB1bmRlciB0aGUgTUlUIGxpY2Vuc2UuXG4gKlxuICogRGF0ZTogMjAxMy0wNC0xMFxuICovXG5cblxuLyoqXG4gKiBFeHRlbmQgb2JqZWN0IGEgd2l0aCBvYmplY3QgYi5cbiAqXG4gKiBAcGFyYW0ge09iamVjdH0gYSBTb3VyY2Ugb2JqZWN0LlxuICogQHBhcmFtIHtPYmplY3R9IGIgT2JqZWN0IHRvIGV4dGVuZCB3aXRoLlxuICogQHJldHVybnMge09iamVjdH0gYSBFeHRlbmRlZCBvYmplY3QuXG4gKi9cbm1vZHVsZS5leHBvcnRzID0gZnVuY3Rpb24gZXh0ZW5kKGEsIGIpIHtcblxuICAgIC8vIERvbid0IHRvdWNoICdudWxsJyBvciAndW5kZWZpbmVkJyBvYmplY3RzLlxuICAgIGlmIChhID09IG51bGwgfHwgYiA9PSBudWxsKSB7XG4gICAgICAgIHJldHVybiBhO1xuICAgIH1cblxuICAgIC8vIFRPRE86IFJlZmFjdG9yIHRvIHVzZSBmb3ItbG9vcCBmb3IgcGVyZm9ybWFuY2UgcmVhc29ucy5cbiAgICBPYmplY3Qua2V5cyhiKS5mb3JFYWNoKGZ1bmN0aW9uIChrZXkpIHtcblxuICAgICAgICAvLyBEZXRlY3Qgb2JqZWN0IHdpdGhvdXQgYXJyYXksIGRhdGUgb3IgbnVsbC5cbiAgICAgICAgLy8gVE9ETzogUGVyZm9ybWFuY2UgdGVzdDpcbiAgICAgICAgLy8gYSkgYi5jb25zdHJ1Y3RvciA9PT0gT2JqZWN0LnByb3RvdHlwZS5jb25zdHJ1Y3RvclxuICAgICAgICAvLyBiKSBPYmplY3QucHJvdG90eXBlLnRvU3RyaW5nLmNhbGwoYikgPT0gJ1tvYmplY3QgT2JqZWN0XSdcbiAgICAgICAgaWYgKE9iamVjdC5wcm90b3R5cGUudG9TdHJpbmcuY2FsbChiW2tleV0pID09ICdbb2JqZWN0IE9iamVjdF0nKSB7XG4gICAgICAgICAgICBpZiAoT2JqZWN0LnByb3RvdHlwZS50b1N0cmluZy5jYWxsKGFba2V5XSkgIT0gJ1tvYmplY3QgT2JqZWN0XScpIHtcbiAgICAgICAgICAgICAgICBhW2tleV0gPSBiW2tleV07XG4gICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgIGFba2V5XSA9IGV4dGVuZChhW2tleV0sIGJba2V5XSk7XG4gICAgICAgICAgICB9XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICBhW2tleV0gPSBiW2tleV07XG4gICAgICAgIH1cblxuICAgIH0pO1xuXG4gICAgcmV0dXJuIGE7XG5cbn07IiwiLy8gQ29weXJpZ2h0IEpveWVudCwgSW5jLiBhbmQgb3RoZXIgTm9kZSBjb250cmlidXRvcnMuXG4vL1xuLy8gUGVybWlzc2lvbiBpcyBoZXJlYnkgZ3JhbnRlZCwgZnJlZSBvZiBjaGFyZ2UsIHRvIGFueSBwZXJzb24gb2J0YWluaW5nIGFcbi8vIGNvcHkgb2YgdGhpcyBzb2Z0d2FyZSBhbmQgYXNzb2NpYXRlZCBkb2N1bWVudGF0aW9uIGZpbGVzICh0aGVcbi8vIFwiU29mdHdhcmVcIiksIHRvIGRlYWwgaW4gdGhlIFNvZnR3YXJlIHdpdGhvdXQgcmVzdHJpY3Rpb24sIGluY2x1ZGluZ1xuLy8gd2l0aG91dCBsaW1pdGF0aW9uIHRoZSByaWdodHMgdG8gdXNlLCBjb3B5LCBtb2RpZnksIG1lcmdlLCBwdWJsaXNoLFxuLy8gZGlzdHJpYnV0ZSwgc3VibGljZW5zZSwgYW5kL29yIHNlbGwgY29waWVzIG9mIHRoZSBTb2Z0d2FyZSwgYW5kIHRvIHBlcm1pdFxuLy8gcGVyc29ucyB0byB3aG9tIHRoZSBTb2Z0d2FyZSBpcyBmdXJuaXNoZWQgdG8gZG8gc28sIHN1YmplY3QgdG8gdGhlXG4vLyBmb2xsb3dpbmcgY29uZGl0aW9uczpcbi8vXG4vLyBUaGUgYWJvdmUgY29weXJpZ2h0IG5vdGljZSBhbmQgdGhpcyBwZXJtaXNzaW9uIG5vdGljZSBzaGFsbCBiZSBpbmNsdWRlZFxuLy8gaW4gYWxsIGNvcGllcyBvciBzdWJzdGFudGlhbCBwb3J0aW9ucyBvZiB0aGUgU29mdHdhcmUuXG4vL1xuLy8gVEhFIFNPRlRXQVJFIElTIFBST1ZJREVEIFwiQVMgSVNcIiwgV0lUSE9VVCBXQVJSQU5UWSBPRiBBTlkgS0lORCwgRVhQUkVTU1xuLy8gT1IgSU1QTElFRCwgSU5DTFVESU5HIEJVVCBOT1QgTElNSVRFRCBUTyBUSEUgV0FSUkFOVElFUyBPRlxuLy8gTUVSQ0hBTlRBQklMSVRZLCBGSVRORVNTIEZPUiBBIFBBUlRJQ1VMQVIgUFVSUE9TRSBBTkQgTk9OSU5GUklOR0VNRU5ULiBJTlxuLy8gTk8gRVZFTlQgU0hBTEwgVEhFIEFVVEhPUlMgT1IgQ09QWVJJR0hUIEhPTERFUlMgQkUgTElBQkxFIEZPUiBBTlkgQ0xBSU0sXG4vLyBEQU1BR0VTIE9SIE9USEVSIExJQUJJTElUWSwgV0hFVEhFUiBJTiBBTiBBQ1RJT04gT0YgQ09OVFJBQ1QsIFRPUlQgT1Jcbi8vIE9USEVSV0lTRSwgQVJJU0lORyBGUk9NLCBPVVQgT0YgT1IgSU4gQ09OTkVDVElPTiBXSVRIIFRIRSBTT0ZUV0FSRSBPUiBUSEVcbi8vIFVTRSBPUiBPVEhFUiBERUFMSU5HUyBJTiBUSEUgU09GVFdBUkUuXG5cbi8vIHJlc29sdmVzIC4gYW5kIC4uIGVsZW1lbnRzIGluIGEgcGF0aCBhcnJheSB3aXRoIGRpcmVjdG9yeSBuYW1lcyB0aGVyZVxuLy8gbXVzdCBiZSBubyBzbGFzaGVzLCBlbXB0eSBlbGVtZW50cywgb3IgZGV2aWNlIG5hbWVzIChjOlxcKSBpbiB0aGUgYXJyYXlcbi8vIChzbyBhbHNvIG5vIGxlYWRpbmcgYW5kIHRyYWlsaW5nIHNsYXNoZXMgLSBpdCBkb2VzIG5vdCBkaXN0aW5ndWlzaFxuLy8gcmVsYXRpdmUgYW5kIGFic29sdXRlIHBhdGhzKVxuZnVuY3Rpb24gbm9ybWFsaXplQXJyYXkocGFydHMsIGFsbG93QWJvdmVSb290KSB7XG4gIC8vIGlmIHRoZSBwYXRoIHRyaWVzIHRvIGdvIGFib3ZlIHRoZSByb290LCBgdXBgIGVuZHMgdXAgPiAwXG4gIHZhciB1cCA9IDA7XG4gIGZvciAodmFyIGkgPSBwYXJ0cy5sZW5ndGggLSAxOyBpID49IDA7IGktLSkge1xuICAgIHZhciBsYXN0ID0gcGFydHNbaV07XG4gICAgaWYgKGxhc3QgPT09ICcuJykge1xuICAgICAgcGFydHMuc3BsaWNlKGksIDEpO1xuICAgIH0gZWxzZSBpZiAobGFzdCA9PT0gJy4uJykge1xuICAgICAgcGFydHMuc3BsaWNlKGksIDEpO1xuICAgICAgdXArKztcbiAgICB9IGVsc2UgaWYgKHVwKSB7XG4gICAgICBwYXJ0cy5zcGxpY2UoaSwgMSk7XG4gICAgICB1cC0tO1xuICAgIH1cbiAgfVxuXG4gIC8vIGlmIHRoZSBwYXRoIGlzIGFsbG93ZWQgdG8gZ28gYWJvdmUgdGhlIHJvb3QsIHJlc3RvcmUgbGVhZGluZyAuLnNcbiAgaWYgKGFsbG93QWJvdmVSb290KSB7XG4gICAgZm9yICg7IHVwLS07IHVwKSB7XG4gICAgICBwYXJ0cy51bnNoaWZ0KCcuLicpO1xuICAgIH1cbiAgfVxuXG4gIHJldHVybiBwYXJ0cztcbn1cblxuLy8gU3BsaXQgYSBmaWxlbmFtZSBpbnRvIFtyb290LCBkaXIsIGJhc2VuYW1lLCBleHRdLCB1bml4IHZlcnNpb25cbi8vICdyb290JyBpcyBqdXN0IGEgc2xhc2gsIG9yIG5vdGhpbmcuXG52YXIgc3BsaXRQYXRoUmUgPVxuICAgIC9eKFxcLz98KShbXFxzXFxTXSo/KSgoPzpcXC57MSwyfXxbXlxcL10rP3wpKFxcLlteLlxcL10qfCkpKD86W1xcL10qKSQvO1xudmFyIHNwbGl0UGF0aCA9IGZ1bmN0aW9uKGZpbGVuYW1lKSB7XG4gIHJldHVybiBzcGxpdFBhdGhSZS5leGVjKGZpbGVuYW1lKS5zbGljZSgxKTtcbn07XG5cbi8vIHBhdGgucmVzb2x2ZShbZnJvbSAuLi5dLCB0bylcbi8vIHBvc2l4IHZlcnNpb25cbmV4cG9ydCBmdW5jdGlvbiByZXNvbHZlKCkge1xuICB2YXIgcmVzb2x2ZWRQYXRoID0gJycsXG4gICAgICByZXNvbHZlZEFic29sdXRlID0gZmFsc2U7XG5cbiAgZm9yICh2YXIgaSA9IGFyZ3VtZW50cy5sZW5ndGggLSAxOyBpID49IC0xICYmICFyZXNvbHZlZEFic29sdXRlOyBpLS0pIHtcbiAgICB2YXIgcGF0aCA9IChpID49IDApID8gYXJndW1lbnRzW2ldIDogJy8nO1xuXG4gICAgLy8gU2tpcCBlbXB0eSBhbmQgaW52YWxpZCBlbnRyaWVzXG4gICAgaWYgKHR5cGVvZiBwYXRoICE9PSAnc3RyaW5nJykge1xuICAgICAgdGhyb3cgbmV3IFR5cGVFcnJvcignQXJndW1lbnRzIHRvIHBhdGgucmVzb2x2ZSBtdXN0IGJlIHN0cmluZ3MnKTtcbiAgICB9IGVsc2UgaWYgKCFwYXRoKSB7XG4gICAgICBjb250aW51ZTtcbiAgICB9XG5cbiAgICByZXNvbHZlZFBhdGggPSBwYXRoICsgJy8nICsgcmVzb2x2ZWRQYXRoO1xuICAgIHJlc29sdmVkQWJzb2x1dGUgPSBwYXRoLmNoYXJBdCgwKSA9PT0gJy8nO1xuICB9XG5cbiAgLy8gQXQgdGhpcyBwb2ludCB0aGUgcGF0aCBzaG91bGQgYmUgcmVzb2x2ZWQgdG8gYSBmdWxsIGFic29sdXRlIHBhdGgsIGJ1dFxuICAvLyBoYW5kbGUgcmVsYXRpdmUgcGF0aHMgdG8gYmUgc2FmZSAobWlnaHQgaGFwcGVuIHdoZW4gcHJvY2Vzcy5jd2QoKSBmYWlscylcblxuICAvLyBOb3JtYWxpemUgdGhlIHBhdGhcbiAgcmVzb2x2ZWRQYXRoID0gbm9ybWFsaXplQXJyYXkoZmlsdGVyKHJlc29sdmVkUGF0aC5zcGxpdCgnLycpLCBmdW5jdGlvbihwKSB7XG4gICAgcmV0dXJuICEhcDtcbiAgfSksICFyZXNvbHZlZEFic29sdXRlKS5qb2luKCcvJyk7XG5cbiAgcmV0dXJuICgocmVzb2x2ZWRBYnNvbHV0ZSA/ICcvJyA6ICcnKSArIHJlc29sdmVkUGF0aCkgfHwgJy4nO1xufTtcblxuLy8gcGF0aC5ub3JtYWxpemUocGF0aClcbi8vIHBvc2l4IHZlcnNpb25cbmV4cG9ydCBmdW5jdGlvbiBub3JtYWxpemUocGF0aCkge1xuICB2YXIgaXNQYXRoQWJzb2x1dGUgPSBpc0Fic29sdXRlKHBhdGgpLFxuICAgICAgdHJhaWxpbmdTbGFzaCA9IHN1YnN0cihwYXRoLCAtMSkgPT09ICcvJztcblxuICAvLyBOb3JtYWxpemUgdGhlIHBhdGhcbiAgcGF0aCA9IG5vcm1hbGl6ZUFycmF5KGZpbHRlcihwYXRoLnNwbGl0KCcvJyksIGZ1bmN0aW9uKHApIHtcbiAgICByZXR1cm4gISFwO1xuICB9KSwgIWlzUGF0aEFic29sdXRlKS5qb2luKCcvJyk7XG5cbiAgaWYgKCFwYXRoICYmICFpc1BhdGhBYnNvbHV0ZSkge1xuICAgIHBhdGggPSAnLic7XG4gIH1cbiAgaWYgKHBhdGggJiYgdHJhaWxpbmdTbGFzaCkge1xuICAgIHBhdGggKz0gJy8nO1xuICB9XG5cbiAgcmV0dXJuIChpc1BhdGhBYnNvbHV0ZSA/ICcvJyA6ICcnKSArIHBhdGg7XG59O1xuXG4vLyBwb3NpeCB2ZXJzaW9uXG5leHBvcnQgZnVuY3Rpb24gaXNBYnNvbHV0ZShwYXRoKSB7XG4gIHJldHVybiBwYXRoLmNoYXJBdCgwKSA9PT0gJy8nO1xufVxuXG4vLyBwb3NpeCB2ZXJzaW9uXG5leHBvcnQgZnVuY3Rpb24gam9pbigpIHtcbiAgdmFyIHBhdGhzID0gQXJyYXkucHJvdG90eXBlLnNsaWNlLmNhbGwoYXJndW1lbnRzLCAwKTtcbiAgcmV0dXJuIG5vcm1hbGl6ZShmaWx0ZXIocGF0aHMsIGZ1bmN0aW9uKHAsIGluZGV4KSB7XG4gICAgaWYgKHR5cGVvZiBwICE9PSAnc3RyaW5nJykge1xuICAgICAgdGhyb3cgbmV3IFR5cGVFcnJvcignQXJndW1lbnRzIHRvIHBhdGguam9pbiBtdXN0IGJlIHN0cmluZ3MnKTtcbiAgICB9XG4gICAgcmV0dXJuIHA7XG4gIH0pLmpvaW4oJy8nKSk7XG59XG5cblxuLy8gcGF0aC5yZWxhdGl2ZShmcm9tLCB0bylcbi8vIHBvc2l4IHZlcnNpb25cbmV4cG9ydCBmdW5jdGlvbiByZWxhdGl2ZShmcm9tLCB0bykge1xuICBmcm9tID0gcmVzb2x2ZShmcm9tKS5zdWJzdHIoMSk7XG4gIHRvID0gcmVzb2x2ZSh0bykuc3Vic3RyKDEpO1xuXG4gIGZ1bmN0aW9uIHRyaW0oYXJyKSB7XG4gICAgdmFyIHN0YXJ0ID0gMDtcbiAgICBmb3IgKDsgc3RhcnQgPCBhcnIubGVuZ3RoOyBzdGFydCsrKSB7XG4gICAgICBpZiAoYXJyW3N0YXJ0XSAhPT0gJycpIGJyZWFrO1xuICAgIH1cblxuICAgIHZhciBlbmQgPSBhcnIubGVuZ3RoIC0gMTtcbiAgICBmb3IgKDsgZW5kID49IDA7IGVuZC0tKSB7XG4gICAgICBpZiAoYXJyW2VuZF0gIT09ICcnKSBicmVhaztcbiAgICB9XG5cbiAgICBpZiAoc3RhcnQgPiBlbmQpIHJldHVybiBbXTtcbiAgICByZXR1cm4gYXJyLnNsaWNlKHN0YXJ0LCBlbmQgLSBzdGFydCArIDEpO1xuICB9XG5cbiAgdmFyIGZyb21QYXJ0cyA9IHRyaW0oZnJvbS5zcGxpdCgnLycpKTtcbiAgdmFyIHRvUGFydHMgPSB0cmltKHRvLnNwbGl0KCcvJykpO1xuXG4gIHZhciBsZW5ndGggPSBNYXRoLm1pbihmcm9tUGFydHMubGVuZ3RoLCB0b1BhcnRzLmxlbmd0aCk7XG4gIHZhciBzYW1lUGFydHNMZW5ndGggPSBsZW5ndGg7XG4gIGZvciAodmFyIGkgPSAwOyBpIDwgbGVuZ3RoOyBpKyspIHtcbiAgICBpZiAoZnJvbVBhcnRzW2ldICE9PSB0b1BhcnRzW2ldKSB7XG4gICAgICBzYW1lUGFydHNMZW5ndGggPSBpO1xuICAgICAgYnJlYWs7XG4gICAgfVxuICB9XG5cbiAgdmFyIG91dHB1dFBhcnRzID0gW107XG4gIGZvciAodmFyIGkgPSBzYW1lUGFydHNMZW5ndGg7IGkgPCBmcm9tUGFydHMubGVuZ3RoOyBpKyspIHtcbiAgICBvdXRwdXRQYXJ0cy5wdXNoKCcuLicpO1xuICB9XG5cbiAgb3V0cHV0UGFydHMgPSBvdXRwdXRQYXJ0cy5jb25jYXQodG9QYXJ0cy5zbGljZShzYW1lUGFydHNMZW5ndGgpKTtcblxuICByZXR1cm4gb3V0cHV0UGFydHMuam9pbignLycpO1xufVxuXG5leHBvcnQgdmFyIHNlcCA9ICcvJztcbmV4cG9ydCB2YXIgZGVsaW1pdGVyID0gJzonO1xuXG5leHBvcnQgZnVuY3Rpb24gZGlybmFtZShwYXRoKSB7XG4gIHZhciByZXN1bHQgPSBzcGxpdFBhdGgocGF0aCksXG4gICAgICByb290ID0gcmVzdWx0WzBdLFxuICAgICAgZGlyID0gcmVzdWx0WzFdO1xuXG4gIGlmICghcm9vdCAmJiAhZGlyKSB7XG4gICAgLy8gTm8gZGlybmFtZSB3aGF0c29ldmVyXG4gICAgcmV0dXJuICcuJztcbiAgfVxuXG4gIGlmIChkaXIpIHtcbiAgICAvLyBJdCBoYXMgYSBkaXJuYW1lLCBzdHJpcCB0cmFpbGluZyBzbGFzaFxuICAgIGRpciA9IGRpci5zdWJzdHIoMCwgZGlyLmxlbmd0aCAtIDEpO1xuICB9XG5cbiAgcmV0dXJuIHJvb3QgKyBkaXI7XG59XG5cbmV4cG9ydCBmdW5jdGlvbiBiYXNlbmFtZShwYXRoLCBleHQpIHtcbiAgdmFyIGYgPSBzcGxpdFBhdGgocGF0aClbMl07XG4gIC8vIFRPRE86IG1ha2UgdGhpcyBjb21wYXJpc29uIGNhc2UtaW5zZW5zaXRpdmUgb24gd2luZG93cz9cbiAgaWYgKGV4dCAmJiBmLnN1YnN0cigtMSAqIGV4dC5sZW5ndGgpID09PSBleHQpIHtcbiAgICBmID0gZi5zdWJzdHIoMCwgZi5sZW5ndGggLSBleHQubGVuZ3RoKTtcbiAgfVxuICByZXR1cm4gZjtcbn1cblxuXG5leHBvcnQgZnVuY3Rpb24gZXh0bmFtZShwYXRoKSB7XG4gIHJldHVybiBzcGxpdFBhdGgocGF0aClbM107XG59XG5leHBvcnQgZGVmYXVsdCB7XG4gIGV4dG5hbWU6IGV4dG5hbWUsXG4gIGJhc2VuYW1lOiBiYXNlbmFtZSxcbiAgZGlybmFtZTogZGlybmFtZSxcbiAgc2VwOiBzZXAsXG4gIGRlbGltaXRlcjogZGVsaW1pdGVyLFxuICByZWxhdGl2ZTogcmVsYXRpdmUsXG4gIGpvaW46IGpvaW4sXG4gIGlzQWJzb2x1dGU6IGlzQWJzb2x1dGUsXG4gIG5vcm1hbGl6ZTogbm9ybWFsaXplLFxuICByZXNvbHZlOiByZXNvbHZlXG59O1xuZnVuY3Rpb24gZmlsdGVyICh4cywgZikge1xuICAgIGlmICh4cy5maWx0ZXIpIHJldHVybiB4cy5maWx0ZXIoZik7XG4gICAgdmFyIHJlcyA9IFtdO1xuICAgIGZvciAodmFyIGkgPSAwOyBpIDwgeHMubGVuZ3RoOyBpKyspIHtcbiAgICAgICAgaWYgKGYoeHNbaV0sIGksIHhzKSkgcmVzLnB1c2goeHNbaV0pO1xuICAgIH1cbiAgICByZXR1cm4gcmVzO1xufVxuXG4vLyBTdHJpbmcucHJvdG90eXBlLnN1YnN0ciAtIG5lZ2F0aXZlIGluZGV4IGRvbid0IHdvcmsgaW4gSUU4XG52YXIgc3Vic3RyID0gJ2FiJy5zdWJzdHIoLTEpID09PSAnYicgP1xuICAgIGZ1bmN0aW9uIChzdHIsIHN0YXJ0LCBsZW4pIHsgcmV0dXJuIHN0ci5zdWJzdHIoc3RhcnQsIGxlbikgfSA6XG4gICAgZnVuY3Rpb24gKHN0ciwgc3RhcnQsIGxlbikge1xuICAgICAgICBpZiAoc3RhcnQgPCAwKSBzdGFydCA9IHN0ci5sZW5ndGggKyBzdGFydDtcbiAgICAgICAgcmV0dXJuIHN0ci5zdWJzdHIoc3RhcnQsIGxlbik7XG4gICAgfVxuO1xuIiwiY29uc3QgeyBqb2luLCBiYXNlbmFtZSB9ID0gcmVxdWlyZSgncGF0aCcpXG5cbmNvbnN0IGlzRmlsZSA9IChwYXRoKSA9PiAoIGJhc2VuYW1lKHBhdGgpLmluY2x1ZGVzKCcuJykgKVxuXG5jb25zdCByZXNvbHZlRGVzdFBhdGggPSAocGF0aCwgZGVzdCwgYmFzZSkgPT4ge1xuICAgIGlmICh0eXBlb2YgZGVzdCAhPT0gJ3N0cmluZycpIHJldHVybiBhYnNvbHV0ZShwYXRoKVxuICAgIGlmIChpc0ZpbGUoZGVzdCkpIHJldHVybiBhYnNvbHV0ZShkZXN0KVxuICAgIHJldHVybiBqb2luKGFic29sdXRlKGRlc3QpLCBhYnNvbHV0ZShwYXRoKS5yZXBsYWNlKGFic29sdXRlKGJhc2UpLCAnJykpXG59XG5cbmNvbnN0IGlzUmVsYXRpdmUgPSAocGF0aCkgPT4ge1xuICAgIGlmIChwYXRoLmNoYXJBdCgwKSA9PT0gJy4nICYmIChcbiAgICAgICAgcGF0aC5jaGFyQXQoMSkgPT09ICcuJyB8fCBwYXRoLmNoYXJBdCgxKSA9PT0gJy8nKSlcbiAgICAgICAgcmV0dXJuIHRydWVcbiAgICByZXR1cm4gZmFsc2Vcbn1cblxuY29uc3QgaXNBYnNvbHV0ZSA9IChwYXRoKSA9PiB7XG4gICAgaWYgKHBhdGguY2hhckF0KDApID09PSAnLycpIHJldHVybiB0cnVlXG4gICAgcmV0dXJuIGZhbHNlXG59XG5cbmNvbnN0IGFic29sdXRlID0gKHBhdGgpID0+IHtcbiAgICBpZiAoaXNBYnNvbHV0ZShwYXRoKSkgcmV0dXJuIHBhdGhcbiAgICByZXR1cm4gam9pbihnZXRSb290UGF0aCgpLCBwYXRoKVxufVxuXG5jb25zdCByZWxhdGl2ZSA9IChwYXRoKSA9PiB7XG4gICAgaWYgKCFpc0Fic29sdXRlKHBhdGgpKSByZXR1cm4gcGF0aFxuICAgIHJldHVybiBwYXRoLnJlcGxhY2UoZ2V0Um9vdFBhdGgoKSArICcvJyAsICcnKVxufVxuXG5jb25zdCBnZXRSb290UGF0aCA9ICgpID0+IChcbiAgICAoZ2xvYmFsLmV0aGljYWwgJiYgZ2xvYmFsLmV0aGljYWwuY3dkKSB8fCBwcm9jZXNzLmN3ZCgpXG4pXG5cbmV4cG9ydHMuaXNGaWxlID0gaXNGaWxlXG5leHBvcnRzLnJlc29sdmVEZXN0UGF0aCA9IHJlc29sdmVEZXN0UGF0aFxuZXhwb3J0cy5pc1JlbGF0aXZlID0gaXNSZWxhdGl2ZVxuZXhwb3J0cy5pc0Fic29sdXRlID0gaXNBYnNvbHV0ZVxuZXhwb3J0cy5hYnNvbHV0ZSA9IGFic29sdXRlXG5leHBvcnRzLnJlbGF0aXZlID0gcmVsYXRpdmVcbmV4cG9ydHMuZ2V0Um9vdFBhdGggPSBnZXRSb290UGF0aFxuIiwiY29uc3QgaXNOb2RlID0gcmVxdWlyZSgnLi4vLi4vaGVscGVyL2lzLW5vZGUnKVxuY29uc3QgeyBpc1JlbGF0aXZlLCBpc0Fic29sdXRlLCBnZXRSb290UGF0aCB9ID0gcmVxdWlyZSgnLi4vLi4vaGVscGVyL3BhdGgnKVxuY29uc3QgeyBqb2luLCByZXNvbHZlLCBkaXJuYW1lIH0gPSByZXF1aXJlKCdwYXRoJylcblxuY29uc3QgZXh0ZW5zaW9ucyA9IFsnanMnLCAnanNvbicsICdub2RlJ11cblxuY29uc3QgcmVzb2x2ZUFtYmlndW91c1BhdGggPSAocGF0aCkgPT4ge1xuXG4gICAgaWYgKGV4dGVuc2lvbnMuaW5jbHVkZXMoZXh0bmFtZShwYXRoKSkpIHtcbiAgICAgICAgcmV0dXJuIHBhdGhcbiAgICB9XG5cbiAgICBjb25zdCBleHRlbnNpb24gPSBleHRlbnNpb25zLmZpbmQoZXh0ZW5zaW9uID0+IChcbiAgICAgICAgcGF0aEV4aXN0c1N5bmMoYXBwZW5kRXh0ZW5zaW9uKHBhdGgsIGV4dGVuc2lvbikpXG4gICAgKSlcblxuICAgIGlmIChleHRlbnNpb24pIHtcbiAgICAgICAgcmV0dXJuIGFwcGVuZEV4dGVuc2lvbihwYXRoLCBleHRlbnNpb24pXG4gICAgfVxuXG4gICAgY29uc3QgaW5kZXggPSBqb2luKHBhdGgsICdpbmRleC5qcycpXG4gICAgaWYgKHBhdGhFeGlzdHNTeW5jKGluZGV4KSkge1xuICAgICAgICByZXR1cm4gaW5kZXhcbiAgICB9XG5cbiAgICByZXR1cm4gcGF0aFxufVxuXG5jb25zdCBnZXRBcHBQcmVmaXggPSAobW9kdWxlTmFtZSkgPT4gJyYnXG5cbmNvbnN0IGlzQXBwTW9kdWxlID0gKG1vZHVsZU5hbWUpID0+IChcbiAgICBtb2R1bGVOYW1lLmNoYXJBdCgwKSA9PT0gZ2V0QXBwUHJlZml4KClcbilcblxuY29uc3QgaXNQYWNrYWdlID0gKG5hbWUpID0+IHtcbiAgICBpZiAoaXNSZWxhdGl2ZShuYW1lKSB8fCBpc0Fic29sdXRlKG5hbWUpKSByZXR1cm4gZmFsc2VcbiAgICByZXR1cm4gdHJ1ZVxufVxuXG5jb25zdCBpc0Fic29sdXRlUGFja2FnZSA9IChuYW1lKSA9PiB7XG4gICAgaWYgKGlzUGFja2FnZShuYW1lKSAmJiBuYW1lLmluZGV4T2YoJy8nKSA9PT0gLTEpXG4gICAgICAgIHJldHVybiB0cnVlXG4gICAgcmV0dXJuIGZhbHNlXG59XG5cbmNvbnN0IGlzUmVsYXRpdmVQYWNrYWdlID0gKG5hbWUpID0+IHtcbiAgICBpZiAobmFtZS5pbmRleE9mKCcvJykgPiAtMSAmJiBpc1BhY2thZ2UobmFtZSkpIHJldHVybiB0cnVlXG4gICAgcmV0dXJuIGZhbHNlXG59XG5cbmNvbnN0IGFwcGVuZEV4dGVuc2lvbiA9IChuYW1lLCBleHRlbnNpb24gPSAnanMnKSA9PiB7XG4gICAgaWYgKGlzQWJzb2x1dGVQYWNrYWdlKG5hbWUpKSByZXR1cm4gbmFtZVxuICAgIGNvbnN0IGV4dCA9ICcuJyArIGV4dGVuc2lvblxuICAgIGlmIChuYW1lLnNsaWNlKC0oZXh0Lmxlbmd0aCkpID09PSBleHQpIHJldHVybiBuYW1lXG4gICAgcmV0dXJuIG5hbWUgKyBleHRcbn1cblxuY29uc3QgZ2V0UmVxdWlyZSA9ICgpID0+IHtcbiAgICBpZiAoaXNOb2RlKCkpIHJldHVybiByZXF1aXJlXG4gICAgcmV0dXJuIHdpbmRvdy5yZXF1aXJlXG59XG5cbmNvbnN0IHJlc29sdmVNb2R1bGVOYW1lID0gKG1vZHVsZSkgPT4ge1xuICAgIGlmIChpc0FwcE1vZHVsZShtb2R1bGUpKSB7XG4gICAgICAgIHJldHVybiBqb2luKGdldFJvb3RQYXRoKCksIHJlcGxhY2UoZ2V0QXBwUHJlZml4KCksICcnKSlcbiAgICB9XG4gICAgaWYgKGlzUmVsYXRpdmUobW9kdWxlKSkgcmV0dXJuIGpvaW4oZ2V0Um9vdFBhdGgoKSwgbW9kdWxlKVxuICAgIHJldHVybiBtb2R1bGVcbn1cblxuY29uc3QgcmVxdWlyZU1vZHVsZSA9IChuYW1lKSA9PiB7XG4gICAgY29uc3QgcGF0aCA9ICggaXNOb2RlKCkgPyByZXNvbHZlTW9kdWxlTmFtZShuYW1lKSA6IG5hbWUgKVxuICAgIHJldHVybiBnZXRSZXF1aXJlKCkocGF0aClcbn1cblxuZXhwb3J0cy5leHRlbnNpb25zID0gZXh0ZW5zaW9uc1xuZXhwb3J0cy5nZXRBcHBQcmVmaXggPSBnZXRBcHBQcmVmaXhcbmV4cG9ydHMuaXNBcHBNb2R1bGUgPSBpc0FwcE1vZHVsZVxuZXhwb3J0cy5pc1BhY2thZ2UgPSBpc1BhY2thZ2VcbmV4cG9ydHMuaXNBYnNvbHV0ZVBhY2thZ2UgPSBpc0Fic29sdXRlUGFja2FnZVxuZXhwb3J0cy5pc1JlbGF0aXZlUGFja2FnZSA9IGlzUmVsYXRpdmVQYWNrYWdlXG5leHBvcnRzLmFwcGVuZEV4dGVuc2lvbiA9IGFwcGVuZEV4dGVuc2lvblxuZXhwb3J0cy5nZXRSZXF1aXJlID0gZ2V0UmVxdWlyZVxuZXhwb3J0cy5yZXNvbHZlTW9kdWxlTmFtZSA9IHJlc29sdmVNb2R1bGVOYW1lXG5leHBvcnRzLnJlcXVpcmVNb2R1bGUgPSByZXF1aXJlTW9kdWxlXG5leHBvcnRzLnJlc29sdmVBbWJpZ3VvdXNQYXRoID0gcmVzb2x2ZUFtYmlndW91c1BhdGhcbiIsImltcG9ydCB7IGpvaW4sIHJlc29sdmUsIGRpcm5hbWUgfSBmcm9tICdwYXRoJ1xuaW1wb3J0IHtcbiAgICBpc1BhY2thZ2UsXG4gICAgaXNBYnNvbHV0ZVBhY2thZ2UsXG4gICAgYXBwZW5kRXh0ZW5zaW9uLFxuICAgIGdldEFwcFByZWZpeCxcbiAgICBleHRlbnNpb25zXG59IGZyb20gJy4uLy4uLy4uL2hlbHBlci9yZXNvbHZlJ1xuXG5jb25zdCBjYWNoZSA9IHt9XG5cbmNvbnN0IHJlc29sdmVFeHBvcnRzID0gKGZpbGUpID0+IHtcblxuICAgIGlmIChjYWNoZVtmaWxlXSkge1xuICAgICAgICByZXR1cm4gY2FjaGVbZmlsZV1cbiAgICB9XG5cbiAgICBjb25zdCBkZWZpbmVkTW9kdWxlID0gcmVxdWlyZS5kZWZpbmVkW2ZpbGVdXG5cbiAgICBpZiAoZGVmaW5lZE1vZHVsZSkge1xuICAgICAgICBjb25zdCBsb2NhbFJlcXVpcmUgPSBjcmVhdGVMb2NhbFJlcXVpcmUoZmlsZSlcbiAgICAgICAgY29uc3QgbW9kdWxlID0gY2FjaGVbZmlsZV0gPSB7IGV4cG9ydHM6IHt9IH1cblxuICAgICAgICBkZWZpbmVkTW9kdWxlLmNhbGwobW9kdWxlLmV4cG9ydHMsIG1vZHVsZS5leHBvcnRzLCBsb2NhbFJlcXVpcmUsIG1vZHVsZSlcblxuICAgICAgICByZXR1cm4gbW9kdWxlXG4gICAgfVxuXG4gICAgcmV0dXJuIG51bGxcbn1cblxuY29uc3QgbG9hZCA9IChyZXF1ZXN0LCBwYXJlbnQgPSBnZXRBcHBQcmVmaXgoKSkgPT4ge1xuICAgIGNvbnN0IHJlcXVpcmUgPSB3aW5kb3cucmVxdWlyZVxuICAgIGNvbnN0IG1hcElEID0gZ2V0TW9kdWxlUm9vdChwYXJlbnQpXG4gICAgY29uc3QgcmVtYXBwZWQgPSByZXF1ZXN0TWFwKHJlcXVpcmUuYnJvd3Nlck1hcCwgcmVxdWVzdCwgbWFwSUQpXG4gICAgY29uc3QgY29uZmxpY3RlZCA9IHJlcXVlc3RNYXAocmVxdWlyZS5jb25mbGljdE1hcCwgcmVtYXBwZWQsIG1hcElEKVxuICAgIGNvbnN0IGtleSA9IHJlc29sdmVGaWxlbmFtZShjb25mbGljdGVkLCBwYXJlbnQpXG5cbiAgICBmb3IgKGxldCBpID0gMDsgaSA8IGV4dGVuc2lvbnMubGVuZ3RoOyBpKyspIHtcbiAgICAgICAgY29uc3QgZmlsZSA9IGFwcGVuZEV4dGVuc2lvbihrZXksIGV4dGVuc2lvbnNbaV0pXG4gICAgICAgIGNvbnN0IG1vZHVsZSA9IHJlc29sdmVFeHBvcnRzKGZpbGUpXG4gICAgICAgIGlmIChtb2R1bGUpIHtcbiAgICAgICAgICAgIHJldHVybiBtb2R1bGUuZXhwb3J0c1xuICAgICAgICB9XG4gICAgfVxuXG4gICAgZm9yIChsZXQgaSA9IDA7IGkgPCBleHRlbnNpb25zLmxlbmd0aDsgaSsrKSB7XG4gICAgICAgIGNvbnN0IGZpbGUgPSBhcHBlbmRFeHRlbnNpb24oam9pbihrZXksICdpbmRleCcpLCBleHRlbnNpb25zW2ldKVxuICAgICAgICBjb25zdCBtb2R1bGUgPSByZXNvbHZlRXhwb3J0cyhmaWxlKVxuICAgICAgICBpZiAobW9kdWxlKSB7XG4gICAgICAgICAgICByZXR1cm4gbW9kdWxlLmV4cG9ydHNcbiAgICAgICAgfVxuICAgIH1cblxuICAgIGNvbnN0IGVycm9yID0gbmV3IEVycm9yKGBDYW5ub3QgZmluZCBtb2R1bGUgXCIke2tleX1cIiBmcm9tIFwiJHtwYXJlbnR9XCJgKVxuICAgIGVycm9yLmNvZGUgPSAnTU9EVUxFX05PVF9GT1VORCdcbiAgICB0aHJvdyBlcnJvclxufVxuXG5jb25zdCByZXF1ZXN0TWFwID0gKG1hcCwgcmVxdWVzdCwgaWQpID0+IHtcbiAgICBjb25zdCBtYXBwZWQgPSBtYXBbaWRdICYmIG1hcFtpZF1bcmVxdWVzdF1cbiAgICByZXR1cm4gbWFwcGVkIHx8IHJlcXVlc3Rcbn1cblxuY29uc3QgZ2V0TW9kdWxlUm9vdCA9IChwYXRoKSA9PiB7XG4gICAgY29uc3Qgbm9kZU1vZHVsZXMgPSAnbm9kZV9tb2R1bGVzJ1xuICAgIGNvbnN0IHBhcnRzID0gcGF0aC5zcGxpdCgnLycpXG4gICAgY29uc3QgaW5kZXggPSBwYXJ0cy5sYXN0SW5kZXhPZihub2RlTW9kdWxlcylcbiAgICBpZiAoaW5kZXggPT09IC0xKSB7XG4gICAgICAgIHJldHVybiBwYXJ0c1swXVxuICAgIH1cbiAgICByZXR1cm4gcGFydHMuc2xpY2UoMCwgaW5kZXggKyAyKS5qb2luKCcvJylcbn1cblxuY29uc3QgcmVzb2x2ZUZpbGVuYW1lID0gKGtleSwgcGFyZW50KSA9PiB7XG4gICAgaWYgKGlzQWJzb2x1dGVQYWNrYWdlKGtleSkpIHtcbiAgICAgICAgcmV0dXJuIGtleVxuICAgIH1cblxuICAgIGlmIChpc1BhY2thZ2Uoa2V5KSkge1xuICAgICAgICByZXR1cm4ga2V5XG4gICAgfVxuXG4gICAgY29uc3QgeyBhbGlhcyB9ID0gd2luZG93LnJlcXVpcmVcbiAgICBjb25zdCBwYXJlbnRBbGlhcyA9IChhbGlhc1twYXJlbnRdID8gYWxpYXNbcGFyZW50XSA6IHBhcmVudClcbiAgICBjb25zdCBwYXJlbnRGaWxlID0gYXBwZW5kRXh0ZW5zaW9uKHBhcmVudEFsaWFzKVxuICAgIGNvbnN0IGRpcmVjdG9yeSA9IGRpcm5hbWUocGFyZW50RmlsZSlcblxuICAgIHJldHVybiBqb2luKGRpcmVjdG9yeSwga2V5KVxufVxuXG5leHBvcnQgeyBsb2FkIH1cblxuY29uc3QgY3JlYXRlTG9jYWxSZXF1aXJlID0gcGFyZW50ID0+IGtleSA9PiB3aW5kb3cucmVxdWlyZShrZXksIHBhcmVudClcbiIsImltcG9ydCBleHRlbmQgZnJvbSAnb2JqZWN0LWV4dGVuZCdcbmltcG9ydCAqIGFzIE1vZHVsZSBmcm9tICcuL21vZHVsZS5qcydcblxuY29uc3QgZXZhbE1vZHVsZXMgPSAobW9kdWxlcykgPT4ge1xuICAgIG1vZHVsZXMuZm9yRWFjaChtb2R1bGUgPT4ge1xuICAgICAgICBjb25zdCByZXF1aXJlID0gd2luZG93LnJlcXVpcmVcbiAgICAgICAgY29uc3QgeyBpZCwga2V5LCBhbGlhcywgc291cmNlIH0gPSBtb2R1bGVcblxuICAgICAgICByZXF1aXJlLmRlZmluZVNvdXJjZShrZXksIHNvdXJjZSlcbiAgICAgICAgcmVxdWlyZS5pZHMucHVzaChpZClcblxuICAgICAgICBpZiAoYWxpYXMpIHJlcXVpcmUuYWxpYXNba2V5XSA9IGFsaWFzXG4gICAgfSlcbn1cblxuY29uc3QgZW5hYmxlQnJvd3NlclJlcXVpcmUgPSAobW9kdWxlcykgPT4ge1xuXG4gICAgY29uc3QgcmVxdWlyZSA9IChyZXF1ZXN0LCBsb2FkZXJQYXRoKSA9PiAoIE1vZHVsZS5sb2FkKHJlcXVlc3QsIGxvYWRlclBhdGgpIClcblxuICAgIHJlcXVpcmUuZGVmaW5lZCA9IHt9XG4gICAgcmVxdWlyZS5pZHMgPSBbXVxuICAgIHJlcXVpcmUuYWxpYXMgPSB7fVxuICAgIHJlcXVpcmUuYnJvd3Nlck1hcCA9IHt9XG4gICAgcmVxdWlyZS5jb25mbGljdE1hcCA9IHt9XG4gICAgcmVxdWlyZS5kZWZpbmUgPSAobW9kdWxlLCBmbikgPT4gcmVxdWlyZS5kZWZpbmVkW21vZHVsZV0gPSBmblxuICAgIHJlcXVpcmUuZGVmaW5lU291cmNlID0gKGtleSwgc291cmNlKSA9PiB7XG4gICAgICAgIGNvbnN0IHdyYXBwZWRNb2R1bGUgPSBldmFsKFxuICAgICAgICAgICAgJyhmdW5jdGlvbihleHBvcnRzLHJlcXVpcmUsbW9kdWxlKXsnICtcbiAgICAgICAgICAgICAgICAoc291cmNlICsgJ1xcbicpICtcbiAgICAgICAgICAgICd9KS5iaW5kKHdpbmRvdyknXG4gICAgICAgIClcbiAgICAgICAgcmVxdWlyZS5kZWZpbmUoa2V5LCB3cmFwcGVkTW9kdWxlKVxuICAgIH1cbiAgICByZXF1aXJlLmxvYWQgPSAodXJsKSA9PiAoXG4gICAgICAgIHdpbmRvdy5mZXRjaCh1cmwpXG4gICAgICAgIC50aGVuKHJlc3BvbnNlID0+IHJlc3BvbnNlLmpzb24oKSlcbiAgICAgICAgLnRoZW4oKHsgYnJvd3Nlck1hcCwgY29uZmxpY3RNYXAsIG1vZHVsZXMgfSkgPT4ge1xuICAgICAgICAgICAgcmVxdWlyZS5icm93c2VyTWFwID0gZXh0ZW5kKHJlcXVpcmUuYnJvd3Nlck1hcCwgYnJvd3Nlck1hcClcbiAgICAgICAgICAgIHJlcXVpcmUuY29uZmxpY3RNYXAgPSBleHRlbmQocmVxdWlyZS5jb25mbGljdE1hcCwgY29uZmxpY3RNYXApXG4gICAgICAgICAgICBldmFsTW9kdWxlcyhtb2R1bGVzKVxuICAgICAgICB9KVxuICAgICAgICAuY2F0Y2goZSA9PiBjb25zb2xlLmVycm9yKGUpKVxuICAgIClcblxuICAgIHdpbmRvdy5yZXF1aXJlID0gcmVxdWlyZVxuXG4gICAgaWYgKG1vZHVsZXMpIGV2YWxNb2R1bGVzKG1vZHVsZXMpXG59XG5cbmV4cG9ydCBkZWZhdWx0IGVuYWJsZUJyb3dzZXJSZXF1aXJlXG5cbi8vIEluc3BpcmVkIGJ5OlxuLy8gaHR0cHM6Ly9naXRodWIuY29tL2VmYWNpbGl0YXRpb24vY29tbW9uanMtcmVxdWlyZVxuIiwiaW1wb3J0ICcuLi8uLi9kZXYnXG5pbXBvcnQgZW5hYmxlQnJvd3NlclJlcXVpcmUgZnJvbSAnLi4vLi4vcmVxdWlyZSdcbmVuYWJsZUJyb3dzZXJSZXF1aXJlKClcbiJdLCJuYW1lcyI6WyJjb25zb2xlIiwibG9nIiwid2ViU29ja2V0IiwiV2ViU29ja2V0Iiwib25vcGVuIiwiZXZ0Iiwib25tZXNzYWdlIiwiZGF0YSIsInJlbG9hZCIsIm9uY2xvc2UiLCJleHRuYW1lIiwiam9pbiIsImJhc2VuYW1lIiwiaXNGaWxlIiwicGF0aCIsImluY2x1ZGVzIiwicmVzb2x2ZURlc3RQYXRoIiwiZGVzdCIsImJhc2UiLCJhYnNvbHV0ZSIsInJlcGxhY2UiLCJpc1JlbGF0aXZlIiwiY2hhckF0IiwiaXNBYnNvbHV0ZSIsImdldFJvb3RQYXRoIiwicmVsYXRpdmUiLCJnbG9iYWwiLCJldGhpY2FsIiwiY3dkIiwicHJvY2VzcyIsImV4cG9ydHMiLCJyZXNvbHZlIiwiZGlybmFtZSIsImV4dGVuc2lvbnMiLCJnZXRBcHBQcmVmaXgiLCJtb2R1bGVOYW1lIiwiaXNQYWNrYWdlIiwibmFtZSIsImlzQWJzb2x1dGVQYWNrYWdlIiwiaW5kZXhPZiIsImFwcGVuZEV4dGVuc2lvbiIsImV4dGVuc2lvbiIsImV4dCIsInNsaWNlIiwibGVuZ3RoIiwiY2FjaGUiLCJyZXNvbHZlRXhwb3J0cyIsImZpbGUiLCJkZWZpbmVkTW9kdWxlIiwicmVxdWlyZSIsImRlZmluZWQiLCJsb2NhbFJlcXVpcmUiLCJjcmVhdGVMb2NhbFJlcXVpcmUiLCJtb2R1bGUiLCJjYWxsIiwibG9hZCIsInJlcXVlc3QiLCJwYXJlbnQiLCJ3aW5kb3ciLCJtYXBJRCIsImdldE1vZHVsZVJvb3QiLCJyZW1hcHBlZCIsInJlcXVlc3RNYXAiLCJicm93c2VyTWFwIiwiY29uZmxpY3RlZCIsImNvbmZsaWN0TWFwIiwia2V5IiwicmVzb2x2ZUZpbGVuYW1lIiwiaSIsImVycm9yIiwiRXJyb3IiLCJjb2RlIiwibWFwIiwiaWQiLCJtYXBwZWQiLCJub2RlTW9kdWxlcyIsInBhcnRzIiwic3BsaXQiLCJpbmRleCIsImxhc3RJbmRleE9mIiwiYWxpYXMiLCJwYXJlbnRBbGlhcyIsInBhcmVudEZpbGUiLCJkaXJlY3RvcnkiLCJldmFsTW9kdWxlcyIsIm1vZHVsZXMiLCJmb3JFYWNoIiwic291cmNlIiwiZGVmaW5lU291cmNlIiwiaWRzIiwicHVzaCIsImVuYWJsZUJyb3dzZXJSZXF1aXJlIiwibG9hZGVyUGF0aCIsIk1vZHVsZSIsImRlZmluZSIsImZuIiwid3JhcHBlZE1vZHVsZSIsImV2YWwiLCJ1cmwiLCJmZXRjaCIsInRoZW4iLCJyZXNwb25zZSIsImpzb24iLCJleHRlbmQiLCJjYXRjaCIsImUiXSwibWFwcGluZ3MiOiI7Ozs7OztBQUFBQSxRQUFRQyxHQUFSLENBQVksd0JBQVo7QUFDQSxJQUFNQyxZQUFZLElBQUlDLFNBQUosQ0FBYyxxQkFBZCxDQUFsQjs7QUFFQUQsVUFBVUUsTUFBVixHQUFtQixVQUFTQyxHQUFULEVBQWM7WUFBVUosR0FBUixDQUFZLHFCQUFaO0NBQW5DO0FBQ0FDLFVBQVVJLFNBQVYsR0FBc0IsVUFBU0QsR0FBVCxFQUFjO1FBQzVCQSxJQUFJRSxJQUFKLEtBQWEsYUFBakIsRUFBZ0M7aUJBQ25CQyxNQUFUO0tBREosTUFFTztnQkFDS1AsR0FBUixDQUFhLHVCQUF1QkksSUFBSUUsSUFBeEM7O0NBSlI7QUFPQUwsVUFBVU8sT0FBVixHQUFvQixVQUFTSixHQUFULEVBQWM7WUFBVUosR0FBUixDQUFZLG9CQUFaO0NBQXBDOztBQ1hBOzs7Ozs7Ozs7Ozs7Ozs7Ozs7OztBQW9CQSxVQUFjLEdBQUcsU0FBUyxNQUFNLENBQUMsQ0FBQyxFQUFFLENBQUMsRUFBRTs7O0lBR25DLElBQUksQ0FBQyxJQUFJLElBQUksSUFBSSxDQUFDLElBQUksSUFBSSxFQUFFO1FBQ3hCLE9BQU8sQ0FBQyxDQUFDO0tBQ1o7OztJQUdELE1BQU0sQ0FBQyxJQUFJ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
