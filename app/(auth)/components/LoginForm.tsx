"use client"

import Link from "next/link"
import { login } from "@/actions/auth"
import { useServerAction } from "zsa-react"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { PasswordInput } from "@/components/ui/password-input"
import { Separator } from "@/components/ui/separator"
import { FormError } from "@/components/shared/form-error"

export function LoginForm() {
  const logInAction = useServerAction(login)

  return (
    <div className="container max-w-sm space-y-3 rounded-md border p-6">
      <p className="text-center text-muted-foreground">
        Log in to your account
      </p>
      <form className="space-y-4" action={logInAction.executeFormAction}>
        <div>
          <Label>Email</Label>
          <Input
            type="email"
            placeholder="youremail@example.com"
            name="email"
          />
        </div>
        <div>
          <Label>Password</Label>
          <PasswordInput name="password" id="password" />
        </div>
        {logInAction.isError ? (
          <FormError error={logInAction.error.message} />
        ) : null}
        <div className="pt-6">
          <Button className="w-full">
            {logInAction.isPending ? "Please wait..." : "Sign In"}
          </Button>
        </div>
      </form>
      <div className="relative hidden py-4">
        <Separator />
        <span className="absolute left-1/2 top-2.5 -translate-x-1/2 -translate-y-1.5 bg-background px-1 text-sm">
          or continue with
        </span>
      </div>
      <p className="pt-4 text-center text-sm">
        No account yet?{" "}
        <Link
          href="/register"
          className="font-medium text-primary hover:underline"
        >
          Create an Account
        </Link>
      </p>
    </div>
  )
}
