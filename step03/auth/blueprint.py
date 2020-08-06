from flask import Blueprint, session, redirect, url_for, request, g, current_app, abort, render_template
import requests
from .utils import get_authorization, get_authorization_link, GithubClient
import os, binascii

auth = Blueprint('auth', __name__)


@auth.route('/auth/login')
def login():
    # Generate Auth link and redirect
    GITHUB_CLIENT_ID = current_app.config.get('GITHUB_CLIENT_ID')
    STATE = binascii.b2a_hex(os.urandom(16)).decode()

    github_auth_link = get_authorization_link(GITHUB_CLIENT_ID)
    return redirect(github_auth_link)

@auth.route('/auth/logout')
def logout():
    session.pop('github_id', None)
    return 'logged out'


@auth.route('/auth/authorized')
def authorized(): 
    # Grab 'code' from query param
    query_parameters = request.args   

    # If no 'code' then serve HTTP 403 using abort()
    if not query_parameters['code']:
        abort(403)

    # Exchange Authorization Code for Authorization Token. Get client id/secret from current_app.config
    CODE = query_parameters['code']
    GITHUB_CLIENT_ID = current_app.config.get('GITHUB_CLIENT_ID')
    GITHUB_CLIENT_SECRET = current_app.config.get('GITHUB_CLIENT_SECRET')
    # STATE = query_parameters['state']
    # REDIRECT_URI = 'http://localhost:5000/'

    # Request User Data using Authorization Token
    exchange_code_link = get_authorization(GITHUB_CLIENT_ID, GITHUB_CLIENT_SECRET, CODE)
    # ressponse from code exchange
    res = exchange_code_link
    github_client = GithubClient(res['access_token'])
    user = github_client.get_user()

    # Store github user profile 
    g.db.create_github_profile(
        user['id'], 
        user['login'],
        res['access_token'],
        avatar_url=user['avatar_url'], 
        # email=user['email']
    )

    # Save github_id number in session (cookie). This way when they create sign up we can prefill the fields
    session['github_id'] = user['id']

    # If not already a registered user redirect to /signup. use url_for
    if 'world' not in session:
        return redirect(url_for('signup'))

    # Otherwize, redirect to the /profile. use url_for
    return redirect(url_for('get_profile'))