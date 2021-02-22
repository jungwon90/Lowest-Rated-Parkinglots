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


@app.route('/search')
def search():
    """ Search for the poor rated parking lots and return the result """

    # API request headers
    headers = {
        'Authorization': API_KEY,
        'Content-type': 'application/json'
    }

    # Get user inputs from the form
    search_input = request.args.get('search-input')
    print(search_input)

    url = 'https://api.yelp.com/v3/businesses/search'
    query_string = {'location' : search_input, 'term': 'Parkinglot'}

    res = requests.get(url, headers=headers, params=query_string)
    parkinglots = res.json() #convert the json to pytho dictionary

    #filter data of rating 1~3
    parkinglots = parkinglots['businesses']
    print(parkinglots)
    lowest_rated_parkinglots = []

    for parkinglot in parkinglots:
        if parkinglot['rating'] <= 3:
            lowest_rated_parkinglots.append(parkinglot)
        
    
    return jsonify(lowest_rated_parkinglots)


if __name__ == "__main__":

    app.run(debug=True, host='0.0.0.0')