interface Props {
  source: string
}

export function DataSourceBadge({ source }: Props) {
  const styles: Record<string, string> = {
    live: 'bg-[#a29bfe]/12 text-[#a29bfe]',
    cache: 'bg-[#6c5ce7]/12 text-[#6c5ce7]',
    fixture: 'bg-[#888]/12 text-[#888]',
  }

  return (
    <span className={`text-[10px] font-semibold uppercase tracking-wider px-2 py-0.5 rounded-full ${styles[source] || styles.fixture}`}>
      {source}
    </span>
  )
}
