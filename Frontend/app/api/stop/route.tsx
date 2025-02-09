import { NextRequest, NextResponse } from "next/server";
export async function POST(request: NextRequest) {
  console.log("stop route");
  try {
    const body = await request.json();
    console.log("Request body received:", body); // Debug the received body
    
    const username = body.username;
    if (!username) {
      return NextResponse.json({ error: "Username is required" }, { status: 400 });
    }

    const response = await fetch("https://goose-mkaram.csclub.cloud/stop", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ username }), // Pass username directly
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error("Flask server error:", errorText);
      throw new Error(`Server error: ${errorText}`);
    }

    const data = await response.json();
    return NextResponse.json(data);
  } catch (error) {
    console.error("Error in /api/stop:", error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Failed to stop game" },
      { status: 500 }
    );
  }
}