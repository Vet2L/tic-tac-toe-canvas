import Point2D from "./math/Point2D";

/** Base class for every element that will be drawed */
class Drawable {
    /** Position of element */
    position: Point2D;
    /** Position of rotation point */
    pivot: Point2D;
    /** Scale of element */
    scale: Point2D;
    /** Rotation of element */
    rotation: number = 0;
    /** Alpha of element */
    alpha: number = 1;
    /** Is element visible */
    visible: boolean = true;

    interactive: boolean = false;

    /** Parent drawable of this drawable */
    parent?: Drawable;
    /** Child elements of this drawable */
    children: Array<Drawable> = [];

    /**
     * Create new drawable element
     *
     * @param {Drawable} [parent] - parent of new drawable
     */
    constructor(parent?: Drawable) {
        this.position = new Point2D();
        this.pivot = new Point2D();
        this.scale = new Point2D(1, 1);

        if (parent) {
            parent.addChild(this);
        }
    }

    /**
     * Destroy drawable element
     */
    destroy(){}

    /** 
     * Add child element to this element
     *
     * @param {Drawable} child - child element to add
     */
    addChild(child: Drawable){
        if (child.parent) {
            child.parent.removeChild(child);
        }
        child.parent = this;

        this.children.push(child);
    }

    /**
     * Add child to this element at index
     *
     * @param {Drawable} child - child element to add
     * @param {number} index - index of child element
     */
    addChildAt(child: Drawable, index: number){
        if (child.parent) {
            child.parent.removeChild(child);
        }
        child.parent = this;

        this.children.splice(index, 0, child);
    }

    /** 
     * Remove child from this element
     *
     * @param {Drawable} child - child element to remove
     */
    removeChild(child: Drawable){
        const index = this.children.indexOf(child);

        if (index < 0) { return; }

        child.parent = undefined;
        this.children.splice(index, 1);
    }

    /**
     * Remove all children from this element
     */
    removeChildren(){
        this.children.forEach( c => c.parent = undefined);
        this.children = [];
    }

    /** Remember context alpha to restore after drawing */
    _alpha: number = 1;
    /**
     * Pre-render function that calls before drawing element
     * Basically translate position on context
     *
     * @param {CanvasRenderingContext2D} context - context to draw on
     */
    prerender(context: CanvasRenderingContext2D){
        context.save();
        context.translate(this.position.x, this.position.y);
        context.rotate(this.rotation);
        context.scale(this.scale.x, this.scale.y);
        context.translate(-this.pivot.x, -this.pivot.y);

        this._alpha = context.globalAlpha;
        context.globalAlpha = Math.min(Math.max(0, this._alpha * this.alpha), 1);
    }

    /**
     * Render function that calls to draw element and children.
     * Calls prerender and postrender functions
     *
     * @param {CanvasRenderingContext2D} context - context to draw on
     */
    render(context: CanvasRenderingContext2D){
        if (!this.visible) { return; }

        this.prerender(context);

        this.postrender(context);
    }

    /**
     * Post-render function that calls after drawing element
     * basically restore context after translates
     *
     * @param {CanvasRenderingContext2D} context - context to draw on
     */
    postrender(context: CanvasRenderingContext2D){
        this.children.forEach( c => c.render(context));

        context.restore();
        context.globalAlpha = this._alpha;
    }

    /**
     * Optional ticker function
     *
     * @param {number} delta - delta time in MS
     */
    tick?: (delta: number) => void;
}

export default Drawable;
