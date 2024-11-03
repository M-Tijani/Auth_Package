"use client";

import { useState } from "react";
import axios from "axios";
import { useForm, SubmitHandler } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { Loader2 } from "lucide-react";
import Link from "next/link";

const schema = z.object({
  email: z.string().email("Invalid email address").min(1, "Email is required"),
});

type ResetPassword = z.infer<typeof schema>;

export default function PasswordReset() {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<ResetPassword>({
    resolver: zodResolver(schema),
  });
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);

  const onSubmit: SubmitHandler<ResetPassword> = async (data) => {
    setIsLoading(true);

    try {
      const response = await axios.post("/api/auth/sent-email-reset", {
        email: data.email,
      });

      if (response.status === 200) {
        toast({
          title: "Success!",
          description: "Password reset link has been sent to your email.",
        });
        reset();
        setIsLoading(false);
      }
    } catch (err: any | Error) {
      toast({
        title: "Failure!",
        description: err.response.data.message,
      });
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 p-4">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle>Reset Password</CardTitle>
          <CardDescription>
            Enter your email to receive a password reset link
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                {...register("email")}
                placeholder="Enter your email"
                aria-invalid={errors.email ? "true" : "false"}
                aria-describedby={errors.email ? "email-error" : undefined}
              />
              {errors.email && (
                <p
                  id="email-error"
                  className="text-sm text-destructive"
                  aria-live="polite"
                >
                  {errors.email.message}
                </p>
              )}
            </div>
            <Button type="submit" className="w-full" disabled={isLoading}>
              {isLoading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Sending...
                </>
              ) : (
                "Send Reset Email"
              )}
            </Button>
          </form>
        </CardContent>
        <CardFooter className="flex justify-center">
          <Button variant="link" asChild>
            <Link href="/sign-in">Back to Sign In</Link>
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
}
