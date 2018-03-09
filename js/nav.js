ajax({type: "get", url: "nav.html"}).then(html => {
    document
        .getElementById("nav")
        .innerHTML = html;
})
ajax({type: "get", url: "php/index_header.php", dataType: "json"}).then(html => {
    let str = '';
    for (let i of html) {
        str += `<a href="list.html?${i.hid}">${i.hname}</a>`;
    }
    document
        .querySelector("#nav .nav .nav_r")
        .innerHTML = str;
});