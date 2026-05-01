interface Props {
  current: number;
  max: number;
}

export function CharCount({ current, max }: Props) {
  const over = current > max;
  const near = current >= max * 0.9;
  return (
    <span
      className={`char-count ${over ? 'over' : near ? 'near' : ''}`}
      style={{
        fontSize: '0.75rem',
        color: over ? '#ef4444' : near ? '#f59e0b' : '#6b7280',
        fontWeight: over ? 600 : 400,
      }}
    >
      {current}/{max}
    </span>
  );
}
