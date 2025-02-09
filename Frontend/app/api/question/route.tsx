import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  try {
    const { id } = await request.json();

    if (!id) {
      return NextResponse.json({ error: "Question ID is required" }, { status: 400 });
    }

    const response = await fetch("https://goose-mkaram.csclub.cloud/question", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ id }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error("Flask server error:", errorText);
      throw new Error(`Server error: ${errorText}`);
    }

    const data = await response.json();
    return NextResponse.json(data);
  } catch (error) {
    console.error("Error in /api/question:", error);
    return NextResponse.json(
      {
        error: error instanceof Error ? error.message : "Failed to fetch question",
      },
      { status: 500 }
    );
  }
} 