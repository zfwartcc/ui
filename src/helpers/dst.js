function isDaylightSavingTime() {
    // Retrieve the current date and time in the Central time zone
    const currentDateString = new Date().toLocaleString('en-US', { timeZone: 'America/Chicago' });
    const currentDate = new Date(currentDateString);
    const currentYear = currentDate.getFullYear();
  
    // Calculate the date of the first day of March
    const marchFirst = new Date(`March 1, ${currentYear}`);

    // Calculate the day of the week for the first day of March
    const marchFirstDay = marchFirst.getDay();

    // Calculate the date of the second Sunday of March
    let daylightSavingStart;
    if (marchFirstDay === 0) {
      // If the first day of March is a Sunday, the second Sunday is on the 8th
      daylightSavingStart = new Date(`March 8, ${currentYear}`);
    } else {
      // If the first day of March is not a Sunday, add the number of days until the next Sunday to the first day of March to get the second Sunday
      daylightSavingStart = new Date(marchFirst.getTime() + (7 - marchFirstDay) * 86400000);
    }
  
    // Set the time of the daylightSavingStart date to 2am
    daylightSavingStart.setHours(2, 0, 0, 0);
  
    // Calculate the date of the first Sunday of November
    const novemberFirst = new Date(`November 1, ${currentYear}`);
    const novemberFirstDay = novemberFirst.getDay();
    
    let daylightSavingEnd;
    if (novemberFirstDay === 0) {
      // If the first day of November is a Sunday, it is the first Sunday of the month
      daylightSavingEnd = novemberFirst;
    } else {
      // If the first day of November is not a Sunday, add the number of days until the previous Sunday to the first day of November to get the first Sunday
      daylightSavingEnd = new Date(novemberFirst.getTime() - novemberFirstDay * 86400000);
    }
  
    // Set the time of the daylightSavingEnd date to 2am
    daylightSavingEnd.setHours(2, 0, 0, 0);
  
    return currentDate >= daylightSavingStart && currentDate < daylightSavingEnd;
  }
  