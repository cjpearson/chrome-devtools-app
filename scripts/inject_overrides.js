var execSync = require('child_process').execSync,
    path = require('path'),
    fs = require('fs'),
    appBasePath = path.resolve(__dirname, '..', 'app');

function patchHostModuleDeclaration(){
    var customFrontEndHostFileName = 'CustomInspectorFrontendHost.js',
        frontEndModuleConfigFilePath = appBasePath + '/devtools/front_end/host/module.json',
        frontEndModuleConfig = require(frontEndModuleConfigFilePath);

    if(frontEndModuleConfig.scripts.indexOf(customFrontEndHostFileName) === -1){
        frontEndModuleConfig.scripts.unshift(customFrontEndHostFileName);
    }

    fs.writeFileSync(
        frontEndModuleConfigFilePath,
        JSON.stringify(frontEndModuleConfig, null, 4) + "\n"
    );

}

function addCustomFrontendHostSymlink(){
  var overrideFilePath = '../../../devtools_overrides/CustomInspectorFrontendHost.js',
      linkPath = appBasePath + '/devtools/front_end/host/CustomInspectorFrontendHost.js',
      symlinkCommand = 'ln -s ' +  overrideFilePath + ' ' + linkPath;

  if(!fs.existsSync(linkPath)){
      execSync(symlinkCommand);
  }
}

patchHostModuleDeclaration();
addCustomFrontendHostSymlink();
