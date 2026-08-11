import { Folders, Pencil, Plus, Trash2, X } from 'lucide-react'
import { useEffect, useState } from 'react'
import { createCategory, deleteCategory, listCategories, updateCategory } from '../api/categories'
import AppShell from '../components/AppShell'
import Button from '../components/ui/Button'
import Card from '../components/ui/Card'
import EmptyState from '../components/ui/EmptyState'
import Input from '../components/ui/Input'
import PageHeader from '../components/ui/PageHeader'
import type { Category } from '../types'

export default function CategoriesPage() {
  const [categories, setCategories] = useState<Category[]>([])
  const [name, setName] = useState('')
  const [description, setDescription] = useState('')
  const [editingId, setEditingId] = useState<number | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState(true)

  function reload() {
    listCategories()
      .then(setCategories)
      .catch(() => setError('Não foi possível carregar as categorias.'))
      .finally(() => setLoading(false))
  }

  useEffect(reload, [])

  function startEdit(category: Category) {
    setEditingId(category.id)
    setName(category.name)
    setDescription(category.description ?? '')
  }

  function resetForm() {
    setEditingId(null)
    setName('')
    setDescription('')
  }

  async function handleSubmit(event: React.FormEvent) {
    event.preventDefault()
    setError(null)
    try {
      if (editingId) {
        await updateCategory(editingId, { name, description: description || null })
      } else {
        await createCategory({ name, description: description || null })
      }
      resetForm()
      reload()
    } catch {
      setError('Não foi possível salvar a categoria. Verifique se o nome já existe.')
    }
  }

  async function handleDelete(id: number) {
    setError(null)
    try {
      await deleteCategory(id)
      reload()
    } catch {
      setError('Não foi possível excluir a categoria.')
    }
  }

  return (
    <AppShell>
      <div className="max-w-2xl mx-auto">
        <PageHeader title="Categorias" subtitle="Organize os assuntos dos chamados" />

        <Card className="p-4 mb-6">
          <form onSubmit={handleSubmit} className="flex gap-2">
            <Input placeholder="Nome" value={name} onChange={(e) => setName(e.target.value)} required className="flex-1" />
            <Input
              placeholder="Descrição (opcional)"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="flex-[2]"
            />
            <Button type="submit">
              {editingId ? 'Salvar' : (
                <>
                  <Plus size={16} /> Adicionar
                </>
              )}
            </Button>
            {editingId && (
              <Button type="button" variant="ghost" onClick={resetForm}>
                <X size={16} />
              </Button>
            )}
          </form>
        </Card>

        {error && <p className="text-sm text-priority-critical mb-4">{error}</p>}

        <Card className="overflow-hidden">
          {loading ? (
            <div className="py-16 text-center text-ink-muted text-sm">Carregando...</div>
          ) : categories.length === 0 ? (
            <EmptyState icon={Folders} message="Nenhuma categoria cadastrada." />
          ) : (
            <table className="w-full text-sm">
              <thead>
                <tr className="text-left text-ink-muted border-b border-hairline">
                  <th className="px-4 py-3 font-medium">Nome</th>
                  <th className="px-4 py-3 font-medium">Descrição</th>
                  <th className="px-4 py-3"></th>
                </tr>
              </thead>
              <tbody>
                {categories.map((category) => (
                  <tr key={category.id} className="border-b border-hairline last:border-0">
                    <td className="px-4 py-3 font-medium text-ink">{category.name}</td>
                    <td className="px-4 py-3 text-ink-secondary">{category.description}</td>
                    <td className="px-4 py-3">
                      <div className="flex items-center justify-end gap-1">
                        <button
                          onClick={() => startEdit(category)}
                          title="Editar"
                          className="w-8 h-8 flex items-center justify-center rounded-md text-ink-secondary hover:bg-page hover:text-ink transition-colors"
                        >
                          <Pencil size={15} />
                        </button>
                        <button
                          onClick={() => handleDelete(category.id)}
                          title="Excluir"
                          className="w-8 h-8 flex items-center justify-center rounded-md text-ink-secondary hover:bg-priority-critical/10 hover:text-priority-critical transition-colors"
                        >
                          <Trash2 size={15} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </Card>
      </div>
    </AppShell>
  )
}
