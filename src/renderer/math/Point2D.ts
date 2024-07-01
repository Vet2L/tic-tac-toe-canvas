/** Simple 2D point class */
class Point2D {
    x: number;
    y: number;

    constructor(x: number = 0, y: number = 0){
        this.x = x;
        this.y = y;
    }

    set(x: number = 0, y: number = x){
        this.x = x;
        this.y = y;
    }
}

export default Point2D;
