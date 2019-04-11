const syncOverview = ($) => {

    let settingsString = $('#dls-data').text();
    let settings = JSON.parse(settingsString);

    function checkDraftLive(resource) {

        return new Promise(function(resolve, reject) {

            let resourceDomItem = jQuery('li[data-resource="' + resource.permalink + '"]');
            let draftLiveStatus = resourceDomItem.find('.dls--resource--draft-live-status');

            draftLiveStatus.addClass('dsl-resource-checking');

            jQuery.ajax({
                type: "POST",
                url: settings.api.checkSyncUrl,
                data: {
                    action: 'check_sync',
                    api_path: resource.permalink,
                    only_draft_sync: 'true'
                }
            }).done(function(status) {

                if (!status) {
                    draftLiveStatus.removeClass('dsl-resource-checking').removeClass('dsl-resource-unchecked');
                    draftLiveStatus.addClass('dsl-resource-error');

                    // Give it a little time
                    setTimeout(function() {
                        resolve(status);
                    }, 300);
                }

                draftLiveStatus.removeClass('dsl-resource-checking').removeClass('dsl-resource-unchecked');
                if (status.inSync === true) {
                    draftLiveStatus.addClass('dsl-resource-live');
                } else if (status.inSync === false) {
                    draftLiveStatus.addClass('dsl-resource-not-insync');
                } else {
                    draftLiveStatus.addClass('dsl-resource-error');
                }

                // Give it a little time
                setTimeout(function() {
                    resolve(status);
                }, 300);

            }).fail(function(xhr, status, error) {

                draftLiveStatus.removeClass('dsl-resource-checking').removeClass('dsl-resource-unchecked');
                draftLiveStatus.addClass('dsl-resource-error');

                // Give it a little time
                setTimeout(function() {
                    resolve(status);
                }, 300);

            });

        });

    }


    function checkWpDraft(resource) {

        return new Promise(function(resolve, reject) {

            let resourceDomItem = jQuery('li[data-resource="' + resource.permalink + '"]');
            let wpDraftStatus = resourceDomItem.find('.dls--resource--wp-draft-status');

            wpDraftStatus.addClass('dsl-resource-checking');

            jQuery.ajax({
                type: "POST",
                url: settings.api.checkSyncUrl,
                data: {
                    action: 'check_sync',
                    //only_draft_sync: true,
                    api_path: resource.permalink
                }
            }).done(function(status) {

                if (!status) {
                    wpDraftStatus.removeClass('dsl-resource-checking').removeClass('dsl-resource-unchecked');
                    wpDraftStatus.addClass('dsl-resource-error');

                    // Give it a little time
                    setTimeout(function() {
                        resolve(status);
                    }, 200);
                }

                wpDraftStatus.removeClass('dsl-resource-checking').removeClass('dsl-resource-unchecked');
                if (status.inSyncSourceAndDraft === true) {
                    wpDraftStatus.addClass('dsl-resource-insync');
                } else if (status.inSyncSourceAndDraft === false) {
                    wpDraftStatus.addClass('dsl-resource-not-insync');
                } else {
                    wpDraftStatus.addClass('dsl-resource-error');
                }

                // Give it a little time
                setTimeout(function() {
                    resolve(status);
                }, 50);

            }).fail(function(xhr, status, error) {

                wpDraftStatus.removeClass('dsl-resource-checking').removeClass('dsl-resource-unchecked');
                wpDraftStatus.addClass('dsl-resource-error');

                // Give it a little time
                setTimeout(function() {
                    resolve(status);
                }, 200);

            });

        });

    }

    jQuery.ajax({
        type: "POST",
        url: "/wp-admin/admin-ajax.php",
        data: {
            action: 'get_all_resources'
        }
    }).done(function( result ) {

        let container = jQuery('#dls--resource-list');

        let statusMarker = '<div class="dls--resource--wp-draft-status"><svg height="10" width="10"><circle cx="5" cy="5" r="5" stroke-width="0" /></svg></div><div class="dls--resource--draft-live-status"><svg height="10" width="10"><circle cx="5" cy="5" r="5" stroke-width="0" /></svg></div>';

        let resourceItems = result.list.map(resource => {
            return jQuery('<li class="dls--resource-item dls--resource-unchecked" data-resource="' + resource.permalink + '"><div class="dls--resource-item-type-container"><div class="dls--resource-item-type">' + resource.type + '</div></div>' + statusMarker + '<a href="' + resource.permalink + '" class="dls--resource--name" target="_blank">' + resource.permalink + '</a></li>');
        });

        container.html(resourceItems);


        jQuery('#draft-sync--check-wpdraft-button').on('click', function() {

           let doneWpDraft = result.list.reduce(function (promise, resource) {
                return promise.then(function() {
                    return checkWpDraft(resource);
                });
            }, Promise.resolve());

        });

        jQuery('#draft-sync--check-draftlive-button').on('click', function() {

            let doneDraftLive = result.list.reduce(function (promise, resource) {
                return promise.then(function() {
                    return checkDraftLive(resource);
                });
            }, Promise.resolve());

        });



    });

};

export default syncOverview;
