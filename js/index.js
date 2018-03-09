"use strict";
window.onload = () => {
    //AJAX => nav
    ajax({
        type: "get",
        url: "php/index_header.php",
        dataType: "json"
    }).then(html => {
        let str='<div>';
        for(let i of html){
            str+=`<a href="list.html?${i.hid}">${i.hname}</a>`;
        }
        str+='</div>';
        let nav=document.getElementById("nav");
        nav.innerHTML = str;
        let slide=document.createElement("div");
        slide.className="slide";
        nav.firstElementChild.appendChild(slide);
        nav.querySelector("div").onmouseover=e=>{
            let This=e.target;
            if(This.nodeName=="A"){
                console.log(12);
            }
        }
    });

    // AJAX => recom_main
    ajax({
        type: "get",
        url: "php/index_recom_main.php",
        dataType: "json"
    }).then(html => {
        let str = '';
        for (let i of html) {
            str += `<a href="${i.ihref}" title="${ (i.ititle === null
                ? ""
                : i.ititle)}" class="rise"><img src="${i.iimg}"></a>`;
        }
        document.getElementsByClassName("main_img")[0].innerHTML = str;

    });

    // AJAX => decent_top
    ajax({
        type: "get",
        url: "php/index_decent_top.php",
        dataType: "json"
    }).then(html => {
        let str = '<h3>为你推荐<a href="#">更多</a></h3>';
        for (let i of html) {
            str += `<a href="${i.dhref}" class="rise"><img src="${i.dimg}"><p>${i.dbrands}</p><p>${i.dmodel}</p><p>￥${i.dprice}</p></a>`
        }
        document.getElementsByClassName("decent_top")[0].innerHTML = str;
    });

    // AJAX => decent_bottom
    ajax({
        type: "get",
        url: "php/index_decent_bottom.php",
        dataType: "json"
    }).then(html => {
        let str = '<h3>精品配件<a href="#">更多</a></h3>';
        for (let i of html) {
            str += `<a href="${i.dhref}" class="rise"><img src="${i.dimg}"><p>${i.dbrands}</p><p>${i.dmodel}</p><p>￥${i.dprice}</p></a>`
        }
        document.getElementsByClassName("decent_bottom")[0].innerHTML = str;
    });

    // AJAX => recycle
    ajax({
        type: "get",
        url: "php/index_recycle.php",
        dataType: "json"
    }).then(html => {
        let str = '<h3>手机回收</h3>';
        for (let i of html) {
            str += `<a href="${i.rhref}"title="${(i.rtitle === null ?
                "" : i.rtitle)}" class="rise"><img src="${i.rimg}">`
        }
        document.getElementsByClassName("recycle")[0].innerHTML = str;
    });
}