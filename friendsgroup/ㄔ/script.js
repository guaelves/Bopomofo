document.addEventListener('DOMContentLoaded', () => {
  function playBeep(frequency, duration) {
    const ctx = new (window.AudioContext || window.webkitAudioContext)();
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.connect(gain);
    gain.connect(ctx.destination);
    osc.type = "sine";
    osc.frequency.value = frequency;
    gain.gain.setValueAtTime(0.1, ctx.currentTime);
    osc.start();
    osc.stop(ctx.currentTime + duration / 1000);
  }

  function playCorrect() {
    playBeep(880, 100);
    setTimeout(() => playBeep(1320, 100), 150);
  }

  function playWrong() {
    playBeep(220, 150);
    setTimeout(() => playBeep(150, 150), 200);
  }

  function playFireworks() {
    let freq = 1000;
    for (let i = 0; i < 5; i++) {
      setTimeout(() => playBeep(freq, 150), i * 200);
      freq += 200;
    }
  }

  const goodFriends = [
    "ㄨ", "ㄚ", "ㄜ", "ㄞ", "ㄠ", "ㄡ", "ㄢ", "ㄣ", "ㄤ", "ㄥ",
    "ㄨㄚ", "ㄨㄛ", "ㄨㄞ", "ㄨㄟ", "ㄨㄢ", "ㄨㄣ", "ㄨㄤ", "ㄨㄥ"
  ];

  const tiles = document.querySelectorAll('.tile');
  const resultDiv = document.getElementById('result');
  let selectedOrder = [];
  let hasWrong = false;

  tiles.forEach(tile => {
    tile.addEventListener('click', () => {
      const text = tile.innerText.replace(/\n/g, '');
      const parentGrid = tile.parentElement;
      const isToneTile = parentGrid.classList.contains('grid-5');

      if (isToneTile) {
        tile.classList.add('tone-selected');
        tile.classList.remove('correct', 'wrong');
        return;
      }

      tile.classList.remove('tone-selected');

      if (goodFriends.includes(text)) {
        if (!selectedOrder.includes(text)) {
          selectedOrder.push(text);

          const div = document.createElement('div');
          div.classList.add('result-item');

          const symbols = text.split('');
          const bSpan = document.createElement('span');
          bSpan.textContent = 'ㄔ';
          div.appendChild(bSpan);
          symbols.forEach(ch => {
            const s = document.createElement('span');
            s.textContent = ch;
            div.appendChild(s);
          });

          resultDiv.appendChild(div);
        }

        tile.classList.add('correct');
        tile.classList.remove('wrong');
        playCorrect();

        if (selectedOrder.length === goodFriends.length) {
          const finishMsg = document.createElement('div');
          finishMsg.classList.add('result-finish');
          finishMsg.textContent = hasWrong ? '完成' : '全部答對 🎉🎉🎉';
          resultDiv.appendChild(finishMsg);
          playFireworks();
        }
      } else {
        tile.classList.add('wrong');
        tile.classList.remove('correct');
        playWrong();
        hasWrong = true;
      }
    });
  });

  document.getElementById('resetBtn').addEventListener('click', () => {
    tiles.forEach(tile => {
      tile.classList.remove('correct', 'wrong', 'tone-selected');
    });
    selectedOrder = [];
    hasWrong = false;
    resultDiv.innerHTML = '';
  });
});
