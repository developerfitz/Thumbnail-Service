'use strict';

function _typeof(obj) {
  "@babel/helpers - typeof";

  if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") {
    _typeof = function (obj) {
      return typeof obj;
    };
  } else {
    _typeof = function (obj) {
      return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj;
    };
  }

  return _typeof(obj);
}

function _unsupportedIterableToArray(o, minLen) {
  if (!o) return;
  if (typeof o === "string") return _arrayLikeToArray(o, minLen);
  var n = Object.prototype.toString.call(o).slice(8, -1);
  if (n === "Object" && o.constructor) n = o.constructor.name;
  if (n === "Map" || n === "Set") return Array.from(o);
  if (n === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)) return _arrayLikeToArray(o, minLen);
}

function _arrayLikeToArray(arr, len) {
  if (len == null || len > arr.length) len = arr.length;

  for (var i = 0, arr2 = new Array(len); i < len; i++) arr2[i] = arr[i];

  return arr2;
}

function _createForOfIteratorHelper(o, allowArrayLike) {
  var it;

  if (typeof Symbol === "undefined" || o[Symbol.iterator] == null) {
    if (Array.isArray(o) || (it = _unsupportedIterableToArray(o)) || allowArrayLike && o && typeof o.length === "number") {
      if (it) o = it;
      var i = 0;

      var F = function () {};

      return {
        s: F,
        n: function () {
          if (i >= o.length) return {
            done: true
          };
          return {
            done: false,
            value: o[i++]
          };
        },
        e: function (e) {
          throw e;
        },
        f: F
      };
    }

    throw new TypeError("Invalid attempt to iterate non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method.");
  }

  var normalCompletion = true,
      didErr = false,
      err;
  return {
    s: function () {
      it = o[Symbol.iterator]();
    },
    n: function () {
      var step = it.next();
      normalCompletion = step.done;
      return step;
    },
    e: function (e) {
      didErr = true;
      err = e;
    },
    f: function () {
      try {
        if (!normalCompletion && it.return != null) it.return();
      } finally {
        if (didErr) throw err;
      }
    }
  };
}

var commonjsGlobal = typeof globalThis !== 'undefined' ? globalThis : typeof window !== 'undefined' ? window : typeof global !== 'undefined' ? global : typeof self !== 'undefined' ? self : {};

function commonjsRequire () {
	throw new Error('Dynamic requires are not currently supported by rollup-plugin-commonjs');
}

function unwrapExports (x) {
	return x && x.__esModule && Object.prototype.hasOwnProperty.call(x, 'default') ? x['default'] : x;
}

function createCommonjsModule(fn, module) {
	return module = { exports: {} }, fn(module, module.exports), module.exports;
}

function getCjsExportFromNamespace (n) {
	return n && n['default'] || n;
}

var componentEmitter = createCommonjsModule(function (module) {
  /**
   * Expose `Emitter`.
   */
  {
    module.exports = Emitter;
  }
  /**
   * Initialize a new `Emitter`.
   *
   * @api public
   */


  function Emitter(obj) {
    if (obj) return mixin(obj);
  }
  /**
   * Mixin the emitter properties.
   *
   * @param {Object} obj
   * @return {Object}
   * @api private
   */

  function mixin(obj) {
    for (var key in Emitter.prototype) {
      obj[key] = Emitter.prototype[key];
    }

    return obj;
  }
  /**
   * Listen on the given `event` with `fn`.
   *
   * @param {String} event
   * @param {Function} fn
   * @return {Emitter}
   * @api public
   */


  Emitter.prototype.on = Emitter.prototype.addEventListener = function (event, fn) {
    this._callbacks = this._callbacks || {};
    (this._callbacks['$' + event] = this._callbacks['$' + event] || []).push(fn);
    return this;
  };
  /**
   * Adds an `event` listener that will be invoked a single
   * time then automatically removed.
   *
   * @param {String} event
   * @param {Function} fn
   * @return {Emitter}
   * @api public
   */


  Emitter.prototype.once = function (event, fn) {
    function on() {
      this.off(event, on);
      fn.apply(this, arguments);
    }

    on.fn = fn;
    this.on(event, on);
    return this;
  };
  /**
   * Remove the given callback for `event` or all
   * registered callbacks.
   *
   * @param {String} event
   * @param {Function} fn
   * @return {Emitter}
   * @api public
   */


  Emitter.prototype.off = Emitter.prototype.removeListener = Emitter.prototype.removeAllListeners = Emitter.prototype.removeEventListener = function (event, fn) {
    this._callbacks = this._callbacks || {}; // all

    if (0 == arguments.length) {
      this._callbacks = {};
      return this;
    } // specific event


    var callbacks = this._callbacks['$' + event];
    if (!callbacks) return this; // remove all handlers

    if (1 == arguments.length) {
      delete this._callbacks['$' + event];
      return this;
    } // remove specific handler


    var cb;

    for (var i = 0; i < callbacks.length; i++) {
      cb = callbacks[i];

      if (cb === fn || cb.fn === fn) {
        callbacks.splice(i, 1);
        break;
      }
    } // Remove event specific arrays for event types that no
    // one is subscribed for to avoid memory leak.


    if (callbacks.length === 0) {
      delete this._callbacks['$' + event];
    }

    return this;
  };
  /**
   * Emit `event` with the given args.
   *
   * @param {String} event
   * @param {Mixed} ...
   * @return {Emitter}
   */


  Emitter.prototype.emit = function (event) {
    this._callbacks = this._callbacks || {};
    var args = new Array(arguments.length - 1),
        callbacks = this._callbacks['$' + event];

    for (var i = 1; i < arguments.length; i++) {
      args[i - 1] = arguments[i];
    }

    if (callbacks) {
      callbacks = callbacks.slice(0);

      for (var i = 0, len = callbacks.length; i < len; ++i) {
        callbacks[i].apply(this, args);
      }
    }

    return this;
  };
  /**
   * Return array of callbacks for `event`.
   *
   * @param {String} event
   * @return {Array}
   * @api public
   */


  Emitter.prototype.listeners = function (event) {
    this._callbacks = this._callbacks || {};
    return this._callbacks['$' + event] || [];
  };
  /**
   * Check if this emitter has `event` handlers.
   *
   * @param {String} event
   * @return {Boolean}
   * @api public
   */


  Emitter.prototype.hasListeners = function (event) {
    return !!this.listeners(event).length;
  };
});

function isObject(obj) {
  return null !== obj && 'object' === _typeof(obj);
}

var isObject_1 = isObject;

/**
 * Module of mixed-in functions shared between node and client code
 */

/**
 * Expose `RequestBase`.
 */


var requestBase = RequestBase;
/**
 * Initialize a new `RequestBase`.
 *
 * @api public
 */

function RequestBase(obj) {
  if (obj) return mixin(obj);
}
/**
 * Mixin the prototype properties.
 *
 * @param {Object} obj
 * @return {Object}
 * @api private
 */


function mixin(obj) {
  for (var key in RequestBase.prototype) {
    obj[key] = RequestBase.prototype[key];
  }

  return obj;
}
/**
 * Clear previous timeout.
 *
 * @return {Request} for chaining
 * @api public
 */


RequestBase.prototype.clearTimeout = function _clearTimeout() {
  clearTimeout(this._timer);
  clearTimeout(this._responseTimeoutTimer);
  delete this._timer;
  delete this._responseTimeoutTimer;
  return this;
};
/**
 * Override default response body parser
 *
 * This function will be called to convert incoming data into request.body
 *
 * @param {Function}
 * @api public
 */


RequestBase.prototype.parse = function parse(fn) {
  this._parser = fn;
  return this;
};
/**
 * Set format of binary response body.
 * In browser valid formats are 'blob' and 'arraybuffer',
 * which return Blob and ArrayBuffer, respectively.
 *
 * In Node all values result in Buffer.
 *
 * Examples:
 *
 *      req.get('/')
 *        .responseType('blob')
 *        .end(callback);
 *
 * @param {String} val
 * @return {Request} for chaining
 * @api public
 */


RequestBase.prototype.responseType = function (val) {
  this._responseType = val;
  return this;
};
/**
 * Override default request body serializer
 *
 * This function will be called to convert data set via .send or .attach into payload to send
 *
 * @param {Function}
 * @api public
 */


RequestBase.prototype.serialize = function serialize(fn) {
  this._serializer = fn;
  return this;
};
/**
 * Set timeouts.
 *
 * - response timeout is time between sending request and receiving the first byte of the response. Includes DNS and connection time.
 * - deadline is the time from start of the request to receiving response body in full. If the deadline is too short large files may not load at all on slow connections.
 *
 * Value of 0 or false means no timeout.
 *
 * @param {Number|Object} ms or {response, deadline}
 * @return {Request} for chaining
 * @api public
 */


RequestBase.prototype.timeout = function timeout(options) {
  if (!options || 'object' !== _typeof(options)) {
    this._timeout = options;
    this._responseTimeout = 0;
    return this;
  }

  for (var option in options) {
    switch (option) {
      case 'deadline':
        this._timeout = options.deadline;
        break;

      case 'response':
        this._responseTimeout = options.response;
        break;

      default:
        console.warn("Unknown timeout option", option);
    }
  }

  return this;
};
/**
 * Set number of retry attempts on error.
 *
 * Failed requests will be retried 'count' times if timeout or err.code >= 500.
 *
 * @param {Number} count
 * @return {Request} for chaining
 * @api public
 */


RequestBase.prototype.retry = function retry(count) {
  // Default to 1 if no count passed or true
  if (arguments.length === 0 || count === true) count = 1;
  if (count <= 0) count = 0;
  this._maxRetries = count;
  this._retries = 0;
  return this;
};
/**
 * Retry request
 *
 * @return {Request} for chaining
 * @api private
 */


RequestBase.prototype._retry = function () {
  this.clearTimeout(); // node

  if (this.req) {
    this.req = null;
    this.req = this.request();
  }

  this._aborted = false;
  this.timedout = false;
  return this._end();
};
/**
 * Promise support
 *
 * @param {Function} resolve
 * @param {Function} [reject]
 * @return {Request}
 */


RequestBase.prototype.then = function then(resolve, reject) {
  if (!this._fullfilledPromise) {
    var self = this;

    if (this._endCalled) {
      console.warn("Warning: superagent request was sent twice, because both .end() and .then() were called. Never call .end() if you use promises");
    }

    this._fullfilledPromise = new Promise(function (innerResolve, innerReject) {
      self.end(function (err, res) {
        if (err) innerReject(err);else innerResolve(res);
      });
    });
  }

  return this._fullfilledPromise.then(resolve, reject);
};

RequestBase.prototype["catch"] = function (cb) {
  return this.then(undefined, cb);
};
/**
 * Allow for extension
 */


RequestBase.prototype.use = function use(fn) {
  fn(this);
  return this;
};

RequestBase.prototype.ok = function (cb) {
  if ('function' !== typeof cb) throw Error("Callback required");
  this._okCallback = cb;
  return this;
};

