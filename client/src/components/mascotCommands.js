// src/mascotCommands.js

// These functions bypass the interpreter by directly sending commands
// to the control panel via window.handleMascotCommand (which is set by ConsolePane).

export function mascotWalk(steps) {
    if (window.handleMascotCommand) {
      window.handleMascotCommand({ action: 'walk', value: steps });
    }
  }
  
  export function mascotFlip() {
    if (window.handleMascotCommand) {
      window.handleMascotCommand({ action: 'flip' });
    }
  }
  
  export function mascotRotate(degrees) {
    if (window.handleMascotCommand) {
      window.handleMascotCommand({ action: 'rotate', value: degrees });
    }
  }
  
  export function mascotSpeak(message, duration) {
    if (window.handleMascotCommand) {
      window.handleMascotCommand({ action: 'speak', message: message, duration: duration });
    }
  }
  
  export function mascotReset() {
    if (window.handleMascotCommand) {
      window.handleMascotCommand({ action: 'reset' });
    }
  }
  
  // Optionally, attach these functions to the window so they are accessible globally.
  window.mascotWalk = mascotWalk;
  window.mascotFlip = mascotFlip;
  window.mascotRotate = mascotRotate;
  window.mascotSpeak = mascotSpeak;
  window.mascotReset = mascotReset;
  