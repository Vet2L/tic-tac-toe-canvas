import Drawable from "../renderer/Drawable";

class Field extends Drawable {
    width: number;
    height: number;
    side: number;

    lineWidth: number = 3;

    constructor(side: number = 200, width: number = 3, height: number = 3, parent?: Drawable){
        super(parent);

        this.side = side;
        this.width = width;
        this.height = height;
    }

    render(context: CanvasRenderingContext2D): void {
        this.prerender(context);

        context.beginPath();
        for (let i = 1; i < this.width; ++i) {
            context.moveTo(this.side * i, 0);
            context.lineTo(this.side * i, this.side * this.height);
        }
        for (let i = 1; i < this.height; ++i) {
            context.moveTo(0, this.side * i);
            context.lineTo(this.side * this.width, this.side * i);
        }
        context.stroke();
        context.closePath();

        this.postrender(context);
    }
}

export default Field;
