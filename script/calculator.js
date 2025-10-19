// Delay/Reverb Calculator Module (Coming in Day 5-7)

function loadCalculatorModule() {
    const content = document.getElementById('app-content');
    
    // Try to get BPM from localStorage (from Tapper)
    const savedBPM = localStorage.getItem('musixbooth_bpm') || '120';
    
    content.innerHTML = `
        <div class="max-w-4xl mx-auto">
            <h2 class="text-4xl font-bold mb-8">Delay / Reverb Calculator</h2>
            <div class="card p-8 rounded-lg">
                <div class="mb-6">
                    <label class="block text-sm mb-2 font-medium">BPM (Tempo)</label>
                    <input 
                        type="number" 
                        id="calc-bpm" 
                        class="w-full bg-[#0e0e11] border border-[#2a2a35] rounded px-4 py-2 focus:border-[#00b7ff] focus:outline-none transition-colors" 
                        placeholder="120" 
                        value="${savedBPM}"
                    >
                    <p class="text-xs text-gray-500 mt-1">Synced from BPM Tapper</p>
                </div>
                
                <div class="text-center text-gray-500 py-12 border-2 border-dashed border-[#2a2a35] rounded-lg">
                    <p class="mb-2">🎛️ Full calculator interface coming in Day 5-7</p>
                    <p class="text-sm">Will include: Notes/Dotted/Triplet calculations, Reverb presets, and one-click copy</p>
                </div>
            </div>
        </div>
    `;
}