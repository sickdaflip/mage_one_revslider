<?php
/**
 * @author    ThemePunch <info@themepunch.com>
 * @link      https://www.themepunch.com/
 * @copyright 2019 ThemePunch
 * @since	  6.0
 */

class RevSliderFolder extends RevSliderSlider {

	public $folder = false;

	/**
	 * Initialize A slider as a Folder
	 **/
	public function init_folder_by_id($id){
		$wpdb = Mage::helper('nwdrevslider/query');

		$folder = $wpdb->get_row($wpdb->prepare("SELECT * FROM ". $wpdb->prefix . RevSliderFront::TABLE_SLIDER ." WHERE `id` = %s AND `type` = 'folder'", $id), Nwdthemes_Revslider_Helper_Query::ARRAY_A);

		if(!empty($folder)){
			$this->id		= $this->get_val($folder, 'id');
			$this->title	= $this->get_val($folder, 'title');
			$this->alias	= $this->get_val($folder, 'alias');
			$this->settings = (array)json_decode($this->get_val($folder, 'settings', ''));
			$this->params	= (array)json_decode($this->get_val($folder, 'params', ''));
			$this->folder	= true;
			return true;
		}else{
			return false;
		}
	}


	/**
	 * Get all Folders from the Slider Table
	 **/
	public function get_folders(){
		$wpdb = Mage::helper('nwdrevslider/query');

		$folders = array();
		$entries = $wpdb->get_results("SELECT `id` FROM ". $wpdb->prefix . RevSliderFront::TABLE_SLIDER ." WHERE `type` = 'folder'", Nwdthemes_Revslider_Helper_Query::ARRAY_A);

		if(!empty($entries)){
			foreach($entries as $folder){
				$slider		= new RevSliderFolder();
				$folder_id	= $this->get_val($folder, 'id');
				$slider->init_folder_by_id($folder_id);

				$folders[] = $slider;
			}
		}

		return $folders;
	}


	/**
	 * Get all Folders from the Slider Table
	 **/
	public function get_folder_by_id($id){
		$wpdb = Mage::helper('nwdrevslider/query');

		$folder = $wpdb->get_row($wpdb->prepare("SELECT * FROM ". $wpdb->prefix . RevSliderFront::TABLE_SLIDER ." WHERE `type` = 'folder' AND `id` = %s", $id), Nwdthemes_Revslider_Helper_Query::ARRAY_A);

		return $folder;
	}


	/**
	 * Create a new Slider as a Folder
	 **/
	public function create_folder($alias = 'New Folder'){
		$wpdb = Mage::helper('nwdrevslider/query');

		$title  	= Mage::helper('nwdrevslider/framework')->esc_html($alias);
		$alias  	= Mage::helper('nwdrevslider/framework')->sanitize_title($title);
		$temp		= $title;
		$folder 	= false;
		$ti			= 1;
		while($this->alias_exists($alias)){ //set a new alias and title if its existing in database
			$title = $temp . ' ' . $ti;
			$alias = Mage::helper('nwdrevslider/framework')->sanitize_title($title);
			$ti++;
		}

		//check if Slider with title and/or alias exists, if yes change both to stay unique
		$done = $wpdb->insert($wpdb->prefix . RevSliderFront::TABLE_SLIDER, array('title' => $title, 'alias' => $alias, 'type' => 'folder'));
		if($done !== false){
			$this->init_folder_by_id($wpdb->insert_id);
			$folder = $this;
		}

		return $folder;
	}


	/**
	 * Add a Slider ID to a Folder
	 **/
	public function add_slider_to_folder($children, $folder_id, $replace_all = true){
		$wpdb = Mage::helper('nwdrevslider/query');
		$response	= false;
		$folder		= $wpdb->get_row($wpdb->prepare("SELECT * FROM ". $wpdb->prefix . RevSliderFront::TABLE_SLIDER ." WHERE `id` = %s AND `type` = 'folder'", $folder_id), Nwdthemes_Revslider_Helper_Query::ARRAY_A);

		if(!empty($folder)){
			$settings = json_decode($this->get_val($folder, 'settings'), true);
			if(!isset($settings['children'])){
				$settings['children'] = array();
			}

			if($replace_all){
				$settings['children'] = $children;
			}else{
				$children = (array)$children;
				if(!empty($children)){
					foreach($children as $child){
						if(!in_array($child, $settings['children'])){
							$settings['children'][] = $child;
						}
					}
				}
			}
			$response = $wpdb->update($wpdb->prefix . RevSliderFront::TABLE_SLIDER, array('settings' => json_encode($settings)), array('id' => $folder_id));
		}

		return $response;
	}


	/**
	 * Get the Children of the folder (if any exist)
	 **/
	public function get_children(){
		return $this->get_val($this->settings, 'children', array());
	}
}