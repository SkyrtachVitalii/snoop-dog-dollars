// // js/game.js (ES module)

// /** Асети слот-символів */
// const SYMBOLS = {
//   1: { src: "./img/mainContainer/gameImg_1_1x.webp", src2x: "./img/mainContainer/gameImg_1_2x.webp" },
//   2: { src: "./img/mainContainer/gameImg_2_1x.webp", src2x: "./img/mainContainer/gameImg_2_2x.webp" },
//   3: { src: "./img/mainContainer/gameImg_3_1x.webp", src2x: "./img/mainContainer/gameImg_3_2x.webp" },
//   4: { src: "./img/mainContainer/gameImg_4_1x.webp", src2x: "./img/mainContainer/gameImg_4_2x.webp" },
//   5: { src: "./img/mainContainer/gameImg_5_1x.webp", src2x: "./img/mainContainer/gameImg_5_2x.webp" },
//   6: { src: "./img/mainContainer/gameImg_6_1x.webp", src2x: "./img/mainContainer/gameImg_6_2x.webp" },
//   7: { src: "./img/mainContainer/gameImg_7_1x.webp", src2x: "./img/mainContainer/gameImg_7_2x.webp" },
//   8: { src: "./img/mainContainer/gameImg_8_1x.webp", src2x: "./img/mainContainer/gameImg_8_2x.webp" },
//   9: { src: "./img/mainContainer/gameImg_win_1x.webp", src2x: "./img/mainContainer/gameImg_win_2x.webp" },
// };

// /** Цільова сітка виграшу (які символи мають зайти після “перезарядки”) */
// const WIN_GRID = [
//   [6, 5, 4, 5, 4, 3, 7, 2],
//   [1, 2, 2, 5, 3, 7, 4, 4],
//   [4, 6, 8, 1, 7, 3, 3, 3],
//   [8, 3, 1, 7, 4, 8, 1, 3],
//   [2, 2, 7, 8, 6, 2, 8, 6],
//   [1, 7, 6, 8, 1, 1, 4, 2],
// ];



// async function preloadSymbols(symbols) {
//   const tasks = Object.values(symbols).flatMap(({src, src2x}) => {
//     return [src, src2x].map(url => new Promise(res => {
//       const im = new Image();
//       im.decoding = "async";
//       im.onload = im.onerror = () => res();
//       im.src = url;
//       // Safari: спробуємо ще й decode(), якщо є
//       if (im.decode) im.decode().catch(() => {});
//     }));
//   });
//   await Promise.all(tasks);
// }


// /**
//  * Публічний API гри.
//  * Всередині готує каскад <picture>, чіпляє хендлери, штовхає анімацію і шле подію "slot:bigwin".
//  */
// export async function initGame() {
//       await preloadSymbols(SYMBOLS);
//   // 1) Внутрішня підготовка анімаційного каскаду (раніше викликали з main.js)
//   preparePictureCascade();

//   // 2) Кнопка + контейнер гри
//   const btn = document.querySelector(".mainContent__btn");
//   const game = document.querySelector(".game");
//   if (!btn || !game) return;

//   // 3) Клік — один спін
//   btn.addEventListener("click", (e) => {
//     e.preventDefault();
//     if (localStorage.getItem("game-spun") === "true") return;
//     if (game.classList.contains("is-spun")) return;

//     game.classList.add("is-spun");
//     btn.setAttribute("aria-disabled", "true");
//     btn.setAttribute("disabled", "");
//     localStorage.setItem("game-spun", "true");



//     // Підкладаємо майбутні символи і стартуємо каскад
//     applyWinGrid(SYMBOLS, WIN_GRID);
//     startPictureCascade();

//     // (опціонально) якщо у верстці є .game__winSector
//     const lastDrop = game.querySelector(".game__col:nth-child(6) .game__colImg--66");
//     lastDrop?.addEventListener(
//       "animationend",
//       () => {
//         const ws = document.querySelector(".game__winSector")?.style;
//         if (ws) ws.display = "block";
//       },
//       { once: true }
//     );
//   });

//   // 4) Якщо вже крутили — одразу сигналізуємо (без залежності від popup.js)
//   if (localStorage.getItem("game-spun") === "true") {
//     btn?.setAttribute("aria-disabled", "true");
//     btn?.setAttribute("disabled", "");
//     requestAnimationFrame(() =>
//       document.dispatchEvent(new CustomEvent("slot:bigwin"))
//     );
//   }
// }

