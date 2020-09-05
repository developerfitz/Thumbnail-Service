from flask import Flask, g, url_for, redirect, abort, render_template
import flask
import logging
import requests
import os
from dotenv import load_dotenv
from functools import wraps
from auth import auth, require_authentication
from db import FakeDatabase, Session
from models import Profiles
# import db
import werkzeug

app = Flask(__name__)
app.register_blueprint(auth)
app.logger.setLevel(logging.INFO)
load_dotenv()

SECRET_KEY = os.environ.get("SECRET_KEY")

if not SECRET_KEY:
    raise ValueError("No SECRET_KEY set for Flask application")

GITHUB_CLIENT_ID = os.environ.get("GITHUB_CLIENT_ID")
GITHUB_CLIENT_SECRET = os.environ.get("GITHUB_CLIENT_SECRET")

if not GITHUB_CLIENT_ID or not GITHUB_CLIENT_SECRET:
    raise ValueError("No GITHUB_CLIENT_ID or GITHUB_CLIENT_SECRET set for Flask application")


app.config.update(
    SECRET_KEY=SECRET_KEY,
    GITHUB_CLIENT_ID=GITHUB_CLIENT_ID,
    GITHUB_CLIENT_SECRET=GITHUB_CLIENT_SECRET,
)

db = FakeDatabase()

@app.before_request
def set_db_context():
    # flask.g.db = db
    flask.g.Session = Session
    flask.g.logger = app.logger

@app.before_request
def set_user_context():
    if 'user_id' in flask.session:
        # TODO: access db to get user and set to global
        # flask.g.user = flask.g.db.get_user(flask.session['user_id'])
        # db = flask.g.Session()
        # db.
        flask.g.user = flask.session['user_id']




@app.route('/profile')
@require_authentication
def get_profile():
    # TODO: access db to get user and
    # user = flask.g.db.get_user(flask.session['user_id'])
    # db = g.Session()
    # db.query()
    db = flask.g.Session()
    user = db.query(Profiles).filter(Profiles.username == flask.session['user_id']).first()
    flask.g.logger.info('route /profile')
    flask.g.logger.info(user)
    flask.g.profile = {
        'username': user.username,
        'avatar_url': user.avatar_url
    }
    flask.g.logger.info(user)
    # print(user)
    return render_template(
        'profile.html',
        # profile_image_url=user['avatar_url'],
        # username=user['username']
        profile_image_url=user.avatar_url,
        username=user.username
    )

@app.errorhandler(werkzeug.exceptions.Forbidden)
def forbidden_error_handler(e):
    return render_template('403-forbidden.html'), 403


@app.route('/signup')
def signup():
    if 'github_id' not in flask.session:
        return render_template('signup.html')

    # github_profile = flask.g.db.get_github_profile(flask.session['github_id'])
    '''
         # TODO: tried to login with kaesaru but go into an endless loop
         # ? possibly due to this section and not being able to create
         # ? an account or something like that? not sure, feel here is the
         # ? issue
    ''' 
    # if not github_profile:
        # return render_template('signup.html')

    g.logger.info('route /signup')
    # cc_cookie = query.filter(Cookie.cookie_name == "chocolate chip").first() 2
    # cc_cookie.quantity = cc_cookie.quantity + 120
    # session.commit()
    db = g.Session()
    # query = db.query(Profiles.username, Profiles.email).filter_by(github_id=flask.session['github_id']).first()
    # TODO: make sure it is the only one when updating db
    query = db.query(Profiles).filter(Profiles.github_id == flask.session['github_id']).first()
    g.logger.info(query)
    g.logger.info(flask.session)
    username = query.username
    email = query.email
    # ? if github_id not found in DB user doesn't have an account 
    # ? redirect to signup page 
    # if flask.session['github_id'] not in query:
    if query == None:
        return render_template('signup.html')
    # print(github_profile)
    g.logger.info('before create-account.html')
    # ? registering the user here, does not seem like a good place tho
    query.is_registered = True
    flask.g.user = query
    g.logger.info(query)
    g.logger.info(query.username)
    g.logger.info(query.is_registered)
    db.commit()
    db.close()
    return render_template(
        'create-account.html',
        github_username=username or '',
        github_email=email or ''
    )


@app.route('/users', methods=['POST'])
def create_account():
    if 'github_id' not in flask.session:
        return render_template('signup.html')

    github_id = flask.session['github_id']
    # TODO: get github profile from db and
    # github_profile = flask.g.db.get_github_profile(github_id)
    db = g.Session()
    user_profile = db.query(Profiles).filter(Profiles.github_id == flask.session['github_id']).first()
    g.logger.info(user_profile)

    # register user, replaces creating a user
    username = flask.request.form['username']
    email = flask.request.form['email']
    avatar_url = user_profile.avatar_url
    
    user_profile.is_registered = True
    g.logger.info(user_profile)
    # user = Profiles(username=username, email=email, 
            #  avatar_url=avatar_url, github_id=github_id)
    # flask.session['user_id'] = user.username
    # flask.g.db.create_user(username, email, avatar_url, github_id=github_id)
    flask.session['user_id'] = user_profile.username
    # ? g.profile is not holding up think i'm missing something here
    # flask.g.profile = {
    #     'username': user_profile.username,
    #     'avatar_url':user_profile.avatar_url
    # }

    return redirect(url_for('get_profile'))

@app.route('/')
def login():
    return render_template(
        'login.html'
    )

application = app