// District Dashboard JavaScript for basic interactivity

document.addEventListener('DOMContentLoaded', function() {
    // Handle sidebar navigation
    const navItems = document.querySelectorAll('.nav-item:not(.logout)');
    
    navItems.forEach(item => {
        item.addEventListener('click', function(e) {
            e.preventDefault();
            
            // Remove active class from all items
            navItems.forEach(nav => nav.classList.remove('active'));
            
            // Add active class to clicked item
            this.classList.add('active');
            
            // Get the page name
            const page = this.getAttribute('data-page');
            console.log(`Navigating to: ${page}`);
            
            // Here you can add logic to load different content
            // For now, we'll just log the navigation
        });
    });

    // Handle view button clicks in project table
    const viewButtons = document.querySelectorAll('.view-btn');
    viewButtons.forEach(button => {
        button.addEventListener('click', function() {
            const row = this.closest('tr');
            const projectName = row.querySelector('td:first-child').textContent;
            console.log(`Viewing project: ${projectName}`);
            // Add navigation logic here
        });
    });

    // Add hover effects to stat cards
    const statCards = document.querySelectorAll('.stat-card');
    statCards.forEach(card => {
        card.addEventListener('mouseenter', function() {
            this.style.transform = 'translateY(-4px)';
        });
        
        card.addEventListener('mouseleave', function() {
            this.style.transform = 'translateY(0)';
        });
    });

    // Add row hover effects to table
    const tableRows = document.querySelectorAll('.projects-table tbody tr');
    tableRows.forEach(row => {
        row.addEventListener('mouseenter', function() {
            this.style.backgroundColor = '#F9FAFB';
        });
        
        row.addEventListener('mouseleave', function() {
            this.style.backgroundColor = 'transparent';
        });
    });
});

