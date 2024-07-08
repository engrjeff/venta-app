export function FormError({ error }: { error?: string }) {
  if (!error) return

  return (
    <div className="rounded-md bg-destructive p-4 text-sm text-destructive-foreground">
      <p>{error}</p>
    </div>
  )
}
