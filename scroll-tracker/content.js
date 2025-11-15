// Content script that tracks scrolling and time
let scrollCount = 0;
let lastScrollY = window.scrollY;
let sessionStartTime = Date.now();
let lastActiveTime = Date.now();
let isActive = true;
let rapidScrollCount = 0;
let lastScrollTime = Date.now();
let actualScrollTime = 0; // Track actual time spent scrolling
let rewardPoints = 0;
let healthySessionTime = 0; // Time spent not doom-scrolling
let lastHealthyCheck = Date.now();

const SCROLL_THRESHOLD = 100; // pixels
const RAPID_SCROLL_TIME = 100; // ms
const RAPID_SCROLL_LIMIT = 50; // rapid scrolls to trigger warning
const CHECK_INTERVAL = 5000; // check every 5 seconds
const INACTIVE_THRESHOLD = 3000; // 3 seconds of no scrolling = inactive
const HEALTHY_SCROLL_RATE = 15; // scrolls per minute = healthy
const REWARD_CHECK_INTERVAL = 60000; // Check for rewards every minute

// Detect if on shorts/reels
function isOnShorts() {
  const url = window.location.href;
  return url.includes('youtube.com/shorts') || 
         url.includes('instagram.com/reels') ||
         url.includes('tiktok.com');
}

// Track scrolling
let scrollTimeout;
let activeScrollTimeout;

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
    lastActiveTime = now;
    
    lastScrollY = currentScrollY;
    
    // Track active scroll time
    clearTimeout(activeScrollTimeout);
    activeScrollTimeout = setTimeout(() => {
      // Add the time since last scroll started
      if (isActive) {
        actualScrollTime += (Date.now() - lastActiveTime) / 1000;
      }
    }, INACTIVE_THRESHOLD);
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
  
  // Calculate actual active time (only count time when scrolling happened recently)
  const timeSinceLastScroll = (Date.now() - lastActiveTime) / 1000;
  let currentActiveTime = actualScrollTime;
  
  if (timeSinceLastScroll < INACTIVE_THRESHOLD / 1000 && isActive) {
    currentActiveTime += timeSinceLastScroll;
  }
  
  const data = {
    hostname,
    scrollCount,
    rapidScrollCount,
    timeSpent: Math.floor(currentActiveTime), // Use actual active scroll time
    isOnShorts: isOnShorts(),
    timestamp: Date.now(),
    rewardPoints
  };
  
  // Send to background script
  chrome.runtime.sendMessage({ type: 'UPDATE_STATS', data });
}

// Calculate and award rewards for healthy browsing
function checkAndAwardRewards() {
  if (actualScrollTime === 0 || scrollCount === 0) return;
  
  const scrollRate = (scrollCount / actualScrollTime) * 60; // scrolls per minute
  const timeSinceLastCheck = (Date.now() - lastHealthyCheck) / 1000 / 60; // minutes
  
  // Award points for healthy scrolling (not doom-scrolling)
  if (scrollRate < HEALTHY_SCROLL_RATE && timeSinceLastCheck >= 1) {
    const pointsEarned = Math.floor(timeSinceLastCheck * 5); // 5 points per minute of healthy browsing
    rewardPoints += pointsEarned;
    
    if (pointsEarned > 0) {
      showRewardNotification(pointsEarned);
    }
    
    lastHealthyCheck = Date.now();
    saveData();
  }
  
  // Award bonus points for taking breaks (no scrolling for 5+ minutes)
  const minutesSinceLastScroll = (Date.now() - lastScrollTime) / 1000 / 60;
  if (minutesSinceLastScroll >= 5 && scrollCount > 0) {
    const breakBonus = 25;
    rewardPoints += breakBonus;
    showRewardNotification(breakBonus, true);
    lastScrollTime = Date.now(); // Reset to avoid duplicate rewards
    saveData();
  }
}

