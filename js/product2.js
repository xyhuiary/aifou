"use strict";
(() => {
    let pid = location
        .search
        .slice(1);
    
    //详情
    function ajax_pro(pid) {
        ajax({type: "get", url: "php/product.php", data: pid, dataType: "json"}).then(arr => {
            //console.log(arr);
            let data = arr.data;
            document
                .getElementById("htmlName")
                .innerHTML = data.pname;
            let type = arr.type;
            let list = '';
            for (let i of type) {
                list += `<a ${data.pid == i.pid
                    ? 'class="active"'
                    : ''} data-pid="${i.pid}">${i.iscolor}</a>`;
            }
            let html = `<div class="text"><h2>${data.pname}</h2><span>产品编号：RE201811131515363</span></div>   
            <ul><li><span>价格</span><b>￥${data.pprice}</b></li><li class="type"><span>颜色</span>${list}</li><li><span>数量</span><div class="btn"><i class="l"></i><input type="text" value="1"><i class="r"></i></div></li><li><span>销售地区</span><a class="active">中国大陆</a></li></ul>`;
            let div = document.querySelector("#product_1 .crowd>div");
            div.innerHTML = html;
            //加减
            let btn = div.querySelector(".btn");
            let ipt = btn.querySelector("input");
            btn.onclick = e => {
                let This = e.target;
                let num = Number(ipt.value);
                //console.log(num);
                if (num > 1 && This.className == "l") {
                    ipt.value = --num;
                }
                if (num < 100 && This.className == "r") {
                    ipt.value = ++num;
                }
            }
            //颜色
            div
                .querySelector(".type")
                .onclick = e => {
                let This = e.target;
                if (This.nodeName == "A" && This.className != "active") {
                    ajax_pro("pid=" + This.dataset.pid);
                }
            };

            //键入 ==========================================================


            //购买检测
            let isok = document.querySelector("#header .header_r").dataset.isok;
            let a = document.querySelectorAll("#product_1 .crowd>a");
            let typei = div.querySelector("ul .type .active");
            if(isok==1){

                for(let i of a){
                    i.onclick = e =>{
                        let This = e.target;
                        let num = parseInt(ipt.value);
                        let pid = typei.dataset.pid;
                        if(This.className == "last"){
                            console.log(e.target);
                            console.log(e.target.scrollTop);
                            console.log(e.target.scrollLeft);
                            alert("立即购买"+num+"个"+pid);
                        }else{
                            ajax({
                                type:"post",
                                url:"php/shop_add2.php",
                                data:`num=${num}&pid="${pid}"`,
                                dataType:"json"
                            }).then(data=>{
                                if(data.code<0){
                                    alert(data.code);
                                }else{
                                    //console.log("ok");
                                    function monitor(en, pid) { //倒计时监听
                                        let header_r = header.querySelector(".header_r");
                                        let end = en;
                                        let timer = setInterval(() => {
                                            let now = new Date();
                                            if (end - now < 0) {
                                                clearInterval(timer);
                                                ajax({
                                                    type: "post",
                                                    url: "php/shop_date.php",
                                                    data: "pid=" + pid
                                                }).then(ajax_shop);
                                            } else {
                                                let sur = end - now; //剩余时间
                                                let m = parseInt(sur / 1000 / 60) + "分" + parseInt(sur / 1000) % 60 + "秒";
                                                header_r
                                                    .querySelector(".shop .you .time span")
                                                    .innerHTML = m;
                                            }
                                        }, 1000);
                                    }
                                    function ajax_shop() {
                                        let header_r = header.querySelector(".header_r");
                                        ajax({type: "post", url: "php/user_shop.php", dataType: "json"}).then(data => {
                                            //console.log(data);
                                            let shop = data.shop;
                                            let af = data.af;
                                            if (shop.length > 0 || af.length > 0) { //购物车有商品
                                                let gross = 0, //商品总个数
                                                    price = 0; //商品总价
                                                let html = '<i></i>';
                                                if (shop.length > 0) { //购物车主商品
                                                    let i = shop[0];
                                                    //console.log(i);
                                                    let en = i.en; //结束时间   i.star购买时间------------------------------
                                                    monitor(en, i.pid);
                                                    let data = new Date();
                                                    let sur = en - data; //剩余时间
                    
                                                    let m = parseInt(sur / 1000 / 60) + "分" + parseInt(sur / 1000) % 60 + "秒";
                    
                                                    gross += parseInt(i.sum);
                                                    price += parseFloat(i.pprice);
                    
                                                    let ttl = i.isyd != 0 && "移动" + i.isyd + "G/";
                                                    ttl += i.islt != 0 && "联通" + i.islt + "G/";
                                                    ttl += i.isdx != 0 && "电信" + i.isdx + "G/";
                                                    ttl = ttl
                                                        .replace(/false/g, "")
                                                        .slice(0, -1);
                    
                                                    let c = "";
                                                    switch (i.iscolor) {
                                                        case "0":
                                                            c = "白色";
                                                            break;
                                                        case "1":
                                                            c = "深空灰色";
                                                            break;
                                                        case "2":
                                                            c = "亮黑色";
                                                            break;
                                                        case "3":
                                                            c = "玫瑰金色";
                                                            break;
                                                        case "4":
                                                            c = "金色";
                                                            break;
                                                        case "5":
                                                            c = "红色";
                                                            break;
                                                        case "6":
                                                            c = "冰玉蓝";
                                                            break;
                                                        case "7":
                                                            c = "雾屿蓝";
                                                            break;
                                                        case "8":
                                                            c = "烟晶灰";
                                                            break;
                                                    }
                                                    let title = `${i.pname} ${i.pram}G ${ttl}`;
                                                    html += `<div class="you"><p class="time">请于<span>${m}</span>内完成该产品的支付</p><div class="poss"><img src="picture/list/${i.cid}/${i.iscolor}.png"><div class="text"><p title="${title}">${title}</p><p>配置：${i.pram}G、颜色:${c}<p>¥${i.pprice} x ${i.sum}</p></div><i data-sid="${i.sid}"></i></div></div>`;
                                                }
                                                let len = af.length;
                                                if (len > 0) { //购物车副商品
                                                    //console.log(af);
                                                    let x = 0;
                                                    for (let i of af) {
                                                        gross += parseInt(i.sum);
                                                        price += parseFloat(i.pprice * i.sum);
                                                        if (x < 2) {
                                                            html += `<div class="poss"><img src="picture/product/fus/${i.pid}/1.png"><div class="text"><p title="">${i.pname}</p><p>颜色:${i.iscolor}<p>¥${i.pprice} x ${i.sum}</p></div><i data-sid="${i.sid}"></i></div>`;
                                                        }
                                                        x++;
                                                    }
                                                }
                    
                                                header_r
                                                    .querySelector("a.icon_shop span")
                                                    .innerHTML = gross;
                    
                                                html += `<div class="settle"><div><p>共有${gross}件商品</p><p>￥${price}</p></div><a href="pay.html">前去结算</a></div>`;
                                                header_r
                                                    .querySelector(".collapse .shop")
                                                    .innerHTML = html;
                                                //header_r.querySelector(".collapse .shop").style.display="block";
                    
                                            } else {
                                                header_r
                                                    .querySelector("a.icon_shop span")
                                                    .innerHTML = 0;
                                                header_r
                                                    .querySelector(".collapse .shop")
                                                    .innerHTML = `<i></i><div class="kong"><img src="images/car.png" width="100"><p>空空如也<br>赶紧去挑选几件中意商品吧</p></div>`;
                                            }
                                        })
                                    }
                                    console.log(e.target);
                                    console.log(e.target.scrollTop);
                                    console.log(e.target.scrollLeft);
                                    ajax_shop(); //初始执行一次
                                }
                            })
                        }
                    }
                }
            }else{
                for(let i of a){
                    i.onclick= () => {
                        document
                        .getElementById("login")
                        .className = "show";
                    }
                }
            }
        })
    }
    ajax_pro(pid);

    //图片
    ajax({type: "get", url: "php/product_img.php", data: pid, dataType: "json"}).then(html => {
        //console.log(html);
        let str = '';
        for (let i of html) {
            str += `<img src="picture/product/fus/${i.pid}/${i.img_src}">`;
        }
        let screen = document.querySelector("#product_1 .stage .stage_min .screen");
        screen.innerHTML = str;
        screen.firstChild.className = "activa";
        document
            .querySelector("#product_1 .stage .stage_max img")
            .src = "picture/product/fus/" + html[0].pid + "/" + html[0].img_src;

        //小图片
        let wid = screen.children.length * 67;
        screen.style.width = wid + "px";
        screen.onmousemove = e => {
            let This = e.target;
            if (This.nodeName == "IMG") {
                document
                    .querySelector("#product_1 .stage .stage_max img")
                    .src = This
                    .src
                    .slice(This.src.indexOf("picture/product/"));
                document
                    .querySelector("#product_1 .stage .stage_min img.activa")
                    .className = "";
                This.className = "activa";
            }
        }
        //点击切图
        let span = document.querySelectorAll("#product_1 .stage .stage_min span");
        let moved = 0;
        span[0].onclick = () => {
            if (moved > 0) {
                moved--;
                screen.style.left = 29 - 67 * moved + "px";
            }
        };
        span[1].onclick = () => {
            if (moved < screen.children.length - 5) {
                moved++;
                screen.style.left = 29 - 67 * moved + "px";
            }
        }
    })

})();