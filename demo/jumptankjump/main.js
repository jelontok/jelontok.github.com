/*!
 * 
 *   melonJS
 *   http://www.melonjs.org
 *		
 *   Step by step game creation tutorial
 *
 **/

// game resources
var g_resources= [
    {name: "floor",  type:"image", src: "data/tiles/floor.png"},
    {name: "map-tiles",  type:"image", src: "data/tiles/map-tiles.png"},        
    {name: "map01",  type: "tmx",  src: "data/map01.tmx"},
    {name: "map02",  type: "tmx",  src: "data/map02.tmx"},
    {name: "map03",  type: "tmx",  src: "data/map03.tmx"},
    {name: "map04",  type: "tmx",  src: "data/map04.tmx"},
    {name: "map05",  type: "tmx",  src: "data/map05.tmx"},
    {name: "map06",  type: "tmx",  src: "data/map06.tmx"},
    {name: "map07",  type: "tmx",  src: "data/map07.tmx"},
    {name: "map08",  type: "tmx",  src: "data/map08.tmx"},
    {name: "map09",  type: "tmx",  src: "data/map09.tmx"},
    {name: "map10",  type: "tmx",  src: "data/map10.tmx"},
    
    {name: "tank",   type:"image", src: "data/sprite/tank.png"},
    {name: "princess",   type:"image", src: "data/sprite/tank-girl-sprite.png"},
    {name: "circle-dude",       type:"image",    src: "data/sprite/circle-dude.png"},
    
    // game font
    //{name: "32x32_font", type:"image", src: "data/sprite/32x32_font.png"},
    
    // title screen
    {name: "title_screen",  type:"image", src: "data/GUI/title_screen.jpg"},    
    
    // audio
    {name: "master", type: "audio",  src: "data/audio/",    channel : 1},
    {name: "jump",  type: "audio", src: "data/audio/",	channel : 1}
];


var jsApp	= 
{	
	/* ---
	
		Initialize the jsApp
		
		---			*/
	onload: function()
	{
		
      // init the video
		if (!me.video.init('jsapp', 640, 480, false, 1.0))
		{
			alert("Sorry but your browser does not support html 5 canvas.");
            return;
		}
				
		// initialize the "audio"
		me.audio.init("mp3,ogg");
		
		// set all resources to be loaded
		me.loader.onload = this.loaded.bind(this);
		
		// set all resources to be loaded
		me.loader.preload(g_resources);

		// load everything & display a loading screen
		me.state.change(me.state.LOADING);
	},
	
	
	/* ---
	
		callback when everything is loaded
		
		---										*/
	loaded: function ()
	{
        // set the "Play/Ingame" Screen Object
        me.state.set(me.state.MENU, new TitleScreen());
        
        // set the "Play/Ingame" Screen Object
        me.state.set(me.state.PLAY, new PlayScreen());
        
        // add our player entity in the entity pool
        me.entityPool.add("mainPlayer", PlayerEntity);
        me.entityPool.add("EnemyEntity", EnemyEntity);
        me.entityPool.add("PrincessEntity", PrincessEntity);
        
        // enable the keyboard
        me.input.bindKey(me.input.KEY.LEFT,     "left");
        me.input.bindKey(me.input.KEY.RIGHT,    "right");
        me.input.bindKey(me.input.KEY.Z,        "jump", true);
        
        // display the menu title 
        me.state.change(me.state.MENU);        
      
        // start the game 
        //me.state.change(me.state.PLAY);
	}

}; // jsApp

/* the in game stuff*/
var PlayScreen = me.ScreenObject.extend(
{

   onResetEvent: function()
	{	
      // stuff to reset on state change
      
        // load a level
        me.levelDirector.loadLevel("map01");
        
        // play the audio track
        me.audio.playTrack("master");
               
	},
	
	
	/* ---
	
		 action to perform when game is finished (state change)
		
		---	*/
	onDestroyEvent: function()
	{
	
   }

});


//bootstrap :)
window.onReady(function() 
{
	jsApp.onload();
});
