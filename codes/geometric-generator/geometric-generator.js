////////////////////////////////////////	
// Geometric Generator by Pedro PSI 2019	 
// CC-BY-4.0								
////////////////////////////////////////	

////////////////////////////////////////
// Initialise Canvas

var c = document.getElementById("geometry");
var ctx = c.getContext("2d");

ctx.lineWidth = "1";
ctx.strokeStyle = "green"; 
ctx.fillStyle = "green"; 

function ClearCanvas(){
	ctx.clearRect(0, 0, c.width, c.height);
}

ClearCanvas();

////////////////////////////////////////
// Randomness
function RandomInteger(min,max){
	return Math.ceil(Math.random()*(max-min)+min-0.5);	
}

function RandomIntegerArray(n,min,max){
	var a=[];
	for(var i=0;i<n;i++){
		a.push(RandomInteger(min,max));
	}
	return a;
}

////////////////////////////////////////
// Points data structure
// JSON object, containing:
// centre:[x,y]
// orbit_number:n 
// orbit_alpha:2*PI    //starting angle
// orbit_range:2*PI 	full range (2Pi) or focused at a particular sector (2Pi/x)
// 
//
//





////////////////////////////////////////
// Points, point arrays and point trees
// [[0,0],[1,1],[[2,1],[2,2]]]

function isPoint(p){
	return (typeof p[0] ==="number")&&(typeof p[1] ==="number")&&p.length===2;
}

function isPointArray(p){
	return (p.every)&&p.every(isPoint);
}

function ApplyPoints(pointstree,F){
	if(isPoint(pointstree))
		return F(pointstree);
	else
		return pointstree.map(p=>ApplyPoints(p,F));
}

function ApplyPointsIndexed(pointstree,F,index){
	if(isPoint(pointstree))
		return F(pointstree,index);
	else{
		var P=[];
		for (var i=0;i<pointstree.length;i++){
			var po=ApplyPointsIndexed(pointstree[i],F,i);
			P.push(po);
		}
		return P;
	}
}

function ApplyPointArray(pointstree,F){
	if(isPoint(pointstree))
		return pointstree;
	else if(isPointArray(pointstree))
		return F(pointstree)
	else
		return pointstree.map(p=>ApplyPointArray(p,F));
}

////////////////////////////////////////
// Drawing

function DrawPA(pointsarray){
	ctx.beginPath(); 
	var x;var y;
	var i=0;
	var l=pointsarray.length;
	
	x=pointsarray[l-1][0];
	y=pointsarray[l-1][1];
	ctx.moveTo(x,y);
	
	for(var i in pointsarray){
		x=pointsarray[i][0];
		y=pointsarray[i][1];
		ctx.lineTo(x,y);
	}
	ctx.closePath();
	ctx.stroke(); 
}

function Draw(pointstree){
	return ApplyPointArray(pointstree,DrawPA);
}

////////////////////////////////////////
// Geometry

PI=Math.PI;

// Coordinates for regular polygon
function RegularCentered(parameters){

var index=parameters.index?parameters.index:0; //number within ring
var depth=parameters.depth?parameters.depth:0; //ring depth

var sides=parameters.sides?parameters.sides:3; //how many points in ring
var size=parameters.size?parameters.size:10;   //radius of ring
var angle=parameters.angle?parameters.angle:0; //angle within ring
var centrearray=parameters.centrearray?parameters.centrearray:[0,0]; //ring centre
var x=centrearray[0];
var y=centrearray[1];

var rotation=parameters.rotation?parameters.rotation:0; // external ring angle
var expansion=parameters.expansion?parameters.expansion:1; // external size

var pointsarray=[];
var theta,scale;
for (var i=1;i<=sides;i++){
	theta=2*PI/sides*i+angle+2*PI*index*rotation;
	scale=size*expansion;
	pointsarray.push(
	[
	x+scale*Math.cos(theta),
	y+scale*Math.sin(theta)
	])
}
return pointsarray;
};


// Open new branches in tree
function Open(pointstree,parameters,depth){
	return ApplyPointsIndexed(
		pointstree,
		function F(p,i){
			return RegularCentered(FuseObjects(parameters,{
			centrearray:p,
			index:i,
			depth:depth
			}))},
		0
		);
}

/*function OpenPA(pointstree,parameters){
var rotation=parameters.rotation?parameters.rotation:0;
var twist=parameters.twist?parameters.twist:0;
}*/

function Cascade(pointstree,parametersArray,depth){
	//Limit iterations
	if(Cascade.i===undefined)
		Cascade.i=0;
	else if(Cascade.i>10)
		return "Limit reached";
	Cascade.i++;
	
	var d=depth?depth:0;

	if(parametersArray.length<1)
		return pointstree;
	else{
		var parA=parametersArray;
		var par0=parA[0];
		parA.shift();
		return Cascade(Open(pointstree,par0,d),parA,d+1);
	}
}


////////////////////////////////////////


function RandoMultiPolygon(){
	var s=RandomInteger(3,6);
	var r=2*PI*RandomInteger(1,s)/s,
/*
	var multiple=RandomInteger(1,4);

	MultiPolygon({
		sides:sides,
		siz:RandomIntegerArray(multiple,1,5).map(x=>x*10),
		separatio:RandomIntegerArray(multiple,1,2),
		rotatio:RandomInteger(1,4)/sides,
		twis:1.5,
		centrearray:[250,250]
	});
	*/
	
	return Cascade(RegularCentered({size:100,centrearray:[250,250],angle:r,sides:s}),
		[
		{size:30,centrearray:[250,250],angle:r,sides:s},
		{size:10,centrearray:[250,250],angle:r,sides:s,rotation:1/8}]);
}



//////////////

function GeometricGenerator(){
	
	Draw(RandoMultiPolygon())
}