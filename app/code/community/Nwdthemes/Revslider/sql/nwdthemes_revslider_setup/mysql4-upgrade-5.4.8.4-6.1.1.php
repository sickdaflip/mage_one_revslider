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

$connConfig = $this->getConnection()->getConfig();
$dbName = $connConfig['dbname'];

$upgradeSQL = "

ALTER TABLE `{$this->getTable('nwdrevslider/navigations')}`
ADD `type` varchar(191) NOT NULL;

";

$installer = $this;
$installer->startSetup();
$installer->run($upgradeSQL);
$installer->endSetup();
