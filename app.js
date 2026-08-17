/* ===========================================================
   THE LOCAL TRAIN — INTERACTIVE MUSIC ARCHIVE
   ---------------------------------------------------------
   Architecture:
   1. musicLibrary       -> single source of truth for all data
   2. state              -> current runtime state
   3. Audio engine        -> load/play/pause/seek/volume
   4. Video engine        -> crossfade between two <video> layers
   5. UI wiring           -> renders DOM purely from musicLibrary
   =========================================================== */

/* -----------------------------------------------------------
   1. DATA MODEL
----------------------------------------------------------- */
const musicLibrary = {
  aalaskapedh: {
    id: "aalaskapedh",
    title: "Aalas Ka Pedh",
    year: "2015",
    background:
      "https://res.cloudinary.com/dybk0f5nc/video/upload/v1786897798/my_project/alash_ka_pedh_o1tm2l.mp4",
    tracks: [
      {
        title: "Manzil",
        audio:
          "https://res.cloudinary.com/dybk0f5nc/video/upload/v1786947007/my_project/songs_list/The_Local_Train_-_Aalas_Ka_Pedh_-_Manzil_Official_Audio_pzjx9q.mp3",
      },
      {
        title: "Aaoge Tum Kabhi",
        audio:
          "https://res.cloudinary.com/dybk0f5nc/video/upload/v1786947588/my_project/songs_list/The_Local_Train_-_Aaoge_Tum_Kabhi_Official_esrq0r.mp3",
      },
      {
        title: "Bandey",
        audio:
          "https://res.cloudinary.com/dybk0f5nc/video/upload/v1786947013/my_project/songs_list/The_Local_Train_-_Bandey_Official_slyerw.mp3",
      },
      {
        title: "Choo Lo",
        audio:
          "https://res.cloudinary.com/dybk0f5nc/video/upload/v1786947010/my_project/songs_list/The_Local_Train_-_Aalas_Ka_Pedh_-_Choo_Lo_Official_Audio_bc6s4h.mp3",
      },
      {
        title: "Kaisey Jiyun",
        audio:
          "https://res.cloudinary.com/dybk0f5nc/video/upload/v1786947008/my_project/songs_list/The_Local_Train_-_Kaisey_Jiyun_Official_smz3us.mp3",
      },
      {
        title: "Yeh Zindagi Hai",
        audio:
          "https://res.cloudinary.com/dybk0f5nc/video/upload/v1786947008/my_project/songs_list/The_Local_Train_-_Yeh_Zindagi_Hai_Official_SEqQCIMQfk0_aoit0b.mp3",
      },
      {
        title: "Dil Mere",
        audio:
          "https://res.cloudinary.com/dybk0f5nc/video/upload/v1786947621/my_project/songs_list/The_Local_Train_-_Dil_Mere_Official_koybix.mp3",
      },
    ],
  },
  vaaqif: {
    id: "vaaqif",
    title: "Vaaqif",
    year: "2018",
    background:
      "https://res.cloudinary.com/dybk0f5nc/video/upload/v1786897798/my_project/aftab_ler7sb.mp4",
    tracks: [
      {
        title: "Gustaakh",
        audio:
          "https://res.cloudinary.com/dybk0f5nc/video/upload/v1786947001/my_project/songs_list/The_Local_Train_-_Gustaakh_Official_S3Wimxxq7xc_yvzfch.mp3",
      },
      {
        title: "Dilnawaz",
        audio:
          "https://res.cloudinary.com/dybk0f5nc/video/upload/v1786947003/my_project/songs_list/The_Local_Train_-_Dilnawaz_Official_-gKBXwXBUbk_x1jdkk.mp3",
      },
      {
        title: "Khudi",
        audio:
          "https://res.cloudinary.com/dybk0f5nc/video/upload/v1786947003/my_project/songs_list/OnlyMP3.cx_-_The_Local_Train_-_Khudi_Official_mim5zh.mp3",
      },
      {
        title: "Aaftaab",
        audio:
          "https://res.cloudinary.com/dybk0f5nc/video/upload/v1786947002/my_project/songs_list/The_Local_Train_-_Aaftaab_Official_Audio_g932sc.mp3",
      },
      {
        title: "Mere Yaar",
        audio:
          "https://res.cloudinary.com/dybk0f5nc/video/upload/v1786947007/my_project/songs_list/The_Local_Train_-_Mere_Yaar_Official_Audio_VowJFIBjJz0_ptpqel.mp3",
      },
      {
        title: "Mizaaj",
        audio:
          "https://res.cloudinary.com/dybk0f5nc/video/upload/v1786946985/my_project/songs_list/The_Local_Train_-_Mizaaj_Official_rqow6p.mp3",
      },
      {
        title: "Aakhri Salaam",
        audio:
          "https://res.cloudinary.com/dybk0f5nc/video/upload/v1786947004/my_project/songs_list/The_Local_Train_-_Aakhri_Salaam_Official_Audio_tufVrNJ9bX4_laljny.mp3",
      },
      {
        title: "Vaaqif",
        audio:
          "https://res.cloudinary.com/dybk0f5nc/video/upload/v1786947011/my_project/songs_list/Vaaqif_gatlyb.mp3",
      },
    ],
  },
};

