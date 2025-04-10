
import { Metadata } from 'next';
import { Redirect } from "@/components/Redirect";

export const metadata: Metadata = {
  title: 'Accessibility Tools Home',
  description: 'Welcome to our text processing and accessibility tools',
};

export default function Page() {
  return <Redirect to="/app" />;
}
