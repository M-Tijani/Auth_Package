"use client";

import { useState } from "react";
import { signIn, SessionProvider } from "next-auth/react";
import { useForm, SubmitHandler } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import * as z from "zod";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { FaGoogle } from "react-icons/fa";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  CardFooter,
} from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Separator } from "@/components/ui/separator";
import { Loader2, Eye, EyeOff } from "lucide-react";
import Link from "next/link";
import axios from "axios";

const signInSchema = z.object({
  email: z.string().email("Invalid email address").min(1, "Email is required"),
  password: z.string().min(1, "Password is required"),
});

const signUpSchema = z
  .object({
    email: z
      .string()
      .email("Invalid email address")
      .min(1, "Email is required"),
    password: z.string().min(8, "Password must be at least 8 characters"),
    confirmPassword: z.string().min(1, "Confirm your password"),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords don't match",
    path: ["confirmPassword"],
  });

type SignInFormInputs = z.infer<typeof signInSchema>;
type SignUpFormInputs = z.infer<typeof signUpSchema>;

function AuthForm() {
  const [isSignIn, setIsSignIn] = useState(true);
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isGoogleLoading, setIsGoogleLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const router = useRouter();

  const signInForm = useForm<SignInFormInputs>({
    resolver: zodResolver(signInSchema),
  });

  const signUpForm = useForm<SignUpFormInputs>({
    resolver: zodResolver(signUpSchema),
  });

  const onSignInSubmit: SubmitHandler<SignInFormInputs> = async (data) => {
    setIsLoading(true);
    setError("");
    try {
      const result = await signIn("credentials", {
        redirect: false,
        email: data.email,
        password: data.password,
      });

      if (result?.error) {
        setError(
          result.error === "CredentialsSignin"
            ? "Invalid email or password"
            : result.error
        );
        setIsLoading(false);
      } else {
        router.push("/dashboard");
      }
    } catch (error) {
      setIsLoading(false);
      setError(error instanceof Error ? error.message : "An error occurred.");
    }
  };

  const onSignUpSubmit: SubmitHandler<SignUpFormInputs> = async (data) => {
    setIsLoading(true);
    setError("");
    try {
      const response = await axios.post("/api/auth/sign-up", data);
      if (response.status === 201) {
        await signIn("credentials", {
          redirect: false,
          email: data.email,
          password: data.password,
        });
        router.push("/dashboard");
      }
    } catch (error: any | Error) {
      setError(error.response.data.error);
      setIsLoading(false);
    }
  };

  const handleGoogleSignIn = async () => {
    setIsGoogleLoading(true);
    setError("");
    try {
      const result = await signIn("google", { callbackUrl: "/dashboard" });
      if (result?.error) {
        setError("Failed to sign in with Google. Please try again.");
      }
    } catch (error) {
      setError(error instanceof Error ? error.message : "An error occurred.");
      setIsGoogleLoading(false);
    }
  };

  return (
    <Card className="w-full max-w-md overflow-hidden">
      <CardHeader>
        <CardTitle>{isSignIn ? "Sign In" : "Sign Up"}</CardTitle>
        <CardDescription>
          {isSignIn
            ? "Enter your email and password to sign in"
            : "Create a new account"}
        </CardDescription>
      </CardHeader>
      <CardContent>
        {error && (
          <Alert variant="destructive" className="mb-4">
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}
        <AnimatePresence mode="wait">
          <motion.div
            key={isSignIn ? "signin" : "signup"}
            initial={{ opacity: 0, x: isSignIn ? -20 : 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: isSignIn ? 20 : -20 }}
            transition={{ duration: 0.2 }}
          >
            {isSignIn ? (
              <form
                onSubmit={signInForm.handleSubmit(onSignInSubmit)}
                className="space-y-4"
              >
                <div className="space-y-2">
                  <Label htmlFor="signin-email">Email</Label>
                  <Input
                    id="signin-email"
                    type="email"
                    {...signInForm.register("email")}
                    placeholder="Enter your email"
                    aria-invalid={
                      signInForm.formState.errors.email ? "true" : "false"
                    }
                  />
                  {signInForm.formState.errors.email && (
                    <p className="text-sm text-destructive">
                      {signInForm.formState.errors.email.message}
                    </p>
                  )}
                </div>
                <div className="space-y-2">
                  <Label htmlFor="signin-password">Password</Label>
                  <div className="relative">
                    <Input
                      id="signin-password"
                      type={showPassword ? "text" : "password"}
                      {...signInForm.register("password")}
                      placeholder="Enter your password"
                      aria-invalid={
                        signInForm.formState.errors.password ? "true" : "false"
                      }
                    />
                    <Button
                      type="button"
                      variant="ghost"
                      size="icon"
                      className="absolute right-2 top-1/2 -translate-y-1/2"
                      onClick={() => setShowPassword(!showPassword)}
                    >
                      {showPassword ? (
                        <EyeOff className="h-4 w-4" />
                      ) : (
                        <Eye className="h-4 w-4" />
                      )}
                      <span className="sr-only">
                        {showPassword ? "Hide password" : "Show password"}
                      </span>
                    </Button>
                  </div>
                  {signInForm.formState.errors.password && (
                    <p className="text-sm text-destructive">
                      {signInForm.formState.errors.password.message}
                    </p>
                  )}
                </div>
                <Button type="submit" className="w-full" disabled={isLoading}>
                  {isLoading ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Signing In...
                    </>
                  ) : (
                    "Sign In"
                  )}
                </Button>
              </form>
            ) : (
              <form
                onSubmit={signUpForm.handleSubmit(onSignUpSubmit)}
                className="space-y-4"
              >
                <div className="space-y-2">
                  <Label htmlFor="signup-email">Email</Label>
                  <Input
                    id="signup-email"
                    type="email"
                    {...signUpForm.register("email")}
                    placeholder="Enter your email"
                    aria-invalid={
                      signUpForm.formState.errors.email ? "true" : "false"
                    }
                  />
                  {signUpForm.formState.errors.email && (
                    <p className="text-sm text-destructive">
                      {signUpForm.formState.errors.email.message}
                    </p>
                  )}
                </div>
                <div className="space-y-2">
                  <Label htmlFor="signup-password">Password</Label>
                  <div className="relative">
                    <Input
                      id="signup-password"
                      type={showPassword ? "text" : "password"}
                      {...signUpForm.register("password")}
                      placeholder="Enter your password"
                      aria-invalid={
                        signUpForm.formState.errors.password ? "true" : "false"
                      }
                    />
                    <Button
                      type="button"
                      variant="ghost"
                      size="icon"
                      className="absolute right-2 top-1/2 -translate-y-1/2"
                      onClick={() => setShowPassword(!showPassword)}
                    >
                      {showPassword ? (
                        <EyeOff className="h-4 w-4" />
                      ) : (
                        <Eye className="h-4 w-4" />
                      )}
                      <span className="sr-only">
                        {showPassword ? "Hide password" : "Show password"}
                      </span>
                    </Button>
                  </div>
                  {signUpForm.formState.errors.password && (
                    <p className="text-sm text-destructive">
                      {signUpForm.formState.errors.password.message}
                    </p>
                  )}
                </div>
                <div className="space-y-2">
                  <Label htmlFor="signup-confirm-password">
                    Confirm Password
                  </Label>
                  <div className="relative">
                    <Input
                      id="signup-confirm-password"
                      type={showConfirmPassword ? "text" : "password"}
                      {...signUpForm.register("confirmPassword")}
                      placeholder="Confirm your password"
                      aria-invalid={
                        signUpForm.formState.errors.confirmPassword
                          ? "true"
                          : "false"
                      }
                    />
                    <Button
                      type="button"
                      variant="ghost"
                      size="icon"
                      className="absolute right-2 top-1/2 -translate-y-1/2"
                      onClick={() =>
                        setShowConfirmPassword(!showConfirmPassword)
                      }
                    >
                      {showConfirmPassword ? (
                        <EyeOff className="h-4 w-4" />
                      ) : (
                        <Eye className="h-4 w-4" />
                      )}
                      <span className="sr-only">
                        {showConfirmPassword
                          ? "Hide password"
                          : "Show password"}
                      </span>
                    </Button>
                  </div>
                  {signUpForm.formState.errors.confirmPassword && (
                    <p className="text-sm text-destructive">
                      {signUpForm.formState.errors.confirmPassword.message}
                    </p>
                  )}
                </div>
                <Button type="submit" className="w-full" disabled={isLoading}>
                  {isLoading ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Signing Up...
                    </>
                  ) : (
                    "Sign Up"
                  )}
                </Button>
              </form>
            )}
          </motion.div>
        </AnimatePresence>
        <div className="mt-4">
          <Button variant="outline" className="w-full" asChild>
            <Link href="/sent-email-reset">Forgot Password?</Link>
          </Button>
        </div>
      </CardContent>
      <CardFooter className="flex flex-col gap-2">
        <div className="flex items-center justify-center gap-4 ">
          <Separator className="flex-grow" />
          <span className="text-nowrap">Or continue with</span>
          <Separator className="flex-grow" />
        </div>
        <Button
          variant="outline"
          className="w-full"
          onClick={handleGoogleSignIn}
          disabled={isGoogleLoading}
        >
          {isGoogleLoading ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Signing In with Google...
            </>
          ) : (
            <>
              <FaGoogle className="mr-2 h-4 w-4" />
              Sign In with Google
            </>
          )}
        </Button>
        <p className="mt-4 text-center text-sm text-muted-foreground">
          {isSignIn ? "Don't have an account?" : "Already have an account?"}{" "}
          <Button
            variant="link"
            className="p-0 h-auto font-medium text-primary hover:underline"
            onClick={() => setIsSignIn(!isSignIn)}
          >
            {isSignIn ? "Sign up" : "Sign in"}
          </Button>
        </p>
      </CardFooter>
    </Card>
  );
}

export default function Component() {
  return (
    <SessionProvider>
      <div className="min-h-screen flex items-center justify-center bg-gray-100 p-4">
        <AuthForm />
      </div>
    </SessionProvider>
  );
}
