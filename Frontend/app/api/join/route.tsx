import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  try {
    const { username } = await request.json();

    if (!username) {
      return NextResponse.json({ error: "Username is required" }, { status: 400 });
    }

    const response = await fetch("https://goose-mkaram.csclub.cloud/join", {
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
    console.log("Response from join endpoint:", data);
    return NextResponse.json(data);
  } catch (error) {
    console.error("Error in /api/join:", error);
    return NextResponse.json(
      {
        error: error instanceof Error ? error.message : "Failed to join game",
      },
      { status: 500 }
    );
  }
}