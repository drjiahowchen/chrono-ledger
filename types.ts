import { NextRequest, NextResponse } from "next/server";
import type { Inquiry } from "@/lib/types";

export async function POST(request: NextRequest) {
  const body = (await request.json()) as Partial<Inquiry>;

  if (!body.watchId || !body.dealerId || !body.userContact) {
    return NextResponse.json({ message: "缺少必要詢價資料" }, { status: 400 });
  }

  const inquiry: Inquiry = {
    watchId: body.watchId,
    dealerId: body.dealerId,
    userContact: body.userContact,
    message: body.message ?? "",
    createdAt: new Date().toISOString()
  };

  return NextResponse.json({
    message: "詢價已建立",
    inquiry
  });
}
