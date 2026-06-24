import mysql.connector
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

# Regional Geolocation Intelligence
REGIONS = {
    "Mumbai": {
        "cuisines": ["Street Food", "Maharashtrian", "Seafood", "Fast Food"],
        "dishes": ["Vada Pav", "Pav Bhaji", "Misal Pav", "Bombay Sandwich", "Keema Pav", "Pani Puri", "Kanda Poha", "Bombil Fry"]
    },
    "Delhi": {
        "cuisines": ["North Indian", "Mughlai", "Street Food", "Punjabi"],
        "dishes": ["Chole Bhature", "Butter Chicken", "Aloo Tikki", "Dal Makhani", "Parathas", "Momos", "Rajma Chawal", "Tandoori Chicken"]
    },
    "Bengaluru": {
        "cuisines": ["South Indian", "Cafe", "Udupi", "Andhra"],
        "dishes": ["Masala Dosa", "Filter Coffee", "Bisi Bele Bath", "Idli Vada", "Donne Biryani", "Maddur Vada", "Akki Roti", "Chow Chow Bath"]
    },
    "Kolkata": {
        "cuisines": ["Bengali", "Sweets", "Street Food", "Mughlai"],
        "dishes": ["Kathi Roll", "Rosogolla", "Mutton Biryani", "Macher Jhol", "Phuchka", "Chops", "Sandesh", "Ghugni"]
    },
    "Hyderabad": {
        "cuisines": ["Biryani", "Andhra", "Mughlai", "Irani"],
        "dishes": ["Hyderabadi Biryani", "Haleem", "Double ka Meetha", "Mirchi Ka Salan", "Irani Chai", "Lukhmi", "Qubani Ka Meetha", "Pathar ka Gosht"]
    },
    "Chennai": {
        "cuisines": ["South Indian", "Chettinad", "Street Food"],
        "dishes": ["Idli Sambar", "Medu Vada", "Chicken Chettinad", "Filter Coffee", "Pongal", "Kothu Parotta", "Mysore Pak", "Dosa"]
    },
    "Pune": {
        "cuisines": ["Maharashtrian", "Cafe", "Street Food", "Bakery"],
        "dishes": ["Misal Pav", "Bakarwadi", "Puran Poli", "Mastani", "Vada Pav", "Poha", "Shrewsbury Biscuits", "Mawa Cake"]
    },
    "Ahmedabad": {
        "cuisines": ["Gujarati", "Street Food", "Sweets"],
        "dishes": ["Dhokla", "Khaman", "Fafda Jalebi", "Dabeli", "Thepla", "Undhiyu", "Khandvi", "Handvo"]
    },
    "Lucknow": {
        "cuisines": ["Awadhi", "Mughlai", "Street Food"],
        "dishes": ["Galouti Kebab", "Tunday Ke Kebab", "Lucknowi Biryani", "Basket Chaat", "Kulfi Falooda", "Sheermal", "Nihari", "Malai Makhan"]
    },
    "Indiranagar": {
        "cuisines": ["Continental", "Cafe", "Asian", "Gourmet"],
        "dishes": ["Avocado Toast", "Sushi", "Dimsum", "Artisan Coffee", "Gourmet Burger", "Macarons", "Acai Bowl", "Truffle Fries"]
    }
}

RESTAURANT_ADJECTIVES = ["The Great", "Authentic", "Urban", "Spicy", "Royal", "Golden", "Local", "Premium", "Fresh", "Classic"]
RESTAURANT_NOUNS = ["Kitchen", "Diner", "Bistro", "Cafe", "Lounge", "Eatery", "Express", "House", "Darbar", "Grill"]

OFFERS = ["", "50% OFF", "BOGO", "Free Delivery", "₹100 OFF", "20% OFF", "Combo Deal"]

