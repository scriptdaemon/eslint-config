/* eslint-disable */

/*
 * This file mocks an old, outdated package on which `eslint-plugin-vue`
 * depends. The `requireindex` dependency uses `require.extensions` to determine
 * which files to include (or omit), but Jest injects its own `require` global
 * that does not populate the `extensions` property. This bug causes
 * `requireindex` to ignore all files when in the Jest testing environment.
 *
 * Related GitHub issues:
 *  - https://github.com/facebook/jest/issues/2017
 *  - https://github.com/vuejs/eslint-plugin-vue/issues/290
 */

var FS   = require('fs');
var Path = require('path');

module.exports = function (dir, basenames) {
  var requires = {};

  if (arguments.length === 2) {
    // if basenames argument is passed, explicitly include those files
    basenames.forEach(function (basename) {
      var filepath = Path.resolve(Path.join(dir, basename));
      requires[basename] = require(filepath);
    });

  } else if (arguments.length === 1) {
    // if basenames arguments isn't passed, require all javascript
    // files (except for those prefixed with _) and all directories

    var files = FS.readdirSync(dir);

    // sort files in lowercase alpha for linux
    files.sort(function (a,b) {
      a = a.toLowerCase();
      b = b.toLowerCase();

      if (a < b) {
        return -1;
      } else if (b < a) {
        return 1;
      } else {
        return 0;
      }
    });

    files.forEach(function (filename) {
      // ignore index.js and files prefixed with underscore and
      if ((filename === 'index.js') || (filename[0] === '_') || (filename[0] === '.')) {
        return;
      }

      var filepath = Path.resolve(Path.join(dir, filename));
      var ext      = Path.extname(filename);
      var stats    = FS.statSync(filepath);

      /*
       * The next line of code has been patched to check that `ext` is any
       * non-JavaScript extension directly, as `require.extensions` is empty
       * when in the Jest testing environment.
       */

      // don't require non-javascript files (.txt .md etc.)
      if (stats.isFile() && !['.js', '.json', '.node'].includes(ext)) {
        return;
      }

      var basename = Path.basename(filename, ext);

      requires[basename] = require(filepath);
    });

  } else {
    throw new Error("Must pass directory as first argument");
  }

  return requires;
};
