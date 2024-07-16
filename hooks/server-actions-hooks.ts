import { BookAccountLabel } from "@prisma/client"
import { useInfiniteQuery, useMutation, useQuery } from "@tanstack/react-query"
import {
  createServerActionsKeyFactory,
  setupServerActionHooks,
} from "zsa-react-query"

export const QueryKeyFactory = createServerActionsKeyFactory({
  getStoreBySlug: (slug: string) => ["getStoreBySlug", slug],
  getCategories: (slug: string) => ["getCategories", slug],
  getStoreUnits: (slug: string) => ["getStoreUnits", slug],
  getStoreSuppliers: (slug: string) => ["getStoreSuppliers", slug],
  getBookAccountsByLabel: (label: BookAccountLabel, slug: string) => [
    "getBookAccountsByLabel",
    label,
    slug,
  ],
})

const {
  useServerActionQuery,
  useServerActionMutation,
  useServerActionInfiniteQuery,
} = setupServerActionHooks({
  hooks: {
    useQuery: useQuery,
    useMutation: useMutation,
    useInfiniteQuery: useInfiniteQuery,
  },
  queryKeyFactory: QueryKeyFactory,
})

export {
  useServerActionInfiniteQuery,
  useServerActionMutation,
  useServerActionQuery,
}
