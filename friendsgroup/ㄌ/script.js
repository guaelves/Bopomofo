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
    "ㄧ", "ㄨ", "ㄩ", "ㄚ", "ㄛ", "ㄜ", "ㄞ", "ㄟ", "ㄠ", "ㄡ", "ㄢ", "ㄤ", "ㄥ",
    "ㄧㄚ", "ㄧㄝ", "ㄧㄠ", "ㄧㄡ", "ㄧㄢ", "ㄧㄣ", "ㄧㄤ", "ㄧㄥ", 
    "ㄨㄛ", "ㄨㄢ", "ㄨㄣ", "ㄨㄥ", 
    "ㄩㄝ", "ㄩㄢ"
  ];

  const tiles = document.querySelectorAll('.tile');
  const resultDiv = document.getElementById('result');
  const resetBtn = document.getElementById('resetBtn');
  let selectedOrder = [];
  let hasWrong = false;

  // 建立罕見字訊息區塊，放在 resetBtn 上方，並置中
  const rareMsgDiv = document.createElement('div');
  rareMsgDiv.style.textAlign = 'center';
  rareMsgDiv.style.margin = '8px 0';
  rareMsgDiv.style.fontWeight = 'bold';
  rareMsgDiv.style.color = '#d33';
  resetBtn.parentNode.insertBefore(rareMsgDiv, resetBtn);

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
          bSpan.textContent = 'ㄌ';
          div.appendChild(bSpan);
          symbols.forEach(ch => {
            const s = document.createElement('span');
            s.textContent = ch;
            div.appendChild(s);
          });

          resultDiv.appendChild(div);

          // 選到「ㄛ」時顯示罕見字訊息
          if (text === "ㄛ") {
            rareMsgDiv.textContent = '「ㄌㄛ」為罕見字拼音，字詞：咯，注音：˙ㄌㄛ';
          }
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

  resetBtn.addEventListener('click', () => {
    tiles.forEach(tile => {
      tile.classList.remove('correct', 'wrong', 'tone-selected');
    });
    selectedOrder = [];
    hasWrong = false;
    resultDiv.innerHTML = '';
    rareMsgDiv.textContent = ''; // reset時清空罕見字訊息
  });
});
