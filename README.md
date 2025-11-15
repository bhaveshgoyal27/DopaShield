# DopaShield
A Chrome extension that helps you break doom-scrolling habits by tracking your scrolling behavior on social media platforms and rewarding healthy browsing patterns.

## 🎯 Features

### Real-Time Tracking
- **Scroll Monitoring**: Tracks every significant scroll (100+ pixels) on supported platforms
- **Time Tracking**: Measures actual active scrolling time, not just tab open time
- **Scroll Speed**: Calculates scrolls per minute to identify doom-scrolling behavior
- **Shorts/Reels Detection**: Automatically identifies when you're on YouTube Shorts, Instagram Reels, or TikTok

### Reward System 🎁
Earn points for healthy browsing habits:
- ⭐ **5 points/minute** for healthy browsing (less than 15 scrolls/min)
- 🎁 **25 bonus points** for taking 5+ minute breaks
- Points persist across sessions and are saved automatically
- Total points displayed prominently in the extension popup

### Punishment System ⚠️
Stay accountable with consequences:
- Warning popup appears when doom-scrolling is detected
- **-50 points** if you ignore the warning and continue scrolling (20+ scrolls within 10 seconds)
- Points never go below 0
- Visual feedback with shake animations

### Smart Warnings
- Triggers when scrolling more than 30 times/minute for 2+ minutes
- Triggers after 50+ rapid scrolls
- 10-second persistent popup with countdown timer
- Encourages taking breaks to earn rewards

### Dashboard
Click the extension icon to view:
- Total reward points across all sites
- Current session statistics
- Per-site breakdown of scrolling behavior
- Color-coded scroll scores (green = healthy, yellow = moderate, red = excessive)
- Points earned per site

## 🚀 Installation

### Prerequisites
- Google Chrome browser
- Basic knowledge of loading Chrome extensions

### Steps

1. **Download/Clone the Repository**
   ```bash
   git clone <repository-url>
   cd scroll-tracker
   ```

2. **Load Extension in Chrome**
   - Open Chrome and navigate to `chrome://extensions/`
   - Enable "Developer mode" (toggle in top-right corner)
   - Click "Load unpacked"
   - Select the folder containing the extension files
   - The extension icon should appear in your Chrome toolbar

## 📁 File Structure

```
scroll-tracker/
├── manifest.json          # Extension configuration
├── content.js            # Content script (tracking logic)
├── background.js         # Background service worker
├── popup.html           # Extension popup interface
├── popup.js             # Popup logic and UI updates
├── icon16.png           # 16x16 icon
├── icon48.png           # 48x48 icon
├── icon128.png          # 128x128 icon
└── README.md            # This file
```

## 🎮 How to Use

### Getting Started
1. Install the extension following the steps above
2. Visit any supported platform (YouTube, Instagram, TikTok, or LinkedIn)
3. Browse normally - the extension tracks your behavior automatically

### Viewing Your Stats
- Click the extension icon in your Chrome toolbar
- See your total reward points at the top
- View current session stats for the active tab
- Scroll down to see stats from all tracked sites

### Earning Rewards
- Browse mindfully (keep scrolls under 15/minute)
- Take regular breaks (5+ minutes = bonus)
- Healthy scroll rates show a ✨ sparkle icon

### Understanding Warnings
- Red warning popup = You're doom-scrolling
- Take a break immediately to avoid losing points
- Continuing to scroll after warning = -50 points
- Dismiss the popup by clicking "Got it!" or wait 10 seconds

### Resetting Stats
- Click "Reset All Stats" button at the bottom of the popup
- Confirms before clearing data
- **Note**: Your reward points are preserved during reset!

## 🌐 Supported Platforms

- **YouTube** (youtube.com) - including Shorts detection
- **Instagram** (instagram.com) - including Reels detection
- **TikTok** (tiktok.com)
- **LinkedIn** (linkedin.com)

## ⚙️ Configuration

### Customizable Constants (in `content.js`)

```javascript
SCROLL_THRESHOLD = 100              // Pixels to count as a scroll
HEALTHY_SCROLL_RATE = 15            // Scrolls/min for rewards
RAPID_SCROLL_LIMIT = 50             // Rapid scrolls trigger warning
PUNISHMENT_SCROLL_THRESHOLD = 20    // Scrolls after warning = punishment
```

### Reward Values
- Healthy browsing: 5 points/minute
- Break bonus: 25 points
- Punishment: -50 points

## 🔒 Privacy & Data

### What's Tracked
- Scroll count and speed on supported sites
- Time actively scrolling (not idle time)
- Reward points earned/lost

### What's NOT Tracked
- Content you view
- Pages you visit (beyond hostname)
- Personal information
- Browsing history

### Data Storage
- All data stored locally in Chrome's storage API
- No external servers or analytics
- Data never leaves your browser
- You can reset all data anytime

## 🛠️ Troubleshooting

### Extension Not Tracking
- Make sure you're on a supported platform
- Refresh the page after installing
- Check if extension is enabled in `chrome://extensions/`

### Points Not Updating
- Scroll significantly (100+ pixels) to register activity
- Wait 1-2 seconds for UI to update
- Try closing and reopening the popup

### Warning Not Appearing
- Must scroll rapidly (30+/min for 2+ minutes) or make 50+ rapid scrolls
- Check if popups are blocked on the site
- Refresh the page and try again

### Reset Not Working
- Make sure popup is open when clicking reset
- Check console for errors (F12)
- Try reloading the extension


### Adjusting Sensitivity
Modify thresholds in `content.js`:
- Increase `SCROLL_THRESHOLD` for less sensitive tracking
- Decrease `HEALTHY_SCROLL_RATE` for stricter rewards
- Adjust `PUNISHMENT_SCROLL_THRESHOLD` for different punishment timing

## 🚧 Roadmap

### Planned Features
- 💎 **Marketplace**: Spend points on rewards and customizations
- 📊 **Weekly Reports**: Track progress over time
- 🏆 **Achievements**: Unlock badges for milestones
- ⏰ **Daily Goals**: Set and track scrolling targets
- 📱 **More Platforms**: Twitter, Reddit, Facebook support
- 🎯 **Custom Alerts**: Personalized warning messages
- 📈 **Analytics**: Detailed charts and insights

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

### Development Setup
1. Fork the repository
2. Make your changes
3. Test thoroughly on all supported platforms
4. Submit a PR with clear description

## 📄 License

This project is open source and available under the [MIT License](LICENSE).

## 💬 Support

If you encounter issues or have questions:
- Open an issue on GitHub
- Check the troubleshooting section above
- Review closed issues for similar problems

## 🙏 Acknowledgments

- Built with Chrome Extensions Manifest V3
- Icons generated with HTML Canvas API
- Inspired by the need for healthier social media habits

---

**Version**: 1.0  
**Last Updated**: November 2025  
**Author**: Your Name

---

### ⭐ If this extension helps you build healthier browsing habits, consider starring the repository!
