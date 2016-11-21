// Create our 'main' state that will contain the game
// Pecularity 1: Can't call method arguments in arcade.collide otherwise it automatically calls the function
var DoofBreak=DoofBreak || {};

if(IPAD == true) { //setup static brick positioning vars
		var BRICK_DIM1 = 35
		var BRICK_DIM2 = 40;
		var BRICK_DIM3 = 20; 
	} else if(IPHONE == true) {
		var BRICK_DIM1 = 5;
		var BRICK_DIM2 = 150;
		var BRICK_DIM3 = 30;
	}

function randomWithRange(min,max) {
   	var range = (max - min) + 1;     
   	var v = (Math.random() * range) + min;
   	return v;
   	
};
DoofBreak.Game =function(game) {
	this.demo = true;
	this.game_timer = 0;
	this.bullet_count = 10;
	this.LEVEL_COMPLETE_SCORE = 100;
	this.level = 1;
	this.BULLET_MAX = 10;
	this.brick_count = 0;
	this.GAME_TIME = 180; //3min rounds
	this.game_score = 0;
	this.score_text;
	this.multiplier_text;
	this.bullets = [];
	this.bricks = [];
	this.obj_flip= []; //this must be an array because multiple ball hits fuck up the collision detection as the code only checks for one ball atm.
	this.powerup=null;
	this.powerup_speed=false;
	this.speed_up = 0;
	this.speed_down = 0;
	
	this.paused=false;
	this.gameover = false;
	/* Use these variables to determine gameover and ranks*/
	this.bullets_total = 0;
	this.bullets_hit = 0;
	this.bullets_missed = 0;
	this.multi_paddles = 0;
	this.big_multipliers = 0;
	this.bullet_waves = 0;
	this.ad_invisible = false;
	
	this.bimgs = [];
	
	
	this.level_images = [];	
	
	this.track_artist = [];
	this.track_file = [];	
	this.track_title = [];
	this.track_link = [];
	this.track_image = [];
		
};

