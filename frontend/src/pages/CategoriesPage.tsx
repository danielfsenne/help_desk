import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { createCategory, deleteCategory, listCategories, updateCategory } from '../api/categories'
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
    <div style={{ fontFamily: 'sans-serif', padding: 24, maxWidth: 640, margin: '0 auto' }}>
      <Link to="/dashboard">&larr; Voltar</Link>
      <h1>Categorias</h1>

      <form onSubmit={handleSubmit} style={{ display: 'flex', gap: 8, marginBottom: 24 }}>
        <input
          placeholder="Nome"
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
          style={{ padding: 8, flex: 1 }}
        />
        <input
          placeholder="Descrição (opcional)"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          style={{ padding: 8, flex: 2 }}
        />
        <button type="submit">{editingId ? 'Salvar' : 'Adicionar'}</button>
        {editingId && (
          <button type="button" onClick={resetForm}>
            Cancelar
          </button>
        )}
      </form>

      {error && <p style={{ color: 'crimson' }}>{error}</p>}
      {loading && <p>Carregando...</p>}

      {!loading && (
        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
          <thead>
            <tr style={{ textAlign: 'left', borderBottom: '2px solid #eee' }}>
              <th style={{ padding: 8 }}>Nome</th>
              <th style={{ padding: 8 }}>Descrição</th>
              <th style={{ padding: 8 }}></th>
            </tr>
          </thead>
          <tbody>
            {categories.map((category) => (
              <tr key={category.id} style={{ borderBottom: '1px solid #f0f0f0' }}>
                <td style={{ padding: 8 }}>{category.name}</td>
                <td style={{ padding: 8 }}>{category.description}</td>
                <td style={{ padding: 8, display: 'flex', gap: 8 }}>
                  <button onClick={() => startEdit(category)}>Editar</button>
                  <button onClick={() => handleDelete(category.id)}>Excluir</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  )
}
