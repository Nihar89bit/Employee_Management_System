import axios from "axios";

export const generateAIResponse = async (prompt) => {
  try {
    const response = await axios.post(
      "https://openrouter.ai/api/v1/chat/completions",
      {
        model: "meta-llama/llama-3-8b-instruct",
        messages: [
          { role: "system", content: "You are an AI assistant for an Employee Management System." },
          { role: "user", content: prompt }
        ],
        temperature: 0.4
      },
      {
        headers: {
          "Authorization": `Bearer ${process.env.OPENROUTER_API_KEY}`,
          "Content-Type": "application/json",
          "HTTP-Referer": "http://localhost:5173",
          "X-Title": "Employee Management System"
        }
      }
    );

    return response.data.choices[0].message.content;

  } catch (error) {
    console.error("OpenRouter Error:", error.response?.data || error.message);
    throw error;
  }
};
