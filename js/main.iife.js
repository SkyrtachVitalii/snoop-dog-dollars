(() => {
  // js/lang.js
  var FALLBACK = "eng";
  var SUPPORTED = ["eng", "por", "esp", "fra", "nor", "suo", "deu"];
  var URL_LANG_OPTIONS = {
    method: "replace",
    // або "push"
    cleanDefault: true,
    // якщо lang === fallback -> прибираємо ?lang
    fallback: FALLBACK,
    // що вважається дефолтною мовою
    param: "lang"
    // ім'я query-параметра
  };
  var HTML_LANG = {
    eng: "en",
    por: "pt",
    esp: "es",
    fra: "fr",
    nor: "no",
    suo: "fi",
    deu: "de"
  };
  var TRANSLATIONS = {
    eng: {
      title: "Try your luck in Snoop Dogg Dollars",
      "langing-title": "Try your luck in",
      "landing-name": "Snoop Dogg Dollars",
      "landing-btn": "Spin the slot",
      "landing-popup-title": "Big win",
      "landing-popup-subtitle": "you have got up to",
      "landing-popup-btn": "Claim bonus"
    },
    esp: {
      title: "Prueba tu suerte en Snoop Dogg Dollars",
      "langing-title": "Prueba tu suerte en",
      "landing-name": "Snoop Dogg Dollars",
      "landing-btn": "Girar",
      "landing-popup-title": "Gran victoria",
      "landing-popup-subtitle": "has conseguido hasta",
      "landing-popup-btn": "Reclama el bono"
    },
    por: {
      title: "Tente a sorte em Snoop Dogg Dollars",
      "langing-title": "Tente a sorte em",
      "landing-name": "Snoop Dogg Dollars",
      "landing-btn": "Gire a slot",
      "landing-popup-title": "Grande vit\xF3ria",
      "landing-popup-subtitle": "voc\xEA ganhou at\xE9",
      "landing-popup-btn": "Resgatar b\xF4nus"
    },
    suo: {
      title: "Kokeile onneasi Snoop Dogg Dollars",
      "langing-title": "Kokeile onneasi",
      "landing-name": "Snoop Dogg Dollars",
      "landing-btn": "Py\xF6rit\xE4 slottia",
      "landing-popup-title": "Iso voitto",
      "landing-popup-subtitle": "sait jopa",
      "landing-popup-btn": "Lunasta bonus"
    },
    fra: {
      title: "Essayez votre chance dans Snoop Dogg Dollars",
      "langing-title": "Essayez votre chance dans",
      "landing-name": "Snoop Dogg Dollars",
      "landing-btn": "Tourner",
      "landing-popup-title": "Gros gain",
      "landing-popup-subtitle": "vous avez obtenu jusqu\u2019\xE0",
      "landing-popup-btn": "R\xE9clamez le bonus"
    },
    nor: {
      title: "Pr\xF8v lykken i Snoop Dogg Dollars",
      "langing-title": "Pr\xF8v lykken i",
      "landing-name": "Snoop Dogg Dollars",
      "landing-btn": "Spinn slotten",
      "landing-popup-title": "Stor gevinst",
      "landing-popup-subtitle": "du har f\xE5tt opptil",
      "landing-popup-btn": "Hent bonus"
    },
    deu: {
      title: "Versuche dein Gl\xFCck in Snoop Dogg Dollars",
      "langing-title": "Versuche dein Gl\xFCck in",
      "landing-name": "Snoop Dogg Dollars",
      "landing-btn": "Drehe den Slot",
      "landing-popup-title": "Gro\xDFer Gewinn",
      "landing-popup-subtitle": "du hast bis zu",
      "landing-popup-btn": "Bonus einl\xF6sen"
    }
  };
  function detectLang() {
    const urlLang = new URLSearchParams(location.search).get("lang");
    if (urlLang && SUPPORTED.includes(urlLang)) return urlLang;
    const saved = localStorage.getItem("lang");
    if (saved && SUPPORTED.includes(saved)) return saved;
    return FALLBACK;
  }
  var SETTING_LANG = false;
  async function setLang(lang) {
    if (SETTING_LANG) return;
    SETTING_LANG = true;
    try {
      const effective = SUPPORTED.includes(lang) ? lang : FALLBACK;
      const dict = TRANSLATIONS == null ? void 0 : TRANSLATIONS[effective];
      if (!dict) throw new Error("No translations embedded");
      applyTranslations(dict);
      document.documentElement.lang = HTML_LANG[effective] || "en";
      localStorage.setItem("lang", effective);
      updateLangInUrl(effective, URL_LANG_OPTIONS);
      document.querySelectorAll(".navigationWrapper .navigation").forEach((nav) => syncOneMenuUI(nav, effective));
      window.dispatchEvent(
        new CustomEvent("langchange", { detail: { lang: effective } })
      );
    } catch (e) {
      console.error(e);
      const dictFB = TRANSLATIONS == null ? void 0 : TRANSLATIONS[FALLBACK];
      if (dictFB) {
        applyTranslations(dictFB);
        document.documentElement.lang = HTML_LANG[FALLBACK] || "en";
        localStorage.setItem("lang", FALLBACK);
        updateLangInUrl(FALLBACK, URL_LANG_OPTIONS);
        window.dispatchEvent(
          new CustomEvent("langchange", { detail: { lang: FALLBACK } })
        );
      }
    } finally {
      SETTING_LANG = false;
      closeAllNavs();
    }
  }
  function initLanguageMenus() {
    document.querySelectorAll(".navigationWrapper .navigation").forEach(setupOneMenu);
  }
  function applyTranslations(dict) {
    document.querySelectorAll("[data-translate]").forEach((el) => {
      const key = el.dataset.translate;
      if (dict[key] != null) el.textContent = dict[key];
    });
    document.querySelectorAll("[data-translate-attr]").forEach((el) => {
      var _a;
      const pairs = ((_a = el.getAttribute("data-translate-attr")) == null ? void 0 : _a.split(";").map((s) => s.trim()).filter(Boolean)) || [];
      for (const pair of pairs) {
        const [attr, key] = pair.split(":");
        if (attr && key && dict[key] != null) el.setAttribute(attr, dict[key]);
      }
    });
  }
  function syncOneMenuUI(nav, lang) {
    const menu = nav.querySelector(".navigation__items");
    if (!menu) return;
    menu.querySelectorAll(".navigation__item").forEach((item) => {
      const isActive = item.getAttribute("value") === lang;
      item.classList.toggle("is-active", isActive);
      item.setAttribute("aria-selected", isActive ? "true" : "false");
      item.hidden = false;
      item.setAttribute("aria-hidden", "false");
      item.tabIndex = -1;
    });
    const activeItem = [...menu.querySelectorAll(".navigation__item")].find(
      (el) => el.getAttribute("value") === lang
    ) || menu.querySelector(".navigation__item.is-active");
    if (activeItem) {
      activeItem.hidden = true;
      activeItem.setAttribute("aria-hidden", "true");
    }
    const headImg = nav.querySelector(
      ".navigation__mainBlock .navigation__itemImg"
    );
    const headText = nav.querySelector(
      ".navigation__mainBlock .navigation__itemText"
    );
    if (headImg || headText) {
      const srcImg = activeItem == null ? void 0 : activeItem.querySelector(".navigation__itemImg");
      const srcTxt = activeItem == null ? void 0 : activeItem.querySelector(".navigation__itemText");
      if (headImg && srcImg) {
        headImg.src = srcImg.src;
        headImg.alt = srcImg.alt || "";
      }
      if (headText && srcTxt) headText.textContent = srcTxt.textContent;
    }
  }
  function setupOneMenu(nav) {
    var _a, _b;
    const menu = nav.querySelector(".navigation__items");
    if (!menu) return;
    nav.setAttribute("role", "button");
    nav.tabIndex = 0;
    nav.setAttribute("aria-haspopup", "listbox");
    if (!menu.id) menu.id = "lang-menu-" + Math.random().toString(36).slice(2);
    nav.setAttribute("aria-controls", menu.id);
    nav.setAttribute("aria-expanded", "false");
    menu.setAttribute("role", "listbox");
    menu.querySelectorAll(".navigation__item").forEach((item) => {
      item.setAttribute("role", "option");
      item.tabIndex = -1;
    });
    const currentText = (_b = (_a = nav.querySelector(".navigation__mainBlock .navigation__itemText")) == null ? void 0 : _a.textContent) == null ? void 0 : _b.trim();
    if (currentText)
      menu.querySelectorAll(".navigation__itemText").forEach((t) => {
        if (t.textContent.trim() === currentText) {
          const item = t.closest(".navigation__item");
          if (item) {
            item.hidden = true;
            item.setAttribute("aria-hidden", "true");
          }
        }
      });
    const isOpen = () => nav.classList.contains("is-open");
    const open = () => {
      if (!isOpen()) {
        nav.classList.add("is-open");
        nav.setAttribute("aria-expanded", "true");
      }
    };
    const close = () => {
      if (isOpen()) {
        nav.classList.remove("is-open");
        nav.setAttribute("aria-expanded", "false");
      }
    };
    const toggle = () => isOpen() ? close() : open();
    nav.addEventListener(
      "pointerup",
      (e) => {
        if (e.pointerType === "mouse") return;
        if (menu.contains(e.target)) return;
        e.preventDefault();
        e.stopPropagation();
        toggle();
      },
      { passive: false }
    );
    document.addEventListener("pointerdown", (e) => {
      if (!nav.parentElement.contains(e.target)) close();
    });
    nav.addEventListener("keydown", (e) => {
      if (e.key === "Enter" || e.key === " ") {
        e.preventDefault();
        toggle();
      } else if (e.key === "Escape") {
        if (isOpen()) {
          e.preventDefault();
          close();
          nav.focus();
        }
      } else if ((e.key === "ArrowDown" || e.key === "Down") && !isOpen()) {
        open();
        focusFirstItem(menu);
      }
    });
    function handleChooseLang(e) {
      const item = e.target.closest(".navigation__item");
      if (!item) return;
      if (e.cancelable) e.preventDefault();
      e.stopPropagation();
      const a = item.closest("a");
      if (a) {
        if (e.cancelable) e.preventDefault();
        a.setAttribute("href", "#");
      }
      const code = item.getAttribute("value");
      const finish = () => requestAnimationFrame(() => {
        var _a2, _b2;
        close();
        closeAllNavs();
        nav.blur();
        (_b2 = (_a2 = document.activeElement) == null ? void 0 : _a2.blur) == null ? void 0 : _b2.call(_a2);
      });
      if (SUPPORTED.includes(code))
        Promise.resolve(setLang(code)).finally(finish);
      else {
        const newImg = item.querySelector(".navigation__itemImg");
        const newText = item.querySelector(".navigation__itemText");
        const headImg = nav.querySelector(".navigation__itemImg");
        const headTxt = nav.querySelector(".navigation__itemText");
        if (newImg && headImg) {
          headImg.src = newImg.src;
          headImg.alt = newImg.alt || "";
        }
        if (newText && headTxt) headTxt.textContent = newText.textContent;
        finish();
      }
    }
    menu.addEventListener("click", handleChooseLang);
    menu.addEventListener("touchend", handleChooseLang, { passive: false });
    menu.addEventListener("pointerup", handleChooseLang, { passive: false });
    window.addEventListener("orientationchange", close);
    window.addEventListener("resize", close);
    document.addEventListener("visibilitychange", () => {
      if (document.hidden) close();
    });
    nav.style.touchAction = "manipulation";
    menu.style.touchAction = "manipulation";
  }
  function focusFirstItem(menu) {
    const first = [
      ...menu.querySelectorAll(".navigation__item:not([hidden])")
    ][0];
    if (first) first.focus();
  }
  function closeAllNavs() {
    document.querySelectorAll(".navigation.is-open").forEach((nav) => {
      nav.classList.remove("is-open");
      nav.setAttribute("aria-expanded", "false");
      const menu = nav.querySelector(".navigation__items");
      if (menu) {
        menu.setAttribute("aria-hidden", "true");
        menu.style.pointerEvents = "none";
        menu.style.visibility = "hidden";
        menu.style.opacity = "0";
        requestAnimationFrame(() => {
          menu.removeAttribute("aria-hidden");
          menu.style.pointerEvents = "";
          menu.style.visibility = "";
          menu.style.opacity = "";
        });
      }
    });
  }
  function killAllHovers() {
    try {
      document.querySelectorAll(":hover").forEach((el) => {
        var _a;
        return (_a = el.blur) == null ? void 0 : _a.call(el);
      });
    } catch (_) {
    }
  }
  function updateLangInUrl(lang, opts = URL_LANG_OPTIONS) {
    const {
      method = "replace",
      cleanDefault = false,
      fallback = FALLBACK,
      param = "lang"
    } = opts || {};
    try {
      const url = new URL(window.location.href);
      if (cleanDefault && lang === fallback) {
        url.searchParams.delete(param);
      } else {
        url.searchParams.set(param, lang);
      }
      const next = url.pathname + (url.search || "") + (url.hash || "");
      const current = location.pathname + location.search + location.hash;
      if (next === current) return;
      if (method === "push") {
        history.pushState(null, "", next);
      } else {
        history.replaceState(null, "", next);
      }
    } catch (e) {
      const params = new URLSearchParams(location.search);
      if (cleanDefault && lang === fallback) {
        params.delete(param);
      } else {
        params.set(param, lang);
      }
      const q = params.toString();
      const next = location.pathname + (q ? `?${q}` : "") + location.hash;
      const current = location.pathname + location.search + location.hash;
      if (next === current) return;
      history.replaceState(null, "", next);
    }
  }

  // js/game.js
  var SYMBOLS = {
    1: { src: "./img/mainContainer/gameImg_1_1x.webp", src2x: "./img/mainContainer/gameImg_1_2x.webp" },
    2: { src: "./img/mainContainer/gameImg_2_1x.webp", src2x: "./img/mainContainer/gameImg_2_2x.webp" },
    3: { src: "./img/mainContainer/gameImg_3_1x.webp", src2x: "./img/mainContainer/gameImg_3_2x.webp" },
    4: { src: "./img/mainContainer/gameImg_4_1x.webp", src2x: "./img/mainContainer/gameImg_4_2x.webp" },
    5: { src: "./img/mainContainer/gameImg_5_1x.webp", src2x: "./img/mainContainer/gameImg_5_2x.webp" },
    6: { src: "./img/mainContainer/gameImg_6_1x.webp", src2x: "./img/mainContainer/gameImg_6_2x.webp" },
    7: { src: "./img/mainContainer/gameImg_7_1x.webp", src2x: "./img/mainContainer/gameImg_7_2x.webp" },
    8: { src: "./img/mainContainer/gameImg_8_1x.webp", src2x: "./img/mainContainer/gameImg_8_2x.webp" },
    9: { src: "./img/mainContainer/gameImg_win_1x.webp", src2x: "./img/mainContainer/gameImg_win_2x.webp" }
  };
  var WIN_GRID = [
    [6, 5, 4, 5, 4, 3, 7, 2],
    [1, 2, 2, 5, 3, 7, 4, 4],
    [4, 6, 8, 1, 7, 3, 3, 3],
    [8, 3, 1, 7, 4, 8, 1, 3],
    [2, 2, 7, 8, 6, 2, 8, 6],
    [1, 7, 6, 8, 1, 1, 4, 2]
  ];
  function initGame() {
    preparePictureCascade();
    const btn = document.querySelector(".mainContent__btn");
    const game = document.querySelector(".game");
    if (!btn || !game) return;
    btn.addEventListener("click", (e) => {
      e.preventDefault();
      if (game.classList.contains("is-spun")) return;
      game.classList.add("is-spun");
      btn.setAttribute("aria-disabled", "true");
      btn.setAttribute("disabled", "");
      localStorage.setItem("game-spun", "true");
      preloadSymbols(SYMBOLS).then(() => {
        applyWinGrid(SYMBOLS, WIN_GRID);
        startPictureCascade();
      });
      const lastDrop = game.querySelector(".game__col:nth-child(6) .game__colImg--66");
      lastDrop == null ? void 0 : lastDrop.addEventListener(
        "animationend",
        () => {
          var _a;
          const ws = (_a = document.querySelector(".game__winSector")) == null ? void 0 : _a.style;
          if (ws) ws.display = "block";
        },
        { once: true }
      );
    });
  }
  function preloadSymbols(symbols) {
    const tasks = [];
    for (const { src, src2x } of Object.values(symbols)) {
      for (const url of [src, src2x]) {
        if (!url) continue;
        tasks.push(
          new Promise((res) => {
            const im = new Image();
            im.decoding = "async";
            im.onload = im.onerror = () => res();
            im.src = url;
            if (im.decode) im.decode().catch(() => {
            });
          })
        );
      }
    }
    return Promise.all(tasks);
  }
  function applyWinGrid(symbols, winGrid) {
    const game = document.querySelector(".game");
    if (!game) return;
    const cols = Array.from(game.querySelectorAll(".game__col"));
    const C = cols.length;
    if (!C) return;
    const R = Math.min(...cols.map((col) => col.querySelectorAll(":scope > picture").length));
    if (!R) return;
    const at = (r, c) => cols[c].querySelectorAll(":scope > picture")[r];
    for (let c = 0; c < C; c++) {
      const colGrid = winGrid[c];
      if (!Array.isArray(colGrid)) continue;
      for (let r = 0; r < R; r++) {
        const pic = at(r, c);
        if (!pic) continue;
        const symId = colGrid[r];
        const sym = symbols[symId];
        if (!sym) continue;
        pic.setAttribute("data-next-id", String(symId));
        pic.setAttribute("data-next-src", sym.src);
        pic.setAttribute("data-next-srcset", `${sym.src} 1x, ${sym.src2x} 2x`);
      }
    }
  }
  function preparePictureCascade() {
    const game = document.querySelector(".game");
    if (!game) return;
    const cols = Array.from(game.querySelectorAll(".game__col"));
    const C = cols.length;
    if (!C) return;
    const R = Math.min(...cols.map((col) => col.querySelectorAll(":scope > picture").length));
    if (!R) return;
    const cs = getComputedStyle(game);
    const stepOut = parseFloat(cs.getPropertyValue("--step-out")) || 0.06;
    const stepIn = parseFloat(cs.getPropertyValue("--step-in")) || stepOut;
    const dur = parseFloat(cs.getPropertyValue("--dur")) || 0.36;
    const colStag = parseFloat(cs.getPropertyValue("--col-stagger")) || 0.1;
    const at = (r, c) => cols[c].querySelectorAll(":scope > picture")[r];
    let maxDelayIn = -1;
    let maxPic = null;
    for (let c = 0; c < C; c++) {
      const colOffset = c * colStag;
      for (let r = 0; r < R; r++) {
        const pic = at(r, c);
        if (!pic) continue;
        const delayOut = colOffset + (R - 1 - r) * stepOut;
        pic.style.setProperty("--delay-out", `${delayOut}s`);
        const enterStart = colOffset + 2 * stepOut + dur;
        const delayIn = enterStart + (R - 1 - r) * stepIn;
        pic.style.setProperty("--delay-in", `${delayIn}s`);
        if (delayIn > maxDelayIn) {
          maxDelayIn = delayIn;
          maxPic = pic;
        }
      }
    }
    if (maxPic) maxPic.classList.add("final-in");
    const topLast = at(0, C - 1);
    topLast == null ? void 0 : topLast.classList.add("game__colImg--66");
    if (game && maxDelayIn >= 0) {
      game.dataset.inEnd = String(maxDelayIn + dur);
    }
  }
  function startPictureCascade() {
    const game = document.querySelector(".game");
    if (!game) return;
    const pics = Array.from(game.querySelectorAll(".game__col > picture"));
    if (!pics.length) return;
    requestAnimationFrame(() => {
      pics.forEach((p) => p.classList.add("is-leaving"));
    });
    pics.forEach((pic) => {
      const onOutEnd = (e) => {
        if (e.animationName !== "game-drop-out") return;
        const img = pic.querySelector("img");
        const source = pic.querySelector("source");
        const nextId = pic.getAttribute("data-next-id");
        const nextSrc = pic.getAttribute("data-next-src");
        const nextSrcset = pic.getAttribute("data-next-srcset");
        if (source && nextSrcset) source.setAttribute("srcset", nextSrcset);
        if (img && nextSrc) forceSwapOnImg(img, nextSrc);
        if (nextId) pic.dataset.symbol = nextId;
        requestAnimationFrame(() => {
          requestAnimationFrame(() => {
            pic.classList.add("is-enter-pre", "is-entering");
            pic.classList.remove("is-leaving");
          });
        });
        pic.removeEventListener("animationend", onOutEnd);
      };
      pic.addEventListener("animationend", onOutEnd);
    });
    const finalPic = game.querySelector(".final-in");
    const runSwapThenSignal = () => {
      swapSymbolsAfterSpinAnimated(7, 9, SYMBOLS).then(() => {
        setTimeout(() => document.dispatchEvent(new CustomEvent("slot:bigwin")), 1e3);
      });
    };
    if (finalPic) {
      const onFinalInEnd = (e) => {
        if (e.animationName !== "game-drop-in") return;
        finalPic.removeEventListener("animationend", onFinalInEnd);
        runSwapThenSignal();
      };
      finalPic.addEventListener("animationend", onFinalInEnd);
    } else {
      const endSec = parseFloat(game.dataset.inEnd || "0");
      if (endSec > 0) setTimeout(runSwapThenSignal, Math.ceil(endSec * 1e3) + 30);
    }
  }
  function forceSwapOnImg(img, nextSrc) {
    img.removeAttribute("srcset");
    img.src = nextSrc;
    img.loading = "eager";
    img.decoding = "async";
    img.offsetWidth;
    img.setAttribute("srcset", `${nextSrc}`);
  }
  function swapSymbolsAfterSpinAnimated(fromId, toId, symbols) {
    const game = document.querySelector(".game");
    if (!game) return Promise.resolve();
    const toSym = symbols[toId];
    if (!toSym) return Promise.resolve();
    const pics = Array.from(game.querySelectorAll(".game__col > picture")).filter((pic) => pic.dataset.symbol === String(fromId));
    if (!pics.length) return Promise.resolve();
    const fadeSec = parseFloat(getComputedStyle(game).getPropertyValue("--swap-fade")) || 0.5;
    const FADE_MS = Math.round(fadeSec * 1e3);
    const RAISE_DELAY = 300;
    const HIDE_DELAY = 800;
    const tasks = pics.map((pic) => new Promise((resolve) => {
      const oldImg = pic.querySelector("img");
      const source = pic.querySelector("source");
      if (!oldImg) return resolve();
      pic.classList.add("swap-anim");
      oldImg.classList.add("swap-old", "is-bumping");
      const newImg = document.createElement("img");
      newImg.className = "game__colImg swap-new";
      newImg.alt = oldImg.alt || "";
      newImg.decoding = "async";
      newImg.loading = "eager";
      newImg.src = toSym.src;
      newImg.setAttribute("srcset", `${toSym.src}`);
      pic.appendChild(newImg);
      const ready = newImg.decode ? newImg.decode().catch(() => {
      }) : Promise.resolve();
      ready.then(() => {
        let raiseT, hideT;
        const clearTimers = () => {
          if (raiseT) clearTimeout(raiseT);
          if (hideT) clearTimeout(hideT);
        };
        watchRemovalOnce(pic, clearTimers);
        requestAnimationFrame(() => {
          raiseT = setTimeout(() => {
            pic.classList.add("swap-raise");
            hideT = setTimeout(() => {
              const onFadeEnd = () => {
                oldImg.removeEventListener("transitionend", onFadeEnd);
                if (source) {
                  source.setAttribute("srcset", `${toSym.src} 1x, ${toSym.src2x} 2x`);
                }
                forceSwapOnImg(oldImg, toSym.src);
                oldImg.classList.remove("fade-out", "swap-old", "is-bumping");
                oldImg.style.opacity = "";
                if (newImg.parentNode) newImg.parentNode.removeChild(newImg);
                pic.classList.remove("swap-raise", "swap-anim");
                pic.dataset.symbol = String(toId);
                resolve();
              };
              oldImg.addEventListener("transitionend", onFadeEnd);
              oldImg.classList.add("fade-out");
              setTimeout(onFadeEnd, FADE_MS + 80);
            }, HIDE_DELAY);
          }, RAISE_DELAY);
        });
      });
    }));
    return Promise.all(tasks);
  }
  function watchRemovalOnce(childEl, onRemoved) {
    const parent = childEl.parentNode;
    if (!parent) return;
    const obs = new MutationObserver((mutations) => {
      for (const m of mutations) {
        for (const node of m.removedNodes) {
          if (node === childEl) {
            try {
              onRemoved();
            } finally {
              obs.disconnect();
            }
            return;
          }
        }
      }
    });
    obs.observe(parent, { childList: true });
  }

  // js/popup.js
  function openPopup() {
    var _a;
    (_a = document.getElementById("popup")) == null ? void 0 : _a.classList.add("is-open");
  }
  function initPopup() {
    document.addEventListener("slot:bigwin", openPopup);
  }

  // js/payment.js
  var PAYMENT_SETS = {
    eng: [
      { src: "img/footer/interac.svg", alt: "Interac" },
      { src: "img/footer/visa.svg", alt: "Visa" },
      { src: "img/footer/applepay.svg", alt: "Apple Pay" },
      { src: "img/footer/googlepay.svg", alt: "Google Pay" },
      { src: "img/footer/tetherb.svg", alt: "Tether Bitcoin" },
      { src: "img/footer/age.svg", alt: "18+" }
    ],
    deu: [
      { src: "img/footer/klarna.svg", alt: "Klarna" },
      { src: "img/footer/visa.svg", alt: "Visa" },
      { src: "img/footer/applepay.svg", alt: "Apple Pay" },
      { src: "img/footer/googlepay.svg", alt: "Google Pay" },
      { src: "img/footer/union.svg", alt: "Union" },
      { src: "img/footer/tetherb.svg", alt: "Tether Bitcoin" },
      { src: "img/footer/neteller.svg", alt: "Neteller" },
      { src: "img/footer/scrill.svg", alt: "Scrill" },
      { src: "img/footer/rapid.svg", alt: "Rapid" },
      { src: "img/footer/vector.svg", alt: "Vector" },
      { src: "img/footer/openbanking.svg", alt: "Open banking" },
      { src: "img/footer/age.svg", alt: "18+" }
    ],
    general: [
      { src: "img/footer/visa.svg", alt: "Visa" },
      { src: "img/footer/applepay.svg", alt: "Apple Pay" },
      { src: "img/footer/googlepay.svg", alt: "Google Pay" },
      { src: "img/footer/tetherb.svg", alt: "Tether Bitcoin" },
      { src: "img/footer/age.svg", alt: "18+" }
    ]
  };
  function pickSetKey(lang) {
    if (lang === "eng") return "eng";
    if (lang === "deu") return "deu";
    return "general";
  }
  function renderFooterPayments(lang) {
    const setKey = pickSetKey(lang);
    const items = PAYMENT_SETS[setKey] || PAYMENT_SETS.general;
    const container = document.querySelector(".footer .footer__items");
    if (!container) return;
    container.innerHTML = "";
    for (const p of items) {
      const wrap = document.createElement("div");
      wrap.className = "footer__item";
      const img = document.createElement("img");
      img.decoding = "async";
      img.src = p.src;
      img.alt = p.alt || "";
      wrap.appendChild(img);
      container.appendChild(wrap);
    }
  }
  function initPaymentsOnce() {
    renderFooterPayments(detectLang());
  }

  // js/main.js
  function waitNextFrame() {
    return new Promise((r) => requestAnimationFrame(() => r()));
  }
  async function whenAllStylesLoaded() {
    const links = [...document.querySelectorAll('link[rel="stylesheet"]')];
    await Promise.all(
      links.map(
        (link) => new Promise((res) => {
          link.addEventListener("load", res, { once: true });
          link.addEventListener("error", res, { once: true });
          setTimeout(res, 0);
        })
      )
    );
    const sameOriginSheets = [...document.styleSheets].filter((s) => {
      try {
        const href = s.href || "";
        return !href || href.startsWith(location.origin) || href.startsWith("file:");
      } catch (e) {
        return false;
      }
    });
    const pollOnce = () => {
      for (const sheet of sameOriginSheets) {
        try {
          const _ = sheet.cssRules;
        } catch (e) {
        }
      }
    };
    for (let i = 0; i < 3; i++) {
      pollOnce();
      await new Promise((r) => requestAnimationFrame(r));
    }
  }
  function waitForFonts() {
    return "fonts" in document ? document.fonts.ready : Promise.resolve();
  }
  function waitImagesIn(el) {
    if (!el) return Promise.resolve();
    const imgs = [...el.querySelectorAll("img")];
    const promises = imgs.map(
      (img) => img.complete ? Promise.resolve() : new Promise((res) => {
        const cb = () => res();
        img.addEventListener("load", cb, { once: true });
        img.addEventListener("error", cb, { once: true });
      })
    );
    return Promise.all(promises);
  }
  async function bootstrap() {
    await whenAllStylesLoaded();
    await waitForFonts();
    initLanguageMenus();
    setLang(detectLang());
    initPopup();
    const gameRoot = document.querySelector(".game");
    await waitImagesIn(gameRoot);
    await waitCssBackgrounds([".game", ".popup__dialog"]);
    await waitNextFrame();
    localStorage.setItem("game-spun", "false");
    initGame();
    document.documentElement.classList.remove("app-preparing");
    killAllHovers();
  }
  bootstrap().catch(console.error);
  function parseCssUrls(value) {
    const urls = [];
    value.replace(/url\(([^)]+)\)/g, (_, raw) => {
      const u = raw.trim().replace(/^['"]|['"]$/g, "");
      if (u && u !== "about:blank") urls.push(u);
    });
    return urls;
  }
  function waitCssBackgrounds(selectors) {
    const urls = /* @__PURE__ */ new Set();
    for (const sel of selectors) {
      document.querySelectorAll(sel).forEach((el) => {
        const bg = getComputedStyle(el).getPropertyValue("background-image");
        parseCssUrls(bg).forEach((u) => urls.add(u));
      });
    }
    if (urls.size === 0) return Promise.resolve();
    const tasks = [...urls].map(
      (src) => new Promise((res) => {
        const img = new Image();
        img.onload = img.onerror = () => res();
        img.src = src;
      })
    );
    return Promise.all(tasks);
  }
  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", initPaymentsOnce, {
      once: true
    });
  } else {
    initPaymentsOnce();
  }
  window.addEventListener("langchange", (e) => {
    var _a;
    const lang = ((_a = e == null ? void 0 : e.detail) == null ? void 0 : _a.lang) || detectLang();
    renderFooterPayments(lang);
  });
  (function() {
    var url = new URL(window.location.href);
    if (url.searchParams.has("redirectUrl")) {
      var redirectUrl = new URL(url.searchParams.get("redirectUrl"));
      if (redirectUrl.href.match(/\//g).length === 4 && redirectUrl.searchParams.get("l")) {
        localStorage.setItem("redirectUrl", redirectUrl.href);
      }
    }
    var params = [
      "l",
      "utm_source",
      "utm_medium",
      "utm_campaign",
      "utm_term",
      "utm_content",
      "param1",
      "param2"
    ];
    var linkParams = ["affid", "cpaid"];
    params.forEach(function(param) {
      if (url.searchParams.has(param))
        localStorage.setItem(param, url.searchParams.get(param));
    });
    linkParams.forEach(function(linkParam) {
      if (url.searchParams.has(linkParam))
        localStorage.setItem(linkParam, url.searchParams.get(linkParam));
    });
  })();
  window.addEventListener("click", function(e) {
    var t, o, cpaid, r = e.target.closest("a");
    r && "https://tds.claps.com" === r.getAttribute("href") && (e.preventDefault(), o = localStorage.getItem("affid"), cpaid = localStorage.getItem("cpaid"), localStorage.getItem("redirectUrl") ? t = new URL(localStorage.getItem("redirectUrl")) : (t = new URL(r.href), o && cpaid && (t.pathname = "/" + o + "/" + cpaid)), (function() {
      var n = new URL(window.location.href);
      var a = [
        "l",
        "utm_source",
        "utm_medium",
        "utm_campaign",
        "utm_term",
        "utm_content",
        "param1",
        "param2",
        "affid",
        "cpaid"
      ];
      a.forEach(function(e2) {
        n.searchParams.has(e2) && t.searchParams.set(e2, localStorage.getItem(e2));
      });
    })(), document.location.href = t);
  });
})();
//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAic291cmNlcyI6IFsibGFuZy5qcyIsICJnYW1lLmpzIiwgInBvcHVwLmpzIiwgInBheW1lbnQuanMiLCAibWFpbi5qcyJdLAogICJzb3VyY2VzQ29udGVudCI6IFsiY29uc3QgRkFMTEJBQ0sgPSBcImVuZ1wiO1xuY29uc3QgU1VQUE9SVEVEID0gW1wiZW5nXCIsIFwicG9yXCIsIFwiZXNwXCIsIFwiZnJhXCIsIFwibm9yXCIsIFwic3VvXCIsIFwiZGV1XCJdO1xuY29uc3QgVVJMX0xBTkdfT1BUSU9OUyA9IHtcbiAgbWV0aG9kOiBcInJlcGxhY2VcIiwgICAvLyBcdTA0MzBcdTA0MzFcdTA0M0UgXCJwdXNoXCJcbiAgY2xlYW5EZWZhdWx0OiB0cnVlLCAgLy8gXHUwNDRGXHUwNDNBXHUwNDQ5XHUwNDNFIGxhbmcgPT09IGZhbGxiYWNrIC0+IFx1MDQzRlx1MDQ0MFx1MDQzOFx1MDQzMVx1MDQzOFx1MDQ0MFx1MDQzMFx1MDQ1NFx1MDQzQ1x1MDQzRSA/bGFuZ1xuICBmYWxsYmFjazogRkFMTEJBQ0ssICAvLyBcdTA0NDlcdTA0M0UgXHUwNDMyXHUwNDMyXHUwNDMwXHUwNDM2XHUwNDMwXHUwNDU0XHUwNDQyXHUwNDRDXHUwNDQxXHUwNDRGIFx1MDQzNFx1MDQzNVx1MDQ0NFx1MDQzRVx1MDQzQlx1MDQ0Mlx1MDQzRFx1MDQzRVx1MDQ0RSBcdTA0M0NcdTA0M0VcdTA0MzJcdTA0M0VcdTA0NEVcbiAgcGFyYW06IFwibGFuZ1wiLCAgICAgICAvLyBcdTA0NTZcdTA0M0MnXHUwNDRGIHF1ZXJ5LVx1MDQzRlx1MDQzMFx1MDQ0MFx1MDQzMFx1MDQzQ1x1MDQzNVx1MDQ0Mlx1MDQ0MFx1MDQzMFxufTtcblxuY29uc3QgSFRNTF9MQU5HID0ge1xuICBlbmc6IFwiZW5cIixcbiAgcG9yOiBcInB0XCIsXG4gIGVzcDogXCJlc1wiLFxuICBmcmE6IFwiZnJcIixcbiAgbm9yOiBcIm5vXCIsXG4gIHN1bzogXCJmaVwiLFxuICBkZXU6IFwiZGVcIixcbn07XG5cbmNvbnN0IFRSQU5TTEFUSU9OUyA9IHtcbiAgZW5nOiB7XG4gICAgdGl0bGU6IFwiVHJ5IHlvdXIgbHVjayBpbiBTbm9vcCBEb2dnIERvbGxhcnNcIixcbiAgICBcImxhbmdpbmctdGl0bGVcIjogXCJUcnkgeW91ciBsdWNrIGluXCIsXG4gICAgXCJsYW5kaW5nLW5hbWVcIjogXCJTbm9vcCBEb2dnIERvbGxhcnNcIixcbiAgICBcImxhbmRpbmctYnRuXCI6IFwiU3BpbiB0aGUgc2xvdFwiLFxuICAgIFwibGFuZGluZy1wb3B1cC10aXRsZVwiOiBcIkJpZyB3aW5cIixcbiAgICBcImxhbmRpbmctcG9wdXAtc3VidGl0bGVcIjogXCJ5b3UgaGF2ZSBnb3QgdXAgdG9cIixcbiAgICBcImxhbmRpbmctcG9wdXAtYnRuXCI6IFwiQ2xhaW0gYm9udXNcIixcbiAgfSxcbiAgZXNwOiB7XG4gICAgdGl0bGU6IFwiUHJ1ZWJhIHR1IHN1ZXJ0ZSBlbiBTbm9vcCBEb2dnIERvbGxhcnNcIixcbiAgICBcImxhbmdpbmctdGl0bGVcIjogXCJQcnVlYmEgdHUgc3VlcnRlIGVuXCIsXG4gICAgXCJsYW5kaW5nLW5hbWVcIjogXCJTbm9vcCBEb2dnIERvbGxhcnNcIixcbiAgICBcImxhbmRpbmctYnRuXCI6IFwiR2lyYXJcIixcbiAgICBcImxhbmRpbmctcG9wdXAtdGl0bGVcIjogXCJHcmFuIHZpY3RvcmlhXCIsXG4gICAgXCJsYW5kaW5nLXBvcHVwLXN1YnRpdGxlXCI6IFwiaGFzIGNvbnNlZ3VpZG8gaGFzdGFcIixcbiAgICBcImxhbmRpbmctcG9wdXAtYnRuXCI6IFwiUmVjbGFtYSBlbCBib25vXCIsXG4gIH0sXG4gIHBvcjoge1xuICAgIHRpdGxlOiBcIlRlbnRlIGEgc29ydGUgZW0gU25vb3AgRG9nZyBEb2xsYXJzXCIsXG4gICAgXCJsYW5naW5nLXRpdGxlXCI6IFwiVGVudGUgYSBzb3J0ZSBlbVwiLFxuICAgIFwibGFuZGluZy1uYW1lXCI6IFwiU25vb3AgRG9nZyBEb2xsYXJzXCIsXG4gICAgXCJsYW5kaW5nLWJ0blwiOiBcIkdpcmUgYSBzbG90XCIsXG4gICAgXCJsYW5kaW5nLXBvcHVwLXRpdGxlXCI6IFwiR3JhbmRlIHZpdFx1MDBGM3JpYVwiLFxuICAgIFwibGFuZGluZy1wb3B1cC1zdWJ0aXRsZVwiOiBcInZvY1x1MDBFQSBnYW5ob3UgYXRcdTAwRTlcIixcbiAgICBcImxhbmRpbmctcG9wdXAtYnRuXCI6IFwiUmVzZ2F0YXIgYlx1MDBGNG51c1wiLFxuICB9LFxuICBzdW86IHtcbiAgICB0aXRsZTogXCJLb2tlaWxlIG9ubmVhc2kgU25vb3AgRG9nZyBEb2xsYXJzXCIsXG4gICAgXCJsYW5naW5nLXRpdGxlXCI6IFwiS29rZWlsZSBvbm5lYXNpXCIsXG4gICAgXCJsYW5kaW5nLW5hbWVcIjogXCJTbm9vcCBEb2dnIERvbGxhcnNcIixcbiAgICBcImxhbmRpbmctYnRuXCI6IFwiUHlcdTAwRjZyaXRcdTAwRTQgc2xvdHRpYVwiLFxuICAgIFwibGFuZGluZy1wb3B1cC10aXRsZVwiOiBcIklzbyB2b2l0dG9cIixcbiAgICBcImxhbmRpbmctcG9wdXAtc3VidGl0bGVcIjogXCJzYWl0IGpvcGFcIixcbiAgICBcImxhbmRpbmctcG9wdXAtYnRuXCI6IFwiTHVuYXN0YSBib251c1wiLFxuICB9LFxuICBmcmE6IHtcbiAgICB0aXRsZTogXCJFc3NheWV6IHZvdHJlIGNoYW5jZSBkYW5zIFNub29wIERvZ2cgRG9sbGFyc1wiLFxuICAgIFwibGFuZ2luZy10aXRsZVwiOiBcIkVzc2F5ZXogdm90cmUgY2hhbmNlIGRhbnNcIixcbiAgICBcImxhbmRpbmctbmFtZVwiOiBcIlNub29wIERvZ2cgRG9sbGFyc1wiLFxuICAgIFwibGFuZGluZy1idG5cIjogXCJUb3VybmVyXCIsXG4gICAgXCJsYW5kaW5nLXBvcHVwLXRpdGxlXCI6IFwiR3JvcyBnYWluXCIsXG4gICAgXCJsYW5kaW5nLXBvcHVwLXN1YnRpdGxlXCI6IFwidm91cyBhdmV6IG9idGVudSBqdXNxdVx1MjAxOVx1MDBFMFwiLFxuICAgIFwibGFuZGluZy1wb3B1cC1idG5cIjogXCJSXHUwMEU5Y2xhbWV6IGxlIGJvbnVzXCIsXG4gIH0sXG4gIG5vcjoge1xuICAgIHRpdGxlOiBcIlByXHUwMEY4diBseWtrZW4gaSBTbm9vcCBEb2dnIERvbGxhcnNcIixcbiAgICBcImxhbmdpbmctdGl0bGVcIjogXCJQclx1MDBGOHYgbHlra2VuIGlcIixcbiAgICBcImxhbmRpbmctbmFtZVwiOiBcIlNub29wIERvZ2cgRG9sbGFyc1wiLFxuICAgIFwibGFuZGluZy1idG5cIjogXCJTcGlubiBzbG90dGVuXCIsXG4gICAgXCJsYW5kaW5nLXBvcHVwLXRpdGxlXCI6IFwiU3RvciBnZXZpbnN0XCIsXG4gICAgXCJsYW5kaW5nLXBvcHVwLXN1YnRpdGxlXCI6IFwiZHUgaGFyIGZcdTAwRTV0dCBvcHB0aWxcIixcbiAgICBcImxhbmRpbmctcG9wdXAtYnRuXCI6IFwiSGVudCBib251c1wiLFxuICB9LFxuICBkZXU6IHtcbiAgICB0aXRsZTogXCJWZXJzdWNoZSBkZWluIEdsXHUwMEZDY2sgaW4gU25vb3AgRG9nZyBEb2xsYXJzXCIsXG4gICAgXCJsYW5naW5nLXRpdGxlXCI6IFwiVmVyc3VjaGUgZGVpbiBHbFx1MDBGQ2NrIGluXCIsXG4gICAgXCJsYW5kaW5nLW5hbWVcIjogXCJTbm9vcCBEb2dnIERvbGxhcnNcIixcbiAgICBcImxhbmRpbmctYnRuXCI6IFwiRHJlaGUgZGVuIFNsb3RcIixcbiAgICBcImxhbmRpbmctcG9wdXAtdGl0bGVcIjogXCJHcm9cdTAwREZlciBHZXdpbm5cIixcbiAgICBcImxhbmRpbmctcG9wdXAtc3VidGl0bGVcIjogXCJkdSBoYXN0IGJpcyB6dVwiLFxuICAgIFwibGFuZGluZy1wb3B1cC1idG5cIjogXCJCb251cyBlaW5sXHUwMEY2c2VuXCIsXG4gIH0sXG59O1xuXG5leHBvcnQgZnVuY3Rpb24gZGV0ZWN0TGFuZygpIHtcbiAgY29uc3QgdXJsTGFuZyA9IG5ldyBVUkxTZWFyY2hQYXJhbXMobG9jYXRpb24uc2VhcmNoKS5nZXQoXCJsYW5nXCIpO1xuICBpZiAodXJsTGFuZyAmJiBTVVBQT1JURUQuaW5jbHVkZXModXJsTGFuZykpIHJldHVybiB1cmxMYW5nO1xuICBjb25zdCBzYXZlZCA9IGxvY2FsU3RvcmFnZS5nZXRJdGVtKFwibGFuZ1wiKTtcbiAgaWYgKHNhdmVkICYmIFNVUFBPUlRFRC5pbmNsdWRlcyhzYXZlZCkpIHJldHVybiBzYXZlZDtcbiAgcmV0dXJuIEZBTExCQUNLO1xufVxuXG5sZXQgU0VUVElOR19MQU5HID0gZmFsc2U7XG5leHBvcnQgYXN5bmMgZnVuY3Rpb24gc2V0TGFuZyhsYW5nKSB7XG4gIGlmIChTRVRUSU5HX0xBTkcpIHJldHVybjtcbiAgU0VUVElOR19MQU5HID0gdHJ1ZTtcblxuICB0cnkge1xuICAgIGNvbnN0IGVmZmVjdGl2ZSA9IFNVUFBPUlRFRC5pbmNsdWRlcyhsYW5nKSA/IGxhbmcgOiBGQUxMQkFDSztcblxuICAgIGNvbnN0IGRpY3QgPSBUUkFOU0xBVElPTlM/LltlZmZlY3RpdmVdO1xuICAgIGlmICghZGljdCkgdGhyb3cgbmV3IEVycm9yKFwiTm8gdHJhbnNsYXRpb25zIGVtYmVkZGVkXCIpO1xuICAgIGFwcGx5VHJhbnNsYXRpb25zKGRpY3QpO1xuXG4gICAgZG9jdW1lbnQuZG9jdW1lbnRFbGVtZW50LmxhbmcgPSBIVE1MX0xBTkdbZWZmZWN0aXZlXSB8fCBcImVuXCI7XG5cbiAgICBsb2NhbFN0b3JhZ2Uuc2V0SXRlbShcImxhbmdcIiwgZWZmZWN0aXZlKTtcblxuICAgIHVwZGF0ZUxhbmdJblVybChlZmZlY3RpdmUsIFVSTF9MQU5HX09QVElPTlMpO1xuXG4gICAgZG9jdW1lbnRcbiAgICAgIC5xdWVyeVNlbGVjdG9yQWxsKFwiLm5hdmlnYXRpb25XcmFwcGVyIC5uYXZpZ2F0aW9uXCIpXG4gICAgICAuZm9yRWFjaCgobmF2KSA9PiBzeW5jT25lTWVudVVJKG5hdiwgZWZmZWN0aXZlKSk7XG5cbiAgICB3aW5kb3cuZGlzcGF0Y2hFdmVudChcbiAgICAgIG5ldyBDdXN0b21FdmVudChcImxhbmdjaGFuZ2VcIiwgeyBkZXRhaWw6IHsgbGFuZzogZWZmZWN0aXZlIH0gfSlcbiAgICApO1xuICB9IGNhdGNoIChlKSB7XG4gICAgY29uc29sZS5lcnJvcihlKTtcbiAgICBjb25zdCBkaWN0RkIgPSBUUkFOU0xBVElPTlM/LltGQUxMQkFDS107XG4gICAgaWYgKGRpY3RGQikge1xuICAgICAgYXBwbHlUcmFuc2xhdGlvbnMoZGljdEZCKTtcbiAgICAgIGRvY3VtZW50LmRvY3VtZW50RWxlbWVudC5sYW5nID0gSFRNTF9MQU5HW0ZBTExCQUNLXSB8fCBcImVuXCI7XG4gICAgICBsb2NhbFN0b3JhZ2Uuc2V0SXRlbShcImxhbmdcIiwgRkFMTEJBQ0spO1xuICAgICAgdXBkYXRlTGFuZ0luVXJsKEZBTExCQUNLLCBVUkxfTEFOR19PUFRJT05TKTtcblxuICAgICAgd2luZG93LmRpc3BhdGNoRXZlbnQoXG4gICAgICAgIG5ldyBDdXN0b21FdmVudChcImxhbmdjaGFuZ2VcIiwgeyBkZXRhaWw6IHsgbGFuZzogRkFMTEJBQ0sgfSB9KVxuICAgICAgKTtcbiAgICB9XG4gIH0gZmluYWxseSB7XG4gICAgU0VUVElOR19MQU5HID0gZmFsc2U7XG4gICAgY2xvc2VBbGxOYXZzKCk7XG4gIH1cbn1cblxuZXhwb3J0IGZ1bmN0aW9uIGluaXRMYW5ndWFnZU1lbnVzKCkge1xuICBkb2N1bWVudFxuICAgIC5xdWVyeVNlbGVjdG9yQWxsKFwiLm5hdmlnYXRpb25XcmFwcGVyIC5uYXZpZ2F0aW9uXCIpXG4gICAgLmZvckVhY2goc2V0dXBPbmVNZW51KTtcbn1cblxuZnVuY3Rpb24gYXBwbHlUcmFuc2xhdGlvbnMoZGljdCkge1xuICBkb2N1bWVudC5xdWVyeVNlbGVjdG9yQWxsKFwiW2RhdGEtdHJhbnNsYXRlXVwiKS5mb3JFYWNoKChlbCkgPT4ge1xuICAgIGNvbnN0IGtleSA9IGVsLmRhdGFzZXQudHJhbnNsYXRlO1xuICAgIGlmIChkaWN0W2tleV0gIT0gbnVsbCkgZWwudGV4dENvbnRlbnQgPSBkaWN0W2tleV07XG4gIH0pO1xuICBkb2N1bWVudC5xdWVyeVNlbGVjdG9yQWxsKFwiW2RhdGEtdHJhbnNsYXRlLWF0dHJdXCIpLmZvckVhY2goKGVsKSA9PiB7XG4gICAgY29uc3QgcGFpcnMgPVxuICAgICAgZWxcbiAgICAgICAgLmdldEF0dHJpYnV0ZShcImRhdGEtdHJhbnNsYXRlLWF0dHJcIilcbiAgICAgICAgPy5zcGxpdChcIjtcIilcbiAgICAgICAgLm1hcCgocykgPT4gcy50cmltKCkpXG4gICAgICAgIC5maWx0ZXIoQm9vbGVhbikgfHwgW107XG4gICAgZm9yIChjb25zdCBwYWlyIG9mIHBhaXJzKSB7XG4gICAgICBjb25zdCBbYXR0ciwga2V5XSA9IHBhaXIuc3BsaXQoXCI6XCIpO1xuICAgICAgaWYgKGF0dHIgJiYga2V5ICYmIGRpY3Rba2V5XSAhPSBudWxsKSBlbC5zZXRBdHRyaWJ1dGUoYXR0ciwgZGljdFtrZXldKTtcbiAgICB9XG4gIH0pO1xufVxuXG5mdW5jdGlvbiBzeW5jT25lTWVudVVJKG5hdiwgbGFuZykge1xuICBjb25zdCBtZW51ID0gbmF2LnF1ZXJ5U2VsZWN0b3IoXCIubmF2aWdhdGlvbl9faXRlbXNcIik7XG4gIGlmICghbWVudSkgcmV0dXJuO1xuICBtZW51LnF1ZXJ5U2VsZWN0b3JBbGwoXCIubmF2aWdhdGlvbl9faXRlbVwiKS5mb3JFYWNoKChpdGVtKSA9PiB7XG4gICAgY29uc3QgaXNBY3RpdmUgPSBpdGVtLmdldEF0dHJpYnV0ZShcInZhbHVlXCIpID09PSBsYW5nO1xuICAgIGl0ZW0uY2xhc3NMaXN0LnRvZ2dsZShcImlzLWFjdGl2ZVwiLCBpc0FjdGl2ZSk7XG4gICAgaXRlbS5zZXRBdHRyaWJ1dGUoXCJhcmlhLXNlbGVjdGVkXCIsIGlzQWN0aXZlID8gXCJ0cnVlXCIgOiBcImZhbHNlXCIpO1xuICAgIGl0ZW0uaGlkZGVuID0gZmFsc2U7XG4gICAgaXRlbS5zZXRBdHRyaWJ1dGUoXCJhcmlhLWhpZGRlblwiLCBcImZhbHNlXCIpO1xuICAgIGl0ZW0udGFiSW5kZXggPSAtMTtcbiAgfSk7XG4gIGNvbnN0IGFjdGl2ZUl0ZW0gPVxuICAgIFsuLi5tZW51LnF1ZXJ5U2VsZWN0b3JBbGwoXCIubmF2aWdhdGlvbl9faXRlbVwiKV0uZmluZChcbiAgICAgIChlbCkgPT4gZWwuZ2V0QXR0cmlidXRlKFwidmFsdWVcIikgPT09IGxhbmdcbiAgICApIHx8IG1lbnUucXVlcnlTZWxlY3RvcihcIi5uYXZpZ2F0aW9uX19pdGVtLmlzLWFjdGl2ZVwiKTtcbiAgaWYgKGFjdGl2ZUl0ZW0pIHtcbiAgICBhY3RpdmVJdGVtLmhpZGRlbiA9IHRydWU7XG4gICAgYWN0aXZlSXRlbS5zZXRBdHRyaWJ1dGUoXCJhcmlhLWhpZGRlblwiLCBcInRydWVcIik7XG4gIH1cbiAgY29uc3QgaGVhZEltZyA9IG5hdi5xdWVyeVNlbGVjdG9yKFxuICAgIFwiLm5hdmlnYXRpb25fX21haW5CbG9jayAubmF2aWdhdGlvbl9faXRlbUltZ1wiXG4gICk7XG4gIGNvbnN0IGhlYWRUZXh0ID0gbmF2LnF1ZXJ5U2VsZWN0b3IoXG4gICAgXCIubmF2aWdhdGlvbl9fbWFpbkJsb2NrIC5uYXZpZ2F0aW9uX19pdGVtVGV4dFwiXG4gICk7XG4gIGlmIChoZWFkSW1nIHx8IGhlYWRUZXh0KSB7XG4gICAgY29uc3Qgc3JjSW1nID0gYWN0aXZlSXRlbT8ucXVlcnlTZWxlY3RvcihcIi5uYXZpZ2F0aW9uX19pdGVtSW1nXCIpO1xuICAgIGNvbnN0IHNyY1R4dCA9IGFjdGl2ZUl0ZW0/LnF1ZXJ5U2VsZWN0b3IoXCIubmF2aWdhdGlvbl9faXRlbVRleHRcIik7XG4gICAgaWYgKGhlYWRJbWcgJiYgc3JjSW1nKSB7XG4gICAgICBoZWFkSW1nLnNyYyA9IHNyY0ltZy5zcmM7XG4gICAgICBoZWFkSW1nLmFsdCA9IHNyY0ltZy5hbHQgfHwgXCJcIjtcbiAgICB9XG4gICAgaWYgKGhlYWRUZXh0ICYmIHNyY1R4dCkgaGVhZFRleHQudGV4dENvbnRlbnQgPSBzcmNUeHQudGV4dENvbnRlbnQ7XG4gIH1cbn1cblxuZnVuY3Rpb24gc2V0dXBPbmVNZW51KG5hdikge1xuICBjb25zdCBtZW51ID0gbmF2LnF1ZXJ5U2VsZWN0b3IoXCIubmF2aWdhdGlvbl9faXRlbXNcIik7XG4gIGlmICghbWVudSkgcmV0dXJuO1xuICBuYXYuc2V0QXR0cmlidXRlKFwicm9sZVwiLCBcImJ1dHRvblwiKTtcbiAgbmF2LnRhYkluZGV4ID0gMDtcbiAgbmF2LnNldEF0dHJpYnV0ZShcImFyaWEtaGFzcG9wdXBcIiwgXCJsaXN0Ym94XCIpO1xuICBpZiAoIW1lbnUuaWQpIG1lbnUuaWQgPSBcImxhbmctbWVudS1cIiArIE1hdGgucmFuZG9tKCkudG9TdHJpbmcoMzYpLnNsaWNlKDIpO1xuICBuYXYuc2V0QXR0cmlidXRlKFwiYXJpYS1jb250cm9sc1wiLCBtZW51LmlkKTtcbiAgbmF2LnNldEF0dHJpYnV0ZShcImFyaWEtZXhwYW5kZWRcIiwgXCJmYWxzZVwiKTtcbiAgbWVudS5zZXRBdHRyaWJ1dGUoXCJyb2xlXCIsIFwibGlzdGJveFwiKTtcbiAgbWVudS5xdWVyeVNlbGVjdG9yQWxsKFwiLm5hdmlnYXRpb25fX2l0ZW1cIikuZm9yRWFjaCgoaXRlbSkgPT4ge1xuICAgIGl0ZW0uc2V0QXR0cmlidXRlKFwicm9sZVwiLCBcIm9wdGlvblwiKTtcbiAgICBpdGVtLnRhYkluZGV4ID0gLTE7XG4gIH0pO1xuXG4gIGNvbnN0IGN1cnJlbnRUZXh0ID0gbmF2XG4gICAgLnF1ZXJ5U2VsZWN0b3IoXCIubmF2aWdhdGlvbl9fbWFpbkJsb2NrIC5uYXZpZ2F0aW9uX19pdGVtVGV4dFwiKVxuICAgID8udGV4dENvbnRlbnQ/LnRyaW0oKTtcbiAgaWYgKGN1cnJlbnRUZXh0KVxuICAgIG1lbnUucXVlcnlTZWxlY3RvckFsbChcIi5uYXZpZ2F0aW9uX19pdGVtVGV4dFwiKS5mb3JFYWNoKCh0KSA9PiB7XG4gICAgICBpZiAodC50ZXh0Q29udGVudC50cmltKCkgPT09IGN1cnJlbnRUZXh0KSB7XG4gICAgICAgIGNvbnN0IGl0ZW0gPSB0LmNsb3Nlc3QoXCIubmF2aWdhdGlvbl9faXRlbVwiKTtcbiAgICAgICAgaWYgKGl0ZW0pIHtcbiAgICAgICAgICBpdGVtLmhpZGRlbiA9IHRydWU7XG4gICAgICAgICAgaXRlbS5zZXRBdHRyaWJ1dGUoXCJhcmlhLWhpZGRlblwiLCBcInRydWVcIik7XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICB9KTtcblxuICBjb25zdCBpc09wZW4gPSAoKSA9PiBuYXYuY2xhc3NMaXN0LmNvbnRhaW5zKFwiaXMtb3BlblwiKTtcbiAgY29uc3Qgb3BlbiA9ICgpID0+IHtcbiAgICBpZiAoIWlzT3BlbigpKSB7XG4gICAgICBuYXYuY2xhc3NMaXN0LmFkZChcImlzLW9wZW5cIik7XG4gICAgICBuYXYuc2V0QXR0cmlidXRlKFwiYXJpYS1leHBhbmRlZFwiLCBcInRydWVcIik7XG4gICAgfVxuICB9O1xuICBjb25zdCBjbG9zZSA9ICgpID0+IHtcbiAgICBpZiAoaXNPcGVuKCkpIHtcbiAgICAgIG5hdi5jbGFzc0xpc3QucmVtb3ZlKFwiaXMtb3BlblwiKTtcbiAgICAgIG5hdi5zZXRBdHRyaWJ1dGUoXCJhcmlhLWV4cGFuZGVkXCIsIFwiZmFsc2VcIik7XG4gICAgfVxuICB9O1xuICBjb25zdCB0b2dnbGUgPSAoKSA9PiAoaXNPcGVuKCkgPyBjbG9zZSgpIDogb3BlbigpKTtcblxuICBuYXYuYWRkRXZlbnRMaXN0ZW5lcihcbiAgICBcInBvaW50ZXJ1cFwiLFxuICAgIChlKSA9PiB7XG4gICAgICBpZiAoZS5wb2ludGVyVHlwZSA9PT0gXCJtb3VzZVwiKSByZXR1cm47XG4gICAgICBpZiAobWVudS5jb250YWlucyhlLnRhcmdldCkpIHJldHVybjtcbiAgICAgIGUucHJldmVudERlZmF1bHQoKTtcbiAgICAgIGUuc3RvcFByb3BhZ2F0aW9uKCk7XG4gICAgICB0b2dnbGUoKTtcbiAgICB9LFxuICAgIHsgcGFzc2l2ZTogZmFsc2UgfVxuICApO1xuICBkb2N1bWVudC5hZGRFdmVudExpc3RlbmVyKFwicG9pbnRlcmRvd25cIiwgKGUpID0+IHtcbiAgICBpZiAoIW5hdi5wYXJlbnRFbGVtZW50LmNvbnRhaW5zKGUudGFyZ2V0KSkgY2xvc2UoKTtcbiAgfSk7XG4gIG5hdi5hZGRFdmVudExpc3RlbmVyKFwia2V5ZG93blwiLCAoZSkgPT4ge1xuICAgIGlmIChlLmtleSA9PT0gXCJFbnRlclwiIHx8IGUua2V5ID09PSBcIiBcIikge1xuICAgICAgZS5wcmV2ZW50RGVmYXVsdCgpO1xuICAgICAgdG9nZ2xlKCk7XG4gICAgfSBlbHNlIGlmIChlLmtleSA9PT0gXCJFc2NhcGVcIikge1xuICAgICAgaWYgKGlzT3BlbigpKSB7XG4gICAgICAgIGUucHJldmVudERlZmF1bHQoKTtcbiAgICAgICAgY2xvc2UoKTtcbiAgICAgICAgbmF2LmZvY3VzKCk7XG4gICAgICB9XG4gICAgfSBlbHNlIGlmICgoZS5rZXkgPT09IFwiQXJyb3dEb3duXCIgfHwgZS5rZXkgPT09IFwiRG93blwiKSAmJiAhaXNPcGVuKCkpIHtcbiAgICAgIG9wZW4oKTtcbiAgICAgIGZvY3VzRmlyc3RJdGVtKG1lbnUpO1xuICAgIH1cbiAgfSk7XG5cbiAgZnVuY3Rpb24gaGFuZGxlQ2hvb3NlTGFuZyhlKSB7XG4gICAgY29uc3QgaXRlbSA9IGUudGFyZ2V0LmNsb3Nlc3QoXCIubmF2aWdhdGlvbl9faXRlbVwiKTtcbiAgICBpZiAoIWl0ZW0pIHJldHVybjtcbiAgICBpZiAoZS5jYW5jZWxhYmxlKSBlLnByZXZlbnREZWZhdWx0KCk7XG4gICAgZS5zdG9wUHJvcGFnYXRpb24oKTtcbiAgICBjb25zdCBhID0gaXRlbS5jbG9zZXN0KFwiYVwiKTtcbiAgICBpZiAoYSkge1xuICAgICAgaWYgKGUuY2FuY2VsYWJsZSkgZS5wcmV2ZW50RGVmYXVsdCgpO1xuICAgICAgYS5zZXRBdHRyaWJ1dGUoXCJocmVmXCIsIFwiI1wiKTtcbiAgICB9XG4gICAgY29uc3QgY29kZSA9IGl0ZW0uZ2V0QXR0cmlidXRlKFwidmFsdWVcIik7XG4gICAgY29uc3QgZmluaXNoID0gKCkgPT5cbiAgICAgIHJlcXVlc3RBbmltYXRpb25GcmFtZSgoKSA9PiB7XG4gICAgICAgIGNsb3NlKCk7XG4gICAgICAgIGNsb3NlQWxsTmF2cygpO1xuICAgICAgICBuYXYuYmx1cigpO1xuICAgICAgICBkb2N1bWVudC5hY3RpdmVFbGVtZW50Py5ibHVyPy4oKTtcbiAgICAgIH0pO1xuICAgIGlmIChTVVBQT1JURUQuaW5jbHVkZXMoY29kZSkpXG4gICAgICBQcm9taXNlLnJlc29sdmUoc2V0TGFuZyhjb2RlKSkuZmluYWxseShmaW5pc2gpO1xuICAgIGVsc2Uge1xuICAgICAgY29uc3QgbmV3SW1nID0gaXRlbS5xdWVyeVNlbGVjdG9yKFwiLm5hdmlnYXRpb25fX2l0ZW1JbWdcIik7XG4gICAgICBjb25zdCBuZXdUZXh0ID0gaXRlbS5xdWVyeVNlbGVjdG9yKFwiLm5hdmlnYXRpb25fX2l0ZW1UZXh0XCIpO1xuICAgICAgY29uc3QgaGVhZEltZyA9IG5hdi5xdWVyeVNlbGVjdG9yKFwiLm5hdmlnYXRpb25fX2l0ZW1JbWdcIik7XG4gICAgICBjb25zdCBoZWFkVHh0ID0gbmF2LnF1ZXJ5U2VsZWN0b3IoXCIubmF2aWdhdGlvbl9faXRlbVRleHRcIik7XG4gICAgICBpZiAobmV3SW1nICYmIGhlYWRJbWcpIHtcbiAgICAgICAgaGVhZEltZy5zcmMgPSBuZXdJbWcuc3JjO1xuICAgICAgICBoZWFkSW1nLmFsdCA9IG5ld0ltZy5hbHQgfHwgXCJcIjtcbiAgICAgIH1cbiAgICAgIGlmIChuZXdUZXh0ICYmIGhlYWRUeHQpIGhlYWRUeHQudGV4dENvbnRlbnQgPSBuZXdUZXh0LnRleHRDb250ZW50O1xuICAgICAgZmluaXNoKCk7XG4gICAgfVxuICB9XG4gIG1lbnUuYWRkRXZlbnRMaXN0ZW5lcihcImNsaWNrXCIsIGhhbmRsZUNob29zZUxhbmcpO1xuICBtZW51LmFkZEV2ZW50TGlzdGVuZXIoXCJ0b3VjaGVuZFwiLCBoYW5kbGVDaG9vc2VMYW5nLCB7IHBhc3NpdmU6IGZhbHNlIH0pO1xuICBtZW51LmFkZEV2ZW50TGlzdGVuZXIoXCJwb2ludGVydXBcIiwgaGFuZGxlQ2hvb3NlTGFuZywgeyBwYXNzaXZlOiBmYWxzZSB9KTtcblxuICAvLyBjb25zdCBjbG9zZSA9ICgpID0+IHsgaWYgKGlzT3BlbigpKSB7IG5hdi5jbGFzc0xpc3QucmVtb3ZlKFwiaXMtb3BlblwiKTsgbmF2LnNldEF0dHJpYnV0ZShcImFyaWEtZXhwYW5kZWRcIixcImZhbHNlXCIpOyB9IH07XG4gIHdpbmRvdy5hZGRFdmVudExpc3RlbmVyKFwib3JpZW50YXRpb25jaGFuZ2VcIiwgY2xvc2UpO1xuICB3aW5kb3cuYWRkRXZlbnRMaXN0ZW5lcihcInJlc2l6ZVwiLCBjbG9zZSk7XG4gIGRvY3VtZW50LmFkZEV2ZW50TGlzdGVuZXIoXCJ2aXNpYmlsaXR5Y2hhbmdlXCIsICgpID0+IHtcbiAgICBpZiAoZG9jdW1lbnQuaGlkZGVuKSBjbG9zZSgpO1xuICB9KTtcbiAgbmF2LnN0eWxlLnRvdWNoQWN0aW9uID0gXCJtYW5pcHVsYXRpb25cIjtcbiAgbWVudS5zdHlsZS50b3VjaEFjdGlvbiA9IFwibWFuaXB1bGF0aW9uXCI7XG59XG5cbmZ1bmN0aW9uIGZvY3VzRmlyc3RJdGVtKG1lbnUpIHtcbiAgY29uc3QgZmlyc3QgPSBbXG4gICAgLi4ubWVudS5xdWVyeVNlbGVjdG9yQWxsKFwiLm5hdmlnYXRpb25fX2l0ZW06bm90KFtoaWRkZW5dKVwiKSxcbiAgXVswXTtcbiAgaWYgKGZpcnN0KSBmaXJzdC5mb2N1cygpO1xufVxuXG5mdW5jdGlvbiBjbG9zZUFsbE5hdnMoKSB7XG4gIGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3JBbGwoXCIubmF2aWdhdGlvbi5pcy1vcGVuXCIpLmZvckVhY2goKG5hdikgPT4ge1xuICAgIG5hdi5jbGFzc0xpc3QucmVtb3ZlKFwiaXMtb3BlblwiKTtcbiAgICBuYXYuc2V0QXR0cmlidXRlKFwiYXJpYS1leHBhbmRlZFwiLCBcImZhbHNlXCIpO1xuICAgIGNvbnN0IG1lbnUgPSBuYXYucXVlcnlTZWxlY3RvcihcIi5uYXZpZ2F0aW9uX19pdGVtc1wiKTtcbiAgICBpZiAobWVudSkge1xuICAgICAgbWVudS5zZXRBdHRyaWJ1dGUoXCJhcmlhLWhpZGRlblwiLCBcInRydWVcIik7XG4gICAgICBtZW51LnN0eWxlLnBvaW50ZXJFdmVudHMgPSBcIm5vbmVcIjtcbiAgICAgIG1lbnUuc3R5bGUudmlzaWJpbGl0eSA9IFwiaGlkZGVuXCI7XG4gICAgICBtZW51LnN0eWxlLm9wYWNpdHkgPSBcIjBcIjtcbiAgICAgIHJlcXVlc3RBbmltYXRpb25GcmFtZSgoKSA9PiB7XG4gICAgICAgIG1lbnUucmVtb3ZlQXR0cmlidXRlKFwiYXJpYS1oaWRkZW5cIik7XG4gICAgICAgIG1lbnUuc3R5bGUucG9pbnRlckV2ZW50cyA9IFwiXCI7XG4gICAgICAgIG1lbnUuc3R5bGUudmlzaWJpbGl0eSA9IFwiXCI7XG4gICAgICAgIG1lbnUuc3R5bGUub3BhY2l0eSA9IFwiXCI7XG4gICAgICB9KTtcbiAgICB9XG4gIH0pO1xufVxuXG5leHBvcnQgZnVuY3Rpb24ga2lsbEFsbEhvdmVycygpIHtcbiAgdHJ5IHtcbiAgICBkb2N1bWVudC5xdWVyeVNlbGVjdG9yQWxsKFwiOmhvdmVyXCIpLmZvckVhY2goKGVsKSA9PiBlbC5ibHVyPy4oKSk7XG4gIH0gY2F0Y2ggKF8pIHt9XG59XG5cbmZ1bmN0aW9uIHVwZGF0ZUxhbmdJblVybChsYW5nLCBvcHRzID0gVVJMX0xBTkdfT1BUSU9OUykge1xuICBjb25zdCB7XG4gICAgbWV0aG9kID0gXCJyZXBsYWNlXCIsXG4gICAgY2xlYW5EZWZhdWx0ID0gZmFsc2UsXG4gICAgZmFsbGJhY2sgPSBGQUxMQkFDSyxcbiAgICBwYXJhbSA9IFwibGFuZ1wiLFxuICB9ID0gb3B0cyB8fCB7fTtcblxuICB0cnkge1xuICAgIGNvbnN0IHVybCA9IG5ldyBVUkwod2luZG93LmxvY2F0aW9uLmhyZWYpO1xuXG4gICAgaWYgKGNsZWFuRGVmYXVsdCAmJiBsYW5nID09PSBmYWxsYmFjaykge1xuICAgICAgdXJsLnNlYXJjaFBhcmFtcy5kZWxldGUocGFyYW0pO1xuICAgIH0gZWxzZSB7XG4gICAgICB1cmwuc2VhcmNoUGFyYW1zLnNldChwYXJhbSwgbGFuZyk7XG4gICAgfVxuXG4gICAgLy8gXHUwNDMyXHUwNDM4XHUwNDNBXHUwNDNFXHUwNDQwXHUwNDM4XHUwNDQxXHUwNDQyXHUwNDNFXHUwNDMyXHUwNDQzXHUwNDU0XHUwNDNDXHUwNDNFIFx1MDQzMlx1MDQ1Nlx1MDQzNFx1MDQzRFx1MDQzRVx1MDQ0MVx1MDQzRFx1MDQzOFx1MDQzOSBcdTA0NDhcdTA0M0JcdTA0NEZcdTA0NDUsIFx1MDQ0OVx1MDQzRVx1MDQzMSBcdTA0NDNcdTA0M0RcdTA0MzhcdTA0M0FcdTA0MzBcdTA0NDJcdTA0MzggXHUwNDM3XHUwNDMwXHUwNDM5XHUwNDMyXHUwNDNFXHUwNDMzXHUwNDNFIG9yaWdpblxuICAgIGNvbnN0IG5leHQgPSB1cmwucGF0aG5hbWUgKyAodXJsLnNlYXJjaCB8fCBcIlwiKSArICh1cmwuaGFzaCB8fCBcIlwiKTtcbiAgICBjb25zdCBjdXJyZW50ID0gbG9jYXRpb24ucGF0aG5hbWUgKyBsb2NhdGlvbi5zZWFyY2ggKyBsb2NhdGlvbi5oYXNoO1xuXG4gICAgaWYgKG5leHQgPT09IGN1cnJlbnQpIHJldHVybjsgLy8gXHUwNDNEXHUwNDU2XHUwNDQ3XHUwNDNFXHUwNDMzXHUwNDNFIFx1MDQzRFx1MDQzNSBcdTA0MzdcdTA0M0NcdTA0NTZcdTA0M0RcdTA0MzhcdTA0M0JcdTA0M0VcdTA0NDFcdTA0NEZcblxuICAgIGlmIChtZXRob2QgPT09IFwicHVzaFwiKSB7XG4gICAgICBoaXN0b3J5LnB1c2hTdGF0ZShudWxsLCBcIlwiLCBuZXh0KTtcbiAgICB9IGVsc2Uge1xuICAgICAgaGlzdG9yeS5yZXBsYWNlU3RhdGUobnVsbCwgXCJcIiwgbmV4dCk7XG4gICAgfVxuICB9IGNhdGNoIHtcbiAgICAvLyBcdTA0MzRcdTA0NDNcdTA0MzZcdTA0MzUgXHUwNDQwXHUwNDU2XHUwNDM0XHUwNDNBXHUwNDU2XHUwNDQxXHUwNDNEXHUwNDM4XHUwNDM5IGZhbGxiYWNrIFx1MDQzRFx1MDQzMCBcdTA0MzJcdTA0MzhcdTA0M0ZcdTA0MzBcdTA0MzRcdTA0M0VcdTA0M0EgXHUwNDNGXHUwNDQwXHUwNDNFXHUwNDMxXHUwNDNCXHUwNDM1XHUwNDNDIFx1MDQ1Nlx1MDQzNyBVUkwoKVxuICAgIGNvbnN0IHBhcmFtcyA9IG5ldyBVUkxTZWFyY2hQYXJhbXMobG9jYXRpb24uc2VhcmNoKTtcbiAgICBpZiAoY2xlYW5EZWZhdWx0ICYmIGxhbmcgPT09IGZhbGxiYWNrKSB7XG4gICAgICBwYXJhbXMuZGVsZXRlKHBhcmFtKTtcbiAgICB9IGVsc2Uge1xuICAgICAgcGFyYW1zLnNldChwYXJhbSwgbGFuZyk7XG4gICAgfVxuICAgIGNvbnN0IHEgPSBwYXJhbXMudG9TdHJpbmcoKTtcbiAgICBjb25zdCBuZXh0ID0gbG9jYXRpb24ucGF0aG5hbWUgKyAocSA/IGA/JHtxfWAgOiBcIlwiKSArIGxvY2F0aW9uLmhhc2g7XG4gICAgY29uc3QgY3VycmVudCA9IGxvY2F0aW9uLnBhdGhuYW1lICsgbG9jYXRpb24uc2VhcmNoICsgbG9jYXRpb24uaGFzaDtcbiAgICBpZiAobmV4dCA9PT0gY3VycmVudCkgcmV0dXJuO1xuICAgIGhpc3RvcnkucmVwbGFjZVN0YXRlKG51bGwsIFwiXCIsIG5leHQpO1xuICB9XG59IiwgIi8vIC8vIGpzL2dhbWUuanMgKEVTIG1vZHVsZSlcblxuLy8gLyoqIFx1MDQxMFx1MDQ0MVx1MDQzNVx1MDQ0Mlx1MDQzOCBcdTA0NDFcdTA0M0JcdTA0M0VcdTA0NDItXHUwNDQxXHUwNDM4XHUwNDNDXHUwNDMyXHUwNDNFXHUwNDNCXHUwNDU2XHUwNDMyICovXG4vLyBjb25zdCBTWU1CT0xTID0ge1xuLy8gICAxOiB7IHNyYzogXCIuL2ltZy9tYWluQ29udGFpbmVyL2dhbWVJbWdfMV8xeC53ZWJwXCIsIHNyYzJ4OiBcIi4vaW1nL21haW5Db250YWluZXIvZ2FtZUltZ18xXzJ4LndlYnBcIiB9LFxuLy8gICAyOiB7IHNyYzogXCIuL2ltZy9tYWluQ29udGFpbmVyL2dhbWVJbWdfMl8xeC53ZWJwXCIsIHNyYzJ4OiBcIi4vaW1nL21haW5Db250YWluZXIvZ2FtZUltZ18yXzJ4LndlYnBcIiB9LFxuLy8gICAzOiB7IHNyYzogXCIuL2ltZy9tYWluQ29udGFpbmVyL2dhbWVJbWdfM18xeC53ZWJwXCIsIHNyYzJ4OiBcIi4vaW1nL21haW5Db250YWluZXIvZ2FtZUltZ18zXzJ4LndlYnBcIiB9LFxuLy8gICA0OiB7IHNyYzogXCIuL2ltZy9tYWluQ29udGFpbmVyL2dhbWVJbWdfNF8xeC53ZWJwXCIsIHNyYzJ4OiBcIi4vaW1nL21haW5Db250YWluZXIvZ2FtZUltZ180XzJ4LndlYnBcIiB9LFxuLy8gICA1OiB7IHNyYzogXCIuL2ltZy9tYWluQ29udGFpbmVyL2dhbWVJbWdfNV8xeC53ZWJwXCIsIHNyYzJ4OiBcIi4vaW1nL21haW5Db250YWluZXIvZ2FtZUltZ181XzJ4LndlYnBcIiB9LFxuLy8gICA2OiB7IHNyYzogXCIuL2ltZy9tYWluQ29udGFpbmVyL2dhbWVJbWdfNl8xeC53ZWJwXCIsIHNyYzJ4OiBcIi4vaW1nL21haW5Db250YWluZXIvZ2FtZUltZ182XzJ4LndlYnBcIiB9LFxuLy8gICA3OiB7IHNyYzogXCIuL2ltZy9tYWluQ29udGFpbmVyL2dhbWVJbWdfN18xeC53ZWJwXCIsIHNyYzJ4OiBcIi4vaW1nL21haW5Db250YWluZXIvZ2FtZUltZ183XzJ4LndlYnBcIiB9LFxuLy8gICA4OiB7IHNyYzogXCIuL2ltZy9tYWluQ29udGFpbmVyL2dhbWVJbWdfOF8xeC53ZWJwXCIsIHNyYzJ4OiBcIi4vaW1nL21haW5Db250YWluZXIvZ2FtZUltZ184XzJ4LndlYnBcIiB9LFxuLy8gICA5OiB7IHNyYzogXCIuL2ltZy9tYWluQ29udGFpbmVyL2dhbWVJbWdfd2luXzF4LndlYnBcIiwgc3JjMng6IFwiLi9pbWcvbWFpbkNvbnRhaW5lci9nYW1lSW1nX3dpbl8yeC53ZWJwXCIgfSxcbi8vIH07XG5cbi8vIC8qKiBcdTA0MjZcdTA0NTZcdTA0M0JcdTA0NENcdTA0M0VcdTA0MzJcdTA0MzAgXHUwNDQxXHUwNDU2XHUwNDQyXHUwNDNBXHUwNDMwIFx1MDQzMlx1MDQzOFx1MDQzM1x1MDQ0MFx1MDQzMFx1MDQ0OFx1MDQ0MyAoXHUwNDRGXHUwNDNBXHUwNDU2IFx1MDQ0MVx1MDQzOFx1MDQzQ1x1MDQzMlx1MDQzRVx1MDQzQlx1MDQzOCBcdTA0M0NcdTA0MzBcdTA0NEVcdTA0NDJcdTA0NEMgXHUwNDM3XHUwNDMwXHUwNDM5XHUwNDQyXHUwNDM4IFx1MDQzRlx1MDQ1Nlx1MDQ0MVx1MDQzQlx1MDQ0RiBcdTIwMUNcdTA0M0ZcdTA0MzVcdTA0NDBcdTA0MzVcdTA0MzdcdTA0MzBcdTA0NDBcdTA0NEZcdTA0MzRcdTA0M0FcdTA0MzhcdTIwMUQpICovXG4vLyBjb25zdCBXSU5fR1JJRCA9IFtcbi8vICAgWzYsIDUsIDQsIDUsIDQsIDMsIDcsIDJdLFxuLy8gICBbMSwgMiwgMiwgNSwgMywgNywgNCwgNF0sXG4vLyAgIFs0LCA2LCA4LCAxLCA3LCAzLCAzLCAzXSxcbi8vICAgWzgsIDMsIDEsIDcsIDQsIDgsIDEsIDNdLFxuLy8gICBbMiwgMiwgNywgOCwgNiwgMiwgOCwgNl0sXG4vLyAgIFsxLCA3LCA2LCA4LCAxLCAxLCA0LCAyXSxcbi8vIF07XG5cblxuXG4vLyBhc3luYyBmdW5jdGlvbiBwcmVsb2FkU3ltYm9scyhzeW1ib2xzKSB7XG4vLyAgIGNvbnN0IHRhc2tzID0gT2JqZWN0LnZhbHVlcyhzeW1ib2xzKS5mbGF0TWFwKCh7c3JjLCBzcmMyeH0pID0+IHtcbi8vICAgICByZXR1cm4gW3NyYywgc3JjMnhdLm1hcCh1cmwgPT4gbmV3IFByb21pc2UocmVzID0+IHtcbi8vICAgICAgIGNvbnN0IGltID0gbmV3IEltYWdlKCk7XG4vLyAgICAgICBpbS5kZWNvZGluZyA9IFwiYXN5bmNcIjtcbi8vICAgICAgIGltLm9ubG9hZCA9IGltLm9uZXJyb3IgPSAoKSA9PiByZXMoKTtcbi8vICAgICAgIGltLnNyYyA9IHVybDtcbi8vICAgICAgIC8vIFNhZmFyaTogXHUwNDQxXHUwNDNGXHUwNDQwXHUwNDNFXHUwNDMxXHUwNDQzXHUwNDU0XHUwNDNDXHUwNDNFIFx1MDQ0OVx1MDQzNSBcdTA0MzkgZGVjb2RlKCksIFx1MDQ0Rlx1MDQzQVx1MDQ0OVx1MDQzRSBcdTA0NTRcbi8vICAgICAgIGlmIChpbS5kZWNvZGUpIGltLmRlY29kZSgpLmNhdGNoKCgpID0+IHt9KTtcbi8vICAgICB9KSk7XG4vLyAgIH0pO1xuLy8gICBhd2FpdCBQcm9taXNlLmFsbCh0YXNrcyk7XG4vLyB9XG5cblxuLy8gLyoqXG4vLyAgKiBcdTA0MUZcdTA0NDNcdTA0MzFcdTA0M0JcdTA0NTZcdTA0NDdcdTA0M0RcdTA0MzhcdTA0MzkgQVBJIFx1MDQzM1x1MDQ0MFx1MDQzOC5cbi8vICAqIFx1MDQxMlx1MDQ0MVx1MDQzNVx1MDQ0MFx1MDQzNVx1MDQzNFx1MDQzOFx1MDQzRFx1MDQ1NiBcdTA0MzNcdTA0M0VcdTA0NDJcdTA0NDNcdTA0NTQgXHUwNDNBXHUwNDMwXHUwNDQxXHUwNDNBXHUwNDMwXHUwNDM0IDxwaWN0dXJlPiwgXHUwNDQ3XHUwNDU2XHUwNDNGXHUwNDNCXHUwNDRGXHUwNDU0IFx1MDQ0NVx1MDQzNVx1MDQzRFx1MDQzNFx1MDQzQlx1MDQzNVx1MDQ0MFx1MDQzOCwgXHUwNDQ4XHUwNDQyXHUwNDNFXHUwNDMyXHUwNDQ1XHUwNDMwXHUwNDU0IFx1MDQzMFx1MDQzRFx1MDQ1Nlx1MDQzQ1x1MDQzMFx1MDQ0Nlx1MDQ1Nlx1MDQ0RSBcdTA0NTYgXHUwNDQ4XHUwNDNCXHUwNDM1IFx1MDQzRlx1MDQzRVx1MDQzNFx1MDQ1Nlx1MDQ0RSBcInNsb3Q6Ymlnd2luXCIuXG4vLyAgKi9cbi8vIGV4cG9ydCBhc3luYyBmdW5jdGlvbiBpbml0R2FtZSgpIHtcbi8vICAgICAgIGF3YWl0IHByZWxvYWRTeW1ib2xzKFNZTUJPTFMpO1xuLy8gICAvLyAxKSBcdTA0MTJcdTA0M0RcdTA0NDNcdTA0NDJcdTA0NDBcdTA0NTZcdTA0NDhcdTA0M0RcdTA0NEYgXHUwNDNGXHUwNDU2XHUwNDM0XHUwNDMzXHUwNDNFXHUwNDQyXHUwNDNFXHUwNDMyXHUwNDNBXHUwNDMwIFx1MDQzMFx1MDQzRFx1MDQ1Nlx1MDQzQ1x1MDQzMFx1MDQ0Nlx1MDQ1Nlx1MDQzOVx1MDQzRFx1MDQzRVx1MDQzM1x1MDQzRSBcdTA0M0FcdTA0MzBcdTA0NDFcdTA0M0FcdTA0MzBcdTA0MzRcdTA0NDMgKFx1MDQ0MFx1MDQzMFx1MDQzRFx1MDQ1Nlx1MDQ0OFx1MDQzNSBcdTA0MzJcdTA0MzhcdTA0M0FcdTA0M0JcdTA0MzhcdTA0M0FcdTA0MzBcdTA0M0JcdTA0MzggXHUwNDM3IG1haW4uanMpXG4vLyAgIHByZXBhcmVQaWN0dXJlQ2FzY2FkZSgpO1xuXG4vLyAgIC8vIDIpIFx1MDQxQVx1MDQzRFx1MDQzRVx1MDQzRlx1MDQzQVx1MDQzMCArIFx1MDQzQVx1MDQzRVx1MDQzRFx1MDQ0Mlx1MDQzNVx1MDQzOVx1MDQzRFx1MDQzNVx1MDQ0MCBcdTA0MzNcdTA0NDBcdTA0Mzhcbi8vICAgY29uc3QgYnRuID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvcihcIi5tYWluQ29udGVudF9fYnRuXCIpO1xuLy8gICBjb25zdCBnYW1lID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvcihcIi5nYW1lXCIpO1xuLy8gICBpZiAoIWJ0biB8fCAhZ2FtZSkgcmV0dXJuO1xuXG4vLyAgIC8vIDMpIFx1MDQxQVx1MDQzQlx1MDQ1Nlx1MDQzQSBcdTIwMTQgXHUwNDNFXHUwNDM0XHUwNDM4XHUwNDNEIFx1MDQ0MVx1MDQzRlx1MDQ1Nlx1MDQzRFxuLy8gICBidG4uYWRkRXZlbnRMaXN0ZW5lcihcImNsaWNrXCIsIChlKSA9PiB7XG4vLyAgICAgZS5wcmV2ZW50RGVmYXVsdCgpO1xuLy8gICAgIGlmIChsb2NhbFN0b3JhZ2UuZ2V0SXRlbShcImdhbWUtc3B1blwiKSA9PT0gXCJ0cnVlXCIpIHJldHVybjtcbi8vICAgICBpZiAoZ2FtZS5jbGFzc0xpc3QuY29udGFpbnMoXCJpcy1zcHVuXCIpKSByZXR1cm47XG5cbi8vICAgICBnYW1lLmNsYXNzTGlzdC5hZGQoXCJpcy1zcHVuXCIpO1xuLy8gICAgIGJ0bi5zZXRBdHRyaWJ1dGUoXCJhcmlhLWRpc2FibGVkXCIsIFwidHJ1ZVwiKTtcbi8vICAgICBidG4uc2V0QXR0cmlidXRlKFwiZGlzYWJsZWRcIiwgXCJcIik7XG4vLyAgICAgbG9jYWxTdG9yYWdlLnNldEl0ZW0oXCJnYW1lLXNwdW5cIiwgXCJ0cnVlXCIpO1xuXG5cblxuLy8gICAgIC8vIFx1MDQxRlx1MDQ1Nlx1MDQzNFx1MDQzQVx1MDQzQlx1MDQzMFx1MDQzNFx1MDQzMFx1MDQ1NFx1MDQzQ1x1MDQzRSBcdTA0M0NcdTA0MzBcdTA0MzlcdTA0MzFcdTA0NDNcdTA0NDJcdTA0M0RcdTA0NTYgXHUwNDQxXHUwNDM4XHUwNDNDXHUwNDMyXHUwNDNFXHUwNDNCXHUwNDM4IFx1MDQ1NiBcdTA0NDFcdTA0NDJcdTA0MzBcdTA0NDBcdTA0NDJcdTA0NDNcdTA0NTRcdTA0M0NcdTA0M0UgXHUwNDNBXHUwNDMwXHUwNDQxXHUwNDNBXHUwNDMwXHUwNDM0XG4vLyAgICAgYXBwbHlXaW5HcmlkKFNZTUJPTFMsIFdJTl9HUklEKTtcbi8vICAgICBzdGFydFBpY3R1cmVDYXNjYWRlKCk7XG5cbi8vICAgICAvLyAoXHUwNDNFXHUwNDNGXHUwNDQ2XHUwNDU2XHUwNDNFXHUwNDNEXHUwNDMwXHUwNDNCXHUwNDRDXHUwNDNEXHUwNDNFKSBcdTA0NEZcdTA0M0FcdTA0NDlcdTA0M0UgXHUwNDQzIFx1MDQzMlx1MDQzNVx1MDQ0MFx1MDQ0MVx1MDQ0Mlx1MDQ0Nlx1MDQ1NiBcdTA0NTQgLmdhbWVfX3dpblNlY3RvclxuLy8gICAgIGNvbnN0IGxhc3REcm9wID0gZ2FtZS5xdWVyeVNlbGVjdG9yKFwiLmdhbWVfX2NvbDpudGgtY2hpbGQoNikgLmdhbWVfX2NvbEltZy0tNjZcIik7XG4vLyAgICAgbGFzdERyb3A/LmFkZEV2ZW50TGlzdGVuZXIoXG4vLyAgICAgICBcImFuaW1hdGlvbmVuZFwiLFxuLy8gICAgICAgKCkgPT4ge1xuLy8gICAgICAgICBjb25zdCB3cyA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoXCIuZ2FtZV9fd2luU2VjdG9yXCIpPy5zdHlsZTtcbi8vICAgICAgICAgaWYgKHdzKSB3cy5kaXNwbGF5ID0gXCJibG9ja1wiO1xuLy8gICAgICAgfSxcbi8vICAgICAgIHsgb25jZTogdHJ1ZSB9XG4vLyAgICAgKTtcbi8vICAgfSk7XG5cbi8vICAgLy8gNCkgXHUwNDJGXHUwNDNBXHUwNDQ5XHUwNDNFIFx1MDQzMlx1MDQzNlx1MDQzNSBcdTA0M0FcdTA0NDBcdTA0NDNcdTA0NDJcdTA0MzhcdTA0M0JcdTA0MzggXHUyMDE0IFx1MDQzRVx1MDQzNFx1MDQ0MFx1MDQzMFx1MDQzN1x1MDQ0MyBcdTA0NDFcdTA0MzhcdTA0MzNcdTA0M0RcdTA0MzBcdTA0M0JcdTA0NTZcdTA0MzdcdTA0NDNcdTA0NTRcdTA0M0NcdTA0M0UgKFx1MDQzMVx1MDQzNVx1MDQzNyBcdTA0MzdcdTA0MzBcdTA0M0JcdTA0MzVcdTA0MzZcdTA0M0RcdTA0M0VcdTA0NDFcdTA0NDJcdTA0NTYgXHUwNDMyXHUwNDU2XHUwNDM0IHBvcHVwLmpzKVxuLy8gICBpZiAobG9jYWxTdG9yYWdlLmdldEl0ZW0oXCJnYW1lLXNwdW5cIikgPT09IFwidHJ1ZVwiKSB7XG4vLyAgICAgYnRuPy5zZXRBdHRyaWJ1dGUoXCJhcmlhLWRpc2FibGVkXCIsIFwidHJ1ZVwiKTtcbi8vICAgICBidG4/LnNldEF0dHJpYnV0ZShcImRpc2FibGVkXCIsIFwiXCIpO1xuLy8gICAgIHJlcXVlc3RBbmltYXRpb25GcmFtZSgoKSA9PlxuLy8gICAgICAgZG9jdW1lbnQuZGlzcGF0Y2hFdmVudChuZXcgQ3VzdG9tRXZlbnQoXCJzbG90OmJpZ3dpblwiKSlcbi8vICAgICApO1xuLy8gICB9XG4vLyB9XG5cbi8vIC8qID09PT09PT09PT09PT09PT09IGhlbHBlcnMgKFx1MDQzMlx1MDQzRFx1MDQ0M1x1MDQ0Mlx1MDQ0MFx1MDQ1Nlx1MDQ0OFx1MDQzRFx1MDQ1NikgPT09PT09PT09PT09PT09PT0gKi9cblxuLy8gZnVuY3Rpb24gYXBwbHlXaW5HcmlkKHN5bWJvbHMsIHdpbkdyaWQpIHtcbi8vICAgY29uc3QgZ2FtZSA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoXCIuZ2FtZVwiKTtcbi8vICAgaWYgKCFnYW1lKSByZXR1cm47XG5cbi8vICAgY29uc3QgY29scyA9IEFycmF5LmZyb20oZ2FtZS5xdWVyeVNlbGVjdG9yQWxsKFwiLmdhbWVfX2NvbFwiKSk7XG4vLyAgIGNvbnN0IEMgPSBjb2xzLmxlbmd0aDtcbi8vICAgaWYgKCFDKSByZXR1cm47XG5cbi8vICAgY29uc3QgUiA9IE1hdGgubWluKC4uLmNvbHMubWFwKChjb2wpID0+IGNvbC5xdWVyeVNlbGVjdG9yQWxsKFwiOnNjb3BlID4gcGljdHVyZVwiKS5sZW5ndGgpKTtcbi8vICAgaWYgKCFSKSByZXR1cm47XG5cbi8vICAgY29uc3QgYXQgPSAociwgYykgPT4gY29sc1tjXS5xdWVyeVNlbGVjdG9yQWxsKFwiOnNjb3BlID4gcGljdHVyZVwiKVtyXTtcblxuLy8gICBmb3IgKGxldCBjID0gMDsgYyA8IEM7IGMrKykge1xuLy8gICAgIGNvbnN0IGNvbEdyaWQgPSB3aW5HcmlkW2NdO1xuLy8gICAgIGlmICghQXJyYXkuaXNBcnJheShjb2xHcmlkKSkgY29udGludWU7XG5cbi8vICAgICBmb3IgKGxldCByID0gMDsgciA8IFI7IHIrKykge1xuLy8gICAgICAgY29uc3QgcGljID0gYXQociwgYyk7XG4vLyAgICAgICBpZiAoIXBpYykgY29udGludWU7XG5cbi8vICAgICAgIGNvbnN0IHN5bUlkID0gY29sR3JpZFtyXTtcbi8vICAgICAgIGNvbnN0IHN5bSA9IHN5bWJvbHNbc3ltSWRdO1xuLy8gICAgICAgaWYgKCFzeW0pIGNvbnRpbnVlO1xuXG4vLyAgICAgICBwaWMuc2V0QXR0cmlidXRlKFwiZGF0YS1uZXh0LWlkXCIsIFN0cmluZyhzeW1JZCkpO1xuLy8gICAgICAgcGljLnNldEF0dHJpYnV0ZShcImRhdGEtbmV4dC1zcmNcIiwgc3ltLnNyYyk7XG4vLyAgICAgICBwaWMuc2V0QXR0cmlidXRlKFwiZGF0YS1uZXh0LXNyY3NldFwiLCBgJHtzeW0uc3JjfSAxeCwgJHtzeW0uc3JjMnh9IDJ4YCk7XG4vLyAgICAgfVxuLy8gICB9XG4vLyB9XG5cbi8vIC8qKiBcdTA0MjBcdTA0M0VcdTA0MzdcdTA0NDBcdTA0MzBcdTA0NDVcdTA0NDNcdTA0M0RcdTA0M0VcdTA0M0EgXHUwNDM3XHUwNDMwXHUwNDQyXHUwNDQwXHUwNDM4XHUwNDNDXHUwNDNFXHUwNDNBIE9VVC9JTiwgXHUwNDNDXHUwNDU2XHUwNDQyXHUwNDNBXHUwNDMwIC5maW5hbC1pbiwgZGF0YS1pbi1lbmQgXHUwNDM0XHUwNDNCXHUwNDRGIFx1MDQ0NFx1MDQzRVx1MDQzQlx1MDQzMVx1MDQzNVx1MDQzQVx1MDQ0MyAqL1xuLy8gZnVuY3Rpb24gcHJlcGFyZVBpY3R1cmVDYXNjYWRlKCkge1xuLy8gICBjb25zdCBnYW1lID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvcihcIi5nYW1lXCIpO1xuLy8gICBpZiAoIWdhbWUpIHJldHVybjtcblxuLy8gICBjb25zdCBjb2xzID0gQXJyYXkuZnJvbShnYW1lLnF1ZXJ5U2VsZWN0b3JBbGwoXCIuZ2FtZV9fY29sXCIpKTtcbi8vICAgY29uc3QgQyA9IGNvbHMubGVuZ3RoO1xuLy8gICBpZiAoIUMpIHJldHVybjtcblxuLy8gICBjb25zdCBSID0gTWF0aC5taW4oLi4uY29scy5tYXAoKGNvbCkgPT4gY29sLnF1ZXJ5U2VsZWN0b3JBbGwoXCI6c2NvcGUgPiBwaWN0dXJlXCIpLmxlbmd0aCkpO1xuLy8gICBpZiAoIVIpIHJldHVybjtcblxuLy8gICBjb25zdCBjcyA9IGdldENvbXB1dGVkU3R5bGUoZ2FtZSk7XG4vLyAgIGNvbnN0IHN0ZXBPdXQgPSBwYXJzZUZsb2F0KGNzLmdldFByb3BlcnR5VmFsdWUoXCItLXN0ZXAtb3V0XCIpKSB8fCAwLjA2O1xuLy8gICBjb25zdCBzdGVwSW4gID0gcGFyc2VGbG9hdChjcy5nZXRQcm9wZXJ0eVZhbHVlKFwiLS1zdGVwLWluXCIpKSAgfHwgc3RlcE91dDtcbi8vICAgY29uc3QgZHVyICAgICA9IHBhcnNlRmxvYXQoY3MuZ2V0UHJvcGVydHlWYWx1ZShcIi0tZHVyXCIpKSAgICAgIHx8IDAuMDY7XG4vLyAgIGNvbnN0IGNvbFN0YWcgPSBwYXJzZUZsb2F0KGNzLmdldFByb3BlcnR5VmFsdWUoXCItLWNvbC1zdGFnZ2VyXCIpKSB8fCAwLjE7XG5cbi8vICAgY29uc3QgYXQgPSAociwgYykgPT4gY29sc1tjXS5xdWVyeVNlbGVjdG9yQWxsKFwiOnNjb3BlID4gcGljdHVyZVwiKVtyXTtcblxuLy8gICBsZXQgbWF4RGVsYXlJbiA9IC0xO1xuLy8gICBsZXQgbWF4UGljID0gbnVsbDtcblxuLy8gICBmb3IgKGxldCBjID0gMDsgYyA8IEM7IGMrKykge1xuLy8gICAgIGNvbnN0IGNvbE9mZnNldCA9IGMgKiBjb2xTdGFnO1xuXG4vLyAgICAgZm9yIChsZXQgciA9IDA7IHIgPCBSOyByKyspIHtcbi8vICAgICAgIGNvbnN0IHBpYyA9IGF0KHIsIGMpO1xuLy8gICAgICAgaWYgKCFwaWMpIGNvbnRpbnVlO1xuXG4vLyAgICAgICBjb25zdCBkZWxheU91dCA9IGNvbE9mZnNldCArIChSIC0gMSAtIHIpICogc3RlcE91dDtcbi8vICAgICAgIHBpYy5zdHlsZS5zZXRQcm9wZXJ0eShcIi0tZGVsYXktb3V0XCIsIGAke2RlbGF5T3V0fXNgKTtcblxuLy8gICAgICAgY29uc3QgZW50ZXJTdGFydCA9IGNvbE9mZnNldCArIDIgKiBzdGVwT3V0ICsgZHVyO1xuLy8gICAgICAgY29uc3QgZGVsYXlJbiA9IGVudGVyU3RhcnQgKyAoUiAtIDEgLSByKSAqIHN0ZXBJbjtcbi8vICAgICAgIHBpYy5zdHlsZS5zZXRQcm9wZXJ0eShcIi0tZGVsYXktaW5cIiwgYCR7ZGVsYXlJbn1zYCk7XG5cbi8vICAgICAgIGlmIChkZWxheUluID4gbWF4RGVsYXlJbikge1xuLy8gICAgICAgICBtYXhEZWxheUluID0gZGVsYXlJbjtcbi8vICAgICAgICAgbWF4UGljID0gcGljO1xuLy8gICAgICAgfVxuLy8gICAgIH1cbi8vICAgfVxuXG4vLyAgIGlmIChtYXhQaWMpIG1heFBpYy5jbGFzc0xpc3QuYWRkKFwiZmluYWwtaW5cIik7XG5cbi8vICAgLy8gXHUwNDMyXHUwNDM1XHUwNDQwXHUwNDQ1IFx1MDQzRVx1MDQ0MVx1MDQ0Mlx1MDQzMFx1MDQzRFx1MDQzRFx1MDQ0Q1x1MDQzRVx1MDQ1NyBcdTA0M0FcdTA0M0VcdTA0M0JcdTA0M0VcdTA0M0RcdTA0M0FcdTA0MzggXHUyMDE0IFx1MDQzQ1x1MDQzMFx1MDQ0MFx1MDQzQVx1MDQzNVx1MDQ0MCBcdTA0MzRcdTA0M0JcdTA0NEYgXHUwNDQxXHUwNDNCXHUwNDQzXHUwNDQ1XHUwNDMwXHUwNDQ3XHUwNDMwIFx1MjAxQ1x1MDQzRVx1MDQ0MVx1MDQ0Mlx1MDQzMFx1MDQzRFx1MDQzRFx1MDQ0Q1x1MDQzRVx1MDQzM1x1MDQzRSBcdTA0MzRcdTA0NDBcdTA0M0VcdTA0M0ZcdTA0MzBcdTIwMURcbi8vICAgY29uc3QgdG9wTGFzdCA9IGF0KDAsIEMgLSAxKTtcbi8vICAgdG9wTGFzdD8uY2xhc3NMaXN0LmFkZChcImdhbWVfX2NvbEltZy0tNjZcIik7XG5cbi8vICAgLy8gXHUwNDFEXHUwNDMwIFx1MDQzMlx1MDQ0MVx1MDQ0Rlx1MDQzQTogXHUwNDM3XHUwNDMwXHUwNDMzXHUwNDMwXHUwNDNCXHUwNDRDXHUwNDNEXHUwNDM4XHUwNDM5IFx1MDQ0N1x1MDQzMFx1MDQ0MSBcdTA0MzdcdTA0MzBcdTA0MzJcdTA0MzVcdTA0NDBcdTA0NDhcdTA0MzVcdTA0M0RcdTA0M0RcdTA0NEYgSU4tXHUwNDNBXHUwNDMwXHUwNDQxXHUwNDNBXHUwNDMwXHUwNDM0XHUwNDQzIChcdTA0NDFcdTA0MzVcdTA0M0FcdTA0NDNcdTA0M0RcdTA0MzRcdTA0MzgpXG4vLyAgIGlmIChnYW1lICYmIG1heERlbGF5SW4gPj0gMCkge1xuLy8gICAgIGNvbnN0IGQgPSBwYXJzZUZsb2F0KGdldENvbXB1dGVkU3R5bGUoZ2FtZSkuZ2V0UHJvcGVydHlWYWx1ZShcIi0tZHVyXCIpKSB8fCAwLjA2O1xuLy8gICAgIGdhbWUuZGF0YXNldC5pbkVuZCA9IFN0cmluZyhtYXhEZWxheUluICsgZCk7XG4vLyAgIH1cbi8vIH1cblxuLy8gLyoqIFx1MDQxN1x1MDQzMFx1MDQzRlx1MDQ0M1x1MDQ0MVx1MDQzQSBPVVQvSU47IFx1MDQzRFx1MDQzMCBcdTA0NDRcdTA0NTZcdTA0M0RcdTA0MzBcdTA0M0JcdTA0NTYgXHUyMDE0IFx1MDQzMFx1MDQzRFx1MDQ1Nlx1MDQzQ1x1MDQzRVx1MDQzMlx1MDQzMFx1MDQzRFx1MDQzOFx1MDQzOSBcdTA0NDFcdTA0MzJcdTA0M0VcdTA0M0YgN1x1MjE5MjksIFx1MDQzNFx1MDQzMFx1MDQzQlx1MDQ1NiBcdTA0NDhcdTA0M0JcdTA0MzVcdTA0M0NcdTA0M0UgXCJzbG90OmJpZ3dpblwiICovXG4vLyBmdW5jdGlvbiBzdGFydFBpY3R1cmVDYXNjYWRlKCkge1xuLy8gICBjb25zdCBnYW1lID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvcihcIi5nYW1lXCIpO1xuLy8gICBpZiAoIWdhbWUpIHJldHVybjtcblxuLy8gICBjb25zdCBwaWNzID0gQXJyYXkuZnJvbShnYW1lLnF1ZXJ5U2VsZWN0b3JBbGwoXCIuZ2FtZV9fY29sID4gcGljdHVyZVwiKSk7XG4vLyAgIGlmICghcGljcy5sZW5ndGgpIHJldHVybjtcblxuLy8gICAvLyAxKSBPVVRcbi8vICAgcmVxdWVzdEFuaW1hdGlvbkZyYW1lKCgpID0+IHtcbi8vICAgICBwaWNzLmZvckVhY2goKHApID0+IHAuY2xhc3NMaXN0LmFkZChcImlzLWxlYXZpbmdcIikpO1xuLy8gICB9KTtcblxuLy8gICAvLyAyKSBcdTA0MURcdTA0MzAgXHUwNDNBXHUwNDU2XHUwNDNEXHUwNDM1XHUwNDQ2XHUwNDRDIE9VVCBcdTIwMTQgXHUwNDNGXHUwNDU2XHUwNDM0XHUwNDNDXHUwNDU2XHUwNDNEXHUwNDRGXHUwNDU0XHUwNDNDXHUwNDNFIFx1MDQzMFx1MDQ0MVx1MDQ0MVx1MDQzNVx1MDQ0Mlx1MDQzOCBcdTA0MzkgXHUwNDM3XHUwNDMwXHUwNDNGXHUwNDQzXHUwNDQxXHUwNDNBXHUwNDMwXHUwNDU0XHUwNDNDXHUwNDNFIElOXG4vLyAgIHBpY3MuZm9yRWFjaCgocGljKSA9PiB7XG4vLyAgICAgY29uc3Qgb25PdXRFbmQgPSAoZSkgPT4ge1xuLy8gICAgICAgaWYgKGUuYW5pbWF0aW9uTmFtZSAhPT0gXCJnYW1lLWRyb3Atb3V0XCIpIHJldHVybjtcblxuLy8gICAgICAgY29uc3QgaW1nID0gcGljLnF1ZXJ5U2VsZWN0b3IoXCJpbWdcIik7XG4vLyAgICAgICBjb25zdCBzb3VyY2UgPSBwaWMucXVlcnlTZWxlY3RvcihcInNvdXJjZVwiKTtcbi8vICAgICAgIGNvbnN0IG5leHRJZCA9IHBpYy5nZXRBdHRyaWJ1dGUoXCJkYXRhLW5leHQtaWRcIik7XG4vLyAgICAgICBjb25zdCBuZXh0U3JjID0gcGljLmdldEF0dHJpYnV0ZShcImRhdGEtbmV4dC1zcmNcIik7XG4vLyAgICAgICBjb25zdCBuZXh0U3Jjc2V0ID0gcGljLmdldEF0dHJpYnV0ZShcImRhdGEtbmV4dC1zcmNzZXRcIik7XG5cbi8vICAgICAgIGlmIChzb3VyY2UgJiYgbmV4dFNyY3NldCkgc291cmNlLnNldEF0dHJpYnV0ZShcInNyY3NldFwiLCBuZXh0U3Jjc2V0KTtcbi8vICAgICAgIGlmIChpbWcgJiYgbmV4dFNyYykge1xuLy8gICAgICAgICBpbWcuc3JjID0gbmV4dFNyYztcbi8vICAgICAgICAgaW1nLnNldEF0dHJpYnV0ZShcInNyY3NldFwiLCBgJHtuZXh0U3JjfWApOyAvLyBTYWZhcmkgZmFsbGJhY2tcbi8vICAgICAgIH1cbi8vICAgICAgIGlmIChuZXh0SWQpIHBpYy5kYXRhc2V0LnN5bWJvbCA9IG5leHRJZDtcblxuLy8gICAgICAgcGljLmNsYXNzTGlzdC5hZGQoXCJpcy1lbnRlci1wcmVcIiwgXCJpcy1lbnRlcmluZ1wiKTtcbi8vICAgICAgIHBpYy5jbGFzc0xpc3QucmVtb3ZlKFwiaXMtbGVhdmluZ1wiKTtcbi8vICAgICAgIHBpYy5yZW1vdmVFdmVudExpc3RlbmVyKFwiYW5pbWF0aW9uZW5kXCIsIG9uT3V0RW5kKTtcbi8vICAgICB9O1xuLy8gICAgIHBpYy5hZGRFdmVudExpc3RlbmVyKFwiYW5pbWF0aW9uZW5kXCIsIG9uT3V0RW5kKTtcbi8vICAgfSk7XG5cbi8vICAgLy8gMykgXHUwNDI0XHUwNDU2XHUwNDNEXHUwNDMwXHUwNDNCIElOIFx1MjAxNCBcdTA0NDBcdTA0M0VcdTA0MzFcdTA0MzhcdTA0M0NcdTA0M0UgXHUwNDQxXHUwNDMyXHUwNDNFXHUwNDNGIDdcdTIxOTI5IFx1MDQ1NiBcdTA0NDFcdTA0MzhcdTA0MzNcdTA0M0RcdTA0MzBcdTA0M0JcdTA0NTZcdTA0MzdcdTA0NDNcdTA0NTRcdTA0M0NcdTA0M0Vcbi8vICAgY29uc3QgZmluYWxQaWMgPSBnYW1lLnF1ZXJ5U2VsZWN0b3IoXCIuZmluYWwtaW5cIik7XG4vLyAgIGNvbnN0IHJ1blN3YXBUaGVuU2lnbmFsID0gKCkgPT4ge1xuLy8gICAgIHN3YXBTeW1ib2xzQWZ0ZXJTcGluQW5pbWF0ZWQoNywgOSwgU1lNQk9MUykudGhlbigoKSA9PiB7XG4vLyAgICAgICBzZXRUaW1lb3V0KCgpID0+IGRvY3VtZW50LmRpc3BhdGNoRXZlbnQobmV3IEN1c3RvbUV2ZW50KFwic2xvdDpiaWd3aW5cIikpLCAxMDAwKTtcbi8vICAgICB9KTtcbi8vICAgfTtcblxuLy8gICBpZiAoZmluYWxQaWMpIHtcbi8vICAgICBjb25zdCBvbkZpbmFsSW5FbmQgPSAoZSkgPT4ge1xuLy8gICAgICAgaWYgKGUuYW5pbWF0aW9uTmFtZSAhPT0gXCJnYW1lLWRyb3AtaW5cIikgcmV0dXJuO1xuLy8gICAgICAgZmluYWxQaWMucmVtb3ZlRXZlbnRMaXN0ZW5lcihcImFuaW1hdGlvbmVuZFwiLCBvbkZpbmFsSW5FbmQpO1xuLy8gICAgICAgcnVuU3dhcFRoZW5TaWduYWwoKTtcbi8vICAgICB9O1xuLy8gICAgIGZpbmFsUGljLmFkZEV2ZW50TGlzdGVuZXIoXCJhbmltYXRpb25lbmRcIiwgb25GaW5hbEluRW5kKTtcbi8vICAgfSBlbHNlIHtcbi8vICAgICBjb25zdCBlbmRTZWMgPSBwYXJzZUZsb2F0KGdhbWUuZGF0YXNldC5pbkVuZCB8fCBcIjBcIik7XG4vLyAgICAgaWYgKGVuZFNlYyA+IDApIHNldFRpbWVvdXQocnVuU3dhcFRoZW5TaWduYWwsIE1hdGguY2VpbChlbmRTZWMgKiAxMDAwKSArIDMwKTtcbi8vICAgfVxuLy8gfVxuXG4vLyAvKiogXHUwNDEwXHUwNDNEXHUwNDU2XHUwNDNDXHUwNDNFXHUwNDMyXHUwNDMwXHUwNDNEXHUwNDM4XHUwNDM5IFx1MDQ0MVx1MDQzMlx1MDQzRVx1MDQzRiBcdTA0NDNcdTA0NDFcdTA0NTZcdTA0NDUgZnJvbUlkIFx1MjE5MiB0b0lkOyBcdTA0M0ZcdTA0M0VcdTA0MzJcdTA0MzVcdTA0NDBcdTA0NDJcdTA0MzBcdTA0NTQgUHJvbWlzZSBcdTA0M0FcdTA0M0VcdTA0M0JcdTA0MzggXHUwNDMyXHUwNDQxXHUwNDM1IFx1MDQzN1x1MDQzMFx1MDQzMlx1MDQzNVx1MDQ0MFx1MDQ0OFx1MDQzOFx1MDQzQlx1MDQzRVx1MDQ0MVx1MDQ0QyAqL1xuXG4vLyAvLyBmdW5jdGlvbiBzd2FwU3ltYm9sc0FmdGVyU3BpbkFuaW1hdGVkKGZyb21JZCwgdG9JZCwgc3ltYm9scykge1xuLy8gLy8gICBjb25zdCBnYW1lID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvcihcIi5nYW1lXCIpO1xuLy8gLy8gICBpZiAoIWdhbWUpIHJldHVybiBQcm9taXNlLnJlc29sdmUoKTtcblxuLy8gLy8gICBjb25zdCB0b1N5bSA9IHN5bWJvbHNbdG9JZF07XG4vLyAvLyAgIGlmICghdG9TeW0pIHJldHVybiBQcm9taXNlLnJlc29sdmUoKTtcblxuLy8gLy8gICAvLyBcdTA0MzFcdTA0MzVcdTA0NDBcdTA0MzVcdTA0M0NcdTA0M0UgXHUwNDQyXHUwNDU2XHUwNDNCXHUwNDRDXHUwNDNBXHUwNDM4IFx1MDQ0Mlx1MDQ1NiA8cGljdHVyZT4sIFx1MDQzNFx1MDQzNSBcdTA0MzdcdTA0MzBcdTA0NDBcdTA0MzBcdTA0MzcgXHUwNDNGXHUwNDNFXHUwNDNBXHUwNDMwXHUwNDM3XHUwNDMwXHUwNDNEXHUwNDNFIGZyb21JZCAoXHUwNDNEXHUwNDMwXHUwNDNGXHUwNDQwXHUwNDM4XHUwNDNBXHUwNDNCXHUwNDMwXHUwNDM0LCA3KVxuLy8gLy8gICBjb25zdCBwaWNzID0gQXJyYXkuZnJvbShnYW1lLnF1ZXJ5U2VsZWN0b3JBbGwoXCIuZ2FtZV9fY29sID4gcGljdHVyZVwiKSlcbi8vIC8vICAgICAuZmlsdGVyKChwaWMpID0+IHBpYy5kYXRhc2V0LnN5bWJvbCA9PT0gU3RyaW5nKGZyb21JZCkpO1xuLy8gLy8gICBpZiAoIXBpY3MubGVuZ3RoKSByZXR1cm4gUHJvbWlzZS5yZXNvbHZlKCk7XG5cbi8vIC8vICAgLy8gXHUwNDM3XHUwNDQ3XHUwNDM4XHUwNDQyXHUwNDQzXHUwNDU0XHUwNDNDXHUwNDNFIFx1MDQ0Mlx1MDQ0MFx1MDQzOFx1MDQzMlx1MDQzMFx1MDQzQlx1MDQ1Nlx1MDQ0MVx1MDQ0Mlx1MDQ0QyBcdTA0NDRcdTA0MzVcdTA0MzlcdTA0MzRcdTA0NDMgXHUwNDM3IENTUy1cdTA0MzdcdTA0M0NcdTA0NTZcdTA0M0RcdTA0M0RcdTA0M0VcdTA0NTcsIFx1MDQ0OVx1MDQzRVx1MDQzMSBcdTA0M0RcdTA0MzUgXHUwNDQwXHUwNDNFXHUwNDM3XHUyMDE5XHUwNDU3XHUwNDM2XHUwNDM0XHUwNDM2XHUwNDMwXHUwNDNCXHUwNDNFXHUwNDQxXHUwNDRGIFx1MDQzNyBcdTA0NDFcdTA0NDJcdTA0MzhcdTA0M0JcdTA0NEZcdTA0M0NcdTA0Mzhcbi8vIC8vICAgY29uc3QgZmFkZVNlYyA9IHBhcnNlRmxvYXQoZ2V0Q29tcHV0ZWRTdHlsZShnYW1lKS5nZXRQcm9wZXJ0eVZhbHVlKFwiLS1zd2FwLWZhZGVcIikpIHx8IDAuNTtcbi8vIC8vICAgY29uc3QgRkFERV9NUyA9IE1hdGgucm91bmQoZmFkZVNlYyAqIDEwMDApO1xuXG4vLyAvLyAgIGNvbnN0IFJBSVNFX0RFTEFZID0gMzAwOyAgLy8gXHUwNDNBXHUwNDNFXHUwNDNCXHUwNDM4IFx1MDQzRlx1MDQ1Nlx1MDQzNFx1MDQzRFx1MDQ1Nlx1MDQzQ1x1MDQzMFx1MDQ0Mlx1MDQzOCA5LVx1MDQzQVx1MDQ0MyBcdTA0M0RcdTA0MzBcdTA0MzQgNy1cdTA0M0FcdTA0M0VcdTA0NEVcbi8vIC8vICAgY29uc3QgSElERV9ERUxBWSAgPSA4MDA7ICAvLyBcdTA0M0FcdTA0M0VcdTA0M0JcdTA0MzggXHUwNDNGXHUwNDNFXHUwNDQ3XHUwNDMwXHUwNDQyXHUwNDM4IFx1MDQzM1x1MDQzMFx1MDQ0MVx1MDQzOFx1MDQ0Mlx1MDQzOCA3LVx1MDQzQVx1MDQ0MyAoXHUwNDQ5XHUwNDNFXHUwNDMxIFx1MDBBQlx1MDQzMVx1MDQzMFx1MDQzQ1x1MDQzRlx1MDBCQiBcdTA0MzJcdTA0NDFcdTA0NDJcdTA0MzhcdTA0MzMgXHUwNDMyXHUwNDU2XHUwNDM0XHUwNDU2XHUwNDMzXHUwNDQwXHUwNDMwXHUwNDQyXHUwNDM4KVxuXG4vLyAvLyAgIGNvbnN0IHRhc2tzID0gcGljcy5tYXAoKHBpYykgPT4gbmV3IFByb21pc2UoKHJlc29sdmUpID0+IHtcbi8vIC8vICAgICBjb25zdCBvbGRJbWcgPSBwaWMucXVlcnlTZWxlY3RvcihcImltZ1wiKTtcbi8vIC8vICAgICBjb25zdCBzb3VyY2UgPSBwaWMucXVlcnlTZWxlY3RvcihcInNvdXJjZVwiKTtcbi8vIC8vICAgICBpZiAoIW9sZEltZykgcmV0dXJuIHJlc29sdmUoKTtcblxuLy8gLy8gICAgIC8vIDEpIFx1MDQzRlx1MDQzNVx1MDQ0MFx1MDQzNVx1MDQzMlx1MDQzRVx1MDQzNFx1MDQzOFx1MDQzQ1x1MDQzRSBwaWN0dXJlIFx1MDQzMiBcdTAwQUJcdTA0M0RcdTA0MzBcdTA0M0FcdTA0M0JcdTA0MzBcdTA0MzRcdTA0MzBcdTA0M0JcdTA0NENcdTA0M0RcdTA0MzhcdTA0MzlcdTAwQkIgXHUwNDQwXHUwNDM1XHUwNDM2XHUwNDM4XHUwNDNDIChcdTA0NDdcdTA0MzVcdTA0NDBcdTA0MzVcdTA0MzcgQ1NTIEdyaWQpXG4vLyAvLyAgICAgcGljLmNsYXNzTGlzdC5hZGQoXCJzd2FwLWFuaW1cIik7XG5cbi8vIC8vICAgICAvLyAyKSBcdTA0M0NcdTA0MzBcdTA0NDBcdTA0M0FcdTA0NDNcdTA0NTRcdTA0M0NcdTA0M0UgXHUwNDNGXHUwNDNFXHUwNDQyXHUwNDNFXHUwNDQ3XHUwNDNEXHUwNDQzIDctXHUwNDNBXHUwNDQzXG4vLyAvLyAgICAgb2xkSW1nLmNsYXNzTGlzdC5hZGQoXCJzd2FwLW9sZFwiKTtcblxuLy8gLy8gICAgIC8vIDMpIFx1MDQ0MVx1MDQ0Mlx1MDQzMlx1MDQzRVx1MDQ0MFx1MDQ0RVx1MDQ1NFx1MDQzQ1x1MDQzRSBcdTAwQUJcdTA0M0RcdTA0M0VcdTA0MzJcdTA0NDNcdTAwQkIgOS1cdTA0M0FcdTA0NDMgXHUyMDE0IFx1MDQzMlx1MDQzRVx1MDQzRFx1MDQzMCBcdTA0M0JcdTA0NEZcdTA0MzZcdTA0MzUgXHUwNDMyIFx1MDQ0Mlx1MDQ0MyBcdTA0MzYgXHUwNDQxXHUwNDU2XHUwNDQyXHUwNDNBXHUwNDQzLCBcdTA0NDlcdTA0M0UgXHUwNDM5IDctXHUwNDNBXHUwNDMwXG4vLyAvLyAgICAgY29uc3QgbmV3SW1nID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudChcImltZ1wiKTtcbi8vIC8vICAgICBuZXdJbWcuY2xhc3NOYW1lID0gXCJnYW1lX19jb2xJbWcgc3dhcC1uZXdcIjtcbi8vIC8vICAgICBuZXdJbWcuYWx0ID0gb2xkSW1nLmFsdCB8fCBcIlwiO1xuLy8gLy8gICAgIG5ld0ltZy5kZWNvZGluZyA9IFwiYXN5bmNcIjtcbi8vIC8vICAgICBuZXdJbWcuc3JjID0gdG9TeW0uc3JjO1xuLy8gLy8gICAgIG5ld0ltZy5zZXRBdHRyaWJ1dGUoXCJzcmNzZXRcIiwgYCR7dG9TeW0uc3JjfWApOyAvLyBcdTA0MzdcdTA0MzAgXHUwNDMxXHUwNDMwXHUwNDM2XHUwNDMwXHUwNDNEXHUwNDNEXHUwNDRGXHUwNDNDIFx1MDQzQ1x1MDQzRVx1MDQzNlx1MDQzNVx1MDQ0OCBcdTA0MzRcdTA0M0VcdTA0MzRcdTA0MzBcdTA0NDJcdTA0MzggMnhcbi8vIC8vICAgICBwaWMuYXBwZW5kQ2hpbGQobmV3SW1nKTtcblxuLy8gLy8gICAgIC8vIDQpIFx1MDQ0MVx1MDQzRlx1MDQzNVx1MDQ0MFx1MDQ0OFx1MDQ0MyBcdTA0MzFcdTA0MzBcdTA0M0NcdTA0M0ZcdTA0MzhcdTA0M0NcdTA0M0UgNy1cdTA0M0FcdTA0NDMgKFx1MDQzMFx1MDQzRFx1MDQ1Nlx1MDQzQ1x1MDQzMFx1MDQ0Nlx1MDQ1Nlx1MDQ0RiBzd2FwLXB1bHNlIFx1MDQzRlx1MDQ0MFx1MDQzOFx1MDQ1N1x1MDQzNFx1MDQzNSBcdTA0MzcgXHUwNDNBXHUwNDNCXHUwNDMwXHUwNDQxXHUwNDQzIGlzLWJ1bXBpbmcpXG4vLyAvLyAgICAgb2xkSW1nLmNsYXNzTGlzdC5hZGQoXCJpcy1idW1waW5nXCIpO1xuXG4vLyAvLyAgICAgLy8gNSkgXHUwNDNGXHUwNDNCXHUwNDMwXHUwNDNEXHUwNDQzXHUwNDU0XHUwNDNDXHUwNDNFIFx1MDQzRlx1MDQ1Nlx1MDQzNFx1MDQzRFx1MDQ0Rlx1MDQ0Mlx1MDQ0Mlx1MDQ0RiA5LVx1MDQzQVx1MDQzOCBcdTA0NTYgXHUwNDQ0XHUwNDM1XHUwNDM5XHUwNDM0LVx1MDQzMFx1MDQ0M1x1MDQ0MiA3LVx1MDQzQVx1MDQzOFxuLy8gLy8gICAgIHJlcXVlc3RBbmltYXRpb25GcmFtZSgoKSA9PiB7XG4vLyAvLyAgICAgICBsZXQgcmFpc2VULCBoaWRlVDtcblxuLy8gLy8gICAgICAgY29uc3QgY2xlYXJUaW1lcnMgPSAoKSA9PiB7XG4vLyAvLyAgICAgICAgIGlmIChyYWlzZVQpIGNsZWFyVGltZW91dChyYWlzZVQpO1xuLy8gLy8gICAgICAgICBpZiAoaGlkZVQpICBjbGVhclRpbWVvdXQoaGlkZVQpO1xuLy8gLy8gICAgICAgfTtcbi8vIC8vICAgICAgIHdhdGNoUmVtb3ZhbE9uY2UocGljLCBjbGVhclRpbWVycyk7XG5cbi8vIC8vICAgICAgIC8vIFx1MDQ0N1x1MDQzNVx1MDQ0MFx1MDQzNVx1MDQzNyBSQUlTRV9ERUxBWSBcdTA0M0ZcdTA0NTZcdTA0MzRcdTA0M0RcdTA0NTZcdTA0M0NcdTA0MzBcdTA0NTRcdTA0M0NcdTA0M0UgOS1cdTA0M0FcdTA0NDMgXHUwNDNEXHUwNDMwXHUwNDM0IDctXHUwNDNBXHUwNDNFXHUwNDRFIChcdTA0MzcgQ1NTOiAuc3dhcC1yYWlzZSA+IC5zd2FwLW5ldylcbi8vIC8vICAgICAgIHJhaXNlVCA9IHNldFRpbWVvdXQoKCkgPT4ge1xuLy8gLy8gICAgICAgICBwaWMuY2xhc3NMaXN0LmFkZChcInN3YXAtcmFpc2VcIik7XG5cbi8vIC8vICAgICAgICAgLy8gXHUwNDQ5XHUwNDM1IFx1MDQ0Mlx1MDQ0MFx1MDQzRVx1MDQ0NVx1MDQzOCBcdTA0MzRcdTA0MzBcdTA0NTRcdTA0M0NcdTA0M0UgXHUwNDNGXHUwNDNFXHUwNDMxXHUwNDQzXHUwNDQyXHUwNDM4IFx1MDQzN1x1MDQzMlx1MDQzNVx1MDQ0MFx1MDQ0NVx1MDQ0MyBcdTIwMTQgXHUwNDU2IFx1MDQzRlx1MDQzRVx1MDQ0N1x1MDQzOFx1MDQzRFx1MDQzMFx1MDQ1NFx1MDQzQ1x1MDQzRSBcdTA0M0ZcdTA0M0JcdTA0MzBcdTA0MzJcdTA0M0RcdTA0M0UgXHUwNDMzXHUwNDMwXHUwNDQxXHUwNDM4XHUwNDQyXHUwNDM4IDctXHUwNDNBXHUwNDQzXG4vLyAvLyAgICAgICAgIGhpZGVUID0gc2V0VGltZW91dCgoKSA9PiB7XG4vLyAvLyAgICAgICAgICAgY29uc3Qgb25GYWRlRW5kID0gKCkgPT4ge1xuLy8gLy8gICAgICAgICAgICAgb2xkSW1nLnJlbW92ZUV2ZW50TGlzdGVuZXIoXCJ0cmFuc2l0aW9uZW5kXCIsIG9uRmFkZUVuZCk7XG5cbi8vIC8vICAgICAgICAgICAgIC8vIDYpIFx1MDQzRVx1MDQ0MVx1MDQ0Mlx1MDQzMFx1MDQ0Mlx1MDQzRVx1MDQ0N1x1MDQzRFx1MDQzMCBcdTA0M0ZcdTA0NTZcdTA0MzRcdTA0M0NcdTA0NTZcdTA0M0RcdTA0MzAgXHUwNDNBXHUwNDNFXHUwNDNEXHUwNDQyXHUwNDM1XHUwNDNEXHUwNDQyXHUwNDQzIFx1MDQzMVx1MDQzMFx1MDQzN1x1MDQzRVx1MDQzMlx1MDQzRVx1MDQzM1x1MDQzRSA8aW1nPi88c291cmNlPiBcdTA0M0RcdTA0MzAgOS1cdTA0M0FcdTA0NDNcbi8vIC8vICAgICAgICAgICAgIGlmIChzb3VyY2UpIHtcbi8vIC8vICAgICAgICAgICAgICAgc291cmNlLnNldEF0dHJpYnV0ZShcInNyY3NldFwiLCBgJHt0b1N5bS5zcmN9IDF4LCAke3RvU3ltLnNyYzJ4fSAyeGApO1xuLy8gLy8gICAgICAgICAgICAgfVxuLy8gLy8gICAgICAgICAgICAgb2xkSW1nLnNyYyA9IHRvU3ltLnNyYztcbi8vIC8vICAgICAgICAgICAgIG9sZEltZy5zZXRBdHRyaWJ1dGUoXCJzcmNzZXRcIiwgYCR7dG9TeW0uc3JjfWApO1xuXG4vLyAvLyAgICAgICAgICAgICAvLyBcdTA0M0ZcdTA0NDBcdTA0MzhcdTA0MzFcdTA0MzhcdTA0NDBcdTA0MzBcdTA0M0RcdTA0M0RcdTA0NEYgXHUwNDQxXHUwNDNCXHUwNDQzXHUwNDM2XHUwNDMxXHUwNDNFXHUwNDMyXHUwNDM4XHUwNDQ1IFx1MDQzQVx1MDQzQlx1MDQzMFx1MDQ0MVx1MDQ1Nlx1MDQzMi9cdTA0M0RcdTA0M0VcdTA0MzRcbi8vIC8vICAgICAgICAgICAgIG9sZEltZy5jbGFzc0xpc3QucmVtb3ZlKFwiZmFkZS1vdXRcIiwgXCJzd2FwLW9sZFwiLCBcImlzLWJ1bXBpbmdcIik7XG4vLyAvLyAgICAgICAgICAgICBvbGRJbWcuc3R5bGUub3BhY2l0eSA9IFwiXCI7XG4vLyAvLyAgICAgICAgICAgICBpZiAobmV3SW1nLnBhcmVudE5vZGUpIG5ld0ltZy5wYXJlbnROb2RlLnJlbW92ZUNoaWxkKG5ld0ltZyk7XG4vLyAvLyAgICAgICAgICAgICBwaWMuY2xhc3NMaXN0LnJlbW92ZShcInN3YXAtcmFpc2VcIiwgXCJzd2FwLWFuaW1cIik7XG5cbi8vIC8vICAgICAgICAgICAgIC8vIFx1MDQ0NFx1MDQ1Nlx1MDQzQVx1MDQ0MVx1MDQ0M1x1MDQ1NFx1MDQzQ1x1MDQzRSwgXHUwNDQ5XHUwNDNFIFx1MDQ0Mlx1MDQ0M1x1MDQ0MiBcdTA0NDJcdTA0MzVcdTA0M0ZcdTA0MzVcdTA0NDAgdG9JZFxuLy8gLy8gICAgICAgICAgICAgcGljLmRhdGFzZXQuc3ltYm9sID0gU3RyaW5nKHRvSWQpO1xuXG4vLyAvLyAgICAgICAgICAgICByZXNvbHZlKCk7XG4vLyAvLyAgICAgICAgICAgfTtcblxuLy8gLy8gICAgICAgICAgIG9sZEltZy5hZGRFdmVudExpc3RlbmVyKFwidHJhbnNpdGlvbmVuZFwiLCBvbkZhZGVFbmQpO1xuLy8gLy8gICAgICAgICAgIC8vIFx1MDQ0MVx1MDQzMFx1MDQzQyBcdTA0NDRcdTA0MzVcdTA0MzlcdTA0MzQtXHUwNDMwXHUwNDQzXHUwNDQyIDctXHUwNDNBXHUwNDM4IChcdTA0NDFcdTA0NDJcdTA0MzhcdTA0M0JcdTA0NTYgXHUwNDU0IFx1MDQzMiBTQ1NTOiAuc3dhcC1vbGQuZmFkZS1vdXQgeyB0cmFuc2l0aW9uOiBvcGFjaXR5IC4uLiB9KVxuLy8gLy8gICAgICAgICAgIG9sZEltZy5jbGFzc0xpc3QuYWRkKFwiZmFkZS1vdXRcIik7XG5cbi8vIC8vICAgICAgICAgICAvLyBcdTA0NDFcdTA0NDJcdTA0NDBcdTA0MzBcdTA0NDVcdTA0M0VcdTA0MzJcdTA0M0FcdTA0MzAsIFx1MDQ0Rlx1MDQzQVx1MDQ0OVx1MDQzRSB0cmFuc2l0aW9uZW5kIFx1MDQzRFx1MDQzNSBcdTA0M0ZcdTA0NDBcdTA0MzhcdTA0M0JcdTA0MzVcdTA0NDJcdTA0MzhcdTA0NDJcdTA0NENcbi8vIC8vICAgICAgICAgICBzZXRUaW1lb3V0KG9uRmFkZUVuZCwgRkFERV9NUyArIDgwKTtcbi8vIC8vICAgICAgICAgfSwgSElERV9ERUxBWSk7XG4vLyAvLyAgICAgICB9LCBSQUlTRV9ERUxBWSk7XG4vLyAvLyAgICAgfSk7XG4vLyAvLyAgIH0pKTtcblxuLy8gLy8gICByZXR1cm4gUHJvbWlzZS5hbGwodGFza3MpO1xuLy8gLy8gfVxuLy8gLyoqIFx1MDQxMFx1MDQzRFx1MDQ1Nlx1MDQzQ1x1MDQzRVx1MDQzMlx1MDQzMFx1MDQzRFx1MDQzOFx1MDQzOSBcdTA0NDFcdTA0MzJcdTA0M0VcdTA0M0YgXHUwNDQzXHUwNDQxXHUwNDU2XHUwNDQ1IGZyb21JZCBcdTIxOTIgdG9JZDsgXHUwNDNGXHUwNDNFXHUwNDMyXHUwNDM1XHUwNDQwXHUwNDQyXHUwNDMwXHUwNDU0IFByb21pc2UgXHUwNDNBXHUwNDNFXHUwNDNCXHUwNDM4IFx1MDQzMlx1MDQ0MVx1MDQzNSBcdTA0MzdcdTA0MzBcdTA0MzJcdTA0MzVcdTA0NDBcdTA0NDhcdTA0MzhcdTA0M0JcdTA0M0VcdTA0NDFcdTA0NEMgKi9cbi8vIGZ1bmN0aW9uIHN3YXBTeW1ib2xzQWZ0ZXJTcGluQW5pbWF0ZWQoZnJvbUlkLCB0b0lkLCBzeW1ib2xzKSB7XG4vLyAgIGNvbnN0IGdhbWUgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKFwiLmdhbWVcIik7XG4vLyAgIGlmICghZ2FtZSkgcmV0dXJuIFByb21pc2UucmVzb2x2ZSgpO1xuXG4vLyAgIGNvbnN0IHRvU3ltID0gc3ltYm9sc1t0b0lkXTtcbi8vICAgaWYgKCF0b1N5bSkgcmV0dXJuIFByb21pc2UucmVzb2x2ZSgpO1xuXG4vLyAgIC8vIFx1MDQzMVx1MDQzNVx1MDQ0MFx1MDQzNVx1MDQzQ1x1MDQzRSBcdTA0NDJcdTA0NTZcdTA0M0JcdTA0NENcdTA0M0FcdTA0MzggXHUwNDQyXHUwNDU2IDxwaWN0dXJlPiwgXHUwNDM0XHUwNDM1IFx1MDQzN1x1MDQzMFx1MDQ0MFx1MDQzMFx1MDQzNyBcdTA0M0ZcdTA0M0VcdTA0M0FcdTA0MzBcdTA0MzdcdTA0MzBcdTA0M0RcdTA0M0UgZnJvbUlkIChcdTA0M0RcdTA0MzBcdTA0M0ZcdTA0NDBcdTA0MzhcdTA0M0FcdTA0M0JcdTA0MzBcdTA0MzQsIDcpXG4vLyAgIGNvbnN0IHBpY3MgPSBBcnJheS5mcm9tKGdhbWUucXVlcnlTZWxlY3RvckFsbChcIi5nYW1lX19jb2wgPiBwaWN0dXJlXCIpKVxuLy8gICAgIC5maWx0ZXIoKHBpYykgPT4gcGljLmRhdGFzZXQuc3ltYm9sID09PSBTdHJpbmcoZnJvbUlkKSk7XG4vLyAgIGlmICghcGljcy5sZW5ndGgpIHJldHVybiBQcm9taXNlLnJlc29sdmUoKTtcblxuLy8gICAvLyBcdTA0NDdcdTA0MzhcdTA0NDJcdTA0MzBcdTA0NTRcdTA0M0NcdTA0M0UgXHUwNDQyXHUwNDQwXHUwNDM4XHUwNDMyXHUwNDMwXHUwNDNCXHUwNDU2XHUwNDQxXHUwNDQyXHUwNDRDIFx1MDQ0NFx1MDQzNVx1MDQzOVx1MDQzNFx1MDQ0MyBcdTA0MzcgQ1NTLVx1MDQzN1x1MDQzQ1x1MDQ1Nlx1MDQzRFx1MDQzRFx1MDQzRVx1MDQ1NywgXHUwNDQ5XHUwNDNFXHUwNDMxIFx1MDQzRFx1MDQzNSBcdTA0NDBcdTA0M0VcdTA0MzdcdTIwMTlcdTA0NTdcdTA0MzZcdTA0MzRcdTA0MzZcdTA0MzBcdTA0M0JcdTA0M0VcdTA0NDFcdTA0NEYgXHUwNDM3XHUwNDU2IFx1MDQ0MVx1MDQ0Mlx1MDQzOFx1MDQzQlx1MDQ0Rlx1MDQzQ1x1MDQzOFxuLy8gICBjb25zdCBmYWRlU2VjID0gcGFyc2VGbG9hdChnZXRDb21wdXRlZFN0eWxlKGdhbWUpLmdldFByb3BlcnR5VmFsdWUoXCItLXN3YXAtZmFkZVwiKSkgfHwgMC41O1xuLy8gICBjb25zdCBGQURFX01TID0gTWF0aC5yb3VuZChmYWRlU2VjICogMTAwMCk7XG5cbi8vICAgLy8gXHUwNDNEXHUwNDM1XHUwNDMyXHUwNDM1XHUwNDNCXHUwNDM4XHUwNDNBXHUwNDU2IFx1MDQzRlx1MDQzMFx1MDQ0M1x1MDQzN1x1MDQzODogXHUwNDM0XHUwNDMwXHUwNDU0XHUwNDNDXHUwNDNFIDctXHUwNDQ2XHUwNDU2IFx1MjAxQ1x1MDQzMVx1MDQzMFx1MDQzQ1x1MDQzRlx1MjAxRCBcdTA0NTYgXHUwNDNGXHUwNDU2XHUwNDM0XHUwNDNEXHUwNDU2XHUwNDNDXHUwNDMwXHUwNDU0XHUwNDNDXHUwNDNFIDktXHUwNDNBXHUwNDQzXG4vLyAgIGNvbnN0IFJBSVNFX0RFTEFZID0gMzAwOyAgLy8gXHUwNDNBXHUwNDNFXHUwNDNCXHUwNDM4IFx1MDQzRlx1MDQ1Nlx1MDQzNFx1MDQzRFx1MDQ1Nlx1MDQzQ1x1MDQzMFx1MDQ1NFx1MDQzQ1x1MDQzRSA5LVx1MDQzQVx1MDQ0MyBcdTA0M0RcdTA0MzBcdTA0MzQgNy1cdTA0M0FcdTA0M0VcdTA0NEVcbi8vICAgY29uc3QgSElERV9ERUxBWSAgPSA4MDA7ICAvLyBcdTA0M0FcdTA0M0VcdTA0M0JcdTA0MzggXHUwNDNGXHUwNDNFXHUwNDQ3XHUwNDMwXHUwNDQyXHUwNDM4IFx1MDQzM1x1MDQzMFx1MDQ0MVx1MDQzOFx1MDQ0Mlx1MDQzOCA3LVx1MDQzQVx1MDQ0MyBcdTA0M0ZcdTA0NTZcdTA0NDFcdTA0M0JcdTA0NEYgXHUyMDFDXHUwNDMxXHUwNDMwXHUwNDNDXHUwNDNGXHUwNDQzXHUyMDFEXG5cbi8vICAgY29uc3QgdGFza3MgPSBwaWNzLm1hcCgocGljKSA9PiBuZXcgUHJvbWlzZSgocmVzb2x2ZSkgPT4ge1xuLy8gICAgIGNvbnN0IG9sZEltZyA9IHBpYy5xdWVyeVNlbGVjdG9yKFwiaW1nXCIpO1xuLy8gICAgIGNvbnN0IHNvdXJjZSA9IHBpYy5xdWVyeVNlbGVjdG9yKFwic291cmNlXCIpO1xuLy8gICAgIGlmICghb2xkSW1nKSByZXR1cm4gcmVzb2x2ZSgpO1xuXG4vLyAgICAgLy8gMSkgXHUwNDMyXHUwNDNDXHUwNDM4XHUwNDNBXHUwNDMwXHUwNDU0XHUwNDNDXHUwNDNFIFx1MDQ0MFx1MDQzNVx1MDQzNlx1MDQzOFx1MDQzQyBcdTA0M0RcdTA0MzBcdTA0M0FcdTA0M0JcdTA0MzBcdTA0MzRcdTA0MzBcdTA0M0RcdTA0M0RcdTA0NEYgKFx1MDQzQVx1MDQzNVx1MDQ0MFx1MDQ0M1x1MDQ1NFx1MDQzQ1x1MDQzRSBcdTA0NDhcdTA0MzBcdTA0NDBcdTA0MzBcdTA0M0NcdTA0MzggXHUwNDMyXHUwNDQxXHUwNDM1XHUwNDQwXHUwNDM1XHUwNDM0XHUwNDM4XHUwNDNEXHUwNDU2IHBpY3R1cmUpXG4vLyAgICAgcGljLmNsYXNzTGlzdC5hZGQoXCJzd2FwLWFuaW1cIik7XG4vLyAgICAgb2xkSW1nLmNsYXNzTGlzdC5hZGQoXCJzd2FwLW9sZFwiKTsgICAgICAgICAgLy8gXHUwNDNDXHUwNDMwXHUwNDQwXHUwNDNBXHUwNDM1XHUwNDQwIFx1MDQzNFx1MDQzQlx1MDQ0RiBcdTA0NDhcdTA0MzBcdTA0NDBcdTA0NDMvXHUwNDQ0XHUwNDM1XHUwNDM5XHUwNDM0XHUwNDQzXG4vLyAgICAgb2xkSW1nLmNsYXNzTGlzdC5hZGQoXCJpcy1idW1waW5nXCIpOyAgICAgICAgLy8gXHUwNDNGXHUwNDQzXHUwNDNCXHUwNDRDXHUwNDQxIChzd2FwLXB1bHNlKVxuXG4vLyAgICAgLy8gMikgXHUwNDQxXHUwNDQyXHUwNDMyXHUwNDNFXHUwNDQwXHUwNDRFXHUwNDU0XHUwNDNDXHUwNDNFIFx1MDQzRFx1MDQzRVx1MDQzMlx1MDQ0MyBcdTIwMUM5XHUyMDFELVx1MDQzQVx1MDQ0MyBcdTIwMTQgXHUwNDMyXHUwNDNFXHUwNDNEXHUwNDMwIFx1MDQzQlx1MDQ0Rlx1MDQzNlx1MDQzNSBcdTA0MzIgXHUwNDQyXHUwNDQzIFx1MDQzNiBcdTA0M0ZcdTA0M0JcdTA0M0VcdTA0NDlcdTA0MzhcdTA0M0RcdTA0NDMsIFx1MDQzRlx1MDQzRSBcdTA0NDZcdTA0MzVcdTA0M0RcdTA0NDJcdTA0NDBcdTA0NDNcbi8vICAgICBjb25zdCBuZXdJbWcgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KFwiaW1nXCIpO1xuLy8gICAgIG5ld0ltZy5jbGFzc05hbWUgPSBcImdhbWVfX2NvbEltZyBzd2FwLW5ld1wiO1xuLy8gICAgIG5ld0ltZy5hbHQgPSBvbGRJbWcuYWx0IHx8IFwiXCI7XG4vLyAgICAgbmV3SW1nLmRlY29kaW5nID0gXCJhc3luY1wiO1xuLy8gICAgIG5ld0ltZy5zcmMgPSB0b1N5bS5zcmM7XG4vLyAgICAgbmV3SW1nLnNldEF0dHJpYnV0ZShcInNyY3NldFwiLCBgJHt0b1N5bS5zcmN9YCk7IC8vIFx1MDQzN1x1MDQzMCBcdTA0M0ZcdTA0M0VcdTA0NDJcdTA0NDBcdTA0MzVcdTA0MzFcdTA0Mzg6IFx1MDQzNFx1MDQzRVx1MDQzNFx1MDQzMFx1MDQ0Mlx1MDQzOCAyeFxuLy8gICAgIHBpYy5hcHBlbmRDaGlsZChuZXdJbWcpO1xuXG4vLyAgICAgLy8gMykgXHUwNDMzXHUwNDMwXHUwNDQwXHUwNDMwXHUwNDNEXHUwNDQyXHUwNDNFXHUwNDMyXHUwNDMwXHUwNDNEXHUwNDNFIFx1MDQ0N1x1MDQzNVx1MDQzQVx1MDQzMFx1MDQ1NFx1MDQzQ1x1MDQzRSBcdTA0MzRcdTA0MzVcdTA0M0FcdTA0M0VcdTA0MzRcdTA0NDMgOS1cdTA0M0FcdTA0MzggKFx1MDQ0OVx1MDQzRVx1MDQzMSBcdTA0M0RcdTA0MzUgXHUwNDMxXHUwNDQzXHUwNDNCXHUwNDNFIFx1MDQzQ1x1MDQzOFx1MDQzM1x1MDQzRVx1MDQ0Mlx1MDQ1Nlx1MDQzRFx1MDQzRFx1MDQ0Rilcbi8vICAgICBjb25zdCByZWFkeSA9IG5ld0ltZy5kZWNvZGUgPyBuZXdJbWcuZGVjb2RlKCkuY2F0Y2goKCkgPT4ge30pIDogUHJvbWlzZS5yZXNvbHZlKCk7XG5cbi8vICAgICByZWFkeS50aGVuKCgpID0+IHtcbi8vICAgICAgIC8vIDQpIFx1MDQzRlx1MDQ1Nlx1MDQzNFx1MDQzRFx1MDQ1Nlx1MDQzQ1x1MDQzMFx1MDQ1NFx1MDQzQ1x1MDQzRSA5LVx1MDQzQVx1MDQ0MyBcdTA0NDdcdTA0MzVcdTA0NDBcdTA0MzVcdTA0MzcgXHUwNDNEXHUwNDM1XHUwNDMyXHUwNDM1XHUwNDNCXHUwNDM4XHUwNDNBXHUwNDQzIFx1MDQzRlx1MDQzMFx1MDQ0M1x1MDQzN1x1MDQ0MyBcdTIwMTQgNy1cdTA0M0FcdTA0MzAgXHUwNDMyIFx1MDQ0Nlx1MDQzNVx1MDQzOSBcdTA0NDdcdTA0MzBcdTA0NDEgXHUyMDFDXHUwNDMxXHUwNDMwXHUwNDNDXHUwNDNGXHUwNDM4XHUwNDQyXHUwNDRDXHUwNDQxXHUwNDRGXHUyMDFEXG4vLyAgICAgICBsZXQgcmFpc2VULCBoaWRlVDtcbi8vICAgICAgIGNvbnN0IGNsZWFyVGltZXJzID0gKCkgPT4geyBpZiAocmFpc2VUKSBjbGVhclRpbWVvdXQocmFpc2VUKTsgaWYgKGhpZGVUKSBjbGVhclRpbWVvdXQoaGlkZVQpOyB9O1xuLy8gICAgICAgd2F0Y2hSZW1vdmFsT25jZShwaWMsIGNsZWFyVGltZXJzKTtcblxuLy8gICAgICAgcmVxdWVzdEFuaW1hdGlvbkZyYW1lKCgpID0+IHtcbi8vICAgICAgICAgcmFpc2VUID0gc2V0VGltZW91dCgoKSA9PiB7XG4vLyAgICAgICAgICAgcGljLmNsYXNzTGlzdC5hZGQoXCJzd2FwLXJhaXNlXCIpOyAvLyAuc3dhcC1uZXcgXHUwNDNFXHUwNDNGXHUwNDM4XHUwNDNEXHUwNDRGXHUwNDU0XHUwNDQyXHUwNDRDXHUwNDQxXHUwNDRGIFx1MDQzRlx1MDQzRVx1MDQzMlx1MDQzNVx1MDQ0MFx1MDQ0NSA3LVx1MDQzQVx1MDQzOFxuXG4vLyAgICAgICAgICAgLy8gNSkgXHUwNDQ5XHUwNDM1IFx1MDQ0Mlx1MDQ0MFx1MDQzRVx1MDQ0NVx1MDQzOCBcdTA0NDJcdTA0NDBcdTA0MzhcdTA0M0NcdTA0MzBcdTA0NTRcdTA0M0NcdTA0M0UgXHUwNDNBXHUwNDNFXHUwNDNDXHUwNDNGXHUwNDNFXHUwNDM3XHUwNDM4XHUwNDQ2XHUwNDU2XHUwNDRFIFx1MjAxNCBcdTA0NTYgXHUwNDMzXHUwNDMwXHUwNDQxXHUwNDM4XHUwNDNDXHUwNDNFIDctXHUwNDNBXHUwNDQzIChcdTA0MUJcdTA0MThcdTA0MjhcdTA0MTUgb3BhY2l0eSlcbi8vICAgICAgICAgICBoaWRlVCA9IHNldFRpbWVvdXQoKCkgPT4ge1xuLy8gICAgICAgICAgICAgY29uc3Qgb25GYWRlRW5kID0gKCkgPT4ge1xuLy8gICAgICAgICAgICAgICBvbGRJbWcucmVtb3ZlRXZlbnRMaXN0ZW5lcihcInRyYW5zaXRpb25lbmRcIiwgb25GYWRlRW5kKTtcblxuLy8gICAgICAgICAgICAgICAvLyA2KSBcdTA0M0VcdTA0NDFcdTA0NDJcdTA0MzBcdTA0NDJcdTA0M0VcdTA0NDdcdTA0M0RcdTA0M0UgXHUwNDNDXHUwNDU2XHUwNDNEXHUwNDRGXHUwNDU0XHUwNDNDXHUwNDNFIFx1MDQzQVx1MDQzRVx1MDQzRFx1MDQ0Mlx1MDQzNVx1MDQzRFx1MDQ0MiBcdTA0MzFcdTA0MzBcdTA0MzdcdTA0M0VcdTA0MzJcdTA0M0VcdTA0MzNcdTA0M0UgPGltZz4vPHNvdXJjZT4gXHUwNDNEXHUwNDMwIDktXHUwNDNBXHUwNDQzXG4vLyAgICAgICAgICAgICAgIGlmIChzb3VyY2UpIHtcbi8vICAgICAgICAgICAgICAgICBzb3VyY2Uuc2V0QXR0cmlidXRlKFwic3Jjc2V0XCIsIGAke3RvU3ltLnNyY30gMXgsICR7dG9TeW0uc3JjMnh9IDJ4YCk7XG4vLyAgICAgICAgICAgICAgIH1cbi8vICAgICAgICAgICAgICAgb2xkSW1nLnNyYyA9IHRvU3ltLnNyYztcbi8vICAgICAgICAgICAgICAgb2xkSW1nLnNldEF0dHJpYnV0ZShcInNyY3NldFwiLCBgJHt0b1N5bS5zcmN9YCk7XG5cbi8vICAgICAgICAgICAgICAgLy8gXHUwNDNGXHUwNDQwXHUwNDM4XHUwNDMxXHUwNDM4XHUwNDQwXHUwNDMwXHUwNDU0XHUwNDNDXHUwNDNFIFx1MDQ0MVx1MDQzQlx1MDQ0M1x1MDQzNlx1MDQzMVx1MDQzRVx1MDQzMlx1MDQ1NiBcdTA0M0FcdTA0M0JcdTA0MzBcdTA0NDFcdTA0MzgvXHUwNDMyXHUwNDQzXHUwNDM3XHUwNDNCXHUwNDM4XG4vLyAgICAgICAgICAgICAgIG9sZEltZy5jbGFzc0xpc3QucmVtb3ZlKFwiZmFkZS1vdXRcIiwgXCJzd2FwLW9sZFwiLCBcImlzLWJ1bXBpbmdcIik7XG4vLyAgICAgICAgICAgICAgIG9sZEltZy5zdHlsZS5vcGFjaXR5ID0gXCJcIjtcbi8vICAgICAgICAgICAgICAgaWYgKG5ld0ltZy5wYXJlbnROb2RlKSBuZXdJbWcucGFyZW50Tm9kZS5yZW1vdmVDaGlsZChuZXdJbWcpO1xuLy8gICAgICAgICAgICAgICBwaWMuY2xhc3NMaXN0LnJlbW92ZShcInN3YXAtcmFpc2VcIiwgXCJzd2FwLWFuaW1cIik7XG5cbi8vICAgICAgICAgICAgICAgLy8gXHUwNDQ0XHUwNDU2XHUwNDNBXHUwNDQxXHUwNDQzXHUwNDU0XHUwNDNDXHUwNDNFLCBcdTA0NDlcdTA0M0UgXHUwNDQyXHUwNDQzXHUwNDQyIFx1MDQ0Mlx1MDQzNVx1MDQzRlx1MDQzNVx1MDQ0MCB0b0lkXG4vLyAgICAgICAgICAgICAgIHBpYy5kYXRhc2V0LnN5bWJvbCA9IFN0cmluZyh0b0lkKTtcblxuLy8gICAgICAgICAgICAgICByZXNvbHZlKCk7XG4vLyAgICAgICAgICAgICB9O1xuXG4vLyAgICAgICAgICAgICAvLyBcdTA0NDFcdTA0MzBcdTA0M0MgXHUwNDQ0XHUwNDM1XHUwNDM5XHUwNDM0LVx1MDQzMFx1MDQ0M1x1MDQ0MiA3LVx1MDQzQVx1MDQzOCAoXHUwNDQyXHUwNDU2XHUwNDNCXHUwNDRDXHUwNDNBXHUwNDM4IG9wYWNpdHkgXHUyMTkyIFx1MDQzRFx1MDQ0M1x1MDQzQlx1MDQ0QyBcdTA0NDBcdTA0MzVcdTA0NDRcdTA0M0JcdTA0M0VcdTA0NDMhKVxuLy8gICAgICAgICAgICAgb2xkSW1nLmFkZEV2ZW50TGlzdGVuZXIoXCJ0cmFuc2l0aW9uZW5kXCIsIG9uRmFkZUVuZCk7XG4vLyAgICAgICAgICAgICBvbGRJbWcuY2xhc3NMaXN0LmFkZChcImZhZGUtb3V0XCIpO1xuXG4vLyAgICAgICAgICAgICAvLyBcdTA0NDFcdTA0NDJcdTA0NDBcdTA0MzBcdTA0NDVcdTA0M0VcdTA0MzJcdTA0M0FcdTA0MzAsIFx1MDQ0Rlx1MDQzQVx1MDQ0OVx1MDQzRSB0cmFuc2l0aW9uZW5kIFx1MDQzRFx1MDQzNSBcdTA0M0ZcdTA0NDBcdTA0MzhcdTA0M0JcdTA0MzVcdTA0NDJcdTA0MzhcdTA0NDJcdTA0NENcbi8vICAgICAgICAgICAgIHNldFRpbWVvdXQob25GYWRlRW5kLCBGQURFX01TICsgODApO1xuLy8gICAgICAgICAgIH0sIEhJREVfREVMQVkpO1xuLy8gICAgICAgICB9LCBSQUlTRV9ERUxBWSk7XG4vLyAgICAgICB9KTtcbi8vICAgICB9KTtcbi8vICAgfSkpO1xuXG4vLyAgIHJldHVybiBQcm9taXNlLmFsbCh0YXNrcyk7XG4vLyB9XG5cblxuXG5cbi8vIC8qKiBcdTA0MUVcdTA0MzRcdTA0M0RcdTA0M0VcdTA0NDBcdTA0MzBcdTA0MzdcdTA0M0VcdTA0MzJcdTA0M0UgXHUwNDQxXHUwNDNGXHUwNDNFXHUwNDQxXHUwNDQyXHUwNDM1XHUwNDQwXHUwNDU2XHUwNDMzXHUwNDMwXHUwNDU0XHUwNDNDXHUwNDNFIFx1MDQzMlx1MDQzOFx1MDQzNFx1MDQzMFx1MDQzQlx1MDQzNVx1MDQzRFx1MDQzRFx1MDQ0RiBjaGlsZEVsIFx1MDQ1Nlx1MDQzNyBET00gXHUwNDU2IFx1MDQzMlx1MDQzOFx1MDQzQVx1MDQzQlx1MDQzOFx1MDQzQVx1MDQzMFx1MDQ1NFx1MDQzQ1x1MDQzRSBcdTA0M0FcdTA0M0VcdTA0M0JcdTA0MzFcdTA0MzVcdTA0M0EgKi9cbi8vIGZ1bmN0aW9uIHdhdGNoUmVtb3ZhbE9uY2UoY2hpbGRFbCwgb25SZW1vdmVkKSB7XG4vLyAgIGNvbnN0IHBhcmVudCA9IGNoaWxkRWwucGFyZW50Tm9kZTtcbi8vICAgaWYgKCFwYXJlbnQpIHJldHVybjtcblxuLy8gICBjb25zdCBvYnMgPSBuZXcgTXV0YXRpb25PYnNlcnZlcigobXV0YXRpb25zKSA9PiB7XG4vLyAgICAgZm9yIChjb25zdCBtIG9mIG11dGF0aW9ucykge1xuLy8gICAgICAgZm9yIChjb25zdCBub2RlIG9mIG0ucmVtb3ZlZE5vZGVzKSB7XG4vLyAgICAgICAgIGlmIChub2RlID09PSBjaGlsZEVsKSB7XG4vLyAgICAgICAgICAgdHJ5IHsgb25SZW1vdmVkKCk7IH1cbi8vICAgICAgICAgICBmaW5hbGx5IHsgb2JzLmRpc2Nvbm5lY3QoKTsgfVxuLy8gICAgICAgICAgIHJldHVybjtcbi8vICAgICAgICAgfVxuLy8gICAgICAgfVxuLy8gICAgIH1cbi8vICAgfSk7XG5cbi8vICAgb2JzLm9ic2VydmUocGFyZW50LCB7IGNoaWxkTGlzdDogdHJ1ZSB9KTtcbi8vIH1cblxuXG4vLyBqcy9nYW1lLmpzIChFUyBtb2R1bGUpXG5cbi8qKiBcdTA0MTBcdTA0NDFcdTA0MzVcdTA0NDJcdTA0MzggXHUwNDQxXHUwNDNCXHUwNDNFXHUwNDQyLVx1MDQ0MVx1MDQzOFx1MDQzQ1x1MDQzMlx1MDQzRVx1MDQzQlx1MDQ1Nlx1MDQzMiAqL1xuY29uc3QgU1lNQk9MUyA9IHtcbiAgMTogeyBzcmM6IFwiLi9pbWcvbWFpbkNvbnRhaW5lci9nYW1lSW1nXzFfMXgud2VicFwiLCBzcmMyeDogXCIuL2ltZy9tYWluQ29udGFpbmVyL2dhbWVJbWdfMV8yeC53ZWJwXCIgfSxcbiAgMjogeyBzcmM6IFwiLi9pbWcvbWFpbkNvbnRhaW5lci9nYW1lSW1nXzJfMXgud2VicFwiLCBzcmMyeDogXCIuL2ltZy9tYWluQ29udGFpbmVyL2dhbWVJbWdfMl8yeC53ZWJwXCIgfSxcbiAgMzogeyBzcmM6IFwiLi9pbWcvbWFpbkNvbnRhaW5lci9nYW1lSW1nXzNfMXgud2VicFwiLCBzcmMyeDogXCIuL2ltZy9tYWluQ29udGFpbmVyL2dhbWVJbWdfM18yeC53ZWJwXCIgfSxcbiAgNDogeyBzcmM6IFwiLi9pbWcvbWFpbkNvbnRhaW5lci9nYW1lSW1nXzRfMXgud2VicFwiLCBzcmMyeDogXCIuL2ltZy9tYWluQ29udGFpbmVyL2dhbWVJbWdfNF8yeC53ZWJwXCIgfSxcbiAgNTogeyBzcmM6IFwiLi9pbWcvbWFpbkNvbnRhaW5lci9nYW1lSW1nXzVfMXgud2VicFwiLCBzcmMyeDogXCIuL2ltZy9tYWluQ29udGFpbmVyL2dhbWVJbWdfNV8yeC53ZWJwXCIgfSxcbiAgNjogeyBzcmM6IFwiLi9pbWcvbWFpbkNvbnRhaW5lci9nYW1lSW1nXzZfMXgud2VicFwiLCBzcmMyeDogXCIuL2ltZy9tYWluQ29udGFpbmVyL2dhbWVJbWdfNl8yeC53ZWJwXCIgfSxcbiAgNzogeyBzcmM6IFwiLi9pbWcvbWFpbkNvbnRhaW5lci9nYW1lSW1nXzdfMXgud2VicFwiLCBzcmMyeDogXCIuL2ltZy9tYWluQ29udGFpbmVyL2dhbWVJbWdfN18yeC53ZWJwXCIgfSxcbiAgODogeyBzcmM6IFwiLi9pbWcvbWFpbkNvbnRhaW5lci9nYW1lSW1nXzhfMXgud2VicFwiLCBzcmMyeDogXCIuL2ltZy9tYWluQ29udGFpbmVyL2dhbWVJbWdfOF8yeC53ZWJwXCIgfSxcbiAgOTogeyBzcmM6IFwiLi9pbWcvbWFpbkNvbnRhaW5lci9nYW1lSW1nX3dpbl8xeC53ZWJwXCIsIHNyYzJ4OiBcIi4vaW1nL21haW5Db250YWluZXIvZ2FtZUltZ193aW5fMngud2VicFwiIH0sXG59O1xuXG4vKiogXHUwNDI2XHUwNDU2XHUwNDNCXHUwNDRDXHUwNDNFXHUwNDMyXHUwNDMwIFx1MDQ0MVx1MDQ1Nlx1MDQ0Mlx1MDQzQVx1MDQzMCBcdTA0MzJcdTA0MzhcdTA0MzNcdTA0NDBcdTA0MzBcdTA0NDhcdTA0NDMgKFx1MDQ0Rlx1MDQzQVx1MDQ1NiBcdTA0NDFcdTA0MzhcdTA0M0NcdTA0MzJcdTA0M0VcdTA0M0JcdTA0MzggXHUwNDNDXHUwNDMwXHUwNDRFXHUwNDQyXHUwNDRDIFx1MDQzN1x1MDQzMFx1MDQzOVx1MDQ0Mlx1MDQzOCBcdTA0M0ZcdTA0NTZcdTA0NDFcdTA0M0JcdTA0NEYgXHUyMDFDXHUwNDNGXHUwNDM1XHUwNDQwXHUwNDM1XHUwNDM3XHUwNDMwXHUwNDQwXHUwNDRGXHUwNDM0XHUwNDNBXHUwNDM4XHUyMDFEKSAqL1xuY29uc3QgV0lOX0dSSUQgPSBbXG4gIFs2LCA1LCA0LCA1LCA0LCAzLCA3LCAyXSxcbiAgWzEsIDIsIDIsIDUsIDMsIDcsIDQsIDRdLFxuICBbNCwgNiwgOCwgMSwgNywgMywgMywgM10sXG4gIFs4LCAzLCAxLCA3LCA0LCA4LCAxLCAzXSxcbiAgWzIsIDIsIDcsIDgsIDYsIDIsIDgsIDZdLFxuICBbMSwgNywgNiwgOCwgMSwgMSwgNCwgMl0sXG5dO1xuXG4vKiA9PT09PT09PT09PT09PT09PSBcdTA0MUZcdTA0MjNcdTA0MTFcdTA0MUJcdTA0MDZcdTA0MjdcdTA0MURcdTA0MThcdTA0MTkgQVBJID09PT09PT09PT09PT09PT09ICovXG5cbi8qKlxuICogXHUwNDA2XHUwNDNEXHUwNDU2XHUwNDQ2XHUwNDU2XHUwNDMwXHUwNDNCXHUwNDU2XHUwNDM3XHUwNDMwXHUwNDQ2XHUwNDU2XHUwNDRGIFx1MDQzM1x1MDQ0MFx1MDQzOC5cbiAqIFx1MDQxM1x1MDQzRVx1MDQ0Mlx1MDQ0M1x1MDQ1NCBcdTA0M0FcdTA0MzBcdTA0NDFcdTA0M0FcdTA0MzBcdTA0MzQgPHBpY3R1cmU+LCBcdTA0NDdcdTA0NTZcdTA0M0ZcdTA0M0JcdTA0NEZcdTA0NTQgXHUwNDQ1XHUwNDM1XHUwNDNEXHUwNDM0XHUwNDNCXHUwNDM1XHUwNDQwXHUwNDM4LCBcdTA0NDhcdTA0NDJcdTA0M0VcdTA0MzJcdTA0NDVcdTA0MzBcdTA0NTQgXHUwNDMwXHUwNDNEXHUwNDU2XHUwNDNDXHUwNDMwXHUwNDQ2XHUwNDU2XHUwNDU3IFx1MDQ1NiBcdTA0NDhcdTA0M0JcdTA0MzUgXCJzbG90OmJpZ3dpblwiLlxuICovXG5leHBvcnQgZnVuY3Rpb24gaW5pdEdhbWUoKSB7XG4gIC8vIDEpIFx1MDQxRlx1MDQ1Nlx1MDQzNFx1MDQzM1x1MDQzRVx1MDQ0Mlx1MDQzRVx1MDQzMlx1MDQzQVx1MDQzMCBcdTA0M0FcdTA0MzBcdTA0NDFcdTA0M0FcdTA0MzBcdTA0MzRcdTA0NDMgXHUyMDE0IFx1MDQ0MFx1MDQzRVx1MDQzN1x1MDQ0MVx1MDQ0Mlx1MDQzMFx1MDQzMlx1MDQzQlx1MDQ0Rlx1MDQ1NCBcdTA0MzdcdTA0MzBcdTA0NDJcdTA0NDBcdTA0MzhcdTA0M0NcdTA0M0FcdTA0MzggXHUwNDU2IFx1MDQzQ1x1MDQ1Nlx1MDQ0Mlx1MDQzQVx1MDQzOFxuICBwcmVwYXJlUGljdHVyZUNhc2NhZGUoKTtcblxuICAvLyAyKSBcdTA0MTVcdTA0M0JcdTA0MzVcdTA0M0NcdTA0MzVcdTA0M0RcdTA0NDJcdTA0MzggXHUwNDNBXHUwNDM1XHUwNDQwXHUwNDQzXHUwNDMyXHUwNDMwXHUwNDNEXHUwNDNEXHUwNDRGXG4gIGNvbnN0IGJ0biA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoXCIubWFpbkNvbnRlbnRfX2J0blwiKTtcbiAgY29uc3QgZ2FtZSA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoXCIuZ2FtZVwiKTtcbiAgaWYgKCFidG4gfHwgIWdhbWUpIHJldHVybjtcblxuICAvLyAzKSBcdTA0MUFcdTA0M0JcdTA0NTZcdTA0M0EgXHUyMDE0IFx1MDQzRVx1MDQzNFx1MDQzOFx1MDQzRCBcdTA0NDFcdTA0M0ZcdTA0NTZcdTA0M0RcbiAgYnRuLmFkZEV2ZW50TGlzdGVuZXIoXCJjbGlja1wiLCAoZSkgPT4ge1xuICAgIGUucHJldmVudERlZmF1bHQoKTtcbiAgICAvLyBpZiAobG9jYWxTdG9yYWdlLmdldEl0ZW0oXCJnYW1lLXNwdW5cIikgPT09IFwidHJ1ZVwiKSByZXR1cm47XG4gICAgaWYgKGdhbWUuY2xhc3NMaXN0LmNvbnRhaW5zKFwiaXMtc3B1blwiKSkgcmV0dXJuO1xuXG4gICAgZ2FtZS5jbGFzc0xpc3QuYWRkKFwiaXMtc3B1blwiKTtcbiAgICBidG4uc2V0QXR0cmlidXRlKFwiYXJpYS1kaXNhYmxlZFwiLCBcInRydWVcIik7XG4gICAgYnRuLnNldEF0dHJpYnV0ZShcImRpc2FibGVkXCIsIFwiXCIpO1xuICAgIGxvY2FsU3RvcmFnZS5zZXRJdGVtKFwiZ2FtZS1zcHVuXCIsIFwidHJ1ZVwiKTtcblxuICAgIC8vIFx1MDQxMlx1MDQxMFx1MDQxNlx1MDQxQlx1MDQxOFx1MDQxMlx1MDQxRTogXHUwNDQxXHUwNDNGXHUwNDNFXHUwNDQ3XHUwNDMwXHUwNDQyXHUwNDNBXHUwNDQzIFx1MDQzRlx1MDQ0MFx1MDQzNVx1MDQzQlx1MDQzRVx1MDQzMFx1MDQzNFx1MDQzOFx1MDQzQ1x1MDQzRSBcdTA0MzJcdTA0NDFcdTA0NTYgXHUwNDM3XHUwNDNFXHUwNDMxXHUwNDQwXHUwNDMwXHUwNDM2XHUwNDM1XHUwNDNEXHUwNDNEXHUwNDRGLCBcdTA0M0ZcdTA0M0VcdTA0NDJcdTA0NTZcdTA0M0MgXHUyMDE0IFx1MDQzRlx1MDQ1Nlx1MDQzNFx1MDQzQVx1MDQzQlx1MDQzMFx1MDQzNFx1MDQzMFx1MDQ1NFx1MDQzQ1x1MDQzRSBcdTA0NTYgXHUwNDM3XHUwNDMwXHUwNDNGXHUwNDQzXHUwNDQxXHUwNDNBXHUwNDMwXHUwNDU0XHUwNDNDXHUwNDNFIFx1MDQzQVx1MDQzMFx1MDQ0MVx1MDQzQVx1MDQzMFx1MDQzNFxuICAgIHByZWxvYWRTeW1ib2xzKFNZTUJPTFMpLnRoZW4oKCkgPT4ge1xuICAgICAgYXBwbHlXaW5HcmlkKFNZTUJPTFMsIFdJTl9HUklEKTtcbiAgICAgIHN0YXJ0UGljdHVyZUNhc2NhZGUoKTtcbiAgICB9KTtcblxuICAgIC8vIFx1MDQzRVx1MDQzRlx1MDQ0Nlx1MDQ1Nlx1MDQzRVx1MDQzRFx1MDQzMFx1MDQzQlx1MDQ0Q1x1MDQzRFx1MDQzRTogXHUwNDNGXHUwNDNFXHUwNDNBXHUwNDMwXHUwNDM3IHdpbi1zZWN0b3IgXHUwNDNEXHUwNDMwIFx1MDQ0NFx1MDQ1Nlx1MDQzRFx1MDQ1Nlx1MDQ0OFx1MDQ1NiBcdTA0M0VcdTA0NDFcdTA0NDJcdTA0MzBcdTA0M0RcdTA0M0RcdTA0NENcdTA0M0VcdTA0MzNcdTA0M0UgXHUwNDM0XHUwNDQwXHUwNDNFXHUwNDNGXHUwNDMwXG4gICAgY29uc3QgbGFzdERyb3AgPSBnYW1lLnF1ZXJ5U2VsZWN0b3IoXCIuZ2FtZV9fY29sOm50aC1jaGlsZCg2KSAuZ2FtZV9fY29sSW1nLS02NlwiKTtcbiAgICBsYXN0RHJvcD8uYWRkRXZlbnRMaXN0ZW5lcihcbiAgICAgIFwiYW5pbWF0aW9uZW5kXCIsXG4gICAgICAoKSA9PiB7XG4gICAgICAgIGNvbnN0IHdzID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvcihcIi5nYW1lX193aW5TZWN0b3JcIik/LnN0eWxlO1xuICAgICAgICBpZiAod3MpIHdzLmRpc3BsYXkgPSBcImJsb2NrXCI7XG4gICAgICB9LFxuICAgICAgeyBvbmNlOiB0cnVlIH1cbiAgICApO1xuICB9KTtcblxuICAvLyA0KSBcdTA0MkZcdTA0M0FcdTA0NDlcdTA0M0UgXHUwNDMyXHUwNDM2XHUwNDM1IFx1MDQzQVx1MDQ0MFx1MDQ0M1x1MDQ0Mlx1MDQzOFx1MDQzQlx1MDQzOCBcdTIwMTQgXHUwNDNFXHUwNDM0XHUwNDQwXHUwNDMwXHUwNDM3XHUwNDQzIFx1MDQ0MVx1MDQzOFx1MDQzM1x1MDQzRFx1MDQzMFx1MDQzQlx1MDQ1Nlx1MDQzN1x1MDQ0M1x1MDQ1NFx1MDQzQ1x1MDQzRVxuICAvLyBpZiAobG9jYWxTdG9yYWdlLmdldEl0ZW0oXCJnYW1lLXNwdW5cIikgPT09IFwidHJ1ZVwiKSB7XG4gIC8vICAgYnRuPy5zZXRBdHRyaWJ1dGUoXCJhcmlhLWRpc2FibGVkXCIsIFwidHJ1ZVwiKTtcbiAgLy8gICBidG4/LnNldEF0dHJpYnV0ZShcImRpc2FibGVkXCIsIFwiXCIpO1xuICAvLyAgIHJlcXVlc3RBbmltYXRpb25GcmFtZSgoKSA9PlxuICAvLyAgICAgZG9jdW1lbnQuZGlzcGF0Y2hFdmVudChuZXcgQ3VzdG9tRXZlbnQoXCJzbG90OmJpZ3dpblwiKSlcbiAgLy8gICApO1xuICAvLyB9XG59XG5cbi8qID09PT09PT09PT09PT09PT09IGhlbHBlcnMgKFx1MDQzMlx1MDQzRFx1MDQ0M1x1MDQ0Mlx1MDQ0MFx1MDQ1Nlx1MDQ0OFx1MDQzRFx1MDQ1NikgPT09PT09PT09PT09PT09PT0gKi9cblxuLyoqIFx1MDQxRlx1MDQ0MFx1MDQzNVx1MDQzQlx1MDQzRVx1MDQzMFx1MDQzNCBcdTA0NTYgXHUwNDM0XHUwNDM1XHUwNDNBXHUwNDNFXHUwNDM0XHUwNDQzXHUwNDMyXHUwNDMwXHUwNDNEXHUwNDNEXHUwNDRGIFx1MDQzMlx1MDQ0MVx1MDQ1Nlx1MDQ0NSBcdTA0NDFcdTA0MzhcdTA0M0NcdTA0MzJcdTA0M0VcdTA0M0JcdTA0NTZcdTA0MzIgKFNhZmFyaS1zYWZlKSAqL1xuZnVuY3Rpb24gcHJlbG9hZFN5bWJvbHMoc3ltYm9scykge1xuICBjb25zdCB0YXNrcyA9IFtdO1xuICBmb3IgKGNvbnN0IHsgc3JjLCBzcmMyeCB9IG9mIE9iamVjdC52YWx1ZXMoc3ltYm9scykpIHtcbiAgICBmb3IgKGNvbnN0IHVybCBvZiBbc3JjLCBzcmMyeF0pIHtcbiAgICAgIGlmICghdXJsKSBjb250aW51ZTtcbiAgICAgIHRhc2tzLnB1c2goXG4gICAgICAgIG5ldyBQcm9taXNlKChyZXMpID0+IHtcbiAgICAgICAgICBjb25zdCBpbSA9IG5ldyBJbWFnZSgpO1xuICAgICAgICAgIGltLmRlY29kaW5nID0gXCJhc3luY1wiO1xuICAgICAgICAgIGltLm9ubG9hZCA9IGltLm9uZXJyb3IgPSAoKSA9PiByZXMoKTtcbiAgICAgICAgICBpbS5zcmMgPSB1cmw7XG4gICAgICAgICAgaWYgKGltLmRlY29kZSkgaW0uZGVjb2RlKCkuY2F0Y2goKCkgPT4ge30pO1xuICAgICAgICB9KVxuICAgICAgKTtcbiAgICB9XG4gIH1cbiAgcmV0dXJuIFByb21pc2UuYWxsKHRhc2tzKTtcbn1cblxuLyoqIFx1MDQxRlx1MDQ1Nlx1MDQzNFx1MDQ0MVx1MDQ0Mlx1MDQzMFx1MDQzMlx1MDQzQlx1MDQ0Rlx1MDQ1NFx1MDQzQ1x1MDQzRSBcdTA0M0NcdTA0MzBcdTA0MzlcdTA0MzFcdTA0NDNcdTA0NDJcdTA0M0RcdTA0NTYgXHUwNDQxXHUwNDM4XHUwNDNDXHUwNDMyXHUwNDNFXHUwNDNCXHUwNDM4IFx1MDQ0MyBkYXRhLVx1MDQzMFx1MDQ0Mlx1MDQ0MFx1MDQzOFx1MDQzMVx1MDQ0M1x1MDQ0Mlx1MDQzOCBcdTA0M0ZcdTA0NTZcdTA0MzQgXHUwNDQ3XHUwNDMwXHUwNDQxIE9VVCAqL1xuZnVuY3Rpb24gYXBwbHlXaW5HcmlkKHN5bWJvbHMsIHdpbkdyaWQpIHtcbiAgY29uc3QgZ2FtZSA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoXCIuZ2FtZVwiKTtcbiAgaWYgKCFnYW1lKSByZXR1cm47XG5cbiAgY29uc3QgY29scyA9IEFycmF5LmZyb20oZ2FtZS5xdWVyeVNlbGVjdG9yQWxsKFwiLmdhbWVfX2NvbFwiKSk7XG4gIGNvbnN0IEMgPSBjb2xzLmxlbmd0aDtcbiAgaWYgKCFDKSByZXR1cm47XG5cbiAgY29uc3QgUiA9IE1hdGgubWluKC4uLmNvbHMubWFwKChjb2wpID0+IGNvbC5xdWVyeVNlbGVjdG9yQWxsKFwiOnNjb3BlID4gcGljdHVyZVwiKS5sZW5ndGgpKTtcbiAgaWYgKCFSKSByZXR1cm47XG5cbiAgY29uc3QgYXQgPSAociwgYykgPT4gY29sc1tjXS5xdWVyeVNlbGVjdG9yQWxsKFwiOnNjb3BlID4gcGljdHVyZVwiKVtyXTtcblxuICBmb3IgKGxldCBjID0gMDsgYyA8IEM7IGMrKykge1xuICAgIGNvbnN0IGNvbEdyaWQgPSB3aW5HcmlkW2NdO1xuICAgIGlmICghQXJyYXkuaXNBcnJheShjb2xHcmlkKSkgY29udGludWU7XG5cbiAgICBmb3IgKGxldCByID0gMDsgciA8IFI7IHIrKykge1xuICAgICAgY29uc3QgcGljID0gYXQociwgYyk7XG4gICAgICBpZiAoIXBpYykgY29udGludWU7XG5cbiAgICAgIGNvbnN0IHN5bUlkID0gY29sR3JpZFtyXTtcbiAgICAgIGNvbnN0IHN5bSA9IHN5bWJvbHNbc3ltSWRdO1xuICAgICAgaWYgKCFzeW0pIGNvbnRpbnVlO1xuXG4gICAgICBwaWMuc2V0QXR0cmlidXRlKFwiZGF0YS1uZXh0LWlkXCIsIFN0cmluZyhzeW1JZCkpO1xuICAgICAgcGljLnNldEF0dHJpYnV0ZShcImRhdGEtbmV4dC1zcmNcIiwgc3ltLnNyYyk7XG4gICAgICBwaWMuc2V0QXR0cmlidXRlKFwiZGF0YS1uZXh0LXNyY3NldFwiLCBgJHtzeW0uc3JjfSAxeCwgJHtzeW0uc3JjMnh9IDJ4YCk7XG4gICAgfVxuICB9XG59XG5cbi8qKiBcdTA0MjBcdTA0M0VcdTA0MzdcdTA0NDBcdTA0MzBcdTA0NDVcdTA0NDNcdTA0M0RcdTA0M0VcdTA0M0EgXHUwNDM3XHUwNDMwXHUwNDQyXHUwNDQwXHUwNDM4XHUwNDNDXHUwNDNFXHUwNDNBIE9VVC9JTiwgXHUwNDNDXHUwNDU2XHUwNDQyXHUwNDNBXHUwNDMwIC5maW5hbC1pbiwgZGF0YS1pbi1lbmQgXHUwNDM0XHUwNDNCXHUwNDRGIFx1MDQ0NFx1MDQzRVx1MDQzQlx1MDQzMVx1MDQzNVx1MDQzQVx1MDQ0MyAqL1xuZnVuY3Rpb24gcHJlcGFyZVBpY3R1cmVDYXNjYWRlKCkge1xuICBjb25zdCBnYW1lID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvcihcIi5nYW1lXCIpO1xuICBpZiAoIWdhbWUpIHJldHVybjtcblxuICBjb25zdCBjb2xzID0gQXJyYXkuZnJvbShnYW1lLnF1ZXJ5U2VsZWN0b3JBbGwoXCIuZ2FtZV9fY29sXCIpKTtcbiAgY29uc3QgQyA9IGNvbHMubGVuZ3RoO1xuICBpZiAoIUMpIHJldHVybjtcblxuICBjb25zdCBSID0gTWF0aC5taW4oLi4uY29scy5tYXAoKGNvbCkgPT4gY29sLnF1ZXJ5U2VsZWN0b3JBbGwoXCI6c2NvcGUgPiBwaWN0dXJlXCIpLmxlbmd0aCkpO1xuICBpZiAoIVIpIHJldHVybjtcblxuICBjb25zdCBjcyA9IGdldENvbXB1dGVkU3R5bGUoZ2FtZSk7XG4gIGNvbnN0IHN0ZXBPdXQgPSBwYXJzZUZsb2F0KGNzLmdldFByb3BlcnR5VmFsdWUoXCItLXN0ZXAtb3V0XCIpKSB8fCAwLjA2O1xuICBjb25zdCBzdGVwSW4gID0gcGFyc2VGbG9hdChjcy5nZXRQcm9wZXJ0eVZhbHVlKFwiLS1zdGVwLWluXCIpKSAgfHwgc3RlcE91dDtcbiAgY29uc3QgZHVyICAgICA9IHBhcnNlRmxvYXQoY3MuZ2V0UHJvcGVydHlWYWx1ZShcIi0tZHVyXCIpKSAgICAgIHx8IDAuMzY7XG4gIGNvbnN0IGNvbFN0YWcgPSBwYXJzZUZsb2F0KGNzLmdldFByb3BlcnR5VmFsdWUoXCItLWNvbC1zdGFnZ2VyXCIpKSB8fCAwLjE7XG5cbiAgY29uc3QgYXQgPSAociwgYykgPT4gY29sc1tjXS5xdWVyeVNlbGVjdG9yQWxsKFwiOnNjb3BlID4gcGljdHVyZVwiKVtyXTtcblxuICBsZXQgbWF4RGVsYXlJbiA9IC0xO1xuICBsZXQgbWF4UGljID0gbnVsbDtcblxuICBmb3IgKGxldCBjID0gMDsgYyA8IEM7IGMrKykge1xuICAgIGNvbnN0IGNvbE9mZnNldCA9IGMgKiBjb2xTdGFnO1xuXG4gICAgZm9yIChsZXQgciA9IDA7IHIgPCBSOyByKyspIHtcbiAgICAgIGNvbnN0IHBpYyA9IGF0KHIsIGMpO1xuICAgICAgaWYgKCFwaWMpIGNvbnRpbnVlO1xuXG4gICAgICBjb25zdCBkZWxheU91dCA9IGNvbE9mZnNldCArIChSIC0gMSAtIHIpICogc3RlcE91dDtcbiAgICAgIHBpYy5zdHlsZS5zZXRQcm9wZXJ0eShcIi0tZGVsYXktb3V0XCIsIGAke2RlbGF5T3V0fXNgKTtcblxuICAgICAgY29uc3QgZW50ZXJTdGFydCA9IGNvbE9mZnNldCArIDIgKiBzdGVwT3V0ICsgZHVyO1xuICAgICAgY29uc3QgZGVsYXlJbiA9IGVudGVyU3RhcnQgKyAoUiAtIDEgLSByKSAqIHN0ZXBJbjtcbiAgICAgIHBpYy5zdHlsZS5zZXRQcm9wZXJ0eShcIi0tZGVsYXktaW5cIiwgYCR7ZGVsYXlJbn1zYCk7XG5cbiAgICAgIGlmIChkZWxheUluID4gbWF4RGVsYXlJbikge1xuICAgICAgICBtYXhEZWxheUluID0gZGVsYXlJbjtcbiAgICAgICAgbWF4UGljID0gcGljO1xuICAgICAgfVxuICAgIH1cbiAgfVxuXG4gIGlmIChtYXhQaWMpIG1heFBpYy5jbGFzc0xpc3QuYWRkKFwiZmluYWwtaW5cIik7XG5cbiAgLy8gXHUwNDMyXHUwNDM1XHUwNDQwXHUwNDQ1IFx1MDQzRVx1MDQ0MVx1MDQ0Mlx1MDQzMFx1MDQzRFx1MDQzRFx1MDQ0Q1x1MDQzRVx1MDQ1NyBcdTA0M0FcdTA0M0VcdTA0M0JcdTA0M0VcdTA0M0RcdTA0M0FcdTA0MzggXHUyMDE0IFx1MDQzQ1x1MDQzMFx1MDQ0MFx1MDQzQVx1MDQzNVx1MDQ0MCBcdTA0MzRcdTA0M0JcdTA0NEYgXHUwNDQxXHUwNDNCXHUwNDQzXHUwNDQ1XHUwNDMwXHUwNDQ3XHUwNDMwIFx1MjAxQ1x1MDQzRVx1MDQ0MVx1MDQ0Mlx1MDQzMFx1MDQzRFx1MDQzRFx1MDQ0Q1x1MDQzRVx1MDQzM1x1MDQzRSBcdTA0MzRcdTA0NDBcdTA0M0VcdTA0M0ZcdTA0MzBcdTIwMURcbiAgY29uc3QgdG9wTGFzdCA9IGF0KDAsIEMgLSAxKTtcbiAgdG9wTGFzdD8uY2xhc3NMaXN0LmFkZChcImdhbWVfX2NvbEltZy0tNjZcIik7XG5cbiAgLy8gXHUwNDM3XHUwNDMwXHUwNDMzXHUwNDMwXHUwNDNCXHUwNDRDXHUwNDNEXHUwNDM4XHUwNDM5IFx1MDQ0N1x1MDQzMFx1MDQ0MSBcdTA0MzdcdTA0MzBcdTA0MzJcdTA0MzVcdTA0NDBcdTA0NDhcdTA0MzVcdTA0M0RcdTA0M0RcdTA0NEYgSU4tXHUwNDNBXHUwNDMwXHUwNDQxXHUwNDNBXHUwNDMwXHUwNDM0XHUwNDQzIChcdTA0NDFcdTA0MzVcdTA0M0FcdTA0NDNcdTA0M0RcdTA0MzRcdTA0MzgpXG4gIGlmIChnYW1lICYmIG1heERlbGF5SW4gPj0gMCkge1xuICAgIGdhbWUuZGF0YXNldC5pbkVuZCA9IFN0cmluZyhtYXhEZWxheUluICsgZHVyKTtcbiAgfVxufVxuXG4vKiogXHUwNDE3XHUwNDMwXHUwNDNGXHUwNDQzXHUwNDQxXHUwNDNBIE9VVC9JTjsgXHUwNDNEXHUwNDMwIFx1MDQ0NFx1MDQ1Nlx1MDQzRFx1MDQzMFx1MDQzQlx1MDQ1NiBcdTIwMTQgXHUwNDMwXHUwNDNEXHUwNDU2XHUwNDNDXHUwNDNFXHUwNDMyXHUwNDMwXHUwNDNEXHUwNDM4XHUwNDM5IFx1MDQ0MVx1MDQzMlx1MDQzRVx1MDQzRiA3XHUyMTkyOSwgXHUwNDM0XHUwNDMwXHUwNDNCXHUwNDU2IFx1MDQ0OFx1MDQzQlx1MDQzNVx1MDQzQ1x1MDQzRSBcInNsb3Q6Ymlnd2luXCIgKi9cbmZ1bmN0aW9uIHN0YXJ0UGljdHVyZUNhc2NhZGUoKSB7XG4gIGNvbnN0IGdhbWUgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKFwiLmdhbWVcIik7XG4gIGlmICghZ2FtZSkgcmV0dXJuO1xuXG4gIGNvbnN0IHBpY3MgPSBBcnJheS5mcm9tKGdhbWUucXVlcnlTZWxlY3RvckFsbChcIi5nYW1lX19jb2wgPiBwaWN0dXJlXCIpKTtcbiAgaWYgKCFwaWNzLmxlbmd0aCkgcmV0dXJuO1xuXG4gIC8vIDEpIE9VVFxuICByZXF1ZXN0QW5pbWF0aW9uRnJhbWUoKCkgPT4ge1xuICAgIHBpY3MuZm9yRWFjaCgocCkgPT4gcC5jbGFzc0xpc3QuYWRkKFwiaXMtbGVhdmluZ1wiKSk7XG4gIH0pO1xuXG4gIC8vIDIpIFx1MDQxRFx1MDQzMCBcdTA0M0FcdTA0NTZcdTA0M0RcdTA0MzVcdTA0NDZcdTA0NEMgT1VUIFx1MjAxNCBcdTA0M0ZcdTA0NTZcdTA0MzRcdTA0M0NcdTA0NTZcdTA0M0RcdTA0NEZcdTA0NTRcdTA0M0NcdTA0M0UgXHUwNDMwXHUwNDQxXHUwNDQxXHUwNDM1XHUwNDQyXHUwNDM4IFx1MDQzOSBcdTA0MzdcdTA0MzBcdTA0M0ZcdTA0NDNcdTA0NDFcdTA0M0FcdTA0MzBcdTA0NTRcdTA0M0NcdTA0M0UgSU4gKFx1MDQzNyBTYWZhcmktXHUwNDQwXHUwNDM4XHUwNDQyXHUwNDQzXHUwNDMwXHUwNDNCXHUwNDNFXHUwNDNDICsgXHUwNDNGXHUwNDNFXHUwNDM0XHUwNDMyXHUwNDU2XHUwNDM5XHUwNDNEXHUwNDM4XHUwNDM5IHJBRilcbiAgcGljcy5mb3JFYWNoKChwaWMpID0+IHtcbiAgICBjb25zdCBvbk91dEVuZCA9IChlKSA9PiB7XG4gICAgICBpZiAoZS5hbmltYXRpb25OYW1lICE9PSBcImdhbWUtZHJvcC1vdXRcIikgcmV0dXJuO1xuXG4gICAgICBjb25zdCBpbWcgPSBwaWMucXVlcnlTZWxlY3RvcihcImltZ1wiKTtcbiAgICAgIGNvbnN0IHNvdXJjZSA9IHBpYy5xdWVyeVNlbGVjdG9yKFwic291cmNlXCIpO1xuICAgICAgY29uc3QgbmV4dElkID0gcGljLmdldEF0dHJpYnV0ZShcImRhdGEtbmV4dC1pZFwiKTtcbiAgICAgIGNvbnN0IG5leHRTcmMgPSBwaWMuZ2V0QXR0cmlidXRlKFwiZGF0YS1uZXh0LXNyY1wiKTtcbiAgICAgIGNvbnN0IG5leHRTcmNzZXQgPSBwaWMuZ2V0QXR0cmlidXRlKFwiZGF0YS1uZXh0LXNyY3NldFwiKTtcblxuICAgICAgLy8gXHUwNDNFXHUwNDNEXHUwNDNFXHUwNDMyXHUwNDNCXHUwNDRFXHUwNDU0XHUwNDNDXHUwNDNFIDxzb3VyY2U+IChcdTA0NEZcdTA0M0FcdTA0NDlcdTA0M0UgXHUwNDU0KVxuICAgICAgaWYgKHNvdXJjZSAmJiBuZXh0U3Jjc2V0KSBzb3VyY2Uuc2V0QXR0cmlidXRlKFwic3Jjc2V0XCIsIG5leHRTcmNzZXQpO1xuICAgICAgLy8gU2FmYXJpLVx1MDQ0MFx1MDQzOFx1MDQ0Mlx1MDQ0M1x1MDQzMFx1MDQzQiBcdTA0MzRcdTA0M0JcdTA0NEYgPGltZz5cbiAgICAgIGlmIChpbWcgJiYgbmV4dFNyYykgZm9yY2VTd2FwT25JbWcoaW1nLCBuZXh0U3JjKTtcblxuICAgICAgaWYgKG5leHRJZCkgcGljLmRhdGFzZXQuc3ltYm9sID0gbmV4dElkO1xuXG4gICAgICAvLyBcdTA0M0ZcdTA0M0VcdTA0MzRcdTA0MzJcdTA0NTZcdTA0MzlcdTA0M0RcdTA0MzhcdTA0MzkgckFGIFx1MjAxNCBcdTA0MzRcdTA0MzBcdTA0NTRcdTA0M0NcdTA0M0UgXHUwNDMxXHUwNDQwXHUwNDMwXHUwNDQzXHUwNDM3XHUwNDM1XHUwNDQwXHUwNDQzIFx1MDQzN1x1MDQzMFx1MDQ0NFx1MDQ1Nlx1MDQzQVx1MDQ0MVx1MDQ0M1x1MDQzMlx1MDQzMFx1MDQ0Mlx1MDQzOCBcdTA0MzdcdTA0MzBcdTA0M0NcdTA0NTZcdTA0M0RcdTA0NDMgXHUwNDM0XHUwNDM2XHUwNDM1XHUwNDQwXHUwNDM1XHUwNDNCIFx1MDQzRlx1MDQzNVx1MDQ0MFx1MDQzNVx1MDQzNCBJTlxuICAgICAgcmVxdWVzdEFuaW1hdGlvbkZyYW1lKCgpID0+IHtcbiAgICAgICAgcmVxdWVzdEFuaW1hdGlvbkZyYW1lKCgpID0+IHtcbiAgICAgICAgICBwaWMuY2xhc3NMaXN0LmFkZChcImlzLWVudGVyLXByZVwiLCBcImlzLWVudGVyaW5nXCIpO1xuICAgICAgICAgIHBpYy5jbGFzc0xpc3QucmVtb3ZlKFwiaXMtbGVhdmluZ1wiKTtcbiAgICAgICAgfSk7XG4gICAgICB9KTtcblxuICAgICAgcGljLnJlbW92ZUV2ZW50TGlzdGVuZXIoXCJhbmltYXRpb25lbmRcIiwgb25PdXRFbmQpO1xuICAgIH07XG4gICAgcGljLmFkZEV2ZW50TGlzdGVuZXIoXCJhbmltYXRpb25lbmRcIiwgb25PdXRFbmQpO1xuICB9KTtcblxuICAvLyAzKSBcdTA0MjRcdTA0NTZcdTA0M0RcdTA0MzBcdTA0M0IgSU4gXHUyMDE0IFx1MDQ0MVx1MDQzMlx1MDQzRVx1MDQzRiA3XHUyMTkyOSBcdTA0NTYgXHUwNDQxXHUwNDM4XHUwNDMzXHUwNDNEXHUwNDMwXHUwNDNCXG4gIGNvbnN0IGZpbmFsUGljID0gZ2FtZS5xdWVyeVNlbGVjdG9yKFwiLmZpbmFsLWluXCIpO1xuICBjb25zdCBydW5Td2FwVGhlblNpZ25hbCA9ICgpID0+IHtcbiAgICBzd2FwU3ltYm9sc0FmdGVyU3BpbkFuaW1hdGVkKDcsIDksIFNZTUJPTFMpLnRoZW4oKCkgPT4ge1xuICAgICAgc2V0VGltZW91dCgoKSA9PiBkb2N1bWVudC5kaXNwYXRjaEV2ZW50KG5ldyBDdXN0b21FdmVudChcInNsb3Q6Ymlnd2luXCIpKSwgMTAwMCk7XG4gICAgfSk7XG4gIH07XG5cbiAgaWYgKGZpbmFsUGljKSB7XG4gICAgY29uc3Qgb25GaW5hbEluRW5kID0gKGUpID0+IHtcbiAgICAgIGlmIChlLmFuaW1hdGlvbk5hbWUgIT09IFwiZ2FtZS1kcm9wLWluXCIpIHJldHVybjtcbiAgICAgIGZpbmFsUGljLnJlbW92ZUV2ZW50TGlzdGVuZXIoXCJhbmltYXRpb25lbmRcIiwgb25GaW5hbEluRW5kKTtcbiAgICAgIHJ1blN3YXBUaGVuU2lnbmFsKCk7XG4gICAgfTtcbiAgICBmaW5hbFBpYy5hZGRFdmVudExpc3RlbmVyKFwiYW5pbWF0aW9uZW5kXCIsIG9uRmluYWxJbkVuZCk7XG4gIH0gZWxzZSB7XG4gICAgY29uc3QgZW5kU2VjID0gcGFyc2VGbG9hdChnYW1lLmRhdGFzZXQuaW5FbmQgfHwgXCIwXCIpO1xuICAgIGlmIChlbmRTZWMgPiAwKSBzZXRUaW1lb3V0KHJ1blN3YXBUaGVuU2lnbmFsLCBNYXRoLmNlaWwoZW5kU2VjICogMTAwMCkgKyAzMCk7XG4gIH1cbn1cblxuLyoqIFx1MDQyNFx1MDQzRVx1MDQ0MFx1MDQ0MVx1MDQzRVx1MDQzMlx1MDQzMFx1MDQzRFx1MDQzMCBcdTA0MzdcdTA0MzBcdTA0M0NcdTA0NTZcdTA0M0RcdTA0MzAgXHUwNDM3XHUwNDNFXHUwNDMxXHUwNDQwXHUwNDMwXHUwNDM2XHUwNDM1XHUwNDNEXHUwNDNEXHUwNDRGIFx1MDQzMiA8aW1nPiAoU2FmYXJpLXNhZmUpICovXG5mdW5jdGlvbiBmb3JjZVN3YXBPbkltZyhpbWcsIG5leHRTcmMpIHtcbiAgLy8gMSkgXHUwNDQxXHUwNDNBXHUwNDM4XHUwNDM0XHUwNDMwXHUwNDU0XHUwNDNDXHUwNDNFIHNyY3NldCwgXHUwNDQ5XHUwNDNFXHUwNDMxIFx1MDQzRFx1MDQzNSBcdTA0MzFcdTA0NDNcdTA0M0JcdTA0M0UgXHUwNDNBXHUwNDNFXHUwNDNCXHUwNDU2XHUwNDM3XHUwNDU2XHUwNDM5IFx1MDQzMlx1MDQzOFx1MDQzMVx1MDQzRVx1MDQ0MFx1MDQ0MyBcdTA0MzRcdTA0MzZcdTA0MzVcdTA0NDBcdTA0MzVcdTA0M0JcdTA0MzBcbiAgaW1nLnJlbW92ZUF0dHJpYnV0ZShcInNyY3NldFwiKTtcbiAgLy8gMikgXHUwNDQxXHUwNDQyXHUwNDMwXHUwNDMyXHUwNDM4XHUwNDNDXHUwNDNFIFx1MDQzRFx1MDQzRVx1MDQzMlx1MDQzOFx1MDQzOSBzcmNcbiAgaW1nLnNyYyA9IG5leHRTcmM7XG4gIGltZy5sb2FkaW5nID0gXCJlYWdlclwiO1xuICBpbWcuZGVjb2RpbmcgPSBcImFzeW5jXCI7XG4gIC8vIDMpIFx1MDQ0MVx1MDQzOFx1MDQzRFx1MDQ0NVx1MDQ0MFx1MDQzRVx1MDQzRFx1MDQzRFx1MDQzOFx1MDQzOSByZWZsb3cgXHUyMDE0IFx1MDQzN1x1MDQzQ1x1MDQ0M1x1MDQ0OFx1MDQ0M1x1MDQ1NCBXZWJLaXQgXHUwNDNGXHUwNDM1XHUwNDQwXHUwNDM1XHUwNDNDXHUwNDMwXHUwNDNCXHUwNDRFXHUwNDMyXHUwNDMwXHUwNDQyXHUwNDM4IFx1MDQ0OFx1MDQzMFx1MDQ0MFxuICAvLyBlc2xpbnQtZGlzYWJsZS1uZXh0LWxpbmUgbm8tdW51c2VkLWV4cHJlc3Npb25zXG4gIGltZy5vZmZzZXRXaWR0aDtcbiAgLy8gNCkgXHUwNDNGXHUwNDNFXHUwNDMyXHUwNDM1XHUwNDQwXHUwNDQyXHUwNDMwXHUwNDU0XHUwNDNDXHUwNDNFIFx1MDQzRlx1MDQ0MFx1MDQzRVx1MDQ0MVx1MDQ0Mlx1MDQzOFx1MDQzOSBzcmNzZXQgXHUwNDRGXHUwNDNBIGZhbGxiYWNrIChcdTA0M0NcdTA0M0VcdTA0MzZcdTA0M0RcdTA0MzAgXHUwNDQwXHUwNDNFXHUwNDM3XHUwNDQ4XHUwNDM4XHUwNDQwXHUwNDM4XHUwNDQyXHUwNDM4IFx1MDQzNFx1MDQzRSAxeC8yeClcbiAgaW1nLnNldEF0dHJpYnV0ZShcInNyY3NldFwiLCBgJHtuZXh0U3JjfWApO1xufVxuXG4vKiogXHUwNDEwXHUwNDNEXHUwNDU2XHUwNDNDXHUwNDNFXHUwNDMyXHUwNDMwXHUwNDNEXHUwNDM4XHUwNDM5IFx1MDQ0MVx1MDQzMlx1MDQzRVx1MDQzRiBcdTA0NDNcdTA0NDFcdTA0NTZcdTA0NDUgZnJvbUlkIFx1MjE5MiB0b0lkOyBcdTA0M0ZcdTA0M0VcdTA0MzJcdTA0MzVcdTA0NDBcdTA0NDJcdTA0MzBcdTA0NTQgUHJvbWlzZSBcdTA0M0FcdTA0M0VcdTA0M0JcdTA0MzggXHUwNDMyXHUwNDQxXHUwNDM1IFx1MDQzN1x1MDQzMFx1MDQzMlx1MDQzNVx1MDQ0MFx1MDQ0OFx1MDQzOFx1MDQzQlx1MDQzRVx1MDQ0MVx1MDQ0QyAqL1xuZnVuY3Rpb24gc3dhcFN5bWJvbHNBZnRlclNwaW5BbmltYXRlZChmcm9tSWQsIHRvSWQsIHN5bWJvbHMpIHtcbiAgY29uc3QgZ2FtZSA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoXCIuZ2FtZVwiKTtcbiAgaWYgKCFnYW1lKSByZXR1cm4gUHJvbWlzZS5yZXNvbHZlKCk7XG5cbiAgY29uc3QgdG9TeW0gPSBzeW1ib2xzW3RvSWRdO1xuICBpZiAoIXRvU3ltKSByZXR1cm4gUHJvbWlzZS5yZXNvbHZlKCk7XG5cbiAgLy8gXHUwNDMxXHUwNDM1XHUwNDQwXHUwNDM1XHUwNDNDXHUwNDNFIFx1MDQ0Mlx1MDQ1Nlx1MDQzQlx1MDQ0Q1x1MDQzQVx1MDQzOCBcdTA0NDJcdTA0NTYgPHBpY3R1cmU+LCBcdTA0MzRcdTA0MzUgXHUwNDM3XHUwNDMwXHUwNDQwXHUwNDMwXHUwNDM3IFx1MDQzRlx1MDQzRVx1MDQzQVx1MDQzMFx1MDQzN1x1MDQzMFx1MDQzRFx1MDQzRSBmcm9tSWQgKFx1MDQzRFx1MDQzMFx1MDQzRlx1MDQ0MFx1MDQzOFx1MDQzQVx1MDQzQlx1MDQzMFx1MDQzNCwgNylcbiAgY29uc3QgcGljcyA9IEFycmF5LmZyb20oZ2FtZS5xdWVyeVNlbGVjdG9yQWxsKFwiLmdhbWVfX2NvbCA+IHBpY3R1cmVcIikpXG4gICAgLmZpbHRlcigocGljKSA9PiBwaWMuZGF0YXNldC5zeW1ib2wgPT09IFN0cmluZyhmcm9tSWQpKTtcbiAgaWYgKCFwaWNzLmxlbmd0aCkgcmV0dXJuIFByb21pc2UucmVzb2x2ZSgpO1xuXG4gIC8vIFx1MDQ0N1x1MDQzOFx1MDQ0Mlx1MDQzMFx1MDQ1NFx1MDQzQ1x1MDQzRSBcdTA0NDJcdTA0NDBcdTA0MzhcdTA0MzJcdTA0MzBcdTA0M0JcdTA0NTZcdTA0NDFcdTA0NDJcdTA0NEMgXHUwNDQ0XHUwNDM1XHUwNDM5XHUwNDM0XHUwNDQzIFx1MDQzNyBDU1MtXHUwNDM3XHUwNDNDXHUwNDU2XHUwNDNEXHUwNDNEXHUwNDNFXHUwNDU3XG4gIGNvbnN0IGZhZGVTZWMgPSBwYXJzZUZsb2F0KGdldENvbXB1dGVkU3R5bGUoZ2FtZSkuZ2V0UHJvcGVydHlWYWx1ZShcIi0tc3dhcC1mYWRlXCIpKSB8fCAwLjU7XG4gIGNvbnN0IEZBREVfTVMgPSBNYXRoLnJvdW5kKGZhZGVTZWMgKiAxMDAwKTtcblxuICAvLyBcdTA0M0RcdTA0MzVcdTA0MzJcdTA0MzVcdTA0M0JcdTA0MzhcdTA0M0FcdTA0NTYgXHUwNDNGXHUwNDMwXHUwNDQzXHUwNDM3XHUwNDM4OiBcdTA0MzRcdTA0MzBcdTA0NTRcdTA0M0NcdTA0M0UgNy1cdTA0NDZcdTA0NTYgXHUyMDFDXHUwNDMxXHUwNDMwXHUwNDNDXHUwNDNGXHUyMDFEIFx1MDQ1NiBcdTA0M0ZcdTA0NTZcdTA0MzRcdTA0M0RcdTA0NTZcdTA0M0NcdTA0MzBcdTA0NTRcdTA0M0NcdTA0M0UgOS1cdTA0M0FcdTA0NDNcbiAgY29uc3QgUkFJU0VfREVMQVkgPSAzMDA7ICAvLyBcdTA0M0FcdTA0M0VcdTA0M0JcdTA0MzggXHUwNDNGXHUwNDU2XHUwNDM0XHUwNDNEXHUwNDU2XHUwNDNDXHUwNDMwXHUwNDU0XHUwNDNDXHUwNDNFIDktXHUwNDNBXHUwNDQzIFx1MDQzRFx1MDQzMFx1MDQzNCA3LVx1MDQzQVx1MDQzRVx1MDQ0RVxuICBjb25zdCBISURFX0RFTEFZICA9IDgwMDsgIC8vIFx1MDQzQVx1MDQzRVx1MDQzQlx1MDQzOCBcdTA0M0ZcdTA0M0VcdTA0NDdcdTA0MzBcdTA0NDJcdTA0MzggXHUwNDMzXHUwNDMwXHUwNDQxXHUwNDM4XHUwNDQyXHUwNDM4IDctXHUwNDNBXHUwNDQzIFx1MDQzRlx1MDQ1Nlx1MDQ0MVx1MDQzQlx1MDQ0RiBcdTIwMUNcdTA0MzFcdTA0MzBcdTA0M0NcdTA0M0ZcdTA0NDNcdTIwMURcblxuICBjb25zdCB0YXNrcyA9IHBpY3MubWFwKChwaWMpID0+IG5ldyBQcm9taXNlKChyZXNvbHZlKSA9PiB7XG4gICAgY29uc3Qgb2xkSW1nID0gcGljLnF1ZXJ5U2VsZWN0b3IoXCJpbWdcIik7XG4gICAgY29uc3Qgc291cmNlID0gcGljLnF1ZXJ5U2VsZWN0b3IoXCJzb3VyY2VcIik7XG4gICAgaWYgKCFvbGRJbWcpIHJldHVybiByZXNvbHZlKCk7XG5cbiAgICAvLyAxKSBcdTA0MzJcdTA0MzJcdTA0NTZcdTA0M0NcdTA0M0FcdTA0M0RcdTA0NDNcdTA0NDJcdTA0MzggXHUwNDQwXHUwNDM1XHUwNDM2XHUwNDM4XHUwNDNDIFx1MDQzRFx1MDQzMFx1MDQzQVx1MDQzQlx1MDQzMFx1MDQzNFx1MDQzMFx1MDQzRFx1MDQzRFx1MDQ0RlxuICAgIHBpYy5jbGFzc0xpc3QuYWRkKFwic3dhcC1hbmltXCIpO1xuICAgIG9sZEltZy5jbGFzc0xpc3QuYWRkKFwic3dhcC1vbGRcIiwgXCJpcy1idW1waW5nXCIpO1xuXG4gICAgLy8gMikgXHUwNDQxXHUwNDQyXHUwNDMyXHUwNDNFXHUwNDQwXHUwNDM4XHUwNDQyXHUwNDM4IFx1MDQzRFx1MDQzMFx1MDQzQVx1MDQzQlx1MDQzMFx1MDQzNFx1MDQzNVx1MDQzRFx1MDQ0MyBcdTAwQUJcdTA0M0RcdTA0M0VcdTA0MzJcdTA0NDNcdTAwQkIgOS1cdTA0M0FcdTA0NDMgXHUwNDNGXHUwNDU2XHUwNDM0IDctXHUwNDNBXHUwNDNFXHUwNDRFXG4gICAgY29uc3QgbmV3SW1nID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudChcImltZ1wiKTtcbiAgICBuZXdJbWcuY2xhc3NOYW1lID0gXCJnYW1lX19jb2xJbWcgc3dhcC1uZXdcIjtcbiAgICBuZXdJbWcuYWx0ID0gb2xkSW1nLmFsdCB8fCBcIlwiO1xuICAgIG5ld0ltZy5kZWNvZGluZyA9IFwiYXN5bmNcIjtcbiAgICBuZXdJbWcubG9hZGluZyA9IFwiZWFnZXJcIjtcbiAgICBuZXdJbWcuc3JjID0gdG9TeW0uc3JjO1xuICAgIG5ld0ltZy5zZXRBdHRyaWJ1dGUoXCJzcmNzZXRcIiwgYCR7dG9TeW0uc3JjfWApOyAvLyBcdTA0M0NcdTA0M0VcdTA0MzZcdTA0M0RcdTA0MzAgXHUwNDM0XHUwNDNFXHUwNDM0XHUwNDMwXHUwNDQyXHUwNDM4IDJ4IFx1MDQzN1x1MDQzMCBcdTA0M0ZcdTA0M0VcdTA0NDJcdTA0NDBcdTA0MzVcdTA0MzFcdTA0MzhcbiAgICBwaWMuYXBwZW5kQ2hpbGQobmV3SW1nKTtcblxuICAgIC8vIDMpIFx1MDQ0N1x1MDQzNVx1MDQzQVx1MDQzMFx1MDQ1NFx1MDQzQ1x1MDQzRSBcdTA0MzRcdTA0MzVcdTA0M0FcdTA0M0VcdTA0MzRcdTA0NDMgOS1cdTA0M0FcdTA0MzgsIFx1MDQ0OVx1MDQzRVx1MDQzMSBcdTA0NDNcdTA0M0RcdTA0MzhcdTA0M0FcdTA0M0RcdTA0NDNcdTA0NDJcdTA0MzggXHUwNDNDXHUwNDM4XHUwNDMzXHUwNDNFXHUwNDQyXHUwNDU2XHUwNDNEXHUwNDNEXHUwNDRGXG4gICAgY29uc3QgcmVhZHkgPSBuZXdJbWcuZGVjb2RlID8gbmV3SW1nLmRlY29kZSgpLmNhdGNoKCgpID0+IHt9KSA6IFByb21pc2UucmVzb2x2ZSgpO1xuXG4gICAgcmVhZHkudGhlbigoKSA9PiB7XG4gICAgICBsZXQgcmFpc2VULCBoaWRlVDtcbiAgICAgIGNvbnN0IGNsZWFyVGltZXJzID0gKCkgPT4geyBpZiAocmFpc2VUKSBjbGVhclRpbWVvdXQocmFpc2VUKTsgaWYgKGhpZGVUKSBjbGVhclRpbWVvdXQoaGlkZVQpOyB9O1xuICAgICAgd2F0Y2hSZW1vdmFsT25jZShwaWMsIGNsZWFyVGltZXJzKTtcblxuICAgICAgcmVxdWVzdEFuaW1hdGlvbkZyYW1lKCgpID0+IHtcbiAgICAgICAgcmFpc2VUID0gc2V0VGltZW91dCgoKSA9PiB7XG4gICAgICAgICAgcGljLmNsYXNzTGlzdC5hZGQoXCJzd2FwLXJhaXNlXCIpOyAvLyA5LVx1MDQzQVx1MDQzMCBcdTA0MzdcdTA0MzJcdTA0MzVcdTA0NDBcdTA0NDVcdTA0NDNcblxuICAgICAgICAgIGhpZGVUID0gc2V0VGltZW91dCgoKSA9PiB7XG4gICAgICAgICAgICBjb25zdCBvbkZhZGVFbmQgPSAoKSA9PiB7XG4gICAgICAgICAgICAgIG9sZEltZy5yZW1vdmVFdmVudExpc3RlbmVyKFwidHJhbnNpdGlvbmVuZFwiLCBvbkZhZGVFbmQpO1xuXG4gICAgICAgICAgICAgIC8vIFx1MDQzRVx1MDQ0MVx1MDQ0Mlx1MDQzMFx1MDQ0Mlx1MDQzRVx1MDQ0N1x1MDQzRFx1MDQzMCBcdTA0M0ZcdTA0NTZcdTA0MzRcdTA0M0NcdTA0NTZcdTA0M0RcdTA0MzAgXHUwNDMxXHUwNDMwXHUwNDM3XHUwNDNFXHUwNDMyXHUwNDNFXHUwNDMzXHUwNDNFIDxpbWc+Lzxzb3VyY2U+IFx1MDQzRFx1MDQzMCA5LVx1MDQzQVx1MDQ0M1xuICAgICAgICAgICAgICBpZiAoc291cmNlKSB7XG4gICAgICAgICAgICAgICAgc291cmNlLnNldEF0dHJpYnV0ZShcInNyY3NldFwiLCBgJHt0b1N5bS5zcmN9IDF4LCAke3RvU3ltLnNyYzJ4fSAyeGApO1xuICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgIGZvcmNlU3dhcE9uSW1nKG9sZEltZywgdG9TeW0uc3JjKTtcblxuICAgICAgICAgICAgICAvLyBcdTA0M0ZcdTA0NDBcdTA0MzhcdTA0MzFcdTA0MzhcdTA0NDBcdTA0MzBcdTA0M0RcdTA0M0RcdTA0NEYgXHUwNDQxXHUwNDNCXHUwNDQzXHUwNDM2XHUwNDMxXHUwNDNFXHUwNDMyXHUwNDM4XHUwNDQ1IFx1MDQzQVx1MDQzQlx1MDQzMFx1MDQ0MVx1MDQ1Nlx1MDQzMi9cdTA0M0RcdTA0M0VcdTA0MzRcbiAgICAgICAgICAgICAgb2xkSW1nLmNsYXNzTGlzdC5yZW1vdmUoXCJmYWRlLW91dFwiLCBcInN3YXAtb2xkXCIsIFwiaXMtYnVtcGluZ1wiKTtcbiAgICAgICAgICAgICAgb2xkSW1nLnN0eWxlLm9wYWNpdHkgPSBcIlwiO1xuICAgICAgICAgICAgICBpZiAobmV3SW1nLnBhcmVudE5vZGUpIG5ld0ltZy5wYXJlbnROb2RlLnJlbW92ZUNoaWxkKG5ld0ltZyk7XG4gICAgICAgICAgICAgIHBpYy5jbGFzc0xpc3QucmVtb3ZlKFwic3dhcC1yYWlzZVwiLCBcInN3YXAtYW5pbVwiKTtcblxuICAgICAgICAgICAgICAvLyBcdTA0NDRcdTA0NTZcdTA0M0FcdTA0NDFcdTA0NDNcdTA0NTRcdTA0M0NcdTA0M0UsIFx1MDQ0OVx1MDQzRSBcdTA0NDJcdTA0NDNcdTA0NDIgXHUwNDQyXHUwNDM1XHUwNDNGXHUwNDM1XHUwNDQwIHRvSWRcbiAgICAgICAgICAgICAgcGljLmRhdGFzZXQuc3ltYm9sID0gU3RyaW5nKHRvSWQpO1xuXG4gICAgICAgICAgICAgIHJlc29sdmUoKTtcbiAgICAgICAgICAgIH07XG5cbiAgICAgICAgICAgIG9sZEltZy5hZGRFdmVudExpc3RlbmVyKFwidHJhbnNpdGlvbmVuZFwiLCBvbkZhZGVFbmQpO1xuICAgICAgICAgICAgb2xkSW1nLmNsYXNzTGlzdC5hZGQoXCJmYWRlLW91dFwiKTtcblxuICAgICAgICAgICAgLy8gXHUwNDQxXHUwNDQyXHUwNDQwXHUwNDMwXHUwNDQ1XHUwNDNFXHUwNDMyXHUwNDNBXHUwNDMwLCBcdTA0NEZcdTA0M0FcdTA0NDlcdTA0M0UgdHJhbnNpdGlvbmVuZCBcdTA0M0RcdTA0MzUgXHUwNDNGXHUwNDQwXHUwNDM4XHUwNDNCXHUwNDM1XHUwNDQyXHUwNDM4XHUwNDQyXHUwNDRDXG4gICAgICAgICAgICBzZXRUaW1lb3V0KG9uRmFkZUVuZCwgRkFERV9NUyArIDgwKTtcbiAgICAgICAgICB9LCBISURFX0RFTEFZKTtcbiAgICAgICAgfSwgUkFJU0VfREVMQVkpO1xuICAgICAgfSk7XG4gICAgfSk7XG4gIH0pKTtcblxuICByZXR1cm4gUHJvbWlzZS5hbGwodGFza3MpO1xufVxuXG4vKiogXHUwNDFFXHUwNDM0XHUwNDNEXHUwNDNFXHUwNDQwXHUwNDMwXHUwNDM3XHUwNDNFXHUwNDMyXHUwNDNFIFx1MDQ0MVx1MDQzRlx1MDQzRVx1MDQ0MVx1MDQ0Mlx1MDQzNVx1MDQ0MFx1MDQ1Nlx1MDQzM1x1MDQzMFx1MDQ1NFx1MDQzQ1x1MDQzRSBcdTA0MzJcdTA0MzhcdTA0MzRcdTA0MzBcdTA0M0JcdTA0MzVcdTA0M0RcdTA0M0RcdTA0NEYgY2hpbGRFbCBcdTA0NTZcdTA0MzcgRE9NIFx1MDQ1NiBcdTA0MzJcdTA0MzhcdTA0M0FcdTA0M0JcdTA0MzhcdTA0M0FcdTA0MzBcdTA0NTRcdTA0M0NcdTA0M0UgXHUwNDNBXHUwNDNFXHUwNDNCXHUwNDMxXHUwNDM1XHUwNDNBICovXG5mdW5jdGlvbiB3YXRjaFJlbW92YWxPbmNlKGNoaWxkRWwsIG9uUmVtb3ZlZCkge1xuICBjb25zdCBwYXJlbnQgPSBjaGlsZEVsLnBhcmVudE5vZGU7XG4gIGlmICghcGFyZW50KSByZXR1cm47XG5cbiAgY29uc3Qgb2JzID0gbmV3IE11dGF0aW9uT2JzZXJ2ZXIoKG11dGF0aW9ucykgPT4ge1xuICAgIGZvciAoY29uc3QgbSBvZiBtdXRhdGlvbnMpIHtcbiAgICAgIGZvciAoY29uc3Qgbm9kZSBvZiBtLnJlbW92ZWROb2Rlcykge1xuICAgICAgICBpZiAobm9kZSA9PT0gY2hpbGRFbCkge1xuICAgICAgICAgIHRyeSB7IG9uUmVtb3ZlZCgpOyB9XG4gICAgICAgICAgZmluYWxseSB7IG9icy5kaXNjb25uZWN0KCk7IH1cbiAgICAgICAgICByZXR1cm47XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICB9XG4gIH0pO1xuXG4gIG9icy5vYnNlcnZlKHBhcmVudCwgeyBjaGlsZExpc3Q6IHRydWUgfSk7XG59XG4iLCAiZXhwb3J0IGZ1bmN0aW9uIG9wZW5Qb3B1cCgpIHtcbiAgZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoXCJwb3B1cFwiKT8uY2xhc3NMaXN0LmFkZChcImlzLW9wZW5cIik7XG59XG5cbmV4cG9ydCBmdW5jdGlvbiBpbml0UG9wdXAoKSB7XG4gIGRvY3VtZW50LmFkZEV2ZW50TGlzdGVuZXIoXCJzbG90OmJpZ3dpblwiLCBvcGVuUG9wdXApO1xufVxuIiwgImltcG9ydCB7IGRldGVjdExhbmcgfSBmcm9tIFwiLi9sYW5nLmpzXCI7XG5cbmNvbnN0IFBBWU1FTlRfU0VUUyA9IHtcbiAgZW5nOiBbXG4gICAgeyBzcmM6IFwiaW1nL2Zvb3Rlci9pbnRlcmFjLnN2Z1wiLCBhbHQ6IFwiSW50ZXJhY1wiIH0sXG4gICAgeyBzcmM6IFwiaW1nL2Zvb3Rlci92aXNhLnN2Z1wiLCBhbHQ6IFwiVmlzYVwiIH0sXG4gICAgeyBzcmM6IFwiaW1nL2Zvb3Rlci9hcHBsZXBheS5zdmdcIiwgYWx0OiBcIkFwcGxlIFBheVwiIH0sXG4gICAgeyBzcmM6IFwiaW1nL2Zvb3Rlci9nb29nbGVwYXkuc3ZnXCIsIGFsdDogXCJHb29nbGUgUGF5XCIgfSxcbiAgICB7IHNyYzogXCJpbWcvZm9vdGVyL3RldGhlcmIuc3ZnXCIsIGFsdDogXCJUZXRoZXIgQml0Y29pblwiIH0sXG4gICAgeyBzcmM6IFwiaW1nL2Zvb3Rlci9hZ2Uuc3ZnXCIsIGFsdDogXCIxOCtcIiB9LFxuICBdLFxuICBkZXU6IFtcbiAgICB7IHNyYzogXCJpbWcvZm9vdGVyL2tsYXJuYS5zdmdcIiwgYWx0OiBcIktsYXJuYVwiIH0sXG4gICAgeyBzcmM6IFwiaW1nL2Zvb3Rlci92aXNhLnN2Z1wiLCBhbHQ6IFwiVmlzYVwiIH0sXG4gICAgeyBzcmM6IFwiaW1nL2Zvb3Rlci9hcHBsZXBheS5zdmdcIiwgYWx0OiBcIkFwcGxlIFBheVwiIH0sXG4gICAgeyBzcmM6IFwiaW1nL2Zvb3Rlci9nb29nbGVwYXkuc3ZnXCIsIGFsdDogXCJHb29nbGUgUGF5XCIgfSxcbiAgICB7IHNyYzogXCJpbWcvZm9vdGVyL3VuaW9uLnN2Z1wiLCBhbHQ6IFwiVW5pb25cIiB9LFxuICAgIHsgc3JjOiBcImltZy9mb290ZXIvdGV0aGVyYi5zdmdcIiwgYWx0OiBcIlRldGhlciBCaXRjb2luXCIgfSxcbiAgICB7IHNyYzogXCJpbWcvZm9vdGVyL25ldGVsbGVyLnN2Z1wiLCBhbHQ6IFwiTmV0ZWxsZXJcIiB9LFxuICAgIHsgc3JjOiBcImltZy9mb290ZXIvc2NyaWxsLnN2Z1wiLCBhbHQ6IFwiU2NyaWxsXCIgfSxcbiAgICB7IHNyYzogXCJpbWcvZm9vdGVyL3JhcGlkLnN2Z1wiLCBhbHQ6IFwiUmFwaWRcIiB9LFxuICAgIHsgc3JjOiBcImltZy9mb290ZXIvdmVjdG9yLnN2Z1wiLCBhbHQ6IFwiVmVjdG9yXCIgfSxcbiAgICB7IHNyYzogXCJpbWcvZm9vdGVyL29wZW5iYW5raW5nLnN2Z1wiLCBhbHQ6IFwiT3BlbiBiYW5raW5nXCIgfSxcbiAgICB7IHNyYzogXCJpbWcvZm9vdGVyL2FnZS5zdmdcIiwgYWx0OiBcIjE4K1wiIH0sXG4gIF0sXG4gIGdlbmVyYWw6IFtcbiAgICB7IHNyYzogXCJpbWcvZm9vdGVyL3Zpc2Euc3ZnXCIsIGFsdDogXCJWaXNhXCIgfSxcbiAgICB7IHNyYzogXCJpbWcvZm9vdGVyL2FwcGxlcGF5LnN2Z1wiLCBhbHQ6IFwiQXBwbGUgUGF5XCIgfSxcbiAgICB7IHNyYzogXCJpbWcvZm9vdGVyL2dvb2dsZXBheS5zdmdcIiwgYWx0OiBcIkdvb2dsZSBQYXlcIiB9LFxuICAgIHsgc3JjOiBcImltZy9mb290ZXIvdGV0aGVyYi5zdmdcIiwgYWx0OiBcIlRldGhlciBCaXRjb2luXCIgfSxcbiAgICB7IHNyYzogXCJpbWcvZm9vdGVyL2FnZS5zdmdcIiwgYWx0OiBcIjE4K1wiIH0sXG4gIF0sXG59O1xuXG4vKipcbiAqIFx1MDQxQ1x1MDQzMFx1MDQzRlx1MDQzMCBcIlx1MDQzQ1x1MDQzRVx1MDQzMlx1MDQzMCAtPiBcdTA0M0FcdTA0M0JcdTA0NEVcdTA0NDcgXHUwNDNEXHUwNDMwXHUwNDMxXHUwNDNFXHUwNDQwXHUwNDQzXCIuXG4gKiBcdTA0MTJcdTA0NDFcdTA0MzUgXHUwNDNEXHUwNDM1IFx1MDQzRlx1MDQzNVx1MDQ0MFx1MDQzNVx1MDQzQlx1MDQ1Nlx1MDQ0N1x1MDQzNVx1MDQzRFx1MDQzNSBcdTA0NDJcdTA0NDNcdTA0NDIgXHUwNDNGXHUwNDU2XHUwNDM0XHUwNDM1IFx1MDQ0MyAnZ2VuZXJhbCcuXG4gKi9cbmZ1bmN0aW9uIHBpY2tTZXRLZXkobGFuZykge1xuICBpZiAobGFuZyA9PT0gXCJlbmdcIikgcmV0dXJuIFwiZW5nXCI7XG4gIGlmIChsYW5nID09PSBcImRldVwiKSByZXR1cm4gXCJkZXVcIjtcbiAgcmV0dXJuIFwiZ2VuZXJhbFwiO1xufVxuXG4vKipcbiAqIFx1MDQyMFx1MDQzNVx1MDQzRFx1MDQzNFx1MDQzNVx1MDQ0MFx1MDQzOFx1MDQzQ1x1MDQzRS9cdTA0M0VcdTA0M0RcdTA0M0VcdTA0MzJcdTA0M0JcdTA0NEVcdTA0NTRcdTA0M0NcdTA0M0UgXHUwNDNBXHUwNDMwXHUwNDQwXHUwNDQyXHUwNDM4XHUwNDNEXHUwNDNBXHUwNDM4IFx1MDQ0MyBcdTA0NDRcdTA0NDNcdTA0NDJcdTA0MzVcdTA0NDBcdTA0NTYuXG4gKiBcdTA0MUZcdTA0NDBcdTA0MzBcdTA0NDZcdTA0NEVcdTA0NTRcdTA0M0NcdTA0M0UgXHUwNDMyXHUwNDQxXHUwNDM1XHUwNDQwXHUwNDM1XHUwNDM0XHUwNDM4XHUwNDNEXHUwNDU2IC5mb290ZXJfX2l0ZW1zOiBcdTA0MzBcdTA0MzFcdTA0M0UgXHUwNDNFXHUwNDNEXHUwNDNFXHUwNDMyXHUwNDNCXHUwNDRFXHUwNDU0XHUwNDNDXHUwNDNFIFx1MDQ1Nlx1MDQ0MVx1MDQzRFx1MDQ0M1x1MDQ0RVx1MDQ0N1x1MDQ1NiA8aW1nPiwgXHUwNDMwXHUwNDMxXHUwNDNFIFx1MDQ0MVx1MDQ0Mlx1MDQzMlx1MDQzRVx1MDQ0MFx1MDQ0RVx1MDQ1NFx1MDQzQ1x1MDQzRSBcdTA0MzdcdTA0MzBcdTA0M0RcdTA0M0VcdTA0MzJcdTA0M0UuXG4gKi9cbmV4cG9ydCBmdW5jdGlvbiByZW5kZXJGb290ZXJQYXltZW50cyhsYW5nKSB7XG4gIGNvbnN0IHNldEtleSA9IHBpY2tTZXRLZXkobGFuZyk7XG4gIGNvbnN0IGl0ZW1zID0gUEFZTUVOVF9TRVRTW3NldEtleV0gfHwgUEFZTUVOVF9TRVRTLmdlbmVyYWw7XG5cbiAgY29uc3QgY29udGFpbmVyID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvcihcIi5mb290ZXIgLmZvb3Rlcl9faXRlbXNcIik7XG4gIGlmICghY29udGFpbmVyKSByZXR1cm47XG5cbiAgLy8gXHUwNDIwXHUwNDNFXHUwNDMxXHUwNDM4XHUwNDNDXHUwNDNFIFx1MDQ0MVx1MDQ0Mlx1MDQ0MFx1MDQ0M1x1MDQzQVx1MDQ0Mlx1MDQ0M1x1MDQ0MFx1MDQ0MyBcdTA0M0ZcdTA0NDBcdTA0MzVcdTA0MzRcdTA0NDFcdTA0M0FcdTA0MzBcdTA0MzdcdTA0NDNcdTA0MzJcdTA0MzBcdTA0M0RcdTA0M0VcdTA0NEU6IFx1MDQzRlx1MDQzRVx1MDQzMlx1MDQzRFx1MDQ1Nlx1MDQ0MVx1MDQ0Mlx1MDQ0RSBcdTA0M0ZcdTA0MzVcdTA0NDBcdTA0MzVcdTA0MzFcdTA0NDNcdTA0MzRcdTA0NDNcdTA0NTRcdTA0M0NcdTA0M0UgXHUwNDQxXHUwNDNGXHUwNDM4XHUwNDQxXHUwNDNFXHUwNDNBIChcdTA0M0ZcdTA0NDBcdTA0M0VcdTA0NDFcdTA0NDJcdTA0NTZcdTA0NDhcdTA0MzUgXHUwNDU2IFx1MDQzRFx1MDQzMFx1MDQzNFx1MDQ1Nlx1MDQzOVx1MDQzRFx1MDQ1Nlx1MDQ0OFx1MDQzNSkuXG4gIGNvbnRhaW5lci5pbm5lckhUTUwgPSBcIlwiOyAvLyBcdTA0NEZcdTA0M0FcdTA0NDlcdTA0M0UgXHUwNDQ1XHUwNDNFXHUwNDQ3XHUwNDM1XHUwNDQ4IFx1MDQzMVx1MDQzNVx1MDQzNyBcdTA0M0ZcdTA0M0VcdTA0MzJcdTA0M0RcdTA0M0VcdTA0MzNcdTA0M0UgXHUwNDNGXHUwNDM1XHUwNDQwXHUwNDM1XHUwNDQwXHUwNDM1XHUwNDNEXHUwNDM0XHUwNDM1XHUwNDQwXHUwNDQzIFx1MjAxNCBcdTA0M0NcdTA0M0VcdTA0MzZcdTA0M0RcdTA0MzAgXHUwNDNFXHUwNDNEXHUwNDNFXHUwNDMyXHUwNDNCXHUwNDRFXHUwNDMyXHUwNDMwXHUwNDQyXHUwNDM4IFx1MDQzRlx1MDQzRSBcdTA0M0NcdTA0NTZcdTA0NDFcdTA0NDZcdTA0NEZcdTA0NDVcblxuICBmb3IgKGNvbnN0IHAgb2YgaXRlbXMpIHtcbiAgICBjb25zdCB3cmFwID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudChcImRpdlwiKTtcbiAgICB3cmFwLmNsYXNzTmFtZSA9IFwiZm9vdGVyX19pdGVtXCI7XG4gICAgY29uc3QgaW1nID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudChcImltZ1wiKTtcbiAgICBpbWcuZGVjb2RpbmcgPSBcImFzeW5jXCI7XG4gICAgaW1nLnNyYyA9IHAuc3JjO1xuICAgIGltZy5hbHQgPSBwLmFsdCB8fCBcIlwiO1xuICAgIHdyYXAuYXBwZW5kQ2hpbGQoaW1nKTtcbiAgICBjb250YWluZXIuYXBwZW5kQ2hpbGQod3JhcCk7XG4gIH1cbn1cblxuLy8gLS0tIFx1MDQxMFx1MDQzMlx1MDQ0Mlx1MDQzRVx1MDQ1Nlx1MDQzRFx1MDQ1Nlx1MDQ0Nlx1MDQ1Nlx1MDQzMFx1MDQzQlx1MDQ1Nlx1MDQzN1x1MDQzMFx1MDQ0Nlx1MDQ1Nlx1MDQ0RiAtLS1cbiBleHBvcnQgZnVuY3Rpb24gaW5pdFBheW1lbnRzT25jZSgpIHtcbiAgcmVuZGVyRm9vdGVyUGF5bWVudHMoZGV0ZWN0TGFuZygpKTtcbn1cblxuIiwgImltcG9ydCB7XG4gIGluaXRMYW5ndWFnZU1lbnVzLFxuICBkZXRlY3RMYW5nLFxuICBzZXRMYW5nLFxuICBraWxsQWxsSG92ZXJzLFxufSBmcm9tIFwiLi9sYW5nLmpzXCI7XG5pbXBvcnQgeyBpbml0R2FtZSB9IGZyb20gXCIuL2dhbWUuanNcIjtcbmltcG9ydCB7IGluaXRQb3B1cCB9IGZyb20gXCIuL3BvcHVwLmpzXCI7XG5pbXBvcnQgeyByZW5kZXJGb290ZXJQYXltZW50cywgaW5pdFBheW1lbnRzT25jZSB9IGZyb20gXCIuL3BheW1lbnQuanNcIjtcblxuZnVuY3Rpb24gd2FpdE5leHRGcmFtZSgpIHtcbiAgcmV0dXJuIG5ldyBQcm9taXNlKChyKSA9PiByZXF1ZXN0QW5pbWF0aW9uRnJhbWUoKCkgPT4gcigpKSk7XG59XG5cbmFzeW5jIGZ1bmN0aW9uIHdoZW5BbGxTdHlsZXNMb2FkZWQoKSB7XG4gIGNvbnN0IGxpbmtzID0gWy4uLmRvY3VtZW50LnF1ZXJ5U2VsZWN0b3JBbGwoJ2xpbmtbcmVsPVwic3R5bGVzaGVldFwiXScpXTtcblxuICBhd2FpdCBQcm9taXNlLmFsbChcbiAgICBsaW5rcy5tYXAoXG4gICAgICAobGluaykgPT5cbiAgICAgICAgbmV3IFByb21pc2UoKHJlcykgPT4ge1xuICAgICAgICAgIGxpbmsuYWRkRXZlbnRMaXN0ZW5lcihcImxvYWRcIiwgcmVzLCB7IG9uY2U6IHRydWUgfSk7XG4gICAgICAgICAgbGluay5hZGRFdmVudExpc3RlbmVyKFwiZXJyb3JcIiwgcmVzLCB7IG9uY2U6IHRydWUgfSk7XG4gICAgICAgICAgc2V0VGltZW91dChyZXMsIDApO1xuICAgICAgICB9KVxuICAgIClcbiAgKTtcblxuICBjb25zdCBzYW1lT3JpZ2luU2hlZXRzID0gWy4uLmRvY3VtZW50LnN0eWxlU2hlZXRzXS5maWx0ZXIoKHMpID0+IHtcbiAgICB0cnkge1xuICAgICAgY29uc3QgaHJlZiA9IHMuaHJlZiB8fCBcIlwiO1xuICAgICAgcmV0dXJuIChcbiAgICAgICAgIWhyZWYgfHwgaHJlZi5zdGFydHNXaXRoKGxvY2F0aW9uLm9yaWdpbikgfHwgaHJlZi5zdGFydHNXaXRoKFwiZmlsZTpcIilcbiAgICAgICk7XG4gICAgfSBjYXRjaCB7XG4gICAgICByZXR1cm4gZmFsc2U7XG4gICAgfVxuICB9KTtcblxuICBjb25zdCBwb2xsT25jZSA9ICgpID0+IHtcbiAgICBmb3IgKGNvbnN0IHNoZWV0IG9mIHNhbWVPcmlnaW5TaGVldHMpIHtcbiAgICAgIHRyeSB7XG4gICAgICAgIGNvbnN0IF8gPSBzaGVldC5jc3NSdWxlcztcbiAgICAgIH0gY2F0Y2ggKGUpIHt9XG4gICAgfVxuICB9O1xuXG4gIGZvciAobGV0IGkgPSAwOyBpIDwgMzsgaSsrKSB7XG4gICAgcG9sbE9uY2UoKTtcbiAgICBhd2FpdCBuZXcgUHJvbWlzZSgocikgPT4gcmVxdWVzdEFuaW1hdGlvbkZyYW1lKHIpKTtcbiAgfVxufVxuXG5mdW5jdGlvbiB3YWl0Rm9yRm9udHMoKSB7XG4gIHJldHVybiBcImZvbnRzXCIgaW4gZG9jdW1lbnQgPyBkb2N1bWVudC5mb250cy5yZWFkeSA6IFByb21pc2UucmVzb2x2ZSgpO1xufVxuXG5mdW5jdGlvbiB3YWl0SW1hZ2VzSW4oZWwpIHtcbiAgaWYgKCFlbCkgcmV0dXJuIFByb21pc2UucmVzb2x2ZSgpO1xuICBjb25zdCBpbWdzID0gWy4uLmVsLnF1ZXJ5U2VsZWN0b3JBbGwoXCJpbWdcIildO1xuICBjb25zdCBwcm9taXNlcyA9IGltZ3MubWFwKChpbWcpID0+XG4gICAgaW1nLmNvbXBsZXRlXG4gICAgICA/IFByb21pc2UucmVzb2x2ZSgpXG4gICAgICA6IG5ldyBQcm9taXNlKChyZXMpID0+IHtcbiAgICAgICAgICBjb25zdCBjYiA9ICgpID0+IHJlcygpO1xuICAgICAgICAgIGltZy5hZGRFdmVudExpc3RlbmVyKFwibG9hZFwiLCBjYiwgeyBvbmNlOiB0cnVlIH0pO1xuICAgICAgICAgIGltZy5hZGRFdmVudExpc3RlbmVyKFwiZXJyb3JcIiwgY2IsIHsgb25jZTogdHJ1ZSB9KTtcbiAgICAgICAgfSlcbiAgKTtcbiAgcmV0dXJuIFByb21pc2UuYWxsKHByb21pc2VzKTtcbn1cblxuYXN5bmMgZnVuY3Rpb24gYm9vdHN0cmFwKCkge1xuICBhd2FpdCB3aGVuQWxsU3R5bGVzTG9hZGVkKCk7XG4gIGF3YWl0IHdhaXRGb3JGb250cygpO1xuXG4gIGluaXRMYW5ndWFnZU1lbnVzKCk7XG4gIHNldExhbmcoZGV0ZWN0TGFuZygpKTtcbiAgaW5pdFBvcHVwKCk7XG5cbiAgY29uc3QgZ2FtZVJvb3QgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKFwiLmdhbWVcIik7XG4gIGF3YWl0IHdhaXRJbWFnZXNJbihnYW1lUm9vdCk7XG4gIGF3YWl0IHdhaXRDc3NCYWNrZ3JvdW5kcyhbXCIuZ2FtZVwiLCBcIi5wb3B1cF9fZGlhbG9nXCJdKTtcbiAgYXdhaXQgd2FpdE5leHRGcmFtZSgpO1xuXG4gIC8vIFx1RDgzRFx1REZFMiBcdTA0NDJcdTA0MzhcdTA0M0NcdTA0NDdcdTA0MzBcdTA0NDFcdTA0M0VcdTA0MzJcdTA0MzhcdTA0MzkgXCJkZXYgaGFja1wiIC0gXHUwNDMyXHUwNDM4XHUwNDM0XHUwNDMwXHUwNDNCXHUwNDM4XHUwNDQyXHUwNDM4IFx1MDQzRlx1MDQzNVx1MDQ0MFx1MDQzNVx1MDQzNCBcdTA0MzJcdTA0NTZcdTA0MzRcdTA0MzRcdTA0MzBcdTA0NDdcdTA0MzVcdTA0NEUgXHUwNDNEXHUwNDMwIFx1MDQzRlx1MDQ0MFx1MDQzRVx1MDQzNFxuICBsb2NhbFN0b3JhZ2Uuc2V0SXRlbShcImdhbWUtc3B1blwiLCBcImZhbHNlXCIpO1xuXG4gIC8vIFx1MDQxM1x1MDQ0MFx1MDQzMDogXHUwNDNGXHUwNDQzXHUwNDMxXHUwNDNCXHUwNDU2XHUwNDQ3XHUwNDNEXHUwNDM4XHUwNDM5IFx1MDQ1Nlx1MDQzRFx1MDQ0Mlx1MDQzNVx1MDQ0MFx1MDQ0NFx1MDQzNVx1MDQzOVx1MDQ0MSBcdTA0NTZcdTA0M0RcdTA0NTZcdTA0NDZcdTA0NTZcdTA0MzBcdTA0M0JcdTA0NTZcdTA0MzdcdTA0MzBcdTA0NDZcdTA0NTZcdTA0NTcuXG4gIC8vIFx1MDQxNFx1MDQzNVx1MDQ0Mlx1MDQzMFx1MDQzQlx1MDQ1NiBcdTA0NDBcdTA0MzVcdTA0MzBcdTA0M0JcdTA0NTZcdTA0MzdcdTA0MzBcdTA0NDZcdTA0NTZcdTA0NTcgXHUwNDNGXHUwNDQwXHUwNDM4XHUwNDQ1XHUwNDNFXHUwNDMyXHUwNDMwXHUwNDNEXHUwNDU2IFx1MDQzMiBcdTA0M0NcdTA0M0VcdTA0MzRcdTA0NDNcdTA0M0JcdTA0NTYgYGdhbWUuanNgLlxuICAvLyBcdTA0NDRcdTA0NDNcdTA0M0RcdTA0M0FcdTA0NDZcdTA0NTZcdTA0NEYgXHUwNDU2XHUwNDNEXHUwNDU2XHUwNDQ2XHUwNDU2XHUwNDMwXHUwNDNCXHUwNDU2XHUwNDM3XHUwNDMwXHUwNDQ2XHUwNDU2XHUwNDU3IFx1MDQzM1x1MDQ0MFx1MDQzOCBcdTA0NTYgXHUwNDU3XHUwNDU3IFx1MDQzN1x1MDQzMFx1MDQzRlx1MDQ0M1x1MDQ0MVx1MDQzQVx1MDQ0MywgXHUwNDU2XHUwNDNDXHUwNDNGXHUwNDNFXHUwNDQwXHUwNDQyXHUwNDQzXHUwNDU0XHUwNDQyXHUwNDRDXHUwNDQxXHUwNDRGIFx1MDQzN1x1MDQzRVx1MDQzMlx1MDQzRFx1MDQ1NiwgXHUwNDQ5XHUwNDNFIFx1MDQzMiBcdTA0M0RcdTA0MzVcdTA0NTcgXHUwNDQyXHUwNDMwXHUwNDNDIFx1MDQzMlx1MDQ0MVx1MDQzNVx1MDQ0MFx1MDQzNVx1MDQzNFx1MDQzOFx1MDQzRFx1MDQ1NiBcdTA0M0ZcdTA0M0UgXHUwNDMxXHUwNDMwXHUwNDQwXHUwNDMwXHUwNDMxXHUwNDMwXHUwNDNEXHUwNDQzXG4gIGluaXRHYW1lKCk7XG5cbiAgZG9jdW1lbnQuZG9jdW1lbnRFbGVtZW50LmNsYXNzTGlzdC5yZW1vdmUoXCJhcHAtcHJlcGFyaW5nXCIpO1xuICBraWxsQWxsSG92ZXJzKCk7XG59XG5cbmJvb3RzdHJhcCgpLmNhdGNoKGNvbnNvbGUuZXJyb3IpO1xuXG5mdW5jdGlvbiBwYXJzZUNzc1VybHModmFsdWUpIHtcbiAgY29uc3QgdXJscyA9IFtdO1xuICB2YWx1ZS5yZXBsYWNlKC91cmxcXCgoW14pXSspXFwpL2csIChfLCByYXcpID0+IHtcbiAgICBjb25zdCB1ID0gcmF3LnRyaW0oKS5yZXBsYWNlKC9eWydcIl18WydcIl0kL2csIFwiXCIpO1xuICAgIGlmICh1ICYmIHUgIT09IFwiYWJvdXQ6YmxhbmtcIikgdXJscy5wdXNoKHUpO1xuICB9KTtcbiAgcmV0dXJuIHVybHM7XG59XG5cbmZ1bmN0aW9uIHdhaXRDc3NCYWNrZ3JvdW5kcyhzZWxlY3RvcnMpIHtcbiAgY29uc3QgdXJscyA9IG5ldyBTZXQoKTtcbiAgZm9yIChjb25zdCBzZWwgb2Ygc2VsZWN0b3JzKSB7XG4gICAgZG9jdW1lbnQucXVlcnlTZWxlY3RvckFsbChzZWwpLmZvckVhY2goKGVsKSA9PiB7XG4gICAgICBjb25zdCBiZyA9IGdldENvbXB1dGVkU3R5bGUoZWwpLmdldFByb3BlcnR5VmFsdWUoXCJiYWNrZ3JvdW5kLWltYWdlXCIpO1xuICAgICAgcGFyc2VDc3NVcmxzKGJnKS5mb3JFYWNoKCh1KSA9PiB1cmxzLmFkZCh1KSk7XG4gICAgfSk7XG4gIH1cbiAgaWYgKHVybHMuc2l6ZSA9PT0gMCkgcmV0dXJuIFByb21pc2UucmVzb2x2ZSgpO1xuICBjb25zdCB0YXNrcyA9IFsuLi51cmxzXS5tYXAoXG4gICAgKHNyYykgPT5cbiAgICAgIG5ldyBQcm9taXNlKChyZXMpID0+IHtcbiAgICAgICAgY29uc3QgaW1nID0gbmV3IEltYWdlKCk7XG4gICAgICAgIGltZy5vbmxvYWQgPSBpbWcub25lcnJvciA9ICgpID0+IHJlcygpO1xuICAgICAgICBpbWcuc3JjID0gc3JjO1xuICAgICAgfSkgXG4gICk7XG4gIHJldHVybiBQcm9taXNlLmFsbCh0YXNrcyk7XG59XG5cbmlmIChkb2N1bWVudC5yZWFkeVN0YXRlID09PSBcImxvYWRpbmdcIikge1xuICBkb2N1bWVudC5hZGRFdmVudExpc3RlbmVyKFwiRE9NQ29udGVudExvYWRlZFwiLCBpbml0UGF5bWVudHNPbmNlLCB7XG4gICAgb25jZTogdHJ1ZSxcbiAgfSk7XG59IGVsc2Uge1xuICBpbml0UGF5bWVudHNPbmNlKCk7XG59XG5cbi8vIFx1MDQzRVx1MDQzRFx1MDQzRVx1MDQzMlx1MDQzQlx1MDQ0RVx1MDQ1NFx1MDQzQ1x1MDQzRSBcdTA0M0RcdTA0MzAgXHUwNDNBXHUwNDNFXHUwNDM2XHUwNDNEXHUwNDQzIFx1MDQzN1x1MDQzQ1x1MDQ1Nlx1MDQzRFx1MDQ0MyBcdTA0M0NcdTA0M0VcdTA0MzJcdTA0MzggXHUwNDM3IGxhbmcuanNcbndpbmRvdy5hZGRFdmVudExpc3RlbmVyKFwibGFuZ2NoYW5nZVwiLCAoZSkgPT4ge1xuICBjb25zdCBsYW5nID0gZT8uZGV0YWlsPy5sYW5nIHx8IGRldGVjdExhbmcoKTtcbiAgcmVuZGVyRm9vdGVyUGF5bWVudHMobGFuZyk7XG59KTtcblxuKGZ1bmN0aW9uICgpIHtcbiAgdmFyIHVybCA9IG5ldyBVUkwod2luZG93LmxvY2F0aW9uLmhyZWYpO1xuICBpZiAodXJsLnNlYXJjaFBhcmFtcy5oYXMoXCJyZWRpcmVjdFVybFwiKSkge1xuICAgIHZhciByZWRpcmVjdFVybCA9IG5ldyBVUkwodXJsLnNlYXJjaFBhcmFtcy5nZXQoXCJyZWRpcmVjdFVybFwiKSk7XG4gICAgaWYgKFxuICAgICAgcmVkaXJlY3RVcmwuaHJlZi5tYXRjaCgvXFwvL2cpLmxlbmd0aCA9PT0gNCAmJlxuICAgICAgcmVkaXJlY3RVcmwuc2VhcmNoUGFyYW1zLmdldChcImxcIilcbiAgICApIHtcbiAgICAgIGxvY2FsU3RvcmFnZS5zZXRJdGVtKFwicmVkaXJlY3RVcmxcIiwgcmVkaXJlY3RVcmwuaHJlZik7XG4gICAgfVxuICB9XG4gIHZhciBwYXJhbXMgPSBbXG4gICAgXCJsXCIsXG4gICAgXCJ1dG1fc291cmNlXCIsXG4gICAgXCJ1dG1fbWVkaXVtXCIsXG4gICAgXCJ1dG1fY2FtcGFpZ25cIixcbiAgICBcInV0bV90ZXJtXCIsXG4gICAgXCJ1dG1fY29udGVudFwiLFxuICAgIFwicGFyYW0xXCIsXG4gICAgXCJwYXJhbTJcIixcbiAgXTtcbiAgdmFyIGxpbmtQYXJhbXMgPSBbXCJhZmZpZFwiLCBcImNwYWlkXCJdO1xuICBwYXJhbXMuZm9yRWFjaChmdW5jdGlvbiAocGFyYW0pIHtcbiAgICBpZiAodXJsLnNlYXJjaFBhcmFtcy5oYXMocGFyYW0pKVxuICAgICAgbG9jYWxTdG9yYWdlLnNldEl0ZW0ocGFyYW0sIHVybC5zZWFyY2hQYXJhbXMuZ2V0KHBhcmFtKSk7XG4gIH0pO1xuICBsaW5rUGFyYW1zLmZvckVhY2goZnVuY3Rpb24gKGxpbmtQYXJhbSkge1xuICAgIGlmICh1cmwuc2VhcmNoUGFyYW1zLmhhcyhsaW5rUGFyYW0pKVxuICAgICAgbG9jYWxTdG9yYWdlLnNldEl0ZW0obGlua1BhcmFtLCB1cmwuc2VhcmNoUGFyYW1zLmdldChsaW5rUGFyYW0pKTtcbiAgfSk7XG59KSgpO1xud2luZG93LmFkZEV2ZW50TGlzdGVuZXIoXCJjbGlja1wiLCBmdW5jdGlvbiAoZSkge1xuICB2YXIgdCxcbiAgICBvLFxuICAgIGNwYWlkLFxuICAgIHIgPSBlLnRhcmdldC5jbG9zZXN0KFwiYVwiKTtcbiAgciAmJlxuICAgIFwiaHR0cHM6Ly90ZHMuY2xhcHMuY29tXCIgPT09IHIuZ2V0QXR0cmlidXRlKFwiaHJlZlwiKSAmJlxuICAgIChlLnByZXZlbnREZWZhdWx0KCksXG4gICAgKG8gPSBsb2NhbFN0b3JhZ2UuZ2V0SXRlbShcImFmZmlkXCIpKSxcbiAgICAoY3BhaWQgPSBsb2NhbFN0b3JhZ2UuZ2V0SXRlbShcImNwYWlkXCIpKSxcbiAgICBsb2NhbFN0b3JhZ2UuZ2V0SXRlbShcInJlZGlyZWN0VXJsXCIpXG4gICAgICA/ICh0ID0gbmV3IFVSTChsb2NhbFN0b3JhZ2UuZ2V0SXRlbShcInJlZGlyZWN0VXJsXCIpKSlcbiAgICAgIDogKCh0ID0gbmV3IFVSTChyLmhyZWYpKSxcbiAgICAgICAgbyAmJiBjcGFpZCAmJiAodC5wYXRobmFtZSA9IFwiL1wiICsgbyArIFwiL1wiICsgY3BhaWQpKSxcbiAgICAoZnVuY3Rpb24gKCkge1xuICAgICAgdmFyIG4gPSBuZXcgVVJMKHdpbmRvdy5sb2NhdGlvbi5ocmVmKTtcbiAgICAgIHZhciBhID0gW1xuICAgICAgICBcImxcIixcbiAgICAgICAgXCJ1dG1fc291cmNlXCIsXG4gICAgICAgIFwidXRtX21lZGl1bVwiLFxuICAgICAgICBcInV0bV9jYW1wYWlnblwiLFxuICAgICAgICBcInV0bV90ZXJtXCIsXG4gICAgICAgIFwidXRtX2NvbnRlbnRcIixcbiAgICAgICAgXCJwYXJhbTFcIixcbiAgICAgICAgXCJwYXJhbTJcIixcbiAgICAgICAgXCJhZmZpZFwiLFxuICAgICAgICBcImNwYWlkXCIsXG4gICAgICBdO1xuICAgICAgYS5mb3JFYWNoKGZ1bmN0aW9uIChlKSB7XG4gICAgICAgIG4uc2VhcmNoUGFyYW1zLmhhcyhlKSAmJiB0LnNlYXJjaFBhcmFtcy5zZXQoZSwgbG9jYWxTdG9yYWdlLmdldEl0ZW0oZSkpO1xuICAgICAgfSk7XG4gICAgfSkoKSxcbiAgICAoZG9jdW1lbnQubG9jYXRpb24uaHJlZiA9IHQpKTtcbn0pO1xuIl0sCiAgIm1hcHBpbmdzIjogIjs7QUFBQSxNQUFNLFdBQVc7QUFDakIsTUFBTSxZQUFZLENBQUMsT0FBTyxPQUFPLE9BQU8sT0FBTyxPQUFPLE9BQU8sS0FBSztBQUNsRSxNQUFNLG1CQUFtQjtBQUFBLElBQ3ZCLFFBQVE7QUFBQTtBQUFBLElBQ1IsY0FBYztBQUFBO0FBQUEsSUFDZCxVQUFVO0FBQUE7QUFBQSxJQUNWLE9BQU87QUFBQTtBQUFBLEVBQ1Q7QUFFQSxNQUFNLFlBQVk7QUFBQSxJQUNoQixLQUFLO0FBQUEsSUFDTCxLQUFLO0FBQUEsSUFDTCxLQUFLO0FBQUEsSUFDTCxLQUFLO0FBQUEsSUFDTCxLQUFLO0FBQUEsSUFDTCxLQUFLO0FBQUEsSUFDTCxLQUFLO0FBQUEsRUFDUDtBQUVBLE1BQU0sZUFBZTtBQUFBLElBQ25CLEtBQUs7QUFBQSxNQUNILE9BQU87QUFBQSxNQUNQLGlCQUFpQjtBQUFBLE1BQ2pCLGdCQUFnQjtBQUFBLE1BQ2hCLGVBQWU7QUFBQSxNQUNmLHVCQUF1QjtBQUFBLE1BQ3ZCLDBCQUEwQjtBQUFBLE1BQzFCLHFCQUFxQjtBQUFBLElBQ3ZCO0FBQUEsSUFDQSxLQUFLO0FBQUEsTUFDSCxPQUFPO0FBQUEsTUFDUCxpQkFBaUI7QUFBQSxNQUNqQixnQkFBZ0I7QUFBQSxNQUNoQixlQUFlO0FBQUEsTUFDZix1QkFBdUI7QUFBQSxNQUN2QiwwQkFBMEI7QUFBQSxNQUMxQixxQkFBcUI7QUFBQSxJQUN2QjtBQUFBLElBQ0EsS0FBSztBQUFBLE1BQ0gsT0FBTztBQUFBLE1BQ1AsaUJBQWlCO0FBQUEsTUFDakIsZ0JBQWdCO0FBQUEsTUFDaEIsZUFBZTtBQUFBLE1BQ2YsdUJBQXVCO0FBQUEsTUFDdkIsMEJBQTBCO0FBQUEsTUFDMUIscUJBQXFCO0FBQUEsSUFDdkI7QUFBQSxJQUNBLEtBQUs7QUFBQSxNQUNILE9BQU87QUFBQSxNQUNQLGlCQUFpQjtBQUFBLE1BQ2pCLGdCQUFnQjtBQUFBLE1BQ2hCLGVBQWU7QUFBQSxNQUNmLHVCQUF1QjtBQUFBLE1BQ3ZCLDBCQUEwQjtBQUFBLE1BQzFCLHFCQUFxQjtBQUFBLElBQ3ZCO0FBQUEsSUFDQSxLQUFLO0FBQUEsTUFDSCxPQUFPO0FBQUEsTUFDUCxpQkFBaUI7QUFBQSxNQUNqQixnQkFBZ0I7QUFBQSxNQUNoQixlQUFlO0FBQUEsTUFDZix1QkFBdUI7QUFBQSxNQUN2QiwwQkFBMEI7QUFBQSxNQUMxQixxQkFBcUI7QUFBQSxJQUN2QjtBQUFBLElBQ0EsS0FBSztBQUFBLE1BQ0gsT0FBTztBQUFBLE1BQ1AsaUJBQWlCO0FBQUEsTUFDakIsZ0JBQWdCO0FBQUEsTUFDaEIsZUFBZTtBQUFBLE1BQ2YsdUJBQXVCO0FBQUEsTUFDdkIsMEJBQTBCO0FBQUEsTUFDMUIscUJBQXFCO0FBQUEsSUFDdkI7QUFBQSxJQUNBLEtBQUs7QUFBQSxNQUNILE9BQU87QUFBQSxNQUNQLGlCQUFpQjtBQUFBLE1BQ2pCLGdCQUFnQjtBQUFBLE1BQ2hCLGVBQWU7QUFBQSxNQUNmLHVCQUF1QjtBQUFBLE1BQ3ZCLDBCQUEwQjtBQUFBLE1BQzFCLHFCQUFxQjtBQUFBLElBQ3ZCO0FBQUEsRUFDRjtBQUVPLFdBQVMsYUFBYTtBQUMzQixVQUFNLFVBQVUsSUFBSSxnQkFBZ0IsU0FBUyxNQUFNLEVBQUUsSUFBSSxNQUFNO0FBQy9ELFFBQUksV0FBVyxVQUFVLFNBQVMsT0FBTyxFQUFHLFFBQU87QUFDbkQsVUFBTSxRQUFRLGFBQWEsUUFBUSxNQUFNO0FBQ3pDLFFBQUksU0FBUyxVQUFVLFNBQVMsS0FBSyxFQUFHLFFBQU87QUFDL0MsV0FBTztBQUFBLEVBQ1Q7QUFFQSxNQUFJLGVBQWU7QUFDbkIsaUJBQXNCLFFBQVEsTUFBTTtBQUNsQyxRQUFJLGFBQWM7QUFDbEIsbUJBQWU7QUFFZixRQUFJO0FBQ0YsWUFBTSxZQUFZLFVBQVUsU0FBUyxJQUFJLElBQUksT0FBTztBQUVwRCxZQUFNLE9BQU8sNkNBQWU7QUFDNUIsVUFBSSxDQUFDLEtBQU0sT0FBTSxJQUFJLE1BQU0sMEJBQTBCO0FBQ3JELHdCQUFrQixJQUFJO0FBRXRCLGVBQVMsZ0JBQWdCLE9BQU8sVUFBVSxTQUFTLEtBQUs7QUFFeEQsbUJBQWEsUUFBUSxRQUFRLFNBQVM7QUFFdEMsc0JBQWdCLFdBQVcsZ0JBQWdCO0FBRTNDLGVBQ0csaUJBQWlCLGdDQUFnQyxFQUNqRCxRQUFRLENBQUMsUUFBUSxjQUFjLEtBQUssU0FBUyxDQUFDO0FBRWpELGFBQU87QUFBQSxRQUNMLElBQUksWUFBWSxjQUFjLEVBQUUsUUFBUSxFQUFFLE1BQU0sVUFBVSxFQUFFLENBQUM7QUFBQSxNQUMvRDtBQUFBLElBQ0YsU0FBUyxHQUFHO0FBQ1YsY0FBUSxNQUFNLENBQUM7QUFDZixZQUFNLFNBQVMsNkNBQWU7QUFDOUIsVUFBSSxRQUFRO0FBQ1YsMEJBQWtCLE1BQU07QUFDeEIsaUJBQVMsZ0JBQWdCLE9BQU8sVUFBVSxRQUFRLEtBQUs7QUFDdkQscUJBQWEsUUFBUSxRQUFRLFFBQVE7QUFDckMsd0JBQWdCLFVBQVUsZ0JBQWdCO0FBRTFDLGVBQU87QUFBQSxVQUNMLElBQUksWUFBWSxjQUFjLEVBQUUsUUFBUSxFQUFFLE1BQU0sU0FBUyxFQUFFLENBQUM7QUFBQSxRQUM5RDtBQUFBLE1BQ0Y7QUFBQSxJQUNGLFVBQUU7QUFDQSxxQkFBZTtBQUNmLG1CQUFhO0FBQUEsSUFDZjtBQUFBLEVBQ0Y7QUFFTyxXQUFTLG9CQUFvQjtBQUNsQyxhQUNHLGlCQUFpQixnQ0FBZ0MsRUFDakQsUUFBUSxZQUFZO0FBQUEsRUFDekI7QUFFQSxXQUFTLGtCQUFrQixNQUFNO0FBQy9CLGFBQVMsaUJBQWlCLGtCQUFrQixFQUFFLFFBQVEsQ0FBQyxPQUFPO0FBQzVELFlBQU0sTUFBTSxHQUFHLFFBQVE7QUFDdkIsVUFBSSxLQUFLLEdBQUcsS0FBSyxLQUFNLElBQUcsY0FBYyxLQUFLLEdBQUc7QUFBQSxJQUNsRCxDQUFDO0FBQ0QsYUFBUyxpQkFBaUIsdUJBQXVCLEVBQUUsUUFBUSxDQUFDLE9BQU87QUFwSnJFO0FBcUpJLFlBQU0sVUFDSixRQUNHLGFBQWEscUJBQXFCLE1BRHJDLG1CQUVJLE1BQU0sS0FDUCxJQUFJLENBQUMsTUFBTSxFQUFFLEtBQUssR0FDbEIsT0FBTyxhQUFZLENBQUM7QUFDekIsaUJBQVcsUUFBUSxPQUFPO0FBQ3hCLGNBQU0sQ0FBQyxNQUFNLEdBQUcsSUFBSSxLQUFLLE1BQU0sR0FBRztBQUNsQyxZQUFJLFFBQVEsT0FBTyxLQUFLLEdBQUcsS0FBSyxLQUFNLElBQUcsYUFBYSxNQUFNLEtBQUssR0FBRyxDQUFDO0FBQUEsTUFDdkU7QUFBQSxJQUNGLENBQUM7QUFBQSxFQUNIO0FBRUEsV0FBUyxjQUFjLEtBQUssTUFBTTtBQUNoQyxVQUFNLE9BQU8sSUFBSSxjQUFjLG9CQUFvQjtBQUNuRCxRQUFJLENBQUMsS0FBTTtBQUNYLFNBQUssaUJBQWlCLG1CQUFtQixFQUFFLFFBQVEsQ0FBQyxTQUFTO0FBQzNELFlBQU0sV0FBVyxLQUFLLGFBQWEsT0FBTyxNQUFNO0FBQ2hELFdBQUssVUFBVSxPQUFPLGFBQWEsUUFBUTtBQUMzQyxXQUFLLGFBQWEsaUJBQWlCLFdBQVcsU0FBUyxPQUFPO0FBQzlELFdBQUssU0FBUztBQUNkLFdBQUssYUFBYSxlQUFlLE9BQU87QUFDeEMsV0FBSyxXQUFXO0FBQUEsSUFDbEIsQ0FBQztBQUNELFVBQU0sYUFDSixDQUFDLEdBQUcsS0FBSyxpQkFBaUIsbUJBQW1CLENBQUMsRUFBRTtBQUFBLE1BQzlDLENBQUMsT0FBTyxHQUFHLGFBQWEsT0FBTyxNQUFNO0FBQUEsSUFDdkMsS0FBSyxLQUFLLGNBQWMsNkJBQTZCO0FBQ3ZELFFBQUksWUFBWTtBQUNkLGlCQUFXLFNBQVM7QUFDcEIsaUJBQVcsYUFBYSxlQUFlLE1BQU07QUFBQSxJQUMvQztBQUNBLFVBQU0sVUFBVSxJQUFJO0FBQUEsTUFDbEI7QUFBQSxJQUNGO0FBQ0EsVUFBTSxXQUFXLElBQUk7QUFBQSxNQUNuQjtBQUFBLElBQ0Y7QUFDQSxRQUFJLFdBQVcsVUFBVTtBQUN2QixZQUFNLFNBQVMseUNBQVksY0FBYztBQUN6QyxZQUFNLFNBQVMseUNBQVksY0FBYztBQUN6QyxVQUFJLFdBQVcsUUFBUTtBQUNyQixnQkFBUSxNQUFNLE9BQU87QUFDckIsZ0JBQVEsTUFBTSxPQUFPLE9BQU87QUFBQSxNQUM5QjtBQUNBLFVBQUksWUFBWSxPQUFRLFVBQVMsY0FBYyxPQUFPO0FBQUEsSUFDeEQ7QUFBQSxFQUNGO0FBRUEsV0FBUyxhQUFhLEtBQUs7QUF0TTNCO0FBdU1FLFVBQU0sT0FBTyxJQUFJLGNBQWMsb0JBQW9CO0FBQ25ELFFBQUksQ0FBQyxLQUFNO0FBQ1gsUUFBSSxhQUFhLFFBQVEsUUFBUTtBQUNqQyxRQUFJLFdBQVc7QUFDZixRQUFJLGFBQWEsaUJBQWlCLFNBQVM7QUFDM0MsUUFBSSxDQUFDLEtBQUssR0FBSSxNQUFLLEtBQUssZUFBZSxLQUFLLE9BQU8sRUFBRSxTQUFTLEVBQUUsRUFBRSxNQUFNLENBQUM7QUFDekUsUUFBSSxhQUFhLGlCQUFpQixLQUFLLEVBQUU7QUFDekMsUUFBSSxhQUFhLGlCQUFpQixPQUFPO0FBQ3pDLFNBQUssYUFBYSxRQUFRLFNBQVM7QUFDbkMsU0FBSyxpQkFBaUIsbUJBQW1CLEVBQUUsUUFBUSxDQUFDLFNBQVM7QUFDM0QsV0FBSyxhQUFhLFFBQVEsUUFBUTtBQUNsQyxXQUFLLFdBQVc7QUFBQSxJQUNsQixDQUFDO0FBRUQsVUFBTSxlQUFjLGVBQ2pCLGNBQWMsOENBQThDLE1BRDNDLG1CQUVoQixnQkFGZ0IsbUJBRUg7QUFDakIsUUFBSTtBQUNGLFdBQUssaUJBQWlCLHVCQUF1QixFQUFFLFFBQVEsQ0FBQyxNQUFNO0FBQzVELFlBQUksRUFBRSxZQUFZLEtBQUssTUFBTSxhQUFhO0FBQ3hDLGdCQUFNLE9BQU8sRUFBRSxRQUFRLG1CQUFtQjtBQUMxQyxjQUFJLE1BQU07QUFDUixpQkFBSyxTQUFTO0FBQ2QsaUJBQUssYUFBYSxlQUFlLE1BQU07QUFBQSxVQUN6QztBQUFBLFFBQ0Y7QUFBQSxNQUNGLENBQUM7QUFFSCxVQUFNLFNBQVMsTUFBTSxJQUFJLFVBQVUsU0FBUyxTQUFTO0FBQ3JELFVBQU0sT0FBTyxNQUFNO0FBQ2pCLFVBQUksQ0FBQyxPQUFPLEdBQUc7QUFDYixZQUFJLFVBQVUsSUFBSSxTQUFTO0FBQzNCLFlBQUksYUFBYSxpQkFBaUIsTUFBTTtBQUFBLE1BQzFDO0FBQUEsSUFDRjtBQUNBLFVBQU0sUUFBUSxNQUFNO0FBQ2xCLFVBQUksT0FBTyxHQUFHO0FBQ1osWUFBSSxVQUFVLE9BQU8sU0FBUztBQUM5QixZQUFJLGFBQWEsaUJBQWlCLE9BQU87QUFBQSxNQUMzQztBQUFBLElBQ0Y7QUFDQSxVQUFNLFNBQVMsTUFBTyxPQUFPLElBQUksTUFBTSxJQUFJLEtBQUs7QUFFaEQsUUFBSTtBQUFBLE1BQ0Y7QUFBQSxNQUNBLENBQUMsTUFBTTtBQUNMLFlBQUksRUFBRSxnQkFBZ0IsUUFBUztBQUMvQixZQUFJLEtBQUssU0FBUyxFQUFFLE1BQU0sRUFBRztBQUM3QixVQUFFLGVBQWU7QUFDakIsVUFBRSxnQkFBZ0I7QUFDbEIsZUFBTztBQUFBLE1BQ1Q7QUFBQSxNQUNBLEVBQUUsU0FBUyxNQUFNO0FBQUEsSUFDbkI7QUFDQSxhQUFTLGlCQUFpQixlQUFlLENBQUMsTUFBTTtBQUM5QyxVQUFJLENBQUMsSUFBSSxjQUFjLFNBQVMsRUFBRSxNQUFNLEVBQUcsT0FBTTtBQUFBLElBQ25ELENBQUM7QUFDRCxRQUFJLGlCQUFpQixXQUFXLENBQUMsTUFBTTtBQUNyQyxVQUFJLEVBQUUsUUFBUSxXQUFXLEVBQUUsUUFBUSxLQUFLO0FBQ3RDLFVBQUUsZUFBZTtBQUNqQixlQUFPO0FBQUEsTUFDVCxXQUFXLEVBQUUsUUFBUSxVQUFVO0FBQzdCLFlBQUksT0FBTyxHQUFHO0FBQ1osWUFBRSxlQUFlO0FBQ2pCLGdCQUFNO0FBQ04sY0FBSSxNQUFNO0FBQUEsUUFDWjtBQUFBLE1BQ0YsWUFBWSxFQUFFLFFBQVEsZUFBZSxFQUFFLFFBQVEsV0FBVyxDQUFDLE9BQU8sR0FBRztBQUNuRSxhQUFLO0FBQ0wsdUJBQWUsSUFBSTtBQUFBLE1BQ3JCO0FBQUEsSUFDRixDQUFDO0FBRUQsYUFBUyxpQkFBaUIsR0FBRztBQUMzQixZQUFNLE9BQU8sRUFBRSxPQUFPLFFBQVEsbUJBQW1CO0FBQ2pELFVBQUksQ0FBQyxLQUFNO0FBQ1gsVUFBSSxFQUFFLFdBQVksR0FBRSxlQUFlO0FBQ25DLFFBQUUsZ0JBQWdCO0FBQ2xCLFlBQU0sSUFBSSxLQUFLLFFBQVEsR0FBRztBQUMxQixVQUFJLEdBQUc7QUFDTCxZQUFJLEVBQUUsV0FBWSxHQUFFLGVBQWU7QUFDbkMsVUFBRSxhQUFhLFFBQVEsR0FBRztBQUFBLE1BQzVCO0FBQ0EsWUFBTSxPQUFPLEtBQUssYUFBYSxPQUFPO0FBQ3RDLFlBQU0sU0FBUyxNQUNiLHNCQUFzQixNQUFNO0FBNVJsQyxZQUFBQSxLQUFBQztBQTZSUSxjQUFNO0FBQ04scUJBQWE7QUFDYixZQUFJLEtBQUs7QUFDVCxTQUFBQSxPQUFBRCxNQUFBLFNBQVMsa0JBQVQsZ0JBQUFBLElBQXdCLFNBQXhCLGdCQUFBQyxJQUFBLEtBQUFEO0FBQUEsTUFDRixDQUFDO0FBQ0gsVUFBSSxVQUFVLFNBQVMsSUFBSTtBQUN6QixnQkFBUSxRQUFRLFFBQVEsSUFBSSxDQUFDLEVBQUUsUUFBUSxNQUFNO0FBQUEsV0FDMUM7QUFDSCxjQUFNLFNBQVMsS0FBSyxjQUFjLHNCQUFzQjtBQUN4RCxjQUFNLFVBQVUsS0FBSyxjQUFjLHVCQUF1QjtBQUMxRCxjQUFNLFVBQVUsSUFBSSxjQUFjLHNCQUFzQjtBQUN4RCxjQUFNLFVBQVUsSUFBSSxjQUFjLHVCQUF1QjtBQUN6RCxZQUFJLFVBQVUsU0FBUztBQUNyQixrQkFBUSxNQUFNLE9BQU87QUFDckIsa0JBQVEsTUFBTSxPQUFPLE9BQU87QUFBQSxRQUM5QjtBQUNBLFlBQUksV0FBVyxRQUFTLFNBQVEsY0FBYyxRQUFRO0FBQ3RELGVBQU87QUFBQSxNQUNUO0FBQUEsSUFDRjtBQUNBLFNBQUssaUJBQWlCLFNBQVMsZ0JBQWdCO0FBQy9DLFNBQUssaUJBQWlCLFlBQVksa0JBQWtCLEVBQUUsU0FBUyxNQUFNLENBQUM7QUFDdEUsU0FBSyxpQkFBaUIsYUFBYSxrQkFBa0IsRUFBRSxTQUFTLE1BQU0sQ0FBQztBQUd2RSxXQUFPLGlCQUFpQixxQkFBcUIsS0FBSztBQUNsRCxXQUFPLGlCQUFpQixVQUFVLEtBQUs7QUFDdkMsYUFBUyxpQkFBaUIsb0JBQW9CLE1BQU07QUFDbEQsVUFBSSxTQUFTLE9BQVEsT0FBTTtBQUFBLElBQzdCLENBQUM7QUFDRCxRQUFJLE1BQU0sY0FBYztBQUN4QixTQUFLLE1BQU0sY0FBYztBQUFBLEVBQzNCO0FBRUEsV0FBUyxlQUFlLE1BQU07QUFDNUIsVUFBTSxRQUFRO0FBQUEsTUFDWixHQUFHLEtBQUssaUJBQWlCLGlDQUFpQztBQUFBLElBQzVELEVBQUUsQ0FBQztBQUNILFFBQUksTUFBTyxPQUFNLE1BQU07QUFBQSxFQUN6QjtBQUVBLFdBQVMsZUFBZTtBQUN0QixhQUFTLGlCQUFpQixxQkFBcUIsRUFBRSxRQUFRLENBQUMsUUFBUTtBQUNoRSxVQUFJLFVBQVUsT0FBTyxTQUFTO0FBQzlCLFVBQUksYUFBYSxpQkFBaUIsT0FBTztBQUN6QyxZQUFNLE9BQU8sSUFBSSxjQUFjLG9CQUFvQjtBQUNuRCxVQUFJLE1BQU07QUFDUixhQUFLLGFBQWEsZUFBZSxNQUFNO0FBQ3ZDLGFBQUssTUFBTSxnQkFBZ0I7QUFDM0IsYUFBSyxNQUFNLGFBQWE7QUFDeEIsYUFBSyxNQUFNLFVBQVU7QUFDckIsOEJBQXNCLE1BQU07QUFDMUIsZUFBSyxnQkFBZ0IsYUFBYTtBQUNsQyxlQUFLLE1BQU0sZ0JBQWdCO0FBQzNCLGVBQUssTUFBTSxhQUFhO0FBQ3hCLGVBQUssTUFBTSxVQUFVO0FBQUEsUUFDdkIsQ0FBQztBQUFBLE1BQ0g7QUFBQSxJQUNGLENBQUM7QUFBQSxFQUNIO0FBRU8sV0FBUyxnQkFBZ0I7QUFDOUIsUUFBSTtBQUNGLGVBQVMsaUJBQWlCLFFBQVEsRUFBRSxRQUFRLENBQUMsT0FBSTtBQTVWckQ7QUE0VndELHdCQUFHLFNBQUg7QUFBQSxPQUFXO0FBQUEsSUFDakUsU0FBUyxHQUFHO0FBQUEsSUFBQztBQUFBLEVBQ2Y7QUFFQSxXQUFTLGdCQUFnQixNQUFNLE9BQU8sa0JBQWtCO0FBQ3RELFVBQU07QUFBQSxNQUNKLFNBQVM7QUFBQSxNQUNULGVBQWU7QUFBQSxNQUNmLFdBQVc7QUFBQSxNQUNYLFFBQVE7QUFBQSxJQUNWLElBQUksUUFBUSxDQUFDO0FBRWIsUUFBSTtBQUNGLFlBQU0sTUFBTSxJQUFJLElBQUksT0FBTyxTQUFTLElBQUk7QUFFeEMsVUFBSSxnQkFBZ0IsU0FBUyxVQUFVO0FBQ3JDLFlBQUksYUFBYSxPQUFPLEtBQUs7QUFBQSxNQUMvQixPQUFPO0FBQ0wsWUFBSSxhQUFhLElBQUksT0FBTyxJQUFJO0FBQUEsTUFDbEM7QUFHQSxZQUFNLE9BQU8sSUFBSSxZQUFZLElBQUksVUFBVSxPQUFPLElBQUksUUFBUTtBQUM5RCxZQUFNLFVBQVUsU0FBUyxXQUFXLFNBQVMsU0FBUyxTQUFTO0FBRS9ELFVBQUksU0FBUyxRQUFTO0FBRXRCLFVBQUksV0FBVyxRQUFRO0FBQ3JCLGdCQUFRLFVBQVUsTUFBTSxJQUFJLElBQUk7QUFBQSxNQUNsQyxPQUFPO0FBQ0wsZ0JBQVEsYUFBYSxNQUFNLElBQUksSUFBSTtBQUFBLE1BQ3JDO0FBQUEsSUFDRixTQUFRO0FBRU4sWUFBTSxTQUFTLElBQUksZ0JBQWdCLFNBQVMsTUFBTTtBQUNsRCxVQUFJLGdCQUFnQixTQUFTLFVBQVU7QUFDckMsZUFBTyxPQUFPLEtBQUs7QUFBQSxNQUNyQixPQUFPO0FBQ0wsZUFBTyxJQUFJLE9BQU8sSUFBSTtBQUFBLE1BQ3hCO0FBQ0EsWUFBTSxJQUFJLE9BQU8sU0FBUztBQUMxQixZQUFNLE9BQU8sU0FBUyxZQUFZLElBQUksSUFBSSxDQUFDLEtBQUssTUFBTSxTQUFTO0FBQy9ELFlBQU0sVUFBVSxTQUFTLFdBQVcsU0FBUyxTQUFTLFNBQVM7QUFDL0QsVUFBSSxTQUFTLFFBQVM7QUFDdEIsY0FBUSxhQUFhLE1BQU0sSUFBSSxJQUFJO0FBQUEsSUFDckM7QUFBQSxFQUNGOzs7QUNpRUEsTUFBTSxVQUFVO0FBQUEsSUFDZCxHQUFHLEVBQUUsS0FBSyx5Q0FBeUMsT0FBTyx3Q0FBd0M7QUFBQSxJQUNsRyxHQUFHLEVBQUUsS0FBSyx5Q0FBeUMsT0FBTyx3Q0FBd0M7QUFBQSxJQUNsRyxHQUFHLEVBQUUsS0FBSyx5Q0FBeUMsT0FBTyx3Q0FBd0M7QUFBQSxJQUNsRyxHQUFHLEVBQUUsS0FBSyx5Q0FBeUMsT0FBTyx3Q0FBd0M7QUFBQSxJQUNsRyxHQUFHLEVBQUUsS0FBSyx5Q0FBeUMsT0FBTyx3Q0FBd0M7QUFBQSxJQUNsRyxHQUFHLEVBQUUsS0FBSyx5Q0FBeUMsT0FBTyx3Q0FBd0M7QUFBQSxJQUNsRyxHQUFHLEVBQUUsS0FBSyx5Q0FBeUMsT0FBTyx3Q0FBd0M7QUFBQSxJQUNsRyxHQUFHLEVBQUUsS0FBSyx5Q0FBeUMsT0FBTyx3Q0FBd0M7QUFBQSxJQUNsRyxHQUFHLEVBQUUsS0FBSywyQ0FBMkMsT0FBTywwQ0FBMEM7QUFBQSxFQUN4RztBQUdBLE1BQU0sV0FBVztBQUFBLElBQ2YsQ0FBQyxHQUFHLEdBQUcsR0FBRyxHQUFHLEdBQUcsR0FBRyxHQUFHLENBQUM7QUFBQSxJQUN2QixDQUFDLEdBQUcsR0FBRyxHQUFHLEdBQUcsR0FBRyxHQUFHLEdBQUcsQ0FBQztBQUFBLElBQ3ZCLENBQUMsR0FBRyxHQUFHLEdBQUcsR0FBRyxHQUFHLEdBQUcsR0FBRyxDQUFDO0FBQUEsSUFDdkIsQ0FBQyxHQUFHLEdBQUcsR0FBRyxHQUFHLEdBQUcsR0FBRyxHQUFHLENBQUM7QUFBQSxJQUN2QixDQUFDLEdBQUcsR0FBRyxHQUFHLEdBQUcsR0FBRyxHQUFHLEdBQUcsQ0FBQztBQUFBLElBQ3ZCLENBQUMsR0FBRyxHQUFHLEdBQUcsR0FBRyxHQUFHLEdBQUcsR0FBRyxDQUFDO0FBQUEsRUFDekI7QUFRTyxXQUFTLFdBQVc7QUFFekIsMEJBQXNCO0FBR3RCLFVBQU0sTUFBTSxTQUFTLGNBQWMsbUJBQW1CO0FBQ3RELFVBQU0sT0FBTyxTQUFTLGNBQWMsT0FBTztBQUMzQyxRQUFJLENBQUMsT0FBTyxDQUFDLEtBQU07QUFHbkIsUUFBSSxpQkFBaUIsU0FBUyxDQUFDLE1BQU07QUFDbkMsUUFBRSxlQUFlO0FBRWpCLFVBQUksS0FBSyxVQUFVLFNBQVMsU0FBUyxFQUFHO0FBRXhDLFdBQUssVUFBVSxJQUFJLFNBQVM7QUFDNUIsVUFBSSxhQUFhLGlCQUFpQixNQUFNO0FBQ3hDLFVBQUksYUFBYSxZQUFZLEVBQUU7QUFDL0IsbUJBQWEsUUFBUSxhQUFhLE1BQU07QUFHeEMscUJBQWUsT0FBTyxFQUFFLEtBQUssTUFBTTtBQUNqQyxxQkFBYSxTQUFTLFFBQVE7QUFDOUIsNEJBQW9CO0FBQUEsTUFDdEIsQ0FBQztBQUdELFlBQU0sV0FBVyxLQUFLLGNBQWMsMkNBQTJDO0FBQy9FLDJDQUFVO0FBQUEsUUFDUjtBQUFBLFFBQ0EsTUFBTTtBQXJnQlo7QUFzZ0JRLGdCQUFNLE1BQUssY0FBUyxjQUFjLGtCQUFrQixNQUF6QyxtQkFBNEM7QUFDdkQsY0FBSSxHQUFJLElBQUcsVUFBVTtBQUFBLFFBQ3ZCO0FBQUEsUUFDQSxFQUFFLE1BQU0sS0FBSztBQUFBO0FBQUEsSUFFakIsQ0FBQztBQUFBLEVBVUg7QUFLQSxXQUFTLGVBQWUsU0FBUztBQUMvQixVQUFNLFFBQVEsQ0FBQztBQUNmLGVBQVcsRUFBRSxLQUFLLE1BQU0sS0FBSyxPQUFPLE9BQU8sT0FBTyxHQUFHO0FBQ25ELGlCQUFXLE9BQU8sQ0FBQyxLQUFLLEtBQUssR0FBRztBQUM5QixZQUFJLENBQUMsSUFBSztBQUNWLGNBQU07QUFBQSxVQUNKLElBQUksUUFBUSxDQUFDLFFBQVE7QUFDbkIsa0JBQU0sS0FBSyxJQUFJLE1BQU07QUFDckIsZUFBRyxXQUFXO0FBQ2QsZUFBRyxTQUFTLEdBQUcsVUFBVSxNQUFNLElBQUk7QUFDbkMsZUFBRyxNQUFNO0FBQ1QsZ0JBQUksR0FBRyxPQUFRLElBQUcsT0FBTyxFQUFFLE1BQU0sTUFBTTtBQUFBLFlBQUMsQ0FBQztBQUFBLFVBQzNDLENBQUM7QUFBQSxRQUNIO0FBQUEsTUFDRjtBQUFBLElBQ0Y7QUFDQSxXQUFPLFFBQVEsSUFBSSxLQUFLO0FBQUEsRUFDMUI7QUFHQSxXQUFTLGFBQWEsU0FBUyxTQUFTO0FBQ3RDLFVBQU0sT0FBTyxTQUFTLGNBQWMsT0FBTztBQUMzQyxRQUFJLENBQUMsS0FBTTtBQUVYLFVBQU0sT0FBTyxNQUFNLEtBQUssS0FBSyxpQkFBaUIsWUFBWSxDQUFDO0FBQzNELFVBQU0sSUFBSSxLQUFLO0FBQ2YsUUFBSSxDQUFDLEVBQUc7QUFFUixVQUFNLElBQUksS0FBSyxJQUFJLEdBQUcsS0FBSyxJQUFJLENBQUMsUUFBUSxJQUFJLGlCQUFpQixrQkFBa0IsRUFBRSxNQUFNLENBQUM7QUFDeEYsUUFBSSxDQUFDLEVBQUc7QUFFUixVQUFNLEtBQUssQ0FBQyxHQUFHLE1BQU0sS0FBSyxDQUFDLEVBQUUsaUJBQWlCLGtCQUFrQixFQUFFLENBQUM7QUFFbkUsYUFBUyxJQUFJLEdBQUcsSUFBSSxHQUFHLEtBQUs7QUFDMUIsWUFBTSxVQUFVLFFBQVEsQ0FBQztBQUN6QixVQUFJLENBQUMsTUFBTSxRQUFRLE9BQU8sRUFBRztBQUU3QixlQUFTLElBQUksR0FBRyxJQUFJLEdBQUcsS0FBSztBQUMxQixjQUFNLE1BQU0sR0FBRyxHQUFHLENBQUM7QUFDbkIsWUFBSSxDQUFDLElBQUs7QUFFVixjQUFNLFFBQVEsUUFBUSxDQUFDO0FBQ3ZCLGNBQU0sTUFBTSxRQUFRLEtBQUs7QUFDekIsWUFBSSxDQUFDLElBQUs7QUFFVixZQUFJLGFBQWEsZ0JBQWdCLE9BQU8sS0FBSyxDQUFDO0FBQzlDLFlBQUksYUFBYSxpQkFBaUIsSUFBSSxHQUFHO0FBQ3pDLFlBQUksYUFBYSxvQkFBb0IsR0FBRyxJQUFJLEdBQUcsUUFBUSxJQUFJLEtBQUssS0FBSztBQUFBLE1BQ3ZFO0FBQUEsSUFDRjtBQUFBLEVBQ0Y7QUFHQSxXQUFTLHdCQUF3QjtBQUMvQixVQUFNLE9BQU8sU0FBUyxjQUFjLE9BQU87QUFDM0MsUUFBSSxDQUFDLEtBQU07QUFFWCxVQUFNLE9BQU8sTUFBTSxLQUFLLEtBQUssaUJBQWlCLFlBQVksQ0FBQztBQUMzRCxVQUFNLElBQUksS0FBSztBQUNmLFFBQUksQ0FBQyxFQUFHO0FBRVIsVUFBTSxJQUFJLEtBQUssSUFBSSxHQUFHLEtBQUssSUFBSSxDQUFDLFFBQVEsSUFBSSxpQkFBaUIsa0JBQWtCLEVBQUUsTUFBTSxDQUFDO0FBQ3hGLFFBQUksQ0FBQyxFQUFHO0FBRVIsVUFBTSxLQUFLLGlCQUFpQixJQUFJO0FBQ2hDLFVBQU0sVUFBVSxXQUFXLEdBQUcsaUJBQWlCLFlBQVksQ0FBQyxLQUFLO0FBQ2pFLFVBQU0sU0FBVSxXQUFXLEdBQUcsaUJBQWlCLFdBQVcsQ0FBQyxLQUFNO0FBQ2pFLFVBQU0sTUFBVSxXQUFXLEdBQUcsaUJBQWlCLE9BQU8sQ0FBQyxLQUFVO0FBQ2pFLFVBQU0sVUFBVSxXQUFXLEdBQUcsaUJBQWlCLGVBQWUsQ0FBQyxLQUFLO0FBRXBFLFVBQU0sS0FBSyxDQUFDLEdBQUcsTUFBTSxLQUFLLENBQUMsRUFBRSxpQkFBaUIsa0JBQWtCLEVBQUUsQ0FBQztBQUVuRSxRQUFJLGFBQWE7QUFDakIsUUFBSSxTQUFTO0FBRWIsYUFBUyxJQUFJLEdBQUcsSUFBSSxHQUFHLEtBQUs7QUFDMUIsWUFBTSxZQUFZLElBQUk7QUFFdEIsZUFBUyxJQUFJLEdBQUcsSUFBSSxHQUFHLEtBQUs7QUFDMUIsY0FBTSxNQUFNLEdBQUcsR0FBRyxDQUFDO0FBQ25CLFlBQUksQ0FBQyxJQUFLO0FBRVYsY0FBTSxXQUFXLGFBQWEsSUFBSSxJQUFJLEtBQUs7QUFDM0MsWUFBSSxNQUFNLFlBQVksZUFBZSxHQUFHLFFBQVEsR0FBRztBQUVuRCxjQUFNLGFBQWEsWUFBWSxJQUFJLFVBQVU7QUFDN0MsY0FBTSxVQUFVLGNBQWMsSUFBSSxJQUFJLEtBQUs7QUFDM0MsWUFBSSxNQUFNLFlBQVksY0FBYyxHQUFHLE9BQU8sR0FBRztBQUVqRCxZQUFJLFVBQVUsWUFBWTtBQUN4Qix1QkFBYTtBQUNiLG1CQUFTO0FBQUEsUUFDWDtBQUFBLE1BQ0Y7QUFBQSxJQUNGO0FBRUEsUUFBSSxPQUFRLFFBQU8sVUFBVSxJQUFJLFVBQVU7QUFHM0MsVUFBTSxVQUFVLEdBQUcsR0FBRyxJQUFJLENBQUM7QUFDM0IsdUNBQVMsVUFBVSxJQUFJO0FBR3ZCLFFBQUksUUFBUSxjQUFjLEdBQUc7QUFDM0IsV0FBSyxRQUFRLFFBQVEsT0FBTyxhQUFhLEdBQUc7QUFBQSxJQUM5QztBQUFBLEVBQ0Y7QUFHQSxXQUFTLHNCQUFzQjtBQUM3QixVQUFNLE9BQU8sU0FBUyxjQUFjLE9BQU87QUFDM0MsUUFBSSxDQUFDLEtBQU07QUFFWCxVQUFNLE9BQU8sTUFBTSxLQUFLLEtBQUssaUJBQWlCLHNCQUFzQixDQUFDO0FBQ3JFLFFBQUksQ0FBQyxLQUFLLE9BQVE7QUFHbEIsMEJBQXNCLE1BQU07QUFDMUIsV0FBSyxRQUFRLENBQUMsTUFBTSxFQUFFLFVBQVUsSUFBSSxZQUFZLENBQUM7QUFBQSxJQUNuRCxDQUFDO0FBR0QsU0FBSyxRQUFRLENBQUMsUUFBUTtBQUNwQixZQUFNLFdBQVcsQ0FBQyxNQUFNO0FBQ3RCLFlBQUksRUFBRSxrQkFBa0IsZ0JBQWlCO0FBRXpDLGNBQU0sTUFBTSxJQUFJLGNBQWMsS0FBSztBQUNuQyxjQUFNLFNBQVMsSUFBSSxjQUFjLFFBQVE7QUFDekMsY0FBTSxTQUFTLElBQUksYUFBYSxjQUFjO0FBQzlDLGNBQU0sVUFBVSxJQUFJLGFBQWEsZUFBZTtBQUNoRCxjQUFNLGFBQWEsSUFBSSxhQUFhLGtCQUFrQjtBQUd0RCxZQUFJLFVBQVUsV0FBWSxRQUFPLGFBQWEsVUFBVSxVQUFVO0FBRWxFLFlBQUksT0FBTyxRQUFTLGdCQUFlLEtBQUssT0FBTztBQUUvQyxZQUFJLE9BQVEsS0FBSSxRQUFRLFNBQVM7QUFHakMsOEJBQXNCLE1BQU07QUFDMUIsZ0NBQXNCLE1BQU07QUFDMUIsZ0JBQUksVUFBVSxJQUFJLGdCQUFnQixhQUFhO0FBQy9DLGdCQUFJLFVBQVUsT0FBTyxZQUFZO0FBQUEsVUFDbkMsQ0FBQztBQUFBLFFBQ0gsQ0FBQztBQUVELFlBQUksb0JBQW9CLGdCQUFnQixRQUFRO0FBQUEsTUFDbEQ7QUFDQSxVQUFJLGlCQUFpQixnQkFBZ0IsUUFBUTtBQUFBLElBQy9DLENBQUM7QUFHRCxVQUFNLFdBQVcsS0FBSyxjQUFjLFdBQVc7QUFDL0MsVUFBTSxvQkFBb0IsTUFBTTtBQUM5QixtQ0FBNkIsR0FBRyxHQUFHLE9BQU8sRUFBRSxLQUFLLE1BQU07QUFDckQsbUJBQVcsTUFBTSxTQUFTLGNBQWMsSUFBSSxZQUFZLGFBQWEsQ0FBQyxHQUFHLEdBQUk7QUFBQSxNQUMvRSxDQUFDO0FBQUEsSUFDSDtBQUVBLFFBQUksVUFBVTtBQUNaLFlBQU0sZUFBZSxDQUFDLE1BQU07QUFDMUIsWUFBSSxFQUFFLGtCQUFrQixlQUFnQjtBQUN4QyxpQkFBUyxvQkFBb0IsZ0JBQWdCLFlBQVk7QUFDekQsMEJBQWtCO0FBQUEsTUFDcEI7QUFDQSxlQUFTLGlCQUFpQixnQkFBZ0IsWUFBWTtBQUFBLElBQ3hELE9BQU87QUFDTCxZQUFNLFNBQVMsV0FBVyxLQUFLLFFBQVEsU0FBUyxHQUFHO0FBQ25ELFVBQUksU0FBUyxFQUFHLFlBQVcsbUJBQW1CLEtBQUssS0FBSyxTQUFTLEdBQUksSUFBSSxFQUFFO0FBQUEsSUFDN0U7QUFBQSxFQUNGO0FBR0EsV0FBUyxlQUFlLEtBQUssU0FBUztBQUVwQyxRQUFJLGdCQUFnQixRQUFRO0FBRTVCLFFBQUksTUFBTTtBQUNWLFFBQUksVUFBVTtBQUNkLFFBQUksV0FBVztBQUdmLFFBQUk7QUFFSixRQUFJLGFBQWEsVUFBVSxHQUFHLE9BQU8sRUFBRTtBQUFBLEVBQ3pDO0FBR0EsV0FBUyw2QkFBNkIsUUFBUSxNQUFNLFNBQVM7QUFDM0QsVUFBTSxPQUFPLFNBQVMsY0FBYyxPQUFPO0FBQzNDLFFBQUksQ0FBQyxLQUFNLFFBQU8sUUFBUSxRQUFRO0FBRWxDLFVBQU0sUUFBUSxRQUFRLElBQUk7QUFDMUIsUUFBSSxDQUFDLE1BQU8sUUFBTyxRQUFRLFFBQVE7QUFHbkMsVUFBTSxPQUFPLE1BQU0sS0FBSyxLQUFLLGlCQUFpQixzQkFBc0IsQ0FBQyxFQUNsRSxPQUFPLENBQUMsUUFBUSxJQUFJLFFBQVEsV0FBVyxPQUFPLE1BQU0sQ0FBQztBQUN4RCxRQUFJLENBQUMsS0FBSyxPQUFRLFFBQU8sUUFBUSxRQUFRO0FBR3pDLFVBQU0sVUFBVSxXQUFXLGlCQUFpQixJQUFJLEVBQUUsaUJBQWlCLGFBQWEsQ0FBQyxLQUFLO0FBQ3RGLFVBQU0sVUFBVSxLQUFLLE1BQU0sVUFBVSxHQUFJO0FBR3pDLFVBQU0sY0FBYztBQUNwQixVQUFNLGFBQWM7QUFFcEIsVUFBTSxRQUFRLEtBQUssSUFBSSxDQUFDLFFBQVEsSUFBSSxRQUFRLENBQUMsWUFBWTtBQUN2RCxZQUFNLFNBQVMsSUFBSSxjQUFjLEtBQUs7QUFDdEMsWUFBTSxTQUFTLElBQUksY0FBYyxRQUFRO0FBQ3pDLFVBQUksQ0FBQyxPQUFRLFFBQU8sUUFBUTtBQUc1QixVQUFJLFVBQVUsSUFBSSxXQUFXO0FBQzdCLGFBQU8sVUFBVSxJQUFJLFlBQVksWUFBWTtBQUc3QyxZQUFNLFNBQVMsU0FBUyxjQUFjLEtBQUs7QUFDM0MsYUFBTyxZQUFZO0FBQ25CLGFBQU8sTUFBTSxPQUFPLE9BQU87QUFDM0IsYUFBTyxXQUFXO0FBQ2xCLGFBQU8sVUFBVTtBQUNqQixhQUFPLE1BQU0sTUFBTTtBQUNuQixhQUFPLGFBQWEsVUFBVSxHQUFHLE1BQU0sR0FBRyxFQUFFO0FBQzVDLFVBQUksWUFBWSxNQUFNO0FBR3RCLFlBQU0sUUFBUSxPQUFPLFNBQVMsT0FBTyxPQUFPLEVBQUUsTUFBTSxNQUFNO0FBQUEsTUFBQyxDQUFDLElBQUksUUFBUSxRQUFRO0FBRWhGLFlBQU0sS0FBSyxNQUFNO0FBQ2YsWUFBSSxRQUFRO0FBQ1osY0FBTSxjQUFjLE1BQU07QUFBRSxjQUFJLE9BQVEsY0FBYSxNQUFNO0FBQUcsY0FBSSxNQUFPLGNBQWEsS0FBSztBQUFBLFFBQUc7QUFDOUYseUJBQWlCLEtBQUssV0FBVztBQUVqQyw4QkFBc0IsTUFBTTtBQUMxQixtQkFBUyxXQUFXLE1BQU07QUFDeEIsZ0JBQUksVUFBVSxJQUFJLFlBQVk7QUFFOUIsb0JBQVEsV0FBVyxNQUFNO0FBQ3ZCLG9CQUFNLFlBQVksTUFBTTtBQUN0Qix1QkFBTyxvQkFBb0IsaUJBQWlCLFNBQVM7QUFHckQsb0JBQUksUUFBUTtBQUNWLHlCQUFPLGFBQWEsVUFBVSxHQUFHLE1BQU0sR0FBRyxRQUFRLE1BQU0sS0FBSyxLQUFLO0FBQUEsZ0JBQ3BFO0FBQ0EsK0JBQWUsUUFBUSxNQUFNLEdBQUc7QUFHaEMsdUJBQU8sVUFBVSxPQUFPLFlBQVksWUFBWSxZQUFZO0FBQzVELHVCQUFPLE1BQU0sVUFBVTtBQUN2QixvQkFBSSxPQUFPLFdBQVksUUFBTyxXQUFXLFlBQVksTUFBTTtBQUMzRCxvQkFBSSxVQUFVLE9BQU8sY0FBYyxXQUFXO0FBRzlDLG9CQUFJLFFBQVEsU0FBUyxPQUFPLElBQUk7QUFFaEMsd0JBQVE7QUFBQSxjQUNWO0FBRUEscUJBQU8saUJBQWlCLGlCQUFpQixTQUFTO0FBQ2xELHFCQUFPLFVBQVUsSUFBSSxVQUFVO0FBRy9CLHlCQUFXLFdBQVcsVUFBVSxFQUFFO0FBQUEsWUFDcEMsR0FBRyxVQUFVO0FBQUEsVUFDZixHQUFHLFdBQVc7QUFBQSxRQUNoQixDQUFDO0FBQUEsTUFDSCxDQUFDO0FBQUEsSUFDSCxDQUFDLENBQUM7QUFFRixXQUFPLFFBQVEsSUFBSSxLQUFLO0FBQUEsRUFDMUI7QUFHQSxXQUFTLGlCQUFpQixTQUFTLFdBQVc7QUFDNUMsVUFBTSxTQUFTLFFBQVE7QUFDdkIsUUFBSSxDQUFDLE9BQVE7QUFFYixVQUFNLE1BQU0sSUFBSSxpQkFBaUIsQ0FBQyxjQUFjO0FBQzlDLGlCQUFXLEtBQUssV0FBVztBQUN6QixtQkFBVyxRQUFRLEVBQUUsY0FBYztBQUNqQyxjQUFJLFNBQVMsU0FBUztBQUNwQixnQkFBSTtBQUFFLHdCQUFVO0FBQUEsWUFBRyxVQUNuQjtBQUFVLGtCQUFJLFdBQVc7QUFBQSxZQUFHO0FBQzVCO0FBQUEsVUFDRjtBQUFBLFFBQ0Y7QUFBQSxNQUNGO0FBQUEsSUFDRixDQUFDO0FBRUQsUUFBSSxRQUFRLFFBQVEsRUFBRSxXQUFXLEtBQUssQ0FBQztBQUFBLEVBQ3pDOzs7QUNoMEJPLFdBQVMsWUFBWTtBQUE1QjtBQUNFLG1CQUFTLGVBQWUsT0FBTyxNQUEvQixtQkFBa0MsVUFBVSxJQUFJO0FBQUEsRUFDbEQ7QUFFTyxXQUFTLFlBQVk7QUFDMUIsYUFBUyxpQkFBaUIsZUFBZSxTQUFTO0FBQUEsRUFDcEQ7OztBQ0pBLE1BQU0sZUFBZTtBQUFBLElBQ25CLEtBQUs7QUFBQSxNQUNILEVBQUUsS0FBSywwQkFBMEIsS0FBSyxVQUFVO0FBQUEsTUFDaEQsRUFBRSxLQUFLLHVCQUF1QixLQUFLLE9BQU87QUFBQSxNQUMxQyxFQUFFLEtBQUssMkJBQTJCLEtBQUssWUFBWTtBQUFBLE1BQ25ELEVBQUUsS0FBSyw0QkFBNEIsS0FBSyxhQUFhO0FBQUEsTUFDckQsRUFBRSxLQUFLLDBCQUEwQixLQUFLLGlCQUFpQjtBQUFBLE1BQ3ZELEVBQUUsS0FBSyxzQkFBc0IsS0FBSyxNQUFNO0FBQUEsSUFDMUM7QUFBQSxJQUNBLEtBQUs7QUFBQSxNQUNILEVBQUUsS0FBSyx5QkFBeUIsS0FBSyxTQUFTO0FBQUEsTUFDOUMsRUFBRSxLQUFLLHVCQUF1QixLQUFLLE9BQU87QUFBQSxNQUMxQyxFQUFFLEtBQUssMkJBQTJCLEtBQUssWUFBWTtBQUFBLE1BQ25ELEVBQUUsS0FBSyw0QkFBNEIsS0FBSyxhQUFhO0FBQUEsTUFDckQsRUFBRSxLQUFLLHdCQUF3QixLQUFLLFFBQVE7QUFBQSxNQUM1QyxFQUFFLEtBQUssMEJBQTBCLEtBQUssaUJBQWlCO0FBQUEsTUFDdkQsRUFBRSxLQUFLLDJCQUEyQixLQUFLLFdBQVc7QUFBQSxNQUNsRCxFQUFFLEtBQUsseUJBQXlCLEtBQUssU0FBUztBQUFBLE1BQzlDLEVBQUUsS0FBSyx3QkFBd0IsS0FBSyxRQUFRO0FBQUEsTUFDNUMsRUFBRSxLQUFLLHlCQUF5QixLQUFLLFNBQVM7QUFBQSxNQUM5QyxFQUFFLEtBQUssOEJBQThCLEtBQUssZUFBZTtBQUFBLE1BQ3pELEVBQUUsS0FBSyxzQkFBc0IsS0FBSyxNQUFNO0FBQUEsSUFDMUM7QUFBQSxJQUNBLFNBQVM7QUFBQSxNQUNQLEVBQUUsS0FBSyx1QkFBdUIsS0FBSyxPQUFPO0FBQUEsTUFDMUMsRUFBRSxLQUFLLDJCQUEyQixLQUFLLFlBQVk7QUFBQSxNQUNuRCxFQUFFLEtBQUssNEJBQTRCLEtBQUssYUFBYTtBQUFBLE1BQ3JELEVBQUUsS0FBSywwQkFBMEIsS0FBSyxpQkFBaUI7QUFBQSxNQUN2RCxFQUFFLEtBQUssc0JBQXNCLEtBQUssTUFBTTtBQUFBLElBQzFDO0FBQUEsRUFDRjtBQU1BLFdBQVMsV0FBVyxNQUFNO0FBQ3hCLFFBQUksU0FBUyxNQUFPLFFBQU87QUFDM0IsUUFBSSxTQUFTLE1BQU8sUUFBTztBQUMzQixXQUFPO0FBQUEsRUFDVDtBQU1PLFdBQVMscUJBQXFCLE1BQU07QUFDekMsVUFBTSxTQUFTLFdBQVcsSUFBSTtBQUM5QixVQUFNLFFBQVEsYUFBYSxNQUFNLEtBQUssYUFBYTtBQUVuRCxVQUFNLFlBQVksU0FBUyxjQUFjLHdCQUF3QjtBQUNqRSxRQUFJLENBQUMsVUFBVztBQUdoQixjQUFVLFlBQVk7QUFFdEIsZUFBVyxLQUFLLE9BQU87QUFDckIsWUFBTSxPQUFPLFNBQVMsY0FBYyxLQUFLO0FBQ3pDLFdBQUssWUFBWTtBQUNqQixZQUFNLE1BQU0sU0FBUyxjQUFjLEtBQUs7QUFDeEMsVUFBSSxXQUFXO0FBQ2YsVUFBSSxNQUFNLEVBQUU7QUFDWixVQUFJLE1BQU0sRUFBRSxPQUFPO0FBQ25CLFdBQUssWUFBWSxHQUFHO0FBQ3BCLGdCQUFVLFlBQVksSUFBSTtBQUFBLElBQzVCO0FBQUEsRUFDRjtBQUdRLFdBQVMsbUJBQW1CO0FBQ2xDLHlCQUFxQixXQUFXLENBQUM7QUFBQSxFQUNuQzs7O0FDL0RBLFdBQVMsZ0JBQWdCO0FBQ3ZCLFdBQU8sSUFBSSxRQUFRLENBQUMsTUFBTSxzQkFBc0IsTUFBTSxFQUFFLENBQUMsQ0FBQztBQUFBLEVBQzVEO0FBRUEsaUJBQWUsc0JBQXNCO0FBQ25DLFVBQU0sUUFBUSxDQUFDLEdBQUcsU0FBUyxpQkFBaUIsd0JBQXdCLENBQUM7QUFFckUsVUFBTSxRQUFRO0FBQUEsTUFDWixNQUFNO0FBQUEsUUFDSixDQUFDLFNBQ0MsSUFBSSxRQUFRLENBQUMsUUFBUTtBQUNuQixlQUFLLGlCQUFpQixRQUFRLEtBQUssRUFBRSxNQUFNLEtBQUssQ0FBQztBQUNqRCxlQUFLLGlCQUFpQixTQUFTLEtBQUssRUFBRSxNQUFNLEtBQUssQ0FBQztBQUNsRCxxQkFBVyxLQUFLLENBQUM7QUFBQSxRQUNuQixDQUFDO0FBQUEsTUFDTDtBQUFBLElBQ0Y7QUFFQSxVQUFNLG1CQUFtQixDQUFDLEdBQUcsU0FBUyxXQUFXLEVBQUUsT0FBTyxDQUFDLE1BQU07QUFDL0QsVUFBSTtBQUNGLGNBQU0sT0FBTyxFQUFFLFFBQVE7QUFDdkIsZUFDRSxDQUFDLFFBQVEsS0FBSyxXQUFXLFNBQVMsTUFBTSxLQUFLLEtBQUssV0FBVyxPQUFPO0FBQUEsTUFFeEUsU0FBUTtBQUNOLGVBQU87QUFBQSxNQUNUO0FBQUEsSUFDRixDQUFDO0FBRUQsVUFBTSxXQUFXLE1BQU07QUFDckIsaUJBQVcsU0FBUyxrQkFBa0I7QUFDcEMsWUFBSTtBQUNGLGdCQUFNLElBQUksTUFBTTtBQUFBLFFBQ2xCLFNBQVMsR0FBRztBQUFBLFFBQUM7QUFBQSxNQUNmO0FBQUEsSUFDRjtBQUVBLGFBQVMsSUFBSSxHQUFHLElBQUksR0FBRyxLQUFLO0FBQzFCLGVBQVM7QUFDVCxZQUFNLElBQUksUUFBUSxDQUFDLE1BQU0sc0JBQXNCLENBQUMsQ0FBQztBQUFBLElBQ25EO0FBQUEsRUFDRjtBQUVBLFdBQVMsZUFBZTtBQUN0QixXQUFPLFdBQVcsV0FBVyxTQUFTLE1BQU0sUUFBUSxRQUFRLFFBQVE7QUFBQSxFQUN0RTtBQUVBLFdBQVMsYUFBYSxJQUFJO0FBQ3hCLFFBQUksQ0FBQyxHQUFJLFFBQU8sUUFBUSxRQUFRO0FBQ2hDLFVBQU0sT0FBTyxDQUFDLEdBQUcsR0FBRyxpQkFBaUIsS0FBSyxDQUFDO0FBQzNDLFVBQU0sV0FBVyxLQUFLO0FBQUEsTUFBSSxDQUFDLFFBQ3pCLElBQUksV0FDQSxRQUFRLFFBQVEsSUFDaEIsSUFBSSxRQUFRLENBQUMsUUFBUTtBQUNuQixjQUFNLEtBQUssTUFBTSxJQUFJO0FBQ3JCLFlBQUksaUJBQWlCLFFBQVEsSUFBSSxFQUFFLE1BQU0sS0FBSyxDQUFDO0FBQy9DLFlBQUksaUJBQWlCLFNBQVMsSUFBSSxFQUFFLE1BQU0sS0FBSyxDQUFDO0FBQUEsTUFDbEQsQ0FBQztBQUFBLElBQ1A7QUFDQSxXQUFPLFFBQVEsSUFBSSxRQUFRO0FBQUEsRUFDN0I7QUFFQSxpQkFBZSxZQUFZO0FBQ3pCLFVBQU0sb0JBQW9CO0FBQzFCLFVBQU0sYUFBYTtBQUVuQixzQkFBa0I7QUFDbEIsWUFBUSxXQUFXLENBQUM7QUFDcEIsY0FBVTtBQUVWLFVBQU0sV0FBVyxTQUFTLGNBQWMsT0FBTztBQUMvQyxVQUFNLGFBQWEsUUFBUTtBQUMzQixVQUFNLG1CQUFtQixDQUFDLFNBQVMsZ0JBQWdCLENBQUM7QUFDcEQsVUFBTSxjQUFjO0FBR3BCLGlCQUFhLFFBQVEsYUFBYSxPQUFPO0FBS3pDLGFBQVM7QUFFVCxhQUFTLGdCQUFnQixVQUFVLE9BQU8sZUFBZTtBQUN6RCxrQkFBYztBQUFBLEVBQ2hCO0FBRUEsWUFBVSxFQUFFLE1BQU0sUUFBUSxLQUFLO0FBRS9CLFdBQVMsYUFBYSxPQUFPO0FBQzNCLFVBQU0sT0FBTyxDQUFDO0FBQ2QsVUFBTSxRQUFRLG1CQUFtQixDQUFDLEdBQUcsUUFBUTtBQUMzQyxZQUFNLElBQUksSUFBSSxLQUFLLEVBQUUsUUFBUSxnQkFBZ0IsRUFBRTtBQUMvQyxVQUFJLEtBQUssTUFBTSxjQUFlLE1BQUssS0FBSyxDQUFDO0FBQUEsSUFDM0MsQ0FBQztBQUNELFdBQU87QUFBQSxFQUNUO0FBRUEsV0FBUyxtQkFBbUIsV0FBVztBQUNyQyxVQUFNLE9BQU8sb0JBQUksSUFBSTtBQUNyQixlQUFXLE9BQU8sV0FBVztBQUMzQixlQUFTLGlCQUFpQixHQUFHLEVBQUUsUUFBUSxDQUFDLE9BQU87QUFDN0MsY0FBTSxLQUFLLGlCQUFpQixFQUFFLEVBQUUsaUJBQWlCLGtCQUFrQjtBQUNuRSxxQkFBYSxFQUFFLEVBQUUsUUFBUSxDQUFDLE1BQU0sS0FBSyxJQUFJLENBQUMsQ0FBQztBQUFBLE1BQzdDLENBQUM7QUFBQSxJQUNIO0FBQ0EsUUFBSSxLQUFLLFNBQVMsRUFBRyxRQUFPLFFBQVEsUUFBUTtBQUM1QyxVQUFNLFFBQVEsQ0FBQyxHQUFHLElBQUksRUFBRTtBQUFBLE1BQ3RCLENBQUMsUUFDQyxJQUFJLFFBQVEsQ0FBQyxRQUFRO0FBQ25CLGNBQU0sTUFBTSxJQUFJLE1BQU07QUFDdEIsWUFBSSxTQUFTLElBQUksVUFBVSxNQUFNLElBQUk7QUFDckMsWUFBSSxNQUFNO0FBQUEsTUFDWixDQUFDO0FBQUEsSUFDTDtBQUNBLFdBQU8sUUFBUSxJQUFJLEtBQUs7QUFBQSxFQUMxQjtBQUVBLE1BQUksU0FBUyxlQUFlLFdBQVc7QUFDckMsYUFBUyxpQkFBaUIsb0JBQW9CLGtCQUFrQjtBQUFBLE1BQzlELE1BQU07QUFBQSxJQUNSLENBQUM7QUFBQSxFQUNILE9BQU87QUFDTCxxQkFBaUI7QUFBQSxFQUNuQjtBQUdBLFNBQU8saUJBQWlCLGNBQWMsQ0FBQyxNQUFNO0FBekk3QztBQTBJRSxVQUFNLFNBQU8sNEJBQUcsV0FBSCxtQkFBVyxTQUFRLFdBQVc7QUFDM0MseUJBQXFCLElBQUk7QUFBQSxFQUMzQixDQUFDO0FBRUQsR0FBQyxXQUFZO0FBQ1gsUUFBSSxNQUFNLElBQUksSUFBSSxPQUFPLFNBQVMsSUFBSTtBQUN0QyxRQUFJLElBQUksYUFBYSxJQUFJLGFBQWEsR0FBRztBQUN2QyxVQUFJLGNBQWMsSUFBSSxJQUFJLElBQUksYUFBYSxJQUFJLGFBQWEsQ0FBQztBQUM3RCxVQUNFLFlBQVksS0FBSyxNQUFNLEtBQUssRUFBRSxXQUFXLEtBQ3pDLFlBQVksYUFBYSxJQUFJLEdBQUcsR0FDaEM7QUFDQSxxQkFBYSxRQUFRLGVBQWUsWUFBWSxJQUFJO0FBQUEsTUFDdEQ7QUFBQSxJQUNGO0FBQ0EsUUFBSSxTQUFTO0FBQUEsTUFDWDtBQUFBLE1BQ0E7QUFBQSxNQUNBO0FBQUEsTUFDQTtBQUFBLE1BQ0E7QUFBQSxNQUNBO0FBQUEsTUFDQTtBQUFBLE1BQ0E7QUFBQSxJQUNGO0FBQ0EsUUFBSSxhQUFhLENBQUMsU0FBUyxPQUFPO0FBQ2xDLFdBQU8sUUFBUSxTQUFVLE9BQU87QUFDOUIsVUFBSSxJQUFJLGFBQWEsSUFBSSxLQUFLO0FBQzVCLHFCQUFhLFFBQVEsT0FBTyxJQUFJLGFBQWEsSUFBSSxLQUFLLENBQUM7QUFBQSxJQUMzRCxDQUFDO0FBQ0QsZUFBVyxRQUFRLFNBQVUsV0FBVztBQUN0QyxVQUFJLElBQUksYUFBYSxJQUFJLFNBQVM7QUFDaEMscUJBQWEsUUFBUSxXQUFXLElBQUksYUFBYSxJQUFJLFNBQVMsQ0FBQztBQUFBLElBQ25FLENBQUM7QUFBQSxFQUNILEdBQUc7QUFDSCxTQUFPLGlCQUFpQixTQUFTLFNBQVUsR0FBRztBQUM1QyxRQUFJLEdBQ0YsR0FDQSxPQUNBLElBQUksRUFBRSxPQUFPLFFBQVEsR0FBRztBQUMxQixTQUNFLDRCQUE0QixFQUFFLGFBQWEsTUFBTSxNQUNoRCxFQUFFLGVBQWUsR0FDakIsSUFBSSxhQUFhLFFBQVEsT0FBTyxHQUNoQyxRQUFRLGFBQWEsUUFBUSxPQUFPLEdBQ3JDLGFBQWEsUUFBUSxhQUFhLElBQzdCLElBQUksSUFBSSxJQUFJLGFBQWEsUUFBUSxhQUFhLENBQUMsS0FDOUMsSUFBSSxJQUFJLElBQUksRUFBRSxJQUFJLEdBQ3BCLEtBQUssVUFBVSxFQUFFLFdBQVcsTUFBTSxJQUFJLE1BQU0sVUFDL0MsV0FBWTtBQUNYLFVBQUksSUFBSSxJQUFJLElBQUksT0FBTyxTQUFTLElBQUk7QUFDcEMsVUFBSSxJQUFJO0FBQUEsUUFDTjtBQUFBLFFBQ0E7QUFBQSxRQUNBO0FBQUEsUUFDQTtBQUFBLFFBQ0E7QUFBQSxRQUNBO0FBQUEsUUFDQTtBQUFBLFFBQ0E7QUFBQSxRQUNBO0FBQUEsUUFDQTtBQUFBLE1BQ0Y7QUFDQSxRQUFFLFFBQVEsU0FBVUUsSUFBRztBQUNyQixVQUFFLGFBQWEsSUFBSUEsRUFBQyxLQUFLLEVBQUUsYUFBYSxJQUFJQSxJQUFHLGFBQWEsUUFBUUEsRUFBQyxDQUFDO0FBQUEsTUFDeEUsQ0FBQztBQUFBLElBQ0gsR0FBRyxHQUNGLFNBQVMsU0FBUyxPQUFPO0FBQUEsRUFDOUIsQ0FBQzsiLAogICJuYW1lcyI6IFsiX2EiLCAiX2IiLCAiZSJdCn0K
