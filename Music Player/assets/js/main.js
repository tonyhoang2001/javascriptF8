
const $ = document.querySelector.bind(document)
const $$ = document.querySelectorAll.bind(document)

const cd = $('.cd')
const heading = $('header h2')
const cdThumb = $('.cd-thumb')
const audio = $('audio')
const playBtn = $('.btn-toggle-play')
const player = $('.player')
const progress = $('#progress')
const next = $('.btn-next')
const previous = $('.btn-prev')
const shuffle = $('.btn-random')
const repeat = $('.btn-repeat')


const songs = [
    {
        name: 'Angle Baby',
        singer: 'Troye Sivan',
        path: '../assets/music/angle_baby.mp3',
        image: '../assets/img/angle_baby.jpg'
    },

    {
        name: 'Head in the cloud',
        singer: 'Hayd',
        path: '../assets/music/head_in_the_cloud.mp3',
        image: '../assets/img/head_in_the_cloud.jpg'
    },

    {
        name: 'Bloody Mary',
        singer: 'Lady Gaga',
        path: '../assets/music/Wednesday.mp3',
        image: '../assets/img/wednesday.jpg'
    },

    {
        name: 'Until I Found You',
        singer: 'Stephen Sanchez',
        path: '../assets/music/until_i_found_you.mp3',
        image: '../assets/img/until_i_found_you.jpg'
    },

    {
        name: 'Tình Nào Không Như Tình Đầu',
        singer: 'Trung Quân',
        path: '../assets/music/tinh_dau.mp3',
        image: '../assets/img/khong_nhu_tinh_dau.jpg'
    },

    {
        name: 'Một Ngàn Nỗi Đau',
        singer: 'Trung Quân',
        path: '../assets/music/1000.mp3',
        image: '../assets/img/1000.jpg'
    },

    {
        name: 'Vì Anh Đâu Có Biết',
        singer: 'Vũ',
        path: '../assets/music/vi_anh_dau_co_biet.mp3',
        image: '../assets/img/vi_anh_dau_co_biet.jpg'
    },
]

const app = {
    ...songs,
    currentIndex: 4,
    isPlaying: false,
    isRandom: false,
    isRepeat: false,
    
    render: function () {
        const htmls = songs.map((song, index) => {
            return `
                <div class="song ${index === this.currentIndex ? 'active' : ''}">
                    <div class="thumb" style="background-image: url('${song.image}')">
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
        $('.playlist').innerHTML = htmls.join('')
    },

    defineProperties: function () {
        Object.defineProperty(this, 'currentSong', {
            get: function () {
                return songs[this.currentIndex]
            }
        })
    },

    handleEvent: function () {
        const _this = this
        const cdWidth = cd.offsetWidth

        // Xử lý CD quay / dừng
        const cdThumbAnimation = cdThumb.animate([
            { transform: 'rotate(360deg)' }
        ], {
            duration: 10000,
            iterations: 'Infinity'
        })
        cdThumbAnimation.pause()

        // Phóng to/ thu nhỏ CD Thumbnail
        document.onscroll = () => {
            const scrollY = document.documentElement.scrollTop || window.scrollY
            const newCdWidth = cdWidth - scrollY

            cd.style.width = newCdWidth > 0 ? newCdWidth + 'px' : 0
            cd.style.opacity = newCdWidth / cdWidth
        }

        // Xử lý khi click play
        playBtn.onclick = function () {
            if (_this.isPlaying) {
                audio.pause()
            } else {
                audio.play()
            }
        }

        // Xử lý khi audio play
        audio.onplay = function () {
            _this.isPlaying = true
            player.classList.add('playing')
            cdThumbAnimation.play()
        }

        // Xử lý khi audio pause
        audio.onpause = function () {
            _this.isPlaying = false
            player.classList.remove('playing')
            cdThumbAnimation.pause()
        }

        // Xử lý khi bài hát chạy
        audio.ontimeupdate = function () {
            if (audio.duration) {
                const currentProgressPercentage = Math.floor((audio.currentTime / audio.duration) * 100)
                progress.value = currentProgressPercentage
            }
        }

        // Xử lý khi tua bài hát
        progress.onchange = function (e) {
            const seekTime = e.target.value / 100 * audio.duration;
            audio.currentTime = seekTime
        }

        // Xử lý khi next bài hát tiếp
        next.onclick = function () {
            if (_this.isRandom) {
                _this.randomSong()
            } else {
                _this.nextSong()
            }
            audio.play()
            _this.render()
        }

        // Xử lý khi back bài hát trước
        previous.onclick = function () {
            if (_this.isRandom) {
                _this.randomSong()
            } else {
                _this.backSong()
            }

            audio.play()
            _this.render()
        }

        // Xử lý khi shuffle bài hát
        shuffle.onclick = function () {
            shuffle.classList.toggle('active')
            _this.isRandom = !_this.isRandom
        }

        // Xử lý audio ended
        audio.onended = function () {
            if (_this.isRepeat) {
                audio.play()
            } else {
                next.click()
            }
            _this.render()
        }

        // Xử lý khi repeat bài hát
        repeat.onclick = function () {
            repeat.classList.toggle('active')
            _this.isRepeat = !_this.isRepeat
        }
    },

    scrollToActiveSong: function () {

    },

    loadCurrentSong: function () {
        const currentSong = this.currentSong

        heading.innerHTML = currentSong.name
        cdThumb.style.backgroundImage = `url(${currentSong.image})`
        audio.src = currentSong.path

    },

    nextSong: function () {
        this.currentIndex++
        if (this.currentIndex > songs.length - 1) {
            this.currentIndex = 0
        }
        this.loadCurrentSong()
    },

    backSong: function () {
        this.currentIndex--
        if (this.currentIndex === -1) {
            this.currentIndex = songs.length - 1
        }
        this.loadCurrentSong()
    },

    randomSong: function () {
        const currentIndex = this.currentIndex
        let newIndex

        do {
            newIndex = Math.floor(Math.random() * songs.length)
        } while (newIndex === currentIndex)

        this.currentIndex = newIndex
        this.loadCurrentSong()
    },

    start: function () {
        // Định nghĩa các thuộc tính cho object app
        this.defineProperties()

        // Lắng nghe / Xử lý các sự kiện (DOM Events)
        this.handleEvent()

        // Tải thông tin bài hát đầu tiên vào UI
        this.loadCurrentSong()

        // Render playlist
        this.render()
    }

}

app.start()