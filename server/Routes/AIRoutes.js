import express from "express";
import con from "../utils/db.js";
import { generateAIResponse } from "../services/openRouterAI.js";

const router = express.Router();

router.post("/ask", async (req, res) => {
  const { question } = req.body;
  const q = question.toLowerCase();

  try {
    // ---------------- ATTENDANCE SUMMARY ----------------
    if (q.toLowerCase().includes("attendance")) {
      const sql = `
        SELECT 
          COUNT(*) AS total_records,
          SUM(CASE WHEN status='Present' THEN 1 ELSE 0 END) AS present_days,
          SUM(CASE WHEN status='Absent' THEN 1 ELSE 0 END) AS absent_days
        FROM attendance
      `;

      con.query(sql, async (err, result) => {
        if (err) return res.status(500).json({ answer: "Database error" });

        const d = result[0];

        const prompt = `
You are an internal AI assistant for an Employee Management System.

RULES:
- Answer in MAX 4 bullet points
- Use ONLY the system data
- No general explanations

SYSTEM DATA:
- Total attendance records: ${d.total_records}
- Present days: ${d.present_days}
- Absent days: ${d.absent_days}

USER QUESTION:
${question}
`;

        const aiAnswer = await generateAIResponse(prompt);
        return res.json({ answer: aiAnswer });
      });

      // ---------------- ADMIN DASHBOARD ----------------
    } else if (
      q.includes("dashboard") ||
      q.includes("admin insights") ||
      q.includes("dashboard insights") ||
      q.includes("overview")
    ) {
      const sql = `
    SELECT
      (SELECT COUNT(*) FROM employee) AS total_employees,
      (SELECT COUNT(*) FROM admin) AS total_admins,
      (SELECT IFNULL(SUM(salary),0) FROM employee) AS total_salary,
      (SELECT COUNT(*) FROM leaves WHERE status='Pending') AS pending_leaves
  `;

      con.query(sql, async (err, result) => {
        if (err) return res.status(500).json({ answer: "DB error" });

        const d = result[0];

        const prompt = `
You are an internal AI assistant for an Employee Management System.

RULES:
- Max 5 bullet points
- Use ONLY system data
- No assumptions or explanations

SYSTEM DATA:
- Total employees: ${d.total_employees}
- Total admins: ${d.total_admins}
- Total salary payout: ${d.total_salary}
- Pending leave requests: ${d.pending_leaves}

USER QUESTION:
${question}
`;

        const aiAnswer = await generateAIResponse(prompt);
        return res.json({ answer: aiAnswer });
      });

      // ---------------- EMPLOYEE SUMMARY ----------------
    } else if (
      question.toLowerCase().includes("employee") &&
      question.toLowerCase().includes("summary")
    ) {
      const sql = `
    SELECT name, email, salary, address
    FROM employee
    ORDER BY id DESC
  `;

      con.query(sql, async (err, result) => {
        if (err) {
          console.error("DB Error:", err);
          return res.status(500).json({ answer: "Database error" });
        }

        if (!result || result.length === 0) {
          return res.json({
            answer: "No employee records found in the system.",
          });
        }

        const e = result[0];

        const prompt = `
You are an internal AI assistant for an Employee Management System.

RULES:
- Answer in MAX 5 bullet points
- Use ONLY the data provided
- No assumptions
- Keep it professional and short

SYSTEM DATA:
- Name: ${e.name}
- Email: ${e.email}
- Salary: ${e.salary}
- Address: ${e.address}

USER QUESTION:
${question}
`;

        try {
          const aiAnswer = await generateAIResponse(prompt);
          return res.json({ answer: aiAnswer });
        } catch (aiErr) {
          console.error("AI Error:", aiErr);
          return res.status(500).json({ answer: "AI service failed" });
        }
      });
      //-------------
    } else if (
      q.includes("count employees") ||
      q.includes("total employees") ||
      q.includes("how many employees")
    ) {
      const sql = `SELECT COUNT(*) AS count FROM employee`;

      con.query(sql, async (err, result) => {
        if (err) return res.status(500).json({ answer: "DB error" });

        const count = result[0].count;

        const prompt = `
You are an internal AI assistant for an Employee Management System.

STRICT RULES:
- Answer ONLY using the data provided
- DO NOT invent employee names, IDs, or roles
- DO NOT add examples
- DO NOT assume additional details
- If data is not provided, do not mention it

SYSTEM DATA:
- Total employees: ${count}

USER QUESTION:
${question}

EXPECTED FORMAT:
- Total employees: <number>
`;
        const aiAnswer = await generateAIResponse(prompt);
        return res.json({ answer: aiAnswer });
      });
      /* ================= SALARY SUMMARY ================= */
    } else if (q.includes("salary") || q.includes("payroll")) {
      const sql = `
        SELECT
          SUM(salary) AS total,
          AVG(salary) AS avg,
          MAX(salary) AS max
        FROM employee
      `;

      con.query(sql, async (err, r) => {
        if (err) return res.status(500).json({ answer: "DB error" });

        const d = r[0];
        const prompt = `
SYSTEM DATA:
- Total payout: ${Math.round(d.total)}
- Average salary: ${Math.round(d.avg)}
- Highest salary: ${d.max}

RULES:
- Max 3 bullets

USER QUESTION:
${question}
        `;
        return res.json({ answer: await generateAIResponse(prompt) });
      });
      /* ================= LEAVE SUMMARY ================= */
    } else if (q.includes("leave")) {
      const sql = `
        SELECT
          COUNT(*) AS total,
          SUM(status='Approved') AS approved,
          SUM(status='Pending') AS pending,
          SUM(status='Rejected') AS rejected
        FROM leaves
      `;

      con.query(sql, async (err, r) => {
        if (err) return res.status(500).json({ answer: "DB error" });

        const d = r[0];
        const prompt = `
SYSTEM DATA:
- Total requests: ${d.total}
- Approved: ${d.approved}
- Pending: ${d.pending}
- Rejected: ${d.rejected}

RULES:
- Max 4 bullets
- No assumptions

USER QUESTION:
${question}
        `;
        return res.json({ answer: await generateAIResponse(prompt) });
      });

      // ---------------- FALLBACK ----------------
    } else {
      return res.json({
        answer:
          "Hello Admin 👋 I can answer questions related only to this Employee Management System. Try asking about employees, attendance, leaves, salaries, or admin dashboard insights.",
      });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ answer: "AI service error" });
  }
});

export default router;
