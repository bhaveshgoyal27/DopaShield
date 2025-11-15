# 📊 DopaShield - Smart Scrolling Tracker & Rewards Marketplace

A comprehensive productivity system that helps you break doom-scrolling habits by tracking your browsing behavior on social media platforms and rewarding healthy habits with real-world benefits. DopaShield consists of a Chrome extension for behavior tracking and a React-based marketplace where you can redeem earned points for vouchers and donations.

---

## 🎯 Overview

**DopaShield** is a productivity-focused platform that *detects cheap dopamine loops* and rewards users for focused behavior. The system includes:

1. **Chrome Extension**: Real-time tracking of scrolling, time spent, and behavioral patterns on social media
2. **AI-Powered Detection**: Identifies doom-scrolling patterns and encourages healthy breaks
3. **Reward System**: Earn points for healthy browsing habits
4. **Marketplace Web App**: Redeem points for vouchers at local businesses or donate to sustainability projects

The goal is to *promote healthy study habits* while supporting local businesses and community initiatives.

---

## 🏗 Project Structure

```
dopashield/
├─ extension/                    # Chrome Extension
│  ├─ manifest.json             # Extension configuration
│  ├─ content.js                # Content script (tracking logic)
│  ├─ background.js             # Background service worker
│  ├─ popup.html                # Extension popup interface
│  ├─ popup.js                  # Popup logic and UI updates
│  ├─ icon16.png                # 16x16 icon
│  ├─ icon48.png                # 48x48 icon
│  └─ icon128.png               # 128x128 icon
│
├─ marketplace/                  # Marketplace Web App
│  ├─ src/
│  │  ├─ assets/
│  │  │  └─ products/           # Images for products (JPEG/PNG)
│  │  ├─ components/
│  │  │  ├─ ProductCard.jsx     # Product card UI with redeem button
│  │  │  ├─ QRModal.jsx         # QR code modal for redemptions
│  │  │  ├─ Marketplace.jsx     # Marketplace page with filters
│  │  │  └─ SearchBar.jsx       # Search bar component
│  │  ├─ data/
│  │  │  └─ products.js         # Product catalog with points costs
│  │  ├─ App.jsx
│  │  └─ main.jsx
│  ├─ public/
│  ├─ package.json
│  ├─ vite.config.js
│  └─ styles.css
│
└─ README.md                     # This file
```

---

## ⚡ Features

### Chrome Extension Features

#### Real-Time Tracking
- **Scroll Monitoring**: Tracks every significant scroll (100+ pixels) on supported platforms
- **Time Tracking**: Measures actual active scrolling time, not just tab open time
- **Scroll Speed**: Calculates scrolls per minute to identify doom-scrolling behavior
- **Shorts/Reels Detection**: Automatically identifies when you're on YouTube Shorts, Instagram Reels, or TikTok

#### Reward System 🎁
Earn points for healthy browsing habits:
- ⭐ **5 points/minute** for healthy browsing (less than 15 scrolls/min)
- 🎁 **25 bonus points** for taking 5+ minute breaks
- Points persist across sessions and sync with the marketplace
- Total points displayed prominently in the extension popup

#### Punishment System ⚠️
Stay accountable with consequences:
- Warning popup appears when doom-scrolling is detected
- **-50 points** if you ignore the warning and continue scrolling (20+ scrolls within 10 seconds)
- Points never go below 0
- Visual feedback with shake animations

#### Smart Warnings
- Triggers when scrolling more than 30 times/minute for 2+ minutes
- Triggers after 50+ rapid scrolls
- 10-second persistent popup with countdown timer
- Encourages taking breaks to earn rewards

#### Dashboard
Click the extension icon to view:
- Total reward points across all sites
- Current session statistics
- Per-site breakdown of scrolling behavior
- Color-coded scroll scores (green = healthy, yellow = moderate, red = excessive)
- Points earned per site

### Marketplace Features

#### Product Redemption
- **Product Cards**: Show name, image, description, vendor, points cost, category
- **Redeem Points**: Claim vouchers or donate to sustainability projects using earned points
- **Category Filter**: Toggle between All, Vouchers, and Donations
- **Search Function**: Search products by name or category
- **QR Codes**: Dynamic QR codes appear when products are redeemed for easy vendor validation

#### User Points System
- Points earned via the DopaShield extension automatically sync
- Redeeming points reduces your available balance
- Track your impact through donations and local business support
- Transparent point history and redemption log

#### Local Business Support
- Partner with Ithaca/Cornell area businesses
- Exclusive student discounts and offers
- Support local economy while staying productive

#### Sustainability Impact
- Direct donations to environmental projects
- Track community impact metrics
- Encourage positive behavior with meaningful rewards

