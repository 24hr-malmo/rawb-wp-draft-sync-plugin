

const init = () => {
    if (wp.data) {

        let lastIsSaving = false;

        wp.data.subscribe(() => {
            const isSavingPost = wp.data.select('core/editor').isSavingPost();
            if (lastIsSaving !== isSavingPost) {
                const postId = wp.data.select('core/editor').getCurrentPostId();
                const comment = jQuery('#comment-input').val();
                jQuery.ajax({
                    type: 'POST',
                    url: '/wp-admin/admin-ajax.php',
                    data: {
                        action: 'save_comment',
                        post_id: postId,
                        comment,
                    }
                });
                lastIsSaving = isSavingPost
                const isSaved = wp.data.select('core/editor').didPostSaveRequestSucceed();
                if (isSaved) {
                    wp.hooks.doAction('dls.post-saved');
                }
            }
        });

    }

};

export default init;
