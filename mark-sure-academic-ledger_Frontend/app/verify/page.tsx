"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Shield, Upload, CheckCircle2, XCircle, FileText, Loader2 } from "lucide-react"
import Image from "next/image"
import { verifyCertificateByCode, verifyCertificateByFile, type CertificateVerificationResponse } from "@/lib/api"

export default function VerifyPage() {
  const [certificateCode, setCertificateCode] = useState("")
  const [result, setResult] = useState<CertificateVerificationResponse | null>(null)
  const [searched, setSearched] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [uploadedFile, setUploadedFile] = useState<File | null>(null)

  const handleVerify = async () => {
    if (!certificateCode.trim()) {
      setError("Please enter a certificate code")
      return
    }

    setLoading(true)
    setError(null)
    setSearched(false)

    try {
      const cert = await verifyCertificateByCode(certificateCode.trim())
      setResult(cert)
      setSearched(true)
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to verify certificate")
      setResult({
        verified: false,
        message: err instanceof Error ? err.message : "Certificate not found"
      })
      setSearched(true)
    } finally {
      setLoading(false)
    }
  }

  const handleFileUpload = async (file: File) => {
    setLoading(true)
    setError(null)
    setSearched(false)
    setUploadedFile(file)

    try {
      const cert = await verifyCertificateByFile(file)
      setResult(cert)
      setSearched(true)
      if (!cert.verified) {
        setError(cert.message || "File upload verification is not supported")
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to verify certificate file")
      setResult({
        verified: false,
        message: err instanceof Error ? err.message : "Verification failed"
      })
      setSearched(true)
    } finally {
      setLoading(false)
    }
  }

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      handleFileUpload(file)
    }
  }

  return (
    <div className="container mx-auto px-4 py-16 max-w-4xl">
      <div className="text-center space-y-4 mb-12 animate-in fade-in slide-in-from-top-4 duration-500">
        <h1 className="text-4xl font-bold tracking-tight">Certificate Verification</h1>
        <p className="text-muted-foreground text-lg">
          Enter a certificate code or upload a document to verify its authenticity
        </p>
      </div>

      <Card className="p-8 bg-card/50 backdrop-blur-sm border-border mb-8">
        <div className="space-y-6">
          <div className="space-y-2">
            <Label htmlFor="cert-code" className="text-base">
              Certificate Code
            </Label>
            <div className="flex gap-3">
              <Input
                id="cert-code"
                placeholder="Enter Certificate Code (e.g., CERT-2024-001)"
                value={certificateCode}
                onChange={(e) => setCertificateCode(e.target.value)}
                className="flex-1 bg-background/50"
              />
              <Button 
                onClick={handleVerify} 
                size="lg" 
                className="bg-primary hover:bg-primary/90"
                disabled={loading}
              >
                {loading ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    Verifying...
                  </>
                ) : (
                  <>
                    <Shield className="w-4 h-4 mr-2" />
                    Verify Now
                  </>
                )}
              </Button>
            </div>
          </div>

          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <span className="w-full border-t border-border" />
            </div>
            <div className="relative flex justify-center text-xs uppercase">
              <span className="bg-card px-2 text-muted-foreground">Or</span>
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="cert-upload" className="text-base">
              Upload Certificate
            </Label>
            <label htmlFor="cert-upload">
              <div className="border-2 border-dashed border-border rounded-lg p-8 text-center hover:border-accent/50 transition-colors cursor-pointer bg-background/30">
                <Upload className="w-8 h-8 mx-auto mb-3 text-muted-foreground" />
                <p className="text-sm text-muted-foreground mb-1">Click to upload or drag and drop</p>
                <p className="text-xs text-muted-foreground">PDF or Image files accepted</p>
                {uploadedFile && (
                  <p className="text-xs text-accent mt-2">Selected: {uploadedFile.name}</p>
                )}
              </div>
            </label>
            <input
              id="cert-upload"
              type="file"
              accept=".pdf,.png,.jpg,.jpeg"
              onChange={handleFileChange}
              className="hidden"
              disabled={loading}
            />
          </div>
          
          {error && (
            <div className="p-3 bg-destructive/10 border border-destructive/50 rounded-lg">
              <p className="text-sm text-destructive">{error}</p>
            </div>
          )}
        </div>
      </Card>

      {/* Results Card */}
      {searched && result && (
        <Card
          className={`p-8 border-2 animate-in fade-in slide-in-from-bottom-4 duration-500 ${
            result.verified ? "border-green-500/50 bg-green-500/5" : "border-destructive/50 bg-destructive/5"
          }`}
        >
          <div className="space-y-6">
            <div className="flex items-center gap-3">
              {result.verified ? (
                <>
                  <CheckCircle2 className="w-8 h-8 text-green-500" />
                  <div>
                    <h2 className="text-2xl font-bold text-green-500">Certificate Verified</h2>
                    <p className="text-sm text-muted-foreground">
                      This certificate is authentic and registered on the blockchain
                    </p>
                  </div>
                </>
              ) : (
                <>
                  <XCircle className="w-8 h-8 text-destructive" />
                  <div>
                    <h2 className="text-2xl font-bold text-destructive">Not Verified</h2>
                    <p className="text-sm text-muted-foreground">
                      {result.message || "This certificate could not be verified in our system"}
                    </p>
                  </div>
                </>
              )}
            </div>

            {result.verified && result.record && (
              <>
                <div className="grid md:grid-cols-2 gap-6 pt-6 border-t border-border">
                  <div className="space-y-4">
                    <div>
                      <Label className="text-muted-foreground text-xs uppercase tracking-wide">Student Name</Label>
                      <p className="text-lg font-semibold mt-1">{result.record.studentName}</p>
                    </div>
                    <div>
                      <Label className="text-muted-foreground text-xs uppercase tracking-wide">Institution</Label>
                      <p className="text-lg font-semibold mt-1">{result.record.institution}</p>
                    </div>
                    <div>
                      <Label className="text-muted-foreground text-xs uppercase tracking-wide">Program</Label>
                      <p className="text-lg font-semibold mt-1">{result.record.program}</p>
                    </div>
                    <div>
                      <Label className="text-muted-foreground text-xs uppercase tracking-wide">Issue Date</Label>
                      <p className="text-lg font-semibold mt-1">{result.record.issueDate}</p>
                    </div>
                    <div>
                      <Label className="text-muted-foreground text-xs uppercase tracking-wide">Certificate Code</Label>
                      <p className="text-lg font-semibold mt-1 text-accent">{result.record.certificateCode}</p>
                    </div>
                  </div>

                  <div className="space-y-4">
                    <div>
                      <Label className="text-muted-foreground text-xs uppercase tracking-wide">Blockchain Hash</Label>
                      <p className="text-sm font-mono mt-1 break-all bg-background/50 p-2 rounded">
                        {result.record.blockHash}
                      </p>
                    </div>
                    <div>
                      <Label className="text-muted-foreground text-xs uppercase tracking-wide">Timestamp</Label>
                      <p className="text-sm mt-1 bg-background/50 p-2 rounded">
                        {new Date(result.record.timestamp).toLocaleString()}
                      </p>
                    </div>
                  </div>
                </div>

                <div className="flex gap-3 pt-4">
                  <Button variant="outline" className="flex-1 bg-transparent">
                    <FileText className="w-4 h-4 mr-2" />
                    Download Report
                  </Button>
                  <Button variant="outline" className="flex-1 bg-transparent">
                    View on Blockchain
                  </Button>
                </div>
              </>
            )}
          </div>
        </Card>
      )}

      {/* Sample Certificates */}
      <Card className="p-6 bg-muted/30 border-border/50 mt-8">
        <h3 className="font-semibold mb-3 text-sm">Try Sample Certificates:</h3>
        <div className="flex flex-wrap gap-2">
          <Button
            variant="secondary"
            size="sm"
            onClick={() => {
              setCertificateCode("CERT-2024-001")
              handleVerify()
            }}
            disabled={loading}
          >
            CERT-2024-001
          </Button>
          <Button
            variant="secondary"
            size="sm"
            onClick={() => {
              setCertificateCode("CERT-2024-002")
              handleVerify()
            }}
            disabled={loading}
          >
            CERT-2024-002
          </Button>
        </div>
      </Card>
    </div>
  )
}
