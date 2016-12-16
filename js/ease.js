var easelist = [];
var RESOLUTION = 0.0001;
function update() {
    var len = easelist.length;
    for (var i = 0; i < len; i++) {
        var cur = easelist[i];
        if (!cur.__ease_enabled__) continue;
        cur.__ease_enabled__ = false;
        for (var key in cur.__ease__) {
            if (!cur.__ease__.hasOwnProperty(key)) continue;
            var curve = cur.__ease__[key];
            var delta = curve[0] - cur[key];
            if (delta > RESOLUTION || delta < -RESOLUTION) {
                cur[key] += delta * curve[1];
                cur.__ease_enabled__ = true;
            } else {
                cur[key] = curve[0];
            }
        }
    }
}

window.updateease = update;

window.ease = function (obj, p, v, perc) {
    if (!obj.hasOwnProperty('__ease_enabled__')) {
        easelist.push(obj);
    }
    obj.__ease_enabled__ = true;
    perc = perc || 0.09;
    if (obj.__ease__ == undefined) {
        obj.__ease__ = {};
    }
    if (!obj.__ease__[p]) {
        obj.__ease__[p] = [v, perc];
    } else {
        obj.__ease__[p][0] = v;
        obj.__ease__[p][1] = perc;
    }
    if (obj[p] == undefined) {
        obj[p] = 0;
    }
};

window.raw = function (obj, p) {
    return !obj.__ease__ || obj.__ease__[p] == undefined ? obj[p] : obj.__ease__[p][0];
};