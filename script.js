// Theme Management
function escapeHTML(value) {
    return String(value ?? '').replace(/[&<>"']/g, character => ({
        '&': '&amp;',
        '<': '&lt;',
        '>': '&gt;',
        '"': '&quot;',
        "'": '&#39;'
    })[character]);
}

function safeExternalUrl(value) {
    try {
        const url = new URL(value, window.location.href);
        if (url.protocol === 'https:' || url.protocol === 'mailto:' || url.protocol === 'tel:') {
            return url.href;
        }
    } catch (error) {
        // Invalid links are intentionally rejected.
    }
    return '#';
}

function initTheme() {
    const savedTheme = localStorage.getItem('theme') || 'light';
    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    const theme = savedTheme === 'auto' ? (prefersDark ? 'dark' : 'light') : savedTheme;
    
    if (theme === 'dark') {
        document.body.classList.add('dark-mode');
        updateThemeIcon();
    }
}

function toggleTheme() {
    document.body.classList.toggle('dark-mode');
    const isDarkMode = document.body.classList.contains('dark-mode');
    localStorage.setItem('theme', isDarkMode ? 'dark' : 'light');
    updateThemeIcon();
}

function updateThemeIcon() {
    const icon = document.querySelector('.theme-icon');
    if (document.body.classList.contains('dark-mode')) {
        icon.textContent = '☀️';
    } else {
        icon.textContent = '🌙';
    }
}

// Mobile Navigation
function initMobileNav() {
    const hamburger = document.getElementById('hamburger');
    const navMenu = document.getElementById('navMenu');
    
    if (!hamburger) return;
    
    hamburger.addEventListener('click', () => {
        navMenu.classList.toggle('active');
    });
    
    // Close menu when a link is clicked
    navMenu.querySelectorAll('a').forEach(link => {
        link.addEventListener('click', () => {
            navMenu.classList.remove('active');
        });
    });
}

// Sticky navbar background
function initNavbar() {
    const navbar = document.getElementById('navbar');
    
    window.addEventListener('scroll', () => {
        if (window.scrollY > 50) {
            navbar.style.boxShadow = '0 2px 8px rgba(0, 0, 0, 0.1)';
        } else {
            navbar.style.boxShadow = 'none';
        }
    });
}

// Projects Rendering
function renderProjects() {
    const projectGrid = document.getElementById('projectGrid');
    const filterBtns = document.querySelectorAll('.filter-btn');
    let currentFilter = 'all';
    
    function displayProjects(filter = 'all') {
        projectGrid.innerHTML = '';
        
        portfolioData.projects.forEach(project => {
            if (filter !== 'all' && project.category !== filter) return;
            
            const projectCard = document.createElement('div');
            projectCard.className = 'project-card';
            projectCard.innerHTML = `
                <div class="project-category">${escapeHTML(project.category)}</div>
                <h3>${escapeHTML(project.name)}</h3>
                <p>${escapeHTML(project.description)}</p>
                <div class="project-tech">
                    ${project.technologies.map(tech => `<span class="tech-tag">${escapeHTML(tech)}</span>`).join('')}
                </div>
                <a href="${safeExternalUrl(project.link)}" target="_blank" rel="noopener noreferrer" class="btn btn-small btn-primary project-link">View on GitHub</a>
            `;
            projectGrid.appendChild(projectCard);
        });
    }
    
    displayProjects();
    
    filterBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            filterBtns.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
            currentFilter = btn.dataset.filter;
            displayProjects(currentFilter);
        });
    });
}

// Experience Rendering
function renderExperience() {
    const experienceList = document.getElementById('experienceList');
    
    if (portfolioData.experience.length === 0) {
        experienceList.innerHTML = '<p class="placeholder-text">No experience added yet. Edit data.js to add your experience.</p>';
        return;
    }
    
    experienceList.innerHTML = portfolioData.experience.map(exp => `
        <div class="experience-item">
            <h3>${escapeHTML(exp.role)}</h3>
            <div class="experience-meta">
                <span>${escapeHTML(exp.organization)}</span>
                <span>•</span>
                <span>${escapeHTML(exp.date)}</span>
            </div>
            <p>${escapeHTML(exp.description)}</p>
            ${exp.skills ? `<div class="experience-skills">
                ${exp.skills.map(skill => `<span class="experience-skill">${escapeHTML(skill)}</span>`).join('')}
            </div>` : ''}
        </div>
    `).join('');
}

