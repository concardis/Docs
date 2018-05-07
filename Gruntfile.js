//###################################################################
//#                                                                 #
//#   File:     Gruntfile.js                                        #
//#   Author:   Christoph Bensch                                    #
//#   Project:  Payengine Docs                                      #
//#   Company:  BenschBrothers GbR (benschbrothers.com)             #
//#                                                                 #
//#   - Grunt File, hier werden Grunt Tasks angelegt und ausgeführt #
//#                                                                 #
//###################################################################

module.exports = function(grunt) {

  //Modul abhägigkeit laden, (Routes rewriten)
  var modRewrite = require('connect-modrewrite');

  //Grunt Konfiguration
  grunt.initConfig({

    //Watch Modul
    watch: {
      //Gruntfile bei Änderung neuladen
      grunt: {
        files: ['Gruntfile.js', 'index.html', 'js/*.js', 'partials/*.html'],
        options: {
          reload: true
        }
      },
    },

    //Connect Modul
    connect: {
      //grunt Server starten, port 1234, routes für Angular rewriten
      server: {
        options: {
          port: 1234,
          base: './',
          open: true,
          middleware: function(connect, options, middlewares) {
            // enable Angular's HTML5 mode
            middlewares.unshift(modRewrite(['^[^\\.]*$ /index.html [L]']));
            return middlewares;
          }
        }
      },
    },
  });

  //grunt Module laden
  grunt.loadNpmTasks('grunt-contrib-connect');
  grunt.loadNpmTasks('grunt-contrib-watch');
  //grunt Kommandos Entwicklung
  //'grunt' -> server und watch starten
  grunt.registerTask('default', ['connect:server', 'watch']);

};
