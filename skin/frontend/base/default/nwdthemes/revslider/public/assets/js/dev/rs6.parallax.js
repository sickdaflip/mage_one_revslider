/********************************************
 * REVOLUTION 6.0.1 EXTENSION - PARALLAX
 * @version: 6.0.1 (09.07.2019)
 * @requires rs6.main.js
 * @author ThemePunch
*********************************************/
(function($) {
"use strict";
var _R = jQuery.fn.revolution,
	_ISM = _R.is_mobile();

jQuery.extend(true,_R, {


	checkForParallax : function(id) {

		var _ = _R[id].parallax;

		if (_.done) return;
		_.done = true;

		if (_ISM && _.disable_onmobile) return false;


		if (_.type=="3D" || _.type=="3d") {
			punchgs.TweenLite.set(_R[id].c,{overflow:_.ddd_overflow});
			punchgs.TweenLite.set(_R[id].canvas,{overflow:_.ddd_overflow});
			if (_R[id].sliderType!="carousel" && _.ddd_shadow) {
				var dddshadow = jQuery('<div class="dddwrappershadow"></div>');
				punchgs.TweenLite.set(dddshadow,{force3D:"auto",transformPerspective:1600,transformOrigin:"50% 50%", width:"100%",height:"100%",position:"absolute",top:0,left:0,zIndex:0});
				_R[id].c.prepend(dddshadow);
			}
		}

		function setDDDInContainer(li) {
			if (_.type=="3D" || _.type=="3d") {
				li.find('rs-sbg-wrap').wrapAll('<div class="dddwrapper" style="width:100%;height:100%;position:absolute;top:0px;left:0px;overflow:hidden"></div>');
				li.find('.rs-parallax-wrap').wrapAll('<div class="dddwrapper-layer" style="width:100%;height:100%;position:absolute;top:0px;left:0px;z-index:5;overflow:'+_.ddd_layer_overflow+';"></div>');

				// MOVE THE REMOVED 3D LAYERS OUT OF THE PARALLAX GROUP
				li.find('.rs-pxl-tobggroup').closest('.rs-parallax-wrap').wrapAll('<div class="dddwrapper-layertobggroup" style="position:absolute;top:0px;left:0px;z-index:50;width:100%;height:100%"></div>');

				var dddw = li.find('.dddwrapper'),
					dddwl = li.find('.dddwrapper-layer'),
					dddwlbg = li.find('.dddwrapper-layertobggroup');

				dddwlbg.appendTo(dddw);

				if (_R[id].sliderType=="carousel") {
					 if (_.ddd_shadow) dddw.addClass("dddwrappershadow");
					 punchgs.TweenLite.set(dddw,{borderRadius:_R[id].carousel.border_radius});
				}
				punchgs.TweenLite.set(li,{overflow:"visible",transformStyle:"preserve-3d",perspective:1600});
				punchgs.TweenLite.set(dddw,{force3D:"auto",transformOrigin:"50% 50%",transformStyle:"preserve-3d",transformPerspective:1600});
				punchgs.TweenLite.set(dddwl,{force3D:"auto",transformOrigin:"50% 50%",zIndex:5,transformStyle:"flat",transformPerspective:1600});
				punchgs.TweenLite.set(_R[id].canvas,{transformStyle:"preserve-3d",transformPerspective:1600});
			}
		}

		_R[id].slides.each(function() {
			setDDDInContainer(jQuery(this));
		});

		if ((_.type=="3D" || _.type=="3d") && _R[id].c.find('rs-static-layers').length>0) {
			punchgs.TweenLite.set(_R[id].c.find('rs-static-layers'),{top:0, left:0,width:"100%",height:"100%"});
			setDDDInContainer(_R[id].c.find('rs-static-layers'));
		}
		_.pcontainers = [];
		_.pcontainer_depths = [];
		_.bgcontainers = [];
		_.bgcontainer_depths = [];
		_.speed = _.speed===undefined ? 0 : parseInt(_.speed,0);
		_.speedbg = _.speedbg===undefined ? 0 : parseInt(_.speedbg,0);
		_.speedls = _.speedls===undefined ? 0 : parseInt(_.speedls,0);

		_R[id].c.find('rs-slide rs-sbg-wrap, rs-slide rs-bgvideo').each(function() {
			var t = jQuery(this),
				l = t.data('parallax');
			l = l == "on" || l===true ? 1 : l;
			if (l!==undefined && (l!=="off" && l!==false)) {
				_.bgcontainers.push(t.closest('rs-sbg-px'));
				_.bgcontainer_depths.push(_R[id].parallax.levels[parseInt(l,0)-1]/100);
			}
		});



		for (var i = 1; i<=_.levels.length;i++)
			_R[id].c.find('.rs-pxl-'+i).each(function() {
				var pw = jQuery(this),
					tpw = this.className.indexOf('rs-pxmask')>=0 ? pw.closest('rs-px-mask') : pw.closest('.rs-parallax-wrap');
				tpw.data('parallaxlevel',_.levels[i-1]);
				tpw.addClass("tp-parallax-container");
				_.pcontainers.push(tpw);
				_.pcontainer_depths.push(_.levels[i-1]);
			});


		if (_.type=="mouse" || _.type=="mousescroll"  || _.type=="3D" || _.type=="3d") {

			_R[id].c.mouseenter(function(event) {
				var	t = _R[id].c.offset().top,
					l = _R[id].c.offset().left;
				if (_R[id].pr_active_key!==undefined) {
					_R.sA(_R[id].slides[_R[id].pr_active_key],"enterx",(event.pageX-l));
					_R.sA(_R[id].slides[_R[id].pr_active_key],"entery",(event.pageY-t));
				}

			});

			_R[id].c.on('mousemove.hoverdir, mouseleave.hoverdir, trigger3dpath',function(event,data) {
				var currslide = data && data.li ? data.li : jQuery(_R[id].slides[_R[id].pr_active_key]);


				// CALCULATE DISTANCES
				if (_.origo=="enterpoint") {
					var	t = _R[id].c.offset().top,
						l = _R[id].c.offset().left;

					if (currslide.data("enterx")==undefined) currslide.data("enterx",(event.pageX-l));
					if (currslide.data("entery")==undefined) currslide.data("entery",(event.pageY-t));

					var mh = currslide.data("enterx") || (event.pageX-l),
						mv = currslide.data("entery") || (event.pageY-t),
						diffh = (mh - (event.pageX - l)),
						diffv = (mv - (event.pageY - t)),
						s = _.speed/1000 || 0.4;
				} else {
					var	t = _R[id].c.offset().top,
						l = _R[id].c.offset().left,
						diffh = (_R[id].conw/2 - (event.pageX-l)),
						diffv = (_R[id].conh/2 - (event.pageY-t)),
						s = _.speed/1000 || 3;
				}


				if (event.type=="mouseleave") {
					diffh = _.ddd_lasth || 0;
					diffv = _.ddd_lastv || 0;
					s = 1.5;
				}


				for (var i=0;i<_.pcontainers.length;i++) {
					var pc = _.pcontainers[i],
						bl = _.pcontainer_depths[i],
						pl = _.type=="3D" || _.type=="3d" ? bl/200 : bl/100,
						offsh =	 diffh * pl,
						offsv =	 diffv * pl;
						if (_.type=="mousescroll")
							punchgs.TweenLite.to(pc,s,{force3D:"auto",x:offsh,ease:punchgs.Power3.easeOut,overwrite:"all"});
						else
							punchgs.TweenLite.to(pc,s,{force3D:"auto",x:offsh,y:offsv,ease:punchgs.Power3.easeOut,overwrite:"all"});
				}

				if (_.type=="3D" || _.type=="3d") {
					var sctor = 'rs-slide .dddwrapper, .dddwrappershadow, rs-slide .dddwrapper-layer, rs-static-layers .dddwrapper-layer';
					if (_R[id].sliderType==="carousel") sctor = "rs-slide .dddwrapper, rs-slide .dddwrapper-layer, rs-static-layers .dddwrapper-layer";
					_R[id].c.find(sctor).each(function() {
						var t = jQuery(this),
							pl = _.levels[_.levels.length-1]/200,
							offsh =	diffh * pl,
							offsv =	diffv * pl,
							offrv = _R[id].conw == 0 ? 0 :  Math.round((diffh / _R[id].conw * pl)*100) || 0,
							offrh = _R[id].conh == 0 ? 0 : Math.round((diffv / _R[id].conh * pl)*100) || 0,
							li = t.closest('rs-slide'),
							zz = 0,
							itslayer = false;

							if (t.hasClass("dddwrapper-layer")) {
								zz = _.ddd_z_correction || 65;
								itslayer = true;
							}

						if (t.hasClass("dddwrapper-layer")) {
							offsh=0;
							offsv=0;
						}

						if (li.index() === _R[id].pr_active_key || _R[id].sliderType!="carousel")
							if (!_.ddd_bgfreeze || (itslayer))
								punchgs.TweenLite.to(t,s,{rotationX:offrh, rotationY:-offrv, x:offsh, z:zz,y:offsv,ease:punchgs.Power3.easeOut,overwrite:"all"});
							else
								punchgs.TweenLite.to(t,0.5,{force3D:"auto",rotationY:0, rotationX:0, z:0,ease:punchgs.Power3.easeOut,overwrite:"all"});
						else
							punchgs.TweenLite.to(t,0.5,{force3D:"auto",rotationY:0,x:0,y:0, rotationX:0, z:0,ease:punchgs.Power3.easeOut,overwrite:"all"});

						if (event.type=="mouseleave")
						 	punchgs.TweenLite.to(jQuery(this),3.8,{z:0, ease:punchgs.Power3.easeOut});
					});
				}
			});

			if (_ISM)
				window.ondeviceorientation = function(event) {
					var y = Math.round(event.beta  || 0)-70,
						x = Math.round(event.gamma || 0);

					var currslide = jQuery(_R[id].slides[_R[id].pr_active_key]);

					if (jQuery(window).width() > jQuery(window).height()){
							var xx = x;
							x = y;
							y = xx;
					}

					var cw = _R[id].c.width(),
						ch = _R[id].c.height(),
						diffh = (360/cw * x),
				  		diffv = (180/ch * y),
				  		s = _.speed/1000 || 3,
				  		pcnts = [];

					currslide.find(".tp-parallax-container").each(function(i){
						pcnts.push(jQuery(this));
					});
					_R[id].c.find('rs-static-layers .tp-parallax-container').each(function(){
						pcnts.push(jQuery(this));
					});

				  	jQuery.each(pcnts, function() {
						var pc = jQuery(this),
							bl = parseInt(pc.data('parallaxlevel'),0),
							pl = bl/100,
							offsh =	 diffh * pl*2,
							offsv =	 diffv * pl*4;
							punchgs.TweenLite.to(pc,s,{force3D:"auto",x:offsh,y:offsv,ease:punchgs.Power3.easeOut,overwrite:"all"});
					});

					if (_.type=="3D" || _.type=="3d") {
						var sctor = 'rs-slide .dddwrapper, .dddwrappershadow, rs-slide .dddwrapper-layer, rs-static-layers .dddwrapper-layer';
						if (_R[id].sliderType==="carousel") sctor = "rs-slide .dddwrapper, rs-slide .dddwrapper-layer, rs-static-layers .dddwrapper-layer";
						_R[id].c.find(sctor).each(function() {
							var t = jQuery(this),
								pl = _.levels[_.levels.length-1]/200,
								offsh =	diffh * pl,
								offsv =	diffv * pl*3,
								offrv = _R[id].conw == 0 ? 0 :  Math.round((diffh / _R[id].conw * pl)*500) || 0,
								offrh = _R[id].conh == 0 ? 0 : Math.round((diffv / _R[id].conh * pl)*700) || 0,
								li = t.closest('rs-slide'),
								zz = 0,
								itslayer = false;

							if (t.hasClass("dddwrapper-layer")) {
								zz = _.ddd_z_correction || 65;
								itslayer = true;
							}

							if (t.hasClass("dddwrapper-layer")) {
								offsh=0;
								offsv=0;
							}

							if (li.hasClass("active-rs-slide") || _R[id].sliderType!="carousel")
								if (!_.ddd_bgfreeze || (itslayer))
									punchgs.TweenLite.to(t,s,{rotationX:offrh, rotationY:-offrv, x:offsh, z:zz,y:offsv,ease:punchgs.Power3.easeOut,overwrite:"all"});
								else
									punchgs.TweenLite.to(t,0.5,{force3D:"auto",rotationY:0, rotationX:0, z:0,ease:punchgs.Power3.easeOut,overwrite:"all"});
							else
								punchgs.TweenLite.to(t,0.5,{force3D:"auto",rotationY:0,z:0,x:0,y:0, rotationX:0, ease:punchgs.Power3.easeOut,overwrite:"all"});

							if (event.type=="mouseleave")
							 	punchgs.TweenLite.to(jQuery(this),3.8,{z:0, ease:punchgs.Power3.easeOut});
						});
					}
				};
		}

		// COLLECT ALL ELEMENTS WHICH NEED FADE IN/OUT ON PARALLAX SCROLL
		var _s = _R[id].scrolleffect;


		if (_s.set) {
			_s.multiplicator_layers = parseFloat(_s.multiplicator_layers);
			_s.multiplicator = parseFloat(_s.multiplicator);
		}
		if (_s._L!==undefined && _s._L.length===0) _s._L = false;
		if (_s.bgs!==undefined && _s.bgs.length===0) _s.bgs = false;

		_R.scrollTicker(id);

	},

	scrollTicker : function(id) {
		var faut;

		if (_R[id].scrollTicker!=true) {
			_R[id].scrollTicker = true;
			if (_ISM) {
				punchgs.TweenLite.ticker.fps(150);
				punchgs.TweenLite.ticker.addEventListener("tick",function() {
					_R.scrollHandling(id);},_R[id].c,false,1);
			} else {
				document.addEventListener('scroll',function(e) {
					_R.scrollHandling(id,true);
				}, {passive:true});

			}

		}
		_R.scrollHandling(id, true);
	},



	//	-	SET POST OF SCROLL PARALLAX	-
	scrollHandling : function(id,fromMouse,speedoverwrite,ignorelayers) {

		if (_R[id]===undefined) return;
		//VISIBLE AREA 4 LEVE

		_R[id].lastwindowheight = _R[id].lastwindowheight || window.innerHeight;
		_R[id].conh = _R[id].conh===0 || _R[id].conh===undefined ? _R[id].infullscreenmode ? _R[id].minHeight : _R[id].c.height() : _R[id].conh;
		if (_R[id].lastscrolltop==window.scrollY && !_R[id].duringslidechange && !fromMouse) return false;

		punchgs.TweenLite.delayedCall(0.2,function(id,b) {_R[id].lastscrolltop = b; },[id,window.scrollY]);


		var b = _R[id].topc!==undefined ? _R[id].topc[0].getBoundingClientRect() : _R[id].c.height() === 0 ? _R[id].cpar[0].getBoundingClientRect() : _R[id].c[0].getBoundingClientRect(),
			_v = _R[id].viewPort,
			_ = _R[id].parallax,
			slide = _R[id].slides[_R[id].pr_active_key===undefined ? 0 : _R[id].pr_active_key];

		b.hheight = b.height===0 ? _R[id].c.height()===0 ? _R[id].cpar.height() :  _R[id].c.height() : b.height;



		var proc = b.top<0 || b.hheight>_R[id].lastwindowheight ? b.top / b.hheight : b.bottom>_R[id].lastwindowheight ? (b.bottom-_R[id].lastwindowheight) / b.hheight : 0,
			mproc = _R[id].fixedOnTop ? Math.min(1,Math.max(0,(window.scrollY / _R[id].lastwindowheight))) :  Math.min(1,Math.max(0,1 - ((b.top+b.hheight) / (b.hheight+_R[id].lastwindowheight)))),
			visible = (b.top>=0 && b.top<=_R[id].lastwindowheight) || (b.top<=0 && b.bottom>=0) || (b.top<=0 && b.bottom>=0);


		_R[id].scrollproc = proc;

		if (_R.callBackHandling) _R.callBackHandling(id,"parallax","start");

		var area = Math.max(0,1-Math.abs(proc));



		if (visible) {
			if (_R[id].sbtimeline.fixed) {
				_R[id].curheight = _R[id].curheight===undefined ? _R[id].cpar.height() : _R[id].curheight;
				if (_R[id].sbtimeline.rest===undefined) _R.updateFixedScrollTimes(id);
				if (b.top>=0 && b.top<=_R[id].lastwindowheight) {
					mproc = (_R[id].sbtimeline.fixStart * (1 - (b.top / _R[id].lastwindowheight))) / 1000;
					_R[id].topc.removeClass("rs-fixedscrollon");
					punchgs.TweenLite.set(_R[id].cpar,{top:0});
				} else
				if (b.top<=0 && b.bottom>=_R[id].curheight) {
					_R[id].topc.addClass("rs-fixedscrollon");
					punchgs.TweenLite.set(_R[id].cpar,{top:0});
					mproc =   (_R[id].sbtimeline.fixStart + (_R[id].sbtimeline.time * (Math.abs(b.top) / (b.hheight - _R[id].curheight))))/1000;
				} else {
					punchgs.TweenLite.set(_R[id].cpar,{top:b.height - _R[id].curheight});
					_R[id].topc.removeClass("rs-fixedscrollon");
					mproc =  (_R[id].sbtimeline.fixEnd + (_R[id].sbtimeline.rest *  (1 - (b.bottom / _R[id].curheight)))) / 1000;
				}

			} else {
				mproc = (_R[id].duration * mproc) / 1000;
			}
		} else
		if (_R[id].sbtimeline.fixed) {
			_R[id].topc.removeClass("rs-fixedscrollon");
				punchgs.TweenLite.set(_R[id].cpar,{top:0});
		}

		if (_v.enable) {
			if (_R[id].viewPort.vaType===undefined) _R.updateVisibleArea(id);
		 	if ((_v.vaType[_R[id].level]==="%" && _v.visible_area[_R[id].level]<=area) || (_v.vaType[_R[id].level]==="px" && ((b.top<=0 && b.bottom>=_R[id].lastwindowheight) || (b.top>=0 && b.bottom<=_R[id].lastwindowheight) || (b.top>=0 && b.top<_R[id].lastwindowheight - _v.visible_area[_R[id].level]) || (b.bottom>=_v.visible_area[_R[id].level] && b.bottom<_R[id].lastwindowheight)))) {
				if (!_R[id].inviewport) {
					_R[id].inviewport = true;
					_R.enterInViewPort(id);
				}
			} else {
				if (_R[id].inviewport) {
					_R[id].inviewport = false;
					_R.leaveViewPort(id);
				}
			}
		}


		if (visible && slide!==undefined && _R.gA(slide,"key")!==undefined && ignorelayers!==true) {
			for (var sba in _R[id].sbas[_R.gA(slide,"key")]) if (_R[id]._L[sba]!==undefined &&  _R[id]._L[sba].timeline!==undefined && (_R[id]._L[sba].animationonscroll==true || _R[id]._L[sba].animationonscroll=="true")) {
				if (_R[id]._L[sba].scrollBasedOffset!==undefined) mproc = mproc + _R[id]._L[sba].scrollBasedOffset;

				if (mproc>0 && _R[id]._L[sba].animOnScrollRepeats<5) {
					_R[id]._L[sba].timeline.time(mproc);
					_R[id]._L[sba].animOnScrollRepeats++;
				} else
					punchgs.TweenMax.to(_R[id]._L[sba].timeline,_R[id].sbtimeline.speed,{time:mproc,ease:_R[id].sbtimeline.ease});
			}
		}


		// SCROLL BASED PARALLAX EFFECT
		if (_ISM && _.disable_onmobile) return false;

		if (_.type!="3d" && _.type!="3D") {
			if (_.type=="scroll" || _.type=="mousescroll")
				if (_.pcontainers)
					for (var i=0;i<_.pcontainers.length;i++) {
						if (_.pcontainers[i].length>0) {
							var pc = _.pcontainers[i],
								pl = _.pcontainer_depths[i]/100,
								offsv = Math.round((proc * -(pl*_R[id].conh)*10))/10 || 0,
								s = speedoverwrite!==undefined ? speedoverwrite :  _.speedls/1000 || 0;
							pc.data('parallaxoffset',offsv);
							punchgs.TweenLite.to(pc,s,{overwrite:"auto",force3D:"auto",y:offsv});
						}
					}
			if (_.bgcontainers) {
				for (var i=0;i<_.bgcontainers.length;i++) {
					var t = _.bgcontainers[i],
						l = _.bgcontainer_depths[i],
						offsv =	proc * -(l*_R[id].conh) || 0,
						s = speedoverwrite!==undefined ? speedoverwrite : _.speedbg/1000 || 0.015;
						s = _R[id].parallax.lastBGY!==undefined && s===0 && Math.abs(offsv - _R[id].parallax.lastBGY)>50 ? 0.15 : s;

					punchgs.TweenLite.to(t,s,{position:"absolute",top:"0px",left:"0px",backfaceVisibility:"hidden",force3D:"true",y:offsv+"px"});
					_R[id].parallax.lastBGY = offsv;
				}
			}
		}

		// SCROLL BASED BLUR,FADE,GRAYSCALE EFFECT
		var _s = _R[id].scrolleffect;
		if (_s.set && (!_s.mobile || !_ISM)) {

			var _fproc = Math.abs(proc)-(_s.tilt/100);
			_fproc = _fproc<0 ? 0 : _fproc;
			if (_s._L!==false) {
				var elev = 1 - (_fproc *_s.multiplicator_layers),
					seo = { force3D:"true"};
				if (_s.direction=="top" && proc>=0) elev=1;
				if (_s.direction=="bottom" && proc<=0) elev=1;
				elev = elev>1 ? 1 : elev < 0 ? 0 : elev;

				if (_s.fade) seo.opacity = elev;

				if (_s.scale) {
					var scalelevel = (elev);
					seo.scale = 1+(1-scalelevel);
				}

				if (_s.blur) {
					var blurlevel = (1-elev) * _s.maxblur;
					seo['-webkit-filter'] = 'blur('+blurlevel+'px)';
					seo.filter = 'blur('+blurlevel+'px)';
				}


				if (_s.grayscale) {
					var graylevel = (1-elev) * 100,
						gf = 'grayscale('+graylevel+'%)';
					seo['-webkit-filter'] = seo['-webkit-filter']===undefined ? gf : seo['-webkit-filter']+' '+gf;
					seo.filter = seo.filter===undefined ? gf: seo.filter+' '+gf;
				}
				punchgs.TweenLite.set(_s._L,seo);
			}

			if (_s.bgs!==false) {
				var elev = 1 - (_fproc *_s.multiplicator),
					seo = { backfaceVisibility:"hidden",force3D:"true"};
				if (_s.direction=="top" && proc>=0) elev=1;
				if (_s.direction=="bottom" && proc<=0) elev=1;
				elev = elev>1 ? 1 : elev < 0 ? 0 : elev;
				for (var si in _s.bgs) {
					if (!_s.bgs.hasOwnProperty(si)) continue;
					if (_s.bgs[si].fade) seo.opacity = elev;

					if (_s.bgs[si].blur) {
						var blurlevel = (1-elev) * _s.maxblur;
						seo['-webkit-filter'] = 'blur('+blurlevel+'px)';
						seo.filter = 'blur('+blurlevel+'px)';
					}

					if (_s.bgs[si].grayscale) {
						var graylevel = (1-elev) * 100,
							gf = 'grayscale('+graylevel+'%)';
						seo['-webkit-filter'] = seo['-webkit-filter']===undefined ? gf : seo['-webkit-filter']+' '+gf;
						seo.filter = seo.filter===undefined ? gf: seo.filter+' '+gf;
					}

					punchgs.TweenLite.set(_s.bgs[si].c,seo);
				}
			}
		}

		if (_R.callBackHandling)
			_R.callBackHandling(id,"parallax","end");

	}

});



//// END OF PARALLAX EFFECT
})(jQuery);