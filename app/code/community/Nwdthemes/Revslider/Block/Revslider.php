<?php

/**
 * Nwdthemes Revolution Slider Extension
 *
 * @package     Revslider
 * @author        Nwdthemes <mail@nwdthemes.com>
 * @link        http://nwdthemes.com/
 * @copyright   Copyright (c) 2014. Nwdthemes
 * @license     http://themeforest.net/licenses/terms/regular
 */
class Nwdthemes_Revslider_Block_Revslider extends Mage_Core_Block_Template
{

    protected $_slider;
    protected $_content;
    protected $_output;

    protected function _construct()
    {
        $this->setCacheLifetime(864000); // 10 days
        parent::_construct();
        $this->setTemplate('nwdthemes/revslider/revslider.phtml');
        spl_autoload_register(array(Mage::helper('nwdrevslider'), 'loadRevClasses'), true, true);
        $this->_output = new RevSliderOutput();
    }

    protected function _renderSlider()
    {
        if (is_null($this->_slider)) {

            Mage::helper('nwdrevslider/plugin')->loadPlugins();

            ob_start();
            $this->_slider = $this->_output->add_slider_to_stage($this->getData('alias'));
            $this->_content = ob_get_contents();
            ob_clean();
            ob_end_clean();
        }
    }

    /**
     *  Include scritps and styles
     */

    protected function addHeadIncludes() {

        $this->_renderSlider();

        ob_start();
        Mage::helper('nwdrevslider/framework')->do_action('wp_footer');
        $content = ob_get_contents();
        ob_clean();
        ob_end_clean();

        $content .= Mage::helper('nwdrevslider')->includeEnqueuedAssets();

        $localizeScripts = Mage::helper('nwdrevslider/framework')->getFromRegister('localize_scripts');
        if ($localizeScripts) {
            $content .= '<script type="text/javascript">' . "\n";
            foreach ($localizeScripts as $localizeScript) {
                $content .= 'var ' . $localizeScript['var'] . ' = ' . json_encode($localizeScript['lang']) . "\n";;
            }
            $content .= '</script>' . "\n";
        }

        return $content;
    }

    public function getCacheKeyInfo() {
        $key = parent::getCacheKeyInfo();
        $key[] = $this->getData('alias');
        $key[] = Mage::helper('nwdrevslider/framework')->is_ssl();
        $key[] = Mage::getSingleton('customer/session')->getCustomerGroupId();
        return $key;
    }

	public function renderSlider() {
		if ( Mage::helper('nwdall')->getCfg('general/enabled', 'nwdrevslider_config') ) {

			$this->_renderSlider();

            if(!empty($this->_slider)) {

                // Customer group permissions
                $useAccessPermissions = $this->_slider->getParam('use_access_permissions', false);
                $allowGroups = $this->_slider->getParam('allow_groups', array());
                $customerGroupId = Mage::getSingleton('customer/session')->getCustomerGroupId();
                if ($useAccessPermissions === 'off'
                    || $useAccessPermissions === false
                    || (isset($allowGroups[0]) && in_array($customerGroupId, $allowGroups))
                    || (isset($allowGroups['group' . $customerGroupId]) && $allowGroups['group' . $customerGroupId])
                ) {

                    $this->_content = $this->addHeadIncludes()
                        . self::load_icon_fonts()
                        . $this->_content;

                    $show_alternate = $this->_slider->getParam("show_alternative_type", "off");

                    if ($show_alternate == 'mobile' || $show_alternate == 'mobile-ie8') {
                        if (strstr($_SERVER['HTTP_USER_AGENT'], 'Android') || strstr($_SERVER['HTTP_USER_AGENT'], 'webOS') || strstr($_SERVER['HTTP_USER_AGENT'], 'iPhone') || strstr($_SERVER['HTTP_USER_AGENT'], 'iPod') || strstr($_SERVER['HTTP_USER_AGENT'], 'iPad') || strstr($_SERVER['HTTP_USER_AGENT'], 'Windows Phone') || Mage::helper('nwdrevslider/framework')->wp_is_mobile()) {
                            $show_alternate_image = $this->_slider->getParam("show_alternate_image", "");
                            $this->_content = '<img class="tp-slider-alternative-image" src="' . $show_alternate_image . '" data-no-retina>';
                        }
                    }
                } else {
                    $this->_content = '';
                }
            }
		}

		return $this->_content;
	}

	/**
	 *	Add icon fonts
	 */

	public static function load_icon_fonts(){
		global $fa_icon_var,$pe_7s_var;
		$content = '';
		if($fa_icon_var) $content .= "<link rel='stylesheet' property='stylesheet' id='rs-icon-set-fa-icon-css'  href='" . Nwdthemes_Revslider_Helper_Framework::$RS_PLUGIN_URL . "public/assets/fonts/font-awesome/css/font-awesome.css' type='text/css' media='all' />";
		if($pe_7s_var) $content .= "<link rel='stylesheet' property='stylesheet' id='rs-icon-set-pe-7s-css'  href='" . Nwdthemes_Revslider_Helper_Framework::$RS_PLUGIN_URL . "public/assets/fonts/pe-icon-7-stroke/css/pe-icon-7-stroke.css' type='text/css' media='all' />";
		return $content;
	}

}
