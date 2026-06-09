const expBodies = document.querySelectorAll('.exp-body');

const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add('show');
            entry.target.classList.remove('hide');
        } else {
            entry.target.classList.add('hide');
            entry.target.classList.remove('show');
        }
    });
}, {
    threshold: 0.2
});

expBodies.forEach(el => observer.observe(el));

const developerItems = document.querySelectorAll('.developer-item');

const developerItemsObserver = new IntersectionObserver((entries, observer) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add('show');
            entry.target.classList.remove('hide');
        } else {
            entry.target.classList.add('hide');
            entry.target.classList.remove('show');
        }
    });
}, {
    threshold: 0.2
});

developerItems.forEach(el => developerItemsObserver.observe(el));


