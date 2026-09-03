from flask import Flask, jsonify, request
from flask_cors import CORS
import mysql.connector

app = Flask(__name__)
CORS(app)


def get_db_connection():
    return mysql.connector.connect(
        host="room-mysql",
        port=3306,
        user="root",
        password="root123",
        database="roomdb"
    )


def init_db():
    connection = get_db_connection()
    cursor = connection.cursor()

    cursor.execute("""
        CREATE TABLE IF NOT EXISTS rooms (
            id INT AUTO_INCREMENT PRIMARY KEY,
            room_name VARCHAR(100) NOT NULL,
            capacity INT NOT NULL,
            booked BOOLEAN DEFAULT FALSE,
            booked_by VARCHAR(100)
        )
    """)

    connection.commit()
    cursor.close()
    connection.close()


@app.route("/rooms", methods=["GET"])
def get_rooms():
    connection = get_db_connection()
    cursor = connection.cursor(dictionary=True)

    cursor.execute("SELECT * FROM rooms")
    rooms = cursor.fetchall()

    cursor.close()
    connection.close()

    return jsonify(rooms)


@app.route("/rooms", methods=["POST"])
def add_room():
    data = request.get_json()

    room_name = data["room_name"]
    capacity = data["capacity"]

    connection = get_db_connection()
    cursor = connection.cursor()

    cursor.execute(
        "INSERT INTO rooms (room_name, capacity) VALUES (%s, %s)",
        (room_name, capacity)
    )

    connection.commit()

    cursor.close()
    connection.close()

    return jsonify({"message": "Room added successfully"})


@app.route("/rooms/<int:room_id>/book", methods=["POST"])
def book_room(room_id):
    data = request.get_json()
    booked_by = data["booked_by"]

    connection = get_db_connection()
    cursor = connection.cursor()

    cursor.execute(
        """
        UPDATE rooms
        SET booked = TRUE,
            booked_by = %s
        WHERE id = %s
        """,
        (booked_by, room_id)
    )

    connection.commit()

    cursor.close()
    connection.close()

    return jsonify({"message": "Room booked successfully"})


if __name__ == "__main__":
    init_db()

    app.run(
        host="0.0.0.0",
        port=5001,
        debug=True
    )