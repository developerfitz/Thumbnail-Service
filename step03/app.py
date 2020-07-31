from flask import Flask, g, jsonify, send_from_directory, url_for
import boto3
import sqlite3
from flask_sqlalchemy import SQLAlchemy
from flask_migrate import Migrate

app = Flask(__name__)
app.extensions = {}
app.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite:///local.db'
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False

db = SQLAlchemy(app)
migrate = Migrate(app, db, compare_type=True)

from models import User


BUCKET_NAME = 'gg-thumbnail-project'
# OUTPUT_FOLDER = 'thumbnails'
UPLOAD_FOLDER = 'images'
AWS_PROFILE = 'thumbnail-service'
LOCAL_USER = {
    'username': 'local',
    'fullname': 'lolcats lolz',
    'user_tier': 'noob'
}


session = boto3.Session(profile_name=AWS_PROFILE)
s3 = session.client('s3')


def init_db():
    local_user = User.query.get(LOCAL_USER['username'])
    new_local_user = User.from_dict(LOCAL_USER)
    
    if local_user:
        db.session.merge(new_local_user)
    else:
        db.session.add(new_local_user)

    db.session.commit()


@app.cli.command('init_db')
def init_local():
    """Initializes the database for local testing"""
    init_db()
    print('Initialized the database.')


@app.before_request
def attach_current_user():
    if app.config['DEBUG']:
        g.current_user = LOCAL_USER['username']


@app.route('/users/me')
def get_profile():
    user = User.query.get(LOCAL_USER['username'])

    return jsonify({
        'username': user.username,
        'fullname': user.fullname
    })


@app.route('/images/upload_url')
def get_image_upload_url(filename):
    url = s3.generate_presigned_url(
        'put_object',
        Params={
            'Bucket': BUCKET_NAME,
            'Key': f'{UPLOAD_FOLDER}/{filename}',
            'ContentType': request.args['type']
        },
        HttpMethod="PUT",
    )

    return jsonify({
        'upload_url': url
    })


if __name__ == '__main__':
    app.run(debug=True)