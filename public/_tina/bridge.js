let configuredAdminOrigins = [];
function setAdminOrigin(origin) {
  configuredAdminOrigins = Array.isArray(origin) ? [...origin] : [origin];
}
function getAdminOrigin() {
  return configuredAdminOrigins[0] ?? "";
}
function isFromAdmin(event) {
  if (typeof window === "undefined")
    return false;
  if (!configuredAdminOrigins.includes(event.origin))
    return false;
  return event.source === window.parent;
}
const ENABLED = typeof window !== "undefined";
function debug(...args) {
  if (!ENABLED)
    return;
  console.log("[@tinacms/bridge]", ...args);
}
const QUICK_EDIT_CSS = `
  [data-tina-field] {
    outline: 2px dashed rgba(34,150,254,0.5);
    transition: box-shadow ease-out 150ms;
  }
  [data-tina-field]:hover {
    box-shadow: inset 100vi 100vh rgba(34,150,254,0.3);
    outline: 2px solid rgba(34,150,254,1);
    cursor: pointer;
  }
  [data-tina-field-overlay] {
    outline: 2px dashed rgba(34,150,254,0.5);
    position: relative;
  }
  [data-tina-field-overlay]:hover {
    cursor: pointer;
    outline: 2px solid rgba(34,150,254,1);
  }
  [data-tina-field-overlay]::after {
    content: '';
    position: absolute;
    inset: 0;
    z-index: 20;
    transition: opacity ease-out 150ms;
    background-color: rgba(34,150,254,0.3);
    opacity: 0;
  }
  [data-tina-field-overlay]:hover::after {
    opacity: 1;
  }
`;
const QUICK_EDIT_BODY_CLASS = "__tina-quick-editing-enabled";
const QUICK_EDIT_STYLE_ID = "__tina-bridge-quick-edit-style";
function initClickToFocus() {
  let enabled = false;
  document.addEventListener(
    "click",
    (event) => {
      const target = event.target;
      const tagName = target instanceof Element ? target.tagName : "?";
      if (!enabled) {
        debug("click ignored — quickEdit disabled", tagName);
        return;
      }
      const fieldName = resolveFieldName(target);
      if (!fieldName) {
        debug("click ignored — no data-tina-field ancestor for", tagName);
        return;
      }
      debug("click captured →", fieldName, "(target:", tagName, ")");
      event.preventDefault();
      event.stopPropagation();
      window.parent.postMessage(
        { type: "field:selected", fieldName },
        getAdminOrigin()
      );
    },
    true
  );
  window.addEventListener("message", (event) => {
    if (!isFromAdmin(event))
      return;
    const message = event.data;
    if (!message || message.type !== "quickEditEnabled")
      return;
    enabled = !!message.value;
    if (enabled)
      installStyle();
    else
      removeStyle();
  });
}
function resolveFieldName(target) {
  const el = target instanceof Element ? target : null;
  if (!el)
    return null;
  const direct = readTinaField(el);
  if (direct)
    return direct;
  const ancestor = el.closest("[data-tina-field], [data-tina-field-overlay]");
  if (!ancestor)
    return null;
  return readTinaField(ancestor);
}
function readTinaField(el) {
  for (const name of el.getAttributeNames()) {
    if (name.startsWith("data-tina-field")) {
      const value = el.getAttribute(name);
      if (value)
        return value;
    }
  }
  return null;
}
function installStyle() {
  if (document.getElementById(QUICK_EDIT_STYLE_ID))
    return;
  const style = document.createElement("style");
  style.id = QUICK_EDIT_STYLE_ID;
  style.textContent = QUICK_EDIT_CSS;
  document.head.appendChild(style);
  document.body.classList.add(QUICK_EDIT_BODY_CLASS);
}
function removeStyle() {
  var _a;
  (_a = document.getElementById(QUICK_EDIT_STYLE_ID)) == null ? void 0 : _a.remove();
  document.body.classList.remove(QUICK_EDIT_BODY_CLASS);
}
function initDataStore() {
  const data = /* @__PURE__ */ new Map();
  const updated = /* @__PURE__ */ new Set();
  const listeners = /* @__PURE__ */ new Set();
  return {
    get: (id) => data.get(id),
    seed(id, next) {
      data.set(id, next);
    },
    set(id, next) {
      const firstUpdate = !updated.has(id);
      updated.add(id);
      data.set(id, next);
      for (const listener of listeners)
        listener({ id, firstUpdate });
    },
    ids: () => Array.from(data.keys()),
    subscribe(listener) {
      listeners.add(listener);
      return () => listeners.delete(listener);
    }
  };
}
const FORM_SELECTOR = "[data-tina-form]";
const FORM_ATTR = "data-tina-form";
const RETRY_INTERVAL_MS = 250;
const MAX_ATTEMPTS = 40;
let controller = null;
function initForms(store) {
  if (controller) {
    debug("initForms called twice; ignoring");
    return;
  }
  controller = {
    store,
    active: /* @__PURE__ */ new Map(),
    acknowledged: /* @__PURE__ */ new Set(),
    retryTimer: null,
    attempts: 0
  };
  window.addEventListener("message", onAck);
  window.addEventListener("beforeunload", onBeforeUnload);
  refreshForms();
}
function refreshForms() {
  if (!controller) {
    debug("refreshForms called before initForms; ignoring");
    return;
  }
  const next = readPayloads();
  const nextIds = new Set(next.map((p) => p.id));
  for (const [id] of controller.active) {
    if (nextIds.has(id))
      continue;
    debug("posting close for", id);
    window.parent.postMessage({ type: "close", id }, getAdminOrigin());
    controller.acknowledged.delete(id);
  }
  for (const payload of next) {
    controller.store.seed(payload.id, payload.data ?? {});
  }
  controller.active = new Map(next.map((p) => [p.id, p]));
  if (next.some((p) => !controller.acknowledged.has(p.id))) {
    startAnnounceLoop();
  }
  reportQuickEdit();
}
function readPayloads() {
  const elements = document.querySelectorAll(FORM_SELECTOR);
  const payloads = [];
  for (const el of elements) {
    const raw = el.getAttribute(FORM_ATTR);
    if (!raw)
      continue;
    try {
      const payload = JSON.parse(raw);
      if (!payload.id || !payload.query)
        continue;
      payloads.push(payload);
    } catch (error) {
      debug("failed to parse form payload", error);
    }
  }
  debug("discovered", payloads.length, "form(s)");
  return payloads;
}
function onAck(event) {
  if (!isFromAdmin(event))
    return;
  const msg = event.data;
  if (!msg || typeof msg !== "object")
    return;
  if (msg.type !== "updateData" || typeof msg.id !== "string")
    return;
  if (!controller)
    return;
  if (!controller.acknowledged.has(msg.id)) {
    debug("admin acked form", msg.id);
    controller.acknowledged.add(msg.id);
  }
}
function onBeforeUnload() {
  if (!controller)
    return;
  for (const [id] of controller.active) {
    window.parent.postMessage({ type: "close", id }, getAdminOrigin());
  }
}
function startAnnounceLoop() {
  if (!controller)
    return;
  if (controller.retryTimer) {
    clearTimeout(controller.retryTimer);
    controller.retryTimer = null;
  }
  controller.attempts = 0;
  announce();
}
function announce() {
  if (!controller)
    return;
  controller.attempts++;
  const pending = [];
  for (const [id, payload] of controller.active) {
    if (!controller.acknowledged.has(id))
      pending.push(payload);
  }
  if (pending.length === 0) {
    debug("all forms acked after", controller.attempts, "attempt(s)");
    controller.retryTimer = null;
    return;
  }
  if (controller.attempts > MAX_ATTEMPTS) {
    debug(
      "giving up after",
      MAX_ATTEMPTS,
      "attempts; pending ids:",
      pending.map((p) => p.id)
    );
    controller.retryTimer = null;
    return;
  }
  for (const payload of pending) {
    debug("posting open for", payload.id, "attempt", controller.attempts);
    window.parent.postMessage(
      {
        type: "open",
        id: payload.id,
        query: payload.query,
        variables: payload.variables,
        data: payload.data
      },
      getAdminOrigin()
    );
  }
  controller.retryTimer = setTimeout(announce, RETRY_INTERVAL_MS);
}
function reportQuickEdit() {
  const hasMarkers = !!document.querySelector("[data-tina-field]");
  window.parent.postMessage(
    { type: "quick-edit", value: hasMarkers },
    getAdminOrigin()
  );
}
const PREVIEW_CONTENT_TYPE = "application/x-tina-preview+json";
const ISLAND_SELECTOR = "[data-tina-island]";
const ENDPOINT_ATTR = "data-tina-island";
function initIslandRefresh(store, options) {
  let pendingRefresh = null;
  const refreshAll = () => {
    const islands = document.querySelectorAll(ISLAND_SELECTOR);
    for (const island of islands) {
      void refreshIsland(island, store);
    }
  };
  store.subscribe(({ firstUpdate }) => {
    if (pendingRefresh) {
      clearTimeout(pendingRefresh);
      pendingRefresh = null;
    }
    if (firstUpdate) {
      refreshAll();
      return;
    }
    pendingRefresh = setTimeout(() => {
      pendingRefresh = null;
      refreshAll();
    }, options.debounceMs);
  });
  window.addEventListener("message", (event) => {
    if (!isFromAdmin(event))
      return;
    const message = event.data;
    if (!message || typeof message !== "object")
      return;
    if (message.type === "updateData" && typeof message.id === "string") {
      debug("updateData received for", message.id);
      store.set(message.id, message.data ?? {});
    }
  });
}
async function refreshIsland(island, store) {
  const endpoint = island.getAttribute(ENDPOINT_ATTR);
  if (!endpoint)
    return;
  const overlay = {};
  for (const id of store.ids()) {
    const data = store.get(id);
    if (data)
      overlay[id] = data;
  }
  try {
    debug("refreshing island", endpoint);
    const response = await fetch(endpoint, {
      method: "POST",
      headers: { "Content-Type": PREVIEW_CONTENT_TYPE },
      body: JSON.stringify(overlay),
      cache: "no-store",
      credentials: "same-origin"
    });
    if (!response.ok) {
      debug("island refetch failed", endpoint, response.status);
      return;
    }
    const html = await response.text();
    swapIslandHtml(island, html);
    reportQuickEdit();
  } catch (error) {
    debug("island refetch error", endpoint, error);
  }
}
function swapIslandHtml(island, html) {
  const template = document.createElement("template");
  template.innerHTML = html.trim();
  const fragment = template.content;
  const replacement = fragment.firstElementChild;
  if (replacement) {
    for (const attr of Array.from(island.attributes)) {
      if (attr.name === ENDPOINT_ATTR)
        continue;
      island.removeAttribute(attr.name);
    }
    for (const attr of Array.from(replacement.attributes)) {
      island.setAttribute(attr.name, attr.value);
    }
    island.innerHTML = replacement.innerHTML;
  } else {
    island.innerHTML = html;
  }
}
const tinaField = (object, property, index) => {
  const contentSource = object == null ? void 0 : object._content_source;
  if (!contentSource) {
    return "";
  }
  const { queryId, path } = contentSource;
  if (!property) {
    return `${queryId}---${path.join(".")}`;
  }
  const fullPath = typeof index === "number" ? [...path, property, index] : [...path, property];
  return `${queryId}---${fullPath.join(".")}`;
};
let initialized = false;
function init(options = {}) {
  if (initialized)
    return;
  initialized = true;
  if (typeof window === "undefined" || window.parent === window) {
    debug("not in an iframe; bridge is a no-op");
    return;
  }
  debug("initialising in iframe");
  const { debounceMs = 300, adminOrigin = window.location.origin } = options;
  setAdminOrigin(adminOrigin);
  const store = initDataStore();
  initIslandRefresh(store, { debounceMs });
  initClickToFocus();
  initForms(store);
}
export {
  init,
  refreshForms,
  tinaField
};
