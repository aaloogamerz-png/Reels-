// user.js (Profile & upload handling - demo version)

// NOTE: This is a demo/local-only upload flow.
// For production real uploads, replace with Firebase / backend API as earlier.

// elements
const uploadForm = document.getElementById('uploadForm');
const uploadStatus = document.getElementById('uploadStatus');
const myReelsList = document.getElementById('myReelsList');
const profileUsername = document.getElementById('profileUsername');

// set current demo user
const CURRENT_USER = 'guest_user';
profileUsername.textContent = '@' + CURRENT_USER;

// local storage key to persist user uploads for demo
const STORAGE_KEY = 'myreels_demo_' + CURRENT_USER;

// load user's previously "uploaded" reels from localStorage
function loadMyReels() {
  myReelsList.innerHTML = '';
  const arr = JSON.parse(localStorage.getItem(STORAGE_KEY) || '[]');
  if (arr.length === 0) {
    myReelsList.innerHTML = '<p class="muted">You have not uploaded any reels yet.</p>';
    return;
  }
  arr.forEach(item => {
    const div = document.createElement('div');
    div.className = 'thumb';
    div.innerHTML = `<video src="${item.url}" muted loop></video>`;
    myReelsList.appendChild(div);
  });
}

// utility to convert file to object URL (demo)
function fileToObjectURL(file) {
  return URL.createObjectURL(file);
}

uploadForm.addEventListener('submit', (ev) => {
  ev.preventDefault();
  const username = document.getElementById('u_username').value || CURRENT_USER;
  const description = document.getElementById('u_description').value || '';
  const songName = document.getElementById('u_song').value || '';
  const file = document.getElementById('u_video').files[0];

  if (!file) {
    uploadStatus.textContent = 'Please select a video file.';
    return;
  }

  uploadStatus.textContent = 'Uploading... (demo-local)';
  // In demo, we just convert to ObjectURL and store metadata in localStorage
  const url = fileToObjectURL(file);
  const item = { username, description, songName, url, createdAt: Date.now() };

  const arr = JSON.parse(localStorage.getItem(STORAGE_KEY) || '[]');
  arr.unshift(item); // newest first
  localStorage.setItem(STORAGE_KEY, JSON.stringify(arr));

  // also add thumbnail to global feed demo (script.js uses demoVideos array) -
  // to make it show in main feed, you would implement a shared storage or API.
  uploadStatus.textContent = 'Uploaded (demo)! Your reel is saved locally.';
  uploadForm.reset();
  loadMyReels();
});

// initial load
loadMyReels();
