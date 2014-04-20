/*
 * Gruntfile.js
 * @author Osiris
 * @version 1.0.0
 */

'use strict';

module.exports = function(grunt) {

  require("matchdep").filterDev("grunt-*").forEach(grunt.loadNpmTasks);

  // Project configuration.
  grunt.initConfig({
    pkg: grunt.file.readJSON('package.json'),

    tag: {
      banner: "/*!\n" +
              " * @author Osiris\n" +
              " * @version 1.0.0\n" +
              " * Copyright 2014.\n" +
              "<%= grunt.template.today('yyyy-mm-dd') %> \n"+
              " */\n"
    },

    uglify: {
      prod:{
        options: {
             banner: "<%= tag.banner %>"
        },
        src: 'public/js/**/*.js',
        dest: 'public/js-uglify/default.min.js'
      },

      dev:{
        options: {
             banner: "<%= tag.banner %>"
        },
        files: [{
              expand: true,
              cwd: 'public/js',
              src: '**/*.js',
              dest: 'public/js-uglify/'
        }]
      }
    },

    csslint: {
      options: {
        csslintrc: '.csslintrc'
      },
      src: ['public/css/pageDetailss/**/*.css']
      
    },

    jshint: {
      // define the files to lint
//      files: ['Gruntfile.js','src/**/*.js', 'public/**/*.js'],
      files: ['Gruntfile.js', 'public/**/*.js'],
      // configure JSHint (documented at http://www.jshint.com/docs/)
      options: {
          // more options here if you want to override JSHint defaults
        globals: {
          jQuery: true,
          console: true,
          module: true,
          "$": true
        },
        jshintrc: '.jshintrc'
      }
    },

    watch: {
      staticResources:{
        files: ['<%= jshint.files %>','<%= csslint.src %>','views/**/*.hbs','public/less/**/*.less'],
        tasks: ['jshint', 'csslint','less:dev'],
        options: {
          spawn: false, // Without this option specified express won't be reloaded
          livereload: true
        }
      },
      express:{
        files: ['app.js','src/**/*.*'],
        tasks: ['express:dev'],
        options: {
          spawn: false, // Without this option specified express won't be reloaded
          livereload: true
        }
      }
    },

    less: {
      dev: {
        files: [{
              expand: true,
              cwd: 'public/less',
              src: '**/*.less',
              dest: 'public/css/',
              rename: function(dest, src) {
                return dest + src.slice(0, -5)+ '.css';
              }
        }]
      }
    },

    express: {
      options: {
        port: 3000
        // Override defaults here
      },
      dev: {
        options: {
          script: 'app.js',
          node_env: 'development'
        }
      },
      prod: {
        options: {
          script: 'app.js',
          node_env: 'production'
        }
      },
      test: {
        options: {
          script: 'app.js'
        }
      }
    },
    
    open : {
      dev : {
        path: 'http://localhost:3000',
//        app: 'chrome.exe'
        app: 'Google Chrome'

      },
      file : {
        path : '/etc/hosts'
      }
    }

  });


  // Register our own custom task alias.
  grunt.registerTask('prod', ['uglify:prod','csslint','jshint','express:prod','watch']);

  // Register our own custom task alias.
  grunt.registerTask('default', ['uglify:dev','csslint','jshint','less:dev','express:dev','open:dev','watch']);

};