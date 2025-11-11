import '@babel/polyfill'; //this will allow to browser to work new javascript features
import { login, logout } from './login';
import { updateSettings } from './updateSettings';
import { bookTour } from './booking';
import { signup } from './signup';

const loginForm = document.querySelector('.form--login');
const logOutBtn = document.querySelector('.nav__el--logout');
const signupForm = document.querySelector('.form--signup');
const bookBtn = document.getElementById('book-tour');
const signupBtn = document.getElementById('signup-btn');
const map = document.getElementById('map');

// Password Toggle Functionality
const initializePasswordToggles = () => {
  const passwordToggles = document.querySelectorAll('.password-toggle');

  passwordToggles.forEach((toggle) => {
    // Set initial state
    toggle.setAttribute('aria-label', 'Show password');
    toggle.setAttribute('role', 'button');
    toggle.setAttribute('tabindex', '0');

    toggle.addEventListener('click', function () {
      togglePassword(this);
    });

    // Also work on Enter key press for accessibility
    toggle.addEventListener('keypress', function (e) {
      if (e.key === 'Enter') {
        togglePassword(this);
      }
    });
  });
};

const togglePassword = (toggleElement) => {
  const passwordInput = toggleElement.previousElementSibling;
  const isPassword = passwordInput.type === 'password';

  passwordInput.type = isPassword ? 'text' : 'password';
  toggleElement.textContent = isPassword ? 'Hide' : 'Show';
  toggleElement.setAttribute(
    'aria-label',
    isPassword ? 'Hide password' : 'Show password'
  );
};

// Initialize when DOM is loaded
document.addEventListener('DOMContentLoaded', function () {
  initializePasswordToggles();
});

if (map) {
  const locations = JSON.parse(
    document.getElementById('map').dataset.locations
  );
  // Initialize the map
  const map = L.map('map').setView([25.781842, -80.128473], 8); // Center the map on the first location

  // Add markers for each location
  locations.forEach((location) => {
    const marker = L.marker([location.coordinates[1], location.coordinates[0]])
      .addTo(map)
      .bindPopup(`<b>${location.description}</b><br>Day: ${location.day}`);
  });
}

const updateProfileForm = document.querySelector('.form-user-data');
const updatePasswordForm = document.querySelector('.form-user-password');

if (loginForm) {
  loginForm.addEventListener('submit', (e) => {
    e.preventDefault();

    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;

    login(email, password);
  });
}
if (logOutBtn) logOutBtn.addEventListener('click', logout);

if (signupForm) {
  signupForm.addEventListener('submit', (e) => {
    e.preventDefault();

    signupBtn.disabled = true;
    signupBtn.textContent = 'Signing Up...';

    const name = document.getElementById('name').value;
    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;
    const passwordConfirm = document.getElementById('passwordConfirm').value;

    signup(name, email, password, passwordConfirm);
  });
}

if (updateProfileForm)
  updateProfileForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const formData = new FormData();
    formData.append('name', document.getElementById('name').value);
    formData.append('email', document.getElementById('email').value);
    formData.append('image', document.getElementById('photo').files[0]);

    updateSettings(formData, 'data');
  });

if (updatePasswordForm)
  updatePasswordForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    document.querySelector('.save-password-btn').textContent = 'Updating..';
    const currentPassword = document.getElementById('password-current').value;
    const password = document.getElementById('password').value;
    const passwordConfirm = document.getElementById('password-confirm').value;

    await updateSettings(
      { currentPassword, password, passwordConfirm },
      'password'
    ); //since the updateSettings is async then it will return a promise, so we can await to clear the form field inorder to complete the execution

    document.getElementById('password-current').value = '';
    document.getElementById('password').value = '';
    document.getElementById('password-confirm').value = '';
    document.querySelector('.save-password-btn').textContent = 'Save Password';
  });

if (bookBtn)
  bookBtn.addEventListener('click', async (e) => {
    e.target.textContent = 'Processing...';
    const { tourId } = e.target.dataset; //auto camelcase
    bookTour(tourId);
  });