DoofBreak.Game.prototype = {
    preload: function() { 
    	
        // This function will be executed at the beginning     
        // That's where we load the images and sounds 
         this.load.image('paddle', 'assets/e.jpg');
         this.load.image('bullet', 'assets/bullet.png');
         this.load.image('bullet_r', 'assets/bullet_r.png');
         this.load.image('bullet_y', 'assets/bullet_y.png');
         this.load.image('bullet_g', 'assets/bullet_g.png');
         this.load.image('brick', 'assets/brick.png');
         this.load.image('straight_line', 'assets/straight_line.png');
         this.load.image('powerup_rocket', 'assets/rocket.png');
         this.load.image('powerup_slow', 'assets/snail.png');
         this.load.image('powerup_shield', 'assets/shield.png');
        this.game.load.audio('m1', 'assets/audio/m1.mp3');
        //this.game.load.audio('m2', 'assets/audio/m2.mp3');
        
		//level_images      
		  for(var x = 1;x<=level_backgrounds.length;x++) { 
        	this.game.load.image(level_backgrounds[x], "assets/backgrounds/"+level_backgrounds[x]+".png");
        }
    },
	
	loadTrackData: function() {
			var x = 0;
			var xmlhttp = new XMLHttpRequest();
			xmlhttp.onreadystatechange = function()	{
  			if(xmlhttp.status==200 && xmlhttp.readyState==4){    
    			var words = xmlhttp.responseText.split('\n');
    			for(var v=0;v<words.length;v++) {
	    			var val = words[v].split(':');
	    			var key = val[0];
	    			var val2 = val[1];	
	    			if(key=='Artist') {
	    				this.track_artist[x] = val2;
	    			} else if(key == 'Track') {
	    				this.track_title[x] = val2;
	    			} else if(key == 'File') {
	    				this.track_file[x] = val2;
	    			} else if(key == 'Link') {
	    				this.track_link[x] = val2;
	    			} else if(key == 'Image') {
	    				this.track_image[x] = val2;
	    				x++;
	    			}
	    		
    			}
    			
  			}

		}
		xmlhttp.open("GET","data/Tracks.dat",true);
		xmlhttp.send();
     },
    
	nextTrack: function() {
		
	},
    create: function() { 
     //  m2=this.game.add.audio('m1');
     //  m2.play();
     //  this.loadTrackData();
      
      //m2.onStop.add(nextTrack,this);
     	//var Ad_Rect = new Phaser.Rectangle(0,this.game.height-10,300,30)
     	//this.game.debug.geom(Ad_Rect,'#232333');    
   	
   	var style = { font: "16px Helvetica", fill: "#FFFFFF", align: "right" };
      var ad_text = this.game.add.text(15, this.game.height-40, "A.C.E. ", style);
      ad_text.inputEnabled = true;            
      ad_text.events.onInputDown.add(function () {                
      	window.open('http://www.facebook.com');               
      }, this);
      this.game.time.events.repeat(20000,1000,function() {
      	if(this.ad_invisible==false) {   
      		this.game.add.tween(ad_text).to({alpha: 0}, 1500, Phaser.Easing.Linear.None, true);
      		this.ad_invisible = true;
      	} else {
      		this.game.add.tween(ad_text).to({alpha: 1}, 1500, Phaser.Easing.Linear.None, true);
      		this.ad_invisible=false;
      	}
      }, this);
   
   for(var y = level_backgrounds.length;y>1;y--) {
  	 	this.bimgs[y] = this.game.add.sprite(this.game.world.centerX, this.game.world.centerY, level_backgrounds[y]);
	 	this.bimgs[y].anchor.set(0.5);   
    	this.bimgs[y].visible = false;
    }
   
   this.bimgs[1] = this.game.add.sprite(this.game.world.centerX, this.game.world.centerY, level_backgrounds[1]);
   this.bimgs[1].anchor.set(0.5);
	 
	 
    	var style = { font: "16px Helvetica", fill: "#FFFFFF", align: "right" };
    	this.score_text = this.game.add.text(525, 6, "Score: 0 ", style);
    	this.multiplier_text = this.game.add.text(525, 26, "Multiplier: 0 ", style);
 
 		this.rank_text = this.game.add.text(10, 26, "Power: 100 ", style);    	
    	this.level_text = this.game.add.text(10, 6, "Level: 1 ", style);
    	
        // This function is called after the preload function     
        // Here we set up the game, display sprites, etc. 
        // Set the background color to blue
			this.game.stage.backgroundColor = '#000000';

		// Start the Arcade physics system (for movements and collisions)
		this.game.physics.startSystem(Phaser.Physics.Arcade);

		// Add the physics engine to all the game objects
		this.game.world.enableBody = true; 
		
	  this.left = this.game.input.keyboard.addKey(Phaser.Keyboard.LEFT);
     this.right = this.game.input.keyboard.addKey(Phaser.Keyboard.RIGHT);
     this.up = this.game.input.keyboard.addKey(Phaser.Keyboard.UP);
     this.down = this.game.input.keyboard.addKey(Phaser.Keyboard.DOWN);

    // Add the paddle at the bottom of the screen

    this.paddle = this.game.add.sprite(200, 400, 'paddle');

	 //use for debugging    
    //this.game.add.sprite(0, 200, 'straight_line');

    this.spawnBricks();
    this.spawnBullet();

    // Make sure the paddle won't move when it hits the ball
    this.paddle.body.immovable = true;
    
    spaceKey = this.input.keyboard.addKey(Phaser.Keyboard.SPACEBAR);
    spaceKey.onDown.add(this.togglePause, this);

    
    },
	togglePause: function() {
		this.game.physics.arcade.isPaused = (this.game.physics.arcade.isPaused) ? false : true;
		if(this.game.physics.arcade.isPaused) {
				   var style = { font: "16px Helvetica", fill: "#FFFFFF", align: "right" };
			    	this.pause_text = this.game.add.text(280, 200, "PAUSED", style);
		} else {
					this.pause_text.text = "";
					this.pause_text = null;
		}
	},
    update: function() {
			this.game_timer += this.time.elapsed;
        // This function is called 60 times per second    
        // It contains the game's logic
        
        		this.speed_up -=this.speed_down;
        		this.speed_down = 0;
        		
        		this.powerup_speed = false;
        	
        if(this.gameover == false) {
         if (this.left.isDown) {
         	this.paddle.body.velocity.x = -400-this.speed_up;
       	} else if(this.right.isDown) { 
         	this.paddle.body.velocity.x = 400+this.speed_up;   
			} else if (this.up.isDown) {
				this.paddle.body.velocity.y = -400-this.speed_up;
			} else if (this.down.isDown) { 
				this.paddle.body.velocity.y = 400+this.speed_up;
			} else {
				this.paddle.body.velocity.y = 0;
				this.paddle.body.velocity.x = 0;
			}
			
			this.speed_down=0;

			
    		// Call the 'hit' function when the ball hits a brick
   			this.game.physics.arcade.collide(this.bullets, this.paddle, this.hit, this.processCallBack, this);
   			//console.dir(this.bricks.length);
       		this.game.physics.arcade.collide(this.obj_flip,this.bricks,this.hit2,this.processCallBack,this);    		    	
				if(this.setPowerUp == "speed") {	
					this.game.physics.arcade.collide(this.paddle,this.powerup,this.applyPowerUp_Speed,this.processCallBack,this);  
				} else if(this.setPowerUp == "slow") {
					this.game.physics.arcade.collide(this.paddle,this.powerup,this.applyPowerUp_Slow,this.processCallBack,this);  
				}
				if (this.powerup != null && this.powerup.position.y >= this.game.height-10) {
					this.powerup.destroy();
					this.powerup = null;
				}		    	
    		// Restart the game if the ball is below the paddle
    		//console.dir(this.bullets.length);
    		} //end gameover == false   	 	   	 
    	  for(x=0;x<this.bullets.length;x++) {
   	 	if(this.bullets[x] != null) { //put in checks because this is called over and over again	
   	 		if (this.bullets[x].y >= this.game.height-10) {

					if(this.bullets[x].paddle_hits > 0) {
						this.bullets_hit++;
					} else {
						this.bullets_missed++;
					}

   	 			this.bullets[x].destroy();
   	 			this.bullets[x]=null;
   	 			
   	 			
       		
       			this.bullet_count--;
       			if(this.bullet_count <=0) {
       				this.bullet_count = 0;
       			}
				//perform some sort of test and then recreate some bullets
       		}
       	}
      }
      
      
      if( (this.bullet_count == 0) ) {
            this.bullet_waves++;
      		this.bullets=[];
      		this.obj_flip=[];
      		//do a gameover test here

				if(this.gameover == false && (this.bullet_waves % 10) == 0) {
      			this.rank_text.text = "Power: "+Math.floor((this.bullets_hit/this.bullets_missed)*100);
      		}      		
      		var MIN_POWER = 30 + (this.level-1)*3;
      		if(MIN_POWER >= 80) {
      			MIN_POWER = 80;
      		}
      		if(this.bullets_total > 30 && (this.bullets_hit/this.bullets_missed)*100 <= MIN_POWER) {      			
      			this.gameover = true;
      			var style = { font: "16px Helvetica", fill: "#FFFFFF", align: "right" };
      			this.gameover_text = this.game.add.text(280, 200, "GAME OVER", style);
      		}
      		this.spawnBullet();	
      		this.game_timer=0;
      		
		}
    },
     spawnBullet: function() {
     		var MAX_BULLETS = 5+(this.level-1);
     		if(MAX_BULLETS >=20) {
     			MAX_BULLETS = 20;
     		}
     		var RANDOM_BULLETS = Math.floor(randomWithRange(1,MAX_BULLETS));
     		this.bullets_total +=RANDOM_BULLETS;
     		for(var x=0;x<RANDOM_BULLETS;x++) {
     			var xpos = 0;
     			var roll = Math.floor(randomWithRange(1,20));
			   /*  			
     			if(roll == 10 || roll == 15) { //the death bullet
     				this.bullets[x] = this.game.add.sprite(x*Math.floor(Math.random()*200),0,'bullet_r');  
     				this.bullets[x].body.velocity.x = randomWithRange((200+(this.level-1),300+(this.level-1));
    				this.bullets[x].body.velocity.y = randomWithRange(200+(this.level-1),300+(this.level-1));
    				this.bullets[x].body.collideWorldBounds = false;
    				
     			}
     			*/
     			
     			 if(roll == 5) { //the speed bullet
    				this.bullets[x] = this.game.add.sprite(x*Math.floor(Math.random()*200),0,'bullet_g');  
    				this.bullets[x].body.velocity.x = 400+(this.level-1);
    				this.bullets[x].body.velocity.y = 400+(this.level-1);
    				this.bullets[x].body.collideWorldBounds = true;
				} else {
						var roll2 = Math.floor(randomWithRange(1,3));
						if(roll2 == 2) {
							xpos = x*Math.floor(Math.random()*200);
						}
						var MIN_VELOCITY = 200+(this.level-1)*2;
						var MAX_VELOCITY = 300+(this.level-1)*2;
					   this.bullets[x] = this.game.add.sprite(xpos,0,'bullet_y');  
					   this.bullets[x].body.velocity.x = randomWithRange(MIN_VELOCITY,MAX_VELOCITY);
    					this.bullets[x].body.velocity.y = randomWithRange(MIN_VELOCITY,MAX_VELOCITY);
    					this.bullets[x].body.collideWorldBounds = true;
				}
    			// Give the ball some initial speed
    			

    			// Make sure the ball will bounce when hitting something
    			this.bullets[x].body.bounce.setTo(1); 
    			this.bullets[x].body.collideWorldBounds = true;
    			this.bullets[x].paddle_hits=0;
    			this.bullets[x].bricks_bashed=0;
    			this.bullets[x].outOfBoundsKill = true;
    		}
     		this.bullet_count=RANDOM_BULLETS;
     		this.BULLET_MAX=RANDOM_BULLETS;
     },
     spawnBricks: function(brick_config) {
     		this.bricks=[];
     		var random_bricks_rows = Math.floor(randomWithRange(1,5)); //decide how many rows of random bricks to show
     		var array_counter=0;
     		this.brick_count = 0;		
     		for(var y=0;y<random_bricks_rows;y++) {
	     		var random_bricks = Math.floor(randomWithRange(4,9));
	     		this.brick_count += random_bricks;
	     		var farthestLeft_COORD = this.game.width/2;
     			var farthestRight_COORD = this.game.width/2;
     			for(var x = 0;x<random_bricks;x++) {
     				//expand the bricks out from the center	
     				if(x==0) {
     					 this.bricks[array_counter] = this.game.add.sprite(farthestLeft_COORD,y*BRICK_DIM3,'brick'); 
     				} else if(x%2 == 0) { //add to the right
     					    this.bricks[array_counter] = this.game.add.sprite(farthestLeft_COORD-BRICK_DIM2,y*BRICK_DIM3,'brick'); 
     					    farthestLeft_COORD -= BRICK_DIM2;
     				} else { //add to the left
     						 this.bricks[array_counter] = this.game.add.sprite(farthestRight_COORD+BRICK_DIM2,y*BRICK_DIM3,'brick');
     						 farthestRight_COORD += BRICK_DIM2; 
     				}

    				this.bricks[array_counter].body.immovable = true; 
    				this.bricks[array_counter].body.bounce.setTo(1);
    				array_counter++;
    			} 
     		}
     		
     		/*
     		//need some code to create set configurations of bricks
     		var x=0;
     		
     		// brick_coords=[x,y,brick_color,hit_counter]
     		if(brick_config==null || brick_config == 0) {
     			var brick_coords=brick_coords_array[0];
     		} else {
     			var brick_coords = brick_coords_array[1];
     		}
     		this.brick_count = brick_coords.length;
     		
     		for(var y=0;y<brick_coords.length;y++) {
     			this.bricks[y] =  this.game.add.sprite((brick_coords[y][0]*BRICK_DIM1)+BRICK_DIM2,brick_coords[y][1]*BRICK_DIM3,'brick');
     			this.bricks[y].body.immovable = true; 
    			this.bricks[y].body.bounce.setTo(1);
    			this.bricks[y].hit_counter=brick_coords[y][3]; 
     		}
     		*/
     		
     },
     hit: function(obj1,obj2) { //obj1 bullet, obj2 paddle
     
     	 if(true) {
    			this.obj_flip.push(obj1);  // (obj1 is the bullet, obj2 is the paddle) do this because collision detection can only be reconfigured in the update function     		
				//console.dir(this.obj_flip);			
				obj1.paddle_hits++;  
				
				if(obj1.key=='bullet_y') {
					var multiplier=(3*obj1.paddle_hits)+(9*obj1.bricks_bashed);
				} else if(obj1.key=='bullet_g') {
					var multiplier=6*((3*obj1.paddle_hits)+(9*obj1.bricks_bashed));
				} 
				this.multiplier_text.text="Multiplier: "+multiplier;    
			}		
    				    	
     },
     hit2: function(obj1,obj2) { //obj2 is the brick, obj1 is the bullet     	
		var hc = obj2.hit_counter;
 	
 		//after brick is hit run a powerup check here
     	this.spawnPowerUp(obj2.position.x,obj2.position.y,1);     			
		
		obj2.destroy();
     	obj2=null;
     	if(hc!=0) {
     		
     	}
     	this.brick_count--;
     	
     	if(this.game_score==0){ 
     		this.game_score++;
     	}
     	obj1.paddle_hits++;
     	obj1.bricks_bashed++;
		
		if(obj1.key == 'bullet_y') {
			var multiplier= (3*obj1.paddle_hits)+(9*obj1.bricks_bashed);
		} else if(obj1.key == 'bullet_g') {
				var multiplier= 6*((3*obj1.paddle_hits)+(9*obj1.bricks_bashed));
		}   
     	this.game_score=this.game_score+(3*obj1.paddle_hits)+(9*obj1.bricks_bashed);
     	
     	if(multiplier > 100) {
     		//do the shuffle animation here
     	} else if(multiplier > 50) {
     		//do some crazy shit here
     	} else if(multiplier > 20) {
     		//play some sounds here
     		//even more crazy shit
     	}
     	
     	this.score_text.text = "Score: "+this.game_score;
     	this.multiplier_text.text = "Multiplier: "+multiplier;
		
		
		var LEVEL_COMPLETE_SCORE = this.level * 300 + (this.level-1)*200;	
		if(this.game_score >= LEVEL_COMPLETE_SCORE) { //levelup
			this.levelup(this.level);
		}     	
     	
		//alert(this.brick_count);     	
     	if(this.brick_count == 0) {
     		//play shuffle bricks animation
     		
     			this.spawnBricks();
     		 
     		//Either end the level or shuffle the bricks
     	}
     },
		
		levelup: function(lvl) {
			
			for(var x=0;x<this.bricks.length;x++) {
				this.bricks[x].destroy();
			}		  
			this.spawnBricks();
		  
		   var MAX_BACKGROUNDS = 9;
		 	if(lvl+1 <= MAX_BACKGROUNDS) {
		  
		   this.game.add.tween(this.bimgs[lvl]).to({alpha: 0}, 1500, Phaser.Easing.Linear.None, true);
			//this.bimg1.destroy();
			this.bimgs[lvl+1].visible=true;
			this.bimgs[lvl+1].anchor.set(0.5);
			}
			 lvl++;
		    this.level_text.text = "Level: "+lvl;
		    this.level++;
			//parse new level data
			//change background animation and game variables
		},     
		
		spawnPowerUp: function(posX,posY,xvar) { //xvar is random variable which gives extra info i.e. level,brick color, score,e.tc.
				var roll = Math.floor(randomWithRange(1,15));
				if(this.powerup == null) {				
					if(roll == 1) {
			   		this.powerup = this.game.add.sprite(posX, posY, 'powerup_rocket');
    					this.powerup.body.velocity.y = 200;
    					this.setPowerUp = "speed";
    				} else if (roll == 2) {
    					 this.powerup = this.game.add.sprite(posX, posY, 'powerup_slow');
    					 this.powerup.body.velocity.y = 200;
    					 this.setPowerUp = "slow";
    				}
    			}
		},
		applyPowerUp_Speed: function() {
			if(this.powerup != null) {
				this.powerup.destroy();
				this.powerup=null;
			}
			if(this.speed_up <= 500) {
        		this.speed_up += Math.floor(randomWithRange(10,40));
        	}
		},   
		applyPowerUp_Shield: function() {
			if(this.powerup != null) {
				this.powerup.destroy();
				this.powerup=null;
			}
			if(this.shields <= 100) {
        		this.shields += Math.floor(randomWithRange(10,40));
        	}
		},   
		applyPowerUp_Slow: function() {
			if(this.powerup != null) {
				this.powerup.destroy();
				this.powerup=null;
			}
			if(this.speed_up >= 150) {
        		this.speed_up -= Math.floor(randomWithRange(10,40));
        	}
		},   
     processCallBack: function() {
     		return true;
     }
    }
   
     