// /* ================= helpers (внутрішні) ================= */

// function applyWinGrid(symbols, winGrid) {
//   const game = document.querySelector(".game");
//   if (!game) return;

//   const cols = Array.from(game.querySelectorAll(".game__col"));
//   const C = cols.length;
//   if (!C) return;

//   const R = Math.min(...cols.map((col) => col.querySelectorAll(":scope > picture").length));
//   if (!R) return;

//   const at = (r, c) => cols[c].querySelectorAll(":scope > picture")[r];

//   for (let c = 0; c < C; c++) {
//     const colGrid = winGrid[c];
//     if (!Array.isArray(colGrid)) continue;

//     for (let r = 0; r < R; r++) {
//       const pic = at(r, c);
//       if (!pic) continue;

//       const symId = colGrid[r];
//       const sym = symbols[symId];
//       if (!sym) continue;

//       pic.setAttribute("data-next-id", String(symId));
//       pic.setAttribute("data-next-src", sym.src);
//       pic.setAttribute("data-next-srcset", `${sym.src} 1x, ${sym.src2x} 2x`);
//     }
//   }
// }

// /** Розрахунок затримок OUT/IN, мітка .final-in, data-in-end для фолбеку */
// function preparePictureCascade() {
//   const game = document.querySelector(".game");
//   if (!game) return;

//   const cols = Array.from(game.querySelectorAll(".game__col"));
//   const C = cols.length;
//   if (!C) return;

//   const R = Math.min(...cols.map((col) => col.querySelectorAll(":scope > picture").length));
//   if (!R) return;

//   const cs = getComputedStyle(game);
//   const stepOut = parseFloat(cs.getPropertyValue("--step-out")) || 0.06;
//   const stepIn  = parseFloat(cs.getPropertyValue("--step-in"))  || stepOut;
//   const dur     = parseFloat(cs.getPropertyValue("--dur"))      || 0.06;
//   const colStag = parseFloat(cs.getPropertyValue("--col-stagger")) || 0.1;

//   const at = (r, c) => cols[c].querySelectorAll(":scope > picture")[r];

//   let maxDelayIn = -1;
//   let maxPic = null;

//   for (let c = 0; c < C; c++) {
//     const colOffset = c * colStag;

//     for (let r = 0; r < R; r++) {
//       const pic = at(r, c);
//       if (!pic) continue;

//       const delayOut = colOffset + (R - 1 - r) * stepOut;
//       pic.style.setProperty("--delay-out", `${delayOut}s`);

//       const enterStart = colOffset + 2 * stepOut + dur;
//       const delayIn = enterStart + (R - 1 - r) * stepIn;
//       pic.style.setProperty("--delay-in", `${delayIn}s`);

//       if (delayIn > maxDelayIn) {
//         maxDelayIn = delayIn;
//         maxPic = pic;
//       }
//     }
//   }

//   if (maxPic) maxPic.classList.add("final-in");

//   // верх останньої колонки — маркер для слухача “останнього дропа”
//   const topLast = at(0, C - 1);
//   topLast?.classList.add("game__colImg--66");

//   // На всяк: загальний час завершення IN-каскаду (секунди)
//   if (game && maxDelayIn >= 0) {
//     const d = parseFloat(getComputedStyle(game).getPropertyValue("--dur")) || 0.06;
//     game.dataset.inEnd = String(maxDelayIn + d);
//   }
// }

// /** Запуск OUT/IN; на фіналі — анімований своп 7→9, далі шлемо "slot:bigwin" */
// function startPictureCascade() {
//   const game = document.querySelector(".game");
//   if (!game) return;

//   const pics = Array.from(game.querySelectorAll(".game__col > picture"));
//   if (!pics.length) return;

//   // 1) OUT
//   requestAnimationFrame(() => {
//     pics.forEach((p) => p.classList.add("is-leaving"));
//   });

//   // 2) На кінець OUT — підміняємо ассети й запускаємо IN
//   pics.forEach((pic) => {
//     const onOutEnd = (e) => {
//       if (e.animationName !== "game-drop-out") return;

//       const img = pic.querySelector("img");
//       const source = pic.querySelector("source");
//       const nextId = pic.getAttribute("data-next-id");
//       const nextSrc = pic.getAttribute("data-next-src");
//       const nextSrcset = pic.getAttribute("data-next-srcset");

