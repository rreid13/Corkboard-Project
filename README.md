# Corkboard

> A personalised desktop-style productivity dashboard designed around the information I need throughout my day

[preview image]

## Why I Built it
I built Corkboard as a personal productivity dashboard inspired by the physical corkboards and scraps of paper I use to organise my day. 
Existing productivity apps prioritise generic task manangement, whereas I wanted to combine the information I often check throughout the day from multiple apps and websites (reminders, weather, tides, work hours, calendar events, and other information) in one place

The project is extremely personalised rather than designed as a universal productivity application. This gave me the freedom to experiment with interaction, visual design, and APIs without compromising the UI and design for a broad user base.

## The Problem


## The Solution

## Features
### Current Features
- **Interactive reminders**
  - Add and delete reminders directly from the corkboard
  - Persistent storage using JSON
  - Edit mode controlled through an interactive pen
- **Weather**
  - Current weather condition
  - Current temperature
  - Daily high/low
  - 12-hour forecast
  - Weather-specific graphical assets
- **Tides**
  - Upcoming high and low tide
  - Expandable weather/tide card
  - API-driven tide data
-**Work Hours**
  - Daily working hours
  - Personalised calculation/display
-**Calendar**
  - Current date
  - Calendar interface
## How It Works

## Technical Implementation
### Frontend
- HTML for the corkboard structure
- CSS for positioning, responsive sizing and animations
- JavaScript for DOM manipulation and user interaction
### Backend
- Node.js with Express
- REST-style endpoints for reminders and external data
- JSON file persistence for personal data
- Environment variables for API credentials
### APIs
- Weather API
- Tides API

API requests are routed through the Node.js backend rather than exposing API keys in client-side JavaScript

## Design & UX
### Interaction design
- The corkboard is the primary interface rather than a conventional dashboard
- Objects such as the pen act as interactive tools
- Hover states provide visual feedback
- The weather/tide card and Today envelope expand to reveal additional information
- Edit mode changes the behaviour of different sections
- Weather conditions determine which graphical animation is displayed
Rather than placing conventional buttons over the interface, I wanted interactions to feel like manipulating a physical corkboard

## Challenges & What I Learned
### Connecting frontend and backend
Initially reminders were loaded directly from a JSON file. When I wanted to add interactivity to modify the data, I needed a backend capable of reading and writing the file. I implemented express endpoints for retrieving, adding, and deleting reminders.

### Persistent Data
Adding a reminder dynamically to the page was relatively straightforward, but making the change persistent required communication between the browser, Express, and the JSON file.

### Responsive positioning
Because the interface is designed around a fixed illustrated corkboard rather than a conventional responsive layout, maintaining relative positioning of interactive elements and information across different window dimensions became an important CSS challenge. I combatted this by experimenting with using percentages, pixel dimensions, viewport dimensions, and calculations using a mixture of solutions. Through this I learned a lot about CSS capabilities and different ways it can be used to solve one problem.

## Future Development
### Short Term
- Complete weather and tide API integration
- Improve API error handling
- complete remaining weather graphics
- Add calendar event interaction
- Improve editing functionality

### Long term
- Apple calendar and reminders integration
- Seasonal visual themes
- Tide visualisation
- Automatic switching between university and work schedules
- Package as a desktop application

## Project Status
Active development

The core corkboard interface and interactive reminder system are
implemented. Weather, tide and calendar functionality are currently
being developed and integrated with external APIs.
