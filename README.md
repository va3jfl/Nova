# NOVA — Browser Robot Assistant (v1.7)

A fully in-browser voice assistant with a retro CRT robot face.
Everything runs locally in the browser: LFM2 brain via wllama
(multithreaded WASM llama.cpp), Whisper ears via transformers.js
(in a Web Worker), and the browser's built-in speech for her voice.

Live Demo: https://hamradiostudio.com/nova

## Files

    nova.html            the entire app (single file)
    .htaccess            Apache headers → enables multithreaded WASM
    proxy.php            whitelisted RSS fetcher for the news skill
    serve.py             local test server (python3 serve.py → localhost:8000)
    skills/              plugin folder — drop .js skills here
      manifest.json      list of skill files to load at boot
      *.js               9 example/starter skills incl. a template

## Deploy (Apache, e.g. yourserver.net)

Upload nova.html, .htaccess, proxy.php, and the skills/ folder into the
same directory. That's it. The .htaccess sends the two headers
(COOP/COEP) that unlock SharedArrayBuffer multithreading — needs
mod_headers, standard on shared hosting.

## Run locally

    python3 serve.py
    → open http://localhost:8000/nova.html

Opening nova.html as a plain file:// also works, but the brain falls
back to single-threaded mode and the /skills folder can't be read.

## First boot

Press POWER ON, allow the microphone, and wait for the downloads
(brain ~730 MB + ears ~40 MB, cached by the browser after the first
time). Then say "Nova" — or use PUSH TO TALK (spacebar).

## The basics

- Wake word "Nova" (changeable in settings) + ~30 s rolling audio buffer,
  so "Nova, what time is it" works in one breath.
- Say "Nova" while she's talking to interrupt her (barge-in).
- After she answers, the mic stays open ~3 s for follow-ups.
- "What can you do" lists the skills; the settings gear shows every
  skill with example phrases. 42 skills ship in this bundle.
- Settings are session-only by default; the "remember between visits"
  toggle keeps them (plus facts, lists, alarms, scores) in the browser.
- Appliance mode: auto-boot on page load (?kiosk or the settings toggle),
  fullscreen button, clock screensaver, screen wake-lock.
- AI DJ: scheduled announcements (time/weather/news/jokes/facts/your own
  lines) that duck the music like station breaks.

## Writing skills

Skills are single .js files calling NOVA.registerSkill — see
skills/compliment.js for the documented template. Three wiring styles:
ctx.reply (direct answer), ctx.brain (hand data to the LLM to phrase),
ctx.openModule (take over the CRT screen). Advanced: NOVA.llm (one-shot
brain call) and NOVA.listen (catch the next utterance) for multi-turn
games — see skills/twenty-questions.js. Add the filename to
skills/manifest.json and reload. Only install skill files you trust.

## Models (settings → BRAIN & EARS)

- Brain: LFM2-700M (fast) / LFM2-1.2B (default) / LFM2-2.6B (smart),
  or any custom .gguf URL (2 GB max).
- Ears: whisper-tiny (default) or whisper-base (more accurate).

NOVA is an experimental AI assistant — it can mishear and make mistakes.
Verify anything important.
