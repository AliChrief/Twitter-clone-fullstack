const home = document.getElementById('home')
const profile = document.getElementById('profile')
const myProfile = document.getElementById('my-profile')
const inputFiels = document.getElementById('file')
const inputText = document.getElementById('content')
const leftProfileImg = document.getElementById('left-profile-img')
const search = document.querySelector('.fa-magnifying-glass')
const searchInput = document.querySelector('.search-tab input')
const tweet_container = document.querySelector('.text')
const tweets = document.querySelectorAll('.to-tweet')
const localStorageUserName = localStorage.getItem('username')
const id = localStorage.getItem('user_id')
const myFirstName = document.querySelector('.left-first-name')
const myLastName = document.querySelector('.left-last-name')
const myUserName = document.querySelector('.left-hashtag-name')
let imgData 

profile.addEventListener('click', () => {
    location.replace("http://localhost/twitter-clone-fullstack/profile.html")// navigate into profile
})

home.addEventListener('click', () => {
    location.replace("http://localhost/twitter-clone-fullstack/index.html") // navigate into home page
})
// Load User Profile
const profileLoad = () => {
    fetch(`http://localhost/twitter-clone-fullstack/backend/profile.php?USER_ID=${id}`)
    .then(response => response.json())
    .then(data => {
        userProfiles = data.user
        myProfile.src = data.img
        leftProfileImg.src =data.img
        myFirstName.textContent = userProfiles[0].f_name
        myLastName.textContent = userProfiles[0].l_name
        myUserName.textContent ='@' + userProfiles[0].username

        
    })
}
// Load tweet 
const loadData = () => {

    fetch('http://localhost/twitter-clone-fullstack/backend/view_feed.php')
    .then(response => response.json())
    .then(data => {
        const userInfo = data[0]
        const userLike = data[1]
        const userProfile = data[2]
        let counter = 0
        userInfo.forEach(e => {
        
        const usernameProfile = document.createElement('div')
        usernameProfile.classList.add('username-profile')
        const img = document.createElement('img')
        img.classList.add('img')
        img.src = userProfile[counter]
        usernameProfile.appendChild(img)
        const textHeadline = document.createElement('div')
        textHeadline.classList.add('text-headline')
        const userName = document.createElement('div')
        userName.classList.add('username')
        userName.innerHTML = `${e.f_name + ' ' + e.l_name}`
        const hashtagName = document.createElement('div')
        hashtagName.classList.add('hashtag')
        hashtagName.innerHTML = `@ ${e.username}`
        const tweetDate = document.createElement('div')
        tweetDate.classList.add('tweet-date')
        tweetDate.innerHTML = `${e.tweet_date}`
        const textContent = document.createElement('div')
        textContent.classList.add('text-content')
        textContent.textContent = `${e.text}`

        const parentLike = document.createElement('div')
        parentLike.classList.add('like')

        const like = document.createElement('i')
        like.classList.add('fa-regular')
        like.classList.add('fa-heart')

        const parg = document.createElement('p')
        parg.classList.add('hide')
        parg.innerHTML = e.tweet_id
        parentLike.appendChild(parg)
        
        const likeCount = document.createElement('div')
        likeCount.classList.add('count')
        likeCount.innerHTML = userLike[counter].likes

        tweet_container.appendChild(usernameProfile)
        textHeadline.appendChild(userName)
        textHeadline.appendChild(hashtagName)
        textHeadline.appendChild(tweetDate)
        tweet_container.appendChild(textHeadline)
        tweet_container.appendChild(textContent)
        parentLike.appendChild(like)
        parentLike.appendChild(likeCount)
        tweet_container.appendChild(parentLike)
        
        counter++
        })
        // listen when tweet's like is pressed
        const fav = document.querySelectorAll('.fa-heart')
        fav.forEach(element => {
            element.addEventListener('click', (e)=> {
                e.target.classList.toggle('is-like')
                let targetCount = e.target.parentElement.children[2]
                if(e.target.classList.contains('is-like')){
                    targetCount.innerHTML = parseInt(e.target.parentElement.children[2].innerHTML) + 1
                    targetCount.classList.add('is-like')
                }else{
                    targetCount.innerHTML = parseInt(e.target.parentElement.children[2].innerHTML) - 1
                    targetCount.classList.remove('is-like')
                }
                
                const likeData = new FormData()
                likeData.append('username',localStorageUserName)
                likeData.append('tweetId',e.target.parentElement.firstChild.innerHTML)
                fetch(`http://localhost/twitter-clone-fullstack/backend/like_user.php`, {
                    method: 'POST',
                    body:likeData 
                    })
                    .then(response =>  response.json())
            })
        })
    })
}

// Create a tweet 
const tweet = Array.from(tweets)
tweet.forEach(btn => {
    btn.addEventListener('click',() => {
    tweet_container.innerHTML = " "
    const formData = new FormData()
    const tweetText = inputText.value
    let d = new Date()
    let date = `${d.getMonth()+1}-${d.getDate()}-${d.getFullYear()}`
    formData.append("text",tweetText)
    formData.append('date', date)
    formData.append('user_id',id)



    fetch(`http://localhost/twitter-clone-fullstack/backend/tweet.php`, {
    method: 'POST',
    body:formData 
    })
    .then(response =>  response.json())
    loadData()
    location.reload()
    })
  
})


// Searching user
const userToSearch = document.querySelector('.user-to-search')
search.addEventListener('click', () => {

   if(searchInput.value != " "){
     const searchName = new FormData()
     searchName.append('name', searchInput.value)
     searchName.append('user_id',id)
     fetch('http://localhost/twitter-clone-fullstack/backend/search_user.php',{
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
                fetch('http://localhost/twitter-clone-fullstack/backend/follow_user.php',{
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
                fetch('http://localhost/twitter-clone-fullstack/backend/block_user.php',{
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

// load all tweets 
window.onload = () => {
    loadData()
    profileLoad()
}
