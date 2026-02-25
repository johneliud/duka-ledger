import { useState, useEffect } from 'react';
import { Zap, LayoutDashboard, Users, ArrowRight, TrendingUp, Package, Receipt } from "lucide-react";
import { Footer } from "@/components/Footer";

interface LandingProps {
  onGetStarted: () => void;
  onLogin: () => void;
  isAuthenticated?: boolean;
}

const carouselItems = [
	{ icon: TrendingUp, title: 'Track Sales', description: 'Record every transaction instantly, even offline' },
	{ icon: Package, title: 'Manage Inventory', description: 'Monitor stock levels and get low stock alerts' },
	{ icon: Receipt, title: 'Track Expenses', description: 'Keep tabs on all business expenses in one place' },
	{ icon: Users, title: 'Debt Book', description: 'Manage customer credit and payment tracking' },
];

export function Landing({ onGetStarted, onLogin, isAuthenticated }: LandingProps) {
	const [currentSlide, setCurrentSlide] = useState(0);

	useEffect(() => {
		const timer = setInterval(() => {
			setCurrentSlide((prev) => (prev + 1) % carouselItems.length);
		}, 3000);
		return () => clearInterval(timer);
	}, []);

  return (
    <div className="min-h-screen bg-bg flex flex-col">
      <main className="flex-grow">
        {/* Hero Section */}
        <section className="py-20 lg:py-32">
          <div className="container mx-auto px-4 lg:px-0">
            <div className="grid lg:grid-cols-2 gap-12 items-center">
							{/* Left Panel - Text */}
							<div>
								<h1 className="text-5xl lg:text-6xl font-bold text-text mb-6 tracking-tight">
									Your Shop's Entire <span className="text-primary">Ledger</span>,
									Digitized.
								</h1>
								<p className="text-lg text-muted mb-10">
									Track sales, manage inventory, and monitor debts effortlessly.
									Built for the market, designed to work everywhere—even without
									internet.
								</p>
								{!isAuthenticated ? (
									<div className="flex flex-col sm:flex-row gap-4">
										<button
											onClick={onGetStarted}
											className="px-8 py-4 bg-primary text-bg rounded-xl font-bold text-lg flex items-center justify-center gap-2 hover:bg-primary/90 transition-transform active:scale-95 shadow-lg shadow-primary/20"
										>
											Get Started for Free
											<ArrowRight size={20} />
										</button>
										<button
											onClick={onLogin}
											className="px-8 py-4 bg-surface text-text border border-border rounded-xl font-bold text-lg hover:bg-bg transition-colors"
										>
											Sign In
										</button>
									</div>
								) : (
									<button
										onClick={() => window.location.href = '/dashboard'}
										className="px-8 py-4 bg-primary text-bg rounded-xl font-bold text-lg flex items-center justify-center gap-2 hover:bg-primary/90 transition-transform active:scale-95 shadow-lg shadow-primary/20"
									>
										Proceed to Dashboard
										<ArrowRight size={20} />
									</button>
								)}
							</div>

							{/* Right Panel - Carousel */}
							<div className="relative h-96 bg-surface border border-border rounded-2xl overflow-hidden">
								{carouselItems.map((item, index) => {
									const Icon = item.icon;
									return (
										<div
											key={index}
											className={`absolute inset-0 flex flex-col items-center justify-center p-8 transition-all duration-500 ${
												index === currentSlide ? 'opacity-100 translate-x-0' : 'opacity-0 translate-x-full'
											}`}
										>
											<div className="w-24 h-24 bg-primary/10 rounded-3xl flex items-center justify-center text-primary mb-6">
												<Icon size={48} />
											</div>
											<h3 className="text-3xl font-bold text-text mb-4">{item.title}</h3>
											<p className="text-lg text-muted text-center max-w-md">{item.description}</p>
										</div>
									);
								})}
								
								{/* Carousel Indicators */}
								<div className="absolute bottom-6 left-0 right-0 flex justify-center gap-2">
									{carouselItems.map((_, index) => (
										<button
											key={index}
											onClick={() => setCurrentSlide(index)}
											className={`w-2 h-2 rounded-full transition-all ${
												index === currentSlide ? 'bg-primary w-8' : 'bg-border'
											}`}
										/>
									))}
								</div>
							</div>
						</div>
          </div>
        </section>

        {/* Summary Section */}
        <section className="py-20 bg-surface border-y border-border">
          <div className="container mx-auto px-4 lg:px-0">
            <h2 className="text-3xl font-bold text-text text-center mb-16">
              Built for the Modern Shop Owner
            </h2>
            <div className="grid md:grid-cols-3 gap-12">
              <div className="flex flex-col items-center text-center p-6">
                <div className="w-16 h-16 bg-primary/10 rounded-2xl flex items-center justify-center text-primary mb-6">
                  <Zap size={32} />
                </div>
                <h3 className="text-xl font-bold text-text mb-3">
                  Offline-First
                </h3>
                <p className="text-muted">
                  Never let a poor connection stop your business. Record sales
                  offline and sync automatically when you're back online.
                </p>
              </div>

              <div className="flex flex-col items-center text-center p-6">
                <div className="w-16 h-16 bg-secondary/10 rounded-2xl flex items-center justify-center text-secondary mb-6">
                  <LayoutDashboard size={32} />
                </div>
                <h3 className="text-xl font-bold text-text mb-3">
                  Clear Insights
                </h3>
                <p className="text-muted">
                  Get a bird's-eye view of your profit, expenses, and stock
                  levels. Make informed decisions with real-time data.
                </p>
              </div>

              <div className="flex flex-col items-center text-center p-6">
                <div className="w-16 h-16 bg-accent/10 rounded-2xl flex items-center justify-center text-accent mb-6">
                  <Users size={32} />
                </div>
                <h3 className="text-xl font-bold text-text mb-3">
                  Shop Centric
                </h3>
                <p className="text-muted">
                  Invite staff to your shop. Data stays with the business,
                  ensuring you never lose a record even if someone leaves.
                </p>
              </div>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
