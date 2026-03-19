import { NextRequest, NextResponse } from "next/server";

// Read env vars lazily inside functions — avoids module-level init issues on Vercel edge
function getEnv() {
  const NOTION_API_KEY = process.env.NOTION_API_KEY?.trim();
  const NOTION_DATABASE_ID = process.env.NOTION_DATABASE_ID?.trim();
  const AGENTMAIL_API_KEY = process.env.AGENTMAIL_API_KEY?.trim();
  if (!NOTION_API_KEY || !NOTION_DATABASE_ID || !AGENTMAIL_API_KEY) {
    throw new Error(`Missing env vars: NOTION_API_KEY=${!!NOTION_API_KEY} NOTION_DATABASE_ID=${!!NOTION_DATABASE_ID} AGENTMAIL_API_KEY=${!!AGENTMAIL_API_KEY}`);
  }
  return { NOTION_API_KEY, NOTION_DATABASE_ID, AGENTMAIL_API_KEY };
}

const AGENTMAIL_INBOX = "yahshua-one-waitlist@agentmail.to";
const NOTIFY_EMAIL = "michaelbayron@abba.works";

function isValidEmail(email: string): boolean {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim());
}

async function saveToNotion(entry: {
  name: string;
  email: string;
  company?: string;
  size?: string;
  joinedAt: string;
}): Promise<{ success: boolean; alreadyExists?: boolean; error?: string }> {
  const { NOTION_API_KEY, NOTION_DATABASE_ID } = getEnv();
  // Check for duplicate first
  const checkRes = await fetch(
    `https://api.notion.com/v1/databases/${NOTION_DATABASE_ID}/query`,
    {
      method: "POST",
      headers: {
        Authorization: `Bearer ${NOTION_API_KEY}`,
        "Notion-Version": "2022-06-28",
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        filter: { property: "Email", email: { equals: entry.email } },
      }),
    }
  );
  const checkData = await checkRes.json();
  if (checkData.results && checkData.results.length > 0) {
    return { success: true, alreadyExists: true };
  }

  // Create new entry
  const properties: Record<string, unknown> = {
    Name: { title: [{ text: { content: entry.name } }] },
    Email: { email: entry.email },
    "Signed Up": { date: { start: entry.joinedAt } },
  };
  if (entry.company) {
    properties["Company"] = { rich_text: [{ text: { content: entry.company } }] };
  }
  if (entry.size) {
    properties["Company Size"] = { select: { name: entry.size } };
  }

  const createRes = await fetch("https://api.notion.com/v1/pages", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${NOTION_API_KEY}`,
      "Notion-Version": "2022-06-28",
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      parent: { database_id: NOTION_DATABASE_ID },
      properties,
    }),
  });

  if (!createRes.ok) {
    const err = await createRes.json();
    return { success: false, error: err.message };
  }
  return { success: true };
}

async function sendWelcomeEmail(entry: { name: string; email: string }) {
  const { AGENTMAIL_API_KEY } = getEnv();
  const firstName = entry.name.split(" ")[0];
  const html = `
    <div style="font-family: sans-serif; max-width: 560px; margin: 0 auto; color: #1c1a2e;">
      <div style="background: #3730a3; padding: 32px 40px; border-radius: 16px 16px 0 0; text-align: center;">
        <div style="display: inline-flex; align-items: center; justify-content: center; width: 48px; height: 48px; background: rgba(255,255,255,0.15); border-radius: 12px; font-weight: 800; font-size: 22px; color: white; margin-bottom: 12px;">Y</div>
        <h1 style="margin: 0; color: white; font-size: 22px; font-weight: 700;">You're on the list. 🎉</h1>
      </div>
      <div style="background: #ffffff; padding: 36px 40px; border: 1px solid #e8e6f0; border-top: none; border-radius: 0 0 16px 16px;">
        <p style="margin: 0 0 16px; font-size: 16px; line-height: 1.6;">Hi ${firstName},</p>
        <p style="margin: 0 0 16px; font-size: 16px; line-height: 1.6;">
          Thanks for joining the <strong>YAHSHUA One</strong> waitlist. We're genuinely excited you're here.
        </p>
        <p style="margin: 0 0 20px; font-size: 16px; line-height: 1.6;">
          Here's what we're building: a single platform where Filipino businesses can handle <strong>payroll, accounting, tax compliance, and HR</strong> — all in one place, all AI-powered.
        </p>
        <p style="margin: 0 0 20px; font-size: 16px; line-height: 1.6;">
          The big idea? You'll be able to talk to ChatGPT or Claude and get real answers about your business — "How much did we pay in SSS contributions last month?" or "Are all our BIR deadlines covered?" — because your AI will have direct access to your actual data through YAHSHUA One.
        </p>
        <p style="margin: 0 0 28px; font-size: 16px; line-height: 1.6;">
          We're building in public and moving fast. You'll get updates as we hit milestones — no spam, just honest progress reports.
        </p>
        <div style="text-align: center; margin-bottom: 28px;">
          <a href="https://yahshua-one-landing.vercel.app" style="display: inline-block; background: #3730a3; color: white; text-decoration: none; padding: 14px 32px; border-radius: 100px; font-weight: 600; font-size: 15px;">
            Follow Our Progress →
          </a>
        </div>
        <p style="margin: 0; font-size: 15px; line-height: 1.6; color: #5c5878;">
          We hope to get this in your hands as soon as possible. In the meantime, if you have questions or want to share what your business needs most — just reply to this email. We read everything.
        </p>
        <hr style="border: none; border-top: 1px solid #e8e6f0; margin: 28px 0;" />
        <p style="margin: 0; font-size: 13px; color: #9896aa; line-height: 1.6;">
          YAHSHUA One · by ABBA Initiative · Built in the Philippines 🇵🇭<br>
          You received this because you signed up at yahshua-one-landing.vercel.app
        </p>
      </div>
    </div>
  `;

  const text = [
    `Hi ${firstName},`,
    ``,
    `Thanks for joining the YAHSHUA One waitlist. We're genuinely excited you're here.`,
    ``,
    `Here's what we're building: a single platform where Filipino businesses can handle payroll, accounting, tax compliance, and HR — all in one place, all AI-powered.`,
    ``,
    `The big idea? You'll be able to talk to ChatGPT or Claude and get real answers about your business — "How much did we pay in SSS contributions last month?" or "Are all our BIR deadlines covered?" — because your AI will have direct access to your actual data through YAHSHUA One.`,
    ``,
    `We're building in public and moving fast. You'll get updates as we hit milestones — no spam, just honest progress reports.`,
    ``,
    `We hope to get this in your hands as soon as possible. If you have questions or want to share what your business needs most, just reply to this email. We read everything.`,
    ``,
    `Follow our progress: https://yahshua-one-landing.vercel.app`,
    ``,
    `— The YAHSHUA One Team`,
    `ABBA Initiative · Built in the Philippines 🇵🇭`,
  ].join("\n");

  await fetch(
    `https://api.agentmail.to/v0/inboxes/${AGENTMAIL_INBOX}/messages/send`,
    {
      method: "POST",
      headers: {
        Authorization: `Bearer ${AGENTMAIL_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        to: [entry.email],
        subject: `You're on the YAHSHUA One waitlist 🎉`,
        text,
        html,
      }),
    }
  );
}

