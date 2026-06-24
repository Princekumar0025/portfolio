import mysql.connector
from mock_data import food_items_full
import os
import random
from dotenv import load_dotenv

load_dotenv()

DB_CONFIG = {
    'host': os.getenv('DB_HOST', 'localhost'),
    'user': os.getenv('DB_USER', 'root'), 
    'password': os.getenv('DB_PASSWORD', '@prince'), 
    'database': os.getenv('DB_NAME', 'food_modern')
}

mock_restaurants = [
    {"name": "Behrouz Biryani", "rating": 4.5, "time": "35-40 min", "categories": "Mughlai, Biryani", "offer": "60% OFF", "location": "Koramangala", "image": "https://images.unsplash.com/photo-1544025162-d76694265947?q=80&w=600&fit=crop"},
    {"name": "Burger King", "rating": 4.2, "time": "25-30 min", "categories": "Burgers, American", "offer": "₹120 OFF", "location": "Indiranagar", "image": "https://images.unsplash.com/photo-1550547660-d9450f859349?q=80&w=600&fit=crop"},
    {"name": "Domino's Pizza", "rating": 4.4, "time": "30-35 min", "categories": "Pizzas, Fast Food", "offer": "Free Delivery", "location": "Salt Lake", "image": "https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?q=80&w=600&fit=crop"},
    {"name": "La Pino'z Pizza", "rating": 4.1, "time": "40-45 min", "categories": "Pizzas, Italian", "offer": "BOGO", "location": "Koramangala", "image": "https://images.unsplash.com/photo-1628840042765-356cda07504e?q=80&w=600&fit=crop"},
    {"name": "KFC", "rating": 4.0, "time": "20-30 min", "categories": "Fried Chicken, Fast Food", "offer": "20% OFF", "location": "Bandra", "image": "https://images.unsplash.com/photo-1513639776629-7b61b0ac49cb?q=80&w=600&fit=crop"}
]

def setup_database():
    try:
        print(f"Connecting to MySQL server at {DB_CONFIG['host']}...")
        db_server = mysql.connector.connect(
            host=DB_CONFIG['host'],
            user=DB_CONFIG['user'],
            password=DB_CONFIG['password']
        )
        cursor = db_server.cursor()
        
        db_name = DB_CONFIG['database']
        print(f"Dropping and Recreating database {db_name} for Advanced Zomato features...")
        cursor.execute(f"DROP DATABASE IF EXISTS {db_name}")
        cursor.execute(f"CREATE DATABASE {db_name}")
        db_server.close()

        # Connect to the specific database
        db = mysql.connector.connect(**DB_CONFIG)
        cursor = db.cursor()

        print("Creating tables...")
        # 1. Users Table
        cursor.execute('''
            CREATE TABLE users (
                id INT AUTO_INCREMENT PRIMARY KEY,
                email VARCHAR(255) UNIQUE NOT NULL,
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
            )
        ''')

        # 2. Restaurants Table [NEW]
        cursor.execute('''
            CREATE TABLE restaurants (
                id INT AUTO_INCREMENT PRIMARY KEY,
                name VARCHAR(255) NOT NULL,
                rating FLOAT,
                prep_time VARCHAR(50),
                categories VARCHAR(255),
                offer VARCHAR(100),
                location VARCHAR(100) DEFAULT 'Koramangala',
                img_url VARCHAR(500)
            )
        ''')

        # 3. Food Options (Now linked to Restaurants)
        cursor.execute('''
            CREATE TABLE food_options (
                id INT AUTO_INCREMENT PRIMARY KEY,
                restaurant_id INT NOT NULL,
                name VARCHAR(255) NOT NULL,
                tags VARCHAR(255),
                rating FLOAT,
                prep_time INT,
                price DECIMAL(10, 2),
                img_url VARCHAR(500),
                quality TEXT,
                FOREIGN KEY (restaurant_id) REFERENCES restaurants(id) ON DELETE CASCADE
            )
        ''')

        # 4. Orders Table
        cursor.execute('''
            CREATE TABLE orders (
                id INT AUTO_INCREMENT PRIMARY KEY,
                tracking_id VARCHAR(50) UNIQUE NOT NULL,
                user_email VARCHAR(255) NOT NULL,
                address TEXT NOT NULL,
                total_price DECIMAL(10, 2) NOT NULL,
                status VARCHAR(50) DEFAULT 'Order Placed',
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
            )
        ''')

        # 5. Order Items Table
        cursor.execute('''
            CREATE TABLE order_items (
                id INT AUTO_INCREMENT PRIMARY KEY,
                order_id INT NOT NULL,
                food_id INT NOT NULL,
                quantity INT DEFAULT 1,
                price_at_time DECIMAL(10, 2) NOT NULL,
                FOREIGN KEY (order_id) REFERENCES orders(id) ON DELETE CASCADE,
                FOREIGN KEY (food_id) REFERENCES food_options(id)
            )
        ''')

        # Admin Tables
        cursor.execute('CREATE TABLE Customer (c_id INT PRIMARY KEY, C_name VARCHAR(255), cphone VARCHAR(50), payment INT, pstatus VARCHAR(50), email VARCHAR(255), orderid VARCHAR(50), date DATE)')
        cursor.execute('CREATE TABLE Employee (Emp_id INT PRIMARY KEY, ename VARCHAR(255), emp_g VARCHAR(10), eage INT, emp_phone VARCHAR(50), pwd VARCHAR(255))')
        cursor.execute('CREATE TABLE Food (Food_id INT PRIMARY KEY, Foodname VARCHAR(255), Food_size VARCHAR(50), prize DECIMAL(10,2))')

        print("Seeding internal mock Restaurants...")
        for r in mock_restaurants:
            cursor.execute("""
                INSERT INTO restaurants (name, rating, prep_time, categories, offer, location, img_url)
                VALUES (%s, %s, %s, %s, %s, %s, %s)
            """, (r['name'], r['rating'], r['time'], r['categories'], r['offer'], r['location'], r['image']))
        
        db.commit()

        print("Seeding food_options and mapping them to Restaurants randomly...")
        insert_query = """
            INSERT INTO food_options (id, restaurant_id, name, tags, rating, prep_time, price, img_url, quality)
            VALUES (%s, %s, %s, %s, %s, %s, %s, %s, %s)
        """
        for item in food_items_full:
            # Assign a random restaurant ID (1 through 5) to each food item
            res_id = random.randint(1, 5)
            cursor.execute(insert_query, (
                item['id'], res_id, item['name'], item['tags'], item['rating'], 
                item['time'], item['price'], item['img'], item['quality']
            ))
        
        db.commit()
        db.close()
        print("Database setup successfully with Zomato Engine!")

    except mysql.connector.Error as err:
        print(f"Error: {err}")

if __name__ == '__main__':
    setup_database()
