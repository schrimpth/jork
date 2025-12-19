export const formatDuration = (ms) => {
  const seconds = Math.floor((ms / 1000) % 60);
  const minutes = Math.floor((ms / (1000 * 60)) % 60);
  const hours = Math.floor((ms / (1000 * 60 * 60)) % 24);
  const days = Math.floor(ms / (1000 * 60 * 60 * 24));

  const pad = (n) => n.toString().padStart(2, '0');

  return {
    days,
    hours: pad(hours),
    minutes: pad(minutes),
    seconds: pad(seconds)
  };
};

export const getClearanceLevel = (ms) => {
  const days = Math.floor(ms / (1000 * 60 * 60 * 24));
  if (days < 1) return { level: 1, title: "BLUE PILL", color: "text-gray-500" };
  if (days < 3) return { level: 2, title: "RED PILL", color: "text-red-500" };
  if (days < 7) return { level: 3, title: "TRUTH SEEKER", color: "text-orange-500" };
  if (days < 14) return { level: 4, title: "AWAKENED", color: "text-yellow-500" };
  if (days < 30) return { level: 5, title: "OPERATOR", color: "text-green-500" };
  if (days < 90) return { level: 6, title: "ARCHITECT", color: "text-cyan-500" };
  return { level: 7, title: "NEO", color: "text-purple-500" };
};