---

## 🚀 Installation & Setup

### Part 1: Chrome Extension Setup

#### Prerequisites
- Google Chrome browser
- Basic knowledge of loading Chrome extensions

#### Steps

1. **Download/Clone the Repository**
   ```bash
   git clone <repository-url>
   cd dopashield/extension
   ```

2. **Generate Extension Icons**
   - Open `icon-generator.html` in your browser
   - Click each "Download" button to save all three icon sizes
   - Save them in the extension folder as:
     - `icon16.png`
     - `icon48.png`
     - `icon128.png`

3. **Load Extension in Chrome**
   - Open Chrome and navigate to `chrome://extensions/`
   - Enable "Developer mode" (toggle in top-right corner)
   - Click "Load unpacked"
   - Select the `extension` folder
   - The extension icon should appear in your Chrome toolbar

### Part 2: Marketplace Web App Setup

#### Prerequisites
- Node.js (v18+)
- npm or yarn

#### Installation Steps

1. **Navigate to Marketplace Directory**
   ```bash
   cd dopashield/marketplace
   ```

2. **Install Dependencies**
   ```bash
   npm install
   ```

3. **Run Development Server**
   ```bash
   npm run dev
   ```
   The app will run at: `http://localhost:5173/`

4. **Build for Production**
   ```bash
   npm run build
   npm run preview
   ```
   Deploy to Netlify, Vercel, or any static hosting service.

#### Adding Products to Marketplace

1. Place product images in `src/assets/products/`
2. Update `src/data/products.js`:
   ```javascript
   {
     id: 1,
     category: "Voucher", // or "Donation"
     name: "Coffee Shop Gift Card",
     description: "$10 credit at Local Cafe",
     pointsCost: 500,
     vendor: "Local Cafe",
     image: "/src/assets/products/coffee.jpg",
     link: "https://localcafe.com" // optional
   }
   ```

---

## 🎮 How to Use

### Getting Started with Extension

1. Install the extension following the steps above
2. Visit any supported platform (YouTube, Instagram, TikTok, or LinkedIn)
3. Browse normally - the extension tracks your behavior automatically

### Viewing Your Stats

- Click the extension icon in your Chrome toolbar
- See your total reward points at the top
- View current session stats for the active tab
- Scroll down to see stats from all tracked sites

### Earning Points

- Browse mindfully (keep scrolls under 15/minute)
- Take regular breaks (5+ minutes = bonus)
- Healthy scroll rates show a ✨ sparkle icon
- Points automatically sync with marketplace

### Understanding Warnings

- Red warning popup = You're doom-scrolling
- Take a break immediately to avoid losing points
- Continuing to scroll after warning = -50 points
- Dismiss the popup by clicking "Got it!" or wait 10 seconds

### Using the Marketplace

1. **Browse Products**: Visit the marketplace web app
2. **Filter & Search**: Use category filters or search bar to find rewards
3. **Check Points**: Your extension points sync automatically
4. **Redeem**: Click "Redeem" on any product you can afford
5. **Get QR Code**: Receive a QR code to present at vendor or donation confirmation
6. **Track Impact**: View your redemption history and community impact

---

## 🌐 Supported Platforms

### Extension Tracking
- **YouTube** (youtube.com) - including Shorts detection
- **Instagram** (instagram.com) - including Reels detection
- **TikTok** (tiktok.com)
- **LinkedIn** (linkedin.com)

### Marketplace Partners
- Local Ithaca/Cornell businesses
- Campus dining locations
- Sustainability projects
- Community organizations

---

## ⚙️ Configuration

### Extension Customization (in `content.js`)

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

### Marketplace Settings

Point costs and product availability can be configured in `src/data/products.js`.

---

## 🔒 Privacy & Data

### What's Tracked
- Scroll count and speed on supported sites
- Time actively scrolling (not idle time)
- Reward points earned/lost
- Redemption history (anonymous)

### What's NOT Tracked
- Content you view
- Pages you visit (beyond hostname)
- Personal browsing history
- Identifying information

### Data Storage
- Extension data stored locally in Chrome's storage API
- Marketplace uses secure authentication (when implemented)
- No tracking across websites
- You can reset all data anytime

---

## 🛠️ Troubleshooting

### Extension Issues

#### Extension Not Tracking
- Make sure you're on a supported platform
- Refresh the page after installing
- Check if extension is enabled in `chrome://extensions/`

#### Points Not Updating
- Scroll significantly (100+ pixels) to register activity
- Wait 1-2 seconds for UI to update
- Try closing and reopening the popup

#### Warning Not Appearing
- Must scroll rapidly (30+/min for 2+ minutes) or make 50+ rapid scrolls
- Check if popups are blocked on the site
- Refresh the page and try again

