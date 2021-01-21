<?php

/**
 * Nwdthemes Revolution Slider Extension
 *
 * @package     Revslider
 * @author		Nwdthemes <mail@nwdthemes.com>
 * @link		http://nwdthemes.com/
 * @copyright   Copyright (c) 2014. Nwdthemes
 * @license     http://themeforest.net/licenses/terms/regular
 */

class Nwdthemes_Revslider_Model_Observer {

    public function setHandle(Varien_Event_Observer $observer) {

		if ( Mage::helper('nwdall')->getCfg('general/enabled', 'nwdrevslider_config') ) {

			$settings = json_decode(Mage::getModel('nwdrevslider/options')->getOption('revslider-global-settings'), true);
			$includeSlider = isset($settings['includes_globally']) && $settings['includes_globally'] == 'on';

            // TODO: Make it work correctly in admin edit settings and remove line below
            $includeSlider = true;

            if ( ! $includeSlider) {

			    $pageHandles = array($observer->getEvent()->getAction()->getFullActionName());
			    foreach ($observer->getEvent()->getAction()->getRequest()->getAliases() as $alias) {
			        if ($alias) {
                        $pageHandles[] = $alias;
                    }
                }

				$includeHandles = explode(',', isset($settings['pages_for_includes']) ? $settings['pages_for_includes'] : '');

				foreach ($pageHandles as $pageHandle) {
                    foreach ($includeHandles as $includeHandle) {
                        if ($includeHandle && trim($includeHandle) === $pageHandle) {
                            $includeSlider = true;
                            continue;
                        }
                    }
                    if ($includeSlider) {
                        continue;
                    }
                }
			}

			if ($includeSlider) {
			    $layoutUpdate  = Mage::app()->getLayout()->getUpdate();
                $layoutUpdate->addHandle('nwdrevslider_default');
			}
		}
    }

}
