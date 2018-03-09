(() => {
    let tbody = document.querySelector("#status .shop table tbody");
    let tfoot = document.querySelector("#status .shop table tfoot");
    let pics = tfoot.querySelector("b"); //总价
    let acts = tfoot.querySelector("span"); //全选
    //是否全选
    function allChk() {
        let len = tbody
            .querySelectorAll("tr")
            .length; //商品种类数量
        let chks = tbody
            .querySelectorAll(".active")
            .length; //选中个数
        if (len == chks) {
            acts.firstElementChild.className = "active";
        } else {
            acts.firstElementChild.className = "";
        }
    }
    //总价计算
    function getTotal(data, i) {
        let sum = Number(pics.innerHTML.slice(1)); //当前总价
        sum = sum + data * i;
        pics.innerHTML = "￥" + sum; //结果总价
    }

    //选中与删除
    tbody.onclick = e => {
        let This = e.target;
        if (This.className == "btn") { //删除
            let pid = This.dataset.pid;
            ajax({
                type: "post",
                url: "php/shop_date.php",
                data: "pid=" + pid
            }).then(() => {
                location.reload();
            });
        }
        if (This.className.indexOf("check") != -1) { //选中
            let pic = Number(This.dataset.pic);
            if (This.className.indexOf("active") != -1) { //0
                This.className = "check";
                getTotal(pic, -1);
                allChk();
            } else {
                This.className = "check active"; //1
                getTotal(pic, 1);
                allChk();
            }
        }
    }
    //全选
    acts.onclick = e => {
        let chks = tbody.querySelectorAll(".check");
        let This = acts.firstElementChild;
        if (This.className == "") {
            This.className = "active"; //1
            let sum = 0;
            for (let chk of chks) {
                if (chk.className.indexOf("active") == -1) {
                    sum += Number(chk.dataset.pic);
                    chk.className = "check active";
                }
            }
            getTotal(sum, 1);
        } else {
            This.className = ""; //0
            let sum = 0;
            for (let chk of chks) {
                sum += Number(chk.dataset.pic);
                chk.className = "check";
            }
            getTotal(sum, -1);
        }
    }
    //删除所选
    tfoot
        .querySelector("a.dels")
        .onclick = () => {
        let tar = tbody.querySelectorAll(".active");
        if (tar.length > 0) {
            let bool = confirm("确定要将商品从购物车中删除吗？");
            if (bool) {
                let del = "";//副
                let pid = "";//主
                for (let p of tar) {
                    if(p.dataset.pid != undefined){
                        pid = p.dataset.pid;
                    }
                    if(p.dataset.sid != undefined){
                        del += p.dataset.sid + "_";
                    }
                }
                del = del.slice(0, -1);
                console.log(`sids="${del}"&pid="${pid}"`);
                ajax({
                    type:"post",
                    url:"php/shop_date.php",
                    data:`sids=${del}&pid=${pid}`
                }).then(()=>{
                    location.reload();
                })
            }
        } else {
            alert("未勾选商品");
        }
    }
    //结算
    tfoot
        .querySelector("a.btn")
        .onclick = () => {
        let all = tbody.querySelectorAll(".active");
        if (all.length > 0) {
            let sids = '';
            for (let i of all) {
                if(i.dataset.sid != "undefined"){
                    sids += i.dataset.sid + "_";
                }
            }
            sids = sids.slice(0, -1);
            console.log(sids);
            alert("......");
            // ajax({
            //     type: "post",
            //     url: "php/shop_pay.php",
            //     data: "sids=" + sids,
            //     dataType: "json"
            // }).then(data => {
            //     console.log(data);
            // })
        } else {
            alert("未勾选商品");
        }
    };

    //超时检测
    function monitor(en, pid) {
        let timer = setInterval(() => {
            let now = new Date();
            let end = en - now;
            if (end < 0) { //商品失效
                ajax({
                    type: "psot",
                    url: "php/shop_date.php",
                    data: "pid=" + pid
                }).then(() => {
                    clearInterval(timer);
                    alert("该商品支付时间已过期");
                    location.reload();
                })
            } else {
                let m = parseInt(end / 1000 / 60) + "分" + parseInt(end / 1000 % 60) + "秒";
                tbody
                    .querySelector(".main .date span")
                    .innerHTML = m;
            }
        }, 1000)
    }
    //ajax请求
    function ajax_shop() {
        ajax({type: "post", url: "php/user_shop.php", dataType: "json"}).then(data => {
            let shop = data.shop;
            let af = data.af;
            let html = '';
            let total = 0;
            if (shop.length > 0 || af.length > 0) {
                if (shop.length > 0) {
                    let i = shop[0];
                    let en = i.en;
                    monitor(en, i.pid);
                    let now = new Date();
                    let end = en - now;
                    let m = parseInt(end / 1000 / 60) + "分" + parseInt(end / 1000 % 60) + "秒";
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
                    let ttl = i.isyd != 0 && "移动" + i.isyd + "G/";
                    ttl += i.islt != 0 && "联通" + i.islt + "G/";
                    ttl += i.isdx != 0 && "电信" + i.isdx + "G/";
                    ttl = ttl
                        .replace(/false/g, "")
                        .slice(0, -1);
                    let text = `${i.pname} ${i.pram}G ${ttl}`;
                    html += `<tr><td class="re"><i class="check active" data-pid="${i.pid}" data-pic="${i.pprice * i.sum}"></i><a class="main" href="product.html?pid=${i.pid}"><p class="date"><i></i>请于<span>${m}</span>内完成该产品的支付</p><img src="picture/list/${i.cid}/${i.iscolor}.png" width="100"><div class="list"><h3>${text}</h3><p><span>寄售单号：</span>RE201712181610471</p><p><span>颜色：</span>${c}</p></div></a></td><td>￥${i.pprice}</td><td>${i.sum}</td><td>￥${total += i.pprice * i.sum}</td><td class="re"><i class="btn" data-pid="${i.pid}"></i></td></tr>`;
                }
                if (af.length > 0) {
                    for (let i of af) {
                        total += i.pprice * i.sum;
                        html += `<tr><td class="re"><i class="check active" data-sid="${i.sid}" data-pic="${i.pprice * i.sum}"></i><a class="main" href="product2.html?pid=${i.pid}"><img src="picture/product/fus/${i.pid}/1.png" width="100"><div class="list"><h3>${i.pname}</h3><p><span>寄售单号：</span>RE201801021532123</p><p><span>颜色：</span>${i.iscolor}</p></div></a></td><td>￥${i.pprice}</td><td><i></i>${i.sum}<i></i></td><td>￥${i.pprice * i.sum}</td><td class="re"><i class="btn" data-pid="${i.pid}"></i></td></tr>`
                    }
                }
            }
            tbody.innerHTML = html;
            pics.innerHTML = "￥" + total;
        })
    }
    ajax_shop();
})();