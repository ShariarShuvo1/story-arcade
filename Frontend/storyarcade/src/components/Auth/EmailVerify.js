import { useAuthContext } from "../../hooks/useAuthContext";
import { useNavigate } from "react-router-dom";
import React, { useState, useEffect } from "react";
import LoadingFullscreen from "../../Tools/Loading";

function EmailVerify() {
	const jwt = JSON.parse(localStorage.getItem("jwt"));
	const navigate = useNavigate();
	const { dispatch } = useAuthContext();

	const [isLoading, setIsLoading] = useState(false);
	const [otp, setOtp] = useState("");
	const [error, setError] = useState("");

	useEffect(() => {
		if (!jwt) {
			navigate("/login");
		}
	}, [jwt]);

	const handleSubmit = async (e) => {
		e.preventDefault();
		setIsLoading(true);
		const body = {
			otp,
		};
		const response = await fetch("/emailVerification/verifyEmailOTP", {
			method: "POST",
			headers: {
				"Content-Type": "application/json",
				Authorization: `Bearer ${jwt}`,
			},
			body: JSON.stringify(body),
		});
		const data = await response.json();
		if (response.ok) {
			navigate("/login");
			dispatch({ type: "LOGIN", payload: jwt });
		} else {
			setError(data.message);
		}
		setIsLoading(false);
	};

	return (
		<div className="flex px-4 items-center justify-center h-full">
			{isLoading && <LoadingFullscreen/>}

			<form
				className="w-full max-w-md p-8 space-y-6 shadow-md rounded-md bg-gradient-to-tr from-slate-900 via-slate-800 to-zinc-800"
				onSubmit={handleSubmit}
			>
				<h3 className="text-2xl font-bold text-center text-primary">
					Verify Email
				</h3>

				<div className="mb-4">
					<label
						htmlFor="otp"
						className="block mb-1 text-sm font-medium text-text-light"
					>
						OTP:
					</label>
					<input
						id="otp"
						type="number"
						className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
						onChange={(e) => setOtp(e.target.value)}
						value={otp}
						placeholder={"Enter your OTP"}
						required
						min="0"
					/>
				</div>

				<button
					type="submit"
					className="w-full py-3 font-bold bg-button-primary rounded-md hover:bg-button-hover_primary focus:outline-none focus:ring-2 focus:ring-highlight"
					disabled={isLoading}
				>
					Verify
				</button>

				{error && (
					<div className="mt-4 text-sm text-error">{error}</div>
				)}
			</form>
		</div>
	);
}

export default EmailVerify;