RequestBase.prototype._isResponseOK = function (res) {
  if (!res) {
    return false;
  }

  if (this._okCallback) {
    return this._okCallback(res);
  }

  return res.status >= 200 && res.status < 300;
};
/**
 * Get request header `field`.
 * Case-insensitive.
 *
 * @param {String} field
 * @return {String}
 * @api public
 */


RequestBase.prototype.get = function (field) {
  return this._header[field.toLowerCase()];
};
/**
 * Get case-insensitive header `field` value.
 * This is a deprecated internal API. Use `.get(field)` instead.
 *
 * (getHeader is no longer used internally by the superagent code base)
 *
 * @param {String} field
 * @return {String}
 * @api private
 * @deprecated
 */


RequestBase.prototype.getHeader = RequestBase.prototype.get;
/**
 * Set header `field` to `val`, or multiple fields with one object.
 * Case-insensitive.
 *
 * Examples:
 *
 *      req.get('/')
 *        .set('Accept', 'application/json')
 *        .set('X-API-Key', 'foobar')
 *        .end(callback);
 *
 *      req.get('/')
 *        .set({ Accept: 'application/json', 'X-API-Key': 'foobar' })
 *        .end(callback);
 *
 * @param {String|Object} field
 * @param {String} val
 * @return {Request} for chaining
 * @api public
 */

RequestBase.prototype.set = function (field, val) {
  if (isObject_1(field)) {
    for (var key in field) {
      this.set(key, field[key]);
    }

    return this;
  }

  this._header[field.toLowerCase()] = val;
  this.header[field] = val;
  return this;
};
/**
 * Remove header `field`.
 * Case-insensitive.
 *
 * Example:
 *
 *      req.get('/')
 *        .unset('User-Agent')
 *        .end(callback);
 *
 * @param {String} field
 */


RequestBase.prototype.unset = function (field) {
  delete this._header[field.toLowerCase()];
  delete this.header[field];
  return this;
};
/**
 * Write the field `name` and `val`, or multiple fields with one object
 * for "multipart/form-data" request bodies.
 *
 * ``` js
 * request.post('/upload')
 *   .field('foo', 'bar')
 *   .end(callback);
 *
 * request.post('/upload')
 *   .field({ foo: 'bar', baz: 'qux' })
 *   .end(callback);
 * ```
 *
 * @param {String|Object} name
 * @param {String|Blob|File|Buffer|fs.ReadStream} val
 * @return {Request} for chaining
 * @api public
 */


RequestBase.prototype.field = function (name, val) {
  // name should be either a string or an object.
  if (null === name || undefined === name) {
    throw new Error('.field(name, val) name can not be empty');
  }

  if (this._data) {
    console.error(".field() can't be used if .send() is used. Please use only .send() or only .field() & .attach()");
  }

  if (isObject_1(name)) {
    for (var key in name) {
      this.field(key, name[key]);
    }

    return this;
  }

  if (Array.isArray(val)) {
    for (var i in val) {
      this.field(name, val[i]);
    }

    return this;
  } // val should be defined now


  if (null === val || undefined === val) {
    throw new Error('.field(name, val) val can not be empty');
  }

  if ('boolean' === typeof val) {
    val = '' + val;
  }

  this._getFormData().append(name, val);

  return this;
};
/**
 * Abort the request, and clear potential timeout.
 *
 * @return {Request}
 * @api public
 */


RequestBase.prototype.abort = function () {
  if (this._aborted) {
    return this;
  }

  this._aborted = true;
  this.xhr && this.xhr.abort(); // browser

  this.req && this.req.abort(); // node

  this.clearTimeout();
  this.emit('abort');
  return this;
};
/**
 * Enable transmission of cookies with x-domain requests.
 *
 * Note that for this to work the origin must not be
 * using "Access-Control-Allow-Origin" with a wildcard,
 * and also must set "Access-Control-Allow-Credentials"
 * to "true".
 *
 * @api public
 */


RequestBase.prototype.withCredentials = function (on) {
  // This is browser-only functionality. Node side is no-op.
  if (on == undefined) on = true;
  this._withCredentials = on;
  return this;
};
/**
 * Set the max redirects to `n`. Does noting in browser XHR implementation.
 *
 * @param {Number} n
 * @return {Request} for chaining
 * @api public
 */


RequestBase.prototype.redirects = function (n) {
  this._maxRedirects = n;
  return this;
};
/**
 * Maximum size of buffered response body, in bytes. Counts uncompressed size.
 * Default 200MB.
 *
 * @param {Number} n
 * @return {Request} for chaining
 */


RequestBase.prototype.maxResponseSize = function (n) {
  if ('number' !== typeof n) {
    throw TypeError("Invalid argument");
  }

  this._maxResponseSize = n;
  return this;
};
/**
 * Convert to a plain javascript object (not JSON string) of scalar properties.
 * Note as this method is designed to return a useful non-this value,
 * it cannot be chained.
 *
 * @return {Object} describing method, url, and data of this request
 * @api public
 */


RequestBase.prototype.toJSON = function () {
  return {
    method: this.method,
    url: this.url,
    data: this._data,
    headers: this._header
  };
};
/**
 * Send `data` as the request body, defaulting the `.type()` to "json" when
 * an object is given.
 *
 * Examples:
 *
 *       // manual json
 *       request.post('/user')
 *         .type('json')
 *         .send('{"name":"tj"}')
 *         .end(callback)
 *
 *       // auto json
 *       request.post('/user')
 *         .send({ name: 'tj' })
 *         .end(callback)
 *
 *       // manual x-www-form-urlencoded
 *       request.post('/user')
 *         .type('form')
 *         .send('name=tj')
 *         .end(callback)
 *
 *       // auto x-www-form-urlencoded
 *       request.post('/user')
 *         .type('form')
 *         .send({ name: 'tj' })
 *         .end(callback)
 *
 *       // defaults to x-www-form-urlencoded
 *      request.post('/user')
 *        .send('name=tobi')
 *        .send('species=ferret')
 *        .end(callback)
 *
 * @param {String|Object} data
 * @return {Request} for chaining
 * @api public
 */


RequestBase.prototype.send = function (data) {
  var isObj = isObject_1(data);
  var type = this._header['content-type'];

  if (this._formData) {
    console.error(".send() can't be used if .attach() or .field() is used. Please use only .send() or only .field() & .attach()");
  }

  if (isObj && !this._data) {
    if (Array.isArray(data)) {
      this._data = [];
    } else if (!this._isHost(data)) {
      this._data = {};
    }
  } else if (data && this._data && this._isHost(this._data)) {
    throw Error("Can't merge these send calls");
  } // merge


  if (isObj && isObject_1(this._data)) {
    for (var key in data) {
      this._data[key] = data[key];
    }
  } else if ('string' == typeof data) {
    // default to x-www-form-urlencoded
    if (!type) this.type('form');
    type = this._header['content-type'];

    if ('application/x-www-form-urlencoded' == type) {
      this._data = this._data ? this._data + '&' + data : data;
    } else {
      this._data = (this._data || '') + data;
    }
  } else {
    this._data = data;
  }

  if (!isObj || this._isHost(data)) {
    return this;
  } // default to json


  if (!type) this.type('json');
  return this;
};
/**
 * Sort `querystring` by the sort function
 *
 *
 * Examples:
 *
 *       // default order
 *       request.get('/user')
 *         .query('name=Nick')
 *         .query('search=Manny')
 *         .sortQuery()
 *         .end(callback)
 *
 *       // customized sort function
 *       request.get('/user')
 *         .query('name=Nick')
 *         .query('search=Manny')
 *         .sortQuery(function(a, b){
 *           return a.length - b.length;
 *         })
 *         .end(callback)
 *
 *
 * @param {Function} sort
 * @return {Request} for chaining
 * @api public
 */


RequestBase.prototype.sortQuery = function (sort) {
  // _sort default to true but otherwise can be a function or boolean
  this._sort = typeof sort === 'undefined' ? true : sort;
  return this;
};
/**
 * Compose querystring to append to req.url
 *
 * @api private
 */


RequestBase.prototype._finalizeQueryString = function () {
  var query = this._query.join('&');

  if (query) {
    this.url += (this.url.indexOf('?') >= 0 ? '&' : '?') + query;
  }

  this._query.length = 0; // Makes the call idempotent

  if (this._sort) {
    var index = this.url.indexOf('?');

    if (index >= 0) {
      var queryArr = this.url.substring(index + 1).split('&');

      if ('function' === typeof this._sort) {
        queryArr.sort(this._sort);
      } else {
        queryArr.sort();
      }

      this.url = this.url.substring(0, index) + '?' + queryArr.join('&');
    }
  }
}; // For backwards compat only


RequestBase.prototype._appendQueryString = function () {
  console.trace("Unsupported");
};
/**
 * Invoke callback with timeout error.
 *
 * @api private
 */


RequestBase.prototype._timeoutError = function (reason, timeout, errno) {
  if (this._aborted) {
    return;
  }

  var err = new Error(reason + timeout + 'ms exceeded');
  err.timeout = timeout;
  err.code = 'ECONNABORTED';
  err.errno = errno;
  this.timedout = true;
  this.abort();
  this.callback(err);
};

RequestBase.prototype._setTimeouts = function () {
  var self = this; // deadline

  if (this._timeout && !this._timer) {
    this._timer = setTimeout(function () {
      self._timeoutError('Timeout of ', self._timeout, 'ETIME');
    }, this._timeout);
  } // response timeout


  if (this._responseTimeout && !this._responseTimeoutTimer) {
    this._responseTimeoutTimer = setTimeout(function () {
      self._timeoutError('Response timeout of ', self._responseTimeout, 'ETIMEDOUT');
    }, this._responseTimeout);
  }
};

/**
 * Return the mime type for the given `str`.
 *
 * @param {String} str
 * @return {String}
 * @api private
 */

var type = function type(str) {
  return str.split(/ *; */).shift();
};
/**
 * Return header field parameters.
 *
 * @param {String} str
 * @return {Object}
 * @api private
 */


var params = function params(str) {
  return str.split(/ *; */).reduce(function (obj, str) {
    var parts = str.split(/ *= */);
    var key = parts.shift();
    var val = parts.shift();
    if (key && val) obj[key] = val;
    return obj;
  }, {});
};
/**
 * Parse Link header fields.
 *
 * @param {String} str
 * @return {Object}
 * @api private
 */


var parseLinks = function parseLinks(str) {
  return str.split(/ *, */).reduce(function (obj, str) {
    var parts = str.split(/ *; */);
    var url = parts[0].slice(1, -1);
    var rel = parts[1].split(/ *= */)[1].slice(1, -1);
    obj[rel] = url;
    return obj;
  }, {});
};
/**
 * Strip content related fields from `header`.
 *
 * @param {Object} header
 * @return {Object} header
 * @api private
 */


var cleanHeader = function cleanHeader(header, shouldStripCookie) {
  delete header['content-type'];
  delete header['content-length'];
  delete header['transfer-encoding'];
  delete header['host'];

  if (shouldStripCookie) {
    delete header['cookie'];
  }

  return header;
};

