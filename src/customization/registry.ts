/**
 * Component Registry
 *
 * Defines which components are customizable and provides metadata for the AI.
 * The source code is stored here so it can be sent to the Adaptations API.
 */

export type ComponentRegistryEntry = {
  key: string;
  description: string;
  sourceCode: string;
};

// StudentInfo component source (converted to JSX for the AI)
const STUDENT_INFO_SOURCE = `const StudentInfo = ({ student, showInitials }) => {
  const initials = student.firstName.charAt(0) + student.lastName.charAt(0);

  return (
    <div className="flex items-center gap-2 pl-2 justify-start">
      {showInitials && (
        <div className="w-8 h-8 bg-sky-500 rounded-full flex items-center justify-center shrink-0">
          <span className="text-white text-sm font-semibold">{initials}</span>
        </div>
      )}
      <div className="flex gap-1">
        <span className="font-medium text-slate-700 whitespace-nowrap overflow-hidden text-ellipsis">
          {student.firstName}
        </span>
        <span className="text-slate-500 whitespace-nowrap overflow-hidden text-ellipsis">
          {student.lastName}
        </span>
      </div>
    </div>
  );
};

export default StudentInfo;`;

export const COMPONENT_REGISTRY: ComponentRegistryEntry[] = [
  {
    key: "Grid/StudentInfo",
    description:
      "Displays a student's name and optional avatar/initials in the gradebook grid. Receives 'student' (with firstName, lastName) and 'showInitials' (boolean) as props.",
    sourceCode: STUDENT_INFO_SOURCE,
  },
];

/**
 * Get a component from the registry by key
 */
export function getComponentEntry(
  key: string
): ComponentRegistryEntry | undefined {
  return COMPONENT_REGISTRY.find((c) => c.key === key);
}

/**
 * Get the registry formatted for the Adaptations API
 * If the user has existing overrides, uses their source code instead of default
 */
export function getRegistryForApi(
  overrides: Array<{ componentKey: string; sourceCode: string }> = []
): Array<{ key: string; description: string; source_code: string }> {
  return COMPONENT_REGISTRY.map((entry) => {
    // Check if user has an override for this component
    const override = overrides.find((o) => o.componentKey === entry.key);

    return {
      key: entry.key,
      description: entry.description,
      source_code: override?.sourceCode || entry.sourceCode,
    };
  });
}