/* -----------------------------------------------------------
   2. RUNTIME STATE
----------------------------------------------------------- */
const state = {
  playlistId: "aalaskapedh",
  trackIndex: 0,
  isPlaying: false,
  shuffle: false,
  repeat: false, // repeat current track
  volume: 0.8,
  muted: false,
  activeVideoEl: "A", // which <video> element currently shows
  reducedMotion: window.matchMedia("(prefers-reduced-motion: reduce)").matches,
  isTouch: matchMedia("(hover: none), (pointer: coarse)").matches,
};

/* -----------------------------------------------------------
   DOM refs
----------------------------------------------------------- */
const el = {
  loadingScreen: document.getElementById("loadingScreen"),
  app: document.getElementById("app"),
  videoA: document.getElementById("bgVideoA"),
  videoB: document.getElementById("bgVideoB"),
  cursorGlow: document.getElementById("cursorGlow"),
  audioUnavailable: document.getElementById("audioUnavailable"),

  albumTitle: document.getElementById("albumTitle"),
  albumYear: document.getElementById("albumYear"),
  currentTrackTitle: document.getElementById("currentTrackTitle"),

  playlistBtns: document.querySelectorAll("[data-playlist]"),

  menuToggle: document.getElementById("menuToggle"),
  menuOverlay: document.getElementById("menuOverlay"),
  trackListOverlay: document.getElementById("trackListOverlay"),
  trackList: document.getElementById("trackList"),
  overlayAlbumTitle: document.getElementById("overlayAlbumTitle"),
  overlayAlbumYear: document.getElementById("overlayAlbumYear"),
  closeOverlayBtns: document.querySelectorAll("[data-close-overlay]"),

  progressBar: document.getElementById("progressBar"),
  progressFill: document.getElementById("progressFill"),
  currentTime: document.getElementById("currentTime"),
  duration: document.getElementById("duration"),

  playPauseBtn: document.getElementById("playPauseBtn"),
  playIcon: document.getElementById("playIcon"),
  pauseIcon: document.getElementById("pauseIcon"),
  prevBtn: document.getElementById("prevBtn"),
  nextBtn: document.getElementById("nextBtn"),
  shuffleBtn: document.getElementById("shuffleBtn"),
  repeatBtn: document.getElementById("repeatBtn"),
  muteBtn: document.getElementById("muteBtn"),
  volIcon: document.getElementById("volIcon"),
  muteIcon: document.getElementById("muteIcon"),
  volumeSlider: document.getElementById("volumeSlider"),

  trackIndexLabel: document.getElementById("trackIndex"),
  trackStatus: document.getElementById("trackStatus"),

  audio: document.getElementById("audioPlayer"),
};

/* -----------------------------------------------------------
   3 & 5. VIDEO ENGINE — crossfades between two <video> elements
   Configured for slow (0.5x speed), smooth, and looped playback.
----------------------------------------------------------- */
const BG_VIDEO_SPEED = 0.5;

function configureBackgroundVideo(video) {
  if (!video) return;
  video.playbackRate = BG_VIDEO_SPEED;
  video.loop = true;
  video.muted = true;
  video.playsInline = true;
}

