let loggedInTemplate = `
            <div>
                <div class="mui-appbar" style="display: flex;">
                    <div style="display:flex;flex: 1;justify-content: start;">
                        <span style="display: flex;">
                            <h3>Teater</h3>
                        </span>
                    </div>
                    <div style="display:flex;flex: 1;justify-content: start;flex-direction:row;">
                        <div class='mui-textfield' style="display:flex;">
                            <div style="display:flex;margin:auto;">#</div>
                                <input type="text" style="display:flex;color:white;" placeholder='search' class='search' onchange='changeSearch()'/>
                                <div class="clear" style="display:none;border-bottom:1px solid rgba(0,0,0,.26)" onclick='clearText()'>x</i></div>
                        </div>
                    </div>
                    <!-- 
                    <div style="display: flex;">
                        <i class="fa fa-trash" onclick="localStorage.removeItem('teats')" style="display: flex;"></i>
                    </div>
                    -->
                        <div style="display: flex;">
                        <i class="fa fa-edit" onclick="addNew()" style="display: flex;"></i>
                    </div>
                    
                    <div class="mui-dropdown" style="display:flex;">
                        <span id="btn-dropdown-user" class="mui-btn mui-btn--primary"
                            style="display: flex;justify-content: center;margin: auto;" onclick="toggleDropdown()"
                            data-mui-toggle="dropdown">
                            <span class="mui-label user-display-name" name="user-name" style="padding-right:10px;">Name</span>
                            <img
                                name="user-photo" src="images/avatar.png" alt="User Photo" style="width: 35px;height:35px;" />
                        </span>
                        <ul class="mui-dropdown__menu mui-dropdown__menu">
                            <li onclick="toggleDropdown();logOut();"><a href="#">Logout</a></li>
                        </ul>
                    </div>
                </div>
                <div style="display: flex;">
                    <div class="mui-container-fluid" style="display: flex;flex: 1;flex-direction: column;height: 90vh;">
                        <div class="mui--text-title" style="display: flex; flex: 1;">
                            Trending
                        </div>
                        <div class="mui--text-body hashtag-clickable-text" style="display: flex;flex-direction: column;flex: 80;">
                        </div>
                    </div>
                    <div class="mui--divider-left"></div>
                    <div class="mui-container-fluid posts-container" style="display: flex;flex: 4;flex-direction: column;">
                    </div>
                </div>
            </div>
            <style>
                #btn-dropdown-user:hover,
                #btn-dropdown-user:focus,
                #btn-dropdown-user:active {
                    background-color: inherit !important;
                    color: inherit !important;
                    border: none !important;
                }

                .post-container {
                    display: flex;
                    flex-direction: column;
                    flex: 1;
                    border-bottom: 1px solid gray;
                    max-height: 50px;
                    padding: 20px 10px;
                }

                .post-avatar {
                    display: flex;
                    width: 25px;
                    height: 25px;
                }

                .fa {
                    font-size: 32px;
                    color: #fff;
                    margin: auto;
                }
            </style>
            `;
