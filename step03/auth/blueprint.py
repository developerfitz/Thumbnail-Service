from flask import Blueprint, session, redirect, url_for, request, g, current_app
import requests
from .utils import get_authorization, get_authorization_link, GithubClient

auth = Blueprint('auth', __name__)


@auth.route('/auth/login')
def login():
    # Generate Auth link and redirect
    github_auth = 'https://github.com/login/oauth/authorize'
    return redirect(github_auth)

@auth.route('/auth/logout')
def logout():
    session.pop('github_id')
    return 'logged out'


@auth.route('/auth/authorized')
def authorized(): 
    pass
    # Grab 'code' from query param

    # If no 'code' then serve HTTP 403 using abort()

    # Exchange Authorization Code for Authorization Token. Get client id/secret from current_app.config

    # Request User Data using Authorization Token

    # Store github user profile

    # Save github_id number in session (cookie). This way when they create sign up we can prefill the fields

    # If not already a registered user redirect to /signup. use url_for

    # Otherwize, redirect to the /profile. use url_for
