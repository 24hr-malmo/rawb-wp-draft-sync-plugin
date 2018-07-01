<?php

// We create a clas sso it can have an instance of the correct value that we need to show in the meat box 
// (the url to the resource). 
// We had to move it to a class because add_action cant pass an argument and we need to create this callbacks 
// dynamically.
class DraftLiveSyncMetaBoxCallback {

        private $draft_live_sync;
        private $resource_url;

        function __construct($draft_live_sync, $resource, $counter, $options_name) {

            $action_prefix = $counter == 0 ? 'toplevel_page' : "${options_name}_page";
            $resource_name = str_replace('-', '_', $resource[0]);
            $resource_url = $resource[1];
            $action = "${action_prefix}_${resource_name}";

            $this->draft_live_sync = $draft_live_sync;
            $this->resource_url = $resource_url;

            add_action($action, array(&$this, 'before_acf_options_page'), 1);
            add_action($action, array(&$this, 'after_acf_options_page'), 20);

        }

        public function before_acf_options_page() {
            ob_start();
        }

        public function after_acf_options_page() {

            $content = ob_get_clean();
            $meta_box_object = array( 'args' => array ( 'api_path' => $this->resource_url) );
            $custom_metabox = $this->draft_live_sync->publish_status_meta_box_callback(null, $meta_box_object, false);
            $content = str_replace('<div id="submitdiv" class="postbox " >', $custom_metabox . '<div id="submitdiv" class="postbox replace-done">', $content);
            echo $content;

        }

};


