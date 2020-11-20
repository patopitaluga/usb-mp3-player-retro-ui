const screenMusicPlayerComponent = {
  template: `<div class="display--playing">
  <div class="display--playing__row-1">
    <div style="margin: 0 1px;width: 13px;flex: 0 0 auto; border: 1px rgba(0, 0, 0, .8) solid;display: flex; justify-content: center; align-items: center;">
      <img alt="" src="images/itunes-note.svg" style="display: block;width: 8px;"/>
    </div>
    <ul style="width: 21px;">
      <li>320</li>
      <li>mp3</li>
    </ul>
    <ul style="font-size: 17px;;width: 21px;">
      <li>001</li>
      <li>005</li>
    </ul>
    <ul style="width: 11px;">
      <li></li>
      <li>N</li>
    </ul>
    <ul style="width: 21px;">
      <li>NOR</li>
      <li></li>
    </ul>
    <ul style="font-size: 18px;flex: 1 1 auto;">
      <li>00:06</li>
      <li>03:33</li>
    </ul>
    <div class="display--playing__battery">
    </div>
  </div>
  <p>Corona - The rythm of the night.mp3</p>
</div>`,
};

export { screenMusicPlayerComponent };
