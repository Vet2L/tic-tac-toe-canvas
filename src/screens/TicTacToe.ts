import AI from "../ai/AI";
import ElementO from "../elements/ElementO";
import ElementX from "../elements/ElementX";
import Field from "../elements/Field";
import Info from "../elements/Info";
import Rect from "../elements/Rect";
import Drawable from "../renderer/Drawable";
import Point2D from "../renderer/math/Point2D";
import * as FieldUtils from "../utils/FieldUtils";

/** Tic Tac Toe game screen */
class TicTacToe extends Drawable {
    /** Game field */
    field: FieldUtils.State[][] = [[0, 0, 0], [0, 0, 0], [0, 0, 0]];
    /** Current position of cursor in field */
    cursor: Point2D;

    /** Game field drawable element */
    fieldElement: Field;
    /** Cursor drawable element */
    cursorElement: Rect;

    /** Player side */
    playerType: FieldUtils.State;
    /** AI side */
    aiType: FieldUtils.State;

    ai: AI;

    turn: FieldUtils.State = FieldUtils.State.X;
    
    /** Input locker */
    locked: boolean = false;

    onWin?: ()=>void;
    onLose?: ()=>void;
    onDraw?: ()=>void;

    constructor(parent?: Drawable){
        super(parent);

        this.cursor = new Point2D(1, 1);

        this.fieldElement = new Field(200, 3, 3, this);
        this.fieldElement.position.set(340, 60);

        this.cursorElement = new Rect({width: 190, height: 190}, '#666', 3, this.fieldElement);
        this.cursorElement.pivot.set(95, 95);

        const cx = 100 + this.cursor.x * 200;
        const cy = 100 + this.cursor.y * 200;
        this.cursorElement.position.set(cx, cy);

        const x = Math.random();
        this.playerType = x < 0.5 ? FieldUtils.State.X : FieldUtils.State.O;
        this.aiType = x < 0.5 ? FieldUtils.State.O : FieldUtils.State.X;

        this.ai = new AI(this.aiType);

        const playerInfo = new Info("YOU", this.playerType, this);
        playerInfo.position.set(70, 230);

        const aiInfo = new Info("AI", this.aiType, this);
        aiInfo.position.set(1010, 230);
    }

    /**
     * Move cursor by in field coordinates
     * 
     * @param {number} dx - direction by X
     * @param {number} dy - direction by Y
     */
    moveCursor(dx: number, dy: number) {
        this.cursor.x = Math.max(0, Math.min(this.cursor.x + dx, this.field[0].length - 1));
        this.cursor.y = Math.max(0, Math.min(this.cursor.y + dy, this.field.length - 1));

        const x = 100 + this.cursor.x * 200;
        const y = 100 + this.cursor.y * 200;

        this.cursorElement.position.set(x, y);
    }
    
    /**
     * Place new element to the field
     *
     * @param {number} x - X coordinate on field
     * @param {number} y - Y coordinate on field
     * @param {FieldUtils.State} type - type of element
     *
     * @returns {boolean} - is element placed
     */
    placeElement(x: number, y: number, type: FieldUtils.State): boolean {
        if (this.field[y][x] !== FieldUtils.State.Empty) {
            return false;
        }

        this.field[y][x] = type;
        const el = type === FieldUtils.State.X ? 
            new ElementX(180, 'red', 3, this.fieldElement) : 
            new ElementO(90, 'blue', 3, this.fieldElement);
        el.position.set(100 + x * 200, 100 + 200 * y);
        el.onAnimationEnd = this.onElementAnimEnd;

        this.lock(true);

        this.turn = this.turn === FieldUtils.State.X ? FieldUtils.State.O : FieldUtils.State.X;

        return true;
    }

    /**
     * Make AI to play
     */
    playAI(){
        if (this.aiType !== this.turn) {
            console.warn("AI can't play, players turn");
            return;
        }

        const coords = this.ai.getCoordinates(this.field);
        this.placeElement(coords.x, coords.y, this.aiType);
    }

    /** Lock input */
    lock(state: boolean){
        this.locked = state;

        this.cursorElement.visible = !this.locked;
    }

    /** Callback function for elements animation */
    onElementAnimEnd = () => {
        const result = FieldUtils.check(this.field);
        console.log(result);
        if (result.win) {
            this.drawWin(result);
        } else if (result.draw) {
            this.onDraw?.();
        } else {
            if (this.turn === this.playerType) {
                this.lock(false);
            } else {
                this.playAI();
            }
        }
    };

    /** Draws victory lines */
    drawWin(result: FieldUtils.Result) {
        const el = new ElementX(180, 'green', 9, this.fieldElement);
        switch (result.line) {
            case FieldUtils.Line.Horizontal: 
                el.scale.x = 3.3;
                el.scale.y = 0.5;
                el.position.x = this.field[0].length * 0.5 * 200;
                el.position.y = 100 + result.coord * 200;
                break;
            case FieldUtils.Line.Vertical: 
                el.scale.x = 0.5;
                el.scale.y = 3.3;
                el.position.x = 100 + result.coord * 200;
                el.position.y = this.field.length * 0.5 * 200;
                break;
            case FieldUtils.Line.DiagonalLTRB:
                el.scale.x = 4.0;
                el.scale.y = 0.5;
                el.position.x = this.field[0].length * 0.5 * 200;
                el.position.y = this.field.length * 0.5 * 200;
                el.rotation = Math.PI * 0.25;
                break;
            case FieldUtils.Line.DiagonalLBRT:
                el.scale.x = 4.0;
                el.scale.y = 0.5;
                el.position.x = this.field[0].length * 0.5 * 200;
                el.position.y = this.field.length * 0.5 * 200;
                el.rotation = Math.PI * -0.25;
                break;
            default:
                break;
        }

        el.onAnimationEnd = () => {
            if (result.value === this.playerType) { this.onWin?.(); }
            if (result.value === this.aiType) { this.onLose?.(); }
        };
    }

    /** On 'Enter' press */
    onEnter(){
        this.placeElement(this.cursor.x, this.cursor.y, this.playerType);
    }

    tick = (delta: number) => {
        this.fieldElement.children.forEach( c => c.tick?.(delta) );
        this.children.forEach( c => c.tick?.(delta) );
    };

    /** Call when showing screen */
    start(){
        if (this.aiType === this.turn) {
            this.playAI();
        }
    }

    /** Call to destroy screen*/
    destroy(): void {
        this.onDraw = undefined;
        this.onWin = undefined;
        this.onLose = undefined;
    }

    /** Key events handler */
    onKeyEvent = (e: KeyboardEvent) => {
        if (this.locked) { return; }

        switch (e.keyCode) {
            case 37: // Left
                this.moveCursor(-1, 0);
                break;
            case 38: // Up
                this.moveCursor(0, -1);
                break;
            case 39: // Right
                this.moveCursor(1, 0);
                break;
            case 40: // Down
                this.moveCursor(0, 1);
                break;
            case 13: // Enter
                this.onEnter();
                break;
            default: 
                break;
        }
    };

}

export default TicTacToe;
