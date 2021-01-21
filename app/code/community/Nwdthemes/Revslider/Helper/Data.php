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

class Nwdthemes_Revslider_Helper_Data extends Mage_Core_Helper_Abstract {

    const REVSLIDER_PRODUCT = 'revslider_magento';
    const ASSETS_ROUTE = 'nwdthemes/revslider/public/assets/';

    public static $_GET = array();
    public static $_REQUEST = array();

	/**
	 *	Constructor
	 */

	public function __construct() {
        $requestParams = Mage::app()->getRequest()->getParams();
        self::$_GET = array_merge(self::$_GET, $requestParams);
        self::$_REQUEST = array_merge(self::$_REQUEST, $requestParams);
	}

    /**
     *  Set page for get imitation
     *
     *  @param  string  $page
     */

    public static function setPage($page) {
        self::$_GET['page'] = $page;
    }

    /**
     *  Set page for get imitation
     *
     *  @param  string  $view
     */

    public static function setView($view) {
        self::$_GET['view'] = $view;
    }

    /**
     * This function can autoloads classes
     *
     * @param string $class
     */

    public static function loadRevClasses($class) {
		switch ($class) {
			case 'Rev_addon_Admin' :	$class = 'RevSliderAddons'; break;
			case 'RevSliderFunctions' :	$class = 'RevSliderFunctions'; break;
			case 'RevSlider' : 			$class = 'RevSliderSlider'; break;
			case 'RevSlide' : 			$class = 'RevSliderSlide'; break;
		}
		switch ($class) {
			case 'RevSliderGlobals' :
			case 'RevSliderBase' :
			case 'RevSliderFunctionsWP' :
			case 'RevSliderOperations' :
			case 'RevSlider' :
			case 'UniteFunctionsRev' :          $classFile = Mage::getBaseDir('lib') . '/Nwdthemes/Revslider/backwards.php'; break;
			case 'RevSliderAdmin' : 		    $classFile = Mage::getBaseDir('lib') . '/Nwdthemes/Revslider/admin/revslider-admin.class.php'; break;
            case 'RevSliderSliderExportHtml' :  $classFile = Mage::getBaseDir('lib') . '/Nwdthemes/Revslider/admin/includes/export-html.class.php'; break;
            case 'RevSliderSliderExport' :	    $classFile = Mage::getBaseDir('lib') . '/Nwdthemes/Revslider/admin/includes/export.class.php'; break;
            case 'RevSliderLoadBalancer' :	    $classFile = Mage::getBaseDir('lib') . '/Nwdthemes/Revslider/admin/includes/loadbalancer.class.php'; break;
            case 'RevSliderSliderImport' :	    $classFile = Mage::getBaseDir('lib') . '/Nwdthemes/Revslider/admin/includes/import.class.php'; break;
            case 'RevSliderHelp' :	            $classFile = Mage::getBaseDir('lib') . '/Nwdthemes/Revslider/admin/includes/help.class.php'; break;
            case 'RevSliderTemplate' :	        $classFile = Mage::getBaseDir('lib') . '/Nwdthemes/Revslider/admin/includes/template.class.php'; break;
            case 'RevSliderTooltips' :	        $classFile = Mage::getBaseDir('lib') . '/Nwdthemes/Revslider/admin/includes/tooltips.class.php'; break;
            case 'RSColorpicker' : 	            $classFile = Mage::getBaseDir('lib') . '/Nwdthemes/Revslider/colorpicker.class.php'; break;
            case 'RevSliderCssParser' :         $classFile = Mage::getBaseDir('lib') . '/Nwdthemes/Revslider/cssparser.class.php'; break;
            case 'RevSliderSlide' : 	        $classFile = Mage::getBaseDir('lib') . '/Nwdthemes/Revslider/slide.class.php'; break;
            case 'RevSliderSlider' :	        $classFile = Mage::getBaseDir('lib') . '/Nwdthemes/Revslider/slider.class.php'; break;
            case 'RevSliderFront' :			    $classFile = Mage::getBaseDir('lib') . '/Nwdthemes/Revslider/public/revslider-front.class.php'; break;
			case 'RevSliderFacebook' :
			case 'RevSliderTwitter' :
			case 'RevSliderTwitterApi' :
			case 'RevSliderInstagram' :
			case 'RevSliderFlickr' :
			case 'RevSliderYoutube' :
			case 'RevSliderVimeo' :			    $classFile = Mage::getBaseDir('lib') . '/Nwdthemes/Revslider/external-sources.class.php'; break;
			default:
				if (preg_match( '#^RevSlider#', $class)) {
					$className = str_replace(array('RevSlider', 'WP'), array('', 'Wordpress'), $class);
					preg_match_all('!([A-Z][A-Z0-9]*(?=$|[A-Z][a-z0-9])|[A-Za-z][a-z0-9]+)!', $className, $matches);
					$ret = $matches[0];
					foreach ($ret as &$match) {
						$match = $match == strtoupper($match) ? strtolower($match) : lcfirst($match);
					}
					$className = implode('-', $ret);
					$classFile = Mage::getBaseDir('lib') . '/Nwdthemes/Revslider/' . $className . '.class.php';
					if ( ! file_exists($classFile)) {
						$classFile = Mage::getBaseDir('lib') . '/Nwdthemes/Revslider/admin/includes/' . $className . '.class.php';
                    }
					if ( ! file_exists($classFile)) {
						unset($classFile);
					}
				}
			break;
		}
		if (isset($classFile)) {
			require_once($classFile);
		}
    }

