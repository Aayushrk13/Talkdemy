import { Header } from "@/components/Header";
import { FeatureCard } from "@/components/FeatureCard";
import { Button } from "@/components/ui/button";
import {
	MessageSquare,
	FileText,
	Users,
	Upload,
	Lock,
	Zap,
} from "lucide-react";
import { useNavigate } from "react-router-dom";

const Home = () => {
	const navigate = useNavigate();

	const features = [
		{
			icon: MessageSquare,
			title: "Real-Time Messaging",
			description:
				"Instant messaging with your class. Share ideas, ask questions, and collaborate seamlessly.",
		},
		{
			icon: Upload,
			title: "File Sharing",
			description:
				"Share documents, images, and files instantly with your classmates and teachers.",
		},
		{
			icon: Users,
			title: "Group Collaboration",
			description:
				"Create study groups, work on projects together, and stay connected with your peers.",
		},
		{
			icon: FileText,
			title: "Document Management",
			description:
				"Organize and access shared files easily with built-in document management.",
		},
		{
			icon: Lock,
			title: "Secure & Private",
			description:
				"End-to-end encryption ensures your conversations and data remain private and secure.",
		},
		{
			icon: Zap,
			title: "Lightning Fast",
			description:
				"Built for speed. Experience instant updates and real-time synchronization across devices.",
		},
	];

	return (
		<div className="min-h-screen flex flex-col bg-background">
			<Header />

			<section className="flex flex-col items-center justify-center px-8 py-20 md:py-32 bg-gradient-to-b from-background to-muted">
				<div className="max-w-6xl w-full grid md:grid-cols-2 gap-12 items-center">
					<div className="flex flex-col gap-6">
						<h1 className="text-5xl md:text-6xl font-light leading-tight">
							Connect with your class in{" "}
							<span className="font-semibold text-brand-accent">real time</span>
						</h1>
						<p className="text-xl font-extralight text-muted-foreground">
							Talkdemy brings students and teachers together with powerful
							real-time communication tools designed for modern education.
						</p>
						<div className="flex gap-4 mt-4">
							<Button
								size="lg"
								onClick={() => navigate("/signup")}
								className="font-medium text-lg px-8"
							>
								Get Started Free
							</Button>
							<Button
								size="lg"
								variant="outline"
								onClick={() => navigate("/login")}
								className="font-light text-lg px-8"
							>
								Sign In
							</Button>
						</div>
					</div>

					<div className="relative h-[400px] flex items-center justify-center">
						<div className="absolute inset-0 flex items-center justify-center">
							<div className="w-64 h-64 border-2 border-foreground rounded-full animate-pulse" />
							<div className="absolute w-48 h-48 border-2 border-foreground/60 rounded-full" />
							<div className="absolute w-32 h-32 bg-foreground rounded-full flex items-center justify-center">
								<MessageSquare className="w-16 h-16 text-background" />
							</div>
						</div>
						<div className="absolute top-10 right-10 w-20 h-20 border-2 border-foreground rounded-lg rotate-12" />
						<div className="absolute bottom-10 left-10 w-16 h-16 border-2 border-foreground rounded-lg -rotate-12" />
						<div className="absolute top-1/2 right-0 w-12 h-12 bg-foreground" />
						<div className="absolute bottom-1/4 left-0 w-12 h-12 bg-foreground" />
					</div>
				</div>
			</section>

			<section className="px-8 py-20 bg-background">
				<div className="max-w-6xl mx-auto">
					<div className="text-center mb-16">
						<h2 className="text-4xl font-light mb-4">
							Everything you need to{" "}
							<span className="font-semibold">collaborate</span>
						</h2>
						<p className="text-xl font-extralight text-muted-foreground">
							Powerful features designed for seamless real-time communication
						</p>
					</div>

					<div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
						{features.map((feature, index) => (
							<FeatureCard
								key={index}
								icon={feature.icon}
								title={feature.title}
								description={feature.description}
							/>
						))}
					</div>
				</div>
			</section>

			<section className="px-8 py-20 bg-gradient-to-b from-muted to-background">
				<div className="max-w-4xl mx-auto text-center">
					<h2 className="text-4xl font-light mb-6">
						Ready to transform your{" "}
						<span className="font-semibold text-brand-accent">
							classroom experience?
						</span>
					</h2>
					<p className="text-xl font-extralight text-muted-foreground mb-8">
						Join thousands of students and teachers already using Talkdemy
					</p>
					<Button
						size="lg"
						onClick={() => navigate("/signup")}
						className="font-medium text-lg px-12"
					>
						Start Connecting Today
					</Button>
				</div>
			</section>

			<footer className="border-t-2 border-brand-border py-8 px-8 mt-auto">
				<div className="max-w-6xl mx-auto flex flex-col md:flex-row justify-between items-center gap-4">
					<div className="flex items-center gap-2">
						<Users className="text-brand-accent" />
						<p className="font-semibold">Talkdemy</p>
					</div>
					<p className="text-sm font-light text-muted-foreground">
						© 2024 Talkdemy. Real-time communication for modern education.
					</p>
				</div>
			</footer>
		</div>
	);
};

export default Home;
