/** Type of field cell */
export enum State { Empty, X, O };

/** Type of line */
export enum Line { Horizontal, Vertical, DiagonalLTRB, DiagonalLBRT };

/** Result of field check */
export type Result = {
    /** Is there a victory? */
    win: boolean;
    /** What cell type of winner? */
    value: State;
    /** Line type where victory */
    line: Line;
    /** Coordinate of line */
    coord: number;
    /** Is there a draw? */
    draw: boolean;
};

/**
 * Check field for victory or draw */
export function check(field: State[][]): Result {
    let win = false;
    let line = Line.Horizontal;
    let coord = 0;
    let draw = true;
    let value = State.Empty;
    // Check horizontal
    for (let i = 0; i < field.length; ++i) {
        const target = field[i][0];
        if (target === State.Empty) { 
            draw = false;
            continue; 
        }
        win = true;
        for (let j = 1; j < field[i].length; ++j) {
            win = target === field[i][j];
            draw = draw && (field[i][j] !== State.Empty);
            if (!win) { break; }
        }
        if (win) {
            line = Line.Horizontal;
            coord = i;
            draw = false;
            value = target;
            break;
        }
    }
    if (!win) { // Check vertical
        for (let i = 0; i < field[0].length; ++i) {
            const target = field[0][i];
            if (target === State.Empty) { 
                draw = false;
                continue; 
            }
            win = true;
            for (let j = 1; j < field.length; ++j) {
                win = target === field[j][i];
                draw = draw && (field[j][i] !== State.Empty);
                if (!win) { break; }
            }
            if (win) {
                line = Line.Vertical;
                coord = i;
                draw = false;
                value = target;
                break;
            }
        }
    }
    if (!win) { // Check diagonal lt -> rb
        const target = field[0][0];
        if (target !== State.Empty) {
            win = true;
            for (let i = 1; i < field.length; ++i) {
                win = target === field[i][i];
                draw = draw && (field[i][i] !== State.Empty);
                if (!win) { break; }
            } 
        } else {
            draw = false;
        }
        if (win) {
            line = Line.DiagonalLTRB;
            draw = false;
            value = target;
        }
    }
    if (!win) { // Check diagonal lb -> rt
        const target = field[0][field[0].length - 1];
        if (target !== State.Empty) {
            win = true;
            for (let i = 1; i < field.length; i++) {
                win = target === field[i][field[i].length - (i + 1)];
                draw = draw && (field[i][field[i].length - (i+1)] !== State.Empty);
                if (!win) { break; }
            }
        } else {
            draw = false;
        }
        if (win) {
            line = Line.DiagonalLBRT;
            draw = false;
            value = target;
        }
    }

    return {
        win, line, coord, draw, value
    };
}