//       if (source && nextSrcset) source.setAttribute("srcset", nextSrcset);
//       if (img && nextSrc) {
//         img.src = nextSrc;
//         img.setAttribute("srcset", `${nextSrc}`); // Safari fallback
//       }
//       if (nextId) pic.dataset.symbol = nextId;

//       pic.classList.add("is-enter-pre", "is-entering");
//       pic.classList.remove("is-leaving");
//       pic.removeEventListener("animationend", onOutEnd);
//     };
//     pic.addEventListener("animationend", onOutEnd);
//   });

//   // 3) Фінал IN — робимо своп 7→9 і сигналізуємо
//   const finalPic = game.querySelector(".final-in");
//   const runSwapThenSignal = () => {
//     swapSymbolsAfterSpinAnimated(7, 9, SYMBOLS).then(() => {
//       setTimeout(() => document.dispatchEvent(new CustomEvent("slot:bigwin")), 1000);
//     });
//   };

//   if (finalPic) {
//     const onFinalInEnd = (e) => {
//       if (e.animationName !== "game-drop-in") return;
//       finalPic.removeEventListener("animationend", onFinalInEnd);
//       runSwapThenSignal();
//     };
//     finalPic.addEventListener("animationend", onFinalInEnd);
//   } else {
//     const endSec = parseFloat(game.dataset.inEnd || "0");
//     if (endSec > 0) setTimeout(runSwapThenSignal, Math.ceil(endSec * 1000) + 30);
//   }
// }

// /** Анімований своп усіх fromId → toId; повертає Promise коли все завершилось */

// // function swapSymbolsAfterSpinAnimated(fromId, toId, symbols) {
// //   const game = document.querySelector(".game");
// //   if (!game) return Promise.resolve();

// //   const toSym = symbols[toId];
// //   if (!toSym) return Promise.resolve();

// //   // беремо тільки ті <picture>, де зараз показано fromId (наприклад, 7)
// //   const pics = Array.from(game.querySelectorAll(".game__col > picture"))
// //     .filter((pic) => pic.dataset.symbol === String(fromId));
// //   if (!pics.length) return Promise.resolve();

// //   // зчитуємо тривалість фейду з CSS-змінної, щоб не роз’їжджалося з стилями
// //   const fadeSec = parseFloat(getComputedStyle(game).getPropertyValue("--swap-fade")) || 0.5;
// //   const FADE_MS = Math.round(fadeSec * 1000);

// //   const RAISE_DELAY = 300;  // коли піднімати 9-ку над 7-кою
// //   const HIDE_DELAY  = 800;  // коли почати гасити 7-ку (щоб «бамп» встиг відіграти)

// //   const tasks = pics.map((pic) => new Promise((resolve) => {
// //     const oldImg = pic.querySelector("img");
// //     const source = pic.querySelector("source");
// //     if (!oldImg) return resolve();

// //     // 1) переводимо picture в «накладальний» режим (через CSS Grid)
// //     pic.classList.add("swap-anim");

// //     // 2) маркуємо поточну 7-ку
// //     oldImg.classList.add("swap-old");

// //     // 3) створюємо «нову» 9-ку — вона ляже в ту ж сітку, що й 7-ка
// //     const newImg = document.createElement("img");
// //     newImg.className = "game__colImg swap-new";
// //     newImg.alt = oldImg.alt || "";
// //     newImg.decoding = "async";
// //     newImg.src = toSym.src;
// //     newImg.setAttribute("srcset", `${toSym.src}`); // за бажанням можеш додати 2x
// //     pic.appendChild(newImg);

// //     // 4) спершу бампимо 7-ку (анімація swap-pulse приїде з класу is-bumping)
// //     oldImg.classList.add("is-bumping");

// //     // 5) плануємо підняття 9-ки і фейд-аут 7-ки
// //     requestAnimationFrame(() => {
// //       let raiseT, hideT;

// //       const clearTimers = () => {
// //         if (raiseT) clearTimeout(raiseT);
// //         if (hideT)  clearTimeout(hideT);
// //       };
// //       watchRemovalOnce(pic, clearTimers);

// //       // через RAISE_DELAY піднімаємо 9-ку над 7-кою (з CSS: .swap-raise > .swap-new)
// //       raiseT = setTimeout(() => {
// //         pic.classList.add("swap-raise");

// //         // ще трохи даємо побути зверху — і починаємо плавно гасити 7-ку
// //         hideT = setTimeout(() => {
// //           const onFadeEnd = () => {
// //             oldImg.removeEventListener("transitionend", onFadeEnd);

