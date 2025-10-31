const router = {
    currentRoute: 'home',
    
    navigate(route) {
        if (route === 'home') {
            history.pushState(null, '', window.location.pathname);
        } else {
            history.pushState(null, '', `#${route}`);
        }
        this.loadRoute(route);
        if (window.innerWidth <=768) {
            this.closeMobileMenu();
        }
    },

    closeMobileMenu() {
        const nav = document.getElementById('nav-sidebar');
        const overlay = document.getElementById('nav-overlay');
        const hamburger = document.getElementById('hamburger');

        if (nav) nav.classList.remove('open');
        if (overlay) overlay.classList.remove('show');
        if (hamburger) hamburger.classList.remove('open');
    },
    
    loadRoute(route) {
        const content = document.getElementById('app-content');
        
        document.querySelectorAll('.nav-item').forEach(item => {
            item.classList.remove('active');
        });
        
        const activeNav = document.querySelector(`[data-route="${route}"]`);
        if (activeNav) {
            activeNav.classList.add('active');
        }
        
        content.style.opacity = '0';
        
        setTimeout(() => {
            switch(route) {
                case 'home':
                    this.loadHome();
                    break;
                case 'tapper':
                    loadTapperModule();
                    break;
                case 'calculator':
                    loadCalculatorModule();
                    break;
                case 'scale-finder':
                    loadScaleFinderModule();
                    break;
                default:
                    this.loadHome();
            }
            
            content.style.opacity = '1';
            this.currentRoute = route;
        }, 200);
    },
    
    loadHome() {
        const content = document.getElementById('app-content');
        content.innerHTML = `
            <div class="max-w-6xl mx-auto">
                <h2 class="text-4xl font-bold mb-4">Welcome to MusixBooth</h2>
                <p class="text-gray-400 mb-8">Your all-in-one toolkit for music production and audio engineering.</p>
                
                <div class="home-grid mb-8">
                    <div class="card p-6 rounded-lg cursor-pointer" onclick="router.navigate('tapper')">
                        <h3 class="text-xl font-semibold mb-2 accent">BPM Tapper</h3>
                        <p class="text-sm text-gray-400">Tap in rhythm to calculate tempo instantly.</p>
                    </div>
                    
                    <div class="card p-6 rounded-lg cursor-pointer" onclick="router.navigate('calculator')">
                        <h3 class="text-xl font-semibold mb-2 accent">Delay/Reverb Calculator</h3>
                        <p class="text-sm text-gray-400">Calculate precise timing values for your effects.</p>
                    </div>
                    
                    <div class="card p-6 rounded-lg cursor-pointer" onclick="router.navigate('scale-finder')">
                        <h3 class="text-xl font-semibold mb-2 accent">Scale Finder</h3>
                        <p class="text-sm text-gray-400">Identify scales from selected notes.</p>
                    </div>
                    
                    <div class="card p-6 rounded-lg opacity-50">
                        <h3 class="text-xl font-semibold mb-2">BPM/Key Analyzer</h3>
                        <p class="text-sm text-gray-400">Coming soon - Analyze audio files for BPM and key.</p>
                    </div>
                </div>

                <div class="bg-[#1a1a1f] border border-[#2a2a35] rounded-lg p-6">
                    <h3 class="text-lg font-semibold mb-3">About This Project</h3>
                    <p class="text-sm text-gray-400 leading-relaxed">
                        MusixBooth is designed to streamline your creative workflow by combining essential audio tools in one place. 
                        No more switching between multiple websites - everything you need is right here.
                    </p>
                </div>
            </div>
        `;
    }
};

document.addEventListener('DOMContentLoaded', () => {

    const hamburger = document.getElementById('hamburger');
    const navSidebar = document.getElementById('nav-sidebar');
    const navOverlay = document.getElementById('nav-overlay');

    if (hamburger) {
        hamburger.addEventListener('click', () => {
            hamburger.classList.toggle('open');
            navSidebar.classList.toggle('open');
            navOverlay.classList.toggle('show');
        });
    }

    if (navOverlay) {
        navOverlay.addEventListener('click', () => {
            router.closeMobileMenu();
        });
    }

    document.querySelectorAll('.nav-item').forEach(item => {
        item.addEventListener('click', (e) => {
            e.preventDefault();
            const route = e.currentTarget.dataset.route;
            if (!e.currentTarget.classList.contains('pointer-events-none')) {
                router.navigate(route);
            }
        });
    });
    
    window.addEventListener('popstate', () => {
        const route = location.hash.slice(1) || 'home';
        router.loadRoute(route);
    });
    
    const initialRoute = location.hash.slice(1) || 'home';
    router.loadRoute(initialRoute);
});