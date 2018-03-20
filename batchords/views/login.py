"""
BatChords login view.

URLs include:
/start
/login
"""
import flask
import batchords
import arrow
import requests

@batchords.app.route('/start', methods=['GET', 'POST'])
def start():
    """Display a button to redirect to flat.io to get the authorization code."""
    context = {}

    flask.session["access_token"] = "0c73df1879c52f87555fe3bed875a5d95656ba67b8c20e0ee1318f81c4d699977fc9f689f1c5de739bba4fadafe9d0cd17fb3526c7b6b9b0766a7d272ee7e976"
    return flask.render_template("start.html", **context)


@batchords.app.route('/login', methods=['GET', 'POST'])
def login():
    """Make POST request to exchange authorization code for access token."""
    context = {}

    auth_code = flask.request.args.get('code')
    if auth_code:
        params = {grant_type:"authorization_code",
                  code:auth_code,
                  client_id:"<client_id>",
                  client_secret:"<client_secret>",
                  redirect_uri:"http://localhost:8000/login"}
        r = requests.post('https://api.flat.io/oauth/access_token', data = params)

        # Save access token from response
        data = r.json()
        flask.session["access_token"] = data["access_token"]
    else:
        return redirect("/start")

    return flask.render_template("login.html", **context)

