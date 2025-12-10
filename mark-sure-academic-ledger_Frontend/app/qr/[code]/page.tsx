"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Shield, ArrowLeft, Loader2, CheckCircle2, XCircle } from "lucide-react"
import Link from "next/link"
import Image from "next/image"
import { getCertificateByQRCode, type CertificateVerificationResponse } from "@/lib/api"

export default function QRPage({ params }: { params: Promise<{ code: string }> }) {
  const [code, setCode] = useState<string>("")
  const [certificate, setCertificate] = useState<CertificateVerificationResponse | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchCertificate = async () => {
      try {
        const resolvedParams = await params
        const decodedCode = decodeURIComponent(resolvedParams.code)
        setCode(decodedCode)
        
        const cert = await getCertificateByQRCode(decodedCode)
        setCertificate(cert)
      } catch (err) {
        setError(err instanceof Error ? err.message : "Failed to load certificate")
      } finally {
        setLoading(false)
      }
    }

    fetchCertificate()
  }, [params])

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-16 max-w-2xl">
        <div className="text-center space-y-8">
          <Loader2 className="w-12 h-12 mx-auto animate-spin text-accent" />
          <p className="text-muted-foreground">Loading certificate...</p>
        </div>
      </div>
    )
  }

  if (error || !certificate || !certificate.verified) {
    return (
      <div className="container mx-auto px-4 py-16 max-w-2xl">
        <div className="text-center space-y-8 animate-in fade-in zoom-in-95 duration-500">
          <div className="flex justify-center">
            <div className="w-20 h-20 rounded-full bg-destructive/10 flex items-center justify-center">
              <XCircle className="w-10 h-10 text-destructive" />
            </div>
          </div>
          <div>
            <h1 className="text-3xl font-bold mb-2 text-destructive">Certificate Not Found</h1>
            <p className="text-muted-foreground">{error || "This certificate could not be verified."}</p>
          </div>
          <Link href="/verify">
            <Button variant="outline">Go to Verification Page</Button>
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className="container mx-auto px-4 py-16 max-w-2xl">
      <div className="text-center space-y-8 animate-in fade-in zoom-in-95 duration-500">
        <div className="flex justify-center">
          <div className="w-20 h-20 rounded-full bg-accent/10 flex items-center justify-center">
            <Shield className="w-10 h-10 text-accent" />
          </div>
        </div>

        <div>
          <h1 className="text-3xl font-bold mb-2">Certificate QR Code</h1>
          <p className="text-muted-foreground">Scan this code to verify the certificate instantly</p>
        </div>

        <Card className="p-12 bg-card/50 backdrop-blur-sm border-border">
          <div className="space-y-6">
            <div className="bg-white p-8 rounded-xl inline-block">
              <p className="text-sm text-muted-foreground mb-2">Scan this QR code to verify the certificate</p>
              <div className="w-[300px] h-[300px] bg-gray-100 flex items-center justify-center rounded">
                <p className="text-muted-foreground text-sm">QR Code would be displayed here</p>
              </div>
            </div>

            <div className="space-y-2">
              <p className="text-sm text-muted-foreground uppercase tracking-wide">Certificate Code</p>
              <p className="text-2xl font-bold text-accent">{code}</p>
            </div>

            {certificate.verified && certificate.record && (
              <div className="pt-6 border-t border-border space-y-3">
                <div className="flex items-center justify-center gap-2 text-green-500">
                  <CheckCircle2 className="w-5 h-5" />
                  <p className="font-semibold">Verified Certificate</p>
                </div>
                <div className="text-left space-y-2">
                  <p><span className="text-muted-foreground">Student:</span> {certificate.record.studentName}</p>
                  <p><span className="text-muted-foreground">Institution:</span> {certificate.record.institution}</p>
                  <p><span className="text-muted-foreground">Program:</span> {certificate.record.program}</p>
                  <p><span className="text-muted-foreground">Issue Date:</span> {certificate.record.issueDate}</p>
                </div>
              </div>
            )}
          </div>
        </Card>

        <div className="flex flex-col sm:flex-row gap-3">
          <Link href="/admin/issue" className="flex-1">
            <Button variant="outline" className="w-full bg-transparent">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Dashboard
            </Button>
          </Link>
          <Button className="flex-1 bg-primary hover:bg-primary/90">Download QR Code</Button>
        </div>

        <p className="text-xs text-muted-foreground pt-4">
          This QR code can be printed on physical certificates for easy verification
        </p>
      </div>
    </div>
  )
}
