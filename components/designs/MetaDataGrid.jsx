import React from 'react'

import { Zap, ArrowUpRight, Sparkles } from 'lucide-react'

function MetaDataGrid({ videoData }) {

	// Calculate Impact Level based on engagementScore
	const getImpactData = (score) => {
		if (score >= 80) return { label: "High", color: "text-green-500", bg: "bg-green-500/10" };
		if (score >= 50) return { label: "Medium", color: "text-yellow-500", bg: "bg-yellow-500/10" };
		return { label: "Low", color: "text-red-500", bg: "bg-red-500/10" };
	};

	// Map sentiment to colors
	const sentimentColors = {
		positive: "text-green-500 bg-green-500/10 border-green-500/20",
		neutral: "text-blue-500 bg-blue-500/10 border-blue-500/20",
		negative: "text-red-500 bg-red-500/10 border-red-500/20"
	};

	const impact = getImpactData(videoData?.score || 0);

	return (
		<div className="flex-1 overflow-y-auto p-2 space-y-4">

			{/* ROW 1: IMPACT & SENTIMENT */}
			<div className="grid grid-cols-1 md:grid-cols-2 gap-4">
				{/* Sentiment Card */}
				<div className={`p-5 rounded-3xl border ${sentimentColors[videoData?.sentiment] || sentimentColors.neutral} flex flex-col justify-between h-32`}>
					<div className="flex justify-between items-center">
						<span className="text-[10px] font-black uppercase tracking-widest opacity-70">Sentiment</span>
						<Sparkles className="w-4 h-4" />
					</div>
					<div>
						<h3 className="text-2xl font-black capitalize">{videoData?.sentiment || 'Neutral'}</h3>
						<p className="text-[10px] opacity-80">Overall tone of your content</p>
					</div>
				</div>

				{/* Impact Score Card */}
				<div className={`p-5 rounded-3xl border ${impact.bg} flex flex-col justify-between h-32`}>
					<div className="flex justify-between items-center">
						<span className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">Impact Score</span>
						<span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${impact.bg} ${impact.color} border`}>
							{impact.label}
						</span>
					</div>
					<div className="flex items-end gap-2">
						<h3 className={`text-4xl font-black ${impact.color}`}>{videoData?.score || 0}%</h3>
						<p className="text-[10px] text-muted-foreground pb-1 leading-tight">Engagement Potential</p>
					</div>
				</div>
			</div>

			{/* ROW 2: REACH PREDICTION (Standalone Card) */}
			<div className="p-6 rounded-3xl bg-slate-900 text-white relative overflow-hidden group">
				<div className="relative z-10 flex items-center justify-between">
					<div>
						<p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Estimated Reach</p>
						<h3 className="text-3xl font-black mt-1 text-transparent bg-clip-text bg-linear-to-r from-blue-400 to-purple-400">
							{videoData?.reach || "Calculating..."}
						</h3>
						<p className="text-xs text-slate-500 mt-2 flex items-center gap-1">
							<ArrowUpRight className="w-3 h-3" /> Predicted views based on current trends
						</p>
					</div>
					<div className="p-4 bg-white/5 rounded-2xl border border-white/10 group-hover:scale-110 transition-transform">
						<Zap className="text-yellow-400 fill-yellow-400" />
					</div>
				</div>
				{/* Background Glow */}
				<div className="absolute -right-10 -bottom-10 w-40 h-40 bg-blue-600/20 blur-[50px] rounded-full" />
			</div>

			{/* ROW 3: HASHTAGS */}
			<div className="space-y-3">
				<h4 className="text-[10px] font-black uppercase text-muted-foreground tracking-widest">Smart Hashtags</h4>
				<div className="flex flex-wrap gap-2">
					{videoData?.hashtags?.split(' ').map((tag, idx) => (
						<span key={idx} className="px-3 py-1.5 rounded-xl bg-secondary border border-border text-[11px] font-bold hover:bg-primary hover:text-primary-foreground transition-all cursor-default">
							{tag.startsWith('#') ? tag : `#${tag}`}
						</span>
					)) || <p className="text-xs text-muted-foreground italic">No hashtags generated.</p>}
				</div>
			</div>
		</div>
	)
}

export default MetaDataGrid