/**
 * Utility functions.
 */

jsondash = jsondash || {util: {}};

jsondash.util.getCSSClasses = function(conf, defaults) {
    var classes = {};
    if(conf.classes === undefined && defaults !== undefined) {
        $.each(defaults, function(i, klass){
            classes[klass] = true;
        });
        return classes;
    }
    if(conf.classes !== undefined) {
        $.each(conf.classes, function(i, klass){
            classes[klass] = true;
        });
    }
    return classes;
};

jsondash.util.getValidParamString = function(arr) {
    // Jquery $.serialize and $.serializeArray will
    // return empty query parameters, which is undesirable and can
    // be error prone for RESTFUL endpoints.
    // e.g. `foo=bar&bar=` becomes `foo=bar`
    var param_str = '';
    arr = arr.filter(function(param, i){return param.value !== '';});
    $.each(arr, function(i, param){
        param_str += (param.name + '=' + param.value);
        if(i < arr.length - 1 && arr.length > 1) param_str += '&';
    });
    return param_str;
};

/**
 * [intervalStrToMS Convert a string formatted to indicate]
 * @param  {[String]} ival_fmt [The interval format string e.g. "1d", "2h"]
 * @return {[Number]} [The number of milliseconds]
 */
jsondash.util.intervalStrToMS = function(ival_fmt) {
    // Just return number if it's a regular integer.
    if(!isNaN(ival_fmt)) {
        return ival_fmt;
    }
    var pieces = ival_fmt.split('-');
    var amt = parseInt(pieces[0], 10);
    if(pieces.length !== 2 || isNaN(amt) || amt === 0) {
        // Force NO value if the format is invalid.
        // This would be used to ensure the interval
        // is not set in the first place.
        return null;
    }
    var ival = pieces[1].toLowerCase();
    var ms2s = 1000;
    var ms2min = 60 * ms2s;
    var ms2hr = 60 * ms2min;
    var ms2day = 24 * ms2hr;

    // Seconds
    if(ival === 's') {
        return amt * ms2s;
    }
    // Minutes
    if(ival === 'm') {
        return amt * ms2min;
    }
    // Hours
    if(ival === 'h') {
        return amt * ms2hr;
    }
    // Days
    if(ival === 'd') {
        return amt * ms2day;
    }
    // Anything else is invalid.
    return null;
};

jsondash.util.serializeToJSON = function(arr) {
    // Convert form data to a proper json value
    var json = {};
    $.each(arr, function(_, pair){
        json[pair.name] = pair.value;
    });
    return json;
};

jsondash.util.isOverride = function(config) {
    return config.override && config.override === true;
};

// Credit: http://stackoverflow.com/questions/105034/create-guid-uuid-in-javascript
jsondash.util.s4 = function() {
    return Math.floor((1 + Math.random()) * 0x10000)
    .toString(16)
    .substring(1);
};

jsondash.util.guid = function() {
    var s4 = jsondash.util.s4;
    return s4() + s4() + '-' + s4() + '-' + s4() + '-' +
    s4() + '-' + s4() + s4() + s4();
};

jsondash.util.polygon = function(d) {
    return "M" + d.join("L") + "Z";
};

jsondash.util.scaleStr = function(x, y) {
    return 'scale(' + x + ',' + y + ')';
};

jsondash.util.translateStr = function(x, y) {
    return 'translate(' + x + ',' + y + ')';
};

jsondash.util.isD3Subtype = function(config) {
    // Handle specific D3 types that aren't necessarily referenced under
    // the D3 namespace in a select field.
    if(config.type === 'dendrogram') return true;
    if(config.type === 'voronoi') return true;
    if(config.type === 'circlepack') return true;
    if(config.type === 'treemap') return true;
    if(config.type === 'radial-dendrogram') return true;
    return false;
};

jsondash.util.isSparkline = function(type) {
    return type.substr(0, 10) === 'sparklines';
};

/**
 * [getDigitSize return a d3 scale for adjusting font size based
 *     on digits and width of container.]
 */
jsondash.util.getDigitSize = function() {
    var BOX_PADDING = 20;
    // scale value is reversed, since we want
    // the font-size to get smaller as the number gets longer.
    var scale = d3.scale.linear()
        .clamp(true)
        .domain([2, 14]) // min/max digits length: $0 - $999,999,999.00
        .range([90, 30]); // max/min font-size
    window.scale = scale;
    return scale;
};

if (typeof module !== 'undefined' && typeof module.exports !== 'undefined') {
    module.exports = jsondash;
}
