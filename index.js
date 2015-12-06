var self = require('sdk/self');

// a dummy function, to show how tests work.
// to see how to test this function, look at test/test-index.js
function dummy(text, callback) {
    callback(text);
}

exports.dummy = dummy;

/*
var buttons = require('sdk/ui/button/action');
var tabs = require("sdk/tabs");

var button = buttons.ActionButton({
    id: "mozilla-link",
    label: "Visit Mozilla",
    icon: {
        "16": "./icon-16.png",
        "32": "./icon-32.png",
        "64": "./icon-64.png"
    },
    onClick: handleClick
});

function handleClick(state) {
    tabs.open("http://sembritzki.me/test.php");
    tabs.open("https://panopticlick.eff.org/index.php?action=log&js=yes");
}
*/

function intercept({subject: window}) {
    console.log("intercept()");

    Object.defineProperty(window.wrappedJSObject.Navigator.prototype, 'plugins', {
        get: function () {
            console.log("someone tried to access navigator.plugins");
            return {};
        }
    });

    Object.defineProperty(window.wrappedJSObject.Navigator.prototype, 'mimeTypes', {
        get: function () {
            console.log("faking return of navigator.mimeTypes");
            return {};
        }
    });
    /*Object.defineProperty(window.wrappedJSObject.PluginArray.prototype, 'length', {
     value: 0
     });*/
};

const { when: unload } = require("sdk/system/unload");
const observers = require("sdk/system/events");
observers.on("content-document-global-created", intercept);
unload(function () {
    observers.off("content-document-global-created", intercept);
});

