// Theme Management
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
                <div class="project-category">${project.category}</div>
                <h3>${project.name}</h3>
                <p>${project.description}</p>
                <div class="project-tech">
                    ${project.technologies.map(tech => `<span class="tech-tag">${tech}</span>`).join('')}
                </div>
                <a href="${project.link}" target="_blank" rel="noopener noreferrer" class="btn btn-small btn-primary project-link">View on GitHub</a>
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
            <h3>${exp.role}</h3>
            <div class="experience-meta">
                <span>${exp.organization}</span>
                <span>•</span>
                <span>${exp.date}</span>
            </div>
            <p>${exp.description}</p>
            ${exp.skills ? `<div class="experience-skills">
                ${exp.skills.map(skill => `<span class="experience-skill">${skill}</span>`).join('')}
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
        certificationsGrid.innerHTML = '<p class="placeholder-text" style="grid-column: 1/-1; text-align: center;">No certifications added yet. Edit data.js to add your certifications.</p>';
        return;
    }
    
    certificationsGrid.innerHTML = portfolioData.certifications.map(cert => `
        <div class="certification-card">
            <h3>${cert.name}</h3>
            <p class="certification-issuer">${cert.issuer}</p>
            <p class="certification-date">${cert.date}</p>
            <a href="${cert.credentialLink}" target="_blank" rel="noopener noreferrer" class="btn btn-small btn-primary">View Credential</a>
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

// Resume Preview Rendering
function renderResumePreview() {
    const resumePreview = document.getElementById('resumePreview');
    
    const preview = `
        <div class="resume-summary">
            <div class="resume-header">
                <h3>Dhruv Kapoor</h3>
                <p class="resume-title">Cybersecurity Student | Penetration Testing</p>
                <p class="resume-contact">📧 dhruvkapoor.atwork@gmail.com • 📱 +91-93152-78049 • 🔗 GitHub • 🔗 LinkedIn</p>
            </div>
            
            <div class="resume-section">
                <h4>Professional Summary</h4>
                <p>Cybersecurity student focused on penetration testing, ethical hacking, and red teaming. Building practical security tools and developing hands-on offensive security skills through lab work and practical projects.</p>
            </div>
            
            <div class="resume-section">
                <h4>Core Skills</h4>
                <div class="resume-skills">
                    <div class="skill-group">
                        <span class="skill-label">Security:</span>
                        <span>Penetration Testing, Web App Security, Network Security, Vulnerability Assessment</span>
                    </div>
                    <div class="skill-group">
                        <span class="skill-label">Tools:</span>
                        <span>Kali Linux, Nmap, Burp Suite, Wireshark, Metasploit, Git</span>
                    </div>
                    <div class="skill-group">
                        <span class="skill-label">Languages:</span>
                        <span>Python, Bash, C/C++</span>
                    </div>
                </div>
            </div>
            
            <div class="resume-section">
                <h4>Experience</h4>
                ${portfolioData.experience.length > 0 ? 
                    portfolioData.experience.map(exp => `
                        <div class="resume-item">
                            <div class="resume-item-header">
                                <span class="resume-role">${exp.role}</span>
                                <span class="resume-date">${exp.date}</span>
                            </div>
                            <p class="resume-org">${exp.organization}</p>
                            <p>${exp.description}</p>
                        </div>
                    `).join('')
                    : '<p class="resume-placeholder">No experience added yet</p>'
                }
            </div>
            
            <div class="resume-section">
                <h4>Projects & Hands-on Labs</h4>
                <p><strong>TryHackMe:</strong> ${portfolioData.labs.tryhackme.roomsCompleted} rooms completed • Rank: ${portfolioData.labs.tryhackme.rank}</p>
                <p><strong>Hack The Box:</strong> ${portfolioData.labs.hackthebox.machinesCompleted} machines completed • Rank: ${portfolioData.labs.hackthebox.rank}</p>
                <p><strong>Projects:</strong> ${portfolioData.projects.length} projects including security tools, write-ups, and research</p>
            </div>
            
            <p class="resume-note">📄 Full resume PDF available for download above</p>
        </div>
    `;
    
    resumePreview.innerHTML = preview;
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
