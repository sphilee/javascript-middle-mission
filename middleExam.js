var widget = {
    "debug": "on",
    "window": {
        "title": "Sample Konfabulator Widget",
        "name": "main_window",
        "width": 500,
        "height": 500
    },
    "image": {
        "src": "Images/Sun.png",
        "name": "sun1",
        "hOffset": 250,
        "vOffset": 250,
        "alignment": "center"
    },
    "text": {
        "data": "Click Here",
        "size": 36,
        "style": "bold",
        "name": "text1",
        "hOffset": 250,
        "vOffset": 100,
        "alignment": "center",
        "onMouseUp": "sun1.opacity = (sun1.opacity / 100) * 90;"
    }
}


function checkTypeNum(object) {
    Object.keys(object).map(function (objectKey, index) {
        var value = object[objectKey];
        if (Object.prototype.toString.call(value) === "[object Object]") {
            checkTypeNum(value);
        } else if (Number.isInteger(value)) {
            output.push(objectKey);
        }
    });
}

var output = [];
checkTypeNum(widget);
console.log(output);

//실행결과
//["width", "height", "hOffset", "vOffset", "size", "hOffset", "vOffset"]