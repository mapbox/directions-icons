
var svgPath = require('svgpath');
var svgPathBoundingBox = require('svg-path-bounding-box');
var svgNumbers = require('svg-numbers');
var cheerio = require('cheerio');
var svgPathNormalize = require('svg-path');

module.exports = vectorDrawable;

function vectorDrawable(path, width, height) {
  this.path = path || '';
  this.width = width || 0;
  this.height = height || 0;
}

vectorDrawable.createFromSVG = function(svgData) {
  var doc = cheerio.load(svgData, {
    xmlMode: true,
    decodeEntities: true,
    normalizeWhitespace: true
  });

  var pathElement = doc('path[d]');
  var svgElement = doc('svg');

  if (doc('rect,line,circle,ellipsis,polyline,polygon,mask,[xlink\\:href],[clip-path]').length > 0 || pathElement.length !== 1 || svgElement.length !== 1) {
    throw new Error('Only monochrome simplified SVG support');
  }

  var viewBox = svgNumbers(svgElement.attr('viewBox') || '');
  if (viewBox.length != 4) {
    viewBox = [0, 0, 0, 0];
  }

  var pathDriver = new svgPath(pathElement.attr('d'));
  if (viewBox[0] || viewBox[1]) {
    pathDriver.translate(-viewBox[0], -viewBox[1]);
  }
  var path = pathDriver.toString();

  var boundingBox = svgPathBoundingBox(path);

  var translateX = -Math.min(boundingBox.x1, 0);
  var translateY = -Math.min(boundingBox.y1, 0);
  if (translateX || translateY) {
    pathDriver.translate(translateX, translateY);
    pathDriver.__evaluateStack();
  }

  path = pathDriver
    .rel()
    .toString();

  var width = Math.max(viewBox[2], boundingBox.width);
  var height = Math.max(viewBox[3], boundingBox.height);

  path = svgPathNormalize(path).toString();

  return new vectorDrawable(path, width, height);
};

vectorDrawable.prototype = {

  toString: function() {
    var path = this.path;
    var width = this.width;
    var height = this.height;
    var xml;

    xml = '<vector xmlns:android="http://schemas.android.com/apk/res/android" ' +
      'android:width="' + width + 'dp" ' +
      'android:height="' + height + 'dp" ' +
      'android:viewportWidth="' + width + '" ' +
      'android:viewportHeight="' + height + '">' +
      '<path ' +
      'android:fillColor="#FF000000" ' +
      'android:pathData="' + path + '"/>' +
      '</vector>';

    return xml;
  }

};
