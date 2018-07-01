<?php
/**
 * File              : services/wordpress/src/wp-content/plugins/draft-live-sync/ajax/check-sync.php
 * @author           : Camilo Tapia <camilo.tapia@gmail.com>
 * Last Modified Date: 24.10.2017
 * Last Modified By  : Camilo Tapia <camilo.tapia@gmail.com>
 */

    define( 'SHORTINIT', true );

    $wp_base = '../../../../wp-load.php';

    require( $wp_base );

    $wp_base_dir = dirname($wp_base);

    if(file_exists($wp_base_dir . '/wp-includes/formatting.php')) {
        require( $wp_base_dir . '/wp-includes/formatting.php');
    }

    if(file_exists($wp_base_dir . '/wp-includes/link-template.php')) {
        require( $wp_base_dir . '/wp-includes/link-template.php');
    }

    require_once( '../lib/draft-live-sync-class.php' );

    if(class_exists( 'DraftLiveSync' )){

        // Init or use instance of the manager.
        $dir = dirname( __FILE__ );
        $content_draft_url = getenv('CONTENT_DRAFT_URL');
        $api_token = getenv('API_TOKEN');

        $draft_live_sync = new DraftLiveSync($dir, 'ajax-version', $content_draft_url, $api_token, true);

        $resource = $_POST['api_path'];
        $only_draft_sync = isset($_POST['only_draft_sync']) ? $_POST['only_draft_sync'] == 'true' : false;

        $result = $draft_live_sync->check_sync($resource, $only_draft_sync);
        $result->resource = $resource;

        header( "Content-Type: application/json" );
        echo json_encode($result);

        //Don't forget to always exit in the ajax function.
        exit();

        // $draft_live_sync->init();

    }


