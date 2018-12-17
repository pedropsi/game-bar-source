
function Lock(id,saltedkey){
	return Encrypt(id,PureKey(saltedkey));
}

function Unlock(id,saltedkey){
	return Decrypt(id,PureKey(saltedkey));
}


function SaltedKey(key,salt){
	var dummy="pedropsi";
	return Encode(key,dummy,salt)};
	
function PureKey(saltedkey){
	var dummy="pedropsi";
	return Decode(saltedkey,dummy)};

	
function Decode(id,key){
	var decoded=Decrypt(id,key);
	var a="";
	var m=12;
	for(i=0;i<decoded.length-m;i++)
		a=a+decoded[i];
	return Decrypt(a,key);
}

function Encode(id,key,salt){
	var s=Encrypt(id,key);
	var m=12;
	for(i=0;i<m;i++)
		s=s+salt[i%salt.length];
	return Encrypt(s,key);
}


function ToNumbers(str){
	var a=[];
	for (i=0;i<str.length;i++)
		a.push((((str.charCodeAt(i)-48+75)%75-17+75)%75-32+68)%68);
	return a;
}

function FromNumbers(a){
	var arr=a;arr.unshift(0);
	function FrNr(n){return String.fromCharCode((((((n+32)%68)+17)%75)+48)%123)};
	arr=arr.reduce((x,y)=>x+FrNr(y));
	return arr.slice(1);
}

/*FromNumbers(ToNumbers("0123456789 abcdefghijklmnopqrstuvwxyz ABCDEFGHIJKLMNOPQRSTUVWXYZ"))
*/
function Decrypt(id,key){
	
	var nid=ToNumbers(id);
	var nkey=ToNumbers(key);
	var maxx= Math.max(nid.length,nkey.length);
	
	for(var j=0;j<maxx;j++)
		for(var i=0;i<maxx;i++)
			nid[i%(nid.length)]=((nid[i%(nid.length)]-j*nkey[(i+j)%(nkey.length)])+62*j)%62;
	
	return FromNumbers(nid);
}

function Encrypt(id,key){
	
	var nid=ToNumbers(id);
	var nkey=ToNumbers(key);
	var maxx= Math.max(nid.length,nkey.length);
	
	for(var j=0;j<maxx;j++)
		for(var i=0;i<maxx;i++)
			nid[i%(nid.length)]=(nid[i%(nid.length)]+j*nkey[(i+j)%(nkey.length)])%62;
	
	return FromNumbers(nid);
}
