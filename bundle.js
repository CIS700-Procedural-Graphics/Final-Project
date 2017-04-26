/******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};
/******/
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/
/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId])
/******/ 			return installedModules[moduleId].exports;
/******/
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			i: moduleId,
/******/ 			l: false,
/******/ 			exports: {}
/******/ 		};
/******/
/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/
/******/ 		// Flag the module as loaded
/******/ 		module.l = true;
/******/
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/
/******/
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;
/******/
/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;
/******/
/******/ 	// identity function for calling harmony imports with the correct context
/******/ 	__webpack_require__.i = function(value) { return value; };
/******/
/******/ 	// define getter function for harmony exports
/******/ 	__webpack_require__.d = function(exports, name, getter) {
/******/ 		if(!__webpack_require__.o(exports, name)) {
/******/ 			Object.defineProperty(exports, name, {
/******/ 				configurable: false,
/******/ 				enumerable: true,
/******/ 				get: getter
/******/ 			});
/******/ 		}
/******/ 	};
/******/
/******/ 	// getDefaultExport function for compatibility with non-harmony modules
/******/ 	__webpack_require__.n = function(module) {
/******/ 		var getter = module && module.__esModule ?
/******/ 			function getDefault() { return module['default']; } :
/******/ 			function getModuleExports() { return module; };
/******/ 		__webpack_require__.d(getter, 'a', getter);
/******/ 		return getter;
/******/ 	};
/******/
/******/ 	// Object.prototype.hasOwnProperty.call
/******/ 	__webpack_require__.o = function(object, property) { return Object.prototype.hasOwnProperty.call(object, property); };
/******/
/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";
/******/
/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(__webpack_require__.s = 23);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
// a duplex stream is just a stream that is both readable and writable.
// Since JS doesn't have multiple prototypal inheritance, this class
// prototypally inherits from Readable, and then parasitically from
// Writable.



/*<replacement>*/

var objectKeys = Object.keys || function (obj) {
  var keys = [];
  for (var key in obj) {
    keys.push(key);
  }return keys;
};
/*</replacement>*/

module.exports = Duplex;

/*<replacement>*/
var processNextTick = __webpack_require__(9);
/*</replacement>*/

/*<replacement>*/
var util = __webpack_require__(4);
util.inherits = __webpack_require__(2);
/*</replacement>*/

var Readable = __webpack_require__(14);
var Writable = __webpack_require__(10);

util.inherits(Duplex, Readable);

var keys = objectKeys(Writable.prototype);
for (var v = 0; v < keys.length; v++) {
  var method = keys[v];
  if (!Duplex.prototype[method]) Duplex.prototype[method] = Writable.prototype[method];
}

function Duplex(options) {
  if (!(this instanceof Duplex)) return new Duplex(options);

  Readable.call(this, options);
  Writable.call(this, options);

  if (options && options.readable === false) this.readable = false;

  if (options && options.writable === false) this.writable = false;

  this.allowHalfOpen = true;
  if (options && options.allowHalfOpen === false) this.allowHalfOpen = false;

  this.once('end', onend);
}

// the no-half-open enforcer
function onend() {
  // if we allow half-open state, or if the writable side ended,
  // then we're ok.
  if (this.allowHalfOpen || this._writableState.ended) return;

  // no more data can be written.
  // But allow more writes to happen in this tick.
  processNextTick(onEndNT, this);
}

function onEndNT(self) {
  self.end();
}

function forEach(xs, f) {
  for (var i = 0, l = xs.length; i < l; i++) {
    f(xs[i], i);
  }
}

/***/ }),
/* 1 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
/* WEBPACK VAR INJECTION */(function(global) {/*!
 * The buffer module from node.js, for the browser.
 *
 * @author   Feross Aboukhadijeh <feross@feross.org> <http://feross.org>
 * @license  MIT
 */
/* eslint-disable no-proto */



var base64 = __webpack_require__(25)
var ieee754 = __webpack_require__(31)
var isArray = __webpack_require__(13)

exports.Buffer = Buffer
exports.SlowBuffer = SlowBuffer
exports.INSPECT_MAX_BYTES = 50

/**
 * If `Buffer.TYPED_ARRAY_SUPPORT`:
 *   === true    Use Uint8Array implementation (fastest)
 *   === false   Use Object implementation (most compatible, even IE6)
 *
 * Browsers that support typed arrays are IE 10+, Firefox 4+, Chrome 7+, Safari 5.1+,
 * Opera 11.6+, iOS 4.2+.
 *
 * Due to various browser bugs, sometimes the Object implementation will be used even
 * when the browser supports typed arrays.
 *
 * Note:
 *
 *   - Firefox 4-29 lacks support for adding new properties to `Uint8Array` instances,
 *     See: https://bugzilla.mozilla.org/show_bug.cgi?id=695438.
 *
 *   - Chrome 9-10 is missing the `TypedArray.prototype.subarray` function.
 *
 *   - IE10 has a broken `TypedArray.prototype.subarray` function which returns arrays of
 *     incorrect length in some situations.

 * We detect these buggy browsers and set `Buffer.TYPED_ARRAY_SUPPORT` to `false` so they
 * get the Object implementation, which is slower but behaves correctly.
 */
Buffer.TYPED_ARRAY_SUPPORT = global.TYPED_ARRAY_SUPPORT !== undefined
  ? global.TYPED_ARRAY_SUPPORT
  : typedArraySupport()

/*
 * Export kMaxLength after typed array support is determined.
 */
exports.kMaxLength = kMaxLength()

function typedArraySupport () {
  try {
    var arr = new Uint8Array(1)
    arr.__proto__ = {__proto__: Uint8Array.prototype, foo: function () { return 42 }}
    return arr.foo() === 42 && // typed array instances can be augmented
        typeof arr.subarray === 'function' && // chrome 9-10 lack `subarray`
        arr.subarray(1, 1).byteLength === 0 // ie10 has broken `subarray`
  } catch (e) {
    return false
  }
}

function kMaxLength () {
  return Buffer.TYPED_ARRAY_SUPPORT
    ? 0x7fffffff
    : 0x3fffffff
}

function createBuffer (that, length) {
  if (kMaxLength() < length) {
    throw new RangeError('Invalid typed array length')
  }
  if (Buffer.TYPED_ARRAY_SUPPORT) {
    // Return an augmented `Uint8Array` instance, for best performance
    that = new Uint8Array(length)
    that.__proto__ = Buffer.prototype
  } else {
    // Fallback: Return an object instance of the Buffer class
    if (that === null) {
      that = new Buffer(length)
    }
    that.length = length
  }

  return that
}

/**
 * The Buffer constructor returns instances of `Uint8Array` that have their
 * prototype changed to `Buffer.prototype`. Furthermore, `Buffer` is a subclass of
 * `Uint8Array`, so the returned instances will have all the node `Buffer` methods
 * and the `Uint8Array` methods. Square bracket notation works as expected -- it
 * returns a single octet.
 *
 * The `Uint8Array` prototype remains unmodified.
 */

function Buffer (arg, encodingOrOffset, length) {
  if (!Buffer.TYPED_ARRAY_SUPPORT && !(this instanceof Buffer)) {
    return new Buffer(arg, encodingOrOffset, length)
  }

  // Common case.
  if (typeof arg === 'number') {
    if (typeof encodingOrOffset === 'string') {
      throw new Error(
        'If encoding is specified then the first argument must be a string'
      )
    }
    return allocUnsafe(this, arg)
  }
  return from(this, arg, encodingOrOffset, length)
}

Buffer.poolSize = 8192 // not used by this implementation

// TODO: Legacy, not needed anymore. Remove in next major version.
Buffer._augment = function (arr) {
  arr.__proto__ = Buffer.prototype
  return arr
}

function from (that, value, encodingOrOffset, length) {
  if (typeof value === 'number') {
    throw new TypeError('"value" argument must not be a number')
  }

  if (typeof ArrayBuffer !== 'undefined' && value instanceof ArrayBuffer) {
    return fromArrayBuffer(that, value, encodingOrOffset, length)
  }

  if (typeof value === 'string') {
    return fromString(that, value, encodingOrOffset)
  }

  return fromObject(that, value)
}

/**
 * Functionally equivalent to Buffer(arg, encoding) but throws a TypeError
 * if value is a number.
 * Buffer.from(str[, encoding])
 * Buffer.from(array)
 * Buffer.from(buffer)
 * Buffer.from(arrayBuffer[, byteOffset[, length]])
 **/
Buffer.from = function (value, encodingOrOffset, length) {
  return from(null, value, encodingOrOffset, length)
}

if (Buffer.TYPED_ARRAY_SUPPORT) {
  Buffer.prototype.__proto__ = Uint8Array.prototype
  Buffer.__proto__ = Uint8Array
  if (typeof Symbol !== 'undefined' && Symbol.species &&
      Buffer[Symbol.species] === Buffer) {
    // Fix subarray() in ES2016. See: https://github.com/feross/buffer/pull/97
    Object.defineProperty(Buffer, Symbol.species, {
      value: null,
      configurable: true
    })
  }
}

function assertSize (size) {
  if (typeof size !== 'number') {
    throw new TypeError('"size" argument must be a number')
  } else if (size < 0) {
    throw new RangeError('"size" argument must not be negative')
  }
}

function alloc (that, size, fill, encoding) {
  assertSize(size)
  if (size <= 0) {
    return createBuffer(that, size)
  }
  if (fill !== undefined) {
    // Only pay attention to encoding if it's a string. This
    // prevents accidentally sending in a number that would
    // be interpretted as a start offset.
    return typeof encoding === 'string'
      ? createBuffer(that, size).fill(fill, encoding)
      : createBuffer(that, size).fill(fill)
  }
  return createBuffer(that, size)
}

/**
 * Creates a new filled Buffer instance.
 * alloc(size[, fill[, encoding]])
 **/
Buffer.alloc = function (size, fill, encoding) {
  return alloc(null, size, fill, encoding)
}

function allocUnsafe (that, size) {
  assertSize(size)
  that = createBuffer(that, size < 0 ? 0 : checked(size) | 0)
  if (!Buffer.TYPED_ARRAY_SUPPORT) {
    for (var i = 0; i < size; ++i) {
      that[i] = 0
    }
  }
  return that
}

/**
 * Equivalent to Buffer(num), by default creates a non-zero-filled Buffer instance.
 * */
Buffer.allocUnsafe = function (size) {
  return allocUnsafe(null, size)
}
/**
 * Equivalent to SlowBuffer(num), by default creates a non-zero-filled Buffer instance.
 */
Buffer.allocUnsafeSlow = function (size) {
  return allocUnsafe(null, size)
}

function fromString (that, string, encoding) {
  if (typeof encoding !== 'string' || encoding === '') {
    encoding = 'utf8'
  }

  if (!Buffer.isEncoding(encoding)) {
    throw new TypeError('"encoding" must be a valid string encoding')
  }

  var length = byteLength(string, encoding) | 0
  that = createBuffer(that, length)

  var actual = that.write(string, encoding)

  if (actual !== length) {
    // Writing a hex string, for example, that contains invalid characters will
    // cause everything after the first invalid character to be ignored. (e.g.
    // 'abxxcd' will be treated as 'ab')
    that = that.slice(0, actual)
  }

  return that
}

function fromArrayLike (that, array) {
  var length = array.length < 0 ? 0 : checked(array.length) | 0
  that = createBuffer(that, length)
  for (var i = 0; i < length; i += 1) {
    that[i] = array[i] & 255
  }
  return that
}

function fromArrayBuffer (that, array, byteOffset, length) {
  array.byteLength // this throws if `array` is not a valid ArrayBuffer

  if (byteOffset < 0 || array.byteLength < byteOffset) {
    throw new RangeError('\'offset\' is out of bounds')
  }

  if (array.byteLength < byteOffset + (length || 0)) {
    throw new RangeError('\'length\' is out of bounds')
  }

  if (byteOffset === undefined && length === undefined) {
    array = new Uint8Array(array)
  } else if (length === undefined) {
    array = new Uint8Array(array, byteOffset)
  } else {
    array = new Uint8Array(array, byteOffset, length)
  }

  if (Buffer.TYPED_ARRAY_SUPPORT) {
    // Return an augmented `Uint8Array` instance, for best performance
    that = array
    that.__proto__ = Buffer.prototype
  } else {
    // Fallback: Return an object instance of the Buffer class
    that = fromArrayLike(that, array)
  }
  return that
}

function fromObject (that, obj) {
  if (Buffer.isBuffer(obj)) {
    var len = checked(obj.length) | 0
    that = createBuffer(that, len)

    if (that.length === 0) {
      return that
    }

    obj.copy(that, 0, 0, len)
    return that
  }

  if (obj) {
    if ((typeof ArrayBuffer !== 'undefined' &&
        obj.buffer instanceof ArrayBuffer) || 'length' in obj) {
      if (typeof obj.length !== 'number' || isnan(obj.length)) {
        return createBuffer(that, 0)
      }
      return fromArrayLike(that, obj)
    }

    if (obj.type === 'Buffer' && isArray(obj.data)) {
      return fromArrayLike(that, obj.data)
    }
  }

  throw new TypeError('First argument must be a string, Buffer, ArrayBuffer, Array, or array-like object.')
}

function checked (length) {
  // Note: cannot use `length < kMaxLength()` here because that fails when
  // length is NaN (which is otherwise coerced to zero.)
  if (length >= kMaxLength()) {
    throw new RangeError('Attempt to allocate Buffer larger than maximum ' +
                         'size: 0x' + kMaxLength().toString(16) + ' bytes')
  }
  return length | 0
}

function SlowBuffer (length) {
  if (+length != length) { // eslint-disable-line eqeqeq
    length = 0
  }
  return Buffer.alloc(+length)
}

Buffer.isBuffer = function isBuffer (b) {
  return !!(b != null && b._isBuffer)
}

Buffer.compare = function compare (a, b) {
  if (!Buffer.isBuffer(a) || !Buffer.isBuffer(b)) {
    throw new TypeError('Arguments must be Buffers')
  }

  if (a === b) return 0

  var x = a.length
  var y = b.length

  for (var i = 0, len = Math.min(x, y); i < len; ++i) {
    if (a[i] !== b[i]) {
      x = a[i]
      y = b[i]
      break
    }
  }

  if (x < y) return -1
  if (y < x) return 1
  return 0
}

Buffer.isEncoding = function isEncoding (encoding) {
  switch (String(encoding).toLowerCase()) {
    case 'hex':
    case 'utf8':
    case 'utf-8':
    case 'ascii':
    case 'latin1':
    case 'binary':
    case 'base64':
    case 'ucs2':
    case 'ucs-2':
    case 'utf16le':
    case 'utf-16le':
      return true
    default:
      return false
  }
}

Buffer.concat = function concat (list, length) {
  if (!isArray(list)) {
    throw new TypeError('"list" argument must be an Array of Buffers')
  }

  if (list.length === 0) {
    return Buffer.alloc(0)
  }

  var i
  if (length === undefined) {
    length = 0
    for (i = 0; i < list.length; ++i) {
      length += list[i].length
    }
  }

  var buffer = Buffer.allocUnsafe(length)
  var pos = 0
  for (i = 0; i < list.length; ++i) {
    var buf = list[i]
    if (!Buffer.isBuffer(buf)) {
      throw new TypeError('"list" argument must be an Array of Buffers')
    }
    buf.copy(buffer, pos)
    pos += buf.length
  }
  return buffer
}

function byteLength (string, encoding) {
  if (Buffer.isBuffer(string)) {
    return string.length
  }
  if (typeof ArrayBuffer !== 'undefined' && typeof ArrayBuffer.isView === 'function' &&
      (ArrayBuffer.isView(string) || string instanceof ArrayBuffer)) {
    return string.byteLength
  }
  if (typeof string !== 'string') {
    string = '' + string
  }

  var len = string.length
  if (len === 0) return 0

  // Use a for loop to avoid recursion
  var loweredCase = false
  for (;;) {
    switch (encoding) {
      case 'ascii':
      case 'latin1':
      case 'binary':
        return len
      case 'utf8':
      case 'utf-8':
      case undefined:
        return utf8ToBytes(string).length
      case 'ucs2':
      case 'ucs-2':
      case 'utf16le':
      case 'utf-16le':
        return len * 2
      case 'hex':
        return len >>> 1
      case 'base64':
        return base64ToBytes(string).length
      default:
        if (loweredCase) return utf8ToBytes(string).length // assume utf8
        encoding = ('' + encoding).toLowerCase()
        loweredCase = true
    }
  }
}
Buffer.byteLength = byteLength

function slowToString (encoding, start, end) {
  var loweredCase = false

  // No need to verify that "this.length <= MAX_UINT32" since it's a read-only
  // property of a typed array.

  // This behaves neither like String nor Uint8Array in that we set start/end
  // to their upper/lower bounds if the value passed is out of range.
  // undefined is handled specially as per ECMA-262 6th Edition,
  // Section 13.3.3.7 Runtime Semantics: KeyedBindingInitialization.
  if (start === undefined || start < 0) {
    start = 0
  }
  // Return early if start > this.length. Done here to prevent potential uint32
  // coercion fail below.
  if (start > this.length) {
    return ''
  }

  if (end === undefined || end > this.length) {
    end = this.length
  }

  if (end <= 0) {
    return ''
  }

  // Force coersion to uint32. This will also coerce falsey/NaN values to 0.
  end >>>= 0
  start >>>= 0

  if (end <= start) {
    return ''
  }

  if (!encoding) encoding = 'utf8'

  while (true) {
    switch (encoding) {
      case 'hex':
        return hexSlice(this, start, end)

      case 'utf8':
      case 'utf-8':
        return utf8Slice(this, start, end)

      case 'ascii':
        return asciiSlice(this, start, end)

      case 'latin1':
      case 'binary':
        return latin1Slice(this, start, end)

      case 'base64':
        return base64Slice(this, start, end)

      case 'ucs2':
      case 'ucs-2':
      case 'utf16le':
      case 'utf-16le':
        return utf16leSlice(this, start, end)

      default:
        if (loweredCase) throw new TypeError('Unknown encoding: ' + encoding)
        encoding = (encoding + '').toLowerCase()
        loweredCase = true
    }
  }
}

// The property is used by `Buffer.isBuffer` and `is-buffer` (in Safari 5-7) to detect
// Buffer instances.
Buffer.prototype._isBuffer = true

function swap (b, n, m) {
  var i = b[n]
  b[n] = b[m]
  b[m] = i
}

Buffer.prototype.swap16 = function swap16 () {
  var len = this.length
  if (len % 2 !== 0) {
    throw new RangeError('Buffer size must be a multiple of 16-bits')
  }
  for (var i = 0; i < len; i += 2) {
    swap(this, i, i + 1)
  }
  return this
}

Buffer.prototype.swap32 = function swap32 () {
  var len = this.length
  if (len % 4 !== 0) {
    throw new RangeError('Buffer size must be a multiple of 32-bits')
  }
  for (var i = 0; i < len; i += 4) {
    swap(this, i, i + 3)
    swap(this, i + 1, i + 2)
  }
  return this
}

Buffer.prototype.swap64 = function swap64 () {
  var len = this.length
  if (len % 8 !== 0) {
    throw new RangeError('Buffer size must be a multiple of 64-bits')
  }
  for (var i = 0; i < len; i += 8) {
    swap(this, i, i + 7)
    swap(this, i + 1, i + 6)
    swap(this, i + 2, i + 5)
    swap(this, i + 3, i + 4)
  }
  return this
}

Buffer.prototype.toString = function toString () {
  var length = this.length | 0
  if (length === 0) return ''
  if (arguments.length === 0) return utf8Slice(this, 0, length)
  return slowToString.apply(this, arguments)
}

Buffer.prototype.equals = function equals (b) {
  if (!Buffer.isBuffer(b)) throw new TypeError('Argument must be a Buffer')
  if (this === b) return true
  return Buffer.compare(this, b) === 0
}

Buffer.prototype.inspect = function inspect () {
  var str = ''
  var max = exports.INSPECT_MAX_BYTES
  if (this.length > 0) {
    str = this.toString('hex', 0, max).match(/.{2}/g).join(' ')
    if (this.length > max) str += ' ... '
  }
  return '<Buffer ' + str + '>'
}

Buffer.prototype.compare = function compare (target, start, end, thisStart, thisEnd) {
  if (!Buffer.isBuffer(target)) {
    throw new TypeError('Argument must be a Buffer')
  }

  if (start === undefined) {
    start = 0
  }
  if (end === undefined) {
    end = target ? target.length : 0
  }
  if (thisStart === undefined) {
    thisStart = 0
  }
  if (thisEnd === undefined) {
    thisEnd = this.length
  }

  if (start < 0 || end > target.length || thisStart < 0 || thisEnd > this.length) {
    throw new RangeError('out of range index')
  }

  if (thisStart >= thisEnd && start >= end) {
    return 0
  }
  if (thisStart >= thisEnd) {
    return -1
  }
  if (start >= end) {
    return 1
  }

  start >>>= 0
  end >>>= 0
  thisStart >>>= 0
  thisEnd >>>= 0

  if (this === target) return 0

  var x = thisEnd - thisStart
  var y = end - start
  var len = Math.min(x, y)

  var thisCopy = this.slice(thisStart, thisEnd)
  var targetCopy = target.slice(start, end)

  for (var i = 0; i < len; ++i) {
    if (thisCopy[i] !== targetCopy[i]) {
      x = thisCopy[i]
      y = targetCopy[i]
      break
    }
  }

  if (x < y) return -1
  if (y < x) return 1
  return 0
}

// Finds either the first index of `val` in `buffer` at offset >= `byteOffset`,
// OR the last index of `val` in `buffer` at offset <= `byteOffset`.
//
// Arguments:
// - buffer - a Buffer to search
// - val - a string, Buffer, or number
// - byteOffset - an index into `buffer`; will be clamped to an int32
// - encoding - an optional encoding, relevant is val is a string
// - dir - true for indexOf, false for lastIndexOf
function bidirectionalIndexOf (buffer, val, byteOffset, encoding, dir) {
  // Empty buffer means no match
  if (buffer.length === 0) return -1

  // Normalize byteOffset
  if (typeof byteOffset === 'string') {
    encoding = byteOffset
    byteOffset = 0
  } else if (byteOffset > 0x7fffffff) {
    byteOffset = 0x7fffffff
  } else if (byteOffset < -0x80000000) {
    byteOffset = -0x80000000
  }
  byteOffset = +byteOffset  // Coerce to Number.
  if (isNaN(byteOffset)) {
    // byteOffset: it it's undefined, null, NaN, "foo", etc, search whole buffer
    byteOffset = dir ? 0 : (buffer.length - 1)
  }

  // Normalize byteOffset: negative offsets start from the end of the buffer
  if (byteOffset < 0) byteOffset = buffer.length + byteOffset
  if (byteOffset >= buffer.length) {
    if (dir) return -1
    else byteOffset = buffer.length - 1
  } else if (byteOffset < 0) {
    if (dir) byteOffset = 0
    else return -1
  }

  // Normalize val
  if (typeof val === 'string') {
    val = Buffer.from(val, encoding)
  }

  // Finally, search either indexOf (if dir is true) or lastIndexOf
  if (Buffer.isBuffer(val)) {
    // Special case: looking for empty string/buffer always fails
    if (val.length === 0) {
      return -1
    }
    return arrayIndexOf(buffer, val, byteOffset, encoding, dir)
  } else if (typeof val === 'number') {
    val = val & 0xFF // Search for a byte value [0-255]
    if (Buffer.TYPED_ARRAY_SUPPORT &&
        typeof Uint8Array.prototype.indexOf === 'function') {
      if (dir) {
        return Uint8Array.prototype.indexOf.call(buffer, val, byteOffset)
      } else {
        return Uint8Array.prototype.lastIndexOf.call(buffer, val, byteOffset)
      }
    }
    return arrayIndexOf(buffer, [ val ], byteOffset, encoding, dir)
  }

  throw new TypeError('val must be string, number or Buffer')
}

function arrayIndexOf (arr, val, byteOffset, encoding, dir) {
  var indexSize = 1
  var arrLength = arr.length
  var valLength = val.length

  if (encoding !== undefined) {
    encoding = String(encoding).toLowerCase()
    if (encoding === 'ucs2' || encoding === 'ucs-2' ||
        encoding === 'utf16le' || encoding === 'utf-16le') {
      if (arr.length < 2 || val.length < 2) {
        return -1
      }
      indexSize = 2
      arrLength /= 2
      valLength /= 2
      byteOffset /= 2
    }
  }

  function read (buf, i) {
    if (indexSize === 1) {
      return buf[i]
    } else {
      return buf.readUInt16BE(i * indexSize)
    }
  }

  var i
  if (dir) {
    var foundIndex = -1
    for (i = byteOffset; i < arrLength; i++) {
      if (read(arr, i) === read(val, foundIndex === -1 ? 0 : i - foundIndex)) {
        if (foundIndex === -1) foundIndex = i
        if (i - foundIndex + 1 === valLength) return foundIndex * indexSize
      } else {
        if (foundIndex !== -1) i -= i - foundIndex
        foundIndex = -1
      }
    }
  } else {
    if (byteOffset + valLength > arrLength) byteOffset = arrLength - valLength
    for (i = byteOffset; i >= 0; i--) {
      var found = true
      for (var j = 0; j < valLength; j++) {
        if (read(arr, i + j) !== read(val, j)) {
          found = false
          break
        }
      }
      if (found) return i
    }
  }

  return -1
}

Buffer.prototype.includes = function includes (val, byteOffset, encoding) {
  return this.indexOf(val, byteOffset, encoding) !== -1
}

Buffer.prototype.indexOf = function indexOf (val, byteOffset, encoding) {
  return bidirectionalIndexOf(this, val, byteOffset, encoding, true)
}

Buffer.prototype.lastIndexOf = function lastIndexOf (val, byteOffset, encoding) {
  return bidirectionalIndexOf(this, val, byteOffset, encoding, false)
}

function hexWrite (buf, string, offset, length) {
  offset = Number(offset) || 0
  var remaining = buf.length - offset
  if (!length) {
    length = remaining
  } else {
    length = Number(length)
    if (length > remaining) {
      length = remaining
    }
  }

  // must be an even number of digits
  var strLen = string.length
  if (strLen % 2 !== 0) throw new TypeError('Invalid hex string')

  if (length > strLen / 2) {
    length = strLen / 2
  }
  for (var i = 0; i < length; ++i) {
    var parsed = parseInt(string.substr(i * 2, 2), 16)
    if (isNaN(parsed)) return i
    buf[offset + i] = parsed
  }
  return i
}

function utf8Write (buf, string, offset, length) {
  return blitBuffer(utf8ToBytes(string, buf.length - offset), buf, offset, length)
}

function asciiWrite (buf, string, offset, length) {
  return blitBuffer(asciiToBytes(string), buf, offset, length)
}

function latin1Write (buf, string, offset, length) {
  return asciiWrite(buf, string, offset, length)
}

function base64Write (buf, string, offset, length) {
  return blitBuffer(base64ToBytes(string), buf, offset, length)
}

function ucs2Write (buf, string, offset, length) {
  return blitBuffer(utf16leToBytes(string, buf.length - offset), buf, offset, length)
}

Buffer.prototype.write = function write (string, offset, length, encoding) {
  // Buffer#write(string)
  if (offset === undefined) {
    encoding = 'utf8'
    length = this.length
    offset = 0
  // Buffer#write(string, encoding)
  } else if (length === undefined && typeof offset === 'string') {
    encoding = offset
    length = this.length
    offset = 0
  // Buffer#write(string, offset[, length][, encoding])
  } else if (isFinite(offset)) {
    offset = offset | 0
    if (isFinite(length)) {
      length = length | 0
      if (encoding === undefined) encoding = 'utf8'
    } else {
      encoding = length
      length = undefined
    }
  // legacy write(string, encoding, offset, length) - remove in v0.13
  } else {
    throw new Error(
      'Buffer.write(string, encoding, offset[, length]) is no longer supported'
    )
  }

  var remaining = this.length - offset
  if (length === undefined || length > remaining) length = remaining

  if ((string.length > 0 && (length < 0 || offset < 0)) || offset > this.length) {
    throw new RangeError('Attempt to write outside buffer bounds')
  }

  if (!encoding) encoding = 'utf8'

  var loweredCase = false
  for (;;) {
    switch (encoding) {
      case 'hex':
        return hexWrite(this, string, offset, length)

      case 'utf8':
      case 'utf-8':
        return utf8Write(this, string, offset, length)

      case 'ascii':
        return asciiWrite(this, string, offset, length)

      case 'latin1':
      case 'binary':
        return latin1Write(this, string, offset, length)

      case 'base64':
        // Warning: maxLength not taken into account in base64Write
        return base64Write(this, string, offset, length)

      case 'ucs2':
      case 'ucs-2':
      case 'utf16le':
      case 'utf-16le':
        return ucs2Write(this, string, offset, length)

      default:
        if (loweredCase) throw new TypeError('Unknown encoding: ' + encoding)
        encoding = ('' + encoding).toLowerCase()
        loweredCase = true
    }
  }
}

Buffer.prototype.toJSON = function toJSON () {
  return {
    type: 'Buffer',
    data: Array.prototype.slice.call(this._arr || this, 0)
  }
}

function base64Slice (buf, start, end) {
  if (start === 0 && end === buf.length) {
    return base64.fromByteArray(buf)
  } else {
    return base64.fromByteArray(buf.slice(start, end))
  }
}

function utf8Slice (buf, start, end) {
  end = Math.min(buf.length, end)
  var res = []

  var i = start
  while (i < end) {
    var firstByte = buf[i]
    var codePoint = null
    var bytesPerSequence = (firstByte > 0xEF) ? 4
      : (firstByte > 0xDF) ? 3
      : (firstByte > 0xBF) ? 2
      : 1

    if (i + bytesPerSequence <= end) {
      var secondByte, thirdByte, fourthByte, tempCodePoint

      switch (bytesPerSequence) {
        case 1:
          if (firstByte < 0x80) {
            codePoint = firstByte
          }
          break
        case 2:
          secondByte = buf[i + 1]
          if ((secondByte & 0xC0) === 0x80) {
            tempCodePoint = (firstByte & 0x1F) << 0x6 | (secondByte & 0x3F)
            if (tempCodePoint > 0x7F) {
              codePoint = tempCodePoint
            }
          }
          break
        case 3:
          secondByte = buf[i + 1]
          thirdByte = buf[i + 2]
          if ((secondByte & 0xC0) === 0x80 && (thirdByte & 0xC0) === 0x80) {
            tempCodePoint = (firstByte & 0xF) << 0xC | (secondByte & 0x3F) << 0x6 | (thirdByte & 0x3F)
            if (tempCodePoint > 0x7FF && (tempCodePoint < 0xD800 || tempCodePoint > 0xDFFF)) {
              codePoint = tempCodePoint
            }
          }
          break
        case 4:
          secondByte = buf[i + 1]
          thirdByte = buf[i + 2]
          fourthByte = buf[i + 3]
          if ((secondByte & 0xC0) === 0x80 && (thirdByte & 0xC0) === 0x80 && (fourthByte & 0xC0) === 0x80) {
            tempCodePoint = (firstByte & 0xF) << 0x12 | (secondByte & 0x3F) << 0xC | (thirdByte & 0x3F) << 0x6 | (fourthByte & 0x3F)
            if (tempCodePoint > 0xFFFF && tempCodePoint < 0x110000) {
              codePoint = tempCodePoint
            }
          }
      }
    }

    if (codePoint === null) {
      // we did not generate a valid codePoint so insert a
      // replacement char (U+FFFD) and advance only 1 byte
      codePoint = 0xFFFD
      bytesPerSequence = 1
    } else if (codePoint > 0xFFFF) {
      // encode to utf16 (surrogate pair dance)
      codePoint -= 0x10000
      res.push(codePoint >>> 10 & 0x3FF | 0xD800)
      codePoint = 0xDC00 | codePoint & 0x3FF
    }

    res.push(codePoint)
    i += bytesPerSequence
  }

  return decodeCodePointsArray(res)
}

// Based on http://stackoverflow.com/a/22747272/680742, the browser with
// the lowest limit is Chrome, with 0x10000 args.
// We go 1 magnitude less, for safety
var MAX_ARGUMENTS_LENGTH = 0x1000

function decodeCodePointsArray (codePoints) {
  var len = codePoints.length
  if (len <= MAX_ARGUMENTS_LENGTH) {
    return String.fromCharCode.apply(String, codePoints) // avoid extra slice()
  }

  // Decode in chunks to avoid "call stack size exceeded".
  var res = ''
  var i = 0
  while (i < len) {
    res += String.fromCharCode.apply(
      String,
      codePoints.slice(i, i += MAX_ARGUMENTS_LENGTH)
    )
  }
  return res
}

function asciiSlice (buf, start, end) {
  var ret = ''
  end = Math.min(buf.length, end)

  for (var i = start; i < end; ++i) {
    ret += String.fromCharCode(buf[i] & 0x7F)
  }
  return ret
}

function latin1Slice (buf, start, end) {
  var ret = ''
  end = Math.min(buf.length, end)

  for (var i = start; i < end; ++i) {
    ret += String.fromCharCode(buf[i])
  }
  return ret
}

function hexSlice (buf, start, end) {
  var len = buf.length

  if (!start || start < 0) start = 0
  if (!end || end < 0 || end > len) end = len

  var out = ''
  for (var i = start; i < end; ++i) {
    out += toHex(buf[i])
  }
  return out
}

function utf16leSlice (buf, start, end) {
  var bytes = buf.slice(start, end)
  var res = ''
  for (var i = 0; i < bytes.length; i += 2) {
    res += String.fromCharCode(bytes[i] + bytes[i + 1] * 256)
  }
  return res
}

Buffer.prototype.slice = function slice (start, end) {
  var len = this.length
  start = ~~start
  end = end === undefined ? len : ~~end

  if (start < 0) {
    start += len
    if (start < 0) start = 0
  } else if (start > len) {
    start = len
  }

  if (end < 0) {
    end += len
    if (end < 0) end = 0
  } else if (end > len) {
    end = len
  }

  if (end < start) end = start

  var newBuf
  if (Buffer.TYPED_ARRAY_SUPPORT) {
    newBuf = this.subarray(start, end)
    newBuf.__proto__ = Buffer.prototype
  } else {
    var sliceLen = end - start
    newBuf = new Buffer(sliceLen, undefined)
    for (var i = 0; i < sliceLen; ++i) {
      newBuf[i] = this[i + start]
    }
  }

  return newBuf
}

/*
 * Need to make sure that buffer isn't trying to write out of bounds.
 */
function checkOffset (offset, ext, length) {
  if ((offset % 1) !== 0 || offset < 0) throw new RangeError('offset is not uint')
  if (offset + ext > length) throw new RangeError('Trying to access beyond buffer length')
}

Buffer.prototype.readUIntLE = function readUIntLE (offset, byteLength, noAssert) {
  offset = offset | 0
  byteLength = byteLength | 0
  if (!noAssert) checkOffset(offset, byteLength, this.length)

  var val = this[offset]
  var mul = 1
  var i = 0
  while (++i < byteLength && (mul *= 0x100)) {
    val += this[offset + i] * mul
  }

  return val
}

Buffer.prototype.readUIntBE = function readUIntBE (offset, byteLength, noAssert) {
  offset = offset | 0
  byteLength = byteLength | 0
  if (!noAssert) {
    checkOffset(offset, byteLength, this.length)
  }

  var val = this[offset + --byteLength]
  var mul = 1
  while (byteLength > 0 && (mul *= 0x100)) {
    val += this[offset + --byteLength] * mul
  }

  return val
}

Buffer.prototype.readUInt8 = function readUInt8 (offset, noAssert) {
  if (!noAssert) checkOffset(offset, 1, this.length)
  return this[offset]
}

Buffer.prototype.readUInt16LE = function readUInt16LE (offset, noAssert) {
  if (!noAssert) checkOffset(offset, 2, this.length)
  return this[offset] | (this[offset + 1] << 8)
}

Buffer.prototype.readUInt16BE = function readUInt16BE (offset, noAssert) {
  if (!noAssert) checkOffset(offset, 2, this.length)
  return (this[offset] << 8) | this[offset + 1]
}

Buffer.prototype.readUInt32LE = function readUInt32LE (offset, noAssert) {
  if (!noAssert) checkOffset(offset, 4, this.length)

  return ((this[offset]) |
      (this[offset + 1] << 8) |
      (this[offset + 2] << 16)) +
      (this[offset + 3] * 0x1000000)
}

Buffer.prototype.readUInt32BE = function readUInt32BE (offset, noAssert) {
  if (!noAssert) checkOffset(offset, 4, this.length)

  return (this[offset] * 0x1000000) +
    ((this[offset + 1] << 16) |
    (this[offset + 2] << 8) |
    this[offset + 3])
}

Buffer.prototype.readIntLE = function readIntLE (offset, byteLength, noAssert) {
  offset = offset | 0
  byteLength = byteLength | 0
  if (!noAssert) checkOffset(offset, byteLength, this.length)

  var val = this[offset]
  var mul = 1
  var i = 0
  while (++i < byteLength && (mul *= 0x100)) {
    val += this[offset + i] * mul
  }
  mul *= 0x80

  if (val >= mul) val -= Math.pow(2, 8 * byteLength)

  return val
}

Buffer.prototype.readIntBE = function readIntBE (offset, byteLength, noAssert) {
  offset = offset | 0
  byteLength = byteLength | 0
  if (!noAssert) checkOffset(offset, byteLength, this.length)

  var i = byteLength
  var mul = 1
  var val = this[offset + --i]
  while (i > 0 && (mul *= 0x100)) {
    val += this[offset + --i] * mul
  }
  mul *= 0x80

  if (val >= mul) val -= Math.pow(2, 8 * byteLength)

  return val
}

Buffer.prototype.readInt8 = function readInt8 (offset, noAssert) {
  if (!noAssert) checkOffset(offset, 1, this.length)
  if (!(this[offset] & 0x80)) return (this[offset])
  return ((0xff - this[offset] + 1) * -1)
}

Buffer.prototype.readInt16LE = function readInt16LE (offset, noAssert) {
  if (!noAssert) checkOffset(offset, 2, this.length)
  var val = this[offset] | (this[offset + 1] << 8)
  return (val & 0x8000) ? val | 0xFFFF0000 : val
}

Buffer.prototype.readInt16BE = function readInt16BE (offset, noAssert) {
  if (!noAssert) checkOffset(offset, 2, this.length)
  var val = this[offset + 1] | (this[offset] << 8)
  return (val & 0x8000) ? val | 0xFFFF0000 : val
}

Buffer.prototype.readInt32LE = function readInt32LE (offset, noAssert) {
  if (!noAssert) checkOffset(offset, 4, this.length)

  return (this[offset]) |
    (this[offset + 1] << 8) |
    (this[offset + 2] << 16) |
    (this[offset + 3] << 24)
}

Buffer.prototype.readInt32BE = function readInt32BE (offset, noAssert) {
  if (!noAssert) checkOffset(offset, 4, this.length)

  return (this[offset] << 24) |
    (this[offset + 1] << 16) |
    (this[offset + 2] << 8) |
    (this[offset + 3])
}

Buffer.prototype.readFloatLE = function readFloatLE (offset, noAssert) {
  if (!noAssert) checkOffset(offset, 4, this.length)
  return ieee754.read(this, offset, true, 23, 4)
}

Buffer.prototype.readFloatBE = function readFloatBE (offset, noAssert) {
  if (!noAssert) checkOffset(offset, 4, this.length)
  return ieee754.read(this, offset, false, 23, 4)
}

Buffer.prototype.readDoubleLE = function readDoubleLE (offset, noAssert) {
  if (!noAssert) checkOffset(offset, 8, this.length)
  return ieee754.read(this, offset, true, 52, 8)
}

Buffer.prototype.readDoubleBE = function readDoubleBE (offset, noAssert) {
  if (!noAssert) checkOffset(offset, 8, this.length)
  return ieee754.read(this, offset, false, 52, 8)
}

function checkInt (buf, value, offset, ext, max, min) {
  if (!Buffer.isBuffer(buf)) throw new TypeError('"buffer" argument must be a Buffer instance')
  if (value > max || value < min) throw new RangeError('"value" argument is out of bounds')
  if (offset + ext > buf.length) throw new RangeError('Index out of range')
}

Buffer.prototype.writeUIntLE = function writeUIntLE (value, offset, byteLength, noAssert) {
  value = +value
  offset = offset | 0
  byteLength = byteLength | 0
  if (!noAssert) {
    var maxBytes = Math.pow(2, 8 * byteLength) - 1
    checkInt(this, value, offset, byteLength, maxBytes, 0)
  }

  var mul = 1
  var i = 0
  this[offset] = value & 0xFF
  while (++i < byteLength && (mul *= 0x100)) {
    this[offset + i] = (value / mul) & 0xFF
  }

  return offset + byteLength
}

Buffer.prototype.writeUIntBE = function writeUIntBE (value, offset, byteLength, noAssert) {
  value = +value
  offset = offset | 0
  byteLength = byteLength | 0
  if (!noAssert) {
    var maxBytes = Math.pow(2, 8 * byteLength) - 1
    checkInt(this, value, offset, byteLength, maxBytes, 0)
  }

  var i = byteLength - 1
  var mul = 1
  this[offset + i] = value & 0xFF
  while (--i >= 0 && (mul *= 0x100)) {
    this[offset + i] = (value / mul) & 0xFF
  }

  return offset + byteLength
}

Buffer.prototype.writeUInt8 = function writeUInt8 (value, offset, noAssert) {
  value = +value
  offset = offset | 0
  if (!noAssert) checkInt(this, value, offset, 1, 0xff, 0)
  if (!Buffer.TYPED_ARRAY_SUPPORT) value = Math.floor(value)
  this[offset] = (value & 0xff)
  return offset + 1
}

function objectWriteUInt16 (buf, value, offset, littleEndian) {
  if (value < 0) value = 0xffff + value + 1
  for (var i = 0, j = Math.min(buf.length - offset, 2); i < j; ++i) {
    buf[offset + i] = (value & (0xff << (8 * (littleEndian ? i : 1 - i)))) >>>
      (littleEndian ? i : 1 - i) * 8
  }
}

Buffer.prototype.writeUInt16LE = function writeUInt16LE (value, offset, noAssert) {
  value = +value
  offset = offset | 0
  if (!noAssert) checkInt(this, value, offset, 2, 0xffff, 0)
  if (Buffer.TYPED_ARRAY_SUPPORT) {
    this[offset] = (value & 0xff)
    this[offset + 1] = (value >>> 8)
  } else {
    objectWriteUInt16(this, value, offset, true)
  }
  return offset + 2
}

Buffer.prototype.writeUInt16BE = function writeUInt16BE (value, offset, noAssert) {
  value = +value
  offset = offset | 0
  if (!noAssert) checkInt(this, value, offset, 2, 0xffff, 0)
  if (Buffer.TYPED_ARRAY_SUPPORT) {
    this[offset] = (value >>> 8)
    this[offset + 1] = (value & 0xff)
  } else {
    objectWriteUInt16(this, value, offset, false)
  }
  return offset + 2
}

function objectWriteUInt32 (buf, value, offset, littleEndian) {
  if (value < 0) value = 0xffffffff + value + 1
  for (var i = 0, j = Math.min(buf.length - offset, 4); i < j; ++i) {
    buf[offset + i] = (value >>> (littleEndian ? i : 3 - i) * 8) & 0xff
  }
}

Buffer.prototype.writeUInt32LE = function writeUInt32LE (value, offset, noAssert) {
  value = +value
  offset = offset | 0
  if (!noAssert) checkInt(this, value, offset, 4, 0xffffffff, 0)
  if (Buffer.TYPED_ARRAY_SUPPORT) {
    this[offset + 3] = (value >>> 24)
    this[offset + 2] = (value >>> 16)
    this[offset + 1] = (value >>> 8)
    this[offset] = (value & 0xff)
  } else {
    objectWriteUInt32(this, value, offset, true)
  }
  return offset + 4
}

Buffer.prototype.writeUInt32BE = function writeUInt32BE (value, offset, noAssert) {
  value = +value
  offset = offset | 0
  if (!noAssert) checkInt(this, value, offset, 4, 0xffffffff, 0)
  if (Buffer.TYPED_ARRAY_SUPPORT) {
    this[offset] = (value >>> 24)
    this[offset + 1] = (value >>> 16)
    this[offset + 2] = (value >>> 8)
    this[offset + 3] = (value & 0xff)
  } else {
    objectWriteUInt32(this, value, offset, false)
  }
  return offset + 4
}

Buffer.prototype.writeIntLE = function writeIntLE (value, offset, byteLength, noAssert) {
  value = +value
  offset = offset | 0
  if (!noAssert) {
    var limit = Math.pow(2, 8 * byteLength - 1)

    checkInt(this, value, offset, byteLength, limit - 1, -limit)
  }

  var i = 0
  var mul = 1
  var sub = 0
  this[offset] = value & 0xFF
  while (++i < byteLength && (mul *= 0x100)) {
    if (value < 0 && sub === 0 && this[offset + i - 1] !== 0) {
      sub = 1
    }
    this[offset + i] = ((value / mul) >> 0) - sub & 0xFF
  }

  return offset + byteLength
}

Buffer.prototype.writeIntBE = function writeIntBE (value, offset, byteLength, noAssert) {
  value = +value
  offset = offset | 0
  if (!noAssert) {
    var limit = Math.pow(2, 8 * byteLength - 1)

    checkInt(this, value, offset, byteLength, limit - 1, -limit)
  }

  var i = byteLength - 1
  var mul = 1
  var sub = 0
  this[offset + i] = value & 0xFF
  while (--i >= 0 && (mul *= 0x100)) {
    if (value < 0 && sub === 0 && this[offset + i + 1] !== 0) {
      sub = 1
    }
    this[offset + i] = ((value / mul) >> 0) - sub & 0xFF
  }

  return offset + byteLength
}

Buffer.prototype.writeInt8 = function writeInt8 (value, offset, noAssert) {
  value = +value
  offset = offset | 0
  if (!noAssert) checkInt(this, value, offset, 1, 0x7f, -0x80)
  if (!Buffer.TYPED_ARRAY_SUPPORT) value = Math.floor(value)
  if (value < 0) value = 0xff + value + 1
  this[offset] = (value & 0xff)
  return offset + 1
}

Buffer.prototype.writeInt16LE = function writeInt16LE (value, offset, noAssert) {
  value = +value
  offset = offset | 0
  if (!noAssert) checkInt(this, value, offset, 2, 0x7fff, -0x8000)
  if (Buffer.TYPED_ARRAY_SUPPORT) {
    this[offset] = (value & 0xff)
    this[offset + 1] = (value >>> 8)
  } else {
    objectWriteUInt16(this, value, offset, true)
  }
  return offset + 2
}

Buffer.prototype.writeInt16BE = function writeInt16BE (value, offset, noAssert) {
  value = +value
  offset = offset | 0
  if (!noAssert) checkInt(this, value, offset, 2, 0x7fff, -0x8000)
  if (Buffer.TYPED_ARRAY_SUPPORT) {
    this[offset] = (value >>> 8)
    this[offset + 1] = (value & 0xff)
  } else {
    objectWriteUInt16(this, value, offset, false)
  }
  return offset + 2
}

Buffer.prototype.writeInt32LE = function writeInt32LE (value, offset, noAssert) {
  value = +value
  offset = offset | 0
  if (!noAssert) checkInt(this, value, offset, 4, 0x7fffffff, -0x80000000)
  if (Buffer.TYPED_ARRAY_SUPPORT) {
    this[offset] = (value & 0xff)
    this[offset + 1] = (value >>> 8)
    this[offset + 2] = (value >>> 16)
    this[offset + 3] = (value >>> 24)
  } else {
    objectWriteUInt32(this, value, offset, true)
  }
  return offset + 4
}

Buffer.prototype.writeInt32BE = function writeInt32BE (value, offset, noAssert) {
  value = +value
  offset = offset | 0
  if (!noAssert) checkInt(this, value, offset, 4, 0x7fffffff, -0x80000000)
  if (value < 0) value = 0xffffffff + value + 1
  if (Buffer.TYPED_ARRAY_SUPPORT) {
    this[offset] = (value >>> 24)
    this[offset + 1] = (value >>> 16)
    this[offset + 2] = (value >>> 8)
    this[offset + 3] = (value & 0xff)
  } else {
    objectWriteUInt32(this, value, offset, false)
  }
  return offset + 4
}

function checkIEEE754 (buf, value, offset, ext, max, min) {
  if (offset + ext > buf.length) throw new RangeError('Index out of range')
  if (offset < 0) throw new RangeError('Index out of range')
}

function writeFloat (buf, value, offset, littleEndian, noAssert) {
  if (!noAssert) {
    checkIEEE754(buf, value, offset, 4, 3.4028234663852886e+38, -3.4028234663852886e+38)
  }
  ieee754.write(buf, value, offset, littleEndian, 23, 4)
  return offset + 4
}

Buffer.prototype.writeFloatLE = function writeFloatLE (value, offset, noAssert) {
  return writeFloat(this, value, offset, true, noAssert)
}

Buffer.prototype.writeFloatBE = function writeFloatBE (value, offset, noAssert) {
  return writeFloat(this, value, offset, false, noAssert)
}

function writeDouble (buf, value, offset, littleEndian, noAssert) {
  if (!noAssert) {
    checkIEEE754(buf, value, offset, 8, 1.7976931348623157E+308, -1.7976931348623157E+308)
  }
  ieee754.write(buf, value, offset, littleEndian, 52, 8)
  return offset + 8
}

Buffer.prototype.writeDoubleLE = function writeDoubleLE (value, offset, noAssert) {
  return writeDouble(this, value, offset, true, noAssert)
}

Buffer.prototype.writeDoubleBE = function writeDoubleBE (value, offset, noAssert) {
  return writeDouble(this, value, offset, false, noAssert)
}

// copy(targetBuffer, targetStart=0, sourceStart=0, sourceEnd=buffer.length)
Buffer.prototype.copy = function copy (target, targetStart, start, end) {
  if (!start) start = 0
  if (!end && end !== 0) end = this.length
  if (targetStart >= target.length) targetStart = target.length
  if (!targetStart) targetStart = 0
  if (end > 0 && end < start) end = start

  // Copy 0 bytes; we're done
  if (end === start) return 0
  if (target.length === 0 || this.length === 0) return 0

  // Fatal error conditions
  if (targetStart < 0) {
    throw new RangeError('targetStart out of bounds')
  }
  if (start < 0 || start >= this.length) throw new RangeError('sourceStart out of bounds')
  if (end < 0) throw new RangeError('sourceEnd out of bounds')

  // Are we oob?
  if (end > this.length) end = this.length
  if (target.length - targetStart < end - start) {
    end = target.length - targetStart + start
  }

  var len = end - start
  var i

  if (this === target && start < targetStart && targetStart < end) {
    // descending copy from end
    for (i = len - 1; i >= 0; --i) {
      target[i + targetStart] = this[i + start]
    }
  } else if (len < 1000 || !Buffer.TYPED_ARRAY_SUPPORT) {
    // ascending copy from start
    for (i = 0; i < len; ++i) {
      target[i + targetStart] = this[i + start]
    }
  } else {
    Uint8Array.prototype.set.call(
      target,
      this.subarray(start, start + len),
      targetStart
    )
  }

  return len
}

// Usage:
//    buffer.fill(number[, offset[, end]])
//    buffer.fill(buffer[, offset[, end]])
//    buffer.fill(string[, offset[, end]][, encoding])
Buffer.prototype.fill = function fill (val, start, end, encoding) {
  // Handle string cases:
  if (typeof val === 'string') {
    if (typeof start === 'string') {
      encoding = start
      start = 0
      end = this.length
    } else if (typeof end === 'string') {
      encoding = end
      end = this.length
    }
    if (val.length === 1) {
      var code = val.charCodeAt(0)
      if (code < 256) {
        val = code
      }
    }
    if (encoding !== undefined && typeof encoding !== 'string') {
      throw new TypeError('encoding must be a string')
    }
    if (typeof encoding === 'string' && !Buffer.isEncoding(encoding)) {
      throw new TypeError('Unknown encoding: ' + encoding)
    }
  } else if (typeof val === 'number') {
    val = val & 255
  }

  // Invalid ranges are not set to a default, so can range check early.
  if (start < 0 || this.length < start || this.length < end) {
    throw new RangeError('Out of range index')
  }

  if (end <= start) {
    return this
  }

  start = start >>> 0
  end = end === undefined ? this.length : end >>> 0

  if (!val) val = 0

  var i
  if (typeof val === 'number') {
    for (i = start; i < end; ++i) {
      this[i] = val
    }
  } else {
    var bytes = Buffer.isBuffer(val)
      ? val
      : utf8ToBytes(new Buffer(val, encoding).toString())
    var len = bytes.length
    for (i = 0; i < end - start; ++i) {
      this[i + start] = bytes[i % len]
    }
  }

  return this
}

// HELPER FUNCTIONS
// ================

var INVALID_BASE64_RE = /[^+\/0-9A-Za-z-_]/g

function base64clean (str) {
  // Node strips out invalid characters like \n and \t from the string, base64-js does not
  str = stringtrim(str).replace(INVALID_BASE64_RE, '')
  // Node converts strings with length < 2 to ''
  if (str.length < 2) return ''
  // Node allows for non-padded base64 strings (missing trailing ===), base64-js does not
  while (str.length % 4 !== 0) {
    str = str + '='
  }
  return str
}

function stringtrim (str) {
  if (str.trim) return str.trim()
  return str.replace(/^\s+|\s+$/g, '')
}

function toHex (n) {
  if (n < 16) return '0' + n.toString(16)
  return n.toString(16)
}

function utf8ToBytes (string, units) {
  units = units || Infinity
  var codePoint
  var length = string.length
  var leadSurrogate = null
  var bytes = []

  for (var i = 0; i < length; ++i) {
    codePoint = string.charCodeAt(i)

    // is surrogate component
    if (codePoint > 0xD7FF && codePoint < 0xE000) {
      // last char was a lead
      if (!leadSurrogate) {
        // no lead yet
        if (codePoint > 0xDBFF) {
          // unexpected trail
          if ((units -= 3) > -1) bytes.push(0xEF, 0xBF, 0xBD)
          continue
        } else if (i + 1 === length) {
          // unpaired lead
          if ((units -= 3) > -1) bytes.push(0xEF, 0xBF, 0xBD)
          continue
        }

        // valid lead
        leadSurrogate = codePoint

        continue
      }

      // 2 leads in a row
      if (codePoint < 0xDC00) {
        if ((units -= 3) > -1) bytes.push(0xEF, 0xBF, 0xBD)
        leadSurrogate = codePoint
        continue
      }

      // valid surrogate pair
      codePoint = (leadSurrogate - 0xD800 << 10 | codePoint - 0xDC00) + 0x10000
    } else if (leadSurrogate) {
      // valid bmp char, but last char was a lead
      if ((units -= 3) > -1) bytes.push(0xEF, 0xBF, 0xBD)
    }

    leadSurrogate = null

    // encode utf8
    if (codePoint < 0x80) {
      if ((units -= 1) < 0) break
      bytes.push(codePoint)
    } else if (codePoint < 0x800) {
      if ((units -= 2) < 0) break
      bytes.push(
        codePoint >> 0x6 | 0xC0,
        codePoint & 0x3F | 0x80
      )
    } else if (codePoint < 0x10000) {
      if ((units -= 3) < 0) break
      bytes.push(
        codePoint >> 0xC | 0xE0,
        codePoint >> 0x6 & 0x3F | 0x80,
        codePoint & 0x3F | 0x80
      )
    } else if (codePoint < 0x110000) {
      if ((units -= 4) < 0) break
      bytes.push(
        codePoint >> 0x12 | 0xF0,
        codePoint >> 0xC & 0x3F | 0x80,
        codePoint >> 0x6 & 0x3F | 0x80,
        codePoint & 0x3F | 0x80
      )
    } else {
      throw new Error('Invalid code point')
    }
  }

  return bytes
}

function asciiToBytes (str) {
  var byteArray = []
  for (var i = 0; i < str.length; ++i) {
    // Node's code seems to be doing this and not & 0x7F..
    byteArray.push(str.charCodeAt(i) & 0xFF)
  }
  return byteArray
}

function utf16leToBytes (str, units) {
  var c, hi, lo
  var byteArray = []
  for (var i = 0; i < str.length; ++i) {
    if ((units -= 2) < 0) break

    c = str.charCodeAt(i)
    hi = c >> 8
    lo = c % 256
    byteArray.push(lo)
    byteArray.push(hi)
  }

  return byteArray
}

function base64ToBytes (str) {
  return base64.toByteArray(base64clean(str))
}

function blitBuffer (src, dst, offset, length) {
  for (var i = 0; i < length; ++i) {
    if ((i + offset >= dst.length) || (i >= src.length)) break
    dst[i + offset] = src[i]
  }
  return i
}

function isnan (val) {
  return val !== val // eslint-disable-line no-self-compare
}

/* WEBPACK VAR INJECTION */}.call(exports, __webpack_require__(3)))

/***/ }),
/* 2 */
/***/ (function(module, exports) {

if (typeof Object.create === 'function') {
  // implementation from standard node.js 'util' module
  module.exports = function inherits(ctor, superCtor) {
    ctor.super_ = superCtor
    ctor.prototype = Object.create(superCtor.prototype, {
      constructor: {
        value: ctor,
        enumerable: false,
        writable: true,
        configurable: true
      }
    });
  };
} else {
  // old school shim for old browsers
  module.exports = function inherits(ctor, superCtor) {
    ctor.super_ = superCtor
    var TempCtor = function () {}
    TempCtor.prototype = superCtor.prototype
    ctor.prototype = new TempCtor()
    ctor.prototype.constructor = ctor
  }
}


/***/ }),
/* 3 */
/***/ (function(module, exports) {

var g;

// This works in non-strict mode
g = (function() {
	return this;
})();

try {
	// This works if eval is allowed (see CSP)
	g = g || Function("return this")() || (1,eval)("this");
} catch(e) {
	// This works if the window reference is available
	if(typeof window === "object")
		g = window;
}

// g can still be undefined, but nothing to do about it...
// We return undefined, instead of nothing here, so it's
// easier to handle this case. if(!global) { ...}

module.exports = g;


/***/ }),
/* 4 */
/***/ (function(module, exports, __webpack_require__) {

/* WEBPACK VAR INJECTION */(function(Buffer) {// Copyright Joyent, Inc. and other Node contributors.
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

// NOTE: These type checking functions intentionally don't use `instanceof`
// because it is fragile and can be easily faked with `Object.create()`.

function isArray(arg) {
  if (Array.isArray) {
    return Array.isArray(arg);
  }
  return objectToString(arg) === '[object Array]';
}
exports.isArray = isArray;

function isBoolean(arg) {
  return typeof arg === 'boolean';
}
exports.isBoolean = isBoolean;

function isNull(arg) {
  return arg === null;
}
exports.isNull = isNull;

function isNullOrUndefined(arg) {
  return arg == null;
}
exports.isNullOrUndefined = isNullOrUndefined;

function isNumber(arg) {
  return typeof arg === 'number';
}
exports.isNumber = isNumber;

function isString(arg) {
  return typeof arg === 'string';
}
exports.isString = isString;

function isSymbol(arg) {
  return typeof arg === 'symbol';
}
exports.isSymbol = isSymbol;

function isUndefined(arg) {
  return arg === void 0;
}
exports.isUndefined = isUndefined;

function isRegExp(re) {
  return objectToString(re) === '[object RegExp]';
}
exports.isRegExp = isRegExp;

function isObject(arg) {
  return typeof arg === 'object' && arg !== null;
}
exports.isObject = isObject;

function isDate(d) {
  return objectToString(d) === '[object Date]';
}
exports.isDate = isDate;

function isError(e) {
  return (objectToString(e) === '[object Error]' || e instanceof Error);
}
exports.isError = isError;

function isFunction(arg) {
  return typeof arg === 'function';
}
exports.isFunction = isFunction;

function isPrimitive(arg) {
  return arg === null ||
         typeof arg === 'boolean' ||
         typeof arg === 'number' ||
         typeof arg === 'string' ||
         typeof arg === 'symbol' ||  // ES6 symbol
         typeof arg === 'undefined';
}
exports.isPrimitive = isPrimitive;

exports.isBuffer = Buffer.isBuffer;

function objectToString(o) {
  return Object.prototype.toString.call(o);
}

/* WEBPACK VAR INJECTION */}.call(exports, __webpack_require__(1).Buffer))

/***/ }),
/* 5 */
/***/ (function(module, exports) {

// shim for using process in browser
var process = module.exports = {};

// cached from whatever global is present so that test runners that stub it
// don't break things.  But we need to wrap it in a try catch in case it is
// wrapped in strict mode code which doesn't define any globals.  It's inside a
// function because try/catches deoptimize in certain engines.

var cachedSetTimeout;
var cachedClearTimeout;

function defaultSetTimout() {
    throw new Error('setTimeout has not been defined');
}
function defaultClearTimeout () {
    throw new Error('clearTimeout has not been defined');
}
(function () {
    try {
        if (typeof setTimeout === 'function') {
            cachedSetTimeout = setTimeout;
        } else {
            cachedSetTimeout = defaultSetTimout;
        }
    } catch (e) {
        cachedSetTimeout = defaultSetTimout;
    }
    try {
        if (typeof clearTimeout === 'function') {
            cachedClearTimeout = clearTimeout;
        } else {
            cachedClearTimeout = defaultClearTimeout;
        }
    } catch (e) {
        cachedClearTimeout = defaultClearTimeout;
    }
} ())
function runTimeout(fun) {
    if (cachedSetTimeout === setTimeout) {
        //normal enviroments in sane situations
        return setTimeout(fun, 0);
    }
    // if setTimeout wasn't available but was latter defined
    if ((cachedSetTimeout === defaultSetTimout || !cachedSetTimeout) && setTimeout) {
        cachedSetTimeout = setTimeout;
        return setTimeout(fun, 0);
    }
    try {
        // when when somebody has screwed with setTimeout but no I.E. maddness
        return cachedSetTimeout(fun, 0);
    } catch(e){
        try {
            // When we are in I.E. but the script has been evaled so I.E. doesn't trust the global object when called normally
            return cachedSetTimeout.call(null, fun, 0);
        } catch(e){
            // same as above but when it's a version of I.E. that must have the global object for 'this', hopfully our context correct otherwise it will throw a global error
            return cachedSetTimeout.call(this, fun, 0);
        }
    }


}
function runClearTimeout(marker) {
    if (cachedClearTimeout === clearTimeout) {
        //normal enviroments in sane situations
        return clearTimeout(marker);
    }
    // if clearTimeout wasn't available but was latter defined
    if ((cachedClearTimeout === defaultClearTimeout || !cachedClearTimeout) && clearTimeout) {
        cachedClearTimeout = clearTimeout;
        return clearTimeout(marker);
    }
    try {
        // when when somebody has screwed with setTimeout but no I.E. maddness
        return cachedClearTimeout(marker);
    } catch (e){
        try {
            // When we are in I.E. but the script has been evaled so I.E. doesn't  trust the global object when called normally
            return cachedClearTimeout.call(null, marker);
        } catch (e){
            // same as above but when it's a version of I.E. that must have the global object for 'this', hopfully our context correct otherwise it will throw a global error.
            // Some versions of I.E. have different rules for clearTimeout vs setTimeout
            return cachedClearTimeout.call(this, marker);
        }
    }



}
var queue = [];
var draining = false;
var currentQueue;
var queueIndex = -1;

function cleanUpNextTick() {
    if (!draining || !currentQueue) {
        return;
    }
    draining = false;
    if (currentQueue.length) {
        queue = currentQueue.concat(queue);
    } else {
        queueIndex = -1;
    }
    if (queue.length) {
        drainQueue();
    }
}

function drainQueue() {
    if (draining) {
        return;
    }
    var timeout = runTimeout(cleanUpNextTick);
    draining = true;

    var len = queue.length;
    while(len) {
        currentQueue = queue;
        queue = [];
        while (++queueIndex < len) {
            if (currentQueue) {
                currentQueue[queueIndex].run();
            }
        }
        queueIndex = -1;
        len = queue.length;
    }
    currentQueue = null;
    draining = false;
    runClearTimeout(timeout);
}

process.nextTick = function (fun) {
    var args = new Array(arguments.length - 1);
    if (arguments.length > 1) {
        for (var i = 1; i < arguments.length; i++) {
            args[i - 1] = arguments[i];
        }
    }
    queue.push(new Item(fun, args));
    if (queue.length === 1 && !draining) {
        runTimeout(drainQueue);
    }
};

// v8 likes predictible objects
function Item(fun, array) {
    this.fun = fun;
    this.array = array;
}
Item.prototype.run = function () {
    this.fun.apply(null, this.array);
};
process.title = 'browser';
process.browser = true;
process.env = {};
process.argv = [];
process.version = ''; // empty string to avoid regexp issues
process.versions = {};

function noop() {}

process.on = noop;
process.addListener = noop;
process.once = noop;
process.off = noop;
process.removeListener = noop;
process.removeAllListeners = noop;
process.emit = noop;

process.binding = function (name) {
    throw new Error('process.binding is not supported');
};

process.cwd = function () { return '/' };
process.chdir = function (dir) {
    throw new Error('process.chdir is not supported');
};
process.umask = function() { return 0; };


/***/ }),
/* 6 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
/* WEBPACK VAR INJECTION */(function(global) {

var buffer = __webpack_require__(1);
var Buffer = buffer.Buffer;
var SlowBuffer = buffer.SlowBuffer;
var MAX_LEN = buffer.kMaxLength || 2147483647;
exports.alloc = function alloc(size, fill, encoding) {
  if (typeof Buffer.alloc === 'function') {
    return Buffer.alloc(size, fill, encoding);
  }
  if (typeof encoding === 'number') {
    throw new TypeError('encoding must not be number');
  }
  if (typeof size !== 'number') {
    throw new TypeError('size must be a number');
  }
  if (size > MAX_LEN) {
    throw new RangeError('size is too large');
  }
  var enc = encoding;
  var _fill = fill;
  if (_fill === undefined) {
    enc = undefined;
    _fill = 0;
  }
  var buf = new Buffer(size);
  if (typeof _fill === 'string') {
    var fillBuf = new Buffer(_fill, enc);
    var flen = fillBuf.length;
    var i = -1;
    while (++i < size) {
      buf[i] = fillBuf[i % flen];
    }
  } else {
    buf.fill(_fill);
  }
  return buf;
}
exports.allocUnsafe = function allocUnsafe(size) {
  if (typeof Buffer.allocUnsafe === 'function') {
    return Buffer.allocUnsafe(size);
  }
  if (typeof size !== 'number') {
    throw new TypeError('size must be a number');
  }
  if (size > MAX_LEN) {
    throw new RangeError('size is too large');
  }
  return new Buffer(size);
}
exports.from = function from(value, encodingOrOffset, length) {
  if (typeof Buffer.from === 'function' && (!global.Uint8Array || Uint8Array.from !== Buffer.from)) {
    return Buffer.from(value, encodingOrOffset, length);
  }
  if (typeof value === 'number') {
    throw new TypeError('"value" argument must not be a number');
  }
  if (typeof value === 'string') {
    return new Buffer(value, encodingOrOffset);
  }
  if (typeof ArrayBuffer !== 'undefined' && value instanceof ArrayBuffer) {
    var offset = encodingOrOffset;
    if (arguments.length === 1) {
      return new Buffer(value);
    }
    if (typeof offset === 'undefined') {
      offset = 0;
    }
    var len = length;
    if (typeof len === 'undefined') {
      len = value.byteLength - offset;
    }
    if (offset >= value.byteLength) {
      throw new RangeError('\'offset\' is out of bounds');
    }
    if (len > value.byteLength - offset) {
      throw new RangeError('\'length\' is out of bounds');
    }
    return new Buffer(value.slice(offset, offset + len));
  }
  if (Buffer.isBuffer(value)) {
    var out = new Buffer(value.length);
    value.copy(out, 0, 0, value.length);
    return out;
  }
  if (value) {
    if (Array.isArray(value) || (typeof ArrayBuffer !== 'undefined' && value.buffer instanceof ArrayBuffer) || 'length' in value) {
      return new Buffer(value);
    }
    if (value.type === 'Buffer' && Array.isArray(value.data)) {
      return new Buffer(value.data);
    }
  }

  throw new TypeError('First argument must be a string, Buffer, ' + 'ArrayBuffer, Array, or array-like object.');
}
exports.allocUnsafeSlow = function allocUnsafeSlow(size) {
  if (typeof Buffer.allocUnsafeSlow === 'function') {
    return Buffer.allocUnsafeSlow(size);
  }
  if (typeof size !== 'number') {
    throw new TypeError('size must be a number');
  }
  if (size >= MAX_LEN) {
    throw new RangeError('size is too large');
  }
  return new SlowBuffer(size);
}

/* WEBPACK VAR INJECTION */}.call(exports, __webpack_require__(3)))

/***/ }),
/* 7 */
/***/ (function(module, exports) {

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

function EventEmitter() {
  this._events = this._events || {};
  this._maxListeners = this._maxListeners || undefined;
}
module.exports = EventEmitter;

// Backwards-compat with node 0.10.x
EventEmitter.EventEmitter = EventEmitter;

EventEmitter.prototype._events = undefined;
EventEmitter.prototype._maxListeners = undefined;

// By default EventEmitters will print a warning if more than 10 listeners are
// added to it. This is a useful default which helps finding memory leaks.
EventEmitter.defaultMaxListeners = 10;

// Obviously not all Emitters should be limited to 10. This function allows
// that to be increased. Set to zero for unlimited.
EventEmitter.prototype.setMaxListeners = function(n) {
  if (!isNumber(n) || n < 0 || isNaN(n))
    throw TypeError('n must be a positive number');
  this._maxListeners = n;
  return this;
};

EventEmitter.prototype.emit = function(type) {
  var er, handler, len, args, i, listeners;

  if (!this._events)
    this._events = {};

  // If there is no 'error' event listener then throw.
  if (type === 'error') {
    if (!this._events.error ||
        (isObject(this._events.error) && !this._events.error.length)) {
      er = arguments[1];
      if (er instanceof Error) {
        throw er; // Unhandled 'error' event
      } else {
        // At least give some kind of context to the user
        var err = new Error('Uncaught, unspecified "error" event. (' + er + ')');
        err.context = er;
        throw err;
      }
    }
  }

  handler = this._events[type];

  if (isUndefined(handler))
    return false;

  if (isFunction(handler)) {
    switch (arguments.length) {
      // fast cases
      case 1:
        handler.call(this);
        break;
      case 2:
        handler.call(this, arguments[1]);
        break;
      case 3:
        handler.call(this, arguments[1], arguments[2]);
        break;
      // slower
      default:
        args = Array.prototype.slice.call(arguments, 1);
        handler.apply(this, args);
    }
  } else if (isObject(handler)) {
    args = Array.prototype.slice.call(arguments, 1);
    listeners = handler.slice();
    len = listeners.length;
    for (i = 0; i < len; i++)
      listeners[i].apply(this, args);
  }

  return true;
};

EventEmitter.prototype.addListener = function(type, listener) {
  var m;

  if (!isFunction(listener))
    throw TypeError('listener must be a function');

  if (!this._events)
    this._events = {};

  // To avoid recursion in the case that type === "newListener"! Before
  // adding it to the listeners, first emit "newListener".
  if (this._events.newListener)
    this.emit('newListener', type,
              isFunction(listener.listener) ?
              listener.listener : listener);

  if (!this._events[type])
    // Optimize the case of one listener. Don't need the extra array object.
    this._events[type] = listener;
  else if (isObject(this._events[type]))
    // If we've already got an array, just append.
    this._events[type].push(listener);
  else
    // Adding the second element, need to change to array.
    this._events[type] = [this._events[type], listener];

  // Check for listener leak
  if (isObject(this._events[type]) && !this._events[type].warned) {
    if (!isUndefined(this._maxListeners)) {
      m = this._maxListeners;
    } else {
      m = EventEmitter.defaultMaxListeners;
    }

    if (m && m > 0 && this._events[type].length > m) {
      this._events[type].warned = true;
      console.error('(node) warning: possible EventEmitter memory ' +
                    'leak detected. %d listeners added. ' +
                    'Use emitter.setMaxListeners() to increase limit.',
                    this._events[type].length);
      if (typeof console.trace === 'function') {
        // not supported in IE 10
        console.trace();
      }
    }
  }

  return this;
};

EventEmitter.prototype.on = EventEmitter.prototype.addListener;

EventEmitter.prototype.once = function(type, listener) {
  if (!isFunction(listener))
    throw TypeError('listener must be a function');

  var fired = false;

  function g() {
    this.removeListener(type, g);

    if (!fired) {
      fired = true;
      listener.apply(this, arguments);
    }
  }

  g.listener = listener;
  this.on(type, g);

  return this;
};

// emits a 'removeListener' event iff the listener was removed
EventEmitter.prototype.removeListener = function(type, listener) {
  var list, position, length, i;

  if (!isFunction(listener))
    throw TypeError('listener must be a function');

  if (!this._events || !this._events[type])
    return this;

  list = this._events[type];
  length = list.length;
  position = -1;

  if (list === listener ||
      (isFunction(list.listener) && list.listener === listener)) {
    delete this._events[type];
    if (this._events.removeListener)
      this.emit('removeListener', type, listener);

  } else if (isObject(list)) {
    for (i = length; i-- > 0;) {
      if (list[i] === listener ||
          (list[i].listener && list[i].listener === listener)) {
        position = i;
        break;
      }
    }

    if (position < 0)
      return this;

    if (list.length === 1) {
      list.length = 0;
      delete this._events[type];
    } else {
      list.splice(position, 1);
    }

    if (this._events.removeListener)
      this.emit('removeListener', type, listener);
  }

  return this;
};

EventEmitter.prototype.removeAllListeners = function(type) {
  var key, listeners;

  if (!this._events)
    return this;

  // not listening for removeListener, no need to emit
  if (!this._events.removeListener) {
    if (arguments.length === 0)
      this._events = {};
    else if (this._events[type])
      delete this._events[type];
    return this;
  }

  // emit removeListener for all listeners on all events
  if (arguments.length === 0) {
    for (key in this._events) {
      if (key === 'removeListener') continue;
      this.removeAllListeners(key);
    }
    this.removeAllListeners('removeListener');
    this._events = {};
    return this;
  }

  listeners = this._events[type];

  if (isFunction(listeners)) {
    this.removeListener(type, listeners);
  } else if (listeners) {
    // LIFO order
    while (listeners.length)
      this.removeListener(type, listeners[listeners.length - 1]);
  }
  delete this._events[type];

  return this;
};

EventEmitter.prototype.listeners = function(type) {
  var ret;
  if (!this._events || !this._events[type])
    ret = [];
  else if (isFunction(this._events[type]))
    ret = [this._events[type]];
  else
    ret = this._events[type].slice();
  return ret;
};

EventEmitter.prototype.listenerCount = function(type) {
  if (this._events) {
    var evlistener = this._events[type];

    if (isFunction(evlistener))
      return 1;
    else if (evlistener)
      return evlistener.length;
  }
  return 0;
};

EventEmitter.listenerCount = function(emitter, type) {
  return emitter.listenerCount(type);
};

function isFunction(arg) {
  return typeof arg === 'function';
}

function isNumber(arg) {
  return typeof arg === 'number';
}

function isObject(arg) {
  return typeof arg === 'object' && arg !== null;
}

function isUndefined(arg) {
  return arg === void 0;
}


/***/ }),
/* 8 */
/***/ (function(module, exports, __webpack_require__) {

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

var Buffer = __webpack_require__(1).Buffer;

var isBufferEncoding = Buffer.isEncoding
  || function(encoding) {
       switch (encoding && encoding.toLowerCase()) {
         case 'hex': case 'utf8': case 'utf-8': case 'ascii': case 'binary': case 'base64': case 'ucs2': case 'ucs-2': case 'utf16le': case 'utf-16le': case 'raw': return true;
         default: return false;
       }
     }


function assertEncoding(encoding) {
  if (encoding && !isBufferEncoding(encoding)) {
    throw new Error('Unknown encoding: ' + encoding);
  }
}

// StringDecoder provides an interface for efficiently splitting a series of
// buffers into a series of JS strings without breaking apart multi-byte
// characters. CESU-8 is handled as part of the UTF-8 encoding.
//
// @TODO Handling all encodings inside a single object makes it very difficult
// to reason about this code, so it should be split up in the future.
// @TODO There should be a utf8-strict encoding that rejects invalid UTF-8 code
// points as used by CESU-8.
var StringDecoder = exports.StringDecoder = function(encoding) {
  this.encoding = (encoding || 'utf8').toLowerCase().replace(/[-_]/, '');
  assertEncoding(encoding);
  switch (this.encoding) {
    case 'utf8':
      // CESU-8 represents each of Surrogate Pair by 3-bytes
      this.surrogateSize = 3;
      break;
    case 'ucs2':
    case 'utf16le':
      // UTF-16 represents each of Surrogate Pair by 2-bytes
      this.surrogateSize = 2;
      this.detectIncompleteChar = utf16DetectIncompleteChar;
      break;
    case 'base64':
      // Base-64 stores 3 bytes in 4 chars, and pads the remainder.
      this.surrogateSize = 3;
      this.detectIncompleteChar = base64DetectIncompleteChar;
      break;
    default:
      this.write = passThroughWrite;
      return;
  }

  // Enough space to store all bytes of a single character. UTF-8 needs 4
  // bytes, but CESU-8 may require up to 6 (3 bytes per surrogate).
  this.charBuffer = new Buffer(6);
  // Number of bytes received for the current incomplete multi-byte character.
  this.charReceived = 0;
  // Number of bytes expected for the current incomplete multi-byte character.
  this.charLength = 0;
};


// write decodes the given buffer and returns it as JS string that is
// guaranteed to not contain any partial multi-byte characters. Any partial
// character found at the end of the buffer is buffered up, and will be
// returned when calling write again with the remaining bytes.
//
// Note: Converting a Buffer containing an orphan surrogate to a String
// currently works, but converting a String to a Buffer (via `new Buffer`, or
// Buffer#write) will replace incomplete surrogates with the unicode
// replacement character. See https://codereview.chromium.org/121173009/ .
StringDecoder.prototype.write = function(buffer) {
  var charStr = '';
  // if our last write ended with an incomplete multibyte character
  while (this.charLength) {
    // determine how many remaining bytes this buffer has to offer for this char
    var available = (buffer.length >= this.charLength - this.charReceived) ?
        this.charLength - this.charReceived :
        buffer.length;

    // add the new bytes to the char buffer
    buffer.copy(this.charBuffer, this.charReceived, 0, available);
    this.charReceived += available;

    if (this.charReceived < this.charLength) {
      // still not enough chars in this buffer? wait for more ...
      return '';
    }

    // remove bytes belonging to the current character from the buffer
    buffer = buffer.slice(available, buffer.length);

    // get the character that was split
    charStr = this.charBuffer.slice(0, this.charLength).toString(this.encoding);

    // CESU-8: lead surrogate (D800-DBFF) is also the incomplete character
    var charCode = charStr.charCodeAt(charStr.length - 1);
    if (charCode >= 0xD800 && charCode <= 0xDBFF) {
      this.charLength += this.surrogateSize;
      charStr = '';
      continue;
    }
    this.charReceived = this.charLength = 0;

    // if there are no more bytes in this buffer, just emit our char
    if (buffer.length === 0) {
      return charStr;
    }
    break;
  }

  // determine and set charLength / charReceived
  this.detectIncompleteChar(buffer);

  var end = buffer.length;
  if (this.charLength) {
    // buffer the incomplete character bytes we got
    buffer.copy(this.charBuffer, 0, buffer.length - this.charReceived, end);
    end -= this.charReceived;
  }

  charStr += buffer.toString(this.encoding, 0, end);

  var end = charStr.length - 1;
  var charCode = charStr.charCodeAt(end);
  // CESU-8: lead surrogate (D800-DBFF) is also the incomplete character
  if (charCode >= 0xD800 && charCode <= 0xDBFF) {
    var size = this.surrogateSize;
    this.charLength += size;
    this.charReceived += size;
    this.charBuffer.copy(this.charBuffer, size, 0, size);
    buffer.copy(this.charBuffer, 0, 0, size);
    return charStr.substring(0, end);
  }

  // or just emit the charStr
  return charStr;
};

// detectIncompleteChar determines if there is an incomplete UTF-8 character at
// the end of the given buffer. If so, it sets this.charLength to the byte
// length that character, and sets this.charReceived to the number of bytes
// that are available for this character.
StringDecoder.prototype.detectIncompleteChar = function(buffer) {
  // determine how many bytes we have to check at the end of this buffer
  var i = (buffer.length >= 3) ? 3 : buffer.length;

  // Figure out if one of the last i bytes of our buffer announces an
  // incomplete char.
  for (; i > 0; i--) {
    var c = buffer[buffer.length - i];

    // See http://en.wikipedia.org/wiki/UTF-8#Description

    // 110XXXXX
    if (i == 1 && c >> 5 == 0x06) {
      this.charLength = 2;
      break;
    }

    // 1110XXXX
    if (i <= 2 && c >> 4 == 0x0E) {
      this.charLength = 3;
      break;
    }

    // 11110XXX
    if (i <= 3 && c >> 3 == 0x1E) {
      this.charLength = 4;
      break;
    }
  }
  this.charReceived = i;
};

StringDecoder.prototype.end = function(buffer) {
  var res = '';
  if (buffer && buffer.length)
    res = this.write(buffer);

  if (this.charReceived) {
    var cr = this.charReceived;
    var buf = this.charBuffer;
    var enc = this.encoding;
    res += buf.slice(0, cr).toString(enc);
  }

  return res;
};

function passThroughWrite(buffer) {
  return buffer.toString(this.encoding);
}

function utf16DetectIncompleteChar(buffer) {
  this.charReceived = buffer.length % 2;
  this.charLength = this.charReceived ? 2 : 0;
}

function base64DetectIncompleteChar(buffer) {
  this.charReceived = buffer.length % 3;
  this.charLength = this.charReceived ? 3 : 0;
}


/***/ }),
/* 9 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
/* WEBPACK VAR INJECTION */(function(process) {

if (!process.version ||
    process.version.indexOf('v0.') === 0 ||
    process.version.indexOf('v1.') === 0 && process.version.indexOf('v1.8.') !== 0) {
  module.exports = nextTick;
} else {
  module.exports = process.nextTick;
}

function nextTick(fn, arg1, arg2, arg3) {
  if (typeof fn !== 'function') {
    throw new TypeError('"callback" argument must be a function');
  }
  var len = arguments.length;
  var args, i;
  switch (len) {
  case 0:
  case 1:
    return process.nextTick(fn);
  case 2:
    return process.nextTick(function afterTickOne() {
      fn.call(null, arg1);
    });
  case 3:
    return process.nextTick(function afterTickTwo() {
      fn.call(null, arg1, arg2);
    });
  case 4:
    return process.nextTick(function afterTickThree() {
      fn.call(null, arg1, arg2, arg3);
    });
  default:
    args = new Array(len - 1);
    i = 0;
    while (i < args.length) {
      args[i++] = arguments[i];
    }
    return process.nextTick(function afterTick() {
      fn.apply(null, args);
    });
  }
}

/* WEBPACK VAR INJECTION */}.call(exports, __webpack_require__(5)))

/***/ }),
/* 10 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
/* WEBPACK VAR INJECTION */(function(process, setImmediate) {// A bit simpler than readable streams.
// Implement an async ._write(chunk, encoding, cb), and it'll handle all
// the drain event emission and buffering.



module.exports = Writable;

/*<replacement>*/
var processNextTick = __webpack_require__(9);
/*</replacement>*/

/*<replacement>*/
var asyncWrite = !process.browser && ['v0.10', 'v0.9.'].indexOf(process.version.slice(0, 5)) > -1 ? setImmediate : processNextTick;
/*</replacement>*/

/*<replacement>*/
var Duplex;
/*</replacement>*/

Writable.WritableState = WritableState;

/*<replacement>*/
var util = __webpack_require__(4);
util.inherits = __webpack_require__(2);
/*</replacement>*/

/*<replacement>*/
var internalUtil = {
  deprecate: __webpack_require__(45)
};
/*</replacement>*/

/*<replacement>*/
var Stream = __webpack_require__(16);
/*</replacement>*/

var Buffer = __webpack_require__(1).Buffer;
/*<replacement>*/
var bufferShim = __webpack_require__(6);
/*</replacement>*/

util.inherits(Writable, Stream);

function nop() {}

function WriteReq(chunk, encoding, cb) {
  this.chunk = chunk;
  this.encoding = encoding;
  this.callback = cb;
  this.next = null;
}

function WritableState(options, stream) {
  Duplex = Duplex || __webpack_require__(0);

  options = options || {};

  // object stream flag to indicate whether or not this stream
  // contains buffers or objects.
  this.objectMode = !!options.objectMode;

  if (stream instanceof Duplex) this.objectMode = this.objectMode || !!options.writableObjectMode;

  // the point at which write() starts returning false
  // Note: 0 is a valid value, means that we always return false if
  // the entire buffer is not flushed immediately on write()
  var hwm = options.highWaterMark;
  var defaultHwm = this.objectMode ? 16 : 16 * 1024;
  this.highWaterMark = hwm || hwm === 0 ? hwm : defaultHwm;

  // cast to ints.
  this.highWaterMark = ~~this.highWaterMark;

  // drain event flag.
  this.needDrain = false;
  // at the start of calling end()
  this.ending = false;
  // when end() has been called, and returned
  this.ended = false;
  // when 'finish' is emitted
  this.finished = false;

  // should we decode strings into buffers before passing to _write?
  // this is here so that some node-core streams can optimize string
  // handling at a lower level.
  var noDecode = options.decodeStrings === false;
  this.decodeStrings = !noDecode;

  // Crypto is kind of old and crusty.  Historically, its default string
  // encoding is 'binary' so we have to make this configurable.
  // Everything else in the universe uses 'utf8', though.
  this.defaultEncoding = options.defaultEncoding || 'utf8';

  // not an actual buffer we keep track of, but a measurement
  // of how much we're waiting to get pushed to some underlying
  // socket or file.
  this.length = 0;

  // a flag to see when we're in the middle of a write.
  this.writing = false;

  // when true all writes will be buffered until .uncork() call
  this.corked = 0;

  // a flag to be able to tell if the onwrite cb is called immediately,
  // or on a later tick.  We set this to true at first, because any
  // actions that shouldn't happen until "later" should generally also
  // not happen before the first write call.
  this.sync = true;

  // a flag to know if we're processing previously buffered items, which
  // may call the _write() callback in the same tick, so that we don't
  // end up in an overlapped onwrite situation.
  this.bufferProcessing = false;

  // the callback that's passed to _write(chunk,cb)
  this.onwrite = function (er) {
    onwrite(stream, er);
  };

  // the callback that the user supplies to write(chunk,encoding,cb)
  this.writecb = null;

  // the amount that is being written when _write is called.
  this.writelen = 0;

  this.bufferedRequest = null;
  this.lastBufferedRequest = null;

  // number of pending user-supplied write callbacks
  // this must be 0 before 'finish' can be emitted
  this.pendingcb = 0;

  // emit prefinish if the only thing we're waiting for is _write cbs
  // This is relevant for synchronous Transform streams
  this.prefinished = false;

  // True if the error was already emitted and should not be thrown again
  this.errorEmitted = false;

  // count buffered requests
  this.bufferedRequestCount = 0;

  // allocate the first CorkedRequest, there is always
  // one allocated and free to use, and we maintain at most two
  this.corkedRequestsFree = new CorkedRequest(this);
}

WritableState.prototype.getBuffer = function getBuffer() {
  var current = this.bufferedRequest;
  var out = [];
  while (current) {
    out.push(current);
    current = current.next;
  }
  return out;
};

(function () {
  try {
    Object.defineProperty(WritableState.prototype, 'buffer', {
      get: internalUtil.deprecate(function () {
        return this.getBuffer();
      }, '_writableState.buffer is deprecated. Use _writableState.getBuffer ' + 'instead.')
    });
  } catch (_) {}
})();

// Test _writableState for inheritance to account for Duplex streams,
// whose prototype chain only points to Readable.
var realHasInstance;
if (typeof Symbol === 'function' && Symbol.hasInstance && typeof Function.prototype[Symbol.hasInstance] === 'function') {
  realHasInstance = Function.prototype[Symbol.hasInstance];
  Object.defineProperty(Writable, Symbol.hasInstance, {
    value: function (object) {
      if (realHasInstance.call(this, object)) return true;

      return object && object._writableState instanceof WritableState;
    }
  });
} else {
  realHasInstance = function (object) {
    return object instanceof this;
  };
}

function Writable(options) {
  Duplex = Duplex || __webpack_require__(0);

  // Writable ctor is applied to Duplexes, too.
  // `realHasInstance` is necessary because using plain `instanceof`
  // would return false, as no `_writableState` property is attached.

  // Trying to use the custom `instanceof` for Writable here will also break the
  // Node.js LazyTransform implementation, which has a non-trivial getter for
  // `_writableState` that would lead to infinite recursion.
  if (!realHasInstance.call(Writable, this) && !(this instanceof Duplex)) {
    return new Writable(options);
  }

  this._writableState = new WritableState(options, this);

  // legacy.
  this.writable = true;

  if (options) {
    if (typeof options.write === 'function') this._write = options.write;

    if (typeof options.writev === 'function') this._writev = options.writev;
  }

  Stream.call(this);
}

// Otherwise people can pipe Writable streams, which is just wrong.
Writable.prototype.pipe = function () {
  this.emit('error', new Error('Cannot pipe, not readable'));
};

function writeAfterEnd(stream, cb) {
  var er = new Error('write after end');
  // TODO: defer error events consistently everywhere, not just the cb
  stream.emit('error', er);
  processNextTick(cb, er);
}

// Checks that a user-supplied chunk is valid, especially for the particular
// mode the stream is in. Currently this means that `null` is never accepted
// and undefined/non-string values are only allowed in object mode.
function validChunk(stream, state, chunk, cb) {
  var valid = true;
  var er = false;

  if (chunk === null) {
    er = new TypeError('May not write null values to stream');
  } else if (typeof chunk !== 'string' && chunk !== undefined && !state.objectMode) {
    er = new TypeError('Invalid non-string/buffer chunk');
  }
  if (er) {
    stream.emit('error', er);
    processNextTick(cb, er);
    valid = false;
  }
  return valid;
}

Writable.prototype.write = function (chunk, encoding, cb) {
  var state = this._writableState;
  var ret = false;
  var isBuf = Buffer.isBuffer(chunk);

  if (typeof encoding === 'function') {
    cb = encoding;
    encoding = null;
  }

  if (isBuf) encoding = 'buffer';else if (!encoding) encoding = state.defaultEncoding;

  if (typeof cb !== 'function') cb = nop;

  if (state.ended) writeAfterEnd(this, cb);else if (isBuf || validChunk(this, state, chunk, cb)) {
    state.pendingcb++;
    ret = writeOrBuffer(this, state, isBuf, chunk, encoding, cb);
  }

  return ret;
};

Writable.prototype.cork = function () {
  var state = this._writableState;

  state.corked++;
};

Writable.prototype.uncork = function () {
  var state = this._writableState;

  if (state.corked) {
    state.corked--;

    if (!state.writing && !state.corked && !state.finished && !state.bufferProcessing && state.bufferedRequest) clearBuffer(this, state);
  }
};

Writable.prototype.setDefaultEncoding = function setDefaultEncoding(encoding) {
  // node::ParseEncoding() requires lower case.
  if (typeof encoding === 'string') encoding = encoding.toLowerCase();
  if (!(['hex', 'utf8', 'utf-8', 'ascii', 'binary', 'base64', 'ucs2', 'ucs-2', 'utf16le', 'utf-16le', 'raw'].indexOf((encoding + '').toLowerCase()) > -1)) throw new TypeError('Unknown encoding: ' + encoding);
  this._writableState.defaultEncoding = encoding;
  return this;
};

function decodeChunk(state, chunk, encoding) {
  if (!state.objectMode && state.decodeStrings !== false && typeof chunk === 'string') {
    chunk = bufferShim.from(chunk, encoding);
  }
  return chunk;
}

// if we're already writing something, then just put this
// in the queue, and wait our turn.  Otherwise, call _write
// If we return false, then we need a drain event, so set that flag.
function writeOrBuffer(stream, state, isBuf, chunk, encoding, cb) {
  if (!isBuf) {
    chunk = decodeChunk(state, chunk, encoding);
    if (Buffer.isBuffer(chunk)) encoding = 'buffer';
  }
  var len = state.objectMode ? 1 : chunk.length;

  state.length += len;

  var ret = state.length < state.highWaterMark;
  // we must ensure that previous needDrain will not be reset to false.
  if (!ret) state.needDrain = true;

  if (state.writing || state.corked) {
    var last = state.lastBufferedRequest;
    state.lastBufferedRequest = new WriteReq(chunk, encoding, cb);
    if (last) {
      last.next = state.lastBufferedRequest;
    } else {
      state.bufferedRequest = state.lastBufferedRequest;
    }
    state.bufferedRequestCount += 1;
  } else {
    doWrite(stream, state, false, len, chunk, encoding, cb);
  }

  return ret;
}

function doWrite(stream, state, writev, len, chunk, encoding, cb) {
  state.writelen = len;
  state.writecb = cb;
  state.writing = true;
  state.sync = true;
  if (writev) stream._writev(chunk, state.onwrite);else stream._write(chunk, encoding, state.onwrite);
  state.sync = false;
}

function onwriteError(stream, state, sync, er, cb) {
  --state.pendingcb;
  if (sync) processNextTick(cb, er);else cb(er);

  stream._writableState.errorEmitted = true;
  stream.emit('error', er);
}

function onwriteStateUpdate(state) {
  state.writing = false;
  state.writecb = null;
  state.length -= state.writelen;
  state.writelen = 0;
}

function onwrite(stream, er) {
  var state = stream._writableState;
  var sync = state.sync;
  var cb = state.writecb;

  onwriteStateUpdate(state);

  if (er) onwriteError(stream, state, sync, er, cb);else {
    // Check if we're actually ready to finish, but don't emit yet
    var finished = needFinish(state);

    if (!finished && !state.corked && !state.bufferProcessing && state.bufferedRequest) {
      clearBuffer(stream, state);
    }

    if (sync) {
      /*<replacement>*/
      asyncWrite(afterWrite, stream, state, finished, cb);
      /*</replacement>*/
    } else {
      afterWrite(stream, state, finished, cb);
    }
  }
}

function afterWrite(stream, state, finished, cb) {
  if (!finished) onwriteDrain(stream, state);
  state.pendingcb--;
  cb();
  finishMaybe(stream, state);
}

// Must force callback to be called on nextTick, so that we don't
// emit 'drain' before the write() consumer gets the 'false' return
// value, and has a chance to attach a 'drain' listener.
function onwriteDrain(stream, state) {
  if (state.length === 0 && state.needDrain) {
    state.needDrain = false;
    stream.emit('drain');
  }
}

// if there's something in the buffer waiting, then process it
function clearBuffer(stream, state) {
  state.bufferProcessing = true;
  var entry = state.bufferedRequest;

  if (stream._writev && entry && entry.next) {
    // Fast case, write everything using _writev()
    var l = state.bufferedRequestCount;
    var buffer = new Array(l);
    var holder = state.corkedRequestsFree;
    holder.entry = entry;

    var count = 0;
    while (entry) {
      buffer[count] = entry;
      entry = entry.next;
      count += 1;
    }

    doWrite(stream, state, true, state.length, buffer, '', holder.finish);

    // doWrite is almost always async, defer these to save a bit of time
    // as the hot path ends with doWrite
    state.pendingcb++;
    state.lastBufferedRequest = null;
    if (holder.next) {
      state.corkedRequestsFree = holder.next;
      holder.next = null;
    } else {
      state.corkedRequestsFree = new CorkedRequest(state);
    }
  } else {
    // Slow case, write chunks one-by-one
    while (entry) {
      var chunk = entry.chunk;
      var encoding = entry.encoding;
      var cb = entry.callback;
      var len = state.objectMode ? 1 : chunk.length;

      doWrite(stream, state, false, len, chunk, encoding, cb);
      entry = entry.next;
      // if we didn't call the onwrite immediately, then
      // it means that we need to wait until it does.
      // also, that means that the chunk and cb are currently
      // being processed, so move the buffer counter past them.
      if (state.writing) {
        break;
      }
    }

    if (entry === null) state.lastBufferedRequest = null;
  }

  state.bufferedRequestCount = 0;
  state.bufferedRequest = entry;
  state.bufferProcessing = false;
}

Writable.prototype._write = function (chunk, encoding, cb) {
  cb(new Error('_write() is not implemented'));
};

Writable.prototype._writev = null;

Writable.prototype.end = function (chunk, encoding, cb) {
  var state = this._writableState;

  if (typeof chunk === 'function') {
    cb = chunk;
    chunk = null;
    encoding = null;
  } else if (typeof encoding === 'function') {
    cb = encoding;
    encoding = null;
  }

  if (chunk !== null && chunk !== undefined) this.write(chunk, encoding);

  // .end() fully uncorks
  if (state.corked) {
    state.corked = 1;
    this.uncork();
  }

  // ignore unnecessary end() calls.
  if (!state.ending && !state.finished) endWritable(this, state, cb);
};

function needFinish(state) {
  return state.ending && state.length === 0 && state.bufferedRequest === null && !state.finished && !state.writing;
}

function prefinish(stream, state) {
  if (!state.prefinished) {
    state.prefinished = true;
    stream.emit('prefinish');
  }
}

function finishMaybe(stream, state) {
  var need = needFinish(state);
  if (need) {
    if (state.pendingcb === 0) {
      prefinish(stream, state);
      state.finished = true;
      stream.emit('finish');
    } else {
      prefinish(stream, state);
    }
  }
  return need;
}

function endWritable(stream, state, cb) {
  state.ending = true;
  finishMaybe(stream, state);
  if (cb) {
    if (state.finished) processNextTick(cb);else stream.once('finish', cb);
  }
  state.ended = true;
  stream.writable = false;
}

// It seems a linked list but it is not
// there will be only 2 of these for each stream
function CorkedRequest(state) {
  var _this = this;

  this.next = null;
  this.entry = null;
  this.finish = function (err) {
    var entry = _this.entry;
    _this.entry = null;
    while (entry) {
      var cb = entry.callback;
      state.pendingcb--;
      cb(err);
      entry = entry.next;
    }
    if (state.corkedRequestsFree) {
      state.corkedRequestsFree.next = _this;
    } else {
      state.corkedRequestsFree = _this;
    }
  };
}
/* WEBPACK VAR INJECTION */}.call(exports, __webpack_require__(5), __webpack_require__(43).setImmediate))

/***/ }),
/* 11 */
/***/ (function(module, exports, __webpack_require__) {

exports = module.exports = __webpack_require__(14);
exports.Stream = exports;
exports.Readable = exports;
exports.Writable = __webpack_require__(10);
exports.Duplex = __webpack_require__(0);
exports.Transform = __webpack_require__(15);
exports.PassThrough = __webpack_require__(34);


/***/ }),
/* 12 */
/***/ (function(module, exports) {

module.exports = isFunction

var toString = Object.prototype.toString

function isFunction (fn) {
  var string = toString.call(fn)
  return string === '[object Function]' ||
    (typeof fn === 'function' && string !== '[object RegExp]') ||
    (typeof window !== 'undefined' &&
     // IE8 and below
     (fn === window.setTimeout ||
      fn === window.alert ||
      fn === window.confirm ||
      fn === window.prompt))
};


/***/ }),
/* 13 */
/***/ (function(module, exports) {

var toString = {}.toString;

module.exports = Array.isArray || function (arr) {
  return toString.call(arr) == '[object Array]';
};


/***/ }),
/* 14 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
/* WEBPACK VAR INJECTION */(function(process) {

module.exports = Readable;

/*<replacement>*/
var processNextTick = __webpack_require__(9);
/*</replacement>*/

/*<replacement>*/
var isArray = __webpack_require__(13);
/*</replacement>*/

/*<replacement>*/
var Duplex;
/*</replacement>*/

Readable.ReadableState = ReadableState;

/*<replacement>*/
var EE = __webpack_require__(7).EventEmitter;

var EElistenerCount = function (emitter, type) {
  return emitter.listeners(type).length;
};
/*</replacement>*/

/*<replacement>*/
var Stream = __webpack_require__(16);
/*</replacement>*/

var Buffer = __webpack_require__(1).Buffer;
/*<replacement>*/
var bufferShim = __webpack_require__(6);
/*</replacement>*/

/*<replacement>*/
var util = __webpack_require__(4);
util.inherits = __webpack_require__(2);
/*</replacement>*/

/*<replacement>*/
var debugUtil = __webpack_require__(54);
var debug = void 0;
if (debugUtil && debugUtil.debuglog) {
  debug = debugUtil.debuglog('stream');
} else {
  debug = function () {};
}
/*</replacement>*/

var BufferList = __webpack_require__(35);
var StringDecoder;

util.inherits(Readable, Stream);

var kProxyEvents = ['error', 'close', 'destroy', 'pause', 'resume'];

function prependListener(emitter, event, fn) {
  // Sadly this is not cacheable as some libraries bundle their own
  // event emitter implementation with them.
  if (typeof emitter.prependListener === 'function') {
    return emitter.prependListener(event, fn);
  } else {
    // This is a hack to make sure that our error handler is attached before any
    // userland ones.  NEVER DO THIS. This is here only because this code needs
    // to continue to work with older versions of Node.js that do not include
    // the prependListener() method. The goal is to eventually remove this hack.
    if (!emitter._events || !emitter._events[event]) emitter.on(event, fn);else if (isArray(emitter._events[event])) emitter._events[event].unshift(fn);else emitter._events[event] = [fn, emitter._events[event]];
  }
}

function ReadableState(options, stream) {
  Duplex = Duplex || __webpack_require__(0);

  options = options || {};

  // object stream flag. Used to make read(n) ignore n and to
  // make all the buffer merging and length checks go away
  this.objectMode = !!options.objectMode;

  if (stream instanceof Duplex) this.objectMode = this.objectMode || !!options.readableObjectMode;

  // the point at which it stops calling _read() to fill the buffer
  // Note: 0 is a valid value, means "don't call _read preemptively ever"
  var hwm = options.highWaterMark;
  var defaultHwm = this.objectMode ? 16 : 16 * 1024;
  this.highWaterMark = hwm || hwm === 0 ? hwm : defaultHwm;

  // cast to ints.
  this.highWaterMark = ~~this.highWaterMark;

  // A linked list is used to store data chunks instead of an array because the
  // linked list can remove elements from the beginning faster than
  // array.shift()
  this.buffer = new BufferList();
  this.length = 0;
  this.pipes = null;
  this.pipesCount = 0;
  this.flowing = null;
  this.ended = false;
  this.endEmitted = false;
  this.reading = false;

  // a flag to be able to tell if the onwrite cb is called immediately,
  // or on a later tick.  We set this to true at first, because any
  // actions that shouldn't happen until "later" should generally also
  // not happen before the first write call.
  this.sync = true;

  // whenever we return null, then we set a flag to say
  // that we're awaiting a 'readable' event emission.
  this.needReadable = false;
  this.emittedReadable = false;
  this.readableListening = false;
  this.resumeScheduled = false;

  // Crypto is kind of old and crusty.  Historically, its default string
  // encoding is 'binary' so we have to make this configurable.
  // Everything else in the universe uses 'utf8', though.
  this.defaultEncoding = options.defaultEncoding || 'utf8';

  // when piping, we only care about 'readable' events that happen
  // after read()ing all the bytes and not getting any pushback.
  this.ranOut = false;

  // the number of writers that are awaiting a drain event in .pipe()s
  this.awaitDrain = 0;

  // if true, a maybeReadMore has been scheduled
  this.readingMore = false;

  this.decoder = null;
  this.encoding = null;
  if (options.encoding) {
    if (!StringDecoder) StringDecoder = __webpack_require__(8).StringDecoder;
    this.decoder = new StringDecoder(options.encoding);
    this.encoding = options.encoding;
  }
}

function Readable(options) {
  Duplex = Duplex || __webpack_require__(0);

  if (!(this instanceof Readable)) return new Readable(options);

  this._readableState = new ReadableState(options, this);

  // legacy
  this.readable = true;

  if (options && typeof options.read === 'function') this._read = options.read;

  Stream.call(this);
}

// Manually shove something into the read() buffer.
// This returns true if the highWaterMark has not been hit yet,
// similar to how Writable.write() returns true if you should
// write() some more.
Readable.prototype.push = function (chunk, encoding) {
  var state = this._readableState;

  if (!state.objectMode && typeof chunk === 'string') {
    encoding = encoding || state.defaultEncoding;
    if (encoding !== state.encoding) {
      chunk = bufferShim.from(chunk, encoding);
      encoding = '';
    }
  }

  return readableAddChunk(this, state, chunk, encoding, false);
};

// Unshift should *always* be something directly out of read()
Readable.prototype.unshift = function (chunk) {
  var state = this._readableState;
  return readableAddChunk(this, state, chunk, '', true);
};

Readable.prototype.isPaused = function () {
  return this._readableState.flowing === false;
};

function readableAddChunk(stream, state, chunk, encoding, addToFront) {
  var er = chunkInvalid(state, chunk);
  if (er) {
    stream.emit('error', er);
  } else if (chunk === null) {
    state.reading = false;
    onEofChunk(stream, state);
  } else if (state.objectMode || chunk && chunk.length > 0) {
    if (state.ended && !addToFront) {
      var e = new Error('stream.push() after EOF');
      stream.emit('error', e);
    } else if (state.endEmitted && addToFront) {
      var _e = new Error('stream.unshift() after end event');
      stream.emit('error', _e);
    } else {
      var skipAdd;
      if (state.decoder && !addToFront && !encoding) {
        chunk = state.decoder.write(chunk);
        skipAdd = !state.objectMode && chunk.length === 0;
      }

      if (!addToFront) state.reading = false;

      // Don't add to the buffer if we've decoded to an empty string chunk and
      // we're not in object mode
      if (!skipAdd) {
        // if we want the data now, just emit it.
        if (state.flowing && state.length === 0 && !state.sync) {
          stream.emit('data', chunk);
          stream.read(0);
        } else {
          // update the buffer info.
          state.length += state.objectMode ? 1 : chunk.length;
          if (addToFront) state.buffer.unshift(chunk);else state.buffer.push(chunk);

          if (state.needReadable) emitReadable(stream);
        }
      }

      maybeReadMore(stream, state);
    }
  } else if (!addToFront) {
    state.reading = false;
  }

  return needMoreData(state);
}

// if it's past the high water mark, we can push in some more.
// Also, if we have no data yet, we can stand some
// more bytes.  This is to work around cases where hwm=0,
// such as the repl.  Also, if the push() triggered a
// readable event, and the user called read(largeNumber) such that
// needReadable was set, then we ought to push more, so that another
// 'readable' event will be triggered.
function needMoreData(state) {
  return !state.ended && (state.needReadable || state.length < state.highWaterMark || state.length === 0);
}

// backwards compatibility.
Readable.prototype.setEncoding = function (enc) {
  if (!StringDecoder) StringDecoder = __webpack_require__(8).StringDecoder;
  this._readableState.decoder = new StringDecoder(enc);
  this._readableState.encoding = enc;
  return this;
};

// Don't raise the hwm > 8MB
var MAX_HWM = 0x800000;
function computeNewHighWaterMark(n) {
  if (n >= MAX_HWM) {
    n = MAX_HWM;
  } else {
    // Get the next highest power of 2 to prevent increasing hwm excessively in
    // tiny amounts
    n--;
    n |= n >>> 1;
    n |= n >>> 2;
    n |= n >>> 4;
    n |= n >>> 8;
    n |= n >>> 16;
    n++;
  }
  return n;
}

// This function is designed to be inlinable, so please take care when making
// changes to the function body.
function howMuchToRead(n, state) {
  if (n <= 0 || state.length === 0 && state.ended) return 0;
  if (state.objectMode) return 1;
  if (n !== n) {
    // Only flow one buffer at a time
    if (state.flowing && state.length) return state.buffer.head.data.length;else return state.length;
  }
  // If we're asking for more than the current hwm, then raise the hwm.
  if (n > state.highWaterMark) state.highWaterMark = computeNewHighWaterMark(n);
  if (n <= state.length) return n;
  // Don't have enough
  if (!state.ended) {
    state.needReadable = true;
    return 0;
  }
  return state.length;
}

// you can override either this method, or the async _read(n) below.
Readable.prototype.read = function (n) {
  debug('read', n);
  n = parseInt(n, 10);
  var state = this._readableState;
  var nOrig = n;

  if (n !== 0) state.emittedReadable = false;

  // if we're doing read(0) to trigger a readable event, but we
  // already have a bunch of data in the buffer, then just trigger
  // the 'readable' event and move on.
  if (n === 0 && state.needReadable && (state.length >= state.highWaterMark || state.ended)) {
    debug('read: emitReadable', state.length, state.ended);
    if (state.length === 0 && state.ended) endReadable(this);else emitReadable(this);
    return null;
  }

  n = howMuchToRead(n, state);

  // if we've ended, and we're now clear, then finish it up.
  if (n === 0 && state.ended) {
    if (state.length === 0) endReadable(this);
    return null;
  }

  // All the actual chunk generation logic needs to be
  // *below* the call to _read.  The reason is that in certain
  // synthetic stream cases, such as passthrough streams, _read
  // may be a completely synchronous operation which may change
  // the state of the read buffer, providing enough data when
  // before there was *not* enough.
  //
  // So, the steps are:
  // 1. Figure out what the state of things will be after we do
  // a read from the buffer.
  //
  // 2. If that resulting state will trigger a _read, then call _read.
  // Note that this may be asynchronous, or synchronous.  Yes, it is
  // deeply ugly to write APIs this way, but that still doesn't mean
  // that the Readable class should behave improperly, as streams are
  // designed to be sync/async agnostic.
  // Take note if the _read call is sync or async (ie, if the read call
  // has returned yet), so that we know whether or not it's safe to emit
  // 'readable' etc.
  //
  // 3. Actually pull the requested chunks out of the buffer and return.

  // if we need a readable event, then we need to do some reading.
  var doRead = state.needReadable;
  debug('need readable', doRead);

  // if we currently have less than the highWaterMark, then also read some
  if (state.length === 0 || state.length - n < state.highWaterMark) {
    doRead = true;
    debug('length less than watermark', doRead);
  }

  // however, if we've ended, then there's no point, and if we're already
  // reading, then it's unnecessary.
  if (state.ended || state.reading) {
    doRead = false;
    debug('reading or ended', doRead);
  } else if (doRead) {
    debug('do read');
    state.reading = true;
    state.sync = true;
    // if the length is currently zero, then we *need* a readable event.
    if (state.length === 0) state.needReadable = true;
    // call internal read method
    this._read(state.highWaterMark);
    state.sync = false;
    // If _read pushed data synchronously, then `reading` will be false,
    // and we need to re-evaluate how much data we can return to the user.
    if (!state.reading) n = howMuchToRead(nOrig, state);
  }

  var ret;
  if (n > 0) ret = fromList(n, state);else ret = null;

  if (ret === null) {
    state.needReadable = true;
    n = 0;
  } else {
    state.length -= n;
  }

  if (state.length === 0) {
    // If we have nothing in the buffer, then we want to know
    // as soon as we *do* get something into the buffer.
    if (!state.ended) state.needReadable = true;

    // If we tried to read() past the EOF, then emit end on the next tick.
    if (nOrig !== n && state.ended) endReadable(this);
  }

  if (ret !== null) this.emit('data', ret);

  return ret;
};

function chunkInvalid(state, chunk) {
  var er = null;
  if (!Buffer.isBuffer(chunk) && typeof chunk !== 'string' && chunk !== null && chunk !== undefined && !state.objectMode) {
    er = new TypeError('Invalid non-string/buffer chunk');
  }
  return er;
}

function onEofChunk(stream, state) {
  if (state.ended) return;
  if (state.decoder) {
    var chunk = state.decoder.end();
    if (chunk && chunk.length) {
      state.buffer.push(chunk);
      state.length += state.objectMode ? 1 : chunk.length;
    }
  }
  state.ended = true;

  // emit 'readable' now to make sure it gets picked up.
  emitReadable(stream);
}

// Don't emit readable right away in sync mode, because this can trigger
// another read() call => stack overflow.  This way, it might trigger
// a nextTick recursion warning, but that's not so bad.
function emitReadable(stream) {
  var state = stream._readableState;
  state.needReadable = false;
  if (!state.emittedReadable) {
    debug('emitReadable', state.flowing);
    state.emittedReadable = true;
    if (state.sync) processNextTick(emitReadable_, stream);else emitReadable_(stream);
  }
}

function emitReadable_(stream) {
  debug('emit readable');
  stream.emit('readable');
  flow(stream);
}

// at this point, the user has presumably seen the 'readable' event,
// and called read() to consume some data.  that may have triggered
// in turn another _read(n) call, in which case reading = true if
// it's in progress.
// However, if we're not ended, or reading, and the length < hwm,
// then go ahead and try to read some more preemptively.
function maybeReadMore(stream, state) {
  if (!state.readingMore) {
    state.readingMore = true;
    processNextTick(maybeReadMore_, stream, state);
  }
}

function maybeReadMore_(stream, state) {
  var len = state.length;
  while (!state.reading && !state.flowing && !state.ended && state.length < state.highWaterMark) {
    debug('maybeReadMore read 0');
    stream.read(0);
    if (len === state.length)
      // didn't get any data, stop spinning.
      break;else len = state.length;
  }
  state.readingMore = false;
}

// abstract method.  to be overridden in specific implementation classes.
// call cb(er, data) where data is <= n in length.
// for virtual (non-string, non-buffer) streams, "length" is somewhat
// arbitrary, and perhaps not very meaningful.
Readable.prototype._read = function (n) {
  this.emit('error', new Error('_read() is not implemented'));
};

Readable.prototype.pipe = function (dest, pipeOpts) {
  var src = this;
  var state = this._readableState;

  switch (state.pipesCount) {
    case 0:
      state.pipes = dest;
      break;
    case 1:
      state.pipes = [state.pipes, dest];
      break;
    default:
      state.pipes.push(dest);
      break;
  }
  state.pipesCount += 1;
  debug('pipe count=%d opts=%j', state.pipesCount, pipeOpts);

  var doEnd = (!pipeOpts || pipeOpts.end !== false) && dest !== process.stdout && dest !== process.stderr;

  var endFn = doEnd ? onend : cleanup;
  if (state.endEmitted) processNextTick(endFn);else src.once('end', endFn);

  dest.on('unpipe', onunpipe);
  function onunpipe(readable) {
    debug('onunpipe');
    if (readable === src) {
      cleanup();
    }
  }

  function onend() {
    debug('onend');
    dest.end();
  }

  // when the dest drains, it reduces the awaitDrain counter
  // on the source.  This would be more elegant with a .once()
  // handler in flow(), but adding and removing repeatedly is
  // too slow.
  var ondrain = pipeOnDrain(src);
  dest.on('drain', ondrain);

  var cleanedUp = false;
  function cleanup() {
    debug('cleanup');
    // cleanup event handlers once the pipe is broken
    dest.removeListener('close', onclose);
    dest.removeListener('finish', onfinish);
    dest.removeListener('drain', ondrain);
    dest.removeListener('error', onerror);
    dest.removeListener('unpipe', onunpipe);
    src.removeListener('end', onend);
    src.removeListener('end', cleanup);
    src.removeListener('data', ondata);

    cleanedUp = true;

    // if the reader is waiting for a drain event from this
    // specific writer, then it would cause it to never start
    // flowing again.
    // So, if this is awaiting a drain, then we just call it now.
    // If we don't know, then assume that we are waiting for one.
    if (state.awaitDrain && (!dest._writableState || dest._writableState.needDrain)) ondrain();
  }

  // If the user pushes more data while we're writing to dest then we'll end up
  // in ondata again. However, we only want to increase awaitDrain once because
  // dest will only emit one 'drain' event for the multiple writes.
  // => Introduce a guard on increasing awaitDrain.
  var increasedAwaitDrain = false;
  src.on('data', ondata);
  function ondata(chunk) {
    debug('ondata');
    increasedAwaitDrain = false;
    var ret = dest.write(chunk);
    if (false === ret && !increasedAwaitDrain) {
      // If the user unpiped during `dest.write()`, it is possible
      // to get stuck in a permanently paused state if that write
      // also returned false.
      // => Check whether `dest` is still a piping destination.
      if ((state.pipesCount === 1 && state.pipes === dest || state.pipesCount > 1 && indexOf(state.pipes, dest) !== -1) && !cleanedUp) {
        debug('false write response, pause', src._readableState.awaitDrain);
        src._readableState.awaitDrain++;
        increasedAwaitDrain = true;
      }
      src.pause();
    }
  }

  // if the dest has an error, then stop piping into it.
  // however, don't suppress the throwing behavior for this.
  function onerror(er) {
    debug('onerror', er);
    unpipe();
    dest.removeListener('error', onerror);
    if (EElistenerCount(dest, 'error') === 0) dest.emit('error', er);
  }

  // Make sure our error handler is attached before userland ones.
  prependListener(dest, 'error', onerror);

  // Both close and finish should trigger unpipe, but only once.
  function onclose() {
    dest.removeListener('finish', onfinish);
    unpipe();
  }
  dest.once('close', onclose);
  function onfinish() {
    debug('onfinish');
    dest.removeListener('close', onclose);
    unpipe();
  }
  dest.once('finish', onfinish);

  function unpipe() {
    debug('unpipe');
    src.unpipe(dest);
  }

  // tell the dest that it's being piped to
  dest.emit('pipe', src);

  // start the flow if it hasn't been started already.
  if (!state.flowing) {
    debug('pipe resume');
    src.resume();
  }

  return dest;
};

function pipeOnDrain(src) {
  return function () {
    var state = src._readableState;
    debug('pipeOnDrain', state.awaitDrain);
    if (state.awaitDrain) state.awaitDrain--;
    if (state.awaitDrain === 0 && EElistenerCount(src, 'data')) {
      state.flowing = true;
      flow(src);
    }
  };
}

Readable.prototype.unpipe = function (dest) {
  var state = this._readableState;

  // if we're not piping anywhere, then do nothing.
  if (state.pipesCount === 0) return this;

  // just one destination.  most common case.
  if (state.pipesCount === 1) {
    // passed in one, but it's not the right one.
    if (dest && dest !== state.pipes) return this;

    if (!dest) dest = state.pipes;

    // got a match.
    state.pipes = null;
    state.pipesCount = 0;
    state.flowing = false;
    if (dest) dest.emit('unpipe', this);
    return this;
  }

  // slow case. multiple pipe destinations.

  if (!dest) {
    // remove all.
    var dests = state.pipes;
    var len = state.pipesCount;
    state.pipes = null;
    state.pipesCount = 0;
    state.flowing = false;

    for (var i = 0; i < len; i++) {
      dests[i].emit('unpipe', this);
    }return this;
  }

  // try to find the right one.
  var index = indexOf(state.pipes, dest);
  if (index === -1) return this;

  state.pipes.splice(index, 1);
  state.pipesCount -= 1;
  if (state.pipesCount === 1) state.pipes = state.pipes[0];

  dest.emit('unpipe', this);

  return this;
};

// set up data events if they are asked for
// Ensure readable listeners eventually get something
Readable.prototype.on = function (ev, fn) {
  var res = Stream.prototype.on.call(this, ev, fn);

  if (ev === 'data') {
    // Start flowing on next tick if stream isn't explicitly paused
    if (this._readableState.flowing !== false) this.resume();
  } else if (ev === 'readable') {
    var state = this._readableState;
    if (!state.endEmitted && !state.readableListening) {
      state.readableListening = state.needReadable = true;
      state.emittedReadable = false;
      if (!state.reading) {
        processNextTick(nReadingNextTick, this);
      } else if (state.length) {
        emitReadable(this, state);
      }
    }
  }

  return res;
};
Readable.prototype.addListener = Readable.prototype.on;

function nReadingNextTick(self) {
  debug('readable nexttick read 0');
  self.read(0);
}

// pause() and resume() are remnants of the legacy readable stream API
// If the user uses them, then switch into old mode.
Readable.prototype.resume = function () {
  var state = this._readableState;
  if (!state.flowing) {
    debug('resume');
    state.flowing = true;
    resume(this, state);
  }
  return this;
};

function resume(stream, state) {
  if (!state.resumeScheduled) {
    state.resumeScheduled = true;
    processNextTick(resume_, stream, state);
  }
}

function resume_(stream, state) {
  if (!state.reading) {
    debug('resume read 0');
    stream.read(0);
  }

  state.resumeScheduled = false;
  state.awaitDrain = 0;
  stream.emit('resume');
  flow(stream);
  if (state.flowing && !state.reading) stream.read(0);
}

Readable.prototype.pause = function () {
  debug('call pause flowing=%j', this._readableState.flowing);
  if (false !== this._readableState.flowing) {
    debug('pause');
    this._readableState.flowing = false;
    this.emit('pause');
  }
  return this;
};

function flow(stream) {
  var state = stream._readableState;
  debug('flow', state.flowing);
  while (state.flowing && stream.read() !== null) {}
}

// wrap an old-style stream as the async data source.
// This is *not* part of the readable stream interface.
// It is an ugly unfortunate mess of history.
Readable.prototype.wrap = function (stream) {
  var state = this._readableState;
  var paused = false;

  var self = this;
  stream.on('end', function () {
    debug('wrapped end');
    if (state.decoder && !state.ended) {
      var chunk = state.decoder.end();
      if (chunk && chunk.length) self.push(chunk);
    }

    self.push(null);
  });

  stream.on('data', function (chunk) {
    debug('wrapped data');
    if (state.decoder) chunk = state.decoder.write(chunk);

    // don't skip over falsy values in objectMode
    if (state.objectMode && (chunk === null || chunk === undefined)) return;else if (!state.objectMode && (!chunk || !chunk.length)) return;

    var ret = self.push(chunk);
    if (!ret) {
      paused = true;
      stream.pause();
    }
  });

  // proxy all the other methods.
  // important when wrapping filters and duplexes.
  for (var i in stream) {
    if (this[i] === undefined && typeof stream[i] === 'function') {
      this[i] = function (method) {
        return function () {
          return stream[method].apply(stream, arguments);
        };
      }(i);
    }
  }

  // proxy certain important events.
  for (var n = 0; n < kProxyEvents.length; n++) {
    stream.on(kProxyEvents[n], self.emit.bind(self, kProxyEvents[n]));
  }

  // when we try to consume some more bytes, simply unpause the
  // underlying stream.
  self._read = function (n) {
    debug('wrapped _read', n);
    if (paused) {
      paused = false;
      stream.resume();
    }
  };

  return self;
};

// exposed for testing purposes only.
Readable._fromList = fromList;

// Pluck off n bytes from an array of buffers.
// Length is the combined lengths of all the buffers in the list.
// This function is designed to be inlinable, so please take care when making
// changes to the function body.
function fromList(n, state) {
  // nothing buffered
  if (state.length === 0) return null;

  var ret;
  if (state.objectMode) ret = state.buffer.shift();else if (!n || n >= state.length) {
    // read it all, truncate the list
    if (state.decoder) ret = state.buffer.join('');else if (state.buffer.length === 1) ret = state.buffer.head.data;else ret = state.buffer.concat(state.length);
    state.buffer.clear();
  } else {
    // read part of list
    ret = fromListPartial(n, state.buffer, state.decoder);
  }

  return ret;
}

// Extracts only enough buffered data to satisfy the amount requested.
// This function is designed to be inlinable, so please take care when making
// changes to the function body.
function fromListPartial(n, list, hasStrings) {
  var ret;
  if (n < list.head.data.length) {
    // slice is the same for buffers and strings
    ret = list.head.data.slice(0, n);
    list.head.data = list.head.data.slice(n);
  } else if (n === list.head.data.length) {
    // first chunk is a perfect match
    ret = list.shift();
  } else {
    // result spans more than one buffer
    ret = hasStrings ? copyFromBufferString(n, list) : copyFromBuffer(n, list);
  }
  return ret;
}

// Copies a specified amount of characters from the list of buffered data
// chunks.
// This function is designed to be inlinable, so please take care when making
// changes to the function body.
function copyFromBufferString(n, list) {
  var p = list.head;
  var c = 1;
  var ret = p.data;
  n -= ret.length;
  while (p = p.next) {
    var str = p.data;
    var nb = n > str.length ? str.length : n;
    if (nb === str.length) ret += str;else ret += str.slice(0, n);
    n -= nb;
    if (n === 0) {
      if (nb === str.length) {
        ++c;
        if (p.next) list.head = p.next;else list.head = list.tail = null;
      } else {
        list.head = p;
        p.data = str.slice(nb);
      }
      break;
    }
    ++c;
  }
  list.length -= c;
  return ret;
}

// Copies a specified amount of bytes from the list of buffered data chunks.
// This function is designed to be inlinable, so please take care when making
// changes to the function body.
function copyFromBuffer(n, list) {
  var ret = bufferShim.allocUnsafe(n);
  var p = list.head;
  var c = 1;
  p.data.copy(ret);
  n -= p.data.length;
  while (p = p.next) {
    var buf = p.data;
    var nb = n > buf.length ? buf.length : n;
    buf.copy(ret, ret.length - n, 0, nb);
    n -= nb;
    if (n === 0) {
      if (nb === buf.length) {
        ++c;
        if (p.next) list.head = p.next;else list.head = list.tail = null;
      } else {
        list.head = p;
        p.data = buf.slice(nb);
      }
      break;
    }
    ++c;
  }
  list.length -= c;
  return ret;
}

function endReadable(stream) {
  var state = stream._readableState;

  // If we get here before consuming all the bytes, then that is a
  // bug in node.  Should never happen.
  if (state.length > 0) throw new Error('"endReadable()" called on non-empty stream');

  if (!state.endEmitted) {
    state.ended = true;
    processNextTick(endReadableNT, state, stream);
  }
}

function endReadableNT(state, stream) {
  // Check that we didn't get one last unshift.
  if (!state.endEmitted && state.length === 0) {
    state.endEmitted = true;
    stream.readable = false;
    stream.emit('end');
  }
}

function forEach(xs, f) {
  for (var i = 0, l = xs.length; i < l; i++) {
    f(xs[i], i);
  }
}

function indexOf(xs, x) {
  for (var i = 0, l = xs.length; i < l; i++) {
    if (xs[i] === x) return i;
  }
  return -1;
}
/* WEBPACK VAR INJECTION */}.call(exports, __webpack_require__(5)))

/***/ }),
/* 15 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
// a transform stream is a readable/writable stream where you do
// something with the data.  Sometimes it's called a "filter",
// but that's not a great name for it, since that implies a thing where
// some bits pass through, and others are simply ignored.  (That would
// be a valid example of a transform, of course.)
//
// While the output is causally related to the input, it's not a
// necessarily symmetric or synchronous transformation.  For example,
// a zlib stream might take multiple plain-text writes(), and then
// emit a single compressed chunk some time in the future.
//
// Here's how this works:
//
// The Transform stream has all the aspects of the readable and writable
// stream classes.  When you write(chunk), that calls _write(chunk,cb)
// internally, and returns false if there's a lot of pending writes
// buffered up.  When you call read(), that calls _read(n) until
// there's enough pending readable data buffered up.
//
// In a transform stream, the written data is placed in a buffer.  When
// _read(n) is called, it transforms the queued up data, calling the
// buffered _write cb's as it consumes chunks.  If consuming a single
// written chunk would result in multiple output chunks, then the first
// outputted bit calls the readcb, and subsequent chunks just go into
// the read buffer, and will cause it to emit 'readable' if necessary.
//
// This way, back-pressure is actually determined by the reading side,
// since _read has to be called to start processing a new chunk.  However,
// a pathological inflate type of transform can cause excessive buffering
// here.  For example, imagine a stream where every byte of input is
// interpreted as an integer from 0-255, and then results in that many
// bytes of output.  Writing the 4 bytes {ff,ff,ff,ff} would result in
// 1kb of data being output.  In this case, you could write a very small
// amount of input, and end up with a very large amount of output.  In
// such a pathological inflating mechanism, there'd be no way to tell
// the system to stop doing the transform.  A single 4MB write could
// cause the system to run out of memory.
//
// However, even in such a pathological case, only a single written chunk
// would be consumed, and then the rest would wait (un-transformed) until
// the results of the previous transformed chunk were consumed.



module.exports = Transform;

var Duplex = __webpack_require__(0);

/*<replacement>*/
var util = __webpack_require__(4);
util.inherits = __webpack_require__(2);
/*</replacement>*/

util.inherits(Transform, Duplex);

function TransformState(stream) {
  this.afterTransform = function (er, data) {
    return afterTransform(stream, er, data);
  };

  this.needTransform = false;
  this.transforming = false;
  this.writecb = null;
  this.writechunk = null;
  this.writeencoding = null;
}

function afterTransform(stream, er, data) {
  var ts = stream._transformState;
  ts.transforming = false;

  var cb = ts.writecb;

  if (!cb) return stream.emit('error', new Error('no writecb in Transform class'));

  ts.writechunk = null;
  ts.writecb = null;

  if (data !== null && data !== undefined) stream.push(data);

  cb(er);

  var rs = stream._readableState;
  rs.reading = false;
  if (rs.needReadable || rs.length < rs.highWaterMark) {
    stream._read(rs.highWaterMark);
  }
}

function Transform(options) {
  if (!(this instanceof Transform)) return new Transform(options);

  Duplex.call(this, options);

  this._transformState = new TransformState(this);

  var stream = this;

  // start out asking for a readable event once data is transformed.
  this._readableState.needReadable = true;

  // we have implemented the _read method, and done the other things
  // that Readable wants before the first _read call, so unset the
  // sync guard flag.
  this._readableState.sync = false;

  if (options) {
    if (typeof options.transform === 'function') this._transform = options.transform;

    if (typeof options.flush === 'function') this._flush = options.flush;
  }

  // When the writable side finishes, then flush out anything remaining.
  this.once('prefinish', function () {
    if (typeof this._flush === 'function') this._flush(function (er, data) {
      done(stream, er, data);
    });else done(stream);
  });
}

Transform.prototype.push = function (chunk, encoding) {
  this._transformState.needTransform = false;
  return Duplex.prototype.push.call(this, chunk, encoding);
};

// This is the part where you do stuff!
// override this function in implementation classes.
// 'chunk' is an input chunk.
//
// Call `push(newChunk)` to pass along transformed output
// to the readable side.  You may call 'push' zero or more times.
//
// Call `cb(err)` when you are done with this chunk.  If you pass
// an error, then that'll put the hurt on the whole operation.  If you
// never call cb(), then you'll never get another chunk.
Transform.prototype._transform = function (chunk, encoding, cb) {
  throw new Error('_transform() is not implemented');
};

Transform.prototype._write = function (chunk, encoding, cb) {
  var ts = this._transformState;
  ts.writecb = cb;
  ts.writechunk = chunk;
  ts.writeencoding = encoding;
  if (!ts.transforming) {
    var rs = this._readableState;
    if (ts.needTransform || rs.needReadable || rs.length < rs.highWaterMark) this._read(rs.highWaterMark);
  }
};

// Doesn't matter what the args are here.
// _transform does all the work.
// That we got here means that the readable side wants more data.
Transform.prototype._read = function (n) {
  var ts = this._transformState;

  if (ts.writechunk !== null && ts.writecb && !ts.transforming) {
    ts.transforming = true;
    this._transform(ts.writechunk, ts.writeencoding, ts.afterTransform);
  } else {
    // mark that we need a transform, so that any data that comes in
    // will get processed, now that we've asked for it.
    ts.needTransform = true;
  }
};

function done(stream, er, data) {
  if (er) return stream.emit('error', er);

  if (data !== null && data !== undefined) stream.push(data);

  // if there's nothing in the write buffer, then that means
  // that nothing more will ever be provided
  var ws = stream._writableState;
  var ts = stream._transformState;

  if (ws.length) throw new Error('Calling transform done when ws.length != 0');

  if (ts.transforming) throw new Error('Calling transform done when still transforming');

  return stream.push(null);
}

/***/ }),
/* 16 */
/***/ (function(module, exports, __webpack_require__) {

module.exports = __webpack_require__(7).EventEmitter;


/***/ }),
/* 17 */
/***/ (function(module, exports, __webpack_require__) {

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

module.exports = Stream;

var EE = __webpack_require__(7).EventEmitter;
var inherits = __webpack_require__(2);

inherits(Stream, EE);
Stream.Readable = __webpack_require__(11);
Stream.Writable = __webpack_require__(38);
Stream.Duplex = __webpack_require__(33);
Stream.Transform = __webpack_require__(37);
Stream.PassThrough = __webpack_require__(36);

// Backwards-compat with node 0.4.x
Stream.Stream = Stream;



// old-style streams.  Note that the pipe method (the only relevant
// part of this class) is overridden in the Readable class.

function Stream() {
  EE.call(this);
}

Stream.prototype.pipe = function(dest, options) {
  var source = this;

  function ondata(chunk) {
    if (dest.writable) {
      if (false === dest.write(chunk) && source.pause) {
        source.pause();
      }
    }
  }

  source.on('data', ondata);

  function ondrain() {
    if (source.readable && source.resume) {
      source.resume();
    }
  }

  dest.on('drain', ondrain);

  // If the 'end' option is not supplied, dest.end() will be called when
  // source gets the 'end' or 'close' events.  Only dest.end() once.
  if (!dest._isStdio && (!options || options.end !== false)) {
    source.on('end', onend);
    source.on('close', onclose);
  }

  var didOnEnd = false;
  function onend() {
    if (didOnEnd) return;
    didOnEnd = true;

    dest.end();
  }


  function onclose() {
    if (didOnEnd) return;
    didOnEnd = true;

    if (typeof dest.destroy === 'function') dest.destroy();
  }

  // don't leave dangling pipes when there are errors.
  function onerror(er) {
    cleanup();
    if (EE.listenerCount(this, 'error') === 0) {
      throw er; // Unhandled stream error in pipe.
    }
  }

  source.on('error', onerror);
  dest.on('error', onerror);

  // remove all the event listeners that were added.
  function cleanup() {
    source.removeListener('data', ondata);
    dest.removeListener('drain', ondrain);

    source.removeListener('end', onend);
    source.removeListener('close', onclose);

    source.removeListener('error', onerror);
    dest.removeListener('error', onerror);

    source.removeListener('end', cleanup);
    source.removeListener('close', cleanup);

    dest.removeListener('close', cleanup);
  }

  source.on('end', cleanup);
  source.on('close', cleanup);

  dest.on('close', cleanup);

  dest.emit('pipe', source);

  // Allow for unix-like usage: A.pipe(B).pipe(C)
  return dest;
};


/***/ }),
/* 18 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.default = Camera;
function Camera(canvas) {

    this.canvas = canvas;
    this.model = glm.mat4();
    this.projection = glm.mat4();
    this.view = glm.mat4();
    this.projectionView;
    this.look = glm.vec3(0, 0, -1);
    this.up = glm.vec3(0, 1, 0);
    this.world_up = glm.vec3(0, 1, 0);
    this.right = glm.vec3(1, 0, 0);
    this.eye = glm.vec3(0, 0, 10);
    this.ref = glm.vec3(0, 0, 0);

    this.fovy = 45;
    this.aspectRatio = canvas.width / canvas.height;
    this.nearClip = 0.1;
    this.farClip = 1001;

    this.totalX = 90;
}

Camera.prototype.getModel = function () {
    return this.model;
};

Camera.prototype.getProjection = function () {
    return this.projection;
};

Camera.prototype.getView = function () {
    return this.view;
};

Camera.prototype.getViewProj = function () {

    var glmPers = glm.perspective(glm.radians(this.fovy), this.aspectRatio, this.nearClip, this.farClip);
    var glmView = glm.lookAt(this.eye, this.ref, this.up);

    return glmPers['*'](glmView);
};

Camera.prototype.updateAttributes = function () {

    this.look = glm.normalize(this.ref['-'](this.eye));
    this.right = glm.normalize(glm.cross(this.look, this.world_up));
    this.up = glm.cross(this.right, this.look);
};

Camera.prototype.rotateAboutUp = function (upRot) {

    var rotation = glm.rotate(glm.mat4(1.0), glm.radians(-upRot), this.up);
    this.eye = glm.vec3(rotation.mul(glm.vec4(this.eye, 1.0)));
    this.updateAttributes();
};

Camera.prototype.rotateAboutRight = function (rightRot) {

    if (rightRot > 100) return;

    if (this.totalX + rightRot <= 2 || this.totalX + rightRot >= 178) {
        return;
    }

    var rotation = glm.rotate(glm.mat4(1.0), glm.radians(-rightRot), this.right);
    this.eye = glm.vec3(rotation.mul(glm.vec4(this.eye, 1.0)));
    this.totalX += rightRot;
    this.updateAttributes();
};

Camera.prototype.translateAlongLook = function (trans) {

    var translation = this.eye.mul(trans);
    this.eye = this.eye['+'](translation);
};

/***/ }),
/* 19 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.default = Controls;
function Controls(canvas, cam) {

    this.drag = 0;
    this.yRot = 0;
    this.xRot = 0;
    this.xOffs = 0;
    this.yOffs = 0;
    this.pi180 = 180 / Math.PI, this.drag = 0;
    this.yRot = 0;
    this.xRot = 0;
    this.xOffs = 0;
    this.yOffs = 0;
    this.totalX = 90;
    this.camera = cam;

    canvas.addEventListener('DOMMouseScroll', this.wheelHandler, false);
    canvas.addEventListener('mousewheel', this.wheelHandler, false);
    canvas.addEventListener('mousedown', this.mymousedown, false);
    canvas.addEventListener('mouseup', this.mymouseup, false);
    canvas.addEventListener('mousemove', this.mymousemove, false);
}

Controls.prototype.mouseDown = function (event) {
    this.drag = 1;
    this.xOffs = event.clientX;
    this.yOffs = event.clientY;
};

Controls.prototype.mouseUp = function (event) {
    this.drag = 0;
};

Controls.prototype.mouseMove = function (event) {

    if (this.drag == 0) {
        this.xOffs = event.clientX;
        this.yOffs = event.clientY;
        return;
    }

    var yRot = -this.xOffs + event.clientX;
    var xRot = -this.yOffs + event.clientY;

    this.xOffs = event.clientX;
    this.yOffs = event.clientY;

    this.camera.rotateAboutUp(yRot);
    this.camera.rotateAboutRight(xRot);
};

Controls.prototype.scroll = function (event) {

    var translation;
    if ((event.detail || event.wheelDelta) > 0) {
        this.camera.translateAlongLook(0.1);
    } else {
        this.camera.translateAlongLook(-0.1);
    }

    event.preventDefault();
};

/***/ }),
/* 20 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});

var _statsJs = __webpack_require__(41);

var _statsJs2 = _interopRequireDefault(_statsJs);

var _datGui = __webpack_require__(26);

var _datGui2 = _interopRequireDefault(_datGui);

var _webgl = __webpack_require__(24);

var _webgl2 = _interopRequireDefault(_webgl);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function init(callback, update) {
  var stats = new _statsJs2.default();
  stats.setMode(0);
  stats.domElement.style.position = 'absolute';
  stats.domElement.style.left = '0px';
  stats.domElement.style.top = '0px';
  document.body.appendChild(stats.domElement);

  var gui = new _datGui2.default.GUI();

  var framework = {
    gui: gui,
    stats: stats
  };

  window.addEventListener('load', function () {

    framework.webgl = new _webgl2.default();
    framework.canvas = framework.webgl.canvas;

    window.addEventListener('resize', function () {
      resize(framework.webgl.gl.canvas);
    }, false);

    // begin the animation loop
    (function tick() {
      stats.begin();
      update(framework); // perform any requested updates
      //scene.render();
      stats.end();
      requestAnimationFrame(tick); // register to call this again when the browser renders a new frame
    })();

    // we will pass the scene, gui, renderer, camera, etc... to the callback function
    return callback(framework);
  });
} //require('file-loader?name=[name].[ext]!../index.html');


function resize(canvas) {
  var cssToRealPixels = window.devicePixelRatio || 1;

  var displayWidth = Math.floor(canvas.clientWidth * cssToRealPixels);
  var displayHeight = Math.floor(canvas.clientHeight * cssToRealPixels);

  if (canvas.width !== displayWidth || canvas.height !== displayHeight) {
    canvas.width = displayWidth;
    canvas.height = displayHeight;
  }
}

exports.default = {
  init: init
};

/***/ }),
/* 21 */
/***/ (function(module, exports, __webpack_require__) {

/* WEBPACK VAR INJECTION */(function(global) {/*! glm-js built 2017-04-02 11:34:38-04:00 | (c) humbletim | http://humbletim.github.io/glm-js */
(function declare_glmjs_glmatrix(globals, $GLM_log, $GLM_console_log) { var GLM, GLMAT, GLMAT_VERSION, GLMJS_PREFIX, $GLM_console_factory, glm; ArrayBuffer.exists;
/*

 --------------------------------------------------------------------------
 glm-js | (c) humbletim | http://humbletim.github.io/glm-js
 --------------------------------------------------------------------------

 The MIT License (MIT)

 Copyright (c) 2015-2016 humbletim

 Permission is hereby granted, free of charge, to any person obtaining a copy
 of this software and associated documentation files (the "Software"), to deal
 in the Software without restriction, including without limitation the rights
 to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
 copies of the Software, and to permit persons to whom the Software is
 furnished to do so, subject to the following conditions:

 The above copyright notice and this permission notice shall be included in all
 copies or substantial portions of the Software.

 THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
 SOFTWARE.

 --------------------------------------------------------------------------
 gl-matrix | (c) Brandon Jones, Colin MacKenzie IV | http://glmatrix.net/
 --------------------------------------------------------------------------

 Copyright (c) 2013 Brandon Jones, Colin MacKenzie IV

 This software is provided 'as-is', without any express or implied
 warranty. In no event will the authors be held liable for any damages
 arising from the use of this software.

 Permission is granted to anyone to use this software for any purpose,
 including commercial applications, and to alter it and redistribute it
 freely, subject to the following restrictions:

  1. The origin of this software must not be misrepresented; you must not
     claim that you wrote the original software. If you use this software
     in a product, an acknowledgment in the product documentation would be
     appreciated but is not required.

  2. Altered source versions must be plainly marked as such, and must not
     be misrepresented as being the original software.

  3. This notice may not be removed or altered from any source distribution.
*/
GLMAT={};GLMAT_VERSION="2.2.2";
(function(a){a.VERSION=GLMAT_VERSION;if(!b)var b=1E-6;if(!c)var c="undefined"!==typeof Float32Array?Float32Array:Array;if(!e)var e=Math.random;var d={setMatrixArrayType:function(y){c=y}};"undefined"!==typeof a&&(a.glMatrix=d);var h=Math.PI/180;d.toRadian=function(y){return y*h};d={create:function(){var y=new c(2);y[0]=0;y[1]=0;return y},clone:function(y){var a=new c(2);a[0]=y[0];a[1]=y[1];return a},fromValues:function(y,a){var v=new c(2);v[0]=y;v[1]=a;return v},copy:function(y,a){y[0]=a[0];y[1]=a[1];
return y},set:function(y,a,v){y[0]=a;y[1]=v;return y},add:function(y,a,v){y[0]=a[0]+v[0];y[1]=a[1]+v[1];return y},subtract:function(y,a,v){y[0]=a[0]-v[0];y[1]=a[1]-v[1];return y}};d.sub=d.subtract;d.multiply=function(y,a,v){y[0]=a[0]*v[0];y[1]=a[1]*v[1];return y};d.mul=d.multiply;d.divide=function(y,a,v){y[0]=a[0]/v[0];y[1]=a[1]/v[1];return y};d.div=d.divide;d.min=function(y,a,v){y[0]=Math.min(a[0],v[0]);y[1]=Math.min(a[1],v[1]);return y};d.max=function(y,a,v){y[0]=Math.max(a[0],v[0]);y[1]=Math.max(a[1],
v[1]);return y};d.scale=function(y,a,v){y[0]=a[0]*v;y[1]=a[1]*v;return y};d.scaleAndAdd=function(y,a,v,b){y[0]=a[0]+v[0]*b;y[1]=a[1]+v[1]*b;return y};d.distance=function(a,f){var v=f[0]-a[0],b=f[1]-a[1];return Math.sqrt(v*v+b*b)};d.dist=d.distance;d.squaredDistance=function(a,f){var v=f[0]-a[0],b=f[1]-a[1];return v*v+b*b};d.sqrDist=d.squaredDistance;d.length=function(a){var f=a[0];a=a[1];return Math.sqrt(f*f+a*a)};d.len=d.length;d.squaredLength=function(a){var f=a[0];a=a[1];return f*f+a*a};d.sqrLen=
d.squaredLength;d.negate=function(a,f){a[0]=-f[0];a[1]=-f[1];return a};d.inverse=function(a,f){a[0]=1/f[0];a[1]=1/f[1];return a};d.normalize=function(a,f){var v=f[0],b=f[1],v=v*v+b*b;0<v&&(v=1/Math.sqrt(v),a[0]=f[0]*v,a[1]=f[1]*v);return a};d.dot=function(a,f){return a[0]*f[0]+a[1]*f[1]};d.cross=function(a,f,v){f=f[0]*v[1]-f[1]*v[0];a[0]=a[1]=0;a[2]=f;return a};d.lerp=function(a,f,v,b){var c=f[0];f=f[1];a[0]=c+b*(v[0]-c);a[1]=f+b*(v[1]-f);return a};d.random=function(a,f){f=f||1;var v=2*e()*Math.PI;
a[0]=Math.cos(v)*f;a[1]=Math.sin(v)*f;return a};d.transformMat2=function(a,f,v){var b=f[0];f=f[1];a[0]=v[0]*b+v[2]*f;a[1]=v[1]*b+v[3]*f;return a};d.transformMat2d=function(a,f,v){var b=f[0];f=f[1];a[0]=v[0]*b+v[2]*f+v[4];a[1]=v[1]*b+v[3]*f+v[5];return a};d.transformMat3=function(a,f,b){var c=f[0];f=f[1];a[0]=b[0]*c+b[3]*f+b[6];a[1]=b[1]*c+b[4]*f+b[7];return a};d.transformMat4=function(a,f,b){var c=f[0];f=f[1];a[0]=b[0]*c+b[4]*f+b[12];a[1]=b[1]*c+b[5]*f+b[13];return a};var j=d.create();d.forEach=function(a,
f,b,c,d,e){f||(f=2);b||(b=0);for(c=c?Math.min(c*f+b,a.length):a.length;b<c;b+=f)j[0]=a[b],j[1]=a[b+1],d(j,j,e),a[b]=j[0],a[b+1]=j[1];return a};d.str=function(a){return"vec2("+a[0]+", "+a[1]+")"};"undefined"!==typeof a&&(a.vec2=d);var g={create:function(){var a=new c(3);a[0]=0;a[1]=0;a[2]=0;return a},clone:function(a){var f=new c(3);f[0]=a[0];f[1]=a[1];f[2]=a[2];return f},fromValues:function(a,f,b){var P=new c(3);P[0]=a;P[1]=f;P[2]=b;return P},copy:function(a,f){a[0]=f[0];a[1]=f[1];a[2]=f[2];return a},
set:function(a,f,b,c){a[0]=f;a[1]=b;a[2]=c;return a},add:function(a,f,b){a[0]=f[0]+b[0];a[1]=f[1]+b[1];a[2]=f[2]+b[2];return a},subtract:function(a,f,b){a[0]=f[0]-b[0];a[1]=f[1]-b[1];a[2]=f[2]-b[2];return a}};g.sub=g.subtract;g.multiply=function(a,f,b){a[0]=f[0]*b[0];a[1]=f[1]*b[1];a[2]=f[2]*b[2];return a};g.mul=g.multiply;g.divide=function(a,f,b){a[0]=f[0]/b[0];a[1]=f[1]/b[1];a[2]=f[2]/b[2];return a};g.div=g.divide;g.min=function(a,f,b){a[0]=Math.min(f[0],b[0]);a[1]=Math.min(f[1],b[1]);a[2]=Math.min(f[2],
b[2]);return a};g.max=function(a,f,b){a[0]=Math.max(f[0],b[0]);a[1]=Math.max(f[1],b[1]);a[2]=Math.max(f[2],b[2]);return a};g.scale=function(a,f,b){a[0]=f[0]*b;a[1]=f[1]*b;a[2]=f[2]*b;return a};g.scaleAndAdd=function(a,f,b,c){a[0]=f[0]+b[0]*c;a[1]=f[1]+b[1]*c;a[2]=f[2]+b[2]*c;return a};g.distance=function(a,f){var b=f[0]-a[0],c=f[1]-a[1],d=f[2]-a[2];return Math.sqrt(b*b+c*c+d*d)};g.dist=g.distance;g.squaredDistance=function(a,f){var b=f[0]-a[0],c=f[1]-a[1],d=f[2]-a[2];return b*b+c*c+d*d};g.sqrDist=
g.squaredDistance;g.length=function(a){var f=a[0],b=a[1];a=a[2];return Math.sqrt(f*f+b*b+a*a)};g.len=g.length;g.squaredLength=function(a){var f=a[0],b=a[1];a=a[2];return f*f+b*b+a*a};g.sqrLen=g.squaredLength;g.negate=function(a,f){a[0]=-f[0];a[1]=-f[1];a[2]=-f[2];return a};g.inverse=function(a,f){a[0]=1/f[0];a[1]=1/f[1];a[2]=1/f[2];return a};g.normalize=function(a,f){var b=f[0],c=f[1],d=f[2],b=b*b+c*c+d*d;0<b&&(b=1/Math.sqrt(b),a[0]=f[0]*b,a[1]=f[1]*b,a[2]=f[2]*b);return a};g.dot=function(a,f){return a[0]*
f[0]+a[1]*f[1]+a[2]*f[2]};g.cross=function(a,f,b){var c=f[0],d=f[1];f=f[2];var e=b[0],l=b[1];b=b[2];a[0]=d*b-f*l;a[1]=f*e-c*b;a[2]=c*l-d*e;return a};g.lerp=function(a,f,b,c){var d=f[0],e=f[1];f=f[2];a[0]=d+c*(b[0]-d);a[1]=e+c*(b[1]-e);a[2]=f+c*(b[2]-f);return a};g.random=function(a,f){f=f||1;var b=2*e()*Math.PI,c=2*e()-1,d=Math.sqrt(1-c*c)*f;a[0]=Math.cos(b)*d;a[1]=Math.sin(b)*d;a[2]=c*f;return a};g.transformMat4=function(a,f,b){var c=f[0],d=f[1];f=f[2];var e=b[3]*c+b[7]*d+b[11]*f+b[15],e=e||1;a[0]=
(b[0]*c+b[4]*d+b[8]*f+b[12])/e;a[1]=(b[1]*c+b[5]*d+b[9]*f+b[13])/e;a[2]=(b[2]*c+b[6]*d+b[10]*f+b[14])/e;return a};g.transformMat3=function(a,f,b){var c=f[0],d=f[1];f=f[2];a[0]=c*b[0]+d*b[3]+f*b[6];a[1]=c*b[1]+d*b[4]+f*b[7];a[2]=c*b[2]+d*b[5]+f*b[8];return a};g.transformQuat=function(a,f,b){var c=f[0],d=f[1],e=f[2];f=b[0];var l=b[1],x=b[2];b=b[3];var u=b*c+l*e-x*d,J=b*d+x*c-f*e,g=b*e+f*d-l*c,c=-f*c-l*d-x*e;a[0]=u*b+c*-f+J*-x-g*-l;a[1]=J*b+c*-l+g*-f-u*-x;a[2]=g*b+c*-x+u*-l-J*-f;return a};g.rotateX=
function(a,f,b,c){var d=[],e=[];d[0]=f[0]-b[0];d[1]=f[1]-b[1];d[2]=f[2]-b[2];e[0]=d[0];e[1]=d[1]*Math.cos(c)-d[2]*Math.sin(c);e[2]=d[1]*Math.sin(c)+d[2]*Math.cos(c);a[0]=e[0]+b[0];a[1]=e[1]+b[1];a[2]=e[2]+b[2];return a};g.rotateY=function(a,f,b,c){var d=[],e=[];d[0]=f[0]-b[0];d[1]=f[1]-b[1];d[2]=f[2]-b[2];e[0]=d[2]*Math.sin(c)+d[0]*Math.cos(c);e[1]=d[1];e[2]=d[2]*Math.cos(c)-d[0]*Math.sin(c);a[0]=e[0]+b[0];a[1]=e[1]+b[1];a[2]=e[2]+b[2];return a};g.rotateZ=function(a,f,b,c){var d=[],e=[];d[0]=f[0]-
b[0];d[1]=f[1]-b[1];d[2]=f[2]-b[2];e[0]=d[0]*Math.cos(c)-d[1]*Math.sin(c);e[1]=d[0]*Math.sin(c)+d[1]*Math.cos(c);e[2]=d[2];a[0]=e[0]+b[0];a[1]=e[1]+b[1];a[2]=e[2]+b[2];return a};var k=g.create();g.forEach=function(a,f,b,c,d,e){f||(f=3);b||(b=0);for(c=c?Math.min(c*f+b,a.length):a.length;b<c;b+=f)k[0]=a[b],k[1]=a[b+1],k[2]=a[b+2],d(k,k,e),a[b]=k[0],a[b+1]=k[1],a[b+2]=k[2];return a};g.str=function(a){return"vec3("+a[0]+", "+a[1]+", "+a[2]+")"};"undefined"!==typeof a&&(a.vec3=g);var i={create:function(){var a=
new c(4);a[0]=0;a[1]=0;a[2]=0;a[3]=0;return a},clone:function(a){var f=new c(4);f[0]=a[0];f[1]=a[1];f[2]=a[2];f[3]=a[3];return f},fromValues:function(a,f,b,d){var e=new c(4);e[0]=a;e[1]=f;e[2]=b;e[3]=d;return e},copy:function(a,f){a[0]=f[0];a[1]=f[1];a[2]=f[2];a[3]=f[3];return a},set:function(a,f,b,c,d){a[0]=f;a[1]=b;a[2]=c;a[3]=d;return a},add:function(a,f,b){a[0]=f[0]+b[0];a[1]=f[1]+b[1];a[2]=f[2]+b[2];a[3]=f[3]+b[3];return a},subtract:function(a,f,b){a[0]=f[0]-b[0];a[1]=f[1]-b[1];a[2]=f[2]-b[2];
a[3]=f[3]-b[3];return a}};i.sub=i.subtract;i.multiply=function(a,f,b){a[0]=f[0]*b[0];a[1]=f[1]*b[1];a[2]=f[2]*b[2];a[3]=f[3]*b[3];return a};i.mul=i.multiply;i.divide=function(a,f,b){a[0]=f[0]/b[0];a[1]=f[1]/b[1];a[2]=f[2]/b[2];a[3]=f[3]/b[3];return a};i.div=i.divide;i.min=function(a,f,b){a[0]=Math.min(f[0],b[0]);a[1]=Math.min(f[1],b[1]);a[2]=Math.min(f[2],b[2]);a[3]=Math.min(f[3],b[3]);return a};i.max=function(a,f,b){a[0]=Math.max(f[0],b[0]);a[1]=Math.max(f[1],b[1]);a[2]=Math.max(f[2],b[2]);a[3]=
Math.max(f[3],b[3]);return a};i.scale=function(a,f,b){a[0]=f[0]*b;a[1]=f[1]*b;a[2]=f[2]*b;a[3]=f[3]*b;return a};i.scaleAndAdd=function(a,f,b,c){a[0]=f[0]+b[0]*c;a[1]=f[1]+b[1]*c;a[2]=f[2]+b[2]*c;a[3]=f[3]+b[3]*c;return a};i.distance=function(a,f){var b=f[0]-a[0],c=f[1]-a[1],d=f[2]-a[2],e=f[3]-a[3];return Math.sqrt(b*b+c*c+d*d+e*e)};i.dist=i.distance;i.squaredDistance=function(a,f){var b=f[0]-a[0],c=f[1]-a[1],d=f[2]-a[2],e=f[3]-a[3];return b*b+c*c+d*d+e*e};i.sqrDist=i.squaredDistance;i.length=function(a){var f=
a[0],b=a[1],c=a[2];a=a[3];return Math.sqrt(f*f+b*b+c*c+a*a)};i.len=i.length;i.squaredLength=function(a){var f=a[0],b=a[1],c=a[2];a=a[3];return f*f+b*b+c*c+a*a};i.sqrLen=i.squaredLength;i.negate=function(a,f){a[0]=-f[0];a[1]=-f[1];a[2]=-f[2];a[3]=-f[3];return a};i.inverse=function(a,f){a[0]=1/f[0];a[1]=1/f[1];a[2]=1/f[2];a[3]=1/f[3];return a};i.normalize=function(a,f){var b=f[0],c=f[1],d=f[2],e=f[3],b=b*b+c*c+d*d+e*e;0<b&&(b=1/Math.sqrt(b),a[0]=f[0]*b,a[1]=f[1]*b,a[2]=f[2]*b,a[3]=f[3]*b);return a};
i.dot=function(a,f){return a[0]*f[0]+a[1]*f[1]+a[2]*f[2]+a[3]*f[3]};i.lerp=function(a,f,b,c){var d=f[0],e=f[1],l=f[2];f=f[3];a[0]=d+c*(b[0]-d);a[1]=e+c*(b[1]-e);a[2]=l+c*(b[2]-l);a[3]=f+c*(b[3]-f);return a};i.random=function(a,f){f=f||1;a[0]=e();a[1]=e();a[2]=e();a[3]=e();i.normalize(a,a);i.scale(a,a,f);return a};i.transformMat4=function(a,f,b){var c=f[0],d=f[1],e=f[2];f=f[3];a[0]=b[0]*c+b[4]*d+b[8]*e+b[12]*f;a[1]=b[1]*c+b[5]*d+b[9]*e+b[13]*f;a[2]=b[2]*c+b[6]*d+b[10]*e+b[14]*f;a[3]=b[3]*c+b[7]*d+
b[11]*e+b[15]*f;return a};i.transformQuat=function(a,b,c){var d=b[0],e=b[1],n=b[2];b=c[0];var l=c[1],x=c[2];c=c[3];var u=c*d+l*n-x*e,J=c*e+x*d-b*n,g=c*n+b*e-l*d,d=-b*d-l*e-x*n;a[0]=u*c+d*-b+J*-x-g*-l;a[1]=J*c+d*-l+g*-b-u*-x;a[2]=g*c+d*-x+u*-l-J*-b;return a};var w=i.create();i.forEach=function(a,b,c,d,e,n){b||(b=4);c||(c=0);for(d=d?Math.min(d*b+c,a.length):a.length;c<d;c+=b)w[0]=a[c],w[1]=a[c+1],w[2]=a[c+2],w[3]=a[c+3],e(w,w,n),a[c]=w[0],a[c+1]=w[1],a[c+2]=w[2],a[c+3]=w[3];return a};i.str=function(a){return"vec4("+
a[0]+", "+a[1]+", "+a[2]+", "+a[3]+")"};"undefined"!==typeof a&&(a.vec4=i);d={create:function(){var a=new c(4);a[0]=1;a[1]=0;a[2]=0;a[3]=1;return a},clone:function(a){var b=new c(4);b[0]=a[0];b[1]=a[1];b[2]=a[2];b[3]=a[3];return b},copy:function(a,b){a[0]=b[0];a[1]=b[1];a[2]=b[2];a[3]=b[3];return a},identity:function(a){a[0]=1;a[1]=0;a[2]=0;a[3]=1;return a},transpose:function(a,b){if(a===b){var c=b[1];a[1]=b[2];a[2]=c}else a[0]=b[0],a[1]=b[2],a[2]=b[1],a[3]=b[3];return a},invert:function(a,b){var c=
b[0],d=b[1],e=b[2],n=b[3],l=c*n-e*d;if(!l)return null;l=1/l;a[0]=n*l;a[1]=-d*l;a[2]=-e*l;a[3]=c*l;return a},adjoint:function(a,b){var c=b[0];a[0]=b[3];a[1]=-b[1];a[2]=-b[2];a[3]=c;return a},determinant:function(a){return a[0]*a[3]-a[2]*a[1]},multiply:function(a,b,c){var d=b[0],e=b[1],n=b[2];b=b[3];var l=c[0],x=c[1],u=c[2];c=c[3];a[0]=d*l+n*x;a[1]=e*l+b*x;a[2]=d*u+n*c;a[3]=e*u+b*c;return a}};d.mul=d.multiply;d.rotate=function(a,b,c){var d=b[0],e=b[1],n=b[2];b=b[3];var l=Math.sin(c);c=Math.cos(c);a[0]=
d*c+n*l;a[1]=e*c+b*l;a[2]=d*-l+n*c;a[3]=e*-l+b*c;return a};d.scale=function(a,b,c){var d=b[1],e=b[2],n=b[3],l=c[0];c=c[1];a[0]=b[0]*l;a[1]=d*l;a[2]=e*c;a[3]=n*c;return a};d.str=function(a){return"mat2("+a[0]+", "+a[1]+", "+a[2]+", "+a[3]+")"};d.frob=function(a){return Math.sqrt(Math.pow(a[0],2)+Math.pow(a[1],2)+Math.pow(a[2],2)+Math.pow(a[3],2))};d.LDU=function(a,b,c,d){a[2]=d[2]/d[0];c[0]=d[0];c[1]=d[1];c[3]=d[3]-a[2]*c[1];return[a,b,c]};"undefined"!==typeof a&&(a.mat2=d);d={create:function(){var a=
new c(6);a[0]=1;a[1]=0;a[2]=0;a[3]=1;a[4]=0;a[5]=0;return a},clone:function(a){var b=new c(6);b[0]=a[0];b[1]=a[1];b[2]=a[2];b[3]=a[3];b[4]=a[4];b[5]=a[5];return b},copy:function(a,b){a[0]=b[0];a[1]=b[1];a[2]=b[2];a[3]=b[3];a[4]=b[4];a[5]=b[5];return a},identity:function(a){a[0]=1;a[1]=0;a[2]=0;a[3]=1;a[4]=0;a[5]=0;return a},invert:function(a,b){var c=b[0],d=b[1],e=b[2],n=b[3],l=b[4],x=b[5],u=c*n-d*e;if(!u)return null;u=1/u;a[0]=n*u;a[1]=-d*u;a[2]=-e*u;a[3]=c*u;a[4]=(e*x-n*l)*u;a[5]=(d*l-c*x)*u;return a},
determinant:function(a){return a[0]*a[3]-a[1]*a[2]},multiply:function(a,b,c){var d=b[0],e=b[1],n=b[2],l=b[3],x=b[4];b=b[5];var u=c[0],g=c[1],h=c[2],K=c[3],j=c[4];c=c[5];a[0]=d*u+n*g;a[1]=e*u+l*g;a[2]=d*h+n*K;a[3]=e*h+l*K;a[4]=d*j+n*c+x;a[5]=e*j+l*c+b;return a}};d.mul=d.multiply;d.rotate=function(a,b,c){var d=b[0],e=b[1],n=b[2],l=b[3],x=b[4];b=b[5];var u=Math.sin(c);c=Math.cos(c);a[0]=d*c+n*u;a[1]=e*c+l*u;a[2]=d*-u+n*c;a[3]=e*-u+l*c;a[4]=x;a[5]=b;return a};d.scale=function(a,b,c){var d=b[1],e=b[2],
n=b[3],l=b[4],x=b[5],u=c[0];c=c[1];a[0]=b[0]*u;a[1]=d*u;a[2]=e*c;a[3]=n*c;a[4]=l;a[5]=x;return a};d.translate=function(a,b,c){var d=b[0],e=b[1],n=b[2],l=b[3],x=b[4];b=b[5];var u=c[0];c=c[1];a[0]=d;a[1]=e;a[2]=n;a[3]=l;a[4]=d*u+n*c+x;a[5]=e*u+l*c+b;return a};d.str=function(a){return"mat2d("+a[0]+", "+a[1]+", "+a[2]+", "+a[3]+", "+a[4]+", "+a[5]+")"};d.frob=function(a){return Math.sqrt(Math.pow(a[0],2)+Math.pow(a[1],2)+Math.pow(a[2],2)+Math.pow(a[3],2)+Math.pow(a[4],2)+Math.pow(a[5],2)+1)};"undefined"!==
typeof a&&(a.mat2d=d);d={create:function(){var a=new c(9);a[0]=1;a[1]=0;a[2]=0;a[3]=0;a[4]=1;a[5]=0;a[6]=0;a[7]=0;a[8]=1;return a},fromMat4:function(a,b){a[0]=b[0];a[1]=b[1];a[2]=b[2];a[3]=b[4];a[4]=b[5];a[5]=b[6];a[6]=b[8];a[7]=b[9];a[8]=b[10];return a},clone:function(a){var b=new c(9);b[0]=a[0];b[1]=a[1];b[2]=a[2];b[3]=a[3];b[4]=a[4];b[5]=a[5];b[6]=a[6];b[7]=a[7];b[8]=a[8];return b},copy:function(a,b){a[0]=b[0];a[1]=b[1];a[2]=b[2];a[3]=b[3];a[4]=b[4];a[5]=b[5];a[6]=b[6];a[7]=b[7];a[8]=b[8];return a},
identity:function(a){a[0]=1;a[1]=0;a[2]=0;a[3]=0;a[4]=1;a[5]=0;a[6]=0;a[7]=0;a[8]=1;return a},transpose:function(a,b){if(a===b){var c=b[1],d=b[2],e=b[5];a[1]=b[3];a[2]=b[6];a[3]=c;a[5]=b[7];a[6]=d;a[7]=e}else a[0]=b[0],a[1]=b[3],a[2]=b[6],a[3]=b[1],a[4]=b[4],a[5]=b[7],a[6]=b[2],a[7]=b[5],a[8]=b[8];return a},invert:function(a,b){var c=b[0],d=b[1],e=b[2],n=b[3],l=b[4],x=b[5],u=b[6],g=b[7],h=b[8],K=h*l-x*g,j=-h*n+x*u,m=g*n-l*u,i=c*K+d*j+e*m;if(!i)return null;i=1/i;a[0]=K*i;a[1]=(-h*d+e*g)*i;a[2]=(x*
d-e*l)*i;a[3]=j*i;a[4]=(h*c-e*u)*i;a[5]=(-x*c+e*n)*i;a[6]=m*i;a[7]=(-g*c+d*u)*i;a[8]=(l*c-d*n)*i;return a},adjoint:function(a,b){var c=b[0],d=b[1],e=b[2],n=b[3],l=b[4],x=b[5],u=b[6],g=b[7],h=b[8];a[0]=l*h-x*g;a[1]=e*g-d*h;a[2]=d*x-e*l;a[3]=x*u-n*h;a[4]=c*h-e*u;a[5]=e*n-c*x;a[6]=n*g-l*u;a[7]=d*u-c*g;a[8]=c*l-d*n;return a},determinant:function(a){var b=a[3],c=a[4],d=a[5],e=a[6],n=a[7],l=a[8];return a[0]*(l*c-d*n)+a[1]*(-l*b+d*e)+a[2]*(n*b-c*e)},multiply:function(a,b,c){var d=b[0],e=b[1],n=b[2],l=b[3],
x=b[4],u=b[5],g=b[6],h=b[7];b=b[8];var j=c[0],m=c[1],i=c[2],k=c[3],q=c[4],t=c[5],s=c[6],r=c[7];c=c[8];a[0]=j*d+m*l+i*g;a[1]=j*e+m*x+i*h;a[2]=j*n+m*u+i*b;a[3]=k*d+q*l+t*g;a[4]=k*e+q*x+t*h;a[5]=k*n+q*u+t*b;a[6]=s*d+r*l+c*g;a[7]=s*e+r*x+c*h;a[8]=s*n+r*u+c*b;return a}};d.mul=d.multiply;d.translate=function(a,b,c){var d=b[0],e=b[1],n=b[2],l=b[3],x=b[4],u=b[5],g=b[6],h=b[7];b=b[8];var j=c[0];c=c[1];a[0]=d;a[1]=e;a[2]=n;a[3]=l;a[4]=x;a[5]=u;a[6]=j*d+c*l+g;a[7]=j*e+c*x+h;a[8]=j*n+c*u+b;return a};d.rotate=
function(a,b,c){var d=b[0],e=b[1],n=b[2],l=b[3],x=b[4],u=b[5],g=b[6],h=b[7];b=b[8];var j=Math.sin(c);c=Math.cos(c);a[0]=c*d+j*l;a[1]=c*e+j*x;a[2]=c*n+j*u;a[3]=c*l-j*d;a[4]=c*x-j*e;a[5]=c*u-j*n;a[6]=g;a[7]=h;a[8]=b;return a};d.scale=function(a,b,c){var d=c[0];c=c[1];a[0]=d*b[0];a[1]=d*b[1];a[2]=d*b[2];a[3]=c*b[3];a[4]=c*b[4];a[5]=c*b[5];a[6]=b[6];a[7]=b[7];a[8]=b[8];return a};d.fromMat2d=function(a,b){a[0]=b[0];a[1]=b[1];a[2]=0;a[3]=b[2];a[4]=b[3];a[5]=0;a[6]=b[4];a[7]=b[5];a[8]=1;return a};d.fromQuat=
function(a,b){var c=b[0],d=b[1],e=b[2],n=b[3],l=c+c,x=d+d,u=e+e,c=c*l,g=d*l,d=d*x,h=e*l,j=e*x,e=e*u,l=n*l,x=n*x,n=n*u;a[0]=1-d-e;a[3]=g-n;a[6]=h+x;a[1]=g+n;a[4]=1-c-e;a[7]=j-l;a[2]=h-x;a[5]=j+l;a[8]=1-c-d;return a};d.normalFromMat4=function(a,b){var c=b[0],d=b[1],e=b[2],n=b[3],l=b[4],x=b[5],u=b[6],g=b[7],h=b[8],j=b[9],m=b[10],i=b[11],k=b[12],q=b[13],t=b[14],s=b[15],r=c*x-d*l,z=c*u-e*l,w=c*g-n*l,A=d*u-e*x,E=d*g-n*x,F=e*g-n*u,G=h*q-j*k,H=h*t-m*k,h=h*s-i*k,I=j*t-m*q,j=j*s-i*q,m=m*s-i*t,i=r*m-z*j+w*I+
A*h-E*H+F*G;if(!i)return null;i=1/i;a[0]=(x*m-u*j+g*I)*i;a[1]=(u*h-l*m-g*H)*i;a[2]=(l*j-x*h+g*G)*i;a[3]=(e*j-d*m-n*I)*i;a[4]=(c*m-e*h+n*H)*i;a[5]=(d*h-c*j-n*G)*i;a[6]=(q*F-t*E+s*A)*i;a[7]=(t*w-k*F-s*z)*i;a[8]=(k*E-q*w+s*r)*i;return a};d.str=function(a){return"mat3("+a[0]+", "+a[1]+", "+a[2]+", "+a[3]+", "+a[4]+", "+a[5]+", "+a[6]+", "+a[7]+", "+a[8]+")"};d.frob=function(a){return Math.sqrt(Math.pow(a[0],2)+Math.pow(a[1],2)+Math.pow(a[2],2)+Math.pow(a[3],2)+Math.pow(a[4],2)+Math.pow(a[5],2)+Math.pow(a[6],
2)+Math.pow(a[7],2)+Math.pow(a[8],2))};"undefined"!==typeof a&&(a.mat3=d);var r={create:function(){var a=new c(16);a[0]=1;a[1]=0;a[2]=0;a[3]=0;a[4]=0;a[5]=1;a[6]=0;a[7]=0;a[8]=0;a[9]=0;a[10]=1;a[11]=0;a[12]=0;a[13]=0;a[14]=0;a[15]=1;return a},clone:function(a){var b=new c(16);b[0]=a[0];b[1]=a[1];b[2]=a[2];b[3]=a[3];b[4]=a[4];b[5]=a[5];b[6]=a[6];b[7]=a[7];b[8]=a[8];b[9]=a[9];b[10]=a[10];b[11]=a[11];b[12]=a[12];b[13]=a[13];b[14]=a[14];b[15]=a[15];return b},copy:function(a,b){a[0]=b[0];a[1]=b[1];a[2]=
b[2];a[3]=b[3];a[4]=b[4];a[5]=b[5];a[6]=b[6];a[7]=b[7];a[8]=b[8];a[9]=b[9];a[10]=b[10];a[11]=b[11];a[12]=b[12];a[13]=b[13];a[14]=b[14];a[15]=b[15];return a},identity:function(a){a[0]=1;a[1]=0;a[2]=0;a[3]=0;a[4]=0;a[5]=1;a[6]=0;a[7]=0;a[8]=0;a[9]=0;a[10]=1;a[11]=0;a[12]=0;a[13]=0;a[14]=0;a[15]=1;return a},transpose:function(a,b){if(a===b){var c=b[1],d=b[2],e=b[3],n=b[6],l=b[7],g=b[11];a[1]=b[4];a[2]=b[8];a[3]=b[12];a[4]=c;a[6]=b[9];a[7]=b[13];a[8]=d;a[9]=n;a[11]=b[14];a[12]=e;a[13]=l;a[14]=g}else a[0]=
b[0],a[1]=b[4],a[2]=b[8],a[3]=b[12],a[4]=b[1],a[5]=b[5],a[6]=b[9],a[7]=b[13],a[8]=b[2],a[9]=b[6],a[10]=b[10],a[11]=b[14],a[12]=b[3],a[13]=b[7],a[14]=b[11],a[15]=b[15];return a},invert:function(a,b){var c=b[0],d=b[1],e=b[2],n=b[3],l=b[4],g=b[5],u=b[6],h=b[7],j=b[8],m=b[9],i=b[10],k=b[11],q=b[12],t=b[13],s=b[14],r=b[15],z=c*g-d*l,w=c*u-e*l,B=c*h-n*l,A=d*u-e*g,E=d*h-n*g,F=e*h-n*u,G=j*t-m*q,H=j*s-i*q,I=j*r-k*q,L=m*s-i*t,M=m*r-k*t,O=i*r-k*s,D=z*O-w*M+B*L+A*I-E*H+F*G;if(!D)return null;D=1/D;a[0]=(g*O-u*
M+h*L)*D;a[1]=(e*M-d*O-n*L)*D;a[2]=(t*F-s*E+r*A)*D;a[3]=(i*E-m*F-k*A)*D;a[4]=(u*I-l*O-h*H)*D;a[5]=(c*O-e*I+n*H)*D;a[6]=(s*B-q*F-r*w)*D;a[7]=(j*F-i*B+k*w)*D;a[8]=(l*M-g*I+h*G)*D;a[9]=(d*I-c*M-n*G)*D;a[10]=(q*E-t*B+r*z)*D;a[11]=(m*B-j*E-k*z)*D;a[12]=(g*H-l*L-u*G)*D;a[13]=(c*L-d*H+e*G)*D;a[14]=(t*w-q*A-s*z)*D;a[15]=(j*A-m*w+i*z)*D;return a},adjoint:function(a,b){var c=b[0],d=b[1],e=b[2],n=b[3],l=b[4],g=b[5],h=b[6],j=b[7],m=b[8],i=b[9],k=b[10],q=b[11],t=b[12],s=b[13],r=b[14],z=b[15];a[0]=g*(k*z-q*r)-
i*(h*z-j*r)+s*(h*q-j*k);a[1]=-(d*(k*z-q*r)-i*(e*z-n*r)+s*(e*q-n*k));a[2]=d*(h*z-j*r)-g*(e*z-n*r)+s*(e*j-n*h);a[3]=-(d*(h*q-j*k)-g*(e*q-n*k)+i*(e*j-n*h));a[4]=-(l*(k*z-q*r)-m*(h*z-j*r)+t*(h*q-j*k));a[5]=c*(k*z-q*r)-m*(e*z-n*r)+t*(e*q-n*k);a[6]=-(c*(h*z-j*r)-l*(e*z-n*r)+t*(e*j-n*h));a[7]=c*(h*q-j*k)-l*(e*q-n*k)+m*(e*j-n*h);a[8]=l*(i*z-q*s)-m*(g*z-j*s)+t*(g*q-j*i);a[9]=-(c*(i*z-q*s)-m*(d*z-n*s)+t*(d*q-n*i));a[10]=c*(g*z-j*s)-l*(d*z-n*s)+t*(d*j-n*g);a[11]=-(c*(g*q-j*i)-l*(d*q-n*i)+m*(d*j-n*g));a[12]=
-(l*(i*r-k*s)-m*(g*r-h*s)+t*(g*k-h*i));a[13]=c*(i*r-k*s)-m*(d*r-e*s)+t*(d*k-e*i);a[14]=-(c*(g*r-h*s)-l*(d*r-e*s)+t*(d*h-e*g));a[15]=c*(g*k-h*i)-l*(d*k-e*i)+m*(d*h-e*g);return a},determinant:function(a){var b=a[0],c=a[1],d=a[2],e=a[3],n=a[4],l=a[5],g=a[6],h=a[7],j=a[8],i=a[9],m=a[10],k=a[11],q=a[12],s=a[13],t=a[14];a=a[15];return(b*l-c*n)*(m*a-k*t)-(b*g-d*n)*(i*a-k*s)+(b*h-e*n)*(i*t-m*s)+(c*g-d*l)*(j*a-k*q)-(c*h-e*l)*(j*t-m*q)+(d*h-e*g)*(j*s-i*q)},multiply:function(a,b,c){var d=b[0],e=b[1],n=b[2],
l=b[3],g=b[4],h=b[5],j=b[6],i=b[7],m=b[8],k=b[9],q=b[10],s=b[11],t=b[12],r=b[13],z=b[14];b=b[15];var w=c[0],C=c[1],B=c[2],A=c[3];a[0]=w*d+C*g+B*m+A*t;a[1]=w*e+C*h+B*k+A*r;a[2]=w*n+C*j+B*q+A*z;a[3]=w*l+C*i+B*s+A*b;w=c[4];C=c[5];B=c[6];A=c[7];a[4]=w*d+C*g+B*m+A*t;a[5]=w*e+C*h+B*k+A*r;a[6]=w*n+C*j+B*q+A*z;a[7]=w*l+C*i+B*s+A*b;w=c[8];C=c[9];B=c[10];A=c[11];a[8]=w*d+C*g+B*m+A*t;a[9]=w*e+C*h+B*k+A*r;a[10]=w*n+C*j+B*q+A*z;a[11]=w*l+C*i+B*s+A*b;w=c[12];C=c[13];B=c[14];A=c[15];a[12]=w*d+C*g+B*m+A*t;a[13]=
w*e+C*h+B*k+A*r;a[14]=w*n+C*j+B*q+A*z;a[15]=w*l+C*i+B*s+A*b;return a}};r.mul=r.multiply;r.translate=function(a,b,c){var d=c[0],e=c[1];c=c[2];var n,l,g,h,j,i,m,k,q,s,t,r;b===a?(a[12]=b[0]*d+b[4]*e+b[8]*c+b[12],a[13]=b[1]*d+b[5]*e+b[9]*c+b[13],a[14]=b[2]*d+b[6]*e+b[10]*c+b[14],a[15]=b[3]*d+b[7]*e+b[11]*c+b[15]):(n=b[0],l=b[1],g=b[2],h=b[3],j=b[4],i=b[5],m=b[6],k=b[7],q=b[8],s=b[9],t=b[10],r=b[11],a[0]=n,a[1]=l,a[2]=g,a[3]=h,a[4]=j,a[5]=i,a[6]=m,a[7]=k,a[8]=q,a[9]=s,a[10]=t,a[11]=r,a[12]=n*d+j*e+q*c+
b[12],a[13]=l*d+i*e+s*c+b[13],a[14]=g*d+m*e+t*c+b[14],a[15]=h*d+k*e+r*c+b[15]);return a};r.scale=function(a,b,c){var d=c[0],e=c[1];c=c[2];a[0]=b[0]*d;a[1]=b[1]*d;a[2]=b[2]*d;a[3]=b[3]*d;a[4]=b[4]*e;a[5]=b[5]*e;a[6]=b[6]*e;a[7]=b[7]*e;a[8]=b[8]*c;a[9]=b[9]*c;a[10]=b[10]*c;a[11]=b[11]*c;a[12]=b[12];a[13]=b[13];a[14]=b[14];a[15]=b[15];return a};r.rotate=function(a,c,d,e){var g=e[0],n=e[1];e=e[2];var l=Math.sqrt(g*g+n*n+e*e),h,j,i,m,k,q,s,t,r,z,w,Q,C,B,A,E,F,G,H,I;if(Math.abs(l)<b)return null;l=1/l;g*=
l;n*=l;e*=l;h=Math.sin(d);j=Math.cos(d);i=1-j;d=c[0];l=c[1];m=c[2];k=c[3];q=c[4];s=c[5];t=c[6];r=c[7];z=c[8];w=c[9];Q=c[10];C=c[11];B=g*g*i+j;A=n*g*i+e*h;E=e*g*i-n*h;F=g*n*i-e*h;G=n*n*i+j;H=e*n*i+g*h;I=g*e*i+n*h;g=n*e*i-g*h;n=e*e*i+j;a[0]=d*B+q*A+z*E;a[1]=l*B+s*A+w*E;a[2]=m*B+t*A+Q*E;a[3]=k*B+r*A+C*E;a[4]=d*F+q*G+z*H;a[5]=l*F+s*G+w*H;a[6]=m*F+t*G+Q*H;a[7]=k*F+r*G+C*H;a[8]=d*I+q*g+z*n;a[9]=l*I+s*g+w*n;a[10]=m*I+t*g+Q*n;a[11]=k*I+r*g+C*n;c!==a&&(a[12]=c[12],a[13]=c[13],a[14]=c[14],a[15]=c[15]);return a};
r.rotateX=function(a,b,c){var d=Math.sin(c);c=Math.cos(c);var e=b[4],g=b[5],l=b[6],h=b[7],j=b[8],i=b[9],m=b[10],k=b[11];b!==a&&(a[0]=b[0],a[1]=b[1],a[2]=b[2],a[3]=b[3],a[12]=b[12],a[13]=b[13],a[14]=b[14],a[15]=b[15]);a[4]=e*c+j*d;a[5]=g*c+i*d;a[6]=l*c+m*d;a[7]=h*c+k*d;a[8]=j*c-e*d;a[9]=i*c-g*d;a[10]=m*c-l*d;a[11]=k*c-h*d;return a};r.rotateY=function(a,b,c){var d=Math.sin(c);c=Math.cos(c);var e=b[0],g=b[1],l=b[2],h=b[3],j=b[8],i=b[9],m=b[10],k=b[11];b!==a&&(a[4]=b[4],a[5]=b[5],a[6]=b[6],a[7]=b[7],
a[12]=b[12],a[13]=b[13],a[14]=b[14],a[15]=b[15]);a[0]=e*c-j*d;a[1]=g*c-i*d;a[2]=l*c-m*d;a[3]=h*c-k*d;a[8]=e*d+j*c;a[9]=g*d+i*c;a[10]=l*d+m*c;a[11]=h*d+k*c;return a};r.rotateZ=function(a,b,c){var d=Math.sin(c);c=Math.cos(c);var e=b[0],g=b[1],l=b[2],h=b[3],j=b[4],i=b[5],m=b[6],k=b[7];b!==a&&(a[8]=b[8],a[9]=b[9],a[10]=b[10],a[11]=b[11],a[12]=b[12],a[13]=b[13],a[14]=b[14],a[15]=b[15]);a[0]=e*c+j*d;a[1]=g*c+i*d;a[2]=l*c+m*d;a[3]=h*c+k*d;a[4]=j*c-e*d;a[5]=i*c-g*d;a[6]=m*c-l*d;a[7]=k*c-h*d;return a};r.fromRotationTranslation=
function(a,b,c){var d=b[0],e=b[1],g=b[2],h=b[3],j=d+d,i=e+e,m=g+g;b=d*j;var k=d*i,d=d*m,q=e*i,e=e*m,g=g*m,j=h*j,i=h*i,h=h*m;a[0]=1-(q+g);a[1]=k+h;a[2]=d-i;a[3]=0;a[4]=k-h;a[5]=1-(b+g);a[6]=e+j;a[7]=0;a[8]=d+i;a[9]=e-j;a[10]=1-(b+q);a[11]=0;a[12]=c[0];a[13]=c[1];a[14]=c[2];a[15]=1;return a};r.fromQuat=function(a,b){var c=b[0],d=b[1],e=b[2],g=b[3],h=c+c,j=d+d,i=e+e,c=c*h,m=d*h,d=d*j,k=e*h,q=e*j,e=e*i,h=g*h,j=g*j,g=g*i;a[0]=1-d-e;a[1]=m+g;a[2]=k-j;a[3]=0;a[4]=m-g;a[5]=1-c-e;a[6]=q+h;a[7]=0;a[8]=k+j;
a[9]=q-h;a[10]=1-c-d;a[11]=0;a[12]=0;a[13]=0;a[14]=0;a[15]=1;return a};r.frustum=function(a,b,c,d,e,g,h){var j=1/(c-b),i=1/(e-d),m=1/(g-h);a[0]=2*g*j;a[1]=0;a[2]=0;a[3]=0;a[4]=0;a[5]=2*g*i;a[6]=0;a[7]=0;a[8]=(c+b)*j;a[9]=(e+d)*i;a[10]=(h+g)*m;a[11]=-1;a[12]=0;a[13]=0;a[14]=2*(h*g)*m;a[15]=0;return a};r.perspective=function(a,b,c,d,e){b=1/Math.tan(b/2);var g=1/(d-e);a[0]=b/c;a[1]=0;a[2]=0;a[3]=0;a[4]=0;a[5]=b;a[6]=0;a[7]=0;a[8]=0;a[9]=0;a[10]=(e+d)*g;a[11]=-1;a[12]=0;a[13]=0;a[14]=2*e*d*g;a[15]=0;
return a};r.ortho=function(a,b,c,d,e,g,h){var j=1/(b-c),i=1/(d-e),m=1/(g-h);a[0]=-2*j;a[1]=0;a[2]=0;a[3]=0;a[4]=0;a[5]=-2*i;a[6]=0;a[7]=0;a[8]=0;a[9]=0;a[10]=2*m;a[11]=0;a[12]=(b+c)*j;a[13]=(e+d)*i;a[14]=(h+g)*m;a[15]=1;return a};r.lookAt=function(a,c,d,e){var g,h,j,i,m,k,q,s,t=c[0],z=c[1];c=c[2];j=e[0];i=e[1];h=e[2];q=d[0];e=d[1];g=d[2];if(Math.abs(t-q)<b&&Math.abs(z-e)<b&&Math.abs(c-g)<b)return r.identity(a);d=t-q;e=z-e;q=c-g;s=1/Math.sqrt(d*d+e*e+q*q);d*=s;e*=s;q*=s;g=i*q-h*e;h=h*d-j*q;j=j*e-i*
d;(s=Math.sqrt(g*g+h*h+j*j))?(s=1/s,g*=s,h*=s,j*=s):j=h=g=0;i=e*j-q*h;m=q*g-d*j;k=d*h-e*g;(s=Math.sqrt(i*i+m*m+k*k))?(s=1/s,i*=s,m*=s,k*=s):k=m=i=0;a[0]=g;a[1]=i;a[2]=d;a[3]=0;a[4]=h;a[5]=m;a[6]=e;a[7]=0;a[8]=j;a[9]=k;a[10]=q;a[11]=0;a[12]=-(g*t+h*z+j*c);a[13]=-(i*t+m*z+k*c);a[14]=-(d*t+e*z+q*c);a[15]=1;return a};r.str=function(a){return"mat4("+a[0]+", "+a[1]+", "+a[2]+", "+a[3]+", "+a[4]+", "+a[5]+", "+a[6]+", "+a[7]+", "+a[8]+", "+a[9]+", "+a[10]+", "+a[11]+", "+a[12]+", "+a[13]+", "+a[14]+", "+
a[15]+")"};r.frob=function(a){return Math.sqrt(Math.pow(a[0],2)+Math.pow(a[1],2)+Math.pow(a[2],2)+Math.pow(a[3],2)+Math.pow(a[4],2)+Math.pow(a[5],2)+Math.pow(a[6],2)+Math.pow(a[7],2)+Math.pow(a[8],2)+Math.pow(a[9],2)+Math.pow(a[10],2)+Math.pow(a[11],2)+Math.pow(a[12],2)+Math.pow(a[13],2)+Math.pow(a[14],2)+Math.pow(a[15],2))};"undefined"!==typeof a&&(a.mat4=r);var m={create:function(){var a=new c(4);a[0]=0;a[1]=0;a[2]=0;a[3]=1;return a}},q=g.create(),s=g.fromValues(1,0,0),t=g.fromValues(0,1,0);m.rotationTo=
function(a,b,c){var d=g.dot(b,c);if(-0.999999>d)return g.cross(q,s,b),1E-6>g.length(q)&&g.cross(q,t,b),g.normalize(q,q),m.setAxisAngle(a,q,Math.PI),a;if(0.999999<d)return a[0]=0,a[1]=0,a[2]=0,a[3]=1,a;g.cross(q,b,c);a[0]=q[0];a[1]=q[1];a[2]=q[2];a[3]=1+d;return m.normalize(a,a)};var z=d.create();m.setAxes=function(a,b,c,d){z[0]=c[0];z[3]=c[1];z[6]=c[2];z[1]=d[0];z[4]=d[1];z[7]=d[2];z[2]=-b[0];z[5]=-b[1];z[8]=-b[2];return m.normalize(a,m.fromMat3(a,z))};m.clone=i.clone;m.fromValues=i.fromValues;m.copy=
i.copy;m.set=i.set;m.identity=function(a){a[0]=0;a[1]=0;a[2]=0;a[3]=1;return a};m.setAxisAngle=function(a,b,c){c*=0.5;var d=Math.sin(c);a[0]=d*b[0];a[1]=d*b[1];a[2]=d*b[2];a[3]=Math.cos(c);return a};m.add=i.add;m.multiply=function(a,b,c){var d=b[0],e=b[1],g=b[2];b=b[3];var h=c[0],j=c[1],i=c[2];c=c[3];a[0]=d*c+b*h+e*i-g*j;a[1]=e*c+b*j+g*h-d*i;a[2]=g*c+b*i+d*j-e*h;a[3]=b*c-d*h-e*j-g*i;return a};m.mul=m.multiply;m.scale=i.scale;m.rotateX=function(a,b,c){c*=0.5;var d=b[0],e=b[1],g=b[2];b=b[3];var h=Math.sin(c);
c=Math.cos(c);a[0]=d*c+b*h;a[1]=e*c+g*h;a[2]=g*c-e*h;a[3]=b*c-d*h;return a};m.rotateY=function(a,b,c){c*=0.5;var d=b[0],e=b[1],g=b[2];b=b[3];var h=Math.sin(c);c=Math.cos(c);a[0]=d*c-g*h;a[1]=e*c+b*h;a[2]=g*c+d*h;a[3]=b*c-e*h;return a};m.rotateZ=function(a,b,c){c*=0.5;var d=b[0],e=b[1],g=b[2];b=b[3];var h=Math.sin(c);c=Math.cos(c);a[0]=d*c+e*h;a[1]=e*c-d*h;a[2]=g*c+b*h;a[3]=b*c-g*h;return a};m.calculateW=function(a,b){var c=b[0],d=b[1],e=b[2];a[0]=c;a[1]=d;a[2]=e;a[3]=Math.sqrt(Math.abs(1-c*c-d*d-
e*e));return a};m.dot=i.dot;m.lerp=i.lerp;m.slerp=function(a,b,c,d){var e=b[0],g=b[1],h=b[2];b=b[3];var j=c[0],i=c[1],m=c[2];c=c[3];var k,q,s;q=e*j+g*i+h*m+b*c;0>q&&(q=-q,j=-j,i=-i,m=-m,c=-c);1E-6<1-q?(k=Math.acos(q),s=Math.sin(k),q=Math.sin((1-d)*k)/s,d=Math.sin(d*k)/s):q=1-d;a[0]=q*e+d*j;a[1]=q*g+d*i;a[2]=q*h+d*m;a[3]=q*b+d*c;return a};m.invert=function(a,b){var c=b[0],d=b[1],e=b[2],g=b[3],h=c*c+d*d+e*e+g*g,h=h?1/h:0;a[0]=-c*h;a[1]=-d*h;a[2]=-e*h;a[3]=g*h;return a};m.conjugate=function(a,b){a[0]=
-b[0];a[1]=-b[1];a[2]=-b[2];a[3]=b[3];return a};m.length=i.length;m.len=m.length;m.squaredLength=i.squaredLength;m.sqrLen=m.squaredLength;m.normalize=i.normalize;m.fromMat3=function(a,b){var c=b[0]+b[4]+b[8];if(0<c)c=Math.sqrt(c+1),a[3]=0.5*c,c=0.5/c,a[0]=(b[5]-b[7])*c,a[1]=(b[6]-b[2])*c,a[2]=(b[1]-b[3])*c;else{var d=0;b[4]>b[0]&&(d=1);b[8]>b[3*d+d]&&(d=2);var e=(d+1)%3,g=(d+2)%3,c=Math.sqrt(b[3*d+d]-b[3*e+e]-b[3*g+g]+1);a[d]=0.5*c;c=0.5/c;a[3]=(b[3*e+g]-b[3*g+e])*c;a[e]=(b[3*e+d]+b[3*d+e])*c;a[g]=
(b[3*g+d]+b[3*d+g])*c}return a};m.str=function(a){return"quat("+a[0]+", "+a[1]+", "+a[2]+", "+a[3]+")"};"undefined"!==typeof a&&(a.quat=m)})(GLMAT);try{module.exports=GLMAT}catch(e$$10){}try{glm.exists&&alert("glm.common.js loaded over exist glm instance: "+glm)}catch(e$$11){}glm=null;GLMJS_PREFIX="glm-js: ";
GLM={$DEBUG:"undefined"!==typeof $GLM_DEBUG&&$GLM_DEBUG,version:"0.0.6c",GLM_VERSION:96,$outer:{polyfills:GLM_polyfills(),functions:{},intern:function(a,b){if(a)if(void 0===b&&"object"===typeof a)for(var c in a)GLM.$outer.intern(c,a[c]);else return GLM.$DEBUG&&GLM.$outer.console.debug("intern "+a,b&&(b.name||typeof b)),GLM.$outer[a]=b},$import:function(a){GLM.$outer.$import=function(){throw Error("glm.$outer.$import already called...");};GLM.$outer.intern(a.statics);GLM.$template.extend(GLM,GLM.$template["declare<T,V,number>"](a["declare<T,V,number>"]),
GLM.$template["declare<T,V,...>"](a["declare<T,V,...>"]),GLM.$template["declare<T,...>"](a["declare<T,...>"]),GLM.$template["declare<T>"](a["declare<T>"]));GLM.$init(a)},console:$GLM_reset_logging(),quat_array_from_xyz:function(a){var b=glm.quat(),c=glm.mat3(1);b["*="](glm.angleAxis(a.x,c[0]));b["*="](glm.angleAxis(a.y,c[1]));b["*="](glm.angleAxis(a.z,c[2]));return b.elements},Array:Array,ArrayBuffer:ArrayBuffer,Float32Array:Float32Array,Float64Array:Float64Array,Uint8Array:Uint8Array,Uint16Array:Uint16Array,
Uint32Array:Uint32Array,Int8Array:Int8Array,Int16Array:Int16Array,Int32Array:Int32Array,DataView:"undefined"!==typeof DataView&&DataView,$rebindTypedArrays:function(a){var b=Object.keys(GLM.$outer).filter(RegExp.prototype.test.bind(/.Array$|^ArrayBuffer$|^DataView$/)).map(function(b){var e=a.call(this,b,GLM.$outer[b]);e!==GLM.$outer[b]&&(GLM.$outer.console.warn("$rebindTypedArrays("+b+")... replacing"),GLM.$outer[b]=e);return e});GLM.$subarray=GLM.patch_subarray();return b}},$extern:$GLM_extern,$log:$GLM_log,
GLMJSError:$GLM_GLMJSError("GLMJSError"),_radians:function(a){return a*this.PI/180}.bind(Math),_degrees:function(a){return 180*a/this.PI}.bind(Math),normalize:$GLM_extern("normalize"),inverse:$GLM_extern("inverse"),distance:$GLM_extern("distance"),length:$GLM_extern("length"),length2:$GLM_extern("length2"),transpose:$GLM_extern("transpose"),slerp:$GLM_extern("slerp"),mix:$GLM_extern("mix"),clamp:$GLM_extern("clamp"),angleAxis:$GLM_extern("angleAxis"),rotate:$GLM_extern("rotate"),scale:$GLM_extern("scale"),
translate:$GLM_extern("translate"),lookAt:$GLM_extern("lookAt"),cross:$GLM_extern("cross"),dot:$GLM_extern("dot"),perspective:function(a,b,c,e){return GLM.$outer.mat4_perspective(a,b,c,e)},ortho:function(a,b,c,e,d,h){return GLM.$outer.mat4_ortho(a,b,c,e,d,h)},_eulerAngles:function(a){return GLM.$outer.vec3_eulerAngles(a)},angle:function(a){return 2*Math.acos(a.w)},axis:function(a){var b=1-a.w*a.w;if(0>=b)return glm.vec3(0,0,1);b=1/Math.sqrt(b);return glm.vec3(a.x*b,a.y*b,a.z*b)},$from_ptr:function(a,
b,c){if(this!==GLM)throw new GLM.GLMJSError("... use glm.make_<type>() (not new glm.make<type>())");b=new GLM.$outer.Float32Array(b.buffer||b,c||0,a.componentLength);b=new GLM.$outer.Float32Array(b);return new a(b)},make_vec2:function(a,b){return GLM.$from_ptr.call(this,GLM.vec2,a,2===arguments.length?b:a.byteOffset)},make_vec3:function(a,b){return GLM.$from_ptr.call(this,GLM.vec3,a,2===arguments.length?b:a.byteOffset)},make_vec4:function(a,b){return GLM.$from_ptr.call(this,GLM.vec4,a,2===arguments.length?
b:a.byteOffset)},make_quat:function(a,b){return GLM.$from_ptr.call(this,GLM.quat,a,2===arguments.length?b:a.byteOffset)},make_mat3:function(a,b){return GLM.$from_ptr.call(this,GLM.mat3,a,2===arguments.length?b:a.byteOffset)},make_mat4:function(a,b){return GLM.$from_ptr.call(this,GLM.mat4,a,2===arguments.length?b:a.byteOffset)},diagonal4x4:function(a){if("vec4"!==GLM.$typeof(a))throw new GLM.GLMJSError("unsupported argtype to GLM.diagonal4x4: "+["type:"+GLM.$typeof(a)]);a=a.elements;return new GLM.mat4([a[0],
0,0,0,0,a[1],0,0,0,0,a[2],0,0,0,0,a[3]])},diagonal3x3:function(a){if("vec3"!==GLM.$typeof(a))throw new GLM.GLMJSError("unsupported argtype to GLM.diagonal3x3: "+["type:"+GLM.$typeof(a)]);a=a.elements;return new GLM.mat3([a[0],0,0,0,a[1],0,0,0,a[2]])},_toMat4:function(a){return new GLM.mat4(GLM.$outer.mat4_array_from_quat(a))},FAITHFUL:!0,to_string:function(a,b){try{var c=a.$type||typeof a;if(!GLM[c])throw new GLM.GLMJSError("unsupported argtype to GLM.to_string: "+["type:"+c,a]);return GLM.FAITHFUL?
GLM.$to_string(a,b).replace(/[\t\n]/g,""):GLM.$to_string(a,b)}catch(e){return GLM.$DEBUG&&GLM.$outer.console.error("to_string error: ",c,a+"",e),e+""}},$sizeof:function(a){return a.BYTES_PER_ELEMENT},$types:[],$isGLMConstructor:function(a){return!!(a&&a.prototype instanceof GLM.$GLMBaseType)},$getGLMType:function(a){return a instanceof GLM.$GLMBaseType&&a.constructor||"string"===typeof a&&GLM[a]},$isGLMObject:function(a){return!!(a instanceof GLM.$GLMBaseType&&a.$type)},$typeof:function(a){return a instanceof
GLM.$GLMBaseType?a.$type:"undefined"},$to_array:function(a){return[].slice.call(a.elements)},$to_json:function(a,b,c){this instanceof GLM.$GLMBaseType&&(c=b,b=a,a=this);return JSON.stringify(GLM.$to_object(a),b,c)},$inspect:function(a){this instanceof GLM.$GLMBaseType&&(a=this);return GLM.$to_json(a,null,2)},_clamp:function(a,b,c){return a<b?b:a>c?c:a},_abs:function(a){return Math.abs(a)},_equal:function(a,b){return a===b},_epsilonEqual:function(a,b,c){return Math.abs(a-b)<c},_fract:function(a){return a-
Math.floor(a)},_frexp:function(){function a(b,c){var e=GLM.$outer.DataView||a._DataView;if(0==b)return c&&Array.isArray(c)?c[0]=c[1]=0:[0,0];e=new e(new GLM.$outer.ArrayBuffer(8));e.setFloat64(0,b);var d=e.getUint32(0)>>>20&2047;0===d&&(e.setFloat64(0,b*Math.pow(2,64)),d=(e.getUint32(0)>>>20&2047)-64);e=d-1022;d=GLM.ldexp(b,-e);return c&&Array.isArray(c)?(c[0]=e,c[1]=d):[d,e]}a._DataView=function(a){this.buffer=a;this.setFloat64=function(a,b){if(0!==a)throw Error("...this is a very limited DataView emulator");
(new Uint8Array(this.buffer)).set([].reverse.call(new Uint8Array((new Float64Array([b])).buffer)),a)};this.getUint32=function(a){if(0!==a)throw Error("...this is a very limited DataView emulator");return(new Uint32Array((new Uint8Array([].slice.call(new Uint8Array(this.buffer)).reverse())).buffer))[1]}};return a}(),_ldexp:function(a,b){return 1023<b?a*Math.pow(2,1023)*Math.pow(2,b-1023):-1074>b?a*Math.pow(2,-1074)*Math.pow(2,b+1074):a*Math.pow(2,b)},_max:Math.max,_min:Math.min,sqrt:Math.sqrt,__sign:function(a){return 0<
a?1:0>a?-1:+a},$constants:{epsilon:1E-6,euler:0.5772156649015329,e:Math.E,ln_ten:Math.LN10,ln_two:Math.LN2,pi:Math.PI,half_pi:Math.PI/2,quarter_pi:Math.PI/4,one_over_pi:1/Math.PI,two_over_pi:2/Math.PI,root_pi:Math.sqrt(Math.PI),root_two:Math.sqrt(2),root_three:Math.sqrt(3),two_over_root_pi:2/Math.sqrt(Math.PI),one_over_root_two:Math.SQRT1_2,root_two:Math.SQRT2},FIXEDPRECISION:6,$toFixedString:function(a,b,c,e){void 0===e&&(e=GLM.FIXEDPRECISION);if(!c||!c.map)throw Error("unsupported argtype to $toFixedString(..,..,props="+
typeof c+")");try{var d="";c.map(function(c){c=b[d=c];if(!c.toFixed)throw Error("!toFixed in w"+[c,a,JSON.stringify(b)]);return c.toFixed(0)})}catch(h){throw GLM.$DEBUG&&GLM.$outer.console.error("$toFixedString error",a,typeof b,Object.prototype.toString.call(b),d),GLM.$DEBUG&&glm.$log("$toFixedString error",a,typeof b,Object.prototype.toString.call(b),d),new GLM.GLMJSError(h);}c=c.map(function(a){return b[a].toFixed(e)});return a+"("+c.join(", ")+")"}};GLM._sign=Math.sign||GLM.__sign;
for(var p in GLM.$constants)(function(a,b){GLM[b]=function(){return a};GLM[b].valueOf=GLM[b]})(GLM.$constants[p],p);
GLM.$GLMBaseType=function(){function a(a,c){var e=a.$||{};this.$type=c;this.$type_name=e.name||"<"+c+">";e.components&&(this.$components=e.components[0]);this.$len=this.components=a.componentLength;this.constructor=a;this.byteLength=a.BYTES_PER_ELEMENT;GLM.$types.push(c)}a.prototype={clone:function(){return new this.constructor(new this.elements.constructor(this.elements))},toString:function(){return GLM.$to_string(this)},inspect:function(){return GLM.$inspect(this)},toJSON:function(){return GLM.$to_object(this)}};
Object.defineProperty(a.prototype,"address",{get:function(){var a=this.elements.byteOffset.toString(16);return"0x00000000".substr(0,10-a.length)+a}});return a}();
(function(){function a(a,b,c){return a.subarray(b,c||a.length)}function b(a,b,c){var e=a.constructor;c=c||a.length;return new e(a.buffer,a.byteOffset+b*e.BYTES_PER_ELEMENT,c-b)}function c(){var a=new GLM.$outer.Float32Array([0,0]);a.subarray(1).subarray(0)[0]=1;var b=c.result=[a[1],(new GLM.$outer.Float32Array(16)).subarray(12,16).length];return!(a[1]!==b[0]||4!==b[1])}function e(a){var b=new GLM.$outer.Float32Array([0,0]);a(a(b,1),0)[0]=1;a=e.result=[b[1],a(new GLM.$outer.Float32Array(16),12,16).length];
return!(b[1]!==a[0]||4!==a[1])}Object.defineProperty(GLM,"patch_subarray",{configurable:!0,value:function(){var d=!c()?b:a;d.workaround_broken_spidermonkey_subarray=b;d.native_subarray=a;if(!e(d))throw Error("failed to resolve working TypedArray.subarray implementation... "+e.result);return d}})})();GLM.$subarray=GLM.patch_subarray();
var GLM_template=GLM.$template={_genArgError:function(a,b,c,e){~e.indexOf(void 0)&&(e=e.slice(0,e.indexOf(void 0)));var d=RegExp.prototype.test.bind(/^[^$_]/);return new GLM.GLMJSError("unsupported argtype to "+b+" "+a.$sig+": [typ="+c+"] :: got arg types: "+e.map(GLM.$template.jstypes.get)+" // supported types: "+Object.keys(a).filter(d).join("||"))},jstypes:{get:function(a){return null===a?"null":void 0===a?"undefined":a.$type||GLM.$template.jstypes[typeof a]||GLM.$template.jstypes[a+""]||function(a){if("object"===
typeof a){if(a instanceof GLM.$outer.Float32Array)return"Float32Array";if(a instanceof GLM.$outer.ArrayBuffer)return"ArrayBuffer";if(Array.isArray(a))return"array"}return"<unknown "+[typeof a,a]+">"}(a)},"0":"float","boolean":"bool",number:"float",string:"string","[object Float32Array]":"Float32Array","[object ArrayBuffer]":"ArrayBuffer","function":"function"},_add_overrides:function(a,b){for(var c in b)b[c]&&GLM[c].override(a,b[c])},_add_inline_override:function(a,b,c){this[b]=eval(GLM.$template._traceable("glm_"+
a+"_"+b,c))();return this},_inline_helpers:function(a,b){Object.defineProperty(a,"GLM",{value:GLM});return{$type:"built-in",$type_name:b,$template:a,F:a,dbg:b,override:this._add_inline_override.bind(a,b),link:function(c){var e=a[c];e||(e=a[[c,"undefined"]]);if(!e)throw new GLM.GLMJSError("error linking direct function for "+b+"<"+c+"> or "+b+"<"+[c,void 0]+">");return/\bthis[\[.]/.test(e+"")?e.bind(a):e}}},"template<T>":function(a,b){a.$sig="template<T>";var c=GLM.$template.jstypes,e=GLM.$template._genArgError,
d=GLM.$GLMBaseType;return this.slingshot(this._inline_helpers(a,b),eval(this._traceable("Tglm_"+b,function(b){this instanceof d&&(b=this);var j=[b&&b.$type||c[typeof b]||c.get(b)||"null"];if(!a[j])throw e(a,arguments.callee.dbg,j,[b]);return a[j](b)}))())},"template<T,...>":function(a,b){a.$sig="template<T,...>";var c=GLM.$template.jstypes,e=GLM.$template._genArgError,d=GLM.$GLMBaseType;return this.slingshot(this._inline_helpers(a,b),eval(this._traceable("Tdotglm_"+b,function(b){for(var j=Array(arguments.length),
g=0;g<j.length;g++)j[g]=arguments[g];this instanceof d&&j.unshift(b=this);g=[b&&b.$type||c[typeof b]||c.get(b)||"null"];if(!a[g])throw e(a,arguments.callee.dbg,g,j);return a[g].apply(a,j)}))())},"template<T,V,number>":function(a,b){a.$sig="template<T,V,number>";var c=GLM.$template.jstypes,e=GLM.$template._genArgError,d=GLM.GLMJSError,h=GLM.$GLMBaseType;return this.slingshot(this._inline_helpers(a,b),eval(this._traceable("TVnglm_"+b,function(){for(var b=Array(arguments.length),g=0;g<b.length;g++)b[g]=
arguments[g];this instanceof h&&b.unshift(this);var g=b[0],k=b[1],b=b[2],i=[g&&g.$type||c[typeof g]||c[g+""]||"<unknown "+g+">",k&&k.$type||c[typeof k]||c[k+""]||"<unknown "+k+">"];if(!a[i])throw e(a,arguments.callee.dbg,i,[g,k,b]);if("number"!==typeof b)throw new d(arguments.callee.dbg+a.$sig+": unsupported n type: "+[typeof b,b]);return a[i](g,k,b)}))())},"template<T,V,...>":function(a,b){a.$sig="template<T,V,...>";var c=GLM.$template.jstypes,e=GLM.$GLMBaseType,d=GLM.$template._genArgError,h=GLM.$outer.Array;
return this.slingshot(this._inline_helpers(a,b),eval(this._traceable("TVglm_"+b,function(){for(var b=new h(arguments.length),g=0;g<b.length;g++)b[g]=arguments[g];this instanceof e&&b.unshift(this);var g=b[0],k=b[1],g=[g&&g.$type||c[typeof g],k&&k.$type||c[typeof k]||c[k+""]||h.isArray(k)&&"array"+k.length+""||""+k+""];if(!a[g])throw d(a,arguments.callee.dbg,g,b);return a[g].apply(a,b)}))())},override:function(a,b,c,e,d){function h(a,c){GLM.$outer.console.debug("glm.$template.override: "+b+" ... "+
Object.keys(a.$template).filter(function(a){return!~a.indexOf("$")}).map(function(a){return!~c.indexOf(a)?"*"+a+"*":a}).join(" | "))}GLM.$DEBUG&&GLM.$outer.console.debug("glm.$template.override: ",a,b,c.$op?'$op: ["'+c.$op+'"]':"");if(!e)throw Error("unspecified target group "+e+' (expected override(<TV>, "p", {TSP}, ret={GROUP}))');var j=e[b];if(j&&j.$op!==c.$op)throw Error('glm.$template.override: mismatch merging existing override: .$op "'+[j.$op,"!=",c.$op].join(" ")+'"  p='+[b,j.$op,c.$op,"||"+
Object.keys(j.$template).join("||")]);var g=GLM.$template[a](GLM.$template.deNify(c,b),b);if(j&&j.F.$sig!==g.F.$sig)throw Error('glm.$template.override: mismatch merging existing override: .$sig "'+[j&&j.F.$sig,"!=",g.F.$sig].join(" ")+'"  p='+[b,j&&j.F.$sig,g.F.$sig,"||"+Object.keys(j&&j.$template||{}).join("||")]);g.$op=c.$op;if(j){for(var k in g.$template)"$op"===k||"$sig"===k||(a=k in j.$template,!a||!0===d?(GLM.$DEBUG&&GLM.$outer.console.debug("glm.$template.override: "+b+" ... "+k+" merged"),
j.$template[k]=g.$template[k]):a&&GLM.$DEBUG&&GLM.$outer.console.debug("glm.$template.override: "+b+" ... "+k+" skipped"));if(GLM.$DEBUG){var i=[];Object.keys(j.$template).forEach(function(a){a in g.$template||(GLM.$DEBUG&&GLM.$outer.console.debug("glm.$template.override: "+b+" ... "+a+" carried-forward"),i.push(a))});h(e[b],i)}}else e[b]=g,GLM.$DEBUG&&h(e[b],[]);return e},_override:function(a,b,c){for(var e in b){if("mat4_scale"!==e&&"object"!==typeof b[e])throw new GLM.GLMJSError("expect object property overrides"+
[e,b[e],Object.keys(c)]);"object"===typeof b[e]?this.override(a,e,b[e],c,!0):ret_scale=5}return c},slingshot:function(){return this.extend.apply(this,[].reverse.call(arguments))},extend:function(a,b){[].slice.call(arguments,1).forEach(function(b){if(b)for(var e in b)b.hasOwnProperty(e)&&(a[e]=b[e])});return a},"declare<T,V,...>":function(a){return!a?{}:this._override("template<T,V,...>",a,GLM.$outer.functions)},"declare<T>":function(a){return!a?{}:this._override("template<T>",a,GLM.$outer.functions)},
"declare<T,...>":function(a){return!a?{}:this._override("template<T,...>",a,GLM.$outer.functions)},"declare<T,V,number>":function(a){return!a?{}:this._override("template<T,V,number>",a,GLM.$outer.functions)},_tojsname:function(a){return(a||"_").replace(/[^$a-zA-Z0-9_]/g,"_")},_traceable:function(a,b){var c=b;if("function"!==typeof c)throw new GLM.GLMJSError("_traceable expects tidy function as second arg "+c);if(!a)throw new GLM.GLMJSError("_traceable expects hint or what's the point"+[c,a]);a=this._tojsname(a||
"_traceable");c=c.toString().replace(/^(\s*var\s*(\w+)\s*=\s*)__VA_ARGS__;/mg,function(a,b,c){return b+"new Array(arguments.length);for(var I=0;I<varname.length;I++)varname[I]=arguments[I];".replace(/I/g,"__VA_ARGS__I").replace(/varname/g,c)}).replace(/\barguments[.]callee\b/g,a);if(/^function _traceable/.test(c))throw new GLM.GLMJSError("already wrapped in a _traceable: "+[c,a]);c='function _traceable(){ "use strict"; SRC; return HINT; }'.replace("HINT",a.replace(/[$]/g,"$$$$")).replace("SRC",c.replace(/[$]/g,
"$$$$").replace(/^function\s*\(/,"function "+a+"("));c="1,"+c;if(GLM.$DEBUG)try{eval(c)}catch(e){throw console.error("_traceable error",a,c,b,e),e;}return c},deNify:function(a,b){var c={vec:[2,3,4],mat:[3,4]},e=this._tojsname.bind(this),d;for(d in a){var h=!1;d.replace(/([vV]ec|[mM]at)(?:\w*)<N>/,function(j,g){h=!0;var k=a[d];delete a[d];c[g.toLowerCase()].forEach(function(c){var g=d.replace(/<N[*]N>/g,c*c).replace(/<N>/g,c);if(!(g in a)){var h=e("glm_"+b+"_"+g);a[g]=eval("'use strict'; 1,"+(k+"").replace(/^function\s*\(/,
"function "+h+"(").replace(/N[*]N/g,c*c).replace(/N/g,c))}})}.bind(this));/^[$]/.test(d)?GLM.$DEBUG&&GLM.$outer.console.debug("@ NOT naming "+d):!h&&("function"===typeof a[d]&&!a[d].name)&&(GLM.$DEBUG&&GLM.$outer.console.debug("naming "+e(b+"_"+d)),a[d]=eval(this._traceable("glm_"+b+"_"+d,a[d]))())}return a},$_module_stamp:+new Date,_iso:"/[*][^/*]*[*]/",_get_argnames:function(a){return(a+"").replace(/\s+/g,"").replace(RegExp(this._iso,"g"),"").split("){",1)[0].replace(/^[^(]*[(]/,"").replace(/=[^,]+/g,
"").split(",").filter(Boolean)},_fix_$_names:function(a,b){Object.keys(b).filter(function(a){return"function"===typeof b[a]&&!b[a].name}).map(function(c){var e=a+"_"+c;GLM.$DEBUG&&GLM.$outer.console.debug("naming $."+c+" == "+e,this._traceable(e,b[c]));b[c]=eval(this._traceable("glm_"+e,b[c]))()}.bind(this));return b},_typedArrayMaker:function(a,b){return function(c){if(c.length===a)return new b(c);var e=new b(a);e.set(c);return e}},GLMType:function(a,b){var c=this._fix_$_names(a,b),e=c.identity.length,
d,h=Object,j=GLM.$template._get_argnames.bind(GLM.$template),g=GLM.GLMJSError,k={},i;for(i in c)"function"===typeof c[i]&&function(a){k[i]=function(b){return a.apply(c,b)}}(c[i]);d=function(b){var d=k[typeof b[0]+b.length];if(!d){var e="glm."+a;b=e+"("+b.map(function(a){return typeof a})+")";d=h.keys(c).filter(function(a){return"function"===typeof c[a]&&/^\w+\d+$/.test(a)}).map(function(a){return e+"("+j(c[a])+")"});throw new g("no constructor found for: "+b+"\nsupported signatures:\n\t"+d.join("\n\t"));
}return d};var w,r=GLM;GLM.$template._get_argnames.bind(GLM.$template);w=function(b,c){2<r.$DEBUG&&r.$outer.console.info("adopting elements...",typeof b);if(b.length!=e){if(!1===c)return c;r.$outer.console.error(a+" elements size mismatch: "+["wanted:"+e,"handed:"+b.length]);var d=r.$subarray(b,0,e);throw new r.GLMJSError(a+" elements size mismatch: "+["wanted:"+e,"handed:"+b.length,"theoreticaly-correctable?:"+(d.length===e)]);}return b};var m=this._typedArrayMaker(e,GLM.$outer.Float32Array),q,s=
GLM.$outer;q=function(a){return a instanceof s.Float32Array};var t=function(a,b,c,g,h,i,j,k){return eval(k("glm_"+h+"$class",function(c){for(var f=new a(arguments.length),g=0;g<f.length;g++)f[g]=arguments[g];var h=d(f),g=t;if(this instanceof g)f=q(c)?w(c):m(h(f)),b.defineProperty(this,"elements",{enumerable:!1,configurable:!0,value:f});else return f=q(c)&&c.length===e?m(c):h(f),new g(f)}))()}(Array,Object,GLM,c,a,GLM.$template._get_argnames.bind(GLM.$template),GLM.GLMJSError,GLM.$template._traceable.bind(GLM.$template));
c.components=c.components?c.components.map(function(a){return"string"===typeof a?a.split(""):a}):[];t.$=c;t.componentLength=e;t.BYTES_PER_ELEMENT=e*GLM.$outer.Float32Array.BYTES_PER_ELEMENT;t.prototype=new GLM.$GLMBaseType(t,a);t.toJSON=function(){var b={glm$type:a,glm$class:t.prototype.$type_name,glm$eg:(new t).object},c;for(c in t)/function |^[$]/.test(c+t[c])||(b[c]=t[c]);return b};return t}};
GLM.$template["declare<T,V,...>"]({cross:{"vec2,vec2":function(a,b){return this.GLM.vec3(0,0,a.x*b.y-a.y*b.x)}},distance:{"vec<N>,vec<N>":function(a,b){return this.GLM.length(b.sub(a))}}});
GLM.$template["declare<T,V,number>"]({mix:{"float,float":function(a,b,c){return b*c+a*(1-c)},"vec<N>,vec<N>":function(a,b,c){var e=1-c,d=new this.GLM.vecN(new a.elements.constructor(N)),h=d.elements;a=a.elements;b=b.elements;for(var j=0;j<N;j++)h[j]=b[j]*c+a[j]*e;return d}},clamp:{"float,float":function(a,b,c){return GLM._clamp(a,b,c)},"vec<N>,float":function(a,b,c){return new GLM.vecN(GLM.$to_array(a).map(function(a){return GLM._clamp(a,b,c)}))}},epsilonEqual:{"float,float":GLM._epsilonEqual,"vec<N>,vec<N>":function(a,
b,c){for(var e=this["float,float"],d=glm.bvecN(),h=0;h<N;h++)d[h]=e(a[h],b[h],c);return d},"ivec<N>,ivec<N>":function(a,b,c){return this["vecN,vecN"](a,b,c)},"uvec<N>,uvec<N>":function(a,b,c){return this["vecN,vecN"](a,b,c)},"quat,quat":function(a,b,c){for(var e=this["float,float"],d=glm.bvec4(),h=0;4>h;h++)d[h]=e(a[h],b[h],c);return d},"mat<N>,mat<N>":function(){throw new GLM.GLMJSError("error: 'epsilonEqual' only accept floating-point and integer scalar or vector inputs");}}});
GLM.$template.extend(GLM,GLM.$template["declare<T>"]({degrees:{"float":function(a){return this.GLM._degrees(a)},"vec<N>":function(a){return new this.GLM.vecN(this.GLM.$to_array(a).map(this.GLM._degrees))}},radians:{"float":function(a){return this.GLM._radians(a)},"vec<N>":function(a){return new this.GLM.vecN(this.GLM.$to_array(a).map(this.GLM._radians))}},sign:{"null":function(){return 0},undefined:function(){return NaN},string:function(){return NaN},"float":function(a){return GLM._sign(a)},"vec<N>":function(a){return new GLM.vecN(GLM.$to_array(a).map(GLM._sign))},
"ivec<N>":function(a){return new GLM.ivecN(GLM.$to_array(a).map(GLM._sign))}},abs:{"float":function(a){return GLM._abs(a)},"vec<N>":function(a){return new GLM.vecN(GLM.$to_array(a).map(GLM._abs))}},fract:{"float":function(a){return GLM._fract(a)},"vec<N>":function(a){return new GLM.vecN(GLM.$to_array(a).map(GLM._fract))}},all:{"vec<N>":function(a){return N===GLM.$to_array(a).filter(Boolean).length},"bvec<N>":function(a){return N===GLM.$to_array(a).filter(Boolean).length},"ivec<N>":function(a){return N===
GLM.$to_array(a).filter(Boolean).length},"uvec<N>":function(a){return N===GLM.$to_array(a).filter(Boolean).length},quat:function(a){return 4===GLM.$to_array(a).filter(Boolean).length}},$to_object:{vec2:function(a){return{x:a.x,y:a.y}},vec3:function(a){return{x:a.x,y:a.y,z:a.z}},vec4:function(a){return{x:a.x,y:a.y,z:a.z,w:a.w}},uvec2:function(a){return{x:a.x,y:a.y}},uvec3:function(a){return{x:a.x,y:a.y,z:a.z}},uvec4:function(a){return{x:a.x,y:a.y,z:a.z,w:a.w}},ivec2:function(a){return{x:a.x,y:a.y}},
ivec3:function(a){return{x:a.x,y:a.y,z:a.z}},ivec4:function(a){return{x:a.x,y:a.y,z:a.z,w:a.w}},bvec2:function(a){return{x:!!a.x,y:!!a.y}},bvec3:function(a){return{x:!!a.x,y:!!a.y,z:!!a.z}},bvec4:function(a){return{x:!!a.x,y:!!a.y,z:!!a.z,w:!!a.w}},quat:function(a){return{w:a.w,x:a.x,y:a.y,z:a.z}},mat3:function(a){return{"0":this.vec3(a[0]),1:this.vec3(a[1]),2:this.vec3(a[2])}},mat4:function(a){return{"0":this.vec4(a[0]),1:this.vec4(a[1]),2:this.vec4(a[2]),3:this.vec4(a[3])}}},roll:{$atan2:Math.atan2,
quat:function(a){return this.$atan2(2*(a.x*a.y+a.w*a.z),a.w*a.w+a.x*a.x-a.y*a.y-a.z*a.z)}},pitch:{$atan2:Math.atan2,quat:function(a){return this.$atan2(2*(a.y*a.z+a.w*a.x),a.w*a.w-a.x*a.x-a.y*a.y+a.z*a.z)}},yaw:{$asin:Math.asin,quat:function(a){return this.$asin(this.GLM.clamp(-2*(a.x*a.z-a.w*a.y),-1,1))}},eulerAngles:{quat:function(a){return this.GLM.vec3(this.GLM.pitch(a),this.GLM.yaw(a),this.GLM.roll(a))}}}),GLM.$template["declare<T,...>"]({$from_glsl:{string:function(a,b){var c;a.replace(/^([$\w]+)\(([-.0-9ef, ]+)\)$/,
function(a,d,h){a=glm[d]||glm["$"+d];if(!a)throw new GLM.GLMJSError("glsl decoding issue: unknown type '"+d+"'");c=h.split(",").map(parseFloat);if(!b||b===a)c=a.apply(glm,c);else{if(!0===b||b===Array){for(;c.length<a.componentLength;)c.push(c[c.length-1]);return c}throw new GLM.GLMJSError("glsl decoding issue: second argument expected to be undefined|true|Array");}});return c}},$to_glsl:{"vec<N>":function(a,b){var c=GLM.$to_array(a);b&&("object"===typeof b&&"precision"in b)&&(c=c.map(function(a){return a.toFixed(b.precision)}));
for(;c.length&&c[c.length-2]===c[c.length-1];)c.pop();return a.$type+"("+c+")"},"uvec<N>":function(a,b){return this.vecN(a,b)},"ivec<N>":function(a,b){return this.vecN(a,b)},"bvec<N>":function(a,b){return this.vecN(a,b)},quat:function(a,b){var c;b&&("object"===typeof b&&"precision"in b)&&(c=b.precision);return 0===a.x+a.y+a.z?"quat("+(void 0===c?a.w:a.w.toFixed(c))+")":this.vec4(a,b)},"mat<N>":function(a,b){var c;b&&("object"===typeof b&&"precision"in b)&&(c=b.precision);var e=GLM.$to_array(a);void 0!==
c&&(e=e.map(function(a){return a.toFixed(c)}));return e.reduce(function(a,b){return a+1*b},0)===e[0]*N?"matN("+e[0]+")":"matN("+e+")"}},frexp:{"float":function(a,b){return 1===arguments.length?this["float,undefined"](a):this["float,array"](a,b)},"vec<N>":function(a,b){if(2>arguments.length)throw new GLM.GLMJSError("frexp(vecN, ivecN) expected ivecN as second parameter");return GLM.vecN(GLM.$to_array(a).map(function(a,e){var d=GLM._frexp(a);b[e]=d[1];return d[0]}))},"float,undefined":function(a){return GLM._frexp(a)},
"float,array":function(a,b){return GLM._frexp(a,b)}},ldexp:{"float":GLM._ldexp,"vec<N>":function(a,b){return GLM.vecN(GLM.$to_array(a).map(function(a,e){return GLM._ldexp(a,b[e])}))}}}));
GLM.$template["declare<T,V,...>"]({rotate:{"float,vec3":function(a,b){return this.GLM.$outer.mat4_angleAxis(a,b)},"mat4,float":function(a,b,c){return a.mul(this.GLM.$outer.mat4_angleAxis(b,c))}},scale:{$outer:GLM.$outer,"mat4,vec3":function(a,b){return a.mul(this.$outer.mat4_scale(b))},"vec3,undefined":function(a){return this.$outer.mat4_scale(a)}},translate:{"mat4,vec3":function(a,b){return a.mul(this.GLM.$outer.mat4_translation(b))},"vec3,undefined":function(a){return this.GLM.$outer.mat4_translation(a)}},
angleAxis:{"float,vec3":function(a,b){return this.GLM.$outer.quat_angleAxis(a,b)}},min:{"float,float":function(a,b){return this.GLM._min(a,b)},"vec<N>,float":function(a,b){return new this.GLM.vecN(this.GLM.$to_array(a).map(function(a){return this.GLM._min(a,b)}.bind(this)))}},max:{"float,float":function(a,b){return this.GLM._max(a,b)},"vec<N>,float":function(a,b){return new this.GLM.vecN(this.GLM.$to_array(a).map(function(a){return this.GLM._max(a,b)}.bind(this)))}},equal:{"float,float":GLM._equal,
"vec<N>,vec<N>":function(a,b){for(var c=this["float,float"],e=glm.bvecN(),d=0;d<N;d++)e[d]=c(a[d],b[d]);return e},"bvec<N>,bvec<N>":function(a,b){return this["vecN,vecN"](a,b)},"ivec<N>,ivec<N>":function(a,b){return this["vecN,vecN"](a,b)},"uvec<N>,uvec<N>":function(a,b){return this["vecN,vecN"](a,b)},"quat,quat":function(a,b){for(var c=this["float,float"],e=glm.bvec4(),d=0;4>d;d++)e[d]=c(a[d],b[d]);return e}},_slerp:{"quat,quat":function(a,b,c){var e=b,d=glm.dot(glm.vec4(a),glm.vec4(b));0>d&&(e=
b.mul(-1),d=-d);if(d>1-glm.epsilon())return glm.quat(glm.mix(a.w,e.w,c),glm.mix(a.x,e.x,c),glm.mix(a.y,e.y,c),glm.mix(a.z,e.z,c));b=Math.acos(d);return(a.mul(Math.sin((1-c)*b))+e.mul(Math.sin(c*b)))/Math.sin(b)}},rotation:{"vec3,vec3":function(a,b){var c=this.$dot(a,b),e=new a.constructor(new a.elements.constructor(3));if(c>=1-this.$epsilon)return this.$quat();if(c<-1+this.$epsilon)return e=this.$cross(this.$m[2],a),this.$length2(e)<this.$epsilon&&(e=this.$cross(this.$m[0],a)),e=this.$normalize(e),
this.$angleAxis(this.$pi,e);var e=this.$cross(a,b),c=this.$sqrt(2*(1+c)),d=1/c;return this.$quat(0.5*c,e.x*d,e.y*d,e.z*d)}},project:{"vec3,mat4":function(a,b,c,e){a=glm.vec4(a,1);a=b["*"](a);a=c["*"](a);a["/="](a.w);a=a["*"](0.5)["+"](0.5);a[0]=a[0]*e[2]+e[0];a[1]=a[1]*e[3]+e[1];return glm.vec3(a)}},unProject:{"vec3,mat4":function(a,b,c,e){b=glm.inverse(c["*"](b));a=glm.vec4(a,1);a.x=(a.x-e[0])/e[2];a.y=(a.y-e[1])/e[3];a=a["*"](2)["-"](glm.vec4(1));e=b["*"](a);e["/="](e.w);return glm.vec3(e)}},orientedAngle:{"vec3,vec3":function(a,
b,c){var e=Math.acos(glm.clamp(glm.dot(a,b),0,1));return glm.mix(e,-e,0>glm.dot(c,glm.cross(a,b))?1:0)}}});
GLM.$to_string=GLM.$template["declare<T,...>"]({$to_string:{"function":function(a){return"[function "+(a.name||"anonymous")+"]"},ArrayBuffer:function(a){return"[object ArrayBuffer "+JSON.stringify({byteLength:a.byteLength})+"]"},Float32Array:function(a){return"[object Float32Array "+JSON.stringify({length:a.length,byteOffset:a.byteOffset,byteLength:a.byteLength,BPE:a.BYTES_PER_ELEMENT})+"]"},"float":function(a,b){return GLM.$toFixedString("float",{value:a},["value"],b&&b.precision)},string:function(a){return a},
bool:function(a){return"bool("+a+")"},"vec<N>":function(a,b){return GLM.$toFixedString(a.$type_name,a,a.$components,b&&b.precision)},"uvec<N>":function(a,b){return GLM.$toFixedString(a.$type_name,a,a.$components,b&&"object"===typeof b&&b.precision||0)},"ivec<N>":function(a,b){return GLM.$toFixedString(a.$type_name,a,a.$components,b&&"object"===typeof b&&b.precision||0)},"bvec<N>":function(a){return a.$type_name+"("+GLM.$to_array(a).map(Boolean).join(", ")+")"},"mat<N>":function(a,b){var c=[0,1,2,
3].slice(0,N).map(function(b){return a[b]}).map(function(a){return GLM.$toFixedString("\t",a,a.$components,b&&b.precision)});return a.$type_name+"(\n"+c.join(", \n")+"\n)"},quat:function(a,b){a=GLM.degrees(GLM.eulerAngles(a));return GLM.$toFixedString("<quat>"+a.$type_name,a,["x","y","z"],b&&b.precision)}}}).$to_string;
GLM.$template["declare<T,V,...>"]({copy:{$op:"=","vec<N>,vec<N>":function(a,b){a.elements.set(b.elements);return a},"vec<N>,array<N>":function(a,b){a.elements.set(b);return a},"vec<N>,uvec<N>":function(a,b){a.elements.set(b.elements);return a},"vec<N>,ivec<N>":function(a,b){a.elements.set(b.elements);return a},"vec<N>,bvec<N>":function(a,b){a.elements.set(b.elements);return a},"uvec<N>,uvec<N>":function(a,b){a.elements.set(b.elements);return a},"uvec<N>,array<N>":function(a,b){a.elements.set(b);return a},
"uvec<N>,vec<N>":function(a,b){a.elements.set(b.elements);return a},"uvec<N>,ivec<N>":function(a,b){a.elements.set(b.elements);return a},"uvec<N>,bvec<N>":function(a,b){a.elements.set(b.elements);return a},"ivec<N>,ivec<N>":function(a,b){a.elements.set(b.elements);return a},"ivec<N>,array<N>":function(a,b){a.elements.set(b);return a},"ivec<N>,vec<N>":function(a,b){a.elements.set(b.elements);return a},"ivec<N>,uvec<N>":function(a,b){a.elements.set(b.elements);return a},"ivec<N>,bvec<N>":function(a,
b){a.elements.set(b.elements);return a},"bvec<N>,ivec<N>":function(a,b){a.elements.set(b.elements);return a},"bvec<N>,array<N>":function(a,b){a.elements.set(b);return a},"bvec<N>,vec<N>":function(a,b){a.elements.set(b.elements);return a},"bvec<N>,uvec<N>":function(a,b){a.elements.set(b.elements);return a},"bvec<N>,bvec<N>":function(a,b){a.elements.set(b.elements);return a},"quat,quat":function(a,b){a.elements.set(b.elements);return a},"mat<N>,mat<N>":function(a,b){a.elements.set(b.elements);return a},
"mat<N>,array<N>":function(a,b){b=b.reduce(function(a,b){if(!a.concat)throw new GLM.GLMJSError("matN,arrayN -- [[.length===4] x 4] expected");return a.concat(b)});if(b===N)throw new GLM.GLMJSError("matN,arrayN -- [[N],[N],[N],[N]] expected");return a["="](b)},"mat<N>,array<N*N>":function(a,b){a.elements.set(b);return a},"mat4,array9":function(a,b){a.elements.set((new GLM.mat4(b)).elements);return a}},sub:{$op:"-",_sub:function(a,b){return this.GLM.$to_array(a).map(function(a,e){return a-b[e]})},"vec<N>,vec<N>":function(a,
b){return new this.GLM.vecN(this._sub(a,b))},"vec<N>,uvec<N>":function(a,b){return new this.GLM.vecN(this._sub(a,b))},"uvec<N>,uvec<N>":function(a,b){return new this.GLM.uvecN(this._sub(a,b))},"uvec<N>,ivec<N>":function(a,b){return new this.GLM.uvecN(this._sub(a,b))},"vec<N>,ivec<N>":function(a,b){return new this.GLM.vecN(this._sub(a,b))},"ivec<N>,uvec<N>":function(a,b){return new this.GLM.ivecN(this._sub(a,b))},"ivec<N>,ivec<N>":function(a,b){return new this.GLM.ivecN(this._sub(a,b))}},sub_eq:{$op:"-=",
"vec<N>,vec<N>":function(a,b){for(var c=a.elements,e=b.elements,d=0;d<N;d++)c[d]-=e[d];return a},"vec<N>,uvec<N>":function(a,b){return this["vecN,vecN"](a,b)},"uvec<N>,uvec<N>":function(a,b){return this["vecN,vecN"](a,b)},"uvec<N>,ivec<N>":function(a,b){return this["vecN,vecN"](a,b)},"vec<N>,ivec<N>":function(a,b){return this["vecN,vecN"](a,b)},"ivec<N>,ivec<N>":function(a,b){return this["vecN,vecN"](a,b)},"ivec<N>,uvec<N>":function(a,b){return this["vecN,vecN"](a,b)}},add:{$op:"+",_add:function(a,
b){return this.GLM.$to_array(a).map(function(a,e){return a+b[e]})},"vec<N>,float":function(a,b){return new this.GLM.vecN(this._add(a,[b,b,b,b]))},"vec<N>,vec<N>":function(a,b){return new this.GLM.vecN(this._add(a,b))},"vec<N>,uvec<N>":function(a,b){return new this.GLM.vecN(this._add(a,b))},"uvec<N>,uvec<N>":function(a,b){return new this.GLM.uvecN(this._add(a,b))},"uvec<N>,ivec<N>":function(a,b){return new this.GLM.uvecN(this._add(a,b))},"vec<N>,ivec<N>":function(a,b){return new this.GLM.vecN(this._add(a,
b))},"ivec<N>,ivec<N>":function(a,b){return new this.GLM.ivecN(this._add(a,b))},"ivec<N>,uvec<N>":function(a,b){return new this.GLM.ivecN(this._add(a,b))}},add_eq:{$op:"+=","vec<N>,vec<N>":function(a,b){for(var c=a.elements,e=b.elements,d=0;d<N;d++)c[d]+=e[d];return a},"vec<N>,uvec<N>":function(a,b){return this["vecN,vecN"](a,b)},"uvec<N>,uvec<N>":function(a,b){return this["vecN,vecN"](a,b)},"uvec<N>,ivec<N>":function(a,b){return this["vecN,vecN"](a,b)},"vec<N>,ivec<N>":function(a,b){return this["vecN,vecN"](a,
b)},"ivec<N>,ivec<N>":function(a,b){return this["vecN,vecN"](a,b)},"ivec<N>,uvec<N>":function(a,b){return this["vecN,vecN"](a,b)}},div:{$op:"/","vec<N>,float":function(a,b){return new this.GLM.vecN(this.GLM.$to_array(a).map(function(a){return a/b}))}},div_eq:{$op:"/=","vec<N>,float":function(a,b){for(var c=0;c<N;c++)a.elements[c]/=b;return a}},mul:{$op:"*","vec<N>,vec<N>":function(a,b){return new this.GLM.vecN(this.GLM.$to_array(a).map(function(a,e){return a*b[e]}))}},eql_epsilon:function(a){return{$op:"~=",
"vec<N>,vec<N>":a,"mat<N>,mat<N>":a,"quat,quat":a,"uvec<N>,uvec<N>":a,"ivec<N>,ivec<N>":a}}(function(a,b){return this.GLM.all(this.GLM.epsilonEqual(a,b,this.GLM.epsilon()))}),eql:function(a){return{$op:"==","mat<N>,mat<N>":function(a,c){return c.elements.length===glm.$to_array(a).filter(function(a,b){return a===c.elements[b]}).length},"vec<N>,vec<N>":a,"quat,quat":a,"uvec<N>,uvec<N>":a,"ivec<N>,ivec<N>":a,"bvec<N>,bvec<N>":a}}(function(a,b){return GLM.all(GLM.equal(a,b))})});
GLM.string={$type_name:"string",$:{}};GLM.number={$type_name:"float",$:{}};GLM["boolean"]={$type:"bool",$type_name:"bool",$:{}};
GLM.vec2=GLM.$template.GLMType("vec2",{name:"fvec2",identity:[0,0],components:["xy","01"],undefined0:function(){return this.identity},number1:function(a){return[a,a]},number2:function(a,b){return[a,b]},object1:function(a){if(null!==a)switch(a.length){case 4:case 3:case 2:return[a[0],a[1]];default:if("y"in a&&"x"in a){if(typeof a.x!==typeof a.y)throw new GLM.GLMJSError("unrecognized .x-ish object passed to GLM.vec2: "+a);return"string"===typeof a.x?[1*a.x,1*a.y]:[a.x,a.y]}}throw new GLM.GLMJSError("unrecognized object passed to GLM.vec2: "+
a);}});
GLM.uvec2=GLM.$template.GLMType("uvec2",{name:"uvec2",identity:[0,0],components:["xy","01"],_clamp:function(a){return~~a},undefined0:function(){return this.identity},number1:function(a){a=this._clamp(a);return[a,a]},number2:function(a,b){a=this._clamp(a);b=this._clamp(b);return[a,b]},object1:function(a){switch(a.length){case 4:case 3:case 2:return[a[0],a[1]].map(this._clamp);default:if("y"in a&&"x"in a){if(typeof a.x!==typeof a.y)throw new GLM.GLMJSError("unrecognized .x-ish object passed to GLM."+this.name+
": "+a);return[a.x,a.y].map(this._clamp)}}throw new GLM.GLMJSError("unrecognized object passed to GLM."+this.name+": "+a);}});
GLM.vec3=GLM.$template.GLMType("vec3",{name:"fvec3",identity:[0,0,0],components:["xyz","012","rgb"],undefined0:function(){return GLM.vec3.$.identity},number1:function(a){return[a,a,a]},number2:function(a,b){return[a,b,b]},number3:function(a,b,c){return[a,b,c]},Error:GLM.GLMJSError,object1:function(a){if(a)switch(a.length){case 4:case 3:return[a[0],a[1],a[2]];case 2:return[a[0],a[1],a[1]];default:if("z"in a&&"x"in a){if(typeof a.x!==typeof a.y)throw new this.Error("unrecognized .x-ish object passed to GLM.vec3: "+
a);return"string"===typeof a.x?[1*a.x,1*a.y,1*a.z]:[a.x,a.y,a.z]}}throw new this.Error("unrecognized object passed to GLM.vec3: "+a);},object2:function(a,b){if(a instanceof GLM.vec2||a instanceof GLM.uvec2||a instanceof GLM.ivec2||a instanceof GLM.bvec2)return[a.x,a.y,b];throw new GLM.GLMJSError("unrecognized object passed to GLM.vec3(o,z): "+[a,b]);}});
GLM.uvec3=GLM.$template.GLMType("uvec3",{name:"uvec3",identity:[0,0,0],components:["xyz","012"],_clamp:GLM.uvec2.$._clamp,undefined0:function(){return this.identity},number1:function(a){a=this._clamp(a);return[a,a,a]},number2:function(a,b){a=this._clamp(a);b=this._clamp(b);return[a,b,b]},number3:function(a,b,c){a=this._clamp(a);b=this._clamp(b);c=this._clamp(c);return[a,b,c]},object1:function(a){if(a)switch(a.length){case 4:case 3:return[a[0],a[1],a[2]].map(this._clamp);case 2:return[a[0],a[1],a[1]].map(this._clamp);
default:if("z"in a&&"x"in a){if(typeof a.x!==typeof a.y)throw new GLM.GLMJSError("unrecognized .x-ish object passed to GLM."+this.name+": "+a);return[a.x,a.y,a.z].map(this._clamp)}}throw new GLM.GLMJSError("unrecognized object passed to GLM."+this.name+": "+a);},object2:function(a,b){if(a instanceof GLM.vec2)return[a.x,a.y,b].map(this._clamp);if(a instanceof GLM.uvec2||a instanceof GLM.ivec2||a instanceof GLM.bvec2)return[a.x,a.y,this._clamp(b)];throw new GLM.GLMJSError("unrecognized object passed to GLM."+
this.name+"(o,z): "+[a,b]);}});
GLM.vec4=GLM.$template.GLMType("vec4",{name:"fvec4",identity:[0,0,0,0],components:["xyzw","0123","rgba"],undefined0:function(){return this.identity},number1:function(a){return[a,a,a,a]},number2:function(a,b){return[a,b,b,b]},number3:function(a,b,c){return[a,b,c,c]},number4:function(a,b,c,e){return[a,b,c,e]},Error:GLM.GLMJSError,object1:function(a){if(a)switch(a.length){case 4:return[a[0],a[1],a[2],a[3]];case 3:return[a[0],a[1],a[2],a[2]];case 2:return[a[0],a[1],a[1],a[1]];default:if("w"in a&&"x"in
a){if(typeof a.x!==typeof a.w)throw new this.Error("unrecognized .x-ish object passed to GLM.vec4: "+a);return"string"===typeof a.x?[1*a.x,1*a.y,1*a.z,1*a.w]:[a.x,a.y,a.z,a.w]}}throw new this.Error("unrecognized object passed to GLM.vec4: "+[a,a&&a.$type]);},$GLM:GLM,object2:function(a,b){if(a instanceof this.$GLM.vec3||a instanceof this.$GLM.uvec3||a instanceof this.$GLM.ivec3||a instanceof this.$GLM.bvec3)return[a.x,a.y,a.z,b];throw new this.$GLM.GLMJSError("unrecognized object passed to GLM.vec4(o,w): "+
[a,b]);},object3:function(a,b,c){if(a instanceof this.$GLM.vec2||a instanceof this.$GLM.uvec2||a instanceof this.$GLM.ivec2||a instanceof this.$GLM.bvec2)return[a.x,a.y,b,c];throw new this.$GLM.GLMJSError("unrecognized object passed to GLM.vec4(o,z,w): "+[a,b,c]);}});
GLM.uvec4=GLM.$template.GLMType("uvec4",{name:"uvec4",identity:[0,0,0,0],components:["xyzw","0123"],_clamp:GLM.uvec2.$._clamp,undefined0:function(){return this.identity},number1:function(a){a=this._clamp(a);return[a,a,a,a]},number2:function(a,b){a=this._clamp(a);b=this._clamp(b);return[a,b,b,b]},number3:function(a,b,c){a=this._clamp(a);b=this._clamp(b);c=this._clamp(c);return[a,b,c,c]},number4:function(a,b,c,e){return[a,b,c,e].map(this._clamp)},Error:GLM.GLMJSError,object1:function(a){if(a)switch(a.length){case 4:return[a[0],
a[1],a[2],a[3]].map(this._clamp);case 3:return[a[0],a[1],a[2],a[2]].map(this._clamp);case 2:return[a[0],a[1],a[1],a[1]].map(this._clamp);default:if("w"in a&&"x"in a){if(typeof a.x!==typeof a.y)throw new this.Error("unrecognized .x-ish object passed to GLM."+this.name+": "+a);return[a.x,a.y,a.z,a.w].map(this._clamp)}}throw new GLM.GLMJSError("unrecognized object passed to GLM."+this.name+": "+[a,a&&a.$type]);},object2:function(a,b){if(a instanceof GLM.vec3)return[a.x,a.y,a.z,b].map(this._clamp);if(a instanceof
GLM.uvec3||a instanceof GLM.ivec3||a instanceof GLM.bvec3)return[a.x,a.y,a.z,this._clamp(b)];throw new GLM.GLMJSError("unrecognized object passed to GLM."+this.name+"(o,w): "+[a,b]);},object3:function(a,b,c){if(a instanceof GLM.vec2)return[a.x,a.y,b,c].map(this._clamp);if(a instanceof GLM.uvec2||a instanceof GLM.ivec2||a instanceof GLM.bvec2)return[a.x,a.y,this._clamp(b),this._clamp(c)];throw new GLM.GLMJSError("unrecognized object passed to GLM."+this.name+"(o,z,w): "+[a,b,c]);}});
GLM.ivec2=GLM.$template.GLMType("ivec2",GLM.$template.extend({},GLM.uvec2.$,{name:"ivec2"}));GLM.ivec3=GLM.$template.GLMType("ivec3",GLM.$template.extend({},GLM.uvec3.$,{name:"ivec3"}));GLM.ivec4=GLM.$template.GLMType("ivec4",GLM.$template.extend({},GLM.uvec4.$,{name:"ivec4"}));GLM.bvec2=GLM.$template.GLMType("bvec2",GLM.$template.extend({},GLM.uvec2.$,{name:"bvec2",boolean1:GLM.uvec2.$.number1,boolean2:GLM.uvec2.$.number2}));
GLM.bvec3=GLM.$template.GLMType("bvec3",GLM.$template.extend({},GLM.uvec3.$,{name:"bvec3",boolean1:GLM.uvec3.$.number1,boolean2:GLM.uvec3.$.number2,boolean3:GLM.uvec3.$.number3}));GLM.bvec4=GLM.$template.GLMType("bvec4",GLM.$template.extend({},GLM.uvec4.$,{name:"bvec4",boolean1:GLM.uvec4.$.number1,boolean2:GLM.uvec4.$.number2,boolean3:GLM.uvec4.$.number3,boolean4:GLM.uvec4.$.number4}));GLM.bvec2.$._clamp=GLM.bvec3.$._clamp=GLM.bvec4.$._clamp=function(a){return!!a};
GLM.mat3=GLM.$template.GLMType("mat3",{name:"mat3x3",identity:[1,0,0,0,1,0,0,0,1],undefined0:function(){return this.identity},number1:function(a){return 1===a?this.identity:[a,0,0,0,a,0,0,0,a]},number9:function(a,b,c,e,d,h,j,g,k){return arguments},Error:GLM.GLMJSError,$vec3:GLM.vec3,object1:function(a){if(a){var b=a.elements||a;if(16===b.length)return[b[0],b[1],b[2],b[4],b[5],b[6],b[8],b[9],b[10]];if(9===b.length)return b;if(0 in b&&1 in b&&2 in b&&!(3 in b)&&"object"===typeof b[2])return[b[0],b[1],
b[2]].map(this.$vec3.$.object1).reduce(function(a,b){return a.concat(b)})}throw new this.Error("unrecognized object passed to GLM.mat3: "+a);},object3:function(a,b,c){return[a,b,c].map(glm.$to_array).reduce(function(a,b){return a.concat(b)})}});
GLM.mat4=GLM.$template.GLMType("mat4",{name:"mat4x4",identity:[1,0,0,0,0,1,0,0,0,0,1,0,0,0,0,1],undefined0:function(){return this.identity},number16:function(a,b,c,e,d,h,j,g,k,i,w,r,m,q,s,t){return arguments},number1:function(a){return 1===a?this.identity:[a,0,0,0,0,a,0,0,0,0,a,0,0,0,0,a]},Error:GLM.GLMJSError,$vec4:GLM.vec4,object1:function(a){var b;if(a){b=a.elements||a;if(9===b.length)return[b[0],b[1],b[2],0,b[3],b[4],b[5],0,b[6],b[7],b[8],0,0,0,0,1];if(4===b.length&&b[0]&&4===b[0].length)return b[0].concat(b[1],
b[2],b[3]);if(16===b.length)return b;if(0 in b&&1 in b&&2 in b&&3 in b&&!(4 in b)&&"object"===typeof b[3])return[b[0],b[1],b[2],b[3]].map(this.$vec4.$.object1).reduce(function(a,b){return a.concat(b)})}throw new this.Error("unrecognized object passed to GLM.mat4: "+[a,b&&b.length]);},object4:function(a,b,c,e){return[a,b,c,e].map(glm.$to_array).reduce(function(a,b){return a.concat(b)})}});
GLM.quat=GLM.$template.GLMType("quat",{identity:[0,0,0,1],components:["xyzw","0123"],undefined0:function(){return this.identity},number1:function(a){if(1!==a)throw Error("only quat(1) syntax supported for quat(number1 args)...");return this.identity},number4:function(a,b,c,e){return[b,c,e,a]},$GLM:GLM,$M3:GLM.mat3(),$quat_array_from_zyx:function(a){var b=this.$M3;return this.$GLM.$outer.quat_angleAxis(a.z,b[2]).mul(this.$GLM.$outer.quat_angleAxis(a.y,b[1])).mul(this.$GLM.$outer.quat_angleAxis(a.x,
b[0])).elements},object1:function(a){if(a){if(a instanceof this.$GLM.mat4)return this.$GLM.$outer.quat_array_from_mat4(a);if(4===a.length)return[a[0],a[1],a[2],a[3]];if(a instanceof this.$GLM.quat)return[a.x,a.y,a.z,a.w];if(a instanceof this.$GLM.vec3)return this.$quat_array_from_zyx(a);if("w"in a&&"x"in a)return"string"===typeof a.x?[1*a.x,1*a.y,1*a.z,1*a.w]:[a.x,a.y,a.z,a.w]}throw new this.$GLM.GLMJSError("unrecognized object passed to GLM.quat.object1: "+[a,a&&a.$type,typeof a,a&&a.constructor]);
}});
(function(){var a=function(a,b,c,e){var k={def:function(b,c){this[b]=c;Object.defineProperty(a.prototype,b,c)}};a.$properties=a.$properties||k;var i=a.$properties.def.bind(a.$properties),w=[0,1,2,3].map(function(a){return{enumerable:c,get:function(){return this.elements[a]},set:function(b){this.elements[a]=b}}});b.forEach(function(a,b){i(a,w[b])});if(isNaN(b[0])&&!/^_/.test(b[0])){var k=b.slice(),r=GLM.$subarray;do(function(a,b,c){"quat"===b&&(b="vec"+c);var d=GLM[b];i(a,{enumerable:!1,get:function(){return new d(r(this.elements,0*
c,1*c))},set:function(a){return(new d(r(this.elements,0*c,1*c)))["="](a)}})})(k.join(""),a.prototype.$type.replace(/[1-9]$/,k.length),k.length);while(k[1]!=k.pop());if(e)return a.$properties;k=b.slice();if(b={xyz:{yz:1},xyzw:{yzw:1,yz:1,zw:2}}[k.join("")])for(var m in b)(function(a,b,c,d){i(a,{enumerable:!1,get:function(){return new GLM[b](GLM.$subarray(this.elements,0*c+d,1*c+d))},set:function(a){return(new GLM[b](GLM.$subarray(this.elements,0*c+d,1*c+d)))["="](a)}})})(m,a.prototype.$type.replace(/[1-9]$/,
m.length),m.length,b[m])}return a.$properties};a(GLM.vec2,GLM.vec2.$.components[0],!0);a(GLM.vec2,GLM.vec2.$.components[1]);a(GLM.vec3,GLM.vec3.$.components[0],!0);a(GLM.vec3,GLM.vec3.$.components[1]);a(GLM.vec3,GLM.vec3.$.components[2]);a(GLM.vec4,GLM.vec4.$.components[0],!0);a(GLM.vec4,GLM.vec4.$.components[1]);a(GLM.vec4,GLM.vec4.$.components[2]);a(GLM.quat,GLM.quat.$.components[0],!0,"noswizzles");a(GLM.quat,GLM.quat.$.components[1]);GLM.quat.$properties.def("wxyz",{enumerable:!1,get:function(){return new GLM.vec4(this.w,
this.x,this.y,this.z)},set:function(a){a=GLM.vec4(a);return this["="](GLM.quat(a.x,a.y,a.z,a.w))}});"uvec2 uvec3 uvec4 ivec2 ivec3 ivec4 bvec2 bvec3 bvec4".split(" ").forEach(function(b){a(GLM[b],GLM[b].$.components[0],!0);a(GLM[b],GLM[b].$.components[1])});Object.defineProperty(GLM.quat.prototype,"_x",{get:function(){throw Error("erroneous quat._x access");}});var b={2:{yx:{enumerable:!1,get:function(){return new GLM.vec2(this.y,this.x)},set:function(a){a=GLM.vec2(a);this.y=a[0];this.x=a[1]}}},3:{xz:{enumerable:!1,
get:function(){return new GLM.vec2(this.x,this.z)},set:function(a){a=GLM.vec2(a);this.x=a[0];this.z=a[1]}},zx:{enumerable:!1,get:function(){return new GLM.vec2(this.z,this.x)},set:function(a){a=GLM.vec2(a);this.z=a[0];this.x=a[1]}},xzy:{enumerable:!1,get:function(){return new GLM.vec3(this.x,this.z,this.y)},set:function(a){a=GLM.vec3(a);this.x=a[0];this.z=a[1];this.y=a[2]}}},4:{xw:{enumerable:!1,get:function(){return new GLM.vec2(this.x,this.w)},set:function(a){a=GLM.vec2(a);this.x=a[0];this.w=a[1]}},
wz:{enumerable:!1,get:function(){return new GLM.vec2(this.w,this.z)},set:function(a){a=GLM.vec2(a);this.w=a[0];this.z=a[1]}},wxz:{enumerable:!1,get:function(){return new GLM.vec3(this.w,this.x,this.z)},set:function(a){a=GLM.vec3(a);this.w=a[0];this.x=a[1];this.z=a[2];return this}},xyw:{enumerable:!1,get:function(){return new GLM.vec3(this.x,this.y,this.w)},set:function(a){a=GLM.vec3(a);this.x=a[0];this.y=a[1];this.w=a[2];return this}},xzw:{enumerable:!1,get:function(){return new GLM.vec3(this.x,this.z,
this.w)},set:function(a){a=GLM.vec3(a);this.x=a[0];this.z=a[1];this.w=a[2]}},wxyz:{enumerable:!1,get:function(){return new GLM.vec4(this.w,this.x,this.y,this.z)},set:function(a){a=GLM.vec4(a);this.w=a[0];this.x=a[1];this.y=a[2];this.z=a[3];return this}}}},c;for(c in b)for(var e in b[c])2>=c&&GLM.vec2.$properties.def(e,b[c][e]),3>=c&&GLM.vec3.$properties.def(e,b[c][e]),4>=c&&GLM.vec4.$properties.def(e,b[c][e]);GLM.$partition=function(a,b,c,e){if(void 0===c)throw new GLM.GLMJSError("nrows is undefined");
var k=b.$.identity.length;c=c||k;for(var i=function(a){3<GLM.$DEBUG&&GLM.$outer.console.debug("CACHEDBG: "+a)},w=0;w<c;w++)(function(c){var j=e&&e+c,q=c*k;Object.defineProperty(a,c,{configurable:!0,enumerable:!0,set:function(e){if(e instanceof b)this.elements.set(e.elements,q);else if(e&&e.length===k)this.elements.set(e,q);else throw new GLM.GLMJSError("unsupported argtype to "+(a&&a.$type)+"["+c+"] setter: "+[typeof e,e]);},get:function(){if(e){if(this[j])return c||i("cache hit "+j),this[j];c||i("cache miss "+
j)}var a,d=new b(a=GLM.$subarray(this.elements,q,q+k));if(d.elements!==a)throw new GLM.GLMJSError("v.elements !== t "+[GLM.$subarray,d.elements.constructor===a.constructor,d.elements.buffer===a.buffer]);e&&Object.defineProperty(this,j,{configurable:!0,enumerable:!1,value:d});return d}})})(w)};GLM.$partition(GLM.mat4.prototype,GLM.vec4,4,"_cache_");GLM.$partition(GLM.mat3.prototype,GLM.vec3,3,"_cache_")})();
GLM.$dumpTypes=function(a){GLM.$types.forEach(function(b){GLM[b].componentLength&&a("GLM."+b,JSON.stringify({"#type":GLM[b].prototype.$type_name,"#floats":GLM[b].componentLength,"#bytes":GLM[b].BYTES_PER_ELEMENT}))})};
GLM.$init=function(a){a.prefix&&(GLMJS_PREFIX=a.prefix);GLM.$prefix=GLMJS_PREFIX;var b=a.log||function(){};try{b("GLM-js: ENV: "+_ENV._VERSION)}catch(c){}b("GLM-JS: initializing: "+JSON.stringify(a,0,2));b(JSON.stringify({functions:Object.keys(GLM.$outer.functions)}));var e=GLM.mat4,d=GLM.$outer;GLM.toMat4=function(a){return new e(d.mat4_array_from_quat(a))};GLM.$template.extend(GLM.rotation.$template,{$quat:GLM.quat,$dot:GLM.dot.link("vec3,vec3"),$epsilon:GLM.epsilon(),$m:GLM.mat3(),$pi:GLM.pi(),
$length2:GLM.length2.link("vec3"),$cross:GLM.cross.link("vec3,vec3"),$normalize:GLM.normalize.link("vec3"),$angleAxis:GLM.angleAxis.link("float,vec3"),$sqrt:GLM.sqrt});GLM.$symbols=[];for(var h in GLM)"function"===typeof GLM[h]&&/^[a-z]/.test(h)&&GLM.$symbols.push(h);GLM.$types.forEach(function(a){var b=GLM[a].prototype.$type,c;for(c in GLM.$outer.functions){var d=GLM.$outer.functions[c];d.$op&&(GLM.$DEBUG&&GLM.$outer.console.debug("mapping operator<"+b+"> "+c+" / "+d.$op),GLM[a].prototype[c]=d,GLM[a].prototype[d.$op]=
d)}});b("GLM-JS: "+GLM.version+" emulating GLM_VERSION="+GLM.GLM_VERSION+" vendor_name="+a.vendor_name+" vendor_version="+a.vendor_version);glm.vendor=a};
GLM.using_namespace=function(a){GLM.$DEBUG&&GLM.$outer.console.debug("GLM.using_namespace munges globals; it should probably not be used!");GLM.using_namespace.$tmp={ret:void 0,tpl:a,names:GLM.$symbols,saved:{},evals:[],restore:[],before:[],after:[]};eval(GLM.using_namespace.$tmp.names.map(function(a,c){return"GLM.using_namespace.$tmp.saved['"+a+"'] = GLM.using_namespace.$tmp.before["+c+"] = 'undefined' !== typeof "+a+";"}).join("\n"));GLM.$DEBUG&&console.warn("GLM.using_namespace before #globals: "+
GLM.using_namespace.$tmp.before.length);GLM.using_namespace.$tmp.names.map(function(a){GLM.using_namespace.$tmp.restore.push(a+"=GLM.using_namespace.$tmp.saved['"+a+"'];"+("GLM.using_namespace.$tmp.saved['"+a+"']=undefined;delete GLM.using_namespace.$tmp.saved['"+a+"'];"));GLM.using_namespace.$tmp.evals.push(a+"=GLM."+a+";")});eval(GLM.using_namespace.$tmp.evals.join("\n"));GLM.using_namespace.$tmp.ret=a();eval(GLM.using_namespace.$tmp.restore.join("\n"));eval(GLM.using_namespace.$tmp.names.map(function(a,
c){return"GLM.using_namespace.$tmp.after["+c+"] = 'undefined' !== typeof "+a+";"}).join("\n"));GLM.$DEBUG&&console.warn("GLM.using_namespace after #globals: "+GLM.using_namespace.$tmp.after.length);a=GLM.using_namespace.$tmp.ret;delete GLM.using_namespace.$tmp;return a};
function $GLM_extern(a,b){b=b||a;return function(){GLM[b]=GLM.$outer.functions[a]||GLM.$outer[a];if(!GLM[b])throw new GLM.GLMJSError("$GLM_extern: unresolved external symbol: "+a);GLM.$DEBUG&&GLM.$outer.console.debug("$GLM_extern: resolved external symbol "+a+" "+typeof GLM[b]);return GLM[b].apply(this,arguments)}}
function GLM_polyfills(){var a={};"bind"in Function.prototype||(a.bind=Function.prototype.bind=function(a){function c(){}if("function"!==typeof this)throw new TypeError("not callable");var e=[].slice,d=e.call(arguments,1),h=this,j=function(){return h.apply(this instanceof c?this:a||global,d.concat(e.call(arguments)))};c.prototype=this.prototype||c.prototype;j.prototype=new c;return j});return a}
$GLM_reset_logging.current=function(){return{$GLM_log:"undefined"!==typeof $GLM_log&&$GLM_log,$GLM_console_log:"undefined"!==typeof $GLM_console_log&&$GLM_console_log,$GLM_console_prefixed:"undefined"!==typeof $GLM_console_prefixed&&$GLM_console_prefixed,console:GLM.$outer.console}};
function $GLM_reset_logging(a){a&&"object"===typeof a&&($GLM_log=a.$GLM_log,$GLM_console_log=a.$GLM_console_log,$GLM_console_factory=a.$GLM_console_factory,GLM.$outer.console=a.console,a=!1);if(a||"undefined"===typeof $GLM_log)$GLM_log=function(a,b){GLM.$outer.console.log.apply(GLM.$outer.console,[].slice.call(arguments).map(function(a){var b=typeof a;return"xboolean"===b||"string"===b?a+"":GLM.$isGLMObject(a)||!isNaN(a)?GLM.to_string(a):a+""}))};if(a||"undefined"===typeof $GLM_console_log)$GLM_console_log=
function(a,b){(console[a]||function(){}).apply(console,[].slice.call(arguments,1))};if(a||"undefined"===typeof $GLM_console_factory)$GLM_console_factory=function(a){return $GLM_console_log.bind($GLM_console_log,a)};var b=$GLM_console_factory,c={};"debug,warn,info,error,log,write".replace(/\w+/g,function(a){c[a]=b(a)});"object"===typeof GLM&&(GLM.$outer&&(GLM.$outer.console=c),GLM.$log=$GLM_log);return c}try{window.$GLM_reset_logging=this.$GLM_reset_logging=$GLM_reset_logging}catch(e$$19){}
GLM.$reset_logging=$GLM_reset_logging;GLM.$log=GLM.$log||$GLM_log;function $GLM_GLMJSError(a,b){function c(c){this.name=a;this.stack=Error().stack;Error.captureStackTrace&&Error.captureStackTrace(this,this.constructor);this.message=c;b&&b.apply(this,arguments)}c.prototype=Error();c.prototype.name=a;return c.prototype.constructor=c}GLMAT.mat4.exists;glm=GLM;var DLL={_version:"0.0.2",_name:"glm.gl-matrix.js",_glm_version:glm.version,prefix:"glm-js[glMatrix]: ",vendor_version:GLMAT.VERSION,vendor_name:"glMatrix"};
DLL.statics={$outer:GLM.$outer,$typeArray:function(a){return new this.$outer.Float32Array(a)},$mat4:GLM.mat4,$quat:GLM.quat,$mat4$perspective:GLMAT.mat4.perspective,$mat4$ortho:GLMAT.mat4.ortho,mat4_perspective:function(a,b,c,e){return new this.$mat4(this.$mat4$perspective(this.$typeArray(16),a,b,c,e))},mat4_ortho:function(a,b,c,e,d,h){return new this.$mat4(this.$mat4$ortho(this.$typeArray(16),a,b,c,e,d||-1,h||1))},$quat$setAxisAngle:GLMAT.quat.setAxisAngle,$mat4$fromQuat:GLMAT.mat4.fromQuat,mat4_angleAxis:function(a,
b){var c=this.$quat$setAxisAngle(this.$typeArray(4),b,a);return new this.$mat4(this.$mat4$fromQuat(this.$typeArray(16),c))},quat_angleAxis:function(a,b){return new this.$quat(this.$quat$setAxisAngle(this.$typeArray(4),b,a))},$mat4$translate:GLMAT.mat4.translate,mat4_translation:function(a){var b=new this.$mat4;this.$mat4$translate(b.elements,b.elements,a.elements);return b},$mat4$scale:GLMAT.mat4.scale,mat4_scale:function(a){var b=new this.$mat4;this.$mat4$scale(b.elements,b.elements,a.elements);
return b},toJSON:function(){var a={},b;for(b in this)0!==b.indexOf("$")&&(a[b]=this[b]);return a},$vec3:GLM.vec3,$clamp:GLM.clamp,mat4_array_from_quat:function(a){return this.$mat4$fromQuat(this.$typeArray(16),a.elements)},$qtmp:new GLM.$outer.Float32Array(9),$quat$fromMat3:GLMAT.quat.fromMat3,$mat3$fromMat4:GLMAT.mat3.fromMat4,quat_array_from_mat4:function(a){return this.$quat$fromMat3(this.$typeArray(4),this.$mat3$fromMat4(this.$qtmp,a.elements))}};
DLL["declare<T,V,...>"]={mul:{$op:"*",$typeArray:function(a){return new this.GLM.$outer.Float32Array(a)},$vec3$transformQuat:GLMAT.vec3.transformQuat,"quat,vec3":function(a,b){return new this.GLM.vec3(this.$vec3$transformQuat(this.$typeArray(3),b.elements,a.elements))},"vec3,quat":function(a,b){return this["quat,vec3"](this.GLM.inverse(b),a)},"quat,vec4":function(a,b){return this["mat4,vec4"](this.GLM.toMat4(a),b)},"vec4,quat":function(a,b){return this["quat,vec4"](this.GLM.inverse(b),a)},"$vec<N>$scale":"GLMAT.vecN.scale",
"vec<N>,float":function(a,b){return new this.GLM.vecN(this.$vecN$scale(this.$typeArray(N),a.elements,b))},"quat,float":function(a,b){return new a.constructor(this["vec4,float"](a,b).elements)},$vec4$transformMat4:GLMAT.vec4.transformMat4,"mat4,vec4":function(a,b){return new GLM.vec4(this.$vec4$transformMat4(this.$typeArray(4),b.elements,a.elements))},"vec4,mat4":function(a,b){return this["mat4,vec4"](GLM.inverse(b),a)},"$mat<N>mul":"GLMAT.matN.mul","mat<N>,mat<N>":function(a,b){return new a.constructor(this.$matNmul(this.$typeArray(N*
N),a.elements,b.elements))},$quat$multiply:GLMAT.quat.multiply,"quat,quat":function(a,b){return new a.constructor(this.$quat$multiply(this.$typeArray(4),a.elements,b.elements))}},mul_eq:{$op:"*=","$mat<N>$multiply":"GLMAT.matN.multiply","mat<N>,mat<N>":function(a,b){this.$matN$multiply(a.elements,a.elements,b.elements);return a},"$vec<N>$scale":"GLMAT.vecN.scale","vec<N>,float":function(a,b){this.$vecN$scale(a.elements,a.elements,b);return a},$quat$multiply:GLMAT.quat.multiply,"quat,quat":function(a,
b){this.$quat$multiply(a.elements,a.elements,b.elements);return a},$quat$invert:GLMAT.quat.invert,$vec3$transformQuat:GLMAT.vec3.transformQuat,"inplace:vec3,quat":function(a,b){var c=this.$quat$invert(new this.GLM.$outer.Float32Array(4),b.elements);this.$vec3$transformQuat(a.elements,a.elements,c);return a},$mat4$invert:GLMAT.mat4.invert,$vec4$transformMat4:GLMAT.vec4.transformMat4,"inplace:vec4,mat4":function(a,b){var c=this.$mat4$invert(new this.GLM.$outer.Float32Array(16),b.elements);this.$vec4$transformMat4(a.elements,
a.elements,c);return a}},cross:{$vec2$cross:GLMAT.vec2.cross,"vec2,vec2":function(a,b){return new this.GLM.vec3(this.$vec2$cross(new this.GLM.$outer.Float32Array(3),a,b))},$vec3$cross:GLMAT.vec3.cross,"vec3,vec3":function(a,b){return new this.GLM.vec3(this.$vec3$cross(new this.GLM.$outer.Float32Array(3),a,b))}},dot:{"$vec<N>$dot":"GLMAT.vecN.dot","vec<N>,vec<N>":function(a,b){return this.$vecN$dot(a,b)}},lookAt:{$mat4$lookAt:GLMAT.mat4.lookAt,"vec3,vec3":function(a,b,c){return new this.GLM.mat4(this.$mat4$lookAt(new this.GLM.$outer.Float32Array(16),
a.elements,b.elements,c.elements))}}};DLL["declare<T,V,number>"]={mix:{$quat$slerp:GLMAT.quat.slerp,"quat,quat":function(a,b,c){return new GLM.quat(this.$quat$slerp(new GLM.$outer.Float32Array(4),a.elements,b.elements,c))}}};DLL["declare<T,V,number>"].slerp=DLL["declare<T,V,number>"].mix;
DLL["declare<T>"]={normalize:{"$vec<N>normalize":"GLMAT.vecN.normalize",$typeArray:function(a){return new this.GLM.$outer.Float32Array(a)},"vec<N>":function(a){return new this.GLM.vecN(this.$vecNnormalize(this.$typeArray(N),a))},$quat$normalize:GLMAT.quat.normalize,quat:function(a){return new this.GLM.quat(this.$quat$normalize(new this.GLM.$outer.Float32Array(4),a.elements))}},length:{$quat$length:GLMAT.quat.length,quat:function(a){return this.$quat$length(a.elements)},"$vec<N>$length":"GLMAT.vecN.length",
"vec<N>":function(a){return this.$vecN$length(a.elements)}},length2:{$quat$squaredLength:GLMAT.quat.squaredLength,quat:function(a){return this.$quat$squaredLength(a.elements)},"$vec<N>$squaredLength":"GLMAT.vecN.squaredLength","vec<N>":function(a){return this.$vecN$squaredLength(a.elements)}},inverse:{$quatinvert:GLMAT.quat.invert,quat:function(a){return this.GLM.quat(this.$quatinvert(new this.GLM.$outer.Float32Array(4),a.elements))},$mat4invert:GLMAT.mat4.invert,mat4:function(a){a=a.clone();return null===
this.$mat4invert(a.elements,a.elements)?a["="](this.GLM.mat4()):a}},transpose:{$mat4$transpose:GLMAT.mat4.transpose,mat4:function(a){a=a.clone();this.$mat4$transpose(a.elements,a.elements);return a}}};glm.$outer.$import(DLL);try{module.exports=glm}catch(e$$20){}
function $GLMVector(a,b,c){this.typearray=c=c||GLM.$outer.Float32Array;if(!(this instanceof $GLMVector))throw new GLM.GLMJSError("use new");if("function"!==typeof a||!GLM.$isGLMConstructor(a))throw new GLM.GLMJSError("expecting typ to be GLM.$isGLMConstructor: "+[typeof a,a?a.$type:a]+" // "+GLM.$isGLMConstructor(a));if(1===a.componentLength&&GLM[a.prototype.$type.replace("$","$$v")])throw new GLM.GLMJSError("unsupported argtype to glm.$vectorType - for single-value types use glm."+a.prototype.$type.replace("$",
"$$v")+"..."+a.prototype.$type);this.glmtype=a;if(!this.glmtype.componentLength)throw Error("need .componentLength "+[a,b,c]);this.componentLength=this.glmtype.componentLength;this.BYTES_PER_ELEMENT=this.glmtype.BYTES_PER_ELEMENT;this._set_$elements=function(a){Object.defineProperty(this,"$elements",{enumerable:!1,configurable:!0,value:a});return this.$elements};Object.defineProperty(this,"elements",{enumerable:!0,configurable:!0,get:function(){return this.$elements},set:function(a){this._kv&&!this._kv.dynamic&&
GLM.$DEBUG&&GLM.$outer.console.warn("WARNING: setting .elements on frozen (non-dynamic) GLMVector...");if(a){var b=this.length;this.length=a.length/this.componentLength;this.byteLength=this.length*this.BYTES_PER_ELEMENT;if(this.length!==Math.round(this.length))throw new GLM.GLMJSError("$vectorType.length alignment mismatch "+JSON.stringify({componentLength:this.componentLength,length:this.length,rounded_length:Math.round(this.length),elements_length:a.length,old_length:b}));}else this.length=this.byteLength=
0;return this._set_$elements(a)}});this.elements=b&&new c(b*a.componentLength)}GLM.$vectorType=$GLMVector;GLM.$vectorType.version="0.0.2";
$GLMVector.prototype=GLM.$template.extend(new GLM.$GLMBaseType($GLMVector,"$vectorType"),{toString:function(){return"[$GLMVector .elements=#"+(this.elements&&this.elements.length)+" .elements[0]="+(this.elements&&this.elements[0])+" ->[0]"+(this["->"]&&this["->"][0])+"]"},"=":function(a){if(a instanceof this.constructor||glm.$isGLMObject(a))a=a.elements;return this._set(new this.typearray(a))},_typed_concat:function(a,b,c){var e=a.length+b.length;c=c||new a.constructor(e);c.set(a);c.set(b,a.length);
return c},"+":function(a){if(a instanceof this.constructor||glm.$isGLMObject(a))a=a.elements;return new this.constructor(this._typed_concat(this.elements,a))},"+=":function(a){if(a instanceof this.constructor||glm.$isGLMObject(a))a=a.elements;return this._set(this._typed_concat(this.elements,a))},_set:function(a){a instanceof this.constructor&&(a=new this.typearray(a.elements));if(!(a instanceof this.typearray))throw new GLM.GLMJSError("unsupported argtype to $GLMVector._set "+(a&&a.constructor));
GLM.$DEBUG&&GLM.$outer.console.debug("$GLMVector.prototype.set...this.elements:"+[this.elements&&this.elements.constructor.name,this.elements&&this.elements.length]+"elements:"+[a.constructor.name,a.length]);var b=this._kv;this._kv=void 0;this.elements=a;if(this.elements!==a)throw new GLM.GLMJSError("err with .elements: "+[this.glmtype.prototype.$type,this.elements,a]);b&&this._setup(b);return this},arrayize:function(a,b){return this._setup({dynamic:b,setters:a},this.length)},$destroy:function(a){if(a){for(var b=
Array.isArray(a),c=function(c){Object.defineProperty(a,c,{enumerable:!0,configurable:!0,value:void 0});delete a[c];b||(a[c]=void 0,delete a[c])},e=0;e<a.length;e++)e in a&&c(e);for(;e in a;)GLM.$DEBUG&&GLM.$outer.console.debug("$destroy",this.name,e),c(e++);b&&(a.length=0)}},_arrlike_toJSON:function(){return this.slice(0)},_mixinArray:function(a){a.toJSON=this._arrlike_toJSON;"forEach map slice filter join reduce".split(" ").forEach(function(b){a[b]=Array.prototype[b]});return a},_setup:function(a,
b){var c=this.glmtype,e=this.typearray,d=this.length;this._kv=a;var h=a.stride||this.glmtype.BYTES_PER_ELEMENT,j=a.offset||this.elements.byteOffset,g=a.elements||this.elements,k=a.container||this.arr||[],i=a.setters||!1,w=a.dynamic||!1;"self"===k&&(k=this);if(!g)throw new GLMJSError("GLMVector._setup - neither kv.elements nor this.elements...");this.$destroy(this.arr,b);var r=this.arr=this["->"]=k;Array.isArray(r)||this._mixinArray(r);var m=this.componentLength;if(!m)throw new GLM.GLMJSError("no componentLength!?"+
Object.keys(this));for(var q=g.buffer.byteLength,s=this,t=0;t<d;t++){var k=j+t*h,z=k+this.glmtype.BYTES_PER_ELEMENT,y=function(){a.i=t;a.next=z;a.last=q;a.offset=a.offset||j;a.stride=a.stride||h;return JSON.stringify(a)};if(k>q)throw Error("["+t+"] off "+k+" > last "+q+" "+y());if(z>q)throw Error("["+t+"] next "+z+" > last "+q+" "+y());r[t]=null;var f=function(a,b){var d=new c(new e(a.buffer,b,m));w&&Object.defineProperty(d,"$elements",{value:a});return d},y=f(g,k);!i&&!w?r[t]=y:function(a,b,c){Object.defineProperty(r,
b,{enumerable:!0,configurable:!0,get:w?function(){a.$elements!==s.elements&&(GLM.$log("dynoget rebinding ti",b,c,a.$elements===s.elements),a=f(s.elements,c));return a}:function(){return a},set:i&&(w?function(d){GLM.$log("dynoset",b,c,a.$elements===s.elements);a.$elements!==s.elements&&(GLM.$log("dynoset rebinding ti",b,c,a.$elements===s.elements),a=f(s.elements,c));return a.copy(d)}:function(b){return a.copy(b)})||void 0})}(y,t,k)}return this},setFromBuffers:function(a){var b=this.elements,c=0;a.forEach(function(a){var d=
a.length;if(c+d>b.length){d=Math.min(b.length-c,a.length);if(0>=d)return;a=glm.$subarray(a,0,d);d=a.length}if(c+d>b.length)throw new glm.GLMJSError("$vectorType.fromBuffers mismatch "+[c,d,b.length]);b.set(a,c);c+=a.length});return c},setFromPointer:function(a){if(!(a instanceof GLM.$outer.ArrayBuffer))throw new glm.GLMJSError("unsupported argtype "+[typeof a]+" - $GLMVector.setFromPointer");return this._set(new this.typearray(a))}});GLM.exists;GLM.$vectorType.exists;
if(GLM.$toTypedArray)throw"error: glm.experimental.js double-included";
GLM.$toTypedArray=function(a,b,c){var e=b||0,d=typeof e;if("number"===d){if("number"!==typeof c)throw new GLM.GLMJSError("GLM.$toTypedArray: unsupported argtype for componentLength ("+typeof c+")");return new a(e*c)}if("object"!==d)throw new GLM.GLMJSError("GLM.$toTypedArray: unsupported arrayType: "+[typeof a,a]);if(e instanceof a)return e;if(e instanceof GLM.$outer.ArrayBuffer||Array.isArray(e))return new a(e);GLM.$isGLMObject(e)&&(d=e.elements,e=new a(d.length),e.set(d));if(!(e instanceof a)&&
"byteOffset"in e&&"buffer"in e)return GLM.$DEBUG&&GLM.$outer.console.warn("coercing "+e.constructor.name+".buffer into "+[a.name,e.byteOffset,e.byteLength+" bytes","~"+e.byteLength/a.BYTES_PER_ELEMENT+" coerced elements"]+"...",{byteOffset:e.byteOffset,byteLength:e.byteLength,ecount:e.byteLength/a.BYTES_PER_ELEMENT}),new a(e.buffer,e.byteOffset,e.byteLength/a.BYTES_PER_ELEMENT);if(e instanceof a)return e;throw new GLM.GLMJSError("GLM.$toTypedArray: unsupported argtype initializers: "+[a,b,c]);};
GLM.$make_primitive=function(a,b){GLM[a]=function(c){if(!(this instanceof GLM[a]))return new GLM[a](c);"object"!==typeof c&&(c=[c]);this.elements=GLM.$toTypedArray(b,c,1)};GLM[a]=eval(GLM.$template._traceable("glm_"+a+"$class",GLM[a]))();GLM.$template._add_overrides(a,{$to_string:function(a){return a.$type.replace(/[^a-z]/g,"")+"("+a.elements[0]+")"},$to_object:function(a){return a.elements[0]},$to_glsl:function(a){return a.$type.replace(/[^a-z]/g,"")+"("+a.elements[0]+")"}});GLM.$template._add_overrides(a.substr(1),
{$to_string:!(a.substr(1)in GLM.$to_string.$template)&&function(a){return a.$type.replace(/[^a-z]/g,"")+"("+a.elements[0]+")"},$to_object:function(a){return a},$to_glsl:function(a){return a.$type.replace(/[^a-z]/g,"")+"("+a+")"}});GLM.$template.extend(GLM[a],{componentLength:1,BYTES_PER_ELEMENT:b.BYTES_PER_ELEMENT,prototype:GLM.$template.extend(new GLM.$GLMBaseType(GLM[a],a),{copy:function(a){this.elements.set(GLM.$isGLMObject(a)?a.elements:[a]);return this},valueOf:function(){return this.elements[0]}})});
GLM[a].prototype["="]=GLM[a].prototype.copy;return GLM[a]};GLM.$make_primitive("$bool",GLM.$outer.Int32Array);GLM.$template._add_overrides("$bool",{$to_object:function(a){return!!a}});GLM.$make_primitive("$int32",GLM.$outer.Int32Array);GLM.$make_primitive("$uint32",GLM.$outer.Uint32Array);GLM.$make_primitive("$uint16",GLM.$outer.Uint16Array);GLM.$make_primitive("$uint8",GLM.$outer.Uint8Array);GLM.$float32=GLM.$make_primitive("$float",GLM.$outer.Float32Array);
GLM.$make_primitive_vector=function(a,b,c){c=c||(new b).elements.constructor;var e=function(d){if(!(this instanceof e))return new e(d);this.$type=a;this.$type_name="vector<"+a+">";(d=GLM.$toTypedArray(c,d,b.componentLength))&&this._set(d)},e=eval(GLM.$template._traceable("glm_"+a+"$class",e))();e.prototype=new GLM.$vectorType(b,0,c);GLM.$template._add_overrides(a,{$to_string:function(a){return"[GLM."+a.$type+" elements[0]="+(a.elements&&a.elements[0])+"]"},$to_object:function(a){return a.map(GLM.$to_object)},
$to_glsl:function(a,b){var c=a.$type.substr(2).replace(/[^a-z]/g,"");b="string"===typeof b?b:"example";var e=[];b&&e.push(c+" "+b+"["+a.length+"]");return e.concat(a.map(function(a,c){return b+"["+c+"] = "+a})).join(";")+";"}});GLM.$types.push(a);GLM.$template.extend(e.prototype,{$type:a,constructor:e,_setup:function(){throw new GLM.GLMJSError("._setup not available on primitive vectors yet...");},_set:function(a){this.elements=a;this.length=!this.elements?0:this.elements.length/this.glmtype.componentLength;
this.arrayize();return this},arrayize:function(){for(var a=Object.defineProperty.bind(Object,this),b=0;b<this.length;b++)(function(b){a(b,{configurable:!0,enumerable:!0,get:function(){return this.elements[b]},set:function(a){return this.elements[b]=a}})})(b);return this._mixinArray(this)},toString:function(){return"[vector<"+a+"> {"+[].slice.call(this.elements,0,5)+(5<this.elements.length?",...":"")+"}]"}});return e};GLM.$vint32=GLM.$make_primitive_vector("$vint32",GLM.$int32);
GLM.$vfloat=GLM.$vfloat32=GLM.$make_primitive_vector("$vfloat32",GLM.$float32);GLM.$vuint8=GLM.$make_primitive_vector("$vuint8",GLM.$uint8);GLM.$vuint16=GLM.$make_primitive_vector("$vuint16",GLM.$uint16);GLM.$vuint32=GLM.$make_primitive_vector("$vuint32",GLM.$uint32);
GLM.$make_componentized_vector=function(a,b,c){c=c||(new b).elements.constructor;var e=function(a,h){if(!(this instanceof e))return new e(a,h);this._set(GLM.$toTypedArray(c,a,b.componentLength));if(!this.elements)throw new GLM.GLMJSError("!this.elements: "+[GLM.$toTypedArray(c,a,b.componentLength)]);this._setup({setters:!0,dynamic:h,container:"self"})},e=eval(GLM.$template._traceable("glm_"+a+"$class",e))();e.prototype=new GLM.$vectorType(b,0,c);GLM.$template._add_overrides(a,{$to_string:function(a){return"[GLM."+
a.$type+" elements[0]="+(a.elements&&a.elements[0])+"]"},$to_object:function(a){return a.map(GLM.$to_object)},$to_glsl:function(a,b){var c=a.$type.substr(2);b="string"===typeof b?b:"example";var e=[];b&&e.push(c+" "+b+"["+a.length+"]");return e.concat(a.map(GLM.$to_glsl).map(function(a,c){return b+"["+c+"] = "+a})).join(";\n ")+";"}});GLM.$types.push(a);GLM.$template.extend(e.prototype,{$type:a,constructor:e});e.prototype.componentLength||alert("!cmop "+p);return e};
(function(){var a=GLM.$template.deNify({"$vvec<N>":function(){return GLM.$make_componentized_vector("$vvecN",GLM.vecN)},"$vuvec<N>":function(){return GLM.$make_componentized_vector("$vuvecN",GLM.uvecN)},"$vmat<N>":function(){return GLM.$make_componentized_vector("$vmatN",GLM.matN)},$vquat:function(){return GLM.$make_componentized_vector("$vquat",GLM.quat)}},"$v"),b;for(b in a)GLM[b]=a[b]()})();
(GLM._redefine_base64_helpers=function define_base64_helpers(b,c){function e(b){return(b+"").replace(/\s/g,"")}function d(b){return new k(b.split("").map(function(b){return b.charCodeAt(0)}))}function h(b){b instanceof k||(b=new k(b));return[].map.call(b,function(b){return String.fromCharCode(b)}).join("")}function j(b){b=b instanceof i?b:d(b).buffer;return GLM.$b64.encode(b,b.byteOffset,b.byteLength)}function g(b){b=new String(h(GLM.$b64.decode(b)));b.array=d(b);b.buffer=b.array.buffer;return b}
b=define_base64_helpers.atob=b||define_base64_helpers.atob||g;c=define_base64_helpers.btoa=c||define_base64_helpers.btoa||j;var k=GLM.$outer.Uint8Array,i=GLM.$outer.ArrayBuffer,w,r="ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/".indexOf.bind("ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/");w={encode:function(b,c,d){b=new k(b,c,d);d=b.length;var e="";for(c=0;c<d;c+=3)e+="ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/"[b[c]>>2],e+="ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/"[(b[c]&
3)<<4|b[c+1]>>4],e+="ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/"[(b[c+1]&15)<<2|b[c+2]>>6],e+="ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/"[b[c+2]&63];2===d%3?e=e.substring(0,e.length-1)+"=":1===d%3&&(e=e.substring(0,e.length-2)+"==");return e},decode:function(b){b=e(b);var c=b.length,d=0.75*c,g=0,h,j,f,v;"="===b[c-1]&&(d--,"="===b[c-2]&&d--);for(var w=new i(d),R=new k(w),d=0;d<c;d+=4)h=r(b[d]),j=r(b[d+1]),f=r(b[d+2]),v=r(b[d+3]),R[g++]=h<<2|j>>4,R[g++]=
(j&15)<<4|f>>2,R[g++]=(f&3)<<6|v&63;return w}};GLM.$template.extend(w,{trim:e,atob:b,btoa:c,$atob:g,$btoa:j,toCharCodes:d,fromCharCodes:h,b64_to_utf8:function(c){return decodeURIComponent(escape(b(e(c))))},utf8_to_b64:function(b){return c(unescape(encodeURIComponent(b)))}});GLM.$template.extend(GLM,{$b64:w,$to_base64:function(b){return GLM.$b64.encode(b.elements.buffer,b.elements.byteOffset,b.elements.byteLength)},$from_base64:function(b,c){var d=GLM.$b64.decode(b);if(!0===c||c==GLM.$outer.ArrayBuffer)return d;
void 0===c&&(c=GLM.$outer.Float32Array);return new c(d);throw new GLM.GLMJSError("TODO: $from_base64 not yet supported second argument type: ("+[typeof c,c]+")");}})})("function"===typeof atob&&atob.bind(this),"function"===typeof btoa&&btoa.bind(this));
(function(){function a(a,c){return{get:function(){return a.call(this)},set:function(a){if(this.copy)return this.copy(new this.constructor(c.call(this,a)));this.elements.set(c.call(this,a))}}}"$bool $float32 $vfloat32 $vuint8 $vuint16 $vuint32 $vvec2 $vvec3 $vvec4 $vmat3 $vmat4 $vquat vec2 vec3 vec4 mat3 mat4 uvec2 uvec3 uvec4 ivec2 ivec3 ivec4 bvec2 bvec3 bvec4 quat".split(" ").map(GLM.$getGLMType).forEach(function(b){Object.defineProperty(b.prototype,"array",a(function(){return GLM.$to_array(this)},
function(a){return a}));Object.defineProperty(b.prototype,"base64",a(function(){return GLM.$to_base64(this)},function(a){return GLM.$from_base64(a,this.elements.constructor)}));Object.defineProperty(b.prototype,"buffer",a(function(){return this.elements.buffer},function(a){return new this.elements.constructor(a)}));Object.defineProperty(b.prototype,"json",a(function(){return GLM.$to_json(this)},function(a){return JSON.parse(a)}));Object.defineProperty(b.prototype,"object",a(function(){return GLM.$to_object(this)},
function(a){return a}));Object.defineProperty(b.prototype,"glsl",a(function(){return GLM.$to_glsl(this)},function(a){return GLM.$from_glsl(a,Array)}))})})();
glm.GLMAT = GLMAT; globals.glm = glm; try { module.exports = glm; } catch(e) { }; try { window.glm = glm; } catch(e) {} ; try { declare.amd && declare(function() { return glm; }); } catch(e) {}; return this.glm = glm; })(this, typeof $GLM_log !== "undefined" ? $GLM_log : undefined, typeof $GLM_console_log !== "undefined" ? $GLM_console_log : undefined);

/* WEBPACK VAR INJECTION */}.call(exports, __webpack_require__(3)))

/***/ }),
/* 22 */
/***/ (function(module, exports, __webpack_require__) {

var stream = __webpack_require__(17);
var split = __webpack_require__(40);
var xhr = __webpack_require__(50);


function ObjLoader() {

  this.vertices = [];
  this.normals = [];
  this.textureCoords = [];
  this.faces = [];
  this.facesMaterialsIndex = [{materialName: null, materialStartIndex: 0}];
  this.materials = [];

}

ObjLoader.prototype.load = function(objFilePath, mtlFilePath, callback) {

  var self = this;

  if(typeof mtlFilePath === "function") {
    callback = mtlFilePath;
    mtlFilePath = "";
  }

  xhr(objFilePath, function (err, resp, objFileString) {
    if(err) {
      /*Error Handling*/
      callback(err);
    }
    /*Create readable stream to read obj file line by line*/
    var readable = self.createReadStream(objFileString);

    readable
      .pipe(split())
      .on('data', function(line) {
        self.parseObj(line);
      })
      .on('end', function() {

        /*Start reading .mtl file*/
        if(typeof mtlFilePath === "string" && mtlFilePath !== "") {
          xhr(mtlFilePath, function (err, resp, mtlFileString) {

            if(err) {
              callback(err);
            }

            var currentMat = {};
            var readable = self.createReadStream(mtlFileString);

            readable
              .pipe(split())
              .on('data', function(line) {
                currentMat = self.parseMtl(line, currentMat);
              })
              .on('end', function() {
                if(currentMat.name) {
                  self.materials.push(currentMat);
                }
                /*Geometry and Materials*/
                callback(
                  null,
                  {
                    vertices: self.vertices,
                    normals: self.normals,
                    textureCoords: self.textureCoords,
                    faces: self.faces,
                    facesMaterialsIndex: self.facesMaterialsIndex,
                    materials: self.materials
                  }
                );
              })
              .on('err', function(err) {
                /*Error Handling*/
                callback(err)
              });
          });
        }
        else {
          /*Only Geometry*/
          callback(
            null,
            {
              vertices: self.vertices,
              normals: self.normals,
              textureCoords: self.textureCoords,
              faces: self.faces
            }
          );
        }
      })
      .on('err', function(err) {
        /*Error Handling*/
        callback(err);
      });
  });
}


ObjLoader.prototype.createReadStream = function(fileString) {
  var readable = new stream.Readable();
  readable._read = function noop() {};
  readable.push(fileString);
  readable.push(null);
  return readable;
}


ObjLoader.prototype.parseObj = function(line) {

  /*Not include comment*/
  var commentStart = line.indexOf("#");
  if(commentStart != -1) {
    line = line.substring(0, commentStart);
  }
  line = line.trim();

  var splitedLine = line.split(/\s+/);

  if(splitedLine[0] === 'v') {
    var vertex = [Number(splitedLine[1]), Number(splitedLine[2]), Number(splitedLine[3]), splitedLine[4]? 1 : Number(splitedLine[4])];
    this.vertices.push(vertex);
  }
  else if(splitedLine[0] === 'vt') {
    var textureCoord = [Number(splitedLine[1]), Number(splitedLine[2]), splitedLine[3]? 1 : Number(splitedLine[3])]
    this.textureCoords.push(textureCoord);
  }
  else if(splitedLine[0] === 'vn') {
    var normal = [Number(splitedLine[1]), Number(splitedLine[2]), Number(splitedLine[3])];
    this.normals.push(normal);
  }
  else if(splitedLine[0] === 'f') {
    var face = {
      indices: [],
      texture: [],
      normal: []
      };

    for(var i = 1; i < splitedLine.length; ++i) {
      var dIndex = splitedLine[i].indexOf('//');
      var splitedFaceIndices = splitedLine[i].split(/\W+/);

      if(dIndex > 0) {
        /*Vertex Normal Indices Without Texture Coordinate Indices*/
        face.indices.push(splitedFaceIndices[0]);
        face.normal.push(splitedFaceIndices[1]);
      }
      else {
        if(splitedFaceIndices.length === 1) {
          /*Vertex Indices*/
          face.indices.push(splitedFaceIndices[0]);
        }
        else if(splitedFaceIndices.length === 2) {
          /*Vertex Texture Coordinate Indices*/
          face.indices.push(splitedFaceIndices[0]);
          face.texture.push(splitedFaceIndices[1]);
        }
        else if(splitedFaceIndices.length === 3) {
          /*Vertex Normal Indices*/
          face.indices.push(splitedFaceIndices[0]);
          face.texture.push(splitedFaceIndices[1]);
          face.normal.push(splitedFaceIndices[2]);
        }
      }
    }

    this.faces.push(face);
  }
  else if(splitedLine[0] === "usemtl") {
    if(this.faces.length === 0) {
      this.facesMaterialsIndex[0].materialName = splitedLine[1];
    }
    else {
      var materialName = splitedLine[1];
      var materialStartIndex = this.faces.length;

      this.facesMaterialsIndex.push({materialName: materialName, materialStartIndex: materialStartIndex});
    }
  }
}


ObjLoader.prototype.parseMtl = function(line, currentMat) {

  /*Not include comment*/
  var commentStart = line.indexOf("#");
  if(commentStart != -1) {
    line = line.substring(0, commentStart);
  }

  line = line.trim();
  var splitedLine = line.split(/\s+/);

  if(splitedLine[0] === "newmtl") {
    if(currentMat.name) {
      this.materials.push(currentMat);
      currentMat = {};
    }
    currentMat.name = splitedLine[1];
  }
  else if(splitedLine[0] === "Ka") {
    currentMat.ambient = [];
    for(var i = 0; i < 3; ++i) {
      currentMat.ambient.push(splitedLine[i+1]);
    }
  }
  else if(splitedLine[0] === "Kd") {
    currentMat.diffuse = [];
    for(var i = 0; i < 3; ++i) {
      currentMat.diffuse.push(splitedLine[i+1]);
    }
  }
  else if(splitedLine[0] === "Ks") {
    currentMat.specular = [];
    for(var i = 0; i < 3; ++i) {
      currentMat.specular.push(splitedLine[i+1]);
    }
  }
  else if(splitedLine[0] === "Ns") {
    currentMat.specularExponent = splitedLine[1];
  }
  else if(splitedLine[0] === "d" || splitedLine[0] === "Tr") {
    currentMat.transparent = splitedLine[1];
  }
  else if(splitedLine[0] === "illum") {
    currentMat.illumMode = splitedLine[1];
  }
  else if(splitedLine[0] === "map_Ka") {
    currentMat.ambientMap = splitedLine[1];
  }
  else if(splitedLine[0] === "map_Kd") {
    currentMat.diffuseMap = splitedLine[1];
  }
  else if(splitedLine[0] === "map_Ks") {
    currentMat.specularMap = splitedLine[1];
  }
  else if(splitedLine[0] === "map_d") {
    currentMat.alphaMat = splitedLine[1];
  }
  else if(splitedLine[0] === "map_bump" || splitedLine[0] === "bump") {
    currentMat.bumpMap = splitedLine[1];
  }
  else if(splitedLine[0] === "disp") {
    currentMat.displacementMap = splitedLine[1];
  }

  return currentMat;
}


module.exports = ObjLoader;


/***/ }),
/* 23 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var _framework = __webpack_require__(20);

var _framework2 = _interopRequireDefault(_framework);

var _camera = __webpack_require__(18);

var _camera2 = _interopRequireDefault(_camera);

var _controls = __webpack_require__(19);

var _controls2 = _interopRequireDefault(_controls);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var ObjMtlLoader = __webpack_require__(22);
var glm = __webpack_require__(21);


var uniform = {
    TIME: 0,
    RESOLUTION: 1,
    MOUSE: 2,
    MODEL: 3,
    VIEW: 4,
    PROJECTION: 5,
    PROJECTIONVIEW: 6
    //ROTX: 3,
    //ROTY: 4
};

var varying = {
    POSTION: 0,
    VELOCITY: 1,
    OBJPOS: 2
};

var program = {
    PARTICLES: 0,
    DRAW: 1
};

var programs = [];

var startTime;
var num_particles = 10000;
var mouseX = 0;
var mouseY = 0;

//var obj_vertices;
var obj_list = [];
var obj_names = ["doberman", "dragon", "sphere", "cube"];
var obj_frame_count = [22, 1, 1, 1];

function glmMatToArray(mat) {
    return [mat[0][0], mat[0][1], mat[0][2], mat[0][3], mat[1][0], mat[1][1], mat[1][2], mat[1][3], mat[2][0], mat[2][1], mat[2][2], mat[2][3], mat[3][0], mat[3][1], mat[3][2], mat[3][3]];
}

var config = {
    pause: false,
    mouse: false,
    grid_width: 20,
    marker_density: 5.0,
    agent_density: 0.5,
    agent_speed: 1,
    object: 1,
    animated_object: 1
};

function onLoad(framework) {

    loadOBJs(obj_names.slice(), framework, obj_frame_count.slice());
}

function loadOBJs(objNames, framework, objFrames) {

    if (objFrames[0] == 0) {
        objNames.splice(0, 1);
        objFrames.splice(0, 1);
    }

    if (objNames.length == 0) {
        console.log("Static OBJs loaded...");
        //obj_vertices = obj_list[0][0].flattenedVertices;
        setUpGUI(framework);
        setUpWebGL(framework);
        return;
    }

    var objMtlLoader = new ObjMtlLoader();
    objMtlLoader.load("./models/" + objNames[0] + "/" + objFrames[0] + ".obj", function (err, result) {
        if (err) {
            console.log("obj error");
        }
        console.log("Loading " + objNames[0] + objFrames[0] + "...");

        if (!obj_list[obj_names.indexOf(objNames[0])]) {
            obj_list[obj_names.indexOf(objNames[0])] = [];
        }

        //        var obj_positions = [];
        //        var vertices = result.vertices;
        //
        //        for (var i = 0; i < vertices.length; i++) {
        //
        //                var pos = vertices[i];
        //                obj_positions.push(pos[0]);
        //                obj_positions.push(pos[1]);
        //                obj_positions.push(pos[2]);
        //                obj_positions.push(1.0);
        //
        //        } 
        //        
        //        result.flattenedVertices = obj_positions;

        obj_list[obj_names.indexOf(objNames[0])].unshift(result);

        //obj_vertices = result.vertices;
        //console.log(obj_vertices.length);

        objFrames[0] = objFrames[0] - 1;
        loadOBJs(objNames, framework, objFrames);
    });
}

function setUpGUI(framework) {
    var gui = framework.gui;

    gui.add(config, 'pause').name("Pause").onChange(function (value) {

        if (value) {
            config.pause = value;
        } else {
            config.pause = value;
        }
    });

    //    gui.add(config, 'mouse').name("Mouse").onChange(function(value) {
    //
    //        if (value) {
    //          config.mouse = value;
    //        } else {
    //          config.mouse = value;
    //        }
    //    });

    gui.add(config, 'object', { Doberman: 1, Dragon: 2, Sphere: 3, Cube: 4 }).name("Object").onChange(function (obj_index) {
        config.object = obj_index;

        var obj_positions = [];
        var verts = obj_list[config.object - 1][0].vertices;
        for (var i = 0; i < num_particles; i++) {

            var pos = verts[i % verts.length];
            obj_positions.push(pos[0]);
            obj_positions.push(pos[1]);
            obj_positions.push(pos[2]);
            obj_positions.push(1.0);
        }
        //var obj_positions = obj_list[config.object-1][0].flattenedVertices;

        framework.webgl.gl.useProgram(programs[program.PARTICLES]);
        framework.webgl.setAttributeBufferAtIndex(programs[program.PARTICLES], 2, obj_positions);
    });
}

/**************************

Start: Mouse controls
TODO: Move to separate class

**************************/

var drag = 0;
var yRotation = 0;
var xRotation = 0;
var xOffset = 0;
var yOffset = 0;
var totalX = 90;

function mymousedown(event) {
    drag = 1;
    xOffset = event.clientX;
    yOffset = event.clientY;
}

function mymouseup(event) {
    drag = 0;
}

function mymousemove(event) {

    if (drag == 0) {
        xOffset = event.clientX;
        yOffset = event.clientY;
        return;
    }

    yRotation = -xOffset + event.clientX;
    xRotation = -yOffset + event.clientY;

    xOffset = event.clientX;
    yOffset = event.clientY;

    camera.rotateAboutUp(yRotation);
    camera.rotateAboutRight(xRotation);
}

function wheelHandler(event) {

    var translation;
    if ((event.detail || event.wheelDelta) > 0) {
        camera.translateAlongLook(0.1);
    } else {
        camera.translateAlongLook(-0.1);
    }
    event.preventDefault();
}

/**************************

End: Mouse controls

**************************/

var camera;
var controls;

function setUpWebGL(framework) {

    var canvas = framework.canvas;
    var gl = framework.webgl.gl;

    canvas.addEventListener('DOMMouseScroll', wheelHandler, false);
    canvas.addEventListener('mousewheel', wheelHandler, false);
    canvas.addEventListener('mousedown', mymousedown, false);
    canvas.addEventListener('mouseup', mymouseup, false);
    canvas.addEventListener('mousemove', mymousemove, false);

    camera = new _camera2.default(canvas);
    //controls = new Controls(canvas, camera);

    startTime = Date.now();

    programs = framework.webgl.createPrograms(["particles", "draw"]);

    //provide webgl with output attributes for capture into buffers
    //GL_SEPARATE_ATTRIBS: Write attributes to multiple buffer objects
    gl.transformFeedbackVaryings(programs[program.PARTICLES], ["outPos", "outVel"], gl.SEPARATE_ATTRIBS);
    gl.linkProgram(programs[program.PARTICLES]);
    gl.useProgram(programs[program.PARTICLES]);

    //assign attribute locations to given program to access as programs[program.PARTICLES].attributeLocations
    framework.webgl.setAttributeLocations(programs[program.PARTICLES], ["inPos", "inVel", "inObjPos"]);

    var particle_positions = [];

    var angleOffset = 2.0 * Math.PI / num_particles;
    var sqrt_num_particles = Math.sqrt(num_particles);

    for (var x = -0.5; x < 0.5; x) {
        var temp_x = 1.0 / sqrt_num_particles;
        for (var y = -0.5; y < 0.5; y) {
            var temp_y = 1.0 / sqrt_num_particles;

            particle_positions.push(x);
            particle_positions.push(y);
            particle_positions.push(0);
            particle_positions.push(1);
            y += temp_y;
        }
        x += temp_x;
    }

    var particle_velocites = [];

    for (var x = 0; x < sqrt_num_particles; x++) {
        for (var y = 0; y < sqrt_num_particles; y++) {

            particle_velocites.push((Math.random() * 2.0 - 1.0) / 10.0);
            particle_velocites.push((Math.random() * 2.0 - 1.0) / 10.0);
            particle_velocites.push((Math.random() * 2.0 - 1.0) / 10.0);
            particle_velocites.push(1.0);
        }
    }

    var obj_positions = [];

    for (var i = 0; i < num_particles; i++) {

        var pos = obj_list[0][0].vertices[i % obj_list[0][0].vertices.length];
        obj_positions.push(pos[0]);
        obj_positions.push(pos[1]);
        obj_positions.push(pos[2]);
        obj_positions.push(1.0);
    }

    framework.webgl.setAttributeBuffer(programs[program.PARTICLES], "inPos", particle_positions);
    framework.webgl.setAttributeBuffer(programs[program.PARTICLES], "inVel", particle_velocites);
    framework.webgl.setAttributeBuffer(programs[program.PARTICLES], "inObjPos", obj_positions);
    framework.webgl.setAttributeBuffers(programs[program.DRAW], ["inPos", "inVel"], new Float32Array(4 * num_particles));

    framework.webgl.setUniformLocations(programs[program.PARTICLES], ["u_time", "u_resolution", "u_mouse", "u_model", "u_view", "u_projection", "u_projectionView"]);
    framework.webgl.setUniformLocations(programs[program.DRAW], ["u_time", "u_resolution", "u_mouse", "u_model", "u_view", "u_projection", "u_projectionView"]);

    var transformFeedback = gl.createTransformFeedback();
    gl.bindTransformFeedback(gl.TRANSFORM_FEEDBACK, transformFeedback);

    window.dispatchEvent(new Event('resize'));
}

var frame = 0;

function updateAnimationFrame(curr_frame, framework) {

    if (obj_frame_count[config.object - 1].length == 1) return;

    var f = curr_frame % obj_frame_count[config.object - 1];
    //console.log(f);

    //var obj_positions =  obj_list[config.object-1][f].flattenedVertices;
    var obj_positions = [];
    var verts = obj_list[config.object - 1][f].vertices;

    for (var i = 0; i < num_particles; i++) {

        var pos = verts[i % verts.length];
        obj_positions.push(pos[0]);
        obj_positions.push(pos[1]);
        obj_positions.push(pos[2]);
        obj_positions.push(1.0);
    }

    framework.webgl.gl.useProgram(programs[program.PARTICLES]);
    framework.webgl.setAttributeBufferAtIndex(programs[program.PARTICLES], 2, obj_positions);
}

function onUpdate(framework) {
    if (config.pause) return;
    frame++;
    if (!programs[program.PARTICLES] || !programs[program.DRAW]) {
        return;
    }
    var time = Date.now() - startTime;
    //console.log(time);
    if (frame % 20 == 0) {
        updateAnimationFrame(frame / 20, framework);
    }

    var canvas = framework.canvas;
    var ndcX = (xOffset - canvas.offsetLeft) / canvas.clientWidth * 2 - 1;
    var ndcY = (1 - (yOffset - canvas.offsetTop) / canvas.clientHeight) * 2 - 1;

    var worldPoint = glm.inverse(camera.getViewProj())['*'](glm.vec4(ndcX, ndcY, 1.0, 1.0))['*'](camera.farClip - 1);
    // worldPoint = worldPoint['/'](worldPoint.w);
    //ndcX = worldPoint.x;
    //ndcY = worldPoint.y;
    //console.log(ndcY);

    if (drag == 0) worldPoint = glm.vec4(Number.NEGATIVE_INFINITY);

    var gl = framework.webgl.gl;
    gl.clearColor(0, 0, 0, 1);
    gl.clear(gl.COLOR_BUFFER_BIT);
    gl.viewport(0, 0, gl.canvas.width, gl.canvas.height);

    gl.useProgram(programs[program.PARTICLES]);

    framework.webgl.setVertexAttributePointers(programs[program.PARTICLES], [varying.POSTION, varying.VELOCITY, varying.OBJPOS]);

    //bind the transform feedback buffers
    gl.bindBufferBase(gl.TRANSFORM_FEEDBACK_BUFFER, 0, programs[program.DRAW].attributeBuffers[varying.POSTION]);
    gl.bindBufferBase(gl.TRANSFORM_FEEDBACK_BUFFER, 1, programs[program.DRAW].attributeBuffers[varying.VELOCITY]);

    gl.uniform1f(programs[program.PARTICLES].uniformLocations[uniform.TIME], time);
    gl.uniform2f(programs[program.PARTICLES].uniformLocations[uniform.RESOLUTION], gl.canvas.width, gl.canvas.height);
    gl.uniform4f(programs[program.PARTICLES].uniformLocations[uniform.MOUSE], worldPoint.x, worldPoint.y, worldPoint.z, worldPoint.w);

    gl.uniformMatrix4fv(programs[program.PARTICLES].uniformLocations[uniform.MODEL], false, new Float32Array(glmMatToArray(camera.getModel())));
    gl.uniformMatrix4fv(programs[program.PARTICLES].uniformLocations[uniform.VIEW], false, glmMatToArray(glmMatToArray(camera.getView())));
    gl.uniformMatrix4fv(programs[program.PARTICLES].uniformLocations[uniform.PROJECTION], false, new Float32Array(glmMatToArray(camera.getProjection())));
    gl.uniformMatrix4fv(programs[program.PARTICLES].uniformLocations[uniform.PROJECTIONVIEW], false, glmMatToArray(camera.getViewProj()));

    //no drawing
    gl.enable(gl.RASTERIZER_DISCARD);
    gl.beginTransformFeedback(gl.POINTS);
    gl.drawArrays(gl.POINTS, 0, num_particles);
    gl.endTransformFeedback();

    gl.disable(gl.RASTERIZER_DISCARD);
    //clear transform feedback buffer binding
    gl.bindBufferBase(gl.TRANSFORM_FEEDBACK_BUFFER, 0, null);
    gl.bindBufferBase(gl.TRANSFORM_FEEDBACK_BUFFER, 1, null);

    //draw the points from draw program
    gl.useProgram(programs[program.DRAW]);
    gl.uniform1f(programs[program.DRAW].uniformLocations[uniform.TIME], time);
    gl.uniform2f(programs[program.DRAW].uniformLocations[uniform.RESOLUTION], gl.canvas.width, gl.canvas.height);
    gl.uniform4f(programs[program.DRAW].uniformLocations[uniform.MOUSE], worldPoint.x, worldPoint.y, worldPoint.z, worldPoint.w);
    gl.uniformMatrix4fv(programs[program.DRAW].uniformLocations[uniform.MODEL], false, new Float32Array(glmMatToArray(camera.getModel())));
    gl.uniformMatrix4fv(programs[program.DRAW].uniformLocations[uniform.VIEW], false, glmMatToArray(glmMatToArray(camera.getView())));
    gl.uniformMatrix4fv(programs[program.DRAW].uniformLocations[uniform.PROJECTION], false, new Float32Array(glmMatToArray(camera.getProjection())));
    gl.uniformMatrix4fv(programs[program.DRAW].uniformLocations[uniform.PROJECTIONVIEW], false, glmMatToArray(camera.getViewProj()));

    gl.enable(gl.DEPTH_TEST);
    gl.drawArrays(gl.POINTS, 0, num_particles);

    //swap the attribute buffers of particles shader with the buffers from transform feedback to be used as input in the next iteration 
    framework.webgl.swapAttributeBuffers(programs, [varying.POSTION, varying.VELOCITY]);
}

// when the scene is done initializing, it will call onLoad, then on frame updates, call onUpdate
_framework2.default.init(onLoad, onUpdate);

/***/ }),
/* 24 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.default = WebGL2;
function createProgram(gl, vertexShader, fragmentShader) {
    var program = gl.createProgram();
    gl.attachShader(program, vertexShader);
    gl.attachShader(program, fragmentShader);
    gl.linkProgram(program);
    var success = gl.getProgramParameter(program, gl.LINK_STATUS);
    if (success) {
        return program;
    }

    console.log(gl.getProgramInfoLog(program));
    gl.deleteProgram(program);
}

function createShader(gl, source, type) {
    var shader = gl.createShader(type);
    gl.shaderSource(shader, source);
    gl.compileShader(shader);
    var success = gl.getShaderParameter(shader, gl.COMPILE_STATUS);
    if (success) {
        return shader;
    }

    console.log(gl.getShaderInfoLog(shader));
    gl.deleteShader(shader);
}

function WebGL2() {

    this.canvas = document.getElementById('canvas');
    this.gl = canvas.getContext('webgl2');
    this.programs = [];

    this.attributeBuffers = [];

    this.createPrograms = function (fileNames) {

        var gl = this.gl;

        for (var i = 0; i < fileNames.length; i++) {

            var vertexShaderSource = __webpack_require__(53)("./" + fileNames[i] + '-vert.glsl');
            var fragmentShaderSource = __webpack_require__(52)("./" + fileNames[i] + '-frag.glsl');

            var vertexShader = createShader(gl, vertexShaderSource, gl.VERTEX_SHADER);
            var fragmentShader = createShader(gl, fragmentShaderSource, gl.FRAGMENT_SHADER);
            this.programs[i] = createProgram(gl, vertexShader, fragmentShader);
            this.programs[i].attributeBuffers = [];
        }

        return this.programs;
    };

    this.setAttributeLocations = function (program, attributeNames) {

        var gl = this.gl;
        program.attributeLocations = [];

        for (var i = 0; i < attributeNames.length; i++) {
            program.attributeLocations[i] = gl.getAttribLocation(program, attributeNames[i]);
            gl.enableVertexAttribArray(program.attributeLocations[i]);
        }

        return program.attributeLocations;
    };

    this.setUniformLocations = function (program, uniformNames) {

        var gl = this.gl;
        program.uniformLocations = [];

        for (var i = 0; i < uniformNames.length; i++) {
            program.uniformLocations[i] = gl.getUniformLocation(program, uniformNames[i]);
        }

        return program.uniformLocations;
    };

    this.setAttributeBufferAtIndex = function (program, bufferIndex, data) {

        var gl = this.gl;
        var index = bufferIndex;

        program.attributeBuffers[index] = gl.createBuffer();
        gl.bindBuffer(gl.ARRAY_BUFFER, program.attributeBuffers[index]);
        gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(data), gl.DYNAMIC_COPY);

        return program.attributeBuffers;
    };

    this.setAttributeBuffer = function (program, bufferName, data) {

        var gl = this.gl;
        var index = program.attributeBuffers.length;

        program.attributeBuffers[index] = gl.createBuffer();
        gl.bindBuffer(gl.ARRAY_BUFFER, program.attributeBuffers[index]);
        gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(data), gl.DYNAMIC_COPY);

        return program.attributeBuffers;
    };

    this.setAttributeBuffers = function (program, bufferNames, data) {

        var gl = this.gl;
        program.attributeBuffers = [];

        for (var i = 0; i < bufferNames.length; i++) {
            program.attributeBuffers[i] = gl.createBuffer();
            gl.bindBuffer(gl.ARRAY_BUFFER, program.attributeBuffers[i]);

            if (data) {
                gl.bufferData(gl.ARRAY_BUFFER, data, gl.DYNAMIC_COPY);
            }
            //DEBUG: Setting initial positions and random velocities for particles
            else if (i == 0) {
                    var particle_positions = [];

                    var num_particles = 1000000;
                    var angleOffset = 2.0 * Math.PI / num_particles;
                    var sqrt_num_particles = Math.sqrt(num_particles);

                    for (var x = -1.0; x < 1.0; x) {
                        var temp_x = 2.0 / sqrt_num_particles;
                        for (var y = -1.0; y < 1.0; y) {
                            var temp_y = 2.0 / sqrt_num_particles;

                            particle_positions.push(x);
                            particle_positions.push(y);
                            particle_positions.push(0.0);
                            particle_positions.push(1.0);
                            y += temp_y;
                        }
                        x += temp_x;
                    }
                    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(particle_positions), gl.DYNAMIC_COPY);
                } else if (i == 1 || i == 2) {
                    var particle_velocites = [];

                    var num_particles = 1000000;
                    var sqrt_num_particles = Math.sqrt(num_particles);
                    var angleOffset = 2.0 * Math.PI / num_particles;

                    for (var x = 0; x < sqrt_num_particles; x++) {
                        for (var y = 0; y < sqrt_num_particles; y++) {

                            particle_velocites.push((Math.random() * 2.0 - 1.0) / 1000.0);
                            particle_velocites.push((Math.random() * 2.0 - 1.0) / 1000.0);
                            particle_velocites.push((Math.random() * 2.0 - 1.0) / 1000.0);
                            particle_velocites.push(1.0);
                        }
                    }
                    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(particle_velocites), gl.DYNAMIC_COPY);
                }
        }

        return program.attributeBuffers;
    };

    this.setVertexAttributePointers = function (program, bufferIndices) {

        var gl = this.gl;

        for (var i = 0; i < bufferIndices.length; i++) {
            gl.bindBuffer(gl.ARRAY_BUFFER, program.attributeBuffers[bufferIndices[i]]);
            //4 components per iteration, data is 32bit floats, don't normalize the data
            gl.vertexAttribPointer(program.attributeLocations[bufferIndices[i]], 4, gl.FLOAT, gl.FALSE, 0, 0);
        }

        return program.uniformLocations;
    };

    this.swapAttributeBuffers = function (programs, bufferIndices) {

        for (var i = 0; i < bufferIndices.length; i++) {
            var t = programs[0].attributeBuffers[bufferIndices[i]];
            programs[0].attributeBuffers[bufferIndices[i]] = programs[1].attributeBuffers[bufferIndices[i]];
            programs[1].attributeBuffers[bufferIndices[i]] = t;
        }
    };
}

/***/ }),
/* 25 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


exports.byteLength = byteLength
exports.toByteArray = toByteArray
exports.fromByteArray = fromByteArray

var lookup = []
var revLookup = []
var Arr = typeof Uint8Array !== 'undefined' ? Uint8Array : Array

var code = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/'
for (var i = 0, len = code.length; i < len; ++i) {
  lookup[i] = code[i]
  revLookup[code.charCodeAt(i)] = i
}

revLookup['-'.charCodeAt(0)] = 62
revLookup['_'.charCodeAt(0)] = 63

function placeHoldersCount (b64) {
  var len = b64.length
  if (len % 4 > 0) {
    throw new Error('Invalid string. Length must be a multiple of 4')
  }

  // the number of equal signs (place holders)
  // if there are two placeholders, than the two characters before it
  // represent one byte
  // if there is only one, then the three characters before it represent 2 bytes
  // this is just a cheap hack to not do indexOf twice
  return b64[len - 2] === '=' ? 2 : b64[len - 1] === '=' ? 1 : 0
}

function byteLength (b64) {
  // base64 is 4/3 + up to two characters of the original data
  return b64.length * 3 / 4 - placeHoldersCount(b64)
}

function toByteArray (b64) {
  var i, j, l, tmp, placeHolders, arr
  var len = b64.length
  placeHolders = placeHoldersCount(b64)

  arr = new Arr(len * 3 / 4 - placeHolders)

  // if there are placeholders, only get up to the last complete 4 chars
  l = placeHolders > 0 ? len - 4 : len

  var L = 0

  for (i = 0, j = 0; i < l; i += 4, j += 3) {
    tmp = (revLookup[b64.charCodeAt(i)] << 18) | (revLookup[b64.charCodeAt(i + 1)] << 12) | (revLookup[b64.charCodeAt(i + 2)] << 6) | revLookup[b64.charCodeAt(i + 3)]
    arr[L++] = (tmp >> 16) & 0xFF
    arr[L++] = (tmp >> 8) & 0xFF
    arr[L++] = tmp & 0xFF
  }

  if (placeHolders === 2) {
    tmp = (revLookup[b64.charCodeAt(i)] << 2) | (revLookup[b64.charCodeAt(i + 1)] >> 4)
    arr[L++] = tmp & 0xFF
  } else if (placeHolders === 1) {
    tmp = (revLookup[b64.charCodeAt(i)] << 10) | (revLookup[b64.charCodeAt(i + 1)] << 4) | (revLookup[b64.charCodeAt(i + 2)] >> 2)
    arr[L++] = (tmp >> 8) & 0xFF
    arr[L++] = tmp & 0xFF
  }

  return arr
}

function tripletToBase64 (num) {
  return lookup[num >> 18 & 0x3F] + lookup[num >> 12 & 0x3F] + lookup[num >> 6 & 0x3F] + lookup[num & 0x3F]
}

function encodeChunk (uint8, start, end) {
  var tmp
  var output = []
  for (var i = start; i < end; i += 3) {
    tmp = (uint8[i] << 16) + (uint8[i + 1] << 8) + (uint8[i + 2])
    output.push(tripletToBase64(tmp))
  }
  return output.join('')
}

function fromByteArray (uint8) {
  var tmp
  var len = uint8.length
  var extraBytes = len % 3 // if we have 1 byte left, pad 2 bytes
  var output = ''
  var parts = []
  var maxChunkLength = 16383 // must be multiple of 3

  // go through the array every three bytes, we'll deal with trailing stuff later
  for (var i = 0, len2 = len - extraBytes; i < len2; i += maxChunkLength) {
    parts.push(encodeChunk(uint8, i, (i + maxChunkLength) > len2 ? len2 : (i + maxChunkLength)))
  }

  // pad the end with zeros, but make sure to not forget the extra bytes
  if (extraBytes === 1) {
    tmp = uint8[len - 1]
    output += lookup[tmp >> 2]
    output += lookup[(tmp << 4) & 0x3F]
    output += '=='
  } else if (extraBytes === 2) {
    tmp = (uint8[len - 2] << 8) + (uint8[len - 1])
    output += lookup[tmp >> 10]
    output += lookup[(tmp >> 4) & 0x3F]
    output += lookup[(tmp << 2) & 0x3F]
    output += '='
  }

  parts.push(output)

  return parts.join('')
}


/***/ }),
/* 26 */
/***/ (function(module, exports, __webpack_require__) {

module.exports = __webpack_require__(28)
module.exports.color = __webpack_require__(27)

/***/ }),
/* 27 */
/***/ (function(module, exports) {

/**
 * dat-gui JavaScript Controller Library
 * http://code.google.com/p/dat-gui
 *
 * Copyright 2011 Data Arts Team, Google Creative Lab
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 */

/** @namespace */
var dat = module.exports = dat || {};

/** @namespace */
dat.color = dat.color || {};

/** @namespace */
dat.utils = dat.utils || {};

dat.utils.common = (function () {
  
  var ARR_EACH = Array.prototype.forEach;
  var ARR_SLICE = Array.prototype.slice;

  /**
   * Band-aid methods for things that should be a lot easier in JavaScript.
   * Implementation and structure inspired by underscore.js
   * http://documentcloud.github.com/underscore/
   */

  return { 
    
    BREAK: {},
  
    extend: function(target) {
      
      this.each(ARR_SLICE.call(arguments, 1), function(obj) {
        
        for (var key in obj)
          if (!this.isUndefined(obj[key])) 
            target[key] = obj[key];
        
      }, this);
      
      return target;
      
    },
    
    defaults: function(target) {
      
      this.each(ARR_SLICE.call(arguments, 1), function(obj) {
        
        for (var key in obj)
          if (this.isUndefined(target[key])) 
            target[key] = obj[key];
        
      }, this);
      
      return target;
    
    },
    
    compose: function() {
      var toCall = ARR_SLICE.call(arguments);
            return function() {
              var args = ARR_SLICE.call(arguments);
              for (var i = toCall.length -1; i >= 0; i--) {
                args = [toCall[i].apply(this, args)];
              }
              return args[0];
            }
    },
    
    each: function(obj, itr, scope) {

      
      if (ARR_EACH && obj.forEach === ARR_EACH) { 
        
        obj.forEach(itr, scope);
        
      } else if (obj.length === obj.length + 0) { // Is number but not NaN
        
        for (var key = 0, l = obj.length; key < l; key++)
          if (key in obj && itr.call(scope, obj[key], key) === this.BREAK) 
            return;
            
      } else {

        for (var key in obj) 
          if (itr.call(scope, obj[key], key) === this.BREAK)
            return;
            
      }
            
    },
    
    defer: function(fnc) {
      setTimeout(fnc, 0);
    },
    
    toArray: function(obj) {
      if (obj.toArray) return obj.toArray();
      return ARR_SLICE.call(obj);
    },

    isUndefined: function(obj) {
      return obj === undefined;
    },
    
    isNull: function(obj) {
      return obj === null;
    },
    
    isNaN: function(obj) {
      return obj !== obj;
    },
    
    isArray: Array.isArray || function(obj) {
      return obj.constructor === Array;
    },
    
    isObject: function(obj) {
      return obj === Object(obj);
    },
    
    isNumber: function(obj) {
      return obj === obj+0;
    },
    
    isString: function(obj) {
      return obj === obj+'';
    },
    
    isBoolean: function(obj) {
      return obj === false || obj === true;
    },
    
    isFunction: function(obj) {
      return Object.prototype.toString.call(obj) === '[object Function]';
    }
  
  };
    
})();


dat.color.toString = (function (common) {

  return function(color) {

    if (color.a == 1 || common.isUndefined(color.a)) {

      var s = color.hex.toString(16);
      while (s.length < 6) {
        s = '0' + s;
      }

      return '#' + s;

    } else {

      return 'rgba(' + Math.round(color.r) + ',' + Math.round(color.g) + ',' + Math.round(color.b) + ',' + color.a + ')';

    }

  }

})(dat.utils.common);


dat.Color = dat.color.Color = (function (interpret, math, toString, common) {

  var Color = function() {

    this.__state = interpret.apply(this, arguments);

    if (this.__state === false) {
      throw 'Failed to interpret color arguments';
    }

    this.__state.a = this.__state.a || 1;


  };

  Color.COMPONENTS = ['r','g','b','h','s','v','hex','a'];

  common.extend(Color.prototype, {

    toString: function() {
      return toString(this);
    },

    toOriginal: function() {
      return this.__state.conversion.write(this);
    }

  });

  defineRGBComponent(Color.prototype, 'r', 2);
  defineRGBComponent(Color.prototype, 'g', 1);
  defineRGBComponent(Color.prototype, 'b', 0);

  defineHSVComponent(Color.prototype, 'h');
  defineHSVComponent(Color.prototype, 's');
  defineHSVComponent(Color.prototype, 'v');

  Object.defineProperty(Color.prototype, 'a', {

    get: function() {
      return this.__state.a;
    },

    set: function(v) {
      this.__state.a = v;
    }

  });

  Object.defineProperty(Color.prototype, 'hex', {

    get: function() {

      if (!this.__state.space !== 'HEX') {
        this.__state.hex = math.rgb_to_hex(this.r, this.g, this.b);
      }

      return this.__state.hex;

    },

    set: function(v) {

      this.__state.space = 'HEX';
      this.__state.hex = v;

    }

  });

  function defineRGBComponent(target, component, componentHexIndex) {

    Object.defineProperty(target, component, {

      get: function() {

        if (this.__state.space === 'RGB') {
          return this.__state[component];
        }

        recalculateRGB(this, component, componentHexIndex);

        return this.__state[component];

      },

      set: function(v) {

        if (this.__state.space !== 'RGB') {
          recalculateRGB(this, component, componentHexIndex);
          this.__state.space = 'RGB';
        }

        this.__state[component] = v;

      }

    });

  }

  function defineHSVComponent(target, component) {

    Object.defineProperty(target, component, {

      get: function() {

        if (this.__state.space === 'HSV')
          return this.__state[component];

        recalculateHSV(this);

        return this.__state[component];

      },

      set: function(v) {

        if (this.__state.space !== 'HSV') {
          recalculateHSV(this);
          this.__state.space = 'HSV';
        }

        this.__state[component] = v;

      }

    });

  }

  function recalculateRGB(color, component, componentHexIndex) {

    if (color.__state.space === 'HEX') {

      color.__state[component] = math.component_from_hex(color.__state.hex, componentHexIndex);

    } else if (color.__state.space === 'HSV') {

      common.extend(color.__state, math.hsv_to_rgb(color.__state.h, color.__state.s, color.__state.v));

    } else {

      throw 'Corrupted color state';

    }

  }

  function recalculateHSV(color) {

    var result = math.rgb_to_hsv(color.r, color.g, color.b);

    common.extend(color.__state,
        {
          s: result.s,
          v: result.v
        }
    );

    if (!common.isNaN(result.h)) {
      color.__state.h = result.h;
    } else if (common.isUndefined(color.__state.h)) {
      color.__state.h = 0;
    }

  }

  return Color;

})(dat.color.interpret = (function (toString, common) {

  var result, toReturn;

  var interpret = function() {

    toReturn = false;

    var original = arguments.length > 1 ? common.toArray(arguments) : arguments[0];

    common.each(INTERPRETATIONS, function(family) {

      if (family.litmus(original)) {

        common.each(family.conversions, function(conversion, conversionName) {

          result = conversion.read(original);

          if (toReturn === false && result !== false) {
            toReturn = result;
            result.conversionName = conversionName;
            result.conversion = conversion;
            return common.BREAK;

          }

        });

        return common.BREAK;

      }

    });

    return toReturn;

  };

  var INTERPRETATIONS = [

    // Strings
    {

      litmus: common.isString,

      conversions: {

        THREE_CHAR_HEX: {

          read: function(original) {

            var test = original.match(/^#([A-F0-9])([A-F0-9])([A-F0-9])$/i);
            if (test === null) return false;

            return {
              space: 'HEX',
              hex: parseInt(
                  '0x' +
                      test[1].toString() + test[1].toString() +
                      test[2].toString() + test[2].toString() +
                      test[3].toString() + test[3].toString())
            };

          },

          write: toString

        },

        SIX_CHAR_HEX: {

          read: function(original) {

            var test = original.match(/^#([A-F0-9]{6})$/i);
            if (test === null) return false;

            return {
              space: 'HEX',
              hex: parseInt('0x' + test[1].toString())
            };

          },

          write: toString

        },

        CSS_RGB: {

          read: function(original) {

            var test = original.match(/^rgb\(\s*(.+)\s*,\s*(.+)\s*,\s*(.+)\s*\)/);
            if (test === null) return false;

            return {
              space: 'RGB',
              r: parseFloat(test[1]),
              g: parseFloat(test[2]),
              b: parseFloat(test[3])
            };

          },

          write: toString

        },

        CSS_RGBA: {

          read: function(original) {

            var test = original.match(/^rgba\(\s*(.+)\s*,\s*(.+)\s*,\s*(.+)\s*\,\s*(.+)\s*\)/);
            if (test === null) return false;

            return {
              space: 'RGB',
              r: parseFloat(test[1]),
              g: parseFloat(test[2]),
              b: parseFloat(test[3]),
              a: parseFloat(test[4])
            };

          },

          write: toString

        }

      }

    },

    // Numbers
    {

      litmus: common.isNumber,

      conversions: {

        HEX: {
          read: function(original) {
            return {
              space: 'HEX',
              hex: original,
              conversionName: 'HEX'
            }
          },

          write: function(color) {
            return color.hex;
          }
        }

      }

    },

    // Arrays
    {

      litmus: common.isArray,

      conversions: {

        RGB_ARRAY: {
          read: function(original) {
            if (original.length != 3) return false;
            return {
              space: 'RGB',
              r: original[0],
              g: original[1],
              b: original[2]
            };
          },

          write: function(color) {
            return [color.r, color.g, color.b];
          }

        },

        RGBA_ARRAY: {
          read: function(original) {
            if (original.length != 4) return false;
            return {
              space: 'RGB',
              r: original[0],
              g: original[1],
              b: original[2],
              a: original[3]
            };
          },

          write: function(color) {
            return [color.r, color.g, color.b, color.a];
          }

        }

      }

    },

    // Objects
    {

      litmus: common.isObject,

      conversions: {

        RGBA_OBJ: {
          read: function(original) {
            if (common.isNumber(original.r) &&
                common.isNumber(original.g) &&
                common.isNumber(original.b) &&
                common.isNumber(original.a)) {
              return {
                space: 'RGB',
                r: original.r,
                g: original.g,
                b: original.b,
                a: original.a
              }
            }
            return false;
          },

          write: function(color) {
            return {
              r: color.r,
              g: color.g,
              b: color.b,
              a: color.a
            }
          }
        },

        RGB_OBJ: {
          read: function(original) {
            if (common.isNumber(original.r) &&
                common.isNumber(original.g) &&
                common.isNumber(original.b)) {
              return {
                space: 'RGB',
                r: original.r,
                g: original.g,
                b: original.b
              }
            }
            return false;
          },

          write: function(color) {
            return {
              r: color.r,
              g: color.g,
              b: color.b
            }
          }
        },

        HSVA_OBJ: {
          read: function(original) {
            if (common.isNumber(original.h) &&
                common.isNumber(original.s) &&
                common.isNumber(original.v) &&
                common.isNumber(original.a)) {
              return {
                space: 'HSV',
                h: original.h,
                s: original.s,
                v: original.v,
                a: original.a
              }
            }
            return false;
          },

          write: function(color) {
            return {
              h: color.h,
              s: color.s,
              v: color.v,
              a: color.a
            }
          }
        },

        HSV_OBJ: {
          read: function(original) {
            if (common.isNumber(original.h) &&
                common.isNumber(original.s) &&
                common.isNumber(original.v)) {
              return {
                space: 'HSV',
                h: original.h,
                s: original.s,
                v: original.v
              }
            }
            return false;
          },

          write: function(color) {
            return {
              h: color.h,
              s: color.s,
              v: color.v
            }
          }

        }

      }

    }


  ];

  return interpret;


})(dat.color.toString,
dat.utils.common),
dat.color.math = (function () {

  var tmpComponent;

  return {

    hsv_to_rgb: function(h, s, v) {

      var hi = Math.floor(h / 60) % 6;

      var f = h / 60 - Math.floor(h / 60);
      var p = v * (1.0 - s);
      var q = v * (1.0 - (f * s));
      var t = v * (1.0 - ((1.0 - f) * s));
      var c = [
        [v, t, p],
        [q, v, p],
        [p, v, t],
        [p, q, v],
        [t, p, v],
        [v, p, q]
      ][hi];

      return {
        r: c[0] * 255,
        g: c[1] * 255,
        b: c[2] * 255
      };

    },

    rgb_to_hsv: function(r, g, b) {

      var min = Math.min(r, g, b),
          max = Math.max(r, g, b),
          delta = max - min,
          h, s;

      if (max != 0) {
        s = delta / max;
      } else {
        return {
          h: NaN,
          s: 0,
          v: 0
        };
      }

      if (r == max) {
        h = (g - b) / delta;
      } else if (g == max) {
        h = 2 + (b - r) / delta;
      } else {
        h = 4 + (r - g) / delta;
      }
      h /= 6;
      if (h < 0) {
        h += 1;
      }

      return {
        h: h * 360,
        s: s,
        v: max / 255
      };
    },

    rgb_to_hex: function(r, g, b) {
      var hex = this.hex_with_component(0, 2, r);
      hex = this.hex_with_component(hex, 1, g);
      hex = this.hex_with_component(hex, 0, b);
      return hex;
    },

    component_from_hex: function(hex, componentIndex) {
      return (hex >> (componentIndex * 8)) & 0xFF;
    },

    hex_with_component: function(hex, componentIndex, value) {
      return value << (tmpComponent = componentIndex * 8) | (hex & ~ (0xFF << tmpComponent));
    }

  }

})(),
dat.color.toString,
dat.utils.common);

/***/ }),
/* 28 */
/***/ (function(module, exports) {

/**
 * dat-gui JavaScript Controller Library
 * http://code.google.com/p/dat-gui
 *
 * Copyright 2011 Data Arts Team, Google Creative Lab
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 */

/** @namespace */
var dat = module.exports = dat || {};

/** @namespace */
dat.gui = dat.gui || {};

/** @namespace */
dat.utils = dat.utils || {};

/** @namespace */
dat.controllers = dat.controllers || {};

/** @namespace */
dat.dom = dat.dom || {};

/** @namespace */
dat.color = dat.color || {};

dat.utils.css = (function () {
  return {
    load: function (url, doc) {
      doc = doc || document;
      var link = doc.createElement('link');
      link.type = 'text/css';
      link.rel = 'stylesheet';
      link.href = url;
      doc.getElementsByTagName('head')[0].appendChild(link);
    },
    inject: function(css, doc) {
      doc = doc || document;
      var injected = document.createElement('style');
      injected.type = 'text/css';
      injected.innerHTML = css;
      doc.getElementsByTagName('head')[0].appendChild(injected);
    }
  }
})();


dat.utils.common = (function () {
  
  var ARR_EACH = Array.prototype.forEach;
  var ARR_SLICE = Array.prototype.slice;

  /**
   * Band-aid methods for things that should be a lot easier in JavaScript.
   * Implementation and structure inspired by underscore.js
   * http://documentcloud.github.com/underscore/
   */

  return { 
    
    BREAK: {},
  
    extend: function(target) {
      
      this.each(ARR_SLICE.call(arguments, 1), function(obj) {
        
        for (var key in obj)
          if (!this.isUndefined(obj[key])) 
            target[key] = obj[key];
        
      }, this);
      
      return target;
      
    },
    
    defaults: function(target) {
      
      this.each(ARR_SLICE.call(arguments, 1), function(obj) {
        
        for (var key in obj)
          if (this.isUndefined(target[key])) 
            target[key] = obj[key];
        
      }, this);
      
      return target;
    
    },
    
    compose: function() {
      var toCall = ARR_SLICE.call(arguments);
            return function() {
              var args = ARR_SLICE.call(arguments);
              for (var i = toCall.length -1; i >= 0; i--) {
                args = [toCall[i].apply(this, args)];
              }
              return args[0];
            }
    },
    
    each: function(obj, itr, scope) {

      
      if (ARR_EACH && obj.forEach === ARR_EACH) { 
        
        obj.forEach(itr, scope);
        
      } else if (obj.length === obj.length + 0) { // Is number but not NaN
        
        for (var key = 0, l = obj.length; key < l; key++)
          if (key in obj && itr.call(scope, obj[key], key) === this.BREAK) 
            return;
            
      } else {

        for (var key in obj) 
          if (itr.call(scope, obj[key], key) === this.BREAK)
            return;
            
      }
            
    },
    
    defer: function(fnc) {
      setTimeout(fnc, 0);
    },
    
    toArray: function(obj) {
      if (obj.toArray) return obj.toArray();
      return ARR_SLICE.call(obj);
    },

    isUndefined: function(obj) {
      return obj === undefined;
    },
    
    isNull: function(obj) {
      return obj === null;
    },
    
    isNaN: function(obj) {
      return obj !== obj;
    },
    
    isArray: Array.isArray || function(obj) {
      return obj.constructor === Array;
    },
    
    isObject: function(obj) {
      return obj === Object(obj);
    },
    
    isNumber: function(obj) {
      return obj === obj+0;
    },
    
    isString: function(obj) {
      return obj === obj+'';
    },
    
    isBoolean: function(obj) {
      return obj === false || obj === true;
    },
    
    isFunction: function(obj) {
      return Object.prototype.toString.call(obj) === '[object Function]';
    }
  
  };
    
})();


dat.controllers.Controller = (function (common) {

  /**
   * @class An "abstract" class that represents a given property of an object.
   *
   * @param {Object} object The object to be manipulated
   * @param {string} property The name of the property to be manipulated
   *
   * @member dat.controllers
   */
  var Controller = function(object, property) {

    this.initialValue = object[property];

    /**
     * Those who extend this class will put their DOM elements in here.
     * @type {DOMElement}
     */
    this.domElement = document.createElement('div');

    /**
     * The object to manipulate
     * @type {Object}
     */
    this.object = object;

    /**
     * The name of the property to manipulate
     * @type {String}
     */
    this.property = property;

    /**
     * The function to be called on change.
     * @type {Function}
     * @ignore
     */
    this.__onChange = undefined;

    /**
     * The function to be called on finishing change.
     * @type {Function}
     * @ignore
     */
    this.__onFinishChange = undefined;

  };

  common.extend(

      Controller.prototype,

      /** @lends dat.controllers.Controller.prototype */
      {

        /**
         * Specify that a function fire every time someone changes the value with
         * this Controller.
         *
         * @param {Function} fnc This function will be called whenever the value
         * is modified via this Controller.
         * @returns {dat.controllers.Controller} this
         */
        onChange: function(fnc) {
          this.__onChange = fnc;
          return this;
        },

        /**
         * Specify that a function fire every time someone "finishes" changing
         * the value wih this Controller. Useful for values that change
         * incrementally like numbers or strings.
         *
         * @param {Function} fnc This function will be called whenever
         * someone "finishes" changing the value via this Controller.
         * @returns {dat.controllers.Controller} this
         */
        onFinishChange: function(fnc) {
          this.__onFinishChange = fnc;
          return this;
        },

        /**
         * Change the value of <code>object[property]</code>
         *
         * @param {Object} newValue The new value of <code>object[property]</code>
         */
        setValue: function(newValue) {
          this.object[this.property] = newValue;
          if (this.__onChange) {
            this.__onChange.call(this, newValue);
          }
          this.updateDisplay();
          return this;
        },

        /**
         * Gets the value of <code>object[property]</code>
         *
         * @returns {Object} The current value of <code>object[property]</code>
         */
        getValue: function() {
          return this.object[this.property];
        },

        /**
         * Refreshes the visual display of a Controller in order to keep sync
         * with the object's current value.
         * @returns {dat.controllers.Controller} this
         */
        updateDisplay: function() {
          return this;
        },

        /**
         * @returns {Boolean} true if the value has deviated from initialValue
         */
        isModified: function() {
          return this.initialValue !== this.getValue()
        }

      }

  );

  return Controller;


})(dat.utils.common);


dat.dom.dom = (function (common) {

  var EVENT_MAP = {
    'HTMLEvents': ['change'],
    'MouseEvents': ['click','mousemove','mousedown','mouseup', 'mouseover'],
    'KeyboardEvents': ['keydown']
  };

  var EVENT_MAP_INV = {};
  common.each(EVENT_MAP, function(v, k) {
    common.each(v, function(e) {
      EVENT_MAP_INV[e] = k;
    });
  });

  var CSS_VALUE_PIXELS = /(\d+(\.\d+)?)px/;

  function cssValueToPixels(val) {

    if (val === '0' || common.isUndefined(val)) return 0;

    var match = val.match(CSS_VALUE_PIXELS);

    if (!common.isNull(match)) {
      return parseFloat(match[1]);
    }

    // TODO ...ems? %?

    return 0;

  }

  /**
   * @namespace
   * @member dat.dom
   */
  var dom = {

    /**
     * 
     * @param elem
     * @param selectable
     */
    makeSelectable: function(elem, selectable) {

      if (elem === undefined || elem.style === undefined) return;

      elem.onselectstart = selectable ? function() {
        return false;
      } : function() {
      };

      elem.style.MozUserSelect = selectable ? 'auto' : 'none';
      elem.style.KhtmlUserSelect = selectable ? 'auto' : 'none';
      elem.unselectable = selectable ? 'on' : 'off';

    },

    /**
     *
     * @param elem
     * @param horizontal
     * @param vertical
     */
    makeFullscreen: function(elem, horizontal, vertical) {

      if (common.isUndefined(horizontal)) horizontal = true;
      if (common.isUndefined(vertical)) vertical = true;

      elem.style.position = 'absolute';

      if (horizontal) {
        elem.style.left = 0;
        elem.style.right = 0;
      }
      if (vertical) {
        elem.style.top = 0;
        elem.style.bottom = 0;
      }

    },

    /**
     *
     * @param elem
     * @param eventType
     * @param params
     */
    fakeEvent: function(elem, eventType, params, aux) {
      params = params || {};
      var className = EVENT_MAP_INV[eventType];
      if (!className) {
        throw new Error('Event type ' + eventType + ' not supported.');
      }
      var evt = document.createEvent(className);
      switch (className) {
        case 'MouseEvents':
          var clientX = params.x || params.clientX || 0;
          var clientY = params.y || params.clientY || 0;
          evt.initMouseEvent(eventType, params.bubbles || false,
              params.cancelable || true, window, params.clickCount || 1,
              0, //screen X
              0, //screen Y
              clientX, //client X
              clientY, //client Y
              false, false, false, false, 0, null);
          break;
        case 'KeyboardEvents':
          var init = evt.initKeyboardEvent || evt.initKeyEvent; // webkit || moz
          common.defaults(params, {
            cancelable: true,
            ctrlKey: false,
            altKey: false,
            shiftKey: false,
            metaKey: false,
            keyCode: undefined,
            charCode: undefined
          });
          init(eventType, params.bubbles || false,
              params.cancelable, window,
              params.ctrlKey, params.altKey,
              params.shiftKey, params.metaKey,
              params.keyCode, params.charCode);
          break;
        default:
          evt.initEvent(eventType, params.bubbles || false,
              params.cancelable || true);
          break;
      }
      common.defaults(evt, aux);
      elem.dispatchEvent(evt);
    },

    /**
     *
     * @param elem
     * @param event
     * @param func
     * @param bool
     */
    bind: function(elem, event, func, bool) {
      bool = bool || false;
      if (elem.addEventListener)
        elem.addEventListener(event, func, bool);
      else if (elem.attachEvent)
        elem.attachEvent('on' + event, func);
      return dom;
    },

    /**
     *
     * @param elem
     * @param event
     * @param func
     * @param bool
     */
    unbind: function(elem, event, func, bool) {
      bool = bool || false;
      if (elem.removeEventListener)
        elem.removeEventListener(event, func, bool);
      else if (elem.detachEvent)
        elem.detachEvent('on' + event, func);
      return dom;
    },

    /**
     *
     * @param elem
     * @param className
     */
    addClass: function(elem, className) {
      if (elem.className === undefined) {
        elem.className = className;
      } else if (elem.className !== className) {
        var classes = elem.className.split(/ +/);
        if (classes.indexOf(className) == -1) {
          classes.push(className);
          elem.className = classes.join(' ').replace(/^\s+/, '').replace(/\s+$/, '');
        }
      }
      return dom;
    },

    /**
     *
     * @param elem
     * @param className
     */
    removeClass: function(elem, className) {
      if (className) {
        if (elem.className === undefined) {
          // elem.className = className;
        } else if (elem.className === className) {
          elem.removeAttribute('class');
        } else {
          var classes = elem.className.split(/ +/);
          var index = classes.indexOf(className);
          if (index != -1) {
            classes.splice(index, 1);
            elem.className = classes.join(' ');
          }
        }
      } else {
        elem.className = undefined;
      }
      return dom;
    },

    hasClass: function(elem, className) {
      return new RegExp('(?:^|\\s+)' + className + '(?:\\s+|$)').test(elem.className) || false;
    },

    /**
     *
     * @param elem
     */
    getWidth: function(elem) {

      var style = getComputedStyle(elem);

      return cssValueToPixels(style['border-left-width']) +
          cssValueToPixels(style['border-right-width']) +
          cssValueToPixels(style['padding-left']) +
          cssValueToPixels(style['padding-right']) +
          cssValueToPixels(style['width']);
    },

    /**
     *
     * @param elem
     */
    getHeight: function(elem) {

      var style = getComputedStyle(elem);

      return cssValueToPixels(style['border-top-width']) +
          cssValueToPixels(style['border-bottom-width']) +
          cssValueToPixels(style['padding-top']) +
          cssValueToPixels(style['padding-bottom']) +
          cssValueToPixels(style['height']);
    },

    /**
     *
     * @param elem
     */
    getOffset: function(elem) {
      var offset = {left: 0, top:0};
      if (elem.offsetParent) {
        do {
          offset.left += elem.offsetLeft;
          offset.top += elem.offsetTop;
        } while (elem = elem.offsetParent);
      }
      return offset;
    },

    // http://stackoverflow.com/posts/2684561/revisions
    /**
     * 
     * @param elem
     */
    isActive: function(elem) {
      return elem === document.activeElement && ( elem.type || elem.href );
    }

  };

  return dom;

})(dat.utils.common);


dat.controllers.OptionController = (function (Controller, dom, common) {

  /**
   * @class Provides a select input to alter the property of an object, using a
   * list of accepted values.
   *
   * @extends dat.controllers.Controller
   *
   * @param {Object} object The object to be manipulated
   * @param {string} property The name of the property to be manipulated
   * @param {Object|string[]} options A map of labels to acceptable values, or
   * a list of acceptable string values.
   *
   * @member dat.controllers
   */
  var OptionController = function(object, property, options) {

    OptionController.superclass.call(this, object, property);

    var _this = this;

    /**
     * The drop down menu
     * @ignore
     */
    this.__select = document.createElement('select');

    if (common.isArray(options)) {
      var map = {};
      common.each(options, function(element) {
        map[element] = element;
      });
      options = map;
    }

    common.each(options, function(value, key) {

      var opt = document.createElement('option');
      opt.innerHTML = key;
      opt.setAttribute('value', value);
      _this.__select.appendChild(opt);

    });

    // Acknowledge original value
    this.updateDisplay();

    dom.bind(this.__select, 'change', function() {
      var desiredValue = this.options[this.selectedIndex].value;
      _this.setValue(desiredValue);
    });

    this.domElement.appendChild(this.__select);

  };

  OptionController.superclass = Controller;

  common.extend(

      OptionController.prototype,
      Controller.prototype,

      {

        setValue: function(v) {
          var toReturn = OptionController.superclass.prototype.setValue.call(this, v);
          if (this.__onFinishChange) {
            this.__onFinishChange.call(this, this.getValue());
          }
          return toReturn;
        },

        updateDisplay: function() {
          this.__select.value = this.getValue();
          return OptionController.superclass.prototype.updateDisplay.call(this);
        }

      }

  );

  return OptionController;

})(dat.controllers.Controller,
dat.dom.dom,
dat.utils.common);


dat.controllers.NumberController = (function (Controller, common) {

  /**
   * @class Represents a given property of an object that is a number.
   *
   * @extends dat.controllers.Controller
   *
   * @param {Object} object The object to be manipulated
   * @param {string} property The name of the property to be manipulated
   * @param {Object} [params] Optional parameters
   * @param {Number} [params.min] Minimum allowed value
   * @param {Number} [params.max] Maximum allowed value
   * @param {Number} [params.step] Increment by which to change value
   *
   * @member dat.controllers
   */
  var NumberController = function(object, property, params) {

    NumberController.superclass.call(this, object, property);

    params = params || {};

    this.__min = params.min;
    this.__max = params.max;
    this.__step = params.step;

    if (common.isUndefined(this.__step)) {

      if (this.initialValue == 0) {
        this.__impliedStep = 1; // What are we, psychics?
      } else {
        // Hey Doug, check this out.
        this.__impliedStep = Math.pow(10, Math.floor(Math.log(this.initialValue)/Math.LN10))/10;
      }

    } else {

      this.__impliedStep = this.__step;

    }

    this.__precision = numDecimals(this.__impliedStep);


  };

  NumberController.superclass = Controller;

  common.extend(

      NumberController.prototype,
      Controller.prototype,

      /** @lends dat.controllers.NumberController.prototype */
      {

        setValue: function(v) {

          if (this.__min !== undefined && v < this.__min) {
            v = this.__min;
          } else if (this.__max !== undefined && v > this.__max) {
            v = this.__max;
          }

          if (this.__step !== undefined && v % this.__step != 0) {
            v = Math.round(v / this.__step) * this.__step;
          }

          return NumberController.superclass.prototype.setValue.call(this, v);

        },

        /**
         * Specify a minimum value for <code>object[property]</code>.
         *
         * @param {Number} minValue The minimum value for
         * <code>object[property]</code>
         * @returns {dat.controllers.NumberController} this
         */
        min: function(v) {
          this.__min = v;
          return this;
        },

        /**
         * Specify a maximum value for <code>object[property]</code>.
         *
         * @param {Number} maxValue The maximum value for
         * <code>object[property]</code>
         * @returns {dat.controllers.NumberController} this
         */
        max: function(v) {
          this.__max = v;
          return this;
        },

        /**
         * Specify a step value that dat.controllers.NumberController
         * increments by.
         *
         * @param {Number} stepValue The step value for
         * dat.controllers.NumberController
         * @default if minimum and maximum specified increment is 1% of the
         * difference otherwise stepValue is 1
         * @returns {dat.controllers.NumberController} this
         */
        step: function(v) {
          this.__step = v;
          return this;
        }

      }

  );

  function numDecimals(x) {
    x = x.toString();
    if (x.indexOf('.') > -1) {
      return x.length - x.indexOf('.') - 1;
    } else {
      return 0;
    }
  }

  return NumberController;

})(dat.controllers.Controller,
dat.utils.common);


dat.controllers.NumberControllerBox = (function (NumberController, dom, common) {

  /**
   * @class Represents a given property of an object that is a number and
   * provides an input element with which to manipulate it.
   *
   * @extends dat.controllers.Controller
   * @extends dat.controllers.NumberController
   *
   * @param {Object} object The object to be manipulated
   * @param {string} property The name of the property to be manipulated
   * @param {Object} [params] Optional parameters
   * @param {Number} [params.min] Minimum allowed value
   * @param {Number} [params.max] Maximum allowed value
   * @param {Number} [params.step] Increment by which to change value
   *
   * @member dat.controllers
   */
  var NumberControllerBox = function(object, property, params) {

    this.__truncationSuspended = false;

    NumberControllerBox.superclass.call(this, object, property, params);

    var _this = this;

    /**
     * {Number} Previous mouse y position
     * @ignore
     */
    var prev_y;

    this.__input = document.createElement('input');
    this.__input.setAttribute('type', 'text');

    // Makes it so manually specified values are not truncated.

    dom.bind(this.__input, 'change', onChange);
    dom.bind(this.__input, 'blur', onBlur);
    dom.bind(this.__input, 'mousedown', onMouseDown);
    dom.bind(this.__input, 'keydown', function(e) {

      // When pressing entire, you can be as precise as you want.
      if (e.keyCode === 13) {
        _this.__truncationSuspended = true;
        this.blur();
        _this.__truncationSuspended = false;
      }

    });

    function onChange() {
      var attempted = parseFloat(_this.__input.value);
      if (!common.isNaN(attempted)) _this.setValue(attempted);
    }

    function onBlur() {
      onChange();
      if (_this.__onFinishChange) {
        _this.__onFinishChange.call(_this, _this.getValue());
      }
    }

    function onMouseDown(e) {
      dom.bind(window, 'mousemove', onMouseDrag);
      dom.bind(window, 'mouseup', onMouseUp);
      prev_y = e.clientY;
    }

    function onMouseDrag(e) {

      var diff = prev_y - e.clientY;
      _this.setValue(_this.getValue() + diff * _this.__impliedStep);

      prev_y = e.clientY;

    }

    function onMouseUp() {
      dom.unbind(window, 'mousemove', onMouseDrag);
      dom.unbind(window, 'mouseup', onMouseUp);
    }

    this.updateDisplay();

    this.domElement.appendChild(this.__input);

  };

  NumberControllerBox.superclass = NumberController;

  common.extend(

      NumberControllerBox.prototype,
      NumberController.prototype,

      {

        updateDisplay: function() {

          this.__input.value = this.__truncationSuspended ? this.getValue() : roundToDecimal(this.getValue(), this.__precision);
          return NumberControllerBox.superclass.prototype.updateDisplay.call(this);
        }

      }

  );

  function roundToDecimal(value, decimals) {
    var tenTo = Math.pow(10, decimals);
    return Math.round(value * tenTo) / tenTo;
  }

  return NumberControllerBox;

})(dat.controllers.NumberController,
dat.dom.dom,
dat.utils.common);


dat.controllers.NumberControllerSlider = (function (NumberController, dom, css, common, styleSheet) {

  /**
   * @class Represents a given property of an object that is a number, contains
   * a minimum and maximum, and provides a slider element with which to
   * manipulate it. It should be noted that the slider element is made up of
   * <code>&lt;div&gt;</code> tags, <strong>not</strong> the html5
   * <code>&lt;slider&gt;</code> element.
   *
   * @extends dat.controllers.Controller
   * @extends dat.controllers.NumberController
   * 
   * @param {Object} object The object to be manipulated
   * @param {string} property The name of the property to be manipulated
   * @param {Number} minValue Minimum allowed value
   * @param {Number} maxValue Maximum allowed value
   * @param {Number} stepValue Increment by which to change value
   *
   * @member dat.controllers
   */
  var NumberControllerSlider = function(object, property, min, max, step) {

    NumberControllerSlider.superclass.call(this, object, property, { min: min, max: max, step: step });

    var _this = this;

    this.__background = document.createElement('div');
    this.__foreground = document.createElement('div');
    


    dom.bind(this.__background, 'mousedown', onMouseDown);
    
    dom.addClass(this.__background, 'slider');
    dom.addClass(this.__foreground, 'slider-fg');

    function onMouseDown(e) {

      dom.bind(window, 'mousemove', onMouseDrag);
      dom.bind(window, 'mouseup', onMouseUp);

      onMouseDrag(e);
    }

    function onMouseDrag(e) {

      e.preventDefault();

      var offset = dom.getOffset(_this.__background);
      var width = dom.getWidth(_this.__background);
      
      _this.setValue(
        map(e.clientX, offset.left, offset.left + width, _this.__min, _this.__max)
      );

      return false;

    }

    function onMouseUp() {
      dom.unbind(window, 'mousemove', onMouseDrag);
      dom.unbind(window, 'mouseup', onMouseUp);
      if (_this.__onFinishChange) {
        _this.__onFinishChange.call(_this, _this.getValue());
      }
    }

    this.updateDisplay();

    this.__background.appendChild(this.__foreground);
    this.domElement.appendChild(this.__background);

  };

  NumberControllerSlider.superclass = NumberController;

  /**
   * Injects default stylesheet for slider elements.
   */
  NumberControllerSlider.useDefaultStyles = function() {
    css.inject(styleSheet);
  };

  common.extend(

      NumberControllerSlider.prototype,
      NumberController.prototype,

      {

        updateDisplay: function() {
          var pct = (this.getValue() - this.__min)/(this.__max - this.__min);
          this.__foreground.style.width = pct*100+'%';
          return NumberControllerSlider.superclass.prototype.updateDisplay.call(this);
        }

      }



  );

  function map(v, i1, i2, o1, o2) {
    return o1 + (o2 - o1) * ((v - i1) / (i2 - i1));
  }

  return NumberControllerSlider;
  
})(dat.controllers.NumberController,
dat.dom.dom,
dat.utils.css,
dat.utils.common,
".slider {\n  box-shadow: inset 0 2px 4px rgba(0,0,0,0.15);\n  height: 1em;\n  border-radius: 1em;\n  background-color: #eee;\n  padding: 0 0.5em;\n  overflow: hidden;\n}\n\n.slider-fg {\n  padding: 1px 0 2px 0;\n  background-color: #aaa;\n  height: 1em;\n  margin-left: -0.5em;\n  padding-right: 0.5em;\n  border-radius: 1em 0 0 1em;\n}\n\n.slider-fg:after {\n  display: inline-block;\n  border-radius: 1em;\n  background-color: #fff;\n  border:  1px solid #aaa;\n  content: '';\n  float: right;\n  margin-right: -1em;\n  margin-top: -1px;\n  height: 0.9em;\n  width: 0.9em;\n}");


dat.controllers.FunctionController = (function (Controller, dom, common) {

  /**
   * @class Provides a GUI interface to fire a specified method, a property of an object.
   *
   * @extends dat.controllers.Controller
   *
   * @param {Object} object The object to be manipulated
   * @param {string} property The name of the property to be manipulated
   *
   * @member dat.controllers
   */
  var FunctionController = function(object, property, text) {

    FunctionController.superclass.call(this, object, property);

    var _this = this;

    this.__button = document.createElement('div');
    this.__button.innerHTML = text === undefined ? 'Fire' : text;
    dom.bind(this.__button, 'click', function(e) {
      e.preventDefault();
      _this.fire();
      return false;
    });

    dom.addClass(this.__button, 'button');

    this.domElement.appendChild(this.__button);


  };

  FunctionController.superclass = Controller;

  common.extend(

      FunctionController.prototype,
      Controller.prototype,
      {
        
        fire: function() {
          if (this.__onChange) {
            this.__onChange.call(this);
          }
          if (this.__onFinishChange) {
            this.__onFinishChange.call(this, this.getValue());
          }
          this.getValue().call(this.object);
        }
      }

  );

  return FunctionController;

})(dat.controllers.Controller,
dat.dom.dom,
dat.utils.common);


dat.controllers.BooleanController = (function (Controller, dom, common) {

  /**
   * @class Provides a checkbox input to alter the boolean property of an object.
   * @extends dat.controllers.Controller
   *
   * @param {Object} object The object to be manipulated
   * @param {string} property The name of the property to be manipulated
   *
   * @member dat.controllers
   */
  var BooleanController = function(object, property) {

    BooleanController.superclass.call(this, object, property);

    var _this = this;
    this.__prev = this.getValue();

    this.__checkbox = document.createElement('input');
    this.__checkbox.setAttribute('type', 'checkbox');


    dom.bind(this.__checkbox, 'change', onChange, false);

    this.domElement.appendChild(this.__checkbox);

    // Match original value
    this.updateDisplay();

    function onChange() {
      _this.setValue(!_this.__prev);
    }

  };

  BooleanController.superclass = Controller;

  common.extend(

      BooleanController.prototype,
      Controller.prototype,

      {

        setValue: function(v) {
          var toReturn = BooleanController.superclass.prototype.setValue.call(this, v);
          if (this.__onFinishChange) {
            this.__onFinishChange.call(this, this.getValue());
          }
          this.__prev = this.getValue();
          return toReturn;
        },

        updateDisplay: function() {
          
          if (this.getValue() === true) {
            this.__checkbox.setAttribute('checked', 'checked');
            this.__checkbox.checked = true;    
          } else {
              this.__checkbox.checked = false;
          }

          return BooleanController.superclass.prototype.updateDisplay.call(this);

        }


      }

  );

  return BooleanController;

})(dat.controllers.Controller,
dat.dom.dom,
dat.utils.common);


dat.color.toString = (function (common) {

  return function(color) {

    if (color.a == 1 || common.isUndefined(color.a)) {

      var s = color.hex.toString(16);
      while (s.length < 6) {
        s = '0' + s;
      }

      return '#' + s;

    } else {

      return 'rgba(' + Math.round(color.r) + ',' + Math.round(color.g) + ',' + Math.round(color.b) + ',' + color.a + ')';

    }

  }

})(dat.utils.common);


dat.color.interpret = (function (toString, common) {

  var result, toReturn;

  var interpret = function() {

    toReturn = false;

    var original = arguments.length > 1 ? common.toArray(arguments) : arguments[0];

    common.each(INTERPRETATIONS, function(family) {

      if (family.litmus(original)) {

        common.each(family.conversions, function(conversion, conversionName) {

          result = conversion.read(original);

          if (toReturn === false && result !== false) {
            toReturn = result;
            result.conversionName = conversionName;
            result.conversion = conversion;
            return common.BREAK;

          }

        });

        return common.BREAK;

      }

    });

    return toReturn;

  };

  var INTERPRETATIONS = [

    // Strings
    {

      litmus: common.isString,

      conversions: {

        THREE_CHAR_HEX: {

          read: function(original) {

            var test = original.match(/^#([A-F0-9])([A-F0-9])([A-F0-9])$/i);
            if (test === null) return false;

            return {
              space: 'HEX',
              hex: parseInt(
                  '0x' +
                      test[1].toString() + test[1].toString() +
                      test[2].toString() + test[2].toString() +
                      test[3].toString() + test[3].toString())
            };

          },

          write: toString

        },

        SIX_CHAR_HEX: {

          read: function(original) {

            var test = original.match(/^#([A-F0-9]{6})$/i);
            if (test === null) return false;

            return {
              space: 'HEX',
              hex: parseInt('0x' + test[1].toString())
            };

          },

          write: toString

        },

        CSS_RGB: {

          read: function(original) {

            var test = original.match(/^rgb\(\s*(.+)\s*,\s*(.+)\s*,\s*(.+)\s*\)/);
            if (test === null) return false;

            return {
              space: 'RGB',
              r: parseFloat(test[1]),
              g: parseFloat(test[2]),
              b: parseFloat(test[3])
            };

          },

          write: toString

        },

        CSS_RGBA: {

          read: function(original) {

            var test = original.match(/^rgba\(\s*(.+)\s*,\s*(.+)\s*,\s*(.+)\s*\,\s*(.+)\s*\)/);
            if (test === null) return false;

            return {
              space: 'RGB',
              r: parseFloat(test[1]),
              g: parseFloat(test[2]),
              b: parseFloat(test[3]),
              a: parseFloat(test[4])
            };

          },

          write: toString

        }

      }

    },

    // Numbers
    {

      litmus: common.isNumber,

      conversions: {

        HEX: {
          read: function(original) {
            return {
              space: 'HEX',
              hex: original,
              conversionName: 'HEX'
            }
          },

          write: function(color) {
            return color.hex;
          }
        }

      }

    },

    // Arrays
    {

      litmus: common.isArray,

      conversions: {

        RGB_ARRAY: {
          read: function(original) {
            if (original.length != 3) return false;
            return {
              space: 'RGB',
              r: original[0],
              g: original[1],
              b: original[2]
            };
          },

          write: function(color) {
            return [color.r, color.g, color.b];
          }

        },

        RGBA_ARRAY: {
          read: function(original) {
            if (original.length != 4) return false;
            return {
              space: 'RGB',
              r: original[0],
              g: original[1],
              b: original[2],
              a: original[3]
            };
          },

          write: function(color) {
            return [color.r, color.g, color.b, color.a];
          }

        }

      }

    },

    // Objects
    {

      litmus: common.isObject,

      conversions: {

        RGBA_OBJ: {
          read: function(original) {
            if (common.isNumber(original.r) &&
                common.isNumber(original.g) &&
                common.isNumber(original.b) &&
                common.isNumber(original.a)) {
              return {
                space: 'RGB',
                r: original.r,
                g: original.g,
                b: original.b,
                a: original.a
              }
            }
            return false;
          },

          write: function(color) {
            return {
              r: color.r,
              g: color.g,
              b: color.b,
              a: color.a
            }
          }
        },

        RGB_OBJ: {
          read: function(original) {
            if (common.isNumber(original.r) &&
                common.isNumber(original.g) &&
                common.isNumber(original.b)) {
              return {
                space: 'RGB',
                r: original.r,
                g: original.g,
                b: original.b
              }
            }
            return false;
          },

          write: function(color) {
            return {
              r: color.r,
              g: color.g,
              b: color.b
            }
          }
        },

        HSVA_OBJ: {
          read: function(original) {
            if (common.isNumber(original.h) &&
                common.isNumber(original.s) &&
                common.isNumber(original.v) &&
                common.isNumber(original.a)) {
              return {
                space: 'HSV',
                h: original.h,
                s: original.s,
                v: original.v,
                a: original.a
              }
            }
            return false;
          },

          write: function(color) {
            return {
              h: color.h,
              s: color.s,
              v: color.v,
              a: color.a
            }
          }
        },

        HSV_OBJ: {
          read: function(original) {
            if (common.isNumber(original.h) &&
                common.isNumber(original.s) &&
                common.isNumber(original.v)) {
              return {
                space: 'HSV',
                h: original.h,
                s: original.s,
                v: original.v
              }
            }
            return false;
          },

          write: function(color) {
            return {
              h: color.h,
              s: color.s,
              v: color.v
            }
          }

        }

      }

    }


  ];

  return interpret;


})(dat.color.toString,
dat.utils.common);


dat.GUI = dat.gui.GUI = (function (css, saveDialogueContents, styleSheet, controllerFactory, Controller, BooleanController, FunctionController, NumberControllerBox, NumberControllerSlider, OptionController, ColorController, requestAnimationFrame, CenteredDiv, dom, common) {

  css.inject(styleSheet);

  /** Outer-most className for GUI's */
  var CSS_NAMESPACE = 'dg';

  var HIDE_KEY_CODE = 72;

  /** The only value shared between the JS and SCSS. Use caution. */
  var CLOSE_BUTTON_HEIGHT = 20;

  var DEFAULT_DEFAULT_PRESET_NAME = 'Default';

  var SUPPORTS_LOCAL_STORAGE = (function() {
    try {
      return 'localStorage' in window && window['localStorage'] !== null;
    } catch (e) {
      return false;
    }
  })();

  var SAVE_DIALOGUE;

  /** Have we yet to create an autoPlace GUI? */
  var auto_place_virgin = true;

  /** Fixed position div that auto place GUI's go inside */
  var auto_place_container;

  /** Are we hiding the GUI's ? */
  var hide = false;

  /** GUI's which should be hidden */
  var hideable_guis = [];

  /**
   * A lightweight controller library for JavaScript. It allows you to easily
   * manipulate variables and fire functions on the fly.
   * @class
   *
   * @member dat.gui
   *
   * @param {Object} [params]
   * @param {String} [params.name] The name of this GUI.
   * @param {Object} [params.load] JSON object representing the saved state of
   * this GUI.
   * @param {Boolean} [params.auto=true]
   * @param {dat.gui.GUI} [params.parent] The GUI I'm nested in.
   * @param {Boolean} [params.closed] If true, starts closed
   */
  var GUI = function(params) {

    var _this = this;

    /**
     * Outermost DOM Element
     * @type DOMElement
     */
    this.domElement = document.createElement('div');
    this.__ul = document.createElement('ul');
    this.domElement.appendChild(this.__ul);

    dom.addClass(this.domElement, CSS_NAMESPACE);

    /**
     * Nested GUI's by name
     * @ignore
     */
    this.__folders = {};

    this.__controllers = [];

    /**
     * List of objects I'm remembering for save, only used in top level GUI
     * @ignore
     */
    this.__rememberedObjects = [];

    /**
     * Maps the index of remembered objects to a map of controllers, only used
     * in top level GUI.
     *
     * @private
     * @ignore
     *
     * @example
     * [
     *  {
     *    propertyName: Controller,
     *    anotherPropertyName: Controller
     *  },
     *  {
     *    propertyName: Controller
     *  }
     * ]
     */
    this.__rememberedObjectIndecesToControllers = [];

    this.__listening = [];

    params = params || {};

    // Default parameters
    params = common.defaults(params, {
      autoPlace: true,
      width: GUI.DEFAULT_WIDTH
    });

    params = common.defaults(params, {
      resizable: params.autoPlace,
      hideable: params.autoPlace
    });


    if (!common.isUndefined(params.load)) {

      // Explicit preset
      if (params.preset) params.load.preset = params.preset;

    } else {

      params.load = { preset: DEFAULT_DEFAULT_PRESET_NAME };

    }

    if (common.isUndefined(params.parent) && params.hideable) {
      hideable_guis.push(this);
    }

    // Only root level GUI's are resizable.
    params.resizable = common.isUndefined(params.parent) && params.resizable;


    if (params.autoPlace && common.isUndefined(params.scrollable)) {
      params.scrollable = true;
    }
//    params.scrollable = common.isUndefined(params.parent) && params.scrollable === true;

    // Not part of params because I don't want people passing this in via
    // constructor. Should be a 'remembered' value.
    var use_local_storage =
        SUPPORTS_LOCAL_STORAGE &&
            localStorage.getItem(getLocalStorageHash(this, 'isLocal')) === 'true';

    Object.defineProperties(this,

        /** @lends dat.gui.GUI.prototype */
        {

          /**
           * The parent <code>GUI</code>
           * @type dat.gui.GUI
           */
          parent: {
            get: function() {
              return params.parent;
            }
          },

          scrollable: {
            get: function() {
              return params.scrollable;
            }
          },

          /**
           * Handles <code>GUI</code>'s element placement for you
           * @type Boolean
           */
          autoPlace: {
            get: function() {
              return params.autoPlace;
            }
          },

          /**
           * The identifier for a set of saved values
           * @type String
           */
          preset: {

            get: function() {
              if (_this.parent) {
                return _this.getRoot().preset;
              } else {
                return params.load.preset;
              }
            },

            set: function(v) {
              if (_this.parent) {
                _this.getRoot().preset = v;
              } else {
                params.load.preset = v;
              }
              setPresetSelectIndex(this);
              _this.revert();
            }

          },

          /**
           * The width of <code>GUI</code> element
           * @type Number
           */
          width: {
            get: function() {
              return params.width;
            },
            set: function(v) {
              params.width = v;
              setWidth(_this, v);
            }
          },

          /**
           * The name of <code>GUI</code>. Used for folders. i.e
           * a folder's name
           * @type String
           */
          name: {
            get: function() {
              return params.name;
            },
            set: function(v) {
              // TODO Check for collisions among sibling folders
              params.name = v;
              if (title_row_name) {
                title_row_name.innerHTML = params.name;
              }
            }
          },

          /**
           * Whether the <code>GUI</code> is collapsed or not
           * @type Boolean
           */
          closed: {
            get: function() {
              return params.closed;
            },
            set: function(v) {
              params.closed = v;
              if (params.closed) {
                dom.addClass(_this.__ul, GUI.CLASS_CLOSED);
              } else {
                dom.removeClass(_this.__ul, GUI.CLASS_CLOSED);
              }
              // For browsers that aren't going to respect the CSS transition,
              // Lets just check our height against the window height right off
              // the bat.
              this.onResize();

              if (_this.__closeButton) {
                _this.__closeButton.innerHTML = v ? GUI.TEXT_OPEN : GUI.TEXT_CLOSED;
              }
            }
          },

          /**
           * Contains all presets
           * @type Object
           */
          load: {
            get: function() {
              return params.load;
            }
          },

          /**
           * Determines whether or not to use <a href="https://developer.mozilla.org/en/DOM/Storage#localStorage">localStorage</a> as the means for
           * <code>remember</code>ing
           * @type Boolean
           */
          useLocalStorage: {

            get: function() {
              return use_local_storage;
            },
            set: function(bool) {
              if (SUPPORTS_LOCAL_STORAGE) {
                use_local_storage = bool;
                if (bool) {
                  dom.bind(window, 'unload', saveToLocalStorage);
                } else {
                  dom.unbind(window, 'unload', saveToLocalStorage);
                }
                localStorage.setItem(getLocalStorageHash(_this, 'isLocal'), bool);
              }
            }

          }

        });

    // Are we a root level GUI?
    if (common.isUndefined(params.parent)) {

      params.closed = false;

      dom.addClass(this.domElement, GUI.CLASS_MAIN);
      dom.makeSelectable(this.domElement, false);

      // Are we supposed to be loading locally?
      if (SUPPORTS_LOCAL_STORAGE) {

        if (use_local_storage) {

          _this.useLocalStorage = true;

          var saved_gui = localStorage.getItem(getLocalStorageHash(this, 'gui'));

          if (saved_gui) {
            params.load = JSON.parse(saved_gui);
          }

        }

      }

      this.__closeButton = document.createElement('div');
      this.__closeButton.innerHTML = GUI.TEXT_CLOSED;
      dom.addClass(this.__closeButton, GUI.CLASS_CLOSE_BUTTON);
      this.domElement.appendChild(this.__closeButton);

      dom.bind(this.__closeButton, 'click', function() {

        _this.closed = !_this.closed;


      });


      // Oh, you're a nested GUI!
    } else {

      if (params.closed === undefined) {
        params.closed = true;
      }

      var title_row_name = document.createTextNode(params.name);
      dom.addClass(title_row_name, 'controller-name');

      var title_row = addRow(_this, title_row_name);

      var on_click_title = function(e) {
        e.preventDefault();
        _this.closed = !_this.closed;
        return false;
      };

      dom.addClass(this.__ul, GUI.CLASS_CLOSED);

      dom.addClass(title_row, 'title');
      dom.bind(title_row, 'click', on_click_title);

      if (!params.closed) {
        this.closed = false;
      }

    }

    if (params.autoPlace) {

      if (common.isUndefined(params.parent)) {

        if (auto_place_virgin) {
          auto_place_container = document.createElement('div');
          dom.addClass(auto_place_container, CSS_NAMESPACE);
          dom.addClass(auto_place_container, GUI.CLASS_AUTO_PLACE_CONTAINER);
          document.body.appendChild(auto_place_container);
          auto_place_virgin = false;
        }

        // Put it in the dom for you.
        auto_place_container.appendChild(this.domElement);

        // Apply the auto styles
        dom.addClass(this.domElement, GUI.CLASS_AUTO_PLACE);

      }


      // Make it not elastic.
      if (!this.parent) setWidth(_this, params.width);

    }

    dom.bind(window, 'resize', function() { _this.onResize() });
    dom.bind(this.__ul, 'webkitTransitionEnd', function() { _this.onResize(); });
    dom.bind(this.__ul, 'transitionend', function() { _this.onResize() });
    dom.bind(this.__ul, 'oTransitionEnd', function() { _this.onResize() });
    this.onResize();


    if (params.resizable) {
      addResizeHandle(this);
    }

    function saveToLocalStorage() {
      localStorage.setItem(getLocalStorageHash(_this, 'gui'), JSON.stringify(_this.getSaveObject()));
    }

    var root = _this.getRoot();
    function resetWidth() {
        var root = _this.getRoot();
        root.width += 1;
        common.defer(function() {
          root.width -= 1;
        });
      }

      if (!params.parent) {
        resetWidth();
      }

  };

  GUI.toggleHide = function() {

    hide = !hide;
    common.each(hideable_guis, function(gui) {
      gui.domElement.style.zIndex = hide ? -999 : 999;
      gui.domElement.style.opacity = hide ? 0 : 1;
    });
  };

  GUI.CLASS_AUTO_PLACE = 'a';
  GUI.CLASS_AUTO_PLACE_CONTAINER = 'ac';
  GUI.CLASS_MAIN = 'main';
  GUI.CLASS_CONTROLLER_ROW = 'cr';
  GUI.CLASS_TOO_TALL = 'taller-than-window';
  GUI.CLASS_CLOSED = 'closed';
  GUI.CLASS_CLOSE_BUTTON = 'close-button';
  GUI.CLASS_DRAG = 'drag';

  GUI.DEFAULT_WIDTH = 245;
  GUI.TEXT_CLOSED = 'Close Controls';
  GUI.TEXT_OPEN = 'Open Controls';

  dom.bind(window, 'keydown', function(e) {

    if (document.activeElement.type !== 'text' &&
        (e.which === HIDE_KEY_CODE || e.keyCode == HIDE_KEY_CODE)) {
      GUI.toggleHide();
    }

  }, false);

  common.extend(

      GUI.prototype,

      /** @lends dat.gui.GUI */
      {

        /**
         * @param object
         * @param property
         * @returns {dat.controllers.Controller} The new controller that was added.
         * @instance
         */
        add: function(object, property) {

          return add(
              this,
              object,
              property,
              {
                factoryArgs: Array.prototype.slice.call(arguments, 2)
              }
          );

        },

        /**
         * @param object
         * @param property
         * @returns {dat.controllers.ColorController} The new controller that was added.
         * @instance
         */
        addColor: function(object, property) {

          return add(
              this,
              object,
              property,
              {
                color: true
              }
          );

        },

        /**
         * @param controller
         * @instance
         */
        remove: function(controller) {

          // TODO listening?
          this.__ul.removeChild(controller.__li);
          this.__controllers.slice(this.__controllers.indexOf(controller), 1);
          var _this = this;
          common.defer(function() {
            _this.onResize();
          });

        },

        destroy: function() {

          if (this.autoPlace) {
            auto_place_container.removeChild(this.domElement);
          }

        },

        /**
         * @param name
         * @returns {dat.gui.GUI} The new folder.
         * @throws {Error} if this GUI already has a folder by the specified
         * name
         * @instance
         */
        addFolder: function(name) {

          // We have to prevent collisions on names in order to have a key
          // by which to remember saved values
          if (this.__folders[name] !== undefined) {
            throw new Error('You already have a folder in this GUI by the' +
                ' name "' + name + '"');
          }

          var new_gui_params = { name: name, parent: this };

          // We need to pass down the autoPlace trait so that we can
          // attach event listeners to open/close folder actions to
          // ensure that a scrollbar appears if the window is too short.
          new_gui_params.autoPlace = this.autoPlace;

          // Do we have saved appearance data for this folder?

          if (this.load && // Anything loaded?
              this.load.folders && // Was my parent a dead-end?
              this.load.folders[name]) { // Did daddy remember me?

            // Start me closed if I was closed
            new_gui_params.closed = this.load.folders[name].closed;

            // Pass down the loaded data
            new_gui_params.load = this.load.folders[name];

          }

          var gui = new GUI(new_gui_params);
          this.__folders[name] = gui;

          var li = addRow(this, gui.domElement);
          dom.addClass(li, 'folder');
          return gui;

        },

        open: function() {
          this.closed = false;
        },

        close: function() {
          this.closed = true;
        },

        onResize: function() {

          var root = this.getRoot();

          if (root.scrollable) {

            var top = dom.getOffset(root.__ul).top;
            var h = 0;

            common.each(root.__ul.childNodes, function(node) {
              if (! (root.autoPlace && node === root.__save_row))
                h += dom.getHeight(node);
            });

            if (window.innerHeight - top - CLOSE_BUTTON_HEIGHT < h) {
              dom.addClass(root.domElement, GUI.CLASS_TOO_TALL);
              root.__ul.style.height = window.innerHeight - top - CLOSE_BUTTON_HEIGHT + 'px';
            } else {
              dom.removeClass(root.domElement, GUI.CLASS_TOO_TALL);
              root.__ul.style.height = 'auto';
            }

          }

          if (root.__resize_handle) {
            common.defer(function() {
              root.__resize_handle.style.height = root.__ul.offsetHeight + 'px';
            });
          }

          if (root.__closeButton) {
            root.__closeButton.style.width = root.width + 'px';
          }

        },

        /**
         * Mark objects for saving. The order of these objects cannot change as
         * the GUI grows. When remembering new objects, append them to the end
         * of the list.
         *
         * @param {Object...} objects
         * @throws {Error} if not called on a top level GUI.
         * @instance
         */
        remember: function() {

          if (common.isUndefined(SAVE_DIALOGUE)) {
            SAVE_DIALOGUE = new CenteredDiv();
            SAVE_DIALOGUE.domElement.innerHTML = saveDialogueContents;
          }

          if (this.parent) {
            throw new Error("You can only call remember on a top level GUI.");
          }

          var _this = this;

          common.each(Array.prototype.slice.call(arguments), function(object) {
            if (_this.__rememberedObjects.length == 0) {
              addSaveMenu(_this);
            }
            if (_this.__rememberedObjects.indexOf(object) == -1) {
              _this.__rememberedObjects.push(object);
            }
          });

          if (this.autoPlace) {
            // Set save row width
            setWidth(this, this.width);
          }

        },

        /**
         * @returns {dat.gui.GUI} the topmost parent GUI of a nested GUI.
         * @instance
         */
        getRoot: function() {
          var gui = this;
          while (gui.parent) {
            gui = gui.parent;
          }
          return gui;
        },

        /**
         * @returns {Object} a JSON object representing the current state of
         * this GUI as well as its remembered properties.
         * @instance
         */
        getSaveObject: function() {

          var toReturn = this.load;

          toReturn.closed = this.closed;

          // Am I remembering any values?
          if (this.__rememberedObjects.length > 0) {

            toReturn.preset = this.preset;

            if (!toReturn.remembered) {
              toReturn.remembered = {};
            }

            toReturn.remembered[this.preset] = getCurrentPreset(this);

          }

          toReturn.folders = {};
          common.each(this.__folders, function(element, key) {
            toReturn.folders[key] = element.getSaveObject();
          });

          return toReturn;

        },

        save: function() {

          if (!this.load.remembered) {
            this.load.remembered = {};
          }

          this.load.remembered[this.preset] = getCurrentPreset(this);
          markPresetModified(this, false);

        },

        saveAs: function(presetName) {

          if (!this.load.remembered) {

            // Retain default values upon first save
            this.load.remembered = {};
            this.load.remembered[DEFAULT_DEFAULT_PRESET_NAME] = getCurrentPreset(this, true);

          }

          this.load.remembered[presetName] = getCurrentPreset(this);
          this.preset = presetName;
          addPresetOption(this, presetName, true);

        },

        revert: function(gui) {

          common.each(this.__controllers, function(controller) {
            // Make revert work on Default.
            if (!this.getRoot().load.remembered) {
              controller.setValue(controller.initialValue);
            } else {
              recallSavedValue(gui || this.getRoot(), controller);
            }
          }, this);

          common.each(this.__folders, function(folder) {
            folder.revert(folder);
          });

          if (!gui) {
            markPresetModified(this.getRoot(), false);
          }


        },

        listen: function(controller) {

          var init = this.__listening.length == 0;
          this.__listening.push(controller);
          if (init) updateDisplays(this.__listening);

        }

      }

  );

  function add(gui, object, property, params) {

    if (object[property] === undefined) {
      throw new Error("Object " + object + " has no property \"" + property + "\"");
    }

    var controller;

    if (params.color) {

      controller = new ColorController(object, property);

    } else {

      var factoryArgs = [object,property].concat(params.factoryArgs);
      controller = controllerFactory.apply(gui, factoryArgs);

    }

    if (params.before instanceof Controller) {
      params.before = params.before.__li;
    }

    recallSavedValue(gui, controller);

    dom.addClass(controller.domElement, 'c');

    var name = document.createElement('span');
    dom.addClass(name, 'property-name');
    name.innerHTML = controller.property;

    var container = document.createElement('div');
    container.appendChild(name);
    container.appendChild(controller.domElement);

    var li = addRow(gui, container, params.before);

    dom.addClass(li, GUI.CLASS_CONTROLLER_ROW);
    dom.addClass(li, typeof controller.getValue());

    augmentController(gui, li, controller);

    gui.__controllers.push(controller);

    return controller;

  }

  /**
   * Add a row to the end of the GUI or before another row.
   *
   * @param gui
   * @param [dom] If specified, inserts the dom content in the new row
   * @param [liBefore] If specified, places the new row before another row
   */
  function addRow(gui, dom, liBefore) {
    var li = document.createElement('li');
    if (dom) li.appendChild(dom);
    if (liBefore) {
      gui.__ul.insertBefore(li, params.before);
    } else {
      gui.__ul.appendChild(li);
    }
    gui.onResize();
    return li;
  }

  function augmentController(gui, li, controller) {

    controller.__li = li;
    controller.__gui = gui;

    common.extend(controller, {

      options: function(options) {

        if (arguments.length > 1) {
          controller.remove();

          return add(
              gui,
              controller.object,
              controller.property,
              {
                before: controller.__li.nextElementSibling,
                factoryArgs: [common.toArray(arguments)]
              }
          );

        }

        if (common.isArray(options) || common.isObject(options)) {
          controller.remove();

          return add(
              gui,
              controller.object,
              controller.property,
              {
                before: controller.__li.nextElementSibling,
                factoryArgs: [options]
              }
          );

        }

      },

      name: function(v) {
        controller.__li.firstElementChild.firstElementChild.innerHTML = v;
        return controller;
      },

      listen: function() {
        controller.__gui.listen(controller);
        return controller;
      },

      remove: function() {
        controller.__gui.remove(controller);
        return controller;
      }

    });

    // All sliders should be accompanied by a box.
    if (controller instanceof NumberControllerSlider) {

      var box = new NumberControllerBox(controller.object, controller.property,
          { min: controller.__min, max: controller.__max, step: controller.__step });

      common.each(['updateDisplay', 'onChange', 'onFinishChange'], function(method) {
        var pc = controller[method];
        var pb = box[method];
        controller[method] = box[method] = function() {
          var args = Array.prototype.slice.call(arguments);
          pc.apply(controller, args);
          return pb.apply(box, args);
        }
      });

      dom.addClass(li, 'has-slider');
      controller.domElement.insertBefore(box.domElement, controller.domElement.firstElementChild);

    }
    else if (controller instanceof NumberControllerBox) {

      var r = function(returned) {

        // Have we defined both boundaries?
        if (common.isNumber(controller.__min) && common.isNumber(controller.__max)) {

          // Well, then lets just replace this with a slider.
          controller.remove();
          return add(
              gui,
              controller.object,
              controller.property,
              {
                before: controller.__li.nextElementSibling,
                factoryArgs: [controller.__min, controller.__max, controller.__step]
              });

        }

        return returned;

      };

      controller.min = common.compose(r, controller.min);
      controller.max = common.compose(r, controller.max);

    }
    else if (controller instanceof BooleanController) {

      dom.bind(li, 'click', function() {
        dom.fakeEvent(controller.__checkbox, 'click');
      });

      dom.bind(controller.__checkbox, 'click', function(e) {
        e.stopPropagation(); // Prevents double-toggle
      })

    }
    else if (controller instanceof FunctionController) {

      dom.bind(li, 'click', function() {
        dom.fakeEvent(controller.__button, 'click');
      });

      dom.bind(li, 'mouseover', function() {
        dom.addClass(controller.__button, 'hover');
      });

      dom.bind(li, 'mouseout', function() {
        dom.removeClass(controller.__button, 'hover');
      });

    }
    else if (controller instanceof ColorController) {

      dom.addClass(li, 'color');
      controller.updateDisplay = common.compose(function(r) {
        li.style.borderLeftColor = controller.__color.toString();
        return r;
      }, controller.updateDisplay);

      controller.updateDisplay();

    }

    controller.setValue = common.compose(function(r) {
      if (gui.getRoot().__preset_select && controller.isModified()) {
        markPresetModified(gui.getRoot(), true);
      }
      return r;
    }, controller.setValue);

  }

  function recallSavedValue(gui, controller) {

    // Find the topmost GUI, that's where remembered objects live.
    var root = gui.getRoot();

    // Does the object we're controlling match anything we've been told to
    // remember?
    var matched_index = root.__rememberedObjects.indexOf(controller.object);

    // Why yes, it does!
    if (matched_index != -1) {

      // Let me fetch a map of controllers for thcommon.isObject.
      var controller_map =
          root.__rememberedObjectIndecesToControllers[matched_index];

      // Ohp, I believe this is the first controller we've created for this
      // object. Lets make the map fresh.
      if (controller_map === undefined) {
        controller_map = {};
        root.__rememberedObjectIndecesToControllers[matched_index] =
            controller_map;
      }

      // Keep track of this controller
      controller_map[controller.property] = controller;

      // Okay, now have we saved any values for this controller?
      if (root.load && root.load.remembered) {

        var preset_map = root.load.remembered;

        // Which preset are we trying to load?
        var preset;

        if (preset_map[gui.preset]) {

          preset = preset_map[gui.preset];

        } else if (preset_map[DEFAULT_DEFAULT_PRESET_NAME]) {

          // Uhh, you can have the default instead?
          preset = preset_map[DEFAULT_DEFAULT_PRESET_NAME];

        } else {

          // Nada.

          return;

        }


        // Did the loaded object remember thcommon.isObject?
        if (preset[matched_index] &&

          // Did we remember this particular property?
            preset[matched_index][controller.property] !== undefined) {

          // We did remember something for this guy ...
          var value = preset[matched_index][controller.property];

          // And that's what it is.
          controller.initialValue = value;
          controller.setValue(value);

        }

      }

    }

  }

  function getLocalStorageHash(gui, key) {
    // TODO how does this deal with multiple GUI's?
    return document.location.href + '.' + key;

  }

  function addSaveMenu(gui) {

    var div = gui.__save_row = document.createElement('li');

    dom.addClass(gui.domElement, 'has-save');

    gui.__ul.insertBefore(div, gui.__ul.firstChild);

    dom.addClass(div, 'save-row');

    var gears = document.createElement('span');
    gears.innerHTML = '&nbsp;';
    dom.addClass(gears, 'button gears');

    // TODO replace with FunctionController
    var button = document.createElement('span');
    button.innerHTML = 'Save';
    dom.addClass(button, 'button');
    dom.addClass(button, 'save');

    var button2 = document.createElement('span');
    button2.innerHTML = 'New';
    dom.addClass(button2, 'button');
    dom.addClass(button2, 'save-as');

    var button3 = document.createElement('span');
    button3.innerHTML = 'Revert';
    dom.addClass(button3, 'button');
    dom.addClass(button3, 'revert');

    var select = gui.__preset_select = document.createElement('select');

    if (gui.load && gui.load.remembered) {

      common.each(gui.load.remembered, function(value, key) {
        addPresetOption(gui, key, key == gui.preset);
      });

    } else {
      addPresetOption(gui, DEFAULT_DEFAULT_PRESET_NAME, false);
    }

    dom.bind(select, 'change', function() {


      for (var index = 0; index < gui.__preset_select.length; index++) {
        gui.__preset_select[index].innerHTML = gui.__preset_select[index].value;
      }

      gui.preset = this.value;

    });

    div.appendChild(select);
    div.appendChild(gears);
    div.appendChild(button);
    div.appendChild(button2);
    div.appendChild(button3);

    if (SUPPORTS_LOCAL_STORAGE) {

      var saveLocally = document.getElementById('dg-save-locally');
      var explain = document.getElementById('dg-local-explain');

      saveLocally.style.display = 'block';

      var localStorageCheckBox = document.getElementById('dg-local-storage');

      if (localStorage.getItem(getLocalStorageHash(gui, 'isLocal')) === 'true') {
        localStorageCheckBox.setAttribute('checked', 'checked');
      }

      function showHideExplain() {
        explain.style.display = gui.useLocalStorage ? 'block' : 'none';
      }

      showHideExplain();

      // TODO: Use a boolean controller, fool!
      dom.bind(localStorageCheckBox, 'change', function() {
        gui.useLocalStorage = !gui.useLocalStorage;
        showHideExplain();
      });

    }

    var newConstructorTextArea = document.getElementById('dg-new-constructor');

    dom.bind(newConstructorTextArea, 'keydown', function(e) {
      if (e.metaKey && (e.which === 67 || e.keyCode == 67)) {
        SAVE_DIALOGUE.hide();
      }
    });

    dom.bind(gears, 'click', function() {
      newConstructorTextArea.innerHTML = JSON.stringify(gui.getSaveObject(), undefined, 2);
      SAVE_DIALOGUE.show();
      newConstructorTextArea.focus();
      newConstructorTextArea.select();
    });

    dom.bind(button, 'click', function() {
      gui.save();
    });

    dom.bind(button2, 'click', function() {
      var presetName = prompt('Enter a new preset name.');
      if (presetName) gui.saveAs(presetName);
    });

    dom.bind(button3, 'click', function() {
      gui.revert();
    });

//    div.appendChild(button2);

  }

  function addResizeHandle(gui) {

    gui.__resize_handle = document.createElement('div');

    common.extend(gui.__resize_handle.style, {

      width: '6px',
      marginLeft: '-3px',
      height: '200px',
      cursor: 'ew-resize',
      position: 'absolute'
//      border: '1px solid blue'

    });

    var pmouseX;

    dom.bind(gui.__resize_handle, 'mousedown', dragStart);
    dom.bind(gui.__closeButton, 'mousedown', dragStart);

    gui.domElement.insertBefore(gui.__resize_handle, gui.domElement.firstElementChild);

    function dragStart(e) {

      e.preventDefault();

      pmouseX = e.clientX;

      dom.addClass(gui.__closeButton, GUI.CLASS_DRAG);
      dom.bind(window, 'mousemove', drag);
      dom.bind(window, 'mouseup', dragStop);

      return false;

    }

    function drag(e) {

      e.preventDefault();

      gui.width += pmouseX - e.clientX;
      gui.onResize();
      pmouseX = e.clientX;

      return false;

    }

    function dragStop() {

      dom.removeClass(gui.__closeButton, GUI.CLASS_DRAG);
      dom.unbind(window, 'mousemove', drag);
      dom.unbind(window, 'mouseup', dragStop);

    }

  }

  function setWidth(gui, w) {
    gui.domElement.style.width = w + 'px';
    // Auto placed save-rows are position fixed, so we have to
    // set the width manually if we want it to bleed to the edge
    if (gui.__save_row && gui.autoPlace) {
      gui.__save_row.style.width = w + 'px';
    }if (gui.__closeButton) {
      gui.__closeButton.style.width = w + 'px';
    }
  }

  function getCurrentPreset(gui, useInitialValues) {

    var toReturn = {};

    // For each object I'm remembering
    common.each(gui.__rememberedObjects, function(val, index) {

      var saved_values = {};

      // The controllers I've made for thcommon.isObject by property
      var controller_map =
          gui.__rememberedObjectIndecesToControllers[index];

      // Remember each value for each property
      common.each(controller_map, function(controller, property) {
        saved_values[property] = useInitialValues ? controller.initialValue : controller.getValue();
      });

      // Save the values for thcommon.isObject
      toReturn[index] = saved_values;

    });

    return toReturn;

  }

  function addPresetOption(gui, name, setSelected) {
    var opt = document.createElement('option');
    opt.innerHTML = name;
    opt.value = name;
    gui.__preset_select.appendChild(opt);
    if (setSelected) {
      gui.__preset_select.selectedIndex = gui.__preset_select.length - 1;
    }
  }

  function setPresetSelectIndex(gui) {
    for (var index = 0; index < gui.__preset_select.length; index++) {
      if (gui.__preset_select[index].value == gui.preset) {
        gui.__preset_select.selectedIndex = index;
      }
    }
  }

  function markPresetModified(gui, modified) {
    var opt = gui.__preset_select[gui.__preset_select.selectedIndex];
//    console.log('mark', modified, opt);
    if (modified) {
      opt.innerHTML = opt.value + "*";
    } else {
      opt.innerHTML = opt.value;
    }
  }

  function updateDisplays(controllerArray) {


    if (controllerArray.length != 0) {

      requestAnimationFrame(function() {
        updateDisplays(controllerArray);
      });

    }

    common.each(controllerArray, function(c) {
      c.updateDisplay();
    });

  }

  return GUI;

})(dat.utils.css,
"<div id=\"dg-save\" class=\"dg dialogue\">\n\n  Here's the new load parameter for your <code>GUI</code>'s constructor:\n\n  <textarea id=\"dg-new-constructor\"></textarea>\n\n  <div id=\"dg-save-locally\">\n\n    <input id=\"dg-local-storage\" type=\"checkbox\"/> Automatically save\n    values to <code>localStorage</code> on exit.\n\n    <div id=\"dg-local-explain\">The values saved to <code>localStorage</code> will\n      override those passed to <code>dat.GUI</code>'s constructor. This makes it\n      easier to work incrementally, but <code>localStorage</code> is fragile,\n      and your friends may not see the same values you do.\n      \n    </div>\n    \n  </div>\n\n</div>",
".dg ul{list-style:none;margin:0;padding:0;width:100%;clear:both}.dg.ac{position:fixed;top:0;left:0;right:0;height:0;z-index:0}.dg:not(.ac) .main{overflow:hidden}.dg.main{-webkit-transition:opacity 0.1s linear;-o-transition:opacity 0.1s linear;-moz-transition:opacity 0.1s linear;transition:opacity 0.1s linear}.dg.main.taller-than-window{overflow-y:auto}.dg.main.taller-than-window .close-button{opacity:1;margin-top:-1px;border-top:1px solid #2c2c2c}.dg.main ul.closed .close-button{opacity:1 !important}.dg.main:hover .close-button,.dg.main .close-button.drag{opacity:1}.dg.main .close-button{-webkit-transition:opacity 0.1s linear;-o-transition:opacity 0.1s linear;-moz-transition:opacity 0.1s linear;transition:opacity 0.1s linear;border:0;position:absolute;line-height:19px;height:20px;cursor:pointer;text-align:center;background-color:#000}.dg.main .close-button:hover{background-color:#111}.dg.a{float:right;margin-right:15px;overflow-x:hidden}.dg.a.has-save ul{margin-top:27px}.dg.a.has-save ul.closed{margin-top:0}.dg.a .save-row{position:fixed;top:0;z-index:1002}.dg li{-webkit-transition:height 0.1s ease-out;-o-transition:height 0.1s ease-out;-moz-transition:height 0.1s ease-out;transition:height 0.1s ease-out}.dg li:not(.folder){cursor:auto;height:27px;line-height:27px;overflow:hidden;padding:0 4px 0 5px}.dg li.folder{padding:0;border-left:4px solid rgba(0,0,0,0)}.dg li.title{cursor:pointer;margin-left:-4px}.dg .closed li:not(.title),.dg .closed ul li,.dg .closed ul li > *{height:0;overflow:hidden;border:0}.dg .cr{clear:both;padding-left:3px;height:27px}.dg .property-name{cursor:default;float:left;clear:left;width:40%;overflow:hidden;text-overflow:ellipsis}.dg .c{float:left;width:60%}.dg .c input[type=text]{border:0;margin-top:4px;padding:3px;width:100%;float:right}.dg .has-slider input[type=text]{width:30%;margin-left:0}.dg .slider{float:left;width:66%;margin-left:-5px;margin-right:0;height:19px;margin-top:4px}.dg .slider-fg{height:100%}.dg .c input[type=checkbox]{margin-top:9px}.dg .c select{margin-top:5px}.dg .cr.function,.dg .cr.function .property-name,.dg .cr.function *,.dg .cr.boolean,.dg .cr.boolean *{cursor:pointer}.dg .selector{display:none;position:absolute;margin-left:-9px;margin-top:23px;z-index:10}.dg .c:hover .selector,.dg .selector.drag{display:block}.dg li.save-row{padding:0}.dg li.save-row .button{display:inline-block;padding:0px 6px}.dg.dialogue{background-color:#222;width:460px;padding:15px;font-size:13px;line-height:15px}#dg-new-constructor{padding:10px;color:#222;font-family:Monaco, monospace;font-size:10px;border:0;resize:none;box-shadow:inset 1px 1px 1px #888;word-wrap:break-word;margin:12px 0;display:block;width:440px;overflow-y:scroll;height:100px;position:relative}#dg-local-explain{display:none;font-size:11px;line-height:17px;border-radius:3px;background-color:#333;padding:8px;margin-top:10px}#dg-local-explain code{font-size:10px}#dat-gui-save-locally{display:none}.dg{color:#eee;font:11px 'Lucida Grande', sans-serif;text-shadow:0 -1px 0 #111}.dg.main::-webkit-scrollbar{width:5px;background:#1a1a1a}.dg.main::-webkit-scrollbar-corner{height:0;display:none}.dg.main::-webkit-scrollbar-thumb{border-radius:5px;background:#676767}.dg li:not(.folder){background:#1a1a1a;border-bottom:1px solid #2c2c2c}.dg li.save-row{line-height:25px;background:#dad5cb;border:0}.dg li.save-row select{margin-left:5px;width:108px}.dg li.save-row .button{margin-left:5px;margin-top:1px;border-radius:2px;font-size:9px;line-height:7px;padding:4px 4px 5px 4px;background:#c5bdad;color:#fff;text-shadow:0 1px 0 #b0a58f;box-shadow:0 -1px 0 #b0a58f;cursor:pointer}.dg li.save-row .button.gears{background:#c5bdad url(data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAsAAAANCAYAAAB/9ZQ7AAAAGXRFWHRTb2Z0d2FyZQBBZG9iZSBJbWFnZVJlYWR5ccllPAAAAQJJREFUeNpiYKAU/P//PwGIC/ApCABiBSAW+I8AClAcgKxQ4T9hoMAEUrxx2QSGN6+egDX+/vWT4e7N82AMYoPAx/evwWoYoSYbACX2s7KxCxzcsezDh3evFoDEBYTEEqycggWAzA9AuUSQQgeYPa9fPv6/YWm/Acx5IPb7ty/fw+QZblw67vDs8R0YHyQhgObx+yAJkBqmG5dPPDh1aPOGR/eugW0G4vlIoTIfyFcA+QekhhHJhPdQxbiAIguMBTQZrPD7108M6roWYDFQiIAAv6Aow/1bFwXgis+f2LUAynwoIaNcz8XNx3Dl7MEJUDGQpx9gtQ8YCueB+D26OECAAQDadt7e46D42QAAAABJRU5ErkJggg==) 2px 1px no-repeat;height:7px;width:8px}.dg li.save-row .button:hover{background-color:#bab19e;box-shadow:0 -1px 0 #b0a58f}.dg li.folder{border-bottom:0}.dg li.title{padding-left:16px;background:#000 url(data:image/gif;base64,R0lGODlhBQAFAJEAAP////Pz8////////yH5BAEAAAIALAAAAAAFAAUAAAIIlI+hKgFxoCgAOw==) 6px 10px no-repeat;cursor:pointer;border-bottom:1px solid rgba(255,255,255,0.2)}.dg .closed li.title{background-image:url(data:image/gif;base64,R0lGODlhBQAFAJEAAP////Pz8////////yH5BAEAAAIALAAAAAAFAAUAAAIIlGIWqMCbWAEAOw==)}.dg .cr.boolean{border-left:3px solid #806787}.dg .cr.function{border-left:3px solid #e61d5f}.dg .cr.number{border-left:3px solid #2fa1d6}.dg .cr.number input[type=text]{color:#2fa1d6}.dg .cr.string{border-left:3px solid #1ed36f}.dg .cr.string input[type=text]{color:#1ed36f}.dg .cr.function:hover,.dg .cr.boolean:hover{background:#111}.dg .c input[type=text]{background:#303030;outline:none}.dg .c input[type=text]:hover{background:#3c3c3c}.dg .c input[type=text]:focus{background:#494949;color:#fff}.dg .c .slider{background:#303030;cursor:ew-resize}.dg .c .slider-fg{background:#2fa1d6}.dg .c .slider:hover{background:#3c3c3c}.dg .c .slider:hover .slider-fg{background:#44abda}\n",
dat.controllers.factory = (function (OptionController, NumberControllerBox, NumberControllerSlider, StringController, FunctionController, BooleanController, common) {

      return function(object, property) {

        var initialValue = object[property];

        // Providing options?
        if (common.isArray(arguments[2]) || common.isObject(arguments[2])) {
          return new OptionController(object, property, arguments[2]);
        }

        // Providing a map?

        if (common.isNumber(initialValue)) {

          if (common.isNumber(arguments[2]) && common.isNumber(arguments[3])) {

            // Has min and max.
            return new NumberControllerSlider(object, property, arguments[2], arguments[3]);

          } else {

            return new NumberControllerBox(object, property, { min: arguments[2], max: arguments[3] });

          }

        }

        if (common.isString(initialValue)) {
          return new StringController(object, property);
        }

        if (common.isFunction(initialValue)) {
          return new FunctionController(object, property, '');
        }

        if (common.isBoolean(initialValue)) {
          return new BooleanController(object, property);
        }

      }

    })(dat.controllers.OptionController,
dat.controllers.NumberControllerBox,
dat.controllers.NumberControllerSlider,
dat.controllers.StringController = (function (Controller, dom, common) {

  /**
   * @class Provides a text input to alter the string property of an object.
   *
   * @extends dat.controllers.Controller
   *
   * @param {Object} object The object to be manipulated
   * @param {string} property The name of the property to be manipulated
   *
   * @member dat.controllers
   */
  var StringController = function(object, property) {

    StringController.superclass.call(this, object, property);

    var _this = this;

    this.__input = document.createElement('input');
    this.__input.setAttribute('type', 'text');

    dom.bind(this.__input, 'keyup', onChange);
    dom.bind(this.__input, 'change', onChange);
    dom.bind(this.__input, 'blur', onBlur);
    dom.bind(this.__input, 'keydown', function(e) {
      if (e.keyCode === 13) {
        this.blur();
      }
    });
    

    function onChange() {
      _this.setValue(_this.__input.value);
    }

    function onBlur() {
      if (_this.__onFinishChange) {
        _this.__onFinishChange.call(_this, _this.getValue());
      }
    }

    this.updateDisplay();

    this.domElement.appendChild(this.__input);

  };

  StringController.superclass = Controller;

  common.extend(

      StringController.prototype,
      Controller.prototype,

      {

        updateDisplay: function() {
          // Stops the caret from moving on account of:
          // keyup -> setValue -> updateDisplay
          if (!dom.isActive(this.__input)) {
            this.__input.value = this.getValue();
          }
          return StringController.superclass.prototype.updateDisplay.call(this);
        }

      }

  );

  return StringController;

})(dat.controllers.Controller,
dat.dom.dom,
dat.utils.common),
dat.controllers.FunctionController,
dat.controllers.BooleanController,
dat.utils.common),
dat.controllers.Controller,
dat.controllers.BooleanController,
dat.controllers.FunctionController,
dat.controllers.NumberControllerBox,
dat.controllers.NumberControllerSlider,
dat.controllers.OptionController,
dat.controllers.ColorController = (function (Controller, dom, Color, interpret, common) {

  var ColorController = function(object, property) {

    ColorController.superclass.call(this, object, property);

    this.__color = new Color(this.getValue());
    this.__temp = new Color(0);

    var _this = this;

    this.domElement = document.createElement('div');

    dom.makeSelectable(this.domElement, false);

    this.__selector = document.createElement('div');
    this.__selector.className = 'selector';

    this.__saturation_field = document.createElement('div');
    this.__saturation_field.className = 'saturation-field';

    this.__field_knob = document.createElement('div');
    this.__field_knob.className = 'field-knob';
    this.__field_knob_border = '2px solid ';

    this.__hue_knob = document.createElement('div');
    this.__hue_knob.className = 'hue-knob';

    this.__hue_field = document.createElement('div');
    this.__hue_field.className = 'hue-field';

    this.__input = document.createElement('input');
    this.__input.type = 'text';
    this.__input_textShadow = '0 1px 1px ';

    dom.bind(this.__input, 'keydown', function(e) {
      if (e.keyCode === 13) { // on enter
        onBlur.call(this);
      }
    });

    dom.bind(this.__input, 'blur', onBlur);

    dom.bind(this.__selector, 'mousedown', function(e) {

      dom
        .addClass(this, 'drag')
        .bind(window, 'mouseup', function(e) {
          dom.removeClass(_this.__selector, 'drag');
        });

    });

    var value_field = document.createElement('div');

    common.extend(this.__selector.style, {
      width: '122px',
      height: '102px',
      padding: '3px',
      backgroundColor: '#222',
      boxShadow: '0px 1px 3px rgba(0,0,0,0.3)'
    });

    common.extend(this.__field_knob.style, {
      position: 'absolute',
      width: '12px',
      height: '12px',
      border: this.__field_knob_border + (this.__color.v < .5 ? '#fff' : '#000'),
      boxShadow: '0px 1px 3px rgba(0,0,0,0.5)',
      borderRadius: '12px',
      zIndex: 1
    });
    
    common.extend(this.__hue_knob.style, {
      position: 'absolute',
      width: '15px',
      height: '2px',
      borderRight: '4px solid #fff',
      zIndex: 1
    });

    common.extend(this.__saturation_field.style, {
      width: '100px',
      height: '100px',
      border: '1px solid #555',
      marginRight: '3px',
      display: 'inline-block',
      cursor: 'pointer'
    });

    common.extend(value_field.style, {
      width: '100%',
      height: '100%',
      background: 'none'
    });
    
    linearGradient(value_field, 'top', 'rgba(0,0,0,0)', '#000');

    common.extend(this.__hue_field.style, {
      width: '15px',
      height: '100px',
      display: 'inline-block',
      border: '1px solid #555',
      cursor: 'ns-resize'
    });

    hueGradient(this.__hue_field);

    common.extend(this.__input.style, {
      outline: 'none',
//      width: '120px',
      textAlign: 'center',
//      padding: '4px',
//      marginBottom: '6px',
      color: '#fff',
      border: 0,
      fontWeight: 'bold',
      textShadow: this.__input_textShadow + 'rgba(0,0,0,0.7)'
    });

    dom.bind(this.__saturation_field, 'mousedown', fieldDown);
    dom.bind(this.__field_knob, 'mousedown', fieldDown);

    dom.bind(this.__hue_field, 'mousedown', function(e) {
      setH(e);
      dom.bind(window, 'mousemove', setH);
      dom.bind(window, 'mouseup', unbindH);
    });

    function fieldDown(e) {
      setSV(e);
      // document.body.style.cursor = 'none';
      dom.bind(window, 'mousemove', setSV);
      dom.bind(window, 'mouseup', unbindSV);
    }

    function unbindSV() {
      dom.unbind(window, 'mousemove', setSV);
      dom.unbind(window, 'mouseup', unbindSV);
      // document.body.style.cursor = 'default';
    }

    function onBlur() {
      var i = interpret(this.value);
      if (i !== false) {
        _this.__color.__state = i;
        _this.setValue(_this.__color.toOriginal());
      } else {
        this.value = _this.__color.toString();
      }
    }

    function unbindH() {
      dom.unbind(window, 'mousemove', setH);
      dom.unbind(window, 'mouseup', unbindH);
    }

    this.__saturation_field.appendChild(value_field);
    this.__selector.appendChild(this.__field_knob);
    this.__selector.appendChild(this.__saturation_field);
    this.__selector.appendChild(this.__hue_field);
    this.__hue_field.appendChild(this.__hue_knob);

    this.domElement.appendChild(this.__input);
    this.domElement.appendChild(this.__selector);

    this.updateDisplay();

    function setSV(e) {

      e.preventDefault();

      var w = dom.getWidth(_this.__saturation_field);
      var o = dom.getOffset(_this.__saturation_field);
      var s = (e.clientX - o.left + document.body.scrollLeft) / w;
      var v = 1 - (e.clientY - o.top + document.body.scrollTop) / w;

      if (v > 1) v = 1;
      else if (v < 0) v = 0;

      if (s > 1) s = 1;
      else if (s < 0) s = 0;

      _this.__color.v = v;
      _this.__color.s = s;

      _this.setValue(_this.__color.toOriginal());


      return false;

    }

    function setH(e) {

      e.preventDefault();

      var s = dom.getHeight(_this.__hue_field);
      var o = dom.getOffset(_this.__hue_field);
      var h = 1 - (e.clientY - o.top + document.body.scrollTop) / s;

      if (h > 1) h = 1;
      else if (h < 0) h = 0;

      _this.__color.h = h * 360;

      _this.setValue(_this.__color.toOriginal());

      return false;

    }

  };

  ColorController.superclass = Controller;

  common.extend(

      ColorController.prototype,
      Controller.prototype,

      {

        updateDisplay: function() {

          var i = interpret(this.getValue());

          if (i !== false) {

            var mismatch = false;

            // Check for mismatch on the interpreted value.

            common.each(Color.COMPONENTS, function(component) {
              if (!common.isUndefined(i[component]) &&
                  !common.isUndefined(this.__color.__state[component]) &&
                  i[component] !== this.__color.__state[component]) {
                mismatch = true;
                return {}; // break
              }
            }, this);

            // If nothing diverges, we keep our previous values
            // for statefulness, otherwise we recalculate fresh
            if (mismatch) {
              common.extend(this.__color.__state, i);
            }

          }

          common.extend(this.__temp.__state, this.__color.__state);

          this.__temp.a = 1;

          var flip = (this.__color.v < .5 || this.__color.s > .5) ? 255 : 0;
          var _flip = 255 - flip;

          common.extend(this.__field_knob.style, {
            marginLeft: 100 * this.__color.s - 7 + 'px',
            marginTop: 100 * (1 - this.__color.v) - 7 + 'px',
            backgroundColor: this.__temp.toString(),
            border: this.__field_knob_border + 'rgb(' + flip + ',' + flip + ',' + flip +')'
          });

          this.__hue_knob.style.marginTop = (1 - this.__color.h / 360) * 100 + 'px'

          this.__temp.s = 1;
          this.__temp.v = 1;

          linearGradient(this.__saturation_field, 'left', '#fff', this.__temp.toString());

          common.extend(this.__input.style, {
            backgroundColor: this.__input.value = this.__color.toString(),
            color: 'rgb(' + flip + ',' + flip + ',' + flip +')',
            textShadow: this.__input_textShadow + 'rgba(' + _flip + ',' + _flip + ',' + _flip +',.7)'
          });

        }

      }

  );
  
  var vendors = ['-moz-','-o-','-webkit-','-ms-',''];
  
  function linearGradient(elem, x, a, b) {
    elem.style.background = '';
    common.each(vendors, function(vendor) {
      elem.style.cssText += 'background: ' + vendor + 'linear-gradient('+x+', '+a+' 0%, ' + b + ' 100%); ';
    });
  }
  
  function hueGradient(elem) {
    elem.style.background = '';
    elem.style.cssText += 'background: -moz-linear-gradient(top,  #ff0000 0%, #ff00ff 17%, #0000ff 34%, #00ffff 50%, #00ff00 67%, #ffff00 84%, #ff0000 100%);'
    elem.style.cssText += 'background: -webkit-linear-gradient(top,  #ff0000 0%,#ff00ff 17%,#0000ff 34%,#00ffff 50%,#00ff00 67%,#ffff00 84%,#ff0000 100%);'
    elem.style.cssText += 'background: -o-linear-gradient(top,  #ff0000 0%,#ff00ff 17%,#0000ff 34%,#00ffff 50%,#00ff00 67%,#ffff00 84%,#ff0000 100%);'
    elem.style.cssText += 'background: -ms-linear-gradient(top,  #ff0000 0%,#ff00ff 17%,#0000ff 34%,#00ffff 50%,#00ff00 67%,#ffff00 84%,#ff0000 100%);'
    elem.style.cssText += 'background: linear-gradient(top,  #ff0000 0%,#ff00ff 17%,#0000ff 34%,#00ffff 50%,#00ff00 67%,#ffff00 84%,#ff0000 100%);'
  }


  return ColorController;

})(dat.controllers.Controller,
dat.dom.dom,
dat.color.Color = (function (interpret, math, toString, common) {

  var Color = function() {

    this.__state = interpret.apply(this, arguments);

    if (this.__state === false) {
      throw 'Failed to interpret color arguments';
    }

    this.__state.a = this.__state.a || 1;


  };

  Color.COMPONENTS = ['r','g','b','h','s','v','hex','a'];

  common.extend(Color.prototype, {

    toString: function() {
      return toString(this);
    },

    toOriginal: function() {
      return this.__state.conversion.write(this);
    }

  });

  defineRGBComponent(Color.prototype, 'r', 2);
  defineRGBComponent(Color.prototype, 'g', 1);
  defineRGBComponent(Color.prototype, 'b', 0);

  defineHSVComponent(Color.prototype, 'h');
  defineHSVComponent(Color.prototype, 's');
  defineHSVComponent(Color.prototype, 'v');

  Object.defineProperty(Color.prototype, 'a', {

    get: function() {
      return this.__state.a;
    },

    set: function(v) {
      this.__state.a = v;
    }

  });

  Object.defineProperty(Color.prototype, 'hex', {

    get: function() {

      if (!this.__state.space !== 'HEX') {
        this.__state.hex = math.rgb_to_hex(this.r, this.g, this.b);
      }

      return this.__state.hex;

    },

    set: function(v) {

      this.__state.space = 'HEX';
      this.__state.hex = v;

    }

  });

  function defineRGBComponent(target, component, componentHexIndex) {

    Object.defineProperty(target, component, {

      get: function() {

        if (this.__state.space === 'RGB') {
          return this.__state[component];
        }

        recalculateRGB(this, component, componentHexIndex);

        return this.__state[component];

      },

      set: function(v) {

        if (this.__state.space !== 'RGB') {
          recalculateRGB(this, component, componentHexIndex);
          this.__state.space = 'RGB';
        }

        this.__state[component] = v;

      }

    });

  }

  function defineHSVComponent(target, component) {

    Object.defineProperty(target, component, {

      get: function() {

        if (this.__state.space === 'HSV')
          return this.__state[component];

        recalculateHSV(this);

        return this.__state[component];

      },

      set: function(v) {

        if (this.__state.space !== 'HSV') {
          recalculateHSV(this);
          this.__state.space = 'HSV';
        }

        this.__state[component] = v;

      }

    });

  }

  function recalculateRGB(color, component, componentHexIndex) {

    if (color.__state.space === 'HEX') {

      color.__state[component] = math.component_from_hex(color.__state.hex, componentHexIndex);

    } else if (color.__state.space === 'HSV') {

      common.extend(color.__state, math.hsv_to_rgb(color.__state.h, color.__state.s, color.__state.v));

    } else {

      throw 'Corrupted color state';

    }

  }

  function recalculateHSV(color) {

    var result = math.rgb_to_hsv(color.r, color.g, color.b);

    common.extend(color.__state,
        {
          s: result.s,
          v: result.v
        }
    );

    if (!common.isNaN(result.h)) {
      color.__state.h = result.h;
    } else if (common.isUndefined(color.__state.h)) {
      color.__state.h = 0;
    }

  }

  return Color;

})(dat.color.interpret,
dat.color.math = (function () {

  var tmpComponent;

  return {

    hsv_to_rgb: function(h, s, v) {

      var hi = Math.floor(h / 60) % 6;

      var f = h / 60 - Math.floor(h / 60);
      var p = v * (1.0 - s);
      var q = v * (1.0 - (f * s));
      var t = v * (1.0 - ((1.0 - f) * s));
      var c = [
        [v, t, p],
        [q, v, p],
        [p, v, t],
        [p, q, v],
        [t, p, v],
        [v, p, q]
      ][hi];

      return {
        r: c[0] * 255,
        g: c[1] * 255,
        b: c[2] * 255
      };

    },

    rgb_to_hsv: function(r, g, b) {

      var min = Math.min(r, g, b),
          max = Math.max(r, g, b),
          delta = max - min,
          h, s;

      if (max != 0) {
        s = delta / max;
      } else {
        return {
          h: NaN,
          s: 0,
          v: 0
        };
      }

      if (r == max) {
        h = (g - b) / delta;
      } else if (g == max) {
        h = 2 + (b - r) / delta;
      } else {
        h = 4 + (r - g) / delta;
      }
      h /= 6;
      if (h < 0) {
        h += 1;
      }

      return {
        h: h * 360,
        s: s,
        v: max / 255
      };
    },

    rgb_to_hex: function(r, g, b) {
      var hex = this.hex_with_component(0, 2, r);
      hex = this.hex_with_component(hex, 1, g);
      hex = this.hex_with_component(hex, 0, b);
      return hex;
    },

    component_from_hex: function(hex, componentIndex) {
      return (hex >> (componentIndex * 8)) & 0xFF;
    },

    hex_with_component: function(hex, componentIndex, value) {
      return value << (tmpComponent = componentIndex * 8) | (hex & ~ (0xFF << tmpComponent));
    }

  }

})(),
dat.color.toString,
dat.utils.common),
dat.color.interpret,
dat.utils.common),
dat.utils.requestAnimationFrame = (function () {

  /**
   * requirejs version of Paul Irish's RequestAnimationFrame
   * http://paulirish.com/2011/requestanimationframe-for-smart-animating/
   */

  return window.webkitRequestAnimationFrame ||
      window.mozRequestAnimationFrame ||
      window.oRequestAnimationFrame ||
      window.msRequestAnimationFrame ||
      function(callback, element) {

        window.setTimeout(callback, 1000 / 60);

      };
})(),
dat.dom.CenteredDiv = (function (dom, common) {


  var CenteredDiv = function() {

    this.backgroundElement = document.createElement('div');
    common.extend(this.backgroundElement.style, {
      backgroundColor: 'rgba(0,0,0,0.8)',
      top: 0,
      left: 0,
      display: 'none',
      zIndex: '1000',
      opacity: 0,
      WebkitTransition: 'opacity 0.2s linear'
    });

    dom.makeFullscreen(this.backgroundElement);
    this.backgroundElement.style.position = 'fixed';

    this.domElement = document.createElement('div');
    common.extend(this.domElement.style, {
      position: 'fixed',
      display: 'none',
      zIndex: '1001',
      opacity: 0,
      WebkitTransition: '-webkit-transform 0.2s ease-out, opacity 0.2s linear'
    });


    document.body.appendChild(this.backgroundElement);
    document.body.appendChild(this.domElement);

    var _this = this;
    dom.bind(this.backgroundElement, 'click', function() {
      _this.hide();
    });


  };

  CenteredDiv.prototype.show = function() {

    var _this = this;
    


    this.backgroundElement.style.display = 'block';

    this.domElement.style.display = 'block';
    this.domElement.style.opacity = 0;
//    this.domElement.style.top = '52%';
    this.domElement.style.webkitTransform = 'scale(1.1)';

    this.layout();

    common.defer(function() {
      _this.backgroundElement.style.opacity = 1;
      _this.domElement.style.opacity = 1;
      _this.domElement.style.webkitTransform = 'scale(1)';
    });

  };

  CenteredDiv.prototype.hide = function() {

    var _this = this;

    var hide = function() {

      _this.domElement.style.display = 'none';
      _this.backgroundElement.style.display = 'none';

      dom.unbind(_this.domElement, 'webkitTransitionEnd', hide);
      dom.unbind(_this.domElement, 'transitionend', hide);
      dom.unbind(_this.domElement, 'oTransitionEnd', hide);

    };

    dom.bind(this.domElement, 'webkitTransitionEnd', hide);
    dom.bind(this.domElement, 'transitionend', hide);
    dom.bind(this.domElement, 'oTransitionEnd', hide);

    this.backgroundElement.style.opacity = 0;
//    this.domElement.style.top = '48%';
    this.domElement.style.opacity = 0;
    this.domElement.style.webkitTransform = 'scale(1.1)';

  };

  CenteredDiv.prototype.layout = function() {
    this.domElement.style.left = window.innerWidth/2 - dom.getWidth(this.domElement) / 2 + 'px';
    this.domElement.style.top = window.innerHeight/2 - dom.getHeight(this.domElement) / 2 + 'px';
  };
  
  function lockScroll(e) {
    console.log(e);
  }

  return CenteredDiv;

})(dat.dom.dom,
dat.utils.common),
dat.dom.dom,
dat.utils.common);

/***/ }),
/* 29 */
/***/ (function(module, exports, __webpack_require__) {

var isFunction = __webpack_require__(12)

module.exports = forEach

var toString = Object.prototype.toString
var hasOwnProperty = Object.prototype.hasOwnProperty

function forEach(list, iterator, context) {
    if (!isFunction(iterator)) {
        throw new TypeError('iterator must be a function')
    }

    if (arguments.length < 3) {
        context = this
    }
    
    if (toString.call(list) === '[object Array]')
        forEachArray(list, iterator, context)
    else if (typeof list === 'string')
        forEachString(list, iterator, context)
    else
        forEachObject(list, iterator, context)
}

function forEachArray(array, iterator, context) {
    for (var i = 0, len = array.length; i < len; i++) {
        if (hasOwnProperty.call(array, i)) {
            iterator.call(context, array[i], i, array)
        }
    }
}

function forEachString(string, iterator, context) {
    for (var i = 0, len = string.length; i < len; i++) {
        // no such thing as a sparse string.
        iterator.call(context, string.charAt(i), i, string)
    }
}

function forEachObject(object, iterator, context) {
    for (var k in object) {
        if (hasOwnProperty.call(object, k)) {
            iterator.call(context, object[k], k, object)
        }
    }
}


/***/ }),
/* 30 */
/***/ (function(module, exports, __webpack_require__) {

/* WEBPACK VAR INJECTION */(function(global) {var win;

if (typeof window !== "undefined") {
    win = window;
} else if (typeof global !== "undefined") {
    win = global;
} else if (typeof self !== "undefined"){
    win = self;
} else {
    win = {};
}

module.exports = win;

/* WEBPACK VAR INJECTION */}.call(exports, __webpack_require__(3)))

/***/ }),
/* 31 */
/***/ (function(module, exports) {

exports.read = function (buffer, offset, isLE, mLen, nBytes) {
  var e, m
  var eLen = nBytes * 8 - mLen - 1
  var eMax = (1 << eLen) - 1
  var eBias = eMax >> 1
  var nBits = -7
  var i = isLE ? (nBytes - 1) : 0
  var d = isLE ? -1 : 1
  var s = buffer[offset + i]

  i += d

  e = s & ((1 << (-nBits)) - 1)
  s >>= (-nBits)
  nBits += eLen
  for (; nBits > 0; e = e * 256 + buffer[offset + i], i += d, nBits -= 8) {}

  m = e & ((1 << (-nBits)) - 1)
  e >>= (-nBits)
  nBits += mLen
  for (; nBits > 0; m = m * 256 + buffer[offset + i], i += d, nBits -= 8) {}

  if (e === 0) {
    e = 1 - eBias
  } else if (e === eMax) {
    return m ? NaN : ((s ? -1 : 1) * Infinity)
  } else {
    m = m + Math.pow(2, mLen)
    e = e - eBias
  }
  return (s ? -1 : 1) * m * Math.pow(2, e - mLen)
}

exports.write = function (buffer, value, offset, isLE, mLen, nBytes) {
  var e, m, c
  var eLen = nBytes * 8 - mLen - 1
  var eMax = (1 << eLen) - 1
  var eBias = eMax >> 1
  var rt = (mLen === 23 ? Math.pow(2, -24) - Math.pow(2, -77) : 0)
  var i = isLE ? 0 : (nBytes - 1)
  var d = isLE ? 1 : -1
  var s = value < 0 || (value === 0 && 1 / value < 0) ? 1 : 0

  value = Math.abs(value)

  if (isNaN(value) || value === Infinity) {
    m = isNaN(value) ? 1 : 0
    e = eMax
  } else {
    e = Math.floor(Math.log(value) / Math.LN2)
    if (value * (c = Math.pow(2, -e)) < 1) {
      e--
      c *= 2
    }
    if (e + eBias >= 1) {
      value += rt / c
    } else {
      value += rt * Math.pow(2, 1 - eBias)
    }
    if (value * c >= 2) {
      e++
      c /= 2
    }

    if (e + eBias >= eMax) {
      m = 0
      e = eMax
    } else if (e + eBias >= 1) {
      m = (value * c - 1) * Math.pow(2, mLen)
      e = e + eBias
    } else {
      m = value * Math.pow(2, eBias - 1) * Math.pow(2, mLen)
      e = 0
    }
  }

  for (; mLen >= 8; buffer[offset + i] = m & 0xff, i += d, m /= 256, mLen -= 8) {}

  e = (e << mLen) | m
  eLen += mLen
  for (; eLen > 0; buffer[offset + i] = e & 0xff, i += d, e /= 256, eLen -= 8) {}

  buffer[offset + i - d] |= s * 128
}


/***/ }),
/* 32 */
/***/ (function(module, exports, __webpack_require__) {

var trim = __webpack_require__(44)
  , forEach = __webpack_require__(29)
  , isArray = function(arg) {
      return Object.prototype.toString.call(arg) === '[object Array]';
    }

module.exports = function (headers) {
  if (!headers)
    return {}

  var result = {}

  forEach(
      trim(headers).split('\n')
    , function (row) {
        var index = row.indexOf(':')
          , key = trim(row.slice(0, index)).toLowerCase()
          , value = trim(row.slice(index + 1))

        if (typeof(result[key]) === 'undefined') {
          result[key] = value
        } else if (isArray(result[key])) {
          result[key].push(value)
        } else {
          result[key] = [ result[key], value ]
        }
      }
  )

  return result
}

/***/ }),
/* 33 */
/***/ (function(module, exports, __webpack_require__) {

module.exports = __webpack_require__(0);


/***/ }),
/* 34 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
// a passthrough stream.
// basically just the most minimal sort of Transform stream.
// Every written chunk gets output as-is.



module.exports = PassThrough;

var Transform = __webpack_require__(15);

/*<replacement>*/
var util = __webpack_require__(4);
util.inherits = __webpack_require__(2);
/*</replacement>*/

util.inherits(PassThrough, Transform);

function PassThrough(options) {
  if (!(this instanceof PassThrough)) return new PassThrough(options);

  Transform.call(this, options);
}

PassThrough.prototype._transform = function (chunk, encoding, cb) {
  cb(null, chunk);
};

/***/ }),
/* 35 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var Buffer = __webpack_require__(1).Buffer;
/*<replacement>*/
var bufferShim = __webpack_require__(6);
/*</replacement>*/

module.exports = BufferList;

function BufferList() {
  this.head = null;
  this.tail = null;
  this.length = 0;
}

BufferList.prototype.push = function (v) {
  var entry = { data: v, next: null };
  if (this.length > 0) this.tail.next = entry;else this.head = entry;
  this.tail = entry;
  ++this.length;
};

BufferList.prototype.unshift = function (v) {
  var entry = { data: v, next: this.head };
  if (this.length === 0) this.tail = entry;
  this.head = entry;
  ++this.length;
};

BufferList.prototype.shift = function () {
  if (this.length === 0) return;
  var ret = this.head.data;
  if (this.length === 1) this.head = this.tail = null;else this.head = this.head.next;
  --this.length;
  return ret;
};

BufferList.prototype.clear = function () {
  this.head = this.tail = null;
  this.length = 0;
};

BufferList.prototype.join = function (s) {
  if (this.length === 0) return '';
  var p = this.head;
  var ret = '' + p.data;
  while (p = p.next) {
    ret += s + p.data;
  }return ret;
};

BufferList.prototype.concat = function (n) {
  if (this.length === 0) return bufferShim.alloc(0);
  if (this.length === 1) return this.head.data;
  var ret = bufferShim.allocUnsafe(n >>> 0);
  var p = this.head;
  var i = 0;
  while (p) {
    p.data.copy(ret, i);
    i += p.data.length;
    p = p.next;
  }
  return ret;
};

/***/ }),
/* 36 */
/***/ (function(module, exports, __webpack_require__) {

module.exports = __webpack_require__(11).PassThrough


/***/ }),
/* 37 */
/***/ (function(module, exports, __webpack_require__) {

module.exports = __webpack_require__(11).Transform


/***/ }),
/* 38 */
/***/ (function(module, exports, __webpack_require__) {

module.exports = __webpack_require__(10);


/***/ }),
/* 39 */
/***/ (function(module, exports, __webpack_require__) {

/* WEBPACK VAR INJECTION */(function(global, process) {(function (global, undefined) {
    "use strict";

    if (global.setImmediate) {
        return;
    }

    var nextHandle = 1; // Spec says greater than zero
    var tasksByHandle = {};
    var currentlyRunningATask = false;
    var doc = global.document;
    var registerImmediate;

    function setImmediate(callback) {
      // Callback can either be a function or a string
      if (typeof callback !== "function") {
        callback = new Function("" + callback);
      }
      // Copy function arguments
      var args = new Array(arguments.length - 1);
      for (var i = 0; i < args.length; i++) {
          args[i] = arguments[i + 1];
      }
      // Store and register the task
      var task = { callback: callback, args: args };
      tasksByHandle[nextHandle] = task;
      registerImmediate(nextHandle);
      return nextHandle++;
    }

    function clearImmediate(handle) {
        delete tasksByHandle[handle];
    }

    function run(task) {
        var callback = task.callback;
        var args = task.args;
        switch (args.length) {
        case 0:
            callback();
            break;
        case 1:
            callback(args[0]);
            break;
        case 2:
            callback(args[0], args[1]);
            break;
        case 3:
            callback(args[0], args[1], args[2]);
            break;
        default:
            callback.apply(undefined, args);
            break;
        }
    }

    function runIfPresent(handle) {
        // From the spec: "Wait until any invocations of this algorithm started before this one have completed."
        // So if we're currently running a task, we'll need to delay this invocation.
        if (currentlyRunningATask) {
            // Delay by doing a setTimeout. setImmediate was tried instead, but in Firefox 7 it generated a
            // "too much recursion" error.
            setTimeout(runIfPresent, 0, handle);
        } else {
            var task = tasksByHandle[handle];
            if (task) {
                currentlyRunningATask = true;
                try {
                    run(task);
                } finally {
                    clearImmediate(handle);
                    currentlyRunningATask = false;
                }
            }
        }
    }

    function installNextTickImplementation() {
        registerImmediate = function(handle) {
            process.nextTick(function () { runIfPresent(handle); });
        };
    }

    function canUsePostMessage() {
        // The test against `importScripts` prevents this implementation from being installed inside a web worker,
        // where `global.postMessage` means something completely different and can't be used for this purpose.
        if (global.postMessage && !global.importScripts) {
            var postMessageIsAsynchronous = true;
            var oldOnMessage = global.onmessage;
            global.onmessage = function() {
                postMessageIsAsynchronous = false;
            };
            global.postMessage("", "*");
            global.onmessage = oldOnMessage;
            return postMessageIsAsynchronous;
        }
    }

    function installPostMessageImplementation() {
        // Installs an event handler on `global` for the `message` event: see
        // * https://developer.mozilla.org/en/DOM/window.postMessage
        // * http://www.whatwg.org/specs/web-apps/current-work/multipage/comms.html#crossDocumentMessages

        var messagePrefix = "setImmediate$" + Math.random() + "$";
        var onGlobalMessage = function(event) {
            if (event.source === global &&
                typeof event.data === "string" &&
                event.data.indexOf(messagePrefix) === 0) {
                runIfPresent(+event.data.slice(messagePrefix.length));
            }
        };

        if (global.addEventListener) {
            global.addEventListener("message", onGlobalMessage, false);
        } else {
            global.attachEvent("onmessage", onGlobalMessage);
        }

        registerImmediate = function(handle) {
            global.postMessage(messagePrefix + handle, "*");
        };
    }

    function installMessageChannelImplementation() {
        var channel = new MessageChannel();
        channel.port1.onmessage = function(event) {
            var handle = event.data;
            runIfPresent(handle);
        };

        registerImmediate = function(handle) {
            channel.port2.postMessage(handle);
        };
    }

    function installReadyStateChangeImplementation() {
        var html = doc.documentElement;
        registerImmediate = function(handle) {
            // Create a <script> element; its readystatechange event will be fired asynchronously once it is inserted
            // into the document. Do so, thus queuing up the task. Remember to clean up once it's been called.
            var script = doc.createElement("script");
            script.onreadystatechange = function () {
                runIfPresent(handle);
                script.onreadystatechange = null;
                html.removeChild(script);
                script = null;
            };
            html.appendChild(script);
        };
    }

    function installSetTimeoutImplementation() {
        registerImmediate = function(handle) {
            setTimeout(runIfPresent, 0, handle);
        };
    }

    // If supported, we should attach to the prototype of global, since that is where setTimeout et al. live.
    var attachTo = Object.getPrototypeOf && Object.getPrototypeOf(global);
    attachTo = attachTo && attachTo.setTimeout ? attachTo : global;

    // Don't get fooled by e.g. browserify environments.
    if ({}.toString.call(global.process) === "[object process]") {
        // For Node.js before 0.9
        installNextTickImplementation();

    } else if (canUsePostMessage()) {
        // For non-IE10 modern browsers
        installPostMessageImplementation();

    } else if (global.MessageChannel) {
        // For web workers, where supported
        installMessageChannelImplementation();

    } else if (doc && "onreadystatechange" in doc.createElement("script")) {
        // For IE 6–8
        installReadyStateChangeImplementation();

    } else {
        // For older browsers
        installSetTimeoutImplementation();
    }

    attachTo.setImmediate = setImmediate;
    attachTo.clearImmediate = clearImmediate;
}(typeof self === "undefined" ? typeof global === "undefined" ? this : global : self));

/* WEBPACK VAR INJECTION */}.call(exports, __webpack_require__(3), __webpack_require__(5)))

/***/ }),
/* 40 */
/***/ (function(module, exports, __webpack_require__) {

//filter will reemit the data if cb(err,pass) pass is truthy

// reduce is more tricky
// maybe we want to group the reductions or emit progress updates occasionally
// the most basic reduce just emits one 'data' event after it has recieved 'end'


var through = __webpack_require__(42)
var Decoder = __webpack_require__(8).StringDecoder

module.exports = split

//TODO pass in a function to map across the lines.

function split (matcher, mapper, options) {
  var decoder = new Decoder()
  var soFar = ''
  var maxLength = options && options.maxLength;
  if('function' === typeof matcher)
    mapper = matcher, matcher = null
  if (!matcher)
    matcher = /\r?\n/

  function emit(stream, piece) {
    if(mapper) {
      try {
        piece = mapper(piece)
      }
      catch (err) {
        return stream.emit('error', err)
      }
      if('undefined' !== typeof piece)
        stream.queue(piece)
    }
    else
      stream.queue(piece)
  }

  function next (stream, buffer) {
    var pieces = ((soFar != null ? soFar : '') + buffer).split(matcher)
    soFar = pieces.pop()

    if (maxLength && soFar.length > maxLength)
      stream.emit('error', new Error('maximum buffer reached'))

    for (var i = 0; i < pieces.length; i++) {
      var piece = pieces[i]
      emit(stream, piece)
    }
  }

  return through(function (b) {
    next(this, decoder.write(b))
  },
  function () {
    if(decoder.end)
      next(this, decoder.end())
    if(soFar != null)
      emit(this, soFar)
    this.queue(null)
  })
}



/***/ }),
/* 41 */
/***/ (function(module, exports) {

// stats.js - http://github.com/mrdoob/stats.js
var Stats=function(){var l=Date.now(),m=l,g=0,n=Infinity,o=0,h=0,p=Infinity,q=0,r=0,s=0,f=document.createElement("div");f.id="stats";f.addEventListener("mousedown",function(b){b.preventDefault();t(++s%2)},!1);f.style.cssText="width:80px;opacity:0.9;cursor:pointer";var a=document.createElement("div");a.id="fps";a.style.cssText="padding:0 0 3px 3px;text-align:left;background-color:#002";f.appendChild(a);var i=document.createElement("div");i.id="fpsText";i.style.cssText="color:#0ff;font-family:Helvetica,Arial,sans-serif;font-size:9px;font-weight:bold;line-height:15px";
i.innerHTML="FPS";a.appendChild(i);var c=document.createElement("div");c.id="fpsGraph";c.style.cssText="position:relative;width:74px;height:30px;background-color:#0ff";for(a.appendChild(c);74>c.children.length;){var j=document.createElement("span");j.style.cssText="width:1px;height:30px;float:left;background-color:#113";c.appendChild(j)}var d=document.createElement("div");d.id="ms";d.style.cssText="padding:0 0 3px 3px;text-align:left;background-color:#020;display:none";f.appendChild(d);var k=document.createElement("div");
k.id="msText";k.style.cssText="color:#0f0;font-family:Helvetica,Arial,sans-serif;font-size:9px;font-weight:bold;line-height:15px";k.innerHTML="MS";d.appendChild(k);var e=document.createElement("div");e.id="msGraph";e.style.cssText="position:relative;width:74px;height:30px;background-color:#0f0";for(d.appendChild(e);74>e.children.length;)j=document.createElement("span"),j.style.cssText="width:1px;height:30px;float:left;background-color:#131",e.appendChild(j);var t=function(b){s=b;switch(s){case 0:a.style.display=
"block";d.style.display="none";break;case 1:a.style.display="none",d.style.display="block"}};return{REVISION:12,domElement:f,setMode:t,begin:function(){l=Date.now()},end:function(){var b=Date.now();g=b-l;n=Math.min(n,g);o=Math.max(o,g);k.textContent=g+" MS ("+n+"-"+o+")";var a=Math.min(30,30-30*(g/200));e.appendChild(e.firstChild).style.height=a+"px";r++;b>m+1E3&&(h=Math.round(1E3*r/(b-m)),p=Math.min(p,h),q=Math.max(q,h),i.textContent=h+" FPS ("+p+"-"+q+")",a=Math.min(30,30-30*(h/100)),c.appendChild(c.firstChild).style.height=
a+"px",m=b,r=0);return b},update:function(){l=this.end()}}};"object"===typeof module&&(module.exports=Stats);


/***/ }),
/* 42 */
/***/ (function(module, exports, __webpack_require__) {

/* WEBPACK VAR INJECTION */(function(process) {var Stream = __webpack_require__(17)

// through
//
// a stream that does nothing but re-emit the input.
// useful for aggregating a series of changing but not ending streams into one stream)

exports = module.exports = through
through.through = through

//create a readable writable stream.

function through (write, end, opts) {
  write = write || function (data) { this.queue(data) }
  end = end || function () { this.queue(null) }

  var ended = false, destroyed = false, buffer = [], _ended = false
  var stream = new Stream()
  stream.readable = stream.writable = true
  stream.paused = false

//  stream.autoPause   = !(opts && opts.autoPause   === false)
  stream.autoDestroy = !(opts && opts.autoDestroy === false)

  stream.write = function (data) {
    write.call(this, data)
    return !stream.paused
  }

  function drain() {
    while(buffer.length && !stream.paused) {
      var data = buffer.shift()
      if(null === data)
        return stream.emit('end')
      else
        stream.emit('data', data)
    }
  }

  stream.queue = stream.push = function (data) {
//    console.error(ended)
    if(_ended) return stream
    if(data === null) _ended = true
    buffer.push(data)
    drain()
    return stream
  }

  //this will be registered as the first 'end' listener
  //must call destroy next tick, to make sure we're after any
  //stream piped from here.
  //this is only a problem if end is not emitted synchronously.
  //a nicer way to do this is to make sure this is the last listener for 'end'

  stream.on('end', function () {
    stream.readable = false
    if(!stream.writable && stream.autoDestroy)
      process.nextTick(function () {
        stream.destroy()
      })
  })

  function _end () {
    stream.writable = false
    end.call(stream)
    if(!stream.readable && stream.autoDestroy)
      stream.destroy()
  }

  stream.end = function (data) {
    if(ended) return
    ended = true
    if(arguments.length) stream.write(data)
    _end() // will emit or queue
    return stream
  }

  stream.destroy = function () {
    if(destroyed) return
    destroyed = true
    ended = true
    buffer.length = 0
    stream.writable = stream.readable = false
    stream.emit('close')
    return stream
  }

  stream.pause = function () {
    if(stream.paused) return
    stream.paused = true
    return stream
  }

  stream.resume = function () {
    if(stream.paused) {
      stream.paused = false
      stream.emit('resume')
    }
    drain()
    //may have become paused again,
    //as drain emits 'data'.
    if(!stream.paused)
      stream.emit('drain')
    return stream
  }
  return stream
}


/* WEBPACK VAR INJECTION */}.call(exports, __webpack_require__(5)))

/***/ }),
/* 43 */
/***/ (function(module, exports, __webpack_require__) {

var apply = Function.prototype.apply;

// DOM APIs, for completeness

exports.setTimeout = function() {
  return new Timeout(apply.call(setTimeout, window, arguments), clearTimeout);
};
exports.setInterval = function() {
  return new Timeout(apply.call(setInterval, window, arguments), clearInterval);
};
exports.clearTimeout =
exports.clearInterval = function(timeout) {
  if (timeout) {
    timeout.close();
  }
};

function Timeout(id, clearFn) {
  this._id = id;
  this._clearFn = clearFn;
}
Timeout.prototype.unref = Timeout.prototype.ref = function() {};
Timeout.prototype.close = function() {
  this._clearFn.call(window, this._id);
};

// Does not start the time, just sets up the members needed.
exports.enroll = function(item, msecs) {
  clearTimeout(item._idleTimeoutId);
  item._idleTimeout = msecs;
};

exports.unenroll = function(item) {
  clearTimeout(item._idleTimeoutId);
  item._idleTimeout = -1;
};

exports._unrefActive = exports.active = function(item) {
  clearTimeout(item._idleTimeoutId);

  var msecs = item._idleTimeout;
  if (msecs >= 0) {
    item._idleTimeoutId = setTimeout(function onTimeout() {
      if (item._onTimeout)
        item._onTimeout();
    }, msecs);
  }
};

// setimmediate attaches itself to the global object
__webpack_require__(39);
exports.setImmediate = setImmediate;
exports.clearImmediate = clearImmediate;


/***/ }),
/* 44 */
/***/ (function(module, exports) {


exports = module.exports = trim;

function trim(str){
  return str.replace(/^\s*|\s*$/g, '');
}

exports.left = function(str){
  return str.replace(/^\s*/, '');
};

exports.right = function(str){
  return str.replace(/\s*$/, '');
};


/***/ }),
/* 45 */
/***/ (function(module, exports, __webpack_require__) {

/* WEBPACK VAR INJECTION */(function(global) {
/**
 * Module exports.
 */

module.exports = deprecate;

/**
 * Mark that a method should not be used.
 * Returns a modified function which warns once by default.
 *
 * If `localStorage.noDeprecation = true` is set, then it is a no-op.
 *
 * If `localStorage.throwDeprecation = true` is set, then deprecated functions
 * will throw an Error when invoked.
 *
 * If `localStorage.traceDeprecation = true` is set, then deprecated functions
 * will invoke `console.trace()` instead of `console.error()`.
 *
 * @param {Function} fn - the function to deprecate
 * @param {String} msg - the string to print to the console when `fn` is invoked
 * @returns {Function} a new "deprecated" version of `fn`
 * @api public
 */

function deprecate (fn, msg) {
  if (config('noDeprecation')) {
    return fn;
  }

  var warned = false;
  function deprecated() {
    if (!warned) {
      if (config('throwDeprecation')) {
        throw new Error(msg);
      } else if (config('traceDeprecation')) {
        console.trace(msg);
      } else {
        console.warn(msg);
      }
      warned = true;
    }
    return fn.apply(this, arguments);
  }

  return deprecated;
}

/**
 * Checks `localStorage` for boolean values for the given `name`.
 *
 * @param {String} name
 * @returns {Boolean}
 * @api private
 */

function config (name) {
  // accessing global.localStorage can trigger a DOMException in sandboxed iframes
  try {
    if (!global.localStorage) return false;
  } catch (_) {
    return false;
  }
  var val = global.localStorage[name];
  if (null == val) return false;
  return String(val).toLowerCase() === 'true';
}

/* WEBPACK VAR INJECTION */}.call(exports, __webpack_require__(3)))

/***/ }),
/* 46 */
/***/ (function(module, exports) {

module.exports = "#version 300 es\n\nprecision highp float;\n\nuniform sampler2D u_image;\n\nout vec4 fragColor;\nin vec3 out_pos;\n\nvoid main(void) {\n    vec3 col = (out_pos+1.0)/2.0;\n    fragColor = vec4(col.xyz, 1.);\n  //  fragColor = vec4( vec3(1,1,0), 1. );\n}"

/***/ }),
/* 47 */
/***/ (function(module, exports) {

module.exports = "#version 300 es\n \nuniform float u_time;\nuniform vec2 u_resolution;\nuniform vec4 u_mouse;\nuniform mat4 u_model;\nuniform mat4 u_view;\nuniform mat4 u_projection;\nuniform mat4 u_projectionView;\n\nin vec4 inPos;\nin vec4 inVel;\n\nout vec3 out_pos;\n\nvoid main()\n{\n    gl_PointSize = 2.;\n    gl_Position = u_projectionView * u_model * inPos;\n    out_pos = inPos.xyz;\n}"

/***/ }),
/* 48 */
/***/ (function(module, exports) {

module.exports = "#version 300 es\n//unused\n \nprecision mediump float;\n \nout vec4 color;\n \nvoid main() {\n  color = vec4(1.0);\n}"

/***/ }),
/* 49 */
/***/ (function(module, exports) {

module.exports = "#version 300 es\n \nuniform float u_time;\nuniform vec2 u_resolution;\nuniform vec4 u_mouse;\nuniform mat4 u_model;\nuniform mat4 u_view;\nuniform mat4 u_projection;\nuniform mat4 u_projectionView;\n\nin vec4 inPos;\nin vec4 inVel;\nin vec4 inObjPos;\n\nout vec4 outPos;\nout vec4 outVel;\n\n#define M_PI 3.1415926535897932384626433832795\n\n\nfloat rand(vec2 co){\n    return fract(sin(dot(co.xy ,vec2(12.9898,78.233))) * 43758.5453);\n}\n\nvoid main()\n{     \n    vec3 pos = inPos.xyz; \n    vec3 vel = inVel.xyz; \n    vec3 objPos = inObjPos.xyz;\n    vec4 mousePos = u_mouse;\n    //objPos = max(mousePos.xyz,objPos);\n    \n    vel = (objPos - pos)/30.0;\n    if (length(objPos - pos) < 0.01) {\n        vel = vec3(0);\n    }\n    \n    outPos = vec4(pos.x+vel.x,pos.y+vel.y,pos.z+vel.z,1.0);\n    outVel = vec4(vel.x,vel.y,vel.z,1.0);\n}\n\n"

/***/ }),
/* 50 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

var window = __webpack_require__(30)
var isFunction = __webpack_require__(12)
var parseHeaders = __webpack_require__(32)
var xtend = __webpack_require__(51)

module.exports = createXHR
createXHR.XMLHttpRequest = window.XMLHttpRequest || noop
createXHR.XDomainRequest = "withCredentials" in (new createXHR.XMLHttpRequest()) ? createXHR.XMLHttpRequest : window.XDomainRequest

forEachArray(["get", "put", "post", "patch", "head", "delete"], function(method) {
    createXHR[method === "delete" ? "del" : method] = function(uri, options, callback) {
        options = initParams(uri, options, callback)
        options.method = method.toUpperCase()
        return _createXHR(options)
    }
})

function forEachArray(array, iterator) {
    for (var i = 0; i < array.length; i++) {
        iterator(array[i])
    }
}

function isEmpty(obj){
    for(var i in obj){
        if(obj.hasOwnProperty(i)) return false
    }
    return true
}

function initParams(uri, options, callback) {
    var params = uri

    if (isFunction(options)) {
        callback = options
        if (typeof uri === "string") {
            params = {uri:uri}
        }
    } else {
        params = xtend(options, {uri: uri})
    }

    params.callback = callback
    return params
}

function createXHR(uri, options, callback) {
    options = initParams(uri, options, callback)
    return _createXHR(options)
}

function _createXHR(options) {
    if(typeof options.callback === "undefined"){
        throw new Error("callback argument missing")
    }

    var called = false
    var callback = function cbOnce(err, response, body){
        if(!called){
            called = true
            options.callback(err, response, body)
        }
    }

    function readystatechange() {
        if (xhr.readyState === 4) {
            setTimeout(loadFunc, 0)
        }
    }

    function getBody() {
        // Chrome with requestType=blob throws errors arround when even testing access to responseText
        var body = undefined

        if (xhr.response) {
            body = xhr.response
        } else {
            body = xhr.responseText || getXml(xhr)
        }

        if (isJson) {
            try {
                body = JSON.parse(body)
            } catch (e) {}
        }

        return body
    }

    function errorFunc(evt) {
        clearTimeout(timeoutTimer)
        if(!(evt instanceof Error)){
            evt = new Error("" + (evt || "Unknown XMLHttpRequest Error") )
        }
        evt.statusCode = 0
        return callback(evt, failureResponse)
    }

    // will load the data & process the response in a special response object
    function loadFunc() {
        if (aborted) return
        var status
        clearTimeout(timeoutTimer)
        if(options.useXDR && xhr.status===undefined) {
            //IE8 CORS GET successful response doesn't have a status field, but body is fine
            status = 200
        } else {
            status = (xhr.status === 1223 ? 204 : xhr.status)
        }
        var response = failureResponse
        var err = null

        if (status !== 0){
            response = {
                body: getBody(),
                statusCode: status,
                method: method,
                headers: {},
                url: uri,
                rawRequest: xhr
            }
            if(xhr.getAllResponseHeaders){ //remember xhr can in fact be XDR for CORS in IE
                response.headers = parseHeaders(xhr.getAllResponseHeaders())
            }
        } else {
            err = new Error("Internal XMLHttpRequest Error")
        }
        return callback(err, response, response.body)
    }

    var xhr = options.xhr || null

    if (!xhr) {
        if (options.cors || options.useXDR) {
            xhr = new createXHR.XDomainRequest()
        }else{
            xhr = new createXHR.XMLHttpRequest()
        }
    }

    var key
    var aborted
    var uri = xhr.url = options.uri || options.url
    var method = xhr.method = options.method || "GET"
    var body = options.body || options.data
    var headers = xhr.headers = options.headers || {}
    var sync = !!options.sync
    var isJson = false
    var timeoutTimer
    var failureResponse = {
        body: undefined,
        headers: {},
        statusCode: 0,
        method: method,
        url: uri,
        rawRequest: xhr
    }

    if ("json" in options && options.json !== false) {
        isJson = true
        headers["accept"] || headers["Accept"] || (headers["Accept"] = "application/json") //Don't override existing accept header declared by user
        if (method !== "GET" && method !== "HEAD") {
            headers["content-type"] || headers["Content-Type"] || (headers["Content-Type"] = "application/json") //Don't override existing accept header declared by user
            body = JSON.stringify(options.json === true ? body : options.json)
        }
    }

    xhr.onreadystatechange = readystatechange
    xhr.onload = loadFunc
    xhr.onerror = errorFunc
    // IE9 must have onprogress be set to a unique function.
    xhr.onprogress = function () {
        // IE must die
    }
    xhr.onabort = function(){
        aborted = true;
    }
    xhr.ontimeout = errorFunc
    xhr.open(method, uri, !sync, options.username, options.password)
    //has to be after open
    if(!sync) {
        xhr.withCredentials = !!options.withCredentials
    }
    // Cannot set timeout with sync request
    // not setting timeout on the xhr object, because of old webkits etc. not handling that correctly
    // both npm's request and jquery 1.x use this kind of timeout, so this is being consistent
    if (!sync && options.timeout > 0 ) {
        timeoutTimer = setTimeout(function(){
            if (aborted) return
            aborted = true//IE9 may still call readystatechange
            xhr.abort("timeout")
            var e = new Error("XMLHttpRequest timeout")
            e.code = "ETIMEDOUT"
            errorFunc(e)
        }, options.timeout )
    }

    if (xhr.setRequestHeader) {
        for(key in headers){
            if(headers.hasOwnProperty(key)){
                xhr.setRequestHeader(key, headers[key])
            }
        }
    } else if (options.headers && !isEmpty(options.headers)) {
        throw new Error("Headers cannot be set on an XDomainRequest object")
    }

    if ("responseType" in options) {
        xhr.responseType = options.responseType
    }

    if ("beforeSend" in options &&
        typeof options.beforeSend === "function"
    ) {
        options.beforeSend(xhr)
    }

    // Microsoft Edge browser sends "undefined" when send is called with undefined value.
    // XMLHttpRequest spec says to pass null as body to indicate no body
    // See https://github.com/naugtur/xhr/issues/100.
    xhr.send(body || null)

    return xhr


}

function getXml(xhr) {
    if (xhr.responseType === "document") {
        return xhr.responseXML
    }
    var firefoxBugTakenEffect = xhr.responseXML && xhr.responseXML.documentElement.nodeName === "parsererror"
    if (xhr.responseType === "" && !firefoxBugTakenEffect) {
        return xhr.responseXML
    }

    return null
}

function noop() {}


/***/ }),
/* 51 */
/***/ (function(module, exports) {

module.exports = extend

var hasOwnProperty = Object.prototype.hasOwnProperty;

function extend() {
    var target = {}

    for (var i = 0; i < arguments.length; i++) {
        var source = arguments[i]

        for (var key in source) {
            if (hasOwnProperty.call(source, key)) {
                target[key] = source[key]
            }
        }
    }

    return target
}


/***/ }),
/* 52 */
/***/ (function(module, exports, __webpack_require__) {

var map = {
	"./draw-frag.glsl": 46,
	"./particles-frag.glsl": 48
};
function webpackContext(req) {
	return __webpack_require__(webpackContextResolve(req));
};
function webpackContextResolve(req) {
	var id = map[req];
	if(!(id + 1)) // check for number or string
		throw new Error("Cannot find module '" + req + "'.");
	return id;
};
webpackContext.keys = function webpackContextKeys() {
	return Object.keys(map);
};
webpackContext.resolve = webpackContextResolve;
module.exports = webpackContext;
webpackContext.id = 52;

/***/ }),
/* 53 */
/***/ (function(module, exports, __webpack_require__) {

var map = {
	"./draw-vert.glsl": 47,
	"./particles-vert.glsl": 49
};
function webpackContext(req) {
	return __webpack_require__(webpackContextResolve(req));
};
function webpackContextResolve(req) {
	var id = map[req];
	if(!(id + 1)) // check for number or string
		throw new Error("Cannot find module '" + req + "'.");
	return id;
};
webpackContext.keys = function webpackContextKeys() {
	return Object.keys(map);
};
webpackContext.resolve = webpackContextResolve;
module.exports = webpackContext;
webpackContext.id = 53;

/***/ }),
/* 54 */
/***/ (function(module, exports) {

/* (ignored) */

/***/ })
/******/ ]);
//# sourceMappingURL=bundle.js.map