import os
import sys
import subprocess

# --- AUTO INSTALLER ---
# Since the user might launch this without `pip install -r requirements.txt`
try:
    import flask
    import flask_session
    import mysql.connector
    import dotenv
    import stripe
    import flask_mail
    import twilio
except ImportError as e:
    print(f"Missing dependency detected: {e}.")
    print("Auto-installing dependencies...")
    try:
        subprocess.check_call([sys.executable, "-m", "pip", "install", "flask", "flask-session", "mysql-connector-python", "python-dotenv", "stripe", "flask-mail", "twilio"])
        print("Dependencies installed successfully! Restarting Swifty Server...")
        os.execv(sys.executable, [sys.executable] + sys.argv)
    except Exception as install_err:
        input(f"Failed to automatically install packages! Error: {install_err}. Press Enter to exit...")
        sys.exit(1)

from flask import Flask, request, render_template, jsonify, session, redirect, url_for
from flask_session import Session
import mysql.connector
from datetime import datetime, timedelta
import random
import string
import os
from dotenv import load_dotenv
load_dotenv()

import stripe
from flask_mail import Mail, Message
from twilio.rest import Client

from admin_routes import admin_bp

app = Flask(__name__)
app.config['SECRET_KEY'] = os.getenv('SECRET_KEY', 'super_secret_key_swifty')
# Configure Flask-Session to use filesystem
app.config['SESSION_TYPE'] = 'filesystem'
Session(app)

# Mail Configuration
app.config['MAIL_SERVER'] = os.getenv('MAIL_SERVER', 'smtp.gmail.com')
app.config['MAIL_PORT'] = int(os.getenv('MAIL_PORT', 587))
app.config['MAIL_USE_TLS'] = os.getenv('MAIL_USE_TLS', 'True') == 'True'
app.config['MAIL_USERNAME'] = os.getenv('MAIL_USERNAME', '')
app.config['MAIL_PASSWORD'] = os.getenv('MAIL_PASSWORD', '')
app.config['MAIL_DEFAULT_SENDER'] = os.getenv('MAIL_DEFAULT_SENDER', 'noreply@swifty.com')
mail = Mail(app)

# Stripe Configuration
stripe.api_key = os.getenv('STRIPE_SECRET_KEY', 'sk_test_demo123')

# Twilio Configuration
TWILIO_ACCOUNT_SID = os.getenv('TWILIO_ACCOUNT_SID', '')
TWILIO_AUTH_TOKEN = os.getenv('TWILIO_AUTH_TOKEN', '')
TWILIO_PHONE_NUMBER = os.getenv('TWILIO_PHONE_NUMBER', '')

if TWILIO_ACCOUNT_SID and TWILIO_AUTH_TOKEN:
    twilio_client = Client(TWILIO_ACCOUNT_SID, TWILIO_AUTH_TOKEN)
else:
    twilio_client = None

app.register_blueprint(admin_bp)

DB_CONFIG = {
    'host': os.getenv('DB_HOST', 'localhost'),
    'user': os.getenv('DB_USER', 'root'),
    'password': os.getenv('DB_PASSWORD', '@prince'),
    'database': os.getenv('DB_NAME', 'food_modern')
}

def get_db_connection():
    return mysql.connector.connect(**DB_CONFIG)

# In-memory OTP store (in production, use Redis or DB with expiry)
otp_store = {}

@app.context_processor
def inject_globals():
    # Inject background images that the template can use randomly
    bg_images = [
        'https://images.unsplash.com/photo-1544025162-d76694265947?q=80&w=1800&auto=format&fit=crop',
        'https://images.unsplash.com/photo-1542838139-4824707172c3?q=80&w=1800&auto=format&fit=crop',
        'https://images.unsplash.com/photo-1540321288344-f8b8a5b28d54?q=80&w=1800&auto=format&fit=crop',
        'https://images.unsplash.com/photo-1518843875463-c774431536b6?q=80&w=1800&auto=format&fit=crop',
        'https://images.unsplash.com/photo-1506368249639-73a05d6f642e?q=80&w=1800&auto=format&fit=crop'
    ]
    return dict(random_bg=random.choice(bg_images))


# --- Page Routes ---

