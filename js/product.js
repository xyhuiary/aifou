(() => {
    let pid = location
        .search
        .slice(1);
    ajax({type: "get", url: "php/product.php", data: pid, dataType: "json"}).then(arr => {
        let k = arr.data;
        let ttl = k.isyd != 0 && "移动" + k.isyd + "G/";
        ttl += k.islt != 0 && "联通" + k.islt + "G/";
        ttl += k.isdx != 0 && "电信" + k.isdx + "G/";
        ttl = ttl
            .replace(/false/g, "")
            .slice(0, -1);
        let text = `${k.pname} ${k.pram}G ${ttl}`;
        document
            .getElementById("htmlName")
            .innerHTML = text;
        let c = "";
        switch (k.iscolor) {
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
        let html = `<div class="text"><h2>${text}</h2><span>产品编号：RE201711131515363</span></div>
    <ul><li><span>价格</span><b>￥${k.pprice}</b></li><li><span>配置</span><a>${k.pram}G</a></li><li><span>版本</span><a>${ttl}</a></li><li><span>颜色</span><a>${c}</a></li><li><span>销售地区</span><a>大陆国行</a></li></ul>`;

        //详情价格
        document
            .querySelector("#product_1 .crowd>div")
            .innerHTML = html;
        //购买按钮
        function btn() {
            let en = Number(k.isshop); //结束时间
            let now = (new Date()).getTime(); //当前时间
            let bit = en - now;
            if (bit < 0) {
                //clearInterval(timer);
                ajax({type: "get", url: "php/shop_date.php", data: pid}).then(() => {
                    location.reload();
                });
            }
            let date = parseInt(bit / 1000 / 60) + "分";
            date += parseInt(bit / 1000 % 60) + "秒";
            let a = document.querySelector("#product_1 .crowd>a");
            a.innerHTML = date;
            a.className = "none";
            a.href = "javascript:;";
        }
        if (k.isshop > 0) {
            btn();
            let timer = setInterval(() => {
                if (k.isshop > 0) {
                    btn();
                }
            }, 1000);
        } else {
            let isok = document
                .querySelector("#header .header_r")
                .dataset
                .isok;
            let a = document.querySelector("#product_1 .crowd>a");
            if (isok != 1) {
                a.onclick = () => {
                    document
                        .getElementById("login")
                        .className = "show";
                }
            } else {
                a.onclick = e =>{
                    ajax({
                        type: "get",
                        url:"php/iszhu.php",
                        dataType:"json"
                    }).then(data=>{
                        //console.log(data.code);
                        if(data.code==1){
                            let now = (new Date()).getTime();//获取当前时间
                            ajax({
                                type:"post",
                                url:"php/shop_add.php",
                                data:`${pid}&now=${now}`,
                                dataType:"json"
                            }).then(data=>{
                                //console.log(data);
                                if(data.code == 1){
                                    location.href = "pay.html";
                                }else{
                                    alert(data.msg);
                                }
                            })
                        }else{
                            alert("已有主商品");
                        }
                    })
                }
            }
        }
        //评级abc
        document
            .getElementById("abc")
            .src = "picture/list/abc/" + k.plv + "max.png";

        //表格一
        let tab1 = `<tr><th rowspan="6">主体信息</th><td>型号</td><td>${k.pname}</td></tr><tr><td>销售地区</td><td>大陆国行</td></tr><tr><td>支持网络</td><td>${ttl}</td></tr><tr><td>颜色</td><td>${c}</td></tr><tr><td>系统版本</td><td>iOS 11.1.1</td></tr><tr><td>内存</td><td>${k.pram}G</td></tr>`;
        document.querySelectorAll("#deploy  .rowi .tab table")[0].innerHTML = tab1;

        ajax({type: "get", url: "php/product_img.php", data: pid, dataType: "json"}).then(html => {
            let str = '';
            for (let i of html) {
                str += `<img src="picture/product/${i.img_src}">`;
            }
            let screen = document.querySelector("#product_1 .stage .stage_min .screen");
            screen.innerHTML = str;
            screen.firstChild.className = "activa";
            document
                .querySelector("#product_1 .stage .stage_max img")
                .src = "picture/product/" + html[0].img_src;

            //大图片
            let masks = document.querySelector("#product_1 .stage .stage_max .masks");
            let mask = document.querySelector("#product_1 .stage .stage_max .mask");
            let stage_max = document.querySelector("#product_1 .stage .stage_max");
            let lgimg = document.querySelector("#product_1 .stage .stage_max .lgimg");
            masks.onmouseover = e => {
                mask.style.display = "block";
                lgimg.style.display = "block";
            }
            masks.onmousemove = e => {
                let t = e.offsetY - 100,
                    l = e.offsetX - 100;
                t = t < 0
                    ? 0
                    : t > 200
                        ? 200
                        : t;
                l = l < 0
                    ? 0
                    : l > 200
                        ? 200
                        : l;
                mask.style.cssText += `top:${t}px;left:${l}px;`;
                let img = stage_max
                    .querySelector("img")
                    .src;
                lgimg.style.cssText += `background:url(${img.slice(img.indexOf("picture/product/"))}) ${ - 2 * l}px ${ - 2 * t}px/800px;`;
            }
            masks.onmouseout = e => {
                mask.style.display = "none";
                lgimg.style.display = "none";
            }
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

    });
})();