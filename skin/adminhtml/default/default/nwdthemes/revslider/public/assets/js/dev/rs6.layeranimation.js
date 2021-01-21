/************************************************
 * REVOLUTION 6.1.2 EXTENSION - LAYER ANIMATION
 * @version: 6.1.2 (05.09.2019)
 * @requires rs6.main.js
 * @author ThemePunch
************************************************/
(function($) {
	"use strict";

var
	splitTypes = ["chars","words","lines"],
	_R = jQuery.fn.revolution,
	_ISM = _R.is_mobile(),
	_ANDROID = _R.is_android();
///////////////////////////////////////////
// 	EXTENDED FUNCTIONS AVAILABLE GLOBAL  //
///////////////////////////////////////////
jQuery.extend(true,_R, {
	checkLayerDimensions : function(o) {
		var reset = false;
		for (var li in _R[o.id].layers[o.skey]) {
			if (!_R[o.id].layers[o.skey].hasOwnProperty(li)) continue;
			if (reset) continue;
			var layer = _R[o.id].layers[o.skey][li],
				_ = _R[o.id]._L[layer.id];
			if (_.eow!==layer.offsetWidth && _R.gA(layer,"vary-layer-dims")!=="true") reset=true;
		}

		return reset;
	},

	initLayer : function(o) {
		var id =o.id,
			skey = o.skey,
			u,s,corner;

		_R[id]._L = _R[id]._L===undefined ? {} : _R[id]._L;
		// Collect All Layers
		for (var li in _R[id].layers[skey]) {
			if (!_R[id].layers[skey].hasOwnProperty(li)) continue;
			var offsetx = _R[id].sliderType==="carousel" ? 0 : _R[id].width/2 - (_R[id].gridwidth[_R[id].level]*_R[id].bw)/2,
				offsety=0,
				layer = _R[id].layers[skey][li],
				L = jQuery(layer),
				_ = _R.gA(layer,"initialised") ? _R[id]._L[layer.id] : L.data();


			/****************************
				PREPARE DATAS 1 TIME
			*****************************/

			if (_R.gA(layer,"initialised")===undefined) {


				_R.revCheckIDS(id,layer);
				_R[id]._L[layer.id] = _;

				/***********************
					FRAME MANAGEMENT
				***********************/

				//FRAME ORDER
				_.ford = _.ford===undefined ? "frame_0;frame_1;frame_999" : _.ford;
				_.ford = _.ford[_.ford.length-1]==';' ? _.ford.substring(0,_.ford.length-1)  : _.ford;
				_.ford = _.ford.split(';');

				// CLIPPATH
				if (_.clip!==undefined) {
					_.clipPath = { use : false, origin:"l", type:"rectangle"};
					_.clip = _.clip.split(";");
					for (u in _.clip) {
						if (!_.clip.hasOwnProperty(u)) continue;
						s = _.clip[u].split(":");
						if (s[0]=='u') _.clipPath.use = s[1]=="true";
						if (s[0]=='o') _.clipPath.origin = s[1];
						if (s[0]=='t') _.clipPath.type = s[1];
					}
				}
				// 0.05

				_.frames = buildFrameObj(_,id);  //0.2 - 0.6ms


				/************
					BASICS
				*************/

				_.c =  L;
				_.p =  L.closest('.rs-parallax-wrap');
				_.lp = L.closest('rs-loop-wrap');
				_.m = L.closest('rs-mask-wrap');

				_.triggercache = _.triggercache===undefined ? "reset" : _.triggercache;
				_.rsp_bd  = _.rsp_bd===undefined ? _.type==="column" || _.type==="row" ? "off" : "on" : _.rsp_bd;
				_.rsp_o  = _.rsp_o===undefined ?  "on" : _.rsp_o;
				_.basealign = _.basealign === undefined ? "grid" : _.basealign;

				_.group = _.type!=="group" && L.closest('rs-group-wrap').length>0 ? "group" : _.type!=="column" && L.closest('rs-column').length>0 ? "column" : _.type!=="row" && L.closest("rs-row").length>0  ? "row" : undefined;
				_._lig = _.group==="group" ? L.closest('rs-group') : _.group==="column" ? L.closest('rs-column') : _.group==="row" ? L.closest("rs-row") : undefined;
				_._ligid = _._lig!==undefined ? _._lig[0].id : undefined;
				_._column = L[0].tagName==="RS-COLUMN" ? L.closest("rs-column-wrap") : "none";
				_._row = L[0].tagName==="RS-COLUMN" ? L.closest("rs-row") : false;
				_._ingroup = _.group==="group";
				_._incolumn = _.group==="column";
				_._inrow = _.group==="row";
				// 0.1 - 0.2

				// EXTEND SBA IF PARRENT ELLEMENT IS ALREADY SBA
				if ((_._ingroup || _._incolumn) && _._lig[0].className.indexOf('rs-sba')>=0 && !(_.animationonscroll===false && _.frames.loop!==undefined) && _.animOnScrollForceDisable!==true) { _.animationonscroll = true; L[0].className+=" rs-sba";_R[id].sbas[skey][layer.id] = L[0];		}
				_.animOnScrollRepeats = 0;
				_._isgroup = L[0].tagName==="RS-GROUP";
				//_.dchildren = _._row ?  L[0].getElementsByTagName('RS-COLUMN') : _._column!=="none" || _._isgroup ?  L[0].getElementsByClassName('rs-layer') : "none";
				_.type = _.type || "none";
				if (_.type==="row" && _.cbreak===undefined) _.cbreak = 2;


				_._isnotext = jQuery.inArray(_.type,["video","image","audio","shape"])!==-1;
				_._mediatag = _.audio=="html5" ? "audio" : "video";
				_.img = L.find("img");
				_.deepiframe = L[0].getElementsByTagName('iframe');
				_.deepmedia = L[0].getElementsByTagName(_._mediatag);
				_.layertype = _.type==="image" ? "image" : L[0].className.indexOf("rs-layer-video")>=0 || L[0].className.indexOf("rs-layer-audio")>=0 || (_.deepiframe.length>0 && (_.deepiframe[0].src.toLowerCase().indexOf('youtube')>0 || _.deepiframe[0].src.toLowerCase().indexOf('vimeo')>0)) || _.deepmedia.length>0 ? "video" : "html";
				if (_.deepiframe.length>0) _R.sA(_.deepiframe[0],"layertype",_.layertype);
				if (_.type==="column") {
					_.cbg =  _.p.find('rs-column-bg');
					_.cbgmask = _.p.find('rs-cbg-mask-wrap');
				}
				_._slidelink = L[0].className.indexOf("slidelink")>=0;
				_._isstatic = L[0].className.indexOf("rs-layer-static")>=0;
				_.slidekey = _._isstatic ? "staticlayers" : skey;
				//_._li = _._isstatic ? L.closest('rs-static-layers') : L.closest('rs-slide');
				_._togglelisteners = L.find('.rs-toggled-content').length>0;

				_.bgcol = _.bgcol===undefined ? L[0].style.background.indexOf("gradient")>=0 ? L[0].style.background : L.css('backgroundColor') : _.bgcol;
				_.bgcol = _.bgcol.indexOf('rgba(0, 0, 0, 0)')===0 && _.bgcol.length>18? _.bgcol.replace("rgba(0, 0, 0, 0)","") : _.bgcol;

				_.zindex = L.css("z-Index");
				if (_._togglelisteners) L.click(function() {_R.swaptoggleState([this.id]);} );
				// GET AND SPLIT THE BORDER SETTINGS
				if (_.border!==undefined) {
					_.border = _.border.split(";");
					_.bordercolor="transparent";
					for (u in _.border) {
						if (!_.border.hasOwnProperty(u)) continue;
						s = _.border[u].split(":");
						switch(s[0]) {
							case "boc": _.bordercolor= s[1];break;
							case "bow": _.borderwidth= _R.revToResp(s[1],4,0);break;
							case "bos": _.borderstyle= _R.revToResp(s[1],4,0); break;
							case "bor": _.borderradius = _R.revToResp(s[1],4,0); break;
						}
					}
				}

				// GET SVG SETTINGS
				if (_.type==="svg") {
					_.svg = L.find('svg');
					_.svgPath = _.svg.find('path');
					_.svgI = _svgprep(_.svgi,id);  //svgi
					_.svgH = _svgprep(_.svgh,id); //svgh
				}


				// GET MASK BASIC TRANSFORMS
				if (_.btrans!==undefined) {var btr = _.btrans;_.btrans = { rX:0, rY:0, rZ:0, o:1}; btr = btr.split(";"); for (u in btr) { if (!btr.hasOwnProperty(u)) continue; s = btr[u].split(":"); switch(s[0]) { case "rX": _.btrans.rX = s[1]; break; case "rY": _.btrans.rY = s[1]; break; case "rZ": _.btrans.rZ = s[1]; break; case "o": _.btrans.o = s[1]; break;   } }}

				// GET BOX SHADOW
				if (_.tsh!==undefined) { _.tshadow={c:"rgba(0,0,0,0.25)", v:0, h:0, b:0}; _.tsh = _.tsh.split(";"); for (u in _.tsh) { if (!_.tsh.hasOwnProperty(u)) continue; s = _.tsh[u].split(":"); switch(s[0]) { case "c": _.tshadow.c = s[1];break; case "h": _.tshadow.h = s[1];break;case "v": _.tshadow.v = s[1];break; case "b": _.tshadow.b = s[1];break;}}}
				if (_.bsh!==undefined) { _.bshadow={e:"c", c:"rgba(0,0,0,0.25)", v:0, h:0, b:0, s:0}; _.bsh = _.bsh.split(";"); for (u in _.bsh) { if (!_.bsh.hasOwnProperty(u)) continue; s = _.bsh[u].split(":"); switch(s[0]) { case "c": _.bshadow.c = s[1];break; case "h": _.bshadow.h = s[1];break;case "v": _.bshadow.v = s[1];break; case "b": _.bshadow.b = s[1];break;case "s": _.bshadow.s = s[1];break;case "e": _.bshadow.e = s[1];break;}}}

				// GET AND SPLIT THE DIMENSION PARAMETERS
				if (_.dim!==undefined) { _.dim = _.dim.split(";"); for (u in _.dim) { if (!_.dim.hasOwnProperty(u)) continue; s = _.dim[u].split(":"); switch(s[0]) { case "w": _.width = s[1];break; case "h": _.height=s[1];break;case "maxw": _.maxwidth = s[1];break; case "maxh": _.maxheight=s[1];break;case "minw": _.minwidth = s[1];break; case "minh": _.minheight=s[1];break;}}}


				// GET AND SPLIT POSITION PARAMETERS
				if (_.xy!==undefined) {	_.xy = _.xy.split(";"); for (u in _.xy){ if (!_.xy.hasOwnProperty(u)) continue;s = _.xy[u].split(":");switch (s[0]) { case "x": _.x = s[1].replace("px","");break; case "y": _.y = s[1].replace("px","");break; case "xo": _.hoffset = s[1].replace("px","");break; case "yo": _.voffset = s[1].replace("px","");break;}}}

				// GET TEXT VALUES
				if (!_._isnotext && _.text!==undefined) {_.text = _.text.split(";"); for (u in _.text) { if (!_.text.hasOwnProperty(u)) continue; s = _.text[u].split(":");switch (s[0]) { case "w": _.whitespace = s[1];break; case "td": _.textDecoration = s[1];break; case "c": _.clear = s[1];break; case "f": _.float=s[1];break;case "s": _.fontsize = s[1];break; case "l": _.lineheight = s[1];break; case "ls": _.letterspacing = s[1];break; case"fw": _.fontweight=s[1];break; case "a": _.textalign = s[1];break;}}}

				// GET FLOAT VALUES
				if (_.flcr!==undefined) {_.flcr = _.flcr.split(";"); for (u in _.flcr) { if (!_.flcr.hasOwnProperty(u)) continue; s = _.flcr[u].split(":");switch (s[0]) { case "c": _.clear = s[1];break; case "f": _.float=s[1];break;}}}


				// GET PADDING VALUES
				if (_.padding!==undefined) {_.padding = _.padding.split(";"); for (u in _.padding) { if (!_.padding.hasOwnProperty(u)) continue;s = _.padding[u].split(":");switch (s[0]) { case "t": _.paddingtop = s[1];break; case "b": _.paddingbottom = s[1];break; case "l": _.paddingleft = s[1];break; case "r": _.paddingright = s[1];break;}}}

				// GET MARGIN VALUES
				if (_.margin!==undefined) {	_.margin = _.margin.split(";"); for (u in _.margin) { if (!_.margin.hasOwnProperty(u)) continue;s = _.margin[u].split(":");switch (s[0]) { case "t": _.margintop = s[1];break; case "b": _.marginbottom = s[1];break; case "l": _.marginleft = s[1];break; case "r": _.marginright = s[1];break;}}}

				// SPIKE MASK ON ELEMENTS
				if (_.spike!==undefined) _.spike =getSpikePath(_.spike);

				// SHARP CORNERS FALLBACK
				if (_.corners!==undefined) {
					corner = _.corners.split(";");
					_.corners = {};
					for (u in corner) {
						if (!corner.hasOwnProperty(u)) continue;
						if (corner[u].length>0) {
							_.corners[corner[u]] = jQuery('<'+corner[u]+'></'+corner[u]+'>');
							_.c.append(_.corners[corner[u]]);
						}
					}
				}
				// 0.114 - 0.25


				//CONVERT TEXT VALUES
				_.textalign = convToCLR(_.textalign);
				_.vbility  = _R.revToResp(_.vbility,_R[id].rle,true);

				_.hoffset = _R.revToResp(_.hoffset,_R[id].rle,0);
				_.voffset = _R.revToResp(_.voffset,_R[id].rle,0);
				_.x = _R.revToResp(_.x,_R[id].rle,"l");
				_.y = _R.revToResp(_.y,_R[id].rle,"t");

				getStyleAtStart(L,0,id);
				_R.sA(layer,"initialised",true);
				// 1-2 MS
			}


			/***************************
				RUNTIME ON EACH CALL
			****************************/

			var gw = _.basealign==="grid" ? _R[id].width : _R[id].sliderType==="carousel" && !_._isstatic ? _R[id].carousel.slide_width :  _R[id].ulw,
				gh = _.basealign==="grid" ? _R[id].height : _R[id].sliderType==="carousel" && !_._isstatic ? _R[id].ulh : _R[id].ulh,//_R[id].carousel.slide_height :  _R[id].ulh;
				elx = _.x[_R[id].level],
				ely = _.y[_R[id].level];

			//OFFSET CALCULATIONS
			offsety = _.basealign==="slide" ? 0 : Math.max(0,_R[id].sliderLayout=="fullscreen" ? gh/2 - (_R[id].gridheight[_R[id].level]*(_R[id].keepBPHeight ? 1 :_R[id].bh))/2 : (_R[id].autoHeight || (_R[id].minHeight!=undefined && _R[id].minHeight>0)) ? _R[id].conh/2 - (_R[id].gridheight[_R[id].level]*_R[id].bh)/2: offsety);
			offsetx = _.basealign==="slide" ? 0 : Math.max(0,offsetx);

			//STATIC LAYERS IN CAROUSEL MODE
			if (_.basealign!=="slide" && _R[id].sliderType==="carousel" && _._isstatic && _R[id].carousel!==undefined && _R[id].carousel.horizontal_align!==undefined )
				offsetx = Math.max(0, (_R[id].carousel.horizontal_align==="center" ? 0 + (_R[id].ulw - (_R[id].gridwidth[_R[id].level]*_R[id].bw))/2 : _R[id].carousel.horizontal_align==="right" ?(_R[id].ulw - (_R[id].gridwidth[_R[id].level]*_R[id].bw)) : offsetx));


			if (o.mode!=="updateposition") {

				// HIDE CAPTION IF RESOLUTION IS TOO LOW
				if (_.vbility[_R[id].levelForced]==false || _.vbility[_R[id].levelForced]=="f" || (gw<_R[id].hideLayerAtLimit && _.layeronlimit=="on") || (gw<_R[id].hideAllLayerAtLimit))
					_.p[0].classList.add("rs-layer-hidden");
				else
					_.p[0].classList.remove("rs-layer-hidden");

				// FALL BACK TO NORMAL IMAGES
				_.poster = _.poster==undefined && _.thumbimage!==undefined ? _.thumbimage : _.poster;


				// LAYER IS AN IMAGE OR HAS IMAGE INSIDE
				if (_.layertype==="image") {
					if (_.img.data('c')==="cover-proportional") {
						_R.sA(_.img[0],"owidth", _R.gA(_.img[0],"owidth",_.img[0].width));
						_R.sA(_.img[0],"oheight", _R.gA(_.img[0],"oheight", _.img[0].height));
						var ip = _R.gA(_.img[0],"owidth") / _R.gA(_.img[0],"oheight"),
							cp = gw / gh;

						if ((ip>cp && ip<=1) || (ip<cp && ip>1))
							punchgs.TweenMax.set(_.img,{width:"100%", height:"auto", left:elx==="c" || elx==="center" ? "50%" : elx==="left" || elx==="l" ? "0" : "auto", right:elx==="r" || elx==="right" ? "0" : "auto",top:ely==="c" || ely==="center" ? "50%" : ely==="top" || ely==="t" ? "0" : "auto", bottom:ely==="b" || ely==="bottom" ? "0" : "auto",x:elx==="c" || elx==="center" ? "-50%" : "0",y:ely==="c" || elx==="center" ? "-50%" : "0", position:"absolute"});
						else
							punchgs.TweenMax.set(_.img,{height:"100%", width:"auto", left:elx==="c" || elx==="center" ? "50%" : elx==="left" || elx==="l" ? "0" : "auto", right:elx==="r" || elx==="right" ? "0" : "auto",top:ely==="c" || ely==="center" ? "50%" : ely==="top" || ely==="t" ? "0" : "auto", bottom:ely==="b" || ely==="bottom" ? "0" : "auto",x:elx==="c" || elx==="center" ? "-50%" : "0",y:ely==="c" || elx==="center" ? "-50%" : "0", position:"absolute"});

					} else {
						var w = _.width[_R[id].level]!=="auto" || isNaN(_.width[_R[id].level]) && _.width[_R[id].level].indexOf("%")>=0 ? "100%" : "auto",
							h = _.height[_R[id].level]!=="auto" || isNaN(_.height[_R[id].level]) && _.height[_R[id].level].indexOf("%")>=0 ? "100%" : "auto";
							punchgs.TweenMax.set(_.img,{width:w,height:h});
					}
				} // END OF LAYERTYPE IMAGE
				else
				if (_.layertype==="video") { // IF IT IS A VIDEO LAYER
					if (_R.manageVideoLayer && !_.videoLayerManaged) _R.manageVideoLayer(L,id);
					if (o.mode!=="rebuild" && _R.resetVideo) _R.resetVideo(L,id,o.mode);
					if (_.aspectratio!=undefined && _.aspectratio.split(":").length>1 && (_.bgvideo==1 || _.forcecover==1)) _R.prepareCoveredVideo(id,L);

					_.media = _.media===undefined ? _.deepiframe.length>0 ? jQuery(_.deepiframe[0]) : jQuery(_.deepmedia[0]) : _.media;


					_.html5vid = _.html5vid===undefined ?  _.deepiframe.length>0 ? false : true : _.html5vid;
					var yvcover = L[0].className.indexOf('coverscreenvideo')>=0;

					_.media.css({display:"block"});

					// SET WIDTH / HEIGHT
					var ww =  _.width[_R[id].level],
						hh =  _.height[_R[id].level];

					ww = ww==="auto" ? ww : (!jQuery.isNumeric(ww) && ww.indexOf("%")>0) ? _._incolumn || _._ingroup ? "100%" : _.basealign==="grid" ? _R[id].gridwidth[_R[id].level]*_R[id].bw : gw : _.rsp_bd!=="off" ? (parseFloat(ww)*_R[id].bw)+"px" : parseFloat(ww)+"px";
					hh = hh==="auto" ? hh : (!jQuery.isNumeric(hh) && hh.indexOf("%")>0) ? _.basealign==="grid" ? _R[id].gridheight[_R[id].level]*_R[id].bw : gh : _.rsp_bd!=="off" ? (parseFloat(hh)*_R[id].bh)+"px" : parseFloat(hh)+"px";

					var ncobj = getLayerResponsiveValues(L,id);

					if (_._incolumn && ww==="100%" && hh==="auto" && _.ytid!==undefined) {
						_.vd =  _.vd===undefined ? _R[id].videos[L[0].id].ratio.split(':').length>1 ? _R[id].videos[L[0].id].ratio.split(':')[0] / _R[id].videos[L[0].id].ratio.split(':')[1]  : 1 : _.vd;

							var nvw = L.width(),
								nvh = nvw /_.vd;
							punchgs.TweenLite.set(L,{height:nvh+"px"});
							_.heightSetByVideo = true;
					} else {

						if (L[0].className.indexOf('rs-fsv')==-1 && !yvcover) {

							punchgs.TweenMax.set(L,{
								 paddingTop: Math.round((ncobj.paddingTop * _R[id].bh)) + "px",
								 paddingBottom: Math.round((ncobj.paddingBottom * _R[id].bh)) + "px",
								 paddingLeft: Math.round((ncobj.paddingLeft* _R[id].bw)) + "px",
								 paddingRight: Math.round((ncobj.paddingRight * _R[id].bw)) + "px",
								 marginTop: (ncobj.marginTop * _R[id].bh) + "px",
								 marginBottom: (ncobj.marginBottom * _R[id].bh) + "px",
								 marginLeft: (ncobj.marginLeft * _R[id].bw) + "px",
								 marginRight: (ncobj.marginRight * _R[id].bw) + "px",
								 borderTopWidth: Math.round(ncobj.borderTopWidth * _R[id].bh) + "px",
								 borderBottomWidth: Math.round(ncobj.borderBottomWidth * _R[id].bh) + "px",
								 borderLeftWidth: Math.round(ncobj.borderLeftWidth * _R[id].bw) + "px",
								 borderRightWidth: Math.round(ncobj.borderRightWidth * _R[id].bw) + "px",
								 width:ww,
								 height:hh
							});
						} else  {
						   offsetx=0;
						   offsety=0;
						   _.x = _R.revToResp(0,_R[id].rle,0);
						   _.y = _R.revToResp(0,_R[id].rle,0);
						   L.css({'width':gw, 'height':(_R[id].autoHeight ? _R[id].conh : gh)});
						}
						if ((_.html5vid == false && !yvcover) || ((_.forcecover!=1 && !L.hasClass('rs-fsv') && !yvcover))) {
							_.media.width(ww);
							_.media.height(hh);
						}
						if (_._ingroup && ww!==null && ww!==undefined && !jQuery.isNumeric(ww) && ww.indexOf("%")>0) punchgs.TweenMax.set([_.lp,_.p,_.m],{minWidth:ww});
					}

				}	// END OF POSITION AND STYLE READ OUTS OF VIDEO

				// RESPONIVE HANDLING OF CURRENT LAYER

				if (!_._slidelink) calcResponsiveLayer(L,id,0,_.rsp_bd);

				// ALL ELEMENTS IF THE MAIN ELEMENT IS REKURSIVE RESPONSIVE SHOULD BE REPONSIVE HANDLED
				if (_.rsp_ch==="on" && _.type!=="row" && _.type!=="column" && _.type!=="group")
					L.find('*').each(function() {
						var jthis = jQuery(this);
						if (_R.gA(this,"stylerecorder")!=="true" && _R.gA(this,"stylerecorder")!==true) getStyleAtStart(jthis,"rekursive",id);
						calcResponsiveLayer(jthis,id,"rekursive",_.rsp_bd);
					});

			} // NOT NOLY UPDATE POSITION !

			if (o.mode!=="preset" ) {

				_.eow = L.outerWidth(true);
				_.eoh = L.outerHeight(true);



				// BUILD AND UPDATE SHARP DECO CORNERS
				if ((_.type==="text" || _.type==="button") && _.corners!==undefined) {
					for (corner in _.corners) {
						if (!_.corners.hasOwnProperty(corner)) continue;
						_.corners[corner].css('borderWidth',_.eoh+"px");
						var fcr = corner==="rs-fcrt" || corner==="rs-fcr";
						_.corners[corner].css('border'+(fcr ? "Right" : "Left"),'0px solid transparent');
						_.corners[corner].css('border'+(corner=="rs-fcrt" || corner=="rs-bcr" ? "Bottom" :  "Top" )+'Color',_.bgcol);
					}
					_.eow = L.outerWidth(true);
				}

				// NEED CLASS FOR FULLWIDTH AND FULLHEIGHT LAYER SETTING !!
				if (_.eow==0 && _.eoh==0) {
					_.eow = _R[id].ulw;
					_.eoh = _R[id].ulh;
				}



				var vofs = _.rsp_o==="on" ? parseInt(_.voffset[_R[id].level],0) * _R[id].bw : parseInt(_.voffset[_R[id].level],0),
					hofs = _.rsp_o==="on" ? parseInt(_.hoffset[_R[id].level],0) * _R[id].bw : parseInt(_.hoffset[_R[id].level],0),
					crw =  _.basealign==="grid" ? _R[id].gridwidth[_R[id].level]*_R[id].bw : gw,
					crh =  _.basealign==="grid" ? _R[id].gridheight[_R[id].level]*(_R[id].keepBPHeight ? 1 :_R[id].bh) : gh;






				if (_R[id].gridEQModule == true || (_._lig!==undefined && _.type!=="row" && _.type!=="column" && _.type!=="group")) {
					crw = _._lig!==undefined ? _._lig.width() : _R[id].ulw;
					crh = _._lig!==undefined ? _._lig.height() : _R[id].ulh;
					offsetx=0;
					offsety=0;
				}



				elx = elx==="c" || elx==="m" || elx==="center" || elx==="middle" ? (crw/2 - _.eow/2) + hofs : elx==="l" || elx==="left" ? hofs : elx==="r" || elx==="right" ? (crw - _.eow) - hofs : _.rsp_o !=="off"  ? elx * _R[id].bw : elx;
				ely = ely==="m" || ely==="c" || ely==="center" || ely==="middle" ? (crh/2 - _.eoh/2) + vofs : ely==="t" || ely =="top"  ? vofs : ely==="b" || ely=="bottom" ? (crh - _.eoh) - vofs : _.rsp_o !=="off"  ? ely * _R[id].bw : ely;

				elx = _._slidelink ? 0 : _R[id].rtl && _.width[_R[id].level]!=="100%" ? elx+_.eow : elx;

				_.calcx = (parseInt(elx,0)+offsetx);
				_.calcy = (parseInt(ely,0)+offsety);

				// SET TOP/LEFT POSITION OF LAYER
				if (_.type!=="row" && _.type!=="column") {
					punchgs.TweenMax.set(_.p,{zIndex:_.zindex, top:_.calcy,left:_.calcx,overwrite:"auto"});
					//if (_.maskinuse) punchgs.TweenMax.set([_.m],{minWidth:_.eow,minHeight:_.eoh}); // Maybe only for BG Elements!?
				}
				else
				if (_.type!=="row")
					punchgs.TweenMax.set(_.p,{zIndex:_.zindex, width:_.columnwidth, top:0,left:0,overwrite:"auto"});
				else
				if (_.type==="row") {
					punchgs.TweenMax.set(_.p,{zIndex:_.zindex, width:(_.basealign==="grid" ? crw+"px" : "100%"), top:0,left:offsetx,overwrite:"auto"});
					if (_.cbreak<=_R[id].level)
						L[0].classList.add("rev_break_columns");
					else
						L[0].classList.remove("rev_break_columns");
				}
				if (_.blendmode!==undefined) punchgs.TweenMax.set(_.p,{mixBlendMode:_.blendmode});

				// LOOP ANIMATION WIDTH/HEIGHT
				if (_.frame_loop!==undefined) punchgs.TweenMax.set(_.lp,{minWidth:_.eow,minHeight:_.eoh});
				// ELEMENT IN GROUPS WITH % WIDTH AND HEIGHT SHOULD EXTEND PARRENT SIZES
				if (_._ingroup) {
					if (_._groupw!==undefined && !jQuery.isNumeric(_._groupw) && _._groupw.indexOf("%")>0)
						punchgs.TweenMax.set([_.lp,_.p,_.m],{minWidth:_._groupw});
					if (_._grouph!==undefined && !jQuery.isNumeric(_._grouph) && _._grouph.indexOf("%")>0)
						punchgs.TweenMax.set([_.lp,_.p,_.m],{minHeight:_._grouph});
				}
			} // IT WAS ONLY PRESET ? OVERJUMP PARTS
		}// END OF FOR li RUNTRHOUGH OF LAYERS
	},



	// MAKE SURE THE ANIMATION ENDS WITH A CLEANING ON MOZ TRANSFORMS
 	animcompleted : function(_nc,id) {
 		if (_R[id].videos===undefined) return;
		var _ = _R[id].videos[_nc[0].id];
		if (_==undefined) return;
		if (_.type!=undefined && _.type!="none")
		 if (_.aplay==true || _.aplay=="true" || _.aplay=="on" ||  _.aplay=="1sttime") {
		 	if (_R[id].sliderType!=="carousel" || (_nc.closest('rs-slide').index() == _R[id].pr_active_key)) _R.playVideo(_nc,id);
			_R.toggleState(_nc.data('videotoggledby'));
			if ( _.aplay1 || _.aplay=="1sttime") {
				_.aplay1 = false;
				_.aplay = false;
			}
		  }	else {
			  if (_.aplay=="no1sttime") _.aplay = true;
			  _R.unToggleState(_nc.data('videotoggledby'));
		  }

	},



	/********************************************************
		-	PREPARE AND DEFINE STATIC LAYER DIRECTIONS -
	*********************************************************/
	handleStaticLayers : function(_nc,id) {
		var s = 0,
			e = _R[id].realslideamount+1;

		if (_R.gA(_nc[0],"onslides")!==undefined) {
			var ons = _R.gA(_nc[0],"onslides").split(";");
			for (var i in ons){
				if (!ons.hasOwnProperty(i)) continue;
				var v = ons[i].split(":");
				if (v[0]==="s") s = parseInt(v[1],0);
				if (v[0]==="e") e = parseInt(v[1],0);
			}
		}
		s = Math.max(0,s);
		e = Math.min(_R[id].realslideamount,(e<0 ? _R[id].realslideamount : e));


		e = (s===1 || s===0) && e===_R[id].realslideamount ? _R[id].realslideamount+1 : e;

		_nc.data('startslide',s);
		_nc.data('endslide',e);
		_R.sA(_nc[0],"startslide",s);
		_R.sA(_nc[0],"endslide",e);
	},


	/************************************
		ANIMATE ALL CAPTIONS
	*************************************/
	animateTheLayers : function(obj)  {
		if (obj.slide===undefined) return false;
		var id = obj.id;
		if (_R[id].slides[obj.slide]===undefined)	return false;
		var key = _R.gA(_R[id].slides[obj.slide],"key"),
			index = _R[id].pr_processing_key || _R[id].pr_active_key || 0;


		// COLLECTION OF LAYERS
		_R[id].layers = _R[id].layers || {};
		_R[id].layers[key] = _R[id].layers[key]===undefined ?  getLayersInSlide(jQuery(_R[id].slides[obj.slide]),'rs-layer') : _R[id].layers[key];
		_R[id].layers["static"] = _R[id].layers["static"]===undefined ?  getLayersInSlide(jQuery(_R[id].c.find('rs-static-layers')),'rs-layer') : _R[id].layers["static"];
		_R[id].sbas[key] = _R[id].sbas[key]===undefined ? getLayersInSlide(jQuery(_R[id].slides[obj.slide]),'rs-sba') : _R[id].sbas[key];

		_R.updateDimensions(id);


		// PREPARE AND ANIMATE SLIDE LAYERS
		if (key!==undefined && _R[id].layers[key]) _R.initLayer({id:id, skey:key, mode:obj.mode, animcompleted:(obj.mode==="rebuild" && _R[id].sliderType==="carousel" && _R[id].carousel.showLayersAllTime)});

		// PREPARE AND ANIMATE STATIC LAYERS
		if (_R[id].layers["static"]) _R.initLayer({	id:id, skey:"static", mode:obj.mode, animcompleted:(obj.mode==="rebuild" && _R[id].sliderType==="carousel" && _R[id].carousel.showLayersAllTime)});

		if (!_R[id].dimensionReCheck) {
			setTimeout(function() {
				if (key!==undefined && _R[id].layers[key] && _R.checkLayerDimensions({id:id, skey:key})) _R.initLayer({id:id, skey:key, mode:"updateposition"});
				if (_R[id].layers["static"] && _R.checkLayerDimensions({id:id, skey:"static"})) _R.initLayer({	id:id, skey:"static", mode:"updateposition"});
			},200);
			_R[id].dimensionReCheck = true;
		}



		//Set Size of Container if Zones and Rows with Content exists
		if (
				(_R[id].rowzones!==undefined && _R[id].rowzones.length>0 && index>=0 && _R[id].rowzones[ Math.min(index,_R[id].rowzones.length)].length>0) ||
				(_R[id].srowzones!==undefined && _R[id].srowzones.length>0) ||
				(_R[id].smiddleZones!==undefined && _R[id].smiddleZones.length>0)
			) {

			_R.setSize(id);
			_R.updateDimensions(id);
			_R.initLayer({id:id, skey:key, mode:"updateposition"});
			_R.initLayer({id:id, skey:"static", mode:"updateposition"});
			if (obj.mode==="start" || obj.mode==="preset") _R.manageNavigation(id);
		}

		if (key!==undefined && _R[id].layers[key]) for (var li in _R[id].layers[key]) if (_R[id].layers[key].hasOwnProperty(li)) _R.renderLayerAnimation({layer:jQuery(_R[id].layers[key][li]),id:id, mode:obj.mode});
		if (_R[id].layers.static) for (var li in _R[id].layers.static) if (_R[id].layers.static.hasOwnProperty(li)) _R.renderLayerAnimation({layer:jQuery(_R[id].layers.static[li]),id:id, mode:obj.mode});




		// RESUME THE MAIN TIMELINE NOW
		if (_R[id].mtl != undefined) setTimeout(function() {if (_R[id].mtl != undefined) _R[id].mtl.resume();},30);

	},

	//////////////////////////
	//	REMOVE THE CAPTIONS //
	/////////////////////////
	removeTheLayers : function(slide,id,allforce) {

		var skey = _R.gA(slide[0],"key");
		if (_R[id].sloops && _R[id].sloops[skey] && _R[id].sloops[skey].tl) _R[id].sloops[skey].tl.stop();


		if (_R[id].sliderType==="carousel" && _R[id].carousel.showLayersAllTime) {
			// STOP VIDEOS IN THE NOT FOCUSED SLIDES ?
			// MEDIA LST
			// LASTPLAYED VIDEOS
		} else {
			//REMOVE CURRENT LAYERS
			for (var li in _R[id].layers[skey]) if (_R[id].layers[skey].hasOwnProperty(li)) _R.renderLayerAnimation({layer:jQuery(_R[id].layers[skey][li]), frame:"frame_999", mode:"continue", remove:true, id:id, allforce:allforce});
			//REMOVE STATIC LAYERS IF NEEDED
			for (var li in _R[id].layers.static) if (_R[id].layers.static.hasOwnProperty(li)) _R.renderLayerAnimation({layer:jQuery(_R[id].layers.static[li]), frame:"frame_999", mode:"continue", remove:true, id:id,allforce:allforce});

		}
	},

	/************************************
			RENDER LAYER ANIMATIONS
	*************************************/
	renderLayerAnimation : function(obj) {
		var L = obj.layer,
			id = obj.id,
			scren = _R[id].level,
			_ = _R[id]._L[L[0].id],
			fifame = "frame_1",
			cachetime = _.timeline!==undefined ? _.timeline.time() : undefined,
			ignoreframes = false,
			calledframereached = false,
			sl = "none";


		// ONLY PREPARE ELEMENTS WE REALLY NEED
		if (obj.mode==="preset" && _.frames.frame_1.timeline.waitoncall!==true && _.scrollBasedOffset===undefined && _.forceRender!==true) return;
		if (obj.mode=="trigger") _.triggeredFrame = obj.frame;

		//STATIC LAYERS CAN BE IGNORED IN SOME CASES
		if (_._isstatic) {
			 var cs = _R[id].sliderType==="carousel" && _R[id].carousel.oldfocused!==undefined ?  _R[id].carousel.oldfocused : _R[id].pr_lastshown_key===undefined ? 1 : parseInt(_R[id].pr_lastshown_key,0) + 1,
			 	 ns = _R[id].sliderType==="carousel" ?  _R[id].pr_next_key===undefined ? cs===0 ? 1 : cs : parseInt(_R[id].pr_next_key,0)+1 : _R[id].pr_processing_key===undefined ? cs : parseInt(_R[id].pr_processing_key,0) + 1,
			 	inrangecs = cs>=_.startslide && cs<=_.endslide,
			 	inrangens = ns>=_.startslide && ns<=_.endslide;


			 sl = cs===_.endslide && obj.mode==="continue" ? true : obj.mode!=="continue" && cs!==_.endslide ? false : "none";


			 if (obj.allforce===true || sl===true) {
			 	//Force to Redo Whatever we need to do
			 } else {
			 	 if (obj.mode==="preset" && (_.elementHovered || !inrangens)) return;
				 if (obj.mode==="rebuild" && !inrangecs && !inrangens) return;
				 if (obj.mode==="start" && inrangens && _.lastRequestedMainFrame==="frame_1") return;
				 if (obj.mode==="continue" && obj.frame==="frame_999" && inrangens) return;
				 if (obj.mode==="start" && !inrangens) return;
			}

		} else
		if (obj.mode==="start" && _.triggercache!=="keep")  _.triggeredFrame = undefined;

		if (obj.mode==="start" && _.layerLoop!==undefined) _.layerLoop.count = 0;

		if (obj.mode==="start") obj.frame=_.triggeredFrame===undefined ? 0 : _.triggeredFrame;
		if ((obj.mode!=="continue" && obj.mode!=="trigger") && _.timeline!==undefined) _.timeline.pause(0);
		if ((obj.mode==="continue" || obj.mode==="trigger") && _.timeline!==undefined) _.timeline.pause();

		_.timeline = new punchgs.TimelineMax({paused:true});


		if ((_.type==="text" || _.type==="button") && (_.splitText===undefined || (_.splitTextFix===undefined && (obj.mode==="start" || obj.mode==="preset")))) {
			updateSplitContent({layer:L,id:id});
			if (obj.mode==="start") _.splitTextFix = true;
		}


		// LETS GO THROUGH THE FRAMES
		for (var fiin in _.ford) {
			if (!_.ford.hasOwnProperty(fiin)) continue;
			var fi = _.ford[fiin],
				renderJustFrom = false;

			if (fi ==="frame_0" || fi==="frame_hover" || fi==="loop") continue;
			if (fi === "frame_999" && !_.frames[fi].timeline.waitoncall && _.frames[fi].timeline.start>=_R[id].duration && obj.remove!==true) _.frames[fi].timeline.waitoncall=true;

			// IF SCENE STARTS, AND NO MEMORY SET, RESET CALL STATES
			if (obj.mode==="start" && _.triggercache!=="keep") _.frames[fi].timeline.callstate=_.frames[fi].timeline.waitoncall  ? "waiting" : "";




			//SET TRIGGER STATE ON SINGLE FRAMES
			if (obj.mode==="trigger" && _.frames[fi].timeline.waitoncall) {
				if (fi===obj.frame) {
					_.frames[fi].timeline.triggered=true;
					_.frames[fi].timeline.callstate="called";
				}
				else
					_.frames[fi].timeline.triggered=false;
			}


			if (obj.mode!=="rebuild" && !_.frames[fi].timeline.triggered) _.frames[fi].timeline.callstate = _.frames[fi].timeline.waitoncall  ? "waiting" : "";

			if (obj.fastforward!==false) {
				// WE DONT NEED TO RENDER THE FRAMES COMING BEFORE THE TRIGGERED ONE !
				if ((obj.mode==="continue" || obj.mode==="trigger") && calledframereached===false && fi!==obj.frame) continue;
				// IF REBUILD, CHECK IF WE ALREADY CALLED SOMETHIGN ELSE THAN FRAME_1 and Skip frames before to fix Timeline Issues
				if ((obj.mode==="rebuild" || obj.mode==="preset") && calledframereached===false && (_.triggeredFrame!==undefined && fi!==_.triggeredFrame)) continue;
				if (fi===obj.frame || (obj.mode==="rebuild" && fi===_.triggeredFrame)) calledframereached = true;
			} else {
				if (fi===obj.frame) calledframereached = true;
			}


			//SKIP FRAME IF IT IS ON ACTION, IF TWO NEIGHBOUR ACTION BASED, SKIP ANYTHING ELSE
			if (fi!==obj.frame && _.frames[fi].timeline.waitoncall && _.frames[fi].timeline.callstate!=="called") ignoreframes = true;
			if (fi!==obj.frame && calledframereached) ignoreframes = ignoreframes===true && _.frames[fi].timeline.waitoncall ? 'skiprest' : ignoreframes===true ? false : ignoreframes;

			if (_.hideonfirststart===undefined && fi==="frame_1" && _.frames[fi].timeline.waitoncall) _.hideonfirststart = true;

			// COMING FRAME IGNORED, OR FRAME IS NOT CALLED YET, OR FRAME IS WAITING, BUT NEVER RENDERED YET ?
			if (ignoreframes && _.frames[fi].timeline.callstate==="waiting" && obj.mode==="preset" && _.firstTimeRendered!=true) {
				renderJustFrom = true;
				_.firstTimeRendered = true;
			} else
			if ((ignoreframes==="skiprest") ||  (_.frames[fi].timeline.callstate!=="called" && ignoreframes && obj.toframe!==fi)) continue;



			if (fi==="frame_999" && (sl===false) && (obj.mode==="continue" || obj.mode==="start" || obj.mode==="rebuild")) continue;


			_.fff = fi===fifame && (obj.mode!=="trigger" || _.currentframe==="frame_999" || _.currentframe==="frame_0" || _.currentframe===undefined);


			if (!renderJustFrom) {
				_.frames[fi].timeline.callstate = "called";
				_.currentframe = fi;
			}

			var	_frameObj = _.frames[fi],
				_fromFrameObj = _.fff ? _.frames.frame_0 : undefined,
				ftl = new punchgs.TimelineMax(),
				tt = new punchgs.TimelineMax(),
				aObj = _.c,
				sfx = _frameObj.sfx!==undefined ? checkSFXAnimations(_frameObj.sfx.effect,_.m,_frameObj.timeline.ease) : false,
				speed = _frameObj.timeline.speed/1000,
				splitDelay = 0;



			var anim = convertTransformValues({id:id,frame:_frameObj, layer:L, ease:_frameObj.timeline.ease, splitAmount:aObj.length,target:fi, forcefilter:(_.frames.frame_hover!==undefined && _.frames.frame_hover.filter!==undefined)}),
				from = _.fff ? convertTransformValues({id:id,frame:_fromFrameObj, layer:L,ease:_frameObj.timeline.ease, splitAmount:aObj.length,target:"frame_0"}) : undefined,
				mask =  _frameObj.mask!==undefined ? convertTransformValues({id:id,frame:{transform:{x:_frameObj.mask.x, y:_frameObj.mask.y}}, layer:L, ease:anim.ease,target:"mask"}) : undefined,
				frommask = mask!==undefined && _.fff ? convertTransformValues({id:id,frame:{transform:{x:_fromFrameObj.mask.x, y:_fromFrameObj.mask.y}}, layer:L, ease:anim.ease,target:"frommask"}) : undefined,
				origEase = anim.ease;

			if (sfx.type==="block") {
				sfx.ft[0].background = _frameObj.sfx.fxc;
				ftl.add(punchgs.TweenMax.fromTo(sfx.bmask_in,speed/2, sfx.ft[0], sfx.ft[1] ,0));
				ftl.add(punchgs.TweenMax.fromTo(sfx.bmask_in,speed/2, sfx.ft[1], sfx.t, speed/2));
				if (fi==="frame_0" || fi==="frame_1")
					from.opacity=0;
				else
				if (fi==="frame_999")
					ftl.add(tt.staggerFromTo(aObj,0.05,{ autoAlpha:1},{autoAlpha:0,delay:speed/2},0),0.001);
			}




			// SET COLOR ON LAYER (TO AND FROM)
			if (_frameObj.color!==undefined)  anim.color = _frameObj.color;
			else
			if (_.color!==undefined && _.color[scren]!=="npc") anim.color = _.color[scren];

			if (_fromFrameObj!==undefined && _fromFrameObj.color!==undefined) from.color = _fromFrameObj.color;
			else
			if (_fromFrameObj!==undefined && _.color!==undefined && _.color[scren]!=="npc") from.color =_.color[scren];


			// SET BACKGROUNDCOLOR ON LAYER (TO AND FROM)
			if (_frameObj.bgcolor!==undefined)
				if (_frameObj.bgcolor.indexOf("gradient")>=0) anim.background = _frameObj.bgcolor; else anim.backgroundColor = _frameObj.bgcolor;
			else
				if (_.bgcolinuse===true) if (_.bgcol.indexOf("gradient")>=0) anim.background = _.bgcol; else anim.backgroundColor = _.bgcol;

			if (_fromFrameObj!==undefined) {
				if (_fromFrameObj.bgcolor!==undefined)
					if (_fromFrameObj.bgcolor.indexOf("gradient")>=0) from.background = _fromFrameObj.bgcolor; else from.backgroundColor = _fromFrameObj.bgcolor;
				else
					if (_.bgcolinuse===true) if (_.bgcol.indexOf("gradient")>=0) from.background = _.bgcol; else from.backgroundColor = _.bgcol;
			}


			var lengtobjstruc = 0;


			// ANIMATE CHARS, WORDS, LINES
			if (_.splitText!==undefined && _.splitText!==false) {
				for (var i in splitTypes) if (splitTypes.hasOwnProperty(i)) {
					if (_frameObj[splitTypes[i]]!==undefined && !_.quickRendering) {
						var sObj = getSplitTextDirs(_.splitText[splitTypes[i]],_frameObj[splitTypes[i]].dir),
							sanim = convertTransformValues({id:id,frame:_frameObj, source:splitTypes[i], ease:origEase, layer:L,splitAmount:sObj.length, target:fi+"_"+splitTypes[i]}),
							sfrom = (_.fff ? convertTransformValues({id:id,frame:_fromFrameObj,  ease:sanim.ease, source:splitTypes[i], layer:L,splitAmount:sObj.length, target:"frame_0_"+splitTypes[i]}) : undefined);

						splitDelay =  _frameObj[splitTypes[i]].delay===undefined ? 0.05 : _frameObj[splitTypes[i]].delay /100;


						// SET COLOR ON SPLIT  (TO AND FROM)

						sanim.color = anim.color;
						if (from!==undefined) sfrom.color = from.color;

						var	$anim = getCycles(jQuery.extend(true,{},sanim)),
							$from = _.fff ? getCycles(jQuery.extend(true,{},sfrom)) : undefined;

						delete $anim.dir;

						// this is needed to ensure that the WhiteBoard "tw.onstart" eventCallback is only applied to these specific tweens
						// search the WhiteBoard front-end script for "splitted" to see how it's used
						// https://greensock.com/docs/TweenMax/data
						$anim.data = {splitted: true};
						if ($from!==undefined) delete $from.dir;
						if (_.fff)
							ftl.add(tt.staggerFromTo(sObj,speed,$from,$anim,(_.frames[fi].split ? splitDelay : 0),0),0);
						else
							ftl.add(tt.staggerTo(sObj,speed,$anim,(_.frames[fi].split ? splitDelay : 0),0),0);

						lengtobjstruc = sObj.length > lengtobjstruc ? sObj.length : lengtobjstruc;

					} else {
						if (_.fff) {
							ftl.add(tt.fromTo(_.splitText[splitTypes[i]],speed,{immediateRender:false,color:from.color},{color:anim.color},0),0);
						} else
							ftl.add(tt.to(_.splitText[splitTypes[i]],speed,{color:anim.color},0),0);
					}
				}
			}



			//SPEED SYNC WITH THE SPLIT SPEEDS IF NECESSARY
			speed = speed + (_.frames[fi].split ? (splitDelay*lengtobjstruc) : 0);

			// ANIMATE MASK
			if (_.pxundermask || (mask!==undefined && ((_fromFrameObj!==undefined && _fromFrameObj.mask.overflow==="hidden") || _frameObj.mask.overflow==="hidden"))) {
				ftl.add(punchgs.TweenMax.to(_.m,0.001,{overflow:"hidden"}),0);
				if (_.type==="column") ftl.add(punchgs.TweenMax.to(_.cbgmask,0.001,{overflow:"hidden"}),0);
				if (_.btrans) {
					if (frommask) { frommask.rotationX = _.btrans.rX;frommask.rotationY = _.btrans.rY;frommask.rotationZ = _.btrans.rZ;frommask.opacity = _.btrans.o;}
					mask.rotationX = _.btrans.rX;mask.rotationY = _.btrans.rY;mask.rotationZ = _.btrans.rZ;mask.opacity = _.btrans.o;
				}
				if (_.fff)
					ftl.add(punchgs.TweenMax.fromTo([_.m,_.cbgmask],speed,jQuery.extend(true,{},frommask),jQuery.extend(true,{},mask)),0.001);
				else
					ftl.add(punchgs.TweenMax.to([_.m,_.cbgmask],speed,jQuery.extend(true,{},mask)),0.001);
			} else {
				if (_.btrans!==undefined)
					ftl.add(punchgs.TweenMax.to(_.m,0.001,{x:0, y:0, filter:"none", opacity:_.btrans.o, rotationX:_.btrans.rX, rotationY:_.btrans.rY, rotationZ:_.btrans.rZ, overflow:"visible"}),0);
				else
					ftl.add(punchgs.TweenMax.to(_.m,0.001,{clearProps:"transform", overflow:"visible"}),0);
			}

			anim.force3D="auto";



			// ANIMATE ELEMENT
			if (_.fff) {

				anim.visibility="visible";
				if (_.cbg!==undefined) ftl.fromTo(_.cbg,speed,from,anim,0);
				// safari bug fix
				if(_R[id].BUG_safari_clipPath && (from.clipPath || anim.clipPath || _.spike)) {
					if(!from.z || !parseInt(from.z, 10)) from.z = -0.0001;
					if(!anim.z || !parseInt(anim.z, 10)) anim.z = 0;
				}
				if (_.cbg!==undefined && _.type==="column")	ftl.fromTo(aObj,speed,reduceColumn(from),reduceColumn(anim),0);
				else ftl.fromTo(aObj,speed,from,anim,0);
			} else {
				if (_.cbg!==undefined) ftl.to(_.cbg,speed,anim,0);
				// safari bug fix
				if(_R[id].BUG_safari_clipPath && (anim.clipPath || _.spike) && (!anim.z || !parseInt(anim.z, 10))) anim.z = 0-Math.random()*0.01;
				if (_.cbg!==undefined && _.type==="column")	ftl.to(aObj, speed, reduceColumn(anim),0);
				else ftl.to(aObj, speed, anim,0);
			}

			if (origEase!==undefined && typeof origEase!=="object" && origEase.indexOf("SFXBounce")>=0) ftl.to(aObj,speed,{scaleY:0.5,scaleX:1.3,ease:anim.ease+"-squash",transformOrigin:"bottom"},0.0001);

			//WAITING FRAMES ADD DIRECTLY AFTER OTHER FRAMES

			var pos = 	(obj.mode==="trigger" || ((ignoreframes===true || ignoreframes==="skiprest") && obj.mode==="rebuild")) && obj.frame!==fi && _frameObj.timeline.start!==undefined && jQuery.isNumeric(_frameObj.timeline.start) ?
						 "+="+parseInt(_frameObj.timeline.startRelative,0)/1000 :
						_frameObj.timeline.start==="+=0" || _frameObj.timeline.start===undefined ? "+=0.005" : parseInt(_frameObj.timeline.start,0)/1000;




			_.timeline.addLabel(fi,pos);
			_.timeline.add(ftl,pos);
			_.timeline.addLabel(fi+"_end","+=0.01");
			ftl.eventCallback("onStart",tweenOnStart,[{id:id, frame:fi, L:L}]);
			if (_.animationonscroll=="true" || _.animationonscroll==true) {
				ftl.eventCallback("onUpdate",tweenOnUpdate,[{id:id, frame:fi, L:L}]);
				ftl.smoothChildTiming=true;
			} else {
				ftl.eventCallback("onUpdate",tweenOnUpdate,[{id:id, frame:fi, L:L}]);
			}
			ftl.eventCallback("onComplete",tweenOnEnd,[{id:id, frame:fi, L:L}]);
		}

		//RENDER LOOP ANIMATION
		if (_.frames.loop!==undefined) {
			var lif = _.frames.loop.frame_0,
				lof = _.frames.loop.frame_999,
				looptime = new punchgs.TimelineMax({}),
				loopmove = new punchgs.TimelineMax({repeat:-1,yoyo:_.frames.loop.timeline.yoyo_move}),
				looprotate = new punchgs.TimelineMax({repeat:-1,yoyo:_.frames.loop.timeline.yoyo_rotate}),
				loopscale = new punchgs.TimelineMax({repeat:-1,yoyo:_.frames.loop.timeline.yoyo_scale}),
				loopfilter = new punchgs.TimelineMax({repeat:-1,yoyo:_.frames.loop.timeline.yoyo_filter}),
				lspeed = parseInt(_.frames.loop.timeline.speed,0)/1000,
				lstart = parseInt(_.frames.loop.timeline.start)/1000 || 0,
				lsspeed = 0.2,
				lssstart = lstart+lsspeed;

			looptime.add(loopmove,0);
			looptime.add(looprotate,0);
			looptime.add(loopscale,0);
			looptime.add(loopfilter,0);
			lof.originX = lif.originX;
			lof.originY = lif.originY;
			lof.originZ = lif.originZ;


			//LOOP MOVE ANIMATION

			if (!_.frames.loop.timeline.curved) {
				//Move in First Position
				_.timeline.fromTo(_.lp,lsspeed,{'-webkit-filter':'blur('+(lif.blur || 0)+'px) grayscale('+(lif.grayscale || 0)+'%) brightness('+(lif.brightness || 100)+'%)', 'filter':'blur('+(lif.blur || 0)+'px) grayscale('+(lif.grayscale || 0)+'%) brightness('+(lif.brightness || 100)+'%)', x:0,y:0,z:0, minWidth:(_._incolumn || _._ingroup ? "100%" : _.eow===undefined ? 0 : _.eow), minHeight:(_._incolumn || _._ingroup ? "100%" : _.eoh===undefined ? 0 : _.eoh), scaleX:1, scaleY:1, skew:0, rotationX:0, rotationY:0,rotationZ:0, transformPerspective:600, transformOrigin:lof.originX+" "+lof.originY+" "+lof.originZ, opacity:1},{ x:lif.x*_R[id].bw, y:lif.y*_R[id].bw, z:lif.z*_R[id].bw, scaleX:lif.scaleX, skewX:lif.skewX, skewY:lif.skewY, scaleY:lif.scaleY,rotationX:lif.rotationX,rotationY:lif.rotationY,rotationZ:lif.rotationZ, ease:punchgs.Sine.easeOut, opacity:lif.opacity,'-webkit-filter':'blur('+parseInt(lif.blur || 0,0)+'px) grayscale('+parseInt(lif.grayscale || 0 ,0)+'%) brightness('+parseInt(lif.brightness || 100,0)+'%)', 'filter':'blur('+parseInt(lif.blur || 0,0)+'px) grayscale('+parseInt(lif.grayscale || 0,0)+'%) brightness('+parseInt(lif.brightness || 100,0)+'%)'},lstart);
				loopmove.to(_.lp,(_.frames.loop.timeline.yoyo_move ? lspeed/2 : lspeed),{x:lof.x*_R[id].bw, y:lof.y*_R[id].bw, z:lof.z*_R[id].bw, ease:_.frames.loop.timeline.ease});
			} else {
				//CALCULATE EDGES
				var sangle = parseInt(_.frames.loop.timeline.radiusAngle,0) || 0,
					v = [	{x:(lif.x-lif.xr)*_R[id].bw, y:0, z:(lif.z-lif.zr)*_R[id].bw},
							{x:0, y:(lif.y+lif.yr)*_R[id].bw, z:0},
							{x:(lof.x+lof.xr)*_R[id].bw, y:0, z:(lof.z+lof.zr)*_R[id].bw},
							{x:0, y:(lof.y-lof.yr)*_R[id].bw, z:0}
						],
					bezier = {type:"thru",curviness:_.frames.loop.timeline.curviness,values:[],autoRotate:_.frames.loop.timeline.autoRotate};

				for (var bind in v) {
					if (!v.hasOwnProperty((bind))) continue;
					bezier.values[bind] = v[sangle];
					sangle++;
					sangle = sangle==v.length ? 0 : sangle;
				}
				//Move in First Position
				_.timeline.fromTo(_.lp,lsspeed,{ '-webkit-filter':'blur('+(lif.blur || 0)+'px) grayscale('+(lif.grayscale || 0)+'%) brightness('+(lif.brightness || 100)+'%)', 'filter':'blur('+(lif.blur || 0)+'px) grayscale('+(lif.grayscale || 0)+'%) brightness('+(lif.brightness || 100)+'%)', x:0,y:0,z:0, minWidth:(_._incolumn || _._ingroup ? "100%" : _.eow===undefined ? 0 : _.eow), minHeight:(_._incolumn || _._ingroup ? "100%" : _.eoh===undefined ? 0 : _.eoh), scaleX:1, scaleY:1, skew:0, rotationX:0, rotationY:0,rotationZ:0, transformPerspective:600, transformOrigin:lof.originX+" "+lof.originY+" "+lof.originZ, opacity:1},
											   { x:bezier.values[3].x, y:bezier.values[3].y, z:bezier.values[3].z, scaleX:lif.scaleX, skewX:lif.skewX, skewY:lif.skewY, scaleY:lif.scaleY,rotationX:lif.rotationX,rotationY:lif.rotationY,rotationZ:lif.rotationZ, '-webkit-filter':'blur('+parseInt(lif.blur,0)+'px) grayscale('+parseInt(lif.grayscale,0)+'%) brightness('+parseInt(lif.brightness,0)+'%)', 'filter':'blur('+parseInt(lif.blur,0)+'px) grayscale('+parseInt(lif.grayscale,0)+'%) brightness('+parseInt(lif.brightness,0)+'%)', ease:punchgs.Sine.easeInOut, opacity:lif.opacity},lstart);

				loopmove.to(_.lp,(_.frames.loop.timeline.yoyo_move ? lspeed/2 : lspeed),{bezier:bezier, ease:_.frames.loop.timeline.ease});
			}

			//LOOP ROTATE ANIMATION
			looprotate.to(_.lp,(_.frames.loop.timeline.yoyo_rotate ? lspeed/2 : lspeed),{rotationX:lof.rotationX,rotationY:lof.rotationY,rotationZ:lof.rotationZ, ease:_.frames.loop.timeline.ease});
			//LOOP SCALE ANIMATION
			loopscale.to(_.lp,(_.frames.loop.timeline.yoyo_scale ? lspeed/2 : lspeed),{scaleX:lof.scaleX, scaleY:lof.scaleY, skewX:lof.skewX, skewY:lof.skewY, ease:_.frames.loop.timeline.ease});

			//LOOP FILTER ANIMATION
			var filtanim = { opacity:lof.opacity || 1 ,ease:_.frames.loop.timeline.ease, '-webkit-filter':'blur('+(lof.blur || 0)+'px) grayscale('+(lof.grayscale || 0)+'%) brightness('+(lof.brightness || 100)+'%)', 'filter':'blur('+(lof.blur || 0)+'px) grayscale('+(lof.grayscale || 0)+'%) brightness('+(lof.brightness || 100)+'%)'};
			loopfilter.to(_.lp,(_.frames.loop.timeline.yoyo_filter ? lspeed/2 : lspeed),filtanim);

			//WELCHE WERTE MUSS ICH HIN UND HER SCHIEBEN ??
			_.timeline.add(looptime,lssstart);
		}


		// RENDER HOVER ANIMATION
		if (_.frames.frame_hover!==undefined && (obj.mode==="start" || _.hoverframeadded===undefined)) {

			_.hoverframeadded = true;
			var hoverspeed = _.frames.frame_hover.timeline.speed/1000;
			hoverspeed = hoverspeed===0 ? 0.00001 : hoverspeed;

			//SET HOVER ANIMATION
			if (!_.hoverlistener) {
				_.hoverlistener= true;
				jQuery(document).on("mouseenter mousemove",(_.type==="column" ? "#"+_.cbg[0].id+",": "")+"#"+_.c[0].id,function(e) {

					if (e.type==="mousemove" && _.ignoremousemove===true) return;
					// possible solution to "hover not working on initial load"
					// with a new "overrride frames" option applied
					/*
					if(!_.readyForHover && _.frame_hover.override) {

						_.timeline.progress(1);
						_.readyForHover = true;

					}
					*/

					if (_.readyForHover) {
						_.ignoremousemove =true;
						_.elementHovered = true;

						// only create new hover timeline if it doesn't already exist
						if(!_.hovertimeline) _.hovertimeline = new punchgs.TimelineMax();
						_.hovertimeline.to([_.m,_.cbgmask],hoverspeed,{overflow:(_.frames.frame_hover.mask ? "hidden" : "visible")},0);
						if (_.type==="column") _.hovertimeline.to(_.cbg,hoverspeed,jQuery.extend(true,{},convertHoverTransform(_.frames.frame_hover,_.cbg)),0);


						_.hovertimeline.pause();
						if ((_.type==="text" || _.type==="button") && _.splitText!==undefined && _.splitText!==false) _.hovertimeline.to([_.splitText.lines, _.splitText.words, _.splitText.chars],hoverspeed,{ color:_.frames.frame_hover.color,ease:_.frames.frame_hover.transform.ease},0);
						if (_.type==="column")
							_.hovertimeline.to(_.c,hoverspeed,reduceColumn(jQuery.extend(true,{},convertHoverTransform(_.frames.frame_hover,_.c))),0);
						else
							_.hovertimeline.to(_.c,hoverspeed,jQuery.extend(true,{},convertHoverTransform(_.frames.frame_hover,_.c)),0);
						if (_.type==="svg") {
							_.svgHTemp = jQuery.extend(true,{},_.svgH);

							// hover colors can exist on the different responsive levels
							var fillColor = Array.isArray(_.svgHTemp.fill) ? _.svgHTemp.fill[_R[id].level] : _.svgHTemp.fill;
							_.svgHTemp.fill = fillColor;

							_.hovertimeline.to(_.svg,hoverspeed,_.svgHTemp,0);
							_.hovertimeline.to(_.svgPath,hoverspeed,{ fill: fillColor},0);
						}
						_.hovertimeline.play();
					}
				});
				jQuery(document).on("mouseleave",(_.type==="column" ? "#"+_.cbg[0].id+",": "")+"#"+_.c[0].id,function() {
					_.elementHovered = false;
					if (_.readyForHover && _.hovertimeline!==undefined) {
						_.hovertimeline.reverse();
						_.hovertimeline.eventCallback("onReverseComplete",hoverReverseDone,[{id:id, L:L}]);
					}
				});
			}
		}



		if (!renderJustFrom)  _.lastRequestedMainFrame = obj.mode==="start" ? "frame_1" : obj.mode==="continue" ? obj.frame :  _.lastRequestedMainFrame;



		if (obj.totime!==undefined) _.tSTART  = obj.totime;
		else
		if (cachetime!==undefined && obj.frame===undefined) _.tSTART = cachetime;
		else
		if (obj.frame!==undefined) _.tSTART = obj.frame;
		else
		_.tSTART = 0;


		if (_.tSTART===0 && _.startedAnimOnce===undefined && _.leftstage===undefined && _.startedAnimOnce===undefined && _.hideonfirststart===true && obj.mode==="preset") {
			_R[id]._L[L[0].id].p[0].classList.add("rs-forcehidden");
			_.hideonfirststart = false;
		}


		if ((_.tSTART==="frame_999" || _.triggeredFrame==="frame_999") && (_.leftstage || _.startedAnimOnce===undefined)) {
			// WE DONT NEED TO TOUCH THE LAYER, IT IS ANYWAY NOT VISIBLE
		} else {
			if (_.animationonscroll!="true" && _.animationonscroll!=true)
				_.timeline.play(_.tSTART);
			else
				_.timeline.time(_.tSTART);



			// Move Children Timeline to the Right Position
			if (jQuery.inArray(_.type,["group","row","column"])>=0 && obj.updateChildren===true) {
				if (_.childrenJS===undefined) {
					_.childrenJS={};
					for (var i in _R[id]._L)
						if (_R[id]._L[i]._lig!==undefined && _R[id]._L[i]._lig[0]!==undefined && _R[id]._L[i]._lig[0].id === L[0].id && _R[id]._L[i]._lig[0].id !== _R[id]._L[i].c[0].id)
							_.childrenJS[_R[id]._L[i].c[0].id] = _R[id]._L[i].c;
				}
				var totime = obj.totime===undefined ?
											    		_.frames[obj.frame].timeline.startAbsolute !== undefined ?
											    			parseInt(_.frames[obj.frame].timeline.startAbsolute,0)/1000 :
											    			_.frames[obj.frame].timeline.start!==undefined ?
											    			jQuery.isNumeric( _.frames[obj.frame].timeline.start) ?
											    				parseInt(_.frames[obj.frame].timeline.start,0)/1000 : obj.totime
											    			: 0.001
											    		: obj.totime;
				for (var i in _.childrenJS) if (_.childrenJS.hasOwnProperty(i)) _R.renderLayerAnimation({layer:_.childrenJS[i],fastforward:false,id:id,mode:"continue",updateChildren:true,totime: totime});
			}
		}
	}

});


/**********************************************************************************************
						-	TWEEN STARTS AND ENDS -
**********************************************************************************************/

var reduceColumn = function(_) {
	var r = jQuery.extend(true,{},_);
	delete r.backgroundColor;
	delete r.background;
	delete r.backgroundImage;
	delete r.borderSize;
	delete r.borderStyle;
	return r;
};


var hoverReverseDone = function(_) {
	if (_R[_.id]._L[_.L[0].id].textDecoration) punchgs.TweenMax.set(_R[_.id]._L[_.L[0].id].c,{textDecoration:_R[_.id]._L[_.L[0].id].textDecoration});
};

var tweenOnStart = function(_) {
	if (_R[_.id].BUG_safari_clipPath) _.L[0].classList.remove("rs-pelock");


	//Check if Group Element Animation should be paused
	if ((_R[_.id]._L[_.L[0].id]._ingroup || _R[_.id]._L[_.L[0].id]._incolumn || _R[_.id]._L[_.L[0].id]._inrow) &&  _R[_.id]._L[_R[_.id]._L[_.L[0].id]._ligid]!==undefined && _R[_.id]._L[_R[_.id]._L[_.L[0].id]._ligid].timeline!==undefined) {
		if  (!_R[_.id]._L[_R[_.id]._L[_.L[0].id]._ligid].timeline.isActive() && _R[_.id]._L[_.L[0].id]!==undefined && _R[_.id]._L[_.L[0].id].frames[_R[_.id]._L[_.L[0].id].timeline.currentLabel()]!==undefined)
			if (_R[_.id]._L[_R[_.id]._L[_.L[0].id]._ligid].timezone==undefined || _R[_.id]._L[_R[_.id]._L[_.L[0].id]._ligid].timezone.to<=parseInt(_R[_.id]._L[_.L[0].id].frames[_R[_.id]._L[_.L[0].id].timeline.currentLabel()].timeline.start,0))
				if (_R[_.id]._L[_.L[0].id].animOnScrollForceDisable!==true)
				_R[_.id]._L[_.L[0].id].timeline.pause();
	}

	// handle hover madness
	var curLayer = _R[_.id]._L[_.L[0].id],
		hovertimeline = curLayer.hovertimeline;

	if(hovertimeline && hovertimeline.time() > 0) {
		hovertimeline.pause();
		hovertimeline.time(0);
		hovertimeline.kill();
		delete curLayer.hovertimeline;
	}

	_R[_.id]._L[_.L[0].id].p[0].classList.remove("rs-forcehidden");

	var data={};
	_R[_.id]._L[_.L[0].id].ignoremousemove = false;
	_R[_.id]._L[_.L[0].id].leftstage = false;
	_R[_.id]._L[_.L[0].id].readyForHover = false;
	data.layer = _.L;
	if (_R[_.id]._L[_.L[0].id].layerLoop!==undefined) if (_R[_.id]._L[_.L[0].id].layerLoop.from===_.frame) _R[_.id]._L[_.L[0].id].layerLoop.count++;

	if (_.frame!=="frame_999") {
		_R[_.id]._L[_.L[0].id].startedAnimOnce = true;
		punchgs.TweenMax.set([_R[_.id]._L[_.L[0].id].c,_R[_.id]._L[_.L[0].id].l,_R[_.id]._L[_.L[0].id].m],{visibility:"visible"});
		punchgs.TweenMax.set(_R[_.id]._L[_.L[0].id].p,{pointerEvents:(_R[_.id]._L[_.L[0].id].noPevents ? "none" : "auto"),visibility:"visible"});
	}
	data.eventtype = _.frame==="frame_0" || _.frame==="frame_1" ? "enterstage" : _.frame==="frame_999" ? "leavestage" : "framestarted";
	data.layertype = _R[_.id]._L[_.L[0].id].type;
	data.frame_index = _.frame;
	data.layersettings = _R[_.id]._L[_.L[0].id];
	_R[_.id].c.trigger("revolution.layeraction",[data]);
	if (data.eventtype==="enterstage") _R.toggleState(_R[_.id]._L[_.L[0].id].layertoggledby);
	if (_.frame==="frame_1") _R.animcompleted(_.L,_.id);
};

var tweenOnUpdate = function(_) {
	if (_.frame==="frame_999") {
		if (_R[_.id]._L[_.L[0].id].leftstage) _R[_.id]._L[_.L[0].id].p[0].classList.remove("rs-forcehidden");
		_R[_.id]._L[_.L[0].id].leftstage = false;
		punchgs.TweenMax.set(_R[_.id]._L[_.L[0].id].c,{visibility:"visible"});
		punchgs.TweenMax.set(_R[_.id]._L[_.L[0].id].p,{pointerEvents: _R[_.id]._L[_.L[0].id].noPevents ? "none" : "auto",visibility:"visible"});
	}
};

var tweenOnEnd = function(_) {

	var vis = true;
	//GET ZONE
	if (_R[_.id]._L[_.L[0].id].type==="column" || _R[_.id]._L[_.L[0].id].type==="row" || _R[_.id]._L[_.L[0].id].type==="group") {
		var cl = _R[_.id]._L[_.L[0].id].timeline.currentLabel(),
			nl = jQuery.inArray(cl,_R[_.id]._L[_.L[0].id].ford);
		nl++;
		nl = _R[_.id]._L[_.L[0].id].ford.length>nl ? _R[_.id]._L[_.L[0].id].ford[nl] : cl;

		if (_R[_.id]._L[_.L[0].id].frames[nl]!==undefined && _R[_.id]._L[_.L[0].id].frames[cl]!==undefined) {
			_R[_.id]._L[_.L[0].id].timezone = { from: parseInt(_R[_.id]._L[_.L[0].id].frames[cl].timeline.startAbsolute,0), to: parseInt(_R[_.id]._L[_.L[0].id].frames[nl].timeline.startAbsolute,0)};
		}
	}
	if (_.frame==="frame_999") {

		punchgs.TweenMax.set(_R[_.id]._L[_.L[0].id].c,{visibility:"hidden"});
		punchgs.TweenMax.set(_R[_.id]._L[_.L[0].id].p,{pointerEvents:"none",visibility:"hidden"});

		vis = false;
	}
	var data={};
	data.layer = _.L;
	data.eventtype = _.frame==="frame_0" || _.frame==="frame_1" ? "enteredstage" : _.frame==="frame_999" ? "leftstage" : "frameended";
	_R[_.id]._L[_.L[0].id].readyForHover = true;
	data.layertype = _R[_.id]._L[_.L[0].id].type;
	data.frame_index = _.frame;
	data.layersettings = _R[_.id]._L[_.L[0].id];
	_R[_.id].c.trigger("revolution.layeraction",[data]);

	if (_.frame==="frame_999" && data.eventtype==="leftstage") {
		_R[_.id]._L[_.L[0].id].leftstage = true;
		_R[_.id]._L[_.L[0].id].p[0].classList.add("rs-forcehidden");

	}


	//if (data.eventtype!=="leftstage") _R.animcompleted(_.L,_.id);
	if (data.eventtype==="leftstage" && _R[_.id].videos!==undefined && _R[_.id].videos[_.L[0].id]!==undefined && _R.stopVideo) _R.stopVideo(_.L,_.id);

	if (_R[_.id]._L[_.L[0].id].type==="column") {
		//punchgs.TweenMax.to(_R[_.id]._L[_.L[0].id].cbg_man,0.01,{visibility:"hidden"});
		punchgs.TweenMax.to(_R[_.id]._L[_.L[0].id].cbg,0.01,{visibility:"visible"});
	}
	if (data.eventtype === "leftstage") {

		_R.unToggleState(_.layertoggledby);
		//RESET VIDEO AFTER REMOVING LAYER
		if (_R[_.id]._L[_.L[0].id].type==="video" && _R.resetVideo) setTimeout(function() {	_R.resetVideo(_.L,_.id); },100);
	}

	if (_R[_.id].BUG_safari_clipPath && !vis) _.L[0].classList.add("rs-pelock");

	// Loop Layer if Needed
	if (_R[_.id]._L[_.L[0].id].layerLoop!==undefined && _R[_.id]._L[_.L[0].id].layerLoop.to===_.frame)
		if ((_R[_.id]._L[_.L[0].id].layerLoop.repeat==-1 || _R[_.id]._L[_.L[0].id].layerLoop.repeat>_R[_.id]._L[_.L[0].id].layerLoop.count))
			_R.renderLayerAnimation({layer:_R[_.id]._L[_.L[0].id].c, frame:_R[_.id]._L[_.L[0].id].layerLoop.from, updateChildren:_R[_.id]._L[_.L[0].id].layerLoop.children, mode:"continue", fastforward:_R[_.id]._L[_.L[0].id].layerLoop.keep===true ? true : false, id:_.id});

};

/**********************************************************************************************
						-	HELPER FUNCTIONS FOR LAYER TRANSFORMS -
**********************************************************************************************/
////////////////////////////////
// EXTRA INTERNAL FUNCTIONS  //
//////////////////////////////
///

var convertHoverTransform = function (_,el) {
	var a = jQuery.extend(true,{},_.transform);
	if (a.originX || a.originY || a.originZ) {
		a.transformOrigin = (a.originX===undefined ? "50%" : a.originX)+" "+(a.originY===undefined ? "50%" : a.originY)+" "+(a.originZ===undefined ? "50%" : a.originZ);
		delete a.originX;
		delete a.originY;
		delete a.originZ;
	}

	if (_!==undefined && _.filter!==undefined) {
		a['-webkit-filter']  = 'blur('+(_.filter.blur || 0)+'px) grayscale('+(_.filter.grayscale || 0)+'%) brightness('+(_.filter.brightness || 100)+'%)';
		a.filter 		 = 'blur('+(_.filter.blur || 0)+'px) grayscale('+(_.filter.grayscale || 0)+'%) brightness('+(_.filter.brightness || 100)+'%)';
	}
	a.color = a.color===undefined ? 'rgba(255,255,255,1)' : a.color;
	a.force3D="auto";

	if(a.backgroundImage && typeof a.backgroundImage === 'string' && a.backgroundImage.search('gradient') !== -1 && ((gradDegree(el.css('backgroundImage')) !== 180 && gradDegree(a.backgroundImage) === 180))) a.backgroundImage = addGradDegree(a.backgroundImage, 180);
  	return a;
 };

var addGradDegree = function(grad, deg) {

	grad = grad.split('(');
	var begin = grad[0];
	grad.shift();
	return begin + '(' + deg + 'deg, ' + grad.join('(');

};

var gradDegree = function(grad) {

	if(grad.search('deg,') !== -1) {
		var deg = grad.split('deg,')[0];
		if(deg.search(/\(/) !== -1) return parseInt(deg.split('(')[1], 10);
	}

	return 180;

};


var _svgprep = function(a,id) {
	a = a===undefined ? "" : a.split(";");

	// default fill needs to be responsive
	var r = { fill:_R.revToResp('#ffffff',_R[id].rle), stroke:'transparent', "stroke-width":"0px","stroke-dasharray":"0","stroke-dashoffset":"0"};
	for (var u in a) {
		if (!a.hasOwnProperty(u)) continue;
		var s = a[u].split(":");
		switch (s[0]) {
			case "c": r.fill = _R.revToResp(s[1],_R[id].rle,undefined,"||"); break;
			case "sw": r["stroke-width"] = s[1];break;
			case "sc": r.stroke = s[1];break;
			case "so": r["stroke-dashoffset"] = s[1]; break;
			case "sa": r["stroke-dasharray"] = s[1]; break;
		}
	}
	return r;
};

var convToCLR = function(a) {
	return a==="c" ? "center" : a==="l" ? "left" : a==="r" ?  "right" : a;
};


/*
UPDATE SPLITTED OR NONE SPLITTED CONTENT
*/
var updateSplitContent = function(obj) {
	var _ = _R[obj.id]._L[obj.layer[0].id],
		split = false;
	if (_.splitText && _.splitText!==false) _.splitText.revert();
	if (_.type==="text" || _.type==="button") {
		for (var frame  in _.frames) {
			if (_.frames[frame].chars!==undefined || _.frames[frame].words!==undefined || _.frames[frame].lines!==undefined) {
				split = true;
				break;
			}
		}
		if (split)
			_.splitText = new punchgs.SplitText(_.c,{type:"lines,words,chars",wordsClass:"rs_splitted_words",linesClass:"rs_splitted_lines",charsClass:"rs_splitted_chars"});
		else
			_.splitText = false;
	}
	else _.splitText = false;

};


// SFX ANIMATIONS
var checkSFXAnimations = function(effect,mask,easedata) {
	// BLOCK SFX ANIMATIONS
	if (effect!==undefined && effect.indexOf("block")>=0) {
		var sfx = {};

		if (mask.find('.tp-blockmask_in').length===0) {

			mask.append('<div class="tp-blockmask_in"></div>');
			mask.append('<div class="tp-blockmask_out"></div>');
		}
		easedata=easedata===undefined ? punchgs.Power3.easeInOut : easedata;

		sfx.ft = [{scaleY:1,scaleX:0,transformOrigin:"0% 50%"},{scaleY:1,scaleX:1,ease:easedata,immediateRender:false}];
		sfx.t =  {scaleY:1,scaleX:0,transformOrigin:"100% 50%",ease:easedata,immediateRender:false};
		sfx.bmask_in = mask.find('.tp-blockmask_in');
		sfx.bmask_out = mask.find('.tp-blockmask_out');
		sfx.type = "block";

		switch (effect) {
			case "blocktoleft":
			case "blockfromright":
				sfx.ft[0].transformOrigin = "100% 50%";
				sfx.t.transformOrigin = "0% 50%";
			break;

			case "blockfromtop":
			case "blocktobottom":
				sfx.ft = [{scaleX:1,scaleY:0,transformOrigin:"50% 0%"},{scaleX:1,scaleY:1,ease:easedata,immediateRender:false}];
				sfx.t =  {scaleX:1,scaleY:0,transformOrigin:"50% 100%",ease:easedata,immediateRender:false};
			break;

			case "blocktotop":
			case "blockfrombottom":
				sfx.ft = [{scaleX:1,scaleY:0,transformOrigin:"50% 100%"},{scaleX:1,scaleY:1,ease:easedata,immediateRender:false}];
				sfx.t =  {scaleX:1,scaleY:0,transformOrigin:"50% 0%",ease:easedata,immediateRender:false};
			break;
		}
		sfx.ft[1].overwrite = "auto";
		sfx.t.overwrite = "auto";

		return sfx;
	} else {
		//mask.find('.tp-blockmask').remove();
		return false;
	}
};

var checkReverse = function(a,r,t,atr,id) {
	if (_R[id].sdir===0 || r===undefined) return a;
	if (t==="mask") atr = atr==="x" ? "mX" : atr==="y" ? "mY" : atr;
	else
	if (t==="chars") atr = atr==="x" ? "cX" : atr==="y" ? "cY" : atr==="dir" ? "cD" : atr;
	else
	if (t==="words") atr = atr==="x" ? "wX" : atr==="y" ? "wY" : atr==="dir" ? "wD" : atr;
	else
	if (t==="lines") atr = atr==="x" ? "lX" : atr==="y" ? "lY" : atr==="dir" ? "lD" : atr;
	if (r[atr]===undefined || r[atr]===false) return a;
	else
	if (r!==undefined && r[atr]===true) return a==="t" || a==="top" ? "b" : a==="b"  || a==="bottom" ? "t" : a==="l"  || a==="left" ? "r" : a==="r"  || a==="right" ? "l" : (a*-1);

};

var convertTransformValues = function(obj) {
	var _ = _R[obj.id]._L[obj.layer[0].id],
		a = obj.source === undefined ? jQuery.extend(true,{},obj.frame.transform) : jQuery.extend(true,{},obj.frame[obj.source]),
		torig = {originX:"50%", originY:"50%", originZ:"0"},
		parw = _R[obj.id].conw, // PARENT DIM MUST BE CALCULATED IF IN GROUP / ROW / COLUMN !!
		parh = _R[obj.id].conh; // PARENT DIM MUST BE CALCULATED IF IN GROUP / ROW / COLUMN !!


	for (var atr in a) {
		if (!a.hasOwnProperty(atr)) continue;
		a[atr] = (typeof a[atr]==="object") ? a[atr][_R[obj.id].level] : a[atr];

		if (a[atr] === "inherit" || atr==="delay" || atr==="direction" || atr==="use") {
			delete a[atr];
		} else

		if (atr==="originX" || atr==="originY" || atr==="originZ") {
			torig[atr] = a[atr];
			delete a[atr];
		} else {

			if (jQuery.isNumeric(a[atr],0)) {
				a[atr] = checkReverse(a[atr],obj.frame.reverse,obj.target,atr,obj.id,obj.id);
			} else

			if (a[atr][0]==="r" && a[atr][1]==="a" && a[atr]!=="random") {
				a[atr] = a[atr].replace("ran(","").replace(")","");


				var proc = a[atr].indexOf("%")>=0 ? "%" : "",
					minmax = a[atr].split("|");

				minmax[0] = parseFloat(minmax[0]);
				minmax[1] = parseFloat(minmax[1]);

				if (obj.splitAmount!==undefined && obj.splitAmount>1) {
					a[atr]="["+(Math.random()*(minmax[1]-minmax[0]) + minmax[0]) +proc;
					for (var i=0;i<obj.splitAmount;i++) {
						a[atr] = a[atr]+"|"+(Math.random()*(minmax[1]-minmax[0]) + minmax[0])+proc;
					}
					a[atr] = a[atr]+"]";
				} else {
					a[atr] = (Math.random()*(minmax[1]-minmax[0])+minmax[0])+proc;
				}
			} else {
				a[atr] = a[atr].replace("[","").replace("]","");
				a[atr] = a[atr].replace("cyc(","").replace(")","");
				var b = parseInt(a[atr],0);
				if (a[atr].indexOf("%")>=0 && jQuery.isNumeric(b)) {
					if (atr=="x") a[atr] = checkReverse(_.eow*b/100,obj.frame.reverse,obj.target,atr,obj.id);
					else
					if (atr=="y") a[atr] = checkReverse(_.eoh*b/100,obj.frame.reverse,obj.target,atr,obj.id);
				} else {
					a[atr] = checkReverse(a[atr],obj.frame.reverse,obj.target,atr,obj.id,obj.id);

					switch (a[atr]) {
						case "t": case "top": a[atr] = 0-_.eoh- (_.type==="column" ? 0 : _.calcy);break;
						case "b": case "bottom": a[atr] = parh - (_.type==="column" ? 0 : _.calcy);break;
						case "l": case "left":a[atr] = 0-_.eow-(_.type==="column" ? 0 : _.calcx);break;
						case "r": case "right":a[atr] = parw - (_.type==="column" ? 0 : _.calcx);break;
						case "m": case "c": case "middle": case "center":
							if (atr==="x") a[atr] =  checkReverse((parw/2 - (_.type==="column" ? 0 : _.calcx) - _.eow/2),obj.frame.reverse,obj.target,atr,obj.id);
							if (atr==="y") a[atr] =  checkReverse((parh/2 - (_.type==="column" ? 0 : _.calcy) - _.eoh/2),obj.frame.reverse,obj.target,atr,obj.id);
						break;
					}
				}
			}
		}
	}

	a.transformOrigin = torig.originX+" "+torig.originY+" "+torig.originZ;

	// CLIPPING EFFECTS
	if (!_R[obj.id].BUG_ie_clipPath && a.clip!==undefined && _.clipPath!==undefined && _.clipPath.use) {
		var cty = _.clipPath.type=="rectangle",
			cl = parseInt(a.clip,0),
			clb = 100-parseInt(a.clipB,0),
			ch = Math.round(cl/2);

		switch (_.clipPath.origin) {
			case "invh": a.clipPath = "polygon(0% 0%, 0% 100%, "+cl+"% 100%, "+cl+"% 0%, 100% 0%, 100% 100%, "+clb+"% 100%, "+clb+"% 0%, 0% 0%)";break;
			case "invv": a.clipPath = "polygon(100% 0%, 0% 0%, 0% "+cl+"%, 100% "+cl+"%, 100% 100%, 0% 100%, 0% "+clb+"%, 100% "+clb+"%, 100% 0%)";break;
			case "cv":a.clipPath = cty ? "polygon("+(50-ch)+"% 0%, "+(50+ch)+"% 0%, "+(50+ch)+"% 100%, "+(50-ch)+"% 100%)" : "circle("+cl+"% at 50% 50%)";break;
			case "ch":a.clipPath = cty ? "polygon(0% "+(50-ch)+"%, 0% "+(50+ch)+"%, 100% "+(50+ch)+"%, 100% "+(50-ch)+"%)" : "circle("+cl+"% at 50% 50%)";break;
			case "l":a.clipPath = cty ? "polygon(0% 0%, "+cl+"% 0%, "+cl+"% 100%, 0% 100%)" : "circle("+cl+"% at 0% 50%)";break;
			case "r":a.clipPath = cty ? "polygon("+(100-cl)+"% 0%, 100% 0%, 100% 100%, "+(100-cl)+"% 100%)" : "circle("+cl+"% at 100% 50%)";break;
			case "t":a.clipPath = cty ? "polygon(0% 0%, 100% 0%, 100% "+cl+"%, 0% "+cl+"%)" : "circle("+cl+"% at 50% 0%)";break;
			case "b":a.clipPath = cty ? "polygon(0% 100%, 100% 100%, 100% "+(100-cl)+"%, 0% "+(100-cl)+"%)" : "circle("+cl+"% at 50% 100%)";break;
			case "lt":a.clipPath = cty ? "polygon(0% 0%,"+(2*cl)+"% 0%, 0% "+(2*cl)+"%)" : "circle("+cl+"% at 0% 0%)";break;
			case "lb":a.clipPath = cty ? "polygon(0% "+(100 - 2*cl)+"%, 0% 100%,"+(2*cl)+"% 100%)" : "circle("+cl+"% at 0% 100%)";break;
			case "rt":a.clipPath = cty ? "polygon("+(100-2*cl)+"% 0%, 100% 0%, 100% "+(2*cl)+"%)" : "circle("+cl+"% at 100% 0%)";break;
			case "rb":a.clipPath = cty ? "polygon("+(100-2*cl)+"% 100%, 100% 100%, 100% "+(100 - 2*cl)+"%)" : "circle("+cl+"% at 100% 100%)";break;
			case "clr":a.clipPath = cty ? "polygon(0% 0%, 0% "+cl+"%, "+(100-cl)+"% 100%, 100% 100%, 100% "+(100-cl)+"%, "+cl+"% 0%)" : "circle("+cl+"% at 50% 50%)";break;
			case "crl":a.clipPath = cty ? "polygon(0% "+(100-cl)+"%, 0% 100%, "+cl+"% 100%, 100% "+cl+"%, 100% 0%, "+(100-cl)+"% 0%)" : "circle("+cl+"% at 50% 50%)";break;
		}
		a["-webkit-clip-path"] = a.clipPath;
		delete a.clip;
	} else {
		delete a.clip;
	}


	if (obj.target!=="mask") {
		// FILTER EFFECTS

		if (obj.frame!==undefined && (obj.frame.filter!==undefined || obj.forcefilter)) {
			a['-webkit-filter']  = 'blur('+(obj.frame.filter==undefined ? 0 : obj.frame.filter.blur || 0)+'px) grayscale('+(obj.frame.filter==undefined ? 0 : obj.frame.filter.grayscale || 0)+'%) brightness('+(obj.frame.filter==undefined ? 100 : obj.frame.filter.brightness || 100)+'%)';
			a.filter 		 = 'blur('+(obj.frame.filter==undefined ? 0 : obj.frame.filter.blur || 0)+'px) grayscale('+(obj.frame.filter==undefined ? 0 : obj.frame.filter.grayscale || 0)+'%) brightness('+(obj.frame.filter==undefined ? 100 : obj.frame.filter.brightness || 100)+'%)';
		}
		if (jQuery.inArray(obj.source,["chars","words","lines"])>=0 && (obj.frame[obj.source].blur!==undefined ||obj.forcefilter)) {
			a['-webkit-filter']  = 'blur('+(parseInt(obj.frame[obj.source].blur,0) || 0)+'px) grayscale('+(parseInt(obj.frame[obj.source].grayscale,0) || 0)+'%) brightness('+(parseInt(obj.frame[obj.source].brightness,0) || 100)+'%)';
			a.filter = 'blur('+(parseInt(obj.frame[obj.source].blur,0) || 0)+'px) grayscale('+(parseInt(obj.frame[obj.source].grayscale,0) || 0)+'%) brightness('+(parseInt(obj.frame[obj.source].brightness,0) || 100)+'%)';
		}
	}

	// EASE
	a.ease = a.ease!==undefined ? a.ease : (a.ease===undefined && obj.ease!==undefined) || (a.ease!==undefined && obj.ease !==undefined && a.ease==="inherit") ? obj.ease : obj.frame.timeline.ease;
	a.ease = a.ease===undefined || a.ease==="default" ? punchgs.Power3.easeInOut : a.ease;

	return a;
};


var getCycles = function(anim) {
 	var _;
	for (var a in anim) {
		if (typeof anim[a] === "string" && anim[a].indexOf("|")>=0) {
			_ = _ ===undefined ? {} : _;
			_[a] = ((anim[a].replace("[","")).replace("]","")).split("|");
			delete anim[a];
		}
	}
	if (_!==undefined ) anim.cycle = _;
	return anim;
};

var shuffleArray = function(array) {
  var currentIndex = array.length, temporaryValue, randomIndex;

  // While there remain elements to shuffle...
  while (0 !== currentIndex) {

    // Pick a remaining element...
    randomIndex = Math.floor(Math.random() * currentIndex);
    currentIndex -= 1;

    // And swap it with the current element.
    temporaryValue = array[currentIndex];
    array[currentIndex] = array[randomIndex];
    array[randomIndex] = temporaryValue;
  }
  return array;
};


// GET SPLIT DIRECTION
var getSplitTextDirs = function(oar,d) {
		var alen = oar.length-1,
			splitDir = [],
      si,pp,mm;
		switch (d) {
			case "forward":
			case "f":
			case "random":
			case "r":
				for (si=0;si<=alen;si++) { splitDir.push(si);}
				if (d==="random" || d==="r") splitDir = shuffleArray(splitDir);
			break;
			case "b":
			case "backward":
				for (si=0;si<=alen;si++)	{ splitDir.push(alen-si); }
			break;
			case "m":
			case "middletoedge":
				var cc = Math.ceil(alen/2);
					mm = cc-1;
				pp = cc+1;
				splitDir.push(cc);
				for (si=0;si<cc;si++) {
					if (mm>=0) splitDir.push(mm);
					if (pp<=alen) splitDir.push(pp);
					mm--;
					pp++;
				}
			break;
			case "e":
			case "edgetomiddle":
				mm = alen;
				pp = 0;
				for (si=0;si<=Math.floor(alen/2);si++) {
					splitDir.push(mm);
					if (pp<mm) splitDir.push(pp);
					mm--;
					pp++;
				}
			break;
			default:
				for (si=0;si<=alen;si++) { splitDir.push(si);}
			break;
		}

		var retar = [];
		for (var i in splitDir) if (splitDir.hasOwnProperty(i)) retar.push(oar[splitDir[i]]);

		return retar;
	};

// GET ANIMATION PARAMETERS 1 TIME
var gFrPar = function(_,id,wtl,transform,caller) {

	var color,
		bgcolor,
		n = {},
		f = {},
		t = {};
	transform = transform===undefined ? "transform" : transform;

	if (caller==="loop") {
		t.autoRotate = false;
		t.yoyo_filter = false;
		t.yoyo_rotate = false;
		t.yoyo_move = false;
		t.yoyo_scale = false;
		t.curved = false;
		t.curviness = 2;
		t.ease = "Linear.easeNone";
		t.speed = 1000;
		t.st = 0;
		n.x = 0;
		n.y = 0;
		n.z = 0;
		n.xr = 0;
		n.yr = 0;
		n.zr = 0;
		n.scaleX = 1;
		n.scaleY = 1;
		n.originX = "50%";
		n.originY = "50%";
		n.originZ = "0";
		n.rotationX = "0deg";
		n.rotationY = "0deg";
		n.rotationZ = "0deg";
	} else {
		t.speed = 300;
		if (wtl)
			t.ease = "default";
		else
			n.ease = "default";
	}
	if (caller==="sfx") n.fxc="#ffffff";
	_ = _.split(";");
	for (var i in _) {
		if (!_.hasOwnProperty(i)) continue;
		var v = _[i].split(":");

		switch (v[0]) {
			case "u": n.use = v[1]==="true" || v[1]==="t" ? true : fasle;break;
			// BASIC VALUES
			case "c": color = v[1];break;
			case "fxc": n.fxc = v[1];break;
			case "bgc": bgcolor = v[1];break;
			case "auto": n.auto = v[1]==="t" || v[1]===undefined || v[1]==="true" ? true : false;break;

			// FRAME VALUES
			case "o": n.opacity = v[1];break;
			case "oX": n.originX = v[1];break;
			case "oY": n.originY = v[1];break;
			case "oZ": n.originZ = v[1];break;
			case "sX": n.scaleX = v[1];break;
			case "sY": n.scaleY = v[1];break;
			case "skX": n.skewX = v[1];break;
			case "skY": n.skewY = v[1];break;
			case "rX": n.rotationX = v[1];break;
			case "rY": n.rotationY = v[1];break;
			case "rZ": n.rotationZ = v[1];break;
			case "sc": n.color = v[1];break;
			case "se": n.effect = v[1];break;
			case "bos": n.borderStyle = v[1];break;
			case "boc": n.borderColor = v[1];break;
			case "td": n.textDecoration = v[1];break;
			case "zI": n.zIndex = v[1]; break;
			case "tp": n.transformPerspective = v[1]; break;
			case "cp": n.clip = parseInt(v[1],0);break;
			case "cpb": n.clipB = parseInt(v[1],0);break;
			case "fpr": n.fpr = v[1]==="t" || v[1]==="true" || v[1]===true ? true : false; break;


			// TIMELINE LOOP VALUES
			case "aR": t.autoRotate = (v[1]=="t" ? true : false);break;
			case "rA": t.radiusAngle = v[1];break;
			case "yyf": t.yoyo_filter = (v[1]=="t" ? true : false); break;
			case "yym": t.yoyo_move = (v[1]=="t" ? true : false);break;
			case "yyr": t.yoyo_rotate = (v[1]=="t" ? true : false);break;
			case "yys": t.yoyo_scale = (v[1]=="t" ? true : false);break;
			case "crd": t.curved = (v[1]=="t" ? true : false);break;

			//RESPONSIVE VALUES
			case "x": n.x = caller==="reverse" ? v[1]==="t" || v[1]===true || v[1]=='true' ? true : false : caller==="loop" ? parseInt(v[1],0) : _R.revToResp(v[1],_R[id].rle);break;
			case "y": n.y = caller==="reverse" ? v[1]==="t" || v[1]===true || v[1]=='true' ? true : false : caller==="loop" ? parseInt(v[1],0) : _R.revToResp(v[1],_R[id].rle);break;
			case "z": n.z = caller==="loop" ? parseInt(v[1],0) : _R.revToResp(v[1],_R[id].rle);break;
			case "bow": n.borderWidth = _R.revToResp(v[1],4,0).toString().replace(/,/g," ");break;
			case "bor": n.borderRadius = _R.revToResp(v[1],4,0).toString().replace(/,/g," ");break;

			//USE HOVER MASK
			case "m": n.mask = v[1]==="t" ? true : v[1]==="f" ? false : v[1];break;

			//CONVERTED VALUES
			case "xR": n.xr = parseInt(v[1],0);break;
			case "yR": n.yr = parseInt(v[1],0);break;
			case "zR": n.zr = parseInt(v[1],0);break;
			case "blu": if (caller==="loop") n.blur = parseInt(v[1],0); else f.blur = parseInt(v[1],0);break;
			case "gra": if (caller==="loop") n.grayscale = parseInt(v[1],0); else f.grayscale = parseInt(v[1],0);break;
			case "bri": if (caller==="loop") n.brightness = parseInt(v[1],0); else f.brightness = parseInt(v[1],0);break;
			case "sp": t.speed = parseInt(v[1],0);break;
			case "d": n.delay = parseInt(v[1],0);break;
			case "crns": t.curviness = parseInt(v[1],0);break;

			//SPECIAL HANDLINGS
			case "st": t.start = (v[1]==="w" || v[1]==="a" ? "+=0" : v[1]); t.waitoncall= (v[1]==="w" || v[1]==="a");break;
			case "sA": t.startAbsolute = v[1];break;
			case "sR": t.startRelative = v[1];break;

			case "e": if (wtl) t.ease = v[1]; else n.ease = v[1]; break;

			//DEFAULT
			default:
				if (v[0].length>0) n[v[0]] = v[1]==="t" ? true : v[1]==="f" ? false : v[1];
			break;
		}
	}

	var r = {timeline:t};
	if (!jQuery.isEmptyObject(f)) if (caller==="split") n = jQuery.extend(true,n,f); else r.filter = f;
	if (caller==="split" && n.dir===undefined) n.dir="forward";
	if (!jQuery.isEmptyObject(color)) r.color = color;
	if (!jQuery.isEmptyObject(bgcolor)) r.bgcolor = bgcolor;
	r[transform] = n;
	return r;
};

/*
BUILD THE FRAME OBJECT STRUCTURE
*/
var buildFrameObj=function(_,id) {
	var n = {},
		i = 0;
	if (window.rdF0===undefined) {
		var b = gFrPar("x:0;y:0;z:0;rX:0;rY:0;rZ:0;o:0;skX:0;skY:0;sX:0;sY:0;oX:50%;oY:50%;oZ:0;dir:forward;d:5", id).transform;
		window.rdF0 = window.rdF1  = {transform: gFrPar("x:0;y:0;z:0;rX:0;rY:0;rZ:0;o:0;skX:0;skY:0;sX:0;sY:0;oX:50%;oY:50%;oZ:0;tp:600px", id,true).transform,
						mask: gFrPar("x:0;y:0", id,true).transform,
						chars: jQuery.extend(true,{blur:0, grayscale:0, brightness:100},b),
						words: jQuery.extend(true,{blur:0, grayscale:0, brightness:100},b),
						lines: jQuery.extend(true,{blur:0, grayscale:0, brightness:100},b)
					 };
		window.rdF1.transform.opacity = window.rdF1.chars.opacity = window.rdF1.words.opacity = window.rdF1.lines.opacity = window.rdF1.transform.scaleX = window.rdF1.chars.scaleX = window.rdF1.words.scaleX = window.rdF1.lines.scaleX = window.rdF1.transform.scaleY = window.rdF1.chars.scaleY = window.rdF1.words.scaleY = window.rdF1.lines.scaleY = 1;
	}


	if (_.frame_0===undefined) _.frame_0 = "x:0";
	if (_.frame_1===undefined) _.frame_1 = "x:0";

	// GET ANIMATION FRAME DATAS
	for (var i in _.ford) {
		if (!_.ford.hasOwnProperty(i)) continue;
		var q = _.ford[i];

		if (_[q]) {
			n[q] = gFrPar(_[q],id,true);
			if (n[q].bgcolor!==undefined) _.bgcolinuse = true;
			//IE FIX FOR CLIP PATH
			if (_R[id].BUG_ie_clipPath && _.clipPath!==undefined && _.clipPath.use && n[q].transform.clip!==undefined) {
				var cl = _.clipPath.type==="rectangle" ? 100 - parseInt(n[q].transform.clip) : 	100 - Math.min(100,(2*parseInt(n[q].transform.clip)));
				switch (_.clipPath.origin) {
					case "clr": case "rb": case "rt": case "r":_[q+"_mask"] = "u:t;x:"+cl+"%;y:0px;";n[q].transform.x = _R.revToResp("-"+cl+"%",_R[id].rle);break;
					case "crl": case "lb": case "lt": case "cv": case "l":_[q+"_mask"] = "u:t;x:-"+cl+"%;y:0px;";n[q].transform.x = _R.revToResp(""+cl+"%",_R[id].rle);break;
					case "ch": case "t":_[q+"_mask"] = "u:t;y:-"+cl+"%;y:0px;";n[q].transform.y = _R.revToResp(""+cl+"%",_R[id].rle);break;
					case "b":_[q+"_mask"] = "u:t;y:"+cl+"%;y:0px;";n[q].transform.y = _R.revToResp("-"+cl+"%",_R[id].rle);break;
				}
				delete n[q].transform.clip;
				delete n[q].transform.clipB;
				_.maskinuse = true;
			}

			if (_[q+"_mask"]) n[q].mask = gFrPar(_[q+"_mask"],id).transform;
			if (n[q].mask!=undefined &&  n[q].mask.use) {
				n[q].mask.x= n[q].mask.x===undefined ? 0 : n[q].mask.x;
				n[q].mask.y= n[q].mask.y===undefined ? 0 : n[q].mask.y;
				delete n[q].mask.use;
				n[q].mask.overflow="hidden";
			} else {
				n[q].mask = {ease:"default", overflow:"visible"};
			}

			if (_[q+"_chars"]) n[q].chars = gFrPar(_[q+"_chars"],id,undefined,undefined,"split").transform;
			if (_[q+"_words"]) n[q].words = gFrPar(_[q+"_words"],id,undefined,undefined,"split").transform;
			if (_[q+"_lines"]) n[q].lines = gFrPar(_[q+"_lines"],id,undefined,undefined,"split").transform;

			if (_[q+"_chars"] || _[q+"_words"] || _[q+"_lines"]) n[q].split=true;
			n.frame_0 = n.frame_0===undefined ? {transform:{}} : n.frame_0;
			if (n[q].transform.auto) {
				n[q].transform = jQuery.extend(true,{},n.frame_0.transform);
				n[q].transform.opacity = n[q].transform.opacity===undefined ? 0 : n[q].transform.opacity;
				if (n.frame_0.filter!==undefined) n[q].filter = jQuery.extend(true,{},n.frame_0.filter);
				if (n.frame_0.mask!==undefined) n[q].mask = jQuery.extend(true,{},n.frame_0.mask);
				if (n.frame_0.chars!==undefined) n[q].chars = jQuery.extend(true,{},n.frame_0.chars);
				if (n.frame_0.words!==undefined) n[q].words = jQuery.extend(true,{},n.frame_0.words);
				if (n.frame_0.lines!==undefined) n[q].lines = jQuery.extend(true,{},n.frame_0.lines);
			}
			if (_[q+"_sfx"]) n[q].sfx = gFrPar(_[q+"_sfx"],id,false,undefined,"sfx").transform;
			if (_[q+"_reverse"]) n[q].reverse = gFrPar(_[q+"_reverse"],id,false,undefined,"reverse").transform;
		}
	}
	if (n.frame_0.split) n.frame_1.split = true;
	if (n.frame_0.transform.fpr!==undefined) {
		_.forceRender = n.frame_0.transform.fpr;
		delete n.frame_0.transform.fpr;
	}

	// GET HOVER DATAS
	if (_.frame_hover!==undefined || _.svgh!==undefined) {
		n.frame_hover = gFrPar((_.frame_hover===undefined ? "" : _.frame_hover),id);
		n.frame_hover.transform.color = n.frame_hover.color;
		if (n.frame_hover.transform.color===undefined) delete n.frame_hover.transform.color;

		if (n.frame_hover.bgcolor!==undefined && n.frame_hover.bgcolor.indexOf("gradient")>=0) n.frame_hover.transform.backgroundImage = n.frame_hover.bgcolor;
		else
		if (n.frame_hover.bgcolor!==undefined) n.frame_hover.transform.backgroundColor = n.frame_hover.bgcolor;

		if (n.frame_hover.bgcolor!==undefined) _.bgcolinuse = true;

		n.frame_hover.transform.opacity = n.frame_hover.transform.opacity===undefined ? 1 : n.frame_hover.transform.opacity;
		n.frame_hover.mask = n.frame_hover.transform.mask === undefined ? false : n.frame_hover.transform.mask;
		delete n.frame_hover.transform.mask;
		//CHECK FOR DEFAULT BORDER STYLING:
		if (n.frame_hover.transform !== undefined) {
			if (n.frame_hover.transform.borderWidth || n.frame_hover.transform.borderStyle) n.frame_hover.transform.borderColor = n.frame_hover.transform.borderColor===undefined ? "transparent" : n.frame_hover.transform.borderColor;
			if (n.frame_hover.transform.borderStyle!=="none" && n.frame_hover.transform.borderWidth===undefined) n.frame_hover.transform.borderWidth = _R.revToResp(0,4,0).toString().replace(/,/g," ");
			if (_.bordercolor===undefined && n.frame_hover.transform.borderColor!==undefined) _.bordercolor = "transparent";
			if (_.borderwidth===undefined && n.frame_hover.transform.borderWidth!==undefined) _.borderwidth = _R.revToResp(n.frame_hover.transform.borderWidth,4,0);
			if (_.borderstyle===undefined && n.frame_hover.transform.borderStyle!==undefined) _.borderstyle = _R.revToResp(n.frame_hover.transform.borderStyle,4,0);
		}
	}



	// Single Loop of Layer
	if (_.tloop!==undefined) {
		_.layerLoop = { from:"frame_1", to:"frame_999", repeat:-1, keep:true, children:true};
		var tlo = _.tloop.split(";");
		for (var i in tlo) {
			if (!tlo.hasOwnProperty(i)) continue;
			var v = tlo[i].split(":");
			switch(v[0]) {
				case "f": _.layerLoop.from = v[1];break;
				case "t": _.layerLoop.to = v[1];break;
				case "k": _.layerLoop.keep = v[1];break;
				case "r": _.layerLoop.repeat = parseInt(v[1],0);break;
				case "c": _.layerLoop.children = v[1];break;
			}
		}
		_.layerLoop.count = 0;
	}

	// GET LOOP DATAS
	if (_.loop_0 || _.loop_999) {
		n.loop = gFrPar(_.loop_999,id,true,"frame_999","loop");
		n.loop.frame_0 = gFrPar(_.loop_0 || "",id,false,undefined,"loop").transform;

	}

	//OPACITY VALUES FOR START
	n.frame_0.transform.opacity = n.frame_0.transform.opacity===undefined ? 0 : n.frame_0.transform.opacity;
	n.frame_1.transform.opacity = n.frame_1.transform.opacity===undefined ? 1 : n.frame_1.transform.opacity;
	n.frame_999.transform.opacity = n.frame_999.transform.opacity===undefined ? "inherit" : n.frame_999.transform.opacity;

	n.frame_0.transform.transformPerspective =n.frame_0.transform.transformPerspective===undefined ? "600px" : n.frame_0.transform.transformPerspective;

	if (_.clipPath && _.clipPath.use) {
		n.frame_0.transform.clip = 	n.frame_0.transform.clip===undefined ? 100 : parseInt(n.frame_0.transform.clip);
		n.frame_1.transform.clip = 	n.frame_1.transform.clip===undefined ? 100 : parseInt(n.frame_1.transform.clip);
	}

	// Reset Filters at Start if Needed !
	_.resetfilter = false;
	for (var i in n) if (n[i].filter!==undefined) _.resetfilter = true;
	if (_.resetfilter) {
		n.frame_0.filter = jQuery.extend(true,{},n.frame_0.filter);
		n.frame_0.filter.blur = n.frame_0.filter.blur===undefined ? 0 : n.frame_0.filter.blur;
		n.frame_0.filter.brightness = n.frame_0.filter.brightness===undefined ? 100 : n.frame_0.filter.brightness;
		n.frame_0.filter.grayscale = n.frame_0.filter.grayscale===undefined ? 0 : n.frame_0.filter.grayscale;
	}


	if (n.frame_0.filter!==undefined) {
		n.frame_1.filter = jQuery.extend(true,{},n.frame_1.filter);
		if (n.frame_0.filter.blur!==undefined && n.frame_1.filter.blur!==0) n.frame_1.filter.blur = n.frame_1.filter.blur===undefined ? 0 : n.frame_1.filter.blur;
		if (n.frame_0.filter.brightness!==undefined && n.frame_1.filter.brightness!==100) n.frame_1.filter.brightness = n.frame_1.filter.brightness===undefined ? 100 : n.frame_1.filter.brightness;
		if (n.frame_0.filter.grayscale!==undefined && n.frame_1.filter.grayscale!==0) n.frame_1.filter.grayscale = n.frame_1.filter.grayscale===undefined ? 0 : n.frame_1.filter.grayscale;
	}

	//Sync the Frames
	return syncFrames(n);
};


// Sync The Frames, and use the same Attributes on each Frame
var syncFrames = function(_) {

	var e = {},
		c = ["transform","words","chars","lines","mask"],
		t;

	//Collect All Information
	for (var f in _) { if (f!=='loop' && f!=='frame_hover') e = jQuery.extend(true,e,_[f]);}
	//All Frame should have the Same Attributes set to a Definitive Value
	for (var f in _) {
		if (!_.hasOwnProperty(f)) continue;
		if (f!=='loop' && f!=='frame_hover') {
			for (t in e.transform) {
				if (!e.transform.hasOwnProperty(t)) continue;
				e.transform[t] = _[f].transform[t]===undefined ? f==="frame_0" ? window.rdF0.transform[t] : f==="frame_1" ? window.rdF1.transform[t] : e.transform[t] : _[f].transform[t];
				_[f].transform[t] = _[f].transform[t]===undefined ? e.transform[t] : _[f].transform[t];
			}
			for (var ci=1;ci<=4;ci++)
				for (t in e[c[ci]]) {
					if (!e[c[ci]].hasOwnProperty(t)) continue;
					_[f][c[ci]] = _[f][c[ci]]===undefined ? {} : _[f][c[ci]];
					e[c[ci]][t] = _[f][c[ci]][t]===undefined ? f==="frame_0" ? window.rdF0[c[ci]][t] : f==="frame_1" ? window.rdF1[c[ci]][t] : e[c[ci]][t] : _[f][c[ci]][t];
					_[f][c[ci]][t] = _[f][c[ci]][t]===undefined ? e[c[ci]][t] : _[f][c[ci]][t];
				}
		}
	}
	return _;
};

var getLayersInSlide = function(slide,cname) {
	if (slide.length===0) return {};
	var ar = slide[0].getElementsByClassName(cname),
		ret = {}; //(ar[i].dataset.type==="row" ? "0" : ar[i].dataset.type==="column" ? "1" : "2")+"_"+
	for (var i=0;i<ar.length;i++) ret[ar[i].id] = ar[i];
	return ret;
};


/*
COLLECT CSS VALUES FROM ELEMENT
 */
var getStyleAtStart = function(L,level,id) {

	if (L[0].nodeName=="BR" || L[0].tagName=="br" || (typeof L[0].className!=="object" && L[0].className.indexOf("rs_splitted_")>=0)) return false;
	_R.sA(L[0],"stylerecorder",true);

	var cstyles =  window.getComputedStyle(L[0],null),
		d = L[0].id!==undefined && _R[id]._L[L[0].id]!==undefined ? _R[id]._L[L[0].id] : L.data(),
		pc = level==="rekursive" ? L.closest('.rs-layer') : undefined,
		gp = pc!==undefined && (cstyles.fontSize === pc.css("fontSize") &&  cstyles.fontWeight === pc.css("fontWeight") &&  cstyles.lineHeight === pc.css("lineHeight")) ? true : false,
		dpc = gp ? pc[0].id!==undefined && _R[id]._L[pc[0].id]!==undefined ? _R[id]._L[pc[0].id] : pc.data() : undefined,
		lhdef = 0;


	d.basealign = d.basealign===undefined ? "grid" : d.basealign;
	if (!d._isnotext) {

		d.fontSize = _R.revToResp(gp ? dpc.fontsize===undefined ? parseInt(pc.css('fontSize'),0) || 20 : dpc.fontsize : d.fontsize===undefined ? (level!=="rekursive" ? 20 : "inherit") : d.fontsize, _R[id].rle);
		d.fontWeight = _R.revToResp(gp ? dpc.fontweight===undefined ? pc.css('fontWeight') || "inherit" : dpc.fontweight : d.fontweight===undefined ? L.css('fontWeight') || "inherit" : d.fontweight,_R[id].rle);
		d.whiteSpace = _R.revToResp(gp ? dpc.whitespace===undefined ? "nowrap" : dpc.whitespace : d.whitespace===undefined ?  "nowrap" : d.whitespace,_R[id].rle);
		d.textAlign = _R.revToResp(gp ? dpc.textalign===undefined ? "left" : dpc.textalign : d.textalign===undefined ? "left" : d.textalign,_R[id].rle);
		d.letterSpacing = _R.revToResp(gp ? dpc.letterspacing===undefined ? parseInt(pc.css('letterSpacing'),0) || "inherit" : dpc.letterspacing : d.letterspacing===undefined ? parseInt(L.css('letterSpacing'),0) || "inherit" : d.letterspacing,_R[id].rle);
		d.textDecoration = gp ? dpc.textDecoration===undefined ?  "none" : dpc.textDecoration : d.textDecoration===undefined ? "none" : d.textDecoration;
		lhdef = 25;
		lhdef = pc!==undefined && L[0].tagName==="I" ? "inherit" : lhdef;
		if (d.tshadow!==undefined) {
			d.tshadow.b = _R.revToResp(d.tshadow.b, _R[id].rle);
			d.tshadow.h = _R.revToResp(d.tshadow.h, _R[id].rle);
			d.tshadow.v = _R.revToResp(d.tshadow.v, _R[id].rle);
		}
	}

	if (d.bshadow!==undefined) {
		d.bshadow.b = _R.revToResp(d.bshadow.b, _R[id].rle);
		d.bshadow.h = _R.revToResp(d.bshadow.h, _R[id].rle);
		d.bshadow.v = _R.revToResp(d.bshadow.v, _R[id].rle);
		d.bshadow.s = _R.revToResp(d.bshadow.s, _R[id].rle);
	}



	d.display = gp ? dpc.display===undefined ? pc.css('display') : dpc.display : d.display===undefined ? L.css("display") : d.display;
	d.float = _R.revToResp(gp ? dpc.float===undefined ? pc.css('float') || "none" : dpc.float : d.float===undefined ? "none" : d.float, _R[id].rle);
	d.clear = _R.revToResp(gp ? dpc.clear===undefined ? pc.css('clear') || "none" : dpc.clear : d.clear===undefined ? "none" : d.clear, _R[id].rle);



	d.lineHeight = _R.revToResp(!L.is('img') && jQuery.inArray(d.layertype,["video","image","audio"])==-1 ?
			gp ?
				dpc.lineheight===undefined ? parseInt(pc.css('lineHeight'),0) || lhdef : dpc.lineheight
				: d.lineheight===undefined ? lhdef
					/*parseInt(cstyles.lineHeight,0) == 0 ? lhdef :  parseInt(cstyles.lineHeight,0) */
					: d.lineheight
			: lhdef , _R[id].rle);
	d.zIndex = gp ? dpc.zindex===undefined ? parseInt(pc.css('zIndex'),0) || "inherit" : dpc.zindex : d.zindex===undefined ? parseInt(L.css('zIndex'),0) || "inherit" : d.zindex;



	d.paddingTop = _R.revToResp(d.paddingtop===undefined ? parseInt(cstyles.paddingTop,0) || 0 : d.paddingtop,_R[id].rle);
	d.paddingBottom = _R.revToResp(d.paddingbottom===undefined ? parseInt(cstyles.paddingBottom,0) || 0 : d.paddingbottom,_R[id].rle);
	d.paddingLeft = _R.revToResp(d.paddingleft===undefined ? parseInt(cstyles.paddingLeft,0) || 0 : d.paddingleft,_R[id].rle);
	d.paddingRight = _R.revToResp(d.paddingright===undefined ? parseInt(cstyles.paddingRight,0) || 0 : d.paddingright,_R[id].rle);

	d.marginTop = _R.revToResp(d.margintop===undefined ? parseInt(cstyles.marginTop,0) || 0 : d.margintop,_R[id].rle);
	d.marginBottom = _R.revToResp(d.marginbottom===undefined ? parseInt(cstyles.marginBottom,0) || 0 : d.marginbottom,_R[id].rle);
	d.marginLeft = _R.revToResp(d.marginleft===undefined ? parseInt(cstyles.marginLeft,0) || 0 : d.marginleft,_R[id].rle);
	d.marginRight = _R.revToResp(d.marginright===undefined ? parseInt(cstyles.marginRight,0) || 0 : d.marginright,_R[id].rle);

	d.borderTopWidth = d.borderwidth===undefined ? parseInt(cstyles.borderTopWidth,0) || 0 : d.borderwidth[0];
	d.borderBottomWidth = d.borderwidth===undefined ? parseInt(cstyles.borderBottomWidth,0) || 0 : d.borderwidth[2];
	d.borderLeftWidth = d.borderwidth===undefined ? parseInt(cstyles.borderLeftWidth,0) || 0 : d.borderwidth[3];
	d.borderRightWidth = d.borderwidth===undefined ? parseInt(cstyles.borderRightWidth,0) || 0 : d.borderwidth[1];

	d.borderTopLeftRadius = _R.revToResp(d.borderradius===undefined ? cstyles.borderTopLeftRadius || 0 : d.borderradius[0],_R[id].rle);
	d.borderTopRightRadius = _R.revToResp(d.borderradius===undefined ?cstyles.borderTopRightRadius || 0 : d.borderradius[1],_R[id].rle);
	d.borderBottomLeftRadius = _R.revToResp(d.borderradius===undefined ? cstyles.borderBottomLeftRadius || 0 : d.borderradius[3],_R[id].rle);
	d.borderBottomRightRadius = _R.revToResp(d.borderradius===undefined ? cstyles.borderBottomRightRadius || 0 : d.borderradius[2],_R[id].rle);


	d.borderStyle = _R.revToResp(d.borderstyle===undefined ? cstyles.borderStyle || 0 : d.borderstyle,_R[id].rle);
	//d.borderColor = d.bordercolor===undefined ? cstyles.borderColor!=0 ? cstyles.borderColor : cstyles["border-bottom-color"]!==0 ? cstyles["border-bottom-color"] : cstyles["border-top-color"]!==0 ? cstyles["border-top-color"] : cstyles["border-left-color"]!==0 ? cstyles["border-left-color"] : cstyles["border-right-color"]!==0 ? cstyles["border-right-color"] : 0  || 0 : d.bordercolor;

	//if (_R.isFirefox(id)===true) {
		d.borderBottomColor = d.bordercolor===undefined ? cstyles["border-bottom-color"] : d.bordercolor;
		d.borderTopColor = d.bordercolor===undefined ? cstyles["border-top-color"] : d.bordercolor;
		d.borderLeftColor = d.bordercolor===undefined ? cstyles["border-left-color"] : d.bordercolor;
		d.borderRightColor = d.bordercolor===undefined ? cstyles["border-right-color"] : d.bordercolor;
	//}


	if (level!=="rekursive") {
		d.color = _R.revToResp(d.color===undefined ? "#ffffff" : d.color,_R[id].rle,undefined,"||");
		d.minWidth = _R.revToResp(d.minwidth===undefined ? parseInt(cstyles.minWidth,0) || 0 : d.minwidth,_R[id].rle);
		d.minHeight = _R.revToResp(d.minheight===undefined ? parseInt(cstyles.minHeight,0) || 0 : d.minheight,_R[id].rle);
		d.width = _R.revToResp(d.width===undefined ? "auto" : _R.smartConvertDivs(d.width),_R[id].rle);
		d.height = _R.revToResp(d.height===undefined ? "auto" : _R.smartConvertDivs(d.height),_R[id].rle);
		d.maxWidth = _R.revToResp(d.maxwidth===undefined ? parseInt(cstyles.maxWidth,0) || "none" :  d.maxwidth,_R[id].rle);
		d.maxHeight = _R.revToResp(jQuery.inArray(d.type,["column","row"])!==-1 ? "none" :  d.maxheight!==undefined ? parseInt(cstyles.maxHeight,0) || "none" : d.maxheight,_R[id].rle);
		//d.wtran = d.wan===undefined ? cstyles['-webkit-transition'] || "none" : d.wtran;
		//d.tran = d.ani===undefined ? cstyles['transition'] || "none" : d.tran;
	} else
	if (d.layertype==="html") {
		d.width = _R.revToResp(L[0].width,_R[id].rle);
		d.height = _R.revToResp(L[0].height,_R[id].rle);
	}



	d.styleProps = {	"background" : L[0].style.background,
						"background-color" : L[0].style["background-color"],
						"color" : L[0].style.color,
						"cursor" : L[0].style.cursor,
						"font-style" : L[0].style["font-style"]
					};
	if (d.bshadow==undefined) d.styleProps.boxShadow = L[0].style.boxShadow;
	if (d.styleProps.background==="" || d.styleProps.background===undefined || d.styleProps.background === d.styleProps["background-color"]) delete d.styleProps.background;

	if (d.styleProps.color=="") d.styleProps.color = cstyles.color;

};

var getLayerResponsiveValues = function(L,id) {

	if (L===undefined) return;
	if (L[0].nodeName=="BR" || L[0].tagName=="br") return false;
	var l = _R[id].level,
		_ = L[0] !== undefined && L[0].id!==undefined &&  _R[id]._L[L[0].id]!==undefined ?  _R[id]._L[L[0].id] : L.data();
		_ = _.basealign===undefined ? L.closest('rs-layer').data() : _;

	var ret = {
			basealign :  _.basealign===undefined ? "grid" : _.basealign,
			lineHeight : _.basealign===undefined ? "inherit" :  parseInt(_.lineHeight[l]),
			color : _.color===undefined ? undefined : _.color[l],
			width : _.width===undefined ? undefined : _.width[l]==="a" ? "auto" : _.width[l],
			height : _.height===undefined ? undefined : _.height[l]==="a" ? "auto" :_.height[l],
			minWidth : _.minWidth===undefined ? undefined : _.minWidth[l]==="n" ? "none" : _.minWidth[l],
			minHeight : _.minHeight===undefined ? undefined : _.minHeight[l]=="n" ? "none" : _.minHeight[l],
			maxWidth : _.maxWidth===undefined ? undefined : _.maxWidth[l]=="n" ? "none" : _.maxWidth[l],
			maxHeight : _.maxHeight===undefined ? undefined : _.maxHeight[l]=="n" ? "none" : _.maxHeight[l],
			paddingTop : _.paddingTop[l],
			paddingBottom : parseInt(_.paddingBottom[l]),
			paddingLeft : parseInt(_.paddingLeft[l]),
			paddingRight : parseInt(_.paddingRight[l]),
			marginTop : parseInt(_.marginTop[l]),
			marginBottom : parseInt(_.marginBottom[l]),
			marginLeft : parseInt(_.marginLeft[l]),
			marginRight : parseInt(_.marginRight[l]),
			borderTopWidth : parseInt(_.borderTopWidth),
			borderBottomWidth : parseInt(_.borderBottomWidth),
			borderLeftWidth : parseInt(_.borderLeftWidth),
			borderRightWidth : parseInt(_.borderRightWidth),
			borderTopLeftRadius : _.borderTopLeftRadius[l],
			borderTopRightRadius : _.borderTopRightRadius[l],
			borderBottomLeftRadius : _.borderBottomLeftRadius[l],
			borderBottomRightRadius : _.borderBottomRightRadius[l],
			borderStyle : _.borderStyle[l],
			float : _.float[l],
			clear : _.clear[l]
		};
	/*if (_R.isFirefox(id)!==true)
		ret.borderColor = _.borderColor;
	else {*/
		ret.borderTopColor=_.borderTopColor;
		ret.borderBottomColor=_.borderBottomColor;
		ret.borderLeftColor=_.borderLeftColor;
		ret.borderRightColor=_.borderRightColor;
	//}

	if (!_._isnotext) {
		ret.textDecoration = _.textDecoration;
		ret.fontSize = parseInt(_.fontSize[l]);
		ret.fontWeight = parseInt(_.fontWeight[l]);
		ret.letterSpacing = parseInt(_.letterSpacing[l]) || 0;
		ret.textAlign = _.textAlign[l];
		ret.whiteSpace = _.whiteSpace[l];
		ret.whiteSpace = ret.whiteSpace==="normal" && ret.width==="auto" && _._incolumn!==true ? "nowrap" : ret.whiteSpace;
		ret.display = _.display;
		if (_.tshadow!==undefined) ret.textShadow = ""+parseInt(_.tshadow.h[l],0)+"px "+parseInt(_.tshadow.v[l],0)+"px "+_.tshadow.b[l]+" "+_.tshadow.c;
	}

	if (_.bshadow!==undefined) ret.boxShadow = ""+parseInt(_.bshadow.h[l],0)+"px "+parseInt(_.bshadow.v[l],0)+"px "+parseInt(_.bshadow.b[l],0)+"px "+parseInt(_.bshadow.s[l],0)+"px "+_.bshadow.c;



	return ret;
};


var minmaxconvert = function(a,m,r,fr,b) {
	var sfx = !jQuery.isNumeric(a) && a!==undefined ? a.indexOf("px")>=0 ? "px" : a.indexOf("%")>=0 ? "%" : "" : "";
	a = jQuery.isNumeric(parseInt(a)) ? parseInt(a) : a;
	a = jQuery.isNumeric(a) ? (a * m)+sfx : a;
	a = a==="full" ? fr : a==="auto" || a==="none" ? r : a;
	a = a==undefined ? b : a;
	return a;
};

/////////////////////////////////////////////////////////////////
//	-	CALCULATE THE RESPONSIVE SIZES OF THE CAPTIONS	-	  //
/////////////////////////////////////////////////////////////////
var calcResponsiveLayer = function(L,id,level,responsive) {

	var _= _R[id]._L[L[0].id];

	_ = _===undefined ? {} : _;

	// svg elements and their children can return an Object as their "className" which then fails when calling "L[0].className.indexOf"
	var clasName = L[0].className;
	if(typeof clasName === 'object') clasName = '';

	if (L!==undefined && L[0] !== undefined && (clasName.indexOf("rs_splitted")>=0 || L[0].nodeName=="BR" || L[0].tagName=="br" || L[0].tagName.indexOf("FCR")>0 || L[0].tagName.indexOf("BCR")>0 )) return false;

	var obj = getLayerResponsiveValues(L,id),
		bw=responsive==="off" ? 1 :  _R[id].bw,
		bh=responsive==="off" ? 1 : _R[id].bh,
		frams,prop,	winw,winh,
		margin = _.type!=="column" ? {  t: obj.marginTop, b: obj.marginBottom, l: obj.marginLeft,r: obj.marginRight } : {t:0, b:0, l:0, r:0};
	if (_.type==="column")  punchgs.TweenMax.set(_._column,{ paddingTop: Math.round((obj.marginTop * bh)) + "px", paddingBottom: Math.round((obj.marginBottom * bh)) + "px", paddingLeft: Math.round((obj.marginLeft* bw)) + "px", paddingRight: Math.round((obj.marginRight * bw)) + "px"});


	if (clasName.indexOf("rs_splitted_")===-1) {
		//L.css("-webkit-transition", "none");
	    //L.css("transition", "none");
		var S = {
			 paddingTop: Math.round((obj.paddingTop * bh)) + "px",
			 paddingBottom: Math.round((obj.paddingBottom * bh)) + "px",
			 paddingLeft: Math.round((obj.paddingLeft* bw)) + "px",
			 paddingRight: Math.round((obj.paddingRight * bw)) + "px",
			 borderTopLeftRadius :obj.borderTopLeftRadius,
			 borderTopRightRadius :obj.borderTopRightRadius,
			 borderBottomLeftRadius :obj.borderBottomLeftRadius,
			 borderBottomRightRadius :obj.borderBottomRightRadius,
			 overwrite:"auto"
		};

		if (!_._incolumn) {
			 S.marginTop = _.type==="row" ?  0 : (margin.t * bh) + "px";
			 S.marginBottom = _.type==="row" ?  0 : (margin.b * bh) + "px";
			 S.marginLeft = _.type==="row" ?  0 : (margin.l * bw) + "px";
			 S.marginRight = _.type==="row" ?  0 : (margin.r * bw) + "px";
		}
		if (_.spike!==undefined) S["clip-path"] = S["-webkit-clip-path"] = _.spike;
		if (obj.boxShadow) S.boxShadow = obj.boxShadow;

		if (_.type!=="column") {
			if (obj.borderStyle!==undefined && obj.borderStyle!=="none" && (obj.borderTopWidth!==0 || obj.borderBottomWidth>0 || obj.borderLeftWidth>0 ||  obj.borderRightWidth>0)) {
				 S.borderTopWidth = Math.round(obj.borderTopWidth * bh) + "px";
				 S.borderBottomWidth = Math.round(obj.borderBottomWidth * bh) + "px";
				 S.borderLeftWidth = Math.round(obj.borderLeftWidth * bw) + "px";
				 S.borderRightWidth = Math.round(obj.borderRightWidth * bw) + "px";
				 S.borderStyle = obj.borderStyle;
				 /*if (_R.isFirefox(id)!==true)
				 	S.borderColor = obj.borderColor;
				 else {*/
					 S.borderTopColor = obj.borderTopColor;
					 S.borderBottomColor = obj.borderBottomColor;
					 S.borderLeftColor = obj.borderLeftColor;
					 S.borderRightColor = obj.borderRightColor;
				//}
			} else {
				if (obj.borderStyle==="none") S.borderStyle = "none";
				/*if (_R.isFirefox(id)!==true)
				 	S.borderColor = obj.borderColor;
				 else {*/
					 S.borderTopColor = obj.borderTopColor;
					 S.borderBottomColor = obj.borderBottomColor;
					 S.borderLeftColor = obj.borderLeftColor;
					 S.borderRightColor = obj.borderRightColor;
				//}
			}
		}



		if ((_.type==="shape" || _.type==="image")&& (obj.borderTopLeftRadius!==0 || obj.borderTopRightRadius!==0 || obj.borderBottomLeftRadius!==0 || obj.borderBottomRightRadius!==0)) S.overflow = "hidden";

		if (!_._isnotext) {
			S.fontSize = Math.round((obj.fontSize * bw))+"px";
			S.fontWeight = obj.fontWeight;
			S.letterSpacing = (obj.letterSpacing * bw)+"px";
			S.lineHeight = Math.round(obj.lineHeight * bh) + "px";
			S.textAlign = (obj.textAlign);
			if (obj.textShadow) S.textShadow = obj.textShadow;
		}

		if (_.type==="column") {
			if (_.cbg_set===undefined) {
				_.cbg_set = _.styleProps["background-color"]; //L.css('backgroundColor');
				_.cbg_set = _.cbg_set=="" || _.cbg_set===undefined || _.cbg_set.length==0 ? "transparent" : _.cbg_set;
				_.cbg_img = L.css('backgroundImage');
		 		_.cbg_img_r = L.css('backgroundRepeat');
		 		_.cbg_img_p = L.css('backgroundPosition');
		 		_.cbg_img_s = L.css('backgroundSize');
		 		_.cbg_o = _.bgopacity ? 1 : _.bgopacity;
				punchgs.TweenMax.set(L,{ backgroundColor:"transparent", backgroundImage:""});
			}
			S.backgroundColor = "transparent";
			S.backgroundImage = "none";
		}

		if(_._isstatic && _.elementHovered) {
			frams = L.data('frames');
			if(frams && frams.frame_hover && frams.frame_hover.transform) {
				for(prop in S) {
					if(S.hasOwnProperty(prop) && frams.frame_hover.transform.hasOwnProperty(prop)) delete S[prop];
				}
			}
		}

		if (L[0].nodeName=="IFRAME" && _R.gA(L[0],"layertype")==="html") {
			winw = obj.basealign =="slide" ? _R[id].ulw : _R[id].gridwidth[_R[id].level];
			winh = obj.basealign =="slide" ? _R[id].ulh : _R[id].gridheight[_R[id].level];
			S.width = !jQuery.isNumeric(obj.width) && obj.width.indexOf("%") >=0 ? (_._isstatic && !_._incolumn && !_._ingroup) ? winw * parseInt(obj.width,0)/100 : obj.width : minmaxconvert(obj.width,bw,"auto",winw,"auto");
			S.height = !jQuery.isNumeric(obj.height) && obj.height.indexOf("%") >=0 ?(_._isstatic && !_._incolumn && !_._ingroup) ? winh * parseInt(obj.height,0)/100 : obj.height : minmaxconvert(obj.height,bh,"auto",winw,"auto");
		}

		punchgs.TweenMax.set(L,S);

		if (level!="rekursive") {

			winw = obj.basealign =="slide" ? _R[id].ulw : _R[id].gridwidth[_R[id].level];
			winh = obj.basealign =="slide" ? _R[id].ulh : _R[id].gridheight[_R[id].level];
			var	swid = !jQuery.isNumeric(obj.width) && obj.width.indexOf("%") >=0 ? (_._isstatic && !_._incolumn && !_._ingroup) ? winw * parseInt(obj.width,0)/100 : obj.width : minmaxconvert(obj.width,bw,"auto",winw,"auto"),
				shei = !jQuery.isNumeric(obj.height) && obj.height.indexOf("%") >=0 ?(_._isstatic && !_._incolumn && !_._ingroup) ? winh * parseInt(obj.height,0)/100 : obj.height : minmaxconvert(obj.height,bh,"auto",winw,"auto"),
				Sr = {
					maxWidth : minmaxconvert(obj.maxWidth,bw,"none",winw,"none"),
					maxHeight : minmaxconvert(obj.maxHeight,bh,"none",winh,"none"),
					minWidth : minmaxconvert(obj.minWidth,bw,"0px",winw,0),
					minHeight : minmaxconvert(obj.minHeight,bh,"0px",winh,0),
					height : shei,
					width :swid,
					overwrite :"auto"
				};
			if (_.heightSetByVideo==true) delete Sr.height;

			// FIX FOR OLD VERSION KILLS MAX WIDTH CONTAINERS IN COLUMNS IN NEW VERSION
			//swid = obj.float==="none" && (obj.display==="block" || _.display==="block") && _._incolumn && _.type!=="column" ? "auto" : swid;

			if (_._incolumn) {
				punchgs.TweenMax.set([_.p],{
					minWidth:swid, maxWidth:swid,
					marginTop:(margin.t * bh) + "px",
					marginBottom:(margin.b * bh) + "px",
					marginLeft:(margin.l * bw) + "px",
					marginRight:(margin.r * bw) + "px",
					float:obj.float,
					clear:obj.clear
				}); //Make Sure Inline Blocks works fine

				punchgs.TweenMax.set(obj.display==="block" ? [_.lp] : [_.lp,_.m] ,{width:"100%"});

				Sr.width = !jQuery.isNumeric(obj.width) && obj.width.indexOf("%") >=0 ? "100%" : swid;
				if (_.type==="image") punchgs.TweenMax.set(_.img,{width:Sr.width});  // Make sure Image Inside Layer has 100% Width to fill Inline Block Elements in Columns
			}
			else
			if (!jQuery.isNumeric(obj.width) && obj.width.indexOf("%") >=0) {
				punchgs.TweenMax.set([_.p],{minWidth:_.basealign==="slide" || _._ingroup===true? swid : _R[id].gridwidth[_R[id].level]*_R[id].bw+"px"});
				punchgs.TweenMax.set([_.lp,_.m],{width:"100%"});
			}

			if (!jQuery.isNumeric(obj.height) && obj.height.indexOf("%") >=0) {
				punchgs.TweenMax.set([_.p],{minHeight:_.basealign==="slide" || _._ingroup===true? shei : _R[id].gridheight[_R[id].level]*_R[id].bw+"px"});
				punchgs.TweenMax.set([_.lp,_.m],{height:"100%"});
			}

			if (!_._isnotext) {
				Sr.whiteSpace = obj.whiteSpace;
				Sr.textAlign = obj.textAlign;
				Sr.textDecoration = obj.textDecoration;
			}
			if (obj.color!="npc" && obj.color!==undefined)  Sr.color = obj.color;

			if (_._ingroup) {
				_._groupw = Sr.minWidth;
				_._grouph = Sr.minHeight;
			}

			if (_.type==="row" && (jQuery.isNumeric(Sr.minHeight) || Sr.minHeight.indexOf("px") >=0) && Sr.minHeight!=="0px" && Sr.minHeight!==0 && Sr.minHeight!=="0" && Sr.minHeight!=="none")
				Sr.height = Sr.minHeight;
			else
			if (_.type==="row")
				Sr.height = "auto";

			// see blocked comment block above
			if(_._isstatic && _.elementHovered) {
				frams = L.data('frames');
				if(frams && frams.frame_hover && frams.frame_hover.transform) {
					for(prop in Sr) {
						if(Sr.hasOwnProperty(prop) && frams.frame_hover.transform.hasOwnProperty(prop)) delete Sr[prop];
					}
				}
			}

			if (_.type==="image") {
				if (!jQuery.isNumeric(Sr.width) && Sr.width.indexOf("%") >=0) Sr.width = "100%";
				if (!jQuery.isNumeric(Sr.height) && Sr.height.indexOf("%") >=0) Sr.height = "100%";
			}

			if (_._isgroup) {
				if (!jQuery.isNumeric(Sr.width) && Sr.width.indexOf("%") >=0) Sr.width = "100%";
				punchgs.TweenMax.set(_.p,{height:Sr.height});
			}



			punchgs.TweenMax.set(L,Sr);

			if (_.svg_src!=undefined && _.svgI!==undefined) {

				// patch, as this value can sometimes exist as a string
				if(typeof _.svgI.fill === 'string') _.svgI.fill = [_.svgI.fill];

				_.svgTemp = jQuery.extend(true,{},_.svgI);
				_.svgTemp.fill =  _.svgTemp.fill[_R[id].level];
				punchgs.TweenMax.set(_.svg,_.svgTemp);
				punchgs.TweenMax.set(_.svgPath,{fill:_.svgI.fill[_R[id].level]});
			}
		}

		if (_.type==="row") {
			S = {
				 paddingTop:  (margin.t * bh) + "px",
				 paddingBottom:  (margin.b * bh) + "px",
				 paddingLeft:  (margin.l * bw) + "px",
				 paddingRight:  (margin.r * bw) + "px"
			 };
			 punchgs.TweenMax.set(_.p,S);
		}



		if (_.type==="column") {
			// DYNAMIC HEIGHT AUTO CALCULATED BY BROWSER
			if (_.cbg && _.cbg.length>0) {
				_.cbg[0].style.backgroundSize = _.cbg_img_s;
				punchgs.TweenMax.set(_.cbg,{
					cursor : _.styleProps.cursor,
					borderTopWidth : Math.round(obj.borderTopWidth * bh) + "px",
					borderBottomWidth : Math.round(obj.borderBottomWidth * bh) + "px",
					borderLeftWidth : Math.round(obj.borderLeftWidth * bw) + "px",
					borderRightWidth : Math.round(obj.borderRightWidth * bw) + "px",
					borderStyle : obj.borderStyle,
					//borderColor : obj.borderColor,
					borderTopColor : obj.borderTopColor,
					borderBottomColor : obj.borderBottomColor,
					borderLeftColor : obj.borderLeftColor,
					borderRightColor : obj.borderRightColor,
					borderTopLeftRadius :obj.borderTopLeftRadius,
					borderTopRightRadius :obj.borderTopRightRadius,
					borderBottomLeftRadius :obj.borderBottomLeftRadius,
					borderBottomRightRadius :obj.borderBottomRightRadius,
					backgroundColor:_.cbg_set,
				 	backgroundImage:_.cbg_img,
				 	backgroundRepeat:_.cbg_img_r,
				 	backgroundPosition:_.cbg_img_p,
				 	opacity:_.cbg_o
				});
				punchgs.TweenMax.set(_.cbgmask,{
					top:   (obj.marginTop * bh) + "px",
					left:  (obj.marginLeft* bw) + "px",
					right: (obj.marginRight* bw) + "px",
					bottom: (obj.marginBottom * bh) + "px"
				});
			}
		}


		/*setTimeout(function() {
			L.css("-webkit-transition", L.data('wan'));
		    L.css("transition", L.data('ani'));
		},30);	*/

	}
};

var getSpikePath = function(_) {
	var c = {l:"none",lw:10,r:"none",rw:10};
	_ =  _.split(";");

	for (var u in _) {
		if (!_.hasOwnProperty(u)) continue;
		var s = _[u].split(":");
		switch (s[0]) {
			case "l": c.l = s[1];break;
			case "r": c.r = s[1];break;
			case "lw": c.lw = s[1];break;
			case "rw": c.rw = s[1];break;
		}
	}
	return "polygon("+getClipPaths(c.l,0,parseFloat(c.lw))+","+getClipPaths(c.r,100,(100-parseFloat(c.rw)),true)+")";
};

var getClipPaths = function(_,o,i,reverse) {
		var r;
		switch (_) {
			case "none" :   r=o+'% 100%,'+o+'% 0%';break;
			case "top" :    r=i+'% 100%,'+o+'% 0%'; break;
			case "middle" : r=i+'% 100%,'+o+'% 50%,'+i+'% 0%'; break;
			case "bottom" : r=o+'% 100%,'+i+'% 0%'; break;
			case "two": 	r=i+'% 100%,'+o+'% 75%,'+i+'% 50%,'+o+'% 25%,'+i+'% 0%';break;
			case "three": 	r=o+'% 100%,'+i+'% 75%,'+o+'% 50%,'+i+'% 25%,'+o+'% 0%';break;
			case "four": 	r=o+'% 100%,'+i+'% 87.5%,'+o+'% 75%,'+i+'% 62.5%,'+o+'% 50%,'+i+'% 37.5%,'+o+'% 25%,'+i+'% 12.5%,'+o+'% 0%';break;
			case "five": 	r=o+'% 100%,'+i+'% 90%,'+o+'% 80%,'+i+'% 70%,'+o+'% 60%,'+i+'% 50%,'+o+'% 40%,'+i+'% 30%,'+o+'% 20%,'+i+'% 10%,'+o+'% 0%';break;
		}
		if (reverse) {
			var s = r.split(",");
			r="";
			for (var i in s) {
				if (!s.hasOwnProperty(i)) continue;
				r+=s[(s.length-1)-i]+(i<s.length-1 ? "," : "");
			}
		}
		return r;
	};

})(jQuery);

