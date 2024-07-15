"use client"

import { useParams } from "next/navigation"
import { getStoreBySlug } from "@/actions/stores"

import { useServerActionQuery } from "./server-actions-hooks"

export function useCurrentStore() {
  const { storeId } = useParams<{ storeId: string }>() // storeId here is actually the store slug

  return useServerActionQuery(getStoreBySlug, {
    input: { slug: storeId },
    queryKey: ["getStoreBySlug", storeId],
  })
}
