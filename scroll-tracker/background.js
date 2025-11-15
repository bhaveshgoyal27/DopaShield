// Background service worker
let siteStats = {};

// Initialize storage
chrome.runtime.onInstalled.addListener(() => {
  chrome.storage.local.get(['siteStats'], (result) => {
    if (result.siteStats) {
      siteStats = result.siteStats;
    }
  });
});

// Load stats on startup
chrome.storage.local.get(['siteStats'], (result) => {
  if (result.siteStats) {
    siteStats = result.siteStats;
  }
});

// Listen for messages from content scripts
chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  if (message.type === 'UPDATE_STATS') {
    const { hostname, scrollCount, rapidScrollCount, timeSpent, isOnShorts } = message.data;
    
    if (!siteStats[hostname]) {
      siteStats[hostname] = {
        totalScrolls: 0,
        totalRapidScrolls: 0,
        totalTime: 0,
        sessions: 0,
        lastVisit: Date.now(),
        onShorts: isOnShorts
      };
    }
    
    siteStats[hostname].totalScrolls = scrollCount;
    siteStats[hostname].totalRapidScrolls = rapidScrollCount;
    siteStats[hostname].totalTime = timeSpent;
    siteStats[hostname].lastVisit = Date.now();
    siteStats[hostname].onShorts = isOnShorts;
    
    // Save to storage
    chrome.storage.local.set({ siteStats });
    
    sendResponse({ success: true });
  } else if (message.type === 'GET_STATS') {
    sendResponse({ stats: siteStats });
  } else if (message.type === 'RESET_STATS') {
    siteStats = {};
    chrome.storage.local.set({ siteStats: {} });
    sendResponse({ success: true });
  }
  
  return true; // Keep message channel open for async response
});