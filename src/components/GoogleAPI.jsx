

import React, { useEffect } from 'react';
import axios from 'axios';

function GoogleAPI() {
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
      })
      .catch((error) => {
        console.error('Error:', error);
      });
  }, []);

  return <div>Calendar Component</div>;
}

export default GoogleAPI;
