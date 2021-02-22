### Lowest Rated Parking Lots

### Background
At AirGarage, we replace legacy, old-school parking systems and machines with an easy-to-use, reliable way to pay for parking. 

We are therefore interested in knowing where parking is most poorly managed, so we can offer those parking lot owners a better solution.

Your goal in this challenge will be to use the Yelp API to find and display the lowest rated parking lots.


### How to run?

### Prerequisites
    - Python

### Clone the repository
```sh
$ git clone https://github.com/jungwon90/Lowest-Rated-Parkinglots.git
```
    
### Create and activate a virtual environment in the Lowest-Rated-Parkinglots directory
```sh
$ virtualenv
$ source env/bin/activate
```

### Install requirements
```sh
$ pip3 install -r requirements.txt
```

### Create a secrets.sh file to store all sensitive keys(such as API keys)
    - store Yelp API key inside secrets.sh
    example) export YELP_KEY = "put the api key"

### Activate secrets in virtual environment
```sh
$ source secrets.sh
```

If you want to check that your secret key(yelp api key in this case) is active to make sure
```sh
$ echo $YELP_KEY
```

### Run the server
```sh
$ python3 server.py
```

If you have lower version of python, replace "python3" to the version of python you use.


### Google Maps API
 You need to change the google maps api key on App.jax file to your own key