// //             // 6) остаточна підміна контенту базового <img>/<source> на 9-ку
// //             if (source) {
// //               source.setAttribute("srcset", `${toSym.src} 1x, ${toSym.src2x} 2x`);
// //             }
// //             oldImg.src = toSym.src;
// //             oldImg.setAttribute("srcset", `${toSym.src}`);

// //             // прибирання службових класів/нод
// //             oldImg.classList.remove("fade-out", "swap-old", "is-bumping");
// //             oldImg.style.opacity = "";
// //             if (newImg.parentNode) newImg.parentNode.removeChild(newImg);
// //             pic.classList.remove("swap-raise", "swap-anim");

// //             // фіксуємо, що тут тепер toId
// //             pic.dataset.symbol = String(toId);

// //             resolve();
// //           };

// //           oldImg.addEventListener("transitionend", onFadeEnd);
// //           // сам фейд-аут 7-ки (стилі є в SCSS: .swap-old.fade-out { transition: opacity ... })
// //           oldImg.classList.add("fade-out");

// //           // страховка, якщо transitionend не прилетить
// //           setTimeout(onFadeEnd, FADE_MS + 80);
// //         }, HIDE_DELAY);
// //       }, RAISE_DELAY);
// //     });
// //   }));

// //   return Promise.all(tasks);
// // }
// /** Анімований своп усіх fromId → toId; повертає Promise коли все завершилось */
// function swapSymbolsAfterSpinAnimated(fromId, toId, symbols) {
//   const game = document.querySelector(".game");
//   if (!game) return Promise.resolve();

//   const toSym = symbols[toId];
//   if (!toSym) return Promise.resolve();

//   // беремо тільки ті <picture>, де зараз показано fromId (наприклад, 7)
//   const pics = Array.from(game.querySelectorAll(".game__col > picture"))
//     .filter((pic) => pic.dataset.symbol === String(fromId));
//   if (!pics.length) return Promise.resolve();

//   // читаємо тривалість фейду з CSS-змінної, щоб не роз’їжджалося зі стилями
//   const fadeSec = parseFloat(getComputedStyle(game).getPropertyValue("--swap-fade")) || 0.5;
//   const FADE_MS = Math.round(fadeSec * 1000);

//   // невеликі паузи: даємо 7-ці “бамп” і піднімаємо 9-ку
//   const RAISE_DELAY = 300;  // коли піднімаємо 9-ку над 7-кою
//   const HIDE_DELAY  = 800;  // коли почати гасити 7-ку після “бампу”

//   const tasks = pics.map((pic) => new Promise((resolve) => {
//     const oldImg = pic.querySelector("img");
//     const source = pic.querySelector("source");
//     if (!oldImg) return resolve();

//     // 1) вмикаємо режим накладання (керуємо шарами всередині picture)
//     pic.classList.add("swap-anim");
//     oldImg.classList.add("swap-old");          // маркер для шару/фейду
//     oldImg.classList.add("is-bumping");        // пульс (swap-pulse)

//     // 2) створюємо нову “9”-ку — вона ляже в ту ж площину, по центру
//     const newImg = document.createElement("img");
//     newImg.className = "game__colImg swap-new";
//     newImg.alt = oldImg.alt || "";
//     newImg.decoding = "async";
//     newImg.src = toSym.src;
//     newImg.setAttribute("srcset", `${toSym.src}`); // за потреби: додати 2x
//     pic.appendChild(newImg);

//     // 3) гарантовано чекаємо декоду 9-ки (щоб не було миготіння)
//     const ready = newImg.decode ? newImg.decode().catch(() => {}) : Promise.resolve();

//     ready.then(() => {
//       // 4) піднімаємо 9-ку через невелику паузу — 7-ка в цей час “бампиться”
//       let raiseT, hideT;
//       const clearTimers = () => { if (raiseT) clearTimeout(raiseT); if (hideT) clearTimeout(hideT); };
//       watchRemovalOnce(pic, clearTimers);

//       requestAnimationFrame(() => {
//         raiseT = setTimeout(() => {
//           pic.classList.add("swap-raise"); // .swap-new опиняється поверх 7-ки

//           // 5) ще трохи тримаємо композицію — і гасимо 7-ку (ЛИШЕ opacity)
//           hideT = setTimeout(() => {
//             const onFadeEnd = () => {
//               oldImg.removeEventListener("transitionend", onFadeEnd);

