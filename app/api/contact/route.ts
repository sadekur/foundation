import nodemailer from "nodemailer";
import { NextResponse } from "next/server";

interface ContactRequestBody {
  name: string;
  email: string;
  phone?: string;
  message: string;
}

export async function POST(request: Request) {
  const { name, email, phone, message } = (await request.json()) as ContactRequestBody;

  if (!name || !email || !message) {
    return NextResponse.json({ error: "Please fill in all required fields." }, { status: 400 });
  }

  const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: process.env.CONTACT_EMAIL_USER,
      pass: process.env.CONTACT_EMAIL_APP_PASSWORD,
    },
  });

  try {
    await transporter.sendMail({
      from: `"As-Salsabil Foundation Website" <${process.env.CONTACT_EMAIL_USER}>`,
      to: process.env.CONTACT_TO_EMAIL || process.env.CONTACT_EMAIL_USER,
      replyTo: email,
      subject: `New message from ${name} — As-Salsabil Foundation website`,
      text: `Name: ${name}\nEmail: ${email}\nPhone: ${phone || "N/A"}\n\n${message}`,
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Contact form email failed:", error);
    return NextResponse.json({ error: "Failed to send your message. Please try again later." }, { status: 500 });
  }
}
