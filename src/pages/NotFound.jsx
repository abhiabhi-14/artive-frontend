import { Link } from 'react-router-dom'
import { Button } from '@/components/ui/button'
import { ArrowLeft, Camera } from 'lucide-react'

export default function NotFound() {
  return (
    <div className="min-h-screen flex items-center justify-center px-4 hero-mesh">
      <div className="text-center animate-fade-up">
        <div className="flex justify-center mb-6">
          <div className="w-16 h-16 rounded-2xl bg-yellow-500/10 border border-yellow-500/20 flex items-center justify-center">
            <Camera className="w-8 h-8 text-yellow-500/60" />
          </div>
        </div>
        <p className="font-display text-8xl font-bold text-yellow-500 text-glow mb-2">404</p>
        <h1 className="font-display text-2xl font-bold text-[#F0F0F0] mb-2">Page not found</h1>
        <p className="text-[#666] mb-8 max-w-sm mx-auto">
          The page you're looking for doesn't exist or has been moved.
        </p>
        <Link to="/">
          <Button variant="outline">
            <ArrowLeft className="w-4 h-4" /> Back to Home
          </Button>
        </Link>
      </div>
    </div>
  )
}
