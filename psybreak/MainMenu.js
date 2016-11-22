var DoofBreak=DoofBreak || {};

DoofBreak.MainMenu=function(game) {

};

DoofBreak.MainMenu.prototype = {
    preload: function() { 
    
        // This function will be executed at the beginning     
        // That's where we load the images and sounds 
         this.load.image('paddle', 'assets/e.jpg');
         this.load.image('bullet', 'assets/bullet2.png');
         this.load.image('brick', 'assets/brick.png');
         this.load.image('straight_line', 'assets/straight_line.png');
         

        this.game.load.image('bimg', 'assets/bimg1.jpg');
        this.game.load.image('start_game', 'assets/start_game.jpg');
        this.game.load.image('credits', 'assets/credits_button.jpg');
        this.game.load.image('instructions', 'assets/instructions_button.jpg');

        
       
    },

    create: function() { 
     	m1=this.game.add.audio('m1');
   	//m1.play();
   	this.game.stage.backgroundColor = '#000000';
  	  	this.game.add.image(this.game.world.centerX, this.game.world.centerY, 'bimg').anchor.set(0.5);

    	var style = { font: "16px Helvetica", fill: "#FFFFFF", align: "right" };
    	
    	 button_2back1 = this.game.add.button(240,80, 'start_game', this.start_game, this);
    	 button_2back2 = this.game.add.button(240,160, 'instructions', this.instructions, this);
    	 button_2back4 = this.game.add.button(240,320, 'credits', this.start_credits, this);
  
    },
  	 update: function() {	
  	
  	 },
  	 start_game: function() {
  	 	 this.game.level = 1;
  	 	 this.game.state.start('Game');
  	 },
  	 start_credits: function() {
  	 	this.game.state.start('Credits');
  	 },
  	instructions: function() {
  	 	this.game.state.start('Instructions');
  	 }
 }
;
     
     
