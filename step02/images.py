def get_upload_url():
    # query param
    filename = request.openapi.parameters.query['filename']
    stem = path(filename).stem
    content_type = request.openapi.parameters.query['content-type']
    file_uuid = uuid.uuid4()
    key = f'images/{file_uuid}'

    # upload image in database
    image_record = Images(bucket=BUCKET_NAME, filename=filename, key=key)
    db.session.add(image_record)
    db.session.commit()

    # params for s3 put_object method
    # tag + uuid
    s3_params = {
        'Bucket': f'{BUCKET_NAME}',
        'Key': f'{key}',
        'ContentType': content_type,
        'Tagging': f'{stem}={file_uuid}'
      }

    url = s3.generate_presigned_url(
      'put_object',
      Params=s3_params,
      HttpMethod="PUT",
      ExpiresIn=2
    )
    
    payload = {
      'filename': stem,
      'content-type': content_type,
      'uuid': file_uuid,
      'presigned_url': url,
      f'{stem}': file_uuid
    }
    return jsonify(payload)