IMAGES = [
    "https://images.unsplash.com/photo-1544025162-d76694265947?q=80&w=800&fit=crop", # Biryani
    "https://images.unsplash.com/photo-1550547660-d9450f859349?q=80&w=800&fit=crop", # Burger
    "https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?q=80&w=800&fit=crop", # Pizza
    "https://images.unsplash.com/photo-1513639776629-7b61b0ac49cb?q=80&w=800&fit=crop", # Fried Chicken
    "https://images.unsplash.com/photo-1604908176997-125f25cc6f3d?q=80&w=800&fit=crop", # Curry
    "https://images.unsplash.com/photo-1595086812836-8a58e45371c6?q=80&w=800&fit=crop", # Dosa
    "https://images.unsplash.com/photo-1563245366-0714b10223e7?q=80&w=800&fit=crop", # Asian
    "https://images.unsplash.com/photo-1511920170033-f8396924c348?q=80&w=800&fit=crop", # Desserts
    "https://images.unsplash.com/photo-1627915354504-2d57b2b8d009?q=80&w=800&fit=crop", # Sweets
    "https://images.unsplash.com/photo-1563729573883-294c7b8c7e0c?q=80&w=800&fit=crop"  # Thali
]

def generate_mass_data():
    try:
        print("Connecting to Zomato/Swiggy Core Database...")
        db = mysql.connector.connect(**DB_CONFIG)
        cursor = db.cursor()

        print("Wiping existing restaurants and food to prepare for 1000+ items...")
        cursor.execute("DELETE FROM order_items")
        cursor.execute("DELETE FROM food_options")
        cursor.execute("DELETE FROM restaurants")
        cursor.execute("ALTER TABLE restaurants AUTO_INCREMENT = 1")
        cursor.execute("ALTER TABLE food_options AUTO_INCREMENT = 1")
        
        db.commit()

        print("Generating 50 Hyper-Local Restaurants...")
        restaurants_inserted = []
        for city, data in REGIONS.items():
            # Generate 5 restaurants per city
            for i in range(5):
                name = f"{random.choice(RESTAURANT_ADJECTIVES)} {random.choice(data['cuisines']).split(' ')[0]} {random.choice(RESTAURANT_NOUNS)}"
                rating = round(random.uniform(3.8, 4.9), 1)
                prep_time = f"{random.randint(15, 45)} min"
                cats = f"{random.choice(data['cuisines'])}, {random.choice(data['cuisines'])}"
                offer = random.choice(OFFERS)
                img = random.choice(IMAGES)
                
                cursor.execute("""
                    INSERT INTO restaurants (name, rating, prep_time, categories, offer, location, img_url)
                    VALUES (%s, %s, %s, %s, %s, %s, %s)
                """, (name, rating, prep_time, cats, offer, city, img))
                restaurants_inserted.append((cursor.lastrowid, city, data))

        print(f"Success! Generated {len(restaurants_inserted)} Restaurants!")
        
        print("Generating 1000 Localized Food Items based on Regional Demand...")
        food_count = 0
        batch_data = []
        
        # Insert ~20 items per restaurant (50 * 20 = 1000 items)
        for r_id, city, data in restaurants_inserted:
            for j in range(20):
                # Core algorithm to tie localized dishes to the restaurant
                base_dish = random.choice(data['dishes'])
                adjective = random.choice(["Spicy", "Extra Masala", "Special", "Classic", "Premium", "Loaded", "Jumbo", "Mega"])
                food_name = f"{adjective} {base_dish}"
                
                tags = f"{random.choice(data['cuisines'])} • Best Seller"
                rating = round(random.uniform(4.0, 5.0), 1)
                prep_time = random.randint(10, 40)
                price = random.randint(80, 450)
                img = random.choice(IMAGES)
                quality = f"Authentic taste native to {city}, highly demanded by locals."
                
                batch_data.append((
                    r_id, food_name, tags, rating, prep_time, price, img, quality
                ))
                food_count += 1
                
        # Insert into database in batches
        insert_query = """
            INSERT INTO food_options (restaurant_id, name, tags, rating, prep_time, price, img_url, quality)
            VALUES (%s, %s, %s, %s, %s, %s, %s, %s)
        """
        cursor.executemany(insert_query, batch_data)
        
        db.commit()
        db.close()
        print(f"Success! Executed Mass Database Seed! Inserted exactly {food_count} hyper-localized products across 10 regions.")

    except mysql.connector.Error as err:
        print(f"Database Error: {err}")

if __name__ == '__main__':
    generate_mass_data()
