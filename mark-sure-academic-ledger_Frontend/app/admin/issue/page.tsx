"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Upload, FileText, Download, CheckCircle2, Loader2 } from "lucide-react"
import Link from "next/link"
import Image from "next/image"
import { issueCertificate, type CertificateIssuanceResponse } from "@/lib/api"

export default function IssueePage() {
  const [issued, setIssued] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [formData, setFormData] = useState({
    studentName: "",
    institution: "",
    program: "",
    issueDate: "",
  })
  const [certificateFile, setCertificateFile] = useState<File | null>(null)
  const [generatedData, setGeneratedData] = useState<CertificateIssuanceResponse | null>(null)
  const [pdfBase64, setPdfBase64] = useState<string | null>(null)

  const handleIssue = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError(null)

    try {
      const response = await issueCertificate({
        studentName: formData.studentName,
        institution: formData.institution,
        program: formData.program,
        issueDate: formData.issueDate,
        certificateFile: certificateFile || undefined,
      })

      setGeneratedData(response)
      setPdfBase64(response.pdfBase64)
      setIssued(true)
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to issue certificate")
    } finally {
      setLoading(false)
    }
  }

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      setCertificateFile(file)
    }
  }

  const handleReset = () => {
    setIssued(false)
    setFormData({
      studentName: "",
      institution: "",
      program: "",
      issueDate: "",
    })
    setGeneratedData(null)
    setPdfBase64(null)
    setCertificateFile(null)
    setError(null)
  }

  if (issued) {
    return (
      <div className="container mx-auto px-4 py-16 max-w-3xl">
        <Card className="p-8 border-2 border-green-500/50 bg-green-500/5 animate-in fade-in slide-in-from-bottom-4 duration-500">
          <div className="text-center space-y-6">
            <div className="flex justify-center">
              <div className="w-16 h-16 rounded-full bg-green-500/10 flex items-center justify-center">
                <CheckCircle2 className="w-10 h-10 text-green-500" />
              </div>
            </div>

            <div>
              <h1 className="text-3xl font-bold text-green-500 mb-2">Certificate Issued Successfully</h1>
              <p className="text-muted-foreground">The certificate has been registered on the blockchain</p>
            </div>

            {generatedData && generatedData.record && (
              <div className="grid md:grid-cols-2 gap-6 pt-6 border-t border-border">
                <div className="space-y-4 text-left">
                  <div>
                    <Label className="text-muted-foreground text-xs uppercase tracking-wide">Student Name</Label>
                    <p className="text-lg font-semibold mt-1">{generatedData.record.studentName}</p>
                  </div>
                  <div>
                    <Label className="text-muted-foreground text-xs uppercase tracking-wide">Institution</Label>
                    <p className="text-lg font-semibold mt-1">{generatedData.record.institution}</p>
                  </div>
                  <div>
                    <Label className="text-muted-foreground text-xs uppercase tracking-wide">Program</Label>
                    <p className="text-lg font-semibold mt-1">{generatedData.record.program}</p>
                  </div>
                  <div>
                    <Label className="text-muted-foreground text-xs uppercase tracking-wide">Issue Date</Label>
                    <p className="text-lg font-semibold mt-1">{generatedData.record.issueDate}</p>
                  </div>
                </div>

                <div className="space-y-4 text-left">
                  <div>
                    <Label className="text-muted-foreground text-xs uppercase tracking-wide">Certificate Code</Label>
                    <p className="text-lg font-semibold mt-1 text-accent">{generatedData.record.certificateCode}</p>
                  </div>
                  <div>
                    <Label className="text-muted-foreground text-xs uppercase tracking-wide">Blockchain Hash</Label>
                    <p className="text-xs font-mono mt-1 break-all bg-background/50 p-2 rounded">
                      {generatedData.record.blockHash}
                    </p>
                  </div>
                  {generatedData.qrDataUrl && (
                    <div>
                      <Label className="text-muted-foreground text-xs uppercase tracking-wide mb-2 block">QR Code</Label>
                      <div className="bg-white p-4 rounded-lg inline-block">
                        <Image
                          src={generatedData.qrDataUrl}
                          alt="Certificate QR Code"
                          width={120}
                          height={120}
                          className="w-full max-w-[120px]"
                        />
                      </div>
                    </div>
                  )}
                </div>
              </div>
            )}

            <div className="flex flex-col sm:flex-row gap-3 pt-6">
              <Button 
                className="flex-1 bg-primary hover:bg-primary/90"
                onClick={() => {
                  if (pdfBase64) {
                    const link = document.createElement('a')
                    link.href = `data:application/pdf;base64,${pdfBase64}`
                    link.download = `certificate-${generatedData?.record?.certificateCode || 'cert'}.pdf`
                    link.click()
                  }
                }}
              >
                <Download className="w-4 h-4 mr-2" />
                Download PDF with QR
              </Button>
              {generatedData && generatedData.record && (
                <Link href={`/qr/${generatedData.record.certificateCode}`} className="flex-1">
                  <Button variant="outline" className="w-full bg-transparent">
                    <FileText className="w-4 h-4 mr-2" />
                    View QR Page
                  </Button>
                </Link>
              )}
              <Button variant="outline" onClick={handleReset} className="flex-1 bg-transparent">
                Issue Another
              </Button>
            </div>
          </div>
        </Card>
      </div>
    )
  }

  return (
    <div className="container mx-auto px-4 py-16 max-w-3xl">
      <div className="text-center space-y-4 mb-12 animate-in fade-in slide-in-from-top-4 duration-500">
        <h1 className="text-4xl font-bold tracking-tight">Issue Certificate</h1>
        <p className="text-muted-foreground text-lg">Register a new academic certificate on the blockchain</p>
      </div>

      <Card className="p-8 bg-card/50 backdrop-blur-sm border-border">
        <form onSubmit={handleIssue} className="space-y-6">
          <div className="grid md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <Label htmlFor="student-name">Student Name *</Label>
              <Input
                id="student-name"
                placeholder="Full name of student"
                required
                value={formData.studentName}
                onChange={(e) => setFormData({ ...formData, studentName: e.target.value })}
                className="bg-background/50"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="institution">Institution *</Label>
              <Input
                id="institution"
                placeholder="Name of institution"
                required
                value={formData.institution}
                onChange={(e) => setFormData({ ...formData, institution: e.target.value })}
                className="bg-background/50"
              />
            </div>
          </div>

          <div className="grid md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <Label htmlFor="program">Course / Program *</Label>
              <Input
                id="program"
                placeholder="e.g., BSc Computer Science"
                required
                value={formData.program}
                onChange={(e) => setFormData({ ...formData, program: e.target.value })}
                className="bg-background/50"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="issue-date">Issue Date *</Label>
              <Input
                id="issue-date"
                type="date"
                required
                value={formData.issueDate}
                onChange={(e) => setFormData({ ...formData, issueDate: e.target.value })}
                className="bg-background/50"
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="cert-upload">Upload Certificate PDF</Label>
            <label htmlFor="cert-upload">
              <div className="border-2 border-dashed border-border rounded-lg p-8 text-center hover:border-accent/50 transition-colors cursor-pointer bg-background/30">
                <Upload className="w-8 h-8 mx-auto mb-3 text-muted-foreground" />
                <p className="text-sm text-muted-foreground mb-1">Click to upload certificate document</p>
                <p className="text-xs text-muted-foreground">PDF format recommended</p>
                {certificateFile && (
                  <p className="text-xs text-accent mt-2">Selected: {certificateFile.name}</p>
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

          <Button 
            type="submit" 
            className="w-full bg-primary hover:bg-primary/90" 
            size="lg"
            disabled={loading}
          >
            {loading ? (
              <>
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                Issuing Certificate...
              </>
            ) : (
              <>
                <FileText className="w-4 h-4 mr-2" />
                Issue Certificate
              </>
            )}
          </Button>
        </form>
      </Card>
    </div>
  )
}
