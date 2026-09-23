import SignupForm from '@/components/forms/SignupForm';

export default function SignupPage() {
  return (
    <main className="p-8">
      <h1 className="text-3xl font-bold mb-6">
        Create Account
      </h1>

      <SignupForm />
    </main>
  );
}