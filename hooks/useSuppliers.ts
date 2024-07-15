"use client"

import { getSuppliers } from "@/actions/suppliers"

import { useServerActionQuery } from "./server-actions-hooks"
import { useCurrentStore } from "./useCurrentStore"

export function useSuppliers() {
  const store = useCurrentStore()

  return useServerActionQuery(getSuppliers, {
    input: { storeId: store.data?.id! },
    queryKey: ["getStoreSuppliers", store.data?.slug!],
    enabled: Boolean(store.data?.id),
  })
}
