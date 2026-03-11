import { auth, googleProvider } from './firebase-config.js';

const API_BASE = window.location.hostname === '127.0.0.1'
    ? 'http://127.0.0.1:5001/api'
    : 'http://localhost:5001/api';

document.addEventListener('DOMContentLoaded', () => {
    const authTabs = document.querySelectorAll('.auth-tab');
    const authForms = document.querySelectorAll('.auth-form');
    const loginForm = document.getElementById('login-form');
    const signupForm = document.getElementById('signup-form');
    const forgotPasswordForm = document.getElementById('forgot-password-form');
    const googleLoginBtn = document.getElementById('google-login');
    const googleSignupBtn = document.getElementById('google-signup');

    // Tab Switching
    authTabs.forEach(tab => {
        tab.addEventListener('click', () => {
            const target = tab.dataset.form;
            authTabs.forEach(t => t.classList.remove('active'));
            authForms.forEach(f => f.classList.remove('active'));
            tab.classList.add('active');
            document.getElementById(`${target}-form`).classList.add('active');
        });
    });

    // Handle Login
    loginForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        const formData = new FormData(loginForm);
        const data = Object.fromEntries(formData.entries());

        try {
            const res = await fetch(`${API_BASE}/auth/login`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(data)
            });
            const result = await res.json();
            if (res.ok) {
                localStorage.setItem('token', result.token);
                localStorage.setItem('user', JSON.stringify(result.user));
                window.location.href = 'profile.html';
            } else {
                alert(result.message);
            }
        } catch (err) {
            console.error(err);
        }
    });

    // Handle Signup
    signupForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        const formData = new FormData(signupForm);
        const data = Object.fromEntries(formData.entries());

        try {
            const res = await fetch(`${API_BASE}/auth/signup`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(data)
            });
            const result = await res.json();
            if (res.ok) {
                localStorage.setItem('token', result.token);
                localStorage.setItem('user', JSON.stringify(result.user));
                window.location.href = 'profile.html';
            } else {
                alert(result.message);
            }
        } catch (err) {
            console.error(err);
        }
    });

    // Google Authentication Logic
    const handleGoogleAuth = async () => {
        try {
            const result = await auth.signInWithPopup(googleProvider);
            const user = result.user;
            const names = user.displayName ? user.displayName.split(' ') : ['User', ''];

            const res = await fetch(`${API_BASE}/auth/google`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    email: user.email,
                    firstName: names[0],
                    lastName: names.slice(1).join(' ') || '',
                    googleId: user.uid
                })
            });

            const backendResult = await res.json();
            if (res.ok) {
                localStorage.setItem('token', backendResult.token);
                localStorage.setItem('user', JSON.stringify(backendResult.user));
                window.location.href = 'profile.html';
            } else {
                alert(backendResult.message || "Backend authentication failed.");
            }
        } catch (error) {
            console.error(error);
            if (error.code === 'auth/popup-closed-by-user') {
                return;
            }
            if (error.code === 'auth/unauthorized-domain') {
                alert("This domain (127.0.0.1) is not authorized in Firebase Console. Please add it to your Authorized Domains.");
            } else {
                alert(`Google authentication failed: ${error.message}`);
            }
        }
    };

    if (googleLoginBtn) googleLoginBtn.addEventListener('click', handleGoogleAuth);
    if (googleSignupBtn) googleSignupBtn.addEventListener('click', handleGoogleAuth);

    // Forgot Password Logic
    const showForgot = document.getElementById('show-forgot-password');
    const backToLogin = document.getElementById('back-to-login');
    const forgotEmailStep = document.getElementById('forgot-email-step');
    const forgotOtpStep = document.getElementById('forgot-otp-step');
    const sendOtpBtn = document.getElementById('send-otp-btn');
    const resetPasswordBtn = document.getElementById('reset-password-btn');

    showForgot.addEventListener('click', (e) => {
        e.preventDefault();
        loginForm.classList.remove('active');
        forgotPasswordForm.classList.add('active');
    });

    backToLogin.addEventListener('click', (e) => {
        e.preventDefault();
        forgotPasswordForm.classList.remove('active');
        loginForm.classList.add('active');
    });

    sendOtpBtn.addEventListener('click', async () => {
        const email = document.getElementById('forgot-email').value;
        if (!email) return alert('Email required');

        try {
            const res = await fetch(`${API_BASE}/auth/forgot-password`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email })
            });
            const result = await res.json();
            if (res.ok) {
                forgotEmailStep.style.display = 'none';
                forgotOtpStep.style.display = 'block';
                alert('OTP sent to your email');
            } else {
                alert(result.message);
            }
        } catch (err) {
            console.error(err);
        }
    });

    resetPasswordBtn.addEventListener('click', async () => {
        const email = document.getElementById('forgot-email').value;
        const otp = document.getElementById('reset-otp').value;
        const newPassword = document.getElementById('new-password').value;

        try {
            const res = await fetch(`${API_BASE}/auth/reset-password`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email, otp, newPassword })
            });
            const result = await res.json();
            if (res.ok) {
                alert('Password reset successful! Please login.');
                forgotPasswordForm.classList.remove('active');
                loginForm.classList.add('active');
            } else {
                alert(result.message);
            }
        } catch (err) {
            console.error(err);
        }
    });
});
