'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.configure = exports.Endpoint = exports.Config = exports.Rest = undefined;

var _dec, _class3;

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol ? "symbol" : typeof obj; };

var _qs = require('qs');

var _qs2 = _interopRequireDefault(_qs);

var _extend = require('extend');

var _extend2 = _interopRequireDefault(_extend);

var _aureliaFetchClient = require('aurelia-fetch-client');

var _aureliaDependencyInjection = require('aurelia-dependency-injection');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var Rest = exports.Rest = function () {
  function Rest(httpClient, endpoint) {
    _classCallCheck(this, Rest);

    this.defaults = {
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json'
      }
    };

    this.client = httpClient;
    this.endpoint = endpoint;
  }

  Rest.prototype.request = function request(method, path, body) {
    var options = arguments.length <= 3 || arguments[3] === undefined ? {} : arguments[3];

    var requestOptions = (0, _extend2.default)(true, {}, this.defaults, options);

    requestOptions.method = method;

    if ((typeof body === 'undefined' ? 'undefined' : _typeof(body)) === 'object') {
      requestOptions.body = (0, _aureliaFetchClient.json)(body);
    }

    return this.client.fetch(path, requestOptions).then(function (response) {
      if (response.status >= 200 && response.status < 400) {
        return response.json().catch(function (error) {
          return null;
        });
      }

      throw response;
    });
  };

  Rest.prototype.find = function find(resource, criteria, options) {
    var requestPath = resource;

    if (criteria) {
      requestPath += (typeof criteria === 'undefined' ? 'undefined' : _typeof(criteria)) !== 'object' ? '/' + criteria : '?' + _qs2.default.stringify(criteria);
    }

    return this.request('GET', requestPath, undefined, options);
  };

  Rest.prototype.post = function post(resource, body, options) {
    return this.request('POST', resource, body, options);
  };

  Rest.prototype.update = function update(resource, criteria, body, options) {
    var requestPath = resource;

    if (criteria) {
      requestPath += (typeof criteria === 'undefined' ? 'undefined' : _typeof(criteria)) !== 'object' ? '/' + criteria : '?' + _qs2.default.stringify(criteria);
    }

    return this.request('PUT', requestPath, body, options);
  };

  Rest.prototype.patch = function patch(resource, criteria, body, options) {
    var requestPath = resource;

    if (criteria) {
      requestPath += (typeof criteria === 'undefined' ? 'undefined' : _typeof(criteria)) !== 'object' ? '/' + criteria : '?' + _qs2.default.stringify(criteria);
    }

    return this.request('PATCH', requestPath, body, options);
  };

  Rest.prototype.destroy = function destroy(resource, criteria, options) {
    var requestPath = resource;

    if (criteria) {
      requestPath += (typeof criteria === 'undefined' ? 'undefined' : _typeof(criteria)) !== 'object' ? '/' + criteria : '?' + _qs2.default.stringify(criteria);
    }

    return this.request('DELETE', requestPath, undefined, options);
  };

  Rest.prototype.create = function create(resource, body, options) {
    return this.post.apply(this, arguments);
  };

  return Rest;
}();

var Config = exports.Config = function () {
  function Config() {
    _classCallCheck(this, Config);

    this.endpoints = {};
    this.defaultEndpoint = null;
  }

  Config.prototype.registerEndpoint = function registerEndpoint(name, configureMethod) {
    var defaults = arguments.length <= 2 || arguments[2] === undefined ? {} : arguments[2];

    var newClient = new _aureliaFetchClient.HttpClient();
    this.endpoints[name] = new Rest(newClient, name);

    (0, _extend2.default)(true, this.endpoints[name].defaults, defaults);

    if (typeof configureMethod === 'function') {
      newClient.configure(configureMethod);

      return this;
    }

    if (typeof configureMethod !== 'string') {
      return this;
    }

    newClient.configure(function (configure) {
      configure.withBaseUrl(configureMethod);
    });

    return this;
  };

  Config.prototype.getEndpoint = function getEndpoint(name) {
    if (!name) {
      return this.defaultEndpoint || null;
    }

    return this.endpoints[name] || null;
  };

  Config.prototype.endpointExists = function endpointExists(name) {
    return !!this.endpoints[name];
  };

  Config.prototype.setDefaultEndpoint = function setDefaultEndpoint(name) {
    this.defaultEndpoint = this.getEndpoint(name);

    return this;
  };

  return Config;
}();

var Endpoint = exports.Endpoint = (_dec = (0, _aureliaDependencyInjection.resolver)(), _dec(_class3 = function () {
  function Endpoint(key) {
    _classCallCheck(this, Endpoint);

    this._key = key;
  }

  Endpoint.prototype.get = function get(container) {
    return container.get(Config).getEndpoint(this._key);
  };

  Endpoint.of = function of(key) {
    return new Endpoint(key);
  };

  return Endpoint;
}()) || _class3);


function configure(aurelia, configCallback) {
  var config = aurelia.container.get(Config);

  configCallback(config);
}

exports.configure = configure;
exports.Config = Config;
exports.Rest = Rest;
exports.Endpoint = Endpoint;