<?php

    class DraftLiveSyncSettings {

        private $options;
        private $draft_live_sync;

		private $ignore_post_types = array(
			'attachment',
			'revision',
			'nav_menu_item', 
			'custom_css', 
			'customize_changeset', 
			'acf-field-group', 
			'acf-field', 
			'vc4_templates', 
			'vc_grid_item', 
			'templatera', 
			'np-redirect', 
			'oembed_cache',
		);

        public function __construct($draft_live_sync) {
            $this->draft_live_sync = $draft_live_sync;

            add_action( 'admin_menu', array( $this, 'add_plugin_page' ) );
            add_action( 'admin_init', array( $this, 'page_init' ) );
        }

		public function get_replace_hosts() {
			$value = get_option( 'dls_settings_replace_host_list' );
            $list = explode("\n", $value);
			return $list;
		}

		public function get_enabled_post_types() {

			$enabled_list = array();
			$options = get_option( 'dls_settings_enabled_post_types' );

			$value = array();
			if (isset($options['post_type']) && ! empty($options['post_type'])) {
				$value = $options['post_type'];
			}

			$post_types = get_post_types(); 

			foreach ( get_post_types( '', 'names' ) as $post_type ) {
				if (in_array($post_type, $value) && !in_array($post_type, $this->ignore_post_types)) {
					array_push($enabled_list, $post_type);
				}
			}

			return $enabled_list;

		}

        public function add_plugin_page() {
            add_submenu_page('draft-live-sync', 'Settings', 'Settings', 'manage_options', 'draft-live-sync-settings', array( &$this, 'create_admin_page'));
        }

        public function create_admin_page() {

            $this->options = get_option( 'my_option_name' );
?>
        <div class="wrap">
            <h1>Draft Live Sync Settings</h1>

            <div>
                <h2>Enviroment variables</h2>
                <div>Internal Content Draft URL: <strong><?php echo $this->draft_live_sync->content_draft_url; ?></strong></div>
            </div>

            <form method="post" action="options.php">
<?php
            // This prints out all hidden setting fields
            settings_fields( 'my_option_group' );
            do_settings_sections( 'my-setting-admin' );
            submit_button();
?>
            </form>
        </div>
<?php
        }

        /**
         * Register and add settings
         */
        public function page_init() {        

			if (!get_option('dls_settings_enabled_post_types')) {
				add_option('dls_settings_enabled_post_types');
			}

			if (!get_option('dls_settings_replace_host_list')) {
				add_option('dls_settings_replace_host_list');
			}

            register_setting( 'my_option_group', 'dls_settings_enabled_post_types', array( $this, 'sanitize' ) );
            register_setting( 'my_option_group', 'dls_settings_replace_host_list', array( $this, 'sanitize' ) );

            add_settings_section(
                'setting_section_id', 'Post types settings', array( $this, 'print_post_types_info' ), 'my-setting-admin' 
            );  

			add_settings_field(
				'dls-settings', 'Select post types', array( $this, 'post_type_callback'), 'my-setting-admin', 'setting_section_id' 
			);      

            add_settings_section(
                'settings_replace_hosts', 'Hosts to replace', array( $this, 'print_replace_hosts_info' ), 'my-setting-admin' 
            );  

			add_settings_field(
				'dls-settings', 'List of hosts', array( $this, 'replace_hosts_callback'), 'my-setting-admin', 'settings_replace_hosts' 
			);      

		}

		public function sanitize( $input ) {
			$new_input = array();
			if( isset( $input['id_number'] ) )
				$new_input['id_number'] = absint( $input['id_number'] );

			if( isset( $input['title'] ) )
				$new_input['title'] = sanitize_text_field( $input['title'] );

			return $input;
		}

		public function print_post_types_info() {
			print 'Choose which post types should be handled:';
		}

		public function print_replace_hosts_info() {
            print 'List of all hosts that should be removed. One per line. Important: Be careful with this replace/remove functionality. It will remove all instances of the text.';
		}

		public function post_type_callback() {

			$options = get_option( 'dls_settings_enabled_post_types' );
			$post_types = get_post_types(); 

			$value = array();
			if (isset($options['post_type']) && ! empty($options['post_type'])) {
				$value = $options['post_type'];
			}

			foreach ( get_post_types( '', 'names' ) as $post_type ) {
				if (!in_array($post_type, $this->ignore_post_types)) {
					$checked = (in_array($post_type, $value) ? 'checked' : '');
					printf(
						"<div><input type=\"checkbox\" name=\"dls_settings_enabled_post_types[post_type][]\" value=\"$post_type\" $checked /> $post_type</div>"
					);
				}
			}

		}

		public function replace_hosts_callback() {
			$value = get_option( 'dls_settings_replace_host_list' );
			echo "<div><textarea style=\"width: 50%; height: 200px;\" name=\"dls_settings_replace_host_list\" />$value</textarea></div>";
		}


	}

