// Initial Code from https://github.com/abdurrahman720/react-swipeable-button/

import React, { Component, createRef } from "react";
import "./SwipeableButton.css";

export default class SwipeableButton extends Component {
	sliderLeft = 0;
	isDragging = false;
	startX = 0;
	containerWidth = 0;

	sliderRef = createRef();
	containerRef = createRef();

	constructor(props) {
		super(props);
		this.state = {
			unlocked: false,
		};
	}

	componentDidMount() {
		if (this.containerRef.current) {
			this.containerWidth = this.containerRef.current.clientWidth - 50;
		}

		document.addEventListener("mousemove", this.onDrag);
		document.addEventListener("mouseup", this.stopDrag);
		document.addEventListener("touchmove", this.onDrag);
		document.addEventListener("touchend", this.stopDrag);
	}

	componentWillUnmount() {
		document.removeEventListener("mousemove", this.onDrag);
		document.removeEventListener("mouseup", this.stopDrag);
		document.removeEventListener("touchmove", this.onDrag);
		document.removeEventListener("touchend", this.stopDrag);
	}

	onDrag = (e) => {
		if (this.state.unlocked) {
			return;
		}

		if (this.isDragging) {
			const clientX = "touches" in e ? e.touches[0].clientX : e.clientX;
			this.sliderLeft = Math.min(
				Math.max(0, clientX - this.startX),
				this.containerWidth
			);
			this.updateSliderStyle();
		}
	};

	updateSliderStyle = () => {
		if (this.state.unlocked) return;
		if (this.sliderRef.current) {
			this.sliderRef.current.style.left = `${this.sliderLeft + 50}px`;
		}
	};

	stopDrag = () => {
		if (this.state.unlocked) return;
		if (this.isDragging) {
			this.isDragging = false;
			if (this.sliderLeft > this.containerWidth * 0.9) {
				this.sliderLeft = this.containerWidth;
				if (this.props.onSuccess) {
					this.props.onSuccess();
					this.onSuccess();
				}
			} else {
				this.sliderLeft = 0;
				if (this.props.onFailure) {
					this.props.onFailure();
				}
			}
			this.updateSliderStyle();
		}
	};

	startDrag = (e) => {
		if (this.state.unlocked) return;
		this.isDragging = true;
		this.startX = "touches" in e ? e.touches[0].clientX : e.clientX;
	};

	onSuccess = () => {
		if (this.containerRef.current) {
			this.containerRef.current.style.width = `${this.containerRef.current.clientWidth}px`;
		}
		this.setState({
			unlocked: true,
		});
	};

	getText = () => {
		return this.state.unlocked
			? this.props.text_unlocked || ""
			: this.props.text || "";
	};

	reset = () => {
		if (this.state.unlocked) return;
		this.setState({ unlocked: false }, () => {
			this.sliderLeft = 0;
			this.updateSliderStyle();
		});
	};

	render() {
		return (
			<div className="ReactSwipeButton max-w-96">
				<div
					className={`rsbContainer ${
						this.state.unlocked ? "rsbContainerUnlocked" : ""
					}`}
					ref={this.containerRef}
				>
					<div
						className="rsbcSlider"
						ref={this.sliderRef}
						onMouseDown={this.startDrag}
						style={{ background: this.props.color }}
						onTouchStart={this.startDrag}
					>
						<span className="rsbcSliderText">{this.getText()}</span>
						<span className="rsbcSliderArrow"></span>
						<span
							className="rsbcSliderCircle"
							style={{ background: this.props.color }}
						></span>
					</div>
					<div className="rsbcText">{this.getText()}</div>
				</div>
			</div>
		);
	}
}
