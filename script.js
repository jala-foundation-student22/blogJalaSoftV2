const getPost = async(searchTerm='') => {
    const response = await axios.get(`https://61ab59be264ec200176d411b.mockapi.io/api/posts/${searchTerm}`);
    console.log(response);
    return response.data

}
//getPost();

const postContainer = document.querySelector('#post-container');
var constId = 0;
var menuPost = 0; 
var optionsButtons = 0;
var deleteBtn;
var today = new Date();
var date = today.getFullYear()+'-'+(today.getMonth()+1)+'-'+today.getDate();
const showPost = async() =>{
    postContainer.innerHTML = " ";
    const posts = await getPost();
    //console.log(posts);
    posts.forEach(post => {
        const postElement = document.createElement('div');
        postElement.classList.add('post');
        postElement.setAttribute('id', `post-${post.id}`);
        postElement.innerHTML = `
            <div class="date-container" id="post-${post.id}">
                <span id="date-post">${post.createdAt}</span>
                <button class="optionsBtn">...</button>
                <div class="options-menu">
                    <div class="delete-btn" value="${post.id}">delete</div>
                    <div class="comment-btn">comment</div>
                </div>
            </div>
            <div class="post-info">
                <h2 class="post-title">${post.title}</h2>
                <p class='post-body'>
                    ${post.content}
                </p>
            </div>
            <div class="post-comment">
                <div class="input-field">
                    <input type="text" placeholder="your name">
                    <input type="text" placeholder="write your comment">
                    <button class="submitComment">submit</button>
                </div>
                <hr>
                <div class="comment-container">
                    <p class="comment-content">
                    <br>by <span class="comment-name"></span>. date: <span>${date}</span>
                    </p>
                </div>
            </div>
        `
        postContainer.appendChild(postElement);
        constId = `${post.id}`
        console.log(constId);
    })
    takeElements();
}
showPost();
//----------------------------------------------------------
//Upload a post
const createPost = document.querySelector('.submitPost');
const form = document.querySelector('.newpost');
const dateNewPost = document.querySelector('#npost-date');
const titleNewPost = document.querySelector('#npost-title');
const bodyNewPost = document.querySelector('#npost-body');
const upPost = document.querySelector('#submit');


createPost.addEventListener('click', ()=> {
    form.style.display = 'flex';
    console.log(titleNewPost.value, dateNewPost.value)
});

const uploadPost = async () =>{
    const postId = parseInt(constId) + 1;
    const datos = {id:`${postId}` , title: `${titleNewPost.value}`, content: `${bodyNewPost.value}`, createdAt:`${dateNewPost.value}`}
    const response = await axios.post('https://61ab59be264ec200176d411b.mockapi.io/api/posts', datos);
    console.log(response.data);
    showPost();
}

upPost.addEventListener('click', uploadPost);
//-------------------------------------------
//Post options
var deleteBtns = 0;
var addCommentBtns = 0;
var deletePostId;
function takeElements(){
    menuPost = postContainer.querySelectorAll('.options-menu');
    optionsButtons = postContainer.querySelectorAll('.optionsBtn').forEach(button => {
        button.addEventListener('click', () => {
            button.nextElementSibling.classList.toggle('visible');
        })
    })

    addCommentBtns = postContainer.querySelectorAll('.comment-btn').forEach(btn => btn.addEventListener('click', (evt) => {
        var activePostId = evt.target.parentElement.parentElement.getAttribute('id');
        var activePost = postContainer.querySelector(`#${activePostId}`);
        var inputFieldCm = activePost.querySelectorAll('.input-field input');
        activePost.querySelector('.post-comment').style.visibility= 'visible';
        activePost.querySelector('.submitComment').addEventListener('click', () => {
            if(inputFieldCm[0].value === ''){
                inputFieldCm[0].placeholder = 'Please type your name';
            } else if(inputFieldCm[1].value ===''){
                inputFieldCm[1].placeholder = 'Please type something';
            }
            activePost.querySelector('.comment-content').style.visibility = 'visible';
            activePost.querySelector('.comment-content').innerHTML += '<br><br>' + inputFieldCm[1].value;
            activePost.querySelector('.comment-name').innerHTML = inputFieldCm[0].value;
        })

    }))

    deleteBtns= postContainer.querySelectorAll('.delete-btn').forEach(btn => btn.addEventListener('click', (evt) => {
        deletePostId = evt.target.getAttribute('value');
        var dlPost = postContainer.querySelector(`#post-${deletePostId}`);
        console.log(deletePostId)
        if(confirm('Are you sure to delete the post?')){
            deletePost(deletePostId);
            dlPost.innerHTML = '<h2>POST DELETED</h2>'
            console.log('Post deleted!')
            console.log(deletePostId);
        } else {
            console.log('Regreted!')
        }
        })
    );
}
//----------------------------------------------
//delete Post
const deletePost = async(dlPostId) => {
    const response = await axios.delete( `https://61ab59be264ec200176d411b.mockapi.io/api/posts/${dlPostId}`);
    console.log(response.data);
}
//----------------------------------------------
//filter posts
const filter = document.querySelector('#filter');
function filterPost(e) {
    const term = e.target.value.toUpperCase();
    const posts = document.querySelectorAll('.post')
    console.log(posts)

    posts.forEach(post => {
        const title = post.querySelector('.post-title').innerText.toUpperCase();
        const body = post.querySelector('.post-body').innerText.toUpperCase();
        console.log(title, body)
        
        if(title.indexOf(term) > -1 ||  body.indexOf(term) > -1){
            post.style.display = 'flex';
        } else {
            post.style.display = 'none';
        }
    })
}

filter.addEventListener('input', filterPost);