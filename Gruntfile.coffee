module.exports = (grunt) ->

  grunt.initConfig

    pkg: grunt.file.readJSON "package.json"

    clean:
      tmp:
        src: ["tmp"]
      test:
        src: ["test/**/*.testling.js"]

    coffee:
      test:
        expand: true,
        cwd: './test',
        src: ['**/*.coffee'],
        dest: './test',
        ext: '.js'

    browserify:
      testling:
        options:
          ignore: ["jsdom"]
        files: [
          expand: true,
          cwd: './test',
          src: ['**/*.js'],
          dest: './test',
          ext: '.testling.js'
        ]

    mochaTest:
      all:
        options:
          reporter: "spec"
          ui:       "tdd"
        src: ["test/**/*.js"]

#    mochacli:
#      options:
#        reporter: "spec"
#        ui:       "tdd"
#        harmony:  true
#      all: ["test/**/*.js"]


    jshint:
      source:
        src: ["src/**/*.js"]

    jscs:
      source:
        src: ["src/**/*.js"]

  grunt.loadNpmTasks("grunt-browserify");
  grunt.loadNpmTasks("grunt-contrib-coffee");
  grunt.loadNpmTasks("grunt-contrib-clean");
  grunt.loadNpmTasks("grunt-mocha-test");
#  grunt.loadNpmTasks("grunt-mocha-cli");
  grunt.loadNpmTasks("grunt-contrib-copy");
  grunt.loadNpmTasks("grunt-contrib-jshint");
  grunt.loadNpmTasks("grunt-jscs-checker");

  grunt.registerTask "test",
    [
      "clean:test"
      "jshint:source"
      "jscs:source"
      "coffee:test"
      "mochaTest:all"
    ]

  grunt.registerTask "testling",
    [
      "clean:test"
      "jshint:source"
      "jscs:source"
      "coffee:test"
      "browserify:testling"
    ]
