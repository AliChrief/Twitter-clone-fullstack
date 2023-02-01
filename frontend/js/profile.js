
const profile = document.getElementById('profile')
const home = document.getElementById('home')
const myProfile = document.getElementById('my-profile')
const edit = document.getElementById('edit')
const save = document.getElementById('save')
const newFirstName = document.getElementById('first-name')
const newLastName = document.getElementById('last-name')
const  newBio = document.getElementById('Bio')
const leftProfileImg = document.getElementById('left-profile-img')
const inputFiels = document.getElementById('file')
const myNewProfile = document.getElementById('my-new-profile')
const tweet_container = document.querySelector('.text')
const searchInput = document.querySelector('.search-tab input')
const search = document.querySelector('.fa-magnifying-glass')
const tweetNB = document.querySelector('.tweet-nb')
const loggedName = document.querySelector('.logged-name')
const following = document.querySelector('.following')
const follower = document.querySelector('.follower')
const description = document.querySelector('.my-bio')
const main = document.querySelector('main')
const header = document.querySelector('header')
const popup = document.querySelector('.update-popup')
const dateOfJoin = document.querySelector('.date-of-join')
const loggedUserName = document.querySelectorAll('.logged-username')
const myFirstName = document.querySelector('.left-first-name')
const myLastName = document.querySelector('.left-last-name')
const myUserName = document.querySelector('.left-hashtag-name')
const id = localStorage.getItem('user_id')
const localStorageUserName = localStorage.getItem('username')
let imgData

profile.addEventListener('click', () => {
    window.location.href = "http://localhost/twitter-clone-full/profile.html" // navigate into profile page
 })
 
 home.addEventListener('click', () => {
     window.location.href = "http://localhost/twitter-clone-full/index.html" // navigate into home page
 })
 
 const profileLoad = () => {
    fetch(`http://localhost/twitter-clone-full/backend/profile.php?USER_ID=${id}`)
    .then(response => response.json())
    .then(data => {
        userProfiles = data.user
        console.log(userProfiles[0].username)
        leftProfileImg.src =data.img
        myFirstName.textContent = userProfiles[0].f_name
        myLastName.textContent = userProfiles[0].l_name
        myUserName.textContent ='@' + userProfiles[0].username

        
    })
}
// Read profile img as base64 data
const imageUpload = (inputFiels) => {

    const file = inputFiels.files[0]
    const reader = new FileReader()
    reader.readAsDataURL(inputFiels.files[0]) 
   
    setTimeout(()=> {
        imgData = reader.result
        myNewProfile.src = imgData
        },100)
}

// Update user profile popup
edit.addEventListener('click',(edit) => {
    popup.classList.add('front')
    main.classList.add('back')
    header.classList.add('back')
    inputFiels.addEventListener('change', (e) => {
    // convert profile img into base64 data
    imageUpload(inputFiels)
    setTimeout(()=> {
        save.addEventListener('click',() => {
        // Check if all inputs are not empty
        if(newFirstName.value != "" && newLastName.value != "" && newBio.value != ""){
            const formData = new FormData()
            formData.append('user_id',id)
            formData.append('firstName',newFirstName.value)
            formData.append('lastName',newLastName.value)
            formData.append('description',newBio.value)
            formData.append('profile',imgData)

            fetch('http://localhost/twitter-clone-full/backend/update_profile.php',{
                method: 'POST',
                body: formData
            })
            .then(response => response.json())
            loadData()
            popup.classList.remove('front')
            main.classList.remove('back')
            header.classList.remove('back')
            location.reload()
        }
        }) 
        },100)
    })
})

// Load user profile
const loadData = () => {
    
    fetch(`http://localhost/twitter-clone-full/backend/view_profile.php?user_id=${id}`)
    .then(response => response.json())
    .then(data => {
        const userInfo = data[0]
        const tweetContents = data.slice(4)
        let userProfile = data[1]
        // User following
        following.textContent = `${data[2].following} following`
        // User followers
        follower.textContent = `${data[3].followers} follower`
        // Username
        loggedName.textContent = `@${userInfo.username}`
        // User tweets count
        tweetNB.textContent = tweetContents.length + " Tweets"
        // Description
        description.textContent = userInfo.description
        // Date of joined
        dateOfJoin.textContent = userInfo.date_of_joining
        loggedUserName.forEach(myName => {myName.textContent = `${ userInfo.f_name + " " + userInfo.l_name} `})
        tweetContents.forEach(e => {
        const usernameProfile = document.createElement('div')
        usernameProfile.classList.add('username-profile')
        const img = document.createElement('img')
        img.classList.add('img')
        // user profile img
        img.src = userProfile
        myProfile.src = userProfile
        usernameProfile.appendChild(img)
        const textHeadline = document.createElement('div')
        textHeadline.classList.add('text-headline')
        const userName = document.createElement('div')
        userName.classList.add('username')
        // user firstname && lastname
        userName.innerHTML = `${userInfo.f_name + ' ' + userInfo.l_name}`
        const hashtagName = document.createElement('div')
        hashtagName.classList.add('hashtag')
        // user username
        hashtagName.innerHTML = `@ ${userInfo.username}`
        const tweetDate = document.createElement('div')
        tweetDate.classList.add('tweet-date')
        // user tweet date
        tweetDate.innerHTML = `${e.tweet_date}`
        const textContent = document.createElement('div')
        textContent.classList.add('text-content')
        // user text 
        textContent.textContent = `${e.text}`

        tweet_container.appendChild(usernameProfile)
        textHeadline.appendChild(userName)
        textHeadline.appendChild(hashtagName)
        textHeadline.appendChild(tweetDate)
        tweet_container.appendChild(textHeadline)
        tweet_container.appendChild(textContent)
       
        })
    })
}


