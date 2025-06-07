'use server'

import { redirect } from 'next/navigation'
import { z } from 'zod'
import { db } from '@/lib/db'
import { hashPassword, verifyPassword, generateToken, setAuthCookie, removeAuthCookie } from '@/lib/auth'

const registerSchema = z.object({
  name: z.string().min(2, 'Nome deve ter pelo menos 2 caracteres'),
  email: z.string().email('Email inválido'),
  password: z.string().min(6, 'Senha deve ter pelo menos 6 caracteres'),
})

const loginSchema = z.object({
  email: z.string().email('Email inválido'),
  password: z.string().min(1, 'Senha é obrigatória'),
})

export async function registerUser(prevState: any, formData: FormData) {
  try {
    const validatedFields = registerSchema.safeParse({
      name: formData.get('name'),
      email: formData.get('email'),
      password: formData.get('password'),
    })

    if (!validatedFields.success) {
      return {
        errors: validatedFields.error.flatten().fieldErrors,
      }
    }

    const { name, email, password } = validatedFields.data

    // Verificar se usuário já existe
    const existingUser = await db.user.findUnique({
      where: { email },
    })

    if (existingUser) {
      return {
        errors: {
          email: ['Este email já está em uso'],
        },
      }
    }

    // Criar usuário
    const hashedPassword = await hashPassword(password)
    const user = await db.user.create({
      data: {
        name,
        email,
        password: hashedPassword,
      },
    })

    // Gerar token e definir cookie
    const token = generateToken(user.id)
    await setAuthCookie(token)

    return { success: true }
  } catch (error) {
    return {
      errors: {
        _form: ['Algo deu errado. Tente novamente.'],
      },
    }
  }
}

export async function loginUser(prevState: any, formData: FormData) {
  try {
    const validatedFields = loginSchema.safeParse({
      email: formData.get('email'),
      password: formData.get('password'),
    })

    if (!validatedFields.success) {
      return {
        errors: validatedFields.error.flatten().fieldErrors,
      }
    }

    const { email, password } = validatedFields.data

    // Buscar usuário
    const user = await db.user.findUnique({
      where: { email },
    })

    if (!user || !(await verifyPassword(password, user.password))) {
      return {
        errors: {
          _form: ['Email ou senha incorretos'],
        },
      }
    }

    // Gerar token e definir cookie
    const token = generateToken(user.id)
    await setAuthCookie(token)

    return { success: true }
  } catch (error) {
    return {
      errors: {
        _form: ['Algo deu errado. Tente novamente.'],
      },
    }
  }
}

export async function logoutUser() {
  await removeAuthCookie()
  redirect('/login')
}