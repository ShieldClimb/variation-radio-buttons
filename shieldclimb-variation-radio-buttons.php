<?php

/**
 * Plugin Name: ShieldClimb – Variation Radio Buttons with Price & Stock for WooCommerce
 * Plugin URI: https://shieldclimb.com/free-woocommerce-plugins/variation-radio-buttons/
 * Description: Replace WooCommerce variation dropdowns with variation radio buttons for better UX, faster selection, and higher conversions. No coding needed!
 * Version: 1.0.5
 * Requires Plugins: woocommerce
 * Requires at least: 5.8
 * Tested up to: 6.9
 * WC requires at least: 5.8
 * WC tested up to: 10.4.3
 * Requires PHP: 7.2
 * Author: shieldclimb.com
 * Author URI: https://shieldclimb.com/
 * License: GPLv2 or later
 * License URI: https://www.gnu.org/licenses/old-licenses/gpl-2.0.html
 */

if (!defined('ABSPATH')) {
    exit; // Exit if accessed directly.
}

function shieldclimb_enqueue_assets() {
    if (!is_product()) return;

    // JavaScript with filemtime()
    wp_enqueue_script(
        'shieldclimb-variations',
        plugin_dir_url(__FILE__) . 'assets/js/shieldclimb-variation-radio-buttons.js',
        array('jquery', 'wc-add-to-cart-variation'),
        filemtime(plugin_dir_path(__FILE__) . 'assets/js/shieldclimb-variation-radio-buttons.js'),
        true
    );

    wp_enqueue_style(
        'shieldclimb-styles',
        plugin_dir_url(__FILE__) . 'assets/css/shieldclimb-variation-radio-buttons.css',
        array(),
        filemtime(plugin_dir_path(__FILE__) . 'assets/css/shieldclimb-variation-radio-buttons.css')
    );
}
add_action('wp_enqueue_scripts', 'shieldclimb_enqueue_assets');

function shieldclimb_body_class($classes) {
    if (is_product()) {
        $classes[] = 'shieldclimb-variation-radios';
    }
    return $classes;
}
add_filter('body_class', 'shieldclimb_body_class');