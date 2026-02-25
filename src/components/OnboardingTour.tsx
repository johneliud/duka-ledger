import { useEffect, useState } from 'react';
import Joyride, { type CallBackProps, STATUS } from 'react-joyride';
import { getTourSteps } from '../lib/tourSteps';
import { useAuth } from '../hooks/useAuth';

export function OnboardingTour() {
  const { user } = useAuth();
  const [run, setRun] = useState(false);

  useEffect(() => {
    if (user) {
      const hasSeenTour = localStorage.getItem(`tour_completed_${user.id}`);
      if (!hasSeenTour) {
        setTimeout(() => setRun(true), 500);
      }
    }
  }, [user]);

  const handleJoyrideCallback = (data: CallBackProps) => {
    const { status } = data;
    const finishedStatuses: string[] = [STATUS.FINISHED, STATUS.SKIPPED];

    if (finishedStatuses.includes(status) && user) {
      localStorage.setItem(`tour_completed_${user.id}`, 'true');
      setRun(false);
    }
  };

  return (
    <Joyride
      steps={getTourSteps()}
      run={run}
      continuous
      showProgress
      showSkipButton
      callback={handleJoyrideCallback}
      styles={{
        options: {
          primaryColor: '#c4622d',
          zIndex: 10000,
        },
      }}
    />
  );
}
