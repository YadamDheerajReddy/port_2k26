import { NextResponse } from "next/server";
import { Resend } from "resend";
import { profile } from "@/lib/content";

const resend = new Resend(process.env.RESEND_API_KEY);

const RATE_LIMIT_WINDOW_MS = 10 * 60 * 1000;
const RATE_LIMIT_MAX = 3;
const submissionsByIp = new Map<string, number[]>();

function isRateLimited(ip: string) {
  const now = Date.now();
  const timestamps = (submissionsByIp.get(ip) ?? []).filter(
    (t) => now - t < RATE_LIMIT_WINDOW_MS,
  );
  timestamps.push(now);
  submissionsByIp.set(ip, timestamps);
  return timestamps.length > RATE_LIMIT_MAX;
}

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export async function POST(request: Request) {
  const ip = request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ?? "unknown";

  if (isRateLimited(ip)) {
    return NextResponse.json(
      { error: "Too many messages sent recently. Please try again later." },
      { status: 429 },
    );
  }

  const body = await request.json().catch(() => null);
  if (!body) {
    return NextResponse.json({ error: "Invalid request." }, { status: 400 });
  }

  const { name, email, message, company } = body as Record<string, unknown>;

  // Honeypot: real visitors never see or fill this field.
  if (typeof company === "string" && company.trim().length > 0) {
    return NextResponse.json({ ok: true });
  }

  if (
    typeof name !== "string" ||
    typeof email !== "string" ||
    typeof message !== "string" ||
    name.trim().length < 2 ||
    !EMAIL_RE.test(email) ||
    message.trim().length < 10 ||
    message.length > 5000
  ) {
    return NextResponse.json(
      { error: "Please fill in every field correctly." },
      { status: 400 },
    );
  }

  try {
    await resend.emails.send({
      from: `Portfolio contact form <${profile.email}>`,
      to: profile.email,
      replyTo: email,
      subject: `New message from ${name}`,
      text: `${message}\n\nFrom: ${name} <${email}>`,
    });
  } catch {
    return NextResponse.json(
      { error: "Could not send your message right now. Please try again shortly." },
      { status: 502 },
    );
  }

  return NextResponse.json({ ok: true });
}
