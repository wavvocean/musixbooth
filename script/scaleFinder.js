const scaleFinderModule = {
    selectedNotes: new Set(),
    
    scales: {
        'Major': [0, 2, 4, 5, 7, 9, 11],
        'Minor (Natural)': [0, 2, 3, 5, 7, 8, 10],
        'Minor (Harmonic)': [0, 2, 3, 5, 7, 8, 11],
        'Minor (Melodic)': [0, 2, 3, 5, 7, 9, 11],
        'Dorian': [0, 2, 3, 5, 7, 9, 10],
        'Phrygian': [0, 1, 3, 5, 7, 8, 10],
        'Lydian': [0, 2, 4, 6, 7, 9, 11],
        'Mixolydian': [0, 2, 4, 5, 7, 9, 10],
        'Locrian': [0, 1, 3, 5, 6, 8, 10],
        'Pentatonic Major': [0, 2, 4, 7, 9],
        'Pentatonic Minor': [0, 3, 5, 7, 10],
        'Blues': [0, 3, 5, 6, 7, 10],
        'Whole Tone': [0, 2, 4, 6, 8, 10],
        'Diminished': [0, 2, 3, 5, 6, 8, 9, 11],
        'Chromatic': [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11]
    },
    
    noteNames: ['C', 'C#', 'D', 'D#', 'E', 'F', 'F#', 'G', 'G#', 'A', 'A#', 'B'],
    
    init() {
        this.setupEventListeners();
    },
    
    setupEventListeners() {
        document.querySelectorAll('.piano-key').forEach(key => {
            key.addEventListener('click', (e) => {
                const note = parseInt(e.target.dataset.note);
                this.toggleNote(note);
            });
        });
        
        const resetBtn = document.getElementById('scale-reset-btn');
        if (resetBtn) {
            resetBtn.addEventListener('click', () => this.reset());
        }
    },
    
    toggleNote(note) {
        const key = document.querySelector(`[data-note="${note}"]`);
        
        if (this.selectedNotes.has(note)) {
            this.selectedNotes.delete(note);
            key.classList.remove('selected');
        } else {
            this.selectedNotes.add(note);
            key.classList.add('selected');
        }
        
        this.findScales();
    },
    
    findScales() {
        if (this.selectedNotes.size === 0) {
            document.getElementById('scale-results').innerHTML = `
                <div class="text-center text-gray-500 py-8">
                    <p class="mb-2">🎹 Click on piano keys to select notes</p>
                    <p class="text-sm">The system will find matching scales automatically</p>
                </div>
            `;
            return;
        }
        
        const selectedArray = Array.from(this.selectedNotes).sort((a, b) => a - b);
        const matches = [];
        
        for (let root = 0; root < 12; root++) {
            for (const [scaleName, intervals] of Object.entries(this.scales)) {
                const scaleNotes = intervals.map(interval => (root + interval) % 12);
                const match = this.calculateMatch(selectedArray, scaleNotes);
                
                if (match.percentage > 0) {
                    matches.push({
                        name: `${this.noteNames[root]} ${scaleName}`,
                        percentage: match.percentage,
                        missing: match.missing,
                        extra: match.extra
                    });
                }
            }
        }
        
        matches.sort((a, b) => b.percentage - a.percentage);
        
        const priorityScales = matches.filter(m => 
            m.name.includes('Major') || m.name.includes('Minor')
        ).slice(0, 5);
        
        const otherScales = matches.filter(m => 
            !m.name.includes('Major') && !m.name.includes('Minor')
        ).slice(0, 5);
        
        this.displayResults([...priorityScales, ...otherScales].slice(0, 10));
    },
    
    calculateMatch(selectedNotes, scaleNotes) {
        const selectedSet = new Set(selectedNotes);
        const scaleSet = new Set(scaleNotes);
        
        let correctNotes = 0;
        selectedNotes.forEach(note => {
            if (scaleSet.has(note)) correctNotes++;
        });
        
        const missing = scaleNotes.filter(note => !selectedSet.has(note));
        const extra = selectedNotes.filter(note => !scaleSet.has(note));
        
        const percentage = selectedNotes.length > 0 
            ? Math.round((correctNotes / selectedNotes.length) * 100)
            : 0;
        
        return { percentage, missing, extra };
    },
    
    displayResults(matches) {
        const resultsContainer = document.getElementById('scale-results');
        
        if (matches.length === 0) {
            resultsContainer.innerHTML = `
                <div class="text-center text-gray-500 py-8">
                    <p>No matching scales found</p>
                </div>
            `;
            return;
        }
        
        resultsContainer.innerHTML = matches.map((match, index) => `
            <div class="card p-4 rounded-lg mb-3 hover:border-[#00b7ff] transition-colors">
                <div class="flex justify-between items-center mb-2">
                    <div class="font-semibold ${index < 3 ? 'accent' : ''}">${match.name}</div>
                    <div class="text-sm font-mono ${match.percentage === 100 ? 'accent' : 'text-gray-400'}">
                        ${match.percentage}% match
                    </div>
                </div>
                ${match.percentage < 100 ? `
                    <div class="text-xs text-gray-600 mt-2">
                        ${match.extra.length > 0 ? `Extra notes: ${match.extra.map(n => this.noteNames[n]).join(', ')}` : ''}
                        ${match.missing.length > 0 ? `Missing: ${match.missing.map(n => this.noteNames[n]).join(', ')}` : ''}
                    </div>
                ` : ''}
            </div>
        `).join('');
    },
    
    reset() {
        this.selectedNotes.clear();
        document.querySelectorAll('.piano-key').forEach(key => {
            key.classList.remove('selected');
        });
        this.findScales();
    }
};

