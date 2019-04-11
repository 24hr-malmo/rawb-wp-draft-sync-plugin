
const syncMetaBox = ($) => {

    wp.hooks.addAction('dls.post-saved', 'dls', () => {
        check();
    });

    let postDataString = $('#dls-post-data').text();

    let postData = JSON.parse(postDataString);

    var syncButton = jQuery('#publish-to-live');
    var unpublishButton = jQuery('#unpublish-from-live');

    var syncStatus = jQuery('#status-of-wp-draft');
    var syncButtonEnabled = false;
    var unpublishButtonEnabled = false;

    let autoSyncDraftCounter = 0;

    function setSyncStatus(result) {

        if (!result) {
            console.error('error in sync check');
            return;
        }

        syncStatus.removeClass('dsl--message-processing');

        if (result.error) {
            syncButton.html('Error');
            syncStatus.html('Error getting content status');
            syncStatus.addClass('dlsc--wp-not-in-sync');
            return;
        }

        if (result.contentInLive) {
            unpublishButton.removeClass('button-disabled');
            unpublishButton.html('Unpublish from live site (public)');
            unpublishButtonEnabled = true;
        } else {
            unpublishButton.addClass('button-disabled');
            unpublishButton.html('Unpublish from live site (public)');
            unpublishButtonEnabled = false;
        }


        if (result.inSync) {
            syncButton.html('Published to live site (public)');
            syncButton.addClass('button-disabled');
            syncButtonEnabled = false;

        } else {
            syncButton.html('Publish to live site (public)');
            syncButton.removeClass('button-disabled');
            syncButtonEnabled = true;
        }

        if (result.inSyncSourceAndDraft) {

            syncStatus.html('Published to draft site (non-public)');
            syncStatus.removeClass('dlsc--wp-not-in-sync');

        } else {

            if (result.contentInDraft) {
                syncStatus.addClass('dlsc--wp-not-in-sync');

                if (autoSyncDraftCounter < 3) {

                    syncStatus.html('Draft not in sync.<br/>Trying to auto-sync... Please wait.');

                    autoSyncDraftCounter++;

                    jQuery.ajax({
                        type: "POST",
                        url: "/wp-admin/admin-ajax.php",
                        data: {
                            action: 'save_to_draft',
                            post_id: postData.postId,
                            api_path: postData.apiPath,
                        }
                    }).done(function( msg ) {
                        setSyncStatus(msg);
                    });

                } else {
                    syncStatus.html('Draft not in sync.<br/>Could not auto-sync. Please save to draft.');
                }
 
            } else {
                syncStatus.addClass('dlsc--wp-not-saved');
                syncStatus.html('Draft not saved');
            }

            syncButton.addClass('button-disabled');
            syncButtonEnabled = false;

        }

    }

    const check = () => {

        jQuery.ajax({
            type: "POST",
            url: "/wp-admin/admin-ajax.php",
            data: {
                action: 'check_sync',
                post_id: postData.postId,
                api_path: postData.apiPath,
            }
        }).done(function( msg ) {

            setSyncStatus(msg);

            syncButton.off('click').on('click', function() {
                if (syncButtonEnabled) {

                    let ok = confirm('This will publish the content to the public live site. Are you sure?');

                    if (ok) {

                        syncStatus.addClass('dsl--message-processing');
                        syncStatus.html('Publishing...');
                        //syncButton.html('Publishing...');
                        syncButton.addClass('button-disabled');

                        jQuery.ajax({
                            type: "POST",
                            url: "/wp-admin/admin-ajax.php",
                            data: {
                                action: 'publish_to_live',
                                post_id: postData.postId,
                                api_path: postData.apiPath,
                            }
                        }).done(function( msg ) {
                            setSyncStatus(msg);
                        });
                    }
                }
            });

            unpublishButton.off('click').on('click', function() {
                if (unpublishButtonEnabled) {

                    let ok = confirm('Are you sure you want to unpublish the page from the live site?');

                    if (ok) {

                        syncStatus.addClass('dsl--message-processing');
                        syncStatus.html('Unpublishing...');
                        //unpublishButton.html('Unpublishing...');
                        unpublishButton.addClass('button-disabled');

                        jQuery.ajax({
                            type: "POST",
                            url: "/wp-admin/admin-ajax.php",
                            data: {
                                action: 'unpublish_from_live',
                                post_id: postData.postId,
                                api_path: postData.apiPath,
                            }
                        }).done(function( msg ) {

                            jQuery.ajax({
                                type: "POST",
                                url: "/wp-admin/admin-ajax.php",
                                data: {
                                    action: 'check_sync',
                                    post_id: postData.postId,
                                    api_path: postData.apiPath,
                                }
                            }).done(function( msg ) {
                                setSyncStatus(msg);
                            });

                        });

                    }
                }
            });

        });

    };

    check();

};

export default syncMetaBox;

