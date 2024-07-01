import Drawable from "../renderer/Drawable";

/**
 * Drawable element that represent X in tik-tak-toe field.
 * Contains animation.
 */
class ElementX extends Drawable {
    /** Time of show animation */
    static animationTime: number = 350;
    /** Easing function to apply on animation */
    static easing?: (a: number) => number;
    
    /** Is element animated */
    animated: boolean = true;
    /** Current animation time in MS */
    time: number = 0;

    /** Side of rectangle to draw X in */
    side: number;
    /** Line Width */
    stroke: number = 3;
    /** Line color */
    color: string = 'red';

    /**
     * Create new X element
     *
     * @param {number} side - rectangle side length to draw X in
     * @param {string} [color='blue'] - color of X
     * @param {number} [stroke=3] - line width of X
     * @param {Drawable} [parent] - parent of this drawable
     */
    constructor(side: number, color?: string, stroke?: number, parent?: Drawable){
        super(parent);

        this.side = side;

        if (stroke) { this.stroke = stroke; }
        if (color) { this.color = color; }
    }

    /**
     * Callback function for animation end
     */
    onAnimationEnd?: () => void;

    tick = (delta: number) => {
        if (!this.animated) { return; }

        this.time += delta;
        this.animated = this.time <= ElementX.animationTime;
        if (!this.animated) {
            this.onAnimationEnd?.();
        }
    };

    render(context: CanvasRenderingContext2D): void {
        this.prerender(context);

        context.beginPath();
        if (this.animated) {
            const progress = ElementX.easing?.(this.time / ElementX.animationTime) ?? this.time / ElementX.animationTime;
            if (progress <= 0.5) {
                context.moveTo(this.side * -0.5, this.side * -0.5);
                context.lineTo(this.side * (-0.5 + 2 * progress), this.side * (-0.5 + 2 * progress));
            } else {
                context.moveTo(this.side * -0.5, this.side * -0.5);
                context.lineTo(this.side * 0.5, this.side * 0.5);
                context.moveTo(this.side * 0.5, this.side * -0.5);
                context.lineTo(this.side * -(-1 + 2 * progress - 0.5), this.side * (-1 + 2 * progress - 0.5));
            }
        } else {
            context.moveTo(this.side * -0.5, this.side * -0.5);
            context.lineTo(this.side * 0.5, this.side * 0.5);
            context.moveTo(this.side * 0.5, this.side * -0.5);
            context.lineTo(this.side * -0.5, this.side * 0.5);
        }
        context.lineWidth = this.stroke;
        context.strokeStyle = this.color;
        context.stroke();
        context.closePath();

        this.postrender(context);
    }
}

export default ElementX;
