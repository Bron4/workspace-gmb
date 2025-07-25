import { useState } from "react"
import { useForm } from "react-hook-form"
import { useNavigate } from "react-router-dom"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  CardFooter,
} from "@/components/ui/card"
import { useToast } from "@/hooks/useToast"
import {
  UserPlus
} from "lucide-react"
import { useAuth } from "@/contexts/AuthContext"

type RegisterForm = {
  email: string
  password: string
}

export function Register() {
  console.log("Register.tsx: Register component rendering");
  const [loading, setLoading] = useState(false)
  const { toast } = useToast()
  const { register: registerUser } = useAuth()
  const navigate = useNavigate()
  const { register, handleSubmit } = useForm<RegisterForm>()

  const onSubmit = async (data: RegisterForm) => {
    console.log("Register.tsx: Form submission started with data:", { email: data.email, passwordLength: data.password?.length });
    try {
      setLoading(true)
      console.log("Register.tsx: Calling registerUser function");
      await registerUser(data.email, data.password);
      console.log("Register.tsx: Registration successful, showing toast");
      toast({
        title: "Success",
        description: "Account created successfully",
      })
      console.log("Register.tsx: Navigating to /login");
      navigate("/login")
      console.log("Register.tsx: Navigation to /login completed");
    } catch (error) {
      console.error("Register.tsx: Registration error:", error)
      console.log("Register.tsx: Showing error toast with message:", error?.message)
      toast({
        variant: "destructive",
        title: "Error",
        description: error?.message,
      })
    } finally {
      console.log("Register.tsx: Setting loading to false");
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-background to-secondary p-4">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle>Create an account</CardTitle>
          <CardDescription>Enter your details to get started</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                placeholder="Enter your email"
                {...register("email", { required: true })}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="password">Password</Label>
              <Input
                id="password"
                type="password"
                placeholder="Choose a password"
                {...register("password", { required: true })}
              />
            </div>
            <Button type="submit" className="w-full" disabled={loading}>
              {loading ? (
                "Loading..."
              ) : (
                <>
                  <UserPlus className="mr-2 h-4 w-4" />
                  Create Account
                </>
              )}
            </Button>
          </form>
        </CardContent>
        <CardFooter className="flex justify-center">
          <Button
            variant="link"
            className="text-sm text-muted-foreground"
            onClick={() => {
              console.log("Register.tsx: Navigating to /login via link");
              navigate("/login")
            }}
          >
            Already have an account? Sign in
          </Button>
        </CardFooter>
      </Card>
    </div>
  )
}