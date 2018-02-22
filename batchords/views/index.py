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
    context = {}

    if flask.request.method == 'POST':
        if 'save' in flask.request.form:
            print("save")

    return flask.render_template("index.html", **context)