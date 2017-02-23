var es = require('event-stream');
var gutil = require('gulp-util');
var parser = require('qmlweb-parser');
var QmlWeb = require('qmlweb');

module.exports = function (opt) {
  opt = opt || {};
  var pathFilter = opt.pathFilter || function(path) {
    return path;
  };

  function modifyFile(file) {
    if (file.isNull()) return this.emit('data', file);
    if (file.isStream()) return this.emit('error', new Error("gulp-qml: Streaming not supported"));

    var data;
    var src;
    var str      = file.contents.toString('utf8');
    var dest     = gutil.replaceExtension(file.path, ".js");
    //var gulpPath = __dirname.split('/');
    //    gulpPath = gulpPath.splice(0, gulpPath.length - 2).join('/') + '/';
    var path     = file.path;

    //if (file.path.indexOf(gulpPath) === 0) {
    //  path = path.substr(gulpPath.length, path.length);
    //}

    try {
      if (file.path.match(/\.qml$/) != null)
        data = parser.qmlweb_parse(str, parser.qmlweb_parse.QMLDocument);
      else if (file.path.match(/\.js$/) != null)
        data = parser.qmlweb_jsparse(str);
      else
        data = str;

      path = pathFilter(path).split(/[/]/);

      if (opt.parseOnly) {
          src = 'QmlWeb.addQrc("' + path.join('/') + '", ' + JSON.stringify(data) + ');';
      } else {
          if (!pathFilter.started) {
              pathFilter.started = true;
              src = "var _;";
          } else {
              src = "";
          }

          data = QmlWeb.serialize(data);
          src += data.decl+'QmlWeb.addQrc("' + path.join('/') + '", ' + data.body + ');';
      }
    } catch (err) {
      console.log(err.stack);
      return this.emit('error', new Error(file.path + ': ' + err));
    }


    file.contents = new Buffer(src);
    file.path = dest;
    this.emit('data', file);
  }

  return es.through(modifyFile);
};