var utils = {
  type: type,
  params: params,
  parseLinks: parseLinks,
  cleanHeader: cleanHeader
};

/**
 * Module dependencies.
 */

/**
 * Expose `ResponseBase`.
 */


var responseBase = ResponseBase;
/**
 * Initialize a new `ResponseBase`.
 *
 * @api public
 */

function ResponseBase(obj) {
  if (obj) return mixin$1(obj);
}
/**
 * Mixin the prototype properties.
 *
 * @param {Object} obj
 * @return {Object}
 * @api private
 */


function mixin$1(obj) {
  for (var key in ResponseBase.prototype) {
    obj[key] = ResponseBase.prototype[key];
  }

  return obj;
}
/**
 * Get case-insensitive `field` value.
 *
 * @param {String} field
 * @return {String}
 * @api public
 */


ResponseBase.prototype.get = function (field) {
  return this.header[field.toLowerCase()];
};
/**
 * Set header related properties:
 *
 *   - `.type` the content type without params
 *
 * A response of "Content-Type: text/plain; charset=utf-8"
 * will provide you with a `.type` of "text/plain".
 *
 * @param {Object} header
 * @api private
 */


ResponseBase.prototype._setHeaderProperties = function (header) {
  // TODO: moar!
  // TODO: make this a util
  // content-type
  var ct = header['content-type'] || '';
  this.type = utils.type(ct); // params

  var params = utils.params(ct);

  for (var key in params) {
    this[key] = params[key];
  }

  this.links = {}; // links

  try {
    if (header.link) {
      this.links = utils.parseLinks(header.link);
    }
  } catch (err) {// ignore
  }
};
/**
 * Set flags such as `.ok` based on `status`.
 *
 * For example a 2xx response will give you a `.ok` of __true__
 * whereas 5xx will be __false__ and `.error` will be __true__. The
 * `.clientError` and `.serverError` are also available to be more
 * specific, and `.statusType` is the class of error ranging from 1..5
 * sometimes useful for mapping respond colors etc.
 *
 * "sugar" properties are also defined for common cases. Currently providing:
 *
 *   - .noContent
 *   - .badRequest
 *   - .unauthorized
 *   - .notAcceptable
 *   - .notFound
 *
 * @param {Number} status
 * @api private
 */


ResponseBase.prototype._setStatusProperties = function (status) {
  var type = status / 100 | 0; // status / class

  this.status = this.statusCode = status;
  this.statusType = type; // basics

  this.info = 1 == type;
  this.ok = 2 == type;
  this.redirect = 3 == type;
  this.clientError = 4 == type;
  this.serverError = 5 == type;
  this.error = 4 == type || 5 == type ? this.toError() : false; // sugar

  this.accepted = 202 == status;
  this.noContent = 204 == status;
  this.badRequest = 400 == status;
  this.unauthorized = 401 == status;
  this.notAcceptable = 406 == status;
  this.forbidden = 403 == status;
  this.notFound = 404 == status;
};

var ERROR_CODES = ['ECONNRESET', 'ETIMEDOUT', 'EADDRINFO', 'ESOCKETTIMEDOUT'];
/**
 * Determine if a request should be retried.
 * (Borrowed from segmentio/superagent-retry)
 *
 * @param {Error} err
 * @param {Response} [res]
 * @returns {Boolean}
 */

var shouldRetry = function shouldRetry(err, res) {
  if (err && err.code && ~ERROR_CODES.indexOf(err.code)) return true;
  if (res && res.status && res.status >= 500) return true; // Superagent timeout

  if (err && 'timeout' in err && err.code == 'ECONNABORTED') return true;
  if (err && 'crossDomain' in err) return true;
  return false;
};

