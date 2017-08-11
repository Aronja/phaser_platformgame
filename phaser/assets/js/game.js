/* global Phaser */

  var game = new Phaser.Game(800, 600, Phaser.AUTO, '', {
    preload: preload,
    create: create,
    update: update,
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
  var baddies = [];
  var statusText;
  var diamond;
  var ledge;
  var heart;
  var lifesText;
  var linkText;
  var hearts;

  const WINNING_SCORE = 120;

  function createObject(stars, numberOfStars, spriteString, distance, scale) {
    for (var i = 0; i < numberOfStars; i++) {
      star = stars.create(i * distance, 0, spriteString);
      star.body.gravity.y = Math.random() * 100;
      star.scale.setTo(scale, scale);
      star.body.bounce.y = 0.7 + Math.random() * 0.2;
    }
  }

  function create() {
    game.add.text(380, 20, statusText);

    game.physics.startSystem(Phaser.Physics.ARCADE);

    game.add.sprite(0, 0, 'sky');

    platforms = game.add.group();

    platforms.enableBody = true;

    var ground = platforms.create(0, game.world.height - 64, 'ground');

    ground.scale.setTo(2, 2);

    ground.body.immovable = true;

    ledge1 = platforms.create(400, 400, 'ground');
    ledge1.body.immovable = true;

    ledge2 = platforms.create(200, 200, 'ground');
    ledge2.body.immovable = true;

    ledge3 = platforms.create(-250, 300, "ground");
    ledge3.body.immovable = true;

    heart = game.add.sprite(700, 20, "heart");
    heart.scale.setTo(0.2, 0.2);
    game.add.text(720, 20, lifesText);

    player = game.add.sprite(32, game.world.height - 150, 'dude');
    player.health = 3;

    baddie = game.add.sprite(game.world.width - 64, game.world.height - 150, "baddie");
    baddie1 = game.add.sprite(ledge2.position.x, (ledge2.position.y - 32), "baddie");
    baddie2 = game.add.sprite(ledge1.position.x, (ledge1.position.y - 32), "baddie");

    baddies.push(baddie, baddie1, baddie2);


    baddies.forEach(function(b) {
      game.physics.arcade.enable(b);
      b.body.bounce.y = 0.2;
      b.body.gravity.y = 300;
      b.body.collideWorldBounds = true;
      b.animations.add('left', [0, 1], 10, true);
      b.animations.add('right', [2, 3], 10, true);
    });

    game.physics.arcade.enable(player);
    player.body.bounce.y = 0.2;
    player.body.gravity.y = 300;
    player.body.collideWorldBounds = true;
    player.body.maxVelocity.x = 150;
    player.animations.add('left', [0, 1, 2, 3], 10, true);
    player.animations.add('right', [5, 6, 7, 8], 10, true);

    cursors = game.input.keyboard.createCursorKeys();


    stars = game.add.group();
    stars.enableBody = true;
    createObject(stars, 12, "star", 70, 1);


    scoreText = game.add.text(16, 16, 'score: 0', {
      fontSize: '32px',
      fill: '#000'
    });

    lifesText = game.add.text(720, 25, player.health, {
      fontSize: '32px',
      fill: '#000'
    });

    var leftKey = game.input.keyboard.addKey(Phaser.Keyboard.LEFT);
    leftKey.onDown.add(randomBaddieMovement, this);

    var rightKey = game.input.keyboard.addKey(Phaser.Keyboard.RIGHT);
    rightKey.onDown.add(randomBaddieMovement, this);

    function randomBaddieMovement() {
      var baddieMovement;
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
      baddie.body.velocity.x = baddieMovement.velocity;
      baddie.animations.play(baddieMovement.animation);
    }
  }

  function update() {
    baddies.forEach(b => {
      game.physics.arcade.collide(b, platforms);
      game.physics.arcade.overlap(player, b, touchBaddie, null, this);
    });

    game.physics.arcade.collide(player, platforms);
    game.physics.arcade.collide(stars, platforms);
    game.physics.arcade.overlap(player, stars, collectStar, null, this);

    player.body.velocity.x = 0;

    if (cursors.left.isDown) {
      player.body.velocity.x = -150;
      player.animations.play('left');
    } else if (cursors.right.isDown) {
      player.body.velocity.x = 150;
      player.animations.play('right');
    } else {
      player.animations.stop();
      player.frame = 4;
    }

    if (cursors.up.isDown && player.body.touching.down) {
      player.body.velocity.y = -350;
    }

    function positionBaddie (l, b, v) {
      if (b.body.x <= l.position.x) {
        b.body.velocity.x = v;
        b.animations.play('right');
      } else if (b.body.x >= l.position.x + l.width - b.body.width) {
        b.body.velocity.x = -v;
        b.animations.play('left');
      }
    }

    positionBaddie(ledge2, baddie1, 100);
    positionBaddie(ledge1, baddie2, 80);

    function collectStar(player, star) {
      star.kill();
      score += 10;
      scoreText.text = 'Score: ' + score;

      if (score === WINNING_SCORE) {
        scoreText.text = "You won!"
        scoreText.text.align = "center"

        baddies.forEach(b => {
          b.kill();
        });

        createObject(stars, 12, "star", 70, 1);

        hearts = game.add.group();
        hearts.enableBody = true;
        createObject(hearts, 6, "heart", 140, 0.2);
      }
    }

    function touchBaddie(player) {
      if (!player.invincible && player.health > 0) {
        player.health -= 1;
        lifesText.setText(player.health)
        player.invincible = true;
        player.body.maxVelocity.x = 75;
        setTimeout(function() {
          player.invincible = false;
          player.body.maxVelocity.x = 150;
        }, 3000);
      }
    }

    if (player.health == 0) {
      player.kill();
      statusText = game.add.text(400, 16, 'Game over', {
        fontSize: '32px',
        fill: '#000'
      });
      statusText.anchor.x = Math.round(statusText.width * 0.5) / statusText.width;
    }
  }
