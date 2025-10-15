"use client"

import type React from "react"

import { useState } from "react"
import { Upload, Sparkles, Camera } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { cn } from "@/lib/utils"

interface AnimalMatch {
  animal: string
  confidence: number
  description: string
  emoji: string
}

interface UserInfo {
  name: string
  age: string
  country: string
}

export function AnimalMatcher() {
  const [image, setImage] = useState<string | null>(null)
  const [isAnalyzing, setIsAnalyzing] = useState(false)
  const [result, setResult] = useState<AnimalMatch | null>(null)
  const [userInfo, setUserInfo] = useState<UserInfo>({
    name: "",
    age: "",
    country: "",
  })

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      const reader = new FileReader()
      reader.onloadend = () => {
        setImage(reader.result as string)
        setResult(null)
      }
      reader.readAsDataURL(file)
    }
  }

  const analyzeImage = async () => {
    if (!image) return

    setIsAnalyzing(true)

    try {
      const response = await fetch("/api/analyze", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ image, userInfo }),
      })

      const data = await response.json()
      setResult(data)
    } catch (error) {
      console.error("[v0] Error analyzing image:", error)
    } finally {
      setIsAnalyzing(false)
    }
  }

  const reset = () => {
    setImage(null)
    setResult(null)
  }

  return (
    <div className="container mx-auto px-4 py-8 md:py-16">
      <div className="max-w-3xl mx-auto">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-primary/10 mb-4">
            <Camera className="w-8 h-8 text-primary" />
          </div>
          <h1 className="text-4xl md:text-5xl font-bold mb-4 text-balance">What Animal Are You?</h1>
          <p className="text-lg text-muted-foreground text-pretty">
            Upload a selfie and discover which animal you most resemble!
          </p>
        </div>

        {/* Main Card */}
        <Card className="p-6 md:p-8">
          {!image ? (
            // Upload State
            <div className="space-y-6">
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="name">Name</Label>
                  <Input
                    id="name"
                    type="text"
                    placeholder="Enter your name"
                    value={userInfo.name}
                    onChange={(e) => setUserInfo({ ...userInfo, name: e.target.value })}
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="age">Age</Label>
                    <Input
                      id="age"
                      type="number"
                      placeholder="Your age"
                      value={userInfo.age}
                      onChange={(e) => setUserInfo({ ...userInfo, age: e.target.value })}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="country">Country</Label>
                    <Input
                      id="country"
                      type="text"
                      placeholder="Your country"
                      value={userInfo.country}
                      onChange={(e) => setUserInfo({ ...userInfo, country: e.target.value })}
                    />
                  </div>
                </div>
              </div>

              <label
                htmlFor="image-upload"
                className={cn(
                  "flex flex-col items-center justify-center w-full h-64 md:h-80",
                  "border-2 border-dashed rounded-lg cursor-pointer",
                  "bg-muted/30 hover:bg-muted/50 transition-colors",
                  "border-border hover:border-primary/50",
                )}
              >
                <div className="flex flex-col items-center justify-center gap-4">
                  <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center">
                    <Upload className="w-8 h-8 text-primary" />
                  </div>
                  <div className="text-center">
                    <p className="text-lg font-medium mb-1">Upload your selfie</p>
                    <p className="text-sm text-muted-foreground">Click to browse or drag and drop</p>
                  </div>
                </div>
                <input id="image-upload" type="file" className="hidden" accept="image/*" onChange={handleImageUpload} />
              </label>
            </div>
          ) : (
            // Image Preview & Results
            <div className="space-y-6">
              <div className="relative rounded-lg overflow-hidden bg-muted">
                <img
                  src={image || "/placeholder.svg"}
                  alt="Uploaded selfie"
                  className="w-full h-auto max-h-96 object-contain"
                />
              </div>

              {result ? (
                // Results Display
                <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
                  {userInfo.name && (
                    <div className="text-center pb-4 border-b border-border">
                      <p className="text-sm text-muted-foreground">
                        {userInfo.name}
                        {userInfo.age && `, ${userInfo.age} years old`}
                        {userInfo.country && ` from ${userInfo.country}`}
                      </p>
                    </div>
                  )}

                  <div className="text-center space-y-4">
                    <div className="text-6xl">{result.emoji}</div>
                    <div>
                      <h2 className="text-3xl font-bold mb-2">You're a {result.animal}!</h2>
                      <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-accent/10 text-accent text-sm font-medium">
                        <Sparkles className="w-4 h-4" />
                        {result.confidence}% match
                      </div>
                    </div>
                    <p className="text-muted-foreground text-pretty max-w-xl mx-auto">{result.description}</p>
                  </div>

                  <div className="flex gap-3">
                    <Button onClick={reset} variant="outline" className="flex-1 bg-transparent">
                      Try Another
                    </Button>
                    <Button
                      onClick={() => {
                        // Share functionality could be added here
                        alert("Share functionality coming soon!")
                      }}
                      className="flex-1"
                    >
                      Share Result
                    </Button>
                  </div>
                </div>
              ) : (
                // Analyze Button
                <div className="flex gap-3">
                  <Button onClick={reset} variant="outline" className="flex-1 bg-transparent">
                    Choose Different Photo
                  </Button>
                  <Button onClick={analyzeImage} disabled={isAnalyzing} className="flex-1">
                    {isAnalyzing ? (
                      <>
                        <Sparkles className="w-4 h-4 mr-2 animate-spin" />
                        Analyzing...
                      </>
                    ) : (
                      <>
                        <Sparkles className="w-4 h-4 mr-2" />
                        Find My Animal
                      </>
                    )}
                  </Button>
                </div>
              )}
            </div>
          )}
        </Card>

        {/* Footer Info */}
        <div className="mt-8 text-center text-sm text-muted-foreground">
          <p>Your photos are analyzed securely and never stored.</p>
        </div>
      </div>
    </div>
  )
}
