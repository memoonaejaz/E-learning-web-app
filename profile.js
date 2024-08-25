document.addEventListener('DOMContentLoaded', () => {
    const profilePicture = document.getElementById('profilePicture');
    const avatarInput = document.getElementById('avatarInput');
    const changeAvatarButton = document.getElementById('changeAvatar');
    const profileForm = document.getElementById('profileForm');
    const userName = document.getElementById('userName');
    const userEmail = document.getElementById('userEmail');
    const enrolledCoursesList = document.getElementById('enrolledCoursesList');

    // Load user profile information
    firebase.auth().onAuthStateChanged(user => {
        if (user) {
            const userId = user.uid;

            firebase.firestore().collection('users').doc(userId).get().then(doc => {
                if (doc.exists) {
                    const userData = doc.data();
                    userName.textContent = userData.name || 'John Doe';
                    userEmail.textContent = userData.email || 'john.doe@example.com';
                    profilePicture.src = userData.profilePicture || 'default-avatar.png';
                    document.getElementById('name').value = userData.name || '';
                    document.getElementById('email').value = userData.email || '';
                    document.getElementById('bio').value = userData.bio || '';
                }
            });

            // Load enrolled courses
            firebase.firestore().collection('enrollments').where('userId', '==', userId).get().then(snapshot => {
                snapshot.forEach(doc => {
                    const courseId = doc.data().courseId;
                    firebase.firestore().collection('courses').doc(courseId).get().then(courseDoc => {
                        if (courseDoc.exists) {
                            const course = courseDoc.data();
                            const li = document.createElement('li');
                            li.textContent = course.title;
                            enrolledCoursesList.appendChild(li);
                        }
                    });
                });
            });
        }
    });

    // Change profile picture
    changeAvatarButton.addEventListener('click', () => {
        avatarInput.click();
    });

    avatarInput.addEventListener('change', (e) => {
        const file = e.target.files[0];
        if (file) {
            const storageRef = firebase.storage().ref(`profile_pictures/${firebase.auth().currentUser.uid}`);
            storageRef.put(file).then(() => {
                storageRef.getDownloadURL().then(url => {
                    profilePicture.src = url;
                    // Update user profile picture URL in Firestore
                    firebase.firestore().collection('users').doc(firebase.auth().currentUser.uid).update({ profilePicture: url });
                });
            });
        }
    });

    // Handle profile form submission
    profileForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const name = document.getElementById('name').value;
        const email = document.getElementById('email').value;
        const bio = document.getElementById('bio').value;

        firebase.firestore().collection('users').doc(firebase.auth().currentUser.uid).update({
            name,
            email,
            bio
        }).then(() => {
            alert('Profile updated successfully!');
        }).catch(error => {
            console.error('Error updating profile:', error);
        });
    });
});
