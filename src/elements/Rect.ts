import Drawable from "../renderer/Drawable";

/** Rectangle size */
type RectSize = {
    /** Width of rectangle */
    width: number;
    /** Height of rectangle */
    height: number;
}

/** Class to draw rectangle */
class Rect extends Drawable {

    /** Size of rectangle */
    size: RectSize;

    /** Color of rectangle */
    color: string = 'red';
    /** Line width of rectangle. If 0 then rectangle going to be filled with color */
    stroke: number = 0;

    /** 
     * Create new rectangle drawable element
     * 
     * @param {RectSize} size - dimensions of rectangle
     * @param {string} [color='red'] - color of rectangle
     * @param {number} [stroke=0] - line width of rectangle. if 0 then rectangle going to be filled with color
     * @param {Drawable} [parent] - parent of this drawable
     */
    constructor(size: RectSize, color?: string, stroke?: number, parent?: Drawable){
        super(parent);

        this.size = size;

        if (color) { this.color = color; }
        if (stroke) { this.stroke = stroke; }
    }

    render(context: CanvasRenderingContext2D){
        if (!this.visible) { return; }

        this.prerender(context);

        context.beginPath();
        context.rect(0, 0, this.size.width, this.size.height);
        context.lineWidth = this.stroke;
        context.strokeStyle = this.color;
        context.fillStyle = this.color;
        if (this.stroke) {
            context.stroke();
        } else {
            context.fill();
        }
        context.closePath();

        this.postrender(context);
    }
}

export default Rect;
