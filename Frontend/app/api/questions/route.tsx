import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
    console.log(request);
  try {
    const response = await fetch("https://goose-mkaram.csclub.cloud/questions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error("Flask server error:", errorText);
      throw new Error(`Server error: ${errorText}`);
    }

    const data = await response.json();
    return NextResponse.json(data);
  } catch (error) {
    console.error("Error in /api/questions:", error);
    return NextResponse.json(
      {
        error: error instanceof Error ? error.message : "Failed to fetch questions",
      },
      { status: 500 }
    );
  }
} 