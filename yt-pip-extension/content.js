// Default settings
let settings = {
  enabled: true,
  autoEnter: true,
  autoExit: true,
  keyboardShortcut: true
};

// Load settings from storage
chrome.storage.sync.get(settings, (stored) => {
  settings = { ...settings, ...stored };
});

// Listen for settings changes
chrome.storage.onChanged.addListener((changes) => {
  for (let key in changes) {
    settings[key] = changes[key].newValue;
  }
});

// Get YouTube video element
const getVideo = () => document.querySelector('video');

// Check if video is playing
const isPlaying = (video) => {
  return video && !video.paused && !video.ended && video.readyState > 2;
};

// Handle visibility change
document.addEventListener('visibilitychange', async () => {
  if (!settings.enabled) return;

  const video = getVideo();
  if (!video) return;

  try {
    if (document.hidden) {
      // Tab lost focus → Enter PiP
      if (settings.autoEnter && isPlaying(video) && !document.pictureInPictureElement) {
        await video.requestPictureInPicture();
      }
    } else {
      // Tab regained focus → Exit PiP
      if (settings.autoExit && document.pictureInPictureElement) {
        await document.exitPictureInPicture();
      }
    }
  } catch (err) {
    console.log('PiP action failed:', err);
  }
});

// Keyboard shortcut (Alt + P)
document.addEventListener('keydown', async (e) => {
  if (!settings.enabled || !settings.keyboardShortcut) return;

  if (e.altKey && e.key.toLowerCase() === 'p') {
    e.preventDefault();
    const video = getVideo();

    try {
      if (document.pictureInPictureElement) {
        await document.exitPictureInPicture();
      } else if (video) {
        await video.requestPictureInPicture();
      }
    } catch (err) {
      console.log('PiP toggle failed:', err);
    }
  }
});

// Handle PiP window close → resume in main player
document.addEventListener('leavepictureinpicture', () => {
  const video = getVideo();
  if (video && video.paused) {
    video.play();
  }
});

console.log('YouTube Auto PiP loaded ✓');