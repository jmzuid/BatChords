"""
BatChords tutorial view.

URLs include:
/tutorial
"""
import flask
import batchords
import arrow

@batchords.app.route('/tutorial', methods=['GET', 'POST'])
def tutorial():
    """Display / route."""
    context = {}

    return flask.render_template("tutorial.html", **context)