// Popup script
function formatTime(seconds) {
  if (seconds < 60) return `${seconds}s`;
  const minutes = Math.floor(seconds / 60);
  const secs = seconds % 60;
  if (minutes < 60) return `${minutes}m ${secs}s`;
  const hours = Math.floor(minutes / 60);
  const mins = minutes % 60;
  return `${hours}h ${mins}m`;
}

function getScrollScore(scrolls, time) {
  if (time === 0 || scrolls === 0) return 0;
  const scrollsPerMinute = (scrolls / time) * 60;
  return Math.round(scrollsPerMinute);
}

function getScoreClass(score) {
  if (score > 40) return 'score-high';
  if (score > 20) return 'score-medium';
  return 'score-low';
}

function getSiteIcon(hostname) {
  if (hostname.includes('youtube')) return '📺';
  if (hostname.includes('instagram')) return '📷';
  if (hostname.includes('tiktok')) return '🎵';
  if (hostname.includes('linkedin')) return '💼';
  return '🌐';
}

function renderStats(stats, totalPoints = 0) {
  const content = document.getElementById('content');
  
  // Update total points display
  document.getElementById('totalPoints').textContent = totalPoints;
  
  if (!stats || Object.keys(stats).length === 0) {
    content.innerHTML = `
      <div class="empty-state">
        <h3 style="margin-bottom: 10px;">No data yet</h3>
        <p>Visit YouTube, Instagram, TikTok, or LinkedIn to start tracking!</p>
      </div>
      <div class="rewards-info">
        <strong>🎯 How to Earn Points:</strong>
        <ul>
          <li>⭐ 5 points per minute of healthy browsing (less than 15 scrolls/min)</li>
          <li>🎁 25 bonus points for taking 5+ minute breaks</li>
          <li>💎 Use points in the marketplace (coming soon!)</li>
        </ul>
        <strong style="margin-top: 10px; display: block;">⚠️ How to Lose Points:</strong>
        <ul>
          <li>❌ -50 points if you ignore warnings and continue doom-scrolling</li>
        </ul>
      </div>
    `;
    return;
  }
  
  // Get current tab stats
  chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
    const currentUrl = tabs[0]?.url || '';
    const currentHostname = new URL(currentUrl).hostname;
    const currentStats = stats[currentHostname];
    
    let html = '';
    
    // Current session section
    if (currentStats && (currentStats.totalScrolls > 0 || currentStats.totalTime > 0)) {
      const score = getScrollScore(currentStats.totalScrolls, currentStats.totalTime);
      const scoreClass = getScoreClass(score);
      const sitePoints = currentStats.rewardPoints || 0;
      
      html += `
        <div class="current-session">
          <h3 style="margin-bottom: 15px;">Current Session ${getSiteIcon(currentHostname)}</h3>
          <div style="font-size: 14px; margin-bottom: 10px; display: flex; justify-content: space-between; align-items: center;">
            <span>
              ${currentHostname}
              ${currentStats.onShorts ? '<span class="warning-badge">SHORTS/REELS</span>' : ''}
            </span>
            <span style="background: rgba(255,255,255,0.2); padding: 4px 10px; border-radius: 12px; font-size: 12px;">
              ⭐ ${sitePoints} pts
            </span>
          </div>
          <div class="stat-grid">
            <div class="stat-box">
              <span class="stat-value">${currentStats.totalScrolls}</span>
              <span class="stat-label">Scrolls</span>
            </div>
            <div class="stat-box">
              <span class="stat-value">${formatTime(currentStats.totalTime)}</span>
              <span class="stat-label">Active Time</span>
            </div>
          </div>
          <div style="margin-top: 15px; text-align: center;">
            ${score > 0 ? `<span class="scroll-score ${scoreClass}">
              Score: ${score} scrolls/min ${score < 15 ? '✨' : ''}
            </span>` : '<span class="scroll-score score-low">No scrolling yet</span>'}
          </div>
        </div>
      `;
    }
    
    // All sites section
    const sortedSites = Object.entries(stats)
      .sort((a, b) => b[1].totalTime - a[1].totalTime)
      .filter(([hostname]) => hostname !== currentHostname);
    
    if (sortedSites.length > 0) {
      html += `
        <div class="site-list">
          <h3 style="margin-bottom: 15px;">All Sites</h3>
      `;
      
      sortedSites.forEach(([hostname, data]) => {
        const score = getScrollScore(data.totalScrolls, data.totalTime);
        const scoreClass = getScoreClass(score);
        const sitePoints = data.rewardPoints || 0;
        
        html += `
          <div class="site-item">
            <div class="site-name">
              ${getSiteIcon(hostname)} ${hostname}
              ${data.onShorts ? '<span class="warning-badge">SHORTS</span>' : ''}
              <span style="margin-left: auto; background: rgba(255,255,255,0.2); padding: 2px 8px; border-radius: 10px; font-size: 11px;">
                ⭐ ${sitePoints}
              </span>
            </div>
            <div class="site-stats">
              <span>${data.totalScrolls} scrolls</span>
              <span>${formatTime(data.totalTime)}</span>
            </div>
            ${score > 0 ? `<div style="margin-top: 8px;">
              <span class="scroll-score ${scoreClass}" style="font-size: 11px; padding: 3px 8px;">
                ${score} scrolls/min ${score < 15 ? '✨' : ''}
              </span>
            </div>` : ''}
          </div>
        `;
      });
      
      html += `</div>`;
    }
    
    // Add rewards info
    html += `
      <div class="rewards-info">
        <strong>🎯 How to Earn Points:</strong>
        <ul>
          <li>⭐ 5 points per minute of healthy browsing (less than 15 scrolls/min)</li>
          <li>🎁 25 bonus points for taking 5+ minute breaks</li>
          <li>💎 Use points in the marketplace (coming soon!)</li>
        </ul>
        <strong style="margin-top: 10px; display: block;">⚠️ How to Lose Points:</strong>
        <ul>
          <li>❌ -50 points if you ignore warnings and continue doom-scrolling</li>
        </ul>
      </div>
    `;
    
    content.innerHTML = html;
  });
}

// Load and display stats
chrome.runtime.sendMessage({ type: 'GET_STATS' }, (response) => {
  renderStats(response.stats, response.totalRewardPoints || 0);
});

// Auto-refresh every 2 seconds
setInterval(() => {
  chrome.runtime.sendMessage({ type: 'GET_STATS' }, (response) => {
    renderStats(response.stats, response.totalRewardPoints || 0);
  });
}, 2000);

// Reset button
document.getElementById('resetBtn').addEventListener('click', () => {
  if (confirm('Reset all tracking data? This will clear all stats and restart tracking.\n\nNote: Your reward points will be kept!')) {
    chrome.runtime.sendMessage({ type: 'RESET_STATS' }, (response) => {
      if (response && response.success) {
        // Get current points before clearing display
        const currentPoints = parseInt(document.getElementById('totalPoints').textContent) || 0;
        // Clear the display immediately
        renderStats({}, currentPoints);
        // Reload after a short delay to show the reset worked
        setTimeout(() => {
          chrome.runtime.sendMessage({ type: 'GET_STATS' }, (response) => {
            renderStats(response.stats, response.totalRewardPoints || 0);
          });
        }, 500);
      }
    });
  }
});