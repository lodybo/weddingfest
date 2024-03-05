import Icon from '~/components/Icon';

type Props = {
  fullScreen: boolean;
  setFullScreen: (fullScreen: boolean) => void;
};

export default function ResizeButton({ fullScreen, setFullScreen }: Props) {
  return (
    <button onClick={() => setFullScreen(!fullScreen)}>
      <Icon name={fullScreen ? 'minimize' : 'maximize'} />
    </button>
  );
}