// Certifications Rendering
function renderCertifications() {
    const certificationsGrid = document.getElementById('certificationsGrid');
    
    if (portfolioData.certifications.length === 0 || 
        (portfolioData.certifications.length === 1 && 
         portfolioData.certifications[0].name.includes('[CERTIFICATION NAME]'))) {
        certificationsGrid.innerHTML = '<p class="placeholder-text certification-empty">No certifications added yet. Edit data.js to add your certifications.</p>';
        return;
    }
    
    certificationsGrid.innerHTML = portfolioData.certifications.map(cert => `
        <div class="certification-card">
            <h3>${escapeHTML(cert.name)}</h3>
            <p class="certification-issuer">${escapeHTML(cert.issuer)}</p>
            <p class="certification-date">${escapeHTML(cert.date)}</p>
            <a href="${safeExternalUrl(cert.credentialLink)}" target="_blank" rel="noopener noreferrer" class="btn btn-small btn-primary">View Credential</a>
        </div>
    `).join('');
}

// Labs Statistics Update
function updateLabsStats() {
    document.getElementById('thm-rooms').textContent = portfolioData.labs.tryhackme.roomsCompleted;
    document.getElementById('thm-rank').textContent = portfolioData.labs.tryhackme.rank;
    document.getElementById('htb-machines').textContent = portfolioData.labs.hackthebox.machinesCompleted;
    document.getElementById('htb-rank').textContent = portfolioData.labs.hackthebox.rank;
}

// Resume PDF preview
function renderResumePdf() {
    const preview = document.getElementById('portfolioPdfPreview');
    const canvas = document.getElementById('portfolioPdfCanvas');
    const status = document.getElementById('portfolioPdfStatus');

    if (!preview || !canvas || !window.pdfjsLib) return;

    pdfjsLib.GlobalWorkerOptions.workerSrc = 'https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf.worker.min.js';
    pdfjsLib.getDocument('Dhruv_Kapoor_Resume_Cybersec.pdf').promise
        .then(pdf => pdf.getPage(1))
        .then(page => {
            const context = canvas.getContext('2d');
            const baseViewport = page.getViewport({ scale: 1 });
            const availableWidth = Math.max(280, preview.clientWidth - 32);
            const scale = Math.min(1.6, availableWidth / baseViewport.width);
            const viewport = page.getViewport({ scale });

            canvas.width = viewport.width;
            canvas.height = viewport.height;
            return page.render({ canvasContext: context, viewport }).promise;
        })
        .then(() => status.remove())
        .catch(() => {
            status.textContent = 'Preview unavailable. Use the resume package button below.';
        });
}

// Smooth scroll enhancement
function initSmoothScroll() {
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            const href = this.getAttribute('href');
            if (href !== '#' && document.querySelector(href)) {
                e.preventDefault();
                const target = document.querySelector(href);
                const offset = document.querySelector('.navbar').offsetHeight;
                const targetPosition = target.offsetTop - offset;
                
                window.scrollTo({
                    top: targetPosition,
                    behavior: 'smooth'
                });
            }
        });
    });
}

// Intersection Observer for fade-in animations
function initIntersectionObserver() {
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateY(0)';
            }
        });
    }, observerOptions);
    
    document.querySelectorAll('.project-card, .experience-item, .certification-card').forEach(el => {
        el.style.opacity = '0';
        el.style.transform = 'translateY(10px)';
        el.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
        observer.observe(el);
    });
}

// Initialize all components
function init() {
    initTheme();
    initMobileNav();
    initNavbar();
    initSmoothScroll();
    renderProjects();
    renderExperience();
    renderCertifications();
    updateLabsStats();
    renderResumePdf();
    initIntersectionObserver();
}

// Set up theme toggle button
document.addEventListener('DOMContentLoaded', () => {
    const themeToggle = document.getElementById('themeToggle');
    if (themeToggle) {
        themeToggle.addEventListener('click', toggleTheme);
    }
    init();
});

// Detect system theme preference changes
window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', (e) => {
    const savedTheme = localStorage.getItem('theme');
    if (savedTheme === 'auto' || !savedTheme) {
        if (e.matches) {
            document.body.classList.add('dark-mode');
        } else {
            document.body.classList.remove('dark-mode');
        }
        updateThemeIcon();
    }
});
