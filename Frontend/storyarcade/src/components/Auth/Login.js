import { useState } from "react";
import { useLogin } from "../../hooks/useLogin";
import { Link, useNavigate } from "react-router-dom";
import { Spin, ConfigProvider } from "antd";
import { Loading3QuartersOutlined } from "@ant-design/icons";

const Login = () => {
	const [email, setEmail] = useState("");
	const [password, setPassword] = useState("");
	const { login, error, isLoading } = useLogin();
	const navigate = useNavigate();

	const handleSubmit = async (e) => {
		e.preventDefault();
		await login(email, password);
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
					Sign In
				</h3>

				<div className="mb-4">
					<label
						htmlFor="email"
						className="block mb-1 text-sm font-medium text-text-light"
					>
						Email address:
					</label>
					<input
						id="email"
						type="email"
						className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
						onChange={(e) => setEmail(e.target.value)}
						value={email}
						placeholder={"Enter your email"}
						required
					/>
				</div>

				<div className="mb-4">
					<label
						htmlFor="password"
						className="block mb-1 text-sm font-medium text-text-light"
					>
						Password:
					</label>
					<input
						id="password"
						type="password"
						className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
						onChange={(e) => setPassword(e.target.value)}
						value={password}
						placeholder="Enter a Password"
						required
					/>
				</div>

				<button
					type="submit"
					className="w-full py-3 font-bold bg-button-primary rounded-md hover:bg-button-hover_primary focus:outline-none focus:ring-2 focus:ring-highlight"
					disabled={isLoading}
				>
					Sign In
				</button>

				{error && (
					<div className="mt-4 text-sm text-error">{error}</div>
				)}

				<div>
					<div>
						<Link
							to="/forgetPassword"
							className="text-text-muted hover:text-text-muted hover:text-opacity-80 mt-4"
						>
							Forgot Password?
						</Link>
					</div>

					<div className="text-text-light">
						New to StoryArcade?{" "}
						<span
							className="text-text cursor-pointer ms-1 hover:text-text-hover "
							onClick={() => navigate("/signup")}
						>
							Sign Up
						</span>
					</div>
				</div>
			</form>
		</div>
	);
};

export default Login;
