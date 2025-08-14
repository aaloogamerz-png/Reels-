/* main.js */
(() => {
  const feed = document.getElementById('feed');
  const tpl = document.getElementById('reelTpl');
  const sentinel = document.getElementById('sentinel');
  const profileBtn = document.getElementById('openProfileBtn');
  const profileIcon = document.getElementById('profileIcon');

  // demo videos (small set). Replace with API later.
  const demoVideos = [
    { id: 'd1', username: 'alice', desc: 'First demo reel', song: 'Demo Song 1', video: 'https://www.w3schools.com/html/mov_bbb.mp4', avatar: 'default-avatar.png', likes: 12 },
    { id: 'd2', username: 'bob', desc: 'Second demo', song: 'Track 2', video: 'https://www.w3schools.com/html/movie.mp4', avatar: 'default-avatar.png', likes: 6 },
    { id: 'd3', username: 'charlie', desc: 'Another reel', song: 'Beat 3', video: 'https://www.w3schools.com/html/mov_bbb.mp4', avatar: 'default-avatar.png', likes: 3 },
    { id: 'd4', username: 'd4', desc: 'More content', song: 'Tune 4', video: 'https://www.w3schools.com/html/movie.mp4', avatar: 'default-avatar.png', likes: 7 },
    { id: 'd5', username: 'd5', desc: 'Extra reel', song: 'Song 5', video: 'https://www.w3schools.com/html/mov_bbb.mp4', avatar: 'default-avatar.png', likes: 2 }
  ];

  // load uploaded reels from localStorage
  function getLocalReels(){
    try {
      const raw = localStorage.getItem('myreels_data');
      if(!raw) return [];
      return JSON.parse(raw);
    } catch(e){ return []; }
  }

  // combine source: local uploads first (newest), then demos
  const localReels = getLocalReels();
  let combined = [...localReels, ...demoVideos];

  // pagination
  let page = 0;
  const perPage = 1; // show 1 reel per full screen to mimic Instagram
  let loading = false;

  function loadNext(){
    if (loading) return;
    loading = true;
    const start = page * perPage;
    const items = combined.slice(start, start + perPage);
    if(items.length === 0){
      loading = false;
      return;
    }
    items.forEach(renderReel);
    page++;
    loading = false;
    // attach observers for play/pause
    observeVideos();
  }

  function renderReel(data){
    const clone = tpl.content.cloneNode(true);
    const article = clone.querySelector('.reel');
    const video = clone.querySelector('video');
    const avatar = clone.querySelector('.r-avatar');
    const ru = clone.querySelector('.r-user');
    const desc = clone.querySelector('.r-desc');
    const song = clone.querySelector('.r-song');
    const likeCount = clone.querySelector('.likeCount');
    const likeBtn = clone.querySelector('.likeBtn');

    video.src = data.video;
    avatar.src = data.avatar || 'default-avatar.png';
    ru.textContent = '@' + (data.username || 'guest');
    desc.textContent = data.desc || '';
    song.textContent = data.song || '';
    likeCount.textContent = data.likes || 0;

    // like button logic (local toggle)
    likeBtn.addEventListener('click', () => {
      const c = parseInt(likeCount.textContent || '0', 10);
      if (!likeBtn.classList.contains('liked')){
        likeBtn.classList.add('liked');
        likeCount.textContent = c + 1;
        likeBtn.style.transform = 'scale(1.2)';
        setTimeout(()=> likeBtn.style.transform = '', 120);
      } else {
        likeBtn.classList.remove('liked');
        likeCount.textContent = Math.max(0, c - 1);
      }
    });

    // double-tap to like on video
    let lastTap = 0;
    video.addEventListener('touchend', () => {
      const now = Date.now();
      if (now - lastTap < 300) likeBtn.click();
      lastTap = now;
    });

    feed.appendChild(clone);
  }

  // IntersectionObserver for playing videos
  let io;
  function observeVideos(){
    const videos = document.querySelectorAll('video');
    if (io) io.disconnect();
    io = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        const v = entry.target;
        if (entry.isIntersecting && entry.intersectionRatio > 0.6) {
          v.muted = true;
          v.play().catch(()=>{});
        } else {
          v.pause();
        }
      });
    }, { threshold: [0.6] });
    videos.forEach(v => io.observe(v));
  }

  // sentinel for infinite load / pagination
  const sentinelObserver = new IntersectionObserver((entries) => {
    entries.forEach(e => {
      if (e.isIntersecting){
        loadNext();
      }
    });
  }, { root: null, rootMargin: '200px' });
  sentinelObserver.observe(sentinel);

  // nav actions
  profileBtn.addEventListener('click', () => location.href = 'profile.html');
  profileIcon && (profileIcon.addEventListener('click', () => location.href = 'profile.html'));

  // initial load - load a couple so user can scroll
  loadNext();
  loadNext();
})();
