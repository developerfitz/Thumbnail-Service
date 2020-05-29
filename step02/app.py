from flask import Flask, jsonify, request
import boto3

from openapi_core import create_spec
from openapi_core.contrib.flask.decorators import FlaskOpenAPIViewDecorator
import yaml

with open('example.yaml') as infile:
  spec_dict = yaml.load(infile.read())
  spec = create_spec(spec_dict)

openapi = FlaskOpenAPIViewDecorator.from_spec(spec)

BUCKET_NAME = ''
UPLOAD_FOLDER = ''
AWS_PROFILE = ''

session = boto3.Session(profile_name=AWS_PROFILE)
s3 = session.client('s3')

app = Flask(__name__)


@app.route('/users/me', methods=['GET'])
@openapi
def get_profile():
  return jsonify({
    'id': 0,
    'name': 'Ren'
  })

# @app.route('/images/upload_url', endpoint='images.get_upload_url')
# @openapi
# def get_upload_url():
#     pass


if __name__ == '__main__':
  app.run()