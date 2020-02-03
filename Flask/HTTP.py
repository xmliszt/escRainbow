# Flask framework use HTTP request and response methods to transfer data
from flask import Flask, render_template, request, Response, jsonify
from datetime import datetime

# HTTP GET and POST methods by Flask

# Let's look at a sample HTTP response in Flask
# Examine the body, headers, status code, content type

# create your app instance
app = Flask(__name__)

# the Response method serves as a template for you to build your response
# of course you can use other methods to build your response
# response can be many types
# typically, a string, a JSON string, a file type as string line by line, etc.


@app.route('/', methods=['GET', 'POST'])
def index():
    if request.method == "POST":
        print(request.args)
        rsp = Response("Hello World", status=200)  # see the change of status code from the debug console
        rsp.headers['FOOD'] = "apple"
        rsp.headers['DRINK'] = "beer"
        print("You are using a POST method!!!")
        return rsp
    else:
        return render_template('http.html')


@app.route('/json')
def json():
    my_dict = {
        "a": True,
        "b": "fun",
        "c": 100,
        "d": None,
        "e": datetime(2019,11,20)
    }
    return jsonify(my_dict)


if __name__ == '__main__':
    app.run(debug=True)