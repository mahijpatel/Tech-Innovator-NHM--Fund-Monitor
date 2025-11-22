// Alerts Page JavaScript for filtering and interactions

document.addEventListener('DOMContentLoaded', function() {
    // Filter elements
    const districtFilter = document.getElementById('districtFilter');
    const alertTypeFilter = document.getElementById('alertTypeFilter');
    const statusFilter = document.getElementById('statusFilter');
    const searchInput = document.getElementById('searchInput');
    
    // Lists to filter
    const aiAnomalyList = document.getElementById('aiAnomalyList');
    const anomalyCards = document.querySelectorAll('.anomaly-card');
    const alertRows = document.querySelectorAll('.alerts-table tbody tr');
    
    // Modal elements
    const projectModal = document.getElementById('projectModal');
    const modalClose = document.getElementById('modalClose');
    const viewProjectButtons = document.querySelectorAll('.view-project-btn');
    const resolveButtons = document.querySelectorAll('.resolve-btn');
    
    // Filter function
    function applyFilters() {
        const districtValue = districtFilter.value;
        const alertTypeValue = alertTypeFilter.value;
        const statusValue = statusFilter.value;
        const searchValue = searchInput.value.toLowerCase().trim();
        
        // Filter AI Anomaly Cards
        anomalyCards.forEach(card => {
            let show = true;
            const projectName = card.querySelector('.anomaly-project').textContent.toLowerCase();
            const severity = card.getAttribute('data-severity');
            
            // Search filter
            if (searchValue && !projectName.includes(searchValue)) {
                show = false;
            }
            
            // Status filter
            if (statusValue !== 'all') {
                if (statusValue === 'critical' && severity !== 'critical') {
                    show = false;
                } else if (statusValue === 'warning' && severity !== 'warning') {
                    show = false;
                }
            }
            
            // Alert type filter
            if (alertTypeValue !== 'all' && alertTypeValue !== 'ai-anomaly') {
                show = false;
            }
            
            // Show/hide card
            card.style.display = show ? 'block' : 'none';
        });
        
        // Filter Manual Alerts Table Rows
        alertRows.forEach(row => {
            let show = true;
            const alertDesc = row.cells[0].textContent.toLowerCase();
            const projectName = row.cells[1].textContent.toLowerCase();
            const statusBadge = row.querySelector('.status-badge-alert');
            const status = statusBadge ? statusBadge.textContent.toLowerCase() : '';
            
            // Search filter
            if (searchValue && !projectName.includes(searchValue) && !alertDesc.includes(searchValue)) {
                show = false;
            }
            
            // Status filter
            if (statusValue !== 'all') {
                if (statusValue === 'resolved' && !status.includes('resolved')) {
                    show = false;
                } else if (statusValue !== 'resolved' && status.includes('resolved')) {
                    show = false;
                }
            }
            
            // Alert type filter (for manual alerts, show if not filtering for ai-anomaly)
            if (alertTypeValue === 'ai-anomaly') {
                show = false;
            }
            
            // Show/hide row
            row.style.display = show ? '' : 'none';
        });
    }
    
    // Add event listeners to filters
    if (districtFilter) {
        districtFilter.addEventListener('change', applyFilters);
    }
    
    if (alertTypeFilter) {
        alertTypeFilter.addEventListener('change', applyFilters);
    }
    
    if (statusFilter) {
        statusFilter.addEventListener('change', applyFilters);
    }
    
    if (searchInput) {
        searchInput.addEventListener('input', applyFilters);
    }
    
    // View Project button handlers
    viewProjectButtons.forEach(button => {
        button.addEventListener('click', function() {
            const projectId = this.getAttribute('data-project');
            const projectCard = this.closest('.anomaly-card');
            const projectName = projectCard ? projectCard.querySelector('.anomaly-project').textContent : 'Project';
            
            // Update modal content
            const modalProjectName = document.getElementById('modalProjectName');
            if (modalProjectName) {
                modalProjectName.textContent = projectName;
            }
            
            // Update modal link to project detail
            const modalLink = document.querySelector('.modal-link-btn');
            if (modalLink) {
                modalLink.href = 'project-detail.html?project=' + projectId;
            }
            
            // Show modal
            if (projectModal) {
                projectModal.style.display = 'flex';
                document.body.style.overflow = 'hidden';
            }
        });
    });
    
    // Close modal handlers
    if (modalClose) {
        modalClose.addEventListener('click', closeModal);
    }
    
    if (projectModal) {
        projectModal.addEventListener('click', function(e) {
            if (e.target === projectModal) {
                closeModal();
            }
        });
    }
    
    // Close modal on Escape key
    document.addEventListener('keydown', function(e) {
        if (e.key === 'Escape' && projectModal && projectModal.style.display === 'flex') {
            closeModal();
        }
    });
    
    function closeModal() {
        if (projectModal) {
            projectModal.style.display = 'none';
            document.body.style.overflow = 'auto';
        }
    }
    
    // Resolve button handlers
    resolveButtons.forEach(button => {
        button.addEventListener('click', function() {
            if (this.disabled) return;
            
            const row = this.closest('tr');
            const statusBadge = row.querySelector('.status-badge-alert');
            
            if (statusBadge) {
                statusBadge.textContent = 'Resolved';
                statusBadge.classList.remove('alert-open');
                statusBadge.classList.add('alert-resolved');
            }
            
            this.textContent = 'Resolved';
            this.disabled = true;
            this.style.opacity = '0.6';
            this.style.cursor = 'not-allowed';
            
            // Show success message (optional)
            console.log('Alert marked as resolved');
        });
    });
    
    // Animate cards on load
    anomalyCards.forEach((card, index) => {
        card.style.opacity = '0';
        card.style.transform = 'translateY(20px)';
        
        setTimeout(() => {
            card.style.transition = 'opacity 0.5s ease, transform 0.5s ease';
            card.style.opacity = '1';
            card.style.transform = 'translateY(0)';
        }, index * 100);
    });
});

