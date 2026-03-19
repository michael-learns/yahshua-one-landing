import { NextRequest, NextResponse } from "next/server";
import { promises as fs } from "fs";
import path from "path";

const DATA_FILE = path.join(process.cwd(), "data", "waitlist.json");

interface WaitlistEntry {
  name: string;
  email: string;
  company?: string;
  size?: string;
  joinedAt: string;
}

async function readWaitlist(): Promise<WaitlistEntry[]> {
  try {
    const raw = await fs.readFile(DATA_FILE, "utf-8");
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

async function writeWaitlist(entries: WaitlistEntry[]): Promise<void> {
  await fs.mkdir(path.dirname(DATA_FILE), { recursive: true });
  await fs.writeFile(DATA_FILE, JSON.stringify(entries, null, 2), "utf-8");
}

function isValidEmail(email: string): boolean {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim());
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();

    const name = (body.name ?? "").trim();
    const email = (body.email ?? "").trim().toLowerCase();
    const company = (body.company ?? "").trim() || undefined;
    const size = (body.size ?? "").trim() || undefined;

    // Validate required fields
    if (!name) {
      return NextResponse.json(
        { success: false, message: "Full name is required." },
        { status: 400 }
      );
    }

    if (!email) {
      return NextResponse.json(
        { success: false, message: "Email address is required." },
        { status: 400 }
      );
    }

    if (!isValidEmail(email)) {
      return NextResponse.json(
        { success: false, message: "Please enter a valid email address." },
        { status: 400 }
      );
    }

    const entries = await readWaitlist();

    // Deduplicate by email — return success silently
    const alreadyExists = entries.some((e) => e.email === email);
    if (alreadyExists) {
      return NextResponse.json({
        success: true,
        message: "You're on the list! We'll keep you posted as we build.",
      });
    }

    const newEntry: WaitlistEntry = {
      name,
      email,
      ...(company && { company }),
      ...(size && { size }),
      joinedAt: new Date().toISOString(),
    };

    entries.push(newEntry);
    await writeWaitlist(entries);

    return NextResponse.json({
      success: true,
      message: "You're on the list! We'll keep you posted as we build.",
    });
  } catch (err) {
    console.error("[waitlist] Error:", err);
    return NextResponse.json(
      {
        success: false,
        message: "Something went wrong on our end. Please try again shortly.",
      },
      { status: 500 }
    );
  }
}
