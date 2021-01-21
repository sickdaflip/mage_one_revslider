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

class Nwdthemes_Revslider_Helper_Images extends Mage_Cms_Helper_Wysiwyg_Images {

	const IMAGE_DIR = 'revslider';
	const IMAGE_THUMB_DIR = 'revslider/thumbs';
	const RS_IMAGE_PATH = 'revslider';
	const MEDIA_URL_PACEHOLDER = '{revslider_base_url}';
	const ALLOWED_MEDIA_EXTENSIONS = ['jpg', 'jpeg', 'jpe', 'gif', 'png', 'bmp', 'mpeg', 'mpg', 'mpe', 'mp4', 'm4v', 'ogv', 'webm'];

    public static $imageSizes = array(
        'gallery' => array('width' => 195, 'height' => 130),
        'thumbnail' => array('width' => 150, 'height' => 150),
        'medium' => array('width' => 300, 'height' => 200),
        'large' => array('width' => 1024, 'height' => 682),
        'post-thumbnail' => array('width' => 825, 'height' => 510)
    );

	/**
	 * Get images directory
	 *
	 * @return string
	 */

	public function getImageDir() {
		return self::IMAGE_DIR;
	}

	/**
	 * Get image thumbs directory
	 *
	 * @return string
	 */

	public function getImageThumbDir() {
		return self::IMAGE_THUMB_DIR;
	}

    /**
     * Images Storage root directory
     *
     * @return string
     */
    public function getStorageRoot() {
        return $this->imageBaseDir();
    }

    /**
     * Check whether using static URLs is allowed
     * always allowed for Revslider
     *
     * @return boolean
     */
    public function isUsingStaticUrlsAllowed() {
		return true;
    }

	/**
	 * Resize image
	 *
	 * @param string $fileName
	 * @param int $width
	 * @param int $height
	 * @param string $targetPath
	 * @return string Resized image url
	 */
	public function resizeImg($fileName, $width, $height = '', $targetPath = false) {

        $fileName = $this->imageClean($fileName);
		if (strpos($fileName, '//') !== false && strpos($fileName, $this->imageBaseUrl()) === false) {
			return $fileName;
		}

		if ( ! $height) {
			$height = $width;
		}

		$thumbDir = self::IMAGE_THUMB_DIR;
		$resizeDir = $thumbDir . "/resized_{$width}x{$height}";

		$ioFile = new Varien_Io_File();
		$ioFile->checkandcreatefolder(realpath(Mage::getBaseDir(Mage_Core_Model_Store::URL_TYPE_MEDIA)) . DS . $resizeDir);

		$baseURL = str_replace(array('https://', 'http://'), '//', Mage::getBaseUrl(Mage_Core_Model_Store::URL_TYPE_MEDIA));
		$fileName = str_replace(array('https://', 'http://'), '//', $fileName);
		$fileName = str_replace($baseURL, '', $fileName);

		$imageFile = str_replace(array('/', '\\'), '_', str_replace('revslider/', '', $fileName));

		$folderURL = Mage::getBaseUrl(Mage_Core_Model_Store::URL_TYPE_MEDIA);
		$imageURL = $folderURL . $fileName;

		$basePath = realpath(Mage::getBaseDir(Mage_Core_Model_Store::URL_TYPE_MEDIA)) . DS . $fileName;
		$newPath = $targetPath ? $targetPath : realpath(Mage::getBaseDir(Mage_Core_Model_Store::URL_TYPE_MEDIA)) . DS . $resizeDir . DS . $imageFile;

		if ($width != '') {
			if (file_exists($basePath) && is_file($basePath) && ! file_exists($newPath)) {
				$imageObj = new Varien_Image($basePath);
				$imageObj->constrainOnly(TRUE);
				$imageObj->keepAspectRatio(TRUE);
				$imageObj->keepFrame(FALSE);
				$imageObj->keepTransparency(TRUE);
				$imageObj->resize($width, $height);
				$res = $imageObj->save($newPath);
			}
			$resizedURL = Mage::getBaseUrl(Mage_Core_Model_Store::URL_TYPE_MEDIA) . $resizeDir . '/' . $imageFile;
		} else {
			$resizedURL = $imageURL;
		}
		return $resizedURL;
	}

	/**
	 *	Get image id by url
	 *
	 *	@param	string	$url
	 *	@return	int
	 */

