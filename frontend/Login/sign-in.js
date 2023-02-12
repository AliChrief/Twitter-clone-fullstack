const signIn = document.getElementById("sign-in");
const signUp = document.getElementById("sign-up");
const error = document.getElementById("error")
const userInput = document.getElementById('check-user')
const passwordInput = document.getElementById('check-password')
const errorRemove = document.querySelectorAll('.error-remove')

// Register page
const register = () => {
    window.location.href='http://localhost/twitter-clone-fullstack/frontend/Register/sign-up.html'
}

// Check login process
const checkLogin = () =>
{
    // Remove Error message
    errorRemove.forEach(input => {
     input.onfocus = () => {
        removeError()
     }
   })
    // Alert if some input fields are empty 
    if(userInput.value == '' || passwordInput.value == ''){
        alert('Please fill the required blanks')
    }
    else{
    //checking if user is logged in 
    const form = new FormData()
    form.append('user-input', userInput.value)
    form.append('password', passwordInput.value)
    fetch('http://localhost/twitter-clone-fullstack/backend/login.php',{

        method: 'POST',
        body: form
    })
    .then(response => { return response.json()})
    .then(data => {
        let result
        if(data.length === 1){
            result = data[0].result
        }
        else{
            result = data[1].result
        }
        // Logged-in faild
        if(result === 'faild'){
            console.log('Invalied username or password')
            error.textContent = "Incorrect username/email or password"
            error.classList.add('show-error')
        }
        // Logged-in success
        else{
            let user_id = data[0].user_id
            let username = data[0].username
            localStorage.setItem('user_id',user_id)
            localStorage.setItem('username',username)
            location.replace("http://localhost/twitter-clone-fullstack/index.html")
        }  
    })
 }    
}

// Remove Error message
const removeError = () => {
    error.classList.remove('show-error')
    error.innerHTML = 'Login'
}
    
// sign-in button listener
signIn.addEventListener('click',checkLogin)
// sign-up button listener
signUp.addEventListener('click',register)

