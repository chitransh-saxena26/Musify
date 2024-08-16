let currSong = new Audio();
let songs = [];
let currFolder;

function timeDuration(seconds) {
    if (isNaN(seconds) || seconds < 0) return "00:00";

    const minutes = Math.floor(seconds / 60);
    const remainingSec = Math.floor(seconds % 60);

    const formatMin = String(minutes).padStart(2, '0');
    const formatSec = String(remainingSec).padStart(2, '0');

    return `${formatMin}:${formatSec}`;

}

async function getSongs(albumIndex = 0) {
    let response = await fetch('songs.json');

    let data = await response.json();

    let albums = data.albums;

    let songUL = document.querySelector(".song-list").getElementsByTagName("ul")[0]
    songUL.innerHTML = "";
    let album = albums[albumIndex];
    album.songs.forEach((song, index) => {
        songUL.innerHTML += `<li data-index="${index}">
                                 <img class="invert" src="img/music.svg" alt="">
                                 <div class="info">
                                     <div>${song.title}</div>
                                     <div>${song.artist}</div>
                                 </div>
                                 <div class="playnow">
                                     <span>Play Now</span>
                                     <img class="invert" src="img/play.svg" alt="">
                                 </div>
                             </li>`;
    })

    document.querySelectorAll(".song-list li").forEach(e => {
        e.addEventListener("click", element => {
            currIndex = parseInt(e.getAttribute('data-index'));
            playMusic(currIndex); // MODIFIED: Play the selected song
        })
    });
    
    return album.songs;

}

const playMusic = async (index, pause = false) => {
    let songs = await getSongs(index);
    console.log(songs)
    
    const song = songs[index];
    currSong.src = song.path;
    if (!pause) {
        currSong.play();
        document.getElementById("play").src = "img/pause.svg";
    }

    document.querySelector(".song-info").innerHTML = `${song.title} - ${song.artist}`;
    document.querySelector(".song-time").innerHTML = "00:00 / 00:00";

}

async function displayAlbums() {
    let response = await fetch('songs.json');
    let data = await response.json();
    let albums = data.albums;

    let cardContainer = document.querySelector('.card-container')
    cardContainer.innerHTML = '';
    albums.forEach((album, index) => {
        cardContainer.innerHTML = cardContainer.innerHTML + `<div data-album-index="${index}" class="card">
                        <div class="play flex justify-content items-center">
                            <svg xmlns="http://www.w3.org/2000/svg" height="16" width="16" viewBox="0 0 384 512">
                                <path
                                    d="M73 39c-14.8-9.1-33.4-9.4-48.5-.9S0 62.6 0 80L0 432c0 17.4 9.4 33.4 24.5 41.9s33.7 8.1 48.5-.9L361 297c14.3-8.7 23-24.2 23-41s-8.7-32.2-23-41L73 39z" />
                            </svg>
                        </div>
                        <img src="${album.cover}" alt="">
                        <h3>${album.title}</h3>
                        <p> ${album.description} </p>
                    </div>`
    });

    document.querySelectorAll(".card").forEach(e => {
        e.addEventListener('click', async item => {
            const albumIndex = parseInt(item.currentTarget.getAttribute('data-album-index'));
            getSongs(albumIndex);
            playMusic(albumIndex);
        });
    });

}

async function main() {
    await getSongs();
    playMusic(0, true)

    await displayAlbums();

    play.addEventListener("click", () => {
        if (currSong.paused) {
            currSong.play();
            play.src = "img/pause.svg"
        }
        else {
            currSong.pause();
            play.src = "img/play.svg"
        }
    })


    currSong.addEventListener("timeupdate", () => {
        document.querySelector(".song-time").innerHTML = `${timeDuration(currSong.currentTime)}/${timeDuration(currSong.duration)}`;
        document.querySelector(".circle").style.left = (currSong.currentTime / currSong.duration) * 100 + "%";
    })

    document.querySelector(".seek").addEventListener("click", e => {
        let timelapse = (e.offsetX / e.target.getBoundingClientRect().width) * 100;
        document.querySelector(".circle").style.left = timelapse + "%";
        currSong.currentTime = ((currSong.duration) * timelapse) / 100;
    })

    document.querySelector(".hamburger").addEventListener("click", () => {
        document.querySelector(".left").style.left = 0;
    })
    document.querySelector(".close").addEventListener("click", () => {
        document.querySelector(".left").style.left = -120 + "%";
    })

    prev.addEventListener("click", () => {
        let index = songs.indexOf(currSong.src.split("/").slice(-1)[0]);

        if (((index - 1) >= 0) && (currSong.currentTime < 20)) {
            playMusic(songs[index - 1])
        }

        else if (currSong.currentTime > 20) {
            currSong.currentTime = 0;
        }

    })

    next.addEventListener("click", () => {
        let index = songs.indexOf(currSong.src.split("/").slice(-1)[0]);
        if ((index + 1) < songs.length) {
            playMusic(songs[index + 1])
        }
        else {
            return;
        }
    })

    shuffle.addEventListener("click", () => {
        let randomSong = Math.floor(Math.random() * songs.length);
        playMusic(songs[randomSong]);
    })

    document.querySelector('.range').getElementsByTagName('input')[0].addEventListener('change', (e) => {
        currSong.volume = parseInt(e.target.value) / 100;
    })


    document.querySelector(".volume>img").addEventListener('click', e => {
        if (e.target.src.includes("volume.svg")) {
            e.target.src = "img/volumeoff.svg";
            currSong.volume = 0;
            document.querySelector('.range').getElementsByTagName('input')[0].value = 0;
        }
        else {
            e.target.src = "img/volume.svg";
            currSong.volume = 0.1;
            document.querySelector('.range').getElementsByTagName('input')[0].value = 10;
        }
    })


}

main();
