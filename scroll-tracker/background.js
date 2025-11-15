// Background service worker
let siteStats = {};
let totalRewardPoints = 0;

// Initialize storage
chrome.runtime.onInstalled.addListener(() => {
  chrome.storage.local.get(['siteStats', 'totalRewardPoints'], (result) => {
    if (result.siteStats) {
      siteStats = result.siteStats;
    }
    if (result.totalRewardPoints) {
      totalRewardPoints = result.totalRewardPoints;
    }
  });
});

// Load stats on startup
chrome.storage.local.get(['siteStats', 'totalRewardPoints'], (result) => {
  if (result.siteStats) {
    siteStats = result.siteStats;
  }
  if (result.totalRewardPoints) {
    totalRewardPoints = result.totalRewardPoints;
  }
});

// Listen for messages from content scripts
chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  if (message.type === 'UPDATE_STATS') {
    const { hostname, scrollCount, rapidScrollCount, timeSpent, isOnShorts, rewardPoints } = message.data;
    
    if (!siteStats[hostname]) {
      siteStats[hostname] = {
        totalScrolls: 0,
        totalRapidScrolls: 0,
        totalTime: 0,
        lastVisit: Date.now(),
        onShorts: isOnShorts,
        rewardPoints: 0
      };
    }
    
    // Update with current session data
    siteStats[hostname].totalScrolls = scrollCount;
    siteStats[hostname].totalRapidScrolls = rapidScrollCount;
    siteStats[hostname].totalTime = timeSpent;
    siteStats[hostname].lastVisit = Date.now();
    siteStats[hostname].onShorts = isOnShorts;
    siteStats[hostname].rewardPoints = rewardPoints;
    
    // Calculate total reward points across all sites
    totalRewardPoints = Object.values(siteStats).reduce((sum, site) => sum + (site.rewardPoints || 0), 0);
    
    // Save to storage
    chrome.storage.local.set({ siteStats, totalRewardPoints });
    
    sendResponse({ success: true, totalRewardPoints });
  } else if (message.type === 'GET_STATS') {
    // Recalculate total points from all sites to ensure accuracy
    totalRewardPoints = Object.values(siteStats).reduce((sum, site) => sum + (site.rewardPoints || 0), 0);
    sendResponse({ stats: siteStats, totalRewardPoints });
  } else if (message.type === 'RESET_STATS') {
    // Don't reset reward points, only reset stats
    const currentPoints = totalRewardPoints;
    siteStats = {};
    chrome.storage.local.set({ siteStats: {}, totalRewardPoints: currentPoints }, () => {
      // Notify all content scripts to reset their session data
      chrome.tabs.query({}, (tabs) => {
        tabs.forEach(tab => {
          if (tab.url && (tab.url.includes('youtube.com') || 
              tab.url.includes('instagram.com') || 
              tab.url.includes('tiktok.com') || 
              tab.url.includes('linkedin.com'))) {
            chrome.tabs.sendMessage(tab.id, { type: 'RESET_CURRENT_SESSION' }).catch(() => {});
          }
        });
      });
      sendResponse({ success: true, totalRewardPoints: currentPoints });
    });
    return true; // Keep channel open for async response
  }
  
  return true; // Keep message channel open for async response
});