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
