import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Stethoscope } from 'lucide-react';

// --- NEW IMPORT ---
// We import the image directly from your src folder.
// The '@' alias points to 'src', or you could use '../img/...'
import panaceaHero from '@/img/panacea_landing_page.png';

const LandingPage = () => {
    const navigate = useNavigate();

    return (
        <div className="min-h-screen bg-background text-foreground flex flex-col transition-colors duration-500">

            {/* Navbar */}
            <nav className="flex items-center justify-between p-6 container mx-auto sticky top-0 z-50 bg-background/80 backdrop-blur-md border-b border-border/50">
                <div className="flex items-center gap-2">
                    <div className="p-2 bg-primary/20 rounded-lg text-primary shadow-sm ring-1 ring-primary/10">
                        <Stethoscope size={24} />
                    </div>
                    <span className="text-xl font-bold tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-foreground to-foreground/70">
                Panacea
            </span>
                </div>
                <div className="flex gap-4">
                    <Button variant="ghost" onClick={() => navigate('/login')}>Staff Login</Button>
                    <Button onClick={() => navigate('/login')}>Access Portal</Button>
                </div>
            </nav>

            {/* Hero Section */}
            <section className="flex-1 container mx-auto px-6 flex flex-col lg:flex-row items-center gap-12 py-12 lg:py-24">

                {/* Text Content */}
                <div className="flex-1 space-y-8 animate-in fade-in slide-in-from-left-10 duration-700">
                    <div className="inline-block px-3 py-1 rounded-full bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 text-sm font-medium border border-emerald-500/20 shadow-sm">
                        Status: Operational
                    </div>
                    <h1 className="text-5xl md:text-7xl font-extrabold tracking-tight leading-tight">
                        Modern Care for <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-500 to-emerald-500">Every Patient.</span>
                    </h1>
                    <p className="text-xl text-muted-foreground max-w-lg leading-relaxed">
                        The Unified Hospital Operating System. Streamline operations, manage beds in real-time, and unify medical records with Panacea Enterprise.
                    </p>
                    <div className="flex flex-col sm:flex-row gap-4 pt-2">
                        <Button size="lg" className="h-14 px-8 text-base shadow-xl shadow-primary/20 hover:scale-105 transition-transform" onClick={() => navigate('/login')}>
                            Launch Console
                        </Button>
                        <Button size="lg" variant="outline" className="h-14 px-8 text-base bg-background/50" onClick={() => navigate('/login')}>
                            System Architecture
                        </Button>
                    </div>
                </div>

                {/* Image Container */}
                <div className="flex-1 relative w-full animate-in fade-in zoom-in duration-1000 delay-200">
                    {/* Glowing Backlight Effect */}
                    <div className="absolute inset-0 bg-gradient-to-tr from-blue-600/20 to-emerald-500/20 blur-3xl rounded-full -z-10 scale-90"></div>

                    <div className="relative rounded-2xl border border-white/10 shadow-2xl bg-card/30 backdrop-blur-sm overflow-hidden">
                        {/* The Actual Image */}
                        <img
                            src={panaceaHero}
                            alt="Panacea Hospital Interface"
                            className="w-full h-auto object-cover grayscale-[10%] hover:grayscale-0 transition-all duration-700 hover:scale-105"
                        />

                        {/* Optional Glass Overlay Reflection */}
                        <div className="absolute inset-0 bg-gradient-to-tr from-white/5 to-transparent pointer-events-none"></div>
                    </div>
                </div>

            </section>

            {/* Footer */}
            <footer className="border-t border-border py-8 bg-muted/20">
                <div className="container mx-auto text-center text-muted-foreground text-sm flex justify-center gap-8">
                    <span>&copy; 2026 Panacea Health Systems</span>
                    <span>•</span>
                    <span className="flex items-center gap-1">System <div className="w-2 h-2 rounded-full bg-emerald-500"></div> Online</span>
                </div>
            </footer>
        </div>
    );
};

export default LandingPage;