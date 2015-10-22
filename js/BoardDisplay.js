function BoardDisplay(x, y, width, height){
	this.grid = document.createElement('table');
	this.gridcolor = getCardBackgroundColor();
	this.backgroundColor = getDisplayShadowColor();
	
	this.position = new Rectangle(x,y,width,height);
	
	this.unitheight = height/4 - 3;
	this.unitwidth = width/4 - 3;
	
	this.elements = [];
}

BoardDisplay.prototype.draw = function(context){
	context.fillStyle = this.backgroundColor;
	context.fillRect(this.position.x, this.position.y, this.position.width, this.position.height);
	var i = 0;
	for (var r=0; r<4; ++r){
    	//var tr = this.grid.appendChild(document.createElement('tr'));
		for (var c=0; c<4; ++c){
    		//var cell = tr.appendChild(document.createElement('td'));
			/*cell.innerHTML = ++this.i;
			cell.addEventListener('click',(function(el,r,c,i){
	    		return function(){
                    callback(el,r,c,i);
                }
            })(cell,r,c,i),false);*/
            
            this.elements[r*c] = new BoardItem(this.position.x + (r*this.position.width/4) + 1.5, this.position.y + (c*this.position.height/4) + 1.5, 			this.unitwidth, this.unitheight);
            this.elements[r*c].draw(context);
            //context.fillStyle = this.gridcolor;
            
            //context.fillRect(this.position.x + (r*this.position.width/4) + 1.5, this.position.y + (c*this.position.height/4) + 1.5, 			this.unitwidth, this.unitheight);
            
        }
    }
    
}