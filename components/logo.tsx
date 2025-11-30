import { cn } from '@/lib/utils'
import Image from 'next/image'

export const Logo = ({ className }: { className?: string }) => {
    return (
        <div className={cn('flex items-center gap-2', className)}>
            <div className="relative h-8 w-8 rounded-lg overflow-hidden">
                <Image
                    src="/img/logo.png"
                    alt="Grandpa Ron's Logo"
                    fill
                    className="object-contain"
                    priority
                />
            </div>
            <span className="text-lg font-bold tracking-tight" style={{ fontFamily: 'var(--font-heading)' }}>
                <span className="text-green-600 dark:text-green-400">Grandpa</span>
                <span className="text-foreground"> Ron&apos;s</span>
            </span>
        </div>
    )
}

export const LogoIcon = ({ className }: { className?: string }) => {
    return (
        <div className={cn('relative size-8 rounded-lg overflow-hidden', className)}>
            <Image
                src="/img/logo.png"
                alt="Grandpa Ron's Logo"
                fill
                className="object-contain"
            />
        </div>
    )
}

export const LogoStroke = ({ className }: { className?: string }) => {
    return (
        <div className={cn('relative size-7 w-7 rounded-lg overflow-hidden', className)}>
            <Image
                src="/img/logo.png"
                alt="Grandpa Ron's Logo"
                fill
                className="object-contain"
            />
        </div>
    )
}
