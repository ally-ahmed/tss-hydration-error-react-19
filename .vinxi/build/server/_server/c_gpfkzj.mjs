import{jsxs as S}from"react/jsx-runtime";import*as p from"node:fs";import{defaultTransformer as T,isRedirect as C,isNotFound as j,createFileRoute as H,lazyRouteComponent as M,lazyFn as $,useRouter as E}from"@tanstack/react-router";import{i as R}from"./tiny-invariant.mjs";function w(e,n,t){return Object.assign(e,{url:"https://localhost:3000"})}function A(e){return e instanceof Headers?new Headers(e):Array.isArray(e)?new Headers(e):typeof e=="object"?new Headers(e):new Headers}function I(...e){return e.reduce((n,t)=>{const r=A(t);for(const[o,a]of r.entries())n.set(o,a);return n},new Headers)}const P=[];function u(e,n){const t=n||e||{};return typeof t.method>"u"&&(t.method="GET"),{options:t,middleware:r=>u(void 0,Object.assign(t,{middleware:r})),validator:r=>u(void 0,Object.assign(t,{validator:r})),handler:(...r)=>{const[o,a]=r;Object.assign(t,{...o,extractedFn:o,serverFn:a}),R(o.url);const i=[...t.middleware||[],G(t)];return Object.assign(async s=>h(i,"client",{...o,method:t.method,data:s?.data,headers:s?.headers,context:{}}).then(d=>{if(d.error)throw d.error;return d.result}),{...o,__executeServer:async s=>{const d=s instanceof FormData?N(s):s;return await h(i,"server",{...o,...d}).then(c=>({result:c.result,error:c.error,context:c.sendContext}))}})}}}function N(e){const n=e.get("__TSR_CONTEXT");if(e.delete("__TSR_CONTEXT"),typeof n!="string")return{context:{},data:e};try{return{context:T.parse(n),data:e}}catch{return{data:e}}}function z(e){const n=new Set,t=[],r=o=>{o.forEach(a=>{a.options.middleware&&r(a.options.middleware),n.has(a)||(n.add(a),t.push(a))})};return r(e),t}const f=async(e,n,t)=>e({...n,next:async(r={})=>t({...n,...r,context:{...n.context,...r.context},sendContext:{...n.sendContext,...r.sendContext??{}},headers:I(n.headers,r.headers),result:r.result!==void 0?r.result:n.result,error:r.error??n.error})});function k(e,n){if(e==null)return{};if("~standard"in e){const t=e["~standard"].validate(n);if(t instanceof Promise)throw new Error("Async validation not supported");if(t.issues)throw new Error(JSON.stringify(t.issues,void 0,2));return t.value}if("parse"in e)return e.parse(n);if(typeof e=="function")return e(n);throw new Error("Invalid validator type!")}async function h(e,n,t){const r=z([...P,...e]),o=async a=>{const i=r.shift();if(!i)return a;i.options.validator&&(n!=="client"||i.options.validateClient)&&(a.data=await k(i.options.validator,a.data));const s=n==="client"?i.options.client:i.options.server;return s?f(s,a,async d=>{const l=i.options.clientAfter;if(n==="client"&&l){const c=await o(d);return f(l,{...d,...c},O=>O)}return o(d).catch(c=>{if(C(c)||j(c))return{...d,error:c};throw c})}):o(a)};return o({...t,headers:t.headers||{},sendContext:t.sendContext||{},context:t.context||{}})}function G(e){return{_types:void 0,options:{validator:e.validator,validateClient:e.validateClient,client:async({next:n,sendContext:t,...r})=>{var o;const a=await((o=e.extractedFn)==null?void 0:o.call(e,{...r,context:t}));return n(a)},server:async({next:n,...t})=>{var r;const o=await((r=e.serverFn)==null?void 0:r.call(e,t));return n({...t,result:o})}}}}const L=()=>Promise.resolve().then(()=>g),U=()=>Promise.resolve().then(()=>g),m=H("/")({component:M(U,"component",()=>m.ssr),loader:$(L,"loader")}),y="count.txt";async function v(){return parseInt(await p.promises.readFile(y,"utf-8").catch(()=>"0"))}const _=u({method:"GET"}).handler(w(F),()=>v()),x=u({method:"POST"}).validator(e=>e).handler(w(b),async({data:e})=>{const n=await v();await p.promises.writeFile(y,`${n+e}`)}),X=function(){const n=E(),t=m.useLoaderData();return S("button",{className:"btn",type:"button",onClick:()=>{x({data:1}).then(()=>{n.invalidate()})},children:["Add 1 to ",t,"?"]})},B=async()=>await _();function F(e){return _.__executeServer(e)}function b(e){return x.__executeServer(e)}const g=Object.freeze(Object.defineProperty({__proto__:null,$$function0:F,$$function1:b,component:X,loader:B},Symbol.toStringTag,{value:"Module"}));export{F as $$function0,b as $$function1,X as component,B as loader};