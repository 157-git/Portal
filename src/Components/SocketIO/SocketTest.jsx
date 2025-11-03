window.global = window;
import React, { useEffect, useState, useRef } from "react";
import { Client } from "@stomp/stompjs";
import SockJS from "sockjs-client";

const SOCKET_URL = "http://localhost:8080/ws";

export default function SocketTest() {
  const [message, setMessage] = useState("");
  const [received, setReceived] = useState([]);
  const clientRef = useRef(null); // 👈 Store client reference here

  useEffect(() => {
    const client = new Client({
      webSocketFactory: () => new SockJS(SOCKET_URL),
      onConnect: () => {
        console.log("✅ Connected to WebSocket");
        client.subscribe("/topic/messages", (msg) => {
          setReceived((prev) => [...prev, msg.body]);
        });
      },
    });

    client.activate();
    clientRef.current = client; // 👈 Save client for later use

    return () => client.deactivate();
  }, []);

  const sendMessage = () => {
    const client = clientRef.current; // 👈 Access stored client
    if (client && message.trim()) {
      client.publish({ destination: "/app/sendMessage", body: message });
      setMessage("");
    }
  };

  return (
    <div style={{ padding: 20 }}>
      <h3>💬 WebSocket Chat Test</h3>
      <input
        type="text"
        value={message}
        onChange={(e) => setMessage(e.target.value)}
        placeholder="Enter message"
      />
      <button onClick={sendMessage}>Send</button>

      <div style={{ marginTop: 20 }}>
        {received.map((msg, idx) => (
          <div key={idx}>{msg}</div>
        ))}
      </div>
    </div>
  );
}
