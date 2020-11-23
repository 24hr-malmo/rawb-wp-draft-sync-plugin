import draftLiveDiffBtnHandler from './diff-view';

const commentButton = jQuery('#comment-button');
const input = jQuery('#comment-input');

if(input.val()) {
    commentButton.text('Hide comment')
    input.removeClass('display-none');
}

commentButton.off('click').on('click', function() {

    if(input.hasClass('display-none') && input.val()) {
        commentButton.text('Hide comment');
        input.removeClass('display-none');
    } else if(input.val()) {
        commentButton.text('View comment');
        input.addClass('display-none');
    } else if(!input.hasClass('display-none') && !input.val()) {
        input.addClass('display-none');
    } else {
        input.removeClass('display-none');
    } 

});

const syncMetaBox = ($) => {

    let postDataString = $('#dls-post-data').text();

    if (!postDataString) {
        console.warn('Draft Live Sync plugin not activated for this post type');
        return;
    }


    // Dont run this if its an older version of wp or not running gutenberg
    if (wp && wp.hooks && wp.hooks.addAction) {
        wp.hooks.addAction('dls.post-saved', 'dls', () => {
            check();
        });
    }

    let postData = JSON.parse(postDataString);
    var syncButton = jQuery('#publish-to-live');
    var unpublishButton = jQuery('#unpublish-from-live');
    draftLiveDiffBtnHandler($, postData);
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
            syncStatus.removeClass('dlsc--wp-not-in-sync-retrying');

        } else {

            if (result.contentInDraft) {

                if (autoSyncDraftCounter < 3) {

                    syncStatus.addClass('dlsc--wp-not-in-sync-retrying');

                    syncStatus.html('Draft not in sync.<br/>Trying to auto-sync... Please wait.');

                    autoSyncDraftCounter++;

                    const input = jQuery('#comment-input');
                    const comment = input.val();

                    jQuery.ajax({
                        type: "POST",
                        url: "/wp-admin/admin-ajax.php",
                        data: {
                            action: 'save_to_draft',
                            post_id: postData.postId,
                            api_path: postData.apiPath,
                            comment: comment,
                        }
                    }).done(function( msg ) {
                        setSyncStatus(msg);
                    });

                } else {
                    syncStatus.removeClass('dlsc--wp-not-in-sync-retrying');
                    syncStatus.addClass('dlsc--wp-not-in-sync');
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

        const input = jQuery('#comment-input');

        const comment = input.val();

        jQuery.ajax({
            type: "POST",
            url: "/wp-admin/admin-ajax.php",
            data: {
                action: 'check_sync',
                post_id: postData.postId,
                api_path: postData.apiPath,
                comment: comment,
            }
        }).done(function( msg ) {

            setSyncStatus(msg);

            syncButton.off('click').on('click', function() {
                if (syncButtonEnabled) {

                    let ok = confirm('This will publish the content to the public live site. Are you sure?');

                    if (ok) {

                        if(comment) {
                            let confirmation = confirm('There is a flag/comment connected to this post, are you really sure you want to publish this to the public live site?');

                            input.val('');
                            input.addClass('display-none');
                            jQuery('#comment-button').text('Add comment');

                            if(confirmation) {
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

                        } else {

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

