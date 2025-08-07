# Advanced Weather Dashboard

![Weather Dashboard](https://placeholder.svg?height=300&width=600&text=Weather+Dashboard)

## Description

Advanced Weather Dashboard is a comprehensive, AI-powered weather application that provides real-time weather data, forecasts, air quality information, and climate insights. Built with Next.js and React, this application offers an intuitive interface with interactive maps, personalized weather alerts, and environmental gamification features to make weather monitoring both informative and engaging.

## Tech Stack

- **Frontend**: 
  - Next.js 14 (App Router)
  - React 18
  - TypeScript
  - Tailwind CSS
  - shadcn/ui components
  - Leaflet.js (for interactive maps)

- **Backend**:
  - Next.js API Routes
  - Server Actions
  - OpenWeatherMap API integration

- **AI & Data**:
  - AI-powered weather insights
  - Climate data analysis
  - Historical weather comparisons

- **State Management**:
  - React Hooks
  - Context API

- **Styling**:
  - Tailwind CSS
  - CSS Variables for theming
  - Dark/Light mode support

## Features

### Core Weather Features
- **Real-time Weather Data**: Current conditions including temperature, humidity, wind speed, and more
- **7-Day Forecast**: Extended weather predictions with daily high/low temperatures
- **Hourly Forecast**: Detailed hour-by-hour weather conditions
- **Location-based Weather**: Automatic geolocation or manual city search
- **Voice Search**: Search for locations using voice commands

### Advanced Features
- **Interactive Weather Map**: Dynamic map with multiple weather layers (precipitation, wind, temperature, etc.)
- **Air Quality Dashboard**: Real-time air quality index and pollutant information
- **Climate Insight Engine**: AI-powered analysis of climate patterns and anomalies
- **Historical Weather Comparisons**: Compare current weather with historical data
- **Smart Custom Alerts**: Personalized weather alerts based on conditions
- **Environmental Gamification**: Earn digital trees and achievements for eco-friendly actions

### User Experience
- **Responsive Design**: Optimized for all device sizes
- **Dark/Light Mode**: Theme toggle with system preference detection
- **Accessibility**: ARIA-compliant components and keyboard navigation
- **Demo Mode**: Fully functional demo with simulated weather data

## How to Run

### Prerequisites
- Node.js 18.0.0 or later
- npm or yarn package manager

### Installation

1. Clone the repository:
   \`\`\`bash
   git clone https://github.com/yourusername/weather-dashboard.git
   cd weather-dashboard
   \`\`\`

2. Install dependencies:
   \`\`\`bash
   npm install
   # or
   yarn install
   \`\`\`

3. (Optional) For production with real weather data, create a `.env.local` file:
   \`\`\`
   OPENWEATHER_API_KEY=your_api_key_here
   \`\`\`
   
   **Note**: The application works fully in demo mode without an API key.

4. Run the development server:
   \`\`\`bash
   npm run dev
   # or
   yarn dev
   \`\`\`

5. Open [http://localhost:3000](http://localhost:3000) in your browser to see the application.

### Building for Production

\`\`\`bash
npm run build
npm start
# or
yarn build
yarn start
\`\`\`

### Environment Variables

The application supports the following environment variables:

- `OPENWEATHER_API_KEY` (optional): Server-side API key for OpenWeatherMap
- All API keys are kept secure on the server side and never exposed to the client

## Security

This application follows security best practices:

- **API Key Protection**: All API keys are kept server-side only
- **No Client-side Secrets**: Sensitive data never reaches the browser
- **Secure API Routes**: Weather data is fetched through secure server endpoints
- **Demo Mode**: Full functionality available without requiring API keys

## AI Usage Explanation

This project leverages AI in several key areas to enhance the user experience and provide deeper insights:

### 1. Weather Insights Generation
The application uses AI to analyze weather data and generate natural language insights about current conditions, outfit recommendations, and activity suggestions based on the weather.

### 2. Climate Pattern Analysis
The Climate Insight Engine uses AI to detect anomalies in temperature patterns, identify climate shifts, and provide context about how current weather compares to historical norms.

### 3. Smart Alerts
AI algorithms analyze weather forecasts to generate personalized alerts based on user preferences and location-specific weather risks.

### 4. Voice Recognition
The voice search feature uses speech recognition AI to convert spoken city names into text queries.

### 5. Historical Weather Comparisons
AI helps analyze and present meaningful comparisons between current weather and historical data, highlighting significant patterns and changes.

### 6. Personalized Recommendations
The application uses AI to provide tailored recommendations for activities, clothing, and precautions based on current and forecasted weather conditions.

## Deployment

This application is designed to be deployed on Vercel with zero configuration:

1. Push your code to GitHub
2. Connect your repository to Vercel
3. Deploy automatically
4. (Optional) Add environment variables in Vercel dashboard for production API access

The application works fully in demo mode without any environment variables.

## License

MIT

## Acknowledgments

- Weather data provided by OpenWeatherMap API
- Icons by Lucide React
- UI components by shadcn/ui
- Map functionality by Leaflet.js
