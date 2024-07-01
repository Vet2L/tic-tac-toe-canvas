import Drawable from "./Drawable";

/**
 * Text style
 */
export type TextDrawableStyle = {
    /** Text color */
    color: string;
    /** Font Size */
    size: number;
    /** Font family */
    family: string;
};

/**
 * Drawable element that draws text
 */
class TextDrawable extends Drawable {

    /** Text to draw */
    text: string;
    /** Text style */
    style: TextDrawableStyle;

    /**
     * Create new text drawable
     *
     * @param {string} text - text to draw
     * @param {TextDrawableStyle} style - style to draw text with
     * @param {Drawable} [parent] - parent drawable
     */
    constructor(text: string, style: TextDrawableStyle, parent?: Drawable){
        super(parent);

        this.text = text;
        this.style = style;
    }

    render(context: CanvasRenderingContext2D){
        if (!this.visible) { return; }

        this.prerender(context);

        context.font = `${this.style.size}px ${this.style.family}`;
        context.fillStyle = this.style.color;

        context.fillText(this.text, 0, this.style.size);

        this.postrender(context);
    }
}

export default TextDrawable;
