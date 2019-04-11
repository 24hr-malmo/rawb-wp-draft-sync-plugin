const syncTree = ($) => {

    let settingsString = $('#dls-data').text();
    let settings = JSON.parse(settingsString);
    let button = jQuery('#draft-sync--reset-tree-button');
    let status = jQuery('#draft-sync--status-message');
    let statusTimeout = -1;

    function setStatus(message) {
        clearTimeout(statusTimeout);
        status.text(message);
    }

    function clearStatus() {
        clearTimeout(statusTimeout);
        setTimeout(function() {
            setStatus('');
        }, 3000);
    }

    button.on('click', function() {

        setStatus('Creating tree...');

        let ok = true;
        if (settings.release === 'live') {
            ok = confirm('Are you sure you want to the tree to LIVE?');
        }
        if (ok) {
            recreateTree();
        };

    });

    function recreateTree() {

        jQuery.ajax({
            type: "POST",
            url: "/wp-admin/admin-ajax.php",
            data: {
                action: 'reset_tree',
                target: settings.release || 'draft',
            }
        }).done(function( result ) {
            setStatus('The tree has been created.');
            clearStatus();
        });

    }

};

export default syncTree;
