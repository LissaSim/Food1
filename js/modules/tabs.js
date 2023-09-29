function tabs () {
    const tabs = document.querySelectorAll('.tabheader__item'),
        tabContent = document.querySelectorAll('.tabcontent'),
        tabParent = document.querySelector('.tabheader__items');

    function hideTabContent() {
        tabContent.forEach(item => {
            item.style.display = 'none'
        });
        tabs.forEach(item => {
            item.classList.remove("tabheader__item_active")
        });
    }

    function showTabContent(i) {
        tabContent[i].style.display = "block";
        tabs[i].classList.add("tabheader__item_active")
    };

    hideTabContent();
    showTabContent(0);

    tabParent.addEventListener("click", (event) => {
        const target = event.target;

        if (target && target.classList.contains('tabheader__item')) {
            tabs.forEach((item, i) => {
                if (item == target) {
                    hideTabContent();
                    showTabContent(i);
                }
            })
        }
    })
}
export default tabs;