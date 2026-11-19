const messages = [
  'Sample catalogue · Original Mithila-inspired illustrations',
  'Prices shown in INR · No live payment is taken',
  'Curated art for thoughtful spaces',
];

export default function AnnouncementBar() {
  return (
    <div className="bg-indigoDeep text-ivory">
      <div className="mx-auto flex max-w-[1320px] items-center justify-center px-5 py-2.5">
        <p className="text-center font-sans text-[9px] uppercase tracking-wide2 sm:text-[10px]">
          <span className="hidden sm:inline">{messages[0]} &nbsp;·&nbsp; </span>
          <span>{messages[1]}</span>
        </p>
      </div>
    </div>
  );
}