// Searching user
const userToSearch = document.querySelector('.user-to-search')
search.addEventListener('click', () => {

   if(searchInput.value != " "){
     const searchName = new FormData()
     searchName.append('name', searchInput.value)
     searchName.append('user_id',id)
     fetch('http://localhost/twitter-clone-full/backend/search_user.php',{
        method:'POST',
        body:searchName
    })
    .then(response => response.json())
    .then(data => {
        // If searched-user not found
        if(data == 'Not Found'){
            userToSearch.innerHTML = " "
            const notFound = document.createElement('div')
            notFound.innerHTML = 'Not Found'
            notFound.classList.add('not-found')
            userToSearch.appendChild(notFound)
        }
        else{
            let searchContainer
            let nameSearchProfile
            let identity
            let nameSearchProfileImg
            let firstLastName
            let searchUserName
            let block
            let follow
       
          userToSearch.innerHTML = " "
            
          for(let i = 0 ; i<data.length-1; i++) {
          searchContainer = document.createElement('div')
          searchContainer.classList.add('search-container')

          nameSearchProfile = document.createElement('div')
          nameSearchProfile.classList.add('username-profile')

          nameSearchProfileImg = document.createElement('img')
          nameSearchProfileImg.classList.add('prof-img')
          
          identity = document.createElement('div')
          identity.classList.add('identity')

          firstLastName = document.createElement('p')
          firstLastName.classList.add('first-last-name')
          // First name && Last name for searched user
          firstLastName.innerHTML = `${data[i].f_name + " " + data[i].l_name}`

          searchUserName = document.createElement('p')
          searchUserName.classList.add('user-name')
          // Username for searched user
          searchUserName.innerHTML = `@${data[i].username}`

          block = document.createElement('button')
          block.classList.add('btn')
          block.classList.add('black')
          block.classList.add('block')
          block.innerHTML = `block`

          follow = document.createElement('button')
          follow.classList.add('btn')
          follow.classList.add('black')
          follow.classList.add('follow')
          follow.innerHTML = `follow`

          nameSearchProfile.appendChild(nameSearchProfileImg)
          identity.appendChild(firstLastName)
          identity.appendChild(searchUserName)
          searchContainer.appendChild(nameSearchProfile)
          searchContainer.appendChild(identity)
          searchContainer.appendChild(block)
          searchContainer.appendChild(follow)
          userToSearch.appendChild(searchContainer)

          }
        
          let profiles = Array.from(document.querySelectorAll('.prof-img'))
          let x = 0
          profiles.forEach(element => {
             element.src = data[data.length-1][x]
             x++
          })
          profiles = []
          // Follow user
          const follows =  Array.from(document.querySelectorAll('.follow'))
          follows.forEach(f => {
            f.addEventListener('click',(e) => {
                let mainDiv = e.target.parentElement
                let child= mainDiv.children[1].children[1]
                let sliceChild = child.innerHTML.slice(1)
                let followData = new FormData()
                followData.append('user_id',id)
                followData.append('userName',sliceChild)
                fetch('http://localhost/twitter-clone-full/backend/follow_user.php',{
                    method:'POST',
                    body:followData
                })
                .then(response => response.json())
                .then(data => {
                    if(data == 'follow successfully'){
                        f.innerHTML = 'following'
                    }
                    else{
                        f.innerHTML = 'follow'
                    }
                })
            })
          })     
          // Block user 
          const blocks =  Array.from(document.querySelectorAll('.block'))
          blocks.forEach(b => {
            b.addEventListener('click',(e) => {
                let mainBlockDiv = e.target.parentElement
                let childBlock= mainBlockDiv.children[1].children[1]
                let sliceChildBlock = childBlock.innerHTML.slice(1)
                let blockData = new FormData()
                blockData.append('user_id',id)
                blockData.append('userName',sliceChildBlock)
                fetch('http://localhost/twitter-clone-full/backend/block_user.php',{
                    method:'POST',
                    body:blockData
                })
                .then(response => response.json())
                .then(data => {
                    if(data == 'block successfully'){
                        b.innerHTML = 'blocking'
                    }
                    else{
                        b.innerHTML = 'block'
                    }
                })
            })
          })     
        }
    })
   }
})

// load all logged-in user tweets only
window.onload = () => {
    loadData()
    profileLoad()
}