function setBackgroundVideo(url, { instant = false } = {}) {
  const showing = state.activeVideoEl === "A" ? el.videoA : el.videoB;
  const hidden = state.activeVideoEl === "A" ? el.videoB : el.videoA;

  configureBackgroundVideo(showing);

  if (showing.currentSrc && showing.currentSrc.includes(url)) return; // no-op if unchanged

  hidden.src = url;
  hidden.load();
  configureBackgroundVideo(hidden);

  const play = () => {
    configureBackgroundVideo(hidden);
    hidden.play().catch(() => {});
  };

  const swap = () => {
    hidden.classList.add("active");
    showing.classList.remove("active");
    state.activeVideoEl = state.activeVideoEl === "A" ? "B" : "A";
    setTimeout(
      () => {
        showing.pause();
      },
      instant ? 0 : 900,
    );
  };

  if (instant) {
    play();
    swap();
    return;
  }

  hidden.addEventListener(
    "canplay",
    () => {
      play();
      swap();
    },
    { once: true },
  );
}

function currentTrack() {
  return musicLibrary[state.playlistId].tracks[state.trackIndex];
}

/* -----------------------------------------------------------
   STATE PERSISTENCE (localStorage)
----------------------------------------------------------- */
const STORAGE_KEY = "the_local_train_user_state";

function saveState() {
  try {
    const dataToSave = {
      playlistId: state.playlistId,
      trackIndex: state.trackIndex,
      currentTime: el.audio && isFinite(el.audio.currentTime) ? el.audio.currentTime : 0,
      isPlaying: state.isPlaying,
      shuffle: state.shuffle,
      repeat: state.repeat,
      volume: state.volume,
      muted: state.muted,
    };
    localStorage.setItem(STORAGE_KEY, JSON.stringify(dataToSave));
  } catch (e) {
    // Ignore storage errors if disabled or quota exceeded
  }
}

function loadSavedState() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw);
    if (parsed && typeof parsed === "object") return parsed;
  } catch (e) {}
  return null;
}

function restoreSavedState() {
  const saved = loadSavedState();
  if (!saved) return false;

  if (saved.playlistId && musicLibrary[saved.playlistId]) {
    state.playlistId = saved.playlistId;
    const tracks = musicLibrary[saved.playlistId].tracks;
    if (typeof saved.trackIndex === "number" && saved.trackIndex >= 0 && saved.trackIndex < tracks.length) {
      state.trackIndex = saved.trackIndex;
    }
  }

  if (typeof saved.shuffle === "boolean") {
    state.shuffle = saved.shuffle;
    el.shuffleBtn.setAttribute("aria-pressed", String(state.shuffle));
  }

  if (typeof saved.repeat === "boolean") {
    state.repeat = saved.repeat;
    el.repeatBtn.setAttribute("aria-pressed", String(state.repeat));
  }

  if (typeof saved.volume === "number") {
    setVolume(saved.volume);
  }

  if (typeof saved.muted === "boolean") {
    state.muted = saved.muted;
    el.audio.muted = state.muted;
    updateVolumeUI();
  }

  const shouldAutoplay = saved.isPlaying === true;
  loadTrack(state.playlistId, state.trackIndex, { autoplay: shouldAutoplay });

  if (typeof saved.currentTime === "number" && saved.currentTime > 0) {
    const restoreTime = () => {
      if (isFinite(el.audio.duration) && saved.currentTime < el.audio.duration) {
        el.audio.currentTime = saved.currentTime;
        updateProgress();
      }
    };
    if (el.audio.readyState >= 1) {
      restoreTime();
    } else {
      el.audio.addEventListener("loadedmetadata", restoreTime, { once: true });
    }
  }

  return true;
}

/* -----------------------------------------------------------
   AUDIO ENGINE
----------------------------------------------------------- */
function formatTime(sec) {
  if (!isFinite(sec) || sec < 0) sec = 0;
  const m = Math.floor(sec / 60);
  const s = Math.floor(sec % 60)
    .toString()
    .padStart(2, "0");
  return `${m}:${s}`;
}

function loadTrack(playlistId, index, { autoplay = true } = {}) {
  const playlist = musicLibrary[playlistId];
  const track = playlist.tracks[index];
  if (!track) return;

  state.playlistId = playlistId;
  state.trackIndex = index;

  // Background video: only swap when the playlist (album) actually changes
  setBackgroundVideo(playlist.background);

  el.audio.src = track.audio;
  el.audio.load();
  el.audioUnavailable.classList.add("hidden");

  updateMeta();
  renderTrackList();

  if (autoplay) playTrack();
  else pauseTrack();

  saveState();
}

