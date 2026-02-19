export const getCurrentISO = () => new Date().toISOString();

export const addSeconds = (seconds) => {
  const date = new Date();
  date.setSeconds(date.getSeconds() + seconds);
  return date;
};