var client = createCommonjsModule(function (module, exports) {
  /**
   * Root reference for iframes.
   */
  var root;

  if (typeof window !== 'undefined') {
    // Browser window
    root = window;
  } else if (typeof self !== 'undefined') {
    // Web Worker
    root = self;
  } else {
    // Other environments
    console.warn("Using browser-only version of superagent in non-browser environment");
    root = commonjsGlobal;
  }
  /**
   * Noop.
   */


  function noop() {}
  /**
   * Expose `request`.
   */

  var request = exports = module.exports = function (method, url) {
    // callback
    if ('function' == typeof url) {
      return new exports.Request('GET', method).end(url);
    } // url first


    if (1 == arguments.length) {
      return new exports.Request('GET', method);
    }

    return new exports.Request(method, url);
  };

  exports.Request = Request;
  /**
   * Determine XHR.
   */

  request.getXHR = function () {
    if (root.XMLHttpRequest && (!root.location || 'file:' != root.location.protocol || !root.ActiveXObject)) {
      return new XMLHttpRequest();
    } else {
      try {
        return new ActiveXObject('Microsoft.XMLHTTP');
      } catch (e) {}

      try {
        return new ActiveXObject('Msxml2.XMLHTTP.6.0');
      } catch (e) {}

      try {
        return new ActiveXObject('Msxml2.XMLHTTP.3.0');
      } catch (e) {}

      try {
        return new ActiveXObject('Msxml2.XMLHTTP');
      } catch (e) {}
    }

    throw Error("Browser-only version of superagent could not find XHR");
  };
  /**
   * Removes leading and trailing whitespace, added to support IE.
   *
   * @param {String} s
   * @return {String}
   * @api private
   */


  var trim = ''.trim ? function (s) {
    return s.trim();
  } : function (s) {
    return s.replace(/(^\s*|\s*$)/g, '');
  };
  /**
   * Serialize the given `obj`.
   *
   * @param {Object} obj
   * @return {String}
   * @api private
   */

  function serialize(obj) {
    if (!isObject_1(obj)) return obj;
    var pairs = [];

    for (var key in obj) {
      pushEncodedKeyValuePair(pairs, key, obj[key]);
    }

    return pairs.join('&');
  }
  /**
   * Helps 'serialize' with serializing arrays.
   * Mutates the pairs array.
   *
   * @param {Array} pairs
   * @param {String} key
   * @param {Mixed} val
   */


  function pushEncodedKeyValuePair(pairs, key, val) {
    if (val != null) {
      if (Array.isArray(val)) {
        val.forEach(function (v) {
          pushEncodedKeyValuePair(pairs, key, v);
        });
      } else if (isObject_1(val)) {
        for (var subkey in val) {
          pushEncodedKeyValuePair(pairs, key + '[' + subkey + ']', val[subkey]);
        }
      } else {
        pairs.push(encodeURIComponent(key) + '=' + encodeURIComponent(val));
      }
    } else if (val === null) {
      pairs.push(encodeURIComponent(key));
    }
  }
  /**
   * Expose serialization method.
   */


  request.serializeObject = serialize;
  /**
   * Parse the given x-www-form-urlencoded `str`.
   *
   * @param {String} str
   * @return {Object}
   * @api private
   */

  function parseString(str) {
    var obj = {};
    var pairs = str.split('&');
    var pair;
    var pos;

    for (var i = 0, len = pairs.length; i < len; ++i) {
      pair = pairs[i];
      pos = pair.indexOf('=');

      if (pos == -1) {
        obj[decodeURIComponent(pair)] = '';
      } else {
        obj[decodeURIComponent(pair.slice(0, pos))] = decodeURIComponent(pair.slice(pos + 1));
      }
    }

    return obj;
  }
  /**
   * Expose parser.
   */


  request.parseString = parseString;
  /**
   * Default MIME type map.
   *
   *     superagent.types.xml = 'application/xml';
   *
   */

  request.types = {
    html: 'text/html',
    json: 'application/json',
    xml: 'text/xml',
    urlencoded: 'application/x-www-form-urlencoded',
    'form': 'application/x-www-form-urlencoded',
    'form-data': 'application/x-www-form-urlencoded'
  };
  /**
   * Default serialization map.
   *
   *     superagent.serialize['application/xml'] = function(obj){
   *       return 'generated xml here';
   *     };
   *
   */

  request.serialize = {
    'application/x-www-form-urlencoded': serialize,
    'application/json': JSON.stringify
  };
  /**
   * Default parsers.
   *
   *     superagent.parse['application/xml'] = function(str){
   *       return { object parsed from str };
   *     };
   *
   */

  request.parse = {
    'application/x-www-form-urlencoded': parseString,
    'application/json': JSON.parse
  };
  /**
   * Parse the given header `str` into
   * an object containing the mapped fields.
   *
   * @param {String} str
   * @return {Object}
   * @api private
   */

  function parseHeader(str) {
    var lines = str.split(/\r?\n/);
    var fields = {};
    var index;
    var line;
    var field;
    var val;

    for (var i = 0, len = lines.length; i < len; ++i) {
      line = lines[i];
      index = line.indexOf(':');

      if (index === -1) {
        // could be empty line, just skip it
        continue;
      }

      field = line.slice(0, index).toLowerCase();
      val = trim(line.slice(index + 1));
      fields[field] = val;
    }

    return fields;
  }
  /**
   * Check if `mime` is json or has +json structured syntax suffix.
   *
   * @param {String} mime
   * @return {Boolean}
   * @api private
   */


  function isJSON(mime) {
    return /[\/+]json\b/.test(mime);
  }
  /**
   * Initialize a new `Response` with the given `xhr`.
   *
   *  - set flags (.ok, .error, etc)
   *  - parse header
   *
   * Examples:
   *
   *  Aliasing `superagent` as `request` is nice:
   *
   *      request = superagent;
   *
   *  We can use the promise-like API, or pass callbacks:
   *
   *      request.get('/').end(function(res){});
   *      request.get('/', function(res){});
   *
   *  Sending data can be chained:
   *
   *      request
   *        .post('/user')
   *        .send({ name: 'tj' })
   *        .end(function(res){});
   *
   *  Or passed to `.send()`:
   *
   *      request
   *        .post('/user')
   *        .send({ name: 'tj' }, function(res){});
   *
   *  Or passed to `.post()`:
   *
   *      request
   *        .post('/user', { name: 'tj' })
   *        .end(function(res){});
   *
   * Or further reduced to a single call for simple cases:
   *
   *      request
   *        .post('/user', { name: 'tj' }, function(res){});
   *
   * @param {XMLHTTPRequest} xhr
   * @param {Object} options
   * @api private
   */


  function Response(req) {
    this.req = req;
    this.xhr = this.req.xhr; // responseText is accessible only if responseType is '' or 'text' and on older browsers

    this.text = this.req.method != 'HEAD' && (this.xhr.responseType === '' || this.xhr.responseType === 'text') || typeof this.xhr.responseType === 'undefined' ? this.xhr.responseText : null;
    this.statusText = this.req.xhr.statusText;
    var status = this.xhr.status; // handle IE9 bug: http://stackoverflow.com/questions/10046972/msie-returns-status-code-of-1223-for-ajax-request

    if (status === 1223) {
      status = 204;
    }

    this._setStatusProperties(status);

    this.header = this.headers = parseHeader(this.xhr.getAllResponseHeaders()); // getAllResponseHeaders sometimes falsely returns "" for CORS requests, but
    // getResponseHeader still works. so we get content-type even if getting
    // other headers fails.

    this.header['content-type'] = this.xhr.getResponseHeader('content-type');

    this._setHeaderProperties(this.header);

    if (null === this.text && req._responseType) {
      this.body = this.xhr.response;
    } else {
      this.body = this.req.method != 'HEAD' ? this._parseBody(this.text ? this.text : this.xhr.response) : null;
    }
  }

  responseBase(Response.prototype);
  /**
   * Parse the given body `str`.
   *
   * Used for auto-parsing of bodies. Parsers
   * are defined on the `superagent.parse` object.
   *
   * @param {String} str
   * @return {Mixed}
   * @api private
   */

  Response.prototype._parseBody = function (str) {
    var parse = request.parse[this.type];

    if (this.req._parser) {
      return this.req._parser(this, str);
    }

    if (!parse && isJSON(this.type)) {
      parse = request.parse['application/json'];
    }

    return parse && str && (str.length || str instanceof Object) ? parse(str) : null;
  };
  /**
   * Return an `Error` representative of this response.
   *
   * @return {Error}
   * @api public
   */


  Response.prototype.toError = function () {
    var req = this.req;
    var method = req.method;
    var url = req.url;
    var msg = 'cannot ' + method + ' ' + url + ' (' + this.status + ')';
    var err = new Error(msg);
    err.status = this.status;
    err.method = method;
    err.url = url;
    return err;
  };
  /**
   * Expose `Response`.
   */


  request.Response = Response;
  /**
   * Initialize a new `Request` with the given `method` and `url`.
   *
   * @param {String} method
   * @param {String} url
   * @api public
   */

  function Request(method, url) {
    var self = this;
    this._query = this._query || [];
    this.method = method;
    this.url = url;
    this.header = {}; // preserves header name case

    this._header = {}; // coerces header names to lowercase

    this.on('end', function () {
      var err = null;
      var res = null;

      try {
        res = new Response(self);
      } catch (e) {
        err = new Error('Parser is unable to parse the response');
        err.parse = true;
        err.original = e; // issue #675: return the raw response if the response parsing fails

        if (self.xhr) {
          // ie9 doesn't have 'response' property
          err.rawResponse = typeof self.xhr.responseType == 'undefined' ? self.xhr.responseText : self.xhr.response; // issue #876: return the http status code if the response parsing fails

          err.status = self.xhr.status ? self.xhr.status : null;
          err.statusCode = err.status; // backwards-compat only
        } else {
          err.rawResponse = null;
          err.status = null;
        }

        return self.callback(err);
      }

      self.emit('response', res);
      var new_err;

      try {
        if (!self._isResponseOK(res)) {
          new_err = new Error(res.statusText || 'Unsuccessful HTTP response');
        }
      } catch (custom_err) {
        new_err = custom_err; // ok() callback can throw
      } // #1000 don't catch errors from the callback to avoid double calling it


      if (new_err) {
        new_err.original = err;
        new_err.response = res;
        new_err.status = res.status;
        self.callback(new_err, res);
      } else {
        self.callback(null, res);
      }
    });
  }
  /**
   * Mixin `Emitter` and `RequestBase`.
   */


  componentEmitter(Request.prototype);
  requestBase(Request.prototype);
  /**
   * Set Content-Type to `type`, mapping values from `request.types`.
   *
   * Examples:
   *
   *      superagent.types.xml = 'application/xml';
   *
   *      request.post('/')
   *        .type('xml')
   *        .send(xmlstring)
   *        .end(callback);
   *
   *      request.post('/')
   *        .type('application/xml')
   *        .send(xmlstring)
   *        .end(callback);
   *
   * @param {String} type
   * @return {Request} for chaining
   * @api public
   */

  Request.prototype.type = function (type) {
    this.set('Content-Type', request.types[type] || type);
    return this;
  };
  /**
   * Set Accept to `type`, mapping values from `request.types`.
   *
   * Examples:
   *
   *      superagent.types.json = 'application/json';
   *
   *      request.get('/agent')
   *        .accept('json')
   *        .end(callback);
   *
   *      request.get('/agent')
   *        .accept('application/json')
   *        .end(callback);
   *
   * @param {String} accept
   * @return {Request} for chaining
   * @api public
   */


  Request.prototype.accept = function (type) {
    this.set('Accept', request.types[type] || type);
    return this;
  };
  /**
   * Set Authorization field value with `user` and `pass`.
   *
   * @param {String} user
   * @param {String} [pass] optional in case of using 'bearer' as type
   * @param {Object} options with 'type' property 'auto', 'basic' or 'bearer' (default 'basic')
   * @return {Request} for chaining
   * @api public
   */


  Request.prototype.auth = function (user, pass, options) {
    if (_typeof(pass) === 'object' && pass !== null) {
      // pass is optional and can substitute for options
      options = pass;
    }

    if (!options) {
      options = {
        type: 'function' === typeof btoa ? 'basic' : 'auto'
      };
    }

    switch (options.type) {
      case 'basic':
        this.set('Authorization', 'Basic ' + btoa(user + ':' + pass));
        break;

      case 'auto':
        this.username = user;
        this.password = pass;
        break;

      case 'bearer':
        // usage would be .auth(accessToken, { type: 'bearer' })
        this.set('Authorization', 'Bearer ' + user);
        break;
    }

    return this;
  };
  /**
   * Add query-string `val`.
   *
   * Examples:
   *
   *   request.get('/shoes')
   *     .query('size=10')
   *     .query({ color: 'blue' })
   *
   * @param {Object|String} val
   * @return {Request} for chaining
   * @api public
   */


  Request.prototype.query = function (val) {
    if ('string' != typeof val) val = serialize(val);
    if (val) this._query.push(val);
    return this;
  };
  /**
   * Queue the given `file` as an attachment to the specified `field`,
   * with optional `options` (or filename).
   *
   * ``` js
   * request.post('/upload')
   *   .attach('content', new Blob(['<a id="a"><b id="b">hey!</b></a>'], { type: "text/html"}))
   *   .end(callback);
   * ```
   *
   * @param {String} field
   * @param {Blob|File} file
   * @param {String|Object} options
   * @return {Request} for chaining
   * @api public
   */


  Request.prototype.attach = function (field, file, options) {
    if (file) {
      if (this._data) {
        throw Error("superagent can't mix .send() and .attach()");
      }

      this._getFormData().append(field, file, options || file.name);
    }

    return this;
  };

  Request.prototype._getFormData = function () {
    if (!this._formData) {
      this._formData = new root.FormData();
    }

    return this._formData;
  };
  /**
   * Invoke the callback with `err` and `res`
   * and handle arity check.
   *
   * @param {Error} err
   * @param {Response} res
   * @api private
   */


  Request.prototype.callback = function (err, res) {
    // console.log(this._retries, this._maxRetries)
    if (this._maxRetries && this._retries++ < this._maxRetries && shouldRetry(err, res)) {
      return this._retry();
    }

    var fn = this._callback;
    this.clearTimeout();

    if (err) {
      if (this._maxRetries) err.retries = this._retries - 1;
      this.emit('error', err);
    }

    fn(err, res);
  };
  /**
   * Invoke callback with x-domain error.
   *
   * @api private
   */


  Request.prototype.crossDomainError = function () {
    var err = new Error('Request has been terminated\nPossible causes: the network is offline, Origin is not allowed by Access-Control-Allow-Origin, the page is being unloaded, etc.');
    err.crossDomain = true;
    err.status = this.status;
    err.method = this.method;
    err.url = this.url;
    this.callback(err);
  }; // This only warns, because the request is still likely to work


  Request.prototype.buffer = Request.prototype.ca = Request.prototype.agent = function () {
    console.warn("This is not supported in browser version of superagent");
    return this;
  }; // This throws, because it can't send/receive data as expected


  Request.prototype.pipe = Request.prototype.write = function () {
    throw Error("Streaming is not supported in browser version of superagent");
  };
  /**
   * Check if `obj` is a host object,
   * we don't want to serialize these :)
   *
   * @param {Object} obj
   * @return {Boolean}
   * @api private
   */


  Request.prototype._isHost = function _isHost(obj) {
    // Native objects stringify to [object File], [object Blob], [object FormData], etc.
    return obj && 'object' === _typeof(obj) && !Array.isArray(obj) && Object.prototype.toString.call(obj) !== '[object Object]';
  };
  /**
   * Initiate request, invoking callback `fn(res)`
   * with an instanceof `Response`.
   *
   * @param {Function} fn
   * @return {Request} for chaining
   * @api public
   */


  Request.prototype.end = function (fn) {
    if (this._endCalled) {
      console.warn("Warning: .end() was called twice. This is not supported in superagent");
    }

    this._endCalled = true; // store callback

    this._callback = fn || noop; // querystring

    this._finalizeQueryString();

    return this._end();
  };

  Request.prototype._end = function () {
    var self = this;
    var xhr = this.xhr = request.getXHR();
    var data = this._formData || this._data;

    this._setTimeouts(); // state change


    xhr.onreadystatechange = function () {
      var readyState = xhr.readyState;

      if (readyState >= 2 && self._responseTimeoutTimer) {
        clearTimeout(self._responseTimeoutTimer);
      }

      if (4 != readyState) {
        return;
      } // In IE9, reads to any property (e.g. status) off of an aborted XHR will
      // result in the error "Could not complete the operation due to error c00c023f"


      var status;

      try {
        status = xhr.status;
      } catch (e) {
        status = 0;
      }

      if (!status) {
        if (self.timedout || self._aborted) return;
        return self.crossDomainError();
      }

      self.emit('end');
    }; // progress


    var handleProgress = function handleProgress(direction, e) {
      if (e.total > 0) {
        e.percent = e.loaded / e.total * 100;
      }

      e.direction = direction;
      self.emit('progress', e);
    };

    if (this.hasListeners('progress')) {
      try {
        xhr.onprogress = handleProgress.bind(null, 'download');

        if (xhr.upload) {
          xhr.upload.onprogress = handleProgress.bind(null, 'upload');
        }
      } catch (e) {// Accessing xhr.upload fails in IE from a web worker, so just pretend it doesn't exist.
        // Reported here:
        // https://connect.microsoft.com/IE/feedback/details/837245/xmlhttprequest-upload-throws-invalid-argument-when-used-from-web-worker-context
      }
    } // initiate request


    try {
      if (this.username && this.password) {
        xhr.open(this.method, this.url, true, this.username, this.password);
      } else {
        xhr.open(this.method, this.url, true);
      }
    } catch (err) {
      // see #1149
      return this.callback(err);
    } // CORS


    if (this._withCredentials) xhr.withCredentials = true; // body

    if (!this._formData && 'GET' != this.method && 'HEAD' != this.method && 'string' != typeof data && !this._isHost(data)) {
      // serialize stuff
      var contentType = this._header['content-type'];
      var serialize = this._serializer || request.serialize[contentType ? contentType.split(';')[0] : ''];

      if (!serialize && isJSON(contentType)) {
        serialize = request.serialize['application/json'];
      }

      if (serialize) data = serialize(data);
    } // set header fields


    for (var field in this.header) {
      if (null == this.header[field]) continue;
      if (this.header.hasOwnProperty(field)) xhr.setRequestHeader(field, this.header[field]);
    }

    if (this._responseType) {
      xhr.responseType = this._responseType;
    } // send stuff


    this.emit('request', this); // IE11 xhr.send(undefined) sends 'undefined' string as POST payload (instead of nothing)
    // We need null here if data is undefined

    xhr.send(typeof data !== 'undefined' ? data : null);
    return this;
  };
  /**
   * GET `url` with optional callback `fn(res)`.
   *
   * @param {String} url
   * @param {Mixed|Function} [data] or fn
   * @param {Function} [fn]
   * @return {Request}
   * @api public
   */


  request.get = function (url, data, fn) {
    var req = request('GET', url);
    if ('function' == typeof data) fn = data, data = null;
    if (data) req.query(data);
    if (fn) req.end(fn);
    return req;
  };
  /**
   * HEAD `url` with optional callback `fn(res)`.
   *
   * @param {String} url
   * @param {Mixed|Function} [data] or fn
   * @param {Function} [fn]
   * @return {Request}
   * @api public
   */


  request.head = function (url, data, fn) {
    var req = request('HEAD', url);
    if ('function' == typeof data) fn = data, data = null;
    if (data) req.query(data);
    if (fn) req.end(fn);
    return req;
  };
  /**
   * OPTIONS query to `url` with optional callback `fn(res)`.
   *
   * @param {String} url
   * @param {Mixed|Function} [data] or fn
   * @param {Function} [fn]
   * @return {Request}
   * @api public
   */


  request.options = function (url, data, fn) {
    var req = request('OPTIONS', url);
    if ('function' == typeof data) fn = data, data = null;
    if (data) req.send(data);
    if (fn) req.end(fn);
    return req;
  };
  /**
   * DELETE `url` with optional `data` and callback `fn(res)`.
   *
   * @param {String} url
   * @param {Mixed} [data]
   * @param {Function} [fn]
   * @return {Request}
   * @api public
   */


  function del(url, data, fn) {
    var req = request('DELETE', url);
    if ('function' == typeof data) fn = data, data = null;
    if (data) req.send(data);
    if (fn) req.end(fn);
    return req;
  }
  request['del'] = del;
  request['delete'] = del;
  /**
   * PATCH `url` with optional `data` and callback `fn(res)`.
   *
   * @param {String} url
   * @param {Mixed} [data]
   * @param {Function} [fn]
   * @return {Request}
   * @api public
   */

  request.patch = function (url, data, fn) {
    var req = request('PATCH', url);
    if ('function' == typeof data) fn = data, data = null;
    if (data) req.send(data);
    if (fn) req.end(fn);
    return req;
  };
  /**
   * POST `url` with optional `data` and callback `fn(res)`.
   *
   * @param {String} url
   * @param {Mixed} [data]
   * @param {Function} [fn]
   * @return {Request}
   * @api public
   */


  request.post = function (url, data, fn) {
    var req = request('POST', url);
    if ('function' == typeof data) fn = data, data = null;
    if (data) req.send(data);
    if (fn) req.end(fn);
    return req;
  };
  /**
   * PUT `url` with optional `data` and callback `fn(res)`.
   *
   * @param {String} url
   * @param {Mixed|Function} [data] or fn
   * @param {Function} [fn]
   * @return {Request}
   * @api public
   */


  request.put = function (url, data, fn) {
    var req = request('PUT', url);
    if ('function' == typeof data) fn = data, data = null;
    if (data) req.send(data);
    if (fn) req.end(fn);
    return req;
  };
});
var client_1 = client.Request;

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


