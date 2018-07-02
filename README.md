# rawb-wp-draft-sync-plugin
The main plugin for our headless wp integration

Misc docs:

## Add additional endpoints that should be synced:

In you theme, just add a filter:

```php
// Add additional endpoi9nts specific for this site to draftf sync
function rawb_add_additional_endpoints($list) {
    array_push($list, array('footer', '/json/api/general/footer'));
    array_push($list, array('header', '/json/api/general/header'));
    array_push($list, array('translations', '/json/api/general/translations'));
    array_push($list, array('general', '/json/api/general/general'));
    array_push($list, array('gtm', '/json/api/general/gtm'));
    array_push($list, array('rate-calculator', '/json/api/general/rate-calculator'));
    return $list;
}
add_filter('dls_additional_endpoints', 'rawb_add_additional_endpoints', 10, 1);
```

