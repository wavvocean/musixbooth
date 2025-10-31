// Delay/Reverb Calculator Module - v0.0.5-v0.0.7

const calculatorModule = {
    bpm: 120,
    currentMode: 'notes',
    
    divisions: [
        { name: '1/1', value: 1 },
        { name: '1/2', value: 2 },
        { name: '1/4', value: 4 },
        { name: '1/8', value: 8 },
        { name: '1/16', value: 16 },
        { name: '1/32', value: 32 },
        { name: '1/64', value: 64 },
        { name: '1/128', value: 128 }
    ],
    
    reverbPresets: {
        hall: {
            name: 'Large Hall',
            predelayBeats: 1/8,
            decayBeats: 2,
            color: '#00b7ff'
        },
        room: {
            name: 'Medium Room',
            predelayBeats: 1/16,
            decayBeats: 1,
            color: '#00ff88'
        },
        small: {
            name: 'Small Room',
            predelayBeats: 1/32,
            decayBeats: 0.5,
            color: '#ffaa00'
        },
        tight: {
            name: 'Tight Ambience',
            predelayBeats: 1/64,
            decayBeats: 0.25,
            color: '#ff5555'
        }
    },
    
    init() {
        // Load BPM from localStorage if available
        const savedBPM = localStorage.getItem('musixbooth_bpm');
        if (savedBPM) {
            this.bpm = parseInt(savedBPM);
        }
        
        this.setupEventListeners();
        this.calculate();
        
        // Apply default reverb preset (Large Hall)
        setTimeout(() => {
            this.applyReverbPreset('hall');
        }, 100);
    },
    
    setupEventListeners() {
        const bpmInput = document.getElementById('calc-bpm');
        if (bpmInput) {
            bpmInput.addEventListener('input', (e) => {
                this.bpm = parseInt(e.target.value) || 120;
                this.calculate();
            });
        }
        
        document.addEventListener('click', (e) => {
            if (e.target.classList.contains('mode-btn')) {
                this.currentMode = e.target.dataset.mode;
                
                document.querySelectorAll('.mode-btn').forEach(b => b.classList.remove('active'));
                e.target.classList.add('active');
                
                this.calculate();
            }
            
            if (e.target.classList.contains('reverb-preset-btn')) {
                const preset = e.target.dataset.preset;
                this.applyReverbPreset(preset);
            }
        });
    },
    
    calculate() {
        const oneBeatMs = (60 / this.bpm) * 1000;
        
        this.divisions.forEach(division => {
            let ms;
            
            switch(this.currentMode) {
                case 'notes':
                    ms = oneBeatMs / division.value;
                    break;
                case 'dotted':
                    ms = (oneBeatMs / division.value) * 1.5;
                    break;
                case 'triplet':
                    ms = (oneBeatMs / division.value) * (2/3);
                    break;
            }
            
            const hz = 1000 / ms;
            
            const msCell = document.getElementById(`delay-ms-${division.value}`);
            const hzCell = document.getElementById(`delay-hz-${division.value}`);
            const totalCell = document.getElementById(`delay-total-${division.value}`);
            
            if (msCell) msCell.textContent = ms.toFixed(2);
            if (hzCell) hzCell.textContent = hz.toFixed(2);
            if (totalCell) totalCell.textContent = ms.toFixed(2);
        });
    },
    
    applyReverbPreset(presetKey) {
        const preset = this.reverbPresets[presetKey];
        if (!preset) return;
        
        const oneBeatMs = (60 / this.bpm) * 1000;
        
        const predelay = Math.round((oneBeatMs / 4) * preset.predelayBeats);
        const decay = Math.round((oneBeatMs * 4) * preset.decayBeats);
        const total = predelay + decay;
        
        document.getElementById('reverb-preset-name').textContent = preset.name;
        document.getElementById('reverb-predelay').textContent = predelay;
        document.getElementById('reverb-predelay-note').textContent = this.formatBeats(preset.predelayBeats);
        document.getElementById('reverb-decay').textContent = decay;
        document.getElementById('reverb-decay-bars').textContent = `${preset.decayBeats} ${preset.decayBeats === 1 ? 'bar' : 'bars'}`;
        document.getElementById('reverb-total').textContent = total;
        
        document.querySelectorAll('.reverb-preset-btn').forEach(btn => {
            btn.classList.remove('active');
        });
        document.querySelector(`[data-preset="${presetKey}"]`).classList.add('active');
        
        this.showNotification(`${preset.name} preset applied!`, 'success');
    },
    
    formatBeats(beats) {
        if (beats >= 1) return `${beats} beat${beats > 1 ? 's' : ''}`;
        if (beats === 0.5) return '1/2 note';
        if (beats === 0.25) return '1/4 note';
        const division = Math.round(1 / beats);
        return `1/${division}`;
    },
    
    copyToClipboard(text, message) {
        navigator.clipboard.writeText(text).then(() => {
            this.showNotification(message, 'success');
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

function loadCalculatorModule() {
    const content = document.getElementById('app-content');
    
    const savedBPM = localStorage.getItem('musixbooth_bpm') || '120';
    
    content.innerHTML = `
        <div class="max-w-6xl mx-auto">
            <h2 class="text-4xl font-bold mb-8">Delay / Reverb Calculator</h2>
            
            <!-- BPM Input Section -->
            <div class="card p-6 rounded-lg mb-6">
                <div class="flex items-center gap-4">
                    <div class="flex-1">
                        <label class="block text-sm mb-2 font-medium">BPM (Tempo)</label>
                        <input 
                            type="number" 
                            id="calc-bpm" 
                            class="w-full bg-[#0e0e11] border border-[#2a2a35] rounded px-4 py-3 text-2xl font-bold accent focus:border-[#00b7ff] focus:outline-none transition-colors" 
                            placeholder="120" 
                            value="${savedBPM}"
                            min="1"
                            max="999"
                        >
                    </div>
                    <div class="text-sm text-gray-500 pt-6">
                        <div class="flex items-center gap-2">
                            <span class="w-2 h-2 bg-[#00b7ff] rounded-full"></span>
                            Synced from Tapper
                        </div>
                    </div>
                </div>
            </div>
            
            <!-- Mode Selection -->
            <div class="card p-6 rounded-lg mb-6">
                <h3 class="text-lg font-semibold mb-4">Calculation Mode</h3>
                <div class="flex gap-3">
                    <button class="mode-btn active flex-1 px-6 py-3 bg-[#2a2a35] rounded hover:bg-[#3a3a45] transition-all font-medium" data-mode="notes">
                        Notes
                    </button>
                    <button class="mode-btn flex-1 px-6 py-3 bg-[#2a2a35] rounded hover:bg-[#3a3a45] transition-all font-medium" data-mode="dotted">
                        Dotted
                    </button>
                    <button class="mode-btn flex-1 px-6 py-3 bg-[#2a2a35] rounded hover:bg-[#3a3a45] transition-all font-medium" data-mode="triplet">
                        Triplet
                    </button>
                </div>
            </div>
            
            <!-- Delay Times Table -->
            <div class="card p-6 rounded-lg mb-6">
                <h3 class="text-lg font-semibold mb-4">Delay Times</h3>
                <div class="overflow-x-auto">
                    <table class="w-full text-sm">
                        <thead>
                            <tr class="border-b border-[#2a2a35]">
                                <th class="text-left py-3 px-4 font-semibold">Note</th>
                                <th class="text-right py-3 px-4 font-semibold">Delay Time (ms)</th>
                                <th class="text-right py-3 px-4 font-semibold">Frequency (Hz)</th>
                                <th class="text-right py-3 px-4 font-semibold">Total Time (ms)</th>
                                <th class="text-right py-3 px-4 font-semibold">Action</th>
                            </tr>
                        </thead>
                        <tbody>
                            ${[1, 2, 4, 8, 16, 32, 64, 128].map(div => `
                                <tr class="border-b border-[#2a2a35] hover:bg-[#1a1a1f] transition-colors">
                                    <td class="py-3 px-4 font-medium">1/${div}</td>
                                    <td class="text-right py-3 px-4 font-mono accent" id="delay-ms-${div}">--</td>
                                    <td class="text-right py-3 px-4 font-mono text-gray-400" id="delay-hz-${div}">--</td>
                                    <td class="text-right py-3 px-4 font-mono accent" id="delay-total-${div}">--</td>
                                    <td class="text-right py-3 px-4">
                                        <button 
                                            class="copy-delay-btn text-xs px-3 py-1 bg-[#00b7ff] text-[#0e0e11] rounded hover:bg-[#00d4ff] transition-all font-medium"
                                            onclick="calculatorModule.copyToClipboard(document.getElementById('delay-ms-${div}').textContent + ' ms', 'Delay time copied!')"
                                        >
                                            Copy
                                        </button>
                                    </td>
                                </tr>
                            `).join('')}
                        </tbody>
                    </table>
                </div>
            </div>
            
            <!-- Reverb Presets -->
            <div class="card p-6 rounded-lg">
                <h3 class="text-lg font-semibold mb-4">Reverb Presets</h3>
                
                <div class="grid grid-cols-4 gap-3 mb-6">
                    <button class="reverb-preset-btn px-4 py-3 bg-[#2a2a35] rounded hover:bg-[#3a3a45] transition-all text-sm font-medium" data-preset="hall">
                        Large Hall
                    </button>
                    <button class="reverb-preset-btn px-4 py-3 bg-[#2a2a35] rounded hover:bg-[#3a3a45] transition-all text-sm font-medium" data-preset="room">
                        Medium Room
                    </button>
                    <button class="reverb-preset-btn px-4 py-3 bg-[#2a2a35] rounded hover:bg-[#3a3a45] transition-all text-sm font-medium" data-preset="small">
                        Small Room
                    </button>
                    <button class="reverb-preset-btn px-4 py-3 bg-[#2a2a35] rounded hover:bg-[#3a3a45] transition-all text-sm font-medium" data-preset="tight">
                        Tight Ambience
                    </button>
                </div>
                
                <div class="bg-[#0e0e11] rounded-lg p-4 border border-[#2a2a35]">
                    <div class="text-sm font-semibold mb-3" id="reverb-preset-name">Select a preset</div>
                    <div class="grid grid-cols-3 gap-4 text-sm">
                        <div>
                            <div class="text-gray-500 text-xs mb-1">Pre-delay</div>
                            <div class="font-mono accent"><span id="reverb-predelay">--</span> ms</div>
                            <div class="text-gray-600 text-xs mt-1" id="reverb-predelay-note">--</div>
                        </div>
                        <div>
                            <div class="text-gray-500 text-xs mb-1">Decay Time</div>
                            <div class="font-mono accent"><span id="reverb-decay">--</span> ms</div>
                            <div class="text-gray-600 text-xs mt-1" id="reverb-decay-bars">--</div>
                        </div>
                        <div>
                            <div class="text-gray-500 text-xs mb-1">Total Time</div>
                            <div class="font-mono accent"><span id="reverb-total">--</span> ms</div>
                        </div>
                    </div>
                </div>
            </div>
            
            <div class="mt-6 text-xs text-gray-600 text-center">
                💡 Tip: Use these values as starting points in your DAW. Trust your ears for final adjustments.
            </div>
        </div>
    `;
    
    const style = document.createElement('style');
    style.textContent = `
        .mode-btn.active {
            background-color: #00b7ff !important;
            color: #0e0e11 !important;
        }
        .reverb-preset-btn.active {
            background-color: #00b7ff !important;
            color: #0e0e11 !important;
        }
    `;
    document.head.appendChild(style);
    
    setTimeout(() => {
        calculatorModule.init();
    }, 0);
}