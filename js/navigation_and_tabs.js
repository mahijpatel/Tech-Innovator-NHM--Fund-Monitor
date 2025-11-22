// Universal Navigation and Tabs Handler for NHM Fund Monitor
// Handles all internal link navigation, tab switching, and mobile sidebar closing

class NavigationAndTabs {
    constructor() {
        this.init();
    }

    init() {
        // Setup universal navigation handler
        this.setupUniversalNavigation();
        
        // Setup tabs system
        this.setupTabs();
    }

    setupUniversalNavigation() {
        // Handle all anchor clicks globally
        document.addEventListener('click', (e) => {
            const anchor = e.target.closest('a');
            if (!anchor) return;

            const href = anchor.getAttribute('href');
            
            // Skip special links
            if (!href || 
                href === '#' || 
                href.startsWith('javascript:') || 
                href.startsWith('mailto:') || 
                href.startsWith('tel:')) {
                return;
            }

            // Allow ctrl/cmd + click to open in new tab
            if (e.ctrlKey || e.metaKey) {
                return; // Browser default behavior
            }

            // Check if it's an external link
            if (href.startsWith('http://') || href.startsWith('https://') || href.startsWith('//')) {
                return; // Let browser handle external links
            }

            // Resolve path using URL API
            let resolvedPath;
            try {
                const resolved = new URL(href, window.location.href);
                resolvedPath = resolved.pathname + resolved.search + resolved.hash;
            } catch (error) {
                console.error('Error resolving path:', href, error);
                return;
            }

            // Prevent default and navigate
            e.preventDefault();
            
            // Close mobile sidebar if open
            if (window.sidebarManager) {
                window.sidebarManager.closeSidebar();
            }

            // Add fade-out animation
            const mainContent = document.querySelector('.dashboard-content, .alerts-content, .project-detail-content, .auditor-main, .login-section, .hero-section');
            if (mainContent) {
                mainContent.style.transition = 'opacity 0.2s ease';
                mainContent.style.opacity = '0';
            }

            // Navigate after short delay
            setTimeout(() => {
                window.location.href = resolvedPath;
            }, 200);
        });
    }

    setupTabs() {
        // Find all tab buttons
        const tabButtons = document.querySelectorAll('.tab-btn');
        
        if (tabButtons.length === 0) return;

        // Add click handlers to all tab buttons
        tabButtons.forEach(button => {
            button.addEventListener('click', (e) => {
                e.preventDefault();
                e.stopPropagation();
                
                const targetId = button.getAttribute('data-tab-target');
                if (!targetId) {
                    console.warn('Tab button missing data-tab-target attribute:', button);
                    return;
                }

                // Find the tab container (parent container of tabs)
                const tabContainer = button.closest('.dashboard-panel-tabs, .admin-panel-tabs, .tabs-container');
                
                // Remove active class from all tab buttons in the same container
                if (tabContainer) {
                    tabContainer.querySelectorAll('.tab-btn').forEach(btn => {
                        btn.classList.remove('active');
                    });
                } else {
                    // Fallback: remove from all tab buttons on page
                    document.querySelectorAll('.tab-btn').forEach(btn => {
                        btn.classList.remove('active');
                    });
                }

                // Add active class to clicked button
                button.classList.add('active');

                // Find all panels in the same container
                const panelsContainer = tabContainer || document;
                const allPanels = panelsContainer.querySelectorAll('.tab-panel');
                
                // Hide all panels
                allPanels.forEach(panel => {
                    panel.hidden = true;
                });

                // Show target panel
                const targetPanel = document.getElementById(targetId);
                if (targetPanel) {
                    targetPanel.hidden = false;
                    // Trigger a small animation
                    targetPanel.style.opacity = '0';
                    setTimeout(() => {
                        targetPanel.style.opacity = '1';
                    }, 10);
                } else {
                    console.warn('Tab panel not found:', targetId);
                }
            });
        });

        // Initialize: Activate first tab by default if no tab is active
        const tabContainer = document.querySelector('.dashboard-panel-tabs, .admin-panel-tabs, .tabs-container');
        if (tabContainer) {
            const activeTab = tabContainer.querySelector('.tab-btn.active');
            if (!activeTab && tabButtons.length > 0) {
                const firstButton = tabButtons[0];
                const firstTarget = firstButton.getAttribute('data-tab-target');
                if (firstTarget) {
                    firstButton.classList.add('active');
                    const firstPanel = document.getElementById(firstTarget);
                    if (firstPanel) {
                        firstPanel.hidden = false;
                    }
                }
            } else if (activeTab) {
                // Ensure the active tab's panel is visible
                const activeTarget = activeTab.getAttribute('data-tab-target');
                if (activeTarget) {
                    const activePanel = document.getElementById(activeTarget);
                    if (activePanel) {
                        activePanel.hidden = false;
                    }
                }
            }

            // Hide all panels except the active one
            const activeButton = tabContainer.querySelector('.tab-btn.active');
            if (activeButton) {
                const activeTarget = activeButton.getAttribute('data-tab-target');
                const allPanels = tabContainer.querySelectorAll('.tab-panel');
                allPanels.forEach(panel => {
                    if (panel.id === activeTarget) {
                        panel.hidden = false;
                    } else {
                        panel.hidden = true;
                    }
                });
            } else {
                // Hide all panels if no active tab
                const allPanels = tabContainer.querySelectorAll('.tab-panel');
                allPanels.forEach(panel => {
                    panel.hidden = true;
                });
            }
        }
    }
}

// Initialize on page load
document.addEventListener('DOMContentLoaded', () => {
    window.navigationAndTabs = new NavigationAndTabs();
});

// Export for use in other scripts
if (typeof module !== 'undefined' && module.exports) {
    module.exports = NavigationAndTabs;
}
