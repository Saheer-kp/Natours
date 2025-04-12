import '@babel/polyfill' //this will allow to browser to work new javascript features
import { login, logout } from "./login";
import { updateSettings } from './updateSettings';


const loginForm = document.querySelector('.form--login');
const logOutBtn = document.querySelector('.nav__el--logout');
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
    
