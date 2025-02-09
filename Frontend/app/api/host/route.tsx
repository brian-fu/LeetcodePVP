import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  try {
    const { username } = await request.json();

    if (!username) {
      return NextResponse.json({ error: "Username is required" }, { status: 400 });
    }

    const response = await fetch("https://goose-mkaram.csclub.cloud/create", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ username }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error("Flask server error:", errorText);
      throw new Error(`Server error: ${errorText}`);
    }

    const data = await response.json();
    return NextResponse.json(data);
  } catch (error) {
    console.error("Error in /api/host:", error);
    return NextResponse.json(
      {
        error: error instanceof Error ? error.message : "Failed to create game",
      },
      { status: 500 }
    );
  }
}