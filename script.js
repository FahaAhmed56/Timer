const timeEl = document.getElementById("time");
const startBtn = document.getElementById("start");
const resetBtn = document.getElementById("reset");
const countEl = document.getElementById("count");
const modeBtns = document.querySelectorAll(".mode");

let duration = 25 * 60;
let remaining = duration;
let timer = null;

const todayKey = () => `focus-sessions-${new Date().toISOString().slice(0, 10)}`;

function loadCount() {
  try { return Number(localStorage.getItem(todayKey())) || 0; } catch { return 0; }
}
function saveCount(n) {
  try { localStorage.setItem(todayKey(), n); } catch {}
}

let sessions = loadCount();
countEl.textContent = sessions;

function format(sec) {
  const m = String(Math.floor(sec / 60)).padStart(2, "0");
  const s = String(sec % 60).padStart(2, "0");
  return `${m}:${s}`;
}

function render() {
  timeEl.textContent = format(remaining);
  document.title = `${format(remaining)} · Focus Timer`;
}

function beep() {
  try {
    const ctx = new (window.AudioContext || window.webkitAudioContext)();
    const osc = ctx.createOscillator();
    osc.frequency.value = 880;
    osc.connect(ctx.destination);
    osc.start();
    osc.stop(ctx.currentTime + 0.4);
  } catch {}
}

function stop() {
  clearInterval(timer);
  timer = null;
  startBtn.textContent = "Start";
}

function tick() {
  remaining--;
  render();
  if (remaining <= 0) {
    stop();
    beep();
    if (duration === 25 * 60) {
      sessions++;
      countEl.textContent = sessions;
      saveCount(sessions);
    }
    remaining = duration;
    render();
  }
}

startBtn.addEventListener("click", () => {
  if (timer) return stop();
  timer = setInterval(tick, 1000);
  startBtn.textContent = "Pause";
});

resetBtn.addEventListener("click", () => {
  stop();
  remaining = duration;
  render();
});

modeBtns.forEach((btn) =>
  btn.addEventListener("click", () => {
    modeBtns.forEach((b) => b.classList.remove("active"));
    btn.classList.add("active");
    duration = Number(btn.dataset.minutes) * 60;
    stop();
    remaining = duration;
    render();
  })
);

render();
