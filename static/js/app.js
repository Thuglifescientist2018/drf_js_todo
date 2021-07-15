// CSRF token generator
function getCookie(name) {
    let cookieValue = null;
    if (document.cookie && document.cookie !== '') {
        const cookies = document.cookie.split(';');
        for (let i = 0; i < cookies.length; i++) {
            const cookie = cookies[i].trim();
            // Does this cookie string begin with the name we want?
            if (cookie.substring(0, name.length + 1) === (name + '=')) {
                cookieValue = decodeURIComponent(cookie.substring(name.length + 1));
                break;
            }
        }
    }
    return cookieValue;
}
async function addTask() {
    let getlist = await fetch(list_url);
        let data = await getlist.json();
    let lastone = await data[0]
    

    if(taskList.innerHTML.length > 1) {
    let firstchild =  taskList.querySelector("li:first-child");
    firstchild.insertAdjacentHTML("beforebegin", `<li id='item-${lastone.id}'> <div id="list">${lastone.id}. ${lastone.title}</div>
    
    <div class="buttons">
    <button class="update" id="update" onclick="updateTask('${lastone.id},${lastone.title}, ${lastone.completed}')">Update</button> 
    <button class="delete" id="delete" onclick="deleteTask(${lastone.id})">Delete</button>
    
    </div>
    
    
    </li>`)
    } 
    else {
        taskList.innerHTML += `<li id='item-${lastone.id}'> <div id="list">${lastone.id}. ${lastone.title}</div><button class="update" id="update" onclick="updateTask('${lastone.title}')">Update</button> <button class="delete" id="delete" onclick="deleteTask(${lastone.id})">Delete</button> </li>`
    }
    // 
    // `
}
async function removeTask() {
    let getlist = await fetch(list_url);
    let data = await getlist.json();
    let lastone = await data[0]
    
    await console.log(lastone)
    if(taskList.innerHTML.length > 1) {
    let firstchild = await taskList.querySelector("li:first-child");
        firstchild.remove();
        fetchTasks();
    }
    
   
}
// function for posting a task
let url = "http://127.0.0.1:8000/api/task-create";
async function postTask() {
    const response  = await fetch(url, {
            method: "POST",
            headers:  {
                'Content-type': 'application/json',
             'X-CSRFToken': csrf_token
            },
            body: JSON.stringify({'title': username.value})
    })
    const refresh = await addTask();
    username.value = ""
    
}

// function for fetching task fetchTasks Declaration
let list_url  = "http://127.0.0.1:8000/api/tasklist";
let taskList = document.querySelector("#tasklist");
async function fetchTasks() {
    
    taskList.innerHTML = "";
    fetch(list_url).then(
        response => response.json()
        ).then(
            
            data => data.forEach((task) => {
                if(task) {
                taskList.innerHTML += `
                <li id='item-${task.id}'> <div id="list">${task.id}. ${task.title}</div>
                <div class="buttons">
                
                <button class="update" id="update-${task.id}" onclick="updateTask('${task.id}', '${task.title}', '${task.completed}')">Update</button> 
                
                <button class="delete" id="delete-${task.id}" onclick="deleteTask('${task.id}')">Delete</button>
                
                </div>
                </li>
                `
                }
            })
            )
        }
fetchTasks(); // fetchTasks call
// function for deleting a task
async function deleteTask(id) {

    let delete_url = await `http://127.0.0.1:8000/api/task-delete/${id}`;
    const delete_req = await fetch(delete_url,
        {
        method: "DELETE",
                headers: { 
                    'Content-type': 'application/json',
                    'X-CSRFToken': csrf_token
                },
                body: JSON.stringify({"id": id})
            });
    const refresh = await removeTask();
}
async function editTask(id){
    let li = document.querySelector(`#output #item-${id}`);
    let url = `http://127.0.0.1:8000/api/task-detail/${id}`;
    let response = await fetch(url);
    let data = await response.json();
    li.innerHTML =  `
     <div id="list">${data.id}. ${data.title}</div>
                <div class="buttons">
                
                <button class="update" id="update-${data.id}" onclick="updateTask('${data.id}', '${data.title}', '${data.completed}')">Update</button> 
                
                <button class="delete" id="delete-${data.id}" onclick="deleteTask('${data.id}')">Delete</button>
                
                </div>
    
    `

    
}
async function updateTask(id, title, completed) {
   let submitBtn  = document.querySelector("form #submit");
   submitBtn.style.backgroundColor = "#57b04d";
   submitBtn.value  = "Update";
   const updateToServer = async (e) => {
    let response = await fetch(update_url, {
        method: "PUT",
        headers:  {
            "Content-type": 'application/json',
            "X-CSRFToken": csrf_token
        },
        body: JSON.stringify({"id": id, "title": username.value, "completed": completed})

   });
   editTask(id);
    
   }
   let update_url = `http://127.0.0.1:8000/api/task-update/${id}`;
   form.removeEventListener("submit", formSubmit);
   form.addEventListener("submit", (e) => {
       updateToServer();
       e.preventDefault();
   });
   console.log(id, title, completed)
   username.value = title;
   console.log("event listener removed through update btn");
    
}
// setting csrftoken
let csrf_token = getCookie("csrftoken");

// now its time to send data 
let username = document.getElementById("name");
let form = document.querySelector("form");

function formSubmit(e){
    console.log("form submitted");  
    postTask();
    e.preventDefault();
}
form.addEventListener("submit",  formSubmit)
