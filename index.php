<?php

/*
Plugin Name: Draft/Live Sync for Content Service
Plugin URI: http://24hr.se
Description: Saves content to a Draft Content Service and gives the possibility to push the content to live
Version: 0.9.22
Author: Camilo Tapia <camilo.tapia@24hr.se>
*/

// don't load directly
if ( !defined( 'ABSPATH' ) ) {

    die( '-1' );

} else {

    $dir = dirname( __FILE__ );

    $plugin_info = get_file_data(__FILE__, array( 'Version' => 'Version') );
    define('DraftLiveSyncVERSION', $plugin_info['Version']);

    require_once( $dir . '/lib/draft-live-sync-wp-cron-fix.php' );
    require_once( $dir . '/lib/draft-live-sync-class.php' );

    function draft_live_sync_init() {

        // Init or use instance of the manager.
        $dir = dirname( __FILE__ );
        $content_draft_url = getenv('CONTENT_DRAFT_URL');
        $api_token = getenv('API_TOKEN');

        if(class_exists( 'DraftLiveSync' )){
            global $draft_live_sync;
            $draft_live_sync = new DraftLiveSync($dir, DraftLiveSyncVERSION, $content_draft_url, $api_token);
        }

    }

    add_action( 'init', 'draft_live_sync_init');

}

