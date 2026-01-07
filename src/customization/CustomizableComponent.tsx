import { useQuery } from "convex/react";
import { api } from "../../convex/_generated/api";
import { useEffect, useState, ComponentType } from "react";

type CustomizableComponentProps<P extends object> = {
  componentKey: string;
  defaultComponent: ComponentType<P>;
  props: P;
  loadingPlaceholder?: React.ReactNode;
};

/**
 * A wrapper that renders either a user's customized component or the default.
 *
 * Usage:
 * <CustomizableComponent
 *   componentKey="Grid/StudentInfo"
 *   defaultComponent={StudentInfo}
 *   props={{ student, showInitials }}
 * />
 */
export function CustomizableComponent<P extends object>({
  componentKey,
  defaultComponent: DefaultComponent,
  props,
  loadingPlaceholder,
}: CustomizableComponentProps<P>) {
  const override = useQuery(api.componentOverrides.getOverride, {
    componentKey,
  });

  const [CustomComponent, setCustomComponent] =
    useState<ComponentType<P> | null>(null);
  const [loadError, setLoadError] = useState<string | null>(null);
  const [isLoadingBundle, setIsLoadingBundle] = useState(false);
  const [hasCheckedOverride, setHasCheckedOverride] = useState(false);

  useEffect(() => {
    // Reset state when override changes
    setCustomComponent(null);
    setLoadError(null);

    if (override?.bundleUrl) {
      setIsLoadingBundle(true);

      // Construct full URL - bundleUrl is relative to Adaptations server
      const adaptationsUrl = import.meta.env.VITE_ADAPTATIONS_URL;
      const fullUrl = `${adaptationsUrl}${override.bundleUrl}`;

      // Dynamic import of the bundled component
      import(/* @vite-ignore */ fullUrl)
        .then((module) => {
          setCustomComponent(() => module.default);
          setIsLoadingBundle(false);
          setHasCheckedOverride(true);
        })
        .catch((err) => {
          console.error(
            `Failed to load custom component for ${componentKey}:`,
            err
          );
          setLoadError(err.message);
          setIsLoadingBundle(false);
          setHasCheckedOverride(true);
        });
    } else if (override === null) {
      // Query returned null - no override exists
      setHasCheckedOverride(true);
    }
  }, [override?.bundleUrl, override, componentKey]);

  // Default loading placeholder
  const placeholder = loadingPlaceholder ?? (
    <div className="animate-pulse bg-slate-200 rounded h-6 w-24" />
  );

  // Still waiting for Convex query to return
  if (override === undefined) {
    return <>{placeholder}</>;
  }

  // Override exists but bundle is still loading
  if (override?.bundleUrl && isLoadingBundle) {
    return <>{placeholder}</>;
  }

  // Error loading custom component - fallback to default
  if (loadError) {
    console.warn(
      `Using default component for ${componentKey} due to load error`
    );
    return <DefaultComponent {...props} />;
  }

  // Render custom component if loaded
  if (CustomComponent) {
    return <CustomComponent {...props} />;
  }

  // No override, render default
  return <DefaultComponent {...props} />;
}
