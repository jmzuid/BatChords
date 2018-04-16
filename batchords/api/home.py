@batchords.app.route('/api/v1/home', methods=["GET"])
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

    # TODO Get thumbnail of each score
    #for score in context["scores"]:
        # url = "https://api.flat.io/v2/scores/" + score["id"] + "/revisions/last/thumbnail.png"
        # r = requests.get(url, headers=headers)
        # print(r.content)

    # TODO jsonify this and return it to a react page. mwahaha
    # TODO shift this entire page into the api folder. bc there still
    # needs to be a /home endpoint page in this directory so...the dictionary
    # will just become a bit more empty now

    return flask.jsonify(**context)
