// Loads a Socket for use on every page
const socket = io({
  transports: ['websocket', 'xhr-polling'],
});
