/********************************************
 * REVOLUTION 6.1.2 EXTENSION - NAVIGATION
 * @version: 6.1.2 (05.09.2019)
 * @requires rs6.main.js
 * @author ThemePunch
*********************************************/
(function($) {
"use strict";
var _R = jQuery.fn.revolution,
	_ISM = _R.is_mobile();


///////////////////////////////////////////
// 	EXTENDED FUNCTIONS AVAILABLE GLOBAL  //
///////////////////////////////////////////
jQuery.extend(true,_R, {

	hideUnHideNav : function(id) {
		var w = _R[id].c.width(),
			a = _R[id].navigation.arrows,
			b = _R[id].navigation.bullets,
			c = _R[id].navigation.thumbnails,
			d = _R[id].navigation.tabs;
		if (ckNO(a)) biggerNav(_R[id].c.find('.tparrows'),a.hide_under,w,a.hide_over);
		if (ckNO(b)) biggerNav(_R[id].c.find('.tp-bullets'),b.hide_under,w,b.hide_over);
		if (ckNO(c)) biggerNav(c.c,c.hide_under,w,c.hide_over);
		if (ckNO(d)) biggerNav(d.c,d.hide_under,w,d.hide_over);

		setONHeights(id);

	},

	resizeThumbsTabs : function(id,force) {


		if (_R[id]!==undefined && _R[id].navigation.use && ((_R[id].navigation && _R[id].navigation.bullets.enable) || (_R[id].navigation && _R[id].navigation.tabs.enable) || (_R[id].navigation && _R[id].navigation.thumbnails.enable))) {
			var f = (jQuery(window).width()-480) / 500,
				tws = new punchgs.TimelineLite(),
				otab = _R[id].navigation.tabs,
				othu = _R[id].navigation.thumbnails,
				otbu = _R[id].navigation.bullets;

			tws.pause();
			f = f>1 ? 1 : f<0 ? 0 : f;

			if (ckNO(otab) && (force || otab.width>otab.min_width)) rtt(f,tws,_R[id].c,otab,_R[id].slideamount,'tab');
			if (ckNO(othu) && (force || othu.width>othu.min_width)) rtt(f,tws,_R[id].c,othu,_R[id].slideamount,'thumb');
			if (ckNO(otbu) && force) {

				// SET BULLET SPACES AND POSITION
				var bw = _R[id].c.find('.tp-bullets');

				bw.find('.tp-bullet').each(function(i){
					var b = jQuery(this),
						am = i+1,
						w = b.outerWidth()+parseInt((otbu.space===undefined? 0:otbu.space),0),
						h = b.outerHeight()+parseInt((otbu.space===undefined? 0:otbu.space),0);

				if (otbu.direction==="vertical") {
					b.css({top:((am-1)*h)+"px", left:"0px"});
					bw.css({height:(((am-1)*h) + b.outerHeight()),width:b.outerWidth()});
				}
				else {
					b.css({left:((am-1)*w)+"px", top:"0px"});
					bw.css({width:(((am-1)*w) + b.outerWidth()),height:b.outerHeight()});
				}
				});

			}

			tws.play();

			setONHeights(id);
		}

		return true;
	},

	updateNavIndexes : function(id) {
		var _ = _R[id].c;

		function setNavIndex(a) {
			if (_.find(a).lenght>0) {
				_.find(a).each(function(i) {
					jQuery(this).data('liindex',i);
				});
			}
		}
		setNavIndex('rs-tab');
		setNavIndex('rs-bullet');
		setNavIndex('rs-thumb');
		_R.resizeThumbsTabs(id,true);
		_R.manageNavigation(id);

	},


	// PUT NAVIGATION IN POSITION AND MAKE SURE THUMBS AND TABS SHOWING TO THE RIGHT POSITION
	manageNavigation : function(id,movetoposition) {

		if (!_R[id].navigation.use) return;

		var	lof = _R.getHorizontalOffset(_R[id].cpar,"left"),
			rof = _R.getHorizontalOffset(_R[id].cpar,"right");

		if (ckNO(_R[id].navigation.bullets)) {
			if (_R[id].sliderLayout!="fullscreen" && _R[id].sliderLayout!="fullwidth") {
				// OFFSET ADJUSTEMENT FOR LEFT ARROWS BASED ON THUMBNAILS AND TABS OUTTER
				_R[id].navigation.bullets.h_offset_old = _R[id].navigation.bullets.h_offset_old === undefined ? parseInt(_R[id].navigation.bullets.h_offset,0) : _R[id].navigation.bullets.h_offset_old;
				_R[id].navigation.bullets.h_offset = _R[id].navigation.bullets.h_align==="center" ? _R[id].navigation.bullets.h_offset_old+lof/2 -rof/2: _R[id].navigation.bullets.h_offset_old+lof-rof;
			}
			setNavElPositions(_R[id].c.find('.tp-bullets'),_R[id].navigation.bullets,id);
		}

		if (ckNO(_R[id].navigation.thumbnails))
			setNavElPositions(_R[id].navigation.thumbnails.c,_R[id].navigation.thumbnails,id);

		if (ckNO(_R[id].navigation.tabs))
			setNavElPositions(_R[id].navigation.tabs.c,_R[id].navigation.tabs,id);

		if (ckNO(_R[id].navigation.arrows)) {

			if (_R[id].sliderLayout!="fullscreen" && _R[id].sliderLayout!="fullwidth") {
				// OFFSET ADJUSTEMENT FOR LEFT ARROWS BASED ON THUMBNAILS AND TABS OUTTER
				_R[id].navigation.arrows.left.h_offset_old = _R[id].navigation.arrows.left.h_offset_old === undefined ? parseInt(_R[id].navigation.arrows.left.h_offset,0) : _R[id].navigation.arrows.left.h_offset_old;
				_R[id].navigation.arrows.left.h_offset = _R[id].navigation.arrows.left.h_align==="right" ?  _R[id].navigation.arrows.left.h_offset_old+rof : _R[id].navigation.arrows.left.h_offset_old+lof;

				_R[id].navigation.arrows.right.h_offset_old = _R[id].navigation.arrows.right.h_offset_old === undefined ? parseInt(_R[id].navigation.arrows.right.h_offset,0) : _R[id].navigation.arrows.right.h_offset_old;
				_R[id].navigation.arrows.right.h_offset = _R[id].navigation.arrows.right.h_align==="right" ? _R[id].navigation.arrows.right.h_offset_old+rof : _R[id].navigation.arrows.right.h_offset_old+lof;
			}
			setNavElPositions(_R[id].c.find('.tp-leftarrow.tparrows'),_R[id].navigation.arrows.left,id);
			setNavElPositions(_R[id].c.find('.tp-rightarrow.tparrows'),_R[id].navigation.arrows.right,id);
		}

		if (movetoposition!==false) {
			if (ckNO(_R[id].navigation.thumbnails)) moveThumbsInPosition(_R[id].navigation.thumbnails,id);
			if (ckNO(_R[id].navigation.tabs)) moveThumbsInPosition(_R[id].navigation.tabs,id);
		}
	},

	showFirstTime : function(id) {
		showNavElements(id);
		_R.callContWidthManager(id);
	},


	// MANAGE THE NAVIGATION
	 createNavigation : function(id) {

		var	_a = _R[id].navigation.arrows, _b = _R[id].navigation.bullets, _c = _R[id].navigation.thumbnails, _d = _R[id].navigation.tabs,
			a = ckNO(_a), b = ckNO(_b), c = ckNO(_c), d = ckNO(_d);

		// Initialise Keyboard Navigation if Option set so
		initKeyboard(id);

		// Initialise Mouse Scroll Navigation if _R[id]ion set so
		initMouseScroll(id);

		//Draw the Arrows
		if (a) {
			initArrows(_a,id);
			_a.c = _R[id].cpar.find('.tparrows');
		}


		// BUILD BULLETS, THUMBS and TABS
		_R[id].slides.each(function(index) {
			if (this.className.indexOf("not-in-nav")===-1)	{
				var li_rtl = jQuery(_R[id].slides[_R[id].slides.length-1-index]),
					li = jQuery(this);
				if (b)
					if (_R[id].navigation.bullets.rtl)
						addBullet(_R[id].c,_b,li_rtl,id);
					else
						addBullet(_R[id].c,_b,li,id);

				if (c)
					if (_R[id].navigation.thumbnails.rtl)
						addThumb(_R[id].c,_c,li_rtl,'tp-thumb',id);
					else
						addThumb(_R[id].c,_c,li,'tp-thumb',id);
				if (d)
					if (_R[id].navigation.tabs.rtl)
						addThumb(_R[id].c,_d,li_rtl,'tp-tab',id);
					else
						addThumb(_R[id].c,_d,li,'tp-tab',id);
			}
		});


		if (b) _b.c = _R[id].cpar.find('.tp-bullets');
		if (c) jQuery.extend(true,_c,navOExt(id,"thumb"));
		if (d) jQuery.extend(true,_d,navOExt(id,"tab"));


		// LISTEN TO SLIDE CHANGE - SET ACTIVE SLIDE BULLET
		_R[id].c.bind('revolution.slide.onafterswap revolution.nextslide.waiting',function(e) {

			if (_R[id].pr_next_key===undefined && _R[id].pr_active_key===undefined) return;

			var si = //e.namespace==="onafterswap.slide" ? _R[id].pr_active_key!==undefined ?_R[id].slides[_R[id].pr_active_key].dataset.key : _R[id].slides[_R[id].pr_next_key].dataset.key :
					_R[id].pr_next_key===undefined ? _R.gA(_R[id].slides[_R[id].pr_active_key],"key") : _R.gA(_R[id].slides[_R[id].pr_next_key],"key");

			_R[id].c.find('.tp-bullet').each(function() {
				if (_R.gA(this,"key")===si) this.classList.add("selected");
				else this.classList.remove("selected");
			});

			_R[id].cpar.find('.tp-thumb, .tp-tab').each(function() {
				if (_R.gA(this,"key")===si) {
					this.classList.add("selected");
					if (this.nodeName==="RS-TAB") moveThumbsInPosition(_d,id);
					else moveThumbsInPosition(_c,id);
				} else
					this.classList.remove("selected");
			});

			var ai = 0,
				f = false;
			if (_R[id].thumbs)
				jQuery.each(_R[id].thumbs,function(i,obj) {
					ai = f === false ? i : ai;
					f = (obj!==undefined && obj.id === si) || i === si ? true : f;
				});


			var pi = ai>0 ? ai-1 : _R[id].slideamount-1,
				ni = (ai+1)==_R[id].slideamount ? 0 : ai+1;


			if (_a.enable === true) {
				var inst = _a.tmp;
				if (_R[id].thumbs[pi]!=undefined) {
					jQuery.each(_R[id].thumbs[pi].params,function(i,obj) {
						inst = inst.replace(obj.from,obj.to);
					});
				}
				_a.left.j.html(inst);
				inst = _a.tmp;
				if (ni>_R[id].slideamount) return;
				jQuery.each(_R[id].thumbs[ni].params,function(i,obj) {
					inst = inst.replace(obj.from,obj.to);
				});
				_a.right.j.html(inst);

				if (!_a.rtl) {
					punchgs.TweenLite.set(_a.left.j.find('.tp-arr-imgholder'),{backgroundImage:"url("+_R[id].thumbs[pi].src+")"});
					punchgs.TweenLite.set(_a.right.j.find('.tp-arr-imgholder'),{backgroundImage:"url("+_R[id].thumbs[ni].src+")"});
				} else {
					punchgs.TweenLite.set(_a.left.j.find('.tp-arr-imgholder'),{backgroundImage:"url("+_R[id].thumbs[ni].src+")"});
					punchgs.TweenLite.set(_a.right.j.find('.tp-arr-imgholder'),{backgroundImage:"url("+_R[id].thumbs[pi].src+")"});
				}
			}
		});

		hdResets(_a);
		hdResets(_b);
		hdResets(_c);
		hdResets(_d);



		// HOVER OVER ELEMENTS SHOULD SHOW/HIDE NAVIGATION ELEMENTS
		_R[id].cpar.on("mouseenter mousemove",function(e) {
			if (!_R[id].cpar.hasClass("tp-mouseover")) {
				_R[id].cpar.addClass("tp-mouseover");
				if (_R[id].firstSlideAvailable) {
					showNavElements(id);
					// ON MOBILE WE NEED TO HIDE ELEMENTS EVEN AFTER TOUCH
					if (_ISM) {
						ct(_R[id].hideAllNavElementTimer);
						_R[id].hideAllNavElementTimer = setTimeout(function() {
							_R[id].cpar.removeClass("tp-mouseover");
							hidaNavElements(id);
						},150);
					}
				}
			}
		});

		_R[id].cpar.on("mouseleave ",function() {
			_R[id].cpar.removeClass("tp-mouseover");
			hidaNavElements(id);
		});

		// Initialise Swipe Navigation
		if (c) swipeAction(_c.c,id);
		if (d) swipeAction(_d.c,id);
		if (_R[id].sliderType==="carousel") swipeAction(_R[id].c,id,true);
		if ((_R[id].navigation.touch.touchOnDesktop) || (_R[id].navigation.touch.touchenabled && _ISM)) swipeAction(_R[id].c,id,"swipebased");

	}

});




/////////////////////////////////
//	-	INTERNAL FUNCTIONS	- ///
/////////////////////////////////

function navOExt(id,a) {
	var r = new Object({single:'.tp-'+a,c:_R[id].cpar.find('.tp-'+a+'s')});
	r.mask = r.c.find('.tp-'+a+'-mask');
	r.wrap = r.c.find('.tp-'+a+'s-inner-wrapper');
	return r;
}

var moveThumbsInPosition = function(s,id) {
		var tw = s.direction==="vertical" ?
			s.mask.find(s.single).first().outerHeight(true)+s.space :
			s.mask.find(s.single).first().outerWidth(true)+s.space,
			tmw = s.direction==="vertical" ? s.mask.height() : s.mask.width(),
			ti = s.mask.find(s.single+'.selected').data('liindex');

		ti = ti===undefined ? 0 : ti;
		ti = ti>0 && _R[id].sdir===1 ? ti-1 : ti;

		var me = tmw/tw,
			ts = s.direction==="vertical" ? s.mask.height() : s.mask.width(),
			tp = 0-(ti * tw),
			els =  s.direction==="vertical" ? s.wrap.height() : s.wrap.width(),
			curpos = tp < 0-(els-ts) ? 0-(els-ts) : tp,
			elp = _R.gA(s.wrap[0],"offset");


		if (me>2) {
			curpos = tp - (elp+tw) <= 0 ? tp - (elp+tw) < 0-tw ? elp : curpos + tw : curpos;
			curpos = ( (tp-tw + elp + tmw)< tw && tp  + (Math.round(me)-2)*tw < elp) ? tp + (Math.round(me)-2)*tw : curpos;
		}

		curpos = (s.direction!=="vertical" && s.mask.width()>=s.wrap.width()  || s.direction==="vertical" && s.mask.height()>=s.wrap.height()) ? 0 : curpos < 0-(els-ts) ? 0-(els-ts) : curpos > 0 ? 0 : curpos;



		if (!s.c.hasClass("dragged")) {
			if (s.direction==="vertical")
				s.wrap.data('tmmove',punchgs.TweenLite.to(s.wrap,0.5,{top:curpos+"px",ease:punchgs.Power3.easeInOut}));
			else
				s.wrap.data('tmmove',punchgs.TweenLite.to(s.wrap,0.5,{left:curpos+"px",ease:punchgs.Power3.easeInOut}));
			s.wrap.data('offset',curpos);
		}
	};


// RESIZE THE THUMBS BASED ON ORIGINAL SIZE AND CURRENT SIZE OF WINDOW
var rtt = function(f,tws,c,o,lis,wh) {
	var h = c.parent().find('.tp-'+wh+'s'),
		ins = h.find('.tp-'+wh+'s-inner-wrapper'),
		mask = h.find('.tp-'+wh+'-mask'),
		cw = o.width*f < o.min_width ? o.min_width : Math.round(o.width*f),
		ch = Math.round((cw/o.width) * o.height),
		iw = o.direction === "vertical" ? cw : (cw*lis) + ((o.space)*(lis-1)),
		ih = o.direction === "vertical" ? (ch*lis) + ((o.space)*(lis-1)) : ch,
		anm = o.direction === "vertical" ? {width:cw+"px"} : {height:ch+"px"};

	tws.add(punchgs.TweenLite.set(h,anm));
	tws.add(punchgs.TweenLite.set(ins,{width:iw+"px",height:ih+"px"}));
	tws.add(punchgs.TweenLite.set(mask,{width:iw+"px",height:ih+"px"}));

	var fin = ins.find('.tp-'+wh+'');
	if (fin)
		jQuery.each(fin,function(i,el) {
			if (o.direction === "vertical")
				tws.add(punchgs.TweenLite.set(el,{top:(i*(ch+parseInt((o.space===undefined? 0:o.space),0))),width:cw+"px",height:ch+"px"}));
			else
			if (o.direction === "horizontal")
				tws.add(punchgs.TweenLite.set(el,{left:(i*(cw+parseInt((o.space===undefined? 0:o.space),0))),width:cw+"px",height:ch+"px"}));
		});
	return tws;
};

// INTERNAL FUNCTIONS
var normalizeWheel = function( event) /*object*/ {
	  var sX = 0, sY = 0,       // spinX, spinY
	      pX = 0, pY = 0,       // pixelX, pixelY
	      PIXEL_STEP = 1,
	      LINE_HEIGHT = 1,
	      PAGE_HEIGHT = 1;

	  // Legacy
	  if ('detail'      in event) { sY = event.detail; }
	  if ('wheelDelta'  in event) { sY = -event.wheelDelta / 120; }
	  if ('wheelDeltaY' in event) { sY = -event.wheelDeltaY / 120; }
	  if ('wheelDeltaX' in event) { sX = -event.wheelDeltaX / 120; }


	  //sY = navigator.userAgent.match(/mozilla/i) ? sY*10 : sY;


	  // side scrolling on FF with DOMMouseScroll
	  if ( 'axis' in event && event.axis === event.HORIZONTAL_AXIS ) {
	    sX = sY;
	    sY = 0;
	  }

	  pX = sX * PIXEL_STEP;
	  pY = sY * PIXEL_STEP;

	  if ('deltaY' in event) { pY = event.deltaY; }
	  if ('deltaX' in event) { pX = event.deltaX; }



	  if ((pX || pY) && event.deltaMode) {
	    if (event.deltaMode == 1) {          // delta in LINE units
	      pX *= LINE_HEIGHT;
	      pY *= LINE_HEIGHT;
	    } else {                             // delta in PAGE units
	      pX *= PAGE_HEIGHT;
	      pY *= PAGE_HEIGHT;
	    }
	  }

	  // Fall-back if spin cannot be determined
	  if (pX && !sX) { sX = (pX < 1) ? -1 : 1; }
	  if (pY && !sY) { sY = (pY < 1) ? -1 : 1; }

	  pY = navigator.userAgent.match(/mozilla/i) ? pY*10 : pY;

	  if (pY>300 || pY<-300) pY = pY/10;

	  return { spinX  : sX,
	           spinY  : sY,
	           pixelX : pX,
	           pixelY : pY };
};

var initKeyboard = function(id) {
	if (_R[id].navigation.keyboardNavigation!==true)  return;
	jQuery(document).keydown(function(e){
		if ((_R[id].navigation.keyboard_direction=="horizontal" && e.keyCode == 39) || (_R[id].navigation.keyboard_direction=="vertical" && e.keyCode==40)) {
			_R[id].sc_indicator="arrow";
			_R[id].sc_indicator_dir = 0;
			_R.callingNewSlide(id,1);
		}
		if ((_R[id].navigation.keyboard_direction=="horizontal" && e.keyCode == 37) || (_R[id].navigation.keyboard_direction=="vertical" && e.keyCode==38)) {
			_R[id].sc_indicator="arrow";
			_R[id].sc_indicator_dir = 1;
			_R.callingNewSlide(id,-1);
		}
	});
};



var initMouseScroll = function(id) {

	if (_R[id].navigation.mouseScrollNavigation!==true && _R[id].navigation.mouseScrollNavigation!=="on" && _R[id].navigation.mouseScrollNavigation!=="carousel") return;
	_R[id].isIEEleven = !!navigator.userAgent.match(/Trident.*rv\:11\./);
	_R[id].isSafari = !!navigator.userAgent.match(/safari/i);
	_R[id].ischrome = !!navigator.userAgent.match(/chrome/i);


	var bl = _R[id].ischrome ? -49 : _R[id].isIEEleven || _R[id].isSafari ? -9 : navigator.userAgent.match(/mozilla/i) ?  -29 :  -49,
		tl = _R[id].ischrome ? 49 : _R[id].isIEEleven || _R[id].isSafari ? 9 : navigator.userAgent.match(/mozilla/i) ? 29 :  49;

	_R[id].c.on('mousewheel DOMMouseScroll', function(e) {
		var res = normalizeWheel(e.originalEvent),
			ret = true,
			fs = _R[id].pr_active_key==0 || _R[id].pr_processing_key == 0,
			ls = _R[id].pr_active_key==_R[id].slideamount-1 ||  _R[id].pr_processing_key == _R[id].slideamount-1;
		if (_R[id].navigation.mouseScrollNavigation=="carousel") fs = ls = false;
		if (_R[id].pr_processing_key===undefined) {
			if (res.pixelY<bl) {
				if (!fs) {
					_R[id].sc_indicator="arrow";
					if (_R[id].navigation.mouseScrollReverse!=="reverse") {
						_R[id].sc_indicator_dir = 1;
						_R.callingNewSlide(id,-1);
					}
					ret = false;
				}
				if (!ls) {
					_R[id].sc_indicator="arrow";
					if (_R[id].navigation.mouseScrollReverse==="reverse") {
						_R[id].sc_indicator_dir = 0;
						_R.callingNewSlide(id,1);
					}
					ret = false;
				}
			} else
			if (res.pixelY>tl) {
				if (!ls) {
					 	_R[id].sc_indicator="arrow";
					 	if (_R[id].navigation.mouseScrollReverse!=="reverse") {
							_R[id].sc_indicator_dir = 0;
							_R.callingNewSlide(id,1);
						}
						ret = false;
					}
					if (!fs) {
						_R[id].sc_indicator="arrow";
						if (_R[id].navigation.mouseScrollReverse==="reverse") {
							_R[id].sc_indicator_dir = 1;
							_R.callingNewSlide(id,-1);
						}
						ret = false;
					}
			}
		} else ret = false;

		var tc = _R[id].c.offset().top-jQuery('body').scrollTop(),
			bc = tc+_R[id].c.height();
		if (_R[id].navigation.mouseScrollNavigation!="carousel") {
			if (_R[id].navigation.mouseScrollReverse!=="reverse")
				if ((tc>0 && res.pixelY>0) || (bc<jQuery(window).height() && res.pixelY<0))
					ret = true;
			if (_R[id].navigation.mouseScrollReverse==="reverse")
				if ((tc<0 && res.pixelY<0) || (bc>jQuery(window).height() && res.pixelY>0))
					ret = true;
		} else {
			ret=false;
		}

		if (!ret) {
			e.preventDefault(e);
			return false;
		} else  return;

	});


};

var isme = function (a,c,e) {
		a =  _ISM ? jQuery(e.target).closest(a).length || jQuery(e.srcElement).closest(a).length : jQuery(e.toElement).closest(a).length || jQuery(e.originalTarget).closest(a).length;
		return a === true || a=== 1 ? 1 : 0;
};

// 	-	SET THE SWIPE FUNCTION //


var swipeAction = function(container,id,vertical) {


	// TOUCH ENABLED SCROLL
	var _ = _R[id].carousel;
	jQuery(".bullet, .bullets, .tp-bullets, .tparrows").addClass("noSwipe");

	_.Limit = "endless";
	var SwipeOn =  container, //notonbody ? container : jQuery('body'),
		pagescroll = _R[id].navigation.thumbnails.direction==="vertical" || _R[id].navigation.tabs.direction==="vertical"? "none" : "vertical",
		swipe_wait_dir = _R[id].navigation.touch.swipe_direction || "horizontal";

	pagescroll = vertical == "swipebased" && swipe_wait_dir=="vertical" ? "none" : vertical ? "vertical" : pagescroll;

	if (!jQuery.fn.swipetp) jQuery.fn.swipetp = jQuery.fn.swipe;
	if (!jQuery.fn.swipetp.defaults || !jQuery.fn.swipetp.defaults.excludedElements)
		if (!jQuery.fn.swipetp.defaults)
      jQuery.fn.swipetp.defaults = {};

	jQuery.fn.swipetp.defaults.excludedElements = "label, button, input, select, textarea, .noSwipe";

	SwipeOn.swipetp({
		allowPageScroll:pagescroll,
		triggerOnTouchLeave:true,
		treshold:_R[id].navigation.touch.swipe_treshold,
		fingers:_R[id].navigation.touch.swipe_min_touches>5 ? 1 : _R[id].navigation.touch.swipe_min_touches,

		excludeElements:jQuery.fn.swipetp.defaults.excludedElements,

		swipeStatus:function(event,phase,direction,distance,duration,fingerCount,fingerData) {




			var withinslider = isme('rs-module-wrap',container,event),
				withinthumbs =  isme('.tp-thumbs',container,event),
				withintabs =  isme('.tp-tabs',container,event),
				starget = jQuery(this).attr('class'),
				istt = starget.match(/tp-tabs|tp-thumb/gi) ? true : false;



			// SWIPE OVER SLIDER, TO SWIPE SLIDES IN CAROUSEL MODE
			if (_R[id].sliderType==="carousel" &&
				(((phase==="move" || phase==="end" || phase=="cancel") &&  (_R[id].dragStartedOverSlider && !_R[id].dragStartedOverThumbs && !_R[id].dragStartedOverTabs)) || (phase==="start" && withinslider>0 && withinthumbs===0 && withintabs===0))) {

				if (_ISM && (direction ==="up" || direction==="down")) return;
				if (_.positionanim!==undefined) _.positionanim.pause();
				_R[id].dragStartedOverSlider = true;
				distance = (direction && direction.match(/left|up/g)) ?  Math.round(distance * -1) : distance = Math.round(distance * 1);


				switch (phase) {
					case "start":
						if (_.positionanim!==undefined) {
								_.positionanim.kill();
								_.slide_globaloffset = _.infinity==="off" ? _.slide_offset : _R.simp(_.slide_offset, _.maxwidth);
						}
						_.overpull = "none";
						_.wrap.addClass("dragged");

					break;
					case "move":
							if (Math.abs(distance)>=10 || _R[id].carousel.isDragged) {
								_R[id].carousel.isDragged = true;
								_R[id].c.find('.rs-waction').addClass("tp-temporarydisabled");
								_.slide_offset = _.infinity==="off" ? _.slide_globaloffset + distance : _R.simp(_.slide_globaloffset + distance, _.maxwidth);

								if (_.infinity==="off") {
									var bb = _.horizontal_align==="center" ? ((_.wrapwidth/2-_.slide_width/2) - _.slide_offset) / _.slide_width : (0 - _.slide_offset) / _.slide_width;

									if ((_.overpull ==="none" || _.overpull===0)  && (bb<0 || bb>_R[id].slideamount-1))
										_.overpull =  distance;
									else
									if (bb>=0 && bb<=_R[id].slideamount-1 && ((bb>=0 && distance>_.overpull) || (bb<=_R[id].slideamount-1 && distance<_.overpull)))
										_.overpull = 0;

									_.slide_offset = bb<0 ? _.slide_offset+ (_.overpull-distance)/1.1 + Math.sqrt(Math.abs((_.overpull-distance)/1.1)) :
									 bb>_R[id].slideamount-1 ? _.slide_offset+ (_.overpull-distance)/1.1 - Math.sqrt(Math.abs((_.overpull-distance)/1.1)) : _.slide_offset ;
								 }
								_R.organiseCarousel(id,direction,true,true);
							}
					break;

					case "end":
					case "cancel":
							//duration !!
							_R[id].carousel.isDragged = false;
							_.slide_globaloffset = _.slide_offset;
							_.wrap.removeClass("dragged");
							_R.carouselToEvalPosition(id,direction);
							_R[id].dragStartedOverSlider = false;
							_R[id].dragStartedOverThumbs = false;
							_R[id].dragStartedOverTabs = false;
							setTimeout(function() {
								_R[id].c.find('.rs-waction').removeClass("tp-temporarydisabled");
							},19);
					break;
				}
			}  else

			// SWIPE OVER THUMBS OR TABS
			if ((
				((phase==="move" || phase==="end" || phase=="cancel") &&  (!_R[id].dragStartedOverSlider && (_R[id].dragStartedOverThumbs || _R[id].dragStartedOverTabs))) ||
				(phase==="start" && (withinslider>0 && (withinthumbs>0 || withintabs>0))))) {


				if (withinthumbs>0) _R[id].dragStartedOverThumbs = true;
				if (withintabs>0) _R[id].dragStartedOverTabs = true;

				var thumbs = _R[id].dragStartedOverThumbs ? ".tp-thumbs" : ".tp-tabs",
					thumbmask = _R[id].dragStartedOverThumbs ? ".tp-thumb-mask" : ".tp-tab-mask",
					thumbsiw = _R[id].dragStartedOverThumbs ? ".tp-thumbs-inner-wrapper" : ".tp-tabs-inner-wrapper",
					thumb = _R[id].dragStartedOverThumbs ? ".tp-thumb" : ".tp-tab",
					_o = _R[id].dragStartedOverThumbs ? _R[id].navigation.thumbnails : _R[id].navigation.tabs;


				distance = (direction && direction.match(/left|up/g)) ?  Math.round(distance * -1) : distance = Math.round(distance * 1);
				var t= container.parent().find(thumbmask),
					el = t.find(thumbsiw),
					tdir = _o.direction,
					els = tdir==="vertical" ? el.height() : el.width(),
					ts =  tdir==="vertical" ? t.height() : t.width(),
					tw = tdir==="vertical" ? t.find(thumb).first().outerHeight(true)+_o.space : t.find(thumb).first().outerWidth(true)+_o.space,
					newpos =  (el.data('offset') === undefined ? 0 : parseInt(el.data('offset'),0)),
					curpos = 0;

				switch (phase) {
					case "start":
						container.parent().find(thumbs).addClass("dragged");
						newpos = tdir === "vertical" ? el.position().top : el.position().left;
						el.data('offset',newpos);
						if (el.data('tmmove')) el.data('tmmove').pause();

					break;
					case "move":
							if (els<=ts) return false;

							curpos = newpos + distance;
							curpos = curpos>0 ? tdir==="horizontal" ? curpos - (el.width() * (curpos/el.width() * curpos/el.width())) : curpos - (el.height() * (curpos/el.height() * curpos/el.height())) : curpos;
							var dif = tdir==="vertical" ? 0-(el.height()-t.height()) : 0-(el.width()-t.width());
							curpos = curpos < dif ? tdir==="horizontal" ? curpos + (el.width() * (curpos-dif)/el.width() * (curpos-dif)/el.width()) : curpos + (el.height() * (curpos-dif)/el.height() * (curpos-dif)/el.height()) : curpos;
							if (tdir==="vertical")
								punchgs.TweenLite.set(el,{top:curpos+"px"});
							else
								punchgs.TweenLite.set(el,{left:curpos+"px"});
					break;

					case "end":
					case "cancel":

						if (istt) {
							curpos = newpos + distance;

							curpos = tdir==="vertical" ? curpos < 0-(el.height()-t.height()) ? 0-(el.height()-t.height()) : curpos : curpos < 0-(el.width()-t.width()) ? 0-(el.width()-t.width()) : curpos;
							curpos = curpos > 0 ? 0 : curpos;

							curpos = Math.abs(distance)>tw/10 ? distance<=0 ? Math.floor(curpos/tw)*tw : Math.ceil(curpos/tw)*tw : distance<0 ? Math.ceil(curpos/tw)*tw : Math.floor(curpos/tw)*tw;

							curpos = tdir==="vertical" ? curpos < 0-(el.height()-t.height()) ? 0-(el.height()-t.height()) : curpos : curpos < 0-(el.width()-t.width()) ? 0-(el.width()-t.width()) : curpos;
							curpos = curpos > 0 ? 0 : curpos;

							if (tdir==="vertical")
								punchgs.TweenLite.to(el,0.5,{top:curpos+"px",ease:punchgs.Power3.easeOut});
							else
								punchgs.TweenLite.to(el,0.5,{left:curpos+"px",ease:punchgs.Power3.easeOut});

							curpos = !curpos ?  tdir==="vertical" ? el.position().top : el.position().left : curpos;

							el.data('offset',curpos);
							el.data('distance',distance);

							setTimeout(function() {
								_R[id].dragStartedOverSlider = false;
								_R[id].dragStartedOverThumbs = false;
								_R[id].dragStartedOverTabs = false;
							},100);
							container.parent().find(thumbs).removeClass("dragged");

							return false;
						}
					break;
				}
			}
			else  {
				if (phase=="end" && !istt) {

					_R[id].sc_indicator="arrow";

					if ((swipe_wait_dir=="horizontal" && direction == "left") || (swipe_wait_dir=="vertical" && direction == "up")) {
						_R[id].sc_indicator_dir = 0;
						_R.callingNewSlide(id,1);
						return false;
					}
					if ((swipe_wait_dir=="horizontal" && direction == "right") || (swipe_wait_dir=="vertical" && direction == "down")) {
						_R[id].sc_indicator_dir = 1;
						_R.callingNewSlide(id,-1);
						return false;
					}

				}
				_R[id].dragStartedOverSlider = false;
				_R[id].dragStartedOverThumbs = false;
				_R[id].dragStartedOverTabs = false;
				return true;
			}
		}
	});
};


// NAVIGATION HELPER FUNCTIONS
var hdResets = function(o) {

	o.hide_delay = !jQuery.isNumeric(parseInt(o.hide_delay,0)) ? 0.2 : o.hide_delay;
	o.hide_delay_mobile = !jQuery.isNumeric(parseInt(o.hide_delay_mobile,0)) ? 0.2 : o.hide_delay_mobile;
};

var ckNO = function(s) {
 	return s && s.enable;
};


var ct = function(a) {
	clearTimeout(a);
};

var showNavElements = function(id) {
	var nt = _R[id].navigation.maintypes;
	for (var i in nt)
		if (nt.hasOwnProperty(i))
			if (ckNO(_R[id].navigation[nt[i]])) {
				ct(_R[id].navigation[nt[i]].showCall);
				_R[id].navigation[nt[i]].showCall = setTimeout(function(a) {
					ct(a.hideCall);
					if  (!(a.hide_onleave && !_R[id].cpar.hasClass("tp-mouseover")))
						if (a.tween===undefined)
							a.tween = showHideNavElements(a);
						else
							a.tween.play();
				},(_R[id].navigation[nt[i]].hide_onleave && !_R[id].cpar.hasClass("tp-mouseover") ? 0 : parseInt(_R[id].navigation[nt[i]].animDelay)),_R[id].navigation[nt[i]]);
			}

};

var hidaNavElements = function(id,removeClass) {
	var nt = _R[id].navigation.maintypes;
	for (var i in nt)
		if (nt.hasOwnProperty(i))
			if (_R[id].navigation[nt[i]]!==undefined && _R[id].navigation[nt[i]].hide_onleave && ckNO(_R[id].navigation[nt[i]])) {
				ct(_R[id].navigation[nt[i]].hideCall);
				_R[id].navigation[nt[i]].hideCall = setTimeout(function(a) {
					ct(a.showCall);
					if (a.tween) a.tween.reverse();
				},(_ISM ? parseInt(_R[id].navigation[nt[i]].hide_delay_mobile,0) : parseInt(_R[id].navigation[nt[i]].hide_delay,0)),_R[id].navigation[nt[i]]);
			}
};


var showHideNavElements = function(a) {
	a.speed = a.speed===undefined ? 0.5 : a.speed;
	a.anims = [];
	if (a.anim!==undefined && a.left===undefined) a.anims.push(a.anim);
	if (a.left!==undefined) a.anims.push(a.left.anim);
	if (a.right!==undefined) a.anims.push(a.right.anim);


	var tw = new punchgs.TimelineLite();
	tw.add(punchgs.TweenLite.to(a.c,a.speed, {autoAlpha:1,opacity:1,ease:punchgs.Power3.easeInOut}),0);
	for (var i in a.anims) {
		if (!a.anims.hasOwnProperty(i)) continue;
		switch (a.anims[i]) {
			case "left":tw.add(punchgs.TweenLite.fromTo(a.c[i],a.speed, {marginLeft:-50},{marginLeft:0,ease:punchgs.Power3.easeInOut}),0);break;
			case "right":tw.add(punchgs.TweenLite.fromTo(a.c[i],a.speed, {marginLeft:50},{marginLeft:0,ease:punchgs.Power3.easeInOut}),0);break;
			case "top":tw.add(punchgs.TweenLite.fromTo(a.c[i],a.speed, {marginTop:-50},{marginTop:0,ease:punchgs.Power3.easeInOut}),0);break;
			case "bottom":tw.add(punchgs.TweenLite.fromTo(a.c[i],a.speed, {marginTop:50},{marginTop:0,ease:punchgs.Power3.easeInOut}),0);break;
			case "zoomin":tw.add(punchgs.TweenLite.fromTo(a.c[i],a.speed, {scale:0.5},{scale:1,ease:punchgs.Power3.easeInOut}),0);break;
			case "zoomout":tw.add(punchgs.TweenLite.fromTo(a.c[i],a.speed, {scale:1.2},{scale:1,ease:punchgs.Power3.easeInOut}),0);break;
		}
	}
	tw.play();
	return tw;
};


// ADD ARROWS
var initArrows = function(o,id) {

	// SET oIONAL CLASSES
	o.style = o.style === undefined ? "" : o.style;
	o.left.style = o.left.style === undefined ? "" : o.left.style;
	o.right.style = o.right.style === undefined ? "" : o.right.style;


	// ADD LEFT AND RIGHT ARROWS
	if (_R[id].c.find('.tp-leftarrow.tparrows').length===0)
		_R[id].c.append('<rs-arrow style="opacity:0" class="tp-leftarrow tparrows '+o.style+' '+o.left.style+'">'+o.tmp+'</rs-arrow>');
	if (_R[id].c.find('.tp-rightarrow.tparrows').length===0)
		_R[id].c.append('<rs-arrow style="opacity:0"  class="tp-rightarrow tparrows '+o.style+' '+o.right.style+'">'+o.tmp+'</rs-arrow>');
	var la = _R[id].c.find('.tp-leftarrow.tparrows'),
		ra = _R[id].c.find('.tp-rightarrow.tparrows');
	if (o.rtl) {
		// CLICK HANDLINGS ON LEFT AND RIGHT ARROWS
		la.click(function() { if (_R[id].sliderType==="carousel") _R[id].ctNavElement=true;_R[id].sc_indicator="arrow"; _R[id].sc_indicator_dir = 0;_R[id].c.revnext();});
		ra.click(function() { if (_R[id].sliderType==="carousel") _R[id].ctNavElement=true;_R[id].sc_indicator="arrow"; _R[id].sc_indicator_dir = 1;_R[id].c.revprev();});
	} else {
		// CLICK HANDLINGS ON LEFT AND RIGHT ARROWS
		ra.click(function() { if (_R[id].sliderType==="carousel") _R[id].ctNavElement=true;_R[id].sc_indicator="arrow"; _R[id].sc_indicator_dir = 0;_R[id].c.revnext();});
		la.click(function() { if (_R[id].sliderType==="carousel") _R[id].ctNavElement=true;_R[id].sc_indicator="arrow"; _R[id].sc_indicator_dir = 1;_R[id].c.revprev();});
	}
	// SHORTCUTS
	o.right.j = _R[id].c.find('.tp-rightarrow.tparrows');
	o.left.j = _R[id].c.find('.tp-leftarrow.tparrows');

	// OUTTUER PADDING DEFAULTS
	o.padding_top = parseInt((_R[id].carousel.padding_top||0),0);
	o.padding_bottom = parseInt((_R[id].carousel.padding_bottom||0),0);

	// POSITION OF ARROWS
	setNavElPositions(la,o.left,id);
	setNavElPositions(ra,o.right,id);

	if (o.position=="outer-left" || o.position=="outer-right") _R[id].outernav = true;
};


// PUT ELEMENTS VERTICAL / HORIZONTAL IN THE RIGHT POSITION
var putVinPosition = function(el,o,id) {

	var elh = el.outerHeight(true),
		oh = _R[id]== undefined ? 0 : _R[id].conh == 0 ? _R[id].height : _R[id].conh,
		by = o.container=="layergrid" ? _R[id].sliderLayout=="fullscreen" ? _R[id].height/2 - (_R[id].gridheight[_R[id].level]*_R[id].bh)/2 : (_R[id].autoHeight || (_R[id].minHeight!=undefined && _R[id].minHeight>0)) ?
						oh/2 - (_R[id].gridheight[_R[id].level]*_R[id].bh)/2
						: 0
			: 0,
		a = o.v_align === "top" ? {top:"0px",y:Math.round(o.v_offset+by)+"px"} : o.v_align === "center" ? {top:"50%",y:Math.round(((0-elh/2)+o.v_offset))+"px"} : {top:"100%",y:Math.round((0-(elh+o.v_offset+by)))+"px"};
	if (!el.hasClass("outer-bottom")) punchgs.TweenLite.set(el,a);

};

var putHinPosition = function(el,o,id) {

	var elw = el.outerWidth(true),
		bx = o.container==="layergrid" ? _R[id].width/2 - (_R[id].gridwidth[_R[id].level]*_R[id].bw)/2 : 0,
		a = o.h_align === "left" ? {left:"0px",x:Math.round(o.h_offset+bx)+"px"} : o.h_align === "center" ? {left:"50%",x:Math.round(((0-elw/2)+o.h_offset))+"px"} : {left:"100%",x:Math.round((0-(elw+o.h_offset+bx)))+"px"};

	punchgs.TweenLite.set(el,a);
};

// SET POSITION OF ELEMENTS
var setNavElPositions = function(el,o,id) {

	var ff = (_R[id].sliderLayout=="fullwidth" || _R[id].sliderLayout=="fullscreen"),
		ww = ff ? _R[id].c.width() : _R[id].topc.width(),
		wh = _R[id].c.height();

	putVinPosition(el,o,id);
	putHinPosition(el,o,id);

	if (o.position==="outer-left" && ff)
		punchgs.TweenLite.set(el,{left:(0-el.outerWidth())+"px",x:o.h_offset+"px"});
	else
	if (o.position==="outer-right" && ff)
		punchgs.TweenLite.set(el,{right:(0-el.outerWidth())+"px",x:o.h_offset+"px"});


	// MAX WIDTH AND HEIGHT BASED ON THE SOURROUNDING CONTAINER
	if (el.hasClass("tp-thumbs") || el.hasClass("tp-tabs")) {

		var wpad = el.data('wr_padding'),
			maxw = el.data('maxw'),
			maxh = el.data('maxh'),
			mask = el.hasClass("tp-thumbs") ? el.find('.tp-thumb-mask') : el.find('.tp-tab-mask'),
			cpt = parseInt((o.padding_top||0),0),
			cpb = parseInt((o.padding_bottom||0),0),
			_el = {},
			_mask = {};


		//maxw : Width of Thumbnail Container
		//ww : width of wrapper container
		//


		if (maxw>ww && o.position!=="outer-left" && o.position!=="outer-right") {
			_el.left = "0px";
			_el.x = 0;
			_el.maxWidth = (ww-2*wpad)+"px";
			_mask.maxWidth = (ww-2*wpad)+"px";
		} else {
			_el.maxWidth = maxw;
			_mask.maxWidth = ww+"px";
		}


		if (maxh+2*wpad>wh && o.position!=="outer-bottom" && o.position!=="outer-top") {
			_el.top = "0px";
			_el.y = 0;
			_el.maxHeight = (cpt+cpb+(wh-2*wpad))+"px";
			_mask.maxHeight = (cpt+cpb+(wh-2*wpad))+"px";
		} else {
			_el.maxHeight = maxh+"px";
			_mask.maxHeight = maxh+"px";
		}


		// SPAN IS ENABLED
		if (o.span) {
			if (o.container=="layergrid" && o.position!=="outer-left" && o.position!=="outer-right") cpt = cpb = 0;
			if (o.direction==="vertical") {
				_el.maxHeight = (cpt+cpb+(wh-2*wpad))+"px";
				_el.height = (cpt+cpb+(wh-2*wpad))+"px";
				_el.top = (0-cpt);
				_el.y = 0;
				_mask.maxHeight = 	(cpt+cpb+(Math.min(maxh,(wh-2*wpad))))+"px";
				punchgs.TweenLite.set(el,_el);
				punchgs.TweenLite.set(mask,_mask);
				putVinPosition(mask,o,id);
			} else
			if (o.direction==="horizontal") {
				_el.maxWidth = "100%";
				_el.width = (ww-2*wpad)+"px";
				_el.left = 0;
				_el.x = 0;
				_mask.maxWidth = maxw>=ww ? "100%" : (Math.min(maxw,ww))+"px";


				punchgs.TweenLite.set(el,_el);
				punchgs.TweenLite.set(mask,_mask);
				putHinPosition(mask,o,id);
			}
		} else {

			punchgs.TweenLite.set(el,_el);
			punchgs.TweenLite.set(mask,_mask);
		}
	}
};

// ADD A BULLET
var addBullet = function(container,o,li,id) {

	// Check if Bullet exists already ?
	if (container.find('.tp-bullets').length===0) {
		o.style = o.style === undefined ? "" : o.style;
		container.append('<rs-bullets style="opacity:0"  class="tp-bullets '+o.style+' '+o.direction+'"></rs-bullets>');
	}

	// Add Bullet Structure to the Bullet Container
	var bw = container.find('.tp-bullets'),
		 linkto = li.data('key'),
		 inst = o.tmp;

	if (_R[id].thumbs[li.index()]!==undefined) jQuery.each(_R[id].thumbs[li.index()].params,function(i,obj) { inst = inst.replace(obj.from,obj.to);});


	bw.append('<rs-bullet data-key="'+linkto+'" class="justaddedbullet tp-bullet">'+inst+'</rs-bullet>');

	// SET BULLET SPACES AND POSITION
	var b = container.find('.justaddedbullet'),
		am = container.find('.tp-bullet').length,
		w = b.outerWidth()+parseInt((o.space===undefined? 0:o.space),0),
		h = b.outerHeight()+parseInt((o.space===undefined? 0:o.space),0);

	if (o.direction==="vertical") {
		b.css({top:((am-1)*h)+"px", left:"0px"});
		bw.css({height:(((am-1)*h) + b.outerHeight()),width:b.outerWidth()});
	}
	else {
		b.css({left:((am-1)*w)+"px", top:"0px"});
		bw.css({width:(((am-1)*w) + b.outerWidth()),height:b.outerHeight()});
	}
	if (_R[id].thumbs[li.index()]!==undefined)
		b.find('.tp-bullet-image').css({backgroundImage:'url('+_R[id].thumbs[li.index()].src+')'});
	// SET LINK TO AND LISTEN TO CLICK
	b.click(function() {
		_R[id].sc_indicator="bullet";
		container.revcallslidewithid(linkto);
		container.find('.tp-bullet').removeClass("selected");
		jQuery(this).addClass("selected");
	});
	// REMOVE HELP CLASS
	b.removeClass("justaddedbullet");

	// OUTTUER PADDING DEFAULTS
	o.padding_top = parseInt((_R[id].carousel.padding_top||0),0);
	o.padding_bottom = parseInt((_R[id].carousel.padding_bottom||0),0);

	if (o.position=="outer-left" || o.position=="outer-right") _R[id].outernav = true;

	bw.addClass("nav-pos-hor-"+o.h_align);
	bw.addClass("nav-pos-ver-"+o.v_align);
	bw.addClass("nav-dir-"+o.direction);

	// PUT ALL CONTAINER IN POSITION
	setNavElPositions(bw,o,id);
};


// ADD THUMBNAILS
var addThumb = function(container,o,li,what,id) {

	var thumbs = what==="tp-thumb" ? ".tp-thumbs" : ".tp-tabs",
		thumbmask = what==="tp-thumb" ? ".tp-thumb-mask" : ".tp-tab-mask",
		thumbsiw = what==="tp-thumb" ? ".tp-thumbs-inner-wrapper" : ".tp-tabs-inner-wrapper",
		thumb = what==="tp-thumb" ? ".tp-thumb" : ".tp-tab",
		timg = what ==="tp-thumb" ? ".tp-thumb-image" : ".tp-tab-image",
		tag = what==="tp-thumb" ? 'rs-thumb' : 'rs-tab';

	o.visibleAmount = o.visibleAmount>_R[id].slideamount ? _R[id].slideamount : o.visibleAmount;
	o.sliderLayout = _R[id].sliderLayout;


	// Check if THUNBS/TABS exists already ?
	if (container.parent().find(thumbs).length===0) {
		o.style = o.style === undefined ? "" : o.style;


		var spanw = o.span===true ? "tp-span-wrapper" : "",
			addcontent = '<'+tag+'s style="opacity:0" class="'+what+'s '+spanw+" "+o.position+" "+o.style+'"><rs-navmask class="'+what+'-mask"><'+tag+'s-wrap class="'+what+'s-inner-wrapper" style="position:relative;"></'+tag+'s-wrap></rs-navmask></'+tag+'s>';

		if (o.position==="outer-top")
			container.parent().prepend(addcontent);
		else
		if (o.position==="outer-bottom")
			container.after(addcontent);
		else
			container.append(addcontent);

		if (o.position==="outer-left" || o.position==="outer-right") punchgs.TweenLite.set(_R[id].c,{overflow:"visible"});

		// OUTTUER PADDING DEFAULTS
		o.padding_top = parseInt((_R[id].carousel.padding_top||0),0);
		o.padding_bottom = parseInt((_R[id].carousel.padding_bottom||0),0);

		if (o.position=="outer-left" || o.position=="outer-right") _R[id].outernav = true;
	}



	// Add Thumb/TAB Structure to the THUMB/TAB Container
	var linkto = li.data('key'),
		t = container.parent().find(thumbs),
		tm = t.find(thumbmask),
		tw = tm.find(thumbsiw),
		maxw = o.direction==="horizontal" ? (o.width * o.visibleAmount) + (o.space*(o.visibleAmount-1)) : o.width,
		maxh = o.direction==="horizontal" ? o.height : (o.height * o.visibleAmount) + (o.space*(o.visibleAmount-1)),
		inst = o.tmp;
		if (_R[id].thumbs[li.index()] !== undefined)
		jQuery.each(_R[id].thumbs[li.index()].params,function(i,obj) {
			inst = inst.replace(obj.from,obj.to);
		});


		tw.append('<'+tag+' data-liindex="'+li.index()+'" data-key="'+linkto+'" class="justaddedthumb '+what+'" style="width:'+o.width+'px;height:'+o.height+'px;">'+inst+'<'+tag+'>');


	// SET BULLET SPACES AND POSITION
	var b = t.find('.justaddedthumb'),
		am = t.find(thumb).length,
		w = b.outerWidth()+parseInt((o.space===undefined? 0:o.space),0),
		h = b.outerHeight()+parseInt((o.space===undefined? 0:o.space),0);



	// FILL CONTENT INTO THE TAB / THUMBNAIL
	b.find(timg).css({backgroundImage:"url("+_R[id].thumbs[li.index()].src+")"});


	if (o.direction==="vertical") {
		b.css({top:((am-1)*h)+"px", left:"0px"});
		tw.css({height:(((am-1)*h) + b.outerHeight()),width:b.outerWidth()});
	}
	else {
		b.css({left:((am-1)*w)+"px", top:"0px"});
		tw.css({width:(((am-1)*w) + b.outerWidth()),height:b.outerHeight()});
	}

	t.data('maxw',maxw);
	t.data('maxh',maxh);

	t.data('wr_padding',o.wrapper_padding);
	var position = o.position === "outer-top" || o.position==="outer-bottom" ? "relative" : "absolute";
		//_margin = (o.position === "outer-top" || o.position==="outer-bottom") && (o.h_align==="center") ? "auto" : "0";


	tm.css({maxWidth:maxw+"px",maxHeight:maxh+"px",overflow:"hidden",position:"relative"});
	t.css({maxWidth:(maxw)+"px",/*margin:_margin, */maxHeight:maxh+"px",overflow:"visible",position:position,background:o.wrapper_color,padding:o.wrapper_padding+"px",boxSizing:"contet-box"});



	// SET LINK TO AND LISTEN TO CLICK
	b.click(function() {

		_R[id].sc_indicator="bullet";
		var dis = container.parent().find(thumbsiw).data('distance');
		dis = dis === undefined ? 0 : dis;
		if (Math.abs(dis)<10) {
			container.revcallslidewithid(linkto);
			container.parent().find(thumbs).removeClass("selected");
			jQuery(this).addClass("selected");

		}
	});
	// REMOVE HELP CLASS
	b.removeClass("justaddedthumb");

	t.addClass("nav-pos-hor-"+o.h_align);
	t.addClass("nav-pos-ver-"+o.v_align);
	t.addClass("nav-dir-"+o.direction);

	// PUT ALL CONTAINER IN POSITION
	setNavElPositions(t,o,id);
	_R.callContWidthManager(id);
};

var setONHeights = function(id) {
	var ot = _R[id].cpar.find('.outer-top'),
		ob = _R[id].cpar.find('.outer-bottom');
	_R[id].top_outer = !ot.hasClass("tp-forcenotvisible") ? ot.outerHeight() || 0 : 0;
	_R[id].bottom_outer = !ob.hasClass("tp-forcenotvisible") ? ob.outerHeight() || 0 : 0;
};


// HIDE NAVIGATION ON PURPOSE
var biggerNav = function(el,a,b,c) {
	if (a>b || b>c)
		el.addClass("tp-forcenotvisible");
	else
		el.removeClass("tp-forcenotvisible");
};

})(jQuery);

