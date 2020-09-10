from flask import g
from sqlalchemy.orm import sessionmaker
from sqlalchemy import create_engine
import models
from models import Profiles

Base = models.Base

engine = create_engine('sqlite+pysqlite:///imagely.db')
Base.metadata.create_all(engine)
Session = sessionmaker(bind=engine)
session = Session()


def registered_user(github_id):
		try:
				db = session
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
				username=user['username'], # github labled as 'login'
				email=user['email'], 
				avatar_url=user['avatar_url'], 
				github_id=user['github_id'] # github labled as 'id'
		)
		return new_user

def add_user_to_db(new_user):
		db = session
		db.add(new_user)
		db.commit()
		db.close()

def update_user_db_profile(github_id, update_object):
		db = session
		db.query(Profiles).filter(
				Profiles.github_id == github_id
				).update(update_object)
		db.commit()
		db.close()

def get_user_profile(github_id):
		db = session
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