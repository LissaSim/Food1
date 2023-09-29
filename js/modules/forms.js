function forms() {
    const forms = document.querySelectorAll('form');
    const messages = {
        loading: 'Загрузка...',
        success: 'Спасибо! Мы скоро с вами свяжемся',
        fail: 'Что-то пошло не так...'
    }

    forms.forEach(item => {
        bindPostData(item)
    })

    const postData = async (url, data) => {
        const res = await fetch(url, {
            method: "POST",
            headers: {
                'Content-type': 'application/json',
            },
            body: data
        })
        return await res.json()
    }

    function bindPostData(form) {
        form.addEventListener('submit', (event) => {
            event.preventDefault();
            const statusMessages = document.createElement('div');
            statusMessages.classList.add('status');
            statusMessages.textContent = messages.loading;
            form.append(statusMessages);

            const formData = new FormData(form);

            const json = JSON.stringify(Object.fromEntries(formData.entries()))

            postData('http://localhost:3000/requests', json)
                .then(data => {
                    console.log(data)
                    showThanksModal(messages.success);
                    statusMessages.remove()
                }).catch(() => {
                showThanksModal(messages.fail)
            }).finally(() => {
                form.reset();
            })
        })
    }

}

module.exports = forms