const e="ͼ";const t=typeof Symbol=="undefined"?"__"+e:Symbol.for(e);const s=typeof Symbol=="undefined"?"__styleSet"+Math.floor(Math.random()*1e8):Symbol("styleSet");const l=typeof globalThis!="undefined"?globalThis:typeof window!="undefined"?window:{};class StyleModule{constructor(e,t){this.rules=[];let{finish:s}=t||{};function splitSelector(e){return/^@/.test(e)?[e]:e.split(/,\s*/)}function render(e,t,l,o){let i=[],n=/^@(\w+)\b/.exec(e[0]),r=n&&n[1]=="keyframes";if(n&&t==null)return l.push(e[0]+";");for(let s in t){let o=t[s];if(/&/.test(s))render(s.split(/,\s*/).map((t=>e.map((e=>t.replace(/&/,e))))).reduce(((e,t)=>e.concat(t))),o,l);else if(o&&typeof o=="object"){if(!n)throw new RangeError("The value of a property ("+s+") should be a primitive value.");render(splitSelector(s),o,i,r)}else o!=null&&i.push(s.replace(/_.*/,"").replace(/[A-Z]/g,(e=>"-"+e.toLowerCase()))+": "+o+";")}(i.length||r)&&l.push((!s||n||o?e:e.map(s)).join(", ")+" {"+i.join(" ")+"}")}for(let t in e)render(splitSelector(t),e[t],this.rules)}getRules(){return this.rules.join("\n")}static newName(){let s=l[t]||1;l[t]=s+1;return e+s.toString(36)}static mount(e,t,l){let o=e[s],i=l&&l.nonce;o?i&&o.setNonce(i):o=new StyleSet(e,i);o.mount(Array.isArray(t)?t:[t])}}let o=new Map;class StyleSet{constructor(e,t){this.root=e;let l=e.ownerDocument||e,i=l.defaultView;if(!e.head&&e.adoptedStyleSheets&&i.CSSStyleSheet){let t=o.get(l);if(t)return e[s]=t;this.sheet=new i.CSSStyleSheet;o.set(l,this)}else{this.styleTag=l.createElement("style");t&&this.styleTag.setAttribute("nonce",t)}this.modules=[];e[s]=this}mount(e){let t=this.sheet;let s=0,l=0;for(let o=0;o<e.length;o++){let i=e[o],n=this.modules.indexOf(i);if(n<l&&n>-1){this.modules.splice(n,1);l--;n=-1}if(n==-1){this.modules.splice(l++,0,i);if(t)for(let e=0;e<i.rules.length;e++)t.insertRule(i.rules[e],s++)}else{while(l<n)s+=this.modules[l++].rules.length;s+=i.rules.length;l++}}if(t)this.root.adoptedStyleSheets.indexOf(this.sheet)<0&&(this.root.adoptedStyleSheets=[this.sheet,...this.root.adoptedStyleSheets]);else{let e="";for(let t=0;t<this.modules.length;t++)e+=this.modules[t].getRules()+"\n";this.styleTag.textContent=e;let t=this.root.head||this.root;this.styleTag.parentNode!=t&&t.insertBefore(this.styleTag,t.firstChild)}}setNonce(e){this.styleTag&&this.styleTag.getAttribute("nonce")!=e&&this.styleTag.setAttribute("nonce",e)}}export{StyleModule};
