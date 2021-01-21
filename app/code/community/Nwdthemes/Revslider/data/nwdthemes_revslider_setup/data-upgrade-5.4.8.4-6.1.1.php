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

$options = array(
	array('date_format', 'F j, Y'),
	array('time_format', 'g:i a')
);
foreach ($options as $row) {
	$data = array(
		'handle'	=> $row[0],
		'option'	=> $row[1]
	);
    Mage::getModel('nwdrevslider/options')->setData($data)->save();
}