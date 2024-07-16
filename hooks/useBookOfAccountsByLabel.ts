"use client"

import { getBookAccountsByLabel } from "@/actions/chart-of-accounts"
import { BookAccountLabel } from "@prisma/client"

import { useServerActionQuery } from "./server-actions-hooks"
import { useCurrentStore } from "./useCurrentStore"

export function useBookOfAccountsByLabel(label: BookAccountLabel) {
  const store = useCurrentStore()

  return useServerActionQuery(getBookAccountsByLabel, {
    input: { storeId: store.data?.id!, label },
    queryKey: ["getBookAccountsByLabel", label, store.data?.id!],
    enabled: Boolean(store.data?.id),
  })
}
