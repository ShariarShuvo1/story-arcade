import { useNavigate, useParams } from "react-router-dom";
import React, { useState } from "react";
import { Spin, ConfigProvider } from "antd";
import { Loading3QuartersOutlined } from "@ant-design/icons";

function ForgetPasswordOtp() {
	const navigate = useNavigate();
	let { email } = useParams();
	email = email.split("=")[1];

	const [isLoading, setIsLoading] = useState(false);
	const [otp, setOtp] = useState("");
	const [error, setError] = useState("");
	const [password, setPassword] = useState("");

	const handleSubmit = async (e) => {
		e.preventDefault();
		setIsLoading(true);
		const body = {
			otp,
			email,
			password,
		};
		const response = await fetch("/emailVerification/forgetPasswordOtp", {
			method: "POST",
			headers: {
				"Content-Type": "application/json",
				Authorization: `Bearer `,
			},
			body: JSON.stringify(body),
		});
		const data = await response.json();
		if (response.ok) {
			navigate("/login");
		} else {
			setError(data.message);
		}
		setIsLoading(false);
	};

	return (
		<div className="flex px-4 items-center justify-center min-h-screen bg-gradient-to-tr from-purple-200 to-cyan-200">
			{isLoading && (
				<ConfigProvider
					theme={{
						components: {
							Spin: {
								dotSizeLG: 128,
							},
						},
					}}
				>
					<Spin
						indicator={<Loading3QuartersOutlined spin />}
						size="large"
						fullscreen
					/>
				</ConfigProvider>
			)}

			<form
				className="w-full max-w-md p-8 space-y-6 shadow-md rounded-md bg-gradient-to-tr from-slate-900 via-slate-800 to-zinc-800"
				onSubmit={handleSubmit}
			>
				<h3 className="text-2xl font-bold text-center text-primary">
					Verify Email
				</h3>

				<div className="mb-4">
					<label
						htmlFor="top"
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
				<div className="mb-4">
					<label
						htmlFor="password"
						className="block mb-1 text-sm font-medium text-text-light"
					>
						New Password:
					</label>
					<input
						id="password"
						type="password"
						className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
						onChange={(e) => setPassword(e.target.value)}
						value={password}
						placeholder={"Enter a new password"}
						required
						min="0"
					/>
				</div>

				<button
					type="submit"
					className="w-full py-3 font-bold bg-button-primary rounded-md hover:bg-button-hover_primary focus:outline-none focus:ring-2 focus:ring-highlight"
					disabled={isLoading}
				>
					Submit
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

export default ForgetPasswordOtp;
