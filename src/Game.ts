import App from "./renderer/App";
import Finish from "./screens/Finish";
import TicTacToe from "./screens/TicTacToe";
import Welcome from "./screens/Welcome";

const REDIRECT_URL = "https://www.example.com";

class Game {

    app: App;
    currentScreen?: Welcome | TicTacToe | Finish;
    onAd?: () => void;

    constructor(canvas: HTMLCanvasElement){
        this.app = new App(canvas);

        this.app.background = '#ddd';
    }

    prepare(){
        const welcome = new Welcome(this.app.scene);
        welcome.onPlay = this.toGame;
        welcome.onExit = this.toExit;
        welcome.start();

        this.currentScreen = welcome;

        this.subscribe();
    }

    toGame = () => {
        this.onAd?.();
        console.log("Start game");
        this.app.scene.removeChildren();
        this.currentScreen?.destroy();

        const gameplay = new TicTacToe(this.app.scene);
        gameplay.onWin = () => {this.toFinish(0)};
        gameplay.onLose = () => {this.toFinish(1)};
        gameplay.onDraw = () => {this.toFinish(2)};
        gameplay.start();

        this.currentScreen = gameplay;
    };

    toFinish = (result: number) => {
        this.currentScreen?.destroy();
        
        let text = "";
        switch (result) {
            case 0: text = "YOU WIN!"; break;
            case 1: text = "YOU LOSE!"; break;
            case 2: text = "DRAW"; break;
            default: break;
        }

        const finish = new Finish(text, this.app.scene);
        finish.onPlay = this.toGame;
        finish.onExit = this.toExit;
        finish.start();

        this.currentScreen = finish;
    };

    toExit = () => {
        this.currentScreen?.destroy();
        window.location.assign(REDIRECT_URL);
    };

    play(){
        this.app.scene.visible = true;
        this.app.rendering = true;
    }

    pause(){
        this.app.scene.visible = false;
        this.app.rendering = false;
    }
    
    /** Subscribe to key events */
    subscribe(){
        document.addEventListener("keydown", this.onKeyEvent);
    }

    /** Unsubscribe from key events */
    unsubscribe(){
        document.removeEventListener("keydown", this.onKeyEvent);
    }

    onKeyEvent = (e: KeyboardEvent) => {
        if (!this.app.rendering) { return; }

        this.currentScreen?.onKeyEvent(e);
    };
}

export default Game;
