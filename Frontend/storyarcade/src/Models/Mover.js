class Mover {
    /**
     * @param {number} mover_number - The mover number.
     * @param {number} [wait_duration=0] - The wait duration.
     * @param {"click"|"auto"} [next_type="auto"] - The next type.
     */
    constructor(mover_number, wait_duration=0, next_type="auto") {
        this.mover_number = mover_number;
        this.wait_duration = wait_duration;
        this.next_type = next_type;
    }
}

export default Mover;
