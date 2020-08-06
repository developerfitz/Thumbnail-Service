from flask import Flask, g, url_for, redirect, abort, render_template
import flask
import logging
import requests
import os
from dotenv import load_dotenv
from functools import wraps
from auth import auth, require_authentication
from db import FakeDatabase
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
    flask.g.db = db


@app.before_request
def set_user_context():
    if 'user_id' in flask.session:
        flask.g.user = flask.g.db.get_user(flask.session['user_id'])



@app.route('/profile')
@require_authentication
def get_profile():
    user = flask.g.db.get_user(flask.session['user_id'])
    print(user)
    return render_template(
        'profile.html',
        profile_image_url=user['avatar_url'],
        username=user['username']
    )

@app.errorhandler(werkzeug.exceptions.Forbidden)
def forbidden_error_handler(e):
    return render_template('403-forbidden.html'), 403


@app.route('/signup')
def signup():
    if 'github_id' not in flask.session:
        return render_template('signup.html')

    github_profile = flask.g.db.get_github_profile(flask.session['github_id'])
    if not github_profile:
        return render_template('signup.html')

    print(github_profile)

    return render_template(
        'create-account.html',
        github_username=github_profile['login'] or '',
        github_email=github_profile['email'] or ''
    )


@app.route('/users', methods=['POST'])
def create_account():
    if 'github_id' not in flask.session:
        return render_template('signup.html')

    github_id = flask.session['github_id']
    github_profile = flask.g.db.get_github_profile(github_id)

    username = flask.request.form['username']
    email = flask.request.form['email']
    avatar_url = github_profile['avatar_url']

    flask.g.db.create_user(username, email, avatar_url, github_id=github_id)
    flask.session['user_id'] = username

    return redirect(url_for('get_profile'))


@app.route('/')
def login():
    return render_template(
        'login.html'
    )

application = app