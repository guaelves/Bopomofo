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

  // ✅ ㄢ的好朋友（聲母）
  const goodFriends = ["ㄅ", "ㄆ", "ㄇ", "ㄈ", "ㄉ", "ㄊ", "ㄋ", "ㄌ", "ㄍ", "ㄎ", "ㄏ" , "ㄓ", "ㄔ", "ㄕ", "ㄖ", "ㄗ", "ㄘ", "ㄙ"];

  const tiles = document.querySelectorAll('.tile');
  const resultDiv = document.getElementById('result');
  let selectedOrder = [];
  let hasWrong = false;

  // ✅ 結果容器：橫向排列（每個直式注音一列）
  resultDiv.style.display = 'flex';
  resultDiv.style.flexWrap = 'wrap';
  resultDiv.style.justifyContent = 'center';
  resultDiv.style.gap = '15px';
  resultDiv.style.marginBottom = '20px';

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

          // ✅ 建立直式注音組合
          const div = document.createElement('div');
          div.classList.add('result-item');
          div.style.display = 'flex';
          div.style.flexDirection = 'column'; // 垂直排列
          div.style.alignItems = 'center';
          div.style.fontSize = '2rem';
          div.style.lineHeight = '1.2';
          div.style.textAlign = 'center';

          const top = document.createElement('span');
          top.textContent = text;
          const bottom = document.createElement('span');
          bottom.textContent = 'ㄢ';

          div.appendChild(top);
          div.appendChild(bottom);

          // ✅ 依點選順序從左到右
          resultDiv.appendChild(div);
        }

        tile.classList.add('correct');
        tile.classList.remove('wrong');
        playCorrect();

        if (selectedOrder.length === goodFriends.length) {
          const finishMsg = document.createElement('div');
          finishMsg.classList.add('result-finish');
          finishMsg.textContent = hasWrong ? '完成' : '全部答對 🎉🎉🎉';
          finishMsg.style.width = '100%';
          finishMsg.style.textAlign = 'center';
          finishMsg.style.fontSize = '1.5rem';
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
