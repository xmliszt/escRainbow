import requests

if __name__ == '__main__':
    response = requests.get("http://127.0.0.1:5000/")
    print(response.content)  # this returns the html file behind
    print(response.request)  # this shows what HTTP method we are using
    print(response.cookies)  # this shows any cookies if have any
    print(response.elapsed)  # this shows how long it takes to get the response
    print(response.headers)  # this shows the header of the response
    print(response.history)  # this shows the history of the response

    response_post = requests.post("http://127.0.0.1:5000/")
    print(response_post.headers)

    response_json = requests.get("http://127.0.0.1:5000/json")
    print(response_json.json())

    # Practice!
    # send a request to https://en.wikipedia.org/wiki/Python
    # find out the 'Content-language' in the headers
    # find out the 'GeoIP' form the cookies
    response_python = None
