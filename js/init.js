function createXhr() { //创建AJAX
    var xhr;
    if (window.XMLHttpRequest) {
        xhr = new XMLHttpRequest();
        return xhr;
    } else {
        xhr = new ActiveXObject("Microsoft.XMLHttp");
        return xhr;
    }
}
function onSiblings(elem,clas,cla) {
    elem.className=clas;
    var p= elem.parentNode.children;
    for(var i=0;i<p.length;i++){ 
        if(p[i]!==elem){
            p[i].className=cla;
        }
    }
}
function onClickSibings(arr,clas,cla) {
    arr[0].className=clas;
    for(var i=0;i<arr.length;i++){
        arr[i].onclick=function(){
            this.className=clas;
            for(var j=0;j<arr.length;j++){
                if(arr[j]!=this){
                    arr[j].className=cla;
                }
            }
        }
    }
}

console.log("init.js is ok!");
console.log("-------------------------------");
console.log("内置createXhr();");
console.log("内置siblings();");
console.log("");
console.log("-------------------------------");
console.log("");