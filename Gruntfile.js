module.exports = function(grunt) {

    grunt.initConfig({

        nodewebkit: {
            options: {
                platforms: ['osx'],
                buildDir: './build',
                macIcns: './app/icon/logo.icns'
            },
            src: ['./app/**/*']
        },

        shell: {
            runApp: {
                command: require('nw').findpath() + ' ./app'
            },
            runAppDebug: {
                command: require('nw').findpath() + ' ./app --remote-debugging-port=9222'
            }
        }

    });

    require('load-grunt-tasks')(grunt);

    grunt.registerTask('build', ['nodewebkit']);
    grunt.registerTask('run', ['shell:runApp']);
    grunt.registerTask('runDebug', ['shell:runAppDebug']);

}
