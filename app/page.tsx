import { SiteHeader } from "@/components/site-header"
import { Button } from "@/components/ui/button"
import { Upload, Search, Info } from "lucide-react"
import Link from "next/link"

export default function Home() {
  return (
    <div className="flex min-h-screen flex-col">
      <SiteHeader />
      <main className="flex-1">
        <section className="space-y-6 pb-8 pt-6 md:pb-12 md:pt-10 lg:py-32">
          <div className="container flex max-w-[64rem] flex-col items-center gap-4 text-center">
            <h1 className="font-heading text-3xl sm:text-5xl md:text-6xl lg:text-7xl">
              Ethical image data for the age of AI
            </h1>
            <p className="max-w-[42rem] leading-normal text-muted-foreground sm:text-xl sm:leading-8">
              Upload, manage, and license your images ethically for AI training. Join the movement for responsible AI development.
            </p>
            <div className="space-x-4">
              <Button size="lg" asChild>
                <Link href="/upload">
                  <Upload className="mr-2 h-4 w-4" />
                  Upload
                </Link>
              </Button>
              <Button size="lg" variant="outline" asChild>
                <Link href="/browse">
                  <Search className="mr-2 h-4 w-4" />
                  Browse Repos
                </Link>
              </Button>
              <Button size="lg" variant="outline" asChild>
                <Link href="/about">
                  <Info className="mr-2 h-4 w-4" />
                  Learn More
                </Link>
              </Button>
            </div>
          </div>
        </section>

        <section className="container space-y-6 py-8 dark:bg-transparent md:py-12 lg:py-24">
          <div className="mx-auto grid justify-center gap-4 sm:grid-cols-2 md:max-w-[64rem] md:grid-cols-3">
            <div className="relative overflow-hidden rounded-lg border bg-background p-2">
              <div className="flex h-[180px] flex-col justify-between rounded-md p-6">
                <div className="space-y-2">
                  <h3 className="font-bold">Upload & Organize</h3>
                  <p className="text-sm text-muted-foreground">
                    Create public or private repositories for your images with rich metadata.
                  </p>
                </div>
              </div>
            </div>
            <div className="relative overflow-hidden rounded-lg border bg-background p-2">
              <div className="flex h-[180px] flex-col justify-between rounded-md p-6">
                <div className="space-y-2">
                  <h3 className="font-bold">Ethical Licensing</h3>
                  <p className="text-sm text-muted-foreground">
                    License your images to AI companies while maintaining control and transparency.
                  </p>
                </div>
              </div>
            </div>
            <div className="relative overflow-hidden rounded-lg border bg-background p-2">
              <div className="flex h-[180px] flex-col justify-between rounded-md p-6">
                <div className="space-y-2">
                  <h3 className="font-bold">Quality Metrics</h3>
                  <p className="text-sm text-muted-foreground">
                    Track image quality and usage with our advanced EV scoring system.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>
    </div>
  )
}