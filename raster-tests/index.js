var mapnik = require('mapnik');
var fs = require('fs');
var vtfx = require('../index.js');

function decodeLoadImage(zxy, filepath, format, callback) {
    try {
        var vtile = new mapnik.VectorTile(zxy.z, zxy.x, zxy.y);

        var iBuffer = fs.readFileSync(filepath);

        // Add the image data to a vector tile
        vtile.addImage(iBuffer, 'raster');

        // Write the vector tile to disk
        fs.writeFileSync('rasterbuffer-' + format + '.vector.pbf', vtile.getData());

        // Try decoding the image with vtfx
        var decoded = vtfx.decode(vtile.getData());

        // Take the image data that was decoded with vtfx, and load it into mapnik
        // This will fail if not an 8-bit RGB image
        var image = mapnik.Image.fromBytesSync(decoded.layers[0].features[0].raster);

        // Try getting a pixel
        return callback(null, image.getPixel(100,100));
    } catch(err) {
        return callback(err);
    }
}

var zxy = {
    z: 16,
    x: 10642,
    y: 24989
};

// UINT8 RGB
// ---------

var uint8query = decodeLoadImage(zxy, '24989.png', 'png', function(err, pData) {
    if (err) throw err;
    console.log(pData);
});

console.log(uint8query);

// Float32 single band
// -------------------

var Float32query = decodeLoadImage(zxy, '24989_ndvi.tif', 'png', function(err, pData) {
    if (err) throw err;
    console.log(pData);
});

console.log(Float32query)