<?php
if ( ! defined( 'ABSPATH' ) ) exit;

class RGSA_Scorer {

    /**
     * Šema koraka – JS pravi UI iz ovoga.
     * Tipovi:
     *  - single: jedan izbor
     *  - multi: checkbox lista
     *  - optional: demografija (može skip)
     */
    public static function get_steps_schema() {
        return [
            [
                'id' => 'who_for',
                'title' => 'Who are you completing this for?',
                'subtitle' => 'We need this information so we can ask you the right questions and show you relevant advice.',
                'type' => 'single',
                'options' => [
                    [ 'value' => 'myself', 'label' => 'Myself', 'score' => 0 ],
                    [ 'value' => 'someone_else', 'label' => 'Someone else', 'score' => 0 ],
                ],
                'required' => true,
            ],
            [
                'id' => 'worried',
                'title' => 'Do you ever feel worried about your gambling?',
                'type' => 'single',
                'options' => [
                    [ 'value' => 0, 'label' => 'No', 'score' => 0 ],
                    [ 'value' => 1, 'label' => 'Sometimes', 'score' => 1 ],
                    [ 'value' => 2, 'label' => 'Yes, often', 'score' => 2 ],
                ],
                'required' => true,
            ],
            [
                'id' => 'difficulties',
                'title' => 'Is your gambling causing you any difficulties?',
                'subtitle' => 'For example relationship, financial or health difficulties.',
                'type' => 'multi',
                'options' => [
                    [ 'value' => 'financial', 'label' => 'Financial', 'score' => 2 ],
                    [ 'value' => 'emotional', 'label' => 'Emotional', 'score' => 2 ],
                    [ 'value' => 'relationships', 'label' => 'Relationships', 'score' => 2 ],
                    [ 'value' => 'health', 'label' => 'Health', 'score' => 2 ],
                    [ 'value' => 'judged', 'label' => 'Feeling judged', 'score' => 1 ],
                    [ 'value' => 'other', 'label' => 'Other', 'score' => 1 ],
                ],
                'required' => true, // mora makar 1 (ili “No difficulties”)
                'hasNoneOption' => true,
                'noneOption' => [ 'value' => 'none', 'label' => 'No', 'score' => 0 ],
            ],
            [
                'id' => 'larger_amounts',
                'title' => 'Do you feel you need to keep gambling with larger amounts of money?',
                'type' => 'single',
                'options' => [
                    [ 'value' => 0, 'label' => 'No', 'score' => 0 ],
                    [ 'value' => 1, 'label' => 'Sometimes', 'score' => 1 ],
                    [ 'value' => 2, 'label' => 'Often', 'score' => 2 ],
                    [ 'value' => 3, 'label' => 'Almost always', 'score' => 3 ],
                ],
                'required' => true,
            ],
            [
                'id' => 'afford_to_lose',
                'title' => 'Have you ever gambled with more than you could afford to lose?',
                'type' => 'single',
                'options' => [
                    [ 'value' => 0, 'label' => 'No', 'score' => 0 ],
                    [ 'value' => 1, 'label' => 'Once or twice', 'score' => 1 ],
                    [ 'value' => 2, 'label' => 'Often', 'score' => 2 ],
                    [ 'value' => 3, 'label' => 'Almost always', 'score' => 3 ],
                ],
                'required' => true,
            ],
            [
                'id' => 'win_back',
                'title' => "Have you ever tried to win back money you've lost gambling?",
                'subtitle' => 'This could include trying to win back the money later the same day, or another day.',
                'type' => 'single',
                'options' => [
                    [ 'value' => 0, 'label' => 'No', 'score' => 0 ],
                    [ 'value' => 1, 'label' => 'Once or twice', 'score' => 1 ],
                    [ 'value' => 2, 'label' => 'Often', 'score' => 2 ],
                    [ 'value' => 3, 'label' => 'Almost always', 'score' => 3 ],
                ],
                'required' => true,
            ],
            [
                'id' => 'hidden',
                'title' => 'Have you ever hidden anything about your gambling?',
                'subtitle' => "For example, the amount of money you've lost or won, or the time spent playing.",
                'type' => 'single',
                'options' => [
                    [ 'value' => 0, 'label' => 'No', 'score' => 0 ],
                    [ 'value' => 1, 'label' => 'Once or twice', 'score' => 1 ],
                    [ 'value' => 2, 'label' => 'Often', 'score' => 2 ],
                    [ 'value' => 3, 'label' => 'Almost always', 'score' => 3 ],
                ],
                'required' => true,
            ],
            [
                'id' => 'about_you',
                'title' => 'Could you tell us a little bit about you?',
                'subtitle' => 'All fields are optional, and all information is anonymous.',
                'type' => 'optional',
                'fields' => [
                    [ 'id' => 'gender', 'label' => 'Gender', 'options' => ['Please select','Male','Female','Prefer not to say'] ],
                    [ 'id' => 'age', 'label' => 'Age', 'options' => ['Please select','18-24','25-34','35-44','45-54','55+'] ],
                    [ 'id' => 'ethnicity', 'label' => 'Ethnicity', 'options' => ['Please select','White','Black','Asian','Hispanic','Other'] ],
                    [ 'id' => 'region', 'label' => 'Region', 'options' => ['Please select','North East','North West','Midlands','London','South East','South West','Other'] ],
                ],
                'required' => false,
            ],
        ];
    }

    public static function score_to_risk( $score ) {
        // Pragove možeš menjati kako ti tim traži.
        if ( $score >= 12 ) return 'high';
        if ( $score >= 6 ) return 'moderate';
        return 'low';
    }

    public static function risk_copy( $risk ) {
        if ( $risk === 'high' ) {
            return [
                'label' => 'High risk of harm',
                'title' => 'Your answers indicate you are at high risk of harm from gambling.',
                'message' => 'Completing this assessment can be tough, but it’s an important step toward taking control. Consider reaching out for professional or local support.',
            ];
        }
        if ( $risk === 'moderate' ) {
            return [
                'label' => 'Moderate risk of harm',
                'title' => 'Your answers indicate a moderate risk of harm from gambling.',
                'message' => 'You may benefit from setting stronger limits and talking to someone you trust or a support service.',
            ];
        }
        return [
            'label' => 'Lower risk',
            'title' => 'Your answers indicate a lower risk of harm from gambling.',
            'message' => 'Even with lower risk, it can help to keep an eye on habits and use safer gambling tools.',
        ];
    }
}
