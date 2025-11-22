// Universal Header for NHM Fund Monitor
// Handles header functionality and user info display

class HeaderManager {
    constructor() {
        this.header = document.querySelector('.dashboard-header, .auditor-header');
        this.init();
    }

    init() {
        if (!this.header) return; // No header on this page
        
        this.setUserInfo();
        this.setupUserMenu();
    }

    setUserInfo() {
        // Get user info from localStorage or set defaults
        const userInfo = this.getUserInfo();
        
        const userNameEl = document.querySelector('.user-name');
        const userAvatarEl = document.querySelector('.user-avatar, .auditor-avatar-small');
        
        if (userNameEl) {
            userNameEl.textContent = userInfo.name || 'User';
        }
        
        if (userAvatarEl) {
            userAvatarEl.textContent = userInfo.initials || 'U';
        }
    }

    getUserInfo() {
        // Try to get from localStorage (set after login)
        const stored = localStorage.getItem('nhm_user');
        if (stored) {
            try {
                return JSON.parse(stored);
            } catch (e) {
                console.error('Error parsing user info:', e);
            }
        }
        
        // Default based on current page
        const path = window.location.pathname;
        if (path.includes('admin')) {
            return { name: 'Admin User', initials: 'A', role: 'admin' };
        } else if (path.includes('district')) {
            return { name: 'District Officer', initials: 'DO', role: 'district_officer' };
        } else if (path.includes('auditor')) {
            return { name: 'Field Auditor', initials: 'FA', role: 'auditor' };
        }
        
        return { name: 'User', initials: 'U', role: 'user' };
    }

    setupUserMenu() {
        // Add user menu dropdown if needed (future enhancement)
        const userAvatar = document.querySelector('.user-avatar');
        if (userAvatar) {
            userAvatar.addEventListener('click', () => {
                // Future: Show user menu dropdown
            });
        }
    }
}

// Initialize header manager on page load
document.addEventListener('DOMContentLoaded', () => {
    if (document.querySelector('.dashboard-header, .auditor-header')) {
        window.headerManager = new HeaderManager();
    }
});

// Export for use in other scripts
if (typeof module !== 'undefined' && module.exports) {
    module.exports = HeaderManager;
}

// Universal app initialization function
function initApp() {
    // This function is called after all scripts load
    // Additional initialization can go here
    console.log('NHM Fund Monitor initialized');
}

// Make initApp available globally
window.initApp = initApp;
