import { Suspense } from "react"
import { Metadata } from "next"
import { notFound } from "next/navigation"
import { getStoreBySlug } from "@/actions/stores"
import { getStoreUnits } from "@/actions/units"

import { PaginationLinks } from "@/components/ui/data-table/pagination-links"
import { NewUnitForm } from "@/components/features/units/new-unit-form"
import { UnitsTable } from "@/components/features/units/units-table"

interface PageProps {
  params: { storeId: string }
  searchParams: Record<string, string>
}

export const generateMetadata = async ({
  params,
}: PageProps): Promise<Metadata> => {
  const [store] = await getStoreBySlug({ slug: params.storeId })

  if (!store) notFound()

  return {
    title: `${store.name} - Units`,
  }
}

async function UnitsPage({ params, searchParams }: PageProps) {
  const [store] = await getStoreBySlug({ slug: params.storeId })

  if (!store) notFound()

  const [units] = await getStoreUnits({
    storeId: store.id,
    page: isNaN(+searchParams.p) ? 1 : Number(searchParams.p),
    sort: searchParams.sort,
    order: searchParams.order,
    status: searchParams.status,
    search: searchParams.search,
  })

  if (units?.pageInfo.totalCount === 0)
    return (
      <div className="flex min-h-[75vh] w-full flex-col items-center justify-center gap-4 rounded-md border border-dashed p-6">
        <p className="text-muted-foreground">You have no units yet.</p>
        <NewUnitForm main />
      </div>
    )

  return (
    <>
      <div className="absolute right-6 mb-2 flex items-center justify-between">
        <div className="flex items-center gap-4">
          <NewUnitForm main />
        </div>
      </div>
      <UnitsTable units={units?.items ?? []} />
      <div className="flex justify-between py-4">
        {units?.pageInfo.totalCount ? (
          <p className="text-sm text-muted-foreground">
            Showing {units?.items.length} of {units?.pageInfo.totalCount} units
          </p>
        ) : (
          <p className="text-sm text-muted-foreground">No units to show.</p>
        )}
        <Suspense>
          <PaginationLinks
            currentPage={units?.pageInfo?.currentPage!}
            totalPages={units?.pageInfo.totalPages!}
          />
        </Suspense>
      </div>
    </>
  )
}

export default UnitsPage
