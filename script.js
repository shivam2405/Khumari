document.addEventListener('DOMContentLoaded', () => {
    const params = new URLSearchParams(window.location.search);
    const mood = params.get('mood');

    let currentSongIndex = 0;
    let songs = [];
    let allSongs = [];

    const audioPlayer = document.getElementById('audio-player');
    const audioSource = document.getElementById('audio-source');
    const playPauseButton = document.getElementById('play-pause');
    const prevButton = document.getElementById('prev-song');
    const nextButton = document.getElementById('next-song');
    const startButton = document.getElementById('start-random');
    const moodTitle = document.getElementById('mood-title');
    const searchInput = document.querySelector('.search input');

    function loadSongs() {
        fetch('songs.json')
            .then(response => response.json())
            .then(data => {
                if (mood) {
                    songs = data[mood] || [];
                    moodTitle.textContent = mood.charAt(0).toUpperCase() + mood.slice(1);
                } else {
                    songs = [];
                    for (let key in data) {
                        songs = songs.concat(data[key]);
                    }
                    moodTitle.textContent = "All Songs";
                }
                allSongs = songs;
                displaySongs();
            })
            .catch(error => console.error('Error fetching songs:', error));
    }

    function displaySongs() {
        const songList = document.getElementById('song-list');
        if (songs && songList) {
            songList.innerHTML = '';
            songs.forEach((song, index) => {
                const songItem = document.createElement('div');
                songItem.classList.add('song-card', 'bggrey2');
                songItem.innerHTML = `
                    <div class="info">
                        <p>${song.title} - ${song.artist}</p>
                    </div>
                    <div class="playnow">
                        <button class="play-button" data-index="${index}">Play</button>
                    </div>
                `;
                songList.appendChild(songItem);
            });

            document.querySelectorAll('.play-button').forEach(button => {
                button.addEventListener('click', (e) => {
                    currentSongIndex = parseInt(e.target.getAttribute('data-index'), 10);
                    playSong();
                });
            });
        }
    }

    function playSong() {
        const song = songs[currentSongIndex];
        if (song) {
            audioSource.src = `songs/${song.file}`;
            audioPlayer.load();
            audioPlayer.play();
            playPauseButton.textContent = 'Pause';
        }
    }

    function togglePlayPause() {
        if (audioPlayer.paused) {
            audioPlayer.play();
            playPauseButton.textContent = 'Pause';
        } else {
            audioPlayer.pause();
            playPauseButton.textContent = 'Play';
        }
    }

    function playPrevSong() {
        if (currentSongIndex > 0) {
            currentSongIndex--;
        } else {
            currentSongIndex = songs.length - 1;
        }
        playSong();
    }

    function playNextSong() {
        if (currentSongIndex < songs.length - 1) {
            currentSongIndex++;
        } else {
            currentSongIndex = 0;
        }
        playSong();
    }

    function playRandomSong() {
        if (songs.length > 0) {
            currentSongIndex = Math.floor(Math.random() * songs.length);
            playSong();
        }
    }

    function filterSongs() {
        const query = searchInput.value.toLowerCase();
        songs = allSongs.filter(song => song.title.toLowerCase().includes(query) || song.artist.toLowerCase().includes(query));
        displaySongs();
    }

    playPauseButton.addEventListener('click', togglePlayPause);
    prevButton.addEventListener('click', playPrevSong);
    nextButton.addEventListener('click', playNextSong);
    if (startButton) {
        startButton.addEventListener('click', playRandomSong);
    }
    searchInput.addEventListener('input', filterSongs);

    loadSongs();
});
