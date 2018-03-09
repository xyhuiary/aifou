(() => {
    //封装list
    function section_list(data) {
        //console.log(data);
        let str = '';
        if (data.length > 0) {
            if (data[0].cid < 4000) {
                for (let i of data) {
                    let ttl = i.isyd != 0 && "移动" + i.isyd + "G/";
                    ttl += i.islt != 0 && "联通" + i.islt + "G/";
                    ttl += i.isdx != 0 && "电信" + i.isdx + "G/";
                    ttl = ttl
                        .replace(/false/g, "")
                        .slice(0, -1);
                    str += `<a href="product.html?pid=${i.pid}" target="_blank"><div class${i.istop == 1
                        ? "='list_top'"
                        : ""}><img src="picture/list/${i.cid}/${i.iscolor}.png"></div><p>${i.sname} ${i.pname} ${i.pram}G ${ttl}</p><span>￥${i.pprice}</span><img src="picture/list/abc/${i.plv}.png">${i.isshop > 0
                            ? `<div class="none"><i></i><p>他人付款中...</p></div>`
                            : ""}</a>`;
                }
            } else { //配件
                //console.log(data);
                for (let i of data) {
                    str += `<a href="product2.html?pid=${i.pid}" target="_blank"><div><img src="picture/list/fu/${i.pid}.png"></div><p>${i.pname}</p><span>￥${i.pprice}</span></a>`;
                }
            }
        }

        document.getElementsByClassName("section_list")[0].innerHTML = str;
    }

    //url
    let hid = location
        .search
        .slice(1); //截取当前url的fid

    //ajax nav
    ajax({type: "get", url: "php/index_header.php", dataType: "json"}).then(html => {
        let str = '';
        for (let i of html) {
            str += `<a href="list.html?${i.hid}" class="${i.hid == hid
                ? "active"
                : ""}">${i.hname}</a>`;
            if (i.hid == hid) {
                document
                    .querySelector("#section .section .section_l h2")
                    .innerHTML = i.hname;
            }
        }
        document
            .querySelector("#nav .nav .nav_r")
            .innerHTML = str;
    });

    //ajax section_l
    ajax({
        type: "get",
        url: "php/list_source.php",
        data: "hid=" + hid,
        dataType: "json"
    }).then(html => {
        let str = '';
        for (let i of html) {
            str += `<dl><dt data-sid="${i.sid}">${i.sname}</dt><div></div></dl>`;
        }
        document
            .querySelector("#section .section .section_l .section_dl")
            .innerHTML = str;

        let dl = document.querySelector("#section .section .section_l .section_dl");
        dl.onclick = e => { //给父元素绑定单击事件
            let This = e.target; //This指向目标子元素
            if (This.nodeName == "DT") { //判断是否为指定子元素
                let Thisdad = This.parentNode;
                if (Thisdad.className != "") {
                    Thisdad.className = "";
                } else {
                    let act = document.querySelector("#section .section_l dl.activa");
                    act && (act.className = "");
                    Thisdad.className = "activa";
                }
                if (This.nextElementSibling.innerHTML == "") {
                    ajax({
                        type: "get",
                        url: "php/list_crowd.php",
                        data: "sid=" + This.dataset.sid,
                        dataType: "json"
                    }).then(html => {
                        let str = '';
                        for (let i of html) {
                            str += `<dd data-cid="${i.cid}">${i.cname} ${i.sum != 0
                                ? `(${i.sum})`
                                : ""}</dd>`;
                        }
                        This.nextElementSibling.innerHTML = str;
                        This.nextElementSibling.onclick = e => {
                            let This = e.target;
                            let active = document.querySelector("#section .section_l dd.active");
                            active && (active.className = "");
                            This.className = "active";
                            if (This.nodeName == "DD") {
                                document
                                    .querySelector("#section .section_r .page")
                                    .style
                                    .display = "none";
                                ajax({
                                    type: "get",
                                    url: "php/list_crowd.php",
                                    data: "cid=" + This.dataset.cid,
                                    dataType: "json"
                                }).then(html => {
                                    section_list(html);
                                })
                            }
                        }
                    })
                }
            }
        }
    })

    //ajax section_list
    function init_list(current) {
        ajax({
            type: "get",
            url: "php/list_head.php",
            data: "hid=" + hid + "&current=" + current + "&rows=20",
            dataType: "json"
        }).then(html => {
            section_list(html);
        })
    }

    window.onload = () => {
        init_list(1);
        //分页查询
        document
            .querySelector("#section .section .section_r .page")
            .onclick = e => {
            let This = e.target;
            if (This.nodeName == "SPAN") {
                let page = document.getElementById("page");
                let val = parseInt(page.value);
                //窗口滚动事件
                if (getComputedStyle(This).cursor != "not-allowed") {
                    let nowTop = document.documentElement.scrollTop || document.body.scrollTop;
                    let activaTop = nowTop;
                    let timer = setInterval(() => {
                        scrollBy(0, -10);
                        activaTop -= 10;
                        if (activaTop < 181) {
                            clearInterval(timer);
                        }
                    }, 1);
                    document
                        .documentElement
                        .addEventListener("wheel", () => {
                            clearInterval(timer)
                        });
                }
                //点击查询
                if (This.dataset.lt == "" && val > 1) {
                    page.value = --val;
                    init_list(val);
                    if (val == 1) {
                        This.className = "lt_icon";
                    }
                    if (val == 8 - 1) {
                        //为什么是第七页
                        document
                            .querySelector("#section .section .section_r .page span.gt_icon")
                            .className = "gt_icon";
                    }
                }
                if (This.dataset.gt == "" && val < 8) { //为什么是第七页
                    page.value = ++val;
                    init_list(val);
                    if (val == 8) {
                        This.className = "gt_icon lose";
                    }
                    if (val == 2) {
                        document
                            .querySelector("#section .section .section_r .page span.lt_icon")
                            .className = "lt_icon activa";
                    }
                }
                //滚轮监听
            }
        }

        //页面滚动事件
        window.onscroll = () => {
            let nowTop = document.documentElement.scrollTop || document.body.scrollTop;
            let section_l = document.querySelector("#section .section .section_l");
            let section_r = document.querySelector("#section .section .section_r");
            let differ = section_r.offsetHeight - section_l.offsetHeight;
            if (nowTop > 179 && section_l.offsetHeight < section_r.offsetHeight) {
                section_l.className = "section_l fxd";
                //180 console.log(nowTop - 180);
                if (nowTop - 180 + 80 > differ) { //80底外边距
                    section_l.className = "section_l fxd2";
                }
            } else {
                section_l.className = "section_l";
            }
        }
    }
})()