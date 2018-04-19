"""Importing each BatChords page."""
from batchords.views.index import show_index

from batchords.views.tutorial import tutorial

from batchords.views.login import login, \
                                  start, \
                                  logout

from batchords.views.home import home, \
                                chooseScore, \
                                createScore, \
                                get_upload

from batchords.views.save import save