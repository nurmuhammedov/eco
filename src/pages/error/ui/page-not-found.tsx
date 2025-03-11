import Icon from '@/shared/components/common/icon';

export default function Error() {
  return (
    <div className="h-screen flex flex-col items-center justify-center">
      <Icon name="page-not-found" className="size-64" />
      <h2 className="text-2xl font-semibold text-amber-500">Page not found</h2>
    </div>
  );
}
