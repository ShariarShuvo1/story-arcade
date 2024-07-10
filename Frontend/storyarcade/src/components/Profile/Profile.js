import React, { useState, useEffect } from "react";
// import placeholderAvatar from './placeholder-avatar.png'; // Add a placeholder image to your project

function Profile() {
	const [user, setUser] = useState(null);
	const [isOwner, setIsOwner] = useState(true); // For demonstration, assume user is owner

	useEffect(() => {
		// Simulating API call to fetch user data
		setTimeout(() => {
			setUser({
				name: "Hero Alam",
				birthDate: new Date(2000, 0, 1), // January 1, 2000
				email: "heroalam@gmail.com",
				avatar: null, // Simulate no avatar
			});
		}, 1000);
	}, []);

	const calculateAge = (birthDate) => {
		const today = new Date();
		const birth = new Date(birthDate);
		let years = today.getFullYear() - birth.getFullYear();
		let months = today.getMonth() - birth.getMonth();
		let days = today.getDate() - birth.getDate();

		if (months < 0 || (months === 0 && days < 0)) {
			years--;
			months += 12;
		}

		if (days < 0) {
			const prevMonthLastDay = new Date(
				today.getFullYear(),
				today.getMonth(),
				0
			).getDate();
			days += prevMonthLastDay;
			months--;
		}

		return `${years} years, ${months} months, ${days} days`;
	};

	if (!user) {
		return <div>Loading...</div>;
	}

	return (
		<div className="profile">
			<img src={user.avatar} alt="Profile" className="profile-picture" />
			<h1>{user.name}</h1>
			<p>Age: {calculateAge(user.birthDate)}</p>
			{isOwner && (
				<>
					<p>Email: {user.email}</p>
					<button onClick={() => alert("Change Password")}>
						Change Password
					</button>
					<button onClick={() => alert("Edit Profile")}>
						Edit Profile
					</button>
					<button onClick={() => alert("Change Email")}>
						Change Email
					</button>
					<button onClick={() => alert("Upload Picture")}>
						Upload Picture
					</button>
					<button onClick={() => alert("Delete Profile")}>
						Delete Profile
					</button>
				</>
			)}
		</div>
	);
}

export default Profile;