function playTrack() {
  el.audio
    .play()
    .then(() => {
      state.isPlaying = true;
      updatePlayUI();
      saveState();
    })
    .catch(() => {
      // Autoplay blocked — wait for first interaction (handled in initAutoplayUnlock)
      state.isPlaying = false;
      updatePlayUI();
      saveState();
    });
}

function pauseTrack() {
  el.audio.pause();
  state.isPlaying = false;
  updatePlayUI();
  saveState();
}

function togglePlay() {
  if (state.isPlaying) pauseTrack();
  else playTrack();
}

function nextTrack() {
  const tracks = musicLibrary[state.playlistId].tracks;
  let idx;
  if (state.shuffle && tracks.length > 1) {
    do {
      idx = Math.floor(Math.random() * tracks.length);
    } while (idx === state.trackIndex);
  } else {
    idx = (state.trackIndex + 1) % tracks.length;
  }
  loadTrack(state.playlistId, idx, { autoplay: true });
}

function previousTrack() {
  const tracks = musicLibrary[state.playlistId].tracks;
  if (el.audio.currentTime > 3) {
    el.audio.currentTime = 0;
    return;
  }
  const idx = (state.trackIndex - 1 + tracks.length) % tracks.length;
  loadTrack(state.playlistId, idx, { autoplay: true });
}

function seek(fraction) {
  if (!isFinite(el.audio.duration)) return;
  el.audio.currentTime = fraction * el.audio.duration;
  updateProgress();
  saveState();
}

function setVolume(v) {
  state.volume = Math.min(1, Math.max(0, v));
  el.audio.volume = state.volume;
  state.muted = state.volume === 0;
  updateVolumeUI();
  saveState();
}

function toggleMute() {
  state.muted = !state.muted;
  el.audio.muted = state.muted;
  updateVolumeUI();
  saveState();
}

function updateProgress() {
  const { currentTime, duration } = el.audio;
  const pct = duration ? (currentTime / duration) * 100 : 0;
  el.progressFill.style.width = `${pct}%`;
  el.progressBar.setAttribute("aria-valuenow", Math.round(pct));
  el.currentTime.textContent = formatTime(currentTime);
  el.duration.textContent = formatTime(duration);
}

/* -----------------------------------------------------------
   UI SYNC HELPERS
----------------------------------------------------------- */
function updateMeta() {
  const playlist = musicLibrary[state.playlistId];
  const track = currentTrack();

  el.albumTitle.textContent = playlist.title;
  el.albumYear.textContent = playlist.year || track.year || "";
  el.currentTrackTitle.textContent = track.title;
  el.overlayAlbumTitle.textContent = playlist.title;
  el.overlayAlbumYear.textContent = playlist.year || "";

  el.trackIndexLabel.textContent = `${String(state.trackIndex + 1).padStart(2, "0")} / ${String(
    playlist.tracks.length,
  ).padStart(2, "0")}`;

  document.title = `${track.title} — The Local Train`;

  el.playlistBtns.forEach((btn) => {
    btn.classList.toggle(
      "active-playlist",
      btn.dataset.playlist === state.playlistId,
    );
  });
}

function updatePlayUI() {
  el.playIcon.classList.toggle("hidden", state.isPlaying);
  el.pauseIcon.classList.toggle("hidden", !state.isPlaying);
  el.playPauseBtn.setAttribute(
    "aria-label",
    state.isPlaying ? "Pause" : "Play",
  );
  el.trackStatus.textContent = state.isPlaying ? "Playing" : "Paused";
}

function updateVolumeUI() {
  const isSilent = state.muted || state.volume === 0;
  el.volIcon.classList.toggle("hidden", isSilent);
  el.muteIcon.classList.toggle("hidden", !isSilent);
  el.muteBtn.setAttribute("aria-pressed", String(isSilent));
  el.volumeSlider.value = Math.round((state.muted ? 0 : state.volume) * 100);
}

