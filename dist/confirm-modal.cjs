"use strict";
var __defProp = Object.defineProperty;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __hasOwnProp = Object.prototype.hasOwnProperty;
var __export = (target, all) => {
  for (var name in all)
    __defProp(target, name, { get: all[name], enumerable: !0 });
}, __copyProps = (to, from, except, desc) => {
  if (from && typeof from == "object" || typeof from == "function")
    for (let key of __getOwnPropNames(from))
      !__hasOwnProp.call(to, key) && key !== except && __defProp(to, key, { get: () => from[key], enumerable: !(desc = __getOwnPropDesc(from, key)) || desc.enumerable });
  return to;
};
var __toCommonJS = (mod) => __copyProps(__defProp({}, "__esModule", { value: !0 }), mod);

// src/index.ts
var index_exports = {};
__export(index_exports, {
  createModal: () => createModal,
  default: () => index_default,
  modal: () => modal,
  sanitizeHtml: () => sanitizeHtml
});
module.exports = __toCommonJS(index_exports);

// src/styles.ts
var css = '.cm-root,.cm-toasts{--cm-bg: #ffffff;--cm-fg: #1f2328;--cm-muted: #59636e;--cm-border: #d8dee4;--cm-backdrop: rgb(15 18 25 / .45);--cm-primary: #4f46e5;--cm-primary-fg: #ffffff;--cm-danger: #dc2626;--cm-danger-fg: #ffffff;--cm-neutral: #eef0f3;--cm-neutral-fg: #1f2328;--cm-success: #16a34a;--cm-error: #dc2626;--cm-warning: #d97706;--cm-info: #0284c7;--cm-question: #7c3aed;--cm-radius: 16px;--cm-btn-radius: 10px;--cm-shadow: 0 24px 48px -12px rgb(0 0 0 / .25), 0 0 0 1px rgb(0 0 0 / .04);--cm-font: system-ui, -apple-system, "Segoe UI", Roboto, sans-serif;--cm-width: 28rem;--cm-duration: .18s;--cm-ease: cubic-bezier(.2, .9, .3, 1.2);color-scheme:light}.cm-dark{--cm-bg: #1c1f26;--cm-fg: #e6e8eb;--cm-muted: #9aa3ad;--cm-border: #343944;--cm-backdrop: rgb(0 0 0 / .6);--cm-primary: #818cf8;--cm-primary-fg: #0d0f14;--cm-danger: #f87171;--cm-danger-fg: #0d0f14;--cm-neutral: #2b303a;--cm-neutral-fg: #e6e8eb;--cm-shadow: 0 24px 48px -12px rgb(0 0 0 / .6), 0 0 0 1px rgb(255 255 255 / .06);color-scheme:dark}@media(prefers-color-scheme:dark){.cm-auto{--cm-bg: #1c1f26;--cm-fg: #e6e8eb;--cm-muted: #9aa3ad;--cm-border: #343944;--cm-backdrop: rgb(0 0 0 / .6);--cm-primary: #818cf8;--cm-primary-fg: #0d0f14;--cm-danger: #f87171;--cm-danger-fg: #0d0f14;--cm-neutral: #2b303a;--cm-neutral-fg: #e6e8eb;--cm-shadow: 0 24px 48px -12px rgb(0 0 0 / .6), 0 0 0 1px rgb(255 255 255 / .06);color-scheme:dark}}.cm-root{box-sizing:border-box;width:min(var(--cm-width),calc(100vw - 2rem));max-height:calc(100dvh - 2rem);margin:auto;padding:0;border:0;border-radius:var(--cm-radius);background:var(--cm-bg);color:var(--cm-fg);font:15px/1.5 var(--cm-font);box-shadow:var(--cm-shadow);overflow:hidden;display:flex;flex-direction:column}.cm-root:not([open]){display:none}.cm-root *,.cm-root *:before,.cm-root *:after,.cm-toasts *,.cm-toasts *:before,.cm-toasts *:after{box-sizing:border-box}.cm-root::backdrop{background:var(--cm-backdrop);backdrop-filter:blur(2px)}.cm-form{display:flex;flex-direction:column;min-height:0;margin:0;padding:0;border:0}.cm-root.cm-top{margin-top:1rem}.cm-root.cm-bottom{margin-bottom:1rem}.cm-root[open]{animation:cm-in var(--cm-duration) var(--cm-ease)}.cm-root[open]::backdrop{animation:cm-fade var(--cm-duration) ease-out}.cm-root.cm-closing{animation:cm-out calc(var(--cm-duration) * .8) ease-in forwards}.cm-root.cm-closing::backdrop{animation:cm-fade calc(var(--cm-duration) * .8) ease-in reverse forwards}.cm-root.cm-shake{animation:cm-shake .32s ease-in-out}@keyframes cm-in{0%{opacity:0;transform:translateY(8px) scale(.96)}}@keyframes cm-out{to{opacity:0;transform:translateY(4px) scale(.98)}}@keyframes cm-fade{0%{opacity:0}}@keyframes cm-shake{20%,60%{transform:translate(-6px)}40%,80%{transform:translate(6px)}}.cm-body{padding:1.75rem 1.5rem 1.25rem;overflow:auto;text-align:center}.cm-close{position:absolute;top:.5rem;right:.5rem;width:2rem;height:2rem;margin:0;padding:0;min-width:0;border:0;border-radius:8px;background:transparent;color:var(--cm-muted);font-size:1.25rem;line-height:1;cursor:pointer}.cm-close:hover{background:var(--cm-neutral);color:var(--cm-fg)}.cm-icon{width:3.5rem;height:3.5rem;margin:0 auto 1rem;color:var(--cm-c)}.cm-icon svg{width:100%;height:100%;display:block}.cm-icon .cm-ring{opacity:.18}.cm-icon .cm-mark{stroke-dasharray:48;stroke-dashoffset:48;animation:cm-draw .38s .12s ease-out forwards}@keyframes cm-draw{to{stroke-dashoffset:0}}.cm-icon-success{--cm-c: var(--cm-success)}.cm-icon-error{--cm-c: var(--cm-error)}.cm-icon-warning{--cm-c: var(--cm-warning)}.cm-icon-info{--cm-c: var(--cm-info)}.cm-icon-question{--cm-c: var(--cm-question)}.cm-title{margin:0 0 .375rem;padding:0;font:inherit;font-size:1.25rem;font-weight:650;line-height:1.3;color:var(--cm-fg);text-transform:none;letter-spacing:normal;text-align:inherit;text-wrap:balance}.cm-content{margin:0;padding:0;color:var(--cm-muted);text-align:inherit;overflow-wrap:anywhere}.cm-content a{color:var(--cm-primary)}.cm-field{margin-top:1rem;text-align:left}.cm-field-label{display:block;margin-bottom:.375rem;font-size:.875rem;font-weight:550}.cm-input{display:block;width:100%;margin:0;padding:.625rem .75rem;box-shadow:none;border:1px solid var(--cm-border);border-radius:var(--cm-btn-radius);background:var(--cm-bg);color:var(--cm-fg);font:inherit}textarea.cm-input{min-height:6rem;resize:vertical}.cm-input:focus-visible{outline:2px solid var(--cm-primary);outline-offset:1px;border-color:transparent}.cm-input[aria-invalid=true]{border-color:var(--cm-error)}.cm-choices{display:grid;gap:.375rem;border:0;margin:0;padding:0}.cm-choice{display:flex;gap:.5rem;align-items:center;cursor:pointer}.cm-choice input{accent-color:var(--cm-primary);width:1rem;height:1rem;margin:0}.cm-error{margin:.5rem 0 0;font-size:.875rem;color:var(--cm-error);text-align:left}.cm-error:empty{display:none}.cm-actions{display:flex;gap:.5rem;justify-content:center;flex-wrap:wrap;padding:0 1.5rem 1.5rem}.cm-actions.cm-reverse{flex-direction:row-reverse}.cm-btn{position:relative;min-width:6rem;margin:0;padding:.625rem 1.125rem;border:0;border-radius:var(--cm-btn-radius);box-shadow:none;font:inherit;font-weight:600;line-height:1.25;text-align:center;text-transform:none;letter-spacing:normal;cursor:pointer;transition:filter .12s,transform .12s}.cm-btn:hover{filter:brightness(1.06)}.cm-btn:active{transform:translateY(1px)}.cm-btn:focus-visible{outline:2px solid var(--cm-primary);outline-offset:2px}.cm-btn:disabled{cursor:progress;opacity:.7}.cm-confirm{background:var(--cm-primary);color:var(--cm-primary-fg)}.cm-confirm.cm-danger,.cm-deny{background:var(--cm-danger);color:var(--cm-danger-fg)}.cm-cancel{background:var(--cm-neutral);color:var(--cm-neutral-fg)}.cm-loading{color:transparent!important}.cm-loading:after{content:"";position:absolute;inset:0;margin:auto;width:1.1em;height:1.1em;border:2px solid var(--cm-primary-fg);border-right-color:transparent;border-radius:50%;animation:cm-spin .7s linear infinite}@keyframes cm-spin{to{transform:rotate(1turn)}}.cm-progress{height:3px;background:var(--cm-primary);transform-origin:left;opacity:.8}.cm-progress.cm-running{animation:cm-progress var(--cm-timer) linear forwards}@keyframes cm-progress{to{transform:scaleX(0)}}.cm-toasts{position:fixed;z-index:2147483000;display:flex;flex-direction:column;gap:.5rem;margin:0;padding:0;border:0;background:transparent;overflow:visible;inset:auto;width:min(22rem,calc(100vw - 2rem));pointer-events:none;font:14px/1.45 var(--cm-font);color:var(--cm-fg)}.cm-toasts.cm-top,.cm-toasts.cm-top-start,.cm-toasts.cm-top-end{top:1rem}.cm-toasts.cm-bottom,.cm-toasts.cm-bottom-start,.cm-toasts.cm-bottom-end{bottom:1rem;flex-direction:column-reverse}.cm-toasts.cm-top,.cm-toasts.cm-bottom{left:0;right:0;margin-inline:auto}.cm-toasts.cm-top-start,.cm-toasts.cm-bottom-start{inset-inline-start:1rem}.cm-toasts.cm-top-end,.cm-toasts.cm-bottom-end{inset-inline-end:1rem}.cm-toast{pointer-events:auto;position:relative;display:flex;gap:.75rem;align-items:flex-start;padding:.875rem 1rem;border-radius:12px;overflow:hidden;background:var(--cm-bg);color:var(--cm-fg);box-shadow:var(--cm-shadow);animation:cm-in var(--cm-duration) var(--cm-ease)}.cm-toast.cm-closing{animation:cm-out calc(var(--cm-duration) * .8) ease-in forwards}.cm-toast .cm-icon{width:1.5rem;height:1.5rem;margin:0;flex:none}.cm-toast .cm-title{font-size:.9375rem;margin:0}.cm-toast-main{flex:1;min-width:0}.cm-toast .cm-close{position:static;width:1.5rem;height:1.5rem;font-size:1rem;margin:-.125rem -.375rem 0 0;flex:none}.cm-toast-action{margin-top:.375rem;padding:0;border:0;background:none;font:inherit;font-weight:600;color:var(--cm-primary);cursor:pointer}.cm-toast .cm-progress{position:absolute;left:0;right:0;bottom:0}.cm-toast:hover .cm-progress.cm-running,.cm-toast:focus-within .cm-progress.cm-running,.cm-toast.cm-paused .cm-progress.cm-running{animation-play-state:paused}@media(prefers-reduced-motion:reduce){.cm-root,.cm-root::backdrop,.cm-toast,.cm-icon .cm-mark{animation-duration:1ms!important;animation-delay:0ms!important}.cm-progress.cm-running{animation-duration:var(--cm-timer)!important}}';

