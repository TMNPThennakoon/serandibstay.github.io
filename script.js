// Firebase Authentication and Enhanced Functionality
let currentUser = null;

// Wait for Firebase to load
document.addEventListener('DOMContentLoaded', function() {
    // Wait a bit for Firebase to initialize
    setTimeout(initializeApp, 1000);
});

function initializeApp() {
    if (!window.firebase) {
        console.error('Firebase not loaded yet');
        setTimeout(initializeApp, 1000);
        return;
    }

    // Initialize authentication state listener
    window.firebase.onAuthStateChanged(window.firebase.auth, (user) => {
        currentUser = user;
        updateUI(user);
    });

    // Initialize all event listeners
    initializeEventListeners();
    initializeExistingFeatures();
}

function initializeEventListeners() {
    // Login form
    const loginForm = document.getElementById('loginForm');
    if (loginForm) {
        loginForm.addEventListener('submit', handleLogin);
    }

    // Signup form
    const signupForm = document.getElementById('signupForm');
    if (signupForm) {
        signupForm.addEventListener('submit', handleSignup);
    }

    // Password reset form
    const passwordResetForm = document.getElementById('passwordResetForm');
    if (passwordResetForm) {
        passwordResetForm.addEventListener('submit', handlePasswordReset);
    }

    // Change password form
    const changePasswordForm = document.getElementById('changePasswordForm');
    if (changePasswordForm) {
        changePasswordForm.addEventListener('submit', handleChangePassword);
    }

    // Google login buttons
    const googleLoginBtn = document.getElementById('googleLoginBtn');
    if (googleLoginBtn) {
        googleLoginBtn.addEventListener('click', handleGoogleLogin);
    }

    const googleSignupBtn = document.getElementById('googleSignupBtn');
    if (googleSignupBtn) {
        googleSignupBtn.addEventListener('click', handleGoogleSignup);
    }

    // Modal switching
    const switchToSignup = document.getElementById('switchToSignup');
    if (switchToSignup) {
        switchToSignup.addEventListener('click', (e) => {
            e.preventDefault();
            closeAllModals();
            document.getElementById('signupModal').style.display = 'flex';
        });
    }

    const switchToLogin = document.getElementById('switchToLogin');
    if (switchToLogin) {
        switchToLogin.addEventListener('click', (e) => {
            e.preventDefault();
            closeAllModals();
            document.getElementById('loginModal').style.display = 'flex';
        });
    }

    const switchToLoginFromReset = document.getElementById('switchToLoginFromReset');
    if (switchToLoginFromReset) {
        switchToLoginFromReset.addEventListener('click', (e) => {
            e.preventDefault();
            closeAllModals();
            document.getElementById('loginModal').style.display = 'flex';
        });
    }

    // Forgot password link
    const forgotPasswordLink = document.getElementById('forgotPasswordLink');
    if (forgotPasswordLink) {
        forgotPasswordLink.addEventListener('click', (e) => {
            e.preventDefault();
            closeAllModals();
            document.getElementById('passwordResetModal').style.display = 'flex';
        });
    }

    // Profile and logout
    const profileLink = document.getElementById('profileLink');
    if (profileLink) {
        profileLink.addEventListener('click', (e) => {
            e.preventDefault();
            closeAllModals();
            document.getElementById('userProfileModal').style.display = 'flex';
        });
    }

    const logoutLink = document.getElementById('logoutLink');
    if (logoutLink) {
        logoutLink.addEventListener('click', (e) => {
            e.preventDefault();
            handleLogout();
        });
    }

    const logoutBtn = document.getElementById('logoutBtn');
    if (logoutBtn) {
        logoutBtn.addEventListener('click', handleLogout);
    }

    const changePasswordBtn = document.getElementById('changePasswordBtn');
    if (changePasswordBtn) {
        changePasswordBtn.addEventListener('click', (e) => {
            e.preventDefault();
            closeAllModals();
            document.getElementById('changePasswordModal').style.display = 'flex';
        });
    }

    // Login/Signup buttons in navigation
    const loginBtn = document.getElementById('loginLink');
    if (loginBtn) {
        loginBtn.addEventListener('click', (e) => {
            e.preventDefault();
            document.getElementById('loginModal').style.display = 'flex';
        });
    }

    const signupBtn = document.getElementById('signupLink');
    if (signupBtn) {
        signupBtn.addEventListener('click', (e) => {
            e.preventDefault();
            document.getElementById('signupModal').style.display = 'flex';
        });
    }
}

