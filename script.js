const videos = document.querySelectorAll("video");

function checkVideos() {
    videos.forEach(video => {
        const rect = video.getBoundingClientRect();
        if (rect.top >= 0 && rect.bottom <= window.innerHeight) {
            video.play();
        } else {
            video.pause();
        }
    });
}
window.addEventListener("scroll", checkVideos);

// 🔹 Like button functionality
document.querySelectorAll(".like-btn").forEach(btn => {
    btn.addEventListener("click", () => {
        let countSpan = btn.querySelector("span");
        let count = parseInt(countSpan.textContent);
        if (!btn.classList.contains("liked")) {
            btn.classList.add("liked");
            btn.style.color = "red";
            countSpan.textContent = count + 1;
        } else {
            btn.classList.remove("liked");
            btn.style.color = "white";
            countSpan.textContent = count - 1;
        }
    });
});

// 🔹 Swipe gesture for mobile
let startY = 0;
document.querySelector(".reels-container").addEventListener("touchstart", e => {
    startY = e.touches[0].clientY;
});

document.querySelector(".reels-container").addEventListener("touchend", e => {
    let endY = e.changedTouches[0].clientY;
    if (startY - endY > 50) {
        window.scrollBy(0, window.innerHeight);
    } else if (endY - startY > 50) {
        window.scrollBy(0, -window.innerHeight);
    }
});
// 🔹 Auto-pause videos not in view
const videos = document.querySelectorAll("video");

function checkVideos() {
    videos.forEach(video => {
        const rect = video.getBoundingClientRect();
        if (rect.top >= 0 && rect.bottom <= window.innerHeight) {
            video.play();
        } else {
            video.pause();
        }
    });
}

window.addEventListener("scroll", checkVideos);
// 🔹 Auto-pause videos not in view
const videos = document.querySelectorAll("video");

function checkVideos() {
    videos.forEach(video => {
        const rect = video.getBoundingClientRect();
        if (rect.top >= 0 && rect.bottom <= window.innerHeight) {
            video.play();
        } else {
            video.pause();
        }
    });
}
window.addEventListener("scroll", checkVideos);

// 🔹 Like button functionality
document.querySelectorAll(".like-btn").forEach(btn => {
    btn.addEventListener("click", () => {
        let countSpan = btn.querySelector("span");
        let count = parseInt(countSpan.textContent);
        if (!btn.classList.contains("liked")) {
            btn.classList.add("liked");
            btn.style.color = "red";
            countSpan.textContent = count + 1;
        } else {
            btn.classList.remove("liked");
            btn.style.color = "white";
            countSpan.textContent = count - 1;
        }
    });
});

// 🔹 Swipe gesture for mobile
let startY = 0;
document.querySelector(".reels-container").addEventListener("touchstart", e => {
    startY = e.touches[0].clientY;
});

document.querySelector(".reels-container").addEventListener("touchend", e => {
    let endY = e.changedTouches[0].clientY;
    if (startY - endY > 50) {
        window.scrollBy(0, window.innerHeight);
    } else if (endY - startY > 50) {
        window.scrollBy(0, -window.innerHeight);
    }
});

// script.js
const reelsContainer = document.getElementById('reels');
const template = document.getElementById('reelTemplate');
const sentinel = document.getElementById('sentinel');

let page = 1;
const limit = 3;
let loading = false;
let noMore = false;
const currentUser = 'guest_user'; // placeholder, in real app use auth

// --- load initial reels ---
async function loadReels() {
  if (loading || noMore) return;
  loading = true;
  try {
    const res = await fetch(`/api/reels?page=${page}&limit=${limit}`);
    const data = await res.json();
    data.reels.forEach(addReelToDOM);
    const totalPages = Math.ceil(data.total / data.limit);
    if (page >= totalPages) noMore = true;
    page++;
    observeVideos(); // refresh observer
  } catch (err) {
    console.error(err);
  } finally {
    loading = false;
  }
}

// --- add reel DOM ---
function addReelToDOM(reelData) {
  const clone = template.content.cloneNode(true);
  const reel = clone.querySelector('.reel');
  const video = clone.querySelector('video');
  const username = clone.querySelector('.username');
  const dp = clone.querySelector('.profile-pic');
  const desc = clone.querySelector('.description');
  const marquee = clone.querySelector('.marquee');
  const likeBtn = clone.querySelector('.like-btn');
  const likeCount = clone.querySelector('.like-count');
  const commentCount = clone.querySelector('.comment-count');
  const musicIcon = clone.querySelector('.music-icon');

  video.src = reelData.videoPath;
  username.textContent = reelData.username;
  dp.src = reelData.videoPath ? reelData.videoPath : '/default-profile.jpg'; // placeholder
  desc.textContent = reelData.description;
  marquee.textContent = reelData.songName || 'Unknown Song';
  likeCount.textContent = reelData.likes || 0;
  commentCount.textContent = (reelData.comments || []).length;
  musicIcon.src = dp.src;

  // like button
  likeBtn.addEventListener('click', async () => {
    try {
      const r = await fetch(`/api/reels/${reelData._id}/like`, {
        method: 'POST',
        headers: { 'Content-Type':'application/json' },
        body: JSON.stringify({ userId: currentUser })
      });
      const j = await r.json();
      likeCount.textContent = j.likes;
      if (j.liked) likeBtn.style.color = 'red';
      else likeBtn.style.color = 'white';
    } catch (err) { console.error(err); }
  });

  // comment button (simple prompt)
  clone.querySelector('.comment-btn').addEventListener('click', async () => {
    const text = prompt('Type your comment');
    if (!text) return;
    try {
      const r = await fetch(`/api/reels/${reelData._id}/comment`, {
        method:'POST',
        headers: {'Content-Type':'application/json'},
        body: JSON.stringify({ user: currentUser, text })
      });
      const j = await r.json();
      commentCount.textContent = j.comments.length;
      alert('Comment added');
    } catch (err) { console.error(err); }
  });

  // append
  reelsContainer.appendChild(clone);
}

