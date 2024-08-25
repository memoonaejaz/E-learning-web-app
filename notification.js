document.addEventListener('DOMContentLoaded', () => {
    const notificationList = document.getElementById('notificationList');

    loadNotifications();

    function loadNotifications() {
        const userId = firebase.auth().currentUser.uid;

        firebase.firestore().collection('notifications')
            .where('userId', '==', userId)
            .orderBy('createdAt', 'desc')
            .get()
            .then(querySnapshot => {
                querySnapshot.forEach(doc => {
                    const notification = doc.data();
                    const li = document.createElement('li');
                    li.innerHTML = `
                        <strong>${notification.title}</strong>
                        <p>${notification.message}</p>
                        <small>${new Date(notification.createdAt.seconds * 1000).toLocaleString()}</small>
                    `;
                    notificationList.appendChild(li);
                });
            })
            .catch(error => {
                console.error('Error fetching notifications:', error);
            });
    }
});
