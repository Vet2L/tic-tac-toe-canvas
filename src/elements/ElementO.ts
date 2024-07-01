import Drawable from "../renderer/Drawable";

/**
 * Drawable element that represent O in tik-tak-toe field.
 * Contains animation.
 */
class ElementO extends Drawable {
    /** Time of show animation */
    static animationTime: number = 350;
    /** Easing function to apply on animation */
    static easing?: (a: number) => number;
    /** Start angle to draw circle */
    static startAngle: number = Math.PI * -0.5;

    /** Is element animated */
    animated: boolean = true;
    /** Current animation time in MS */
    time: number = 0;

    /** Radius of element */
    radius: number; 
    /** Line Width */
    stroke: number = 3;
    /** Line color */
    color: string = 'blue';
    
    /**
     * Create new O element
     *
     * @param {number} radius - radius of circle
     * @param {string} [color='blue'] - color of circle
     * @param {number} [stroke=3] - line width of circle
     * @param {Drawable} [parent] - parent of this drawable
     */
    constructor(radius: number, color?: string, stroke?: number, parent?: Drawable){
        super(parent);

        this.radius = radius;

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
        this.animated = this.time <= ElementO.animationTime;
        if (!this.animated) {
            this.onAnimationEnd?.();
        }
    };

    render(context: CanvasRenderingContext2D): void {
        this.prerender(context);

        context.beginPath();
        if (this.animated) {
            const progress = ElementO.easing?.(this.time / ElementO.animationTime) ?? this.time / ElementO.animationTime;
            context.arc(0, 0, this.radius, ElementO.startAngle, ElementO.startAngle + Math.PI * 2 * progress);
        } else {
            context.arc(0, 0, this.radius, 0, Math.PI * 2);
        }
        context.lineWidth = this.stroke;
        context.strokeStyle = this.color;
        context.stroke();
        context.closePath();

        this.postrender(context);
    }
}

export default ElementO;
