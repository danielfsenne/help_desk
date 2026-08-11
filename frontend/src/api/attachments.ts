import { http } from './http'

export interface Attachment {
  id: number
  fileName: string
  contentType: string | null
  size: number
  createdAt: string
  uploadedBy: {
    id: number
    name: string
  }
}

export async function listAttachments(ticketId: number): Promise<Attachment[]> {
  const { data } = await http.get<Attachment[]>(`/tickets/${ticketId}/attachments`)
  return data
}

export async function uploadAttachment(ticketId: number, file: File): Promise<Attachment> {
  const formData = new FormData()
  formData.append('file', file)
  const { data } = await http.post<Attachment>(`/tickets/${ticketId}/attachments`, formData, {
    headers: { 'Content-Type': 'multipart/form-data' },
  })
  return data
}

export async function downloadAttachment(attachment: Attachment): Promise<void> {
  const response = await http.get(`/attachments/${attachment.id}`, { responseType: 'blob' })
  const url = URL.createObjectURL(response.data)
  const link = document.createElement('a')
  link.href = url
  link.download = attachment.fileName
  link.click()
  URL.revokeObjectURL(url)
}
