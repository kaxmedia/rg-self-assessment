<?php
if ( ! defined( 'ABSPATH' ) ) exit;

class RGSA_Renderer {

    public static function render() {
        ob_start();
        ?>
        <div class="rgsa-container" id="rgsa-root">
            <div class="rgsa-intro">
                <h2>Gambling harms assessment</h2>
                <p>This brief screening tool can help you reflect on your gambling habits. Your answers are completely private and are not stored or transmitted anywhere.</p>
                <p><strong>Note:</strong> This is a self-awareness tool, not a clinical diagnosis.</p>
            </div>

            <!-- JS ovde renderuje stepove + progress -->
            <div class="rgsa-app" aria-live="polite"></div>

            <noscript>
                <div class="rgsa-errors" role="alert">
                    This assessment requires JavaScript to run.
                </div>
            </noscript>
        </div>
        <?php
        return ob_get_clean();
    }
}
