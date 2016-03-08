'use strict';

(function() {

    class Gyllenhaal {
        constructor(options) {
            options = options || {};
            this.replaceImages = options.replaceImages || false;
            this.pluralsWithMaggie = options.pluralsWithMaggie || false;
            this.images = {
                square: [ 'rsc/pics/s/1.jpg', 'rsc/pics/s/2.jpg', 'rsc/pics/s/4.jpg', 'rsc/pics/s/3.jpg' ],
                portrait: [ 'rsc/pics/p/1.jpg', 'rsc/pics/p/2.jpg', 'rsc/pics/p/3.jpg' ],
                landscape: [
                    'rsc/pics/l/1.jpg', 'rsc/pics/l/2.jpg', 'rsc/pics/l/3.jpg', 'rsc/pics/l/4.jpg',
                    'rsc/pics/l/5.jpg', 'rsc/pics/l/6.jpg', 'rsc/pics/l/7.jpg', 'rsc/pics/l/8.jpg',
                    'rsc/pics/l/9.jpg'
                ]
            };
            this.init();
        }

        init() {
            this.traverse(document.body);
            this.observe(document.body);
        }

        traverse(target) {
            var self = this;
            requestAnimationFrame(function() {
                var textNode,
                    walker = document.createTreeWalker(target, NodeFilter.SHOW_TEXT, null, false);
                while(textNode = walker.nextNode()) { self.gyllenText(textNode) }
                if(self.replaceImages && target.getElementsByTagName) {
                    Array.from(target.getElementsByTagName('img')).forEach(self.gyllenImage.bind(self));
                }
            });
        }

        observe(target) {
            var self = this;
            var observer = new MutationObserver(function(mutations, observer) {
                mutations.forEach(function(mutation) {
                    if(mutation.type === 'childList') {
                        Array.from(mutation.addedNodes).forEach(self.traverse.bind(self));
                    }
                });
            });
            observer.observe(target, { childList: true, subtree: true });
        }

        gyllenText(textNode) {
            var self = this,
                str = textNode.nodeValue;
            if(self.pluralsWithMaggie) {
                str = str.replace(/neanderthals/gi, 'Jake and Maggie Gyllenhaal');
                str = str.replace(/neandertals/gi, 'Jake and Maggie Gyllenhall');
            }
            str = str.replace(/neanderthal/gi, 'Jake Gyllenhaal');
            str = str.replace(/neandertal/gi, 'Jake Gyllenhall');
            textNode.nodeValue = str;
        }

        gyllenImage(img) {
            var self = this,
                ratio = img.width / img.height,
                src;
            if(ratio === 1) {
                src = self.images.square[self.randomInRange(self.images.square.length)];
            } else if(ratio < 1) {
                src = self.images.portrait[self.randomInRange(self.images.portrait.length)];
            } else {
                src = self.images.landscape[self.randomInRange(self.images.landscape.length)];
            }
            src = chrome.extension.getURL(src);
            img.src = src;
            img.srcset = src;
        }

        randomInRange(max) {
            return Math.floor(Math.random() * max);
        }
    }

    chrome.storage.sync.get({
        replaceImages: false,
        pluralsWithMaggie: false 
    }, function(options) {
        var gyllenhaal = new Gyllenhaal(options);
    });

})();
