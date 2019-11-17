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

		public function get_preview_url() {
			$value = get_option( 'dls_settings_preview_url' );
			return $value;
		}

		public function get_site_id() {
			$value = get_option( 'dls_settings_site_id' );
			return $value;
		}

		public function get_replace_hosts() {
			$value = get_option( 'dls_settings_replace_host_list' );
            $list = explode("\n", $value);
			return $list;
		}

		public function get_auto_redirect_to_admin_page() {
			$value = get_option( 'dls_settings_auto_redirect_to_admin_page' ) == 'true';
			return $value;
        }

		public function get_wordpress_not_in_docker() {
			$value = get_option( 'dls_settings_wordpress_not_in_docker' ) == 'true';
			return $value;
        }

		public function get_overwrite_viewable_permalink() {
            $value = get_option( 'dls_overwrite_viewable_permalink' ) == 'true';
            if ($value) {
                return get_option( 'dls_overwrite_viewable_permalink_host' );
            }
            return false;
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

			if (!get_option('dls_settings_site_id')) {
				add_option('dls_settings_site_id');
            }

			if (!get_option('dls_settings_preview_url')) {
				add_option('dls_settings_preview_url');
			}

			if (!get_option('dls_settings_enabled_post_types')) {
				add_option('dls_settings_enabled_post_types');
			}

			if (!get_option('dls_settings_replace_host_list')) {
				add_option('dls_settings_replace_host_list');
            }

			if (!get_option('dls_settings_auto_redirect_to_admin_page')) {
				add_option('dls_settings_auto_redirect_to_admin_page');
            }

			if (!get_option('dls_settings_wordpress_not_in_docker')) {
				add_option('dls_settings_wordpress_not_in_docker');
            }

			if (!get_option('dls_overwrite_viewable_permalink')) {
				add_option('dls_overwrite_viewable_permalink');
            }

   			if (!get_option('dls_overwrite_viewable_permalink_host')) {
				add_option('dls_overwrite_viewable_permalink_host');
			}
     
            register_setting( 'my_option_group', 'dls_settings_site_id', array( $this, 'sanitize' ) );
            register_setting( 'my_option_group', 'dls_settings_preview_url', array( $this, 'sanitize' ) );
            register_setting( 'my_option_group', 'dls_settings_enabled_post_types', array( $this, 'sanitize' ) );
            register_setting( 'my_option_group', 'dls_settings_replace_host_list', array( $this, 'sanitize' ) );
            register_setting( 'my_option_group', 'dls_settings_auto_redirect_to_admin_page', array( $this, 'sanitize' ) );
            register_setting( 'my_option_group', 'dls_settings_wordpress_not_in_docker', array( $this, 'sanitize' ) );
            register_setting( 'my_option_group', 'dls_overwrite_viewable_permalink', array( $this, 'sanitize' ) );
            register_setting( 'my_option_group', 'dls_overwrite_viewable_permalink_host', array( $this, 'sanitize' ) );

            add_settings_section( 'settings_site_id', 'Site ID', array( $this, 'print_site_id' ), 'my-setting-admin' );  
			add_settings_field( 'dls-settings', 'Set the site id for this site', array( $this, 'site_id_callback'), 'my-setting-admin', 'settings_site_id' );      

            add_settings_section( 'settings_preview_url', 'Preview URL', array( $this, 'print_preview_url' ), 'my-setting-admin' );  
			add_settings_field( 'dls-settings', 'Set the preview URL for this site', array( $this, 'preview_url_callback'), 'my-setting-admin', 'settings_preview_url' );      

            add_settings_section( 'setting_section_id', 'Post types settings', array( $this, 'print_post_types_info' ), 'my-setting-admin' );  
			add_settings_field( 'dls-settings', 'Select post types', array( $this, 'post_type_callback'), 'my-setting-admin', 'setting_section_id' );      

            add_settings_section( 'settings_replace_hosts', 'Hosts to replace', array( $this, 'print_replace_hosts_info' ), 'my-setting-admin' );  
			add_settings_field( 'dls-settings', 'List of hosts', array( $this, 'replace_hosts_callback'), 'my-setting-admin', 'settings_replace_hosts' );      

            add_settings_section( 'settings_auto_redirect_to_admin', 'Auto redirect to admin page', array( $this, 'print_auto_redirect_to_admin' ), 'my-setting-admin' );  
			add_settings_field( 'dls-settings', 'Auto redirect to admin page', array( $this, 'auto_redirect_to_admin_callback'), 'my-setting-admin', 'settings_auto_redirect_to_admin' );      

            add_settings_section( 'settings_wordpress_not_in_docker', 'Is Wordpress not running in docker?', array( $this, 'print_wordpress_not_running_in_docker' ), 'my-setting-admin' );  
			add_settings_field( 'dls-settings', 'Is Wordpress running in docker', array( $this, 'wordpress_not_in_docker_callback'), 'my-setting-admin', 'settings_wordpress_not_in_docker' );      

            add_settings_section( 'settings_overwrite_viewable_permalink', 'Overwrite the viewable permalink', array( $this, 'print_overwrite_viewable_permalink' ), 'my-setting-admin' );  
			add_settings_field( 'dls-settings', 'Overwrite the viewable permalink', array( $this, 'overwrite_viewable_permalink_callback'), 'my-setting-admin', 'settings_overwrite_viewable_permalink' );      
			add_settings_field( 'dls-settings-overwrite_viewable_permalink_host', 'Overwrite the viewable permalink host', array( $this, 'overwrite_viewable_permalink_host_callback'), 'my-setting-admin', 'settings_overwrite_viewable_permalink' );      

		}

		public function sanitize( $input ) {
			$new_input = array();
			if( isset( $input['id_number'] ) )
				$new_input['id_number'] = absint( $input['id_number'] );

			if( isset( $input['title'] ) )
				$new_input['title'] = sanitize_text_field( $input['title'] );

			return $input;
        }

		public function print_site_id() {
            print 'Set the site_id for this site. DO NOT CHANGE THIS SETTING LIGHTLY!';
		}

		public function print_preview_url() {
            print 'Set the preview url for this site (the url to the frontend).';
		}

		public function print_post_types_info() {
			print 'Choose which post types should be handled:';
		}

		public function print_replace_hosts_info() {
            print 'List of all hosts that should be removed. One per line. Important: Be careful with this replace/remove functionality. It will remove all instances of the text.';
        }

		public function print_auto_redirect_to_admin() {
            print 'Should we automatically redirect to the admin page?';
		}

		public function print_wordpress_not_running_in_docker() {
            print 'Is Wordpress not running in docker?';
		}

		public function print_overwrite_viewable_permalink() {
            print 'If we want to overwrite the vieable permalink when editing a page, this is where to do it';
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

		public function auto_redirect_to_admin_callback() {

            $value = get_option( 'dls_settings_auto_redirect_to_admin_page');
            $checked = $value == 'true' ? ' checked' : '';
            printf("<div><input type=\"checkbox\" name=\"dls_settings_auto_redirect_to_admin_page\" value=\"true\" $checked/> Yes</div>");

		}

		public function wordpress_not_in_docker_callback() {
            $value = get_option( 'dls_settings_wordpress_not_in_docker');
            $checked = $value == 'true' ? ' checked' : '';
            $not_in_docker_constant_exists = defined('RAWB_DLS_WP_NOT_IN_DOCKER');
            $disabled = $not_in_docker_constant_exists ? 'disabled' : '';
            printf("<div><input type=\"checkbox\" $disabled name=\"dls_settings_wordpress_not_in_docker\" value=\"true\" $checked/> Yes</div>");
		}

		public function overwrite_viewable_permalink_callback() {
			$value = get_option( 'dls_overwrite_viewable_permalink' );
            $checked = $value == 'true' ? ' checked' : '';
            printf("<div><input type=\"checkbox\" name=\"dls_overwrite_viewable_permalink\" value=\"true\" $checked/> Yes</div>");
		}

		public function overwrite_viewable_permalink_host_callback() {
			$value = get_option( 'dls_overwrite_viewable_permalink_host' );
            printf("<div><input style=\"width: 400px\" type=\"text\" name=\"dls_overwrite_viewable_permalink_host\" value=\"$value\" /></div>");
		}

		public function site_id_callback() {
			$value = get_option( 'dls_settings_site_id' );
            printf("<div><input style=\"width: 400px\" type=\"text\" name=\"dls_settings_site_id\" value=\"$value\" /></div>");
		}

		public function preview_url_callback() {
			$value = get_option( 'dls_settings_preview_url' );
            printf("<div><input style=\"width: 400px\" type=\"text\" name=\"dls_settings_preview_url\" value=\"$value\" /></div>");
		}


	}

