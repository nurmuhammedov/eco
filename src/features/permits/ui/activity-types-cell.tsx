/**
 * A permit's activity types. The names are long and carry commas of their own,
 * so several are never joined into one string: each gets a numbered line,
 * clamped, with the full text in its tooltip.
 */
export const ActivityTypesCell = ({ names }: { names?: string[] | null }) => {
  const items = (names ?? []).map((name) => name.trim()).filter(Boolean)

  if (!items.length) return <span className="text-neutral-400">—</span>

  if (items.length === 1) {
    return (
      <span className="line-clamp-3 whitespace-normal" title={items[0]}>
        {items[0]}
      </span>
    )
  }

  return (
    <ol className="flex flex-col gap-1">
      {items.map((name, index) => (
        <li key={`${index}-${name}`} className="line-clamp-2 whitespace-normal" title={name}>
          {index + 1}. {name}
        </li>
      ))}
    </ol>
  )
}
