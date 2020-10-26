function generateModalMarkup(diffHtml) {
    const skeleton = `
    <style>
        .diff-modal {
            box-sizing: border-box;
            padding: 5px;
            position: fixed;
            top: 50%;
            left: 50%;
            transform: translate(-50%, -50%);
            width: 100%;
            height: 100%;
            overflow-x: hidden;
            overflow-y: auto;
            z-index: 1000000000000;
            background-color: white;
        }

        .diff-modal--close-btn-wrapper {
            display: flex;
            padding: 0 10px;
        }

        .diff-modal--close-btn-wrapper button.diff-modal--close-btn {
            margin-bottom: 5px;
            margin-left: auto;
        }
    </style>
    <div class="diff-modal">
        <div class="diff-modal--close-btn-wrapper">
            <button class="button diff-modal--close-btn">Close</button>
        </div>
        ${diffHtml}
    </div>
`;
    return skeleton;
}

export default ($, postData) => {
    const btn = $('#draft-live-diff');
    if (!btn.length) {
        return;
    }
    btn.prop('disabled', false);

    btn.off('click'); // Prevent double event bindings

    btn.on('click', e => {
        e.preventDefault();
        getDiff();
    });

    $(document).on('click', '.button.diff-modal--close-btn', closeModal);

    function renderModal(html) {
        $('body').append(html);
        $('body').css('overflow', 'hidden');
    }

    function closeModal() {
        $('body').css('overflow', 'auto');
        $('.diff-modal').remove();
    }

    function getDiff() {
        btn.prop('disabled', true);
        $.post(ajaxurl, {
            action: 'get_diff',
            contentType: 'application/json',
            post_id: postData.postId,
        }).done(data => {
            const diffhHtml = JSON.parse(data).data;
            const html = generateModalMarkup(diffhHtml);
            renderModal(html);
            btn.prop('disabled', false);
        });
    }
};
