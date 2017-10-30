(function (global, factory) {
	typeof exports === 'object' && typeof module !== 'undefined' ? factory() :
	typeof define === 'function' && define.amd ? define(factory) :
	(factory());
}(this, (function () { 'use strict';

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
    return process.cwd();
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
    return '~';
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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZGV2ZWxvcG1lbnQuanMiLCJzb3VyY2VzIjpbIi4uLy4uLy4uL25vZGVfbW9kdWxlcy9vYmplY3QtZXh0ZW5kL2xpYi9leHRlbmQuanMiLCIuLi8uLi8uLi9ub2RlX21vZHVsZXMvcm9sbHVwLXBsdWdpbi1ub2RlLWJ1aWx0aW5zL3NyYy9lczYvcGF0aC5qcyIsIi4uLy4uLy4uL2hlbHBlci9wYXRoL2luZGV4LmpzIiwiLi4vLi4vLi4vaGVscGVyL3Jlc29sdmUvaW5kZXguanMiLCIuLi8uLi9yZXF1aXJlL2xpYi9tb2R1bGUuanMiLCIuLi8uLi9yZXF1aXJlL2xpYi9pbmRleC5qcyIsIi4uL3NyYy9kZXZlbG9wbWVudC5qcyJdLCJzb3VyY2VzQ29udGVudCI6WyIvKiFcbiAqIG9iamVjdC1leHRlbmRcbiAqIEEgd2VsbC10ZXN0ZWQgZnVuY3Rpb24gdG8gZGVlcCBleHRlbmQgKG9yIG1lcmdlKSBKYXZhU2NyaXB0IG9iamVjdHMgd2l0aG91dCBmdXJ0aGVyIGRlcGVuZGVuY2llcy5cbiAqXG4gKiBodHRwOi8vZ2l0aHViLmNvbS9iZXJuaGFyZHdcbiAqXG4gKiBDb3B5cmlnaHQgMjAxMywgQmVybmhhcmQgV2FuZ2VyIDxtYWlsQGJlcm5oYXJkd2FuZ2VyLmNvbT5cbiAqIFJlbGVhc2VkIHVuZGVyIHRoZSBNSVQgbGljZW5zZS5cbiAqXG4gKiBEYXRlOiAyMDEzLTA0LTEwXG4gKi9cblxuXG4vKipcbiAqIEV4dGVuZCBvYmplY3QgYSB3aXRoIG9iamVjdCBiLlxuICpcbiAqIEBwYXJhbSB7T2JqZWN0fSBhIFNvdXJjZSBvYmplY3QuXG4gKiBAcGFyYW0ge09iamVjdH0gYiBPYmplY3QgdG8gZXh0ZW5kIHdpdGguXG4gKiBAcmV0dXJucyB7T2JqZWN0fSBhIEV4dGVuZGVkIG9iamVjdC5cbiAqL1xubW9kdWxlLmV4cG9ydHMgPSBmdW5jdGlvbiBleHRlbmQoYSwgYikge1xuXG4gICAgLy8gRG9uJ3QgdG91Y2ggJ251bGwnIG9yICd1bmRlZmluZWQnIG9iamVjdHMuXG4gICAgaWYgKGEgPT0gbnVsbCB8fCBiID09IG51bGwpIHtcbiAgICAgICAgcmV0dXJuIGE7XG4gICAgfVxuXG4gICAgLy8gVE9ETzogUmVmYWN0b3IgdG8gdXNlIGZvci1sb29wIGZvciBwZXJmb3JtYW5jZSByZWFzb25zLlxuICAgIE9iamVjdC5rZXlzKGIpLmZvckVhY2goZnVuY3Rpb24gKGtleSkge1xuXG4gICAgICAgIC8vIERldGVjdCBvYmplY3Qgd2l0aG91dCBhcnJheSwgZGF0ZSBvciBudWxsLlxuICAgICAgICAvLyBUT0RPOiBQZXJmb3JtYW5jZSB0ZXN0OlxuICAgICAgICAvLyBhKSBiLmNvbnN0cnVjdG9yID09PSBPYmplY3QucHJvdG90eXBlLmNvbnN0cnVjdG9yXG4gICAgICAgIC8vIGIpIE9iamVjdC5wcm90b3R5cGUudG9TdHJpbmcuY2FsbChiKSA9PSAnW29iamVjdCBPYmplY3RdJ1xuICAgICAgICBpZiAoT2JqZWN0LnByb3RvdHlwZS50b1N0cmluZy5jYWxsKGJba2V5XSkgPT0gJ1tvYmplY3QgT2JqZWN0XScpIHtcbiAgICAgICAgICAgIGlmIChPYmplY3QucHJvdG90eXBlLnRvU3RyaW5nLmNhbGwoYVtrZXldKSAhPSAnW29iamVjdCBPYmplY3RdJykge1xuICAgICAgICAgICAgICAgIGFba2V5XSA9IGJba2V5XTtcbiAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgYVtrZXldID0gZXh0ZW5kKGFba2V5XSwgYltrZXldKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIGFba2V5XSA9IGJba2V5XTtcbiAgICAgICAgfVxuXG4gICAgfSk7XG5cbiAgICByZXR1cm4gYTtcblxufTsiLCIvLyBDb3B5cmlnaHQgSm95ZW50LCBJbmMuIGFuZCBvdGhlciBOb2RlIGNvbnRyaWJ1dG9ycy5cbi8vXG4vLyBQZXJtaXNzaW9uIGlzIGhlcmVieSBncmFudGVkLCBmcmVlIG9mIGNoYXJnZSwgdG8gYW55IHBlcnNvbiBvYnRhaW5pbmcgYVxuLy8gY29weSBvZiB0aGlzIHNvZnR3YXJlIGFuZCBhc3NvY2lhdGVkIGRvY3VtZW50YXRpb24gZmlsZXMgKHRoZVxuLy8gXCJTb2Z0d2FyZVwiKSwgdG8gZGVhbCBpbiB0aGUgU29mdHdhcmUgd2l0aG91dCByZXN0cmljdGlvbiwgaW5jbHVkaW5nXG4vLyB3aXRob3V0IGxpbWl0YXRpb24gdGhlIHJpZ2h0cyB0byB1c2UsIGNvcHksIG1vZGlmeSwgbWVyZ2UsIHB1Ymxpc2gsXG4vLyBkaXN0cmlidXRlLCBzdWJsaWNlbnNlLCBhbmQvb3Igc2VsbCBjb3BpZXMgb2YgdGhlIFNvZnR3YXJlLCBhbmQgdG8gcGVybWl0XG4vLyBwZXJzb25zIHRvIHdob20gdGhlIFNvZnR3YXJlIGlzIGZ1cm5pc2hlZCB0byBkbyBzbywgc3ViamVjdCB0byB0aGVcbi8vIGZvbGxvd2luZyBjb25kaXRpb25zOlxuLy9cbi8vIFRoZSBhYm92ZSBjb3B5cmlnaHQgbm90aWNlIGFuZCB0aGlzIHBlcm1pc3Npb24gbm90aWNlIHNoYWxsIGJlIGluY2x1ZGVkXG4vLyBpbiBhbGwgY29waWVzIG9yIHN1YnN0YW50aWFsIHBvcnRpb25zIG9mIHRoZSBTb2Z0d2FyZS5cbi8vXG4vLyBUSEUgU09GVFdBUkUgSVMgUFJPVklERUQgXCJBUyBJU1wiLCBXSVRIT1VUIFdBUlJBTlRZIE9GIEFOWSBLSU5ELCBFWFBSRVNTXG4vLyBPUiBJTVBMSUVELCBJTkNMVURJTkcgQlVUIE5PVCBMSU1JVEVEIFRPIFRIRSBXQVJSQU5USUVTIE9GXG4vLyBNRVJDSEFOVEFCSUxJVFksIEZJVE5FU1MgRk9SIEEgUEFSVElDVUxBUiBQVVJQT1NFIEFORCBOT05JTkZSSU5HRU1FTlQuIElOXG4vLyBOTyBFVkVOVCBTSEFMTCBUSEUgQVVUSE9SUyBPUiBDT1BZUklHSFQgSE9MREVSUyBCRSBMSUFCTEUgRk9SIEFOWSBDTEFJTSxcbi8vIERBTUFHRVMgT1IgT1RIRVIgTElBQklMSVRZLCBXSEVUSEVSIElOIEFOIEFDVElPTiBPRiBDT05UUkFDVCwgVE9SVCBPUlxuLy8gT1RIRVJXSVNFLCBBUklTSU5HIEZST00sIE9VVCBPRiBPUiBJTiBDT05ORUNUSU9OIFdJVEggVEhFIFNPRlRXQVJFIE9SIFRIRVxuLy8gVVNFIE9SIE9USEVSIERFQUxJTkdTIElOIFRIRSBTT0ZUV0FSRS5cblxuLy8gcmVzb2x2ZXMgLiBhbmQgLi4gZWxlbWVudHMgaW4gYSBwYXRoIGFycmF5IHdpdGggZGlyZWN0b3J5IG5hbWVzIHRoZXJlXG4vLyBtdXN0IGJlIG5vIHNsYXNoZXMsIGVtcHR5IGVsZW1lbnRzLCBvciBkZXZpY2UgbmFtZXMgKGM6XFwpIGluIHRoZSBhcnJheVxuLy8gKHNvIGFsc28gbm8gbGVhZGluZyBhbmQgdHJhaWxpbmcgc2xhc2hlcyAtIGl0IGRvZXMgbm90IGRpc3Rpbmd1aXNoXG4vLyByZWxhdGl2ZSBhbmQgYWJzb2x1dGUgcGF0aHMpXG5mdW5jdGlvbiBub3JtYWxpemVBcnJheShwYXJ0cywgYWxsb3dBYm92ZVJvb3QpIHtcbiAgLy8gaWYgdGhlIHBhdGggdHJpZXMgdG8gZ28gYWJvdmUgdGhlIHJvb3QsIGB1cGAgZW5kcyB1cCA+IDBcbiAgdmFyIHVwID0gMDtcbiAgZm9yICh2YXIgaSA9IHBhcnRzLmxlbmd0aCAtIDE7IGkgPj0gMDsgaS0tKSB7XG4gICAgdmFyIGxhc3QgPSBwYXJ0c1tpXTtcbiAgICBpZiAobGFzdCA9PT0gJy4nKSB7XG4gICAgICBwYXJ0cy5zcGxpY2UoaSwgMSk7XG4gICAgfSBlbHNlIGlmIChsYXN0ID09PSAnLi4nKSB7XG4gICAgICBwYXJ0cy5zcGxpY2UoaSwgMSk7XG4gICAgICB1cCsrO1xuICAgIH0gZWxzZSBpZiAodXApIHtcbiAgICAgIHBhcnRzLnNwbGljZShpLCAxKTtcbiAgICAgIHVwLS07XG4gICAgfVxuICB9XG5cbiAgLy8gaWYgdGhlIHBhdGggaXMgYWxsb3dlZCB0byBnbyBhYm92ZSB0aGUgcm9vdCwgcmVzdG9yZSBsZWFkaW5nIC4uc1xuICBpZiAoYWxsb3dBYm92ZVJvb3QpIHtcbiAgICBmb3IgKDsgdXAtLTsgdXApIHtcbiAgICAgIHBhcnRzLnVuc2hpZnQoJy4uJyk7XG4gICAgfVxuICB9XG5cbiAgcmV0dXJuIHBhcnRzO1xufVxuXG4vLyBTcGxpdCBhIGZpbGVuYW1lIGludG8gW3Jvb3QsIGRpciwgYmFzZW5hbWUsIGV4dF0sIHVuaXggdmVyc2lvblxuLy8gJ3Jvb3QnIGlzIGp1c3QgYSBzbGFzaCwgb3Igbm90aGluZy5cbnZhciBzcGxpdFBhdGhSZSA9XG4gICAgL14oXFwvP3wpKFtcXHNcXFNdKj8pKCg/OlxcLnsxLDJ9fFteXFwvXSs/fCkoXFwuW14uXFwvXSp8KSkoPzpbXFwvXSopJC87XG52YXIgc3BsaXRQYXRoID0gZnVuY3Rpb24oZmlsZW5hbWUpIHtcbiAgcmV0dXJuIHNwbGl0UGF0aFJlLmV4ZWMoZmlsZW5hbWUpLnNsaWNlKDEpO1xufTtcblxuLy8gcGF0aC5yZXNvbHZlKFtmcm9tIC4uLl0sIHRvKVxuLy8gcG9zaXggdmVyc2lvblxuZXhwb3J0IGZ1bmN0aW9uIHJlc29sdmUoKSB7XG4gIHZhciByZXNvbHZlZFBhdGggPSAnJyxcbiAgICAgIHJlc29sdmVkQWJzb2x1dGUgPSBmYWxzZTtcblxuICBmb3IgKHZhciBpID0gYXJndW1lbnRzLmxlbmd0aCAtIDE7IGkgPj0gLTEgJiYgIXJlc29sdmVkQWJzb2x1dGU7IGktLSkge1xuICAgIHZhciBwYXRoID0gKGkgPj0gMCkgPyBhcmd1bWVudHNbaV0gOiAnLyc7XG5cbiAgICAvLyBTa2lwIGVtcHR5IGFuZCBpbnZhbGlkIGVudHJpZXNcbiAgICBpZiAodHlwZW9mIHBhdGggIT09ICdzdHJpbmcnKSB7XG4gICAgICB0aHJvdyBuZXcgVHlwZUVycm9yKCdBcmd1bWVudHMgdG8gcGF0aC5yZXNvbHZlIG11c3QgYmUgc3RyaW5ncycpO1xuICAgIH0gZWxzZSBpZiAoIXBhdGgpIHtcbiAgICAgIGNvbnRpbnVlO1xuICAgIH1cblxuICAgIHJlc29sdmVkUGF0aCA9IHBhdGggKyAnLycgKyByZXNvbHZlZFBhdGg7XG4gICAgcmVzb2x2ZWRBYnNvbHV0ZSA9IHBhdGguY2hhckF0KDApID09PSAnLyc7XG4gIH1cblxuICAvLyBBdCB0aGlzIHBvaW50IHRoZSBwYXRoIHNob3VsZCBiZSByZXNvbHZlZCB0byBhIGZ1bGwgYWJzb2x1dGUgcGF0aCwgYnV0XG4gIC8vIGhhbmRsZSByZWxhdGl2ZSBwYXRocyB0byBiZSBzYWZlIChtaWdodCBoYXBwZW4gd2hlbiBwcm9jZXNzLmN3ZCgpIGZhaWxzKVxuXG4gIC8vIE5vcm1hbGl6ZSB0aGUgcGF0aFxuICByZXNvbHZlZFBhdGggPSBub3JtYWxpemVBcnJheShmaWx0ZXIocmVzb2x2ZWRQYXRoLnNwbGl0KCcvJyksIGZ1bmN0aW9uKHApIHtcbiAgICByZXR1cm4gISFwO1xuICB9KSwgIXJlc29sdmVkQWJzb2x1dGUpLmpvaW4oJy8nKTtcblxuICByZXR1cm4gKChyZXNvbHZlZEFic29sdXRlID8gJy8nIDogJycpICsgcmVzb2x2ZWRQYXRoKSB8fCAnLic7XG59O1xuXG4vLyBwYXRoLm5vcm1hbGl6ZShwYXRoKVxuLy8gcG9zaXggdmVyc2lvblxuZXhwb3J0IGZ1bmN0aW9uIG5vcm1hbGl6ZShwYXRoKSB7XG4gIHZhciBpc1BhdGhBYnNvbHV0ZSA9IGlzQWJzb2x1dGUocGF0aCksXG4gICAgICB0cmFpbGluZ1NsYXNoID0gc3Vic3RyKHBhdGgsIC0xKSA9PT0gJy8nO1xuXG4gIC8vIE5vcm1hbGl6ZSB0aGUgcGF0aFxuICBwYXRoID0gbm9ybWFsaXplQXJyYXkoZmlsdGVyKHBhdGguc3BsaXQoJy8nKSwgZnVuY3Rpb24ocCkge1xuICAgIHJldHVybiAhIXA7XG4gIH0pLCAhaXNQYXRoQWJzb2x1dGUpLmpvaW4oJy8nKTtcblxuICBpZiAoIXBhdGggJiYgIWlzUGF0aEFic29sdXRlKSB7XG4gICAgcGF0aCA9ICcuJztcbiAgfVxuICBpZiAocGF0aCAmJiB0cmFpbGluZ1NsYXNoKSB7XG4gICAgcGF0aCArPSAnLyc7XG4gIH1cblxuICByZXR1cm4gKGlzUGF0aEFic29sdXRlID8gJy8nIDogJycpICsgcGF0aDtcbn07XG5cbi8vIHBvc2l4IHZlcnNpb25cbmV4cG9ydCBmdW5jdGlvbiBpc0Fic29sdXRlKHBhdGgpIHtcbiAgcmV0dXJuIHBhdGguY2hhckF0KDApID09PSAnLyc7XG59XG5cbi8vIHBvc2l4IHZlcnNpb25cbmV4cG9ydCBmdW5jdGlvbiBqb2luKCkge1xuICB2YXIgcGF0aHMgPSBBcnJheS5wcm90b3R5cGUuc2xpY2UuY2FsbChhcmd1bWVudHMsIDApO1xuICByZXR1cm4gbm9ybWFsaXplKGZpbHRlcihwYXRocywgZnVuY3Rpb24ocCwgaW5kZXgpIHtcbiAgICBpZiAodHlwZW9mIHAgIT09ICdzdHJpbmcnKSB7XG4gICAgICB0aHJvdyBuZXcgVHlwZUVycm9yKCdBcmd1bWVudHMgdG8gcGF0aC5qb2luIG11c3QgYmUgc3RyaW5ncycpO1xuICAgIH1cbiAgICByZXR1cm4gcDtcbiAgfSkuam9pbignLycpKTtcbn1cblxuXG4vLyBwYXRoLnJlbGF0aXZlKGZyb20sIHRvKVxuLy8gcG9zaXggdmVyc2lvblxuZXhwb3J0IGZ1bmN0aW9uIHJlbGF0aXZlKGZyb20sIHRvKSB7XG4gIGZyb20gPSByZXNvbHZlKGZyb20pLnN1YnN0cigxKTtcbiAgdG8gPSByZXNvbHZlKHRvKS5zdWJzdHIoMSk7XG5cbiAgZnVuY3Rpb24gdHJpbShhcnIpIHtcbiAgICB2YXIgc3RhcnQgPSAwO1xuICAgIGZvciAoOyBzdGFydCA8IGFyci5sZW5ndGg7IHN0YXJ0KyspIHtcbiAgICAgIGlmIChhcnJbc3RhcnRdICE9PSAnJykgYnJlYWs7XG4gICAgfVxuXG4gICAgdmFyIGVuZCA9IGFyci5sZW5ndGggLSAxO1xuICAgIGZvciAoOyBlbmQgPj0gMDsgZW5kLS0pIHtcbiAgICAgIGlmIChhcnJbZW5kXSAhPT0gJycpIGJyZWFrO1xuICAgIH1cblxuICAgIGlmIChzdGFydCA+IGVuZCkgcmV0dXJuIFtdO1xuICAgIHJldHVybiBhcnIuc2xpY2Uoc3RhcnQsIGVuZCAtIHN0YXJ0ICsgMSk7XG4gIH1cblxuICB2YXIgZnJvbVBhcnRzID0gdHJpbShmcm9tLnNwbGl0KCcvJykpO1xuICB2YXIgdG9QYXJ0cyA9IHRyaW0odG8uc3BsaXQoJy8nKSk7XG5cbiAgdmFyIGxlbmd0aCA9IE1hdGgubWluKGZyb21QYXJ0cy5sZW5ndGgsIHRvUGFydHMubGVuZ3RoKTtcbiAgdmFyIHNhbWVQYXJ0c0xlbmd0aCA9IGxlbmd0aDtcbiAgZm9yICh2YXIgaSA9IDA7IGkgPCBsZW5ndGg7IGkrKykge1xuICAgIGlmIChmcm9tUGFydHNbaV0gIT09IHRvUGFydHNbaV0pIHtcbiAgICAgIHNhbWVQYXJ0c0xlbmd0aCA9IGk7XG4gICAgICBicmVhaztcbiAgICB9XG4gIH1cblxuICB2YXIgb3V0cHV0UGFydHMgPSBbXTtcbiAgZm9yICh2YXIgaSA9IHNhbWVQYXJ0c0xlbmd0aDsgaSA8IGZyb21QYXJ0cy5sZW5ndGg7IGkrKykge1xuICAgIG91dHB1dFBhcnRzLnB1c2goJy4uJyk7XG4gIH1cblxuICBvdXRwdXRQYXJ0cyA9IG91dHB1dFBhcnRzLmNvbmNhdCh0b1BhcnRzLnNsaWNlKHNhbWVQYXJ0c0xlbmd0aCkpO1xuXG4gIHJldHVybiBvdXRwdXRQYXJ0cy5qb2luKCcvJyk7XG59XG5cbmV4cG9ydCB2YXIgc2VwID0gJy8nO1xuZXhwb3J0IHZhciBkZWxpbWl0ZXIgPSAnOic7XG5cbmV4cG9ydCBmdW5jdGlvbiBkaXJuYW1lKHBhdGgpIHtcbiAgdmFyIHJlc3VsdCA9IHNwbGl0UGF0aChwYXRoKSxcbiAgICAgIHJvb3QgPSByZXN1bHRbMF0sXG4gICAgICBkaXIgPSByZXN1bHRbMV07XG5cbiAgaWYgKCFyb290ICYmICFkaXIpIHtcbiAgICAvLyBObyBkaXJuYW1lIHdoYXRzb2V2ZXJcbiAgICByZXR1cm4gJy4nO1xuICB9XG5cbiAgaWYgKGRpcikge1xuICAgIC8vIEl0IGhhcyBhIGRpcm5hbWUsIHN0cmlwIHRyYWlsaW5nIHNsYXNoXG4gICAgZGlyID0gZGlyLnN1YnN0cigwLCBkaXIubGVuZ3RoIC0gMSk7XG4gIH1cblxuICByZXR1cm4gcm9vdCArIGRpcjtcbn1cblxuZXhwb3J0IGZ1bmN0aW9uIGJhc2VuYW1lKHBhdGgsIGV4dCkge1xuICB2YXIgZiA9IHNwbGl0UGF0aChwYXRoKVsyXTtcbiAgLy8gVE9ETzogbWFrZSB0aGlzIGNvbXBhcmlzb24gY2FzZS1pbnNlbnNpdGl2ZSBvbiB3aW5kb3dzP1xuICBpZiAoZXh0ICYmIGYuc3Vic3RyKC0xICogZXh0Lmxlbmd0aCkgPT09IGV4dCkge1xuICAgIGYgPSBmLnN1YnN0cigwLCBmLmxlbmd0aCAtIGV4dC5sZW5ndGgpO1xuICB9XG4gIHJldHVybiBmO1xufVxuXG5cbmV4cG9ydCBmdW5jdGlvbiBleHRuYW1lKHBhdGgpIHtcbiAgcmV0dXJuIHNwbGl0UGF0aChwYXRoKVszXTtcbn1cbmV4cG9ydCBkZWZhdWx0IHtcbiAgZXh0bmFtZTogZXh0bmFtZSxcbiAgYmFzZW5hbWU6IGJhc2VuYW1lLFxuICBkaXJuYW1lOiBkaXJuYW1lLFxuICBzZXA6IHNlcCxcbiAgZGVsaW1pdGVyOiBkZWxpbWl0ZXIsXG4gIHJlbGF0aXZlOiByZWxhdGl2ZSxcbiAgam9pbjogam9pbixcbiAgaXNBYnNvbHV0ZTogaXNBYnNvbHV0ZSxcbiAgbm9ybWFsaXplOiBub3JtYWxpemUsXG4gIHJlc29sdmU6IHJlc29sdmVcbn07XG5mdW5jdGlvbiBmaWx0ZXIgKHhzLCBmKSB7XG4gICAgaWYgKHhzLmZpbHRlcikgcmV0dXJuIHhzLmZpbHRlcihmKTtcbiAgICB2YXIgcmVzID0gW107XG4gICAgZm9yICh2YXIgaSA9IDA7IGkgPCB4cy5sZW5ndGg7IGkrKykge1xuICAgICAgICBpZiAoZih4c1tpXSwgaSwgeHMpKSByZXMucHVzaCh4c1tpXSk7XG4gICAgfVxuICAgIHJldHVybiByZXM7XG59XG5cbi8vIFN0cmluZy5wcm90b3R5cGUuc3Vic3RyIC0gbmVnYXRpdmUgaW5kZXggZG9uJ3Qgd29yayBpbiBJRThcbnZhciBzdWJzdHIgPSAnYWInLnN1YnN0cigtMSkgPT09ICdiJyA/XG4gICAgZnVuY3Rpb24gKHN0ciwgc3RhcnQsIGxlbikgeyByZXR1cm4gc3RyLnN1YnN0cihzdGFydCwgbGVuKSB9IDpcbiAgICBmdW5jdGlvbiAoc3RyLCBzdGFydCwgbGVuKSB7XG4gICAgICAgIGlmIChzdGFydCA8IDApIHN0YXJ0ID0gc3RyLmxlbmd0aCArIHN0YXJ0O1xuICAgICAgICByZXR1cm4gc3RyLnN1YnN0cihzdGFydCwgbGVuKTtcbiAgICB9XG47XG4iLCJjb25zdCB7IGpvaW4sIGJhc2VuYW1lIH0gPSByZXF1aXJlKCdwYXRoJylcblxuY29uc3QgaXNGaWxlID0gKHBhdGgpID0+ICggYmFzZW5hbWUocGF0aCkuaW5jbHVkZXMoJy4nKSApXG5cbmNvbnN0IHJlc29sdmVEZXN0UGF0aCA9IChwYXRoLCBkZXN0LCBiYXNlKSA9PiB7XG4gICAgaWYgKHR5cGVvZiBkZXN0ICE9PSAnc3RyaW5nJykgcmV0dXJuIGFic29sdXRlKHBhdGgpXG4gICAgaWYgKGlzRmlsZShkZXN0KSkgcmV0dXJuIGFic29sdXRlKGRlc3QpXG4gICAgcmV0dXJuIGpvaW4oYWJzb2x1dGUoZGVzdCksIGFic29sdXRlKHBhdGgpLnJlcGxhY2UoYWJzb2x1dGUoYmFzZSksICcnKSlcbn1cblxuY29uc3QgaXNSZWxhdGl2ZSA9IChwYXRoKSA9PiB7XG4gICAgaWYgKHBhdGguY2hhckF0KDApID09PSAnLicgJiYgKFxuICAgICAgICBwYXRoLmNoYXJBdCgxKSA9PT0gJy4nIHx8IHBhdGguY2hhckF0KDEpID09PSAnLycpKVxuICAgICAgICByZXR1cm4gdHJ1ZVxuICAgIHJldHVybiBmYWxzZVxufVxuXG5jb25zdCBpc0Fic29sdXRlID0gKHBhdGgpID0+IHtcbiAgICBpZiAocGF0aC5jaGFyQXQoMCkgPT09ICcvJykgcmV0dXJuIHRydWVcbiAgICByZXR1cm4gZmFsc2Vcbn1cblxuY29uc3QgYWJzb2x1dGUgPSAocGF0aCkgPT4ge1xuICAgIGlmIChpc0Fic29sdXRlKHBhdGgpKSByZXR1cm4gcGF0aFxuICAgIHJldHVybiBqb2luKGdldFJvb3RQYXRoKCksIHBhdGgpXG59XG5cbmNvbnN0IHJlbGF0aXZlID0gKHBhdGgpID0+IHtcbiAgICBpZiAoIWlzQWJzb2x1dGUocGF0aCkpIHJldHVybiBwYXRoXG4gICAgcmV0dXJuIHBhdGgucmVwbGFjZShnZXRSb290UGF0aCgpICsgJy8nICwgJycpXG59XG5cbmNvbnN0IGdldFJvb3RQYXRoID0gKCkgPT4gcHJvY2Vzcy5jd2QoKVxuXG5leHBvcnRzLmlzRmlsZSA9IGlzRmlsZVxuZXhwb3J0cy5yZXNvbHZlRGVzdFBhdGggPSByZXNvbHZlRGVzdFBhdGhcbmV4cG9ydHMuaXNSZWxhdGl2ZSA9IGlzUmVsYXRpdmVcbmV4cG9ydHMuaXNBYnNvbHV0ZSA9IGlzQWJzb2x1dGVcbmV4cG9ydHMuYWJzb2x1dGUgPSBhYnNvbHV0ZVxuZXhwb3J0cy5yZWxhdGl2ZSA9IHJlbGF0aXZlXG5leHBvcnRzLmdldFJvb3RQYXRoID0gZ2V0Um9vdFBhdGhcbiIsImNvbnN0IGlzTm9kZSA9IHJlcXVpcmUoJy4uLy4uL2hlbHBlci9pcy1ub2RlJylcbmNvbnN0IHsgaXNSZWxhdGl2ZSwgaXNBYnNvbHV0ZSwgZ2V0Um9vdFBhdGggfSA9IHJlcXVpcmUoJy4uLy4uL2hlbHBlci9wYXRoJylcbmNvbnN0IHsgam9pbiwgcmVzb2x2ZSwgZGlybmFtZSB9ID0gcmVxdWlyZSgncGF0aCcpXG5cbmNvbnN0IGV4dGVuc2lvbnMgPSBbJ2pzJywgJ2pzb24nLCAnbm9kZSddXG5cbmNvbnN0IHJlc29sdmVBbWJpZ3VvdXNQYXRoID0gKHBhdGgpID0+IHtcblxuICAgIGlmIChleHRlbnNpb25zLmluY2x1ZGVzKGV4dG5hbWUocGF0aCkpKSB7XG4gICAgICAgIHJldHVybiBwYXRoXG4gICAgfVxuXG4gICAgY29uc3QgZXh0ZW5zaW9uID0gZXh0ZW5zaW9ucy5maW5kKGV4dGVuc2lvbiA9PiAoXG4gICAgICAgIHBhdGhFeGlzdHNTeW5jKGFwcGVuZEV4dGVuc2lvbihwYXRoLCBleHRlbnNpb24pKVxuICAgICkpXG5cbiAgICBpZiAoZXh0ZW5zaW9uKSB7XG4gICAgICAgIHJldHVybiBhcHBlbmRFeHRlbnNpb24ocGF0aCwgZXh0ZW5zaW9uKVxuICAgIH1cblxuICAgIGNvbnN0IGluZGV4ID0gam9pbihwYXRoLCAnaW5kZXguanMnKVxuICAgIGlmIChwYXRoRXhpc3RzU3luYyhpbmRleCkpIHtcbiAgICAgICAgcmV0dXJuIGluZGV4XG4gICAgfVxuXG4gICAgcmV0dXJuIHBhdGhcbn1cblxuY29uc3QgZ2V0QXBwUHJlZml4ID0gKG1vZHVsZU5hbWUpID0+ICd+J1xuXG5jb25zdCBpc0FwcE1vZHVsZSA9IChtb2R1bGVOYW1lKSA9PiAoXG4gICAgbW9kdWxlTmFtZS5jaGFyQXQoMCkgPT09IGdldEFwcFByZWZpeCgpXG4pXG5cbmNvbnN0IGlzUGFja2FnZSA9IChuYW1lKSA9PiB7XG4gICAgaWYgKGlzUmVsYXRpdmUobmFtZSkgfHwgaXNBYnNvbHV0ZShuYW1lKSkgcmV0dXJuIGZhbHNlXG4gICAgcmV0dXJuIHRydWVcbn1cblxuY29uc3QgaXNBYnNvbHV0ZVBhY2thZ2UgPSAobmFtZSkgPT4ge1xuICAgIGlmIChpc1BhY2thZ2UobmFtZSkgJiYgbmFtZS5pbmRleE9mKCcvJykgPT09IC0xKVxuICAgICAgICByZXR1cm4gdHJ1ZVxuICAgIHJldHVybiBmYWxzZVxufVxuXG5jb25zdCBpc1JlbGF0aXZlUGFja2FnZSA9IChuYW1lKSA9PiB7XG4gICAgaWYgKG5hbWUuaW5kZXhPZignLycpID4gLTEgJiYgaXNQYWNrYWdlKG5hbWUpKSByZXR1cm4gdHJ1ZVxuICAgIHJldHVybiBmYWxzZVxufVxuXG5jb25zdCBhcHBlbmRFeHRlbnNpb24gPSAobmFtZSwgZXh0ZW5zaW9uID0gJ2pzJykgPT4ge1xuICAgIGlmIChpc0Fic29sdXRlUGFja2FnZShuYW1lKSkgcmV0dXJuIG5hbWVcbiAgICBjb25zdCBleHQgPSAnLicgKyBleHRlbnNpb25cbiAgICBpZiAobmFtZS5zbGljZSgtKGV4dC5sZW5ndGgpKSA9PT0gZXh0KSByZXR1cm4gbmFtZVxuICAgIHJldHVybiBuYW1lICsgZXh0XG59XG5cbmNvbnN0IGdldFJlcXVpcmUgPSAoKSA9PiB7XG4gICAgaWYgKGlzTm9kZSgpKSByZXR1cm4gcmVxdWlyZVxuICAgIHJldHVybiB3aW5kb3cucmVxdWlyZVxufVxuXG5jb25zdCByZXNvbHZlTW9kdWxlTmFtZSA9IChtb2R1bGUpID0+IHtcbiAgICBpZiAoaXNBcHBNb2R1bGUobW9kdWxlKSkge1xuICAgICAgICByZXR1cm4gam9pbihnZXRSb290UGF0aCgpLCByZXBsYWNlKGdldEFwcFByZWZpeCgpLCAnJykpXG4gICAgfVxuICAgIGlmIChpc1JlbGF0aXZlKG1vZHVsZSkpIHJldHVybiBqb2luKGdldFJvb3RQYXRoKCksIG1vZHVsZSlcbiAgICByZXR1cm4gbW9kdWxlXG59XG5cbmNvbnN0IHJlcXVpcmVNb2R1bGUgPSAobmFtZSkgPT4ge1xuICAgIGNvbnN0IHBhdGggPSAoIGlzTm9kZSgpID8gcmVzb2x2ZU1vZHVsZU5hbWUobmFtZSkgOiBuYW1lIClcbiAgICByZXR1cm4gZ2V0UmVxdWlyZSgpKHBhdGgpXG59XG5cbmV4cG9ydHMuZXh0ZW5zaW9ucyA9IGV4dGVuc2lvbnNcbmV4cG9ydHMuZ2V0QXBwUHJlZml4ID0gZ2V0QXBwUHJlZml4XG5leHBvcnRzLmlzQXBwTW9kdWxlID0gaXNBcHBNb2R1bGVcbmV4cG9ydHMuaXNQYWNrYWdlID0gaXNQYWNrYWdlXG5leHBvcnRzLmlzQWJzb2x1dGVQYWNrYWdlID0gaXNBYnNvbHV0ZVBhY2thZ2VcbmV4cG9ydHMuaXNSZWxhdGl2ZVBhY2thZ2UgPSBpc1JlbGF0aXZlUGFja2FnZVxuZXhwb3J0cy5hcHBlbmRFeHRlbnNpb24gPSBhcHBlbmRFeHRlbnNpb25cbmV4cG9ydHMuZ2V0UmVxdWlyZSA9IGdldFJlcXVpcmVcbmV4cG9ydHMucmVzb2x2ZU1vZHVsZU5hbWUgPSByZXNvbHZlTW9kdWxlTmFtZVxuZXhwb3J0cy5yZXF1aXJlTW9kdWxlID0gcmVxdWlyZU1vZHVsZVxuZXhwb3J0cy5yZXNvbHZlQW1iaWd1b3VzUGF0aCA9IHJlc29sdmVBbWJpZ3VvdXNQYXRoXG4iLCJpbXBvcnQgeyBqb2luLCByZXNvbHZlLCBkaXJuYW1lIH0gZnJvbSAncGF0aCdcbmltcG9ydCB7XG4gICAgaXNQYWNrYWdlLFxuICAgIGlzQWJzb2x1dGVQYWNrYWdlLFxuICAgIGFwcGVuZEV4dGVuc2lvbixcbiAgICBnZXRBcHBQcmVmaXgsXG4gICAgZXh0ZW5zaW9uc1xufSBmcm9tICcuLi8uLi8uLi9oZWxwZXIvcmVzb2x2ZSdcblxuY29uc3QgY2FjaGUgPSB7fVxuXG5jb25zdCByZXNvbHZlRXhwb3J0cyA9IChmaWxlKSA9PiB7XG5cbiAgICBpZiAoY2FjaGVbZmlsZV0pIHtcbiAgICAgICAgcmV0dXJuIGNhY2hlW2ZpbGVdXG4gICAgfVxuXG4gICAgY29uc3QgZGVmaW5lZE1vZHVsZSA9IHJlcXVpcmUuZGVmaW5lZFtmaWxlXVxuXG4gICAgaWYgKGRlZmluZWRNb2R1bGUpIHtcbiAgICAgICAgY29uc3QgbG9jYWxSZXF1aXJlID0gY3JlYXRlTG9jYWxSZXF1aXJlKGZpbGUpXG4gICAgICAgIGNvbnN0IG1vZHVsZSA9IGNhY2hlW2ZpbGVdID0geyBleHBvcnRzOiB7fSB9XG5cbiAgICAgICAgZGVmaW5lZE1vZHVsZS5jYWxsKG1vZHVsZS5leHBvcnRzLCBtb2R1bGUuZXhwb3J0cywgbG9jYWxSZXF1aXJlLCBtb2R1bGUpXG5cbiAgICAgICAgcmV0dXJuIG1vZHVsZVxuICAgIH1cblxuICAgIHJldHVybiBudWxsXG59XG5cbmNvbnN0IGxvYWQgPSAocmVxdWVzdCwgcGFyZW50ID0gZ2V0QXBwUHJlZml4KCkpID0+IHtcbiAgICBjb25zdCByZXF1aXJlID0gd2luZG93LnJlcXVpcmVcbiAgICBjb25zdCBtYXBJRCA9IGdldE1vZHVsZVJvb3QocGFyZW50KVxuICAgIGNvbnN0IHJlbWFwcGVkID0gcmVxdWVzdE1hcChyZXF1aXJlLmJyb3dzZXJNYXAsIHJlcXVlc3QsIG1hcElEKVxuICAgIGNvbnN0IGNvbmZsaWN0ZWQgPSByZXF1ZXN0TWFwKHJlcXVpcmUuY29uZmxpY3RNYXAsIHJlbWFwcGVkLCBtYXBJRClcbiAgICBjb25zdCBrZXkgPSByZXNvbHZlRmlsZW5hbWUoY29uZmxpY3RlZCwgcGFyZW50KVxuXG4gICAgZm9yIChsZXQgaSA9IDA7IGkgPCBleHRlbnNpb25zLmxlbmd0aDsgaSsrKSB7XG4gICAgICAgIGNvbnN0IGZpbGUgPSBhcHBlbmRFeHRlbnNpb24oa2V5LCBleHRlbnNpb25zW2ldKVxuICAgICAgICBjb25zdCBtb2R1bGUgPSByZXNvbHZlRXhwb3J0cyhmaWxlKVxuICAgICAgICBpZiAobW9kdWxlKSB7XG4gICAgICAgICAgICByZXR1cm4gbW9kdWxlLmV4cG9ydHNcbiAgICAgICAgfVxuICAgIH1cblxuICAgIGZvciAobGV0IGkgPSAwOyBpIDwgZXh0ZW5zaW9ucy5sZW5ndGg7IGkrKykge1xuICAgICAgICBjb25zdCBmaWxlID0gYXBwZW5kRXh0ZW5zaW9uKGpvaW4oa2V5LCAnaW5kZXgnKSwgZXh0ZW5zaW9uc1tpXSlcbiAgICAgICAgY29uc3QgbW9kdWxlID0gcmVzb2x2ZUV4cG9ydHMoZmlsZSlcbiAgICAgICAgaWYgKG1vZHVsZSkge1xuICAgICAgICAgICAgcmV0dXJuIG1vZHVsZS5leHBvcnRzXG4gICAgICAgIH1cbiAgICB9XG5cbiAgICBjb25zdCBlcnJvciA9IG5ldyBFcnJvcihgQ2Fubm90IGZpbmQgbW9kdWxlIFwiJHtrZXl9XCIgZnJvbSBcIiR7cGFyZW50fVwiYClcbiAgICBlcnJvci5jb2RlID0gJ01PRFVMRV9OT1RfRk9VTkQnXG4gICAgdGhyb3cgZXJyb3Jcbn1cblxuY29uc3QgcmVxdWVzdE1hcCA9IChtYXAsIHJlcXVlc3QsIGlkKSA9PiB7XG4gICAgY29uc3QgbWFwcGVkID0gbWFwW2lkXSAmJiBtYXBbaWRdW3JlcXVlc3RdXG4gICAgcmV0dXJuIG1hcHBlZCB8fCByZXF1ZXN0XG59XG5cbmNvbnN0IGdldE1vZHVsZVJvb3QgPSAocGF0aCkgPT4ge1xuICAgIGNvbnN0IG5vZGVNb2R1bGVzID0gJ25vZGVfbW9kdWxlcydcbiAgICBjb25zdCBwYXJ0cyA9IHBhdGguc3BsaXQoJy8nKVxuICAgIGNvbnN0IGluZGV4ID0gcGFydHMubGFzdEluZGV4T2Yobm9kZU1vZHVsZXMpXG4gICAgaWYgKGluZGV4ID09PSAtMSkge1xuICAgICAgICByZXR1cm4gcGFydHNbMF1cbiAgICB9XG4gICAgcmV0dXJuIHBhcnRzLnNsaWNlKDAsIGluZGV4ICsgMikuam9pbignLycpXG59XG5cbmNvbnN0IHJlc29sdmVGaWxlbmFtZSA9IChrZXksIHBhcmVudCkgPT4ge1xuICAgIGlmIChpc0Fic29sdXRlUGFja2FnZShrZXkpKSB7XG4gICAgICAgIHJldHVybiBrZXlcbiAgICB9XG5cbiAgICBpZiAoaXNQYWNrYWdlKGtleSkpIHtcbiAgICAgICAgcmV0dXJuIGtleVxuICAgIH1cblxuICAgIGNvbnN0IHsgYWxpYXMgfSA9IHdpbmRvdy5yZXF1aXJlXG4gICAgY29uc3QgcGFyZW50QWxpYXMgPSAoYWxpYXNbcGFyZW50XSA/IGFsaWFzW3BhcmVudF0gOiBwYXJlbnQpXG4gICAgY29uc3QgcGFyZW50RmlsZSA9IGFwcGVuZEV4dGVuc2lvbihwYXJlbnRBbGlhcylcbiAgICBjb25zdCBkaXJlY3RvcnkgPSBkaXJuYW1lKHBhcmVudEZpbGUpXG5cbiAgICByZXR1cm4gam9pbihkaXJlY3RvcnksIGtleSlcbn1cblxuZXhwb3J0IHsgbG9hZCB9XG5cbmNvbnN0IGNyZWF0ZUxvY2FsUmVxdWlyZSA9IHBhcmVudCA9PiBrZXkgPT4gd2luZG93LnJlcXVpcmUoa2V5LCBwYXJlbnQpXG4iLCJpbXBvcnQgZXh0ZW5kIGZyb20gJ29iamVjdC1leHRlbmQnXG5pbXBvcnQgKiBhcyBNb2R1bGUgZnJvbSAnLi9tb2R1bGUuanMnXG5cbmNvbnN0IGV2YWxNb2R1bGVzID0gKG1vZHVsZXMpID0+IHtcbiAgICBtb2R1bGVzLmZvckVhY2gobW9kdWxlID0+IHtcbiAgICAgICAgY29uc3QgcmVxdWlyZSA9IHdpbmRvdy5yZXF1aXJlXG4gICAgICAgIGNvbnN0IHsgaWQsIGtleSwgYWxpYXMsIHNvdXJjZSB9ID0gbW9kdWxlXG5cbiAgICAgICAgcmVxdWlyZS5kZWZpbmVTb3VyY2Uoa2V5LCBzb3VyY2UpXG4gICAgICAgIHJlcXVpcmUuaWRzLnB1c2goaWQpXG5cbiAgICAgICAgaWYgKGFsaWFzKSByZXF1aXJlLmFsaWFzW2tleV0gPSBhbGlhc1xuICAgIH0pXG59XG5cbmNvbnN0IGVuYWJsZUJyb3dzZXJSZXF1aXJlID0gKG1vZHVsZXMpID0+IHtcblxuICAgIGNvbnN0IHJlcXVpcmUgPSAocmVxdWVzdCwgbG9hZGVyUGF0aCkgPT4gKCBNb2R1bGUubG9hZChyZXF1ZXN0LCBsb2FkZXJQYXRoKSApXG5cbiAgICByZXF1aXJlLmRlZmluZWQgPSB7fVxuICAgIHJlcXVpcmUuaWRzID0gW11cbiAgICByZXF1aXJlLmFsaWFzID0ge31cbiAgICByZXF1aXJlLmJyb3dzZXJNYXAgPSB7fVxuICAgIHJlcXVpcmUuY29uZmxpY3RNYXAgPSB7fVxuICAgIHJlcXVpcmUuZGVmaW5lID0gKG1vZHVsZSwgZm4pID0+IHJlcXVpcmUuZGVmaW5lZFttb2R1bGVdID0gZm5cbiAgICByZXF1aXJlLmRlZmluZVNvdXJjZSA9IChrZXksIHNvdXJjZSkgPT4ge1xuICAgICAgICBjb25zdCB3cmFwcGVkTW9kdWxlID0gZXZhbChcbiAgICAgICAgICAgICcoZnVuY3Rpb24oZXhwb3J0cyxyZXF1aXJlLG1vZHVsZSl7JyArXG4gICAgICAgICAgICAgICAgKHNvdXJjZSArICdcXG4nKSArXG4gICAgICAgICAgICAnfSkuYmluZCh3aW5kb3cpJ1xuICAgICAgICApXG4gICAgICAgIHJlcXVpcmUuZGVmaW5lKGtleSwgd3JhcHBlZE1vZHVsZSlcbiAgICB9XG4gICAgcmVxdWlyZS5sb2FkID0gKHVybCkgPT4gKFxuICAgICAgICB3aW5kb3cuZmV0Y2godXJsKVxuICAgICAgICAudGhlbihyZXNwb25zZSA9PiByZXNwb25zZS5qc29uKCkpXG4gICAgICAgIC50aGVuKCh7IGJyb3dzZXJNYXAsIGNvbmZsaWN0TWFwLCBtb2R1bGVzIH0pID0+IHtcbiAgICAgICAgICAgIHJlcXVpcmUuYnJvd3Nlck1hcCA9IGV4dGVuZChyZXF1aXJlLmJyb3dzZXJNYXAsIGJyb3dzZXJNYXApXG4gICAgICAgICAgICByZXF1aXJlLmNvbmZsaWN0TWFwID0gZXh0ZW5kKHJlcXVpcmUuY29uZmxpY3RNYXAsIGNvbmZsaWN0TWFwKVxuICAgICAgICAgICAgZXZhbE1vZHVsZXMobW9kdWxlcylcbiAgICAgICAgfSlcbiAgICAgICAgLmNhdGNoKGUgPT4gY29uc29sZS5lcnJvcihlKSlcbiAgICApXG5cbiAgICB3aW5kb3cucmVxdWlyZSA9IHJlcXVpcmVcblxuICAgIGlmIChtb2R1bGVzKSBldmFsTW9kdWxlcyhtb2R1bGVzKVxufVxuXG5leHBvcnQgZGVmYXVsdCBlbmFibGVCcm93c2VyUmVxdWlyZVxuXG4vLyBJbnNwaXJlZCBieTpcbi8vIGh0dHBzOi8vZ2l0aHViLmNvbS9lZmFjaWxpdGF0aW9uL2NvbW1vbmpzLXJlcXVpcmVcbiIsImltcG9ydCBlbmFibGVCcm93c2VyUmVxdWlyZSBmcm9tICcuLi8uLi9yZXF1aXJlJ1xuZW5hYmxlQnJvd3NlclJlcXVpcmUoKVxuIl0sIm5hbWVzIjpbImV4dG5hbWUiLCJqb2luIiwiYmFzZW5hbWUiLCJpc0ZpbGUiLCJwYXRoIiwiaW5jbHVkZXMiLCJyZXNvbHZlRGVzdFBhdGgiLCJkZXN0IiwiYmFzZSIsImFic29sdXRlIiwicmVwbGFjZSIsImlzUmVsYXRpdmUiLCJjaGFyQXQiLCJpc0Fic29sdXRlIiwiZ2V0Um9vdFBhdGgiLCJyZWxhdGl2ZSIsInByb2Nlc3MiLCJjd2QiLCJleHBvcnRzIiwicmVzb2x2ZSIsImRpcm5hbWUiLCJleHRlbnNpb25zIiwiZ2V0QXBwUHJlZml4IiwibW9kdWxlTmFtZSIsImlzUGFja2FnZSIsIm5hbWUiLCJpc0Fic29sdXRlUGFja2FnZSIsImluZGV4T2YiLCJhcHBlbmRFeHRlbnNpb24iLCJleHRlbnNpb24iLCJleHQiLCJzbGljZSIsImxlbmd0aCIsImNhY2hlIiwicmVzb2x2ZUV4cG9ydHMiLCJmaWxlIiwiZGVmaW5lZE1vZHVsZSIsInJlcXVpcmUiLCJkZWZpbmVkIiwibG9jYWxSZXF1aXJlIiwiY3JlYXRlTG9jYWxSZXF1aXJlIiwibW9kdWxlIiwiY2FsbCIsImxvYWQiLCJyZXF1ZXN0IiwicGFyZW50Iiwid2luZG93IiwibWFwSUQiLCJnZXRNb2R1bGVSb290IiwicmVtYXBwZWQiLCJyZXF1ZXN0TWFwIiwiYnJvd3Nlck1hcCIsImNvbmZsaWN0ZWQiLCJjb25mbGljdE1hcCIsImtleSIsInJlc29sdmVGaWxlbmFtZSIsImkiLCJlcnJvciIsIkVycm9yIiwiY29kZSIsIm1hcCIsImlkIiwibWFwcGVkIiwibm9kZU1vZHVsZXMiLCJwYXJ0cyIsInNwbGl0IiwiaW5kZXgiLCJsYXN0SW5kZXhPZiIsImFsaWFzIiwicGFyZW50QWxpYXMiLCJwYXJlbnRGaWxlIiwiZGlyZWN0b3J5IiwiZXZhbE1vZHVsZXMiLCJtb2R1bGVzIiwiZm9yRWFjaCIsInNvdXJjZSIsImRlZmluZVNvdXJjZSIsImlkcyIsInB1c2giLCJlbmFibGVCcm93c2VyUmVxdWlyZSIsImxvYWRlclBhdGgiLCJNb2R1bGUiLCJkZWZpbmUiLCJmbiIsIndyYXBwZWRNb2R1bGUiLCJldmFsIiwidXJsIiwiZmV0Y2giLCJ0aGVuIiwicmVzcG9uc2UiLCJqc29uIiwiZXh0ZW5kIiwiY2F0Y2giLCJjb25zb2xlIiwiZSJdLCJtYXBwaW5ncyI6Ijs7Ozs7O0FBQUE7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7O0FBb0JBLFVBQWMsR0FBRyxTQUFTLE1BQU0sQ0FBQyxDQUFDLEVBQUUsQ0FBQyxFQUFFOzs7SUFHbkMsSUFBSSxDQUFDLElBQUksSUFBSSxJQUFJLENBQUMsSUFBSSxJQUFJLEVBQUU7UUFDeEIsT0FBTyxDQUFDLENBQUM7S0FDWjs7O0lBR0QsTUFBTSxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUMsQ0FBQyxPQUFPLENBQUMsVUFBVSxHQUFHLEVBQUU7Ozs7OztRQU1sQyxJQUFJLE1BQU0sQ0FBQyxT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
