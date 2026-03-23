import express from "express";
import cors from "cors";
import { Resend } from "resend";
import "dotenv/config";

const app = express();
const PORT = process.env.PORT || 3001;

const resend = new Resend(process.env.RESEND_API_KEY);

app.use(cors({ origin: ["http://localhost:8080", "http://localhost:5173"] }));
app.use(express.json());

app.post("/api/contact", async (req, res) => {
  const { name, email, institution, message } = req.body;

  if (!name || !email || !message) {
    return res.status(400).json({ success: false, error: "Missing required fields." });
  }

  try {
    await resend.emails.send({
      from: "pathCast Contact <onboarding@resend.dev>",
      to: ["ananduks21@gmail.com"],
      replyTo: email,
      subject: `New message from ${name}`,
      html: `
        <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto;">
          <h2 style="color: #0d3535;">New Contact Form Submission</h2>
          <table style="width: 100%; border-collapse: collapse;">
            <tr>
              <td style="padding: 8px 0; font-weight: bold; color: #555; width: 130px;">Name</td>
              <td style="padding: 8px 0; color: #111;">${name}</td>
            </tr>
            <tr>
              <td style="padding: 8px 0; font-weight: bold; color: #555;">Email</td>
              <td style="padding: 8px 0; color: #111;"><a href="mailto:${email}">${email}</a></td>
            </tr>
            ${
              institution
                ? `<tr>
              <td style="padding: 8px 0; font-weight: bold; color: #555;">Institution</td>
              <td style="padding: 8px 0; color: #111;">${institution}</td>
            </tr>`
                : ""
            }
            <tr>
              <td style="padding: 8px 0; font-weight: bold; color: #555; vertical-align: top;">Message</td>
              <td style="padding: 8px 0; color: #111; white-space: pre-wrap;">${message}</td>
            </tr>
          </table>
        </div>
      `,
    });

    res.json({ success: true });
  } catch (error) {
    console.error("Resend error:", error);
    res.status(500).json({ success: false, error: "Failed to send email." });
  }
});

app.listen(PORT, () => {
  console.log(`✓ API server running at http://localhost:${PORT}`);
});
