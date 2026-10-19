# 🐇 RPG Dungeons — The Rabbit Hole

<img width="1672" height="941" alt="de156a8d-472b-4dd7-9817-989e82a1cd87" src="https://github.com/user-attachments/assets/5c551c76-65f8-47d8-9941-99ed39374c29" />


*A roguelike that lives inside your character's dreams.*

Every character has their own dream: **six rabbit holes, six relics from their life, and six companions** drawn from their world.

Descend into the unknown, choose your path, gather relics, summon companions and uncover the stories hidden beneath the surface. Each hole remembers your previous dives.

**Your roleplay stays untouched.** The dream exists alongside your story, never inside its main chat.

![version](https://img.shields.io/badge/version-4.9.1-8a2c23) ![languages](https://img.shields.io/badge/UI-English%20·%20Русский-b8902f)

---

## 📦 Getting Started

1. In SillyTavern, go to **Extensions → Install Extension** and paste this repository's URL.
2. Open a chat and configure an API connection using any OpenAI-compatible endpoint.
3. Click the **🐇 rabbit button** in the corner to enter the dream.

The first dive forges that character's world and companions. Each character has a separate dream, shared between their solo chat and group chats.

---

## 🕳️ How to Play

<img width="772" height="749" alt="Screenshot_11" src="https://github.com/user-attachments/assets/336258b3-d8fa-4544-b016-272d8d852887" />


Each dive generates **four scenes at a time**, with the next stretch remembering what happened before.

- **🧭 Explore carefully.** Each rabbit hole has a hidden temper that determines what it punishes. Learn its patterns as you descend.
- **💗 Watch your Nerve.** It drains with every step and drops sharply when you fail. Run out, and your dive ends.
- **🔄 Try again.** Spend Nerve to retry a failed turn.
- **🤝 Choose your companions.** Pick who acts and which skill they use. Their ultimate skill works once per dive; a companion who fails is unavailable until you surface.
- **🔮 Upgrade your relics.** Levelled relics unlock sealed paths and make dangerous choices more manageable.
- **⬆️ Decide when to leave.** Every four steps, bank your rewards or descend further. Fall, and half your haul remains in the dark.
- **🕯️ Follow the traces.** Each hole remembers past dives and leaves traces along the way.

Careful decisions matter. The deeper you go, the greater the risk — and the potential reward.

---

## 🧳 Between Dives

<img width="661" height="715" alt="Screenshot_16" src="https://github.com/user-attachments/assets/b62951c6-f1f6-45b0-add2-0136bdaaf7d1" />

Your progress continues outside the rabbit holes.

- **✨ Summon** — spend tickets earned from dives to recruit companions. A 5★ companion has a 3% base rate and a guaranteed 5★ by pull 40; a 4★ is guaranteed at least every 8 pulls. Duplicates awaken companions and unlock their next story chapter.
- **🔮 Relics** — upgrade relics with shards, up to level 6.
- **⚔️ Abyss** — fight turn-based battles with your party using each companion's unique skills.
- **📖 Dossier** — browse a companion's profile, skills, relic, story and chronicle. Export companions as **W++ cards**, full character cards, SillyTavern-compatible PNG cards, or lorebook entries.

Companion stories are generated **when you open their dossier**, rather than all at once.

---

## 👥 Your Companions, Your Cast

Choose how companions are created in the settings:

- **🎭 Cast:** *However it falls* for a mixed cast, *Otome* for adult men only, or *Gal game* for adult women only.
- **🎂 Age:** choose 18–25, 18–32 or 18–45. All companions are adults.
- **✍️ Your own notes:** describe the setting, era, appearance, naming style or anything else you want the AI to prioritize.

These settings apply when the dream is forged. To create a new cast, clear the companions in **GM mode** and forge them again.

---

## 🖼️ Character Portraits

Portraits are **off by default**. Enable them under **🖼️ Character portraits**.

### ☁️ Cloud Generation

Choose the request format that matches your provider:

| Format | For |
|---|---|
| OpenAI Images (`/images/generations`) | OpenAI, NavyAI and most compatible proxies |
| OpenRouter / chat image | Gemini and Grok image models |

### 🖥️ Local Generation — ComfyUI

Start ComfyUI with CORS enabled:

```bash
python main.py --enable-cors-header http://127.0.0.1:8000
```

Choose **ComfyUI** as the image type, enter your server address (usually `http://127.0.0.1:8188`) and click **🔌 Check**.

Models, LoRAs, samplers and schedulers are read directly from ComfyUI — no need to enter them manually.

- **⚙️ Automatic workflow** — builds the graph from your settings using core nodes only.
- **✨ Second pass** — upscales and refines the image for sharper faces and eyes.
- **🧩 Custom workflow** — paste a workflow exported with **Save (API Format)**.

Supported placeholders: `%prompt%`, `%negative%`, `%seed%`, `%width%`, `%height%`, `%ckpt%`, `%lora%`, `%lora_strength%`.

If **Character Lens** is already configured with ComfyUI, its address is detected automatically. Character Lens is optional.

If generation fails, the extension retries when a retry may help. The reason for the failure appears in the companion's dossier.

---

## ⚙️ Good to Know

- **💬 Separate from roleplay.** Nothing is injected into your main chat prompt.
- **🔑 API connection.** Leave the API key empty to reuse one from another Tavern RPG Suite extension. **Test connection** checks the endpoint through `/models` without generating anything.
- **🌐 Language.** One setting controls the interface and AI-generated content. Enable *Let the AI write in a different language* to use separate languages.
- **💾 Progress and storage.** Progress is saved in SillyTavern's extension settings per character. Portraits live in browser storage, keeping the settings file small.
- **🎵 Sound.** Synthesized on the fly and disabled by default.

---
## ✨ Screenshots

<img width="1909" height="874" alt="Screenshot_12" src="https://github.com/user-attachments/assets/93d3e191-7e63-47ca-8899-9f6d687d37fb" />
