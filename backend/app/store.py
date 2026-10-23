products_db = [
    {
        "id": 1,
        "name": "Laptop",
        "price": 999.99,
        "image_url": "https://images.unsplash.com/photo-1517694712202-14dd9538aa97?w=500",
        "description": "High-performance laptop for professionals",
    },
    {
        "id": 2,
        "name": "Wireless Headphones",
        "price": 149.99,
        "image_url": "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=500",
        "description": "Premium sound quality with noise cancellation",
    },
    {
        "id": 3,
        "name": "Smartphone",
        "price": 799.99,
        "image_url": "https://images.unsplash.com/photo-1511707267537-b85faf00021e?w=500",
        "description": "Latest smartphone with advanced features",
    },
    {
        "id": 4,
        "name": "Smartwatch",
        "price": 299.99,
        "image_url": "https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=500",
        "description": "Stay connected with a smartwatch",
    },
    {
        "id": 5,
        "name": "Tablet",
        "price": 449.99,
        "image_url": "https://images.unsplash.com/photo-1561070791-2526d30994b5?w=500",
        "description": "Perfect for work and entertainment",
    },
    {
        "id": 6,
        "name": "USB-C Cable",
        "price": 19.99,
        "image_url": "https://images.unsplash.com/photo-1625948515291-69613efd103f?w=500",
        "description": "High-quality USB-C charging cable",
    },
    {
        "id": 7,
        "name": "Wireless Charger",
        "price": 34.99,
        "image_url": "https://images.unsplash.com/photo-1611198188060-b8b6a8b0f3c3?w=500",
        "description": "Fast wireless charging pad",
    },
    {
        "id": 8,
        "name": "Phone Case",
        "price": 24.99,
        "image_url": "https://images.unsplash.com/photo-1605559424843-9e4c3ca4628a?w=500",
        "description": "Durable protective phone case",
    },
]

users_db = {
    "demo@shop.test": {
        "email": "demo@shop.test",
        "name": "Demo User",
        "hashed_password": "iX0w7I9KUZ+FavC4kypPZ9E9SlhhrPkfCNBTRIJ7pD8=",
    }
}

carts = {}


def get_product(product_id: int):
    for p in products_db:
        if p["id"] == product_id:
            return p
    return None


def get_cart(user_email: str):
    if user_email not in carts:
        carts[user_email] = {"items": [], "total": 0.0, "count": 0}
    return carts[user_email]


def add_to_cart(user_email: str, product_id: int, quantity: int):
    product = get_product(product_id)
    if not product:
        return None

    cart = get_cart(user_email)
    existing_item = None
    for item in cart["items"]:
        if item["product_id"] == product_id:
            existing_item = item
            break

    if existing_item:
        existing_item["quantity"] += quantity
    else:
        cart["items"].append(
            {
                "product_id": product_id,
                "name": product["name"],
                "price": product["price"],
                "quantity": quantity,
            }
        )

    recalculate_cart(cart)
    return cart


def recalculate_cart(cart):
    total = 0.0
    count = 0
    for item in cart["items"]:
        item["line_total"] = item["price"] * item["quantity"]
        total += item["line_total"]
        count += item["quantity"]
    cart["total"] = total
    cart["count"] = count


def remove_from_cart(user_email: str, product_id: int):
    cart = get_cart(user_email)
    item_index = None
    for i, item in enumerate(cart["items"]):
        if item["product_id"] == product_id:
            item_index = i
            break

    if item_index is None:
        return None

    cart["items"].pop(item_index)
    recalculate_cart(cart)
    return cart
