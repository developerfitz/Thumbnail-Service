/**
 * Thumbnail Service API
 * No description provided (generated by Openapi Generator https://github.com/openapitools/openapi-generator)
 *
 * The version of the OpenAPI document: 1.0.0
 * 
 *
 * NOTE: This class is auto generated by OpenAPI Generator (https://openapi-generator.tech).
 * https://openapi-generator.tech
 * Do not edit the class manually.
 *
 */


import ApiClient from "../ApiClient";
import Error from '../model/Error';
import PresignedUrl from '../model/PresignedUrl';

/**
* Images service.
* @module api/ImagesApi
* @version 1.0.0
*/
export default class ImagesApi {

    /**
    * Constructs a new ImagesApi. 
    * @alias module:api/ImagesApi
    * @class
    * @param {module:ApiClient} [apiClient] Optional API client implementation to use,
    * default to {@link module:ApiClient#instance} if unspecified.
    */
    constructor(apiClient) {
        this.apiClient = apiClient || ApiClient.instance;
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
    appGetUploadUrl(filename, contentType, callback) {
      let postBody = null;
      // verify the required parameter 'filename' is set
      if (filename === undefined || filename === null) {
        throw new Error("Missing the required parameter 'filename' when calling appGetUploadUrl");
      }
      // verify the required parameter 'contentType' is set
      if (contentType === undefined || contentType === null) {
        throw new Error("Missing the required parameter 'contentType' when calling appGetUploadUrl");
      }

      let pathParams = {
      };
      let queryParams = {
        'filename': filename,
        'content-type': contentType
      };
      let headerParams = {
      };
      let formParams = {
      };

      let authNames = [];
      let contentTypes = [];
      let accepts = ['application/json'];
      let returnType = PresignedUrl;
      return this.apiClient.callApi(
        '/images/upload_url', 'GET',
        pathParams, queryParams, headerParams, formParams, postBody,
        authNames, contentTypes, accepts, returnType, null, callback
      );
    }


}