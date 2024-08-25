const signUpButton = document.getElementById('signUpButton');
const signInButton = document.getElementById('signInButton');
const signInForm = document.getElementById('signIn');
const signUpForm = document.getElementById('signup');
const dashboard = document.getElementById('dashboard');

// Toggle between Sign Up and Sign In forms
signUpButton.addEventListener('click', function() {
    signInForm.style.display = "none";
    signUpForm.style.display = "block";
});

signInButton.addEventListener('click', function() {
    signInForm.style.display = "block";
    signUpForm.style.display = "none";
});

// document.addEventListener('DOMContentLoaded', () => {
//     const userId = localStorage.getItem('loggedInUserId');
//     if (userId) {
//         // Check user role and redirect to appropriate dashboard
//         doc(db, "users", userId).get().then((userDoc) => {
//             const userData = userDoc.data();
//             if (userData.role === 'admin') {
//                 window.location.href = 'admin-dashboard.html'; // Redirect to admin dashboard
//             } else {
//                 window.location.href = 'homepage.html'; // Redirect to user homepage
//             }
//         });
//     }
// });


// testing
const functions = require('firebase-functions');
const admin = require('firebase-admin');
admin.initializeApp();

// Cloud function for sending notifications on course update
exports.sendCourseUpdateNotification = functions.firestore
    .document('courses/{courseId}')
    .onUpdate((change, context) => {
        const courseId = context.params.courseId;
        const newValue = change.after.data();
        const previousValue = change.before.data();

        if (JSON.stringify(newValue) !== JSON.stringify(previousValue)) {
            const message = `The course "${newValue.title}" has been updated.`;

            return admin.firestore().collection('users').get().then(snapshot => {
                snapshot.forEach(userDoc => {
                    const userId = userDoc.id;

                    // Add in-app notification
                    admin.firestore().collection('notifications').add({
                        userId,
                        title: 'Course Update',
                        message,
                        createdAt: admin.firestore.FieldValue.serverTimestamp()
                    });

                    // Send email notification (using SendGrid or other email service)
                    // emailService.send({
                    //     to: userDoc.data().email,
                    //     subject: 'Course Update',
                    //     text: message
                    // });
                });
            });
        }

        return null;
    });

