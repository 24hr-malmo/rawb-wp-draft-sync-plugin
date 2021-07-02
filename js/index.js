import hooks from './hooks';
import syncMetaBox from './sync-meta-box';
import adminSyncAll from './admin/sync-all';
import adminSyncOverview from './admin/sync-overview';

jQuery(document).ready(function ($) {

    // Turn off the pre publish dialog
    if (wp && wp.data && wp.data.dispatch) {
        wp.data.dispatch('core/editor').disablePublishSidebar();
    }

    hooks();

    let hookData = {};
    try {
        hookData = $('#dls-hooks').length > 0 ? JSON.parse($('#dls-hooks').html()) : { hook: ''} ;
    } catch (err) { };

    if (hookData.hook === 'post.php' || hookData.hook === 'post-new.php') {
        const isNewPost = hookData.hook === 'post-new.php';
        syncMetaBox($, isNewPost);
    } else if (hookData.hook === 'nav-menus.php') {
        syncMetaBox($);
    } else if (hookData.hook.includes('sync_page_draft-live-sync-reset')) {
        adminSyncAll($);
    } else if (hookData.hook.includes('sync_page_draft-live-sync-publish')) {
        adminSyncAll($);
    } else if (hookData.hook.includes('sync_page_draft-live-sync-check-sync')) {
        adminSyncOverview($);
    } else if (!hookData.hook.includes('.php')) {
        syncMetaBox($);
    }

});