// Authentication Functions
async function handleLogin(e) {
    e.preventDefault();
    
    const email = document.getElementById('loginEmail').value;
    const password = document.getElementById('loginPassword').value;
    
    try {
        const userCredential = await window.firebase.signInWithEmailAndPassword(window.firebase.auth, email, password);
        showMessage('Login successful!', 'success');
        closeAllModals();
        clearForm('loginForm');
    } catch (error) {
        showMessage(getErrorMessage(error.code), 'error');
    }
}

async function handleSignup(e) {
    e.preventDefault();
    
    const name = document.getElementById('signupName').value;
    const email = document.getElementById('signupEmail').value;
    const password = document.getElementById('signupPassword').value;
    const confirmPassword = document.getElementById('signupConfirmPassword').value;
    const phone = document.getElementById('signupPhone').value;
    
    // Validate passwords match
    if (password !== confirmPassword) {
        showMessage('Passwords do not match!', 'error');
        return;
    }
    
    try {
        const userCredential = await window.firebase.createUserWithEmailAndPassword(window.firebase.auth, email, password);
        
        // Save additional user data to Firebase Database
        await saveUserData(userCredential.user.uid, {
            name: name,
            email: email,
            phone: phone,
            createdAt: new Date().toISOString()
        });
        
        // Send welcome email (placeholder)
        sendWelcomeEmail(email, name);
        
        showMessage('Account created successfully! Welcome email sent.', 'success');
        closeAllModals();
        clearForm('signupForm');
    } catch (error) {
        showMessage(getErrorMessage(error.code), 'error');
    }
}

async function handleGoogleLogin() {
    try {
        const result = await window.firebase.signInWithPopup(window.firebase.auth, window.firebase.provider);
        
        // Save user data if it's a new user
        if (result.additionalUserInfo.isNewUser) {
            await saveUserData(result.user.uid, {
                name: result.user.displayName,
                email: result.user.email,
                phone: result.user.phoneNumber || '',
                createdAt: new Date().toISOString(),
                provider: 'google'
            });
            
            sendWelcomeEmail(result.user.email, result.user.displayName);
        }
        
        showMessage('Login successful!', 'success');
        closeAllModals();
    } catch (error) {
        showMessage(getErrorMessage(error.code), 'error');
    }
}

async function handleGoogleSignup() {
    // Same as Google login for new users
    await handleGoogleLogin();
}

async function handlePasswordReset(e) {
    e.preventDefault();
    
    const email = document.getElementById('resetEmail').value;
    
    try {
        await window.firebase.sendPasswordResetEmail(window.firebase.auth, email);
        showMessage('Password reset email sent! Check your inbox.', 'success');
        closeAllModals();
        clearForm('passwordResetForm');
    } catch (error) {
        showMessage(getErrorMessage(error.code), 'error');
    }
}

