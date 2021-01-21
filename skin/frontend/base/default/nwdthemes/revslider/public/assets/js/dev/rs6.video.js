/********************************************
 * REVOLUTION 6.1.1 EXTENSION - VIDEO FUNCTIONS
 * @version: 6.1.2 (05.09.2019)
 * @requires rs6.main.js
 * @author ThemePunch
*********************************************/
(function($) {
	"use strict";
var
	_R = jQuery.fn.revolution,
	_ISM = _R.is_mobile(),
	_ANDROID = _R.is_android();

///////////////////////////////////////////
// 	EXTENDED FUNCTIONS AVAILABLE GLOBAL  //
///////////////////////////////////////////
jQuery.extend(true,_R, {

	preLoadAudio : function(li,id) {
		_R[id].videos = _R[id].videos===undefined ? {} : _R[id].videos;
		li.find('.rs-layer-audio').each(function() {

			var _nc = jQuery(this),
				_ = _R[id].videos[_nc[0].id] = _R[id].videos[_nc[0].id]===undefined ? readVideoDatas(_nc.data(),"audio") : _R[id].videos[_nc[0].id],
				obj = {};

			if (_nc.find('audio').length===0) {
				obj.src = _.mp4 !=undefined ? _.mp4  : '',
				obj.pre = _.pload || '';
				this.id = this.id===undefined || this.id==="" ? _nc.attr('audio-layer-'+Math.round(Math.random()*199999)) : this.id;
				obj.id = this.id;
				obj.status = "prepared";
				obj.start = jQuery.now();
				obj.waittime = _.ploadwait!==undefined ? _.ploadwait*1000 : 5000;
				if (obj.pre=="auto" || obj.pre=="canplaythrough" || obj.pre=="canplay" || obj.pre=="progress") {
					if (_R[id].audioqueue===undefined) _R[id].audioqueue = [];
					_R[id].audioqueue.push(obj);
					_R.manageVideoLayer(_nc,id);
				}
			}
		});
	},

	preLoadAudioDone : function(_nc,id,event) {
		var _ = _R[id].videos[_nc[0].id];
		if (_R[id].audioqueue && _R[id].audioqueue.length>0)
			jQuery.each(_R[id].audioqueue,function(i,obj) {
				if (_.mp4 === obj.src && (obj.pre === event || obj.pre==="auto")) obj.status = "loaded";
			});
	},

	resetVideo : function(_nc,id,mode,nextli) {
		var _ = _R[id].videos[_nc[0].id];
		switch (_.type) {
			case "youtube":

				if (_.rwd && _.player!=undefined && _.player.seekTo!==undefined ) {
					_.player.seekTo(_.ssec==-1 ? 0 : _.ssec);
					_.player.pauseVideo();
				}
				if (_nc.find('rs-poster').length==0 && !_.bgvideo && mode!=="preset")
					punchgs.TweenLite.to(_nc.find('iframe'),0.3,{opacity:1,display:"block",ease:punchgs.Power3.easeInOut});
			break;

			case "vimeo":
				if (_.vimeoplayer!==undefined && !nextli && _.rwd && ((_.ssec!==0  && _.ssec!==-1) || (_.bgvideo || _nc.find('rs-poster').length>0))) {
					_.vimeoplayer.setCurrentTime(_.ssec==-1 ? 0 : _.ssec);
					_.vimeoplayer.pause();
				}
				if (_nc.find('rs-poster').length==0 && !_.bgvideo && mode!=="preset")
					punchgs.TweenLite.to(_nc.find('iframe'),0.3,{opacity:1,display:"block",ease:punchgs.Power3.easeInOut});
			break;

			case "html5":
				if (_ISM && _.notonmobile) return false;
				punchgs.TweenLite.to(_.jvideo,0.3,{opacity:1,display:"block",ease:punchgs.Power3.easeInOut});
				if (_.rwd && !_nc.hasClass("videoisplaying")) _.video.currentTime = _.ssec == -1 ? 0 : _.ssec;
				if (_.volume=="mute" || _R.lastToggleState(_nc.videomutetoggledby) || _R[id].globalmute===true) _.video.muted = true;
			break;
		}
	},

	Mute : function(_nc,id,m) {
		var muted = false,
			_ = _R[id].videos[_nc[0].id];
		switch (_.type) {
			case "youtube":
				if (_.player) {
					if (m===true) _.player.mute();
					if (m===false) ytVolume(_,parseInt(_.volcache,0));
					muted = _.player.isMuted();
				}
			break;
			case "vimeo":
				//if (jQuery.fn.revolution.get_browser()==="Chrome") return;
				if (!_.volcachecheck) {
					_.volcache = _.volcache>1 ? _.volcache/100 : _.volcache;
					_.volcachecheck = true;
				}
				_.volume = m===true ? "mute" : m===false ? _.volcache : _.volume;
				if (m!==undefined && _.vimeoplayer!=undefined) vimeoVolume(_,(m===true ? 0 : _.volcache));
				muted= _.volume=="mute" || _.volume===0;

			break;
			case "html5":
				if (!_.volcachecheck) {
					_.volcache = _.volcache>1 ? _.volcache/100 : _.volcache;
					_.volcachecheck = true;
				}
				_.video.volume = _.volcache;
				if (m!==undefined && _.video) _.video.muted = m;
				muted = _.video!==undefined ? _.video.muted : muted;
			break;
		}
		if (m===undefined) return muted;
	},

	stopVideo : function(_nc,id) {
		if (_R[id]===undefined || _R[id]===undefined) return;
		var _ = _R[id].videos[_nc[0].id];
		if (_===undefined) return;
		if (!_R[id].leaveViewPortBasedStop) _R[id].lastplayedvideos = [];
		_R[id].leaveViewPortBasedStop = false;
		switch (_.type) {
			case "youtube":
				if (_.player===undefined || _.player.getPlayerState()===2 || _.player.getPlayerState()===5) return;
				_.player.pauseVideo();
				_.youtubepausecalled = true;
				setTimeout(function() { _.youtubepausecalled=false;},80);
			break;
			case "vimeo":
				if (_.vimeoplayer===undefined) return;
				_.vimeoplayer.pause();
				_.vimeopausecalled = true;
				setTimeout(function() { _.vimeopausecalled=false;},80);
			break;
			case "html5":
				if (_.video) _.video.pause();
			break;
		}
	},

	playVideo : function(_nc,id) {

		var _ = _R[id].videos[_nc[0].id];

		clearTimeout(_.videoplaywait);
		switch (_.type) {
			case "youtube":
				if (_nc.find('iframe').length==0) {
					_nc.append(_.videomarkup);
					addVideoListener(_nc,id,true);
				} else
				if (_.player.playVideo!=undefined) {
						var ct = _.player.getCurrentTime();
						if (_.nseTriggered) {
							ct=-1;
							_.nseTriggered = false;
						}
						if (_.ssec!=-1 && _.ssec>ct) _.player.seekTo(_.ssec);
						if (_.youtubepausecalled!==true) playYouTube(_);
				} else
				_.videoplaywait = setTimeout(function() { if (_.youtubepausecalled!==true) _R.playVideo(_nc,id); },50);
			break;
			case "vimeo":
				if (_nc.find('iframe').length==0) {
					delete _.vimeoplayer;
					_nc.append(_.videomarkup);
					addVideoListener(_nc,id,true);
				} else
				if (_nc.hasClass("rs-apiready")) {
					_.vimeoplayer = _.vimeoplayer==undefined ? new Vimeo.Player(_nc.find('iframe').attr("id")) : _.vimeoplayer;
					if (!_.vimeoplayer.getPaused())
						_.videoplaywait = setTimeout(function() { if (_.vimeopausecalled!==true) _R.playVideo(_nc,id);},50);
					else
						setTimeout(function() {
							var ct = _.currenttime===undefined ? 0 : _.currenttime;
							if (_.nseTriggered) {
								ct=-1;
								_.nseTriggered = false;
							}
							if (_.ssec!=-1 && _.ssec>ct) _.vimeoplayer.setCurrentTime(_.ssec);
							if (_.volume=="mute" || _.volume===0 || _R.lastToggleState(_nc.data('videomutetoggledby')) || _R[id].globalmute===true) _.vimeoplayer.setVolume(0);
							playVimeo(_.vimeoplayer);
						},510);
				} else
				_.videoplaywait = setTimeout(function() { if (_.vimeopausecalled!==true) _R.playVideo(_nc,id);},100);
			break;
			case "html5":
				if (!_.metaloaded)
					addEvent(_.video,'loadedmetadata',function(_nc) {
						_R.resetVideo(_nc,id);
						_.video.play();
						var	ct = _.video.currentTime;
						if (_.nseTriggered) {
								ct=-1;
								_.nseTriggered = false;
							}
						if (_.ssec!=-1 && _.ssec>ct) _.video.currentTime = _.ssec;
					}(_nc));
				else {
					playHTML5(_.video);
					var ct = _.video.currentTime;
					if (_.nseTriggered) {
							ct=-1;
							_.nseTriggered = false;
						}
					if (_.ssec!=-1 && _.ssec>ct) _.video.currentTime = _.ssec;
				}
			break;
		}
	},

	isVideoPlaying : function(_nc,id) {
		var ret = false;
		if (_R[id].playingvideos != undefined) {
			jQuery.each(_R[id].playingvideos,function(i,nc) {
				if (_nc.attr('id') == nc.attr('id')) ret = true;
			});
		}
		return ret;
	},

	removeMediaFromList : function(_nc,id) {
		remVidfromList(_nc,id);
	},

	prepareCoveredVideo : function(id,_nc) {

		var _ = _R[id].videos[_nc[0].id];
		_R.updateDimensions(id);

		if (_.vimeoid!==undefined && _.vimeoplayerloaded===undefined) return;

		_.ifr = _nc.find('iframe, video');
		_.vd =  _.ratio.split(':').length>1 ? _.ratio.split(':')[0] / _.ratio.split(':')[1]  : 1;

		if (_R[id].conw===0 || _R[id].conh===0) {
			_R.setSize(id);
			clearTimeout(_.resizelistener);
			_.resizelistener = setTimeout(function() { _R.prepareCoveredVideo(id,_nc);},100);
			return;
		}

		var od = _R[id].conw / _R[id].conh,
			nvh = (od/_.vd)*100,
			nvw = (_.vd/od)*100;
		if (_.type==="html5" && _R.get_browser()!=="Edge" && _R.get_browser()!=="IE") {
			nvw = 100;
			nvh = 100;
		}

		if (_R.get_browser()==="Edge") {
			if (od>_.vd)
				punchgs.TweenLite.set(_.ifr,{minWidth:"100%", height:nvh+"%", x:"-50%", y:"-50%", top:"50%",left:"50%",position:"absolute"});

			else
				punchgs.TweenLite.set(_.ifr,{minHeight:"100%", width:nvw+"%", x:"-50%", y:"-50%", top:"50%",left:"50%",position:"absolute"});
		} else {
			if (od>_.vd)
				punchgs.TweenLite.set(_.ifr,{height:nvh+"%", width:"100%", top:-(nvh-100)/2+"%",left:"0px",position:"absolute"});
			else
				punchgs.TweenLite.set(_.ifr,{width:nvw+"%", height:"100%", left:-(nvw-100)/2+"%",top:"0px",position:"absolute"});
		}

		if (!_.ifr.hasClass("resizelistener")) {
			_.ifr.addClass("resizelistener");
			jQuery(window).resize(function() {
				_R.prepareCoveredVideo(id,_nc);
				clearTimeout(_.resizelistener);
				_.resizelistener = setTimeout(function() {_R.prepareCoveredVideo(id,_nc);},90);
			});
		}
	},

	checkVideoApis : function(_nc,id) {
		var httpprefix = location.protocol === 'https:' ? "https" : "http";
		if (!_R[id].youtubeapineeded) {
			if ((_nc.data('ytid')!=undefined  || _nc.find('iframe').length>0 && _nc.find('iframe').attr('src').toLowerCase().indexOf('youtube')>0)) _R[id].youtubeapineeded = true;
			if (_R[id].youtubeapineeded && !window.rs_addedyt) {
				_R[id].youtubestarttime = jQuery.now();
				window.rs_addedyt=true;
				var s = document.createElement("script"),
					before = document.getElementsByTagName("script")[0],
					loadit = true;
				s.src = "https://www.youtube.com/iframe_api";

				jQuery('head').find('*').each(function(){
					if (jQuery(this).attr('src') == "https://www.youtube.com/iframe_api")
					   loadit = false;
				});
				if (loadit) before.parentNode.insertBefore(s, before);
			}
		}
		if (!_R[id].vimeoapineeded) {
			if ((_nc.data('vimeoid')!=undefined || _nc.find('iframe').length>0 && _nc.find('iframe').attr('src').toLowerCase().indexOf('vimeo')>0)) _R[id].vimeoapineeded = true;
		  	if (_R[id].vimeoapineeded && !window.rs_addedvim) {
				_R[id].vimeostarttime = jQuery.now();
				window.rs_addedvim=true;
				var f = document.createElement("script"),
					before = document.getElementsByTagName("script")[0],
					loadit = true;
				f.src = "https://player.vimeo.com/api/player.js"; /* Load Player API*/

				jQuery('head').find('*').each(function(){
					if (jQuery(this).attr('src') == "https://player.vimeo.com/api/player.js")
					   loadit = false;
				});
				if (loadit)
					before.parentNode.insertBefore(f, before);
			}
		}
	},

	manageVideoLayer : function(_nc,id) {

		if (_R.gA(_nc[0],"videoLayerManaged")===true || _R.gA(_nc[0],"videoLayerManaged")==="true") return false;
		_R[id].videos = _R[id].videos===undefined ? {} : _R[id].videos;
		var _ = _R[id].videos[_nc[0].id] = _R[id].videos[_nc[0].id]===undefined ? readVideoDatas(_nc.data()) : _R[id].videos[_nc[0].id];

		_.audio = _.audio===undefined ? false : _.audio;
		if (!_ISM || !_.opom) {
			_.id = _nc[0].id;
			_.pload = _.pload === "auto" || _.pload === "canplay" || _.pload === "canplaythrough" || _.pload === "progress" ? "auto" : _.pload;
			_.type = (_.mp4!=undefined || _.webm!=undefined) ? "html5" : (_.ytid!=undefined && String(_.ytid).length>1) ? "youtube" : (_.vimeoid!=undefined && String(_.vimeoid).length>1) ? "vimeo" : "none";
			_.newtype = (_.type=="html5" && _nc.find(_.audio ? "audio" : "video").length==0) ? "html5" : (_.type=="youtube" && _nc.find('iframe').length==0) ? "youtube" : (_.type=="vimeo" && _nc.find('iframe').length==0) ? "vimeo" : "none";

			// PREPARE TIMER BEHAVIOUR BASED ON AUTO PLAYED VIDEOS IN SLIDES
			if (!_.audio && _.aplay == "1sttime" && _.pausetimer && _.bgvideo) _nc.closest('rs-slide').addClass("rs-pause-timer-once");
			if (!_.audio && _.bgvideo && _.pausetimer && (_.aplay==true || _.aplay=="true" || _.aplay == "no1sttime"))  _nc.closest('rs-slide').addClass("rs-pause-timer-always");

			if (_.noInt) _nc.addClass("rs-nointeraction");
			// ADD HTML5 VIDEO IF NEEDED
			switch (_.newtype) {
				case "html5":
					if (_.audio) _nc.addClass("rs-audio");
					_.tag = _.audio ? "audio" : "video";
					var _funcs = _.tag==="video" && (_R.is_mobile() || _R.isSafari11()) ? _.aplay || _.aplay==="true" ? 'muted playsinline autoplay' : _.inline ? ' playsinline' : '' : '',
						apptxt = '<'+_.tag+' '+_funcs+' '+(_.controls ? ' controls ':'') +' style="'+(_R.get_browser()!=="Edge" ? 'object-fit:cover;background-size:cover;opacity:0;width:100%; height:100%' : '') +'" class="" '+(_.loop ? 'loop' : '')+' preload="'+_.pload+'">';

					if (_.tag === 'video' && _.webm!=undefined && _R.get_browser().toLowerCase()=="firefox") apptxt = apptxt + '<source src="'+_.webm+'" type="video/webm" />';
					if (_.mp4!=undefined) apptxt = apptxt + '<source src="'+_.mp4+'" type="'+ (_.tag==="video" ? 'video/mp4' : 'audio/mpeg')+'" />';
					if (_.ogv!=undefined) apptxt = apptxt + '<source src="'+_.mp4+'" type="'+_.tag+'/ogg" />';
					apptxt += '</'+_.tag+'>';
					_.videomarkup = apptxt;
					if (!(_ISM && _.notonmobile) && !_R.isIE(8)) _nc.append(apptxt);

					// ADD HTML5 VIDEO CONTAINER
					if (!_nc.find(_.tag).parent().hasClass("html5vid"))	_nc.find(_.tag).wrap('<div class="html5vid" style="position:relative;top:0px;left:0px;width:100%;height:100%; overflow:hidden;"></div>');

					_.jvideo = _nc.find(_.tag);
					_.video = _.jvideo[0];
					_.html5vid = _.jvideo.parent();

					if (!_.metaloaded)
						addEvent(_.video,'loadedmetadata',function(_nc) {
							htmlvideoevents(_nc,id);
							_R.resetVideo(_nc,id);
						}(_nc));
				break;

				case "youtube":
					if (!_.controls) {
				 		_.vatr = _.vatr.replace("controls=1","controls=0");
				 		if (_.vatr.toLowerCase().indexOf('controls')==-1) _.vatr = _.vatr+"&controls=0";
				 	}
				 	if (_.inline || _nc[0].tagName==="RS-BGVIDEO") _.vatr = _.vatr + "&playsinline=1";

				 	if (_.ssec!=-1) _.vatr+="&start="+_.ssec;
				 	if (_.esec!=-1) _.vatr+="&end="+_.esec;

				 	var orig = _.vatr.split('origin=https://');
				 	_.vatrnew = orig.length>1 ? orig[0]+'origin=https://' + ((self.location.href.match(/www/gi) && !orig[1].match(/www/gi)) ? "www."+orig[1] : orig[1]) : _.vatr;

				 	_.videomarkup = '<iframe allow="autoplay; fullscreen" type="text/html" src="https://www.youtube.com/embed/'+_.ytid+'?'+_.vatrnew+'" '+(_.afs===true ? "allowfullscreen" : "")+' width="100%" height="100%" style="opacity:0;visibility:visible;width:100%;height:100%"></iframe>';
				break;

				case "vimeo":
					if (!_.controls) {
				 		_.vatr = _.vatr.replace("background=1","background=0");
				 		if (_.vatr.toLowerCase().indexOf('background')==-1) _.vatr = _.vatr+"&background=0";
				 	} else {
				 		_.vatr = _.vatr.replace("background=0","background=1");
				 		if (_.vatr.toLowerCase().indexOf('background')==-1) _.vatr = _.vatr+"&background=1";
				 	}
					_.vatr = 'autoplay='+(_.aplay===true ? 1 : 0)+'&'+_.vatr;
					if (_.loop) _.vatr = 'loop=1&'+_.vatr;
					_.videomarkup = '<iframe  allow="autoplay; fullscreen" src="https://player.vimeo.com/video/'+_.vimeoid+'?'+_.vatr+'" webkitallowfullscreen mozallowfullscreen allowfullscreen width="100%" height="100%" style="opacity:0;visibility:visible;100%;height:100%"></iframe>';
				break;
			}
			if (_.poster!=undefined && _.poster.length>2 && !(_ISM && _.npom)) {
				if (_nc.find('rs-poster').length==0) _nc.append('<rs-poster class="noSwipe" style="background-image:url('+_.poster+');"></rs-poster>');
				if (_nc.find('iframe').length==0)
				_nc.find('rs-poster').click(function() {
					_R.playVideo(_nc,id);
					if (_ISM) {
						if (_.notonmobile) return false;
						punchgs.TweenLite.to(_nc.find('rs-poster'),0.3,{opacity:0,visibility:"hidden",force3D:"auto",ease:punchgs.Power3.easeInOut});
						punchgs.TweenLite.to(_nc.find('iframe'),0.3,{opacity:1,display:"block",ease:punchgs.Power3.easeInOut});
					}
				})
			} else {
				if  (_ISM && _.notonmobile) return false;
				if (_nc.find('iframe').length==0 && (_.type=="youtube" || _.type=="vimeo")) {
					delete _.vimeoplayer;
					_nc.append(_.videomarkup);
					addVideoListener(_nc,id,false);
				}
			}

			// ADD DOTTED OVERLAY IF NEEDED
			if (_.doverlay !=="none" && _.doverlay!==undefined)
				if (_.bgvideo) { if  (_nc.closest('rs-sbg-wrap').find('rs-dotted').length!=1) _nc.closest('rs-sbg-wrap').append('<rs-dotted class="'+_.doverlay+'"></rs-dotted>');
				} else if (_nc.find('rs-dotted').length!=1) _nc.append('<rs-dotted class="'+_.doverlay+'"></rs-dotted>');
			_R.sA(_nc[0],"videoLayerManaged",true);

			if (_.bgvideo) punchgs.TweenLite.set(_nc.find('video, iframe'),{opacity:0});
		} else {
			if (_nc.find('rs-poster').length==0) _nc.append('<rs-poster class="noSwipe" style="background-image:url('+_.poster+');"></rs-poster>');
		}
	}
});

function getStartSec(st) {
	return st == undefined ? -1 :jQuery.isNumeric(st) ? st : st.split(":").length>1 ? parseInt(st.split(":")[0],0)*60 + parseInt(st.split(":")[1],0) : st;
};

var addEvent = function(element, eventName, callback) {
	if (element.addEventListener)
		element.addEventListener(eventName, callback, {capture:false,passive:true});
	else
		element.attachEvent(eventName, callback, {capture:false,passive:true});
};

var pushVideoData = function(p,t,d) {
	var a = {};
	a.video = p;
	a.type = t;
	a.settings = d;
	return a;
}

var callPrepareCoveredVideo = function(id,_nc) {

	var _ = _R[id].videos[_nc[0].id];
	// CARE ABOUT ASPECT RATIO
	if (_.bgvideo || _.fcover) {
		if (_.fcover) _nc.removeClass("rs-fsv").addClass("coverscreenvideo");
		if (_.ratio===undefined || _.ratio.split(":").length<=1) _.ratio = "16:9";
		_R.prepareCoveredVideo(id,_nc);
	}
}

// SET VOLUME OF THE VIMEO
var vimeoVolume = function(_,p) {
	var v = _.vimeoplayer;
	v.getPaused().then(function(paused) {
	    var isplaying = !paused;
	    var promise = v.setVolume(p);
		if (promise!==undefined) {
			promise.then(function(e) {
				v.getPaused().then(function(paused) {
				    if (isplaying === paused) {
				    	_.volume = "mute";
				    	v.setVolume(0);
				    	v.play();
				    }
				}).catch(function(e) {
					console.log("Get Paused Function Failed for Vimeo Volume Changes Inside the Promise");
				});
			}).catch(function(e) {
				if (isplaying) {
					_.volume = "mute";
					v.setVolume(0);
					v.play();
				}
			});
		}
	}).catch(function(){
		console.log("Get Paused Function Failed for Vimeo Volume Changes");
	});
}

// SET YOUTUBE VOLUME
var ytVolume = function(_,p) {
	var wasplaying = _.player.getPlayerState();

	if (p==="mute")
		_.player.mute();
	else {
		_.player.unMute();
		_.player.setVolume(p);
	}

	setTimeout(function() {
		if (wasplaying===1 && _.player.getPlayerState()!==1) {
			_.player.mute();
			_.player.playVideo();
		}
	},39);

}

// ERROR HANDLING FOR VIDEOS BY CALLING

var playHTML5 = function(v) {
	var promise = v.play();
	if (promise!==undefined) promise.then( function(e) {}).catch(function(e) {
		v.pause();
	})
}

var playVimeo = function(v) {

	var promise = v.play();
	if (promise!==undefined) promise.then( function(e) {}).catch(function(e) {
		v.setVolume(0);
		v.play();
	});
}

var playYouTube = function(_) {
	_.player.playVideo();
	setTimeout(function() {
		if (_.player.getPlayerState()!==1 && _.player.getPlayerState()!==3) {
			_.volume = "mute";
			_.player.mute();
			_.player.playVideo();
		}
	},39);
}

var vimeoPlayerPlayEvent = function(_,_nc,id) {
	_.vimeostarted = true;
	_.nextslidecalled = false;
	punchgs.TweenLite.to(_nc.find('rs-poster'),0.3,{opacity:0,visibility:"hidden", force3D:"auto",ease:punchgs.Power3.easeInOut});
	punchgs.TweenLite.to(_nc.find('iframe'),0.3,{opacity:1,display:"block",ease:punchgs.Power3.easeInOut});
	_R[id].c.trigger('revolution.slide.onvideoplay',pushVideoData(_.vimeoplayer,"vimeo",_));
	_R[id].stopByVideo=_.pausetimer;
	addVidtoList(_nc,id);
	if (_.volume=="mute" || _.volume===0 || _R.lastToggleState(_nc.data('videomutetoggledby')) || _R[id].globalmute===true)
	  _.vimeoplayer.setVolume(0);
	else
	  vimeoVolume(_,parseInt(_.volcache,0)/100 || 0.75);
	_R.toggleState(_.videotoggledby);
}

var addVideoListener = function(_nc,id,startnow) {
	var _=	_R[id].videos[_nc[0].id],
		frameID = "iframe"+Math.round(Math.random()*100000+1);
	_.ifr = _nc.find('iframe');

	callPrepareCoveredVideo(id,_nc);

	_.ifr.attr('id',frameID);
	_.startvideonow = startnow;

	if (_.videolistenerexist) {
		if (startnow)
			switch (_.type) {
				case "youtube":
					playYouTube(_);
					if (_.ssec!=-1) _.player.seekTo(_.ssec)
				break;
				case "vimeo":
					playVimeo(_.vimeoplayer);
					if (_.ssec!=-1) _.vimeoplayer.seekTo(_.ssec);
				break;
			}
	}else {
		switch (_.type) {
			// YOUTUBE LISTENER
			case "youtube":
				_.player = new YT.Player(frameID, {
					events: {
						'onStateChange': function(event) {
								if (event.data == YT.PlayerState.PLAYING) {
									punchgs.TweenLite.to(_nc.find('rs-poster'),0.3,{opacity:0,visibility:"hidden",force3D:"auto",ease:punchgs.Power3.easeInOut});
									punchgs.TweenLite.to(_.ifr,0.3,{opacity:1,display:"block",ease:punchgs.Power3.easeInOut});

									if (_.volume=="mute" || _.volume===0 || _R.lastToggleState(_nc.data('videomutetoggledby')) || _R[id].globalmute===true)
										  _.player.mute();
									else ytVolume(_,parseInt(_.volcache,0) || 75);

									_R[id].stopByVideo=true;
									addVidtoList(_nc,id);
									if (_.pausetimer) _R[id].c.trigger('stoptimer'); else _R[id].stopByVideo=false;

									_R[id].c.trigger('revolution.slide.onvideoplay',pushVideoData(_.player,"youtube",_));
									_R.toggleState(_.videotoggledby);
								} else {
									if (event.data==0 && _.loop) {
										if (_.ssec!=-1) _.player.seekTo(_.ssec);
										playYouTube(_);
										_R.toggleState(_.videotoggledby);
									}
									if (!checkfullscreenEnabled() && (event.data==0 || event.data==2) && ((_.scop && _nc.find('rs-poster').length>0) || (_.bgvideo && _nc.find('.rs-fullvideo-cover').length>0))) {

										if (_.bgvideo)
											punchgs.TweenLite.to(_nc.find('.rs-fullvideo-cover'),0.1,{opacity:1,force3D:"auto",ease:punchgs.Power3.easeInOut});
										else
											punchgs.TweenLite.to(_nc.find('rs-poster'),0.1,{opacity:1,visibility:"visible",force3D:"auto",ease:punchgs.Power3.easeInOut});
										punchgs.TweenLite.to(_.ifr,0.1,{opacity:0,ease:punchgs.Power3.easeInOut});
									}
									if ((event.data!=-1 && event.data!=3)) {
										_R[id].stopByVideo=false;
										_R[id].tonpause = false;
										remVidfromList(_nc,id);
										_R[id].c.trigger('starttimer');
										_R[id].c.trigger('revolution.slide.onvideostop',pushVideoData(_.player,"youtube",_));
										if (_R[id].videoIsPlaying==undefined || _R[id].videoIsPlaying.attr("id") == _nc.attr("id")) _R.unToggleState(_.videotoggledby);
									}

									if (event.data==0 && _.nse) {
										exitFullscreen();
										_.nseTriggered = true;
										_R[id].c.revnext();
										remVidfromList(_nc,id);
									} else {
										remVidfromList(_nc,id);
										_R[id].stopByVideo=false;

										if (event.data===3 || (_.lasteventdata==-1 || _.lasteventdata==3 || _.lasteventdata===undefined) && (event.data==-1 || event.data==3)) {
											//Can be ignored
										} else {
											_R[id].c.trigger('starttimer');
										}
										_R[id].c.trigger('revolution.slide.onvideostop',pushVideoData(_.player,"youtube",_));
										if (_R[id].videoIsPlaying==undefined || _R[id].videoIsPlaying.attr("id") == _nc.attr("id"))	_R.unToggleState(_.videotoggledby);
									}
								}
								_.lasteventdata = event.data;
							},
						'onReady': function(event) {
							var playerMuted,
								isVideoMobile = _R.is_mobile(),
								isVideoLayer = _nc.hasClass('rs-layer-video');
							if ((isVideoMobile || _R.isSafari11() && !(isVideoMobile && isVideoLayer)) && (_nc[0].tagName==="RS-BGVIDEO" || (isVideoLayer && (_.aplay===true || _.aplay==="true")))) {

								playerMuted = true;
								_.player.setVolume(0);
								_.volume = "mute";
								_.player.mute();
								clearTimeout(_nc.data('mobilevideotimr'));
								_nc.data('mobilevideotimr', setTimeout(function() {playYouTube(_);}, 500));
							}

							if(!playerMuted && _.volume=="mute") {
								_.player.setVolume(0);
								_.player.mute();
							}

							_nc.addClass("rs-apiready");
							if (_.speed!=undefined || _.speed!==1) event.target.setPlaybackRate(parseFloat(_.speed));

							// PLAY VIDEO IF THUMBNAIL HAS BEEN CLICKED
							_nc.find('rs-poster').unbind("click");
							_nc.find('rs-poster').click(function() { if (!_ISM) playYouTube(_);})

							if (_.startvideonow) {
								playYouTube(_);
								if (_.ssec!=-1) _.player.seekTo(_.ssec);
							}
							_.videolistenerexist = true;
						}
					}
				});
			break;

			// VIMEO LISTENER
			case "vimeo":
				var isrc = _.ifr.attr('src'),
					queryParameters = {}, queryString = isrc,
					re = /([^&=]+)=([^&]*)/g, m;
				// Creates a map with the query string parameters
				while (m = re.exec(queryString)) queryParameters[decodeURIComponent(m[1])] = decodeURIComponent(m[2]);

				if (queryParameters['player_id']!=undefined)
					isrc = isrc.replace(queryParameters['player_id'],frameID);
				else
					isrc=isrc+"&player_id="+frameID;

				isrc = isrc.replace(/&api=0|&api=1/g, '');

				var isVideoMobile = _R.is_mobile(),
					deviceCheck = isVideoMobile || _R.isSafari11(),
					isVideoBg = _nc[0].tagName==="RS-BGVIDEO";

				if(deviceCheck && isVideoBg) isrc += '&background=1';
				_.ifr.attr('src',isrc);

				_.vimeoplayer = _.vimeoplayer===undefined || _.vimeoplayer===false ? new Vimeo.Player(frameID) : _.vimeoplayer;

				if(deviceCheck) {
					var toMute;
					if(isVideoBg)
						toMute = true;
					else if(_.aplay || _.aplay==="true") {
						if(isVideoMobile) _.aplay = false;
						toMute = true;
					}

					if(toMute) {
						_.vimeoplayer.setVolume(0);
						_.volume = "mute";
					}
				}

				_.vimeoplayer.on('play', function(data) {
					if (!_.vimeostarted) vimeoPlayerPlayEvent(_,_nc,id);
				});


				// Read out the Real Aspect Ratio from Vimeo Video
				_.vimeoplayer.on('loaded',function(data) {
					var newas = {};
					_.vimeoplayer.getVideoWidth().then( function(width) {
						newas.width = width;
						if (newas.width!==undefined && newas.height!==undefined) {
							_.ratio = newas.width+":"+newas.height;
							_.vimeoplayerloaded = true;
							callPrepareCoveredVideo(id,_nc);
						}
					});
					_.vimeoplayer.getVideoHeight().then( function(height) {
						newas.height = height;
						if (newas.width!==undefined && newas.height!==undefined) {
							_.ratio = newas.width+":"+newas.height;
							_.vimeoplayerloaded = true;
							callPrepareCoveredVideo(id,_nc);
						}
					});
					if (_.startvideonow) {
						if (_.volume==="mute") _.vimeoplayer.setVolume(0);
						playVimeo(_.vimeoplayer);
						if (_.ssec!=-1) _.vimeoplayer.setCurrentTime(_.ssec);
					}
				});

				_nc.addClass("rs-apiready");



				_.vimeoplayer.on('volumechange',function(data) {
					_.volume = data.volume;
				});

				_.vimeoplayer.on('timeupdate',function(data) {
					if (!_.vimeostarted) vimeoPlayerPlayEvent(_,_nc,id);
					if (_.pausetimer && _R[id].sliderstatus=="playing") {
						_R[id].stopByVideo = true;
						_R[id].c.trigger('stoptimer');
					}
					_.currenttime = data.seconds;
					if (_.esec!=0 && _.esec!==-1 && _.esec<data.seconds && _.nextslidecalled!==true) {
						if (_.loop) {
							playVimeo(_.vimeoplayer);
							_.vimeoplayer.setCurrentTime(_.ssec!==-1 ? _.ssec : 0);
						} else {
							if (_.nse) {
								_.nseTriggered = true;
								_.nextslidecalled = true;
								_R[id].c.revnext();
							}

							_.vimeoplayer.pause();
						}
					}
				});

				_.vimeoplayer.on('ended', function(data) {
						_.vimeostarted = false;
						remVidfromList(_nc,id);
						_R[id].stopByVideo=false;
						_R[id].c.trigger('starttimer');
						_R[id].c.trigger('revolution.slide.onvideostop',pushVideoData(_.vimeoplayer,"vimeo",_));
						if (_.nse) {
							_.nseTriggered = true;
							_R[id].c.revnext();
						}
						if (_R[id].videoIsPlaying==undefined || _R[id].videoIsPlaying.attr("id") == _nc.attr("id")) _R.unToggleState(_.videotoggledby);

				});

				_.vimeoplayer.on('pause', function(data) {
						_.vimeostarted = false;
						if (((_.scop && _nc.find('rs-poster').length>0) || (_.bgvideo && _nc.find('.rs-fullvideo-cover').length>0))) {
							if (_.bgvideo)
								punchgs.TweenLite.to(_nc.find('.rs-fullvideo-cover'),0.1,{opacity:1,force3D:"auto",ease:punchgs.Power3.easeInOut});
							else
								punchgs.TweenLite.to(_nc.find('rs-poster'),0.1,{opacity:1,visibility:"visible", force3D:"auto",ease:punchgs.Power3.easeInOut});
							punchgs.TweenLite.to(_nc.find('iframe'),0.1,{opacity:0,ease:punchgs.Power3.easeInOut});
						}
						_R[id].stopByVideo = false;
						_R[id].tonpause = false;

						remVidfromList(_nc,id);
						_R[id].c.trigger('starttimer');
						_R[id].c.trigger('revolution.slide.onvideostop',pushVideoData(_.vimeoplayer,"vimeo",_));
						if (_R[id].videoIsPlaying==undefined || _R[id].videoIsPlaying.attr("id") == _nc.attr("id")) _R.unToggleState(_.videotoggledby);

				});

				_nc.find('rs-poster').unbind("click");
				_nc.find('rs-poster').click(function() {
					 if (!_ISM) {
						playVimeo(_.vimeoplayer);
						return false;
					 }
				});

				_.videolistenerexist = true;
			break;
		}
	}
}


var exitFullscreen = function() {
  if(document.exitFullscreen && document.fullscreen) {
    document.exitFullscreen();
  } else if(document.mozCancelFullScreen && document.mozFullScreen) {
    document.mozCancelFullScreen();
  } else if(document.webkitExitFullscreen && document.webkitIsFullScreen) {
    document.webkitExitFullscreen();
  }
}


var checkfullscreenEnabled = function() {
    if (window['fullScreen'] !== undefined) return window.fullScreen;
    if (document.fullscreen !==undefined) return document.fullscreen;
    if (document.mozFullScreen!==undefined) return document.mozFullScreen;
    if (document.webkitIsFullScreen!==undefined) return document.webkitIsFullScreen;

    var h = (jQuery.browser.webkit && /Apple Computer/.test(navigator.vendor)) ? 42 : 5;
    return screen.width == window.innerWidth && Math.abs(screen.height - window.innerHeight) < h;
  }

/////////////////////////////////////////	HTML5 VIDEOS 	///////////////////////////////////////////

var htmlvideoevents = function(_nc,id,startnow) {
	var _ = _R[id].videos[_nc[0].id];

	if (_ISM && _.notonmobile) return false;
	_.metaloaded = true;


	//PLAY, STOP VIDEO ON CLICK OF PLAY, POSTER ELEMENTS
	if (!_.control || _.audio) {
		if (_nc.find('.tp-video-play-button').length==0 && !_ISM) _nc.append('<div class="tp-video-play-button"><i class="revicon-right-dir"></i><span class="tp-revstop">&nbsp;</span></div>');
		_nc.find('video, rs-poster, .tp-video-play-button').click(function() {
			if (_nc.hasClass("videoisplaying"))
				_.video.pause();
			else
				_.video.play();
		});
	}

	// PRESET FULLCOVER VIDEOS ON DEMAND
	if (_.fcover || _nc.hasClass('rs-fsv') || _.bgvideo)  {
		if (_.fcover || _.bgvideo) {
			_.html5vid.addClass("fullcoveredvideo");
			if (_.ratio===undefined || _.ratio.split(':').length==1) _.ratio = "16:9";
			_R.prepareCoveredVideo(id,_nc);
		}
		else _.html5vid.addClass("rs-fsv");
	}

	addEvent(_.video,"canplaythrough", function() { _R.preLoadAudioDone(_nc,id,"canplaythrough");});

	addEvent(_.video,"canplay", function() {_R.preLoadAudioDone(_nc,id,"canplay");});

	addEvent(_.video,"progress", function() {_R.preLoadAudioDone(_nc,id,"progress");});

	// Update the seek bar as the video plays
	addEvent(_.video,"timeupdate", function(a) {
		if (_.esec!=0 && _.esec!=-1 && _.esec<_.video.currentTime && !_.nextslidecalled) {
			if (_.loop) {
				_.video.play();
				_.video.currentTime = _.ssec===-1 ? 0 : _.ssec;
			} else {
				if (_.nse) {
					_.nseTriggered = true;
					_.nextslidecalled = true;
					_R[id].jcnah = true;
					_R[id].c.revnext();
					setTimeout(function() {
						_R[id].jcnah = false;
					},1000);
				}
				_.video.pause();
			}
		}
	});

	// VIDEO EVENT LISTENER FOR "PLAY"
	addEvent(_.video,"play",function() {
		_.nextslidecalled = false;
		_.volume = _.volume!=undefined && _.volume!="mute" ? parseFloat(_.volcache) : _.volume;
		_.volcache = _.volcache!=undefined && _.volcache!="mute" ? parseFloat(_.volcache) : _.volcache;

		if (!_R.is_mobile() && !_R.isSafari11()) {
			if (_R[id].globalmute===true) _.video.muted = true; else _.video.muted = _.volume=="mute" ? true : false;
			_.volcache = jQuery.isNumeric(_.volcache) && _.volcache>1 ? _.volcache/100 : _.volcache;
			if (_.volume=="mute") _.video.muted=true;
			else if (_.volcache!=undefined) _.video.volume = _.volcache;
		}

		_nc.addClass("videoisplaying");

		addVidtoList(_nc,id);

		if (_.pausetimer!==true || _.tag=="audio") {
			_R[id].stopByVideo = false;
			_R[id].c.trigger('revolution.slide.onvideostop',pushVideoData(_.video,"html5",_));
		} else {
			_R[id].stopByVideo = true;
			_R[id].c.trigger('revolution.slide.onvideoplay',pushVideoData(_.video,"html5",_));
		}

		if (_.pausetimer && _R[id].sliderstatus=="playing") {
			_R[id].stopByVideo = true;
			_R[id].c.trigger('stoptimer');
		}

		punchgs.TweenLite.to(_nc.find('rs-poster'),0.3,{opacity:0,visibility:"hidden", force3D:"auto",ease:punchgs.Power3.easeInOut});
		punchgs.TweenLite.to(_nc.find(_.tag),0.3,{opacity:1,display:"block",ease:punchgs.Power3.easeInOut});

		_R.toggleState(_.videotoggledby);
	});

	// VIDEO EVENT LISTENER FOR "PAUSE"
	addEvent(_.video,"pause",function(e) {
		var fsmode = checkfullscreenEnabled();
		if (!fsmode && _nc.find('rs-poster').length>0 && _.scop) {
			punchgs.TweenLite.to(_nc.find('rs-poster'),0.3,{opacity:1,visibility:"visible",force3D:"auto",ease:punchgs.Power3.easeInOut});
			punchgs.TweenLite.to(_nc.find(_.tag),0.3,{opacity:0,ease:punchgs.Power3.easeInOut});
		}
		_nc.removeClass("videoisplaying");
		_R[id].stopByVideo = false;
		remVidfromList(_nc,id);
		if (_.tag!="audio")  _R[id].c.trigger('starttimer');
		_R[id].c.trigger('revolution.slide.onvideostop',pushVideoData(_.video,"html5",_));

		if (_R[id].videoIsPlaying==undefined || _R[id].videoIsPlaying.attr("id") == _nc.attr("id")) _R.unToggleState(_.videotoggledby);
	});

	// VIDEO EVENT LISTENER FOR "END"
	addEvent(_.video,"ended",function() {
		exitFullscreen();
		remVidfromList(_nc,id);
		_R[id].stopByVideo = false;
		remVidfromList(_nc,id);
		if (_.tag!="audio") _R[id].c.trigger('starttimer');
		_R[id].c.trigger('revolution.slide.onvideostop',pushVideoData(_.video,"html5",_nc.data()));

		if (_.nse && _.video.currentTime>0) {
			if (!_R[id].jcnah==true) {
				_.nseTriggered = true;
				_R[id].c.revnext();
				_R[id].jcnah = true;
			}
			setTimeout(function() {
				_R[id].jcnah = false;
			},1500)
		}
		_nc.removeClass("videoisplaying");


	});
}

var ctfs = function(_) {
	return _==="t" || _===true || _==="true" ? true : _==="f" || _===false || _==="false" ? false : _;
}

// TRANSFER SHORTENED DATA VALUES
var readVideoDatas = function(_,type) {
	_.audio = type==="audio";
	var o = _.video===undefined ? [] : _.video.split(";"),
		r = {
			volume: _.audio ? 1 : "mute",	//volume
			pload:"auto", 	//preload
			ratio:"16:9",	//aspectratio
			loop:true,	//loop
			aplay:'true',	//autplay
			fcover:_.bgvideo===1 ? true : false,	//forcecover
			afs:true,		//allowfullscreen
			controls:false,	//videocontrol
			nse:true,		//nextslideatend
			npom:false,		//noposteronmobile
			opom:false,		//Only Poster on Mobile
			inline:true, 	//inline
			notonmobile:false, //disablevideoonmobile
			start:-1,		//videostartat
			end:-1,			//videoendat
			doverlay:"none", //dottedoverlay
			scop:false,		//showcoveronpause
			rwd:true,		//forcerewind
			speed:1, 		//speed / speed
			ploadwait:5,  	// Preload Wait
			stopAV:_.bgvideo===1 ? false : true, 	// Stop All Videos
			noInt:false, 	// Stop All Videos
			volcache : 75 // Basic Volume
		}
	for (var u in o) {
		if (!o.hasOwnProperty(u)) continue;
		var s = o[u].split(":");
		switch(s[0]) {
			case "v": r.volume = s[1];break;
			case "vd": r.volcache = s[1];break;
			case "p": r.pload = s[1];break;
			case "ar": r.ratio = s[1] + (s[2]!==undefined ? ":"+s[2] : "");break;
			case "ap": r.aplay = ctfs(s[1]);break;
			case "fc": r.fcover = ctfs(s[1]); break;
			case "afs": r.afs = ctfs(s[1]);break;
			case "vc": r.controls = s[1];break;
			case "nse": r.nse = ctfs(s[1]);break;
			case "npom": r.npom = ctfs(s[1]);break;
			case "opom": r.opom = ctfs(s[1]);break;
			case "t": r.vtype = s[1];break;
			case "inl": r.inline = ctfs(s[1]);break;
			case "nomo": r.notonmobile = ctfs(s[1]);break;
			case "sta": r.start = s[1]+ (s[2]!==undefined ? ":"+s[2] : "");break;
			case "end": r.end = s[1] + (s[2]!==undefined ? ":"+s[2] : "");break;
			case "do": r.doverlay = s[1];break;
			case "scop": r.scop = ctfs(s[1]);break;
			case "rwd": r.rwd = ctfs(s[1]);break;
			case "sp": r.speed = s[1];break;
			case "vw": r.ploadwait = parseInt(s[1],0) || 5;break;
			case "sav": r.stopAV = ctfs(s[1]);break;
			case "noint": r.noInt = ctfs(s[1]);break;
			case "l": r.loopcache = s[1]; r.loop = s[1]==="loop" || s[1]==="loopandnoslidestop" ? true : s[1]==="none" ? false : ctfs(s[1]);break;
			case "ptimer": r.pausetimer = ctfs(s[1]);break;
		}
	}

	if (_.bgvideo!==undefined) r.bgvideo = _.bgvideo;
	if (_.bgvideo!==undefined && (r.fcover === false || r.fcover==="false"))  r.doverlay = "none";
	if (r.noInt) r.controls = false;
	if (_.mp4!==undefined) r.mp4 = _.mp4;
	if (_.videomp4!==undefined) r.mp4 = _.videomp4;
	if (_.ytid!==undefined) r.ytid = _.ytid;
	if (_.ogv!==undefined) r.ogv = _.ogv;
	if (_.webm!==undefined) r.webm = _.webm;
	if (_.vimeoid!==undefined) r.vimeoid = _.vimeoid;
	if (_.vatr!==undefined) r.vatr = _.vatr;
	if (_.videoattributes!==undefined) r.vatr = _.videoattributes;
	if (_.poster!==undefined) r.poster = _.poster;


	r.aplay = r.aplay==="true" ? true : r.aplay;
	r.aplay = _.audio==true ? false : r.aplay;
	if (r.bgvideo===1) r.volume="mute";

	r.ssec = getStartSec(r.start);
	r.esec = getStartSec(r.end);

	//INTRODUCING loop and pausetimer
	r.pausetimer = r.pausetimer===undefined ? r.loopcache!=="loopandnoslidestop" : r.pausetimer;
	r.inColumn = _._incolumn;
	r.audio = _.audio;

	if ((r.loop===true || r.loop==="true") && (r.nse===true || r.nse==="true")) r.loop = false;
	return r;
}

var addVidtoList = function(_nc,id) {
	_R[id].playingvideos = _R[id].playingvideos===undefined ? new Array() : _R[id].playingvideos;
	// STOP OTHER VIDEOS
	if (_R[id].videos[_nc[0].id].stopAV) {
		if (_R[id].playingvideos !== undefined && _R[id].playingvideos.length>0) {
			_R[id].lastplayedvideos = jQuery.extend(true,[],_R[id].playingvideos);
			for (var i in _R[id].playingvideos) if (_R[id].playingvideos.hasOwnProperty(i)) _R.stopVideo(_R[id].playingvideos[i],id);
		}
	}
	_R[id].playingvideos.push(_nc);
	_R[id].videoIsPlaying = _nc;
}

var remVidfromList = function(_nc,id) {
	if (_R[id]===undefined || _R[id]===undefined) return;
	if (_R[id].playingvideos != undefined && jQuery.inArray(_nc,_R[id].playingvideos)>=0)
		_R[id].playingvideos.splice(jQuery.inArray(_nc,_R[id].playingvideos),1);
}


})(jQuery);
