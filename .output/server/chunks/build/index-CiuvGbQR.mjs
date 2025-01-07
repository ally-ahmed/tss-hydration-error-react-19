import { jsxs } from 'react/jsx-runtime';
import { e as eventHandler, b as bt, i as it, B as Bt, p as pr, T as Tt, _ as _e, h as hr, a as ae } from '../nitro/nitro.mjs';
import { defaultTransformer, isPlainObject, isRedirect, isNotFound, useRouter, encode } from '@tanstack/react-router';
import * as p from 'node:fs';
import 'node:http';
import 'node:https';
import 'node:zlib';
import 'node:stream';
import 'node:buffer';
import 'node:util';
import 'node:url';
import 'node:net';
import 'node:path';
import 'vinxi/lib/invariant';
import 'vinxi/lib/path';
import 'node:async_hooks';
import 'react';
import 'react-dom/server';

const G = [];
function g(e, n) {
  const t = n || e || {};
  return typeof t.method > "u" && (t.method = "GET"), { options: t, middleware: (r) => g(undefined, Object.assign(t, { middleware: r })), validator: (r) => g(undefined, Object.assign(t, { validator: r })), handler: (...r) => {
    const [a, i] = r;
    Object.assign(t, { ...a, extractedFn: a, serverFn: i }), it(a.url);
    const s = [...t.middleware || [], V(t)];
    return Object.assign(async (c) => j(s, "client", { ...a, method: t.method, data: c == null ? undefined : c.data, headers: c == null ? undefined : c.headers, context: {} }).then((o) => {
      if (o.error) throw o.error;
      return o.result;
    }), { ...a, __executeServer: async (c) => {
      const o = c instanceof FormData ? L(c) : c;
      return await j(s, "server", { ...a, ...o }).then((d) => ({ result: d.result, error: d.error, context: d.sendContext }));
    } });
  } };
}
function L(e) {
  const n = e.get("__TSR_CONTEXT");
  if (e.delete("__TSR_CONTEXT"), typeof n != "string") return { context: {}, data: e };
  try {
    return { context: defaultTransformer.parse(n), data: e };
  } catch {
    return { data: e };
  }
}
function B(e) {
  const n = /* @__PURE__ */ new Set(), t = [], r = (a) => {
    a.forEach((i) => {
      i.options.middleware && r(i.options.middleware), n.has(i) || (n.add(i), t.push(i));
    });
  };
  return r(e), t;
}
const R = async (e, n, t) => e({ ...n, next: async (r = {}) => {
  var _a, _b;
  return t({ ...n, ...r, context: { ...n.context, ...r.context }, sendContext: { ...n.sendContext, ...(_a = r.sendContext) != null ? _a : {} }, headers: ae(n.headers, r.headers), result: r.result !== undefined ? r.result : n.result, error: (_b = r.error) != null ? _b : n.error });
} });
function X(e, n) {
  if (e == null) return {};
  if ("~standard" in e) {
    const t = e["~standard"].validate(n);
    if (t instanceof Promise) throw new Error("Async validation not supported");
    if (t.issues) throw new Error(JSON.stringify(t.issues, undefined, 2));
    return t.value;
  }
  if ("parse" in e) return e.parse(n);
  if (typeof e == "function") return e(n);
  throw new Error("Invalid validator type!");
}
async function j(e, n, t) {
  const r = B([...G, ...e]), a = async (i) => {
    const s = r.shift();
    if (!s) return i;
    s.options.validator && (n !== "client" || s.options.validateClient) && (i.data = await X(s.options.validator, i.data));
    const c = n === "client" ? s.options.client : s.options.server;
    return c ? R(c, i, async (o) => {
      const p = s.options.clientAfter;
      if (n === "client" && p) {
        const d = await a(o);
        return R(p, { ...o, ...d }, (u) => u);
      }
      return a(o).catch((d) => {
        if (isRedirect(d) || isNotFound(d)) return { ...o, error: d };
        throw d;
      });
    }) : a(i);
  };
  return a({ ...t, headers: t.headers || {}, sendContext: t.sendContext || {}, context: t.context || {} });
}
function V(e) {
  return { _types: undefined, options: { validator: e.validator, validateClient: e.validateClient, client: async ({ next: n, sendContext: t, ...r }) => {
    var a;
    const i = await ((a = e.extractedFn) == null ? undefined : a.call(e, { ...r, context: t }));
    return n(i);
  }, server: async ({ next: n, ...t }) => {
    var r;
    const a = await ((r = e.serverFn) == null ? undefined : r.call(e, t));
    return n({ ...t, result: a });
  } } };
}
async function W(e, n, t) {
  var r;
  const a = n[0];
  if (isPlainObject(a) && a.method) {
    const o = a, p = o.data instanceof FormData ? "formData" : "payload", d = new Headers({ ...p === "payload" ? { "content-type": "application/json", accept: "application/json" } : {}, ...o.headers instanceof Headers ? Object.fromEntries(o.headers.entries()) : o.headers || {} });
    if (o.method === "GET") {
      const h = encode({ payload: defaultTransformer.stringify({ data: o.data, context: o.context }) });
      h && (e += `&${h}`);
    }
    const u = new Request(e, { method: o.method, headers: d, ...K(o) }), l = await t(u), y = await x(l);
    if ((r = y.headers.get("content-type")) != null && r.includes("application/json")) {
      const h = defaultTransformer.decode(await y.json());
      if (isRedirect(h) || isNotFound(h) || h instanceof Error) throw h;
      return h;
    }
    return y;
  }
  const i = new Request(e, { method: "POST", headers: { Accept: "application/json", "Content-Type": "application/json" }, body: JSON.stringify(n) }), s = await x(await t(i)), c = s.headers.get("content-type");
  return c && c.includes("application/json") ? defaultTransformer.decode(await s.json()) : s.text();
}
function K(e) {
  var _a;
  return e.method === "POST" ? e.data instanceof FormData ? (e.data.set("__TSR_CONTEXT", defaultTransformer.stringify(e.context)), { body: e.data }) : { body: defaultTransformer.stringify({ data: (_a = e.data) != null ? _a : null, context: e.context }) } : {};
}
async function x(e) {
  if (!e.ok) {
    const n = e.headers.get("content-type");
    throw n && n.includes("application/json") ? defaultTransformer.decode(await e.json()) : new Error(await e.text());
  }
  return e;
}
function Q(e) {
  return e.replace(/^\/|\/$/g, "");
}
function Y(e, n, t) {
  return `${e}/${Q("/_server")}/?_serverFnId=${encodeURI(n)}&_serverFnName=${encodeURI(t)}`;
}
eventHandler(Z);
async function Z(e) {
  return E(bt(e));
}
async function E(e, n) {
  var t, r;
  const a = e.method, i = new URL(e.url, "http://localhost:3000"), s = Object.fromEntries(i.searchParams.entries()), c = s._serverFnId, o = s._serverFnName;
  if (!c || !o) throw new Error("Invalid request");
  it(typeof c == "string");
  const p = (r = await ((t = Bt("server").chunks[c]) == null ? undefined : t.import())) == null ? undefined : r[o], d = await (async () => {
    try {
      const u = await (async () => {
        var y;
        if ((y = e.headers.get("Content-Type")) != null && y.includes("multipart/form-data")) return it(a.toLowerCase() !== "get", "GET requests with FormData payloads are not supported"), await e.formData();
        if (a.toLowerCase() === "get") return s.payload ? defaultTransformer.parse(s.payload) : void 0;
        const h = await e.text();
        return defaultTransformer.parse(h);
      })(), l = await p(u);
      return l instanceof Response ? l : isPlainObject(l) && "result" in l && l.result instanceof Response ? l.result : isRedirect(l) || isNotFound(l) ? F(l) : new Response(l !== void 0 ? defaultTransformer.stringify(l) : void 0, { status: pr(Tt()), headers: { "Content-Type": "application/json" } });
    } catch (u) {
      return u instanceof Response ? u : isPlainObject(u) && "result" in u && u.result instanceof Response ? u.result : isRedirect(u) || isNotFound(u) ? F(u) : (console.error("Server Fn Error!"), console.error(u), console.info(), new Response(defaultTransformer.stringify(u), { status: 500, headers: { "Content-Type": "application/json" } }));
    }
  })();
  if (d.headers.get("Content-Type") === "application/json") {
    const l = await d.clone().text();
    l && JSON.stringify(JSON.parse(l));
  }
  return d;
}
function F(e) {
  const { headers: n, ...t } = e;
  return new Response(JSON.stringify(t), { status: 200, headers: { "Content-Type": "application/json", ...n || {} } });
}
const T = "http://localhost:3000";
function C(e, n, t) {
  const r = Y(T, n, t);
  return Object.assign((...i) => (it(i.length === 1), W(r, i, async (s) => {
    const c = Tt(), o = hr(c);
    return Object.entries(o).forEach(([p, d]) => {
      s.headers.has(p) || s.headers.append(p, d);
    }), E(s);
  })), { url: r.replace(T, ""), filename: n, functionId: t });
}
const b = "count.txt";
async function $() {
  return parseInt(await p.promises.readFile(b, "utf-8").catch(() => "0"));
}
const N = g({ method: "GET" }).handler(C(ee, "c_gpfkzj", "$$function0"), () => $()), I = g({ method: "POST" }).validator((e) => e).handler(C(te, "c_gpfkzj", "$$function1"), async ({ data: e }) => {
  const n = await $();
  await p.promises.writeFile(b, `${n + e}`);
}), ue = function() {
  const n = useRouter(), t = _e.useLoaderData();
  return jsxs("button", { className: "btn", type: "button", onClick: () => {
    I({ data: 1 }).then(() => {
      n.invalidate();
    });
  }, children: ["Add 1 to ", t, "?"] });
}, le = async () => await N();
function ee(e) {
  return N.__executeServer(e);
}
function te(e) {
  return I.__executeServer(e);
}

export { ee as $$function0, te as $$function1, ue as component, le as loader };
//# sourceMappingURL=index-CiuvGbQR.mjs.map
