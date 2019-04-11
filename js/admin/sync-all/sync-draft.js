const syncDraft = ($) => {

    let settingsString = $('#dls-data').text();
    let percentContainer = $('#dls--percent');
    let settings = JSON.parse(settingsString);
    let total = 0;
    let current = 0;

    function sync(resource) {

        return new Promise(function(resolve, reject) {

            let resourceDomItem = jQuery('li[data-resource="' + resource.permalink + '"]');
            let wpDraftStatus = resourceDomItem.find('.dls--resource--wp-draft-status');

            wpDraftStatus.addClass('dsl-resource-checking');

            jQuery.ajax({
                type: "POST",
                url: settings.api.syncUrl,
                data: {
                    action: 'sync',
                    api_path: resource.permalink,
                    release: settings.release || 'draft',
					sync_check: false,
                },
                timeout: 10000,
            }).done(function(status) {

                current++;
                percentContainer.text(Math.round(current / total * 1000) / 10 + '%');

                if (!status) {
                    wpDraftStatus.removeClass('dsl-resource-checking').removeClass('dsl-resource-unchecked');
                    wpDraftStatus.addClass('dsl-resource-error');

                    // Give it a little time
                    setTimeout(function() {
                        resolve(status);
                    }, 200);
                }

                wpDraftStatus.removeClass('dsl-resource-checking').removeClass('dsl-resource-unchecked');

                if (settings.release === 'live') {
                    if (status && status.inSync === true) {
                        wpDraftStatus.addClass('dsl-resource-insync');
                    } else if (status && status.inSync === false) {
                        wpDraftStatus.addClass('dsl-resource-not-insync');

                   } else {
                        wpDraftStatus.addClass('dsl-resource-error');
                    }
                } else {
                    if (status && status.inSyncSourceAndDraft === true) {
                        wpDraftStatus.addClass('dsl-resource-insync');
                    } else if (status && status.inSyncSourceAndDraft === false) {

                        wpDraftStatus.addClass('dsl-resource-update-done');
                        //wpDraftStatus.addClass('dsl-resource-not-insync');

                        // Show the diff
                        /*try {
                            let diffResult = '';
                            let diffColors = [];
                            let diff = JsDiff.diffChars(JSON.stringify(status.content.draft), JSON.stringify(status.content.source.data));

                            diff.forEach(function(part){
                                let color = part.added ? 'color: #00ff00' : part.removed ? 'color: #ff0000' : 'color: #666666';
                                diffResult += `%c${part.value}`;
                                diffColors.push(color);
                            });

                            let diffTotal = [diffResult].concat(diffColors);

                            console.warn.apply(this, diffTotal);
                        } catch (err) {
                            console.log('diff error in draft live sync check', err);
                        }*/

                    } else {
                        wpDraftStatus.addClass('dsl-resource-error');
                    }
                }

                // Give it a little time
                setTimeout(function() {
                    resolve(status);
                }, 10);

            }).fail(function(xhr, status, error) {

                current++;
                percentContainer.text(Math.round(current / total * 1000) / 10 + '%');

                wpDraftStatus.removeClass('dsl-resource-checking').removeClass('dsl-resource-unchecked');
                wpDraftStatus.addClass('dsl-resource-error');

                // Give it a little time
                setTimeout(function() {
                    resolve(status);
                }, 2000);

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

        current = 0;
        total = result.list.length;
        percentContainer.text('0%');

        let statusMarker = '<div class="dls--resource--wp-draft-status dls--clickable"><svg height="20" width="20"><circle cx="10" cy="10" r="5" stroke-width="2" /></svg></div></div>';

        let resourceItems = result.list.map(resource => {
            let item = jQuery('<li class="dls--resource-item dls--resource-unchecked" data-resource="' + resource.permalink + '"><div class="dls--resource-item-type-container"><div class="dls--resource-item-type" data-resource-type="' + resource.type + '">' + resource.type + '</div></div>' + statusMarker + '<a class="dls--resource--name" href="' + resource.permalink + '" target="_blank">' + resource.permalink + '</a></li>');
            item.find('.dls--resource--wp-draft-status').on('click', function(e) {
                let element = jQuery(this.parentNode);
                let permalink = element.attr('data-resource');
                return sync({permalink:permalink});
            });
            item.find('.dls--resource-item-type').on('click', function(e) {

                let element = jQuery(this);
                let type = element.attr('data-resource-type');
                let allOfSameType = result.list.filter(resource => resource.type === type);

                let ok = true;
                if (settings.release === 'live') {
                    ok = confirm('Are you sure you want to publish EVERYTHING to LIVE?');
                }
                if (ok) {
                    let doneWpDraft = allOfSameType.reduce(function (promise, resource) {
                        return promise.then(function() {
                            return sync(resource);
                        });
                    }, Promise.resolve());
                }

            });
            return item;
        });

        jQuery('#draft-sync--reset-button').on('click', function() {
            let ok = true;
            if (settings.release === 'live') {
                ok = confirm('Are you sure you want to publish EVERYTHING to LIVE?');
            }
            if (ok) {
                let doneWpDraft = result.list.reduce(function (promise, resource) {
                    return promise.then(function() {
                        return sync(resource);
                    });
                }, Promise.resolve());
            }
        });

        container.html(resourceItems);

    });

};

export default syncDraft;