@app.route('/')
def home():
    try:
        location = session.get('location', 'Koramangala')
        
        conn = get_db_connection()
        cursor = conn.cursor(dictionary=True)
        cursor.execute("SELECT * FROM restaurants WHERE location = %s", (location,))
        restaurants = cursor.fetchall()
        
        location_not_found = False
        
        # If no restaurants exist in that location, just show all as a fallback
        if not restaurants:
            location_not_found = True
            cursor.execute("SELECT * FROM restaurants")
            restaurants = cursor.fetchall()
        cursor.close()
        conn.close()
        
        # Get cart count
        cart = session.get('cart', {})
        cart_count = sum(cart.values())
        
        # Just grab some food options for the top recommendation slider
        conn = get_db_connection()
        cursor = conn.cursor(dictionary=True)
        cursor.execute("SELECT * FROM food_options LIMIT 8")
        recs = cursor.fetchall()
        cursor.close()
        conn.close()

        return render_template('home.html', is_home=True, restaurants=restaurants, top_recs=recs, cart_count=cart_count, location=location, location_not_found=location_not_found)
    except Exception as e:
        print(f"Error loading homepage: {e}")
        return "Internal Server Error", 500

@app.route('/api/set_location', methods=['POST'])
def set_location():
    data = request.json
    city = data.get('city')
    if city:
        session['location'] = city
        return jsonify(success=True)
    return jsonify(success=False)

@app.route('/restaurant/<int:res_id>')
def restaurant_page(res_id):
    try:
        conn = get_db_connection()
        cursor = conn.cursor(dictionary=True)
        
        # Fetch Restaurant Detail
        cursor.execute("SELECT * FROM restaurants WHERE id = %s", (res_id,))
        restaurant = cursor.fetchone()
        
        if not restaurant:
            return "Restaurant not found", 404
            
        # Fetch Menu for this restaurant
        cursor.execute("SELECT * FROM food_options WHERE restaurant_id = %s", (res_id,))
        menu_items = cursor.fetchall()
        cursor.close()
        conn.close()
        
        cart = session.get('cart', {})
        cart_count = sum(cart.values())
        
        return render_template('restaurant.html', is_home=True, restaurant=restaurant, menu_items=menu_items, cart_count=cart_count)
    except Exception as e:
        print(f"Error loading restaurant page: {e}")
        return "Internal Server Error", 500

@app.route('/cart')
def cart_page():
    cart = session.get('cart', {})
    cart_items = []
    total_price = 0
    ordered_tags = set()
    
    if cart:
        try:
            conn = get_db_connection()
            cursor = conn.cursor(dictionary=True)
            for food_id_str, qty in cart.items():
                cursor.execute("SELECT * FROM food_options WHERE id = %s", (food_id_str,))
                item = cursor.fetchone()
                if item:
                    item_total = float(item['price']) * qty
                    total_price += item_total
                    cart_items.append({
                        'id': item['id'],
                        'name': item['name'],
                        'quantity': qty,
                        'price': item['price'],
                        'total': item_total,
                        'img_url': item.get('img_url', '')
                    })
                    if item['tags']:
                        ordered_tags.update(item['tags'].split(' • '))
            
            # Recommendations
            top_recs = []
            if ordered_tags:
                placeholders = ', '.join(['%s'] * len(ordered_tags))
                query = "SELECT * FROM food_options WHERE id NOT IN ({})".format(
                    ','.join(['%s'] * len(cart.keys()))
                )
                cursor.execute(query, tuple(cart.keys()))
                all_others = cursor.fetchall()
                # filter in python for flexibility with tags string
                matching = []
                for f in all_others:
                    f_tags = set(f['tags'].split(' • '))
                    if f_tags.intersection(ordered_tags):
                        matching.append(f)
                
                # Sort by rating and take top 3
                matching.sort(key=lambda x: x['rating'], reverse=True)
                top_recs = matching[:3]

            cursor.close()
            conn.close()
        except Exception as e:
            print(f"Cart Error: {e}")

    return render_template('cart.html', is_home=False, cart_items=cart_items, 
                           total_price=total_price, top_recs=top_recs, bg_image=random.choice(['https://images.unsplash.com/photo-1544025162-d76694265947?q=80&w=1800&auto=format&fit=crop']))

