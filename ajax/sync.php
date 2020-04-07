<?php

    // ------------------ START OF WP LOAD ------------------

    define( 'SHORTINIT', true );

    /** Define ABSPATH as this files directory */
    define( 'ABSPATH', dirname(__FILE__) . '/../../../../' );

    //WP config file
    require (ABSPATH . 'wp-config.php');

    require( ABSPATH . WPINC . '/class-wp-user.php' );
    require( ABSPATH . WPINC . '/class-wp-roles.php' );
    require( ABSPATH . WPINC . '/class-wp-role.php' );
    require( ABSPATH . WPINC . '/class-wp-session-tokens.php' );
    require( ABSPATH . WPINC . '/class-wp-user-meta-session-tokens.php' );

    // require( ABSPATH . WPINC . '/formatting.php' );
    require( ABSPATH . WPINC . '/capabilities.php' );
    require( ABSPATH . WPINC . '/query.php' );
    require( ABSPATH . WPINC . '/user.php' );
    // require( ABSPATH . WPINC . '/meta.php' );

    // Define constants after multisite is loaded. Cookie-related constants may be overridden in ms_network_cookies().
    wp_cookie_constants( );

    // Create common globals.
    require( ABSPATH . WPINC . '/vars.php' );
    require( ABSPATH . WPINC . '/kses.php' );
    require( ABSPATH . WPINC . '/rest-api.php' );
    require( ABSPATH . WPINC . '/pluggable.php' );
    require( ABSPATH . WPINC . '/link-template.php');
    require( ABSPATH . '/wp-load.php');

    // ------------------ END OF WP LOAD ------------------

    require_once( $dir . '../lib/draft-live-sync-class.php' );

    if(class_exists( 'DraftLiveSync' )){

        // Init or use instance of the manager.
        $dir = dirname( __FILE__ );
        $content_draft_url = getenv('CONTENT_DRAFT_URL');
        $api_token = getenv('API_TOKEN');

        $draft_live_sync = new DraftLiveSync($dir, DraftLiveSyncVERSION, $content_draft_url, $api_token, true);

        $resource = $_POST['api_path'];
        $sync_check = $_POST['sync_check'] === 'true' ? true : false;

        $release = $_POST['release'] === 'draft' ? 'draft' : 'live';

        $result = $draft_live_sync->push_to_queue($resource, $release, false, 'publish', true, $sync_check, false);

        // $result->resource = $resource;

        header( "Content-Type: application/json" );
        echo json_encode($result);

        //Don't forget to always exit in the ajax function.
        exit();

        // $draft_live_sync->init();

    }


