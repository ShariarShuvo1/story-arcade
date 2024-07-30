function HomeTitle({ currentlySelected, setCurrentlySelected }) {
	const jwt = JSON.parse(localStorage.getItem("jwt"));

	return (
		<div className="bg-slate-900 text-text-muted rounded-t-lg p-2 text-center select-none flex justify-between items-center gap-4">
			<div></div>
			<div className="font-bold text-2xl">Stories</div>
			<select
				className="p-1 border-2 text-xl bg-slate-900 text-text-muted rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
				defaultValue={currentlySelected}
				onChange={(e) => setCurrentlySelected(e.target.value)}
			>
				{jwt && <option value="recommended">Recommended</option>}
				{jwt && <option value="following">Following Only</option>}
				<option value="popular">Popular</option>
				<option value="latest">Latest</option>
				<option value="oldest">Oldest</option>
				<option value="viewed">Most Viewed</option>
				<option value="upvote">Most Upvote</option>
				<option value="comment">Most Comment</option>
				<option value="paid">Paid Only</option>
				<option value="free">Free Only</option>
				<option value="follower">Followers Only</option>
			</select>
		</div>
	);
}

export default HomeTitle;