function loadScaleFinderModule() {
    const content = document.getElementById('app-content');
    content.innerHTML = `
        <div class="max-w-6xl mx-auto">
            <h2 class="text-4xl font-bold mb-8">Scale Finder</h2>
            
            <div class="card p-8 rounded-lg mb-6">
                <h3 class="text-lg font-semibold mb-4">Select Notes</h3>
                
                <div class="piano-container mb-6">
                    <div class="piano relative h-48 bg-[#0e0e11] rounded-lg overflow-hidden">
                        <div class="white-keys flex h-full">
                            <div class="piano-key white-key" data-note="0" data-name="C"></div>
                            <div class="piano-key white-key" data-note="2" data-name="D"></div>
                            <div class="piano-key white-key" data-note="4" data-name="E"></div>
                            <div class="piano-key white-key" data-note="5" data-name="F"></div>
                            <div class="piano-key white-key" data-note="7" data-name="G"></div>
                            <div class="piano-key white-key" data-note="9" data-name="A"></div>
                            <div class="piano-key white-key" data-note="11" data-name="B"></div>
                        </div>
                        
                        <div class="black-keys absolute top-0 left-0 w-full h-full pointer-events-none">
                            <div class="piano-key black-key pointer-events-auto" data-note="1" data-name="C#" style="left: 11.9%"></div>
                            <div class="piano-key black-key pointer-events-auto" data-note="3" data-name="D#" style="left: 25.5%"></div>
                            <div class="piano-key black-key pointer-events-auto" data-note="6" data-name="F#" style="left: 54.4%"></div>
                            <div class="piano-key black-key pointer-events-auto" data-note="8" data-name="G#" style="left: 68.5%"></div>
                            <div class="piano-key black-key pointer-events-auto" data-note="10" data-name="A#" style="left: 82.1%"></div>
                        </div>
                    </div>
                </div>
                
                <button id="scale-reset-btn" class="px-6 py-2 bg-[#2a2a35] rounded hover:bg-[#3a3a45] transition-all font-medium">
                    Reset Selection
                </button>
            </div>
            
            <div class="card p-6 rounded-lg">
                <h3 class="text-lg font-semibold mb-4">Matching Scales</h3>
                <div id="scale-results">
                    <div class="text-center text-gray-500 py-8">
                        <p class="mb-2">🎹 Click on piano keys to select notes</p>
                        <p class="text-sm">The system will find matching scales automatically</p>
                    </div>
                </div>
            </div>
            
            <div class="mt-6 text-xs text-gray-600 text-center">
                💡 Tip: Major and Minor scales are prioritized in results. Perfect matches (100%) appear at the top.
            </div>
        </div>
    `;
    
    const style = document.createElement('style');
    style.textContent = `
        .piano {
            user-select: none;
        }
        
        .white-key {
            flex: 1;
            background: linear-gradient(180deg, #f5f5f5 0%, #e0e0e0 100%);
            border: 2px solid #2a2a35;
            border-radius: 0 0 4px 4px;
            cursor: pointer;
            transition: all 0.2s ease;
            position: relative;
            display: flex;
            align-items: flex-end;
            justify-content: center;
            padding-bottom: 12px;
            font-size: 14px;
            font-weight: 600;
            color: #666;
        }
        
        .white-key:hover {
            background: linear-gradient(180deg, #00b7ff 0%, #0099dd 100%);
            color: white;
            transform: translateY(2px);
        }
        
        .white-key.selected {
            background: linear-gradient(180deg, #00b7ff 0%, #0099dd 100%);
            color: white;
            border-color: #00b7ff;
        }
        
        .white-key::after {
            content: attr(data-name);
        }
        
        .black-key {
            position: absolute;
            width: 8%;
            height: 60%;
            background: linear-gradient(180deg, #1a1a1f 0%, #0e0e11 100%);
            border: 2px solid #2a2a35;
            border-radius: 0 0 3px 3px;
            cursor: pointer;
            transform: translateX(-50%);
            transition: all 0.2s ease;
            z-index: 10;
        }
        
        .black-key:hover {
            background: linear-gradient(180deg, #00b7ff 0%, #0099dd 100%);
            transform: translateX(-50%) translateY(2px);
        }
        
        .black-key.selected {
            background: linear-gradient(180deg, #00b7ff 0%, #0099dd 100%);
            border-color: #00b7ff;
        }
    `;
    document.head.appendChild(style);
    
    setTimeout(() => {
        scaleFinderModule.init();
    }, 0);
}