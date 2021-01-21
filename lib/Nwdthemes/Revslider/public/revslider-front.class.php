<?php
/**
 * @author    ThemePunch <info@themepunch.com>
 * @link      https://www.themepunch.com/
 * @copyright 2019 ThemePunch
 */

class RevSliderFront extends RevSliderFunctions {

	const TABLE_BACKUP			 = 'nwdrevslider/backup';
	const TABLE_SLIDER			 = 'nwdrevslider/sliders';
	const TABLE_SLIDES			 = 'nwdrevslider/slides';
	const TABLE_STATIC_SLIDES	 = 'nwdrevslider/static';
	const TABLE_CSS				 = 'nwdrevslider/css';
	const TABLE_LAYER_ANIMATIONS = 'nwdrevslider/animations';
	const TABLE_NAVIGATIONS		 = 'nwdrevslider/navigations';
	const TABLE_SETTINGS		 = 'nwdrevslider/settings'; //existed prior 5.0 and still needed for updating from 4.x to any version after 5.x
	const CURRENT_TABLE_VERSION	 = '1.0.8';

	const YOUTUBE_ARGUMENTS		 = 'hd=1&amp;wmode=opaque&amp;showinfo=0&amp;rel=0';
	const VIMEO_ARGUMENTS		 = 'title=0&amp;byline=0&amp;portrait=0&amp;api=1';

	public function __construct(){
		Mage::helper('nwdrevslider/framework')->add_action('wp_enqueue_scripts', array('RevSliderFront', 'add_actions'));
	}


	/**
	 * START: DEPRECATED FUNCTIONS THAT ARE IN HERE FOR OLD ADDONS TO WORK PROPERLY
	 **/

	/**
	 * old version of add_admin_bar();
	 **/
	public static function putAdminBarMenus(){
		return RevSliderFront::add_admin_bar();
	}

	/**
	 * END: DEPRECATED FUNCTIONS THAT ARE IN HERE FOR OLD ADDONS TO WORK PROPERLY
	 **/

	/**
	 * Add all actions that the frontend needs here
	 **/
	public static function add_actions(){

		$func		= new RevSliderFunctions();
		$css		= new RevSliderCssParser();
		$rs_ver		= Mage::helper('nwdrevslider/framework')->apply_filters('revslider_remove_version', Nwdthemes_Revslider_Helper_Framework::RS_REVISION);
		$global		= $func->get_global_settings();
		$inc_global = $func->_truefalse($func->get_val($global, 'allinclude', true));
		$inc_footer = $func->_truefalse($func->get_val($global, array('script', 'footer'), false));

		$custom_css = $func->get_static_css();
		$custom_css = $css->compress_css($custom_css);

		if(trim($custom_css) == ''){
			$custom_css = '#rs-demo-id {}';
		}

		Mage::helper('nwdrevslider/framework')->wp_add_inline_style('rs-plugin-settings', $custom_css);

		Mage::helper('nwdrevslider/framework')->add_action('wp_head', array('RevSliderFront', 'add_meta_generator'));
		Mage::helper('nwdrevslider/framework')->add_action('wp_head', array('RevSliderFront', 'js_set_start_size'), 99);
		Mage::helper('nwdrevslider/framework')->add_action('admin_head', array('RevSliderFront', 'js_set_start_size'), 99);
		Mage::helper('nwdrevslider/framework')->add_action('wp_footer', array('RevSliderFront', 'load_icon_fonts'));
		Mage::helper('nwdrevslider/framework')->add_action('wp_footer', array('RevSliderFront', 'load_google_fonts'));

		//Async JS Loading
		if($func->_truefalse($func->get_val($global, array('script', 'defer'), false)) === true){
			Mage::helper('nwdrevslider/framework')->add_filter('clean_url', array('RevSliderFront', 'add_defer_forscript'), 11, 1);
		}

		Mage::helper('nwdrevslider/framework')->add_action('wp_before_admin_bar_render', array('RevSliderFront', 'add_admin_menu_nodes'));
		Mage::helper('nwdrevslider/framework')->add_action('wp_footer', array('RevSliderFront', 'add_admin_bar'), 99);
	}


