'use strict';

(function() {
    function traverse(el) {
        var n,
            walk = document.createTreeWalker(el, NodeFilter.SHOW_TEXT, null, false);
        while(n = walk.nextNode()) gillefy(n);
    }

    function gillefy(n) {
        n.nodeValue = n.nodeValue.replace(/neanderthal/ig, 'Jake Gyllenhaal');
        n.nodeValue = n.nodeValue.replace(/neandertal/ig, 'Jake Gyllenhall');
    }

    function init() {
        traverse(document.body);
        var mutObs = new MutationObserver(function(mutations, observer) {
            mutations.forEach(function(mutation) {
                if(mutation.type === 'childList') {
                    Array.prototype.slice.call(mutation.addedNodes).forEach(function(n) {
                        traverse(n);
                    });
                }
            });
        });
        mutObs.observe(document.body, {
            childList: true,
            characterData: true,
            subtree: true
        });
    }
    init();
})();
