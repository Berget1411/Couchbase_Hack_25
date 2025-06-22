import { OtpForm } from "@/components/auth/otp-form";

export default async function Page({
  searchParams,
}: {
  searchParams: Promise<{ email: string }>;
}) {
  const { email } = await searchParams;
  return <OtpForm email={email} />;
}
