# [Weather App](https://weather-app-v2-kappa.vercel.app/)

A Next.js weather application that fetches real-time weather data using the OpenWeatherMap API. The app features client-side interactivity, server-side API routes for security, rate limiting to prevent abuse, and optional authentication for protected access. The app uses TypeScript for type safety and global CSS for styling.

## Table of Contents

- [Features](#features)
- [Technologies](#technologies)
- [Project Structure](#project-structure)
- [Setup Instructions](#setup-instructions)
  - [Prerequisites](#prerequisites)
  - [Installation](#installation)
  - [Environment Variables](#environment-variables)
  - [Running the App](#running-the-app)
- [Usage](#usage)
- [Security Features](#security-features)
  - [API Key Protection](#api-key-protection)
  - [Rate Limiting](#rate-limiting)
  - [Authentication](#authentication)
- [Deployment](#deployment)
  - [Environment Variables in Production](#environment-variables-in-production)
  - [Testing in Production](#testing-in-production)
- [Troubleshooting](#troubleshooting)
- [Contributing](#contributing)
- [License](#license)

---

## Features

- Fetches real-time weather data based on geolocation or user input.
- Displays temperature, feels-like temperature, humidity, wind speed, and weather description.
- Provides city suggestions as the user types (autocomplete).
- Random background images for visual appeal.
- Server-side API routes to hide the OpenWeatherMap API key.
- Rate limiting to prevent abuse (10 requests per minute per IP).
- Optional authentication for protected API access.
- TypeScript for type safety and improved development experience.
- Global CSS for consistent styling.

---

## Technologies

- **Next.js 14** (App Router) - Framework for React with server-side rendering and API routes.
- **TypeScript** - Static typing for JavaScript.
- **Axios** - HTTP client for making API requests.
- **rate-limiter-flexible** - Rate limiting library for API protection.
- **OpenWeatherMap API** - Weather data provider.
- **React** - Client-side interactivity.
- **CSS** - Global styles for layout and design.

---

## Project Structure

```
weather-app/
├── app/
│   ├── api/
│   │   └── weather/
│   │       └── route.ts        # Server-side API route for weather data
│   ├── page.tsx                # Main client-side component
│   ├── layout.tsx              # Root layout with global CSS import
│   └── globals.css             # Global styles
├── public/
│   ├── village-2090495_1920.jpg
│   ├── nature-1959229_1920.jpg
│   ├── pexels-jplenio-3473659.jpg
│   └── sunrise-1959227_1920.jpg  # Background images
├── .env.local                   # Environment variables (not committed)
├── .gitignore                   # Git ignore file
├── package.json                 # Dependencies and scripts
├── tsconfig.json                # TypeScript configuration
└── README.md                    # This file
```

---

## Setup Instructions

### Prerequisites

- **Node.js** (v18 or later) - [Download Node.js](https://nodejs.org/).
- **npm** - Comes with Node.js.
- **OpenWeatherMap API Key** - Sign up at [OpenWeatherMap](https://openweathermap.org/) to get a free API key.

### Installation

1. Clone the repository:

   ```bash
   git clone <repository-url>
   cd weather-app
   ```

2. Install dependencies:

   ```bash
   npm install
   ```

3. Create a `.env.local` file in the root directory:

   ```env
   WEATHER_API_KEY=your-openweathermap-api-key
   INTERNAL_API_KEY=your-secret-internal-key
   NEXT_PUBLIC_INTERNAL_API_KEY=your-public-internal-key
   ```

   - `WEATHER_API_KEY`: Your OpenWeatherMap API key (server-side only).
   - `INTERNAL_API_KEY`: Secret key for server-side authentication (optional).
   - `NEXT_PUBLIC_INTERNAL_API_KEY`: Public key for client-side authentication (optional).

   **Important:** Do not commit `.env.local` to version control. Ensure it is listed in `.gitignore`.

### Environment Variables

- `WEATHER_API_KEY`: Used in `app/api/weather/route.ts` for server-side API calls. Must not have the `NEXT_PUBLIC_` prefix to remain server-side only.
- `INTERNAL_API_KEY`: Used for server-side authentication (optional). Must not have the `NEXT_PUBLIC_` prefix.
- `NEXT_PUBLIC_INTERNAL_API_KEY`: Used for client-side authentication (optional). Must have the `NEXT_PUBLIC_` prefix to be available in the client-side bundle.

### Running the App

1. Start the development server:
   ```bash
   npm run dev
   ```
2. Open the app in your browser: `http://localhost:3000`.

3. Test the app:
   - Allow geolocation to fetch weather data for your current location.
   - Search for a city to see weather details and suggestions.
   - Trigger rate limiting by making more than 10 requests in 1 minute (should return a 429 status).

---

## Usage

- **Geolocation:** On first load, the app requests geolocation access to fetch weather data for your current location.
- **Search:** Enter a city name in the search bar to fetch weather data. Suggestions appear after typing 3 or more characters.
- **Weather Display:** View temperature, feels-like temperature, humidity, wind speed, and weather description.
- **Background Images:** Random background images are displayed on each page load.

---

## Security Features

### API Key Protection

- The OpenWeatherMap API key is stored in `WEATHER_API_KEY` and used only in server-side API routes (`app/api/weather/route.ts`).
- Client-side code calls the internal API route (`/api/weather`), which proxies requests to OpenWeatherMap.
- Users cannot see the API key by inspecting source code or network requests.

### Rate Limiting

- Implemented using `rate-limiter-flexible` in `app/api/weather/route.ts`.
- Limits requests to 10 per minute per IP address (configurable in `route.ts`).
- Exceeding the limit returns a 429 status with the message "Too many requests. Please try again later."
- Uses in-memory storage (`RateLimiterMemory`) for development. For production, consider using Redis for distributed rate limiting.

### Authentication

- Optional authentication is implemented using an internal API key.
- The server-side API route checks for the `Authorization` header with a Bearer token matching `INTERNAL_API_KEY`.
- The client-side code includes the `NEXT_PUBLIC_INTERNAL_API_KEY` in requests to `/api/weather`.
- Unauthorized requests return a 401 status with the message "Unauthorized."

---

## Deployment

### Environment Variables in Production

1. Set environment variables in your hosting provider's dashboard (e.g., Vercel, Netlify):
   - `WEATHER_API_KEY`: Your OpenWeatherMap API key.
   - `INTERNAL_API_KEY`: Secret key for authentication (optional).
   - `NEXT_PUBLIC_INTERNAL_API_KEY`: Public key for client-side authentication (optional).
2. Do not commit `.env.local` to version control. Use hosting provider settings instead.

### Testing in Production

1. Deploy the app to your hosting provider (e.g., Vercel, Netlify).
2. Test weather data fetching and suggestions.
3. Verify rate limiting by making multiple requests (should return 429 after 10 requests in 1 minute).
4. Verify authentication by removing the `Authorization` header (should return 401 if enabled).
5. Inspect network requests to ensure the OpenWeatherMap API key is not exposed.

---

## Troubleshooting

- **API Key Not Working:**
  - Ensure `WEATHER_API_KEY` is set correctly in `.env.local` or production environment variables.
  - Check OpenWeatherMap API usage limits and restrictions.
- **Rate Limiting Not Working:**
  - Verify `rate-limiter-flexible` is installed and configured in `app/api/weather/route.ts`.
  - For production, consider using Redis for distributed rate limiting.
- **Authentication Errors:**
  - Ensure `INTERNAL_API_KEY` and `NEXT_PUBLIC_INTERNAL_API_KEY` are set correctly.
  - Check the `Authorization` header in client-side requests.
- **Styles Not Applied:**
  - Ensure `globals.css` is imported in `app/layout.tsx`.
  - Verify class names in `page.tsx` match those in `globals.css`.

---

## Contributing

1. Fork the repository.
2. Create a new branch: `git checkout -b feature/your-feature`.
3. Make changes and commit: `git commit -m "Add your feature"`.
4. Push to your fork: `git push origin feature/your-feature`.
5. Open a pull request with a detailed description.

---

## License

This project is licensed under the MIT License. See the [LICENSE](LICENSE) file for details.

---

This README is specific to your weather app and covers all aspects of setup, usage, security, and deployment. Make sure to create a `LICENSE` file if you choose to include licensing information. Let me know if you need further customization or additional sections!
