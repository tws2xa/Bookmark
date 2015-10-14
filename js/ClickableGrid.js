function ClickableGrid(x, y, width, height){
	this.grid = document.createElement('table');
	this.gridcolor = getCardBackgroundColor();
	this.backgroundColor = getDisplayBackgroundColor();
	
	this.position = new Rectangle(x,y,width,height);
	
	this.unitheight = height/4 - 3;
	this.unitwidth = width/4 - 3;
	
	
}

ClickableGrid.prototype.draw = function(context){
	context.fillStyle = this.backgroundColor;
	context.fillRect(this.position.x, this.position.y, this.position.width, this.position.height);
	console.log('yoos');
	var i = 0;
	for (var r=0; r<4; ++r){
    	var tr = this.grid.appendChild(document.createElement('tr'));
		for (var c=0; c<4; ++c){
    		var cell = tr.appendChild(document.createElement('td'));
			cell.innerHTML = ++this.i;
			cell.addEventListener('click',(function(el,r,c,i){
	    		return function(){
                    callback(el,r,c,i);
                }
            })(cell,r,c,i),false);
            
            context.fillStyle = this.gridcolor;
            context.fillRect(this.position.x, this.position.y, this.unitwidth, this.unitheight);
        }
    }
    
    return this.grid;
}