	/**
	 * Add Meta Generator Tag in FrontEnd
	 * @since: 5.0
	 */
	public static function add_meta_generator(){
		echo Mage::helper('nwdrevslider/framework')->apply_filters('revslider_meta_generator', '<meta name="generator" content="Powered by Slider Revolution ' . Nwdthemes_Revslider_Helper_Framework::RS_REVISION . ' - responsive, Mobile-Friendly Slider Plugin for WordPress with comfortable drag and drop interface." />' . "\n");
	}

	/**
	 * Load Used Icon Fonts
	 * @since: 5.0
	 */
	public static function load_icon_fonts(){
		global $fa_var, $fa_icon_var, $pe_7s_var;
		$func	= new RevSliderFunctions();
		$global	= $func->get_global_settings();
		$ignore_fa = $func->_truefalse($func->get_val($global, 'fontawesomedisable', false));

		if($ignore_fa === false && ($fa_icon_var == true || $fa_var == true)){
			echo "<link rel='stylesheet' property='stylesheet' id='rs-icon-set-fa-icon-css' href='" . Nwdthemes_Revslider_Helper_Framework::$RS_PLUGIN_URL . "public/assets/fonts/font-awesome/css/font-awesome.css' type='text/css' media='all' />\n";
		}

		if($pe_7s_var){
			echo "<link rel='stylesheet' property='stylesheet' id='rs-icon-set-pe-7s-css' href='" . Nwdthemes_Revslider_Helper_Framework::$RS_PLUGIN_URL . "public/assets/fonts/pe-icon-7-stroke/css/pe-icon-7-stroke.css' type='text/css' media='all' />\n";
		}
	}


	/**
	 * Load Used Google Fonts
	 * add google fonts of all sliders found on the page
	 * @since: 6.0
	 */
	public static function load_google_fonts(){
		$func	= new RevSliderFunctions();
		$fonts	= $func->print_clean_font_import();
		if(!empty($fonts)){
			echo $fonts."\n";
		}
	}


	/**
	 * add admin menu points in ToolBar Top
	 * @since: 5.0.5
	 * @before: putAdminBarMenus()
	 */
	public static function add_admin_bar(){
		if(!Mage::helper('nwdrevslider/framework')->is_super_admin() || !Mage::helper('nwdrevslider/framework')->is_admin_bar_showing()){
			return;
		}

		?>
        <script type="text/javascript">
            (function(jQuery) {
			jQuery(document).ready(function(){
				if(jQuery('#wp-admin-bar-revslider-default').length > 0 && jQuery('rs-module-wrap').length > 0){
					var aliases = new Array();
					jQuery('rs-module-wrap').each(function(){
						aliases.push(jQuery(this).data('alias'));
					});

					if(aliases.length > 0){
						jQuery('#wp-admin-bar-revslider-default li').each(function(){
							var li = jQuery(this),
								t = jQuery.trim(li.find('.ab-item .rs-label').data('alias')); //text()

							if(jQuery.inArray(t,aliases)!=-1){
							}else{
								li.remove();
							}
						});
					}
				}else{
					jQuery('#wp-admin-bar-revslider').remove();
				}
            });
            })($nwd_jQuery);
		</script>
		<?php
}

