// dayjs/plugin/utc@1.11.13 downloaded from https://ga.jspm.io/npm:dayjs@1.11.13/plugin/utc.js

var t=typeof globalThis!=="undefined"?globalThis:typeof self!=="undefined"?self:global;var i={};!function(t,s){i=s()}(0,(function(){var i="minute",s=/[+-]\d\d(?::?\d\d)?/g,e=/([+-]|\d\d)/g;return function(f,n,r){var u=n.prototype;r.utc=function(t){var i={date:t,utc:!0,args:arguments};return new n(i)},u.utc=function(s){var e=r(this.toDate(),{locale:(this||t).$L,utc:!0});return s?e.add(this.utcOffset(),i):e},u.local=function(){return r(this.toDate(),{locale:(this||t).$L,utc:!1})};var a=u.parse;u.parse=function(i){i.utc&&((this||t).$u=!0),this.$utils().u(i.$offset)||((this||t).$offset=i.$offset),a.call(this||t,i)};var o=u.init;u.init=function(){if((this||t).$u){var i=(this||t).$d;(this||t).$y=i.getUTCFullYear(),(this||t).$M=i.getUTCMonth(),(this||t).$D=i.getUTCDate(),(this||t).$W=i.getUTCDay(),(this||t).$H=i.getUTCHours(),(this||t).$m=i.getUTCMinutes(),(this||t).$s=i.getUTCSeconds(),(this||t).$ms=i.getUTCMilliseconds()}else o.call(this||t)};var h=u.utcOffset;u.utcOffset=function(f,n){var r=this.$utils().u;if(r(f))return(this||t).$u?0:r((this||t).$offset)?h.call(this||t):(this||t).$offset;if("string"==typeof f&&(f=function(t){void 0===t&&(t="");var i=t.match(s);if(!i)return null;var f=(""+i[0]).match(e)||["-",0,0],n=f[0],r=60*+f[1]+ +f[2];return 0===r?0:"+"===n?r:-r}(f),null===f))return this||t;var u=Math.abs(f)<=16?60*f:f,a=this||t;if(n)return a.$offset=u,a.$u=0===f,a;if(0!==f){var o=(this||t).$u?this.toDate().getTimezoneOffset():-1*this.utcOffset();(a=this.local().add(u+o,i)).$offset=u,a.$x.$localOffset=o}else a=this.utc();return a};var l=u.format;u.format=function(i){var s=i||((this||t).$u?"YYYY-MM-DDTHH:mm:ss[Z]":"");return l.call(this||t,s)},u.valueOf=function(){var i=this.$utils().u((this||t).$offset)?0:(this||t).$offset+((this||t).$x.$localOffset||(this||t).$d.getTimezoneOffset());return(this||t).$d.valueOf()-6e4*i},u.isUTC=function(){return!!(this||t).$u},u.toISOString=function(){return this.toDate().toISOString()},u.toString=function(){return this.toDate().toUTCString()};var c=u.toDate;u.toDate=function(i){return"s"===i&&(this||t).$offset?r(this.format("YYYY-MM-DD HH:mm:ss:SSS")).toDate():c.call(this||t)};var $=u.diff;u.diff=function(i,s,e){if(i&&(this||t).$u===i.$u)return $.call(this||t,i,s,e);var f=this.local(),n=r(i).local();return $.call(f,n,s,e)}}}));var s=i;export{s as default};

