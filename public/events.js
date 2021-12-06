/********** [ EVENT LISTENERS ] **********/

let openPopupButtons = document.querySelectorAll('[data-popup-target]');
let closePopupButtons = document.querySelectorAll('[data-close-button]');
let overlay = document.getElementById('overlay');

openPopupButtons.forEach(button => {
    button.addEventListener('click', () => {
        let popup = document.querySelector(button.dataset.popupTarget);
        openPopup(popup);
    });
});

overlay.addEventListener('click', () => {
    let popups = document.querySelectorAll('.popup.active')
    popups.forEach(popup => {
      closePopup(popup);
    });
});

closePopupButtons.forEach(button => {
    button.addEventListener('click', () => {
        let popup = button.closest('.popup');
        closePopup(popup);
    });
});

function openPopup(popup) {
    if (popup == null) return;
    popup.classList.add('active');
    overlay.classList.add('active');
}

function closePopup(popup) {
    if (popup == null) return;
    popup.classList.remove('active');
    overlay.classList.remove('active');
}
