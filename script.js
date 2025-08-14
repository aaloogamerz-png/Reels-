// script.js (main feed)
const reelsContainer = document.getElementById('reels');
const template = document.getElementById('reelTemplate');
const sentinel = document.getElementById('sentinel');

let page = 1;
const limit = 3;
let loading = false;
let noMore = false;

// Dummy data for demo — replace with your API or Firebase data
const demoVideos = [
  { username: "username1", description: "This is the first reel description", songName: "Song Name - Artist", videoPath: "https://www.w3schools.com/html/mov_bbb.mp4", avatar: "default-avatar.png", likes: 120, comments: 45 },
  { username: "username2", description: "This is the second reel description", songName: "Another Song - Artist", videoPath: "https://www.w3schools.com/html/movie.mp4", avatar: "default-avatar.png", likes: 89, comments: 12 },
  // add as many demo items as you want to test infinite scroll
  { username: "username3", description: "Third reel", songName: "My Song", videoPath: "https://www.w3schools.com/html/mov_bbb.mp4", avatar: "default-avatar.png", likes: 33, comments: 3 },
  { username: "username4", description: "Fourth reel", songName: "Track 4", videoPath: "https://www.w3schools.com/html/movie.mp4", avatar: "default-avatar.png", likes: 55, comments: 5 },
  { username: "username5", description: "Fifth reel", songName: "Track 5", videoPath: "https://www.w3schools.com/html/mov_bbb.mp4", avatar: "default-avatar.png", likes: 10, comments: 1 },
  { username: "username6", description: "Sixth reel", songName: "Track 6", videoPath: "https://www.w3schools.com/html/movie.mp4", avatar: "default-avatar.png", likes: 77, comments: 7 },
];

function loadReels() {
  if (loading || noMore) return;
  loading = true;

  // simulate paging from demoVideos
  const start = (page - 1) * limit;
  const items = demoVideos.slice(start, start + limit);
  if (items.length === 0) {
    noMore = true;
    loading = false;
    return;
  }

  items.forEach(addReelToDOM);
  page++;
  loading = false;
  observeVideos(); // attach intersection observers to new videos
}

function addReelToDOM(reelData) {
  const clone = template.content.cloneNode(true);
  const reel = clone.querySelector('.reel');
  const video = clone.querySelector('video');
  const username = clone.querySelector('.username');
  const dp = clone.querySelector('.profile-pic');
  const desc = clone.querySelector('.description');
  const marquee = clone.querySelector('.marquee');
  const likeCount = clone.querySelector('.like-count');
  const commentCount = clone.querySelector('.comment-count');
  const musicIcon = clone.querySelector('.music-icon');

  video.src = reelData.videoPath;
  username.textContent = '@' + reelData.username;
  dp.src = reelData.avatar || 'default-avatar.png';
  desc.textContent = reelData.description;
  marquee.textContent = reelData.songName || 'Unknown Song';
  likeCount.textContent = reelData.likes || 0;
  commentCount.textContent = reelData.comments || 0;
  musicIcon.src = dp.src;

  reelsContainer.appendChild(clone);
}

function observeVideos() {
  const videos = document.querySelectorAll('video');
  const options = { root: null, threshold: 0.75 };
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      const v = entry.target;
      if (entry.isIntersecting) {
        v.muted = true; // keep muted to avoid sudden sound
        v.play().catch(()=>{});
      } else {
        v.pause();
      }
    });
  }, options);

  videos.forEach(v => {
    // avoid re-observing same element
    if (!v.__observed) {
      observer.observe(v);
      v.__observed = true;
    }
  });
}

// infinite scroll sentinel
const sentinelObserver = new IntersectionObserver(entries => {
  entries.forEach(e => {
    if (e.isIntersecting) loadReels();
  });
}, { root: null, rootMargin: '200px' });
sentinelObserver.observe(sentinel);

// initial load
loadReels();
