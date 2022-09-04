(() => {
  let youtubeRightControls, youTubePlayer;
  let currentVideo = "";
  let currentVideoBookMarks = [];
  chrome.runtime.onMessage.addListener((obj, sender, response) => {
    const { type, value } = obj;
    if (type == "NEW") {
      newVideoLoaded();
    }
  });

  const blockUrls = async () => {
    const blockList = await fetchBlockList();
    const currentUrl = window.location.href;
    for (let i = 0; i < blockList.length; i++) {
      if (
        blockList[i].includes(currentUrl) ||
        currentUrl.includes(blockList[i])
      ) {
        document.head.innerHTML = blockwebsitStyle();
        document.body.innerHTML = blockWebsiteHtml(
          currentUrl.split(".com")[0] + ".com"
        );
      }
    }
  };
  blockUrls();

  function fetchBlockList() {
    return new Promise((res) => {
      chrome.storage.sync.get(["blockList"], (obj) => {
        res(obj["blockList"] ? JSON.parse(obj["blockList"]) : []);
      });
    });
  }

  function blockWebsiteHtml(url) {
    let html = ` <div class="container">
      <h1>ERROR!</h1>
      <h2>This website ${url} is blocked</h2>
    </div>`;
    return html;
  }
  function blockwebsitStyle() {
    let style = ` <style>
    * {
      margin: 0;
      padding: 0;
      box-sizing: border-box;
    }
    body {
      width: 100vw;
      height: 100vh;
    }
    .container {
      width: 100%;
      height: 100%;
      display: flex;
      justify-content: center;
      align-items: center;
      flex-direction: column;
    }
  </style>`;
    return style;
  }

  const fetchBookmarks = () => {
    return new Promise((res) => {
      chrome.storage.sync.get([currentVideo], (obj) => {
        res(obj[currentVideo] ? JSON.parse(obj[currentVideo]) : []);
      });
    });
  };

  const newVideoLoaded = async () => {
    const bookMarkBtnExists =
      document.getElementsByClassName("bookmark-btn")[0];

    const currentUrl = window.location.href;
    if (currentVideo == "") {
      console.log(currentUrl, currentUrl.split("v=")[1]);
      currentVideo = currentUrl.split("v=")[1];
    }
    currentVideoBookMarks = await fetchBookmarks();

    console.log(currentVideoBookMarks);

    if (!bookMarkBtnExists) {
      const bookMarkBtn = document.createElement("img");
      bookMarkBtn.src = chrome.runtime.getURL("assets/yt-note2.png");
      bookMarkBtn.className = "ytp-button " + "bookmark-btn";
      bookMarkBtn.title = "Click to bookmark a current timestamp";
      bookMarkBtn.style.width = "30px";
      bookMarkBtn.style.height = "30px";
      bookMarkBtn.style.marginBottom = "10px";
      youtubeRightControls =
        document.getElementsByClassName("ytp-right-controls")[0];
      youTubePlayer = document.getElementsByClassName("video-stream")[0];
      youtubeRightControls.insertAdjacentElement("afterbegin", bookMarkBtn);
      bookMarkBtn.addEventListener("click", addNewBookmarkEventHandler);
    }
    setTimeout(() => {
      showBookmarks();
    }, 1000);
  };
  newVideoLoaded();

  async function addNewBookmarkEventHandler() {
    const currentTime = youTubePlayer.currentTime;
    currentVideoBookMarks = await fetchBookmarks();
    const currentUrl = window.location.href;
    console.log(currentVideoBookMarks);
    console.log(currentUrl.split(".com")[0]);
    const newBookmark = {
      title: "",
      timeStamp: getTime(currentTime),
      desc: "",
      url: currentUrl,
      videoId: currentVideo,
      index: currentVideoBookMarks.length + 1,
      favicon: `https://t0.gstatic.com/faviconV2?client=SOCIAL&type=FAVICON&fallback_opts=TYPE,SIZE,URL&url=${
        currentUrl.split(".com")[0]
      }.com&size=64`,
    };
    console.log(newBookmark);

    if (currentVideo == "") {
      console.log(currentUrl, currentUrl.split("v=")[1]);
      currentVideo = currentUrl.split("v=")[1];
      currentVideoBookMarks = await fetchBookmarks();
    }
    addForm(newBookmark);
  }
  async function showBookmarks() {
    const currentUrl = window.location.href;
    if (currentVideo == "") {
      console.log(currentUrl, currentUrl.split("v=")[1]);
      currentVideo = currentUrl.split("v=")[1];
      console.log("show book marks");
    }
    currentVideoBookMarks = await fetchBookmarks();
    const videoDescription = document.getElementsByClassName(
      "style-scope ytd-video-secondary-info-renderer"
    )[0];
    let container = document.getElementsByClassName("noteContainer")[0];
    if (!container) {
      container = document.createElement("div");
      container.classList.add("noteContainer");
      container.style.height = "20rem";
      container.style.backgroundColor = "white";
      container.style.fontFamily = "Manrope, sans - serif";
      container.style.fontSize = "medium";
      container.style.display = "flex";
      container.style.justifyContent = "center";
      container.style.alignItems = "center";
      container.style.borderRadius = "1rem";
      container.style.marginBottom = "0.5rem";
      container.style.marginTop = "0.5rem";
    }
    container.style.padding = "1rem";
    if (currentVideoBookMarks.length === 0) {
      container.innerHTML = "Sorry ! No Notes to show";
      videoDescription.insertAdjacentElement("afterbegin", container);
    } else {
      container.innerHTML = "";
      currentVideoBookMarks.forEach((ele) => {
        container.innerHTML =
          container.innerHTML +
          "<br>" +
          `title: ${ele.title}  timeStamp: ${ele.timeStamp}  description: ${ele.desc}`;
      });
      videoDescription.insertAdjacentElement("afterbegin", container);
    }
  }

  async function addForm(newBookmark) {
    const videoDescription = document.getElementsByClassName(
      "style-scope ytd-video-secondary-info-renderer"
    )[0];
    let container = document.getElementsByClassName("noteContainer")[0];
    console.log(container);
    if (!container) {
      container = document.createElement("div");
      container.classList.add("noteContainer");
      container.style.height = "20rem";
      container.style.backgroundColor = "white";
      container.style.fontFamily = "Manrope, sans - serif";
      container.style.fontSize = "medium";
      container.style.display = "flex";
      container.style.justifyContent = "center";
      container.style.alignItems = "center";
      container.style.borderRadius = "1rem";
      container.style.marginBottom = "0.5rem";
      container.style.marginTop = "0.5rem";
      container.style.padding = "1rem";
    }
    container.style.backgroundColor = "rgb(240, 240, 240)";
    container.style.display = "block";
    container.innerHTML = "";
    container.innerHTML = ` <form class="bookMarkForm" style="background-color: rgb(240, 240, 240); border: 2px solid red;">
        <input type="text" name="timeStamp" id="timeStamp" autofocus placeholder="00:00:00" style="width: 10%; text-align: center; border: none; outline: none ; background-color: rgb(255, 255, 255); height: 3.7rem;" disabled>
        <input type="text" name="title" id="titleForm" autofocus placeholder="Title" style="width: 80%;   outline: none ; margin: 0.8rem; margin-left: 0.5rem; height: 3.7rem; font-size: 18px; background-color: rgb(255, 255, 255);border: none; outline: none ; letter-spacing: 1.4px;" />
        <br>
        <textarea name="desc" id="desc" placeholder="Description" style="margin-bottom: 1rem;height: 7rem;  width: 95%; word-wrap: break-word !important; font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; font-size: 15px; resize: none; background-color: rgb(255, 255, 255);border: none; outline: none ; padding: 0.3rem; letter-spacing: 1.2px;"></textarea>
        <br />
        <button type="submit" class="submit" style="margin-left: 78%; height: 2.8rem;  width: 6.5rem; border-radius: 1rem;  border: none; background-color: #5c24eb; color: white;">SAVE</button>
        <button type="delete" class="delete" style="height: 2.8rem;  width: 6.5rem; border-radius: 1rem; border: none; background-color: rgb(255, 255, 255); color: rgb(0, 0, 0);">CANCEL</button>
      </form>`;

    if (currentVideo == "") {
      console.log(currentUrl, currentUrl.split("v=")[1]);
      currentVideo = currentUrl.split("v=")[1];
    }
    const notesOfVideo = document.createElement("div");
    currentVideoBookMarks = await fetchBookmarks();
    currentVideoBookMarks.forEach((ele) => {
      console.log(ele);
    });

    videoDescription.insertAdjacentElement("afterbegin", container);

    const getSubmit = document.querySelector(".submit");
    const getDelete = document.querySelector(".delete");

    const titleform = document.querySelector("#titleForm");
    const descform = document.querySelector("#desc");
    const timeStamp = document.querySelector("#timeStamp");
    console.log(titleform);
    timeStamp.value = newBookmark.timeStamp;

    // event listner of submit and delete

    getSubmit.addEventListener("click", (e) => {
      e.preventDefault();
      const bookMarkForm = document.getElementsByClassName("bookMarkForm")[0];
      console.log(titleform.value, descform.value);
      newBookmark.title = titleform.value;
      newBookmark.desc = descform.value;
      newBookmark.videoId = currentVideo;
      (newBookmark.index = currentVideoBookMarks.length + 1),
        (bookMarkForm.style.display = "none");

      // storing in the storage
      chrome.storage.sync.set(
        {
          [currentVideo]: JSON.stringify([
            ...currentVideoBookMarks,
            newBookmark,
          ]),
        },
        showBookmarks
      );
    });
    getDelete.addEventListener("click", (e) => {
      e.preventDefault();
      const bookMarkForm = document.getElementsByClassName("bookmarkForm")[0];
      bookMarkForm.style.display = "none";
      showBookmarks();
    });
  }
})();

const getTime = (t) => {
  let date = new Date(0);
  date.setSeconds(t);
  return date.toISOString().substring(11, 19);
};