function renderTrackList() {
  const playlist = musicLibrary[state.playlistId];
  el.trackList.innerHTML = "";
  playlist.tracks.forEach((track, i) => {
    const li = document.createElement("li");
    li.className =
      "track-item" + (i === state.trackIndex ? " active-track" : "");
    li.setAttribute("role", "listitem");
    li.tabIndex = 0;
    li.innerHTML = `
      <span class="track-num">${String(i + 1).padStart(2, "0")}</span>
      <span class="track-indicator">●</span>
      <span class="track-name">${track.title}</span>
    `;
    const activate = () => {
      loadTrack(state.playlistId, i, { autoplay: true });
      closeOverlays();
    };
    li.addEventListener("click", activate);
    li.addEventListener("keydown", (e) => {
      if (e.key === "Enter" || e.key === " ") {
        e.preventDefault();
        activate();
      }
    });
    el.trackList.appendChild(li);
  });
}

/* -----------------------------------------------------------
   OVERLAYS
----------------------------------------------------------- */
function openMenu() {
  el.menuOverlay.classList.add("open");
  el.menuOverlay.setAttribute("aria-hidden", "false");
  el.menuToggle.setAttribute("aria-expanded", "true");
}
function openTrackList() {
  renderTrackList();
  el.trackListOverlay.classList.add("open");
  el.trackListOverlay.setAttribute("aria-hidden", "false");
}
function closeOverlays() {
  [el.menuOverlay, el.trackListOverlay].forEach((o) => {
    o.classList.remove("open");
    o.setAttribute("aria-hidden", "true");
  });
  el.menuToggle.setAttribute("aria-expanded", "false");
}
function overlaysOpen() {
  return (
    el.menuOverlay.classList.contains("open") ||
    el.trackListOverlay.classList.contains("open")
  );
}

/* -----------------------------------------------------------
   EVENT WIRING
----------------------------------------------------------- */
function switchPlaylist(id) {
  if (!musicLibrary[id]) return;
  loadTrack(id, 0, { autoplay: true });
  openTrackList();
}

el.playlistBtns.forEach((btn) => {
  btn.addEventListener("click", () => switchPlaylist(btn.dataset.playlist));
});

el.menuOverlay.querySelectorAll("[data-playlist]").forEach((btn) => {
  btn.addEventListener("click", () => {
    switchPlaylist(btn.dataset.playlist);
  });
});

el.menuToggle.addEventListener("click", () => {
  if (el.menuOverlay.classList.contains("open")) closeOverlays();
  else openMenu();
});

el.currentTrackTitle.addEventListener("click", openTrackList);
el.albumTitle.addEventListener("click", openTrackList);

el.closeOverlayBtns.forEach((btn) =>
  btn.addEventListener("click", closeOverlays),
);

el.playPauseBtn.addEventListener("click", togglePlay);
el.prevBtn.addEventListener("click", previousTrack);
el.nextBtn.addEventListener("click", nextTrack);

el.shuffleBtn.addEventListener("click", () => {
  state.shuffle = !state.shuffle;
  el.shuffleBtn.setAttribute("aria-pressed", String(state.shuffle));
  saveState();
});

el.repeatBtn.addEventListener("click", () => {
  state.repeat = !state.repeat;
  el.repeatBtn.setAttribute("aria-pressed", String(state.repeat));
  saveState();
});

el.muteBtn.addEventListener("click", toggleMute);
el.volumeSlider.addEventListener("input", (e) =>
  setVolume(e.target.value / 100),
);

function seekFromEvent(e) {
  const rect = el.progressBar.getBoundingClientRect();
  const clientX = e.touches ? e.touches[0].clientX : e.clientX;
  const fraction = Math.min(1, Math.max(0, (clientX - rect.left) / rect.width));
  seek(fraction);
}
el.progressBar.addEventListener("click", seekFromEvent);
el.progressBar.addEventListener("keydown", (e) => {
  if (!isFinite(el.audio.duration)) return;
  if (e.key === "ArrowRight")
    el.audio.currentTime = Math.min(
      el.audio.duration,
      el.audio.currentTime + 5,
    );
  if (e.key === "ArrowLeft")
    el.audio.currentTime = Math.max(0, el.audio.currentTime - 5);
});

