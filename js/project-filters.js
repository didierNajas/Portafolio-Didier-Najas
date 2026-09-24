// Project filtering functionality
function initProjectFilters() {
    const filtersContainer = document.getElementById('techFilters');
    const projectsContainer = document.getElementById('projectsContainer');
    
    if (!filtersContainer || !projectsContainer) {
        console.warn('Filter containers not found');
        return;
    }

    // Collect all unique technologies from project cards
    const techTags = projectsContainer.querySelectorAll('.tech-tag');
    const technologies = new Set();
    
    techTags.forEach(tag => {
        const tech = tag.textContent.trim();
        if (tech) technologies.add(tech);
    });

    // Clear existing buttons and add "Show All" button
    filtersContainer.innerHTML = `
        <button class="btn btn-outline-primary active" data-filter="all">Show All</button>
    `;

    // Add buttons for each technology
    technologies.forEach(tech => {
        const button = document.createElement('button');
        button.className = 'btn btn-outline-primary';
        button.textContent = tech;
        button.dataset.filter = tech;
        filtersContainer.appendChild(button);
    });

    // Add click event listeners to filter buttons
    filtersContainer.addEventListener('click', (e) => {
        if (e.target.tagName !== 'BUTTON') return;
        
        // Toggle active state (except for Show All which we'll handle specially)
        if (e.target.dataset.filter !== 'all') {
            e.target.classList.toggle('active');
            
            // If Show All is active, deactivate it when another filter is clicked
            const showAllBtn = filtersContainer.querySelector('[data-filter="all"]');
            if (showAllBtn.classList.contains('active')) {
                showAllBtn.classList.remove('active');
            }
        } else {
            // Handle Show All button
            // Deactivate all other filters
            const allButtons = filtersContainer.querySelectorAll('button');
            allButtons.forEach(btn => {
                if (btn.dataset.filter !== 'all') {
                    btn.classList.remove('active');
                }
            });
            e.target.classList.add('active');
        }

        // Get active filters (excluding Show All if it's active)
        const activeButtons = Array.from(filtersContainer.querySelectorAll('button.active'))
            .filter(btn => btn.dataset.filter !== 'all');
        
        // If Show All is active or no filters selected, show all projects
        const showAllActive = filtersContainer.querySelector('[data-filter="all"]').classList.contains('active');
        if (showAllActive || activeButtons.length === 0) {
            showAllProjects();
            return;
        }

        // Get selected filter values
        const activeFilters = activeButtons.map(btn => btn.dataset.filter);
        
        // Filter projects
        const projectCards = projectsContainer.querySelectorAll('.project-card');
        projectCards.forEach(card => {
            const techTags = card.querySelectorAll('.tech-tag');
            const projectTechs = Array.from(techTags).map(tag => tag.textContent.trim());
            
            // Check if project has all active filters (AND logic)
            const matchesAllFilters = activeFilters.every(filter => 
                projectTechs.includes(filter)
            );
            
            card.style.display = matchesAllFilters ? '' : 'none';
        });
    });
}

function showAllProjects() {
    const projectsContainer = document.getElementById('projectsContainer');
    if (!projectsContainer) return;
    
    const projectCards = projectsContainer.querySelectorAll('.project-card');
    projectCards.forEach(card => {
        card.style.display = '';
    });
    
    // Reset button states
    const filtersContainer = document.getElementById('techFilters');
    if (filtersContainer) {
        const allButtons = filtersContainer.querySelectorAll('button');
        allButtons.forEach(btn => {
            btn.classList.remove('active');
        });
        const showAllBtn = filtersContainer.querySelector('[data-filter="all"]');
        if (showAllBtn) showAllBtn.classList.add('active');
    }
}

// Export for use in other files if needed
window.initProjectFilters = initProjectFilters;
window.showAllProjects = showAllProjects;