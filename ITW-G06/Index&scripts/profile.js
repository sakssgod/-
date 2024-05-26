document.addEventListener('DOMContentLoaded', function() {
    const loggedInUserAccount = localStorage.getItem('loggedInUser');
    const users = JSON.parse(localStorage.getItem('users')) || [];
    const user = users.find(user => user.account === loggedInUserAccount);

    if (user) {
        console.log('User found:', user);  // 调试信息

        document.getElementById('userAvatar').src = user.avatar ? `../images/${user.avatar}` : 'https://example.com/path/to/avatar.jpg';
        document.getElementById('userAccount').textContent = loggedInUserAccount;
        document.getElementById('userDob').textContent = user.age; // Assuming age is used for DOB here
        document.getElementById('userGender').textContent = user.gender;
        document.getElementById('userPassword').textContent = '********';
        document.getElementById('userEmail').innerHTML = `<ul><li>${user.email}</li></ul>`;
        document.getElementById('userPhone').textContent = '939 050 474'; // Update with actual phone if available
    } else {
        console.error('User not found in localStorage');
    }
});

function togglePassword() {
    const passwordSpan = document.getElementById('userPassword'); 
    const eyeButton = document.querySelector('.toggle-password');
    const loggedInUserAccount = localStorage.getItem('loggedInUser');
    const users = JSON.parse(localStorage.getItem('users')) || [];
    const user = users.find(user => user.account === loggedInUserAccount);

    if (user) {
        if (passwordSpan.textContent === '********') {
            passwordSpan.textContent = user.password;
            eyeButton.textContent = '🙈';
        } else {
            passwordSpan.textContent = '********';
            eyeButton.textContent = '👁️';
        }
    } else {
        console.error('User not found in localStorage');
    }
}
