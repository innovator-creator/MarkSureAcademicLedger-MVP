export function Footer() {
  return (
    <footer className="border-t border-border bg-card/30 backdrop-blur-sm mt-16">
      <div className="container mx-auto px-4 py-8">
        <div className="flex flex-col items-center gap-4 text-center">
          <div className="space-y-2">
            <p className="text-sm text-muted-foreground">
              © {new Date().getFullYear()} MarkSure Academic Ledger. All rights reserved.
            </p>
            <p className="text-sm text-muted-foreground">
              Sierra Leone&apos;s Blockchain Academic Credential Verification System
            </p>
          </div>
          <div className="pt-4 border-t border-border/50 w-full max-w-md">
            <p className="text-sm text-accent font-medium">Developed by John Mark Fornah (Innovator)</p>
          </div>
        </div>
      </div>
    </footer>
  )
}
