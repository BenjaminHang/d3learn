console.log(d3);


var width = 1000;
var height =700;
var eles = {
	scale : 300,
}
var mymap = d3.selectAll("#mymap");
mymap.attr("width",width)
	 .attr("height",height);




// var projection = d3.geoMercator()
// 				   .center([115, 40])
// 				   .scale(100)
//     			   .translate([width/2, height/2]);//.translate([width/2, height/2]);;//.scale(100);




var projection = d3.geoOrthographic()
				   .center([0,0])
				   .scale(eles.scale)
    			   .translate([width/2, height/2])
    			   .precision(0.6);



/*******************************旋转规则************************************
调试原点（110，45）
第一个是左右转动，经度，负数越大，越从中国向日本旋转（自东向西为负方向）
第二个是上下转动，纬度，负数越大，越从赤道向北极旋转
第三个调整南北极

在原点东边，负数增大


******************************* 旋转规则********************************/
// var rotate = [255,-35,0];
var rotate = [-116,-40,0]
projection = projection.rotate(rotate);
var path4Render = d3.geoPath().projection(projection);


var locationObj = {};
// var location;
locationObj.ox = 110;
locationObj.oy = 45;
locationObj.cx = 0;
locationObj.cy = 0;


$("#mymap").on("click",function(e){
	[locationObj.cx,locationObj.cy] = projection.invert([e.offsetX, e.offsetY]);
	d3.transition()
	  .duration(600)
	  .tween("rotate", function(){
	  	console.log([locationObj.cx,locationObj.cy],projection.rotate());
	  	r = d3.interpolate(projection.rotate(), [-locationObj.cx,-locationObj.cy]);
		return function(t) {
			projection.rotate(r(t)).scale(eles.scale);
			mymap.selectAll("path")
				 .attr("d",path4Render);
		}
	  });
});

//定義鼠標滑輪事件
$("#mymap").on('mousewheel DOMMouseScroll',function(e){
	var wspeed = 30
	var oEv = e.originalEvent
	//console.log(oEv)
	var wRange = oEv.wheelDelta ? -oEv.wheelDelta/120 : (oEv.detail || 0)/3
	eles.scale += wRange*wspeed
	eles.scale = eles.scale < 300 ? 300:eles.scale
	console.log(eles.scale)
	projection.scale(eles.scale)
	// mymap.selectAll("path").attr("d",path4Render)
	backcircle.attr("r",eles.scale)

	var cln = getLayerNumber(eles.scale)
	console.log(cln,layerNumber)
	if(layerNumber != cln){
		mymap.selectAll("path").remove()
		layerNumber = cln
		switchLayer(layerNumber)
	}
	mymap.selectAll("path").attr("d",path4Render)
})
//定義圖層
var layerNumber = 0 
// 根據尺度選擇圖層
function getLayerNumber(scale){
	if(scale<800){return 0}
	else if(scale >=800){return 1}
	else{return 10}
};
function switchLayer(layerNumber){
	switch(layerNumber){
		case 0 : d3.json("worldsmall.json",renderMap);break;
		case 1 : d3.json("china.geojson",renderMap);break;
		default : 0;
	}
};




var color = d3.schemeCategory20c;



// d3.json("worldsmall.json",renderMap);

d3.json("worldsmall.json",renderMap);

var backcircle = mymap.append('circle')
	 .attr("cx",width/2).attr("cy",height/2)
	 .attr("r",projection.scale())
	 .attr("fill","#00d");


mymap.append('circle')
	 .attr("cx",0).attr("cy",0)
	 .attr("r",projection.scale()*0.3)
	 .attr("fill","#00d")
	 .on("click",function(){alert("点我干啥")});

function renderMap(error,root){
	mymap.selectAll("path")
		 .data(root.features)
		 .enter()
		 .append('path')
		 .attr("stroke","#000")
		 .attr("fill",function(d,i){
		 	return color[i%20];
		 })
		 .attr("stroke-width",1)
		 .attr("d", path4Render);
}

function markerOnMap(){

}

