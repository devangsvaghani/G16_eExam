// In-memory storage for user accounts (to be replaced with real backend/database logic)
const userDatabase = {};

// Function to show the signup form and hide the login form
function showSignup() {
    document.getElementById('loginForm').style.display = 'none';
    document.getElementById('signupForm').style.display = 'block';
    hideNotification();
}

// Function to show the login form and hide the signup form
function showLogin() {
    document.getElementById('signupForm').style.display = 'none';
    document.getElementById('loginForm').style.display = 'block';
    hideNotification();
}

// Function to handle login
function handleLogin(event) {
    event.preventDefault();
    const email = document.getElementById('loginEmail').value;
    const password = document.getElementById('loginPassword').value;

    // Basic validation logic
    if (!validateEmail(email)) {
        showNotification("Invalid email address!", "error");
        return false;
    }

    // Check if the user exists
    if (!userDatabase[email]) {
        showNotification("No account found with this email. Please sign up first.", "error");
        return false;
    }

    // Check if the password is correct
    if (userDatabase[email] !== password) {
        showNotification("Incorrect password! Please try again.", "error");
        return false;
    }

    showNotification("Login successful!", "success");
    return false;
}

// Function to handle signup
function handleSignup(event) {
    event.preventDefault();
    const name = document.getElementById('signupName').value;
    const email = document.getElementById('signupEmail').value;
    const password = document.getElementById('signupPassword').value;

    // Basic validation logic
    if (!validateEmail(email)) {
        showNotification("Invalid email address!", "error");
        return false;
    }
    if (password.length < 6) {
        showNotification("Password must be at least 6 characters!", "error");
        return false;
    }

    // Check if the user already exists
    if (userDatabase[email]) {
        showNotification("An account with this email already exists. Please log in.", "error");
        return false;
    }

    // Store the user's credentials in the database
    userDatabase[email] = password;

    // Show a success message popup instead of switching to login
    alert("Registration successful! You can now log in.");
    return false;
}

// Function to validate email format
function validateEmail(email) {
    const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return regex.test(email);
}

// Function to show notification
function showNotification(message, type) {
    const notification = document.getElementById('notification');
    notification.innerText = message;
    notification.className = 'notification ' + type;
    notification.style.display = 'block';
}

// Function to hide notification
function hideNotification() {
    const notification = document.getElementById('notification');
    notification.style.display = 'none';
}

// Function to toggle password visibility
function togglePassword(fieldId) {
    const field = document.getElementById(fieldId);
    field.type = field.type === 'password' ? 'text' : 'password';
}

// Function to handle password reset (Mockup)
function resetPassword() {
    const email = prompt("Enter your registered email:");
    if (email && validateEmail(email)) {
        if (userDatabase[email]) {
            alert("A reset link has been sent to " + email); // Placeholder for real logic
        } else {
            alert("No account found with this email.");
        }
    } else {
        alert("Please enter a valid email address.");
    }
}
