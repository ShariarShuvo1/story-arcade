import { useEffect, useState } from "react";
import { useSignup } from "../../hooks/useSignup";
import { useNavigate } from "react-router-dom";
import LoadingFullscreen from "../../Tools/Loading";

const Signup = () => {
	const [email, setEmail] = useState("");
	const [password, setPassword] = useState("");
	const [name, setName] = useState("");
	const [dob, setDob] = useState("");
	const { signup, error, isLoading } = useSignup();
	const navigate = useNavigate();
	const jwt = localStorage.getItem("jwt");

	useEffect(() => {
		if (jwt) {
			navigate("/home");
		}
	}, [jwt]);

	const handleSubmit = async (e) => {
		e.preventDefault();
		await signup(email, password, name, dob);
	};

	return (
		<div className="flex items-center justify-center h-full">
			{isLoading && <LoadingFullscreen />}

			<form
				className="w-full max-w-md p-8 space-y-6 shadow-md rounded-md bg-gradient-to-tr from-slate-900 via-slate-800 to-zinc-800"
				onSubmit={handleSubmit}
			>
				<h3 className="text-2xl font-bold text-center text-primary">
					Sign Up
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
						htmlFor="name"
						className="block mb-1 text-sm font-medium text-text-light"
					>
						Name:
					</label>
					<input
						id="name"
						type="text"
						className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
						onChange={(e) => setName(e.target.value)}
						value={name}
						placeholder="Enter your name"
						required
					/>
				</div>

				<div className="mb-6">
					<label
						htmlFor="dob"
						className="block mb-1 text-sm font-medium text-text-light"
					>
						Date of Birth:
					</label>
					<input
						id="dob"
						type="date"
						className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
						onChange={(e) => setDob(e.target.value)}
						value={dob}
						required
						max={
							new Date(new Date().getFullYear() - 10, 0, 1)
								.toISOString()
								.split("T")[0]
						}
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
					Sign up
				</button>

				{error && (
					<div className="mt-4 text-sm text-error">{error}</div>
				)}

				<div className="text-text-light">
					Already an user?{" "}
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
};

export default Signup;
