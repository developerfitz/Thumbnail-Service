from functools import wraps
from flask import abort, session, g
import requests


def require_authentication(func):
    @wraps(func)
    def decorator(*args, **kwargs):
        if 'user_id' not in session:
            abort(403)

        if not g.db.get_user(session['user_id']):
     	    abort(403)

        return func(*args, **kwargs)
    return decorator


def get_authorization_link(client_id):
    '''
        Generates the authorization link for Github OAuth
    '''
    return f'https://github.com/login/oauth/authorize?client_id={client_id}'

def get_authorization(client_id, client_secret, code):
    '''
        Requests OAuth token from Github
    '''
    r = requests.post(
        'https://github.com/login/oauth/access_token',
        headers={'accept': 'application/json'},
        params={
            'client_id': client_id,
            'client_secret': client_secret,
            'code': code,
            # 'redirect_uri': 'https',
            # # 'state': '',
        }
    )

    return r.json()


class GithubClient:
    '''
        A makeshift Github API Client
    '''
    def __init__(self, token):
        self.bearer_token = token
	

    def get_user(self):
        res = requests.get(
            'https://api.github.com/user',
            headers={'authorization': f'token {self.bearer_token}'}
        )

        return res.json()
