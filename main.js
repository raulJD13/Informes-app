var a;

function multiFunction(x,y) {
    if(x==0){
        a="x es 0";
        return 0;
    }else{
        if(y==0){
            a="y es 0";
            return 0;
        }else{
            a="no hay problemas";
            return x*y;
        }
    }
}

console.log(multiFunction(),a);