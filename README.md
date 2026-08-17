# The Local Train — Interactive Music Archive

A cinematic, minimal single-page listening experience for The Local Train. Plain HTML + Tailwind (CDN) + vanilla JS. No build step, no backend.

## Run it locally

Any static server works, e.g. from this folder:

```
python3 -m http.server 8080
```

Then open `http://localhost:8080`. (Opening `index.html` directly also works in most browsers, though some enforce stricter autoplay/CORS rules over `file://`.)

## 1. Add MP3 files

Drop audio files into `assets/audio/` using the filenames already referenced in `js/app.js` (e.g. `assets/audio/manzil.mp3`), or point each track's `audio` field at wherever you're hosting the files. If a file is missing or fails to load, the UI shows a small "Audio unavailable" notice instead of breaking.

## 2. Add licensed lyrics

Open `js/app.js` and find `musicLibrary`. Each track has a `lyrics` array of `{ time, roman, hindi }` objects. Replace the placeholder `"[Lyrics line N]"` / `"[हिंदी पंक्ति N]"` strings with lyrics you hold the rights to use, and set `time` to the timestamp (in seconds) each line should appear. Lines are matched automatically against `audio.currentTime`.

## 3. Add another album

Add a new key to `musicLibrary`, following the existing shape:

```js
newalbum: {
  id: "newalbum",
  title: "Album Title",
  year: "2020",
  background: "https://...mp4",
  tracks: [
    { title: "Track One", audio: "/assets/audio/track-one.mp3", lyrics: placeholderLyrics() },
  ],
},
```

Then add a matching nav button in `index.html` (`data-playlist="newalbum"`) in both the bottom playlist nav and the menu overlay — the rest of the UI (track list, background video, metadata) renders automatically from the data object.

## 4. Change a background video

Update the `background` URL on the relevant album/playlist entry in `musicLibrary`. Playback crossfades between the two `<video>` layers automatically; switching tracks within the same album does not reload the video.

## 5. Notes

- Keyboard: Space (play/pause), ←/→ (prev/next, hold Shift to seek), M (mute), L (toggle lyrics), A (album browser), Esc (close overlays).
- Respects `prefers-reduced-motion`.
- If a browser blocks autoplay, playback resumes automatically on the visitor's first click/tap/keypress.
