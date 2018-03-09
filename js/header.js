"use strict";
(() => {
    ajax({type: "get", url: "header.html"}).then(html => {
        let header = document.getElementById("header");
        header.innerHTML = html;
        //是否登录
        ajax({
            type: "get", url: "php/islogin.php", dataType: "json", isbeg: false/*product.js*/
        }).then(data => {
            //islogin
            let header_r = header.querySelector(".header_r");
            //登录状态
            if (data.ok == 1) {
                header_r.dataset.isok = "1";
                header_r
                    .querySelector(".collapse a")
                    .innerHTML = data.uname;

                function monitor(en, pid) { //倒计时监听
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
                //ajax购物车
                function ajax_shop() {
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
                ajax_shop(); //初始执行一次

                //移入事件
                let shop = header_r.querySelector(".collapse .icon_shop");
                shop.onmouseover = e => {
                    ajax_shop();
                }
                //点击删除
                header_r
                    .querySelector(".shop")
                    .onclick = e => {
                    let This = e.target;
                    let sid = This.dataset.sid
                    if (sid) {
                        ajax({
                            type: "post",
                            url: "php/user_shop.php",
                            data: "sid=" + sid,
                            dataType: "json"
                        }).then(() => {
                            let url = location.href;
                            if (url.indexOf("pay.html") != -1) {
                                location.reload();
                            }
                            ajax_shop();
                        });
                    }
                }
                //移入查询

            } else { //未登录状态
                header_r.dataset.isok = "0";
                header_r
                    .querySelector(".collapse a")
                    .innerHTML = "登陆/注册";
                let collapse = header_r.children;
                for (let i of collapse) {
                    i.lastElementChild.className = "hide";
                }
            }
        });

        header.onclick = e => {
            let This = e.target;
            if (This.parentNode.parentNode.dataset.isok == "0") {
                document
                    .getElementById("login")
                    .className = "show";
            }
            if (This.id == "login" || This.nodeName == "I") {
                document
                    .getElementById("login")
                    .className = "";
            }
            if (This.innerHTML == "注册") {
                document
                    .querySelector("#login .reg")
                    .className = "reg reg_s";
                document
                    .querySelector("#login .login")
                    .className = "login login_s";
            }
            if (This.innerHTML == "登录") {
                document
                    .querySelector("#login .reg")
                    .className = "reg";
                document
                    .querySelector("#login .login")
                    .className = "login";
            }
        }

        let loginBox = document.getElementById("login");
        let forms = document.forms;
        let login = forms.login;
        let reg = forms.reg;

        //封装花哨
        function action(e) {
            let This = e.target.nextElementSibling;
            This.parentNode.className = "text activa";
            if (This.className == "mask") {
                This.className = "mask activa";
            }
            if (This.className == "yzm_img") {
                This.style.borderLeftColor = "#191919";
            }

        }
        loginBox.onclick = e => {
            let This = e.target;
            if (This.className == "mask") {
                This
                    .previousElementSibling
                    .focus();
            }
        }
        let ipt = loginBox.querySelectorAll(".h");
        for (let i of ipt) {
            i.onfocus = e => {
                action(e);
            }
        }

        //提示
        function i_no(This, text) {
            This.dataset.isok = 0;
            This.parentNode.style.borderColor = "#d00";
            This.nextElementSibling.style.cssText += "border-color:#d00;color:#d00;";
            let span = This.parentNode.nextElementSibling.firstElementChild;
            span.className = "clue";
            span.innerHTML = text;
        }
        //通过
        function i_yes(This) {
            This.dataset.isok = 1;
            This.parentNode.style.borderColor = "#23a96f";
            This.nextElementSibling.style.cssText += "border-color:#23a96f;color:#23a96f;";
            let span = This.parentNode.nextElementSibling.firstElementChild;
            span.className = "";
            span.innerHTML = "";
        }
        //检测
        function isOk(This, type) {
            let val = type == "账号"
                ? This
                    .value
                    .replace(/\s/g, "")
                : This.value;
            if (val.length < 5 || val.length > 12) {
                i_no(This, "请输入5~12位的" + type);
            } else {
                if (type == "账号") {
                    ajax({type: "get", url: "php/isuser.php", data: `uname="${val}"`, dataType: "json"}).then(data => {
                        if (data != null) {
                            i_no(This, "用户名已被占用");
                        } else {
                            i_yes(This);
                        }
                    });
                } else {
                    i_yes(This);
                }
            }
        }

        reg.uname.onblur = e => {
            let This = e.target;
            isOk(This, "账号");
        }
        reg.upwd.onblur = e => {
            let This = e.target;
            let val = This.value;
            let Thisi = reg.upwdi;
            let vali = Thisi.value;
            if (val.length < 5 || val.length > 12) {
                i_no(This, "请输入5~12位的密码");
            } else if (vali.length > 4 && vali.length < 13) {
                i_yes(This);
                if (val != vali) {
                    i_no(Thisi, "两次密码不一致");
                    Thisi.value = "";
                } else {
                    i_yes(This);
                    i_yes(Thisi);
                }
            } else {
                i_yes(This);
            }
        }
        reg.upwdi.onblur = e => {
            let Thisi = e.target;
            let vali = Thisi.value;
            let This = reg.upwd
            let val = This.value;
            if (val.length < 5 || val.length > 12) {
                i_no(This, "请输入5~12位的密码");
            } else if (val != vali) {
                i_no(Thisi, "两次密码不一致");
                Thisi.value = "";
            } else {
                i_yes(Thisi);
            }
        }
        //submit_reg
        reg.onsubmit = e => {
            e.preventDefault();
            isOk(reg.uname, "账号");
            isOk(reg.upwd, "密码");
            if (reg.uname.dataset.isok == 1 && reg.upwd.dataset.isok == 1) {
                isOk(reg.upwdi, "密码");
                if (reg.upwdi.dataset.isok == 1) {
                    let uname = reg
                        .uname
                        .value
                        .replace(/\s/g, "");
                    let upwd = reg.upwd.value;
                    ajax({type: "post", url: "php/aifou_add.php", data: `uname=${uname}&upwd=${upwd}`, dataType: "json"}).then(bool => {
                        if (bool.ok == 1) {
                            alert("注册成功");
                            location.reload(true);
                            //loginBox.querySelector(".reg .icon_btn").click();
                        } else {
                            alert("注册失败");
                        }
                    })

                }
            }
        }

        //login
        function i_login(This, text) {
            let val = text == "账号"
                ? This
                    .value
                    .replace(/\s/g, "")
                : This.value;
            if (val.length < 5 || val.length > 12) {
                i_no(This, "请输入5~12位的" + text);
                return false;
            } else {
                i_yes(This);
                return true;
            }
        }

        login.uname.onblur = e => {
            let This = e.target;
            i_login(This, "账号");
        }
        login.upwd.onblur = e => {
            let This = e.target;
            i_login(This, "密码");
        }
        //submit_login
        login.onsubmit = e => {
            e.preventDefault();
            if (!i_login(login.uname, "账号")) {
                return;
            } else if (!i_login(login.upwd, "密码")) {
                return;
            } else {
                let uname = login
                    .uname
                    .value
                    .replace(/\s/g, "");
                let upwd = login.upwd.value;
                ajax({type: "post", url: "php/aifou_login.php", data: `uname=${uname}&upwd=${upwd}`, dataType: "json", isbeg: false}).then(bool => {
                    if (bool.i == 0) {
                        let span = e.target.lastElementChild.lastElementChild;
                        span.innerHTML = "账号或密码不正确";
                        span.className = "clue";
                        return;
                    } else {
                        location.reload(true);
                    }
                })
            }
        }

        //outlogin
        document
            .getElementById("outlogin")
            .onclick = e => {
            ajax({type: "get", url: "php/outlogin.php"}).then(() => {
                location.reload(true);
            })
        }

    })
})();
// (() => {
//     let url = location.href;
//     //console.log(url);
//     if (url.indexOf("product2.html?pid=") != -1) {
//         //console.log(123);
//         //console.log(document.querySelector("#product_1 .crowd>a"));
//         document.querySelector("#product_1 .crowd>a").innerHTML = "123";
//         document.querySelector("#product_1 .crowd>a").onclick = () => {
//             console.log(123);
//         }
//     }
// })();