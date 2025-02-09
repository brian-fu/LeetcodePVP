import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  try {
    const { username, code, game_code } = await request.json();

    if (!username || !code || !game_code) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }

    const response = await fetch("https://goose-mkaram.csclub.cloud/execute", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ username, code, game_code }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error("Flask server error:", errorText);
      throw new Error(`Server error: ${errorText}`);
    }

    const data = await response.json();
    return NextResponse.json(data);
  } catch (error) {
    console.error("Error in /api/submit:", error);
    return NextResponse.json(
      {
        error: error instanceof Error ? error.message : "Failed to execute code",
      },
      { status: 500 }
    );
  }
}