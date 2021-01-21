/*!
 * REVOLUTION 6.0.0 EDITOR SLIDER JS
 * @version: 1.0 (01.07.2019)
 * @author ThemePunch
*/

RVS.S.ulDIM = {width:0,height:0};

(function(jQuery) {

(function() {

	/* SHORTCUTS FOR JQUERY OBJECTS */
	var _ul,_lg,_ib,_rto,_rlo,_rulerHM,_rulerVM,_ulinner,_rvbin,lgHeight_cache,inf_s_height,inf_s_width,lastLayerGridHeight,minLayerGridHeight,sticky_settings,streamSrcUpdNeed,rTBScroll,

	/* DIMENSION SHORTCUTS */
	_ibDIM = {width:0,height:0},
	_rvbiDIM = {width:0,height:0},
	_rulerOffset = {x:0,y:0},
	_builderOffset = {left:0,top:0},
	_builderScroll = {x:0,y:0};
	/* _builderScrollDIM = {width:0,height:0}; */

	/*
	SET THE SLIDER SETTINGS
	*/
	RVS.F.setSlider = function(obj) {
		obj = obj===undefined || obj.length==0 ? {} : obj;
		if (typeof _rmig_ !=="undefined") obj = _rmig_.migrateSlider(obj);
		return(RVS.F.safeExtend(true,getNewSliderObject({}),getNewSliderObject(obj)));
	};

	/*
	INIT SLIDER AND ITS LISTENERS, SETTINGS
	*/
	RVS.F.initSliderBuilder = function() {

		RVS.C.rb = jQuery('#rev_builder');

		_ul = jQuery('#rev_slider_ul');
		_ulinner = jQuery('#rev_slider_ul_inner');
	    _lg = jQuery('#layer_grid');
	    _ib = jQuery('#rev_slider_inbuild');
	    _rto = jQuery('#ruler_top_offset');
	    _rlo = jQuery('#ruler_left_offset');
	    _rulerHM = jQuery('#ruler_hor_marker');
	    _rulerVM = jQuery('#ruler_ver_marker');
	    _rvbin = jQuery('#rev_builder_inner');



		initLocalInputBoxes();
		initLocalListeners();
		buildRuler();

		RVS.F.sliderUpdateAllFields();
		RVS.DOC.trigger('updateShortCode');

		//initResizeables();
		revsliderScrollable();

		inf_s_height = document.getElementById('show_c_height');
		inf_s_width = document.getElementById('show_c_width');
		if (inf_s_width!==undefined) inf_s_width.innerHTML = parseInt(RVS.SLIDER.settings.size.width[RVS.screen],0)+"px";


		// PRELOAD STREAM DEPENDENCIES
		loadStreamDependencies();
		RVS.F.checkSliderSource();

		//Upate Global Sizes
		for (var i in RVS.V.sizesold) if (RVS.V.sizesold.hasOwnProperty(i)) document.getElementById('global_size_'+RVS.V.sizesold[i]).innerHTML = i==0 ? "> "+RVS.ENV.glb_slizes[RVS.V.sizes[1]] :
				i==3 ? "< "+RVS.ENV.glb_slizes[RVS.V.sizes[i]] : parseInt(RVS.ENV.glb_slizes[RVS.V.sizes[i]],0)-1+"px - " + RVS.ENV.glb_slizes[RVS.V.sizes[parseInt(i,0)+1]];

	};

	RVS.F.updateAvailableDevices = function() {
		var //amount = 0,
			chgtodesktop = false;
		for (var i=1;i<4;i++) {
			if (!RVS.SLIDER.settings.size.custom[RVS.V.sizes[i]]) {
				jQuery('#screen_selecotr_ss_'+RVS.V.sizes[i]).addClass("ssnotavailable")
				if (RVS.screen==RVS.V.sizes[i]) chgtodesktop = true;
			} else {
				jQuery('#screen_selecotr_ss_'+RVS.V.sizes[i]).removeClass("ssnotavailable");
			}
		}
		/*if (amount===3)
			jQuery('#main_screenselector').hide();
		else
			jQuery('#main_screenselector').show();*/

		if (chgtodesktop) jQuery('#screen_selecotr_ss_d').trigger("click");

		RVS.DOC.trigger("updateAllInheritedSize");

	};

	RVS.F.checkForFixedScroll = function() {
		if (RVS.eMode.top==="slider" && RVS.eMode.menu=="#form_module_scroll" && jQuery('#timeline_slider_tab').hasClass("selected"))	{
			RVS.TL.TL.addClass('fixedscrolledit');
			RVS.TL.FixedScrollEdit = true;
		} else
		if (RVS.TL.FixedScrollEdit) {
			RVS.TL.TL.removeClass('fixedscrolledit');
			RVS.TL.FixedScrollEdit = false;
		}
	};

	RVS.F.updateDeviceOnOffBtns = function(ignore) {
		for (var i in RVS.V.sizes) if (RVS.V.sizes.hasOwnProperty(i)) {
			if (RVS.V.sizes[i]!=="d") {
				var ja =  jQuery('#sr_custom_'+RVS.V.sizes[i]),
					jb = jQuery('#sr_custom_'+RVS.V.sizes[i]+'_opt');
				ja.attr('checked',RVS.SLIDER.settings.size.custom[RVS.V.sizes[i]]);
				jb.attr('checked',RVS.SLIDER.settings.size.custom[RVS.V.sizes[i]]);
				if (!ignore) {
					RVS.F.turnOnOffVisUpdate({input:ja});
					RVS.F.turnOnOffVisUpdate({input:jb});
				}
			}

		}

	}

	RVS.F.sliderUpdateAllFields = function(recall) {
		// FIRST DRAW AND INPUT SETS SLIDER

		setSlidesDimension(true);

		var _ = RVS.SLIDER.settings;
		// UPDATE COMPLEX INPUT FIELDS AND SELECT BOXES
		jQuery('input[name="sliderlayouttype_guide"][value="'+_.layouttype+'"]').attr('checked','checked');
		jQuery('input[name="sliderlayouttype"][value="'+_.layouttype+'"]').attr('checked','checked');
		jQuery('input[name="slidertype"][value="'+_.type+'"]').attr('checked','checked');
		jQuery('input[name="slidertype_guide"][value="'+_.type+'"]').attr('checked','checked');

		RVS.F.updateDeviceOnOffBtns(true);

		RVS.F.updateAvailableDevices();

		jQuery('#sr_size_minheight').val(parseInt(_.size.minHeight,0) || "");
		jQuery('#sr_size_maxheight').val(parseInt(_.size.maxHeight,0) || "");
		jQuery('#sr_size_minheight_fs').val(parseInt(_.size.minHeightFullScreen,0) || "");
		jQuery('#sr_size_maxwidth').val(parseInt(_.size.maxWidth,0)|| "");
		jQuery('#slidermodalcolor').val(_.modal.coverColor).rsColorPicker("refresh");
		jQuery('#sliderbgcolor').val(_.layout.bg.color).rsColorPicker("refresh");
		jQuery('#sr_layout_padding').val(parseInt(_.layout.bg.padding,0)|| "");


		//PROGRESS BAR RESETS
		jQuery('#sliderprogresscolor').val(_.general.progressbar.color).rsColorPicker("refresh");
		jQuery('#sr_pb_height').val(parseInt(_.general.progressbar.height,0) || 10);

		// INIT EASY INPUT BOXES HERE
		if (recall) {
			jQuery('.slider_general_collector .tponoffwrap').each(function() { RVS.F.turnOnOff(jQuery(this),false);});
			RVS.F.updateEasyInputs({container:jQuery('.slider_general_collector'),path:"settings."});
		}


		RVS.F.updateEasyInputs({container:jQuery('#screen_selector_top_list'),path:"settings."});
		RVS.F.updateEasyInputs({container:jQuery('#slider_settings'),path:"settings."});
		RVS.F.updateEasyInputs({container:jQuery('#nav_form_collector'),path:"settings."});


		jQuery('#sliderTabBgColor').val(_.nav.tabs.wrapperColor).rsColorPicker("refresh");
		jQuery('#sliderThumbBgColor').val(_.nav.thumbs.wrapperColor).rsColorPicker("refresh");

		jQuery('#slider_title').html(RVS.SLIDER.settings.title);

		RVS.DOC.trigger('updateSourcePostCategories');
		RVS.DOC.trigger('updatesliderthumb');
		RVS.DOC.trigger('moduleSpinnerChange');
		RVS.DOC.trigger('updateAutoRotate');

		//TRIGGER THE ADDON GENERAL ON SWITCH EVENTS
		for (var slug in RVS.SLIDER.settings.addOns) {
			if(!RVS.SLIDER.settings.addOns.hasOwnProperty(slug)) continue;
			if (RVS.SLIDER.settings.addOns[slug].enable) RVS.DOC.trigger(slug+"_init");
		}
		//jQuery('.addon_general_switch').each(function() {if (this.value==="on" && this.dataset.evt!==undefined) RVS.DOC.trigger(this.dataset.evt);})



		// UPDATE CONTAINER DELTA
		RVS.F.updateContentDeltas();

		// UPDATE THE NAVIGATION CONTAINERS
		RVS.F.updateAllNavigationContainer(true);
		setProgressBar();
		setSliderBG();
		RVS.S.ulDIM = {width:_ul.width(), height:_ul.height()};
		RVS.F.updateParallaxLevelTexts();
		RVS.F.updateParallaxdddBG();

		RVS.DOC.trigger('checkOnScrollSettings');


	};

	/*
	UPDATE THE NAVIGATION CONTAINERS
	*/
	RVS.F.updateAllNavigationContainer = function(init) {
		if (RVS.SLIDER.settings.nav.arrows.set) RVS.F.updateNavStyleSelection({init:init,type:"arrows"});
		if (RVS.SLIDER.settings.nav.bullets.set) RVS.F.updateNavStyleSelection({init:init,type:"bullets"});
		if (RVS.SLIDER.settings.nav.tabs.set) RVS.F.updateNavStyleSelection({init:init,type:"tabs"});
		if (RVS.SLIDER.settings.nav.thumbs.set) RVS.F.updateNavStyleSelection({init:init,type:"thumbs"});
	};

	RVS.F.redrawAllNavigationContainer = function(init) {
		if (RVS.SLIDER.settings.nav.arrows.set) RVS.F.drawNavigation({init:init,type:"arrows"});
		if (RVS.SLIDER.settings.nav.bullets.set) RVS.F.drawNavigation({init:init,type:"bullets"});
		if (RVS.SLIDER.settings.nav.tabs.set) RVS.F.drawNavigation({init:init,type:"tabs"});
		if (RVS.SLIDER.settings.nav.thumbs.set) RVS.F.drawNavigation({init:init,type:"thumbs"});
	};

	/*
	SET UP THE RULERS IN ADMIN AREA
	*/
 	RVS.F.setRulers = function(obj) {
		_rulerOffset.x = Math.max(15,6+((_ibDIM.width)-parseInt(RVS.SLIDER.settings.size.width[RVS.screen],0))/2);
		_rulerOffset.y = Math.max(15,RVS.S.layer_grid_offset.top);
		setRuler({offset:{x:_rulerOffset.x, y:_rulerOffset.y}});
	};
	/*
	SET THE MARKERS ON THE RULER
	*/
	RVS.F.setRulerMarkers = function(mouse) {
		mouse = mouse===undefined ? {top:0,left:0} : mouse;
		var rML = "15px", //RVS.S.builderHover==="overruler" ? "100%" : "15px",
			rMD =  RVS.S.builderHover==="overruler" || RVS.S.builderHover==="overbuilder" ? "block" : "hidden",
			rMP = { left: mouse.x, //Math.max(15,(mouse.x-_builderOffset.left)),
					top : Math.max(15,(mouse.y-_builderOffset.top))};

		punchgs.TweenLite.set(_rulerHM,{left:rMP.left+"px",height:rML,display:rMD});
		punchgs.TweenLite.set(_rulerVM,{top:rMP.top+"px",width:rML, display:rMD});
	};

	/*
	UPDATE THE OFFSET POSITION OF THE CONTAINER
	*/
	RVS.F.updateContentDeltas = function() {
		if (RVS.C.layergrid===undefined && _lg===undefined) return;
		var _ulo = _ul.offset(),
			_lgo = RVS.S.vWmode==="slidelayout" ? RVS.C.layergrid===undefined ? _lg.offset() : RVS.C.layergrid.offset() : _lg===undefined ? RVS.C.layergrid.offset() : _lg.offset();

		RVS.S.layer_grid_offset = _lgo;
		RVS.S.layer_wrap_offset.x = _lgo.left - _ulo.left;
		RVS.S.layer_wrap_offset.y = _lgo.top - _ulo.top;
		RVS.S.layer_wrap_offset.xr = _ul.width()-_lg.width()-RVS.S.layer_wrap_offset.x;
		RVS.S.lgw = _lg.width();
		RVS.S.lgh = _lg.height();
		RVS.SLIDER.settings.size.editorCache[RVS.screen] = RVS.S.lgh;
		if (inf_s_height!==undefined) inf_s_height.innerHTML = parseInt(RVS.S.lgh,0)+"px";
		if (inf_s_width!==undefined) inf_s_width.innerHTML = parseInt(RVS.SLIDER.settings.size.width[RVS.screen],0)+"px";
		window.contentDeltaFirstRun = true;
	};

	/*
	USE PAN SLIDER (ON/OFF)
	*/
	RVS.F.panSlider = function(m) {
		/*var sl = (Math.min(Math.max((m.x-_builderOffset.left),0),_ibDIM.width) / _ibDIM.width) * (_rb[0].scrollWidth - _ibDIM.width);
		if (window.nothingselected)
			_rb.scrollLeft(sl).RSScroll("update");*/
	};

	/*
	UPDATE THE PARALLAX LEVEL TEXT / DESCRIPTIPON
	*/
	RVS.F.updateParallaxLevelTexts = function() {
		jQuery('.prallaxlevelselect').each(function() {
			var s = jQuery(this);
			for (var i=1;i<16;i++) {
				s[0].options[i].text = i+". ("+RVS.SLIDER.settings.parallax.levels[i-1]+" %)";
			}
			s.select2RS({minimumResultsForSearch:"Infinity"});
		});
	};

	// CHECK SOURCES IF THEY HAVE BEEN SET CORRECT
	RVS.F.checkSliderSource = function() {
		var allgood = true,
			s = RVS.SLIDER.settings.source[RVS.SLIDER.settings.sourcetype],
			c = s.count;
		c=c===undefined || c=="" ? 0 : c;

		switch (RVS.SLIDER.settings.sourcetype) {
			case "facebook": allgood = s.apiId!=="" && s.appSecret!=="" && (s.pageURL!=="" || s.album!=="") && c!=0; break;
			case "flickr": allgood = s.apiKey!=="" && s.appSecret!=="" && (s.galleryURL!=="" || s.groupURL!=="" || s.photoSet!=="" || s.userURL!=="") && c!=0; break;
			case "instagram": allgood = s.userId!=="" && c!=0; break;
			case "vimeo": allgood = s.typeSource=="channel" && s.channelName=="" ? false : s.typeSource=="user" && s.userName=="" ? false : s.typeSource=="group" && s.groupName=="" ? false : s.typeSource=="album" && s.albumId=="" ? false : true;
						  allgood = allgood === true && c!=0;
			break;
			case "youtube": allgood = s.api!=="" && s.channelId!=="" && c!=0; break;
			case "twitter": allgood = s.accessSecret!=="" && s.accessToken!=="" && s.consumerKey!=="" && s.consumerSecret!="" && s.userId!=="" && c!=0; break;
		}

		if (!allgood) RVS.F.showInfo({content:RVS_LANG.somesourceisnotcorrect, type:"goodtoknow", showdelay:2, hidedelay:5, hideon:"click", event:"" });

	}


	RVS.F.updateParallaxdddBG = function() {
		clearTimeout(window.updateParallaxDDDBGTimer);
		window.updateParallaxDDDBGTimer = setTimeout(function() {
			RVS.F.updateEasyInputs({container:jQuery('.slider_ddd_subsettings'), init:true});
		},50);
	};

	/*
	RESoRT THE SLIDE BASED ON THE RVS.SLIDER.slideIDs ARRAY
	*/
	RVS.F.reSortSlides = function() {
		for (var ids in RVS.SLIDER.slideIDs) {
			if(!RVS.SLIDER.slideIDs.hasOwnProperty(ids)) continue;
			if ((""+RVS.SLIDER.slideIDs[ids]).indexOf("static_")===-1)
				jQuery('#slidelist').append(jQuery('#slide_list_element_'+RVS.SLIDER.slideIDs[ids]));
		}
	};

	/*
	OPEN NEW GUIDER WINDOW AT 1ST TIME
	*/
	RVS.F.openNewGuide = function() {

		if (!window.initQuickGuide) {
			RVS.DOC.on('click','#rbm_quickguide .rbm_close, .mcg_quit_page', function() {
				RVS.F.RSDialog.close();
				RVS.F.sliderUpdateAllFields(true);
			});
			RVS.DOC.on('click','.mcg_next_page', function() { window.initQuickGuide.page++; callNewGuidePage();});
			RVS.DOC.on('click','.mcg_prev_page', function() { window.initQuickGuide.page--; callNewGuidePage(-1);});
			window.initQuickGuide = {
				page : 0,
				active : 0
			};

			RVS.DOC.on('click','.guide_combi_resize',function() {
				jQuery('.guide_combi_resize').removeClass("selected");
				this.className +=" selected";
				switch (this.id) {
					case "guide_classic":
						RVS.SLIDER.settings.def.intelligentInherit = false;
						RVS.SLIDER.settings.def.autoResponsive = false;
						RVS.SLIDER.settings.def.responsiveChilds = false;
						RVS.SLIDER.settings.def.responsiveOffset = false;
						RVS.SLIDER.settings.size.custom.n = false;
						RVS.SLIDER.settings.size.custom.t = false;
						RVS.SLIDER.settings.size.custom.m = false;
					break;
					case "guide_intelligent":
						RVS.SLIDER.settings.def.intelligentInherit = true;
						RVS.SLIDER.settings.def.autoResponsive = true;
						RVS.SLIDER.settings.def.responsiveChilds = true;
						RVS.SLIDER.settings.def.responsiveOffset = true;
					break;
					case "guide_manual":
						RVS.SLIDER.settings.def.intelligentInherit = false;
						RVS.SLIDER.settings.def.autoResponsive = false;
						RVS.SLIDER.settings.def.responsiveChilds = false;
						RVS.SLIDER.settings.def.responsiveOffset = false;
						RVS.SLIDER.settings.size.custom.n = true;
						RVS.SLIDER.settings.size.custom.t = true;
						RVS.SLIDER.settings.size.custom.m = true;
					break;
				}
				RVS.F.sliderUpdateAllFields(true);
				setSlidesDimension(true);
				RVS.F.updateAvailableDevices();
				RVS.F.updateDeviceOnOffBtns();
			});
		} else
			window.initQuickGuide.page = 0;


		callNewGuidePage();
		jQuery('#guide_classic').removeClass("selected");
		jQuery('#guide_intelligent').removeClass("selected");
		jQuery('#guide_manual').removeClass("selected");

		if (RVS.SLIDER.settings.def.intelligentInherit)
			jQuery('#guide_intelligent').addClass("selected");
		else
		if (!RVS.SLIDER.settings.size.custom.n && !RVS.SLIDER.settings.size.custom.t && !RVS.SLIDER.settings.size.custom.m)
			jQuery('#guide_classic').addClass("selected");
		else
			jQuery('#guide_manual').addClass("selected");

		RVS.F.updateEasyInputs({container:jQuery('#rbm_quickguide'),path:"settings."});
		RVS.F.RSDialog.create({modalid:'rbm_quickguide', bgopacity:0.85});
	};



	/**********************************
		-	INTERNAL FUNCTIONS -
	***********************************/

	function callNewGuidePage(dir) {
		if (window.initQuickGuide===undefined || window.initQuickGuide.page == window.initQuickGuide.active) return;
		jQuery('#mcg_page_'+window.initQuickGuide.page).addClass("mcg_selected");
		punchgs.TweenLite.fromTo('#mcg_page_'+window.initQuickGuide.page,0.5,{x:dir===-1 ? "-100%" : "100%"},{x:"0%",ease:punchgs.Power3.easeInOut});
		punchgs.TweenLite.fromTo('#mcg_page_'+window.initQuickGuide.active,0.5,{x:"0%"},{x:dir===-1 ? "100%" : "-100%",ease:punchgs.Power3.easeInOut,onComplete:function() {
			jQuery('#mcg_page_'+window.initQuickGuide.active).removeClass("mcg_selected");
			window.initQuickGuide.active = window.initQuickGuide.page;
		}});

	}
	function revsliderScrollable(type) {
		if (type===undefined || type==="init") {
			RVS.S.rb_ScrollX = 0;
			RVS.S.rb_ScrollY = 0;
			sticky_settings = jQuery('#settings_sticky_info');
			RVS.C.rb.RSScroll({
				wheelPropagation:true,
				//suppressScrollY:true,
				minScrollbarLength:100
			});

			jQuery('#the_right_toolbar_inner').RSScroll({
				wheelPropagation:true,
				suppressScrollX:true,
				minScrollbarLength:100
			}).on('ps-scroll-y',function() {
				rTBScroll = this.scrollTop;
				if (rTBScroll>50)
					sticky_settings.show();
				else
					sticky_settings.hide();
				if (RVS.S.respInfoBar && RVS.S.respInfoBar.toolbar && RVS.S.respInfoBar.toolbar[0]!==null)
					RVS.S.respInfoBar.toolbar[0].style.display = "none";
			});

			RVS.C.rb.on('ps-scroll-x',function(){
				RVS.S.rb_ScrollX = _builderScroll.x = this.scrollLeft;
				RVS.F.setRulers();
			});
			RVS.C.rb.on('ps-scroll-y',function(){
				_builderScroll.x = this.scrollLeft;
				_builderScroll.y = this.scrollTop;
				RVS.S.rb_ScrollY = _builderScroll.y = this.scrollTop;
				RVS.F.setRulers();
			});
			/*jQuery('#form_slidergeneral_module .form_inner').RSScroll({
				wheelPropagation:true,
				suppressScrollX:true
			});*/
		} else {
			if (type==="update") {
				RVS.C.rb.RSScroll("update");
				//jQuery('#form_slidergeneral_module .form_inner').RSScroll("update");
				jQuery('#the_right_toolbar_inner').RSScroll("update");
			}
		}
	}

	function buildRuler() {
		var a=0;
		for(var i=0;i<480;i++) {
			if (a%2!==0 && a!==0) {
				_rto.append('<div class="rm_five" style="left:'+(i*10)+'px"></div>');
				_rlo.append('<div class="rm_five" style="top:'+(i*10)+'px"></div>');
			}
			else
			if (a===0) {
				var temp = (i-120)*10,
					digits = (""+temp).split(""),
					label = digits.join("</br>");
				_rto.append('<div class="rm_hundred" style="left:'+(i*10)+'px">'+temp+'</div>');
				_rlo.append('<div class="rm_hundred" style="top:'+(i*10)+'px">'+label+'</div>');
			}
			else {
				_rto.append('<div class="rm_ten" style="left:'+(i*10)+'px"></div>');
				_rlo.append('<div class="rm_ten" style="top:'+(i*10)+'px"></div>');
			}
			a++;
			a = a==10 ? 0 : a;
		}

		// INIT DIMENSIONS
		_ibDIM.width = _ib.width();
		RVS.S.ulDIM = {width:_ul.width(), height:_ul.height()};

		_builderOffset = RVS.C.rb.offset();

	}

	function setRuler(obj) {
 		if (obj===undefined || obj.offset.x===undefined || obj.offset.y===undefined) return;
 		var newPos = { x:(parseInt(obj.offset.x,0) -_builderScroll.x /*+ RVS.S.dim_offsets.navleft*/)+"px",
 					   y:(65 -_builderScroll.y + RVS.S.dim_offsets.navtop)+"px"};
 		//parseInt(obj.offset.y,0)
		punchgs.TweenLite.set(_rto,{x:newPos.x});
		punchgs.TweenLite.set(_rlo,{y:newPos.y});

 	}

 	/* CHECK IF ANY STREAM DEPENDENCIES MUST BE LOADED */
 	function loadStreamDependencies(event,param) {
 		if (param==="force" || streamSrcUpdNeed || streamSrcUpdNeed===undefined) {
	 		if (RVS.SLIDER.settings.sourcetype==="flickr") flickrSourceChange();
			if (RVS.SLIDER.settings.sourcetype==="facebook") facebookSourceChange();
			if (RVS.SLIDER.settings.sourcetype==="youtube") youtubeSourceChange();
		}
		streamSrcUpdNeed = false;
		RVS.DOC.trigger('updatesliderthumb');
 	}

 	/*
	CSS AND JQUERY EDITOR .js_css_editor_tabs
	*/
	RVS.F.openSliderApi = function() {
		if (window.rs_jscss_editor==="FAIL") return;
		if (typeof CodeMirror==="undefined" || CodeMirror===undefined) {
			RVS.F.showWaitAMinute({fadeIn:500,text:RVS_LANG.loadingcodemirror});
			RVS.F.loadCSS(RVS.ENV.plugin_url+'/admin/assets/css/codemirror.css');
			jQuery.getScript(RVS.ENV.plugin_url+'/admin/assets/js/plugins/codemirror.js',function() {
				setTimeout(function() {RVS.F.showWaitAMinute({fadeOut:500});},100);
				RVS.F.openSliderApi();
			}).fail(function(a,b,c) {
				setTimeout(function() {RVS.F.showWaitAMinute({fadeOut:500});},100);
				window.rs_jscss_editor = "FAIL";
			});
		} else
		if (window.rs_jscss_editor===undefined) {
			window.rs_jscss_editor = CodeMirror(document.getElementById('rs_css_js_area'), {
				value:RVS.SLIDER.settings.codes.css,
				mode:"css",
				theme:"hopscotch",
				lineWrapping:true,
				lineNumbers:true,
			});
			window.rs_jscss_editor.on('focus',function() {	window.rs_jscss_editor.refresh();})
			setTimeout(RVS.F.openSliderApi,200);
		} else {
			RVS.F.RSDialog.create({modalid:'rbm_slider_api', bgopacity:0.5});
			jQuery('.emc_toggle_inner').RSScroll({ suppressScrollX:true});
			setTimeout(function() {
				window.rs_jscss_editor.refresh();
			},600);
		}
	};




	/*
	INIT CUSTOM EVENT LISTENERS FOR TRIGGERING FUNCTIONS
	*/
	function initLocalListeners() {
		RVS.DOC.on('showhidescrollonssm',function(a,b) {
			jQuery('.sr_sbased_tab').hide();
			jQuery('#sr_sbased_'+b).show();
			RVS.F.checkForFixedScroll();
		});

		// Updat AutoRotateOptions
		RVS.DOC.on('updateAutoRotate',function(a,ds) {
			if (ds===undefined || ds.val===undefined) {
				if (!RVS.SLIDER.settings.general.slideshow.slideShow) jQuery('#generalslideshow').hide();
			} else {
				RVS.F.openBackupGroup({id:"autorotate",txt:"Auto Slideshow",icon:"play_circle_outline"});
				var  pre = "settings.general.slideshow.";
				if (!ds.val) {
					RVS.F.updateSliderObj({path:pre+'stopSlider',val:true});
					RVS.F.updateSliderObj({path:pre+'stopAfterLoops',val:0});
					RVS.F.updateSliderObj({path:pre+'stopAtSlide',val:1});
				} else
					RVS.F.updateSliderObj({path:pre+'stopSlider',val:false});
				RVS.F.closeBackupGroup({id:"autorotate"});
				RVS.F.updateEasyInputs({container:jQuery('#form_slidergeneral_slideshow'), trigger:"init", visualUpdate:true});
			}
		});

		RVS.DOC.on('screenSelectorChanged',function() {
			RVS.F.updateEasyInputs({container:jQuery('#form_slidergeneral_general_viewport'), init:"true"});

		});

		RVS.DOC.on('checkOnScrollSettings',function() {
			if (RVS.TL===undefined || RVS.TL.TL===undefined) return;
			if (RVS.SLIDER.settings.scrolltimeline.set && RVS.SLIDER.settings.scrolltimeline.fixed && RVS.SLIDER.settings.layouttype!=="auto")
				RVS.TL.TL.addClass('fixedscrollon');
			else
				RVS.TL.TL.removeClass('fixedscrollon');
			RVS.DOC.trigger('checkLayerLoopswithOnScroll');
		});

		RVS.DOC.on('checkLayerLoopswithOnScroll',function() {
			clearTimeout(RVS.S.checkLayerLoopswithOnScroll);
			RVS.S.checkLayerLoopswithOnScroll = setTimeout(function() {
				// CHECK IF WE NEED TO DISABLE LOOP ANIMATION ON ANY LAYERS
				if (RVS.SLIDER.settings.scrolltimeline.set===true) {
					var changedsomething = false;
					for (var i in RVS.L) {
						if(!RVS.L.hasOwnProperty(i) || RVS.L[i].timeline===undefined || RVS.L[i].timeline.scrollBased===undefined) continue;
						if ((RVS.L[i].timeline.scrollBased=='true' ||  (RVS.L[i].timeline.scrollBased=='default' && RVS.SLIDER.settings.scrolltimeline.layers===true))) {
							RVS.L[i].timeline.loop.use = false;
							changedsomething = true;
						}
					}
					if (changedsomething) {
						RVS.F.updateEasyInputs({container:jQuery('#layer_looping_wrap'), trigger:"init", visualUpdate:true});
						RVS.F.showInfo({content:RVS_LANG.layerloopdisabledduetimeline, type:"goodtoknow", showdelay:0, hidedelay:2, hideon:"", event:"" });
					}
				}
			},200);
		});

		//Insert into Editor Listener
		RVS.DOC.on('click','.insertineditor',function() {
			RVS.F.insertTextAtCursor(window.rs_jscss_editor,"\n"+jQuery(this.dataset.insertfrom).val().replace("revapi.","revapi"+RVS.ENV.sliderID+".")+"\n");
			return false;
		});

		RVS.DOC.on('click','.js_css_editor_tabs',function() {
			jQuery('.js_css_editor_tabs').removeClass("selected");
			jQuery(this).addClass("selected");
			RVS.SLIDER.settings.codes[window.rs_jscss_editor.getMode().name] = window.rs_jscss_editor.getValue();
			window.rs_jscss_editor.setValue(RVS.SLIDER.settings.codes[this.dataset.mode]);
			window.rs_jscss_editor.setOption("mode", this.dataset.mode);
		});

		RVS.DOC.on('click','#emc_toggle, #form_slidergeneral_advanced_api',function() {
			jQuery('.emc_toggle_wrap').toggleClass("open");
		});

		// CLOSE CSS AND JS EDITOR
		RVS.DOC.on('openSliderApi',RVS.F.openSliderApi);


		//OPEN CSS AND JS EDITOR
		RVS.DOC.on('click','#rbm_slider_api .rbm_close',function() {
			RVS.SLIDER.settings.codes[window.rs_jscss_editor.getMode().name] = window.rs_jscss_editor.getValue();
			RVS.F.RSDialog.close();
		});

		RVS.DOC.on('device_area_dimension_update',function() {
			setSlidesDimension(true, true);
			RVS.DOC.trigger("updateAllInheritedSize");
			RVS.F.redrawSlideBG();
			RVS.F.expandCollapseTimeLine(true,"open");
		});

		RVS.DOC.on('updatesliderlayout_main',function(e,p) {
			RVS.DOC.trigger('checkOnScrollSettings');
			RVS.DOC.trigger('updatesliderlayout',[e,p]);
		});

		RVS.DOC.on('updatesliderlayout',function(e,p) {
			clearTimeout(window.updateSliderLayoutTimer);
			lgHeight_cache =  RVS.S.lgh;
			window.updateSliderLayoutTimer = setTimeout(function() {
				setSlidesDimension(false);
				RVS.F.redrawSlideBG();
				if (p==="slidertype") setProgressBar();
				if (lgHeight_cache!==RVS.S.lgh) RVS.F.updateAllHTMLLayerPositions();
			},100);
		});
		RVS.DOC.on('device_area_availibity',function() {
			setSlidesDimension(true);
			RVS.F.updateAvailableDevices();
			RVS.F.updateDeviceOnOffBtns();
		});

		RVS.DOC.on('check_custom_size',function(e,ep) {
			checkCustomSliderSize(ep.eventparam);
		});


		RVS.DOC.on('windowresized',function() {
			_rvbiDIM.width = _rvbin.width();
			_ibDIM.width = _ib.width();
			setSlidesDimension(false);
			RVS.F.setRulers();
			RVS.F.updateContentDeltas();
			revsliderScrollable("update");
		});
		RVS.DOC.on('updateShortCode',function() {
			RVS.SLIDER.settings.alias = RVS.F.sanitize_input(RVS.SLIDER.settings.alias);
			RVS.SLIDER.settings.shortcode = '{{block type="nwdrevslider/revslider" alias="'+RVS.SLIDER.settings.alias+'"}}';
			RVS.SLIDER.settings.modalshortcode = '{{block type="nwdrevslider/revslider" usage="modal" alias="'+RVS.SLIDER.settings.alias+'"}}';
			RVS.F.updateEasyInputs({container:jQuery('#form_module_title'), init:"true"});
			RVS.F.updateEasyInputs({container:jQuery('#form_slider_as_modal'), init:"true"});

		});

		RVS.DOC.on('sliderBGUpdate',setSliderBG);
		RVS.DOC.on('sliderProgressUpdate',setProgressBar);
		RVS.DOC.on('coloredit colorcancel',colorEditSlider);
		//RVS.DOC.on('updateSliderToAspectRatio',updateSliderToAspectRatio);
		RVS.DOC.on('updateParallaxLevelTexts',RVS.F.updateParallaxLevelTexts);
		RVS.DOC.on('updateParallaxdddBG',RVS.F.updateParallaxdddBG);

		// LISTENER ON PRESET CHANGES
		RVS.DOC.on('updateSourcePostCategories',function() {RVS.F.updatePostCategories({postTypes:RVS.SLIDER.settings.source.post.types, categories:jQuery('#post_category')});});
		RVS.DOC.on('flickrsourcechange',flickrSourceChange);
		RVS.DOC.on('facebooksourcechange',facebookSourceChange);
		RVS.DOC.on('youtubesourcechange',youtubeSourceChange);
		RVS.DOC.on('loadStreamDependencies',loadStreamDependencies);

		// REVERT LISTENER ON SPECIAL FORMS
		RVS.DOC.on('revertEasyInputs.source',function(e,ep) {
			RVS.F.updateEasyInputs({container:ep,trigger:"init",path:"settings."});
			/* DO WE NEED RELOAD STREAM DEPENDENCIES NOW, OR FIRST WHEN WINDOW IS SELECTED !?? */
			var flickchange = RVS.SLIDER.settings.source.flickr.apiKey !== RVS.F.revert.settings.source.flickr.apiKey ||
							  RVS.SLIDER.settings.source.flickr.userURL !== RVS.F.revert.settings.source.flickr.userURL ||
							  RVS.SLIDER.settings.source.flickr.apiKey !== RVS.F.revert.settings.source.flickr.apiKey,

				fbchange = 	RVS.SLIDER.settings.source.facebook.pageURL !== RVS.F.revert.settings.source.facebook.pageURL ||
							RVS.SLIDER.settings.source.facebook.appId!== RVS.F.revert.settings.source.facebook.appId ||
							RVS.SLIDER.settings.source.facebook.appSecret!== RVS.F.revert.settings.source.facebook.appSecret,

				ytchange = 	RVS.SLIDER.settings.source.youtube.api !== RVS.F.revert.settings.source.youtube.api ||
							RVS.SLIDER.settings.source.youtube.channelId !== RVS.F.revert.settings.source.youtube.channelId;

			if (flickchange || fbchange || ytchange) streamSrcUpdNeed = true;
			/*if (flickchange) flickrSourceChange();
			if (fbchange) facebookSourceChange();
			if (ytchange) youtubeSourceChange();*/

		});

		RVS.DOC.on('moduleSpinnerChange',function() {

			var tpe = RVS.SLIDER.settings.layout.spinner.type;
			jQuery('rs-loader').attr('class',"spinner"+tpe).html(getSpinnerMarkup());
			if(isNaN(tpe) || parseInt(tpe, 10) < 6) setSpinnerColors();

		});

		RVS.DOC.on('scrollUpdates',function() {
			revsliderScrollable("update");
		});

	}

	function getSpinnerMarkup(color) {

		jQuery('rs-loader').css('background', '').find('div').css('background', '');
		var tpe = parseInt(RVS.SLIDER.settings.layout.spinner.type, 10),
			html;

		// legacy spinners
		if(tpe === NaN || tpe < 6) {
			html = '<div class="dot1"></div><div class="dot2"></div><div class="bounce1"></div><div class="bounce2"></div><div class="bounce3"></div>';
		}
		// new spinners
		else {

			var spans = [10, 0, 4, 2, 5, 9, 0, 4, 4, 2],
				num = spans[tpe - 6];

			html = '<div class="rs-spinner-inner"';
			if(!color) color = RVS.SLIDER.settings.layout.spinner.color;

			if(tpe === 7) {
				var clr;
				if(color.search('#') !== -1) {
					clr = RSColor.processRgba(color);
				}
				else if(color.search('rgb') !== -1) {
					clr = RSColor.rgbValues(color);
					if(clr.length > 2) clr = RSColor.rgbString(clr[0].trim(), clr[1].trim(), clr[2].trim());
				}
				if(clr && typeof color === 'string') {
					clr = clr.replace(')', ', ');
					if(clr.search('rgba') === -1) clr = clr.replace('rgb', 'rgba');
					html += ' style="border-top-color: ' + clr + '0.65); border-bottom-color: ' + clr + '0.15); border-left-color: ' + clr + '0.65); border-right-color: ' + clr + '0.15)"';
				}
			}
			else if(tpe === 12) {
				html += ' style="background:' + color + '"';
			}

			html += '>';
			for(var i = 0; i < num; i++) {
				if(i > 0) html += ' ';
				html += '<span style="background:' + color + '"></span>';
			}
			html += '</div>';

		}

		return html;

	}

	/*
	SET THE COLOR OF THE SPINNER
	 */
	function setSpinnerColors(col) {

		col = col===undefined ? RVS.SLIDER.settings.layout.spinner.color : col;
		var sel = RVS.SLIDER.settings.layout.spinner.type;
		if (sel==0 || sel==5) col ="#ffffff";

		var spin = jQuery('rs-loader');
		if (sel==0 || sel==1 || sel==2 || sel==5)
			spin.css({'backgroundColor':col});
		else if(sel ==3 || sel==4) {
			spin.css({'backgroundColor':'transparent'});
		 	spin.find('div').css({'backgroundColor':col});
		}
		// new spinners
		else {
			spin.html(getSpinnerMarkup(col));
		}
	}

	/**
	 * Show/Hide flickr Photosets
	 */
	function flickrSourceChange() {
		var _ = RVS.SLIDER.settings.source.flickr;
		if(_.type=='photosets'){
			if(_.userURL!="" && _.apiKey!=""){
				var data = {
								url 	:  _.userURL,
								key 	:  _.apiKey,
								count 	:  _.count,
								set 	:  _.photoSet
							};
				RVS.F.ajaxRequest("get_flickr_photosets", data, function(response){
					jQuery("#sr_src_flickr_photoset").html(response.data.html);
					RVS.F.setS2Option({select:jQuery("#sr_src_flickr_photoset"), selectValue:_.photoSet});
				});
			}
			else{
				jQuery("#sr_src_flickr_photoset").html("");
				RVS.F.setS2Option({select:jQuery("#sr_src_flickr_photoset"),selectValue:""});
			}
		}

	}

	/**
	 * Show/Hide facebook Albums
	 */
	function facebookSourceChange() {
		var _ = RVS.SLIDER.settings.source.facebook;
		if(_.typeSource=='album'){
			if(_.appId!="" && _.appSecret!="" && _.pageURL!==""){
				var data = {
								url 		:  _.pageURL,
								album 		:  _.album,
								app_id 		:  _.appId,
								app_secret 	:  _.appSecret
							};
				RVS.F.ajaxRequest("get_facebook_photosets", data, function(response){
					jQuery("#sr_src_facebok_album").html(response.html);
					RVS.F.setS2Option({select:jQuery("#sr_src_facebok_album"), selectValue:_.album});
				});
			}
			else{
				jQuery("#sr_src_facebok_album").html("");
				RVS.F.setS2Option({select:jQuery("#sr_src_facebok_album"),selectValue:""});
			}
		}
	}

	/**
	 * Show/Hide YouTube Playlist
	 */
	function youtubeSourceChange() {
		var _ = RVS.SLIDER.settings.source.youtube;
		if(_.typeSource=='playlist'){
			if(_.api!="" && _.channelId!=""){
				var data = {
								api 	:  _.api,
								id 		:  _.channelId,
								playlist :  _.playList
							};
				RVS.F.ajaxRequest("get_youtube_playlists", data, function(response){
					jQuery("#sr_src_youtube_playlist").html(response.data.html);
					RVS.F.setS2Option({select:jQuery("#sr_src_youtube_playlist"), selectValue:_.album});
				});
			}
			else{
				jQuery("#sr_src_youtube_playlist").html("");
				RVS.F.setS2Option({select:jQuery("#sr_src_youtube_playlist"),selectValue:""});
			}
		}

	}

	/*
	INIT LOCAL INPUT BOX FUNCTIONS
	*/
	function initLocalInputBoxes() {
		// Handle ScreenSize Options
		jQuery('#screenselector').on('change',function(e) {
			RVS.screen = this.value;
			RVS.S.nextscreen = RVS.screen==="d" ? "none" : RVS.screen==="n" ? "d" : RVS.screen==="t" ? "n" : RVS.screen=="m" ? "t" : "none";
			RVS.S.prevscreen = RVS.screen==="d" ? "n" : RVS.screen==="n" ? "t" : RVS.screen==="t" ? "m" : "none";
			jQuery('.screen_selector.selected').removeClass("selected");
			jQuery('.screen_selector.ss_'+RVS.screen).addClass("selected");
			setSlidesDimension(false);
			RVS.DOC.trigger('sliderSizeChanged');
			RVS.F.setRulers();
		});


		//ADD NEW SLIDE
		RVS.DOC.on('click','#newslide, #add_blank_slide',function() {
			RVS.F.addRemoveSlideWithBackupAfterSlideId({
					id : "addnewslide",
					step : "Add New Slide",
					icon : "fiber_new",
					slideObj : {slide:RVS.F.addSlideObj(), layers:{}},
					slideObjOld : {},
					beforeSelected:RVS.S.slideId,
					after:function() {RVS.DOC.trigger('changeToSlideMode');}
			});
			return false;
		});

		//ADD BULK SLIDE
		RVS.DOC.on('addBulkSlides',function(e,param) {
			RVS.F.addRemoveSlideWithBackupAfterSlideId({
					id : "addnewslide",
					step : "Add New Slide",
					icon : "fiber_new",
					slideObj : {slide:RVS.F.addSlideObj(), layers:{}},
					slideObjOld : {},
					beforeSelected:RVS.S.slideId,
					urls:param.urlImage,
					endOfMain:function() {RVS.DOC.trigger('changeToSlideMode'); setTimeout(function() {RVS.DOC.trigger('saveslider');},500); }
			});
			return false;
		});

		// ADD TEMPLATE SLIDE
		RVS.DOC.on('click','#add_template_slide',function() {
			RVS.F.openObjectLibrary({types:["moduletemplates","modules"],filter:"all", selected:["moduletemplates"], context:"editor", success:{slide:"addSlideFromTemplate"}});
		});

		// ADD TEMPLATE SLIDE
		RVS.DOC.on('click','#add_module_slide',function() {
			RVS.F.openObjectLibrary({types:["modules","moduletemplates"],filter:"all", selected:["modules"], context:"editor", success:{slide:"addSlideFromTemplate"}});
		});

		RVS.DOC.on('addSlideFromTemplate',function(e,param) {
			RVS.F.ajaxRequest('install_template_slide', {slider_id:RVS.ENV.sliderID, slide_id:param}, function(response){
				if (response.success) {
					for (var sindex in response.slides) {
						if(!response.slides.hasOwnProperty(sindex)) continue;
						// Create New Slide Object
						var newSlide = {slide:RVS.F.addSlideObj( RVS.F.expandSlide(response.slides[sindex].params)), layers:{}, id:response.slides[sindex].id};



						// Add Layers to Slide Object
						for (var layerIndex in response.slides[sindex].layers) {
							if(!response.slides[sindex].layers.hasOwnProperty(layerIndex)) continue;
							var layerObj = response.slides[sindex].layers[layerIndex],
								newLayer =  RVS.F.addLayerObj(RVS.F.safeExtend(true,RVS.F.addLayerObj(layerObj.type,undefined,true), layerObj));


							if (newLayer) newSlide.layers[newLayer.uid] = newLayer;
						}
						// Push Slide Object to Slider Array
						RVS.SLIDER[response.slides[sindex].id] = newSlide;
						RVS.SLIDER.slideIDs.push(response.slides[sindex].id);
						RVS.F.addToSlideList({id:response.slides[sindex].id});
		            }
		            RVS.F.mainMode({mode:"slidelayout",set:true, slide:response.slides[0].id});
				}
			});


		});

		RVS.DOC.on('updatepublishicons',function(a,b) {
			if (b!==undefined && b.val!==undefined) document.getElementById('publish_toggle_icon_'+RVS.S.slideId).className = b.val+"slide";
		});

		//PUBLISH SLIDE
		RVS.DOC.on('click','.publishedslide, .unpublishedslide',function() {
			var slideid = jQuery(this).closest('li').data('ref');
			RVS.SLIDER[slideid].slide.publish.state = RVS.SLIDER[slideid].slide.publish.state==="published" ? "unpublished" : "published";
			this.className= RVS.SLIDER[slideid].slide.publish.state+"slide";
			RVS.F.updateEasyInputs({container:jQuery('#form_slidegeneral_progstate'), path:slideid+".slide.", trigger:"init"});
			RVS.SLIDER.inWork.push(slideid);
			return false;
		});

		RVS.DOC.on('deletesingleslide',function() {
			RVS.F.addRemoveSlideWithBackup({	id : "deleteslide",
				step : "Remove Slide",
				icon : "remove",
				slideObjOld : RVS.F.safeExtend(true,{},RVS.SLIDER[window.delete_slide_id]),
				slideId : window.delete_slide_id,
				slideObj : {},
				beforeSelected:RVS.S.slideId
			});
		})

		//DELETE SLIDE
		RVS.DOC.on('click','.deleteslide, #do_delete_slide',function() {
			window.delete_slide_id = this.id==="do_delete_slide" ? RVS.S.slideId : jQuery(this).closest('li').data('ref');
			RVS.F.RSDialog.create({
					bgopacity:0.85,
					modalid:'rbm_decisionModal',
					icon:'delete',
					title:RVS_LANG.deleteslide,
					maintext:RVS_LANG.deletingslide,
					subtext:RVS_LANG.deleteselectedslide+" <strong>"+RVS.SLIDER[window.delete_slide_id].slide.title+"</strong> ?",
					do:{
						icon:"delete",
						text:RVS_LANG.yesdeleteslide,
						event: "deletesingleslide"
					},
					cancel:{
						icon:"cancel",
						text:RVS_LANG.cancel
				}});


			return false;
		});

		// DUPLICATE SLIDE
		RVS.DOC.on('click','.duplicateslide, #do_duplicate_slide',function() {
			var slideid = this.id==="do_duplicate_slide" ? RVS.S.slideId : jQuery(this).closest('li').data('ref');
			RVS.F.addRemoveSlideWithBackupAfterSlideId({
				id : "duplicateslide",
				step : "Duplicate Existing Slide",
				icon : "content_copy",
				slideObj : RVS.F.safeExtend(true,{},RVS.SLIDER[slideid]),
				//slideId : RVS.F.getNewSlideId(),
				slideObjOld : {},
				beforeSelected:RVS.S.slideId

			});

			return false;
		});

		// DUPLICATE SLIDE TO CHILDSLIDE
		RVS.DOC.on('click','.addchildslide, #do_addchild_slide',function() {
			var slideid = this.id==="do_addchild_slide" ? RVS.S.slideId : jQuery(this).closest('li').data('ref');
			RVS.F.addRemoveSlideWithBackupAfterSlideId({
				id : "duplicateslide",
				parentId:slideid,
				step : "Duplicate Existing Slide",
				icon : "content_copy",
				slideObj : RVS.F.safeExtend(true,{},RVS.SLIDER[slideid]),
				//slideId : RVS.F.getNewSlideId(),
				slideObjOld : {},
				beforeSelected:RVS.S.slideId
			});

			return false;
		});

	}


	/*
	CHECK IF CURRENT SELECTED SIZE HAS CUSTOM DIMENSIONS, OR LINEAR INHERITED VALUES
	*/
	function checkCustomSliderSize(screen) {
		RVS.SLIDER.settings.size.custom[screen] = true;
		jQuery('#sr_custom_'+screen).attr('checked',RVS.SLIDER.settings.size.custom[screen]);
		RVS.F.turnOnOffVisUpdate({input:jQuery('#sr_custom_'+screen)});
	}

	/*
	UPDATE ALL SLIDES DIMENSION TO CURRENT OBJECT VALUE
	*/
	function getLastBiggerSliderDimension(_s) {
		var found = false,
			r = {w:RVS.SLIDER.settings.size.width.d, h:RVS.SLIDER.settings.size.height.d};
		for (var s in RVS.V.sizes) {
			if(!RVS.V.sizes.hasOwnProperty(s)) continue;
			if (!found && RVS.SLIDER.settings.size.custom[RVS.V.sizes[s]]) {
				r.w = parseInt(RVS.SLIDER.settings.size.width[RVS.V.sizes[s]],0);
				r.h = parseInt(RVS.SLIDER.settings.size.height[RVS.V.sizes[s]],0);
			}
			if (RVS.V.sizes[s] === _s) found = true;
		}
		return r;
	}

	/*
	MODIFICATE THE HEIGHT IF OUTER NAV SET OR CAROUSEL PADDINGS SET
	*/
	RVS.F.sliderDimensionOffsets = function() {
		var _ = {};
		_.carouseltop = RVS.SLIDER.settings.type==="carousel" ? parseInt(RVS.SLIDER.settings.carousel.paddingTop,0) : 0;
		_.carouselbottom = RVS.SLIDER.settings.type==="carousel" ? parseInt(RVS.SLIDER.settings.carousel.paddingBottom,0) : 0;
		_.carouseloffset = RVS.SLIDER.settings.type==="carousel" ? _.carouseltop + _.carouselbottom : 0;

		_.navtop = RVS.SLIDER.settings.nav.thumbs.innerOuter==="outer-top" && RVS.SLIDER.settings.nav.thumbs.set ? RVS.S.navOffset.thumbs.top : 0;
		_.navtop = RVS.SLIDER.settings.nav.tabs.innerOuter==="outer-top" && RVS.SLIDER.settings.nav.tabs.set ? RVS.S.navOffset.tabs.top : _.navtop;

		_.navbottom = RVS.SLIDER.settings.nav.thumbs.innerOuter==="outer-bottom" && RVS.SLIDER.settings.nav.thumbs.set ? RVS.S.navOffset.thumbs.bottom : 0;
		_.navbottom = RVS.SLIDER.settings.nav.tabs.innerOuter==="outer-bottom" && RVS.SLIDER.settings.nav.tabs.set ? RVS.S.navOffset.tabs.bottom : _.navbottom;

		_.navleft = RVS.SLIDER.settings.nav.thumbs.innerOuter==="outer-left" && RVS.SLIDER.settings.nav.thumbs.set ? RVS.S.navOffset.thumbs.left : 0;
		_.navleft = RVS.SLIDER.settings.nav.tabs.innerOuter==="outer-left" && RVS.SLIDER.settings.nav.tabs.set ? RVS.S.navOffset.tabs.left : _.navleft;

		_.navright = RVS.SLIDER.settings.nav.thumbs.innerOuter==="outer-right" && RVS.SLIDER.settings.nav.thumbs.set ? RVS.S.navOffset.thumbs.right : 0;
		_.navright = RVS.SLIDER.settings.nav.tabs.innerOuter==="outer-right" && RVS.SLIDER.settings.nav.tabs.set ? RVS.S.navOffset.tabs.right : _.navright;

		_.louter = (RVS.SLIDER.settings.nav.thumbs.innerOuter==="outer-left" && RVS.SLIDER.settings.nav.thumbs.set) || (RVS.SLIDER.settings.nav.tabs.innerOuter==="outer-left" && RVS.SLIDER.settings.nav.tabs.set);
		_.router = (RVS.SLIDER.settings.nav.thumbs.innerOuter==="outer-right" && RVS.SLIDER.settings.nav.thumbs.set) || (RVS.SLIDER.settings.nav.tabs.innerOuter==="outer-right" && RVS.SLIDER.settings.nav.tabs.set);

		return _;
	};

	/*
	Content Height changed ?
	*/
	RVS.F.updateMinSliderHeights = function() {
		lastLayerGridHeight = minLayerGridHeight === undefined ? 0 : minLayerGridHeight;
		minLayerGridHeight = RVS.C.layergrid!==undefined ?  RVS.C.rZone.top.height() +  RVS.C.rZone.middle.height() +  RVS.C.rZone.bottom.height() : 0;
		return lastLayerGridHeight!==minLayerGridHeight;
	};

	/*
	DRAWS THE NEW DIMENSION OF THE SLIDER
	*/
	function setSlidesDimension(updateFields, updateShrinks) {
		// MAKE SURE ONLY RUN THIS IF DIMENSIONS HAS BEEN CHANGED

		//jQuery('#the_editor').css({maxWidth:RVS.C.vW.width()-(2*260)});
		var custom = RVS.SLIDER.settings.size.custom[RVS.screen],
			ld = getLastBiggerSliderDimension(RVS.screen),
			// CALCULATE WIDTH AND HEIGHT OF LAYER GRID
			w = custom ? parseInt(RVS.SLIDER.settings.size.width[RVS.screen],0) : Math.min(ld.w,RVS.ENV.grid_sizes[RVS.screen]),
			h = custom ? parseInt(RVS.SLIDER.settings.size.height[RVS.screen],0) : (w / ld.w) * ld.h,
			// CALCULATE MIN HEIGHT OF PARRENT CONTAINER
			minh = RVS.SLIDER.settings.layouttype==="fullscreen" ? RVS.SLIDER.settings.size.minHeightFullScreen : RVS.SLIDER.settings.size.minHeight,
			nw = "100%",
			ar = h/w;


		minh = minh==="none" || !jQuery.isNumeric() ? 0 : minh;


		minh = RVS.SLIDER.settings.layouttype==="fullscreen" ? (Math.max(Math.max(minh,RVS.S.winh-RVS.ENV.globVerOffset),h+65)) : (Math.max(minh,h+65));

		//Respect Aspect Ratio
		minh = RVS.SLIDER.settings.size.respectAspectRatio ? nw==="100%" ? Math.max(RVS.C.rb.width(),w)*ar : parseInt(nw,0)*ar : minh;

		RVS.F.updateMinSliderHeights();
		minh = Math.max(minh,minLayerGridHeight+65);
		h = Math.max(h,minLayerGridHeight);

		ar = h/w;
		//CALCULATE MIN HEIGHT OF TOP CONTAINER
		var nminw = w,
			maxW = "none",
			pd = parseInt(RVS.SLIDER.settings.layout.bg.padding,0) || 0;

		RVS.S.dim_offsets = RVS.F.sliderDimensionOffsets();

		if (jQuery.isNumeric(RVS.SLIDER.settings.size.maxWidth) && RVS.SLIDER.settings.size.maxWidth>0)
			nminw = Math.min(parseInt(RVS.SLIDER.settings.size.maxWidth,0),w)+"px";

		//Draw Layout Containers
		punchgs.TweenLite.set([_lg,'.layer_grid'],{width:w+"px", maxWidth:maxW, height:h+"px"});
		punchgs.TweenLite.set(_ul,{	minWidth:(parseInt(nminw,0)+parseInt(pd,0))+"px",
									maxWidth:maxW, width:nw,
									minHeight:(parseInt(minh,0)+parseInt(pd,0))});

		punchgs.TweenLite.set(_ib,{minHeight:(minh + RVS.ENV.globVerOffset)});



		RVS.S.ulDIM = {width:_ul.width(), height:_ul.height()};

		var __L = Math.max(0,((RVS.S.ulDIM.width+15)/2 - w/2)),
			__T = Math.max(0,((RVS.S.ulDIM.height-65) - h) / 2);

		// OFFSET PLACE FOR CAROUSEL PADDINGS AND NAVIGATION OUTER CONTAINERS
		punchgs.TweenLite.set(_ul,{minHeight:(RVS.S.ulDIM.height + RVS.S.dim_offsets.carouseloffset + RVS.S.dim_offsets.navtop + RVS.S.dim_offsets.navbottom), minWidth:(/*RVS.S.ulDIM.width*/ nminw)});

		__T = __T + RVS.S.dim_offsets.carouseltop + RVS.S.dim_offsets.navtop + 65;
		//__L =__L + RVS.S.dim_offsets.navleft; // Math.max(__L,RVS.S.dim_offsets.navleft);
		__L = Math.max(15,__L);
		__T = Math.max(65,__T);


		RVS.S.layer_grid_offset = RVS.S.layer_grid_offset===undefined ? {left:0, top:__T}  : RVS.S.layer_grid_offset;
		RVS.S.layer_grid_offset.top = __T;

		if (RVS.SLIDER.settings.type==="carousel") {
			punchgs.TweenLite.set('#slide_'+RVS.S.slideId,{width:w,height:h, top:__T, left:__L, overflow:"hidden",borderRadius:RVS.SLIDER.settings.carousel.borderRadius});
			punchgs.TweenLite.set(['.layer_grid'],{x:0,y:0,left:"0px", top:"0px"});
			punchgs.TweenLite.set(_lg,{x:0,y:0,left:__L+"px", top:__T});
			punchgs.TweenLite.set('.slots_wrapper',{top:0, left:0, maxWidth:"none", maxHeight:"none"});
		} else {
			punchgs.TweenLite.set('#slide_'+RVS.S.slideId,{width:"100%",height:"100%", top:0, left:0, overflow:"visible",borderRadius:0});
			punchgs.TweenLite.set([_lg,'.layer_grid'],{x:0,y:0,left:__L+"px", top:__T});
			punchgs.TweenLite.set('.slots_wrapper',{top:65, left:15, maxWidth:Math.max(RVS.S.ulDIM.width,(_rvbin.width()-15))+"px", maxHeight:(RVS.S.ulDIM.height-65)+"px"});
		}

		// UPDATE FIELDS, THAN SET VALUES AS NEEDED
		if (updateFields) updateSlideDimensionFields();
		if (updateShrinks) RVS.F.updateScreenShrinks();

		RVS.F.updateContentDeltas();

		//DRAW CAROUSEL FAKES IN CASE WE ARE IN CAROUSEL MODE
		if (RVS.SLIDER.settings.type==="carousel")
			drawFakeCarousels({width:w, height:h, top:__T, left:__L});
		else
			jQuery('.fakecarouselslide').remove();

		// REPOSITION ALL THE CONTENT INSIDE
		RVS.F.sliderNavPositionUpdate({type:"arrows"});
		RVS.F.sliderNavPositionUpdate({type:"bullets"});
		RVS.F.sliderNavPositionUpdate({type:"tabs"});
		RVS.F.sliderNavPositionUpdate({type:"thumbs"});
		revsliderScrollable("update");
	}

	// UPDATE THE SCREEN SHRINKS ON DIFFERENT DEVICES
	RVS.F.updateScreenShrinks = function()  {
		var ld = parseInt(RVS.SLIDER.settings.size.width.d,0);
		for (var i in RVS.V.sizes) {
			if(!RVS.V.sizes.hasOwnProperty(i)) continue;
			var _s = RVS.V.sizes[i],
				custom = RVS.SLIDER.settings.size.custom[_s],
				w = custom ? parseInt(RVS.SLIDER.settings.size.width[_s],0) : Math.min(ld,RVS.ENV.grid_sizes[_s]);

			RVS.S.shrink[_s] = w / ld;
			ld = w;
		}
	};

	function updateSlideDimensionFields() {

		for (var i in RVS.V.sizes) {
			if(!RVS.V.sizes.hasOwnProperty(i)) continue;
			var _s = RVS.V.sizes[i],
				custom = RVS.SLIDER.settings.size.custom[_s],
				ld = getLastBiggerSliderDimension(_s),
				// CALCULATE WIDTH AND HEIGHT OF LAYER GRID
				w = custom ? parseInt(RVS.SLIDER.settings.size.width[_s],0) : Math.min(ld.w,RVS.ENV.grid_sizes[_s]),
				h = custom ? parseInt(RVS.SLIDER.settings.size.height[_s],0) : (w / ld.w) * ld.h;

			w = Math.round(w);
			h = Math.round(h);
			jQuery('#sr_size_width_'+_s).val(w+"px");
			jQuery('#sr_size_height_'+_s).val(h+"px");
		}

		var nmw = RVS.SLIDER.settings.size.maxWidth==="none" || RVS.SLIDER.settings.size.maxWidth===0 || RVS.SLIDER.settings.size.maxWidth==="" ? "none" : RVS.SLIDER.settings.size.maxWidth;
		jQuery('#sr_size_maxwidth').val(nmw);
		jQuery('#sr_size_minheight').val(RVS.SLIDER.settings.size.minHeight);
		jQuery('#sr_size_minheight_fs').val(RVS.SLIDER.settings.size.minHeightFullScreen);
		if (inf_s_width!==undefined) inf_s_width.innerHTML = parseInt(RVS.SLIDER.settings.size.width[RVS.screen],0)+"px";
	}

	/*
	DRAW FAKE CAROUSELS
	*/
	function drawFakeCarousels(obj) {

		var _ = RVS.SLIDER.settings,
			wrap = jQuery('#fake_carousel_elements'),
			leftoffset = 0,
			side = 1,
			ha = _.carousel.horizontal==="center" ? 2 : 1,
			d = 0,
			scaleoffset = 0;
		jQuery('.fakecarouselslide').hide();
		for (var ci = 1;ci<_.carousel.maxItems;ci++) {
			var fc = jQuery('#fakecarouselslide_'+ci),
				tr;
			if (fc.length===0) {
				fc = jQuery('<div class="fakecarouselslide" id="fakecarouselslide_'+ci+'"></div>');
				wrap.append(fc);
			}
			leftoffset = ci % 2 === 1 ? parseFloat(leftoffset) + parseFloat(obj.width) + parseInt(_.carousel.space,0) : leftoffset;
			d = ci % 2 === 1 ? d+1 : d;


			tr = {
						width:obj.width,
						height:obj.height,
						left:parseFloat(obj.left) + (side * leftoffset), top:obj.top,
						borderRadius:_.carousel.borderRadius,
						display:"block"
						};

			// SET SCALE DOWNS
			var sdown = parseInt(_.carousel.scaleDown,0),
				mrot = parseInt(_.carousel.maxRotation,0),
				mfad = parseInt(_.carousel.maxOpacity,0);

			// SET FADEOUT OF ELEMENT
			if (_.carousel.fadeOut)
				if (_.carousel.varyFade)
					tr.autoAlpha = 1-Math.abs(((mfad/100/Math.ceil(_.carousel.maxItems/ha))*d));
				else
					switch(_.carousel.horizontal) {
						case "center":
							tr.autoAlpha = Math.abs(d)<Math.ceil((_.carousel.maxItems/ha)-1) ? 1 : 1-(Math.abs(d)-Math.floor(Math.abs(d)));
						break;
						case "left":
							tr.autoAlpha = d<1 &&  d>0 ?  1-d : Math.abs(d)>_.carousel.maxItems-1 ? 1- (Math.abs(d)-(_.carousel.maxItems-1)) : 1;
						break;
						case "right":
							tr.autoAlpha = d>-1 &&  d<0 ?  1-Math.abs(d) : d>_.carousel.maxItems-1 ? 1- (Math.abs(d)-(_.carousel.maxItems-1)) : 1;
						break;
					}
			else
				tr.autoAlpha = Math.abs(d)<Math.ceil((_.carousel.maxItems/ha)) ? 1 : 0;

			if (_.carousel.scale && _.carousel.scaleDown!==undefined && sdown >0) {
				if (_.carousel.varyScale)
					tr.scale = 1- Math.abs(((sdown/100/Math.ceil(_.carousel.maxItems/ha))*d));
				else
					tr.scale = d*side>=1 || d*side<=-1 ? 1 - sdown/100 : (100-( sdown*Math.abs(d)))/100;
				 scaleoffset = d * (tr.width - tr.width*tr.scale)/2;
			} else
			tr.scale = 1;

			// ROTATION FUNCTIONS
			if (_.carousel.rotation && _.carousel.maxRotation!==undefined && Math.abs(mrot)!=0)	{
				if (_.carousel.varyRotate) {
					tr.rotationY = Math.abs(mrot) - Math.abs((1-Math.abs(((1/Math.ceil(_.carousel.maxItems/ha))*d))) * mrot);
					tr.autoAlpha = Math.abs(tr.rotationY)>90 ? 0 : tr.autoAlpha;
				} else {
					tr.rotationY = d*side>=1 || d*side<=-1 ?  mrot : Math.abs(d)*mrot;
				}
				tr.rotationY = tr.rotationY*side*-1;
			} else {
				tr.rotationY = 0;
			}

			// ADD EXTRA SPACE ADJUSTEMENT IF COVER MODE IS SELECTED
			if (tr.scale!==undefined && tr.scale!==1) tr.left = side<0 ? tr.left + scaleoffset : tr.left - scaleoffset;

			// ZINDEX ADJUSTEMENT
			tr.zIndex = Math.round(100-Math.abs(d*5));

			tr.force3D = true;
			// TRANSFORM STYLE
			tr.transformStyle =  "flat";
			tr.transformPerspective = 1200;
			tr.transformOrigin = "50% "+_.carousel.vertical;

			punchgs.TweenLite.set(fc,tr);

			side = side * -1;

		}
	}

	/*
	UPDATE SLIDER TO ASPECT RATIO
	*/
	/*
	function updateSliderToAspectRatio(e,d) {
		if (d.val===undefined || d.val===0) return;

		var ar = 1;
		if (jQuery.isNumeric(d.val)) {
			ar = d.val;
		} else
		if (d.val.indexOf(":")>0) {

			var arl = parseFloat(d.val.split(":")[0]),
				arr = parseFloat(d.val.split(":")[1]);
			if (jQuery.isNumeric(arl) && jQuery.isNumeric(arr))
				ar = arl / arr;
			else
				return;
		} else {
			ar = parseFloat(d.val);
			if (!jQuery.isNumeric(ar)) return;
		}
		if (ar==="NaN" || isNaN(ar)) return;

		RVS.SLIDER.settings.size.height[RVS.screen] = Math.round(RVS.SLIDER.settings.size.width[RVS.screen] / ar);
		setSlidesDimension(true);

		// var newState = new Option("245","245",true,true);
		// jQuery('#sr_setARTo').append(newState);

		jQuery('#sr_setARTo').val("245").trigger("change.select2RS");

	}
	*/

	/*
	UPDATE SLIDER BACKGROUND
	*/
	function setSliderBG() {
		punchgs.TweenLite.set(_ulinner,{backgroundImage:""});

		var _ = RVS.SLIDER.settings,
			sbg = window.RSColor.get(_.layout.bg.color);

		//BG COLOR OF SLIDER
		if (sbg.indexOf("gradient")>=0)
			punchgs.TweenLite.set(_ulinner,{background:sbg});
		else
			punchgs.TweenLite.set(_ulinner,{backgroundColor:sbg});

		//BG IMAGE OF THE SLIDER
		if (_.layout.bg.useImage)
			punchgs.TweenLite.set(_ulinner,{backgroundPosition:_.layout.bg.position, "background-size":_.layout.bg.fit, backgroundRepeat:_.layout.bg.repeat,backgroundImage:"url("+_.layout.bg.image+")"});

		// MANAGE SHADOWS
		jQuery('#slider_overlay').attr('class',_.layout.bg.dottedOverlay);
	}

	/*
	UPDATE SLIDER PROGRESS BAR
	*/
	function setProgressBar() {
		var p = jQuery('#rev_progress_bar_wrap');

		if (RVS.SLIDER.settings.general.progressbar.set && RVS.SLIDER.settings.type!=="hero") {
			punchgs.TweenLite.set(p,{/* height:_.height+"px",top:(RVS.SLIDER.settings.general.progressbar.position==="top" ? "0px" : "auto"), */
													bottom:(RVS.SLIDER.settings.general.progressbar.position==="bottom" ? "0px" : "auto"),
													top:(RVS.SLIDER.settings.general.progressbar.position==="top" ? "65px" : "auto"),
													height:RVS.SLIDER.settings.general.progressbar.height,
													background:window.RSColor.get(RVS.SLIDER.settings.general.progressbar.color)});
			p.removeClass("deactivated");
		} else
			p.addClass("deactivated");
	}


	/*
	EDIT / CANCEL A COLOR VALUE (SHOW LIVE THE CHANGES)
	*/
	function colorEditSlider(e,inp, val) {
		var canceled = false;
		if (inp!==undefined)
			window.lastColorEditjObj = jQuery(inp);
		else {
			if (window.lastColorEditjObj!==undefined)
				val = window.RSColor.get(window.lastColorEditjObj.val());
			canceled = true;
		}
		if (val===undefined) return;

		// STYLE CHANGES -> REWRITE STYLE TAG IN CONTAINER !!!
		if (window.lastColorEditjObj[0].dataset.navcolor==1)
			RVS.F.drawNavigation({type:window.lastColorEditjObj[0].dataset.evtparam,color:val,attribute:window.lastColorEditjObj[0].name});
		else

		switch (window.lastColorEditjObj[0].name) {
			case "sliderprogresscolor":
				punchgs.TweenLite.set(jQuery('#rev_progress_bar_wrap'),{background:val});
			break;
			case "sliderbgcolor":
			//BG COLOR OF SLIDER
				if (canceled) setSliderBG();
					else
				punchgs.TweenLite.set(_ul,{background:val});
			break;
			case "sliderTabBgColor":
				RVS.F.bgUpdate("tabs", val);
			break;
			case "sliderThumbBgColor":
				RVS.F.bgUpdate("thumbs", val);
			break;
			case "module_spinner_color":
				setSpinnerColors(val);
			break;
		}


	}


	function getNewSliderObject(obj) {
		var newSlider = {};

		/* SLIDE ADDONS */
		newSlider.addOns = RVS.F.safeExtend(true,{},obj.addOns) || {};

		/* VERSION CHECK */
		newSlider.version = _d(obj.version,"6.0.0");
		newSlider.version = newSlider.version<"6.0.0" ? "6.0.0" : newSlider.version;

		/* SLIDER BASICS */
		newSlider.alias = _d(obj.alias,"");
		newSlider.shortcode = _d(obj.shortcode,"");
		newSlider.type = _d(obj.type,"standard");
		newSlider.layouttype = _d(obj.layouttype,"fullwidth");
		newSlider.sourcetype= _d(obj.sourcetype,"gallery");
		newSlider.title = _d(obj.title,"New Slider");
		newSlider.googleFont = _d(obj.googleFont,[]);
		newSlider.id = _d(obj.id,"");
		newSlider.class = _d(obj.class,"");
		newSlider.wrapperclass = _d(obj.wrapperclass,"");

		/* SLIDER SOURCE */
		newSlider.source = _d(obj.source,{
			gallery:{},
			post:{
				excerptLimit:55,
				maxPosts:30,
				fetchType:"cat_tag"	,
				category:"",
				sortBy:"ID",
				types:"post",
				list:"",
				sortDirection:"DESC",
				subType:"post"
			},
			woo:{
				excerptLimit:55,
				maxProducts:30,
				featuredOnly:false,
				inStockOnly:false,
				category:"",
				sortBy:"ID",
				types:"product",
				sortDirection:"DESC",
				regPriceFrom:"",
				regPriceTo:"",
				salePriceFrom:"",
				salePriceTo:""
			},
			instagram:{
				count:"",
				hashTag:"",
				transient:1200,
				type:"user",
				userId:""
			},
			facebook:{
				album:"",
				appId:"",
				appSecret:"",
				count:"",
				pageURL:"",
				transient:1200,
				typeSource:"album"
			},
			flickr:{
				apiKey:"",
				count:"",
				galleryURL:"",
				groupURL:"",
				photoSet:"",
				transient:1200,
				type:"publicphotos",
				userURL:""
			},
			twitter:{
				accessSecret:"",
				accessToken:"",
				consumerKey:"",
				consumerSecret:"",
				count:"",
				excludeReplies:false,
				imageOnly:false,
				includeRetweets:false,
				transient:1200,
				userId:""
			},
			vimeo:{
				albumId:"",
				channelName:"",
				count:"",
				transient:1200,
				groupName:"",
				typeSource:"user",
				userName:""
			},
			youtube:{
				api:"",
				channelId:"",
				count:"",
				playList:"",
				transient:1200,
				typeSource:"channel"
			}
		});

		/* SLIDER DEFAULTS */
		newSlider.def = _d(obj.def,{
			intelligentInherit:true,
			autoResponsive:true,
			responsiveChilds:true,
			responsiveOffset:true,
			transition:"fade",
			transitionDuration:300,
			delay:9000,
			background:{
				fit:"cover",
				fitX:100,
				fitY:100,
				position:"center center",
				positionX:0,
				positionY:0,
				repeat:"no-repeat",
				imageSourceType:"full"
			},
			panZoom:{
				set:false,
				blurStart:0,
				blurEnd:0,
				duration:10000,
				ease:"Linear.easeNone",
				fitEnd:100,
				fitStart:100,
				xEnd:0,
				yEnd:0,
				xStart:0,
				yStart:0,
				rotateStart:0,
				rotateEnd:0
			}
		});

		newSlider.def.intelligentInherit = newSlider.def.intelligentInherit===undefined ? true : newSlider.def.intelligentInherit;
		newSlider.def.autoResponsive = newSlider.def.autoResponsive===undefined ? true : newSlider.def.autoResponsive;
		newSlider.def.responsiveChilds = newSlider.def.responsiveChilds===undefined ? true : newSlider.def.responsiveChilds;
		newSlider.def.responsiveOffset = newSlider.def.responsiveOffset===undefined ? true : newSlider.def.responsiveOffset;

		/* SLIDER SIZE */
		newSlider.size = _d(obj.size,{
			respectAspectRatio:false,
			disableForceFullWidth:false,
			custom:{d:true,n:false,t:false,m:false},
			minHeightFullScreen:"",
			minHeight:"",
			maxWidth:0,
			maxHeight:0,
			fullScreenOffsetContainer:"",
			fullScreenOffset:"",
			width:{d:1240,n:1024,t:778,m:480},
			height:{d:900,n:768,t:960,m:720},
			editorCache:{d:0,n:0,t:0,m:0},
			overflow:false,
			gridEQModule:false,
			forceOverflow:false,
			keepBPHeight:false
		});
		newSlider.size.editorCache = newSlider.size.editorCache===undefined ? {d:0, n:0, t:0, m:0} : newSlider.size.editorCache;
		newSlider.size.editorCache.d = newSlider.size.editorCache.d === 0 ? newSlider.size.height.d : newSlider.size.editorCache.d;
		newSlider.size.editorCache.n = newSlider.size.editorCache.n === 0 ? newSlider.size.height.n : newSlider.size.editorCache.n;
		newSlider.size.editorCache.t = newSlider.size.editorCache.t === 0 ? newSlider.size.height.t : newSlider.size.editorCache.t;
		newSlider.size.editorCache.m = newSlider.size.editorCache.m === 0 ? newSlider.size.height.m : newSlider.size.editorCache.m;

		/* SLIDER CODES */
		newSlider.codes = _d(obj.codes,{
			css:"",
			javascript:""
		});

		/* CAROUSEL SETTINGS */
		newSlider.carousel = _d(obj.carousel,{
			borderRadius:0,
			borderRadiusUnit:"px",
			ease:"Power3.easeInOut",
			fadeOut:true,
			scale:false,
			horizontal:"center",
			vertical:"center",
			infinity:false,
			maxItems:3,
			maxRotation:0,
			maxOpacity:100,
			paddingTop:0,
			paddingBottom:0,
			rotation:false,
			scaleDown:50,
			space:0,
			speed:800,
			stretch:false,
			varyFade:false,
			varyRotate:false,
			varyScale:false	,
			showAllLayers:false
		});

		/* HERO SETTINGS */
		newSlider.hero = _d(obj.hero,{
			activeSlide:-1
		});

		/* SLIDER LAYOUT  - BG, LOADER, POSITION */
		newSlider.layout = _d(obj.layout,{
			bg:{
				color:"transparent",
				padding:0,
				dottedOverlay:"none",
				shadow:0,
				useImage:false,
				image:"",
				fit:"cover",
				position:"center center",
				repeat:"no-repeat"
			},
			spinner:{
				color:"#ffffff",
				type:"0"

			},
			position:{
				marginTop:0,
				marginBottom:0,
				marginLeft:0,
				marginRight:0,
				align:"center",
				fixedOnTop:false,
				addClear:false
			},


		});

		/* SLIDER VISIBILITY */
		newSlider.visibility = _d(obj.visibility,{
			hideSelectedLayersUnderLimit:0,
			hideAllLayersUnderLimit:0,
			hideSliderUnderLimit:0
		});


		/* GENERAL SETTINGS */
		newSlider.general = _d(obj.general,{
			slideshow:{
				slideShow:true,
				stopOnHover:false,
				stopSlider:false,
				stopAfterLoops:0,
				stopAtSlide:1,
				shuffle:false,
				loopSingle:false,
				viewPort:false,
				viewPortStart:"wait",
				viewPortArea:RVS.F.cToResp({default:"200px"}),
				presetSliderHeight:false,
				initDelay:0,
				waitForInit:false
			},
			progressbar:{
				set:false,
				height:5,
				position:"bottom",
				color:'rgba(255,255,255,0.5)'
			},
			firstSlide:{
				set:false,
				duration:300,
				slotAmount:7,
				type:"fade",
				alternativeFirstSlideSet:false,
				alternativeFirstSlide:1
			},
			layerSelection:false,
			lazyLoad:"none",
			nextSlideOnFocus:false,
			disableFocusListener:false,
			disableOnMobile:false,
			autoPlayVideoOnMobile:true,
			disablePanZoomMobile:false,
			useWPML:false
		});
		if (typeof newSlider.general.slideshow.viewPortArea!=="object") newSlider.general.slideshow.viewPortArea = RVS.F.cToResp({default:newSlider.general.slideshow.viewPortArea});
		//newSlider.general.slideshow.slideShow =  (newSlider.general.slideshow.stopSlider===true && (newSlider.general.stopAfterLoops===0 || newSlider.general.stopAfterLoops===undefined) && (newSlider.general.stopAtSlide===1 || newSlider.general.stopAtSlide===undefined)) ? false : true;
		/* SLIDER NAVIGATION */
		newSlider.nav = _d(obj.nav,{
			preview:{
				width:50,
				height:100
			},
			swipe:{
				set:false,
				setOnDesktop:false,
				blockDragVertical:false,
				direction:"horizontal",
				minTouch:1,
				velocity:75
			},
			keyboard:{
				direction:"horizontal",
				set:false
			},
			mouse:{
				set:'off',
				reverse:"default"
			},
			arrows:{
				set:false,
				rtl:false,
				animSpeed:"1000ms",
				animDelay:"1000ms",
				style:"1000",
				preset:"default",
				presets:{},
				alwaysOn:true,
				hideDelay:200,
				hideDelayMobile:1200,
				hideOver:false,
				hideOverLimit:0,
				hideUnder:false,
				hideUnderLimit:778,
				left:{
					anim:"fade",
					horizontal:"left",
					vertical:"center",
					offsetX:30,
					offsetY:0,
					align:"slider"
				},
				right:{
					anim:"fade",
					horizontal:"right",
					vertical:"center",
					offsetX:30,
					offsetY:0,
					align:"slider"
				}

			},
			thumbs:{
				anim:"fade",
				animSpeed:"1000ms",
				animDelay:"1000ms",
				set:false,
				rtl:false,
				style:"2000",
				preset:"default",
				presets:{},
				alwaysOn:true,
				hideDelay:200,
				hideDelayMobile:1200,
				hideOver:false,
				hideOverLimit:0,
				hideUnder:false,
				hideUnderLimit:778,
				spanWrapper:false,
				horizontal:"center",
				vertical:"bottom",
				amount:5,
				direction:"horizontal",
				height:50,
				width:100,
				widthMin:100,
				innerOuter:"inner",
				offsetX:0,
				offsetY:20,
				space:5,
				align:"slider",
				padding:5,
				wrapperColor:"transparent"
			},
			tabs:{
				anim:"fade",
				animSpeed:"1000ms",
				animDelay:"1000ms",
				set:false,
				rtl:false,
				style:"4000",
				preset:"default",
				presets:{},
				alwaysOn:true,
				hideDelay:200,
				hideDelayMobile:1200,
				hideOver:false,
				hideOverLimit:0,
				hideUnder:false,
				hideUnderLimit:778,
				spanWrapper:false,
				horizontal:"center",
				vertical:"bottom",
				amount:5,
				direction:"horizontal",
				height:50,
				width:100,
				widthMin:100,
				innerOuter:"inner",
				offsetX:0,
				offsetY:20,
				space:5,
				align:"slider",
				padding:5,
				wrapperColor:"transparent"
			},
			bullets:{
				anim:"fade",
				animSpeed:"1000ms",
				animDelay:"1000ms",
				set:false,
				rtl:false,
				style:"3000",
				preset:"default",
				presets:{},
				alwaysOn:true,
				horizontal:"center",
				vertical:"bottom",
				direction:"horizontal",
				offsetX:0,
				offsetY:20,
				align:"slider",
				space:5,
				/* alwaysOn:false, */
				hideDelay:200,
				hideDelayMobile:1200,
				hideOver:false,
				hideOverLimit:0,
				hideUnder:false,
				hideUnderLimit:778,
			}
		});

		/* TROUBLESHOOTING & FALLBACKS */
		newSlider.troubleshooting = _d(obj.troubleshooting,{
			ignoreHeightChanges:false,
			ignoreHeightChangesUnderLimit:0,
			alternateImageType:"off",
			alternateURL:"",
			jsNoConflict:false,
			jsInBody:false,
			outPutFilter:"none",
			simplify_ie8_ios4:false
		});

		/* PARALLAX SETTINGS */
		newSlider.parallax = _d(obj.parallax,{
			set:false,
			setDDD:false,
			disableOnMobile:false,
			levels:[5,10,15,20,25,30,35,40,45,46,47,48,49,50,51,30],
			ddd:{
				BGFreeze:false,
				layerOverflow:false,
				overflow:false,
				shadow:false,
				zCorrection:65
			},
			mouse:{
				speed:0,
				bgSpeed:0,
				layersSpeed:0,
				origo:"slideCenter",
				type:"scroll"
			}
		});

		/* SLIDER AS MODAL */
		newSlider.modal = _d(obj.modal,{
			bodyclass:"",
			horizontal:"center",
			vertical:"middle",
			cover:true,
			coverColor:"rgba(0,0,0,0.5)"
		});

		/* SCROLLEFFECTS */
		newSlider.scrolleffects = _d(obj.scrolleffects,{
			set:false,
			setBlur:false,
			setFade:false,
			setGrayScale:false,
			bg:false,
			direction:"both",
			layers:false,
			maxBlur:10,
			multiplicator:"1.3",
			multiplicatorLayers:"1.3",
			disableOnMobile:false,
			parallaxLayers:false,
			staticLayers:false,
			staticParallaxLayers:false,
			tilt:30
		});

		/* SCROLL TIMELINE */
		newSlider.scrolltimeline = _d(obj.scrolltimeline,{
			set:false,
			fixed:false,
			fixedStart:2000,
			fixedEnd:4000,
			layers:false,
			ease:"Linear.easeNone",
			speed:500
		});

		/* Access Permissions */

		newSlider.use_access_permissions = _d(obj.use_access_permissions, false);
		newSlider.allow_groups = {};
		if (obj.allow_groups) {
			for (var i in obj.allow_groups) if (obj.allow_groups.hasOwnProperty(i)) {
				if (typeof obj.allow_groups[i] == 'number') {
					newSlider.allow_groups['group' + obj.allow_groups[i]] = true;
				} else {
					newSlider.allow_groups[i] = obj.allow_groups[i];
				}
			}
		}

		// MIGRATION ISSUES FIX
		newSlider.source.post.fetchType=newSlider.source.post.fetchType===undefined ? "cat_tag" : newSlider.source.post.fetchType;
		newSlider.source.instagram.hashTag=newSlider.source.instagram.hashTag===undefined ? "" : newSlider.source.instagram.hashTag;
		newSlider.source.instagram.transient=newSlider.source.instagram.transient===undefined ? 1200 : newSlider.source.instagram.transient;
		newSlider.source.instagram.type=newSlider.source.instagram.type===undefined ? "" : newSlider.source.instagram.type;
		newSlider.source.flickr.transient=newSlider.source.flickr.transient===undefined ? 1200 : newSlider.source.flickr.transient;
		newSlider.source.vimeo.transient=newSlider.source.vimeo.transient===undefined ? 1200 : newSlider.source.vimeo.transient;
		newSlider.source.youtube.transient=newSlider.source.youtube.transient===undefined ? 1200 : newSlider.source.youtube.transient;
		newSlider.def.transition=newSlider.def.transition===undefined ? "fade" : newSlider.def.transition;
		newSlider.def.background.imageSourceType=newSlider.def.background.imageSourceType===undefined ? "full" : newSlider.def.background.imageSourceType;
		newSlider.def.panZoom.blurStart=newSlider.def.panZoom.blurStart===undefined ? 0 : newSlider.def.panZoom.blurStart;
		newSlider.def.panZoom.blurEnd=newSlider.def.panZoom.blurEnd===undefined ? 0 : newSlider.def.panZoom.blurEnd;
		newSlider.size.maxWidth=newSlider.size.maxWidth===undefined ? "" : newSlider.size.maxWidth;
		newSlider.carousel.ease=newSlider.carousel.ease===undefined ? "Power3.easeInOut" : newSlider.carousel.ease;
		newSlider.carousel.speed=newSlider.carousel.speed===undefined ? "800" : newSlider.carousel.speed;
		newSlider.general.firstSlide.alternativeFirstSlideSet=newSlider.general.firstSlide.alternativeFirstSlideSet===undefined ? "" : newSlider.general.firstSlide.alternativeFirstSlideSet;
		if (newSlider.nav.preview) newSlider.nav.preview.width=newSlider.nav.preview.width===undefined ? 50 : newSlider.nav.preview.width;
		if (newSlider.nav.preview) newSlider.nav.preview.height=newSlider.nav.preview.height===undefined ? 100 : newSlider.nav.preview.height;
		if (newSlider.nav.mouse) newSlider.nav.mouse.reverse=newSlider.nav.mouse.reverse===undefined ? "default" : newSlider.nav.mouse.reverse;
		if (newSlider.nav.arrows.left) newSlider.nav.arrows.left.align=newSlider.nav.arrows.left.align===undefined ? "slider" : newSlider.nav.arrows.left.align;
		if (newSlider.nav.arrows.right) newSlider.nav.arrows.right.align=newSlider.nav.arrows.right.align===undefined ? "slider" : newSlider.nav.arrows.right.align;
		if (newSlider.nav.bullets) newSlider.nav.bullets.align=newSlider.nav.bullets.align===undefined ? "slider" : newSlider.nav.bullets.align;
		newSlider.troubleshooting.ignoreHeightChangesUnderLimit=newSlider.troubleshooting.ignoreHeightChangesUnderLimit===undefined ? 0 : newSlider.troubleshooting.ignoreHeightChangesUnderLimit;
		newSlider.parallax.ddd.zCorrection=newSlider.parallax.ddd.zCorrection===undefined ? 65 : newSlider.parallax.ddd.zCorrection;
		newSlider.parallax.mouse.bgSpeed=newSlider.parallax.mouse.bgSpeed===undefined ? 0 : newSlider.parallax.mouse.bgSpeed;
		newSlider.parallax.mouse.layersSpeed=newSlider.parallax.mouse.layersSpeed===undefined ? 1000 : newSlider.parallax.mouse.layersSpeed;
		newSlider.scrolleffects.bg=newSlider.scrolleffects.bg===undefined ? false : newSlider.scrolleffects.bg;
		newSlider.scrolleffects.direction=newSlider.scrolleffects.direction===undefined ? "both" : newSlider.scrolleffects.direction;
		newSlider.scrolleffects.maxBlur=newSlider.scrolleffects.maxBlur===undefined ? 10 : newSlider.scrolleffects.maxBlur;
		newSlider.scrolleffects.multiplicator=newSlider.scrolleffects.multiplicator===undefined ? "1.3" : newSlider.scrolleffects.multiplicator;
		newSlider.scrolleffects.multiplicatorLayers=newSlider.scrolleffects.multiplicatorLayers===undefined ? "1.3" : newSlider.scrolleffects.multiplicatorLayers;

		newSlider.scrolleffects.tilt=newSlider.scrolleffects.tilt===undefined ? "" : newSlider.scrolleffects.tilt;

		//GET RID OF UNDEFINED OBJECTS !
		/*console.log("------------  FOUND UNDEFINED VALUES IN SLIDER SETTINGS -------------------")
		console.log(newSlider);
		RVS.F.findUndefineds(newSlider);
		console.log("---------------------------------------------------------------------------");*/



		//if (newSlider.nav.arrows.preset==="custom") addSessionStartNavigation({obj:newSlider.nav.arrows,type:"arrows"});


		/*if (newSlider.nav.bullets.preset==="custom") newSlider.nav.bullets.presetsBackup = RVS.F.safeExtend({},newSlider.nav.bullets.presets,true);
		if (newSlider.nav.thumbs.preset==="custom") newSlider.nav.thumbs.presetsBackup = RVS.F.safeExtend({},newSlider.nav.thumbs.presets,true);
		if (newSlider.nav.tabs.preset==="custom") newSlider.nav.tabs.presetsBackup = RVS.F.safeExtend({},newSlider.nav.tabs.presets,true);
		*/


		return newSlider;
	}



	/***********************************
			INTERNAL FUNCTIONS
	************************************/


	/*
	SET VALUE TO A OR B DEPENDING IF VALUE A EXISTS AND NOT UNDEFINED OR NULL
	*/
	function _d(a,b) {
		if (a===undefined || a===null)
			return b;
		else
			return a;
	}

	function _truefalse(v) {
		if (v==="false" || v===false || v==="off" || v===undefined || v===0 || v===-1)
			v=false;
		else
		if (v==="true" || v===true || v==="on")
			v=true;
		return v;
	}

})();

})($nwd_jQuery);