var fs = require('fs');
var path = require('path');
var mapnik = require('mapnik');
var base = path.join(__dirname, 'src');
var zipdir = require('zip-dir');
var vectorDrawable = require('./lib/vector-drawable');

var colors = [{
    name: 'dark',
    color: '#000'
}, {
    name: 'light',
    color: '#fff'
}];

fs.writeFileSync('./icons.md', '### Icons\n\n');

fs.readdir(path.join(base, 'svg'), (err, svgs) => {
    if (err) throw err;
    svgs.forEach((svgFileName) => {
        if (svgFileName.indexOf('.svg') === -1) return false;
        fs.readFile(path.join(base, 'svg', svgFileName), (err, data) => {
            if (err) throw err;
            var iconName = `direction_${svgFileName.split('.svg')[0]}`;
            fs.appendFileSync('./icons.md', '* [' + iconName +'](https://github.com/mapbox/directions-icons/blob/master/src/png/dark/' + iconName + '.png)\n');

            colors.forEach((color) => {
                var replaced = data.toString().replace(/fill="#000000"/g, `fill="${color.color}"`);
                var svgBuffer = new Buffer(replaced);

                new mapnik.Image.fromSVGBytes(svgBuffer, {
                    scale: 10
                }, (err, mSVG) => {
                    if (err) throw err;
                    mSVG.encode('png8:c=128:m=h', (err, image) => {
                        if (err) throw err;
                        fs.writeFileSync(path.join(base, 'png', color.name, iconName + '.png'), image);
                    });
                });
                
                try {
                    var vectorDrawableSVG = vectorDrawable.createFromSVG(replaced).toString();
                    fs.writeFileSync(path.join(base, 'android', color.name, iconName + '.xml'), vectorDrawableSVG);
                } catch (e) {
                    console.log('Error on ', iconName);
                }
            });
        });
    });

    zipdir(path.join(base), {
        filter: (path, stat) => !/\.zip$/.test(path),
        filter: (path, stat) => !/\.DS_Store$/.test(path)
    }, (err, buffer)=> {
        if (err) throw err;
        fs.writeFile(path.join(base, 'icons.zip'), buffer, (err) => {
            if (err) throw err;
            console.log('Saved zip');
        });
    });
});
