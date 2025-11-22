// Universal Sidebar for NHM Fund Monitor
// Handles sidebar navigation, mobile menu, and responsive behavior

class SidebarManager {
    constructor() {
        this.sidebar = document.querySelector('.dashboard-sidebar');
        this.mobileMenuBtn = null;
        this.overlay = null;
        this.init();
    }

    init() {
        if (!this.sidebar) return; // No sidebar on this page
        
        // Create mobile menu button if it doesn't exist
        this.createMobileMenuButton();
        
        // Create overlay for mobile
        this.createOverlay();
        
        // Setup event listeners
        this.setupEventListeners();
        
        // Handle window resize
        this.handleResize();
        
        // Setup navigation links (handled by router, but ensure sidebar closes)
        this.setupNavigation();
    }

    createMobileMenuButton() {
        const header = document.querySelector('.dashboard-header .header-content');
        if (header && !document.querySelector('.mobile-menu-btn')) {
            const menuBtn = document.createElement('button');
            menuBtn.className = 'mobile-menu-btn';
            menuBtn.innerHTML = '☰';
            menuBtn.setAttribute('aria-label', 'Toggle menu');
            menuBtn.setAttribute('type', 'button');
            header.insertBefore(menuBtn, header.firstChild);
            this.mobileMenuBtn = menuBtn;
        } else {
            this.mobileMenuBtn = document.querySelector('.mobile-menu-btn');
        }
    }

    createOverlay() {
        if (!document.querySelector('.sidebar-overlay')) {
            const overlay = document.createElement('div');
            overlay.className = 'sidebar-overlay';
            document.body.appendChild(overlay);
            this.overlay = overlay;
        } else {
            this.overlay = document.querySelector('.sidebar-overlay');
        }
    }

    setupEventListeners() {
        // Mobile menu toggle
        if (this.mobileMenuBtn) {
            this.mobileMenuBtn.addEventListener('click', (e) => {
                e.stopPropagation();
                this.toggleSidebar();
            });
        }

        // Close sidebar when clicking overlay
        if (this.overlay) {
            this.overlay.addEventListener('click', () => this.closeSidebar());
        }

        // Close sidebar on window resize (if mobile)
        window.addEventListener('resize', () => this.handleResize());

        // Close sidebar when clicking outside on mobile
        document.addEventListener('click', (e) => {
            if (window.innerWidth <= 768 && this.sidebar) {
                if (this.sidebar.classList.contains('mobile-open')) {
                    if (!this.sidebar.contains(e.target) && 
                        !this.mobileMenuBtn?.contains(e.target)) {
                        this.closeSidebar();
                    }
                }
            }
        });

        // Close sidebar on Escape key
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape' && this.sidebar?.classList.contains('mobile-open')) {
                this.closeSidebar();
            }
        });
    }

    setupNavigation() {
        // Handle logout separately
        const logoutLink = document.querySelector('.nav-item.logout');
        if (logoutLink) {
            logoutLink.addEventListener('click', (e) => {
                // Let router handle navigation, but add confirmation
                if (!confirm('Are you sure you want to logout?')) {
                    e.preventDefault();
                    e.stopPropagation();
                } else {
                    // Close sidebar on logout
                    this.closeSidebar();
                }
            });
        }

        // All other navigation is handled by navigation_and_tabs.js
        // But ensure sidebar closes on mobile after navigation
        const navLinks = document.querySelectorAll('.nav-item:not(.logout)');
        navLinks.forEach(link => {
            link.addEventListener('click', () => {
                // Close mobile sidebar on navigation
                if (window.innerWidth <= 768) {
                    setTimeout(() => this.closeSidebar(), 100);
                }
            });
        });
    }

    toggleSidebar() {
        if (this.sidebar) {
            const isOpen = this.sidebar.classList.contains('mobile-open');
            if (isOpen) {
                this.closeSidebar();
            } else {
                this.openSidebar();
            }
        }
    }

    openSidebar() {
        if (this.sidebar) {
            this.sidebar.classList.add('mobile-open');
            if (this.overlay) {
                this.overlay.classList.add('active');
            }
            document.body.style.overflow = 'hidden';
            
            // Update hamburger icon
            if (this.mobileMenuBtn) {
                this.mobileMenuBtn.innerHTML = '✕';
            }
        }
    }

    closeSidebar() {
        if (this.sidebar) {
            this.sidebar.classList.remove('mobile-open');
            if (this.overlay) {
                this.overlay.classList.remove('active');
            }
            document.body.style.overflow = '';
            
            // Update hamburger icon
            if (this.mobileMenuBtn) {
                this.mobileMenuBtn.innerHTML = '☰';
            }
        }
    }

    handleResize() {
        // Auto-close sidebar on desktop
        if (window.innerWidth > 768) {
            this.closeSidebar();
        }
    }
}

// Initialize sidebar manager on page load
document.addEventListener('DOMContentLoaded', () => {
    if (document.querySelector('.dashboard-sidebar')) {
        window.sidebarManager = new SidebarManager();
    }
});

// Export for use in other scripts
if (typeof module !== 'undefined' && module.exports) {
    module.exports = SidebarManager;
}
