"use client";

import { useState, useEffect } from "react";
import axios from "axios";

// Define types for the weather data
interface WeatherData {
  name?: string;
  main?: {
    temp: number;
    feels_like: number;
    humidity: number;
  };
  weather?: {
    description: string;
  }[];
  wind?: {
    speed: number;
  };
  coord?: {
    lat: number;
    lon: number;
  };
  sys?: {
    country: string;
  };
}

export default function Home() {
  const [location, setLocation] = useState<string>("");
  const [data, setData] = useState<WeatherData>({});
  const [error, setError] = useState<string | null>(null);
  const [suggestions, setSuggestions] = useState<WeatherData[]>([]);
  const [selectedIndex, setSelectedIndex] = useState<number>(-1);

  useEffect(() => {
    // Set the single background image directly in CSS
    document.documentElement.style.setProperty(
      "--random-bg",
      "url('/nature-1959229_1920.jpg')"
    );

    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const { latitude, longitude } = position.coords;
          fetchWeatherByCoordinates(latitude, longitude);
        },
        (err) => {
          setError(
            "Could not retrieve location. Please try to search your location."
          );
        }
      );
    } else {
      setError("Geolocation is not supported by this browser.");
    }
  }, []);

  const fetchWeatherByCoordinates = async (lat: number, lon: number) => {
    try {
      const res = await axios.get(`/api/weather?lat=${lat}&lon=${lon}`);
      setData(res.data);
      setError(null);
      setSuggestions([]);
    } catch (err) {
      setError("Failed to fetch weather data");
    }
  };

  const handleInputChange = async (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    const userInput = e.target.value;
    setLocation(userInput);

    if (userInput.length > 2) {
      try {
        const response = await axios.get(`/api/weather?q=${userInput}`);
        setSuggestions(response.data.list || []);
      } catch (err) {
        setSuggestions([]);
      }
    } else {
      setSuggestions([]);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "ArrowDown") {
      setSelectedIndex((prevIndex) =>
        Math.min(prevIndex + 1, suggestions.length - 1)
      );
    } else if (e.key === "ArrowUp") {
      setSelectedIndex((prevIndex) => Math.max(prevIndex - 1, 0));
    } else if (e.key === "Enter" && selectedIndex >= 0) {
      handleCitySelect(suggestions[selectedIndex]);
    }
  };

  const handleCitySelect = (city: WeatherData) => {
    setLocation(city.name || "");
    if (city.coord) {
      fetchWeatherByCoordinates(city.coord.lat, city.coord.lon);
    }
    setSuggestions([]);
    setSelectedIndex(-1);
  };

  return (
    <div className="app">
      <div className="search">
        <input
          value={location}
          onChange={handleInputChange}
          onKeyDown={handleKeyDown}
          placeholder="Enter Location"
          type="text"
        />
      </div>

      {error && !data.name && <p>{error}</p>}

      {suggestions.length > 0 && (
        <div className="suggestions-dropdown">
          {suggestions.map((city, index) => (
            <div
              key={index}
              className={`suggestion-item ${
                selectedIndex === index ? "selected" : ""
              }`}
              onClick={() => handleCitySelect(city)}
            >
              {city.name}, {city.sys?.country}
            </div>
          ))}
        </div>
      )}

      <div className="container">
        <div className="top">
          <div>
            <div className="location">{data.name && <p>{data.name}</p>}</div>
            <div className="temp">
              {data.main && (
                <h1>
                  {data.main.temp.toFixed()}{" "}
                  <small>
                    <sup>&deg;C</sup>
                  </small>
                </h1>
              )}
            </div>
          </div>
          <div className="description">
            {data.weather && <p>{data.weather[0]?.description}</p>}
          </div>
        </div>

        <div className="bottom">
          <div className="feels">
            {data.main && (
              <p>
                {data.main.feels_like.toFixed()}{" "}
                <small>
                  <sup>&deg;C</sup>
                </small>
              </p>
            )}
            <p>Feels</p>
          </div>
          <div className="humidity">
            {data.main && <p>{data.main.humidity}</p>}
            <p>Humidity</p>
          </div>
          <div className="wind">
            {data.wind && <p>{data.wind.speed} KPH</p>}
            <p>Wind</p>
          </div>
        </div>
      </div>
    </div>
  );
}