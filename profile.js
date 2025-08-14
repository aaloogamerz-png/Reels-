/* profile.js */
(() => {
  const form = document.getElementById('uploadForm');
  const pu_username = document.getElementById('pu_username');
  const pu_song = document.getElementById('pu_song');
  const pu_desc = document.getElementById('pu_desc');
  const pu_video = document.getElementById('pu_video');
  const uploadMsg = document.getElementById('uploadMsg');
  const myReelsList = document.getElementById('myReelsList');
  const profileName = document.getElementById('profileName');

  const STORAGE_KEY = 'myreels_data';

  // load current username into header
  const stored = JSON.parse(localStorage.getItem('profile_meta') || '{}');
  const currentUser = stored.username || 'guest_user';
  profileName.textContent = '@' + currentUser;
  pu_username.value = currentUser;

  // load user's local uploads
  function loadMyReels(){
    myReelsList.innerHTML = '';
    const all = JSON.parse(localStorage.getItem(STORAGE_KEY) || '[]');
    const mine = all.filter(r => r.username === pu_username.value);
    if (mine.length === 0){
      myReelsList.innerHTML = '<p class="muted">You have not uploaded any reels yet (local demo).</p>';
      return;
    }
    mine.forEach(item => {
      const d = document.createElement('div');
      d.className = 'thumb';
      d.innerHTML = `<video src="${item.video}" muted loop></video>`;
      myReelsList.appendChild(d);
    });
  }

  // convert selected file to data URL (WARNING: big videos -> large localStorage)
  function fileToDataURL(file){
    return new Promise((res, rej) => {
      const reader = new FileReader();
      reader.onload = () => res(reader.result);
      reader.onerror = (e) => rej(e);
      reader.readAsDataURL(file);
    });
  }

  form.addEventListener('submit', async (ev) => {
    ev.preventDefault();
    const username = pu_username.value.trim() || 'guest_user';
    const song = pu_song.value.trim();
    const desc = pu_desc.value.trim();
    const file = pu_video.files[0];
    if (!file) { uploadMsg.textContent = 'Please select a video file.'; return; }
    uploadMsg.textContent = 'Converting video... (this may take time for big files)';
    try {
      const dataUrl = await fileToDataURL(file); // store in localStorage
      const newItem = { id: 'u' + Date.now(), username, song, desc, video: dataUrl, avatar: 'default-avatar.png', likes: 0, createdAt: Date.now() };
      const arr = JSON.parse(localStorage.getItem(STORAGE_KEY) || '[]');
      arr.unshift(newItem);
      localStorage.setItem(STORAGE_KEY, JSON.stringify(arr));
      // store profile meta
      localStorage.setItem('profile_meta', JSON.stringify({ username }));
      uploadMsg.textContent = 'Uploaded locally! Go back to Home to see your reel.';
      // reset form
      pu_song.value = ''; pu_desc.value = ''; pu_video.value = '';
      loadMyReels();
    } catch (e){
      console.error(e);
      uploadMsg.textContent = 'Upload failed (browser error).';
    }
  });

  document.getElementById('clearLocal').addEventListener('click', () => {
    const all = JSON.parse(localStorage.getItem(STORAGE_KEY) || '[]');
    const filtered = all.filter(r => r.username !== pu_username.value);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(filtered));
    loadMyReels();
  });

  loadMyReels();
})();
