  var game = new Phaser.Game(800, 600, Phaser.AUTO, '', {
    preload: preload,
    create: create,
    update: update
  });

  function preload() {

    game.load.image('sky', 'sky.png');
    game.load.image('ground', 'platform.png');
    game.load.image('star', 'star.png');
    game.load.image("diamond", "diamond.png");
    game.load.spritesheet('dude', 'dude.png', 32, 48);
    game.load.spritesheet('baddie', 'baddie.png', 32, 32);
    game.load.image("heart", "heart.png", 32, 32);


  }

  var player;
  var platforms;
  var cursors;
  var stars;
  var collectStar;
  var score = 0;
  var scoreText;
  var baddie;
  var statusText;
  var diamond;
  var ledge;
  var lifes = 2;
  var heart;
  var lifesText;

  function create() {

    game.add.text(380, 20, statusText);



    //  We're going to be using physics, so enable the Arcade Physics system
    game.physics.startSystem(Phaser.Physics.ARCADE);

    //  A simple background for our game
    game.add.sprite(0, 0, 'sky');

    //  The platforms group contains the ground and the 2 ledges we can jump on
    platforms = game.add.group();

    //  We will enable physics for any object that is created in this group
    platforms.enableBody = true;

    // Here we create the ground.
    var ground = platforms.create(0, game.world.height - 64, 'ground');

    //  Scale it to fit the width of the game (the original sprite is 400x32 in size)
    ground.scale.setTo(2, 2);

    //  This stops it from falling away when you jump on it
    ground.body.immovable = true;

    //  Now let's create two ledges
    ledge = platforms.create(400, 400, 'ground');
    ledge.body.immovable = true;

    ledge = platforms.create(200, 200, 'ground');
    ledge.body.immovable = true;

    ledge = platforms.create(-250, 300, "ground");
    ledge.body.immovable = true;

    heart = game.add.sprite(700, 20, "heart"); heart.scale.setTo(0.2,0.2);
    game.add.text(720, 20, lifesText);


    // The player and its settings
    player = game.add.sprite(32, game.world.height - 150, 'dude');

    baddie = game.add.sprite(game.world.width - 64, game.world.height - 150, "baddie");


    game.physics.arcade.enable(baddie);
    //  We need to enable physics on the player
    game.physics.arcade.enable(player);

    baddie.body.bounce.y = 0.2;
    baddie.body.gravity.y = 300;
    baddie.body.collideWorldBounds = true;

    baddie.animations.add('left', [0, 1], 10, true);
    baddie.animations.add('right', [2, 3], 10, true);


    //  Player physics properties. Give the little guy a slight bounce.
    player.body.bounce.y = 0.2;
    player.body.gravity.y = 300;
    player.body.collideWorldBounds = true;

    //  Our two animations, walking left and right.
    player.animations.add('left', [0, 1, 2, 3], 10, true);
    player.animations.add('right', [5, 6, 7, 8], 10, true);

    //  Our controls.
    cursors = game.input.keyboard.createCursorKeys();

    stars = game.add.group();

    stars.enableBody = true;

    for (var i = 0; i < 12; i++) {
      star = stars.create(i * 70, 0, "star");

      star.body.gravity.y = Math.random()*100;

      star.body.bounce.y = 0.7 + Math.random() * 0.2;


    }

    scoreText = game.add.text(16, 16, 'score: 0', {
      fontSize: '32px',
      fill: '#000'})

    lifesText = game.add.text(720, 25,lifes,  {
      fontSize: '32px',
      fill: '#000'})


        var leftKey = game.input.keyboard.addKey(Phaser.Keyboard.LEFT);
        leftKey.onDown.add(randomBaddieMovement, this);

        var rightKey = game.input.keyboard.addKey(Phaser.Keyboard.RIGHT);
        rightKey.onDown.add(randomBaddieMovement, this)



                var baddieMovement = {};



        // Will only be called once per key press.// Will be passed the full Key object. See Phaser.Key for properties.}

        function randomBaddieMovement() {
                  var x = Math.random(0, 1);
                  if (x > 0.5) {
                    baddieMovement = {
                      velocity: -150,
                      animation: "left"
                    }
                  } else {
                    baddieMovement = {
                      velocity: 150,
                      animation: "right"
                    }

                  }
                  console.log(baddieMovement.animation, x);
                  baddie.body.velocity.x = baddieMovement.velocity;
                  baddie.animations.play(baddieMovement.animation);

                }
  }



  function update() {

    game.physics.arcade.collide(baddie, platforms);

    game.physics.arcade.overlap(player, baddie, touchBaddie, null, this);

    //  Collide the player and the stars with the platforms
    game.physics.arcade.collide(player, platforms);

    game.physics.arcade.collide(stars, platforms);

    //  Checks to see if the player overlaps with any of the stars, if he does call the collectStar function
    game.physics.arcade.overlap(player, stars, collectStar, null, this);

    //  Reset the players velocity (movement)
    player.body.velocity.x = 0;








      if (cursors.left.isDown) {
        //  Move to the left
        player.body.velocity.x = -150;

        player.animations.play('left');

      } else if (cursors.right.isDown) {
        //  Move to the right
        player.body.velocity.x = 150;

        player.animations.play('right');
      } else {
        //  Stand still
        player.animations.stop();

        player.frame = 4;
      }

      //  Allow the player to jump if they are touching the ground.
      if (cursors.up.isDown) {
        player.body.velocity.y = -350;
      }

      function collectStar(player, star) {

        // Removes the star from the screen
        star.kill();

        score += 10;
        scoreText.text = 'Score: ' + score;



        if (score === 120) {
        		scoreText.text = "You won!"
        	}
        }





// onHit: function(damage) {    if (!player.invincible) {
//   game.time.events.add(2000, this.toggleInvincible, this);     }}toggleInvincible: function() {    player.invincible = !player.invincible;}

function create() {

    lifes = 2;

    text = game.add.text(715,25, lifes, {
        font: "65px Arial",
        fill: "#ff0044",
        align: "center"
    });

    text.anchor.setTo(0.5, 0.5);

}

function touchBaddie(player, baddie) {
  if (lifes >= 0) {lifes -= 1;
  lifesText = game.add.text(715,25,updateText, {
    fontSize: '32px',
    fill: '#000'
  })
}


}


function updateText() {

    lifes--;

    text.setText(lifes);

}


        console.log(lifes);

        if (lifes == 0) {
        player.kill();


        statusText = game.add.text(400, 16, 'Game over', {
          fontSize: '32px',
          fill: '#000'
        });
        statusText.anchor.x = Math.round(statusText.width * 0.5) / statusText.width;
        console.log(statusText.width);

      }
  }
