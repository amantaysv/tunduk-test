interface Props {
  exp: [string, string, string, string][];
}

function ExperienceList({ exp }: Props) {
  return (
    <ol className="relative border-l border-gray-200 ml-2 space-y-4">
      {exp.map(([period, company, role, duration], i) => (
        <li key={i} className="ml-4">
          <span className="absolute -left-1.5 mt-1.5 w-3 h-3 bg-indigo-400 rounded-full border-2 border-white" />
          <div className="flex flex-wrap items-baseline gap-x-2 gap-y-0.5">
            <span className="font-semibold text-sm text-gray-900">
              {company}
            </span>
            <span className="text-xs text-indigo-600 font-medium">{role}</span>
          </div>
          <div className="flex gap-2 text-xs text-gray-500 mt-0.5">
            <span>{period}</span>
            <span>·</span>
            <span>{duration}</span>
          </div>
        </li>
      ))}
    </ol>
  );
}

export default ExperienceList;