	/**
	 * add admin nodes
	 * @since: 5.0.5
	 */
	public static function add_admin_menu_nodes(){
		if(!Mage::helper('nwdrevslider/framework')->is_super_admin() || !Mage::helper('nwdrevslider/framework')->is_admin_bar_showing()){
			return;
		}

		self::_add_node('<span class="rs-label">Slider Revolution</span>', false, Mage::helper('nwdrevslider/framework')->admin_url('admin.php?page=revslider'), array('class' => 'revslider-menu'), 'revslider'); //<span class="wp-menu-image dashicons-before dashicons-update"></span>

		//add all nodes of all Slider
		$sl = new RevSliderSlider();
		$sliders = $sl->get_slider_for_admin_menu();

		if(!empty($sliders)){
			foreach ($sliders as $id => $slider){
				self::_add_node('<span class="rs-label" data-alias="' . Mage::helper('nwdrevslider/framework')->esc_attr($slider['alias']) . '">' . Mage::helper('nwdrevslider/framework')->esc_html($slider['title']) . '</span>', 'revslider', Mage::helper('nwdrevslider/framework')->admin_url('admin.php?page=revslider&view=slide&id=slider-'.$id), array('class' => 'revslider-sub-menu'), Mage::helper('nwdrevslider/framework')->esc_attr($slider['alias'])); //<span class="wp-menu-image dashicons-before dashicons-update"></span>
			}
		}
	}

	/**
	 * add admin node
	 * @since: 5.0.5
	 */
	public static function _add_node($title, $parent = false, $href = '', $custom_meta = array(), $id = ''){
		if(!Mage::helper('nwdrevslider/framework')->is_super_admin() || !Mage::helper('nwdrevslider/framework')->is_admin_bar_showing()){
			return;
		}

		$id = ($id == '') ? strtolower(str_replace(' ', '-', $title)) : $id;

		//links from the current host will open in the current window
		$meta = (strpos($href, site_url()) !== false) ? array() : array('target' => '_blank'); //external links open in new tab/window
		$meta = array_merge($meta, $custom_meta);

		global $wp_admin_bar;
		$wp_admin_bar->add_node(array('parent'=> $parent, 'id' => $id, 'title' => $title, 'href' => $href, 'meta' => $meta));
	}

	/**
	 * adds async loading
	 * @since: 5.0
	 */
	public static function add_defer_forscript($url){
		if(strpos($url, 'rs6.min.js') === false && strpos($url, 'revolution.tools.min.js') === false){
			return $url;
		} elseif(Mage::helper('nwdrevslider/framework')->is_admin()){
			return $url;
		}else{
			return $url . "' defer='defer";
		}
	}

	/**
	 * Add functionality to gutenberg, elementar, visual composer and so on
	 **/
	public static function add_post_editor(){
		/**
		 * Page Editor Extensions
		 **/
		if(function_exists('is_user_logged_in') && Mage::helper('nwdrevslider/framework')->is_user_logged_in()){
			//only include gutenberg for production
			if(Mage::helper('nwdrevslider/framework')->is_admin()){
				include_once(ABSPATH . 'wp-admin/includes/plugin.php');
				if(function_exists('is_plugin_active') && !Mage::helper('nwdrevslider/framework')->is_plugin_active('revslider-gutenberg/plugin.php')){
					require_once(Nwdthemes_Revslider_Helper_Framework::$RS_PLUGIN_PATH . 'admin/includes/shortcode_generator/gutenberg/gutenberg-block.php');
					new RevSliderGutenberg('gutenberg/');
				}
			}

			require_once(Nwdthemes_Revslider_Helper_Framework::$RS_PLUGIN_PATH . 'admin/includes/shortcode_generator/shortcode_generator.class.php');

			//Shortcode Wizard Includes
			Mage::helper('nwdrevslider/framework')->add_action('vc_before_init', array('RevSliderShortcodeWizard', 'visual_composer_include')); //VC functionality
			Mage::helper('nwdrevslider/framework')->add_action('admin_enqueue_scripts', array('RevSliderShortcodeWizard', 'enqueue_scripts'));
		}

		//Elementor Functionality
		require_once(Nwdthemes_Revslider_Helper_Framework::$RS_PLUGIN_PATH . 'admin/includes/shortcode_generator/elementor/elementor.class.php');
		Mage::helper('nwdrevslider/framework')->add_action('init', array('RevSliderElementor', 'init'));
	}

