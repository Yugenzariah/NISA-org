import { auth, db } from './firebase.js';
import {
    collection,
    getDocs,
    query,
    orderBy,
    addDoc,
    updateDoc,
    deleteDoc,
    doc,
    getDoc,
} from 'https://www.gstatic.com/firebasejs/9.6.1/firebase-firestore.js';

document.addEventListener('DOMContentLoaded', async () => {
    const todaySection = document.getElementById('today-events');
    const upcomingSection = document.getElementById('upcoming-events');
    const pastSection = document.getElementById('past-events');
    const addEventBtn = document.getElementById('add-event-btn');
    const editEventBtn = document.getElementById('edit-event-btn');
    const deleteEventBtn = document.getElementById('delete-event-btn');
    const eventModal = document.getElementById('event-modal');
    const eventForm = document.getElementById('event-form');
    const cancelBtn = document.getElementById('cancel-btn');
    const loginBtn = document.getElementById('login-btn');
    const logoutBtn = document.getElementById('logout-btn');

    let currentUser = null;
    let selectedEventId = null;
    let autoLogoutTimer = null;

    // Check admin login
    auth.onAuthStateChanged((user) => {
        if (user) {
            auth.setPersistence('none').catch((error) => {
                console.error('Error setting persistence:', error);
            });

            user.getIdTokenResult().then((idTokenResult) => {
                if (idTokenResult.claims.admin) {
                    currentUser = user;
                    toggleAdminControls(true);
                    startAutoLogout();
                } else {
                    alert('Access denied. Admin account required.');
                    auth.signOut();
                }
            });
        } else {
            currentUser = null;
            toggleAdminControls(false);
            clearAutoLogout();
        }
    });

    // Toggles the visibility of admin controls
    function toggleAdminControls(isAdmin) {
        const adminButtons = document.querySelector('.admin-buttons');
        if (adminButtons) {
            adminButtons.style.display = isAdmin ? 'flex' : 'none';
        }
    }

    // Auto logout after 5 minutes of inactivity
    function startAutoLogout() {
        clearAutoLogout();
        autoLogoutTimer = setTimeout(() => {
            if (currentUser) {
                auth.signOut();
                alert('Session expired. You have been logged out.');
            }
        }, 5 * 60 * 1000);
    }

    function clearAutoLogout() {
        if (autoLogoutTimer) {
            clearTimeout(autoLogoutTimer);
            autoLogoutTimer = null;
        }
    }

    // Fetch and display events
    async function loadEvents() {
        todaySection.innerHTML = '';
        upcomingSection.innerHTML = '';
        pastSection.innerHTML = '';

        const now = new Date();

        try {
            const eventsSnapshot = await getDocs(query(collection(db, 'events'), orderBy('date', 'asc')));

            eventsSnapshot.forEach((doc) => {
                const event = doc.data();
                const eventDate = event.date?.toMillis
                    ? new Date(event.date.toMillis())
                    : new Date(event.date);

                const eventElement = createEventElement(event, eventDate, doc.id);

                if (eventDate.toDateString() === now.toDateString()) {
                    todaySection?.appendChild(eventElement);
                } else if (eventDate > now) {
                    upcomingSection?.appendChild(eventElement);
                } else {
                    pastSection?.appendChild(eventElement);
                }
            });
        } catch (error) {
            console.error('Error fetching events:', error);
        }
    }

    // Load events on page load
    loadEvents();

    // Show modal for adding and editing events
    function showModal(edit = false, event = null, id = null) {
        if (!currentUser) {
            alert('Admin account required to perform this action.');
            return;
        }

        eventModal.style.display = 'block';
        const modalTitle = document.getElementById('modal-title');
        modalTitle.textContent = edit ? 'Edit Event' : 'Add Event';

        const eventIdInput = document.getElementById('event-id');
        const titleInput = document.getElementById('title');
        const descriptionInput = document.getElementById('description');
        const dateInput = document.getElementById('date');
        const locationInput = document.getElementById('location');
        const imageInput = document.getElementById('image');

        if (edit && event) {
            eventIdInput.value = id;
            titleInput.value = event.title;
            descriptionInput.value = event.description;
            dateInput.value = new Date(event.date).toISOString().slice(0, 16);
            locationInput.value = event.location || '';
            imageInput.value = event.image || '';
        } else {
            eventIdInput.value = '';
            titleInput.value = '';
            descriptionInput.value = '';
            dateInput.value = '';
            locationInput.value = '';
            imageInput.value = '';
        }
    }

    // Hides modal
    cancelBtn.addEventListener('click', () => {
        eventModal.style.display = 'none';
    });

    // Add event functionality
    addEventBtn?.addEventListener('click', () => {
        showModal();
    });

    // Edit event functionality
    editEventBtn?.addEventListener('click', async () => {
        if (!selectedEventId) {
            alert('Please select an event to edit.');
            return;
        }

        try {
            const eventDoc = await getDoc(doc(db, 'events', selectedEventId));
            const event = eventDoc.data();
            showModal(true, event, selectedEventId);
        } catch (error) {
            console.error('Error fetching event:', error);
        }
    });

    // Delete event functionality
    deleteEventBtn?.addEventListener('click', async () => {
        if (!selectedEventId) {
            alert('Please select an event to delete.');
            return;
        }

        try {
            await deleteDoc(doc(db, 'events', selectedEventId));
            alert('Event deleted successfully!');
            selectedEventId = null;
            loadEvents();
        } catch (error) {
            console.error('Error deleting event:', error);
        }
    });

    // Form submission
    eventForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        const id = document.getElementById('event-id').value;
        const title = document.getElementById('title').value;
        const description = document.getElementById('description').value;
        const date = new Date(document.getElementById('date').value);
        const location = document.getElementById('location').value;
        const image = document.getElementById('image').value;

        try {
            if (id) {
                await updateDoc(doc(db, 'events', id), { title, description, date, location, image });
                alert('Event updated!');
            } else {
                await addDoc(collection(db, 'events'), { title, description, date, location, image });
                alert('Event added!');
            }
            eventModal.style.display = 'none';
            loadEvents();
        } catch (error) {
            console.error('Error saving event:', error);
        }
    });

    // Helper function to create event HTML
    function createEventElement(event, eventDate, eventId) {
        const eventDiv = document.createElement('div');
        eventDiv.className = 'event';
        eventDiv.innerHTML = `
            <img src="${event.image || 'default-image.png'}" alt="${event.title || 'Event Image'}">
            <div>
                <h3>${event.title || 'Untitled Event'}</h3>
                <h4>${event.location || 'Location not provided'}</h4>
                <p>${event.description || 'No description available.'}</p>
                <p class="event-date">${eventDate ? eventDate.toLocaleString() : 'Date not available'}</p>
            </div>
        `;

        eventDiv.addEventListener('click', () => {
            if (eventDiv.classList.contains('selected')) {
                eventDiv.classList.remove('selected');
                selectedEventId = null;
            } else {
                document.querySelectorAll('.event').forEach((el) => el.classList.remove('selected'));
                eventDiv.classList.add('selected');
                selectedEventId = eventId;
            }
        });

        return eventDiv;
    }

    // Admin login/logout handlers
    loginBtn.addEventListener('click', () => {
        window.location.href = 'admin-login.html';
    });

    logoutBtn.addEventListener('click', () => {
        auth.signOut()
            .then(() => {
                alert('Logged out successfully!');
                window.location.href = 'index.html';
            })
            .catch((error) => {
                console.error('Error logging out:', error);
            });
    });
});