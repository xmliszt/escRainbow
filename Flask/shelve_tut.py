from flask import Flask, render_template, flash, request, redirect, Response
import shelve

# Lesson Objectives:
# 1: understand how shelve works, how to implement shelve
# 2: table constructions using jinja2
# 3: flask to input external static files
# 4: in HTML modify style and scripts, override styles
# 5: how to use bootstrap
# 6: download csv as Response

# HW: implement delete button near each entry in the table
# HW: create a new page "update item details" that allow user to
# select from the list and modify 'name', 'price', 'unit', 'quantity in stock'

# a simple user management system that takes in new user signup
# and display all the users currently in the system

# additional practice: handlers for deleting a user and check a user

app = Flask(__name__)
app.config['SECRET_KEY'] = "Shelve Tutorial"


@app.route('/')
def index():
    return render_template('shelve.html')


@app.route('/add', methods=['GET', 'POST'])
def add_item():
    if request.method == "POST":
        item_id = request.form['item_id']
        item_name = request.form['item_name']
        item_price = request.form['item_price']
        item_stock = request.form['item_stock']
        item_unit = request.form['item_unit']

        # put item into our shelve database
        with shelve.open('mydb', 'c') as db:
            db[item_id] = {
                'name': item_name,
                'price': item_price,
                'stock': item_stock,
                'unit': item_unit
            }
            db.close()

        flash('Item added successfully', 'item_addition')
        return redirect('/')
    return render_template('shelve_add.html')


@app.route('/display')
def display_items():
    with shelve.open('mydb', 'c') as db:
        return render_template('display_item.html', mydb=db)     # pass the db dictionary into HTML


# download CSV handler
@app.route('/display/database.csv')
def download_csv():
    with shelve.open('mydb', 'c') as db:
        csv_string = ""
        for s in build_csv_string(db):      # get all the return values from the helper function
            csv_string += s                 # build up the csv string
        db.close()
        return Response(csv_string, mimetype='text/csv')


# define a helper function that build up the csv string while looping through each entry in your shelve
def build_csv_string(db):
    yield "ID, NAME, PRICE, CURRENCY, UNIT, IN STOCK QUANTITY\n"
    for item_id in db:
        csv_string = f"{item_id}, {db[item_id]['name']}, {db[item_id]['price']}, SGD, {db[item_id]['unit']}, {db[item_id]['stock']}\n"
        yield csv_string


if __name__ == '__main__':

    app.run(debug=True)