	/**
	 * Add Meta Generator Tag in FrontEnd
	 * @since: 5.4.3
	 * @before: add_setREVStartSize()
		//NOT COMPRESSED VERSION
		function setREVStartSize(e){
			try {
				var pw = document.getElementById(e.c).parentNode.offsetWidth,
					newh;
				pw = pw===0 || isNaN(pw) ? window.innerWidth : pw;
				e.tabw = e.tabw===undefined ? 0 : parseInt(e.tabw);
				e.thumbw = e.thumbw===undefined ? 0 : parseInt(e.thumbw);
				e.tabh = e.tabh===undefined ? 0 : parseInt(e.tabh);
				e.thumbh = e.thumbh===undefined ? 0 : parseInt(e.thumbh);
				e.tabhide = e.tabhide===undefined ? 0 : parseInt(e.tabhide);
				e.thumbhide = e.thumbhide===undefined ? 0 : parseInt(e.thumbhide);
				e.mh = e.mh===undefined || e.mh=="" ? 0 : e.mh;
				if(e.layout==="fullscreen" || e.l==="fullscreen")
					newh = Math.max(e.mh,window.innerHeight);
				else{
					e.gw = Array.isArray(e.gw) ? e.gw : [e.gw];
					for (var i in e.rl) if (e.gw[i]===undefined || e.gw[i]===0) e.gw[i] = e.gw[i-1];
					e.gh = e.el===undefined || e.el==="" || (Array.isArray(e.el) && e.el.length==0)? e.gh : e.el;
					e.gh = Array.isArray(e.gh) ? e.gh : [e.gh];
					for (var i in e.rl) if (e.gh[i]===undefined || e.gh[i]===0) e.gh[i] = e.gh[i-1];

					var nl = new Array(e.rl.length),
						ix = 0,
						sl;
					e.tabw = e.tabhide>=pw ? 0 : e.tabw;
					e.thumbw = e.thumbhide>=pw ? 0 : e.thumbw;
					e.tabh = e.tabhide>=pw ? 0 : e.tabh;
					e.thumbh = e.thumbhide>=pw ? 0 : e.thumbh;
					for (var i in e.rl) nl[i] = e.rl[i]<window.innerWidth ? 0 : e.rl[i];
					sl = nl[0];
					for (var i in nl) if (sl>nl[i] && nl[i]>0) { sl = nl[i]; ix=i;}
					var m = pw>(e.gw[ix]+e.tabw+e.thumbw) ? 1 : (pw-(e.tabw+e.thumbw)) / (e.gw[ix]);
					newh =  (e.gh[ix] * m) + (e.tabh + e.thumbh);
				}
				if(window.rs_init_css===undefined) window.rs_init_css = document.head.appendChild(document.createElement("style"));
				document.getElementById(e.c).height = newh;
				window.rs_init_css.innerHTML += "#"+e.c+"_wrapper { height: "+newh+"px }";
			} catch(e){
				console.log("Failure at Presize of Slider:" + e)
			}
		  }
	 */
	public static function js_set_start_size(){
		$script = '<script type="text/javascript">';
		$script .= 'function setREVStartSize(a){try{var b,c=document.getElementById(a.c).parentNode.offsetWidth;if(c=0===c||isNaN(c)?window.innerWidth:c,a.tabw=void 0===a.tabw?0:parseInt(a.tabw),a.thumbw=void 0===a.thumbw?0:parseInt(a.thumbw),a.tabh=void 0===a.tabh?0:parseInt(a.tabh),a.thumbh=void 0===a.thumbh?0:parseInt(a.thumbh),a.tabhide=void 0===a.tabhide?0:parseInt(a.tabhide),a.thumbhide=void 0===a.thumbhide?0:parseInt(a.thumbhide),a.mh=void 0===a.mh||""==a.mh?0:a.mh,"fullscreen"===a.layout||"fullscreen"===a.l)b=Math.max(a.mh,window.innerHeight);else{for(var d in a.gw=Array.isArray(a.gw)?a.gw:[a.gw],a.rl)(void 0===a.gw[d]||0===a.gw[d])&&(a.gw[d]=a.gw[d-1]);for(var d in a.gh=void 0===a.el||""===a.el||Array.isArray(a.el)&&0==a.el.length?a.gh:a.el,a.gh=Array.isArray(a.gh)?a.gh:[a.gh],a.rl)(void 0===a.gh[d]||0===a.gh[d])&&(a.gh[d]=a.gh[d-1]);var e,f=Array(a.rl.length),g=0;for(var d in a.tabw=a.tabhide>=c?0:a.tabw,a.thumbw=a.thumbhide>=c?0:a.thumbw,a.tabh=a.tabhide>=c?0:a.tabh,a.thumbh=a.thumbhide>=c?0:a.thumbh,a.rl)f[d]=a.rl[d]<window.innerWidth?0:a.rl[d];for(var d in e=f[0],f)e>f[d]&&0<f[d]&&(e=f[d],g=d);var h=c>a.gw[g]+a.tabw+a.thumbw?1:(c-(a.tabw+a.thumbw))/a.gw[g];b=a.gh[g]*h+(a.tabh+a.thumbh)}void 0===window.rs_init_css&&(window.rs_init_css=document.head.appendChild(document.createElement("style"))),document.getElementById(a.c).height=b,window.rs_init_css.innerHTML+="#"+a.c+"_wrapper { height: "+b+"px }"}catch(a){console.log("Failure at Presize of Slider:"+a)}};';
		$script .= '</script>' . "\n";
		echo Mage::helper('nwdrevslider/framework')->apply_filters('revslider_add_setREVStartSize', $script);
	}

