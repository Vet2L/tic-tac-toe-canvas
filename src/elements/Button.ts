import Drawable from "../renderer/Drawable";
import TextDrawable from "../renderer/TextDrawable";
import Rect from "./Rect";

/** Class for button element */
class Button extends Drawable {

    /** Background element */
    background: Rect;
    /** Highlight element */
    highlight: Rect;
    /** Text of button */
    text: TextDrawable;

    /**
     * Create new button
     *
     * @param {string} text - text of button
     * @param {Drawable} [parent] - parent drawable
     */
    constructor(text: string, parent?: Drawable){
        super(parent);

        this.background = new Rect({width: 300, height: 50}, 'black', 5, this);
        this.background.pivot.set(150, 25);

        this.highlight = new Rect({width: 280, height: 40}, 'blue', 0, this);
        this.highlight.pivot.set(140, 20);
        this.highlight.visible = false;

        this.text = new TextDrawable(text, { family: 'arial', size: 30, color: 'black' }, this);
        this.text.pivot.set(100, 20);
    }

    /** Turn highlight on */
    focus(){
        this.highlight.visible = true;
    }

    /** Turn highlight off */
    unfocus(){
        this.highlight.visible = false;
    }

    /**
     * Change width of button
     *
     * @param {number} width - new width of button
     */
    setWidth(width: number){
        this.background.size.width = width;
        this.background.pivot.x = width / 2;

        this.highlight.size.width = width - 20;
        this.highlight.pivot.x = width / 2 - 10;

        this.text.pivot.x = width / 2 - 50;
    }
}

export default Button;
