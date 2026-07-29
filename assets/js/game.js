(function () {
  "use strict";

  const cfg = window.POLI_GAME || {};
  const screens = [...document.querySelectorAll("[data-screen]")];
  const pin = [];
  const pinBoxes = [...document.querySelectorAll("[data-pin] span")];
  const feedback = document.querySelector("[data-feedback]");
  const passwordPanel = document.querySelector(".panel--pink");
  const gifts = [...document.querySelectorAll("[data-gift]")];
  const envelope = document.querySelector("[data-envelope]");
  const letter = document.querySelector("[data-letter]");
  const letterBody = document.querySelector("[data-letter-body]");
  const signature = document.querySelector("[data-signature]");
  const soundButton = document.querySelector("[data-sound]");
  let audioCtx = null;
  let soundOn = false;
  let giftLocked = false;

  function go(name) {
    screens.forEach(screen => screen.classList.toggle("is-active", screen.dataset.screen === name));
    window.scrollTo(0, 0);
    tone(name === "letter" ? 523.25 : 392, .08);
  }

  function tone(freq, duration, type = "square", volume = .025) {
    if (!soundOn) return;
    try {
      audioCtx ||= new (window.AudioContext || window.webkitAudioContext)();
      const osc = audioCtx.createOscillator();
      const gain = audioCtx.createGain();
      osc.type = type;
      osc.frequency.value = freq;
      gain.gain.setValueAtTime(volume, audioCtx.currentTime);
      gain.gain.exponentialRampToValueAtTime(.0001, audioCtx.currentTime + duration);
      osc.connect(gain).connect(audioCtx.destination);
      osc.start();
      osc.stop(audioCtx.currentTime + duration);
    } catch (_) {}
  }

  function updatePin() {
    pinBoxes.forEach((box, index) => { box.textContent = index < pin.length ? "♥" : "•"; });
  }

  function submitPassword() {
    if (pin.join("") === String(cfg.password || "2703")) {
      feedback.textContent = "Správně. Tohle datum znám taky.";
      tone(659.25, .09);
      setTimeout(() => go("gifts"), 650);
      return;
    }
    feedback.textContent = "Tohle datum nám nepatří. Zkus to znovu.";
    passwordPanel.classList.remove("is-wrong");
    void passwordPanel.offsetWidth;
    passwordPanel.classList.add("is-wrong");
    tone(130.81, .18, "sawtooth", .02);
    pin.length = 0;
    updatePin();
  }

  function typeLetter() {
    const full = (cfg.letter || []).join("\n\n");
    letterBody.textContent = "";
    signature.textContent = cfg.signature || "S láskou";
    let i = 0;
    const timer = setInterval(() => {
      letterBody.textContent = full.slice(0, i);
      i += 2;
      if (i > full.length) {
        letterBody.textContent = full;
        clearInterval(timer);
      }
    }, 18);
  }

  document.addEventListener("click", event => {
    const goButton = event.target.closest("[data-go]");
    if (goButton) go(goButton.dataset.go);

    const key = event.target.closest("[data-key]");
    if (key && pin.length < 4) {
      pin.push(key.dataset.key);
      updatePin();
      tone(392 + pin.length * 40, .055);
      if (pin.length === 4) setTimeout(submitPassword, 180);
    }

    if (event.target.closest("[data-clear]")) {
      pin.pop();
      updatePin();
      tone(220, .05);
    }

    if (event.target.closest("[data-submit]")) submitPassword();

    const gift = event.target.closest("[data-gift]");
    if (gift && !giftLocked) {
      giftLocked = true;
      gift.classList.add("is-opening");
      gifts.filter(item => item !== gift).forEach(item => item.classList.add("is-faded"));
      tone(523.25, .08);
      setTimeout(() => go("letter"), 900);
      setTimeout(() => {
        envelope.classList.add("is-opening");
        tone(659.25, .12);
      }, 1150);
      setTimeout(() => envelope.classList.add("is-gone"), 2850);
      setTimeout(() => {
        letter.hidden = false;
        typeLetter();
      }, 3200);
    }

    if (event.target.closest("[data-restart]")) {
      location.reload();
    }
  });

  soundButton.addEventListener("click", async () => {
    soundOn = !soundOn;
    soundButton.setAttribute("aria-pressed", String(soundOn));
    soundButton.textContent = soundOn ? "♫" : "♩";
    if (soundOn) {
      try {
        audioCtx ||= new (window.AudioContext || window.webkitAudioContext)();
        await audioCtx.resume();
      } catch (_) {}
      tone(523.25, .08);
    }
  });

  document.addEventListener("keydown", event => {
    if (/^\d$/.test(event.key) && document.querySelector('[data-screen="password"].is-active')) {
      if (pin.length < 4) {
        pin.push(event.key);
        updatePin();
        if (pin.length === 4) setTimeout(submitPassword, 180);
      }
    }
    if (event.key === "Backspace") {
      pin.pop();
      updatePin();
    }
  });

  updatePin();
})();