async function sendNotificationEmail(entry: {
  name: string;
  email: string;
  company?: string;
  size?: string;
}) {
  const { AGENTMAIL_API_KEY, NOTION_DATABASE_ID } = getEnv();
  const body = [
    `🎉 New waitlist signup for YAHSHUA One!`,
    ``,
    `Name: ${entry.name}`,
    `Email: ${entry.email}`,
    `Company: ${entry.company || "—"}`,
    `Size: ${entry.size || "—"}`,
    ``,
    `View all signups: https://notion.so/${NOTION_DATABASE_ID.replace(/-/g, "")}`,
  ].join("\n");

  await fetch(
    `https://api.agentmail.to/v0/inboxes/${AGENTMAIL_INBOX}/messages/send`,
    {
      method: "POST",
      headers: {
        Authorization: `Bearer ${AGENTMAIL_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        to: [NOTIFY_EMAIL],
        subject: `🎉 New YAHSHUA One signup — ${entry.name}`,
        text: body,
      }),
    }
  );
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();

    const name = (body.name ?? "").trim();
    const email = (body.email ?? "").trim().toLowerCase();
    const company = (body.company ?? "").trim() || undefined;
    const size = (body.size ?? "").trim() || undefined;

    if (!name) {
      return NextResponse.json(
        { success: false, message: "Full name is required." },
        { status: 400 }
      );
    }
    if (!email || !isValidEmail(email)) {
      return NextResponse.json(
        { success: false, message: "Please enter a valid email address." },
        { status: 400 }
      );
    }

    const result = await saveToNotion({
      name,
      email,
      company,
      size,
      joinedAt: new Date().toISOString(),
    });

    if (!result.success) {
      console.error("[waitlist] Notion save error:", result.error);
      return NextResponse.json(
        { success: false, message: "Something went wrong. Please try again." },
        { status: 500 }
      );
    }
    console.log("[waitlist] Saved to Notion. alreadyExists:", result.alreadyExists);

    // Fire-and-forget emails (don't await — don't block response)
    if (!result.alreadyExists) {
      // Welcome email to the new signup
      sendWelcomeEmail({ name, email }).catch((e) =>
        console.error("[waitlist] Welcome email error:", e)
      );
      // Internal notification to Michael
      sendNotificationEmail({ name, email, company, size }).catch((e) =>
        console.error("[waitlist] Email notify error:", e)
      );
    }

    return NextResponse.json({
      success: true,
      message: "You're on the list! We'll keep you posted as we build.",
    });
  } catch (err) {
    console.error("[waitlist] Unhandled error:", JSON.stringify(err), err);
    return NextResponse.json(
      { success: false, message: "Something went wrong on our end. Please try again shortly." },
      { status: 500 }
    );
  }
}
