const init = () => {

    if (wp.data) {

        let lastIsSaving = false;

        wp.data.subscribe(() => {
            const isSavingPost = wp.data.select('core/editor').isSavingPost();
            if (lastIsSaving !== isSavingPost) {
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
