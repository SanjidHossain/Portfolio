// Wait for the DOM to be fully loaded
document.addEventListener('DOMContentLoaded', function() {
    // Initialize variables
    const header = document.getElementById('header');
    const navLinks = document.querySelectorAll('.nav-link');
    const mobileNavToggle = document.querySelector('.mobile-nav-toggle');
    const hamburger = document.querySelector('.hamburger');
    const navLinksContainer = document.querySelector('.nav-links');
    const closeMobileMenu = document.querySelector('.close-mobile-menu');
    const backToTopButton = document.getElementById('back-to-top');
    const themeToggle = document.querySelector('.theme-toggle');
    const body = document.body;
    const titleAnimation = document.querySelector('.title-animation');
    const projectSearch = document.getElementById('project-search');
    const filterButtons = document.querySelectorAll('.filter-btn');
    const projectCards = document.querySelectorAll('.project-card');
    const testimonialPrev = document.querySelector('.testimonial-prev');
    const testimonialNext = document.querySelector('.testimonial-next');
    const testimonialItems = document.querySelectorAll('.testimonial-item');
    const dots = document.querySelectorAll('.dot');
    const currentYearElement = document.getElementById('current-year');
    const preloader = document.querySelector('.preloader');

    // Preloader
    window.addEventListener('load', function() {
        setTimeout(function() {
            preloader.classList.add('fade-out');
        }, 800);
    });

    // Initialize AOS animations
    AOS.init({
        duration: 1000,
        once: true,
        mirror: false
    });

    // Set current year in footer
    if (currentYearElement) {
        currentYearElement.textContent = new Date().getFullYear();
    }

    // Typing animation for titles
    const titles = ['Data Scientist', 'AI/ML Engineer', 'Data Analyst', 'SQA Engineer'];
    let titleIndex = 0;
    let charIndex = 0;
    let isDeleting = false;
    let typingDelay = 100;
    let deletingDelay = 50;
    let newTitleDelay = 2000; // Delay after typing a complete title

    function typeTitle() {
        const currentTitle = titles[titleIndex];
        
        if (isDeleting) {
            // Remove character
            titleAnimation.textContent = currentTitle.substring(0, charIndex - 1);
            charIndex--;
            typingDelay = deletingDelay;
        } else {
            // Add character
            titleAnimation.textContent = currentTitle.substring(0, charIndex + 1);
            charIndex++;
            typingDelay = 100;
        }

        // Handle typing completion
        if (!isDeleting && charIndex === currentTitle.length) {
            // Pause at the end of typing
            isDeleting = true;
            typingDelay = newTitleDelay;
        } else if (isDeleting && charIndex === 0) {
            // Move to next title
            isDeleting = false;
            titleIndex = (titleIndex + 1) % titles.length;
        }

        // Continue typing
        setTimeout(typeTitle, typingDelay);
    }

    // Start the typing animation
    if (titleAnimation) {
        setTimeout(typeTitle, 500);
    }

    // Change header style on scroll
    window.addEventListener('scroll', function() {
        if (window.scrollY > 50) {
            header.classList.add('scrolled');
        } else {
            header.classList.remove('scrolled');
        }

        // Show or hide back to top button
        if (window.scrollY > 300) {
            backToTopButton.classList.add('visible');
        } else {
            backToTopButton.classList.remove('visible');
        }

        // Active nav link on scroll
        updateActiveNavLink();
    });

    // Function to update active nav link on scroll
    function updateActiveNavLink() {
        let scrollPosition = window.scrollY + 100;

        navLinks.forEach(link => {
            const section = document.querySelector(link.getAttribute('href'));
            if (section) {
                const sectionTop = section.offsetTop;
                const sectionHeight = section.offsetHeight;

                if (scrollPosition >= sectionTop && scrollPosition < sectionTop + sectionHeight) {
                    link.classList.add('active');
                } else {
                    link.classList.remove('active');
                }
            }
        });
    }

    // Smooth scrolling for nav links
    navLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            
            const targetId = this.getAttribute('href');
            const targetSection = document.querySelector(targetId);
            
            if (targetSection) {
                // Close mobile menu if it's open
                if (navLinksContainer.classList.contains('active')) {
                    toggleMobileMenu();
                }
                
                window.scrollTo({
                    top: targetSection.offsetTop - 80,
                    behavior: 'smooth'
                });
            }
        });
    });

    // Toggle mobile menu
    function toggleMobileMenu() {
        hamburger.classList.toggle('active');
        navLinksContainer.classList.toggle('active');
        document.body.classList.toggle('menu-open');
    }
    
    function closeNavMenu() {
        hamburger.classList.remove('active');
        navLinksContainer.classList.remove('active');
        document.body.classList.remove('menu-open');
    }

    // Mobile navigation toggle
    if (mobileNavToggle) {
        mobileNavToggle.addEventListener('click', toggleMobileMenu);
    }
    
    // Close button in mobile menu
    if (closeMobileMenu) {
        closeMobileMenu.addEventListener('click', closeNavMenu);
    }
    
    // Close menu when clicking on navigation links
    document.querySelectorAll('.nav-links .nav-link').forEach(link => {
        link.addEventListener('click', closeNavMenu);
    });
    
    // Close menu when clicking outside
    document.addEventListener('click', function(e) {
        if (navLinksContainer.classList.contains('active') &&
            !navLinksContainer.contains(e.target) &&
            !mobileNavToggle.contains(e.target)) {
            closeNavMenu();
        }
    });

    // Back to top button functionality
    if (backToTopButton) {
        backToTopButton.addEventListener('click', function() {
            window.scrollTo({
                top: 0,
                behavior: 'smooth'
            });
        });
    }

    // Theme toggle functionality
    if (themeToggle) {
        // Check for saved theme preference
        const savedTheme = localStorage.getItem('theme');
        if (savedTheme === 'dark') {
            body.classList.add('dark-mode');
            themeToggle.innerHTML = '<i class="fas fa-sun"></i>';
        }

        themeToggle.addEventListener('click', function() {
            body.classList.toggle('dark-mode');
            
            // Update theme icon
            if (body.classList.contains('dark-mode')) {
                themeToggle.innerHTML = '<i class="fas fa-sun"></i>';
                localStorage.setItem('theme', 'dark');
            } else {
                themeToggle.innerHTML = '<i class="fas fa-moon"></i>';
                localStorage.setItem('theme', 'light');
            }
        });
    }

    // Project filtering functionality
    if (projectSearch) {
        projectSearch.addEventListener('input', filterProjects);
    }

    if (filterButtons.length > 0) {
        filterButtons.forEach(button => {
            button.addEventListener('click', function() {
                // Remove active class from all buttons
                filterButtons.forEach(btn => btn.classList.remove('active'));
                // Add active class to clicked button
                this.classList.add('active');
                
                const filter = this.getAttribute('data-filter');
                filterProjectsByCategory(filter);
            });
        });
    }

    function filterProjects() {
        const searchTerm = projectSearch.value.toLowerCase();
        
        projectCards.forEach(card => {
            const title = card.querySelector('h3').textContent.toLowerCase();
            const description = card.querySelector('p').textContent.toLowerCase();
            const techs = Array.from(card.querySelectorAll('.project-tech span')).map(span => span.textContent.toLowerCase());
            
            const isVisible = 
                title.includes(searchTerm) || 
                description.includes(searchTerm) || 
                techs.some(tech => tech.includes(searchTerm));
            
            card.style.display = isVisible ? 'block' : 'none';
        });
    }

    function filterProjectsByCategory(category) {
        projectCards.forEach(card => {
            if (category === 'all') {
                card.style.display = 'block';
            } else {
                const cardCategories = card.getAttribute('data-category').split(' ');
                card.style.display = cardCategories.includes(category) ? 'block' : 'none';
            }
        });
    }

    // Testimonials slider functionality
    let currentTestimonial = 0;

    function showTestimonial(index) {
        testimonialItems.forEach(item => {
            item.classList.remove('active');
        });
        
        dots.forEach(dot => {
            dot.classList.remove('active');
        });
        
        testimonialItems[index].classList.add('active');
        dots[index].classList.add('active');
        currentTestimonial = index;
    }

    if (testimonialPrev) {
        testimonialPrev.addEventListener('click', function() {
            currentTestimonial = (currentTestimonial - 1 + testimonialItems.length) % testimonialItems.length;
            showTestimonial(currentTestimonial);
        });
    }

    if (testimonialNext) {
        testimonialNext.addEventListener('click', function() {
            currentTestimonial = (currentTestimonial + 1) % testimonialItems.length;
            showTestimonial(currentTestimonial);
        });
    }

    if (dots.length > 0) {
        dots.forEach(dot => {
            dot.addEventListener('click', function() {
                const index = parseInt(this.getAttribute('data-index'));
                showTestimonial(index);
            });
        });
    }

    // Auto-rotate testimonials
    setInterval(function() {
        if (testimonialItems.length > 0) {
            currentTestimonial = (currentTestimonial + 1) % testimonialItems.length;
            showTestimonial(currentTestimonial);
        }
    }, 5000);
});

// Function to show publication message
function showPublicationMessage(message) {
    // Create toast notification
    const toast = document.createElement('div');
    toast.className = 'toast-notification';
    toast.innerHTML = `
        <div class="toast-icon"><i class="fas fa-info-circle"></i></div>
        <div class="toast-message">${message}</div>
        <button class="toast-close"><i class="fas fa-times"></i></button>
    `;
    document.body.appendChild(toast);
    
    // Show toast
    setTimeout(() => {
        toast.classList.add('show');
    }, 100);
    
    // Add click event to close button
    toast.querySelector('.toast-close').addEventListener('click', () => {
        toast.classList.remove('show');
        setTimeout(() => {
            document.body.removeChild(toast);
        }, 300);
    });
    
    // Auto close after 5 seconds
    setTimeout(() => {
        if (document.body.contains(toast)) {
            toast.classList.remove('show');
            setTimeout(() => {
                if (document.body.contains(toast)) {
                    document.body.removeChild(toast);
                }
            }, 300);
        }
    }, 5000);
}