//               // 6) остаточно міняємо контент базового <img>/<source> на 9-ку
//               if (source) {
//                 source.setAttribute("srcset", `${toSym.src} 1x, ${toSym.src2x} 2x`);
//               }
//               oldImg.src = toSym.src;
//               oldImg.setAttribute("srcset", `${toSym.src}`);

//               // прибираємо службові класи/вузли
//               oldImg.classList.remove("fade-out", "swap-old", "is-bumping");
//               oldImg.style.opacity = "";
//               if (newImg.parentNode) newImg.parentNode.removeChild(newImg);
//               pic.classList.remove("swap-raise", "swap-anim");

//               // фіксуємо, що тут тепер toId
//               pic.dataset.symbol = String(toId);

//               resolve();
//             };

//             // сам фейд-аут 7-ки (тільки opacity → нуль рефлоу!)
//             oldImg.addEventListener("transitionend", onFadeEnd);
//             oldImg.classList.add("fade-out");

//             // страховка, якщо transitionend не прилетить
//             setTimeout(onFadeEnd, FADE_MS + 80);
//           }, HIDE_DELAY);
//         }, RAISE_DELAY);
//       });
//     });
//   }));

//   return Promise.all(tasks);
// }




// /** Одноразово спостерігаємо видалення childEl із DOM і викликаємо колбек */
// function watchRemovalOnce(childEl, onRemoved) {
//   const parent = childEl.parentNode;
//   if (!parent) return;

//   const obs = new MutationObserver((mutations) => {
//     for (const m of mutations) {
//       for (const node of m.removedNodes) {
//         if (node === childEl) {
//           try { onRemoved(); }
//           finally { obs.disconnect(); }
//           return;
//         }
//       }
//     }
//   });

//   obs.observe(parent, { childList: true });
// }


// js/game.js (ES module)

/** Асети слот-символів */
const SYMBOLS = {
  1: { src: "./img/mainContainer/gameImg_1_1x.webp", src2x: "./img/mainContainer/gameImg_1_2x.webp" },
  2: { src: "./img/mainContainer/gameImg_2_1x.webp", src2x: "./img/mainContainer/gameImg_2_2x.webp" },
  3: { src: "./img/mainContainer/gameImg_3_1x.webp", src2x: "./img/mainContainer/gameImg_3_2x.webp" },
  4: { src: "./img/mainContainer/gameImg_4_1x.webp", src2x: "./img/mainContainer/gameImg_4_2x.webp" },
  5: { src: "./img/mainContainer/gameImg_5_1x.webp", src2x: "./img/mainContainer/gameImg_5_2x.webp" },
  6: { src: "./img/mainContainer/gameImg_6_1x.webp", src2x: "./img/mainContainer/gameImg_6_2x.webp" },
  7: { src: "./img/mainContainer/gameImg_7_1x.webp", src2x: "./img/mainContainer/gameImg_7_2x.webp" },
  8: { src: "./img/mainContainer/gameImg_8_1x.webp", src2x: "./img/mainContainer/gameImg_8_2x.webp" },
  9: { src: "./img/mainContainer/gameImg_win_1x.webp", src2x: "./img/mainContainer/gameImg_win_2x.webp" },
};

/** Цільова сітка виграшу (які символи мають зайти після “перезарядки”) */
const WIN_GRID = [
  [6, 5, 4, 5, 4, 3, 7, 2],
  [1, 2, 2, 5, 3, 7, 4, 4],
  [4, 6, 8, 1, 7, 3, 3, 3],
  [8, 3, 1, 7, 4, 8, 1, 3],
  [2, 2, 7, 8, 6, 2, 8, 6],
  [1, 7, 6, 8, 1, 1, 4, 2],
];

/* ================= ПУБЛІЧНИЙ API ================= */

/**
 * Ініціалізація гри.
 * Готує каскад <picture>, чіпляє хендлери, штовхає анімації і шле "slot:bigwin".
 */
