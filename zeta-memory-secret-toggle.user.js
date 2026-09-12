// ==UserScript==
// @name         Zeta 장기기억 비밀값 표시 토글
// @namespace    https://zeta-ai.io/
// @version      1.0.0
// @description  Zeta 외장 장기기억 설정의 OpenRouter API 키와 GitHub 토큰에 보기/숨기기 버튼을 추가합니다.
// @author       local
// @match        https://zeta-ai.io/*
// @run-at       document-idle
// @grant        none
// @updateURL    https://raw.githubusercontent.com/e4493089-cmyk/zeta-memory-userscript/main/zeta-memory-secret-toggle.user.js
// @downloadURL  https://raw.githubusercontent.com/e4493089-cmyk/zeta-memory-userscript/main/zeta-memory-secret-toggle.user.js
// ==/UserScript==

(() => {
  "use strict";

  if (globalThis.__zetaMemorySecretToggleInstalled) return;
  globalThis.__zetaMemorySecretToggleInstalled = true;

  const TARGETS = [
    ["zlm-gh-token", "GitHub 토큰"],
    ["zlm-or-key", "OpenRouter API 키"]
  ];

  const ensureStyle = () => {
    if (document.getElementById("zlm-secret-toggle-style")) return;
    const style = document.createElement("style");
    style.id = "zlm-secret-toggle-style";
    style.textContent = `
      .zlm-secret-toggle-wrap{display:flex;gap:6px;align-items:stretch;width:100%}
      .zlm-secret-toggle-wrap>input{flex:1 1 auto;min-width:0}
      .zlm-secret-toggle-eye{flex:0 0 42px;border:1px solid #d7d9e4;border-radius:9px;background:#fff;color:#505164;font:700 16px system-ui;cursor:pointer}
      .zlm-secret-toggle-eye:hover{background:#f4f3ff}
    `;
    document.head?.append(style);
  };

  const installFor = (id, label) => {
    const input = document.getElementById(id);
    if (!input || input.dataset.zlmSecretToggle === "1") return;
    input.dataset.zlmSecretToggle = "1";
    input.type = "password";

    const wrap = document.createElement("div");
    wrap.className = "zlm-secret-toggle-wrap";
    input.parentNode.insertBefore(wrap, input);
    wrap.append(input);

    const button = document.createElement("button");
    button.type = "button";
    button.className = "zlm-secret-toggle-eye";
    button.textContent = "👁";
    button.title = `${label} 보기`;
    button.setAttribute("aria-label", `${label} 보기`);
    button.addEventListener("click", () => {
      const reveal = input.type === "password";
      input.type = reveal ? "text" : "password";
      button.textContent = reveal ? "🙈" : "👁";
      button.title = reveal ? `${label} 숨기기` : `${label} 보기`;
      button.setAttribute("aria-label", button.title);
      if (reveal) input.focus({ preventScroll: true });
    });
    wrap.append(button);
  };

  const install = () => {
    ensureStyle();
    for (const [id, label] of TARGETS) installFor(id, label);
  };

  install();
  new MutationObserver(install).observe(document.documentElement, { childList: true, subtree: true });
})();
