export const ContentShimmer = () => {
	return (
		<div className="mt-10 grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-10">
			{[1, 2, 3, 4, 5, 6, 7, 8].map((item, index) => (
				<div
					key={index}
					className="w-full bg-slate-200 rounded-xl animate-pulse h-50 md:h-75"
				>
					{/* This represents the thumbnail placeholder */}
				</div>
			))}
		</div>
	);
};