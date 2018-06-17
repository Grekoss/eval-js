var app = {
  fruitsList : [],
  arrayTmp : [],
  nbClick : 0,
  goodPair : 0,
  seconds : 0,
  hard : false,
  scoreHard : 0,
  scoreNormal : 0,
  init : function () {
    app.goodPair=0;
    app.hard = false;
    $('#buttons').css('display', 'block');
    $('#easy').on('click',app.startGame);
    $('#hard').on('click',app.choiseHard);
  },
  choiseHard : function () {
    app.hard = true;
    app.startGame();
  },
  startGame : function () {
    //Assurance de l'arret du Timer
    app.stopTimer()
    //Effacer l'ancienne partie
    $('#Game').remove();
    //Cache la Div des boutons
    $('#buttons').css('display', 'none');
    //Récupération la liste avec key
    app.fruitsList = Object.keys(cards.fruits);
    app.createArrayTmp();
    //Création du tableau
    app.createTable();
    $('.cache').on('click', app.comparedCards);
    //Définir la diffilculté poour aider la création du timer
    app.nbSeconds = (app.hard ? 120 : 90);
    app.seconds = app.nbSeconds;
    app.updateTimer();
  },
  createArrayTmp : function () {
    if (app.hard) {
      //Ici on va créer un tableau temporaire comprenant deux tableaux à l'interieur.
      Array.prototype.push.apply(app.arrayTmp, app.fruitsList);
      Array.prototype.push.apply(app.arrayTmp, app.fruitsList);
    } else {
      //Level = easy
      app.fruitsList = app.fruitsList.slice(0,14);
      Array.prototype.push.apply(app.arrayTmp, app.fruitsList);
      Array.prototype.push.apply(app.arrayTmp, app.fruitsList);
    }
  },
  showCards : function () {
    //Affiche l'image
    app.cardSelect.nextSibling.style.display='block';
    app.cardSelect.style.display='none';
  },
  hideCards : function () {
    //cache les images
    app.cardSelectOne.nextSibling.style.display='none';
    app.cardSelectOne.style.display='block';
    app.cardSelectTwo.nextSibling.style.display='none';
    app.cardSelectTwo.style.display='block';
  },
  comparedCards : function () {
    //Compte le nbClick
    app.nbClick++;
    //Retourne les cartes vers images
    app.cardSelect = this;
    app.showCards();
    //On récupere la data de la carte
    var nameCard = this.nextSibling.getAttribute('data-fruits');
    //Affectation des valeurs des cartes dans les clicks
    if (app.nbClick ===1 ) {
      app.firstCard = nameCard;
      app.cardSelectOne = app.cardSelect;
    }
    if (app.nbClick === 2) {
      app.secondCard = nameCard;
      app.cardSelectTwo = app.cardSelect;
      $('.cache').off('click', app.comparedCards);
      if (app.secondCard !== app.firstCard) {
        //On a perdu la paire
        setTimeout(function() {
          //Retourne les cartes vers cache
          app.hideCards();
          $('.cache').on('click', app.comparedCards);
        },1000);
      } else {
        //On vient de trouver une paire
        $('.cache').on('click', app.comparedCards);
        app.goodPair++;
        if (app.fruitsList.length === app.goodPair) {
          window.alert('Vous avez gagnééééééééééé !!!');
          app.highscore();
          app.init();
        }
      }
      // Réinitialisation du click
      app.nbClick = 0;
    }
  },
  highscore : function () {
    //Enregistrement des meilleurs scores si c'est le cas!
    if (app.hard) {
      if (app.seconds>app.scoreHard) {
        app.scoreHard=app.seconds;
      }
    }
    else {
      if (app.seconds>app.scoreNormal) {
        app.scoreNormal=app.seconds;
      }
    }
    //Affichages des scores
    var normal = document.getElementById('scores-normal');
    normal.textContent = app.scoreNormal + ' sec.';
    var hard = document.getElementById('scores-hard');
    hard.textContent = app.scoreHard + ' sec.';
  },
  createTable : function () {
    //Creation de la table
    app.table = document.createElement('table');
    app.table.id = ('Game');
    for (var line =0; line < 4; line++) {
      //creation des lignes du tableau
      app.createLine( line );
    }
    var div = document.getElementById('board');
    div.appendChild (app.table);
  },
  createLine : function (lineIndex) {
    //Définir la diffilculté poour aider la création du tableau + révision de la ternaire
    var nbColumn = (app.hard ? 9 : 7);
    //Utilisation de boucle pour dessiner les lignes et colonnes du tableau
    var tr = document.createElement('tr');
    for (var column = 0; column < nbColumn; column++) {
      //Création du <td> et <div>
      var td = document.createElement('td');
      var divCache = document.createElement('div');
      var divImage = document.createElement('div');
      //Ajout des class et attribut
      td.className = 'card';
      divCache.className = 'cache';
      divImage.className = 'image';
      //Ajout des images
      app.selectRandomImage();
      divImage.style.backgroundImage = 'url("../images/cards.png")';
      divImage.style.backgroundPosition = cards.fruits[app.dataTmp];
      //gestion de data
      var data = document.createAttribute('data-fruits');
      data.value = app.dataTmp;
      divImage.setAttributeNode(data);
      //Style d'un <td>
      td.style.width = '100px';
      td.style.height = '100px';
      //Ajout des <div> dans le <td>
      td.appendChild( divCache );
      td.appendChild( divImage );
      //Ajout du <td> dans le <tr>
      tr.appendChild( td );
    }
    //Ajout du <tr> dans la <table>
    app.table.appendChild( tr );
  },
  selectRandomImage : function () {
    var randomIndex = Math.floor(Math.random() * app.arrayTmp.length);
    //Creation de la variable temporaire
    app.dataTmp = app.arrayTmp[randomIndex];
    //On efface une fois choisi l'index dans le tableau pour pas qu'il soit répété
    app.arrayTmp.splice(randomIndex, 1);
  },
  updateTimer : function () {
    //Décompte
    app.seconds--;
    //Calcul pour trouver la valeur écoulé en pourcentage
    var progressValue = ((app.nbSeconds-app.seconds)*100)/app.nbSeconds
    //On affiche le Timer:
    $('#progress').progressbar({
      value:progressValue
    });
    //Test pour savoir si le décompte tombe a zéro
    if (app.seconds <= 0 ) {
      window.alert('PERDU !!!!!!');
      app.init();
    }
    else {
      app.monTimer = setTimeout(app.updateTimer, 1000);
    }
  },
  stopTimer : function () {
    //Arret le timer
    clearTimeout( app.monTimer );
  },
};

document.addEventListener('DOMContentLoaded', app.init);

// TODO:
// Rajoutons un peu de réalisme avec une animation 3D sur les cartes qui se retournent.
