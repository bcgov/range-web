import { useState, useEffect } from 'react'
import { pdf } from '@react-pdf/renderer'

export const usePDF = (callback, deps = []) => {
  const [pdfUrl, setPdfUrl] = useState(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)

  const generatePdf = async () => {
    try {
      setLoading(true)
      setError(null)
      if (pdfUrl) {
        URL.revokeObjectURL(pdfUrl)
        setPdfUrl(null)
      }

      const doc = await callback()
      const blob = await pdf(doc).toBlob()

      setPdfUrl(URL.createObjectURL(blob))
      setLoading(false)
    } catch (e) {
      setLoading(false)
      setError(e)
      console.error(e)
    }
  }
  useEffect(() => {
    generatePdf().catch(e => setError(e))
  }, deps)

  return [pdfUrl, loading, error, generatePdf]
}
