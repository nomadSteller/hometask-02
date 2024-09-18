const setEndTime = (inputDateString) => {
  // Step 1: Parse the input string into a Date object
  const date = new Date(inputDateString);

  // Step 2: Set the time to 23:59:59
  date.setHours(23);
  date.setMinutes(59);
  date.setSeconds(59);
  date.setMilliseconds(999); // Ensure milliseconds is also set

  return date;
}

module.exports = { setEndTime }