// If obj.hasOwnProperty has been overridden, then calling
// obj.hasOwnProperty(prop) will break.
// See: https://github.com/joyent/node/issues/1707
function hasOwnProperty(obj, prop) {
  return Object.prototype.hasOwnProperty.call(obj, prop);
}
var isArray = Array.isArray || function (xs) {
  return Object.prototype.toString.call(xs) === '[object Array]';
};
function stringifyPrimitive(v) {
  switch (typeof v) {
    case 'string':
      return v;

    case 'boolean':
      return v ? 'true' : 'false';

    case 'number':
      return isFinite(v) ? v : '';

    default:
      return '';
  }
}

function stringify (obj, sep, eq, name) {
  sep = sep || '&';
  eq = eq || '=';
  if (obj === null) {
    obj = undefined;
  }

  if (typeof obj === 'object') {
    return map(objectKeys(obj), function(k) {
      var ks = encodeURIComponent(stringifyPrimitive(k)) + eq;
      if (isArray(obj[k])) {
        return map(obj[k], function(v) {
          return ks + encodeURIComponent(stringifyPrimitive(v));
        }).join(sep);
      } else {
        return ks + encodeURIComponent(stringifyPrimitive(obj[k]));
      }
    }).join(sep);

  }

  if (!name) return '';
  return encodeURIComponent(stringifyPrimitive(name)) + eq +
         encodeURIComponent(stringifyPrimitive(obj));
}
function map (xs, f) {
  if (xs.map) return xs.map(f);
  var res = [];
  for (var i = 0; i < xs.length; i++) {
    res.push(f(xs[i], i));
  }
  return res;
}

var objectKeys = Object.keys || function (obj) {
  var res = [];
  for (var key in obj) {
    if (Object.prototype.hasOwnProperty.call(obj, key)) res.push(key);
  }
  return res;
};

function parse(qs, sep, eq, options) {
  sep = sep || '&';
  eq = eq || '=';
  var obj = {};

  if (typeof qs !== 'string' || qs.length === 0) {
    return obj;
  }

  var regexp = /\+/g;
  qs = qs.split(sep);

  var maxKeys = 1000;
  if (options && typeof options.maxKeys === 'number') {
    maxKeys = options.maxKeys;
  }

  var len = qs.length;
  // maxKeys <= 0 means that we should not limit keys count
  if (maxKeys > 0 && len > maxKeys) {
    len = maxKeys;
  }

  for (var i = 0; i < len; ++i) {
    var x = qs[i].replace(regexp, '%20'),
        idx = x.indexOf(eq),
        kstr, vstr, k, v;

    if (idx >= 0) {
      kstr = x.substr(0, idx);
      vstr = x.substr(idx + 1);
    } else {
      kstr = x;
      vstr = '';
    }

    k = decodeURIComponent(kstr);
    v = decodeURIComponent(vstr);

    if (!hasOwnProperty(obj, k)) {
      obj[k] = v;
    } else if (isArray(obj[k])) {
      obj[k].push(v);
    } else {
      obj[k] = [obj[k], v];
    }
  }

  return obj;
}var require$$1 = {
  encode: stringify,
  stringify: stringify,
  decode: parse,
  parse: parse
};

var _nodeResolve_empty = {};

var _nodeResolve_empty$1 = /*#__PURE__*/Object.freeze({
  __proto__: null,
  'default': _nodeResolve_empty
});

var require$$2 = getCjsExportFromNamespace(_nodeResolve_empty$1);

