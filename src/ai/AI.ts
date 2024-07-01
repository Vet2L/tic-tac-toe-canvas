import { Line, State } from "../utils/FieldUtils";

type PlayLine = {
    line: Line;
    coord: number;
};

class AI {
    type: State;
    enemy: State;
    
    /** Create AI
     *
     * @param {State} type - AI type
     */
    constructor(type: State) {
        this.type = type;

        this.enemy = type === State.X ? State.O : State.X;
    }

    /**
     * Find coordinates for play
     *
     * @param {State[][]} field - game field
     *
     * @returns {{x: number, y: number}} - coordinates to use
     */
    getCoordinates(field: State[][]): {x: number, y: number} {
        const victory = this.findVictory(field);
        if (victory) {
            console.log("AI: Victory: ", victory);
            return this.lineToCoord(field, victory);
        }

        const danger = this.findDanger(field);
        if (danger) {
            console.log("AI: Danger: ", danger);
            return this.lineToCoord(field, danger);
        }

        const random = this.findRandom(field);
        if (random) {
            console.log("AI: Random: ", random);
            return this.lineToCoord(field, random);
        }
        return {x: -1, y: -1};
    }

    /** 
     * Get coords from line
     *
     * @param {State[][]} field - game field
     * @param {PlayLine} line - line to use
     *
     * @returns {x: number, y: number} - coords from line
     */
    lineToCoord(field: State[][], line: PlayLine): {x: number, y: number} {
        let x = -1;
        let y = -1;
        const i = this.findEmpty(this.lineToArray(field, line));
        switch (line.line) {
            case Line.Horizontal:
                x = i;
                y = line.coord;
                break;
            case Line.Vertical:
                x = line.coord;
                y = i;
                break;
            case Line.DiagonalLTRB:
                x = i;
                y = i;
                break;
            case Line.DiagonalLBRT:
                x = field[0].length - (i+1);
                y = i;
            default:
                break;
        }            
        return {x, y};
    }

    /**
     * Find victory line
     *
     * @param {State[][]} field - game field
     *
     * @return {PlayLine | undefined} - is there any victory lines
     */
    findVictory(field: State[][]): PlayLine | undefined {
        for (let i = 0; i < field.length; ++i) {
            const hline: PlayLine = { line: Line.Horizontal, coord: i};
            const harray = this.lineToArray(field, hline);
            if (this.isVictory(harray)) { return hline; }

            const vline: PlayLine = { line: Line.Vertical, coord: i};
            const varray = this.lineToArray(field, vline);
            if (this.isVictory(varray)) { return vline; }
        }

        const d1line: PlayLine = { line: Line.DiagonalLTRB, coord: 0};
        const d1array = this.lineToArray(field, d1line);
        if (this.isVictory(d1array)) { return d1line; }

        const d2line: PlayLine = { line: Line.DiagonalLBRT, coord: 0};
        const d2array = this.lineToArray(field, d2line);
        if (this.isVictory(d2array)) { return d2line; }

        return undefined;
    }

    /**
     * Find danger line
     *
     * @param {State[][]} field - game field
     *
     * @returns {PlayLine | undefined} - is there any danger line
     */
    findDanger(field: State[][]): PlayLine | undefined {
        for (let i = 0; i < field.length; ++i) {
            const hline: PlayLine = { line: Line.Horizontal, coord: i};
            const harray = this.lineToArray(field, hline);
            if (this.isDanger(harray)) { return hline; }

            const vline: PlayLine = { line: Line.Vertical, coord: i};
            const varray = this.lineToArray(field, vline);
            if (this.isDanger(varray)) { return vline; }
        }

        const d1line: PlayLine = { line: Line.DiagonalLTRB, coord: 0};
        const d1array = this.lineToArray(field, d1line);
        if (this.isDanger(d1array)) { return d1line; }

        const d2line: PlayLine = { line: Line.DiagonalLBRT, coord: 0};
        const d2array = this.lineToArray(field, d2line);
        if (this.isDanger(d2array)) { return d2line; }

        return undefined;
    }

    /**
     * Find random line that can be used
     *
     * @param {State[][]} field - game field
     *
     * @returns {PlayLine | undefined} - line to use or undefined if there are no such lines
     */
    findRandom(field: State[][]): PlayLine | undefined {
        const lines: PlayLine[] = [];
        for (let i = 0; i < field.length; ++i) {
            const hline: PlayLine = { line: Line.Horizontal, coord: i};
            const harray = this.lineToArray(field, hline);
            if (this.findEmpty(harray) !== -1) { lines.push(hline); }

            const vline: PlayLine = { line: Line.Vertical, coord: i};
            const varray = this.lineToArray(field, vline);
            if (this.findEmpty(varray) !== -1) { lines.push(vline); }
        }

        const d1line: PlayLine = { line: Line.DiagonalLTRB, coord: 0};
        const d1array = this.lineToArray(field, d1line);
        if (this.findEmpty(d1array) !== -1) { lines.push(d1line); }

        const d2line: PlayLine = { line: Line.DiagonalLBRT, coord: 0};
        const d2array = this.lineToArray(field, d2line);
        if (this.findEmpty(d2array) !== -1) { lines.push(d2line); }

        return lines[Math.floor(Math.random() * lines.length)];
    }

    /**
     * Find position of empty space in line.
     *
     * @param {State[]} line - line states
     *
     * @return {number} - random coordinate in line
     */
    findEmpty(line: State[]): number {
        const coords: number[] = [];
        for (let i = 0; i < line.length; ++i) {
            if (line[i] === State.Empty) { coords.push(i); }
        }

        if (coords.length === 0) {
            return -1;
            // console.warn("AI: Can't find empty in line");
        }

        const index = Math.floor(Math.random() * coords.length);

        return coords[index];
    }

    /**
     * Read line in field and return values
     *
     * @param {State[][]} field - game field
     * @param {PlayLine} line - line to read
     *
     * @returns {State[]} - line values
     */
    lineToArray(field: State[][], line: PlayLine): State[] {
        if (line.line === Line.Horizontal) {
            return field[line.coord];
        }
        const a: State[] = [];
        if (line.line === Line.Vertical) {
            for (let i = 0; i < field.length; ++i) {
                a.push(field[i][line.coord]);
            }
        }
        if (line.line === Line.DiagonalLTRB) {
            for (let i = 0; i < field.length; ++i) {
                a.push(field[i][i]);
            }
        }
        if (line.line === Line.DiagonalLBRT) {
            for (let i = 0; i < field.length; ++i) {
                a.push(field[i][field[i].length - (i + 1)]);
            }
        }
        return a;
    }
    
    /**
     * Check if array contains victory
     *
     * @param {State[]} line - Array from line
     *
     * @returns {boolean} - victory?
     */
    isVictory(line: State[]): boolean {
        let count = 0;
        let empty = 0;
        for (let i = 0; i < line.length; ++i) {
            if (line[i] === this.type) { count++; }
            if (line[i] === State.Empty) { empty++; }
        }
        return count > 1 && empty > 0;
    }

    /**
     * Check if array contains danger
     *
     * @param {State[]} line - Array from line
     *
     * @return {boolean} - danger?
     */
    isDanger(line: State[]): boolean {
        let count = 0;
        let empty = 0;
        for (let i = 0; i < line.length; ++i) {
            if (line[i] === this.enemy) { count++; }
            if (line[i] === State.Empty) { empty++; }
        }
        return count > 1 && empty > 0;
    }

}

export default AI;
