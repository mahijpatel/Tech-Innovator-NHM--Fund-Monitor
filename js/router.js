// Universal Router for NHM Fund Monitor
// Handles navigation, active states, path resolution, and page transitions

class Router {
    constructor() {
        this.currentPath = this.getCurrentPath();
        this.basePath = this.getBasePath();
        this.init();
    }

    init() {
        // Set active sidebar item
        this.setActiveSidebarItem();
        
        // Set page title
        this.setPageTitle();
        
        // Scroll to top
        window.scrollTo(0, 0);
        
        // Add fade-in animation
        this.addPageTransition();
    }

    getBasePath() {
        // Get base path (directory of current file)
        const path = window.location.pathname;
        const parts = path.split('/').filter(p => p);
        if (parts.length > 1) {
            return '/' + parts.slice(0, -1).join('/') + '/';
        }
        return '/';
    }

    getCurrentPath() {
        // Get full pathname
        return window.location.pathname;
    }

    resolvePath(href) {
        // Resolve relative paths to absolute paths
        try {
            if (href.startsWith('http://') || href.startsWith('https://') || href.startsWith('//')) {
                return href; // Already absolute
            }
            
            if (href.startsWith('/')) {
                return href; // Root-relative, already absolute
            }
            
            // Resolve relative path
            const base = window.location.href;
            const resolved = new URL(href, base);
            return resolved.pathname;
        } catch (e) {
            console.error('Error resolving path:', href, e);
            return href;
        }
    }

    getPageIdentifier(path) {
        // Extract page identifier from path
        const filename = path.split('/').pop() || 'index.html';
        
        const pageMap = {
            'index.html': 'home',
            'login.html': 'login',
            'admin-login.html': 'login',
            'district-login.html': 'login',
            'auditor-login.html': 'login',
            'admin-dashboard.html': 'dashboard',
            'district-dashboard.html': 'dashboard',
            'auditor-dashboard.html': 'dashboard',
            'project-detail.html': 'projects',
            'alerts.html': 'alerts',
            'reports.html': 'reports',
            'users.html': 'users',
            'settings.html': 'settings',
            'auditor-upload.html': 'projects'
        };

        return pageMap[filename] || 'dashboard';
    }

    setActiveSidebarItem() {
        // Remove all active classes from nav items
        const navItems = document.querySelectorAll('.nav-item:not(.logout)');
        navItems.forEach(item => item.classList.remove('active'));

        // Get current pathname (normalized)
        const currentPathname = window.location.pathname;
        const normalizedPath = currentPathname.replace(/\/$/, '') || '/';
        
        // Try to find matching nav item by href
        let activeItem = null;
        navItems.forEach(item => {
            const href = item.getAttribute('href');
            if (!href || href === '#') return;
            
            try {
                // Resolve the href to absolute path
                const resolved = new URL(href, window.location.href);
                const itemPath = resolved.pathname.replace(/\/$/, '') || '/';
                
                // Check if paths match
                if (itemPath === normalizedPath) {
                    activeItem = item;
                }
            } catch (e) {
                // Fallback: use data-page attribute
                const currentPage = this.getPageIdentifier(currentPathname);
                if (item.getAttribute('data-page') === currentPage) {
                    activeItem = item;
                }
            }
        });
        
        // If no match found by href, fall back to data-page
        if (!activeItem) {
            const currentPage = this.getPageIdentifier(currentPathname);
            activeItem = document.querySelector(`.nav-item[data-page="${currentPage}"]`);
        }
        
        if (activeItem) {
            activeItem.classList.add('active');
        }
    }

    setPageTitle() {
        const titles = {
            'admin-dashboard.html': 'Admin Dashboard',
            'district-dashboard.html': 'District Dashboard',
            'auditor-dashboard.html': 'Auditor Panel',
            'project-detail.html': 'Project Details',
            'alerts.html': 'Alerts & Anomalies',
            'reports.html': 'Reports & Analytics',
            'users.html': 'User Management',
            'settings.html': 'Settings',
            'index.html': 'NHM Fund Monitor',
            'login.html': 'Login'
        };

        const filename = this.currentPath.split('/').pop() || 'index.html';
        const title = titles[filename] || 'NHM Fund Monitor';

        const titleElement = document.querySelector('.page-title');
        if (titleElement) {
            titleElement.textContent = title;
        }

        // Also update document title
        document.title = `${title} - NHM Fund Monitor`;
    }

    addPageTransition() {
        const mainContent = document.querySelector('.dashboard-content, .alerts-content, .project-detail-content, .auditor-main, .login-section, .hero-section');
        if (mainContent) {
            mainContent.style.opacity = '0';
            mainContent.style.transform = 'translateY(20px)';
            
            setTimeout(() => {
                mainContent.style.transition = 'opacity 0.4s ease, transform 0.4s ease';
                mainContent.style.opacity = '1';
                mainContent.style.transform = 'translateY(0)';
            }, 50);
        }
    }

    navigate(url) {
        const resolvedPath = this.resolvePath(url);
        
        // Close mobile sidebar
        if (window.sidebarManager) {
            window.sidebarManager.closeSidebar();
        }

        // Add fade-out animation
        const mainContent = document.querySelector('.dashboard-content, .alerts-content, .project-detail-content, .auditor-main');
        if (mainContent) {
            mainContent.style.transition = 'opacity 0.2s ease';
            mainContent.style.opacity = '0';
        }

        // Navigate
        setTimeout(() => {
            window.location.href = resolvedPath;
        }, 200);
    }
}

// Initialize router on page load
document.addEventListener('DOMContentLoaded', () => {
    window.router = new Router();
});

// Export for use in other scripts
if (typeof module !== 'undefined' && module.exports) {
    module.exports = Router;
}
