"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useForm } from "react-hook-form";
import { loginSchema, LoginSchema } from "@/validate/auth";
import { zodResolver } from "@hookform/resolvers/zod";
import { FaGoogle } from "react-icons/fa";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { authClient } from "@/lib/auth-client";
import { toast } from "sonner";
import { redirect } from "next/navigation";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";

export function LoginForm() {
  const form = useForm<LoginSchema>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: "",
    },
  });

  const onSubmit = async (formData: LoginSchema) => {
    const { email } = formData;
    const { data, error } = await authClient.emailOtp.sendVerificationOtp({
      email,
      type: "sign-in",
    });

    if (error) {
      toast.error(error.message);
    }

    if (data) {
      toast.success(`OTP sent to ${email}`);
      redirect(`/otp?email=${email}`);
    }
  };

  return (
    <Card className='w-full max-w-md mx-auto'>
      <CardHeader className='text-center'>
        <CardTitle className='text-2xl font-bold'>Welcome back</CardTitle>
        <CardDescription>
          Let&apos;s continue your learning journey.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)}>
            <div className='grid gap-6'>
              <div className='grid gap-3'>
                <FormField
                  control={form.control}
                  name='email'
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Email</FormLabel>
                      <FormControl>
                        <Input
                          {...field}
                          placeholder='m@example.com'
                          required
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <Button type='submit' className='w-full'>
                Continue
              </Button>
              <div className='after:border-border relative text-center text-sm after:absolute after:inset-0 after:top-1/2 after:z-0 after:flex after:items-center after:border-t'>
                <span className='bg-background text-muted-foreground relative z-10 px-2'>
                  Or continue with
                </span>
              </div>
              <Button variant='outline' className='w-full py-5'>
                <FaGoogle />
                Continue with Google
              </Button>
            </div>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
}