/* Audio element events */
let lastSaveTimestamp = 0;
el.audio.addEventListener("timeupdate", () => {
  updateProgress();
  const now = Date.now();
  if (now - lastSaveTimestamp > 3000) {
    lastSaveTimestamp = now;
    saveState();
  }
});
el.audio.addEventListener("loadedmetadata", updateProgress);
el.audio.addEventListener("play", () => {
  state.isPlaying = true;
  updatePlayUI();
  saveState();
});
el.audio.addEventListener("pause", () => {
  state.isPlaying = false;
  updatePlayUI();
  saveState();
});
el.audio.addEventListener("ended", () => {
  if (state.repeat) {
    el.audio.currentTime = 0;
    playTrack();
  } else {
    nextTrack();
  }
  saveState();
});
el.audio.addEventListener("error", () => {
  el.audioUnavailable.classList.remove("hidden");
  state.isPlaying = false;
  updatePlayUI();
  saveState();
});

/* Window lifecycle persistence */
window.addEventListener("beforeunload", saveState);
window.addEventListener("pagehide", saveState);
document.addEventListener("visibilitychange", () => {
  if (document.visibilityState === "hidden") saveState();
});

/* -----------------------------------------------------------
   KEYBOARD SHORTCUTS
----------------------------------------------------------- */
document.addEventListener("keydown", (e) => {
  const tag = (e.target && e.target.tagName) || "";
  if (tag === "INPUT" || tag === "TEXTAREA" || e.target.isContentEditable)
    return;

  switch (e.key) {
    case " ":
      e.preventDefault();
      togglePlay();
      break;
    case "ArrowRight":
      if (e.shiftKey)
        el.audio.currentTime = Math.min(
          el.audio.duration || 0,
          el.audio.currentTime + 5,
        );
      else nextTrack();
      break;
    case "ArrowLeft":
      if (e.shiftKey)
        el.audio.currentTime = Math.max(0, el.audio.currentTime - 5);
      else previousTrack();
      break;
    case "m":
    case "M":
      toggleMute();
      break;
    case "a":
    case "A":
      if (overlaysOpen()) closeOverlays();
      else openMenu();
      break;
    case "Escape":
      closeOverlays();
      break;
  }
});

/* -----------------------------------------------------------
   CURSOR GLOW (desktop only, respects reduced motion)
----------------------------------------------------------- */
if (!state.isTouch && !state.reducedMotion) {
  window.addEventListener("mousemove", (e) => {
    el.cursorGlow.style.left = `${e.clientX}px`;
    el.cursorGlow.style.top = `${e.clientY}px`;
    el.cursorGlow.classList.add("visible");
  });
  window.addEventListener("mouseleave", () =>
    el.cursorGlow.classList.remove("visible"),
  );
}

/* -----------------------------------------------------------
   AUTOPLAY UNLOCK — if autoplay is blocked, resume on first
   user interaction anywhere on the page.
----------------------------------------------------------- */
function initAutoplayUnlock() {
  const unlock = () => {
    if (!state.isPlaying) playTrack();
    [el.videoA, el.videoB].forEach((v) => {
      configureBackgroundVideo(v);
      v.play().catch(() => {});
    });
    document.removeEventListener("click", unlock);
    document.removeEventListener("touchstart", unlock);
    document.removeEventListener("keydown", unlock);
  };
  document.addEventListener("click", unlock, { once: true });
  document.addEventListener("touchstart", unlock, { once: true });
  document.addEventListener("keydown", unlock, { once: true });
}

/* -----------------------------------------------------------
   INIT
----------------------------------------------------------- */
function init() {
  [el.videoA, el.videoB].forEach((video) => {
    if (!video) return;
    configureBackgroundVideo(video);
    video.addEventListener("play", () => configureBackgroundVideo(video));
    video.addEventListener("loadeddata", () => configureBackgroundVideo(video));
    video.addEventListener("ratechange", () => {
      if (video.playbackRate !== BG_VIDEO_SPEED) {
        video.playbackRate = BG_VIDEO_SPEED;
      }
    });
  });

  el.audio.volume = state.volume;
  updateVolumeUI();

  const restored = restoreSavedState();
  if (!restored) {
    loadTrack(state.playlistId, state.trackIndex, { autoplay: true });
  }

  initAutoplayUnlock();

  window.setTimeout(() => {
    el.loadingScreen.classList.add("fade-out");
    el.app.classList.add("visible");
    setTimeout(() => el.loadingScreen.remove(), 950);
  }, 700);
}

document.addEventListener("DOMContentLoaded", init);
