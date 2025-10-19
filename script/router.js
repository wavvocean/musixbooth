// Simple Router without page reload
const router = {
    currentRoute: 'home',
    
    navigate(route) {
        // Update URL without reload
        history.pushState(null, '', `#${route}`);
        this.loadRoute(route);
    },
    
    loadRoute(route) {
        const content = document.getElementById('app-content');
        
        // Remove active class from all nav items
        document.querySelectorAll('.nav-item').forEach(item => {
            item.classList.remove('active');
        });
        
        // Add active class to current route
        const activeNav = document.querySelector(`[data-route="${route}"]`);
        if (activeNav) {
            activeNav.classList.add('active');
        }
        
        // Fade out current content
        content.style.opacity = '0';
        
        setTimeout(() => {
            // Load new module content
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
            
            // Fade in new content
            content.style.opacity = '1';
            this.currentRoute = route;
        }, 200);
    },
    
    loadHome() {
        const content = document.getElementById('app-content');
        content.innerHTML = document.getElementById('home-module').outerHTML;
    }
};

// Handle navigation clicks
document.addEventListener('DOMContentLoaded', () => {
    document.querySelectorAll('.nav-item').forEach(item => {
        item.addEventListener('click', (e) => {
            e.preventDefault();
            const route = e.currentTarget.dataset.route;
            if (!e.currentTarget.classList.contains('pointer-events-none')) {
                router.navigate(route);
            }
        });
    });
    
    // Handle browser back/forward
    window.addEventListener('popstate', () => {
        const route = location.hash.slice(1) || 'home';
        router.loadRoute(route);
    });
    
    // Load initial route
    const initialRoute = location.hash.slice(1) || 'home';
    router.loadRoute(initialRoute);
});