var ApiClient_1 = createCommonjsModule(function (module, exports) {

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  exports["default"] = void 0;

  var _superagent = _interopRequireDefault(client);

  var _querystring = _interopRequireDefault(require$$1);

  function _interopRequireDefault(obj) {
    return obj && obj.__esModule ? obj : {
      "default": obj
    };
  }

  function _typeof(obj) {
    "@babel/helpers - typeof";

    if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") {
      _typeof = function _typeof(obj) {
        return typeof obj;
      };
    } else {
      _typeof = function _typeof(obj) {
        return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj;
      };
    }

    return _typeof(obj);
  }

  function _classCallCheck(instance, Constructor) {
    if (!(instance instanceof Constructor)) {
      throw new TypeError("Cannot call a class as a function");
    }
  }

  function _defineProperties(target, props) {
    for (var i = 0; i < props.length; i++) {
      var descriptor = props[i];
      descriptor.enumerable = descriptor.enumerable || false;
      descriptor.configurable = true;
      if ("value" in descriptor) descriptor.writable = true;
      Object.defineProperty(target, descriptor.key, descriptor);
    }
  }

  function _createClass(Constructor, protoProps, staticProps) {
    if (protoProps) _defineProperties(Constructor.prototype, protoProps);
    if (staticProps) _defineProperties(Constructor, staticProps);
    return Constructor;
  }
  /**
  * @module ApiClient
  * @version 1.0.0
  */

  /**
  * Manages low level client-server communications, parameter marshalling, etc. There should not be any need for an
  * application to use this class directly - the *Api and model classes provide the public API for the service. The
  * contents of this file should be regarded as internal but are documented for completeness.
  * @alias module:ApiClient
  * @class
  */


  var ApiClient = /*#__PURE__*/function () {
    function ApiClient() {
      _classCallCheck(this, ApiClient);
      /**
       * The base URL against which to resolve every API call's (relative) path.
       * @type {String}
       * @default http://127.0.0.1:5000
       */


      this.basePath = 'http://127.0.0.1:5000'.replace(/\/+$/, '');
      /**
       * The authentication methods to be included for all API calls.
       * @type {Array.<String>}
       */

      this.authentications = {};
      /**
       * The default HTTP headers to be included for all API calls.
       * @type {Array.<String>}
       * @default {}
       */

      this.defaultHeaders = {};
      /**
       * The default HTTP timeout for all API calls.
       * @type {Number}
       * @default 60000
       */

      this.timeout = 60000;
      /**
       * If set to false an additional timestamp parameter is added to all API GET calls to
       * prevent browser caching
       * @type {Boolean}
       * @default true
       */

      this.cache = true;
      /**
       * If set to true, the client will save the cookies from each server
       * response, and return them in the next request.
       * @default false
       */

      this.enableCookies = false;
      /*
       * Used to save and return cookies in a node.js (non-browser) setting,
       * if this.enableCookies is set to true.
       */

      if (typeof window === 'undefined') {
        this.agent = new _superagent["default"].agent();
      }
      /*
       * Allow user to override superagent agent
       */


      this.requestAgent = null;
      /*
       * Allow user to add superagent plugins
       */

      this.plugins = null;
    }
    /**
    * Returns a string representation for an actual parameter.
    * @param param The actual parameter.
    * @returns {String} The string representation of <code>param</code>.
    */


    _createClass(ApiClient, [{
      key: "paramToString",
      value: function paramToString(param) {
        if (param == undefined || param == null) {
          return '';
        }

        if (param instanceof Date) {
          return param.toJSON();
        }

        return param.toString();
      }
      /**
       * Builds full URL by appending the given path to the base URL and replacing path parameter place-holders with parameter values.
       * NOTE: query parameters are not handled here.
       * @param {String} path The path to append to the base URL.
       * @param {Object} pathParams The parameter values to append.
       * @param {String} apiBasePath Base path defined in the path, operation level to override the default one
       * @returns {String} The encoded path with parameter values substituted.
       */

    }, {
      key: "buildUrl",
      value: function buildUrl(path, pathParams, apiBasePath) {
        var _this = this;

        if (!path.match(/^\//)) {
          path = '/' + path;
        }

        var url = this.basePath + path; // use API (operation, path) base path if defined

        if (apiBasePath !== null && apiBasePath !== undefined) {
          url = apiBasePath + path;
        }

        url = url.replace(/\{([\w-]+)\}/g, function (fullMatch, key) {
          var value;

          if (pathParams.hasOwnProperty(key)) {
            value = _this.paramToString(pathParams[key]);
          } else {
            value = fullMatch;
          }

          return encodeURIComponent(value);
        });
        return url;
      }
      /**
      * Checks whether the given content type represents JSON.<br>
      * JSON content type examples:<br>
      * <ul>
      * <li>application/json</li>
      * <li>application/json; charset=UTF8</li>
      * <li>APPLICATION/JSON</li>
      * </ul>
      * @param {String} contentType The MIME content type to check.
      * @returns {Boolean} <code>true</code> if <code>contentType</code> represents JSON, otherwise <code>false</code>.
      */

    }, {
      key: "isJsonMime",
      value: function isJsonMime(contentType) {
        return Boolean(contentType != null && contentType.match(/^application\/json(;.*)?$/i));
      }
      /**
      * Chooses a content type from the given array, with JSON preferred; i.e. return JSON if included, otherwise return the first.
      * @param {Array.<String>} contentTypes
      * @returns {String} The chosen content type, preferring JSON.
      */

    }, {
      key: "jsonPreferredMime",
      value: function jsonPreferredMime(contentTypes) {
        for (var i = 0; i < contentTypes.length; i++) {
          if (this.isJsonMime(contentTypes[i])) {
            return contentTypes[i];
          }
        }

        return contentTypes[0];
      }
      /**
      * Checks whether the given parameter value represents file-like content.
      * @param param The parameter to check.
      * @returns {Boolean} <code>true</code> if <code>param</code> represents a file.
      */

    }, {
      key: "isFileParam",
      value: function isFileParam(param) {
        // fs.ReadStream in Node.js and Electron (but not in runtime like browserify)
        if (typeof commonjsRequire === 'function') {
          var fs;

          try {
            fs = require$$2;
          } catch (err) {}

          if (fs && fs.ReadStream && param instanceof fs.ReadStream) {
            return true;
          }
        } // Buffer in Node.js


        if (typeof Buffer === 'function' && param instanceof Buffer) {
          return true;
        } // Blob in browser


        if (typeof Blob === 'function' && param instanceof Blob) {
          return true;
        } // File in browser (it seems File object is also instance of Blob, but keep this for safe)


        if (typeof File === 'function' && param instanceof File) {
          return true;
        }

        return false;
      }
      /**
      * Normalizes parameter values:
      * <ul>
      * <li>remove nils</li>
      * <li>keep files and arrays</li>
      * <li>format to string with `paramToString` for other cases</li>
      * </ul>
      * @param {Object.<String, Object>} params The parameters as object properties.
      * @returns {Object.<String, Object>} normalized parameters.
      */

    }, {
      key: "normalizeParams",
      value: function normalizeParams(params) {
        var newParams = {};

        for (var key in params) {
          if (params.hasOwnProperty(key) && params[key] != undefined && params[key] != null) {
            var value = params[key];

            if (this.isFileParam(value) || Array.isArray(value)) {
              newParams[key] = value;
            } else {
              newParams[key] = this.paramToString(value);
            }
          }
        }

        return newParams;
      }
      /**
      * Builds a string representation of an array-type actual parameter, according to the given collection format.
      * @param {Array} param An array parameter.
      * @param {module:ApiClient.CollectionFormatEnum} collectionFormat The array element separator strategy.
      * @returns {String|Array} A string representation of the supplied collection, using the specified delimiter. Returns
      * <code>param</code> as is if <code>collectionFormat</code> is <code>multi</code>.
      */

    }, {
      key: "buildCollectionParam",
      value: function buildCollectionParam(param, collectionFormat) {
        if (param == null) {
          return null;
        }

        switch (collectionFormat) {
          case 'csv':
            return param.map(this.paramToString).join(',');

          case 'ssv':
            return param.map(this.paramToString).join(' ');

          case 'tsv':
            return param.map(this.paramToString).join('\t');

          case 'pipes':
            return param.map(this.paramToString).join('|');

          case 'multi':
            //return the array directly as SuperAgent will handle it as expected
            return param.map(this.paramToString);

          default:
            throw new Error('Unknown collection format: ' + collectionFormat);
        }
      }
      /**
      * Applies authentication headers to the request.
      * @param {Object} request The request object created by a <code>superagent()</code> call.
      * @param {Array.<String>} authNames An array of authentication method names.
      */

    }, {
      key: "applyAuthToRequest",
      value: function applyAuthToRequest(request, authNames) {
        var _this2 = this;

        authNames.forEach(function (authName) {
          var auth = _this2.authentications[authName];

          switch (auth.type) {
            case 'basic':
              if (auth.username || auth.password) {
                request.auth(auth.username || '', auth.password || '');
              }

              break;

            case 'bearer':
              if (auth.accessToken) {
                request.set({
                  'Authorization': 'Bearer ' + auth.accessToken
                });
              }

              break;

            case 'apiKey':
              if (auth.apiKey) {
                var data = {};

                if (auth.apiKeyPrefix) {
                  data[auth.name] = auth.apiKeyPrefix + ' ' + auth.apiKey;
                } else {
                  data[auth.name] = auth.apiKey;
                }

                if (auth['in'] === 'header') {
                  request.set(data);
                } else {
                  request.query(data);
                }
              }

              break;

            case 'oauth2':
              if (auth.accessToken) {
                request.set({
                  'Authorization': 'Bearer ' + auth.accessToken
                });
              }

              break;

            default:
              throw new Error('Unknown authentication type: ' + auth.type);
          }
        });
      }
      /**
       * Deserializes an HTTP response body into a value of the specified type.
       * @param {Object} response A SuperAgent response object.
       * @param {(String|Array.<String>|Object.<String, Object>|Function)} returnType The type to return. Pass a string for simple types
       * or the constructor function for a complex type. Pass an array containing the type name to return an array of that type. To
       * return an object, pass an object with one property whose name is the key type and whose value is the corresponding value type:
       * all properties on <code>data<code> will be converted to this type.
       * @returns A value of the specified type.
       */

    }, {
      key: "deserialize",
      value: function deserialize(response, returnType) {
        if (response == null || returnType == null || response.status == 204) {
          return null;
        } // Rely on SuperAgent for parsing response body.
        // See http://visionmedia.github.io/superagent/#parsing-response-bodies


        var data = response.body;

        if (data == null || _typeof(data) === 'object' && typeof data.length === 'undefined' && !Object.keys(data).length) {
          // SuperAgent does not always produce a body; use the unparsed response as a fallback
          data = response.text;
        }

        return ApiClient.convertToType(data, returnType);
      }
      /**
       * Callback function to receive the result of the operation.
       * @callback module:ApiClient~callApiCallback
       * @param {String} error Error message, if any.
       * @param data The data returned by the service call.
       * @param {String} response The complete HTTP response.
       */

      /**
       * Invokes the REST service using the supplied settings and parameters.
       * @param {String} path The base URL to invoke.
       * @param {String} httpMethod The HTTP method to use.
       * @param {Object.<String, String>} pathParams A map of path parameters and their values.
       * @param {Object.<String, Object>} queryParams A map of query parameters and their values.
       * @param {Object.<String, Object>} headerParams A map of header parameters and their values.
       * @param {Object.<String, Object>} formParams A map of form parameters and their values.
       * @param {Object} bodyParam The value to pass as the request body.
       * @param {Array.<String>} authNames An array of authentication type names.
       * @param {Array.<String>} contentTypes An array of request MIME types.
       * @param {Array.<String>} accepts An array of acceptable response MIME types.
       * @param {(String|Array|ObjectFunction)} returnType The required type to return; can be a string for simple types or the
       * constructor for a complex type.
       * @param {String} apiBasePath base path defined in the operation/path level to override the default one
       * @param {module:ApiClient~callApiCallback} callback The callback function.
       * @returns {Object} The SuperAgent request object.
       */

    }, {
      key: "callApi",
      value: function callApi(path, httpMethod, pathParams, queryParams, headerParams, formParams, bodyParam, authNames, contentTypes, accepts, returnType, apiBasePath, callback) {
        var _this3 = this;

        var url = this.buildUrl(path, pathParams, apiBasePath);
        var request = (0, _superagent["default"])(httpMethod, url);

        if (this.plugins !== null) {
          for (var index in this.plugins) {
            if (this.plugins.hasOwnProperty(index)) {
              request.use(this.plugins[index]);
            }
          }
        } // apply authentications


        this.applyAuthToRequest(request, authNames); // set query parameters

        if (httpMethod.toUpperCase() === 'GET' && this.cache === false) {
          queryParams['_'] = new Date().getTime();
        }

        request.query(this.normalizeParams(queryParams)); // set header parameters

        request.set(this.defaultHeaders).set(this.normalizeParams(headerParams)); // set requestAgent if it is set by user

        if (this.requestAgent) {
          request.agent(this.requestAgent);
        } // set request timeout


        request.timeout(this.timeout);
        var contentType = this.jsonPreferredMime(contentTypes);

        if (contentType) {
          // Issue with superagent and multipart/form-data (https://github.com/visionmedia/superagent/issues/746)
          if (contentType != 'multipart/form-data') {
            request.type(contentType);
          }
        }

        if (contentType === 'application/x-www-form-urlencoded') {
          request.send(_querystring["default"].stringify(this.normalizeParams(formParams)));
        } else if (contentType == 'multipart/form-data') {
          var _formParams = this.normalizeParams(formParams);

          for (var key in _formParams) {
            if (_formParams.hasOwnProperty(key)) {
              if (this.isFileParam(_formParams[key])) {
                // file field
                request.attach(key, _formParams[key]);
              } else {
                request.field(key, _formParams[key]);
              }
            }
          }
        } else if (bodyParam !== null && bodyParam !== undefined) {
          if (!request.header['Content-Type']) {
            request.type('application/json');
          }

          request.send(bodyParam);
        }

        var accept = this.jsonPreferredMime(accepts);

        if (accept) {
          request.accept(accept);
        }

        if (returnType === 'Blob') {
          request.responseType('blob');
        } else if (returnType === 'String') {
          request.responseType('string');
        } // Attach previously saved cookies, if enabled


        if (this.enableCookies) {
          if (typeof window === 'undefined') {
            this.agent._attachCookies(request);
          } else {
            request.withCredentials();
          }
        }

        request.end(function (error, response) {
          if (callback) {
            var data = null;

            if (!error) {
              try {
                data = _this3.deserialize(response, returnType);

                if (_this3.enableCookies && typeof window === 'undefined') {
                  _this3.agent._saveCookies(response);
                }
              } catch (err) {
                error = err;
              }
            }

            callback(error, data, response);
          }
        });
        return request;
      }
      /**
      * Parses an ISO-8601 string representation of a date value.
      * @param {String} str The date value as a string.
      * @returns {Date} The parsed date object.
      */

    }, {
      key: "hostSettings",

      /**
        * Gets an array of host settings
        * @returns An array of host settings
        */
      value: function hostSettings() {
        return [{
          'url': "http://127.0.0.1:5000",
          'description': "No description provided"
        }];
      }
    }, {
      key: "getBasePathFromSettings",
      value: function getBasePathFromSettings(index) {
        var variables = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};
        var servers = this.hostSettings(); // check array index out of bound

        if (index < 0 || index >= servers.length) {
          throw new Error("Invalid index " + index + " when selecting the host settings. Must be less than " + servers.length);
        }

        var server = servers[index];
        var url = server['url']; // go through variable and assign a value

        for (var variable_name in server['variables']) {
          if (variable_name in variables) {
            var variable = server['variables'][variable_name];

            if (!('enum_values' in variable) || variable['enum_values'].includes(variables[variable_name])) {
              url = url.replace("{" + variable_name + "}", variables[variable_name]);
            } else {
              throw new Error("The variable `" + variable_name + "` in the host URL has invalid value " + variables[variable_name] + ". Must be " + server['variables'][variable_name]['enum_values'] + ".");
            }
          } else {
            // use default value
            url = url.replace("{" + variable_name + "}", server['variables'][variable_name]['default_value']);
          }
        }

        return url;
      }
      /**
      * Constructs a new map or array model from REST data.
      * @param data {Object|Array} The REST data.
      * @param obj {Object|Array} The target object or array.
      */

    }], [{
      key: "parseDate",
      value: function parseDate(str) {
        return new Date(str);
      }
      /**
      * Converts a value to the specified type.
      * @param {(String|Object)} data The data to convert, as a string or object.
      * @param {(String|Array.<String>|Object.<String, Object>|Function)} type The type to return. Pass a string for simple types
      * or the constructor function for a complex type. Pass an array containing the type name to return an array of that type. To
      * return an object, pass an object with one property whose name is the key type and whose value is the corresponding value type:
      * all properties on <code>data<code> will be converted to this type.
      * @returns An instance of the specified type or null or undefined if data is null or undefined.
      */

    }, {
      key: "convertToType",
      value: function convertToType(data, type) {
        if (data === null || data === undefined) return data;

        switch (type) {
          case 'Boolean':
            return Boolean(data);

          case 'Integer':
            return parseInt(data, 10);

          case 'Number':
            return parseFloat(data);

          case 'String':
            return String(data);

          case 'Date':
            return ApiClient.parseDate(String(data));

          case 'Blob':
            return data;

          default:
            if (type === Object) {
              // generic object, return directly
              return data;
            } else if (typeof type.constructFromObject === 'function') {
              // for model type like User and enum class
              return type.constructFromObject(data);
            } else if (Array.isArray(type)) {
              // for array type like: ['String']
              var itemType = type[0];
              return data.map(function (item) {
                return ApiClient.convertToType(item, itemType);
              });
            } else if (_typeof(type) === 'object') {
              // for plain object type like: {'String': 'Integer'}
              var keyType, valueType;

              for (var k in type) {
                if (type.hasOwnProperty(k)) {
                  keyType = k;
                  valueType = type[k];
                  break;
                }
              }

              var result = {};

              for (var k in data) {
                if (data.hasOwnProperty(k)) {
                  var key = ApiClient.convertToType(k, keyType);
                  var value = ApiClient.convertToType(data[k], valueType);
                  result[key] = value;
                }
              }

              return result;
            } else {
              // for unknown type, return the data directly
              return data;
            }

        }
      }
    }, {
      key: "constructFromObject",
      value: function constructFromObject(data, obj, itemType) {
        if (Array.isArray(data)) {
          for (var i = 0; i < data.length; i++) {
            if (data.hasOwnProperty(i)) obj[i] = ApiClient.convertToType(data[i], itemType);
          }
        } else {
          for (var k in data) {
            if (data.hasOwnProperty(k)) obj[k] = ApiClient.convertToType(data[k], itemType);
          }
        }
      }
    }]);

    return ApiClient;
  }();
  /**
   * Enumeration of collection format separator strategies.
   * @enum {String}
   * @readonly
   */


  ApiClient.CollectionFormatEnum = {
    /**
     * Comma-separated values. Value: <code>csv</code>
     * @const
     */
    CSV: ',',

    /**
     * Space-separated values. Value: <code>ssv</code>
     * @const
     */
    SSV: ' ',

    /**
     * Tab-separated values. Value: <code>tsv</code>
     * @const
     */
    TSV: '\t',

    /**
     * Pipe(|)-separated values. Value: <code>pipes</code>
     * @const
     */
    PIPES: '|',

    /**
     * Native array. Value: <code>multi</code>
     * @const
     */
    MULTI: 'multi'
  };
  /**
  * The default API client implementation.
  * @type {module:ApiClient}
  */

  ApiClient.instance = new ApiClient();
  var _default = ApiClient;
  exports["default"] = _default;
});
unwrapExports(ApiClient_1);

