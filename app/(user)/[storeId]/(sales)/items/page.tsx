import { Metadata } from "next"

import { MoreDropDown } from "@/components/features/products-and-services/more-dropdown"
import { NewButton } from "@/components/features/products-and-services/new-button"

export const metadata: Metadata = {
  title: "Products & Services - CoFaith",
}
function ProductsAndServicesPage() {
  return (
    <>
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-semibold">Products & Services</h2>
        <div className="flex items-center gap-4">
          <MoreDropDown />
          <NewButton />
        </div>
      </div>
    </>
  )
}

export default ProductsAndServicesPage
