'use client'

import React, { useState } from 'react';
import { useUser, useClerk } from '@clerk/nextjs';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { User, Mail, Calendar, Monitor, Smartphone, Tablet, Trash2, LogOut, Shield, Clock, MapPin } from 'lucide-react';

export default function ProfilePage() {
	const { user, isLoaded } = useUser();
	const { signOut } = useClerk();
	const [showDeleteAlert, setShowDeleteAlert] = useState(false);
	const [hoveredSession, setHoveredSession] = useState(null);

	if (!isLoaded) {
		return (
			<div className="min-h-screen flex items-center justify-center">
				<div className="text-center">
					<div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900 mx-auto"></div>
					<p className="mt-4">Loading...</p>
				</div>
			</div>
		);
	}

	if (!user) {
		return (
			<div className="min-h-screen flex items-center justify-center">
				<p>Please sign in to view this page.</p>
			</div>
		);
	}

	// Format the joined date
	const formatDate = (timestamp) => {
		if (!timestamp) return 'N/A';
		const date = new Date(timestamp);
		return date.toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' });
	};

	// Format last active time
	const formatLastActive = (timestamp) => {
		if (!timestamp) return 'Unknown';
		const now = new Date();
		const last = new Date(timestamp);
		const diffMinutes = Math.floor((now - last) / 60000);

		if (diffMinutes < 1) return 'Active now';
		if (diffMinutes < 60) return `${diffMinutes} minute${diffMinutes > 1 ? 's' : ''} ago`;

		const diffHours = Math.floor(diffMinutes / 60);
		if (diffHours < 24) return `${diffHours} hour${diffHours > 1 ? 's' : ''} ago`;

		const diffDays = Math.floor(diffHours / 24);
		return `${diffDays} day${diffDays > 1 ? 's' : ''} ago`;
	};

	// Get device icon based on device type
	const getDeviceIcon = (deviceType) => {
		if (!deviceType) return Monitor;
		const type = deviceType.toLowerCase();
		if (type.includes('mobile') || type.includes('iphone') || type.includes('android')) return Smartphone;
		if (type.includes('tablet') || type.includes('ipad')) return Tablet;
		return Monitor;
	};

	// Map Clerk sessions to display format
	const activeSessions = user.sessions?.map((session, index) => {
		const DeviceIcon = getDeviceIcon(session.latestActivity?.deviceType);
		return {
			id: session.id,
			device: session.latestActivity?.deviceType || 'Unknown Device',
			browser: session.latestActivity?.browserName || 'Unknown Browser',
			location: session.latestActivity?.city && session.latestActivity?.country
				? `${session.latestActivity.city}, ${session.latestActivity.country}`
				: 'Unknown Location',
			lastActive: formatLastActive(session.lastActiveAt),
			icon: DeviceIcon,
			current: session.id === user.lastActiveSessionId,
			ipAddress: session.latestActivity?.ipAddress || 'N/A'
		};
	}) || [];

	const handleDeleteAccount = async () => {
		if (window.confirm('Are you absolutely sure? This action cannot be undone.')) {
			try {
				await user.delete();
			} catch (error) {
				console.error('Error deleting account:', error);
				alert('Failed to delete account. Please try again.');
			}
		}
	};

	const handleSignOutAll = async () => {
		try {
			// Sign out from all sessions
			await user.getSessions().then(sessions => {
				sessions.forEach(session => session.revoke());
			});
			await signOut();
		} catch (error) {
			console.error('Error signing out:', error);
		}
	};

	const handleRevokeSession = async (sessionId) => {
		try {
			const session = user.sessions.find(s => s.id === sessionId);
			if (session) {
				await session.revoke();
			}
		} catch (error) {
			console.error('Error revoking session:', error);
		}
	};

	return (
		<div className="min-h-screen px-4 md:p-8">
			<div className="max-w-6xl mx-auto">
				{/* Header with Profile Card */}
				<div className="relative mb-8">
					<Card className="relative">
						<CardContent className="p-8">
							<div className="flex flex-col md:flex-row items-start md:items-center gap-6">
								{/* Profile Photo */}
								<div className="relative group">
									<div className="relative w-32 h-32 rounded-full overflow-hidden ring-4 ring-background shadow-xl transform group-hover:scale-105 transition-transform duration-300">
										<img
											src={user.imageUrl}
											alt={user.fullName || user.username || 'User'}
											className="w-full h-full object-cover"
										/>
									</div>
									{user.lastSignInAt && (
										<div className="absolute bottom-2 right-2 w-5 h-5 bg-green-500 rounded-full ring-4 ring-background"></div>
									)}
								</div>

								{/* User Info */}
								<div className="flex-1 space-y-3">
									<div>
										<h1 className="text-4xl font-bold mb-2">
											{user.fullName || user.username || 'User'}
										</h1>
										<div className="flex flex-wrap items-center gap-4 text-muted-foreground">
											<div className="flex items-center gap-2">
												<Mail className="w-4 h-4" />
												<span className="text-sm">
													{user.primaryEmailAddress?.emailAddress || 'No email'}
												</span>
											</div>
											{user.username && (
												<div className="flex items-center gap-2">
													<User className="w-4 h-4" />
													<span className="text-sm">@{user.username}</span>
												</div>
											)}
										</div>
									</div>

									<div className="flex flex-wrap gap-3">
										<Badge variant="secondary">
											<Calendar className="w-3 h-3 mr-1" />
											Joined {formatDate(user.createdAt)}
										</Badge>
										{user.lastSignInAt && (
											<Badge variant="secondary">
												<Clock className="w-3 h-3 mr-1" />
												Last sign in: {formatLastActive(user.lastSignInAt)}
											</Badge>
										)}
										{user.twoFactorEnabled && (
											<Badge variant="secondary">
												<Shield className="w-3 h-3 mr-1" />
												2FA Enabled
											</Badge>
										)}
									</div>
								</div>

								{/* Quick Actions */}
								{/* <div className="flex md:flex-col gap-3 w-full md:w-auto">
									<Button
										variant="outline"
										className="flex-1 md:flex-none"
									>
										<Shield className="w-4 h-4 mr-2" />
										Security
									</Button>
									<Button className="flex-1 md:flex-none">
										Edit Profile
									</Button>
								</div> */}
							</div>
						</CardContent>
					</Card>
				</div>

				<div className="grid md:grid-cols-3 gap-6">
					{/* Active Sessions */}
					<Card className="md:col-span-2">
						<CardHeader>
							<CardTitle className="flex items-center gap-2 text-2xl">
								<Monitor className="w-6 h-6" />
								Active Sessions
							</CardTitle>
							<CardDescription>
								Manage your devices and active sessions ({activeSessions.length} active)
							</CardDescription>
						</CardHeader>
						<CardContent className="p-6">
							{activeSessions.length === 0 ? (
								<div className="text-center py-8 text-muted-foreground">
									<Monitor className="w-12 h-12 mx-auto mb-4 opacity-50" />
									<p>No active sessions found</p>
								</div>
							) : (
								<div className="space-y-4">
									{activeSessions.map((session) => {
										const Icon = session.icon;
										return (
											<div
												key={session.id}
												onMouseEnter={() => setHoveredSession(session.id)}
												onMouseLeave={() => setHoveredSession(null)}
												className={`relative p-5 rounded-2xl border-2 transition-all duration-300 ${session.current
														? 'bg-accent border-primary'
														: 'hover:border-primary hover:shadow-lg'
													}`}
											>
												{session.current && (
													<div className="absolute top-3 right-3">
														<Badge>Current</Badge>
													</div>
												)}

												<div className="flex items-start gap-4">
													<div className={`p-3 rounded-xl transition-colors duration-300 ${hoveredSession === session.id
															? 'bg-primary text-primary-foreground'
															: 'bg-muted'
														}`}>
														<Icon className="w-6 h-6" />
													</div>

													<div className="flex-1 min-w-0">
														<h3 className="font-semibold text-lg mb-1">{session.device}</h3>
														<div className="space-y-1 text-sm text-muted-foreground">
															<p className="flex items-center gap-2">
																<span className="font-medium">{session.browser}</span>
																<span>•</span>
																<span>{session.location}</span>
															</p>
															<p>{session.lastActive}</p>
															<p className="text-xs">IP: {session.ipAddress}</p>
														</div>
													</div>

													{!session.current && (
														<Button
															variant="ghost"
															size="sm"
															onClick={() => handleRevokeSession(session.id)}
														>
															<LogOut className="w-4 h-4" />
														</Button>
													)}
												</div>
											</div>
										);
									})}
								</div>
							)}
						</CardContent>
					</Card>

					{/* Account Actions */}
					<Card className="h-fit">
						<CardHeader>
							<CardTitle className="flex items-center gap-2 text-xl">
								<Shield className="w-5 h-5" />
								Account Actions
							</CardTitle>
							<CardDescription>Manage your account security</CardDescription>
						</CardHeader>
						<CardContent className="p-6 space-y-4">
							<div className="space-y-3">
								<Button
									className="w-full h-12"
									onClick={() => signOut()}
								>
									<LogOut className="w-5 h-5 mr-2" />
									Sign Out
								</Button>

								<Button
									variant="outline"
									className="w-full h-12"
									onClick={handleSignOutAll}
								>
									<LogOut className="w-5 h-5 mr-2" />
									Sign Out All Devices
								</Button>

								<Separator className="my-4" />

								<Button
									variant="outline"
									className="w-full h-12"
									onClick={() => setShowDeleteAlert(!showDeleteAlert)}
								>
									<Trash2 className="w-5 h-5 mr-2" />
									Delete Account
								</Button>

								{showDeleteAlert && (
									<Alert className="animate-in fade-in slide-in-from-top-2 duration-300">
										<AlertDescription>
											<p className="font-semibold mb-2">⚠️ Warning</p>
											<p className="mb-3 text-sm">This action cannot be undone. All your data will be permanently deleted.</p>
											<Button
												size="sm"
												variant="destructive"
												className="w-full"
												onClick={handleDeleteAccount}
											>
												Confirm Delete
											</Button>
										</AlertDescription>
									</Alert>
								)}
							</div>

							<div className="pt-4 border-t">
								<div className="text-xs text-muted-foreground space-y-2">
									<p className="flex items-center gap-2">
										<span className="w-2 h-2 bg-green-500 rounded-full"></span>
										Account verified
									</p>
									{user.twoFactorEnabled && (
										<p className="flex items-center gap-2">
											<span className="w-2 h-2 bg-blue-500 rounded-full"></span>
											2FA enabled
										</p>
									)}
									<p className="flex items-center gap-2">
										<span className="w-2 h-2 bg-purple-500 rounded-full"></span>
										{user.emailAddresses?.length || 0} email(s) connected
									</p>
								</div>
							</div>
						</CardContent>
					</Card>
				</div>

				{/* Footer Stats */}
				<div className="mt-6 grid grid-cols-2 md:grid-cols-4 gap-4">
					{[
						{ label: 'Total Sessions', value: user.sessions?.length || 0 },
						{ label: 'Email Addresses', value: user.emailAddresses?.length || 0 },
						{ label: 'Phone Numbers', value: user.phoneNumbers?.length || 0 },
						{ label: 'External Accounts', value: user.externalAccounts?.length || 0 }
					].map((stat, idx) => (
						<Card key={idx} className="hover:shadow-lg transition-shadow duration-300">
							<CardContent className="p-4 text-center">
								<p className="text-sm text-muted-foreground mb-1">{stat.label}</p>
								<p className="text-3xl font-bold">{stat.value}</p>
							</CardContent>
						</Card>
					))}
				</div>
			</div>
		</div>
	);
}