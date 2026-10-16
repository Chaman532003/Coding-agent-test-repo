"""In-memory store for users, products, tokens and carts.

This module seeds one user and eight products and keeps carts per token.
"""
from typing import Dict, List, Optional
import hashlib
import secrets


def _hash_password(password: str, salt: bytes = b'static_salt') -> str:
    dk = hashlib.pbkdf2_hmac('sha256', password.encode('utf-8'), salt, 100000)
    return dk.hex()


class Store:
    """In-memory store holding users, products, tokens and carts.

    The store provides convenience methods for the routers and a reset()
    function used by tests to restore seeded state.
    """

    def __init__(self) -> None:
        self._seed_password = 'demo1234'
        self.reset()

    def reset(self) -> None:
        """Restore the seeded user, products and clear tokens and carts."""
        # users: email -> dict with password hash
        self.users: Dict[str, Dict] = {
            'demo@shop.test': {'password': _hash_password(self._seed_password)}
        }

        # products: list of dicts
        names = [
            'Red Shirt', 'Blue Jeans', 'Green Hat', 'Yellow Scarf',
            'Black Shoes', 'White Socks', 'Orange Jacket', 'Purple Gloves'
        ]
        self.products: List[Dict] = []
        for i, name in enumerate(names, start=1):
            slug = name.lower().replace(' ', '-')
            self.products.append({
                'id': i,
                'name': name,
                'price': round(10 + i * 2.5, 2),
                'image_url': f'https://picsum.photos/seed/{slug}/480/360',
                'description': f'A lovely {name.lower()} for everyday wear.'
            })

        # tokens: token -> email
        self.tokens: Dict[str, str] = {}

        # carts: email -> cart dict
        self.carts: Dict[str, Dict] = {}

    def find_product(self, product_id: int) -> Optional[Dict]:
        """Return the product matching product_id or None if not found."""
        for p in self.products:
            if p['id'] == product_id:
                return p
        return None

    def issue_token(self, email: str) -> str:
        """Issue and store a new token for the given email and return it."""
        token = secrets.token_urlsafe(32)
        self.tokens[token] = email
        # ensure cart exists for user
        self.carts.setdefault(email, {'items': [], 'count': 0, 'total': 0.0})
        return token

    def email_for_token(self, token: str) -> Optional[str]:
        """Return the email associated with token or None."""
        return self.tokens.get(token)

    def get_cart_for_email(self, email: str) -> Dict:
        """Return a copy of the user's cart suitable for JSON responses."""
        cart = self.carts.setdefault(email, {'items': [], 'count': 0, 'total': 0.0})
        # return a deep copy-like dict to avoid accidental external mutation
        return {'items': [dict(i) for i in cart['items']], 'count': cart.get('count', 0), 'total': float(cart.get('total', 0.0))}

    def _recompute(self, email: str) -> None:
        """Recompute per-cart derived fields: line_total, count and total."""
        cart = self.carts.setdefault(email, {'items': [], 'count': 0, 'total': 0.0})
        total = 0.0
        count = 0
        for it in cart['items']:
            it['line_total'] = round(it['price'] * it['quantity'], 2)
            total += it['line_total']
            count += it['quantity']
        cart['total'] = round(total, 2)
        cart['count'] = count

    def add_item(self, email: str, product_id: int, quantity: int) -> Dict:
        """Add quantity of product to user's cart and return the updated cart.

        Raises KeyError if the product does not exist.
        """
        product = self.find_product(product_id)
        if not product:
            raise KeyError('Product not found')
        cart = self.carts.setdefault(email, {'items': [], 'count': 0, 'total': 0.0})
        item = next((it for it in cart['items'] if it['product_id'] == product_id), None)
        if item:
            item['quantity'] += quantity
        else:
            cart['items'].append({
                'product_id': product['id'],
                'name': product['name'],
                'price': float(product['price']),
                'quantity': quantity,
                'line_total': round(product['price'] * quantity, 2)
            })
        self._recompute(email)
        return self.get_cart_for_email(email)

    def remove_item(self, email: str, product_id: int) -> Dict:
        """Remove product from cart and return updated cart.

        Raises KeyError if the item is not present.
        """
        cart = self.carts.setdefault(email, {'items': [], 'count': 0, 'total': 0.0})
        idx = next((i for i, it in enumerate(cart['items']) if it['product_id'] == product_id), None)
        if idx is None:
            raise KeyError('Item not in cart')
        cart['items'].pop(idx)
        self._recompute(email)
        return self.get_cart_for_email(email)


store = Store()
