// Content script that tracks scrolling and time
let scrollCount = 0;
let lastScrollY = window.scrollY;
let startTime = Date.now();
let isActive = true;
let rapidScrollCount = 0;
let lastScrollTime = Date.now();

const SCROLL_THRESHOLD = 100; // pixels
const RAPID_SCROLL_TIME = 100; // ms
const RAPID_SCROLL_LIMIT = 50; // rapid scrolls to trigger warning
const CHECK_INTERVAL = 5000; // check every 5 seconds

// Detect if on shorts/reels
function isOnShorts() {
  const url = window.location.href;
  return url.includes('youtube.com/shorts') || 
         url.includes('instagram.com/reels') ||
         url.includes('tiktok.com');
}

// Track scrolling
let scrollTimeout;
window.addEventListener('scroll', () => {
  const currentScrollY = window.scrollY;
  const scrollDiff = Math.abs(currentScrollY - lastScrollY);
  
  if (scrollDiff > SCROLL_THRESHOLD) {
    scrollCount++;
    
    const now = Date.now();
    if (now - lastScrollTime < RAPID_SCROLL_TIME) {
      rapidScrollCount++;
    }
    lastScrollTime = now;
    
    lastScrollY = currentScrollY;
  }
  
  // Save data periodically
  clearTimeout(scrollTimeout);
  scrollTimeout = setTimeout(saveData, 1000);
});

// Track time spent
function updateTimeSpent() {
  if (document.visibilityState === 'visible' && isActive) {
    saveData();
  }
}

// Save data to storage
async function saveData() {
  const hostname = window.location.hostname;
  const timeSpent = Math.floor((Date.now() - startTime) / 1000); // seconds
  
  const data = {
    hostname,
    scrollCount,
    rapidScrollCount,
    timeSpent,
    isOnShorts: isOnShorts(),
    timestamp: Date.now()
  };
  
  // Send to background script
  chrome.runtime.sendMessage({ type: 'UPDATE_STATS', data });
}

// Check for excessive scrolling
function checkScrollingBehavior() {
  const timeSpent = (Date.now() - startTime) / 1000 / 60; // minutes
  const scrollsPerMinute = timeSpent > 0 ? scrollCount / timeSpent : 0;
  
  // Trigger warning if excessive scrolling detected
  if ((scrollsPerMinute > 30 && timeSpent > 2) || rapidScrollCount > RAPID_SCROLL_LIMIT) {
    showWarning();
    rapidScrollCount = 0; // Reset after warning
  }
}

// Show warning popup
function showWarning() {
  // Remove existing warning if present
  const existing = document.getElementById('scroll-tracker-warning');
  if (existing) existing.remove();
  
  const warning = document.createElement('div');
  warning.id = 'scroll-tracker-warning';
  warning.style.cssText = `
    position: fixed;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
    color: white;
    padding: 30px 40px;
    border-radius: 20px;
    box-shadow: 0 20px 60px rgba(0,0,0,0.4);
    z-index: 999999;
    font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
    text-align: center;
    animation: popIn 0.3s cubic-bezier(0.68, -0.55, 0.265, 1.55);
    max-width: 400px;
  `;
  
  warning.innerHTML = `
    <style>
      @keyframes popIn {
        0% { transform: translate(-50%, -50%) scale(0.5); opacity: 0; }
        100% { transform: translate(-50%, -50%) scale(1); opacity: 1; }
      }
    </style>
    <h2 style="margin: 0 0 15px 0; font-size: 28px;">⚠️ Hey There!</h2>
    <p style="margin: 0 0 20px 0; font-size: 16px; line-height: 1.5;">
      You've been scrolling quite a bit! Time for a break?
    </p>
    <button id="scroll-tracker-dismiss" style="
      background: white;
      color: #667eea;
      border: none;
      padding: 12px 30px;
      border-radius: 25px;
      font-size: 16px;
      font-weight: 600;
      cursor: pointer;
      transition: transform 0.2s;
    ">Got it!</button>
  `;
  
  document.body.appendChild(warning);
  
  document.getElementById('scroll-tracker-dismiss').addEventListener('click', () => {
    warning.style.animation = 'popIn 0.2s reverse';
    setTimeout(() => warning.remove(), 200);
  });
  
  // Auto-dismiss after 5 seconds
  setTimeout(() => {
    if (warning.parentNode) {
      warning.style.animation = 'popIn 0.2s reverse';
      setTimeout(() => warning.remove(), 200);
    }
  }, 5000);
}

// Periodic checks
setInterval(checkScrollingBehavior, CHECK_INTERVAL);
setInterval(updateTimeSpent, 10000);

// Handle visibility changes
document.addEventListener('visibilitychange', () => {
  if (document.visibilityState === 'hidden') {
    isActive = false;
    saveData();
  } else {
    isActive = true;
    startTime = Date.now();
  }
});

// Save data before unload
window.addEventListener('beforeunload', saveData);

// Initial save
saveData();