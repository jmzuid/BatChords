"""
BatChords login view.

URLs include:
/chooseScore
/home
/createScore
/uploads
"""
import flask
from flask import redirect
import batchords
import arrow
import requests
import json
import os


@batchords.app.route('/uploads/<filename>', methods=["GET"])
def get_upload(filename):
    """Return upload."""
    print("DEBUG","upload folder",batchords.app.config['UPLOAD_FOLDER'])
    print("DEBUG","filename",filename)
    return flask.send_from_directory(batchords.app.config['UPLOAD_FOLDER'], filename)


@batchords.app.route('/createScore', methods=['GET', 'POST'])
def createScore():
    # Verify access token
    if "access_token" not in flask.session:
        return redirect("/start")
    access_token = "Bearer " + flask.session["access_token"]

    #f = open("blank_score.xml","r")
    #blank_score = f.read()

    headers = {'Authorization': access_token, 'Content-type':'application/json'}

    # Create New Score
    payload = {
              "title": "My new score 2",
              "privacy": "public",
              "data": '<?xml version="1.0" encoding="UTF-8" standalone="no"?> <!DOCTYPE score-partwise PUBLIC "-//Recordare//DTD MusicXML 3.0 Partwise//EN" "http://www.musicxml.org/dtds/partwise.dtd"> <score-partwise version="3.0"> <identification> <encoding> <software>Flat</software> <encoding-date>2018-03-20</encoding-date> </encoding> <source>https://flat.io/score/5ab07b5a20a6bc18c94535f9-best-score-ever</source> </identification> <credit> <credit-type>title</credit-type> <credit-words>Best Score Ever</credit-words> </credit> <part-list> <score-part id="P1"> <part-name>Grand Piano</part-name> <part-abbreviation>Pno.</part-abbreviation> <score-instrument id="P1-I1"> <instrument-name>Grand Piano</instrument-name> </score-instrument> <midi-instrument id="P1-I1"> <midi-channel>1</midi-channel> <midi-program>1</midi-program> <volume>100</volume> </midi-instrument> </score-part> </part-list> <part id="P1"> <measure number="1"> <attributes> <divisions>1</divisions> <key> <fifths>0</fifths> </key> <time> <beats>4</beats> <beat-type>4</beat-type> </time> <staves>2</staves> <clef number="1"> <sign>G</sign> <line>2</line> </clef> <clef number="2"> <sign>F</sign> <line>4</line> </clef> <staff-details> <staff-lines>5</staff-lines> </staff-details> </attributes> <direction placement="above"> <direction-type> <metronome> <beat-unit>quarter</beat-unit> <per-minute>80</per-minute> </metronome> </direction-type> <staff>1</staff> </direction> <note> <rest/> <duration>1</duration> <voice>1</voice> <type>quarter</type> <staff>1</staff> </note> <note> <rest/> <duration>1</duration> <voice>1</voice> <type>quarter</type> <staff>1</staff> </note> <note> <rest/> <duration>1</duration> <voice>1</voice> <type>quarter</type> <staff>1</staff> </note> <note> <rest/> <duration>1</duration> <voice>1</voice> <type>quarter</type> <staff>1</staff> </note> <backup> <duration>4</duration> </backup> <note> <rest/> <duration>1</duration> <voice>2</voice> <type>quarter</type> <staff>2</staff> </note> <note> <rest/> <duration>1</duration> <voice>2</voice> <type>quarter</type> <staff>2</staff> </note> <note> <rest/> <duration>1</duration> <voice>2</voice> <type>quarter</type> <staff>2</staff> </note> <note> <rest/> <duration>1</duration> <voice>2</voice> <type>quarter</type> <staff>2</staff> </note> <barline location="right"> <bar-style>light-heavy</bar-style> </barline> <sound tempo="80"/> </measure> </part> </score-partwise>'
              }
    r = requests.post('https://api.flat.io/v2/scores', data=json.dumps(payload), headers=headers)
    data = r.json()
    print("DEBUG r", r)
    print("DEBUG data", data)

    # Open New Score
    flask.session["scoreid"] = data["id"]
    return redirect("/")

@batchords.app.route('/chooseScore', methods=['GET', 'POST'])
def chooseScore():
    # Verify access token
    if "access_token" not in flask.session:
        return redirect("/start")
    access_token = "Bearer " + flask.session["access_token"]
    headers = {'Authorization': access_token}

    scoreid = flask.request.args.get('scoreid')
    flask.session["scoreid"] = scoreid
    return redirect("/")

@batchords.app.route('/home', methods=['GET', 'POST'])
def home():
    """Display home page to create a new score or open an existing one."""
    context = {}

    # Verify access token
    if "access_token" not in flask.session:
        return redirect("/start")
    access_token = "Bearer " + flask.session["access_token"]
    headers = {'Authorization': access_token}

    # Get user id
    r = requests.get('https://api.flat.io/v2/me', headers=headers)
    data = r.json()
    # print("r",r)
    # print("data",data)
    userid = data["id"]
    # print("userid", userid)
    context["name"] = data["printableName"]
    context["username"] = data["username"]
    context["user_img"] = data["picture"]
    context["user_url"] = data["htmlUrl"]

    # Get user's scores
    url = "https://api.flat.io/v2/users/" + userid + "/scores"
    r = requests.get(url, headers=headers)
    data=r.json()
    #print("r",r)
    #print("data",data)

    context["scores"] = data
    context["score_imgs"] = []

    for score in context["scores"]:
        url = "https://api.flat.io/v2/scores/" + score["id"] + "/revisions/last/thumbnail.png"
        filepath = os.path.join(os.getcwd(), "var/uploads/", (score["id"] + ".png"))
        filename = score["id"] + ".png"
        print ("DEBUG", os.getcwd())
        print("DEBUG",filepath)
        context["score_imgs"].append(filename)
        r = requests.get(url, headers=headers)
        fileout = open(filepath, 'wb')
        fileout.write(r.content)
        fileout.close()

    # TODO Get thumbnail of each score
    #for score in context["scores"]:
        # url = "https://api.flat.io/v2/scores/" + score["id"] + "/revisions/last/thumbnail.png"
        # r = requests.get(url, headers=headers)
        # print(r.content)

    return flask.render_template("home.html", **context)
