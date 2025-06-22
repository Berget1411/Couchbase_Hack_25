"use client";

import { useForm } from "react-hook-form";
import { otpSchema, OtpSchema } from "@/validate/auth";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import { authClient } from "@/lib/auth-client";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
  FormLabel,
} from "@/components/ui/form";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import {
  InputOTP,
  InputOTPGroup,
  InputOTPSlot,
  InputOTPSeparator,
} from "@/components/ui/input-otp";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { useEffect, useState } from "react";

export function OtpForm({ email }: { email: string }) {
  const router = useRouter();

  const [isResending, setIsResending] = useState(false);

  const form = useForm<OtpSchema>({
    resolver: zodResolver(otpSchema),
    defaultValues: {
      otp: "",
    },
  });

  const onSubmit = async (formData: OtpSchema) => {
    const { otp } = formData;
    const { data, error } = await authClient.signIn.emailOtp({
      email: email!,
      otp,
    });

    if (error) {
      toast.error(error.message);
    }

    if (data) {
      toast.success("Login successful");
      router.push("/dashboard");
    }
  };

  const handleResendCode = async () => {
    if (!email) return;

    setIsResending(true);
    const { data, error } = await authClient.emailOtp.sendVerificationOtp({
      email,
      type: "sign-in",
    });

    if (error) {
      toast.error(error.message);
    }

    if (data) {
      toast.success(`New OTP sent to ${email}`);
      form.reset({ otp: "" }); // Clear the current OTP input
    }

    setIsResending(false);
  };

  const handleBackToLogin = () => {
    router.push("/login");
  };

  // Watch for OTP changes and auto-submit when 6 digits are entered
  const otpValue = form.watch("otp");
  useEffect(() => {
    if (otpValue && otpValue.length === 6) {
      form.handleSubmit(onSubmit)();
    }
  }, [otpValue, form]); // eslint-disable-line react-hooks/exhaustive-deps

  return (
    <Card className='w-full max-w-md mx-auto'>
      <CardHeader className='text-center'>
        <CardTitle className='text-2xl font-bold'>
          Enter the code sent to your email
        </CardTitle>
        <CardDescription>
          We&apos;ve sent a code to your{" "}
          <span className='text-primary'>{email}</span>
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className='flex flex-col gap-6'
          >
            <FormField
              control={form.control}
              name='otp'
              render={({ field }) => (
                <FormItem>
                  <FormLabel>OTP</FormLabel>
                  <FormControl>
                    <div className='flex justify-center'>
                      <InputOTP maxLength={6} {...field}>
                        <InputOTPGroup>
                          <InputOTPSlot index={0} />
                          <InputOTPSlot index={1} />
                          <InputOTPSlot index={2} />
                        </InputOTPGroup>
                        <InputOTPSeparator />
                        <InputOTPGroup>
                          <InputOTPSlot index={3} />
                          <InputOTPSlot index={4} />
                          <InputOTPSlot index={5} />
                        </InputOTPGroup>
                      </InputOTP>
                    </div>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className='flex flex-col gap-3'>
              <Button
                type='button'
                variant='outline'
                onClick={handleResendCode}
                disabled={isResending}
                className='w-full'
              >
                {isResending ? "Sending..." : "Resend Code"}
              </Button>

              <Button
                type='button'
                variant='ghost'
                onClick={handleBackToLogin}
                className='w-full'
              >
                Back to Login
              </Button>
            </div>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
}