@app.route('/my_orders')
def my_orders():
    email = session.get('logged_in_user')
    if not email:
        return redirect(url_for('home'))
        
    orders = []
    try:
        conn = get_db_connection()
        cursor = conn.cursor(dictionary=True)
        cursor.execute("SELECT * FROM orders WHERE user_email = %s ORDER BY created_at DESC", (email,))
        raw_orders = cursor.fetchall()
        
        for ro in raw_orders:
            cursor.execute('''
                SELECT oi.quantity, oi.price_at_time, f.name 
                FROM order_items oi
                JOIN food_options f ON oi.food_id = f.id
                WHERE oi.order_id = %s
            ''', (ro['id'],))
            items = cursor.fetchall()
            ro['items'] = items
            orders.append(ro)
            
        cursor.close()
        conn.close()
    except Exception as e:
        print(f"My Orders Error: {e}")

    return render_template('my_orders.html', is_home=False, orders=orders, bg_image=random.choice(['https://images.unsplash.com/photo-1506368249639-73a05d6f642e?q=80&w=1800&auto=format&fit=crop']))


# --- Authentication APIs ---

@app.route('/api/auth/send_otp', methods=['POST'])
def send_otp():
    data = request.json
    contact_id = data.get('email', '') # Handles both email and phone
    role = data.get('role', 'customer')
    if not contact_id:
        return jsonify(success=False, message="Email/Phone is required.")
    
    otp = ''.join(random.choices(string.digits, k=6))
    otp_store[contact_id] = {'otp': otp, 'timestamp': datetime.now(), 'role': role}
    
    # 1. Phone Number SMS Logic (Twilio)
    if not '@' in contact_id:
        # Standardize for Twilio format (assuming India +91 if purely 10 digits as a fallback)
        formatted_phone = contact_id if contact_id.startswith('+') else f"+91{contact_id}"
        
        if twilio_client and TWILIO_PHONE_NUMBER:
            try:
                twilio_client.messages.create(
                    body=f"Your Swifty secure login code is: {otp}",
                    from_=TWILIO_PHONE_NUMBER,
                    to=formatted_phone
                )
                return jsonify(success=True, message="OTP sent securely to your mobile number.")
            except Exception as e:
                print(f"Twilio SMS Error: {e}")
                return jsonify(success=True, message=f"SMS Gateway offline. (Demo OTP fallback: {otp})")
        else:
            return jsonify(success=True, message=f"Mobile OTP generated. (Demo OTP: {otp})")
            
    # 2. Gmail / Email Logic (Flask-Mail)
    if app.config['MAIL_USERNAME']:
        try:
            msg = Message("Your Swifty Login OTP", recipients=[contact_id])
            msg.body = f"Your one-time password is: {otp}. It is valid for 5 minutes."
            mail.send(msg)
            return jsonify(success=True, message="OTP sent securely to your email.")
        except Exception as e:
            print(f"Mail Error: {e}")
            return jsonify(success=True, message=f"Mail error. (Demo OTP fallback: {otp})")
    else:
        return jsonify(success=True, message=f"OTP sent. (Demo OTP: {otp})")

@app.route('/api/auth/verify_otp', methods=['POST'])
def verify_otp():
    data = request.json
    contact_id = data.get('email')
    otp = data.get('otp')
    
    record = otp_store.get(contact_id)
    if not record or record['otp'] != otp:
        return jsonify(success=False, message="Invalid OTP. Please try again.")
        
    role = record.get('role', 'customer')
    if datetime.now() - record['timestamp'] > timedelta(minutes=5):
        del otp_store[contact_id]
        return jsonify(success=False, message="OTP has expired.")
        
    del otp_store[contact_id]
    
    # Register user in DB if not exists (we use contact_id for the email column)
    try:
        conn = get_db_connection()
        cursor = conn.cursor()
        cursor.execute("INSERT IGNORE INTO users (email) VALUES (%s)", (contact_id,))
        conn.commit()
        cursor.close()
        conn.close()
    except Exception as e:
        print(f"Login DB Error: {e}")
        
    if role == 'employee':
        session['logged_in_employee'] = contact_id
        session.pop('logged_in_user', None) # Cannot be both at once
    else:
        session['logged_in_user'] = contact_id
        session.pop('logged_in_employee', None)
        
    return jsonify(success=True, message=f"Login successful as {role}.")

@app.route('/api/auth/status')
def auth_status():
    if 'logged_in_employee' in session:
        return jsonify(logged_in=True, user=session.get('logged_in_employee'), role='employee')
    return jsonify(logged_in='logged_in_user' in session, user=session.get('logged_in_user'), role='customer')

@app.route('/logout')
def logout():
    session.pop('logged_in_user', None)
    session.pop('logged_in_employee', None)
    return redirect(url_for('home'))


# --- Cart APIs ---

