module.exports = function(grunt) {

  // Prepares basic configuration for Grunt.js
  grunt.initConfig({
    clean:{
      build_dev: ['build_dev/js/*', 'build_dev/css/*', 'build_dev/*.html'],
      build_prod: ['build_prod/**/*.js', 'build_prod/**/*.css', 'build_prod/*.html']
    },
    copy:{
      build_dev: {
        files: [
          {expand: true, cwd: 'src/js/', src:['**'], dest: "build_dev/js/"},
          {expand: true, cwd: 'src/plugins', src:['**'], dest: 'build_dev/plugins'},
          {expand: true, cwd: 'src/', src:['test.json'], dest: 'build_dev/'}
        ]
      },
      build_prod: {
        files: [
          {expand: true, cwd: 'src/', src:['test.json'], dest: 'build_prod/'}
        ]
      }
    },
    cssmin:{
      build_prod: {
        files: [
          { expand: true, cwd: 'build_dev/css', src: ['*.css'], dest: 'build_prod/css' },
          { expand: true, cwd: 'build_dev/plugins', src: ['**/*.css'], dest: 'build_prod/plugins'}
        ]
      }
    },
    jade:{
      build_dev: {
        options: {
          pretty: true
        },
        files: {
          'build_dev/home.html': 'src/jade/home.jade'
        }
      },
      build_prod: {
        options: {
          pretty: false
        },
        files: {
          'build_prod/home.html': 'src/jade/home.jade'
        }
      }
    },
    jshint: {
      files: ['Gruntfile.js', 'src/js/app/*.js'],
      options: {
        globals: {
          jQuery: true
        }
      }
    },
    stylus:{
      build_dev:{
        options: {
          compress: false
        },
        files: {
          'build_dev/css/app.css': 'src/stylus/*.styl'
        }
      }
    },
    uglify:{
      build_prod: {
        files: [
          { expand: true, cwd: 'src/js', src: '**/*.js', dest: 'build_prod/js' },
          { expand: true, cwd: 'src/plugins', src: '**/*.js', dest: 'build_prod/plugins' }
        ]
      },
    },
    watch: {
      scripts: {
        files: ['**/*.js'],
        tasks: ['jshint'],
        options: {
          interrupt: true
        }
      },
      templates:{
        files: ['**/*.jade'],
        tasks: ['jade:build_dev'],
        options: {
          interrupt: true
        }
      }
    }
  });

  // Loads Grunt plugins to be used. These MUST have been previously installed.
  grunt.loadNpmTasks('grunt-contrib-clean');
  grunt.loadNpmTasks('grunt-contrib-copy');
  grunt.loadNpmTasks('grunt-contrib-cssmin');
  grunt.loadNpmTasks('grunt-contrib-jade');
  grunt.loadNpmTasks('grunt-contrib-jshint');
  grunt.loadNpmTasks('grunt-contrib-stylus');
  grunt.loadNpmTasks('grunt-contrib-uglify');
  grunt.loadNpmTasks('grunt-contrib-watch');

  // Registers Grunt tasks to be performed when called from grunt-cli.
  grunt.registerTask('build_dev', ['jshint', 'clean:build_dev', 'jade:build_dev', 'stylus:build_dev', 'copy:build_dev']);
  grunt.registerTask('build_prod', ['build_dev', 'clean:build_prod', 'jade:build_prod', 'uglify:build_prod', 'cssmin:build_prod', 'copy:build_prod']);

};