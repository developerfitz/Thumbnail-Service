from flask import Flask, g, url_for, redirect, abort, render_template
import flask
import logging
import requests
import os
from dotenv import load_dotenv
from functools import wraps
from auth import auth, require_authentication
from auth.utils import create_new_user, add_user_to_db, update_user_db_profile, get_user_profile
from db import Session
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


@app.before_request
def set_db_context():
    # ? Why are there two contexts being set?
    flask.g.Session = Session
    flask.g.logger = app.logger

@app.before_request
def set_user_context():
    flask.g.logger.info('setting user context')
    # context set if new user (e.g., github_profile and github_id set)
    if 'github_profile' in flask.session and 'github_id' in flask.session:
        # ! flask.g possibly gets reset after every request?
        flask.g.github_id = flask.session['github_id']
        flask.g.github_profile = flask.session['github_profile']
        flask.g.logger.info('user context set')


@app.route('/profile')
@require_authentication
def get_profile():
    # user g.profile set when checked in require_auth
    return render_template(
        'profile.html',
        profile_image_url=flask.g.profile['avatar_url'],
        username=flask.g.profile['username']
    )

@app.errorhandler(werkzeug.exceptions.Forbidden)
def forbidden_error_handler(e):
    return render_template('403-forbidden.html'), 403


@app.route('/signup')
def signup():
    if 'github_id' not in flask.session:
        return render_template('signup.html')

    g.logger.info('route /signup')

    if 'github_profile' not in g:
        return render_template('signup.html')

    username = g.github_profile['username']  
    email = g.github_profile['email']  

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

    # create new user profile from github_profile
    created_user = create_new_user(g.github_profile)
    add_user_to_db(created_user)

    values_to_update = {
        'username': flask.request.form['username'],
        'email': flask.request.form['email'],
        'is_registered': True
    }

    update_user_db_profile(github_id, values_to_update)

    return redirect(url_for('get_profile'))


@app.route('/')
def login():
    return render_template(
        'login.html'
    )

application = app