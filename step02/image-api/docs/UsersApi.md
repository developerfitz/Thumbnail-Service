# ThumbnailServiceApi.UsersApi

All URIs are relative to *http://127.0.0.1:5000*

Method | HTTP request | Description
------------- | ------------- | -------------
[**appGetProfile**](UsersApi.md#appGetProfile) | **GET** /users/me | Gets profile of current user



## appGetProfile

> User appGetProfile()

Gets profile of current user

### Example

```javascript
import ThumbnailServiceApi from 'thumbnail_service_api';

let apiInstance = new ThumbnailServiceApi.UsersApi();
apiInstance.appGetProfile((error, data, response) => {
  if (error) {
    console.error(error);
  } else {
    console.log('API called successfully. Returned data: ' + data);
  }
});
```

### Parameters

This endpoint does not need any parameter.

### Return type

[**User**](User.md)

### Authorization

No authorization required

### HTTP request headers

- **Content-Type**: Not defined
- **Accept**: application/json

