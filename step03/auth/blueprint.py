from flask import Blueprint, session, redirect, url_for, request, g, current_app, abort, render_template
import requests
from sqlalchemy.orm.exc import MultipleResultsFound, NoResultFound

from .utils import get_authorization, get_authorization_link, get_user_profile, set_global_user_profile, GithubClient, registered_user
import os, binascii
from models import Profiles


auth = Blueprint('auth', __name__)


@auth.route('/auth/login')
def login():
    # Generate Auth link and redirect
    GITHUB_CLIENT_ID = current_app.config.get('GITHUB_CLIENT_ID')
    # STATE = binascii.b2a_hex(os.urandom(16)).decode()

    # after auth link sent, redirects back to /auth/authorized 
    github_auth_link = get_authorization_link(GITHUB_CLIENT_ID)
    return redirect(github_auth_link)

@auth.route('/auth/logout')
def logout():
    session.pop('github_id', None)
    session.pop('github_profile', None)
    session.pop('token', None)
    g.profile = None
    return redirect(url_for('login'))


@auth.route('/auth/authorized')
def authorized(): 
    # Grab 'code' from query param
    query_parameters = request.args   

    # If no 'code' then serve HTTP 403 using abort()
    if 'code' not in query_parameters:
        abort(403)

    # Exchange Authorization Code for Authorization Token. Get client id/secret from current_app.config
    CODE = query_parameters['code']
    GITHUB_CLIENT_ID = current_app.config.get('GITHUB_CLIENT_ID')
    GITHUB_CLIENT_SECRET = current_app.config.get('GITHUB_CLIENT_SECRET')
    # STATE = query_parameters['state']
    # REDIRECT_URI = 'http://localhost:5000/'

    # Request User Data using Authorization Token
    exchange_code_link = get_authorization(GITHUB_CLIENT_ID, GITHUB_CLIENT_SECRET, CODE)

    # response from code exchange with token
    res = exchange_code_link

    # token to get user data in json from github
    github_client = GithubClient(res['access_token'])
    user = github_client.get_user()

    # Save github_id number in session to prefill for sign-up fields
    session['github_id'] = user['id']
    session['token'] = res['access_token']

    if not user or not session['github_id']:
        g.logger.info('Github OAuth Error, redirected to home page.')
        return redirect(url_for('login'))


    if not registered_user(user['id']):
        session['github_profile'] = {
            'username': user['login'], 
            'email' :user['email'], 
            'avatar_url': user['avatar_url'], 
            'github_id': user['id']
        }
        return redirect(url_for('signup'))

    # Otherwise, redirect to the /profile. use url_for
    return redirect(url_for('get_profile'))