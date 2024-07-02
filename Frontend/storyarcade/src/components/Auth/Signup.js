import { useState } from "react";
import { useSignup } from "../../hooks/useSignup";

const Signup = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [name, setName] = useState('');
    const [dob, setDob] = useState('');
    const { signup, error, isLoading } = useSignup();

    const handleSubmit = async (e) => {
        e.preventDefault();
        const userObject = {
            email,
            password,
            name,
            dob,
        };
        await signup(userObject);
    };

    return (
        <div className="flex items-center justify-center min-h-screen bg-gradient-to-tr from-purple-200 to-cyan-200">
            <form className="w-full max-w-md p-8 space-y-6 shadow-md rounded-md bg-gradient-to-tr from-slate-900 via-slate-800 to-zinc-800" onSubmit={handleSubmit}>
                <h3 className="text-2xl font-bold text-center text-primary">Sign Up</h3>

                <div className="mb-4">
                    <label htmlFor="email" className="block mb-1 text-sm font-medium text-text-light">Email address:</label>
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
                    <label htmlFor="name" className="block mb-1 text-sm font-medium text-text-light">Name:</label>
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
                    <label htmlFor="dob" className="block mb-1 text-sm font-medium text-text-light">Date of Birth:</label>
                    <input
                        id="dob"
                        type="date"
                        className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
                        onChange={(e) => setDob(e.target.value)}
                        value={dob}
                        required
                    />
                </div>

                <div className="mb-4">
                    <label htmlFor="password" className="block mb-1 text-sm font-medium text-text-light">Password:</label>
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
                    className="w-full py-3 bg-primary rounded-md hover:bg-secondary focus:outline-none focus:ring-2 focus:ring-highlight"
                    disabled={isLoading}
                >
                    Sign up
                </button>

                {error && <div className="mt-4 text-sm text-danger">{error}</div>}
            </form>
        </div>
    );
};

export default Signup;
