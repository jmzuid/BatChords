"""REST API for metadata."""
import flask
import batchords
import json
import os

@batchords.app.route('/api/pads/<pads_file>', methods=["GET"])
def get_pads(pads_file):
    """Return a list of resource URLs."""
    context = {}

    cur_dir = os.path.dirname(__file__)
    rel_path = "pads/{}.json".format(pads_file)
    abs_file_path = os.path.join(cur_dir, rel_path)

    pads_info = json.load(open(abs_file_path))
    # with open('pads_info.json', 'r') as f:
    # 	pads_info = json.load(f)

    context['url'] = flask.request.path
    context['pads_info'] = pads_info
    return flask.jsonify(**context)
