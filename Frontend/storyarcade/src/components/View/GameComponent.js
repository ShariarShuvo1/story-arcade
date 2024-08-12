import React, { useEffect, useRef } from "react";

const GameComponent = ({ htmlString, cssString, jsString, gameWin }) => {
	const divRef = useRef(null);

	useEffect(() => {
		if (divRef.current) {
			divRef.current.innerHTML = htmlString;

			const styleTag = document.createElement("style");
			styleTag.textContent = cssString;
			divRef.current.appendChild(styleTag);

			const scriptTag = document.createElement("script");
			scriptTag.textContent = jsString;
			divRef.current.appendChild(scriptTag);
		}

		return () => {
			if (window.gameWin) {
				delete window.gameWin;
			}
		};
	}, [htmlString, cssString, jsString]);

	useEffect(() => {
		window.gameWin = gameWin;
	}, []);

	return <div ref={divRef}></div>;
};

export default GameComponent;
