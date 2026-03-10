"use server";

import prisma from "@/lib/prisma";
import { redirect } from "next/navigation";
import bcrypt from "bcryptjs";
import { createSession, deleteSession } from "@/lib/session";
import { sendEmail } from "@/lib/mail";
import crypto from "crypto";

// --- REGISTER ---
export async function register(prevState: any, formData: FormData) {
  const businessName = formData.get("businessName") as string;
  const email = formData.get("email") as string;
  const password = formData.get("password") as string;
  const name = formData.get("name") as string;

  if (!businessName || !email || !password || !name) {
    return { error: "Please fill in all fields" };
  }

  // 1. Check if user exists
  const existingUser = await prisma.user.findFirst({
    where: { email },
  });

  if (existingUser) {
    // If account exists but not verified, guide them to login to verify
    if (!existingUser.emailVerified) {
      return { error: "Account created but not verified. Please login." };
    }
    return { error: "Email already registered" };
  }

  // 2. Hash Password & Generate OTP
  const hashedPassword = await bcrypt.hash(password, 10);
  const otp = crypto.randomInt(100000, 999999).toString();
  const otpExpiresAt = new Date(Date.now() + 15 * 60 * 1000); // 15 mins

  try {
    const slug =
      businessName.toLowerCase().replace(/[^a-z0-9]+/g, "-") +
      "-" +
      Math.floor(Math.random() * 1000);

    // 3. Create Business & User
    await prisma.business.create({
      data: {
        name: businessName,
        slug: slug,
        subscriptionPlan: "FREE",
        subscriptionStart: "ACTIVE",
        subscriptionEnd: null,
        users: {
          create: {
            name: name,
            email: email,
            password: hashedPassword,
            role: "OWNER",
            otp: otp,
            otpExpiresAt: otpExpiresAt,
            emailVerified: null, // Not verified
          },
        },
      },
    });

    // 4. Send Email (Fail gracefully so logic doesn't break)
    const emailRes = await sendEmail({
      to: email,
      subject: "Verify your Assan Ecommerce Account",
      html: `
        <p>Hi ${name},</p>
        <p>Thank you for registering. Please use the OTP below to verify your email address:</p>
        <h1 style="background: #f4f4f4; padding: 10px; text-align: center; letter-spacing: 5px;">${otp}</h1>
        <p>This code expires in 15 minutes.</p>
      `,
    });

    if (!emailRes.success) {
      console.error("Warning: Registration email failed to send.");
    }
  } catch (error) {
    console.error("Registration Error:", error);
    return { error: "Failed to create account. Please try again." };
  }

  // Redirect to verify page
  redirect(`/verify?email=${encodeURIComponent(email)}`);
}

// --- VERIFY OTP ---
export async function verifyOtp(email: string, otp: string) {
  const user = await prisma.user.findFirst({
    where: { email },
  });

  if (!user) return { error: "User not found" };

  if (user.otp !== otp) return { error: "Invalid OTP" };
  if (!user.otpExpiresAt || user.otpExpiresAt < new Date())
    return { error: "OTP Expired" };

  // Verify User
  await prisma.user.update({
    where: { id: user.id },
    data: {
      emailVerified: new Date(),
      otp: null,
      otpExpiresAt: null,
    },
  });

  // Create Session
  await createSession(user.id, user.businessId, user.role);
  redirect("/dashboard");
}

// --- LOGIN ---
export async function login(prevState: any, formData: FormData) {
  const email = formData.get("email") as string;
  const password = formData.get("password") as string;

  // 1. Find User
  const user = await prisma.user.findFirst({
    where: { email },
    include: { business: true },
  });

  if (!user || !user.password) {
    return { error: "Invalid credentials" };
  }

  // 2. Verify Password
  const passwordsMatch = await bcrypt.compare(password, user.password);
  if (!passwordsMatch) {
    return { error: "Invalid credentials" };
  }

  // 3. Check Verification Status
  if (!user.emailVerified) {
    // Generate new OTP
    const otp = crypto.randomInt(100000, 999999).toString();
    const otpExpiresAt = new Date(Date.now() + 15 * 60 * 1000);

    // Save OTP
    await prisma.user.update({
      where: { id: user.id },
      data: { otp, otpExpiresAt },
    });

    // Send Email
    await sendEmail({
      to: email,
      subject: "Verify your Account",
      html: `<h1>${otp}</h1><p>Please verify your account to login.</p>`,
    });

    // Force redirect to verify
    redirect(`/verify?email=${encodeURIComponent(email)}`);
  }

  // 4. Create Session
  await createSession(user.id, user.businessId, user.role);

  // 5. Redirect based on role
  if (user.role === "SUPER_ADMIN") {
    redirect("/admin/dashboard");
  } else {
    redirect("/dashboard");
  }
}

// --- LOGOUT ---
export async function logout() {
  await deleteSession();
  redirect("/login");
}

// --- RESEND OTP ---
export async function resendOtp(email: string) {
  const user = await prisma.user.findFirst({ where: { email } });
  if (!user) return { error: "User not found" };

  const otp = crypto.randomInt(100000, 999999).toString();
  const otpExpiresAt = new Date(Date.now() + 15 * 60 * 1000);

  await prisma.user.update({
    where: { id: user.id },
    data: { otp, otpExpiresAt },
  });

  const res = await sendEmail({
    to: email,
    subject: "Resend Verification Code",
    html: `<h1>${otp}</h1><p>Your new verification code.</p>`,
  });

  if (!res.success) return { error: "Failed to send email" };

  return { success: "Code sent successfully" };
}
