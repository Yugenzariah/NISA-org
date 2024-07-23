// Upcoming events "Show more" button
document.getElementById('toggle-events').addEventListener('click', function () {
    let container = document.getElementById('events-container');
    if (container.style.maxHeight) {
        container.style.maxHeight = null;
        this.textContent = 'Show More';
    } else {
        container.style.maxHeight = container.scrollHeight + 'px';
        this.textContent = 'Show Less';
    }
});

// Smooth scrolling for home navigation
document.getElementById('home-link').addEventListener('click', function (event) {
    event.preventDefault();
    window.scrollTo({
        top: 0,
        behavior: 'smooth'
    });
});