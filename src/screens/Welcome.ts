import Button from "../elements/Button";
import Rect from "../elements/Rect";
import Drawable from "../renderer/Drawable";
import TextDrawable from "../renderer/TextDrawable";

/** Welcome screen */
class Welcome extends Drawable {

    /** Current button that selected */
    selected: number = 0;
    buttons: Button[];

    /** Callback for play action */
    onPlay?: () => void;
    /** Callback for exit action */
    onExit?: () => void;

    constructor(parent?: Drawable){
        super(parent);

        const container = new Drawable(this);
        container.position.set(640, 360);
        const background = new Rect({width: 720, height: 360}, 'black', 5, container);
        background.pivot.set(360, 180);

        const ttt = new TextDrawable("TIC-TAC-TOE", {family: 'arial', size: 50, color: 'black'}, container);
        ttt.position.set(-150, -150);

        const playBtn = new Button("Play", container);
        playBtn.setWidth(170);
        playBtn.position.set(-120, 50);

        const exitBtn = new Button("Exit", container);
        exitBtn.setWidth(170);
        exitBtn.position.set(120, 50);

        this.buttons = [playBtn, exitBtn];
    }

    /** Select button */
    select(target: number){
        this.buttons[this.selected].unfocus();

        this.selected = Math.max(0, Math.min(target, this.buttons.length - 1));

        this.buttons[this.selected].focus();
    }

    /** When user press 'Enter' key */
    enter(){
        switch (this.selected){
            case 0: // Play
                this.onPlay?.();
                break;
            case 1: // Exit
                this.onExit?.();
                break;
            default:
                break;
        }
    }

    /** Call when showing screen */
    start(){
        this.select(0);
    }

    /** Call to destroy screen */
    destroy(){
        this.onExit = undefined;
        this.onPlay = undefined;
    }

    /** Event handler */
    onKeyEvent = (e: KeyboardEvent) => {
        switch (e.keyCode) {
            case 37: // Left
                this.select(this.selected - 1);
                break;
            case 39: // Right
                this.select(this.selected + 1);
                break;
            case 13: // Enter
                this.enter();
            default:
                break;
        }
    };
}

export default Welcome;
