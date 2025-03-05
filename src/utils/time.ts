export const formatTimeLong = (ms: number): string => {
  const hours = String(Math.floor(ms / 3600000)).padStart(2, "0");
  const minutes = String(Math.floor((ms % 3600000) / 60000)).padStart(2, "0");
  const seconds = String(Math.floor((ms % 60000) / 1000)).padStart(2, "0");
  const milliseconds = String(Math.floor((ms % 1000) / 10)).padStart(2, "0");

  return `${hours}:${minutes}:${seconds}:${milliseconds}`;
};

export const formatTimeShort = (ms: number): string => {
  const totalSeconds = Math.floor(ms / 1000);
  const hours = Math.floor(totalSeconds / 3600);
  const minutes = Math.floor((totalSeconds % 3600) / 60);
  const seconds = totalSeconds % 60;
  const milliseconds = Math.floor((ms % 1000) / 10);
  const pad = (num: number, size: number = 2) => num.toString().padStart(size, "0");

  return `${hours ? `${pad(hours)}:` : ""}${pad(minutes)}:${pad(seconds)}:${pad(milliseconds)}`;
};