	public function attachment_url_to_postid($url) {
		return $this->get_image_id_by_url($url);
	}

	/**
	 *	Get image id by url
	 *
	 *	@param	string	$url
	 *	@return	int
	 */

	public function get_image_id_by_url($url) {
		$id = false;
		$imagePath = $this->imageFile($url);
		if ($imagePath && file_exists($this->imageBaseDir() . $imagePath)) {
			$id = $this->idEncode($imagePath);
		}
		return $id;
	}

	/**
	 *	Get image url by id and size
	 *
	 *	@param	int		Image id
	 *	@param	string	Size type
	 *	@return string
	 */

	public function wp_get_attachment_image_src($attachment_id, $size='thumbnail') {
		return $this->image_downsize($attachment_id, $size);
	}

	/**
	 *	Get attached file
	 *
	 *	@param	string
	 *	@return string
	 */

	public function get_attached_file($attachment_id) {
		if ($attachment_id) {
			$image = $this->imageBaseDir() . $this->imageFile($this->idDecode($attachment_id));
			if (file_exists($image)) {
				return $image;
			}
		}
	}

	/**
	 *	Resize image by id and preset size
	 *
	 *	@param	int		Image id
	 *	@param	string	Size type
	 *	@return string
	 */

	public function image_downsize($id, $size = 'medium') {

        $downsizedImage = false;

		if ((string)(int)$id === (string)$id && $product = Mage::helper('nwdrevslider/products')->getProduct($id, false)) {

			switch ($size) {
				case 'thumbnail' :
					$image = $product['image_thumbnail'];
			    	break;
				case 'small' :
				case 'medium' :
					$image = $product['image_medium'];
				    break;
				case 'base' :
				case 'large' :
				case 'full' :
				default :
					$image = $product['image'];
				    break;
			}

			if ($imageSize = getimagesize( $this->imagePath($image) )) {
				$width = $imageSize[0];
				$height = $imageSize[1];
				$downsizedImage = array($image, $width, $height);
			}

		} elseif ($id) {

            $image = $this->imageFile($this->get_attached_file($id));

            switch ($size) {
                case 'base' :
                case 'large' :
                case 'full' :

                    if ($image && $imageSize = getimagesize($this->imagePath($image))) {
                        $width = $imageSize[0];
                        $height = $imageSize[1];
                        $imageUrl = $this->imageUrl($image);
                        $downsizedImage = array($imageUrl, $width, $height);
                    }

                    break;
                default :

                    $targetSize = isset(self::$imageSizes[$size]) ? self::$imageSizes[$size] : reset(self::$imageSizes);
                    $width = $targetSize['width'];
                    $height = $targetSize['height'];
                    $imageUrl = $this->image_resize($this->imageUrl($image), $width, $height);
                    $downsizedImage = array($imageUrl, $width, $height);

                    break;
            }

		}

		return $downsizedImage;
	}

	/**
	 *	Resize image
	 *
	 *	@param	string	Image url
	 *	@param	int		Width
	 *	@param	int		Height
	 *	@param	boolean	Is crop
	 *	@param	boolean	Is single
	 *	@param	boolean	Is upscale
	 *	@return string
	 */

	public function image_resize($url, $width = null, $height = null, $crop = null, $single = true, $upscale = false) {
		return $this->resizeImg($url, $width, $height);
	}

	/**
	 *	Resize image to location
	 *
	 *	@param	string	Image url
	 *	@param	int		Width
	 *	@param	int		Height
	 *	@param	string	Target path
	 *	@return string
	 */
	public function image_resize_to($url, $width = null, $height = null, $targetPath = false) {
		return $this->resizeImg($this->image_to_url($url), $width, $height, $targetPath);
	}

	/**
	 *	Alias for Resize Image
	 */

	public function rev_aq_resize($url, $width = null, $height = null, $crop = null, $single = true, $upscale = false) {
		return $this->image_resize($url, $width, $height, $crop, $single, $upscale);
	}

	/**
	 *	Convert image name to url
	 *
	 *	@param	string
	 *	@return	string
	 */

	public function image_to_url($image) {
		$image = $this->imageFile($image);
		if (empty($image) || strpos($image, '//') !== false) {
			$url = $image;
		} else {
			$url = $this->imageBaseUrl() . $image;
		}
        $urlImageData = explode('media/', $url);
        if (isset($urlImageData['1'])) {
            $url = Mage::getBaseUrl(Mage_Core_Model_Store::URL_TYPE_MEDIA) . ltrim($urlImageData['1'], '/');
        }
		return $url;
	}

