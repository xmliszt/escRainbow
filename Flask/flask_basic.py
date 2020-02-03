# TOPICS: render_template, request, flash messages, redirect to location, getting url, variable passing

from flask import Flask, render_template, request, flash, redirect, url_for

app = Flask(__name__)
app.config['SECRET_KEY'] = "some secret key random characters !(@#@!)!@"  # give your app a secret key
# set both get and post methods, when a form is submitted
# a POST request is sent as some values are sent together with the request
# flask handle the two different requests by simply doing a if-else statement
@app.route('/', methods=['GET', 'POST'])
def basic():
    if request.method == "POST":
        username = request.form['username']
        password = request.form['password']
        message1 = f"Username: {username}"
        message2 = f"Password: {password}"
        name = "DAVID"
        flash(message1)      # flash the message to be handled when the page is loaded
        flash(message2)      # you can flash multiple messages and get them in one go using jinja framework in html
        return redirect(url_for("user_page", user=name))    # variable is passed in to be rendered dynamically in the webpage
    flash("Hello! Good day!")
    return render_template('basic.html')


@app.route('/user-<user>')
def user_page(user):
    return render_template('user.html', name=user)


if __name__ == '__main__':
    app.run(debug=True, host="0.0.0.0")