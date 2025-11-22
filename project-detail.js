// Project Detail Page JavaScript for interactivity

document.addEventListener('DOMContentLoaded', function() {
    // Gallery item click handler
    const galleryItems = document.querySelectorAll('.gallery-item');
    const modalOverlay = document.getElementById('modalOverlay');
    const modalClose = document.getElementById('modalClose');
    const modalCoords = document.getElementById('modalCoords');
    const modalTimestamp = document.getElementById('modalTimestamp');

    galleryItems.forEach(item => {
        item.addEventListener('click', function() {
            const coords = this.querySelector('.gallery-coords').textContent;
            const timestamp = this.querySelector('.gallery-timestamp').textContent;
            
            // Update modal content
            modalCoords.textContent = coords;
            modalTimestamp.textContent = timestamp;
            
            // Show modal
            modalOverlay.style.display = 'flex';
            document.body.style.overflow = 'hidden';
        });
    });

    // Close modal handlers
    if (modalClose) {
        modalClose.addEventListener('click', function() {
            closeModal();
        });
    }

    if (modalOverlay) {
        modalOverlay.addEventListener('click', function(e) {
            if (e.target === modalOverlay) {
                closeModal();
            }
        });
    }

    // Close modal on Escape key
    document.addEventListener('keydown', function(e) {
        if (e.key === 'Escape' && modalOverlay.style.display === 'flex') {
            closeModal();
        }
    });

    function closeModal() {
        modalOverlay.style.display = 'none';
        document.body.style.overflow = 'auto';
    }

    // Smooth scroll for timeline items
    const timelineItems = document.querySelectorAll('.timeline-item');
    timelineItems.forEach(item => {
        item.addEventListener('mouseenter', function() {
            this.style.transform = 'translateX(4px)';
        });
        
        item.addEventListener('mouseleave', function() {
            this.style.transform = 'translateX(0)';
        });
    });

    // Animate progress bar on load
    const progressFill = document.querySelector('.progress-fill');
    if (progressFill) {
        const width = progressFill.style.width;
        progressFill.style.width = '0%';
        setTimeout(() => {
            progressFill.style.transition = 'width 1s ease-in-out';
            progressFill.style.width = width;
        }, 100);
    }
});

