import { db } from './firebase.js';
import { collection, getDocs, query, where, orderBy } from 'https://www.gstatic.com/firebasejs/9.6.1/firebase-firestore.js';

document.addEventListener('DOMContentLoaded', async () => {
    const eventsContainer = document.getElementById('events-container');
    const now = new Date();

    try {
        // Fetch upcoming events from Firestore
        const eventsSnapshot = await getDocs(
            query(
                collection(db, 'events'),
                where('date', '>=', now),
                orderBy('date', 'asc')
            )
        );

        eventsContainer.innerHTML = ''; // Clears existing content

        // Render each event in the events container
        eventsSnapshot.forEach((doc) => {
            const event = doc.data();
            const eventDate = new Date(event.date?.toMillis());

            const eventDiv = document.createElement('div');
            eventDiv.className = 'event-box';
            eventDiv.innerHTML = `
                <div class="event-image">
                    <img src="${event.image || '../../images/default-image.png'}" alt="Event Image">
                </div>
                <div class="event-details">
                    <h3>${event.title || 'Untitled Event'}</h3>
                    <h4>${event.location || 'Location not provided'}</h4>
                    <p>${event.description || 'No description available.'}</p>
                </div>
                <div class="event-time">
                    <span class="time">${eventDate.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                    <span>${eventDate.toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' })}</span>
                    <span>${eventDate.getFullYear()}</span>
                </div>
            `;

            // Append event to the container
            eventsContainer.appendChild(eventDiv);
        });

        // If there are no upcoming events to display shows the message...
        if (!eventsSnapshot.size) {
            eventsContainer.innerHTML = '<p>No upcoming events at the moment.</p>';
        }
    } catch (error) {
        console.error('Error fetching upcoming events:', error);
        eventsContainer.innerHTML = '<p>Error loading events. Please try again later.</p>';
    }
});