
var _cvu_canvas_to_img = function(canvas_id, image_type) {
    if (!window.BlobBuilder && window.WebKitBlobBuilder) {
        window.BlobBuilder = window.WebKitBlobBuilder;
    }
      
    if (!image_type) {
        image_type = "image/png";
    }

    var canvas = document.getElementById(canvas_id);
    var raw_data = canvas.toDataURL(image_type).split(",")[1];
    var binary = atob(raw_data);

    buffer = new ArrayBuffer(binary.length);
    byte_array = new Uint8Array(buffer);

    for (var i = 0; i < binary.length; i++) {
        byte_array[i] = binary.charCodeAt(i);
    }

    var builder = new window.BlobBuilder();
    builder.append(buffer);
    return builder.getBlob(image_type);
};


var go = function() {
    var blob = _cvu_canvas_to_img("mydrawing");
    var formdata = new FormData( document.getElementById("myform") );
    formdata.append("mydrawing", blob, "drawing.png");

    var request = new XMLHttpRequest();
    request.open("POST", "http://localhost:5000/", true);
    request.send(formdata);
};

var _cvu_attach = function(canvas_id, form_id, callback, image_type) {
    var form = document.getElementById(form_id);
    console.log(form);

    form.onsubmit = function() {
        if (!image_type) {
            image_type = "png";
        }

        var blob = _cvu_canvas_to_img(canvas_id, "image/" + image_type);

        var f= document.getElementById(form_id);
        var formdata = new FormData(f);
        formdata.append(canvas_id, blob, canvas_id + "." + image_type);
        var xhr = new XMLHttpRequest();

        xhr.onreadystatechange = function () {
            if (this.readyState == this.DONE && callback) {
               callback(); 
            };
        };

        xhr.open("POST", f.action, true);
        xhr.send(formdata);

        return false;
    }
};
