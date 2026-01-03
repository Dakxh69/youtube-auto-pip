const toggleIds = ['enabled', 'autoEnter', 'autoExit', 'keyboardShortcut'];

// Load saved settings
chrome.storage.sync.get(toggleIds, (settings) => {
  toggleIds.forEach(id => {
    const toggle = document.getElementById(id);
    // Default to true if not set
    toggle.checked = settings[id] !== undefined ? settings[id] : true;
  });
});

// Save settings on change
toggleIds.forEach(id => {
  document.getElementById(id).addEventListener('change', (e) => {
    const setting = { [id]: e.target.checked };
    
    chrome.storage.sync.set(setting, () => {
      showStatus('Settings saved ✓');
    });
  });
});

// Show status message
function showStatus(message) {
  const status = document.getElementById('status');
  status.textContent = message;
  setTimeout(() => {
    status.textContent = '';
  }, 1500);
}