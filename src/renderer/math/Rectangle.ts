import Point2D from "./Point2D";

/** Simple rectangle class */
class Rectangle extends Point2D {
    width: number;
    height: number;

    constructor(x: number = 0, y: number = 0, width: number = 1, height: number = 1){
        super(x, y);

        this.width = width;
        this.height = height;
    }

    set(x: number = 0, y: number = x, width?: number, height?: number){
        super.set(x, y);

        this.width = width ?? this.width;
        this.height = height ?? this.height;
    }

    setSize(width: number = 1, height: number = width){
        this.width = width;
        this.height = height;
    }
}

export default Rectangle;
