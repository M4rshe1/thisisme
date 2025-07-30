"use server";

import { META } from "@/config/settings";
import { CreateEmailResponse, Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY);

interface ContactFormData {
  name: string;
  email: string;
  message: string;
}

export async function sendContactEmail(formData: ContactFormData) {
  const { name, email, message } = formData;
  if (!name || !email || !message) {
    return { error: "All fields are required." };
  }

  try {
    const result: CreateEmailResponse = await resend.emails.send({
      from: `"Portfolio <${process.env.RESEND_FROM_EMAIL}>`,
      to: META.email,
      subject: `New contact form submission from ${name}`,
      text: `Name: ${name}\nEmail: ${email}\nMessage: ${message}`,
      html: `
        <p><strong>Name:</strong> ${name}</p>
        <p><strong>Email:</strong> ${email}</p>
        <p><strong>Message:</strong> ${message}</p>
      `,
    });

    if (result.error) {
      return { error: result.error.message };
    }

    return { success: "Email sent successfully!" };
  } catch (error) {
    console.error("Error sending email:", error);
    return { error: "Failed to send email. Please try again later." };
  }
}
