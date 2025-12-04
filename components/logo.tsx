import { cn } from '@/lib/utils'
import Image from 'next/image'

export const Logo = ({ className }: { className?: string }) => {
    return (
        <div className={cn('relative h-8 w-8', className)}>
            {/* Light mode logo */}
            <Image
                src="/img/logo_light.png"
                alt="Grandpa Ron's Logo"
                fill
                className="object-contain dark:hidden"
                priority
            />
            {/* Dark mode logo */}
            <Image
                src="/img/logo_dark.png"
                alt="Grandpa Ron's Logo"
                fill
                className="object-contain hidden dark:block"
                priority
            />
        </div>
    )
}

export const LogoIcon = ({ className }: { className?: string }) => {
    return (
        <div className={cn('relative size-8', className)}>
            {/* Light mode logo */}
            <Image
                src="/img/logo_light.png"
                alt="Grandpa Ron's Logo"
                fill
                className="object-contain dark:hidden"
            />
            {/* Dark mode logo */}
            <Image
                src="/img/logo_dark.png"
                alt="Grandpa Ron's Logo"
                fill
                className="object-contain hidden dark:block"
            />
        </div>
    )
}

export const LogoStroke = ({ className }: { className?: string }) => {
    return (
        <div className={cn('relative size-7', className)}>
            {/* Light mode logo */}
            <Image
                src="/img/logo_light.png"
                alt="Grandpa Ron's Logo"
                fill
                className="object-contain dark:hidden"
            />
            {/* Dark mode logo */}
            <Image
                src="/img/logo_dark.png"
                alt="Grandpa Ron's Logo"
                fill
                className="object-contain hidden dark:block"
            />
        </div>
    )
}