### Marketplace Issues

#### Points Not Syncing
- Ensure extension is installed and active
- Check browser console for sync errors
- Try logging out and back in

#### Product Images Not Loading
- Verify image paths in `products.js`
- Check that images exist in `src/assets/products/`
- Clear browser cache

#### Redemption Failed
- Ensure you have enough points
- Check internet connection
- Try refreshing the page

---

## 🎨 Customization

### Extension Theme

Edit gradient colors in `popup.html` and notification styles in `content.js`:

```css
/* Purple gradient (current) */
background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);

/* Cornell Red theme */
background: linear-gradient(135deg, #B31B1B 0%, #8B0000 100%);

/* Blue gradient */
background: linear-gradient(135deg, #667eea 0%, #4ca1af 100%);
```

### Marketplace UI

The marketplace uses Cornell-themed colors:
- Primary: Cornell Red (#B31B1B)
- Secondary: White and dark gray
- Modern card-based design with hover animations

Customize in `styles.css`:
```css
:root {
  --primary-color: #B31B1B;
  --secondary-color: #ffffff;
  --text-color: #333333;
}
```

### Adjusting Sensitivity

Modify thresholds in `content.js`:
- Increase `SCROLL_THRESHOLD` for less sensitive tracking
- Decrease `HEALTHY_SCROLL_RATE` for stricter rewards
- Adjust `PUNISHMENT_SCROLL_THRESHOLD` for different punishment timing

---

## 🚧 Roadmap

### Planned Features

#### Extension
- 📱 **More Platforms**: Twitter, Reddit, Facebook support
- 📊 **Weekly Reports**: Track progress over time with analytics
- 🏆 **Achievements**: Unlock badges for milestones
- ⏰ **Daily Goals**: Set and track personalized scrolling targets
- 🎯 **Custom Alerts**: Personalized warning messages
- 📈 **Advanced Analytics**: Detailed charts and insights

#### Marketplace
- 🔐 **User Accounts**: Secure login and profile management
- 💳 **Dynamic QR Codes**: Real-time voucher validation
- 🏪 **More Partners**: Expand local business network
- 🌱 **Impact Tracking**: Visualize your sustainability contributions
- 🎁 **Seasonal Offers**: Special deals and limited-time rewards
- 🤝 **Social Features**: Share achievements with friends
- 📱 **Mobile App**: iOS and Android companion apps

---

## 🔧 Tech Stack

### Extension
- Chrome Extensions Manifest V3
- Vanilla JavaScript
- Chrome Storage API
- HTML5 Canvas (for icons)

### Marketplace
- **React 18** + **Vite** – Fast, modern front-end framework
- **CSS / Flexbox / Grid** – Responsive modern layout
- **Static Hosting Ready** – Deploy to Netlify/Vercel
- **QR Code Generation** – For voucher redemption
- **RESTful API** (planned) – Backend integration

---

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

### Development Setup

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/AmazingFeature`)
3. Make your changes
4. Test thoroughly on all supported platforms
5. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
6. Push to the branch (`git push origin feature/AmazingFeature`)
7. Open a Pull Request

### Code Style
- Use ESLint for JavaScript linting
- Follow React best practices for marketplace
- Keep extension code vanilla JS for performance
- Write clear commit messages

---

## 💡 Notes & Tips

### Extension
- **Extensible**: Easily add new platforms to track
- **Privacy-respecting**: Only behavior patterns tracked, no content
- **Hackathon-ready**: Fully functional demo with polished UI
- **Lightweight**: Minimal performance impact on browsing

### Marketplace
- **Scalable**: Easy to add new products and partners
- **Local Focus**: Support Ithaca/Cornell community
- **Real Impact**: Connect productivity to tangible rewards
- **Demo-Ready**: Functional with static data for presentations

---

## 📄 License

This project is open source and available under the [MIT License](LICENSE).

---

## 💬 Support

If you encounter issues or have questions:
- Open an issue on GitHub
- Check the troubleshooting section above
- Review closed issues for similar problems
- Contact the development team

---

## 🙏 Acknowledgments

- Built with Chrome Extensions Manifest V3
- React + Vite for marketplace frontend
- Icons generated with HTML Canvas API
- Inspired by the need for healthier social media habits
- Cornell community and local business partners

---

**Version**: 1.0  
**Last Updated**: November 2025  
**Maintainers**: DopaShield Team

---

### ⭐ If DopaShield helps you build healthier browsing habits while supporting your local community, consider starring the repository!

**Note**: The marketplace is now live! Start earning points and redeem them for real rewards at local Ithaca/Cornell businesses or donate to sustainability projects.