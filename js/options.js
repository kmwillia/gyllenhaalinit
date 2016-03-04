function saveOptions(options) {
    var p = new Promise(function(resolve, reject) {
        chrome.storage.sync.set(options, function() {
            chrome.runtime.lastError ? reject(chrome.runtime.lastError) : resolve();
        });
    });
}

function getOptions(options) {
    var p = new Promise(function(resolve, reject) {
        chrome.storage.sync.get(options, function(items) {
            chrome.runtime.lastError ? reject(chrome.runtime.lastError) : resolve(items);
        });
    });
}
