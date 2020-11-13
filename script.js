let pressedTo = setTimeout(() => {
}, 10);

let navStickXPosition = 0;
let navStickYPosition = 0;
let navTriggered = 0;

const Mp3player = {
  data() {
    return {
      // vdAudioElement: document.createElement('audio'),
      vdMainButtonPressed: false,
      vdPlayerStatus: 0,
      vdMenuActive: 1,
      vdDraggingNav: false,
      vdDraggingNavDegree: 0,
      vdIsPlaying: false,
      vdTop: true,
    }
  },
  mounted: function() {
    /* this.vdAudioElement.preload = 'auto';
    const srcElement = document.createElement('source');
    srcElement.src = 'pato-improvisacion-guitarra.mp3';
    this.vdAudioElement.appendChild(srcElement);
    this.vdAudioElement.load(); */

    /**
     * This function will run when the user drags the document.
     *
     * @param {event} evt - The event sent automatically by the browser when this action is triggered.
     */
    const handleTouchMove = (_evt) => {
      if (!this.vdDraggingNav) return;

      let draggingPos;
      if (_evt.changedTouches) draggingPos = [_evt.changedTouches[0].pageX, _evt.changedTouches[0].pageY];
      if (_evt.pageX) draggingPos = [_evt.pageX, _evt.pageY]; // debugging with mouse

      let degreeRot = Math.atan(Math.abs(navStickYPosition - draggingPos[1]) / Math.abs(draggingPos[0] - navStickXPosition)) * -180 / Math.PI + 90;
      if (draggingPos[0] < navStickXPosition) degreeRot = degreeRot *-1;
      if (degreeRot > 40) {
        degreeRot = 40;
        if (this.vdPlayerStatus === 1 && this.navTriggered !== 1) {
          this.vdMenuActive++;
          this.navTriggered = 1;
        }
      }
      if (degreeRot < -40) {
        degreeRot = -40;
        if (this.vdPlayerStatus === 1 && this.navTriggered !== -1) {
          this.vdMenuActive--;
          this.navTriggered = -1;
        }
      }
      if (degreeRot < 0 && this.navTriggered === 1) this.navTriggered = 0;
      if (degreeRot > 0 && this.navTriggered === -1) this.navTriggered = 0;

      if (this.vdMenuActive < 1)
        this.vdMenuActive = 1;
      if (this.vdMenuActive > 5)
        this.vdMenuActive = 5;
      this.vdDraggingNavDegree = degreeRot;
    };

    /**
     * This function will run when the user drags the document.
     *
     * @param {event} evt - The event sent automatically by the browser when this action is triggered.
     */
    const handleTouchEnd = (evt) => {
      this.vdDraggingNav = false;
      this.vdMainButtonPressed = false;
      this.vdDraggingNavDegree = 0;
      this.navTriggered = 0;
    };

    // return; // to disable it while testing.
    document.addEventListener('touchmove', handleTouchMove);
    document.addEventListener('touchend', handleTouchEnd);
    document.addEventListener('mousemove', handleTouchMove); // to mimic the behavior in desktop.
    document.addEventListener('mouseup', handleTouchEnd); // to mimic the behavior in desktop.
  },
  methods: {
    /**
     * Main button action
     */
    mtdMainButtonPressed: function() {
      this.vdMainButtonPressed = true;
      if (this.vdPlayerStatus === 0) {
        pressedTo = setTimeout(() => {
          if (this.vdMainButtonPressed)
            this.vdPlayerStatus = 1;
        }, 2000);
        return;
      }
      if (this.vdPlayerStatus === 1) {
        if (this.vdMenuActive === 1) {
          this.vdPlayerStatus = 2;
          this.mtdTogglePlayAudio();
        }
        return;
      }
      if (this.vdPlayerStatus === 2) {
        this.mtdTogglePlayAudio();
        return;
      }
    },

    /**
     * Main button action
     */
    mtdMainButtonReleased: function() {
      this.vdMainButtonPressed = false;
      clearTimeout(pressedTo);
    },

    /**
     * Start or pause playing the audio.
     */
    mtdTogglePlayAudio: function() {
      /* if (this.vdIsPlaying) {
        this.vdIsPlaying = false;
        this.vdAudioElement.pause();
        clearTimeout(this.vdTimer);
        return;
      }
      this.vdAudioElement.play(); */
      if (this.vdIsPlaying) {
        /* axios({
          method: 'put',
          url: 'https://api.spotify.com/v1/me/player/pause?device_id=' + window.spotifyDeviceId,
          data: { uris: ['spotify:track:0ofMkI3jzmGCElAOgOLeo3'], },
          headers: {
            'Authorization': 'Bearer ' + window.spotifyToken,
          },
        }); */
        this.vdIsPlaying = false;
        return;
      }

      // window.open('https://open.spotify.com/track/0ofMkI3jzmGCElAOgOLeo3?si=l4GNYzV7SWmawf6nLLcKDQ', '_blank');
      // window.location.href = ' :0ofMkI3jzmGCElAOgOLeo3';
      // document.querySelector('#main button').click();
      // document.querySelector('[title="Reproducir"]').click();
      this.vdIsPlaying = true;
      /* axios({
        method: 'put',
        url: 'https://api.spotify.com/v1/me/player/play?device_id=' + window.spotifyDeviceId,
        data: { uris: ['spotify:track:0ofMkI3jzmGCElAOgOLeo3'], },
        headers: {
          'Authorization': 'Bearer ' + window.spotifyToken,
        },
      });*/
    },

    /**
     *
     */
    mtdStartDraggingNav: function() {
      this.vdDraggingNav = true;

      navStickXPosition = document.querySelector('#nav').getBoundingClientRect().left;
      navStickYPosition = document.querySelector('#nav').getBoundingClientRect().top;
    },

    /**
     *
     */
    mtdStopDraggingNav: function() {
      this.vdDraggingNav = false;
    },
  },
};
Vue.createApp(Mp3player).mount('#mp3player');
