"""Utility functions."""
import flask
import batchords


def abort_response(message, status_code):
    """Make appropriate abort response."""
    context = {}
    context['message'] = message
    context['status_code'] = status_code
    return flask.jsonify(**context), status_code


@batchords.app.errorhandler(404)
def page_not_found(*e):
    """Return page not found response."""
    # print(e)
    return abort_response("Not Found", 404)