import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/context/AuthContext"; // Importing the Context hook

// Shadcn UI Components
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
	Card,
	CardContent,
	CardDescription,
	CardFooter,
	CardHeader,
	CardTitle,
} from "@/components/ui/card";
import {
	Form,
	FormControl,
	FormField,
	FormItem,
	FormLabel,
	FormMessage,
} from "@/components/ui/form";

// 1. Validation Schema
const loginSchema = z.object({
	email: z.string().email({ message: "Invalid email address" }),
	password: z
		.string()
		.min(6, { message: "Password must be at least 6 characters" }),
});

const LoginPage = () => {
	const [isLoading, setIsLoading] = useState(false);
	const [error, setError] = useState(""); // State to store API errors

	const navigate = useNavigate();
	const { login } = useAuth(); // Access the login function we built in Context

	// 2. Form Hook Setup
	const form = useForm({
		resolver: zodResolver(loginSchema),
		defaultValues: {
			email: "",
			password: "",
		},
	});

	// 3. The Submit Logic (Connected to API)
	const onSubmit = async (values) => {
		setIsLoading(true);
		setError(""); // Reset errors before new attempt

		try {
			// This calls the login function in AuthContext -> which calls Axios -> which calls your Backend
			const result = await login(values.email, values.password);

			if (result.success) {
				console.log("Login Success!");
				navigate("/dashboard"); // Redirect to the private route
			} else {
				// Display the specific error from the backend (e.g., "Invalid credentials")
				setError(result.error);
			}
		} catch (err) {
			setError("An unexpected error occurred.");
		} finally {
			setIsLoading(false);
		}
	};

	return (
		<div className="flex min-h-screen w-full items-center justify-center bg-muted/40 transition-all p-4">
			<Card className="w-full max-w-md shadow-2xl border-none sm:border bg-card/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
				<CardHeader className="space-y-1">
					<CardTitle className="text-3xl font-bold tracking-tight text-center text-primary">
						Panacea 🏥
					</CardTitle>
					<CardDescription className="text-center text-muted-foreground">
						Enter your credentials to access the System
					</CardDescription>
				</CardHeader>

				<CardContent>
					{/* Error Message Display Area */}
					{error && (
						<div className="mb-4 p-3 rounded-md bg-destructive/15 border border-destructive/50 text-destructive text-sm font-medium text-center">
							{error}
						</div>
					)}

					<Form {...form}>
						<form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
							{/* Email Field */}
							<FormField
								control={form.control}
								name="email"
								render={({ field }) => (
									<FormItem>
										<FormLabel>Email Address</FormLabel>
										<FormControl>
											<Input
												placeholder="doctor@hospital.com"
												{...field}
												disabled={isLoading}
											/>
										</FormControl>
										<FormMessage />
									</FormItem>
								)}
							/>

							{/* Password Field */}
							<FormField
								control={form.control}
								name="password"
								render={({ field }) => (
									<FormItem>
										<FormLabel>Password</FormLabel>
										<FormControl>
											<Input
												type="password"
												placeholder="••••••••"
												{...field}
												disabled={isLoading}
											/>
										</FormControl>
										<FormMessage />
									</FormItem>
								)}
							/>

							<Button type="submit" className="w-full" disabled={isLoading}>
								{isLoading ? "Authenticating..." : "Sign In"}
							</Button>
						</form>
					</Form>
				</CardContent>

				<CardFooter className="flex flex-col space-y-2 border-t pt-4">
					<p className="text-xs text-center text-muted-foreground">
						Protected by Hospital Resource Protocol v1.0
					</p>
				</CardFooter>
			</Card>
		</div>
	);
};

export default LoginPage;
