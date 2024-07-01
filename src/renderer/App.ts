import Drawable from "./Drawable";

class App {
    /**
     * Last current time
     */
    _time: number = -1;
    /**
     * Lifetime of application
     */
    time: number = 0;

    /**
     * Canvas element to use 
     */
    canvas: HTMLCanvasElement;
    context?: CanvasRenderingContext2D;

    /**
     * Size of canvas
     */
    width: number;
    height: number;

    background: string = 'white';
    /** 
     * Is application rendering
     */
    _rendering: boolean = false;

    /**
     * Base scene of application
     */
    scene: Drawable;

    constructor(canvas: HTMLCanvasElement) {
        this.canvas = canvas;
        this.context = this.canvas.getContext("2d", { alpha: false }) || undefined;

        this.width = this.canvas.width;
        this.height = this.canvas.height;

        this.scene = new Drawable();
    }

    /** Ticker function */
    tick(delta: number) {
        if (this.scene.tick) {
            this.scene.tick(delta);
        } else {
            this.scene.children.forEach( c => c.tick?.(delta) );
        }
    }

    /** Render function */
    render = () => {
        const context = this.context;
        if (!context) {
            console.warn("Can't get context to draw on");
            return;
        }

        context.fillStyle = this.background;
        context.fillRect(0, 0, this.width, this.height);
        // context.clearRect(0, 0, this.width, this.height);
        this.scene.render(context);

        if (this._time < 0) {
            this._time = window.performance.now();
        }
        const old = this._time;
        this._time = window.performance.now();
        const delta = this._time - old;
        this.time += delta;

        this.tick(delta);

        if (this._rendering) {
            requestAnimationFrame(this.render);
        } else {
            this._time = -1;
        }
    };

    get rendering(){
        return this._rendering;
    }

    set rendering(state: boolean){
        this._rendering = state;
        if (this._rendering) this.render();
    }
}

export default App;
