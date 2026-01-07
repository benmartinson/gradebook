import { useMutation, useQuery } from "convex/react";
import { api } from "../../convex/_generated/api";
import { useState } from "react";
import { getRegistryForApi } from "./registry";

const ADAPTATIONS_URL = import.meta.env.VITE_ADAPTATIONS_URL;

type GenerateResponse = {
  component_key: string;
  bundle_url: string;
  source_code: string;
};

export function useCustomization() {
  const [isGenerating, setIsGenerating] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const overrides = useQuery(api.componentOverrides.getMyOverrides) ?? [];
  const saveOverride = useMutation(api.componentOverrides.saveOverride);

  const requestCustomization = async (userPrompt: string): Promise<boolean> => {
    setIsGenerating(true);
    setError(null);

    try {
      // Get registry with user's existing overrides
      const registry = getRegistryForApi(overrides);

      const response = await fetch(`${ADAPTATIONS_URL}/api/generator/component`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          user_prompt: userPrompt,
          app_name: "gradebook",
          registry,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Failed to generate component");
      }

      const data: GenerateResponse = await response.json();

      // Save the override to Convex
      await saveOverride({
        componentKey: data.component_key,
        bundleUrl: data.bundle_url,
        sourceCode: data.source_code,
      });

      setIsGenerating(false);
      return true;
    } catch (err) {
      const message = err instanceof Error ? err.message : "Unknown error";
      setError(message);
      setIsGenerating(false);
      return false;
    }
  };

  return {
    requestCustomization,
    isGenerating,
    error,
    overrides,
  };
}
