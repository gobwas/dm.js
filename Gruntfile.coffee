module.exports = (grunt) ->

  grunt.initConfig

    pkg: grunt.file.readJSON "package.json"

    clean:
      tmp:
        src: ["tmp"]
      test:
        src: ["test/dist"]

    copy:
      test:
        files: [
          expand: true
          cwd: "tmp/cjs/"
          src: ['**']
          dest: 'test/dist/'
        ]

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
      test:
        files:
          'test/dist/dm.js': ['tmp/cjs/**/*.js']
      dist:
        files:
          'dist/dm.js': ['tmp/cjs/**/*.js']

    mochaTest:
      test:
        options:
          reporter: "spec"
          ui:       "tdd"
          require: 'coffee-script'
        src: ['test/**/*.coffee']


  grunt.loadNpmTasks('grunt-es6-module-transpiler');
  grunt.loadNpmTasks('grunt-browserify');
  grunt.loadNpmTasks('grunt-contrib-clean');
  grunt.loadNpmTasks('grunt-mocha-test');
  grunt.loadNpmTasks('grunt-contrib-copy');

  grunt.registerTask "test",
    [
      "transpile:cjs"
      "copy:test"
      "clean:tmp"
      "mochaTest:test"
      "clean:test"
    ]
