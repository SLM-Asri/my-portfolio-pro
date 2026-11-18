export function initializeResumeVideo() {
            const eventController = new AbortController();
            const listenerOptions = { signal: eventController.signal };
            const video = document.getElementById('resumeVideo');
            const overlay = document.getElementById('videoOverlayPlay');
            const playPauseBtn = document.getElementById('playPauseBtn');
            const progressFilled = document.getElementById('progressFilled');
            const timeline = document.querySelector('.timeline-container');
            const timeDisplay = document.getElementById('timeDisplay');
            const fullscreenBtn = document.getElementById('fullscreenBtn');
            const videoContainer = document.getElementById('videoContainer');

            // Force volume to max and ensure it's not muted
            video.muted = false;
            video.volume = 1.0;

            const handlePlaySuccess = () => {
                overlay.classList.add('fade-out');
                playPauseBtn.innerHTML = '<i class="fas fa-pause"></i>';
            };

            // Attempt to autoplay unmuted
            video.play()
                .then(handlePlaySuccess)
                .catch(err => {
                    console.log("Autoplay unmuted blocked by browser policy, waiting for user click.");
                });

            // Click overlay to play unmuted
            overlay.addEventListener('click', (e) => {
                e.stopPropagation();
                video.muted = false;
                video.volume = 1.0;
                video.play()
                    .then(handlePlaySuccess)
                    .catch(err => console.error("Error playing video:", err));
            }, listenerOptions);

            // Container click (play/pause toggle once overlay is gone)
            videoContainer.addEventListener('click', () => {
                if (overlay.classList.contains('fade-out')) {
                    if (video.paused) {
                        video.play();
                        playPauseBtn.innerHTML = '<i class="fas fa-pause"></i>';
                    } else {
                        video.pause();
                        playPauseBtn.innerHTML = '<i class="fas fa-play"></i>';
                    }
                }
            }, listenerOptions);

            // Play/pause button click
            playPauseBtn.addEventListener('click', (e) => {
                e.stopPropagation();
                if (video.paused) {
                    video.play();
                    playPauseBtn.innerHTML = '<i class="fas fa-pause"></i>';
                } else {
                    video.pause();
                    playPauseBtn.innerHTML = '<i class="fas fa-play"></i>';
                }
            }, listenerOptions);

            // Update progress bar & time display
            video.addEventListener('timeupdate', () => {
                if (video.duration) {
                    const percentage = (video.currentTime / video.duration) * 100;
                    progressFilled.style.width = `${percentage}%`;
                    
                    const formatTime = (time) => {
                        const mins = Math.floor(time / 60);
                        const secs = Math.floor(time % 60);
                        return `${mins}:${secs < 10 ? '0' : ''}${secs}`;
                    };
                    
                    timeDisplay.textContent = `${formatTime(video.currentTime)} / ${formatTime(video.duration)}`;
                }
            }, listenerOptions);

            // Seek in video
            timeline.addEventListener('click', (e) => {
                e.stopPropagation();
                const rect = timeline.getBoundingClientRect();
                const pos = (e.clientX - rect.left) / rect.width;
                video.currentTime = pos * video.duration;
            }, listenerOptions);

            // Fullscreen toggle
            fullscreenBtn.addEventListener('click', (e) => {
                e.stopPropagation();
                if (!document.fullscreenElement) {
                    videoContainer.requestFullscreen().catch(err => {
                        console.error("Error entering fullscreen:", err);
                    });
                } else {
                    document.exitFullscreen();
                }
            }, listenerOptions);

            return () => {
                eventController.abort();
                video.pause();
            };
        
}
