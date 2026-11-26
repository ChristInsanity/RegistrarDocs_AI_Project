import type { Metadata } from "next";
import { AuthPlaceholderView } from "@/components/ui/AuthPlaceholderView";

export const metadata: Metadata = {
  title: "Login (Upcoming) | RegistrarDocs AI",
  description:
    "Temporary login route placeholder for RegistrarDocs AI. Account authentication will be implemented in an upcoming development milestone.",
};

export default function LoginPage() {
  return (
    <AuthPlaceholderView
      badge="Upcoming Feature"
      title="Portal Login Is Being Prepared"
      description="Account sign-in for students, alumni, and Registrar's Office staff is not yet active. This route is reserved so portal navigation remains consistent during early development."
      milestoneNote="The current milestone covers the project foundation and public landing page. Authentication and account access are planned for the next development milestone."
      alternateLabel="View Register Page"
      alternateHref="/register"
      alternatePrompt="Looking to create a requester account?"
    />
  );
}
