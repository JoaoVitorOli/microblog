import { useEffect, useState } from 'react'
import type { AxiosInstance } from 'axios'

export function useServiceStatus(client: AxiosInstance, path: string) {
  const [online, setOnline] = useState<boolean | null>(null)

  useEffect(() => {
    let cancelled = false

    async function check() {
      try {
        await client.get(path)
        if (!cancelled) setOnline(true)
      } catch {
        if (!cancelled) setOnline(false)
      }
    }

    check()
    const interval = setInterval(check, 8000)
    return () => {
      cancelled = true
      clearInterval(interval)
    }
  }, [client, path])

  return online
}
