from functools import wraps
from flask import abort, session, g
import requests
from sqlalchemy.orm.exc import MultipleResultsFound, NoResultFound
from models import Profiles


def require_authentication(func):
    @wraps(func)
    def decorator(*args, **kwargs):
        g.logger.info('in require auth')
        if 'github_id' not in session:
            abort(403)

        try:
            profile = get_user_profile(session['github_id'])
            set_global_user_profile(profile)
        except NoResultFound as e:
            g.logger.info('No User Found.')
            g.logger.error(e)
            abort(404)

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


def registered_user(github_id):
    try:
        db = g.Session()
        registered = db.query(Profiles.is_registered).filter(
            Profiles.github_id == github_id
            ).one()
        db.close()
    except NoResultFound as e:
        g.logger.info('User not registered')
        g.logger.error(e)
        return False
    return registered[0]


def create_new_user(user):
    new_user = Profiles(
        username=user['username'], 
        email=user['email'], 
        avatar_url=user['avatar_url'], 
        github_id=user['github_id'] #github profile as ('id')
    )
    return new_user


def add_user_to_db(new_user):
    db = g.Session()
    db.add(new_user)
    db.commit()
    db.close()

def update_user_db_profile(github_id, update_object):
    db = g.Session()
    db.query(Profiles).filter(
        Profiles.github_id == github_id
        ).update(update_object)
    db.commit()
    db.close()

def get_user_profile(github_id):
    db = g.Session()
    user_profile = db.query(Profiles).filter(
        Profiles.github_id == github_id
        ).one()
    profile = {
        'username': user_profile.username,
        'github_id': user_profile.github_id,
        'avatar_url': user_profile.avatar_url,
        'email': user_profile.email,
        'is_registered': user_profile.is_registered,
        '_id': user_profile.user_number
    }
    db.close()
    return profile


def set_global_user_profile(profile):
    g.profile = profile

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
