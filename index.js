const PLAYER_STORAGE_KEY = 'F8_PLAYER'

const $ = document.querySelector.bind(document)
const $$ = document.querySelectorAll.bind(document)
const cd = $('.cd')
const cdThumb = $('.cd-thumb')
const playlist = $('.playlist')
const heading = $('header h2')
const audio = $('#audio')
const player = $(".player")
const playBtn = $('.btn-toggle-play')
const progress = $('.progress')
const timePlay = $('#timePlay')
const timeDuration = $('#timeDuration')
const randomBtn = $('.btn-random')
const nextBtn = $('.btn-next')
const prevBtn = $('.btn-prev')
const repeatBtn = $('.btn-repeat')
const titlePage = $('title')
const listSongPlayed = []

function fancyTimeFormat(duration) {
    // Hours, minutes and seconds
    var hrs = ~~(duration / 3600);
    var mins = ~~((duration % 3600) / 60);
    var secs = ~~duration % 60;

    // Output like "1:01" or "4:03:59" or "123:03:59"
    var ret = "";

    if (hrs > 0) {
        ret += "" + hrs + ":" + (mins < 10 ? "0" : "");
    }

    ret += "" + mins + ":" + (secs < 10 ? "0" : "");
    ret += "" + secs;
    return ret;
}