	/**
	 * Get store options for multiselect
	 *
	 * @return array Array of store options
	 */

	public function getStoreOptions() {
		$storeValues = Mage::getSingleton('adminhtml/system_store')->getStoreValuesForForm(false, true);
		$storeValues = $this->_makeFlatStoreOptions($storeValues);
		return $storeValues;
	}

	/**
	 * Make flat store options
	 *
	 * @param array $storeValues Store values tree array
	 * @retrun array Flat store values array
	 */

	private function _makeFlatStoreOptions($storeValues) {
		$arrStoreValues = array();
		foreach ($storeValues as $_storeValue) {
			if ( ! is_array($_storeValue['value']) ) {
				$arrStoreValues[] = $_storeValue;
			} else {
				$arrStoreValues[] = array(
					'label'	=> $_storeValue['label'],
					'value' => 'option_disabled'
				);
				$_arrSubStoreValues = $this->_makeFlatStoreOptions($_storeValue['value']);
				foreach ($_arrSubStoreValues as $_subStoreValue) {
					$arrStoreValues[] = $_subStoreValue;
				}
			}
		}
		return $arrStoreValues;
	}

    /**
     * Log exception details to nwd_revslider.log
     *
     * @param Exception $e
     */
    public function logException($e) {
        $trace = array();
        foreach ($e->getTrace() as $data) if (isset($data['file'])) {
            $trace[] = $data['file'].':'.$data['line'];
        }
        $this->log('Revolution Slider Exception: ' . $e->getMessage() . ' in ' .  $e->getFile() . ' on line ' . $e->getLine(), $trace);
    }

    /**
     * Log variable to nwd_revslider.log
     *
     * @param var $var
     */

    public function log($var) {
        $log = array();
        foreach (func_get_args() as $arg)
            $log[] = is_string($arg) ? $arg : (is_bool($arg) ? var_export($arg, true) : print_r($arg, true));
        Mage::log(implode(', ', $log), null, 'nwd_revslider.log');
    }



    /**
     *
     *  Url helper functions
     *
     */



    /**
     *	Convert assets url for frontend
     *
     *	@param  string  Handle
     *	@param  array   Params
     *	@return	string
     */
    public function convertAssetUrlForOutput($url) {
        if (strpos($url, self::ASSETS_ROUTE) !== false) {
            $urlParts = explode(self::ASSETS_ROUTE, $url);
            $urlFile = isset($urlParts[1]) ? $urlParts[1] : '';
            $assetUrl = $this->getAssetUrl(ltrim($urlFile, '/'));
        } else {
            $assetUrl = $this->forceSSL($url);
        }
        return $assetUrl;
    }

    /**
     *	Get Asset Url
     *
     *	@param  string  Handle
     *	@param  array   Params
     *	@return	string
     */
    public function getAssetUrl($handle = '', $params = array()) {
        $_params = array('_theme' => 'default');
        $_params = array_merge($_params, $params);
        $_handle = self::ASSETS_ROUTE . $handle;
        return Mage::getDesign()->getSkinUrl($_handle, $_params);
    }

    /**
     *	Force ssl on urls
     *
     *	@param	string
     *	@return	string
     */
    public function forceSSL($url) {
        if (Mage::app()->getStore()->isCurrentlySecure()) {
            $url = str_replace('http://', 'https://', $url);
        }
        return $url;
    }


    /**
     * Get stuff to output in front end head
     *
     * @return string
     */
    public function getHeadIncludes() {
        spl_autoload_register(array(Mage::helper('nwdrevslider'), 'loadRevClasses'), true, true);
        $output = '';

        // output head includes
        new RevSliderFront();
        ob_start();
        Mage::helper('nwdrevslider/framework')->do_action('wp_enqueue_scripts');
        Mage::helper('nwdrevslider/framework')->do_action('wp_head');
        $output .= ob_get_contents();
        ob_clean();
        ob_end_clean();

        // output static styles
        $revSliderCssParser = new RevSliderCssParser();
        $revSliderFunctions = new RevSliderFunctions();
        $output .= '<style type="text/css">'
            . $revSliderCssParser->compress_css($revSliderFunctions->get_static_css())
            . '</style>';

        return $output;
    }

    /**
     * Include enqueued assets
     *
     * @return string
     */
    public function includeEnqueuedAssets() {
        $output = '';
        foreach (Mage::helper('nwdrevslider/framework')->getFromRegister('styles') as $_handle => $_style) {
            $output .= '<link  rel="stylesheet" type="text/css"  media="all" href="' . $_style . '" />' . "\n";
        }
        foreach (Mage::helper('nwdrevslider/framework')->getFromRegister('scripts') as $_handle => $_script) {
            $output .= '<script type="text/javascript" src="' . $_script . '"></script>' . "\n";
        }
        return $output;
    }

}
