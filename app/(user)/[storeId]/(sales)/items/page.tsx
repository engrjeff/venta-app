import { Suspense } from "react"
import { Metadata } from "next"
import { notFound } from "next/navigation"
import { getProductServiceItems } from "@/actions/products"
import { getStoreBySlug } from "@/actions/stores"

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
  })

  return (
    <>
      <div className="absolute right-6 mb-2 flex items-center justify-between">
        <div className="flex items-center gap-4">
          <MoreDropDown />
          <NewButton />
        </div>
      </div>
      <ProductServiceTable products={products?.items ?? []} />
      <div className="flex justify-end py-4">
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
