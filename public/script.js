const email = document.querySelector('#email')
const userName = document.querySelector('#name')
const password = document.querySelector('#password')
const confirmPassword = document.querySelector('#confirmPassword')
const logoutBtn = document.querySelector('.nav__el--logout')
const userDataForm = document.querySelector('.form-user-data');
const userPasswordForm = document.querySelector('.form-user-settings');
const passwordCurrent = document.querySelector('#password-current');
const passwordConfirm = document.querySelector('#password-confirm');
const button = document.querySelector('.btn--save');
const userPhoto = document.querySelector('#photo');


const hideAlert = () => {
    const component = document.querySelector('.alert')
    if (component) component.parentElement.removeChild(component)
}

const showAlert = (type, msg) => {
    hideAlert
    const component = `<div class='alert alert--${type}'>${msg}</div>`
    document.querySelector('body').insertAdjacentHTML('afterbegin', component)
    window.setTimeout(hideAlert, 1500)
}

const signUpHandler = async () => {
    try {
        const emailValue = email.value
        const nameValue = userName.value
        const passwordValue = password.value
        const confirmPasswordValue = confirmPassword.value

        const response = await axios({
            method: 'POST',
            url: `/api/v1/users/signup/`,
            data: {
                name: nameValue,
                email: emailValue,
                password: passwordValue,
                confirmPassword: confirmPasswordValue
            }
        })

        const { data } = response
        if (data.status === 'success') {
            showAlert('success', 'User account successfully created.')
            setTimeout(() => {
                window.location.assign('/')
            }, 1500)
        }

    } catch (err) {
        showAlert('error', err.response.data.message)
    }
}

const loginHandler = async () => {
    try {
        const emailValue = email.value
        const passwordValue = password.value
     
        const response = await axios({
            method: 'POST',
            url: `/api/v1/users/login/`,
            data: {
                email: emailValue,
                password: passwordValue
            }
        })
        console.log(response)
        const {data} = response
        
        if (data.status === 'success') {
            showAlert('success', 'User successfully logged in.')
            setTimeout(() => {
                window.location.assign('/')
            }, 1500)
        }
    } catch (err) {
        showAlert('error', err.response.data.message)
    }
}


const logout = async () => {
    try {
        const response = await axios({
            method: 'GET',
            url: '/api/v1/users/logout'
        })

        if (response.data.status === 'success') {
            showAlert('success', 'User successfully logged out.')
            setTimeout(() => {
                window.location.assign('/');
            }, 3000)
        }

    } catch (err) {
        showAlert('error', 'Logout failed, please try again later!')
    }
}

const updateUsersData = async (email, name) => {
    try {
        const response = await axios({
            method: 'PATCH',
            url: '/api/v1/users/update-user-account',
            data: {
                email: email,
                name: name
            }
        });
        console.log(response)
        const { data } = response

        if (data.status === 'success') {
            showAlert('success', 'User data updated successfully .')
        }
    } catch (err) {
        console.log(err)
        showAlert('error', err.response.data.message)
    }
}

const updateSettings = async(data, type) => {
    try {
        const URL =
            type === 'password'
                ? '/api/v1/users/update-password'
                : '/api/v1/users/update-user-account';

        const response = await axios({
            method: 'PATCH',
            url: URL,
            data: data
        })

        if (response.data.status === 'success') {
            showAlert('success', `User ${type.toUpperCase()} Successfully updated.`)
            location.reload()
        }

    } catch (err) {
        showAlert('error', 'Personal data unsuccessfully saved.')
    }
}

const locationsEl = document.getElementById('map');

if(locationsEl) {
    const locations = JSON.parse(locationsEl.dataset.locations)

    mapboxgl.accessToken = 'pk.eyJ1Ijoic2lsYXMtODciLCJhIjoiY2xhbDFlcWswMDE0NjNwbnMyNmc3dDgxMSJ9.-yyEa1IjRL1h1HQPSfsKew';
    
    var map = new mapboxgl.Map({
        container: 'map',
        style: 'mapbox://styles/silas-87/clal1rze4000q15laka14wpzj',
        scrollZoom: false
    });
    
    const bounds = new mapboxgl.LngLatBounds();
    
    locations.forEach(loc => {
        const mapper = document.createElement('div');
        mapper.className = 'marker';
    
        new mapboxgl.Marker({
            element: mapper,
            anchor: 'bottom'
        }).setLngLat(loc.coordinates).addTo(map);
    
        new mapboxgl.Popup({offset: 30}).setLngLat(loc.coordinates).setHTML(`<p>${loc.day}: ${loc.description}</p>`).addTo(map)
    
        bounds.extend(loc.coordinates);
    });
    
    map.fitBounds(bounds, {
        padding: {
            top: 200,
            bottom: 150,
            left: 100,
            right: 100
        }
    });
}


if (document.querySelector('.form--login'))
  document.querySelector('.form').addEventListener('submit', (e) => {
    e.preventDefault();
    loginHandler();
});

if (document.querySelector('.form--signup'))
  document.querySelector('.form').addEventListener('submit', (e) => {
    e.preventDefault();
    signUpHandler();
});

if (logoutBtn)
    logoutBtn.addEventListener('click', (e) => {
    logout()
});

if(userDataForm)
    userDataForm.addEventListener('submit', async (e) => {
        e.preventDefault()
        const form = new FormData();

        const emailValue = email.value;
        const nameValue = userName.value;
        const photoValue = userPhoto.files[0];

        form.append('name', nameValue);
        form.append('email', emailValue);
        form.append('photo', photoValue);

        console.log(form)

        await updateSettings(form, 'data');
    });

if (userPasswordForm)
    userPasswordForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        const currentPass = passwordCurrent.value;
        const newPassword = password.value;
        const confirmNewPassword = passwordConfirm.value;

        const data = {
            currentPassword: currentPass,
            password: newPassword,
            confirmPassword: confirmNewPassword
        }

        await updateSettings(data, 'password');
    });