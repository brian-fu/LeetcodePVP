import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  try {
    const { game_code } = await request.json();

    if (!game_code) {
      return NextResponse.json({ error: "Game code is required" }, { status: 400 });
    }

    const response = await fetch("https://goose-mkaram.csclub.cloud/status", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ game_code }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error("Flask server error:", errorText);
      throw new Error(`Server error: ${errorText}`);
    }

    const data = await response.json();
    return NextResponse.json(data);
  } catch (error) {
    console.error("Error in /api/status:", error);
    return NextResponse.json(
      {
        error: error instanceof Error ? error.message : "Failed to fetch game status",
      },
      { status: 500 }
    );
  }
} 