function clearText() {
    document.querySelector('.search').value = '';
    document.querySelector('.clear').style.display = 'none';
    renderMessages(false);
}
function changeSearch() {
    let val = document.querySelector('.search').value;
    document.querySelector('.clear').style.display = 'block';
    val ? renderMessages(val) : renderMessages(false);
}
async function toggleDropdown() {
    document.getElementsByClassName('mui-dropdown__menu')[0].classList.contains('mui--is-open')
        ? document.getElementsByClassName('mui-dropdown__menu')[0].classList.remove('mui--is-open')
        : document.getElementsByClassName('mui-dropdown__menu')[0].classList.add('mui--is-open');
}
async function addNew() {
    let messages = await localStorage.getItem('teats');
    let user = await localStorage.getItem('session_id');
    let json_user = user ? JSON.parse(user) : {};
    console.log(json_user, 'user');
    let json_messages = messages ? JSON.parse(messages) : { 'posts': [] };
    let message = await prompt("New Tea", "Down for some tea..?");
    let msg = {
        "userName": json_user.userName,
        "message": message,
        "created_at": new Date().getTime(),
    }
    if (msg.message) {
        json_messages.posts.push(msg);
    }
    await localStorage.setItem('teats', JSON.stringify(json_messages));
    renderMessages();
}
async function renderMessages(hashtag = false) {

    document.querySelector('.posts-container').innerHTML = '';
    document.querySelector('.hashtag-clickable-text').innerHTML = '';
    let user = await localStorage.getItem('session_id');
    console.log(user, 'string_user');
    let json_user = user ? JSON.parse(user) : {};
    console.log(json_user, 'json_user');
    document.querySelector('.user-display-name').textContent = json_user.name;
    let messages = await localStorage.getItem('teats');
    console.log(messages, 'teats');
    let json_messages = messages ? JSON.parse(messages) : { 'posts': [] };
    let bigString;
    json_messages.posts.forEach((element) => {
        bigString += ' ' + element.message;
    });
    let stopwords = ['what', 'who', 'is', 'a', 'at', 'is', 'he', 'was', 'are', 'for', 'undefined', 'some', undefined];
    let counts = [];
    var arr = bigString.split(' ');
    for (element in arr) {
        console.log(arr[element] == undefined, typeof arr[element], arr[element] in counts, counts)
        if (arr[element] == 'undefined') {
            continue;
        }
        if (arr[element] in stopwords || !arr[element]) {
            continue;
        }
        else if (arr[element] in counts) {
            counts[arr[element]] += 1;
        } else {
            counts[arr[element]] = 1;
        }
    }
    if (hashtag) {

        json_messages.posts = json_messages.posts.filter((el) => {
            return el.message.includes(hashtag);
        });
    };
    console.log(counts, 'count')
    let counts2 = counts.sort((a, b) => { return parseInt(a) < parseInt(b); });

    console.log(counts2, 'counts');
    for (count in counts.sort((a, b) => { return parseInt(a) < parseInt(b); })) {
        let div = document.createElement('div');
        div.innerHTML = `
                <a class='clickable-hashtag' onclick="document.querySelector('.search').value='${count}';document.querySelector('.search').onchange();">
                    #${count}
                </a>
                `;
        document.querySelector('.hashtag-clickable-text').appendChild(div);
    };
    if (json_messages.posts.length > 1) {
        json_messages.posts = json_messages.posts.sort((a, b) => { return a.created_at < b.created_at; });
    }
    for (json_message in json_messages.posts) {
        console.log(json_messages.posts[json_message]);

        let div = document.createElement('div');
        div.classList.add('post-container');
        console.log(json_messages.posts[json_message], 'message');
        div.innerHTML = `
                <div style="display: flex;flex-direction: column;flex:1;">
                    <div style="display: flex;">
                        <img src="images/avatar.png" class="post-avatar" />
                        <b>${json_messages.posts[json_message].userName}</b>
                    </div>
                </div>
                <div style="display: flex;flex-direction: row;margin-bottom: 10px;">
                    ${json_messages.posts[json_message].message}
                </div>
                <div style="display: flex;flex-direction: row;font-size:10px;color:gray;">
                Posted at ${Date(json_messages.posts[json_message].created_at).toLocaleString()}    
                </div>
            `;

        document.querySelector('.posts-container').appendChild(div);
    }
}
async function checkIfLoggedIn() {
    document.querySelector('.alerts') ? document.querySelector('.alerts').innerHTML = '' : '';
    document.addEventListener('change input', () => {
        document.querySelector('.alerts').innerHTML = '';
    });
    let loggedIn = await localStorage.getItem('session_id');
    if (loggedIn) {
        document.getElementsByTagName('body')[0].innerHTML = loggedInTemplate;
        renderMessages(false);

    } else {
        let nonLoggedInTemplate = `
                <div class="mui-container" style="display:flex;flex-direction:column;width: 35%;">
                    <div style="display: flex;justify-content: center;">
                        <img src="images/avatar.png" class="post-avatar" alt=""
                            style="border-radius: 50%;width: 150px;height: 150px;"></img>
                    </div>
                    <div style="display: flex;justify-content: center;flex-direction: column;">
                        <label for="name" class="mui-textfield--float-label name-user-label"><b>Name</b></label>
                        <input type="text" class="mui-textfield name-user" placeholder="Enter Name" name="name" required>
                        <label for="uname" class="mui-textfield--float-label"><b>Username</b></label>
                        <input type="text" class="mui-textfield" placeholder="Enter Username" name="uname" required>
                        <label for="psw"><b>Password</b></label>
                        <input type="password" class="mui-textfield" placeholder="Enter Password" name="psw" required>
                        <div class="alerts">
                        </div>
                    </div>
                    <div style="display: flex;justify-content: center;flex-direction: row;">
                    <button type="button" style="flex:1" class="mui-btn mui-btn--primary btn-login" onclick="logIn()">Login</button>
                    <button type="button" style="flex:1" class="mui-btn mui-btn--flat btn-pre-signup" onclick="showSignup()">Don't have an account?</button>
                    <button type="button" class="mui-btn mui-btn--flat btn-signup-2" onclick="window.location.reload()">&lt; Back</button>
                    <button type="button" class="mui-btn mui-btn--primary btn-signup" onclick="signUp()">Signup</button>
                    </div>
                </div>
                <style>
                    .mui--alert {
                        justify-content: center;
                        background-color: rgba(236, 143, 143, 0.6);
                        display:flex;border: solid 1px #7b7272;
                        padding: 7px;
                    }
                    .name-user,.name-user-label{
                        display:none;
                    }
                    .btn-signup,.btn-signup-2{
                        display:none;
                    }
                </style>
                `;
        document.querySelector('body').innerHTML = nonLoggedInTemplate;
    }
}
async function showSignup() {
    document.querySelector('.alerts').innerHTML = '';
    document.querySelector('.btn-pre-signup').style.display = 'none';
    document.querySelector('.btn-login').style.display = 'none';
    document.querySelector('.name-user').style.display = 'flex';
    document.querySelector('.name-user-label').style.display = 'flex';
    document.querySelector('.btn-signup').style.display = 'flex';
    document.querySelector('.btn-signup-2').style.display = 'flex';
}
async function logOut() {
    await localStorage.removeItem('session_id');
    window.location.reload();
}
async function logIn() {
    document.querySelector('.alerts').innerHTML = '';
    let alertDiv = document.createElement('div');
    alertDiv.classList.add('mui--panel');
    alertDiv.classList.add('mui--alert');
    alertDiv.classList.add('mui--textfield');
    let userName = document.getElementsByName('uname')[0].value;
    let password = document.getElementsByName('psw')[0].value;
    if (!userName || !password) {
        alertDiv.textContent = "Please check your username and password";
        document.querySelector('.alerts').append(alertDiv);
        return false;
    }
    let users = await localStorage.getItem('users');
    let json_users = users ? JSON.parse(users) : { "users": [] };
    let user = json_users.users.filter((user) => { return user.userName === userName });
    console.log(json_users, userName, password, user);
    if (user.length == 0) {
        alertDiv.textContent = 'User not found';
        document.querySelector('.alerts').append(alertDiv);
        return;
    } else if (user.userName == userName && user.password != password) {
        alertDiv.textContent = 'Wrong password buddy!';
        document.querySelector('.alerts').append(alertDiv);
        return;
    } else if (user[0].userName == userName && user[0].password == password) {
        document.querySelector('body').innerHTML = loggedInTemplate;
        document.querySelector('.user-display-name').innerHTML = user.name;
        await localStorage.setItem('session_id', JSON.stringify({
            'session': userName + new Date().getTime(),
            'userName': user[0].userName,
            'name': user[0].name
        }));
        renderMessages(false);
        return;
    }
}
async function signUp() {
    document.querySelector('.alerts').innerHTML = '';
    let alertDiv = document.createElement('div');
    alertDiv.classList.add('mui--panel');
    alertDiv.classList.add('mui--alert');
    alertDiv.classList.add('mui--textfield');
    let userName = document.getElementsByName('uname')[0].value;
    let password = document.getElementsByName('psw')[0].value;
    let name = document.getElementsByName('name')[0].value;
    if (!userName || !password || !name) {
        alertDiv.textContent = "Please fill all the fields";
        document.querySelector('.alerts').append(alertDiv);
        return false;
    }
    let users = await localStorage.getItem('users');
    let json_users = users ? JSON.parse(users) : { "users": [] };
    let user = json_users.users.filter((user) => { return user.userName == userName });
    if (user.length > 0) {
        document.querySelector('.alerts').innerHTML = '';
        alertDiv.textContent = 'Can\'t allow this user name';
        document.querySelector('.alerts').parentElement.append(alertDiv);
        return;
    } else if (user.length == 0) {
        json_users.users.push({
            'userName': userName,
            'password': password,
            'name': name,
            'created_at': new Date().getTime(),
        });
        await localStorage.setItem('users', JSON.stringify(json_users));
        await localStorage.setItem('session_id', JSON.stringify({
            'session': userName + new Date().getTime(),
            'userName': userName,
            'name': name
        }));
        document.querySelector('body').innerHTML = loggedInTemplate;
        renderMessages(false);
        return;
    }
}
document.addEventListener('DOMContentLoaded', () => { checkIfLoggedIn() });