import { useEffect, useRef } from 'react';
import Icon from '~/components/Icon';

type IOSNavigator = Navigator & {
  standalone?: boolean;
};

export default function RefreshButton() {
  let standalone = useRef<boolean | undefined>();

  useEffect(() => {
    standalone.current =
      (navigator as IOSNavigator).standalone ||
      window.matchMedia('(display-mode: standalone)').matches;
  }, []);

  if (standalone) {
    return null;
  }

  return (
    <div className="">
      <button
        className="h-full w-full p-2"
        onClick={() => window.location.reload()}
      >
        <Icon name="arrows-rotate" />
      </button>
    </div>
  );
}
