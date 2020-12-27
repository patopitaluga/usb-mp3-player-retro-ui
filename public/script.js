import { playerSteps } from './enum-player-status.mjs';
import { screenMainMenuComponent } from './components/screen__main-menu.mjs';
import { screenMusicPlayerComponent } from './components/screen__music-player.mjs';

if (screen.lockOrientation)
  screen.lockOrientation('portrait');

let timerDetectLongPress = setTimeout(() => {
}, 10);
let screenLit = setTimeout(() => {
}, 10);

let navStickXPosition = 0;
let navStickYPosition = 0;
let navTriggered = 0;
const Mp3player = {
  data() {
    return {
      // vdAudioElement: document.createElement('audio'),
      vdMainButtonPressed: false,
      vdPlayerStatus: playerSteps.OFF,
      vdScreenLit: false,
      vdMenuActive: 1,
      vdDraggingNav: false,
      vdDraggingNavDegree: 0,
      vdPlayerSteps: playerSteps,
      vdIsPlaying: false,
      vdTop: true,
      vdSptfyWidget: false,
      vdBackLight: false,
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

      /**
       * Define dragging position with mouse or touchscreen.
       */
      let draggingPos;
      if (_evt.changedTouches) draggingPos = [_evt.changedTouches[0].pageX, _evt.changedTouches[0].pageY];
      if (_evt.pageX) draggingPos = [_evt.pageX, _evt.pageY]; // debugging with mouse

      // if (draggingPos[1] > navStickYPosition) draggingPos[1] = navStickYPosition - 50;

      /**
       * Calculate rotation degree.
       */
      let degreeRot = Math.atan(
          Math.abs(navStickYPosition - draggingPos[1]) /
          // Math.abs(draggingPos[0] - navStickXPosition) // without stickyness
          Math.pow(draggingPos[0] - navStickXPosition, 2) * 300 // with stickyness
        )
        * -180 / Math.PI + 90;
      /** stickyness */
      // degreeRot *= Math.pow(draggingPos[0] - navStickXPosition, 2) * .01;

      if (draggingPos[0] < navStickXPosition) degreeRot = degreeRot * -1; // negative is dragging to the left.

      if (degreeRot > 40) { // max to the right
        degreeRot = 40;

        /* if in the main menu */
        if (this.vdPlayerStatus === playerSteps.MAIN_MENU && this.navTriggered !== 1) {
          this.vdMenuActive++;
          this.navTriggered = 1;
        }
      }

      if (degreeRot < -40) { // max to the left
        degreeRot = -40;

        /* if in the main menu */
        if (this.vdPlayerStatus === playerSteps.MAIN_MENU && this.navTriggered !== -1) {
          this.vdMenuActive--;
          this.navTriggered = -1;
        }
      }

      /**
       * Stop at first or last element.
       */
      if (degreeRot < 0 && this.navTriggered === playerSteps.MAIN_MENU) this.navTriggered = 0;
      if (degreeRot > 0 && this.navTriggered === -1) this.navTriggered = 0;

      if (this.vdMenuActive < 1)
        this.vdMenuActive = 1;
      if (this.vdMenuActive > 5)
        this.vdMenuActive = 5;
      this.vdDraggingNavDegree = degreeRot; // update vue data.
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
      if (this.vdPlayerStatus === playerSteps.OFF) {
        this.vdPlayerStatus = playerSteps.STARTING;
        timerDetectLongPress = setTimeout(() => {
          if (this.vdMainButtonPressed) {
            this.mtdTurnOnBacklight();
            this.vdPlayerStatus = playerSteps.INTRO;
            setTimeout(() => {
              this.vdPlayerStatus = playerSteps.MAIN_MENU;
            }, 2000);
          }
        }, 1000);
        return;
      }
      if (this.vdPlayerStatus === playerSteps.MAIN_MENU) {
        this.mtdTurnOnBacklight();
        if (this.vdMenuActive === 1) {
          this.mtdStartMusicPlayerFeat();
        }

        /**
         * Detect longpress.
         */
        timerDetectLongPress = setTimeout(() => {
          if (this.vdMainButtonPressed) {
            this.vdPlayerStatus = playerSteps.TURNING_OFF;
            setTimeout(() => {
              this.vdPlayerStatus = playerSteps.OFF;
            }, 2000);
          }
        }, 2000);
        return;
      }
      if (this.vdPlayerStatus === playerSteps.MUSIC_PLAYER) {
        this.mtdTogglePlayAudio();
        return;
      }
    },

    /**
     * Main button action
     */
    mtdMainButtonReleased: function() {
      this.vdMainButtonPressed = false;
      clearTimeout(timerDetectLongPress);
      if (this.vdPlayerStatus === playerSteps.STARTING)
        this.vdPlayerStatus = playerSteps.OFF;
      if (this.vdPlayerStatus === playerSteps.LOADING_MP)
        this.vdSptfyWidget = true;
    },

    /**
     * Start music player feature.
     */
    mtdStartMusicPlayerFeat: function() {
      this.vdPlayerStatus = playerSteps.LOADING_MP;

      setTimeout(() => {
        this.vdPlayerStatus = playerSteps.MUSIC_PLAYER;
      }, 2000);
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

      navStickXPosition = document.querySelector('#nav').getBoundingClientRect().left + 6;
      navStickYPosition = document.querySelector('#nav').getBoundingClientRect().bottom;
    },

    /**
     *
     */
    mtdStopDraggingNav: function() {
      this.vdDraggingNav = false;
    },

    /**
     *
     *
     * @param {number} _ -
     */
    mtdMenuChanged: function(_) {
      this.vdMenuActive = _;
    },

    /**
     *
     */
    mtdTurnOnBacklight: function() {
      this.vdBackLight = true;
      setTimeout(() => {
        this.vdBackLight = false;
      }, 5000);
    },
  },
};

const usbMp3playerApp = Vue.createApp(Mp3player)

usbMp3playerApp.component('screen-music-player', screenMusicPlayerComponent);
usbMp3playerApp.component('screen-main-menu', screenMainMenuComponent);

usbMp3playerApp.mount('#mp3player');
