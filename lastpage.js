/** 
 * @description MeshCentral LastPage Plugin
 * @author Ryan Blenis
 * @copyright 
 * @license Apache-2.0
 */

"use strict";

module.exports.lastpage = function(parent) {
    var obj = {};
    obj.parent = parent;
    obj.exports = [
        'goPageStart',
        'onDeviceRefreshEnd',
        'onWebUIStartupEnd',
        'get',
        'put'
    ];

    obj.goPageStart = function(x, event) {
        if (x == 0) return; // offline page
        if (x == 1 && event == null) return; // main page without being clicked
        if (x == 43) x = 42; // plugin specific page back to plugin list
        var d = pluginHandler.lastpage.get();
        d.page = x;
        pluginHandler.lastpage.put(d);
    };

    obj.onDeviceRefreshEnd = function() {
        var d = pluginHandler.lastpage.get();
        d.device = currentNode._id;
        pluginHandler.lastpage.put(d);
    };

    obj.onWebUIStartupEnd = function() {
        setTimeout(function() {
            try {
                var d = pluginHandler.lastpage.get();
                ['device', 'page'].forEach(function(type) {
                    switch (type) {
                        case 'page':
                            go(d[type]);
                            break;
                        case 'device':
                            gotoDevice(d[type]);
                            break;
                    }
                });
            } catch (e) { pluginHandler.lastpage.onWebUIStartupEnd(); }
        }, 100);
    };

    obj.get = function() {
        var d = getstore('plugin_LastPage', { page: 1 });
        try { return JSON.parse(d); } catch (e) { return { page: 1 }; }
    };

    obj.put = function(o) {
        putstore('plugin_LastPage', JSON.stringify(o));
    };

    return obj;
}