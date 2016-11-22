var DoofBreak=DoofBreak || {};

DoofBreak.LevelSelect=function(game) {

};

DoofBreak.LevelSelect.prototype = {
    preload: function() { 
    
        // This function will be executed at the beginning     
        // That's where we load the images and sounds 
         this.load.image('paddle', 'assets/e.jpg');
         this.load.image('bullet', 'assets/bullet.png');
         this.load.image('brick', 'assets/brick.png');
         this.load.image('straight_line', 'assets/straight_line.png');
         

        this.game.load.image('bimg', 'assets/bimg1.jpg');
        this.game.load.image('start_game', 'assets/start_game.jpg');
        this.game.load.image('high_scores', 'assets/hs.jpg');
        this.game.load.image('shop','assets/shop.jpg');
        this.game.load.image('credits', 'assets/credits.jpg');  
       
    },

    create: function() { 
    
   	this.game.stage.backgroundColor = '#000000';
  	  	this.game.add.image(this.game.world.centerX, this.game.world.centerY, 'bimg').anchor.set(0.5);
    	var button_2back1 = this.game.add.button(240,80, 'start_game', this.start_level, this);
    	var style = { font: "16px Helvetica", fill: "#FFFFFF", align: "right" };

  
    },
  	 update: function() {	
  	
  	 },
  	 start_level: function() {
  	 	 this.game.level = 1;
  	 	 this.game.state.start('Game');
  	 },
 }
;