	/**
	 * sets the post saving value to true, so that the output echo will not be done
	 **/
	public static function set_post_saving(){
		global $revslider_save_post;
		$revslider_save_post = true;
	}

	/**
	 * check the current post for the existence of a short code
	 * @before: hasShortcode()
	 */
	public static function has_shortcode($shortcode = ''){
		$found = false;

		if(empty($shortcode)) return false;
		if(!is_singular()) return false;

		$post = Mage::helper('nwdrevslider/framework')->get_post(get_the_ID());
		if(stripos($post->post_content, '[' . $shortcode) !== false) $found = true;

		return $found;
	}

	/**
	 * Create Tables
	 * @only_base needs to be false
	 *  it can only be true by fixing database issues
	 *  this protects that the _bkp tables are not filled after
	 *  we are already on version 6.0
	 **/
	public static function create_tables($only_base = false){
		$table_version = Mage::helper('nwdrevslider/framework')->get_option('revslider_table_version', '1.0.0');

		if(version_compare($table_version, self::CURRENT_TABLE_VERSION, '<')){

            $wpdb = Mage::helper('nwdrevslider/query');

			$sql = "CREATE TABLE " . $wpdb->prefix . self::TABLE_SLIDER . " (
			  id int(9) NOT NULL AUTO_INCREMENT,
			  title tinytext NOT NULL,
			  alias tinytext,
			  params LONGTEXT NOT NULL,
			  settings text NULL,
			  type VARCHAR(191) NOT NULL DEFAULT '',
			  UNIQUE KEY id (id)
			);";
			Mage::helper('nwdrevslider/query')->dbDelta($sql);

			$sql = "CREATE TABLE " . $wpdb->prefix . self::TABLE_SLIDES . " (
			  id int(9) NOT NULL AUTO_INCREMENT,
			  slider_id int(9) NOT NULL,
			  slide_order int not NULL,
			  params LONGTEXT NOT NULL,
			  layers LONGTEXT NOT NULL,
			  settings text NOT NULL DEFAULT '',
			  UNIQUE KEY id (id)
			);";
			Mage::helper('nwdrevslider/query')->dbDelta($sql);

