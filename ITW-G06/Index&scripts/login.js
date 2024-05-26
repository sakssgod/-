document.addEventListener('DOMContentLoaded', function() {
    document.getElementById('loginForm').addEventListener('submit', function(event) {
        event.preventDefault();

        const account = document.getElementById('loginAccount').value;
        const password = document.getElementById('loginPassword').value;

        const users = JSON.parse(localStorage.getItem('users')) || [];
        const user = users.find(user => user.account === account && user.password === password);

        if (user) {
            // Filter the avatar path
            const filteredAvatarPath = user.avatar.replace(/^avatar/, '');
            localStorage.setItem('loggedInUser', account); // Store logged-in user
            localStorage.setItem('loggedInUserAvatar', filteredAvatarPath); // Store filtered logged-in user avatar
            alert('Login successful!');
            window.location.href = 'Gamepage2.html'; // Redirect to home page or any other page
        } else {
            alert('Invalid account or password!');
        }
    });

    //delte user information."
    document.getElementById('deleteUserForm').addEventListener('submit', function(event) {
        event.preventDefault();

        const accountToDelete = document.getElementById('deleteAccount').value;

        let users = JSON.parse(localStorage.getItem('users')) || [];
        const updatedUsers = users.filter(user => user.account !== accountToDelete);

        if (users.length === updatedUsers.length) {
            alert('Account not found!');
        } else {
            localStorage.setItem('users', JSON.stringify(updatedUsers));
            alert('User deleted successfully!');
            displayUsers();
        }

        document.getElementById('deleteUserForm').reset();
    });

    //Display user information
    function displayUsers() {
        const users = JSON.parse(localStorage.getItem('users')) || [];
        const userList = document.getElementById('userList');
        userList.innerHTML = '';
        users.forEach(user => {
            const li = document.createElement('li');
            li.textContent = `Account: ${user.account}`;
            userList.appendChild(li);
        });
    }

    displayUsers();

});
