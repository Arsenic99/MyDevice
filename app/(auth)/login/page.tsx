"use client"

import * as z from 'zod'

import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { toast } from 'react-hot-toast'
import { useState } from 'react'
import Link from 'next/link'
import { useAuth } from '@/hooks/useAuth'
import { useRouter } from 'next/navigation'
import axios from 'axios'

const formSchema = z.object({
    email: z.string().min(1),
    password: z.string().min(8)
})

const Login = () => {
    const [loading, setLoading] = useState(false)
    const auth = useAuth();
    const router = useRouter()

    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            email: '',
            password: ''
        }
    })

    const onSubmit = async (values: z.infer<typeof formSchema>) => {
        try {
            setLoading(true);
            const responce = await axios.post('api/auth', values)
            if(!responce.data)
            {
                toast.error('Wrong email or password');
            }
            else
            {
                auth.login(responce.data);
                router.push('/');
            }
        } catch (error) {
            toast.error('Something went wrong');
        } finally {
            setLoading(false);
        }
    }

    return (
            <div className='flex justify-center items-center h-full w-full'>
                <div className='space-y-4 py-2 pb-4 min-w-[320px]'>
                    <Form {...form}>
                        <form onSubmit={form.handleSubmit(onSubmit)}>
                            <FormField control={form.control} name='email' render={({ field }) => (
                                <FormItem>
                                    <FormLabel>
                                        Email
                                    </FormLabel>
                                    <FormControl>
                                        <Input type='email' required disabled={loading} placeholder='Email' {...field} />
                                    </FormControl>
                                </FormItem>
                            )} />
                            <br />
                            <FormField control={form.control} name='password' render={({ field }) => (
                                <FormItem>
                                    <FormLabel>
                                        Password
                                    </FormLabel>
                                    <FormControl>
                                        <Input type='password' required disabled={loading} placeholder='Password' {...field} />
                                    </FormControl>
                                </FormItem>
                            )} />
                            <FormMessage />
                            <div className='pt-2 text-sm text-right'>
                                Don't have an account?
                                <Link href={'/sign-up'} className='font-medium pl-1'>
                                Register
                                </Link>
                            </div>
                            <div className='pt-4 space-x-2 flex items-center justify-end'>
                                <Button disabled={loading} variant='outline' type='reset'>Cancel</Button>
                                <Button disabled={loading} type='submit'>Login</Button>
                            </div>
                        </form>
                    </Form>
                </div>
            </div>
    )
}

export default Login;