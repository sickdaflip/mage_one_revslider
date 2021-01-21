/********************************************
 * REVOLUTION 6.0.0 EXTENSION - CAROUSEL
 * @version: 6.0.0 (09.07.2019)
 * @requires rs6.main.js
 * @author ThemePunch
*********************************************/
(function($) {
"use strict";
var _R = jQuery.fn.revolution;

	///////////////////////////////////////////
	// 	EXTENDED FUNCTIONS AVAILABLE GLOBAL  //
	///////////////////////////////////////////
jQuery.extend(true,_R, {

	// CALCULATE CAROUSEL POSITIONS
	prepareCarousel : function(id,a,direction,speed) {
		if (id===undefined) return;
		direction = _R[id].carousel.lastdirection = dircheck(direction,_R[id].carousel.lastdirection);
		setCarouselDefaults(id);
		_R[id].carousel.slide_offset_target = getActiveCarouselOffset(id);
		if (speed!==undefined)
			animateCarousel(id,direction,false,0);
		else
		if (a==undefined)
			_R.carouselToEvalPosition(id,direction);
		else
			animateCarousel(id,direction,false);

	},

	// MOVE FORWARDS/BACKWARDS DEPENDING ON THE OFFSET TO GET CAROUSEL IN EVAL POSITION AGAIN
	carouselToEvalPosition : function(id,direction) {

		var _ = _R[id].carousel;
		direction = _.lastdirection = dircheck(direction,_.lastdirection);

		var bb = _.horizontal_align==="center" ? ((_.wrapwidth/2-_.slide_width/2) - _.slide_globaloffset) / _.slide_width : (0 - _.slide_globaloffset) / _.slide_width,
			fi = _R.simp(bb,_R[id].slideamount,false);

		var cm = fi - Math.floor(fi),
			calc = 0,
			mc = -1 * (Math.ceil(fi) - fi),
			mf = -1 * (Math.floor(fi) - fi);

		calc = cm>=0.3 && direction==="left" || cm>=0.7 && direction==="right" ?  mc : cm<0.3 && direction==="left" || cm<0.7 && direction==="right" ? mf : calc;
		calc = !_.infinity ?  fi<0 ? fi : bb>_R[id].slideamount-1 ? bb-(_R[id].slideamount-1) : calc : calc;
		_.slide_offset_target = calc * _.slide_width;

		// LONGER "SMASH" +/- 1 to Calc
		if (_.slide_offset_target!==_.slide_offset_targetCACHE) {
			if (Math.abs(_.slide_offset_target) !==0) animateCarousel(id,direction,true); else _R.organiseCarousel(id,direction);
			_.slide_offset_targetCACHE= _.slide_offset_target;
		}


	},

	// ORGANISE THE CAROUSEL ELEMENTS IN POSITION AND TRANSFORMS
	organiseCarousel : function(id,direction,setmaind,unli) {

		direction = direction === undefined ||  direction=="down" || direction=="up" || direction===null || jQuery.isEmptyObject(direction) ? "left" : direction;

		var _ = _R[id].carousel,
			slidepositions = [],
			len = _R[id].slides.length;

		for (var i=0;i<len;i++) {
			var pos = (i * _.slide_width) + _.slide_offset;
			if (_.infinity) {
				pos = pos>_.wrapwidth-_.inneroffset && direction=="right" ? _.slide_offset - ((_R[id].slides.length-i)*_.slide_width) : pos;
				pos = pos<0-_.inneroffset-_.slide_width && direction=="left" ? pos + _.maxwidth : pos;
			}
			slidepositions[i] = pos;
		}

		var maxd = 999,
			scaleoffset = 0,
			minl = _R[id].ulw;
		// SECOND RUN FOR NEGATIVE ADJUSTMENETS
		if (_R[id].slides)
		 jQuery.each(_R[id].slides,function(i,slide) {
			var pos = slidepositions[i],
				tr = {};
			if (_.infinity) {
				pos = pos>_.wrapwidth-_.inneroffset+_.slide_width && direction==="left" ? slidepositions[0] - ((len-i)*_.slide_width) : pos;
				pos = pos<0-_.inneroffset-3*_.slide_width ? direction=="left" ? pos + _.maxwidth :  direction==="right" ? slidepositions[len-1] + ((i+1)*_.slide_width) : pos : pos;
				minl = minl>pos ? pos : minl;
				// FIX FOR STRART LEFT INFINITY ISSUES
				if (minl>0 && pos>_.wrapwidth) pos = _.slide_offset - ((_R[id].slides.length-i)*_.slide_width)
			}


			tr.left = pos + _.inneroffset;


			// CHCECK DISTANCES FROM THE CURRENT FAKE FOCUS POSITION
			var d =  _.horizontal_align==="center" ? (Math.abs(_.wrapwidth/2) - (tr.left+_.slide_width/2))/_.slide_width : (_.inneroffset - tr.left)/_.slide_width,
				ha = _.horizontal_align==="center" ? 2 : 1;


			if ((setmaind && Math.abs(d)<maxd) || d===0) {
				maxd = Math.abs(d);
				_.focused = i;
			}

			tr.width =_.slide_width;
			tr.x = 0;
			tr.transformPerspective = 1200;
			tr.transformOrigin = "50% "+_.vertical_align;

			// SET VISIBILITY OF ELEMENT
			if (_.fadeout)
				if (_.vary_fade)
					tr.autoAlpha = 1-Math.abs(((_.maxOpacity/100/Math.ceil(_.maxVisibleItems/ha))*d));
				else
					switch(_.horizontal_align) {
						case "center":
							tr.autoAlpha = Math.abs(d)<Math.ceil((_.maxVisibleItems/ha)-1) ? 1 : 1-(Math.abs(d)-Math.floor(Math.abs(d)));
						break;
						case "left":
							tr.autoAlpha = d<1 &&  d>0 ?  1-d : Math.abs(d)>_.maxVisibleItems-1 ? 1- (Math.abs(d)-(_.maxVisibleItems-1)) : 1;
						break;
						case "right":
							tr.autoAlpha = d>-1 &&  d<0 ?  1-Math.abs(d) : d>_.maxVisibleItems-1 ? 1- (Math.abs(d)-(_.maxVisibleItems-1)) : 1;
						break;
					}
			else
				tr.autoAlpha = Math.abs(d)<Math.ceil((_.maxVisibleItems/ha)) ? 1 : 0;


			// SET SCALE DOWNS
			if (_.minScale!==undefined && _.minScale >0) {
				if (_.vary_scale)
					tr.scale = 1- Math.abs(((_.minScale/100/Math.ceil(_.maxVisibleItems/ha))*d));
				else
					tr.scale = d>=1 || d<=-1 ? 1 - _.minScale/100 : (100-( _.minScale*Math.abs(d)))/100;
				 scaleoffset = d * (tr.width - tr.width*tr.scale)/2;
			}

			// ROTATION FUNCTIONS
			if (_.maxRotation!==undefined && Math.abs(_.maxRotation)!=0)	{
				if (_.vary_rotation) {
					tr.rotationY = Math.abs(_.maxRotation) - Math.abs((1-Math.abs(((1/Math.ceil(_.maxVisibleItems/ha))*d))) * _.maxRotation);
					tr.autoAlpha = Math.abs(tr.rotationY)>90 ? 0 : tr.autoAlpha;
				} else {
					tr.rotationY = d>=1 || d<=-1 ?  _.maxRotation : Math.abs(d)*_.maxRotation;
				}
				tr.rotationY = d<0 ? tr.rotationY*-1 : tr.rotationY;
			}


			// SET SPACES BETWEEN ELEMENTS
			tr.x = ((-1*_.space) * d);
			tr.left = Math.floor(tr.left);
			tr.x = Math.floor(tr.x);

			if (tr.scale!==undefined) tr.x = tr.x + scaleoffset;


			// ZINDEX ADJUSTEMENT
			tr.zIndex = Math.round(100-Math.abs(d*5));

			// TRANSFORM STYLE
			tr.force3D = true;
			tr.transformStyle = _R[id].parallax.type!="3D" && _R[id].parallax.type!="3d" ? "flat" : "preserve-3d";


			// ADJUST TRANSFORMATION OF SLIDE
			punchgs.TweenLite.set(slide,tr);

		});



		if (unli) {

			_.focused = _.focused===undefined ? 0 : _.focused;
			_.oldfocused = _.oldfocused===undefined ? 0 : _.oldfocused;
			_R[id].pr_next_key = _.focused;

			if (_.focused!==_.oldfocused && _R.animateTheLayers) {
				_R.removeTheLayers(jQuery(_R[id].slides[_.oldfocused]),id);
				_R.animateTheLayers({slide:_.focused, id:id, mode:(!_R[id].carousel.allLayersStarted ? "start" : "rebuild")});
			}
			_.oldfocused = _.focused;
			_R[id].c.trigger("revolution.nextslide.waiting");
		}



		/*var ll = _.wrapwidth/2 - _.slide_offset ,
			rl = _.maxwidth+_.slide_offset-_.wrapwidth/2;*/
	}

});

/**************************************************
	-	CAROUSEL FUNCTIONS   -
***************************************************/

var defineCarouselElements = function(id) {

	var _ = _R[id].carousel;

	_.infbackup = _.infinity;
	_.maxVisiblebackup = _.maxVisibleItems;

	// SET DEFAULT OFFSETS TO 0
	_.slide_globaloffset = "none";
	_.slide_offset = 0;

	// SET UL REFERENCE
	_.wrap = _R[id].c.find('rs-carousel-wrap');

	// CHANGE PERSPECTIVE IF PARALLAX 3D SET
	if (_.maxRotation!==0) if (_R[id].parallax.type==="3D" || _R[id].parallax.type==="3d") punchgs.TweenLite.set(_.wrap,{perspective:"1600px",transformStyle:"preserve-3d"});

	if (_.border_radius!==undefined && parseInt(_.border_radius,0) >0) punchgs.TweenLite.set(_R[id].c.find('rs-slide'),{borderRadius:_.border_radius});

};

var setCarouselDefaults = function(id) {

	if (_R[id].bw===undefined) _R.setSize(id);
	var _=_R[id].carousel,
		loff = _R.getHorizontalOffset(_R[id].c,"left"),
		roff = _R.getHorizontalOffset(_R[id].c,"right");

	// IF NO DEFAULTS HAS BEEN DEFINED YET
	if (_.wrap===undefined) defineCarouselElements(id);
	// DEFAULT LI WIDTH SHOULD HAVE THE SAME WIDTH OF TH id WIDTH
	_.slide_width = _.stretch!==true ? _R[id].gridwidth[_R[id].level]*(_R[id].bw===0 ? 1 : _R[id].bw) : _R[id].c.width();
	_.slide_height = _.stretch!==true ? _R[id].gridheight[_R[id].level]*(_R[id].bw===0 ? 1 : _R[id].bw) : _R[id].c.height();
	// CALCULATE CAROUSEL WIDTH
	_.maxwidth = _R[id].slideamount*_.slide_width;
	if (_.maxVisiblebackup>_R[id].slides.length+1)
		_.maxVisibleItems = _R[id].slides.length+2;

	// SET MAXIMUM CAROUSEL WARPPER WIDTH (SHOULD BE AN ODD NUMBER)
	_.wrapwidth = (_.maxVisibleItems * _.slide_width) + ((_.maxVisibleItems - 1) * _.space);
	_.wrapwidth = _R[id].sliderLayout!="auto" ?
		_.wrapwidth>_R[id].c.width() ? _R[id].c.width() : _.wrapwidth :
		_.wrapwidth>_R[id].canvas.width() ? _R[id].canvas.width() : _.wrapwidth;


	// INFINITY MODIFICATIONS
	_.infinity = _.wrapwidth >=_.maxwidth ? false : _.infbackup;


	// SET POSITION OF WRAP CONTAINER
	_.wrapoffset = _.horizontal_align==="center" ? (_R[id].c.width()-roff - loff - _.wrapwidth)/2 : 0;
	_.wrapoffset = _R[id].sliderLayout!="auto" && _R[id].outernav ? 0 : _.wrapoffset < loff ? loff : _.wrapoffset;

	var ovf = ((_R[id].parallax.type=="3D" || _R[id].parallax.type=="3d")) ? "visible" : "hidden";


	if (_.horizontal_align==="right")
		punchgs.TweenLite.set(_.wrap,{left:"auto",right:_.wrapoffset+"px", width:_.wrapwidth, overflow:ovf});
	else
		punchgs.TweenLite.set(_.wrap,{right:"auto",left:_.wrapoffset+"px", width:_.wrapwidth, overflow:ovf});


	// INNER OFFSET FOR RTL
	_.inneroffset = _.horizontal_align==="right" ? _.wrapwidth - _.slide_width : 0;

	// THE REAL OFFSET OF THE WRAPPER
	_.realoffset = (Math.abs(_.wrap.position().left)); // + _R[id].c.width()/2);

	// THE SCREEN WIDTH/2
	_.windhalf = jQuery(window).width()/2;


};


// DIRECTION CHECK
var dircheck = function(d,b) {
	return d===null || jQuery.isEmptyObject(d) ? b : d === undefined ?  "right" : d;
};

// ANIMATE THE CAROUSEL WITH OFFSETS
var animateCarousel = function(id,direction,nsae,speed) {

	var _ = _R[id].carousel;

	direction = _.lastdirection = dircheck(direction,_.lastdirection);

	var animobj = {},
		_ease = nsae ? punchgs.Power2.easeOut : _.easing;

	animobj.from = 0;
	animobj.to = _.slide_offset_target;

	speed = speed===undefined ? _.speed/1000 : speed;
	speed = nsae ? speed * (Math.abs(animobj.to) / _.wrapwidth) : speed;
	if (speed!==0 && speed<0.1 && Math.abs(animobj.to)>25) speed = 0.3;

	if (_.positionanim!==undefined)
		_.positionanim.pause();

	_.positionanim = punchgs.TweenLite.to(animobj,speed,{from:animobj.to,
		onUpdate:function() {
			_.slide_offset = _.slide_globaloffset + animobj.from;
			_.slide_offset = _R.simp(_.slide_offset , _.maxwidth);
			_R.organiseCarousel(id,direction,false,false);

		},
		onComplete:function() {
			_.slide_globaloffset = !_.infinity ? _.slide_globaloffset + _.slide_offset_target : _R.simp(_.slide_globaloffset + _.slide_offset_target, _.maxwidth);
			_.slide_offset = _R.simp(_.slide_offset , _.maxwidth);
			_R.organiseCarousel(id,direction,false,true);

			if (_.focused!==undefined && nsae) {
				_R.callingNewSlide(id,jQuery(_R[id].slides[_.focused]).data('key'),true);
			}
			if (_R[id].sliderType==="carousel" && !_R[id].carousel.fadein) {
				punchgs.TweenLite.to(_R[id].canvas,1,{scale:1,opacity:1});
				_R[id].carousel.fadein=true;
			}

			/*
				For the Particles AddOn, we need to get the "jQuery(slide).offset()" for particle mousemove events
				as the Particles AddOn listens for this "carouselchange" event so we can guarantee that the offset() values are accurate
			*/
			_R[id].c.trigger('revolution.slide.carouselchange', {
				slider:id,
				slideIndex : parseInt(_R[id].pr_active_key,0)+1,
				slideLIIndex : _R[id].pr_active_key,
				slide : _R[id].pr_next_slide,
				currentslide : _R[id].pr_next_slide,
				prevSlideIndex : _R[id].pr_lastshown_key!==undefined ? parseInt(_R[id].pr_lastshown_key,0)+1 : false,
				prevSlideLIIndex : _R[id].pr_lastshown_key!==undefined ? parseInt(_R[id].pr_lastshown_key,0) : false,
				prevSlide : _R[id].pr_lastshown_key!==undefined ? _R[id].slides[_R[id].pr_lastshown_key] : false
			});
			//_R.letItFree(id,true);

		}, ease:_ease});
};


var breduc = function(a,m) {
	return Math.abs(a)>Math.abs(m) ? a>0 ? a - Math.abs(Math.floor(a/(m))*(m)) : a + Math.abs(Math.floor(a/(m))*(m)) : a;
};

// CAROUSEL INFINITY MODE, DOWN OR UP ANIMATION
var getBestDirection = function(a,b,max) {
		var dira = b-a,
			dirb = (b-max) - a;
		dira = breduc(dira,max);
		dirb = breduc(dirb,max);
		return Math.abs(dira)>Math.abs(dirb) ? dirb : dira;
	};

// GET OFFSETS BEFORE ANIMATION
var getActiveCarouselOffset = function(id) {


	var ret = 0,
		_ = _R[id].carousel;

	if (_.positionanim!==undefined) _.positionanim.kill();


	if (_.slide_globaloffset=="none")
		_.slide_globaloffset = ret = _.horizontal_align==="center" ? (_.wrapwidth/2-_.slide_width/2) : 0;
	else {
		_.slide_globaloffset = _.slide_offset;
		_.slide_offset = 0;
		var ci = _R[id].pr_processing_key,
			fi = _.horizontal_align==="center" ? ((_.wrapwidth/2-_.slide_width/2) - _.slide_globaloffset) / _.slide_width : (0 - _.slide_globaloffset) / _.slide_width;

		fi = _R.simp(fi,_R[id].slideamount,false);
		ci = ci>=0 ? ci : _R[id].pr_active_key;
		ci = ci>=0 ? ci : 0;

		ret = !_.infinity ? fi-ci : -getBestDirection(fi,ci,_R[id].slideamount);
		ret = ret *  _.slide_width;
	}
	return ret;
};

})(jQuery);

