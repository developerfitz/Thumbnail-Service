"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;

var _ApiClient = _interopRequireDefault(require("../ApiClient"));

var _Error = _interopRequireDefault(require("../model/Error"));

var _PresignedUrl = _interopRequireDefault(require("../model/PresignedUrl"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

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
        throw new _Error["default"]("Missing the required parameter 'filename' when calling appGetUploadUrl");
      } // verify the required parameter 'contentType' is set


      if (contentType === undefined || contentType === null) {
        throw new _Error["default"]("Missing the required parameter 'contentType' when calling appGetUploadUrl");
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