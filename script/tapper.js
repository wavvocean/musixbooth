const tapperModule = {
    taps: [],
    bpm: 0,
    resetTimeout: null,
    resetDelay: 3000,
    spacebarHandler: null,
    isInitialized: false,

    init() {
        if (this.isInitialized) {
            return;
        }
        this.setupEventListeners();
        this.isInitialized = true;
    },

    cleanup() {
        if (this.spacebarHandler) {
            document.removeEventListener('keydown', this.spacebarHandler);
            this.spacebarHandler = null;
        }
        this.isInitialized = false;
    },

    setupEventListeners() {
        const tapCircle = document.getElementById('tap-circle');
        if (tapCircle) {
            tapCircle.addEventListener('click', () => this.handleTap());
        }
        this.spacebarHandler = (e) => {
            if (e.code === 'Space' && router.currentRoute === 'tapper') {
                e.preventDefault();
                this.handleTap();
            }
        };

        document.removeEventListener('keydown', this.spacebarHandler);
        document.addEventListener('keydown', this.spacebarHandler);

        const resetBtn = document.getElementById('reset-btn');
        if (resetBtn) {
            resetBtn.addEventListener('click', () => this.reset());
        }
        const copyBtn = document.getElementById('copy-btn');
        if (copyBtn) {
            copyBtn.addEventListener('click', () => this.copyBtn());
        }
    },

    handleTap() {
        const now = Date.now();

        if (this.taps.length > 0) {
            const lastTap = this.taps[this.taps.length - 1];
            if (now - lastTap < 50) {
                return;
            }
        }
        this.taps.push(now);

        const circle = document.getElementById('tap-circle');
        if (circle) {
            circle.classList.remove('pulse-animation');
            void circle.offsetWidth;
            circle.classList.add('pulse-animation');
        }

        if (this.taps.length > 8) {
            this.taps.shift();
        }

        if (this.taps.length >= 2) {
            this.calculateBPM();
        }

        clearTimeout(this.resetTimeout);
        this.resetTimeout = setTimeout(() => this.reset(), this.resetDelay);
    },

    calculateBPM() {
        let intervals = [];
        for (let i = 1; i < this.taps.length; i++) {
            intervals.push(this.taps[i] - this.taps[i - 1]);
        }

        if (intervals.length >= 3) {
            const sorted = [...intervals].sort((a, b) => a - b);
            const median = sorted[Math.floor(sorted.length / 2)];
            intervals = intervals.filter(interval => {
                return interval > median * 0.5 && interval < median * 2;
            });
        }

        const avgInterval = intervals.reduce((a, b) => a + b, 0) / intervals.length;
        this.bpm = Math.round(60000 / avgInterval);

        if (this.bpm < 20) this.bpm = 20;
        
        this.updateDisplay();
    },

        updateDisplay() {
            const display = document.getElementById('bpm-display');
            if (display) {
                display.textContent = this.bpm;

                display.style.transform = 'scale(1.1)';
                setTimeout(() => {
                    display.style.transform = 'scale(1)';
                }, 100);
            }
        },

        reset() {
            this.taps = [];
            this.bpm = 0;
            const display = document.getElementById('bpm-display');
            if (display) {
                display.textContent = '--';
            }
            clearTimeout(this.resetTimeout);
        },

        copyBPM() {
            if (this.bpm === 0) {
                this.showNotification('No BPM to copy!', 'error');
                return;
            }

            navigator.clipboard.writeText(this.bpm.toString()).then(() => {
                this.showNotification(`BPM ${this.bpm} copied!`, 'success');

                localStorage.setItem('musixbooth_bpm', this.bpm);
            }).catch(() => {
                this.showNotification('Failed to copy', 'error');
            });
        },

        showNotification(message, type) {
            const notification = document.createElement('div');
            notification.className = `fixed top-4 right-4 px-6 py-3 rounded-lg font-semibold z-50 transition-all ${
                type === 'success' ? 'bg-[#00b7ff] text-[#0e0e11]' : 'bg-red-500 text-white'
            }`;
            notification.textContent = message;
            notification.style.animation = 'fadeIn 0.3s ease-in-out';

            document.body.appendChild(notification);
            setTimeout(() => {
                notification.style.opacity = '0';
                setTimeout(() => notification.remove(), 300);
            }, 2000);
        }
    };

    function loadTapperModule() {
        const content = document.getElementById('app-content');
        content.innerHTML = `
            <div class="max-w-2xl mx-auto">
                <h2 class="text-4xl font-bold mb-8">BPM Tapper</h2>
                <div class="card p-8 rounded-lg text-center">
                    <div class="mb-8">
                        <div id="bpm-display" class="text-6xl font-bold accent mb-2 transition-transform duration-100">--</div>
                        <div class="text-sm text-gray-400">BPM</div>
                    </div>
                    
                    <div id="tap-circle" class="w-48 h-48 mx-auto rounded-full border-4 border-[#00b7ff] flex items-center justify-center cursor-pointer mb-8 transition-all duration-100 hover:bg-[#00b7ff] hover:bg-opacity-10">
                        <span class="text-xl font-semibold">TAP HERE</span>
                    </div>
                    
                    <p class="text-sm text-gray-400 mb-6">Press <kbd class="px-2 py-1 bg-[#2a2a35] rounded text-xs">SPACE</kbd> or click the circle to tap in rhythm</p>
                    
                    <div class="flex gap-4 justify-center mb-6">
                        <button id="reset-btn" class="px-6 py-2 bg-[#2a2a35] rounded hover:bg-[#3a3a45] transition-all font-medium">
                            Reset
                        </button>
                        <button id="copy-btn" class="btn-primary px-6 py-2 rounded font-semibold">
                            Copy BPM
                        </button>
                    </div>
                    
                    <div class="text-xs text-gray-600 mt-4">
                        💡 Tip: Tap at least 4 times for accurate results. Auto-resets after 3 seconds of inactivity.
                    </div>
                </div>
                
                <div class="mt-6 card p-4 rounded-lg">
                    <h3 class="text-sm font-semibold mb-2">Quick Actions</h3>
                    <button onclick="router.navigate('calculator')" class="text-sm text-[#00b7ff] hover:underline">
                        → Use this BPM in Delay/Reverb Calculator
                    </button>
                </div>
            </div>
        `;

        setTimeout(() => {
            tapperModule.init();
        }, 0);
    }