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

class Nwdthemes_Revslider_Block_Adminhtml_Images_Content_Files extends Mage_Adminhtml_Block_Cms_Wysiwyg_Images_Content_Files {

    /**
     * Prepared Files collection for current directory
     *
     * @return Varien_Data_Collection_Filesystem
     */
    public function getFiles() {
        if (! $this->_filesCollection) {
            $this->_filesCollection = Mage::getSingleton('nwdrevslider/images_storage')
				->getFilesCollection( Mage::helper('nwdrevslider/images')->getCurrentPath(), $this->_getMediaType() );
        }
        return $this->_filesCollection;
    }

    /**
     * File thumb URL getter
     *
     * @param  Varien_Object $file
     * @return string
     */
    public function getFileThumbUrl(Varien_Object $file) {
        $storage = $this->getStorage();
        $filename = $file->getFilename();
        $targetDir = $storage->getThumbsPath($filename);
        $thumbUrl = $targetDir . DS . pathinfo($filename, PATHINFO_BASENAME);
        if (is_file($thumbUrl)) {
            $result = rtrim(Mage::getBaseUrl('media'), '/') . str_replace(array(Mage::getBaseDir('media'), '\\', '//'), array('', '/', '/'), $thumbUrl);
        } else {
            $result = $file->getThumbUrl();
        }
        return $result;
    }

    /**
     * Register storage model and return it
     *
     * @return Mage_Cms_Model_Wysiwyg_Images_Storage
     */
    public function getStorage() {
        if (!Mage::registry('storage')) {
            $storage = Mage::getModel('cms/wysiwyg_images_storage');
            Mage::register('storage', $storage);
        }
        return Mage::registry('storage');
    }

}
