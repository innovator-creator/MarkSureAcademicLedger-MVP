import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Shield, Lock, Zap, CheckCircle2 } from "lucide-react"

export default function HomePage() {
  return (
    <div className="container mx-auto px-4 py-16">
      {/* Hero Section */}
      <div className="text-center space-y-6 mb-20 animate-in fade-in slide-in-from-bottom-4 duration-700">
        <h1 className="text-5xl md:text-6xl font-bold tracking-tight text-balance">MarkSure Academic Ledger</h1>
        <p className="text-xl text-muted-foreground max-w-3xl mx-auto text-balance">
          Sierra Leone&apos;s Blockchain Academic Credential Verification System
        </p>
        <p className="text-sm text-accent font-medium max-w-2xl mx-auto text-pretty">
          AI-Powered Academic Record Authentication & Certificate Integrity Verification
        </p>

        <div className="flex flex-wrap items-center justify-center gap-4 pt-8">
          <Link href="/verify">
            <Button size="lg" className="bg-primary hover:bg-primary/90 text-primary-foreground">
              <Shield className="w-4 h-4 mr-2" />
              Verify Certificate
            </Button>
          </Link>
          <Link href="/admin/login">
            <Button
              size="lg"
              variant="outline"
              className="border-accent text-accent hover:bg-accent hover:text-accent-foreground bg-transparent"
            >
              <Lock className="w-4 h-4 mr-2" />
              Issue Certificate (Admin)
            </Button>
          </Link>
        </div>
      </div>

      {/* Why MarkSure Section */}
      <div className="max-w-5xl mx-auto">
        <h2 className="text-3xl font-bold text-center mb-12">Why MarkSure?</h2>

        <div className="grid md:grid-cols-3 gap-6">
          <Card className="p-6 bg-card/50 backdrop-blur-sm border-border hover:border-accent/50 transition-all hover:shadow-lg hover:shadow-accent/10 group">
            <div className="space-y-4">
              <div className="w-12 h-12 rounded-lg bg-accent/10 flex items-center justify-center group-hover:scale-110 transition-transform">
                <Zap className="w-6 h-6 text-accent" />
              </div>
              <h3 className="text-xl font-semibold">Instant Verification</h3>
              <p className="text-muted-foreground text-sm leading-relaxed">
                Verify academic credentials in seconds using our AI-powered blockchain verification system
              </p>
            </div>
          </Card>

          <Card className="p-6 bg-card/50 backdrop-blur-sm border-border hover:border-accent/50 transition-all hover:shadow-lg hover:shadow-accent/10 group">
            <div className="space-y-4">
              <div className="w-12 h-12 rounded-lg bg-accent/10 flex items-center justify-center group-hover:scale-110 transition-transform">
                <Shield className="w-6 h-6 text-accent" />
              </div>
              <h3 className="text-xl font-semibold">Tamper-Proof Records</h3>
              <p className="text-muted-foreground text-sm leading-relaxed">
                Blockchain technology ensures certificates cannot be forged or altered once issued
              </p>
            </div>
          </Card>

          <Card className="p-6 bg-card/50 backdrop-blur-sm border-border hover:border-accent/50 transition-all hover:shadow-lg hover:shadow-accent/10 group">
            <div className="space-y-4">
              <div className="w-12 h-12 rounded-lg bg-accent/10 flex items-center justify-center group-hover:scale-110 transition-transform">
                <CheckCircle2 className="w-6 h-6 text-accent" />
              </div>
              <h3 className="text-xl font-semibold">National Adoption Ready</h3>
              <p className="text-muted-foreground text-sm leading-relaxed">
                Built for scale to serve all educational institutions across Sierra Leone
              </p>
            </div>
          </Card>
        </div>
      </div>
    </div>
  )
}
