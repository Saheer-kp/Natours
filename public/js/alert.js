

const hideAlert = () => {
    const alertEl = document.querySelector('.alert');
    if(alertEl)
        alertEl.parentElement.removeChild(alertEl);

}
export const showAlert = (type, msg) => {
    hideAlert();
    const alert = `<div class="alert alert--${type}">${msg} </div>`;
    document.querySelector('body').insertAdjacentHTML('afterbegin', alert);
    window.setTimeout(hideAlert, 1500);
}