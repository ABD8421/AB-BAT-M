import { NextResponse } from "next/server";
import { getAdminSession } from "@/lib/auth";
import { getMessages, markMessageRead, deleteMessage } from "@/lib/db";

export const runtime = "nodejs";

export async function GET() {
  const admin = await getAdminSession();
  if (!admin) {
    return NextResponse.json({ ok: false, message: "Unauthorized" }, { status: 401 });
  }

  const messages = getMessages();
  return NextResponse.json({ ok: true, messages });
}

export async function PATCH(request: Request) {
  const admin = await getAdminSession();
  if (!admin) {
    return NextResponse.json({ ok: false, message: "Unauthorized" }, { status: 401 });
  }

  try {
    const body = await request.json();
    const { id, read } = body;

    if (!id) {
      return NextResponse.json({ ok: false, message: "Message id is required" }, { status: 400 });
    }

    markMessageRead(id, Boolean(read));
    return NextResponse.json({ ok: true, messages: getMessages() });
  } catch (error) {
    console.error("Messages PATCH error:", error);
    return NextResponse.json({ ok: false, message: "Server error" }, { status: 500 });
  }
}

export async function DELETE(request: Request) {
  const admin = await getAdminSession();
  if (!admin) {
    return NextResponse.json({ ok: false, message: "Unauthorized" }, { status: 401 });
  }

  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get("id");

    if (!id) {
      return NextResponse.json({ ok: false, message: "Message id is required" }, { status: 400 });
    }

    deleteMessage(id);
    return NextResponse.json({ ok: true, messages: getMessages() });
  } catch (error) {
    console.error("Messages DELETE error:", error);
    return NextResponse.json({ ok: false, message: "Server error" }, { status: 500 });
  }
}

