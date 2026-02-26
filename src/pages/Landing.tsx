import { useState, useEffect } from 'react';
import { Zap, LayoutDashboard, Users, ArrowRight, TrendingUp, Package, Receipt } from "lucide-react";
import { Footer } from "@/components/Footer";
import { useTranslation } from 'react-i18next';

interface LandingProps {
  onGetStarted: () => void;
  onLogin: () => void;
  isAuthenticated?: boolean;
}

export function Landing({ onGetStarted, onLogin, isAuthenticated }: LandingProps) {
	const { t } = useTranslation();
	const [currentSlide, setCurrentSlide] = useState(0);

	const carouselItems = [
		{ icon: TrendingUp, title: t('landing.carousel.trackSales'), description: t('landing.carousel.trackSalesDesc') },
		{ icon: Package, title: t('landing.carousel.manageInventory'), description: t('landing.carousel.manageInventoryDesc') },
		{ icon: Receipt, title: t('landing.carousel.trackExpenses'), description: t('landing.carousel.trackExpensesDesc') },
		{ icon: Users, title: t('landing.carousel.debtBook'), description: t('landing.carousel.debtBookDesc') },
	];

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
          <div className="container mx-auto px-4 xl:px-0">
            <div className="grid lg:grid-cols-2 gap-12 items-center">
							{/* Left Panel - Text */}
							<div>
								<h1 className="text-5xl lg:text-6xl font-bold text-text mb-6 tracking-tight">
									{t('landing.hero.title')} <span className="text-primary">{t('landing.hero.ledger')}</span>{t('landing.hero.digitized')}
								</h1>
								<p className="text-lg text-muted mb-10">
									{t('landing.hero.subtitle')}
								</p>
								{!isAuthenticated ? (
									<div className="flex flex-col sm:flex-row gap-4">
										<button
											onClick={onGetStarted}
											className="px-8 py-4 bg-primary text-bg rounded-xl font-bold text-lg flex items-center justify-center gap-2 hover:bg-primary/90 transition-transform active:scale-95 shadow-lg shadow-primary/20"
										>
											{t('landing.hero.getStarted')}
											<ArrowRight size={20} />
										</button>
										<button
											onClick={onLogin}
											className="px-8 py-4 bg-surface text-text border border-border rounded-xl font-bold text-lg hover:bg-bg transition-colors"
										>
											{t('landing.hero.signIn')}
										</button>
									</div>
								) : (
									<button
										onClick={() => window.location.href = '/dashboard'}
										className="px-8 py-4 bg-primary text-bg rounded-xl font-bold text-lg flex items-center justify-center gap-2 hover:bg-primary/90 transition-transform active:scale-95 shadow-lg shadow-primary/20"
									>
										{t('landing.hero.dashboard')}
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
          <div className="container mx-auto px-4 xl:px-0">
            <h2 className="text-3xl font-bold text-text text-center mb-16">
              {t('landing.features.title')}
            </h2>
            <div className="grid md:grid-cols-3 gap-12">
              <div className="flex flex-col items-center text-center p-6">
                <div className="w-16 h-16 bg-primary/10 rounded-2xl flex items-center justify-center text-primary mb-6">
                  <Zap size={32} />
                </div>
                <h3 className="text-xl font-bold text-text mb-3">
                  {t('landing.features.offline')}
                </h3>
                <p className="text-muted">
                  {t('landing.features.offlineDesc')}
                </p>
              </div>

              <div className="flex flex-col items-center text-center p-6">
                <div className="w-16 h-16 bg-secondary/10 rounded-2xl flex items-center justify-center text-secondary mb-6">
                  <LayoutDashboard size={32} />
                </div>
                <h3 className="text-xl font-bold text-text mb-3">
                  {t('landing.features.insights')}
                </h3>
                <p className="text-muted">
                  {t('landing.features.insightsDesc')}
                </p>
              </div>

              <div className="flex flex-col items-center text-center p-6">
                <div className="w-16 h-16 bg-accent/10 rounded-2xl flex items-center justify-center text-accent mb-6">
                  <Users size={32} />
                </div>
                <h3 className="text-xl font-bold text-text mb-3">
                  {t('landing.features.shopCentric')}
                </h3>
                <p className="text-muted">
                  {t('landing.features.shopCentricDesc')}
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
