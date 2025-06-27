import React from 'react';

interface Logo {
    id: string;
    name: string;
    src: string;
    alt: string;
}

const defaultLogos: Logo[] = [
    { id: 'fpt', name: 'fpt', src: '/homepage/logo-running/fpt2.png', alt: 'FPT' },
    { id: 'vcb', name: 'vcb', src: '/homepage/logo-running/vcb2.png', alt: 'VCB' },
    { id: 'mb', name: 'mb', src: '/homepage/logo-running/mb2.png', alt: 'MB' },
    { id: 'manulife', name: 'manulife', src: '/homepage/logo-running/manulife2.png', alt: 'Manulife' },
    { id: 'vinamilk', name: 'vinamilk', src: '/homepage/logo-running/vinamilk.png', alt: 'Vinamilk' },
    { id: 'vnpt', name: 'vnpt', src: '/homepage/logo-running/vnpt.png', alt: 'VNPT' },
];

const InfiniteLogoScroll: React.FC = () => {
    return (
        <div className="w-full bg-gradient-to-r from-slate-50 to-slate-100 py-3 overflow-hidden">
            <div className="max-w-7xl mx-auto px-4">
                <div className="relative overflow-hidden">
                    <div className="absolute left-0 top-0 w-20 h-full bg-gradient-to-r from-slate-50 to-transparent z-10"></div>
                    <div className="absolute right-0 top-0 w-20 h-full bg-gradient-to-l from-slate-100 to-transparent z-10"></div>

                    <div className="flex animate-scroll">
                        <div className="flex animate-scroll space-x-24">
                            {Array.from({ length: 3 }).flatMap((_, groupIndex) =>
                                defaultLogos.map((logo) => (
                                    <div key={`logo-${logo.id}-${groupIndex}`} className="flex-shrink-0 group cursor-pointer">
                                        <div className="w-24 h-24 flex items-center justify-center ">
                                            <img
                                                src={logo.src}
                                                alt={logo.alt}
                                                className="max-w-full max-h-full object-contain"
                                                onError={(e) => {
                                                    e.currentTarget.src = '/akamedia.png';
                                                }}
                                            />
                                        </div>
                                    </div>
                                ))
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default InfiniteLogoScroll;
