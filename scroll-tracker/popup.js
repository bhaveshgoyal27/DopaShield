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
  if (time === 0) return 0;
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

function renderStats(stats) {
  const content = document.getElementById('content');
  
  if (!stats || Object.keys(stats).length === 0) {
    content.innerHTML = `
      <div class="empty-state">
        <h3 style="margin-bottom: 10px;">No data yet</h3>
        <p>Visit YouTube, Instagram, TikTok, or LinkedIn to start tracking!</p>
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
    if (currentStats) {
      const score = getScrollScore(currentStats.totalScrolls, currentStats.totalTime);
      const scoreClass = getScoreClass(score);
      
      html += `
        <div class="current-session">
          <h3 style="margin-bottom: 15px;">Current Session ${getSiteIcon(currentHostname)}</h3>
          <div style="font-size: 14px; margin-bottom: 10px;">
            ${currentHostname}
            ${currentStats.onShorts ? '<span class="warning-badge">SHORTS/REELS</span>' : ''}
          </div>
          <div class="stat-grid">
            <div class="stat-box">
              <span class="stat-value">${currentStats.totalScrolls}</span>
              <span class="stat-label">Scrolls</span>
            </div>
            <div class="stat-box">
              <span class="stat-value">${formatTime(currentStats.totalTime)}</span>
              <span class="stat-label">Time</span>
            </div>
          </div>
          <div style="margin-top: 15px; text-align: center;">
            <span class="scroll-score ${scoreClass}">
              Score: ${score} scrolls/min
            </span>
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
        
        html += `
          <div class="site-item">
            <div class="site-name">
              ${getSiteIcon(hostname)} ${hostname}
              ${data.onShorts ? '<span class="warning-badge">SHORTS</span>' : ''}
            </div>
            <div class="site-stats">
              <span>${data.totalScrolls} scrolls</span>
              <span>${formatTime(data.totalTime)}</span>
            </div>
            <div style="margin-top: 8px;">
              <span class="scroll-score ${scoreClass}" style="font-size: 11px; padding: 3px 8px;">
                ${score} scrolls/min
              </span>
            </div>
          </div>
        `;
      });
      
      html += `</div>`;
    }
    
    content.innerHTML = html;
  });
}

// Load and display stats
chrome.runtime.sendMessage({ type: 'GET_STATS' }, (response) => {
  renderStats(response.stats);
});

// Auto-refresh every 2 seconds
setInterval(() => {
  chrome.runtime.sendMessage({ type: 'GET_STATS' }, (response) => {
    renderStats(response.stats);
  });
}, 2000);

// Reset button
document.getElementById('resetBtn').addEventListener('click', () => {
  if (confirm('Reset all tracking data?')) {
    chrome.runtime.sendMessage({ type: 'RESET_STATS' }, () => {
      renderStats({});
    });
  }
});