// Show reward notification
function showRewardNotification(points, isBreakBonus = false) {
  const notification = document.createElement('div');
  notification.style.cssText = `
    position: fixed;
    top: 20px;
    right: 20px;
    background: linear-gradient(135deg, #11998e 0%, #38ef7d 100%);
    color: white;
    padding: 20px 25px;
    border-radius: 15px;
    box-shadow: 0 10px 30px rgba(0,0,0,0.3);
    z-index: 999999;
    font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
    animation: slideInRight 0.5s ease-out;
    max-width: 300px;
  `;
  
  notification.innerHTML = `
    <style>
      @keyframes slideInRight {
        from { transform: translateX(400px); opacity: 0; }
        to { transform: translateX(0); opacity: 1; }
      }
      @keyframes slideOutRight {
        from { transform: translateX(0); opacity: 1; }
        to { transform: translateX(400px); opacity: 0; }
      }
    </style>
    <div style="display: flex; align-items: center; gap: 15px;">
      <div style="font-size: 32px;">${isBreakBonus ? '🎁' : '⭐'}</div>
      <div>
        <div style="font-weight: 600; font-size: 18px; margin-bottom: 5px;">
          +${points} Points!
        </div>
        <div style="font-size: 13px; opacity: 0.9;">
          ${isBreakBonus ? 'Break time bonus!' : 'Healthy browsing!'}
        </div>
      </div>
    </div>
  `;
  
  document.body.appendChild(notification);
  
  setTimeout(() => {
    notification.style.animation = 'slideOutRight 0.5s ease-out';
    setTimeout(() => notification.remove(), 500);
  }, 3000);
}

// Check for excessive scrolling
function checkScrollingBehavior() {
  // Only check if we have actual scroll activity
  if (scrollCount === 0 || actualScrollTime === 0) return;
  
  const timeSpentMinutes = actualScrollTime / 60;
  const scrollsPerMinute = scrollCount / timeSpentMinutes;
  
  // Trigger warning if excessive scrolling detected
  if ((scrollsPerMinute > 30 && timeSpentMinutes > 2) || rapidScrollCount > RAPID_SCROLL_LIMIT) {
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
      @keyframes countdown {
        from { width: 100%; }
        to { width: 0%; }
      }
    </style>
    <h2 style="margin: 0 0 15px 0; font-size: 28px;">⚠️ Hey There!</h2>
    <p style="margin: 0 0 20px 0; font-size: 16px; line-height: 1.5;">
      You've been scrolling quite a bit! Time for a break?
    </p>
    <p style="margin: 0 0 20px 0; font-size: 14px; opacity: 0.9;">
      💡 Take a break to earn reward points!
    </p>
    <div style="background: rgba(255,255,255,0.2); height: 4px; border-radius: 2px; margin-bottom: 20px; overflow: hidden;">
      <div style="background: white; height: 100%; animation: countdown 10s linear;"></div>
    </div>
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
  
  // Auto-dismiss after 10 seconds (changed from 5)
  setTimeout(() => {
    if (warning.parentNode) {
      warning.style.animation = 'popIn 0.2s reverse';
      setTimeout(() => warning.remove(), 200);
    }
  }, 10000);
}

// Periodic checks
setInterval(checkScrollingBehavior, CHECK_INTERVAL);
setInterval(updateTimeSpent, 10000);
setInterval(checkAndAwardRewards, REWARD_CHECK_INTERVAL);

// Handle visibility changes
document.addEventListener('visibilitychange', () => {
  if (document.visibilityState === 'hidden') {
    isActive = false;
    saveData();
  } else {
    isActive = true;
    sessionStartTime = Date.now();
    lastActiveTime = Date.now();
  }
});

// Save data before unload
window.addEventListener('beforeunload', saveData);

// Listen for reset message from popup
chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  if (message.type === 'RESET_CURRENT_SESSION') {
    scrollCount = 0;
    rapidScrollCount = 0;
    actualScrollTime = 0;
    sessionStartTime = Date.now();
    lastActiveTime = Date.now();
    lastHealthyCheck = Date.now();
    // Don't reset reward points - they persist
    saveData();
    sendResponse({ success: true });
  }
  return true;
});

// Initial save
saveData();