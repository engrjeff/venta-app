"use client"

import { getCategories } from "@/actions/categories"

import { useServerActionQuery } from "./server-actions-hooks"
import { useCurrentStore } from "./useCurrentStore"

export function useCategories() {
  const store = useCurrentStore()

  return useServerActionQuery(getCategories, {
    input: { storeId: store.data?.id! },
    queryKey: ["getCategories", store.data?.slug!],
    enabled: Boolean(store.data?.id),
    select(data) {
      return {
        ...data,
        items: data?.items?.filter((d) => d.status === "ACTIVE"),
      }
    },
  })
}
