
const signUp = document.getElementById("sign-up-btn")
const signIn = document.getElementById("register-signin")

const store = () =>
{
    const email = document.getElementById("email")
    const password = document.getElementById("password")
    const username= document.getElementById("username")
    const firstName = document.getElementById('firstname')
    const lastName = document.getElementById('lastname')
    const emailError = document.getElementById('email-error')
    const userNameError = document.getElementById('username-error')
    const passwordError = document.getElementById('password-error')
    const allInput = document.querySelectorAll('input')
    const regEmail = /.....@gmail.com/
    // Check if all input fields arn't empty
    if(email && password && username && firstName && lastName != " "){
        let checker = 3
        // Email validation
        if (email.value.match(regEmail)) {
            email.classList.remove('red')
            emailError.classList.remove('show-error')
            checker--
        }
        else{
            emailError.innerHTML = '* Invalid email address'
            email.classList.add('red')
            emailError.classList.add('show-error')
        }
        // Password Validation
        if (password.value.match(/[A-Z]/ && password.value.match(/[a-z]/ ) ) && password.value.match(/\d/) && password.value.match(/\W/) && password.value.length > 6  )  {
            password.classList.remove('red')
            passwordError.classList.remove('show-error')
            checker--
        }
        else{
            password.classList.add('red')
            passwordError.innerHTML = '* Password should contain at least one Uppercase LowerCase Symbol Digit and more than 8 characters '
            passwordError.classList.add('show-error')
        }
        // Username validation
        if(username.value.length > 8){
            username.classList.remove('red')
            userNameError.classList.remove('show-error')
            checker--
    
        }else{
            username.classList.add('red')
            userNameError.innerHTML = '* Username should be greater than 8 character'
            userNameError.classList.add('show-error')
        }
        // Check if all conditions are satisfied
        if(checker == 0){
          
        const formData = new FormData()
        formData.append("username",username.value)
        formData.append("email",email.value)
        formData.append("password",password.value)
        formData.append("firstName",firstName.value)
        formData.append("lastName",lastName.value)
    
        //  fetch the data into database 
        fetch('http://localhost/twitter-clone-fullstack/backend/register.php', {
              method: 'POST',
              body:formData
            })
            .then(response => response.json() )
            .then(data => {
                //  Check if username is taken previously
                if(data === 'error: username already in use.'){
                   email.classList.remove('red')
                   emailError.classList.remove('show-error')
                   username.classList.add('red')
                   userNameError.classList.add('show-error')
                   userNameError.innerHTML = 'username already in use'

                }
                // Check if email is taken previously 
                else if(data === 'error: email already in use.'){
                   username.classList.remove('red')
                   userNameError.classList.remove('show-error')
                   email.classList.add('red')
                   emailError.classList.add('show-error')
                   emailError.innerHTML = 'email already in use'
                }
                // Registration is completed and empty the input fields
                else{
                    allInput.forEach(e =>{
                        e.value = ''
                    })
                }
            })   
        }  
    }
    else{
        alert('Please fill all the required blanks')
    } 
}

const logInPage = () => {
    window.location.href='http://localhost/twitter-clone-fullstack/frontend/Login/sign-in.html'
}
 
signUp.addEventListener('click',store)
signIn.addEventListener('click',logInPage)


  
