document.addEventListener('DOMContentLoaded', () => {
    const adminContent = document.getElementById('adminContent');
    const addCourseLink = document.getElementById('addCourseLink');
    const manageCoursesLink = document.getElementById('manageCoursesLink');

    // Load the add course form
    addCourseLink.addEventListener('click', () => {
        loadAddCourseForm();
    });

    // Load the manage courses view
    manageCoursesLink.addEventListener('click', () => {
        loadManageCourses();
    });

    // Default view
    loadAddCourseForm();

    function loadAddCourseForm() {
        adminContent.innerHTML = `
            <h2>Add New Course</h2>
            <form id="addCourseForm">
                <label for="courseTitle">Course Title:</label>
                <input type="text" id="courseTitle" required>

                <label for="courseCategory">Category:</label>
                <select id="courseCategory">
                    <option value="development">Development</option>
                    <option value="design">Design</option>
                    <option value="marketing">Marketing</option>
                </select>

                <label for="courseTags">Tags (comma separated):</label>
                <input type="text" id="courseTags">

                <label for="courseDescription">Course Description:</label>
                <textarea id="courseDescription" rows="5" required></textarea>

                <label for="courseVideo">Course Video URL:</label>
                <input type="url" id="courseVideo">

                <label for="coursePDF">PDF File URL:</label>
                <input type="url" id="coursePDF">

                <button type="submit">Add Course</button>
            </form>
        `;

        document.getElementById('addCourseForm').addEventListener('submit', (e) => {
            e.preventDefault();
            const title = document.getElementById('courseTitle').value;
            const category = document.getElementById('courseCategory').value;
            const tags = document.getElementById('courseTags').value.split(',');
            const description = document.getElementById('courseDescription').value;
            const video = document.getElementById('courseVideo').value;
            const pdf = document.getElementById('coursePDF').value;

            // Save course to Firestore
            firebase.firestore().collection('courses').add({
                title, category, tags, description, video, pdf, createdAt: firebase.firestore.FieldValue.serverTimestamp()
            }).then(() => {
                alert('Course added successfully!');
                loadManageCourses();
            }).catch(error => {
                console.error('Error adding course:', error);
            });
        });
    }

    function loadManageCourses() {
        adminContent.innerHTML = `
            <h2>Manage Courses</h2>
            <ul class="course-list" id="courseList"></ul>
        `;

        const courseList = document.getElementById('courseList');

        firebase.firestore().collection('courses').orderBy('createdAt', 'desc')
            .get()
            .then(querySnapshot => {
                querySnapshot.forEach(doc => {
                    const course = doc.data();
                    const li = document.createElement('li');
                    li.innerHTML = `
                        <span>${course.title}</span>
                        <div class="course-actions">
                            <button class="edit-button" onclick="editCourse('${doc.id}')">Edit</button>
                            <button onclick="deleteCourse('${doc.id}')">Delete</button>
                        </div>
                    `;
                    courseList.appendChild(li);
                });
            }).catch(error => {
                console.error('Error fetching courses:', error);
            });
    }
});

function editCourse(courseId) {
    const adminContent = document.getElementById('adminContent');

    firebase.firestore().collection('courses').doc(courseId).get().then(doc => {
        const course = doc.data();

        adminContent.innerHTML = `
            <h2>Edit Course</h2>
            <form id="editCourseForm">
                <label for="courseTitle">Course Title:</label>
                <input type="text" id="courseTitle" value="${course.title}" required>

                <label for="courseCategory">Category:</label>
                <select id="courseCategory">
                    <option value="development" ${course.category === 'development' ? 'selected' : ''}>Development</option>
                    <option value="design" ${course.category === 'design' ? 'selected' : ''}>Design</option>
                    <option value="marketing" ${course.category === 'marketing' ? 'selected' : ''}>Marketing</option>
                </select>

                <label for="courseTags">Tags (comma separated):</label>
                <input type="text" id="courseTags" value="${course.tags.join(',')}">

                <label for="courseDescription">Course Description:</label>
                <textarea id="courseDescription" rows="5" required>${course.description}</textarea>

                <label for="courseVideo">Course Video URL:</label>
                                <input type="url" id="courseVideo" value="${course.video}">

                <label for="coursePDF">PDF File URL:</label>
                <input type="url" id="coursePDF" value="${course.pdf}">

                <button type="submit">Save Changes</button>
            </form>
        `;

        document.getElementById('editCourseForm').addEventListener('submit', (e) => {
            e.preventDefault();
            const title = document.getElementById('courseTitle').value;
            const category = document.getElementById('courseCategory').value;
            const tags = document.getElementById('courseTags').value.split(',');
            const description = document.getElementById('courseDescription').value;
            const video = document.getElementById('courseVideo').value;
            const pdf = document.getElementById('coursePDF').value;

            // Update course in Firestore
            firebase.firestore().collection('courses').doc(courseId).update({
                title, category, tags, description, video, pdf
            }).then(() => {
                alert('Course updated successfully!');
                loadManageCourses();
            }).catch(error => {
                console.error('Error updating course:', error);
            });
        });
    }).catch(error => {
        console.error('Error fetching course data:', error);
    });
}

function deleteCourse(courseId) {
    if (confirm('Are you sure you want to delete this course?')) {
        firebase.firestore().collection('courses').doc(courseId).delete().then(() => {
            alert('Course deleted successfully!');
            loadManageCourses();
        }).catch(error => {
            console.error('Error deleting course:', error);
        });
    }
}
// handle roles
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
      if (doc.exists && doc.data().role === 'admin') {
        // Allow access to the admin dashboard
        console.log("Welcome, Admin");
      } else {
        // Redirect to user dashboard if not admin
        window.location.href = 'dashboard.html';
      }
    });
  } else {
    // Redirect to login if not authenticated
    window.location.href = 'index.html';
  }
});
