from flask import Flask, render_template, jsonify, request, redirect, session
import os
import sys
import secrets
import requests
import json


app = Flask(__name__)
app.secret_key = 'SECRETSECRET'
# This configuration option makes the Flask interactive debugger
# more useful (you should remove this line in production though)
app.config['PRESERVE_CONTEXT_ON_EXCEPTION'] = True

#os.environ
API_KEY = os.environ['YELP_KEY']

@app.route('/')
def homepage():
    """ Show homepage """
    
    return render_template('homepage.html')


if __name__ == "__main__":

    app.run(debug=True, host='0.0.0.0')