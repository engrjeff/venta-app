import { Suspense } from "react"
import { Metadata } from "next"
import { notFound } from "next/navigation"
import { getProductServiceItems } from "@/actions/products"
import { getStoreBySlug } from "@/actions/stores"
import { ProductServiceStockStatus, ProductServiceType } from "@prisma/client"

import { PaginationLinks } from "@/components/ui/data-table/pagination-links"
import { MoreDropDown } from "@/components/features/products-and-services/more-dropdown"
import { NewButton } from "@/components/features/products-and-services/new-button"
import { ProductServiceTable } from "@/components/features/products-and-services/product-service-table"

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
    title: `${store.name} - Products & Services`,
  }
}

async function ProductsAndServicesPage({ params, searchParams }: PageProps) {
  const [store] = await getStoreBySlug({ slug: params.storeId })

  if (!store) notFound()

  const [products] = await getProductServiceItems({
    storeId: store.id,
    page: isNaN(+searchParams.p) ? 1 : Number(searchParams.p),
    sort: searchParams.sort,
    order: searchParams.order,
    status: searchParams.status,
    search: searchParams.search,
    type: searchParams.type as ProductServiceType,
    stockStatus: searchParams.stockStatus as ProductServiceStockStatus,
  })

  if (products?.pageInfo.totalCount === 0)
    return (
      <div className="flex min-h-[75vh] w-full flex-col items-center justify-center gap-4 rounded-md border border-dashed p-6">
        <p className="text-muted-foreground">You have no products yet.</p>
        <NewButton forEmpty />
      </div>
    )

  return (
    <>
      <div className="absolute right-6 mb-2 flex items-center justify-between">
        <div className="flex items-center gap-4">
          <MoreDropDown />
          <NewButton />
        </div>
      </div>
      <ProductServiceTable products={products?.items ?? []} />
      <div className="flex justify-between py-4">
        {products?.pageInfo.totalCount ? (
          <p className="text-sm text-muted-foreground">
            Showing {products?.items.length} of {products?.pageInfo.totalCount}{" "}
            products
          </p>
        ) : (
          <p className="text-sm text-muted-foreground">No products to show.</p>
        )}
        <Suspense>
          <PaginationLinks
            currentPage={products?.pageInfo?.currentPage!}
            totalPages={products?.pageInfo.totalPages!}
          />
        </Suspense>
      </div>
    </>
  )
}

export default ProductsAndServicesPage