var _Error = createCommonjsModule(function (module, exports) {

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  exports["default"] = void 0;

  var _ApiClient = _interopRequireDefault(ApiClient_1);

  function _interopRequireDefault(obj) {
    return obj && obj.__esModule ? obj : {
      "default": obj
    };
  }

  function _classCallCheck(instance, Constructor) {
    if (!(instance instanceof Constructor)) {
      throw new TypeError("Cannot call a class as a function");
    }
  }

  function _defineProperties(target, props) {
    for (var i = 0; i < props.length; i++) {
      var descriptor = props[i];
      descriptor.enumerable = descriptor.enumerable || false;
      descriptor.configurable = true;
      if ("value" in descriptor) descriptor.writable = true;
      Object.defineProperty(target, descriptor.key, descriptor);
    }
  }

  function _createClass(Constructor, protoProps, staticProps) {
    if (protoProps) _defineProperties(Constructor.prototype, protoProps);
    if (staticProps) _defineProperties(Constructor, staticProps);
    return Constructor;
  }
  /**
   * The Error model module.
   * @module model/Error
   * @version 1.0.0
   */


  var Error = /*#__PURE__*/function () {
    /**
     * Constructs a new <code>Error</code>.
     * @alias module:model/Error
     * @param code {Number} 
     * @param message {String} 
     */
    function Error(code, message) {
      _classCallCheck(this, Error);

      Error.initialize(this, code, message);
    }
    /**
     * Initializes the fields of this object.
     * This method is used by the constructors of any subclasses, in order to implement multiple inheritance (mix-ins).
     * Only for internal use.
     */


    _createClass(Error, null, [{
      key: "initialize",
      value: function initialize(obj, code, message) {
        obj['code'] = code;
        obj['message'] = message;
      }
      /**
       * Constructs a <code>Error</code> from a plain JavaScript object, optionally creating a new instance.
       * Copies all relevant properties from <code>data</code> to <code>obj</code> if supplied or a new instance if not.
       * @param {Object} data The plain JavaScript object bearing properties of interest.
       * @param {module:model/Error} obj Optional instance to populate.
       * @return {module:model/Error} The populated <code>Error</code> instance.
       */

    }, {
      key: "constructFromObject",
      value: function constructFromObject(data, obj) {
        if (data) {
          obj = obj || new Error();

          if (data.hasOwnProperty('code')) {
            obj['code'] = _ApiClient["default"].convertToType(data['code'], 'Number');
          }

          if (data.hasOwnProperty('message')) {
            obj['message'] = _ApiClient["default"].convertToType(data['message'], 'String');
          }
        }

        return obj;
      }
    }]);

    return Error;
  }();
  /**
   * @member {Number} code
   */


  Error.prototype['code'] = undefined;
  /**
   * @member {String} message
   */

  Error.prototype['message'] = undefined;
  var _default = Error;
  exports["default"] = _default;
});

unwrapExports(_Error);

var PresignedUrl_1 = createCommonjsModule(function (module, exports) {

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  exports["default"] = void 0;

  var _ApiClient = _interopRequireDefault(ApiClient_1);

  function _interopRequireDefault(obj) {
    return obj && obj.__esModule ? obj : {
      "default": obj
    };
  }

  function _classCallCheck(instance, Constructor) {
    if (!(instance instanceof Constructor)) {
      throw new TypeError("Cannot call a class as a function");
    }
  }

  function _defineProperties(target, props) {
    for (var i = 0; i < props.length; i++) {
      var descriptor = props[i];
      descriptor.enumerable = descriptor.enumerable || false;
      descriptor.configurable = true;
      if ("value" in descriptor) descriptor.writable = true;
      Object.defineProperty(target, descriptor.key, descriptor);
    }
  }

  function _createClass(Constructor, protoProps, staticProps) {
    if (protoProps) _defineProperties(Constructor.prototype, protoProps);
    if (staticProps) _defineProperties(Constructor, staticProps);
    return Constructor;
  }
  /**
   * The PresignedUrl model module.
   * @module model/PresignedUrl
   * @version 1.0.0
   */


  var PresignedUrl = /*#__PURE__*/function () {
    /**
     * Constructs a new <code>PresignedUrl</code>.
     * @alias module:model/PresignedUrl
     * @param presignedUrl {String} 
     */
    function PresignedUrl(presignedUrl) {
      _classCallCheck(this, PresignedUrl);

      PresignedUrl.initialize(this, presignedUrl);
    }
    /**
     * Initializes the fields of this object.
     * This method is used by the constructors of any subclasses, in order to implement multiple inheritance (mix-ins).
     * Only for internal use.
     */


    _createClass(PresignedUrl, null, [{
      key: "initialize",
      value: function initialize(obj, presignedUrl) {
        obj['presigned_url'] = presignedUrl;
      }
      /**
       * Constructs a <code>PresignedUrl</code> from a plain JavaScript object, optionally creating a new instance.
       * Copies all relevant properties from <code>data</code> to <code>obj</code> if supplied or a new instance if not.
       * @param {Object} data The plain JavaScript object bearing properties of interest.
       * @param {module:model/PresignedUrl} obj Optional instance to populate.
       * @return {module:model/PresignedUrl} The populated <code>PresignedUrl</code> instance.
       */

    }, {
      key: "constructFromObject",
      value: function constructFromObject(data, obj) {
        if (data) {
          obj = obj || new PresignedUrl();

          if (data.hasOwnProperty('presigned_url')) {
            obj['presigned_url'] = _ApiClient["default"].convertToType(data['presigned_url'], 'String');
          }
        }

        return obj;
      }
    }]);

    return PresignedUrl;
  }();
  /**
   * @member {String} presigned_url
   */


  PresignedUrl.prototype['presigned_url'] = undefined;
  var _default = PresignedUrl;
  exports["default"] = _default;
});
unwrapExports(PresignedUrl_1);