async function handleChangePassword(e) {
    e.preventDefault();
    
    const currentPassword = document.getElementById('currentPassword').value;
    const newPassword = document.getElementById('newPassword').value;
    const confirmNewPassword = document.getElementById('confirmNewPassword').value;
    
    if (newPassword !== confirmNewPassword) {
        showMessage('New passwords do not match!', 'error');
        return;
    }
    
    try {
        // Re-authenticate user
        const credential = window.firebase.EmailAuthProvider.credential(currentUser.email, currentPassword);
        await window.firebase.reauthenticateWithCredential(currentUser, credential);
        
        // Update password
        await window.firebase.updatePassword(currentUser, newPassword);
        
        // Send notification email
        sendPasswordChangeEmail(currentUser.email);
        
        showMessage('Password updated successfully! Notification email sent.', 'success');
        closeAllModals();
        clearForm('changePasswordForm');
    } catch (error) {
        showMessage(getErrorMessage(error.code), 'error');
    }
}

async function handleLogout() {
    try {
        await window.firebase.signOut(window.firebase.auth);
        showMessage('Logged out successfully!', 'success');
        closeAllModals();
    } catch (error) {
        showMessage('Error logging out. Please try again.', 'error');
    }
}

// Database Functions
async function saveUserData(uid, userData) {
    try {
        await window.firebase.set(window.firebase.ref(window.firebase.database, 'users/' + uid), userData);
    } catch (error) {
        console.error('Error saving user data:', error);
    }
}

// UI Functions
function updateUI(user) {
    const loginLink = document.getElementById('loginLink');
    const signupLink = document.getElementById('signupLink');
    const userMenu = document.getElementById('userMenu');
    const accountText = document.getElementById('accountText');
    
    if (user) {
        // User is logged in
        if (loginLink) loginLink.style.display = 'none';
        if (signupLink) signupLink.style.display = 'none';
        if (userMenu) userMenu.style.display = 'block';
        if (accountText) accountText.textContent = user.displayName || 'Profile';
        
        // Update profile modal
        const userDisplayName = document.getElementById('userDisplayName');
        const userEmail = document.getElementById('userEmail');
        if (userDisplayName) userDisplayName.textContent = user.displayName || 'User Profile';
        if (userEmail) userEmail.textContent = user.email;
    } else {
        // User is not logged in
        if (loginLink) loginLink.style.display = 'block';
        if (signupLink) signupLink.style.display = 'block';
        if (userMenu) userMenu.style.display = 'none';
        if (accountText) accountText.textContent = 'Account';
    }
}

function showMessage(message, type) {
    // Remove existing messages
    const existingMessages = document.querySelectorAll('.auth-message');
    existingMessages.forEach(msg => msg.remove());
    
    // Create new message
    const messageDiv = document.createElement('div');
    messageDiv.className = `auth-message ${type}`;
    messageDiv.textContent = message;
    
    // Insert at the top of the current modal
    const currentModal = document.querySelector('.modal-overlay[style*="flex"] .modal-content');
    if (currentModal) {
        currentModal.insertBefore(messageDiv, currentModal.firstChild);
        
        // Auto remove after 5 seconds
        setTimeout(() => {
            messageDiv.remove();
        }, 5000);
    }
}

function closeAllModals() {
    const modals = document.querySelectorAll('.modal-overlay');
    modals.forEach(modal => {
        modal.style.display = 'none';
    });
}

function clearForm(formId) {
    const form = document.getElementById(formId);
    if (form) {
        form.reset();
    }
}

function getErrorMessage(errorCode) {
    const errorMessages = {
        'auth/user-not-found': 'No account found with this email address.',
        'auth/wrong-password': 'Incorrect password.',
        'auth/email-already-in-use': 'An account with this email already exists.',
        'auth/weak-password': 'Password should be at least 6 characters.',
        'auth/invalid-email': 'Invalid email address.',
        'auth/user-disabled': 'This account has been disabled.',
        'auth/too-many-requests': 'Too many failed attempts. Please try again later.',
        'auth/network-request-failed': 'Network error. Please check your connection.',
        'auth/popup-closed-by-user': 'Sign-in popup was closed.',
        'auth/cancelled-popup-request': 'Sign-in was cancelled.'
    };
    
    return errorMessages[errorCode] || 'An error occurred. Please try again.';
}

