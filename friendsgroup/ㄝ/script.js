document.addEventListener('DOMContentLoaded', () => {
  // 🔊 播放音效
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

  // ✅ ㄝ的好朋友（聲母）
  const goodFriends = ["沒有聲母好朋友"];

  const tiles = document.querySelectorAll('.tile');
  const resultDiv = document.getElementById('result');
  let selectedOrder = [];
  let hasWrong = false;

  // ✅ 結果容器樣式
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
          bottom.textContent = '';

          div.appendChild(top);
          div.appendChild(bottom);

          // ✅ 依點選順序從左到右
          resultDiv.appendChild(div);
        }

        tile.classList.add('correct');
        tile.classList.remove('wrong');
        playCorrect();

        // ✅ 全部選完時顯示提示
        if (selectedOrder.length === goodFriends.length) {
          const finishMsg = document.createElement('div');
          finishMsg.classList.add('result-finish');
          finishMsg.textContent = hasWrong ? '完成' : '全部答對 🎉🎉🎉';
          finishMsg.style.width = '100%';
          finishMsg.style.textAlign = 'center';
          finishMsg.style.fontSize = '1.5rem';
          resultDiv.appendChild(finishMsg);
          playFireworks();

          // ✅ 顯示「但有跟介音好朋友...」（紅色字體）
          const friendNote = document.createElement('div');
          friendNote.textContent = '但有跟介音好朋友「ㄧ」「ㄩ」，放在結合韻再練習';
          friendNote.style.width = '100%';
          friendNote.style.textAlign = 'center';
          friendNote.style.marginTop = '10px';
          friendNote.style.fontSize = '1.2rem';
          friendNote.style.color = 'red'; // 🔴 顯示紅色
          resultDiv.appendChild(friendNote);
        }
      } else {
        tile.classList.add('wrong');
        tile.classList.remove('correct');
        playWrong();
        hasWrong = true;
      }
    });
  });

  // 🔄 重置按鈕
  document.getElementById('resetBtn').addEventListener('click', () => {
    tiles.forEach(tile => {
      tile.classList.remove('correct', 'wrong', 'tone-selected');
    });
    selectedOrder = [];
    hasWrong = false;
    resultDiv.innerHTML = '';
  });
});
