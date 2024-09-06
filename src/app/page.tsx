'use client'

import { useEffect, useState } from 'react';
import { Homepage } from "@/components/home";
import { isTMA, useLaunchParams } from '@telegram-apps/sdk-react';
import { LandingPage } from '@/components/landing-page';

export default function Home() {
  const [isInTelegramWebApp, setIsInTelegramWebApp] = useState(false);

  useEffect(() => {
    isTMA().then((isInTelegramWebApp) => {
      setIsInTelegramWebApp(isInTelegramWebApp);
    })
  }, []);

  if (isInTelegramWebApp) { 
    return <Homepage />;
  } else {
    return <LandingPage />;
  }
}