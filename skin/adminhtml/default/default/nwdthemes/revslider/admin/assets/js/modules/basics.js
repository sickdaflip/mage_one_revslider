/*!
 * REVOLUTION 6.0.0 UTILS - BUILDER BASIC JS
 * @version: 1.0 (01.07.2019)
 * @author ThemePunch
*/

(function(jQuery) {

/**********************************
	-	GLOBAL VARIABLES	-
**********************************/
;window.RVS = window.RVS === undefined ? {} : window.RVS;
RVS.F = RVS.F === undefined ? {} : RVS.F;
RVS.ENV = RVS.ENV === undefined ? {} : RVS.ENV;
RVS.LIB = RVS.LIB === undefined ? {} : RVS.LIB;
RVS.V = RVS.V === undefined ? {} : RVS.V;
RVS.S = RVS.S === undefined ? {} : RVS.S;
RVS.C = RVS.C === undefined ? {} : RVS.C;
RVS.WIN = RVS.WIN === undefined ? jQuery(window) : RVS.WIN;
RVS.DOC = RVS.DOC === undefined ? jQuery(document) : RVS.DOC;



/* perfect scrollbar jquery plugin */
if(!jQuery.fn.RSScroll) {
	jQuery.fn.RSScroll = function(v, y) {

		if(!v || typeof v !== 'string') {
			return this.each(function(i) {
				var $this = jQuery(this),
					ps = $this.data('revsliderps');
				if(!ps) $this.data('revsliderps', new RSPerfectScrollbar(this, v || {}));
			});
		}
		else {
			switch(v) {
				case 'update':
					return this.each(function() {
						var ps = jQuery(this).data('revsliderps');
						if(ps) ps.update();
					});
				break;
				case 'scrollTop':
					return this.each(function() {
						this.scrollTop = y;
					});
				break;
				case 'destroy':
					return this.each(function() {
						var $this = jQuery(this),
							ps = $this.data('revsliderps');
						if(ps) {
							ps.destroy();
							$this.removeData('revsliderps');
						}
					});
				break;
			}
		}
	};
}


/*!
 * perfect-scrollbar v1.4.0
 * (c) 2018 Hyunje Jun
 * @license MIT
 */
!function(t,e){"object"==typeof exports&&"undefined"!=typeof module?module.exports=e():"function"==typeof define&&define.amd?define(e):t.RSPerfectScrollbar=e()}(this,function(){"use strict";function t(t){return getComputedStyle(t)}function e(t,e){for(var i in e)if(e.hasOwnProperty(i)){var r=e[i];"number"==typeof r&&(r+="px"),t.style[i]=r}return t}function i(t){var e=document.createElement("div");return e.className=t,e}function r(t,e){if(!v)throw new Error("No element matching method supported");return v.call(t,e)}function l(t){t.remove?t.remove():t.parentNode&&t.parentNode.removeChild(t)}function n(t,e){return Array.prototype.filter.call(t.children,function(t){return r(t,e)})}function o(t,e){var i=t.element.classList,r=m.state.scrolling(e);i.contains(r)?clearTimeout(Y[e]):i.add(r)}function s(t,e){Y[e]=setTimeout(function(){return t.isAlive&&t.element.classList.remove(m.state.scrolling(e))},t.settings.scrollingThreshold)}function a(t,e){o(t,e),s(t,e)}function c(t){if("function"==typeof window.CustomEvent)return new CustomEvent(t);var e=document.createEvent("CustomEvent");return e.initCustomEvent(t,!1,!1,void 0),e}function h(t,e,i,r,l){var n=i[0],o=i[1],s=i[2],h=i[3],u=i[4],d=i[5];void 0===r&&(r=!0),void 0===l&&(l=!1);var f=t.element;t.reach[h]=null,f[s]<1&&(t.reach[h]="start"),f[s]>t[n]-t[o]-1&&(t.reach[h]="end"),e&&(f.dispatchEvent(c("ps-scroll-"+h)),e<0?f.dispatchEvent(c("ps-scroll-"+u)):e>0&&f.dispatchEvent(c("ps-scroll-"+d)),r&&a(t,h)),t.reach[h]&&(e||l)&&f.dispatchEvent(c("ps-"+h+"-reach-"+t.reach[h]))}function u(t){return parseInt(t,10)||0}function d(t){return r(t,"input,[contenteditable]")||r(t,"select,[contenteditable]")||r(t,"textarea,[contenteditable]")||r(t,"button,[contenteditable]")}function f(e){var i=t(e);return u(i.width)+u(i.paddingLeft)+u(i.paddingRight)+u(i.borderLeftWidth)+u(i.borderRightWidth)}function p(t,e){return t.settings.minScrollbarLength&&(e=Math.max(e,t.settings.minScrollbarLength)),t.settings.maxScrollbarLength&&(e=Math.min(e,t.settings.maxScrollbarLength)),e}function b(t,i){var r={width:i.railXWidth},l=Math.floor(t.scrollTop);i.isRtl?r.left=i.negativeScrollAdjustment+t.scrollLeft+i.containerWidth-i.contentWidth:r.left=t.scrollLeft,i.isScrollbarXUsingBottom?r.bottom=i.scrollbarXBottom-l:r.top=i.scrollbarXTop+l,e(i.scrollbarXRail,r);var n={top:l,height:i.railYHeight};i.isScrollbarYUsingRight?i.isRtl?n.right=i.contentWidth-(i.negativeScrollAdjustment+t.scrollLeft)-i.scrollbarYRight-i.scrollbarYOuterWidth:n.right=i.scrollbarYRight-t.scrollLeft:i.isRtl?n.left=i.negativeScrollAdjustment+t.scrollLeft+2*i.containerWidth-i.contentWidth-i.scrollbarYLeft-i.scrollbarYOuterWidth:n.left=i.scrollbarYLeft+t.scrollLeft,e(i.scrollbarYRail,n),e(i.scrollbarX,{left:i.scrollbarXLeft,width:i.scrollbarXWidth-i.railBorderXWidth}),e(i.scrollbarY,{top:i.scrollbarYTop,height:i.scrollbarYHeight-i.railBorderYWidth})}function g(t,e){function i(e){b[d]=g+Y*(e[a]-v),o(t,f),R(t),e.stopPropagation(),e.preventDefault()}function r(){s(t,f),t[p].classList.remove(m.state.clicking),t.event.unbind(t.ownerDocument,"mousemove",i)}var l=e[0],n=e[1],a=e[2],c=e[3],h=e[4],u=e[5],d=e[6],f=e[7],p=e[8],b=t.element,g=null,v=null,Y=null;t.event.bind(t[h],"mousedown",function(e){g=b[d],v=e[a],Y=(t[n]-t[l])/(t[c]-t[u]),t.event.bind(t.ownerDocument,"mousemove",i),t.event.once(t.ownerDocument,"mouseup",r),t[p].classList.add(m.state.clicking),e.stopPropagation(),e.preventDefault()})}var v="undefined"!=typeof Element&&(Element.prototype.matches||Element.prototype.webkitMatchesSelector||Element.prototype.mozMatchesSelector||Element.prototype.msMatchesSelector),m={main:"ps",element:{thumb:function(t){return"rs__scrollbar-"+t},rail:function(t){return"rs__scrollbar-"+t+"-rail"},consuming:"ps__child--consume"},state:{focus:"ps--focus",clicking:"ps--clicking",active:function(t){return"ps--active-"+t},scrolling:function(t){return"ps--scrolling-"+t}}},Y={x:null,y:null},X=function(t){this.element=t,this.handlers={}},w={isEmpty:{configurable:!0}};X.prototype.bind=function(t,e){void 0===this.handlers[t]&&(this.handlers[t]=[]),this.handlers[t].push(e),this.element.addEventListener(t,e,!1)},X.prototype.unbind=function(t,e){var i=this;this.handlers[t]=this.handlers[t].filter(function(r){return!(!e||r===e)||(i.element.removeEventListener(t,r,!1),!1)})},X.prototype.unbindAll=function(){var t=this;for(var e in t.handlers)if(t.handlers.hasOwnProperty(e))t.unbind(e)},w.isEmpty.get=function(){var t=this;return Object.keys(this.handlers).every(function(e){return 0===t.handlers[e].length})},Object.defineProperties(X.prototype,w);var y=function(){this.eventElements=[]};y.prototype.eventElement=function(t){var e=this.eventElements.filter(function(e){return e.element===t})[0];return e||(e=new X(t),this.eventElements.push(e)),e},y.prototype.bind=function(t,e,i){this.eventElement(t).bind(e,i)},y.prototype.unbind=function(t,e,i){var r=this.eventElement(t);r.unbind(e,i),r.isEmpty&&this.eventElements.splice(this.eventElements.indexOf(r),1)},y.prototype.unbindAll=function(){this.eventElements.forEach(function(t){return t.unbindAll()}),this.eventElements=[]},y.prototype.once=function(t,e,i){var r=this.eventElement(t),l=function(t){r.unbind(e,l),i(t)};r.bind(e,l)};var W=function(t,e,i,r,l){void 0===r&&(r=!0),void 0===l&&(l=!1);var n;if("top"===e)n=["contentHeight","containerHeight","scrollTop","y","up","down"];else{if("left"!==e)throw new Error("A proper axis should be provided");n=["contentWidth","containerWidth","scrollLeft","x","left","right"]}h(t,i,n,r,l)},L={isWebKit:"undefined"!=typeof document&&"WebkitAppearance"in document.documentElement.style,supportsTouch:"undefined"!=typeof window&&("ontouchstart"in window||window.DocumentTouch&&document instanceof window.DocumentTouch),supportsIePointer:"undefined"!=typeof navigator&&navigator.msMaxTouchPoints,isChrome:"undefined"!=typeof navigator&&/Chrome/i.test(navigator&&navigator.userAgent)},R=function(t){var e=t.element,i=Math.floor(e.scrollTop);t.containerWidth=e.clientWidth,t.containerHeight=e.clientHeight,t.contentWidth=e.scrollWidth,t.contentHeight=e.scrollHeight,e.contains(t.scrollbarXRail)||(n(e,m.element.rail("x")).forEach(function(t){return l(t)}),e.appendChild(t.scrollbarXRail)),e.contains(t.scrollbarYRail)||(n(e,m.element.rail("y")).forEach(function(t){return l(t)}),e.appendChild(t.scrollbarYRail)),!t.settings.suppressScrollX&&t.containerWidth+t.settings.scrollXMarginOffset<t.contentWidth?(t.scrollbarXActive=!0,t.railXWidth=t.containerWidth-t.railXMarginWidth,t.railXRatio=t.containerWidth/t.railXWidth,t.scrollbarXWidth=p(t,u(t.railXWidth*t.containerWidth/t.contentWidth)),t.scrollbarXLeft=u((t.negativeScrollAdjustment+e.scrollLeft)*(t.railXWidth-t.scrollbarXWidth)/(t.contentWidth-t.containerWidth))):t.scrollbarXActive=!1,!t.settings.suppressScrollY&&t.containerHeight+t.settings.scrollYMarginOffset<t.contentHeight?(t.scrollbarYActive=!0,t.railYHeight=t.containerHeight-t.railYMarginHeight,t.railYRatio=t.containerHeight/t.railYHeight,t.scrollbarYHeight=p(t,u(t.railYHeight*t.containerHeight/t.contentHeight)),t.scrollbarYTop=u(i*(t.railYHeight-t.scrollbarYHeight)/(t.contentHeight-t.containerHeight))):t.scrollbarYActive=!1,t.scrollbarXLeft>=t.railXWidth-t.scrollbarXWidth&&(t.scrollbarXLeft=t.railXWidth-t.scrollbarXWidth),t.scrollbarYTop>=t.railYHeight-t.scrollbarYHeight&&(t.scrollbarYTop=t.railYHeight-t.scrollbarYHeight),b(e,t),t.scrollbarXActive?e.classList.add(m.state.active("x")):(e.classList.remove(m.state.active("x")),t.scrollbarXWidth=0,t.scrollbarXLeft=0,e.scrollLeft=0),t.scrollbarYActive?e.classList.add(m.state.active("y")):(e.classList.remove(m.state.active("y")),t.scrollbarYHeight=0,t.scrollbarYTop=0,e.scrollTop=0)},T={"click-rail":function(t){t.event.bind(t.scrollbarY,"mousedown",function(t){return t.stopPropagation()}),t.event.bind(t.scrollbarYRail,"mousedown",function(e){var i=e.pageY-window.pageYOffset-t.scrollbarYRail.getBoundingClientRect().top>t.scrollbarYTop?1:-1;t.element.scrollTop+=i*t.containerHeight,R(t),e.stopPropagation()}),t.event.bind(t.scrollbarX,"mousedown",function(t){return t.stopPropagation()}),t.event.bind(t.scrollbarXRail,"mousedown",function(e){var i=e.pageX-window.pageXOffset-t.scrollbarXRail.getBoundingClientRect().left>t.scrollbarXLeft?1:-1;t.element.scrollLeft+=i*t.containerWidth,R(t),e.stopPropagation()})},"drag-thumb":function(t){g(t,["containerWidth","contentWidth","pageX","railXWidth","scrollbarX","scrollbarXWidth","scrollLeft","x","scrollbarXRail"]),g(t,["containerHeight","contentHeight","pageY","railYHeight","scrollbarY","scrollbarYHeight","scrollTop","y","scrollbarYRail"])},keyboard:function(t){function e(e,r){var l=Math.floor(i.scrollTop);if(0===e){if(!t.scrollbarYActive)return!1;if(0===l&&r>0||l>=t.contentHeight-t.containerHeight&&r<0)return!t.settings.wheelPropagation}var n=i.scrollLeft;if(0===r){if(!t.scrollbarXActive)return!1;if(0===n&&e<0||n>=t.contentWidth-t.containerWidth&&e>0)return!t.settings.wheelPropagation}return!0}var i=t.element,l=function(){return r(i,":hover")},n=function(){return r(t.scrollbarX,":focus")||r(t.scrollbarY,":focus")};t.event.bind(t.ownerDocument,"keydown",function(r){if(!(r.isDefaultPrevented&&r.isDefaultPrevented()||r.defaultPrevented)&&(l()||n())){var o=document.activeElement?document.activeElement:t.ownerDocument.activeElement;if(o){if("IFRAME"===o.tagName)o=o.contentDocument.activeElement;else for(;o.shadowRoot;)o=o.shadowRoot.activeElement;if(d(o))return}var s=0,a=0;switch(r.which){case 37:s=r.metaKey?-t.contentWidth:r.altKey?-t.containerWidth:-30;break;case 38:a=r.metaKey?t.contentHeight:r.altKey?t.containerHeight:30;break;case 39:s=r.metaKey?t.contentWidth:r.altKey?t.containerWidth:30;break;case 40:a=r.metaKey?-t.contentHeight:r.altKey?-t.containerHeight:-30;break;case 32:a=r.shiftKey?t.containerHeight:-t.containerHeight;break;case 33:a=t.containerHeight;break;case 34:a=-t.containerHeight;break;case 36:a=t.contentHeight;break;case 35:a=-t.contentHeight;break;default:return}t.settings.suppressScrollX&&0!==s||t.settings.suppressScrollY&&0!==a||(i.scrollTop-=a,i.scrollLeft+=s,R(t),e(s,a)&&r.preventDefault())}})},wheel:function(e){function i(t,i){var r=Math.floor(o.scrollTop),l=0===o.scrollTop,n=r+o.offsetHeight===o.scrollHeight,s=0===o.scrollLeft,a=o.scrollLeft+o.offsetWidth===o.scrollWidth;return!(Math.abs(i)>Math.abs(t)?l||n:s||a)||!e.settings.wheelPropagation}function r(t){var e=t.deltaX,i=-1*t.deltaY;return void 0!==e&&void 0!==i||(e=-1*t.wheelDeltaX/6,i=t.wheelDeltaY/6),t.deltaMode&&1===t.deltaMode&&(e*=10,i*=10),e!==e&&i!==i&&(e=0,i=t.wheelDelta),t.shiftKey?[-i,-e]:[e,i]}function l(e,i,r){if(!L.isWebKit&&o.querySelector("select:focus"))return!0;if(!o.contains(e))return!1;for(var l=e;l&&l!==o;){if(l.classList.contains(m.element.consuming))return!0;var n=t(l);if([n.overflow,n.overflowX,n.overflowY].join("").match(/(scroll|auto)/)){var s=l.scrollHeight-l.clientHeight;if(s>0&&!(0===l.scrollTop&&r>0||l.scrollTop===s&&r<0))return!0;var a=l.scrollWidth-l.clientWidth;if(a>0&&!(0===l.scrollLeft&&i<0||l.scrollLeft===a&&i>0))return!0}l=l.parentNode}return!1}function n(t){var n=r(t),s=n[0],a=n[1];if(!l(t.target,s,a)){var c=!1;e.settings.useBothWheelAxes?e.scrollbarYActive&&!e.scrollbarXActive?(a?o.scrollTop-=a*e.settings.wheelSpeed:o.scrollTop+=s*e.settings.wheelSpeed,c=!0):e.scrollbarXActive&&!e.scrollbarYActive&&(s?o.scrollLeft+=s*e.settings.wheelSpeed:o.scrollLeft-=a*e.settings.wheelSpeed,c=!0):(o.scrollTop-=a*e.settings.wheelSpeed,o.scrollLeft+=s*e.settings.wheelSpeed),R(e),(c=c||i(s,a))&&!t.ctrlKey&&(t.stopPropagation(),t.preventDefault())}}var o=e.element;void 0!==window.onwheel?e.event.bind(o,"wheel",n):void 0!==window.onmousewheel&&e.event.bind(o,"mousewheel",n)},touch:function(e){function i(t,i){var r=Math.floor(h.scrollTop),l=h.scrollLeft,n=Math.abs(t),o=Math.abs(i);if(o>n){if(i<0&&r===e.contentHeight-e.containerHeight||i>0&&0===r)return 0===window.scrollY&&i>0&&L.isChrome}else if(n>o&&(t<0&&l===e.contentWidth-e.containerWidth||t>0&&0===l))return!0;return!0}function r(t,i){h.scrollTop-=i,h.scrollLeft-=t,R(e)}function l(t){return t.targetTouches?t.targetTouches[0]:t}function n(t){return!(t.pointerType&&"pen"===t.pointerType&&0===t.buttons||(!t.targetTouches||1!==t.targetTouches.length)&&(!t.pointerType||"mouse"===t.pointerType||t.pointerType===t.MSPOINTER_TYPE_MOUSE))}function o(t){if(n(t)){var e=l(t);u.pageX=e.pageX,u.pageY=e.pageY,d=(new Date).getTime(),null!==p&&clearInterval(p)}}function s(e,i,r){if(!h.contains(e))return!1;for(var l=e;l&&l!==h;){if(l.classList.contains(m.element.consuming))return!0;var n=t(l);if([n.overflow,n.overflowX,n.overflowY].join("").match(/(scroll|auto)/)){var o=l.scrollHeight-l.clientHeight;if(o>0&&!(0===l.scrollTop&&r>0||l.scrollTop===o&&r<0))return!0;var s=l.scrollLeft-l.clientWidth;if(s>0&&!(0===l.scrollLeft&&i<0||l.scrollLeft===s&&i>0))return!0}l=l.parentNode}return!1}function a(t){if(n(t)){var e=l(t),o={pageX:e.pageX,pageY:e.pageY},a=o.pageX-u.pageX,c=o.pageY-u.pageY;if(s(t.target,a,c))return;r(a,c),u=o;var h=(new Date).getTime(),p=h-d;p>0&&(f.x=a/p,f.y=c/p,d=h),i(a,c)&&t.preventDefault()}}function c(){e.settings.swipeEasing&&(clearInterval(p),p=setInterval(function(){e.isInitialized?clearInterval(p):f.x||f.y?Math.abs(f.x)<.01&&Math.abs(f.y)<.01?clearInterval(p):(r(30*f.x,30*f.y),f.x*=.8,f.y*=.8):clearInterval(p)},10))}if(L.supportsTouch||L.supportsIePointer){var h=e.element,u={},d=0,f={},p=null;L.supportsTouch?(e.event.bind(h,"touchstart",o),e.event.bind(h,"touchmove",a),e.event.bind(h,"touchend",c)):L.supportsIePointer&&(window.PointerEvent?(e.event.bind(h,"pointerdown",o),e.event.bind(h,"pointermove",a),e.event.bind(h,"pointerup",c)):window.MSPointerEvent&&(e.event.bind(h,"MSPointerDown",o),e.event.bind(h,"MSPointerMove",a),e.event.bind(h,"MSPointerUp",c)))}}},H=function(r,l){var n=this;if(void 0===l&&(l={}),"string"==typeof r&&(r=document.querySelector(r)),!r||!r.nodeName)throw new Error("no element is specified to initialize RSPerfectScrollbar");this.element=r,r.classList.add(m.main),this.settings={handlers:["click-rail","drag-thumb","keyboard","wheel","touch"],maxScrollbarLength:null,minScrollbarLength:null,scrollingThreshold:1e3,scrollXMarginOffset:0,scrollYMarginOffset:0,suppressScrollX:!1,suppressScrollY:!1,swipeEasing:!0,useBothWheelAxes:!1,wheelPropagation:!0,wheelSpeed:1};for(var o in l)if(l.hasOwnProperty(o))n.settings[o]=l[o];this.containerWidth=null,this.containerHeight=null,this.contentWidth=null,this.contentHeight=null;var s=function(){return r.classList.add(m.state.focus)},a=function(){return r.classList.remove(m.state.focus)};this.isRtl="rtl"===t(r).direction,this.isNegativeScroll=function(){var t=r.scrollLeft,e=null;return r.scrollLeft=-1,e=r.scrollLeft<0,r.scrollLeft=t,e}(),this.negativeScrollAdjustment=this.isNegativeScroll?r.scrollWidth-r.clientWidth:0,this.event=new y,this.ownerDocument=r.ownerDocument||document,this.scrollbarXRail=i(m.element.rail("x")),r.appendChild(this.scrollbarXRail),this.scrollbarX=i(m.element.thumb("x")),this.scrollbarXRail.appendChild(this.scrollbarX),this.scrollbarX.setAttribute("tabindex",0),this.event.bind(this.scrollbarX,"focus",s),this.event.bind(this.scrollbarX,"blur",a),this.scrollbarXActive=null,this.scrollbarXWidth=null,this.scrollbarXLeft=null;var c=t(this.scrollbarXRail);this.scrollbarXBottom=parseInt(c.bottom,10),isNaN(this.scrollbarXBottom)?(this.isScrollbarXUsingBottom=!1,this.scrollbarXTop=u(c.top)):this.isScrollbarXUsingBottom=!0,this.railBorderXWidth=u(c.borderLeftWidth)+u(c.borderRightWidth),e(this.scrollbarXRail,{display:"block"}),this.railXMarginWidth=u(c.marginLeft)+u(c.marginRight),e(this.scrollbarXRail,{display:""}),this.railXWidth=null,this.railXRatio=null,this.scrollbarYRail=i(m.element.rail("y")),r.appendChild(this.scrollbarYRail),this.scrollbarY=i(m.element.thumb("y")),this.scrollbarYRail.appendChild(this.scrollbarY),this.scrollbarY.setAttribute("tabindex",0),this.event.bind(this.scrollbarY,"focus",s),this.event.bind(this.scrollbarY,"blur",a),this.scrollbarYActive=null,this.scrollbarYHeight=null,this.scrollbarYTop=null;var h=t(this.scrollbarYRail);this.scrollbarYRight=parseInt(h.right,10),isNaN(this.scrollbarYRight)?(this.isScrollbarYUsingRight=!1,this.scrollbarYLeft=u(h.left)):this.isScrollbarYUsingRight=!0,this.scrollbarYOuterWidth=this.isRtl?f(this.scrollbarY):null,this.railBorderYWidth=u(h.borderTopWidth)+u(h.borderBottomWidth),e(this.scrollbarYRail,{display:"block"}),this.railYMarginHeight=u(h.marginTop)+u(h.marginBottom),e(this.scrollbarYRail,{display:""}),this.railYHeight=null,this.railYRatio=null,this.reach={x:r.scrollLeft<=0?"start":r.scrollLeft>=this.contentWidth-this.containerWidth?"end":null,y:r.scrollTop<=0?"start":r.scrollTop>=this.contentHeight-this.containerHeight?"end":null},this.isAlive=!0,this.settings.handlers.forEach(function(t){return T[t](n)}),this.lastScrollTop=Math.floor(r.scrollTop),this.lastScrollLeft=r.scrollLeft,this.event.bind(this.element,"scroll",function(t){return n.onScroll(t)}),R(this)};return H.prototype.update=function(){this.isAlive&&(this.negativeScrollAdjustment=this.isNegativeScroll?this.element.scrollWidth-this.element.clientWidth:0,e(this.scrollbarXRail,{display:"block"}),e(this.scrollbarYRail,{display:"block"}),this.railXMarginWidth=u(t(this.scrollbarXRail).marginLeft)+u(t(this.scrollbarXRail).marginRight),this.railYMarginHeight=u(t(this.scrollbarYRail).marginTop)+u(t(this.scrollbarYRail).marginBottom),e(this.scrollbarXRail,{display:"none"}),e(this.scrollbarYRail,{display:"none"}),R(this),W(this,"top",0,!1,!0),W(this,"left",0,!1,!0),e(this.scrollbarXRail,{display:""}),e(this.scrollbarYRail,{display:""}))},H.prototype.onScroll=function(t){this.isAlive&&(R(this),W(this,"top",this.element.scrollTop-this.lastScrollTop),W(this,"left",this.element.scrollLeft-this.lastScrollLeft),this.lastScrollTop=Math.floor(this.element.scrollTop),this.lastScrollLeft=this.element.scrollLeft)},H.prototype.destroy=function(){this.isAlive&&(this.event.unbindAll(),l(this.scrollbarX),l(this.scrollbarY),l(this.scrollbarXRail),l(this.scrollbarYRail),this.removePsClasses(),this.element=null,this.scrollbarX=null,this.scrollbarY=null,this.scrollbarXRail=null,this.scrollbarYRail=null,this.isAlive=!1)},H.prototype.removePsClasses=function(){this.element.className=this.element.className.split(" ").filter(function(t){return!t.match(/^ps([-_].+|)$/)}).join(" ")},H});

/**********************************
	-	REVBUILDER ADMIN	-
********************************/

(function() {

	var errorMessageID = null,
		successMessageID = null,
		ajaxLoaderID = null,
		ajaxHideButtonID = null,
		onOffListen,
		swa_wi;

	/* COPYRIGHT HANDLINGS */
	RVS.DOC.on('click','#rs_copyright' , function() {
		RVS.F.RSDialog.create({modalid:'#rbm_copyright', bgopacity:0.25});
	});

	RVS.DOC.on('click','#rbm_copyright .rbm_close' , function() {
		RVS.F.RSDialog.close();
	});

	RVS.DOC.on('click','.copyright_sel',function() {
		jQuery('.copyright_sel').removeClass("selected");
		jQuery('.crm_content_wrap').removeClass("selected")
		this.className+=" selected";
		document.getElementById('crm_'+this.dataset.crm).className+=" selected";
	});

	RVS.F.capitalise = function(a) {
		return a.substr(0,1).toUpperCase()+a.substr(1);
	};

	RVS.F.capitaliseAll = function(a) {
		var s = a.split(" ");
		for (var i in s) if (s.hasOwnProperty(i)) s[i] = s[i].substr(0,1).toUpperCase()+s[i].substr(1);

		return s.join(" ");
	};

	RVS.F.compareVersion = function(v1, v2) {
		if (typeof v1 !== 'string') return false;
		if (typeof v2 !== 'string') return false;
		v1 = v1.split('.');
		v2 = v2.split('.');
		const k = Math.min(v1.length, v2.length);
		for (let i = 0; i < k; ++ i) {
			v1[i] = parseInt(v1[i], 10);
			v2[i] = parseInt(v2[i], 10);
			if (v1[i] > v2[i]) return 1;
			if (v1[i] < v2[i]) return -1;
		}
		return v1.length == v2.length ? 0: (v1.length < v2.length ? -1 : 1);
	};

	/**********************************
		- 	CUSTOM DIALOG WINDOW 	-
	***********************************/
	var ModalBefore,
		OpenedModal,
		ModalScroll,
		ModalContent,
		ModalUnderlay;

	RVS.F.setCookie = function(cname, cvalue, exdays) {
	  var d = new Date();
	  d.setTime(d.getTime() + (exdays*24*60*60*1000));
	  var expires = "expires="+ d.toUTCString();
	  document.cookie = cname + "=" + cvalue + ";" + expires + ";path=/";
	}

	RVS.F.getCookie = function(cname) {
	  var name = cname + "=";
	  var decodedCookie = decodeURIComponent(document.cookie);
	  var ca = decodedCookie.split(';');
	  for(var i = 0; i <ca.length; i++) {
	    var c = ca[i];
	    while (c.charAt(0) == ' ') {
	      c = c.substring(1);
	    }
	    if (c.indexOf(name) == 0) {
	      return c.substring(name.length, c.length);
	    }
	  }
	  return "";
	}

	RVS.F.RSDialog = {

		create: function(obj) {
			obj.modalid = obj.modalid.replace('#', '');
			var modal = jQuery('.rb-modal-wrapper[data-modal="' + obj.modalid + '"]');

			if(!modal.length) {
				console.log('modal error: ' + obj.modalid);
				return;
			}

			ModalScroll = modal.find('.rb-modal-inner');
			ModalContent = modal.find('.rb_modal');

			if(!ModalUnderlay) ModalUnderlay = jQuery('#rb_modal_underlay');
			if(!obj.hasOwnProperty('bgopacity')) obj.bgopacity = 0.05;

			if(OpenedModal && OpenedModal[0].dataset.modal !== obj.modalid) ModalBefore = OpenedModal;
			OpenedModal = modal;

			modal.show();
			ModalUnderlay.css('z-index', parseInt(modal.css('z-index'), 10) - 1).show();

			if(obj.modalid === 'rbm_decisionModal') RVS.F.RSDialog.doCancelModal(obj);
			RVS.F.RSDialog.center();

			punchgs.TweenLite.to(ModalUnderlay, 0.3, {opacity: obj.bgopacity, ease: punchgs.Power3.EaseInOut});
			punchgs.TweenLite.fromTo(modal, 0.3, {autoAlpha: 0, scale: 0.9}, {autoAlpha: 1, scale: 1, ease: punchgs.Power3.EaseInOut});

		},
		setDragScroll: function(posTop) {

			if(posTop > 0) {
				ModalContent.draggable({handle:'.rbm_header', axis: false, cancel: '.rbm_close'});
				ModalScroll.RSScroll('destroy');
			}
			else {
				ModalContent.draggable({handle:'.rbm_header', axis: 'x', cancel: '.rbm_close'});
				ModalScroll.RSScroll({wheelPropagation: true, suppressScrollX: false, minScrollbarLength: 30});
			}

		},
		center:function() {

			if(!OpenedModal) return;

			var posTop = Math.max((window.innerHeight * 0.5) - (ModalContent.height() * 0.5), 0),
				posLeft = 'auto';

			if(OpenedModal[0].dataset.centerineditor) {
				posLeft = Math.round((RVS.C.rb.width() * 0.5) - (ModalContent.width() * 0.5));
			}

			RVS.F.RSDialog.setDragScroll(posTop);
			ModalContent.css({marginTop: Math.ceil(posTop), marginLeft: posLeft, left: 0, top: 0});
			ModalScroll.RSScroll('update');

		},
		close: function(_) {

			if(OpenedModal) {
				punchgs.TweenLite.killTweensOf(OpenedModal);
				OpenedModal.hide().css('opacity', 0);
			}
			if(!ModalBefore && ModalUnderlay) {
				punchgs.TweenLite.killTweensOf(ModalUnderlay);
				ModalUnderlay.hide().css('opacity', 0);
			}

			ModalUnderlay.css('z-index', 999995);
			OpenedModal = ModalBefore;
			ModalBefore = undefined;

		},
		doCancelModal: function(_) {

			document.getElementById('decmod_icon').innerHTML = _.icon;
			document.getElementById('decmod_title').innerHTML = _.title;
			document.getElementById('decmod_maintxt').innerHTML = _.maintext;
			document.getElementById('decmod_subtxt').innerHTML = _.subtext;

			if (_.do!==undefined) {
				document.getElementById('decmod_do_icon').innerHTML = _.do.icon;
				document.getElementById('decmod_do_txt').innerHTML = _.do.text;
				jQuery('#decmod_do_btn').show().off('click').on('click', function() {
					if (_.do.event!==undefined)	RVS.DOC.trigger(_.do.event,_.do.eventparam);
					if (_.do.keepDialog!==true) {
						RVS.F.RSDialog.close();
						RVS.F.RSDialog.close();
					}
				});
			} else {
				jQuery('#decmod_do_btn').hide();
			}
			if (_.cancel!==undefined) {
				document.getElementById('decmod_dont_icon').innerHTML = _.cancel.icon;
				document.getElementById('decmod_dont_txt').innerHTML = _.cancel.text;
				jQuery('#decmod_dont_btn').show().off('click').on('click', function() {
					RVS.F.RSDialog.close();
				});
			} else {
				jQuery('#decmod_dont_btn').hide();
			}
			if (_.swapbuttons) {
				jQuery('#decmod_do_btn').css({float:"right", marginLeft:"10px",marginRight:"0px"});
			} else {
				jQuery('#decmod_do_btn').css({float:"none", marginLeft:"0px",marginRight:"10px"});
			}
		}

	};

	// close modal when clicked outside the box, also escape key
	RVS.DOC.on('click', '.rb-modal-content',function() {if(OpenedModal) OpenedModal.find('.rbm_close').click();})
		  .on('click', '.rb_modal', function(e) {e.stopPropagation();})
		  .on('keydown', function(e,d) {if(e.keyCode == '27' && OpenedModal) OpenedModal.find('.rbm_close').click();});

	// reposition modal
	jQuery(window).on('resize', RVS.F.RSDialog.center);


	/**********************************************
		-	SHOW / HIDE INFO AND WAIT A MINUTE	-
	**********************************************/

	RVS.F.showInfo = function(obj) {

		if (obj.type=="register" && jQuery('#rbm_activate_slider').length>0) return;
		var info = obj.type=="register" ? obj.content : '<i class="material-icons info">info</i>';
		if (obj.type=="info") info = '<i class="material-icons info">info</i>';
		if (obj.type=="goodtoknow") info = '<i class="material-icons goodtoknow">mode_comment</i>';
		if (obj.type=="warning") info = '<i class="material-icons cancel">close</i>';
		if (obj.type=="success") info = '<i class="material-icons ok">done</i>';


		obj.showdelay = obj.showdelay != undefined ? obj.showdelay : 0;
		obj.hidedelay = obj.hidedelay != undefined ? obj.hidedelay : 0;

		// CHECK IF THE TOOLBOX WRAPPER EXIST ALREADY
		if (jQuery('#eg-toolbox-wrapper').length==0) {
			jQuery('#rb_maininfo_wrap').append('<div id="eg-toolbox-wrapper"></div>').appendTo(jQuery('body'));
			// jQuery('#rb_maininfo_wrap').appendTo(jQuery('body'));
		}

		// ADD NEW INFO BOX
		if (obj.type==="register")
			jQuery('#eg-toolbox-wrapper').append(info);
		else
			jQuery('#eg-toolbox-wrapper').append('<div class="eg-toolbox newadded">'+info+obj.content+'</div>');

		var nt = jQuery('#eg-toolbox-wrapper').find('.eg-toolbox.newadded');
		nt.removeClass('newadded');

		// ANIMATE THE INFO BOX
		punchgs.TweenLite.fromTo(nt,0.5,{y:-50,autoAlpha:0,transformOrigin:"50% 50%", transformPerspective:900, rotationX:-90},{autoAlpha:1,y:0,rotationX:0,ease:punchgs.Back.easeOut,delay:obj.showdelay});


		if (obj.hideon != "event") {
			if (obj.type=="register")
				nt.find('.rbmas_close').click(function() {punchgs.TweenLite.to(nt,0.3,{x:200,ease:punchgs.Power3.easeInOut,autoAlpha:0,onComplete:function() {nt.remove();}});});
			else
				nt.click(function() {punchgs.TweenLite.to(nt,0.3,{x:200,ease:punchgs.Power3.easeInOut,autoAlpha:0,onComplete:function() {nt.remove();}});})

			if (obj.hidedelay !=0 && obj.hideon!="click")
				punchgs.TweenLite.to(nt,0.3,{x:200,ease:punchgs.Power3.easeInOut,autoAlpha:0,delay:obj.hidedelay + obj.showdelay, onComplete:function() {nt.remove();}});
		} else  {
			jQuery('#eg-toolbox-wrapper').on(obj.event,function() {
				punchgs.TweenLite.to(nt,0.3,{x:200,ease:punchgs.Power3.easeInOut,autoAlpha:0,onComplete:function() {nt.remove();}});
			});
		}
	};

	RVS.F.showRegisterSliderInfo = function() {
		if (window.rbmContent===undefined) {
			window.rbmContent =  '<div id="rbm_activate_slider" class="eg-toolbox newadded">';
			window.rbmContent += '<div class="rbmas_close"><i class="material-icons">close</i></div>';
			window.rbmContent += '<div class="rbmas_def_page">';
			window.rbmContent += '	<div class="rbmas_title">'+RVS_LANG.active_sr_to_access+'</div>';
			window.rbmContent += '	<div class="rbmas_benef"><i class="material-icons">check</i>'+RVS_LANG.active_sr_tmp_obl+'</div>';
			window.rbmContent += '	<div class="rbmas_benef"><i class="material-icons">check</i>'+RVS_LANG.addons+'</div>';
			window.rbmContent += '	<div class="rbmas_benef"><i class="material-icons">check</i>'+RVS_LANG.active_sr_inst_upd+'</div>';
			window.rbmContent += '	<div class="rbmas_benef"><i class="material-icons">check</i>'+RVS_LANG.active_sr_one_on_one+'</div>';
			window.rbmContent += '	<div class="dcenter">';
			window.rbmContent += '		<div class="div30"></div><div id="rbmas_active_plugin_now" style="width:220px" class="basic_action_button longbutton basic_action_lilabutton"><i class="material-icons">vpn_key</i>'+RVS_LANG.ihavelicensekey+'</div>';
			window.rbmContent += '		<div class="div0"></div><a href="https://codecanyon.net/item/slider-revolution-responsive-magento-extension/9332896?ref=nwdthemes&license=regular&open_purchase_for_item_id=9332896&purchasable=source" target="_blank" style="width:220px" class="basic_action_button longbutton basic_action_coloredbutton"><i class="material-icons">shopping_cart</i>'+RVS_LANG.getlicensekey+'</a>';
			window.rbmContent += '	</div>';
			window.rbmContent += '</div>';
			window.rbmContent += '<div class="rbmas_activate_page">';
			window.rbmContent += '	<div class="rbmas_title">'+RVS_LANG.active_sr_plg_activ+'</div>';
			window.rbmContent += '	<input class="codeinput" id="rbmas_purchasekey" placeholder="Enter Purchase Code">';
			window.rbmContent += '	<purplebutton id="rbmas_activateplugin" class="fullwidth mcg_next_page"><i class="material-icons">vpn_key</i>'+RVS_LANG.registerCode+'</purplebutton>';
			window.rbmContent += '	<div class="dcenter">';
			window.rbmContent += '		<div class="div65"></div><div class="rbmas_solidtitle">'+RVS_LANG.onepurchasekey+'</div>';
			window.rbmContent += '		<div class="div30"></div><div class="rbmas_solidtext">'+RVS_LANG.onepurchasekey_info+'</div>';
			window.rbmContent += '		<div class="div30"></div><a href="https://codecanyon.net/item/slider-revolution-responsive-magento-extension/9332896?ref=nwdthemes&license=regular&open_purchase_for_item_id=9332896&purchasable=source" target="_blank" class="basic_action_button longbutton basic_action_coloredbutton"><i class="material-icons">shopping_cart</i>'+RVS_LANG.getlicensekey+'</a>';
			window.rbmContent += '	</div>';
			window.rbmContent += '</div>';
			window.rbmContent += '<div id="rbm_activate_slider_deco"></div>';
			window.rbmContent += '<div>';
			RVS.DOC.on('click','#rbmas_active_plugin_now',function() {
				jQuery('#rbm_activate_slider').addClass("rbmas_show_activate");
				return false;
			});
		}
		RVS.F.showInfo({content:window.rbmContent, type:"register", showdelay:0, hidedelay:0, hideon:"", event:"" });
	};

 	RVS.F.showWaitAMinute = function(obj) {

		var wm = jQuery('#waitaminute');
		swa_wi = swa_wi===undefined ? 0 : swa_wi;


		// SHOW AND HIDE WITH DELAY
		if (obj.delay!=undefined) {
			swa_wi++;
			punchgs.TweenLite.to(wm,0.3,{autoAlpha:1,ease:punchgs.Power3.easeInOut});
			punchgs.TweenLite.set(wm,{display:"block"});

			setTimeout(function() {

				swa_wi--;

				if (swa_wi===0)
					punchgs.TweenLite.to(wm,0.3,{autoAlpha:0,ease:punchgs.Power3.easeInOut,onComplete:function() {
						punchgs.TweenLite.set(wm,{display:"block"});
					}});
			},obj.delay);
		}

		// SHOW IT
		if (obj.fadeIn != undefined) {
			punchgs.TweenLite.to(wm,obj.fadeIn/1000,{autoAlpha:1,ease:punchgs.Power3.easeInOut});
			punchgs.TweenLite.set(wm,{display:"block"});
			swa_wi++;
		}

		// HIDE IT
		if (obj.fadeOut != undefined) {
			swa_wi--;
			if (swa_wi===0)
				punchgs.TweenLite.to(wm,obj.fadeOut/1000,{autoAlpha:0,ease:punchgs.Power3.easeInOut,onComplete:function() { punchgs.TweenLite.set(wm,{display:"block"});}});
		}

		// CHANGE TEXT
		if (obj.text != undefined) {
			switch (obj.text) {
				case "progress1":

				break;
				default:
					wm.html('<div class="waitaminute-message">'+obj.text+'</div>');
				break;
			}
		} else {
			wm.html('<div class="waitaminute-message">'+RVS_LANG.please_wait_a_moment+'</div>');
		}

		return true;

	 };

	/*********************************************
		-	ON OFF SWITCH BUTTON MANAGEMENT	-
	*********************************************/

	/*
	Turn On/OFF CheckBox Buttons Handling
	*/
	RVS.F.turnOnOff = function (btn,change) {
		var i = btn.find('input');
		if (i.is(':checked')) {
			if (change) {
				i.removeAttr('checked');
				i.trigger('change');
				btn.addClass("off");
			} else {
				btn.removeClass("off");
			}
		} else {
			if (change) {
				i.attr('checked','checked');
				i.trigger('change');
				btn.removeClass("off");
			}  else {
				btn.addClass("off");
			}

		}
	};

	/*
	ON OFF VISIUAL UPDATE
	*/
	RVS.F.turnOnOffVisUpdate = function (obj) {
		obj.btn = obj.btn===undefined ? obj.input.closest('.tponoff_inner') : obj.btn;
		obj.wrap = obj.btn.closest('.tponoffwrap');
		obj.input = obj.input===undefined ? btn.find('input') : obj.input;

		if (obj.input.is(':checked')) {
			//punchgs.TweenLite.to(obj.btn,0.3,{x:-50,ease:punchgs.Power3.easeInOut});
			obj.wrap.addClass("on");
			obj.wrap.removeClass("off");
		} else {
			//punchgs.TweenLite.to(obj.btn,0.3,{x:0,ease:punchgs.Power3.easeInOut});
			obj.wrap.removeClass("on");
			obj.wrap.addClass("off");
		}
	};





	// ON OFF SWITCH INITIALISATION
	RVS.F.initOnOff = function(el) {
		if (el===undefined)
			jQuery('input[type="checkbox"]').each(function() {
				var i = jQuery(this);
				if (!i.hasClass("simplechkbx"))
					if (!i.hasClass("tponoff")) {
						i.wrap('<div class="tponoffwrap"><div class="tponoff_inner"><div class="tponoff_on">On</div><div class="tponoff_off">Off</div></div></div>');
						i.addClass("tponoff");
					}
			});
		else {
			el.find('input[type="checkbox"]').each(function() {
				var i = jQuery(this);
				if (!i.hasClass("simplechkbx"))
					if (!i.hasClass("tponoff")) {
						i.wrap('<div class="tponoffwrap"><div class="tponoff_inner"><div class="tponoff_on">On</div><div class="tponoff_off">Off</div></div></div>');
						i.addClass("tponoff");
					}
			});
		}
		if (onOffListen===undefined) {
			onOffListen = true;
			RVS.DOC.on('click','.tponoffwrap',function() {
				RVS.F.turnOnOff(jQuery(this),true);

			});
		}
		updateAllOnOff();
	};

	/* UPDATE ALL ONOFF BUTTONS */
	function updateAllOnOff() {
		jQuery('.tponoffwrap').each(function() { RVS.F.turnOnOff(jQuery(this),false);});
	}


	/*********************************************
		-	AJAX / ERROR AND SUCCESS MESSAGES -
	**********************************************/

	RVS.F.ajaxRequest = function(action,data,successFunction,hideOverlay,hideError,waitMessage,hideSuccess){
		var objData = {
			action:RVS.ENV.plugin_dir+"_ajax_action",
			client_action:action,
            nonce:RVS.ENV.nonce,
            form_key:window.FORM_KEY,
			data:data
		};

		hideErrorMessage();
		showAjaxLoader();
		hideAjaxButton();

		if(hideOverlay===undefined)
			if (waitMessage!==undefined)
				RVS.F.showWaitAMinute({fadeIn:500,text:waitMessage});
			else
				RVS.F.showWaitAMinute({fadeIn:500,text:RVS_LANG.please_wait_a_moment});

		jQuery.ajax({
			type:"post",
			url:ajaxurl,
			dataType: 'json',
			data:objData,
			success:function(response){

				if(hideOverlay===undefined && !response.is_redirect)
					RVS.F.showWaitAMinute({fadeOut:500});

				hideAjaxLoader();

				if(!response){ RVS.F.showErrorMessage("Empty ajax response!"); return(false);}
				if(response == -1){RVS.F.showErrorMessage("ajax error!!!"); return(false);}
				if(response == 0){ RVS.F.showErrorMessage("ajax error, action: <b>"+action+"</b> not found");return(false);}

				if(response.success == undefined){RVS.F.showErrorMessage("The 'success' param is a must!");return(false);}

				if(response.success == false){

					if(hideError===undefined){RVS.F.showErrorMessage(response.message);return(false);
					}else{
						if(typeof successFunction == "function"){
							successFunction(response);
						}
					}
				}else{

					//success actions:

					//run a success event function
					if(typeof successFunction == "function"){
						successFunction(response);
					}

					if(response.message && hideSuccess!==true)
						showSuccessMessage(response.message);

					if(response.is_redirect)
						location.href=response.redirect_url;
				}
			},
			error:function(jqXHR, textStatus, errorThrown){

				if(hideOverlay===undefined)
					RVS.F.showWaitAMinute({fadeOut:500});

				hideAjaxLoader();

				if(textStatus == "parsererror")
					RVS.F.debug(jqXHR.responseText);

				RVS.F.showErrorMessage("Ajax Error!!! " + textStatus);
			}
		});

	};//ajaxrequest


	RVS.F.showErrorMessage = function(htmlError){
		RVS.F.showInfo({content:htmlError, type:"warning", showdelay:0, hidedelay:3, hideon:"", event:"" });
		showAjaxButton();
	};
	RVS.F.setErrorMessageID = function(id){
		errorMessageID = id;
	};

	RVS.F.setSuccessMessageID = function(id){
		successMessageID = id;
	};

	RVS.F.hideSuccessMessage = function(){
		if(successMessageID){
			jQuery("#"+successMessageID).hide();
			successMessageID = null;	//can be used only once.
		}
		else
			jQuery("#success_message").slideUp("slow").fadeOut("slow");

		showAjaxButton();
	};

	var showAjaxLoader = function(){
		if(ajaxLoaderID)
			jQuery("#"+ajaxLoaderID).show();
	};

	var hideAjaxLoader = function(){
		if(ajaxLoaderID){
			jQuery("#"+ajaxLoaderID).hide();
			ajaxLoaderID = null;
		}
	};

	var hideAjaxButton = function(){
		if(ajaxHideButtonID){
			var doHide = ajaxHideButtonID.split(',');
			if(doHide.length > 1){
				for(var i = 0; i < doHide.length; i++){
					jQuery("#"+doHide[i]).hide();
				}
			}else{
				jQuery("#"+ajaxHideButtonID).hide();
			}
		}
	};

	var showAjaxButton = function(){
		if(ajaxHideButtonID){
			var doShow = ajaxHideButtonID.split(',');
			if(doShow.length > 1){
				for(var i = 0; i < doShow.length; i++){
					jQuery("#"+doShow[i]).show();
				}
			}else{
				jQuery("#"+ajaxHideButtonID).show();
			}
			ajaxHideButtonID = null;
		}
	};

	var hideErrorMessage = function(){
		if(errorMessageID !== null){
			jQuery("#"+errorMessageID).hide();
			errorMessageID = null;
		}else
			jQuery("#error_message").hide();
	};

	var showSuccessMessage = function(htmlSuccess){

		RVS.F.showInfo({content:htmlSuccess, type:"success", showdelay:0, hidedelay:1, hideon:"", event:"" });

		showAjaxButton();
	};


})();

})($nwd_jQuery);

// FIX FOR NOT USED GLOBAL FUNCTIONS
window.UniteLayersRev =  {addon_callbacks: []};
UniteLayersRev.addPreventLeave = UniteLayersRev.add_layer_actions = UniteLayersRev.add_layer_change = function() { console.log("Function is depricated. Please Update Addons");};
