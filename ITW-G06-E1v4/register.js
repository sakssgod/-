document.addEventListener('DOMContentLoaded', function() {
    const accountInput = document.getElementById('account');
    const passwordInput = document.getElementById('password');
    const confirmPasswordInput = document.getElementById('confirmPassword');
    const deleteAccountInput = document.getElementById('deleteAccount');

    //禁止使用空格注册，无效化空格
    function removeSpaces(event) {
        event.target.value = event.target.value.replace(/\s+/g, '');
    }

    accountInput.addEventListener('input', removeSpaces);
    passwordInput.addEventListener('input', removeSpaces);
    confirmPasswordInput.addEventListener('input', removeSpaces);
    deleteAccountInput.addEventListener('input', removeSpaces);

    //注册运行逻辑
    document.getElementById('registerForm').addEventListener('submit', function(event) {
        event.preventDefault();

        // 获取输入值并去除前后空格
        const account = accountInput.value.trim();
        const password = passwordInput.value.trim();
        const confirmPassword = confirmPasswordInput.value.trim();

        // 检查是否为空
        if (account === '' || password === '' || confirmPassword === '') {
            alert('Account and password fields cannot be empty!');
            return;
        }

        // 检查密码是否匹配
        if (password !== confirmPassword) {
            alert('Passwords do not match!');
            return;
        }

        let users = JSON.parse(localStorage.getItem('users')) || [];

        if (users.find(user => user.account === account)) {
            alert('Account already exists!');
            return;
        }

        users.push({ account: account, password: password });
        localStorage.setItem('users', JSON.stringify(users));

        alert('User registered successfully!');
        displayUsers();
        document.getElementById('registerForm').reset();
    });

    //回到登录页面
    document.getElementById('backToLogin').addEventListener('click', function() {
        window.location.href = 'login.html';
    });

    //删除用户信息
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

    //显示用户信息
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

    // 清空输入字段
    accountInput.value = '';
    passwordInput.value = '';
    confirmPasswordInput.value = '';
    deleteAccountInput.value = '';

    displayUsers();

    // 添加自定义验证消息
    accountInput.addEventListener('invalid', function(event) {
        event.target.setCustomValidity('Please fill out this field.');
    });

    passwordInput.addEventListener('invalid', function(event) {
        event.target.setCustomValidity('Please fill out this field.');
    });

    confirmPasswordInput.addEventListener('invalid', function(event) {
        event.target.setCustomValidity('Please fill out this field.');
    });

    // 清除自定义验证消息
    accountInput.addEventListener('input', function(event) {
        event.target.setCustomValidity('');
    });

    passwordInput.addEventListener('input', function(event) {
        event.target.setCustomValidity('');
    });

    confirmPasswordInput.addEventListener('input', function(event) {
        event.target.setCustomValidity('');
    });
});
