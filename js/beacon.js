window.rawBeaconList = {};
window.beaconList = null;

window.beaconMapping = ["10089:17988", "10089:17989", "10089:17990", "10089:17991", "10089:17992", "10089:17993"];

window.map = function (val, a, b, c, d, allowOverflow) {
    //mao val from a,b to c,d
    var r = (val - a) / (b - a);
    if (!allowOverflow) {
        r = Math.max(0, Math.min(1, r));
    }
    return (d - c) * r + c;
}

//15-30cm: 45~60
//30-60cm: 60~80
//Math.pow(range, 0.45) * 13
window.getSig = function (id, pdown, pup) {
    if (!beaconList[id]) {
        return 0;
    }
    var minsig = -Math.pow(pup, 0.45) * 13;
    var maxsig = -Math.pow(pdown, 0.45) * 13;
    return map(beaconList[id].filteredrssi, minsig, maxsig, 0, 1);
}

window.getNormalizedSig = function (id, clamp, pow) {
    if (window.beaconList[id].visibility < 0.5) return 0;
    var max = -999999;
    pow = 4;
    var min = 999999;
    for (var i in window.beaconList) {
        var cur = window.beaconList[i];
        if (cur.visibility > 0.5 && cur.rssi > -65) {
            max = max < cur.rssi ? cur.rssi : max;
            min = min > cur.rssi ? cur.rssi : min;
        } else {

        }
    }
    if (max == -999999) {
        return 0;
    }
    if (max == min) {
        return 1;
    }
    return Math.pow(map(window.beaconList[id].rssi, min, max, 0, 1), pow);
}

window.pickOne = function (id, min) {
    var max = min;
    // var maxViz = 0.4;
    var picked = -1;
    for (var i in window.beaconList) {
        var cur = window.beaconList[i];
        if (cur.visibility > 0.9 && raw(cur, "filteredrssi") != 0 && cur.filteredrssi > max) {
            // maxViz = cur.visibility;
            max = cur.filteredrssi;
            picked = i;
        } else {

        }
    }
    if (id == picked) return 1;
    return 0;
}

window.getSigByRSSI = function (id, pdown, pup) {
    var minsig = -Math.pow(pup, 0.45) * 13;
    var maxsig = -Math.pow(pdown, 0.45) * 13;
    return map(id, minsig, maxsig, 0, 1);
}

window.updateBeaconList = function (uidlist) {
    var list = uidlist.beacons;
    //wash data
    if(!list)return;

    for (var i = 0; i < list.length; i++) {
        var id = list[i].major + ":" + list[i].minor;
        if(beaconMapping.indexOf(id) < 0) continue;
        rawBeaconList[list[i].major + ":" + list[i].minor] = list[i];
    }

    if (beaconList == null) {
        beaconList = {};
    }
    for (var i in rawBeaconList) {
        if (!beaconList[i]) {
            beaconList[i] = {
                lastSeen: Date.now(),
                rssi: parseFloat(rawBeaconList[i].rssi),
                filteredrssi: parseFloat(rawBeaconList[i].rssi),
                demoRSSI: parseFloat(rawBeaconList[i].rssi),
                visibility: 1
            };
        }
        var cur = beaconList[i];
        cur.visibility = 1;
        cur.lastSeen = Date.now();
        cur.rssi = parseFloat(rawBeaconList[i].rssi);
        if (cur.rssi != 0) {
            ease(cur, "filteredrssi", parseFloat(rawBeaconList[i].rssi), 0.1);
        }
        ease(cur, "visibility", 0, 0.001); //decay
    }

    // for (var i in beaconList) {
    //     var cur = beaconList[i];
    //     ease(cur, 'normalized', getNormalizedSig(i, 20, 2), 0.2);
    // }
    for (var i in beaconList) {
        var cur = beaconList[i];
        ease(cur, 'normalized', pickOne(i, -65), 0.35);
    }
}