@app.route('/api/cart/add', methods=['POST'])
def add_to_cart_api():
    data = request.json
    food_id = str(data.get('food_id'))
    quantity = int(data.get('quantity', 1))
    
    cart = session.get('cart', {})
    cart[food_id] = cart.get(food_id, 0) + quantity
    session['cart'] = cart
    
    return jsonify(success=True, message="Item added to cart!")

@app.route('/api/cart')
def get_cart_count():
    cart = session.get('cart', {})
    return jsonify(count=sum(cart.values()))


# --- Order & Payment APIs ---

@app.route('/api/create-checkout-session', methods=['POST'])
def create_checkout_session():
    email = session.get('logged_in_user')
    cart = session.get('cart', {})
    address = request.form.get('address')
    
    if not email:
        return "Please log in first", 401
    if not cart or not address:
        return "Cart is empty or address missing", 400
        
    session['pending_address'] = address # Store temporarily
    
    try:
        conn = get_db_connection()
        cursor = conn.cursor(dictionary=True)
        
        line_items = []
        for food_id_str, qty in cart.items():
            cursor.execute("SELECT name, price FROM food_options WHERE id = %s", (food_id_str,))
            item = cursor.fetchone()
            if item:
                line_items.append({
                    'price_data': {
                        'currency': 'inr',
                        'product_data': {'name': item['name']},
                        'unit_amount': int(float(item['price']) * 100), # Stripe expects strictly integer cents/paise
                    },
                    'quantity': qty,
                })
        cursor.close()
        conn.close()

        # If dummy Stripe key is used, skip Stripe and place order directly
        if stripe.api_key == 'sk_test_demo123' or not stripe.api_key:
            return redirect(url_for('place_order_success'))

        # Create Stripe Checkout Session
        checkout_session = stripe.checkout.Session.create(
            payment_method_types=['card'],
            customer_email=email,
            line_items=line_items,
            mode='payment',
            success_url=request.host_url + 'place_order_success',
            cancel_url=request.host_url + 'cart',
        )
        return redirect(checkout_session.url, code=303)
        
    except Exception as e:
        print(f"Stripe Error: {e}")
        return str(e), 500

@app.route('/place_order_success', methods=['GET'])
def place_order_success():
    email = session.get('logged_in_user')
    cart = session.get('cart', {})
    address = session.get('pending_address', 'Stored Address')
    
    if not email or not cart:
        return redirect(url_for('home'))
        
    try:
        conn = get_db_connection()
        cursor = conn.cursor(dictionary=True)
        
        total_price = 0
        order_details = []
        for food_id_str, qty in cart.items():
            cursor.execute("SELECT price FROM food_options WHERE id = %s", (food_id_str,))
            item = cursor.fetchone()
            if item:
                price = item['price']
                total_price += float(price) * qty
                order_details.append((food_id_str, qty, price))
                
        tracking_id = ''.join(random.choices(string.ascii_uppercase + string.digits, k=10))
        cursor.execute('''
            INSERT INTO orders (tracking_id, user_email, address, total_price)
            VALUES (%s, %s, %s, %s)
        ''', (tracking_id, email, address, total_price))
        order_id = cursor.lastrowid
        
        for fd_id, qty, price in order_details:
            cursor.execute('''
                INSERT INTO order_items (order_id, food_id, quantity, price_at_time)
                VALUES (%s, %s, %s, %s)
            ''', (order_id, fd_id, qty, price))
            
        conn.commit()
        cursor.close()
        conn.close()
        
        session.pop('cart', None)
        session.pop('pending_address', None)
        
        return redirect(url_for('my_orders'))
    except Exception as e:
        print(f"Order Fulfillment Error: {e}")
        return "Failed to place order after payment", 500

@app.route('/api/order_status/<tracking_id>')
def get_order_status(tracking_id):
    try:
        conn = get_db_connection()
        cursor = conn.cursor(dictionary=True)
        cursor.execute("SELECT status FROM orders WHERE tracking_id = %s", (tracking_id,))
        order = cursor.fetchone()
        cursor.close()
        conn.close()
        
        if order:
            return jsonify(success=True, status=order['status'])
    except Exception as e:
        pass
    return jsonify(success=False, message="Order not found")

@app.route('/waitlist')
def waitlist_page():
    return render_template('waitlist.html')

@app.route('/ai-agent')
def ai_agent_page():
    return render_template('ai_agent.html')

if __name__ == '__main__':
    app.run(debug=True, port=5000)
