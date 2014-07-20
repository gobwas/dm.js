module.exports = (grunt) ->

  grunt.initConfig

    pkg: grunt.file.readJSON "package.json"

    clean:
      tmp:
        src: ["tmp"]
      test:
        src: ["test/**/*.js"]

    coffee:
      test:
        expand: true,
        cwd: './test',
        src: ['**/*.coffee'],
        dest: './test',
        ext: '.js'

    browserify:
      test:
        expand: true,
        cwd: './test',
        src: ['**/*.js'],
        dest: './test',
        ext: '.bundle.js'

    mochaTest:
      test:
        options:
          reporter: "spec"
          ui:       "tdd"
          require: "coffee-script"
        src: ["test/**/*.coffee"]

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
  grunt.loadNpmTasks("grunt-contrib-copy");
  grunt.loadNpmTasks("grunt-contrib-jshint");
  grunt.loadNpmTasks("grunt-jscs-checker");

  grunt.registerTask "test",
    [
      "jshint:source"
      "jscs:source"
      "clean:test"
      "mochaTest:test"
    ]

  grunt.registerTask "testling",
    [
      "jshint:source"
      "jscs:source"
      "clean:test"
      "coffee:test"
      "browserify:test"
    ]
