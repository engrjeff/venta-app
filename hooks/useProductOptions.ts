"use client"

import { getProductServiceOptions } from "@/actions/products"

import { useServerActionQuery } from "./server-actions-hooks"
import { useCurrentStore } from "./useCurrentStore"

export function useProductOptions(search?: string, excludedIds?: string[]) {
  const store = useCurrentStore()

  return useServerActionQuery(getProductServiceOptions, {
    input: { storeId: store.data?.id!, search },
    queryKey: ["getProductServiceOptions", store.data?.slug!, search!],
    enabled: Boolean(store.data?.id),
  })
}
