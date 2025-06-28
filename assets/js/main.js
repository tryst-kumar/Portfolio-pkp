// Main JavaScript file
document.addEventListener('DOMContentLoaded', function () {
    // Initialize AOS (Animate on Scroll)
    AOS.init({
        duration: 1000,
        once: true,
    });

    // Smooth scroll for nav links
    document.querySelectorAll('.nav-link').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            const href = this.getAttribute('href');
            if (href.startsWith('#')) {
                e.preventDefault();
                document.querySelector(href).scrollIntoView({
                    behavior: 'smooth'
                });
            }
        });
    });

    // Fetch GitHub Repositories
    if (document.getElementById('github-repos')) {
        const username = 'your-github-username'; // REPLACE with your GitHub username
        fetch(`https://api.github.com/users/${username}/repos?sort=stars&per_page=10`)
            .then(response => response.json())
            .then(repos => {
                const reposContainer = document.getElementById('github-repos');
                repos.forEach(repo => {
                    const repoCard = `
                        <div class="col-md-6">
                            <div class="card repo-card h-100">
                                <div class="card-body">
                                    <h5 class="card-title">
                                        <a href="${repo.html_url}" target="_blank">${repo.name}</a>
                                    </h5>
                                    <p class="card-text">${repo.description || 'No description available.'}</p>
                                    <p class="card-text">
                                        <small class="text-muted">
                                            <i class="fas fa-star"></i> ${repo.stargazers_count}
                                            <span class="ms-3"><i class="fas fa-circle" style="color:${getLanguageColor(repo.language)};"></i> ${repo.language}</span>
                                        </small>
                                    </p>
                                </div>
                            </div>
                        </div>
                    `;
                    reposContainer.innerHTML += repoCard;
                });
            })
            .catch(error => console.error('Error fetching GitHub repos:', error));
    }
    // Add this to your existing main.js file, inside the DOMContentLoaded event listener

    // ... (your existing AOS and GitHub fetch code)

    // --- NEW CODE STARTS HERE ---

    // Navigation Active State Management
    const pageUrl = window.location.pathname;
    const body = document.body;

    if (pageUrl.endsWith('/') || pageUrl.endsWith('index.html')) {
        body.classList.add('is-homepage');
    } else {
        body.classList.add('is-other-page');
    }

    // Function to set active link on non-homepage pages
    const setActiveLink = () => {
        const currentPageFile = pageUrl.split("/").pop();
        const navLinks = document.querySelectorAll('#nav-for-others .nav-link');
        navLinks.forEach(link => {
            if (link.getAttribute('href') === currentPageFile) {
                link.classList.add('active');
            }
        });
    };

    // Function to highlight nav link on scroll for homepage
    const navHighlighter = () => {
        const sections = document.querySelectorAll('section[id]');
        let scrollY = window.pageYOffset;

        sections.forEach(current => {
            const sectionHeight = current.offsetHeight;
            const sectionTop = current.offsetTop - 100; // Adjusted offset
            const sectionId = current.getAttribute('id');
            const navLink = document.querySelector(`#nav-for-index .nav-link[href*="${sectionId}"]`);

            if (scrollY > sectionTop && scrollY <= sectionTop + sectionHeight) {
                if(navLink) navLink.classList.add('active');
            } else {
                if(navLink) navLink.classList.remove('active');
            }
        });
    };

    if (body.classList.contains('is-homepage')) {
        // We are on the homepage, activate scroll-based highlighting
        window.addEventListener('scroll', navHighlighter);
        // Also ensure Home is active on page load
         const homeLink = document.querySelector('#nav-for-index .nav-link[href="#home"]');
        if (window.pageYOffset < 200 && homeLink) {
           homeLink.classList.add('active');
        }
    } else {
        // We are on another page, set active link based on filename
        setActiveLink();
    }

});

// Function to get a color for a language (can be expanded)
function getLanguageColor(language) {
    const colors = {
        'JavaScript': '#f1e05a',
        'HTML': '#e34c26',
        'CSS': '#563d7c',
        'Python': '#3572A5',
        'Java': '#b07219',
        'SCSS': '#c6538c',
    };
    return colors[language] || '#000';
}