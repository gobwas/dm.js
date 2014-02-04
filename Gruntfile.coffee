module.exports = (grunt) ->

  grunt.initConfig

    pkg: grunt.file.readJSON "package.json"

    transpile:
      cjs:
        type: "cjs"
        files: [
          expand: true
          cwd: 'src/'
          src: ['**/*.js']
          dest: 'tmp/cjs'
        ]
      amd:
        type: "amd"
        files: [
          expand: true
          cwd: 'src/'
          src: ['**/*.js']
          dest: 'tmp/amd'
        ]

    browserify:
      dist:
        files:
          'dist/dm.js': ['tmp/cjs/**/*.js']


  grunt.loadNpmTasks('grunt-es6-module-transpiler');
  grunt.loadNpmTasks('grunt-browserify');

  grunt.registerTask "test",
    [
      "transpile:cjs",
      "browserify:dist"
    ]
