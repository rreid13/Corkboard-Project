# Corkboard

> A personalised desktop-style productivity dashboard designed around the information I need throughout my day.

[preview image]

## Why I Built It

I built Corkboard as a personal productivity dashboard inspired by the physical corkboards and scraps of paper I use to organise my day.

Existing productivity apps tend to prioritise generic task management, whereas I wanted to combine information I regularly check throughout the day from multiple apps and websites — including reminders, weather, tides, working hours, calendar information, and daily observances — into one place.

The project is intentionally highly personalised rather than designed as a universal productivity application. This gave me the freedom to experiment with interaction, visual design, APIs, and different approaches to presenting information without having to compromise the interface for a broad user base.

## The Problem

Throughout the day, I regularly check several different sources of information. Reminders, weather forecasts, tide times, working hours, calendar information and other small pieces of information are all useful, but they are usually separated across different applications and websites.

I wanted a single place where I could see the information most relevant to me without having to open multiple applications or navigate through different interfaces.

I also wanted the information to be presented in a way that felt personal rather than like a conventional productivity application.

## The Solution

Corkboard combines these different sources of information into a single interactive dashboard designed to resemble a physical corkboard.

Rather than using a conventional grid of cards and buttons, the interface is made up of illustrated objects that act as both visual elements and interactive controls. Pens can be used to enter editing modes, cards can expand to reveal additional information, and weather conditions change the graphical assets displayed on the board.

The result is a dashboard that functions as a productivity tool while retaining the visual character of a physical corkboard.

## Features

### Current Features

- **Interactive reminders**
  - Add and delete reminders directly from the corkboard
  - Persistent storage using JSON
  - Edit mode controlled through an interactive pen

- **Weather**
  - Current weather condition
  - Current temperature
  - Daily high and low
  - 12-hour forecast
  - Five-day forecast
  - Weather-specific graphical assets
  - Automatically updates based on the selected location

- **Tides**
  - Upcoming high and low tide
  - Expandable weather/tide card
  - Tide data retrieved from the Irish Marine Institute

- **Work Hours**
  - Daily working hours
  - Personalised working-hour schedule
  - Automatic calculation and display of daily hours
  - Interactive editing mode
  - Day-off functionality

- **Calendar**
  - Current date
  - Calendar interface

- **Daily Observances**
  - Displays a randomly selected secular/national observance for the current day
  - Uses a local JSON dataset rather than an external API
  - Includes national, international and cultural observances

- **Location Selection**
  - Switch between different saved locations
  - Weather data updates automatically when the location changes

## How It Works

Corkboard is served locally using a Node.js and Express backend.

The frontend is responsible for displaying the corkboard, handling user interaction, and communicating with the backend. JavaScript retrieves data from local JSON files and backend API endpoints, then dynamically updates the relevant elements of the interface.

The backend acts as an intermediary between the frontend, local data files, and external APIs. This allows data such as reminders and working hours to be modified and persisted while external API requests are handled outside of the client-side code.

## Technical Implementation

### Frontend

- HTML for the corkboard structure
- CSS for positioning, responsive sizing, transitions and animations
- JavaScript for DOM manipulation and user interaction
- Fetch API for communicating with backend endpoints
- Local JSON datasets for static information

### Backend

- Node.js
- Express
- REST-style API endpoints
- File system operations for JSON persistence
- Server-side requests to external APIs

### Data & APIs

- **Open-Meteo** for weather data
- **Irish Marine Institute ERDDAP** for tide predictions
- Local JSON datasets for reminders, working hours and daily observances

API requests for external data are routed through the Node.js backend rather than being made directly from client-side JavaScript.

## Design & UX

### Interaction Design

- The corkboard is the primary interface rather than a conventional dashboard
- Objects such as pens act as interactive tools
- Hover states provide visual feedback
- The weather/tide card expands to reveal additional information
- Editing modes change the behaviour and appearance of individual sections
- Weather conditions determine which graphical animation is displayed
- Location selection allows the information displayed to change based on context

Rather than placing conventional buttons over the interface, I wanted interactions to feel like manipulating a physical corkboard.

### Visual Design

The interface is built around a hand-drawn, illustrated aesthetic designed to resemble a real physical corkboard.

Individual assets were created specifically for the project, including the background, cards, sticky notes, pens and weather graphics. Positioning is based largely on relative measurements so that the illustrated layout remains consistent across different window dimensions.

## Challenges & What I Learned

### Connecting Frontend and Backend

Initially, reminders were loaded directly from a JSON file. When I wanted to add functionality that could modify the data, I needed a backend capable of reading and writing the file.

I implemented Express endpoints for retrieving, adding and deleting reminders, allowing the frontend to communicate with the JSON data through HTTP requests.

### Persistent Data

Adding a reminder dynamically to the page was relatively straightforward, but making the change persistent required communication between the browser, Express, and the JSON file.

This helped me understand the difference between changing the state of a webpage and actually persisting that state so that it remains after the page is refreshed.

### Working with External APIs

The project uses external APIs for information that changes regularly, including weather and tide data.

I learned how to construct API requests, process JSON responses, create backend proxy endpoints, and transform external data into a format that could be used by the frontend.

I also encountered practical issues such as API credit limits and unreliable services. This led me to reconsider which information actually needed to come from an API. For static information such as daily observances, I instead use a local JSON dataset.

### Responsive Positioning

Because the interface is designed around a fixed illustrated corkboard rather than a conventional responsive layout, maintaining the relative positioning of interactive elements and information across different window dimensions became an important CSS challenge.

I experimented with percentages, pixel dimensions, viewport units, and CSS calculations to find suitable approaches for different elements. Through this, I developed a much better understanding of how CSS positioning and responsive sizing can be combined to create non-standard layouts.

## Future Development

### Short Term

- Complete remaining weather graphics
- Improve API error handling
- Add calendar event interaction
- Improve editing functionality
- Refine responsive behaviour
- Improve visual transitions and animations

### Long Term

- Apple Calendar and Reminders integration
- Seasonal visual themes
- Tide visualisation
- Automatic switching between university and work schedules
- Additional location-specific information
- Package as a desktop application

## Project Status

**Active development**

The core corkboard interface, interactive reminder system, weather integration, tide integration, work-hours editor, location selection and daily observance system are currently implemented.

Further development is focused on refining the interface, improving responsiveness and adding additional integrations and functionality.
