"""
BatChords index view.

URLs include:
/
"""
import flask
import batchords
import arrow

@batchords.app.route('/', methods=['GET', 'POST'])
def show_index():
    """Display / route."""

    if not "scoreid" in flask.session:
    	return redirect("/home")

    context = {}

    context["scoreid"] = flask.session["scoreid"]

    if flask.request.method == 'POST':
        if 'save' in flask.request.form:
            print("save")

    return flask.render_template("index.html", **context)