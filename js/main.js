'use strict';

(function() {
    var images = {
        square: [
            'resources/gyllenhaal/gyllenhaal-16.jpg',
            'resources/gyllenhaal/gyllenhaal-15.jpg',
            'resources/gyllenhaal/gyllenhaal-14.jpg',
            'resources/gyllenhaal/gyllenhaal-13.jpg'
        ],
        portrait: [
            'resources/gyllenhaal/gyllenhaal-12.jpg',
            'resources/gyllenhaal/gyllenhaal-11.jpg',
            'resources/gyllenhaal/gyllenhaal-10.jpg'
        ],
        landscape: [
            'resources/gyllenhaal/gyllenhaal-9.jpg',
            'resources/gyllenhaal/gyllenhaal-8.jpg',
            'resources/gyllenhaal/gyllenhaal-7.jpg',
            'resources/gyllenhaal/gyllenhaal-6.jpg',
            'resources/gyllenhaal/gyllenhaal-5.jpg',
            'resources/gyllenhaal/gyllenhaal-4.jpg',
            'resources/gyllenhaal/gyllenhaal-3.jpg',
            'resources/gyllenhaal/gyllenhaal-2.jpg',
            'resources/gyllenhaal/gyllenhaal-1.jpg',
        ]
    };

    function traverse(el) {
        var walker = document.createTreeWalker(el, NodeFilter.SHOW_TEXT, null, false),
            n;
        while(n = walker.nextNode()) gyllenText(n);
        if(el.getElementsByTagName) {
            Array.prototype.slice.call(el.getElementsByTagName('img')).forEach(gyllenImage);
        }
    }

    function gyllenText(n) {
        window.requestAnimationFrame(function() {
            n.nodeValue = n.nodeValue.replace(/neanderthal/ig, 'Jake Gyllenhaal');
            n.nodeValue = n.nodeValue.replace(/neandertal/ig, 'Jake Gyllenhall');
        });
    }

    function gyllenImage(img) {
        var ratio = img.width / img.height,
            src;
        if(ratio === 1) {
            src = chrome.extension.getURL(images.square[randomInRange(images.square.length)]);
        } else if(ratio < 1) {
            src = chrome.extension.getURL(images.portrait[randomInRange(images.portrait.length)]);
        } else {
            src = chrome.extension.getURL(images.landscape[randomInRange(images.landscape.length)]);
        }
        window.requestAnimationFrame(function() {
            img.src = src || img.src;
            img.srcset = src || img.srcset;
        });
    }

    function randomInRange(n) {
        return Math.floor(Math.random() * n);
    }

    function init() {
        traverse(document.body);
        var mutObs = new MutationObserver(function(mutations, observer) {
            mutations.forEach(function(mutation) {
                if(mutation.type === 'childList') {
                    Array.prototype.slice.call(mutation.addedNodes).forEach(traverse);
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
