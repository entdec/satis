import{Annotation as e,EditorSelection as t,StateEffect as o,codePointAt as n,codePointSize as i,fromCodePoint as s,combineConfig as l,Facet as r,StateField as a,Prec as c,MapMode as p,Text as f,Transaction as u,RangeValue as h,RangeSet as d,CharCategory as m}from"@codemirror/state";import{Direction as g,logException as v,showTooltip as b,EditorView as w,getTooltip as y,ViewPlugin as x,WidgetType as C,Decoration as S,keymap as A}from"@codemirror/view";import{syntaxTree as I,indentUnit as k}from"@codemirror/language";class CompletionContext{constructor(e,t,o){this.state=e;this.pos=t;this.explicit=o;this.abortListeners=[]}tokenBefore(e){let t=I(this.state).resolveInner(this.pos,-1);while(t&&e.indexOf(t.name)<0)t=t.parent;return t?{from:t.from,to:this.pos,text:this.state.sliceDoc(t.from,this.pos),type:t.type}:null}matchBefore(e){let t=this.state.doc.lineAt(this.pos);let o=Math.max(t.from,this.pos-250);let n=t.text.slice(o-t.from,this.pos-t.from);let i=n.search(ensureAnchor(e,false));return i<0?null:{from:o+i,to:this.pos,text:n.slice(i)}}get aborted(){return this.abortListeners==null}addEventListener(e,t){e=="abort"&&this.abortListeners&&this.abortListeners.push(t)}}function toSet(e){let t=Object.keys(e).join("");let o=/\w/.test(t);o&&(t=t.replace(/\w/g,""));return`[${o?"\\w":""}${t.replace(/[^\w\s]/g,"\\$&")}]`}function prefixMatch(e){let t=Object.create(null),o=Object.create(null);for(let{label:n}of e){t[n[0]]=true;for(let e=1;e<n.length;e++)o[n[e]]=true}let n=toSet(t)+toSet(o)+"*$";return[new RegExp("^"+n),new RegExp(n)]}function completeFromList(e){let t=e.map((e=>typeof e=="string"?{label:e}:e));let[o,n]=t.every((e=>/^\w+$/.test(e.label)))?[/\w*$/,/\w+$/]:prefixMatch(t);return e=>{let i=e.matchBefore(n);return i||e.explicit?{from:i?i.from:e.pos,options:t,validFor:o}:null}}function ifIn(e,t){return o=>{for(let n=I(o.state).resolveInner(o.pos,-1);n;n=n.parent){if(e.indexOf(n.name)>-1)return t(o);if(n.type.isTop)break}return null}}function ifNotIn(e,t){return o=>{for(let t=I(o.state).resolveInner(o.pos,-1);t;t=t.parent){if(e.indexOf(t.name)>-1)return null;if(t.type.isTop)break}return t(o)}}class Option{constructor(e,t,o,n){this.completion=e;this.source=t;this.match=o;this.score=n}}function cur(e){return e.selection.main.from}function ensureAnchor(e,t){var o;let{source:n}=e;let i=t&&n[0]!="^",s=n[n.length-1]!="$";return i||s?new RegExp(`${i?"^":""}(?:${n})${s?"$":""}`,(o=e.flags)!==null&&o!==void 0?o:e.ignoreCase?"i":""):e}const O=e.define();function insertCompletionText(e,o,n,i){let{main:s}=e.selection,l=n-s.from,r=i-s.from;return Object.assign(Object.assign({},e.changeByRange((a=>a!=s&&n!=i&&e.sliceDoc(a.from+l,a.from+r)!=e.sliceDoc(n,i)?{range:a}:{changes:{from:a.from+l,to:i==s.from?a.to:a.from+r,insert:o},range:t.cursor(a.from+l+o.length)}))),{scrollIntoView:true,userEvent:"input.complete"})}const R=new WeakMap;function asSource(e){if(!Array.isArray(e))return e;let t=R.get(e);t||R.set(e,t=completeFromList(e));return t}const T=o.define();const D=o.define();class FuzzyMatcher{constructor(e){this.pattern=e;this.chars=[];this.folded=[];this.any=[];this.precise=[];this.byWord=[];this.score=0;this.matched=[];for(let t=0;t<e.length;){let o=n(e,t),s=i(o);this.chars.push(o);let l=e.slice(t,t+s),r=l.toUpperCase();this.folded.push(n(r==l?l.toLowerCase():r,0));t+=s}this.astral=e.length!=this.chars.length}ret(e,t){this.score=e;this.matched=t;return true}match(e){if(this.pattern.length==0)return this.ret(-100,[]);if(e.length<this.pattern.length)return false;let{chars:t,folded:o,any:l,precise:r,byWord:a}=this;if(t.length==1){let s=n(e,0),l=i(s);let r=l==e.length?0:-100;if(s==t[0]);else{if(s!=o[0])return false;r+=-200}return this.ret(r,[0,l])}let c=e.indexOf(this.pattern);if(c==0)return this.ret(e.length==this.pattern.length?0:-100,[0,this.pattern.length]);let p=t.length,f=0;if(c<0){for(let s=0,r=Math.min(e.length,200);s<r&&f<p;){let r=n(e,s);r!=t[f]&&r!=o[f]||(l[f++]=s);s+=i(r)}if(f<p)return false}let u=0;let h=0,d=false;let m=0,g=-1,v=-1;let b=/[a-z]/.test(e),w=true;for(let l=0,f=Math.min(e.length,200),y=0;l<f&&h<p;){let f=n(e,l);if(c<0){u<p&&f==t[u]&&(r[u++]=l);if(m<p)if(f==t[m]||f==o[m]){m==0&&(g=l);v=l+1;m++}else m=0}let x,C=f<255?f>=48&&f<=57||f>=97&&f<=122?2:f>=65&&f<=90?1:0:(x=s(f))!=x.toLowerCase()?1:x!=x.toUpperCase()?2:0;(!l||C==1&&b||y==0&&C!=0)&&(t[h]==f||o[h]==f&&(d=true)?a[h++]=l:a.length&&(w=false));y=C;l+=i(f)}return h==p&&a[0]==0&&w?this.result((d?-200:0)-100,a,e):m==p&&g==0?this.ret(-200-e.length+(v==e.length?0:-100),[0,v]):c>-1?this.ret(-700-e.length,[c,c+this.pattern.length]):m==p?this.ret(-900-e.length,[g,v]):h==p?this.result((d?-200:0)-100-700+(w?0:-1100),a,e):t.length!=2&&this.result((l[0]?-700:0)-200-1100,l,e)}result(e,t,o){let s=[],l=0;for(let e of t){let t=e+(this.astral?i(n(o,e)):1);if(l&&s[l-1]==e)s[l-1]=t;else{s[l++]=e;s[l++]=t}}return this.ret(e-o.length,s)}}const E=r.define({combine(e){return l(e,{activateOnTyping:true,activateOnTypingDelay:100,selectOnOpen:true,override:null,closeOnBlur:true,maxRenderedOptions:100,defaultKeymap:true,tooltipClass:()=>"",optionClass:()=>"",aboveCursor:false,icons:true,addToOptions:[],positionInfo:defaultPositionInfo,compareCompletions:(e,t)=>e.label.localeCompare(t.label),interactionDelay:75,updateSyncTime:100},{defaultKeymap:(e,t)=>e&&t,closeOnBlur:(e,t)=>e&&t,icons:(e,t)=>e&&t,tooltipClass:(e,t)=>o=>joinClass(e(o),t(o)),optionClass:(e,t)=>o=>joinClass(e(o),t(o)),addToOptions:(e,t)=>e.concat(t)})}});function joinClass(e,t){return e?t?e+" "+t:e:t}function defaultPositionInfo(e,t,o,n,i,s){let l=e.textDirection==g.RTL,r=l,a=false;let c,p,f="top";let u=t.left-i.left,h=i.right-t.right;let d=n.right-n.left,m=n.bottom-n.top;r&&u<Math.min(d,h)?r=false:!r&&h<Math.min(d,u)&&(r=true);if(d<=(r?u:h)){c=Math.max(i.top,Math.min(o.top,i.bottom-m))-t.top;p=Math.min(400,r?u:h)}else{a=true;p=Math.min(400,(l?t.right:i.right-t.left)-30);let e=i.bottom-t.bottom;if(e>=m||e>t.top)c=o.bottom-t.top;else{f="bottom";c=t.bottom-o.top}}let v=(t.bottom-t.top)/s.offsetHeight;let b=(t.right-t.left)/s.offsetWidth;return{style:`${f}: ${c/v}px; max-width: ${p/b}px`,class:"cm-completionInfo-"+(a?l?"left-narrow":"right-narrow":r?"left":"right")}}function optionContent(e){let t=e.addToOptions.slice();e.icons&&t.push({render(e){let t=document.createElement("div");t.classList.add("cm-completionIcon");e.type&&t.classList.add(...e.type.split(/\s+/g).map((e=>"cm-completionIcon-"+e)));t.setAttribute("aria-hidden","true");return t},position:20});t.push({render(e,t,o,n){let i=document.createElement("span");i.className="cm-completionLabel";let s=e.displayLabel||e.label,l=0;for(let e=0;e<n.length;){let t=n[e++],o=n[e++];t>l&&i.appendChild(document.createTextNode(s.slice(l,t)));let r=i.appendChild(document.createElement("span"));r.appendChild(document.createTextNode(s.slice(t,o)));r.className="cm-completionMatchedText";l=o}l<s.length&&i.appendChild(document.createTextNode(s.slice(l)));return i},position:50},{render(e){if(!e.detail)return null;let t=document.createElement("span");t.className="cm-completionDetail";t.textContent=e.detail;return t},position:80});return t.sort(((e,t)=>e.position-t.position)).map((e=>e.render))}function rangeAroundSelected(e,t,o){if(e<=o)return{from:0,to:e};t<0&&(t=0);if(t<=e>>1){let e=Math.floor(t/o);return{from:e*o,to:(e+1)*o}}let n=Math.floor((e-t)/o);return{from:e-(n+1)*o,to:e-n*o}}class CompletionTooltip{constructor(e,t,o){this.view=e;this.stateField=t;this.applyCompletion=o;this.info=null;this.infoDestroy=null;this.placeInfoReq={read:()=>this.measureInfo(),write:e=>this.placeInfo(e),key:this};this.space=null;this.currentClass="";let n=e.state.field(t);let{options:i,selected:s}=n.open;let l=e.state.facet(E);this.optionContent=optionContent(l);this.optionClass=l.optionClass;this.tooltipClass=l.tooltipClass;this.range=rangeAroundSelected(i.length,s,l.maxRenderedOptions);this.dom=document.createElement("div");this.dom.className="cm-tooltip-autocomplete";this.updateTooltipClass(e.state);this.dom.addEventListener("mousedown",(o=>{let{options:n}=e.state.field(t).open;for(let t,i=o.target;i&&i!=this.dom;i=i.parentNode)if(i.nodeName=="LI"&&(t=/-(\d+)$/.exec(i.id))&&+t[1]<n.length){this.applyCompletion(e,n[+t[1]]);o.preventDefault();return}}));this.dom.addEventListener("focusout",(t=>{let o=e.state.field(this.stateField,false);o&&o.tooltip&&e.state.facet(E).closeOnBlur&&t.relatedTarget!=e.contentDOM&&e.dispatch({effects:D.of(null)})}));this.showOptions(i,n.id)}mount(){this.updateSel()}showOptions(e,t){this.list&&this.list.remove();this.list=this.dom.appendChild(this.createListBox(e,t,this.range));this.list.addEventListener("scroll",(()=>{this.info&&this.view.requestMeasure(this.placeInfoReq)}))}update(e){var t;let o=e.state.field(this.stateField);let n=e.startState.field(this.stateField);this.updateTooltipClass(e.state);if(o!=n){let{options:i,selected:s,disabled:l}=o.open;if(!n.open||n.open.options!=i){this.range=rangeAroundSelected(i.length,s,e.state.facet(E).maxRenderedOptions);this.showOptions(i,o.id)}this.updateSel();l!=((t=n.open)===null||t===void 0?void 0:t.disabled)&&this.dom.classList.toggle("cm-tooltip-autocomplete-disabled",!!l)}}updateTooltipClass(e){let t=this.tooltipClass(e);if(t!=this.currentClass){for(let e of this.currentClass.split(" "))e&&this.dom.classList.remove(e);for(let e of t.split(" "))e&&this.dom.classList.add(e);this.currentClass=t}}positioned(e){this.space=e;this.info&&this.view.requestMeasure(this.placeInfoReq)}updateSel(){let e=this.view.state.field(this.stateField),t=e.open;if(t.selected>-1&&t.selected<this.range.from||t.selected>=this.range.to){this.range=rangeAroundSelected(t.options.length,t.selected,this.view.state.facet(E).maxRenderedOptions);this.showOptions(t.options,e.id)}if(this.updateSelectedOption(t.selected)){this.destroyInfo();let{completion:o}=t.options[t.selected];let{info:n}=o;if(!n)return;let i=typeof n==="string"?document.createTextNode(n):n(o);if(!i)return;"then"in i?i.then((t=>{t&&this.view.state.field(this.stateField,false)==e&&this.addInfoPane(t,o)})).catch((e=>v(this.view.state,e,"completion info"))):this.addInfoPane(i,o)}}addInfoPane(e,t){this.destroyInfo();let o=this.info=document.createElement("div");o.className="cm-tooltip cm-completionInfo";if(e.nodeType!=null){o.appendChild(e);this.infoDestroy=null}else{let{dom:t,destroy:n}=e;o.appendChild(t);this.infoDestroy=n||null}this.dom.appendChild(o);this.view.requestMeasure(this.placeInfoReq)}updateSelectedOption(e){let t=null;for(let o=this.list.firstChild,n=this.range.from;o;o=o.nextSibling,n++)if(o.nodeName=="LI"&&o.id)if(n==e){if(!o.hasAttribute("aria-selected")){o.setAttribute("aria-selected","true");t=o}}else o.hasAttribute("aria-selected")&&o.removeAttribute("aria-selected");else n--;t&&scrollIntoView(this.list,t);return t}measureInfo(){let e=this.dom.querySelector("[aria-selected]");if(!e||!this.info)return null;let t=this.dom.getBoundingClientRect();let o=this.info.getBoundingClientRect();let n=e.getBoundingClientRect();let i=this.space;if(!i){let e=this.dom.ownerDocument.defaultView||window;i={left:0,top:0,right:e.innerWidth,bottom:e.innerHeight}}return n.top>Math.min(i.bottom,t.bottom)-10||n.bottom<Math.max(i.top,t.top)+10?null:this.view.state.facet(E).positionInfo(this.view,t,n,o,i,this.dom)}placeInfo(e){if(this.info)if(e){e.style&&(this.info.style.cssText=e.style);this.info.className="cm-tooltip cm-completionInfo "+(e.class||"")}else this.info.style.cssText="top: -1e6px"}createListBox(e,t,o){const n=document.createElement("ul");n.id=t;n.setAttribute("role","listbox");n.setAttribute("aria-expanded","true");n.setAttribute("aria-label",this.view.state.phrase("Completions"));let i=null;for(let s=o.from;s<o.to;s++){let{completion:l,match:r}=e[s],{section:a}=l;if(a){let e=typeof a=="string"?a:a.name;if(e!=i&&(s>o.from||o.from==0)){i=e;if(typeof a!="string"&&a.header)n.appendChild(a.header(a));else{let t=n.appendChild(document.createElement("completion-section"));t.textContent=e}}}const c=n.appendChild(document.createElement("li"));c.id=t+"-"+s;c.setAttribute("role","option");let p=this.optionClass(l);p&&(c.className=p);for(let e of this.optionContent){let t=e(l,this.view.state,this.view,r);t&&c.appendChild(t)}}o.from&&n.classList.add("cm-completionListIncompleteTop");o.to<e.length&&n.classList.add("cm-completionListIncompleteBottom");return n}destroyInfo(){if(this.info){this.infoDestroy&&this.infoDestroy();this.info.remove();this.info=null}}destroy(){this.destroyInfo()}}function completionTooltip(e,t){return o=>new CompletionTooltip(o,e,t)}function scrollIntoView(e,t){let o=e.getBoundingClientRect();let n=t.getBoundingClientRect();let i=o.height/e.offsetHeight;n.top<o.top?e.scrollTop-=(o.top-n.top)/i:n.bottom>o.bottom&&(e.scrollTop+=(n.bottom-o.bottom)/i)}function score(e){return(e.boost||0)*100+(e.apply?10:0)+(e.info?5:0)+(e.type?1:0)}function sortOptions(e,t){let o=[];let n=null;let addOption=e=>{o.push(e);let{section:t}=e.completion;if(t){n||(n=[]);let e=typeof t=="string"?t:t.name;n.some((t=>t.name==e))||n.push(typeof t=="string"?{name:e}:t)}};for(let n of e)if(n.hasResult()){let e=n.result.getMatch;if(n.result.filter===false)for(let t of n.result.options)addOption(new Option(t,n.source,e?e(t):[],1e9-o.length));else{let o=new FuzzyMatcher(t.sliceDoc(n.from,n.to));for(let t of n.result.options)if(o.match(t.label)){let i=t.displayLabel?e?e(t,o.matched):[]:o.matched;addOption(new Option(t,n.source,i,o.score+(t.boost||0)))}}}if(n){let e=Object.create(null),t=0;let cmp=(e,t)=>{var o,n;return((o=e.rank)!==null&&o!==void 0?o:1e9)-((n=t.rank)!==null&&n!==void 0?n:1e9)||(e.name<t.name?-1:1)};for(let o of n.sort(cmp)){t-=1e5;e[o.name]=t}for(let t of o){let{section:o}=t.completion;o&&(t.score+=e[typeof o=="string"?o:o.name])}}let i=[],s=null;let l=t.facet(E).compareCompletions;for(let e of o.sort(((e,t)=>t.score-e.score||l(e.completion,t.completion)))){let t=e.completion;!s||s.label!=t.label||s.detail!=t.detail||s.type!=null&&t.type!=null&&s.type!=t.type||s.apply!=t.apply||s.boost!=t.boost?i.push(e):score(e.completion)>score(s)&&(i[i.length-1]=e);s=e.completion}return i}class CompletionDialog{constructor(e,t,o,n,i,s){this.options=e;this.attrs=t;this.tooltip=o;this.timestamp=n;this.selected=i;this.disabled=s}setSelected(e,t){return e==this.selected||e>=this.options.length?this:new CompletionDialog(this.options,makeAttrs(t,e),this.tooltip,this.timestamp,e,this.disabled)}static build(e,t,o,n,i){let s=sortOptions(e,t);if(!s.length)return n&&e.some((e=>e.state==1))?new CompletionDialog(n.options,n.attrs,n.tooltip,n.timestamp,n.selected,true):null;let l=t.facet(E).selectOnOpen?0:-1;if(n&&n.selected!=l&&n.selected!=-1){let e=n.options[n.selected].completion;for(let t=0;t<s.length;t++)if(s[t].completion==e){l=t;break}}return new CompletionDialog(s,makeAttrs(o,l),{pos:e.reduce(((e,t)=>t.hasResult()?Math.min(e,t.from):e),1e8),create:j,above:i.aboveCursor},n?n.timestamp:Date.now(),l,false)}map(e){return new CompletionDialog(this.options,this.attrs,Object.assign(Object.assign({},this.tooltip),{pos:e.mapPos(this.tooltip.pos)}),this.timestamp,this.selected,this.disabled)}}class CompletionState{constructor(e,t,o){this.active=e;this.id=t;this.open=o}static start(){return new CompletionState(L,"cm-ac-"+Math.floor(Math.random()*2e6).toString(36),null)}update(e){let{state:t}=e,o=t.facet(E);let n=o.override||t.languageDataAt("autocomplete",cur(t)).map(asSource);let i=n.map((t=>{let n=this.active.find((e=>e.source==t))||new ActiveSource(t,this.active.some((e=>e.state!=0))?1:0);return n.update(e,o)}));i.length==this.active.length&&i.every(((e,t)=>e==this.active[t]))&&(i=this.active);let s=this.open;s&&e.docChanged&&(s=s.map(e.changes));e.selection||i.some((t=>t.hasResult()&&e.changes.touchesRange(t.from,t.to)))||!sameResults(i,this.active)?s=CompletionDialog.build(i,t,this.id,s,o):s&&s.disabled&&!i.some((e=>e.state==1))&&(s=null);!s&&i.every((e=>e.state!=1))&&i.some((e=>e.hasResult()))&&(i=i.map((e=>e.hasResult()?new ActiveSource(e.source,0):e)));for(let t of e.effects)t.is(F)&&(s=s&&s.setSelected(t.value,this.id));return i==this.active&&s==this.open?this:new CompletionState(i,this.id,s)}get tooltip(){return this.open?this.open.tooltip:null}get attrs(){return this.open?this.open.attrs:P}}function sameResults(e,t){if(e==t)return true;for(let o=0,n=0;;){while(o<e.length&&!e[o].hasResult)o++;while(n<t.length&&!t[n].hasResult)n++;let i=o==e.length,s=n==t.length;if(i||s)return i==s;if(e[o++].result!=t[n++].result)return false}}const P={"aria-autocomplete":"list"};function makeAttrs(e,t){let o={"aria-autocomplete":"list","aria-haspopup":"listbox","aria-controls":e};t>-1&&(o["aria-activedescendant"]=e+"-"+t);return o}const L=[];function getUserEvent(e){return e.isUserEvent("input.type")?"input":e.isUserEvent("delete.backward")?"delete":null}class ActiveSource{constructor(e,t,o=-1){this.source=e;this.state=t;this.explicitPos=o}hasResult(){return false}update(e,t){let o=getUserEvent(e),n=this;o?n=n.handleUserEvent(e,o,t):e.docChanged?n=n.handleChange(e):e.selection&&n.state!=0&&(n=new ActiveSource(n.source,0));for(let t of e.effects)if(t.is(T))n=new ActiveSource(n.source,1,t.value?cur(e.state):-1);else if(t.is(D))n=new ActiveSource(n.source,0);else if(t.is(M))for(let e of t.value)e.source==n.source&&(n=e);return n}handleUserEvent(e,t,o){return t!="delete"&&o.activateOnTyping?new ActiveSource(this.source,1):this.map(e.changes)}handleChange(e){return e.changes.touchesRange(cur(e.startState))?new ActiveSource(this.source,0):this.map(e.changes)}map(e){return e.empty||this.explicitPos<0?this:new ActiveSource(this.source,this.state,e.mapPos(this.explicitPos))}}class ActiveResult extends ActiveSource{constructor(e,t,o,n,i){super(e,2,t);this.result=o;this.from=n;this.to=i}hasResult(){return true}handleUserEvent(e,t,o){var n;let i=e.changes.mapPos(this.from),s=e.changes.mapPos(this.to,1);let l=cur(e.state);if((this.explicitPos<0?l<=i:l<this.from)||l>s||t=="delete"&&cur(e.startState)==this.from)return new ActiveSource(this.source,t=="input"&&o.activateOnTyping?1:0);let r,a=this.explicitPos<0?-1:e.changes.mapPos(this.explicitPos);return checkValid(this.result.validFor,e.state,i,s)?new ActiveResult(this.source,a,this.result,i,s):this.result.update&&(r=this.result.update(this.result,i,s,new CompletionContext(e.state,l,a>=0)))?new ActiveResult(this.source,a,r,r.from,(n=r.to)!==null&&n!==void 0?n:cur(e.state)):new ActiveSource(this.source,1,a)}handleChange(e){return e.changes.touchesRange(this.from,this.to)?new ActiveSource(this.source,0):this.map(e.changes)}map(e){return e.empty?this:new ActiveResult(this.source,this.explicitPos<0?-1:e.mapPos(this.explicitPos),this.result,e.mapPos(this.from),e.mapPos(this.to,1))}}function checkValid(e,t,o,n){if(!e)return false;let i=t.sliceDoc(o,n);return typeof e=="function"?e(i,o,n,t):ensureAnchor(e,true).test(i)}const M=o.define({map(e,t){return e.map((e=>e.map(t)))}});const F=o.define();const B=a.define({create(){return CompletionState.start()},update(e,t){return e.update(t)},provide:e=>[b.from(e,(e=>e.tooltip)),w.contentAttributes.from(e,(e=>e.attrs))]});function applyCompletion(e,t){const o=t.completion.apply||t.completion.label;let n=e.state.field(B).active.find((e=>e.source==t.source));if(!(n instanceof ActiveResult))return false;typeof o=="string"?e.dispatch(Object.assign(Object.assign({},insertCompletionText(e.state,o,n.from,n.to)),{annotations:O.of(t.completion)})):o(e,t.completion,n.from,n.to);return true}const j=completionTooltip(B,applyCompletion);function moveCompletionSelection(e,t="option"){return o=>{let n=o.state.field(B,false);if(!n||!n.open||n.open.disabled||Date.now()-n.open.timestamp<o.state.facet(E).interactionDelay)return false;let i,s=1;t=="page"&&(i=y(o,n.open.tooltip))&&(s=Math.max(2,Math.floor(i.dom.offsetHeight/i.dom.querySelector("li").offsetHeight)-1));let{length:l}=n.open.options;let r=n.open.selected>-1?n.open.selected+s*(e?1:-1):e?0:l-1;r<0?r=t=="page"?0:l-1:r>=l&&(r=t=="page"?l-1:0);o.dispatch({effects:F.of(r)});return true}}const acceptCompletion=e=>{let t=e.state.field(B,false);return!(e.state.readOnly||!t||!t.open||t.open.selected<0||t.open.disabled||Date.now()-t.open.timestamp<e.state.facet(E).interactionDelay)&&applyCompletion(e,t.open.options[t.open.selected])};const startCompletion=e=>{let t=e.state.field(B,false);if(!t)return false;e.dispatch({effects:T.of(true)});return true};const closeCompletion=e=>{let t=e.state.field(B,false);if(!t||!t.active.some((e=>e.state!=0)))return false;e.dispatch({effects:D.of(null)});return true};class RunningQuery{constructor(e,t){this.active=e;this.context=t;this.time=Date.now();this.updates=[];this.done=void 0}}const N=50,W=1e3;const $=x.fromClass(class{constructor(e){this.view=e;this.debounceUpdate=-1;this.running=[];this.debounceAccept=-1;this.pendingStart=false;this.composing=0;for(let t of e.state.field(B).active)t.state==1&&this.startQuery(t)}update(e){let t=e.state.field(B);if(!e.selectionSet&&!e.docChanged&&e.startState.field(B)==t)return;let o=e.transactions.some((e=>(e.selection||e.docChanged)&&!getUserEvent(e)));for(let t=0;t<this.running.length;t++){let n=this.running[t];if(o||n.updates.length+e.transactions.length>N&&Date.now()-n.time>W){for(let e of n.context.abortListeners)try{e()}catch(e){v(this.view.state,e)}n.context.abortListeners=null;this.running.splice(t--,1)}else n.updates.push(...e.transactions)}this.debounceUpdate>-1&&clearTimeout(this.debounceUpdate);e.transactions.some((e=>e.effects.some((e=>e.is(T)))))&&(this.pendingStart=true);let n=this.pendingStart?50:e.state.facet(E).activateOnTypingDelay;this.debounceUpdate=t.active.some((e=>e.state==1&&!this.running.some((t=>t.active.source==e.source))))?setTimeout((()=>this.startUpdate()),n):-1;if(this.composing!=0)for(let t of e.transactions)getUserEvent(t)=="input"?this.composing=2:this.composing==2&&t.selection&&(this.composing=3)}startUpdate(){this.debounceUpdate=-1;this.pendingStart=false;let{state:e}=this.view,t=e.field(B);for(let e of t.active)e.state!=1||this.running.some((t=>t.active.source==e.source))||this.startQuery(e)}startQuery(e){let{state:t}=this.view,o=cur(t);let n=new CompletionContext(t,o,e.explicitPos==o);let i=new RunningQuery(e,n);this.running.push(i);Promise.resolve(e.source(n)).then((e=>{if(!i.context.aborted){i.done=e||null;this.scheduleAccept()}}),(e=>{this.view.dispatch({effects:D.of(null)});v(this.view.state,e)}))}scheduleAccept(){this.running.every((e=>e.done!==void 0))?this.accept():this.debounceAccept<0&&(this.debounceAccept=setTimeout((()=>this.accept()),this.view.state.facet(E).updateSyncTime))}accept(){var e;this.debounceAccept>-1&&clearTimeout(this.debounceAccept);this.debounceAccept=-1;let t=[];let o=this.view.state.facet(E);for(let n=0;n<this.running.length;n++){let i=this.running[n];if(i.done===void 0)continue;this.running.splice(n--,1);if(i.done){let n=new ActiveResult(i.active.source,i.active.explicitPos,i.done,i.done.from,(e=i.done.to)!==null&&e!==void 0?e:cur(i.updates.length?i.updates[0].startState:this.view.state));for(let e of i.updates)n=n.update(e,o);if(n.hasResult()){t.push(n);continue}}let s=this.view.state.field(B).active.find((e=>e.source==i.active.source));if(s&&s.state==1)if(i.done==null){let e=new ActiveSource(i.active.source,0);for(let t of i.updates)e=e.update(t,o);e.state!=1&&t.push(e)}else this.startQuery(s)}t.length&&this.view.dispatch({effects:M.of(t)})}},{eventHandlers:{blur(e){let t=this.view.state.field(B,false);if(t&&t.tooltip&&this.view.state.facet(E).closeOnBlur){let o=t.open&&y(this.view,t.open.tooltip);o&&o.dom.contains(e.relatedTarget)||setTimeout((()=>this.view.dispatch({effects:D.of(null)})),10)}},compositionstart(){this.composing=1},compositionend(){this.composing==3&&setTimeout((()=>this.view.dispatch({effects:T.of(false)})),20);this.composing=0}}});const U=typeof navigator=="object"&&/Win/.test(navigator.platform);const q=c.highest(w.domEventHandlers({keydown(e,t){let o=t.state.field(B,false);if(!o||!o.open||o.open.disabled||o.open.selected<0||e.key.length>1||e.ctrlKey&&!(U&&e.altKey)||e.metaKey)return false;let n=o.open.options[o.open.selected];let i=o.active.find((e=>e.source==n.source));let s=n.completion.commitCharacters||i.result.commitCharacters;s&&s.indexOf(e.key)>-1&&applyCompletion(t,n);return false}}));const V=w.baseTheme({".cm-tooltip.cm-tooltip-autocomplete":{"& > ul":{fontFamily:"monospace",whiteSpace:"nowrap",overflow:"hidden auto",maxWidth_fallback:"700px",maxWidth:"min(700px, 95vw)",minWidth:"250px",maxHeight:"10em",height:"100%",listStyle:"none",margin:0,padding:0,"& > li, & > completion-section":{padding:"1px 3px",lineHeight:1.2},"& > li":{overflowX:"hidden",textOverflow:"ellipsis",cursor:"pointer"},"& > completion-section":{display:"list-item",borderBottom:"1px solid silver",paddingLeft:"0.5em",opacity:.7}}},"&light .cm-tooltip-autocomplete ul li[aria-selected]":{background:"#17c",color:"white"},"&light .cm-tooltip-autocomplete-disabled ul li[aria-selected]":{background:"#777"},"&dark .cm-tooltip-autocomplete ul li[aria-selected]":{background:"#347",color:"white"},"&dark .cm-tooltip-autocomplete-disabled ul li[aria-selected]":{background:"#444"},".cm-completionListIncompleteTop:before, .cm-completionListIncompleteBottom:after":{content:'"···"',opacity:.5,display:"block",textAlign:"center"},".cm-tooltip.cm-completionInfo":{position:"absolute",padding:"3px 9px",width:"max-content",maxWidth:"400px",boxSizing:"border-box"},".cm-completionInfo.cm-completionInfo-left":{right:"100%"},".cm-completionInfo.cm-completionInfo-right":{left:"100%"},".cm-completionInfo.cm-completionInfo-left-narrow":{right:"30px"},".cm-completionInfo.cm-completionInfo-right-narrow":{left:"30px"},"&light .cm-snippetField":{backgroundColor:"#00000022"},"&dark .cm-snippetField":{backgroundColor:"#ffffff22"},".cm-snippetFieldPosition":{verticalAlign:"text-top",width:0,height:"1.15em",display:"inline-block",margin:"0 -0.7px -.7em",borderLeft:"1.4px dotted #888"},".cm-completionMatchedText":{textDecoration:"underline"},".cm-completionDetail":{marginLeft:"0.5em",fontStyle:"italic"},".cm-completionIcon":{fontSize:"90%",width:".8em",display:"inline-block",textAlign:"center",paddingRight:".6em",opacity:"0.6",boxSizing:"content-box"},".cm-completionIcon-function, .cm-completionIcon-method":{"&:after":{content:"'ƒ'"}},".cm-completionIcon-class":{"&:after":{content:"'○'"}},".cm-completionIcon-interface":{"&:after":{content:"'◌'"}},".cm-completionIcon-variable":{"&:after":{content:"'𝑥'"}},".cm-completionIcon-constant":{"&:after":{content:"'𝐶'"}},".cm-completionIcon-type":{"&:after":{content:"'𝑡'"}},".cm-completionIcon-enum":{"&:after":{content:"'∪'"}},".cm-completionIcon-property":{"&:after":{content:"'□'"}},".cm-completionIcon-keyword":{"&:after":{content:"'🔑︎'"}},".cm-completionIcon-namespace":{"&:after":{content:"'▢'"}},".cm-completionIcon-text":{"&:after":{content:"'abc'",fontSize:"50%",verticalAlign:"middle"}}});class FieldPos{constructor(e,t,o,n){this.field=e;this.line=t;this.from=o;this.to=n}}class FieldRange{constructor(e,t,o){this.field=e;this.from=t;this.to=o}map(e){let t=e.mapPos(this.from,-1,p.TrackDel);let o=e.mapPos(this.to,1,p.TrackDel);return t==null||o==null?null:new FieldRange(this.field,t,o)}}class Snippet{constructor(e,t){this.lines=e;this.fieldPositions=t}instantiate(e,t){let o=[],n=[t];let i=e.doc.lineAt(t),s=/^\s*/.exec(i.text)[0];for(let i of this.lines){if(o.length){let o=s,l=/^\t*/.exec(i)[0].length;for(let t=0;t<l;t++)o+=e.facet(k);n.push(t+o.length-l);i=o+i.slice(l)}o.push(i);t+=i.length+1}let l=this.fieldPositions.map((e=>new FieldRange(e.field,n[e.line]+e.from,n[e.line]+e.to)));return{text:o,ranges:l}}static parse(e){let t=[];let o,n=[],i=[];for(let s of e.split(/\r\n?|\n/)){while(o=/[#$]\{(?:(\d+)(?::([^}]*))?|([^}]*))\}/.exec(s)){let e=o[1]?+o[1]:null,l=o[2]||o[3]||"",r=-1;for(let o=0;o<t.length;o++)(e!=null?t[o].seq!=e:!l||t[o].name!=l)||(r=o);if(r<0){let o=0;while(o<t.length&&(e==null||t[o].seq!=null&&t[o].seq<e))o++;t.splice(o,0,{seq:e,name:l});r=o;for(let e of i)e.field>=r&&e.field++}i.push(new FieldPos(r,n.length,o.index,o.index+l.length));s=s.slice(0,o.index)+l+s.slice(o.index+o[0].length)}for(let e;e=/\\([{}])/.exec(s);){s=s.slice(0,e.index)+e[1]+s.slice(e.index+e[0].length);for(let t of i)if(t.line==n.length&&t.from>e.index){t.from--;t.to--}}n.push(s)}return new Snippet(n,i)}}let z=S.widget({widget:new class extends C{toDOM(){let e=document.createElement("span");e.className="cm-snippetFieldPosition";return e}ignoreEvent(){return false}}});let H=S.mark({class:"cm-snippetField"});class ActiveSnippet{constructor(e,t){this.ranges=e;this.active=t;this.deco=S.set(e.map((e=>(e.from==e.to?z:H).range(e.from,e.to))))}map(e){let t=[];for(let o of this.ranges){let n=o.map(e);if(!n)return null;t.push(n)}return new ActiveSnippet(t,this.active)}selectionInsideField(e){return e.ranges.every((e=>this.ranges.some((t=>t.field==this.active&&t.from<=e.from&&t.to>=e.to))))}}const K=o.define({map(e,t){return e&&e.map(t)}});const Q=o.define();const X=a.define({create(){return null},update(e,t){for(let o of t.effects){if(o.is(K))return o.value;if(o.is(Q)&&e)return new ActiveSnippet(e.ranges,o.value)}e&&t.docChanged&&(e=e.map(t.changes));e&&t.selection&&!e.selectionInsideField(t.selection)&&(e=null);return e},provide:e=>w.decorations.from(e,(e=>e?e.deco:S.none))});function fieldSelection(e,o){return t.create(e.filter((e=>e.field==o)).map((e=>t.range(e.from,e.to))))}function snippet(e){let t=Snippet.parse(e);return(e,n,i,s)=>{let{text:l,ranges:r}=t.instantiate(e.state,i);let a={changes:{from:i,to:s,insert:f.of(l)},scrollIntoView:true,annotations:n?[O.of(n),u.userEvent.of("input.complete")]:void 0};r.length&&(a.selection=fieldSelection(r,0));if(r.some((e=>e.field>0))){let t=new ActiveSnippet(r,0);let n=a.effects=[K.of(t)];e.state.field(X,false)===void 0&&n.push(o.appendConfig.of([X,Z,ee,V]))}e.dispatch(e.state.update(a))}}function moveField(e){return({state:t,dispatch:o})=>{let n=t.field(X,false);if(!n||e<0&&n.active==0)return false;let i=n.active+e,s=e>0&&!n.ranges.some((t=>t.field==i+e));o(t.update({selection:fieldSelection(n.ranges,i),effects:K.of(s?null:new ActiveSnippet(n.ranges,i)),scrollIntoView:true}));return true}}const clearSnippet=({state:e,dispatch:t})=>{let o=e.field(X,false);if(!o)return false;t(e.update({effects:K.of(null)}));return true};const _=moveField(1);const Y=moveField(-1);function hasNextSnippetField(e){let t=e.field(X,false);return!!(t&&t.ranges.some((e=>e.field==t.active+1)))}function hasPrevSnippetField(e){let t=e.field(X,false);return!!(t&&t.active>0)}const G=[{key:"Tab",run:_,shift:Y},{key:"Escape",run:clearSnippet}];const J=r.define({combine(e){return e.length?e[0]:G}});const Z=c.highest(A.compute([J],(e=>e.facet(J))));function snippetCompletion(e,t){return Object.assign(Object.assign({},t),{apply:snippet(e)})}const ee=w.domEventHandlers({mousedown(e,t){let o,n=t.state.field(X,false);if(!n||(o=t.posAtCoords({x:e.clientX,y:e.clientY}))==null)return false;let i=n.ranges.find((e=>e.from<=o&&e.to>=o));if(!i||i.field==n.active)return false;t.dispatch({selection:fieldSelection(n.ranges,i.field),effects:K.of(n.ranges.some((e=>e.field>i.field))?new ActiveSnippet(n.ranges,i.field):null),scrollIntoView:true});return true}});function wordRE(e){let t=e.replace(/[\]\-\\]/g,"\\$&");try{return new RegExp(`[\\p{Alphabetic}\\p{Number}_${t}]+`,"ug")}catch(e){return new RegExp(`[w${t}]`,"g")}}function mapRE(e,t){return new RegExp(t(e.source),e.unicode?"u":"")}const te=Object.create(null);function wordCache(e){return te[e]||(te[e]=new WeakMap)}function storeWords(e,t,o,n,i){for(let s=e.iterLines(),l=0;!s.next().done;){let e,{value:r}=s;t.lastIndex=0;while(e=t.exec(r))if(!n[e[0]]&&l+e.index!=i){o.push({type:"text",label:e[0]});n[e[0]]=true;if(o.length>=2e3)return}l+=r.length+1}}function collectWords(e,t,o,n,i){let s=e.length>=1e3;let l=s&&t.get(e);if(l)return l;let r=[],a=Object.create(null);if(e.children){let s=0;for(let l of e.children){if(l.length>=1e3){for(let e of collectWords(l,t,o,n-s,i-s))if(!a[e.label]){a[e.label]=true;r.push(e)}}else storeWords(l,o,r,a,i-s);s+=l.length+1}}else storeWords(e,o,r,a,i);s&&r.length<2e3&&t.set(e,r);return r}const completeAnyWord=e=>{let t=e.state.languageDataAt("wordChars",e.pos).join("");let o=wordRE(t);let n=e.matchBefore(mapRE(o,(e=>e+"$")));if(!n&&!e.explicit)return null;let i=n?n.from:e.pos;let s=collectWords(e.state.doc,wordCache(t),o,5e4,i);return{from:i,options:s,validFor:mapRE(o,(e=>"^"+e))}};const oe={brackets:["(","[","{","'",'"'],before:")]}:;>",stringPrefixes:[]};const ne=o.define({map(e,t){let o=t.mapPos(e,-1,p.TrackAfter);return o==null?void 0:o}});const ie=new class extends h{};ie.startSide=1;ie.endSide=-1;const se=a.define({create(){return d.empty},update(e,t){e=e.map(t.changes);if(t.selection){let o=t.state.doc.lineAt(t.selection.main.head);e=e.update({filter:e=>e>=o.from&&e<=o.to})}for(let o of t.effects)o.is(ne)&&(e=e.update({add:[ie.range(o.value,o.value+1)]}));return e}});function closeBrackets(){return[ae,se]}const le="()[]{}<>";function closing(e){for(let t=0;t<le.length;t+=2)if(le.charCodeAt(t)==e)return le.charAt(t+1);return s(e<128?e:e+1)}function config(e,t){return e.languageDataAt("closeBrackets",t)[0]||oe}const re=typeof navigator=="object"&&/Android\b/.test(navigator.userAgent);const ae=w.inputHandler.of(((e,t,o,s)=>{if((re?e.composing:e.compositionStarted)||e.state.readOnly)return false;let l=e.state.selection.main;if(s.length>2||s.length==2&&i(n(s,0))==1||t!=l.from||o!=l.to)return false;let r=insertBracket(e.state,s);if(!r)return false;e.dispatch(r);return true}));const deleteBracketPair=({state:e,dispatch:o})=>{if(e.readOnly)return false;let i=config(e,e.selection.main.head);let s=i.brackets||oe.brackets;let l=null,r=e.changeByRange((o=>{if(o.empty){let i=prevChar(e.doc,o.head);for(let l of s)if(l==i&&nextChar(e.doc,o.head)==closing(n(l,0)))return{changes:{from:o.head-l.length,to:o.head+l.length},range:t.cursor(o.head-l.length)}}return{range:l=o}}));l||o(e.update(r,{scrollIntoView:true,userEvent:"delete.backward"}));return!l};const ce=[{key:"Backspace",run:deleteBracketPair}];function insertBracket(e,t){let o=config(e,e.selection.main.head);let i=o.brackets||oe.brackets;for(let s of i){let l=closing(n(s,0));if(t==s)return l==s?handleSame(e,s,i.indexOf(s+s+s)>-1,o):handleOpen(e,s,l,o.before||oe.before);if(t==l&&closedBracketAt(e,e.selection.main.from))return handleClose(e,s,l)}return null}function closedBracketAt(e,t){let o=false;e.field(se).between(0,e.doc.length,(e=>{e==t&&(o=true)}));return o}function nextChar(e,t){let o=e.sliceString(t,t+2);return o.slice(0,i(n(o,0)))}function prevChar(e,t){let o=e.sliceString(t-2,t);return i(n(o,0))==o.length?o:o.slice(1)}function handleOpen(e,o,n,i){let s=null,l=e.changeByRange((l=>{if(!l.empty)return{changes:[{insert:o,from:l.from},{insert:n,from:l.to}],effects:ne.of(l.to+o.length),range:t.range(l.anchor+o.length,l.head+o.length)};let r=nextChar(e.doc,l.head);return!r||/\s/.test(r)||i.indexOf(r)>-1?{changes:{insert:o+n,from:l.head},effects:ne.of(l.head+o.length),range:t.cursor(l.head+o.length)}:{range:s=l}}));return s?null:e.update(l,{scrollIntoView:true,userEvent:"input.type"})}function handleClose(e,o,n){let i=null,s=e.changeByRange((o=>o.empty&&nextChar(e.doc,o.head)==n?{changes:{from:o.head,to:o.head+n.length,insert:n},range:t.cursor(o.head+n.length)}:i={range:o}));return i?null:e.update(s,{scrollIntoView:true,userEvent:"input.type"})}function handleSame(e,o,n,i){let s=i.stringPrefixes||oe.stringPrefixes;let l=null,r=e.changeByRange((i=>{if(!i.empty)return{changes:[{insert:o,from:i.from},{insert:o,from:i.to}],effects:ne.of(i.to+o.length),range:t.range(i.anchor+o.length,i.head+o.length)};let r,a=i.head,c=nextChar(e.doc,a);if(c==o){if(nodeStart(e,a))return{changes:{insert:o+o,from:a},effects:ne.of(a+o.length),range:t.cursor(a+o.length)};if(closedBracketAt(e,a)){let i=n&&e.sliceDoc(a,a+o.length*3)==o+o+o;let s=i?o+o+o:o;return{changes:{from:a,to:a+s.length,insert:s},range:t.cursor(a+s.length)}}}else{if(n&&e.sliceDoc(a-2*o.length,a)==o+o&&(r=canStartStringAt(e,a-2*o.length,s))>-1&&nodeStart(e,r))return{changes:{insert:o+o+o+o,from:a},effects:ne.of(a+o.length),range:t.cursor(a+o.length)};if(e.charCategorizer(a)(c)!=m.Word&&canStartStringAt(e,a,s)>-1&&!probablyInString(e,a,o,s))return{changes:{insert:o+o,from:a},effects:ne.of(a+o.length),range:t.cursor(a+o.length)}}return{range:l=i}}));return l?null:e.update(r,{scrollIntoView:true,userEvent:"input.type"})}function nodeStart(e,t){let o=I(e).resolveInner(t+1);return o.parent&&o.from==t}function probablyInString(e,t,o,n){let i=I(e).resolveInner(t,-1);let s=n.reduce(((e,t)=>Math.max(e,t.length)),0);for(let l=0;l<5;l++){let l=e.sliceDoc(i.from,Math.min(i.to,i.from+o.length+s));let r=l.indexOf(o);if(!r||r>-1&&n.indexOf(l.slice(0,r))>-1){let t=i.firstChild;while(t&&t.from==i.from&&t.to-t.from>o.length+r){if(e.sliceDoc(t.to-o.length,t.to)==o)return false;t=t.firstChild}return true}let a=i.to==t&&i.parent;if(!a)break;i=a}return false}function canStartStringAt(e,t,o){let n=e.charCategorizer(t);if(n(e.sliceDoc(t-1,t))!=m.Word)return t;for(let i of o){let o=t-i.length;if(e.sliceDoc(o,t)==i&&n(e.sliceDoc(o-1,o))!=m.Word)return o}return-1}function autocompletion(e={}){return[q,B,E.of(e),$,fe,V]}const pe=[{key:"Ctrl-Space",run:startCompletion},{key:"Escape",run:closeCompletion},{key:"ArrowDown",run:moveCompletionSelection(true)},{key:"ArrowUp",run:moveCompletionSelection(false)},{key:"PageDown",run:moveCompletionSelection(true,"page")},{key:"PageUp",run:moveCompletionSelection(false,"page")},{key:"Enter",run:acceptCompletion}];const fe=c.highest(A.computeN([E],(e=>e.facet(E).defaultKeymap?[pe]:[])));function completionStatus(e){let t=e.field(B,false);return t&&t.active.some((e=>e.state==1))?"pending":t&&t.active.some((e=>e.state!=0))?"active":null}const ue=new WeakMap;function currentCompletions(e){var t;let o=(t=e.field(B,false))===null||t===void 0?void 0:t.open;if(!o||o.disabled)return[];let n=ue.get(o.options);n||ue.set(o.options,n=o.options.map((e=>e.completion)));return n}function selectedCompletion(e){var t;let o=(t=e.field(B,false))===null||t===void 0?void 0:t.open;return o&&!o.disabled&&o.selected>=0?o.options[o.selected].completion:null}function selectedCompletionIndex(e){var t;let o=(t=e.field(B,false))===null||t===void 0?void 0:t.open;return o&&!o.disabled&&o.selected>=0?o.selected:null}function setSelectedCompletion(e){return F.of(e)}export{CompletionContext,acceptCompletion,autocompletion,clearSnippet,closeBrackets,ce as closeBracketsKeymap,closeCompletion,completeAnyWord,completeFromList,pe as completionKeymap,completionStatus,currentCompletions,deleteBracketPair,hasNextSnippetField,hasPrevSnippetField,ifIn,ifNotIn,insertBracket,insertCompletionText,moveCompletionSelection,_ as nextSnippetField,O as pickedCompletion,Y as prevSnippetField,selectedCompletion,selectedCompletionIndex,setSelectedCompletion,snippet,snippetCompletion,J as snippetKeymap,startCompletion};

