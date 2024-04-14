import React, { useState, useEffect } from 'react';
import axios from 'axios';

// GoogleAPI component to fetch events from Google Calendar API
function GoogleAPI({ setEvents }) {
  useEffect(() => {
    const { CAL_API, CAL_ID } = import.meta.env;
    const BASEPARAMS = `orderBy=startTime&singleEvents=true&timeMin=${new Date().toISOString()}`
    const BASEURL = `https://www.googleapis.com/calendar/v3/users/me/calendarList/${CAL_ID}/events?${BASEPARAMS}`
    const HEADERS = {
      'Content-Type': 'application/json',
      'Access-Control-Allow-Methods': 'GET',
    }

    const finalURL = `${BASEURL}&key=${CAL_API}`;

    axios.get(finalURL, { headers: HEADERS })
      .then((response) => {
        console.log(response.data);
        setEvents(response.data.items); // Set fetched events
      })
      .catch((error) => {
        console.error('Error:', error);
      });
  }, [setEvents]); // Dependency array ensures useEffect runs only once

  return <div>Calendar Component</div>;
}

// Calendar component to display events
function Calendar({ events }) {
  const [eventAmount, setEventAmount] = useState(9); // State for event amount
  const [loading, setLoading] = useState(true); // State for loading events

  // Simulating loading events with setTimeout
  useEffect(() => {
    const timer = setTimeout(() => {
      setLoading(false);
    }, 2000); // Simulate loading for 2 seconds
    // Clear timeout on component unmount
    return () => clearTimeout(timer);
  }, []);

  return (
    <div className="bg-slate-50 dark:bg-slate-700 p-4 md:p-6 lg:p-8 min-h-screen grid gap-4 md:gap-6 lg:gap-8 text-slate-600 dark:text-slate-100 grid-rows-auto1">
      <div className="text-center grid p-4 place-items-center content-center">
        <h1 className="text-3xl sm:text-5xl font-bold bg-clip-text text-transparent bg-gradient-to-br pb-4 md:pb-6 from-blue-500 to-violet-700 dark:from-blue-400">My Calendar Events</h1>
        <label htmlFor="eventAmt">Events to Show</label>
        <input
          type="range"
          id="eventAmt"
          min={1}
          value={eventAmount}
          max={20}
          className="accent-blue-600 cursor-grab"
          onChange={(e) => setEventAmount(parseInt(e.target.value))}
        />
      </div>
      <div className="max-w-6xl w-full mx-auto">
        <div className="grid gap-4 md:gap-6 lg:gap-8 items-start grid-cols-cards" id="events-container">
          {loading ? (
            <div className="flex gap-3 items-center text-blue-500 mx-auto">
              <svg className="animate-spin h-8 w-8" width="20" viewBox="0 0 155 155" fill="none" xmlns="http://www.w3.org/2000/svg">
                <circle className="opacity-25" cx="77.5" cy="77.5" r="60" stroke="currentColor" strokeWidth="10" />
                <path d="M120.329 35.48a59.998 59.998 0 0 1 6.712 75.868" className="opacity-75" stroke="currentColor" strokeWidth="10" />
              </svg>
              <p className="text-center text-3xl animate-pulse">Loading Events</p>
            </div>
          ) : (
            // Render events here
            // Example: map through events array and render event cards
            Array.from({ length: eventAmount }).map((_, index) => (
              <div key={index} className="bg-white dark:bg-gray-800 shadow-lg rounded-lg overflow-hidden mx-auto max-w-sm">
                <div className="py-4 px-6">
                  <h2 className="text-lg font-semibold text-gray-800 dark:text-white">Event Title</h2>
                  <p className="mt-2 text-gray-600 dark:text-gray-400">Event Description</p>
                  {/* Additional event information */}
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}

// Main component to integrate GoogleAPI and Calendar
function MainCal() {
  const [events, setEvents] = useState([]); // State to store fetched events

  return (
    <div>
      <GoogleAPI setEvents={setEvents} />
      <Calendar events={events} />
    </div>
  );
}

export default MainCal;
