(function () {
    var product_child_on = null;
    function product_type_child(tid) { //2
        var product_type_child = document.getElementsByClassName("product_type_child");
        var xhr = createXhr();
        xhr.open("get", "php/huishou_product_tyle_child.php?tid=" + tid, false);
        xhr.onreadystatechange = function () {
            if (xhr.readyState == 4 && xhr.status == 200) {
                var data = JSON.parse(xhr.responseText);
                for (var i = 0, str = '<a class="product_child_on active" dataTid="' + tid + '">全部</a>'; i < data.length; i++) {
                    str += '<a class="product_child_on" dataEid="' + data[i].eid + '">' + data[i].ename + '</a>'
                }
                product_type_child[0].innerHTML = str;
            }
        }
        xhr.send(null);
        //点击2
        product_child_on = document.getElementsByClassName("product_child_on");
        product_child_on[0].onclick = function () {
            product_list_all(this.attributes.dataTid.value);//3_all
            onSiblings(this, "product_child_on active", "product_child_on");
        }
        for (var i = 1; i < product_child_on.length; i++) {
            product_child_on[i].onclick = function () {
                onSiblings(this, "product_child_on active", "product_child_on");
                product_list(this.attributes.dataEid.value); //3
            }
        }
    }
    function product_list_all(tid) { //3_all
        var product_list = document.getElementsByClassName("product_list");
        var xhr = createXhr();
        xhr.open("get", "php/huishou_product_list_all.php?tid=" + tid, false);
        xhr.onreadystatechange = function () {
            if (xhr.readyState == 4 && xhr.status == 200) {
                var data = JSON.parse(xhr.responseText);
                for (var i = 0, str = ''; i < data.length; i++) {
                    str += '<a href="#"><img src="' + data[i].limg + '"><p>apple</p><p>' + data[i].lname + '</p></a>';
                }
                product_list[0].innerHTML = str;
            }
        }
        xhr.send(null);
    }
    function product_list(eid) { //3
        var product_list = document.getElementsByClassName("product_list");
        var xhr = createXhr();
        xhr.open("get", "php/huishou_product_list.php?eid=" + eid, false);
        xhr.onreadystatechange = function () {
            if (xhr.readyState == 4 && xhr.status == 200) {
                var data = JSON.parse(xhr.responseText);
                for (var i = 0, str = ''; i < data.length; i++) {
                    str += '<a href="#"><img src="' + data[i].limg + '"><p>apple</p><p>' + data[i].lname + '</p></a>';
                }
                product_list[0].innerHTML = str;
            }
        }
        xhr.send(null);
    }

    window.onload = function () {

        (function () { //1
            var product_type = document.getElementsByClassName("product_type");
            var xhr = createXhr();
            xhr.open("get", "php/huishou_product_type.php", false);
            xhr.onreadystatechange = function () {
                if (xhr.readyState == 4 && xhr.status == 200) {
                    var data = JSON.parse(xhr.responseText);
                    for (var i = 0, str = ''; i < data.length; i++) {
                        str += '<a class="product_type_on" dataTid="' + data[i].tid + '"><img src="' + data[i].timg + '"><p>' + data[i].ttitle + '</p></a>';
                    }
                    product_type[0].innerHTML = str;
                    product_type_child(data[0].tid); //2
                    product_list_all(data[0].tid); //3_all
                }
            }
            xhr.send(null);
        })();

        (function () { //点击1
            var product_type_on = document.getElementsByClassName("product_type_on");
            product_type_on[0].className = "product_type_on active";
            for (var i = 0; i < product_type_on.length; i++) {
                product_type_on[i].onclick = function () {
                    onSiblings(this, "product_type_on active", "product_type_on");
                    product_type_child(this.attributes.dataTid.value); //2
                    product_list_all(this.attributes.dataTid.value); //3_all
                }
            }
        })();
    }
})();
