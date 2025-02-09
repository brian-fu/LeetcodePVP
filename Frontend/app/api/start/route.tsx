import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  try {
    const { username } = await request.json();

    if (!username) {
      return NextResponse.json({ error: "Username is required" }, { status: 400 });
    }

    const response = await fetch("https://goose-mkaram.csclub.cloud/start", {
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

    // Check if the user is the host
    if (data.error && data.error === "Only the host can start the game") {
      return NextResponse.json({ error: "Only the host can start the game" }, { status: 403 });
    }

    return NextResponse.json(data);
  } catch (error) {
    console.error("Error in /api/start:", error);
    return NextResponse.json(
      {
        error: error instanceof Error ? error.message : "Failed to start game",
      },
      { status: 500 }
    );
  }
}