import { playerSteps } from './../enum-player-status.mjs';

const screenMainMenuComponent = {
  props: ['vpMenuActive'],
  template: `<ul style="padding-top: 2px;">
  <li
    class="menu1__item"
    :class="{ 'menu1__item--active': vpMenuActive === 1 }"
  >
    <button type="button" @click="mtdClickMenuOption(1)">
      <img alt="" src="images/itunes-note.svg" width="12" height="16"/>
      <span>MSC</span>
    </button>
  </li>
  <li
    class="menu1__item"
    :class="{ 'menu1__item--active': vpMenuActive === 2 }"
  >
    <button type="button" @click="mtdClickMenuOption(2)">
      <img alt="" src="images/microphone-alt.svg" width="12" height="17"/>
      <span>REC</span>
    </button>
  </li>
  <li
    class="menu1__item"
    :class="{ 'menu1__item--active': vpMenuActive === 3 }"
  >
    <button type="button" @click="mtdClickMenuOption(3)">
      <img alt="" src="images/surprise.svg" width="12" height="12"/>
      <span>RPL</span>
    </button>
  </li>
  <li
    class="menu1__item"
    :class="{ 'menu1__item--active': vpMenuActive === 4 }"
  >
    <button type="button" @click="mtdClickMenuOption(4)">
      <img alt="" src="images/broadcast-tower.svg"/>
      <span>FM</span>
    </button>
  </li>
  <li
    class="menu1__item"
    :class="{ 'menu1__item--active': vpMenuActive === 5 }"
  >
    <button type="button" @click="mtdClickMenuOption(5)">
      <img alt="" src="images/tools.svg"/>
      <span>SYS</span>
    </button>
  </li>
</ul>`,
  methods: {
    /**
     *
     */
    mtdClickMenuOption: function(_) {
      if (_ === this.vpMenuActive) {
        if (this.vpMenuActive === 1)
          this.$root.mtdStartMusicPlayerFeat();
        return;
      }
      this.$emit('change', _);
    },
  }
};

export { screenMainMenuComponent };
