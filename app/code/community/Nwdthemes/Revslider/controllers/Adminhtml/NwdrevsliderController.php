<?php

/**
 * Nwdthemes Revolution Slider Extension
 *
 * @package     Revslider
 * @author		Nwdthemes <mail@nwdthemes.com>
 * @link		http://nwdthemes.com/
 * @copyright   Copyright (c) 2015. Nwdthemes
 * @license     http://themeforest.net/licenses/terms/regular
 */

class Nwdthemes_Revslider_Adminhtml_NwdrevsliderController extends Mage_Adminhtml_Controller_Action {

    private $_revSliderAdmin;

	/**
	 *	Constructor
	 */

	protected function _construct() {
        spl_autoload_register( array(Mage::helper('nwdrevslider'), 'loadRevClasses'), true, true );
        $this->wp_magic_quotes();
    }

	/**
	 * Check permissions
	 */

    protected function _isAllowed() {
        return Mage::getSingleton('admin/session')->isAllowed('nwdthemes/nwdrevslider');
    }

	/**
	 * Init action
	 */

	protected function _initAction() {
		$this->_revSliderAdmin = new RevSliderAdmin;
        $revAddonAdmin = new Rev_addon_Admin('rev_addon', RevSliderGlobals::SLIDER_REVISION);
		Mage::helper('nwdrevslider/framework')->add_filter('revslider_slide_updateSlideFromData_pre', array(Mage::helper('nwdrevslider/images'), 'relativeImagesUrl'));
		Mage::helper('nwdrevslider/framework')->add_action('plugins_loaded', array( 'RevSliderFront', 'create_tables' ));
        Mage::helper('nwdrevslider/framework')->add_action('plugins_loaded', array( 'RevSliderPluginUpdate', 'do_update_checks' ));
        Mage::helper('nwdrevslider/framework')->add_action('wp_ajax_update_addon', array($revAddonAdmin, 'updateAddon'));

        // temporary force no admin to load plugins as for frontend
        if ($this->getRequest()->getParam('client_action') == 'preview_slider' && $this->getRequest()->getParam('only_markup') == 'true') {
            Mage::helper('nwdrevslider/framework')->forceNoAdmin(true);
        }
        Mage::helper('nwdrevslider/plugin')->loadPlugins();
        Mage::helper('nwdrevslider/framework')->forceNoAdmin(false);

		return $this;
	}

	/**
	 * Init page
	 *
     * @param string $getPage
     * @param string $getView
	 */

	protected function _initPage($getPage = '', $getView = '') {

        Nwdthemes_Revslider_Helper_Data::setPage($getPage);
        Nwdthemes_Revslider_Helper_Data::setView($getView);

		if (Mage::helper('nwdrevslider/install')->validateInstall()) {
		    $this->_redirect('*/*/error');
		}

		$this->_initAction();

		Mage::helper('nwdrevslider/framework')->do_action('admin_enqueue_scripts', 'toplevel_page_revslider');

		$this->loadLayout()
			->_setActiveMenu('nwdthemes/nwdrevslider/nwdrevslider')
			->_addBreadcrumb(Mage::helper('adminhtml')->__('Revolution Slider'), Mage::helper('adminhtml')->__('Revolution Slider'));

        $this->_addHeadIncludes();
	}

	/**
	 * Set page title
	 *
	 * @param string $title
	 */

	protected function _setTitle($title) {
		$this->getLayout()->getBlock('head')->setTitle(Mage::helper('nwdrevslider')->__('Revolution Slider - ') . $title);
	}

    /**
     *  Include scritps and styles
     */

    protected function _addHeadIncludes() {
		$headBlock = $this->getLayout()->getBlock('head');
        $skinUrl = Mage::getDesign()->getSkinUrl('nwdthemes/revslider');

        foreach (Mage::helper('nwdrevslider/framework')->getFromRegister('styles') as $_handle => $_style) {
            if (strpos($_style, $skinUrl) === false) {
                Mage::helper('nwdrevslider/framework')->wp_add_inline_style('inline_css_' . $_handle, '<link rel="stylesheet" type="text/css" href="' . $_style . '" media="all" />');
            } else {
                $headBlock->addItem('skin_css', 'nwdthemes/revslider' . str_replace($skinUrl, '', $_style));
            }
        }

        foreach (Mage::helper('nwdrevslider/framework')->getFromRegister('scripts') as $_handle => $_script) {
            if (strpos($_script, $skinUrl) === false) {
                Mage::helper('nwdrevslider/framework')->wp_add_inline_style('inline_js_' . $_handle, '<script type="text/javascript" src="' . $_script . '"></script>');
            } else {
                $headBlock->addItem('skin_js', 'nwdthemes/revslider' . str_replace($skinUrl, '', $_script));
            }
        }

		$headBlock
            ->setCanLoadExtJs(true)
			->assign('inlineStyles', Mage::helper('nwdrevslider/framework')->getFromRegister('inline_styles'))
			->assign('localizeScripts', Mage::helper('nwdrevslider/framework')->getFromRegister('localize_scripts'));
    }

