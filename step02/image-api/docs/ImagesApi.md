# ThumbnailServiceApi.ImagesApi

All URIs are relative to *http://127.0.0.1:5000*

Method | HTTP request | Description
------------- | ------------- | -------------
[**appGetUploadUrl**](ImagesApi.md#appGetUploadUrl) | **GET** /images/upload_url | returns a presigned url for user to upload image



## appGetUploadUrl

> PresignedUrl appGetUploadUrl(filename, contentType)

returns a presigned url for user to upload image

### Example

```javascript
import ThumbnailServiceApi from 'thumbnail_service_api';

let apiInstance = new ThumbnailServiceApi.ImagesApi();
let filename = "filename_example"; // String | name of uploaded image
let contentType = "contentType_example"; // String | file MIME type
apiInstance.appGetUploadUrl(filename, contentType, (error, data, response) => {
  if (error) {
    console.error(error);
  } else {
    console.log('API called successfully. Returned data: ' + data);
  }
});
```

### Parameters


Name | Type | Description  | Notes
------------- | ------------- | ------------- | -------------
 **filename** | **String**| name of uploaded image | 
 **contentType** | **String**| file MIME type | 

### Return type

[**PresignedUrl**](PresignedUrl.md)

### Authorization

No authorization required

### HTTP request headers

- **Content-Type**: Not defined
- **Accept**: application/json

