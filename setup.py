"""Insta485 python package configuration."""

from setuptools import setup

setup(
    name='batchords',
    version='0.1.0',
    packages=['batchords'],
    include_package_data=True,
    install_requires=[
        'flask',
        'html5validator',
        'pycodestyle',
        'pydocstyle',
        'pylint',
        'nodeenv',
        'sh',
        'Flask-Testing',
        'selenium',
        'requests',
        'arrow'
    ],
)