// --- Play/pause based on visibility ---
function observeVideos() {
  const videos = document.querySelectorAll('video');
  const options = { root: null, threshold: 0.75 };
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      const v = entry.target;
      if (entry.isIntersecting) {
        v.muted = false; // optional: start with muted or not
        v.play().catch(()=>{});
      } else {
        v.pause();
      }
    });
  }, options);

  videos.forEach(v => {
    observer.observe(v);
    // double-tap to like
    let lastTap = 0;
    v.addEventListener('touchend', e => {
      const now = Date.now();
      if (now - lastTap < 300) {
        // find like button in same reel
        const likeBtn = v.closest('.reel').querySelector('.like-btn');
        likeBtn.click();
      }
      lastTap = now;
    });
  });
}

// --- Infinite scroll using IntersectionObserver on sentinel ---
const sentinelObserver = new IntersectionObserver(entries => {
  entries.forEach(e => {
    if (e.isIntersecting) loadReels();
  });
}, { root: null, rootMargin: '200px' });
sentinelObserver.observe(sentinel);

// --- Swipe gestures for mobile (simple) ---
let startY = 0;
reelsContainer.addEventListener('touchstart', e => startY = e.touches[0].clientY);
reelsContainer.addEventListener('touchend', e => {
  const endY = e.changedTouches[0].clientY;
  if (startY - endY > 100) window.scrollBy({ top: window.innerHeight, behavior: 'smooth' });
  else if (endY - startY > 100) window.scrollBy({ top: -window.innerHeight, behavior: 'smooth' });
});

// --- Upload form handler ---
const uploadForm = document.getElementById('uploadForm');
uploadForm.addEventListener('submit', async (ev) => {
  ev.preventDefault();
  const formData = new FormData(uploadForm);
  try {
    const res = await fetch('/api/upload', { method: 'POST', body: formData });
    const j = await res.json();
    if (j.success) {
      // prepend new reel at top
      page = 1; noMore = false; reelsContainer.innerHTML = ''; // reload feed
      loadReels();
      alert('Uploaded!');
      uploadForm.reset();
    } else {
      alert('Upload failed');
    }
  } catch (err) {
    console.error(err);
    alert('Upload error');
  }
});

// --- initial load ---
loadReels();
// Import Firebase modules
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-app.js";
import { getStorage, ref, uploadBytesResumable, getDownloadURL } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-storage.js";
import { getDatabase, ref as dbRef, push, onChildAdded } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-database.js";

// 🔹 Your Firebase Config (replace with your own from Firebase Console)
const firebaseConfig = {
    apiKey: "YOUR-API-KEY",
    authDomain: "YOUR-PROJECT.firebaseapp.com",
    projectId: "YOUR-PROJECT-ID",
    storageBucket: "YOUR-PROJECT.appspot.com",
    messagingSenderId: "SENDER-ID",
    appId: "APP-ID",
    databaseURL: "https://YOUR-PROJECT.firebaseio.com"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const storage = getStorage(app);
const db = getDatabase(app);

const reelsContainer = document.getElementById("reelsContainer");

// Upload video
window.uploadVideo = function () {
    let file = document.getElementById("videoFile").files[0];
    let desc = document.getElementById("desc").value;

    if (!file) return alert("Select a video first!");

    let storageRef = ref(storage, "reels/" + file.name);
    let uploadTask = uploadBytesResumable(storageRef, file);

    uploadTask.on("state_changed", 
        () => {},
        (error) => alert("Error: " + error),
        () => {
            getDownloadURL(uploadTask.snapshot.ref).then((url) => {
                push(dbRef(db, "reels"), { url: url, desc: desc });
                alert("Uploaded Successfully!");
            });
        }
    );
};

// Fetch videos & infinite scroll
let loadedCount = 0;
const limit = 3;
let videoData = [];

onChildAdded(dbRef(db, "reels"), (snapshot) => {
    videoData.push(snapshot.val());
    if (videoData.length <= limit) displayReel(snapshot.val());
});

function displayReel(reel) {
    const reelDiv = document.createElement("div");
    reelDiv.className = "reel";
    reelDiv.innerHTML = `
        <video src="${reel.url}" autoplay muted loop></video>
        <p style="position:absolute;bottom:20px;left:20px;">${reel.desc}</p>
    `;
    reelsContainer.appendChild(reelDiv);
}

// Infinite scroll
window.addEventListener("scroll", () => {
    if (window.innerHeight + window.scrollY >= document.body.offsetHeight - 100) {
        let nextVideos = videoData.slice(loadedCount, loadedCount + limit);
        nextVideos.forEach(displayReel);
        loadedCount += limit;
    }
});
const firebaseConfig = {
    apiKey: "YOUR-API-KEY",
    authDomain: "YOUR-PROJECT.firebaseapp.com",
    projectId: "YOUR-PROJECT-ID",
    storageBucket: "YOUR-PROJECT.appspot.com",
    messagingSenderId: "SENDER-ID",
    appId: "APP-ID",
    databaseURL: "https://YOUR-PROJECT-ID.firebaseio.com"
};
