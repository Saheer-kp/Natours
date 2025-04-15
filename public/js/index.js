import '@babel/polyfill' //this will allow to browser to work new javascript features
import { login, logout } from "./login";
import { updateSettings } from './updateSettings';
import { bookTour } from './booking';


const loginForm = document.querySelector('.form--login');
const logOutBtn = document.querySelector('.nav__el--logout');
const bookBtn = document.getElementById('book-tour');
const map = document.getElementById('map');

if(map)
{
    const locations = JSON.parse(document.getElementById('map').dataset.locations);
    // Initialize the map
    const map = L.map('map').setView([25.781842, -80.128473], 8); // Center the map on the first location


    // Add markers for each location
    locations.forEach(location => {
        const marker = L.marker([location.coordinates[1], location.coordinates[0]])
            .addTo(map)
            .bindPopup(`<b>${location.description}</b><br>Day: ${location.day}`);
    });
}



const updateProfileForm = document.querySelector('.form-user-data');
const updatePasswordForm = document.querySelector('.form-user-password');

if(loginForm){
    loginForm.addEventListener('submit', e => {
        e.preventDefault()
    
        const email = document.getElementById('email').value;
        const password = document.getElementById('password').value;
    
        login(email, password);
    })
}
if(logOutBtn)
    logOutBtn.addEventListener('click', logout);


if(updateProfileForm)
    updateProfileForm.addEventListener('submit', e => {
        e.preventDefault()
        const formData = new FormData();
        formData.append('name', document.getElementById('name').value);
        formData.append('email', document.getElementById('email').value);
        formData.append('image', document.getElementById('photo').files[0]);
    
        updateSettings(formData, 'data');
    });

if(updatePasswordForm)
    updatePasswordForm.addEventListener('submit', async e => {
        e.preventDefault()
        document.querySelector('.save-password-btn').textContent = 'Updating..';
        const currentPassword = document.getElementById('password-current').value;
        const password = document.getElementById('password').value;
        const passwordConfirm = document.getElementById('password-confirm').value;
    
        await updateSettings({currentPassword, password, passwordConfirm}, 'password'); //since the updateSettings is async then it will return a promise, so we can await to clear the form field inorder to complete the execution
        
        document.getElementById('password-current').value = '';
        document.getElementById('password').value = '';
        document.getElementById('password-confirm').value = '';
        document.querySelector('.save-password-btn').textContent = 'Save Password';
    });
    
if(bookBtn) 
    bookBtn.addEventListener('click', async e => {
        e.target.textContent = 'Processing...';
        const {tourId} = e.target.dataset;  //auto camelcase
        bookTour(tourId);
    
    })