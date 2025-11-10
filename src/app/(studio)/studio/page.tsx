import { redirect } from 'next/navigation';

export default function StudioPage() {
  // Redirect to studio-home under settings
  redirect('/studio/settings/studio-home');
}
