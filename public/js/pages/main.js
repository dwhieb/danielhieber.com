'use strict';

// Loads a Socket for use on every page
var socket = io({
  transports: ['websocket', 'xhr-polling']
});