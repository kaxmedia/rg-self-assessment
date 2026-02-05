<?php
if ( ! defined( 'ABSPATH' ) ) exit;

class RGSA_Plugin {

    private static $assets_enqueued = false;

    public static function init() {
        add_shortcode( 'rg_self_assessment', [ __CLASS__, 'shortcode' ] );
        // Check for shortcode early using wp hook
        add_action( 'wp', [ __CLASS__, 'detect_shortcode' ] );
        add_action( 'wp_enqueue_scripts', [ __CLASS__, 'maybe_enqueue_assets' ] );
    }

    public static function detect_shortcode() {
        global $post;
        if ( is_a( $post, 'WP_Post' ) && has_shortcode( $post->post_content, 'rg_self_assessment' ) ) {
            self::$assets_enqueued = true;
        }
    }

    public static function shortcode( $atts = [] ) {
        // Ensure assets are enqueued even if detect_shortcode missed it (widgets, etc.)
        if ( ! self::$assets_enqueued ) {
            self::enqueue_assets();
            self::$assets_enqueued = true;
        }

        return RGSA_Renderer::render();
    }

    public static function maybe_enqueue_assets() {
        if ( self::$assets_enqueued ) {
            self::enqueue_assets();
        }
    }

    private static function enqueue_assets() {
        wp_enqueue_style(
            'rgsa-css',
            RGSA_PLUGIN_URL . 'assets/rgsa.css',
            [],
            RGSA_VERSION
        );

        wp_enqueue_script(
            'rgsa-js',
            RGSA_PLUGIN_URL . 'assets/rgsa.js',
            [],
            RGSA_VERSION,
            true
        );

        // Podaci (pitanja + scoring) idu iz PHP u JS.
        wp_localize_script( 'rgsa-js', 'RGSA_DATA', [
            'steps' => RGSA_Scorer::get_steps_schema(),
        ] );
    }
}
