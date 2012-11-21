/* -----

	game object
		
	------			*/

	/*************************/
	/*								 */
	/*		a player entity	 */
	/*								 */
	/*************************/
	var PlayerEntity = me.ObjectEntity.extend(
	{	
      
      /* -----

			constructor
			
		  ------			*/
		
		init:function (x, y, settings)
		{
			// call the constructor
			this.parent(x, y , settings);
			
			// set the walking & jumping speed
			this.setVelocity(3, 15);
         
         // adjust the bounding box
			this.updateColRect(8,48, -1,0);
			
			// set the display to follow our position on both axis
			me.game.viewport.follow(this.pos, me.game.viewport.AXIS.BOTH);
			
		},
	
		/* -----

			update the player pos
			
		  ------			*/
		update : function ()
		{
				
			if (me.input.isKeyPressed('left'))
			{
				this.doWalk(true);
			}
			else if (me.input.isKeyPressed('right'))
			{
				this.doWalk(false);
			}
			else
			{
				this.vel.x = 0;
			}
			if (me.input.isKeyPressed('jump'))
			{	
				if (this.doJump())
            {
               me.audio.play("jump");
            }
			}
			
			// check & update player movement
			updated = this.updateMovement();
         
         // check for collision
         res = me.game.collide(this);
         
         if (res)
         {
            if (res.type == me.game.ENEMY_OBJECT)
            {
               if ((res.y>0) && !this.jumping)
               {
                  // bounce
                   me.audio.play("stomp");
                  this.forceJump();
               }
               else
               {
                  // let's flicker in case we touched an enemy
                  this.flicker(45);
               }
            }
         }
         
					
			// update animation
			if (updated)
			{
				// update objet animation
				this.parent(this);
			}
			return updated;
		}

	});
    

    /*************************************/
    /*                                   */
    /*        an enemy Entity            */
    /*                                   */
    /*************************************/
    var EnemyEntity = me.ObjectEntity.extend(
    {    
        init: function (x, y, settings)
        {
            // define this here instead of tiled
            settings.image = "circle-dude";
            settings.spritewidth = 32;
            
            // call the parent constructor
            this.parent(x, y , settings);
            
            this.startX = x;
            this.endX   = x+settings.width - settings.spritewidth; // size of sprite
            
            
            // make him start from the right
            this.pos.x = x + settings.width - settings.spritewidth;
            this.walkLeft = true;

            // walking & jumping speed
            this.setVelocity(4, 6);
            
            // make it collidable
            this.collidable = true;
            // make it a enemy object
            this.type = me.game.ENEMY_OBJECT;
                      
        },
        
        // call by the engine when colliding with another object
        // obj parameter corresponds to the other object (typically the player)    touching this one 
        onCollision : function (res, obj)
        {
                
            // res.y >0 means touched by something on the bottom
            // which mean at top position for this one
            if (this.alive && (res.y > 0) && obj.falling)
            {
              this.flicker(45);              
            }
        },

        
        // manage the enemy movement
        update : function ()
        {
            // do nothing if not visible
            if (!this.visible && !this.flickering)
                return false;
                
            if (this.alive)
            {
                if (this.walkLeft && this.pos.x <= this.startX)
                {
                    this.walkLeft = false;
                }
                else if (!this.walkLeft && this.pos.x >= this.endX)
                {
                    this.walkLeft = true;
                }
                
                //console.log(this.walkLeft);
                this.doWalk(this.walkLeft);
            }
            else
            {
                this.vel.x = 0;
            }
            // check & update movement
            updated = this.updateMovement();
                
            if (updated)
            {
                // update the object animation
                this.parent();
            }
            return updated;
        }
    });
    
/*----------------
 a Princes entity
------------------------ */
var PrincessEntity = me.CollectableEntity.extend({
    // extending the init function is not mandatory
    // unless you need to add some extra initialization
    init: function(x, y, settings) {
        // call the parent constructor
        this.parent(x, y, settings);
    },

    // this function is called by the engine, when
    // an object is destroyed (here collected)
    onDestroyEvent: function() {
        // do something when collected
        me.levelDirector.nextLevel();
        }

});    
    
    
/*----------------------

    A title screen

  ----------------------*/

var TitleScreen = me.ScreenObject.extend(
{
    // constructor
    init : function()
    {
        this.parent(true);
        
        // title screen image
        this.title         = null;
        
        this.font          =  null;
        this.scrollerfont  =  null;
        this.scrollertween = null;
        
        this.scroller = "USE THE ARROW KEYS TO MOVE AND X KEY TO JUMP";
        this.scrollerpos = 600;
    },
    
    // reset function
    onResetEvent : function()
    {
        if (this.title == null)
        {
            // init stuff if not yet done
            this.title = me.loader.getImage("title_screen");
            // font to display the menu items
            //this.font = new me.BitmapFont("32x32_font", 32);
            //this.font.set("left");
            
            // set the scroller
            //this.scrollerfont = new me.BitmapFont("32x32_font", 32);
            //this.scrollerfont.set("left");
                        
        }
      
      // reset to default value
      this.scrollerpos = 640;
        
      // a tween to animate the arrow
      this.scrollertween = new me.Tween(this).to({scrollerpos: -2200 }, 10000).onComplete(this.scrollover.bind(this)).start();
        
      // enable the keyboard
      me.input.bindKey(me.input.KEY.ENTER,    "enter", true);
      
      // play something
      //me.audio.play("cling");
        
    },
    
    
    // some callback for the tween objects
    scrollover : function()
    {
        // reset to default value
        this.scrollerpos = 640;
        this.scrollertween.to({scrollerpos: -2200 }, 10000).onComplete(this.scrollover.bind(this)).start();
    },
        
    // update function
    update : function()
    {
        // enter pressed ?
        if (me.input.isKeyPressed('enter'))
        {
         me.state.change(me.state.PLAY);
        }
        return true;
    },

    
    // draw function
    draw : function(context)
    {
        context.drawImage(this.title, 0,0);
        
        //this.font.draw (context, "PRESS ENTER TO PLAY",     20, 240);
        //this.scrollerfont.draw(context, this.scroller, this.scrollerpos, 440);
    },
    
    // destroy function
    onDestroyEvent : function()
    {
        me.input.unbindKey(me.input.KEY.ENTER);
        
      //just in case
      this.scrollertween.stop();
   },

});    