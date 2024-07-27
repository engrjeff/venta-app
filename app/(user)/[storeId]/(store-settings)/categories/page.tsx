import { Suspense } from "react"
import { Metadata } from "next"
import { notFound } from "next/navigation"
import { getCategories } from "@/actions/categories"
import { getStoreBySlug } from "@/actions/stores"

import { PaginationLinks } from "@/components/ui/data-table/pagination-links"
import { CategoriesTable } from "@/components/features/categories/categories-table"
import { NewCategoryForm } from "@/components/features/categories/new-category-form"

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
    title: `${store.name} - Categories`,
  }
}

async function CategoriesPage({ params, searchParams }: PageProps) {
  const [store] = await getStoreBySlug({ slug: params.storeId })

  if (!store) notFound()

  const [categories] = await getCategories({
    storeId: store.id,
    page: isNaN(+searchParams.p) ? 1 : Number(searchParams.p),
    sort: searchParams.sort,
    order: searchParams.order,
    status: searchParams.status,
    search: searchParams.search,
  })

  if (categories?.pageInfo.totalCount === 0)
    return (
      <div className="flex min-h-[75vh] w-full flex-col items-center justify-center gap-4 rounded-md border border-dashed p-6">
        <p className="text-muted-foreground">You have no units yet.</p>
        <NewCategoryForm main />
      </div>
    )

  return (
    <>
      <div className="absolute right-6 mb-2 flex items-center justify-between">
        <div className="flex items-center gap-4">
          <NewCategoryForm main />
        </div>
      </div>
      <CategoriesTable categories={categories?.items ?? []} />
      <div className="flex justify-between py-4">
        {categories?.pageInfo.totalCount ? (
          <p className="text-sm text-muted-foreground">
            Showing {categories?.items.length} of{" "}
            {categories?.pageInfo.totalCount} categories
          </p>
        ) : (
          <p className="text-sm text-muted-foreground">
            No categories to show.
          </p>
        )}
        <Suspense>
          <PaginationLinks
            currentPage={categories?.pageInfo?.currentPage!}
            totalPages={categories?.pageInfo.totalPages!}
          />
        </Suspense>
      </div>
    </>
  )
}

export default CategoriesPage
