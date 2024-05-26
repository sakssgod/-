/* itw-2023/2024
grupo:06
jiayi li 62244 PL25
Oujie Wu 62228 PL25
Adriano Neves 62242 PL21 */


document.addEventListener('DOMContentLoaded', function() {
    const accountInput = document.getElementById('account');
    const emailInput = document.getElementById('email'); // 新增
    const ageInput = document.getElementById('age'); // 新增
    const passwordInput = document.getElementById('password');
    const confirmPasswordInput = document.getElementById('confirmPassword');
    const deleteAccountInput = document.getElementById('deleteAccount');
    const genderInputs = document.querySelectorAll('input[name="gender"]'); // 新增

    // 禁止使用空格注册，无效化空格
    function removeSpaces(event) {
        event.target.value = event.target.value.replace(/\s+/g, '');
    }

    accountInput.addEventListener('input', removeSpaces);
    passwordInput.addEventListener('input', removeSpaces);
    confirmPasswordInput.addEventListener('input', removeSpaces);
    deleteAccountInput.addEventListener('input', removeSpaces);

    const avatarButton = document.getElementById('avatarButton'); // 获取按钮元素
    const avatarOptions = document.getElementById('avatarOptions'); // 获取替代模态窗口的div
    const closeBtn = document.querySelector('.avatar-div .close'); // 获取关闭按钮元素
    const selectedAvatarImg = avatarButton.querySelector('img'); // 获取按钮中的图片元素
    let selectedAvatar = null; // 用于存储选定的头像数据

    // 当按钮被点击时，显示div
    avatarButton.addEventListener('click', function() {
        avatarOptions.style.display = 'block';
    });

    // 当关闭按钮被点击时，隐藏div
    closeBtn.addEventListener('click', function() {
        avatarOptions.style.display = 'none';
    });

    // 为每个头像图片添加点击事件
    document.querySelectorAll('.avatar').forEach(img => {
        img.addEventListener('click', function() {
            // 移除所有头像图片的选中样式
            document.querySelectorAll('.avatar').forEach(avatar => avatar.classList.remove('selected'));
            // 为点击的头像图片添加选中样式
            img.classList.add('selected');
            // 将选定的头像数据存储在 selectedAvatar 变量中
            selectedAvatar = img.dataset.avatar;
            // 将选定的头像图片显示在按钮中
            selectedAvatarImg.src = img.src;
            // 隐藏div
            avatarOptions.style.display = 'none';
        });
    });

    // 注册运行逻辑
    document.getElementById('registerForm').addEventListener('submit', function(event) {
        event.preventDefault();

        // 获取输入值并去除前后空格
        const account = accountInput.value.trim();
        const email = emailInput.value.trim(); // 新增
        const age = ageInput.value.trim(); // 新增
        const password = passwordInput.value.trim();
        const confirmPassword = confirmPasswordInput.value.trim();
        let gender = ''; // 新增
        genderInputs.forEach(input => { // 新增
            if (input.checked) {
                gender = input.value;
            }
        });

        // 检查是否为空
        if (account === '' || email === '' || age === '' || password === '' || confirmPassword === '' || gender === '' || !selectedAvatar) {
            alert('All fields are required!');
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

        users.push({ account: account, email: email, age: age, gender: gender, avatar: selectedAvatar, password: password }); // 修改
        localStorage.setItem('users', JSON.stringify(users));

        alert('User registered successfully!');
        displayUsers();
        document.getElementById('registerForm').reset();
    });

    // 回到登录页面
    document.getElementById('backToLogin').addEventListener('click', function() {
        window.location.href = 'login.html';
    });

    // 删除用户信息
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

    // 显示用户信息
    function displayUsers() { // 修改
        const users = JSON.parse(localStorage.getItem('users')) || [];
        const userList = document.getElementById('userList');
        userList.innerHTML = '';
        users.forEach(user => {
            const li = document.createElement('li');
            li.textContent = `Account: ${user.account}, Email: ${user.email}, Age: ${user.age}, Gender: ${user.gender}, Avatar: ${user.avatar}`; // 修改
            li.style.margin = '10px 0'; // 新增
            userList.appendChild(li);
        });
    }

    // 清空输入字段
    accountInput.value = '';
    emailInput.value = ''; // 新增
    ageInput.value = ''; // 新增
    passwordInput.value = '';
    confirmPasswordInput.value = '';
    deleteAccountInput.value = '';

    displayUsers();
});
