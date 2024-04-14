import React, { useState, useEffect } from 'react';
import '../../src/index.css'; // Import CSS file if required

const MainCal2 = () => {
  const [events, setEvents] = useState([]); // State for storing fetched events
  const [eventAmount, setEventAmount] = useState(8); // State for controlling the number of events to fetch

  const getRandomNumBetween = (min, max) => Math.floor(Math.random() * (max - min + 1)) + min;
  const getMonth = (month) => ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'][month];
  const getDayOfWeek = (weekday) => ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'][weekday];
  const isAM = (hour) => hour < 12;
  const getHour = (hour) => (hour <= 12 ? hour : hour - 12);
  const getMinute = (minute) => (minute === 0 ? '00' : minute);

  const processDate = (date) => {
    const hour = getHour(date.getHours()) === 0 ? false : getHour(date.getHours());
    const minute = getMinute(date.getMinutes());
    const timeSuffix = `<small>${isAM(date.getHours()) ? `AM` : `PM`}</small>`;
    const time = hour && `${hour}:${minute}${timeSuffix}`;

    return {
      month: getMonth(date.getMonth()),
      weekday: getDayOfWeek(date.getDay()),
      time,
      date: date.getDate(),
    };
  };

  const mapEventObject = (event) => {
    const startDate = event.start.dateTime ? processDate(new Date(event.start.dateTime)) : processDate(new Date(`${event.start.date}T00:00:00`));
    const endDate = event.end.dateTime ? processDate(new Date(event.end.dateTime)) : processDate(new Date(`${event.end.date}T00:00:00`));
    let dateRange;
    if (startDate.date !== endDate.date) {
      dateRange = `${startDate.month} ${startDate.date}–${endDate.month} ${endDate.date}`;
    } else if (!startDate.time) {
      dateRange = `${startDate.month} ${startDate.date}`;
    } else {
      dateRange = `${startDate.weekday}, ${startDate.time}–${endDate.time}`;
    }

    return {
      name: event.summary,
      description: event.description,
      location: event.location,
      start: startDate,
      end: endDate,
      dateRange,
      link: event.htmlLink,
    };
  };

  const createEvent = (e, i) => {
    const colors = ['blue', 'amber', 'rose', 'indigo', 'pink'];
    const colorScheme = colors[getRandomNumBetween(0, colors.length - 1)];
    return (
      <article className={`bg-white dark:bg-slate-800 shadow-xl shadow-slate-200 dark:shadow-slate-800 rounded-lg`} key={i}>
        <div className={`p-3 shadow bg-${colorScheme}-500 text-indigo-50 uppercase grid place-items-center rounded-t-lg`}>
          <div className="text-sm">{e.start.month}</div>
          <div className="text-3xl font-bold">{e.start.date}</div>
        </div>
        <div className="p-4 md:p-6 lg:p-8 grid gap-4 md:gap-6">
          <div className="grid gap-1">
            <p className="text-slate-400 text-sm">{e.dateRange}</p>
            <h2 className="font-bold text-2xl">
              <a href={e.link}>{e.name}</a>
              {e.location && <p className="text-slate-400 text-sm">{e.location}</p>}
            </h2>
            {e.description && (
              <div className="grid gap-1">
                <button className="text-slate-400 flex gap-1 items-center cursor-pointer" aria-expanded="false" aria-controls={`details-${i}`} id={`btn-${i}`}>
                  <p className="pointer-events-none">See details</p>
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 pointer-events-none transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
                  </svg>
                </button>
                <div className="grid gap-1 hidden" id={`details-${i}`} aria-labelledby={`btn-${i}`}>
                  <p className="text-slate-400">{e.description}</p>
                </div>
              </div>
            )}
            <a href={e.link} className={`bg-${colorScheme}-500 rounded-md px-4 py-2 text-${colorScheme}-50 shadow-2xl shadow-${colorScheme}-200 dark:shadow-none text-center font-bold hover:shadow-none ring ring-offset-0 ring-${colorScheme}-500 focus:outline-none focus:ring-offset-2`}>
              View Event
            </a>
          </div>
        </div>
      </article>
    );
  };

  const loadEvents = async (max = 8) => {
    try {
      // Replace the fetch call with your API endpoint
      // const endpoint = await fetch(`./.netlify/functions/calFetch?maxResults=${max}`);
      // const data = await endpoint.json();
      // Mocking data for demonstration
      const data = Array.from({ length: max }, (_, index) => ({
        summary: `Event ${index + 1}`,
        description: `Description of Event ${index + 1}`,
        location: `Location ${index + 1}`,
        start: { dateTime: new Date().toISOString() },
        end: { dateTime: new Date().toISOString() },
        htmlLink: '#',
      }));
      const processedEvents = data.map((e) => mapEventObject(e));
      setEvents(processedEvents);
    } catch (e) {
      console.error('Error fetching events:', e);
    }
  };

  useEffect(() => {
    loadEvents(eventAmount);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [eventAmount]);

  return (
    <div>
      <input
        type="range"
        id="eventAmt"
        min={1}
        value={eventAmount}
        max={20}
        className="accent-blue-600 cursor-grab"
        onChange={(e) => setEventAmount(parseInt(e.target.value))}
      />
      <div id="events-container">{events.map((event, i) => createEvent(event, i))}</div>
    </div>
  );
};

export default MainCal2;