	/**
	 * Default page
	 */

	public function indexAction() {
        $this->_createUploadDir();
		$this->slidersAction();
	}

	/**
	 * Slider Overview
	 */

	public function slidersAction() {
		$this->_initPage('revslider');
		$this->_setTitle(Mage::helper('nwdrevslider')->__('Slider Overview'));
		$this->renderLayout();
	}

	/**
	 * Slider Editor
	 */

	public function slideAction() {
		$this->_initPage('revslider', 'slide');
		$this->_setTitle(Mage::helper('nwdrevslider')->__('Slider Editor'));
        $this->_uploaderJsCompatibility();
		$this->renderLayout();
	}

	/**
	 * Ajax actions
	 */

	public function ajaxAction() {
		$this->_initAction();

        $ajaxAction = $this->getRequest()->getParam('action');
        if ($ajaxAction && $ajaxAction !== 'revslider_ajax_action') {
            $this->adminajaxAction($ajaxAction);
        } else {
            $this->_revSliderAdmin->do_ajax_action();
        }
	}

	/**
	 * Admin ajax actions
	 */

	public function adminajaxAction($action = '') {
		$this->_initAction();
        $action = 'wp_ajax_' . ($action ?: $this->getRequest()->getParam('action'));
        echo Mage::helper('nwdrevslider/framework')->do_action($action);
	}

	/**
	 * Error page
	 */

	public function errorAction() {
		if ( ! $strError = Mage::helper('nwdrevslider/install')->validateInstall() )
		{
			$this->_redirect('*/*/index');
		}
		else
		{
		    Mage::getSingleton('adminhtml/session')->addError($strError);
		    $this->loadLayout()->_setActiveMenu('nwdthemes/nwdrevslider/nwdrevslider');
			$this->_setTitle(Mage::helper('nwdrevslider')->__('Error'));
			$this->renderLayout();
		}
	}

    /**
     *  Add magic quotes for WP compatiblity
     */

    private function wp_magic_quotes() {
        // If already slashed, strip.
        if (function_exists('get_magic_quotes_gpc')) {
            $reflection = new \ReflectionFunction('get_magic_quotes_gpc');
            if ( ! $reflection->isDeprecated()) {
                if ( get_magic_quotes_gpc() ) {
                    $_GET    = RevSliderFunctions::stripslashes_deep( $_GET    );
                    $_POST   = RevSliderFunctions::stripslashes_deep( $_POST   );
                    $_COOKIE = RevSliderFunctions::stripslashes_deep( $_COOKIE );
                }
            }
        }

        // Escape with wpdb.
        $_GET    = $this->add_magic_quotes( $_GET    );
        $_POST   = $this->add_magic_quotes( $_POST   );
        $_COOKIE = $this->add_magic_quotes( $_COOKIE );
        $_SERVER = $this->add_magic_quotes( $_SERVER );

        // Force REQUEST to be GET + POST.
        $_REQUEST = array_merge( $_GET, $_POST );
    }

    /**
     * Walks the array while sanitizing the contents.
     *
     * @param array $array Array to walk while sanitizing contents.
     * @return array Sanitized $array.
     */

    private function add_magic_quotes( $array ) {
        foreach ( (array) $array as $k => $v ) {
            if ( is_array( $v ) ) {
                $array[$k] = $this->add_magic_quotes( $v );
            } elseif (is_string($v)) {
                $array[$k] = addslashes( $v );
            }
        }
        return $array;
    }

    /**
     *  Creates folders for uploading images
     */

    private function _createUploadDir() {
        try {
            $dir = Mage::helper('nwdrevslider/images')->getStorageRoot();
            if ( ! file_exists($dir)) {
                $io = new Varien_Io_File();
                $io->mkdir($dir);
            }
        } catch (Exception $e) {
            Mage::helper('nwdrevslider')->logException($e);
        }
    }

    /**
     * Check for compatibility and add media uploader scripts
     *
     * return object
     */

    private function _uploaderJsCompatibility() {
        if ( ! $this->getLayout()->createBlock('uploader/multiple')) {
            $this->getLayout()->getBlock('head')
                ->removeItem('js', 'lib/uploader/flow.min.js')
                ->removeItem('js', 'lib/uploader/fusty-flow.js')
                ->removeItem('js', 'lib/uploader/fusty-flow-factory.js')
                ->removeItem('js', 'mage/adminhtml/uploader/instance.js')
                ->addJs('lib/flex.js')
                ->addJs('lib/FABridge.js')
                ->addJs('mage/adminhtml/flexuploader.js');
        }
        return $this;
    }

}
