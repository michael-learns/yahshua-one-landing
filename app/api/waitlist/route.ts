import { NextRequest, NextResponse } from "next/server";

const NOTION_API_KEY = process.env.NOTION_API_KEY!;
const NOTION_DATABASE_ID = process.env.NOTION_DATABASE_ID!;
const AGENTMAIL_API_KEY = process.env.AGENTMAIL_API_KEY!;
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

async function sendNotificationEmail(entry: {
  name: string;
  email: string;
  company?: string;
  size?: string;
}) {
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
    `https://api.agentmail.to/v0/inboxes/${AGENTMAIL_INBOX}/messages`,
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
      console.error("[waitlist] Notion error:", result.error);
      return NextResponse.json(
        { success: false, message: "Something went wrong. Please try again." },
        { status: 500 }
      );
    }

    // Fire-and-forget notification (don't await — don't block response)
    if (!result.alreadyExists) {
      sendNotificationEmail({ name, email, company, size }).catch((e) =>
        console.error("[waitlist] Email notify error:", e)
      );
    }

    return NextResponse.json({
      success: true,
      message: "You're on the list! We'll keep you posted as we build.",
    });
  } catch (err) {
    console.error("[waitlist] Unhandled error:", err);
    return NextResponse.json(
      { success: false, message: "Something went wrong on our end. Please try again shortly." },
      { status: 500 }
    );
  }
}
