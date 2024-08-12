class Game {
	/**
	 * @param {number} game_number - The game number.
	 * @param {string} html - The html.
	 * @param {string} css - The css.
	 * @param {string} js - The js.
	 */
	constructor(game_number, html = "", css = "", js = "") {
		this.game_number = game_number;
		this.html = html;
		this.css = css;
		this.js = js;
	}
}

export default Game;