export function initGame() {
  // 1) Підготовка каскаду — розставляє затримки і мітки
  preparePictureCascade();

  // 2) Елементи керування
  const btn = document.querySelector(".mainContent__btn");
  const game = document.querySelector(".game");
  if (!btn || !game) return;

  // 3) Клік — один спін
  btn.addEventListener("click", (e) => {
    e.preventDefault();
    // if (localStorage.getItem("game-spun") === "true") return;
    if (game.classList.contains("is-spun")) return;

    game.classList.add("is-spun");
    btn.setAttribute("aria-disabled", "true");
    btn.setAttribute("disabled", "");
    localStorage.setItem("game-spun", "true");

    // ВАЖЛИВО: спочатку прелоадимо всі зображення, потім — підкладаємо і запускаємо каскад
    preloadSymbols(SYMBOLS).then(() => {
      applyWinGrid(SYMBOLS, WIN_GRID);
      startPictureCascade();
    });

    // опціонально: показ win-sector на фініші останнього дропа
    const lastDrop = game.querySelector(".game__col:nth-child(6) .game__colImg--66");
    lastDrop?.addEventListener(
      "animationend",
      () => {
        const ws = document.querySelector(".game__winSector")?.style;
        if (ws) ws.display = "block";
      },
      { once: true }
    );
  });

  // 4) Якщо вже крутили — одразу сигналізуємо
  // if (localStorage.getItem("game-spun") === "true") {
  //   btn?.setAttribute("aria-disabled", "true");
  //   btn?.setAttribute("disabled", "");
  //   requestAnimationFrame(() =>
  //     document.dispatchEvent(new CustomEvent("slot:bigwin"))
  //   );
  // }
}

/* ================= helpers (внутрішні) ================= */

/** Прелоад і декодування всіх символів (Safari-safe) */
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
          if (im.decode) im.decode().catch(() => {});
        })
      );
    }
  }
  return Promise.all(tasks);
}

/** Підставляємо майбутні символи у data-атрибути під час OUT */
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

/** Розрахунок затримок OUT/IN, мітка .final-in, data-in-end для фолбеку */
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
  const stepIn  = parseFloat(cs.getPropertyValue("--step-in"))  || stepOut;
  const dur     = parseFloat(cs.getPropertyValue("--dur"))      || 0.36;
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

  // верх останньої колонки — маркер для слухача “останнього дропа”
  const topLast = at(0, C - 1);
  topLast?.classList.add("game__colImg--66");

  // загальний час завершення IN-каскаду (секунди)
  if (game && maxDelayIn >= 0) {
    game.dataset.inEnd = String(maxDelayIn + dur);
  }
}

