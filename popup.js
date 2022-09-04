
let blockList = [];
let toDoList = [];

let home = document.querySelector(".home");
let notesInVideos = document.querySelector(".notes-in-video");
let toDo = document.querySelector(".to-do");
let blocker = document.querySelector(".blocker");


document.addEventListener("DOMContentLoaded", () => {
  home = document.querySelector(".home");
  notesInVideos = document.querySelector(".notes-in-video");
  toDo = document.querySelector(".to-do");
  blocker = document.querySelector(".blocker");
  notesInVideos.addEventListener("click", notesInVideoFunction);
  toDo.addEventListener("click", toDoFunctionality);
  blocker.addEventListener("click", blockerFunctionality);
});

async function notesInVideoFunction() {
  const image = document.querySelector(".image");
  const content = document.querySelector(".content");
  const notesInVideo = document.getElementsByClassName(
    "notesInVideoContainer"
  )[0];
  home.style.display = "none";
  notesInVideo.style.display = "block";
  const keys = await fetchAll();
  console.log(keys);
  for (let i = 0; i < keys.length; i++) {
    const bookmarks = await fetchBykeys(keys[i]);
    console.log(bookmarks);
    for (let j = 0; j < bookmarks.length; j++) {
      const description = bookmarks[j].desc;
      let text = "";
      let flag = false;
      if (description.length > 126) {
        text = description.substring(0, 126) + "... more";
        flag = true;
      } else {
        text = description;
      }
      notesInVideo.innerHTML =
        notesInVideo.innerHTML +
        `  <div class="notesInVideo ${flag ? "expand" : ""}" data-video=${
          bookmarks[j].videoId
        } data-index=${bookmarks[j].index - 1}>
    <div class="image">
      <img src="${bookmarks[j].favicon}" alt="icon" />
    </div>
    <div class="content">
      <span class="heading">${bookmarks[j].title}</span>
      <br>
      <p class="description">
       ${text}
      </p>
    </div>
  </div>`;
    }
    const notebox = document.getElementsByClassName("expand");
    for (let j = 0; j < notebox.length; j++) {
      notebox[j].addEventListener("mouseover", (e) => {
        console.log(e.currentTarget);
      });
    }
  }
}
async function toDoFunctionality() {
  const taskInput = document.querySelector("#taskInput");
  const addbutton = document.querySelector("#addTask");
  const toDoContainer = document.getElementsByClassName("todoContainer")[0];
  home.style.display = "none";
  toDoContainer.style.display = "flex";
  toDoContainer.style.justifyContent = "center";
  toDoContainer.style.alignItems = "center";
  toDoContainer.style.flexDirection = "column";
  toDoList = await fetchToDoList();
  showToDoList();
  addbutton.addEventListener("click", (e) => {
    e.preventDefault();
    console.log("clicked");
    let urlValue = taskInput.value;
    let flag = false;
    for (let i = 0; i < toDoList.length; i++) {
      if (toDoList[i].includes(urlValue)) {
        flag = true;
      }
    }

    if (!flag) {
      toDoList.push(urlValue);
      taskInput.value = "";
      // chrome.storage.sync.clear();
      chrome.storage.sync.set(
        {
          ["toDoList"]: JSON.stringify([...toDoList]),
        },
        showToDoList
      );
    } else {
      showToDoList();
    }
  });
}
async function blockerFunctionality() {
  const urlInput = document.querySelector("#urlInput");
  const blockbutton = document.querySelector("#block");
  const blockerContainer =
    document.getElementsByClassName("blockerContainer")[0];
  home.style.display = "none";
  blockerContainer.style.display = "flex";
  blockerContainer.style.justifyContent = "center";
  blockerContainer.style.alignItems = "center";
  blockerContainer.style.flexDirection = "column";
  blockList = await fetchBlockList();
  // chrome.storage.sync.clear();
  showBlockList();
  blockbutton.addEventListener("click", (e) => {
    e.preventDefault();

    let urlValue = urlInput.value;
    let flag = false;
    for (let i = 0; i < blockList.length; i++) {
      if (blockList[i].includes(urlValue)) {
        flag = true;
      }
    }

    if (!flag) {
      blockList.push(urlValue);
      urlInput.value = "";
      // chrome.storage.sync.clear();
      chrome.storage.sync.set(
        {
          ["blockList"]: JSON.stringify([...blockList]),
        },
        showBlockList
      );
    } else {
      showBlockList();
    }
  });
}

