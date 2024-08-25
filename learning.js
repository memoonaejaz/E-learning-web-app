document.addEventListener('DOMContentLoaded', () => {
    const videoPlayer = document.getElementById('videoPlayer');
    const markAsCompleted = document.getElementById('markAsCompleted');
    const quizContainer = document.getElementById('quizContainer');
    const submitQuiz = document.getElementById('submitQuiz');
    const progressTracker = document.getElementById('progressTracker');
    const generateCertificate = document.getElementById('generateCertificate');

    // Video Lecture Mark as Completed
    markAsCompleted.addEventListener('click', () => {
        const userId = firebase.auth().currentUser.uid;
        const courseId = 'sampleCourseId'; // Replace with actual course ID

        firebase.firestore().collection('courseProgress').doc(`${userId}_${courseId}`).set({
            videoCompleted: true
        }, { merge: true }).then(() => {
            alert('Video marked as completed!');
        }).catch(error => {
            console.error('Error marking video as completed:', error);
        });
    });

    // Load Quiz
    loadQuiz();

    function loadQuiz() {
        quizContainer.innerHTML = `
            <div class="question">
                <h3>What is the capital of France?</h3>
                <ul>
                    <li><input type="radio" name="q1" value="Berlin"> Berlin</li>
                    <li><input type="radio" name="q1" value="Madrid"> Madrid</li>
                    <li><input type="radio" name="q1" value="Paris"> Paris</li>
                    <li><input type="radio" name="q1" value="Rome"> Rome</li>
                </ul>
            </div>
        `;
    }

    // Submit Quiz
    submitQuiz.addEventListener('click', () => {
        const userId = firebase.auth().currentUser.uid;
        const courseId = 'sampleCourseId'; // Replace with actual course ID

        const selectedAnswer = document.querySelector('input[name="q1"]:checked').value;

        firebase.firestore().collection('courseProgress').doc(`${userId}_${courseId}`).set({
            quizCompleted: true,
            quizScore: selectedAnswer === 'Paris' ? 100 : 0
        }, { merge: true }).then(() => {
            alert('Quiz submitted successfully!');
            loadProgress();
        }).catch(error => {
            console.error('Error submitting quiz:', error);
        });
    });

    // Load Progress
    function loadProgress() {
        const userId = firebase.auth().currentUser.uid;
        const courseId = 'sampleCourseId'; // Replace with actual course ID

        firebase.firestore().collection('courseProgress').doc(`${userId}_${courseId}`).get()
            .then(doc => {
                if (doc.exists) {
                    const progress = doc.data();
                    progressTracker.innerHTML = `
                        <p>Video Completed: ${progress.videoCompleted ? 'Yes' : 'No'}</p>
                        <p>Quiz Completed: ${progress.quizCompleted ? 'Yes' : 'No'}</p>
                        <p>Quiz Score: ${progress.quizScore}</p>
                    `;
                } else {
                    progressTracker.innerHTML = '<p>No progress yet.</p>';
                }
            }).catch(error => {
                console.error('Error loading progress:', error);
            });
    }

    // Generate Certificate
    generateCertificate.addEventListener('click', () => {
        const userId = firebase.auth().currentUser.uid;
        const courseId = 'sampleCourseId'; // Replace with actual course ID

        firebase.firestore().collection('courseProgress').doc(`${userId}_${courseId}`).get()
            .then(doc => {
                if (doc.exists) {
                    const progress = doc.data();
                    if (progress.videoCompleted && progress.quizCompleted && progress.quizScore === 100) {
                        generateCertificatePDF(userId, courseId);
                    } else {
                        alert('Complete all parts of the course to receive a certificate.');
                    }
                }
            }).catch(error => {
                console.error('Error checking progress for certificate:', error);
            });
    });

    function generateCertificatePDF(userId, courseId) {
        const pdf = new jsPDF();
        pdf.text(20, 20, `Certificate of Completion`);
        pdf.text(20, 30, `Awarded to: ${firebase.auth().currentUser.displayName}`);
        pdf.text(20, 40, `For successfully completing the course.`);
        pdf.save('certificate.pdf');
        alert('Certificate generated successfully!');
    }

    // Initial load
    loadProgress();
});