// Initialize existing features (from original script.js)
function initializeExistingFeatures() {
    // Mobile menu toggle
    const menuToggle = document.querySelector('.menu-toggle');
    const navLinks = document.querySelector('.nav__links');

    if (menuToggle && navLinks) {
        menuToggle.addEventListener('click', function() {
            navLinks.classList.toggle('active');
            menuToggle.innerHTML = navLinks.classList.contains('active') ? 
                '<i class="ri-close-line"></i>' : '<i class="ri-menu-line"></i>';
        });
    }

    // Close mobile menu when clicking on a link
    const navItems = document.querySelectorAll('.nav__links .link a');
    navItems.forEach(item => {
        item.addEventListener('click', function() {
            if (navLinks) {
                navLinks.classList.remove('active');
                if (menuToggle) menuToggle.innerHTML = '<i class="ri-menu-line"></i>';
            }
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
    const checkinField = document.getElementById('checkin');
    if (checkinField) {
        checkinField.min = today;
    }

    // Set minimum date for check-out (check-in date + 1)
    if (checkinField) {
        checkinField.addEventListener('change', function() {
            const checkinDate = this.value;
            const checkoutField = document.getElementById('checkout');
            if (checkinDate && checkoutField) {
                const nextDay = new Date(checkinDate);
                nextDay.setDate(nextDay.getDate() + 1);
                const nextDayStr = nextDay.toISOString().split('T')[0];
                checkoutField.min = nextDayStr;
                if (checkoutField.value && checkoutField.value < nextDayStr) {
                    checkoutField.value = nextDayStr;
                }
            }
        });
    }

    // Close modals when clicking outside content
    const modals = document.querySelectorAll('.modal-overlay');
    modals.forEach(modal => {
        modal.addEventListener('click', function(e) {
            if (e.target === modal) {
                modal.style.display = 'none';
            }
        });
    });

    // Close modal buttons
    const closeButtons = document.querySelectorAll('.close-modal');
    closeButtons.forEach(btn => {
        btn.addEventListener('click', function() {
            closeAllModals();
        });
    });

    // Image Slider
    const slides = document.querySelectorAll('.slide');
    let currentSlide = 0;

    function nextSlide() {
        if (slides.length > 0) {
            slides[currentSlide].classList.remove('active');
            currentSlide = (currentSlide + 1) % slides.length;
            slides[currentSlide].classList.add('active');
        }
    }

    // Change slide every 5 seconds
    if (slides.length > 0) {
        setInterval(nextSlide, 5000);
    }

    // Read More button functionality
    const readMoreBtn = document.querySelector('.btn-readmore');
    const historyPopup = document.getElementById('historyPopup');
    const closeHistory = document.querySelector('.close-history');

    if (readMoreBtn && historyPopup) {
        readMoreBtn.addEventListener('click', function(e) {
            e.preventDefault();
            historyPopup.style.display = 'flex';
            document.body.style.overflow = 'hidden';
        });
    }

    if (closeHistory && historyPopup) {
        closeHistory.addEventListener('click', function() {
            historyPopup.style.display = 'none';
            document.body.style.overflow = 'auto';
        });
    }

    // Close history popup when clicking outside content
    if (historyPopup) {
        historyPopup.addEventListener('click', function(e) {
            if (e.target === historyPopup) {
                historyPopup.style.display = 'none';
                document.body.style.overflow = 'auto';
            }
        });
    }
}

// Email notification functions (placeholder implementations)
function sendWelcomeEmail(email, name) {
    // This would typically call a backend service to send emails
    console.log(`Welcome email sent to ${email} for ${name}`);
    // For demo purposes, we'll just show an alert
    setTimeout(() => {
        alert(`Welcome email sent to ${email}!`);
    }, 1000);
}

function sendPasswordChangeEmail(email) {
    console.log(`Password change notification sent to ${email}`);
    setTimeout(() => {
        alert(`Password change notification sent to ${email}!`);
    }, 1000);
}