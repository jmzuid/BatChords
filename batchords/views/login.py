"""
BatChords login view.
URLs include:
/start
/login
/logout
"""
import flask
from flask import redirect
import batchords
import arrow
import requests

@batchords.app.route('/start', methods=['GET', 'POST'])
def start():
    """Display a button to redirect to flat.io to get the authorization code."""
    context = {}

    # flask.session["access_token"] = "0c73df1879c52f87555fe3bed875a5d95656ba67b8c20e0ee1318f81c4d699977fc9f689f1c5de739bba4fadafe9d0cd17fb3526c7b6b9b0766a7d272ee7e976"
    return flask.render_template("start.html", **context)


@batchords.app.route('/logout', methods=['GET', 'POST'])
def logout():
    """Remove access_token from session."""
    # TODO make request to flat.io to invalidate oauth2 token
    flask.session.pop('access_token', None)
    return redirect("/start")


@batchords.app.route('/login', methods=['GET', 'POST'])
def login():
    """Make POST request to exchange authorization code for access token."""
    context = {}

    auth_code = flask.request.args.get('code')
    print ("DEBUG", auth_code)
    if auth_code:
        params = {"grant_type":"authorization_code",
                  "code":auth_code,
                  "client_id":"b910a07-aeaa-49ff-9770-5f3c452a350a",
                  "client_secret":"44cd0d034964fec6e183f742b6a52289764eea6a9ea73a22d5ec4127dd1001db6c397d1be42a315cee6237c0d1ca4414532a690540ee9bfca7b5487d856b2cdf",
                  "redirect_uri":"http://localhost:8000/login"}
        r = requests.post('https://api.flat.io/oauth/access_token', data = params)

        # Save access token from response
        data = r.json()
        print ("DEBUG",data)
        if "access_token" in data:
            flask.session["access_token"] = data["access_token"]
        else:
            flask.session["access_token"] = "0c73df1879c52f87555fe3bed875a5d95656ba67b8c20e0ee1318f81c4d699977fc9f689f1c5de739bba4fadafe9d0cd17fb3526c7b6b9b0766a7d272ee7e976"
        return redirect("/home")
    # else:
        """
        print("DEBUG",flask.request.url)
        fragment = (flask.request.url).split("#")[1]
        redirect_url = "/token" + fragment
        return redirect(redirect_url)
        """

    return redirect("/start")