			$sql = "CREATE TABLE " . $wpdb->prefix . self::TABLE_STATIC_SLIDES . " (
			  id int(9) NOT NULL AUTO_INCREMENT,
			  slider_id int(9) NOT NULL,
			  params LONGTEXT NOT NULL,
			  layers LONGTEXT NOT NULL,
			  settings text NOT NULL,
			  UNIQUE KEY id (id)
			);";
			Mage::helper('nwdrevslider/query')->dbDelta($sql);

			$sql = "CREATE TABLE " . $wpdb->prefix . self::TABLE_CSS . " (
			  id int(9) NOT NULL AUTO_INCREMENT,
			  handle TEXT NOT NULL,
			  settings LONGTEXT,
			  hover LONGTEXT,
			  advanced LONGTEXT,
			  params LONGTEXT NOT NULL,
			  UNIQUE KEY id (id)
			);";
			Mage::helper('nwdrevslider/query')->dbDelta($sql);

			$sql = "CREATE TABLE " . $wpdb->prefix . self::TABLE_LAYER_ANIMATIONS . " (
			  id int(9) NOT NULL AUTO_INCREMENT,
			  handle TEXT NOT NULL,
			  params TEXT NOT NULL,
			  settings text NULL,
			  UNIQUE KEY id (id)
			);";
			Mage::helper('nwdrevslider/query')->dbDelta($sql);

			$sql = "CREATE TABLE " . $wpdb->prefix . self::TABLE_NAVIGATIONS . " (
			  id int(9) NOT NULL AUTO_INCREMENT,
			  name VARCHAR(191) NOT NULL,
			  handle VARCHAR(191) NOT NULL,
			  type VARCHAR(191) NOT NULL,
			  css LONGTEXT NOT NULL,
			  markup LONGTEXT NOT NULL,
			  settings LONGTEXT NULL,
			  UNIQUE KEY id (id)
			);";
			Mage::helper('nwdrevslider/query')->dbDelta($sql);

			//create CSS entries
			$result = $wpdb->get_row("SELECT COUNT( DISTINCT id ) AS NumberOfEntrys FROM " . $wpdb->prefix . self::TABLE_CSS);
			if(!empty($result) && $result->NumberOfEntrys == 0){
				$css_class = new RevSliderCssParser();
				$css_class->import_css_captions();
			}

			Mage::helper('nwdrevslider/framework')->update_option('revslider_table_version', self::CURRENT_TABLE_VERSION);
			//$table_version = self::CURRENT_TABLE_VERSION;
		}


		/**
		 * check if table version is below 1.0.8.
		 * if yes, duplicate the tables into _bkp
		 * this way, we can revert back to v5 if any slider
		 * has issues in the v6 migration process
		 **/
		if(version_compare($table_version, '1.0.8', '<') && ($only_base === false || $only_base === '')){
			Mage::helper('nwdrevslider/install')->backupDB();
		}
	}


	/**
	 * get the images from posts/pages for yoast seo
	 **/
	public static function get_images_for_seo($url, $type, $user){
		if(in_array($type, array('user', 'term'), true)) return $url;
		if(!is_object($user) || !isset($user->ID)) return $url;

		$post = Mage::helper('nwdrevslider/framework')->get_post($user->ID);
		if(is_a($post, 'WP_Post') && Mage::helper('nwdrevslider/framework')->has_shortcode($post->post_content, 'rev_slider')){
			preg_match_all('/\[rev_slider.*alias=.(.*)"\]/', $post->post_content, $shortcodes);

			if(isset($shortcodes[1]) && $shortcodes[1] !== ''){
				foreach($shortcodes[1] as $s){
					if(!RevSliderSlider::alias_exists($s)) continue;

					$sldr = new RevSliderSlider();
					$sldr->init_by_alias($s);
					$sldr->get_slides();
					$imgs = $sldr->get_images();
					if(!empty($imgs)){
						if(!isset($url['images'])) $url['images'] = array();
						foreach($imgs as $v){
							$url['images'][] = $v;
						}
					}
				}
			}
		}

		return $url;
	}

}