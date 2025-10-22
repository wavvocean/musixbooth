# 🎧 MusixBooth

> **Sound tools, redefined.**

An all-in-one web platform for music producers and audio engineers. Streamline your workflow with essential audio tools in one place.

---

## 📋 Project Status

**Current Version:** `v0.0.7`  
**Development Phase:** ETAP 1 - Foundation & Core Tools  
**Progress:** Foundation + BPM Tapper + Delay/Reverb Calculator Complete ✅

---

## 🎯 Features

### ✅ Implemented

#### **v0.0.1-v0.0.2: Foundation & Routing**
- SPA architecture with smooth page transitions
- Navigation system without page reloads
- Dark theme with Geist typography
- Modular JS structure

#### **v0.0.3-v0.0.4: BPM Tapper** 
Tap-to-tempo calculator with real-time BPM detection
- Click or press SPACE to tap in rhythm
- Automatic BPM calculation from last 8 taps
- Visual pulse animation on each tap
- Auto-reset after 3 seconds of inactivity
- One-click BPM copy to clipboard
- Sync with Delay/Reverb Calculator via localStorage
- Toast notifications for user feedback

#### **v0.0.5-v0.0.7: Delay/Reverb Calculator**
Calculate precise timing values for audio effects
- BPM input with automatic Tapper sync
- Three calculation modes: Notes, Dotted, Triplet
- Complete delay table (1/1 to 1/128)
- Values displayed in milliseconds (ms) and frequency (Hz)
- One-click copy for each delay value
- Four reverb presets:
   - Large Hall (predelay 40ms, decay 2500ms)
   - Medium Room (predelay 20ms, decay 1200ms)
   - Small Room (predelay 10ms, decay 600ms)
   - Tight Ambience (predelay 5ms, decay 300ms)
- Automatic total time calculation
- Real-time updates on BPM/mode changes

### 🚧 In Development

#### **v0.0.8-v0.0.10: Scale Finder**
Interactive piano-based scale identification
- Click notes on virtual keyboard
- Automatic scale matching algorithm
- Major/Minor priority, exotic scales secondary
- Percentage match display
- Optional audio playback (Web Audio API)

- Public release as **v0.1.0**

### 📅 Planned (ETAP 2+)

- **BPM/Key Analyzer** - Audio file analysis (MP3 → client-side, WAV/FLAC → PRO)
- **LUFS Meter** - Loudness analysis with waveform visualization
- **User Accounts** - Analysis history and saved presets (post-launch)

---

## 🛠️ Tech Stack

### Frontend
- **HTML5** - Semantic structure
- **Tailwind CSS** - Utility-first styling via CDN
- **Vanilla JavaScript (ES6+)** - Modular application logic
- **Geist Font** - Modern, clean typography

### Architecture
- **SPA (Single Page Application)** - No page reloads, smooth transitions
- **Client-side processing** - Web Audio API for audio analysis
- **localStorage** - Cross-module data sync (BPM, settings)
- **Modular JS** - Separate files for routing and each tool

### Performance
- Fade-in/fade-out animations for smooth UX
- Responsive interactions with visual feedback
- Lightweight - no heavy frameworks

---

## 📁 Project Structure

```
musixbooth/
├── index.html              # Main HTML file with layout
└── script/
    ├── router.js           # Navigation & routing logic
    ├── tapper.js           # BPM Tapper module
    ├── calculator.js       # Delay/Reverb Calculator (WIP)
    └── scaleFinder.js      # Scale Finder (WIP)
└── README.md               # You reading it right now
```

---

## 🚀 Installation & Setup

### Local Development

1. **Clone or download the project**
   ```bash
   git clone <repo-url>
   cd musixbooth
   ```

2. **Project structure**
   ```
   musixbooth/
   ├── index.html
   └── js/
       ├── router.js
       ├── tapper.js
       ├── calculator.js
       └── scaleFinder.js
    └── README.md
   ```

3. **Run locally**
   - Simply open `index.html` in your browser
   - Or use a local server:
     ```bash
     # Python 3
     python -m http.server 8000
     
     # Node.js (if you have http-server installed)
     npx http-server
     ```

4. **Access the app**
   ```
   http://localhost:8000
   ```

---

## 🎨 Design System

### Color Palette
- **Background:** `#0e0e11` - Deep black
- **Accent:** `#00b7ff` - Electric blue
- **Text:** `#e0e0e0` - Light gray
- **Cards:** `#1a1a1f` - Dark gray
- **Borders:** `#2a2a35` - Subtle borders

### Typography
- **Font:** Geist (300, 400, 500, 600, 700)
- **Style:** Clean, modern sans-serif

### UI Principles
- Dark mode by default (inspired by DAW interfaces)
- Smooth transitions and micro-animations
- Minimal, distraction-free design
- Desktop-first approach

---

## 🗺️ Development Roadmap

### ✅ ETAP 1 - MVP Foundation (v0.0.1 - v0.0.14)
- [x] v0.0.1-v0.0.2: Project structure + routing system
- [x] v0.0.3-v0.0.4: BPM Tapper (full functionality)
- [x] v0.0.5-v0.0.7: Delay/Reverb Calculator
- [ ] v0.0.8-v0.0.10: Scale Finder
- [ ] v0.0.11-v0.0.14: Audio infrastructure preparation

### 🔄 ETAP 2 - Audio Analysis (v0.1.x)
- [ ] v0.1.0: BPM/Key Analyzer (client-side, MP3)
- [ ] v0.1.5: LUFS Meter (basic version)
- [ ] v0.1.8: File upload with drag & drop
- [ ] v0.1.10: Results caching in localStorage

### 🚀 ETAP 3 - Integration & Polish (v0.2.x)
- [ ] v0.2.0: Module synchronization (Tapper → Calculator → Analyzer)
- [ ] v0.2.3: Export functionality (CSV/PDF)
- [ ] v0.2.5: Accuracy testing
- [ ] v0.2.8: UI/UX refinements

### 💎 ETAP 4 - PRO Features (v1.0.0+)
- [ ] v1.0.0: Public launch
- [ ] v1.1.0: User accounts & authentication
- [ ] v1.2.0: Analysis history tracking
- [ ] v1.3.0: WAV/FLAC/AIFF support
- [ ] v1.4.0: Advanced LUFS visualizations
- [ ] v1.5.0: Multi-file comparison


### ETAP 5 - Desktop App (v2.0.0+)
- [ ] v2.x.x: Desktop application for easier access
---

## 🎯 Use Cases

**For Music Producers:**
- Quickly match project tempo to reference tracks
- Calculate delay times for creative effects
- Sync reverb decay to track tempo
- Identify scales from melody ideas

**For Audio Engineers:**
- Precise timing calculations for mixing
- Calculate pre-delay for vocals/instruments
- Match effect times to song groove
- Analyze loudness standards (LUFS - coming soon)

**For Both:**
- No more tab-switching between multiple websites
- All tools accessible offline (once loaded)
- Fast, distraction-free workflow
- BPM sync across all modules

---

## 🤝 Contributing

This is currently a solo development project in MVP phase. Contributions, feedback, and suggestions are welcome after initial release.

---

## 📄 License

TBD (To be determined post-launch)

---

## 🔮 Long-term Vision

- Desktop app (Electron wrapper)
- DAW integration (VST/AU plugins)
- Community hub for producers (preset sharing, mix references)
- Mobile companion app

---

## 📞 Contact

- **Project:** MusixBooth
- **Version:** v0.0.7 pre-release
- **Status:** Active Development

- **Developer:** @wavvocean
- **Contact mail:** wavvocean@icloud.com

---

**Built with ❤️ for the music production community**