from flask import Blueprint, session, redirect, url_for, request, g, current_app, abort, render_template
import requests
from .utils import get_authorization, get_authorization_link, GithubClient
import os, binascii
from models import Profiles

auth = Blueprint('auth', __name__)
# db = g.Session()

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
    # after auth link sent, redirected back to this route 
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
    # response from code exchange with token
    res = exchange_code_link
    # token to get user data in json from github
    github_client = GithubClient(res['access_token'])
    user = github_client.get_user()

    # TODO: try to login using other github account
    # Save github_id number in session (cookie). This way when they create sign up we can prefill the fields
    session['github_id'] = user['id']
    # session['github_id'] = new_user.github_id

    # TODO: check if the DB has the github user already defined
    db = g.Session()
    query = db.query(Profiles.github_id).filter_by(github_id=user['id']).first()
    g.logger.info(session)
    g.logger.info(query)
    # if user['id'] not in query or user['login'] not in query:
    if query == None and session['github_id'] != None: 
        # Store github user profile
        # ? Should the access_token be stored
        # db = g.Session()
        new_user = Profiles(username=user['login'], email=user['email'], 
                avatar_url=user['avatar_url'], 
                access_token=res['access_token'], github_id=user['id'])
        db.add(new_user)
        db.commit()
        db.close()
        return redirect(url_for('signup'))

        # g.logger.info(user)
        # g.db.create_github_profile(
        #     user['id'], 
        #     user['login'],
        #     res['access_token'],
        #     avatar_url=user['avatar_url'], 
        #     # email=user['email']
        # )

    # If not already a registered user redirect to /signup. use url_for
    # if 'github_id' not in session:
        # return redirect(url_for('signup'))

    # Otherwise, redirect to the /profile. use url_for
    return redirect(url_for('get_profile'))