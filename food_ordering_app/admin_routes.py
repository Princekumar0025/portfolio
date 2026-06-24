from flask import Blueprint, request, render_template, jsonify, session
import mysql.connector
import os

admin_bp = Blueprint('admin', __name__, url_prefix='/admin')

DB_CONFIG = {
    'host': os.getenv('DB_HOST', 'localhost'),
    'user': os.getenv('DB_USER', 'root'),
    'password': os.getenv('DB_PASSWORD', '@prince'),
    'database': os.getenv('DB_NAME', 'food_modern')
}

def get_db_connection():
    return mysql.connector.connect(**DB_CONFIG)

def is_admin():
    # RBAC constraint for staff and admins only
    return session.get('logged_in_employee') is not None

@admin_bp.route('/<form_name>', methods=['GET'])
def render_admin_form(form_name):
    if not is_admin():
        return "Unauthorized", 401
    valid_forms = ['add_customer', 'add_employee', 'add_food', 'view_records']
    if form_name not in valid_forms:
        return "Not found", 404
    return render_template('admin.html', form_name=form_name)

@admin_bp.route('/add_customer_api', methods=['POST'])
def add_customer_api():
    if not is_admin(): return jsonify(success=False, message="Unauthorized")
    try:
        conn = get_db_connection()
        cursor = conn.cursor()
        sqltxt = "INSERT INTO Customer (c_id, C_name, cphone, payment, pstatus, email, orderid, date) VALUES (%s, %s, %s, %s, %s, %s, %s, %s)"
        vals = (request.form['c_id'], request.form['name'], request.form['cphone'], request.form['payment'], request.form['pstatus'], request.form['email'], request.form['orderid'], request.form['date'])
        cursor.execute(sqltxt, vals)
        conn.commit()
        cursor.close()
        conn.close()
        return jsonify(success=True, message="Customer added successfully.")
    except Exception as e:
        return jsonify(success=False, message=f"Error: {e}")

@admin_bp.route('/add_employee_api', methods=['POST'])
def add_employee_api():
    if not is_admin(): return jsonify(success=False, message="Unauthorized")
    try:
        conn = get_db_connection()
        cursor = conn.cursor()
        sqltxt = "INSERT INTO Employee (Emp_id, ename, emp_g, eage, emp_phone, pwd) VALUES (%s, %s, %s, %s, %s, %s)"
        vals = (request.form['Emp_id'], request.form['ename'], request.form['emp_g'], request.form['eage'], request.form['emp_phone'], request.form['pwd'])
        cursor.execute(sqltxt, vals)
        conn.commit()
        cursor.close()
        conn.close()
        return jsonify(success=True, message="Employee added successfully.")
    except Exception as e:
        return jsonify(success=False, message=f"Error: {e}")

@admin_bp.route('/add_food_api', methods=['POST'])
def add_food_api():
    if not is_admin(): return jsonify(success=False, message="Unauthorized")
    try:
        conn = get_db_connection()
        cursor = conn.cursor()
        # To make it compatible with the new front-end as well as old back-end, we insert to both
        sqltxt_old = "INSERT INTO Food (Food_id, Foodname, Food_size, prize) VALUES (%s, %s, %s, %s)"
        vals_old = (request.form['Food_id'], request.form['Foodname'], request.form['Food_size'], request.form['prize'])
        cursor.execute(sqltxt_old, vals_old)
        
        # Insert to new food_options as well so it shows on UI
        sqltxt_new = "INSERT INTO food_options (name, price, rating, prep_time, tags, quality, img_url) VALUES (%s, %s, 4.5, 30, 'New • Custom', 'Custom added food', 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?q=80&w=800')"
        vals_new = (request.form['Foodname'], request.form['prize'])
        cursor.execute(sqltxt_new, vals_new)

        conn.commit()
        cursor.close()
        conn.close()
        return jsonify(success=True, message="Food item added successfully.")
    except Exception as e:
        return jsonify(success=False, message=f"Error: {e}")

@admin_bp.route('/view_records_api', methods=['POST'])
def view_records_api():
    if not is_admin(): return jsonify(success=False, message="Unauthorized")
    try:
        conn = get_db_connection()
        cursor = conn.cursor(dictionary=True)
        ch = request.form.get('view_choice')
        val = request.form.get('search_value')
        
        if ch == 'employee_id':
            cursor.execute("SELECT * FROM Employee WHERE Emp_id = %s", (val,))
        elif ch == 'customer_name':
            cursor.execute("SELECT * FROM Customer WHERE C_name = %s", (val,))
        elif ch == 'all_foods':
            cursor.execute("SELECT * FROM Food")
        elif ch == 'orders_by_food_id':
            cursor.execute("SELECT * FROM order_items WHERE food_id = %s", (val,))
        else:
            return jsonify(success=False, message="Invalid choice")
            
        results = cursor.fetchall()
        cursor.close()
        conn.close()
        return jsonify(success=True, results=results)
    except Exception as e:
        return jsonify(success=False, message=f"Error: {e}")
