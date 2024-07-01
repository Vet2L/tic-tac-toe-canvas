import Drawable from "../renderer/Drawable";
import TextDrawable from "../renderer/TextDrawable";
import { State } from "../utils/FieldUtils";
import ElementO from "./ElementO";
import ElementX from "./ElementX";

/**
 * Draw player information about side
 */
class Info extends Drawable {
    /**
     * Create player information
     *
     * @param {string} text - text to show
     * @param {State} type - element type
     * @param {Drawable} [parent] - parent container
     */
    constructor(text: string, type: State, parent?: Drawable){
        super(parent);

        const textElement = new TextDrawable(text, { color: '#000', size: 40, family: 'arial' }, this);
        textElement.position.set(70, 10);
        const element = type === State.X ? new ElementX(200, 'red', 4, this) : new ElementO(100, 'blue', 4, this);
        element.position.set(100, 160);
    }

    /**
     * Ticker function for animation
     */
    tick = (delta: number) => {
        this.children.forEach( c => c.tick?.(delta) );
    }
}

export default Info;
