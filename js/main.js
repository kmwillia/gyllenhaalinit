'use strict';

(function() {

    // @class Gyllenhaal - Gyllifies the page
    // @params options {Object} List of options to initialise with
    class Gyllenhaal {
        constructor(options) {
            this.setDefaults(options);
            this.gyllify(document.body);
            this.observe(document.body);
        }

        // @method Sets certain default values
        // @params options {Object} List of options
        setDefaults(options) {
            options = options || {};
            this.replaceImages = options.replaceImages || false;
            this.regex = {
                neanderthal: /neanderth{0,1}als{0,1}/gi
            };
            this.substitutions = {
                neanderthal: 'Jake Gyllenhaal',
                neandertal: 'Jake Gyllenhall',
                neanderthals: options.pluralsWithMaggie ? 'Jake and Maggie Gyllenhaal' : 'Jake Gyllenhaals',
                neandertals: options.pluralsWithMaggie ? 'Jake and Maggie Gyllenhall' : 'Jake Gyllenhalls'
            }
            this.images = {
                portrait: [
                    'rsc/pics/p/1.jpg', 'rsc/pics/p/2.jpg', 'rsc/pics/p/3.jpg', 'rsc/pics/p/4.jpg',
                    'rsc/pics/p/5.jpg', 'rsc/pics/p/6.jpg', 'rsc/pics/p/7.jpg', 'rsc/pics/p/8.jpg',
                    'rsc/pics/p/9.png', 'rsc/pics/p/10.jpg', 'rsc/pics/p/11.jpg', 'rsc/pics/p/12.jpg',
                    'rsc/pics/p/13.jpg'
                ],
                landscape: [
                    'rsc/pics/l/1.jpg', 'rsc/pics/l/2.jpg', 'rsc/pics/l/3.jpg', 'rsc/pics/l/4.jpg',
                    'rsc/pics/l/5.jpg', 'rsc/pics/l/6.jpg', 'rsc/pics/l/7.jpg', 'rsc/pics/l/8.jpg',
                    'rsc/pics/l/9.jpg', 'rsc/pics/l/10.jpg', 'rsc/pics/l/11.jpg', 'rsc/pics/l/12.jpg',
                    'rsc/pics/l/13.jpg', 'rsc/pics/l/14.jpg', 'rsc/pics/l/15.jpg'
                ]
            };
            this.badElements = ['NOSCRIPT', 'SCRIPT', 'STYLE', 'LINK', 'META'];
            this.goodNodeTypes = [1, 9, 11];
        }

        // @method Gyllifies everything beneath the target Element
        // @params target {Element} Top level element to gyllify
        gyllify(target) {
            target = target || document.body;
            // Only process elements that can have text nodes
            if(this.goodNodeTypes.indexOf(target.nodeType) >= 0) {
                var str;
                var textNode;
                // Replace any substrings in all text nodes beneath the target element
                var walker = document.createTreeWalker(target, NodeFilter.SHOW_TEXT, null, null, false);
                while(textNode = walker.nextNode()) {
                    // Don't process text nodes under restricted tags
                    if(this.badElements.indexOf(textNode.parentElement.tagName) === -1) {
                        this.replaceNodeText(textNode);
                    }
                }
                // Replace any images with appropriately oriented Gyllenhaal images
                if(this.replaceImages) {
                    Array.from(target.querySelectorAll('img')).forEach(this.replaceImageSource.bind(this));
                }
            }
        }

        observe(target) {
            var obs = new MutationObserver((mutations) => {
                for(let mutation of mutations) {
                    if(mutation.type === 'childList') {
                        Array.from(mutation.addedNodes).forEach(this.gyllify.bind(this));
                    }
                }
            });
            obs.observe(target, {childList: true, subtree: true});
        }

        // @method Replaces certain substrings in the text of a given node
        // @params textNode {TextNode} TextNode to replace substrings in
        replaceNodeText(textNode) {
            var str = textNode.nodeValue;
            str = str.replace(this.regex.neanderthal, (match) => this.substitutions[match.toLowerCase()]);
            textNode.nodeValue = str;
        }

        // @method Replace img tag source and source set with a random Jake Gyllenhaal image
        // @params img {Image Element} Image element to switch the sources of
        replaceImageSource(img) {
            var imgRatio = img.width / img.height;
            var imgList = imgRatio <= 1 ? this.images.portrait : this.images.landscape;
            var imgSrc = chooseRandom(imgList);
            imgSrc = chrome.extension.getURL(imgSrc);
            img.src = imgSrc;
            img.srcset = imgSrc;
        }

    }

    // @method Selects a random item from the given array
    // @params arr {Array} Array of choices to select from
    // @returns Randomly selected item from the array
    function chooseRandom(arr) {
        arr = arr || [];
        return arr[Math.floor(Math.random() * arr.length)];
    }

    // Initialise
    chrome.storage.sync.get({
        replaceImages: false,
        pluralsWithMaggie: false
    }, (options) => { new Gyllenhaal(options); });

})();
