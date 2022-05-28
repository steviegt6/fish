// ==UserScript==
// @name         Fishing
// @namespace    http://tomat.dev/
// @version      1.0.0
// @description  Tools to help you invest in rare fish and buy uncles.
// @author       Tomat & Rebmiami
// @match        https://www.traox.dev/fish/fish
// @icon         https://www.traox.dev/images/fish.png
// @grant        GM_xmlhttpRequest
// ==/UserScript==

(function() {
    'use strict';
    window.onload = function() {
        GM_xmlhttpRequest({
            method : "GET",
            url : "https://raw.githubusercontent.com/Steviegt6/fish/master/scripts/autofish.js",
            onload : (ev) =>
            {
                let s = document.createElement('script');
                s.type = "text/javascript";
                var code = ev.responseText;

                try {
                    s.appendChild(document.createTextNode(code));
                    document.body.appendChild(s);
                } catch(e) {
                    document.body.appendChild(s);
                }
            }
        });
    }
})();
