
import { useState } from "react";
import "./App.css";

function App() {
  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(false);

  async function sendMessage(event) {
    event.preventDefault();

    const question = message.trim();
    if (!question || loading) return;

    const updatedMessages = [
      ...messages,
      { role: "user", content: question },
    ];

    setMessages(updatedMessages);
    setMessage("");
    setLoading(true);

    try {
      const response = await fetch("http://localhost:8080/api/chat", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          message: question,
          history: messages,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Something went wrong.");
      }

      setMessages([
        ...updatedMessages,
        { role: "assistant", content: data.reply },
      ]);
    } catch (error) {
      setMessages([
        ...updatedMessages,
        {
          role: "assistant",
          content:
            "Unable to connect to the chatbot. Check that Spring Boot and Ollama are running.",
        },
      ]);
      console.error(error);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="app">
      <header className="header">
        <h1>CodeBuddy</h1>
        <p>Your programming learning assistant</p>
      </header>

      <main className="chat">
        {messages.length === 0 && (
          <div className="welcome">
            <h2>What are you learning today?</h2>
            <p>Ask me about Java, React, SQL, Spring Boot, DSA, and more.</p>
          </div>
        )}

        <div className="messages">
          {messages.map((item, index) => (
            <div
              className={`message ${item.role}`}
              key={`${index}-${item.role}`}
            >
              <strong>
                {item.role === "user" ? "You" : "CodeBuddy"}
              </strong>
              <p>{item.content}</p>
            </div>
          ))}

          {loading && (
            <div className="message assistant">
              <strong>CodeBuddy</strong>
              <p>Thinking...</p>
            </div>
          )}
        </div>
      </main>

      <form className="input-form" onSubmit={sendMessage}>
        <input
          value={message}
          onChange={(event) => setMessage(event.target.value)}
          placeholder="Ask a programming question..."
          disabled={loading}
        />
        <button type="submit" disabled={loading || !message.trim()}>
          Send
        </button>
      </form>

      <footer>Focused on programming and software development</footer>
    </div>
  );
}

export default App;
