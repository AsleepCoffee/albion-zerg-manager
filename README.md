#Albion Zerg Manager
##Project Summary
Albion Zerg Manager is a comprehensive tool designed to facilitate the management of large-scale events, specifically for the game Albion Online. The application enables administrators to configure events, manage compositions (comps) for these events, and allow players to sign up and be assigned to specific roles.

##Features

Admin Login and Panel:

Secure login for administrators.
Access to event setup and configuration tools.
Event Configuration:

Create and manage events.
Configure event details such as time, caller, hammers, sets, rewards, number of parties, event type, and comp slots.
View and modify existing events.
Delete events and associated sign-ups.
Composition Management:

Set up and configure compositions for events.
Drag-and-drop interface to assign players to specific roles within a party.
Real-time updates and save functionality for role assignments.
Player Sign-up:

Players can sign up for events, specifying their preferred roles.
Unassigned players are displayed in a dedicated section, and can be easily dragged and assigned to roles by the admin.
Real-time Data Handling:

Events and compositions are dynamically fetched and updated.
Player role assignments are saved and persist across sessions.
Technical Details

##Frontend:

Built with React.
Utilizes React DnD for drag-and-drop functionality.
Custom CSS for styling.

##Backend:

Express.js server.
MongoDB for data storage.
Mongoose for data modeling.
Key Components
Landing Page:

The main entry point for the application.
Admin Login:

Secure login page for administrators.
Admin Panel:

Main dashboard for admins to manage events and compositions.
Configure Events:

Page to create and configure events.
Lists all events with options to view, configure comps, and sign up.
Configure Event Comp:

Detailed page for configuring the composition of a specific event.
Drag-and-drop interface to assign players to roles.
Save button to persist assignments.
Sign Up:

Page for players to sign up for an event.
Players can specify their preferred roles.


#Setup Instructions
Clone the Repository:

sh
Copy code
git clone https://github.com/username/albion-zerg-manager.git
cd albion-zerg-manager
Install Dependencies:

sh
Copy code
npm install
cd client
npm install
cd ..
Environment Variables:

Create a .env file in the root directory.
Add the following environment variables:
makefile
Copy code
MONGO_URI=<Your MongoDB URI>
PORT=5000
Start the Application:

Start the server:
sh
Copy code
npm run server
Start the client:
sh
Copy code
npm run client
Access the Application:

Open your browser and navigate to http://localhost:3000.