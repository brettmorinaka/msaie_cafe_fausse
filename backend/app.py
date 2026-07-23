import random
import re
from datetime import datetime

from flask import Flask, jsonify, request
from flask_cors import CORS
from sqlalchemy.exc import IntegrityError

from config import Config
from models import Customer, Reservation, db

EMAIL_PATTERN = re.compile(r"^[^\s@]+@[^\s@]+\.[^\s@]+$")


def create_app():
    app = Flask(__name__)
    app.config.from_object(Config)
    CORS(app, resources={r"/api/*": {"origins": "*"}})
    db.init_app(app)

    with app.app_context():
        db.create_all()

    @app.get("/api/health")
    def health():
        return jsonify({"status": "ok"})

    @app.get("/api/reservations/availability")
    def availability():
        time_str = request.args.get("time_slot")
        if not time_str:
            return jsonify({"error": "time_slot query parameter is required"}), 400
        try:
            slot = datetime.fromisoformat(time_str.replace("Z", "+00:00"))
            if slot.tzinfo:
                slot = slot.replace(tzinfo=None)
        except ValueError:
            return jsonify({"error": "Invalid time_slot format. Use ISO 8601."}), 400

        booked = {
            r.table_number
            for r in Reservation.query.filter_by(time_slot=slot).all()
        }
        available_count = Config.TOTAL_TABLES - len(booked)
        return jsonify(
            {
                "time_slot": slot.isoformat(),
                "available": available_count > 0,
                "tables_remaining": available_count,
            }
        )

    @app.post("/api/reservations")
    def create_reservation():
        data = request.get_json(silent=True) or {}
        required = ["time_slot", "num_guests", "customer_name", "email_address"]
        missing = [f for f in required if not data.get(f)]
        if missing:
            return jsonify({"error": f"Missing fields: {', '.join(missing)}"}), 400

        try:
            num_guests = int(data["num_guests"])
            if num_guests < 1 or num_guests > 12:
                return jsonify({"error": "Number of guests must be between 1 and 12"}), 400
        except (TypeError, ValueError):
            return jsonify({"error": "Invalid number of guests"}), 400

        email = data["email_address"].strip()
        if not EMAIL_PATTERN.match(email):
            return jsonify({"error": "Invalid email address"}), 400

        try:
            slot = datetime.fromisoformat(
                data["time_slot"].replace("Z", "+00:00")
            )
            if slot.tzinfo:
                slot = slot.replace(tzinfo=None)
        except ValueError:
            return jsonify({"error": "Invalid time_slot format"}), 400

        if slot < datetime.now():
            return jsonify({"error": "Cannot book a time in the past"}), 400

        name = data["customer_name"].strip()
        phone = (data.get("phone_number") or "").strip() or None

        booked_tables = {
            r.table_number
            for r in Reservation.query.filter_by(time_slot=slot).with_for_update().all()
        }
        available = [
            t for t in range(1, Config.TOTAL_TABLES + 1) if t not in booked_tables
        ]
        if not available:
            return jsonify(
                {
                    "error": "This time slot is fully booked. Please choose another time.",
                }
            ), 409

        table_number = random.choice(available)

        customer = Customer.query.filter_by(email_address=email).first()
        if customer:
            customer.customer_name = name
            if phone:
                customer.phone_number = phone
        else:
            customer = Customer(
                customer_name=name,
                email_address=email,
                phone_number=phone,
                newsletter_signup=False,
            )
            db.session.add(customer)
            db.session.flush()

        reservation = Reservation(
            customer_id=customer.customer_id,
            time_slot=slot,
            table_number=table_number,
        )
        db.session.add(reservation)

        try:
            db.session.commit()
        except IntegrityError:
            db.session.rollback()
            return jsonify(
                {
                    "error": "This time slot is fully booked. Please choose another time.",
                }
            ), 409

        return jsonify(
            {
                "message": "Reservation confirmed!",
                "reservation": reservation.to_dict(),
                "num_guests": num_guests,
            }
        ), 201

    @app.post("/api/newsletter")
    def newsletter_signup():
        data = request.get_json(silent=True) or {}
        email = (data.get("email") or "").strip()
        name = (data.get("name") or "Newsletter Subscriber").strip()

        if not email or not EMAIL_PATTERN.match(email):
            return jsonify({"error": "Please enter a valid email address"}), 400

        customer = Customer.query.filter_by(email_address=email).first()
        if customer:
            customer.newsletter_signup = True
            if name and name != "Newsletter Subscriber":
                customer.customer_name = name
        else:
            customer = Customer(
                customer_name=name,
                email_address=email,
                phone_number=None,
                newsletter_signup=True,
            )
            db.session.add(customer)

        db.session.commit()
        return jsonify({"message": "Thank you for subscribing to our newsletter!"})

    return app


if __name__ == "__main__":
    application = create_app()
    application.run(host="0.0.0.0", port=5000, debug=True)