var User_1 = createCommonjsModule(function (module, exports) {

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  exports["default"] = void 0;

  var _ApiClient = _interopRequireDefault(ApiClient_1);

  function _interopRequireDefault(obj) {
    return obj && obj.__esModule ? obj : {
      "default": obj
    };
  }

  function _classCallCheck(instance, Constructor) {
    if (!(instance instanceof Constructor)) {
      throw new TypeError("Cannot call a class as a function");
    }
  }

  function _defineProperties(target, props) {
    for (var i = 0; i < props.length; i++) {
      var descriptor = props[i];
      descriptor.enumerable = descriptor.enumerable || false;
      descriptor.configurable = true;
      if ("value" in descriptor) descriptor.writable = true;
      Object.defineProperty(target, descriptor.key, descriptor);
    }
  }

  function _createClass(Constructor, protoProps, staticProps) {
    if (protoProps) _defineProperties(Constructor.prototype, protoProps);
    if (staticProps) _defineProperties(Constructor, staticProps);
    return Constructor;
  }
  /**
   * The User model module.
   * @module model/User
   * @version 1.0.0
   */


  var User = /*#__PURE__*/function () {
    /**
     * Constructs a new <code>User</code>.
     * @alias module:model/User
     * @param id {Number} 
     */
    function User(id) {
      _classCallCheck(this, User);

      User.initialize(this, id);
    }
    /**
     * Initializes the fields of this object.
     * This method is used by the constructors of any subclasses, in order to implement multiple inheritance (mix-ins).
     * Only for internal use.
     */


    _createClass(User, null, [{
      key: "initialize",
      value: function initialize(obj, id) {
        obj['id'] = id;
      }
      /**
       * Constructs a <code>User</code> from a plain JavaScript object, optionally creating a new instance.
       * Copies all relevant properties from <code>data</code> to <code>obj</code> if supplied or a new instance if not.
       * @param {Object} data The plain JavaScript object bearing properties of interest.
       * @param {module:model/User} obj Optional instance to populate.
       * @return {module:model/User} The populated <code>User</code> instance.
       */

    }, {
      key: "constructFromObject",
      value: function constructFromObject(data, obj) {
        if (data) {
          obj = obj || new User();

          if (data.hasOwnProperty('id')) {
            obj['id'] = _ApiClient["default"].convertToType(data['id'], 'Number');
          }
        }

        return obj;
      }
    }]);

    return User;
  }();
  /**
   * @member {Number} id
   */


  User.prototype['id'] = undefined;
  var _default = User;
  exports["default"] = _default;
});
unwrapExports(User_1);

var ImagesApi_1 = createCommonjsModule(function (module, exports) {

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  exports["default"] = void 0;

  var _ApiClient = _interopRequireDefault(ApiClient_1);

  var _Error$1 = _interopRequireDefault(_Error);

  var _PresignedUrl = _interopRequireDefault(PresignedUrl_1);

  function _interopRequireDefault(obj) {
    return obj && obj.__esModule ? obj : {
      "default": obj
    };
  }

  function _classCallCheck(instance, Constructor) {
    if (!(instance instanceof Constructor)) {
      throw new TypeError("Cannot call a class as a function");
    }
  }

  function _defineProperties(target, props) {
    for (var i = 0; i < props.length; i++) {
      var descriptor = props[i];
      descriptor.enumerable = descriptor.enumerable || false;
      descriptor.configurable = true;
      if ("value" in descriptor) descriptor.writable = true;
      Object.defineProperty(target, descriptor.key, descriptor);
    }
  }

  function _createClass(Constructor, protoProps, staticProps) {
    if (protoProps) _defineProperties(Constructor.prototype, protoProps);
    if (staticProps) _defineProperties(Constructor, staticProps);
    return Constructor;
  }
  /**
  * Images service.
  * @module api/ImagesApi
  * @version 1.0.0
  */


  var ImagesApi = /*#__PURE__*/function () {
    /**
    * Constructs a new ImagesApi. 
    * @alias module:api/ImagesApi
    * @class
    * @param {module:ApiClient} [apiClient] Optional API client implementation to use,
    * default to {@link module:ApiClient#instance} if unspecified.
    */
    function ImagesApi(apiClient) {
      _classCallCheck(this, ImagesApi);

      this.apiClient = apiClient || _ApiClient["default"].instance;
    }
    /**
     * Callback function to receive the result of the appGetUploadUrl operation.
     * @callback module:api/ImagesApi~appGetUploadUrlCallback
     * @param {String} error Error message, if any.
     * @param {module:model/PresignedUrl} data The data returned by the service call.
     * @param {String} response The complete HTTP response.
     */

    /**
     * returns a presigned url for user to upload image
     * @param {String} filename name of uploaded image
     * @param {String} contentType file MIME type
     * @param {module:api/ImagesApi~appGetUploadUrlCallback} callback The callback function, accepting three arguments: error, data, response
     * data is of type: {@link module:model/PresignedUrl}
     */


    _createClass(ImagesApi, [{
      key: "appGetUploadUrl",
      value: function appGetUploadUrl(filename, contentType, callback) {
        var postBody = null; // verify the required parameter 'filename' is set

        if (filename === undefined || filename === null) {
          throw new _Error$1["default"]("Missing the required parameter 'filename' when calling appGetUploadUrl");
        } // verify the required parameter 'contentType' is set


        if (contentType === undefined || contentType === null) {
          throw new _Error$1["default"]("Missing the required parameter 'contentType' when calling appGetUploadUrl");
        }

        var pathParams = {};
        var queryParams = {
          'filename': filename,
          'content-type': contentType
        };
        var headerParams = {};
        var formParams = {};
        var authNames = [];
        var contentTypes = [];
        var accepts = ['application/json'];
        var returnType = _PresignedUrl["default"];
        return this.apiClient.callApi('/images/upload_url', 'GET', pathParams, queryParams, headerParams, formParams, postBody, authNames, contentTypes, accepts, returnType, null, callback);
      }
    }]);

    return ImagesApi;
  }();

  exports["default"] = ImagesApi;
});
unwrapExports(ImagesApi_1);

var UsersApi_1 = createCommonjsModule(function (module, exports) {

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  exports["default"] = void 0;

  var _ApiClient = _interopRequireDefault(ApiClient_1);

  var _Error$1 = _interopRequireDefault(_Error);

  var _User = _interopRequireDefault(User_1);

  function _interopRequireDefault(obj) {
    return obj && obj.__esModule ? obj : {
      "default": obj
    };
  }

  function _classCallCheck(instance, Constructor) {
    if (!(instance instanceof Constructor)) {
      throw new TypeError("Cannot call a class as a function");
    }
  }

  function _defineProperties(target, props) {
    for (var i = 0; i < props.length; i++) {
      var descriptor = props[i];
      descriptor.enumerable = descriptor.enumerable || false;
      descriptor.configurable = true;
      if ("value" in descriptor) descriptor.writable = true;
      Object.defineProperty(target, descriptor.key, descriptor);
    }
  }

  function _createClass(Constructor, protoProps, staticProps) {
    if (protoProps) _defineProperties(Constructor.prototype, protoProps);
    if (staticProps) _defineProperties(Constructor, staticProps);
    return Constructor;
  }
  /**
  * Users service.
  * @module api/UsersApi
  * @version 1.0.0
  */


  var UsersApi = /*#__PURE__*/function () {
    /**
    * Constructs a new UsersApi. 
    * @alias module:api/UsersApi
    * @class
    * @param {module:ApiClient} [apiClient] Optional API client implementation to use,
    * default to {@link module:ApiClient#instance} if unspecified.
    */
    function UsersApi(apiClient) {
      _classCallCheck(this, UsersApi);

      this.apiClient = apiClient || _ApiClient["default"].instance;
    }
    /**
     * Callback function to receive the result of the appGetProfile operation.
     * @callback module:api/UsersApi~appGetProfileCallback
     * @param {String} error Error message, if any.
     * @param {module:model/User} data The data returned by the service call.
     * @param {String} response The complete HTTP response.
     */

    /**
     * Gets profile of current user
     * @param {module:api/UsersApi~appGetProfileCallback} callback The callback function, accepting three arguments: error, data, response
     * data is of type: {@link module:model/User}
     */


    _createClass(UsersApi, [{
      key: "appGetProfile",
      value: function appGetProfile(callback) {
        var postBody = null;
        var pathParams = {};
        var queryParams = {};
        var headerParams = {};
        var formParams = {};
        var authNames = [];
        var contentTypes = [];
        var accepts = ['application/json'];
        var returnType = _User["default"];
        return this.apiClient.callApi('/users/me', 'GET', pathParams, queryParams, headerParams, formParams, postBody, authNames, contentTypes, accepts, returnType, null, callback);
      }
    }]);

    return UsersApi;
  }();

  exports["default"] = UsersApi;
});
unwrapExports(UsersApi_1);

var dist = createCommonjsModule(function (module, exports) {

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  Object.defineProperty(exports, "ApiClient", {
    enumerable: true,
    get: function get() {
      return _ApiClient["default"];
    }
  });
  Object.defineProperty(exports, "Error", {
    enumerable: true,
    get: function get() {
      return _Error$1["default"];
    }
  });
  Object.defineProperty(exports, "PresignedUrl", {
    enumerable: true,
    get: function get() {
      return _PresignedUrl["default"];
    }
  });
  Object.defineProperty(exports, "User", {
    enumerable: true,
    get: function get() {
      return _User["default"];
    }
  });
  Object.defineProperty(exports, "ImagesApi", {
    enumerable: true,
    get: function get() {
      return _ImagesApi["default"];
    }
  });
  Object.defineProperty(exports, "UsersApi", {
    enumerable: true,
    get: function get() {
      return _UsersApi["default"];
    }
  });

  var _ApiClient = _interopRequireDefault(ApiClient_1);

  var _Error$1 = _interopRequireDefault(_Error);

  var _PresignedUrl = _interopRequireDefault(PresignedUrl_1);

  var _User = _interopRequireDefault(User_1);

  var _ImagesApi = _interopRequireDefault(ImagesApi_1);

  var _UsersApi = _interopRequireDefault(UsersApi_1);

  function _interopRequireDefault(obj) {
    return obj && obj.__esModule ? obj : {
      "default": obj
    };
  }
});
var ThumbnailServiceApi = unwrapExports(dist);

var client$1 = new ThumbnailServiceApi.ImagesApi();

window.onload = function (event) {
  var uploadButton = document.getElementById('#upload_button');

  if (uploadButton) {
    uploadButton.addEventListener('click', function (e) {
      var uploadInput = document.getElementById('#upload_input');

      var _iterator = _createForOfIteratorHelper(uploadInput.files),
          _step;

      try {
        var _loop = function _loop() {
          var file = _step.value;
          client$1.appGetUploadUrl(file.name, file.type, function (err, imageUrl, response) {
            var request = new Request(imageUrl.presigned_url, {
              method: 'PUT',
              mode: 'cors',
              body: file,
              contentType: file.type
            });
            fetch(request).then(function (response) {
              console.log(response);
            });
          });
        };

        for (_iterator.s(); !(_step = _iterator.n()).done;) {
          _loop();
        }
      } catch (err) {
        _iterator.e(err);
      } finally {
        _iterator.f();
      }
    });
  }
};
//# sourceMappingURL=index.js.map
