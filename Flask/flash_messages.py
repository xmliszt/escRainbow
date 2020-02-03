from flask import Flask, render_template, flash

app = Flask(__name__)


@app.route('/')
def index():
    flash("Success1", "success")
    flash("Success2", "success")
    flash("Success3", "success")
    flash("Success4", "success")
    flash("Success5", "success")
    flash("ERROR1", "error")
    flash("ERROR2", "error")
    flash("ERROR3", "error")
    flash("ERROR4", "error")
    flash("ERROR5", "error")
    return render_template('flash.html')


if __name__ == '__main__':
    app.config['SECRET_KEY'] = "secret key"
    app.run(debug=True)