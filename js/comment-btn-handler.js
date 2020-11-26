export default () => {
    const commentButton = jQuery('#comment-button');
    const input = jQuery('#comment-input');
const inputVal = input.val();
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
}
