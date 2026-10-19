import { eventSource, event_types, saveSettingsDebounced, characters, name1, setExtensionPrompt, extension_prompt_types, extension_prompt_roles } from '../../../../script.js';
import { extension_settings, getContext } from '../../../extensions.js';

const MODULE_NAME = 'rpg_dungeons';
/* Держится рядом с manifest.json и проверяется тестом: раньше номер в панели был
   вписан руками и отстал от манифеста на две версии. */
const VERSION = '4.9.0';

/* ---------- интерфейс: русский / английский ----------
   Ключ словаря — русская строка, значение — английская.
   T() возвращает перевод при uiLang='en' и оригинал при 'ru'. */
const EN = {
    ", выбито": ", rolled",
    "» — и что мастей у него": "» — and how many suits it has",
    "возраст": "age",
    "Данжи": "Dungeons",
    "Призыв": "Summon",
    "Нора": "Burrow",
    "Досье": "Dossier",
    "КРОЛИЧЬЯ НОРА": "THE RABBIT HOLE",
    "МИР ЕЩЁ НЕ ВЫКОВАН": "WORLD NOT FORGED YET",
    "ПРИЗЫВ": "SUMMON",
    "ЗАЛ ЕЩЁ ПУСТ": "THE HALL IS EMPTY",
    "ДОСЬЕ": "DOSSIER",
    "ГЕРОИ · АРТЕФАКТЫ · ИСТОРИИ": "COMPANIONS · RELICS · STORIES",
    "ВНИЗ ПО СПИРАЛИ · СБОР ОТРЯДА": "DOWN THE SPIRAL · GATHER YOUR PARTY",
    "ВЫБОР НОРЫ": "CHOOSE A HOLE",
    "ЗАХОД · ": "DIVE · ",
    "Здесь начинается сон": "This is where the dream begins",
    "✦ Открыть нору": "✦ Open the hole",
    "✦ Выковать мир": "✦ Forge the world",
    "✦ Выковать спутников": "✦ Forge companions",
    "Нора роется…": "The hole is being dug…",
    "Кузница работает…": "The forge is working…",
    "Кузница кует спутников…": "Forging companions…",
    "СПУТНИКИ НЕ ВЫКОВАНЫ": "COMPANIONS NOT FORGED",
    "Мир выкован. Нора ждёт.": "The world is forged. The hole is waiting.",
    "Спутники выкованы — они ждут в Призыве.": "Companions forged — they are waiting in Summon.",
    "Крутка ×1": "Pull ×1",
    "Крутка ×10": "Pull ×10",
    "1 крутка": "1 ticket",
    "10 круток": "10 tickets",
    "ГАРАНТ 4★+": "GUARANTEED 4★+",
    "ЛИМИТ-БАННЕР": "LIMITED BANNER",
    "Крутить ещё": "Pull again",
    "К баннеру": "Back to banner",
    "открыть всё": "reveal all",
    "нажми на карту, чтобы открыть": "tap a card to reveal",
    "нажми, чтобы продолжить": "tap to continue",
    "Не хватает круток — их выносят из нор.": "Not enough tickets — you bring them up from the holes.",
    "Осколки эфира": "Aether shards",
    "для прокачки артефактов": "for upgrading relics",
    "Пыль удачи": "Dust of luck",
    "материалы прокачки": "upgrade materials",
    "ПРОБУЖДЕНИЕ": "AWAKENING",
    "НЕТ": "NO",
    "ОТРЯД · ": "PARTY · ",
    "ДОСТУПНЫЕ ГЕРОИ · ТАПНИ, ЧТОБЫ ДОБАВИТЬ": "AVAILABLE COMPANIONS · TAP TO ADD",
    "выбрать": "choose",
    "в Призыве": "in Summon",
    "СИЛА ОТРЯДА ": "PARTY POWER ",
    "снижает шанс срыва в норе": "lowers the chance of a fall",
    "В отряде не больше трёх.": "No more than three in the party.",
    "Сначала выбери хотя бы одного спутника в отряд.": "Pick at least one companion for your party first.",
    "СПУТНИКИ ЕЩЁ НЕ ВЫКОВАНЫ — ЗАГЛЯНИ В ПРИЗЫВ": "COMPANIONS NOT FORGED YET — CHECK SUMMON",
    "ГЕРОИ ВЫПАДАЮТ ИЗ КРУТОК В ПРИЗЫВЕ — НО ВНИЗ МОЖНО И ОДНОЙ": "COMPANIONS DROP FROM PULLS IN SUMMON — BUT YOU CAN GO DOWN ALONE",
    "С ТОБОЙ": "WITH YOU",
    "Ты": "You",
    "сбежать": "flee",
    "· собери отряд во вкладке «Нора»": "· gather a party in the Burrow tab",
    "ПРОТИВНИКИ": "ENEMIES",
    "ТВОЯ КОМАНДА · выбери активного": "YOUR PARTY · pick the active one",
    "уйти наверх": "go back up",
    "Удар": "Strike",
    "Приём": "Skill",
    "Защита": "Guard",
    "Ульта": "Ultimate",
    "+ульта": "+ult",
    "сильнее": "stronger",
    "−урон": "−damage",
    "по всем": "all foes",
    "ЗАЩИТА": "GUARD",
    "БОСС": "BOSS",
    "рядовой": "regular",
    "УЛЬТА!": "ULT READY!",
    "ВИТОК ПРОЙДЕН": "SPIRAL CLEARED",
    "ОТРЯД ПАЛ": "THE PARTY FELL",
    "Глубже": "Deeper",
    "Ещё раз": "Again",
    "Наверх": "Back up",
    "Ты выбралась наверх — виток не зачтён.": "You climbed out — the spiral does not count.",
    "Дождись конца хода.": "Wait for the turn to finish.",
    "Тень в проёме": "A shadow in the doorway",
    "Шёпот за спиной": "A whisper behind you",
    "Тот, кто считает шаги": "The one who counts your steps",
    "Двойник": "The double",
    "Смотритель витка": "Keeper of the spiral",
    "Хозяин норы": "Master of the hole",
    "КРУТКИ": "TICKETS",
    "ОСКОЛКИ": "SHARDS",
    "МАТЕРИАЛЫ": "MATERIALS",
    "Обзор": "Overview",
    "Умения": "Skills",
    "Артефакт": "Relic",
    "История": "Story",
    "Хроника": "Chronicle",
    "Карта": "Card",
    "Реликвии": "Relics",
    "КТО ЭТО": "WHO THEY ARE",
    "РОЛЬ": "ROLE",
    "ВОЗРАСТ": "AGE",
    "ВНЕШНОСТЬ": "LOOKS",
    "ВОЛОСЫ": "HAIR",
    "ГЛАЗА": "EYES",
    "МАСТЬ": "SUIT",
    "РЕДКОСТЬ": "RARITY",
    "СИЛА": "POWER",
    "ТРИ УМЕНИЯ": "THREE SKILLS",
    "БАЗОВЫЙ": "BASIC",
    "УМЕНИЕ": "SKILL",
    "УЛЬТА": "ULTIMATE",
    "6 ПРОБУЖДЕНИЙ · ЗА ДУБЛИКАТЫ": "6 AWAKENINGS · FROM DUPLICATES",
    "УМЕНИЯ ЕЩЁ НЕ ВЫКОВАНЫ": "SKILLS NOT FORGED YET",
    "УНИКАЛЬНЫЙ АРТЕФАКТ": "UNIQUE RELIC",
    "Прокачать": "Upgrade",
    "Максимум": "Maxed",
    "Сменить вид/имя": "Change look/name",
    "предел": "limit",
    "уровень ": "level ",
    "+сила в бою и в Норе": "+power in combat and in the hole",
    "осколков: ": "shards: ",
    "РЕЛИКВИИ ЭТОГО МИРА": "RELICS OF THIS WORLD",
    "хранит: ": "kept by: ",
    "ЧЕМ ВЫШЕ УРОВЕНЬ — ТЕМ БОЛЬШЕ ЗАКРЫТЫХ ПУТЕЙ ОТКРЫТО И ТЕМ РЕЖЕ СРЫВАЮТСЯ РИСКИ": "THE HIGHER THE LEVEL — THE MORE LOCKED PATHS OPEN AND THE RARER THE FALLS",
    "ИСТОРИЯ · ОТКРЫВАЕТСЯ ПО ПРОБУЖДЕНИЯМ": "STORY · UNLOCKED BY AWAKENINGS",
    "Переписать главы": "Rewrite chapters",
    "Дописать недостающие": "Write missing chapters",
    "ИИ пишет…": "AI is writing…",
    "Закрытая глава": "Locked chapter",
    "Глава": "Chapter",
    "Главы переписаны.": "Chapters rewritten.",
    "Недостающих глав нет — все уже написаны.": "No missing chapters — they're all written.",
    "Недостающие главы дописаны.": "Missing chapters written in.",
    "Дописаны не все главы — попробуй ещё раз для остальных.": "Not all of them got written — try again for the rest.",
    "главы вышли короткими — можно переписать": "chapters came out short — you can rewrite them",
    "Глава ещё не написана.": "This chapter is not written yet.",
    "ГЛАВЫ ЭТОГО ГЕРОЯ ЕЩЁ НЕ НАПИСАНЫ": "THIS COMPANION HAS NO CHAPTERS YET",
    "ХРОНИКА НОРЫ · ПОПОЛНЯЕТСЯ ПОСЛЕ ЗАХОДОВ": "CHRONICLE · FILLS UP AFTER EACH DIVE",
    "ПОКА НИ ОДНОГО СПУСКА": "NO DIVES YET",
    "СРЫВ": "FELL",
    "ВЫШЛИ": "CLIMBED OUT",
    "Досье запечатано": "Dossier sealed",
    "В Призыв": "To Summon",
    "Персонаж ещё не выпал — загляни в Призыв.": "This companion has not dropped yet — check Summon.",
    "W++ · короткая": "W++ · short",
    "Полная карта": "Full card",
    "Лорбук": "Lorebook",
    "Создать полную карту": "Create full card",
    "Пересоздать": "Recreate",
    "Собрать запись": "Build entry",
    "Пересобрать": "Rebuild",
    "Другой вид": "Another look",
    "Копировать": "Copy",
    "Сохранить": "Save",
    "Скачать PNG": "Download PNG",
    "В лорбук": "To lorebook",
    "Скопировано.": "Copied.",
    "Сохранено ✓": "Saved ✓",
    "Карта сохранена ✓": "Card saved ✓",
    "Полная карта готова.": "Full card is ready.",
    "Запись собрана.": "Entry built.",
    "краткая, из неё берётся портрет": "short version, the portrait comes from it",
    "подробная карточка для SillyTavern": "detailed card for SillyTavern",
    "запись [CHARACTER(...)] для World Info": "[CHARACTER(...)] entry for World Info",
    "запись обновится, если такая уже есть — дубля не будет": "an existing entry will be updated — no duplicates",
    "портрет уйдёт в PNG вместе с картой": "the portrait goes into the PNG with the card",
    "портрета ещё нет — PNG будет с подложкой": "no portrait yet — the PNG will use a backdrop",
    "⚠ облик изменился — портрет устарел, стоит перерисовать": "⚠ looks changed — the portrait is out of date",
    "⚠ облик изменился — перерисуй портрет": "⚠ looks changed — redraw the portrait",
    "портрет на месте": "portrait is set",
    "портрета ещё нет": "no portrait yet",
    "ИИ рисует портрет…": "AI is drawing the portrait…",
    "Записи ещё нет — нажми «Собрать запись»": "No entry yet — press “Build entry”",
    "Полной карты ещё нет — нажми «Создать полную карту»": "No full card yet — press “Create full card”",
    "ИИ ещё не написал карту": "The AI has not written the card yet",
    "PNG сохранён — его можно импортировать в SillyTavern.": "PNG saved — you can import it into SillyTavern.",
    "Сначала сгенерируй карту.": "Generate the card first.",
    "Нарисовать портрет": "Draw portrait",
    "Перерисовать портрет": "Redraw portrait",
    "Нарисовать реликвию": "Draw relic",
    "Перерисовать": "Redraw",
    "Своя картинка": "Your own image",
    "Убрать": "Remove",
    "Убрать портрет": "Remove portrait",
    "Портрет готов.": "Portrait is ready.",
    "Портрет вставлен.": "Portrait set.",
    "Картинка вставлена.": "Image set.",
    "Карточка реликвии готова.": "Relic card is ready.",
    "Реликвия перекована.": "Relic reforged.",
    "Включи портреты в настройках расширения.": "Enable portraits in the extension settings.",
    "Заполни URL и модель в настройках портретов.": "Fill in the URL and model in the portrait settings.",
    "Картинка тяжелее 3.5 МБ — возьми поменьше.": "The image is over 3.5 MB — pick a smaller one.",
    "Глубже в нору": "Deeper into the hole",
    "Выйти наверх": "Climb out",
    "Выход рядом": "The way out is close",
    "риск · случайно": "risk · chance",
    "безопасно": "safe",
    "ход ": "step ",
    "закрыто · ": "locked · ",
    "нужен ур. ": "needs lv. ",
    "Путь закрыт: ": "Path locked: ",
    "Ты проходишь дальше.": "You move on.",
    "Что-то пошло не так.": "Something went wrong.",
    "сорвался": "fell",
    "вышел": "climbed out",
    "Сначала закончи заход.": "Finish the dive first.",
    "Нора не открылась: ": "The hole did not open: ",
    " · попробуй ещё раз": " · try again",
    "ИИ не ответил": "the AI did not answer",
    "ИИ не ответил — попробуй ещё раз.": "The AI did not answer — try again.",
    "Кузница молчит — попробуй ещё раз.": "The forge is silent — try again.",
    "Сначала укажи API-ключ.": "Set your API key first.",
    "⚠ Точно? Ещё раз, чтобы стереть": "⚠ Sure? Click again to erase",
    "⚠ Точно? Ещё раз, чтобы сбросить": "⚠ Sure? Click again to reset",
    "круток": "tickets",
    "осколков": "shards",
    "мин. назад": "min. ago",
    "ч. назад": "h. ago",
    "дн. назад": "d. ago",
    "С возвращением!": "Welcome back!",
    "У тебя наготове:": "Ready and waiting:",
    "Есть что прокачать среди реликвий.": "There's a relic worth levelling up.",
    "🔊 Звук": "🔊 Sound",
    "Звуковые эффекты в бою и Призыве": "Sound effects in battle and the Summon",
    "Сначала укажи API-ключ в настройках расширения.": "Set your API key in the extension settings first.",
    "Открой чат с персонажем.": "Open a chat with a character.",
    "Сначала выкуй мир — открой нору.": "Forge the world first — open the hole.",
    "Впиши адрес ComfyUI в «URL API картинок», например http://127.0.0.1:8188": "Put the ComfyUI address into \"Image API URL\", e.g. http://127.0.0.1:8188",
    "Не достучалась до ComfyUI по адресу": "Couldn't reach ComfyUI at",
    "Он запущен? Нужен флаг --enable-cors-header, иначе браузер его не пустит.": "Is it running? It needs the --enable-cors-header flag, or the browser won't let the request through.",
    "В ComfyUI не нашлось ни одной модели — положи чекпойнт в models/checkpoints.": "ComfyUI has no models — put a checkpoint into models/checkpoints.",
    "ComfyUI отказался:": "ComfyUI refused:",
    "ComfyUI упал во время рисования:": "ComfyUI failed while drawing:",
    "ComfyUI не закончил за": "ComfyUI didn't finish within",
    "с. Задачу сняла с очереди.": "s. The job was taken off its queue.",
    "Свой воркфлоу — не JSON. В ComfyUI нужно «Save (API Format)».": "Your workflow isn't JSON. In ComfyUI use \"Save (API Format)\".",
    "В своём воркфлоу нет %prompt% — каждая картинка вышла бы одинаковой.": "Your workflow has no %prompt% — every picture would come out the same.",
    "ComfyUI — локально, на своей видеокарте": "ComfyUI — local, on your own GPU",
    "ещё не проверяли": "not checked yet",
    "🔌 Проверить": "🔌 Check",
    "Модель (чекпойнт)": "Model (checkpoint)",
    "Лора": "LoRA",
    "Сила": "Strength",
    "Сэмплер": "Sampler",
    "Планировщик": "Scheduler",
    "Шаги": "Steps",
    "Второй проход — чётче лицо и глаза, но дольше": "Second pass — sharper face and eyes, but slower",
    "Негативный промпт": "Negative prompt",
    "Свой воркфлоу (необязательно)": "Your own workflow (optional)",
    "Save (API Format) из ComfyUI · %prompt% %negative% %seed% %width% %height% %ckpt% %lora% %lora_strength%": "Save (API Format) from ComfyUI · %prompt% %negative% %seed% %width% %height% %ckpt% %lora% %lora_strength%",
    "первая по списку": "first in the list",
    "без лоры": "no LoRA",
    "проверяю…": "checking…",
    "адрес взят из Линзы": "address borrowed from Character Lens",
    "на связи": "connected",
    "моделей": "models",
    "лор": "LoRAs",
    "Пусто — ключ возьмётся из соседних расширений набора.": "Leave empty to borrow the key from a sibling extension of the suite.",
    "Модель — например deepseek/deepseek-chat": "Model — e.g. deepseek/deepseek-chat",
    "Температура": "Temperature",
    "Проверить связь": "Test connection",
    "🎭 Спутники": "🎭 Companions",
    "🔨 При ковке мира": "🔨 When forging the world",
    "Снятое можно сделать позже вручную — в Досье.": "Anything unticked can be done later by hand, in the Dossier.",
    "📖 Лорбук и карты": "📖 Lorebook & cards",
    "Работает с открытым чатом персонажа.": "Works on the character whose chat is open.",
    "Ключ взят из": "Key borrowed from",
    "Ключа нет — впиши свой или включи соседнее расширение с ключом.": "No key — enter your own, or enable a sibling extension that has one.",
    "Ключ не подошёл.": "The key was rejected.",
    "Провайдер ответил": "The provider answered",
    "ключ из": "key from",
    "модели": "model",
    "у провайдера нет": "isn't offered by this provider",
    "Не достучалась до": "Couldn't reach",
    "🌐 Язык": "🌐 Language",
    "ИИ пишет на другом языке": "Let the AI write in a different language",
    "Свои пожелания к касту": "Your own notes for the cast",
    "мир, эпоха, внешность, имена — что угодно своими словами": "world, era, looks, names — anything, in your own words",
    "Применяется при ковке.": "Applies at forging.",
    "Каст": "Cast",
    "Как сложится — разные люди, разный пол": "However it falls — mixed people, mixed genders",
    "Отоме — только взрослые мужчины": "Otome — adult men only",
    "Галге — только взрослые женщины": "Gal game — adult women only",
    "Возраст": "Age",
    "Запомнила. Уже выкованный каст не изменится — сотри его в ГМ-режиме и выкуй заново.": "Noted. The cast you already have won't change — wipe it in GM mode and forge again.",
    "ИИ не ответил.": "The AI didn't answer.",
    "Не дождались картинки за": "No picture came back within",
    "с. Картинки рисуются дольше текста — подними «Ожидание ответа» в настройках.": "s. Images take longer than text — raise \"Response timeout\" in the settings.",
    "Ключ не подошёл — проверь API-ключ для портретов.": "The key was rejected — check the API key for portraits.",
    "Провайдер не знает такой модели — проверь название модели.": "The provider doesn't know that model — check the model name.",
    "Провайдер ограничил частоту запросов. Подожди минуту и повтори.": "The provider rate-limited you. Wait a minute and try again.",
    "Провайдер отвечает ошибкой": "The provider is answering with error",
    "Повторяли несколько раз — не помогло. Это на его стороне, попробуй позже или смени модель.": "Retried several times, no luck. That one is on their side — try later or switch model.",
    "портрет уже рисуется. Если это зависло — нажми «Остановить» на чёрной полоске.": "that portrait is already being drawn. If it has hung, press \"Stop\" on the black bar.",
    "картинка уже рисуется. Если это зависло — нажми «Остановить» на чёрной полоске.": "that picture is already being drawn. If it has hung, press \"Stop\" on the black bar.",
    "провайдер икнул — повтор": "provider hiccup — retry",
    "Не получилось:": "Failed:",
    "причина написана в досье у каждого; повтори их по одному.": "the reason is in each one's dossier; retry them one at a time.",
    "Этот спутник уже выбыл из захода.": "That companion is already out of this dive.",
    "Ульту в этом заходе уже применяли.": "The ultimate has already been spent this dive.",
    "выбывает из этого захода.": "is out for the rest of this dive.",
    "Силы кончились. Нора выталкивает тебя наверх, и половина добычи остаётся в темноте.": "You are spent. The hole pushes you back up, and half the haul stays down in the dark.",
    "На это уже не хватает сил.": "There isn't enough left in you for that.",
    "на исходе": "running out",
    "едва держишься": "barely holding",
    "потрёпан": "worn down",
    "собран": "steady",
    "свеж": "sharp",
    "кончатся — заход окончен": "run out and the dive is over",
    "НЕРВЫ": "NERVE",
    " выбыл из захода": " is out of the dive",
    "выбыл из захода": "out of the dive",
    "Пошло не так": "It went wrong",
    "Ещё можно собраться и перехватить это — но сил такое стоит дорого, и их у тебя не бесконечно.": "You can still gather yourself and catch this — but it costs dearly, and you don't have endless left.",
    "Собраться и переиграть ход": "Gather yourself, take the turn again",
    "дорого по нервам": "costs nerve",
    "сил не хватает": "not enough left",
    "Принять как есть": "Let it stand",
    "ульта истрачена": "ultimate spent",
    "ИИ сейчас занят этим героем — дождись ответа.": "The AI is busy with this cast right now — wait for it to finish.",
    "ИИ сейчас занят этим персонажем — дождись ответа.": "The AI is busy with this character right now — wait for it to finish.",
    "ИИ сейчас занят — дождись ответа.": "The AI is busy right now — wait for it to finish.",
    "Сначала закончи заход — из норы так не уходят.": "Finish the dive first — you don't walk out of a hole like that.",
    "Идёт бой — сначала он закончится.": "A fight is on — let it finish first.",
    "сон": "dream of",
    "сон ": "dream of ",
    " · ещё не выкован": " · not forged yet",
    "ИИ ПРИДУМЫВАЕТ СПУТНИКОВ": "THE AI IS INVENTING COMPANIONS",
    "обычно 10–40 секунд · крутить можно уже сейчас": "usually 10–40 seconds · you can pull already",
    "НЕ УКАЗАН API-КЛЮЧ — СПУТНИКИ БЕЗ ИМЁН": "NO API KEY — COMPANIONS HAVE NO NAMES",
    "ИИ НЕ ОТВЕТИЛ — СПУТНИКИ ОСТАЛИСЬ БЕЗ ИМЁН": "THE AI DID NOT ANSWER — COMPANIONS HAVE NO NAMES",
    "СПУТНИКИ ЕЩЁ БЕЗ ИМЁН": "COMPANIONS STILL HAVE NO NAMES",
    "Оживить спутников": "Bring companions to life",
    "Повторить": "Retry",
    "крутки и бой работают, имена можно доковать в любой момент": "pulls and combat work — names can be forged any time",
    "ПОРТРЕТЫ, БАННЕР И ЛОР ПЕРСОНАЖЕЙ ГЕНЕРИРУЕТ ИИ ПО КАРТЕ ПЕРСОНАЖА": "PORTRAITS, BANNER AND LORE ARE GENERATED BY THE AI FROM THE CHARACTER CARD",
    "ИИ РИСУЕТ КАРТИНКИ · ": "THE AI IS DRAWING · ",
    "портреты спутников и карточки реликвий · можно не ждать": "companion portraits and relic cards · no need to wait",
    "Готово.": "Done.",
    "Нарисовано: ": "Drawn: ",
    "Автоматически (лорбук персонажа или чата)": "Automatic (character or chat lorebook)",
    "Не нашла модуль лорбуков в этой сборке Таверны.": "Could not find the lorebook module in this SillyTavern build.",
    "Не вижу активный лорбук. Открой его в World Info или выбери в настройках расширения.": "No active lorebook found. Open one in World Info or pick it in the extension settings.",
    "Не вышло записать в лорбук: ": "Could not write to the lorebook: ",
    "Открытых спутников пока нет.": "No unlocked companions yet.",
    "У всех открытых спутников карты уже есть.": "All unlocked companions already have cards.",
    "Карты готовы.": "Cards are ready.",
    "Включить": "Enable",
    "Язык генерации": "Generation language",
    "URL API картинок": "Image API URL",
    "Ключ API картинок": "Image API key",
    "Модель": "Model",
    "Размер (портрет 3:4)": "Size (3:4 portrait)",
    "Стиль": "Style",
    "Тип API": "API type",
    "Определить автоматически": "Detect automatically",
    "Включить генерацию портретов": "Enable portrait generation",
    "Ковать спутников (имена, лор, умения, истории)": "Forge companions (names, lore, skills, stories)",
    "Рисовать портреты спутников": "Draw companion portraits",
    "Рисовать карточки реликвий": "Draw relic cards",
    "Сразу писать полные карты персонажей": "Write full character cards right away",
    "Сразу добавлять записи в лорбук": "Add lorebook entries right away",
    "Кроличья нора": "The Rabbit Hole",
    "Выдано 10 круток.": "Granted 10 tickets.",
    "Выдано 50 круток.": "Granted 50 tickets.",
    "Выдано 500 осколков.": "Granted 500 shards.",
    "Выдано 100 материалов.": "Granted 100 materials.",
    "Все спутники открыты — проверяй Досье.": "All companions unlocked — check the Dossier.",
    "Пробуждение +1 — открылась следующая глава.": "Awakening +1 — the next chapter is open.",
    "Все реликвии на максимуме.": "All relics maxed out.",
    "Каст стёрт — открой Призыв, чтобы выковать заново.": "Cast wiped — open Summon to forge again.",
    "Сначала включи генерацию портретов.": "Enable portrait generation first.",
    "Пока нечего рисовать.": "Nothing to draw right now.",
    "Окно вернулось в центр.": "Window is back in the centre.",
    "ЧЕРВЫ": "HEARTS",
    "ПИКИ": "SPADES",
    "ТРЕФЫ": "CLUBS",
    "БУБНЫ": "DIAMONDS",
    "ЛЁГКИЙ": "EASY",
    "СРЕДНИЙ": "MEDIUM",
    "ТЯЖЁЛЫЙ": "HARD",
    "ХАРДКОР": "HARDCORE",
    "женщина": "woman",
    "мужчина": "man",
    "небинарный человек": "non-binary person",
    "Нора не знает, кто ты": "The hole does not know who you are",
    "ИИ читает карточку персонажа — это занимает 10–40 секунд": "The AI is reading the character card — takes 10–40 seconds",
    "сила реликвий": "relic power",
    "НОРЫ": "HOLES",
    "спусков": "dives",
    "Темнота впереди": "Darkness ahead",
    "Нора решает, что будет дальше…": "The hole is deciding what comes next…",
    "Новый заход": "New dive",
    "К норам": "Back to the holes",
    "До гаранта 5★:": "To guaranteed 5★:",
    "Гарант 4★ через:": "Guaranteed 4★ in:",
    "＋ЗВЕЗДА": "＋STAR",
    "✦ РЕЗУЛЬТАТ ПРИЗЫВА ✦": "✦ SUMMON RESULTS ✦",
    "ОТКРЫТЬ ВСЁ ✦": "REVEAL ALL ✦",
    "ВИТОК": "SPIRAL",
    "АРТЕФАКТ": "RELIC",
    "НАБОР": "SET",
    "нажми на карту · или": "tap a card · or",
    "достигнут": "reached",
    "осколки": "shards",
    "крутки": "tickets",
    "материалы": "materials",
    "Осколки": "Shards",
    "Крутки": "Tickets",
    "Материалы": "Materials",
    "ход": "step",
    "из": "of",
    "ур.": "lv.",
    "Кроличья нора (Данжи)": "The Rabbit Hole (Dungeons)",
    "Язык:": "Language:",
    "Русский": "Russian",
    "Английский": "English",
    "📜 Память": "📜 Memory",
    "📖 Лорбук": "📖 Lorebook",
    "🖼️ Портреты персонажей (ИИ)": "🖼️ Character portraits (AI)",
    "🎲 ГМ-режим · проверка": "🎲 GM mode · testing",
    "OpenAI images (/images/generations · api.navy, SD-прокси)": "OpenAI images (/images/generations · api.navy, SD proxies)",
    "OpenRouter / chat image (nano-banana, grok)": "OpenRouter / chat image (nano-banana, grok)",
    "Промпт портрета · {NAME} {LOOK} {ROLE} {SUIT} {STYLE} {SIZE}": "Portrait prompt · {NAME} {LOOK} {ROLE} {SUIT} {STYLE} {SIZE}",
    "Промпт реликвии · {NAME} {DESC} {STYLE} {SIZE}": "Relic prompt · {NAME} {DESC} {STYLE} {SIZE}",
    "🎨 Нарисовать всё недостающее": "🎨 Draw everything missing",
    "Только спутников": "Companions only",
    "Только реликвии": "Relics only",
    "📜 Полные карты всем спутникам": "📜 Full cards for all companions",
    "📖 Всех спутников в лорбук": "📖 All companions to lorebook",
    "+10 круток": "+10 tickets",
    "+50 круток": "+50 tickets",
    "+500 осколков": "+500 shards",
    "+100 материалов": "+100 materials",
    "✦ Выковать спутников (ИИ)": "✦ Forge companions (AI)",
    "🔓 Открыть всех героев": "🔓 Unlock all companions",
    "★ Пробуждение +1 всем": "★ Awakening +1 for everyone",
    "💎 Артефакты на максимум": "💎 Max out relics",
    "🧹 Обнулить героев": "🧹 Wipe companions",
    "♻ Перековать мир этого персонажа": "♻ Re-forge this character's world",
    "Глубина вставки:": "Injection depth:",
    "Открой чат с персонажем — мир куётся из его карточки.": "Open a chat with a character — the world is forged from their card.",
    "Сначала укажи API-ключ (или включи его в Tavern RPG Engine).": "Set your API key first (or enable it in Tavern RPG Engine).",
    "Незнакомец": "Stranger",
    "Умение": "Skill",
    "Подсказка": "Hint",
    "Пробный ход": "Test move",
    "Всё разом": "All at once",
    "лица не разглядеть": "the face cannot be made out",
    "Артефакт ": "Relic ",
    "Нора ": "Hole ",
    "Реликвия ": "Relic ",
    "хранитель «": "keeper of “",
    "Не вышло нарисовать: ": "Could not draw: ",
    "Не вышло собрать PNG: ": "Could not build the PNG: ",
    "Запись о ": "Entry for ",
    " добавлена в лорбук «": " added to lorebook “",
    "Рисую ": "Drawing ",
    "Пишу ": "Writing ",
    " портретов": " portraits",
    " реликвий": " relics",
    "… это займёт время.": "… this will take a while.",
    " карт… это займёт время.": " cards… this will take a while.",
    "ИИ перерисовал облик — статы не тронуты.": "The AI redrew the look — stats untouched.",
    "Облик обновлён — портрет стоит перерисовать.": "Look updated — the portrait should be redrawn.",
    "Облик обновлён.": "Look updated.",
    "Пробуждение ": "Awakening ",
    " активно — умение усилено.": " is active — the skill is stronger.",
    " закрыто: нужен дубликат «": " is locked: you need a duplicate of “",
    "открыто · каждое усиливает одно из умений": "unlocked · each one strengthens a skill",
    "ИИ не ответил — можно повторить в Призыве.": "The AI did not answer — you can retry in Summon.",
    "Дальше — темнота. Забирай что есть.": "Beyond is darkness. Take what you have.",
    "Нора сомкнулась — добыча остаётся при тебе.": "The hole closed — your loot stays with you.",
    "НОРА ОТКРЫВАЕТСЯ…": "THE HOLE IS OPENING…",
    "Мир сброшен — открой нору и выкуй заново.": "World reset — open the hole and forge again.",
    "Этот путь откроет прокачанный артефакт.": "An upgraded relic opens this path.",
    "спутник": "companion",
    "артефакт": "relic",
    "крутка": "ticket",
    "круток": "tickets",
    "★ БОСС": "★ BOSS",
    "отряд выстоял": "the party held",
    "отряд полёг": "the party fell",
    "МАКСИМУМ": "MAXED",
    " ИДУТ · ": " WITH YOU · ",
    " · ПРОБУЖДЕНИЕ": " · AWAKENING",
    "· крутки": "· tickets",
    "портретов": "portraits",
    "реликвий": "relics",
    "КУДА СПУСТИМСЯ": "WHERE DO WE GO DOWN",
    "ВЫХОД ИЗ НОРЫ": "OUT OF THE HOLE",
    "ЧЕМ ГЛУБЖЕ — ТЕМ ЛУЧШЕ ДОБЫЧА. ЗАКРЫТЫЕ ПУТИ ОТКРЫВАЮТ ПРОКАЧАННЫЕ АРТЕФАКТЫ": "THE DEEPER YOU GO, THE BETTER THE LOOT. UPGRADED RELICS OPEN LOCKED PATHS",
    "Перетащи окно": "Drag the window",
    "Показывает, какой путь в норе безопаснее.": "Shows which path down is safer.",
    "Тратит силу реликвии целиком — и вытаскивает из безнадёжного хода.": "Spends the relic's power entirely — and pulls you out of a hopeless step.",
    "Бьёт тем, что под рукой, опираясь на «": "Strikes with whatever is at hand, leaning on “",
    "в ответе нет картинки": "no image in the response",
    "пустой ответ": "empty response",
    "ошибка": "error",
    "Лорбук «": "Lorebook “",
    "» не открылся": "” did not open",
    "Артефакты и норы создадутся заново, вместе с памятью этих нор. Осколки, крутки, спутники и хроника останутся.": "Relics and holes will be recreated, and so will what those holes remember. Shards, tickets, companions and the chronicle stay.",
    "настройки расширения → «🐇 Кроличья нора» → ключ, потом повтори": "extension settings → “🐇 The Rabbit Hole” → key, then retry",
    "например flux-schnell или google/gemini-2.5-flash-image": "e.g. flux-schnell or google/gemini-2.5-flash-image",
    "API-ключ": "API key",
    "Незнакомец ": "Stranger ",
    "Глава ": "Chapter ",
    "» — и что мастей у него ": "” — and that their suit is ",
    "Этот спутник ещё не выпал в Призыве. Известно только, что он ходит рядом с реликвией «": "This companion has not dropped in Summon yet. All that is known is that they walk beside the relic “",
    "Кто-то ходит по норе рядом с «": "Someone walks the hole beside “",
    "» и пока не показывает лица.": "” and does not show their face yet.",
    "реликвии": "relics",
    ") — умеет:": ") — can do:",
    "выбито": "downed",
    "-м ходу из": "th step of",
    ". Противников": ". Enemies",
    "/6 открыто · каждое усиливает одно из умений": "/6 unlocked · each strengthens a skill",
    "· умение": "· skill",
    "» до": "” to",
    "Выйти с добычей": "Leave with the loot",
    "ИЗ": "OF",
    "добавлена в лорбук «": "added to lorebook “",
    "ещё не ходил вниз — пока это общая хроника": "has not gone down yet — this is the shared chronicle for now",
    "закрыто: нужен дубликат «": "locked: you need a duplicate of “",
    "на": "at",
    "нужен ур.": "needs lv.",
    "осколков": "shards",
    "ходов": "steps",
    "ходов из": "steps of",
    "→ ур.": "→ lv.",
    "Ты прошёл": "You have made it",
    "Ты сорвался на": "You fell at",
    "НОРА НЕ ОТПУСТИЛА": "THE HOLE DID NOT LET GO",
    "Добыча твоя.": "The loot is yours.",
    "риск · до": "risk · up to",
    "закрыто · пройди «": "locked · clear “",
    "рекорд": "record",
    "Не хватает осколков: нужно": "Not enough shards: you need",
    "ПРОКАЧАТЬ ·": "UPGRADE ·",
    "Откроется на пробуждении": "Unlocks at awakening",
    "Пробуждение": "Awakening",
    "активно — умение усилено.": "is active — the skill is stronger.",
    "из Призыва.": "from Summon.",
    "нужно": "needed",
    "Виток": "Spiral",
    "Запись о": "Entry for",
    "Рисую": "Drawing",
    "Пишу": "Writing",
    "это займёт время.": "this will take a while.",
    "карт… это займёт время.": "cards… this will take a while.",
    "Нарисовано:": "Drawn:",
    "Язык интерфейса": "Interface language",
    "ИИ РИСУЕТ КАРТИНКИ ·": "THE AI IS DRAWING ·",
    "ИИ прочитает карточку и придумает шесть спутников — хранителей твоих артефактов. Они будут выпадать из круток.": "The AI will read the card and invent six companions — the keepers of your relics. They drop from pulls.",
    "Открой чат с персонажем — «Кроличья нора» кует мир из его карточки, чтобы данжи и артефакты подходили именно ему.": "Open a chat with a character — the Rabbit Hole forges the world from their card, so the dungeons and relics fit them.",
    "Выковано «Кроличьей норой» из карточки персонажа. Артефакт:": "Forged by the Rabbit Hole from the character card. Relic:",
    "Interface language / Язык интерфейса": "Interface language",
    "«Обнулить героев» стирает каст, чтобы выковать его заново. Осколки и хроника не тронутся.": "“Wipe companions” clears the cast so it can be forged again. Shards and the chronicle are untouched.",
    "Вниз": "Down",
    "до": "to",
    "…записи добавляются автоматически по мере прохождения Норы, три последних видит ИИ в чате": "…entries are added automatically as you dive; the AI sees the last three in chat",
    "осколки +": "shards +",
    "материалы +": "materials +",
    "полная карта": "full card",
    "Ключевые решения:": "Key choices:",
    "Удачных ходов": "Successful steps",
    "Путь закрыт:": "Path locked:",
    "ходов. Отсюда ещё можно подняться и унести добычу целой. Глубже — больше осколков и круток, но сорваться будет обиднее.": "steps. You can still climb out from here with the loot intact. Deeper means more shards and tickets, but falling will hurt more.",
    "м ходу. Половина добычи осталась в темноте — но нора запомнила тебя, и в следующий раз ты будешь знать больше.": "th step. Half the loot stayed in the dark — but the hole remembers you, and next time you will know more.",
    "Остановить": "Stop",
    "Нечего останавливать.": "Nothing to stop.",
    "ИИ думает…": "The AI is thinking…",
    "Рисую": "Drawing",
    "за сессию": "this session",
    "токенов": "tokens",
    "Провайдер не ответил — повтор": "The provider did not answer — retry",
    "Ковка остановлена.": "Forging stopped.",
    "Рисование остановлено. Готово:": "Drawing stopped. Finished:",
    "умение": "skill",
    "Главы по мере открытия": "Chapters on demand",
    "Потрачено за сессию": "Spent this session",
    "запросов": "calls",
    "повторов": "retries",
    "неудач": "failures",
    "Повторить ковку": "Retry forging",
    "Остановлено.": "Stopped.",
    "он": "they",
    "ДАВЛЕНИЕ": "PRESSURE",
    "чем глубже, тем хуже исход любого хода": "the deeper you are, the worse every outcome gets",
    "вход": "the way in",
    "что-то не так": "something is off",
    "нора проснулась": "the hole is awake",
    "она мешает": "it fights back",
    "почти без света": "almost no light",
    "дно": "the bottom",
    "спусков:": "dives:",
    "в прошлый раз сорвался": "fell last time",
    "в прошлый раз вышел": "came back last time",
    "Занятость сброшена.": "The busy state has been cleared.",
    "Разблокировать": "Unblock",
    "Ключевые решения:": "Key decisions:",
    "Удачных ходов": "Good steps",
    "активно — умение усилено.": "is active — the skill is stronger.",
    "это займёт время.": "this will take a while.",
    "карт…": "cards…",
    "» из Призыва.": "» from Summon.",
};
function T(ru) {
    if ((settings && settings.uiLang) === 'ru') return ru;
    return EN[ru] !== undefined ? EN[ru] : ru;
}
// группировка разрядов идёт за языком интерфейса, а не прибита к русской
function numLocale() { return (settings && settings.uiLang) === 'ru' ? 'ru-RU' : 'en-US'; }
const PROMPT_KEY = 'RPG_DUNGEONS';

/* ============================================================
   RPG DUNGEONS — «Кроличья нора»
   Three loops that feed each other:
     · runs   — a rabbit-hole dive: choices, forks, locked paths
     · relics — artifacts levelled with shards, they OPEN those paths
     · draw   — tickets earned by diving (the gacha lands in 2.1)
   Everything about the world is FORGED FROM THE CHARACTER CARD, so a
   Korean schoolboy raids a night school and never a goblin cave.

   Progress is keyed by CHARACTER, not by chat: meta-progression must
   survive starting a fresh chat with the same person.
   ============================================================ */

const ART_COST = [0, 20, 45, 90, 160, 260, 400];   // shards to reach level 1..6
const ART_MAX = 6;
/* Колено — сколько сцен пишется за один запрос. Было 10, то есть нора на десять ходов
   целиком писалась ДО первого нажатия: реагировать на твои решения было физически
   нечем. Теперь четыре — и каждое следующее колено знает, что произошло в предыдущем
   (см. fetchLeg). Запросов больше, но каждый короче, и ждать приходится не минуту
   в начале, а понемногу. */
const LEG = 4;                                      // one AI call generates this many scenes
const DEPTHS = { 1: 10, 2: 10, 3: 20, 4: 20, 5: 30, 6: 30 };
const TIER_NAME = { 1: 'ЛЁГКИЙ', 2: 'ЛЁГКИЙ', 3: 'СРЕДНИЙ', 4: 'СРЕДНИЙ', 5: 'ТЯЖЁЛЫЙ', 6: 'ХАРДКОР' };

const IMG_DEF = {
    enabled: false,
    mode: 'auto',                 // 'auto' | 'openai' | 'openrouter'
    apiUrl: '', apiKey: '', model: '',
    size: '768x1024',             // портрет 3:4
    style: 'modern anime, dramatic rim light, ornate gothic-deco accents,',
    heroTpl: 'Character portrait of {NAME}, {LOOK}. {ROLE}. Style: {STYLE}. Waist-up portrait, single character, looking at viewer, detailed face and eyes, rich fabric detail, dark ornate, A handsome and attractive character, fan service background with subtle gold filigree, {SIZE}, 3:4 aspect ratio, high quality.',
    artTpl: 'A single magical artifact: {NAME} — {DESC}. Style: {STYLE}. Object only, no people, centered on a dark velvet surface, museum lighting, gold filigree frame, intricate detail, {SIZE}, 3:4 aspect ratio.'
};
const defaults = {
    images: { ...IMG_DEF },
    loreBook: '',
    uiLang: 'en',          // язык интерфейса: en по умолчанию
    autoHeroes: true,      // ковать спутников вместе с миром
    autoArtHeroes: true,   // рисовать портреты спутников
    autoArtRelics: false,  // карточки реликвий — по кнопке: это шесть лишних картинок
                            // на профиль, а видно их заметно реже, чем портреты
    autoCards: false,      // сразу писать полные карты
    autoLore: false,       // сразу отправлять записи в лорбук
    /* Главы пишутся не вместе со всем кастом, а когда спутника открывают. Один общий
       запрос на шесть героев с тридцатью главами — это десятки тысяч токенов за раз,
       самый долгий и самый хрупкий вызов во всём расширении. */
    lazyChapters: true,
    retries: 2,            // повторов при сбое провайдера (не считая первой попытки)
    timeoutSec: 120,
    /* Кого ковать в спутники. mixed — как было: разные люди, пол и возраст по сюжету.
       otome — каст из взрослых мужчин, galge — из взрослых женщин. Нижняя граница
       возраста 18 стоит ВСЕГДА и настройкой не отключается: спутники тут написаны
       как романтические линии (в карточке есть «bond with {{user}}», главы ведут
       к признанию), а ещё генераторы картинок отказываются рисовать по промпту,
       где стоит подростковый возраст, — отсюда и половина «Image API 500». */
    castNotes: '',         // свободные пожелания к касту: мир, эпоха, внешность, что угодно.
                            // Уходит в промпт ковки как есть и имеет приоритет над догадками модели.
    splitLang: false,      // панель и ИИ на разных языках — по галочке, по умолчанию один язык
    cast: 'mixed',         // mixed | otome | galge
    ageBand: '18-32',      // 18-25 | 18-32 | 18-45
    sound: false,          // синтезированные звуки боя/призыва — по умолчанию выключены,
                            // чтобы никого не удивить внезапным звуком посреди ролплея
    enabled: true,
    language: 'ru',
    baseUrl: '', apiKey: '', model: '', temperature: 0.9,
    profiles: {}            // charName -> profile
};

let settings = {};
/* ui.who — чей сон открыт сейчас. Имеет значение только в групповом чате: профили
   и так разложены по имени персонажа, но heroCard() в группе всегда брал первого
   участника, и до снов остальных было не дотянуться. Живёт в памяти, не сохраняется,
   сбрасывается на смене чата: это «куда я сейчас смотрю», а не настройка. */
let ui = { mode: 'nora', profileKey: '', busy: false, gview: 'banner', gres: null, gflip: 0, dcur: '', dtab: 'obzor', cardMode: 'wpp', who: '', skillFor: null };
let run = null;             // live run state (never persisted mid-step)

/* ---------- settings ---------- */
function loadSettings() {
    if (!extension_settings[MODULE_NAME]) extension_settings[MODULE_NAME] = {};
    settings = Object.assign({}, defaults, extension_settings[MODULE_NAME]);
    if (!settings.profiles || typeof settings.profiles !== 'object') settings.profiles = {};
    /* Лечим профили, сохранённые прежними версиями с застрявшим «занят»: иначе
       расширение так и осталось бы заблокированным после обновления. */
    for (const p of Object.values(settings.profiles)) {
        for (const o of [...(p.heroes || []), ...(p.artifacts || [])]) { delete o.imgBusy; delete o.imgErr; }
    }
    /* heal NaN that a cleared number field may have saved earlier.
       BUG FIX (аудит 2026-10, класс 2.4): лечилась только температура. retries и
       timeoutSec оставались как есть, а в callAI стоит `settings.retries ?? 2` —
       `??` ловит null и undefined, но НЕ NaN. С NaN число попыток само становится
       NaN, цикл запросов не выполняется ни разу, и расширение отвечает «ИИ не
       ответил» на каждую кнопку, не отправив ни одного запроса. Само не чинилось,
       потому что любое сравнение с NaN ложно. */
    for (const [k, d] of [['temperature', 0.9], ['retries', 2], ['timeoutSec', 120]]) {
        if (!Number.isFinite(settings[k])) settings[k] = d;
    }
    // один язык на всё, пока явно не попросили обратного
    if (!settings.splitLang) settings.language = settings.uiLang === 'ru' ? 'ru' : 'en';
}
/* ============================================================
   КАРТИНКИ ЖИВУТ ОТДЕЛЬНО ОТ НАСТРОЕК
   Портрет — это base64 на сотни килобайт. Их до двенадцати на профиль, профиль свой
   у каждого персонажа, а SillyTavern переписывает весь объект настроек при каждом
   сохранении — то есть при каждом клике в панели. Десять персонажей с портретами
   превращали settings.json в многомегабайтный файл, который пишется заново постоянно.

   Байты уезжают в IndexedDB (localforage, он уже есть в таверне), в настройках
   остаётся только ключ. Поля h.img/a.img в памяти не меняются, поэтому ни один из
   тридцати мест отрисовки трогать не пришлось: подмена происходит на записи и
   обратная подстановка на чтении.
   ============================================================ */
function imgStore() {
    try { return globalThis.SillyTavern?.libs?.localforage ?? globalThis.localforage ?? null; }
    catch (e) { return null; }
}
const imgKeyFor = (pk, id) => `rdg_img:${pk}:${id}`;
let imgDirty = new Map();     // ключ -> dataURL, ждут записи в IndexedDB

/* Копия настроек, в которой вместо картинок стоят ключи. Сами объекты профиля не
   меняются — иначе портрет пропал бы с экрана в момент сохранения. */
function settingsForDisk() {
    // Снимать транзиентные флаги надо всегда, даже когда картинки унести некуда:
    // без этого «занят» уходил на диск на любой сборке без IndexedDB — а это и есть
    // та самая вечная блокировка.
    const store = imgStore();
    const out = Object.assign({}, settings, { profiles: {} });
    for (const [pk, p] of Object.entries(settings.profiles || {})) {
        /* imgBusy — состояние текущей секунды, а не свойство героя. Но живёт оно на
           объекте, который сохраняется, поэтому любое постороннее сохранение во время
           рисования записывало «занят» на диск. После перезагрузки anyBusy() оставался
           истинным навсегда, и расширение на всё отвечало «ИИ занят этим кастом» —
           при том что не работало ничего. Транзиентные флаги на диск не уходят. */
        const strip = (arr) => (arr || []).map(o => {
            const hasImg = typeof o?.img === 'string' && o.img.startsWith('data:');
            const move = hasImg && !!store;        // без хранилища картинка остаётся на месте
            if (!move && !o?.imgBusy && !o?.imgErr) return o;
            const { imgBusy, imgErr, ...rest } = o;
            if (!move) return rest;                // флаг снят, картинка осталась в настройках
            const key = imgKeyFor(pk, o.id);
            imgDirty.set(key, rest.img);
            delete rest.img;
            return { ...rest, imgKey: key };
        });
        out.profiles[pk] = Object.assign({}, p, { heroes: strip(p.heroes), artifacts: strip(p.artifacts) });
    }
    return out;
}
async function flushImages() {
    const store = imgStore();
    if (!store || !imgDirty.size) return;
    const batch = imgDirty; imgDirty = new Map();
    for (const [k, v] of batch) {
        try { await store.setItem(k, v); }
        catch (e) { console.warn('[Dungeons] картинка не легла в хранилище', e); }
    }
}
/* Обратная подстановка при загрузке. Асинхронная, поэтому панель сначала появляется
   без портретов и дорисовывает их — это заметно лучше, чем ждать базу перед стартом. */
async function hydrateImages() {
    const store = imgStore();
    if (!store) return 0;
    let n = 0;
    for (const p of Object.values(settings.profiles || {})) {
        for (const o of [...(p.heroes || []), ...(p.artifacts || [])]) {
            if (o.img || !o.imgKey) continue;
            try {
                const data = await store.getItem(o.imgKey);
                if (data) { o.img = data; n++; }
            } catch (e) { /* пропала — просто нет портрета */ }
        }
    }
    return n;
}

function saveSettings(immediate) {
    extension_settings[MODULE_NAME] = settingsForDisk();
    /* BUG FIX (аудит 2026-10, класс 2.6): settingsForDisk() выносит байты картинки в
       imgDirty и оставляет в настройках ТОЛЬКО ключ на неё. Запись блоба в IndexedDB
       асинхронная, а settings.json писался немедленно — то есть ключ уезжал на диск
       раньше самой картинки. F5 в этот зазор (несколько миллисекунд) оставлял ссылку
       на пустое место: hydrateImages ничего не находит, портрет не возвращается
       никогда. Теперь ключ уходит на диск только после блоба; когда картинок нет —
       а это почти каждое сохранение — всё остаётся синхронным, как было. */
    const pendingImgs = imgDirty.size;
    const wrote = flushImages();
    if (typeof saveSettingsDebounced === 'function') saveSettingsDebounced();
    if (!immediate) return;
    // discrete, hard-won things (loot, an upgrade, a finished run) must survive an
    // instant F5 — the debounced write alone loses them inside its ~1s window
    const commit = () => { try { getContext().saveSettings?.(); } catch (e) { } };
    if (!pendingImgs) commit();
    else wrote.then(commit, commit);
}

/* ---------- api (borrows the suite's key so nothing is typed twice) ---------- */
/* Brought in line with the rest of the suite: the same ten sources in the same order,
   the same treatment of local backends, and the same rule that a URL you typed always
   wins even when the key is borrowed. Previously only three extensions were consulted
   and a local endpoint was not recognised at all, so pointing this at LM Studio meant
   filling in a key that does not exist. */
const KEY_SOURCES = ['tavern_rpg_engine', 'rpg_status_bar', 'tavern_bonds_engine', 'rpg_phone',
    'rpg_diary', 'rpg_map_engine', 'rpg_map', 'rpg_dungeons', 'rpg_codex', 'tavern_doors'];

function isLocalEndpoint(url) {
    const u = String(url || '').toLowerCase();
    if (!u) return false;
    return /(^|\/\/)(localhost|127\.0\.0\.1|0\.0\.0\.0|\[::1\]|host\.docker\.internal)([:/]|$)/.test(u)
        || /:(5001|5000|8080|8000|1234|11434|5002)(\/|$)/.test(u)
        || /192\.168\.|10\.\d+\.|172\.(1[6-9]|2\d|3[01])\./.test(u);
}

function normalizeBase(url) {
    let u = String(url || '').trim().replace(/\/+$/, '');
    if (!u) return '';
    if (/\/(chat\/)?completions$/.test(u)) u = u.replace(/\/(chat\/)?completions$/, '');
    if (!/\/v\d+$/.test(u)) u += '/v1';
    return u;
}

function borrowedRaw() {
    for (const src of KEY_SOURCES) {
        if (src === MODULE_NAME) continue;          // never borrow from ourselves
        const x = extension_settings[src];
        if (x && x.apiKey && x.model) return { url: x.baseUrl, key: x.apiKey, model: x.model, from: src };
    }
    return null;
}

function apiConf() {
    const own = String(settings.baseUrl || '').trim();
    const local = isLocalEndpoint(own);

    // A local backend needs no key: a placeholder keeps the header well-formed.
    if (local) return { url: own, key: settings.apiKey || 'local', model: settings.model || '', from: null };

    if (settings.apiKey && settings.model) {
        return { url: own, key: settings.apiKey, model: settings.model, from: null };
    }
    const b = borrowedRaw();
    if (!b) return { url: own, key: settings.apiKey || '', model: settings.model || '', from: null };

    // A URL typed here wins even when the key comes from elsewhere.
    return { url: own || b.url, key: settings.apiKey || b.key, model: settings.model || b.model, from: b.from };
}
let currentAbort = null;
let cancelledByUser = false;

/* The stop button. currentAbort existed before but nothing ever called it, so a call
   that hung held the UI until its own 120s timeout expired. */
function cancelAI() {
    let hit = false;
    if (currentAbort) { cancelledByUser = true; try { currentAbort.abort(); } catch (e) { } hit = true; }
    if (imgAbort) { imgCancelled = true; try { imgAbort.abort(); } catch (e) { } hit = true; }
    return hit;
}

/* Аварийный выход. Если флаг занятости всё-таки где-то застрял — а именно это и
   запирало расширение намертво, — одна кнопка возвращает его в рабочее состояние,
   не трогая ни добычу, ни спутников. */
function clearAllBusy() {
    ui.busy = false;
    drawQueue = null;
    drawCancel = false;
    const p = profile();
    if (p) for (const o of [...(p.heroes || []), ...(p.artifacts || [])]) { delete o.imgBusy; delete o.imgErr; }
    heroForgeState = heroForgeState === 'busy' ? '' : heroForgeState;
    render();
}
function isCancel(e) {
    return !!e && (e.message === 'cancelled' || e.name === 'AbortError');
}

/* What a run of generation has cost. Kept per session rather than persisted: the
   point is to answer "what did that just spend", not to keep accounts. */
let tokenUse = { calls: 0, prompt: 0, completion: 0, failed: 0, retried: 0 };
function noteUsage(u) {
    tokenUse.calls++;
    if (u) {
        tokenUse.prompt += Number(u.prompt_tokens) || 0;
        tokenUse.completion += Number(u.completion_tokens) || 0;
    }
    try { paintUsage(); } catch (e) { }
}
function usageTotal() { return tokenUse.prompt + tokenUse.completion; }

/* Расход показывается цифрами, которые вернул сам провайдер. Если он их не шлёт,
   честнее сказать об этом, чем печатать выдуманную оценку. */
function paintUsage() {
    const el = document.getElementById('rdg-usage');
    if (!el) return;
    // BUG FIX (аудит 2026-10): локаль была зашита русской, и в английском интерфейсе
    // счётчик расхода печатался с русской группировкой разрядов
    const n = (x) => Number(x || 0).toLocaleString(numLocale());
    const total = usageTotal();
    el.textContent = !tokenUse.calls
        ? '—'
        : `${T('Потрачено за сессию')}: ${total ? '~' + n(total) + ' ' + T('токенов') : '—'} · `
        + `${n(tokenUse.calls)} ${T('запросов')} · ${n(tokenUse.retried)} ${T('повторов')} · ${n(tokenUse.failed)} ${T('неудач')}`;
}

/* Retried: the provider is having a moment (rate limit, gateway, dropped socket).
   Not retried: the request itself is wrong, and repeating it only spends money. */
function isTransient(status) {
    return status === 408 || status === 409 || status === 425 || status === 429 || status >= 500;
}
const sleep = (ms) => new Promise(r => setTimeout(r, ms));

async function callAI(system, user, maxTokens = 2200, opts = {}) {
    const cfg = apiConf();
    if (!cfg.key) throw new Error('no-key');
    // normalizeBase adds the missing /v1 and strips a trailing /chat/completions, so
    // "http://localhost:1234" typed by hand works the same way it does everywhere else
    // in the suite.
    const url = (normalizeBase(cfg.url) || 'https://openrouter.ai/api/v1') + '/chat/completions';
    // вторая страховка к лечению при загрузке: сюда NaN не должен доходить вообще,
    // но если дойдёт — лучше один запрос, чем ни одного (см. loadSettings, класс 2.4)
    const retr = Number(settings.retries);
    const tries = Math.max(1, (Number.isFinite(retr) ? retr : 2) + 1);
    let lastErr = null;

    for (let attempt = 0; attempt < tries; attempt++) {
        const ctrl = new AbortController();
        currentAbort = ctrl;
        cancelledByUser = false;
        const timer = setTimeout(() => { try { ctrl.abort(); } catch (e) { } }, Number(settings.timeoutSec || 120) * 1000);
        try {
            const res = await fetch(url, {
                method: 'POST', signal: ctrl.signal,
                headers: { 'Authorization': `Bearer ${String(cfg.key).trim()}`, 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    model: cfg.model, temperature: settings.temperature,
                    messages: [{ role: 'system', content: system }, { role: 'user', content: user }],
                    max_tokens: maxTokens, max_completion_tokens: maxTokens,
                    response_format: { type: 'json_object' }
                })
            });
            if (!res.ok) {
                const err = new Error('HTTP ' + res.status);
                err.status = res.status;
                throw err;
            }
            const data = await res.json();
            noteUsage(data.usage);
            return parseJSON(data.choices?.[0]?.message?.content || '');
        } catch (e) {
            lastErr = e;
            // the person pressed stop: that is an answer, not a failure to retry past
            if (cancelledByUser) { const c = new Error('cancelled'); c.name = 'AbortError'; throw c; }
            const retryable = e.name === 'AbortError' ? false : (e.status === undefined || isTransient(e.status));
            if (!retryable || attempt === tries - 1) break;
            tokenUse.retried++;
            // 1.5s, 4s, 10s — long enough for a rate limit to clear, short enough to sit through
            const wait = [1500, 4000, 10000][Math.min(attempt, 2)];
            if (typeof opts.onRetry === 'function') opts.onRetry(attempt + 1, tries - 1, wait);
            console.warn(`[Dungeons] попытка ${attempt + 1}/${tries} не удалась (${e.message}) — повтор через ${wait}ms`);
            await sleep(wait);
        } finally { clearTimeout(timer); currentAbort = null; }
    }
    tokenUse.failed++;
    throw lastErr || new Error('failed');
}
function parseJSON(raw) {
    let s = String(raw || '').trim();
    s = s.replace(/^```(?:json)?/i, '').replace(/```$/, '').trim();
    try { return JSON.parse(s); } catch (e) { }
    const a = s.indexOf('{'), b = s.lastIndexOf('}');
    if (a >= 0 && b > a) { try { return JSON.parse(s.slice(a, b + 1)); } catch (e) { } }
    // BUG FIX (opt. audit): a truncated/malformed response silently became `null`
    // everywhere, and every caller's own retry/fallback fired with zero visibility
    // into what actually came back — "raise max_tokens" was a guess, not a diagnosis.
    console.warn('[Dungeons] не удалось распарсить ответ ИИ, сырой текст:', raw);
    return null;
}

/* ---------- helpers ---------- */
function esc(x) {
    return String(x ?? '').replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
}
function clip(x, n) { return String(x || '').replace(/\s+/g, ' ').trim().slice(0, n); }
// BUG FIX (opt. audit): response_format:json_object guarantees valid JSON, not
// meaningful content — a smaller/local model can return {"name": -1} or {"name":"null"}
// and it parses just fine. Used at the few identity fields (hero/artifact/dungeon
// name) where a junk value would be the most visible: a companion literally called "-1".
function isJunkText(v) {
    if (v == null) return true;
    if (typeof v === 'number' || typeof v === 'boolean') return true;
    const s = String(v).trim();
    if (!s) return true;
    if (/^-?\d+([.,]\d+)?$/.test(s)) return true;              // "-1", "0", "42"
    if (/^(null|undefined|nan|none|n\/a|error)$/i.test(s)) return true;
    return false;
}
function pick(a) { return a[Math.floor(Math.random() * a.length)]; }
function shuffle(a) { a = a.slice(); for (let i = a.length - 1; i > 0; i--) { const j = Math.floor(Math.random() * (i + 1)); [a[i], a[j]] = [a[j], a[i]]; } return a; }
/* BUG FIX (аудит 2026-10, класс 2.5 / шпаргалка §5): имена спутников и реликвий
   приходят от модели, и экранировать их перед выводом обязательно — иначе кавычка
   или тег разъезжают вёрстку. Но toastr печатает сообщение КАК ТЕКСТ, и человек
   видел «Ключ матери» как `Ключ матери&#39;` — сущности уже никто не раскрывает.

   Раскодируем на самом выходе, непосредственно перед toastr. Угловые скобки
   (`&lt;`/`&gt;`) НЕ раскодируем намеренно: если в чьей-то сборке toastr всё-таки
   рендерит HTML, присланный моделью `<b>` не должен ожить. `&amp;` — последним,
   иначе амперсанды остальных сущностей вернулись бы обратно. */
function unesc(v) {
    return String(v ?? '')
        .replace(/&#0?39;/g, "'").replace(/&apos;/g, "'")
        .replace(/&quot;/g, '"')
        .replace(/&#x2F;/gi, '/')
        .replace(/&amp;/g, '&');
}
function toast(kind, msg) { try { toastr[kind](unesc(esc(msg))); } catch (e) { } }
function genLang() { return settings.language === 'en' ? 'English' : 'Russian'; }

/* ---------- who are we playing with ---------- */
/* Все участники группового чата, в порядке самой группы. В сольном чате — один
   текущий персонаж. Из этого списка строится полоска «чей сон» в шапке. */
function groupCast() {
    try {
        const ctx = getContext();
        if (!ctx.groupId) {
            const ch = (ctx.characterId !== undefined) ? characters[ctx.characterId] : null;
            return ch ? [ch] : [];
        }
        const g = (ctx.groups || []).find(x => String(x.id) === String(ctx.groupId));
        const out = [];
        const seen = new Set();
        for (const m of (g?.members || [])) {
            const ch = characters.find(c => c.avatar === m) || characters.find(c => c.name === m);
            if (ch && ch.name && !seen.has(ch.name)) { seen.add(ch.name); out.push(ch); }
        }
        return out;
    } catch (e) { return []; }
}
function heroCard() {
    try {
        const ctx = getContext();
        if (ctx.groupId) {
            /* Нора — это сон ПЕРСОНАЖА, и у каждого он свой: свои норы, свои спутники,
               своя добыча. В группе раньше был доступен только сон первого участника,
               а остальные лежали в настройках и были недосягаемы. Теперь выбранный
               участник решает, в чей сон мы смотрим; ui.who пустой — по-прежнему первый. */
            const cast = groupCast();
            if (!cast.length) return null;
            return (ui.who && cast.find(c => c.name === ui.who)) || cast[0];
        }
        if (ctx.characterId !== undefined && characters[ctx.characterId]) return characters[ctx.characterId];
    } catch (e) { }
    return null;
}
/* Что сейчас мешает уйти в чужой сон: живой заход, бой, запрос к ИИ или очередь
   картинок. Молча подменять персонажа под всем этим нельзя — промах мышкой стёр бы
   заход, а ответ ИИ лёг бы уже не туда. */
function switchBlocker() {
    if (run) return T('Сначала закончи заход — из норы так не уходят.');
    if (F) return T('Идёт бой — сначала он закончится.');
    if (ui.busy || drawQueue) return T('ИИ сейчас занят — дождись ответа.');
    const p = settings.profiles && settings.profiles[profileKey()];
    if (p && anyBusy(p)) return T('ИИ сейчас занят этим персонажем — дождись ответа.');
    return '';
}
function switchWho(name) {
    if (!name || name === profileKey()) return;
    const why = switchBlocker();
    if (why) { toast('info', why); return; }
    ui.who = name;
    // новый сон — новый экран: прежние вкладки, досье и результаты Призыва не его
    ui.mode = 'nora'; ui.gview = 'banner'; ui.gres = null; ui.gflip = 0;
    ui.dcur = ''; ui.dtab = 'obzor'; ui.cardMode = 'wpp'; ui.skillFor = null;
    heroForgeTried = false; heroForgeState = '';
    chapterTried.clear();
    ui.profileKey = profileKey();
    render();
}
function profileKey() {
    const ch = heroCard();
    return ch && ch.name ? ch.name : '';
}
function cardText() {
    const ch = heroCard();
    if (!ch) return '';
    return clip([ch.description, ch.personality, ch.scenario].filter(Boolean).join('\n'), 2200);
}

/* ---------- profile (per character) ---------- */
function freshProfile() {
    return {
        v: 1, forged: false, setting: '',
        artifacts: [], dungeons: [],
        shards: 0, mats: 0, tickets: 0,
        heroes: [], team: [],           // gacha companions + chosen party
        pity5: 0, pity4: 0,             // gacha pity counters
        cleared: {},          // dungeonId -> deepest step reached
        memory: {},           // dungeonId -> что именно здесь уже случалось (см. rememberRun)
        runs: 0, log: []      // short summaries, fed back to the story AI
    };
}
function profile() {
    const k = profileKey();
    if (!k) return null;
    if (!settings.profiles[k] || typeof settings.profiles[k] !== 'object') settings.profiles[k] = freshProfile();
    const p = settings.profiles[k];
    // shape guards — a half-written profile must never crash a render
    if (!Array.isArray(p.artifacts)) p.artifacts = [];
    if (!settings.images) settings.images = { ...IMG_DEF };
    for (const k4 in IMG_DEF) if (settings.images[k4] === undefined) settings.images[k4] = IMG_DEF[k4];
    if (!Array.isArray(p.heroes)) p.heroes = [];
    if (!Array.isArray(p.team)) p.team = [];
    for (const k3 of ['pity5', 'pity4']) if (!Number.isFinite(p[k3])) p[k3] = 0;
    if (!Array.isArray(p.dungeons)) p.dungeons = [];
    if (!Array.isArray(p.log)) p.log = [];
    if (!p.cleared || typeof p.cleared !== 'object') p.cleared = {};
    if (!p.memory || typeof p.memory !== 'object') p.memory = {};
    for (const k2 of ['shards', 'mats', 'tickets', 'runs']) if (!Number.isFinite(p[k2])) p[k2] = 0;
    return p;
}
function artById(p, id) { return p.artifacts.find(a => a.id === id) || null; }
function artPower(p) { return p.artifacts.reduce((s, a) => s + (a.lvl || 0), 0); }

/* ---------- companions (the gacha cast) ---------- */
const SUITS = { 'ЧЕРВЫ': '#a5382c', 'ПИКИ': '#3a3550', 'ТРЕФЫ': '#2f5236', 'БУБНЫ': '#9a6a2a' };
// stable, language-independent hook for suit-specific CSS animation shapes (see .rdg-hcard.s-* below)
const SUIT_CLASS = { 'ЧЕРВЫ': 's-h', 'ПИКИ': 's-p', 'ТРЕФЫ': 's-t', 'БУБНЫ': 's-d' };
function heroById(p, id) { return (p.heroes || []).find(h => h.id === id) || null; }
/* BUG FIX (audit 2026-09): the GM debug panel's wipe/unlock/awaken/maxart buttons and
   "Перековать мир" replaced p.heroes/p.artifacts wholesale with no check at all —
   including while an AI call for one specific hero (regen chapters, draw portrait,
   full card, look) was still in flight. That call captures its hero object BEFORE
   its await and writes into it AFTER; if the array was replaced in between, the
   write lands on an orphaned object, is silently lost, and a false "success" toast
   still fires. ui.busy covers the text-generation calls; imgBusy is separate and
   per-item, so it needs checking too.
   Fix: destructive actions ask this first and refuse (with a toast) instead of
   racing an in-flight call. */
function anyBusy(p) {
    return !!ui.busy || (p.heroes || []).some(h => h.imgBusy) || (p.artifacts || []).some(a => a.imgBusy);
}
const GEN_RU = { female: 'женщина', male: 'мужчина', nonbinary: 'небинарный человек' };
const GEN_EN = { female: 'a woman, female character', male: 'a man, male character', nonbinary: 'androgynous character' };
// Единственный источник правды о внешности. Из него строятся портрет, карты и лорбук —
// иначе картинка, W++ и полная карта расходятся и получаются три разных человека.
function canonLine(h, lang) {
    const c = h.canon || {};
    const en = lang === 'en';
    const g = en ? (GEN_EN[h.gender] || '') : (GEN_RU[h.gender] || '');
    /* c.skin стоит сразу после пола и возраста: генераторы картинок заметно сильнее
       держат то, что стоит в начале промпта. Раньше поля не было вовсе, и внешность
       человека модель придумывала сама — портрет не совпадал ни с именем, ни с лором. */
    const bits = [g, h.age ? (en ? `age ${h.age}` : `${T('возраст')} ${h.age}`) : '', c.skin, c.hair, c.eyes, c.body, c.clothes, h.look]
        .map(x => String(x || '').trim()).filter(Boolean);
    return bits.join(', ');
}
function heroPower(h) { return (h.rar || 4) * 50 + (h.awaken || 0) * 15; }
function teamPower(p) {
    return (p.team || []).reduce((s, id) => { const h = heroById(p, id); return h && h.unlocked ? s + (h.rar || 4) + (h.awaken || 0) : s; }, 0);
}

/* ============================================================
   THE FORGE — one AI call turns the character card into a world:
   six artifacts and six rabbit holes that fit their actual life.
   ============================================================ */
const ICONS = ['door', 'stairs', 'water', 'clock', 'moon', 'book', 'mask', 'key', 'lamp', 'mirror', 'crown', 'gem', 'blade', 'thread', 'eye', 'ghost', 'board', 'hole', 'stage', 'chair', 'door2'];

async function forgeWorld() {
    const p = profile();
    if (!p || ui.busy) return;
    const card = cardText();
    if (!card) { toast('info', T('Открой чат с персонажем — мир куётся из его карточки.')); return; }
    const myKey = profileKey();

    ui.busy = true; render();
    const sys = `You design a personal roguelike for ONE character, drawn strictly from their card. Nothing generic-fantasy unless the card is fantasy: a modern Korean student breaks into their own school at night, an office worker descends into the building's sub-levels, a knight goes to real ruins.

Return ONLY JSON:
{"setting":"one sentence naming the flavour of this character's 'rabbit holes'",
 "artifacts":[{"id":"a1","name":"...","desc":"one short line — what it is and what it lets you do","icon":"one of: ${ICONS.join('|')}"}],
 "dungeons":[{"id":"d1","name":"...","desc":"one or two lines: the place and why they go in","icon":"one of the same list","hook":"the goal of the dive, e.g. find the lost book"}]}

EXACTLY 6 artifacts (ids a1..a6) and EXACTLY 6 dungeons (ids d1..d6).
Artifacts are OBJECTS FROM THEIR WORLD, not RPG loot — a student gets a master key, a cracked phone, a school badge; not a "Sword of Flame".
Dungeons go from mundane-but-eerie (d1) to the deepest secret of this character's life (d6). d6 may be strange or metaphysical.
Write the text in ${genLang()}. Names of places and objects stay true to the character's own world and language — transliterate them into ${genLang()}'s alphabet rather than replacing them with ${genLang()} ones.`;
    try {
        const out = await callAI(sys, `CHARACTER CARD:\n${card}\n\nForge their six artifacts and six rabbit holes.`, 2400);
        if (profileKey() !== myKey) { ui.busy = false; return; }   // switched character mid-forge
        const arts = Array.isArray(out?.artifacts) ? out.artifacts : [];
        const dngs = Array.isArray(out?.dungeons) ? out.dungeons : [];
        if (arts.length < 3 || dngs.length < 3) throw new Error('thin');

        const p2 = profile();
        p2.setting = clip(out.setting, 240);
        p2.artifacts = arts.slice(0, 6).map((a, i) => ({
            id: a.id || 'a' + (i + 1), name: !isJunkText(a.name) ? clip(a.name, 60) : T('Артефакт ') + (i + 1),
            desc: clip(a.desc, 160), icon: ICONS.includes(a.icon) ? a.icon : pick(ICONS),
            lvl: 0
        }));
        p2.dungeons = dngs.slice(0, 6).map((d, i) => ({
            id: d.id || 'd' + (i + 1), name: !isJunkText(d.name) ? clip(d.name, 60) : T('Нора ') + (i + 1),
            desc: clip(d.desc, 220), hook: clip(d.hook, 160),
            icon: ICONS.includes(d.icon) ? d.icon : pick(ICONS),
            tier: i + 1, depth: DEPTHS[i + 1] || 10
        }));
        p2.forged = true;
        saveSettings(true);
        toast('success', T('Мир выкован. Нора ждёт.'));
        ui.busy = false;
        if (settings.autoHeroes !== false) forgeHeroes();   // спутники куются вторым заходом; галка в настройках
    } catch (e) {
        if (isCancel(e)) toast('info', T('Остановлено.'));
        else if (e && e.message === 'no-key') toast('warning', T('Сначала укажи API-ключ (или включи его в Tavern RPG Engine).'));
        else { console.error('[Dungeons] forge', e); toast('warning', T('Кузница молчит — попробуй ещё раз.')); }
    }
    ui.busy = false; render();
}


/* ============================================================
   КТО ПОПАДАЕТ В КАСТ

   Роль спутника модель выбирает хорошо, а пол — как придётся: просила красивого
   лиса-кицунэ, получила жрицу. Функцию в сюжете она выполняет, но это не то, что
   заказывали. Теперь каст задаётся настройкой.

   Возраст снизу всегда 18, и это не переключается. Две причины, обе настоящие:
   спутники тут — романтические линии (в карточке есть «bond with {{user}}», арка
   глав ведёт к признанию), и генераторы картинок отказываются работать, когда в
   промпте стоит подростковый возраст. Настройкой задаётся только верхняя граница —
   чтобы в отоме не приходил пятидесятилетний.
   ============================================================ */
const AGE_BANDS = { '18-25': [18, 25], '18-32': [18, 32], '18-45': [18, 45] };
function ageBand() { return AGE_BANDS[settings.ageBand] || AGE_BANDS['18-32']; }
function castMode() { return ['mixed', 'otome', 'galge'].includes(settings.cast) ? settings.cast : 'mixed'; }
function castRule() {
    const [lo, hi] = ageBand();
    const age = `AGE — a hard rule: every companion is an adult, between ${lo} and ${hi} years old, and the "age" field must say so in ${genLang()}. Never write a teenager, a child or a pupil below university age; if the hero's own world is a school, make them final-year students of ${lo}+, teachers, staff, graduates or outsiders. Never write anyone over ${hi} either. The "canon" body description must read as that age.`;
    const m = castMode();
    if (m === 'otome') {
        return `${age}
THE CAST — a hard rule: ALL SIX companions are MEN. Every "gender" field is "male", every name is a man's name in that culture, and every "canon" description is of a man. This is an otome cast: they are written as the romantic leads of this story — striking, distinct from one another, each handsome in his own way (the cold one, the warm one, the dangerous one, the gentle one, and so on), and each with a real inner life rather than a type. Whatever role the artifact implies, cast a MAN in it: a fox spirit becomes a male kitsune, a shrine keeper becomes a male priest, a nurse becomes a male medic. Keep the role, change who fills it.`;
    }
    if (m === 'galge') {
        return `${age}
THE CAST — a hard rule: ALL SIX companions are WOMEN. Every "gender" field is "female", every name is a woman's name in that culture, and every "canon" description is of a woman. They are written as the romantic leads of this story — striking, clearly distinct from one another, each beautiful in her own way, and each with a real inner life rather than a type. Whatever role the artifact implies, cast a WOMAN in it. Keep the role, change who fills it.`;
    }
    return `${age}
THE CAST: mix them freely — different genders, different ages inside the band above, different walks of life. Do not make them all the same kind of person.`;
}
/* Свободные пожелания автора истории. Ставятся в промпт ПОСЛЕДНИМИ и объявлены
   главнее всего остального: догадка модели о мире проигрывает тому, что человек
   написал про свой мир прямо. */
function castNotesRule() {
    const t = String(settings.castNotes || '').trim();
    if (!t) return '';
    return `\nTHE AUTHOR'S OWN INSTRUCTIONS FOR THIS CAST. These come from the person whose story this is. They outrank every guess you would otherwise make about the setting, the look or the names of these people, and they outrank the general rules above wherever the two disagree. Follow them exactly, and make sure the "canon" fields and the names reflect them:\n${clip(t, 700)}\n`;
}
/* Страховка на случай, если модель инструкцию проигнорирует: правим сами данные.
   Возраст приходит строкой («17 лет», «—»), поэтому вытаскиваем число. */
function fixAge(raw) {
    const [lo, hi] = ageBand();
    const s = String(raw || '').trim();
    const m = s.match(/\d{1,3}/);
    if (!m) return s.slice(0, 30);
    let n = parseInt(m[0], 10);
    if (!Number.isFinite(n)) return s.slice(0, 30);
    const fixed = Math.max(lo, Math.min(hi, n));
    return fixed === n ? s.slice(0, 30) : s.replace(m[0], String(fixed)).slice(0, 30);
}
function fixGender(raw) {
    const g = ['female', 'male', 'nonbinary'].includes(String(raw || '').toLowerCase()) ? String(raw).toLowerCase() : '';
    const m = castMode();
    if (m === 'otome') return 'male';
    if (m === 'galge') return 'female';
    return g;
}

/* ---------- the cast: six companions, one per artifact ---------- */
async function forgeHeroes() {
    const p = profile();
    if (!p || !p.forged || ui.busy) return false;
    const myKey = profileKey();
    ui.busy = true; heroForgeState = 'busy'; render();
    // всё тело — под try/finally: раньше исключение до внутреннего try (например,
    // профиль без артефактов) оставляло ui.busy поднятым, и панель запиралась
    try {
    const arts = (p.artifacts || []).map(a => `${a.id}="${a.name}" — ${a.desc}`).join('; ');
    /* Главы здесь не просим: тридцать сцен по 140 слов в одном ответе — это и есть
       та самая «бесконечная ковка». Они пишутся по одному спутнику, когда его
       открывают (fillMissingChapters). Старое поведение остаётся по галке. */
    const lazy = settings.lazyChapters !== false;
    const chapterShape = lazy
        ? `"chapters":[{"t":"chapter title","at":0},{"t":"...","at":1},{"t":"...","at":2},{"t":"...","at":4},{"t":"...","at":6}]`
        : `"chapters":[{"t":"chapter title","at":0,"x":"a written SCENE, 2-3 paragraphs"},{"t":"...","at":1,"x":"..."},{"t":"...","at":2,"x":"..."},{"t":"...","at":4,"x":"..."},{"t":"...","at":6,"x":"..."}]`;
    const chapterRules = lazy
        ? `EXACTLY 5 chapter TITLES each with "at" = 0,1,2,4,6 (the awakening level that unlocks it). TITLES ONLY — do NOT write the chapter text, there is no "x" field in this request. The titles must promise an arc: at=0 first meeting, at=1 the crack in their surface, at=2 what they hide, at=4 what it costs them, at=6 the truth. Every title in ${genLang()}.`
        : `EXACTLY 5 chapters each with "at" = 0,1,2,4,6 (the awakening level that unlocks it).
CHAPTERS ARE THE MAIN EVENT — write them properly, they are what the player unlocks and reads:
- Each "x" MUST be at least 140 words — 2-3 full paragraphs separated by \n\n. Anything shorter is INVALID: rewrite it before answering.
- FORBIDDEN: one-sentence chapters and plot summaries like "Miki transfers to the academy and recognizes Ayato". That is a synopsis, not a chapter. Write the scene itself, moment by moment, with spoken dialogue.
- Write it as a SCENE: a specific place and moment, what is said out loud (use real dialogue lines), what the companion does with their hands, what {{user}} notices about them. Past tense, third person, novel prose.
- LANGUAGE: chapter titles AND prose both in ${genLang()}. An English title on a chapter written in another language is INVALID output — every "t" must be in ${genLang()}. Check each one before answering.
- Arc across the five: at=0 first meeting, at=1 the crack in their surface, at=2 what they hide, at=4 what it costs them, at=6 the truth and what they ask of {{user}}. Each one darker and closer than the last.
- ALL of it — titles, prose, dialogue — in ${genLang()}. This applies to chapters too, not only to names and lore.`;
    const sys = `You cast the supporting characters for ONE hero's personal gacha, drawn strictly from their card. Each companion is the KEEPER of one of the hero's six artifacts.

Return ONLY JSON:
{"heroes":[{"id":"h1","art":"a1","name":"...","role":"their role in 2-4 words","age":"e.g. 24 года","suit":"ЧЕРВЫ|ПИКИ|ТРЕФЫ|БУБНЫ","rar":5,
 "gender":"female|male|nonbinary","look":"appearance in 5-9 words",
 "canon":{"skin":"complexion and features, true to where this story is set","hair":"colour + style","eyes":"colour + shape","body":"build, height, marks","clothes":"their usual outfit","scent":"how they smell"},
 "lore":"2-3 sentences: who they are to the hero, with a hook of mystery",
 "skills":[{"t":T("БАЗОВЫЙ"),"n":"skill name","d":"1 sentence, what it does in a fight"},{"t":T("УМЕНИЕ"),"n":"...","d":"..."},{"t":T("УЛЬТА"),"n":"...","d":"..."}],
 "card":"a compact W++ character card, 6-8 lines: name(), role(), appearance(), personality(), speech(), bond with {{user}}(), artifact()",
 ${chapterShape}}]}

EXACTLY 6 heroes with ids h1..h6. Hero hN keeps artifact aN — weave that artifact's name into their lore, skills and card.
EXACTLY two heroes have "rar":5, the other four have "rar":4. Use all four suits at least once.
EXACTLY 3 skills each (БАЗОВЫЙ / УМЕНИЕ / УЛЬТА) — flavour them after that hero's artifact and their role.
APPEARANCE IS CANON — the "canon" object is the single source of truth for this character's looks. It must match "look", match the name, and match the gender. Everything later (portraits, full cards, story chapters) is built from it, so be specific and unambiguous: state the gender clearly, give real hair and eye colours, a real build and height.
APPEARANCE FOLLOWS THE WORLD, NOT THE OUTPUT LANGUAGE. Work out from the character card where these people actually live, and describe them as people from THERE: "skin" must name their complexion and features plainly and consistently with their name and their setting, so that a picture drawn from this description could not be mistaken for someone from a different part of the world. A companion named Сэйдзи Мидзухара in a Japanese story is described as Japanese; a companion in a Lagos story is described as Nigerian. Never leave "skin" empty or vague — a portrait is generated straight from this field, and whatever you omit the image model will invent.
NAMES COME FROM THE HERO'S WORLD, NEVER FROM THE OUTPUT LANGUAGE. Read the character card and work out where and when this story is set, then name everyone from THAT culture: a Japanese story gets Japanese names, a Korean one Korean names, a Victorian one Victorian names, a Nigerian one Nigerian names. The language you are writing in is only the SCRIPT and the prose — if the story is Japanese and you are writing in Russian, the companions are still called Ая Тэрада and Сэйдзи Мидзухара, never Дмитрий Соколов. Transliterate the real name into the output language's alphabet; do not replace it with a local one. Use ordinary, real, varied names people actually have there — including plain and unglamorous ones. Vary the shape: some short, some with surnames, some with a nickname or how people actually address them.
BANNED NAMES — these are the names a language model reaches for by reflex, and they are all forbidden, along with anything close to them:
- dark-romance stock: Silas, Thorn, Thorne, Elias, Caleb, Damien, Lucian, Lucien, Seraphina, Lilith, Raven, Ash, Asher, Blackwood, Vane, Grimm, Nyx, Kael, Draven, Ember, Wren, Sable, Marcus Grove, Dorian, Cassian, Rhys, Zephyr.
- Arthurian and pseudo-medieval: Arthur, Pendragon, Lancelot, Morgana, Merlin, Gawain, Evander, Alaric, Aldric, Theron.
- the textbook-first-page Chinese names: Li Wei, Wei Li, Chen Yu, Chen Yun, Wang Lei, Zhang Wei, Liu Yang, Xiao Long, Mei Ling, Lin Feng, Ye Chen, Wen Xiao.
- the textbook-first-page Japanese names: Hiroshi Tanaka, Yuki Tanaka, Takeshi Yamamoto, Akira Sato, Sakura Haruno, Kenji Suzuki, Ryu, Kaito Kurosawa.
- the textbook-first-page Korean names: Kim Min-jun, Lee Ji-eun, Park Ji-ho, Min-ho, Ji-woo.
A NAME MUST NOT BE THE MOST OBVIOUS NAME OF ITS CULTURE. Write a cast register, not a phrasebook: six people from the same place should sound as different from one another as six real colleagues do — different surname lengths, different generations of naming fashion, one with an unglamorous ordinary name, one who goes by a nickname or a shortened form, one whose name is slightly old-fashioned for their age. If you can imagine the name on the cover of a web novel, or as the example name in a language textbook, discard it and think of a real one.
${chapterRules}
${castRule()}${castNotesRule()}
They are people (or beings) from THIS character's world — colleagues, neighbours, strangers who keep showing up.
Write the PROSE in ${genLang()}. Names and the look of these people come from the hero's own world, not from ${genLang()} — see the NAMES and APPEARANCE rules above.`;
    let ok = false;
    try {
        const out = await callAI(sys,
            `CHARACTER CARD:\n${cardText()}\n\nTHEIR SIX ARTIFACTS: ${arts}\n\nCast the six keepers.${lazy ? ' Chapter TITLES only — no chapter text.' : ` Remember: every chapter is 2-3 real paragraphs in ${genLang()}, not a one-line summary.`}`,
            lazy ? 7000 : 26000,
            { onRetry: (n, of) => toast('info', `${T('Провайдер не ответил — повтор')} ${n}/${of}…`) });
        if (profileKey() !== myKey) { ui.busy = false; return false; }
        const raw = Array.isArray(out?.heroes) ? out.heroes : [];
        if (raw.length < 4) throw new Error('thin');
        let fives = 0;
        const p2 = profile();
        const before = {};
        for (const o of (p2.heroes || [])) before[o.id] = o;
        p2.heroes = raw.slice(0, 6).map((h, i) => {
            const old = before['h' + (i + 1)] || {};
            let rar = h.rar === 5 ? 5 : 4;
            if (rar === 5 && ++fives > 2) rar = 4;
            const suit = SUITS[h.suit] ? h.suit : pick(Object.keys(SUITS));
            return {
                id: 'h' + (i + 1),
                art: p2.artifacts[i] ? p2.artifacts[i].id : ('a' + (i + 1)),
                name: !isJunkText(h.name) ? clip(h.name, 40) : T('Незнакомец'),
                role: clip(h.role, 60), suit, rar, e: SUITS[suit],
                age: fixAge(h.age), look: clip(h.look, 120), lore: clip(h.lore, 500),
                gender: fixGender(h.gender),
                canon: {
                    skin: clip(h.canon?.skin, 90),
                    hair: clip(h.canon?.hair, 80), eyes: clip(h.canon?.eyes, 80),
                    body: clip(h.canon?.body, 120), clothes: clip(h.canon?.clothes, 160), scent: clip(h.canon?.scent, 80)
                },
                card: clip(String(h.card || ''), 900),
                skills: (Array.isArray(h.skills) ? h.skills : []).slice(0, 3)
                    .map((s, k) => ({ t: clip(s.t, 20) || [T('БАЗОВЫЙ'), T('УМЕНИЕ'), T('УЛЬТА')][k], n: clip(s.n, 50) || T('Умение'), d: clip(s.d, 220) })),
                chapters: (Array.isArray(h.chapters) ? h.chapters : []).slice(0, 5)
                    .map((c, k) => ({
                        t: clip(c.t, 70) || T('Глава'),
                        at: Number.isFinite(+c.at) ? Math.max(0, Math.min(6, +c.at)) : [0, 1, 2, 4, 6][k],
                        x: String(c.x || '').replace(/[ \t]+/g, ' ').trim().slice(0, 2200)   // абзацы сохраняем
                    })),
                unlocked: !!old.unlocked, awaken: old.awaken || 0
            };
        });
        if (fives === 0 && p2.heroes.length) p2.heroes[0].rar = 5;
        saveSettings(true);
        toast('success', T('Спутники выкованы — они ждут в Призыве.'));
        heroForgeState = ''; ok = true;
        afterForge();                           // портреты, карты и лорбук — по галкам в настройках
    } catch (e) {
        /* BUG FIX: heroForgeTried was reset to false here, and renderGacha calls
           autoForgeHeroes on every single render — so one failure put the extension in
           a loop that fired a fresh 26000-token call every time the Summon tab was
           drawn. On a provider that fails often that is unbounded spend with nothing on
           screen to explain it. The flag now STAYS set; only the person pressing the
           retry button in Summon clears it. */
        if (isCancel(e)) { heroForgeState = 'fail'; toast('info', T('Ковка остановлена.')); }
        else if (e && e.message === 'no-key') { heroForgeState = 'nokey'; toast('warning', T('Сначала укажи API-ключ в настройках расширения.')); }
        else { heroForgeState = 'fail'; console.error('[Dungeons] heroes', e); toast('warning', T('ИИ не ответил — можно повторить в Призыве.')); }
    }
    } finally { ui.busy = false; render(); }
    return ok;
}

/* ---------- запасной каст: собирается мгновенно из артефактов,
   чтобы Призыв работал ещё до того, как ИИ придумает спутникам имена ---------- */
const STUB_ROMAN = ['I', 'II', 'III', 'IV', 'V', 'VI'];
let heroForgeTried = false;
let heroForgeState = '';                 // '' | 'busy' | 'fail' | 'nokey'
function autoForgeHeroes(p) {
    if (settings.autoHeroes === false) return;
    if (heroForgeTried || ui.busy) return;
    if (heroForgeState === 'fail' || heroForgeState === 'nokey') return;  // ждём ручного повтора
    if (!p.heroes.some(h => h.stub)) return;
    heroForgeTried = true;
    setTimeout(() => forgeHeroes(), 40);   // не дёргаем перерисовку изнутри перерисовки
}
// единственный путь обратно в автоковку — кнопка «повторить» в Призыве
function retryForgeHeroes() {
    heroForgeTried = false;
    heroForgeState = '';
    forgeHeroes();
}
function seedHeroes(p) {
    if (!p || !p.forged || (p.heroes && p.heroes.length)) return;
    const suits = Object.keys(SUITS);
    p.heroes = (p.artifacts.length ? p.artifacts : Array.from({ length: 6 }, (_, i) => ({ id: 'a' + (i + 1), name: T('Реликвия ') + (i + 1), desc: '' })))
        .slice(0, 6).map((a, i) => {
            const suit = suits[i % 4];
            return {
                id: 'h' + (i + 1), art: a.id, stub: true,
                name: T('Незнакомец ') + STUB_ROMAN[i],
                role: T('хранитель «') + a.name + '»', age: '—',
                suit, e: SUITS[suit], rar: i < 2 ? 5 : 4,
                look: T('лица не разглядеть'),
                lore: `${T('Кто-то ходит по норе рядом с «')}${a.name}${T('» и пока не показывает лица.')}`,
                skills: [
                    { t: T('БАЗОВЫЙ'), n: T('Пробный ход'), d: `${T('Бьёт тем, что под рукой, опираясь на «')}${a.name}».` },
                    { t: T('УМЕНИЕ'), n: T('Подсказка'), d: T('Показывает, какой путь в норе безопаснее.') },
                    { t: T('УЛЬТА'), n: T('Всё разом'), d: T('Тратит силу реликвии целиком — и вытаскивает из безнадёжного хода.') }
                ],
                chapters: [0, 1, 2, 4, 6].map((at, k) => ({ t: T('Глава ') + STUB_ROMAN[k], at, x: '' })),
                card: '', unlocked: false, awaken: 0
            };
        });
    saveSettings(true);
}

/* ---------- gacha rolls ---------- */
function rollOne(p) {
    p.pity5 = (p.pity5 || 0) + 1; p.pity4 = (p.pity4 || 0) + 1;
    let r;
    if (p.pity5 >= 40) r = 5;
    else {
        const x = Math.random();
        if (x < .03) r = 5;
        else if (x < .03 + (p.pity4 >= 8 ? 1 : .13)) r = 4;
        else r = 3;
    }
    if (r === 5) p.pity5 = 0;
    if (r >= 4) p.pity4 = 0;
    if (r === 3) {
        return Math.random() < .55
            ? { r: 3, kind: 'shards', n: 10 + Math.floor(Math.random() * 13), nm: T('Осколки эфира'), rl: T('для прокачки артефактов') }
            : { r: 3, kind: 'mats', n: 2 + Math.floor(Math.random() * 3), nm: T('Пыль удачи'), rl: T('материалы прокачки') };
    }
    return heroDrop(p, r);
}
function heroDrop(p, r) {
    const pool = p.heroes.filter(h => (h.rar === 5) === (r === 5));
    const locked = pool.filter(h => !h.unlocked);
    const h = (locked.length && Math.random() < .78) ? pick(locked) : pick(pool.length ? pool : p.heroes);
    return { r, hero: h.id, nm: h.name, rl: h.role || T(h.suit || ''), img: h.img || '' };
}
function doPull(n) {
    const p = profile();
    if (!p || ui.busy || !p.heroes.length) return;
    if ((p.tickets | 0) < n) { toast('info', T('Не хватает круток — их выносят из нор.')); return; }
    p.tickets -= n;
    const res = [];
    for (let i = 0; i < n; i++) res.push(rollOne(p));
    if (n === 10 && !res.some(x => x.r >= 4)) res[9] = heroDrop(p, 4);
    for (const x of res) {
        if (x.hero) {
            const h = heroById(p, x.hero);
            if (h && !h.unlocked) { h.unlocked = true; x.isNew = true; }
            else if (h) { h.awaken = Math.min(6, (h.awaken || 0) + 1); x.dupe = true; p.shards += 15; }
        } else if (x.kind === 'shards') p.shards += x.n;
        else if (x.kind === 'mats') p.mats += x.n;
    }
    saveSettings(true);
    ui.gres = res; ui.gflip = 0; ui.gview = 'reveal';
    render();
}

/* ============================================================
   A RUN
   Scenes arrive one LEG (10 steps) at a time — that is also exactly
   where the game offers to climb out, so the pacing and the API
   calls line up instead of fighting each other.
   ============================================================ */
/* Что уже произошло В ЭТОМ заходе. Раньше писателю не уходило вообще ничего: колено
   равнялось всей норе, а если нора была глубокой и колено писалось второй раз, оно
   всё равно писалось вслепую. Отсюда и ощущение сценария вместо продолжения. */
function runBrief(p) {
    if (!run || !run.path || !run.path.length) return '';
    const bits = [];
    bits.push('WHAT THEY HAVE DONE SO FAR IN THIS DIVE (oldest first): ' + run.path.slice(-8)
        .map(x => `step ${x.step} they tried "${x.text}" and it ${x.ok ? 'worked' : 'went wrong'}`).join('; ') + '.');
    const down = (run.down || []).map(id => (heroById(p, id) || {}).name).filter(Boolean);
    if (down.length) {
        bits.push(`OUT OF THE DIVE — do NOT give them anything to do and do not write choices for them, but you MAY show them hurt, spent or carried: ${down.join(', ')}.`);
    }
    const f = nerveFrac(run);
    bits.push('HOW THEY ARE HOLDING UP: ' + (f > 0.75 ? 'steady, still sharp'
        : f > 0.45 ? 'worn, starting to make small mistakes'
            : f > 0.2 ? 'badly frayed — hands unsteady, hearing things'
                : 'almost finished; one more wrong turn and they are done'));
    return bits.join('\n');
}
/* Норов места — словами, не числом, и с прямым запретом называть его вслух.
   Игрок должен догадываться по происходящему, а не читать подсказку. */
function temperBrief() {
    if (!run || !run.temper) return '';
    const NAME = { safe: 'caution and quiet, careful moves', risk: 'nerve, force and improvisation', art: 'leaning on an object they carry', hero: 'letting a companion handle it' };
    const hates = [], likes = [];
    for (const k of KINDS) {
        if (run.temper[k] <= -ROG.temper * 0.9) hates.push(NAME[k]);
        else if (run.temper[k] >= ROG.temper * 0.7) likes.push(NAME[k]);
    }
    if (!hates.length && !likes.length) return '';
    return `THE TEMPER OF THE PLACE TODAY (this is secret — NEVER state it, never hint at it in a choice's wording, never let a character say it out loud; it must only be felt through what the place physically does): `
        + (hates.length ? `it punishes ${hates.join(' and ')}. ` : '')
        + (likes.length ? `it gives way to ${likes.join(' and ')}. ` : '')
        + `Write the scene and all its choices so that NONE of them looks safer or smarter than the others on the page. The reader must not be able to tell which is right by reading. Keep every option equally plausible and equally tempting.`;
}
async function fetchLeg(dungeon, fromStep, p) {
    const arts = p.artifacts.map(a => `${a.id}="${a.name}" (ур.${a.lvl}) — ${a.desc}`).join('; ');
    const been = (p.log || []).slice(-3).map(l => l.text).join(' | ');
    const memo = memoryBrief(p, dungeon);
    const sofar = runBrief(p);
    const temper = temperBrief();
    /* Давление глубины описывается писателю словами, а не числом: модель куда лучше
       держит «воздуха почти нет», чем «pressure = 0.41». */
    const probe = { step: fromStep, dungeon };
    const stage = ['the way in, still almost ordinary', 'something is off and they know it',
        'the place has stopped pretending', 'it is actively working against them',
        'very little light and no easy way back', 'the bottom, where the hole is most itself'][pressureStage(probe)] || '';
    const sys = `You are the dungeon master of a personal "rabbit hole" run. Return ONLY JSON:
{"scenes":[{"name":"short scene title","desc":"5-7 sentences, second person, present tense: what they see, hear and smell, what the place is doing, and the pressure that forces a decision. Name people and things. End on the moment of choice.","icon":"door|stairs|water|clock|moon|book|mask|key|lamp|mirror|crown|gem|blade|thread|eye",
 "choices":[{"text":"what the player does (max 8 words)","kind":"safe|risk|art|hero","art":"artifact id — ONLY for kind=art","hero":"companion id — ONLY for kind=hero","good":"1-2 lines: it worked out, with a concrete consequence","bad":"1-2 lines: it went wrong, with a concrete consequence"}]}]}

Rules:
- EXACTLY ${LEG} scenes, each with 3 or 4 choices — never fewer than 3.
- kind "safe": quiet progress, "good" always happens. kind "risk": may go wrong. kind "art": needs an artifact — put its id in "art". kind "hero": one of the companions in the party solves it with their own skill — put their id in "hero" and NAME them in the choice text.
- Give a kind "art" choice in roughly half the scenes and a kind "hero" choice in roughly half, never more than one of each per scene, and spread different artifacts and companions around.
- A "hero" choice must be something ONLY THAT PERSON would do — built on who they are, not on a generic rescue. A shrine maiden and a bodyguard facing the same locked door do two different things. Their "good" and "bad" lines must sound like them: their manner, their nerve, what it costs them. Name them in the choice text.
- WHAT CAME BEFORE: if the notes below say this place has been entered before, the hole REMEMBERS. Call back to it concretely — the door they forced is still hanging off its hinge, what they dropped is still lying there, the thing that watched them last time is waiting further in, and a companion who faltered here is uneasy. Do not re-describe the past as a summary; let it show up as physical traces and as the place being one step ahead of them. If there are no such notes, this is the first descent: invent no history.
- DEPTH SCALES: the deeper the step number, the darker and more dangerous the scene — more at stake, less light, fewer safe ways out. By the deepest steps a "safe" choice should feel like a small mercy, not a shrug. You are told below how far down this leg sits; write to that, and let the place close in as the numbers rise.
- The dive must TELL A STORY toward its goal: early scenes are approach, the middle is the discovery, the last scene of this leg lands on something that makes the player want to go deeper.
- Never mention levels, numbers, mechanics or the words "artifact"/"choice" inside the prose.
- Write like a novel, not like a game log: concrete detail, no filler, no summarising what just happened.
- Everything in ${genLang()}.`;
    /* Писателю нужны не только названия умений: без роли, повадки и своей реликвии
       «Кэндзиро шагает вперёд» читается одинаково, кто бы это ни был. */
    const party = (p.team || []).map(id => heroById(p, id)).filter(h => h && h.unlocked && !heroDown(run, h.id))
        .map(h => {
            const rel = artById(p, h.art);
            return `${h.id}="${h.name}" — ${h.role || EN[h.suit] || h.suit || ''}`
                + (h.lore ? `; who they are: ${clip(h.lore, 180)}` : '')
                + (rel ? `; keeper of "${rel.name}"` : '')
                + `; skills: ${(h.skills || []).map(sk => sk.n).join(', ') || '—'}`;
        }).join('\n');
    const usr = `CHARACTER CARD:\n${cardText()}\n\nPLACE: "${dungeon.name}" — ${dungeon.desc}\nGOAL OF THE DIVE: ${dungeon.hook || dungeon.desc}\nTHEIR ARTIFACTS: ${arts}${party ? `\nCOMPANIONS WITH THEM: ${party}` : '\nThey are ALONE — do NOT write kind="hero" choices.'}\nDEPTH: steps ${fromStep}–${fromStep + LEG - 1} of at most ${dungeon.depth}. ${fromStep > 1 ? 'They chose to go DEEPER instead of climbing out — raise the tension.' : 'This is the way in.'}${been ? `\nEARLIER DIVES ELSEWHERE: ${been}` : ''}${memo ? `\n\nWHAT HAPPENED IN THIS PLACE BEFORE (the hole remembers it; weave it in as physical traces, not as a recap):\n${memo}` : '\nThis is the FIRST time they have ever come here — the place has no history with them yet.'}
HOW FAR DOWN THIS LEG IS: ${stage}.
${sofar ? `\n${sofar}\nCarry this forward physically: what they broke stays broken, what they dropped is still there, what frightened them is closer now. Do not summarise it — show its traces.\n` : ''}${temper ? `\n${temper}\n` : ''}
Write the next ${LEG} scenes.`;
    let raw = [];
    for (let attempt = 0; attempt < 2 && !raw.length; attempt++) {           // одна тихая повторная попытка
        try {
            const out = await callAI(sys, usr, 7500);
            raw = Array.isArray(out?.scenes) ? out.scenes : [];
        } catch (e) {
            // callAI повторяет сам, поэтому внешний цикл не должен множить попытки
            // поверх него, а отмену надо пропустить наружу немедленно
            if (isCancel(e) || (e && e.message === 'no-key')) throw e;
            if (attempt) throw e;
            console.warn('[Dungeons] сцены не пришли, пробую ещё раз', e);
            await new Promise(r => setTimeout(r, 900));
        }
    }
    return raw.slice(0, LEG).map((s, i) => normScene(s, i, fromStep, dungeon, p)).filter(Boolean);
}

// Requirement level for a gated path: deeper + higher tier = a better relic needed.
function gateLevel(step, tier) {
    return Math.max(1, Math.min(ART_MAX, Math.ceil(step / 6) + Math.floor((tier - 1) / 2)));
}
function normScene(s, i, fromStep, dungeon, p) {
    if (!s || typeof s !== 'object') return null;
    const step = fromStep + i;
    let ch = Array.isArray(s.choices) ? s.choices.filter(c => c && c.text) : [];
    const party = (p.team || []).map(id => heroById(p, id)).filter(h => h && h.unlocked);
    ch = ch.slice(0, 4).map(c => {
        let kind = ['safe', 'risk', 'art', 'hero'].includes(c.kind) ? c.kind : 'risk';
        const o = {
            text: clip(c.text, 110), kind,
            good: clip(c.good, 300) || T('Ты проходишь дальше.'),
            bad: clip(c.bad, 300) || T('Что-то пошло не так.')
        };
        if (kind === 'art') {
            const a = artById(p, c.art) || pick(p.artifacts);
            if (!a) { o.kind = 'risk'; return o; }
            o.art = a.id; o.need = gateLevel(step, dungeon.tier);
        }
        if (kind === 'hero') {
            const h = party.find(x => x.id === c.hero) || pick(party);
            if (!h) { o.kind = 'risk'; return o; }          // отряда нет — обычный риск
            o.hero = h.id; o.heroName = h.name;
        }
        return o;
    });
    if (!ch.length) return null;
    /* Shuffled. The model tends to put the cautious option first and the reckless one
       last, so the order itself was a hint — and a player learns that faster than they
       learn the writing. */
    for (let i = ch.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [ch[i], ch[j]] = [ch[j], ch[i]];
    }
    return { name: clip(s.name, 70) || T('Глубже'), desc: clip(s.desc, 900), icon: ICONS.includes(s.icon) ? s.icon : 'door', choices: ch, step };
}

async function startRun(dungeon) {
    const p = profile();
    if (!p || ui.busy) return;
    const myKey = profileKey();
    ui.busy = true; render();
    try {
        const scenes = await fetchLeg(dungeon, 1, p);
        if (profileKey() !== myKey) { ui.busy = false; return; }   // character changed while generating
        if (!scenes.length) throw new Error('empty');
        const nm = nerveMaxFor(dungeon.depth);
        run = {
            dungeon, step: 1, scenes, ptr: 0,
            shards: 0, mats: 0, tickets: 0, echo: null, echoKind: '',
            path: [], alive: true, offered: 0,
            // рогалик: норов места, запас нервов, ульта раз за заход, выбывшие спутники
            temper: rollTemper(), nerve: nm, nerveMax: nm,
            ultUsed: false, down: [], stumble: null, seen: {}
        };
        ui.mode = 'nora';
    } catch (e) {
        if (isCancel(e)) toast('info', T('Остановлено.'));
        else if (e && e.message === 'no-key') toast('warning', T('Сначала укажи API-ключ (или включи его в Tavern RPG Engine).'));
        else { console.error('[Dungeons] leg', e); toast('warning', T('Нора не открылась: ') + (e && e.message ? String(e.message).slice(0, 90) : T('ИИ не ответил')) + T(' · попробуй ещё раз')); }
    }
    ui.busy = false; render();
}

function curScene() { return run && run.scenes[run.ptr] ? run.scenes[run.ptr] : null; }

// Odds tilt with how well the relics are levelled: gear is the whole point of the grind.
function riskOdds(p) { return Math.min(0.9, 0.44 + artPower(p) * 0.028 + teamPower(p) * 0.008); }

/* Насколько тяжело прямо сейчас.

   Раньше это был просто номер хода с потолком на 0.34 — и значило это, что в норе на
   тридцать ходов вторая половина не становилась труднее вообще: с двенадцатого хода
   и до самого дна давление стояло на месте. Теперь считается доля пройденного пути
   ИМЕННО В ЭТОЙ норе плюс её тир, так что мелкая нора остаётся проходимой до конца,
   а глубокая к низу действительно душит. */
function pressure(run) {
    if (!run) return 0;
    const depth = Math.max(1, run.dungeon.depth || 10);
    const prog = Math.min(1, Math.max(0, (run.step - 1) / Math.max(1, depth - 1)));
    const tier = Math.max(1, Math.min(6, run.dungeon.tier || 1));
    return Math.min(0.52, prog * 0.34 + (tier - 1) * 0.035);
}
// шесть ступеней — чтобы давление можно было показать на экране, а не только считать
function pressureStage(run) { return Math.min(5, Math.floor(pressure(run) / 0.52 * 6)); }

/* ============================================================
   РОГАЛИК (4.6.0)

   Как было: у каждого вида хода был свой постоянный шанс, и «тихий» путь всегда
   оставался лучшим. Прогон на 40 000 заходов показал, что это неважно: у снаряжённого
   игрока слепое тыканье давало 77.7% прохождений, а осознанная игра 79.3% — полтора
   пункта. То есть решения не решали ничего, заход определяли уровень реликвий и сила
   отряда. Отсюда и ощущение «тыкаю и прохожу».

   Как стало. Три вещи, которых не было:

   1. НОРОВ МЕСТА. В начале захода бросается скрытый норов: что ИМЕННО СЕГОДНЯ это
      место карает, а чему потворствует. Он нигде не показан и нигде не назван — его
      видно только по тому, что с тобой происходит. Поэтому первый выбор всегда втёмную,
      а к середине захода внимательный игрок уже понимает, чего тут делать не надо.
      Плюс шум на каждую сцену: уверенным не будешь никогда.

   2. НЕРВЫ. Запас на заход, растёт с глубиной норы. Тратится на каждый ход, сильно —
      на провал, и по желанию на «собраться» (перехватить провал) и на сильные умения.
      Просели ниже половины — хуже идёт всё подряд. Кончились — заход окончен.

   3. ВЫХОД КАЖДЫЕ ЧЕТЫРЕ ХОДА. Раньше предложение подняться приходило на границе
      колена, а колено равнялось всей норе — то есть в первых норах этого решения
      не возникало ВООБЩЕ. А это и есть главное решение рогалика: унести что есть или
      лезть дальше. Сорвёшься — половина добычи остаётся внизу.

   Прогон новой механики (30 000 заходов, осколки / сорвался):
      новичок, нора 10:   слепое 17 / 53%      играет 31 / 25%
      новичок, нора 30:   слепое 17 / 99%      играет 64 / 34%
   Числа ниже подобраны на этой симуляции, менять их стоит только с ней же.
   ============================================================ */
const KINDS = ['safe', 'risk', 'art', 'hero'];
const ROG = {
    base: { safe: 0.80, risk: 0.68, art: 0.82, hero: 0.76 },
    pressMul: { safe: 0.60, risk: 0.90, art: 0.56, hero: 0.72 },
    temper: 0.24, jitter: 0.09,
    nerveBase: 40, nervePerStep: 7,
    stepCost: 3, failCost: 14, skillCost: 5, ultCost: 10, steadyCost: 18,
    pen1: 0.10, pen2: 0.22,          // ниже 45% и ниже 20% запаса
    skill: { base: 0.04, use: 0.13, ult: 0.30 },
    doom: 0.09, doomPress: 0.20, doomArt: 0.009,
    offerEvery: 4
};
/* Норов нигде не выводится игроку и не уходит в UI: узнать его можно только через
   последствия. Писателю сцен он сообщается — но с явным запретом называть его вслух. */
function rollTemper() {
    const k = shuffle(KINDS);
    const t = {};
    for (const x of KINDS) t[x] = 0;
    t[k[0]] = -ROG.temper;
    t[k[1]] = ROG.temper * 0.8;
    t[k[2]] = -ROG.temper * 0.3;
    return t;
}
function nerveMaxFor(depth) { return ROG.nerveBase + Math.max(1, depth || 10) * ROG.nervePerStep; }
function nerveFrac(run) {
    if (!run || !run.nerveMax) return 1;
    return Math.max(0, run.nerve) / run.nerveMax;
}
function nervePenalty(run) {
    const f = nerveFrac(run);
    return f < 0.20 ? ROG.pen2 : f < 0.45 ? ROG.pen1 : 0;
}
// пять ступеней запаса — для полоски на экране и для подписи словами
function nerveStage(run) { return Math.max(0, Math.min(4, Math.floor(nerveFrac(run) * 5))); }

/* Единственное место, где считается шанс хода. Игроку это число не показывается
   нигде и никогда — он видит только то, что произошло. */
function chanceOf(c, run, p, skill) {
    const kind = c.kind;
    const t = (run.temper && run.temper[kind]) || 0;
    let o = (ROG.base[kind] ?? 0.7) - pressure(run) * (ROG.pressMul[kind] ?? 0.7) + t;
    o += (Math.random() - 0.5) * 2 * ROG.jitter;     // шум сцены: двух одинаковых ходов не бывает
    o -= nervePenalty(run);
    const ap = artPower(p), tp = teamPower(p);
    /* Потолок на вклад снаряжения. Без него при максимальных реликвиях путь через
       артефакт переставал проигрывать вообще (прогон: 81 осколок против 69 у
       осознанной игры) — то есть на эндгейме возвращалась «одна кнопка», ровно то,
       что мы и убирали. С потолком прокачка по-прежнему заметно помогает, но норов
       места (±0.24) сильнее неё и способен сделать реликвию худшим вариантом. */
    if (kind === 'art') o += Math.min(0.14, ap * 0.012);
    // риск теперь ещё и платит больше (см. commitStep), поэтому его масштабирование
    // от снаряжения урезано — иначе он выигрывал дважды
    if (kind === 'risk') o += Math.min(0.10, ap * 0.008 + tp * 0.004);
    if (kind === 'hero') {
        const h = heroById(p, c.hero);
        o += ((h && h.rar === 5) ? 0.06 : 0) + ((h && h.awaken || 0) * 0.02);
        o += ROG.skill[skill] ?? ROG.skill.base;
    }
    return Math.max(0.05, Math.min(0.95, o));
}
function heroDown(run, id) { return !!(run && run.down && run.down.includes(id)); }
// сколько спутников ещё на ногах — ими и ограничено число ходов «через спутника»
function partyLeft(run, p) {
    const team = (p.team || []).map(id => heroById(p, id)).filter(h => h && h.unlocked);
    return team.filter(h => !heroDown(run, h.id)).length;
}

/* The tag used to announce the outcome: "safe" meant nothing could go wrong and
   "risk · chance" meant it could. With that on screen there was no decision left to
   make — you read the labels and took the safe one.

   What a tag may show now is only what the player could work out for themselves: that
   a door needs a particular artefact, or that a companion would be the one going in.
   Whether it works is for the hole to decide. */
function choiceTag(c) {
    if (c.kind === 'art') {
        const a = artById(profile(), c.art);
        return `<span class="rdg-tag gate">${esc(a ? a.name : T('артефакт'))} ${T('ур.')}${c.need}</span>`;
    }
    if (c.kind === 'hero') {
        return `<span class="rdg-tag hero">${esc(c.heroName || T('спутник'))} · ${T('умение')}</span>`;
    }
    return '';          // a plain path says nothing about itself
}

async function choose(idx, skill) {
    if (!run || !run.alive || ui.busy || run.stumble) return;
    const p = profile();
    const sc = curScene();
    if (!p || !sc) return;
    const c = sc.choices[idx];
    if (!c) return;

    if (c.kind === 'art') {
        const a = artById(p, c.art);
        if (!a || (a.lvl || 0) < c.need) {
            toast('info', `${T('Путь закрыт:')} ${a ? a.name : T('артефакт')} ${T('нужен ур.')} ${c.need}`);
            return;
        }
    }
    if (c.kind === 'hero') {
        if (heroDown(run, c.hero)) { toast('info', T('Этот спутник уже выбыл из захода.')); return; }
        if (skill === 'ult' && run.ultUsed) { toast('info', T('Ульту в этом заходе уже применяли.')); return; }
    }
    resolveStep(idx, c, skill || 'base', p, false);
}

/* Отдельно от choose, потому что сюда же возвращается «собраться»: перехват провала
   за нервы. Второй бросок делается тем же ходом и тем же умением. */
function resolveStep(idx, c, skill, p, isRetry) {
    const ok = Math.random() < chanceOf(c, run, p, skill);

    if (!isRetry) {
        run.nerve -= ROG.stepCost;
        if (c.kind === 'hero') {
            if (skill === 'use') run.nerve -= ROG.skillCost;
            if (skill === 'ult') { run.nerve -= ROG.ultCost; run.ultUsed = true; }
        }
    }
    // что это место уже показало — игроку не выводится, но заход это помнит и отдаёт писателю
    const seen = run.seen[c.kind] || (run.seen[c.kind] = { w: 0, f: 0 });
    seen[ok ? 'w' : 'f']++;

    if (!ok && !isRetry && run.nerve >= ROG.steadyCost && nerveFrac(run) > 0.12) {
        /* Провал ещё не окончателен: можно собраться и переиграть ход, заплатив нервами.
           Это и есть решение, а не кнопка «ладно» — цена настоящая и запас один. */
        run.stumble = { idx, skill, kind: c.kind };
        run.echo = c.bad;
        run.echoKind = 'bad';
        render();
        return;
    }
    commitStep(idx, c, skill, p, ok);
}
function commitStep(idx, c, skill, p, ok) {
    run.stumble = null;
    run.echo = ok ? c.good : c.bad;
    run.echoKind = ok ? 'good' : 'bad';
    run.path.push({
        step: run.step, text: c.text, ok, kind: c.kind,
        hero: c.kind === 'hero' ? c.hero : null,
        skill: c.kind === 'hero' ? skill : null
    });

    if (ok) {
        /* Риск платит больше. Без этого он был чистой ловушкой: шансов на 17 пунктов
           меньше, а добыча та же — брать его не было причин никогда. Теперь это
           настоящий размен, и «всегда тихий путь» перестаёт быть лучшей игрой. */
        run.shards += 3 + Math.floor(Math.random() * 4) + Math.floor(run.step / 4)
            + (c.kind === 'risk' ? 4 : 0) + (c.kind === 'hero' ? 2 : 0) + (skill === 'ult' ? 8 : 0);
        if (Math.random() < (c.kind === 'risk' ? 0.55 : 0.35)) run.mats += 1 + Math.floor(Math.random() * 2);
    } else {
        run.shards = Math.max(0, run.shards - 2);
        run.nerve -= ROG.failCost;
        /* Спутник, который сорвался, выбывает до конца захода. Отряд — это три попытки,
           а не три кнопки: потому и беречь их есть смысл. Шкал симпатии тут нет,
           состояние живёт ровно один заход. */
        if (c.kind === 'hero' && c.hero && !heroDown(run, c.hero)) {
            run.down.push(c.hero);
            const h = heroById(p, c.hero);
            if (h) toast('info', `${esc(h.name)} ${T('выбывает из этого захода.')}`);
        }
        const doom = ROG.doom + pressure(run) * ROG.doomPress - artPower(p) * ROG.doomArt;
        if (Math.random() < Math.max(0.04, doom)) { failRun(); return; }
    }
    if (run.nerve <= 0) { run.echo = T('Силы кончились. Нора выталкивает тебя наверх, и половина добычи остаётся в темноте.'); failRun(); return; }

    advanceStep();
}
function steadyUp() {
    if (!run || !run.stumble) return;
    const p = profile();
    const sc = curScene();
    if (!p || !sc) return;
    const st = run.stumble;
    const c = sc.choices[st.idx];
    if (!c) { run.stumble = null; render(); return; }
    if (run.nerve < ROG.steadyCost) { toast('info', T('На это уже не хватает сил.')); return; }
    run.nerve -= ROG.steadyCost;
    run.stumble = null;
    resolveStep(st.idx, c, st.skill, p, true);
}
function acceptStumble() {
    if (!run || !run.stumble) return;
    const p = profile();
    const sc = curScene();
    const st = run.stumble;
    const c = sc && sc.choices[st.idx];
    if (!p || !c) { run.stumble = null; render(); return; }
    commitStep(st.idx, c, st.skill, p, false);
}
async function advanceStep() {
    run.step++; run.ptr++;
    const depth = run.dungeon.depth;

    if (run.step > depth) { endRun('done'); return; }
    /* Главное решение рогалика — унести что есть или лезть дальше — теперь возникает
       каждые четыре хода, а не на границе колена. Раньше колено равнялось всей норе,
       и в норах на десять ходов этого выбора не было вообще. */
    if ((run.step - 1) % ROG.offerEvery === 0 && run.step > 1 && run.offered < Math.floor((run.step - 1) / ROG.offerEvery)) {
        offerExit(); return;
    }
    if (run.ptr >= run.scenes.length) { await extendRun(); return; }
    render();
}

async function extendRun() {
    const p = profile();
    if (!p || !run) return;
    const myKey = profileKey(), myRun = run;
    ui.busy = true; render();
    try {
        const more = await fetchLeg(run.dungeon, run.step, p);
        if (profileKey() !== myKey || run !== myRun) { ui.busy = false; return; }
        if (more.length) { run.scenes = run.scenes.concat(more); }
        else { toast('info', T('Дальше — темнота. Забирай что есть.')); endRun('done'); ui.busy = false; return; }
    } catch (e) {
        /* BUG FIX (аудит 2026-10, классы 2.1 и 2.11): в ветке успеха сторож стоял,
           а в ветке ошибки — нет. Переключили персонажа, пока грузилось колено, и
           провайдер упал → сюда приходил тост про сомкнувшуюся нору от захода,
           которого на экране уже нет, а endRun шёл банковать в чужой профиль
           (спасал только run = null из CHAT_CHANGED — на это полагаться нельзя).
           И «Остановить» — это ответ, а не поломка: своё сообщение, без console.error. */
        if (profileKey() !== myKey || run !== myRun) { ui.busy = false; return; }
        if (isCancel(e)) toast('info', T('Остановлено.'));
        else {
            console.error('[Dungeons] extend', e);
            toast('warning', T('Нора сомкнулась — добыча остаётся при тебе.'));
        }
        endRun('done'); ui.busy = false; return;
    }
    ui.busy = false; render();
}

function offerExit() {
    run.offered++;
    run.pendingExit = true;
    render();
}
async function goDeeper() {
    if (!run) return;          // CHAT_CHANGED обнуляет заход; без этого — TypeError в обработчике кнопки
    run.pendingExit = false;
    if (run.ptr >= run.scenes.length) { await extendRun(); return; }
    render();
}

function failRun() {
    if (!run) return;
    run.alive = false; run.failed = true;
    Sound.defeat();
    // half the haul is dropped on the way out, but the dive still happened
    run.shards = Math.floor(run.shards / 2);
    run.mats = Math.floor(run.mats / 2);
    run.tickets = 0;
    bank('fail');
}
function endRun(how) {
    if (!run) return;
    run.alive = false; run.failed = false;
    const reached = run.step - 1;
    run.tickets = 1 + Math.floor(reached / LEG) + (reached >= run.dungeon.depth ? 1 : 0);
    bank(how);
}

/* ============================================================
   ПАМЯТЬ НОРЫ
   Раньше следующий заход знал только три строчки общего журнала — «сорвался на 7-м
   ходу». Этого хватало, чтобы упомянуть факт, и не хватало ни на что больше: место
   каждый раз открывалось заново, как будто тебя тут не было.

   Теперь у каждой норы своя память: сколько раз сюда спускались, докуда дошли, чем
   кончилось, какие ходы запомнились и кто из спутников здесь уже отличился или
   оплошал. Хранится только у себя, в настройках расширения, и никуда больше не
   уходит.
   ============================================================ */
function dungeonMemory(p, id) {
    if (!p.memory[id] || typeof p.memory[id] !== 'object') {
        p.memory[id] = { visits: 0, deepest: 0, lastHow: '', beats: [], heroes: {} };
    }
    const m = p.memory[id];
    if (!Array.isArray(m.beats)) m.beats = [];
    if (!m.heroes || typeof m.heroes !== 'object') m.heroes = {};
    return m;
}

function rememberRun(p, how, reached) {
    const m = dungeonMemory(p, run.dungeon.id);
    m.visits = (m.visits || 0) + 1;
    m.deepest = Math.max(m.deepest || 0, reached);
    m.lastHow = how;
    m.lastAt = Date.now();

    /* Запоминаем не всё подряд, а то, что стоит вспомнить: провалы (их последствия
       остаются в месте) и последний ход — на нём заход и оборвался. */
    const notable = run.path.filter(x => !x.ok).slice(-3);
    const last = run.path[run.path.length - 1];
    if (last && !notable.includes(last)) notable.push(last);
    for (const b of notable) {
        m.beats.push({ step: b.step, text: clip(b.text, 70), ok: !!b.ok, how });
    }
    // держим короткой: место помнит последнее, а не всю свою историю
    if (m.beats.length > 6) m.beats = m.beats.slice(-6);

    // кто здесь уже справлялся, а кто подводил
    for (const b of run.path) {
        if (!b.hero) continue;
        const st = m.heroes[b.hero] || (m.heroes[b.hero] = { win: 0, fail: 0 });
        if (b.ok) st.win++; else st.fail++;
    }
}

/* То же самое словами, для писателя сцен. Пусто на первом спуске — место ещё никого
   не видело, и выдумывать ему прошлое не нужно. */
function memoryBrief(p, dungeon) {
    const m = p.memory && p.memory[dungeon.id];
    if (!m || !m.visits) return '';
    const bits = [`This place has been entered ${m.visits} time(s) before; the deepest they ever got was step ${m.deepest} of ${dungeon.depth}; last time they ${m.lastHow === 'fail' ? 'FELL and were thrown out' : 'climbed out alive'}.`];
    if (m.beats.length) {
        bits.push('What happened here, oldest first: ' + m.beats
            .map(b => `at step ${b.step} they tried "${b.text}" and it ${b.ok ? 'worked' : 'went wrong'}`).join('; ') + '.');
    }
    const names = Object.entries(m.heroes).map(([id, st]) => {
        const h = heroById(p, id);
        if (!h) return null;
        if (st.fail && !st.win) return `${h.name} faltered here before`;
        if (st.win && !st.fail) return `${h.name} has got them through this place before`;
        return `${h.name} has both saved and failed them here`;
    }).filter(Boolean);
    if (names.length) bits.push('Companions and this place: ' + names.join('; ') + '.');
    return bits.join(' ');
}

function bank(how) {
    const p = profile();
    if (!p || !run) return;
    p.shards += run.shards; p.mats += run.mats; p.tickets += run.tickets;
    p.runs += 1;
    const reached = Math.max(0, run.step - 1);
    if ((p.cleared[run.dungeon.id] || 0) < reached) p.cleared[run.dungeon.id] = reached;
    rememberRun(p, how, reached);

    const good = run.path.filter(x => x.ok).length;
    p.log.unshift({
        ts: Date.now(), dungeon: run.dungeon.name, reached, depth: run.dungeon.depth, how,
        team: [...(p.team || [])],
        text: `«${run.dungeon.name}»: ${how === 'fail' ? T('сорвался') : T('вышел')} ${T('на')} ${reached}${T('-м ходу из')} ${run.dungeon.depth}` +
            (run.path.length ? `. ${T('Ключевые решения:')} ${run.path.slice(-3).map(x => x.text).join(', ')}` : '') +
            `. ${T('Удачных ходов')} ${good} ${T('из')} ${run.path.length}.`
    });
    if (p.log.length > 20) p.log.length = 20;
    saveSettings(true);
    clearInjection();
    render();
}

/* ---------- upgrading relics ---------- */
function upgradeArt(id) {
    const p = profile();
    if (!p) return;
    const a = artById(p, id);
    if (!a) return;
    const lvl = a.lvl || 0;
    if (lvl >= ART_MAX) return;
    const cost = ART_COST[lvl + 1];
    if (p.shards < cost) { toast('info', `${T('Не хватает осколков: нужно')} ${cost}`); return; }
    p.shards -= cost; a.lvl = lvl + 1;
    saveSettings(true);
    toast('success', `${a.name} ${T('→ ур.')} ${a.lvl}`);
    render();
}

/* ---------- telling the story AI about the dives ---------- */
// Инъекция в промпт основного чата убрана: нора — это сон, ей незачем
// диктовать что-то модели чата. Функция осталась только чтобы стереть
// вставку, оставшуюся в настройках у тех, кто обновился с прошлых версий.
function clearInjection() {
    try { setExtensionPrompt(PROMPT_KEY, '', extension_prompt_types.IN_CHAT, 0, false, extension_prompt_roles.SYSTEM); } catch (e) { }
}

/* ============================================================
   UI
   ============================================================ */
function I(p, w) { return `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="${w || 1.7}" stroke-linecap="round" stroke-linejoin="round">${p}</svg>`; }
const G = {
    nora: '<path d="M4 20V11a8 8 0 0 1 16 0v9M4 20h16M9 20v-4a3 3 0 0 1 6 0v4"/>',
    rabbit: '<path d="M9 13c-3 0-5-4-4-8 .4-1.6 2-1 2.4.6L9 9M15 13c3 0 5-4 4-8-.4-1.6-2-1-2.4.6L15 9"/><path d="M8 13a4 4 0 0 0 8 0c0-2-1.5-3-4-3s-4 1-4 3z"/><circle cx="10.5" cy="15" r=".6" fill="currentColor"/><circle cx="13.5" cy="15" r=".6" fill="currentColor"/>',
    gacha: '<path d="M7 4h7l4 4v12H7zM14 4v4h4"/><path d="M10.5 12.5l1 2.2 2.4.2-1.8 1.6.6 2.3-2.2-1.2-2.2 1.2.6-2.3-1.8-1.6 2.4-.2z"/>',
    sword: '<path d="M6 3l9 9-2 2-9-9zM14 12l6 6-1 3-3-1-6-6"/>',
    roster: '<circle cx="8" cy="9" r="3"/><circle cx="16" cy="9" r="3"/><path d="M3 20c0-3 2.2-5 5-5s5 2 5 5M13 20c0-2.2 1.4-4 3-4.4"/>',
    person: '<circle cx="12" cy="8" r="4"/><path d="M5 20c0-4 3-6.5 7-6.5s7 2.5 7 6.5"/>',
    lock: '<rect x="5" y="11" width="14" height="9" rx="2"/><path d="M8 11V8a4 4 0 0 1 8 0v3"/>',
    arrow: '<path d="M5 12h13M13 6l6 6-6 6"/>', back: '<path d="M19 12H6M11 6l-6 6 6 6"/>',
    gem: '<path d="M12 3l7 6-7 12L5 9z"/><path d="M5 9h14M12 3l-3 6 3 12 3-12z"/>',
    coin: '<circle cx="12" cy="12" r="8"/><path d="M12 8v8M9.5 10h5M9.5 14h5"/>',
    scroll: '<path d="M6 4h9a3 3 0 0 1 3 3v13H8a2 2 0 0 1-2-2z"/><path d="M9 9h6M9 13h6"/>',
    door: '<rect x="6" y="3" width="12" height="18" rx="1.5"/><circle cx="14.5" cy="12" r="1"/>',
    stairs: '<path d="M4 20h4v-4h4v-4h4V8h4"/>', water: '<path d="M4 14c2-3 4-3 6 0s4 3 6 0 4-3 4 0M4 18c2-3 4-3 6 0s4 3 6 0 4-3 4 0"/>',
    clock: '<circle cx="12" cy="12" r="8"/><path d="M12 7v5l3 2"/>', moon: '<path d="M20 14A8 8 0 1 1 10 4a6.5 6.5 0 0 0 10 10z"/>',
    book: '<path d="M5 4h9a3 3 0 0 1 3 3v13H8a3 3 0 0 1-3-3z"/><path d="M17 7h2v13H8"/>',
    mask: '<path d="M4 7c4-2 12-2 16 0 0 7-3 12-8 12S4 14 4 7z"/><circle cx="9" cy="11" r="1"/><circle cx="15" cy="11" r="1"/>',
    key: '<circle cx="8" cy="8" r="4"/><path d="M11 11l9 9M17 17l2-2M14 14l2-2"/>',
    lamp: '<path d="M9 18h6M10 21h4M12 3a6 6 0 0 1 4 10.5V16H8v-2.5A6 6 0 0 1 12 3z"/>',
    mirror: '<ellipse cx="12" cy="10" rx="6" ry="7"/><path d="M9 21h6M12 17v4"/>',
    crown: '<path d="M4 8l3 9h10l3-9-4.5 3L12 5l-3.5 6z"/>',
    blade: '<path d="M14 3l6 6-9 9H5v-6z"/><path d="M5 19l3-3"/>',
    thread: '<path d="M6 3c8 3 8 15 0 18M18 3c-8 3-8 15 0 18"/>',
    eye: '<path d="M2 12s4-6 10-6 10 6 10 6-4 6-10 6-10-6-10-6z"/><circle cx="12" cy="12" r="2.5"/>',
    qmark: '<circle cx="12" cy="12" r="9"/><path d="M9.5 9a2.6 2.6 0 1 1 3.4 2.5c-.6.3-.9.8-.9 1.5v.5"/><circle cx="12" cy="17" r=".7" fill="currentColor"/>',
    ghost: '<path d="M6 20V11a6 6 0 0 1 12 0v9l-2-2-2 2-2-2-2 2-2-2z"/><circle cx="9.5" cy="10" r="1" fill="currentColor"/><circle cx="14.5" cy="10" r="1" fill="currentColor"/>',
    board: '<rect x="3" y="4" width="18" height="13" rx="1"/><path d="M6 9h7M6 12h5M8 21h8M12 17v4"/>',
    hole: '<ellipse cx="12" cy="12" rx="9" ry="6"/><ellipse cx="12" cy="12" rx="5" ry="3" opacity=".5"/>',
    stage: '<path d="M3 18h18M5 18V9l7-4 7 4v9M9 18v-5h6v5"/>',
    chair: '<path d="M6 3v8h12V3M6 11l-1 10M18 11l1 10M6 15h12"/>',
    door2: '<rect x="4" y="3" width="16" height="18" rx="1"/><path d="M9 3v18M9 12h.01"/>',
    seal: '<path d="M12 2l2 6 6 2-6 2-2 6-2-6-6-2 6-2z"/>',
    star: '<path d="M12 2l2.6 6.6 7 .5-5.4 4.5 1.8 6.8L12 17.2 6 20.9l1.8-6.8L2.4 9.1l7-.5z"/>',
    spin: '<path d="M4 12a8 8 0 0 1 13-6l2 2M20 12a8 8 0 0 1-13 6l-2-2M18 4v4h-4M6 20v-4h4"/>',
    quill: '<path d="M20 4c-8 1-13 6-15 14M4 20c2-6 6-9 12-10"/><path d="M14 6l4 4"/>',
    cardI: '<rect x="4" y="3" width="14" height="18" rx="2"/><path d="M8 8h6M8 12h6M8 16h3"/>',
    chev: '<path d="M9 6l6 6-6 6"/>',
    check: '<path d="M5 12l4 4 10-10"/>',
    fist: '<path d="M7 11V7a2 2 0 0 1 4 0M11 11V5a2 2 0 0 1 4 0v6M15 11V7a2 2 0 0 1 4 0v6a6 6 0 0 1-6 6H10l-4-4-1.5-2a1.6 1.6 0 0 1 2.4-2L9 11"/>',
    bolt: '<path d="M13 2 4 14h6l-1 8 9-12h-6z"/>',
    dice: '<rect x="4" y="4" width="16" height="16" rx="3"/><circle cx="9" cy="9" r="1.3" fill="currentColor"/><circle cx="15" cy="15" r="1.3" fill="currentColor"/><circle cx="12" cy="12" r="1.3" fill="currentColor"/>',
    save: '<path d="M5 3h11l3 3v15H5z"/><path d="M8 3v6h7V3M8 21v-6h8v6"/>',
    skull: '<path d="M12 3a8 8 0 0 0-8 8c0 3 1.5 5 3 6v3h10v-3c1.5-1 3-3 3-6a8 8 0 0 0-8-8z"/><circle cx="9" cy="11" r="1.5"/><circle cx="15" cy="11" r="1.5"/>',
    shield: '<path d="M12 2 4 6v6c0 4.5 3.2 8 8 10 4.8-2 8-5.5 8-10V6z"/>',
    x: '<path d="M6 6l12 12M18 6L6 18"/>'
};

/* ---------- decorative SVG (узорчики из game-hub) ---------- */
const DECOR = {
    chain() { return '<svg viewBox="0 0 620 60" preserveAspectRatio="none" fill="none" stroke="currentColor"><path d="M4 8 Q310 62 616 8" stroke-width="4.5" stroke-linecap="round" stroke-dasharray="1.5 6"/><path d="M4 8 Q310 62 616 8" stroke-width="1" opacity=".6"/></svg>'; },
    watch() {
        return `<svg viewBox="0 0 44 74">
            <line x1="22" y1="0" x2="22" y2="10" stroke="currentColor" stroke-width="1.6"/>
            <circle cx="22" cy="13" r="3.2" fill="none" stroke="currentColor" stroke-width="1.6"/>
            <circle cx="22" cy="46" r="18" fill="#f3ead2" stroke="currentColor" stroke-width="2"/>
            <circle cx="22" cy="46" r="14.5" fill="none" stroke="currentColor" stroke-width="1"/>
            <g stroke="currentColor" stroke-width="1.2">
                <line x1="22" y1="31" x2="22" y2="34"/><line x1="22" y1="58" x2="22" y2="61"/>
                <line x1="7" y1="46" x2="10" y2="46"/><line x1="34" y1="46" x2="37" y2="46"/></g>
            <line x1="22" y1="46" x2="22" y2="37" stroke="currentColor" stroke-width="1.6" stroke-linecap="round"/>
            <line x1="22" y1="46" x2="29" y2="49" stroke="currentColor" stroke-width="1.6" stroke-linecap="round"/></svg>`;
    },
    card() { return '<svg viewBox="0 0 38 54" fill="none" stroke="currentColor" stroke-width="1.4"><rect x="2" y="2" width="34" height="50" rx="4" fill="#f3ead2" fill-opacity=".12"/><path d="M19 16l6 9-6 9-6-9z" fill="currentColor" fill-opacity=".5"/><path d="M7 8h3M28 46h3"/></svg>'; },
    vine() { return '<svg viewBox="0 0 130 130" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round"><path d="M126 126C90 122 70 104 60 78 52 58 60 40 44 30"/><path d="M60 78c-14 2-22-6-24-16M78 96c10-2 14-10 12-20"/><circle cx="40" cy="26" r="6" fill="currentColor" fill-opacity=".35"/><circle cx="40" cy="26" r="9"/><path d="M96 116c8-2 12-8 12-16"/><circle cx="108" cy="96" r="5" fill="currentColor" fill-opacity=".3"/></svg>'; },
    rose() { return '<svg viewBox="0 0 110 110" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round"><path d="M106 106C78 102 62 88 55 68 49 52 55 38 42 30"/><circle cx="38" cy="26" r="7" fill="currentColor" fill-opacity=".35"/><circle cx="38" cy="26" r="10"/><path d="M84 98c8-2 12-8 12-16"/><circle cx="96" cy="82" r="5" fill="currentColor" fill-opacity=".3"/></svg>'; },
    fili() { return '<svg viewBox="0 0 56 56" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round"><path d="M6 6h16M6 6v16"/><path d="M6 6c14 0 22 8 22 22"/><circle cx="10" cy="10" r="2.2"/><path d="M18 6c8 2 12 8 14 16"/></svg>'; },
    rune() {
        let t = '';
        for (let i = 0; i < 12; i++) t += `<line x1="115" y1="10" x2="115" y2="22" transform="rotate(${i * 30} 115 115)"/>`;
        return `<svg viewBox="0 0 230 230" fill="none" stroke="currentColor" stroke-width="1.2"><circle cx="115" cy="115" r="108"/><circle cx="115" cy="115" r="86"/>${t}<path d="M115 30 L175 150 L55 150 Z"/><path d="M115 200 L55 80 L175 80 Z" opacity=".6"/></svg>`;
    }
};
function filiCorners() {
    return `<span class="rdg-fcc tl">${DECOR.fili()}</span><span class="rdg-fcc tr">${DECOR.fili()}</span><span class="rdg-fcc bl">${DECOR.fili()}</span><span class="rdg-fcc br">${DECOR.fili()}</span>`;
}
function motes(n) {
    let h = '';
    for (let i = 0; i < n; i++) h += `<i style="left:${(Math.random() * 96).toFixed(1)}%;top:${(Math.random() * 92).toFixed(1)}%;animation-delay:${(Math.random() * 5).toFixed(2)}s;animation-duration:${(4.5 + Math.random() * 4).toFixed(2)}s"></i>`;
    return `<div class="rdg-sky">${h}</div>`;
}
function viewDecor() {
    return `<div class="rdg-vdecor"><div class="rdg-vchain">${DECOR.chain()}</div>
        <div class="rdg-drose" style="right:-8px;bottom:-8px">${DECOR.rose()}</div>
        <div class="rdg-drose" style="left:-8px;bottom:-8px;transform:scaleX(-1)">${DECOR.rose()}</div></div>`;
}
function shellDecor() {
    return `<div class="rdg-decor"><div class="rdg-dchain">${DECOR.chain()}</div>
        <div class="rdg-dwatch">${DECOR.watch()}</div>
        <div class="rdg-dcardf" style="top:16px;right:-16px;--r:16deg">${DECOR.card()}</div>
        <div class="rdg-dcardf" style="top:54px;right:-6px;--r:-9deg;animation-delay:1.2s">${DECOR.card()}</div>
        <div class="rdg-dcardf" style="top:98px;right:-20px;--r:22deg;animation-delay:2.4s">${DECOR.card()}</div>
        <div class="rdg-dcardf" style="bottom:20px;left:-18px;--r:-14deg;animation-delay:.6s">${DECOR.card()}</div>
        <div class="rdg-dcardf" style="bottom:64px;left:-6px;--r:8deg;animation-delay:1.8s">${DECOR.card()}</div>
        <div class="rdg-dvine" style="right:-14px;bottom:-14px">${DECOR.vine()}</div>
        <div class="rdg-dvine" style="left:-16px;bottom:-16px;transform:scaleX(-1)">${DECOR.vine()}</div></div>`;
}
function starBurst(host) {
    try {
        for (let z = 0; z < 14; z++) {
            const s = document.createElement('div');
            s.style.cssText = 'position:absolute;left:50%;top:38%;color:#f4dd97;font-family:Cinzel,serif;font-weight:800;pointer-events:none;font-size:' + (8 + Math.random() * 13) + 'px';
            s.textContent = '✦';
            host.appendChild(s);
            const a = Math.random() * 6.28, r = 90 + Math.random() * 150;
            s.animate([
                { transform: 'translate(-50%,-50%) scale(.3)', opacity: 1 },
                { transform: `translate(calc(-50% + ${Math.cos(a) * r}px),calc(-50% + ${Math.sin(a) * r}px)) scale(1)`, opacity: 0 }
            ], { duration: 1000, easing: 'ease-out' });
            setTimeout(() => s.remove(), 1050);
        }
    } catch (e) { }
}
const NAV_IDS = [['nora', 'Данжи', 'nora'], ['gacha', 'Призыв', 'gacha'], ['abyss', 'Нора', 'rabbit'], ['roster', 'Досье', 'roster']];
function NAV() { return NAV_IDS.map(n => [n[0], T(n[1]), n[2]]); }
const SOON = {};

let shellPos = null;                       // {x,y} — держится до перезагрузки страницы
function detachShell(shell) {
    // окно центрируется флексом; пока не открепим его в абсолютные координаты,
    // left/top считаются ОТ центра — отсюда и прыжок в сторону
    if (shell.dataset.free) return;
    const r = shell.getBoundingClientRect();
    shell.style.position = 'fixed';
    shell.style.left = r.left + 'px';
    shell.style.top = r.top + 'px';
    shell.style.margin = '0';
    shell.dataset.free = '1';
}
function clampShell(shell, x, y, dims) {
    // dims позволяет не читать offsetWidth/Height на каждое движение мыши —
    // размер окна не меняется во время перетаскивания, мерить его каждый раз незачем
    const w = dims ? dims.w : shell.offsetWidth, h = dims ? dims.h : shell.offsetHeight;
    return {
        x: Math.max(120 - w, Math.min(window.innerWidth - 120, x)),
        y: Math.max(0, Math.min(window.innerHeight - 60, y))
    };
}
function makeDraggable(shell) {
    if (!shell) return;
    const start = e => {
        // тянем только за саму рамку и за ручку, не за содержимое и кнопки
        if (e.target.closest('.rdg-main, .rdg-rail, .rdg-x, button, input, textarea, select, a')) return;
        if (e.button !== undefined && e.button !== 0) return;
        detachShell(shell);
        const t = e.touches ? e.touches[0] : e;
        const r = shell.getBoundingClientRect();
        const ox = t.clientX - r.left, oy = t.clientY - r.top;   // теперь честная разница от угла окна
        const dims = { w: shell.offsetWidth, h: shell.offsetHeight };   // once, not on every move
        shell.classList.add('rdg-dragging');
        const move = ev => {
            const q = ev.touches ? ev.touches[0] : ev;
            const pos = clampShell(shell, q.clientX - ox, q.clientY - oy, dims);
            shellPos = pos;
            shell.style.left = pos.x + 'px';
            shell.style.top = pos.y + 'px';
            if (ev.cancelable) ev.preventDefault();
        };
        const up = () => {
            shell.classList.remove('rdg-dragging');
            document.removeEventListener('mousemove', move); document.removeEventListener('mouseup', up);
            document.removeEventListener('touchmove', move); document.removeEventListener('touchend', up);
        };
        document.addEventListener('mousemove', move); document.addEventListener('mouseup', up);
        document.addEventListener('touchmove', move, { passive: false }); document.addEventListener('touchend', up);
        if (e.cancelable) e.preventDefault();     // без этого браузер начинает выделять текст
    };
    shell.addEventListener('mousedown', start);
    shell.addEventListener('touchstart', start, { passive: false });
    // двойной клик по рамке возвращает окно в центр
    shell.addEventListener('dblclick', e => {
        if (e.target.closest('.rdg-main, .rdg-rail, button, input, textarea, select, a')) return;
        shell.removeAttribute('style'); delete shell.dataset.free; shellPos = null;
        toast('info', T('Окно вернулось в центр.'));
    });
}
// Как в RPG Map & Locations Engine: кнопка прячется на приветственном экране Таверны
const RABBIT_SOLID = `<svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><ellipse cx="9" cy="7" rx="2.15" ry="5.4" fill="currentColor" transform="rotate(-13 9 7)"/><ellipse cx="15" cy="7" rx="2.15" ry="5.4" fill="currentColor" transform="rotate(13 15 7)"/><ellipse cx="9" cy="7.2" rx="0.85" ry="3.5" fill="#5e1414" opacity=".55" transform="rotate(-13 9 7.2)"/><ellipse cx="15" cy="7.2" rx="0.85" ry="3.5" fill="#5e1414" opacity=".55" transform="rotate(13 15 7.2)"/><circle cx="12" cy="16" r="5.6" fill="currentColor"/><circle cx="9.9" cy="15.2" r="0.95" fill="#5e1414"/><circle cx="14.1" cy="15.2" r="0.95" fill="#5e1414"/><path d="M12 17.4c.62 0 1.05.32 1.05.72 0 .42-.47.72-1.05.72s-1.05-.3-1.05-.72c0-.4.43-.72 1.05-.72z" fill="#5e1414"/><path d="M12 18.85v.9M12 19.75c-.5.55-1.35.55-1.85.1M12 19.75c.5.55 1.35.55 1.85.1" stroke="#5e1414" stroke-width=".62" fill="none" stroke-linecap="round"/></svg>`;
function inChat() {
    try { return !!getContext().chatId; } catch (e) { return false; }
}
function ensureUI() {
    if (!document.getElementById('rdg-modal')) {
        const m = document.createElement('div');
        m.id = 'rdg-modal';
        m.innerHTML = `<div class="rdg-shell" id="rdg-shell">${shellDecor()}<div class="rdg-grip" id="rdg-grip" title="${T("Перетащи окно")}"></div>
            <div class="rdg-ver">v${VERSION}</div><div class="rdg-x" id="rdg-close">✕</div>
            <div class="rdg-rail" id="rdg-rail"></div><div class="rdg-main" id="rdg-main"></div></div>`;
        document.body.appendChild(m);
        // delegated + namespaced: ten sibling extensions do blanket .off('click') on close buttons
        jQuery(document).off('click.rdg').on('click.rdg', '#rdg-close', closeHub);
        // полоска «чей сон» пересобирается на каждой перерисовке, поэтому обработчик
        // делегированный и вешается один раз — иначе его пришлось бы вешать в шести
        // функциях отрисовки, которые зовут hdr()
        jQuery(document).on('click.rdg', '#rdg-main .rdg-who', function () { switchWho(this.dataset.who); });
        makeDraggable(document.getElementById('rdg-shell'));
    }
    let box = jQuery('#rpg-buttons-container');
    if (!box.length) {
        box = jQuery('<div id="rpg-buttons-container" style="position:fixed; bottom:20px; right:20px; display:flex; gap:15px; z-index:3000;"></div>');
        jQuery('body').append(box);
    }
    if (!jQuery('#rdg-btn').length) {
        const b = jQuery(`<div class="rpg-floating-btn" id="rdg-btn" title="${T('Кроличья нора')}" style="position:static; width:50px; height:50px; margin:0; display:flex;">${RABBIT_SOLID}</div>`);
        box.append(b);
        b.on('click', toggleHub);
    }
    // кнопка живёт только внутри чата: на главном экране Таверны её быть не должно
    jQuery('#rdg-btn').attr('title', T('Кроличья нора')).toggle(!!settings.enabled && inChat());
}
function toggleHub() {
    const m = document.getElementById('rdg-modal');
    if (m && jQuery(m).hasClass('rdg-open')) closeHub(); else openHub();
}
/* FEATURE (by request): a small "welcome back" note on opening the hub — it only
   ever summarises resources that are genuinely already sitting there (tickets,
   shards, a relic ready to level). No idle/offline generation is invented; this
   is a greeting, not a new mechanic. Quiet if you were just here a minute ago. */
function welcomeBack() {
    try {
        const p = profile();
        if (!p || !p.forged) return;
        const now = Date.now();
        const away = now - (p.lastSeen || now);
        p.lastSeen = now;
        saveSettings();
        if (away < 5 * 60 * 1000) return;                 // была только что — не докучаем
        const bits = [];
        if (p.tickets > 0) bits.push(`${p.tickets} ${T('круток')}`);
        if (p.shards > 0) bits.push(`${p.shards} ${T('осколков')}`);
        const canUpgrade = (p.artifacts || []).some(a => (a.lvl || 0) < ART_MAX && p.shards >= (ART_COST[(a.lvl || 0) + 1] || Infinity));
        const mins = Math.round(away / 60000);
        const when = mins < 60 ? `${mins} ${T('мин. назад')}`
            : mins < 60 * 24 ? `${Math.round(mins / 60)} ${T('ч. назад')}`
                : `${Math.round(mins / 60 / 24)} ${T('дн. назад')}`;
        let msg = `${T('С возвращением!')} (${when})`;
        if (bits.length) msg += ` ${T('У тебя наготове:')} ${bits.join(', ')}.`;
        if (canUpgrade) msg += ` ${T('Есть что прокачать среди реликвий.')}`;
        toast('info', msg);
    } catch (e) { console.warn('[Dungeons] welcome back', e); }
}
function openHub() {
    const sh = document.getElementById('rdg-shell');
    if (sh && shellPos) {
        const pos = clampShell(sh, shellPos.x, shellPos.y);   // окно таверны могли уменьшить
        sh.style.position = 'fixed'; sh.style.margin = '0';
        sh.style.left = pos.x + 'px'; sh.style.top = pos.y + 'px';
        sh.dataset.free = '1';
    } ui.profileKey = profileKey(); welcomeBack(); jQuery('#rdg-modal').addClass('rdg-open'); render(); }
function closeHub() { jQuery('#rdg-modal').removeClass('rdg-open'); }

let lastScreen = '';
// BUG FIX (opt. audit): a full render() rebuilds #rdg-main's innerHTML, which resets
// every scroll position inside it to 0 — upgrade a relic at the bottom of a long
// panel, or run a GM action, and the view you were reading jumps back to the top.
// Grabbed before the rebuild, restored after, exactly like any other scrollable list.
const SCROLL_AREAS = ['.rdg-chaps', '.rdg-chron', '.rdg-cb'];
function grabScroll(root) {
    const out = [];
    try {
        if (!root) return out;
        if (root.scrollTop > 0) out.push({ sel: null, i: 0, top: root.scrollTop });
        SCROLL_AREAS.forEach(sel => {
            root.querySelectorAll(sel).forEach((el, i) => {
                if (el.scrollTop > 0) out.push({ sel, i, top: el.scrollTop });
            });
        });
    } catch (e) { /* никогда не ронять перерисовку */ }
    return out;
}
function restoreScroll(root, saved) {
    if (!root || !saved || !saved.length) return;
    try {
        saved.forEach(s => {
            const el = s.sel ? root.querySelectorAll(s.sel)[s.i] : root;
            if (el) el.scrollTop = s.top;   // короче стал — браузер обрежет сам
        });
    } catch (e) { }
}
function render() {
    const main = document.getElementById('rdg-main');
    if (!main) return;
    const savedScroll = grabScroll(main);
    main.classList.toggle('rdg-working', !!ui.busy);
    renderStopBar();
    const screen = [ui.mode, run ? 'run' : '', F ? 'fight' : '', ui.gview].join('|');
    main.classList.toggle('rdg-quiet', screen === lastScreen);   // тот же экран — без въезда и мерцания
    lastScreen = screen;
    renderRail();
    const p = profile();
    if (!p) { main.innerHTML = `<div class="rdg-empty"><div class="rdg-big2">${T('Нора не знает, кто ты')}</div><p>${T('Открой чат с персонажем — «Кроличья нора» кует мир из его карточки, чтобы данжи и артефакты подходили именно ему.')}</p></div>`; restoreScroll(main, savedScroll); return; }
    main.classList.remove('rdg-dark');
    if (!p.forged) { renderForge(main, p); restoreScroll(main, savedScroll); return; }
    if (run) { renderRun(main, p); restoreScroll(main, savedScroll); return; }
    if (!['nora', 'gacha', 'abyss', 'roster'].includes(ui.mode)) ui.mode = 'nora';   // migrate saved modes from v2.0
    if (ui.mode === 'gacha') { main.classList.add('rdg-dark'); renderGacha(main, p); restoreScroll(main, savedScroll); return; }
    if (ui.mode === 'abyss') { if (F) renderFight(main, p); else renderAbyss(main, p); restoreScroll(main, savedScroll); return; }
    if (ui.mode === 'roster') { renderRoster(main, p); restoreScroll(main, savedScroll); return; }
    renderSelect(main, p);
    restoreScroll(main, savedScroll);
}
/* Пока расширение думает, у человека должен быть выход. Полоска висит поверх панели
   всё время, что идёт запрос, и показывает, что именно считается, — а не просто
   «подожди». Строится один раз и дальше только переключается, чтобы не перезапускать
   анимацию на каждой перерисовке. */
let stopBarEl = null;
/* Что вообще считается «расширение сейчас занято». Сюда входит и imgBusy отдельных
   героев: раньше он не показывался нигде, поэтому застрявший флаг выглядел просто как
   «всё сломалось», без единого элемента управления на экране. */
function anyStuck() {
    if (ui.busy || drawQueue) return true;
    const p = profile();
    return !!p && [...(p.heroes || []), ...(p.artifacts || [])].some(o => o.imgBusy);
}
function renderStopBar() {
    const shell = document.getElementById('rdg-shell');
    if (!shell) return;
    if (!stopBarEl) {
        stopBarEl = document.createElement('div');
        stopBarEl.className = 'rdg-stopbar';
        stopBarEl.innerHTML = `<span class="rdg-stoptx"></span>
            <button class="rdg-stopb" type="button">${esc(T('Остановить'))}</button>`;
        stopBarEl.querySelector('.rdg-stopb').onclick = () => {
            drawCancel = true;                 // очередь картинок завершится после текущей
            const hit = cancelAI();
            stopBarEl.classList.add('ending');
            /* Если прерывать было нечего, значит занятость где-то застряла — именно
               это запирало расширение. Тогда кнопка работает как разблокировка. */
            if (!hit) { clearAllBusy(); toast('info', T('Занятость сброшена.')); }
            else setTimeout(() => { if (anyStuck()) clearAllBusy(); }, 1500);
        };
        shell.appendChild(stopBarEl);
    }
    const busy = anyStuck();
    stopBarEl.classList.toggle('on', busy);
    if (!busy) { stopBarEl.classList.remove('ending'); return; }
    const txt = drawQueue
        ? `${T('Рисую')} ${drawQueue.done + 1}/${drawQueue.total}`
        : T('ИИ думает…');
    const spent = usageTotal();
    stopBarEl.querySelector('.rdg-stoptx').textContent = spent
        ? `${txt} · ${T('за сессию')} ~${spent.toLocaleString(numLocale())} ${T('токенов')}`
        : txt;
}

function renderRail() {
    const rail = document.getElementById('rdg-rail');
    if (!rail) return;
    if (!rail.dataset.built) {                     // перестройка каждый раз перезапускала анимации кнопок
        rail.innerHTML = '<div class="rdg-logo">♣ ♥ ♦ ♠</div>' + NAV().map(n =>
            `<button class="rdg-navb" data-m="${n[0]}"><span class="rdg-ic">${I(G[n[2]])}</span><span class="rdg-lb">${esc(n[1])}</span></button>`).join('');
        rail.querySelectorAll('.rdg-navb').forEach(b => b.onclick = () => {
            if (run && run.alive) { toast('info', T('Сначала закончи заход.')); return; }

            ui.mode = b.dataset.m; render();
        });
        rail.dataset.built = '1';
    }
    rail.querySelectorAll('.rdg-navb').forEach(b => b.classList.toggle('on', ui.mode === b.dataset.m));
}
/* Портрет персонажа из самой Таверны. Хелпер есть не во всех сборках, поэтому
   пробуем по очереди и в конце честно падаем на первую букву имени — пустой кружок
   лучше битой картинки. */
function stAvatar(ch) {
    const f = ch && ch.avatar;
    if (!f || f === 'none.png') return '';
    try {
        const g = getContext()?.getThumbnailUrl;
        if (typeof g === 'function') { const u = g('avatar', f); if (u) return u; }
    } catch (e) { }
    try { return '/thumbnail?type=avatar&file=' + encodeURIComponent(f); } catch (e) { return ''; }
}
/* Полоска «чей это сон». Показывается только когда выбор есть — в сольном чате
   участник один, и ряд из одного имени был бы мусором. Подпись под ним остаётся
   всегда: даже наедине полезно видеть, чей сон открыт. */
function dreamBar() {
    const cast = groupCast();
    const now = profileKey();
    if (!now) return '';
    const mine = (nm) => {
        const pr = settings.profiles && settings.profiles[nm];
        return !!(pr && pr.forged);
    };
    if (cast.length < 2) {
        return `<div class="rdg-dream solo"><span class="rdg-dreamw">${I(G.moon, 1.5)}${T('сон')} <b>${esc(now)}</b></span></div>`;
    }
    const locked = !!switchBlocker();
    const tabs = cast.map(c => {
        const on = c.name === now;
        const av = stAvatar(c);
        const face = av
            ? `<img src="${esc(av)}" alt="" loading="lazy" onerror="this.remove()">`
            : '';
        return `<button class="rdg-who ${on ? 'on' : ''} ${mine(c.name) ? 'has' : ''}" data-who="${esc(c.name)}"
            title="${esc(mine(c.name) ? T('сон ') + c.name : T('сон ') + c.name + T(' · ещё не выкован'))}">
            <span class="rdg-whoav">${face}<i>${esc((c.name || '?').trim().charAt(0).toUpperCase())}</i></span>
            <span class="rdg-whonm">${esc(c.name)}</span></button>`;
    }).join('');
    return `<div class="rdg-dream ${locked ? 'locked' : ''}">
        <span class="rdg-dreamw">${I(G.moon, 1.5)}${T('сон')} <b>${esc(now)}</b></span>
        <div class="rdg-whos">${tabs}</div></div>`;
}
function hdr(title, sub, right) {
    return `<div class="rdg-hdr"><div class="rdg-kh"><div class="rdg-rb">${I(G.rabbit, 1.5)}</div>
        <div><div class="rdg-t">${esc(title)}</div><div class="rdg-s">${esc(sub)}</div></div></div>
        <div class="rdg-prog">${right || ''}</div></div>${dreamBar()}`;
}
function purse(p) {
    return `<div class="rdg-purse">
        <span class="rdg-coin">${I(G.gem, 1.4)}${T('осколки')} <b>${p.shards}</b></span>
        <span class="rdg-coin">${I(G.thread, 1.4)}${T('материалы')} <b>${p.mats}</b></span>
        <span class="rdg-coin">${I(G.coin, 1.4)}${T('крутки')} <b>${p.tickets}</b></span>
    </div>`;
}

function loader(text) {
    return `<div class="rdg-loader"><div class="rdg-lspin">${DECOR.rune()}</div>
        <div class="rdg-ltxt">${esc(text)}</div><div class="rdg-lbar"><i></i></div>
        <div class="rdg-lsub">${T('ИИ читает карточку персонажа — это занимает 10–40 секунд')}</div></div>`;
}
function PAGE_TEXT() {
    if ((settings.uiLang || 'en') === 'ru') return `
            <p class="rdg-first">Знаешь, как устроены сны? Мозг не выдумывает ничего с нуля. Он берёт коридор, по которому ты ходишь каждый день, кассиршу, которую видела мельком, чужой разговор из автобуса — и пересобирает всё это в мир, который почти настоящий. Почти.</p>
            <p>Кроличья нора работает так же. Она читает карточку твоего персонажа — где он живёт, кого знает, чего боится, что носит в карманах — и роет ход вниз, под его собственную жизнь. Школьник спустится в свою школу, но в три часа ночи, когда коридоры длиннее, чем днём. Врач — в своё отделение, где в палатах лежат не те, кого он помнит.</p>
            <p>Шесть вещей станут артефактами: не мечи и амулеты, а <i>его</i> вещи, у которых внизу окажется другая сила. Шесть знакомых лиц станут спутниками — те, кого он видел мельком и не запомнил, а нора запомнила за него.</p>
            <p class="rdg-verse">Чем глубже, тем меньше правил.<br>Как и положено.</p>`;
    return `
            <p class="rdg-first">You know how dreams are built? The mind invents nothing from scratch. It takes the corridor you walk every day, the cashier you barely looked at, a stranger's conversation on the bus — and reassembles all of it into a world that is almost real. Almost.</p>
            <p>The rabbit hole works the same way. It reads your character's card — where they live, who they know, what they fear, what they carry in their pockets — and digs a passage down, underneath their own life. A schoolboy will go down into his own school, but at three in the morning, when the corridors are longer than they are by day. A doctor into his own ward, where the beds hold people he does not remember.</p>
            <p>Six things will become relics: not swords and amulets, but <i>his</i> things, the ones that turn out to have another power down there. Six familiar faces will become companions — the ones he saw in passing and never remembered, and the hole remembered for him.</p>
            <p class="rdg-verse">The deeper you go, the fewer the rules.<br>As it should be.</p>`;
}
function renderForge(main, p) {
    main.innerHTML = `<div class="rdg-view">${viewDecor()}${hdr(T('КРОЛИЧЬЯ НОРА'), T('МИР ЕЩЁ НЕ ВЫКОВАН'))}
        <div class="rdg-page">
            <div class="rdg-chapno">✦</div>
            <h2 class="rdg-ptitle">${T('Здесь начинается сон')}</h2>
            ${PAGE_TEXT()}
            <div class="rdg-orn">❦</div>
            <div class="rdg-pfoot">
                ${ui.busy ? loader(T('Нора роется…')) : `<button class="rdg-forge" id="rdg-do-forge">${T('✦ Открыть нору')}</button>`}
            </div>
        </div></div>`;
    const b = document.getElementById('rdg-do-forge');
    if (b) b.onclick = forgeWorld;
}

function renderSelect(main, p) {
    const cards = p.dungeons.map(d => {
        const prev = p.dungeons.find(x => x.tier === d.tier - 1);
        const open = d.tier === 1 || (prev && (p.cleared[prev.id] || 0) >= Math.min(LEG, prev.depth));
        const best = p.cleared[d.id] || 0;
        if (!open) {
            return `<div class="rdg-dcard lock"><span class="rdg-lk">${I(G.lock)}</span><div class="rdg-din">
                <div class="rdg-dic">${I(G[d.icon] || G.door, 1.3)}</div>
                <div class="rdg-dn">${esc(d.name)}</div><div class="rdg-dd">${esc(d.desc)}</div>
                <div class="rdg-req">${T('закрыто · пройди «')}${esc(prev ? prev.name : '')}${T('» до')} ${Math.min(LEG, prev ? prev.depth : LEG)} ${T('ходов')}</div></div></div>`;
        }
        return `<div class="rdg-dcard" data-id="${esc(d.id)}"><div class="rdg-din"><div class="rdg-shine"></div>
            <div class="rdg-dic">${I(G[d.icon] || G.door, 1.3)}</div>
            <div class="rdg-dn">${esc(d.name)}</div><div class="rdg-dd">${esc(d.desc)}</div>
            <div class="rdg-dm"><span class="rdg-pill tier">${esc(T(TIER_NAME[d.tier] || ''))}</span>
            <span class="rdg-pill">${T('до')} ${d.depth} ${T('ходов')}</span>
            ${best ? `<span class="rdg-pill best">${T('рекорд')} ${best}</span>` : ''}</div>
            ${(() => {
            // след прошлых спусков: место больше не выглядит нетронутым
            const m = p.memory && p.memory[d.id];
            if (!m || !m.visits) return '';
            return `<div class="rdg-been ${m.lastHow === 'fail' ? 'fell' : ''}">${I(G.clock, 1.6)}
                    <span>${T('спусков:')} <b>${m.visits}</b> · ${m.lastHow === 'fail' ? T('в прошлый раз сорвался') : T('в прошлый раз вышел')}</span></div>`;
        })()}</div></div>`;
    }).join('');
    main.innerHTML = `<div class="rdg-view">${viewDecor()}${hdr(T('ВЫБОР НОРЫ'), esc(clip(p.setting, 60) || T('КУДА СПУСТИМСЯ')), `${T('спусков')} <b>${p.runs}</b><br>${T('сила реликвий')} <b>${artPower(p)}</b>`)}
        ${purse(p)}<div class="rdg-label">${T('НОРЫ')}</div><div class="rdg-grid">${cards}</div>
        <div class="rdg-hint">${ui.busy ? T('НОРА ОТКРЫВАЕТСЯ…') : T('ЧЕМ ГЛУБЖЕ — ТЕМ ЛУЧШЕ ДОБЫЧА. ЗАКРЫТЫЕ ПУТИ ОТКРЫВАЮТ ПРОКАЧАННЫЕ АРТЕФАКТЫ')}</div></div>`;
    if (!ui.busy) main.querySelectorAll('.rdg-dcard[data-id]').forEach(c =>
        c.onclick = () => { const d = p.dungeons.find(x => x.id === c.dataset.id); if (d) startRun(d); });
}

function renderRun(main, p) {
    const d = run.dungeon, sc = curScene();
    const depth = d.depth;
    let trail = '';
    // след показывает всю нору: её глубина и так написана на карточке, прятать нечего
    const shown = depth;
    for (let i = 1; i <= shown; i++) {
        trail += `<span class="rdg-dot ${i < run.step ? 'done' : i === run.step ? 'now' : ''}"></span>`;
        if (i < shown) trail += '<span class="rdg-ln"></span>';
    }
    trail += `<span class="rdg-step">${T('ход ')}<b>${Math.min(run.step, depth)}</b> / ${depth}</span>`;

    /* Давление видно, а не только считается. Шесть делений заполняются по мере спуска,
       подпись меняется словами — чтобы было понятно, что стало тяжелее, и почему
       «тихий» путь вдруг перестал быть надёжным. */
    const ps = pressureStage(run);
    const PNAMES = [T('вход'), T('что-то не так'), T('нора проснулась'), T('она мешает'), T('почти без света'), T('дно')];
    const press = `<div class="rdg-press s${ps}" title="${T('чем глубже, тем хуже исход любого хода')}">
        <span class="rdg-pressl">${T('ДАВЛЕНИЕ')}</span>
        <span class="rdg-pressd">${[0,1,2,3,4,5].map(i => `<i class="${i <= ps ? 'on' : ''}"></i>`).join('')}</span>
        <span class="rdg-pressn">${PNAMES[ps]}</span></div>`;

    /* Нервы. Это и есть часы захода: тратятся на каждый ход, сильно — на провал, и на
       то, чтобы собраться после срыва. Ниже половины всё идёт хуже, на нуле заход
       окончен. Показываем запасом и словом, без процентов — числом игрок начал бы
       считать шансы, а их он знать не должен. */
    const ns = nerveStage(run);
    const NNAMES = [T('на исходе'), T('едва держишься'), T('потрёпан'), T('собран'), T('свеж')];
    const nerve = `<div class="rdg-nerve n${ns}" title="${T('кончатся — заход окончен')}">
        <span class="rdg-nervel">${I(G.moon, 1.5)}${T('НЕРВЫ')}</span>
        <span class="rdg-nerved"><i style="width:${Math.round(nerveFrac(run) * 100)}%"></i></span>
        <span class="rdg-nerven">${NNAMES[ns]}</span></div>`;

    const mem = (p.team || []).map(id => heroById(p, id)).filter(h => h && h.unlocked);
    const party = `<div class="rdg-pbar"><span class="rdg-pl">${T('С ТОБОЙ')}${mem.length ? T(' ИДУТ · ') + (mem.length + 1) : ''}</span>
        <div class="rdg-pmem mc"><div class="rdg-av"><div class="rdg-i"><span class="rdg-a" style="--e:#8a2c23"></span>${I(G.person, 1.5)}</div></div><span class="rdg-mn">${esc(name1 || T('Ты'))}</span></div>
        ${mem.map(h => {
        const out = heroDown(run, h.id);
        return `<div class="rdg-pmem ${out ? 'out' : ''}" title="${out ? esc(h.name + T(' выбыл из захода')) : esc(h.name)}">
            <div class="rdg-av"><div class="rdg-i"><span class="rdg-a" style="--e:${out ? '#8a8070' : h.e}"></span>${I(out ? G.x : G.person, 1.5)}</div></div>
            <span class="rdg-mn">${esc(h.name)}</span></div>`;
    }).join('')}
        ${mem.length ? '' : '<span class="rdg-pl">' + T('· собери отряд во вкладке «Нора»') + '</span>'}
        <button class="rdg-backb" id="rdg-flee">${I(G.back)} ${T('сбежать')}</button></div>`;

    let body;
    if (run.pendingExit) {
        body = `<div class="rdg-scene"><div class="rdg-sctop"><div class="rdg-pic">${I(G.stairs, 1.4)}</div>
            <div><div class="rdg-scname">${T('Выход рядом')}</div>
            <div class="rdg-scdesc">${T('Ты прошёл')} ${run.step - 1} ${T('ходов. Отсюда ещё можно подняться и унести добычу целой. Глубже — больше осколков и круток, но сорваться будет обиднее.')}</div></div></div>
            ${run.echo ? `<div class="rdg-echo ${run.echoKind}">${esc(fillMacros(run.echo))}</div>` : ''}</div>
            <div class="rdg-choices">
                <button class="rdg-choice" id="rdg-out"><span class="rdg-cl">${I(G.arrow)}${T('Выйти с добычей')}</span><span class="rdg-tag safe">${T('осколков')} ${run.shards}</span></button>
                <button class="rdg-choice" id="rdg-deep"><span class="rdg-cl">${I(G.arrow)}${T('Глубже в нору')}</span><span class="rdg-tag risk">${T('риск · до')} ${depth} ${T('ходов')}</span></button>
            </div>`;
    } else if (run.stumble) {
        /* Срыв ещё не окончателен. Можно собраться — заплатить нервами и переиграть
           этот же ход. Цена настоящая, запас один на заход, так что это решение. */
        const can = run.nerve >= ROG.steadyCost;
        body = `<div class="rdg-scene"><div class="rdg-sctop"><div class="rdg-pic">${I(G.hole, 1.4)}</div>
            <div class="rdg-sctxt"><div class="rdg-scname">${T('Пошло не так')}</div>
            <div class="rdg-scdesc">${T('Ещё можно собраться и перехватить это — но сил такое стоит дорого, и их у тебя не бесконечно.')}</div></div></div>
            ${run.echo ? `<div class="rdg-echo bad">${esc(fillMacros(run.echo))}</div>` : ''}</div>
            <div class="rdg-choices">
                <button class="rdg-choice" id="rdg-steady" ${can ? '' : 'disabled'}><span class="rdg-cl">${I(G.bolt)}${T('Собраться и переиграть ход')}</span>
                    <span class="rdg-tag risk">${can ? T('дорого по нервам') : T('сил не хватает')}</span></button>
                <button class="rdg-choice" id="rdg-accept"><span class="rdg-cl">${I(G.arrow)}${T('Принять как есть')}</span></button>
            </div>`;
    } else if (ui.busy) {
        body = `<div class="rdg-scene"><div class="rdg-sctop"><div class="rdg-pic"><span class="rdg-spin">✦</span></div>
            <div><div class="rdg-scname">${T('Темнота впереди')}</div><div class="rdg-scdesc">${T('Нора решает, что будет дальше…')}</div></div></div></div>`;
    } else if (sc) {
        const ch = sc.choices.map((c, i) => {
            if (c.kind === 'art') {
                const a = artById(p, c.art);
                const okk = a && (a.lvl || 0) >= c.need;
                if (!okk) return `<button class="rdg-choice locked" data-i="${i}"><span class="rdg-lk">${I(G.lock)}</span>
                    <span class="rdg-cl">${esc(c.text)}</span><span class="rdg-creq">${T('закрыто · ')}${esc(a ? a.name : T('артефакт'))} ${T('ур.')} ${c.need}</span></button>`;
                return `<button class="rdg-choice" data-i="${i}"><span class="rdg-cl">${I(G.arrow)}${esc(c.text)}</span>
                    <span class="rdg-tag art">${esc(a.name)} ${T('ур.')}${a.lvl}</span></button>`;
            }
            if (c.kind === 'hero') {
                const h = heroById(p, c.hero);
                const nm = esc(c.heroName || (h ? h.name : T('спутник')));
                if (heroDown(run, c.hero)) {
                    return `<button class="rdg-choice locked" data-i="${i}" disabled><span class="rdg-lk">${I(G.x)}</span>
                        <span class="rdg-cl">${esc(c.text)}</span><span class="rdg-creq">${nm} ${T('выбыл из захода')}</span></button>`;
                }
                /* Три умения спутника больше не лежат мёртвым текстом в Досье: тут
                   выбирается, ЧЕМ он действует. Цена разная, ульта одна на заход. */
                const sk = (h && h.skills) || [];
                const nmOf = (k, dflt) => esc((sk[k] && sk[k].n) || T(dflt));
                const open = ui.skillFor === i;
                if (!open) {
                    return `<button class="rdg-choice hero" data-i="${i}"><span class="rdg-cl">${I(G.bolt)}${esc(c.text)}</span>
                        <span class="rdg-tag heroT" style="--e:${h ? h.e : '#b8902f'}">${nm}</span></button>`;
                }
                return `<div class="rdg-choice hero open"><span class="rdg-cl">${I(G.bolt)}${esc(c.text)}</span>
                    <span class="rdg-tag heroT" style="--e:${h ? h.e : '#b8902f'}">${nm}</span>
                    <div class="rdg-skrow">
                        <button class="rdg-skb" data-i="${i}" data-sk="base">${I(G.fist)}<span>${nmOf(0, 'БАЗОВЫЙ')}</span></button>
                        <button class="rdg-skb" data-i="${i}" data-sk="use">${I(G.blade)}<span>${nmOf(1, 'УМЕНИЕ')}</span></button>
                        <button class="rdg-skb ult ${run.ultUsed ? 'spent' : ''}" data-i="${i}" data-sk="ult" ${run.ultUsed ? 'disabled' : ''}>${I(G.bolt)}<span>${run.ultUsed ? T('ульта истрачена') : nmOf(2, 'УЛЬТА')}</span></button>
                    </div></div>`;
            }
            return `<button class="rdg-choice" data-i="${i}"><span class="rdg-cl">${I(G.arrow)}${esc(c.text)}</span>
                ${choiceTag(c)}</button>`;
        }).join('');
        body = `<div class="rdg-scene"><div class="rdg-sctop"><div class="rdg-pic">${I(G[sc.icon] || G.door, 1.4)}</div>
            <div class="rdg-sctxt"><div class="rdg-scname">${esc(sc.name)}</div><div class="rdg-scdesc">${esc(sc.desc)}</div></div></div>
            ${run.echo ? `<div class="rdg-echo ${run.echoKind}">${esc(fillMacros(run.echo))}</div>` : ''}</div>
            <div class="rdg-fork">${fork(sc.choices.length)}</div><div class="rdg-choices">${ch}</div>`;
    } else body = '';

    main.innerHTML = `<div class="rdg-view">${viewDecor()}${hdr(d.name, T('ЗАХОД · ') + T(TIER_NAME[d.tier] || ''), `осколки <b>${run.shards}</b> · ${T('крутки')} <b>${run.tickets}</b>`)}
        <div class="rdg-trail">${trail}</div>${press}${nerve}${party}${body}</div>`;

    const flee = document.getElementById('rdg-flee');
    if (flee) flee.onclick = () => { if (run.step > 1) { endRun('flee'); } else { run = null; render(); } };
    const out = document.getElementById('rdg-out'); if (out) out.onclick = () => endRun('done');
    const deep = document.getElementById('rdg-deep'); if (deep) deep.onclick = goDeeper;
    const st = document.getElementById('rdg-steady'); if (st) st.onclick = steadyUp;
    const ac = document.getElementById('rdg-accept'); if (ac) ac.onclick = acceptStumble;
    if (!ui.busy && !run.pendingExit && !run.stumble) {
        main.querySelectorAll('.rdg-choice:not(.locked)[data-i]').forEach(b => b.onclick = () => {
            const i = parseInt(b.dataset.i, 10);
            const c = sc && sc.choices[i];
            // у спутника сперва раскрывается, ЧЕМ он действует, и только потом ход
            if (c && c.kind === 'hero') { ui.skillFor = (ui.skillFor === i ? null : i); render(); return; }
            ui.skillFor = null;
            choose(i);
        });
        main.querySelectorAll('.rdg-skb:not([disabled])').forEach(b => b.onclick = () => {
            ui.skillFor = null;
            choose(parseInt(b.dataset.i, 10), b.dataset.sk);
        });
    }
    main.querySelectorAll('.rdg-choice.locked:not([disabled])').forEach(b => b.onclick = () => toast('info', T('Этот путь откроет прокачанный артефакт.')));
    if (!run.alive) renderOver(main, p);
}

/* The old fork stretched with preserveAspectRatio="none", so every arrowhead was
   squashed sideways into a lopsided tick — worse the wider the panel got. Switching
   to "meet" fixed the shape but broke the position: "meet" preserves the viewBox's
   own aspect ratio, so on a wide panel the whole drawing shrinks to fit the row's
   height and sits centred in a narrow strip — the outer lines never reach the left
   and right choices at all.

   Split in two now: the connecting lines stay in one stretched SVG (a slightly
   skewed curve is not something anyone notices), but each arrowhead is its own
   tiny SVG with its own default aspect ratio, placed by percentage on top. It
   always reaches its choice, and it never loses its shape getting there. */
function fork(n) {
    const cols = n <= 1 ? [50]
        : n === 2 ? [25, 75]
        : n === 3 ? [16, 50, 84]
        : [12, 37, 63, 88];

    let lines = '', heads = '';
    for (let i = 0; i < n; i++) {
        const x = cols[i] ?? 50;
        // A gentle S from the stem out to the column, ending just above the card.
        lines += `<path d="M50 3 C50 16, ${x} 15, ${x} 27" fill="none" stroke="var(--gold-deep)" stroke-width="1.3" stroke-linecap="round" opacity=".75" vector-effect="non-scaling-stroke"/>`;
        heads += `<svg class="rdg-forkhead" style="left:${x}%" viewBox="0 0 10 10"><path d="M1.5 1 L5 5 L8.5 1" fill="none" stroke="var(--gold-deep)" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/></svg>`;
    }
    return `<svg class="rdg-forklines" viewBox="0 0 100 32" preserveAspectRatio="none"><circle cx="50" cy="3" r="2.4" fill="var(--oxblood)"/>${lines}</svg>${heads}`;
}

function renderOver(main, p) {
    const isFail = !!run.failed;
    const o = document.createElement('div');
    o.className = 'rdg-over';
    const items = [];
    if (run.shards) items.push(['gem', `${T('осколки +')}${run.shards}`]);
    if (run.mats) items.push(['thread', `${T('материалы +')}${run.mats}`]);
    o.innerHTML = `${motes(10)}<div class="rdg-big ${isFail ? 'fail' : ''}">${isFail ? T('НОРА НЕ ОТПУСТИЛА') : T('ВЫХОД ИЗ НОРЫ')}</div>
        <div class="rdg-sub">${isFail
            ? `${T('Ты сорвался на')}${run.step - 1}${T('м ходу. Половина добычи осталась в темноте — но нора запомнила тебя, и в следующий раз ты будешь знать больше.')}`
            : `${T('Ты прошёл')} ${run.step - 1} ${T('ходов из')} ${run.dungeon.depth}. ${T('Добыча твоя.')}`}</div>
        ${items.length ? `<div class="rdg-loot">${items.map((it, i) => `<div class="rdg-it" style="animation-delay:${.05 + i * .13}s"><div class="rdg-in">${I(G[it[0]], 1.2)}<div class="rdg-nm">${esc(it[1])}</div></div></div>`).join('')}</div>` : ''}
        ${run.tickets ? `<div class="rdg-reward-tk"><span class="rdg-tic">${I(G.coin)}</span>+${run.tickets} ${run.tickets % 10 === 1 && run.tickets % 100 !== 11 ? T('крутка') : [2, 3, 4].includes(run.tickets % 10) && ![12, 13, 14].includes(run.tickets % 100) ? T('крутки') : T('круток')}</div>` : ''}
        <div class="rdg-obtns"><button class="rdg-obtn gold" id="rdg-again">${T('Новый заход')}</button>
        <button class="rdg-obtn ghost" id="rdg-leave">${T('К норам')}</button></div>`;
    main.appendChild(o);
    if (!isFail) starBurst(o);
    o.querySelector('#rdg-again').onclick = () => { const d = run.dungeon; run = null; startRun(d); };
    o.querySelector('#rdg-leave').onclick = () => { run = null; ui.mode = 'nora'; render(); };
}


/* ============================================================
   ПОРТРЕТЫ — движок из «RPG Map & Locations Engine»
   openai:     POST /images/generations (api.navy, OpenAI, SD-прокси)
   openrouter: POST /images (nano-banana, grok)
   ============================================================ */
function imgCfg() { if (!settings.images) settings.images = { ...IMG_DEF }; return settings.images; }
function aspectFromSize(size) {
    const m = /^(\d+)\s*[x×]\s*(\d+)$/.exec(String(size || '').trim());
    if (!m) return null;
    let w = +m[1], h = +m[2];
    const g = (a, b) => b ? g(b, a % b) : a;
    const d = g(w, h);
    return `${w / d}:${h / d}`;
}
function detectImageMode() {
    const cfg = imgCfg();
    if (cfg.mode === 'openai' || cfg.mode === 'openrouter' || cfg.mode === 'comfy') return cfg.mode;
    const url = String(cfg.apiUrl || '').toLowerCase();
    // у ComfyUI свой порт и своё имя, ни то ни другое облаку не принадлежит
    if (/:8188(\/|$)/.test(url) || url.includes('comfyui')) return 'comfy';
    // свой адрес пуст, а у соседа настроен ComfyUI — рисуем им, ничего не спрашивая
    if (!url && comfyBorrowed()) return 'comfy';
    return url.includes('openrouter') ? 'openrouter' : 'openai';
}
/* Готово ли рисование вообще. Раньше проверка была одна на всё — «есть адрес и
   модель», — а у ComfyUI модель выбирать не обязательно (возьмём первую), и адрес
   может быть подсмотрен у соседа. */
function imgReady() {
    const cfg = imgCfg();
    if (detectImageMode() === 'comfy') return !!comfyBaseUrl();
    return !!(cfg.apiUrl && cfg.model);
}
/* У рисования не было ни таймаута, ни возможности прерваться: зависший запрос
   висел бесконечно и всё это время держал imgBusy. Теперь у него тот же выключатель,
   что и у текста, и собственный предел ожидания. */
let imgAbort = null;
// как cancelledByUser у текста: отмена рукой — это ответ, а не сбой, и повторять её нельзя
let imgCancelled = false;
function imgFetch(url, opts) {
    const ctrl = new AbortController();
    imgAbort = ctrl;
    imgCancelled = false;
    const timer = setTimeout(() => { try { ctrl.abort(); } catch (e) { } }, Number(settings.timeoutSec || 120) * 1000);
    return fetch(url, Object.assign({}, opts, { signal: ctrl.signal }))
        .finally(() => { clearTimeout(timer); if (imgAbort === ctrl) imgAbort = null; });
}

/* ============================================================
   COMFYUI — свой, без Линзы

   Линза рисует сцены с НАСТОЯЩИМИ персонажами, поэтому ей нужны референс со спрайта,
   двое в кадре, лора на каждого. Нора рисует портрет выдуманного спутника по тексту:
   один человек, никакого лица, которое надо повторить. Поэтому здесь не готовые
   воркфлоу-JSON, а граф, собранный кодом из того, что выбрано.

   Главное, что это даёт: нет лоры — нет и узла LoraLoader. Вся история «в воркфлоу
   стоит %lora%, а лора не выбрана», на которой спотыкалась Линза, тут невозможна
   по построению. Свой воркфлоу можно вставить поверх — для него вырезание лоры
   сделано отдельно и честно.

   Адрес: свой, а если пусто — подсмотренный у Линзы. Это не зависимость: нет Линзы,
   extension_settings.character_lens просто undefined, и всё.
   ============================================================ */
const COMFY_DEF = {
    ckpt: '', lora: '', loraStrength: 0.8,
    steps: 26, cfg: 6, sampler: 'euler_ancestral', scheduler: 'normal',
    hires: false,
    negative: 'lowres, worst quality, bad anatomy, bad hands, extra fingers, missing fingers, deformed face, asymmetric eyes, blurry, jpeg artifacts, watermark, signature, text, logo, multiple people, child',
    workflow: ''
};
function comfyCfg() {
    const c = imgCfg();
    if (!c.comfy || typeof c.comfy !== 'object') c.comfy = { ...COMFY_DEF };
    for (const k in COMFY_DEF) if (c.comfy[k] === undefined) c.comfy[k] = COMFY_DEF[k];
    return c.comfy;
}
function comfyBorrowed() {
    try {
        const l = extension_settings.character_lens;
        const u = String(l?.img?.apiUrl || '').trim().replace(/\/+$/, '');
        if (!u) return '';
        if (l.img.mode === 'comfy' || /:8188(\/|$)/.test(u.toLowerCase()) || u.toLowerCase().includes('comfyui')) return u;
    } catch (e) { }
    return '';
}
function comfyBaseUrl() {
    const own = String(imgCfg().apiUrl || '').trim().replace(/\/+$/, '');
    return own || comfyBorrowed();
}
// размер из поля «768x1024»: кратно 8, в разумных пределах — иначе ComfyUI ругается
function comfySize() {
    const m = /^(\d+)\s*[x×]\s*(\d+)$/.exec(String(imgCfg().size || '').trim());
    const fit = n => Math.max(256, Math.min(2048, Math.round(n / 8) * 8));
    return m ? { w: fit(+m[1]), h: fit(+m[2]) } : { w: 768, h: 1024 };
}
function comfyErr(code, msg, extra) { const e = new Error(msg); e.code = code; Object.assign(e, extra || {}); return e; }

/* Граф по шагам. Узлы только из ядра ComfyUI — ничего доставлять не нужно. */
function comfyBuildGraph(v) {
    const c = comfyCfg();
    const g = {};
    g['4'] = { class_type: 'CheckpointLoaderSimple', inputs: { ckpt_name: v.ckpt } };
    let model = ['4', 0], clip = ['4', 1];
    if (c.lora) {
        const st = Number.isFinite(+c.loraStrength) ? Math.max(-2, Math.min(2, +c.loraStrength)) : 0.8;
        g['10'] = { class_type: 'LoraLoader', inputs: { lora_name: c.lora, strength_model: st, strength_clip: st, model, clip } };
        model = ['10', 0]; clip = ['10', 1];
    }
    g['6'] = { class_type: 'CLIPTextEncode', inputs: { text: v.prompt, clip } };
    g['7'] = { class_type: 'CLIPTextEncode', inputs: { text: v.negative, clip } };
    g['5'] = { class_type: 'EmptyLatentImage', inputs: { width: v.w, height: v.h, batch_size: 1 } };
    const steps = Math.max(1, Math.min(150, Math.round(+c.steps) || 26));
    const cfgv = Math.max(1, Math.min(30, +c.cfg || 6));
    const ks = (latent, denoise, nSteps) => ({
        class_type: 'KSampler',
        inputs: {
            seed: v.seed, steps: nSteps, cfg: cfgv, sampler_name: c.sampler || 'euler_ancestral',
            scheduler: c.scheduler || 'normal', denoise, model, positive: ['6', 0], negative: ['7', 0], latent_image: latent
        }
    });
    g['3'] = ks(['5', 0], 1, steps);
    let last = ['3', 0];
    /* Второй проход: увеличить картинку в латенте и пройтись ещё раз слабым шумом.
       Лицо и глаза при этом прорисовываются заметно лучше — это ровно та беда, ради
       которой в Линзе появлялся FaceDetailer. Только здесь без сторонних узлов. */
    if (c.hires) {
        g['11'] = { class_type: 'LatentUpscaleBy', inputs: { upscale_method: 'nearest-exact', scale_by: 1.5, samples: last } };
        g['12'] = ks(['11', 0], 0.45, Math.max(8, Math.round(steps * 0.6)));
        last = ['12', 0];
    }
    g['8'] = { class_type: 'VAEDecode', inputs: { samples: last, vae: ['4', 2] } };
    g['9'] = { class_type: 'SaveImage', inputs: { filename_prefix: 'rpg_dungeons', images: ['8', 0] } };
    return g;
}

/* Свой воркфлоу (формат API). Подстановка идёт по РАЗОБРАННОМУ графу, а не по тексту:
   кавычка или перевод строки в промпте не ломают JSON. Плейсхолдер, стоящий целиком
   в числовом поле, становится числом. */
const COMFY_PH = ['%prompt%', '%negative%', '%seed%', '%width%', '%height%', '%ckpt%', '%lora%', '%lora_strength%'];
function comfyFillCustom(text, v) {
    let g;
    try { g = JSON.parse(text); } catch (e) { throw comfyErr('comfy-badjson', 'bad json'); }
    if (!g || typeof g !== 'object' || Array.isArray(g)) throw comfyErr('comfy-badjson', 'bad json');
    if (!JSON.stringify(g).includes('%prompt%')) throw comfyErr('comfy-noprompt', 'no %prompt%');
    const c = comfyCfg();
    const map = {
        '%prompt%': v.prompt, '%negative%': v.negative, '%seed%': v.seed, '%width%': v.w, '%height%': v.h,
        '%ckpt%': v.ckpt, '%lora%': c.lora, '%lora_strength%': +c.loraStrength || 0.8
    };
    // лора не выбрана, а в воркфлоу её узел — вырезаем и переподключаем соседей напрямую
    if (!c.lora) {
        for (const [id, n] of Object.entries(g)) {
            if (!n || n.class_type !== 'LoraLoader' || n.inputs?.lora_name !== '%lora%') continue;
            const src = [n.inputs.model, n.inputs.clip];
            for (const m of Object.values(g)) {
                for (const [k, val] of Object.entries(m?.inputs || {})) {
                    if (Array.isArray(val) && String(val[0]) === id) m.inputs[k] = src[val[1]] ?? val;
                }
            }
            delete g[id];
        }
    }
    const sub = (val) => {
        if (typeof val !== 'string') return val;
        if (COMFY_PH.includes(val)) return map[val];               // целиком — со своим типом
        let s = val;
        for (const p of COMFY_PH) if (s.includes(p)) s = s.split(p).join(String(map[p] ?? ''));
        return s;
    };
    for (const n of Object.values(g)) {
        if (!n || !n.inputs) continue;
        for (const k of Object.keys(n.inputs)) n.inputs[k] = sub(n.inputs[k]);
    }
    return g;
}

/* Списки моделей, лор и сэмплеров — у самого ComfyUI, по узлу за раз (это дешевле
   полного /object_info). Держим в памяти, кнопка «Проверить» перечитывает. */
let comfyInfoCache = null;
async function comfyInfo(force) {
    if (comfyInfoCache && !force) return comfyInfoCache;
    const base = comfyBaseUrl();
    if (!base) throw comfyErr('comfy-noaddr', 'no address');
    const pick = async (node, field) => {
        try {
            const r = await fetch(`${base}/object_info/${node}`);
            if (!r.ok) return [];
            const j = await r.json();
            const opt = j?.[node]?.input?.required?.[field];
            return Array.isArray(opt?.[0]) ? opt[0].map(String) : [];
        } catch (e) { if (e instanceof TypeError) throw comfyErr('comfy-net', 'unreachable', { base }); return []; }
    };
    const [ckpts, loras, samplers, schedulers] = await Promise.all([
        pick('CheckpointLoaderSimple', 'ckpt_name'), pick('LoraLoader', 'lora_name'),
        pick('KSampler', 'sampler_name'), pick('KSampler', 'scheduler')
    ]);
    comfyInfoCache = { ckpts, loras, samplers, schedulers, base, at: Date.now() };
    return comfyInfoCache;
}
// PNG в dataURL без FileReader — так одинаково работает и в браузере, и в тестах
async function blobToDataUrl(blob) {
    const bytes = new Uint8Array(await blob.arrayBuffer());
    let bin = '';
    for (let i = 0; i < bytes.length; i += 0x8000) bin += String.fromCharCode.apply(null, bytes.subarray(i, i + 0x8000));
    return `data:${blob.type || 'image/png'};base64,${btoa(bin)}`;
}

async function callComfy(prompt) {
    const base = comfyBaseUrl();
    if (!base) throw comfyErr('comfy-noaddr', 'no address');
    const c = comfyCfg();
    const { w, h } = comfySize();
    const seed = Math.floor(Math.random() * 2 ** 32);
    /* Одна отмена на всю работу: и на отправку, и на ожидание, и на скачивание.
       «Остановить» дёргает imgAbort — как у облачного пути. */
    const ctrl = new AbortController();
    imgAbort = ctrl; imgCancelled = false;
    const sig = ctrl.signal;
    let promptId = null;
    const giveUp = async () => {
        // снимаем свою задачу и с очереди, и с исполнения — иначе ComfyUI дорисует её впустую
        try { if (promptId) await fetch(`${base}/queue`, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ delete: [promptId] }) }); } catch (e) { }
        try { await fetch(`${base}/interrupt`, { method: 'POST' }); } catch (e) { }
    };
    try {
        let ckpt = c.ckpt;
        if (!c.workflow.trim() && !ckpt) {
            const info = await comfyInfo();
            ckpt = info.ckpts[0] || '';
            if (!ckpt) throw comfyErr('comfy-nockpt', 'no checkpoints');
        }
        const v = { prompt, negative: c.negative || '', seed, w, h, ckpt };
        const graph = c.workflow.trim() ? comfyFillCustom(c.workflow, v) : comfyBuildGraph(v);

        let r;
        try {
            r = await fetch(`${base}/prompt`, {
                method: 'POST', signal: sig, headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ prompt: graph, client_id: 'rpg_dungeons' })
            });
        } catch (e) {
            if (e.name === 'AbortError') throw e;
            throw comfyErr('comfy-net', 'unreachable', { base });
        }
        if (!r.ok) {
            // ComfyUI говорит, какой узел и чем недоволен — это и надо показать
            let j = null; try { j = await r.json(); } catch (e) { }
            const ne = j?.node_errors && Object.values(j.node_errors)[0];
            const first = ne?.errors?.[0];
            const msg = first ? `${ne.class_type || ''}: ${first.message}${first.details ? ' — ' + first.details : ''}` : (j?.error?.message || `HTTP ${r.status}`);
            throw comfyErr('comfy-node', msg.slice(0, 220), { status: r.status });
        }
        promptId = (await r.json())?.prompt_id;
        if (!promptId) throw comfyErr('comfy-node', 'no prompt_id', { status: 500 });

        /* Ждём. Локальной генерации нужно больше, чем облачной: первая загрузка
           чекпойнта сама по себе занимает полминуты. Нижняя граница 5 минут, и при этом
           задача видна в очереди ComfyUI, а «Остановить» работает в любой момент. */
        const limit = Math.max(Number(settings.timeoutSec || 120), 300) * 1000;
        const t0 = Date.now();
        let entry = null;
        while (Date.now() - t0 < limit) {
            await new Promise((res, rej) => {
                const t = setTimeout(res, 1000);
                sig.addEventListener('abort', () => { clearTimeout(t); rej(Object.assign(new Error('aborted'), { name: 'AbortError' })); }, { once: true });
            });
            let hr;
            try { hr = await fetch(`${base}/history/${encodeURIComponent(promptId)}`, { signal: sig }); }
            catch (e) { if (e.name === 'AbortError') throw e; continue; }   // мигнула сеть — спросим ещё раз
            if (!hr.ok) continue;
            const hj = await hr.json();
            entry = hj?.[promptId];
            if (!entry) continue;
            const st = entry.status;
            if (st?.status_str === 'error') {
                const m = (st.messages || []).find(x => x?.[0] === 'execution_error')?.[1];
                throw comfyErr('comfy-exec', `${m?.node_type || ''}: ${m?.exception_message || 'execution error'}`.trim().slice(0, 220), { status: 400 });
            }
            if (st?.completed || Object.keys(entry.outputs || {}).length) break;
        }
        if (!entry || !Object.keys(entry.outputs || {}).length) {
            await giveUp();
            throw comfyErr('comfy-timeout', 'timeout', { secs: Math.round(limit / 1000), status: 400 });
        }
        const outs = entry.outputs;
        const img = (outs['9']?.images || []).concat(...Object.values(outs).map(o => o?.images || []))[0];
        if (!img) throw comfyErr('comfy-exec', T('в ответе нет картинки'), { status: 400 });
        const q = new URLSearchParams({ filename: img.filename, subfolder: img.subfolder || '', type: img.type || 'output' });
        const vr = await fetch(`${base}/view?${q}`, { signal: sig });
        if (!vr.ok) throw comfyErr('comfy-exec', `view HTTP ${vr.status}`, { status: vr.status });
        return await blobToDataUrl(await vr.blob());
    } catch (e) {
        if (e.name === 'AbortError') await giveUp();
        throw e;
    } finally {
        if (imgAbort === ctrl) imgAbort = null;
    }
}

async function callImageAI(prompt) {
    if (detectImageMode() === 'comfy') return callComfy(prompt);
    const cfg = imgCfg();
    if (!cfg.apiUrl || !cfg.model) throw new Error('no-img-cfg');
    const base = cfg.apiUrl.replace(/\/$/, '');
    const mode = detectImageMode();
    if (mode === 'openrouter') {
        const body = { model: cfg.model, prompt, n: 1 };
        const ar = aspectFromSize(cfg.size);
        if (ar) body.aspect_ratio = ar;
        const resp = await imgFetch(base + '/images', {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${(cfg.apiKey || '').trim()}`, 'Content-Type': 'application/json',
                'HTTP-Referer': (typeof location !== 'undefined' ? location.origin : 'https://sillytavern.app'),
                'X-Title': 'SillyTavern RPG Dungeons'
            },
            body: JSON.stringify(body)
        });
        if (!resp.ok) {
            let d = ''; try { d = (await resp.json())?.error?.message || ''; } catch (e) { }
            const err = new Error(`Image API ${resp.status} ${d}`.trim());
            err.status = resp.status;                 // нужен, чтобы отличить «провайдер икнул» от «запрос неверный»
            throw err;
        }
        const data = await resp.json();
        const item = data?.data?.[0] || {};
        if (item.b64_json) return `data:${item.media_type || 'image/png'};base64,${item.b64_json}`;
        if (item.url) return item.url;
        throw new Error(T('пустой ответ'));
    }
    const doPost = withSize => imgFetch(base + '/images/generations', {
        method: 'POST',
        headers: { 'Authorization': `Bearer ${(cfg.apiKey || '').trim()}`, 'Content-Type': 'application/json' },
        body: JSON.stringify(withSize && cfg.size ? { model: cfg.model, prompt, n: 1, size: cfg.size } : { model: cfg.model, prompt, n: 1 })
    });
    let resp = await doPost(true);
    if (!resp.ok && (resp.status === 400 || resp.status === 422)) {
        let txt = ''; try { txt = JSON.stringify(await resp.clone().json()); } catch (e) { }
        if (/size|dimension|resolution/i.test(txt)) resp = await doPost(false);   // часть прокси не любит нестандартный размер
    }
    if (!resp.ok) {
        let d = '';
        try { const j = await resp.json(); d = j?.error?.message || j?.message || JSON.stringify(j).slice(0, 160); }
        catch (e) { try { d = (await resp.text()).slice(0, 160); } catch (_) { } }
        const err = new Error(`Image API ${resp.status} ${d}`.trim());
        err.status = resp.status;
        throw err;
    }
    const data = await resp.json();
    const item = (Array.isArray(data?.data) && data.data[0]) || (Array.isArray(data?.images) && data.images[0]) ||
        (Array.isArray(data?.output) && data.output[0]) || {};
    const b64 = item.b64_json || item.b64 || (typeof item === 'string' && item.startsWith('data:') ? item : null);
    const url = item.url || (item.image_url && (item.image_url.url || item.image_url)) || data.url ||
        (typeof item === 'string' && /^https?:\/\//.test(item) ? item : null);
    if (b64) return String(b64).startsWith('data:') ? b64 : 'data:image/png;base64,' + b64;
    if (url) return url;
    throw new Error(T('в ответе нет картинки'));
}
function fillTpl(tpl, map) { return String(tpl || '').replace(/\{(\w+)\}/g, (m, k) => map[k] !== undefined ? map[k] : m); }

/* BUG FIX (4.6.1). Текстовые запросы получили повторы с паузами ещё в 4.3, а запросы
   на картинку — нет: одна-единственная попытка, и провайдерская «500 An unexpected
   provider error» роняла портрет насмерть. Жать «перерисовать» было почти бесполезно —
   каждое нажатие делало ровно один новый запрос в тот же неудачный момент, без паузы,
   на которой у провайдера обычно всё и проходит. Отсюда «кликаю, и никак».

   Теперь тот же isTransient и те же паузы, что у текста. Не повторяем то, что от
   повтора не исправится: отмену, неверный ключ, неверный запрос, несуществующую
   модель — на них повтор только жжёт деньги и время. */
async function drawWithRetry(prompt, onRetry) {
    const tries = Math.max(1, (Number.isFinite(Number(settings.retries)) ? Number(settings.retries) : 2) + 1);
    let lastErr = null;
    for (let attempt = 0; attempt < tries; attempt++) {
        try {
            return await callImageAI(prompt);
        } catch (e) {
            lastErr = e;
            if (imgCancelled) { const c = new Error('cancelled'); c.name = 'AbortError'; throw c; }
            const permanent = e.name === 'AbortError' || e.message === 'no-img-cfg'
                || String(e.code || '').startsWith('comfy-')       // ComfyUI отвечает по существу — повтор не поможет
                || (e.status !== undefined && !isTransient(e.status));
            if (permanent || attempt === tries - 1) break;
            tokenUse.retried++;
            const wait = [1500, 4000, 10000][Math.min(attempt, 2)];
            if (typeof onRetry === 'function') onRetry(attempt + 1, tries - 1, wait);
            console.warn(`[Dungeons] картинка: попытка ${attempt + 1}/${tries} не удалась (${e.message}) — повтор через ${wait}ms`);
            await sleep(wait);
        }
    }
    throw lastErr || new Error('failed');
}
/* Человеческий текст вместо голого исключения: по нему должно быть понятно,
   что делать дальше, а не только что всё плохо. */
function drawErrText(e) {
    if (!e) return T('ИИ не ответил.');
    switch (e.code) {
        case 'comfy-noaddr': return T('Впиши адрес ComfyUI в «URL API картинок», например http://127.0.0.1:8188');
        case 'comfy-net': return `${T('Не достучалась до ComfyUI по адресу')} ${e.base || ''}. ${T('Он запущен? Нужен флаг --enable-cors-header, иначе браузер его не пустит.')}`;
        case 'comfy-nockpt': return T('В ComfyUI не нашлось ни одной модели — положи чекпойнт в models/checkpoints.');
        case 'comfy-node': return `${T('ComfyUI отказался:')} ${e.message}`;
        case 'comfy-exec': return `${T('ComfyUI упал во время рисования:')} ${e.message}`;
        case 'comfy-timeout': return `${T('ComfyUI не закончил за')} ${e.secs} ${T('с. Задачу сняла с очереди.')}`;
        case 'comfy-badjson': return T('Свой воркфлоу — не JSON. В ComfyUI нужно «Save (API Format)».');
        case 'comfy-noprompt': return T('В своём воркфлоу нет %prompt% — каждая картинка вышла бы одинаковой.');
    }
    if (e.message === 'no-img-cfg') return T('Заполни URL и модель в настройках портретов.');
    if (e.name === 'AbortError') return `${T('Не дождались картинки за')} ${Number(settings.timeoutSec || 120)} ${T('с. Картинки рисуются дольше текста — подними «Ожидание ответа» в настройках.')}`;
    const st = e.status;
    if (st === 401 || st === 403) return T('Ключ не подошёл — проверь API-ключ для портретов.');
    if (st === 404) return T('Провайдер не знает такой модели — проверь название модели.');
    if (st === 429) return T('Провайдер ограничил частоту запросов. Подожди минуту и повтори.');
    if (st >= 500) return `${T('Провайдер отвечает ошибкой')} ${st}. ${T('Повторяли несколько раз — не помогло. Это на его стороне, попробуй позже или смени модель.')}`;
    return T('Не вышло нарисовать: ') + (e.message || '');
}
async function genHeroArt(id, quiet) {
    const p = profile(), h = heroById(p, id), cfg = imgCfg();
    if (!p || !h) return;
    if (!cfg.enabled) { if (!quiet) toast('info', T('Включи портреты в настройках расширения.')); return; }
    /* Раньше тут был молчаливый return: если рисование уже шло (или флаг «занят»
       где-то залип), нажатие не делало ВООБЩЕ ничего — ни тоста, ни движения.
       Со стороны это выглядит как сломанная кнопка. Теперь говорим, что происходит. */
    if (h.imgBusy) {
        if (!quiet) toast('info', `${esc(h.name)}: ${T('портрет уже рисуется. Если это зависло — нажми «Остановить» на чёрной полоске.')}`);
        return;
    }
    h.imgBusy = true; delete h.imgErr; render();
    try {
        const prompt = fillTpl(cfg.heroTpl, {
            NAME: h.name, LOOK: canonLine(h, 'en') || h.look || 'mysterious figure', ROLE: h.role || '',
            SUIT: EN[h.suit] || h.suit || '', STYLE: cfg.style, SIZE: cfg.size
        });
        h.img = await drawWithRetry(prompt, quiet ? null : (n, of) => toast('info', `${esc(h.name)}: ${T('провайдер икнул — повтор')} ${n}/${of}…`));
        h.stale = false;
        h.imgBusy = false;
        delete h.imgErr;
        saveSettings(true);
        if (!quiet) toast('success', T('Портрет готов.'));
    } catch (e) {
        h.imgBusy = false;
        if (e && e.name === 'AbortError' && imgCancelled) { render(); return; }
        // запоминаем отказ на самом герое: иначе в Досье просто пустая рамка и гадание
        h.imgErr = String(drawErrText(e)).slice(0, 160);
        console.error('[Dungeons] портрет', e);
        if (!quiet) toast('warning', `${esc(h.name)}: ${drawErrText(e)}`);
    }
    render();
}
async function genArtArt(id, quiet) {
    const p = profile(), a = artById(p, id), cfg = imgCfg();
    if (!p || !a) return;
    if (!cfg.enabled) { if (!quiet) toast('info', T('Включи портреты в настройках расширения.')); return; }
    if (a.imgBusy) {
        if (!quiet) toast('info', `${esc(a.name)}: ${T('картинка уже рисуется. Если это зависло — нажми «Остановить» на чёрной полоске.')}`);
        return;
    }
    a.imgBusy = true; delete a.imgErr; render();
    try {
        a.img = await drawWithRetry(fillTpl(cfg.artTpl, { NAME: a.name, DESC: a.desc || '', STYLE: cfg.style, SIZE: cfg.size }),
            quiet ? null : (n, of) => toast('info', `${esc(a.name)}: ${T('провайдер икнул — повтор')} ${n}/${of}…`));
        a.imgBusy = false; delete a.imgErr; saveSettings(true); if (!quiet) toast('success', T('Карточка реликвии готова.'));
    } catch (e) {
        a.imgBusy = false;
        if (e && e.name === 'AbortError' && imgCancelled) { render(); return; }
        a.imgErr = String(drawErrText(e)).slice(0, 160);
        console.error('[Dungeons] реликвия', e);
        if (!quiet) toast('warning', `${esc(a.name)}: ${drawErrText(e)}`);
    }
    render();
}
let drawQueue = null;
let drawCancel = false;   // выставляется кнопкой «Остановить»: очередь завершится после текущей картинки
async function afterForge() {
    const p0 = profile();
    if (!p0) return;
    if (settings.autoArtHeroes !== false || settings.autoArtRelics !== false) await autoDrawAll();
    if (settings.autoCards) {
        for (const h of p0.heroes) { if (profile() !== p0) break; if (!h.cardFull) await genFullCard(h.id); }
    }
    if (settings.autoLore) {
        for (const h of p0.heroes) { if (profile() !== p0) break; await addToLorebook(h.id); }
    }
}
async function autoDrawAll() {
    const cfg = imgCfg();
    if (!cfg.enabled || !imgReady()) return;   // выключено или не настроено — молча пропускаем
    if (drawQueue) return;
    const p = profile();
    if (!p) return;
    const myKey = profileKey();
    const jobs = [
        ...(settings.autoArtHeroes !== false ? p.heroes.filter(h => !h.img).map(h => ({ kind: 'h', id: h.id })) : []),
        ...(settings.autoArtRelics !== false ? p.artifacts.filter(a => !a.img).map(a => ({ kind: 'a', id: a.id })) : [])
    ];
    if (!jobs.length) return;
    drawQueue = { done: 0, total: jobs.length };
    drawCancel = false;
    render();
    let stopped = false, failed = 0;
    for (const j of jobs) {
        if (profileKey() !== myKey) break;                   // сменили чат — бросаем очередь
        if (drawCancel) { stopped = true; break; }           // нажали «Остановить»
        try { await (j.kind === 'h' ? genHeroArt(j.id, true) : genArtArt(j.id, true)); }
        catch (e) { console.warn('[Dungeons] рисование', e); }
        /* BUG FIX (4.6.1): очередь считала КАЖДУЮ задачу удачной и рапортовала
           «Нарисовано: 6», даже когда половина отвалилась по ошибке провайдера.
           Рисуют тихо (quiet), так что об отказах не узнать было вообще никак —
           просто оставались пустые рамки. Теперь считаем по факту. */
        const o = j.kind === 'h' ? heroById(profile(), j.id) : artById(profile(), j.id);
        if (o && !o.img) failed++;
        drawQueue.done++;
        render();
    }
    const n = Math.max(0, drawQueue.done - failed);
    drawQueue = null;
    drawCancel = false;
    render();
    if (stopped) toast('info', `${T('Рисование остановлено. Готово:')} ${n}.`);
    else if (failed) toast('warning', `${T('Нарисовано:')} ${n}. ${T('Не получилось:')} ${failed} — ${T('причина написана в досье у каждого; повтори их по одному.')}`);
    else if (n) toast('success', `${T('Нарисовано:')} ${n}.`);
}
function pickImageFile(onDone) {
    const inp = document.createElement('input');
    inp.type = 'file'; inp.accept = 'image/*';
    inp.onchange = () => {
        const f = inp.files && inp.files[0];
        if (!f) return;
        if (f.size > 3.5 * 1024 * 1024) { toast('warning', T('Картинка тяжелее 3.5 МБ — возьми поменьше.')); return; }
        const r = new FileReader();
        r.onload = () => { onDone(String(r.result)); };
        r.readAsDataURL(f);
    };
    inp.click();
}
// портрет там, где раньше была безликая иконка
function portrait(obj, cls) {
    if (obj && obj.img) return `<img class="rdg-pimg ${cls || ''}" src="${esc(obj.img)}" alt="">`;
    return '';
}

/* ============================================================
   ПРИЗЫВ — banner + reveal, дизайн из макета gacha
   ============================================================ */
function featInner(h, showName) {
    return `<div class="rdg-fin">${h.img ? portrait(h, 'fit') : I(G.person, 1).replace('<svg', '<svg class="rdg-fpor"')}<div class="rdg-fshine"></div></div>
        ${filiCorners()}<div class="rdg-fcrest">${I(G.seal, 0)}</div>
        <div class="rdg-fplate">${showName ? `<div class="rdg-fnm">${esc(h.name)}</div>` : ''}<div class="rdg-fstars">${'★'.repeat(h.rar || 4)}</div></div>`;
}
function sky(n) {
    let h = '';
    for (let i = 0; i < n; i++) h += `<i style="left:${(Math.random() * 100).toFixed(1)}%;top:${(Math.random() * 100).toFixed(1)}%;animation-delay:${(Math.random() * 6).toFixed(2)}s"></i>`;
    return `<div class="rdg-sky">${h}</div>`;
}
function gachaStatus(p) {
    if (drawQueue) return `<div class="rdg-gstat busy"><span class="rdg-gsp">${I(G.spin)}</span>
        ${T('ИИ РИСУЕТ КАРТИНКИ ·')} ${drawQueue.done + 1} ${T('ИЗ')} ${drawQueue.total}
        <span class="rdg-gsub">${T('портреты спутников и карточки реликвий · можно не ждать')}</span></div>`;
    const stubs = p.heroes.filter(h => h.stub).length;
    if (!stubs) return `<div class="rdg-note">${T('ПОРТРЕТЫ, БАННЕР И ЛОР ПЕРСОНАЖЕЙ ГЕНЕРИРУЕТ ИИ ПО КАРТЕ ПЕРСОНАЖА')}</div>`;
    if (heroForgeState === 'busy' || ui.busy)
        return `<div class="rdg-gstat busy"><span class="rdg-gsp">${I(G.spin)}</span>
            ${T('ИИ ПРИДУМЫВАЕТ СПУТНИКОВ')}<span class="rdg-dots"><i>.</i><i>.</i><i>.</i></span>
            <span class="rdg-gsub">${T('обычно 10–40 секунд · крутить можно уже сейчас')}</span></div>`;
    if (heroForgeState === 'nokey')
        return `<div class="rdg-gstat bad">${T('НЕ УКАЗАН API-КЛЮЧ — СПУТНИКИ БЕЗ ИМЁН')}
            <span class="rdg-gsub">${T('настройки расширения → «🐇 Кроличья нора» → ключ, потом повтори')}</span>
            <button class="rdg-gretry" id="rdg-retry">${I(G.spin)} ${T('Повторить')}</button></div>`;
    if (heroForgeState === 'fail')
        return `<div class="rdg-gstat bad">${T('ИИ НЕ ОТВЕТИЛ — СПУТНИКИ ОСТАЛИСЬ БЕЗ ИМЁН')}
            <span class="rdg-gsub">${T('крутки и бой работают, имена можно доковать в любой момент')}</span>
            <button class="rdg-gretry" id="rdg-retry">${I(G.spin)} ${T('Повторить')}</button></div>`;
    return `<div class="rdg-gstat"><span>${T('СПУТНИКИ ЕЩЁ БЕЗ ИМЁН')}</span>
        <button class="rdg-gretry" id="rdg-retry">${I(G.spin)} ${T('Оживить спутников')}</button></div>`;
}
function renderGacha(main, p) {
    seedHeroes(p);
    autoForgeHeroes(p);
    if (!p.heroes || !p.heroes.length) {
        main.innerHTML = `${sky(40)}<div class="rdg-view rdg-gv">${hdr(T('ПРИЗЫВ'), T('ЗАЛ ЕЩЁ ПУСТ'))}
            <div class="rdg-mod"><div class="rdg-mic">${I(G.gacha, 1.5)}</div>
            <div class="rdg-mt">${T('СПУТНИКИ НЕ ВЫКОВАНЫ')}</div>
            <div class="rdg-md">${T('ИИ прочитает карточку и придумает шесть спутников — хранителей твоих артефактов. Они будут выпадать из круток.')}</div>
            ${ui.busy ? loader(T('Кузница кует спутников…')) : `<button class="rdg-forge" id="rdg-do-heroes">${T('✦ Выковать спутников')}</button>`}</div></div>`;
        const b = document.getElementById('rdg-do-heroes');
        if (b) b.onclick = forgeHeroes;
        return;
    }
    if (ui.gview === 'reveal' && ui.gres) { renderReveal(main, p); return; }
    const fives = p.heroes.filter(h => h.rar === 5), fours = p.heroes.filter(h => h.rar !== 5);
    const center = fives[0] || p.heroes[0];
    const left = fours[0] || fives[1] || p.heroes[1] || center;
    const right = fours[1] || fours[0] || p.heroes[2] || center;
    main.innerHTML = `${sky(40)}<div class="rdg-view rdg-gv">
      <div class="rdg-topbar">
        <div class="rdg-cur spin"><span class="rdg-cic">${I(G.spin)}</span>${p.tickets}</div>
        <div class="rdg-cur gem"><span class="rdg-cic">${I(G.gem)}</span>${p.shards}</div>
        <div class="rdg-cur coin"><span class="rdg-cic">${I(G.thread)}</span>${p.mats}</div>
      </div>
      <div class="rdg-banner"><div class="rdg-banner-in">
        <div class="rdg-brays"></div><div class="rdg-halo"></div>
        <div class="rdg-ring">${DECOR.rune()}</div>
        <div class="rdg-fcorner tl">${DECOR.fili()}</div><div class="rdg-fcorner tr">${DECOR.fili()}</div>
        <div class="rdg-fcorner bl">${DECOR.fili()}</div><div class="rdg-fcorner br">${DECOR.fili()}</div>
        <div class="rdg-nameplate"><div class="rdg-np-name">${esc(center.name)}</div><div class="rdg-np-stars">${'★'.repeat(center.rar || 5)}</div></div>
      </div>
      <div class="rdg-gchar">
        <div class="rdg-featcard side left">${featInner(left, true)}</div>
        <div class="rdg-featcard side right">${featInner(right, true)}</div>
        <div class="rdg-featcard center">${featInner(center, false)}</div>
        <span class="rdg-spk" style="left:15%;top:26%;width:15px;height:15px">${I(G.star, 0)}</span>
        <span class="rdg-spk" style="right:13%;top:30%;width:12px;height:12px">${I(G.star, 0)}</span>
        <span class="rdg-spk" style="right:24%;top:64%;width:10px;height:10px">${I(G.star, 0)}</span>
        <span class="rdg-spk" style="left:22%;top:60%;width:9px;height:9px">${I(G.star, 0)}</span>
        <div class="rdg-toptag">${I(G.star, 0)} ${esc(T(center.suit || ''))} · ${T('ЛИМИТ-БАННЕР')}</div>
      </div></div>
      <div class="rdg-pity"><span>${T('До гаранта 5★:')} <b>${Math.max(1, 40 - (p.pity5 || 0))}</b></span><span>${T('Гарант 4★ через:')} <b>${Math.max(0, 8 - (p.pity4 || 0))}</b></span></div>
      <div class="rdg-prow">
        <button class="rdg-pbtn" id="rdg-p1"><div class="rdg-pin2"><span class="rdg-med">${I(G.star, 0)}</span>
          <span class="rdg-ptxt"><span class="rdg-t1">${T('Крутка ×1')}</span><span class="rdg-t2">${I(G.spin)} ${T('1 крутка')}</span></span></div><span class="rdg-sheen"></span></button>
        <button class="rdg-pbtn x10" id="rdg-p10"><span class="rdg-pbadge">${T('ГАРАНТ 4★+')}</span><div class="rdg-pin2"><span class="rdg-med">${I(G.seal, 0)}</span>
          <span class="rdg-ptxt"><span class="rdg-t1">${T('Крутка ×10')}</span><span class="rdg-t2">${I(G.spin)} ${T('10 круток')}</span></span></div><span class="rdg-sheen"></span></button>
      </div>
      ${gachaStatus(p)}</div>`;
    const rt = document.getElementById('rdg-retry');
    // единственный путь обратно в автоковку после неудачи — отсюда
    if (rt) rt.onclick = () => retryForgeHeroes();
    document.getElementById('rdg-p1').onclick = () => doPull(1);
    document.getElementById('rdg-p10').onclick = () => doPull(10);
}
function ccCorners() {
    return `<span class="rdg-cc tl">${DECOR.fili()}</span><span class="rdg-cc tr">${DECOR.fili()}</span><span class="rdg-cc bl">${DECOR.fili()}</span><span class="rdg-cc br">${DECOR.fili()}</span>`;
}
function gcardHTML(x, i, many) {
    const por = x.hero ? G.person : (x.kind === 'shards' ? G.gem : G.thread);
    const tilt = many ? ((i % 5) - 2) * 2.2 : 0;
    const rc = x.r === 5 ? '#e8c667' : x.r === 4 ? '#b0803f' : '#c9b587';
    return `<div class="rdg-gcard r${x.r}" data-i="${i}" style="--d:${(i * 0.05).toFixed(2)}s;--tl:${tilt}deg">
      <div class="rdg-grays" style="color:${rc}"></div>
      <div class="rdg-card3d">
        <div class="rdg-cside rdg-cback"><div class="rdg-rune">${DECOR.rune()}</div>${ccCorners()}<div class="rdg-medal">${I(G.seal, 0)}</div></div>
        <div class="rdg-cside rdg-cfront">
          ${x.isNew ? '<span class="rdg-newb">NEW</span>' : ''}${x.dupe ? '<span class="rdg-newb dup">' + T('＋ЗВЕЗДА') + '</span>' : ''}
          <div class="rdg-crestS">${I(G.seal, 0)}</div>
          <div class="rdg-cart">${x.img ? portrait({ img: x.img }, 'fit') : I(por, 1.2).replace('<svg', '<svg class="rdg-cpor"')}${ccCorners()}<span class="rdg-csheen"></span></div>
          <div class="rdg-cplate"><div class="rdg-cnm">${esc(x.nm)}</div><div class="rdg-crl">${esc(x.rl || '')}${x.kind ? ` ×${x.n}` : ''}</div><div class="rdg-cst">${'★'.repeat(x.r)}</div></div>
        </div></div></div>`;
}
function renderReveal(main, p) {
    const many = ui.gres.length > 1;
    main.innerHTML = `${sky(40)}<div class="rdg-view rdg-gv"><div class="rdg-reveal">
        <div class="rdg-rtop">${T('✦ РЕЗУЛЬТАТ ПРИЗЫВА ✦')}</div>
        <div class="rdg-cards ${many ? '' : 'one'}" id="rdg-cards">${ui.gres.map((x, i) => gcardHTML(x, i, many)).join('')}</div>
        <div class="rdg-rhint" id="rdg-rhint">${T('нажми на карту · или')} <b id="rdg-flipall">${T('ОТКРЫТЬ ВСЁ ✦')}</b></div>
        <div class="rdg-ractions" id="rdg-racts" style="visibility:hidden">
            <button class="rdg-obtn gold" id="rdg-gagain">${T('Крутить ещё')}</button>
            <button class="rdg-obtn ghost" id="rdg-ghome">${T('К баннеру')}</button>
        </div></div></div>`;
    main.querySelectorAll('.rdg-gcard').forEach(el => el.addEventListener('click', () => flipGcard(el)));
    const flipall = document.getElementById('rdg-flipall');
    if (flipall) flipall.onclick = () => document.querySelectorAll('.rdg-gcard:not(.flip)').forEach((el, k) => setTimeout(() => flipGcard(el), k * 140));
    const again = document.getElementById('rdg-gagain'), home = document.getElementById('rdg-ghome');
    if (again) again.onclick = () => doPull(ui.gres.length);
    if (home) home.onclick = () => { ui.gview = 'banner'; ui.gres = null; render(); };
}
function flipGcard(el) {
    if (!ui.gres || el.classList.contains('flip')) return;
    el.classList.add('flip');
    const x = ui.gres[+el.dataset.i];
    if (x.r === 5) Sound.rare(); else Sound.reveal();
    setTimeout(() => {
        gcardBurst(el, x.r);
        if (x.r >= 4) sparkle(el, x.r === 5 ? 14 : 8, x.r === 5 ? '#e8c667' : '#b0803f');
        if (x.r === 5) { flashScreen(); queueSplash(x); }
    }, 250);
    ui.gflip++;
    if (ui.gflip >= ui.gres.length) setTimeout(() => {
        const a = document.getElementById('rdg-racts'); if (a) a.style.visibility = 'visible';
        const h = document.getElementById('rdg-rhint'); if (h) h.style.visibility = 'hidden';
    }, 500);
}
function gcardBurst(el, r) {
    if (r === 5) { const ry = el.querySelector('.rdg-grays'); if (ry) ry.classList.add('go'); }
    const b = document.createElement('div'); b.className = 'rdg-gburst'; el.appendChild(b);
    const c0 = r === 5 ? 'rgba(232,198,103,.9)' : r === 4 ? 'rgba(176,128,63,.85)' : 'rgba(160,140,100,.6)';
    const c1 = r === 5 ? 'rgba(232,198,103,0)' : r === 4 ? 'rgba(176,128,63,0)' : 'rgba(160,140,100,0)';
    try { b.animate([{ boxShadow: `0 0 0 0 ${c0}`, opacity: 1 }, { boxShadow: `0 0 40px 22px ${c1}`, opacity: 0 }], { duration: 640, easing: 'ease-out' }); } catch (e) { }
    setTimeout(() => b.remove(), 660);
}
function sparkle(el, n, color) {
    for (let k = 0; k < n; k++) {
        const s = document.createElement('div'); s.className = 'rdg-spk2';
        const sz = 6 + Math.random() * 10;
        s.style.cssText = `width:${sz}px;height:${sz}px;color:${color};left:${20 + Math.random() * 60}%;top:${15 + Math.random() * 55}%`;
        s.innerHTML = `<svg viewBox="0 0 24 24" fill="currentColor"><path d="M12 2l2.6 6.6 7 .5-5.4 4.5 1.8 6.8L12 17.2 6 20.9l1.8-6.8L2.4 9.1l7-.5z"/></svg>`;
        el.appendChild(s);
        const dx = (Math.random() - .5) * 50, dy = (Math.random() - .5) * 50;
        try {
            s.animate([{ transform: 'scale(.2) rotate(0)', opacity: 0 }, { transform: 'scale(1) rotate(90deg)', opacity: 1, offset: .4 },
            { transform: `translate(${dx}px,${dy}px) scale(.3) rotate(180deg)`, opacity: 0 }], { duration: 900 + Math.random() * 400, easing: 'ease-out' });
        } catch (e) { }
        setTimeout(() => s.remove(), 1300);
    }
}
let splashQ = [], splashing = false;
function queueSplash(x) { splashQ.push(x); if (!splashing) nextSplash(); }
function nextSplash() { if (!splashQ.length) { splashing = false; return; } splashing = true; heroSplash(splashQ.shift()); }
function heroSplash(x) {
    const host = document.getElementById('rdg-main');
    const p = profile();
    const h = x.hero ? heroById(p, x.hero) : null;
    const o = document.createElement('div');
    o.className = 'rdg-splash';
    o.innerHTML = `<div class="rdg-spflash"></div><div class="rdg-sprays"></div><div class="rdg-sphalo"></div>
        <div class="rdg-featcard big">${featInner(h || { name: x.nm, rar: 5 }, false)}</div>
        <div class="rdg-spname"><div class="rdg-spn">${esc(x.nm)}</div><div class="rdg-spr">${esc(x.rl || '')}${x.isNew ? ' · NEW' : T(' · ПРОБУЖДЕНИЕ')}</div><div class="rdg-sps">★★★★★</div></div>
        <div class="rdg-sphint">${T('нажми, чтобы продолжить')}</div>`;
    (host || document.body).appendChild(o);
    setTimeout(() => {
        for (let k = 0; k < 34; k++) {
            const spk = document.createElement('div'); spk.className = 'rdg-spk2';
            const sz = 10 + Math.random() * 18;
            spk.style.cssText = `width:${sz}px;height:${sz}px;color:#f4dd97;left:50%;top:44%;z-index:9`;
            spk.innerHTML = `<svg viewBox="0 0 24 24" fill="currentColor"><path d="M12 2l2.6 6.6 7 .5-5.4 4.5 1.8 6.8L12 17.2 6 20.9l1.8-6.8L2.4 9.1l7-.5z"/></svg>`;
            o.appendChild(spk);
            const a = Math.random() * 6.28, r = 120 + Math.random() * 180, dx = Math.cos(a) * r, dy = Math.sin(a) * r;
            try {
                spk.animate([{ transform: 'translate(-50%,-50%) scale(.2) rotate(0)', opacity: 0 },
                { transform: `translate(calc(-50% + ${dx}px),calc(-50% + ${dy}px)) scale(1) rotate(130deg)`, opacity: 1, offset: .5 },
                { transform: `translate(calc(-50% + ${dx * 1.25}px),calc(-50% + ${dy * 1.25}px)) scale(.3) rotate(240deg)`, opacity: 0 }], { duration: 1100 + Math.random() * 500, easing: 'ease-out' });
            } catch (e) { }
            setTimeout(() => spk.remove(), 1650);
        }
    }, 300);
    o.addEventListener('click', () => { o.remove(); nextSplash(); });
}
function flashScreen() {
    const host = document.getElementById('rdg-main');
    if (!host) return;
    let f = host.querySelector('.rdg-flash');
    if (!f) { f = document.createElement('div'); f.className = 'rdg-flash'; host.appendChild(f); }
    f.classList.remove('go'); void f.offsetWidth; f.classList.add('go');
}

/* ============================================================
   НОРА — сбор отряда + вход вниз (объединённая вкладка боя)
   ============================================================ */
function ocardInner(h) {
    return `<div class="rdg-oin"><span class="rdg-oaura" style="--e:${h.e || '#b8902f'}"></span>${h.img ? portrait(h, 'fit') : I(G.person, 1).replace('<svg', '<svg class="rdg-opor"')}<div class="rdg-oshine"></div></div>
        ${filiCorners()}<div class="rdg-ocrest">${I(G.seal, 0)}</div>
        <div class="rdg-oplate"><div class="rdg-onm">${esc(h.name)}</div>
        <div class="rdg-oel"><span class="rdg-dotc" style="background:${h.e || '#b8902f'}"></span>${esc(T(h.suit || ''))} · ${heroPower(h)}</div>
        <div class="rdg-ostars">${'★'.repeat(h.rar || 4)}${(h.awaken || 0) ? `<span class="aw">+${h.awaken}</span>` : ''}</div></div>`;
}
function renderAbyss(main, p) {
    seedHeroes(p);
    p.team = (p.team || []).filter(id => { const h = heroById(p, id); return h && h.unlocked; }).slice(0, 3);
    const best = Math.max(0, ...Object.values(p.cleared || {}).map(Number).filter(Number.isFinite));
    const maxd = Math.max(10, ...p.dungeons.map(d => d.depth || 10));
    const slots = slotsHTML(p);
    const unlocked = p.heroes.filter(h => h.unlocked);
    const roster = p.heroes.length ? p.heroes.map(h => {
        if (!h.unlocked) return `<div class="rdg-ocard lock"><span class="rdg-olk">${I(G.lock)}</span>${filiCorners()}
            <div class="rdg-oin"><div class="rdg-oq">?</div></div><div class="rdg-ovia">${T('в Призыве')}</div></div>`;
        const sel = p.team.includes(h.id);
        return `<div class="rdg-ocard ${h.rar !== 5 ? 'r4' : ''} ${sel ? 'sel' : ''}" data-id="${esc(h.id)}"><span class="rdg-ocheck">${I(G.check, 3)}</span>${ocardInner(h)}</div>`;
    }).join('') : '';
    main.innerHTML = `<div class="rdg-view">${viewDecor()}
        ${hdr(T('КРОЛИЧЬЯ НОРА'), T('ВНИЗ ПО СПИРАЛИ · СБОР ОТРЯДА'), `${T('достигнут')}<br><b>${T('ход ')}${best}</b> / ${maxd}`)}
        <div class="rdg-depthbar"><i style="width:${Math.min(100, best / maxd * 100)}%"></i></div>
        <div class="rdg-label">${T('ОТРЯД · ')}<span id="rdg-tc">${p.team.length}</span> / 3</div>
        <div class="rdg-oslots">${slots}</div>
        <div class="rdg-label">${T('ДОСТУПНЫЕ ГЕРОИ · ТАПНИ, ЧТОБЫ ДОБАВИТЬ')}</div>
        ${p.heroes.length ? `<div class="rdg-orost">${roster}</div>` : `<div class="rdg-hint">${T('СПУТНИКИ ЕЩЁ НЕ ВЫКОВАНЫ — ЗАГЛЯНИ В ПРИЗЫВ')}</div>`}
        ${p.heroes.length && !unlocked.length ? `<div class="rdg-hint">${T('ГЕРОИ ВЫПАДАЮТ ИЗ КРУТОК В ПРИЗЫВЕ — НО ВНИЗ МОЖНО И ОДНОЙ')}</div>` : ''}
        <div class="rdg-foot">
            <div class="rdg-fpower">${I(G.sword)}<span>${T('СИЛА ОТРЯДА ')}<b>${p.team.reduce((s, id) => s + heroPower(heroById(p, id) || {}), 0)}</b><span class="h">${T('снижает шанс срыва в норе')}</span></span></div>
            <button class="rdg-enter" id="rdg-enter">${T('Вниз')} ${I(G.arrow)}</button>
        </div></div>`;
    bindSlotRemovers(p);
    main.querySelectorAll('.rdg-ocard[data-id]').forEach(c => c.onclick = () => {
        const id = c.dataset.id;
        if (p.team.includes(id)) p.team = p.team.filter(t => t !== id);
        else { if (p.team.length >= 3) { toast('info', T('В отряде не больше трёх.')); return; } p.team.push(id); }
        saveSettings();
        syncTeam(p);                                  // точечно: слоты, галочки, сила — без перерисовки экрана
    });
    document.getElementById('rdg-enter').onclick = () => startFight(p);
}



/* ============================================================
   ПОЛНАЯ КАРТА ПЕРСОНАЖА (Living Character Card) + экспорт PNG
   ============================================================ */
const FULL_CARD_SYS = `You are an expert character creator for high-quality roleplay (SillyTavern).
Your goal is to create a "Living Character Card" that perfectly captures the specific "Vibe" of the character (be it goofy, serious, dark, or energetic).

CRITICAL INSTRUCTIONS:
1.  **CAPTURE THE VIBE:** If the character is a "goofball" or "hot-blooded idiot" (like Natsu), they MUST sound like it. Do not make everyone a dark philosopher. If they are funny, be funny. If they are stoic, be stoic. No clichés or clichéd phrases.
2.  **APPEARANCE SECTION:** You MUST include a dedicated "APPEARANCE" section with Hair, Eyes, Body, Clothes, and Scent.
3.  **SHOW, DON'T TELL:** In dialogues, describe their specific movements (e.g., "grinning widely," "scratching head in confusion").
4.  **THE "GOOD SIDE" & VULNERABILITY:** Every character needs a moment of humanity.
5.  **INTEGRATED NSFW/ROMANCE:** Romantic/Sexual traits must flow from their personality.

OUTPUT FORMAT (JSON):
The output must be a valid JSON object.
"name": Character Name
"raw_card": The full text block in English.

STRUCTURE FOR "raw_card" (Use this exact structure):

<[Character Name]>
🔹 BASIC INFORMATION:
Full Name:
Alias/Nickname:
Race/Species:
Gender:
Age:
Height:
Weight:
Occupation:
Alignment:

🔹 APPEARANCE:
Hair: [Color, Style]
Eyes: [Color, Shape]
Body: [Build, Scars, Tattoos, etc.]
Clothes: [Default outfit details]
Scent: [Specific smell]

🔹 EXAMPLES OF DIALOGUES:
(Generate 5 distinct scenarios using {{user}} and {{char}}. Capture the character's unique voice and quirks.):

1. **Introduction:**
{{user}}: "Who are you?"
{{char}}: *[Action revealing personality. Spoken introduction in character's specific voice.]*

2. **Philosophy / Motivation:**
{{user}}: "Why do you fight? / What do you want?"
{{char}}: *[Explains their goal. If they are simple-minded, keep it simple! If complex, make it complex.]*

3. **Vulnerability / Soft Side:**
{{user}}: *[Scenario: Interaction with something small/weak or a moment of failure.]*
{{char}}: *[Shows emotion, sadness, or gentleness.]*

4. **The "True Nature" / Intense Mode:**
{{user}}: "You are dangerous."
{{char}}: *[The mask slips. If they are a dragon, they growl. If they are a cold duke, they freeze the air.]*

5. **Romance / Intimacy:**
{{user}}: *[A romantic or intimate moment.]*
{{char}}: *[How do they react to love? Blushing? Dominating? Clueless?]*

🔹 {{char}}'s PERSONA:
[Deep psychological profile. Keywords: Personality traits. Fears. desires. "The Mask" vs "The Real Self".]

🔹 RELATIONSHIPS:
[Key connections.]

🔹 ROMANCE & NSFW TRAITS:
- **The Dynamic:** (e.g., "The Clueless Lover," "The Primal Protector," "The Sadistic Noble").
- **Kinks/Preferences:** (Specific to lore. e.g., Natsu likes heat/biting. A noble likes control).
- **The Voice:** (During intimacy).
- **Aftercare:** (Cuddly? Cold? Sleepy?).

🔹 PREFERENCES:
- **Likes:** (e.g., music..)
- **Dislikes:** (e.g., cry...)

🔹 BACKGROUND & LORE:
[History, Trauma, Key Plot Points.]

🔹 SPEECH PATTERNS:
[Keywords, slang, tone (e.g., "I'm all fired up!", "Lousy", Formal, Slurred).]

🔹 COMBAT/ABILITIES:
[Fighting style, Magic, Weapons.]
</[Character Name]>`;

async function genFullCard(id) {
    const p = profile(), h = heroById(p, id);
    if (!p || !h || ui.busy) return;
    ui.busy = true; render();
    const a = artById(p, h.art);
    const chapters = (h.chapters || []).filter(c => c.x).map(c => `${c.t}: ${c.x}`).join('\n\n');
    const usr = `Build the Living Character Card for this companion.

THEY BELONG TO THIS WORLD (the player's own character card):
${cardText()}

COMPANION — THIS IS CANON, DO NOT CHANGE ANY OF IT:
Name: ${h.name}
Gender: ${h.gender || 'as implied by the name'}
Role: ${h.role || ''}
Age: ${h.age || 'unknown'}
Suit/motif: ${EN[h.suit] || h.suit || ''}
Appearance (canon): ${canonLine(h, 'en')}
Skin and features: ${h.canon?.skin || '—'}
Hair: ${h.canon?.hair || '—'}
Eyes: ${h.canon?.eyes || '—'}
Body: ${h.canon?.body || '—'}
Clothes: ${h.canon?.clothes || '—'}
Scent: ${h.canon?.scent || '—'}
Who they are: ${h.lore || ''}
Their artifact: ${a ? `«${a.name}» — ${a.desc}` : '—'}
Their skills: ${(h.skills || []).map(s => `${s.n} (${s.d})`).join('; ') || '—'}
${chapters ? `\nTHEIR STORY SO FAR:\n${chapters}` : ''}
${h.card ? `\nSHORT W++ VERSION (keep it consistent):\n${h.card}` : ''}

HARD RULE: the APPEARANCE section of the card must reproduce the canon above — same gender, same hair, same eyes, same build, same clothes, same scent. Do not invent a different look, do not change their gender, do not age them. A portrait has already been drawn from this canon, so the card must match it.`;
    try {
        const out = await callAI(FULL_CARD_SYS, usr, 6000);
        const raw = out && (out.raw_card || out.rawCard || out.card);
        if (!raw) throw new Error('empty');
        h.cardFull = String(raw).slice(0, 12000);
        if (out.name) h.cardName = clip(out.name, 60);
        saveSettings(true);
        toast('success', T('Полная карта готова.'));
    } catch (e) {
        if (isCancel(e)) toast('info', T('Остановлено.'));
        else if (e && e.message === 'no-key') toast('warning', T('Сначала укажи API-ключ.'));
        else { console.error('[Dungeons] полная карта', e); toast('warning', T('ИИ не ответил — попробуй ещё раз.')); }
    }
    ui.busy = false; render();
}

/* ---------- PNG с зашитой карточкой (формат SillyTavern V2) ---------- */
const CRC_T = (() => {
    const t = new Uint32Array(256);
    for (let n = 0; n < 256; n++) {
        let c = n;
        for (let k = 0; k < 8; k++) c = (c & 1) ? (0xedb88320 ^ (c >>> 1)) : (c >>> 1);
        t[n] = c >>> 0;
    }
    return t;
})();
function crc32(bytes) {
    let c = 0xffffffff;
    for (let i = 0; i < bytes.length; i++) c = CRC_T[(c ^ bytes[i]) & 0xff] ^ (c >>> 8);
    return (c ^ 0xffffffff) >>> 0;
}
function b64encodeUTF8(str) {
    const bytes = new TextEncoder().encode(str);
    let bin = '';
    for (const b of bytes) bin += String.fromCharCode(b);
    return btoa(bin);
}
// собрать tEXt-чанк и вставить его перед IEND
function pngWithChara(pngBytes, keyword, textB64) {
    const kw = new TextEncoder().encode(keyword);
    const tx = new TextEncoder().encode(textB64);
    const dataLen = kw.length + 1 + tx.length;
    const chunk = new Uint8Array(12 + dataLen);
    const dv = new DataView(chunk.buffer);
    dv.setUint32(0, dataLen);
    chunk.set(new TextEncoder().encode('tEXt'), 4);
    chunk.set(kw, 8);
    chunk[8 + kw.length] = 0;
    chunk.set(tx, 8 + kw.length + 1);
    dv.setUint32(8 + dataLen, crc32(chunk.subarray(4, 8 + dataLen)));
    // ищем IEND: последние 12 байт файла
    const iend = pngBytes.length - 12;
    const out = new Uint8Array(pngBytes.length + chunk.length);
    out.set(pngBytes.subarray(0, iend), 0);
    out.set(chunk, iend);
    out.set(pngBytes.subarray(iend), iend + chunk.length);
    return out;
}
function loadImg(srcUrl) {
    return new Promise((res, rej) => {
        const im = new Image();
        im.crossOrigin = 'anonymous';
        im.onload = () => res(im);
        im.onerror = () => rej(new Error('img'));
        im.src = srcUrl;
    });
}
async function heroPngBytes(h) {
    const W = 512, H = 768;
    const cv = document.createElement('canvas');
    cv.width = W; cv.height = H;
    const cx = cv.getContext('2d');
    // подложка на случай, если портрета нет или он не загрузился
    const g = cx.createLinearGradient(0, 0, 0, H);
    g.addColorStop(0, '#3d2c15'); g.addColorStop(1, '#140d05');
    cx.fillStyle = g; cx.fillRect(0, 0, W, H);
    if (h.img) {
        try {
            const im = await loadImg(h.img);
            const s = Math.max(W / im.width, H / im.height);
            const w = im.width * s, ht = im.height * s;
            cx.drawImage(im, (W - w) / 2, (H - ht) / 2, w, ht);
        } catch (e) { console.warn('[Dungeons] портрет не лёг в PNG', e); }
    }
    // золотая рамка и подпись
    cx.strokeStyle = '#c69a37'; cx.lineWidth = 6;
    cx.strokeRect(3, 3, W - 6, H - 6);
    cx.fillStyle = 'rgba(12,8,3,.72)';
    cx.fillRect(0, H - 92, W, 92);
    cx.fillStyle = '#f4dd97';
    cx.font = '700 38px Georgia, serif';
    cx.textAlign = 'center';
    cx.fillText(String(h.name || '').slice(0, 24), W / 2, H - 48);
    cx.fillStyle = '#c8b58a';
    cx.font = '20px Georgia, serif';
    cx.fillText(String(h.role || T(h.suit || '')).slice(0, 40), W / 2, H - 20);
    const blob = await new Promise(r => cv.toBlob(r, 'image/png'));
    return new Uint8Array(await blob.arrayBuffer());
}
async function exportHeroPng(id) {
    const p = profile(), h = heroById(p, id);
    if (!p || !h) return;
    const body = ui.cardMode === 'full' ? (h.cardFull || '') : (h.card || '');
    if (!body.trim()) { toast('info', T('Сначала сгенерируй карту.')); return; }
    try {
        const v2 = {
            spec: 'chara_card_v2', spec_version: '2.0',
            data: {
                name: h.cardName || h.name,
                description: body,
                personality: h.role || '',
                scenario: h.lore || '',
                first_mes: '',
                mes_example: '',
                creator_notes: `${T('Выковано «Кроличьей норой» из карточки персонажа. Артефакт:')} ${(artById(p, h.art) || {}).name || '—'}.`,
                system_prompt: '', post_history_instructions: '',
                alternate_greetings: [],
                character_book: undefined,
                tags: ['rpg-dungeons', EN[h.suit] || h.suit || ''].filter(Boolean),
                creator: 'RPG Dungeons', character_version: '1.0',
                extensions: {}
            },
            name: h.cardName || h.name, description: body,
            personality: h.role || '', scenario: h.lore || '', first_mes: '', mes_example: ''
        };
        const png = await heroPngBytes(h);
        const out = pngWithChara(png, 'chara', b64encodeUTF8(JSON.stringify(v2)));
        const url = URL.createObjectURL(new Blob([out], { type: 'image/png' }));
        const a2 = document.createElement('a');
        a2.href = url;
        a2.download = `${String(h.name || 'companion').replace(/[^\w\u0400-\u04FF -]+/g, '')}.png`;
        document.body.appendChild(a2); a2.click(); a2.remove();
        setTimeout(() => URL.revokeObjectURL(url), 4000);
        toast('success', T('PNG сохранён — его можно импортировать в SillyTavern.'));
    } catch (e) {
        console.error('[Dungeons] экспорт PNG', e);
        toast('warning', T('Не вышло собрать PNG: ') + e.message);
    }
}


/* ============================================================
   ЛОРБУК — запись о спутнике в мировую информацию
   ============================================================ */
// world-info.js грузим динамически: если у пользователя другая сборка Таверны,
// расширение просто останется без лорбука, а не рухнет целиком
let WI = null;
async function wi() {
    if (WI) return WI;
    for (const path of ['../../../world-info.js', '../../../../scripts/world-info.js']) {
        try {
            const m = await import(path);
            if (m && typeof m.loadWorldInfo === 'function') { WI = m; return WI; }
        } catch (e) { /* пробуем следующий путь */ }
    }
    throw new Error('no-wi');
}
// Какой лорбук «тот самый»: сперва выбранный вручную, потом привязанный к персонажу,
// потом лорбук чата, потом первый из активных глобально.
function guessBookName() {
    if (settings.loreBook) return settings.loreBook;
    try {
        const ctx = getContext();
        const ch = characters?.[ctx.characterId];
        const own = ch?.data?.extensions?.world;
        if (own) return own;
        const chat = ctx.chatMetadata?.world_info || window.chat_metadata?.world_info;
        if (chat) return chat;
        const sel = window.selected_world_info;
        if (Array.isArray(sel) && sel.length) return sel[0];
    } catch (e) { }
    return '';
}
async function listBooks() {
    try {
        await wi();
        const names = window.world_names;
        return Array.isArray(names) ? names.slice() : [];
    } catch (e) { return []; }
}
async function loreCardText(h) {
    const p = profile();
    const a = artById(p, h.art);
    const sys = `You write a compact lorebook entry for a roleplay character, in the bracketed W++-style format. Return ONLY JSON:
{"entry":"the entry text"}

FORMAT — follow it exactly, same tags, same bracket style:
[CHARACTER("Name")]
[AGE("...")]
[ROLE("...", "...")]
[APPEARANCE("hair colour + style", "eye colour", "skin", "build", "height in cm")]
[ATTIRE("...", "...")]
[ARTIFACT("artifact name", "what it does and what it means to them")]
[PERSONALITY("...", "...", "...")]
[ARCHETYPE("..." + "...")]
[PREFERENCES]
POSITION: ...
SPECIALTY: ...
NSFW_TRAITS: ...
[/PREFERENCES]
[BACKGROUND("...", "...")]
[LIKES("...", "...")]
[DISLIKES("...", "...")]

Rules:
- APPEARANCE and ATTIRE must reproduce the canon given below — same gender, hair, eyes, build, height, clothes. Never invent a different look.
- AGE must match the canon age given below. If none is given, infer a plausible one from their role and appearance rather than skipping the tag or writing "unknown".
- Hair and eye colour must be stated plainly, e.g. "dark brown, wavy" / "grey-blue" — never write "unknown". If the canon below doesn't spell out a colour, pick one that fits the character and their portrait rather than leaving it blank.
- ARTIFACT must name their actual artifact from the canon below and describe it in a few words — never invent a different one, never leave it generic.
- Adapt the PREFERENCES block to who this character actually is: POSITION/SPECIALTY/NSFW_TRAITS describe their intimate dynamic, drawn from their personality, not a generic template.
- If chapters of their story are given below, use them as real source material for BACKGROUND/PERSONALITY/LIKES — specific moments and details, not a restatement of the chapter itself.
- Use {{user}} where the player is meant.
- The entry is in English (lorebook convention), keep proper names as they are.`;
    const chapters = (h.chapters || []).filter(c => c.x && c.x.trim())
        .map(c => `${c.t}: ${String(c.x).slice(0, 350)}…`).join('\n');
    const usr = `CANON — DO NOT CONTRADICT:
Name: ${h.name}
Gender: ${h.gender || 'as implied by the name'}
Age: ${h.age || '—'}
Role: ${h.role || ''}
Appearance: ${canonLine(h, 'en')}
Skin: ${h.canon?.skin || '—'} | Hair: ${h.canon?.hair || '—'} | Eyes: ${h.canon?.eyes || '—'} | Body/height: ${h.canon?.body || '—'}
Clothes: ${h.canon?.clothes || '—'} | Scent: ${h.canon?.scent || '—'}
Who they are: ${h.lore || ''}
Their artifact: ${a ? `«${a.name}» — ${a.desc}` : '—'}
Skills: ${(h.skills || []).map(s => s.n).join(', ') || '—'}
${h.cardFull ? `\nFULL CARD (stay consistent with it):\n${String(h.cardFull).slice(0, 3000)}` : ''}
${chapters ? `\nWRITTEN CHAPTERS OF THEIR STORY (real source material for BACKGROUND/PERSONALITY/LIKES):\n${chapters}` : ''}

THE WORLD THEY LIVE IN:
${cardText().slice(0, 2000)}`;
    const out = await callAI(sys, usr, 2000);
    const t = out && (out.entry || out.text || out.raw_card);
    if (!t) throw new Error('empty');
    // FEATURE (by request): wrapped in <Name>...</Name> so the model can clearly see
    // where this character's block starts and ends among other lorebook entries.
    // Done here in code (not asked of the AI) so the tag always matches the real name exactly.
    return `<${h.name}>\n${String(t).slice(0, 8000)}\n</${h.name}>`;
}
async function addToLorebook(id) {
    const p = profile(), h = heroById(p, id);
    if (!p || !h || ui.busy) return;
    let mod;
    try { mod = await wi(); }
    catch (e) { toast('warning', T('Не нашла модуль лорбуков в этой сборке Таверны.')); return; }
    const book = guessBookName();
    if (!book) { toast('info', T('Не вижу активный лорбук. Открой его в World Info или выбери в настройках расширения.')); return; }
    ui.busy = true; render();
    try {
        const text = h.loreEntry || await loreCardText(h);
        h.loreEntry = text;
        const data = await mod.loadWorldInfo(book);
        if (!data || !data.entries) throw new Error(T('Лорбук «') + book + T('» не открылся'));
        // уже добавляли этого спутника — обновляем ту же запись, а не плодим дубли
        let entry = Object.values(data.entries).find(e => e && e.comment === `RPG Dungeons · ${h.name}`);
        if (!entry) {
            const uids = Object.keys(data.entries).map(Number).filter(Number.isFinite);
            const uid = (uids.length ? Math.max(...uids) : -1) + 1;
            entry = {
                uid, key: [h.name], keysecondary: [], comment: `RPG Dungeons · ${h.name}`,
                content: '', constant: false, selective: true, order: 100, position: 0,
                disable: false, addMemo: true, excludeRecursion: false, probability: 100,
                useProbability: true, depth: 4, group: '', scanDepth: null,
                caseSensitive: null, matchWholeWords: null, automationId: '', role: null,
                vectorized: false, displayIndex: uid
            };
            data.entries[uid] = entry;
        }
        entry.key = [h.name, ...(h.cardName && h.cardName !== h.name ? [h.cardName] : [])];
        entry.content = text;
        await mod.saveWorldInfo(book, data, true);
        saveSettings(true);
        toast('success', `${T('Запись о')} ${h.name} ${T('добавлена в лорбук «')}${book}».`);
    } catch (e) {
        console.error('[Dungeons] лорбук', e);
        if (isCancel(e)) toast('info', T('Остановлено.'));
        else if (e && e.message === 'no-key') toast('warning', T('Сначала укажи API-ключ.'));
        else toast('warning', T('Не вышло записать в лорбук: ') + (e.message || T('ошибка')));
    }
    ui.busy = false; render();
}

/* ============================================================
   БОЙ В НОРЕ — арена из макета (tpl-bezdna), 504px
   ============================================================ */
const FOENAMES_RU = ['Тень в проёме', 'Шёпот за спиной', 'Тот, кто считает шаги', 'Двойник', 'Смотритель витка', 'Хозяин норы'];
function foeName(i) { return T(FOENAMES_RU[i % FOENAMES_RU.length]); }
let F = null;                                  // состояние боя
function rnd(a, b) { return a + Math.random() * (b - a); }
function foeIntent(f, floor) {
    const r = Math.random();
    if (r < .2) f.intent = { type: 'heavy', val: Math.round((8 + floor * 2) * 1.7) };
    else if (r < .34) f.intent = { type: 'guard', val: 0 };
    else f.intent = { type: 'hit', val: 8 + floor * 2 };
}
function startFight(p) {
    const team = (p.team || []).map(id => heroById(p, id)).filter(h => h && h.unlocked);
    if (!team.length) { toast('info', T('Сначала выбери хотя бы одного спутника в отряд.')); return; }
    const best = Math.max(0, ...Object.values(p.cleared || {}).map(Number).filter(Number.isFinite));
    const floor = best + 1;
    const n = 2 + Math.floor(Math.random() * 3);
    const foes = [];
    for (let i = 0; i < n; i++) {
        const hp = 70 + floor * 14 + Math.floor(Math.random() * 24);
        foes.push({ name: foeName(floor + i), hpMax: hp, hp, ko: false, isBoss: false, intent: null });
    }
    const b = foes[n - 1];
    b.isBoss = true; b.hpMax = Math.round(b.hpMax * 1.7); b.hp = b.hpMax;
    foes.forEach(f => foeIntent(f, floor));
    F = {
        floor, maxFloor: Math.max(20, ...p.dungeons.map(d => d.depth || 20)),
        foes, active: 0, target: 0, busy: false, guard: 0,
        heroes: team.map(h => {
            const pw = heroPower(h) + artPower(p) * 6;
            const hpMax = 140 + (h.rar || 4) * 12 + (h.awaken || 0) * 10;
            /* Три умения ИИ пишет каждому спутнику поимённо, а в бой они не попадали
               вовсе — кнопки назывались «Удар / Приём / Ульта» у всех одинаково.
               Теперь имена едут сюда и подписывают кнопки. Цифры боя не трогаю. */
            return {
                id: h.id, name: h.name, suit: h.suit, e: h.e, rar: h.rar, img: h.img || '',
                power: pw, hpMax, hp: hpMax, ult: 0, cd: 0, ko: false,
                skills: (h.skills || []).map(s => s && s.n).filter(Boolean)
            };
        })
    };
    ui.mode = 'abyss'; render();
}
function fightAlive(a) { return a.filter(x => !x.ko); }
function renderFight(main, p) {
    main.classList.add('rdg-dark');
    main.innerHTML = `${sky(34)}<div class="rdg-arena" id="rdg-arena">
        <div class="rdg-ftop">
            <div class="rdg-fdepth"><span class="t">${T('КРОЛИЧЬЯ НОРА')}</span><span class="floor">${T('ВИТОК')} <b>${F.floor}</b> / ${F.maxFloor}</span></div>
            <div class="rdg-ftk"><span class="ic">${I(G.spin)}</span><span>${p.tickets}</span></div>
        </div>
        <div class="rdg-fbar"><i style="width:${Math.min(100, F.floor / F.maxFloor * 100)}%"></i></div>
        <div class="rdg-flabel">${T('ПРОТИВНИКИ')}</div>
        <div class="rdg-foes" id="rdg-foes"></div>
        <div class="rdg-flabel" style="margin-top:16px">${T('ТВОЯ КОМАНДА · выбери активного')}</div>
        <div class="rdg-party" id="rdg-party"></div>
        <div class="rdg-fpow">${I(G.sword)}<span>${T('СИЛА ОТРЯДА ')}<b>${F.heroes.reduce((s, h) => s + h.power, 0)}</b> · ${T('реликвии')} +${artPower(p) * 6}</span></div>
        <div class="rdg-facts2" id="rdg-facts2"></div>
        <button class="rdg-fflee" id="rdg-fflee">${I(G.back)} ${T('уйти наверх')}</button>
    </div>`;
    buildFoes(); buildParty(); renderFightActions();
    document.getElementById('rdg-fflee').onclick = () => {
        if (F) clearTimeout(F.watchdog);
        F = null; render();
        toast('info', T('Ты выбралась наверх — виток не зачтён.'));
    };
}
function buildFoes() {
    const el = document.getElementById('rdg-foes');
    el.innerHTML = F.foes.map((f, i) => `<div class="rdg-ccard rdg-ecard ${f.isBoss ? 'boss' : ''}" data-i="${i}">
        <div class="in">${I(G.skull, 1.4).replace('<svg', '<svg class="port"')}
            <span class="role ${f.isBoss ? 'boss' : 'reg'}">${f.isBoss ? T('★ БОСС') : T('рядовой')}</span>
            <span class="intentwrap"></span>
            <div class="en">${esc(f.name)}</div>
            <div class="hp"><i></i><span class="n"></span></div>
            <div class="charlayer"></div><div class="ko-x">${I(G.x, 2.2)}</div></div>
        <div class="crest">${I(G.seal, 0)}</div><div class="fx"></div></div>`).join('');
    [...el.children].forEach((c, i) => c.onclick = () => { if (!F.foes[i].ko && !F.busy) { F.target = i; syncFoes(); } });
    syncFoes();
}
function buildParty() {
    const el = document.getElementById('rdg-party');
    el.innerHTML = F.heroes.map((h, i) => `<div class="rdg-ccard rdg-hcard ${h.rar !== 5 ? 'r4' : ''} ${SUIT_CLASS[h.suit] || ''}" data-i="${i}" style="--e:${h.e}">
        <div class="in"><span class="aura"></span>${h.img ? `<img class="rdg-pimg fit port" src="${esc(h.img)}" alt="">` : I(G.person, 1.5).replace('<svg', '<svg class="port"')}
            <span class="ready">${T('УЛЬТА!')}</span>
            <div class="hn">${esc(h.name)}</div>
            <div class="hel"><span class="dot"></span>${esc(T(h.suit || ''))} · ${h.power}</div>
            <div class="hp"><i></i><span class="n"></span></div>
            <div class="ult"><i></i></div>
            <div class="charlayer"></div><div class="ko-x">${I(G.x, 2.2)}</div></div>
        <div class="fx"></div></div>`).join('');
    [...el.children].forEach((c, i) => c.onclick = () => { if (!F.heroes[i].ko && !F.busy) { F.active = i; syncParty(); renderFightActions(); } });
    syncParty();
}
function fcards(sel) { const e = document.getElementById(sel); return e ? [...e.children] : []; }
function syncFoes() {
    const cs = fcards('rdg-foes');
    F.foes.forEach((f, i) => {
        const c = cs[i]; if (!c) return;
        c.querySelector('.hp i').style.width = (Math.max(0, f.hp) / f.hpMax * 100) + '%';
        c.querySelector('.hp .n').textContent = Math.max(0, Math.round(f.hp)) + '/' + f.hpMax;
        c.querySelector('.intentwrap').innerHTML = f.ko ? '' : (f.intent.type === 'guard'
            ? `<span class="intent guard">${I(G.shield)}</span>`
            : `<span class="intent">${I(G.fist)}${f.intent.val}${f.intent.type === 'heavy' ? '⚡' : ''}</span>`);
        c.classList.toggle('sel', i === F.target && !f.ko);
    });
}
function syncParty() {
    const cs = fcards('rdg-party');
    F.heroes.forEach((h, i) => {
        const c = cs[i]; if (!c) return;
        c.querySelector('.hp i').style.width = (Math.max(0, h.hp) / h.hpMax * 100) + '%';
        c.querySelector('.hp .n').textContent = Math.max(0, Math.round(h.hp)) + '/' + h.hpMax;
        c.querySelector('.ult i').style.width = h.ult + '%';
        c.classList.toggle('active', i === F.active);
        c.classList.toggle('ultready', h.ult >= 100);
    });
}
function renderFightActions() {
    const h = F.heroes[F.active], ready = h.ult >= 100;
    const box = document.getElementById('rdg-facts2');
    if (!box) return;
    // имя собственного умения, если ИИ его написал; иначе прежняя общая подпись
    const sk = (n, dflt) => esc(fillMacros((h.skills && h.skills[n]) || T(dflt)));
    box.innerHTML = `
        <button class="rdg-pbtn2" data-a="hit"><div class="inner"><span class="med">${I(G.fist)}</span><span class="txt"><span class="t1">${sk(0, 'Удар')}</span><span class="t2">${T('+ульта')}</span></span></div></button>
        <button class="rdg-pbtn2 skill" data-a="skill" ${h.cd > 0 ? 'disabled' : ''}><div class="inner"><span class="med">${I(G.blade)}</span><span class="txt"><span class="t1">${sk(1, 'Приём')}</span><span class="t2">${T('сильнее')}</span></span></div>${h.cd > 0 ? `<span class="cd">${h.cd}</span>` : ''}</button>
        <button class="rdg-pbtn2 guard" data-a="guard"><div class="inner"><span class="med">${I(G.shield)}</span><span class="txt"><span class="t1">${T('Защита')}</span><span class="t2">${T('−урон')}</span></span></div></button>
        <button class="rdg-pbtn2 ult ${ready ? 'ready' : ''}" data-a="ult" ${ready ? '' : 'disabled'}><div class="inner"><span class="med">${I(G.bolt)}</span><span class="txt"><span class="t1">${sk(2, 'Ульта')}</span><span class="t2">${ready ? T('по всем') : h.ult + '%'}</span></span></div></button>`;
    box.querySelectorAll('.rdg-pbtn2').forEach(b => b.onclick = () => fightAct(b.dataset.a));
}
/* --- эффекты из макета --- */
/* The number now lands the way it does in a card game: it arrives oversized and
   overshoots, snaps back, hangs long enough to be read, then drifts off. A crit gets
   its own arc — bigger, slower, and it leans as it goes. */
function floatOn(card, txt, cls) {
    const fx = card.querySelector('.fx'); if (!fx) return;
    const d = document.createElement('div'); d.className = 'rdg-dmg ' + cls; d.textContent = txt; fx.appendChild(d);
    const crit = /crit/.test(cls);
    try {
        d.animate(crit ? [
            { transform: 'translateX(-50%) translateY(6px) scale(.3) rotate(-14deg)', opacity: 0 },
            { transform: 'translateX(-50%) translateY(-10px) scale(1.75) rotate(6deg)', opacity: 1, offset: .18 },
            { transform: 'translateX(-50%) translateY(-16px) scale(1.28) rotate(-3deg)', opacity: 1, offset: .34 },
            { transform: 'translateX(-50%) translateY(-24px) scale(1.34) rotate(0deg)', opacity: 1, offset: .62 },
            { transform: 'translateX(-50%) translateY(-64px) scale(1.1) rotate(4deg)', opacity: 0 }
        ] : [
            { transform: 'translateX(-50%) translateY(4px) scale(.45)', opacity: 0 },
            { transform: 'translateX(-50%) translateY(-14px) scale(1.4)', opacity: 1, offset: .2 },
            { transform: 'translateX(-50%) translateY(-18px) scale(1.05)', opacity: 1, offset: .36 },
            { transform: 'translateX(-50%) translateY(-24px) scale(1.1)', opacity: 1, offset: .6 },
            { transform: 'translateX(-50%) translateY(-52px) scale(.92)', opacity: 0 }
        ], { duration: crit ? 1150 : 950, easing: 'cubic-bezier(.2,.9,.3,1)' });
    } catch (e) { }
    setTimeout(() => d.remove(), crit ? 1200 : 1000);
}

/* A crit is the one moment the whole arena should notice. The struck card gets a
   shockwave ring and a hard white flash on top of its usual recoil. */
function critFx(card) {
    try {
        if (!card) return;
        const fx = card.querySelector('.fx') || card;
        const w = document.createElement('div');
        w.className = 'rdg-critfx';
        w.innerHTML = '<span class="ring"></span><span class="ring d2"></span><span class="flash"></span>';
        fx.appendChild(w);
        card.classList.remove('card-crit');
        void card.offsetWidth;
        card.classList.add('card-crit');
        setTimeout(() => card.classList.remove('card-crit'), 620);
        setTimeout(() => w.remove(), 800);
    } catch (e) { console.warn('[Dungeons] crit fx', e); }
    Sound.crit();
}
/* The class went on the portrait alone, so a hit lit up the picture while the card
   around it sat perfectly still — the blow looked like it landed on a photograph
   rather than on the fighter. Both now react: the portrait keeps its flash, and the
   card gets the recoil. */
/* The ultimate's own moment: the caster swells and burns gold, and a wash of light
   crosses the arena behind it. Both clean themselves up, so nothing is left behind if
   the fight ends while they are still running. */
function ultBurst(card) {
    try {
        if (card) {
            card.classList.remove('card-ult');
            void card.offsetWidth;
            card.classList.add('card-ult');
            setTimeout(() => card.classList.remove('card-ult'), 900);
        }
        const arena = document.querySelector('.rdg-arena');
        if (arena) {
            const flash = document.createElement('div');
            flash.className = 'rdg-ultflash';
            arena.appendChild(flash);
            setTimeout(() => flash.remove(), 800);
        }
    } catch (e) { console.warn('[Dungeons] ult fx', e); }
    Sound.ult();
}
/* Guarding only ever produced a floating word — the card itself gave no sign it was
   bracing. A short blue ring answers back now, so blocking reads as an action and
   not just a number. */
function guardFx(card) {
    try {
        if (!card) return;
        card.classList.remove('card-guard');
        void card.offsetWidth;
        card.classList.add('card-guard');
        setTimeout(() => card.classList.remove('card-guard'), 620);
    } catch (e) { console.warn('[Dungeons] guard fx', e); }
    Sound.guard();
}
/* Only the target ever reacted to a blow — the one throwing it stood perfectly still.
   A quick lean-in on the attacker's own card now sells the swing; on a hero it's
   tinted with their suit (--e), so a hearts fighter and a spades fighter don't just
   deal the same damage, they visibly hit differently. */
function strikeFx(card) {
    try {
        if (!card) return;
        card.classList.remove('card-strike');
        void card.offsetWidth;
        card.classList.add('card-strike');
        setTimeout(() => card.classList.remove('card-strike'), 400);
    } catch (e) { console.warn('[Dungeons] strike fx', e); }
    Sound.hit();
}
/* FEATURE (by request): a skill used to play the exact same lean as a plain hit —
   only the damage number told them apart. A skill costs a cooldown and charges the
   ult bar harder, so it gets its own, longer wind-up with a double flash instead of
   one, on the same suit-tinted card animation. */
function skillFx(card) {
    try {
        if (!card) return;
        card.classList.remove('card-skill');
        void card.offsetWidth;
        card.classList.add('card-skill');
        setTimeout(() => card.classList.remove('card-skill'), 540);
    } catch (e) { console.warn('[Dungeons] skill fx', e); }
    Sound.skill();
}
/* ============================================================
   SOUND — synthesised with the Web Audio API, no audio files.
   Off by default (settings.sound); one checkbox turns it on.
   Every call is defensive — a browser that blocks or lacks Web
   Audio just stays silent, it never breaks the game around it.
   ============================================================ */
const Sound = (() => {
    let ctx = null;
    function ac() {
        if (!settings.sound) return null;
        try {
            if (!ctx) ctx = new (window.AudioContext || window.webkitAudioContext)();
            if (ctx.state === 'suspended') ctx.resume().catch(() => { });
            return ctx;
        } catch (e) { return null; }
    }
    // короткий отфильтрованный шум — читается как удар/шлепок, а не музыкальная нота
    function thump(dur, freq, peak, type) {
        const c = ac(); if (!c) return;
        try {
            const now = c.currentTime;
            const buf = c.createBuffer(1, Math.max(1, Math.round(c.sampleRate * dur)), c.sampleRate);
            const d = buf.getChannelData(0);
            for (let i = 0; i < d.length; i++) d[i] = (Math.random() * 2 - 1) * (1 - i / d.length);
            const src = c.createBufferSource(); src.buffer = buf;
            const filt = c.createBiquadFilter(); filt.type = type || 'bandpass'; filt.frequency.value = freq;
            const g = c.createGain(); g.gain.setValueAtTime(peak, now); g.gain.exponentialRampToValueAtTime(0.001, now + dur);
            src.connect(filt); filt.connect(g); g.connect(c.destination);
            src.start(now); src.stop(now + dur);
        } catch (e) { }
    }
    function tone(freq, dur, type, peak, sweepTo) {
        const c = ac(); if (!c) return;
        try {
            const now = c.currentTime;
            const o = c.createOscillator(); o.type = type || 'sine'; o.frequency.setValueAtTime(freq, now);
            if (sweepTo) o.frequency.exponentialRampToValueAtTime(sweepTo, now + dur);
            const g = c.createGain();
            g.gain.setValueAtTime(0.0001, now);
            g.gain.exponentialRampToValueAtTime(peak, now + 0.01);
            g.gain.exponentialRampToValueAtTime(0.0001, now + dur);
            o.connect(g); g.connect(c.destination);
            o.start(now); o.stop(now + dur);
        } catch (e) { }
    }
    return {
        hit() { thump(.11, 950, .5, 'bandpass'); },
        skill() { thump(.16, 700, .55, 'bandpass'); tone(320, .16, 'triangle', .12); },
        crit() { thump(.15, 1500, .6, 'bandpass'); tone(1400, .13, 'triangle', .16, 2200); },
        guard() { thump(.18, 260, .45, 'lowpass'); },
        ult() { tone(220, .55, 'sawtooth', .1, 880); tone(440, .55, 'sine', .09, 1320); },
        reveal() { tone(700, .16, 'sine', .13, 900); },
        rare() { [660, 880, 1100, 1320].forEach((f, i) => setTimeout(() => tone(f, .24, 'triangle', .13), i * 75)); },
        victory() { [523, 659, 784, 1047].forEach((f, i) => setTimeout(() => tone(f, .28, 'triangle', .13), i * 90)); },
        defeat() { [392, 330, 262].forEach((f, i) => setTimeout(() => tone(f, .55, 'sine', .11, f * .85), i * 220)); }
    };
})();

function portHit(card, kind) {
    const p2 = card.querySelector('.port');
    if (p2) { p2.classList.add(kind); setTimeout(() => p2.classList.remove(kind), 350); }
    if (card) {
        // Removed first so a second hit inside the window restarts the animation
        // instead of being swallowed by the class already being there.
        card.classList.remove('card-' + kind);
        void card.offsetWidth;
        card.classList.add('card-' + kind);
        setTimeout(() => card.classList.remove('card-' + kind), 420);
    }
}
function embers(card, n) {
    const fx = card.querySelector('.fx'); if (!fx) return;
    for (let k = 0; k < n; k++) {
        const e = document.createElement('div'); e.className = 'rdg-ember';
        const sz = 3 + Math.random() * 4;
        e.style.width = e.style.height = sz + 'px';
        e.style.left = (25 + Math.random() * 50) + '%'; e.style.top = (45 + Math.random() * 35) + '%';
        fx.appendChild(e);
        const dx = (Math.random() - .5) * 30, dy = -(24 + Math.random() * 36);
        try { e.animate([{ transform: 'translate(0,0)', opacity: 1 }, { transform: `translate(${dx}px,${dy}px)`, opacity: 0 }], { duration: 600 + Math.random() * 500, easing: 'ease-out' }); } catch (er) { }
        setTimeout(() => e.remove(), 1150);
    }
}
function scorch(card) {
    const inn = card.querySelector('.in'); if (!inn) return;
    const s = document.createElement('div'); s.className = 'rdg-scorch';
    const sz = 26 + Math.random() * 16;
    s.style.width = s.style.height = sz + 'px';
    s.style.left = (30 + Math.random() * 40) + '%'; s.style.top = (30 + Math.random() * 40) + '%';
    s.style.transform = 'translate(-50%,-50%)';
    inn.appendChild(s);
    try {
        s.animate([{ opacity: 0, transform: 'translate(-50%,-50%) scale(.4)' },
        { opacity: .8, transform: 'translate(-50%,-50%) scale(1)', offset: .3 },
        { opacity: 0, transform: 'translate(-50%,-50%) scale(1.1)' }], { duration: 800, easing: 'ease-out' });
    } catch (e) { }
    setTimeout(() => s.remove(), 820);
}
function burnCard(card) {
    const inn = card.querySelector('.in'); if (!inn) return;
    const b = document.createElement('div'); b.className = 'rdg-burnfx';
    b.innerHTML = '<div class="charg"></div><div class="line"></div>';
    inn.appendChild(b);
    embers(card, 12);
    setTimeout(() => card.classList.add('charred'), 600);
    setTimeout(() => b.remove(), 1000);
}
function arenaShake() { const a = document.getElementById('rdg-arena'); if (!a) return; a.classList.remove('shake'); void a.offsetWidth; a.classList.add('shake'); }
/* --- ход --- */
function fightAct(type) {
    if (!F || F.busy) return;
    const h = F.heroes[F.active];
    if (F.target == null || F.foes[F.target].ko) { const t = F.foes.findIndex(f => !f.ko); if (t < 0) return; F.target = t; }
    F.busy = true;
    clearTimeout(F.watchdog);
    F.watchdog = setTimeout(() => {
        if (F && F.busy) { console.warn('[Dungeons] ход завис — отпускаю'); F.busy = false; endFightTurn(); }
    }, 8000);
    const fc = fcards('rdg-foes'), hc = fcards('rdg-party');
    const strike = (i, mult, critC) => {
        let dmg = Math.round(h.power * mult * rnd(.9, 1.12));
        const crit = Math.random() < critC;
        if (crit) dmg = Math.round(dmg * 1.6);
        F.foes[i].hp -= dmg;
        const c = fc[i]; if (!c) return;
        portHit(c, 'hit');
        floatOn(c, (crit ? '✦ ' : '') + dmg, 'foehit' + (crit ? ' crit' : ''));
        if (crit) critFx(c);
        if (F.foes[i].hp > 0) { scorch(c); embers(c, 3); }
    };
    if (type === 'hit') { strikeFx(hc[F.active]); strike(F.target, .16, .15); h.ult = Math.min(100, h.ult + 26); }
    else if (type === 'skill') { skillFx(hc[F.active]); strike(F.target, .30, .2); h.ult = Math.min(100, h.ult + 32); h.cd = 2; }
    else if (type === 'guard') { F.guard = 1; h.ult = Math.min(100, h.ult + 14); if (hc[F.active]) { floatOn(hc[F.active], T('ЗАЩИТА'), 'block'); guardFx(hc[F.active]); } }
    else if (type === 'ult') {
        /* The ultimate had nothing of its own — a shake, then the same hits as a normal
           attack. For the one move a fighter waits the whole battle to use, that is
           thin. It now announces itself: the caster flares, the arena whites out, and
           the enemies are struck one after another rather than all in the same frame,
           so the sweep is something you can watch happen. */
        ultBurst(hc[F.active]);
        arenaShake();
        const alive = F.foes.map((f, i) => f.ko ? -1 : i).filter(i => i >= 0);
        alive.forEach((i, k) => setTimeout(() => {
            if (!F) return;                       // battle ended mid-sweep
            strike(i, .5, 1);
            const c = fc[i]; if (c) embers(c, 6);
        }, 90 + k * 110));
        h.ult = 0;
    }
    F.foes.forEach((f, i) => { if (f.hp <= 0 && !f.ko) { f.ko = true; if (fc[i]) burnCard(fc[i]); } });
    syncFoes(); syncParty(); renderFightActions();
    if (!fightAlive(F.foes).length) { F.busy = false; setTimeout(() => fightWin(), 900); return; }
    setTimeout(enemyTurn, 820);
}
function endFightTurn() {
    if (!F) return;
    F.guard = 0;
    F.heroes.forEach(h => { if (h.cd > 0) h.cd--; });
    F.foes.forEach(f => { if (!f.ko) foeIntent(f, F.floor); });
    if (!fightAlive(F.heroes).length) { F.busy = false; syncParty(); setTimeout(fightLose, 500); return; }
    const act = F.heroes.findIndex(h => !h.ko);
    if (!F.heroes[F.active] || F.heroes[F.active].ko) F.active = act < 0 ? 0 : act;
    F.busy = false; syncFoes(); syncParty(); renderFightActions();
}
function enemyTurn() {
    if (!F) return;
    const foes = fightAlive(F.foes), hc = fcards('rdg-party'), fc = fcards('rdg-foes');
    let k = 0;
    const step = () => {
        try {
            if (!F) return;
            // отряд мог полечь посреди хода врагов — раньше здесь бил undefined и бой замирал
            if (!fightAlive(F.heroes).length) { syncParty(); F.busy = false; setTimeout(fightLose, 450); return; }
            if (k >= foes.length) { endFightTurn(); return; }
            const f = foes[k]; k++;
            if (f.ko || f.intent.type === 'guard') { setTimeout(step, 260); return; }
            const alive = F.heroes.map((h, i) => ({ h, i })).filter(x => !x.h.ko);
            if (!alive.length) { syncParty(); F.busy = false; setTimeout(fightLose, 450); return; }
            const t = pick(alive);
            strikeFx(fc[F.foes.indexOf(f)]);
            let dmg = Math.round(f.intent.val * rnd(.9, 1.15));
            if (F.guard) dmg = Math.round(dmg * .45);
            t.h.hp -= dmg;
            const c = hc[t.i];
            if (c) { portHit(c, 'hurt'); floatOn(c, F.guard ? dmg + ' ⛨' : String(dmg), 'herohit'); }
            if (f.intent.type === 'heavy') arenaShake();
            if (t.h.hp <= 0 && !t.h.ko) { t.h.ko = true; if (c) burnCard(c); }
            syncParty();
            setTimeout(step, 520);
        } catch (err) {
            console.error('[Dungeons] ход врагов', err);
            if (F) { F.busy = false; endFightTurn(); }     // что бы ни случилось — бой не замирает
        }
    };
    step();
}
function fightOver(win) {
    const p = profile();
    if (!p || !F) return;
    if (win) Sound.victory(); else Sound.defeat();
    const reward = win ? { tk: 1 + Math.floor(F.floor / 4), sh: 18 + F.floor * 5, mt: 2 + Math.floor(F.floor / 3) } : { tk: 0, sh: Math.floor(F.floor * 1.5), mt: 0 };
    p.tickets += reward.tk; p.shards += reward.sh; p.mats += reward.mt;
    p.runs += 1;
    if (win && (p.cleared.abyss || 0) < F.floor) p.cleared.abyss = F.floor;
    p.log.unshift({
        ts: Date.now(), dungeon: T('Кроличья нора'), reached: F.floor, depth: F.maxFloor,
        how: win ? 'win' : 'fail', team: [...(p.team || [])],
        text: `${T('Виток')} ${F.floor}: ${win ? T('отряд выстоял') : T('отряд полёг')}${T('. Противников')} ${F.foes.length}${T(', выбито')} ${F.foes.filter(f => f.ko).length}.`
    });
    if (p.log.length > 20) p.log.length = 20;
    saveSettings(true);
    const host = document.getElementById('rdg-main');
    const o = document.createElement('div');
    o.className = 'rdg-fover ' + (win ? 'win' : 'lose');
    o.innerHTML = `<div class="big">${win ? T('ВИТОК ПРОЙДЕН') : T('ОТРЯД ПАЛ')}</div>
        <div class="rdg-freward"><span class="ic">${I(G.spin)}</span>+${reward.tk} ${T('круток')}
            <span class="ic">${I(G.gem)}</span>+${reward.sh} ${T('осколков')}${reward.mt ? `<span class="ic">${I(G.thread)}</span>+${reward.mt}` : ''}</div>
        <div class="rdg-fobtns"><button class="rdg-obtn gold" id="rdg-fnext">${win ? T('Глубже') : T('Ещё раз')}</button>
        <button class="rdg-obtn ghost" id="rdg-fout">${T('Наверх')}</button></div>`;
    (host || document.body).appendChild(o);
    document.getElementById('rdg-fnext').onclick = () => { o.remove(); F = null; startFight(profile()); };
    document.getElementById('rdg-fout').onclick = () => { o.remove(); F = null; render(); };
}
function fightWin() { fightOver(true); }
function fightLose() { fightOver(false); }

/* ============================================================
   ДОСЬЕ — герои + артефакты + хроника (всё в одном месте)
   ============================================================ */
function slotsHTML(p) {
    return [0, 1, 2].map(i => {
        const id = p.team[i], h = id ? heroById(p, id) : null;
        return h ? `<div class="rdg-ocard ${h.rar !== 5 ? 'r4' : ''}"><span class="rdg-orm" data-rm="${esc(h.id)}">×</span>${ocardInner(h)}</div>`
            : `<div class="rdg-oslot"><div class="rdg-osin"><div class="rdg-opl">+</div>${T('выбрать')}</div></div>`;
    }).join('');
}
function bindSlotRemovers(p) {
    document.querySelectorAll('.rdg-oslots .rdg-orm').forEach(x => x.onclick = e => {
        e.stopPropagation();
        p.team = p.team.filter(t => t !== x.dataset.rm);
        saveSettings();
        syncTeam(p);
    });
}
function syncTeam(p) {
    const slots = document.querySelector('.rdg-oslots');
    if (!slots) { render(); return; }
    slots.innerHTML = slotsHTML(p);
    bindSlotRemovers(p);
    document.querySelectorAll('.rdg-orost .rdg-ocard[data-id]').forEach(c => c.classList.toggle('sel', p.team.includes(c.dataset.id)));
    const tc = document.getElementById('rdg-tc');
    if (tc) tc.textContent = p.team.length;
    const pw = document.querySelector('.rdg-fpower b');
    if (pw) pw.textContent = p.team.reduce((s, id) => s + heroPower(heroById(p, id) || {}), 0);
}
function renderRoster(main, p) {
    seedHeroes(p);
    if (!heroById(p, ui.dcur)) ui.dcur = (p.heroes[0] || {}).id || '';
    const chips = p.heroes.map(h => `<div class="rdg-chip ${h.rar !== 5 ? 'r4' : ''} ${h.id === ui.dcur ? 'sel' : ''} ${h.unlocked ? '' : 'lock'}" data-id="${esc(h.id)}">
        <div class="rdg-cpc"><div class="rdg-cpin"><span class="rdg-caura" style="--e:${h.e}"></span>${h.img ? portrait(h, 'fit') : I(G.person, 1.4)}</div></div>
        <div class="rdg-cnm2">${h.unlocked ? esc(h.name) : '???'}</div></div>`).join('');
    main.innerHTML = `<div class="rdg-view">${viewDecor()}
        ${hdr(T('ДОСЬЕ'), T('ГЕРОИ · АРТЕФАКТЫ · ИСТОРИИ'), `${T('спусков')} <b>${p.runs}</b><br>${T('сила реликвий')} <b>${artPower(p)}</b>`)}
        <div class="rdg-strip">${chips}</div><div id="rdg-dbody"></div></div>`;
    main.querySelectorAll('.rdg-chip').forEach(el => el.onclick = () => {
        if (el.dataset.id === ui.dcur) return;
        ui.dcur = el.dataset.id;
        main.querySelectorAll('.rdg-chip').forEach(c => c.classList.toggle('sel', c.dataset.id === ui.dcur));
        fillDossier(p);                               // лента остаётся на месте, меняется только досье
    });
    fillDossier(p);
}
function renderRelicsInto(body, p) {
    const cards = p.artifacts.map(a => {
        const lvl = a.lvl || 0, next = ART_COST[lvl + 1];
        const can = lvl < ART_MAX && p.shards >= next;
        const pct = lvl >= ART_MAX ? 100 : Math.min(100, Math.round(p.shards / next * 100));
        const keeper = p.heroes.find(h => h.art === a.id);
        return `<div class="rdg-art ${lvl === 0 ? 'l0' : ''}">
            ${lvl > 0 ? `<div class="rdg-crest">${I(G.seal, 0)}</div>` : ''}
            <div class="rdg-ain"><div class="rdg-shine"></div>${filiCorners()}
            <div class="rdg-aic">${I(G[a.icon] || G.gem, 1.3)}</div>
            <div class="rdg-an">${esc(a.name)}</div><div class="rdg-ad">${esc(a.desc)}</div>
            ${keeper ? `<div class="rdg-keep">${T('хранит: ')}<b>${keeper.unlocked ? esc(keeper.name) : '???'}</b></div>` : ''}
            <div class="rdg-stars">${'★'.repeat(lvl)}<span class="off">${'☆'.repeat(ART_MAX - lvl)}</span></div>
            ${lvl < ART_MAX ? `<div class="rdg-abar"><i style="width:${pct}%"></i></div>` : ''}
            <button class="rdg-up" data-id="${esc(a.id)}" ${can ? '' : 'disabled'}>${lvl >= ART_MAX ? T('МАКСИМУМ') : `${T('ПРОКАЧАТЬ ·')} ${next} ✦`}</button>
        </div></div>`;
    }).join('');
    body.innerHTML = `${purse(p)}<div class="rdg-label">${T('РЕЛИКВИИ ЭТОГО МИРА')}</div><div class="rdg-agrid">${cards}</div>
        <div class="rdg-hint">${T('ЧЕМ ВЫШЕ УРОВЕНЬ — ТЕМ БОЛЬШЕ ЗАКРЫТЫХ ПУТЕЙ ОТКРЫТО И ТЕМ РЕЖЕ СРЫВАЮТСЯ РИСКИ')}</div>`;
    body.querySelectorAll('.rdg-up[data-id]').forEach(b => b.onclick = () => upgradeArt(b.dataset.id));
}
/* {{user}} и {{char}} — это шаблон для SillyTavern, а не текст для чтения. В карте и
   в записи лорбука он обязан остаться: подставляет его сама таверна при генерации.
   А в главе человек читает прозу, и «{{user}} шагнул на энгаву» выглядит как брак.
   Поэтому подстановка делается только при показе; в сохранённом тексте и во всём,
   что уходит наружу (карта, PNG, лорбук, промпты), шаблон нетронут. */
function fillMacros(t) {
    const s = String(t || '');
    if (!s.includes('{{')) return s;
    // у таверны есть свой разборщик макросов — он знает и остальные, не только эти два
    try {
        const sp = getContext()?.substituteParams;
        if (typeof sp === 'function') return sp(s);
    } catch (e) { /* старая сборка — ниже простая замена */ }
    const me = name1 || T('Ты');
    const ch = (getContext()?.name2) || '';
    return s.replace(/\{\{user\}\}/gi, me).replace(/\{\{char\}\}/gi, ch || T('он'));
}

function paras(t) {
    return String(fillMacros(t) || '').split(/\n{2,}|\n/).map(s => s.trim()).filter(Boolean)
        .map(s => `<p>${esc(s)}</p>`).join('');
}
function fillDossier(p) {
    const body = document.getElementById('rdg-dbody');
    if (!body) return;
    const h = heroById(p, ui.dcur);
    if (h && !h.unlocked) return renderLockedDossier(body, p, h);
    renderHeroDossier(body, p, h);
}
function renderLockedDossier(body, p, h) {
    const a = artById(p, h.art);
    body.innerHTML = `<div class="rdg-locked">
        <div class="rdg-lic">${I(G.lock, 1.5)}</div>
        <div class="rdg-lt">${T('Досье запечатано')}</div>
        <div class="rdg-ld">${T('Этот спутник ещё не выпал в Призыве. Известно только, что он ходит рядом с реликвией «')}${esc(a ? a.name : '—')}${T('» — и что мастей у него')} ${esc(h.suit ? T(h.suit) : '—')}.</div>
        <button class="rdg-btn xs gold" id="rdg-tocall">${I(G.spin)}${T('В Призыв')}</button>
    </div>`;
    document.getElementById('rdg-tocall').onclick = () => { ui.mode = 'gacha'; ui.gview = 'banner'; render(); };
}
function renderHeroDossier(body, p, h) {
    if (!h) return;
    autoFillChapters(h);
    const a = artById(p, h.art);
    const TABS = [['obzor', T('Обзор'), 'eye'], ['skills', T('Умения'), 'bolt'], ['art', T('Артефакт'), 'gem'],
    ['story', T('История'), 'book'], ['chron', T('Хроника'), 'quill'], ['card', T('Карта'), 'cardI']];
    const pips = (aw) => [1, 2, 3, 4, 5, 6].map(i => `<span class="rdg-pip ${i <= aw ? 'on' : ''}" data-a="${i}"></span>`).join('');
    body.innerHTML = `
        <div class="rdg-dhead ${h.rar !== 5 ? 'r4' : ''}">
            <div class="rdg-dbig"><div class="rdg-dcrest">${I(G.seal, 0)}</div><div class="rdg-dbin"><span class="rdg-caura" style="--e:${h.e}"></span>${h.img ? portrait(h, 'fit') : I(G.person, 1.4)}${h.imgBusy ? '<span class="rdg-pload"></span>' : ''}</div></div>
            <div class="rdg-dinfo"><div class="rdg-dnm">${esc(h.name)}</div>
                <div class="rdg-dsub"><span class="rdg-dotc" style="background:${h.e}"></span>${esc(T(h.suit))} · ${esc(h.role || '')}</div>
                <div class="rdg-dstars">${'★'.repeat(h.rar || 4)}</div>
                <div class="rdg-awaken"><span class="lbl">${T('ПРОБУЖДЕНИЕ')}</span>${pips(h.awaken || 0)}</div>
            </div></div>
        <div class="rdg-subtabs">${TABS.map(t => `<button class="rdg-stab ${ui.dtab === t[0] ? 'on' : ''}" data-t="${t[0]}">${I(G[t[2]] || G.eye)}${t[1]}</button>`).join('')}</div>
        <div class="rdg-panel" id="rdg-dpanel"></div>`;
    body.querySelectorAll('.rdg-stab').forEach(b => b.onclick = () => {
        if (ui.dtab === b.dataset.t) return;
        ui.dtab = b.dataset.t;
        renderHeroDossier(body, p, h);               // перерисовывается только досье, шапка экрана стоит
    });
    const wirePips = root => root.querySelectorAll('.rdg-pip[data-a]').forEach(el => el.onclick = () => {
        const n = +el.dataset.a;
        toast('info', n <= (h.awaken || 0) ? `${T('Пробуждение')} ${n} ${T('активно — умение усилено.')}` : `${T('Пробуждение')} ${n} ${T('закрыто: нужен дубликат «')}${h.name}${T('» из Призыва.')}`);
    });
    wirePips(body);
    const panel = document.getElementById('rdg-dpanel');

    /* ---------- УМЕНИЯ ---------- */
    if (ui.dtab === 'skills') {
        const sk = h.skills && h.skills.length ? h.skills : [];
        panel.innerHTML = `<div class="rdg-sechead">${T('ТРИ УМЕНИЯ')}</div>` +
            (sk.length ? sk.map((s, i) => `<div class="rdg-skill s${i + 1}">
                <span class="rdg-si">${I([G.fist, G.blade, G.bolt][i] || G.bolt)}</span>
                <div class="rdg-sc"><div class="rdg-st2">${esc(T(s.t))}</div><div class="rdg-sn">${esc(fillMacros(s.n))}</div><div class="rdg-sd">${esc(fillMacros(s.d))}</div></div>
            </div>`).join('') : `<div class="rdg-hint">${T('УМЕНИЯ ЕЩЁ НЕ ВЫКОВАНЫ')}</div>`) +
            `<div class="rdg-sechead" style="margin-top:14px">${T('6 ПРОБУЖДЕНИЙ · ЗА ДУБЛИКАТЫ')}</div>
             <div class="rdg-awaken cen">${pips(h.awaken || 0)}</div>
             <div class="rdg-awnote">${h.awaken || 0}${T('/6 открыто · каждое усиливает одно из умений')}</div>`;
        wirePips(panel);
    }
    /* ---------- АРТЕФАКТ ---------- */
    else if (ui.dtab === 'art' && a) {
        const lvl = a.lvl || 0, next = ART_COST[lvl + 1];
        const can = lvl < ART_MAX && p.shards >= next;
        const pct = Math.round(lvl / ART_MAX * 100);
        panel.innerHTML = `<div class="rdg-sechead">${T('УНИКАЛЬНЫЙ АРТЕФАКТ')}</div>
            <div class="rdg-artwrap">
                <div class="rdg-artcard"><div class="rdg-acin">${a.img ? portrait(a, 'fit') : ''}${filiCorners()}${a.img ? '' : I(G[a.icon] || G.gem, 1.3)}${a.imgBusy ? '<span class="rdg-pload"></span>' : ''}<div class="rdg-alv">${T('ур.')} ${lvl} / ${ART_MAX}</div></div>
                    <div class="rdg-imgrow">
                        <button class="rdg-ib" id="rdg-aimg" title="${a.img ? T('Перерисовать') : T('Нарисовать реликвию')}" ${a.imgBusy ? 'disabled' : ''}>${I(G.dice)}</button>
                        <button class="rdg-ib" id="rdg-aupl" title="${T("Своя картинка")}">${I(G.save)}</button>
                        ${a.img ? `<button class="rdg-ib del" id="rdg-adel" title="${T("Убрать")}">${I(G.x)}</button>` : ''}
                    </div></div>
                <div class="rdg-artmeta"><div class="rdg-an2">${esc(a.name)}</div><div class="rdg-al">${esc(a.desc)}</div>
                    <div class="rdg-lvbar"><i style="width:${pct}%"></i></div>
                    <div class="rdg-lvinfo"><span>${T('уровень ')}<b>${lvl}</b> / ${ART_MAX}</span><span>${T('+сила в бою и в Норе')}</span></div>
                    <div class="rdg-lvinfo"><span>${T('осколков: ')}<b>${p.shards}</b></span><span>${lvl >= ART_MAX ? T('предел') : `${T('нужно')} <b>${next}</b> ✦`}</span></div>
                    <div class="rdg-arow">
                        <button class="rdg-btn xs gold" id="rdg-aup" ${can ? '' : 'disabled'}>${I(G.gem)}${lvl >= ART_MAX ? T('Максимум') : T('Прокачать')}</button>
                        <button class="rdg-btn xs ghost" id="rdg-aregen" ${ui.busy ? 'disabled' : ''}>${I(G.seal, 0)}${T('Сменить вид/имя')}</button>
                    </div>
                </div></div>
`;
        const up = document.getElementById('rdg-aup');
        if (up) up.onclick = () => upgradeArt(a.id);
        const rg = document.getElementById('rdg-aregen');
        if (rg) rg.onclick = () => regenArtifact(a.id);
        document.getElementById('rdg-aimg').onclick = () => genArtArt(a.id);
        document.getElementById('rdg-aupl').onclick = () => pickImageFile(d => { a.img = d; saveSettings(true); render(); toast('success', T('Картинка вставлена.')); });
        const ad = document.getElementById('rdg-adel');
        if (ad) ad.onclick = () => { a.img = ''; saveSettings(true); render(); };
    }
    /* ---------- ИСТОРИЯ ---------- */
    else if (ui.dtab === 'story') {
        const ch = h.chapters || [];
        const words = t => String(t || '').trim().split(/\s+/).filter(Boolean).length;
        const thin = ch.some(c => c.x && words(c.x) < 90);
        const missingN = ch.filter(c => !c.x || !c.x.trim()).length;
        panel.innerHTML = `<div class="rdg-sechead">${T('ИСТОРИЯ · ОТКРЫВАЕТСЯ ПО ПРОБУЖДЕНИЯМ')}</div>
            <div class="rdg-imgrow wide">
                <button class="rdg-btn xs ox" id="rdg-chregen" ${ui.busy ? 'disabled' : ''}>${I(G.quill)}${ui.busy ? T('ИИ пишет…') : T('Переписать главы')}</button>
                ${missingN ? `<button class="rdg-btn xs ox" id="rdg-chfill" ${ui.busy ? 'disabled' : ''}>${I(G.quill)}${ui.busy ? T('ИИ пишет…') : T('Дописать недостающие')}</button>` : ''}
                ${thin ? '<span class="rdg-ibhint">' + T('главы вышли короткими — можно переписать') + '</span>' : ''}
            </div>
            <div class="rdg-chaps">` + (ch.length ? ch.map((c, i) => {
            const open = (h.awaken || 0) >= (c.at || 0) && !!c.x;
            return `<div class="rdg-chap ${open ? '' : 'lock'}">
                <div class="rdg-ch"><span class="rdg-chno">${STUB_ROMAN[i] || i + 1}</span>
                <span class="rdg-ct">${open ? esc(fillMacros(c.t)) : T('Закрытая глава')}</span>
                ${open ? `<span class="rdg-char2">${I(G.chev)}</span>` : `<span class="rdg-clk">${I(G.lock)}</span>`}</div>
                <div class="rdg-cb"><div class="rdg-cbin">${open ? paras(c.x) : `<span class="rdg-clocked">${c.x ? `${T('Откроется на пробуждении')} ${c.at}.` : T('Глава ещё не написана.')}</span>`}</div></div></div>`;
        }).join('') : `<div class="rdg-hint">${T('ГЛАВЫ ЭТОГО ГЕРОЯ ЕЩЁ НЕ НАПИСАНЫ')}</div>`) + `</div>`;
        panel.querySelectorAll('.rdg-chap:not(.lock) .rdg-ch').forEach(el => el.onclick = () => {
            const box = el.parentElement, was = box.classList.contains('open');
            panel.querySelectorAll('.rdg-chap.open').forEach(o => o.classList.remove('open'));
            if (!was) {
                box.classList.add('open');
                // подтянуть заголовок открытой главы к верху списка
                setTimeout(() => box.scrollIntoView({ block: 'nearest', behavior: 'smooth' }), 120);
            }
        });
        document.getElementById('rdg-chregen').onclick = () => regenChapters(h.id);
        const fillBtn = document.getElementById('rdg-chfill');
        if (fillBtn) fillBtn.onclick = () => fillMissingChapters(h.id);
    }
    /* ---------- ХРОНИКА ---------- */
    else if (ui.dtab === 'chron') {
        const mine = p.log.filter(l => Array.isArray(l.team) && l.team.includes(h.id));
        const list = mine.length ? mine : p.log;
        panel.innerHTML = `<div class="rdg-sechead">${T('ХРОНИКА НОРЫ · ПОПОЛНЯЕТСЯ ПОСЛЕ ЗАХОДОВ')}</div>
            ${mine.length ? '' : `<div class="rdg-awnote" style="text-align:left;margin:0 0 8px">${esc(h.name)} ${T('ещё не ходил вниз — пока это общая хроника')}</div>`}
            <div class="rdg-chron">${list.length ? list.map(l => `<div class="rdg-cev">
                <div class="rdg-cw">${new Date(l.ts).toLocaleDateString()} · ${l.how === 'fail' ? T('СРЫВ') : T('ВЫШЛИ')}</div>
                <div class="rdg-cx"><b>${esc(l.dungeon)}</b> — ${esc(String(l.text).replace(/^«[^»]*»:\s*/, ''))}</div></div>`).join('')
                : `<div class="rdg-hint">${T('ПОКА НИ ОДНОГО СПУСКА')}</div>`}
            <div class="rdg-more">${T('…записи добавляются автоматически по мере прохождения Норы, три последних видит ИИ в чате')}</div></div>`;
    }
    /* ---------- КАРТА W++ ---------- */
    else if (ui.dtab === 'card') {
        const loreTarget = guessBookName();
        const full = ui.cardMode === 'full', isLore = ui.cardMode === 'lore';
        const body = isLore ? (h.loreEntry || '') : (full ? (h.cardFull || '') : (h.card || ''));
        panel.innerHTML = `
            <div class="rdg-modes">
                <button class="rdg-mode ${full ? '' : 'on'}" data-m="wpp">${T('W++ · короткая')}</button>
                <button class="rdg-mode ${full ? 'on' : ''}" data-m="full">${T('Полная карта')}</button>
                <button class="rdg-mode ${ui.cardMode === 'lore' ? 'on' : ''}" data-m="lore">${T('Лорбук')}</button>
                <span class="rdg-modehint">${ui.cardMode === 'lore' ? T('запись [CHARACTER(...)] для World Info') : (full ? T('подробная карточка для SillyTavern') : T('краткая, из неё берётся портрет'))}</span>
            </div>
            <div class="rdg-wpp">
                <div class="rdg-arow tight">
                    <button class="rdg-btn xs ox" id="rdg-wgen" ${ui.busy ? 'disabled' : ''}>${I(G.quill)}${ui.busy ? T('ИИ пишет…') : (isLore ? (h.loreEntry ? T('Пересобрать') : T('Собрать запись')) : (full ? (h.cardFull ? T('Пересоздать') : T('Создать полную карту')) : T('Другой вид')))}</button>
                    <button class="rdg-btn xs ghost" id="rdg-wcopy">${I(G.cardI)}${T('Копировать')}</button>
                    <button class="rdg-btn xs gold" id="rdg-wsave">${I(G.save)}${T('Сохранить')}</button>
                    ${isLore ? `<button class="rdg-btn xs gold" id="rdg-wlore" ${ui.busy ? 'disabled' : ''}>${I(G.book)}${T('В лорбук')}${loreTarget ? ` · ${esc(loreTarget)}` : ''}</button>`
                    : `<button class="rdg-btn xs gold" id="rdg-wpng">${I(G.cardI)}${T('Скачать PNG')}</button>`}
                    <button class="rdg-ib" id="rdg-wimg" title="${h.img ? T('Перерисовать портрет') : T('Нарисовать портрет')}" ${h.imgBusy ? 'disabled' : ''}>${I(G.dice)}</button>
                    <button class="rdg-ib" id="rdg-wupl" title="${T("Своя картинка")}">${I(G.save)}</button>
                    ${h.img ? `<button class="rdg-ib del" id="rdg-wdel" title="${T("Убрать портрет")}">${I(G.x)}</button>` : ''}
                </div>
                <div class="rdg-wnote">${h.stale ? T('⚠ облик изменился — портрет устарел, стоит перерисовать') : (isLore ? T('запись обновится, если такая уже есть — дубля не будет') : (h.img ? T('портрет уйдёт в PNG вместе с картой') : T('портрета ещё нет — PNG будет с подложкой')))}</div>
                <textarea id="rdg-wtxt" spellcheck="false" placeholder="${isLore ? T('Записи ещё нет — нажми «Собрать запись»') : (full ? T('Полной карты ещё нет — нажми «Создать полную карту»') : T('ИИ ещё не написал карту'))}">${esc(body)}</textarea>
            </div>`;
        const ta = document.getElementById('rdg-wtxt');
        panel.querySelectorAll('.rdg-mode').forEach(b => b.onclick = () => {
            if (ui.cardMode === b.dataset.m) return;
            ui.cardMode = b.dataset.m;
            renderHeroDossier(document.getElementById('rdg-dbody'), p, h);
        });
        document.getElementById('rdg-wsave').onclick = () => {
            if (isLore) h.loreEntry = ta.value.slice(0, 8000);
            else if (full) h.cardFull = ta.value.slice(0, 12000);
            else h.card = ta.value.slice(0, 1200);
            saveSettings(true); toast('success', T('Сохранено ✓'));
        };
        document.getElementById('rdg-wcopy').onclick = () => {
            try { navigator.clipboard.writeText(ta.value); toast('success', T('Скопировано.')); }
            catch (e) { ta.select(); document.execCommand('copy'); }
        };
        document.getElementById('rdg-wgen').onclick = async () => {
            /* BUG FIX (аудит 2026-10, класс 2.13): текстовое поле собирается заново
               из h.* на каждом render(), а генерация вызывает render() сразу. То есть
               набранный руками, но не нажатый «Сохранить» текст исчезал в момент
               нажатия кнопки — ещё до того, как ИИ вообще ответил. Если ИИ не ответит,
               человек остаётся и без своего текста, и без нового. Фиксируем своё перед
               запросом: на успехе его всё равно заменит ответ, на отказе он на месте. */
            if (ta) {
                if (isLore) h.loreEntry = ta.value.slice(0, 8000);
                else if (full) h.cardFull = ta.value.slice(0, 12000);
                else h.card = ta.value.slice(0, 1200);
            }
            if (isLore) {
                ui.busy = true; render();
                try { h.loreEntry = await loreCardText(h); saveSettings(true); toast('success', T('Запись собрана.')); }
                catch (e) { toast('warning', e.message === 'no-key' ? T('Сначала укажи API-ключ.') : T('ИИ не ответил — попробуй ещё раз.')); }
                ui.busy = false; render();
                return;
            }
            full ? genFullCard(h.id) : regenHeroLook(h.id);
        };
        const wpng = document.getElementById('rdg-wpng');
        if (wpng) wpng.onclick = () => exportHeroPng(h.id);
        const wlore = document.getElementById('rdg-wlore');
        if (wlore) wlore.onclick = () => addToLorebook(h.id);
        document.getElementById('rdg-wimg').onclick = () => genHeroArt(h.id);
        document.getElementById('rdg-wupl').onclick = () => pickImageFile(d => { h.img = d; saveSettings(true); render(); toast('success', T('Портрет вставлен.')); });
        const wd = document.getElementById('rdg-wdel');
        if (wd) wd.onclick = () => { h.img = ''; saveSettings(true); render(); };
    }
    /* ---------- ОБЗОР ---------- */
    else {
        const loreTxt = fillMacros(h.lore || '');
        const first = loreTxt.charAt(0), rest = loreTxt.slice(1);
        panel.innerHTML = `<div class="rdg-sechead">${T('КТО ЭТО')}</div>
            <div class="rdg-imgrow wide">
                <button class="rdg-ib" id="rdg-oimg" title="${h.img ? T('Перерисовать портрет') : T('Нарисовать портрет')}" ${h.imgBusy ? 'disabled' : ''}>${I(G.dice)}</button>
                <button class="rdg-ib" id="rdg-oupl" title="${T("Своя картинка")}">${I(G.save)}</button>
                ${h.img ? `<button class="rdg-ib del" id="rdg-odel" title="${T("Убрать портрет")}">${I(G.x)}</button>` : ''}
                <span class="rdg-ibhint ${h.imgErr && !h.imgBusy ? 'bad' : ''}">${h.imgBusy ? T('ИИ рисует портрет…')
                    : (h.imgErr ? '⚠ ' + esc(h.imgErr)
                    : (h.stale ? T('⚠ облик изменился — перерисуй портрет') : (h.img ? T('портрет на месте') : T('портрета ещё нет'))))}</span>
            </div>
            <div class="rdg-lore">${first ? `<span class="rdg-drop">${esc(first)}</span>` : ''}${esc(rest)}</div>
            <div class="rdg-facts">
                <div class="rdg-fact"><div class="k">${T('РОЛЬ')}</div><div class="v">${esc(h.role || '—')}</div></div>
                <div class="rdg-fact"><div class="k">${T('ВОЗРАСТ')}</div><div class="v">${esc(h.age || '—')}</div></div>
                <div class="rdg-fact"><div class="k">${T('ВНЕШНОСТЬ')}</div><div class="v sm">${esc(h.look || '—')}</div></div>
                <div class="rdg-fact"><div class="k">${T('АРТЕФАКТ')}</div><div class="v sm">${esc(a ? a.name : '—')}</div></div>
                <div class="rdg-fact"><div class="k">${T('МАСТЬ')}</div><div class="v">${esc(h.suit ? T(h.suit) : '—')}</div></div>
                <div class="rdg-fact"><div class="k">${T('СИЛА')}</div><div class="v">${heroPower(h)}</div></div>
            </div>`;
        document.getElementById('rdg-oimg').onclick = () => genHeroArt(h.id);
        document.getElementById('rdg-oupl').onclick = () => pickImageFile(d => { h.img = d; saveSettings(true); render(); toast('success', T('Портрет вставлен.')); });
        const od = document.getElementById('rdg-odel');
        if (od) od.onclick = () => { h.img = ''; saveSettings(true); render(); };
    }
}

/* ---------- ИИ перекраивает одну реликвию / облик одного спутника ---------- */
async function regenArtifact(id) {
    const p = profile(), a = artById(p, id);
    if (!p || !a || ui.busy) return;
    ui.busy = true; render();
    const sys = `Rename and re-describe ONE artifact for this character's world. Return ONLY JSON:
{"name":"new artifact name","desc":"one vivid sentence","icon":"one of: ${ICONS.join(', ')}"}
Keep it rooted in the character card. Everything in ${genLang()}.`;
    try {
        const out = await callAI(sys, `CHARACTER CARD:\n${cardText()}\n\nCURRENT ARTIFACT: «${a.name}» — ${a.desc}\n\nGive it a new face.`, 500);
        if (out && out.name) {
            a.name = clip(out.name, 60); a.desc = clip(out.desc, 200);
            if (ICONS.includes(out.icon)) a.icon = out.icon;
            saveSettings(true);
            toast('success', T('Реликвия перекована.'));
        }
    } catch (e) {
        if (isCancel(e)) toast('info', T('Остановлено.'));
        else if (e && e.message === 'no-key') toast('warning', T('Сначала укажи API-ключ.'));
        else toast('warning', T('Кузница молчит — попробуй ещё раз.'));
    }
    ui.busy = false; render();
}
async function regenChapters(id) {
    const p = profile(), h = heroById(p, id);
    if (!p || !h || ui.busy) return;
    ui.busy = true; render();
    const sys = `Write the five story chapters for ONE companion. Return ONLY JSON:
{"chapters":[{"t":"chapter title","at":0,"x":"the chapter"},{"t":"...","at":1,"x":"..."},{"t":"...","at":2,"x":"..."},{"t":"...","at":4,"x":"..."},{"t":"...","at":6,"x":"..."}]}

- Each "x" MUST be at least 140 words — that is 2-3 full paragraphs separated by \n\n. A chapter shorter than 140 words is INVALID output and must be rewritten before you answer.
- FORBIDDEN: one-sentence chapters, plot summaries, or lines like "She gives him the toy and he is shocked". That is a synopsis. Write the actual scene, moment by moment, with dialogue.
- Write SCENES: a specific place and moment, spoken dialogue, small physical detail, what {{user}} notices. Past tense, third person, novel prose.
- Arc: at=0 first meeting, at=1 the crack in their surface, at=2 what they hide, at=4 what it costs them, at=6 the truth and what they ask of {{user}}. Each darker and closer than the last.
- LANGUAGE: chapter titles AND prose both in ${genLang()}. An English title like "The Forgotten Treasure" on a chapter written in another language is INVALID — translate the title into ${genLang()}. Check every "t" field before answering.`;
    try {
        const out = await callAI(sys, `CHARACTER CARD:\n${cardText()}\n\nCOMPANION: ${h.name} — ${h.role}\nCANON APPEARANCE (never contradict this): ${canonLine(h, 'en')}\nWHO THEY ARE: ${h.lore}\nTHEIR ARTIFACT: ${(artById(p, h.art) || {}).name || '—'}\n\nWrite their five chapters in ${genLang()}. Any physical detail you mention must match the canon appearance above.`, 6000);
        const raw = Array.isArray(out?.chapters) ? out.chapters : [];
        if (raw.length < 3) throw new Error('thin');
        h.chapters = raw.slice(0, 5).map((c, k) => ({
            t: clip(c.t, 70) || T('Глава'),
            at: Number.isFinite(+c.at) ? Math.max(0, Math.min(6, +c.at)) : [0, 1, 2, 4, 6][k],
            x: String(c.x || '').replace(/[ \t]+/g, ' ').trim().slice(0, 2200)
        }));
        saveSettings(true);
        toast('success', T('Главы переписаны.'));
    } catch (e) {
        if (isCancel(e)) toast('info', T('Остановлено.'));
        else if (e && e.message === 'no-key') toast('warning', T('Сначала укажи API-ключ.'));
        else { console.error('[Dungeons] главы', e); toast('warning', T('ИИ не ответил — попробуй ещё раз.')); }
    }
    ui.busy = false; render();
}
/* Главы догружаются по одному спутнику, когда его открывают: шесть маленьких запросов
   вместо одного огромного. Неудача запоминается, чтобы открытие досье не превратилось
   в тот же цикл повторов, из которого только что вынули ковку. */
const chapterTried = new Set();
function autoFillChapters(h) {
    if (!h || h.stub || ui.busy) return;
    if (settings.lazyChapters === false) return;
    const key = profileKey() + '|' + h.id;
    if (chapterTried.has(key)) return;
    if (!(h.chapters || []).some(c => !c.x || !c.x.trim())) return;   // всё уже написано
    const cfg = apiConf();
    if (!cfg.key || !cfg.model) return;                               // не настроено — молчим
    chapterTried.add(key);
    setTimeout(() => fillMissingChapters(h.id), 40);   // не из середины перерисовки
}

async function fillMissingChapters(id) {
    const p = profile(), h = heroById(p, id);
    if (!p || !h || ui.busy) return;
    const missing = (h.chapters || []).filter(c => !c.x || !c.x.trim());
    if (!missing.length) { toast('info', T('Недостающих глав нет — все уже написаны.')); return; }
    ui.busy = true; render();
    const need = missing.map(c => `{"at":${c.at}}`).join(', ');
    const already = (h.chapters || []).filter(c => c.x && c.x.trim())
        .map(c => `at=${c.at} "${c.t}": ${String(c.x).slice(0, 220)}…`).join('\n') || '(none yet)';
    const sys = `Write ONLY the MISSING story chapters for ONE companion — the slots listed below, nothing else. Return ONLY JSON:
{"chapters":[{"t":"chapter title","at":<the same "at" number you were given>,"x":"the chapter"}]}

- Write exactly one entry per requested "at" value — no more, no fewer, no repeats of chapters already written.
- Each "x" MUST be at least 140 words — that is 2-3 full paragraphs separated by \n\n. Shorter than that is INVALID and must be rewritten before you answer.
- FORBIDDEN: one-sentence chapters, plot summaries, or lines like "She gives him the toy and he is shocked". That is a synopsis. Write the actual scene, moment by moment, with dialogue.
- Write SCENES: a specific place and moment, spoken dialogue, small physical detail, what {{user}} notices. Past tense, third person, novel prose.
- Arc for reference: at=0 first meeting, at=1 the crack in their surface, at=2 what they hide, at=4 what it costs them, at=6 the truth and what they ask of {{user}}. Match the tone of whichever slot(s) you're filling, and stay consistent with the chapters already written below.
- LANGUAGE: chapter titles AND prose both in ${genLang()}.`;
    try {
        const out = await callAI(sys, `CHARACTER CARD:\n${cardText()}\n\nCOMPANION: ${h.name} — ${h.role}\nCANON APPEARANCE (never contradict this): ${canonLine(h, 'en')}\nWHO THEY ARE: ${h.lore}\nTHEIR ARTIFACT: ${(artById(p, h.art) || {}).name || '—'}\n\nCHAPTERS ALREADY WRITTEN (do not repeat, stay consistent with them):\n${already}\n\nMISSING SLOTS TO WRITE NOW: ${need}\n\nWrite them in ${genLang()}. Any physical detail must match the canon appearance above.`, Math.max(3000, missing.length * 1800));
        const raw = Array.isArray(out?.chapters) ? out.chapters : [];
        let filled = 0;
        for (const c of raw) {
            const at = Number.isFinite(+c.at) ? Math.max(0, Math.min(6, +c.at)) : null;
            if (at == null) continue;
            const slot = h.chapters.find(x => x.at === at);
            const x = String(c.x || '').replace(/[ \t]+/g, ' ').trim().slice(0, 2200);
            if (!slot || !x) continue;
            slot.t = clip(c.t, 70) || slot.t || T('Глава');
            slot.x = x;
            filled++;
        }
        if (!filled) throw new Error('empty');
        saveSettings(true);
        toast('success', filled < missing.length ? T('Дописаны не все главы — попробуй ещё раз для остальных.') : T('Недостающие главы дописаны.'));
    } catch (e) {
        if (isCancel(e)) toast('info', T('Остановлено.'));
        else if (e && e.message === 'no-key') toast('warning', T('Сначала укажи API-ключ.'));
        else { console.error('[Dungeons] дописать главы', e); toast('warning', T('ИИ не ответил — попробуй ещё раз.')); }
    }
    ui.busy = false; render();
}
async function regenHeroLook(id) {
    const p = profile(), h = heroById(p, id);
    if (!p || !h || ui.busy) return;
    ui.busy = true; render();
    const sys = `Re-imagine the APPEARANCE of one companion. Do not touch their name, role, gender, age, rarity or skills. Return ONLY JSON:
{"look":"new appearance, 5-9 words",
 "canon":{"skin":"complexion and features, true to where this story is set","hair":"colour + style","eyes":"colour + shape","body":"build, height, marks","clothes":"their usual outfit","scent":"how they smell"},
 "card":"their W++ card with the new appearance(), 6-8 lines"}
The "canon" object and "look" must describe the SAME person — they are the source of truth for the portrait. Keep the same gender as before, and keep them a person of the same world: "skin" must name their complexion and features consistently with their name and the story's setting, never left empty.${castNotesRule()}
Everything in ${genLang()}.`;
    try {
        const out = await callAI(sys, `CHARACTER CARD:\n${cardText()}\n\nCOMPANION: ${h.name} — ${h.role}\nCURRENT LOOK: ${h.look}\nCURRENT CARD:\n${h.card}`, 900);
        if (out && (out.look || out.card)) {
            if (out.look) h.look = clip(out.look, 120);
            if (out.canon) h.canon = {
                // перерисовка облика — тот же шанс дописать кожу тем, у кого её ещё нет
                skin: clip(out.canon.skin, 90) || clip(h.canon?.skin, 90),
                hair: clip(out.canon.hair, 80), eyes: clip(out.canon.eyes, 80),
                body: clip(out.canon.body, 120), clothes: clip(out.canon.clothes, 160), scent: clip(out.canon.scent, 80)
            };
            if (out.card) h.card = clip(String(out.card), 1200);
            h.stale = !!h.img;                       // портрет теперь от старой внешности
            saveSettings(true);
            toast('success', h.img ? T('Облик обновлён — портрет стоит перерисовать.') : T('Облик обновлён.'));
        }
    } catch (e) {
        if (isCancel(e)) toast('info', T('Остановлено.'));
        else if (e && e.message === 'no-key') toast('warning', T('Сначала укажи API-ключ.'));
        else toast('warning', T('Кузница молчит — попробуй ещё раз.'));
    }
    ui.busy = false; render();
}

/* ============================================================
   BRIDGE — other extensions may read progress and hand out tickets
   ============================================================ */
function installBridge() {
    if (typeof window === 'undefined') return;
    window.RPG = window.RPG || {};
    window.RPG.dungeons = {
        available: true, version: 2,
        getProfile: () => { const p = profile(); return p ? JSON.parse(JSON.stringify(p)) : null; },
        addTickets: (n) => { const p = profile(); if (!p || !Number.isFinite(n)) return false; p.tickets += Math.max(0, Math.floor(n)); saveSettings(true); render(); return true; },
        addShards: (n) => { const p = profile(); if (!p || !Number.isFinite(n)) return false; p.shards += Math.max(0, Math.floor(n)); saveSettings(true); render(); return true; },
        artifactPower: () => { const p = profile(); return p ? artPower(p) : 0; },
        lastRuns: (n) => { const p = profile(); return p ? p.log.slice(0, Math.max(1, n || 3)).map(l => l.text) : []; },
        open: () => openHub()
    };
}

/* ============================================================
   SETTINGS PANEL
   ============================================================ */
function settingsHtml() {
    /* Устроено как панель Линзы: короткие разделы «значок + заголовок + одна строка»,
       поля API без подписей — только подсказки внутри, связанные поля в одну строку,
       а большие и редкие разделы (портреты, ГМ-режим) свёрнуты. Все id прежние —
       к ним привязана логика в setupUI. Повторы, ожидание и счётчик расхода из панели
       убраны по просьбе: значения по умолчанию работают как раньше. */
    return `<div class="rdg-settings"><div class="inline-drawer">
        <div class="rdg-drawer-toggle inline-drawer-header" style="cursor:pointer;">
            <b><i class="fa-solid fa-carrot"></i> ${T('Кроличья нора (Данжи)')}</b><div class="inline-drawer-icon fa-solid fa-circle-chevron-down down"></div></div>
        <div class="inline-drawer-content" id="rdg-drawer" style="display:none;">
            <label class="checkbox_label"><input type="checkbox" id="rdg-enabled"><span>${T('Включить')}</span></label>

            <hr class="sysHR"><h4>🔌 API</h4>
            <small>${T('Пусто — ключ возьмётся из соседних расширений набора.')}</small>
            <input type="text" id="rdg-url" class="text_pole" placeholder="${T('URL — https://openrouter.ai/api/v1')}">
            <input type="password" id="rdg-key" class="text_pole" placeholder="${T('API-ключ')}">
            <input type="text" id="rdg-model" class="text_pole" placeholder="${T('Модель — например deepseek/deepseek-chat')}">
            <div class="rdg-slider">
                <label for="rdg-temp">${T('Температура')}</label>
                <input type="range" id="rdg-temp" min="0" max="2" step="0.1">
                <span id="rdg-tempval"></span>
            </div>
            <div class="rdg-btnrow"><div id="rdg-api-test" class="menu_button">${T('Проверить связь')}</div></div>
            <small id="rdg-apinote"></small>

            <hr class="sysHR"><h4>${T('🌐 Язык')}</h4>
            <select id="rdg-uilang" class="text_pole">
                <option value="en">English</option>
                <option value="ru">Русский</option>
            </select>
            <label class="checkbox_label"><input type="checkbox" id="rdg-splitlang"><span>${T('ИИ пишет на другом языке')}</span></label>
            <select id="rdg-lang" class="text_pole">
                <option value="ru">Русский</option>
                <option value="en">English</option>
            </select>

            <hr class="sysHR"><h4>${T('🎭 Спутники')}</h4>
            <div class="rdg-row">
                <div><label for="rdg-cast">${T('Каст')}</label>
                    <select id="rdg-cast" class="text_pole">
                        <option value="mixed">${T('Как сложится — разные люди, разный пол')}</option>
                        <option value="otome">${T('Отоме — только взрослые мужчины')}</option>
                        <option value="galge">${T('Галге — только взрослые женщины')}</option>
                    </select></div>
                <div class="rdg-narrow"><label for="rdg-ageband">${T('Возраст')}</label>
                    <select id="rdg-ageband" class="text_pole">
                        <option value="18-25">18–25</option>
                        <option value="18-32">18–32</option>
                        <option value="18-45">18–45</option>
                    </select></div>
            </div>
            <label for="rdg-castnotes">${T('Свои пожелания к касту')}</label>
            <textarea id="rdg-castnotes" class="text_pole" rows="3" placeholder="${T("мир, эпоха, внешность, имена — что угодно своими словами")}"></textarea>
            <small>${T('Применяется при ковке.')}</small>

            <hr class="sysHR"><h4>${T('🔨 При ковке мира')}</h4>
            <label class="checkbox_label"><input type="checkbox" id="rdg-auto-heroes"><span>${T('Ковать спутников (имена, лор, умения, истории)')}</span></label>
            <label class="checkbox_label"><input type="checkbox" id="rdg-lazy-ch"><span>${T('Главы по мере открытия')}</span></label>
            <label class="checkbox_label"><input type="checkbox" id="rdg-auto-art-h"><span>${T('Рисовать портреты спутников')}</span></label>
            <label class="checkbox_label"><input type="checkbox" id="rdg-auto-art-a"><span>${T('Рисовать карточки реликвий')}</span></label>
            <label class="checkbox_label"><input type="checkbox" id="rdg-auto-cards"><span>${T('Сразу писать полные карты персонажей')}</span></label>
            <label class="checkbox_label"><input type="checkbox" id="rdg-auto-lore"><span>${T('Сразу добавлять записи в лорбук')}</span></label>
            <small>${T('Снятое можно сделать позже вручную — в Досье.')}</small>

            <hr class="sysHR"><h4>${T('📖 Лорбук и карты')}</h4>
            <select id="rdg-lore-book" class="text_pole"><option value="">${T('Автоматически (лорбук персонажа или чата)')}</option></select>
            <div class="rdg-btnrow">
                <button class="menu_button" id="rdg-cards-all">${T('📜 Полные карты всем спутникам')}</button>
                <button class="menu_button" id="rdg-lore-all">${T('📖 Всех спутников в лорбук')}</button>
            </div>

            <hr class="sysHR"><h4>${T('🔊 Звук')}</h4>
            <label class="checkbox_label"><input type="checkbox" id="rdg-sound"><span>${T('Звуковые эффекты в бою и Призыве')}</span></label>

            <hr class="sysHR">
            <div class="inline-drawer rdg-sub">
                <div class="rdg-drawer-toggle inline-drawer-header" style="cursor:pointer;">
                    <b>${T('🖼️ Портреты персонажей (ИИ)')}</b><div class="inline-drawer-icon fa-solid fa-circle-chevron-down down"></div></div>
                <div class="inline-drawer-content" style="display:none;">
            <label class="checkbox_label"><input type="checkbox" id="rdg-img-on"><span>${T('Включить генерацию портретов')}</span></label>
            <label for="rdg-img-mode">${T('Тип API')}</label>
            <select id="rdg-img-mode" class="text_pole">
                <option value="auto">${T('Определить автоматически')}</option>
                <option value="openai">${T('OpenAI images (/images/generations · api.navy, SD-прокси)')}</option>
                <option value="openrouter">${T('OpenRouter / chat image (nano-banana, grok)')}</option>
                <option value="comfy">${T('ComfyUI — локально, на своей видеокарте')}</option>
            </select>
            <label for="rdg-img-url">${T('URL API картинок')}</label>
            <input id="rdg-img-url" class="text_pole" placeholder="https://api.navy/v1">
            <div class="rdg-cloudonly">
            <label for="rdg-img-key">${T('Ключ API картинок')}</label>
            <input id="rdg-img-key" class="text_pole" type="password" placeholder="sk-...">
            <label for="rdg-img-model">${T('Модель')}</label>
            <input id="rdg-img-model" class="text_pole" placeholder="${T("например flux-schnell или google/gemini-2.5-flash-image")}">
            </div>
            <div id="rdg-comfy" class="rdg-comfybox" style="display:none">
                <div class="rdg-comfyhead">
                    <span id="rdg-comfy-state" class="rdg-comfystate">${T('ещё не проверяли')}</span>
                    <button class="menu_button" id="rdg-comfy-test">${T('🔌 Проверить')}</button>
                </div>
                <label for="rdg-comfy-ckpt">${T('Модель (чекпойнт)')}</label>
                <select id="rdg-comfy-ckpt" class="text_pole"></select>
                <div class="rdg-comfyrow">
                    <div><label for="rdg-comfy-lora">${T('Лора')}</label><select id="rdg-comfy-lora" class="text_pole"></select></div>
                    <div class="rdg-comfynum"><label for="rdg-comfy-lstr">${T('Сила')}</label><input id="rdg-comfy-lstr" type="number" class="text_pole" step="0.05" min="-2" max="2"></div>
                </div>
                <div class="rdg-comfyrow">
                    <div><label for="rdg-comfy-sampler">${T('Сэмплер')}</label><select id="rdg-comfy-sampler" class="text_pole"></select></div>
                    <div><label for="rdg-comfy-sched">${T('Планировщик')}</label><select id="rdg-comfy-sched" class="text_pole"></select></div>
                </div>
                <div class="rdg-comfyrow">
                    <div class="rdg-comfynum"><label for="rdg-comfy-steps">${T('Шаги')}</label><input id="rdg-comfy-steps" type="number" class="text_pole" min="1" max="150" step="1"></div>
                    <div class="rdg-comfynum"><label for="rdg-comfy-cfg">CFG</label><input id="rdg-comfy-cfg" type="number" class="text_pole" min="1" max="30" step="0.5"></div>
                </div>
                <label class="checkbox_label"><input type="checkbox" id="rdg-comfy-hires"><span>${T('Второй проход — чётче лицо и глаза, но дольше')}</span></label>
                <label for="rdg-comfy-neg" style="display:block;margin-top:6px">${T('Негативный промпт')}</label>
                <textarea id="rdg-comfy-neg" class="text_pole" rows="2"></textarea>
                <label for="rdg-comfy-wf" style="display:block;margin-top:6px">${T('Свой воркфлоу (необязательно)')}</label>
                <textarea id="rdg-comfy-wf" class="text_pole" rows="3" placeholder="${T('Save (API Format) из ComfyUI · %prompt% %negative% %seed% %width% %height% %ckpt% %lora% %lora_strength%')}"></textarea>
            </div>
            <label for="rdg-img-size">${T('Размер (портрет 3:4)')}</label>
            <input id="rdg-img-size" class="text_pole" placeholder="768x1024">
            <label for="rdg-img-style">${T('Стиль')}</label>
            <textarea id="rdg-img-style" class="text_pole" rows="2"></textarea>
            <label for="rdg-img-htpl">${T('Промпт портрета · {NAME} {LOOK} {ROLE} {SUIT} {STYLE} {SIZE}')}</label>
            <textarea id="rdg-img-htpl" class="text_pole" rows="3"></textarea>
            <label for="rdg-img-atpl">${T('Промпт реликвии · {NAME} {DESC} {STYLE} {SIZE}')}</label>
            <textarea id="rdg-img-atpl" class="text_pole" rows="3"></textarea>
            <div class="rdg-btnrow">
                <button class="menu_button" id="rdg-img-go">${T('🎨 Нарисовать всё недостающее')}</button>
                <button class="menu_button" id="rdg-img-all">${T('Только спутников')}</button>
                <button class="menu_button" id="rdg-img-arts">${T('Только реликвии')}</button>
            </div>
                </div>
            </div>

            <div class="inline-drawer rdg-sub">
                <div class="rdg-drawer-toggle inline-drawer-header" style="cursor:pointer;">
                    <b>${T('🎲 ГМ-режим · проверка')}</b><div class="inline-drawer-icon fa-solid fa-circle-chevron-down down"></div></div>
                <div class="inline-drawer-content" style="display:none;">
                    <small>${T('Работает с открытым чатом персонажа.')}</small>
                    <div class="flex-container flexgap5" style="flex-wrap:wrap;margin-bottom:6px">
                        <button class="menu_button" id="rdg-gm-tk">${T('+10 круток')}</button>
                        <button class="menu_button" id="rdg-gm-tk50">${T('+50 круток')}</button>
                        <button class="menu_button" id="rdg-gm-sh">${T('+500 осколков')}</button>
                        <button class="menu_button" id="rdg-gm-mt">${T('+100 материалов')}</button>
                    </div>
                    <div class="flex-container flexgap5" style="flex-wrap:wrap;margin-bottom:6px">
                        <button class="menu_button" id="rdg-gm-heroes">${T('✦ Выковать спутников (ИИ)')}</button>
                        <button class="menu_button" id="rdg-gm-unlock">${T('🔓 Открыть всех героев')}</button>
                    </div>
                    <div class="flex-container flexgap5" style="flex-wrap:wrap;margin-bottom:6px">
                        <button class="menu_button" id="rdg-gm-awaken">${T('★ Пробуждение +1 всем')}</button>
                        <button class="menu_button" id="rdg-gm-maxart">${T('💎 Артефакты на максимум')}</button>
                        <button class="menu_button" id="rdg-gm-wipe">${T('🧹 Обнулить героев')}</button>
                    </div>
                    <small>${T('«Обнулить героев» стирает каст, чтобы выковать его заново. Осколки и хроника не тронутся.')}</small>
                </div>
            </div>

            <hr class="sysHR">
            <button class="menu_button" id="rdg-reforge">${T('♻ Перековать мир этого персонажа')}</button>
            <small>${T('Артефакты и норы создадутся заново, вместе с памятью этих нор. Осколки, крутки, спутники и хроника останутся.')}</small>
        </div></div></div>`;
}
/* FEATURE (by request): "Обнулить героев" / "Перековать мир" used to fire on a
   single click with no way back — a misclick could erase a whole cast's chapters
   and drawn portraits. This makes the SECOND click the one that actually commits:
   the first click just arms the button (visibly, with a plain-language warning)
   and disarms itself after a few seconds if nothing follows.
   Registered with { capture: true } so it always runs before the button's own
   jQuery .on('click', ...) handler, regardless of which was bound first. */
function armDestructive(sel, armedLabel) {
    const el = document.querySelector(sel);
    if (!el) return;
    let armed = false, timer = null;
    const orig = el.innerHTML;
    const disarm = () => { armed = false; if (timer) clearTimeout(timer); el.classList.remove('rdg-armed'); el.innerHTML = orig; };
    el.addEventListener('click', e => {
        if (armed) { disarm(); return; }                     // second click: let the real handler run
        e.preventDefault(); e.stopImmediatePropagation();     // first click: only arm, don't act yet
        armed = true;
        el.innerHTML = armedLabel;
        el.classList.add('rdg-armed');
        timer = setTimeout(disarm, 3000);
    }, true);
}
/* Перевод применяется СРАЗУ и везде: панель настроек пересобирается (иначе она
   оставалась на старом языке до перезагрузки страницы), левая колонка помечается
   на перестройку, окно перерисовывается. */
function applyLangEverywhere() {
    const open = jQuery('.rdg-settings .inline-drawer-content:visible').length > 0;
    try { setupUI(); } catch (e) { console.warn('[Dungeons] не вышло пересобрать настройки', e); }
    if (open) jQuery('#rdg-drawer').show();
    const rl = document.getElementById('rdg-rail'); if (rl) rl.removeAttribute('data-built');
    render(); ensureUI();
}
function setupUI() {
    jQuery('.rdg-settings').remove();
    jQuery('#extensions_settings').append(settingsHtml());
    jQuery('.rdg-settings .rdg-drawer-toggle').on('click', function () {
        jQuery(this).next('.inline-drawer-content').slideToggle();
        jQuery(this).find('.inline-drawer-icon').toggleClass('down up');
    });
    const num = (sel, key, min, max, dflt) => jQuery(sel).val(settings[key]).on('change', function () {
        let v = parseFloat(jQuery(this).val());
        if (!isFinite(v)) v = dflt;                       // an emptied field must not poison the setting
        v = Math.max(min, Math.min(max, v));
        settings[key] = v; jQuery(this).val(v); saveSettings();
    });
    jQuery('#rdg-enabled').prop('checked', settings.enabled).on('change', function () {
        settings.enabled = this.checked; saveSettings(); ensureUI();
    });
    jQuery('#rdg-url').val(settings.baseUrl).on('change', function () { settings.baseUrl = jQuery(this).val().trim(); saveSettings(); });
    jQuery('#rdg-key').val(settings.apiKey).on('change', function () { settings.apiKey = jQuery(this).val().trim(); saveSettings(); });
    jQuery('#rdg-model').val(settings.model).on('change', function () { settings.model = jQuery(this).val().trim(); saveSettings(); });
    num('#rdg-temp', 'temperature', 0, 2, 0.9);
    // ползунок, как в Линзе: число рядом обновляется сразу, сохраняется на отпускании
    const showTemp = () => jQuery('#rdg-tempval').text(Number(jQuery('#rdg-temp').val()).toFixed(1));
    jQuery('#rdg-temp').on('input', showTemp); showTemp();
    /* Проверка связи — через /models: это бесплатно, токены не тратятся. Заодно видно,
       откуда взят ключ, если свой не вписан, и есть ли выбранная модель у провайдера. */
    const apiNote = (txt, kind) => jQuery('#rdg-apinote').text(txt).attr('data-kind', kind || '');
    const refreshApiNote = () => {
        const c = apiConf();
        if (c.from) apiNote(`${T('Ключ взят из')} ${c.from}${c.model ? ' · ' + c.model : ''}`);
        else if (!c.key && !isLocalEndpoint(c.url)) apiNote(T('Ключа нет — впиши свой или включи соседнее расширение с ключом.'), 'bad');
        else apiNote('');
    };
    refreshApiNote();
    jQuery('#rdg-url, #rdg-key, #rdg-model').on('change', refreshApiNote);
    jQuery('#rdg-api-test').on('click', async () => {
        const c = apiConf();
        if (!c.key) { refreshApiNote(); return; }
        apiNote(T('проверяю…'), 'wait');
        const base = normalizeBase(c.url) || 'https://openrouter.ai/api/v1';
        try {
            const r = await fetch(base + '/models', { headers: { 'Authorization': `Bearer ${String(c.key).trim()}` } });
            if (r.status === 401 || r.status === 403) { apiNote(T('Ключ не подошёл.'), 'bad'); return; }
            if (!r.ok) { apiNote(`${T('Провайдер ответил')} ${r.status}.`, 'bad'); return; }
            let list = [];
            try { const j = await r.json(); list = (j?.data || j?.models || []).map(m => m?.id || m?.name || m).filter(x => typeof x === 'string'); } catch (e) { }
            const has = !c.model || !list.length || list.includes(c.model);
            apiNote(`✓ ${T('на связи')}${c.from ? ` · ${T('ключ из')} ${c.from}` : ''}${has ? '' : ` · ${T('модели')} ${c.model} ${T('у провайдера нет')}`}`, has ? 'ok' : 'bad');
        } catch (e) {
            apiNote(`${T('Не достучалась до')} ${base}`, 'bad');
        }
    });
    jQuery('#rdg-lang').val(settings.language).on('change', function () { settings.language = jQuery(this).val(); saveSettings(true); });
    /* Каст применяется при ковке. Если каст у этого персонажа уже выкован, менять
       настройку можно, но видно её станет только после перековки — говорим об этом
       сразу, иначе человек меняет и не понимает, почему ничего не произошло. */
    jQuery('#rdg-cast').val(castMode()).on('change', function () {
        settings.cast = jQuery(this).val(); saveSettings(true);
        const p = settings.profiles && settings.profiles[profileKey()];
        if (p && (p.heroes || []).some(h => h && !h.stub)) {
            toast('info', T('Запомнила. Уже выкованный каст не изменится — сотри его в ГМ-режиме и выкуй заново.'));
        }
    });
    jQuery('#rdg-ageband').val(AGE_BANDS[settings.ageBand] ? settings.ageBand : '18-32')
        .on('change', function () { settings.ageBand = jQuery(this).val(); saveSettings(true); });
    jQuery('#rdg-castnotes').val(settings.castNotes || '')
        .on('change', function () { settings.castNotes = jQuery(this).val().slice(0, 700); saveSettings(true); });
    /* BUG FIX (4.7.1). Языков было два, и оба назывались «Русский»: один переводил
       игровую панель, второй задавал язык ИИ. Понять, который за что, было нельзя, а
       панель НАСТРОЕК не переводилась ни тем, ни другим — setupUI() строит её один раз
       при запуске и на смену языка не перестраивалась, так что до F5 она оставалась
       английской при любом выборе. Отсюда и «зачем там два русских».

       Теперь язык один и отвечает за всё сразу. Разные языки для панели и для ИИ —
       это галочка, по умолчанию снятая: возможность осталась, но на виду её нет. */
    /* BUG FIX (4.9.1): the box was shown ticked only when the two languages already
       differed — but ticking it is how you GET to choose a second one. It unticked
       itself on the redraw right after the click, and the second list never appeared. */
    const splitLang = !!settings.splitLang;
    jQuery('#rdg-splitlang').prop('checked', splitLang);
    jQuery('#rdg-lang').closest('select').toggle(splitLang);
    jQuery('#rdg-lang').toggle(splitLang);
    jQuery('#rdg-uilang').val(settings.uiLang || 'en').on('change', function () {
        settings.uiLang = jQuery(this).val();
        if (!settings.splitLang) settings.language = settings.uiLang;   // один язык — значит один
        saveSettings(true);
        applyLangEverywhere();
    });
    jQuery('#rdg-splitlang').on('change', function () {
        settings.splitLang = !!this.checked;
        if (!settings.splitLang) settings.language = settings.uiLang;
        saveSettings(true);
        applyLangEverywhere();
    });
    for (const [sel, key] of [['#rdg-auto-heroes', 'autoHeroes'], ['#rdg-auto-art-h', 'autoArtHeroes'], ['#rdg-auto-art-a', 'autoArtRelics'], ['#rdg-auto-cards', 'autoCards'], ['#rdg-auto-lore', 'autoLore'], ['#rdg-lazy-ch', 'lazyChapters'], ['#rdg-sound', 'sound']]) {
        const $c = jQuery(sel);
        if (!$c.length) continue;
        $c.prop('checked', settings[key] !== undefined ? !!settings[key] : !!defaults[key]);
        $c.on('change', function () { settings[key] = !!this.checked; saveSettings(true); });
    }
    for (const [sel, key, lo, hi] of [['#rdg-retries', 'retries', 0, 5], ['#rdg-timeout', 'timeoutSec', 20, 600]]) {
        const $n = jQuery(sel);
        if (!$n.length) continue;
        $n.val(settings[key] ?? defaults[key]);
        $n.on('change', function () {
            const v = Number(this.value);
            settings[key] = Number.isFinite(v) ? Math.max(lo, Math.min(hi, v)) : defaults[key];
            this.value = settings[key];
            saveSettings(true);
        });
    }
    paintUsage();
    jQuery('#rdg-usage-reset').on('click', () => {
        tokenUse = { calls: 0, prompt: 0, completion: 0, failed: 0, retried: 0 };
        paintUsage();
    });

    (async () => {
        const $b = jQuery('#rdg-lore-book');
        if (!$b.length) return;
        const names = await listBooks();
        /* BUG FIX: список целиком заменялся названиями книг — и пункт «Автоматически»
           пропадал. В Таверне в поле показывалась первая книга, хотя в настройках стоял
           авто-выбор, а вернуть «Автоматически» было уже нельзя. Теперь он всегда первый. */
        const auto = `<option value="">${esc(T('Автоматически (лорбук персонажа или чата)'))}</option>`;
        const cur = settings.loreBook || '';
        const list = cur && !names.includes(cur) ? [cur, ...names] : names;   // выбранная книга не теряется, даже если её сейчас нет
        $b.html(auto + list.map(n => `<option value="${esc(n)}">${esc(n)}</option>`).join(''));
        $b.val(cur);
        $b.on('change', function () { settings.loreBook = this.value; saveSettings(true); });
    })();
    const ic = imgCfg();
    const bindImg = (sel, key, kind) => {
        const $e = jQuery(sel);
        if (!$e.length) return;
        if (kind === 'check') { $e.prop('checked', !!ic[key]); $e.on('change', function () { imgCfg()[key] = !!this.checked; saveSettings(true); }); }
        else { $e.val(ic[key] || ''); $e.on('input change', function () { imgCfg()[key] = this.value; saveSettings(); }); }
    };
    bindImg('#rdg-img-on', 'enabled', 'check');
    bindImg('#rdg-img-mode', 'mode');
    bindImg('#rdg-img-url', 'apiUrl');
    bindImg('#rdg-img-key', 'apiKey');
    bindImg('#rdg-img-model', 'model');
    bindImg('#rdg-img-size', 'size');
    bindImg('#rdg-img-style', 'style');
    bindImg('#rdg-img-htpl', 'heroTpl');
    bindImg('#rdg-img-atpl', 'artTpl');

    /* ---------- ComfyUI ---------- */
    const cc = comfyCfg();
    // список из ComfyUI; если ещё не загружен — хотя бы сохранённое значение, чтобы его не потерять
    const fillSel = (sel, list, cur, emptyLabel) => {
        const items = Array.isArray(list) && list.length ? list.slice() : [];
        if (cur && !items.includes(cur)) items.unshift(cur);
        const head = emptyLabel !== undefined ? `<option value="">${esc(emptyLabel)}</option>` : '';
        jQuery(sel).html(head + items.map(x => `<option value="${esc(x)}">${esc(x)}</option>`).join('')).val(cur || '');
    };
    const fillComfyLists = () => {
        const i = comfyInfoCache || {};
        fillSel('#rdg-comfy-ckpt', i.ckpts, cc.ckpt, T('первая по списку'));
        fillSel('#rdg-comfy-lora', i.loras, cc.lora, T('без лоры'));
        fillSel('#rdg-comfy-sampler', i.samplers, cc.sampler);
        fillSel('#rdg-comfy-sched', i.schedulers, cc.scheduler);
    };
    const comfyState = (txt, kind) => jQuery('#rdg-comfy-state').text(txt).attr('data-kind', kind || '');
    const comfyTest = async (quiet) => {
        comfyState(T('проверяю…'), 'wait');
        try {
            const i = await comfyInfo(true);
            fillComfyLists();
            const from = !String(imgCfg().apiUrl || '').trim() && comfyBorrowed() ? ` · ${T('адрес взят из Линзы')}` : '';
            comfyState(`✓ ${T('на связи')} · ${T('моделей')} ${i.ckpts.length} · ${T('лор')} ${i.loras.length}${from}`, 'ok');
            if (!quiet && !i.ckpts.length) toast('warning', drawErrText(comfyErr('comfy-nockpt', '')));
        } catch (e) {
            comfyState(drawErrText(e), 'bad');
            if (!quiet) toast('warning', drawErrText(e));
        }
    };
    const comfyShow = () => {
        const on = detectImageMode() === 'comfy';
        jQuery('#rdg-comfy').toggle(on);
        jQuery('.rdg-settings .rdg-cloudonly').toggle(!on);
        // в режиме ComfyUI подсказка в поле адреса — его адрес (или подсмотренный у Линзы)
        jQuery('#rdg-img-url').attr('placeholder', on ? (comfyBorrowed() || 'http://127.0.0.1:8188') : 'https://api.navy/v1');
        return on;
    };
    fillComfyLists();
    jQuery('#rdg-comfy-lstr').val(cc.loraStrength);
    jQuery('#rdg-comfy-steps').val(cc.steps);
    jQuery('#rdg-comfy-cfg').val(cc.cfg);
    jQuery('#rdg-comfy-hires').prop('checked', !!cc.hires);
    jQuery('#rdg-comfy-neg').val(cc.negative);
    jQuery('#rdg-comfy-wf').val(cc.workflow);
    const bindC = (sel, key, conv) => jQuery(sel).on('change', function () {
        const v = conv ? conv(this) : this.value;
        comfyCfg()[key] = v;
        if (conv && this.type === 'number') this.value = v;
        saveSettings(true);
    });
    const clampNum = (lo, hi, dflt) => el => { const n = Number(el.value); return Number.isFinite(n) && el.value !== '' ? Math.max(lo, Math.min(hi, n)) : dflt; };
    bindC('#rdg-comfy-ckpt', 'ckpt');
    bindC('#rdg-comfy-lora', 'lora');
    bindC('#rdg-comfy-sampler', 'sampler');
    bindC('#rdg-comfy-sched', 'scheduler');
    bindC('#rdg-comfy-lstr', 'loraStrength', clampNum(-2, 2, 0.8));
    bindC('#rdg-comfy-steps', 'steps', clampNum(1, 150, 26));
    bindC('#rdg-comfy-cfg', 'cfg', clampNum(1, 30, 6));
    bindC('#rdg-comfy-hires', 'hires', el => !!el.checked);
    bindC('#rdg-comfy-neg', 'negative', el => String(el.value).slice(0, 2000));
    jQuery('#rdg-comfy-wf').on('change', function () {
        const t = String(this.value || '').trim();
        // проверяем сразу, а не в момент рисования: ошибку легче понять, пока поле перед глазами
        if (t) { try { comfyFillCustom(t, { prompt: '', negative: '', seed: 1, w: 8, h: 8, ckpt: '' }); } catch (e) { toast('warning', drawErrText(e)); } }
        comfyCfg().workflow = t.slice(0, 60000);
        saveSettings(true);
    });
    jQuery('#rdg-comfy-test').on('click', () => comfyTest(false));
    jQuery('#rdg-img-mode, #rdg-img-url').on('change', () => { if (comfyShow() && !comfyInfoCache) comfyTest(true); });
    if (comfyShow() && comfyBaseUrl()) comfyTest(true);
    /* BUG FIX (аудит 2026-10, класс 2.1): у autoDrawAll сторож смены чата есть, а у
       этих трёх «всем сразу» его не было. Нажали «нарисовать всем», ушли в другой
       чат — цикл шёл дальше, но genHeroArt/genFullCard/addToLorebook берут профиль
       заново по id, то есть рисовали и писали УЖЕ ДРУГОМУ персонажу: деньги за то,
       чего не просили, и записи в лорбуке чужого героя. */
    const drawAll = async (list, fn, what) => {
        const p = profile();
        if (!p) { toast('info', T('Открой чат с персонажем.')); return; }
        if (!imgCfg().enabled) { toast('info', T('Сначала включи генерацию портретов.')); return; }
        const items = list(p);
        if (!items.length) { toast('info', T('Пока нечего рисовать.')); return; }
        const myKey = profileKey();
        toast('info', `${T('Рисую')} ${items.length} ${what}… ${T('это займёт время.')}`);
        for (const it of items) { if (profileKey() !== myKey) return; await fn(it.id); }
        toast('success', T('Готово.'));
    };
    jQuery('#rdg-img-go').on('click', () => {
        if (!profile()) { toast('info', T('Открой чат с персонажем.')); return; }
        if (!imgCfg().enabled) { toast('info', T('Сначала включи генерацию портретов.')); return; }
        autoDrawAll();
    });
    jQuery('#rdg-img-all').on('click', () => drawAll(p => p.heroes.filter(h => !h.img), genHeroArt, T('портретов')));
    jQuery('#rdg-img-arts').on('click', () => drawAll(p => p.artifacts.filter(a => !a.img), genArtArt, T('реликвий')));
    jQuery('#rdg-lore-all').on('click', async () => {
        const p = profile();
        if (!p) { toast('info', T('Открой чат с персонажем.')); return; }
        const list = p.heroes.filter(h => h.unlocked);
        if (!list.length) { toast('info', T('Открытых спутников пока нет.')); return; }
        const myKey = profileKey();
        for (const h of list) { if (profileKey() !== myKey) return; await addToLorebook(h.id); }
    });
    jQuery('#rdg-cards-all').on('click', async () => {
        const p = profile();
        if (!p) { toast('info', T('Открой чат с персонажем.')); return; }
        const list = p.heroes.filter(h => h.unlocked && !h.cardFull);
        if (!list.length) { toast('info', T('У всех открытых спутников карты уже есть.')); return; }
        const myKey = profileKey();
        toast('info', `${T('Пишу')} ${list.length} ${T('карт…')} ${T('это займёт время.')}`);
        for (const h of list) { if (profileKey() !== myKey) return; await genFullCard(h.id); }
        toast('success', T('Карты готовы.'));
    });
    const gm = (sel, fn, msg) => jQuery(sel).on('click', () => {
        const p = profile();
        if (!p) { toast('info', T('Открой чат с персонажем.')); return; }
        if (!p.forged) { toast('info', T('Сначала выкуй мир — открой нору.')); return; }
        if (anyBusy(p)) { toast('info', T('ИИ сейчас занят этим героем — дождись ответа.')); return; }
        fn(p);
        saveSettings(true);
        render();
        if (msg) toast('success', msg);
    });
    gm('#rdg-gm-tk', p => { p.tickets += 10; }, T('Выдано 10 круток.'));
    gm('#rdg-gm-tk50', p => { p.tickets += 50; }, T('Выдано 50 круток.'));
    gm('#rdg-gm-sh', p => { p.shards += 500; }, T('Выдано 500 осколков.'));
    gm('#rdg-gm-mt', p => { p.mats += 100; }, T('Выдано 100 материалов.'));
    gm('#rdg-gm-unlock', p => { seedHeroes(p); p.heroes.forEach(h => h.unlocked = true); }, T('Все спутники открыты — проверяй Досье.'));
    gm('#rdg-gm-awaken', p => { seedHeroes(p); p.heroes.forEach(h => { h.unlocked = true; h.awaken = Math.min(6, (h.awaken || 0) + 1); }); }, T('Пробуждение +1 — открылась следующая глава.'));
    gm('#rdg-gm-maxart', p => { p.artifacts.forEach(a => a.lvl = ART_MAX); }, T('Все реликвии на максимуме.'));
    gm('#rdg-gm-wipe', p => { p.heroes = []; p.team = []; p.pity5 = 0; p.pity4 = 0; heroForgeTried = false; heroForgeState = ''; }, T('Каст стёрт — открой Призыв, чтобы выковать заново.'));
    jQuery('#rdg-gm-heroes').on('click', () => {
        const p = profile();
        if (!p) { toast('info', T('Открой чат с персонажем.')); return; }
        if (!p.forged) { toast('info', T('Сначала выкуй мир — открой нору.')); return; }
        if (anyBusy(p)) { toast('info', T('ИИ сейчас занят этим героем — дождись ответа.')); return; }
        heroForgeTried = true;
        forgeHeroes();
    });
    jQuery('#rdg-reforge').on('click', () => {
        const p = profile();
        if (!p) { toast('info', T('Открой чат с персонажем.')); return; }
        if (anyBusy(p)) { toast('info', T('ИИ сейчас занят этим героем — дождись ответа.')); return; }
        /* BUG FIX (аудит 2026-10, класс 2.16): сбрасывались артефакты и норы, а память
           нор и глубины — нет. Новые норы получают те же id d1..d6, то есть свежая
           «Заброшенная библиотека» наследовала память старого «Подвала школы»:
           писателю сцен уходило «тут уже были 4 раза, сорвались на 7-м ходу» про
           место, которого никогда не существовало, и полоска глубины врала.
           Виток Бездны (cleared.abyss) к миру нор не относится и остаётся. */
        const abyss = p.cleared && p.cleared.abyss;
        p.forged = false; p.artifacts = []; p.dungeons = [];
        p.memory = {};
        p.cleared = abyss ? { abyss } : {};
        saveSettings(true); render();
        toast('info', T('Мир сброшен — открой нору и выкуй заново.'));
    });
    armDestructive('#rdg-gm-wipe', T('⚠ Точно? Ещё раз, чтобы стереть'));
    armDestructive('#rdg-reforge', T('⚠ Точно? Ещё раз, чтобы сбросить'));
}

/* ============================================================
   INIT
   ============================================================ */
jQuery(() => {
    loadSettings();
    /* Портреты подтягиваются из IndexedDB после старта, а не до него: панель должна
       открываться сразу, даже если база отвечает медленно. */
    hydrateImages()
        .then(n => { if (n) render(); })
        .catch(e => console.warn('[Dungeons] портреты не поднялись из хранилища', e));
    installBridge();
    let tries = 0;
    const mount = () => { if (jQuery('#extensions_settings').length) { setupUI(); return; } if (tries++ < 40) setTimeout(mount, 250); };
    mount();
    ensureUI();
    clearInjection();
    // подстраховка: событие о возврате на главный экран приходит не во всех сборках
    setInterval(() => {
        const btn = jQuery('#rdg-btn');
        if (!btn.length) return;
        const should = !!settings.enabled && inChat();
        if (btn.is(':visible') !== should) {
            btn.toggle(should);
            if (!should) closeHub();
        }
    }, 1200);

    eventSource.on(event_types.CHAT_CHANGED, () => {
        // a live run belongs to the character it started with — never carry it across
        if (run) run = null;
        ui.mode = 'nora';
        ui.gview = 'banner'; ui.gres = null; ui.dcur = ''; ui.dtab = 'obzor'; heroForgeTried = false; heroForgeState = ''; F = null; drawQueue = null;
        ui.who = ''; ui.skillFor = null;   // выбранный сон — свойство открытого чата, в новом он начинается с первого участника
        /* BUG FIX (аудит 2026-10, класс 2.15): heroForgeTried сбрасывался, а
           chapterTried — нет. Один сорвавшийся догруз глав (упал провайдер, не вписан
           ключ) запирал автодозапись для этого спутника до перезагрузки страницы,
           даже после того как ключ поправили. И сам Set рос без потолка всю сессию. */
        chapterTried.clear();
        ui.profileKey = profileKey();
        clearInjection();
        if (!inChat()) closeHub();                 // ушли на главный экран — окно закрываем вместе с кнопкой
        else if (jQuery('#rdg-modal').hasClass('rdg-open')) render();
        ensureUI();
    });
});
