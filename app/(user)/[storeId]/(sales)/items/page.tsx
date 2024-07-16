import { Metadata } from "next"
import { notFound } from "next/navigation"
import { getProductServiceItems } from "@/actions/products"
import { getStoreBySlug } from "@/actions/stores"

import { MoreDropDown } from "@/components/features/products-and-services/more-dropdown"
import { NewButton } from "@/components/features/products-and-services/new-button"
import { ProductServiceTable } from "@/components/features/products-and-services/product-service-table"

interface PageProps {
  params: { storeId: string }
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

async function ProductsAndServicesPage({ params }: PageProps) {
  const [store] = await getStoreBySlug({ slug: params.storeId })

  if (!store) notFound()

  const [products] = await getProductServiceItems({
    storeId: store.id,
  })

  return (
    <>
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-semibold">Products & Services</h2>
        <div className="flex items-center gap-4">
          <MoreDropDown />
          <NewButton />
        </div>
      </div>
      <ProductServiceTable products={products} />
    </>
  )
}

export default ProductsAndServicesPage
