// Field Auditor JavaScript for mobile interactions

document.addEventListener('DOMContentLoaded', function() {
    // Set current timestamp
    const timestampEl = document.getElementById('timestamp');
    if (timestampEl) {
        const now = new Date();
        const timeString = now.toLocaleString('en-IN', {
            day: '2-digit',
            month: 'short',
            year: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        });
        timestampEl.textContent = timeString;
    }

    // Photo upload handling
    const photoBtn = document.getElementById('photoBtn');
    const photoInput = document.getElementById('photoInput');
    const photoPreview = document.getElementById('photoPreview');

    if (photoBtn && photoInput) {
        photoBtn.addEventListener('click', function() {
            photoInput.click();
        });

        photoInput.addEventListener('change', function(e) {
            const file = e.target.files[0];
            if (file) {
                const reader = new FileReader();
                reader.onload = function(event) {
                    photoPreview.innerHTML = `
                        <div class="preview-item">
                            <img src="${event.target.result}" alt="Photo preview" class="preview-image">
                            <button type="button" class="remove-preview" onclick="removePhoto()">×</button>
                        </div>
                    `;
                };
                reader.readAsDataURL(file);
            }
        });
    }

    // Video upload handling
    const videoBtn = document.getElementById('videoBtn');
    const videoInput = document.getElementById('videoInput');
    const videoPreview = document.getElementById('videoPreview');

    if (videoBtn && videoInput) {
        videoBtn.addEventListener('click', function() {
            videoInput.click();
        });

        videoInput.addEventListener('change', function(e) {
            const file = e.target.files[0];
            if (file) {
                const reader = new FileReader();
                reader.onload = function(event) {
                    videoPreview.innerHTML = `
                        <div class="preview-item">
                            <video src="${event.target.result}" controls class="preview-video"></video>
                            <button type="button" class="remove-preview" onclick="removeVideo()">×</button>
                        </div>
                    `;
                };
                reader.readAsDataURL(file);
            }
        });
    }

    // Progress slider
    const progressSlider = document.getElementById('progressSlider');
    const progressValue = document.getElementById('progressValue');

    if (progressSlider && progressValue) {
        progressSlider.addEventListener('input', function() {
            progressValue.textContent = this.value + '%';
        });
    }

    // Get GPS location (if available)
    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(
            function(position) {
                console.log('GPS Coordinates:', position.coords.latitude, position.coords.longitude);
                // You can display this or send it with the form
            },
            function(error) {
                console.log('GPS not available:', error.message);
            }
        );
    }

    // Submit button handling
    const submitBtn = document.getElementById('submitBtn');
    if (submitBtn) {
        submitBtn.addEventListener('click', function() {
            // Get form data
            const progress = progressSlider ? progressSlider.value : 0;
            const notes = document.getElementById('notesTextarea') ? document.getElementById('notesTextarea').value : '';
            const hasPhoto = photoInput && photoInput.files.length > 0;
            const hasVideo = videoInput && videoInput.files.length > 0;

            // Basic validation
            if (!hasPhoto && !hasVideo) {
                alert('Please upload at least one photo or video as evidence.');
                return;
            }

            // Show success message (in real app, this would submit to server)
            alert('Update submitted successfully!');
            
            // Redirect back to dashboard
            setTimeout(function() {
                window.location.href = 'auditor-dashboard.html';
            }, 1000);
        });
    }

    // Parse URL parameters for project info
    const urlParams = new URLSearchParams(window.location.search);
    const projectId = urlParams.get('project');
    
    if (projectId) {
        // Update project info based on project ID
        const projects = {
            '1': {
                name: 'Primary Health Center - Renovation',
                district: 'District A, Block 3',
                milestone: 'Foundation Work - 60%'
            },
            '2': {
                name: 'Maternal Health Program',
                district: 'District B, Block 1',
                milestone: 'Planning Phase - 30%'
            },
            '3': {
                name: 'Vaccination Drive Campaign',
                district: 'District A, Block 5',
                milestone: 'Implementation - 75%'
            },
            '4': {
                name: 'Medical Equipment Procurement',
                district: 'District C, Block 2',
                milestone: 'Completed - 100%'
            }
        };

        const project = projects[projectId];
        if (project) {
            const nameEl = document.getElementById('projectName');
            const districtEl = document.getElementById('projectDistrict');
            const milestoneEl = document.getElementById('projectMilestone');

            if (nameEl) nameEl.textContent = project.name;
            if (districtEl) districtEl.textContent = project.district;
            if (milestoneEl) milestoneEl.textContent = project.milestone;
        }
    }
});

// Remove photo preview
function removePhoto() {
    const photoInput = document.getElementById('photoInput');
    const photoPreview = document.getElementById('photoPreview');
    if (photoInput) photoInput.value = '';
    if (photoPreview) photoPreview.innerHTML = '';
}

// Remove video preview
function removeVideo() {
    const videoInput = document.getElementById('videoInput');
    const videoPreview = document.getElementById('videoPreview');
    if (videoInput) videoInput.value = '';
    if (videoPreview) videoPreview.innerHTML = '';
}

