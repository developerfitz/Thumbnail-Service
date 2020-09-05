from functools import wraps
from flask import abort, session, g
import requests
from models import Profiles


def require_authentication(func):
    @wraps(func)
    def decorator(*args, **kwargs):
        g.logger.info('in require auth')
        # g.logger.info(g.profile)
        if 'user_id' not in session:
            abort(403)
        
        # TODO: check if db has the user and abort if not
        # if not g.db.get_user(session['user_id']):
        # g.logger.info(session['user_id'])
        # db = g.Session()
        # user_id is the github login (username)
        # g.logger.info(session['user_id'])
        # query returns a tuple
        # user = db.query(Profiles).filter_by(username='developerfitz').first()
        # user = db.query(Profiles).all()
        # g.logger.info('after query')
        # g.logger.info(user)
        # try: 
        #     db.query(Profiles.username).filter_by(username=session[user_id])
        # except e:
        #     print(e)
     	#     abort(403)
        #  ? not sure if this is the proper test to ensure app doesn't break
        if not g.user: 
     	    abort(403)
        # g.user = user
        # db.close()

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
