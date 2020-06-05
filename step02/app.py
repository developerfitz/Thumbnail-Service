from flask import Flask, jsonify, request # web framework
import boto3 # aws SDK

# openAPI spec
from openapi_core import create_spec
from openapi_core.contrib.flask.decorators import FlaskOpenAPIViewDecorator
import yaml

# misc
import uuid
import pathlib

with open('api.yaml') as infile:
  spec_dict = yaml.load(infile.read())
  spec = create_spec(spec_dict)

openapi = FlaskOpenAPIViewDecorator.from_spec(spec)
path = pathlib.PurePath

BUCKET_NAME = 'gg-photo-bucket'
UPLOAD_FOLDER = '/images'
AWS_PROFILE = 'thumbnail-service'

session = boto3.Session(profile_name=AWS_PROFILE)
s3 = session.client('s3')

app = Flask(__name__)


@app.route('/users/me', methods=['GET'])
@openapi
def get_profile():
  return jsonify({
    'id': 0
  })

@app.route('/images/upload_url', endpoint='image.get_upload_url')
@openapi
def get_upload_url():
    # query param
    filename = request.openapi.parameters.query['filename']
    stem = path(filename).stem
    content_type = request.openapi.parameters.query['content-type']
    file_uuid = uuid.uuid4()
    key = f'images/{file_uuid}'

    key = f'images/{file_uuid}'

    # TODO: upload uuid in database

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


if __name__ == '__main__':
  app.run(port=5000, debug=True)