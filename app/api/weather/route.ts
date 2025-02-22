
import { NextRequest, NextResponse } from "next/server";
import axios from "axios";
import { RateLimiterMemory } from "rate-limiter-flexible";


const rateLimiter = new RateLimiterMemory({
  points: 10, // Number of requests allowed
  duration: 60, // Time window in seconds (1 minute)
});

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const lat = searchParams.get("lat");
  const lon = searchParams.get("lon");
  const query = searchParams.get("q");

  // Get the client's IP address
  const ip =
    request.headers.get("x-forwarded-for")?.split(",")[0] ||
    request.ip ||
    "unknown";

  try {
    // Check rate limit
    await rateLimiter.consume(ip); // Consume 1 point for this IP

    let url = "";
    if (lat && lon) {
      // Fetch weather by coordinates
      url = `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&units=metric&appid=${process.env.WEATHER_API_KEY}`;
    } else if (query) {
      // Fetch suggestions by city name
      url = `https://api.openweathermap.org/data/2.5/find?q=${query}&type=like&units=metric&appid=${process.env.WEATHER_API_KEY}`;
    } else {
      return NextResponse.json(
        { error: "Missing parameters" },
        { status: 400 }
      );
    }

    const response = await axios.get(url);
    return NextResponse.json(response.data);
  } catch (rateLimiterError) {
    // Handle rate limit exceeded
    if (rateLimiterError instanceof Error) {
      return NextResponse.json(
        { error: "Too many requests. Please try again later." },
        { status: 429 }
      );
    }

    // Handle other errors
    return NextResponse.json(
      { error: "Failed to fetch weather data" },
      { status: 500 }
    );
  }
}