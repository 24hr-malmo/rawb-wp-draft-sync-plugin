<?php

    if (file_exists('/.dockerenv')) {

        // This is needed when running inside docker so that the requests are run correclty in cron
        // Otherwise it might try to call an internal URL than doersnt have a valid host inside docker.
        // So we take the actual host, we make sure the curl request is done to "localhost" but with the
        // correct host in the header. This is to prevent multisite to break as well.
        //
        // This can be set either trough a setting or a constant
        add_filter( 'cron_request', function ( $cron_request_array ) {
            $site_url = site_url();
            $target = 'http://localhost';
            $cron_request_array['url'] = str_replace( $site_url, $target, $cron_request_array['url'] );
            $host = $_SERVER['HTTP_HOST'];
            if (!isset($cron_request_array['args']['headers'])) {
                $cron_request_array['args']['headers'] = array();
            }
            $cron_request_array['args']['headers']['host'] = $host;
            return $cron_request_array;
        }, 10, 1);

    }

