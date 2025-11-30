import { cn } from '@/lib/utils'
import Image from 'next/image'

export const LawncareLogo = ({ className }: { className?: string }) => {
    return (
        <div className={cn('flex items-center gap-2', className)}>
            <div className="relative h-10 w-10 md:h-12 md:w-12 rounded-lg overflow-hidden">
                <Image
                    src="/img/GrandpaRon.png"
                    alt="Grandpa Ron's Logo"
                    fill
                    className="object-contain"
                    priority
                />
            </div>
            <span className="text-xl font-bold tracking-tight" style={{ fontFamily: 'var(--font-heading)' }}>
                <span className="text-green-600 dark:text-green-400">Grandpa</span>
                <span className="text-foreground"> Ron&apos;s</span>
            </span>
        </div>
    )
}

export const LawncareLogoIcon = ({ className }: { className?: string }) => {
    return (
        <div className={cn('relative size-8 rounded-lg overflow-hidden', className)}>
            <Image
                src="/img/GrandpaRon.png"
                alt="Grandpa Ron's Logo"
                fill
                className="object-contain"
            />
        </div>
    )
}
