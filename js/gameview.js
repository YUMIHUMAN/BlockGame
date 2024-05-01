`use strict`;
import { View } from "./view.js";
import { Ball } from "./ball.js";
import { Paddle } from "./paddle.js";
import { Block,HardBlock } from "./block.js";
import { Bar } from "./bar.js";
import { Sound } from "./sound.js";

export class GameView extends View{
    #ball = null;
    #paddle = null;
    #blocks = [];
    #bar = null;
    //パドルとボールが衝突したときの効果音
    #paddleBallSound
    //ブロックとボールが衝突したときの効果音
    #brockBallSound
    //ゲーム結果
    resultMessage = "";


    constructor(context){
        super(context);

        this.#ball = new Ball(context, 20, 440, 5, 2, 2);
        this.#paddle = new Paddle(context,30,460,40,4,5);
        this.#blocks = [
            new Block(context,10,40,52,20),
            new Block(context,72,40,52,20),
            new HardBlock(context,196,130,52,20),
            new HardBlock(context,258,130,52,20),
            new HardBlock(context,134,130,52,20),

        ];
        this.#bar = new Bar(context);

        this.#paddleBallSound = new Sound("../sounds/和太鼓でドドン.mp3");
        this.#brockBallSound = new Sound("../sounds/和太鼓でドン.mp3");
    }

    executePlayerAction(key){
        console.log(key);
        if(key["ArrowLeft"] || key["Left"]){
            //左キーを押したらパドルを左に移動する
            this.#paddle.dx = -this.#paddle.speed;
        }else if(key["ArrowRight"] || key["Right"]){
            //右キーを押したらパドルを右に移動する
            this.#paddle.dx = this.#paddle.speed;
    }else{
        //キーが押されていない場合はパドルを停止する
        this.#paddle.dx = 0;
    }
}

    //ゲームクリアかどうか検証する
    #isGameClear(){
        //ブロックがすべて非表示になっているか検証する
        const _isGameClear = this.#blocks.every((block) => block.status === false);
        //ゲーム結果を設定する
        if(_isGameClear){
            this.resultMessage = "ゲームクリア";
        }
        return _isGameClear;
    }

    
    //ゲームオーバーかどうか検証する
    #isGameOver(){
        const ballY = this.#ball.y;
        const ballRadius = this.#ball.radius
        const ballDy = this.#ball.dy

        //ボールが下の壁に衝突したか検証する
        const _isGameOver = this.context.canvas.height - ballRadius < ballY + ballDy;
        //ゲーム結果を設定する
        if(_isGameOver){
            this.resultMessage = "ゲームオーバー";
        }
        return _isGameOver;
    }

    #checkCollisionBallAndWall(){
        const canvasWidth = this.context.canvas.width;
        const canvasHeight = this.context.canvas.height;
        const ballX = this.#ball.x;
        const ballY = this.#ball.y;
        const ballRadius = this.#ball.radius;
        const ballDx = this.#ball.dx;
        const ballDy = this.#ball.dy;


        if(ballX + ballDx < ballRadius || canvasWidth - ballRadius < ballX + ballDx){
            this.#ball.dx *= -1;
            return;
        }

        //ボールが上の壁と接触したらy軸の移動速度を反転する
        if(ballY + ballDy < ballRadius +20){
            this.#ball.dy *= -1;
            return;
        }

        // //ボールが下の壁と衝突したらy軸の移動速度を反転する
        // if(canvasHeight - ballRadius < ballY + ballDy){
        //     this.#ball.dy *= -1;
        //     return;
        // }
    }



    //ボールとパドルの衝突を確認する
    #checkCollisionBallAndPaddle(){
        const ballX = this.#ball.x;
        const ballY = this.#ball.y;
        const ballRadius = this.#ball.radius;
        const ballDx = this.#ball.dx;
        const ballDy = this.#ball.dy;
        const paddleX = this.#paddle.x;
        const paddleY = this.#paddle.y;
        const paddleWidth = this.#paddle.width;
        const paddleHeight = this.#paddle.height;

        if(paddleX - ballRadius < ballX + ballDx &&
           ballX + ballDx < paddleX + paddleWidth + ballRadius &&
           paddleY - ballRadius < ballY + ballDy &&
           ballY + ballDy < paddleY + paddleHeight + ballRadius){
           this.#ball.dy *= -1;

           //パドルとボールが衝突したときの効果音を再生する
           this.#paddleBallSound.play();
        }

        
    }



    #checkCollisionPaddleAndWall(){
        const canvasWidth = this.context.canvas.width;
        const paddleX = this.#paddle.x;
        const paddleWidth = this.#paddle.width;
        const paddleDx = this.#paddle.dx;

        if(paddleX + paddleDx < 0){
            this.#paddle.dx = 0;
            this.#paddle.x = 0;
            return;
        }
        if(canvasWidth - paddleWidth < paddleX + paddleDx){
            this.#paddle.dx = 0;
            this.#paddle.x = canvasWidth - paddleWidth;
            return;
        }
    }

    //ボールとブロックの接触を確認する
    #checkCollisionBallAndBlock(){
        const ballX = this.#ball.x;
        const ballY = this.#ball.y;
        const ballRadius = this.#ball.radius;
        const ballDx = this.#ball.dx;
        const ballDy = this.#ball.dy;
        this.#blocks.forEach((block) =>{
            if(block.status === true){
                const blockX = block.x;
                const blockY = block.y;
                const blockWidth = block.width;
                const blockHeight = block.height;
                if(blockX - ballRadius < ballX + ballDx &&
                    ballX + ballDx < blockX + blockWidth + ballRadius &&
                    blockY - ballRadius < ballY + ballDy &&
                    ballY + ballDy < blockY + blockHeight + ballRadius ){
                        //ボールを反射する
                        this.#ball.dy *= -1;
                        if(block instanceof HardBlock){
                            //HPを減らす
                            block.hp--;
                            if(block.hp === 0){
                                //ブロックを非表示にする
                            block.status = false;
                            //スコアを加算する
                            this.#bar.addScore(block.getPoint());
                            }
                        }else{
                            //ブロックを非表示にする
                            block.status = false;
                            //スコアを加算する
                            this.#bar.addScore(block.getPoint());
                        }
                        // block.status = false
                        //スコアを加算する
                        // this.#bar.addScore(Block.POINT);
                        // this.#bar.addScore(block.getPoint());
                        //ブロックとボールが衝突したときの効果音を再生する
                        this.#brockBallSound.play();
                    }

            }
        })
    }

    //更新する
    update(){
        //ボールと壁の接触を確認する
        this.#checkCollisionBallAndWall();
        //ボールとパドルの接触を確認する
        this.#checkCollisionBallAndPaddle();

        

        this.#checkCollisionPaddleAndWall();

        this.#checkCollisionBallAndBlock();

        //ゲームオーバーまたはゲームクリアかどうか検証する
        if(this.#isGameOver() || this.#isGameClear()){
            //ゲーム画面を非表示にする
            this.isVisible = false;
        }

        //ボールを移動する
        this.#ball.move();
        //パドルを移動する
        this.#paddle.move();
    }

    //描画する
    draw(){
        //ボールを描画する
        this.#ball.draw();
        //ボールを描画する
        this.#paddle.draw();

        this.#blocks.forEach((block) => block.draw());
        //バーを描画する
        this.#bar.draw();
    }
}