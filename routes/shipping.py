# backend/routes/shipping.py

from flask import Blueprint, request, jsonify

shipping_bp = Blueprint('shipping', __name__)

@shipping_bp.route('/get-shipping-cost', methods=['POST'])
def get_shipping_cost():
    data = request.get_json()

    weight = data.get('weight')
    shipping_method = data.get('shippingMethod')

    base_cost = 50

    if shipping_method == 'Air':
        cost = base_cost + (20 * weight)
        delivery_time = "2-4 days"
    elif shipping_method == 'Sea':
        cost = base_cost + (10 * weight)
        delivery_time = "10-15 days"
    elif shipping_method == 'Land':
        cost = base_cost + (5 * weight)
        delivery_time = "5-7 days"
    elif shipping_method == 'Local':
        cost = 30
        delivery_time = "Same day"
    else:
        return jsonify({"error": "Invalid shipping method"}), 400

    return jsonify({
        "estimatedCost": cost,
        "deliveryTime": delivery_time
    })
