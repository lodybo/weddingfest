import Icon from '~/components/Icon';

type Props = {
  onRefresh: () => void;
};

export default function RefreshButton({ onRefresh }: Props) {
  return (
    <div className="">
      <button className="h-full w-full p-2" onClick={onRefresh}>
        <Icon name="arrows-rotate" />
      </button>
    </div>
  );
}