// src/dom.ts
var isBrowser = typeof window < "u" && typeof document < "u";
function h(tag, attrs = {}, text) {
  let el = document.createElement(tag);
  for (let k in attrs) {
    let v = attrs[k];
    v == null || v === !1 || (k === "class" ? el.className = String(v) : el.setAttribute(k, v === !0 ? "" : String(v)));
  }
  return text !== void 0 && (el.textContent = text), el;
}
var uid = 0, nextId = (p) => `cm-${p}-${++uid}`, SVG = "http://www.w3.org/2000/svg", ICON_PATHS = {
  success: "M15 24.5l6 6 12-13",
  error: "M17 17l14 14M31 17L17 31",
  warning: "M24 14v12M24 33v.5",
  info: "M24 22v12M24 15v.5",
  question: "M19 19a5 5 0 1 1 7 4.6c-1.3.6-2 1.6-2 3V28M24 33v.5"
};
function icon(name) {
  let wrap = h("div", { class: `cm-icon cm-icon-${name}`, "aria-hidden": "true" }), svg = document.createElementNS(SVG, "svg");
  svg.setAttribute("viewBox", "0 0 48 48"), svg.setAttribute("fill", "none"), svg.setAttribute("stroke", "currentColor"), svg.setAttribute("stroke-width", "3.5"), svg.setAttribute("stroke-linecap", "round"), svg.setAttribute("stroke-linejoin", "round");
  let ring = document.createElementNS(SVG, "circle");
  ring.setAttribute("class", "cm-ring"), ring.setAttribute("cx", "24"), ring.setAttribute("cy", "24"), ring.setAttribute("r", "22"), ring.setAttribute("fill", "currentColor"), ring.setAttribute("stroke", "none");
  let mark = document.createElementNS(SVG, "path");
  return mark.setAttribute("class", "cm-mark"), mark.setAttribute("d", ICON_PATHS[name]), svg.append(ring, mark), wrap.append(svg), wrap;
}
var stylesInjected = !1;
function injectStyles(nonce) {
  if (stylesInjected || !isBrowser) return;
  stylesInjected = !0;
  try {
    if ("adoptedStyleSheets" in Document.prototype && "replaceSync" in CSSStyleSheet.prototype) {
      let sheet = new CSSStyleSheet();
      sheet.replaceSync(css), document.adoptedStyleSheets = [...document.adoptedStyleSheets, sheet];
      return;
    }
  } catch {
  }
  let style = h("style", { "data-confirm-modal": "", nonce });
  style.textContent = css, document.head.append(style);
}
var reducedMotion = () => typeof matchMedia == "function" && matchMedia("(prefers-reduced-motion: reduce)").matches;
function animateOut(el, cls = "cm-closing") {
  return new Promise((resolve) => {
    if (reducedMotion() || typeof el.getAnimations != "function") return resolve();
    el.classList.add(cls);
    let done = !1, finish = () => {
      done || (done = !0, el.removeEventListener("animationend", onEnd), resolve());
    }, onEnd = (e) => e.target === el && finish();
    el.addEventListener("animationend", onEnd), setTimeout(finish, 400);
  });
}
function themeClass(theme) {
  return theme === "dark" ? "cm-dark" : theme === "light" ? "" : "cm-auto";
}

