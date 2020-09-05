from flask import g
from sqlalchemy.orm import sessionmaker
from sqlalchemy import create_engine
import models

Base = models.Base

engine = create_engine('sqlite+pysqlite:///imagely.db')
Base.metadata.create_all(engine)
Session = sessionmaker(bind=engine)
# Session = sessionmaker(bind=engine)
# session = Session()



class FakeDatabase:
	def __init__(self):
		self._users_by_github_id = {}
		self._users_by_username = {}
		self._github_profiles_by_github_id = {}
		self._github_profiles_by_username = {}


	def create_github_profile(self, _id, login, access_token, avatar_url=None, email=None):
		self._github_profiles_by_github_id[_id] = {
			'id': _id,
			'login': login,
			'avatar_url': avatar_url,
			'email': email,
			'access_token': access_token
		}


	def get_github_profile(self, github_id):
		if github_id not in self._github_profiles_by_github_id:
			return None

		return self._github_profiles_by_github_id[github_id]


	def get_github_profile_with_username(self, username):
		if username not in self._github_profiles_by_username:
			return None

		return self._github_profiles_by_username[username]


	def create_user(self, username, email, avatar_url, github_id=None):
		self._users_by_username[username] = {
			'username': username,
			'email': email,
			'avatar_url': avatar_url
		}

		if github_id:
			self.link_profile(username, github_id)


	def get_user(self, username):
		if username not in self._users_by_username:
			return None

		return self._users_by_username[username]


	def get_user_with_github_id(self, github_id):
		if github_id not in self._users_by_github_id:
			return None

		return self._users_by_github_id[github_id]


	def link_profile(self, username, github_id):
		user = self.get_user(username)
		self._users_by_github_id[github_id] = user

		github_profile = self.get_github_profile(github_id)
		self._github_profiles_by_username[username] = github_profile
