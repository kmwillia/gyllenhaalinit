'use strict';

(function() {
    function saveOptions(options) {
        return new Promise(function(resolve, reject) {
            chrome.storage.sync.set(options, function() {
                chrome.runtime.lastError ? reject(chrome.runtime.lastError) : resolve();
            });
        });
    }

    function getOptions(options) {
        return new Promise(function(resolve, reject) {
            chrome.storage.sync.get(options, function(items) {
                chrome.runtime.lastError ? reject(chrome.runtime.lastError) : resolve(items);
            });
        });
    }

    function init() {
        getOptions({
            replaceImages: false,
            pluralsWithMaggie: false
        }).then(function(options) {
            updateView(options);
        }).catch(function(error) {
            console.log(error);
        });

        Array.from(document.getElementsByClassName('option-block')).forEach(function(el) {
            el.addEventListener('click', optionsClickDispatch);
        });
    }

    function updateView(options) {
        console.log(options);
        for(var key in options) {
            if(options.hasOwnProperty(key)) {
                let el = document.getElementById(key);
                if(el) {
                    let elType = el.getAttribute('type');
                    if(elType === 'checkbox') {
                        el.checked = options[key];
                    } else {
                        el.value = options[key];
                    }
                }
            }
        }
    }

    function updateData(options) {
        console.log(options);
        saveOptions(options).catch(function(error) {
            console.log(error);
        });
    }

    function optionsClickDispatch(e) {
        if(e.target.classList.contains('option-input')) {
            var options = {},
                elType = e.target.getAttribute('type'),
                value;

            if(elType === 'checkbox') {
                value = e.target.checked;
            } else {
                value = e.target.value;
            }

            options[e.target.id] = value;
            updateData(options);
        }
    }

    init();

})();
