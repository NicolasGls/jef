"use strict";

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ('value' in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } }

var JEF = (function () {
    function JEF(viewSelector) {
        _classCallCheck(this, JEF);

        this.serv = {};
        this.serv.viewSelector = viewSelector, this.serv.viewHTMLElement = document.querySelector(this.serv.viewSelector), this.serv.viewportWidth = this.getViewportSize().width, this.serv.viewportHeight = this.getViewportSize().height, this.modules = {}, this.controllers = {}, this.extensions = {}, this.broadcast = {};

        // get view attr value
        this.serv.viewSeletorString = this.serv.viewSelector.replace('[', '');
        this.serv.viewSeletorString = this.serv.viewSeletorString.replace(']', '');

        // expose for API
        window.__JEF__ = {
            view: viewSelector,
            instance: this
        };
    }

    _createClass(JEF, [{
        key: 'addExtension',
        value: function addExtension(extension) {

            // Conventionally, JEF extensions are prefixed with "jef_".
            // This part is removed for something cleaner
            var functionName = String('jef_' + extension);

            // If the extension does not exist in the current instance of JEF,
            // it is added
            if (!this.extensions.hasOwnProperty(extension)) {
                this.extensions[extension] = window[functionName];
                this[extension] = window[functionName];
            }
        }
    }, {
        key: 'module',
        value: function module(moduleName, functionRef) {

            var reload = true,
                options = undefined;

            // If the first parameter is an object
            // this means that it customizes the module
            // The only customization available for the moment is
            // the ability to not restart the module during an ajax treatment
            if (typeof moduleName === 'object') {
                options = moduleName;
                moduleName = options.name;
                functionRef = options.action;
                reload = options.hasOwnProperty('reload') ? options.reload : reload;
            }

            // if the module does not exist
            if (!this.modules.hasOwnProperty(moduleName)) {

                // added to our instance of JEF
                this.modules[moduleName] = functionRef;

                // Here we define the behavior of the module facing a reloading ajax
                this.modules[moduleName].reload = reload;

                // the module is performed on load page
                document.addEventListener('onload', this.modules[moduleName](), false);
            } else {

                // else if the module exist
                try {

                    // we try to launch it on load page
                    document.addEventListener('onload', this.modules[moduleName](), false);
                } catch (e) {
                    console.log('[Jef] You probably have two modules of the same name:\n' + e);
                }
            }
        }
    }, {
        key: 'controller',
        value: function controller(controllerName, functionRef) {

            // if the controller does not exist
            if (!this.controllers.hasOwnProperty(controllerName)) {

                // added to our instance of JEF
                this.controllers[controllerName] = functionRef;

                // If this controller correspond to the current view
                if (String(this.serv.viewHTMLElement.getAttribute(this.serv.viewSeletorString)) === String(controllerName)) {

                    // the controller is performed on load page
                    document.addEventListener('onload', this.controllers[controllerName](), false);
                }
            } else {

                // else if the controller exist and if it correponding to the current view
                if (String(this.serv.viewHTMLElement.getAttribute(this.serv.viewSeletorString)) === String(controllerName)) {

                    // we try to launch it on load page
                    try {
                        document.addEventListener('onload', this.controllers[controllerName](), false);
                    } catch (e) {
                        console.log('[Jef] You probably have two controllers of the same name:\n' + e);
                    }
                }
            }
        }
    }, {
        key: 'init',
        value: function init() {

            // the method "init" allows to revive
            // controllers & modules eg in case of ajax call
            var module = undefined,
                controller = undefined,
                i = 0;

            // We recovery all the modules
            for (module in this.modules) {
                if (this.modules.hasOwnProperty(module)) {
                    if (this.modules[module].reload) this.modules[module]();
                }
            }

            // We recovery all controllers linked to the current view
            for (controller in this.controllers) {
                if (this.controllers.hasOwnProperty(controller)) {
                    try {
                        if (String(this.serv.viewHTMLElement.getAttribute(this.serv.viewSeletorString)) === String(Object.keys(this.controllers)[i])) {
                            this.controllers[controller]();
                        }
                    } catch (e) {
                        console.log('[Jef] The view is not defined:\n' + e);
                    }
                }
                i++;
            }
        }
    }, {
        key: 'getViewportSize',
        value: function getViewportSize() {
            return {
                width: Math.max(document.documentElement.clientWidth, window.innerWidth || 0),
                height: Math.max(document.documentElement.clientHeight, window.innerHeight || 0)
            };
        }
    }]);

    return JEF;
})();
//# sourceMappingURL=jef.js.map
