"""REST API for metadata."""
import flask
import batchords


@batchords.app.route('/api/v1/', methods=["GET"])
def get_api():
    """Return a list of resource URLs."""
    context = {}
    # if "username" not in flask.session:
    #     context['message'] = 'Forbidden'
    #     context['status_code'] = 403
    #     return flask.jsonify(**context), 403
    #     # flask.abort(403)

    context['url'] = flask.request.path
    return flask.jsonify(**context)