	/**
	 *	Convert image url to path
	 *
	 *	@param	string
	 *	@return	string
	 */

	public function image_url_to_path($url) {
		if (strpos($url, $this->imageBaseUrl()) === false && strpos($url, Mage::getBaseUrl(Mage_Core_Model_Store::URL_TYPE_MEDIA)) !== false) {
			$image = str_replace(Mage::getBaseUrl(Mage_Core_Model_Store::URL_TYPE_MEDIA), '', $url);
			$path = realpath(Mage::getBaseDir(Mage_Core_Model_Store::URL_TYPE_MEDIA)) . DS . $image;
		} else {
			$image = str_replace($this->imageBaseUrl(), '', $url);
			$path = $this->imageBaseDir() . $image;
		}

		return $path;
	}

	/**
	 *	Get image url
	 *
	 *	@param	string
	 *	@return	string
	 */

	public function imageUrl($image) {
		if ($image && strpos($image, '//') === false) {
            $url = $this->imageBaseUrl() . $this->imageFile($image);
        } else {
            $url = $this->imageClean($image);
        }
        if (Mage::helper('nwdrevslider/framework')->is_ssl()) {
            $url = str_replace('http://', 'https://', $url);
        }
		return $url;
	}

	/**
	 *	Get image path
	 *
	 *	@param	string
	 *	@return	string
	 */

	public function imagePath($image) {
	    $path = '';
		if (strpos($image, $this->imageBaseUrl()) === false && strpos($image, Mage::getBaseUrl(Mage_Core_Model_Store::URL_TYPE_MEDIA)) !== false) {
			$image = str_replace(Mage::getBaseUrl(Mage_Core_Model_Store::URL_TYPE_MEDIA), '', $image);
            if ($image) {
                $path = realpath(Mage::getBaseDir(Mage_Core_Model_Store::URL_TYPE_MEDIA)) . DS . str_replace(array('\\', '/'), DS, $image);
            }
		} else {
            $image = str_replace($this->imageBaseUrl(), '', $image);
            if ($image) {
                $path = $this->imageBaseDir() . str_replace(array('\\', '/'), DS, $image);
            }
		}
		return $path;
	}

	/**
	 *	Get image file from url or path
	 *
	 *	@param	string
	 *	@return	string
	 */

	public function imageFile($image) {
        $replace = array(
            $this->imageBaseDir(),
            $this->imageBaseUrl(),
            Mage::getBaseUrl(Mage_Core_Model_Store::URL_TYPE_MEDIA),
            realpath(Mage::getBaseDir(Mage_Core_Model_Store::URL_TYPE_MEDIA))
		);
		foreach ($replace as $key => $item) {
			$replace[$key] = rtrim($item, DS . '/');
		}
		$file = str_replace($replace, '', $this->imageClean($image));
		$file = ltrim($file, DS . '/');
		return $file;
	}

	/**
	 *	Clean image from artifacts
	 *
	 *	@param	string
	 *	@return	string
	 */

	public function imageClean($image) {
		$noHttpUrl = false;
		if (substr($image, 0, 2) == '//') {
			$noHttpUrl = true;
			$image = ltrim($image, '/');
		}
		$image = str_replace(array('//', ':/'), array('/', '://'), $image);
		if ($noHttpUrl) {
			$image = '//' . $image;
		}
		return $image;
	}

	/**
	 *	Get images base path
	 *
	 *	@return	string
	 */

	public function imageBaseDir() {
		return realpath(Mage::getBaseDir(Mage_Core_Model_Store::URL_TYPE_MEDIA)) . DS . self::IMAGE_DIR . DS;
	}

	/**
	 *	Get images base url
	 *
	 *	@return	string
	 */

	public function imageBaseUrl() {
		return Mage::getBaseUrl(Mage_Core_Model_Store::URL_TYPE_MEDIA) . self::IMAGE_DIR . '/';
	}

	/**
	 * Check if this is media file
	 *
	 * @param string $file
	 * @return boolean
	 */
	public function isMedia($file) {
		$ext = pathinfo($file, PATHINFO_EXTENSION);
		return $ext && in_array(strtolower($ext), self::ALLOWED_MEDIA_EXTENSIONS);
	}

}
