// Login/Signup Modals
const loginBtn = document.querySelector('.btn-login');
const signupBtn = document.querySelector('.btn-signup');
const loginModal = document.getElementById('loginModal');
const signupModal = document.getElementById('signupModal');
const closeModals = document.querySelectorAll('.close-modal');

loginBtn.addEventListener('click', function(e) {
    e.preventDefault();
    loginModal.style.display = 'flex';
});

signupBtn.addEventListener('click', function(e) {
    e.preventDefault();
    signupModal.style.display = 'flex';
});

closeModals.forEach(btn => {
    btn.addEventListener('click', function() {
        loginModal.style.display = 'none';
        signupModal.style.display = 'none';
    });
});

// Close modals when clicking outside content
[loginModal, signupModal].forEach(modal => {
    modal.addEventListener('click', function(e) {
        if (e.target === modal) {
            modal.style.display = 'none';
        }
    });
});



document.addEventListener('DOMContentLoaded', function() {
    // Mobile menu toggle
    const menuToggle = document.querySelector('.menu-toggle');
    const navLinks = document.querySelector('.nav__links');

    menuToggle.addEventListener('click', function() {
        navLinks.classList.toggle('active');
        menuToggle.innerHTML = navLinks.classList.contains('active') ? 
            '<i class="ri-close-line"></i>' : '<i class="ri-menu-line"></i>';
    });

    // Close mobile menu when clicking on a link
    const navItems = document.querySelectorAll('.nav__links .link a');
    navItems.forEach(item => {
        item.addEventListener('click', function() {
            navLinks.classList.remove('active');
            menuToggle.innerHTML = '<i class="ri-menu-line"></i>';
        });
    });

    // Filter hotels by category
    const filterButtons = document.querySelectorAll('.filter-btn');
    const hotelCards = document.querySelectorAll('.popular__card');

    filterButtons.forEach(button => {
        button.addEventListener('click', function() {
            // Remove active class from all buttons
            filterButtons.forEach(btn => btn.classList.remove('active'));
            // Add active class to clicked button
            this.classList.add('active');

            const filterValue = this.getAttribute('data-filter');

            hotelCards.forEach(card => {
                if (filterValue === 'all' || card.getAttribute('data-category') === filterValue) {
                    card.style.display = 'block';
                } else {
                    card.style.display = 'none';
                }
            });
        });
    });

    // Smooth scrolling for anchor links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            e.preventDefault();
            
            const targetId = this.getAttribute('href');
            if (targetId === '#') return;
            
            const targetElement = document.querySelector(targetId);
            if (targetElement) {
                window.scrollTo({
                    top: targetElement.offsetTop - 80,
                    behavior: 'smooth'
                });
            }
        });
    });

    // Set minimum date for check-in (today)
    const today = new Date().toISOString().split('T')[0];
    document.getElementById('checkin').min = today;

    // Set minimum date for check-out (check-in date + 1)
    document.getElementById('checkin').addEventListener('change', function() {
        const checkinDate = this.value;
        const checkoutField = document.getElementById('checkout');
        if (checkinDate) {
            const nextDay = new Date(checkinDate);
            nextDay.setDate(nextDay.getDate() + 1);
            const nextDayStr = nextDay.toISOString().split('T')[0];
            checkoutField.min = nextDayStr;
            if (checkoutField.value && checkoutField.value < nextDayStr) {
                checkoutField.value = nextDayStr;
            }
        }
    });

    // Dark Mode Toggle
    const darkModeToggle = document.getElementById('darkModeToggle');
    const body = document.body;

    // Check for saved user preference
    if (localStorage.getItem('darkMode') === 'enabled') {
        body.classList.add('dark-mode');
        darkModeToggle.checked = true;
    }

    // Toggle dark mode
    darkModeToggle.addEventListener('change', function() {
        if (this.checked) {
            body.classList.add('dark-mode');
            localStorage.setItem('darkMode', 'enabled');
        } else {
            body.classList.remove('dark-mode');
            localStorage.setItem('darkMode', 'disabled');
        }
    });

    // View Deals Popup
    const viewDealsBtn = document.querySelector('.btn-secondary[href="#deals"]');
    const dealsPopup = document.getElementById('dealsPopup');
    const closePopup = document.querySelector('.close-popup');

    if (viewDealsBtn) {
        viewDealsBtn.addEventListener('click', function(e) {
            e.preventDefault();
            dealsPopup.style.display = 'flex';
        });
    }

    if (closePopup) {
        closePopup.addEventListener('click', function() {
            dealsPopup.style.display = 'none';
        });
    }

    // Close popup when clicking outside content
    if (dealsPopup) {
        dealsPopup.addEventListener('click', function(e) {
            if (e.target === dealsPopup) {
                dealsPopup.style.display = 'none';
            }
        });
    }

    // Login/Signup Modals
    const loginBtn = document.querySelector('.btn-login');
    const signupBtn = document.querySelector('.btn-signup');
    const loginModal = document.getElementById('loginModal');
    const signupModal = document.getElementById('signupModal');
    const closeModals = document.querySelectorAll('.close-modal');

    if (loginBtn) {
        loginBtn.addEventListener('click', function(e) {
            e.preventDefault();
            loginModal.style.display = 'flex';
        });
    }

    if (signupBtn) {
        signupBtn.addEventListener('click', function(e) {
            e.preventDefault();
            signupModal.style.display = 'flex';
        });
    }

    closeModals.forEach(btn => {
        btn.addEventListener('click', function() {
            loginModal.style.display = 'none';
            signupModal.style.display = 'none';
        });
    });

    // Close modals when clicking outside content
    [loginModal, signupModal].forEach(modal => {
        if (modal) {
            modal.addEventListener('click', function(e) {
                if (e.target === modal) {
                    modal.style.display = 'none';
                }
            });
        }
    });

    // Video Background Playback
    const headerVideo = document.getElementById('headerVideo');
    if (headerVideo) {
        headerVideo.play().catch(error => {
            console.log('Autoplay prevented:', error);
        });
    }

    // Scroll reveal animation
    const scrollReveal = ScrollReveal({
        origin: 'bottom',
        distance: '60px',
        duration: 1000,
        delay: 200,
        reset: true
    });

    scrollReveal.reveal('.header__content, .feature__card, .popular__card, .destination__card, .deal__card, .testimonial__card, .contact__info, .contact__form', {
        interval: 200
    });
});


// Read More button
// History Popup
const readMoreBtn = document.querySelector('.btn-readmore');
const historyPopup = document.getElementById('historyPopup');
const closeHistory = document.querySelector('.close-history');

if (readMoreBtn) {
    readMoreBtn.addEventListener('click', function(e) {
        e.preventDefault();
        historyPopup.style.display = 'flex';
        document.body.style.overflow = 'hidden'; // Prevent scrolling when popup is open
    });
}

if (closeHistory) {
    closeHistory.addEventListener('click', function() {
        historyPopup.style.display = 'none';
        document.body.style.overflow = 'auto';
    });
}

// Close popup when clicking outside content
if (historyPopup) {
    historyPopup.addEventListener('click', function(e) {
        if (e.target === historyPopup) {
            historyPopup.style.display = 'none';
            document.body.style.overflow = 'auto';
        }
    });
}

// Image Slider
const slides = document.querySelectorAll('.slide');
let currentSlide = 0;

function nextSlide() {
    slides[currentSlide].classList.remove('active');
    currentSlide = (currentSlide + 1) % slides.length;
    slides[currentSlide].classList.add('active');
}

// Change slide every 5 seconds
setInterval(nextSlide, 5000);
