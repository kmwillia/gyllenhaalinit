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
            console.error(error);
        });

        Array.from(document.getElementsByClassName('option-block')).forEach(function(el) {
            el.addEventListener('click', optionsClickDispatch);
        });
    }

    function updateView(options) {
        for(var key in options) {
            if(options.hasOwnProperty(key)) {
                let el = document.getElementById(key);
                if(el) {
                    let elType = el.getAttribute('type');
                    if(elType === 'checkbox') {
                        el.checked = options[key];
                        toggleContainerHighlight(el.parentNode, options[key]);
                    } else {
                        el.value = options[key];
                    }
                }
            }
        }
    }

    function updateData(options) {
        saveOptions(options).catch(function(error) {
            console.error(error);
        });
    }

    function optionsClickDispatch(e) {
        if(e.target.classList.contains('option-input')) {
            var options = {},
                elType = e.target.getAttribute('type'),
                value;

            if(elType === 'checkbox') {
                value = e.target.checked;
                toggleContainerHighlight(e.target.parentNode, e.target.checked);
            } else {
                value = e.target.value;
            }

            options[e.target.id] = value;
            updateData(options);
        }
    }

    function toggleContainerHighlight(container, selected) {
        container.classList.toggle('selected', selected);
    }

    init();

})();
