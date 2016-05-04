window.onload = function(){
//深度遍历
function traverseDF(node){
	if(node){
		divList.push(node);
		for(var i = 0,len = node.children.length;i <len; i ++){
			traverseDF(node.children[i]);
		}
	}
}

//广度遍历
var BFindex = 0 ;
function traverseBF(node){
	if(node){
		divList.push(node);
		traverseBF(node.nextElementSibling);
		node = divList[BFindex ++];
		traverseBF(node.firstElementChild);
	}
}


	//颜色变化
	function changeColor(){
		var i = 0, len = divList.length;
		divList[i].style.backgroundColor = "blue";
		timer = setInterval(function(){
			i ++;
			if(i < len){
				divList[i].style.backgroundColor = 'blue';
				divList[i-1].style.backgroundColor = '#fff';
			}else{
				clearInterval(timer);
				divList[len-1].style.backgroundColor = '#fff';
				divList = [];
			}
		},500) 
	}
	//初始化
	function reset(){
		divList = [];
		clearInterval(timer);
		var div = document.getElementsByTagName('div'); 
		for(var i = 0,len = div.length; i<len; i++){
			div[i].style.backgroundColor = "#fff";
		}

	}

	var btn = document.getElementsByTagName('input');
	var root = document.getElementById('root');
	var divList = [];
	var timer = null;

	btn[0].onclick = function(){
		reset();
		traverseDF(root);
		changeColor();
		console.log(divList);
	}
	btn[1].onclick = function(){
		reset();
		traverseBF(root);
		changeColor();
		console.log(divList);
	}
}
	//btn[2].onclick = function(){
	//	reset();
	//	postOrder(root);
	//	changeColor();
	//	console.log(divList);
	//}
