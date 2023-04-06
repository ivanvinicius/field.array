import './styles/global.css'

import { useState } from 'react'
import { useFieldArray, useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { RiCloseLine } from 'react-icons/ri'

const createUserFormSchema = z.object({
  name: z
    .string()
    .nonempty('Campo obrigatório')
    .transform((name) => {
      return name
        .trim()
        .split(' ')
        .map((word) => word[0].toUpperCase().concat(word.substring(1)))
        .join(' ')
    }),
  email: z
    .string()
    .nonempty('Campo obrigatório')
    .email('Formato inválido')
    .refine((email) => {
      return email.endsWith('@gmail.com')
    }, 'Informe um e-mail da Google'),
  password: z.string().min(6, 'No mínimo 6 caractéres'),
  techs: z
    .array(
      z.object({
        title: z.string().nonempty('Campo obrigatório'),
        knowledge: z.coerce.number().min(1, 'Mínimo 1').max(10, 'Máximo 10'),
      }),
    )
    .min(1, 'Deve existir uma tecnologia'),
})

type createUserFormData = z.infer<typeof createUserFormSchema>

export function App() {
  const [output, setOutput] = useState('')

  const {
    register,
    formState: { errors },
    handleSubmit,
    control,
  } = useForm<createUserFormData>({
    resolver: zodResolver(createUserFormSchema),
  })

  const { fields, append, remove } = useFieldArray({
    control,
    name: 'techs',
  })

  function handleAddTech() {
    append({ title: '', knowledge: 1 })
  }

  function handleRemoveTech(index: number) {
    remove(index)
  }

  function createUser(data: createUserFormData) {
    setOutput(JSON.stringify(data, null, 2))
  }

  return (
    <main className="flex flex-col gap-16 h-screen bg-zinc-50 items-center justify-center">
      <form
        className="flex flex-col gap-4 w-full max-w-xs"
        onSubmit={handleSubmit(createUser)}
      >
        <div className="flex flex-col gap-1">
          <label htmlFor="name">Nome</label>
          <input
            className="h-10 border rounded border-zinc-200 px-3"
            type="text"
            {...register('name')}
          />
          {errors.name && (
            <span className="text-xs text-red-500">{errors.name.message}</span>
          )}
        </div>
        <div className="flex flex-col gap-1">
          <label htmlFor="email">E-mail</label>
          <input
            className="h-10 border rounded border-zinc-200 px-3"
            type="email"
            {...register('email')}
          />
          {errors.email && (
            <span className="text-xs text-red-500">{errors.email.message}</span>
          )}
        </div>
        <div className="flex flex-col gap-1">
          <label htmlFor="password">Senha</label>
          <input
            className="h-10 border rounded border-zinc-200 px-3"
            type="password"
            {...register('password')}
          />
          {errors.password && (
            <span className="text-xs text-red-500">
              {errors.password.message}
            </span>
          )}
        </div>
        <div className="flex flex-col gap-1">
          <div className="flex item-center justify-between">
            <label htmlFor="">Tecnologias</label>

            <button
              type="button"
              className="text-emerald-500 text-sm"
              onClick={handleAddTech}
            >
              Adicionar
            </button>
          </div>

          {fields.map((field, index) => (
            <div key={field.id} className="flex gap-2">
              <div className="flex flex-col w-60">
                <input
                  className="h-10 border rounded border-zinc-200 px-3 "
                  type="text"
                  {...register(`techs.${index}.title`)}
                />
                {errors.techs?.[index]?.title && (
                  <span className="text-xs text-red-500">
                    {errors.techs[index]?.title?.message}
                  </span>
                )}
              </div>
              <div className="flex flex-col w-16">
                <input
                  className="h-10 border rounded border-zinc-200 px-3"
                  type="number"
                  {...register(`techs.${index}.knowledge`)}
                />
                {errors.techs?.[index]?.knowledge && (
                  <span className="text-xs text-red-500">
                    {errors.techs[index]?.knowledge?.message}
                  </span>
                )}
              </div>
              <button
                type="button"
                onClick={() => handleRemoveTech(index)}
                title="Remover item"
              >
                <RiCloseLine className="hover:text-red-500 transition-all" />
              </button>
            </div>
          ))}
          {errors.techs && (
            <span className="text-xs text-red-500">{errors.techs.message}</span>
          )}
        </div>

        <button
          className="bg-emerald-500 rounded font-semibold text-white h-10 hover:bg-emerald-600 transition-all"
          type="submit"
        >
          Salvar
        </button>
      </form>

      <pre>{output}</pre>
    </main>
  )
}
