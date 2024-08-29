#!/usr/bin/env python3
"""Basic flask app"""
from flask import Flask, render_template
from flask_babel import Babel


class Config:
    """Config class"""
    LANGUAGES = ["en", "fr"]
    BABEL_DEFAULT_LOCALE = "en"
    BABEL_DEFAULT_TIMEZONE = "UTC"


app = Flask(__name__)
app.config.from_object(Config)
babel = Babel(app)


def get_locale():
    """Return locale based on user preference"""
    return app.config['BABEL_DEFAULT_LOCALE']


@app.route('/')
def home():
    """Home page"""
    return render_template('1-index.html')
