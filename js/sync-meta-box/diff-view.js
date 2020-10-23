export default ($, postData) => {
console.log('🤯 🤢 🤮: postData', postData)
    const btn = $('#draft-live-diff');
    btn.off('click'); // Prevent double event bindings

    btn.on('click', e => {
        e.preventDefault();
        getDiff();
    });

    function getDiff() {
        $.post(ajaxurl, {
            action: 'get_sync_diff',
            contentType: 'application/json',
            post_id: postData.postId,
        }).done(data => {
            console.log('Got data', data);
        });
    }
};