function fetchAll() {
  return new Promise((res) => {
    chrome.storage.sync.get(null, function (items) {
      var allKeys = Object.keys(items);
      res(allKeys.length === 0 ? [] : allKeys);
    });
  });
}

function fetchBykeys(key) {
  return new Promise((res) => {
    chrome.storage.sync.get([key], (obj) => {
      res(obj[key] ? JSON.parse(obj[key]) : []);
    });
  });
}

function fetchBlockList() {
  return new Promise((res) => {
    chrome.storage.sync.get(["blockList"], (obj) => {
      res(obj["blockList"] ? JSON.parse(obj["blockList"]) : []);
    });
  });
}

async function showBlockList() {
  console.log("showblocklist");
  let listAll = await fetchBlockList();
  let blockListContainer = document.getElementsByClassName("blockList")[0];
  blockListContainer.innerHTML = "";
  console.log(listAll);
  if (listAll.length === 0) {
    blockListContainer.innerHTML = `<span class="noList">Sorry! No URL is added to block list</span>`;
  } else {
    for (let i = 0; i < listAll.length; i++) {
      blockListContainer.innerHTML =
        generateList(listAll[i], i) + blockListContainer.innerHTML;
      let list = blockListContainer.querySelector(`[data-url='${listAll[i]}']`);
      console.log(list);
      let deleteButton = list.querySelector(".unblock");
      console.log(deleteButton);
      deleteButton.addEventListener("click", () => {
        console.log(list.dataset.url);
        deleteFromBlockList(list.dataset.url);
      });
    }
  }
}
async function showToDoList() {
  console.log("showTodolist");
  let listAll = await fetchToDoList();
  let taskContainer = document.getElementsByClassName("showtask")[0];
  taskContainer.innerHTML = "";
  console.log(listAll);
  if (listAll.length === 0) {
    taskContainer.innerHTML = `<span class="noTask">Sorry! No task to do</span>`;
  } else {
    for (let i = 0; i < listAll.length; i++) {
      taskContainer.innerHTML =
        generateToDoList(listAll[i], i) + taskContainer.innerHTML;
      let list = taskContainer.querySelector(`[data-url='${listAll[i]}']`);
      console.log(list);
      let deleteButton = list.querySelector(".removeTask");
      console.log(deleteButton);
      deleteButton.addEventListener("click", () => {
        console.log(list.dataset.url);
        deleteFromToDoList(list.dataset.url);
      });
    }
  }
}

async function deleteFromBlockList(url) {
  console.log(url);
  let blockListContainer = document.querySelector(".blockList");
  let list = blockListContainer.querySelector(`[data-url='${url}']`);
  let blockList = await fetchBlockList();
  for (let i = 0; i < blockList.length; i++) {
    if (blockList[i] === list.dataset.url) {
      blockList.splice(i, 1);
      console.log(blockList);
      chrome.storage.sync.set(
        {
          ["blockList"]: JSON.stringify([...blockList]),
        },
        showBlockList
      );
      break;
    }
  }
}

function generateList(url, index) {
  let html = `<div class="list" data-url='${url}' data-index='${index}'>
      <span class="blockhead">${url}</span>
      <button class="unblock data-url='${url}' data-index='${index}">remove</button>
    </div>`;
  return html;
}
function generateToDoList(url, index) {
  let html = `<div class="list" data-url='${url}' data-index='${index}'>
      <span class="taskhead">${url}</span>
      <button class="removeTask data-url='${url}' data-index='${index}">remove</button>
    </div>`;
  return html;
}

function fetchToDoList() {
  return new Promise((res) => {
    chrome.storage.sync.get(["toDoList"], (obj) => {
      res(obj["toDoList"] ? JSON.parse(obj["toDoList"]) : []);
    });
  });
}

async function deleteFromToDoList(url) {
  console.log(url);
  let taskContainer = document.querySelector(".showtask");
  let list = taskContainer.querySelector(`[data-url='${url}']`);
  let toList = await fetchToDoList();
  for (let i = 0; i < toList.length; i++) {
    if (toList[i] === list.dataset.url) {
      toList.splice(i, 1);
      console.log(toList);
      chrome.storage.sync.set(
        {
          ["toDoList"]: JSON.stringify([...toList]),
        },
        showToDoList
      );
      break;
    }
  }
}
