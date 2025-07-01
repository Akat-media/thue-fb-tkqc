'use client';

import { useEffect, useRef, useState } from 'react';
import Navbar from '../../components/layout/Navbar';
import IntroSection from './IntroSection';
import { Card, CardContent } from '../../components/ui/Card';
import { ChevronRight, Clock, DollarSign, Shield } from 'lucide-react';
import { Link } from 'react-router-dom';
import Button from '../../components/ui/Button';
import Counter from '../../components/ui/Counter';
import metalogo from '../../public/metalogo.png';
import InfiniteLogoScroll from '../home/InfiniteLogoScroll';
import Blog from "../home/Blog.tsx";
import WhyChoose from "../home/WhyChoose.tsx";
import Price from "../home/Price.tsx";

export default function MainHero() {
  const [isHomePage] = useState(true);

  return (
    <div className="">
      <div
        className="min-h-[500px] lg:min-h-[800px] relative overflow-hidden font-[Helvetica,Arial,sans-serif]"
        style={{
          backgroundImage: "url('/homepage/header/background.jpg')",
          backgroundSize: 'cover',
          backgroundPosition: 'center center',
          backgroundRepeat: 'no-repeat',
          backgroundAttachment: 'scroll',
        }}
      >
        <Navbar isHomePage={isHomePage} />
        <IntroSection />
      </div>

      {/*why choose*/}
      <WhyChoose />

      {/*price */}
      <Price />

      {/*image logo*/}
      <InfiniteLogoScroll />

      {/*blog*/}
      <Blog />

    </div>
  );
}
