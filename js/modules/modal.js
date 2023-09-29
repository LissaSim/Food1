function modal() {
    function showThanksModal(message) {
        const prevModal = document.querySelector('.modal__dialog');
        prevModal.classList.add('hide');

        openModal();
        const thanksModal = document.createElement('div');
        thanksModal.classList.add('modal__dialog');
        thanksModal.innerHTML = `
        <div class ="modal-content">
        <div class="modal__close" data-close>&times;</div>
        <div class="modal__title">${message}</div>
        </div>
        `
        document.querySelector('.modal').append(thanksModal);
        setTimeout(() => {
            thanksModal.remove();
            prevModal.classList.add('show');
            prevModal.classList.remove('hide');
            closeModal()
        }, 4000)
    }

}
module.exports = modal