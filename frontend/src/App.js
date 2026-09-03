import React, { useEffect, useState } from "react";
import { Base_Url } from "../constants";

function App() {

  const [rooms, setRooms] = useState([]);
  const [roomName, setRoomName] = useState("");
  const [capacity, setCapacity] = useState("");
  const [bookedBy, setBookedBy] = useState("");

  // Load rooms
  const getRooms = () => {
    fetch(`${Base_Url}/rooms`)
      .then(response => response.json())
      .then(data => setRooms(data));
  };

  useEffect(() => {
    getRooms();
  }, []);


  // Add room
  const addRoom = () => {
    fetch(Base_Url+"/rooms", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        room_name: roomName,
        capacity: capacity
      })
    })
    .then(() => {
      setRoomName("");
      setCapacity("");
      getRooms();
    });
  };


  // Book room
  const bookRoom = (roomId) => {
    fetch(`${Base_Url}/rooms/${roomId}/book`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        booked_by: bookedBy
      })
    })
    .then(() => {
      getRooms();
    });
  };


  return (
    <div>

      <h1>Room Reservation</h1>

      <h2>Add Room</h2>

      <input
        placeholder="Room Name"
        value={roomName}
        onChange={(e) => setRoomName(e.target.value)}
      />

      <input
        type="number"
        placeholder="Capacity"
        value={capacity}
        onChange={(e) => setCapacity(e.target.value)}
      />

      <button onClick={addRoom}>
        Add Room
      </button>


      <h2>Book Room</h2>

      <input
        placeholder="Your Name"
        value={bookedBy}
        onChange={(e) => setBookedBy(e.target.value)}
      />


      <h2>Rooms</h2>

      {rooms.map(room => (
        <div key={room.id}>

          <b>{room.room_name}</b>

          {" - Capacity: " + room.capacity + " - "}

          {room.booked ? (
            <span>
              Booked by {room.booked_by}
            </span>
          ) : (
            <button onClick={() => bookRoom(room.id)}>
              Book
            </button>
          )}

        </div>
      ))}

    </div>
  );
}

export default App;