type TermProps = {
  label: string;
  value: string | number;
};

export const Term = ({ label, value }: TermProps) => {
  return (
    <div>
      <dt className="text-zinc-400">{label}</dt>

      <dd>{value}</dd>
    </div>
  );
};
