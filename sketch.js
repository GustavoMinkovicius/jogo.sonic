var JOGAR = 1;
var ENCERRAR = 0;
var estadoJogo = JOGAR;

var trex, trex_correndo, trex_colidiu;
var solo, soloinvisivel, imagemdosolo;

var nuvem, grupodenuvens, imagemdanuvem;
var grupodeobstaculos, obstaculo1;

var pontuacao;

var imgFimDeJogo,imgReiniciar
var somSalto , somCheckPoint, somMorte


function preload(){
  trex_correndo =loadAnimation("sonic (2).png", "sonic (3).png", "sonic (4).png", "sonic (5).png", "sonic (6).png","sonic (7).png", "sonic (8).png","sonic (9).png","sonic (10).png");
  trex_colidiu = loadAnimation("sonic (11).png");
  
  imagemdosolo = loadImage("ground2.png");
  
  imagemdanuvem = loadImage("cloud.png");
  
  obstaculo1 = loadImage("obstaculo.png");
    
  imgReiniciar = loadImage("restart.png")
  imgFimDeJogo = loadImage("gameOver.png")
  
  somSalto = loadSound("jump.mp3")
  somMorte = loadSound("die.mp3")
  somCheckPoint = loadSound("checkPoint.mp3")
}
function setup() {
  createCanvas(600, 200);
  
  trex = createSprite(50,180,20,50);
  trex.addAnimation("running", trex_correndo);
  trex.addAnimation("collided" , trex_colidiu)
  trex.scale = 0.5;
  
  solo = createSprite(200,180,400,20);
  solo.addImage("ground",imagemdosolo);
  solo.x = solo.width /2;
    
  fimDeJogo = createSprite(300,100);
  fimDeJogo.addImage(imgFimDeJogo);
  
  reiniciar = createSprite(300,140);
  reiniciar.addImage(imgReiniciar);
  
  fimDeJogo.scale = 0.5;
  reiniciar.scale = 0.5;
    
  soloinvisivel = createSprite(200,190,400,10);
  soloinvisivel.visible = false;
   
  //criar grupos de obstáculos e de nuvens
  grupodeobstaculos = createGroup();
  grupodenuvens = createGroup();
  
   
  trex.setCollider("circle",0,0,40);
  
  //hack imortal
  //trex.setCollider("rectangle",0,0,40,trex.width + 200,trex.height);
  //trex.debug = true;
  
  pontuacao = 0;
  
}
function draw() {
  
  background("white");
  //exibindo pontuação
  text("Pontuação: "+ pontuacao, 500,30);
    

  
  if(estadoJogo === JOGAR){
    fimDeJogo.visible = false
    reiniciar.visible = false
    //mover o solo
    solo.velocityX = -(4 + 3*pontuacao/100);
    //marcando pontuação
    pontuacao = pontuacao + Math.round(frameCount/60);
    
  
    if(pontuacao > 0 && pontuacao % 100 === 0){
      
      somCheckPoint.play();
    }
    
    if (solo.x < 0){
      
      solo.x = solo.width/2;
    }
    
    //saltar quando a tecla de espaço é pressionada
    if(keyDown("space")&& trex.y >= 165) {
       
      trex.velocityY = -13;
      somSalto.play();
  }
  
    //adicionar gravidade
    trex.velocityY = trex.velocityY + 0.8
   
    //gerar as nuvens
    gerarNuvens();
  
    //gerar obstáculos no solo
    gerarObstaculos();
    
    if(grupodeobstaculos.isTouching(trex)){
      
      //hack imortal
      //trex.velocityY = -12;
      //somSalto.play();
      
      estadoJogo = ENCERRAR;
      somMorte.play();
    }
  }
     else if (estadoJogo === ENCERRAR) {
  
      fimDeJogo.visible = true;
      reiniciar.visible = true;
     
      solo.velocityX = 0;
      trex.velocityY = 0
     
      //altera a animação do Trex
      trex.changeAnimation("collided", trex_colidiu);
     
      //define o tempo de vida dos objetos do jogo para que nunca sejam destruídos
    grupodeobstaculos.setLifetimeEach(-1);
    grupodenuvens.setLifetimeEach(-1);
     
     grupodeobstaculos.setVelocityXEach(0);
     grupodenuvens.setVelocityXEach(0);   
     }
  
  //evita que o Trex caia no solo
  trex.collide(soloinvisivel);

  if(mousePressedOver(reiniciar)){
    reset();
  }
  
  drawSprites();
}
function gerarObstaculos(){
 if (frameCount % 60 === 0){
   
    var obstaculo = createSprite(400,165,10,40);
    obstaculo.velocityX = -(6 + 3* pontuacao / 100);
      
    //gerar obstáculos aleatórios

   obstaculo.addImage(obstaculo1);
             
    
   
    //atribuir escala e tempo de duração ao obstáculo         
    obstaculo.scale = 0.2;
    obstaculo.lifetime = 300;
   
    //adicionar cada obstáculo ao grupo
    grupodeobstaculos.add(obstaculo);
 }
}
function gerarNuvens() {
  //escreva o código aqui para gerar as nuvens 
  if (frameCount % 60 === 0) {
    nuvem = createSprite(600,100,40,10);
    nuvem.y = Math.round(random(10,60));
    nuvem.addImage(imagemdanuvem);
    nuvem.scale = 0.5;
    nuvem.velocityX = -3;
    
     //atribuir tempo de duração à variável
    nuvem.lifetime = 200; 
    
    //ajustando a profundidade
    nuvem.depth = trex.depth;
    trex.depth = trex.depth + 1;
        
    //adiciondo nuvem ao grupo
   grupodenuvens.add(nuvem);
  }
}
function reset(){
  estadoJogo = JOGAR;
  reiniciar.visible = false;
  fimDeJogo.visible = false;
  pontuacao = 0;
  grupodeobstaculos.destroyEach();
  grupodenuvens.destroyEach();
  trex.changeAnimation("running", trex_correndo);
  frameCount = 0;
}
