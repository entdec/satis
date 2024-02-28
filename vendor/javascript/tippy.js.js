import{createPopper as e,applyStyles as t}from"@popperjs/core";var n='<svg width="16" height="6" xmlns="http://www.w3.org/2000/svg"><path d="M0 6s1.796-.013 4.67-3.615C5.851.9 6.93.006 8 0c1.07-.006 2.148.887 3.343 2.385C14.233 6.005 16 6 16 6H0z"></svg>';var r="tippy-box";var o="tippy-content";var i="tippy-backdrop";var a="tippy-arrow";var s="tippy-svg-arrow";var u={passive:true,capture:true};var c=function TIPPY_DEFAULT_APPEND_TO(){return document.body};function hasOwnProperty(e,t){return{}.hasOwnProperty.call(e,t)}function getValueAtIndexOrReturn(e,t,n){if(Array.isArray(e)){var r=e[t];return null==r?Array.isArray(n)?n[t]:n:r}return e}function isType(e,t){var n={}.toString.call(e);return 0===n.indexOf("[object")&&n.indexOf(t+"]")>-1}function invokeWithArgsOrReturn(e,t){return"function"===typeof e?e.apply(void 0,t):e}function debounce(e,t){return 0===t?e:function(r){clearTimeout(n);n=setTimeout((function(){e(r)}),t)};var n}function removeProperties(e,t){var n=Object.assign({},e);t.forEach((function(e){delete n[e]}));return n}function splitBySpaces(e){return e.split(/\s+/).filter(Boolean)}function normalizeToArray(e){return[].concat(e)}function pushIfUnique(e,t){-1===e.indexOf(t)&&e.push(t)}function unique(e){return e.filter((function(t,n){return e.indexOf(t)===n}))}function getBasePlacement(e){return e.split("-")[0]}function arrayFrom(e){return[].slice.call(e)}function removeUndefinedProps(e){return Object.keys(e).reduce((function(t,n){void 0!==e[n]&&(t[n]=e[n]);return t}),{})}function div(){return document.createElement("div")}function isElement(e){return["Element","Fragment"].some((function(t){return isType(e,t)}))}function isNodeList(e){return isType(e,"NodeList")}function isMouseEvent(e){return isType(e,"MouseEvent")}function isReferenceElement(e){return!!(e&&e._tippy&&e._tippy.reference===e)}function getArrayOfElements(e){return isElement(e)?[e]:isNodeList(e)?arrayFrom(e):Array.isArray(e)?e:arrayFrom(document.querySelectorAll(e))}function setTransitionDuration(e,t){e.forEach((function(e){e&&(e.style.transitionDuration=t+"ms")}))}function setVisibilityState(e,t){e.forEach((function(e){e&&e.setAttribute("data-state",t)}))}function getOwnerDocument(e){var t;var n=normalizeToArray(e),r=n[0];return null!=r&&null!=(t=r.ownerDocument)&&t.body?r.ownerDocument:document}function isCursorOutsideInteractiveBorder(e,t){var n=t.clientX,r=t.clientY;return e.every((function(e){var t=e.popperRect,o=e.popperState,i=e.props;var a=i.interactiveBorder;var s=getBasePlacement(o.placement);var u=o.modifiersData.offset;if(!u)return true;var c="bottom"===s?u.top.y:0;var p="top"===s?u.bottom.y:0;var l="right"===s?u.left.x:0;var d="left"===s?u.right.x:0;var f=t.top-r+c>a;var v=r-t.bottom-p>a;var g=t.left-n+l>a;var m=n-t.right-d>a;return f||v||g||m}))}function updateTransitionEndListener(e,t,n){var r=t+"EventListener";["transitionend","webkitTransitionEnd"].forEach((function(t){e[r](t,n)}))}function actualContains(e,t){var n=t;while(n){var r;if(e.contains(n))return true;n=null==n.getRootNode||null==(r=n.getRootNode())?void 0:r.host}return false}var p={isTouch:false};var l=0;function onDocumentTouchStart(){if(!p.isTouch){p.isTouch=true;window.performance&&document.addEventListener("mousemove",onDocumentMouseMove)}}function onDocumentMouseMove(){var e=performance.now();if(e-l<20){p.isTouch=false;document.removeEventListener("mousemove",onDocumentMouseMove)}l=e}function onWindowBlur(){var e=document.activeElement;if(isReferenceElement(e)){var t=e._tippy;e.blur&&!t.state.isVisible&&e.blur()}}function bindGlobalEventListeners(){document.addEventListener("touchstart",onDocumentTouchStart,u);window.addEventListener("blur",onWindowBlur)}var d="undefined"!==typeof window&&"undefined"!==typeof document;var f=!!d&&!!window.msCrypto;function createMemoryLeakWarning(e){var t="destroy"===e?"n already-":" ";return[e+"() was called on a"+t+"destroyed instance. This is a no-op but","indicates a potential memory leak."].join(" ")}function clean(e){var t=/[ \t]{2,}/g;var n=/^[ \t]*/gm;return e.replace(t," ").replace(n,"").trim()}function getDevMessage(e){return clean("\n  %ctippy.js\n\n  %c"+clean(e)+"\n\n  %c👷‍ This is a development-only message. It will be removed in production.\n  ")}function getFormattedMessage(e){return[getDevMessage(e),"color: #00C584; font-size: 1.3em; font-weight: bold;","line-height: 1.5","color: #a6a095;"]}var v;"production"!==process.env.NODE_ENV&&resetVisitedMessages();function resetVisitedMessages(){v=new Set}function warnWhen(e,t){if(e&&!v.has(t)){var n;v.add(t);(n=console).warn.apply(n,getFormattedMessage(t))}}function errorWhen(e,t){if(e&&!v.has(t)){var n;v.add(t);(n=console).error.apply(n,getFormattedMessage(t))}}function validateTargets(e){var t=!e;var n="[object Object]"===Object.prototype.toString.call(e)&&!e.addEventListener;errorWhen(t,["tippy() was passed","`"+String(e)+"`","as its targets (first) argument. Valid types are: String, Element,","Element[], or NodeList."].join(" "));errorWhen(n,["tippy() was passed a plain object which is not supported as an argument","for virtual positioning. Use props.getReferenceClientRect instead."].join(" "))}var g={animateFill:false,followCursor:false,inlinePositioning:false,sticky:false};var m={allowHTML:false,animation:"fade",arrow:true,content:"",inertia:false,maxWidth:350,role:"tooltip",theme:"",zIndex:9999};var h=Object.assign({appendTo:c,aria:{content:"auto",expanded:"auto"},delay:0,duration:[300,250],getReferenceClientRect:null,hideOnClick:true,ignoreAttributes:false,interactive:false,interactiveBorder:2,interactiveDebounce:0,moveTransition:"",offset:[0,10],onAfterUpdate:function onAfterUpdate(){},onBeforeUpdate:function onBeforeUpdate(){},onCreate:function onCreate(){},onDestroy:function onDestroy(){},onHidden:function onHidden(){},onHide:function onHide(){},onMount:function onMount(){},onShow:function onShow(){},onShown:function onShown(){},onTrigger:function onTrigger(){},onUntrigger:function onUntrigger(){},onClickOutside:function onClickOutside(){},placement:"top",plugins:[],popperOptions:{},render:null,showOnCreate:false,touch:true,trigger:"mouseenter focus",triggerTarget:null},g,m);var y=Object.keys(h);var b=function setDefaultProps(e){"production"!==process.env.NODE_ENV&&validateProps(e,[]);var t=Object.keys(e);t.forEach((function(t){h[t]=e[t]}))};function getExtendedPassedProps(e){var t=e.plugins||[];var n=t.reduce((function(t,n){var r=n.name,o=n.defaultValue;if(r){var i;t[r]=void 0!==e[r]?e[r]:null!=(i=h[r])?i:o}return t}),{});return Object.assign({},e,n)}function getDataAttributeProps(e,t){var n=t?Object.keys(getExtendedPassedProps(Object.assign({},h,{plugins:t}))):y;var r=n.reduce((function(t,n){var r=(e.getAttribute("data-tippy-"+n)||"").trim();if(!r)return t;if("content"===n)t[n]=r;else try{t[n]=JSON.parse(r)}catch(e){t[n]=r}return t}),{});return r}function evaluateProps(e,t){var n=Object.assign({},t,{content:invokeWithArgsOrReturn(t.content,[e])},t.ignoreAttributes?{}:getDataAttributeProps(e,t.plugins));n.aria=Object.assign({},h.aria,n.aria);n.aria={expanded:"auto"===n.aria.expanded?t.interactive:n.aria.expanded,content:"auto"===n.aria.content?t.interactive?null:"describedby":n.aria.content};return n}function validateProps(e,t){void 0===e&&(e={});void 0===t&&(t=[]);var n=Object.keys(e);n.forEach((function(e){var n=removeProperties(h,Object.keys(g));var r=!hasOwnProperty(n,e);r&&(r=0===t.filter((function(t){return t.name===e})).length);warnWhen(r,["`"+e+"`","is not a valid prop. You may have spelled it incorrectly, or if it's","a plugin, forgot to pass it in an array as props.plugins.","\n\n","All props: https://atomiks.github.io/tippyjs/v6/all-props/\n","Plugins: https://atomiks.github.io/tippyjs/v6/plugins/"].join(" "))}))}var T=function innerHTML(){return"innerHTML"};function dangerouslySetInnerHTML(e,t){e[T()]=t}function createArrowElement(e){var t=div();if(true===e)t.className=a;else{t.className=s;isElement(e)?t.appendChild(e):dangerouslySetInnerHTML(t,e)}return t}function setContent(e,t){if(isElement(t.content)){dangerouslySetInnerHTML(e,"");e.appendChild(t.content)}else"function"!==typeof t.content&&(t.allowHTML?dangerouslySetInnerHTML(e,t.content):e.textContent=t.content)}function getChildren(e){var t=e.firstElementChild;var n=arrayFrom(t.children);return{box:t,content:n.find((function(e){return e.classList.contains(o)})),arrow:n.find((function(e){return e.classList.contains(a)||e.classList.contains(s)})),backdrop:n.find((function(e){return e.classList.contains(i)}))}}function render(e){var t=div();var n=div();n.className=r;n.setAttribute("data-state","hidden");n.setAttribute("tabindex","-1");var i=div();i.className=o;i.setAttribute("data-state","hidden");setContent(i,e.props);t.appendChild(n);n.appendChild(i);onUpdate(e.props,e.props);function onUpdate(n,r){var o=getChildren(t),i=o.box,a=o.content,s=o.arrow;r.theme?i.setAttribute("data-theme",r.theme):i.removeAttribute("data-theme");"string"===typeof r.animation?i.setAttribute("data-animation",r.animation):i.removeAttribute("data-animation");r.inertia?i.setAttribute("data-inertia",""):i.removeAttribute("data-inertia");i.style.maxWidth="number"===typeof r.maxWidth?r.maxWidth+"px":r.maxWidth;r.role?i.setAttribute("role",r.role):i.removeAttribute("role");n.content===r.content&&n.allowHTML===r.allowHTML||setContent(a,e.props);if(r.arrow)if(s){if(n.arrow!==r.arrow){i.removeChild(s);i.appendChild(createArrowElement(r.arrow))}}else i.appendChild(createArrowElement(r.arrow));else s&&i.removeChild(s)}return{popper:t,onUpdate:onUpdate}}render.$$tippy=true;var E=1;var w=[];var C=[];function createTippy(t,n){var r=evaluateProps(t,Object.assign({},h,getExtendedPassedProps(removeUndefinedProps(n))));var o;var i;var a;var s=false;var l=false;var d=false;var v=false;var g;var m;var y;var b=[];var T=debounce(onMouseMove,r.interactiveDebounce);var D;var O=E++;var A=null;var M=unique(r.plugins);var P={isEnabled:true,isVisible:false,isDestroyed:false,isMounted:false,isShown:false};var L={id:O,reference:t,popper:div(),popperInstance:A,props:r,state:P,plugins:M,clearDelayTimeouts:clearDelayTimeouts,setProps:setProps,setContent:setContent,show:show,hide:hide,hideWithInteractivity:hideWithInteractivity,enable:enable,disable:disable,unmount:unmount,destroy:destroy};if(!r.render){"production"!==process.env.NODE_ENV&&errorWhen(true,"render() function has not been supplied.");return L}var I=r.render(L),k=I.popper,R=I.onUpdate;k.setAttribute("data-tippy-root","");k.id="tippy-"+L.id;L.popper=k;t._tippy=L;k._tippy=L;var x=M.map((function(e){return e.fn(L)}));var S=t.hasAttribute("aria-expanded");addListeners();handleAriaExpandedAttribute();handleStyles();invokeHook("onCreate",[L]);r.showOnCreate&&scheduleShow();k.addEventListener("mouseenter",(function(){L.props.interactive&&L.state.isVisible&&L.clearDelayTimeouts()}));k.addEventListener("mouseleave",(function(){L.props.interactive&&L.props.trigger.indexOf("mouseenter")>=0&&getDocument().addEventListener("mousemove",T)}));return L;function getNormalizedTouchSettings(){var e=L.props.touch;return Array.isArray(e)?e:[e,0]}function getIsCustomTouchBehavior(){return"hold"===getNormalizedTouchSettings()[0]}function getIsDefaultRenderFn(){var e;return!!(null!=(e=L.props.render)&&e.$$tippy)}function getCurrentTarget(){return D||t}function getDocument(){var e=getCurrentTarget().parentNode;return e?getOwnerDocument(e):document}function getDefaultTemplateChildren(){return getChildren(k)}function getDelay(e){return L.state.isMounted&&!L.state.isVisible||p.isTouch||g&&"focus"===g.type?0:getValueAtIndexOrReturn(L.props.delay,e?0:1,h.delay)}function handleStyles(e){void 0===e&&(e=false);k.style.pointerEvents=L.props.interactive&&!e?"":"none";k.style.zIndex=""+L.props.zIndex}function invokeHook(e,t,n){void 0===n&&(n=true);x.forEach((function(n){n[e]&&n[e].apply(n,t)}));if(n){var r;(r=L.props)[e].apply(r,t)}}function handleAriaContentAttribute(){var e=L.props.aria;if(e.content){var n="aria-"+e.content;var r=k.id;var o=normalizeToArray(L.props.triggerTarget||t);o.forEach((function(e){var t=e.getAttribute(n);if(L.state.isVisible)e.setAttribute(n,t?t+" "+r:r);else{var o=t&&t.replace(r,"").trim();o?e.setAttribute(n,o):e.removeAttribute(n)}}))}}function handleAriaExpandedAttribute(){if(!S&&L.props.aria.expanded){var e=normalizeToArray(L.props.triggerTarget||t);e.forEach((function(e){L.props.interactive?e.setAttribute("aria-expanded",L.state.isVisible&&e===getCurrentTarget()?"true":"false"):e.removeAttribute("aria-expanded")}))}}function cleanupInteractiveMouseListeners(){getDocument().removeEventListener("mousemove",T);w=w.filter((function(e){return e!==T}))}function onDocumentPress(e){if(!p.isTouch||!d&&"mousedown"!==e.type){var n=e.composedPath&&e.composedPath()[0]||e.target;if(!L.props.interactive||!actualContains(k,n)){if(normalizeToArray(L.props.triggerTarget||t).some((function(e){return actualContains(e,n)}))){if(p.isTouch)return;if(L.state.isVisible&&L.props.trigger.indexOf("click")>=0)return}else invokeHook("onClickOutside",[L,e]);if(true===L.props.hideOnClick){L.clearDelayTimeouts();L.hide();l=true;setTimeout((function(){l=false}));L.state.isMounted||removeDocumentPress()}}}}function onTouchMove(){d=true}function onTouchStart(){d=false}function addDocumentPress(){var e=getDocument();e.addEventListener("mousedown",onDocumentPress,true);e.addEventListener("touchend",onDocumentPress,u);e.addEventListener("touchstart",onTouchStart,u);e.addEventListener("touchmove",onTouchMove,u)}function removeDocumentPress(){var e=getDocument();e.removeEventListener("mousedown",onDocumentPress,true);e.removeEventListener("touchend",onDocumentPress,u);e.removeEventListener("touchstart",onTouchStart,u);e.removeEventListener("touchmove",onTouchMove,u)}function onTransitionedOut(e,t){onTransitionEnd(e,(function(){!L.state.isVisible&&k.parentNode&&k.parentNode.contains(k)&&t()}))}function onTransitionedIn(e,t){onTransitionEnd(e,t)}function onTransitionEnd(e,t){var n=getDefaultTemplateChildren().box;function listener(e){if(e.target===n){updateTransitionEndListener(n,"remove",listener);t()}}if(0===e)return t();updateTransitionEndListener(n,"remove",m);updateTransitionEndListener(n,"add",listener);m=listener}function on(e,n,r){void 0===r&&(r=false);var o=normalizeToArray(L.props.triggerTarget||t);o.forEach((function(t){t.addEventListener(e,n,r);b.push({node:t,eventType:e,handler:n,options:r})}))}function addListeners(){if(getIsCustomTouchBehavior()){on("touchstart",onTrigger,{passive:true});on("touchend",onMouseLeave,{passive:true})}splitBySpaces(L.props.trigger).forEach((function(e){if("manual"!==e){on(e,onTrigger);switch(e){case"mouseenter":on("mouseleave",onMouseLeave);break;case"focus":on(f?"focusout":"blur",onBlurOrFocusOut);break;case"focusin":on("focusout",onBlurOrFocusOut);break}}}))}function removeListeners(){b.forEach((function(e){var t=e.node,n=e.eventType,r=e.handler,o=e.options;t.removeEventListener(n,r,o)}));b=[]}function onTrigger(e){var t;var n=false;if(L.state.isEnabled&&!isEventListenerStopped(e)&&!l){var r="focus"===(null==(t=g)?void 0:t.type);g=e;D=e.currentTarget;handleAriaExpandedAttribute();!L.state.isVisible&&isMouseEvent(e)&&w.forEach((function(t){return t(e)}));"click"===e.type&&(L.props.trigger.indexOf("mouseenter")<0||s)&&false!==L.props.hideOnClick&&L.state.isVisible?n=true:scheduleShow(e);"click"===e.type&&(s=!n);n&&!r&&scheduleHide(e)}}function onMouseMove(e){var t=e.target;var n=getCurrentTarget().contains(t)||k.contains(t);if("mousemove"!==e.type||!n){var o=getNestedPopperTree().concat(k).map((function(e){var t;var n=e._tippy;var o=null==(t=n.popperInstance)?void 0:t.state;return o?{popperRect:e.getBoundingClientRect(),popperState:o,props:r}:null})).filter(Boolean);if(isCursorOutsideInteractiveBorder(o,e)){cleanupInteractiveMouseListeners();scheduleHide(e)}}}function onMouseLeave(e){var t=isEventListenerStopped(e)||L.props.trigger.indexOf("click")>=0&&s;t||(L.props.interactive?L.hideWithInteractivity(e):scheduleHide(e))}function onBlurOrFocusOut(e){L.props.trigger.indexOf("focusin")<0&&e.target!==getCurrentTarget()||L.props.interactive&&e.relatedTarget&&k.contains(e.relatedTarget)||scheduleHide(e)}function isEventListenerStopped(e){return!!p.isTouch&&getIsCustomTouchBehavior()!==e.type.indexOf("touch")>=0}function createPopperInstance(){destroyPopperInstance();var n=L.props,r=n.popperOptions,o=n.placement,i=n.offset,a=n.getReferenceClientRect,s=n.moveTransition;var u=getIsDefaultRenderFn()?getChildren(k).arrow:null;var c=a?{getBoundingClientRect:a,contextElement:a.contextElement||getCurrentTarget()}:t;var p={name:"$$tippy",enabled:true,phase:"beforeWrite",requires:["computeStyles"],fn:function fn(e){var t=e.state;if(getIsDefaultRenderFn()){var n=getDefaultTemplateChildren(),r=n.box;["placement","reference-hidden","escaped"].forEach((function(e){"placement"===e?r.setAttribute("data-placement",t.placement):t.attributes.popper["data-popper-"+e]?r.setAttribute("data-"+e,""):r.removeAttribute("data-"+e)}));t.attributes.popper={}}}};var l=[{name:"offset",options:{offset:i}},{name:"preventOverflow",options:{padding:{top:2,bottom:2,left:5,right:5}}},{name:"flip",options:{padding:5}},{name:"computeStyles",options:{adaptive:!s}},p];getIsDefaultRenderFn()&&u&&l.push({name:"arrow",options:{element:u,padding:3}});l.push.apply(l,(null==r?void 0:r.modifiers)||[]);L.popperInstance=e(c,k,Object.assign({},r,{placement:o,onFirstUpdate:y,modifiers:l}))}function destroyPopperInstance(){if(L.popperInstance){L.popperInstance.destroy();L.popperInstance=null}}function mount(){var e=L.props.appendTo;var t;var n=getCurrentTarget();t=L.props.interactive&&e===c||"parent"===e?n.parentNode:invokeWithArgsOrReturn(e,[n]);t.contains(k)||t.appendChild(k);L.state.isMounted=true;createPopperInstance();"production"!==process.env.NODE_ENV&&warnWhen(L.props.interactive&&e===h.appendTo&&n.nextElementSibling!==k,["Interactive tippy element may not be accessible via keyboard","navigation because it is not directly after the reference element","in the DOM source order.","\n\n","Using a wrapper <div> or <span> tag around the reference element","solves this by creating a new parentNode context.","\n\n","Specifying `appendTo: document.body` silences this warning, but it","assumes you are using a focus management solution to handle","keyboard navigation.","\n\n","See: https://atomiks.github.io/tippyjs/v6/accessibility/#interactivity"].join(" "))}function getNestedPopperTree(){return arrayFrom(k.querySelectorAll("[data-tippy-root]"))}function scheduleShow(e){L.clearDelayTimeouts();e&&invokeHook("onTrigger",[L,e]);addDocumentPress();var t=getDelay(true);var n=getNormalizedTouchSettings(),r=n[0],i=n[1];p.isTouch&&"hold"===r&&i&&(t=i);t?o=setTimeout((function(){L.show()}),t):L.show()}function scheduleHide(e){L.clearDelayTimeouts();invokeHook("onUntrigger",[L,e]);if(L.state.isVisible){if(!(L.props.trigger.indexOf("mouseenter")>=0&&L.props.trigger.indexOf("click")>=0&&["mouseleave","mousemove"].indexOf(e.type)>=0&&s)){var t=getDelay(false);t?i=setTimeout((function(){L.state.isVisible&&L.hide()}),t):a=requestAnimationFrame((function(){L.hide()}))}}else removeDocumentPress()}function enable(){L.state.isEnabled=true}function disable(){L.hide();L.state.isEnabled=false}function clearDelayTimeouts(){clearTimeout(o);clearTimeout(i);cancelAnimationFrame(a)}function setProps(e){"production"!==process.env.NODE_ENV&&warnWhen(L.state.isDestroyed,createMemoryLeakWarning("setProps"));if(!L.state.isDestroyed){invokeHook("onBeforeUpdate",[L,e]);removeListeners();var n=L.props;var r=evaluateProps(t,Object.assign({},n,removeUndefinedProps(e),{ignoreAttributes:true}));L.props=r;addListeners();if(n.interactiveDebounce!==r.interactiveDebounce){cleanupInteractiveMouseListeners();T=debounce(onMouseMove,r.interactiveDebounce)}n.triggerTarget&&!r.triggerTarget?normalizeToArray(n.triggerTarget).forEach((function(e){e.removeAttribute("aria-expanded")})):r.triggerTarget&&t.removeAttribute("aria-expanded");handleAriaExpandedAttribute();handleStyles();R&&R(n,r);if(L.popperInstance){createPopperInstance();getNestedPopperTree().forEach((function(e){requestAnimationFrame(e._tippy.popperInstance.forceUpdate)}))}invokeHook("onAfterUpdate",[L,e])}}function setContent(e){L.setProps({content:e})}function show(){"production"!==process.env.NODE_ENV&&warnWhen(L.state.isDestroyed,createMemoryLeakWarning("show"));var e=L.state.isVisible;var t=L.state.isDestroyed;var n=!L.state.isEnabled;var r=p.isTouch&&!L.props.touch;var o=getValueAtIndexOrReturn(L.props.duration,0,h.duration);if(!(e||t||n||r)&&!getCurrentTarget().hasAttribute("disabled")){invokeHook("onShow",[L],false);if(false!==L.props.onShow(L)){L.state.isVisible=true;getIsDefaultRenderFn()&&(k.style.visibility="visible");handleStyles();addDocumentPress();L.state.isMounted||(k.style.transition="none");if(getIsDefaultRenderFn()){var i=getDefaultTemplateChildren(),a=i.box,s=i.content;setTransitionDuration([a,s],0)}y=function onFirstUpdate(){var e;if(L.state.isVisible&&!v){v=true;void k.offsetHeight;k.style.transition=L.props.moveTransition;if(getIsDefaultRenderFn()&&L.props.animation){var t=getDefaultTemplateChildren(),n=t.box,r=t.content;setTransitionDuration([n,r],o);setVisibilityState([n,r],"visible")}handleAriaContentAttribute();handleAriaExpandedAttribute();pushIfUnique(C,L);null==(e=L.popperInstance)?void 0:e.forceUpdate();invokeHook("onMount",[L]);L.props.animation&&getIsDefaultRenderFn()&&onTransitionedIn(o,(function(){L.state.isShown=true;invokeHook("onShown",[L])}))}};mount()}}}function hide(){"production"!==process.env.NODE_ENV&&warnWhen(L.state.isDestroyed,createMemoryLeakWarning("hide"));var e=!L.state.isVisible;var t=L.state.isDestroyed;var n=!L.state.isEnabled;var r=getValueAtIndexOrReturn(L.props.duration,1,h.duration);if(!(e||t||n)){invokeHook("onHide",[L],false);if(false!==L.props.onHide(L)){L.state.isVisible=false;L.state.isShown=false;v=false;s=false;getIsDefaultRenderFn()&&(k.style.visibility="hidden");cleanupInteractiveMouseListeners();removeDocumentPress();handleStyles(true);if(getIsDefaultRenderFn()){var o=getDefaultTemplateChildren(),i=o.box,a=o.content;if(L.props.animation){setTransitionDuration([i,a],r);setVisibilityState([i,a],"hidden")}}handleAriaContentAttribute();handleAriaExpandedAttribute();L.props.animation?getIsDefaultRenderFn()&&onTransitionedOut(r,L.unmount):L.unmount()}}}function hideWithInteractivity(e){"production"!==process.env.NODE_ENV&&warnWhen(L.state.isDestroyed,createMemoryLeakWarning("hideWithInteractivity"));getDocument().addEventListener("mousemove",T);pushIfUnique(w,T);T(e)}function unmount(){"production"!==process.env.NODE_ENV&&warnWhen(L.state.isDestroyed,createMemoryLeakWarning("unmount"));L.state.isVisible&&L.hide();if(L.state.isMounted){destroyPopperInstance();getNestedPopperTree().forEach((function(e){e._tippy.unmount()}));k.parentNode&&k.parentNode.removeChild(k);C=C.filter((function(e){return e!==L}));L.state.isMounted=false;invokeHook("onHidden",[L])}}function destroy(){"production"!==process.env.NODE_ENV&&warnWhen(L.state.isDestroyed,createMemoryLeakWarning("destroy"));if(!L.state.isDestroyed){L.clearDelayTimeouts();L.unmount();removeListeners();delete t._tippy;L.state.isDestroyed=true;invokeHook("onDestroy",[L])}}}function tippy(e,t){void 0===t&&(t={});var n=h.plugins.concat(t.plugins||[]);if("production"!==process.env.NODE_ENV){validateTargets(e);validateProps(t,n)}bindGlobalEventListeners();var r=Object.assign({},t,{plugins:n});var o=getArrayOfElements(e);if("production"!==process.env.NODE_ENV){var i=isElement(r.content);var a=o.length>1;warnWhen(i&&a,["tippy() was passed an Element as the `content` prop, but more than","one tippy instance was created by this invocation. This means the","content element will only be appended to the last tippy instance.","\n\n","Instead, pass the .innerHTML of the element, or use a function that","returns a cloned version of the element instead.","\n\n","1) content: element.innerHTML\n","2) content: () => element.cloneNode(true)"].join(" "))}var s=o.reduce((function(e,t){var n=t&&createTippy(t,r);n&&e.push(n);return e}),[]);return isElement(e)?s[0]:s}tippy.defaultProps=h;tippy.setDefaultProps=b;tippy.currentInput=p;var D=function hideAll(e){var t=void 0===e?{}:e,n=t.exclude,r=t.duration;C.forEach((function(e){var t=false;n&&(t=isReferenceElement(n)?e.reference===n:e.popper===n.popper);if(!t){var o=e.props.duration;e.setProps({duration:r});e.hide();e.state.isDestroyed||e.setProps({duration:o})}}))};var O=Object.assign({},t,{effect:function effect(e){var t=e.state;var n={popper:{position:t.options.strategy,left:"0",top:"0",margin:"0"},arrow:{position:"absolute"},reference:{}};Object.assign(t.elements.popper.style,n.popper);t.styles=n;t.elements.arrow&&Object.assign(t.elements.arrow.style,n.arrow)}});var A=function createSingleton(e,t){var n;void 0===t&&(t={});"production"!==process.env.NODE_ENV&&errorWhen(!Array.isArray(e),["The first argument passed to createSingleton() must be an array of","tippy instances. The passed value was",String(e)].join(" "));var r=e;var o=[];var i=[];var a;var s=t.overrides;var u=[];var c=false;function setTriggerTargets(){i=r.map((function(e){return normalizeToArray(e.props.triggerTarget||e.reference)})).reduce((function(e,t){return e.concat(t)}),[])}function setReferences(){o=r.map((function(e){return e.reference}))}function enableInstances(e){r.forEach((function(t){e?t.enable():t.disable()}))}function interceptSetProps(e){return r.map((function(t){var n=t.setProps;t.setProps=function(r){n(r);t.reference===a&&e.setProps(r)};return function(){t.setProps=n}}))}function prepareInstance(e,t){var n=i.indexOf(t);if(t!==a){a=t;var u=(s||[]).concat("content").reduce((function(e,t){e[t]=r[n].props[t];return e}),{});e.setProps(Object.assign({},u,{getReferenceClientRect:"function"===typeof u.getReferenceClientRect?u.getReferenceClientRect:function(){var e;return null==(e=o[n])?void 0:e.getBoundingClientRect()}}))}}enableInstances(false);setReferences();setTriggerTargets();var p={fn:function fn(){return{onDestroy:function onDestroy(){enableInstances(true)},onHidden:function onHidden(){a=null},onClickOutside:function onClickOutside(e){if(e.props.showOnCreate&&!c){c=true;a=null}},onShow:function onShow(e){if(e.props.showOnCreate&&!c){c=true;prepareInstance(e,o[0])}},onTrigger:function onTrigger(e,t){prepareInstance(e,t.currentTarget)}}}};var l=tippy(div(),Object.assign({},removeProperties(t,["overrides"]),{plugins:[p].concat(t.plugins||[]),triggerTarget:i,popperOptions:Object.assign({},t.popperOptions,{modifiers:[].concat((null==(n=t.popperOptions)?void 0:n.modifiers)||[],[O])})}));var d=l.show;l.show=function(e){d();if(!a&&null==e)return prepareInstance(l,o[0]);if(!a||null!=e){if("number"===typeof e)return o[e]&&prepareInstance(l,o[e]);if(r.indexOf(e)>=0){var t=e.reference;return prepareInstance(l,t)}return o.indexOf(e)>=0?prepareInstance(l,e):void 0}};l.showNext=function(){var e=o[0];if(!a)return l.show(0);var t=o.indexOf(a);l.show(o[t+1]||e)};l.showPrevious=function(){var e=o[o.length-1];if(!a)return l.show(e);var t=o.indexOf(a);var n=o[t-1]||e;l.show(n)};var f=l.setProps;l.setProps=function(e){s=e.overrides||s;f(e)};l.setInstances=function(e){enableInstances(true);u.forEach((function(e){return e()}));r=e;enableInstances(false);setReferences();setTriggerTargets();u=interceptSetProps(l);l.setProps({triggerTarget:i})};u=interceptSetProps(l);return l};var M={mouseover:"mouseenter",focusin:"focus",click:"click"};function delegate(e,t){"production"!==process.env.NODE_ENV&&errorWhen(!(t&&t.target),["You must specity a `target` prop indicating a CSS selector string matching","the target elements that should receive a tippy."].join(" "));var n=[];var r=[];var o=false;var i=t.target;var a=removeProperties(t,["target"]);var s=Object.assign({},a,{trigger:"manual",touch:false});var c=Object.assign({touch:h.touch},a,{showOnCreate:true});var p=tippy(e,s);var l=normalizeToArray(p);function onTrigger(e){if(e.target&&!o){var n=e.target.closest(i);if(n){var a=n.getAttribute("data-tippy-trigger")||t.trigger||h.trigger;if(!n._tippy&&("touchstart"!==e.type||"boolean"!==typeof c.touch)&&!("touchstart"!==e.type&&a.indexOf(M[e.type])<0)){var s=tippy(n,c);s&&(r=r.concat(s))}}}}function on(e,t,r,o){void 0===o&&(o=false);e.addEventListener(t,r,o);n.push({node:e,eventType:t,handler:r,options:o})}function addEventListeners(e){var t=e.reference;on(t,"touchstart",onTrigger,u);on(t,"mouseover",onTrigger);on(t,"focusin",onTrigger);on(t,"click",onTrigger)}function removeEventListeners(){n.forEach((function(e){var t=e.node,n=e.eventType,r=e.handler,o=e.options;t.removeEventListener(n,r,o)}));n=[]}function applyMutations(e){var t=e.destroy;var n=e.enable;var i=e.disable;e.destroy=function(e){void 0===e&&(e=true);e&&r.forEach((function(e){e.destroy()}));r=[];removeEventListeners();t()};e.enable=function(){n();r.forEach((function(e){return e.enable()}));o=false};e.disable=function(){i();r.forEach((function(e){return e.disable()}));o=true};addEventListeners(e)}l.forEach(applyMutations);return p}var P={name:"animateFill",defaultValue:false,fn:function fn(e){var t;if(!(null!=(t=e.props.render)&&t.$$tippy)){"production"!==process.env.NODE_ENV&&errorWhen(e.props.animateFill,"The `animateFill` plugin requires the default render function.");return{}}var n=getChildren(e.popper),r=n.box,o=n.content;var i=e.props.animateFill?createBackdropElement():null;return{onCreate:function onCreate(){if(i){r.insertBefore(i,r.firstElementChild);r.setAttribute("data-animatefill","");r.style.overflow="hidden";e.setProps({arrow:false,animation:"shift-away"})}},onMount:function onMount(){if(i){var e=r.style.transitionDuration;var t=Number(e.replace("ms",""));o.style.transitionDelay=Math.round(t/10)+"ms";i.style.transitionDuration=e;setVisibilityState([i],"visible")}},onShow:function onShow(){i&&(i.style.transitionDuration="0ms")},onHide:function onHide(){i&&setVisibilityState([i],"hidden")}}}};function createBackdropElement(){var e=div();e.className=i;setVisibilityState([e],"hidden");return e}var L={clientX:0,clientY:0};var I=[];function storeMouseCoords(e){var t=e.clientX,n=e.clientY;L={clientX:t,clientY:n}}function addMouseCoordsListener(e){e.addEventListener("mousemove",storeMouseCoords)}function removeMouseCoordsListener(e){e.removeEventListener("mousemove",storeMouseCoords)}var k={name:"followCursor",defaultValue:false,fn:function fn(e){var t=e.reference;var n=getOwnerDocument(e.props.triggerTarget||t);var r=false;var o=false;var i=true;var a=e.props;function getIsInitialBehavior(){return"initial"===e.props.followCursor&&e.state.isVisible}function addListener(){n.addEventListener("mousemove",onMouseMove)}function removeListener(){n.removeEventListener("mousemove",onMouseMove)}function unsetGetReferenceClientRect(){r=true;e.setProps({getReferenceClientRect:null});r=false}function onMouseMove(n){var r=!n.target||t.contains(n.target);var o=e.props.followCursor;var i=n.clientX,a=n.clientY;var s=t.getBoundingClientRect();var u=i-s.left;var c=a-s.top;!r&&e.props.interactive||e.setProps({getReferenceClientRect:function getReferenceClientRect(){var e=t.getBoundingClientRect();var n=i;var r=a;if("initial"===o){n=e.left+u;r=e.top+c}var s="horizontal"===o?e.top:r;var p="vertical"===o?e.right:n;var l="horizontal"===o?e.bottom:r;var d="vertical"===o?e.left:n;return{width:p-d,height:l-s,top:s,right:p,bottom:l,left:d}}})}function create(){if(e.props.followCursor){I.push({instance:e,doc:n});addMouseCoordsListener(n)}}function destroy(){I=I.filter((function(t){return t.instance!==e}));0===I.filter((function(e){return e.doc===n})).length&&removeMouseCoordsListener(n)}return{onCreate:create,onDestroy:destroy,onBeforeUpdate:function onBeforeUpdate(){a=e.props},onAfterUpdate:function onAfterUpdate(t,n){var i=n.followCursor;if(!r&&void 0!==i&&a.followCursor!==i){destroy();if(i){create();!e.state.isMounted||o||getIsInitialBehavior()||addListener()}else{removeListener();unsetGetReferenceClientRect()}}},onMount:function onMount(){if(e.props.followCursor&&!o){if(i){onMouseMove(L);i=false}getIsInitialBehavior()||addListener()}},onTrigger:function onTrigger(e,t){isMouseEvent(t)&&(L={clientX:t.clientX,clientY:t.clientY});o="focus"===t.type},onHidden:function onHidden(){if(e.props.followCursor){unsetGetReferenceClientRect();removeListener();i=true}}}}};function getProps(e,t){var n;return{popperOptions:Object.assign({},e.popperOptions,{modifiers:[].concat(((null==(n=e.popperOptions)?void 0:n.modifiers)||[]).filter((function(e){var n=e.name;return n!==t.name})),[t])})}}var R={name:"inlinePositioning",defaultValue:false,fn:function fn(e){var t=e.reference;function isEnabled(){return!!e.props.inlinePositioning}var n;var r=-1;var o=false;var i=[];var a={name:"tippyInlinePositioning",enabled:true,phase:"afterWrite",fn:function fn(t){var r=t.state;if(isEnabled()){-1!==i.indexOf(r.placement)&&(i=[]);if(n!==r.placement&&-1===i.indexOf(r.placement)){i.push(r.placement);e.setProps({getReferenceClientRect:function getReferenceClientRect(){return _getReferenceClientRect(r.placement)}})}n=r.placement}}};function _getReferenceClientRect(e){return getInlineBoundingClientRect(getBasePlacement(e),t.getBoundingClientRect(),arrayFrom(t.getClientRects()),r)}function setInternalProps(t){o=true;e.setProps(t);o=false}function addModifier(){o||setInternalProps(getProps(e.props,a))}return{onCreate:addModifier,onAfterUpdate:addModifier,onTrigger:function onTrigger(t,n){if(isMouseEvent(n)){var o=arrayFrom(e.reference.getClientRects());var i=o.find((function(e){return e.left-2<=n.clientX&&e.right+2>=n.clientX&&e.top-2<=n.clientY&&e.bottom+2>=n.clientY}));var a=o.indexOf(i);r=a>-1?a:r}},onHidden:function onHidden(){r=-1}}}};function getInlineBoundingClientRect(e,t,n,r){if(n.length<2||null===e)return t;if(2===n.length&&r>=0&&n[0].left>n[1].right)return n[r]||t;switch(e){case"top":case"bottom":var o=n[0];var i=n[n.length-1];var a="top"===e;var s=o.top;var u=i.bottom;var c=a?o.left:i.left;var p=a?o.right:i.right;var l=p-c;var d=u-s;return{top:s,bottom:u,left:c,right:p,width:l,height:d};case"left":case"right":var f=Math.min.apply(Math,n.map((function(e){return e.left})));var v=Math.max.apply(Math,n.map((function(e){return e.right})));var g=n.filter((function(t){return"left"===e?t.left===f:t.right===v}));var m=g[0].top;var h=g[g.length-1].bottom;var y=f;var b=v;var T=b-y;var E=h-m;return{top:m,bottom:h,left:y,right:b,width:T,height:E};default:return t}}var x={name:"sticky",defaultValue:false,fn:function fn(e){var t=e.reference,n=e.popper;function getReference(){return e.popperInstance?e.popperInstance.state.elements.reference:t}function shouldCheck(t){return true===e.props.sticky||e.props.sticky===t}var r=null;var o=null;function updatePosition(){var t=shouldCheck("reference")?getReference().getBoundingClientRect():null;var i=shouldCheck("popper")?n.getBoundingClientRect():null;(t&&areRectsDifferent(r,t)||i&&areRectsDifferent(o,i))&&e.popperInstance&&e.popperInstance.update();r=t;o=i;e.state.isMounted&&requestAnimationFrame(updatePosition)}return{onMount:function onMount(){e.props.sticky&&updatePosition()}}}};function areRectsDifferent(e,t){return!e||!t||(e.top!==t.top||e.right!==t.right||e.bottom!==t.bottom||e.left!==t.left)}tippy.setDefaultProps({render:render});export{P as animateFill,A as createSingleton,tippy as default,delegate,k as followCursor,D as hideAll,R as inlinePositioning,n as roundArrow,x as sticky};
