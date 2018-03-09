function ajax({
    type,
    url,
    dataType,
    data,
    isbeg
}) {
    dataType=dataType||"text";
    isbeg=isbeg!==false?true:false;
    return new Promise(function (resolve) {
        var xhr = new XMLHttpRequest();
        if (type.toLowerCase() == "get" && data !== undefined) {
            url += "?" + data;
        }
        xhr.open(type, url, isbeg);
        xhr.onreadystatechange = function () {
            if (xhr.readyState == 4 && xhr.status == 200) {
                if(dataType.toLowerCase()!="json"){
                    resolve(xhr.responseText);
                }else{
                    resolve(JSON.parse(xhr.responseText));
                }
            }
        }
        if(type.toLowerCase()=="post"){
            xhr.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");
        }
        xhr.send(type.toLowerCase()=="post"?data:null);
    })
}