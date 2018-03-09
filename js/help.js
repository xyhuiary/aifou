(()=>{
    let dt=document.getElementsByTagName("dt");
    for(let i of dt){
        i.onclick=e=>{
            let This=e.target;
            if(This.className==""){
                let activa=document.querySelector("dt.activa");
                activa!=null&&(activa.className="");
                
                This.className="activa";
            }else{
                This.className="";
            }
        }
    }
})();