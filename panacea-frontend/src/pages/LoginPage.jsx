import React, { useState } from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import * as z from "zod"
import { useNavigate } from "react-router-dom"
import { useAuth } from "@/context/AuthContext"
import { toast } from "sonner"
import { Stethoscope, ArrowLeft, Loader2 } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
	Form,
	FormControl,
	FormField,
	FormItem,
	FormLabel,
	FormMessage,
} from "@/components/ui/form"

// Import your Asset
import panaceaHero from "@/img/panacea_landing_page.png"

const loginSchema = z.object({
	email: z.string().email({ message: "Invalid email address" }),
	password: z.string().min(1, { message: "Password is required" }),
})

const LoginPage = () => {
	const [isLoading, setIsLoading] = useState(false)
	const navigate = useNavigate()
	const { login } = useAuth()

	const form = useForm({
		resolver: zodResolver(loginSchema),
		defaultValues: {
			email: "",
			password: "",
		},
	})

	const onSubmit = async (values) => {
		setIsLoading(true)
		try {
			const result = await login(values.email, values.password)
			if (result.success) {
				toast.success("Welcome Back", { description: "Session authorized securely." })
				navigate("/dashboard")
			} else {
				// Toast automatically handles UI feedback
				toast.error("Access Denied", { description: result.error })
			}
		} catch (err) {
			toast.error("System Error", { description: "Connection interrupted." })
		} finally {
			setIsLoading(false)
		}
	}

	return (
		<div className="w-full h-screen lg:grid lg:grid-cols-2 bg-background">

			{/* LEFT: VISUALS (Visible on Large Screens) */}
			<div className="hidden lg:flex relative h-full flex-col p-10 text-white dark:border-r border-zinc-800">

				{/* Background Image Layer */}
				<div className="absolute inset-0 bg-zinc-900">
					<img
						src={panaceaHero}
						alt="Panacea Background"
						className="w-full h-full object-cover opacity-40 mix-blend-overlay grayscale-[20%]"
					/>
					{/* Gradient Overlay for Text Readability */}
					<div className="absolute inset-0 bg-gradient-to-t from-zinc-900 via-zinc-900/50 to-transparent" />
				</div>

				{/* Branding */}
				<div className="relative z-20 flex items-center gap-2 text-lg font-bold">
					<div className="p-1.5 bg-emerald-500 rounded-md">
						<Stethoscope className="w-5 h-5 text-white" />
					</div>
					Panacea EMR
				</div>

				{/* Testimonial/Context */}
				<div className="relative z-20 mt-auto">
					<blockquote className="space-y-2">
						<p className="text-lg">
							&ldquo;The integrity of our patient data and the efficiency of our triage units have increased by 400% since adopting Panacea's architecture.&rdquo;
						</p>
						<footer className="text-sm font-medium text-zinc-400">Dr. Amina Yusuf — Chief of Medicine, City Hospital</footer>
					</blockquote>
				</div>
			</div>

			{/* RIGHT: FORM */}
			<div className="flex flex-col h-full items-center justify-center p-8 lg:p-8 animate-in fade-in slide-in-from-right-10 duration-700">

				<div className="absolute top-4 left-4 lg:top-8 lg:left-auto lg:right-8">
					<Button variant="ghost" onClick={() => navigate("/")} className="text-muted-foreground hover:text-primary">
						<ArrowLeft className="mr-2 h-4 w-4" /> Back to Home
					</Button>
				</div>

				<div className="mx-auto flex w-full flex-col justify-center space-y-6 sm:w-[350px]">
					<div className="flex flex-col space-y-2 text-center">
						<h1 className="text-3xl font-semibold tracking-tight">Staff Access</h1>
						<p className="text-sm text-muted-foreground">
							Enter your medical credentials below
						</p>
					</div>

					<Form {...form}>
						<form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
							<FormField
								control={form.control}
								name="email"
								render={({ field }) => (
									<FormItem>
										<FormLabel>Email</FormLabel>
										<FormControl>
											<Input placeholder="doctor@hospital.com" {...field} className="h-11 bg-muted/30" disabled={isLoading} />
										</FormControl>
										<FormMessage />
									</FormItem>
								)}
							/>
							<FormField
								control={form.control}
								name="password"
								render={({ field }) => (
									<FormItem>
										<div className="flex items-center justify-between">
											<FormLabel>Password</FormLabel>
											<span className="text-xs text-primary cursor-pointer hover:underline">Forgot?</span>
										</div>
										<FormControl>
											<Input type="password" placeholder="••••••••" {...field} className="h-11 bg-muted/30" disabled={isLoading} />
										</FormControl>
										<FormMessage />
									</FormItem>
								)}
							/>
							<Button type="submit" className="w-full h-11" disabled={isLoading}>
								{isLoading ? (
									<>
										<Loader2 className="mr-2 h-4 w-4 animate-spin" /> Authenticating...
									</>
								) : (
									"Secure Login"
								)}
							</Button>
						</form>
					</Form>

					<p className="px-8 text-center text-xs text-muted-foreground">
						By logging in, you agree to our{" "}
						<span className="underline underline-offset-4 hover:text-primary cursor-pointer">Security Protocol</span>{" "}
						and{" "}
						<span className="underline underline-offset-4 hover:text-primary cursor-pointer">Patient Privacy Policy</span>.
					</p>
				</div>
			</div>
		</div>
	)
}

export default LoginPage