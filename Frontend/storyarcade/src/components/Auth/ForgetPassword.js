import { useNavigate } from "react-router-dom";
import React, {useEffect, useState} from "react";
import LoadingFullscreen from "../../Tools/Loading";

function ForgetPassword() {
	const navigate = useNavigate();

	const [isLoading, setIsLoading] = useState(false);
	const [email, setEmail] = useState("");
	const [error, setError] = useState("");
	const jwt = localStorage.getItem("jwt");

	useEffect(() => {
		if (jwt) {
			navigate("/home");
		}
	}, [jwt]);

	const handleSubmit = async (e) => {
		e.preventDefault();
		setIsLoading(true);
		const body = {
			email,
		};
		const response = await fetch("/emailVerification/checkUserExist", {
			method: "POST",
			headers: {
				"Content-Type": "application/json",
				Authorization: `Bearer`,
			},
			body: JSON.stringify(body),
		});
		const data = await response.json();
		if (response.ok) {
			navigate(`/forgetPasswordOtp/email=${email}`);
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
					Forgot Password
				</h3>

				<div className="mb-4">
					<label
						htmlFor="email"
						className="block mb-1 text-sm font-medium text-text-light"
					>
						Email Adress:
					</label>
					<input
						id="email"
						type="email"
						className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
						onChange={(e) => setEmail(e.target.value)}
						value={email}
						placeholder={"Enter your Email"}
						required
						min="0"
					/>
				</div>

				<button
					type="submit"
					className="w-full py-3 font-bold bg-button-primary rounded-md hover:bg-button-hover_primary focus:outline-none focus:ring-2 focus:ring-highlight"
					disabled={isLoading}
				>
					Get OTP
				</button>

				{error && (
					<div className="mt-4 text-sm text-error">{error}</div>
				)}

				<div className="text-text-light">
					Or,{" "}
					<span
						className="text-text cursor-pointer hover:text-text-hover "
						onClick={() => navigate("/login")}
					>
						Log In
					</span>
				</div>
			</form>
		</div>
	);
}

export default ForgetPassword;
