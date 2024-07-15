import { Metadata } from "next"
import { notFound } from "next/navigation"
import { getCategories } from "@/actions/categories"
import { getStoreBySlug } from "@/actions/stores"

export const metadata: Metadata = {
  title: "Categories",
}

async function CategoriesPage({ params }: { params: { storeId: string } }) {
  const [store] = await getStoreBySlug({ slug: params.storeId })

  if (!store) notFound()

  const [categories] = await getCategories({ storeId: store.id })

  return (
    <div>
      <ul>
        {categories?.map((category) => (
          <li key={category.id}>{category.name}</li>
        ))}
      </ul>
    </div>
  )
}

export default CategoriesPage
