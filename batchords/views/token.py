"""
BatChords token view.

URLs include:
/token
"""
"""
import flask
from flask import redirect
import batchords
import arrow
import requests


@batchords.app.route('/token', methods=['GET', 'POST'])
def setToken():
	# Parse token f("DEBUG",rom) url
	url = flask.request.url
	print ("DEBUG",url)
	parsed_url = url.split("#")
	if len(parsed_url) == 2:
			fragment = parsed_url[1]
			params = fragment.split("&")
			if len(params) == 3:
				token_param = params[2].split("=")
				if (access_token in token_param) and (len(token_param) == 2):
					access_token = token_param[1]
					flask.session["access_token"] = data["access_token"]
					return redirect("/home")

	return redirect('/start')
"""