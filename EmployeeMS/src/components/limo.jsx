import { useState } from "react";
import axios from "axios";

const AIChat = () => {
  const [question, setQuestion] = useState("");
  const [answer, setAnswer] = useState("");
  const [loading, setLoading] = useState(false);

  const askAI = async () => {
    if (!question) return;

    setLoading(true);
    try {
      const token = localStorage.getItem("token");

      const res = await axios.post(
        "https://employee-management-system-backend-rz80.onrender.com/api/ai/ask",
        { question },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      );

      setAnswer(res.data.answer);
    } catch (err) {
      setAnswer("Error contacting AI service");
    }
    setLoading(false);
  };

  return (
    <div
      style={{
        maxWidth: "700px",
        margin: "50px auto",
        padding: "30px",
        fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif",
      }}
    >
      <div
        style={{
          background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
          padding: "30px",
          borderRadius: "15px 15px 0 0",
          color: "white",
          textAlign: "center",
          boxShadow: "0 4px 6px rgba(0,0,0,0.1)",
        }}
      >
        <h2 style={{ margin: 0, fontSize: "28px", fontWeight: "600" }}>
          🤖 AI Employee Assistant
        </h2>
        <p style={{ margin: "8px 0 0 0", opacity: 0.9, fontSize: "14px" }}>
          Ask me anything about your employees
        </p>
      </div>

      <div
        style={{
          background: "white",
          padding: "30px",
          borderRadius: "0 0 15px 15px",
          boxShadow: "0 4px 20px rgba(0,0,0,0.1)",
        }}
      >
        <div style={{ marginBottom: "20px" }}>
          <input
            type="text"
            placeholder="Ask something like: count employees"
            value={question}
            onChange={(e) => setQuestion(e.target.value)}
            onKeyPress={(e) => e.key === "Enter" && askAI()}
            style={{
              width: "100%",
              padding: "15px 20px",
              fontSize: "16px",
              border: "2px solid #e0e0e0",
              borderRadius: "10px",
              outline: "none",
              transition: "border-color 0.3s",
              boxSizing: "border-box",
            }}
            onFocus={(e) => (e.target.style.borderColor = "#667eea")}
            onBlur={(e) => (e.target.style.borderColor = "#e0e0e0")}
          />
        </div>

        <button
          onClick={askAI}
          disabled={!question || loading}
          style={{
            width: "100%",
            padding: "15px",
            fontSize: "16px",
            fontWeight: "600",
            color: "white",
            background:
              question && !loading
                ? "linear-gradient(135deg, #667eea 0%, #764ba2 100%)"
                : "#cccccc",
            border: "none",
            borderRadius: "10px",
            cursor: question && !loading ? "pointer" : "not-allowed",
            transition: "all 0.3s",
            boxShadow:
              question && !loading
                ? "0 4px 15px rgba(102, 126, 234, 0.4)"
                : "none",
          }}
          onMouseEnter={(e) => {
            if (question && !loading) {
              e.target.style.transform = "translateY(-2px)";
              e.target.style.boxShadow = "0 6px 20px rgba(102, 126, 234, 0.5)";
            }
          }}
          onMouseLeave={(e) => {
            e.target.style.transform = "translateY(0)";
            e.target.style.boxShadow =
              question && !loading
                ? "0 4px 15px rgba(102, 126, 234, 0.4)"
                : "none";
          }}
        >
          {loading ? "Thinking..." : "Ask AI"}
        </button>

        {loading && (
          <div
            style={{
              marginTop: "25px",
              textAlign: "center",
              color: "#667eea",
              fontSize: "15px",
            }}
          >
            <div
              style={{
                display: "inline-block",
                width: "20px",
                height: "20px",
                border: "3px solid #f3f3f3",
                borderTop: "3px solid #667eea",
                borderRadius: "50%",
                animation: "spin 1s linear infinite",
                marginRight: "10px",
                verticalAlign: "middle",
              }}
            ></div>
            <span>Analyzing your question...</span>
          </div>
        )}

        {answer && !loading && (
          <div
            style={{
              marginTop: "25px",
              background: "#f8f9ff",
              padding: "20px",
              borderRadius: "10px",
              border: "1px solid #e8ebf7",
              boxShadow: "0 2px 8px rgba(102, 126, 234, 0.1)",
            }}
          >
            <div
              style={{
                color: "#667eea",
                fontWeight: "600",
                marginBottom: "10px",
                fontSize: "14px",
                textTransform: "uppercase",
                letterSpacing: "0.5px",
              }}
            >
              AI Response:
            </div>
            <div
              style={{
                color: "#333",
                fontSize: "15px",
                lineHeight: "1.6",
              }}
            >
              {answer}
            </div>
          </div>
        )}
      </div>

      <style>{`
        @keyframes spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }
      `}</style>
    </div>
  );
};

export default AIChat;