const app = {
    songs: [
        {
            name: 'Nevada',
            singer: 'Vicetone',
            path: '../assets/music/song1.mp3',
            image: '../assets/img/image1.jpg'
        },
        {
            name: 'Summertime',
            singer: 'K-391',
            path: '../assets/music/song2.mp3',
            image: '../assets/img/image2.jpg'
        },
        {
            name: 'Monody',
            singer: 'TheFatRa',
            path: '../assets/music/song3.mp3',
            image: '../assets/img/image3.jpg'
        },
        {
            name: 'Reality',
            singer: 'Lost Frequencies feat. Janieck Devy',
            path: '../assets/music/song4.mp3',
            image: '../assets/img/image4.jpg'
        },
        {
            name: 'Chạy về nơi phía anh',
            singer: 'Khắc Việt',
            path: '../assets/music/song5.mp3',
            image: '../assets/img/image5.jpg'
        },
        {
            name: 'Lemon Tree',
            singer: 'DJ DESA REMIX',
            path: '../assets/music/song6.mp3',
            image: '../assets/img/image6.jpg'
        },
        {
            name: 'Cưới Thôi',
            singer: 'B Ray x TAP',
            path: '../assets/music/song7.mp3',
            image: '../assets/img/image7.jpg'
        },
        {
            name: 'Gieo Quẻ',
            singer: 'Hoàng Thùy Linh ft. Đen Vâu',
            path: '../assets/music/song8.mp3',
            image: '../assets/img/image8.jpg'
        },
        {
            name: 'Like My Father',
            singer: 'Jax',
            path: '../assets/music/song9.mp3',
            image: '../assets/img/image9.jpg'
        },
        {
            name: 'Buông',
            singer: 'Bùi Anh Tuấn',
            path: '../assets/music/song10.mp3',
            image: '../assets/img/image10.jpg'
        }
    ],
    currentIndex: 0,
    isPlaying: false,
    isRandom: false,
    isRepeat: false,
    config: JSON.parse(localStorage.getItem(PLAYER_STORAGE_KEY)) || {},
    setConfig: function(key,value) {
        this.config[key] = value;
        localStorage.setItem(PLAYER_STORAGE_KEY, JSON.stringify(this.config))
    },
    render: function () {
        const htmls = this.songs.map((song,index) => {
            listSongPlayed.push('false')
            return `
            <div class="song id-${index}" index = ${index}>
                <div class="thumb"          style="background-image: url(${song.image}); background-position: center;
                background-size: cover;
                ">
                </div>
                <div class="body">
                    <h3 class="title">${song.name}</h3>
                    <p class="author">${song.singer}</p>
                </div>
                <div class="option">
                    <i class="fas fa-ellipsis-h"></i>
                </div>
            </div>
            `
        })
        playlist.innerHTML = htmls.join('')
    },
    defineProperties: function () {
        Object.defineProperty(this, 'currentSong', {
            get: function () {
                return this.songs[this.currentIndex]
            }
        })
       
    },
    
    handleEvents: function () {
        
        const _this = this;
        const cdWidth = cd.offsetWidth
        const cdThumbAnimation = cdThumb.animate([
            {
                transform: 'rotate(360deg)'
            }
        ], {
            duration: 10000,
            iterations: Infinity
        })
        cdThumbAnimation.pause()
        // const scroll = function (song) {
        //     $('html,body').animate ([
        //         {
        //             scrollTop: '50'
        //         }
        //     ], {
        //         duration: 1000,
        //         // iterations: Infinity
        //     })
        // }
        // scroll()
        // document.onscroll = function () {
        //     const scrollTop = document.documentElement.scrollTop || window.scrollY
        //     const newCdWidth = cdWidth - scrollTop
        //     cd.style.width = newCdWidth > 0 ? newCdWidth + 'px' : 0
        //     cd.style.opacity = newCdWidth / cdWidth
        // }
        //Xử lý play
        playBtn.onclick = function () {
            if (_this.isPlaying) {
                audio.pause()
            }
            else {
                audio.play()
            }
        }
        audio.onplay = function () {
            _this.isPlaying = true
            player.classList.add('playing')
            cdThumbAnimation.play()
            
           
            
            
        }
        audio.onpause = function () {
            _this.isPlaying = false
            player.classList.remove('playing')
            cdThumbAnimation.pause()
        }
        
        //Progress
        audio.ontimeupdate = function () {
            const currentTime = Math.floor(audio.currentTime)
            progress.value = currentTime > 0 ? currentTime / audio.duration * 100 : 0
            timePlay.innerHTML = `${fancyTimeFormat(currentTime)}`
            timeDuration.textContent = `${fancyTimeFormat(audio.duration)}`
        }

        //Xử lý seek
        setInterval
        progress.onchange = function (e) {
            
            const seekTime = e.target.value / 100 * audio.duration
            // console.log(e.target.value)
            audio.currentTime = seekTime
        }

        //Next song

        nextBtn.onclick = function () {
            setTimeout( () => {
                _this.nextSong()
                // audio.play()
                cdThumbAnimation.play()
            },200)
            setTimeout( () => {
                player.classList.remove('playing')
            cdThumbAnimation.pause()
            },100
            
            )
            
        }
        
        //Prev song

        prevBtn.onclick = function () {
            setTimeout( () => {
                _this.prevSong()
                // audio.play()
                cdThumbAnimation.play()

            },200)
            player.classList.remove('playing')
            cdThumbAnimation.pause()

        }


        //Random
        randomBtn.onclick = () => {
            _this.isRandom = !_this.isRandom
            _this.setConfig('isRandom', _this.isRandom)
            randomBtn.classList.toggle('active',_this.isRepeat)
          
        }
        
        //Repeat song khi kết thúc bài hát

        audio.onended = function  () {
            if (_this.isRepeat) {
                audio.play()
            }
            else {
                _this.nextSong()
                _this.loadCurrentSong()

            }
        }


        repeatBtn.onclick = () => {
            _this.isRepeat = !_this.isRepeat
            _this.setConfig('isRepeat', _this.isRepeat)
            repeatBtn.classList.toggle('active', _this.isRepeat)
         
        }

        // Lắng nghe hành vi khi click vào Playlist
        playlist.onclick = function (e) {
            const songEle =  e.target.closest('.song:not(.active)')
            if (
                !e.target.closest('.option') && songEle
            )  {
                _this.currentIndex = Number(songEle.getAttribute('index'))
                _this.loadCurrentSong()
            }
            // else {
            //     // alert()
            // }
           
        }

        


    },
    loadCurrentSong: function () {
        const songs = $$('.song')
        console.log(songs)
        heading.textContent = `${this.currentSong.name}`
        cdThumb.style.backgroundImage = `url(${this.currentSong.image})`
        audio.src = this.currentSong.path
        titlePage.innerHTML = `${this.currentSong.name} - ${this.currentSong.singer}`
        songs.forEach(song => {
            if(song.classList.contains(`id-${this.currentIndex}`)) song.classList.add('active')
            else song.classList.remove('active')
        });
        this.scrollToActive()
        // listSongPlayed[this.currentIndex] = true;
        
    },
    loadConfig: function() {
        this.isRandom = this.config.isRandom
        this.isRepeat = this.config.isRepeat
        if(this.isRandom) randomBtn.classList.add('active')
        if(this.isRepeat) repeatBtn.classList.add('active')

    },
    nextSong: function() {
        if(this.isRandom) {
            this.randomSong()
        }
        else {
            this.currentIndex++;
            if (this.currentIndex >= this.songs.length) this.currentIndex = 0
        }
        this.loadCurrentSong()

    },
    prevSong: function() {
        if(this.isRandom) {
            this.randomSong()
        }
        else {
            if (this.currentIndex === 0 ) this.currentIndex = this.songs.length-1
            else this.currentIndex--;
        }
        this.loadCurrentSong()
    },
    randomSong: function () {
        do {
            var randomIndex = Math.floor(Math.random() * this.songs.length)
            
        } while(randomIndex === this.currentIndex)
        this.currentIndex = randomIndex
    },
    scrollToActive: function() {
        const songActive = $(`.id-${this.currentIndex}`)
        setTimeout(()=> {
            document.documentElement.scrollTo({
                top: songActive.offsetTop - 174,
                behavior: 'smooth'
            }) 
        },200)
        
    },
    
    start: function () {
        this.defineProperties()
        this.loadConfig()
       // 
       this.render()
        this.loadCurrentSong()
        
        this.handleEvents()
       
    }
}
app.start()




