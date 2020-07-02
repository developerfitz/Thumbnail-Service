from flask import Flask, jsonify, request, send_file # web framework
import boto3 # aws SDK

# openAPI spec
from openapi_core import create_spec
from openapi_core.contrib.flask.decorators import FlaskOpenAPIViewDecorator
import yaml

# DB
import db
from models import Images

# misc
import uuid
import pathlib

with open('api.yaml') as infile:
  spec_dict = yaml.load(infile.read())
  spec = create_spec(spec_dict)

openapi = FlaskOpenAPIViewDecorator.from_spec(spec)
path = pathlib.PurePath

BUCKET_NAME = 'gg-photo-bucket'
UPLOAD_FOLDER = 'images'
AWS_PROFILE = 'thumbnail-service'

session = boto3.Session(profile_name=AWS_PROFILE)
s3 = session.client('s3')

app = Flask(__name__, static_folder='./app-frontend/public', static_url_path='/static')

@app.route('/')
def serve_ui():
  return send_file('./app-frontend/public/index.html')

@app.route('/users/me', methods=['GET'])
@openapi
def get_profile():
  return jsonify({
    'id': 0
  })

@app.route('/images/upload_url', methods=['GET'])
@openapi
def get_upload_url():
  # query param
  filename = request.openapi.parameters.query['filename']
  content_type = request.openapi.parameters.query['content-type']
  # values used for S3 presigned-url
  file_uuid = str(uuid.uuid4())
  stem = path(filename).stem
  # key is a PurePosixPath object so be mindful it's not a string
  key = path(UPLOAD_FOLDER, file_uuid)
  # key = f'{UPLOAD_FOLDER}/{file_uuid}'

  try:
    # upload image in database
    image_record = Images(bucket=BUCKET_NAME, filename=filename, key=str(key))
    db.session.add(image_record)
    db.session.commit()
  except DBAPIError as db_error:
    print(f'DB API Error: {db_error.statement}')
    raise
  except SQLAlchemyError as alchemy_error:
    print(f'SQL Alchemy Error: {alchemy_error}')
    raise

  # params for s3 put_object method
  # tag + uuid
  s3_params = {
      'Bucket': BUCKET_NAME,
      'Key': f'{key}',
      'ContentType': content_type,
      'Tagging': f'{stem}={file_uuid}'
    }

  url = s3.generate_presigned_url(
    'put_object',
    Params=s3_params,
    HttpMethod="PUT",
    ExpiresIn=10
  )
  
  payload = {'presigned_url': url}
  return jsonify(payload)


if __name__ == '__main__':
  app.run()