// src/sanitize.ts
var TAGS = /* @__PURE__ */ new Set([
  "a",
  "abbr",
  "b",
  "blockquote",
  "br",
  "code",
  "del",
  "div",
  "em",
  "h1",
  "h2",
  "h3",
  "h4",
  "h5",
  "h6",
  "hr",
  "i",
  "img",
  "kbd",
  "li",
  "mark",
  "ol",
  "p",
  "pre",
  "s",
  "small",
  "span",
  "strong",
  "sub",
  "sup",
  "table",
  "tbody",
  "td",
  "th",
  "thead",
  "tr",
  "u",
  "ul"
]), DROP_WITH_CONTENT = /* @__PURE__ */ new Set([
  "script",
  "style",
  "template",
  "iframe",
  "object",
  "embed",
  "noscript",
  "svg",
  "math",
  "form",
  "textarea",
  "select",
  "button",
  "title",
  "link",
  "meta",
  "base"
]), GLOBAL_ATTRS = /* @__PURE__ */ new Set(["class", "title", "lang", "dir", "role", "id"]), TAG_ATTRS = {
  a: /* @__PURE__ */ new Set(["href", "target", "rel"]),
  img: /* @__PURE__ */ new Set(["src", "alt", "width", "height", "loading"]),
  td: /* @__PURE__ */ new Set(["colspan", "rowspan"]),
  th: /* @__PURE__ */ new Set(["colspan", "rowspan", "scope"]),
  ol: /* @__PURE__ */ new Set(["start", "reversed"])
}, SAFE_URL = /^(?:https?:|mailto:|tel:|[^:/?#]*(?:[/?#]|$))/i, SAFE_IMG = /^(?:https?:|[^:/?#]*(?:[/?#]|$)|data:image\/(?:png|gif|jpe?g|webp|avif);base64,)/i;
function isSafeUrl(url, img = !1) {
  let v = url.replace(/[\u0000- \u007f-\u009f]/g, "");
  return (img ? SAFE_IMG : SAFE_URL).test(v);
}
var policy;
function toTrusted(html) {
  if (policy === void 0) {
    let tt = globalThis.trustedTypes;
    try {
      policy = tt?.createPolicy ? tt.createPolicy("confirm-modal", { createHTML: (s) => s }) : null;
    } catch {
      policy = null;
    }
  }
  return policy ? policy.createHTML(html) : html;
}
function clean(src, doc) {
  if (src.nodeType === 3) return doc.createTextNode(src.nodeValue ?? "");
  if (src.nodeType !== 1) return null;
  let el = src, tag = el.localName;
  if (DROP_WITH_CONTENT.has(tag)) return null;
  let out = TAGS.has(tag) ? doc.createElement(tag) : doc.createDocumentFragment();
  if (out.nodeType === 1) {
    let allowed = TAG_ATTRS[tag];
    for (let { name, value } of Array.from(el.attributes)) {
      let n = name.toLowerCase();
      !GLOBAL_ATTRS.has(n) && !allowed?.has(n) || (n === "href" || n === "src") && !isSafeUrl(value, n === "src") || n === "id" && (value in doc || value in globalThis) || out.setAttribute(n, value);
    }
    tag === "a" && out.getAttribute("target") === "_blank" && out.setAttribute("rel", "noopener noreferrer");
  }
  for (let child of Array.from(el.childNodes)) {
    let c = clean(child, doc);
    c && out.appendChild(c);
  }
  return out;
}
function sanitizeHtml(html, doc = document) {
  let frag = doc.createDocumentFragment(), parsed = parse(html);
  for (let child of Array.from(parsed.body.childNodes)) {
    let c = clean(child, doc);
    c && frag.appendChild(c);
  }
  return frag;
}
function parse(html) {
  return new DOMParser().parseFromString(toTrusted(html), "text/html");
}
function toNode(content, sanitizer) {
  if (typeof content != "string") return content;
  if (!sanitizer) return sanitizeHtml(content);
  let out = sanitizer(content);
  if (typeof out != "string") return out;
  let frag = document.createDocumentFragment();
  for (let n of Array.from(parse(out).body.childNodes)) frag.appendChild(document.importNode(n, !0));
  return frag;
}

// src/toast.ts
var MAX_VISIBLE = 5, containers = /* @__PURE__ */ new Map(), supportsPopover = () => typeof HTMLElement < "u" && "showPopover" in HTMLElement.prototype;
function container(pos) {
  let el = containers.get(pos);
  return el?.isConnected || (el = h("section", {
    class: `cm-toasts cm-${pos}`,
    "aria-label": "Notifications",
    // A manual popover sits in the top layer, so toasts stay visible above an open modal.
    popover: supportsPopover() ? "manual" : void 0
  }), document.body.append(el), containers.set(pos, el)), el;
}
function show(el) {
  if (el.hasAttribute("popover"))
    try {
      el.matches(":popover-open") && el.hidePopover(), el.showPopover();
    } catch {
    }
}
function raiseToasts() {
  for (let el of containers.values()) el.isConnected && el.childElementCount && show(el);
}
function openToast(o, nonce, inject = !0) {
  if (!isBrowser) {
    let noop = Promise.resolve();
    return { close() {
    }, closed: noop, element: void 0 };
  }
  inject && injectStyles(nonce);
  let box = container(o.position ?? "top-end"), assertive = o.icon === "error" || o.icon === "warning", el = h("div", {
    class: ["cm-toast", themeClass(o.theme), o.className].filter(Boolean).join(" "),
    role: assertive ? "alert" : "status",
    "aria-atomic": "true"
  });
  o.icon && el.append(icon(o.icon));
  let main = h("div", { class: "cm-toast-main" });
  if (o.title && main.append(h("p", { class: "cm-title" }, o.title)), o.html !== void 0) {
    let c = h("div", { class: "cm-content" });
    c.append(toNode(o.html, o.sanitizer)), main.append(c);
  } else o.text && main.append(h("p", { class: "cm-content" }, o.text));
  if (o.action) {
    let { text, onClick } = o.action, a = h("button", { type: "button", class: "cm-toast-action" }, text);
    a.addEventListener("click", () => {
      onClick(), close();
    }), main.append(a);
  }
  if (el.append(main), o.showCloseButton !== !1) {
    let x = h("button", { type: "button", class: "cm-close", "aria-label": "Dismiss" }, "\xD7");
    x.addEventListener("click", () => close()), el.append(x);
  }
  let duration = o.timer ?? 4e3, timer, remaining = duration, startedAt = 0, closing = !1, resolveClosed, closed = new Promise((r) => resolveClosed = r), start = () => {
    !duration || closing || (startedAt = Date.now(), timer = setTimeout(close, remaining));
  }, pause = () => {
    !duration || timer === void 0 || (clearTimeout(timer), timer = void 0, remaining -= Date.now() - startedAt, el.classList.add("cm-paused"));
  }, resume = () => {
    timer !== void 0 || el.matches(":hover, :focus-within") || (el.classList.remove("cm-paused"), start());
  };
  async function close() {
    if (!closing) {
      if (closing = !0, clearTimeout(timer), await animateOut(el), el.remove(), !box.childElementCount)
        try {
          box.matches(":popover-open") && box.hidePopover();
        } catch {
        }
      o.onClose?.(), resolveClosed();
    }
  }
  if (duration && o.timerProgressBar !== !1) {
    let bar = h("div", { class: "cm-progress", "aria-hidden": "true" });
    bar.style.setProperty("--cm-timer", `${duration}ms`), el.append(bar), requestAnimationFrame(() => bar.classList.add("cm-running"));
  }
  o.pauseOnHover !== !1 && (el.addEventListener("mouseenter", pause), el.addEventListener("focusin", pause), el.addEventListener("mouseleave", () => setTimeout(resume)), el.addEventListener("focusout", () => setTimeout(resume))), box.append(el), show(box);
  let items = box.querySelectorAll(".cm-toast:not(.cm-closing)");
  for (let i = 0; i < items.length - MAX_VISIBLE; i++) items[i].dispatchEvent(new CustomEvent("cm:close"));
  return el.addEventListener("cm:close", () => close()), start(), { close, closed, element: el };
}

// src/core.ts
var current = null, chain = Promise.resolve(), dismissed = (reason) => ({
  isConfirmed: !1,
  isDenied: !1,
  isDismissed: !0,
  dismiss: reason
});
function openModal(o, nonce, inject = !0) {
  if (!isBrowser) return Promise.resolve(dismissed("programmatic"));
  let run = () => render(o, nonce, inject), p = chain.then(run, run);
  return chain = p.catch(() => {
  }), p;
}
function closeModal() {
  current?.dismiss("programmatic");
}
function isModalOpen() {
  return current !== null;
}
function getDialog() {
  return current?.dialog ?? null;
}
var TEXT_INPUTS = /* @__PURE__ */ new Set(["text", "email", "password", "number", "tel", "url"]);
function optionEntries(opts) {
  return opts ? Array.isArray(opts) ? opts : Object.entries(opts) : [];
}
function setAttrs(el, attrs) {
  if (attrs)
    for (let [k, v] of Object.entries(attrs))
      /^on/i.test(k) || el.setAttribute(k, v);
}
function render(o, nonce, inject = !0) {
  return o.signal?.aborted ? Promise.resolve(dismissed("abort")) : (inject && injectStyles(nonce), new Promise((resolve) => {
    let titleId = nextId("title"), contentId = nextId("content"), errorId = nextId("error"), hasInput = !!o.input, dialog = h("dialog", {
      class: ["cm-root", themeClass(o.theme), o.position && o.position !== "center" && `cm-${o.position}`, o.className].filter(Boolean).join(" "),
      role: hasInput ? void 0 : "alertdialog",
      "aria-modal": "true",
      "aria-labelledby": o.title ? titleId : void 0,
      "aria-describedby": o.text || o.html ? contentId : void 0,
      "aria-label": o.title ? void 0 : "Dialog"
    });
    o.width && dialog.style.setProperty("--cm-width", o.width);
    let form = h("form", { class: "cm-form", method: "dialog", novalidate: !0 }), body = h("div", { class: "cm-body" });
    if (form.append(body), dialog.append(form), o.showCloseButton) {
      let x = h("button", { type: "button", class: "cm-close", "aria-label": "Close" }, "\xD7");
      x.addEventListener("click", () => dismiss("close")), body.append(x);
    }
    if (o.icon && body.append(icon(o.icon)), o.title && body.append(h("h2", { class: "cm-title", id: titleId }, o.title)), o.html !== void 0) {
      let c = h("div", { class: "cm-content", id: contentId });
      c.append(toNode(o.html, o.sanitizer)), body.append(c);
    } else o.text && body.append(h("p", { class: "cm-content", id: contentId }, o.text));
    let field = null, focusTarget = null, getValue = () => !0, error = h("p", { class: "cm-error", id: errorId, "aria-live": "assertive" });
    if (o.input) {
      let inputId = nextId("input"), type = o.input;
      field = h("div", { class: "cm-field" });
      let label = o.inputLabel, describe = { "aria-describedby": errorId };
      if (TEXT_INPUTS.has(type) || type === "textarea") {
        label && field.append(h("label", { class: "cm-field-label", for: inputId }, label));
        let el = type === "textarea" ? h("textarea", { class: "cm-input", id: inputId, ...describe }) : h("input", { class: "cm-input", id: inputId, type, autocomplete: "off", ...describe });
        label || el.setAttribute("aria-label", o.title || "Input"), o.inputPlaceholder && (el.placeholder = o.inputPlaceholder), setAttrs(el, o.inputAttributes), o.inputValue !== void 0 && (el.value = String(o.inputValue)), field.append(el), focusTarget = el, getValue = () => el.value;
      } else if (type === "select") {
        label && field.append(h("label", { class: "cm-field-label", for: inputId }, label));
        let el = h("select", { class: "cm-input", id: inputId, ...describe });
        label || el.setAttribute("aria-label", o.title || "Select"), o.inputPlaceholder && el.append(h("option", { value: "", disabled: !0, selected: !0 }, o.inputPlaceholder));
        for (let [value, text] of optionEntries(o.inputOptions)) el.append(h("option", { value }, text));
        setAttrs(el, o.inputAttributes), o.inputValue !== void 0 && (el.value = String(o.inputValue)), field.append(el), focusTarget = el, getValue = () => el.value;
      } else if (type === "radio") {
        let set = h("fieldset", { class: "cm-choices", ...describe });
        set.append(h("legend", { class: "cm-field-label" }, label || o.title || ""));
        let name = inputId, radios = [];
        for (let [value, text] of optionEntries(o.inputOptions)) {
          let r = h("input", { type: "radio", name, value });
          String(o.inputValue) === value && (r.checked = !0), radios.push(r);
          let l = h("label", { class: "cm-choice" });
          l.append(r, document.createTextNode(text)), set.append(l);
        }
        field.append(set), focusTarget = radios.find((r) => r.checked) ?? radios[0] ?? null, getValue = () => radios.find((r) => r.checked)?.value ?? "";
      } else if (type === "checkbox") {
        let c = h("input", { type: "checkbox", id: inputId, ...describe });
        c.checked = !!o.inputValue, setAttrs(c, o.inputAttributes);
        let l = h("label", { class: "cm-choice" });
        l.append(c, document.createTextNode(label || o.inputPlaceholder || "")), field.append(l), focusTarget = c, getValue = () => c.checked;
      }
      body.append(field);
    }
    body.append(error);
    let actions = h("div", { class: `cm-actions${o.reverseButtons ? " cm-reverse" : ""}` }), btn = (cls, text) => h("button", { type: "button", class: `cm-btn ${cls}` }, text), cancelBtn = o.showCancel ? btn("cm-cancel", o.cancelText ?? "Cancel") : null, denyBtn = o.showDeny ? btn("cm-deny", o.denyText ?? "No") : null, confirmBtn = o.showConfirm !== !1 ? btn(`cm-confirm${o.danger ? " cm-danger" : ""}`, o.confirmText ?? "OK") : null;
    confirmBtn && (confirmBtn.type = "submit");
    for (let b of [cancelBtn, denyBtn, confirmBtn]) b && actions.append(b);
    actions.childElementCount && form.append(actions);
    let timer;
    if (o.timer && o.timerProgressBar) {
      let bar = h("div", { class: "cm-progress", "aria-hidden": "true" });
      bar.style.setProperty("--cm-timer", `${o.timer}ms`), dialog.append(bar), requestAnimationFrame(() => bar.classList.add("cm-running"));
    }
    let opener = document.activeElement, root = document.documentElement, prevOverflow = root.style.overflow, settled = !1, busy = !1, finish = async (result) => {
      if (!settled) {
        settled = !0, clearTimeout(timer), o.signal?.removeEventListener("abort", onAbort), current?.dialog === dialog && (current = null), await animateOut(dialog), dialog.open && dialog.close(), dialog.remove(), root.style.overflow = prevOverflow, opener && opener.isConnected && typeof opener.focus == "function" && opener.focus({ preventScroll: !0 });
        try {
          o.onClose?.(result);
        } finally {
          resolve(result);
        }
      }
    }, dismiss = (reason) => {
      busy && reason !== "abort" && reason !== "programmatic" || finish(dismissed(reason));
    }, onAbort = () => dismiss("abort"), showError = (msg) => {
      error.textContent = msg, focusTarget?.setAttribute("aria-invalid", "true"), dialog.classList.remove("cm-shake"), dialog.offsetWidth, dialog.classList.add("cm-shake"), focusTarget?.focus();
    }, setBusy = (on) => {
      busy = on;
      for (let b of [cancelBtn, denyBtn, confirmBtn]) b && (b.disabled = on);
      confirmBtn?.classList.toggle("cm-loading", on), confirmBtn?.setAttribute("aria-busy", String(on));
    }, confirm = async () => {
      if (busy || settled) return;
      let raw = getValue(), value = hasInput ? raw : !0;
      error.textContent = "", focusTarget?.removeAttribute("aria-invalid"), setBusy(!0);
      try {
        if (o.validate) {
          let msg = await o.validate(raw);
          if (msg)
            return setBusy(!1), showError(msg);
        }
        if (o.preConfirm) {
          let out = await o.preConfirm(value);
          if (out === !1) {
            setBusy(!1);
            return;
          }
          out !== void 0 && (value = out);
        }
      } catch (e) {
        return setBusy(!1), showError(e instanceof Error ? e.message : String(e));
      }
      busy = !1, finish({ isConfirmed: !0, isDenied: !1, isDismissed: !1, value });
    };
    form.addEventListener("submit", (e) => {
      e.preventDefault(), confirm();
    }), cancelBtn?.addEventListener("click", () => dismiss("cancel")), denyBtn?.addEventListener("click", () => {
      busy || finish({ isConfirmed: !1, isDenied: !0, isDismissed: !1, value: !1 });
    }), dialog.addEventListener("cancel", (e) => {
      e.preventDefault(), o.closeOnEsc !== !1 && dismiss("esc");
    }), dialog.addEventListener("close", () => {
      settled || finish(dismissed("esc"));
    });
    let downOnBackdrop = !1;
    if (dialog.addEventListener("pointerdown", (e) => {
      downOnBackdrop = e.target === dialog;
    }), dialog.addEventListener("click", (e) => {
      e.target === dialog && downOnBackdrop && o.closeOnBackdrop !== !1 && dismiss("backdrop"), downOnBackdrop = !1;
    }), o.signal?.addEventListener("abort", onAbort, { once: !0 }), o.timer && (timer = setTimeout(() => dismiss("timer"), o.timer)), (o.target ?? document.body).append(dialog), root.style.overflow = "hidden", typeof dialog.showModal == "function")
      try {
        dialog.showModal();
      } catch {
        dialog.setAttribute("open", "");
      }
    else
      dialog.setAttribute("open", "");
    current = { dialog, dismiss }, raiseToasts();
    let pick = o.focus === "none" ? null : o.focus === "cancel" ? cancelBtn : o.focus === "deny" ? denyBtn : o.focus === "confirm" ? confirmBtn : o.focus === "input" ? focusTarget : (
      // Destructive actions default to the safe choice.
      focusTarget ?? (o.danger && cancelBtn ? cancelBtn : confirmBtn ?? cancelBtn)
    );
    pick ? (pick.focus(), pick instanceof HTMLInputElement && TEXT_INPUTS.has(o.input) && pick.select?.()) : dialog.focus(), o.onOpen?.(dialog);
  }));
}

// src/bind.ts
var SELECTOR = "[data-cm-confirm]";
function bindConfirm(api, root = document) {
  if (!isBrowser) return () => {
  };
  let approved = /* @__PURE__ */ new WeakSet(), ask = (el) => {
    let d = el.dataset, message = d.cmConfirm || "";
    return api.confirm({
      title: d.cmTitle || message,
      text: d.cmTitle ? message : void 0,
      confirmText: d.cmConfirmText,
      cancelText: d.cmCancelText,
      danger: "cmDanger" in d,
      icon: d.cmIcon || ("cmDanger" in d ? "warning" : void 0)
    });
  }, onClick = async (e) => {
    let el = e.target?.closest?.(SELECTOR);
    if (!(!el || el instanceof HTMLFormElement || !root.contains(el))) {
      if (approved.has(el)) {
        approved.delete(el);
        return;
      }
      e.preventDefault(), e.stopImmediatePropagation(), await ask(el) && (approved.add(el), el.click());
    }
  }, onSubmit = async (e) => {
    let form = e.target;
    if (!(form instanceof HTMLFormElement) || !form.matches(SELECTOR)) return;
    if (approved.has(form)) {
      approved.delete(form);
      return;
    }
    e.preventDefault(), e.stopImmediatePropagation();
    let submitter = e.submitter;
    await ask(form) && (approved.add(form), form.requestSubmit(submitter ?? void 0));
  };
  return root.addEventListener("click", onClick, !0), root.addEventListener("submit", onSubmit, !0), () => {
    root.removeEventListener("click", onClick, !0), root.removeEventListener("submit", onSubmit, !0);
  };
}

// src/index.ts
var asOptions = (o, text) => typeof o == "string" ? { title: o, text } : o;
function createModal(defaults = {}) {
  let { toast: toastDefaults, styleNonce, injectStyles: injectStyles2 = !0, ...modalDefaults } = defaults, fire = (o) => openModal({ ...modalDefaults, ...o }, styleNonce, injectStyles2), shortcut = (icon2) => (title, text) => fire({ title, text, icon: icon2 }).then(() => {
  }), api = {
    fire(o, text, icon2) {
      return fire(typeof o == "string" ? { title: o, text, icon: icon2 } : o);
    },
    confirm: (o, text) => fire({ showCancel: !0, ...asOptions(o, text) }).then((r) => r.isConfirmed),
    alert: (o, text) => fire({ showCancel: !1, ...asOptions(o, text) }).then(() => {
    }),
    prompt: (o, defaultValue) => fire({ input: "text", showCancel: !0, inputValue: defaultValue, ...asOptions(o) }).then(
      (r) => r.isConfirmed ? String(r.value ?? "") : null
    ),
    success: shortcut("success"),
    error: shortcut("error"),
    warning: shortcut("warning"),
    info: shortcut("info"),
    toast: (o) => openToast(
      { theme: modalDefaults.theme, ...toastDefaults, ...typeof o == "string" ? { title: o } : o },
      styleNonce,
      injectStyles2
    ),
    close: closeModal,
    isOpen: isModalOpen,
    getDialog,
    create: (more) => createModal({ ...defaults, ...more, toast: { ...toastDefaults, ...more.toast } }),
    bind: (root) => bindConfirm(api, root),
    defaults: Object.freeze({ ...defaults })
  };
  return api;
}
var modal = createModal(), index_default = modal;
