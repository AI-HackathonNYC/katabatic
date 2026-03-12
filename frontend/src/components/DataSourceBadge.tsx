interface Props {
  source: string
}

export function DataSourceBadge({ source }: Props) {
  const styles: Record<string, string> = {
    live: 'bg-[#00b894]/12 text-[#00b894]',
    cache: 'bg-[#e17055]/12 text-[#e17055]',
    fixture: 'bg-[#888]/12 text-[#888]',
  }

  return (
    <span className={`text-[10px] font-semibold uppercase tracking-wider px-2 py-0.5 rounded-full ${styles[source] || styles.fixture}`}>
      {source}
    </span>
  )
}
