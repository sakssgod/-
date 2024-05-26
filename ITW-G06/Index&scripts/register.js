document.addEventListener('DOMContentLoaded', function() {
    const accountInput = document.getElementById('account');
    const emailInput = document.getElementById('email'); // addition
    const ageInput = document.getElementById('age'); // addition
    const passwordInput = document.getElementById('password');
    const confirmPasswordInput = document.getElementById('confirmPassword');
    const deleteAccountInput = document.getElementById('deleteAccount');
    const genderInputs = document.querySelectorAll('input[name="gender"]'); // addition

    // "Prohibited to use spaces for registration, spaces will be invalidated."
    function removeSpaces(event) {
        event.target.value = event.target.value.replace(/\s+/g, '');
    }

    accountInput.addEventListener('input', removeSpaces);
    passwordInput.addEventListener('input', removeSpaces);
    confirmPasswordInput.addEventListener('input', removeSpaces);
    deleteAccountInput.addEventListener('input', removeSpaces);

    const avatarButton = document.getElementById('avatarButton'); // Retrieve button element
    const avatarOptions = document.getElementById('avatarOptions'); // Get a div to replace a modal window
    const closeBtn = document.querySelector('.avatar-div .close'); // Retrieve the close button element
    const selectedAvatarImg = avatarButton.querySelector('img'); // Retrieve the image element within the button
    let selectedAvatar = null; // Used for storing selected avatar data.

    // When the button is clicked, display the div.
    avatarButton.addEventListener('click', function() {
        avatarOptions.style.display = 'block';
    });

    // Hide the div when the close button is clicked.
    closeBtn.addEventListener('click', function() {
        avatarOptions.style.display = 'none';
    });

    // Add a click event to each avatar image
    document.querySelectorAll('.avatar').forEach(img => {
        img.addEventListener('click', function() {
            // Remove the selected style from all avatar images.
            document.querySelectorAll('.avatar').forEach(avatar => avatar.classList.remove('selected'));
            // Add selected style to clicked avatar image
            img.classList.add('selected');
            // "Store the selected avatar data in the selectedAvatar variable
            selectedAvatar = img.dataset.avatar;
            // Display the selected profile picture in the button
            selectedAvatarImg.src = img.src;
            // Hidden div
            avatarOptions.style.display = 'none';
        });
    });

    // Register operation logic
    document.getElementById('registerForm').addEventListener('submit', function(event) {
        event.preventDefault();

        // Retrieve input values and trim leading and trailing spaces.
        const account = accountInput.value.trim();
        const email = emailInput.value.trim(); // addition
        const age = ageInput.value.trim(); // addition
        const password = passwordInput.value.trim();
        const confirmPassword = confirmPasswordInput.value.trim();
        let gender = ''; // addition
        genderInputs.forEach(input => { // addition
            if (input.checked) {
                gender = input.value;
            }
        });

        // Check if it is empty
        if (account === '' || email === '' || age === '' || password === '' || confirmPassword === '' || gender === '' || !selectedAvatar) {
            alert('All fields are required!');
            return;
        }

        // Check if the password matches
        if (password !== confirmPassword) {
            alert('Passwords do not match!');
            return;
        }

        let users = JSON.parse(localStorage.getItem('users')) || [];

        if (users.find(user => user.account === account)) {
            alert('Account already exists!');
            return;
        }

        users.push({ account: account, email: email, age: age, gender: gender, avatar: selectedAvatar, password: password }); 
        localStorage.setItem('users', JSON.stringify(users));

        alert('User registered successfully!');
        displayUsers();
        document.getElementById('registerForm').reset();
    });

    // Return to the login page
    document.getElementById('backToLogin').addEventListener('click', function() {
        window.location.href = 'login.html';
    });

    // Delete user information
    document.getElementById('deleteUserForm').addEventListener('submit', function(event) {
        event.preventDefault();

        const accountToDelete = deleteAccountInput.value.trim();

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

    // Display user information.
    function displayUsers() { 
        const users = JSON.parse(localStorage.getItem('users')) || [];
        const userList = document.getElementById('userList');
        userList.innerHTML = '';
        users.forEach(user => {
            const li = document.createElement('li');
            li.textContent = `Account: ${user.account}, Email: ${user.email}, Age: ${user.age}, Gender: ${user.gender}, Avatar: ${user.avatar}`; // 修改
            li.style.margin = '10px 0'; 
            userList.appendChild(li);
        });
    }

    // Clear input field
    accountInput.value = '';
    emailInput.value = ''; 
    ageInput.value = ''; 
    passwordInput.value = '';
    confirmPasswordInput.value = '';
    deleteAccountInput.value = '';

    displayUsers();
});
