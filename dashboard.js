document.addEventListener('DOMContentLoaded', () => {
    const dashboardContent = document.getElementById('dashboardContent');
    const profileLink = document.getElementById('profileLink');
    const coursesLink = document.getElementById('coursesLink');
    const logoutButton = document.getElementById('logoutButton');

    // Load the profile management view
    profileLink.addEventListener('click', () => {
        loadProfile();
    });

    // Load the courses overview view
    coursesLink.addEventListener('click', () => {
        loadCourses();
    });

    // Handle logout
    logoutButton.addEventListener('click', () => {
        firebase.auth().signOut().then(() => {
            window.location.href = 'index.html';
        }).catch((error) => {
            console.error('Sign out error:', error);
        });
    });

    // Default view
    loadProfile();

    function loadProfile() {
        dashboardContent.innerHTML = `
            <h2>Profile Management</h2>
            <p>Name: <span id="userName"></span></p>
            <p>Email: <span id="userEmail"></span></p>
            <button id="editProfile">Edit Profile</button>
        `;

        const user = firebase.auth().currentUser;
        if (user) {
            document.getElementById('userName').textContent = user.displayName;
            document.getElementById('userEmail').textContent = user.email;
        }

        document.getElementById('editProfile').addEventListener('click', () => {
            // Add edit profile logic here
            alert('Edit profile functionality coming soon!');
        });
    }

    function loadCourses() {
        dashboardContent.innerHTML = `
            <h2>My Courses</h2>
            <ul id="courseList"></ul>
        `;

        const courseList = document.getElementById('courseList');

        // Assuming you have a collection 'courses' in your database
        firebase.firestore().collection('courses').where('userId', '==', firebase.auth().currentUser.uid)
            .get()
            .then(querySnapshot => {
                querySnapshot.forEach(doc => {
                    const course = doc.data();
                    const li = document.createElement('li');
                    li.textContent = course.title;
                    courseList.appendChild(li);
                });
            })
            .catch(error => {
                console.error('Error fetching courses:', error);
            });
    }
});
// handel roles

// Firebase initialization (Ensure you've initialized Firebase properly)
firebase.initializeApp(firebaseConfig);

// Get references to auth and firestore
const auth = firebase.auth();
const db = firebase.firestore();

// Check authentication and role
auth.onAuthStateChanged((user) => {
  if (user) {
    const userRef = db.collection('users').doc(user.uid);
    userRef.get().then((doc) => {
      if (doc.exists && doc.data().role === 'user') {
        // Allow access to the user dashboard
        console.log("Welcome, User");
      } else {
        // Redirect to admin dashboard if not user
        window.location.href = 'course mangement.html';
      } 
    }); 
  } else {
    // Redirect to login if not authenticated
    window.location.href = 'index.html';
  }
});

