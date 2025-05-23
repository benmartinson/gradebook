import { useAuthActions } from "@convex-dev/auth/react";
import { useState } from "react";

interface SignUpFormProps {
  setFlow: (flow: "signIn" | "signUp" | "resetPassword") => void;
}

const SignUpForm = ({ setFlow }: SignUpFormProps) => {
  const { signIn } = useAuthActions();
  const [error, setError] = useState<string | null>(null);

  return (
    <form
      className="flex flex-col gap-2"
      onSubmit={(e) => {
        e.preventDefault();
        const formData = new FormData(e.target as HTMLFormElement);
        formData.set("flow", "signUp");
        void signIn("password", formData).catch((error) => {
          setError(error.message);
        });
      }}
    >
      <input
        className="bg-white text-dark rounded-md p-2 border-2 border-slate-200 dark:border-slate-800"
        type="email"
        name="email"
        placeholder="Email"
        required
      />
      <input
        className="bg-white text-dark rounded-md p-2 border-2 border-slate-200 dark:border-slate-800"
        type="password"
        name="password"
        placeholder="Password"
        required
      />
      <button className="bg-slate-700 text-white rounded-md py-2" type="submit">
        Sign up
      </button>
      <div className="flex flex-row gap-2">
        <span>Already have an account?</span>
        <span
          className="text-dark dark:text-light underline hover:no-underline cursor-pointer"
          onClick={() => setFlow("signIn")}
        >
          Sign in instead
        </span>
      </div>
      {error && (
        <div className="bg-red-500/20 border-2 border-red-500/50 rounded-md p-2">
          <p className="text-dark dark:text-light font-mono text-xs">
            Error signing up: {error}
          </p>
        </div>
      )}
    </form>
  );
};

export default SignUpForm;
