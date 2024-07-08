export function AuthFooter() {
  return (
    <footer className="border-t">
      <p className="container py-4 text-center text-xs">
        Venta App &copy; {new Date().getFullYear()}. Made by{" "}
        <a
          href="https://jeffsegovia.dev"
          target="_blank"
          rel="noopener noreferrer"
          className="font-semibold text-primary"
        >
          Jeff Segovia
        </a>
        .
      </p>
    </footer>
  )
}
