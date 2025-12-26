'use client'

import React, { useContext, useEffect, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Zap, Video, Star, ArrowUpRight, Check, Sparkles, Coins } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { Progress } from '@/components/ui/progress'
import { UserDetailContext } from '@/app/_context/UserDetailContext'

const plans = [
	{
		id: 'starter',
		name: 'Starter Fuel',
		credits: 100,
		price: '₹9',
		videos: 10,
		color: 'from-blue-500 to-cyan-400',
		popular: false,
	},
	{
		id: 'pro',
		name: 'Creator Engine',
		credits: 500,
		price: '₹29',
		videos: 50,
		color: 'from-purple-600 to-pink-500',
		popular: true,
	},
	{
		id: 'elite',
		name: 'Studio Power',
		credits: 1500,
		price: '₹79',
		videos: 150,
		color: 'from-orange-500 to-yellow-400',
		popular: false,
	}
]

export default function UpgradeAccount() {

	const { userDetail, setUserDetail } = useContext(UserDetailContext);
	const [loading, setLoading] = useState(true);

	useEffect(() => {
		if (userDetail?.credits != null) {
			setLoading(false);
			setCurrentCredits(userDetail.credits)
		}
	}, [userDetail])

	const [currentCredits, setCurrentCredits] = useState(); // Free tier default
	const maxFreeCredits = 50;

	return (
		<div className="max-w-6xl mx-auto p-6 space-y-10">
			{/* 1. Header Section */}
			<div className="text-center space-y-3">
				<h1 className="text-4xl font-extrabold tracking-tight sm:text-5xl bg-clip-text text-transparent bg-linear-to-r from-primary to-purple-400">
					Power Up Your Creation
				</h1>
				<p className="text-muted-foreground text-lg">
					Each video costs <span className="text-primary font-bold">10 Credits</span>. Refuel to keep creating.
				</p>
			</div>

			{/* 2. Current Status Dashboard */}
			<div className="grid md:grid-cols-3 gap-6">
				<Card className="md:col-span-1 p-6 relative overflow-hidden bg-secondary/10 border-2 border-primary/20">
					<div className="relative z-10 space-y-4">
						<div className="flex items-center justify-between">
							<span className="text-sm font-medium uppercase tracking-wider opacity-70">Current Balance</span>
							<Zap className="text-yellow-400 fill-yellow-400 w-5 h-5" />
						</div>
						<div className="flex items-baseline space-x-2">
							<span className="text-5xl font-black">{userDetail.credits}</span>
							<span className="text-muted-foreground">Credits</span>
						</div>
						<Progress value={(currentCredits / maxFreeCredits) * 100} className="h-2" />
						<p className="text-xs text-muted-foreground">
							Approx. {Math.floor(currentCredits / 10)} more video(s) possible
						</p>
					</div>
					{/* Background Decoration */}
					<div className="absolute -right-4 -bottom-4 opacity-10">
						<Video size={120} />
					</div>
				</Card>

				{/* 3. Info Cards */}
				<div className="md:col-span-2 grid grid-cols-2 gap-4">
					<div className="p-4 rounded-xl bg-primary/5 border border-primary/10 flex items-start space-x-3">
						<div className="p-2 bg-primary/10 rounded-lg"><Sparkles className="w-5 h-5 text-primary" /></div>
						<div>
							<h4 className="font-bold text-sm">Priority Queue</h4>
							<p className="text-xs text-muted-foreground">Paid generations are 3x faster.</p>
						</div>
					</div>
					<div className="p-4 rounded-xl bg-purple-500/5 border border-purple-500/10 flex items-start space-x-3">
						<div className="p-2 bg-purple-500/10 rounded-lg"><Star className="w-5 h-5 text-purple-500" /></div>
						<div>
							<h4 className="font-bold text-sm">4K Resolution</h4>
							<p className="text-xs text-muted-foreground">Unlock ultra-high definition output.</p>
						</div>
					</div>
				</div>
			</div>

			{/* 4. The Power-Up Grid (Pricing) */}
			<div className="grid md:grid-cols-3 gap-8 pt-6">
				{plans.map((plan) => (
					<motion.div
						key={plan.id}
						whileHover={{ y: -10 }}
						className="relative group"
					>
						{plan.popular && (
							<div className="absolute -top-4 left-1/2 -translate-x-1/2 z-20 bg-primary text-primary-foreground text-[10px] font-bold px-3 py-1 rounded-full uppercase tracking-widest shadow-lg">
								Most Popular
							</div>
						)}

						<Card className={`h-full p-8 border-2 transition-all duration-300 ${plan.popular ? 'border-primary shadow-2xl shadow-primary/20' : 'border-transparent hover:border-muted-foreground/20'}`}>
							<div className="space-y-6">
								<div className={`w-14 h-14 rounded-2xl bg-linear-to-br ${plan.color} flex items-center justify-center shadow-lg`}>
									<Coins className="text-white w-7 h-7" />
								</div>

								<div>
									<h3 className="text-2xl font-bold">{plan.name}</h3>
									<div className="flex items-baseline mt-1">
										<span className="text-3xl font-black">{plan.price}</span>
										<span className="ml-2 text-muted-foreground">one-time</span>
									</div>
								</div>

								<ul className="space-y-3">
									<li className="flex items-center text-sm font-semibold">
										<Check className="mr-2 w-4 h-4 text-green-500" />
										{plan.credits} Credits Included
									</li>
									<li className="flex items-center text-sm text-muted-foreground">
										<Check className="mr-2 w-4 h-4 text-green-500" />
										Generate ~{plan.videos} HD Videos
									</li>
									<li className="flex items-center text-sm text-muted-foreground">
										<Check className="mr-2 w-4 h-4 text-green-500" />
										No Expiration Date
									</li>
								</ul>

								<Button className={`w-full h-12 text-md font-bold group ${plan.popular ? 'bg-primary' : 'variant-outline'}`}>
									Refuel Now
									<ArrowUpRight className="ml-2 w-4 h-4 group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />
								</Button>
							</div>
						</Card>
					</motion.div>
				))}
			</div>

			{/* 5. Footer Trust */}
			<p className="text-center text-sm text-muted-foreground">
				Secure checkout via Stripe. Credits added instantly to your account.
			</p>
		</div>
	)
}