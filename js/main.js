(function() {
    function init() {
        var observer = new MutationObserver(function(mutRec) {
            if(mutRec.addedNodes) {
                walkAndGyllefy(Array.prototype.slice.call(mutRec.addedNodes));
            }
        });
        observer.observe(document.body, {
            childList: true,
            subtree: true
        });
        walkAndGyllefy(document.body);
    }

    function walkAndGyllefy(startPoint) {
        requestAnimationFrame(function() {
            var walker = document.createTreeWalker(startPoint, NodeFilter.SHOW_TEXT, null, false),
                next,
                textNodes = [];
            while(next = walker.nextNode()) textNodes.push(next);
            textNodes.forEach(function(textNode) {
                textNode.nodeValue = textNode.nodeValue.replace(/Neanderthal/gi, 'Gyllenhaal');
                textNode.nodeValue = textNode.nodeValue.replace(/Neandertal/gi, 'Gyllenhall');
            });
        });
    }

    init();
})();