/** Запуск OUT/IN; на фіналі — анімований своп 7→9, далі шлемо "slot:bigwin" */
function startPictureCascade() {
  const game = document.querySelector(".game");
  if (!game) return;

  const pics = Array.from(game.querySelectorAll(".game__col > picture"));
  if (!pics.length) return;

  // 1) OUT
  requestAnimationFrame(() => {
    pics.forEach((p) => p.classList.add("is-leaving"));
  });

  // 2) На кінець OUT — підміняємо ассети й запускаємо IN (з Safari-ритуалом + подвійний rAF)
  pics.forEach((pic) => {
    const onOutEnd = (e) => {
      if (e.animationName !== "game-drop-out") return;

      const img = pic.querySelector("img");
      const source = pic.querySelector("source");
      const nextId = pic.getAttribute("data-next-id");
      const nextSrc = pic.getAttribute("data-next-src");
      const nextSrcset = pic.getAttribute("data-next-srcset");

      // оновлюємо <source> (якщо є)
      if (source && nextSrcset) source.setAttribute("srcset", nextSrcset);
      // Safari-ритуал для <img>
      if (img && nextSrc) forceSwapOnImg(img, nextSrc);

      if (nextId) pic.dataset.symbol = nextId;

      // подвійний rAF — даємо браузеру зафіксувати заміну джерел перед IN
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

  // 3) Фінал IN — своп 7→9 і сигнал
  const finalPic = game.querySelector(".final-in");
  const runSwapThenSignal = () => {
    swapSymbolsAfterSpinAnimated(7, 9, SYMBOLS).then(() => {
      setTimeout(() => document.dispatchEvent(new CustomEvent("slot:bigwin")), 1000);
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
    if (endSec > 0) setTimeout(runSwapThenSignal, Math.ceil(endSec * 1000) + 30);
  }
}

/** Форсована заміна зображення в <img> (Safari-safe) */
function forceSwapOnImg(img, nextSrc) {
  // 1) скидаємо srcset, щоб не було колізій вибору джерела
  img.removeAttribute("srcset");
  // 2) ставимо новий src
  img.src = nextSrc;
  img.loading = "eager";
  img.decoding = "async";
  // 3) синхронний reflow — змушує WebKit перемалювати шар
  // eslint-disable-next-line no-unused-expressions
  img.offsetWidth;
  // 4) повертаємо простий srcset як fallback (можна розширити до 1x/2x)
  img.setAttribute("srcset", `${nextSrc}`);
}

/** Анімований своп усіх fromId → toId; повертає Promise коли все завершилось */
function swapSymbolsAfterSpinAnimated(fromId, toId, symbols) {
  const game = document.querySelector(".game");
  if (!game) return Promise.resolve();

  const toSym = symbols[toId];
  if (!toSym) return Promise.resolve();

  // беремо тільки ті <picture>, де зараз показано fromId (наприклад, 7)
  const pics = Array.from(game.querySelectorAll(".game__col > picture"))
    .filter((pic) => pic.dataset.symbol === String(fromId));
  if (!pics.length) return Promise.resolve();

  // читаємо тривалість фейду з CSS-змінної
  const fadeSec = parseFloat(getComputedStyle(game).getPropertyValue("--swap-fade")) || 0.5;
  const FADE_MS = Math.round(fadeSec * 1000);

  // невеликі паузи: даємо 7-ці “бамп” і піднімаємо 9-ку
  const RAISE_DELAY = 300;  // коли піднімаємо 9-ку над 7-кою
  const HIDE_DELAY  = 800;  // коли почати гасити 7-ку після “бампу”

  const tasks = pics.map((pic) => new Promise((resolve) => {
    const oldImg = pic.querySelector("img");
    const source = pic.querySelector("source");
    if (!oldImg) return resolve();

    // 1) ввімкнути режим накладання
    pic.classList.add("swap-anim");
    oldImg.classList.add("swap-old", "is-bumping");

    // 2) створити накладену «нову» 9-ку під 7-кою
    const newImg = document.createElement("img");
    newImg.className = "game__colImg swap-new";
    newImg.alt = oldImg.alt || "";
    newImg.decoding = "async";
    newImg.loading = "eager";
    newImg.src = toSym.src;
    newImg.setAttribute("srcset", `${toSym.src}`); // можна додати 2x за потреби
    pic.appendChild(newImg);

    // 3) чекаємо декоду 9-ки, щоб уникнути миготіння
    const ready = newImg.decode ? newImg.decode().catch(() => {}) : Promise.resolve();

    ready.then(() => {
      let raiseT, hideT;
      const clearTimers = () => { if (raiseT) clearTimeout(raiseT); if (hideT) clearTimeout(hideT); };
      watchRemovalOnce(pic, clearTimers);

      requestAnimationFrame(() => {
        raiseT = setTimeout(() => {
          pic.classList.add("swap-raise"); // 9-ка зверху

          hideT = setTimeout(() => {
            const onFadeEnd = () => {
              oldImg.removeEventListener("transitionend", onFadeEnd);

              // остаточна підміна базового <img>/<source> на 9-ку
              if (source) {
                source.setAttribute("srcset", `${toSym.src} 1x, ${toSym.src2x} 2x`);
              }
              forceSwapOnImg(oldImg, toSym.src);

              // прибирання службових класів/нод
              oldImg.classList.remove("fade-out", "swap-old", "is-bumping");
              oldImg.style.opacity = "";
              if (newImg.parentNode) newImg.parentNode.removeChild(newImg);
              pic.classList.remove("swap-raise", "swap-anim");

              // фіксуємо, що тут тепер toId
              pic.dataset.symbol = String(toId);

              resolve();
            };

            oldImg.addEventListener("transitionend", onFadeEnd);
            oldImg.classList.add("fade-out");

            // страховка, якщо transitionend не прилетить
            setTimeout(onFadeEnd, FADE_MS + 80);
          }, HIDE_DELAY);
        }, RAISE_DELAY);
      });
    });
  }));

  return Promise.all(tasks);
}

/** Одноразово спостерігаємо видалення childEl із DOM і викликаємо колбек */
function watchRemovalOnce(childEl, onRemoved) {
  const parent = childEl.parentNode;
  if (!parent) return;

  const obs = new MutationObserver((mutations) => {
    for (const m of mutations) {
      for (const node of m.removedNodes) {
        if (node === childEl) {
          try { onRemoved(); }
          finally { obs.disconnect(); }
          return;
        }
      }
    }
  });

  obs.observe(parent, { childList: true });
}
