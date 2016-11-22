var DoofBreak=DoofBreak || {};
var Credit_Text_0 = [];
var Credit_Text_1 = [];
var Credit_Text_2 = [];
var Credit_Text_3 = [];
var Credit_Text_4 = [];

Credit_Text_0[0] = "Art Work";
Credit_Text_1[0] = "John X";
Credit_Text_2[0] = "bakbalkfja;lk;aslkdfjas;dlfkjasd;";
Credit_Text_3[0] = "Image.jpg";
Credit_Text_4[0] = "www.facebook.com";


DoofBreak.Credits=function(game) {

};

DoofBreak.Credits.prototype = {
    preload: function() { 
    
        // This function will be executed at the beginning     
        // That's where we load the images and sounds 
         this.load.image('paddle', 'assets/e.jpg');
         this.load.image('bullet', 'assets/bullet.png');
         this.load.image('brick', 'assets/brick.png');
         this.load.image('straight_line', 'assets/straight_line.png');
         

        this.game.load.image('bimg', 'assets/bimg2.jpg');
       
    },

    create: function() { 
    	
     	m1=this.game.add.audio('m1');
   	m1.play();
   	this.game.stage.backgroundColor = '#000000';
  	  	this.game.add.image(this.game.world.centerX, this.game.world.centerY, 'bimg').anchor.set(0.5);

    	var style = { font: "16px Helvetica", fill: "#FFFFFF", align: "right" };
    	
    	this.game.add.text(5,0,Credit_Text_0[0]+" "+Credit_Text_1[0], style);
    	
    
    	// button_2back1 = this.game.add.button(16, 500, '2back_1color', this.set2Back1, this);
       //button_2back2 = this.game.add.button(160, 500, '2back_2color', this.set2Back2, this);
       //button_3back1 = this.game.add.button(16, 600, '3back_1color', this.set3Back1, this);
  
    },
    open_link: function(url) {
    	window.open(url);
    },
  	 update: function() {	
  	
  	 }
 };
     
     
