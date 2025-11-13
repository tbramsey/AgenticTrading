import {
  Field,
  FieldDescription,
  FieldGroup,
  FieldLabel,
  FieldSet,
} from "@/components/ui/field"
import { Input } from "@/components/ui/input"   

export default function LoginScreen() {
    return (
    <div className="w-full max-w-md p-8 bg-gray-50 rounded-lg shadow-lg">
        <h2 className="text-2xl font-semibold text-center mb-6">
        Welcome Back 👋
        </h2>

        <FieldSet>
        <FieldGroup>
            <Field>
            <FieldLabel htmlFor="username">Username</FieldLabel>
            <Input id="username" type="text" placeholder="username" />
            <FieldDescription>
                Choose a unique username for your account.
            </FieldDescription>
            </Field>

            <Field>
            <FieldLabel htmlFor="password">Password</FieldLabel>
            <FieldDescription>
                Must be at least 8 characters long.
            </FieldDescription>
            <Input id="password" type="password" placeholder="••••••••" />
            </Field>
        </FieldGroup>
        </FieldSet>

        <button className="w-full mt-6 bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded">
        Log In
        </button>

        <p className="text-center text-sm text-gray-500 mt-4">
        Don’t have an account? <a href="#" className="text-blue-600 hover:underline">Sign up</a>
        </p>
    </div>);
}

