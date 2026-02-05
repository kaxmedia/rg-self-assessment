<?php
/**
 * Plugin Name: RG Self Assessment
 * Description: Responsible Gambling Self-Assessment (step-by-step) with progress bar. Shortcode: [rg_self_assessment]
 * Version: 1.0.0
 * Author: RG
 * Text Domain: rg-self-assessment
 */

if ( ! defined( 'ABSPATH' ) ) exit;

define( 'RGSA_VERSION', '2.4.0' );
define( 'RGSA_PLUGIN_FILE', __FILE__ );
define( 'RGSA_PLUGIN_DIR', plugin_dir_path( __FILE__ ) );
define( 'RGSA_PLUGIN_URL', plugin_dir_url( __FILE__ ) );

require_once RGSA_PLUGIN_DIR . 'includes/class-rgsa-plugin.php';
require_once RGSA_PLUGIN_DIR . 'includes/class-rgsa-renderer.php';
require_once RGSA_PLUGIN_DIR . 'includes/class-rgsa-scorer.php';

add_action( 'plugins_loaded', function () {
    RGSA_Plugin::init();
});
