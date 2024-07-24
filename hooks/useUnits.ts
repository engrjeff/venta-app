"use client"

import { getStoreUnits } from "@/actions/units"

import { useServerActionQuery } from "./server-actions-hooks"
import { useCurrentStore } from "./useCurrentStore"

export function useUnits() {
  const store = useCurrentStore()

  return useServerActionQuery(getStoreUnits, {
    input: { storeId: store.data?.id! },
    queryKey: ["getStoreUnits", store.data?.slug!],
    enabled: Boolean(store.data?.id),
    select(data) {
      return {
        ...data,
        items: data?.items?.filter((d) => d.status === "ACTIVE"),
      }
    },
  })
}
