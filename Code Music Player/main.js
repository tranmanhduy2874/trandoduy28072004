/**
 * render song
 * scroll
 * play/ pause preek
 * cd rotage
 */



const $ = document.querySelector.bind(document)
const $$ = document.querySelectorAll.bind(document)
const heading = $('.header p')
const cdthumb = $('.cd-thumb')
const audio = $('#audio')
const playBtn = $('.btn-toogle-play')
const player = $('.player')
const inputBtn = $('#progess')
const nextBtn = $('.btn-next')
const prevBtn = $('.btn-prev')
const randomBtn = $('.btn-share')
const repeatBtn = $('.btn-repeat')
const playList = $('.playList')

const LOCAL_STORAGE_KEY = "MANHDUY_ID_PLAYER"

const cdThumbAnimate = cdthumb.animate([
    { transform : "rotate(0)"},
    { transform : "rotate(360deg)"},
], {
    duration: 15000,
    iterations : Infinity
})

const app = {
    currentIndex  : 0,
    isPlaying: false,
    isRandom : false,
    isRepeat : false,
    arraySongPlayed : [0],
    settings : JSON.parse(localStorage.getItem(LOCAL_STORAGE_KEY)) || {},
    songs : [
        {
            name: "Anh Không Phải Dạng Vừa Đâu",
            singer : "Sơn Tùng MTP",
            path : `./Asset/audio/song1.mp3`,
            image : './Asset/img/song1.jpg'
        },
        {
            name: "Anh chưa thương em đến vậy đâu",
            singer : "Myra Trần",
            path : `./Asset/audio/song2.mp3`,
            image : './Asset/img/song2.jpg'
        },
        {
            name: "Đom Đóm",
            singer : "Jack-97",
            path : `./Asset/audio/song3.mp3`,
            image : './Asset/img/song3.jpg'
        },
        {
            name: "Anh nhà ở đâu thế",
            singer : "Ameee",
            path : `./Asset/audio/song4.mp3`,
            image : './Asset/img/song4.jpg'
        },
        {
            name: "Waiting for you",
            singer : "MONO",
            path : `./Asset/audio/song5.mp3`,
            image : './Asset/img/song5.jpg'
        },
        {
            name: "Em không sai chúng ta sai",
            singer : "Erik",
            path : `./Asset/audio/song6.mp3`,
            image : './Asset/img/song6.jpg'
        },
        {
            name: "Đổi tình yêu để lấy cô đơn",
            singer : "Song Luân",
            path : `./Asset/audio/song7.mp3`,
            image : './Asset/img/song7.jpg'
        },
        {
            name: "Người âm phủ",
            singer : "Osad",
            path : `./Asset/audio/song8.mp3`,
            image : './Asset/img/song8.jpg'
        },
        {
            name: "Lừa Dối",
            singer : "Nguyễn Đình Vũ",
            path : `./Asset/audio/song9.mp3`,
            image : './Asset/img/song9.jpg'
        },
        {
            name: "Tia nắng của anh",
            singer : "ĐỨc Phúc",
            path : `./Asset/audio/song10.mp3`,
            image : './Asset/img/song10.jpg'
        },
    ],
    render : function () { 
        let html = this.songs.map( (song, index) => { 
            return `
                <div class="song ${index === 0 ? "active-song" : " "}" data-index="${index}">
            <div class="thumb" 
            style="background-image: url(${song.image});">
            </div>
            <div class="body">
                <h3 class="title">${song.name}</h3>
                <p class="author">${song.singer}</p>
            </div>
            <div class="option">
                <i class="ti-more-alt"></i>
                </div>
            </div>
            `
        })
        
        playList.innerHTML = html.join('')
    },
    setConfig : function (key, value) {
        app.settings[key] = value
        localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(app.settings))
    },
    defineProperties : function () { 
        Object.defineProperty(this, 'currentSong', {
            get : function() { 
                return this.songs[this.currentIndex]
            }
        })
    },
    handleEvent : function () { 

        // xử lí CD quay và dừng
        cdThumbAnimate.pause()

        // xử lí thay đổi kích thước cd
        document.onscroll = function () { 
            const scroll = window.scrollY || document.documentElement.scrollTop;
            let newSize = 180 - scroll;
            document.documentElement.style.setProperty('--size_cd_thumb', newSize > 0 ? newSize + "px" : 0);
        }


        playBtn.onclick = function () { 
            if (app.isPlaying == true) { 
                audio.pause();
                cdThumbAnimate.pause()        
            }
            else {
                audio.play();
            cdThumbAnimate.play()

            }
        }
        // xử lí play songs

        // lang nghe khi audio dc playing
        audio.onplay = function () {
            app.isPlaying = true
            player.classList.add('playing')
        }

        // lang nghe khi audio bi pause
        audio.onpause = function () {
            app.isPlaying = false
            player.classList.remove('playing')
        }


        // khi tien do bai hat thay doi
        audio.ontimeupdate = function () {
            if (this.duration)
            inputBtn.value = (this.currentTime/this.duration)*100;
        }

        // khi thay doi input range
        inputBtn.oninput = function () { 
            audio.ontimeupdate = function () {}       
            inputBtn.onchange = function () { 
                audio.currentTime = this.value * audio.duration  / 100
                audio.ontimeupdate = function () {
                    if (this.duration)
                    inputBtn.value = (this.currentTime/this.duration)*100;
                }
            audio.play()
            }
        }

        
        // hàm next song
        function nextNextsong() { 
            if (app.isRandom) { 
                app.randomSong()
            }
            else { 
                app.nextSong()
            }
            audio.play()
        }

        nextBtn.onclick = nextNextsong


        prevBtn.onclick = function () { 
            if (app.isRandom) { 
                app.randomSong()
            }
            else { 
                app.prevSong()
            }
            audio.play()
        }

        // random

        randomBtn.onclick = function () { 
            app.isRandom = !app.isRandom          
            randomBtn.classList.toggle('active', app.isRandom)
            app.setConfig('isRandom', app.isRandom)
        }
        // xử lý lặp lại 1 bài hát

        repeatBtn.onclick = function () { 
            app.isRepeat = !app.isRepeat
            repeatBtn.classList.toggle('active', app.isRepeat)
            

            app.setConfig('isRepeat', app.isRepeat)
        }


         //audio ended
         audio.onended = function () {
            if (app.isRepeat) { 
                cdThumbAnimate.play();
                audio.play();
            }
            else { 
                cdThumbAnimate.pause()
                setTimeout( () => { 
                    if (app.isRandom) { 
                        app.randomSong()
                    } else { 
                        app.nextSong()
                    }
                }, 2000)
            }
        }

        // Lắng nghe hành vi click vào playList
        playList.onclick = function (e) {
            let songNode = e.target.closest('.song:not(.active-song)')
            if (songNode || e.target.closest('.option')) {
                
                // xử ;í khi click vào Song
                if (songNode) {
                    // console.log(songNode.getAttribute('data-index'))
                    app.currentIndex = Number(songNode.dataset.index)
                    app.loadCurrentSong()
                    app.activeSong()
                    audio.play()
                    cdThumbAnimate.cancel()
                    cdThumbAnimate.play()
                }

                // xử lí khi click vào option
                if (e.target.closest('.option')) {

                }
            }
        }
    },
    loadConfig : function () {
        app.isRandom = app.settings.isRandom
        app.isRepeat = app.settings.isRepeat
        repeatBtn.classList.toggle('active', app.isRepeat)
        randomBtn.classList.toggle('active', app.isRandom)
    },
    loadCurrentSong : function () { 
       
        heading.textContent = this.currentSong.name
        cdthumb.style.backgroundImage = `url(${this.currentSong.image})`
        audio.src = this.currentSong.path
    },
    nextSong : function () { 
        this.currentIndex++
        if (this.arraySongPlayed.find( (crr,i) => { 
            return crr == this.currentIndex
        } ) == undefined) {
            this.arraySongPlayed.push(this.currentIndex)
        }
        if (this.currentIndex == this.songs.length) { 
            this.currentIndex = 0;
            this.arraySongPlayed = [0]
        }
        this.loadCurrentSong()
        cdThumbAnimate.cancel()
        cdThumbAnimate.play()
        audio.play()
        app.activeSong()
        app.scrolltoActiveSong()
        // console.log(this.arraySongPlayed)
    },
    prevSong : function () { 
        this.currentIndex--
        if (this.arraySongPlayed.find( (crr,i) => { 
            return crr == this.currentIndex
        } ) == undefined) {
            this.arraySongPlayed.push(this.currentIndex)
        }
        if (this.currentIndex < 0) { 
            this.currentIndex = this.songs.length - 1
            this.arraySongPlayed = [this.songs.length - 1]
        }
        this.loadCurrentSong()
        cdThumbAnimate.cancel()
        cdThumbAnimate.play()
        audio.play()
        app.activeSong()
        app.scrolltoActiveSong()
        // console.log(this.arraySongPlayed)
    },
    randomSong : function () { 
        let randomIndex
        do { 
            randomIndex = Math.floor(Math.random() * app.songs.length)
            if (this.arraySongPlayed.length == this.songs.length) {
                this.arraySongPlayed = []
            }
            if (this.arraySongPlayed.find( (crr, i) => { 
                return crr == randomIndex
            } ) == undefined ) { 
                this.arraySongPlayed.push(randomIndex);
                break;
            } 
            else { 
                continue;
            }
        }
        while ( 1 == 1)
        // console.log(randomIndex , this.arraySongPlayed)

        this.currentIndex = randomIndex;
        this.loadCurrentSong();
        cdThumbAnimate.cancel()
        cdThumbAnimate.play();
        audio.play()
        app.activeSong()
        app.scrolltoActiveSong()
    },
    activeSong : function () {
        $('.active-song').classList.remove("active-song")
        $$('.song')[app.currentIndex].classList.add('active-song')
    },
    scrolltoActiveSong : function () { 
        $('.active-song').scrollIntoView({
            behavior : "smooth",
            block : app.currentIndex <= 2 ? "end" : "center"
        }, 2000);
    },
    start : function () { 

        // gán cấu hình từ config
        this.loadConfig();

        // dinh nghia cac thuoc tinh cho object
        this.defineProperties();

        //lang nghe xu ly cac su kien
        this.handleEvent();

        //tai thong tin bai hat dau tien vao UI khi chay ung dung
        this.loadCurrentSong();

        //render lai playList
        this.render();

        //activeSong
        this.activeSong();

    }
}
app.start();