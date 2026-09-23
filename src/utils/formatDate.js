

export const now = () => new Date().toLocaleTimeString([], {
  hour: "numeric",
  minute: "2-digit"
});
