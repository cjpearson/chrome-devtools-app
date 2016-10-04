/* jshint evil:true */
/* global InspectorBackendClass */
var fs = require('fs'),
    protocol = require(__dirname + '/../protocol.json');

// Mock objects
Promise = require("es6-promise").Promise;
self = this;
window = {};
WebInspector = {};
InspectorBackend = {
    isInitialized: function () {
	return true;
    }
};

eval(fs.readFileSync(__dirname + '/../app/devtools/front_end/platform/utilities.js', 'utf8'));
eval(fs.readFileSync(__dirname + '/../app/devtools/front_end/common/Object.js', 'utf8'));
eval(fs.readFileSync(__dirname + '/../app/devtools/front_end/sdk/InspectorBackendHostedMode.js', 'utf8'));

var commands = WebInspector.InspectorBackendHostedMode.generateCommands(protocol);
var header = '// Auto-generated.\n' +
             '// Run `node --harmony scripts/generate-commands.js` to update.\n' +
             '\n';

fs.writeFileSync(__dirname + '/../app/devtools/front_end/InspectorBackendCommands.js', header + commands);

// Generate empty SupportedCSSProperties.js for now.
var supportedCSSPropertiesContent = 'WebInspector.CSSMetadata._generatedProperties = []';
fs.writeFileSync(__dirname + '/../app/devtools/front_end/SupportedCSSProperties.js', supportedCSSPropertiesContent);
