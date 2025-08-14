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
/* 🔹 Basic Page Style */
body {
    margin: 0;
    padding: 0;
    background: black;
    font-family: Arial, sans-serif;
}

/* 🔹 Container for all reels */
.reels-container {
    height: 100vh;
    overflow-y: scroll;
    scroll-snap-type: y mandatory;
}

/* 🔹 Each reel styling */
.reel {
    position: relative;
    height: 100vh;
    scroll-snap-align: start;
}

/* 🔹 Video covers full screen */
.reel video {
    width: 100%;
    height: 100%;
    object-fit: cover;
}

/* 🔹 Info text overlay */
.reel-info {
    position: absolute;
    bottom: 20px;
    left: 20px;
    color: white;
}
/* 🔹 Basic Page Style */
body {
    margin: 0;
    padding: 0;
    background: black;
    font-family: Arial, sans-serif;
}

/* 🔹 Container for reels */
.reels-container {
    height: 100vh;
    overflow-y: scroll;
    scroll-snap-type: y mandatory;
}

/* 🔹 Each reel styling */
.reel {
    position: relative;
    height: 100vh;
    scroll-snap-align: start;
}

/* 🔹 Video styling */
.reel video {
    width: 100%;
    height: 100%;
    object-fit: cover;
}

/* 🔹 Info text overlay */
.reel-info {
    position: absolute;
    bottom: 20px;
    left: 20px;
    color: white;
}

/* 🔹 Action buttons */
.reel-actions {
    position: absolute;
    right: 10px;
    bottom: 80px;
    display: flex;
    flex-direction: column;
    gap: 15px;
}

.reel-actions button {
    background: rgba(0,0,0,0.4);
    color: white;
    border: none;
    border-radius: 50%;
    padding: 10px;
    font-size: 20px;
    cursor: pointer;
}

.reel-actions span {
    display: block;
    font-size: 14px;
    margin-top: 3px;
}
