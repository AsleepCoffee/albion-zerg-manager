# Albion Zerg Manager

## To do

Make it look perdy.

Eventually include guild front page to select guild and properly implement authentication with a cookie. Need guild id for db for the guild section separate to use the same db. Could try running one db per guild.


## Project Summary


Albion Zerg Manager is a comprehensive tool designed to facilitate the management of large-scale events, specifically for the game Albion Online. The application enables administrators to configure events, manage compositions (comps) for these events, and allow players to sign up and be assigned to specific roles.

## Features

1. **Admin Login and Panel:**
   - Secure login for administrators.
   - Access to event setup and configuration tools.

2. **Event Configuration:**
   - Create and manage events.
   - Configure event details such as time, caller, hammers, sets, rewards, number of parties, event type, and comp slots.
   - View and modify existing events.
   - Delete events and associated sign-ups.

3. **Composition Management:**
   - Set up and configure compositions for events.
   - Drag-and-drop interface to assign players to specific roles within a party.
   - Real-time updates and save functionality for role assignments.

4. **Player Sign-up:**
   - Players can sign up for events, specifying their preferred roles.
   - Unassigned players are displayed in a dedicated section, and can be easily dragged and assigned to roles by the admin.

5. **Real-time Data Handling:**
   - Events and compositions are dynamically fetched and updated.
   - Player role assignments are saved and persist across sessions.

## Technical Details

- **Frontend:**
  - Built with React.
  - Utilizes React DnD for drag-and-drop functionality.
  - Custom CSS for styling.

- **Backend:**
  - Express.js server.
  - MongoDB for data storage.
  - Mongoose for data modeling.

## Key Components

1. **Landing Page:**
   - The main entry point for the application.

2. **Admin Login:**
   - Secure login page for administrators.

3. **Admin Panel:**
   - Main dashboard for admins to manage events and compositions.

4. **Configure Events:**
   - Page to create and configure events.
   - Lists all events with options to view, configure comps, and sign up.

5. **Configure Event Comp:**
   - Detailed page for configuring the composition of a specific event.
   - Drag-and-drop interface to assign players to roles.
   - Save button to persist assignments.

6. **Sign Up:**
   - Page for players to sign up for an event.
   - Players can specify their preferred roles.

## Setup Instructions

1. **Clone the Repository:**
    ```
    git clone https://github.com/username/albion-zerg-manager.git
    cd albion-zerg-manager
    npm install
    cd client
    npm install
    cd ..
    ```
2. **Install Dependencies**
    ```
    npm install
    cd client
    npm install
    cd ..
    ```


3. **Environment Variables**
    Create a `.env` file in the root directory
    Add the following to environtment variables
    ```
    MONGO_URI=<Your MongoDB URI>
    PORT=5000
    ```
4. **Start the Applications**
    Start Server:
    ```
    npm run server
    ```
    Start the client:
    ```
    npm run client
    ```
5. **Access the Application**
    Open http://localhost:3000 on your browser of choice.

6. Profit





