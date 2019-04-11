import syncDraft from './sync-draft';
import syncTree from './sync-tree';

const init = ($) => {

    syncDraft($);
    syncTree($);

};

export default init;
