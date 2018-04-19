"""
BatChords save view.
URLs include:
/token
"""
import flask
from flask import redirect
import batchords
import arrow
import requests
import json


@batchords.app.route('/save', methods=['GET', 'POST'])
def save():
    # Verify access token
    if "access_token" not in flask.session:
        return redirect("/start")
    access_token = "Bearer " + flask.session["access_token"]
    headers = {'Authorization': access_token, 'Content-type':'application/json'}

    # Verify a score is currently in use
    if not "scoreid" in flask.session:
        return redirect("/home")

    #Verify got XML param
    xml = flask.request.args.get('xml')
    if (xml == None) or (xml == ""):
        return redirect("/")

    title = flask.request.args.get('title')
    if title == None:
        title = "Untitled"
    print("DEBUG", "checked all params")

    # Create New Score
    payload = {
              "title": title,
              "privacy": "public",
              "data": xml
              }
    print("DEBUG",payload["data"])
    r = requests.post('https://api.flat.io/v2/scores', data=json.dumps(payload), headers=headers)
    data = r.json()
    print("DEBUG r", r)
    print("DEBUG data", data)

    # Check if creation was successful. If so, delete old copy of score
    url = "https://api.flat.io/v2/scores/" + flask.session["scoreid"]
    if r.status_code == 200:
        new_score = data["id"]

        # Delete old copy
        r = requests.delete('https://api.flat.io/v2/scores', headers=headers)

        # Open New Score
        flask.session["scoreid"] = new_score

    return redirect("/")


    # Open New Score
    flask.session["scoreid"] = data["id"]
    return redirect("/")